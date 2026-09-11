import type { Section } from './types';

export const SECTIONS: Section[] = [
  {
    id: 'origenes',
    title: 'Orígenes: oscos, griegos, samnitas',
    kicker: 'CAPÍTULO 01',
    summary:
      'Antes de ser romana, Pompeya fue una ciudad osca tejida por el comercio griego del golfo de Nápoles y remodelada por la conquista samnita, todo ello sobre una colada de lava fosilizada por el tiempo.',
    readingMinutes: 8,
    cover: { src: 'templo-apolo', alt: 'Columnas del Templo de Apolo en el foro de Pompeya', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'Pompeya no nació romana, ni siquiera nació como una sola cosa. La ciudad se levantó sobre un espolón de lava solidificada de una erupción prehistórica del Vesubio, una plataforma natural de unos 30 metros de altura que dominaba la desembocadura del río Sarno y una llanura fértil de viñas y cereales. Ese emplazamiento —defendible, cercano al mar sin estar expuesto a él, regado por un río navegable— explica por qué la zona estuvo habitada mucho antes de que existiera una **Pompeya** con ese nombre y esas murallas.',
      },
      {
        type: 'p',
        text:
          'Los primeros asentamientos estables, del siglo VIII al VI a.C., son obra de los **oscos**, un pueblo itálico de lengua propia (el osco, emparentado lejanamente con el latín) organizado en aldeas o *pagi* más que en ciudades amuralladas. No sabemos con precisión cuándo estas aldeas se fusionaron en un núcleo urbano único, pero hacia el siglo VI a.C. ya existía en el promontorio un asentamiento con entidad propia, situado en el cruce de dos mundos que se disputaban el golfo de Nápoles: el interior etrusco de Campania (Capua, Nola) y las colonias griegas de la costa.',
      },
      {
        type: 'h3',
        text: 'Un cruce de caminos, no una colonia griega',
      },
      {
        type: 'p',
        text:
          'Conviene deshacer un malentendido frecuente: Pompeya nunca fue una colonia griega, aunque la influencia helena es innegable y temprana. A pocos kilómetros, **Cumas** —fundada hacia el 740 a.C.— era la colonia griega más antigua de Italia continental, y desde allí se extendió la influencia comercial y religiosa hacia toda la bahía, incluida la posterior Neápolis (Nápoles). Los oscos de Pompeya comerciaban con esos griegos, adoptaban sus modas arquitectónicas y religiosas, y probablemente convivían con mercaderes etruscos que dominaban la Campania interior en los siglos VII y VI a.C. El geógrafo griego **Estrabón**, escribiendo siglos después con información de fuentes anteriores, resumió esa sucesión de dueños con una frase que sigue siendo la mejor síntesis que tenemos.',
      },
      {
        type: 'quote',
        text:
          'Sobre el río Sarno se asienta Pompeya, por donde se recibe y se envía la carga; la poseyeron sucesivamente los oscos, después los tirrenos (etruscos) y los pelasgos, y más tarde los samnitas, que a su vez fueron expulsados de allí.',
        cite: 'Estrabón, Geografía, V.4.8',
      },
      {
        type: 'h3',
        text: 'El Templo Dórico y el Foro Triangular',
      },
      {
        type: 'p',
        text:
          'El monumento más antiguo que se conserva en pie en Pompeya es el llamado **Templo Dórico**, en el Foro Triangular, erigido hacia el 550-530 a.C. sobre el borde de un acantilado que entonces daba directamente al mar (la línea de costa antigua estaba mucho más cerca de la ciudad que hoy; el Sarno y la sedimentación posterior alejaron el litoral varios kilómetros). Sus columnas de toba volcánica local, hoy reducidas a un basamento y unos pocos tambores, seguían el orden dórico griego pero con proporciones y técnica claramente itálicas: un ejemplo perfecto de cómo Pompeya adaptaba modelos foráneos sin copiarlos literalmente. La tradición antigua lo asociaba a Hércules, fundador legendario de la ciudad según una etimología popular que hacía derivar *Pompeii* de *pompe*, la procesión griega que celebraba sus hazañas.',
      },
      {
        type: 'p',
        text:
          'El segundo gran santuario arcaico, el **Templo de Apolo**, ocupa un lugar distinto: no en un promontorio sagrado periférico, sino en el corazón de lo que sería el foro cívico. Su fase más antigua también se remonta al siglo VI a.C., y a lo largo de los siglos siguientes fue reconstruido y ampliado repetidamente, hasta alcanzar en época romana el aspecto de columnata que hoy admiran los visitantes. Allí se veneraba a Apolo como dios oracular —había un *omphalos* y una función adivinatoria vinculada al dios délfico— y el culto pervivió, con distintos matices, durante toda la vida de la ciudad: entre los objetos hallados en su recinto hay incluso un reloj de sol de época republicana, prueba de que el templo seguía en uso activo hasta el año 79.',
      },
      {
        type: 'fact', label: 'Fundación estimada', value: 'siglo VIII-VI a.C. (asentamientos oscos dispersos)',
      },
      {
        type: 'fact', label: 'Templo Dórico', value: 'hacia 550-530 a.C., el edificio más antiguo conservado',
      },
      {
        type: 'fact', label: 'Colonia griega más cercana', value: 'Cumas, fundada hacia 740 a.C.',
      },
      {
        type: 'glossary',
        term: 'pagus',
        def: 'Aldea o distrito rural itálico, unidad de poblamiento anterior a la ciudad amurallada; varios pagi oscos pudieron fusionarse para dar origen a Pompeya.',
      },
      {
        type: 'h3',
        text: 'La conquista samnita',
      },
      {
        type: 'p',
        text:
          'Hacia finales del siglo V a.C. —el historiador griego Diodoro de Sicilia sitúa hechos paralelos en Capua (423 a.C.) y Cumas (421 a.C.)— pueblos samnitas bajaron desde el Apenino y se apoderaron de las llanuras campanas, incluida Pompeya. No fue una destrucción ni una sustitución étnica radical: los samnitas hablaban también osco, y buena parte de la población y las instituciones locales continuaron, ahora bajo un nuevo poder político organizado en torno a un magistrado supremo, el *meddix tuticus*, asistido por magistrados menores. Fue precisamente en este periodo samnita, entre los siglos IV y II a.C., cuando Pompeya adquirió buena parte de su fisonomía urbana definitiva: la trama viaria del núcleo antiguo, el recinto amurallado en piedra caliza del Sarno y toba de Nocera dispuesta en grandes sillares (*opus quadratum*), y edificios públicos como la Palestra Sannitica, destinada al entrenamiento físico y militar de los jóvenes.',
      },
      {
        type: 'illus', name: 'columna', caption: 'Los tres órdenes de columnas que conviven en Pompeya: dórico arcaico, jónico helenístico y corintio romano.',
      },
      {
        type: 'list',
        items: [
          'La muralla samnita, de casi 3.200 m de perímetro, se reforzó por fases: primero con toba blanda de pappamonte, después con piedra caliza del Sarno y finalmente con sillares de toba de Nocera.',
          'El osco siguió siendo la lengua administrativa y religiosa: inscripciones oscas señalan edificios públicos, magistrados y límites sagrados hasta bien entrado el siglo I a.C.',
          'La Palestra Sannitica, junto al Foro Triangular, es de los pocos edificios deportivos de tradición itálica —no romana— que se conservan en Italia.',
          'El plano irregular del sector más antiguo de la ciudad (alrededor del foro y el Foro Triangular) contrasta con la retícula más regular de los barrios de expansión posterior, como la Regio VI.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text:
          'Para distinguir a simple vista la fábrica samnita de la romana posterior, busca los grandes bloques de piedra gris (toba o caliza) encajados sin mortero, a hueso: es la técnica del *opus quadratum*, anterior a los ladrillos y al cemento romano que verás en la mayoría de los edificios.',
      },
      {
        type: 'img',
        src: 'foro-columnas',
        alt: 'Columnas del pórtico del foro de Pompeya con el Vesubio al fondo',
        caption: 'El foro, reconstruido en época romana, ocupa el mismo espacio que ya era centro cívico en época samnita.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'glossary',
        term: 'meddix tuticus',
        def: 'Máximo magistrado de las comunidades oscas y samnitas, equivalente funcional al cónsul romano; presidía la administración de justicia y el ejército local.',
      },
      {
        type: 'p',
        text:
          'Para cuando Roma entra en escena, a mediados del siglo IV a.C., Pompeya ya es una ciudad con siglos de estratos superpuestos: fundamentos oscos, injertos griegos y una reestructuración samnita que le dio murallas, templos y una identidad política propia. Ninguna de esas capas desapareció del todo bajo Roma; simplemente se cubrieron, como el mismo terreno volcánico sobre el que se construyó la ciudad, con nuevas capas que el visitante de hoy puede aprender a distinguir con un poco de atención.',
      },
      {
        type: 'img',
        src: 'vesubio-panoramica',
        alt: 'Vista panorámica del Vesubio desde las ruinas de Pompeya',
        caption: 'El Vesubio, entonces una montaña cubierta de viñas sin memoria de erupciones, presidía ya el paisaje de la Pompeya osca.',
        credit: 'Wikimedia Commons',
      },
    ],
  },

  {
    id: 'roma',
    title: 'De aliada a colonia romana',
    kicker: 'CAPÍTULO 02',
    summary:
      'Pompeya pasó de aliada autónoma de Roma a colonia de veteranos tras un asedio, sufrió disturbios sangrientos en su anfiteatro y un terremoto devastador, y aún se estaba reconstruyendo cuando llegó la erupción.',
    readingMinutes: 9,
    cover: { src: 'arco-caligula', alt: 'Arco honorífico romano junto al foro de Pompeya', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'Roma no conquistó Pompeya de golpe. Tras las tres **Guerras Samnitas** (343-290 a.C.), la ciudad quedó integrada en el sistema de alianzas romano como *socia*: conservaba su lengua, sus magistrados y buena parte de su autonomía interna, a cambio de aportar tropas a las campañas romanas. Durante casi dos siglos, Pompeya vivió esa condición ambigua de aliada subordinada, prosperando con el comercio de vino y aceite del golfo de Nápoles sin perder del todo su carácter osco-samnita. Esa relativa autonomía terminó de forma abrupta y violenta en el año 91 a.C.',
      },
      {
        type: 'h3',
        text: 'La Guerra Social y el asedio de Sila',
      },
      {
        type: 'p',
        text:
          'En el 91 a.C. estalló la **Guerra Social** (del latín *socii*, aliados): los pueblos itálicos, hartos de combatir por Roma sin gozar de la ciudadanía romana, se alzaron en armas. Pompeya se sumó a la rebelión, integrada en la confederación itálica. La respuesta romana llegó en el 89 a.C. en forma de un ejército al mando de **Lucio Cornelio Sila**, que puso sitio a la ciudad. El asedio dejó una huella literal en la piedra: varias murallas de Pompeya conservan todavía hoy proyectiles de catapulta —bolas de piedra caliza disparadas por *ballistae*— incrustados o hallados junto a los muros que trataban de perforar, sobre todo cerca de las puertas de Herculano y Vesubio, los puntos más débiles del recinto defensivo.',
      },
      {
        type: 'fact', label: 'Asedio de Sila', value: '89 a.C., con proyectiles de catapulta conservados en las murallas',
      },
      {
        type: 'p',
        text:
          'La ciudad resistió lo suficiente como para negociar en vez de ser arrasada, pero la autonomía política pompeyana no sobrevivió a la guerra. En el 80 a.C., ya bajo la dictadura de Sila en Roma, unos dos mil veteranos de sus legiones fueron instalados en la ciudad como colonos, con tierras expropiadas a buena parte de la población osca original. Pompeya se convirtió oficialmente en la **Colonia Cornelia Veneria Pompeianorum**: "Cornelia" por el nombre de Sila, "Veneria" por Venus, elegida diosa protectora de la nueva colonia. El latín sustituyó al osco como lengua oficial —aunque graffiti en osco siguieron apareciendo durante generaciones— y las instituciones romanas de gobierno municipal, con dos magistrados (*duoviri*) al frente, reemplazaron a las antiguas magistraturas samnitas.',
      },
      {
        type: 'glossary',
        term: 'duoviri',
        def: 'Pareja de magistrados supremos elegidos anualmente en las colonias romanas, equivalentes municipales de los cónsules de Roma; presidían la justicia y el gobierno de la ciudad.',
      },
      {
        type: 'p',
        text:
          'Esa fricción entre veteranos romanos y población osca desplazada no se resolvió de la noche a la mañana. Cicerón, defendiendo en el año 62 a.C. a Publio Sila (sobrino del dictador) de la acusación de haber instigado disturbios entre los pompeyanos, deja entrever en su discurso *Pro Sulla* que el resentimiento por las confiscaciones de tierra seguía vivo generaciones después de la fundación de la colonia. Con el tiempo, sin embargo, surgió en Pompeya una nueva aristocracia local, mestiza en origen —descendiente tanto de colonos itálicos como de familias oscas romanizadas— que supo prosperar bajo el nuevo régimen. La más visible de estas familias fue la de los **Holconios**: Marco Holconio Rufo, varias veces *duovir* y sacerdote del culto imperial, financió junto a su pariente Marco Holconio Céler la ampliación del Teatro Grande, y ambos recibieron el honor de estatuas y una tribuna reservada en el propio teatro.',
      },
      {
        type: 'img',
        src: 'basilica',
        alt: 'Restos de la basílica del foro de Pompeya con sus columnas',
        caption: 'La basílica, tribunal y centro de negocios, reflejaba el nuevo orden institucional romano tras la colonización de Sila.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'h3',
        text: 'Sangre en el anfiteatro: los disturbios del 59 d.C.',
      },
      {
        type: 'p',
        text:
          'Un siglo y medio después de la fundación de la colonia, la rivalidad local estalló de nuevo, esta vez contra la vecina Nuceria. Durante unos juegos de gladiadores organizados en el anfiteatro de Pompeya en el año 59 d.C., los aficionados de ambas ciudades pasaron de los insultos a las piedras y de las piedras a las espadas. El historiador **Tácito**, escribiendo décadas más tarde, resumió el episodio con precisión quirúrgica.',
      },
      {
        type: 'quote',
        text:
          'Por una causa banal surgió una sangrienta refriega entre los habitantes de dos colonias, Nuceria y Pompeya, durante un espectáculo de gladiadores... Empezaron con los insultos propios de gente de municipios, luego llegaron a las piedras y finalmente a las armas, saliendo mejor parados los pompeyanos, en cuyo territorio se celebraba el combate. Así, muchos nucerinos fueron llevados a Roma con el cuerpo mutilado por las heridas, y muchos lloraban la muerte de padres o hijos. El emperador remitió el juicio de este asunto al Senado, y el Senado a los cónsules; devuelto de nuevo el caso a los senadores, se prohibió a los pompeyanos celebrar durante diez años reuniones de ese tipo.',
        cite: 'Tácito, Anales, XIV.17',
      },
      {
        type: 'p',
        text:
          'La prohibición decenal de espectáculos, una sanción severa que privaba a la ciudad de una de sus principales formas de vida pública, quedó registrada también visualmente: en una casa próxima al anfiteatro se conservó un fresco que representa la refriega, con las gradas, los toldos (*vela*) y los puestos de venta ambulante alrededor del edificio, una de las escasas imágenes antiguas que muestran el aspecto real de un anfiteatro romano en pleno uso.',
      },
      {
        type: 'img',
        src: 'anfiteatro',
        alt: 'Anfiteatro de Pompeya, uno de los más antiguos del mundo romano',
        caption: 'El anfiteatro, construido hacia el 70 a.C. por los magistrados Quinto Valgo y Marco Porcio, escenario de los disturbios del 59 d.C.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'illus', name: 'gladiador', caption: 'Reconstrucción de un combate de gladiadores en el anfiteatro pompeyano, el más antiguo conservado del mundo romano.',
      },
      {
        type: 'h3',
        text: 'El terremoto del 62 d.C.',
      },
      {
        type: 'p',
        text:
          'Tres años después de los disturbios, un terremoto de fuerte intensidad sacudió la región —Séneca lo fecha en el 5 de febrero, aunque algunos manuscritos y estudiosos modernos discuten si fue en el 62 o el 63 d.C.—, dañando gravemente templos, acueductos y viviendas en Pompeya, Herculano y Nuceria. Séneca dedicó el libro VI de sus *Naturales Quaestiones* enteramente a este seísmo, en un pasaje que combina el relato de los daños con una reflexión filosófica sobre el miedo a lo impredecible.',
      },
      {
        type: 'quote',
        text:
          'Pompeya, populosa ciudad de Campania... ha sido devastada por un terremoto, y ello en pleno invierno, estación que nuestros antepasados solían asegurar que nos libraba de tales peligros. Un rebaño de seiscientas ovejas murió en aquel terremoto; estatuas se partieron en dos, y hubo personas que, fuera de sí de terror, vagaron enloquecidas sin poder gobernar su propia razón.',
        cite: 'Séneca, Cuestiones naturales, VI.1',
      },
      {
        type: 'p',
        text:
          'El daño fue tan visible que se dejó constancia de él incluso en el arte doméstico: un relieve conservado en la casa del banquero Lucio Cecilio Jocundo muestra el Templo de Júpiter y otros monumentos del foro tambaleándose, posiblemente como exvoto de agradecimiento por haber sobrevivido. Cuando el Vesubio entró en erupción diecisiete años después, en el 79 d.C., gran parte de la ciudad seguía en obras: templos a medio restaurar, casas con andamios, materiales de construcción amontonados en patios y calles. Pompeya, en otras palabras, no era ya la ciudad tranquila y asentada de sus mejores días, sino un organismo urbano convaleciente, todavía reparando las heridas de un desastre cuando llegó el siguiente, definitivo.',
      },
      {
        type: 'img',
        src: 'templo-jupiter',
        alt: 'Restos del Templo de Júpiter en el foro de Pompeya',
        caption: 'El Templo de Júpiter, gravemente dañado por el terremoto del 62 d.C. y todavía en obras de reconstrucción cuando llegó la erupción.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'fact', label: 'Terremoto', value: '62 (o 63) d.C., según Séneca y Tácito, Anales XV.22',
      },
      {
        type: 'fact', label: 'Sanción tras el motín', value: 'prohibición de espectáculos en Pompeya durante 10 años',
      },
      {
        type: 'callout',
        tone: 'info',
        text:
          'Cuando pasees por el foro fíjate en las columnas descabezadas y en los zócalos sin templo completo: buena parte de ese aspecto fragmentario no se debe solo a la erupción de 79, sino a una reconstrucción interrumpida que llevaba diecisiete años en marcha.',
      },
    ],
  },

  {
    id: 'ciudad',
    title: 'Anatomía de la ciudad',
    kicker: 'CAPÍTULO 03',
    summary:
      'Sesenta y seis hectáreas amuralladas, unos once mil habitantes, calles con aceras altas y fuentes cada ochenta metros: así funcionaba, en la práctica, una ciudad romana de tamaño medio.',
    readingMinutes: 8,
    cover: { src: 'foro-columnas', alt: 'Columnas del pórtico del foro de Pompeya', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'Pompeya ocupaba unas 66 hectáreas dentro de su recinto amurallado, con una población estimada —siempre discutida, porque no hay censos conservados— entre 11.000 y 12.000 habitantes en el momento de la erupción, aunque algunas hipótesis la elevan si se cuenta la población flotante de esclavos, visitantes y trabajadores agrícolas del entorno inmediato. Esa cifra convierte a Pompeya en una ciudad mediana para los estándares del Imperio: ni una gran metrópoli como Roma o Alejandría, ni una simple aldea, sino un centro urbano completo, con todas las funciones cívicas, religiosas, comerciales y de ocio que cabía esperar de una ciudad romana plena.',
      },
      {
        type: 'h3',
        text: 'El mapa de Fiorelli: Regiones e insulae',
      },
      {
        type: 'p',
        text:
          'El sistema que hoy usamos para localizar cualquier punto de Pompeya —y que verás citado en cualquier plano o cartela del yacimiento— no es antiguo, sino una invención del arqueólogo **Giuseppe Fiorelli** en la década de 1860. Fiorelli dividió la ciudad excavada en nueve **Regiones** (I a IX, numeradas con números romanos), cada una subdividida en manzanas o **insulae**, y dentro de cada insula, cada entrada o edificio recibió un número correlativo. Así, una dirección como "VI.15.1" no es una calle y un número al estilo moderno, sino Región VI, insula 15, entrada 1: es precisamente la manera de localizar, por ejemplo, la Casa del Fauno. El sistema es artificial pero extraordinariamente útil, y ha sobrevivido intacto porque funciona.',
      },
      {
        type: 'glossary',
        term: 'insula (urbanismo)',
        def: 'En el sistema de Fiorelli, cada una de las manzanas en que se subdivide una Región de Pompeya; no debe confundirse con el edificio de apartamentos romano del mismo nombre.',
      },
      {
        type: 'h3',
        text: 'Calles, aceras y el problema del agua',
      },
      {
        type: 'p',
        text:
          'Las calles principales —Vía de la Abundancia, Vía Estabiana, Vía Consular, Vía de Nola— están pavimentadas con grandes losas de lava poligonales, muy desgastadas por el tráfico de carros: en muchos tramos se aprecian a simple vista los **surcos** paralelos excavados por siglos de ruedas, siempre a la misma distancia entre sí, lo que revela el ancho estándar de los ejes de los carros romanos. Las aceras, bastante más altas que las actuales, servían para mantener a los peatones por encima del agua de lluvia y de los residuos que corrían por el centro de la calzada; en los cruces más transitados se dispusieron **piedras de paso**, grandes bloques elevados que permitían cruzar sin mancharse los pies, dejando huecos calculados para que las ruedas de los carros pasaran entre ellas sin problema.',
      },
      {
        type: 'img',
        src: 'via-stabiana-adoquines',
        alt: 'Adoquinado de la Vía Estabiana con surcos de carros',
        caption: 'Los surcos de las ruedas, tallados a lo largo de generaciones, marcan aún el sentido del tráfico romano.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'p',
        text:
          'El agua llegaba a la ciudad desde muy lejos: el acueducto **Aqua Augusta**, construido en época de Augusto, traía agua desde los manantiales de Serino, a unos 40 km de distancia, siguiendo un trazado que abastecía también a Nápoles, Nola, Herculano y otras ciudades del golfo. Al entrar en Pompeya, el agua llegaba a una torre de distribución, el **castellum aquae**, situada junto a la Puerta del Vesubio, en el punto más alto de la ciudad. Desde allí se repartía por tres canales de plomo —el sistema permitía cortar el suministro a los baños o a las viviendas privadas en caso de escasez, dando prioridad a las fuentes públicas— hacia una red de más de cuarenta **fuentes públicas** repartidas de forma que casi ningún vecino tuviera que caminar más de 80 metros para conseguir agua.',
      },
      {
        type: 'img',
        src: 'calle-fuente',
        alt: 'Fuente pública de piedra en una calle de Pompeya',
        caption: 'Fuente pública típica, con pilón de piedra y surtidor decorado, alimentada por el acueducto de Serino.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'fact', label: 'Superficie amurallada', value: '≈ 66 hectáreas' },
      {
        type: 'fact', label: 'Población estimada', value: '11.000-12.000 habitantes' },
      {
        type: 'fact', label: 'Distancia entre fuentes públicas', value: '≈ 80 m' },
      {
        type: 'fact', label: 'Origen del agua', value: 'acueducto Aqua Augusta, manantiales de Serino (≈ 40 km)' },
      {
        type: 'glossary',
        term: 'castellum aquae',
        def: 'Torre o depósito de distribución donde el agua del acueducto llegaba a la ciudad y se repartía en tres ramales hacia fuentes, termas y domus privadas.',
      },
      {
        type: 'h3',
        text: 'El foro: centro cívico, religioso y comercial',
      },
      {
        type: 'p',
        text:
          'Toda esa trama urbana converge en el **foro**, una plaza rectangular alargada, cerrada al tráfico rodado mediante bolardos de piedra y rodeada de pórticos de dos alturas. Alrededor se concentran las funciones que definían la vida pública romana: el templo dedicado a la tríada capitolina (Júpiter, Juno y Minerva) presidiendo un extremo; el **macellum**, mercado cubierto de alimentos con su patio central y pequeñas tiendas alrededor; la **basílica**, tribunal de justicia y lonja de negocios a la vez, el edificio civil más grande de la ciudad; y el edificio de **Eumachia**, sede del gremio de tintoreros y bataneros, financiado por una sacerdotisa pública que le dio nombre. El **comitium**, un espacio abierto junto al foro, servía para las votaciones y asambleas de los ciudadanos con derecho de voto.',
      },
      {
        type: 'img',
        src: 'macellum',
        alt: 'Restos del macellum o mercado cubierto de Pompeya junto al foro',
        caption: 'El macellum, mercado de alimentos frescos y carne, con su patio porticado y pequeños comercios en el perímetro.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'h3',
        text: 'Puertas, murallas y los muertos fuera de la ciudad',
      },
      {
        type: 'p',
        text:
          'Siete puertas principales perforaban la muralla —Marina, Herculano, Vesubio, Nola, Sarno, Nocera y Estabia son las más conocidas—, cada una alineada con una de las grandes vías que salían hacia el territorio circundante o hacia otras ciudades campanas. Como en toda ciudad romana, la ley prohibía enterrar a los muertos dentro del recinto urbano, así que las necrópolis se alineaban justo fuera de las puertas, flanqueando los caminos de acceso: la de la Puerta de Nocera y la de la Puerta de Herculano son las mejor conservadas, con monumentos funerarios de familias acomodadas compitiendo por la atención de quien entraba o salía de la ciudad. El Sarno, hoy alejado y casi invisible desde el yacimiento, corría entonces mucho más cerca, y su desembocadura albergaba un pequeño puerto fluvial-marítimo por el que entraban el vino, el aceite y las ánforas de garum que sostenían buena parte de la economía pompeyana.',
      },
      {
        type: 'img',
        src: 'porta-marina',
        alt: 'Puerta Marina, entrada principal a las ruinas de Pompeya',
        caption: 'La Puerta Marina, acceso principal desde el puerto y hoy entrada habitual de los visitantes al yacimiento.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'illus', name: 'brujula', caption: 'Orientación de Pompeya: la trama de calles no sigue un único trazado ortogonal, sino la superposición de fases urbanísticas sucesivas.',
      },
      {
        type: 'callout',
        tone: 'info',
        text:
          'La cuadrícula de calles no es homogénea porque la ciudad no se construyó de una vez: el núcleo antiguo junto al foro tiene un trazado irregular heredado de la época samnita, mientras que los barrios de expansión posterior siguen una retícula mucho más regular.',
      },
    ],
  },

  {
    id: 'vida',
    title: 'Vivir en Pompeya: un día cualquiera',
    kicker: 'CAPÍTULO 04',
    summary:
      'Termopolios, panaderías, tabernas, baños y casas con atrio: la vida cotidiana pompeyana asoma en cada muro, cada mostrador y cada graffito electoral pintado sobre la fachada.',
    readingMinutes: 10,
    cover: { src: 'termopolio-asellina', alt: 'Mostrador de un termopolio en Pompeya con vasijas embebidas', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'La casa romana acomodada, la **domus**, seguía un recorrido pensado casi como una puesta en escena. Desde la calle se entraba por un pasillo estrecho, las **fauces**, deliberadamente modesto para no exhibir la riqueza interior al primer vistazo. Ese pasillo desembocaba en el **atrio**, un espacio cubierto en parte, con una abertura central en el techo (*compluvium*) que dejaba caer la lluvia en una piscina poco profunda, el **impluvium**, que a la vez recogía el agua para la cisterna y refrescaba el ambiente. Al fondo del atrio, el **tablinum** hacía de despacho y sala de recepción del dueño de la casa; más allá, muchas domus pompeyanas de cierta categoría abrían un **peristilo**, patio ajardinado rodeado de columnas, alrededor del cual se distribuían el **triclinium** (comedor con tres lechos reclinables) y los **cubicula**, alcobas pequeñas y austeras para dormir.',
      },
      {
        type: 'img',
        src: 'casa-menandro',
        alt: 'Peristilo columnado de la Casa del Menandro en Pompeya',
        caption: 'El peristilo de la Casa del Menandro, jardín interior rodeado de columnas típico de las domus acomodadas.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'p',
        text:
          'No toda Pompeya vivía así, ni de lejos. La mayoría de la población habitaba en **insulae** de alquiler, edificios de varias plantas con tiendas (*tabernae*) en la planta baja y viviendas modestas arriba, muchas veces de una sola habitación con acceso por escalera exterior de madera. La taberna típica era un local abierto directamente a la calle, con un mostrador y, a menudo, una trastienda o entresuelo donde el propietario y su familia comían y dormían. Este tejido de pequeño comercio se distinguía por su especialización: entre los cerca de 80 **termopolios** identificados en la ciudad —mostradores de piedra con grandes vasijas (*dolia*) embutidas para mantener caliente comida y bebida— destaca el de **Asellina**, en la Vía de la Abundancia, con sus graffiti electorales pintados en la fachada por las camareras que allí trabajaban.',
      },
      {
        type: 'img',
        src: 'termopolio-regio-v',
        alt: 'Termopolio de la Regio V con pinturas de animales conservadas',
        caption: 'El termopolio de la Regio V, excavado en 2020, conserva pinturas de los productos a la venta y restos de comida carbonizados.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'fact', label: 'Termopolios identificados', value: '≈ 80 en toda la ciudad' },
      {
        type: 'fact', label: 'Panaderías identificadas', value: '≈ 35, muchas con molinos de piedra volcánica' },
      {
        type: 'fact', label: 'Archivo de Cecilio Jocundo', value: 'más de 150 tablillas de cera con recibos de subastas y préstamos' },
      {
        type: 'h3',
        text: 'Pan, garum y vino',
      },
      {
        type: 'p',
        text:
          'Cerca de 35 **panaderías** (*pistrina*) han sido identificadas en Pompeya, reconocibles por sus grandes muelas de piedra volcánica en forma de reloj de arena —los molinos de asno, movidos por animales o esclavos— y por sus hornos abovedados de ladrillo. En una de ellas se hallaron decenas de panes carbonizados por el calor de la erupción, algunos con la marca de un panadero estampada en la corteza, casi idéntica a una hogaza actual. El garum, salsa de pescado fermentado imprescindible en la cocina romana, tuvo en Pompeya a uno de sus productores más célebres: **Umbricio Escauro**, cuya casa exhibía mosaicos publicitarios con las ánforas de su marca y menciones explícitas a la calidad de su "flor de garum" (*flos*), el producto más refinado y caro de toda la gama.',
      },
      {
        type: 'img',
        src: 'panaderia-horno',
        alt: 'Horno de una panadería romana en Pompeya',
        caption: 'Horno de ladrillo de una de las panaderías pompeyanas, junto a los molinos de piedra volcánica para triturar el grano.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'illus', name: 'pan', caption: 'Pan carbonizado hallado en un horno pompeyano, con la marca del panadero aún visible en la corteza.',
      },
      {
        type: 'h3',
        text: 'Higiene, cuerpo y religión doméstica',
      },
      {
        type: 'p',
        text:
          'El baño era un ritual social diario, no solo higiénico: las **Termas Estabianas** y las **Termas del Foro** organizaban el recorrido en salas de temperatura creciente —*apodyterium* (vestuario), *tepidarium*, *caldarium* y *frigidarium* final para cerrar los poros—, con suelos elevados sobre pilares de ladrillo (*hypocaustum*) por los que circulaba aire caliente. Las **fullonicae**, como la de Estéfano, combinaban el lavado y tintado de ropa con el pisoteo de tejidos en cubetas de orina fermentada, cuyo amoníaco actuaba como detergente; un oficio maloliente pero económicamente esencial, gremio con peso político propio en la ciudad. En cuanto a la sexualidad, el **lupanar** —el único burdel de planta específica identificado en Pompeya, con celdas diminutas y frescos eróticos a modo de menú sobre cada puerta— conviene mirarlo sin el filtro moralizante moderno: para los romanos, las imágenes fálicas (el *fascinum*) que aparecen por toda la ciudad, en panaderías, cruces de calles o entradas de casas, no remitían al sexo sino a la buena suerte y a la protección contra el mal de ojo.',
      },
      {
        type: 'img',
        src: 'lupanar-fresco',
        alt: 'Fresco erótico sobre una celda del lupanar de Pompeya',
        caption: 'Frescos a modo de menú sobre las celdas del lupanar, el único burdel de planta específica identificado en la ciudad.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'p',
        text:
          'La religión doméstica tenía su altar en el **lararium**, un pequeño santuario pintado o en forma de hornacina presente en casi todas las casas, dedicado a los Lares (espíritus protectores del hogar) y al *Genius* del cabeza de familia; una serpiente pintada bajo la escena, símbolo de fertilidad y protección del suelo, es uno de los motivos más repetidos. Los esclavos y libertos formaban una parte enorme, aunque poco visible en el registro monumental, de la población pompeyana: algunos libertos enriquecidos, como los hermanos propietarios de la Casa de los Vettii, invirtieron su nueva fortuna en decorar sus viviendas con un lujo que rivalizaba con el de las familias de rancio abolengo, precisamente porque la riqueza, más que el linaje, abría las puertas del reconocimiento social bajo el Imperio.',
      },
      {
        type: 'illus', name: 'lararium', caption: 'Un lararium doméstico típico, con los Lares y el Genius del paterfamilias flanqueando una serpiente protectora.',
      },
      {
        type: 'h3',
        text: 'Mujeres con nombre propio',
      },
      {
        type: 'p',
        text:
          'Aunque la ciudadanía plena y los cargos públicos eran terreno masculino, algunas mujeres pompeyanas alcanzaron una visibilidad notable. **Eumachia**, sacerdotisa pública y mujer de gran fortuna, financió de su propio bolsillo el gran edificio del foro que lleva su nombre, sede del gremio de bataneros y tintoreros, dedicado a la Concordia Augusta y a la Piedad; su estatua, costeada por el propio gremio en agradecimiento, se conserva en el edificio. **Julia Félix**, por su parte, era propietaria de un extenso complejo con baños, tiendas y viviendas de alquiler que ella misma anunciaba mediante un cartel pintado ofreciendo el alquiler de "un balneario elegante, tabernas, entresuelos y pisos altos" tras los daños del terremoto del 62 d.C.: un anuncio inmobiliario romano, en toda regla, escrito casi dos mil años antes de que existiera ese concepto.',
      },
      {
        type: 'h3',
        text: 'Escritura en las paredes',
      },
      {
        type: 'p',
        text:
          'Pompeya es, entre otras cosas, el mayor archivo de escritura cotidiana romana que se conserva. Las fachadas estaban cubiertas de **programmata**, anuncios electorales pintados con fórmulas fijas del tipo "fulano, os lo pido, hacedlo edil" (*oro vos faciatis*), a menudo respaldados por colectivos de vecinos o gremios que declaraban públicamente su apoyo a un candidato. En la casa del banquero **Lucio Cecilio Jocundo** se halló un archivo de más de un centenar de tablillas de cera con recibos de subastas y préstamos, cada uno sellado por varios testigos: una contabilidad privada que permite reconstruir con un detalle asombroso el funcionamiento del crédito y el comercio en una ciudad romana media.',
      },
      {
        type: 'glossary',
        term: 'programma (pl. programmata)',
        def: 'Anuncio electoral pintado en las fachadas pompeyanas, con fórmulas estandarizadas pidiendo el voto para un candidato a magistratura municipal.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text:
          'Busca en los muros exteriores de las casas, sobre todo cerca de cruces y tabernas, restos de letras rojas o negras: son programmata y graffiti originales, no reconstrucciones, aunque muchos se han desvanecido con la exposición al aire libre.',
      },
    ],
  },

  {
    id: 'arte',
    title: 'Pintura, mosaico y los cuatro estilos',
    kicker: 'CAPÍTULO 05',
    summary:
      'Del imitado mármol al mundo fantástico pintado en las paredes: los cuatro estilos pompeyanos que definió August Mau siguen siendo la brújula para leer cualquier fresco romano.',
    readingMinutes: 9,
    cover: { src: 'casa-vettii-fresco', alt: 'Fresco de la Casa de los Vettii en Pompeya', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'A finales del siglo XIX, el arqueólogo alemán **August Mau** propuso, a partir de lo excavado en Pompeya y Herculano, una clasificación de la pintura mural romana en cuatro fases sucesivas que todavía hoy se enseña en cualquier curso de arte antiguo. No es una simple curiosidad académica: entender los cuatro estilos permite, casa por casa, leer aproximadamente cuándo se decoró cada estancia y, a veces, cuántas veces se redecoró a lo largo de los siglos.',
      },
      {
        type: 'h3',
        text: 'Los cuatro estilos de Mau',
      },
      {
        type: 'list',
        items: [
          'Primer estilo (de incrustación), siglo II a.C.: el estuco se moldea y pinta para imitar bloques de mármol de colores, sin figuras. Es el estilo más antiguo y el más "arquitectónico" en sentido literal.',
          'Segundo estilo (arquitectónico), siglo I a.C.: la pared se abre ilusoriamente mediante columnas, arquitrabes y perspectivas pintadas que simulan paisajes y edificios más allá del muro real. Es el estilo del friso de la Villa de los Misterios.',
          'Tercer estilo (ornamental), de época augustea a mediados del siglo I d.C.: se abandona la ilusión de profundidad a favor de paneles planos de color uniforme —a menudo el llamado rojo pompeyano— con escenas en miniatura y motivos egiptizantes en el centro.',
          'Cuarto estilo (fantástico), desde después del terremoto del 62 d.C.: mezcla y exagera los tres anteriores en composiciones recargadas, con arquitecturas imposibles, paneles mitológicos y una densidad decorativa casi barroca. Es el estilo dominante en la Casa de los Vettii.',
        ],
      },
      {
        type: 'img',
        src: 'villa-misterios-fresco',
        alt: 'Friso del Segundo Estilo en la Villa de los Misterios',
        caption: 'El friso de la Villa de los Misterios, ejemplo canónico del Segundo Estilo, con figuras a tamaño natural sobre fondo rojo.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'h3',
        text: 'El rojo pompeyano: un pigmento y un debate',
      },
      {
        type: 'p',
        text:
          'El llamado **rojo pompeyano** —ese fondo bermellón intenso que se asocia casi como marca de fábrica a la pintura de la ciudad— se obtenía tradicionalmente con **cinabrio**, un pigmento a base de sulfuro de mercurio, caro e importado, reservado a menudo a las estancias más representativas de la casa. Pero investigaciones recientes han añadido un matiz importante: análisis químicos en varias paredes muestran que parte de ese rojo pudo empezar siendo amarillo ocre, un pigmento mucho más barato, y haber virado al rojo por efecto del calor de los flujos piroclásticos de la erupción. El "rojo pompeyano" que fotografiamos hoy sería, en no pocos casos, una cicatriz química del propio desastre que sepultó la ciudad, no la elección original del pintor.',
      },
      {
        type: 'callout',
        tone: 'info',
        text:
          'Cuando veas un fondo rojo intenso en una domus, no des por hecho que fue "rojo pompeyano" desde el principio: en algunas estancias el calor de la erupción transformó el amarillo original, un efecto que los estudios químicos solo han empezado a documentar sistemáticamente en los últimos años.',
      },
      {
        type: 'p',
        text:
          'Técnicamente, la pintura pompeyana es en su mayoría **fresco** verdadero: los pigmentos se aplican sobre una capa de mortero de cal todavía húmeda (el *intonaco*), de modo que al secarse el color queda químicamente fijado en la superficie, resistente y luminoso. Antes de esa capa final, los muros recibían una o varias capas más gruesas de preparación (*arriccio*), y en las decoraciones más lujosas se pulía la superficie hasta darle un brillo casi marmóreo. Es un proceso que exige planificación y rapidez —el pintor solo dispone de las horas en que el mortero permanece fresco— y que explica por qué los talleres pompeyanos trabajaban con patrones y plantillas repetidos entre distintas casas.',
      },
      {
        type: 'fact', label: 'Autor de la clasificación', value: 'August Mau, 1873 (Die Geschichte der decorativen Wandmalerei in Pompeji)' },
      {
        type: 'fact', label: 'Pigmento del rojo pompeyano', value: 'cinabrio (sulfuro de mercurio); en parte, ocre alterado por el calor' },
      {
        type: 'fact', label: 'Mosaico de Alejandro', value: 'más de un millón de teselas, hallado en 1831 en la Casa del Fauno' },
      {
        type: 'glossary',
        term: 'megalografía',
        def: 'Composición pictórica con figuras humanas a tamaño natural o mayor, como el friso dionisíaco de la Villa de los Misterios; técnica reservada a encargos de gran prestigio.',
      },
      {
        type: 'h3',
        text: 'El mosaico de Alejandro y la escultura helenística',
      },
      {
        type: 'p',
        text:
          'La **Casa del Fauno**, la mayor domus privada de Pompeya, alberga la obra maestra del mosaico antiguo que ha llegado hasta nosotros: el **mosaico de Alejandro**, compuesto por más de un millón de diminutas teselas y probablemente copia de una pintura helenística del siglo IV o III a.C., representa el momento culminante de la batalla de Iso entre Alejandro Magno y Darío III de Persia. La composición, con su dramatismo casi cinematográfico y su dominio de la perspectiva y el escorzo, demuestra que la elite pompeyana, lejos de ser provinciana, aspiraba a poseer y exhibir en su propia casa referencias directas a la gran pintura griega de los siglos anteriores. La casa debe su nombre a otra pieza célebre hallada en ella, la estatuilla de bronce del **Fauno danzante**, hoy expuesta —como el mosaico original— en el Museo Arqueológico Nacional de Nápoles.',
      },
      {
        type: 'img',
        src: 'mosaico-alejandro',
        alt: 'Detalle del mosaico de Alejandro de la Casa del Fauno',
        caption: 'El mosaico de Alejandro, más de un millón de teselas, representando la batalla de Iso entre Alejandro y Darío III.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'img',
        src: 'casa-fauno',
        alt: 'Atrio de la Casa del Fauno con la estatuilla del fauno danzante',
        caption: 'El atrio de la Casa del Fauno, la mayor domus privada excavada en Pompeya, de fundación helenística.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'illus', name: 'mosaico', caption: 'Técnica del mosaico romano: teselas de piedra, vidrio y cerámica combinadas para lograr gradaciones de luz casi pictóricas.',
      },
      {
        type: 'h3',
        text: 'Jardines pintados y la Casa de los Vettii',
      },
      {
        type: 'p',
        text:
          'En patios pequeños sin espacio para un jardín real, los pompeyanos recurrían a la pintura para ensanchar visualmente el espacio: paredes enteras cubiertas de vegetación, fuentes, pájaros y estatuas imaginarias creaban la ilusión de un jardín infinito más allá de un muro que, en realidad, cerraba la propiedad a pocos metros. La **Casa de los Vettii**, propiedad de dos hermanos libertos enriquecidos por el comercio, reabierta al público tras una larga restauración, es hoy el mejor escaparate del Cuarto Estilo en su máxima exuberancia: salas enteras cubiertas de paneles mitológicos, marcos arquitectónicos imposibles y, en el vestíbulo de entrada, la célebre imagen de Príapo pesando su miembro en una balanza junto a un saco de monedas, menos una broma obscena que un símbolo de prosperidad y fertilidad destinado a dar la bienvenida —y buena suerte— a quien entraba en la casa.',
      },
      {
        type: 'img',
        src: 'casa-vettii-priapo',
        alt: 'Fresco de Príapo en la entrada de la Casa de los Vettii',
        caption: 'Príapo pesando su atributo frente a un saco de monedas, símbolo de prosperidad en el vestíbulo de la Casa de los Vettii.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'p',
        text:
          'En la **Casa del Poeta Trágico**, más modesta en tamaño pero igualmente elocuente, el famoso mosaico del **cave canem** ("cuidado con el perro") recibe al visitante en el propio umbral, mientras que en el interior varios paneles pictóricos recrean episodios de la guerra de Troya —entre ellos el sacrificio de Ifigenia—, con un gusto por la literatura épica y trágica que revela hasta qué punto la cultura griega seguía siendo, tres siglos después de la romanización de la ciudad, el lenguaje visual de prestigio por excelencia entre las familias pompeyanas con aspiraciones culturales.',
      },
      {
        type: 'illus', name: 'fresco', caption: 'Los tres estilos ilusionistas conviven a veces en una misma casa según la época de cada redecoración.',
      },
    ],
  },

  {
    id: 'erupcion',
    title: '79 d.C.: anatomía de una catástrofe',
    kicker: 'CAPÍTULO 06',
    summary:
      'Una montaña que nadie sabía que era un volcán, dos fases de destrucción distintas y un testigo de excepción, Plinio el Joven, que legó el primer relato científico de una erupción en la historia.',
    readingMinutes: 10,
    cover: { src: 'erupcion-pintura', alt: 'Representación pictórica de la erupción del Vesubio', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'En el año 79 d.C., nadie en la bahía de Nápoles consideraba el Vesubio un peligro. La montaña, cubierta hasta la cumbre de viñedos famosos por su vino, tenía un aspecto tan manso que el geógrafo **Estrabón**, un siglo antes, la había descrito como fértil salvo en su cima pedregosa, sin mencionar siquiera la posibilidad de una erupción. No existía memoria colectiva ni tradición local de que aquella montaña pudiera despertar: la última gran erupción, la llamada erupción de Avellino, había ocurrido unos 1.800 años antes, muy fuera del alcance de cualquier relato transmitido de generación en generación. El Vesubio del año 79 era, en la mente de sus habitantes, simplemente una montaña.',
      },
      {
        type: 'fact', label: 'Última gran erupción anterior', value: 'erupción de Avellino, hacia 1800 a.C.' },
      {
        type: 'glossary',
        term: 'erupción pliniana',
        def: 'Tipo de erupción explosiva que lanza una columna de gas, ceniza y piedra pómez a decenas de kilómetros de altura; el nombre honra a Plinio el Joven, primero en describirla con detalle.',
      },
      {
        type: 'h3',
        text: 'Fase pliniana: una columna de treinta kilómetros',
      },
      {
        type: 'p',
        text:
          'La erupción comenzó con una explosión que lanzó una columna de gases, ceniza y piedra pómez a más de 30 kilómetros de altura, en lo que hoy los vulcanólogos llaman, precisamente en honor a este episodio, una **erupción pliniana**. Empujada por el viento hacia el sureste, esa columna dejó caer sobre Pompeya, situada a unos 10 km del cráter, una lluvia continua de **lapilli** (fragmentos de piedra pómez del tamaño de una nuez) durante entre 12 y 18 horas. El peso acumulado de esa capa —que llegó a superar los dos metros de espesor— hizo colapsar techos y forjados en toda la ciudad; muchas víctimas de esta primera fase murieron aplastadas al refugiarse bajo cubiertas que no soportaron la carga, mientras que otras lograron huir a tiempo por las calles, ya cubiertas de piedra pómez hasta la altura de la cintura.',
      },
      {
        type: 'img',
        src: 'vesubio-panoramica',
        alt: 'El Vesubio visto desde las ruinas de Pompeya en la actualidad',
        caption: 'El perfil actual del Vesubio, con la caldera formada precisamente por el colapso de la erupción del 79 d.C.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'h3',
        text: 'Fase piroclástica: la muerte en minutos',
      },
      {
        type: 'p',
        text:
          'Hacia la madrugada, la columna eruptiva, ya inestable, comenzó a colapsar sobre sí misma en sucesivos episodios, generando **oleadas piroclásticas** (o *pyroclastic density currents*, PDC): avalanchas de gas, ceniza y roca fundida que descendieron por las laderas del volcán a más de 100 km/h y con temperaturas estimadas entre 300 y 500 °C. Fue esta segunda fase, no la lluvia de lapilli, la que sepultó definitivamente Pompeya y mató a quienes aún permanecían en la ciudad. Estudios forenses sobre los esqueletos y los huecos de los cuerpos, dirigidos entre otros por el antropólogo **Pier Paolo Petrone**, sugieren que la causa de muerte más probable fue el choque térmico instantáneo —la vaporización de fluidos corporales y la contracción muscular violenta que fija a muchas víctimas en posturas crispadas—, más que la asfixia lenta por inhalación de ceniza que durante mucho tiempo se dio por sentada; el debate sobre el peso relativo de ambos mecanismos, calor extremo frente a asfixia, sigue abierto en la literatura científica.',
      },
      {
        type: 'illus', name: 'ceniza', caption: 'Fases de la erupción: columna pliniana y caída de lapilli primero, colapso de la columna y oleadas piroclásticas después.',
      },
      {
        type: 'p',
        text:
          'Herculano, más cercana al volcán pero situada en dirección distinta al viento dominante, recibió mucha menos lluvia de piedra pómez y fue alcanzada de lleno, y casi de inmediato, por las oleadas piroclásticas: cientos de personas que se habían refugiado en los cobertizos junto a la antigua playa (*fornici*), quizá esperando un rescate por mar, murieron allí en cuestión de segundos. Pompeya, en cambio, tuvo esas horas previas de lluvia de lapilli que permitieron a una parte sustancial de la población escapar por tierra antes de que llegaran las oleadas mortales.',
      },
      {
        type: 'h3',
        text: 'Plinio el Viejo y Plinio el Joven',
      },
      {
        type: 'p',
        text:
          '**Plinio el Viejo**, almirante de la flota romana con base en Miseno, al otro lado del golfo, decidió cruzar hacia la costa afectada, oficialmente para socorrer a los habitantes y sin duda también movido por su curiosidad de naturalista. Murió en Estabia, probablemente por un fallo cardiorrespiratorio agravado por su obesidad y su asma, agotado por el esfuerzo y quizá por los gases tóxicos, según narra su sobrino. Ese sobrino, **Plinio el Joven**, quedó en Miseno con su madre y escribió años después, a petición del historiador Tácito, dos cartas —incluidas en su libro VI de la correspondencia— que constituyen el testimonio ocular más detallado que existe de una erupción volcánica en toda la Antigüedad, y probablemente el primer relato de la historia con pretensiones casi científicas de precisión.',
      },
      {
        type: 'quote',
        text:
          'Se alzaba una nube cuyo aspecto y forma ningún árbol podría representar mejor que un pino: pues, elevándose como sobre un tronco larguísimo, se abría luego en varias ramas, blanquecina unas veces, sucia y manchada otras, según hubiera arrastrado tierra o ceniza.',
        cite: 'Plinio el Joven, Cartas, VI.16 (a Tácito, sobre la muerte de su tío)',
      },
      {
        type: 'quote',
        text:
          'Ya caía ceniza sobre las naves, más caliente y más espesa cuanto más se acercaban... Se oían gritos de mujeres, gemidos de niños y voces de hombres; unos llamaban a sus padres, otros a sus hijos, otros a sus esposas, y solo se reconocían por la voz. Muchos imploraban la ayuda de los dioses, pero muchos más imaginaban que ya no quedaban dioses en ninguna parte y que aquella era la noche eterna y última del mundo.',
        cite: 'Plinio el Joven, Cartas, VI.20 (a Tácito, sobre su propia experiencia en Miseno)',
      },
      {
        type: 'img',
        src: 'plinio-grabado',
        alt: 'Grabado antiguo representando a Plinio el Viejo',
        caption: 'Plinio el Viejo, almirante y naturalista, murió en Estabia tratando de socorrer a la población y de observar el fenómeno de cerca.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'fact', label: 'Cuerpos hallados en Pompeya', value: '≈ 1.150 de un total estimado de ≈ 2.000 personas que no huyeron' },
      {
        type: 'fact', label: 'Altura de la columna eruptiva', value: '> 30 km' },
      {
        type: 'fact', label: 'Temperatura de las oleadas piroclásticas', value: '≈ 300-500 °C' },
      {
        type: 'h3',
        text: 'El debate de la fecha: ¿24 de agosto o finales de octubre?',
      },
      {
        type: 'p',
        text:
          'Durante siglos se dio por buena la fecha tradicional del **24 de agosto** del 79 d.C., tomada de los manuscritos medievales de las cartas de Plinio el Joven ("noveno día antes de las calendas de septiembre"). Pero la evidencia arqueológica acumulada en las últimas décadas apunta con fuerza creciente hacia una fecha posterior, probablemente en **octubre o incluso noviembre**. El hallazgo más citado es una inscripción a carboncillo descubierta en 2018 en una casa en obras de la Regio V, con la fecha "**XVI K Nov**" (decimosexto día antes de las calendas de noviembre, es decir, el 17 de octubre): un carboncillo tan frágil no habría podido sobrevivir semanas expuesto, lo que sugiere que fue escrito muy poco antes de la erupción. A esto se suman frutos de otoño carbonizados (granadas, nueces, frutos secos típicos de la vendimia y la cosecha tardía), toneles de vino ya sellados como tras la vendimia, ropas de abrigo sobre algunas víctimas y una moneda hallada en Pompeya que menciona la decimoquinta aclamación imperial de Tito, un título que no pudo acuñarse antes de septiembre de aquel año. Ningún dato es, por sí solo, concluyente —y algunos manuscritos antiguos de las cartas de Plinio ofrecen variantes de fecha distintas de la tradicional—, pero el consenso académico se ha desplazado con claridad hacia el otoño, sin que la cuestión se considere definitivamente cerrada.',
      },
      {
        type: 'callout',
        tone: 'info',
        text:
          'La fecha del 24 de agosto que verás grabada en muchos libros antiguos y placas conmemorativas es hoy la hipótesis menos favorecida por buena parte de los vulcanólogos y arqueólogos: la balanza se inclina hacia octubre.',
      },
    ],
  },

  {
    id: 'redescubrimiento',
    title: 'Redescubrir Pompeya: 1748-hoy',
    kicker: 'CAPÍTULO 07',
    summary:
      'De los túneles de saqueo borbónicos a los calcos de yeso de Fiorelli y el ADN de 2024: la historia de la excavación de Pompeya es, también, la historia de cómo aprendimos a excavar con cuidado.',
    readingMinutes: 10,
    cover: { src: 'calcos-yeso', alt: 'Calco de yeso de una víctima de la erupción del Vesubio', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'Pompeya estuvo perdida, literalmente bajo tierra, durante más de mil seiscientos años, y su reaparición fue tan accidental como su desaparición. En 1592, el arquitecto **Domenico Fontana**, excavando un canal para desviar aguas del Sarno, atravesó parte de las ruinas y encontró inscripciones y muros antiguos; no comprendió —o no le interesó comprender— qué había hallado, y las obras del canal continuaron sin más. Hubo que esperar casi siglo y medio para que alguien reconociera el valor de lo que había debajo de los campos de viñas napolitanos.',
      },
      {
        type: 'h3',
        text: 'Los Borbones: de Herculano a Pompeya',
      },
      {
        type: 'p',
        text:
          'En 1738, bajo el patrocinio de **Carlos de Borbón**, rey de Nápoles, comenzaron las excavaciones en Herculano, y diez años más tarde, en 1748, se iniciaron también en Pompeya, dirigidas inicialmente por el ingeniero militar español **Roque Joaquín de Alcubierre**. Aquellas primeras campañas fueron, con honestidad, más una cacería de tesoros para las colecciones reales que una investigación arqueológica: se excavaba mediante túneles y galerías subterráneas en busca de estatuas, mosaicos y objetos de valor destinados al gabinete real, y muchas veces se rellenaban de nuevo las zonas ya "vaciadas" de piezas interesantes, sin apenas documentación del contexto original. El anticuario alemán **Johann Joachim Winckelmann**, considerado uno de los padres de la historia del arte moderno, visitó las excavaciones y denunció por escrito la brutalidad y el desorden del método borbónico, reclamando un registro sistemático de lo hallado.',
      },
      {
        type: 'img',
        src: 'plano-historico',
        alt: 'Plano histórico decimonónico de las excavaciones de Pompeya',
        caption: 'Plano del siglo XIX de las excavaciones, cuando buena parte de la ciudad permanecía todavía bajo tierra.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'p',
        text:
          'La situación mejoró con la llegada del ingeniero suizo **Karl Jakob Weber**, que dirigió los trabajos entre 1750 y 1764 y fue el primero en levantar planos arqueológicos rigurosos de lo excavado, incluida la Villa de los Papiros en Herculano. Décadas después, ya en el periodo napoleónico, **Carolina Bonaparte**, hermana de Napoleón y reina de Nápoles junto a su marido Joaquín Murat, impulsó personalmente y con generosos recursos las excavaciones del área del foro, dando a Pompeya una proyección europea que atrajo a artistas, escritores y a los primeros turistas del Grand Tour.',
      },
      {
        type: 'h3',
        text: 'Fiorelli y la revolución del método',
      },
      {
        type: 'p',
        text:
          'El verdadero punto de inflexión llegó en 1860, tras la unificación de Italia, con el nombramiento de **Giuseppe Fiorelli** como director de las excavaciones. Fiorelli abandonó el sistema de túneles a favor de una excavación estratigráfica desde la superficie hacia abajo, capa por capa, documentando cada hallazgo en un diario de excavación (*Giornale degli Scavi*) que convirtió el yacimiento, por primera vez, en objeto de estudio científico y no solo de expolio artístico. A él se debe también el sistema de Regiones e insulae que sigue usándose hoy, y sobre todo una técnica que cambió para siempre la forma en que el público imagina la tragedia de Pompeya: al comprobar que los cuerpos de las víctimas habían dejado, al descomponerse bajo la ceniza compactada, huecos con su forma exacta, Fiorelli tuvo la idea de verter yeso líquido en esas cavidades antes de excavarlas del todo, obteniendo **calcos** que reproducen no solo la anatomía sino los pliegues de la ropa y las expresiones últimas de los cuerpos.',
      },
      {
        type: 'img',
        src: 'fiorelli-retrato',
        alt: 'Retrato de Giuseppe Fiorelli',
        caption: 'Giuseppe Fiorelli, director de las excavaciones desde 1860, creador del método de los calcos de yeso y del sistema de Regiones.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'img',
        src: 'jardin-fugitivos',
        alt: 'Calcos de yeso en el Jardín de los Fugitivos',
        caption: 'El Jardín de los Fugitivos, con un grupo de calcos de yeso obtenidos mediante la técnica ideada por Fiorelli en 1863.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'illus', name: 'yeso', caption: 'El método de Fiorelli: verter yeso líquido en la cavidad dejada por un cuerpo descompuesto bajo la ceniza compactada.',
      },
      {
        type: 'glossary',
        term: 'estratigrafía',
        def: 'Método de excavación que registra y respeta el orden de las capas de sedimento tal como se depositaron, permitiendo fechar y contextualizar cada hallazgo; opuesto a la excavación por túneles.',
      },
      {
        type: 'p',
        text:
          'Poco después, en 1882, el arqueólogo alemán **August Mau** sistematizó la pintura mural pompeyana en los cuatro estilos que siguen siendo la referencia estándar. Ya en el siglo XX, **Amedeo Maiuri** dirigió las excavaciones entre 1924 y 1961 (con la interrupción de la Segunda Guerra Mundial), ampliando de forma espectacular el área visible de la ciudad —suya es buena parte de la Vía de la Abundancia tal como se ve hoy— e introduciendo la técnica de reconstruir en hormigón armado, con acabado deliberadamente distinguible del original, elementos de madera desaparecidos (puertas, vigas, balcones) para hacer más legible la volumetría antigua sin falsificar lo auténtico.',
      },
      {
        type: 'h3',
        text: 'Guerra, terremotos y colapsos',
      },
      {
        type: 'p',
        text:
          'El siglo XX no fue benévolo con el yacimiento. En 1943, durante la Segunda Guerra Mundial, bombardeos aliados dirigidos contra posiciones alemanas cercanas alcanzaron por error varias zonas de las ruinas, dañando el Anticuario y algunas casas. El terremoto de Irpinia, en 1980, volvió a sacudir estructuras ya debilitadas por décadas de exposición. La crisis de conservación llegó a su punto más bajo el 6 de noviembre de 2010, cuando la llamada **Schola Armaturarum** (Casa de los Gladiadores), debilitada por años de filtraciones de agua y falta de mantenimiento, se derrumbó por completo, generando un escándalo internacional sobre el abandono del yacimiento por parte de las autoridades italianas.',
      },
      {
        type: 'p',
        text:
          'Aquel colapso precipitó el lanzamiento del **Gran Proyecto Pompeya** (Grande Progetto Pompei), un programa de conservación financiado en gran parte con fondos europeos desde 2012, centrado en consolidar estructuras en riesgo y mejorar el drenaje de aguas pluviales, la causa técnica más repetida de los derrumbes. En paralelo, entre 2018 y 2020 se abrió un nuevo frente de excavación en la **Regio V**, motivado precisamente por necesidades de conservación (estabilizar los frentes de tierra expuestos), que deparó hallazgos de gran repercusión mediática: la inscripción a carboncillo que reabrió el debate sobre la fecha de la erupción, y en 2020 un termopolio extraordinariamente bien conservado, con las pinturas de los productos a la venta —incluido un pato— todavía visibles sobre el mostrador.',
      },
      {
        type: 'fact', label: 'Inicio de las excavaciones en Pompeya', value: '1748' },
      {
        type: 'fact', label: 'Sistema de Regiones e insulae', value: 'Giuseppe Fiorelli, desde 1860' },
      {
        type: 'fact', label: 'Declaración UNESCO', value: '1997 (junto con Herculano y Torre Annunziata)' },
      {
        type: 'h3',
        text: 'El ADN de 2024: desmontar identidades supuestas',
      },
      {
        type: 'p',
        text:
          'El episodio más reciente y quizá más revelador sobre los límites del conocimiento arqueológico llegó en 2024, con un estudio de ADN antiguo publicado en la revista *Current Biology*. Durante décadas, ciertos calcos icónicos se habían interpretado a partir de la postura de los cuerpos y de supuestos culturales modernos: un grupo abrazado en la Casa del Brazalete de Oro se identificaba popularmente como una madre y su hijo, y dos figuras entrelazadas en la Villa de Diomedes se describían como dos hermanas o amigas. El análisis genético demostró que la primera pareja estaba formada por un hombre adulto sin relación de parentesco con el niño, y que al menos una de las dos figuras de la Villa de Diomedes era, biológicamente, un hombre. El estudio no solo corrigió datos concretos: puso en cuestión, de forma incómoda pero necesaria, cuánto de lo que "sabíamos" sobre las víctimas de Pompeya era en realidad una proyección de valores familiares y de género del siglo XIX y XX sobre unos cuerpos que nunca pudieron contar su propia historia.',
      },
      {
        type: 'callout',
        tone: 'warn',
        text:
          'Muchas cartelas y guías antiguas siguen describiendo algunos calcos con identidades ("madre e hijo", "las dos hermanas") que el ADN de 2024 ha desmentido: conviene tomar esas etiquetas tradicionales con cautela.',
      },
      {
        type: 'glossary',
        term: 'aDNA',
        def: 'Sigla en inglés de "ADN antiguo" (ancient DNA), el material genético degradado recuperable de restos arqueológicos, cuyo análisis ha permitido revisar identidades atribuidas tradicionalmente a varios calcos de Pompeya.',
      },
      {
        type: 'p',
        text:
          'Hoy Pompeya, Herculano y Torre Annunziata forman un único Patrimonio de la Humanidad reconocido por la UNESCO desde 1997, y el yacimiento sigue siendo, pese a más de dos siglos y medio de excavaciones, un lugar donde apenas se ha explorado en profundidad una parte del área total intramuros. Los problemas de conservación no han desaparecido —miles de metros cuadrados de estructuras quedan expuestos a la lluvia, el sol y el turismo masivo—, y cada nueva campaña de excavación es también, inevitablemente, una nueva superficie que mantener durante los siglos siguientes.',
      },
    ],
  },

  {
    id: 'mirar',
    title: 'Cómo mirar Pompeya',
    kicker: 'CAPÍTULO 08',
    summary:
      'Una guía práctica de lectura visual para el día de la visita: reconocer una taberna, distinguir las técnicas de construcción por época, leer un graffito y saber qué no hacer entre las ruinas.',
    readingMinutes: 9,
    cover: { src: 'via-stabiana-adoquines', alt: 'Calle empedrada de Pompeya con surcos de carros', credit: 'Wikimedia Commons' },
    blocks: [
      {
        type: 'p',
        text:
          'Pompeya recompensa mucho más a quien sabe qué buscar que a quien simplemente camina entre ruinas genéricas. Muchos detalles que parecen insignificantes a primera vista —un agujero cuadrado en un muro, una piedra desgastada en la calzada, una mancha de yeso más clara que el resto de la pared— son en realidad pistas legibles sobre cómo se construyó, se usó y se reconstruyó cada rincón de la ciudad. Este capítulo es, ante todo, una guía de lectura para el terreno.',
      },
      {
        type: 'h3',
        text: 'Reconocer los edificios por su planta',
      },
      {
        type: 'p',
        text:
          'Una **taberna** se identifica por su fachada abierta casi por completo a la calle, sin puerta propiamente dicha sino con un umbral ancho que en su día se cerraba con postigos de madera encajados en ranuras aún visibles en el suelo; dentro, un único espacio, a veces con una escalera o entresuelo de madera —hoy desaparecido— para el almacén o la vivienda del tabernero. Un **termopolio** se reconoce por su mostrador en forma de L o de línea recta, construido en mampostería y revestido de mármol o estuco pintado, con varias bocas circulares (los *dolia*) empotradas en la superficie para contener alimentos y bebida. Una **domus** rica, en cambio, suele mostrar a la calle una fachada deliberadamente discreta —una simple puerta estrecha entre dos tabernas de alquiler que pertenecen al mismo propietario— que no anticipa en absoluto la riqueza del atrio y el peristilo que se despliegan al cruzar el umbral: el contraste entre exterior humilde e interior suntuoso no es casualidad, sino una convención social romana sobre cómo mostrar (y no mostrar) la riqueza.',
      },
      {
        type: 'img',
        src: 'cave-canem',
        alt: 'Mosaico de cave canem en el umbral de una casa pompeyana',
        caption: 'El mosaico de "cave canem" (cuidado con el perro) en el umbral de la Casa del Poeta Trágico, señal de una domus de cierto nivel.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'h3',
        text: 'Lo que cuenta la calle',
      },
      {
        type: 'list',
        items: [
          'Surcos de carro: canales paralelos tallados en las losas de lava por el roce constante de las ruedas; su profundidad y disposición indican los itinerarios más transitados.',
          'Piedras de paso: bloques elevados en los cruces para cruzar sin pisar el agua o los residuos que corrían por el centro de la calzada, dejando huecos calculados para las ruedas de los carros.',
          'Frenos y quicios de puerta: agujeros circulares o semicirculares en los umbrales de piedra donde giraban los goznes de madera de las puertas, hoy desaparecidas.',
          'Agujeros de vigas: huecos cuadrados alineados en los muros de ladrillo, a media altura, que marcan dónde encajaban las vigas de un piso superior de madera, destruido por el fuego o el colapso.',
          'Tuberías de plomo: fragmentos de conducciones (*fistulae*) visibles junto a algunas fachadas o fuentes, a veces con el nombre del fabricante o del propietario estampado en relieve.',
        ],
      },
      {
        type: 'img',
        src: 'via-abbondanza',
        alt: 'Surcos de carro en el pavimento de la Vía de la Abundancia',
        caption: 'Surcos profundos tallados por generaciones de ruedas de carro en la calzada de lava de la Vía de la Abundancia.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'h3',
        text: 'Leer las técnicas de construcción',
      },
      {
        type: 'p',
        text:
          'Las columnas que parecen de mármol sólido son, en la mayoría de los casos, tambores de piedra local o ladrillo apilados y recubiertos de una capa de estuco moldeado en forma de estrías, después pintado: un truco visual barato y eficaz, muy alejado de la piedra maciza que imitaba. Ese mismo criterio de "capas superpuestas" se aplica a los muros, cuya técnica constructiva permite fecharlos a simple vista: el **opus quadratum** (grandes sillares escuadrados, sin apenas mortero) es el más antiguo, de origen samnita; el **opus incertum** (piedras irregulares embutidas en argamasa, sin patrón visible) domina el siglo II y buena parte del I a.C.; el **opus reticulatum** (pequeños bloques piramidales de toba dispuestos en un patrón de rombos muy regular) se popularizó a finales de la República y comienzos del Imperio; y el **opus latericium** (ladrillo cocido, a menudo con sellos de fábrica estampados) es propio de las construcciones y reformas más tardías, incluidas muchas de las que estaban en obras cuando llegó la erupción.',
      },
      {
        type: 'illus', name: 'columna', caption: 'De opus quadratum a opus latericium: cuatro técnicas constructivas, cuatro épocas distintas de la historia de la ciudad.',
      },
      {
        type: 'glossary',
        term: 'opus reticulatum',
        def: 'Técnica constructiva romana con pequeños bloques piramidales de toba dispuestos en superficie según un patrón de rombos muy regular; típica de finales de la República y comienzos del Imperio.',
      },
      {
        type: 'p',
        text:
          'También conviene aprender a distinguir lo restaurado de lo antiguo. Amedeo Maiuri, en el siglo XX, popularizó el uso de hormigón armado para reconstruir elementos de madera desaparecidos —puertas, dinteles, balcones, incluso tramos de piso superior— con un criterio de honestidad museográfica: el hormigón se deja sin decorar o con un acabado deliberadamente distinto de los materiales antiguos, precisamente para que el visitante atento pueda diferenciar sin ambigüedad la reconstrucción moderna del tejido original. Los tonos de estuco muy uniformes y sin desconchones, o los ladrillos con un color y una textura demasiado regulares, suelen señalar también intervenciones de consolidación relativamente recientes, parte necesaria de la lucha permanente contra la erosión y el abandono.',
      },
      {
        type: 'img',
        src: 'fullonica-stephanus',
        alt: 'Restos de la fullonica de Estéfano en Pompeya',
        caption: 'La fullonica de Estéfano, con sus cubetas escalonadas para el lavado y tintado de tejidos.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'fact', label: 'Técnica más antigua', value: 'opus quadratum (muralla samnita)' },
      {
        type: 'fact', label: 'Técnica más tardía', value: 'opus latericium, con sellos de fábrica en los ladrillos' },
      {
        type: 'fact', label: 'Fórmula electoral habitual', value: '"o.v.f." — oro vos faciatis, "os pido que lo hagáis [magistrado]"' },
      {
        type: 'h3',
        text: 'Cómo leer un graffito',
      },
      {
        type: 'p',
        text:
          'Los anuncios electorales pintados sobre las fachadas siguen casi siempre una fórmula reconocible: el nombre del candidato en genitivo o acusativo, el cargo al que aspira (*aedilem*, *duumvirum*) y una abreviatura como "**o.v.f.**" (*oro vos faciatis*, "os pido que lo hagáis [magistrado]"), a veces firmada por un colectivo concreto —"los pescadores lo piden", "los muleros lo piden"— que declaraba así su respaldo público a cambio, se supone, de futuros favores políticos. Los graffiti no electorales, más informales y a menudo grabados con un punzón en vez de pintados, incluyen desde citas de Virgilio hasta insultos personales, apuestas de gladiadores o simples declaraciones de amor firmadas con nombre y fecha: es la voz más directa, sin intermediarios literarios, que nos ha dejado la población corriente de la ciudad.',
      },
      {
        type: 'img',
        src: 'graffiti',
        alt: 'Graffiti antiguo pintado sobre un muro de Pompeya',
        caption: 'Graffiti electoral pintado sobre una fachada, con la fórmula abreviada característica de los programmata pompeyanos.',
        credit: 'Wikimedia Commons',
      },
      {
        type: 'glossary',
        term: 'fauces',
        def: 'Pasillo estrecho de entrada de una domus romana, entre la puerta de calle y el atrio, deliberadamente sobrio para no anticipar la riqueza del interior.',
      },
      {
        type: 'h3',
        text: 'Qué no hacer',
      },
      {
        type: 'list',
        items: [
          'No toques los frescos ni las superficies pintadas: la grasa de las manos acelera el deterioro de pigmentos que ya llevan dos mil años expuestos.',
          'No te subas a muros, columnas o estructuras, aunque parezcan lo bastante bajas o estables: buena parte del yacimiento sigue en proceso de consolidación.',
          'No te lleves fragmentos de pómez, tesera de mosaico ni ningún objeto "de recuerdo": además de ilegal, decenas de turistas devuelven cada año paquetes de piedras alegando mala suerte, el llamado "efecto maldición de Pompeya".',
          'Respeta las zonas acordonadas o cerradas por restauración: suelen corresponder a estructuras frágiles tras derrumbes recientes, no a un capricho de gestión.',
          'Evita el flash en los interiores con pintura mural: aunque el daño de un solo destello es mínimo, la suma de miles de visitantes diarios sí tiene un efecto acumulativo real.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text:
          'Pompeya es un yacimiento activo y frágil, no un decorado: cada estructura que ves lleva casi dos mil años a la intemperie y varias décadas más de exposición al turismo masivo. Mirar con cuidado también es una forma de conservar.',
      },
    ],
  },
];
