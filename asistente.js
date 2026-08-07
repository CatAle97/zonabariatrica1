/* =========================================================
   ASISTENTE ZONA BARIÁTRICA — chat de preguntas frecuentes
   Autocontenido: crea sus propios estilos, su HTML y su lógica.
   Se activa agregando una sola línea antes de </body>:
       <script src="asistente.js"></script>

   Zoe responde por INTENCIONES: el usuario escribe libremente
   y el motor busca la respuesta en zoe-conocimiento.js.

   NO usa internet ni modelos de lenguaje: todas las respuestas
   están escritas y aprobadas por Zona Bariátrica.

   PARA CAMBIAR UNA RESPUESTA O UN PRECIO: se edita
   zoe-conocimiento.js. Este archivo no hace falta tocarlo.
   ========================================================= */
(function () {
  'use strict';

  var WA = '51961841069';

  function wa(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }

  /* ---------------------------------------------------------
     Las respuestas de Zoe ya NO viven aquí: están en
     zoe-conocimiento.js, que se edita sin tocar este archivo.
     Este solo contiene el motor del chat y su interfaz.
     --------------------------------------------------------- */

  /* =========================================================
     ESTILOS
     ========================================================= */
  /* Paleta: AZUL corporativo como color principal (igual que la
     tienda) y VERDE reservado a estados positivos —el punto de
     "disponible" y el botón de WhatsApp—. Antes el panel era
     verde entero, lo que lo hacía parecer un widget ajeno. */
  var C = {
    azul: '#2563EB', azulOsc: '#1D4ED8', azulClaro: '#EFF6FF',
    verde: '#16A34A', verdeWa: '#25D366',
    texto: '#111827', suave: '#6B7280', tenue: '#9CA3AF',
    borde: '#E5E7EB', fondo: '#F8FAFC'
  };

  var CSS = ''
    /* ---------- BOTÓN FLOTANTE (avatar ya existente) ---------- */
    /* Círculo limpio: borde blanco de 2px y una sombra apenas
       perceptible. Nada de contornos oscuros.
       (La imagen zoe.png viene recortada en círculo con el fondo
       transparente; antes tenía las esquinas negras y se veía un
       anillo oscuro alrededor del avatar.) */
    + '#zb-fab{position:fixed;bottom:24px;left:24px;z-index:998;width:64px;height:64px;border-radius:50%;'
    + 'background:#fff;border:2px solid #fff;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.08);'
    + 'display:flex;align-items:center;justify-content:center;padding:0;overflow:visible;'
    + 'transition:transform .2s ease,box-shadow .2s ease;-webkit-tap-highlight-color:transparent}'
    /* La foto llena el botón; el recorte circular lo da el propio botón. */
    + '.zb-fab-foto{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;'
    + 'background:#fff}'
    /* Punto verde de "disponible": sugiere que hay alguien al otro lado. */
    + '#zb-fab::after{content:"";position:absolute;right:2px;bottom:4px;width:14px;height:14px;'
    + 'border-radius:50%;background:' + C.verde + ';border:2.5px solid #fff}'
    + '#zb-fab:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(0,0,0,.14)}'
    + '#zb-fab:active{transform:translateY(-1px)}'
    + '#zb-fab:focus-visible{outline:3px solid rgba(37,99,235,.45);outline-offset:3px}'
    + '#zb-fab.oculto{display:none}'
    /* Etiqueta "Habla con Zoe": aparece al pasar el cursor o al
       enfocar con teclado. En móvil no se muestra (no hay hover). */
    + '.zb-fab-tip{position:fixed;bottom:44px;left:96px;z-index:997;background:' + C.texto + ';color:#fff;'
    + 'padding:7px 12px;border-radius:8px;font-size:12.5px;font-weight:600;white-space:nowrap;'
    + 'font-family:Inter,system-ui,-apple-system,sans-serif;pointer-events:none;'
    + 'opacity:0;transform:translateX(-6px);transition:opacity .2s ease,transform .2s ease}'
    + '.zb-fab-tip::before{content:"";position:absolute;left:-5px;top:50%;margin-top:-5px;'
    + 'border:5px solid transparent;border-right-color:' + C.texto + '}'
    + '#zb-fab:hover + .zb-fab-tip,#zb-fab:focus-visible + .zb-fab-tip{opacity:1;transform:translateX(0)}'

    /* ---------- PANEL ---------- */
    + '#zb-panel{position:fixed;bottom:24px;left:24px;z-index:999;width:368px;max-width:calc(100vw - 32px);'
    + 'height:560px;max-height:calc(100vh - 48px);background:#fff;border-radius:18px;'
    + 'box-shadow:0 20px 48px rgba(16,24,40,.22),0 4px 12px rgba(16,24,40,.08);'
    + 'display:none;flex-direction:column;overflow:hidden;border:1px solid ' + C.borde + ';'
    + 'font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
    /* Apertura y cierre: fade + leve subida + escala mínima. */
    + '#zb-panel.abierto{display:flex;animation:zbEntra .24s cubic-bezier(.16,1,.3,1)}'
    + '#zb-panel.cerrando{animation:zbSale .2s ease forwards}'
    + '@keyframes zbEntra{from{opacity:0;transform:translateY(12px) scale(.98)}'
    + 'to{opacity:1;transform:none}}'
    + '@keyframes zbSale{from{opacity:1;transform:none}'
    + 'to{opacity:0;transform:translateY(10px) scale(.985)}}'

    /* ---------- CABECERA ---------- */
    + '.zb-head{background:' + C.azul + ';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:11px}'
    + '.zb-head-av{width:42px;height:42px;border-radius:50%;flex:none;position:relative;'
    + 'border:2px solid rgba(255,255,255,.85);background:#fff}'
    + '.zb-head-av img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}'
    + '.zb-head-txt{flex:1;min-width:0}'
    + '.zb-head-t{font-size:16px;font-weight:700;line-height:1.25;letter-spacing:-.01em}'
    + '.zb-head-s{font-size:11.5px;opacity:.85;font-weight:400;line-height:1.3}'
    /* Estado "disponible": único uso del verde en la cabecera. */
    + '.zb-estado{display:inline-flex;align-items:center;gap:5px;margin-top:3px;'
    + 'font-size:11px;font-weight:500;opacity:.95}'
    + '.zb-punto{width:7px;height:7px;border-radius:50%;background:#4ADE80;flex:none;'
    + 'box-shadow:0 0 0 0 rgba(74,222,128,.7);animation:zbLatido 2.4s ease-out infinite}'
    + '@keyframes zbLatido{0%{box-shadow:0 0 0 0 rgba(74,222,128,.6)}'
    + '70%{box-shadow:0 0 0 6px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}'
    + '.zb-x{background:rgba(255,255,255,.14);border:none;color:#fff;font-size:20px;cursor:pointer;'
    + 'line-height:1;width:32px;height:32px;border-radius:50%;flex:none;display:flex;'
    + 'align-items:center;justify-content:center;transition:background .2s ease}'
    + '.zb-x:hover{background:rgba(255,255,255,.26)}'
    + '.zb-x:focus-visible{outline:2px solid #fff;outline-offset:2px}'

    /* ---------- CUERPO ---------- */
    + '.zb-body{flex:1;overflow-y:auto;padding:16px;background:' + C.fondo + ';'
    + '-webkit-overflow-scrolling:touch;overscroll-behavior:contain}'

    /* Fila de mensaje: avatar + burbuja alineados a la izquierda. */
    + '.zb-fila{display:flex;gap:8px;align-items:flex-end;margin-bottom:12px;'
    + 'animation:zbMsg .26s ease both}'
    + '.zb-fila.user{flex-direction:row-reverse}'
    + '@keyframes zbMsg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'
    + '.zb-av{width:28px;height:28px;border-radius:50%;flex:none;object-fit:cover;'
    + 'border:1.5px solid #fff;box-shadow:0 1px 3px rgba(16,24,40,.12)}'
    + '.zb-fila.user .zb-av{display:none}'

    + '.zb-msg{background:#fff;border-radius:14px 14px 14px 4px;padding:11px 14px;font-size:14px;'
    + 'line-height:1.6;color:' + C.texto + ';box-shadow:0 1px 3px rgba(16,24,40,.07);'
    + 'max-width:calc(100% - 40px);border:1px solid ' + C.borde + '}'
    /* Mensajes del usuario: azul corporativo, a la derecha. */
    + '.zb-msg.user{background:' + C.azul + ';color:#fff;border-color:' + C.azul + ';'
    + 'border-radius:14px 14px 4px 14px;box-shadow:none;max-width:82%}'
    + '.zb-msg b{font-weight:700}'
    + '.zb-msg.user b{font-weight:600}'
    + '.zb-nota{margin-top:10px;padding-top:9px;border-top:1px solid ' + C.borde + ';font-size:12px;'
    + 'color:' + C.suave + ';line-height:1.5}'

    /* ---------- "ZOE ESTÁ ESCRIBIENDO" ---------- */
    + '.zb-typing{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid ' + C.borde + ';'
    + 'border-radius:14px 14px 14px 4px;padding:10px 13px;box-shadow:0 1px 3px rgba(16,24,40,.07)}'
    + '.zb-typing-t{font-size:12.5px;color:' + C.suave + ';font-weight:500}'
    + '.zb-dots{display:inline-flex;gap:3px}'
    + '.zb-dots i{width:5px;height:5px;border-radius:50%;background:' + C.tenue + ';display:block;'
    + 'animation:zbPunto 1.3s ease-in-out infinite}'
    + '.zb-dots i:nth-child(2){animation-delay:.18s}'
    + '.zb-dots i:nth-child(3){animation-delay:.36s}'
    + '@keyframes zbPunto{0%,60%,100%{opacity:.3;transform:translateY(0)}'
    + '30%{opacity:1;transform:translateY(-3px)}}'

    /* ---------- SUGERENCIAS Y RESPUESTAS RÁPIDAS ----------
       Chips discretos: acompañan, no bloquean. El usuario
       siempre puede escribir en vez de pulsarlos. */
    + '.zb-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px 36px}'
    + '.zb-chip{background:#fff;border:1.5px solid ' + C.borde + ';color:' + C.texto + ';'
    + 'border-radius:999px;padding:8px 13px;font-size:12.5px;font-weight:500;cursor:pointer;'
    + 'font-family:inherit;line-height:1.3;text-align:left;min-height:34px;'
    + 'transition:background .2s ease,border-color .2s ease,color .2s ease}'
    + '.zb-chip:hover{background:' + C.azulClaro + ';border-color:' + C.azul + ';color:' + C.azulOsc + '}'
    + '.zb-chip:active{transform:scale(.97)}'
    + '.zb-chip:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:2px}'

    /* ---------- PRODUCTOS DENTRO DEL CHAT ---------- */
    + '.zb-prods{display:flex;flex-direction:column;gap:7px;margin:0 0 12px 36px}'
    + '.zb-prod{display:flex;align-items:center;gap:10px;padding:8px;background:#fff;'
    + 'border:1px solid ' + C.borde + ';border-radius:12px}'
    + '.zb-prod img{width:44px;height:44px;object-fit:contain;border-radius:8px;'
    + 'background:' + C.fondo + ';flex:none}'
    + '.zb-prod-txt{flex:1;min-width:0}'
    + '.zb-prod-nom{font-size:12px;font-weight:600;color:' + C.texto + ';line-height:1.35;'
    + 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
    + '.zb-prod-precio{font-size:12.5px;font-weight:700;color:' + C.azul + ';margin-top:2px}'
    + '.zb-prod-btn{flex:none;padding:8px 14px;border-radius:9px;border:1.5px solid ' + C.azul + ';'
    + 'background:#fff;color:' + C.azul + ';font-family:inherit;font-size:12px;font-weight:600;'
    + 'cursor:pointer;min-height:36px;transition:background .2s ease,color .2s ease}'
    + '.zb-prod-btn:hover{background:' + C.azul + ';color:#fff}'

    /* ---------- OPCIONES ---------- */
    + '.zb-ops{display:flex;flex-direction:column;gap:7px;margin:0 0 12px 36px}'
    + '.zb-op{background:#fff;border:1.5px solid ' + C.borde + ';color:' + C.texto + ';border-radius:11px;'
    + 'padding:11px 13px;font-size:13.5px;font-weight:500;cursor:pointer;text-align:left;'
    + 'font-family:inherit;line-height:1.4;min-height:44px;'
    + 'transition:background .2s ease,border-color .2s ease,transform .2s ease}'
    + '.zb-op:hover{background:' + C.azulClaro + ';border-color:' + C.azul + ';color:' + C.azulOsc + '}'
    + '.zb-op:active{transform:scale(.985)}'
    + '.zb-op:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:2px}'

    /* ---------- ACCIONES RÁPIDAS ---------- */
    + '.zb-rapidas{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px 36px}'
    + '.zb-rapida{background:#fff;border:1.5px solid ' + C.borde + ';color:' + C.texto + ';'
    + 'border-radius:999px;padding:8px 13px;font-size:12.5px;font-weight:600;cursor:pointer;'
    + 'font-family:inherit;line-height:1;min-height:36px;display:inline-flex;align-items:center;gap:5px;'
    + 'transition:background .2s ease,border-color .2s ease,transform .2s ease}'
    + '.zb-rapida:hover{background:' + C.azulClaro + ';border-color:' + C.azul + ';color:' + C.azulOsc + '}'
    + '.zb-rapida:active{transform:scale(.97)}'
    + '.zb-rapida:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:2px}'
    /* Verde solo para el canal de WhatsApp. */
    + '.zb-rapida.wa{border-color:' + C.verdeWa + ';color:#128C4A}'
    + '.zb-rapida.wa:hover{background:#F0FDF4;border-color:' + C.verdeWa + ';color:#0E7038}'

    /* ---------- BARRA DE ESCRITURA ----------
       Ocupa todo el ancho, como la de WhatsApp. El textarea
       necesita width:100% y min-width:0 sí o sí: sin eso se
       queda en su ancho por defecto (unos 160 px) y parece un
       recuadro diminuto perdido en la barra. */
    + '.zb-input-wrap{display:flex;gap:8px;align-items:flex-end;padding:10px 12px;'
    + 'background:#fff;border-top:1px solid ' + C.borde + ';flex-shrink:0}'
    + '.zb-input{flex:1 1 auto;width:100%;min-width:0;box-sizing:border-box;'
    + 'border:1.5px solid ' + C.borde + ';border-radius:22px;padding:11px 16px;'
    + 'font-size:15px;font-family:inherit;color:' + C.texto + ';resize:none;'
    + 'line-height:1.4;min-height:44px;max-height:104px;background:' + C.fondo + ';'
    + 'overflow-y:auto;transition:border-color .2s ease,background .2s ease,box-shadow .2s ease}'
    + '.zb-input:focus{outline:none;border-color:' + C.azul + ';background:#fff;'
    + 'box-shadow:0 0 0 3px rgba(37,99,235,.10)}'
    + '.zb-input::placeholder{color:' + C.tenue + '}'
    + '.zb-enviar{flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:none;'
    + 'cursor:pointer;background:' + C.azul + ';color:#fff;display:flex;align-items:center;'
    + 'justify-content:center;padding:0;'
    + 'transition:background .2s ease,transform .2s ease,opacity .2s ease}'
    + '.zb-enviar svg{width:19px;height:19px}'
    + '.zb-enviar:hover{background:' + C.azulOsc + '}'
    + '.zb-enviar:active{transform:scale(.94)}'
    + '.zb-enviar:disabled{background:' + C.borde + ';color:' + C.tenue + ';cursor:default;transform:none}'
    + '.zb-enviar:focus-visible{outline:3px solid rgba(37,99,235,.45);outline-offset:2px}'

    /* ---------- PIE ---------- */
    + '.zb-foot{padding:8px 14px;background:#fff;border-top:1px solid ' + C.borde + ';font-size:10.5px;'
    + 'color:' + C.tenue + ';text-align:center;line-height:1.45}'

    /* ---------- MÓVIL ---------- */
    + '@media(max-width:520px){'
    + '#zb-fab{bottom:16px;left:16px;width:58px;height:58px}'
    + '.zb-fab-tip{display:none}'
    /* 100dvh sigue al teclado: el campo de escritura no queda tapado. */
    + '#zb-panel{bottom:0;left:0;width:100%;max-width:100%;height:100dvh;max-height:100dvh;'
    + 'border-radius:0;border:none}'
    + '.zb-head{padding-top:calc(14px + env(safe-area-inset-top,0px))}'
    + '.zb-foot{padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}'
    + '.zb-body{padding:14px}'
    + '.zb-ops,.zb-rapidas{margin-left:0}'
    + '.zb-msg{font-size:14.5px}'
    + '}'
    /* Navegadores sin dvh: se usa vh como respaldo. */
    + '@supports not (height:100dvh){@media(max-width:520px){'
    + '#zb-panel{height:100vh;max-height:100vh}}}'

    /* ---------- MENOS MOVIMIENTO ---------- */
    + '@media(prefers-reduced-motion:reduce){'
    + '#zb-panel.abierto,#zb-panel.cerrando,.zb-fila,.zb-punto,.zb-dots i{animation:none!important}'
    + '#zb-fab,.zb-op,.zb-rapida,.zb-fab-tip{transition:none!important}'
    + '}';

  /* =========================================================
     MOTOR CONVERSACIONAL
     ---------------------------------------------------------
     Zoe funciona por INTENCIONES, no por menús:

       1. El usuario escribe libremente.
       2. Se normaliza el texto (minúsculas, sin tildes).
       3. Se comprueba si es una consulta médica → deriva.
       4. Se puntúa cada intención de zoe-conocimiento.js:
          cada palabra clave encontrada suma puntos, y las
          frases largas suman más que las palabras sueltas.
       5. Gana la de mayor puntuación, si supera el mínimo.
       6. Si nada llega al mínimo, Zoe dice que no lo sabe.
          Nunca inventa.

     El CONTEXTO de la conversación (cirugía, tiempo, objetivo)
     se guarda solo en memoria mientras el chat está abierto.
     No se almacena nada.

     PARA AMPLIAR: se editan las respuestas en
     zoe-conocimiento.js. Este archivo no necesita cambios.

     PARA CONECTAR UN MODELO DE LENGUAJE en el futuro: basta
     con sustituir el cuerpo de responder() por la llamada al
     modelo. Toda la interfaz (burbujas, escritura, productos)
     seguiría funcionando igual.
     ========================================================= */
  var panel, body, fab, entrada, btnEnviar;

  /* Contexto de la sesión. Se borra al recargar la página. */
  var ctx = { cirugia: null, tiempo: null, objetivo: null, flujo: null };

  var AVATAR = 'img/zoe.png';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function scrollAbajo() {
    body.scrollTop = body.scrollHeight;
  }

  function normalizar(t) {
    return String(t || '').toLowerCase()
      /* La ñ se aparta antes de quitar tildes: si no, "año"
         terminaría como "ano" y dejaría de reconocerse. */
      .replace(/ñ/g, '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(//g, 'ñ')
      .replace(/[¿?¡!.,;:]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  /* --- Burbujas ----------------------------------------- */
  function burbuja(texto, esUsuario) {
    var fila = el('div', 'zb-fila' + (esUsuario ? ' user' : ''));
    if (!esUsuario) {
      var av = el('img', 'zb-av');
      av.src = AVATAR; av.alt = ''; av.setAttribute('aria-hidden', 'true');
      fila.appendChild(av);
    }
    fila.appendChild(el('div', 'zb-msg' + (esUsuario ? ' user' : ''), texto));
    body.appendChild(fila);
    scrollAbajo();
    return fila;
  }

  function mostrarEscribiendo() {
    var fila = el('div', 'zb-fila');
    fila.id = 'zb-escribiendo';
    var av = el('img', 'zb-av');
    av.src = AVATAR; av.alt = ''; av.setAttribute('aria-hidden', 'true');
    fila.appendChild(av);
    fila.appendChild(el('div', 'zb-typing',
      '<span class="zb-typing-t">Zoe está escribiendo</span>' +
      '<span class="zb-dots"><i></i><i></i><i></i></span>'));
    fila.setAttribute('role', 'status');
    fila.setAttribute('aria-label', 'Zoe está escribiendo');
    body.appendChild(fila);
    scrollAbajo();
  }

  function quitarEscribiendo() {
    var e = document.getElementById('zb-escribiendo');
    if (e) e.remove();
  }

  /* --- Productos del catálogo ---------------------------
     Solo se muestran productos que existen de verdad. Si el
     catálogo no está cargado (otras páginas), no se muestra
     nada en vez de inventar. */
  function tarjetasProducto(ids) {
    var cat = window.ZB_CATALOGO;
    if (!cat || !ids || !ids.length) return null;

    var lista = ids.map(function (id) {
      return cat.filter(function (p) { return p.id === id; })[0];
    }).filter(Boolean);
    if (!lista.length) return null;

    var cont = el('div', 'zb-prods');
    lista.forEach(function (p) {
      var t = el('div', 'zb-prod');
      t.innerHTML =
        '<img src="' + p.img + '" alt="" loading="lazy">' +
        '<div class="zb-prod-txt">' +
          '<div class="zb-prod-nom">' + p.nombre + '</div>' +
          '<div class="zb-prod-precio">S/ ' + p.precio + '</div>' +
        '</div>';
      var b = el('button', 'zb-prod-btn', 'Ver');
      b.type = 'button';
      b.onclick = function () {
        if (typeof abrirModal === 'function') { cerrar(); abrirModal(p.id); }
        else { window.location.href = '/?producto=' + p.id; }
      };
      t.appendChild(b);
      cont.appendChild(t);
    });
    return cont;
  }

  /* --- Chips de respuesta rápida ------------------------ */
  function chips(opciones) {
    var cont = el('div', 'zb-chips');
    opciones.forEach(function (o) {
      var b = el('button', 'zb-chip', o.texto);
      b.type = 'button';
      b.onclick = function () {
        cont.remove();
        enviarTexto(o.envia || o.texto);
      };
      cont.appendChild(b);
    });
    return cont;
  }

  /* =========================================================
     DETECCIÓN DE INTENCIÓN
     ========================================================= */
  function esConsultaMedica(txt) {
    var K = window.ZOE_CONOCIMIENTO;
    return K.TEMAS_MEDICOS.some(function (t) { return txt.indexOf(normalizar(t)) > -1; });
  }

  function detectar(txt) {
    var K = window.ZOE_CONOCIMIENTO;
    var mejor = null, mejorPunt = 0;

    K.INTENCIONES.forEach(function (it) {
      var punt = 0;
      it.keywords.forEach(function (k) {
        var kn = normalizar(k);
        if (!kn) return;
        if (txt.indexOf(kn) > -1) {
          /* Una frase de varias palabras es mucho más
             específica que una palabra suelta. */
          punt += kn.indexOf(' ') > -1 ? kn.split(' ').length * 3 : 2;
        }
      });
      if (punt > mejorPunt) { mejorPunt = punt; mejor = it; }
    });

    return mejorPunt >= 2 ? mejor : null;
  }

  /* Detecta datos sueltos que el usuario menciona de paso
     ("tengo manga", "llevo 3 semanas") y los guarda. */
  function capturarContexto(txt) {
    if (/\bmanga\b|sleeve/.test(txt)) ctx.cirugia = 'manga';
    else if (/bypass|by pass|baipas/.test(txt)) ctx.cirugia = 'bypass';
    else if (/balon/.test(txt)) ctx.cirugia = 'balon';

    /* La gente escribe los tiempos de mil formas: "3 semanas",
       "mes y medio", "un par de meses", "recién operada".
       Se traducen todas a los mismos cuatro tramos. */
    var PALABRAS = {
      un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
      siete: 7, ocho: 8, nueve: 9, diez: 10, quince: 15, veinte: 20
    };

    /* Convierte "tres" en 3; deja los dígitos como están. */
    function numero(txtNum) {
      if (!txtNum) return null;
      if (/^\d+$/.test(txtNum)) return parseInt(txtNum, 10);
      return PALABRAS[txtNum] != null ? PALABRAS[txtNum] : null;
    }

    var NUM = '(\\d+|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|quince|veinte)';
    var m, n;

    /* Casos sin número explícito, primero. */
    if (/mes y medio|mes  y medio/.test(txt))                     { ctx.tiempo = '1-3m'; return; }
    if (/recien operad|acabo de operar|me operaron ayer|hace poc/.test(txt)) { ctx.tiempo = '0-1s'; return; }
    if (/mas de (3|tres) meses|mas de (6|seis) meses|hace mas de/.test(txt)) { ctx.tiempo = '3m+'; return; }
    if (/mas de (un|1) año|un año|anios|años/.test(txt))          { ctx.tiempo = '3m+'; return; }
    if (/(una|1) semana/.test(txt))                                { ctx.tiempo = '1-4s'; return; }
    if (/(un|1) mes\b/.test(txt))                                  { ctx.tiempo = '1-3m'; return; }

    if ((m = txt.match(new RegExp(NUM + '\\s*(dia|dias)')))) {
      n = numero(m[1]); if (n != null) ctx.tiempo = n <= 7 ? '0-1s' : '1-4s';
    } else if ((m = txt.match(new RegExp(NUM + '\\s*(semana|semanas)')))) {
      n = numero(m[1]); if (n != null) ctx.tiempo = n <= 1 ? '0-1s' : (n <= 4 ? '1-4s' : '1-3m');
    } else if ((m = txt.match(new RegExp(NUM + '\\s*(mes|meses)')))) {
      n = numero(m[1]); if (n != null) ctx.tiempo = n <= 3 ? '1-3m' : '3m+';
    }
  }

  var ETIQ_CIRUGIA = { manga: 'manga gástrica', bypass: 'bypass gástrico', balon: 'balón gástrico' };
  var ETIQ_TIEMPO  = { '0-1s': 'menos de 1 semana', '1-4s': '1 a 4 semanas', '1-3m': '1 a 3 meses', '3m+': 'más de 3 meses' };

  /* =========================================================
     FLUJO GUIADO — "¿qué suplemento necesito?"
     Pregunta solo lo que todavía no sabe del contexto.
     ========================================================= */
  function seguirFlujo() {
    if (!ctx.cirugia) {
      responderZoe('¿Qué procedimiento te realizaste?', null, [
        { texto: 'Manga gástrica', envia: 'manga gastrica' },
        { texto: 'Bypass gástrico', envia: 'bypass' },
        { texto: 'Balón gástrico', envia: 'balon gastrico' }
      ]);
      return;
    }
    if (!ctx.tiempo) {
      responderZoe('¿Cuánto tiempo llevas desde el procedimiento?', null, [
        { texto: 'Menos de 1 semana', envia: 'llevo 4 dias' },
        { texto: '1 a 4 semanas', envia: 'llevo 3 semanas' },
        { texto: '1 a 3 meses', envia: 'llevo 2 meses' },
        { texto: 'Más de 3 meses', envia: 'llevo 6 meses' }
      ]);
      return;
    }
    if (!ctx.objetivo) {
      responderZoe('¿Qué estás buscando?', null, [
        { texto: 'Proteína', envia: 'busco proteina' },
        { texto: 'Vitaminas', envia: 'busco vitaminas' },
        { texto: 'Fibra', envia: 'busco fibra' },
        { texto: 'Colágeno', envia: 'busco colageno' },
        { texto: 'No estoy seguro', envia: 'no estoy seguro' }
      ]);
      return;
    }
    mostrarResultadoFlujo();
  }

  function familiaDe(p) {
    if (p.cat === 'proteina') return /l[ií]quid/i.test(p.nombre) ? 'proteina_liquida' : 'proteina_polvo';
    if (p.cat === 'vitaminas') return 'vitaminas';
    if (p.cat === 'colageno')  return /fibra/i.test(p.nombre) ? 'fibra' : 'colageno';
    return null;
  }

  function mostrarResultadoFlujo() {
    var K = window.ZOE_CONOCIMIENTO;
    var cat = window.ZB_CATALOGO || [];
    ctx.flujo = null;

    var lista = cat.filter(function (p) {
      if (p.tipo === 'pack' || p.tipo === 'oferta') return false;
      var fam = familiaDe(p);
      if (!fam) return false;
      var etapas = K.ETAPAS_FAMILIA[fam] || [];
      if (etapas.indexOf(ctx.tiempo) === -1) return false;
      if (ctx.objetivo === 'nose') return true;
      if (ctx.objetivo === 'proteina') return fam.indexOf('proteina') === 0;
      return fam === ctx.objetivo;
    }).slice(0, 4);

    var resumen = ETIQ_CIRUGIA[ctx.cirugia] + ', ' + ETIQ_TIEMPO[ctx.tiempo];

    if (!lista.length) {
      responderZoe(
        'Para ' + resumen + ' no tengo productos que encajen en esa combinación.<br><br>' +
        (ctx.tiempo === '0-1s'
          ? 'En los primeros días lo habitual son solo líquidos claros, y la suplementación suele empezar algo más adelante.'
          : 'Escríbenos por WhatsApp y te orientamos.') +
        '<br><br><span style="font-size:12px;color:#6B7280">' + K.AVISO + '</span>',
        null, [{ texto: '💬 Hablar por WhatsApp', envia: 'whatsapp' }]);
      return;
    }

    responderZoe(
      'Para ' + resumen + ', estos son los que normalmente se utilizan:',
      lista.map(function (p) { return p.id; }),
      [{ texto: 'Ver más opciones', envia: 'ver productos' },
       { texto: '💬 Hablar por WhatsApp', envia: 'whatsapp' }],
      K.AVISO);
  }

  /* =========================================================
     RESPUESTA
     ========================================================= */
  function responderZoe(texto, productos, opciones, aviso) {
    mostrarEscribiendo();
    setTimeout(function () {
      quitarEscribiendo();
      var html = texto;
      if (aviso) html += '<div class="zb-nota">' + aviso + '</div>';
      burbuja(html, false);

      var tarjetas = tarjetasProducto(productos);
      if (tarjetas) { body.appendChild(tarjetas); scrollAbajo(); }
      if (opciones && opciones.length) { body.appendChild(chips(opciones)); scrollAbajo(); }
    }, 550);
  }

  /* Punto único de entrada de cada mensaje del usuario. */
  /* Cuenta qué se suele usar en la etapa que indicó el usuario.
     Si además sabemos la cirugía, se menciona para que note que
     Zoe está siguiendo la conversación. */
  function orientarPorEtapa(intencion) {
    var K = window.ZOE_CONOCIMIENTO;
    var e = K.POR_ETAPA[ctx.tiempo];
    if (!e) return;

    /* Si además preguntó por su cirugía, se explica primero
       esa parte y luego lo de su etapa: así responde a las dos
       cosas en un solo mensaje. */
    var sobreCirugia = '';
    if (intencion && ['manga', 'bypass', 'balon'].indexOf(intencion.intent) > -1) {
      sobreCirugia = intencion.response + '<br><br>';
    }

    var intro = ctx.cirugia
      ? 'Con ' + ETIQ_CIRUGIA[ctx.cirugia] + ' y ' + e.titulo + ':<br><br>'
      : 'En ' + e.titulo + ':<br><br>';

    responderZoe(sobreCirugia + intro + e.texto,
      e.productos,
      [{ texto: 'Ver precios', envia: 'precios' },
       { texto: '💬 Hablar por WhatsApp', envia: 'whatsapp' }],
      K.AVISO);
  }

  function responder(mensaje) {
    var K = window.ZOE_CONOCIMIENTO;
    var txt = normalizar(mensaje);
    capturarContexto(txt);
    /* Basta con que el mensaje MENCIONE un tiempo. Antes se
       exigía que además cambiara de etapa, y entonces repetir
       "3 semanas" tras "una semana" no respondía nada. */
    var mencionaTiempo = /\bdia|dias|semana|semanas|\bmes\b|meses|año|años|recien operad|acabo de operar|hace poc/.test(txt);

    /* 1. Consulta médica → derivación, antes que nada. */
    if (esConsultaMedica(txt)) {
      responderZoe(K.RESPUESTA_MEDICA, null,
        [{ texto: '💬 Hablar por WhatsApp', envia: 'whatsapp' }]);
      return;
    }

    /* 2. Si está en medio del flujo guiado, se continúa. */
    if (ctx.flujo === 'producto') {
      if (/proteina/.test(txt)) ctx.objetivo = 'proteina';
      else if (/vitamina/.test(txt)) ctx.objetivo = 'vitaminas';
      else if (/fibra/.test(txt)) ctx.objetivo = 'fibra';
      else if (/colageno/.test(txt)) ctx.objetivo = 'colageno';
      else if (/no estoy segur|no se|ninguno/.test(txt)) ctx.objetivo = 'nose';
      seguirFlujo();
      return;
    }

    /* 3. Detección de intención. */
    var it = detectar(txt);

    /* 3b. Si el usuario dijo un tiempo y no preguntaba otra cosa
       concreta, se le cuenta qué se suele usar en esa etapa.
       Es lo que espera oír cuando dice "llevo 2 meses". */
    /* Si ya sabemos la etapa, la orientación por etapa es la
       respuesta más útil y se impone sobre las intenciones que
       solo iban a preguntar por el tiempo. Sin esto, decir
       "tengo manga y llevo mes y medio" respondía sobre la manga
       y volvía a preguntar el tiempo que la persona acababa
       de dar. */
    var ABSORBE_ETAPA = ['saludo', 'manga', 'bypass', 'balon', 'etapas'];
    if (mencionaTiempo && ctx.tiempo && (!it || ABSORBE_ETAPA.indexOf(it.intent) > -1)) {
      orientarPorEtapa(it);
      return;
    }

    if (!it) {
      responderZoe(K.RESPUESTA_DESCONOCIDA, null,
        [{ texto: '💬 Continuar por WhatsApp', envia: 'whatsapp' }]);
      return;
    }

    if (it.accion === 'whatsapp') {
      responderZoe(it.response);
      setTimeout(function () {
        window.open(wa('Hola Zoe 👋 Vengo de la web y tengo una consulta.'), '_blank');
      }, 700);
      return;
    }

    if (it.accion === 'flujo_producto') {
      ctx.flujo = 'producto';
      responderZoe(it.response);
      setTimeout(seguirFlujo, 900);
      return;
    }

    /* Respuesta normal, con lo que sepamos del contexto. */
    var extra = null;
    if (it.followUp) extra = it.followUp;
    responderZoe(
      it.response + (extra ? '<br><br>' + extra : ''),
      it.productos,
      null,
      it.aviso ? K.AVISO : null);
  }

  /* =========================================================
     ENVÍO DE MENSAJES
     ========================================================= */
  function enviarTexto(texto) {
    texto = String(texto || '').trim();
    if (!texto) return;
    burbuja(texto, true);
    responder(texto);
  }

  function enviarDesdeCampo() {
    var t = entrada.value.trim();
    if (!t) return;
    entrada.value = '';
    entrada.style.height = 'auto';
    btnEnviar.disabled = true;
    enviarTexto(t);
    /* En escritorio se mantiene el foco; en móvil no, para que
       el teclado no tape la conversación. */
    if (window.matchMedia('(min-width:521px)').matches) entrada.focus();
  }

  /* =========================================================
     APERTURA Y CIERRE
     ========================================================= */
  function saludar() {
    var K = window.ZOE_CONOCIMIENTO;
    burbuja('<b>Hola 👋 Soy Zoe.</b><br><br>' +
      'Puedo ayudarte con información sobre nuestros productos, pedidos, envíos ' +
      'y dudas frecuentes sobre el proceso bariátrico.<br><br>' +
      '<b>¿Qué necesitas hoy?</b>', false);
    body.appendChild(chips(K.SUGERENCIAS));
    scrollAbajo();
  }

  function abrir() {
    panel.classList.remove('cerrando');
    panel.classList.add('abierto');
    fab.classList.add('oculto');
    if (!body.hasChildNodes()) saludar();
    /* El foco va al campo de texto: se puede escribir de una. */
    if (entrada && window.matchMedia('(min-width:521px)').matches) entrada.focus();
  }

  function cerrar() {
    panel.classList.add('cerrando');
    var fin = function () {
      panel.classList.remove('abierto', 'cerrando');
      panel.removeEventListener('animationend', fin);
    };
    panel.addEventListener('animationend', fin);
    setTimeout(fin, 260);
    fab.classList.remove('oculto');
    fab.focus();
  }

  /* =========================================================
     CONSTRUCCIÓN DE LA INTERFAZ
     ========================================================= */
  function construirEntrada() {
    var wrap = el('div', 'zb-input-wrap');

    entrada = el('textarea', 'zb-input');
    entrada.rows = 1;
    entrada.placeholder = 'Escribe tu pregunta...';
    entrada.setAttribute('aria-label', 'Escribe tu pregunta para Zoe');

    btnEnviar = el('button', 'zb-enviar',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>');
    btnEnviar.type = 'button';
    btnEnviar.disabled = true;
    btnEnviar.setAttribute('aria-label', 'Enviar');

    entrada.addEventListener('input', function () {
      btnEnviar.disabled = !entrada.value.trim();
      entrada.style.height = 'auto';
      /* Crece con el texto hasta el tope del CSS (104 px). */
      entrada.style.height = Math.max(44, Math.min(entrada.scrollHeight, 104)) + 'px';
    });
    entrada.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarDesdeCampo(); }
    });
    btnEnviar.onclick = enviarDesdeCampo;

    wrap.appendChild(entrada);
    wrap.appendChild(btnEnviar);
    return wrap;
  }

  function iniciar() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    fab = el('button', '', '<img src="' + AVATAR + '" alt="Zoe" class="zb-fab-foto">');
    fab.id = 'zb-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Habla con Zoe, asistente de Zona Bariátrica');
    fab.onclick = abrir;
    document.body.appendChild(fab);

    var tip = el('span', 'zb-fab-tip', 'Habla con Zoe');
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    panel = el('div');
    panel.id = 'zb-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Zoe, asistente de Zona Bariátrica');

    var head = el('div', 'zb-head');
    head.appendChild(el('div', 'zb-head-av',
      '<img src="' + AVATAR + '" alt="" aria-hidden="true">'));
    head.appendChild(el('div', 'zb-head-txt',
      '<div class="zb-head-t">Zoe</div>' +
      '<div class="zb-head-s">Asistente de Zona Bariátrica</div>' +
      '<div class="zb-estado"><span class="zb-punto"></span>Disponible para ayudarte</div>'));
    var x = el('button', 'zb-x', '&times;');
    x.type = 'button';
    x.setAttribute('aria-label', 'Cerrar el asistente');
    x.onclick = cerrar;
    head.appendChild(x);

    body = el('div', 'zb-body');
    body.setAttribute('role', 'log');
    body.setAttribute('aria-live', 'polite');

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(construirEntrada());
    panel.appendChild(el('div', 'zb-foot',
      'La información brindada es referencial y no reemplaza la orientación ' +
      'de tu médico o nutricionista.'));
    document.body.appendChild(panel);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('abierto')) cerrar();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();