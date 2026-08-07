/* =========================================================
   ASISTENTE ZONA BARIÁTRICA — chat de preguntas frecuentes
   Autocontenido: crea sus propios estilos, su HTML y su lógica.
   Se activa agregando una sola línea antes de </body>:
       <script src="asistente.js"></script>

   NO usa internet ni IA: todas las respuestas están escritas
   aquí abajo y aprobadas por Zona Bariátrica. Para cambiar un
   precio o una respuesta, edita el bloque RESPUESTAS.
   ========================================================= */
(function () {
  'use strict';

  var WA = '51961841069';

  function wa(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }

  /* ---------------------------------------------------------
     PRECIOS — deben coincidir con el catálogo de index.html
     --------------------------------------------------------- */
  var P = {
    whey: 280, wheyPack: 520,
    liquida: 200, liquidaPack: 360,
    gomitas: 150,
    fibraBN: 85,
    lvlProt: 209, lvlColag: 109, lvlFibra: 79
  };

  var NOTA_MEDICA = '<div class="zb-nota">⚕️ Esto es información de producto, no una indicación médica. Las dosis y qué suplemento te toca las confirma tu médico o nutricionista.</div>';

  /* ---------------------------------------------------------
     RESPUESTAS — cada nodo es una pantalla del chat
     texto    : lo que responde el asistente (acepta HTML simple)
     opciones : botones que se muestran debajo
     --------------------------------------------------------- */
  var NODOS = {

    inicio: {
      /* Bienvenida: se presenta como Zoe, en frases cortas para
         que se lea de un vistazo en el móvil. */
      texto: '<b>Hola 👋 Soy Zoe.</b><br><br>Estoy aquí para ayudarte con información sobre nuestros suplementos, productos, pedidos, envíos y preguntas frecuentes.<br><br><b>¿En qué puedo ayudarte hoy?</b>',
      opciones: [
        ['💊 ¿Qué suplemento me toca?', 'etapa'],
        ['💰 Precios y promociones', 'precios'],
        ['🚚 Envíos y delivery', 'envios'],
        ['💳 Cómo comprar y pagar', 'pago'],
        ['❓ Otras dudas frecuentes', 'dudas'],
        ['💬 Hablar con un asesor', 'asesor']
      ]
    },

    /* ============ ETAPAS ============ */
    etapa: {
      texto: 'Te oriento según tu momento. ¿En cuál estás?',
      opciones: [
        ['Aún no me opero', 'etapa_pre'],
        ['Menos de 1 mes', 'etapa_1'],
        ['1 a 2 meses', 'etapa_2'],
        ['3 a 6 meses', 'etapa_3'],
        ['Más de 6 meses', 'etapa_6'],
        ['No me he operado, es para cuidarme', 'etapa_general']
      ]
    },

    etapa_pre: {
      texto: '¡Qué bueno que te prepares con anticipación! 💚<br><br>Lo que casi siempre se usa en el primer mes después de la cirugía es <b>Proteína Líquida</b>, porque el estómago todavía no tolera sólidos.<br><br>🥛 <b>Proteína Líquida 1L</b> — S/' + P.liquida + '<br>20g de proteína en 30ml · Sin lactosa · 0% azúcar · Fresa o Maracumango<br>🔥 Llevando 2: S/' + P.liquidaPack + '<br><br>Muchos pacientes compran 2 botellas para cubrir el primer mes completo.' + NOTA_MEDICA,
      opciones: [
        ['Ver todos los precios', 'precios'],
        ['Quiero pedirla', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    etapa_1: {
      texto: 'En las primeras semanas el estómago está en recuperación y solo tolera líquidos.<br><br>🥛 <b>Proteína Líquida 1L</b> — S/' + P.liquida + '<br>· 20g de proteína en solo 30ml<br>· Lista para tomar, no se prepara<br>· Sin lactosa, 0% azúcar<br>· Fresa 🍓 o Maracumango 🥭<br>🔥 Llevando 2: S/' + P.liquidaPack + '<br><br>Rinde hasta 33 porciones de 30ml por botella.' + NOTA_MEDICA,
      opciones: [
        ['¿Cuánto me dura?', 'duracion'],
        ['Quiero pedirla', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    etapa_2: {
      texto: 'En esta etapa normalmente ya se pasa de líquida a <b>proteína en polvo</b>, y se empiezan a introducir las vitaminas.<br><br>💪 <b>Whey Protein 1.5kg</b> — S/' + P.whey + '<br>30g de proteína por porción · Sin lactosa · 0% azúcar · Vainilla o Chocolate<br>🔥 Llevando 2: S/' + P.wheyPack + '<br><br>🟢 <b>Gomitas Multivitamínico</b> — S/' + P.gomitas + '<br>23 vitaminas y minerales, fáciles de tomar<br><br>🔥 Llevando 2 productos hay descuento.' + NOTA_MEDICA,
      opciones: [
        ['Ver todos los precios', 'precios'],
        ['Se me cae el cabello', 'cabello'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    etapa_3: {
      texto: 'A partir del tercer mes lo habitual es mantener proteína + vitaminas. También es cuando más aparece la caída de cabello.<br><br>💪 <b>Whey Protein 1.5kg</b> — S/' + P.whey + '<br>🟢 <b>Multivitamínico</b> — S/' + P.gomitas + '<br>🟡 <b>Biotina 10,000mcg</b> — S/' + P.gomitas + '<br>🟠 <b>Hierro + Vitamina C</b> — S/' + P.gomitas + '<br>🔵 <b>B12 + Ácido Fólico</b> — S/' + P.gomitas + '<br><br>🔥 Llevando 2, 3 o 4 productos el descuento va subiendo.' + NOTA_MEDICA,
      opciones: [
        ['Se me cae el cabello', 'cabello'],
        ['Tengo estreñimiento', 'estrenimiento'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    etapa_6: {
      texto: 'Después de los 6 meses ya toleras casi todo, pero la suplementación se mantiene de por vida — el cuerpo absorbe menos que antes de la cirugía.<br><br>Lo más común en mantenimiento:<br>💪 <b>Whey Protein 1.5kg</b> — S/' + P.whey + '<br>🟢 <b>Multivitamínico</b> — S/' + P.gomitas + '<br>🔵 <b>B12 + Ácido Fólico</b> — S/' + P.gomitas + '<br><br>Si hace tiempo no te haces controles, lo ideal es un análisis de sangre para saber qué te falta exactamente.' + NOTA_MEDICA,
      opciones: [
        ['Ver todos los precios', 'precios'],
        ['Quiero hacer mi pedido', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    etapa_general: {
      texto: 'No necesitas haber pasado por cirugía 😊<br><br>Nuestros productos están formulados pensando en pacientes bariátricos, pero son <b>aptos para todo público</b>. De hecho muchos los toman por lo mismo que los hace buenos para bariátricos: alta proteína, sin azúcar y fáciles de digerir.<br><br>Los más pedidos por público general:<br>💪 <b>Whey Protein 1.5kg</b> — S/' + P.whey + '<br>🦴 <b>Colágeno con Biotina LVL</b> — S/' + P.lvlColag + '<br>🌿 <b>Fibra LVL Manzana Verde</b> — S/' + P.lvlFibra,
      opciones: [
        ['Ver todos los precios', 'precios'],
        ['Quiero hacer mi pedido', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    /* ============ PRECIOS ============ */
    precios: {
      texto: '¿De qué línea quieres ver precios?',
      opciones: [
        ['Proteínas', 'precios_prot'],
        ['Vitaminas en gomitas', 'precios_vit'],
        ['Colágeno y fibra', 'precios_col'],
        ['Descuentos y promos', 'promos'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    precios_prot: {
      texto: '<b>PROTEÍNAS</b><br><br>🥛 <b>Proteína Líquida 1L</b> — S/' + P.liquida + '<br>20g por porción de 30ml · Fresa o Maracumango<br>🔥 Llevando 2: S/' + P.liquidaPack + '<br><br>💪 <b>Whey Protein 1.5kg (B&N)</b> — S/' + P.whey + '<br>30g por porción · Vainilla o Chocolate<br>🔥 Llevando 2: S/' + P.wheyPack + '<br><br>💪 <b>Proteína HIGH ISO 1kg (LVL)</b> — S/' + P.lvlProt + '<br>27g por porción · Vainilla o Chocolate',
      opciones: [
        ['¿Cuál me toca a mí?', 'etapa'],
        ['Ver vitaminas', 'precios_vit'],
        ['Quiero pedir', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    precios_vit: {
      texto: '<b>VITAMINAS EN GOMITAS (Bari&Nutrition)</b><br>Todas a <b>S/' + P.gomitas + '</b> cada una:<br><br>🟢 <b>Multivitamínico</b><br>23 vitaminas y minerales · 4 gomitas al día<br><br>🟡 <b>Biotina 10,000mcg</b> — 90 und<br>Cabello, piel y uñas · sabor durazno · 2 al día<br><br>🟠 <b>Hierro 45mg + Vitamina C</b> — 30 und<br>Contra el cansancio · sabor naranja · 1 al día<br><br>🔵 <b>B12 + Ácido Fólico</b> — 90 und<br>Energía y sistema nervioso · sabor piña · 3 al día<br><br>Todas sin azúcares añadidos.',
      opciones: [
        ['Descuentos por cantidad', 'promos'],
        ['Ver proteínas', 'precios_prot'],
        ['Quiero pedir', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    precios_col: {
      texto: '<b>COLÁGENO Y FIBRA</b><br><br>🦴 <b>Colágeno SKINFINITY 500g (LVL)</b> — S/' + P.lvlColag + '<br>Colágeno hidrolizado con camu camu, arándano y 10,000mcg de biotina. Piel, cabello y uñas.<br><br>🌿 <b>Fibra GET OUT 200g (LVL)</b> — S/' + P.lvlFibra + '<br>Fibra de inulina, sabor manzana verde.<br><br>🌾 <b>Fibra Soluble 320g (B&N)</b> — S/' + P.fibraBN + '<br>Base de maíz, origen francés. 64 servicios.',
      opciones: [
        ['Tengo estreñimiento', 'estrenimiento'],
        ['Quiero pedir', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    promos: {
      texto: '<b>DESCUENTOS POR CANTIDAD</b> (línea Bari&Nutrition)<br><br>📦 Llevando 2 productos → <b>−S/15</b><br>📦 Llevando 3 productos → <b>−S/25</b><br>📦 Llevando 4 o más → <b>−S/40</b><br><br><b>OFERTAS EN PACK</b><br>🥛 2 Proteínas Líquidas → S/' + P.liquidaPack + ' <i>(ahorras S/40)</i><br>💪 2 Proteínas en Polvo → S/' + P.wheyPack + ' <i>(ahorras S/40)</i><br><br>En la web también encuentras packs armados con más ahorro.<br><br>💡 El descuento por cantidad te lo aplicamos al confirmar tu pedido por WhatsApp.',
      opciones: [
        ['Ver packs en la web', 'link_packs'],
        ['Quiero mi cotización', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    /* ============ ENVÍOS ============ */
    envios: {
      texto: 'Hacemos envíos a <b>Lima y todo el Perú</b> 🚚<br><br>¿A dónde sería tu pedido?',
      opciones: [
        ['Lima', 'envios_lima'],
        ['Provincia', 'envios_prov'],
        ['¿Tienen tienda física?', 'tienda'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    envios_lima: {
      texto: '<b>ENVÍOS EN LIMA</b><br><br>📍 Entrega a domicilio en todos los distritos.<br>💰 El costo varía según tu distrito — te lo confirmamos al momento de cotizar.<br>⏱️ Entrega el mismo día o al día siguiente, coordinando la hora contigo.<br><br>Escríbenos con tu distrito y te damos el total exacto, delivery incluido.',
      opciones: [
        ['Cotizar mi pedido', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    envios_prov: {
      texto: '<b>ENVÍOS A PROVINCIA</b><br><br>📦 Enviamos por <b>agencia Shalom</b> a todo el Perú.<br>💰 S/10 por embalaje y traslado a la agencia en Lima.<br>🚚 El flete de Shalom lo pagas tú al recoger tu pedido en la agencia de tu ciudad.<br><br>Ya hemos enviado a Cusco, Arequipa, Puno, Chimbote, Pucallpa, Iquitos, Talara y más.',
      opciones: [
        ['Cotizar mi pedido', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    tienda: {
      texto: 'Somos <b>100% online</b> 😊<br><br>No tenemos tienda física: trabajamos con entrega a domicilio en Lima y envíos por agencia a todo el Perú. Así mantenemos los precios más accesibles.<br><br>Puedes hacer tu pedido desde esta misma web o por WhatsApp.',
      opciones: [
        ['Ver envíos', 'envios'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    /* ============ PAGO Y PROCESO ============ */
    pago: {
      texto: '<b>FORMAS DE PAGO</b><br><br>💚 <b>Yape</b> o transferencia BCP<br>💳 <b>Tarjeta</b> de débito o crédito — se agrega 4% de recargo (comisión de la pasarela)<br><br>Te enviamos el link de pago seguro o el número de Yape al confirmar tu pedido.',
      opciones: [
        ['¿Cómo es el proceso?', 'proceso'],
        ['¿Hay pago contra entrega?', 'contraentrega'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    proceso: {
      texto: '<b>ASÍ DE FÁCIL</b> 😊<br><br>1️⃣ Eliges tus productos y sabores<br>2️⃣ Te pasamos el total exacto con el delivery incluido<br>3️⃣ Pagas por Yape, transferencia o tarjeta<br>4️⃣ Nos envías la captura del pago<br>5️⃣ Te mandamos foto de tu pedido empacado<br>6️⃣ Coordinamos la entrega el mismo día o al siguiente<br><br>Puedes armar tu pedido aquí en la web y nos llega directo por WhatsApp.',
      opciones: [
        ['Hacer mi pedido', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    contraentrega: {
      texto: 'Trabajamos con <b>pago adelantado</b> por Yape, transferencia o tarjeta 😊<br><br>Es lo que nos permite mantener los precios y hacer envíos a todo el Perú el mismo día. Te enviamos foto de tu pedido empacado antes de salir, para que estés tranquila.',
      opciones: [
        ['Ver formas de pago', 'pago'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    /* ============ DUDAS FRECUENTES ============ */
    dudas: {
      texto: '¿Sobre qué es tu duda?',
      opciones: [
        ['¿Tienen azúcar?', 'azucar'],
        ['¿Cuánto me dura?', 'duracion'],
        ['Se me cae el cabello', 'cabello'],
        ['Tengo estreñimiento', 'estrenimiento'],
        ['No tolero la proteína', 'nauseas'],
        ['¿Tienen otra marca?', 'marcas'],
        ['¿Qué sabores hay?', 'sabores'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    azucar: {
      texto: '<b>Ninguno de nuestros productos lleva azúcar añadida.</b><br><br>🍬 Las <b>gomitas</b> saben dulce por el maltitol, un endulzante que el cuerpo no procesa como azúcar. Las de hierro tienen 0g y las demás apenas 1g por porción.<br><br>💪 Las <b>proteínas</b> están endulzadas con stevia natural — 0g de azúcar en etiqueta.<br><br>Por eso son aptas para pacientes bariátricos: evitan el síndrome de dumping.',
      opciones: [
        ['Ver tabla nutricional', 'tabla'],
        ['◀ Otras dudas', 'dudas'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    duracion: {
      texto: '<b>¿CUÁNTO DURA CADA PRODUCTO?</b><br><br>🥛 <b>Proteína Líquida 1L</b> — 33 porciones de 30ml.<br>Si tomas 2 al día (mañana y noche), te dura unos <b>15 días</b>. Al mes se usan 2 botellas.<br><br>💪 <b>Whey Protein 1.5kg</b> — 31 porciones de 3 scoops.<br>Tomando 1 batido al día, dura <b>alrededor de un mes</b>.<br><br>🟡 <b>Biotina</b> (90 und, 2 al día) — 45 días<br>🔵 <b>B12</b> (90 und, 3 al día) — 30 días<br>🟠 <b>Hierro</b> (30 und, 1 al día) — 30 días',
      opciones: [
        ['Ver precios', 'precios'],
        ['◀ Otras dudas', 'dudas'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    cabello: {
      texto: 'La caída de cabello entre el mes 3 y el 6 es <b>muy común</b> después de la cirugía — le pasa a casi todas y es pasajera 💚<br><br>Lo que más ayuda:<br><br>🟡 <b>Biotina 10,000mcg</b> — S/' + P.gomitas + '<br>Dosis alta, 90 gomitas sabor durazno, 2 al día (dura 45 días).<br><br>💪 <b>Proteína</b> — cubrir tu requerimiento diario de proteína es igual de importante que la biotina.<br><br>🔥 Llevando las 2 cosas tienes descuento.' + NOTA_MEDICA,
      opciones: [
        ['Ver precio de proteínas', 'precios_prot'],
        ['Quiero pedir biotina', 'asesor_prod'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    estrenimiento: {
      texto: 'El estreñimiento es de las molestias más frecuentes después de la cirugía, sobre todo por el bajo volumen de comida y de agua.<br><br>🌾 <b>Fibra Soluble 320g (B&N)</b> — S/' + P.fibraBN + '<br>1 scoop al día disuelto en agua. 64 servicios.<br><br>🌿 <b>Fibra GET OUT 200g (LVL)</b> — S/' + P.lvlFibra + '<br>Fibra de inulina, sabor manzana verde.<br><br>Ambas sin sabor fuerte y se mezclan con cualquier bebida.' + NOTA_MEDICA,
      opciones: [
        ['Quiero pedir fibra', 'asesor_prod'],
        ['◀ Otras dudas', 'dudas'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    nauseas: {
      texto: 'Es más común de lo que crees, y casi siempre tiene solución 💚<br><br>Si el problema es la <b>proteína en polvo</b> (te cae pesada, te da náuseas o no toleras el sabor a leche):<br>🥛 La <b>Proteína Líquida</b> es a base de colágeno hidrolizado, no de leche. Son 20g en un sorbito de 30ml, sin preparar nada. Fresa o Maracumango.<br><br>Si el problema son las <b>pastillas</b>:<br>🍬 Nuestras vitaminas son gomitas pequeñas y masticables, mucho más fáciles de tolerar.<br><br>⚕️ Importante: si las náuseas son persistentes, coméntalo con tu médico o nutricionista antes de cambiar de suplemento.',
      opciones: [
        ['Ver proteína líquida', 'precios_prot'],
        ['💬 Consultar mi caso', 'asesor'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    marcas: {
      texto: 'Trabajamos con dos marcas, ambas aptas para pacientes bariátricos:<br><br>✅ <b>Bari&Nutrition</b> — marca nacional, materia prima americana, con registro sanitario peruano. Formulada específicamente para bariátricos.<br>✅ <b>LVL Drink</b> — proteína, colágeno y fibra, apta para bariátricos.<br><br>No manejamos Bariatric Fusion, Nutrifath ni Centrum, pero tenemos equivalentes con la misma función y a mejor precio. Si nos dices qué tomas hoy, te decimos cuál es el reemplazo.',
      opciones: [
        ['Ver tabla nutricional', 'tabla'],
        ['💬 Consultar equivalente', 'asesor'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    sabores: {
      texto: '<b>SABORES DISPONIBLES</b><br><br>🥛 Proteína Líquida — 🍓 Fresa · 🥭 Maracumango<br>💪 Whey Protein B&N — 🍦 Vainilla · 🍫 Chocolate<br>💪 Proteína LVL — 🍦 Vainilla · 🍫 Chocolate<br>🦴 Colágeno LVL — 🫐 Arándano<br>🌿 Fibra LVL — 🍏 Manzana verde<br><br>Gomitas: biotina 🍑 durazno · B12 🍍 piña · hierro 🍊 naranja · multivitamínico multisabor.<br><br>Por ahora no manejamos versión sin sabor.',
      opciones: [
        ['Ver precios', 'precios'],
        ['◀ Otras dudas', 'dudas'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    tabla: {
      texto: 'Claro 😊 Cada producto tiene su tabla nutricional completa publicada en esta misma web — ábrelo desde el catálogo y verás la información nutricional detallada.<br><br>Si prefieres que te la enviemos por WhatsApp, escríbenos y te la mandamos al toque.',
      opciones: [
        ['💬 Pedirla por WhatsApp', 'asesor_tabla'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    /* ============ DERIVACIÓN A HUMANO ============ */
    asesor: {
      texto: 'Con gusto 💚 Nuestro equipo te atiende directo por WhatsApp y te ayuda con tu caso puntual.<br><br>Horario de atención: todos los días.',
      opciones: [
        ['💬 Abrir WhatsApp', 'link_wa_general'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    asesor_prod: {
      texto: '¡Perfecto! Para darte el total exacto (con delivery incluido) necesitamos saber tu distrito o ciudad.<br><br>Escríbenos y te armamos la cotización al momento 💚',
      opciones: [
        ['💬 Pedir mi cotización', 'link_wa_cotiza'],
        ['🛒 Armar pedido en la web', 'link_carrito'],
        ['◀ Volver al inicio', 'inicio']
      ]
    },

    asesor_tabla: {
      texto: 'Listo, escríbenos indicando de qué producto la necesitas 😊',
      opciones: [
        ['💬 Abrir WhatsApp', 'link_wa_tabla'],
        ['◀ Volver al inicio', 'inicio']
      ]
    }
  };

  /* Acciones que abren un enlace en lugar de mostrar un nodo */
  var ACCIONES = {
    link_wa_general: function () {
      window.open(wa('Hola, vengo de la web y tengo una consulta 😊'), '_blank');
    },
    link_wa_cotiza: function () {
      window.open(wa('Hola, quiero mi cotización. Estos son los productos que me interesan:'), '_blank');
    },
    link_wa_tabla: function () {
      window.open(wa('Hola, ¿me pueden enviar la tabla nutricional de este producto?:'), '_blank');
    },
    link_carrito: function () {
      cerrar();
      /* El carrito solo vive en la tienda. Desde las páginas de
         herramientas se navega a la home en vez de dejar al
         usuario en el mismo sitio sin que pase nada. */
      if (typeof abrirCarrito === 'function') { abrirCarrito(); }
      else { window.location.href = '/'; }
    },
    link_packs: function () {
      cerrar();
      if (typeof filtrar === 'function') { filtrar('pack'); }
      else { window.location.href = 'packs.html'; }
    },
    /* Catálogo completo. En la tienda se filtra sin recargar;
       desde otra página se navega a la home. */
    ver_suplementos: function () {
      cerrar();
      if (typeof filtrar === 'function' && typeof scrollProductos === 'function') {
        filtrar('todos');
        scrollProductos();
      } else {
        window.location.href = '/';
      }
    },
    /* Selector guiado — /encuentra-tu-suplemento (Fase 3). */
    ir_selector: function () {
      cerrar();
      window.location.href = '/encuentra-tu-suplemento';
    }
  };

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
    + '#zb-fab{position:fixed;bottom:24px;left:24px;z-index:998;width:64px;height:64px;border-radius:50%;'
    + 'background:#fff;border:2px solid #fff;cursor:pointer;box-shadow:0 4px 16px rgba(16,24,40,.20);'
    + 'display:flex;align-items:center;justify-content:center;padding:0;'
    + 'transition:transform .2s ease,box-shadow .2s ease;-webkit-tap-highlight-color:transparent}'
    /* La foto llena el botón; el recorte circular lo da el propio botón. */
    + '.zb-fab-foto{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%}'
    /* Punto verde de "disponible": sugiere que hay alguien al otro lado. */
    + '#zb-fab::after{content:"";position:absolute;right:2px;bottom:4px;width:14px;height:14px;'
    + 'border-radius:50%;background:' + C.verde + ';border:2.5px solid #fff}'
    + '#zb-fab:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(16,24,40,.28)}'
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
     CONSTRUCCIÓN
     ========================================================= */
  var panel, body, fab;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function scrollAbajo() {
    body.scrollTop = body.scrollHeight;
  }

  var AVATAR = 'img/zoe.png';

  /* Envuelve una burbuja en su fila. Las de Zoe llevan su avatar
     pequeño al lado; las del usuario van a la derecha sin avatar. */
  function burbuja(texto, esUsuario) {
    var fila = el('div', 'zb-fila' + (esUsuario ? ' user' : ''));
    if (!esUsuario) {
      var av = el('img', 'zb-av');
      av.src = AVATAR;
      av.alt = '';
      av.setAttribute('aria-hidden', 'true');
      fila.appendChild(av);
    }
    fila.appendChild(el('div', 'zb-msg' + (esUsuario ? ' user' : ''), texto));
    return fila;
  }

  /* "Zoe está escribiendo •••" — ocupa la pausa que ya existía
     antes de cada respuesta, en vez de dejar la pantalla quieta. */
  function mostrarEscribiendo() {
    var fila = el('div', 'zb-fila');
    fila.id = 'zb-escribiendo';
    var av = el('img', 'zb-av');
    av.src = AVATAR; av.alt = ''; av.setAttribute('aria-hidden', 'true');
    fila.appendChild(av);
    fila.appendChild(el('div', 'zb-typing',
      '<span class="zb-typing-t">Zoe está escribiendo</span>' +
      '<span class="zb-dots"><i></i><i></i><i></i></span>'));
    /* Se anuncia a lectores de pantalla una sola vez. */
    fila.setAttribute('role', 'status');
    fila.setAttribute('aria-label', 'Zoe está escribiendo');
    body.appendChild(fila);
    scrollAbajo();
    return fila;
  }

  function quitarEscribiendo() {
    var e = document.getElementById('zb-escribiendo');
    if (e) e.remove();
  }

  function pintarNodo(id, textoUsuario) {
    var nodo = NODOS[id];
    if (!nodo) return;

    if (textoUsuario) {
      body.appendChild(burbuja(textoUsuario, true));
      scrollAbajo();
      mostrarEscribiendo();
    }

    // pequeña pausa para que se sienta conversación, no un salto brusco
    setTimeout(function () {
      quitarEscribiendo();
      body.appendChild(burbuja(nodo.texto, false));

      var ops = el('div', 'zb-ops');
      nodo.opciones.forEach(function (par) {
        var etiqueta = par[0], destino = par[1];
        var btn = el('button', 'zb-op', etiqueta);
        btn.type = 'button';
        btn.onclick = function () {
          ops.remove();
          if (ACCIONES[destino]) {
            body.appendChild(burbuja(etiqueta, true));
            ACCIONES[destino]();
            scrollAbajo();
            // deja el menú principal disponible después de la acción
            setTimeout(function () { pintarNodo('inicio'); }, 400);
          } else {
            pintarNodo(destino, etiqueta);
          }
        };
        ops.appendChild(btn);
      });
      body.appendChild(ops);
      scrollAbajo();

      /* Las acciones rápidas acompañan solo al menú principal. */
      if (id === 'inicio') body.appendChild(construirRapidas());
      scrollAbajo();
    }, textoUsuario ? 620 : 0);
  }

  /* =========================================================
     ACCIONES RÁPIDAS
     ---------------------------------------------------------
     Cada botón lleva a algo que YA EXISTE en el proyecto.
     No hay accesos decorativos: si algo no existiera, no
     estaría en esta lista.
     ========================================================= */
  var RAPIDAS = [
    { txt: '🛍️ Ver suplementos',        accion: 'ver_suplementos' },
    { txt: '🔎 Encontrar un suplemento', accion: 'ir_selector' },
    { txt: '📦 Mi pedido',               accion: 'link_carrito' },
    { txt: '🚚 Envíos',                  nodo:   'envios' },
    { txt: '❓ Preguntas frecuentes',    nodo:   'dudas' },
    { txt: '💬 Continuar por WhatsApp',  accion: 'link_wa_general', wa: true }
  ];

  function construirRapidas() {
    var cont = el('div', 'zb-rapidas');
    cont.setAttribute('role', 'group');
    cont.setAttribute('aria-label', 'Accesos rápidos');
    RAPIDAS.forEach(function (r) {
      var b = el('button', 'zb-rapida' + (r.wa ? ' wa' : ''), r.txt);
      b.type = 'button';
      b.onclick = function () {
        cont.remove();
        if (r.nodo) { pintarNodo(r.nodo, r.txt); return; }
        body.appendChild(burbuja(r.txt, true));
        if (ACCIONES[r.accion]) ACCIONES[r.accion]();
        scrollAbajo();
        setTimeout(function () { pintarNodo('inicio'); }, 400);
      };
      cont.appendChild(b);
    });
    return cont;
  }

  function abrir() {
    panel.classList.remove('cerrando');
    panel.classList.add('abierto');
    fab.classList.add('oculto');
    if (!body.hasChildNodes()) pintarNodo('inicio');
    /* El foco entra al panel para quien navega con teclado. */
    var cerrarBtn = panel.querySelector('.zb-x');
    if (cerrarBtn) cerrarBtn.focus();
  }

  function cerrar() {
    /* Se deja terminar la animación de salida antes de ocultar. */
    panel.classList.add('cerrando');
    var fin = function () {
      panel.classList.remove('abierto', 'cerrando');
      panel.removeEventListener('animationend', fin);
    };
    panel.addEventListener('animationend', fin);
    /* Respaldo por si la animación no llega a dispararse
       (por ejemplo con "menos movimiento" activado). */
    setTimeout(fin, 260);

    fab.classList.remove('oculto');
    fab.focus();
  }

  function iniciar() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* La cara de Zoe en vez del emoji: pone rostro al asistente
       y lo hace reconocible junto al resto del sitio. */
    fab = el('button', '', '<img src="img/zoe.png" alt="Zoe" class="zb-fab-foto">');
    fab.id = 'zb-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Habla con Zoe, asistente de Zona Bariátrica');
    fab.onclick = abrir;
    document.body.appendChild(fab);

    /* Etiqueta al pasar el cursor. Va fuera del botón para que no
       agrande su zona pulsable ni interfiera con el avatar. */
    var tip = el('span', 'zb-fab-tip', 'Habla con Zoe');
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    panel = el('div');
    panel.id = 'zb-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Zoe, asistente de Zona Bariátrica');

    /* --- CABECERA: Zoe + rol + estado ---
       Es "Asistente de Zona Bariátrica": nunca médica ni
       nutricionista, y sin mencionar bot ni IA. */
    var head = el('div', 'zb-head');
    var avatarHead = el('div', 'zb-head-av',
      '<img src="' + AVATAR + '" alt="" aria-hidden="true">');
    head.appendChild(avatarHead);
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
    panel.appendChild(el('div', 'zb-foot',
      'La información brindada es referencial y no reemplaza la orientación ' +
      'de tu médico o nutricionista.'));
    document.body.appendChild(panel);

    /* Escape cierra el panel. */
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
