/* =========================================================
   INSTALAR APP — Zona Bariátrica
   Autocontenido: crea sus propios estilos, su HTML y su lógica.
   Se activa con una sola línea en el <head>:
       <script src="/instalar-app.js" defer></script>

   Qué hace:
     · Muestra una franja arriba de la página (no flotante, no
       tapa el carrito ni a Zoe) con el botón "Instalar app".
     · Android / Chrome: instala en un toque.
     · iPhone (Safari): muestra los 2 pasos para "Agregar a inicio".
     · Solo en celular. No aparece si ya está instalada.
     · "Ahora no" la esconde 15 días en ese celular.
     · Mide en Analytics: instalar_app_ver / _clic / _ok / _cerrar.

   Para QUITARLO: borrar la línea del <head> y este archivo.
   ========================================================= */
(function () {
  'use strict';

  var CLAVE = 'zb_instalar_oculto';
  var DIAS_OCULTO = 15;

  var ua = navigator.userAgent || '';
  var yaInstalada = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  var esCelular = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
  var esIOS = /iPhone|iPad|iPod/.test(ua);
  /* En iPhone solo Safari permite "Agregar a inicio" de forma sencilla
     (no Chrome/Firefox de iPhone ni los navegadores de Instagram/Facebook). */
  var esSafariIOS = esIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Instagram|FBAN|FBAV/.test(ua);

  if (yaInstalada || !esCelular) return;

  function ocultoRecientemente() {
    try {
      var t = parseInt(localStorage.getItem(CLAVE), 10);
      return t && (Date.now() - t) < DIAS_OCULTO * 864e5;
    } catch (e) { return false; }
  }
  if (ocultoRecientemente()) return;

  function medir(evento) {
    try { if (window.gtag) window.gtag('event', evento, { plataforma: esIOS ? 'ios' : 'android' }); } catch (e) {}
  }

  /* ---------- 1. ESTILOS ---------- */
  function estilos() {
    if (document.getElementById('zb-instalar-css')) return;
    var css = document.createElement('style');
    css.id = 'zb-instalar-css';
    css.textContent =
      '.zb-inst{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#EFF6FF;' +
      'border-bottom:1px solid #DBEAFE;font-family:var(--font,system-ui,sans-serif);font-size:13.5px;color:#111827;line-height:1.35}' +
      '.zb-inst img{width:36px;height:36px;border-radius:9px;flex-shrink:0;box-shadow:0 1px 3px rgba(16,24,40,.12)}' +
      '.zb-inst-txt{flex:1;min-width:0}' +
      '.zb-inst-txt b{display:block;font-size:14px}' +
      '.zb-inst-txt span{color:#6B7280;font-size:12.5px}' +
      '.zb-inst-btn{background:#0057FF;color:#fff;border:0;border-radius:999px;padding:8px 14px;font:inherit;' +
      'font-weight:600;font-size:13px;cursor:pointer;flex-shrink:0}' +
      '.zb-inst-x{background:none;border:0;color:#6B7280;font:inherit;font-size:12.5px;padding:6px 2px;cursor:pointer;flex-shrink:0}' +
      '.zb-inst-ios{padding:4px 14px 12px 60px;background:#EFF6FF;border-bottom:1px solid #DBEAFE;' +
      'font-family:var(--font,system-ui,sans-serif);font-size:13.5px;color:#111827;line-height:1.6}' +
      '.zb-inst-ios ol{margin:0;padding-left:18px}' +
      '.zb-inst-ios svg{vertical-align:-3px}' +
      '@media (max-width:420px){.zb-inst-txt span{display:none}}';
    document.head.appendChild(css);
  }

  /* ---------- 2. FRANJA ---------- */
  var franja, pasosIOS;

  function quitar() {
    if (franja) franja.remove();
    if (pasosIOS) pasosIOS.remove();
    franja = pasosIOS = null;
  }

  function cerrar() {
    try { localStorage.setItem(CLAVE, String(Date.now())); } catch (e) {}
    medir('instalar_app_cerrar');
    quitar();
  }

  function mostrar(alTocar) {
    if (franja) return;
    estilos();
    franja = document.createElement('div');
    franja.className = 'zb-inst';
    franja.innerHTML =
      '<img src="/img/app/icono-192.png" alt="">' +
      '<div class="zb-inst-txt"><b>Ten Zona Bariátrica en tu celular</b>' +
      '<span>Ábrela como una app, sin buscarnos cada vez.</span></div>' +
      '<button type="button" class="zb-inst-btn">Instalar app</button>' +
      '<button type="button" class="zb-inst-x" aria-label="Ahora no">Ahora no</button>';
    franja.querySelector('.zb-inst-btn').addEventListener('click', function () {
      medir('instalar_app_clic');
      alTocar();
    });
    franja.querySelector('.zb-inst-x').addEventListener('click', cerrar);
    document.body.insertBefore(franja, document.body.firstChild);
    medir('instalar_app_ver');
  }

  /* ---------- 3. ANDROID / CHROME ---------- */
  var aviso = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    aviso = e;
    mostrar(function () {
      if (!aviso) return;
      aviso.prompt();
      aviso.userChoice.then(function (r) {
        if (r && r.outcome === 'accepted') quitar();
        aviso = null;
      });
    });
  });

  window.addEventListener('appinstalled', function () {
    medir('instalar_app_ok');
    quitar();
  });

  /* ---------- 4. IPHONE (SAFARI) ---------- */
  if (esSafariIOS) {
    var iconoCompartir =
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0057FF" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/>' +
      '<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    mostrar(function () {
      if (pasosIOS) { pasosIOS.remove(); pasosIOS = null; return; }
      pasosIOS = document.createElement('div');
      pasosIOS.className = 'zb-inst-ios';
      pasosIOS.innerHTML =
        '<ol><li>Toca el botón <b>Compartir</b> ' + iconoCompartir + ' (abajo en la pantalla).</li>' +
        '<li>Elige <b>"Agregar a inicio"</b> y luego <b>"Agregar"</b>.</li></ol>';
      franja.insertAdjacentElement('afterend', pasosIOS);
    });
  }
})();
