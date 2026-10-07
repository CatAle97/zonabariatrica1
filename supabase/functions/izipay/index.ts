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
//
// Claves (Supabase → Edge Functions → Secrets), nunca en código:
//   IZIPAY_USUARIO, IZIPAY_CLAVE, IZIPAY_CLAVE_PUBLICA, IZIPAY_HMAC
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
async function calcularMonto(items: any[], zona: string, distrito: string) {
  const { productos, reglasCobro, tarifasDeliveryLima } = await catalogo();
  if (!Array.isArray(items) || items.length === 0) throw new Error("El carrito está vacío.");
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
  const recargo = r2(base * reglasCobro.recargoTarjeta);
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

  const cliente = {
    nombre: String(body.nombre || "").slice(0, 120),
    dni: String(body.dni || "").slice(0, 15),
    email: String(body.email || "").slice(0, 120),
    direccion: String(body.direccion || "").slice(0, 250),
  };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cliente.email)) return json({ error: "Escribe un correo válido." }, 400);

  const orderId = "ZB-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomUUID().slice(0, 4).toUpperCase();
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
          identityType: cliente.dni ? "DNI" : undefined,
          identityCode: cliente.dni || undefined,
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
    monto: c.total,
    zona,
    distrito: zona === "lima" ? distrito : null,
    cliente,
    items: c.lineas,
    desglose: { subtotal: c.subtotal, descuento: c.descuento, envio: c.envio, recargo: c.recargo, total: c.total },
  });

  return json({ formToken: r.answer.formToken, publicKey: clavePublica, orderId, ...c });
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
    return json({ error: "Acción desconocida" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message || "Error inesperado" }, 400);
  }
});
