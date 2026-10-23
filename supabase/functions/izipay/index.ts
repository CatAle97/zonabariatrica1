// =========================================================
// ZONA BARIÁTRICA — Cobro con tarjeta online (Izipay)
// ---------------------------------------------------------
// Esta es la "caja fuerte": vive en Supabase (no en la web)
// porque usa las claves secretas de Izipay. Hace 3 cosas:
//
//  1. accion "crear": recibe el carrito, CALCULA EL MONTO AQUÍ
//     (con los precios de zb-catalogo.js publicados en la web,
//     nunca con el monto que manda el navegador) y le pide a
//     Izipay un formToken para mostrar el formulario de tarjeta.
//  2. accion "validar": cuando el cliente termina de pagar, la
//     web manda la respuesta de Izipay y aquí se comprueba la
//     firma (clave HMAC) para confirmar que el pago es real.
//  3. IPN: Izipay avisa directo a esta función (servidor a
//     servidor) cada vez que un pago se aprueba o rechaza.
//  4. accion "pedido": registra un pedido "Yape al recibir"
//     (sin recargo, sin pasar por Izipay).
//  5. accion "pedidos_crm": le pasa al CRM los pedidos web
//     reales y las compras con tarjeta sin terminar.
//  6. accion "stock_crm" / "disponibilidad": el CRM marca qué
//     está agotado y la web lo muestra (y no deja pagarlo).
//  7. accion "reclamo": Libro de Reclamaciones virtual.
//
// Cada pedido confirmado (tarjeta pagada o Yape registrado) le
// avisa a Roberto por Slack y por correo (ver avisarPedido).
//
// Claves (Supabase → Edge Functions → Secrets), nunca en código:
//   IZIPAY_USUARIO, IZIPAY_CLAVE, IZIPAY_CLAVE_PUBLICA, IZIPAY_HMAC
//   Avisos (opcionales: si faltan, ese aviso simplemente no sale):
//   SLACK_BOT_TOKEN, SLACK_DM_CHANNEL, RESEND_API_KEY, AVISO_EMAIL
// =========================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const CATALOGO_URL = "https://www.zonabariatrica.com/zb-catalogo.js";
const IZIPAY_API = "https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(cuerpo: unknown, status = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

const r2 = (n: number) => Math.round(n * 100) / 100;

// ---------- Catálogo (con caché de 5 minutos) ----------
type Catalogo = {
  productos: any[];
  reglasCobro: any;
  tarifasDeliveryLima: Record<string, number>;
};
let cache: { datos: Catalogo; hasta: number } | null = null;

async function catalogo(): Promise<Catalogo> {
  if (cache && cache.hasta > Date.now()) return cache.datos;
  const res = await fetch(CATALOGO_URL + "?t=" + Date.now());
  if (!res.ok) throw new Error("No se pudo leer el catálogo (" + res.status + ")");
  const codigo = await res.text();
  // zb-catalogo.js es un script de la propia web: se ejecuta con un
  // "window" falso solo para leer sus datos.
  const datos = new Function(
    "window",
    codigo + ";return {productos, reglasCobro, tarifasDeliveryLima};",
  )({}) as Catalogo;
  cache = { datos, hasta: Date.now() + 5 * 60 * 1000 };
  return datos;
}

// Mismo cálculo que el checkout de la web (index.html → actualizarTotalForm).
async function calcularMonto(items: any[], zona: string, distrito: string, metodo = "tarjeta") {
  const { productos, reglasCobro, tarifasDeliveryLima } = await catalogo();
  if (!Array.isArray(items) || items.length === 0) throw new Error("El carrito está vacío.");
  await revisarAgotados(items, productos);
  let subtotal = 0;
  let unidadesBN = 0;
  const lineas = items.map((i) => {
    const p = productos.find((x) => x.id === i.id);
    const qty = Number(i.qty);
    if (!p) throw new Error("Producto no encontrado: " + i.id);
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) throw new Error("Cantidad inválida.");
    subtotal += p.precio * qty;
    if (p.eligibleForBnQuantityDiscount) unidadesBN += qty;
    return { id: p.id, nombre: p.nombre, qty, precio: p.precio, notas: String(i.notas || "").slice(0, 200) };
  });
  const tramo = reglasCobro.descuentoBN.tramos.find((t: any) => unidadesBN >= t.min);
  const descuento = tramo ? tramo.desc : 0;
  let envio: number;
  if (zona === "provincia") envio = reglasCobro.trasladoProvincia;
  else {
    envio = tarifasDeliveryLima[distrito];
    if (typeof envio !== "number") throw new Error("Elige un distrito de Lima válido.");
  }
  const base = subtotal - descuento + envio;
  const recargo = metodo === "tarjeta" ? r2(base * reglasCobro.recargoTarjeta) : 0;
  const total = r2(base + recargo);
  return { lineas, subtotal, descuento, envio, recargo, total };
}

// ---------- Firma (HMAC-SHA256 en hexadecimal) ----------
async function hmacHex(texto: string, clave: string) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(clave),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const firma = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(texto));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function registrarResultado(krAnswer: string) {
  const answer = JSON.parse(krAnswer);
  const orderId = answer?.orderDetails?.orderId;
  const tx = answer?.transactions?.[0] || {};
  const estado = answer?.orderStatus === "PAID" ? "pagado" : "rechazado";
  if (orderId) {
    await db.from("pagos_web").update({
      estado,
      izipay_uuid: tx.uuid || null,
      izipay_respuesta: answer,
      actualizado_en: new Date().toISOString(),
    }).eq("order_id", orderId);
    // La web (validar) y el IPN llegan casi a la vez: avisa solo el primero.
    if (estado === "pagado" && answer?.orderDetails?.mode !== "TEST") await avisarSiFalta(orderId);
  }
  // modo "TEST" = tarjeta de prueba, no es dinero real.
  const modo = answer?.orderDetails?.mode || "PRODUCTION";
  return { orderId, estado, modo, monto: (answer?.orderDetails?.orderTotalAmount || 0) / 100, uuid: tx.uuid || null };
}

// ---------- Acciones ----------
async function crear(body: any) {
  const usuario = Deno.env.get("IZIPAY_USUARIO");
  const clave = Deno.env.get("IZIPAY_CLAVE");
  // El formulario necesita "usuario:testpublickey_...". En el panel de Izipay a veces se
  // copia solo la parte después de los dos puntos: se completa con el usuario.
  const publicaCruda = (Deno.env.get("IZIPAY_CLAVE_PUBLICA") || "").trim();
  const clavePublica = publicaCruda && !publicaCruda.includes(":") && usuario ? usuario.trim() + ":" + publicaCruda : publicaCruda;
  if (!usuario || !clave || !clavePublica) return json({ error: "Pago con tarjeta no configurado todavía." }, 503);

  const zona = body.zona === "provincia" ? "provincia" : "lima";
  const distrito = String(body.distrito || "");
  const c = await calcularMonto(body.items, zona, distrito);

  const cliente = leerCliente(body);
  const falta = clienteIncompleto(cliente);
  if (falta) return json({ error: falta }, 400);

  const orderId = nuevoOrderId();
  const partes = cliente.nombre.trim().split(/\s+/);

  const res = await fetch(IZIPAY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(usuario + ":" + clave),
    },
    body: JSON.stringify({
      amount: Math.round(c.total * 100),
      currency: "PEN",
      orderId,
      customer: {
        email: cliente.email,
        billingDetails: {
          firstName: partes[0] || "",
          lastName: partes.slice(1).join(" "),
          // El DNI NO se manda a Izipay: hasta el 15-10-2026 nunca viajó y el
          // cobro funciona así. Se guarda en pagos_web y sale en el aviso.
          country: "PE",
        },
      },
    }),
  });
  const r = await res.json();
  if (r.status !== "SUCCESS") {
    console.error("Izipay CreatePayment falló", JSON.stringify(r));
    return json({
      error: "No se pudo iniciar el pago. Intenta de nuevo o paga con Yape.",
      // Código de Izipay (no es secreto): ayuda a diagnosticar sin entrar a los logs.
      detalle: [r?.answer?.errorCode, r?.answer?.errorMessage, r?.answer?.detailedErrorMessage].filter(Boolean).join(" · "),
    }, 502);
  }

  await db.from("pagos_web").insert({
    order_id: orderId,
    metodo: "tarjeta",
    monto: c.total,
    zona,
    distrito: zona === "lima" ? distrito : null,
    cliente,
    items: c.lineas,
    desglose: { subtotal: c.subtotal, descuento: c.descuento, envio: c.envio, recargo: c.recargo, total: c.total },
  });

  return json({ formToken: r.answer.formToken, publicKey: clavePublica, orderId, ...c });
}

function nuevoOrderId() {
  return "ZB-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomUUID().slice(0, 4).toUpperCase();
}

function leerCliente(body: any) {
  return {
    nombre: String(body.nombre || "").trim().slice(0, 120),
    dni: String(body.dni || "").replace(/\D/g, "").slice(0, 12),
    email: String(body.email || "").trim().slice(0, 120),
    telefono: String(body.telefono || "").replace(/[^\d+ ]/g, "").trim().slice(0, 20),
    direccion: String(body.direccion || "").trim().slice(0, 250),
    // Enlace de Google Maps (opcional, solo Lima). Cualquier otra cosa se descarta.
    ubicacion: /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(String(body.ubicacion || "").trim())
      ? String(body.ubicacion).trim().slice(0, 300) : "",
  };
}

function clienteIncompleto(c: ReturnType<typeof leerCliente>) {
  if (!c.nombre) return "Escribe tu nombre.";
  if (!c.direccion) return "Escribe tu dirección.";
  if (c.telefono.replace(/\D/g, "").length < 9) return "Escribe tu número de celular.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) return "Escribe un correo válido.";
  return "";
}

// Pedido "Yape al recibir": el monto también se calcula aquí (sin el 4%).
async function pedidoYape(body: any) {
  const zona = body.zona === "provincia" ? "provincia" : "lima";
  const distrito = String(body.distrito || "");
  const c = await calcularMonto(body.items, zona, distrito, "yape");
  const cliente = leerCliente(body);
  const falta = clienteIncompleto(cliente);
  if (falta) return json({ error: falta }, 400);
  const orderId = nuevoOrderId();
  const { error } = await db.from("pagos_web").insert({
    order_id: orderId,
    metodo: "yape",
    estado: "por_cobrar",
    monto: c.total,
    zona,
    distrito: zona === "lima" ? distrito : null,
    cliente,
    items: c.lineas,
    desglose: { subtotal: c.subtotal, descuento: c.descuento, envio: c.envio, recargo: 0, total: c.total },
  });
  if (error) throw new Error("No se pudo registrar el pedido. Intenta de nuevo.");
  await avisarSiFalta(orderId);
  return json({ orderId, ...c });
}

// ---------- Aviso a Roberto (Slack + correo) ----------
async function avisarSiFalta(orderId: string) {
  // Marca "notificado" solo si nadie lo hizo antes: así nunca llega doble.
  const { data } = await db.from("pagos_web")
    .update({ notificado_en: new Date().toISOString() })
    .eq("order_id", orderId).is("notificado_en", null)
    .select().maybeSingle();
  if (!data) return;
  try {
    await avisarPedido(data);
  } catch (e) {
    console.error("Aviso de pedido falló", e);
  }
}

function textoPedido(p: any) {
  const c = p.cliente || {};
  const d = p.desglose || {};
  const monto = "S/ " + Number(p.monto).toFixed(2);
  const lineas = (p.items || []).map((i: any) =>
    "• " + i.qty + "x " + i.nombre + " — S/ " + i.precio * i.qty + (i.notas ? " (" + i.notas + ")" : "")
  ).join("\n");
  const destino = p.zona === "provincia"
    ? "Provincia, vía Shalom: " + c.direccion
    : c.direccion + " — " + (p.distrito || "");
  const celular = String(c.telefono || "").replace(/\D/g, "").replace(/^(9\d{8})$/, "51$1");
  const titulo = p.metodo === "tarjeta"
    ? "🛒 Pedido " + p.order_id + " — PAGADO con tarjeta (" + monto + ")"
    : p.zona === "provincia"
      // Provincia al contado (2026-10-23): se cobra ANTES de despachar a Shalom.
      ? "🛒 Pedido " + p.order_id + " — YAPE ANTES DEL ENVÍO (cobrar " + monto + " y recién despachar)"
      : "🛒 Pedido " + p.order_id + " — YAPE AL RECIBIR (cobrar " + monto + ")";
  const cuerpo = [
    lineas,
    "",
    "Subtotal: S/ " + d.subtotal + (d.descuento ? " · Descuento: -S/ " + d.descuento : "") +
      " · Envío: S/ " + d.envio + (d.recargo ? " · Recargo tarjeta: S/ " + d.recargo : ""),
    "TOTAL: " + monto,
    "",
    "Cliente: " + c.nombre,
    "DNI: " + (c.dni || "—"),
    "Celular: " + c.telefono + " (https://wa.me/" + celular + ")",
    "Correo: " + c.email,
    "Entrega: " + destino,
    ...(c.ubicacion ? ["Ubicación: " + c.ubicacion] : []),
  ].join("\n");
  return { titulo, cuerpo };
}

async function avisarPedido(p: any) {
  const { titulo, cuerpo } = textoPedido(p);
  await avisarTexto(titulo, cuerpo);
}

async function avisarTexto(titulo: string, cuerpo: string) {
  const tareas: Promise<unknown>[] = [];
  const slack = Deno.env.get("SLACK_BOT_TOKEN");
  const canal = Deno.env.get("SLACK_DM_CHANNEL");
  if (slack && canal) {
    tareas.push(fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", Authorization: "Bearer " + slack },
      body: JSON.stringify({ channel: canal, text: "*" + titulo + "*\n" + cuerpo }),
    }).then((r) => r.json()).then((r) => { if (!r.ok) console.error("Slack:", r.error); }));
  }
  const resend = Deno.env.get("RESEND_API_KEY");
  const correo = Deno.env.get("AVISO_EMAIL");
  if (resend && correo) {
    tareas.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + resend },
      body: JSON.stringify({ from: "Zona Bariatrica <onboarding@resend.dev>", to: [correo], subject: titulo, text: cuerpo }),
    }).then(async (r) => { if (!r.ok) console.error("Correo:", await r.text()); }));
  }
  await Promise.all(tareas);
}

async function validar(body: any) {
  const hmac = Deno.env.get("IZIPAY_HMAC");
  if (!hmac) return json({ valido: false, error: "Falta configurar la clave HMAC." }, 503);
  const krAnswer = String(body.krAnswer || "");
  const ok = (await hmacHex(krAnswer, hmac)) === String(body.krHash || "");
  if (!ok) return json({ valido: false }, 400);
  return json({ valido: true, ...(await registrarResultado(krAnswer)) });
}

// IPN: Izipay → esta función. Se firma con la CONTRASEÑA (no con la HMAC).
async function ipn(req: Request) {
  const form = await req.formData();
  const krAnswer = String(form.get("kr-answer") || "");
  const krHash = String(form.get("kr-hash") || "");
  // Los pagos que no salen del checkout de la web (p. ej. links de pago
  // creados en el panel de Izipay) avisan en otro formato (campos vads_*).
  // No son pedidos de la web: se confirma recepción para que Izipay no
  // marque error ni reintente. El pago igual queda en el panel de Izipay.
  if (!krAnswer) return new Response("OK (pago fuera de la web)", { status: 200 });
  const tipo = String(form.get("kr-hash-key") || "password");
  const clave = tipo === "sha256_hmac" ? Deno.env.get("IZIPAY_HMAC") : Deno.env.get("IZIPAY_CLAVE");
  if (!clave || (await hmacHex(krAnswer, clave)) !== krHash) {
    return new Response("Firma inválida", { status: 400 });
  }
  const r = await registrarResultado(krAnswer);
  return new Response("OK " + r.estado, { status: 200 });
}

// ---------- Bandeja de pedidos web del CRM ----------
// El CRM (genre18.github.io/Zona-Bariatrica-CMR) vive en OTRO proyecto de Supabase.
// Para leer los pedidos manda la sesión de su usuario logueado; aquí se pregunta a ese
// proyecto si la sesión es válida. Así no hace falta ninguna clave nueva en el CRM
// (su repo es público). La clave de abajo es la pública (anon) del CRM.
const CRM_URL = "https://zuispovrhevalznsrdax.supabase.co";
const CRM_CLAVE_PUBLICA = "sb_publishable_PhNcFR421xTZxfXhSr6wfg_t1HJA2rf";
const BANDEJA_DESDE = "2026-10-17T05:00:00Z"; // mismo arranque que el tablero de Envíos del CRM

async function pedidosCrm(body: any) {
  if (!(await sesionCrmValida(String(body.token || "")))) return json({ error: "Sesión del CRM no válida." }, 401);
  const { data, error } = await db.from("pagos_web")
    .select("order_id,creado_en,metodo,estado,monto,zona,distrito,cliente,items,desglose,izipay_respuesta")
    .gte("creado_en", BANDEJA_DESDE)
    .order("creado_en", { ascending: true });
  if (error) throw new Error("No se pudieron leer los pedidos web.");
  // Solo pedidos reales: Yape al recibir, o tarjeta PAGADA que no sea de prueba.
  // Los "creado" de tarjeta son intentos que no terminaron de pagar.
  const pedidos = (data || []).filter((p: any) =>
    p.metodo === "yape"
      ? p.estado === "por_cobrar"
      : p.estado === "pagado" && p.izipay_respuesta?.orderDetails?.mode !== "TEST"
  ).map(({ izipay_respuesta, ...p }: any) => p);
  return json({ pedidos, intentos: await intentosSinTerminar() });
}

// "Compras sin terminar": intentos de pago con tarjeta que no se completaron, para escribirle
// al cliente. Se quitan los de quien después compró de verdad (mismo celular) y, si una persona
// intentó varias veces, queda solo el último intento. Los de los últimos 30 min no salen
// (puede estar pagando en ese momento).
const INTENTOS_DESDE = "2026-10-10T05:00:00Z";
async function intentosSinTerminar() {
  const { data } = await db.from("pagos_web")
    .select("order_id,creado_en,metodo,estado,monto,zona,distrito,cliente,items,izipay_respuesta")
    .gte("creado_en", INTENTOS_DESDE)
    .order("creado_en", { ascending: true });
  const filas = data || [];
  const cel = (p: any) => String(p.cliente?.telefono || "").replace(/\D/g, "").slice(-9);
  const real = (p: any) =>
    p.metodo === "yape" ? p.estado === "por_cobrar" : p.estado === "pagado" && p.izipay_respuesta?.orderDetails?.mode !== "TEST";
  const limite = Date.now() - 30 * 60 * 1000;
  const porCelular = new Map<string, any>();
  for (const p of filas) {
    if (p.metodo !== "tarjeta" || real(p) || !cel(p)) continue;
    if (new Date(p.creado_en).getTime() > limite) continue;
    const compro = filas.some((q: any) => real(q) && cel(q) === cel(p) && q.creado_en >= p.creado_en);
    if (compro) continue;
    porCelular.set(cel(p), p); // queda el último intento
  }
  return [...porCelular.values()].map(({ izipay_respuesta, ...p }: any) => p);
}

// ---------- Disponibilidad (stock del CRM → "Agotado" en la web) ----------
// El CRM manda qué productos de la web están agotados (ids de zb-catalogo.js) y, por producto,
// qué sabores no se pueden elegir (ofertas/packs con selector de sabor): { agotados, sabores }. La web lo lee con "disponibilidad" y el cobro lo
// respeta en calcularMonto: no se puede pagar algo agotado aunque la página esté desactualizada.
async function sesionCrmValida(token: string) {
  if (!token) return false;
  const r = await fetch(CRM_URL + "/auth/v1/user", {
    headers: { apikey: CRM_CLAVE_PUBLICA, Authorization: "Bearer " + token },
  });
  return r.ok;
}

async function stockCrm(body: any) {
  if (!(await sesionCrmValida(String(body.token || "")))) return json({ error: "Sesión del CRM no válida." }, 401);
  const lista = (x: any) => Array.isArray(x) ? x.map((s) => String(s).slice(0, 40)).slice(0, 200) : [];
  const sabores: Record<string, string[]> = {};
  for (const [id, l] of Object.entries(body.sabores || {}).slice(0, 100)) sabores[String(id).slice(0, 40)] = lista(l).map((s) => s.toLowerCase());
  // masVendidos: ids de la web ordenados por unidades vendidas en el CRM (últimos 60 días).
  const valor = { agotados: lista(body.agotados), sabores, masVendidos: lista(body.masVendidos).slice(0, 10) };
  const { error } = await db.from("estado_web").upsert({ clave: "disponibilidad", valor, actualizado_en: new Date().toISOString() });
  if (error) throw new Error("No se pudo guardar la disponibilidad.");
  cacheDisp = null;
  return json({ ok: true });
}

let cacheDisp: { datos: { agotados: string[]; sabores: Record<string, string[]>; masVendidos: string[] }; hasta: number } | null = null;
async function leerDisponibilidad() {
  if (cacheDisp && cacheDisp.hasta > Date.now()) return cacheDisp.datos;
  const { data } = await db.from("estado_web").select("valor").eq("clave", "disponibilidad").maybeSingle();
  const datos = { agotados: data?.valor?.agotados || [], sabores: data?.valor?.sabores || {}, masVendidos: data?.valor?.masVendidos || [] };
  cacheDisp = { datos, hasta: Date.now() + 60 * 1000 };
  return datos;
}

async function disponibilidad() {
  return json(await leerDisponibilidad());
}

// Lanza error si el carrito trae algo agotado (producto o sabor elegido).
async function revisarAgotados(items: any[], productos: any[]) {
  const { agotados, sabores: saboresPorId } = await leerDisponibilidad();
  for (const i of items || []) {
    if (agotados.includes(i.id)) throw new Error("Lo sentimos: " + (productos.find((x) => x.id === i.id)?.nombre || "un producto") + " se acaba de agotar. Quítalo del carrito para continuar.");
    const sabores = String(i.notas || "").split("·").map((s) => (s.split(":")[1] || "").trim().toLowerCase()).filter(Boolean);
    const sinStock = sabores.find((s) => (saboresPorId[i.id] || []).includes(s));
    if (sinStock) throw new Error("Lo sentimos: el sabor " + sinStock + " se agotó. Elige otro sabor para continuar.");
  }
}

// ---------- Libro de Reclamaciones virtual ----------
// Guarda la hoja con un código correlativo (LR-2026-000001) y avisa a Roberto por Slack y correo
// (mismo canal que los pedidos). La web muestra la hoja completa para que el cliente la guarde.
const txt = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
async function reclamo(body: any) {
  const consumidor = {
    nombre: txt(body.nombre, 120), documento: txt(body.documento, 20), domicilio: txt(body.domicilio, 250),
    telefono: txt(body.telefono, 20), email: txt(body.email, 120), apoderado: txt(body.apoderado, 120),
  };
  const bien = { tipo: body.bienTipo === "servicio" ? "servicio" : "producto", monto: Number(body.monto) || 0, descripcion: txt(body.descripcion, 300) };
  const tipo = body.tipo === "queja" ? "queja" : "reclamo";
  const detalle = txt(body.detalle, 3000);
  const pedido = txt(body.pedido, 1500);
  if (!consumidor.nombre || !consumidor.documento || !consumidor.domicilio || !detalle || !pedido) {
    return json({ error: "Completa los campos obligatorios." }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(consumidor.email)) return json({ error: "Escribe un correo válido." }, 400);
  const temporal = "tmp-" + crypto.randomUUID();
  const { data, error } = await db.from("libro_reclamaciones")
    .insert({ codigo: temporal, tipo, consumidor, bien, detalle, pedido }).select("numero,creado_en").single();
  if (error || !data) throw new Error("No se pudo registrar. Intenta de nuevo.");
  const codigo = "LR-" + new Date(data.creado_en).getFullYear() + "-" + String(data.numero).padStart(6, "0");
  await db.from("libro_reclamaciones").update({ codigo }).eq("numero", data.numero);
  const titulo = "📕 Libro de Reclamaciones " + codigo + " — " + tipo.toUpperCase() + " (responder en máx. 15 días hábiles)";
  const cuerpo = [
    "Consumidor: " + consumidor.nombre + " · Doc: " + consumidor.documento,
    "Domicilio: " + consumidor.domicilio,
    "Celular: " + (consumidor.telefono || "—") + " · Correo: " + consumidor.email,
    consumidor.apoderado ? "Padre/madre/apoderado: " + consumidor.apoderado : "",
    "Bien: " + bien.tipo + " — " + (bien.descripcion || "—") + " · Monto: S/ " + bien.monto,
    "", "Detalle: " + detalle, "", "Pedido del consumidor: " + pedido,
  ].filter(Boolean).join("\n");
  try { await avisarTexto(titulo, cuerpo); } catch (e) { console.error("Aviso de reclamo falló", e); }
  return json({ codigo, fecha: data.creado_en });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Zona Bariátrica — pagos", { status: 200 });
  try {
    const tipo = req.headers.get("content-type") || "";
    if (tipo.includes("application/x-www-form-urlencoded") || tipo.includes("multipart/form-data")) {
      return await ipn(req);
    }
    const body = await req.json();
    if (body.accion === "crear") return await crear(body);
    if (body.accion === "validar") return await validar(body);
    if (body.accion === "pedido") return await pedidoYape(body);
    if (body.accion === "pedidos_crm") return await pedidosCrm(body);
    if (body.accion === "stock_crm") return await stockCrm(body);
    if (body.accion === "disponibilidad") return await disponibilidad();
    if (body.accion === "reclamo") return await reclamo(body);
    return json({ error: "Acción desconocida" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message || "Error inesperado" }, 400);
  }
});
