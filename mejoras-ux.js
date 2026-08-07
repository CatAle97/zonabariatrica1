/* =========================================================
   MEJORAS UX — Zona Bariátrica
   Autocontenido: crea sus propios estilos.
   Se activa con una sola línea antes de </body>:
       <script src="mejoras-ux.js"></script>

   Qué hace:
     · Motor de microanimaciones de entrada reutilizable
       (window.ZBUX.animar), usado por las secciones nuevas
       de la home y por las páginas de herramientas.

   NOTA: aquí vivía el botón flotante verde "Habla con Zoe".
   Se retiró: el contacto queda en el asistente (abajo a la
   izquierda, con la cara de Zoe), en el botón del header y
   en los CTA de cada sección. Tres botones flotantes a la vez
   tapaban demasiado contenido en móvil.

   NO toca el carrito, el checkout, el login ni el catálogo.
   Respeta "prefers-reduced-motion".
   ========================================================= */
(function () {
  'use strict';

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
    /* --- Motor de microanimaciones de entrada --- */
    '.zb-rev{opacity:0;transform:translateY(18px);',
    '  transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)}',
    '.zb-rev.zb-rev-in{opacity:1;transform:none}',
    '@media (prefers-reduced-motion:reduce){',
    '  .zb-rev,.zb-rev.zb-rev-in{opacity:1!important;transform:none!important;transition:none!important}',
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
     3. EL ASISTENTE NO DEBE TAPAR LOS PANELES
     El botón de Zoe (asistente.js) flota en la esquina con un
     z-index alto, así que se quedaba encima del carrito, de la
     ficha de producto y del selector de sabor, tapando texto.
     Aquí se esconde mientras alguno esté abierto, sin tocar
     asistente.js ni las funciones del carrito.
     --------------------------------------------------------- */
  function ocultarAsistenteConPaneles(intento) {
    var fab = document.getElementById('zb-fab');

    /* asistente.js crea su botón por su cuenta y puede tardar
       un momento. Se reintenta un par de segundos y se abandona
       en silencio si esa página no lleva asistente. */
    if (!fab) {
      intento = (intento || 0) + 1;
      if (intento > 20) return;
      return setTimeout(function () { ocultarAsistenteConPaneles(intento); }, 100);
    }

    var overlays = ['modalOverlay', 'spOverlay', 'cartOverlay']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!overlays.length) return;

    var sincronizar = function () {
      var abierto = overlays.some(function (o) { return o.classList.contains('open'); });
      fab.classList.toggle('oculto', abierto);
    };

    sincronizar();
    overlays.forEach(function (o) {
      new MutationObserver(sincronizar)
        .observe(o, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ---------------------------------------------------------
     4. ARRANQUE
     --------------------------------------------------------- */
  function iniciar() {
    inyectarEstilos();
    /* asistente.js crea su botón al cargar; se espera un tic
       para que exista antes de engancharlo. */
    setTimeout(ocultarAsistenteConPaneles, 0);

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
