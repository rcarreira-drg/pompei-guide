/**
 * Quiz de preparación sobre Pompeya. 40 preguntas repartidas a partes iguales
 * entre los ocho capítulos de src/content/sections.ts. Cada explicación enseña
 * un dato adicional, no se limita a confirmar la respuesta.
 */

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
  chapter:
    | "origenes"
    | "roma"
    | "ciudad"
    | "vida"
    | "arte"
    | "erupcion"
    | "redescubrimiento"
    | "mirar";
}

export const QUIZ: QuizQuestion[] = [
  // ORÍGENES
  {
    id: "origenes-1",
    q: "¿Hacia qué siglo se sitúan los primeros asentamientos en el lugar de Pompeya?",
    options: ["Siglo II a.C.", "Siglo I d.C.", "Siglo VIII-VII a.C.", "Siglo IV a.C."],
    answer: 2,
    explain:
      "Los hallazgos arqueológicos sitúan los primeros núcleos de población, de origen osco, en torno a los siglos VIII-VII a.C., en un promontorio de lava junto a la desembocadura del río Sarno, mucho antes de que la ciudad se convirtiera en colonia romana.",
    chapter: "origenes",
  },
  {
    id: "origenes-2",
    q: "¿Qué pueblos dejaron huella en la Pompeya arcaica, antes del dominio samnita y romano?",
    options: [
      "Griegos (vía Cumas) y etruscos, visibles en templos y cerámica arcaicos",
      "Solo los etruscos, mediante el comercio del vino",
      "Ninguno: Pompeya fue siempre exclusivamente osca",
      "Los fenicios, que fundaron el primer templo",
    ],
    answer: 0,
    explain:
      "Pompeya recibió influencias griegas, llegadas sobre todo desde la colonia de Cumas, y etruscas, perceptibles en el urbanismo temprano, en cerámica importada y en construcciones religiosas como el arcaico templo dórico del Foro Triangular.",
    chapter: "origenes",
  },
  {
    id: "origenes-3",
    q: "¿Qué fue la Guerra Social (91-89 a.C.) para Pompeya?",
    options: [
      "Una guerra civil interna entre patricios y plebeyos pompeyanos",
      "Una guerra comercial contra Cartago",
      "Una revuelta de esclavos liderada por Espartaco",
      "El conflicto en que los pueblos itálicos, incluida Pompeya, se alzaron contra Roma exigiendo la ciudadanía",
    ],
    answer: 3,
    explain:
      "En la Guerra Social, varios pueblos itálicos, samnitas, oscos y otros, entre ellos Pompeya, se rebelaron contra Roma para reclamar la ciudadanía plena. La derrota de la coalición itálica abrió el camino a la intervención directa de Sila sobre la ciudad.",
    chapter: "origenes",
  },
  {
    id: "origenes-4",
    q: "¿Qué general romano sometió Pompeya por la fuerza en el 89 a.C.?",
    options: ["Julio César", "Sila", "Pompeyo Magno", "Marco Antonio"],
    answer: 1,
    explain:
      "Lucio Cornelio Sila sitió y tomó Pompeya en el 89 a.C. durante la Guerra Social. Aún pueden verse en las murallas proyectiles de honda con inscripciones dirigidas a sus soldados, testimonio directo de aquel asedio.",
    chapter: "origenes",
  },
  {
    id: "origenes-5",
    q: "¿Qué ocurrió con Pompeya en el 80 a.C.?",
    options: [
      "Fue destruida y abandonada durante un siglo",
      "Pasó a depender administrativamente de Nápoles",
      "Se convirtió en colonia romana de veteranos de Sila, con el nombre de Colonia Cornelia Veneria Pompeianorum",
      "Obtuvo el estatuto de ciudad libre griega",
    ],
    answer: 2,
    explain:
      "Sila fundó allí una colonia de veteranos licenciados de sus legiones, bautizada Colonia Cornelia Veneria Pompeianorum en honor a su gens y a Venus, su diosa protectora. Esto trajo cambios administrativos, lingüísticos (el latín desplazó al osco) y urbanísticos.",
    chapter: "origenes",
  },

  // ROMA
  {
    id: "roma-1",
    q: "¿Qué población se calcula que tenía Pompeya en el año 79 d.C.?",
    options: [
      "Entre 11.000 y 12.000 habitantes aproximadamente",
      "Unos 1.000 habitantes",
      "Más de 100.000 habitantes",
      "Unos 500.000 habitantes",
    ],
    answer: 0,
    explain:
      "Las estimaciones, basadas en la superficie urbana y la densidad de viviendas, sitúan la población de Pompeya en torno a 11.000-12.000 personas en el momento de la erupción, cifra que incluía a esclavos, libertos y ciudadanos de distinto rango.",
    chapter: "roma",
  },
  {
    id: "roma-2",
    q: "¿Qué extensión ocupaba la Pompeya amurallada?",
    options: ["Unas 6 hectáreas", "Unas 660 hectáreas", "Unas 26 hectáreas", "Unas 66 hectáreas"],
    answer: 3,
    explain:
      "El recinto amurallado de Pompeya abarcaba unas 66 hectáreas, de las cuales hoy se ha excavado la mayor parte, aunque persisten zonas, sobre todo en el sector este, aún cubiertas por la ceniza y objeto de campañas recientes.",
    chapter: "roma",
  },
  {
    id: "roma-3",
    q: "¿Qué sacudió gravemente la ciudad en el año 62 d.C., diecisiete años antes de la erupción?",
    options: [
      "Un incendio provocado",
      "Un terremoto que dañó templos, acueducto y numerosas viviendas",
      "Una epidemia de peste",
      "Una inundación del río Sarno",
    ],
    answer: 1,
    explain:
      "El terremoto del 62 d.C. causó daños serios en edificios públicos y privados. En el 79, muchas obras de reparación seguían inacabadas, como revela el desorden de materiales y andamiajes hallado en construcciones como el Templo de Isis o el Macellum.",
    chapter: "roma",
  },
  {
    id: "roma-4",
    q: "¿Qué sucedió en el anfiteatro de Pompeya en el año 59 d.C.?",
    options: [
      "Se inauguró oficialmente el edificio",
      "Un incendio destruyó las gradas de madera",
      "Una violenta riña entre pompeyanos y espectadores de Nuceria acabó con la prohibición de juegos durante diez años",
      "Se celebró la primera lucha de gladiadores de la ciudad",
    ],
    answer: 2,
    explain:
      "Tácito narra en sus Anales cómo una disputa entre hinchas locales y de la vecina Nuceria degeneró en tumulto sangriento durante unos juegos. El Senado romano castigó a Pompeya prohibiendo espectáculos de gladiadores en su anfiteatro durante una década.",
    chapter: "roma",
  },
  {
    id: "roma-5",
    q: "¿Qué eran los 'programmata' que aparecen pintados en muchas fachadas de Pompeya?",
    options: [
      "Carteles de propaganda electoral pidiendo el voto para candidatos locales",
      "Recetas de cocina expuestas por los panaderos",
      "Horarios de los baños públicos",
      "Anuncios de espectáculos religiosos únicamente",
    ],
    answer: 0,
    explain:
      "Los programmata eran inscripciones pintadas en rojo o negro sobre las paredes, mediante las que particulares, gremios o vecinos recomendaban a un candidato para los cargos municipales de duunviro o edil. Son una fuente inigualable sobre la vida política local.",
    chapter: "roma",
  },

  // CIUDAD
  {
    id: "ciudad-1",
    q: "¿Qué son las 'Regiones' e 'insulae' en el sistema de referencia moderno de Pompeya?",
    options: [
      "Barrios y manzanas antiguos documentados por inscripciones romanas",
      "Los nombres originales romanos de los templos",
      "Zonas de cultivo fuera de las murallas",
      "Una división convencional en nueve zonas y manzanas creada en el siglo XIX para localizar cada edificio",
    ],
    answer: 3,
    explain:
      "Giuseppe Fiorelli ideó en el siglo XIX un sistema práctico que divide la ciudad en nueve Regiones, cada una en insulae (manzanas) numeradas, y estas en edificios. Así, una dirección como VI.12.2 localiza con precisión cualquier casa, sin depender de nombres antiguos perdidos.",
    chapter: "ciudad",
  },
  {
    id: "ciudad-2",
    q: "¿Qué es el 'opus reticulatum', visible en muchos muros pompeyanos?",
    options: [
      "Un tipo de mosaico geométrico de suelo",
      "Una técnica de albañilería con pequeños bloques de piedra dispuestos en rejilla sobre un núcleo de hormigón",
      "Un sistema de canalización de agua potable",
      "Una decoración pictórica de imitación de mármol",
    ],
    answer: 1,
    explain:
      "El opus reticulatum reviste el núcleo de hormigón (opus caementicium) con pequeños bloques piramidales de toba colocados en diagonal, formando un patrón romboidal. Fue muy usado en Pompeya desde finales de la República hasta el siglo I d.C.",
    chapter: "ciudad",
  },
  {
    id: "ciudad-3",
    q: "¿De dónde procedía principalmente el agua que abastecía a Pompeya en época imperial?",
    options: [
      "De pozos excavados dentro de cada vivienda únicamente",
      "Del lago de Averno, transportada en barcazas",
      "Del acueducto del Serino (Aqua Augusta), construido en época de Augusto",
      "Exclusivamente de la recogida de agua de lluvia",
    ],
    answer: 2,
    explain:
      "El acueducto del Serino, o Aqua Augusta, traía agua desde los manantiales del Serino hasta varias ciudades de la Campania, entre ellas Pompeya. Antes de su construcción, la ciudad dependía sobre todo de pozos y cisternas de agua de lluvia.",
    chapter: "ciudad",
  },
  {
    id: "ciudad-4",
    q: "¿Qué función cumplía el 'castellum aquae' junto a la Porta del Vesubio?",
    options: [
      "Repartir el agua del acueducto en tres ramales hacia fuentes, termas y casas privadas",
      "Servir de cuartel para la guarnición militar",
      "Almacenar el grano de la ciudad",
      "Funcionar como templo dedicado a Neptuno",
    ],
    answer: 0,
    explain:
      "El castellum aquae era la torre de distribución donde el agua llegada por el acueducto se repartía mediante tres tuberías de plomo: una para las fuentes públicas, otra para las termas y edificios oficiales, y la tercera, la primera en cortarse en caso de escasez, para las casas privadas.",
    chapter: "ciudad",
  },
  {
    id: "ciudad-5",
    q: "¿Para qué servían las grandes piedras colocadas en muchos cruces de las calles de Pompeya?",
    options: [
      "Para marcar los límites de cada Regio",
      "Como altares improvisados a los dioses lares",
      "Para atar a los animales de carga",
      "Para permitir cruzar sin pisar el agua o la suciedad que corría por la calzada, dejando paso a las ruedas de los carros",
    ],
    answer: 3,
    explain:
      "Las calles pompeyanas, ligeramente cóncavas, actuaban también como desagües. Las 'piedras de paso' permitían cruzar sin mojarse los pies, mientras que su espaciado dejaba sitio justo para que pasaran las ruedas de los carros, calibradas según el ancho estándar.",
    chapter: "ciudad",
  },

  // VIDA
  {
    id: "vida-1",
    q: "¿Aproximadamente cuántos termopolios (mostradores de comida y bebida) se han identificado en Pompeya?",
    options: ["Solo 3 o 4", "Unos 80", "Más de 500", "Ninguno; se ha demostrado que no existían"],
    answer: 1,
    explain:
      "Se han catalogado en torno a 80 termopolios en la ciudad, reconocibles por sus mostradores de mampostería con grandes recipientes (dolia) empotrados, donde se servía comida y bebida a los transeúntes que no cocinaban en casa por falta de cocina propia.",
    chapter: "vida",
  },
  {
    id: "vida-2",
    q: "¿Qué se ha calculado sobre el número de panaderías (pistrina) excavadas en Pompeya?",
    options: [
      "Solo una, reservada al abastecimiento militar",
      "Más de 300",
      "Unas 35, con hornos y muelas de piedra volcánica",
      "Ninguna: el pan se importaba siempre de Roma",
    ],
    answer: 2,
    explain:
      "Se han identificado unas 35 panaderías, con sus hornos abovedados y muelas de lava para moler el grano. En algunas se hallaron panes carbonizados por el calor de la erupción, con la marca del panadero aún visible en la corteza.",
    chapter: "vida",
  },
  {
    id: "vida-3",
    q: "¿Quién fue Eumachia, y por qué es recordada en Pompeya?",
    options: [
      "Una sacerdotisa y rica patrona pública que financió un gran edificio junto al Foro, vinculado al gremio de los fullones",
      "Una gladiadora célebre por sus victorias en la arena",
      "La última reina samnita de la ciudad",
      "Una esclava liberada que fundó el primer termopolio",
    ],
    answer: 0,
    explain:
      "Eumachia, sacerdotisa pública y mujer de una familia enriquecida con el comercio de tejidos, costeó de su propio bolsillo un gran edificio en el Foro, dedicado a la Concordia y la Piedad Augustas, y estrechamente vinculado a los fullones, el gremio de bataneros.",
    chapter: "vida",
  },
  {
    id: "vida-4",
    q: "¿Qué producto hizo famoso al pompeyano Umbricio Escauro, cuyo nombre aparece en ánforas y mosaicos de su casa?",
    options: [
      "El vino del Vesubio",
      "El aceite de oliva prensado en la Regio IX",
      "La cerámica de barniz negro",
      "El garum, una salsa de pescado fermentado muy apreciada en todo el Imperio",
    ],
    answer: 3,
    explain:
      "Aulo Umbricio Escauro amasó fortuna produciendo y exportando garum, la salsa de pescado fermentado imprescindible en la cocina romana. Su casa exhibía mosaicos con ánforas etiquetadas con su marca, una forma temprana de publicidad de marca comercial.",
    chapter: "vida",
  },
  {
    id: "vida-5",
    q: "¿Qué era el 'lararium' presente en casi todas las casas pompeyanas?",
    options: [
      "Una despensa para conservar aceite y vino",
      "Un pequeño altar doméstico dedicado al culto de los Lares y otros dioses protectores del hogar",
      "Un cuarto reservado a los esclavos",
      "Un pequeño estanque decorativo en el jardín",
    ],
    answer: 1,
    explain:
      "El lararium era el altar doméstico donde la familia rendía culto a los Lares, genios protectores del hogar, junto a otras divinidades de su devoción. Solía estar pintado o en forma de pequeño templete, y en él se hacían ofrendas cotidianas.",
    chapter: "vida",
  },

  // ARTE
  {
    id: "arte-1",
    q: "¿Dónde se conserva hoy el célebre mosaico de Alejandro, hallado en la Casa del Fauno?",
    options: [
      "Permanece in situ en la Casa del Fauno",
      "En el Museo Vaticano",
      "En el Museo Arqueológico Nacional de Nápoles (MANN)",
      "Se perdió durante el bombardeo de 1943",
    ],
    answer: 2,
    explain:
      "El mosaico de Alejandro, que representa el enfrentamiento entre Alejandro Magno y Darío III, se trasladó al Museo Arqueológico Nacional de Nápoles para su conservación; en la Casa del Fauno solo queda hoy una copia en el lugar original.",
    chapter: "arte",
  },
  {
    id: "arte-2",
    q: "¿Qué representa el gran friso pintado de la Villa de los Misterios, a las afueras de Pompeya?",
    options: [
      "Una serie de escenas rituales vinculadas a los misterios dionisíacos",
      "Escenas de la vida cotidiana en el mercado",
      "Batallas navales romanas",
      "Retratos de emperadores julio-claudios",
    ],
    answer: 0,
    explain:
      "El friso de la llamada sala de los Misterios muestra, en figuras a tamaño casi natural sobre fondo rojo pompeyano, una secuencia de escenas rituales que los estudiosos relacionan con la iniciación en los misterios de Dioniso, aunque su lectura exacta sigue debatida.",
    chapter: "arte",
  },
  {
    id: "arte-3",
    q: "¿Qué imagen provocativa recibía a los visitantes en el vestíbulo de la Casa de los Vettii?",
    options: [
      "Un retrato de los dos hermanos propietarios de la casa",
      "Un mapa de las rutas comerciales de la familia",
      "Una escena de caza del jabalí",
      "Una pintura de Príapo pesando su miembro en una balanza, símbolo de prosperidad",
    ],
    answer: 3,
    explain:
      "En el vestíbulo de la Casa de los Vettii, propiedad de dos libertos enriquecidos, una pintura muestra al dios Príapo pesando su falo en una balanza frente a un saco de monedas: una imagen apotropaica y también una ostentosa declaración de riqueza.",
    chapter: "arte",
  },
  {
    id: "arte-4",
    q: "¿Qué distingue a la Casa del Fauno entre las viviendas privadas de Pompeya?",
    options: [
      "Es la casa más pequeña excavada hasta ahora",
      "Es una de las mansiones más grandes de la ciudad, con dos atrios y una estatuilla de bronce de un fauno danzante",
      "Fue construida ya en época de Nerón",
      "Sirvió como sede de la administración municipal",
    ],
    answer: 1,
    explain:
      "La Casa del Fauno, con casi 3.000 metros cuadrados, es una de las residencias privadas más extensas de Pompeya. Debe su nombre a la estatuilla de bronce de un fauno danzante hallada en su atrio, y albergaba el célebre mosaico de Alejandro.",
    chapter: "arte",
  },
  {
    id: "arte-5",
    q: "¿Qué son los 'cuatro estilos pompeyanos' definidos por el arqueólogo August Mau?",
    options: [
      "Cuatro tipos de mosaico de suelo según su color",
      "Cuatro órdenes arquitectónicos usados en los templos",
      "Una clasificación de las técnicas de pintura mural romana según su evolución cronológica y decorativa",
      "Cuatro escuelas de escultura rivales en la ciudad",
    ],
    answer: 2,
    explain:
      "En 1882, el arqueólogo alemán August Mau clasificó la pintura mural pompeyana en cuatro estilos sucesivos, desde la imitación de sillares de mármol (primer estilo) hasta las complejas arquitecturas fingidas y paisajes fantásticos del cuarto estilo, vigente hasta el 79 d.C.",
    chapter: "arte",
  },

  // ERUPCIÓN
  {
    id: "erupcion-1",
    q: "¿Dónde murió Plinio el Viejo durante la erupción del Vesubio?",
    options: [
      "En Estabia, adonde había acudido al mando de la flota para socorrer a la población y observar el fenómeno",
      "En Pompeya, intentando rescatar a unos amigos",
      "En Herculano, sepultado por el flujo piroclástico",
      "En Roma, al enterarse de la noticia",
    ],
    answer: 0,
    explain:
      "Plinio el Viejo, almirante de la flota de Miseno, cruzó la bahía hacia Estabia para socorrer a los afectados y observar de cerca la erupción. Allí murió, probablemente por un colapso repentino agravado por los gases y el esfuerzo, según el relato de su sobrino.",
    chapter: "erupcion",
  },
  {
    id: "erupcion-2",
    q: "¿Cómo conocemos hoy con tanto detalle el desarrollo de la erupción del 79 d.C.?",
    options: [
      "Por los relatos de los propios habitantes supervivientes de Pompeya",
      "Por un tratado científico escrito por Séneca poco antes de morir",
      "No existe ningún testimonio escrito antiguo sobre la erupción",
      "Gracias a dos cartas que Plinio el Joven envió al historiador Tácito años después, contando lo que vio y lo que le sucedió a su tío",
    ],
    answer: 3,
    explain:
      "Plinio el Joven, testigo desde Miseno, describió el fenómeno en dos cartas a Tácito (Epístolas VI.16 y VI.20), escritas años después a petición de este. Son el único relato ocular conocido y la razón por la que este tipo de erupciones se llaman 'plinianas'.",
    chapter: "erupcion",
  },
  {
    id: "erupcion-3",
    q: "¿A qué altura aproximada alcanzó la columna eruptiva del Vesubio durante la fase inicial?",
    options: ["Unos 3 km", "Unos 30 km, entrando en la estratosfera", "Apenas 300 metros", "Más de 300 km"],
    answer: 1,
    explain:
      "Durante la fase pliniana inicial, la columna de gases, ceniza y piedra pómez ascendió unos 30 kilómetros, penetrando en la estratosfera antes de desplomarse y comenzar a llover pómez sobre Pompeya durante horas, lo que dio tiempo a huir a buena parte de la población.",
    chapter: "erupcion",
  },
  {
    id: "erupcion-4",
    q: "¿Qué causó la muerte de la mayoría de quienes permanecieron en Pompeya, más que la caída de piedra pómez?",
    options: [
      "El hambre tras semanas de asedio volcánico",
      "Un maremoto que inundó la ciudad",
      "Las oleadas piroclásticas: nubes de gas y ceniza a altísima temperatura que arrasaron la ciudad",
      "La lava líquida que cubrió las calles",
    ],
    answer: 2,
    explain:
      "A diferencia de lo que sugiere el imaginario popular, no fue la lava la que sepultó Pompeya, sino sucesivas oleadas piroclásticas: nubes densas de gas y ceniza a cientos de grados que avanzaron a gran velocidad, matando de forma casi instantánea a quienes aún quedaban en la ciudad.",
    chapter: "erupcion",
  },
  {
    id: "erupcion-5",
    q: "¿Qué puso en duda la fecha tradicional del 24 de agosto para la erupción?",
    options: [
      "Una inscripción a base de carboncillo con la fecha 'XVI K Nov' (17 de octubre) hallada en 2018, junto a otros indicios como ropa de abrigo o frutos de otoño",
      "Un eclipse solar documentado en fuentes griegas",
      "Un tratado de astronomía de Ptolomeo",
      "No hay ningún dato que cuestione la fecha de agosto",
    ],
    answer: 0,
    explain:
      "En 2018 apareció en una casa en obras una inscripción a carboncillo fechada 'XVI K Nov' (equivalente al 17 de octubre), aún fresca. Sumada a hallazgos como braseros encendidos, ropa de invierno o frutos otoñales, refuerza la hipótesis de una erupción en otoño y no en pleno verano.",
    chapter: "erupcion",
  },

  // REDESCUBRIMIENTO
  {
    id: "redescubrimiento-1",
    q: "¿Qué innovación introdujo Giuseppe Fiorelli en 1863 durante las excavaciones de Pompeya?",
    options: [
      "El uso de fotografía aérea para planificar las excavaciones",
      "La creación del primer museo arqueológico en el propio yacimiento",
      "El uso de dinamita para acelerar las excavaciones",
      "La técnica de verter yeso en las cavidades dejadas por los cuerpos descompuestos en la ceniza endurecida",
    ],
    answer: 3,
    explain:
      "Fiorelli ideó verter yeso líquido en los huecos que los cuerpos, ya descompuestos, habían dejado en la ceniza compactada. Al solidificar y retirar la tierra circundante, el yeso reproducía con sobrecogedor detalle la postura final de las víctimas, incluidos pliegues de ropa y expresiones.",
    chapter: "redescubrimiento",
  },
  {
    id: "redescubrimiento-2",
    q: "¿Qué papel desempeñó Amedeo Maiuri en la historia de las excavaciones de Pompeya?",
    options: [
      "Fue el primer visitante moderno en descubrir el yacimiento en el siglo XVIII",
      "Dirigió las excavaciones durante buena parte del siglo XX, ampliando notablemente el área abierta al público",
      "Fue el arquitecto que diseñó el actual museo de sitio",
      "Financió personalmente toda la restauración tras la Segunda Guerra Mundial",
    ],
    answer: 1,
    explain:
      "Amedeo Maiuri dirigió las excavaciones de Pompeya desde 1924 hasta 1961, un periodo en el que se amplió considerablemente la superficie excavada y se consolidaron métodos de documentación más rigurosos, aunque también se le han achacado restauraciones e interpretaciones hoy discutidas.",
    chapter: "redescubrimiento",
  },
  {
    id: "redescubrimiento-3",
    q: "¿Qué daño sufrió el yacimiento de Pompeya en 1943?",
    options: [
      "Un terremoto derribó buena parte del Foro",
      "Una inundación del Sarno anegó las excavaciones",
      "Bombardeos aliados durante la Segunda Guerra Mundial dañaron varios edificios y el antiguo museo de sitio",
      "Un incendio forestal quemó los jardines reconstruidos",
    ],
    answer: 2,
    explain:
      "En 1943, durante la campaña de Italia, bombardeos aliados alcanzaron el área arqueológica, dañando estructuras excavadas y destruyendo buena parte del antiguo Antiquarium, el museo de sitio que reunía hallazgos y algunos de los célebres calcos de yeso.",
    chapter: "redescubrimiento",
  },
  {
    id: "redescubrimiento-4",
    q: "¿En qué año fue declarada Pompeya, junto con Herculano y Torre Annunziata, Patrimonio de la Humanidad por la UNESCO?",
    options: ["1997", "1963", "2013", "1980"],
    answer: 0,
    explain:
      "La UNESCO inscribió las áreas arqueológicas de Pompeya, Herculano y Torre Annunziata en la Lista de Patrimonio Mundial en 1997, reconociendo su valor excepcional como testimonio único de la vida urbana romana congelada en un instante.",
    chapter: "redescubrimiento",
  },
  {
    id: "redescubrimiento-5",
    q: "¿Qué han aportado recientemente los estudios de ADN (publicados en 2024) sobre las víctimas de Pompeya?",
    options: [
      "Han demostrado que ninguna víctima era originaria de Italia",
      "Han confirmado con exactitud la hora del día en que murió cada víctima",
      "Han probado que los calcos de yeso contienen ADN falsificado en el siglo XIX",
      "Han revelado que algunas identidades tradicionalmente asumidas por la postura de los cuerpos, como supuestas relaciones de parentesco o de género, no se correspondían con la genética real",
    ],
    answer: 3,
    explain:
      "El análisis genético de restos en varios calcos, publicado en 2024, mostró que grupos interpretados durante décadas como madre e hija, o como una pareja heterosexual, correspondían en realidad a personas sin ese parentesco o de distinto sexo al asumido, obligando a revisar lecturas tradicionales basadas solo en la postura de los cuerpos.",
    chapter: "redescubrimiento",
  },

  // MIRAR
  {
    id: "mirar-1",
    q: "¿Qué mensaje advierte a quien entra en la Casa del Poeta Trágico, escrito en un mosaico del umbral?",
    options: [
      "'Salve', un simple saludo de bienvenida",
      "'Cave Canem' ('Cuidado con el perro'), junto a la imagen de un perro atado",
      "Una lista de precios de mercancías",
      "Una advertencia sobre el mal de ojo",
    ],
    answer: 1,
    explain:
      "El famoso mosaico 'Cave Canem' ('Cuidado con el perro'), en el umbral de la Casa del Poeta Trágico, muestra un perro guardián encadenado. Es una de las imágenes más reproducidas de Pompeya y un buen ejemplo del humor y la vida cotidiana que asoman en los detalles del yacimiento.",
    chapter: "mirar",
  },
  {
    id: "mirar-2",
    q: "¿En qué se diferencia principalmente lo que se conserva en Herculano frente a Pompeya, algo útil al comparar ambos yacimientos?",
    options: [
      "En Herculano no murió nadie, mientras que en Pompeya sí",
      "Herculano es mucho más grande que Pompeya",
      "Herculano, sepultada por flujos piroclásticos más que por caída de pómez, conserva mejor materia orgánica como madera, telas y alimentos carbonizados",
      "Pompeya fue descubierta después que Herculano",
    ],
    answer: 2,
    explain:
      "Herculano quedó cubierta principalmente por oleadas piroclásticas que carbonizaron y sellaron herméticamente materiales orgánicos, vigas de madera, muebles, incluso alimentos, mientras que en Pompeya la caída previa de pómez y ceniza conservó mejor la disposición urbana y dejó las cavidades que darían lugar a los famosos calcos.",
    chapter: "mirar",
  },
  {
    id: "mirar-3",
    q: "¿Qué es el 'Grande Progetto Pompei', que conviene tener presente al visitar el yacimiento hoy?",
    options: [
      "Un plan de conservación y restauración financiado en parte por la Unión Europea, puesto en marcha tras varios derrumbes en la década de 2010",
      "El nombre antiguo del plan urbanístico romano de la ciudad",
      "Una nueva ampliación del anfiteatro para conciertos",
      "El proyecto que trasladó todo el yacimiento a un museo cubierto",
    ],
    answer: 0,
    explain:
      "El Grande Progetto Pompei se lanzó tras derrumbes preocupantes, como el de la Casa de los Gladiadores en 2010, con financiación europea e italiana para consolidar estructuras, mejorar el drenaje de agua y frenar el deterioro de un yacimiento sometido a intemperie y afluencia masiva de visitantes.",
    chapter: "mirar",
  },
  {
    id: "mirar-4",
    q: "¿Qué distinción sostiene el anfiteatro de Pompeya entre los edificios de este tipo conservados hoy?",
    options: [
      "Es el más grande jamás construido en el Imperio romano",
      "Fue el único anfiteatro con arena cubierta de mármol",
      "Es el único anfiteatro romano con forma cuadrada",
      "Está considerado el anfiteatro de piedra conservado más antiguo que se conoce, datado hacia el 70 a.C.",
    ],
    answer: 3,
    explain:
      "Construido hacia el 70 a.C. por iniciativa de dos magistrados locales, el anfiteatro de Pompeya se considera el ejemplo de piedra conservado más antiguo de este tipo de edificio, anterior en más de un siglo al Coliseo de Roma, y merece fijarse en su sistema de accesos y gradas.",
    chapter: "mirar",
  },
  {
    id: "mirar-5",
    q: "¿Qué detalle merece la pena buscar en las Termas Estabianas u otros complejos termales de Pompeya?",
    options: [
      "Piscinas de agua salada traída expresamente del mar",
      "El sistema de hipocausto: un suelo elevado sobre pilares (suspensurae) por el que circulaba aire caliente para calefactar las salas",
      "Grandes ventanales de vidrio de colores",
      "Estatuas de emperadores en cada sala",
    ],
    answer: 1,
    explain:
      "Bajo el suelo de las salas calientes (caldarium) de las termas romanas se aprecia el hipocausto: pequeños pilares de ladrillo (suspensurae) que sostenían el pavimento y dejaban circular por debajo el aire caliente de un horno, un sistema de calefacción notablemente sofisticado para su época.",
    chapter: "mirar",
  },
];
