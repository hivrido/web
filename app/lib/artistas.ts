/**
 * Roster de artistas de Hivrido.
 *
 * Fuente única de la vitrina: la usan el índice de /artistas, cada ficha y el
 * schema.org que se emite. Mismo criterio que `catalog.ts` —dato real o campo
 * vacío, nunca relleno inventado—, y acá pesa más todavía: una discografía
 * imaginaria en la página de un artista no es un placeholder feo, es una
 * mentira sobre la carrera de una persona.
 *
 * Por eso los arrays arrancan vacíos y la ficha tiene estados honestos para
 * cada uno. `enConstruccion` no oculta la página: la marca —con el texto de
 * lo que viene, que no es el mismo para un músico que para una creadora de
 * reels— y el módulo que no tiene material dice que no lo tiene en vez de
 * fabricarlo.
 *
 * `acento` es lo que hace que esto escale a más artistas sin que la sección
 * se vuelva una plantilla: la estructura, la tipografía y el negro son de la
 * casa; el color propio entra en micro-dosis —una línea, un número, un
 * subrayado— y alcanza para que dos fichas no se confundan entre sí.
 */

export type TipoEnlace =
  | "instagram"
  | "youtube"
  | "soundcloud"
  | "spotify"
  | "tiktok"
  | "threads";

export type Enlace = {
  tipo: TipoEnlace;
  /** Handle o nombre visible, sin la arroba. */
  handle: string;
  href: string;
};

export type TipoLanzamiento = "videoclip" | "single" | "album" | "reel";

export type Lanzamiento = {
  /** Slug estable: sirve de key y de ancla. */
  id: string;
  titulo: string;
  tipo: TipoLanzamiento;
  /** Vacío mientras no haya fecha confirmada. */
  year?: string;
  /** Featuring, productor o DJ, tal como figura en el crédito. */
  con?: string;
  /** YouTube. Es también de donde sale la portada del bloque. */
  ytId?: string;
  /**
   * Número público de la pieza, con su unidad ("386 K vistas"). Existe porque
   * en un reel el dato *es* la obra: un clip sin una cifra al lado no dice
   * nada, y la cifra es lo que una marca mira. Vacío si no hay medición.
   */
  dato?: string;
};

/** Métrica pública verificable. Nada de números redondeados para arriba. */
export type Metrica = {
  valor: string;
  label: string;
  /** Dónde se puede comprobar. */
  fuente: string;
};

export type Artista = {
  /** Slug estable: es la URL de la ficha. */
  slug: string;
  /** Nombre artístico, el que va en grande. */
  nombre: string;
  /** Cómo lo llama su audiencia. */
  alias: string;
  /** Una línea. La que resume la carrera, no la que describe la página. */
  tagline: string;
  /** Lo que hace, en orden de peso. Alimenta el ticker y el schema.org. */
  disciplinas: string[];
  /**
   * Qué entidad declara el schema.org. Un proyecto musical es un
   * `MusicGroup` y acepta `genre`; una creadora de contenido es una `Person`
   * y no: marcarla como banda le enseña a Google algo falso sobre ella.
   */
  schema: "MusicGroup" | "Person";
  /**
   * El oficio, en singular y como lo diría una persona ("Creadora de
   * contenido"). Va al `jobTitle` del schema de una `Person`: ahí no sirve
   * la primera disciplina —"Humor" no es un cargo— y es lo que Google usa
   * para rotular a alguien.
   */
  rol?: string;
  /** Identidad propia dentro del sistema. Ver nota de cabecera. */
  acento: { hex: string; suave: string };
  /**
   * La única pieza gráfica de la ficha, dibujada en CSS. `forma` elige la
   * figura y `leyenda` es lo que va grabado en ella. Es lo que impide que
   * dos fichas sin fotos se vean iguales.
   */
  emblema: { forma: "capsula" | "reel"; leyenda: string };
  /**
   * El concepto de la carrera, en párrafos. Es dirección creativa, no bio:
   * dice qué es el proyecto, no dónde nació el artista. Los datos personales
   * entran cuando el artista los da, no antes.
   */
  manifiesto: string[];
  /**
   * Las tres o cuatro ideas que ordenan el universo visual y de contenido.
   * Es lo que se le muestra a una marca que pregunta "¿y esto qué es?".
   */
  ejes: { titulo: string; texto: string }[];
  enlaces: Enlace[];
  metricas: Metrica[];
  lanzamientos: Lanzamiento[];
  /**
   * Cómo se llama el módulo de obra. Un músico lista lanzamientos; una
   * creadora de reels no "lanza" nada, publica. Vacío usa el de la casa.
   */
  obra?: { eyebrow: string; titulo: string };
  /** `id` del lanzamiento que abre la ficha. Sin esto el hero va tipográfico. */
  destacado?: string;
  /**
   * Ficha abierta: el texto de lo que está en producción y todavía no salió.
   * Va por artista porque lo que viene no es lo mismo en cada carrera, y
   * prometer "temas y videoclips" a quien hace humor es prometer de más.
   */
  enConstruccion?: string;
};

export const ARTISTAS: Artista[] = [
  {
    slug: "amplax",
    nombre: "Amplax 10 mg",
    alias: "El Charlyy",
    tagline: "La dosis exacta entre la risa y la pista.",
    disciplinas: ["Música", "RKT", "Humor", "Performance", "Contenido"],
    schema: "MusicGroup",
    /* Lima clínica: es el color de una cápsula, no un neón de moda. Entra
       solo en líneas y cifras — el 95% de la ficha sigue siendo negro. */
    /* El color es del artista, no de la sección: solo se pinta dentro de lo
       que le pertenece —su tarjeta en el índice y su ficha—. El magenta de
       ARTISTAS lo pone `--art-marca` y no se toca desde acá. */
    acento: { hex: "#CDF564", suave: "rgba(205, 245, 100, 0.14)" },
    emblema: { forma: "capsula", leyenda: "10 MG" },
    manifiesto: [
      "Amplax 10 mg es el nombre de un ansiolítico. Charly se lo puso a su proyecto, y ahí quedó dicho todo: lo que hace es una dosis. No dos carreras en paralelo —el que hace reír y el que hace bailar— sino una sola receta con dos formas de tomarla.",
      "El humor y la cumbia trabajan igual. Los dos agarran la ansiedad de un miércoles cualquiera y la sacan del cuerpo en noventa segundos. Uno lo hace por la risa, el otro por la cadera. El efecto es el mismo y el que lo administra también.",
      "Hivrido no viene a corregirle el rumbo. Viene a darle a eso una casa, un catálogo y una URL: convertir un feed que funciona en una carrera que se puede mostrar, contratar y medir.",
    ],
    ejes: [
      {
        titulo: "Una sola persona, dos formatos",
        texto:
          "El personaje no cambia cuando pasa del reel al videoclip. Misma voz, mismo timing, mismo descaro. Lo que cambia es la duración de la dosis.",
      },
      {
        titulo: "El chiste es la puerta, la música es la casa",
        texto:
          "El humor trae a la gente y no pide nada a cambio. La música es lo que hace que se queden, lo que se comparte en una previa y lo que sostiene una fecha.",
      },
      {
        titulo: "Todo se produce, nada se improvisa",
        texto:
          "Que se sienta espontáneo es una decisión de producción, no la ausencia de una. Guion, dirección y post están aunque no se vean.",
      },
      {
        titulo: "De la pantalla al escenario",
        texto:
          "Una audiencia que mira es una audiencia que todavía no pagó una entrada. El objetivo del sistema es que ese salto ocurra.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "amplax10mg",
        href: "https://www.instagram.com/amplax10mg/",
      },
      /* El canal, no el video. Este módulo lista dónde vive el artista, así
         que cada fila tiene que llamarse como él y llevar a su casa en esa
         plataforma: acá decía "La Fina" —el nombre de un tema— y apuntaba al
         watch de ese clip. Además es lo que alimenta el `sameAs` del
         schema.org, que ata perfiles a una entidad; un video suelto ahí no
         ata nada. El clip sigue donde corresponde, en `lanzamientos`. */
      {
        tipo: "youtube",
        handle: "Amplax10mg",
        href: "https://www.youtube.com/@Amplax10mg",
      },
      {
        tipo: "soundcloud",
        handle: "mc-amplax",
        href: "https://soundcloud.com/mc-amplax",
      },
      {
        tipo: "threads",
        handle: "amplax10mg",
        href: "https://www.threads.net/@amplax10mg",
      },
    ],
    /* Lo único que hoy es público y comprobable. Cuando haya datos de
       reproducciones o de fecha, entran acá con su fuente. */
    metricas: [
      {
        valor: "11,6 K",
        label: "Seguidores en Instagram",
        fuente: "@amplax10mg",
      },
      {
        valor: "Diario",
        label: "Frecuencia de publicación",
        fuente: "Reels",
      },
    ],
    lanzamientos: [
      {
        id: "la-fina",
        titulo: "La Fina",
        tipo: "videoclip",
        con: "DJ Cofla",
        ytId: "sGd3CrSPdOE",
      },
    ],
    destacado: "la-fina",
    enConstruccion:
      "El catálogo está abierto. Los próximos lanzamientos —temas, videoclips y piezas de contenido— se suman a esta página a medida que salen.",
  },

  {
    slug: "kareen-nahirr",
    nombre: "Kareen Nahirr",
    alias: "ŁaMazBerraka",
    tagline: "Dos millones y medio de personas por mes, desde José C. Paz.",
    disciplinas: ["Humor", "Reels", "Actuación", "Contenido", "Performance"],
    /* No es una banda: es una creadora. El schema lo dice así. */
    schema: "Person",
    rol: "Creadora de contenido",
    /* Cian de pantalla encendida. Elegido por distancia: tiene que separarse
       del magenta de la sección y de la lima de Amplax para que dos fichas
       seguidas no se lean como la misma plantilla. */
    acento: { hex: "#22E1FF", suave: "rgba(34, 225, 255, 0.14)" },
    /* El encuadre vertical del teléfono con la cifra del mes grabada: el
       formato y el número son, literalmente, de lo que se trata. */
    emblema: { forma: "reel", leyenda: "2,53 M" },
    manifiesto: [
      "El mes pasado la vieron 2,53 millones de personas. La siguen 14.993. Esa distancia es todo lo que hay que entender de este proyecto: lo que hace viaja mucho más lejos que la estructura que tiene para recibirlo.",
      "Lo que hace es humor de barrio con forma de reel. POV de pibardo y milipili, la salida del tango, la vuelta del boliche, la reacción al comentario que se le fue de mano. José C. Paz no es el decorado: es el idioma. Y la cuenta no improvisa —hay un personaje sostenido, un timing propio y la decisión de cortar justo donde el que mira comenta.",
      "Hivrido no viene a suavizarle el tono ni a enseñarle a hacer virales: ya los hace. Viene a construir el lugar donde caen esos dos millones —una ficha, un contacto profesional, un media kit con los números reales— para que el alcance deje de evaporarse y empiece a facturar.",
    ],
    ejes: [
      {
        titulo: "El alcance ya existe, falta dónde aterrizar",
        texto:
          "El 92,4% de las vistas son de gente que no la sigue. El trabajo no es conseguir más ojos: es que los que ya están encuentren algo cuando llegan.",
      },
      {
        titulo: "El barrio es el formato, no el tema",
        texto:
          "Cumbia, RKT y código de José C. Paz. No es una estética prestada para un público: es de donde sale el chiste, y por eso el chiste llega.",
      },
      {
        titulo: "Series, no piezas sueltas",
        texto:
          "Parte uno y parte dos. El corte a mitad del sketch es lo que convierte a un espectador en alguien que comenta, comparte y vuelve.",
      },
      {
        titulo: "La marca entra adentro del chiste",
        texto:
          "Un aviso leído al final rompe el formato. El POV y la serie aguantan una marca dentro de la escena, con el mismo tono y la misma voz.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "kareen_nahirr",
        href: "https://www.instagram.com/kareen_nahirr/",
      },
      {
        tipo: "tiktok",
        handle: "karen.nahir6",
        href: "https://www.tiktok.com/@karen.nahir6",
      },
    ],
    /* Datos del panel profesional de la cuenta, relevados el 22/09/2026. Se
       publican con el recorte y la fecha porque una métrica sin ventana no
       es una métrica: es una foto vieja esperando envejecer sola. */
    metricas: [
      {
        valor: "2,53 M",
        label: "Visualizaciones en 30 días",
        fuente: "Panel @kareen_nahirr · 22/09/2026",
      },
      {
        valor: "92,4 %",
        label: "Vistas de gente que todavía no la sigue",
        fuente: "Panel @kareen_nahirr · 30 días",
      },
      {
        valor: "265 K",
        label: "Interacciones en 30 días",
        fuente: "Panel @kareen_nahirr · 30 días",
      },
      {
        valor: "386 K",
        label: "Vistas de su reel más visto",
        fuente: "Reel POV · abril 2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que ya se viralizó" },
    /* Sin `ytId`: los reels viven en Instagram y no hay copia en YouTube que
       embeber. La ficha lo resuelve sola —sin video destacado el módulo va
       entero a la grilla— y cada pieza se sostiene con su cifra. */
    lanzamientos: [
      {
        id: "pov-pibardo-milipili",
        titulo: "POV: pibardo y milipili",
        tipo: "reel",
        year: "2026",
        dato: "386 K vistas · 33,9 K me gusta · 3,6 K compartidos",
      },
      {
        id: "a-la-salida-del-tango",
        titulo: "A la salida del tango",
        tipo: "reel",
        year: "2026",
        dato: "134 K vistas · 3,3 K me gusta",
      },
      {
        id: "sketch-jcp",
        titulo: "Sketch en José C. Paz",
        tipo: "reel",
        year: "2026",
        dato: "72,9 K vistas · 4,9 K me gusta",
      },
    ],
    enConstruccion:
      "Está en producción el primer ciclo con Hivrido: formatos de marca integrada sobre el POV y la serie por partes, y el salto del reel a la cámara.",
  },
];

/** Ficha por slug. `undefined` si no existe: la ruta responde 404. */
export function getArtista(slug: string): Artista | undefined {
  return ARTISTAS.find((a) => a.slug === slug);
}

/** Portada de un lanzamiento. Sale de YouTube: no hay arte propio todavía. */
export function portadaDe(l: Lanzamiento): string | undefined {
  return l.ytId ? `https://i.ytimg.com/vi/${l.ytId}/maxresdefault.jpg` : undefined;
}
