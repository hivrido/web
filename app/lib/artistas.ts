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
  | "facebook";

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
  emblema: { forma: "capsula" | "reel" | "junta" | "camara"; leyenda: string };
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
        valor: "6.854",
        label: "Seguidores en Instagram",
        fuente: "Perfil @enzo_arancibia14 · 23/09/2026",
      },
      {
        valor: "457",
        label: "Publicaciones en Instagram",
        fuente: "Perfil @enzo_arancibia14 · 23/09/2026",
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
];

/** Ficha por slug. `undefined` si no existe: la ruta responde 404. */
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
