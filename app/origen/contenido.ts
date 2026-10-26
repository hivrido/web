/**
 * Texto de /origen. Sale de la estrategia de ORIGEN —manifiesto, generaciones,
 * caja negra, recorrido y expansión— y vive acá para que la página solo arme.
 *
 * La sede es Chapadmalal (el complejo junto a la playa Cruz del Sur, con
 * pileta y skatepark): el programa de los tres días usa esos espacios. Los
 * horarios son tentativos hasta que se abra la convocatoria.
 */

const WA_BASE = "https://api.whatsapp.com/send?phone=5491156072460&text=";
export const wa = (texto: string) => WA_BASE + encodeURIComponent(texto);

export const WA_ARTISTA = wa("Hola Hivrido! Quiero ser parte de la Generación 001 de ORIGEN.");
export const WA_CREATIVO = wa("Hola Hivrido! Soy productor/creativo y quiero sumarme a ORIGEN.");
export const WA_ALIADO = wa("Hola Hivrido! Somos una marca y queremos ser aliados de ORIGEN.");

export const SEO = {
  title: "ORIGEN | Campamento para artistas · Generación 001 | Hivrido",
  description:
    "ORIGEN es la plataforma de desarrollo artístico de Hivrido: tres días de convivencia en Chapadmalal donde artistas, productores y creativos componen, graban y filman juntos. Generación 001.",
};

export const TICKER = [
  "Generación 001",
  "Todo artista tiene un origen",
  "Producción musical",
  "Videoclips",
  "Comunidad",
  "Chapadmalal",
  "Tres días",
  "Donde nacen las próximas carreras",
];

export const MANIFIESTO = [
  "Ya no alcanza con hacer buenas canciones.",
  "Un artista necesita identidad, comunidad, contenido, conexiones y experiencias.",
  "Las mejores carreras no nacen en una oficina.",
  "Nacen conviviendo. Creando. Compartiendo. Equivocándose. Inspirándose.",
];

export const VALORES: [string, string][] = [
  ["La competencia", "La colaboración"],
  ["Los egos", "Las conexiones"],
  ["El artista solitario", "Las comunidades"],
];

export const PROBLEMA: [string, string][] = [
  ["Trabaja solo", "Convive tres días con artistas y creativos"],
  ["No conoce productores", "Graba con productores desde la primera noche"],
  ["No genera contenido", "Se va con fotos, videos y su historia documentada"],
  ["No tiene una identidad clara", "Trabaja su sonido y su imagen con dirección creativa"],
  ["No construye relaciones", "Se lleva una generación entera de contactos"],
  ["No encuentra oportunidades", "Llega a marcas y aliados que buscan nuevas voces"],
];

export const ROLES = ["Artistas", "Productores", "Filmmakers", "Diseñadores", "Fotógrafos", "Creativos"];

export const PILARES = [
  { titulo: "Laboratorio creativo", texto: "Canciones, imágenes e ideas que nacen ahí mismo, entre todos." },
  { titulo: "Incubadora", texto: "Cada proyecto se trabaja con dirección y foco propios." },
  { titulo: "Acelerador", texto: "En tres días, lo que solo llevaría meses." },
  { titulo: "Comunidad", texto: "Una red que sigue creando cuando todo termina." },
];

export const CAJA = [
  { titulo: "Una carta", texto: "La bienvenida personal a la generación." },
  { titulo: "Una pulsera con un número", texto: "No con un nombre: en ORIGEN todos empiezan igual." },
  { titulo: "La remera de la edición", texto: "Exclusiva de esa generación." },
  { titulo: "La primera pista", texto: "El inicio de las semanas de revelaciones antes del campamento." },
];

export const RECORRIDO = [
  {
    etapa: "Antes",
    titulo: "La espera también es parte",
    pasos: [
      "Convocatoria abierta y proceso de selección.",
      "Llega la caja negra a cada seleccionado.",
      "Presentamos a los artistas uno por uno.",
      "Pistas y desafíos que la comunidad sigue en vivo.",
    ],
  },
  {
    etapa: "Durante",
    titulo: "No entrás a una quinta: entrás a un mundo",
    pasos: [
      "Todo tiene identidad: espacios, habitaciones, actividades.",
      "Sesiones de composición y producción por equipos.",
      "Rodajes de videoclips, fotos y sesiones acústicas.",
      "Cada momento queda documentado.",
    ],
  },
  {
    etapa: "Después",
    titulo: "Cuando termina, empieza",
    pasos: [
      "Lanzamientos de la música creada en ORIGEN.",
      "Estreno del documental de la generación.",
      "Comunidad activa: colaboraciones y reencuentros.",
      "La generación recibe y guía a la siguiente.",
    ],
  },
];

export const DIAS = [
  {
    dia: "01",
    nombre: "Llegada",
    slots: [
      ["12:00", "Bienvenida", "Check-in, kits y recorrido por el lugar."],
      ["14:00", "Ronda de origen", "Cada artista se presenta con una canción."],
      ["17:00", "Se arman los equipos", "Artistas, productores y creativos mezclados."],
      ["19:30", "Atardecer en Cruz del Sur", "La primera foto de la generación."],
      ["22:00", "Estudio abierto", "Las primeras ideas, de noche."],
    ],
  },
  {
    dia: "02",
    nombre: "Creación",
    slots: [
      ["10:00", "Se revela el desafío", "Una consigna común para todos los equipos."],
      ["11:00", "Sesiones por equipo", "Composición, grabación y producción."],
      ["16:00", "Rodajes", "Videoclips en la pileta, el bowl y la playa."],
      ["20:00", "Escucha colectiva", "Avances y devoluciones entre todos."],
      ["23:00", "Madrugada de estudio", "Donde pasa la magia."],
    ],
  },
  {
    dia: "03",
    nombre: "Origen",
    slots: [
      ["10:00", "Terminación", "Mezcla y últimos retoques."],
      ["14:00", "Sesiones acústicas", "Las canciones, en vivo y en cámara."],
      ["18:00", "Showcase", "Presentación final ante aliados invitados."],
      ["21:00", "Ceremonia", "Entrega de las chaquetas de la generación."],
    ],
  },
] as const;

export const PARA_QUIEN = [
  {
    num: "01",
    rol: "Artistas",
    titulo: "No venís a grabar música. Venís a empezar una historia.",
    texto: "Identidad, red y obra terminada en tres días.",
    items: [
      "Canciones terminadas y producidas",
      "Contenido propio: video, foto y documental",
      "Colaboraciones con otros artistas",
      "Pertenencia a una generación",
    ],
    cta: "Quiero ser parte",
    href: WA_ARTISTA,
  },
  {
    num: "02",
    rol: "Productores y creativos",
    titulo: "Tu trabajo, en el origen de algo.",
    texto: "Productores, filmmakers, fotógrafos y diseñadores, desde el primer día.",
    items: [
      "Créditos en lanzamientos reales",
      "Material para tu portfolio",
      "Relación directa con talento emergente",
      "Visibilidad en todo el contenido",
    ],
    cta: "Quiero sumarme",
    href: WA_CREATIVO,
  },
  {
    num: "03",
    rol: "Marcas",
    titulo: "No buscamos sponsors. Buscamos aliados.",
    texto: "Marcas que apuesten por la nueva generación y formen parte de su crecimiento, no solo de un logo.",
    items: [
      "Integración en la narrativa y el documental",
      "Contenido co-creado con los artistas",
      "Presencia en el showcase y la ceremonia",
      "Vínculo con cada nueva generación",
    ],
    cta: "Quiero ser aliado",
    href: WA_ALIADO,
  },
];

export const HISTORIA = [
  "Las dudas.",
  "Las primeras conversaciones.",
  "Las primeras colaboraciones.",
  "Las madrugadas grabando.",
  "Los errores. Las risas.",
  "Las emociones.",
];

export const FORMATOS = [
  "Documental principal",
  "Mini documentales",
  "Reels",
  "TikToks",
  "Shorts",
  "Podcasts",
  "Entrevistas",
  "Behind the scenes",
  "Sesiones acústicas",
  "Fotografía",
  "Making of",
];

export const SEDES = [
  { ciudad: "Buenos Aires", detalle: "Chapadmalal", estado: "Generación 001" },
  { ciudad: "Córdoba" },
  { ciudad: "Mendoza" },
  { ciudad: "Montevideo" },
  { ciudad: "Santiago" },
  { ciudad: "Medellín" },
  { ciudad: "Ciudad de México" },
];

export const DATOS: [string, string][] = [
  ["Formato", "Tres días de convivencia creativa"],
  ["Sede", "Chapadmalal, frente al mar"],
  ["Cupo", "Limitado por generación"],
  ["Después", "Comunidad y lanzamientos"],
];
