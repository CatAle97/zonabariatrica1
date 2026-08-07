/* =========================================================
   ZONA BARIÁTRICA — Lógica de las HERRAMIENTAS educativas
   ---------------------------------------------------------
   Un solo archivo para las 5 páginas nuevas. Cada bloque se
   activa solo si encuentra su HTML en la página, así que se
   puede cargar en todas sin condicionales.

   Contiene:
     1. Utilidades (header con sombra, acordeón FAQ, animación)
     2. Comparador — cambio de cirugía en móvil
     3. Calculadora de proteína
     4. Calculadora de hidratación

   IMPORTANTE — Carácter educativo:
   Las dos calculadoras devuelven RANGOS ORIENTATIVOS basados
   en valores de referencia de uso común en nutrición
   bariátrica. No son una indicación médica, no diagnostican y
   no sustituyen al médico ni al nutricionista. Cualquier
   cambio en estos números debe validarlo un profesional.
   ========================================================= */
(function () {
  'use strict';

  /* =======================================================
     1. UTILIDADES
     ======================================================= */

  /* Header gana sombra al bajar — igual que en la tienda. */
  function iniciarHeader() {
    var header = document.querySelector('header');
    if (!header) return;
    var esperando = false;
    var sync = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
      esperando = false;
    };
    window.addEventListener('scroll', function () {
      if (!esperando) { esperando = true; requestAnimationFrame(sync); }
    }, { passive: true });
    sync();
  }

  /* Acordeón FAQ. Mismo comportamiento que el de la home:
     un solo panel abierto a la vez. */
  function iniciarFaq() {
    document.querySelectorAll('.faq-lista').forEach(function (lista) {
      lista.querySelectorAll('.faq-pregunta').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.faq-item');
          var abierto = item.classList.contains('abierto');

          lista.querySelectorAll('.faq-item.abierto').forEach(function (otro) {
            otro.classList.remove('abierto');
            otro.querySelector('.faq-pregunta').setAttribute('aria-expanded', 'false');
          });

          if (!abierto) {
            item.classList.add('abierto');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  /* Entrada animada. Usa el motor de mejoras-ux.js si está
     cargado; si no, muestra todo sin animar. */
  function animar(sel, paso) {
    if (window.ZBUX && window.ZBUX.animar) window.ZBUX.animar(sel, paso);
  }

  /* Redondea a múltiplo de 5 — un rango "70 a 90 g" se lee
     mejor que "71 a 88 g" y evita falsa precisión. */
  function a5(n) { return Math.round(n / 5) * 5; }

  /* Lee el valor del grupo de radios con ese name. */
  function radio(form, name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  /* Marca visualmente un campo con error y devuelve false. */
  function pedirDato(input, salida, mensaje) {
    salida.innerHTML =
      '<div class="res-vacio">' + ICONO_INFO + '<div>' + mensaje + '</div></div>';
    if (input) input.focus();
    return false;
  }

  var ICONO_INFO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';

  /* Registra el uso en Analytics, si gtag está disponible. */
  function medir(evento, etiqueta) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', evento, { event_category: 'herramientas', event_label: etiqueta });
    }
  }

  /* =======================================================
     2. COMPARADOR — selector de cirugía en móvil
     ======================================================= */
  function iniciarComparador() {
    var wrap = document.querySelector('.cmp-wrap');
    var chips = document.querySelectorAll('.cmp-chip');
    if (!wrap || !chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        wrap.setAttribute('data-ver', chip.dataset.ver);
        medir('comparador_cirugia', chip.dataset.ver);
      });
    });
  }

  /* =======================================================
     3. CALCULADORA DE PROTEÍNA
     -------------------------------------------------------
     Rangos orientativos en g por kg de peso al día, de uso
     común como referencia educativa en cirugía bariátrica.
     El resultado SIEMPRE se muestra como rango, nunca como
     una cifra exacta: no es una pauta individual.
     ======================================================= */
  var PROTEINA_POR_CIRUGIA = {
    manga:  { min: 1.0, max: 1.3, nombre: 'Manga gástrica' },
    bypass: { min: 1.1, max: 1.5, nombre: 'Bypass gástrico' },
    balon:  { min: 0.9, max: 1.2, nombre: 'Balón gástrico' }
  };

  /* El momento del proceso ajusta el rango. En las primeras
     semanas manda la tolerancia, no la cantidad. */
  var PROTEINA_POR_ETAPA = {
    '0-1':  { factor: 0.85, nombre: 'Primer mes',        nota: 'En las primeras semanas lo habitual es priorizar la <strong>tolerancia</strong> por encima de la cantidad. Suele trabajarse con proteína líquida y tomas pequeñas y repartidas.' },
    '1-3':  { factor: 0.95, nombre: 'De 1 a 3 meses',    nota: 'Etapa de transición: se suele avanzar de líquidos a texturas blandas, subiendo el aporte de forma progresiva.' },
    '3-6':  { factor: 1.00, nombre: 'De 3 a 6 meses',    nota: 'Suele ser el momento en el que se alcanza el aporte objetivo con alimentación blanda y sólida, apoyada con suplementación.' },
    '6+':   { factor: 1.00, nombre: 'Más de 6 meses',    nota: 'Etapa de mantenimiento: el objetivo habitual es sostener el aporte de proteína a largo plazo para cuidar la masa muscular.' }
  };

  var PISO_PROTEINA = 60;    // g/día: referencia mínima habitual
  var TECHO_PROTEINA = 120;  // g/día: por encima, siempre profesional

  function iniciarCalcProteina() {
    var form = document.getElementById('formProteina');
    if (!form) return;
    var salida = document.getElementById('resProteina');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputPeso = document.getElementById('pesoProt');
      var peso = parseFloat(inputPeso.value);
      var cirugia = radio(form, 'cirugia');
      var etapa = radio(form, 'etapa');

      if (!peso || peso < 30 || peso > 300) {
        return pedirDato(inputPeso, salida, 'Escribe tu peso actual en kilos (entre 30 y 300).');
      }
      if (!cirugia) return pedirDato(null, salida, 'Elige el tipo de cirugía.');
      if (!etapa)   return pedirDato(null, salida, 'Elige cuánto tiempo ha pasado desde tu cirugía.');

      var c = PROTEINA_POR_CIRUGIA[cirugia];
      var e2 = PROTEINA_POR_ETAPA[etapa];

      var min = a5(Math.max(PISO_PROTEINA, peso * c.min * e2.factor));
      var max = a5(Math.max(PISO_PROTEINA + 10, peso * c.max * e2.factor));
      if (max <= min) max = min + 10;

      /* Con pesos altos el cálculo por peso actual se dispara:
         las guías usan peso ideal o ajustado, que no se puede
         estimar sin evaluación. Se avisa en vez de inventar. */
      var avisoPeso = '';
      if (max > TECHO_PROTEINA) {
        max = TECHO_PROTEINA;
        avisoPeso =
          '<div class="aviso" style="margin-top:16px">' + ICONO_AVISO +
          '<div>Con tu peso, el cálculo por kilo se queda corto como referencia: ' +
          'los profesionales suelen calcularlo sobre el <strong>peso ideal o ajustado</strong>, ' +
          'que necesita una evaluación. Toma este rango solo como punto de partida para tu consulta.</div></div>';
      }

      var vasos = Math.round(min / 20);   // ~20 g por medida de proteína

      salida.innerHTML =
        '<div class="res-anim">' +
          '<div class="res-label">Rango orientativo diario</div>' +
          '<div class="res-cifra">' + min + ' a ' + max + ' <span class="uni-grande">g/día</span></div>' +
          '<p class="res-nota">Estimación <strong>educativa</strong> para ' + c.nombre.toLowerCase() +
            ', ' + e2.nombre.toLowerCase() + ', con ' + peso + ' kg de peso actual.</p>' +
          '<div class="res-detalle">' +
            '<div class="res-fila"><span>Tipo de cirugía</span><span>' + c.nombre + '</span></div>' +
            '<div class="res-fila"><span>Tiempo desde la cirugía</span><span>' + e2.nombre + '</span></div>' +
            '<div class="res-fila"><span>Equivale aproximadamente a</span><span>' + vasos + ' medidas de proteína</span></div>' +
          '</div>' +
          '<p class="res-nota" style="margin-top:16px">' + e2.nota + '</p>' +
          avisoPeso +
        '</div>';

      medir('calc_proteina', cirugia + '_' + etapa);
      animar('.res-anim', 0);
    });
  }

  var ICONO_AVISO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>' +
    '<path d="M12 9v4M12 17h.01"/></svg>';

  /* =======================================================
     4. CALCULADORA DE HIDRATACIÓN
     -------------------------------------------------------
     Referencia educativa de uso común: 30–35 ml por kg al
     día, ajustado por actividad física. Mínimo orientativo
     de 1.5 L y tope de 3.5 L para no sugerir excesos.
     ======================================================= */
  var ML_MIN = 30, ML_MAX = 35;
  var PISO_AGUA = 1500, TECHO_AGUA = 3500;

  var ACTIVIDAD = {
    baja:   { factor: 1.00, nombre: 'Actividad baja' },
    media:  { factor: 1.10, nombre: 'Actividad moderada' },
    alta:   { factor: 1.20, nombre: 'Actividad alta' }
  };

  function iniciarCalcHidratacion() {
    var form = document.getElementById('formAgua');
    if (!form) return;
    var salida = document.getElementById('resAgua');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputPeso = document.getElementById('pesoAgua');
      var peso = parseFloat(inputPeso.value);
      var act = radio(form, 'actividad');

      if (!peso || peso < 30 || peso > 300) {
        return pedirDato(inputPeso, salida, 'Escribe tu peso en kilos (entre 30 y 300).');
      }
      if (!act) return pedirDato(null, salida, 'Elige tu nivel de actividad física.');

      var a = ACTIVIDAD[act];
      var min = Math.min(TECHO_AGUA, Math.max(PISO_AGUA, peso * ML_MIN * a.factor));
      var max = Math.min(TECHO_AGUA, Math.max(PISO_AGUA + 300, peso * ML_MAX * a.factor));
      if (max <= min) max = min + 300;

      var lMin = (Math.round(min / 100) * 100 / 1000).toFixed(1).replace('.', ',');
      var lMax = (Math.round(max / 100) * 100 / 1000).toFixed(1).replace('.', ',');
      var vasosMin = Math.round(min / 200);
      var vasosMax = Math.round(max / 200);

      salida.innerHTML =
        '<div class="res-anim">' +
          '<div class="res-label">Rango orientativo diario</div>' +
          '<div class="res-cifra">' + lMin + ' a ' + lMax + ' <span class="uni-grande">litros</span></div>' +
          '<p class="res-nota">Estimación <strong>educativa</strong> para ' + peso + ' kg con ' +
            a.nombre.toLowerCase() + '.</p>' +
          '<div class="res-detalle">' +
            '<div class="res-fila"><span>En vasos de 200 ml</span><span>' + vasosMin + ' a ' + vasosMax + ' vasos</span></div>' +
            '<div class="res-fila"><span>Nivel de actividad</span><span>' + a.nombre + '</span></div>' +
            '<div class="res-fila"><span>Repartido en el día</span><span>a sorbos, sin esperar a tener sed</span></div>' +
          '</div>' +
          '<p class="res-nota" style="margin-top:16px">Después de una cirugía bariátrica el estómago admite ' +
            'volúmenes pequeños: lo habitual es repartir el total en <strong>sorbos a lo largo de todo el día</strong> ' +
            'en vez de tomar vasos completos de una vez.</p>' +
        '</div>';

      medir('calc_hidratacion', act);
      animar('.res-anim', 0);
    });
  }

  /* =======================================================
     ARRANQUE
     ======================================================= */
  function iniciar() {
    iniciarHeader();
    iniciarFaq();
    iniciarComparador();
    iniciarCalcProteina();
    iniciarCalcHidratacion();

    /* Entrada suave de los bloques de estas páginas. */
    animar('.rec-card', 55);
    animar('.etapa', 50);
    animar('.faq-item', 45);
    animar('.bloque-header', 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
