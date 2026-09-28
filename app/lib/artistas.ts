import type { CSSProperties } from "react";

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
  | "threads"
  | "facebook"
  | "kick";

export type Enlace = {
  tipo: TipoEnlace;
  /** Handle o nombre visible, sin la arroba. */
  handle: string;
  href: string;
};

export type TipoLanzamiento = "videoclip" | "single" | "album" | "reel" | "clip" | "documental";

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
  /**
   * Identidad propia dentro del sistema. Ver nota de cabecera.
   *
   * `tomaLaMarca` hace que el color del artista reemplace también al magenta
   * de la sección en todo lo suyo —su tarjeta y su página—: el degradado de
   * los títulos, el aire del fondo y los rosas de la nebulosa. Es para un
   * artista cuyo color convive mal con el magenta al lado, no un atajo para
   * teñir más.
   */
  acento: { hex: string; suave: string; tomaLaMarca?: boolean };
  /**
   * La única pieza gráfica de la ficha, dibujada en CSS. `forma` elige la
   * figura y `leyenda` es lo que va grabado en ella. Es lo que impide que
   * dos fichas sin fotos se vean iguales.
   */
  emblema: {
    forma: "capsula" | "reel" | "junta" | "camara" | "stream" | "onda" | "claqueta" | "antena" | "parlante" | "partitura";
    leyenda: string;
  };
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
  /**
   * Slugs de los artistas con los que comparte escena. El roster no es una
   * lista de contratos sueltos: dos de estos tres publican juntos, y una
   * ficha que no lo dice desperdicia la prueba más fuerte que tiene —que
   * acá hay un universo y no tres carpetas—. Se declara en los dos lados,
   * a mano y no por inferencia: colaborar una vez no es compartir escena.
   */
  universo?: string[];
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
        valor: "12 K",
        label: "Seguidores en Instagram",
        fuente: "Perfil @amplax10mg · 27/09/2026",
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
    universo: ["kareen-nahirr", "jairito-veras"],
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
    /* El violeta de Hivrido: es el color que la representa. El tono que
       pinta —rótulos, filo, relleno del botón— es #A78BFA, el violeta claro
       de la casa, porque sobre él va texto oscuro y como texto va sobre
       negro: el #7C3AED no llega al AA en ninguno de los dos casos. El halo
       sí es el #7C3AED, que es donde el violeta profundo se luce. Toma la
       marca: un violeta con el magenta de la sección al lado se lee rosa, y
       en lo suyo no queda nada rosa. */
    acento: { hex: "#A78BFA", suave: "rgba(124, 58, 237, 0.18)", tomaLaMarca: true },
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
    universo: ["amplax"],
  },

  {
    slug: "jairito-veras",
    nombre: "Jairito Veras",
    /* "Jairo Vera" es un cantante con carrera propia y gana en cualquier
       buscador: el nombre de la ficha arranca del handle del artista para no
       competir contra alguien que no es él. */
    alias: "El de la junta",
    tagline: "El amigo que todos etiquetan.",
    disciplinas: ["Humor", "Reels", "Elenco", "Contenido", "Performance"],
    schema: "Person",
    rol: "Creador de contenido",
    /* Cian de pantalla. Queda a la máxima distancia de los otros tres tonos
       en juego —el magenta de la casa, la lima de Amplax, el violeta de
       Kareen—: con tres fichas en el índice, el color es lo primero que
       distingue una de otra antes de que se lea un nombre. */
    acento: { hex: "#22E1FF", suave: "rgba(34, 225, 255, 0.14)" },
    /* Tres aros cruzados: la junta. Es literalmente el argumento —nunca
       aparece solo— y la única figura del set que no habla de una persona. */
    emblema: { forma: "junta", leyenda: "2,04 M" },
    manifiesto: [
      "En los últimos treinta días lo vieron 2.042.356 veces. Lo siguen 4.941 personas. Entraron a su perfil 1.563, y tocaron el link 2. No es un problema de talento ni de alcance: es que no hay nada del otro lado.",
      "Lo que hace es humor de junta. El amigo envidioso, el gobernado, el fantasma, el que te pide plata, el que no sabe disimular: cada reel es alguien que el que mira conoce, y por eso termina etiquetado. No trabaja solo frente a cámara. Es parte de un elenco que se repite entre cuentas y se reconoce de un video al otro.",
      "Hivrido no viene a sacarlo del grupo ni a inventarle un personaje. Viene a darle nombre, ficha y un contacto: que los dos millones que lo ven cada mes sepan quién es, y que el que quiera trabajar con él lo encuentre.",
    ],
    ejes: [
      {
        titulo: "La junta es el formato",
        texto:
          "El chiste funciona porque detrás hay un grupo real. No se reemplaza por un monólogo a cámara: se dirige, se produce y se sostiene como elenco.",
      },
      {
        titulo: "Todos tienen un amigo así",
        texto:
          "«Tu amigo el ___» no es una frase, es un catálogo. Cada arquetipo nuevo es una pieza que la audiencia distribuye sola, etiquetando.",
      },
      {
        titulo: "De co-autor a autor",
        texto:
          "Hoy el alcance vive en cuentas ajenas. El trabajo es que cada colaboración deje algo en casa: nombre, seguidores y un lugar adonde volver.",
      },
      {
        titulo: "La marca es un amigo más",
        texto:
          "Una marca no interrumpe la junta, se sienta en ella. El arquetipo y el «etiquetá a ese amigo» aguantan una integración con la misma voz.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "jairitoveras3279",
        href: "https://www.instagram.com/jairitoveras3279/",
      },
    ],
    metricas: [
      {
        valor: "2,04 M",
        label: "Visualizaciones en 30 días",
        fuente: "Panel @jairitoveras3279 · 22/09/2026",
      },
      {
        valor: "97,6 %",
        label: "Vistas de gente que todavía no lo sigue",
        fuente: "Panel @jairitoveras3279 · 30 días",
      },
      {
        valor: "210 K",
        label: "Interacciones en 30 días",
        fuente: "Panel @jairitoveras3279 · 30 días",
      },
      {
        valor: "9,4 M",
        label: "Vistas en 45 reels en 100 días",
        fuente: "Reels · jun–sep 2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que la gente etiquetó" },
    /* Los tres son colaborativos y salieron publicados desde la cuenta del
       co-autor, así que `con` lleva de quién es el posteo. Sin ese crédito
       la cifra se leería como tráfico propio y no lo es: es exactamente lo
       que la ficha se propone cambiar, y decirlo mal acá sería vender humo
       a la marca que viene a mirar los números. */
    lanzamientos: [
      {
        id: "carrera-de-flash",
        titulo: "Carrera de flash",
        tipo: "reel",
        year: "2026",
        con: "@emii_chede",
        dato: "822 K vistas · 110 K me gusta · 6,1 K compartidos",
      },
      {
        id: "cuando-hay-amistad-se-nota",
        titulo: "Cuando hay amistad se nota",
        tipo: "reel",
        year: "2026",
        con: "@amplax10mg",
        dato: "782 K vistas · 62,1 K me gusta · 3,1 K compartidos",
      },
      {
        id: "la-unica-amiga-del-grupo",
        titulo: "Cuando sos la única amiga del grupo",
        tipo: "reel",
        year: "2026",
        con: "@amplax10mg",
        dato: "667 K vistas · 36,9 K me gusta · 6 K compartidos",
      },
    ],
    enConstruccion:
      "Está en producción el primer ciclo con Hivrido: una serie propia de arquetipos de amigo, formatos de marca integrada dentro de la junta y el cruce con el universo de Amplax 10 mg.",
    universo: ["amplax", "kareen-nahirr"],
  },

  {
    slug: "enzo-arancibia",
    nombre: "Enzo Arancibia",
    alias: "Enzo en la cámara",
    tagline: "Un millón y medio de vistas dando una vuelta por José C. Paz.",
    disciplinas: ["Humor", "Reels", "POV", "Contenido", "Performance"],
    schema: "Person",
    rol: "Creador de contenido",
    /* Ámbar. El único cálido que quedaba libre en el roster —lima, violeta y
       cian ya tienen dueño— y el que mejor dice "luz de cámara encendida".
       Es claro a propósito: va como texto sobre negro y como relleno bajo
       texto oscuro, y los dos pasan el AA. */
    acento: { hex: "#F5B942", suave: "rgba(245, 185, 66, 0.14)" },
    /* El visor con el REC encendido: "Enzo en la cámara" dibujado, con la
       cifra de su reel más visto grabada abajo. */
    emblema: { forma: "camara", leyenda: "1,5 M" },
    /* Sale de su perfil público y de la grilla de reels, relevados el
       23/09/2026. La bio también nombra a su familia: eso es suyo y no entra
       en una ficha profesional. */
    manifiesto: [
      "Su reel más visto lo vieron un millón y medio de personas. Lo siguen 6.854. Esa distancia es el proyecto entero: lo que hace sale del barrio y llega lejísimo, y cuando la gente vuelve a buscarlo no encuentra dónde quedarse.",
      "Lo que hace es humor de barrio en primera persona. POV de salir a dar una vuelta por José C. Paz, el amigo que nunca se lo arranca, el que es re tóxico, el que pregunta si ella es tu novia. La calle, la plaza y los pibes no son escenografía: son el elenco, y por eso el que mira se reconoce.",
      "Hivrido no viene a sacarlo de la esquina ni a cambiarle el tono. Viene a ponerle nombre, ficha y contacto a un alcance que ya tiene: que el próximo millón sepa quién es Enzo y que la marca que quiera estar ahí sepa cómo llegar.",
    ],
    ejes: [
      {
        titulo: "La calle es el set",
        texto:
          "José C. Paz no es el fondo del video, es el idioma. Cada vuelta por el barrio es una locación que la audiencia reconoce antes de que empiece el chiste.",
      },
      {
        titulo: "Todos tienen un amigo así",
        texto:
          "El que nunca se lo arranca, el tóxico, el que tiene hambre. El POV del amigo es un catálogo infinito, y cada arquetipo es una pieza que la gente etiqueta sola.",
      },
      {
        titulo: "Del pico al hábito",
        texto:
          "Dos reels pasaron el millón y varios los cien mil. El trabajo es que esos picos dejen de ser golpes de suerte y se vuelvan una serie con cita fija.",
      },
      {
        titulo: "La marca entra a la vuelta",
        texto:
          "Una marca no corta el POV, camina adentro de él. El barrio y la junta aguantan una integración con la misma voz, sin aviso leído al final.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "enzo_arancibia14",
        href: "https://www.instagram.com/enzo_arancibia14/",
      },
      {
        tipo: "facebook",
        handle: "enzodaniel",
        href: "https://www.facebook.com/enzodaniel",
      },
      {
        tipo: "threads",
        handle: "enzo_arancibia14",
        href: "https://www.threads.net/@enzo_arancibia14",
      },
    ],
    /* Del perfil y de la grilla públicos, no de un panel: sin acceso a sus
       estadísticas no hay alcance mensual ni interacciones, y no se estiman.
       Lo que sí se publica es cuenta hecha sobre lo visible: las vistas de
       los últimos 24 reels, sumadas una por una. Si mañana alguien las
       vuelve a contar, tienen que dar lo mismo. */
    metricas: [
      {
        valor: "4,28 M",
        label: "Vistas sumadas de sus últimos 24 reels",
        fuente: "Grilla de reels @enzo_arancibia14 · 23/09/2026",
      },
      {
        valor: "7 de 24",
        label: "Reels que pasaron las 100 K vistas",
        fuente: "Grilla de reels · 23/09/2026",
      },
      {
        valor: "1,5 M",
        label: "Vistas de su reel más visto",
        fuente: "Reel «Pov: salís a dar una vuelta por J.C.P»",
      },
      {
        valor: "219×",
        label: "Su reel más visto contra la cantidad de seguidores",
        fuente: "1,5 M vistas / 6.854 seguidores",
      },
      {
        valor: "6.994",
        label: "Seguidores en Instagram",
        fuente: "Perfil @enzo_arancibia14 · 27/09/2026",
      },
      {
        valor: "465",
        label: "Publicaciones en Instagram",
        fuente: "Perfil @enzo_arancibia14 · 27/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que dio la vuelta" },
    /* Sin `year`: la grilla no muestra fechas y no se adivinan. Sin `ytId`:
       los reels viven en Instagram, cada pieza se sostiene con su cifra. */
    lanzamientos: [
      {
        id: "vuelta-por-jcp",
        titulo: "Pov: salís a dar una vuelta por J.C.P",
        tipo: "reel",
        dato: "1,5 M vistas",
      },
      {
        id: "tenes-un-mejor-amigo",
        titulo: "Pov: tenés un mejor amigo",
        tipo: "reel",
        dato: "791 K vistas",
      },
      {
        id: "amigo-ella-es-tu-novia",
        titulo: "Amigo, ¿ella es tu novia?",
        tipo: "reel",
        dato: "192 K vistas",
      },
    ],
    enConstruccion:
      "Está en producción el primer ciclo con Hivrido: una serie propia de vueltas por el barrio, el catálogo de amigos en formato serie y las primeras integraciones de marca dentro del POV.",
  },

  {
    slug: "nahuel-m17",
    /* Sin apellido: el perfil no lo da y no se completa. El nombre de la
       ficha es el de sus dos cuentas —@nahuel.m17 y kick.com/nahuelm17—, que
       es como lo busca quien ya lo vio en vivo. */
    nombre: "Nahuel M17",
    /* El nombre visible de su Instagram. No es invento de la casa: es como
       firma él. */
    alias: "0:55",
    tagline: "Todos los días en vivo. Lo mejor queda en clip.",
    disciplinas: ["Streaming", "Gaming", "IRL", "Clips", "Contenido"],
    schema: "Person",
    rol: "Streamer",
    /* Blanco hielo: la luz de una pantalla encendida en un cuarto a oscuras.
       Tuvo verde menta, pero el verde pasó a Kevo Kbron y dos verdes en el
       índice se confunden. Es el único tono neutro del roster, así que no
       pisa a nadie. */
    acento: { hex: "#DCE4F0", suave: "rgba(220, 228, 240, 0.12)" },
    /* La pantalla apaisada con el EN VIVO encendido y el chat corriendo: el
       único formato del roster que no es vertical. La leyenda es su nombre
       visible, que en una pantalla se lee como el reloj del stream. */
    emblema: { forma: "stream", leyenda: "0:55" },
    /* Sale de su perfil de Instagram y de su canal de Kick, relevados el
       25/09/2026. Nada de cifras de alcance: no las hay públicas, y las
       que hay son chicas. Esta ficha no vende un número, vende un hábito.
       Del canal queda afuera a propósito la categoría de casino: Hivrido no
       arma el perfil de un artista sobre apuestas. */
    manifiesto: [
      "Nahuel prende la cámara todos los días. Juega, charla, sale a la calle con el celular en la mano y deja que el chat decida para dónde va la noche. Lo que en otro formato sería un guion, en el suyo es una conversación de varias horas con gente que vuelve.",
      "El stream es la materia prima e Instagram es la vidriera: de cada transmisión salen los mejores momentos, cortados para que el que no estuvo en vivo se entere de lo que se perdió. Counter-Strike, Free Fire, Minecraft, terror con Phasmophobia, charla e IRL. Cambia el juego; el que habla es el mismo.",
      "Hivrido llega temprano, y a propósito. No viene a inflar números que todavía no existen: viene a darle a un streamer que ya tiene la constancia lo que le falta alrededor —dirección, edición, una ficha que lo presente y un contacto profesional— para que cada vivo deje más que un recuerdo en el chat.",
    ],
    ejes: [
      {
        titulo: "La constancia es el capital",
        texto:
          "Stream todos los días. En un formato donde la audiencia se arma por hábito, estar a la hora de siempre vale más que cualquier golpe de suerte.",
      },
      {
        titulo: "Del vivo al clip",
        texto:
          "Horas de transmisión se vuelven segundos que viajan. El recorte es lo que lleva el stream a quien nunca lo abrió, y la vuelta del clip al canal es el crecimiento.",
      },
      {
        titulo: "El juego cambia, la voz no",
        texto:
          "Del shooter al terror, del Minecraft a la calle. Lo que la gente sigue no es un título: es cómo lo vive él, y eso viaja de un juego al otro.",
      },
      {
        titulo: "La marca entra al chat",
        texto:
          "Un vivo largo aguanta una marca dentro de la charla y del juego, no un banner pegado al costado. Es la integración más directa que tiene el formato.",
      },
    ],
    enlaces: [
      {
        tipo: "kick",
        handle: "nahuelm17",
        href: "https://kick.com/nahuelm17",
      },
      {
        tipo: "instagram",
        handle: "nahuel.m17",
        href: "https://www.instagram.com/nahuel.m17/",
      },
    ],
    /* De los perfiles públicos, sin panel. Van las cifras tal como están, por
       chicas que sean: son la línea de base contra la que se va a medir el
       primer ciclo, y una base inflada arruina la comparación. */
    metricas: [
      {
        valor: "Diario",
        label: "Frecuencia de stream",
        fuente: "Bio @nahuel.m17 · 25/09/2026",
      },
      {
        valor: "Afiliado",
        label: "Canal con suscripciones activas en Kick",
        fuente: "kick.com/nahuelm17 · 25/09/2026",
      },
      {
        valor: "214",
        label: "Seguidores en Kick",
        fuente: "kick.com/nahuelm17 · 25/09/2026",
      },
      {
        valor: "404",
        label: "Seguidores en Instagram",
        fuente: "Perfil @nahuel.m17 · 27/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que salió del vivo" },
    /* Sin `dato`: no hay cifra pública que valga la pena al lado de cada
       pieza. Los clips de Kick con más vistas son de casino y no entran; los
       que quedan se listan por lo que son, con el juego en el crédito. */
    lanzamientos: [
      {
        id: "paciencia-de-mi-papa",
        titulo: "Poniendo a prueba la paciencia de mi papá",
        tipo: "reel",
        year: "2026",
      },
      {
        id: "tengo-que-revisar-bien",
        titulo: "Tengo que revisar bien",
        tipo: "clip",
        year: "2026",
        con: "Counter-Strike 2",
      },
      {
        id: "y-ese-tiro",
        titulo: "¿Y ese tiro?",
        tipo: "clip",
        year: "2026",
        con: "Roblox",
      },
    ],
    enConstruccion:
      "Está en producción el primer ciclo con Hivrido: edición de los mejores momentos de cada stream, una grilla de horarios fija y el paso del vivo a formatos cortos pensados para crecer fuera del canal.",
  },
  {
    slug: "nicolas",
    /* Confirmado con él: Nicolas, como firma su Instagram, sin tilde. El
       "alejandroo" del handle no es su nombre y la ficha no lo usa como tal.
       Sin apellido hasta que lo dé. */
    nombre: "Nicolas",
    alias: "@_alejandroo.okk_",
    tagline: "Lo que escribe, antes de que suene.",
    disciplinas: ["Influencer", "Composición", "Música", "Contenido"],
    schema: "Person",
    rol: "Influencer y compositor",
    /* Violeta eléctrico, el que él eligió. Más saturado y corrido al
       púrpura que la lavanda de Kareen, que no se toca; sin `tomaLaMarca`,
       así el magenta de la casa lo separa de ella en el índice. Pasa el AA
       como texto sobre negro. */
    acento: { hex: "#B36CFF", suave: "rgba(179, 108, 255, 0.16)" },
    /* Una onda de sonido: la canción antes de ser video. Es la primera figura
       del roster que habla de lo que se escucha y no de lo que se mira. */
    emblema: { forma: "onda", leyenda: "OKK" },
    /* Relevado el 27/09/2026. El reel del Día del Padre (20/06/2026) es su
       pieza viral: 234 K me gusta y 268 comentarios, públicos. Sus
       reproducciones no se leen sin sesión: van cuando él pase la cifra
       del panel, no antes. */
    manifiesto: [
      "Nicolas es primero una presencia: su reel del Día del Padre juntó más de 234 mil me gusta, y casi cinco mil personas lo siguen con apenas seis publicaciones. La gente no está ahí por el volumen de lo que sube, está por quién es.",
      "Y además escribe canciones. Esa audiencia es la que va a estar esperando cuando salgan.",
      "Hivrido no viene a fabricarle un catálogo. Viene a darle a lo que compone un lugar donde vivir —una ficha, un contacto profesional, una producción a la altura— para que cada tema que salga encuentre a esa audiencia esperándolo.",
    ],
    ejes: [
      {
        titulo: "La canción primero",
        texto:
          "El contenido acompaña a la música, no la reemplaza. Cada pieza en redes es una puerta a algo que se escucha entero.",
      },
      {
        titulo: "Poco y con peso",
        texto:
          "Seis publicaciones sostienen casi cinco mil seguidores. No hace falta subir todos los días: hace falta que cada salida valga.",
      },
      {
        titulo: "Del autor a la voz",
        texto:
          "Quien escribe también puede ser la cara. El trabajo es que la canción y la persona se reconozcan como una sola cosa.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "_alejandroo.okk_",
        href: "https://www.instagram.com/_alejandroo.okk_/",
      },
    ],
    metricas: [
      {
        valor: "234 K",
        label: "Me gusta en su reel del Día del Padre",
        fuente: "Reel @_alejandroo.okk_ · 27/09/2026",
      },
      {
        valor: "4.758",
        label: "Seguidores en Instagram",
        fuente: "Perfil @_alejandroo.okk_ · 27/09/2026",
      },
      {
        valor: "6",
        label: "Publicaciones en Instagram",
        fuente: "Perfil @_alejandroo.okk_ · 27/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que ya se viralizó" },
    lanzamientos: [
      {
        id: "dia-del-padre",
        titulo: "Día del Padre",
        tipo: "reel",
        year: "2026",
        dato: "234 K me gusta · 268 comentarios",
      },
    ],
    enConstruccion:
      "Está en producción el primer ciclo con Hivrido: sus primeros temas con producción propia, el material audiovisual que los acompaña y la ficha completa con su discografía.",
  },
  {
    slug: "florencia-martinez",
    /* "Florencia Martinez" es como firma su perfil; el handle dice "magalii".
       Hasta que ella confirme nombre artístico y apellido con tilde, la ficha
       usa lo que figura público y no completa nada. */
    nombre: "Florencia Martinez",
    alias: "@magalii845",
    tagline: "Frente a cámara, sea set o pasarela.",
    disciplinas: ["Actuación", "Modelaje", "Arte", "Contenido"],
    schema: "Person",
    rol: "Actriz y modelo",
    /* Azul cielo. El tono libre que queda lejos de todos: frío como el cian
       de Jairito pero más claro y corrido al azul, sin rozar el violeta de
       Kareen ni el magenta de la casa. Pasa el AA como texto sobre negro. */
    acento: { hex: "#7AA8FF", suave: "rgba(122, 168, 255, 0.14)" },
    /* La claqueta: la primera figura del roster que habla del set y de quien
       está delante de la cámara. */
    emblema: { forma: "claqueta", leyenda: "TOMA 1" },
    /* Relevado del perfil público el 26/09/2026: bio "artista, actriz y
       modelaje", seguidores y seguidos. Los reels y el Threads no se
       pudieron leer sin sesión, así que el texto no le atribuye rodajes,
       campañas ni marcas que no estén comprobadas. */
    manifiesto: [
      "Florencia se presenta en tres palabras: artista, actriz y modelo. No es una lista de oficios sueltos, es una misma cosa vista desde tres lugares —la escena, la foto y la pantalla— y en las tres el trabajo es sostener una mirada.",
      "Hivrido no viene a inventarle una trayectoria. Viene a darle un marco profesional a la que está construyendo: una ficha a la altura, material producido con criterio de set y un contacto directo para castings, rodajes y marcas.",
    ],
    ejes: [
      {
        titulo: "La cámara como escenario",
        texto:
          "Actuar y posar piden lo mismo: saber qué ve el lente. Cada pieza se piensa como una toma, no como una foto más.",
      },
      {
        titulo: "Una sola presencia",
        texto:
          "Actriz, modelo y creadora no son tres perfiles. El trabajo es que en cualquier formato se la reconozca a ella.",
      },
      {
        titulo: "Del feed al set",
        texto:
          "Las redes son la vidriera; el destino son los rodajes, las campañas y las producciones de la casa.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "magalii845",
        href: "https://www.instagram.com/magalii845/",
      },
      {
        tipo: "threads",
        handle: "magalii845",
        href: "https://www.threads.net/@magalii845",
      },
    ],
    metricas: [
      {
        valor: "1.646",
        label: "Seguidores en Instagram",
        fuente: "Perfil @magalii845 · 27/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Frente a cámara" },
    /* Vacío a propósito: todavía no hay una pieza verificada para listar. */
    lanzamientos: [],
    enConstruccion:
      "Está en producción el primer ciclo con Hivrido: un book profesional, material de actuación para castings y su primera participación en las producciones de la casa.",
  },

  {
    slug: "kevo-kbron",
    /* Nombre artístico, tal como firma en todas las plataformas. El nombre
       real no es público y no se completa hasta que él lo dé. */
    nombre: "Kevo Kbron",
    alias: "@kevokbron",
    tagline: "Trap y RKT hechos en casa, del beat al video.",
    disciplinas: ["Música", "Trap", "RKT", "Producción musical"],
    schema: "MusicGroup",
    /* Verde, el que él eligió. Un verde pleno, lejos de la lima de Amplax
       por el lado del azul y del cian de Jairito por el del amarillo. Es el
       único verde del roster. Pasa el AA como texto sobre negro. */
    acento: { hex: "#2EE06E", suave: "rgba(46, 224, 110, 0.14)" },
    /* La antena: La Antena Records, el sello con el que produce desde el
       primer videoclip. Es la figura de quien emite desde su barrio. */
    emblema: { forma: "antena", leyenda: "LA ANTENA" },
    /* Relevado el 27/09/2026 de su canal de YouTube (bio, videos, créditos
       de cada descripción), Spotify, Apple Music, TikTok e Instagram. El
       canal enlaza al perfil de Spotify, así que ese catálogo es suyo.
       "José C. Paz" y "La Antena Records" los publica él en la bio del
       canal. Su Instagram anterior era @kevo.kbron. */
    manifiesto: [
      "Kevo Kbron hace trap y RKT desde José C. Paz, y los hace completos: firma los temas, produce los beats junto a La Antena Records y saca cada lanzamiento con su videoclip. Desde 2023 viene sosteniendo un catálogo propio, no un tema suelto.",
      "Su forma de trabajar es la del barrio que se junta: casi cada lanzamiento lleva a alguien más —Golden Monkey, Skinny, Alexis Flp, Fariel— y los videos los filman realizadores de la misma escena. Es un movimiento, no un solista aislado.",
      "Hivrido entra para darle a eso escala: dirección visual, estrategia de lanzamiento y una casa donde el catálogo se pueda escuchar, mostrar y contratar.",
    ],
    ejes: [
      {
        titulo: "Del beat al video",
        texto:
          "Escribe, produce y lanza con imagen. Controlar la cadena entera es lo que le da identidad a cada pieza.",
      },
      {
        titulo: "La escena como sello",
        texto:
          "Los featurings no son invitados de ocasión: son la misma gente, tema tras tema. Esa red es su mejor carta de presentación.",
      },
      {
        titulo: "Lanzar con sistema",
        texto:
          "Cuenta regresiva, estreno, shorts de apoyo: FANÁTICA ya salió así. El paso siguiente es que cada lanzamiento llegue más lejos que el anterior.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "kevokbron",
        href: "https://www.instagram.com/kevokbron/",
      },
      {
        tipo: "youtube",
        handle: "kevokbron",
        href: "https://www.youtube.com/@kevokbron",
      },
      {
        tipo: "spotify",
        handle: "KEVO KBRON",
        href: "https://open.spotify.com/artist/0KQchfhq5jqcFJCYX9Jgwi",
      },
      {
        tipo: "tiktok",
        handle: "kevokbron",
        href: "https://www.tiktok.com/@kevokbron",
      },
      {
        tipo: "threads",
        handle: "kevokbron",
        href: "https://www.threads.net/@kevokbron",
      },
    ],
    metricas: [
      {
        valor: "2.037",
        label: "Seguidores en Instagram",
        fuente: "Perfil @kevokbron · 27/09/2026",
      },
      {
        valor: "727",
        label: "Suscriptores en YouTube",
        fuente: "Canal @kevokbron · 27/09/2026",
      },
      {
        valor: "10,2 K",
        label: "Vistas de DESCONOCERNOS",
        fuente: "YouTube · 27/09/2026",
      },
    ],
    lanzamientos: [
      {
        id: "yo-no-se",
        titulo: "YO NO SÉ",
        tipo: "single",
        year: "2026",
        con: "Alan Torres",
        ytId: "VwkkfCSKnXQ",
      },
      {
        id: "fanatica",
        titulo: "FANÁTICA",
        tipo: "videoclip",
        year: "2026",
        con: "Prod. La Antena Records",
        ytId: "9i83WZ73YLA",
      },
      {
        id: "polari",
        titulo: "POLARI",
        tipo: "single",
        year: "2026",
        con: "Fariel",
        ytId: "O0c_YtIZEQQ",
      },
      {
        id: "un-adios",
        titulo: "UN ADIÓS",
        tipo: "videoclip",
        year: "2024",
        con: "Skinny",
        ytId: "zD2A5OF4i9A",
      },
      {
        id: "desconocernos",
        titulo: "DESCONOCERNOS",
        tipo: "videoclip",
        year: "2024",
        con: "Golden Monkey, Alexis Flp, Facu222",
        ytId: "xgqO8iT-G2U",
        dato: "10,2 K vistas",
      },
      {
        id: "malianteo",
        titulo: "Malianteo",
        tipo: "videoclip",
        year: "2023",
        con: "Golden Monkey, Skinny",
        ytId: "zqI4yypo7yM",
      },
      {
        id: "como-soy",
        titulo: "COMO SOY",
        tipo: "videoclip",
        year: "2023",
        ytId: "0Zb3gNXEYzo",
      },
    ],
    destacado: "fanatica",
    enConstruccion:
      "El catálogo sigue abierto: los próximos lanzamientos con Hivrido se suman a esta página a medida que salen.",
    universo: ["alan-torres", "uriel-g3"],
  },

  {
    slug: "alan-torres",
    nombre: "Alan Torres",
    alias: "@elalantorres_",
    tagline: "El RKT de los millones, ahora con nombre propio.",
    disciplinas: ["Música", "RKT", "Trap", "Performance"],
    schema: "MusicGroup",
    /* Rojo. El rojo pleno del roster, el del perreo y la previa. Queda lejos
       del magenta de la casa por el lado del naranja y lejos del naranja de
       Nicolas por el del rosa. Pasa el AA como texto sobre negro. */
    acento: { hex: "#FF3B55", suave: "rgba(255, 59, 85, 0.14)" },
    /* El parlante: el RKT se mide en bajo. La leyenda es el tema que lo
       puso en millones. */
    emblema: { forma: "parlante", leyenda: "VOL. V" },
    /* Relevado el 27/09/2026 de su canal (@elalantorres_), su Spotify
       —cuyos temas coinciden con los videos: RKT Volumen 5 y 7, Todo el
       Point, Llegó El Verano— y los videos donde participa. Su canal y sus
       videos enlazan al Instagram @elalantorres_, su cuenta principal
       (confirmado que la maneja); @elalantorres_2 es la secundaria. Las
       vistas son de los videos oficiales, no de su canal: se dice de quién
       es cada uno. */
    manifiesto: [
      "Alan Torres está en algunos de los RKT más escuchados de la escena: su verso en RKT Volumen V de Cotto Rng superó los cinco millones de vistas y ROCHOSPORT, con Issa The Kid, pasó los tres millones. El público ya lo escuchó; lo que falta es que lo busque por su nombre.",
      "Suma más de diez millones de vistas entre sus videos, y tiene catálogo propio desde 2022 —BANDIDA RKT, Llegó El Verano, Atrevido Maleducado—. Su red se repite tema a tema: Santo Two en los beats, Rodrii Ortiz, Lalito Aimar, Navaja, Ñero, Luz Eluney y ahora Kevo Kbron.",
      "Hivrido entra para convertir esos featurings en una carrera con centro: lanzamientos propios con dirección visual, estrategia y una casa donde todo eso se encuentre.",
    ],
    ejes: [
      {
        titulo: "Del feat al nombre propio",
        texto:
          "Los millones llegaron en temas de otros. Cada lanzamiento nuevo tiene que llevar esa audiencia a su canal.",
      },
      {
        titulo: "RKT de pista",
        texto:
          "Temas hechos para la previa y el boliche. El formato es corto, directo y para bailar, y así se produce.",
      },
      {
        titulo: "La escena como catálogo",
        texto:
          "Cotto Rng, Issa The Kid, Rodrii Ortiz, Lalito Aimar: su historial es una red de la escena, y esa red es su carta de presentación.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "elalantorres_",
        href: "https://www.instagram.com/elalantorres_/",
      },
      {
        tipo: "instagram",
        handle: "elalantorres_2",
        href: "https://www.instagram.com/elalantorres_2/",
      },
      {
        tipo: "youtube",
        handle: "elalantorres_",
        href: "https://www.youtube.com/@elalantorres_",
      },
      {
        tipo: "spotify",
        handle: "Alan Torres",
        href: "https://open.spotify.com/artist/0WhAfHGmEi2lPelrfzXFh5",
      },
    ],
    metricas: [
      {
        valor: "5,18 M",
        label: "Vistas de RKT Volumen V (Cotto Rng)",
        fuente: "YouTube · Cotto Rng · 27/09/2026",
      },
      {
        valor: "3,01 M",
        label: "Vistas de ROCHOSPORT (Issa The Kid)",
        fuente: "YouTube · Issa The Kid · 27/09/2026",
      },
      {
        valor: "5,6 K",
        label: "Oyentes mensuales en Spotify",
        fuente: "Spotify · 27/09/2026",
      },
      {
        valor: "24 K",
        label: "Seguidores en Instagram",
        fuente: "Perfil @elalantorres_ · 27/09/2026",
      },
    ],
    /* Ordenados por vistas, relevadas el 27/09/2026. Casi todos salieron
       desde el canal del otro artista: `con` dice con quién, y la cifra es
       del video oficial, no del canal de Alan. */
    lanzamientos: [
      {
        id: "rkt-volumen-v",
        titulo: "RKT Volumen V",
        tipo: "videoclip",
        year: "2023",
        con: "Cotto Rng, Papichamp, Rodrii Ortiz",
        ytId: "IQ4XkKd2C1Y",
        dato: "5,18 M vistas",
      },
      {
        id: "rochosport",
        titulo: "ROCHOSPORT",
        tipo: "videoclip",
        year: "2022",
        con: "Issa The Kid, Santo Two",
        ytId: "fCBV3oP4ESM",
        dato: "3,01 M vistas",
      },
      {
        id: "todo-el-point",
        titulo: "TODO EL POINT",
        tipo: "videoclip",
        year: "2022",
        con: "Navaja",
        ytId: "kwVqTdZsVWU",
        dato: "758 K vistas",
      },
      {
        id: "rkt-volumen-7",
        titulo: "RKT Volumen 7",
        tipo: "videoclip",
        year: "2024",
        con: "Cotto Rng, Lalito Aimar, Rossani, Nicky Hg, Panky",
        ytId: "UE_PIEIB87g",
        dato: "501 K vistas",
      },
      {
        id: "exceso-de-facha",
        titulo: "EXCESO DE FACHA",
        tipo: "videoclip",
        year: "2024",
        con: "Luz Eluney, Facu HDR",
        ytId: "9_AY7htbF24",
        dato: "278 K vistas",
      },
      {
        id: "chuleria-en-pote-rmx",
        titulo: "CHULERÍA EN POTE RMX",
        tipo: "videoclip",
        year: "2024",
        con: "Ñero, El Rossani, Nicky HG",
        ytId: "OA2cxZFMwyM",
        dato: "109 K vistas",
      },
      {
        id: "bandida-rkt",
        titulo: "BANDIDA RKT",
        tipo: "videoclip",
        year: "2022",
        con: "Prod. Santo Two",
        ytId: "b8Kb453b7WU",
        dato: "107 K vistas",
      },
      {
        id: "llego-el-verano",
        titulo: "Llegó El Verano",
        tipo: "videoclip",
        year: "2023",
        con: "Rodrii Ortiz",
        ytId: "FquVE09C3Jw",
        dato: "92 K vistas",
      },
      {
        id: "atrevido-maleducado",
        titulo: "Atrevido Maleducado",
        tipo: "videoclip",
        year: "2024",
        con: "Lalito Aimar",
        ytId: "CtzQUfB-aPk",
        dato: "17 K vistas",
      },
      {
        id: "yo-no-se",
        titulo: "YO NO SÉ",
        tipo: "single",
        year: "2026",
        con: "Kevo Kbron",
        ytId: "VwkkfCSKnXQ",
      },
    ],
    destacado: "rkt-volumen-v",
    enConstruccion:
      "Está en producción su primer ciclo con Hivrido: lanzamientos propios con dirección visual y estrategia para llevar a su canal la audiencia de sus featurings.",
    universo: ["kevo-kbron"],
  },

  {
    slug: "uriel-g3",
    nombre: "Uriel G3",
    alias: "@uriiel_g3",
    /* Su bio de Threads, palabra por palabra. */
    tagline: "Providencia al ritmo.",
    disciplinas: ["Composición", "Letra", "Música", "Performance"],
    schema: "Person",
    rol: "Compositor de letra y música",
    /* Naranja neón, el que él eligió. Quedó libre cuando Nicolas pasó a
       violeta: más encendido y rojo que el ámbar de Enzo, lejos del rojo de
       Alan por el lado del amarillo. Pasa el AA como texto sobre negro. */
    acento: { hex: "#FF7A1A", suave: "rgba(255, 122, 26, 0.16)" },
    /* La partitura: el que escribe la letra y la música. Primera figura del
       roster que habla de la canción desde el papel. */
    emblema: { forma: "partitura", leyenda: "G3" },
    /* Relevado el 27/09/2026 de su canal (@Uriel_g3), que enlaza a este
       Instagram, y de su Threads ("Uriel De Jcp", bio "Providencia al
       ritmo."). Sus temas los produce Kevo Kbron con La Antena Records: lo
       dicen las descripciones de los videos. Sin Spotify encontrado; el
       TikTok @uriel_g3 no está enlazado a nada suyo y no entra. */
    manifiesto: [
      "Uriel G3 escribe la letra y hace la música. Viene de José C. Paz y firma con una frase que es un programa entero: providencia al ritmo. Lo que tiene que pasar, pasa a tiempo.",
      "Sus temas salen de La Antena Records, con Kevo Kbron en la producción: la misma escena, el mismo barrio y el mismo estudio. No es un nombre suelto, es la segunda voz de una casa que ya está sonando.",
      "Hivrido entra en el comienzo, que es donde más pesa: darle a lo que escribe una producción a la altura, una imagen propia y un lugar donde cada tema encuentre a quien lo tiene que escuchar.",
    ],
    ejes: [
      {
        titulo: "La canción, de punta a punta",
        texto:
          "Letra y música salen de la misma mano. Eso es lo que hace que un tema suene a alguien y no a una fórmula.",
      },
      {
        titulo: "Providencia al ritmo",
        texto:
          "Su propia consigna: nada forzado, todo a tiempo. Cada lanzamiento sale cuando está listo, no antes.",
      },
      {
        titulo: "Hecho en La Antena",
        texto:
          "Produce con Kevo Kbron desde el primer video. Esa sociedad es su sello, y crece junto con la de él.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "uriiel_g3",
        href: "https://www.instagram.com/uriiel_g3/",
      },
      {
        tipo: "youtube",
        handle: "Uriel_g3",
        href: "https://www.youtube.com/@Uriel_g3",
      },
      {
        tipo: "threads",
        handle: "uriiel_g3",
        href: "https://www.threads.net/@uriiel_g3",
      },
    ],
    metricas: [
      {
        valor: "558",
        label: "Seguidores en Instagram",
        fuente: "Perfil @uriiel_g3 · 27/09/2026",
      },
      {
        valor: "45",
        label: "Suscriptores en YouTube",
        fuente: "Canal @Uriel_g3 · 27/09/2026",
      },
      {
        valor: "3",
        label: "Temas publicados en YouTube",
        fuente: "Canal @Uriel_g3 · 27/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que escribe" },
    lanzamientos: [
      {
        id: "pal-putero",
        titulo: "Pal Putero",
        tipo: "videoclip",
        year: "2026",
        con: "Prod. Kevo Kbron · La Antena Records",
        ytId: "u_PmGUoqyPg",
      },
      {
        id: "volviendo-al-inicio",
        titulo: "Volviendo al inicio",
        tipo: "videoclip",
        year: "2026",
        ytId: "S46f88XEbw8",
      },
      {
        id: "challenge-bandolero",
        titulo: "Challenge Bandolero",
        tipo: "clip",
        year: "2024",
        con: "Prod. Kevo Kbron · La Antena Records",
        ytId: "4iY2Fz2IBHE",
      },
    ],
    destacado: "volviendo-al-inicio",
    enConstruccion:
      "Está en producción su primer ciclo con Hivrido: temas nuevos con La Antena Records, dirección visual para cada lanzamiento y su llegada a las plataformas de streaming.",
    universo: ["kevo-kbron"],
  },
  {
    slug: "fasterdakill",
    /* Nombre artístico tal como firma. El civil —Harol Buleje Bocanegra— lo
       pasó él, pero no va en la ficha hasta que lo autorice. */
    nombre: "Fasterdakill",
    alias: "@fasterdakill",
    tagline: "Rap independiente de Lima, del beat a la mezcla.",
    disciplinas: ["Rap", "Composición", "Beatmaking", "Ingeniería de sonido", "Diseño"],
    schema: "Person",
    rol: "Rapero y productor",
    /* Turquesa menta: más verde y apagado que el cian de Jairito, lejos del
       verde pleno de Kevo. Pasa el AA como texto sobre negro. */
    acento: { hex: "#5EEAD4", suave: "rgba(94, 234, 212, 0.14)" },
    /* El parlante: el que hace el beat, lo graba y lo mezcla. */
    emblema: { forma: "parlante", leyenda: "F2" },
    /* Relevado el 28/09/2026 de su Instagram: bio "Artista Independiente",
       management de @flaviarottella, booking de @f2incorporated y su estudio
       de diseño @dakilldesing. Libertad Mental (2010–2013) sale de su
       presentación pública; sin discografía verificada, la obra queda vacía. */
    manifiesto: [
      "Fasterdakill rapea, compone, hace sus beats, graba y mezcla. Viene de Lima y de la escena que lo formó: en 2010 fundó Libertad Mental, y desde entonces sostiene una carrera independiente que no le pide permiso a nadie.",
      "Lo que lo define es la autonomía: controla la cadena entera, del beat al arte de tapa, que también diseña él. Un artista así no necesita que le armen un personaje; necesita que su obra llegue más lejos.",
      "Hivrido entra para eso: dirección visual, estrategia de lanzamiento y un puente entre su escena y la de este lado del mapa.",
    ],
    ejes: [
      {
        titulo: "Independiente de punta a punta",
        texto: "Letra, beat, mezcla y diseño salen de la misma mano. Esa firma completa es su identidad.",
      },
      {
        titulo: "Oficio de estudio",
        texto: "Además de rapear, es ingeniero de sonido: sabe cómo tiene que sonar un tema antes de que salga.",
      },
      {
        titulo: "Una casa propia",
        texto: "F2 Incorporated y Dakill Design son su estructura. Hivrido se suma a ella, no la reemplaza.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "fasterdakill",
        href: "https://www.instagram.com/fasterdakill/",
      },
      {
        tipo: "threads",
        handle: "fasterdakill",
        href: "https://www.threads.net/@fasterdakill",
      },
    ],
    metricas: [
      {
        valor: "6.029",
        label: "Seguidores en Instagram",
        fuente: "Perfil @fasterdakill · 28/09/2026",
      },
      {
        valor: "318 K",
        label: "Vistas del reel de No Hay Plan B",
        fuente: "Instagram · 28/09/2026",
      },
      {
        valor: "122 K",
        label: "Vistas del reel de Perfume",
        fuente: "Instagram · 28/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que suena" },
    /* Títulos y fechas de las placas de sus reels. Sin el ID de YouTube de
       cada tema todavía: el bloque va sin portada hasta tenerlo. La cifra es
       la del reel que lo anuncia, no la del video. */
    lanzamientos: [
      { id: "ultimo-mensaje", titulo: "Último Mensaje", tipo: "single", year: "2026", dato: "13,3 K vistas del adelanto" },
      { id: "mafia", titulo: "Mafia", tipo: "videoclip" },
      { id: "no-hay-plan-b", titulo: "No Hay Plan B", tipo: "videoclip", year: "2025", dato: "318 K vistas del adelanto" },
      { id: "perfume", titulo: "Perfume", tipo: "videoclip", year: "2025", dato: "122 K vistas del adelanto" },
      { id: "sabrina", titulo: "Sabrina", tipo: "single" },
      { id: "susurran-dome", titulo: "Susurran Dome", tipo: "videoclip", dato: "14,4 K vistas del adelanto" },
      { id: "shine", titulo: "Shine", tipo: "single", dato: "22,6 K vistas del adelanto" },
    ],
    enConstruccion:
      "Está en producción su primer ciclo con Hivrido: los videos de cada tema en esta ficha, lanzamientos con dirección visual y su llegada al público argentino.",
    universo: ["flavia-rotela"],
  },

  {
    slug: "flavia-rotela",
    /* Así figura su nombre en el perfil; el handle lleva doble t. */
    nombre: "Flavia Rotela",
    alias: "@flaviarottella",
    tagline: "Dirige lo que otros no se animan a filmar.",
    disciplinas: ["Producción", "Dirección", "Documental", "Management"],
    schema: "Person",
    rol: "Productora, directora y ejecutiva musical",
    /* Rosa cuarzo: cálido y claro, lejos del naranja de Uriel y del rojo de
       Alan. Pasa el AA como texto sobre negro. */
    acento: { hex: "#F4B6A6", suave: "rgba(244, 182, 166, 0.14)" },
    emblema: { forma: "onda", leyenda: "MNGM" },
    /* Relevado el 28/09/2026 de su perfil: "Productora & Ejecutiva Musical",
       desarrollo de artistas en @f2incorporated, blog en @existirasolas y
       conexión con Warner Music Argentina y Sony Music Colombia. El perfil de
       Fasterdakill la nombra en su management. */
    manifiesto: [
      "Flavia Rotela es productora y ejecutiva musical. Su trabajo no se ve en el escenario: es lo que hace que el escenario exista, que el tema salga a tiempo y que cada puerta se abra con un plan.",
      "Firma como directora “Existir a Solas”, su cortometraje documental: la prueba de que su mirada no se queda detrás de escena, también sabe contar.",
      "Desarrolla artistas desde F2 Incorporated y hace de puente con la industria grande: sus contactos llegan a Warner Music Argentina y Sony Music Colombia. Maneja la carrera de Fasterdakill, y con Hivrido suma una estructura para llevar esa forma de trabajar a más artistas.",
    ],
    ejes: [
      {
        titulo: "Estrategia antes que ruido",
        texto: "Cada lanzamiento con un porqué, una fecha y un destino.",
      },
      {
        titulo: "Del artista al proyecto",
        texto: "Ordenar la carrera es lo que permite que la obra crezca sin perder identidad.",
      },
    ],
    enlaces: [
      {
        tipo: "instagram",
        handle: "flaviarottella",
        href: "https://www.instagram.com/flaviarottella/",
      },
      {
        tipo: "youtube",
        handle: "EXISTIRASOLAS",
        href: "https://www.youtube.com/@EXISTIRASOLAS",
      },
      {
        tipo: "threads",
        handle: "flaviarottella",
        href: "https://www.threads.net/@flaviarottella",
      },
    ],
    metricas: [
      {
        valor: "107 K",
        label: "Seguidores en Instagram",
        fuente: "Perfil @flaviarottella · 28/09/2026",
      },
      {
        valor: "874 K",
        label: "Vistas de su reel más visto",
        fuente: "Instagram · 28/09/2026",
      },
      {
        valor: "135",
        label: "Publicaciones",
        fuente: "Perfil @flaviarottella · 28/09/2026",
      },
    ],
    obra: { eyebrow: "Obra", titulo: "Lo que dirige" },
    /* Título y fecha salen del video oficial (canal @EXISTIRASOLAS,
       publicado el 27/09/2026). */
    lanzamientos: [
      {
        id: "existir-a-solas",
        titulo: "Existir a Solas",
        tipo: "documental",
        year: "2026",
        ytId: "kDr7wzem-KQ",
      },
    ],
    destacado: "existir-a-solas",
    enConstruccion:
      "Está en producción su ficha completa: los proyectos que produce y los que dirige junto a Hivrido.",
    universo: ["fasterdakill"],
  },
];

/**
 * Las variables de color que pinta lo que es de un artista: su página, su
 * tarjeta en el índice y el cruce desde la ficha de otro. Van en un solo
 * lugar para que las tres piezas no puedan contar colores distintos.
 */
export function estiloAcento({ acento }: Artista): CSSProperties {
  const vars: Record<string, string> = {
    "--art-acento": acento.hex,
    "--art-acento-suave": acento.suave,
  };
  if (acento.tomaLaMarca) {
    vars["--art-marca"] = acento.hex;
    vars["--art-marca-suave"] = acento.suave;
    vars["--art-marca-tenue"] = `color-mix(in srgb, ${acento.hex} 9%, transparent)`;
  }
  return vars as CSSProperties;
}

/** Ficha por slug. `undefined` si no existe: la ruta responde 404. */
export function getArtista(slug: string): Artista | undefined {
  return ARTISTAS.find((a) => a.slug === slug);
}

/**
 * Los artistas con los que comparte escena, ya resueltos.
 *
 * Descarta el slug que no existe en vez de romper la página: si alguien sale
 * del roster, la ficha del que se queda pierde una tarjeta y no la vista
 * entera. Y descarta al propio artista, que es el único enlace de esta lista
 * que no lleva a ningún lado.
 */
export function vecinosDe(a: Artista): Artista[] {
  return (a.universo ?? [])
    .filter((slug) => slug !== a.slug)
    .map(getArtista)
    .filter((v): v is Artista => v !== undefined);
}

/** Portada de un lanzamiento. Sale de YouTube: no hay arte propio todavía. */
export function portadaDe(l: Lanzamiento): string | undefined {
  return l.ytId ? `https://i.ytimg.com/vi/${l.ytId}/maxresdefault.jpg` : undefined;
}
