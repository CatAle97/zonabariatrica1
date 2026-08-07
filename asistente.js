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
      texto: '¡Hola! 😊 Soy el asistente de <b>Zona Bariátrica</b>.<br>Puedo resolverte dudas sobre productos, precios y envíos al instante.<br><br>¿Qué necesitas?',
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
      if (typeof abrirCarrito === 'function') { abrirCarrito(); }
      else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    link_packs: function () {
      cerrar();
      if (typeof filtrar === 'function') { filtrar('pack'); }
      else { window.location.href = 'packs.html'; }
    }
  };

  /* =========================================================
     ESTILOS
     ========================================================= */
  var CSS = ''
    + '#zb-fab{position:fixed;bottom:24px;left:24px;z-index:998;width:60px;height:60px;border-radius:50%;'
    + 'background:#16A34A;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.22);'
    + 'display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .15s}'
    + '#zb-fab:hover{transform:translateY(-2px)}'
    + '#zb-fab.oculto{display:none}'
    + '#zb-panel{position:fixed;bottom:24px;left:24px;z-index:999;width:350px;max-width:calc(100vw - 32px);'
    + 'height:520px;max-height:calc(100vh - 48px);background:#fff;border-radius:14px;'
    + 'box-shadow:0 12px 40px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden;'
    + 'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
    + '#zb-panel.abierto{display:flex}'
    + '.zb-head{background:#16A34A;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}'
    + '.zb-head-t{font-size:15px;font-weight:700;line-height:1.3}'
    + '.zb-head-s{font-size:12px;opacity:.9;font-weight:400}'
    + '.zb-x{background:transparent;border:none;color:#fff;font-size:24px;cursor:pointer;line-height:1;padding:0 4px}'
    + '.zb-body{flex:1;overflow-y:auto;padding:16px;background:#F4F6F8}'
    + '.zb-msg{background:#fff;border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.55;'
    + 'color:#1F2937;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.07);max-width:92%}'
    + '.zb-msg.user{background:#16A34A;color:#fff;margin-left:auto;box-shadow:none}'
    + '.zb-msg b{font-weight:700}'
    + '.zb-nota{margin-top:10px;padding-top:9px;border-top:1px solid #E5E7EB;font-size:12px;'
    + 'color:#6B7280;line-height:1.45}'
    + '.zb-ops{display:flex;flex-direction:column;gap:7px;margin-top:12px}'
    + '.zb-op{background:#fff;border:1.5px solid #16A34A;color:#15803D;border-radius:9px;padding:10px 12px;'
    + 'font-size:13.5px;font-weight:600;cursor:pointer;text-align:left;font-family:inherit;transition:background .12s}'
    + '.zb-op:hover{background:#F0FDF4}'
    + '.zb-foot{padding:9px 14px;background:#fff;border-top:1px solid #E5E7EB;font-size:11px;'
    + 'color:#9CA3AF;text-align:center;line-height:1.4}'
    + '@media(max-width:520px){'
    + '#zb-fab{bottom:16px;left:16px;width:54px;height:54px;font-size:23px}'
    + '#zb-panel{bottom:0;left:0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0}'
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

  function pintarNodo(id, textoUsuario) {
    var nodo = NODOS[id];
    if (!nodo) return;

    if (textoUsuario) {
      body.appendChild(el('div', 'zb-msg user', textoUsuario));
      scrollAbajo();
    }

    // pequeña pausa para que se sienta conversación, no un salto brusco
    setTimeout(function () {
      body.appendChild(el('div', 'zb-msg', nodo.texto));

      var ops = el('div', 'zb-ops');
      nodo.opciones.forEach(function (par) {
        var etiqueta = par[0], destino = par[1];
        var btn = el('button', 'zb-op', etiqueta);
        btn.type = 'button';
        btn.onclick = function () {
          ops.remove();
          if (ACCIONES[destino]) {
            body.appendChild(el('div', 'zb-msg user', etiqueta));
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
    }, textoUsuario ? 260 : 0);
  }

  function abrir() {
    panel.classList.add('abierto');
    fab.classList.add('oculto');
    if (!body.hasChildNodes()) pintarNodo('inicio');
  }

  function cerrar() {
    panel.classList.remove('abierto');
    fab.classList.remove('oculto');
  }

  function iniciar() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    fab = el('button', '', '💬');
    fab.id = 'zb-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Abrir asistente de Zona Bariátrica');
    fab.onclick = abrir;
    document.body.appendChild(fab);

    panel = el('div');
    panel.id = 'zb-panel';

    var head = el('div', 'zb-head');
    head.appendChild(el('div', '',
      '<div class="zb-head-t">Asistente Zona Bariátrica</div>' +
      '<div class="zb-head-s">Respuestas al instante</div>'));
    var x = el('button', 'zb-x', '&times;');
    x.type = 'button';
    x.setAttribute('aria-label', 'Cerrar');
    x.onclick = cerrar;
    head.appendChild(x);

    body = el('div', 'zb-body');

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(el('div', 'zb-foot',
      'Información de producto — no reemplaza la indicación de tu médico'));
    document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
