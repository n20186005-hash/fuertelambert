/**
 * Long-form editorial content.
 *
 * UI strings live in the per-language JSON files (es/en/zh/arn). This module
 * holds the longer, article-style copy for the weather, practical-information
 * and heritage sections, so the UI catalogues stay small and readable.
 *
 * Historical facts used in `heritage` are drawn from public records on
 * Fuerte Lambert / Fuerte de Coquimbo (cerro Castillo del Carmen, Coquimbo):
 * first guns placed in 1865 during the war with Spain; new fort built in 1879
 * by the entrepreneur Carlos J. Lambert during the War of the Pacific; a
 * 150-pound muzzle-loading Armstrong gun installed on 10 July 1879 by the
 * Brigada Cívica de Artillería under Eleazar Lazaeta Roldán; original works by
 * Delmiro Koch; municipal rescue plan in 2003 (68 million pesos) adding three
 * stone viewpoint towers, an entrance portal and a paved access road;
 * restoration inaugurated in 2005.
 */

export type Lang = 'es' | 'en' | 'zh' | 'arn';

export interface WeatherContent {
  title: string;
  subtitle: string;
  now: string;
  rainChance: string;
  feelsLike: string;
  wind: string;
  humidity: string;
  precipitation: string;
  uv: string;
  forecastTitle: string;
  today: string;
  updated: string;
  loading: string;
  unavailable: string;
  sun: string;
  tipsTitle: string;
  tips: string[];
  codes: Record<string, string>;
}

export interface FacilityItem {
  icon: string;
  title: string;
  text: string;
}

export interface PracticalContent {
  title: string;
  subtitle: string;
  neutral: string;
  facilities: FacilityItem[];
  emergencyTitle: string;
  emergencyNote: string;
  emergency: { label: string; value: string }[];
  etiquetteTitle: string;
  etiquette: string[];
}

export interface HeritageContent {
  title: string;
  subtitle: string;
  timelineTitle: string;
  timeline: { period: string; title: string; text: string }[];
  architectureTitle: string;
  architecture: { name: string; text: string }[];
  viewpointTitle: string;
  viewpoint: string[];
  storiesTitle: string;
  stories: { title: string; text: string }[];
  noteTitle: string;
  note: string;
}

export interface Content {
  weather: WeatherContent;
  practical: PracticalContent;
  heritage: HeritageContent;
}

const es: Content = {
  weather: {
    title: 'Clima en el Fuerte',
    subtitle:
      'Condiciones en tiempo real y pronóstico para Coquimbo, para que planifiques la subida y el mirador.',
    now: 'Ahora mismo',
    rainChance: 'Probabilidad de lluvia',
    feelsLike: 'Sensación térmica',
    wind: 'Viento',
    humidity: 'Humedad',
    precipitation: 'Precipitación',
    uv: 'Índice UV',
    forecastTitle: 'Próximos días',
    today: 'Hoy',
    updated: 'Actualizado',
    loading: 'Cargando las condiciones más recientes…',
    unavailable: 'No pudimos cargar el clima en vivo. Vuelve a intentarlo en unos minutos.',
    sun: 'Sol',
    tipsTitle: 'Antes de subir',
    tips: [
      'El cerro está expuesto: el viento y el sol se sienten más que en el centro de la ciudad. Lleva una capa ligera incluso en verano.',
      'Entre diciembre y marzo el índice UV es muy alto; conviene sombrero, lentes y protector solar.',
      'La niebla costera (camanchaca) suele despejarse hacia el mediodía, pero puede borrar por completo la vista.',
      'Con viento fuerte, el ascenso por el sendero y la permanencia en el mirador son más exigentes.',
    ],
    codes: {
      clear: 'Cielo despejado',
      mainlyClear: 'Mayormente despejado',
      partlyCloudy: 'Parcialmente nublado',
      overcast: 'Nublado',
      fog: 'Niebla',
      drizzle: 'Llovizna',
      rain: 'Lluvia',
      showers: 'Chubascos',
      snow: 'Nieve',
      thunderstorm: 'Tormenta eléctrica',
    },
  },
  practical: {
    title: 'Servicios para el visitante e información práctica',
    subtitle:
      'Lo que conviene saber antes de subir: servicios, equipamiento urbano, accesos y recomendaciones neutrales.',
    neutral:
      'Este es un sitio independiente y sin fines de lucro. Enumeramos únicamente tipos de servicios y equipamiento urbano para orientar tu visita; no recomendamos, promocionamos ni tenemos vínculo comercial con ningún negocio concreto.',
    facilities: [
      {
        icon: '🚻',
        title: 'Baños y aseos (WC)',
        text: 'No siempre hay baños públicos dentro del recinto. Lo habitual es encontrar servicios en el centro de Coquimbo, en el sector del puerto y en cafeterías o restaurantes donde se consume.',
      },
      {
        icon: '🅿️',
        title: 'Estacionamiento',
        text: 'Hay espacio para estacionar junto al acceso y en las calles cercanas; en verano y fines de semana largos se llena. Existen estacionamientos de pago en el centro y cerca del puerto.',
      },
      {
        icon: '🍽️',
        title: 'Dónde comer',
        text: 'La oferta se concentra en el centro de Coquimbo y en el sector del puerto y Guayacán: cafeterías, panaderías, fuentes de soda, pizzerías y restaurantes de mariscos. También puedes organizar un picnic si llevas tu propia comida.',
      },
      {
        icon: '🛏️',
        title: 'Alojamiento',
        text: 'En Coquimbo, La Serena y el valle del Elqui hay hoteles, hostales, cabañas y campings de distintas categorías y precios. En temporada alta (enero–febrero) conviene reservar con antelación.',
      },
      {
        icon: '🛒',
        title: 'Supermercados y comercios',
        text: 'Supermercados, minimarkets, farmacias y ferias locales se ubican en el centro de Coquimbo y en los barrios residenciales. Para compras más amplias, La Serena ofrece mayor variedad.',
      },
      {
        icon: '⛽',
        title: 'Combustible y carga eléctrica',
        text: 'Hay estaciones de servicio sobre la Ruta 5 y en los accesos a la ciudad. Los puntos de carga para vehículos eléctricos se concentran en el eje Coquimbo–La Serena, por lo que conviene planificar con antelación.',
      },
      {
        icon: '♿',
        title: 'Accesibilidad',
        text: 'El terreno es irregular y combina rampas con escaleras. El acceso pavimentado y la explanada son transitables con ayuda; algunas zonas altas y el borde del mirador presentan desniveles.',
      },
      {
        icon: '💧',
        title: 'Agua, sombra y refugio',
        text: 'No cuentes con agua potable ni con sombra continua durante el recorrido. Lleva agua, protección solar y una capa de abrigo por si cambia el viento.',
      },
      {
        icon: '📶',
        title: 'Señal móvil y cajeros',
        text: 'La cobertura móvil es buena en toda la ciudad y hay cajeros automáticos en el centro y junto al comercio principal. No esperes datos móviles fiables en todos los puntos del cerro.',
      },
      {
        icon: '🧒',
        title: 'Visita en familia',
        text: 'El paseo es apto para familias con supervisión: hay bordes sin baranda y sectores de roca suelta. Los miradores permiten descansar y explicar el paisaje con calma.',
      },
    ],
    emergencyTitle: 'Números de emergencia en Chile',
    emergencyNote: 'Válidos en todo el país desde cualquier teléfono, incluso sin saldo.',
    emergency: [
      { label: 'Carabineros (Policía)', value: '133' },
      { label: 'Bomberos', value: '132' },
      { label: 'Ambulancia (SAMU)', value: '131' },
      { label: 'Rescate marítimo (Armada)', value: '137' },
      { label: 'Policía de Investigaciones (PDI)', value: '134' },
    ],
    etiquetteTitle: 'Buenas prácticas en un sitio patrimonial',
    etiquette: [
      'Recorre los muros y las estructuras por los senderos habilitados: la piedra se erosiona con el tránsito.',
      'El cañón y los restos de la fortificación son patrimonio: no los trepes ni los marques.',
      'Lleva tu basura de vuelta contigo; el viento costero la dispersa muy rápido.',
      'Consulta las normas locales antes de volar drones o usar equipos de grabación.',
      'Respeta la fauna del islote y del borde costero, especialmente en época de nidificación.',
    ],
  },
  heritage: {
    title: 'Historia, relatos y claves para leer el fuerte',
    subtitle:
      'Una fortificación defensiva del siglo XIX sobre el cerro Castillo del Carmen: cronología, elementos que aún se conservan y el paisaje que explica su posición.',
    timelineTitle: 'Cronología de la bahía y del fuerte',
    timeline: [
      {
        period: '1865',
        title: 'Las primeras piezas de artillería',
        text: 'Durante la guerra contra España se instalaron dos cañones pequeños en el cerro Castillo del Carmen para defender la bahía de Coquimbo. Años después, el intendente José Santiago Aldunate ordenó retirarlos.',
      },
      {
        period: 'Década de 1870',
        title: 'Un puerto que había que proteger',
        text: 'La bahía de Coquimbo y Guayacán concentraban el comercio y la exportación minera del norte. Relatos locales mencionan el traslado de piezas de artillería desde la fortaleza de Valdivia para reforzar la defensa del puerto.',
      },
      {
        period: '1879',
        title: 'Nace el Fuerte Lambert',
        text: 'En plena Guerra del Pacífico, el empresario Carlos J. Lambert impulsó la construcción de un nuevo fuerte en el mismo sector, con el objetivo de proteger el puerto de Coquimbo ante posibles ataques de naves peruanas.',
      },
      {
        period: '10 de julio de 1879',
        title: 'El cañón Armstrong',
        text: 'Soldados de la Brigada Cívica de Artillería, al mando de Eleazar Lazaeta Roldán, instalaron un cañón Armstrong de avancarga de 150 libras, que quedó en el centro de la fortificación. La obra original fue construida por Delmiro Koch.',
      },
      {
        period: '1879–1883',
        title: 'La batería durante la guerra',
        text: 'El fuerte formó parte del sistema defensivo del puerto durante todo el conflicto. Su valor fue sobre todo disuasivo: una bahía artillada era una bahía que las naves enemigas preferían evitar.',
      },
      {
        period: 'Siglo XX',
        title: 'Cien años de permanencia',
        text: 'Durante más de un siglo la estructura se mantuvo en pie, con el cañón ocupando el centro del recinto. Sin mantenimiento sistemático, los muros y el entorno se fueron deteriorando.',
      },
      {
        period: '2003',
        title: 'El rescate municipal',
        text: 'La Municipalidad de Coquimbo inició un plan de rescate con una inversión de 68 millones de pesos: se restauró la fortificación, se amplió el terreno y se añadieron tres torreones de piedra que hoy sirven como miradores, además de faroles, asientos, un portal de entrada de roca local y el camino de acceso pavimentado.',
      },
      {
        period: '2005',
        title: 'Apertura al público',
        text: 'La restauración se inauguró oficialmente y el fuerte quedó consolidado como uno de los miradores emblemáticos de la ciudad, abierto a vecinos y visitantes.',
      },
      {
        period: 'Hoy',
        title: 'Un mirador con memoria',
        text: 'El fuerte es un espacio público gratuito y un punto de encuentro para entender el vínculo de Coquimbo con el mar, con su puerto y con su pasado minero.',
      },
    ],
    architectureTitle: 'Qué mirar dentro del recinto',
    architecture: [
      {
        name: 'La explanada y el emplazamiento del cañón',
        text: 'El cañón ocupa el centro de la fortificación. Su posición explica la lógica del lugar: dominar la entrada de la bahía con una sola pieza de gran alcance.',
      },
      {
        name: 'El cañón Armstrong de avancarga',
        text: 'Se trata de una pieza de 150 libras cargada por la boca e instalada en 1879. Es el objeto que da sentido histórico al recinto y su elemento mejor conservado.',
      },
      {
        name: 'Los tres torreones de piedra',
        text: 'Añadidos durante la restauración de 2003–2005, hoy funcionan como miradores y como puntos de descanso en el perímetro.',
      },
      {
        name: 'El portal de entrada',
        text: 'Dos torres construidas con rocas de la zona enmarcan el acceso; en la misma intervención se pavimentó el camino hasta el fuerte.',
      },
      {
        name: 'Los muros y contrafuertes',
        text: 'Observa cómo el muro se adapta a la pendiente del cerro: la propia topografía formaba parte de la defensa y definía los ángulos de tiro.',
      },
      {
        name: 'El borde del mirador',
        text: 'Recorre el perímetro para reconstruir la línea de tiro y las visuales que controlaba la batería. Hay bordes sin baranda: mantén distancia.',
      },
    ],
    viewpointTitle: 'Leer el paisaje desde arriba',
    viewpoint: [
      'Al norte, la bahía de Coquimbo y el sector portuario de Guayacán, corazón económico de la ciudad.',
      'Al frente, el islote de Punta Pelícanos, que dio nombre al sector y donde descansan aves marinas.',
      'La Cruz del Tercer Milenio, en el cerro vecino, es la referencia visual más reconocible del horizonte.',
      'Hacia el oriente se extiende La Serena y, más atrás, el valle del Elqui.',
      'El Pacífico abierto domina el oeste: desde aquí se entiende por qué esta bahía fue tan codiciada.',
      'En días claros, la cordillera de los Andes cierra el horizonte por el oriente.',
    ],
    storiesTitle: 'Historias y tradiciones de la bahía',
    stories: [
      {
        title: 'Punta Pelícanos',
        text: 'El sector debe su nombre a un islote situado a unos cuarenta metros de la costa donde se congregan pelícanos. Para quienes subían al cerro, las aves eran el primer aviso de que el puerto estaba cerca.',
      },
      {
        title: 'El empresario que armó un cerro',
        text: 'Carlos J. Lambert, cuyo nombre quedó en el fuerte, fue una de las figuras empresariales más influyentes de la región. Su iniciativa recuerda que, en el siglo XIX, defender un puerto también podía ser un asunto privado.',
      },
      {
        title: 'Una ciudad y su tradición oral',
        text: 'La memoria de Coquimbo se ha transmitido sobre todo de forma oral. El libro «Coquimbo, tradición y leyenda», de Alfonso Villanueva Pizarro (1989), recoge buena parte de ese relato colectivo sobre el puerto, sus cerros y su gente.',
      },
    ],
    noteTitle: 'Sobre las fuentes',
    note: 'Las fechas y datos de esta sección provienen de fuentes históricas y de la prensa local, y se presentan con fines divulgativos. Para uso académico o patrimonial, conviene verificarlos en el Consejo de Monumentos Nacionales y en el archivo municipal. Si detectas un error, escríbenos y lo corregiremos.',
  },
};

const en: Content = {
  weather: {
    title: 'Weather at the Fort',
    subtitle:
      'Real-time conditions and a forecast for Coquimbo, so you can plan the climb and the viewpoint.',
    now: 'Right now',
    rainChance: 'Rain chance',
    feelsLike: 'Feels like',
    wind: 'Wind',
    humidity: 'Humidity',
    precipitation: 'Precipitation',
    uv: 'UV index',
    forecastTitle: 'Next few days',
    today: 'Today',
    updated: 'Updated',
    loading: 'Loading the latest conditions…',
    unavailable: 'Live conditions could not be loaded. Please try again in a few minutes.',
    sun: 'Sun',
    tipsTitle: 'Before you head up',
    tips: [
      'The hill is exposed: wind and sun feel stronger here than downtown. Bring a light layer even in summer.',
      'From December to March the UV index is very high; a hat, sunglasses and sunscreen are worth carrying.',
      'Coastal fog (camanchaca) usually clears around midday, but it can wipe out the view entirely.',
      'In strong wind the walk up and the time spent at the viewpoint become much more demanding.',
    ],
    codes: {
      clear: 'Clear sky',
      mainlyClear: 'Mainly clear',
      partlyCloudy: 'Partly cloudy',
      overcast: 'Overcast',
      fog: 'Fog',
      drizzle: 'Drizzle',
      rain: 'Rain',
      showers: 'Showers',
      snow: 'Snow',
      thunderstorm: 'Thunderstorm',
    },
  },
  practical: {
    title: 'Visitor Services & Practical Information',
    subtitle:
      'What is useful to know before you go up: services, urban amenities, access and neutral recommendations.',
    neutral:
      'This is an independent, non-profit website. We only list categories of services and urban amenities to help you orient yourself; we do not recommend, promote or have any commercial relationship with any specific business.',
    facilities: [
      {
        icon: '🚻',
        title: 'Restrooms (WC)',
        text: 'Public restrooms are not always available inside the site. You will usually find facilities in central Coquimbo, around the port area, and in cafés or restaurants where you are a customer.',
      },
      {
        icon: '🅿️',
        title: 'Parking',
        text: 'There is room to park beside the access road and on nearby streets; it fills up in summer and on long weekends. Paid car parks operate downtown and near the port.',
      },
      {
        icon: '🍽️',
        title: 'Where to eat',
        text: 'Options cluster in central Coquimbo and around the port and Guayacán: cafés, bakeries, soda fountains, pizzerias and seafood restaurants. You can also plan a picnic if you bring your own food.',
      },
      {
        icon: '🛏️',
        title: 'Accommodation',
        text: 'Coquimbo, La Serena and the Elqui valley offer hotels, hostels, cabins and campsites in a range of categories and prices. Booking ahead is advisable in high season (January–February).',
      },
      {
        icon: '🛒',
        title: 'Supermarkets & shops',
        text: 'Supermarkets, convenience stores, pharmacies and local markets are found downtown and in the residential districts. For a wider choice, La Serena has more variety.',
      },
      {
        icon: '⛽',
        title: 'Fuel & EV charging',
        text: 'Service stations sit along Ruta 5 and on the roads into town. Electric-vehicle charging points are concentrated along the Coquimbo–La Serena corridor, so plan your charge in advance.',
      },
      {
        icon: '♿',
        title: 'Accessibility',
        text: 'The ground is uneven and mixes ramps with steps. The paved access and the esplanade are manageable with assistance; some upper areas and the viewpoint edge involve level changes.',
      },
      {
        icon: '💧',
        title: 'Water, shade & shelter',
        text: 'Do not count on drinking water or continuous shade along the route. Carry water, sun protection and a warm layer in case the wind shifts.',
      },
      {
        icon: '📶',
        title: 'Mobile signal & ATMs',
        text: 'Mobile coverage is good across the city and there are ATMs downtown and beside the main shops. Do not expect reliable mobile data at every point on the hill.',
      },
      {
        icon: '🧒',
        title: 'Visiting with family',
        text: 'The walk suits families with supervision: some edges have no railing and there are patches of loose rock. The viewpoints give you room to rest and talk about the landscape.',
      },
    ],
    emergencyTitle: 'Emergency numbers in Chile',
    emergencyNote: 'Valid nationwide from any phone, even without credit.',
    emergency: [
      { label: 'Police (Carabineros)', value: '133' },
      { label: 'Fire brigade', value: '132' },
      { label: 'Ambulance (SAMU)', value: '131' },
      { label: 'Maritime rescue (Navy)', value: '137' },
      { label: 'Investigative police (PDI)', value: '134' },
    ],
    etiquetteTitle: 'Good practice at a heritage site',
    etiquette: [
      'Stay on the marked paths when walking the walls and structures: stone erodes quickly under foot traffic.',
      'The cannon and the surviving fortifications are heritage: do not climb them or leave marks.',
      'Take your rubbish back with you; coastal wind scatters it very quickly.',
      'Check local rules before flying drones or setting up recording equipment.',
      'Respect the wildlife of the islet and the shoreline, especially during nesting season.',
    ],
  },
  heritage: {
    title: 'History, Stories & How to Read the Fort',
    subtitle:
      'A nineteenth-century defensive fortification on cerro Castillo del Carmen: a timeline, the elements that survive, and the landscape that explains its position.',
    timelineTitle: 'Timeline of the bay and the fort',
    timeline: [
      {
        period: '1865',
        title: 'The first guns',
        text: 'During the war with Spain, two small cannon were placed on cerro Castillo del Carmen to defend the bay of Coquimbo. Years later the intendant José Santiago Aldunate ordered them removed.',
      },
      {
        period: '1870s',
        title: 'A port that had to be protected',
        text: 'The bays of Coquimbo and Guayacán concentrated the north\u2019s trade and mining exports. Local accounts mention artillery being brought south-to-north from the fortress of Valdivia to strengthen the port\u2019s defences.',
      },
      {
        period: '1879',
        title: 'The birth of Fort Lambert',
        text: 'In the middle of the War of the Pacific, the entrepreneur Carlos J. Lambert drove the construction of a new fort in the same sector, to protect the port of Coquimbo from possible attacks by Peruvian ships.',
      },
      {
        period: '10 July 1879',
        title: 'The Armstrong gun',
        text: 'Soldiers of the Brigada Cívica de Artillería, commanded by Eleazar Lazaeta Roldán, installed a 150-pound muzzle-loading Armstrong cannon at the centre of the fortification. The original works were built by Delmiro Koch.',
      },
      {
        period: '1879–1883',
        title: 'The battery during the war',
        text: 'The fort formed part of the port\u2019s defensive system throughout the conflict. Its value was largely deterrent: an armed bay was a bay enemy ships preferred to avoid.',
      },
      {
        period: '20th century',
        title: 'A century standing',
        text: 'For more than a hundred years the structure remained standing, with the cannon at the centre of the enclosure. Without systematic maintenance, the walls and their surroundings gradually decayed.',
      },
      {
        period: '2003',
        title: 'The municipal rescue plan',
        text: 'The Municipality of Coquimbo began a rescue plan with an investment of 68 million pesos: the fortification was restored, the grounds enlarged and three stone towers were added that now serve as viewpoints, along with lamps, seating, an entrance portal built from local rock and a paved access road.',
      },
      {
        period: '2005',
        title: 'Opened to the public',
        text: 'The restoration was officially inaugurated and the fort became established as one of the city\u2019s emblematic viewpoints, open to residents and visitors.',
      },
      {
        period: 'Today',
        title: 'A viewpoint with a memory',
        text: 'The fort is a free public space and a meeting point for understanding Coquimbo\u2019s relationship with the sea, its port and its mining past.',
      },
    ],
    architectureTitle: 'What to look for inside',
    architecture: [
      {
        name: 'The esplanade and the gun position',
        text: 'The cannon occupies the centre of the fortification. Its siting explains the logic of the place: commanding the mouth of the bay with a single long-range piece.',
      },
      {
        name: 'The muzzle-loading Armstrong cannon',
        text: 'A 150-pound piece loaded through the muzzle and installed in 1879. It gives the site its historical meaning and is its best-preserved element.',
      },
      {
        name: 'The three stone towers',
        text: 'Added during the 2003–2005 restoration, they now work as viewpoints and resting points around the perimeter.',
      },
      {
        name: 'The entrance portal',
        text: 'Two towers built from local rock frame the access; the same project paved the road up to the fort.',
      },
      {
        name: 'Walls and buttresses',
        text: 'Notice how the wall follows the slope of the hill: the topography itself was part of the defence and dictated the firing angles.',
      },
      {
        name: 'The viewpoint edge',
        text: 'Walk the perimeter to reconstruct the line of fire and the sightlines the battery controlled. Some edges have no railing: keep your distance.',
      },
    ],
    viewpointTitle: 'Reading the landscape from the top',
    viewpoint: [
      'To the north, the bay of Coquimbo and the port area of Guayacán, the economic heart of the city.',
      'Directly ahead, the Punta Pelícanos islet, which gave the sector its name and where seabirds rest.',
      'The Cruz del Tercer Milenio on the neighbouring hill is the most recognisable landmark on the skyline.',
      'Eastwards lie La Serena and, further back, the Elqui valley.',
      'The open Pacific dominates the west: from here it is easy to see why this bay was so prized.',
      'On clear days the Andes close the horizon to the east.',
    ],
    storiesTitle: 'Stories and traditions of the bay',
    stories: [
      {
        title: 'Punta Pelícanos',
        text: 'The sector takes its name from an islet about forty metres off the coast where pelicans gather. For anyone climbing the hill, the birds were the first sign that the port was near.',
      },
      {
        title: 'The businessman who armed a hill',
        text: 'Carlos J. Lambert, whose name the fort carries, was one of the region\u2019s most influential business figures. His initiative is a reminder that in the nineteenth century defending a port could also be a private undertaking.',
      },
      {
        title: 'A city and its oral tradition',
        text: 'Coquimbo\u2019s memory has been passed on mainly by word of mouth. The book «Coquimbo, tradición y leyenda» by Alfonso Villanueva Pizarro (1989) gathers much of that collective account of the port, its hills and its people.',
      },
    ],
    noteTitle: 'A note on sources',
    note: 'The dates and details in this section come from historical sources and the local press, and are presented for general information. For academic or heritage purposes, please verify them with the Consejo de Monumentos Nacionales and the municipal archive. If you spot an error, write to us and we will correct it.',
  },
};

const zh: Content = {
  weather: {
    title: '堡垒天气',
    subtitle: '科金博实时天气与未来预报，方便你安排登山与观景行程。',
    now: '当前',
    rainChance: '降水概率',
    feelsLike: '体感',
    wind: '风速',
    humidity: '湿度',
    precipitation: '降水',
    uv: '紫外线指数',
    forecastTitle: '未来几天',
    today: '今天',
    updated: '更新于',
    loading: '正在获取最新天气…',
    unavailable: '暂时无法获取实时天气，请稍后再试。',
    sun: '日出 / 日落',
    tipsTitle: '登顶前提醒',
    tips: [
      '山体空旷，风力和日照都比市区更强，即使夏天也建议带一件薄外套。',
      '12 月至次年 3 月紫外线很强，建议带上帽子、墨镜和防晒霜。',
      '沿海低云海雾（camanchaca）通常到中午才散，也可能完全遮住视野。',
      '若预报有强风，沿步道攀登和在观景台停留都会更费力，请预留时间。',
    ],
    codes: {
      clear: '晴',
      mainlyClear: '晴间多云',
      partlyCloudy: '局部多云',
      overcast: '阴',
      fog: '雾',
      drizzle: '毛毛雨',
      rain: '雨',
      showers: '阵雨',
      snow: '雪',
      thunderstorm: '雷暴',
    },
  },
  practical: {
    title: '访客服务与实用信息',
    subtitle: '上山前值得了解的事：服务、城市配套设施、交通与中立建议。',
    neutral:
      '本站为独立的非营利网站。我们只罗列服务与城市设施的类型，供你判断行程；不推荐、不推广任何具体商户，也与其不存在任何商业关系。',
    facilities: [
      {
        icon: '🚻',
        title: '公共卫生间（WC）',
        text: '园区内不保证始终开放公共卫生间。通常可在科金博市中心、港口一带，以及消费后的咖啡馆或餐厅使用洗手间。',
      },
      {
        icon: '🅿️',
        title: '停车',
        text: '入口道路旁与附近街道可以停车，夏季和长周末容易停满。市中心与港口附近设有收费停车场。',
      },
      {
        icon: '🍽️',
        title: '用餐',
        text: '餐饮集中在科金博市中心以及港口和瓜亚坎（Guayacán）一带：咖啡馆、面包店、简餐店、披萨店与海鲜餐厅。自带食物也可以安排野餐。',
      },
      {
        icon: '🛏️',
        title: '住宿',
        text: '科金博、拉塞雷纳与埃尔基河谷提供不同档次与价位的酒店、旅舍、木屋与露营地。旺季（1—2 月）建议提前预订。',
      },
      {
        icon: '🛒',
        title: '超市与商店',
        text: '超市、便利店、药店与本地集市分布在市中心和居民区。若需要更丰富的选择，拉塞雷纳的品类更多。',
      },
      {
        icon: '⛽',
        title: '加油与充电',
        text: '加油站分布在 5 号公路沿线及进城道路。电动车充电点多集中在科金博—拉塞雷纳一线，建议提前规划补能。',
      },
      {
        icon: '♿',
        title: '无障碍情况',
        text: '地形起伏较大，坡道与台阶交替。铺装通道和主平台在有人协助时可通行；部分高处区域与观景台边缘存在高差。',
      },
      {
        icon: '💧',
        title: '饮水、遮阴与保暖',
        text: '沿途没有稳定的饮用水与连续遮阴。请自带饮水、防晒用品，并备一件保暖衣物以应对风力变化。',
      },
      {
        icon: '📶',
        title: '手机信号与取现',
        text: '市区手机信号良好，市中心与主要商业区设有 ATM。山体各处的移动数据并不稳定。',
      },
      {
        icon: '🧒',
        title: '亲子游览',
        text: '适合有看护的家庭前往：部分边缘没有护栏，也有碎石路段。观景台便于休息，也方便为孩子讲解眼前的景观。',
      },
    ],
    emergencyTitle: '智利紧急电话',
    emergencyNote: '全国通用，任何电话均可拨打，无需余额。',
    emergency: [
      { label: '警察（Carabineros）', value: '133' },
      { label: '消防', value: '132' },
      { label: '急救（SAMU）', value: '131' },
      { label: '海上救援（海军）', value: '137' },
      { label: '刑事调查警察（PDI）', value: '134' },
    ],
    etiquetteTitle: '文化遗产地参观礼仪',
    etiquette: [
      '请沿已开放的步道游览墙体与遗迹：频繁踩踏会加速石材风化。',
      '火炮与堡垒遗迹属于文化遗产，请勿攀爬或刻画留字。',
      '请把垃圾随身带走，海风很快会把垃圾吹散。',
      '放飞无人机或架设摄录设备前，请先了解当地规定。',
      '尊重小岛与海岸带的野生动物，繁殖季节尤其需要保持距离。',
    ],
  },
  heritage: {
    title: '历史、故事与解读这座堡垒的方法',
    subtitle:
      '卡斯蒂略·德尔·卡门山（Cerro Castillo del Carmen）上的一座 19 世纪海防工事：时间线、现存遗迹，以及解释其选址的景观。',
    timelineTitle: '海湾与堡垒的时间线',
    timeline: [
      {
        period: '1865 年',
        title: '最初的炮位',
        text: '在对西班牙战争期间，人们在卡斯蒂略·德尔·卡门山上架设两门小炮，用于防卫科金博海湾。数年后，省长何塞·圣地亚哥·阿尔杜纳特（José Santiago Aldunate）下令将其撤走。',
      },
      {
        period: '1870 年代',
        title: '一座必须保护的港口',
        text: '科金博湾与瓜亚坎（Guayacán）集中了北部的贸易与矿产出口。当地记述提到，曾从南部的瓦尔迪维亚要塞调运火炮北上，以加强港口防御。',
      },
      {
        period: '1879 年',
        title: '兰伯特堡诞生',
        text: '太平洋战争期间，企业家卡洛斯·J·兰伯特（Carlos J. Lambert）在同一地段推动修建新堡垒，目的是防备秘鲁舰船可能对科金博港发动的攻击。',
      },
      {
        period: '1879 年 7 月 10 日',
        title: '阿姆斯特朗火炮',
        text: '由埃莱亚萨尔·拉萨埃塔·罗尔丹（Eleazar Lazaeta Roldán）指挥的公民炮兵旅士兵，在堡垒中央安装了 1 门 150 磅前装式阿姆斯特朗火炮。原始工事由德尔米罗·科赫（Delmiro Koch）建造。',
      },
      {
        period: '1879—1883 年',
        title: '战争期间的炮台',
        text: '整个战争期间，堡垒都是港口防御体系的一部分。它的价值更多在于威慑：设防的海湾，是敌方舰船更愿意避开的航路。',
      },
      {
        period: '20 世纪',
        title: '屹立百年',
        text: '在此后一百多年里，堡垒基本保留原貌，火炮始终位于场地中央。由于缺乏系统维护，墙体与周边逐渐出现不同程度的破损。',
      },
      {
        period: '2003 年',
        title: '市政府抢救计划',
        text: '科金博市政府启动抢救计划，投入 6800 万比索：修复堡垒本体、扩大场地，并新增三座石砌塔楼（如今作为观景台），同时加装路灯与座椅、用当地岩石修建入口门楼，并铺装了上山道路。',
      },
      {
        period: '2005 年',
        title: '正式向公众开放',
        text: '修复工程正式落成，堡垒成为这座城市最具代表性的观景点之一，向居民与访客开放。',
      },
      {
        period: '今天',
        title: '带着记忆的观景台',
        text: '堡垒是一处免费开放的公共空间，也是理解科金博与海洋、港口及矿业历史之间关系的一个交汇点。',
      },
    ],
    architectureTitle: '进入园区后看什么',
    architecture: [
      {
        name: '主平台与炮位',
        text: '火炮位于堡垒正中。它的位置解释了整座工事的逻辑：用一门远程火炮控制海湾入口。',
      },
      {
        name: '前装式阿姆斯特朗火炮',
        text: '这是 1879 年安装的 150 磅前装火炮，是赋予此地历史意义的核心遗物，也是保存最完好的构件。',
      },
      {
        name: '三座石砌塔楼',
        text: '2003—2005 年修复时增建，如今沿场地外缘兼作观景台与休息点。',
      },
      {
        name: '入口门楼',
        text: '两座以当地岩石砌筑的塔楼框出入口；同一工程还铺装了通往堡垒的道路。',
      },
      {
        name: '墙体与扶壁',
        text: '留意墙体如何顺应山坡走势：地形本身就是防御的一部分，也决定了射击角度。',
      },
      {
        name: '观景台边缘',
        text: '沿外缘走一圈，可以还原当年的射击线与火力控制范围。部分边缘没有护栏，请保持距离。',
      },
    ],
    viewpointTitle: '从高处读懂这片风景',
    viewpoint: [
      '北面是科金博海湾与瓜亚坎港区，也是这座城市的经济核心。',
      '正前方是鹈鹕角（Punta Pelícanos）小岛，这一地段因此得名，也是海鸟的栖息地。',
      '邻近山头上的千禧十字架（Cruz del Tercer Milenio）是视野中最具辨识度的地标。',
      '向东延伸的是拉塞雷纳，再往远处是埃尔基河谷。',
      '西面是开阔的太平洋——站在这里就能理解这座海湾为何如此被争夺。',
      '天气晴朗时，安第斯山脉在东侧收住地平线。',
    ],
    storiesTitle: '海湾的故事与传说',
    stories: [
      {
        title: '鹈鹕角',
        text: '这一段海岸得名于离岸约四十米的小岛，那里聚集着鹈鹕。对当年上山的守军与居民来说，看到鸟群就意味着港口近了。',
      },
      {
        title: '为山头装上火炮的企业家',
        text: '堡垒以卡洛斯·J·兰伯特命名，他是本区最具影响力的企业家之一。这段往事也提醒人们：在 19 世纪，保卫一座港口有时也是私人事业。',
      },
      {
        title: '一座城市与它的口述传统',
        text: '科金博的记忆主要靠口耳相传。阿方索·比利亚努埃瓦·皮萨罗（Alfonso Villanueva Pizarro）1989 年的著作《Coquimbo, tradición y leyenda》收录了大量关于港口、山丘与居民的集体记忆。',
      },
    ],
    noteTitle: '关于资料来源',
    note: '本节中的日期与史实来自历史文献与当地媒体报道，仅作科普用途。如需学术引用或遗产事务使用，请向智利国家纪念物委员会（Consejo de Monumentos Nacionales）及市政档案核实。如发现错误，欢迎联系我们更正。',
  },
};

const arn: Content = {
  weather: {
    title: 'Antü ka mawün',
    subtitle: 'Coquimbo antü ka mawün. Pukara küpan ñi pepiluwün.',
    now: 'Fewla',
    rainChance: 'Mawün',
    feelsLike: 'Sensación',
    wind: 'Kürüf',
    humidity: 'Humedad',
    precipitation: 'Mawün',
    uv: 'UV',
    forecastTitle: 'Küpa antü',
    today: 'Fachantü',
    updated: 'Actualizado',
    loading: 'Yepakantükun…',
    unavailable: 'Antü kimlay. Küpa pürüm.',
    sun: 'Antü',
    tipsTitle: 'Küpan küpa',
    tips: [
      'Cerro mew kürüf ka antü doy newen. Lleve tunic.',
      'Diciembre–marzo: antü newen. Sombra ka protector solar.',
      'Camanchaca (niebla) rume kim mapu. Chumüm mirador.',
      'Kürüf newen mew: küpan doy küdau.',
    ],
    codes: {
      clear: 'Antü',
      mainlyClear: 'Antü ka tromü',
      partlyCloudy: 'Tromü',
      overcast: 'Tromü rume',
      fog: 'Metre',
      drizzle: 'Pichike mawün',
      rain: 'Mawün',
      showers: 'Mawün',
      snow: 'Pire',
      thunderstorm: 'Tralkan',
    },
  },
  practical: {
    title: 'Servicios ka kimün',
    subtitle: 'Pukara mew küpan: servicios, ka kimün.',
    neutral:
      'Ko web küme mongen nütram, institución oficial ül. Kam servicio müle, tüfa mew nütram. Chem negocio mew kümelkay.',
    facilities: [
      { icon: '🚻', title: 'Baños (WC)', text: 'Baños mülelay pukara mew. Centro Coquimbo mew müle.' },
      { icon: '🅿️', title: 'Estacionamiento', text: 'Acceso mew estacionamiento müle. Verano mew pitüküy.' },
      { icon: '🍽️', title: 'Comida', text: 'Centro Coquimbo ka puerto mew: café, panadería, restaurant.' },
      { icon: '🛏️', title: 'Alojamiento', text: 'Hotel, hostal, cabaña ka camping: Coquimbo, La Serena, Elqui.' },
      { icon: '🛒', title: 'Supermercado', text: 'Supermercado, farmacia ka feria centro mew müle.' },
      { icon: '⛽', title: 'Combustible', text: 'Ruta 5 mew bencinera müle. Auto eléctrico: Coquimbo–La Serena.' },
      { icon: '♿', title: 'Accesibilidad', text: 'Mapu witrun. Escalera ka rampa müle.' },
      { icon: '💧', title: 'Agua ka sombra', text: 'Agua ka sombra lleve. Antü newen.' },
      { icon: '📶', title: 'Señal ka cajero', text: 'Señal küme. Cajero centro mew müle.' },
      { icon: '🧒', title: 'Familia', text: 'Familia küpan küme. Borde mew küdawnge.' },
    ],
    emergencyTitle: 'Emergencia números (Chile)',
    emergencyNote: 'Kom pu mapu, kom teléfono mew.',
    emergency: [
      { label: 'Carabineros (133)', value: '133' },
      { label: 'Bomberos', value: '132' },
      { label: 'Ambulancia', value: '131' },
      { label: 'Rescate marítimo', value: '137' },
      { label: 'PDI', value: '134' },
    ],
    etiquetteTitle: 'Patrimonio mew küme femün',
    etiquette: [
      'Sendero mew rume. Roca ñam.',
      'Cañón ka muro: patrimonio. Ütrüfünge.',
      'Basura lleve.',
      'Dron: municipalidad mew ramtu.',
      'Fauna borde costero: respeta.',
    ],
  },
  heritage: {
    title: 'Nütram ka kimün pukara mew',
    subtitle: 'Cerro Castillo del Carmen mew, 1879 pukara. Küpan ka day.',
    timelineTitle: 'Day',
    timeline: [
      { period: '1865', title: 'Küpa cañón', text: 'España guerra mew: epu pichike cañón Coquimbo bahía mew.' },
      { period: '1870', title: 'Puerto', text: 'Coquimbo ka Guayacán: comercio ka mineralía.' },
      { period: '1879', title: 'Fuerte Lambert', text: 'Carlos J. Lambert: we pukara, puerto ñi defensa.' },
      { period: '10 julio 1879', title: 'Armstrong cañón', text: '150 libra Armstrong cañón: Eleazar Lazaeta Roldán. Delmiro Koch.' },
      { period: '1879–1883', title: 'Guerra', text: 'Pukara: puerto defensa, Guerra del Pacífico mew.' },
      { period: 'Siglo XX', title: 'Mari pataka tripantu', text: 'Mari pataka tripantu: pukara müle, küme amulay.' },
      { period: '2003', title: 'Rescate', text: 'Municipalidad Coquimbo: 68 millón peso, küla torreón mirador.' },
      { period: '2005', title: 'Apertura', text: 'Restauración: kom pu che wüñol' },
      { period: 'Fewla', title: 'Mirador', text: 'Pukara: kom che, gratis.' },
    ],
    architectureTitle: 'Chem lay pukara mew',
    architecture: [
      { name: 'Cañón', text: 'Armstrong cañón, 1879, pukara ñi piuke.' },
      { name: 'Torreón', text: 'Küla torreón piedra, 2003 mew, mirador.' },
      { name: 'Portal', text: 'Epu torre, lugar mew piedra.' },
      { name: 'Muro', text: 'Muro: cerro mew nielewe, defensa.' },
      { name: 'Plataforma', text: 'Explanada: bahía mew newen.' },
      { name: 'Borde', text: 'Borde mew baranda mülelay: küdawnge.' },
    ],
    viewpointTitle: 'Mapu mew kimün',
    viewpoint: [
      'Norte: Coquimbo bahía ka Guayacán puerto.',
      'Punta Pelícanos: isla, pelícano müle.',
      'Cruz del Tercer Milenio: cerro mew.',
      'Este: La Serena ka Elqui.',
      'Oeste: lafken (Pacífico).',
      'Andes: antü küme mew.',
    ],
    storiesTitle: 'Nütram',
    stories: [
      { title: 'Punta Pelícanos', text: 'Pelícano isla: puerto kimün.' },
      { title: 'Carlos J. Lambert', text: 'Empresario: puerto ñi defensa, kimün.' },
      { title: 'Coquimbo nütram', text: 'Alfonso Villanueva Pizarro, 1989: «Coquimbo, tradición y leyenda».' },
    ],
    noteTitle: 'Fuente',
    note: 'Tüfa nütram: fuente histórico ka prensa mew. Consejo de Monumentos Nacionales mew ramtu.',
  },
};

const content: Record<Lang, Content> = { es, en, zh, arn };

export function getContent(lang: string): Content {
  return content[(lang as Lang) in content ? (lang as Lang) : 'es'];
}
