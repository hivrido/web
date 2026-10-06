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

/** Datos extendidos de la ficha: créditos, elenco, relatos, premios. */
export type Detail = {
  /** Texto largo de la página; la sinopsis corta queda para la tarjeta. */
  about: string;
  /** Rótulo del formato: "Largometraje", "Cortometraje"… */
  format: string;
  /** Advertencia de contenido, si la obra la pide. */
  advisory?: string;
  crew: { role: string; name: string }[];
  cast: { name: string; character?: string }[];
  /** Antologías: los relatos que la componen, sin spoilers. */
  chapters?: { title: string; theme: string; text: string }[];
  awards?: { label: string; name: string; detail: string }[];
  /** Videos además del principal (`ytId`): teasers, adelantos, extras. */
  videos?: { ytId: string; label: string; zoom?: number }[];
  /** Nota que acompaña a los premios, si se refieren a una parte de la obra. */
  awardsNote?: string;
};

export type Title = {
  /** Slug estable: identifica la ficha y sirve de key en las listas. */
  id: string;
  title: string;
  type: ContentType;
  /** Series: "T1 · 2024". Películas: el año solo. Sin dato confirmado, se omite. */
  year?: string;
  genre: string;
  synopsis: string;
  /** Vacío mientras no haya puntaje real. */
  rating?: string;
  badge?: string;
  /** Portada propia. Sin esto, la tarjeta usa el degradado de la casa. */
  poster?: string;
  /** Ficha propia. Por defecto /play/<id>; solo se declara si vive en otra
      ruta (Okupas, que tiene su página con los episodios). */
  href?: string;
  /** Trailer en YouTube, si lo hay. */
  ytId?: string;
  /** Ampliación del video para recortar sus franjas negras (1 = sin recorte).
      Se mide sobre la miniatura de YouTube: es la proporción entre el cuadro
      16:9 y la imagen útil. */
  ytZoom?: number;
  /** El video de `ytId` es la obra completa, no un tráiler. */
  ytFull?: boolean;
  /** YouTube no deja embeberlo (restricción de edad): se abre allá. */
  ytExternal?: boolean;
  /** Solo películas. */
  duration?: string;
  /** Solo series. */
  seasons?: string;
  /** Fondo del slider destacado. */
  hero?: { image: string; color: string };
  /** Llamado propio de la ficha, debajo de la sinopsis (p. ej. el casting). */
  cta?: { label: string; href: string };
  /** Datos provisorios, pendientes de completar. */
  isPlaceholder?: boolean;
  detail?: Detail;
};

const TITLES: Title[] = [
  /* ── SERIES ─────────────────────────────────────────────────────────── */
  {
    /* La producción en curso, por eso abre la fila. No lleva `isPlaceholder`:
       tiene afiche propio y una sinopsis apoyada en lo que el casting ya
       publica —el conurbano, los cuatro pibes—, no en un plot inventado, así
       que puede viajar al schema.org. Sin `rating` porque todavía no hay
       nada que puntuar, y sin `ytId` porque no hay tráiler: eso la deja
       fuera del slider, que pide `hero` y `ytId`. */
    id: "cuchillo-paz",
    title: "Cuchillo Paz",
    type: "serie",
    year: "T1 · 2026",
    seasons: "1 temporada",
    genre: "Drama",
    synopsis:
      "Cuatro pibes del conurbano, una loma al atardecer y todo lo que no se dicen. Primera temporada en producción, con elenco salido del casting abierto.",
    badge: "PRONTO",
    /* Pieza propia, no el afiche de /casting: ese es 2:3 y la tarjeta es
       16:9, así que al recortarlo se perdía la mitad del título. La genera
       scripts/build-casting-assets.mjs desde el mismo máster. */
    poster: "/images/series/cuchillo-paz.webp",
    /* La serie se está armando con el casting abierto: la ficha lleva ahí. */
    cta: { label: "Sumate al casting", href: "/casting" },
  },
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
    poster: "/images/series/elmonarco.jpg",
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
    /* Alianza con Nicolás "Niky" Galliano (Casa Nostra Films). Datos del
       dossier de prensa; sin `year` (el dossier no lo cierra) ni `rating`
       porque no hay puntaje real. La portada 16:9 sirve de tarjeta y de fondo. */
    id: "erase-una-vez-en-virreyes",
    title: "Érase una vez en Virreyes",
    type: "pelicula",
    duration: "89m",
    genre: "Drama social · Antología",
    synopsis:
      "Cinco historias, un mismo barrio. En Virreyes, la violencia no toca la puerta: ya vive adentro. Escrita y dirigida por Nicolás Galliano. +18.",
    ytId: "crEni6LKPWs",
    ytExternal: true,
    badge: "NUEVA",
    poster: "/images/peliculas/virreyes.webp",
    hero: { image: "/images/peliculas/virreyes.webp", color: "#D1202A" },
    /* Créditos de IMDb (tt36097002) cruzados con el dossier: IMDb trae los
       personajes, el dossier el resto del elenco. Los relatos van con la
       sinopsis corta del dossier, no con el tratamiento, que tiene spoilers. */
    detail: {
      format: "Largometraje · Antología en cinco relatos",
      about:
        "Frente a cámara, un periodista relata los hechos que sacuden a Virreyes, una localidad humilde de la zona norte del Gran Buenos Aires. Su voz enhebra cinco historias independientes: un joven desesperado por sacar a su madre de la pobreza, una adolescente que carga con su casa y con el acoso escolar, una ex pareja atrapada en lo que quedó de un amor tóxico, una mujer acomodada que desprecia el barrio al que acaba de mudarse y dos amigos frente a un crimen que ya no tiene vuelta atrás.",
      advisory:
        "Violencia explícita, violencia sexual, suicidio y consumo de drogas. Solo para mayores de 18 años.",
      crew: [
        { role: "Guion y dirección", name: "Nicolás Galliano" },
        { role: "Producción", name: "Nicolás Galliano" },
        { role: "Fotografía", name: "Vince Ruberto" },
        { role: "Productora", name: "Casa Nostra Films" },
      ],
      cast: [
        { name: "Gregorio Barrios", character: "Cristian" },
        { name: "Sol Borinelli" },
        { name: "Tomás De Raco" },
        { name: "Lugo Angel", character: "Momia" },
        { name: "José Triana" },
      ],
      chapters: [
        { title: "Bailando con el diablo", theme: "Capitalismo", text: "Cristian, 19 años y sin trabajo, acepta la iniciación de una banda del barrio a cambio de dinero fácil." },
        { title: "Lolita revancha", theme: "Bullying", text: "Lolita sostiene su casa sola mientras dos compañeras convierten la escuela en su infierno." },
        { title: "Andrómeda", theme: "Relaciones tóxicas", text: "Ana empieza de nuevo. Matías no puede soltar." },
        { title: "Chimba", theme: "Discriminación", text: "Una pareja recién llegada, un jardinero bajo sospecha y un asalto comandado por alguien a quien nadie conoce." },
        { title: "Colapso", theme: "Violencia de género", text: "Esteban le pide ayuda a su mejor amigo después de una noche que terminó en lo peor." },
      ],
      awardsNote:
        "Recorrido de Bailando con el diablo, el primer relato, filmado como pieza piloto.",
      awards: [
        { label: "Mejor guion original", name: "Festival RENUAC", detail: "2.ª edición" },
        { label: "Mejor dirección", name: "Festival RENUAC", detail: "2.ª edición" },
        { label: "Award winner", name: "Festival RENUAC", detail: "2.ª edición" },
        { label: "Selección oficial", name: "Festival RENUAC Chile", detail: "2024" },
        { label: "Selección oficial", name: "Premios Masho", detail: "Cartago, Costa Rica · 2025" },
        { label: "Selección oficial", name: "Lift-Off Filmmaker Sessions", detail: "2024" },
        { label: "Selección oficial", name: "La Voz de la Infancia", detail: "Ciclo de cortometrajes · 2025" },
      ],
    },
  },
  {
    /* Galliano. Sinopsis del propio autor; sin `year` ni `duration`
       confirmados. Portada: título sobre humo azul. */
    id: "3-am",
    title: "3 A.M.",
    type: "pelicula",
    duration: "—",
    genre: "Terror · Suspenso",
    synopsis:
      "Una joven empieza su nuevo empleo en una estación de servicio y, para pagar su derecho de piso, la mandan al turno noche. Una sola advertencia tiene que respetar: no atender el teléfono a las 3 AM.",
    ytId: "2kaHwNUudbY",
    ytZoom: 1.25,
    badge: "NUEVA",
    poster: "/images/peliculas/3am.webp",
    hero: { image: "/images/peliculas/3am.webp", color: "#B3121B" },
    /* Elenco de IMDb (tt17516144), que no carga personajes. */
    detail: {
      format: "Cortometraje",
      about:
        "Una joven empieza su nuevo empleo en una estación de servicio y, para pagar su derecho de piso, la mandan a trabajar en el turno noche. Le dan una sola advertencia, y tiene que respetarla: no atender el teléfono a las 3 AM.",
      crew: [
        { role: "Guion y dirección", name: "Nicolás Galliano" },
        { role: "Arte", name: "Héctor Cañas" },
      ],
      cast: [
        { name: "Diego Alonso Gómez" },
        { name: "Fabio Di Tomaso" },
        { name: "Micol Estévez" },
        { name: "Esteban Prol" },
        { name: "Gonzalo Quintana" },
        { name: "Pato Sloomant" },
        { name: "Solange Verina" },
      ],
    },
  },
  {
    /* Guion de Galliano, que además protagoniza; dirige Nicolás Ríos. Créditos
       de IMDb (tt15863326) completados con la descripción del video. El video
       es el corto entero, por eso `ytFull`. Sin sinopsis de trama publicada:
       no se inventa una. */
    id: "esnob",
    title: "Esnob",
    type: "pelicula",
    duration: "8m",
    genre: "Terror",
    synopsis:
      "Cortometraje de terror inspirado en hechos reales. Con Magui Bravi y Nicolás Galliano, dirigido por Nicolás Ríos.",
    ytId: "ui2zbEBJDFc",
    ytZoom: 1.25,
    ytFull: true,
    badge: "NUEVA",
    poster: "/images/peliculas/esnob.webp",
    hero: { image: "/images/peliculas/esnob.webp", color: "#B01E2A" },
    detail: {
      format: "Cortometraje",
      about:
        "Un cortometraje de terror inspirado en hechos reales, escrito por Nicolás Galliano y dirigido por Nicolás Ríos. Producción de Insurrectas Producciones, protagonizado por Magui Bravi y el propio Galliano.",
      crew: [
        { role: "Dirección", name: "Nicolás Ríos" },
        { role: "Guion", name: "Nicolás Galliano" },
        { role: "Producción", name: "Nicolás Galliano, Nicolás Ríos, Magui Bravi" },
        { role: "Fotografía", name: "Juan F. López, Tomás Musto" },
        { role: "Edición", name: "Gian Blanco" },
        { role: "Sonido", name: "Antonella Criscione" },
        { role: "Arte", name: "Héctor Cañas" },
        { role: "Vestuario", name: "Amida Quintana Gómez" },
        { role: "Maquillaje y FX", name: "Cynthia Romero" },
        { role: "Música original", name: "Formas Anónimas" },
        { role: "Productora", name: "Insurrectas Producciones" },
      ],
      cast: [
        { name: "Magui Bravi", character: "Lucía López" },
        { name: "Nicolás Galliano", character: "Nahuel Garrido" },
        { name: "Soledad Borinelli" },
      ],
    },
  },
  {
    /* Ópera prima de Galliano en el largo. Elenco y duración de IMDb
       (tt36091082); sinopsis de la prensa del estreno (cinenacional,
       escribiendocine). IMDb la clasifica como comedia, pero la obra arranca
       como historia de amor y vira al terror con humor negro. */
    id: "el-rectangulo-de-angeles",
    title: "El rectángulo de Ángeles",
    type: "pelicula",
    duration: "1h 13m",
    genre: "Terror · Humor negro",
    synopsis:
      "Nina y Rafa son una típica pareja porteña. Una invitación a cenar en un restorán glamoroso puede cambiarles la vida: ahí, salir con vida depende de una sola cosa, el rectángulo de ángeles.",
    ytId: "-vNXLP9y0cE",
    ytZoom: 1.34,
    badge: "NUEVA",
    poster: "/images/peliculas/rectangulo.webp",
    hero: { image: "/images/peliculas/rectangulo.webp", color: "#C8102E" },
    detail: {
      format: "Largometraje",
      about:
        "Nina y Rafa se aman a pesar de sus diferencias y luchan por mantener viva la relación. Rafa milita en un partido de izquierda hasta los fines de semana; Nina trabaja casi todo el día en una fábrica y le reclama más tiempo juntos. Una invitación a cenar en un restorán glamoroso lo cambia todo. Lo que empieza como una historia de amor se vuelve un relato de suspenso y terror, con elementos de gore, policial y humor negro. Filmada íntegramente en Gualeguay, Entre Ríos, se estrenó en el Cine Gaumont y recorrió salas de todo el país.",
      crew: [
        { role: "Guion y dirección", name: "Nicolás Galliano" },
        { role: "Producción", name: "Nicolás Galliano" },
        { role: "Rodaje", name: "Gualeguay, Entre Ríos" },
      ],
      cast: [
        { name: "Ailín Salas", character: "Nina" },
        { name: "Nicolás Goldschmidt", character: "Rafa" },
        { name: "Leticia Brédice", character: "Ana" },
        { name: "Diego Alonso Gómez", character: "Luis" },
        { name: "Daniel Pacheco Bautista", character: "Eric" },
      ],
    },
  },
  {
    /* Secuela de Hungry (2020). Elenco de IMDb (tt21102264) con los
       personajes y el equipo de la descripción del video, que es el corto
       entero. Premios: los laureles de la portada. Sin sinopsis de trama
       publicada: va la bajada del afiche. */
    id: "matanza",
    title: "Matanza (Hungry 2)",
    type: "pelicula",
    duration: "11m",
    genre: "Terror",
    synopsis:
      "Cuando el apetito se vuelve violencia. La segunda entrega de Hungry, escrita y dirigida por Nicolás Galliano.",
    ytId: "qsDqrhUNEss",
    ytZoom: 1.25,
    ytFull: true,
    badge: "NUEVA",
    poster: "/images/peliculas/matanza.webp",
    hero: { image: "/images/peliculas/matanza.webp", color: "#B8860B" },
    detail: {
      format: "Cortometraje",
      about:
        "Cuando el apetito se vuelve violencia. Matanza retoma el universo de Hungry, el corto con el que Nicolás Galliano entró al terror en 2020, con un elenco encabezado por Mariano De La Canal, Ignacio Toselli, Marina Glezer y Nicolás Pauls. Una producción de Insurrectas Producciones.",
      crew: [
        { role: "Guion y dirección", name: "Nicolás Galliano" },
        { role: "Dirección de arte", name: "Nicolás Galliano" },
        { role: "Producción", name: "Florencia Scorza, Nicolás Ríos" },
        { role: "Fotografía", name: "Juan F. López, Tomás Musto" },
        { role: "Asistencia de dirección", name: "Nicolás Ríos" },
        { role: "Sonido", name: "Martín Galimany" },
        { role: "Maquillaje y FX", name: "Cynthia Romero, Maru Alegre" },
        { role: "Vestuario", name: "Kahlu Orellana" },
        { role: "Música", name: "Muerto en Pogo, Motosierra" },
        { role: "Productora", name: "Insurrectas Producciones" },
      ],
      cast: [
        { name: "Mariano De La Canal", character: "Daniel, «el Papi»" },
        { name: "Ignacio Toselli", character: "Rodrigo" },
        { name: "Marina Glezer", character: "Patri" },
        { name: "Nicolás Pauls", character: "Oficial Lázaro" },
        { name: "Xxl Irione", character: "Cristian, el cartero" },
        { name: "Catalina Vela", character: "Martirio" },
        { name: "Clara Circovich", character: "Aberración" },
        { name: "Carmela Mosano Lugrin", character: "Calamidad" },
      ],
      awards: [
        { label: "Muestra nacional", name: "Festival 1000 Gritos", detail: "16.ª edición · 2022" },
        { label: "Selección oficial", name: "Insólito Fest", detail: "Perú · 2022" },
        { label: "Selección oficial", name: "Lift-Off First-Time Filmmaker Sessions", detail: "Lift-Off Global Network" },
      ],
      videos: [{ ytId: "QKOy2yrY65U", label: "Teaser" }],
    },
  },
  {
    /* Homenaje a Pulp Fiction —el video se titula "Mia (Pulp Fiction 2)"—.
       Elenco y personajes de IMDb (tt17515854), equipo de la descripción del
       video, que es el corto entero. Sin sinopsis de trama publicada: va la
       bajada del afiche. */
    id: "mia",
    title: "Mia",
    type: "pelicula",
    duration: "11m",
    genre: "Policial",
    synopsis:
      "Una mujer. Un pasado. Más de un secreto. Un homenaje a Pulp Fiction escrito y dirigido por Nicolás Galliano.",
    ytId: "WthK3XKvDIQ",
    ytFull: true,
    badge: "NUEVA",
    poster: "/images/peliculas/mia.webp",
    hero: { image: "/images/peliculas/mia.webp", color: "#E0A818" },
    detail: {
      format: "Cortometraje",
      about:
        "Una mujer. Un pasado. Más de un secreto. Nicolás Galliano lleva a Buenos Aires a Mia, el personaje de Pulp Fiction, en un policial con Malena Luchetti, Micol Estévez y la participación de Pablo Alarcón. Con música de Loquero. Una producción de Insurrectas Producciones.",
      crew: [
        { role: "Guion y dirección", name: "Nicolás Galliano" },
        { role: "Fotografía y cámara", name: "Flope Velozo" },
        { role: "Dirección de arte", name: "Canarius Beta" },
        { role: "Arte", name: "Héctor Cañas" },
        { role: "Sonido", name: "Luciérnaga Sonido" },
        { role: "Montaje", name: "Mile Szapiro" },
        { role: "Asistencia de dirección", name: "Santiago F. Grassi" },
        { role: "Maquillaje", name: "Lourdes Vázquez" },
        { role: "Música", name: "Loquero" },
        { role: "Productora", name: "Insurrectas Producciones" },
      ],
      cast: [
        { name: "Malena Luchetti", character: "Mia" },
        { name: "Micol Estévez", character: "Roma" },
        { name: "Pablo Alarcón", character: "Marcelo" },
      ],
      awards: [
        { label: "Selección oficial", name: "Festival de Cine Independiente Argentino", detail: "Argentina" },
      ],
    },
  },
  {
    /* Dirige Galliano sobre guion de Maxi Velloso; la produce Lara Torres, que
       además actúa (IMDb la lista invertida, "Torres Lara"). Elenco y equipo de
       IMDb y de la descripción del teaser. Sin sinopsis de trama publicada: va
       la bajada del afiche, y el laurel de Sitges sale del afiche también. */
    id: "el-armario-de-dani",
    title: "El armario de Dani",
    type: "pelicula",
    duration: "—",
    genre: "Terror",
    synopsis:
      "Algunos secretos no deberían ser descubiertos. Un cortometraje de terror dirigido por Nicolás Galliano.",
    ytId: "jlgGNrOl3yA",
    ytZoom: 1.25,
    badge: "NUEVA",
    poster: "/images/peliculas/armario-de-dani.webp",
    hero: { image: "/images/peliculas/armario-de-dani.webp", color: "#D0141E" },
    detail: {
      format: "Cortometraje",
      about:
        "Algunos secretos no deberían ser descubiertos. Un cortometraje de terror escrito por Maxi Velloso y dirigido por Nicolás Galliano, producido por Lara Torres, con Luciano Cazaux como Dani.",
      crew: [
        { role: "Dirección", name: "Nicolás Galliano" },
        { role: "Guion", name: "Maxi Velloso" },
        { role: "Producción", name: "Lara Torres" },
        { role: "Fotografía", name: "Leo Belletti" },
        { role: "Productora", name: "Insurrectas Producciones" },
      ],
      cast: [
        { name: "Luciano Cazaux", character: "Dani" },
        { name: "Lara Torres", character: "Helena" },
        { name: "Camilo Villate", character: "Dani adolescente" },
      ],
      awards: [
        { label: "Sección oficial", name: "Sitges · Brigadoon", detail: "2022" },
      ],
    },
  },
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
    poster: "/images/peliculas/chamame.jpeg",
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
    badge: "NUEVA",
    isPlaceholder: true,
  },
];

/**
 * Toda obra tiene ficha y todo lleva a ella: las tarjetas y el slider no
 * reproducen nada por su cuenta. La ficha es donde está todo —video, sinopsis,
 * créditos—, así que acá se le asigna su ruta a cada título.
 */
export const CATALOG: (Title & { href: string })[] = TITLES.map((t) => ({
  ...t,
  href: t.href ?? `/play/${t.id}`,
}));

/** Títulos cuya ficha es la página genérica /play/<id>. */
export const WITH_PAGE = CATALOG.filter((t) => t.href === `/play/${t.id}`);

export const SERIES = CATALOG.filter((t) => t.type === "serie");
export const PELICULAS = CATALOG.filter((t) => t.type === "pelicula");

/** Slider de portada: solo fichas con trailer y arte propio. */
export const FEATURED = CATALOG.filter((t) => t.hero && t.ytId);
