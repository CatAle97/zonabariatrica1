/* =========================================================
   MEJORAS UX — Zona Bariátrica  (Fase 1)
   Autocontenido: crea sus propios estilos y su propio HTML.
   Se activa con una sola línea antes de </body>:
       <script src="mejoras-ux.js"></script>

   Qué hace:
     1) Botón flotante "Habla con Zoe" (abre WhatsApp).
     2) Motor de microanimaciones de entrada reutilizable
        (window.ZBUX.animar) usado por las secciones nuevas.

   NO toca el carrito, el checkout, el login ni el catálogo.
   Respeta "prefers-reduced-motion" y el área segura del móvil.
   ========================================================= */
(function () {
  'use strict';

  var WA = '51961841069';
  var MENSAJE = 'Hola Zoe 👋 Vengo de zonabariatrica.com y quiero orientación sobre suplementos bariátricos.';

  /* Si el usuario pidió menos movimiento, apagamos animaciones. */
  var SIN_MOVIMIENTO = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. ESTILOS
     Se inyectan una sola vez. Usan las variables del design
     system cuando existen, con respaldo fijo por si el script
     corre en una página que no las define.
     --------------------------------------------------------- */
  var CSS = [
    /* --- Botón flotante "Habla con Zoe" --- */
    '.zb-zoe-fab{',
    '  position:fixed;',
    '  right:var(--s-5,24px);',
    /* Se apila sobre el carrito. --zb-zoe-bottom lo recalcula el JS. */
    '  bottom:calc(var(--zb-zoe-bottom,24px) + env(safe-area-inset-bottom,0px));',
    '  z-index:998;',
    '  display:inline-flex;align-items:center;gap:9px;',
    '  padding:12px 18px 12px 14px;',
    '  border-radius:999px;text-decoration:none;',
    '  background:var(--green-wa,#25D366);color:#fff;',
    '  font-family:var(--font,"Inter",system-ui,sans-serif);',
    '  font-size:14px;font-weight:600;line-height:1;white-space:nowrap;',
    '  box-shadow:0 6px 20px rgba(37,211,102,.34),0 2px 6px rgba(16,24,40,.10);',
    '  transition:transform .25s ease,background .25s ease,box-shadow .25s ease;',
    '  -webkit-tap-highlight-color:transparent;',
    '}',
    '.zb-zoe-fab:hover{',
    '  transform:translateY(-4px);background:var(--green-wa-hover,#1FB855);',
    '  box-shadow:0 12px 28px rgba(37,211,102,.42),0 4px 10px rgba(16,24,40,.12);',
    '}',
    '.zb-zoe-fab:active{transform:translateY(-1px)}',
    '.zb-zoe-fab:focus-visible{outline:3px solid rgba(37,211,102,.45);outline-offset:3px}',
    '.zb-zoe-ico{width:24px;height:24px;display:block;flex:none}',
    '.zb-zoe-ico svg{width:100%;height:100%;display:block}',

    /* Entrada: aparece suave, no de golpe. */
    '.zb-zoe-fab{opacity:0;transform:translateY(12px) scale(.94)}',
    '.zb-zoe-fab.zb-zoe-in{opacity:1;transform:translateY(0) scale(1)}',
    '.zb-zoe-fab.zb-zoe-in:hover{transform:translateY(-4px) scale(1)}',
    /* Oculto mientras hay un panel abierto (carrito, modal…). */
    '.zb-zoe-fab.zb-zoe-off{opacity:0;pointer-events:none;transform:translateY(12px) scale(.94)}',

    /* Halo que late una sola vez para llamar la atención sin molestar. */
    '.zb-zoe-fab::before{',
    '  content:"";position:absolute;inset:0;border-radius:999px;',
    '  border:2px solid var(--green-wa,#25D366);opacity:0;pointer-events:none;',
    '}',
    '.zb-zoe-fab.zb-zoe-ping::before{animation:zbZoePing 2.2s ease-out 2}',
    '@keyframes zbZoePing{',
    '  0%{opacity:.55;transform:scale(1)}',
    '  70%{opacity:0;transform:scale(1.35)}',
    '  100%{opacity:0;transform:scale(1.35)}',
    '}',

    /* Móvil: mismo texto, algo más compacto. */
    '@media (max-width:640px){',
    '  .zb-zoe-fab{right:var(--s-4,16px);padding:11px 15px 11px 12px;font-size:13px;gap:7px}',
    '  .zb-zoe-ico{width:21px;height:21px}',
    '}',
    /* Pantallas muy angostas: solo el icono, para no tapar el catálogo. */
    '@media (max-width:359px){',
    '  .zb-zoe-txt{display:none}',
    '  .zb-zoe-fab{padding:13px}',
    '}',

    /* --- Motor de microanimaciones de entrada --- */
    '.zb-rev{opacity:0;transform:translateY(18px);',
    '  transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)}',
    '.zb-rev.zb-rev-in{opacity:1;transform:none}',
    '@media (prefers-reduced-motion:reduce){',
    '  .zb-rev,.zb-rev.zb-rev-in{opacity:1!important;transform:none!important;transition:none!important}',
    '  .zb-zoe-fab{opacity:1;transform:none;transition:none}',
    '  .zb-zoe-fab.zb-zoe-ping::before{animation:none}',
    '}'
  ].join('\n');

  function inyectarEstilos() {
    if (document.getElementById('zb-ux-css')) return;
    var s = document.createElement('style');
    s.id = 'zb-ux-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------
     2. MOTOR DE MICROANIMACIONES  →  window.ZBUX.animar(sel)
     Da entrada suave a cualquier elemento cuando entra en
     pantalla. Escalonado por grupo, tope de 8 para que la
     última tarjeta no tarde demasiado.
     --------------------------------------------------------- */
  var observador = null;

  function obtenerObservador() {
    if (observador) return observador;
    if (!('IntersectionObserver' in window)) return null;
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('zb-rev-in');
        observador.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    return observador;
  }

  function animar(selector, pasoMs) {
    var nodos = document.querySelectorAll(selector);
    if (!nodos.length) return;
    var obs = obtenerObservador();
    var paso = typeof pasoMs === 'number' ? pasoMs : 60;

    Array.prototype.forEach.call(nodos, function (el, i) {
      if (el.classList.contains('zb-rev')) return;   // ya enganchado
      el.classList.add('zb-rev');
      el.style.transitionDelay = Math.min(i, 8) * paso + 'ms';
      /* Sin soporte o sin movimiento: se muestra de una vez. */
      if (!obs || SIN_MOVIMIENTO) { el.classList.add('zb-rev-in'); return; }
      obs.observe(el);
    });
  }

  /* ---------------------------------------------------------
     3. BOTÓN FLOTANTE "HABLA CON ZOE"
     --------------------------------------------------------- */
  var ICONO_WA =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>' +
    '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.855L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.502-5.2-1.379l-.374-.217-3.754.894.944-3.653-.24-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>' +
    '</svg>';

  function crearFab() {
    if (document.getElementById('zbZoeFab')) return null;

    var a = document.createElement('a');
    a.id = 'zbZoeFab';
    a.className = 'zb-zoe-fab';
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(MENSAJE);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Habla con Zoe por WhatsApp');
    a.innerHTML =
      '<span class="zb-zoe-ico">' + ICONO_WA + '</span>' +
      '<span class="zb-zoe-txt">Habla con Zoe</span>';

    /* Medición en Analytics: reutiliza el gtag que ya carga el sitio. */
    a.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_zoe_whatsapp', {
          event_category: 'contacto',
          event_label: location.pathname
        });
      }
    });

    document.body.appendChild(a);
    return a;
  }

  /* El carrito flotante vive en la misma esquina: apilamos encima.
     Si en esta página no hay carrito, Zoe baja al ras.
     Zoe también se aparta mientras haya un panel abierto encima
     (carrito, ficha de producto o selector de sabor), para no
     tapar su contenido. */
  function ubicarSobreCarrito(fab) {
    var carrito = document.getElementById('floatCot');
    if (!carrito) return;

    /* Overlays que, abiertos, deben esconder a Zoe. */
    var overlays = ['modalOverlay', 'spOverlay', 'cartOverlay']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var hayPanelAbierto = function () {
      return overlays.some(function (o) { return o.classList.contains('open'); });
    };

    var sincronizar = function () {
      var carritoOculto = carrito.style.display === 'none';
      /* Alto real del carrito + separación de 16px. */
      var alto = carrito.offsetHeight || 60;
      document.documentElement.style.setProperty(
        '--zb-zoe-bottom', carritoOculto ? '24px' : (24 + alto + 16) + 'px'
      );
      fab.classList.toggle('zb-zoe-off', carritoOculto || hayPanelAbierto());
    };

    sincronizar();
    /* abrirCarrito()/cerrarCarrito() cambian el style del botón:
       lo escuchamos sin modificar esas funciones. */
    new MutationObserver(sincronizar)
      .observe(carrito, { attributes: true, attributeFilter: ['style'] });
    overlays.forEach(function (o) {
      new MutationObserver(sincronizar)
        .observe(o, { attributes: true, attributeFilter: ['class'] });
    });
    window.addEventListener('resize', sincronizar, { passive: true });
  }

  function iniciarFab() {
    var fab = crearFab();
    if (!fab) return;
    ubicarSobreCarrito(fab);

    if (SIN_MOVIMIENTO) { fab.classList.add('zb-zoe-in'); return; }
    /* Entra cuando la página ya se asentó, no compite con el hero. */
    setTimeout(function () {
      fab.classList.add('zb-zoe-in');
      setTimeout(function () { fab.classList.add('zb-zoe-ping'); }, 900);
    }, 1200);
  }

  /* ---------------------------------------------------------
     4. ARRANQUE
     --------------------------------------------------------- */
  function iniciar() {
    inyectarEstilos();
    iniciarFab();

    /* Secciones nuevas de esta fase. Si no existen en la página,
       animar() simplemente no hace nada. */
    animar('.hero-intro-inner > *', 70);   // eyebrow, título, texto, CTAs
    animar('.testi-header', 0);            // título de sección
    animar('.testi-card', 60);
    animar('.faq-header', 0);              // título de sección
    animar('.faq-item', 45);
    /* Comodín: cualquier bloque futuro al que se le ponga esta clase
       entra animado sin tocar código. */
    animar('.zb-anim-sec', 0);
  }

  /* window.ZBUX: por si más adelante se quiere animar algo nuevo
     sin volver a escribir un IntersectionObserver. */
  window.ZBUX = { animar: animar };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
