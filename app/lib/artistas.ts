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
 * cada uno. `enConstruccion` no oculta la página: la marca, y el módulo que
 * no tiene material dice que no lo tiene en vez de fabricarlo.
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

export type TipoLanzamiento = "videoclip" | "single" | "album";

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
  /** Identidad propia dentro del sistema. Ver nota de cabecera. */
  acento: { hex: string; suave: string };
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
  /** `id` del lanzamiento que abre la ficha. Sin esto el hero va tipográfico. */
  destacado?: string;
  /** Ficha abierta: hay material en producción todavía sin publicar. */
  enConstruccion?: boolean;
};

export const ARTISTAS: Artista[] = [
  {
    slug: "amplax",
    nombre: "Amplax 10 mg",
    alias: "El Charlyy",
    tagline: "La dosis exacta entre la risa y la pista.",
    disciplinas: ["Música", "RKT", "Humor", "Performance", "Contenido"],
    /* Lima clínica: es el color de una cápsula, no un neón de moda. Entra
       solo en líneas y cifras — el 95% de la ficha sigue siendo negro. */
    acento: { hex: "#CDF564", suave: "rgba(205, 245, 100, 0.14)" },
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
      {
        tipo: "youtube",
        handle: "La Fina",
        href: "https://www.youtube.com/watch?v=sGd3CrSPdOE",
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
        valor: "11,4 K",
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
    enConstruccion: true,
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
