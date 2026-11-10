/* =========================================================
   ZOE — BASE DE CONOCIMIENTO
   ---------------------------------------------------------
   AQUÍ SE EDITAN LAS RESPUESTAS DE ZOE. No hace falta tocar
   asistente.js: ese archivo solo contiene el motor del chat.

   Cada entrada tiene:
     intent      nombre interno, único
     keywords    palabras o frases que disparan la respuesta
     response    lo que contesta Zoe (admite HTML sencillo)
     followUp    pregunta opcional para seguir la conversación
     productos   ids del catálogo que se muestran debajo
     aviso       true → añade la nota "consulta con tu médico"

   CÓMO PUNTÚA LA DETECCIÓN
   Gana la intención cuyas palabras clave sumen más puntos.
   Una frase de varias palabras ("proteina liquida") puntúa más
   que una suelta ("proteina"), así que conviene escribir las
   más específicas. Si nada supera el mínimo, Zoe responde que
   no lo sabe en vez de inventar.

   REGLAS DE CONTENIDO
   · Nada de diagnósticos, dosis ni prescripciones.
   · Lenguaje general: "suele", "habitualmente".
   · Los precios deben coincidir con zb-catalogo.js.
   ========================================================= */
(function () {
  'use strict';

  /* Precios — mantener en línea con el catálogo. */
  var P = {
    whey: 280, wheyPack: 520,
    liquida: 200, liquidaPack: 360,
    gomitas: 150,
    fibraBN: 85,
    lvlProt: 209, lvlColag: 109, lvlFibra: 79,
    nfIsolate: 295, nfIsolatePack: 580
  };

  var AVISO = 'La información es referencial y puede variar según cada paciente.';

  /* --- Intenciones -------------------------------------- */
  var INTENCIONES = [

    /* ============ CORTESÍA ============ */
    {
      intent: 'saludo',
      keywords: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'holi', 'hey'],
      response: '¡Hola! ¿En qué te ayudo?',
      followUp: 'Puedes preguntarme por productos, envíos, pagos o dudas del proceso bariátrico.'
    },
    {
      intent: 'agradecimiento',
      keywords: ['gracias', 'muchas gracias', 'te pasaste', 'genial', 'perfecto'],
      response: 'Con gusto 😊 ¿Te ayudo con algo más?'
    },
    {
      intent: 'despedida',
      keywords: ['adios', 'chau', 'hasta luego', 'nos vemos', 'bye'],
      response: 'Que te vaya muy bien. Aquí estoy cuando necesites.'
    },

    /* ============ PRODUCTOS ============ */
    {
      intent: 'proteina_liquida',
      keywords: ['proteina liquida', 'liquid protein', 'proteina bebible', 'liquida', 'lista para tomar', 'no puedo con el polvo'],
      response: 'La <b>proteína líquida</b> viene lista para tomar, sin preparar. Tenemos dos líneas:<br><br>' +
                '🥛 <b>Liquid Protein — Bari &amp; Nutrition</b> · 1 L<br>' +
                '20 g de proteína en 30 ml, sin lactosa y 0 % azúcar. Fresa o Maracumango.<br><br>' +
                '🍊 <b>READY-GDC — Safie Pharma</b> · 1 L<br>' +
                '20 g de proteína y 4 g de L-arginina en 30 ml, con colágeno hidrolizado y vitaminas. Naranja o Neutro.<br><br>' +
                'Suele usarse en las primeras semanas, cuando todavía cuesta tolerar texturas. ' +
                'Abajo tienes los precios del día, y llevando 2 hay precio de pack.',
      familia: 'proteina_liquida',
      productos: ['bi3', 'bi4', 'sp3', 'sp4'],
      aviso: true
    },
    {
      intent: 'proteina_polvo',
      keywords: ['proteina en polvo', 'whey', 'polvo', 'scoop', 'batido', 'proteina de polvo', 'high iso'],
      response: 'En proteína en polvo tienes <b>cinco marcas</b>:<br><br>' +
                '💪 <b>Whey Protein — Bari &amp; Nutrition</b> · 1.5 kg<br>' +
                '30 g de proteína por servicio, con biotina. Vainilla o Chocolate.<br><br>' +
                '💪 <b>HIGH ISO — LVL Drink</b> · 1 kg<br>' +
                '27 g de proteína por porción, endulzada con stevia. Vainilla o Chocolate.<br><br>' +
                '💪 <b>Whey Protein Isolate — Nutrifath</b> · 1 kg<br>' +
                '23 g de proteína por porción de 25 g, con vitaminas y minerales. Sabor neutro.<br><br>' +
                '💪 <b>GENO DEEP CARE ADVANCE — Safie Pharma</b> · 400 g<br>' +
                'Whey isolate con micronutrientes; la neutra lleva además colágeno hidrolizado. Neutro o Chocolate.<br><br>' +
                '💪 <b>D-Protin — Nutranex</b> · 275 g<br>' +
                'Doble fuente de proteína (caseinato de calcio y suero aislado), sin azúcar ni grasas. Sabor neutro.<br><br>' +
                'Las de <b>sabor neutro</b> se mezclan con agua o con lo que ya preparas sin cambiarle el gusto, ' +
                'una buena opción si los sabores dulces te cansan. Abajo tienes los precios del día.',
      followUp: '¿Quieres que te ayude a elegir según tu etapa?',
      familia: 'proteina_polvo',
      productos: ['bi1', 'li1', 'nf1', 'sp1', 'nx1'],
      aviso: true
    },
    {
      intent: 'diferencia_proteinas',
      keywords: ['diferencia entre proteina', 'liquida o polvo', 'cual proteina', 'que proteina es mejor', 'diferencia proteina liquida polvo'],
      response: 'La diferencia principal es la <b>textura y el momento</b> en que se usan:<br><br>' +
                '🥛 <b>Líquida</b> — lista para tomar. Habitual en las primeras semanas, cuando se toleran solo líquidos.<br>' +
                '💪 <b>En polvo</b> — se prepara con agua. Habitual más adelante, con blandos y sólidos.<br><br>' +
                'Ninguna es mejor que la otra: responden a etapas distintas.',
      followUp: '¿Quieres que te muestre las de tu etapa?',
      aviso: true
    },
    {
      intent: 'vitaminas',
      keywords: ['vitaminas', 'multivitaminico', 'gomitas', 'biotina', 'hierro', 'b12', 'acido folico', 'micronutrientes'],
      response: 'Tenemos vitaminas en dos formatos:<br><br>' +
                '🍬 <b>Gomitas — Bari &amp; Nutrition</b>, más fáciles de tomar que las cápsulas:<br>' +
                '🟢 Multivitamínico · 🟡 Biotina 10.000 mcg<br>🟠 Hierro + Vitamina C · 🔵 B12 + Ácido fólico<br><br>' +
                '💊 <b>Multivitamínico Completo — Bariatric Fusion</b>, marca estadounidense especializada en pacientes bariátricos. ' +
                'Tabletas masticables (120 por envase), sabor Tropical o Bayas mixtas.<br><br>' +
                'Abajo tienes los precios del día.',
      familia: 'vitaminas',
      productos: ['bi7', 'bi5', 'bi6', 'bi8', 'bf1', 'bf2'],
      aviso: true
    },
    {
      intent: 'fibra',
      keywords: ['fibra', 'estreñimiento', 'estrenimiento', 'no puedo ir al baño', 'transito', 'ir al baño', 'estreñida', 'estreñido'],
      response: 'La <b>fibra</b> es un apoyo habitual cuando el tránsito se vuelve lento, algo frecuente al comer menos cantidad. ' +
                'Se disuelve en agua y no cambia el sabor de la bebida.<br><br>' +
                'Tienes dos opciones:<br><br>' +
                '🌿 <b>Fibra Soluble — Bari &amp; Nutrition</b> · 320 g, sabor neutro<br><br>' +
                '🍏 <b>GET OUT — LVL Drink</b> · 200 g, sabor manzana verde<br><br>' +
                'Conviene acompañarla de una buena hidratación durante el día. Abajo tienes los precios del día.',
      familia: 'fibra',
      productos: ['bi9', 'li4'],
      aviso: true
    },
    {
      intent: 'colageno',
      keywords: ['colageno', 'piel', 'uñas', 'articulaciones', 'skinfinity'],
      response: 'El <b>colágeno</b> se asocia habitualmente al cuidado de piel, cabello y uñas. ' +
                'Suele incorporarse cuando la suplementación esencial —proteína y vitaminas— ya está cubierta.<br><br>' +
                'Tenemos dos:<br><br>' +
                '🦴 <b>Colágeno Hidrolizado — Bari &amp; Nutrition</b> · 500 g, con calcio y vitamina D, sabor arándano.<br><br>' +
                '✨ <b>SKINFINITY — LVL Drink</b> · 500 g, con camu camu, arándano y biotina.<br><br>' +
                'Ojo: el colágeno <b>no reemplaza</b> a la proteína. Son cosas distintas.',
      familia: 'colageno',
      productos: ['bi10', 'li3'],
      aviso: true
    },
    {
      intent: 'precios',
      keywords: ['precio', 'precios', 'cuanto cuesta', 'cuanto vale', 'costo', 'valor', 'cuanto sale', 'lista de precios'],
      /* dinamico: asistente.js arma la respuesta con los precios del catálogo
         (zb-catalogo.js). Este texto solo se usa si el catálogo no carga. */
      dinamico: 'precios',
      response: 'Los precios de cada producto están en su ficha de la tienda.',
      followUp: 'Escríbeme el producto o la marca y te digo su precio exacto.'
    },
    {
      intent: 'promociones',
      keywords: ['promocion', 'promo', 'oferta', 'descuento', 'rebaja', 'packs', 'combo'],
      dinamico: 'promociones',
      response: 'Sí, tenemos <b>packs</b> con mejor precio que comprando por separado, y ofertas por llevar 2 unidades. ' +
                'Los ves todos en la sección de ofertas y packs de la tienda.',
      followUp: '¿Quieres ver los packs completos?'
    },

    /* ============ CIRUGÍAS Y ETAPAS ============ */
    {
      intent: 'manga',
      keywords: ['manga gastrica', 'manga', 'sleeve', 'gastrectomia vertical'],
      response: 'En la <b>manga gástrica</b> se reduce la capacidad del estómago. ' +
                'Como entra menos comida, la suplementación suele centrarse en cubrir lo que ya no se alcanza con la alimentación: ' +
                'proteína y micronutrientes.',
      followUp: '¿Cuánto tiempo llevas desde tu cirugía?',
      aviso: true
    },
    {
      intent: 'bypass',
      keywords: ['bypass', 'by pass', 'baipas', 'derivacion gastrica'],
      response: 'En el <b>bypass gástrico</b>, además de comer menos, se absorben peor algunos nutrientes. ' +
                'Por eso el seguimiento de <b>hierro</b> y <b>vitamina B12</b> suele ser más estrecho que en otras técnicas.',
      followUp: '¿Cuánto tiempo llevas desde tu cirugía?',
      aviso: true
    },
    {
      intent: 'balon',
      keywords: ['balon gastrico', 'balon', 'baloon'],
      response: 'El <b>balón gástrico</b> no modifica la anatomía digestiva, así que el esquema de suplementación ' +
                'suele ser más ligero que en las técnicas quirúrgicas. La proteína sigue siendo habitual para cuidar la masa muscular.',
      followUp: '¿Cuánto tiempo llevas con el balón?',
      aviso: true
    },
    {
      intent: 'etapas',
      keywords: ['etapas', 'fases', 'que puedo comer', 'liquidos claros', 'purés', 'pures', 'blandos', 'post operatorio', 'postoperatorio'],
      response: 'La alimentación avanza por fases: <b>líquidos claros → líquidos completos → purés → blandos → sólidos</b>.<br><br>' +
                'Cada fase determina qué texturas se toleran, y eso cambia qué productos tienen sentido.<br><br>' +
                'Tenemos una guía completa en <a href="/etapas-postoperatorias" style="color:#2563EB;font-weight:600">Etapas Postoperatorias</a>.',
      aviso: true
    },
    {
      intent: 'porque_suplementar',
      keywords: ['por que suplementar', 'porque suplementos', 'para que sirven los suplementos',
                 'necesito suplementos', 'por que tomar suplementos', 'tomar suplementos',
                 'tomar suplemento', 'para que suplementar', 'para que sirve la suplementacion',
                 'por que suplementan'],
      response: 'Después de la cirugía el estómago admite mucho menos volumen, y en algunas técnicas también se absorbe menos. ' +
                'Con esa cantidad de comida es difícil cubrir la proteína y los micronutrientes solo con alimentos.<br><br>' +
                'Por eso la suplementación es habitual: complementa lo que la alimentación ya no alcanza a aportar.',
      aviso: true
    },
    {
      intent: 'suplementacion_de_por_vida',
      keywords: ['de por vida', 'para siempre', 'toda la vida', 'cuanto tiempo tomar', 'hasta cuando tomo', 'siempre voy a tomar'],
      response: 'En las técnicas quirúrgicas la suplementación suele mantenerse <b>a largo plazo</b>, ' +
                'porque el cuerpo sigue absorbiendo menos que antes de la cirugía.',
      aviso: true
    },
    {
      intent: 'no_tomo_vitaminas',
      keywords: ['si no tomo vitaminas', 'que pasa si no tomo', 'dejo de tomar', 'no tomo mis vitaminas', 'olvido las vitaminas'],
      response: 'La suplementación se indica precisamente para prevenir déficits que son frecuentes después de la cirugía. ' +
                'Dejarla puede reflejarse en las analíticas de control.<br><br>' +
                'Si te cuesta mantenerla, coméntalo en tu control: se puede ajustar el formato para que te resulte más llevadero.',
      aviso: true
    },
    {
      intent: 'importancia_proteina',
      keywords: ['por que proteina', 'importancia de la proteina', 'para que la proteina', 'por que es importante la proteina'],
      response: 'Un aporte adecuado de proteína se asocia habitualmente al <b>cuidado de la masa muscular</b> durante la pérdida de peso, ' +
                'a la cicatrización y a la caída de cabello que muchos pacientes notan en los primeros meses.<br><br>' +
                'Al comer poco volumen, cubrirla solo con alimentos suele ser difícil.',
      aviso: true
    },
    {
      intent: 'caida_cabello',
      keywords: ['cabello', 'pelo', 'se me cae el pelo', 'caida del cabello', 'calvicie', 'alopecia'],
      response: 'La caída de cabello es frecuente entre el tercer y el sexto mes. Suele responder a varios factores a la vez: ' +
                'pérdida de peso rápida, aporte insuficiente de proteína y déficit de hierro, entre otros.<br><br>' +
                'Lo que más se trabaja es sostener la proteína y la suplementación indicada. La biotina es un apoyo habitual, pero no actúa sola.',
      productos: ['bi5'],
      aviso: true
    },
    {
      intent: 'nauseas',
      keywords: ['nauseas', 'vomito', 'me da asco', 'no me pasa', 'me cae mal', 'intolerancia'],
      response: 'En las primeras semanas es frecuente que cueste tolerar ciertos sabores o texturas. ' +
                'Suele ayudar tomar cantidades pequeñas, muy repartidas y a temperatura fría.<br><br>' +
                'Si las náuseas son persistentes, es importante comentarlo con tu equipo médico.',
      aviso: true
    },

    /* ============ COMPRA Y LOGÍSTICA ============ */
    {
      intent: 'envios',
      keywords: ['envio', 'envios', 'delivery', 'llega', 'mandan', 'provincia', 'shalom', 'cuanto demora', 'reparto'],
      response: 'Enviamos a <b>todo el Perú</b>.<br><br>' +
                '📍 <b>Lima</b> — el costo depende del distrito.<br>' +
                '🚚 <b>Provincias</b> — vía Shalom.<br><br>' +
                'En Lima el delivery se calcula según tu distrito al finalizar la compra. A provincias llega en 2 a 5 días hábiles.',
      followUp: '¿A qué ciudad sería tu pedido?'
    },
    {
      intent: 'pagos',
      keywords: ['pago', 'pagar', 'yape', 'izipay', 'tarjeta', 'transferencia', 'como pago', 'formas de pago', 'contraentrega'],
      response: 'Puedes pagar con <b>tarjeta</b> (débito o crédito, en línea con Izipay) o con <b>Yape</b>: en Lima al recibir tu pedido; a provincias se paga <b>antes del envío</b>.<br><br>' +
                'El pago con tarjeta tiene un recargo del 4 %, que se calcula solo en tu pedido.<br><br>' +
                'Todo se hace en la web: al finalizar la compra eliges cómo pagar.'
    },
    {
      intent: 'pedido',
      keywords: ['mi pedido', 'como compro', 'como pedir', 'hacer un pedido', 'comprar', 'donde esta mi pedido', 'seguimiento'],
      response: 'Para comprar: agregas los productos al carrito, pulsas <b>Finalizar compra</b>, completas tus datos y eliges cómo pagar (tarjeta en línea o Yape). ' +
                'Luego te contactamos para coordinar la entrega.<br><br>' +
                'Si ya hiciste un pedido y quieres consultar su estado, lo mejor es escribirnos por WhatsApp.'
    },
    {
      intent: 'horarios',
      keywords: ['horario', 'horarios', 'atienden', 'a que hora', 'cuando atienden', 'estan disponibles'],
      response: 'Atendemos de <b>lunes a sábado, de 9 am a 8 pm</b>.<br><br>' +
                'Fuera de ese horario puedes dejarnos tu mensaje por WhatsApp y respondemos apenas abrimos.'
    },
    {
      intent: 'tienda_fisica',
      keywords: ['tienda fisica', 'local', 'direccion', 'donde estan', 'puedo ir', 'recoger'],
      response: 'Trabajamos <b>en línea</b> y enviamos a todo el Perú. ' +
                'Para coordinar una entrega en Lima o resolver cualquier duda, escríbenos por WhatsApp.'
    },
    {
      intent: 'marcas',
      keywords: ['marca', 'marcas', 'bari nutrition', 'que marcas', 'que marcas tienen', 'que marcas trabajan'],
      dinamico: 'marcas',
      response: 'Trabajamos con marcas especializadas en pacientes bariátricos. ' +
                'Todos los productos tienen su tabla nutricional en la ficha.'
    },
    {
      intent: 'sabores',
      keywords: ['sabor', 'sabores', 'que sabores', 'vainilla', 'chocolate', 'fresa', 'maracumango'],
      response: '<b>Proteína líquida B&amp;N</b> — Fresa y Maracumango.<br>' +
                '<b>READY-GDC (líquida)</b> — Naranja y Neutro.<br>' +
                '<b>Whey B&amp;N</b> — Vainilla y Chocolate.<br>' +
                '<b>HIGH ISO LVL</b> — Vainilla y Chocolate.<br>' +
                '<b>GENO DEEP CARE</b> — Neutro y Chocolate.<br>' +
                '<b>Nutrifath</b> y <b>Nutranex D-Protin</b> — Neutro.<br>' +
                '<b>Multivitamínico Bariatric Fusion</b> — Tropical y Bayas mixtas.<br><br>' +
                'El sabor se elige al agregar el producto al carrito.'
    },
    {
      intent: 'tabla_nutricional',
      keywords: ['tabla nutricional', 'informacion nutricional', 'ingredientes', 'composicion', 'etiqueta'],
      response: 'Cada producto tiene su <b>tabla nutricional en foto</b> dentro de su ficha: ' +
                'ábrelo y desliza a la segunda imagen. Puedes ampliarla con el zoom.'
    },
    {
      intent: 'whatsapp',
      keywords: ['whatsapp', 'asesor', 'hablar con alguien', 'persona', 'humano', 'contacto', 'telefono', 'numero'],
      response: 'Claro, te paso con nuestro equipo por WhatsApp.',
      accion: 'whatsapp'
    },

    /* ============ FLUJO GUIADO ============ */
    {
      intent: 'buscar_suplemento',
      keywords: ['que suplemento necesito', 'que me toca', 'que debo tomar', 'que necesito tomar', 'no se que tomar',
                 'que suplemento', 'ayudame a elegir', 'recomiendame', 'que me recomiendas', 'que compro'],
      response: 'Te ayudo a ubicarlo. Son tres preguntas rápidas.',
      accion: 'flujo_producto'
    },
    {
      intent: 'ver_productos',
      keywords: ['ver productos', 'catalogo', 'que venden', 'que tienen', 'mostrar productos', 'quiero ver proteinas', 'ver proteinas'],
      response: 'Puedes ver todo el catálogo en la tienda. ¿Buscas algo en concreto?',
      followUp: 'Dime si te interesa proteína, vitaminas, fibra o colágeno.'
    }
  ];

  /* =========================================================
     ORIENTACIÓN POR ETAPA
     ---------------------------------------------------------
     Cuando el usuario dice cuánto tiempo lleva, Zoe le cuenta
     QUÉ SE SUELE USAR en ese momento. No es una indicación:
     es información general sobre la progresión habitual, que
     es justo lo que la persona quiere saber.

     Sigue sin decir dosis, cantidades ni "tú necesitas". Habla
     de lo que "suele usarse", y siempre cierra recordando que
     lo confirma el profesional.
     ========================================================= */
  var POR_ETAPA = {
    '0-1s': {
      titulo: 'los primeros días',
      texto: 'En esta etapa lo habitual son <b>líquidos claros</b>, según lo que indique tu equipo médico. ' +
             'La prioridad es la hidratación y la tolerancia, no la cantidad.<br><br>' +
             'La suplementación suele empezar un poco más adelante, cuando se pasa a líquidos completos. ' +
             'Si buscas algo en particular, dime qué y te ubico el producto.',
      productos: []
    },
    '1-4s': {
      titulo: 'las primeras semanas',
      texto: 'En esta etapa se suele trabajar con <b>proteína líquida</b>, porque se tolera mejor que cualquier textura sólida, ' +
             'y es habitual que ya se incorporen las <b>vitaminas</b>.<br><br>' +
             'Lo que más se usa en este momento:',
      productos: ['bi3', 'bi4', 'bi7']
    },
    '1-3m': {
      titulo: 'entre el primer y el tercer mes',
      texto: 'Suele ser el momento en que se pasa de líquida a <b>proteína en polvo</b>, y en que las <b>vitaminas</b> ya forman parte de la rutina diaria. ' +
             'Si aparece estreñimiento, también es cuando suele entrar la fibra.<br><br>' +
             'Lo habitual en esta etapa:',
      productos: ['bi1', 'li1', 'nf1', 'bi7', 'bi9']
    },
    '3m+': {
      titulo: 'a partir del tercer mes',
      texto: 'Aquí ya se entra en <b>mantenimiento</b>: se sostiene la proteína y la suplementación indicada a largo plazo. ' +
             'Es también cuando más aparece la caída de cabello, y cuando suele incorporarse el colágeno.<br><br>' +
             'Lo que más se usa en esta etapa:',
      productos: ['bi1', 'li1', 'nf1', 'bi7', 'bi5', 'li3']
    }
  };

  /* --- Consultas médicas: derivación segura --------------
     Si el mensaje contiene algo de esto, Zoe no responde con
     contenido: deriva al profesional. Va por delante de
     cualquier otra intención. */
  var TEMAS_MEDICOS = [
    'mi analisis', 'mis analisis', 'analitica', 'mi resultado', 'mis resultados',
    'me duele', 'dolor', 'sangre', 'fiebre', 'infeccion', 'medicamento', 'pastilla recetada',
    'puedo dejar', 'dejo el tratamiento', 'suspender', 'mi hemoglobina', 'mi ferritina',
    'estoy embarazada', 'embarazo', 'lactancia', 'diabetes', 'presion alta',
    'me operaron mal', 'complicacion',
    /* Cantidades y dosis: Zoe nunca las indica. */
    'cuantos gramos', 'cuantas gramos', 'que dosis', 'cuanta dosis', 'cuantas capsulas',
    'cuantos scoops debo', 'cuanto debo tomar', 'cuanta proteina debo', 'cuantas veces al dia',
    'dosis', 'cuantas tabletas', 'cuantas gomitas', 'cuantas tomas'
  ];

  /* TONO — importante:
     Zoe nunca corta en seco. Reconoce lo que no sabe, dice
     claramente en qué SÍ puede ayudar y ofrece una salida.
     Nunca deja al usuario con un "no puedo" y punto. */
  var RESPUESTA_MEDICA =
    'Eso mejor lo revisas con tu médico o tu nutricionista: son quienes conocen tu caso, ' +
    'tus analíticas y lo que te indicaron. No quisiera darte un dato que no encaje contigo.<br><br>' +
    'Lo que sí puedo hacer es contarte <b>qué suplementos se suelen usar</b> en tu etapa ' +
    'y ayudarte a ubicarlos.';

  var RESPUESTA_DESCONOCIDA =
    'Esa no la tengo bien resuelta y prefiero no darte un dato equivocado.<br><br>' +
    'Donde sí te ayudo bien es con <b>productos y precios</b>, <b>qué se suele usar en cada etapa</b>, ' +
    '<b>envíos</b> y <b>formas de pago</b>. Pregúntame por ahí y te lo cuento.<br><br>' +
    'Y si prefieres, te paso con el equipo y lo ven contigo.';

  /* --- Sugerencias iniciales (chips discretos) ----------- */
  var SUGERENCIAS = [
    { texto: '¿Qué suplemento necesito?', envia: 'que suplemento necesito' },
    { texto: 'Envíos a provincia',        envia: 'envios a provincia' },
    { texto: 'Quiero ver proteínas',      envia: 'quiero ver proteinas' }
  ];

  /* --- Etapas por familia de producto -------------------
     Mismo criterio que /encuentra-tu-suplemento. Si cambia
     allí, cambiarlo aquí también. */
  var ETAPAS_FAMILIA = {
    proteina_liquida: ['0-1s', '1-4s', '1-3m', '3m+'],
    proteina_polvo:   ['1-3m', '3m+'],
    vitaminas:        ['1-4s', '1-3m', '3m+'],
    fibra:            ['1-3m', '3m+'],
    colageno:         ['3m+']
  };

  /* --- Descripción corta de cada marca -------------------
     La lista de marcas la arma Zoe sola desde el catálogo; aquí
     solo va la frase de cada una. Una marca nueva sin frase
     aparece igual, solo con su nombre. */
  var DESC_MARCA = {
    'Bari&Nutrition': 'formulada para pacientes bariátricos: proteínas, vitaminas en gomitas, fibra y colágeno.',
    'LVL Drink': 'proteína HIGH ISO, colágeno SKINFINITY y fibra GET OUT.',
    'Bariatric Fusion': 'marca estadounidense especializada en pacientes bariátricos: multivitamínico completo en tabletas masticables.',
    'Nutrifath': 'proteína aislada (isolate) de sabor neutro.',
    'Safie Pharma': 'GENO DEEP CARE ADVANCE (proteína en polvo) y READY-GDC (proteína líquida).',
    'Nutranex': 'D-Protin, proteína en polvo con doble fuente de proteína.'
  };

  window.ZOE_CONOCIMIENTO = {
    DESC_MARCA: DESC_MARCA,
    POR_ETAPA: POR_ETAPA,
    INTENCIONES: INTENCIONES,
    TEMAS_MEDICOS: TEMAS_MEDICOS,
    RESPUESTA_MEDICA: RESPUESTA_MEDICA,
    RESPUESTA_DESCONOCIDA: RESPUESTA_DESCONOCIDA,
    SUGERENCIAS: SUGERENCIAS,
    ETAPAS_FAMILIA: ETAPAS_FAMILIA,
    AVISO: AVISO,
    PRECIOS: P
  };
})();
