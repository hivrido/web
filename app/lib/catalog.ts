/**
 * Catálogo de Hivrido PLAY.
 *
 * Fuente única de los títulos: la usan la portada, el schema.org y cualquier
 * pantalla que liste contenido. Antes cada sección de la página tenía su
 * propio array y el mismo título aparecía con datos distintos en cada uno —El
 * Docke era "Drama · Thriller" en el slider y "Documental" tres secciones más
 * abajo—, así que las secciones ahora se derivan de esta lista y no al revés.
 *
 * `type` es lo que decide en qué fila entra cada ficha. No es cosmético: es la
 * diferencia entre una serie y una película, y de ahí sale también el tipo de
 * schema.org que se emite (TVSeries / Movie).
 *
 * `isPlaceholder` marca las fichas cargadas sin datos reales todavía. Esas van
 * sin `rating` a propósito: un puntaje inventado en un catálogo es peor que un
 * campo vacío. La portada tampoco se inventa —sin `poster` la tarjeta cae al
 * degradado de la casa—; las que faltan están listadas en PORTADAS.md.
 */

export type ContentType = "serie" | "pelicula";

export type Title = {
  /** Slug estable: identifica la ficha y sirve de key en las listas. */
  id: string;
  title: string;
  type: ContentType;
  /** Series: "T1 · 2024". Películas: el año solo. */
  year: string;
  genre: string;
  synopsis: string;
  /** Vacío mientras no haya puntaje real. */
  rating?: string;
  badge?: string;
  /** Portada propia. Sin esto, la tarjeta usa el degradado de la casa. */
  poster?: string;
  /** Página propia dentro del sitio, si la tiene. */
  href?: string;
  /** Trailer en YouTube, si lo hay. */
  ytId?: string;
  /** Solo películas. */
  duration?: string;
  /** Solo series. */
  seasons?: string;
  /** Fondo del slider destacado. */
  hero?: { image: string; color: string };
  /** Datos provisorios, pendientes de completar. */
  isPlaceholder?: boolean;
};

export const CATALOG: Title[] = [
  /* ── SERIES ─────────────────────────────────────────────────────────── */
  {
    id: "el-docke",
    title: "El Docke",
    type: "serie",
    year: "T1 · 2024",
    seasons: "1 temporada",
    genre: "Drama · Thriller",
    synopsis:
      "Una historia de amistad, códigos y traición, en medio de la vida delictiva en el conurbano bonaerense.",
    rating: "8.4",
    ytId: "GowGLVO0KHI",
    badge: "SERIE",
    poster: "/images/series/eldocke.jpg",
    hero: { image: "/images/hero/eldocke.jpg", color: "#9D5FFF" },
  },
  {
    id: "session-one",
    title: "Session One",
    type: "serie",
    year: "T1 · 2024",
    seasons: "1 temporada",
    genre: "Thriller · Drama",
    synopsis:
      "¿Qué estás dispuesto a hacer si se te presenta la oportunidad de cambiar tu pobre vida para siempre?",
    rating: "8.7",
    ytId: "2KooNsJQsxw",
    badge: "SERIE",
    poster: "/images/series/sessionone.webp",
    hero: { image: "/images/hero/sessionone.jpg", color: "#FF5F9F" },
  },
  {
    id: "okupas",
    title: "Okupas",
    type: "serie",
    year: "T1 · 2000",
    seasons: "1 temporada",
    genre: "Drama",
    synopsis:
      "Cuatro pibes ocupan una casa abandonada en el centro de Buenos Aires. El retrato más honesto y brutal de una generación.",
    rating: "9.2",
    badge: "SERIE",
    poster: "/images/okupas/okupas-home.webp",
    href: "/okupas",
  },
  {
    id: "el-monarco",
    title: "El Monarco",
    type: "serie",
    year: "T1 · 2026",
    seasons: "1 temporada",
    genre: "Drama",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    badge: "SERIE",
    isPlaceholder: true,
  },
  {
    id: "insomnio",
    title: "Insomnio",
    type: "serie",
    year: "T1 · 2026",
    seasons: "1 temporada",
    genre: "Thriller",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    badge: "SERIE",
    isPlaceholder: true,
  },
  {
    id: "haters",
    title: "Haters",
    type: "serie",
    year: "T1 · 2026",
    seasons: "1 temporada",
    genre: "Drama",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    badge: "SERIE",
    isPlaceholder: true,
  },
  {
    id: "hackers",
    title: "Hackers",
    type: "serie",
    year: "T1 · 2026",
    seasons: "1 temporada",
    genre: "Thriller",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    badge: "SERIE",
    isPlaceholder: true,
  },
  {
    id: "alma",
    title: "Alma",
    type: "serie",
    year: "T1 · 2026",
    seasons: "1 temporada",
    genre: "Drama",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    badge: "SERIE",
    isPlaceholder: true,
  },

  /* ── PELÍCULAS ──────────────────────────────────────────────────────── */
  {
    id: "chamame",
    title: "Chamamé",
    type: "pelicula",
    year: "2024",
    duration: "58m",
    genre: "Neo Western · Acción · Drama",
    synopsis: "Un salvaje ajuste de cuentas entre dos piratas del asfalto.",
    rating: "9.1",
    ytId: "OgghHzx3axk",
    hero: { image: "/images/hero/chamame.jpg", color: "#5F9FFF" },
  },
  {
    /* Todavía no existía en el sitio: entra como ficha nueva, no como rescate
       de una vieja. Los datos son provisorios. */
    id: "el-cambio",
    title: "El Cambio",
    type: "pelicula",
    year: "2026",
    duration: "—",
    genre: "Drama",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    isPlaceholder: true,
  },
  {
    id: "atomico-82",
    title: "Atómico 82",
    type: "pelicula",
    year: "2026",
    duration: "—",
    genre: "Drama",
    synopsis: "Sinopsis provisoria. Pendiente de completar con el material definitivo.",
    badge: "NEW",
    isPlaceholder: true,
  },
];

export const SERIES = CATALOG.filter((t) => t.type === "serie");
export const PELICULAS = CATALOG.filter((t) => t.type === "pelicula");

/** Slider de portada: solo fichas con trailer y arte propio. */
export const FEATURED = CATALOG.filter((t) => t.hero && t.ytId);
