import type { Section, ChecklistItem, Faq } from './types';

export const PRACTICAL_SECTIONS: Section[] = [
  {
    id: 'entradas',
    title: 'Entradas y horarios',
    kicker: 'GUÍA PRÁCTICA',
    summary: 'Precios oficiales, horario según la estación y cómo comprar la entrada sin colas ni sorpresas.',
    readingMinutes: 6,
    cover: { illus: 'columna' },
    blocks: [
      { type: 'p', text: 'Los precios y los horarios del Parco Archeologico di Pompei se actualizan de vez en cuando, así que trátalos como una fotografía reciente (verificada en pompeiisites.org) y no como una verdad grabada en piedra: confirma siempre las cifras exactas antes de viajar, sobre todo si reservas con meses de antelación.' },
      { type: 'h3', text: 'Cuánto cuesta' },
      { type: 'fact', label: 'Pompei Express (solo la ciudad antigua)', value: '20 €' },
      { type: 'fact', label: 'Entrada reducida (18-25 años, ciudadanía UE)', value: '2 €' },
      { type: 'fact', label: 'Menores de 18 años', value: 'Gratis' },
      { type: 'fact', label: 'Primer domingo de cada mes', value: 'Gratis para todo el mundo' },
      { type: 'p', text: 'Además de la entrada básica existen combinados más ambiciosos. El "Pompei Plus" añade a la ciudad las villas suburbanas -la Villa de los Misterios, la Villa Regina y el Antiquarium de Boscoreale- por unos 25 €. Si dispones de varios días, el billete "Circuito de 3 días" (unos 30 €) suma también Oplontis y el Museo de Estabia, y permite repartir la visita en varias jornadas sin comprar entradas sueltas. Existe igualmente la Campania Artecard, una tarjeta turística regional que combina transporte y museos y puede compensar si vas a visitar varios yacimientos y el MANN de Nápoles en el mismo viaje: haz números antes de comprarla, porque no siempre sale a cuenta.' },
      { type: 'list', items: [
        'Pompei Express: solo la ciudad antigua de Pompeya.',
        'Pompei Plus: ciudad antigua + Villa de los Misterios + Villa Regina + Antiquarium de Boscoreale.',
        'Circuito 3 días: Pompeya + Oplontis + Estabia + Boscoreale, válido para varias visitas en tres jornadas.',
        'Campania Artecard: transporte público + museos de la región, útil en viajes más largos.'
      ] },
      { type: 'h3', text: 'Horario según la estación' },
      { type: 'list', items: [
        'Del 16 de marzo al 14 de octubre: 9:00-19:00 (última entrada a las 17:30).',
        'Del 15 de octubre al 14 de marzo: 9:00-17:00 (última entrada a las 15:30).'
      ] },
      { type: 'callout', tone: 'warn', text: 'Cierra todo el año el 1 de enero, el 1 de mayo y el 25 de diciembre. Puede haber cierres parciales extraordinarios (huelgas, obras, aforo); comprueba siempre pompeiisites.org la semana antes de ir.' },
      { type: 'h3', text: 'Cómo comprar la entrada' },
      { type: 'p', text: 'Desde marzo de 2026 la venta oficial online se gestiona a través de Vivaticket (antes lo hacía TicketOne), enlazada desde la propia web pompeiisites.org: desconfía de webs de terceros con nombres parecidos y precios de reventa. En temporada alta (Semana Santa, verano, puentes) conviene comprar con antelación y elegir franja horaria, porque el parque limita el aforo a unas 20.000 personas al día y, desde 2024, las entradas son nominales: hay que llevar el documento de identidad con el que se compró la entrada, en papel o en el móvil.' },
      { type: 'callout', tone: 'tip', text: 'Compra online y con día y hora fijados si vas en temporada alta: en Porta Marina la cola para sacar entrada en taquilla puede superar la hora en agosto.' },
      { type: 'p', text: 'Las tres puertas con taquilla y control son Porta Marina, Piazza Anfiteatro y Piazza Esedra; con la entrada ya comprada puedes entrar por cualquiera de ellas. El parque ofrece audioguías de alquiler en varios idiomas y una app oficial con mapa y contenidos; muchas domus rotan su apertura por conservación, así que el listado de "casas abiertas hoy" que hay en los paneles de cada entrada es más fiable que cualquier guía impresa. Para visitantes con movilidad reducida existe el itinerario "Pompei per tutti" ("Pompeya para todos"), accesible principalmente desde Piazza Anfiteatro.' },
      { type: 'img', src: 'porta-marina', alt: 'Puerta de Porta Marina, entrada principal al yacimiento de Pompeya', caption: 'Porta Marina, la entrada más usada por quienes llegan en Circumvesuviana.' },
      { type: 'callout', tone: 'info', text: 'Los precios de este capítulo son orientativos y pueden variar: la cifra que manda siempre es la de pompeiisites.org el día de tu compra.' }
    ]
  },
  {
    id: 'llegar',
    title: 'Cómo llegar',
    kicker: 'GUÍA PRÁCTICA',
    summary: 'Trenes, autobuses, coche y las tres puertas de entrada: la logística antes de pisar el yacimiento.',
    readingMinutes: 6,
    cover: { illus: 'calle' },
    blocks: [
      { type: 'p', text: 'Casi todo el mundo llega a Pompeya en tren desde Nápoles, y con razón: es barato, frecuente y te deja a los pies de la entrada principal. Pero hay alternativas según de dónde vengas y cuánto equipaje lleves.' },
      { type: 'h3', text: 'La Circumvesuviana, la opción más habitual' },
      { type: 'p', text: 'La línea Napoli-Sorrento de la Circumvesuviana sale de las estaciones de Napoli Porta Nolana y Napoli Garibaldi (bajo la Stazione Centrale) y para en "Pompei Scavi – Villa dei Misteri", justo al lado de Porta Marina. El trayecto dura entre 35 y 40 minutos y cuesta alrededor de 3 €. Los trenes son sencillos, se llenan mucho en hora punta y en temporada turística, y tienen cierta fama -algo exagerada, pero no infundada- de carteristas: lleva la mochila delante y los objetos de valor a la vista.' },
      { type: 'fact', label: 'Napoli Porta Nolana → Pompei Scavi', value: '35-40 min, ~3 €' },
      { type: 'p', text: 'Si prefieres más comodidad y menos paradas, el Campania Express es la versión turística de la misma línea: mismo trayecto, asientos reservados, menos paradas y aire acondicionado garantizado, por un billete algo más caro.' },
      { type: 'h3', text: 'En tren de largo recorrido: Trenitalia' },
      { type: 'p', text: 'Otra opción es bajarte en la estación "Pompei" de Trenitalia (líneas regionales Napoli-Salerno), a 10-15 minutos a pie de Piazza Anfiteatro, una de las otras dos puertas del parque. Es útil si vienes de Salerno, de la Costa Amalfitana por carretera, o si simplemente prefieres evitar la Circumvesuviana.' },
      { type: 'h3', text: 'En coche' },
      { type: 'p', text: 'Se puede llegar en coche, pero no hay aparcamiento propio del yacimiento: solo aparcamientos privados de pago cerca de las tres entradas, con calidad y precio muy variables. El tráfico en la Pompei moderna, sobre todo alrededor de Piazza Esedra, puede ser denso en temporada alta.' },
      { type: 'h3', text: 'En autobús' },
      { type: 'p', text: 'Los autobuses regionales SITA conectan Pompeya con localidades cercanas de la costa y del interior; son una alternativa si te alojas fuera del eje ferroviario. Desde Sorrento, la Circumvesuviana suele ser más rápida y previsible que el autobús por la carretera de la costa.' },
      { type: 'h3', text: 'Desde Roma' },
      { type: 'p', text: 'Si sales de Roma, la combinación más rápida es un tren de alta velocidad (Frecciarossa o Italo) hasta Napoli Centrale, en poco más de una hora, y desde allí bajar al nivel inferior de la estación para coger la Circumvesuviana hacia Sorrento hasta "Pompei Scavi". Todo el trayecto, con margen para cambios, ronda las dos horas y media.' },
      { type: 'h3', text: 'Las tres puertas del parque' },
      { type: 'list', items: [
        'Porta Marina: entrada principal, junto a la estación Pompei Scavi – Villa dei Misteri; se accede por una rampa en cuesta que era el antiguo acceso desde el puerto.',
        'Piazza Anfiteatro: cerca de la estación Trenitalia "Pompei" y del anfiteatro; punto de partida del itinerario accesible "Pompei per tutti".',
        'Piazza Esedra: entrada más moderna, junto a grandes aparcamientos, con menos afluencia que Porta Marina.'
      ] },
      { type: 'callout', tone: 'warn', text: 'La consigna es obligatoria para mochilas o bolsas de más de 30x30x15 cm; llévate solo lo imprescindible en un bolso o mochila pequeña para no perder tiempo al entrar.' },
      { type: 'img', src: 'via-stabiana-adoquines', alt: 'Calle empedrada con roderas de carros en Pompeya', caption: 'Los adoquines de basalto de la Via Stabiana, pulidos por dos mil años de tráfico romano y de turistas.' },
      { type: 'callout', tone: 'tip', text: 'Compra el billete de la Circumvesuviana en la máquina o en el quiosco antes de subir; los revisores multan si viajas sin validar, y las colas de vuelta por la tarde pueden ser largas.' }
    ]
  },
  {
    id: 'dia',
    title: 'Planificar el día',
    kicker: 'GUÍA PRÁCTICA',
    summary: 'Cuándo ir para evitar calor y multitudes, dónde beber agua y comer, y cómo combinar Pompeya con el Vesubio o Herculano.',
    readingMinutes: 7,
    cover: { illus: 'vesuvio' },
    blocks: [
      { type: 'p', text: 'Pompeya no es un museo con aire acondicionado: es una ciudad entera al aire libre, sin apenas sombra, con calles de piedra irregular. Cómo organices el día cambia por completo la experiencia.' },
      { type: 'h3', text: 'Cuándo entrar' },
      { type: 'p', text: 'La luz y el calor mandan. Entrar a la apertura, sobre todo en verano, te da dos o tres horas de temperatura razonable y menos gente antes de que lleguen los grandes grupos organizados a media mañana. La otra ventana buena es después de las 15:00: la mayoría de excursiones de un día ya se han ido y el sol empieza a bajar. El tramo central del día -de 12:00 a 15:00 en julio y agosto- puede ser realmente duro, con la piedra devolviendo el calor del sol.' },
      { type: 'fact', label: 'Sombra disponible', value: 'Escasa: sobre todo bajo pórticos y en algunas casas' },
      { type: 'h3', text: 'Agua y baños' },
      { type: 'p', text: 'El parque conserva varias fuentes de agua potable repartidas por las calles principales -reconocibles por su forma de pila cuadrada de piedra-, pensadas originalmente para el abastecimiento romano y hoy reconvertidas para los visitantes: rellena la botella siempre que puedas. Hay baños públicos junto a Porta Marina, cerca del Templo de Júpiter en el Foro, junto al anfiteatro y en Piazza Esedra; no son abundantes, así que conviene no dejarlo para el último momento.' },
      { type: 'img', src: 'calle-fuente', alt: 'Fuente de piedra en una calle de Pompeya', caption: 'Una de las fuentes públicas del yacimiento, todavía útiles para rellenar la botella de agua.' },
      { type: 'h3', text: 'Comer dentro del recinto' },
      { type: 'p', text: 'La única cafetería del recinto está junto a las Termas del Foro; la oferta es correcta pero limitada y con los precios propios de un lugar cautivo. Como norma general no se puede salir y volver a entrar con la misma entrada, así que si prefieres comer fuera, resérvalo para el final de la visita o comprueba en taquilla el día de tu visita si existe alguna excepción vigente.' },
      { type: 'callout', tone: 'info', text: 'Comprueba siempre en pompeiisites.org o en la propia taquilla si la política de "una sola entrada, una sola salida" tiene alguna excepción el día de tu visita: ha habido cambios puntuales en el pasado.' },
      { type: 'h3', text: 'Cómo esquivar a la multitud' },
      { type: 'p', text: 'La mayoría de los grupos guiados siguen un recorrido muy similar: entran por Porta Marina, van directos al Foro, luego a la Casa dei Vettii y de ahí al Lupanar, todo ello por la mañana. Si inviertes el orden -empezando por el Anfiteatro y el Teatro Grande, o dejando la Casa dei Vettii y el Lupanar para última hora de la tarde- puedes visitar los puntos más populares casi en soledad.' },
      { type: 'list', items: [
        'Muchas domus con frescos delicados rotan su apertura por conservación: el panel de "casas abiertas hoy" de cada entrada manda sobre cualquier guía impresa.',
        'Los baños y el termopolio de Regio V suelen tener control de aforo y colas puntuales.',
        'El Lupanar, por su fama, casi siempre tiene cola, sea la hora que sea.'
      ] },
      { type: 'h3', text: 'Combinar con el Vesubio, Herculano o el MANN' },
      { type: 'p', text: 'Si tienes un segundo día, el Vesubio se visita en bus (líneas EAV o Busvia del Vesuvio) desde la zona de Pompeya o Ercolano, con entrada al cráter que también conviene reservar con antelación. Herculano, más pequeño y mejor conservado en algunos aspectos -sobre todo en madera y materia orgánica carbonizada-, se ve bien en una media jornada y está a un breve trayecto de Circumvesuviana. Y una parte importante de lo que se encontró en Pompeya no está en Pompeya, sino en el Museo Arqueológico Nacional de Nápoles (MANN): el mosaico de Alejandro, los grandes bronces de la Villa de los Papiros y el Gabinete Secreto con el arte erótico romano.' },
      { type: 'illus', name: 'brujula', caption: 'Piensa el recorrido antes de entrar: la mayoría de las multitudes siguen el mismo camino.' }
    ]
  },
  {
    id: 'respeto',
    title: 'Normas y respeto',
    kicker: 'GUÍA PRÁCTICA',
    summary: 'Lo que no se puede hacer en un yacimiento arqueológico vivo, y por qué importa.',
    readingMinutes: 5,
    cover: { illus: 'yeso' },
    blocks: [
      { type: 'p', text: 'Pompeya se excavó hace más de dos siglos y medio, y todavía hoy se sigue estudiando, restaurando y, por desgracia, a veces dañando. Las normas del parque no son burocracia sin sentido: cada una responde a un problema real.' },
      { type: 'p', text: 'A diferencia de un museo, aquí casi todo está a la intemperie: la lluvia, el sol, las raíces de las plantas y el paso de millones de pies cada año desgastan estructuras que llevan casi dos mil años en pie sin el mantenimiento continuo de un edificio habitado. Cada visitante que toca un fresco, se apoya en un muro o pisa fuera del camino marcado suma un poquito de erosión a un patrimonio que no se puede reponer ni fabricar de nuevo: por eso el equipo de conservación cierra casas por turnos y por eso las barreras de cuerda, aunque parezcan discretas, delimitan zonas realmente frágiles.' },
      { type: 'h3', text: 'Lo que no se puede hacer' },
      { type: 'list', items: [
        'Tocar frescos, estucos o mosaicos: la grasa y el sudor de las manos aceleran su deterioro; hay pinturas que se han perdido en parte por siglos de manoseo.',
        'Subirse a muros, columnas o estructuras, por resistentes que parezcan: muchas llevan dos milenios en pie gracias a un equilibrio frágil.',
        'Volar drones sin autorización expresa del parque: está prohibido para el público general por seguridad y por protección del patrimonio.',
        'Comer o beber dentro de las casas y edificios: solo está permitido en las zonas habilitadas para ello.',
        'Llevarse piedras, teselas o fragmentos como recuerdo, por pequeños que parezcan.'
      ] },
      { type: 'h3', text: 'Las "cartas de arrepentimiento"' },
      { type: 'p', text: 'El parque recibe cada año paquetes de visitantes que, con el tiempo, devuelven por correo una piedra o un fragmento de teja que se llevaron en su día, a menudo acompañados de una carta explicando el remordimiento -o la mala suerte que atribuyen al objeto desde entonces-. Es tal el fenómeno que existe una pequeña colección de estas "cartas de arrepentimiento" que el propio parque ha hecho pública: un recordatorio curioso, y algo triste, de que cada piedra fuera de su sitio es información arqueológica perdida para siempre.' },
      { type: 'callout', tone: 'warn', text: 'Sacar cualquier objeto del recinto, por pequeño que sea, es delito en Italia (patrimonio arqueológico del Estado), no solo una falta de educación.' },
      { type: 'h3', text: 'Fotografía, animales y comportamiento' },
      { type: 'p', text: 'Se puede fotografiar y grabar vídeo libremente para uso personal, sin flash en los espacios con pinturas y sin trípode en las zonas más concurridas, donde entorpece el paso. Los perros pueden entrar sujetos con correa corta. En los últimos años se han sucedido varios episodios de vandalismo con eco internacional -turistas grabando sus iniciales en un fresco, subiéndose a una estructura para hacerse una foto, o incluso llevándose teselas de un mosaico-, y las multas han sido severas, con casos que han acabado en los tribunales italianos y en condenas de varios miles de euros.' },
      { type: 'fact', label: 'Multa por dañar el patrimonio (casos recientes)', value: 'Hasta varios miles de euros y proceso penal' },
      { type: 'p', text: 'Nada de esto va dirigido a asustar a nadie: la inmensa mayoría de quienes visitan Pompeya se comportan con el respeto que merece un lugar así. Pero conviene tener claro, antes de entrar, que caminas por un yacimiento arqueológico activo y no por un decorado.' },
      { type: 'illus', name: 'ceniza', caption: 'La ciudad quedó sellada bajo la ceniza durante siglos: lo que ves hoy es un original irrepetible, no una reconstrucción.' }
    ]
  },
  {
    id: 'ninos',
    title: 'Con niños y accesibilidad',
    kicker: 'GUÍA PRÁCTICA',
    summary: 'Itinerario sin barreras, sillas de ruedas y qué despierta la curiosidad de los más pequeños.',
    readingMinutes: 6,
    cover: { illus: 'gladiador' },
    blocks: [
      { type: 'p', text: 'Pompeya puede ser una experiencia memorable para niños, pero también agotadora si no se planifica: mucho sol, mucha piedra, poca sombra y una narrativa histórica que hay que saber adaptar.' },
      { type: 'h3', text: 'El itinerario accesible: "Pompei per tutti"' },
      { type: 'p', text: 'El parque mantiene señalizado un recorrido de unos 3,5 km sin escalones ni grandes desniveles, pensado para sillas de ruedas y cochecitos, que arranca en Piazza Anfiteatro y conecta varios de los puntos más importantes -el Foro, algunas domus, las termas- salvando los tramos con peor pavimento. No cubre absolutamente todo el yacimiento, pero permite una visita completa sin las escaleras y los umbrales altos que abundan en el resto del recorrido.' },
      { type: 'fact', label: 'Longitud del itinerario accesible', value: '~3,5 km' },
      { type: 'h3', text: 'Sillas de ruedas y cochecitos' },
      { type: 'p', text: 'El parque presta sillas de ruedas de forma gratuita, sujeto a disponibilidad, en la entrada de Piazza Anfiteatro. Los cochecitos de bebé, en cambio, lo pasan mal fuera del itinerario accesible: los adoquines originales son irregulares y muchas aceras romanas tienen un escalón alto pensado para que el peatón no se mojara los pies con el agua de las calles. Si tu hijo es pequeño, una mochila portabebés suele funcionar mejor que un cochecito en las zonas no adaptadas.' },
      { type: 'h3', text: 'Qué engancha a los niños' },
      { type: 'list', items: [
        'Los calcos de yeso de las víctimas, explicados con delicadeza y sin sensacionalismo: son la prueba física más directa de la tragedia.',
        'El mosaico de "Cave Canem" ("cuidado con el perro") a la entrada de la Casa del Poeta Trágico, muy fácil de identificar y de recordar.',
        'El pan carbonizado hallado en los hornos de las panaderías, prueba tangible de que la vida se detuvo de golpe.',
        'El anfiteatro y el mundo de los gladiadores, un tema que conecta de forma natural con lo que ya conocen por películas o libros.',
        'Los graffitis originales conservados en las paredes: insultos, votos electorales, corazones y firmas de gente corriente de hace dos mil años.'
      ] },
      { type: 'img', src: 'cave-canem', alt: 'Mosaico romano de un perro encadenado con la inscripción CAVE CANEM', caption: 'El mosaico "Cave Canem" ("cuidado con el perro"), en el vestíbulo de la Casa del Poeta Trágico.' },
      { type: 'h3', text: 'Duración realista con niños' },
      { type: 'p', text: 'Con niños pequeños, una hora y media o dos de recorrido concentrado en un puñado de paradas suele rendir mejor que un plan ambicioso de medio día: el cansancio y el calor pasan factura antes en la infancia que en un adulto. Lleva agua, algo de comer, protección solar y, si puedes, deja para el final -o para otro día- las casas con cola larga, que ponen a prueba la paciencia de cualquier edad.' },
      { type: 'callout', tone: 'tip', text: 'Explica el mosaico de "Cave Canem" y el pan carbonizado antes de ver los calcos de yeso: ayuda a los niños a entender la magnitud de lo ocurrido de forma gradual, no de golpe.' },
      { type: 'p', text: 'Para adolescentes, en cambio, suele funcionar mejor lo contrario: dejarles buscar por su cuenta detalles concretos -un graffiti con un nombre propio, una tienda con mostrador de mármol, la huella de una rueda de carro en el empedrado- convierte la visita en una pequeña investigación en vez de una clase de historia recitada. La narración punto a punto de una app o de un guía, escuchada con auriculares mientras caminan, suele sostener mejor su atención que ir siguiendo un grupo grande a paso lento.' }
    ]
  }
];

export const CHECKLIST: ChecklistItem[] = [
  { id: 'entrada-descargada', text: 'Entrada descargada (PDF o app) y documento de identidad con el que se compró', why: 'Desde 2024 las entradas son nominales; sin el DNI o pasaporte usado en la compra pueden no dejarte entrar.' },
  { id: 'botella-agua', text: 'Botella de agua reutilizable vacía', why: 'Hay varias fuentes de agua potable dentro del recinto; ahorras dinero y plástico.' },
  { id: 'gorra-sombrero', text: 'Gorra o sombrero', why: 'Apenas hay sombra natural entre las ruinas, sobre todo al mediodía.' },
  { id: 'protector-solar', text: 'Protector solar', why: 'Varias horas caminando al sol sin resguardo.' },
  { id: 'calzado', text: 'Calzado cerrado, cómodo y con suela gruesa', why: 'Los adoquines y las aceras romanas son irregulares y resbalan con la lluvia.' },
  { id: 'bateria-externa', text: 'Batería externa (power bank) para el móvil', why: 'Cámara, mapa, app y narración digital gastan batería rápido en varias horas de uso.' },
  { id: 'auriculares', text: 'Auriculares', why: 'Para narración de audio, app o guía sin molestar a otros visitantes.' },
  { id: 'mapa-offline', text: 'Mapa y contenidos descargados sin conexión', why: 'La cobertura móvil dentro del yacimiento es irregular.' },
  { id: 'mochila-pequena', text: 'Mochila pequeña (no de gran capacidad)', why: 'Las mochilas grandes deben dejarse en consigna, lo que resta tiempo.' },
  { id: 'snack', text: 'Algo de comer (fruta, barritas)', why: 'La oferta de restauración dentro del recinto es escasa y cara.' },
  { id: 'efectivo', text: 'Algo de efectivo', why: 'Pequeños puestos y consignas a veces no admiten tarjeta.' },
  { id: 'plan-b-lluvia', text: 'Plan B para lluvia (poncho ligero)', why: 'No hay muchos refugios; un chaparrón de verano puede sorprender.' },
  { id: 'abanico-refrigerante', text: 'Abanico o toalla de microfibra humedecible', why: 'Ayuda a sobrellevar el calor extremo del verano campano.' },
  { id: 'camara-fotos', text: 'Cámara o móvil con espacio libre de almacenamiento', why: 'Vas a querer fotografiar mucho más de lo que imaginas.' },
  { id: 'ropa-ligera-capas', text: 'Ropa ligera de manga larga o una capa fina', why: 'Protege del sol sin pasar calor y sirve si refresca en invierno.' },
  { id: 'horario-verificado', text: 'Horario y cierre del día verificados la víspera', why: 'Los horarios varían por temporada y puede haber cierres extraordinarios.' },
  { id: 'entradas-secundarias', text: 'Reserva de Vesubio o Herculano si los vas a combinar el mismo día', why: 'El cráter del Vesubio también limita el aforo y exige entrada con hora.' },
  { id: 'bolsa-basura', text: 'Bolsa pequeña para llevarte la basura', why: 'Las papeleras dentro del recinto son escasas.' },
  { id: 'gafas-sol', text: 'Gafas de sol', why: 'La piedra clara y la ausencia de sombra deslumbran mucho al mediodía.' }
];

export const FAQS: Faq[] = [
  { q: '¿Se puede salir del recinto y volver a entrar el mismo día con la misma entrada?', a: 'No, salvo excepciones puntuales que anuncia el propio parque: la entrada da acceso a una sola visita continuada. Si quieres comer fuera o hacer una pausa larga, planifícalo antes de entrar.' },
  { q: '¿Hay wifi dentro del yacimiento?', a: 'No hay wifi público generalizado y la cobertura móvil es irregular en muchas zonas. Descarga mapas, la app oficial y cualquier contenido offline antes de entrar.' },
  { q: '¿Cuánto tiempo se necesita para visitar Pompeya?', a: 'Para lo esencial, calcula un mínimo de 3-4 horas; para un recorrido completo con calma, entre 5 y 6 horas. El yacimiento es enorme -unas 44 hectáreas- y solo una parte está abierta al público.' },
  { q: '¿Merece la pena contratar un guía humano?', a: 'Si es tu primera visita, sí: un buen guía da contexto y evita que te pierdas los detalles menos evidentes. La alternativa razonable es una audioguía o esta misma app con narración punto a punto.' },
  { q: '¿La Villa de los Misterios está incluida en la entrada básica?', a: 'No: la Villa de los Misterios, algo alejada del núcleo del yacimiento, requiere el billete "Pompei Plus" o superior, no el "Pompei Express" básico.' },
  { q: '¿Es apto para niños el Lupanar (el burdel)?', a: 'Es una casa más, con frescos explícitos que ilustran los servicios que se ofrecían; muchas familias entran igualmente, pero cada adulto debe valorar la edad de sus hijos. Al ser tan popular, además, se forman colas largas.' },
  { q: '¿Se puede visitar el Vesubio el mismo día que Pompeya?', a: 'Es posible pero exigente: hay que sumar el trayecto en bus hasta el cráter, la subida a pie y una entrada aparte con hora reservada. Si tu tiempo es limitado, mejor dedicar medio día a cada cosa en jornadas distintas.' },
  { q: '¿Qué se hace si llueve?', a: 'La visita sigue adelante -no hay techos que protejan la mayor parte del recinto-, así que conviene llevar un poncho ligero. Algunas domus con frescos delicados pueden cerrar temporalmente por humedad.' },
  { q: '¿Hay taquillas o guardarropa?', a: 'Sí, gratuitas junto a las entradas principales, y son obligatorias para mochilas o bolsas de más de 30x30x15 cm.' },
  { q: '¿Se puede entrar con bicicleta?', a: 'No se puede circular en bicicleta dentro del yacimiento; puedes llegar en bici hasta la entrada, pero tendrás que dejarla fuera, normalmente en aparcamientos privados cercanos.' },
  { q: '¿Se puede entrar con mascotas?', a: 'Los perros pequeños en bolso de transporte o los perros guía están permitidos; el resto de perros solo si van sujetos con correa corta y, según la zona, con bozal.' },
  { q: '¿Hay sillas de ruedas o cochecitos disponibles en el propio sitio?', a: 'El parque presta sillas de ruedas de forma gratuita en la entrada de Piazza Anfiteatro, sujeto a disponibilidad; conviene preguntar al llegar.' },
  { q: '¿Cuál es la mejor época del año para ir?', a: 'Primavera (abril-mayo) y otoño (septiembre-octubre) ofrecen temperaturas más llevaderas; julio y agosto son duros por el calor, aunque los días son más largos y el horario se amplía hasta las 19:00.' },
  { q: '¿Se puede comer dentro del yacimiento?', a: 'Hay una cafetería junto a las Termas del Foro; fuera de ahí, no está permitido comer dentro de las casas ni sentarse sobre las estructuras antiguas.' },
  { q: '¿Cuánto se anda en total?', a: 'Entre 5 y 8 km si recorres una ruta completa, sobre superficie irregular; no es un paseo llano.' },
  { q: '¿Está todo excavado y visible?', a: 'No: se calcula que en torno a un tercio de la ciudad antigua sigue sin excavar, y una parte de lo ya excavado permanece cerrado por conservación o restauración.' },
  { q: '¿Hace falta reservar con mucha antelación?', a: 'Para fechas normales, unos días bastan; para julio-agosto, fines de semana largos o Semana Santa, resérvala con al menos dos o tres semanas de margen.' }
];
