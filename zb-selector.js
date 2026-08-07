/* =========================================================
   ZONA BARIÁTRICA — SELECTOR INTELIGENTE DE SUPLEMENTOS
   ---------------------------------------------------------
   Asistente de 3 pasos que FILTRA el catálogo real
   (window.ZB_CATALOGO, definido en zb-catalogo.js).

   ---------------------------------------------------------
   QUÉ HACE Y QUÉ NO HACE — importante
   ---------------------------------------------------------
   Esta herramienta NO recomienda, NO prescribe y NO diagnostica.
   Lo único que hace es ACOTAR el catálogo: de 26 productos
   muestra los que encajan con la etapa y el objetivo elegidos,
   igual que un filtro de tienda. La decisión de qué tomar
   sigue siendo del médico o del nutricionista, y así se dice
   en pantalla junto a los resultados.

   Criterios de filtrado:
     · ETAPA + OBJETIVO  →  filtro real (qué se muestra)
     · CIRUGÍA           →  solo ordena por relevancia y añade
                            una nota de contexto. No se usa para
                            excluir productos: decir "esto no es
                            para tu cirugía" sería una
                            afirmación clínica que no nos toca.

   PARA AJUSTAR: toca ETAPAS_POR_FAMILIA y RELEVANCIA. Nada
   más de este archivo necesita cambios al añadir productos:
   la familia se deduce sola de la categoría.
   ========================================================= */
(function () {
  'use strict';

  var WA = '51961841069';

  /* --- Familias (mismo criterio que productos-info.js) ---- */
  function familiaDe(p) {
    if (p.tipo === 'oferta') return /l[íi]quid/i.test(p.nombre) ? 'proteina_liquida' : 'proteina_polvo';
    if (p.tipo === 'pack')   return 'pack';
    if (p.cat === 'proteina') return /l[íi]quid/i.test(p.nombre) ? 'proteina_liquida' : 'proteina_polvo';
    if (p.cat === 'vitaminas') return 'vitaminas';
    if (p.cat === 'colageno')  return /fibra/i.test(p.nombre) ? 'fibra' : 'colageno';
    return 'proteina_polvo';
  }

  /* --- En qué etapas suele usarse cada familia ------------
     Refleja la progresión habitual de texturas, no una pauta. */
  var ETAPAS_POR_FAMILIA = {
    proteina_liquida: ['0-1', '1-3', '3+'],
    proteina_polvo:   ['1-3', '3+'],
    vitaminas:        ['0-1', '1-3', '3+'],
    fibra:            ['1-3', '3+'],
    colageno:         ['3+'],
    pack:             ['1-3', '3+']
  };

  /* Excepciones por producto. El pack de proteína líquida sí
     encaja en el primer mes porque es líquido. */
  var ETAPAS_EXCEPCION = {
    bp1: ['0-1', '1-3', '3+'],   // Pack Proteína Líquida
    oferta1: ['0-1', '1-3', '3+']// Oferta 2 Proteínas Líquidas
  };

  /* --- Objetivo que cubre cada familia -------------------- */
  var OBJETIVO_POR_FAMILIA = {
    proteina_liquida: 'proteina',
    proteina_polvo:   'proteina',
    vitaminas:        'vitaminas',
    fibra:            'fibra',
    colageno:         'colageno',
    pack:             'pack'
  };

  /* --- Relevancia según cirugía --------------------------
     Solo ORDENA. Un valor más alto aparece antes.
     El bypass tiene mayor malabsorción, por eso hierro y B12
     suben posiciones; en el balón no se modifica la anatomía,
     así que esos pierden prioridad relativa. */
  var RELEVANCIA = {
    bypass: { bi6: 3, bi8: 3, bi7: 2, vitaminas: 1 },
    manga:  { bi7: 2, vitaminas: 1 },
    balon:  { proteina: 1 }
  };

  var ETIQUETA_ETAPA = { '0-1': 'Primer mes', '1-3': '1 a 3 meses', '3+': 'Más de 3 meses' };
  var ETIQUETA_CIRUGIA = { manga: 'Manga gástrica', bypass: 'Bypass gástrico', balon: 'Balón gástrico' };
  var ETIQUETA_OBJETIVO = {
    proteina: 'Proteína', vitaminas: 'Vitaminas', fibra: 'Fibra',
    colageno: 'Colágeno', nose: 'No estoy seguro'
  };

  /* Nota de contexto por cirugía — informativa, sin indicar
     qué tomar. */
  var NOTA_CIRUGIA = {
    manga: 'En la manga gástrica se reduce la capacidad del estómago. La suplementación suele centrarse en cubrir lo que ya no entra por volumen de comida.',
    bypass: 'En el bypass gástrico, además de comer menos, se absorben peor algunos nutrientes. Por eso el seguimiento de hierro y vitamina B12 suele ser más estrecho.',
    balon: 'El balón gástrico no modifica la anatomía digestiva, así que el esquema de suplementación suele ser más ligero que en las técnicas quirúrgicas.'
  };

  /* --- Filtrado ------------------------------------------- */
  function etapasDe(p) {
    return ETAPAS_EXCEPCION[p.id] || ETAPAS_POR_FAMILIA[familiaDe(p)] || ['1-3', '3+'];
  }

  function filtrar(catalogo, sel) {
    var lista = catalogo.filter(function (p) {
      /* Las ofertas duplican productos del catálogo: se dejan
         fuera para no mostrar lo mismo dos veces. */
      if (p.tipo === 'oferta') return false;
      if (etapasDe(p).indexOf(sel.etapa) === -1) return false;

      var obj = OBJETIVO_POR_FAMILIA[familiaDe(p)];
      if (sel.objetivo === 'nose') return true;          // se muestra todo lo de la etapa
      if (sel.objetivo === 'proteina')  return obj === 'proteina' || obj === 'pack';
      if (sel.objetivo === 'vitaminas') return obj === 'vitaminas' || obj === 'pack';
      return obj === sel.objetivo;
    });

    /* Orden por relevancia según cirugía; a igualdad, el más
       barato primero (entrada más accesible). */
    var pesos = RELEVANCIA[sel.cirugia] || {};
    return lista.sort(function (a, b) {
      var pa = pesos[a.id] || pesos[OBJETIVO_POR_FAMILIA[familiaDe(a)]] || 0;
      var pb = pesos[b.id] || pesos[OBJETIVO_POR_FAMILIA[familiaDe(b)]] || 0;
      if (pb !== pa) return pb - pa;
      return a.precio - b.precio;
    });
  }

  /* --- Pintado -------------------------------------------- */
  var ICO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  var ICO_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.855L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.502-5.2-1.379l-.374-.217-3.754.894.944-3.653-.24-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>';

  function tarjeta(p, sel) {
    /* "Ver producto" abre la ficha en la tienda con ?producto= */
    var url = '/?producto=' + encodeURIComponent(p.id);
    var msg = 'Hola Zoe 👋 Vengo del selector de suplementos. Me interesa: ' + p.nombre;
    return '<article class="sel-card">' +
      '<img class="sel-card-img" src="' + p.img + '" alt="' + p.nombre + '" loading="lazy">' +
      '<div class="sel-card-body">' +
        '<div class="sel-card-marca">' + p.marca + '</div>' +
        '<h3 class="sel-card-nom">' + p.nombre + '</h3>' +
        '<div class="sel-card-tags">' +
          '<span class="sel-tag cirugia">' + ETIQUETA_CIRUGIA[sel.cirugia] + '</span>' +
          '<span class="sel-tag etapa">' + ETIQUETA_ETAPA[sel.etapa] + '</span>' +
        '</div>' +
        '<div class="sel-card-precio">S/ ' + p.precio + '</div>' +
        '<a class="sel-card-btn" href="' + url + '">Ver producto' + ICO_FLECHA + '</a>' +
        '<a class="sel-card-btn" style="background:var(--green-wa)" target="_blank" rel="noopener" ' +
           'href="https://wa.me/' + WA + '?text=' + encodeURIComponent(msg) + '">' + ICO_WA + 'Hablar con Zoe</a>' +
      '</div>' +
    '</article>';
  }

  /* --- Arranque ------------------------------------------- */
  function iniciar() {
    var raiz = document.getElementById('selector');
    if (!raiz) return;

    var catalogo = window.ZB_CATALOGO;
    if (!catalogo || !catalogo.length) {
      raiz.innerHTML = '<div class="sel-vacio">No se pudo cargar el catálogo. Recarga la página.</div>';
      return;
    }

    var sel = { cirugia: null, etapa: null, objetivo: null };
    var paso = 1;

    var paneles = raiz.querySelectorAll('.sel-panel');
    var pines = raiz.querySelectorAll('.sel-paso-pin');
    var etiqueta = document.getElementById('selPasoTxt');

    function pintarPaso() {
      paneles.forEach(function (p) {
        p.classList.toggle('activo', +p.dataset.paso === paso);
      });
      pines.forEach(function (pin, i) {
        pin.classList.toggle('hecho', i + 1 < paso);
        pin.classList.toggle('activo', i + 1 === paso);
      });
      if (etiqueta) etiqueta.textContent = paso <= 3 ? 'Paso ' + paso + ' de 3' : 'Resultados';
      /* Al avanzar, subimos al inicio del asistente para que en
         móvil no quede la pregunta fuera de pantalla. */
      var y = raiz.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    raiz.querySelectorAll('.sel-op').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var campo = btn.dataset.campo, valor = btn.dataset.valor;
        sel[campo] = valor;
        /* Se marca la elegida dentro de su propio paso. */
        btn.closest('.sel-opciones').querySelectorAll('.sel-op')
          .forEach(function (o) { o.classList.remove('elegida'); });
        btn.classList.add('elegida');

        paso++;
        if (paso > 3) mostrarResultados(); else pintarPaso();
      });
    });

    raiz.querySelectorAll('.sel-volver').forEach(function (b) {
      b.addEventListener('click', function () {
        if (paso > 1) { paso--; pintarPaso(); }
      });
    });

    var btnReiniciar = document.getElementById('selReiniciar');
    if (btnReiniciar) {
      btnReiniciar.addEventListener('click', function () {
        sel = { cirugia: null, etapa: null, objetivo: null };
        paso = 1;
        raiz.querySelectorAll('.sel-op.elegida').forEach(function (o) { o.classList.remove('elegida'); });
        pintarPaso();
      });
    }

    function mostrarResultados() {
      var salida = document.getElementById('selResultado');
      var lista = filtrar(catalogo, sel);

      var resumen =
        '<div class="sel-resumen">' +
          '<span class="sel-chip-res">' + ETIQUETA_CIRUGIA[sel.cirugia] + '</span>' +
          '<span class="sel-chip-res">' + ETIQUETA_ETAPA[sel.etapa] + '</span>' +
          '<span class="sel-chip-res">' + ETIQUETA_OBJETIVO[sel.objetivo] + '</span>' +
        '</div>';

      var aviso =
        '<div class="aviso" style="margin-bottom:24px">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>' +
          '<div>Esta información es únicamente educativa. Sigue siempre las indicaciones de tu ' +
          'médico o nutricionista.<br><span style="font-weight:400">' + NOTA_CIRUGIA[sel.cirugia] + '</span></div>' +
        '</div>';

      var cuerpo = lista.length
        ? '<div class="sel-grid">' + lista.map(function (p) { return tarjeta(p, sel); }).join('') + '</div>'
        : '<div class="sel-vacio">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
            '<div>No encontramos productos para esa combinación. Escríbele a Zoe y te orienta.</div></div>';

      salida.innerHTML =
        '<h2 class="sel-pregunta">' + lista.length + (lista.length === 1 ? ' producto compatible' : ' productos compatibles') + '</h2>' +
        '<p class="sel-ayuda">Filtrados por tu etapa y lo que buscas. No es una recomendación: es el catálogo acotado.</p>' +
        resumen + aviso + cuerpo;

      paneles.forEach(function (p) { p.classList.remove('activo'); });
      salida.classList.add('activo');
      pines.forEach(function (pin) { pin.classList.add('hecho'); });
      if (etiqueta) etiqueta.textContent = 'Resultados';
      window.scrollTo({
        top: raiz.getBoundingClientRect().top + window.pageYOffset - 90,
        behavior: 'smooth'
      });

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'selector_resultado', {
          event_category: 'herramientas',
          event_label: sel.cirugia + '|' + sel.etapa + '|' + sel.objetivo,
          value: lista.length
        });
      }
    }

    pintarPaso();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
