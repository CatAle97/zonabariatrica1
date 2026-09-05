/* =========================================================
   ZONA BARIÁTRICA — CATÁLOGO (fuente única de verdad)
   ---------------------------------------------------------
   Este archivo contiene los productos y sus tablas
   nutricionales. Se extrajo de index.html en la Fase 3 para
   que la tienda Y el Selector Inteligente (/encuentra-tu-
   suplemento) usen EXACTAMENTE los mismos datos, en lugar de
   mantener dos copias que se desincronizan.

   PARA EDITAR PRECIOS O PRODUCTOS: se hace aquí y en las
   páginas estáticas de categoría (proteinas.html, etc.).

   Debe cargarse ANTES del script principal de index.html.
   ========================================================= */
const BN = "img/bn-";
const LVL = "img/lvl-";
const BF = "img/bf-";

const tn = {
  fibra_bn: {
    srv: "1 Scoop (5g)", srvs: "64 servicios por envase",
    filas: [
      ["Carbohidratos","5 g","2%"],
      ["Fibra dietética","5 g","20%"],
      ["Azúcar","0 g","0%"],
      ["Grasas","0 g","0%"],
      ["Proteína","0 g","0%"]
    ]
  },
  biotina: {
    srv: "2 gomitas", srvs: "45 porciones por envase",
    filas: [
      ["Calorías","20 kcal",""],
      ["Carbohidratos totales","—",""],
      ["Azúcares totales","1 g",""],
      ["Azúcares añadidos","1 g",""],
      ["Biotina","10,000 mcg",""]
    ],
    nota: "2 gomitas al día, preferiblemente con una comida. La biotina puede interferir con pruebas de laboratorio."
  },
  hierro: {
    srv: "1 gomita masticable", srvs: "30 gomitas por envase",
    filas: [
      ["Calorías","15 kcal",""],
      ["Grasa total","0.5 g","1%"],
      ["Carbohidratos totales","4 g","1%"],
      ["Azúcares totales","0 g",""],
      ["Azúcar Alcohol","4 g",""],
      ["Vitamina C (Ác. Ascórbico)","60 mg","67%"],
      ["Hierro (fumarato ferroso)","45 mg","250%"],
      ["Sodio","20 mg","1%"]
    ],
    nota: "Vía oral. Adultos: 1 gomita masticable al día."
  },
  multivit: {
    srv: "4 gomitas", srvs: "22 porciones por envase",
    filas: [
      ["Calorías","10 kcal",""],
      ["Grasa total","0 g","0%"],
      ["Carbohidratos totales","1.5 g","1%"],
      ["Azúcar","1 g",""],
      ["Proteína","0 g","0%"],
      ["Vitamina A (Retinol)","560 mcg","63%"],
      ["Vitamina C","45 mg","50%"],
      ["Vitamina D3","18.8 mcg","94%"],
      ["Vitamina E","15 mg","100%"],
      ["Vitamina B1 (Tiamina)","12 mg","250%"],
      ["Vitamina B2","430 mcg","33%"],
      ["Vitamina B3","5 mg","31%"],
      ["Vitamina B6","500 mcg","29%"],
      ["Ácido fólico","650 mcg","84%"],
      ["Vitamina B12 (Metilcobalamina)","425 mcg","5833%"],
      ["Biotina","150 mcg","500%"],
      ["Ácido pantoténico","2.5 mg","50%"],
      ["Calcio","1400 mcg","23%"],
      ["Hierro (fumarato ferroso)","50 mg","63%"],
      ["Yodo","38 mcg","25%"],
      ["Magnesio","100 mg","24%"],
      ["Zinc","11 mg","68%"],
      ["Selenio","18 mcg","32%"],
      ["Cobre","1 mg","56%"],
      ["Manganeso","500 mcg","22%"],
      ["Cromo","30 mcg","86%"],
      ["Molibdeno","18.8 mcg","42%"]
    ]
  },
  b12: {
    srv: "3 gomitas masticables", srvs: "30 porciones por envase",
    filas: [
      ["Folato (200 mcg ác. fólico)","340 mcg DFE","85%"],
      ["Vitamina B12 (metilcobalamina)","1,000 mcg","41,667%"]
    ]
  },
  liquid: {
    srv: "30 ml", srvs: "33 porciones por envase",
    filas: [
      ["Calorías","100 kcal",""],
      ["Proteínas","20 g",""],
      ["Grasa total","0.0 g",""],
      ["Carbohidrato total","6.0 g",""],
      ["Fibra","6 g",""],
      ["Hierro","50 mg",""],
      ["Calcio","1 mg",""],
      ["Sodio","10 mg",""],
      ["Potasio","20 mg",""],
      ["Fósforo","30 mcg",""],
      ["Biotina","20 mcg",""]
    ],
    nota: "Sin lactosa · 0% azúcar"
  },
  whey: {
    srv: "3 Scoops (48g)", srvs: "31 servicios por envase",
    filas: [
      ["Calorías","176 kcal",""],
      ["Proteína","30 g",""],
      ["Grasas","2.0 g",""],
      ["Grasas saturadas","1 g",""],
      ["Carbohidratos","3.7 g",""],
      ["Azúcares","1 g",""],
      ["Fibra dietética","1 g",""],
      ["Sodio","83 mg",""],
      ["Ácido fólico","100 mcg","26%"],
      ["Biotina","7.5 mcg","25%"],
      ["Niacina","4.96 mg","45%"],
      ["Vitamina A","252 mcg","44%"],
      ["Vitamina B1","375 mcg","47%"],
      ["Vitamina B2","425 mcg","51%"],
      ["Vitamina B6","500 mcg","54%"],
      ["Vitamina B12","1.5 mcg","71%"],
      ["Vitamina C","20 mg","25%"],
      ["Vitamina D","2.8 mcg","45%"],
      ["Vitamina E","8.7 mg","68%"],
      ["Vitamina K","6.25 mcg","8%"],
      ["Calcio","286 mg","35%"],
      ["Cobre","500 mcg","77%"],
      ["Cromo","30 mcg","136%"],
      ["Hierro","5.5 mg","26%"],
      ["Magnesio","25 mg","10%"],
      ["Manganeso","0.5 mg","22%"],
      ["Selenio","5 mcg","12%"],
      ["Yodo","37.5 mcg","38%"],
      ["Zinc","3.75 mg","38%"]
    ],
    nota: "Sin azúcares añadidos · Sin colorantes artificiales · Sin gluten · Deslactosada"
  },
  lvl_pro: {
    srv: "1 Scoop (40g)", srvs: "25 servicios por envase",
    filas: [
      ["Calorías","145–155 kcal",""],
      ["Proteína","27 g","52%"],
      ["Grasas totales","< 1 g","< 1.43%"],
      ["Grasas Saturadas","0 g","0%"],
      ["Sodio","130–135 mg",""],
      ["Carbohidratos totales","2 g","0.7%"],
      ["Vitamina A","160 mcg","17.8%"],
      ["Vitamina C","20 mg","22.2%"],
      ["Vitamina D","3 mcg","15%"],
      ["Vitamina E","1.8 mg","12%"],
      ["Vitamina B1","0.2 mg","16.7%"],
      ["Vitamina B2","0.5 mg","38.5%"],
      ["Vitamina B3","3 mg","18.8%"],
      ["Vitamina B5","1 mg","20%"],
      ["Vitamina B6","0.3 mg","15%"],
      ["Vitamina B9","80 mcg","20%"],
      ["Vitamina B12","1 mcg","41.7%"],
      ["Biotina","6 mcg","20%"],
      ["Calcio","200 mg","20%"],
      ["Hierro","2.8 mg","15.6%"],
      ["Magnesio","62 mg","15.5%"],
      ["Zinc","2.8 mg","25.5%"],
      ["Selenio","12 mcg","21.8%"],
      ["Vitamina K","12 mcg","10%"],
      ["Yodo","30 mcg","20%"],
      ["Cobre","180 mcg","20%"],
      ["Manganeso","0.6 mg","26.1%"],
      ["Molibdeno","9 mcg","20%"]
    ],
    nota: "Endulzado con stevia natural · Sin azúcares añadidos · Sin gluten · Apto bariátrico"
  },
  lvl_col: {
    srv: "1 Scoop (12g)", srvs: "41 servicios por envase",
    filas: [
      ["Calorías","40 kcal","2%"],
      ["Proteína (colágeno)","9 g","18%"],
      ["Grasas totales","0.1 g","0.1%"],
      ["Grasas Saturadas","0 g","0%"],
      ["Sodio","10 mg","0.4%"],
      ["Carbohidratos totales","0.5 g","0.2%"],
      ["Vitamina A","134.4 mcg","15%"],
      ["Vitamina C","46.8 mg","52%"],
      ["Vitamina D","2.5 mcg","17%"],
      ["Vitamina E","10 mg","67%"],
      ["Vitamina B1","0.2 mg","17%"],
      ["Vitamina B2","0.2 mg","15%"],
      ["Vitamina B3","2.5 mg","16%"],
      ["Vitamina B5","0.8 mg","16%"],
      ["Vitamina B6","0.2 mg","12%"],
      ["Vitamina B9","67.2 mcg","17%"],
      ["Vitamina B12","0.4 mcg","17%"],
      ["Biotina","10 mcg","33%"],
      ["Calcio","178 mg","18%"],
      ["Hierro","2.5 mg","14%"],
      ["Magnesio","55.1 mg","13%"],
      ["Zinc","2.4 mg","22%"],
      ["Selenio","10.1 mcg","18%"],
      ["Vitamina K","10.1 mcg","8%"],
      ["Yodo","25.2 mcg","17%"],
      ["Cobre","151.2 mcg","17%"],
      ["Manganeso","0.5 mg","22%"],
      ["Molibdeno","7.6 mcg","17%"]
    ],
    nota: "Con colágeno hidrolizado, camu camu y arándano · Sin azúcares añadidos · Apto bariátrico"
  },
  lvl_fib: {
    srv: "1 Scoop (10g)", srvs: "20 servicios por envase",
    filas: [
      ["Calorías","27 kcal","1.4%"],
      ["Grasas totales","0 g","0%"],
      ["Carbohidratos totales","6.2 g","2.3%"],
      ["Fibra dietética","6.2 g","22.1%"],
      ["Vitamina A","159.5 mcg","17.7%"],
      ["Vitamina C","19.9 mg","22.1%"],
      ["Vitamina D","3 mcg","15%"],
      ["Vitamina E","1.8 mg","12%"],
      ["Vitamina B1","0.2 mg","16.7%"],
      ["Vitamina B2","0.2 mg","15.4%"],
      ["Vitamina B3","3 mg","18.8%"],
      ["Vitamina B5","1 mg","20%"],
      ["Vitamina B6","0.3 mg","17.7%"],
      ["Vitamina B9","79.8 mcg","20%"],
      ["Vitamina B12","0.5 mcg","20.8%"],
      ["Biotina","6 mcg","20%"],
      ["Calcio","199.4 mg","15.3%"],
      ["Hierro","2.8 mg","15.6%"],
      ["Magnesio","61.8 mg","14.7%"],
      ["Zinc","2.8 mg","25.5%"],
      ["Selenio","12 mcg","21.8%"],
      ["Vitamina K","12 mcg","10%"],
      ["Yodo","29.9 mcg","19.9%"],
      ["Cobre","179.5 mcg","19.9%"],
      ["Manganeso","0.6 mg","26.1%"],
      ["Molibdeno","9 mcg","20%"]
    ],
    nota: "Fibra inulina · Sabor manzana verde · Sin azúcares añadidos · Apto bariátrico"
  },
  /* Bariatric Fusion multivitamínico masticable. La MISMA tabla
     sirve para los dos sabores (tropical y bayas mixtas): entre
     ellos cambia el saborizante, no la fórmula. Transcrita de la
     etiqueta del envase importado (Formulations SAS INC. dba
     Bariatric Fusion, EE. UU. · distribuye Farmawell S.A.C.). */
  bf_multivit: {
    srv: "1 tableta masticable", srvs: "120 porciones por envase",
    filas: [
      ["Calorías","5",""],
      ["Grasa total","0 g","0%"],
      ["Carbohidratos totales","1.5 g","<1%"],
      ["Azúcar","1 g",""],
      ["Proteína total","0 g","0%"],
      ["Vitamina A (retinol acetato)","560 mcg RAE","63%"],
      ["Vitamina C (ácido ascórbico)","45 mg","50%"],
      ["Vitamina D3 (colecalciferol)","18.8 mcg","94%"],
      ["Vitamina E (acetato de DL-alfa tocoferil)","15 mg","100%"],
      ["Vitamina B1 (tiamina)","3 mg","250%"],
      ["Vitamina B2 (riboflavina)","430 mcg","33%"],
      ["Vitamina B3 (niacinamida)","5 mg","31%"],
      ["Vitamina B6 (5-fosfato de piridoxal)","500 mcg","29%"],
      ["Folato (200 mcg ácido fólico)","335 mcg DFE","84%"],
      ["Vitamina B12 (metilcobalamina)","140 mcg","5,833%"],
      ["Biotina","150 mcg","500%"],
      ["Ácido pantoténico (D-pantotenato de calcio)","2.5 mg","50%"],
      ["Calcio (citrato y carbonato)","300 mg","23%"],
      ["Hierro (fumarato ferroso)","11.3 mg","63%"],
      ["Yodo (yoduro de potasio)","38 mcg","25%"],
      ["Magnesio (óxido de magnesio)","100 mg","24%"],
      ["Zinc (quelato aminoácido)","7.5 mg","68%"],
      ["Selenio (quelato aminoácido)","18 mcg","32%"],
      ["Cobre (quelato aminoácido)","500 mcg","56%"],
      ["Manganeso (quelato aminoácido)","500 mcg","22%"],
      ["Cromo (quelato aminoácido)","30 mcg","86%"],
      ["Molibdeno (quelato)","18.8 mcg","42%"]
    ],
    nota: "Vía oral. Adultos: 1 tableta masticable al día; no exceder la dosis recomendada. Libre de lácteos, gluten, soya, maní, frutos secos, huevo, mariscos y pescado; sin conservantes, saborizantes, colorantes ni endulzantes artificiales. Conservar en lugar fresco y seco, a no más de 30 °C. Los complementos alimenticios no deben utilizarse como sustitutos de una dieta variada y equilibrada."
  }
};
const productos = [
  // OFERTA ESPECIAL
  { id:"oferta1", tipo:"oferta", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:false, cat:"oferta", destacado:true, marca:"Bari&Nutrition",
    nombre:"Pack x2 Proteínas Líquidas",
    desc:"Llévate 2 proteínas líquidas para tu recuperación post cirugía bariátrica. Sin lactosa, enriquecidas en fibra, aminoácidos, vitaminas y minerales.",
    incluye:"Proteína líquida x2 · Sabores a elección: Maracumango o Fresa",
    tags:["Sin lactosa","20g proteína","Post operatorio"],
    precio:360, precioN:400, ahorro:40,
    img: "img/oferta-2liquidas.jpg",
    seleccionSabor:[{label:"Proteína Líquida 1",sabores:["Maracumango","Fresa"]},{label:"Proteína Líquida 2",sabores:["Maracumango","Fresa"]}],
    uso:"Consume según indicación de tu equipo médico. Ideal para la etapa post operatoria.", tn:null },

  { id:"oferta2", tipo:"oferta", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:false, cat:"oferta", destacado:true, fiestas:true, marca:"Bari&Nutrition",
    nombre:"Pack x2 Proteínas Whey",
    desc:"Promo de julio: llévate 2 Whey Protein de 1.5kg. 30g de proteína por servicio, sin gluten, sin lactosa y 0% azúcar.",
    incluye:"Whey Protein 1.5kg x2 · Sabores a elección: Vainilla o Chocolate",
    tags:["Promo Julio","30g proteína","Sin lactosa"],
    precio:520, precioN:560, ahorro:40,
    img: "img/oferta-2whey-limpia.jpg",
    seleccionSabor:[{label:"Whey Protein 1",sabores:["Vainilla","Chocolate"]},{label:"Whey Protein 2",sabores:["Vainilla","Chocolate"]}],
    uso:"Disolver 3 scoops (48g) en 250ml de agua o leche. Consumir según indicación de tu equipo médico.", tn: tn.whey },

  /* Oferta de los multivitamínicos Bariatric Fusion.
     Actualizada el 04-09-2026: llegó el stock del sabor tropical,
     así que el pack ya deja elegir el sabor de cada frasco
     (seleccionSabor). Precios nuevos: S/280 la unidad y S/550 el
     pack de 2 (antes S/290 y S/560). */
  { id:"oferta3", tipo:"oferta", marcaTipo:"bf",
    brand:"Bariatric Fusion", eligibleForBnQuantityDiscount:false, cat:"oferta", destacado:true, marca:"Bariatric Fusion",
    nombre:"Pack x2 Multivitamínicos Bariatric Fusion",
    desc:"Llévate 2 envases del multivitamínico completo de Bariatric Fusion. 120 tabletas masticables cada uno: a razón de 1 al día, los dos envases cubren unos 8 meses de suplementación.",
    incluye:"Multivitamínico Completo — 120 tabletas x2 · Sabores a elección: Bayas mixtas o Tropical",
    tags:["240 tabletas en total","1 al día","Marca americana","Sin gluten"],
    precio:550, precioN:560, ahorro:10,
    img: "img/oferta-2multivit.jpg",
    seleccionSabor:[{label:"Multivitamínico 1",sabores:["Bayas mixtas","Tropical"]},{label:"Multivitamínico 2",sabores:["Bayas mixtas","Tropical"]}],
    uso:"Vía oral. Adultos: 1 tableta masticable al día. No exceder la dosis recomendada.",
    tn: tn.bf_multivit },

  // BARI&NUTRITION PACKS
  { id:"bp1", tipo:"pack", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"Bari&Nutrition",
    nombre:"Pack Proteína Líquida",
    desc:"Combinación ideal para la etapa de transición líquida.",
    incluye:"Proteína líquida x2 · Gomitas multivitamínicas x1 · Gomitas B12 + ácido fólico x1 · Fibra soluble x1",
    tags:["Alta proteína","Fácil absorción","Vitaminas esenciales"],
    precio:722, precioN:785, ahorro:63,
    img: "img/bn-pack-inicial.jpg",
    seleccionSabor:[{label:"Proteína Líquida 1",sabores:["Maracumango","Fresa"]},{label:"Proteína Líquida 2",sabores:["Maracumango","Fresa"]}],
    uso:"Combina cada producto según indicación de tu equipo médico. Consulta las dosis en cada envase.", tn:null },

  { id:"bp2", tipo:"pack", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"Bari&Nutrition",
    nombre:"Pack Proteína en Polvo + Vitaminas",
    desc:"Ideal cuando ya puedes consumir proteína en polvo. Cubre vitaminas y minerales esenciales.",
    incluye:"Proteína en polvo x1 · Gomitas multivitamínicas x1 · Gomitas hierro + vit C x1 · Gomitas B12 + ácido fólico x1",
    tags:["30g proteína","Hierro","Multivitamínico"],
    precio:672, precioN:730, ahorro:58,
    img: "img/bn-pack-polvo-vitaminas.jpg",
    seleccionSabor:[{label:"Proteína en Polvo (Whey)",sabores:["Vainilla","Chocolate"]}],
    uso:"Combina cada producto según indicación de tu equipo médico.", tn:null },

  { id:"bp3", tipo:"pack", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"Bari&Nutrition",
    nombre:"Pack Energía y Cabello",
    desc:"Para quienes experimentan pérdida de cabello y quieren reforzar biotina y hierro.",
    incluye:"Gomitas biotina x1 · Gomitas multivitamínicas x1 · Gomitas hierro + vit C x1 · Gomitas B12 + ácido fólico x1",
    tags:["Biotina 10,000 mcg","Hierro 45mg","Cabello y uñas"],
    precio:552, precioN:600, ahorro:48,
    img: "img/bn-pack-energia-cabello.jpg",
    uso:"Combina cada producto según indicación de tu equipo médico.", tn:null },

  { id:"bp4", tipo:"pack", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:false, cat:"pack", destacado:true, marca:"Bari&Nutrition",
    nombre:"Pack Suplementación Completa",
    desc:"El pack más completo de Bari&Nutrition. Cubre proteína líquida, proteína en polvo, vitaminas, hierro, biotina y fibra.",
    incluye:"Proteína líquida x1 · Proteína en polvo x1 · Gomitas biotina x1 · Gomitas multivitamínicas x1 · Gomitas hierro + vit C x1 · Gomitas B12 + ácido fólico x1 · Fibra soluble x1",
    tags:["7 productos","Ahorro máximo","Todo en uno"],
    precio:1060, precioN:1165, ahorro:105,
    img: "img/bn-pack-suplementacion-completa.jpg",
    seleccionSabor:[{label:"Proteína Líquida",sabores:["Maracumango","Fresa"]},{label:"Proteína en Polvo (Whey)",sabores:["Vainilla","Chocolate"]}],
    uso:"Combina cada producto según indicación de tu equipo médico.", tn:null },

  // LVL DRINK PACKS
  { id:"lp1", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", destacado:true, marca:"LVL Drink",
    nombre:"Pack Completo LVL",
    desc:"El pack más completo de LVL Drink. Proteína, colágeno, fibra y shaker oficial en un solo pedido.",
    incluye:"Proteína en Polvo 1kg (sabor a elegir) · Colágeno Hidrolizado 500g · Fibra Manzana Verde 200g · Shaker oficial",
    tags:["4 productos","Shaker incluido","Apto bariátrico"],
    precio:389, precioN:477, ahorro:88,
    img: LVL+"pack-completo.jpg",
    seleccionSabor:[{label:"Proteína en Polvo HIGH ISO",sabores:["Vainilla","Chocolate"]}],
    uso:"Consulta las dosis individuales en cada envase.", tn:null },

  { id:"lp2", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"LVL Drink",
    nombre:"Pack Proteína + Colágeno + Shaker",
    desc:"Proteína en Polvo HIGH ISO + Colágeno Hidrolizado SKINFINITY + Shaker oficial LVL.",
    incluye:"Proteína en Polvo 1kg (sabor a elegir) · Colágeno Hidrolizado 500g · Shaker oficial",
    tags:["3 productos","Shaker incluido","Apto bariátrico"],
    precio:309, precioN:368, ahorro:59,
    img: LVL+"pack-prot-colageno.jpg",
    seleccionSabor:[{label:"Proteína en Polvo HIGH ISO",sabores:["Vainilla","Chocolate"]}],
    uso:"Consulta las dosis individuales en cada envase.", tn:null },

  { id:"lp3", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"LVL Drink",
    nombre:"Pack Proteína + Fibra + Shaker",
    desc:"Proteína en Polvo HIGH ISO + Fibra Manzana Verde + Shaker oficial LVL.",
    incluye:"Proteína en Polvo 1kg (sabor a elegir) · Fibra Manzana Verde 200g · Shaker oficial",
    tags:["3 productos","Shaker incluido","Apto bariátrico"],
    precio:269, precioN:349, ahorro:80,
    img: LVL+"pack-prot-fibra.jpg",
    seleccionSabor:[{label:"Proteína en Polvo HIGH ISO",sabores:["Vainilla","Chocolate"]}],
    uso:"Consulta las dosis individuales en cada envase.", tn:null },

  { id:"lp4", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"LVL Drink",
    nombre:"Pack Colágeno + Fibra + Shaker",
    desc:"Colágeno Hidrolizado SKINFINITY + Fibra Manzana Verde + Shaker oficial LVL.",
    incluye:"Colágeno Hidrolizado 500g · Fibra Manzana Verde 200g · Shaker oficial",
    tags:["3 productos","Shaker incluido","Apto bariátrico"],
    precio:179, precioN:238, ahorro:59,
    img: LVL+"pack-colageno-fibra.jpg",
    uso:"Consulta las dosis individuales en cada envase.", tn:null },

  { id:"lp5", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"LVL Drink",
    nombre:"Pack Doble Fibra + Shaker",
    desc:"Dos potes de Fibra Manzana Verde + Shaker oficial LVL. Ideal para el cuidado intestinal.",
    incluye:"Fibra Manzana Verde x2 (200g c/u) · Shaker oficial",
    tags:["Doble fibra","Shaker incluido","Tránsito intestinal"],
    precio:149, precioN:218, ahorro:69,
    img: LVL+"pack-doble-fibra.jpg",
    uso:"Disolver 1 scoop (10g) en 250ml de agua al día.", tn:null },

  { id:"lp6", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"LVL Drink",
    nombre:"Pack Doble Colágeno + Shaker",
    desc:"Dos potes de Colágeno Hidrolizado SKINFINITY + Shaker oficial LVL.",
    incluye:"Colágeno Hidrolizado x2 (500g c/u) · Shaker oficial",
    tags:["Doble colágeno","Shaker incluido","Piel y cabello"],
    precio:209, precioN:258, ahorro:49,
    img: LVL+"pack-doble-colageno.jpg",
    uso:"Disolver 1 scoop (12g) en 250ml de agua al día.", tn:null },

  { id:"lp7", tipo:"pack", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"pack", marca:"LVL Drink",
    nombre:"Pack 2 Proteínas + Shaker",
    desc:"Proteína Chocolate + Proteína Vainilla + Shaker oficial. Ambos sabores para variar.",
    incluye:"Proteína Chocolate 1kg · Proteína Vainilla 1kg · Shaker oficial",
    tags:["Ambos sabores","Shaker incluido","54g proteína/día"],
    precio:399, precioN:479, ahorro:80,
    img: LVL+"pack-2proteinas.jpg",
    uso:"Disolver 1 scoop (40g) en 250ml de agua al día.", tn:null },

  // BARI&NUTRITION INDIVIDUALES
  { id:"bi1", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"proteina", subcat:"polvo", destacado:true, marca:"Bari&Nutrition",
    sabores:["Vainilla","Chocolate"], saborPredeterminado:"Vainilla",
    nombre:"Whey Protein Vainilla 1.5kg",
    desc:"Proteína en polvo hidrolizada a base de suero de leche deslactosada. 30g de proteína por servicio. Enriquecida con vitaminas y minerales.",
    tags:["30g proteína","Sin gluten","Sin lactosa","Con biotina","0% azúcar"],
    precio:280,
    img: BN+"whey-vainilla.jpg",
    galeria: [BN+"whey-vainilla.jpg", "img/tn-whey-vainilla.jpg"],
    uso:"Disolver 3 scoops (48g) en 250ml de agua o leche. Consumir preferentemente como suplemento proteico según indicación médica.",
    tn: tn.whey },

  { id:"bi2", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"proteina", subcat:"polvo", marca:"Bari&Nutrition",
    sabores:["Vainilla","Chocolate"], saborPredeterminado:"Chocolate",
    nombre:"Whey Protein Chocolate 1.5kg",
    desc:"Proteína en polvo hidrolizada a base de suero de leche deslactosada. 30g de proteína por servicio. Enriquecida con vitaminas y minerales.",
    tags:["30g proteína","Sin gluten","Sin lactosa","Con biotina","0% azúcar"],
    precio:280,
    img: BN+"whey-chocolate.jpg",
    /* Misma tabla nutricional que la de vainilla: los valores son
       los mismos para los dos sabores (confirmado por Zona
       Bariátrica). Por eso el archivo se llama "-vainilla". */
    galeria: [BN+"whey-chocolate.jpg", "img/tn-whey-vainilla.jpg"],
    uso:"Disolver 3 scoops (48g) en 250ml de agua o leche.",
    tn: tn.whey },

  { id:"bi3", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"proteina", subcat:"liquida", destacado:true, marca:"Bari&Nutrition",
    sabores:["Fresa","Maracumango"], saborPredeterminado:"Fresa",
    nombre:"Liquid Protein Fresa 1LT",
    desc:"Proteína líquida lista para consumir. 20g de proteína por porción de 30ml. Sin lactosa, 0% azúcar. Enriquecida con fibra, aminoácidos, vitaminas y minerales.",
    tags:["20g proteína","Sin lactosa","0% azúcar","Lista para tomar","50mg hierro"],
    precio:200,
    img: BN+"liquid-fresa.jpg",
    galeria: [BN+"liquid-fresa.jpg", "img/tn-liquid-protein.jpg"],
    uso:"Tomar 30ml por porción. Hasta 33 porciones por envase de 1 litro.",
    tn: tn.liquid },

  { id:"bi4", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"proteina", subcat:"liquida", destacado:true, marca:"Bari&Nutrition",
    sabores:["Maracumango","Fresa"], saborPredeterminado:"Maracumango",
    nombre:"Liquid Protein Maracumango 1LT",
    desc:"Proteína líquida lista para consumir. 20g de proteína por porción de 30ml. Sin lactosa, 0% azúcar. Enriquecida con fibra, aminoácidos, vitaminas y minerales.",
    tags:["20g proteína","Sin lactosa","0% azúcar","Lista para tomar","50mg hierro"],
    precio:200,
    img: BN+"liquid-maracumango.jpg",
    galeria: [BN+"liquid-maracumango.jpg", "img/tn-liquid-protein.jpg"],
    uso:"Tomar 30ml por porción. Hasta 33 porciones por envase de 1 litro.",
    tn: tn.liquid },

  { id:"bi5", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"vitaminas", subcat:"biotina", formato:"gomitas", destacado:true, marca:"Bari&Nutrition",
    nombre:"Gomitas Biotina 10,000mcg — 90 und",
    desc:"Gomitas de glicerina sabor durazno. 10,000 mcg de biotina por porción. Apoya la salud del cabello, piel y uñas. Sin azúcares añadidos, sin colorantes artificiales.",
    tags:["10,000 mcg biotina","Sabor durazno","Sin azúcares","Sin colorantes"],
    precio:150,
    img: BN+"gomita-biotina.jpg",
    galeria: [BN+"gomita-biotina.jpg", "img/tn-biotina.jpg"],
    uso:"2 gomitas al día, preferiblemente con una comida. No exceda la dosis recomendada.",
    tn: tn.biotina },

  { id:"bi6", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"vitaminas", subcat:"hierro", formato:"gomitas", marca:"Bari&Nutrition",
    nombre:"Gomitas Hierro 45mg + Vitamina C — 30 und",
    desc:"Gomitas de gelatina sabor naranja. 45mg de hierro (250% VD) + 60mg de vitamina C. La vitamina C potencia la absorción del hierro.",
    tags:["45mg hierro","Vitamina C 60mg","250% VD","Sabor naranja","Sin azúcares"],
    precio:150,
    img: BN+"gomita-hierro.jpg",
    galeria: [BN+"gomita-hierro.jpg", "img/tn-hierro.jpg"],
    uso:"1 gomita masticable al día. Vía oral.",
    tn: tn.hierro },

  { id:"bi7", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"vitaminas", subcat:"multivit", formato:"gomitas", marca:"Bari&Nutrition",
    nombre:"Gomitas Multivitamínico — 90 und",
    desc:"Gomitas multisabor con 23 vitaminas y minerales esenciales. Fórmula completa para cubrir los requerimientos nutricionales post-quirúrgicos.",
    tags:["23 vitaminas y minerales","Multisabor","Sin azúcares","Sin colorantes"],
    precio:150,
    img: BN+"gomita-multivit.jpg",
    galeria: [BN+"gomita-multivit.jpg", "img/tn-multivitaminico.jpg"],
    uso:"4 gomitas al día.",
    tn: tn.multivit },

  { id:"bi8", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"vitaminas", subcat:"b12", formato:"gomitas", destacado:true, marca:"Bari&Nutrition",
    nombre:"Gomitas B12 + Ácido Fólico — 90 und",
    desc:"Gomitas sabor piña. 1,000 mcg de vitamina B12 como metilcobalamina (41,667% VD) + ácido fólico. Esencial en el post-operatorio bariátrico.",
    tags:["1,000 mcg B12","41,667% VD","Ácido fólico","Sabor piña","Sin azúcares"],
    precio:150,
    img: BN+"gomita-b12.jpg",
    galeria: [BN+"gomita-b12.jpg", "img/tn-b12.jpg"],
    uso:"3 gomitas masticables al día.",
    tn: tn.b12 },

  { id:"bi9", tipo:"bn", marcaTipo:"bn",
    brand:"B&N", eligibleForBnQuantityDiscount:true, cat:"colageno", subcat:"fibra", marca:"Bari&Nutrition",
    nombre:"Fibra Soluble 320g",
    desc:"Fibra soluble a base de maíz, de origen francés. Rápida absorción. Ayuda en el tratamiento del estreñimiento y mantiene la regularidad intestinal.",
    tags:["Base de maíz","Origen francés","Rápida absorción","Sin azúcar","64 servicios"],
    precio:85,
    img: BN+"fibra.jpg",
    galeria: [BN+"fibra.jpg", "img/tn-fibra.jpg"],
    uso:"1 scoop (5g) al día disuelto en agua o bebida de preferencia.",
    tn: tn.fibra_bn },

  // LVL DRINK INDIVIDUALES
  { id:"li1", tipo:"lvl", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"proteina", subcat:"polvo", destacado:true, marca:"LVL Drink",
    sabores:["Vainilla","Chocolate"], saborPredeterminado:"Vainilla",
    nombre:"Proteína Vainilla HIGH ISO 1kg",
    desc:"Proteína concentrada de suero de leche (WPC). 27g de proteína por porción. Endulzada con stevia natural, sin azúcares añadidos, sin gluten. Apta para nutrición bariátrica.",
    tags:["27g proteína","Stevia natural","Sin gluten","Sin azúcares","Apto bariátrico"],
    precio:209,
    img: LVL+"proteina-vainilla.jpg",
    galeria: [LVL+"proteina-vainilla.jpg", "img/tn-lvl-proteina-vainilla.jpg"],
    uso:"Disolver 1 scoop (40g) en 250ml de agua. Consumir una vez al día.",
    tn: tn.lvl_pro },

  { id:"li2", tipo:"lvl", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"proteina", subcat:"polvo", destacado:true, marca:"LVL Drink",
    sabores:["Vainilla","Chocolate"], saborPredeterminado:"Chocolate",
    nombre:"Proteína Chocolate HIGH ISO 1kg",
    desc:"Proteína concentrada de suero de leche (WPC). 27g de proteína por porción. Sabor a chocolate 100% cacao, endulzado con stevia natural. Sin azúcares añadidos, sin gluten.",
    tags:["27g proteína","100% cacao","Stevia natural","Sin gluten","Apto bariátrico"],
    precio:209,
    img: LVL+"proteina-chocolate.jpg",
    galeria: [LVL+"proteina-chocolate.jpg", "img/tn-lvl-proteina-chocolate.jpg"],
    uso:"Disolver 1 scoop (40g) en 250ml de agua. Consumir una vez al día.",
    tn: tn.lvl_pro },

  { id:"li3", tipo:"lvl", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"colageno", subcat:"colageno", marca:"LVL Drink",
    nombre:"Colágeno SKINFINITY 500g",
    desc:"Colágeno hidrolizado con camu camu, arándano y 10,000 mcg de biotina. Para el cuidado de piel, cabello y uñas. Sabor natural arándano, sin azúcares añadidos.",
    tags:["9g colágeno","10,000 mcg biotina","Camu camu","Sabor arándano","Apto bariátrico"],
    precio:109,
    img: LVL+"colageno.jpg",
    galeria: [LVL+"colageno.jpg", "img/tn-lvl-colageno.jpg"],
    uso:"Disolver 1 scoop (12g) en 250ml de agua al día. Se recomienda consumir en ayunas o antes de acostarse.",
    tn: tn.lvl_col },

  { id:"li4", tipo:"lvl", marcaTipo:"lvl",
    brand:"LVL Drink", eligibleForBnQuantityDiscount:false, cat:"colageno", subcat:"fibra", marca:"LVL Drink",
    nombre:"Fibra GET OUT Manzana Verde 200g",
    desc:"Fibra natural de inulina. Mejora la digestión, promueve la salud intestinal y favorece la sensación de saciedad. Sabor manzana verde, sin azúcares añadidos.",
    tags:["6g fibra","Fibra inulina","Sabor manzana verde","Sin azúcares","Apto bariátrico"],
    precio:79,
    img: LVL+"fibra.jpg",
    galeria: [LVL+"fibra.jpg", "img/tn-lvl-fibra.jpg"],
    uso:"Disolver 1 scoop (10g) en 250ml de agua al día.",
    tn: tn.lvl_fib },

  /* BARIATRIC FUSION — actualizado el 04-09-2026.
     ---------------------------------------------------------
     Los DOS sabores están a la venta a S/280 cada uno (antes
     S/290). El tropical (bf1) ya llegó al stock: se le quitó
     "proximamente:true" y se le puso precio, así que entra al
     carrito como cualquier otro producto.

     Si algún sabor se queda sin stock: borrar su línea "precio"
     y poner "proximamente:true". La función sinPrecio() de
     index.html lo detecta sola y muestra "Próximamente" con un
     botón de aviso por WhatsApp en lugar del de agregar.

     La tabla nutricional (tn.bf_multivit) es la misma para los
     dos: cambia el sabor, no la fórmula. */
  { id:"bf1", tipo:"bf", marcaTipo:"bf",
    brand:"Bariatric Fusion", eligibleForBnQuantityDiscount:false, cat:"vitaminas", subcat:"multivit", formato:"tabletas", marca:"Bariatric Fusion",
    nombre:"Multivitamínico Completo Tropical — 120 tabletas",
    desc:"Multivitamínico completo en tabletas masticables, sabor tropical. Envase de 120 tabletas de Bariatric Fusion, marca estadounidense especializada en pacientes bariátricos. Una tableta al día cubre el perfil completo de vitaminas y minerales.",
    tags:["120 tabletas","Masticables","Sabor tropical","1 al día","Sin gluten"],
    precio:280,
    img: BF+"multivit-tropical.jpg",
    uso:"Vía oral. Adultos: 1 tableta masticable al día. No exceder la dosis recomendada.",
    tn: tn.bf_multivit },

  { id:"bf2", tipo:"bf", marcaTipo:"bf",
    brand:"Bariatric Fusion", eligibleForBnQuantityDiscount:false, cat:"vitaminas", subcat:"multivit", formato:"tabletas", destacado:true, marca:"Bariatric Fusion",
    nombre:"Multivitamínico Completo Bayas Mixtas — 120 tabletas",
    desc:"Multivitamínico completo en tabletas masticables, sabor bayas mixtas. Envase de 120 tabletas de Bariatric Fusion, marca estadounidense especializada en pacientes bariátricos. Una tableta al día cubre el perfil completo de vitaminas y minerales.",
    tags:["120 tabletas","Masticables","Sabor bayas mixtas","1 al día","Sin gluten"],
    precio:280,
    img: BF+"multivit-bayas.jpg",
    uso:"Vía oral. Adultos: 1 tableta masticable al día. No exceder la dosis recomendada.",
    tn: tn.bf_multivit }
];

/* =========================================================
   REGLAS COMERCIALES POR PRODUCTO
   ---------------------------------------------------------
   Dos propiedades por producto mandan sobre el descuento por
   cantidad de Bari&Nutrition (ver DESCUENTO_BN en index.html):

     brand                        -> marca comercial
     eligibleForBnQuantityDiscount -> si suma para el descuento

   Solo los INDIVIDUALES B&N suman. Los packs y las ofertas 2x
   ya traen su propio precio especial, y las otras marcas
   (LVL Drink, Bariatric Fusion) no participan.

   Esta red de seguridad rellena las dos propiedades si algún
   producto nuevo se agrega sin ellas, para que nunca quede un
   producto sin regla. Si las pones a mano en el producto,
   mandan las tuyas. */
productos.forEach(p => {
  if (p.brand === undefined) {
    p.brand = { bn: 'B&N', lvl: 'LVL Drink', bf: 'Bariatric Fusion' }[p.marcaTipo] || p.marca;
  }
  if (p.eligibleForBnQuantityDiscount === undefined) {
    p.eligibleForBnQuantityDiscount = (p.marcaTipo === 'bn' && p.tipo === 'bn');
  }
});

/* =========================================================
   SLUGS DE LAS FICHAS DE PRODUCTO (/producto/<slug>)
   ---------------------------------------------------------
   Cada producto con ficha propia tiene aquí su dirección web.
   Es la ÚNICA fuente de verdad: la usan tanto el generador de
   las fichas como la tienda para enlazarlas.

   NO SE CAMBIAN NUNCA una vez publicados. Si se renombra un
   producto, el slug se queda como está: cambiarlo borra todo
   el posicionamiento que esa dirección haya ganado en Google.

   AL AÑADIR UN PRODUCTO NUEVO: agregar aquí su slug y volver
   a ejecutar el generador de fichas.

   Las ofertas (oferta1, oferta2) NO llevan ficha a propósito:
   son promociones con caducidad y duplican productos que ya
   tienen la suya.
   ========================================================= */
const slugs = {
  bp1: "pack-proteina-liquida",
  bp2: "pack-proteina-polvo-vitaminas",
  bp3: "pack-energia-y-cabello",
  bp4: "pack-suplementacion-completa",
  lp1: "pack-completo-lvl",
  lp2: "pack-proteina-colageno-shaker",
  lp3: "pack-proteina-fibra-shaker",
  lp4: "pack-colageno-fibra-shaker",
  lp5: "pack-doble-fibra-shaker",
  lp6: "pack-doble-colageno-shaker",
  lp7: "pack-2-proteinas-shaker",
  bi1: "whey-protein-vainilla",
  bi2: "whey-protein-chocolate",
  bi3: "proteina-liquida-fresa",
  bi4: "proteina-liquida-maracumango",
  bi5: "gomitas-biotina",
  bi6: "gomitas-hierro-vitamina-c",
  bi7: "gomitas-multivitaminico",
  bi8: "gomitas-b12-acido-folico",
  bi9: "fibra-soluble",
  li1: "proteina-vainilla-high-iso",
  li2: "proteina-chocolate-high-iso",
  li3: "colageno-skinfinity",
  li4: "fibra-get-out-manzana-verde",
  bf1: "multivitaminico-tropical-tabletas",
  bf2: "multivitaminico-bayas-tabletas"
};

/* Devuelve la dirección de la ficha de un producto, o null si
   ese producto no tiene ficha (las ofertas). */
function urlProducto(id) {
  return slugs[id] ? "/producto/" + slugs[id] : null;
}

/* Se publica en window para que lo lean otras páginas
   (el selector) sin depender del scope del script. */
window.ZB_CATALOGO = productos;
window.ZB_TN = tn;
window.ZB_SLUGS = slugs;
window.ZB_URL_PRODUCTO = urlProducto;
