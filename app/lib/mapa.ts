/**
 * El mapa de Hivrido: las diez puertas que salen de la home. Lo leen el hub
 * "Todo Hivrido", el menú y el pie de la home, así que una sección nueva se
 * suma acá una sola vez.
 *
 * Las bajadas son los rótulos que cada sección ya usa en el anillo de /web/
 * (public/cosmos/projects.js): no hay copy nuevo.
 *
 * Contacto no es una ruta: el hub lo resuelve con WhatsApp y mail.
 */
export type Puerta = {
  n: string;
  label: string;
  bajada: string;
  /** Sin href: es la puerta de contacto. */
  href?: string;
};

export const PUERTAS: Puerta[] = [
  { n: "01", label: "Hivrido PLAY", bajada: "Series y películas", href: "/play/" },
  { n: "02", label: "Casting", bajada: "Convocatoria abierta", href: "/casting/" },
  { n: "03", label: "La productora", bajada: "Inteligencia creativa", href: "/web/" },
  { n: "04", label: "Artistas", bajada: "Representación", href: "/artistas/" },
  { n: "05", label: "Grow Digital", bajada: "Diseño web & app", href: "/diseno-web/" },
  { n: "06", label: "Branding", bajada: "Identidad de marca", href: "/branding/" },
  { n: "07", label: "Publicidad", bajada: "Partner de Google y Meta", href: "/publicidad/" },
  { n: "08", label: "Agentes IA", bajada: "Automatización", href: "/colmena-agentes/" },
  { n: "09", label: "Equipo", bajada: "Quiénes hacemos Hivrido", href: "/equipo/" },
  { n: "10", label: "Contacto", bajada: "WhatsApp y mail" },
];

/** Rutas que no son puertas del hub pero sí van en el mapa completo del pie. */
export const MAS_RUTAS = [
  { label: "ORIGEN", href: "/origen/" },
  { label: "Okupas", href: "/okupas/" },
];
