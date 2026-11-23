/**
 * RYTMOS — la ficha de la serie. Fuente única de todo lo que se ve de ella:
 * la home (app/components/rytmos/), su tarjeta y su ficha en el catálogo
 * (app/lib/catalog.ts deriva la entrada de acá), el schema.org y el sitemap.
 *
 * Regla: no se inventa nada. Cada dato que falta está marcado TODO-CONTENIDO
 * y su bloque no se renderiza mientras esté vacío; al cargarlo aparece solo.
 * El formato y la medida exacta de cada pieza están en
 * docs/PENDIENTES-RYTMOS.md.
 *
 * Las imágenes se cargan como ruta base sin extensión: el script
 * `scripts/build-rytmos-images.mjs` genera las variantes AVIF/WebP por ancho
 * a partir del máster, y los componentes arman el `srcset` con ellas.
 */

export type Persona = {
  /** Actor o actriz. */
  nombre: string;
  personaje?: string;
  /** Ruta base de la foto (sin extensión), 4:5. */
  foto?: string;
};

export type Imagen = {
  /** Ruta base sin extensión: /images/rytmos/<nombre>. */
  src: string;
  alt: string;
  ancho: number;
  alto: number;
};

export type Episodio = { titulo: string; descripcion?: string; duracion?: string };

export type Tema = {
  titulo: string;
  autor?: string;
  /** /mp3/rytmos/<archivo>.mp3 */
  src: string;
};

export type Mencion = {
  tipo: "premio" | "festival" | "prensa";
  /** Medio, festival o premio. */
  nombre: string;
  /** Categoría, cita o detalle. */
  detalle?: string;
  url?: string;
};

export type Rytmos = {
  id: "rytmos";
  /** Nombre exacto de la serie, como se escribe en texto. */
  nombre: string;
  /** Logo de la serie, SVG o PNG con transparencia. Sin esto el hero compone
      el nombre en la tipografía de PLAY. */
  logo?: { src: string; ancho: number; alto: number };
  tagline?: string;
  sinopsisCorta?: string;
  sinopsisLarga?: string;
  genero: string[];
  /** "+16", "ATP"… */
  clasificacion?: string;
  temporada?: number;
  episodios?: number;
  /** Duración de cada episodio: "30 min". */
  duracionEpisodio?: string;
  /** Fecha y hora de estreno en ISO 8601 con zona: "2027-03-14T21:00:00-03:00".
      Con fecha, el hero lleva cuenta regresiva hasta ese momento. */
  estreno?: string;
  creditos: { rol: string; nombre: string }[];
  elenco: Persona[];
  listaEpisodios: Episodio[];
  /** Tráiler: un video de YouTube o un archivo propio en /video/rytmos/. */
  trailer?: { ytId: string } | { src: string; subtitulos?: string; duracion?: string };
  /** Key art apaisado, sin texto. Es el fondo del hero y el LCP de la home. */
  keyArt?: Imagen;
  /** Versión vertical del key art para teléfonos (9:16). Sin ella, el
      teléfono recorta el centro del apaisado y pierde casi tres cuartos. */
  keyArtVertical?: Imagen;
  /** Loop de fondo del hero (MP4 H.264, mudo, ≤ 3 MB). Solo se carga después
      del key art y nunca con movimiento reducido. */
  loop?: string;
  /** Afiche 16:9 para la tarjeta del catálogo (/images/series/…). */
  poster?: string;
  /** Pieza para compartir 1200×630. */
  share?: string;
  galeria: Imagen[];
  bandaSonora: Tema[];
  /** Si la serie gira alrededor de la música: la banda sonora pasa a ser
      protagonista (sube en la página y crece). Solo con confirmación. */
  musicaProtagonista: boolean;
  /** Casting abierto. La home lo anuncia mientras la fecha no pasó (se
      decide al construir: después de la fecha, un deploy lo retira). */
  casting?: { fecha: string; titulo: string; detalle: string; lugar: string; href: string };
  /** Equipo de la convocatoria, con su Instagram. Sin `rol`, no se inventa. */
  equipo: { nombre: string; rol?: string; instagram: string; foto?: string; principal?: boolean }[];
  prensa: Mencion[];
};

export const RYTMOS: Rytmos = {
  id: "rytmos",
  /* Así lo escribe el logo entregado. */
  nombre: "RYTMOS",
  /* El hero lo anima en 3D desde app/components/rytmos/logo-trazos.ts, que
     es este mismo archivo partido por letra. */
  logo: { src: "/images/rytmos/rytmos-logo.svg", ancho: 266.5, alto: 41.982 },
  /* Del afiche oficial del casting. */
  tagline: "Para escapar del infierno tenés que atravesarlo.",
  /* TODO-CONTENIDO: sinopsis corta (una línea) y larga (un párrafo). */
  sinopsisCorta: undefined,
  sinopsisLarga: undefined,
  /* TODO-CONTENIDO: género. */
  genero: [],
  /* TODO-CONTENIDO: clasificación. */
  clasificacion: undefined,
  /* TODO-CONTENIDO: temporada, cantidad y duración de episodios. */
  temporada: undefined,
  episodios: undefined,
  duracionEpisodio: undefined,
  /* TODO-CONTENIDO: fecha de estreno. */
  estreno: undefined,
  /* TODO-CONTENIDO: creación, dirección, guion. */
  creditos: [],
  /* TODO-CONTENIDO: elenco y personajes, con foto. */
  elenco: [],
  /* TODO-CONTENIDO: títulos y descripciones de episodios. */
  listaEpisodios: [],
  /* TODO-CONTENIDO: tráiler. */
  trailer: undefined,
  /* TODO-CONTENIDO: key art. */
  keyArt: undefined,
  /* TODO-CONTENIDO: key art vertical (opcional, muy recomendado). */
  keyArtVertical: undefined,
  /* TODO-CONTENIDO: loop de video para el hero (opcional). */
  loop: undefined,
  /* TODO-CONTENIDO: afiche 16:9 de la tarjeta. */
  poster: undefined,
  /* TODO-CONTENIDO: pieza para compartir (sale sola del key art). */
  share: undefined,
  /* TODO-CONTENIDO: stills y fotos de rodaje. */
  galeria: [],
  /* TODO-CONTENIDO: música original, si existe. */
  bandaSonora: [],
  /* TODO-CONTENIDO: confirmar si la serie gira alrededor de la música. */
  musicaProtagonista: false,
  /* El afiche: lunes 23/11, 15 hs, Parque Centenario. */
  casting: {
    fecha: "2026-11-23T15:00:00-03:00",
    titulo: "Casting abierto",
    detalle: "Lun 23/11 · 15 hs",
    lugar: "Parque Centenario",
    href: "/casting/",
  },
  /* Fotos: las de perfil de Instagram (public/images/rytmos/equipo/). */
  equipo: [
    { nombre: "Lucas Ariel Manzano", rol: "Creador", instagram: "hivrido.product.x1_ok", foto: "/images/rytmos/equipo/lucas-manzano.webp", principal: true },
    /* Así escribe su nombre en Instagram, con tilde. */
    { nombre: "Leandro Domé", rol: "Cofundador", instagram: "leandro_dome", foto: "/images/rytmos/equipo/leandro-dome.webp" },
    { nombre: "Joaquín Pramori", rol: "Logística & eventos", instagram: "jokospramori", foto: "/images/rytmos/equipo/joaquin-pramori.webp" },
    /* Zurdosound es su nombre artístico (ver app/lib/artistas.ts). */
    { nombre: "Alan Ezequiel Mendoza", rol: "Postproducción, filmación y contenidos", instagram: "zurdosound", foto: "/images/rytmos/equipo/zurdosound.webp" },
    { nombre: "Malena Luchetti", rol: "Dirección de casting", instagram: "malenaluchetti", foto: "/images/rytmos/equipo/malena-luchetti.webp" },
  ],
  /* TODO-CONTENIDO: premios, festivales o prensa, solo si existen. */
  prensa: [],
};

/** Ruta de la ficha de la serie en el catálogo. */
export const RYTMOS_FICHA = "/play/rytmos/";

/** Mensaje de "Avisame": la frase del encargo y, entre paréntesis, de dónde
    se tocó, para saber en el chat qué botón funcionó. */
export const avisameRytmos = (origen: string) =>
  `Hola Hivrido! Avisame cuando se estrene ${RYTMOS.nombre} en PLAY (${origen}).`;

/** Hay ficha técnica para mostrar: algo más que el nombre. */
export const tieneFicha = (r: Rytmos = RYTMOS) =>
  !!(r.sinopsisLarga || r.sinopsisCorta || r.creditos.length || r.genero.length || r.temporada || r.episodios || r.clasificacion);

/** "Temporada 1 · 8 episodios · 30 min", con lo que haya. */
export function lineaTemporada(r: Rytmos = RYTMOS) {
  const partes = [
    r.temporada ? `Temporada ${r.temporada}` : "",
    r.episodios ? `${r.episodios} episodio${r.episodios === 1 ? "" : "s"}` : "",
    r.duracionEpisodio ?? "",
  ].filter(Boolean);
  return partes.join(" · ");
}

/** El estado que dice el badge del hero: con estreno ya pasado, "Estreno". */
export function estadoRytmos(r: Rytmos = RYTMOS, ahora = Date.now()) {
  if (r.estreno && Date.parse(r.estreno) <= ahora) return "Estreno";
  return "Próximamente";
}

/** El casting a anunciar, si todavía no pasó (se evalúa al construir). */
export function castingAbierto(r: Rytmos = RYTMOS, ahora = Date.now()) {
  return r.casting && Date.parse(r.casting.fecha) > ahora ? r.casting : undefined;
}

/** Variantes generadas por scripts/build-rytmos-images.mjs. */
export const ANCHOS = [640, 1080, 1600, 2400] as const;
export const srcsetDe = (base: string, formato: "avif" | "webp", hasta = 2400) =>
  ANCHOS.filter((w) => w <= hasta).map((w) => `${base}-${w}.${formato} ${w}w`).join(", ");
