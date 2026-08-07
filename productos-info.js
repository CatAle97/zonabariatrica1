/* =========================================================
   ZONA BARIÁTRICA — Información ampliada de los productos
   ---------------------------------------------------------
   Alimenta las secciones educativas de la ficha de producto:
     · ¿Para quién suele utilizarse?
     · ¿En qué etapa suele utilizarse?
     · Beneficios generales
     · Forma de consumo
     · Preguntas frecuentes
     · Productos relacionados
     · Artículos relacionados del BariBlog

   ---------------------------------------------------------
   CÓMO SE ADMINISTRA
   ---------------------------------------------------------
   Hay dos niveles, de menor a mayor prioridad:

   1) PLANTILLAS (PLANTILLAS)
      Una por familia de producto. Cubren TODO el catálogo sin
      escribir nada por producto. Si cambias un texto aquí, se
      actualizan todos los productos de esa familia.

   2) FICHAS PROPIAS (POR_PRODUCTO)
      Solo para productos que necesitan un texto distinto.
      Lo que escribas aquí PISA a la plantilla, campo por campo:
      puedes cambiar solo "consumo" y heredar el resto.

   Los productos relacionados y los artículos se calculan solos
   a partir de la categoría. Solo hace falta listarlos a mano
   si quieres forzar unos concretos.

   IMPORTANTE: este contenido es EDUCATIVO. No diagnostica, no
   prescribe y no reemplaza al médico ni al nutricionista.
   ========================================================= */
(function () {
  'use strict';

  /* Frase legal obligatoria: se muestra en TODAS las fichas.
     No quitar. */
  var LEYENDA = 'Consumir únicamente bajo indicación de su médico o nutricionista.';

  /* --- Artículos del BariBlog disponibles -----------------
     'fn' es la función de index.html que abre cada artículo. */
  var ARTICULOS = {
    suplementos: {
      titulo: 'Suplementos de por vida: mitos y verdades después de tu cirugía',
      tag: 'Suplementación',
      fn: 'abrirArticulo'
    },
    cabello: {
      titulo: 'Caída del cabello tras la cirugía: causas, biotina y qué hacer',
      tag: 'Nutrición',
      fn: 'abrirArticuloCabello'
    },
    etapas: {
      titulo: 'Etapas post-operatorias: qué comer y qué tomar en cada fase',
      tag: 'Nutrición',
      fn: 'abrirArticuloEtapas'
    }
  };

  /* --- 1. PLANTILLAS POR FAMILIA -------------------------- */
  var PLANTILLAS = {

    proteina_liquida: {
      paraQuien: 'Suele utilizarse en pacientes bariátricos que aún no toleran texturas sólidas y necesitan cubrir su aporte de proteína en formato líquido.',
      etapa: 'Habitualmente en las primeras semanas tras la cirugía, durante las etapas de líquidos claros y líquidos completos.',
      beneficios: [
        'Formato líquido, listo para tomar, sin necesidad de preparación',
        'Aporte de proteína en un volumen pequeño',
        'Habitualmente mejor tolerado que las texturas sólidas en el post operatorio inicial',
        'Formulado sin lactosa, una intolerancia frecuente después de la cirugía'
      ],
      consumo: 'Se suele repartir en varias tomas pequeñas a lo largo del día, a sorbos y separado de las comidas. La cantidad y la frecuencia las indica el profesional que hace tu seguimiento.',
      faq: [
        { q: '¿Se puede tomar desde el primer día?', r: 'El momento de inicio lo define tu equipo médico. Lo habitual es incorporarlo cuando se avanza de líquidos claros a líquidos completos, no antes.' },
        { q: '¿Hay que diluirlo?', r: 'La proteína líquida viene lista para consumir. Si te resulta muy intensa, algunos equipos permiten diluirla con agua: consúltalo en tu control.' },
        { q: '¿Sustituye una comida?', r: 'Es un suplemento, no un reemplazo de comida por sí solo. Su lugar dentro de tu plan lo define tu nutricionista.' }
      ],
      articulos: ['etapas', 'suplementos']
    },

    proteina_polvo: {
      paraQuien: 'Suele utilizarse en pacientes bariátricos que ya toleran texturas blandas o sólidas y necesitan completar su aporte diario de proteína.',
      etapa: 'Habitualmente a partir de la etapa de blandos, y de forma sostenida durante el mantenimiento a largo plazo.',
      beneficios: [
        'Aporte concentrado de proteína por servicio',
        'Permite ajustar la cantidad según la indicación recibida',
        'Formulado sin lactosa y sin azúcar añadida',
        'Se asocia habitualmente al cuidado de la masa muscular durante la pérdida de peso'
      ],
      consumo: 'Suele disolverse en agua y repartirse en una o varias tomas al día, separado de las comidas principales. Las medidas exactas dependen de la indicación de tu profesional.',
      faq: [
        { q: '¿Cuándo se pasa de proteína líquida a proteína en polvo?', r: 'Suele ocurrir cuando ya toleras texturas blandas, orientativamente a partir del segundo mes. El momento lo marca tu equipo médico, no la etiqueta del producto.' },
        { q: '¿Se puede mezclar con leche?', r: 'Depende de tu tolerancia y de la etapa en la que estés. Muchos pacientes bariátricos tienen intolerancia a la lactosa: consúltalo con tu nutricionista.' },
        { q: '¿Cuántas medidas al día?', r: 'Depende de cuánta proteína cubras con la comida. Puedes usar nuestra calculadora de proteína como referencia educativa y confirmarlo en tu control.' }
      ],
      articulos: ['suplementos', 'etapas']
    },

    vitaminas: {
      paraQuien: 'Suele utilizarse en pacientes bariátricos que necesitan cubrir el aporte de vitaminas y minerales que la alimentación, por el volumen reducido, no alcanza a cubrir.',
      etapa: 'Habitualmente desde las primeras semanas y de forma sostenida en el tiempo, según el esquema que indique el equipo médico.',
      beneficios: [
        'Formato en gomitas, cómodo cuando cuesta tragar cápsulas',
        'Aporte de micronutrientes de control frecuente tras la cirugía',
        'Facilita la adherencia diaria al esquema de suplementación',
        'Presentación pensada para el volumen reducido del post operatorio'
      ],
      consumo: 'Se toma según la cantidad indicada en el envase, preferiblemente acompañando una comida. La dosis que te corresponde la define tu médico o tu nutricionista a partir de tus controles.',
      faq: [
        { q: '¿Por cuánto tiempo se toman?', r: 'En las técnicas quirúrgicas la suplementación suele mantenerse a largo plazo. La duración exacta la determina tu equipo médico según tus analíticas.' },
        { q: '¿Se pueden tomar varias vitaminas juntas?', r: 'Algunos micronutrientes compiten entre sí en la absorción y por eso suele indicarse separarlos. La combinación y los horarios los define tu profesional.' },
        { q: '¿Reemplazan a las pastillas que me recetaron?', r: 'No necesariamente. Antes de sustituir cualquier suplemento indicado, revísalo con quien lleva tu seguimiento.' }
      ],
      articulos: ['suplementos', 'cabello']
    },

    colageno: {
      paraQuien: 'Suele utilizarse en pacientes bariátricos que, además de su suplementación base, buscan apoyar el cuidado de piel, cabello y articulaciones durante la pérdida de peso.',
      etapa: 'Habitualmente a partir de las etapas más avanzadas, cuando la suplementación esencial ya está cubierta.',
      beneficios: [
        'Aporte de colágeno en formato de fácil preparación',
        'Se asocia habitualmente al cuidado de piel, cabello y uñas',
        'Complementa el esquema de suplementación, sin reemplazarlo',
        'Presentación cómoda de integrar en la rutina diaria'
      ],
      consumo: 'Suele disolverse en agua y tomarse una vez al día. La forma de incorporarlo a tu plan la define tu profesional.',
      faq: [
        { q: '¿El colágeno reemplaza a la proteína?', r: 'No. El colágeno no aporta el perfil completo de aminoácidos que se busca con la proteína del post operatorio. Son suplementos con finalidades distintas.' },
        { q: '¿Desde cuándo se puede tomar?', r: 'Suele incorporarse cuando la suplementación esencial —proteína y micronutrientes— ya está cubierta. Consúltalo en tu control.' }
      ],
      articulos: ['cabello', 'suplementos']
    },

    fibra: {
      paraQuien: 'Suele utilizarse en pacientes bariátricos con dificultades de tránsito intestinal, una situación frecuente cuando se reduce mucho el volumen de comida.',
      etapa: 'Habitualmente a partir de las etapas de blandos y sólidos, cuando el tránsito se vuelve más lento.',
      beneficios: [
        'Aporte de fibra soluble en un volumen pequeño',
        'Se asocia habitualmente al apoyo del tránsito intestinal',
        'Se disuelve sin alterar el sabor de la bebida',
        'Formato práctico para sostener el hábito a diario'
      ],
      consumo: 'Suele disolverse en agua y tomarse una vez al día, acompañado de una buena hidratación a lo largo de la jornada. La cantidad la indica tu profesional.',
      faq: [
        { q: '¿Se puede tomar junto con la proteína?', r: 'Suele recomendarse separarlas para no interferir en la tolerancia. La distribución concreta la define tu nutricionista.' },
        { q: '¿Es necesaria si ya como verduras?', r: 'Depende de cuánto volumen toleres. Después de la cirugía suele ser difícil cubrir la fibra solo con alimentos: valóralo en tu control.' }
      ],
      articulos: ['etapas', 'suplementos']
    },

    pack: {
      paraQuien: 'Suele utilizarse en pacientes bariátricos que prefieren cubrir varios frentes de su suplementación en una sola compra, en lugar de ir producto por producto.',
      etapa: 'Depende de los productos que incluye. Revisa el detalle de cada componente o consúltalo antes de comprar.',
      beneficios: [
        'Reúne varios productos que suelen usarse en conjunto',
        'Precio más conveniente que comprar cada artículo por separado',
        'Facilita mantener la constancia del esquema diario',
        'Pensado para cubrir una etapa completa del proceso'
      ],
      consumo: 'Cada producto del pack mantiene su propia forma de consumo. Combínalos siguiendo la indicación de tu equipo médico y las instrucciones de cada envase.',
      faq: [
        { q: '¿El pack sirve para cualquier etapa?', r: 'No todos. Cada pack está pensado para un momento del proceso. Si no estás seguro de cuál te corresponde, consúltalo antes de comprar.' },
        { q: '¿Se pueden cambiar productos dentro del pack?', r: 'Escríbenos por WhatsApp y vemos qué alternativas hay según lo que necesites.' }
      ],
      articulos: ['etapas', 'suplementos']
    }
  };

  /* La familia se deduce de la categoría y del nombre. */
  function familiaDe(p) {
    if (p.tipo === 'pack' || p.tipo === 'oferta') {
      /* Las ofertas son de proteína: usan su plantilla. */
      if (p.tipo === 'oferta') {
        return /l[íi]quid/i.test(p.nombre) ? 'proteina_liquida' : 'proteina_polvo';
      }
      return 'pack';
    }
    if (p.cat === 'proteina') {
      return /l[íi]quid/i.test(p.nombre) ? 'proteina_liquida' : 'proteina_polvo';
    }
    if (p.cat === 'vitaminas') return 'vitaminas';
    if (p.cat === 'colageno') {
      return /fibra/i.test(p.nombre) ? 'fibra' : 'colageno';
    }
    return 'proteina_polvo';
  }

  /* --- 2. FICHAS PROPIAS ---------------------------------
     Solo lo que se quiera cambiar respecto a la plantilla.
     Ejemplo: si aquí pones "consumo", el resto de campos se
     siguen heredando de la familia correspondiente.        */
  var POR_PRODUCTO = {

    bi5: { // Gomitas Biotina 10.000 mcg
      paraQuien: 'Suele utilizarse en pacientes bariátricos preocupados por la caída del cabello, una situación frecuente entre el tercer y el sexto mes tras la cirugía.',
      beneficios: [
        'Aporte de biotina en formato de gomitas masticables',
        'Se asocia habitualmente al cuidado del cabello, la piel y las uñas',
        'Cómodo cuando cuesta tragar cápsulas',
        'Presentación pensada para el volumen reducido del post operatorio'
      ],
      faq: [
        { q: '¿La biotina detiene la caída del cabello?', r: 'La caída post operatoria suele responder a varios factores a la vez —pérdida de peso rápida, déficit de proteína y de hierro, entre otros—. La biotina es uno de los apoyos habituales, pero no actúa sola. Revísalo con tu nutricionista.' },
        { q: '¿Cuándo se empieza a notar?', r: 'El cabello crece despacio: los cambios suelen valorarse después de varios meses de constancia.' },
        { q: '¿Interfiere con análisis de laboratorio?', r: 'Sí. La biotina en dosis altas puede alterar algunos análisis, sobre todo los de tiroides. Avisa siempre en el laboratorio que la estás tomando.' }
      ],
      articulos: ['cabello', 'suplementos']
    },

    bi6: { // Gomitas Hierro + Vitamina C
      paraQuien: 'Suele utilizarse en pacientes bariátricos que necesitan apoyar su aporte de hierro, un control frecuente sobre todo después de un bypass gástrico.',
      faq: [
        { q: '¿Por qué se combina el hierro con vitamina C?', r: 'La vitamina C favorece la absorción del hierro, por eso es habitual encontrarlos juntos en la misma presentación.' },
        { q: '¿Se puede tomar junto con el calcio?', r: 'Suele indicarse separarlos, porque el calcio interfiere en la absorción del hierro. Los horarios los define tu profesional.' },
        { q: '¿Cómo sé si necesito hierro?', r: 'Se determina con analíticas. No se debe iniciar ni suspender por cuenta propia.' }
      ],
      articulos: ['suplementos', 'cabello']
    },

    bi8: { // Gomitas B12 + Ácido Fólico
      paraQuien: 'Suele utilizarse en pacientes bariátricos que necesitan apoyar su aporte de vitamina B12, un control habitual tras el bypass gástrico por la menor absorción.',
      faq: [
        { q: '¿Por qué la B12 es tan importante tras el bypass?', r: 'Parte de la absorción de la B12 ocurre en el tramo del estómago e intestino que la cirugía modifica, por eso suele requerir suplementación sostenida.' },
        { q: '¿Se toma de por vida?', r: 'En muchos casos sí, aunque la duración y la dosis las determina tu equipo médico según tus analíticas.' }
      ],
      articulos: ['suplementos']
    },

    bi9: { // Fibra Soluble
      faq: [
        { q: '¿Cuánta agua hay que tomar con la fibra?', r: 'La fibra necesita líquido para funcionar bien. Suele recomendarse acompañarla de una hidratación adecuada durante el día: puedes ver un rango orientativo en nuestra calculadora de hidratación.' },
        { q: '¿Se puede tomar todos los días?', r: 'La frecuencia la indica tu nutricionista según tu tránsito y tu alimentación.' }
      ]
    }

  };

  /* --- 2b. COMPLEMENTARIOS (Fase 3) -----------------------
     Qué suele acompañar a qué. Distinto de "relacionados":
     relacionados = alternativas de la MISMA categoría;
     complementarios = productos de OTRA categoría que suelen
     usarse en conjunto. Por eso una proteína no sugiere otra
     proteína, sino vitaminas, fibra o colágeno.

     PARA EDITAR: cambia las categorías de cada familia. Los
     productos concretos se eligen solos del catálogo.       */
  var COMPLEMENTARIOS_POR_FAMILIA = {
    proteina_liquida: ['vitaminas', 'colageno'],
    proteina_polvo:   ['vitaminas', 'colageno'],
    vitaminas:        ['proteina', 'colageno'],
    colageno:         ['proteina', 'vitaminas'],
    fibra:            ['proteina', 'vitaminas'],
    pack:             ['proteina', 'vitaminas']
  };

  /* Etiquetas de cirugía por familia. Son informativas: dicen
     en qué contextos suele aparecer el producto, no que esté
     indicado ni contraindicado para una técnica concreta. */
  var CIRUGIAS_POR_FAMILIA = {
    proteina_liquida: ['Manga gástrica', 'Bypass gástrico', 'Balón gástrico'],
    proteina_polvo:   ['Manga gástrica', 'Bypass gástrico', 'Balón gástrico'],
    vitaminas:        ['Manga gástrica', 'Bypass gástrico'],
    colageno:         ['Manga gástrica', 'Bypass gástrico', 'Balón gástrico'],
    fibra:            ['Manga gástrica', 'Bypass gástrico', 'Balón gástrico'],
    pack:             ['Manga gástrica', 'Bypass gástrico']
  };

  /* Etiquetas de etapa por familia — mismo criterio que usa el
     Selector Inteligente (zb-selector.js). */
  var ETAPAS_POR_FAMILIA = {
    proteina_liquida: ['Primer mes', '1 a 3 meses', 'Más de 3 meses'],
    proteina_polvo:   ['1 a 3 meses', 'Más de 3 meses'],
    vitaminas:        ['Primer mes', '1 a 3 meses', 'Más de 3 meses'],
    colageno:         ['Más de 3 meses'],
    fibra:            ['1 a 3 meses', 'Más de 3 meses'],
    pack:             ['1 a 3 meses', 'Más de 3 meses']
  };

  /* --- 3. RESOLUCIÓN ---------------------------------------
     Combina plantilla + ficha propia y calcula relacionados,
     complementarios, etiquetas y artículos si no se
     especificaron a mano.                                    */
  function info(p, catalogo) {
    if (!p) return null;

    var fam = familiaDe(p);
    var base = PLANTILLAS[fam] || PLANTILLAS.proteina_polvo;
    var propia = POR_PRODUCTO[p.id] || {};

    var d = {
      descripcion: propia.descripcion || p.desc || '',
      paraQuien:  propia.paraQuien  || base.paraQuien,
      etapa:      propia.etapa      || base.etapa,
      beneficios: propia.beneficios || base.beneficios,
      consumo:    propia.consumo    || base.consumo,
      faq:        propia.faq        || base.faq,
      leyenda:    LEYENDA,
      etiquetasCirugia: propia.etiquetasCirugia || CIRUGIAS_POR_FAMILIA[fam] || [],
      etiquetasEtapa:   propia.etiquetasEtapa   || ETAPAS_POR_FAMILIA[fam]   || []
    };

    /* Complementarios: de otras categorías, los más baratos de
       cada una para que la suma no asuste. Máximo 3. */
    var comp = propia.complementarios;
    if (!comp && catalogo) {
      var cats = COMPLEMENTARIOS_POR_FAMILIA[fam] || [];
      comp = [];
      cats.forEach(function (c) {
        var candidatos = catalogo
          .filter(function (o) {
            return o.id !== p.id && o.cat === c &&
                   o.tipo !== 'pack' && o.tipo !== 'oferta';
          })
          .sort(function (a, b) { return a.precio - b.precio; });
        if (candidatos.length) comp.push(candidatos[0].id);
        if (candidatos.length > 1 && cats.length === 1) comp.push(candidatos[1].id);
      });
      /* Se completa hasta 3 con lo más barato que quede. */
      if (comp.length < 3 && catalogo) {
        catalogo
          .filter(function (o) {
            return o.id !== p.id && o.cat !== p.cat &&
                   o.tipo !== 'pack' && o.tipo !== 'oferta' &&
                   comp.indexOf(o.id) === -1;
          })
          .sort(function (a, b) { return a.precio - b.precio; })
          .slice(0, 3 - comp.length)
          .forEach(function (o) { comp.push(o.id); });
      }
      comp = comp.slice(0, 3);
    }
    d.complementarios = comp || [];

    /* Productos relacionados: los de la misma categoría, sin
       repetir el actual. Máximo 4. Se puede forzar a mano con
       "relacionados: ['bi1','bi2']" en la ficha propia. */
    var ids = propia.relacionados;
    if (!ids && catalogo) {
      ids = catalogo
        .filter(function (o) { return o.id !== p.id && o.cat === p.cat; })
        .slice(0, 4)
        .map(function (o) { return o.id; });
    }
    d.relacionados = ids || [];

    /* Artículos del blog. */
    var claves = propia.articulos || base.articulos || [];
    d.articulos = claves.map(function (k) { return ARTICULOS[k]; }).filter(Boolean);

    return d;
  }

  /* Se expone al index.html, que lo usa al abrir el modal. */
  window.ZB_PRODUCTO_INFO = {
    obtener: info,
    LEYENDA: LEYENDA,
    PLANTILLAS: PLANTILLAS,
    POR_PRODUCTO: POR_PRODUCTO,
    ARTICULOS: ARTICULOS
  };
})();
