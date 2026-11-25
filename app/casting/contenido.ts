/**
 * Contenido de /casting.
 *
 * Todo el texto de la página vive acá: se corrige sin abrir el JSX ni
 * entender React. Si algo se lee en pantalla, se edita en este archivo.
 *
 * Desde el 25/11 el casting de RYTMOS es por selftape: la jornada presencial
 * del lunes 23/11 en Parque Centenario ya se hizo, y la convocatoria sigue
 * con un video de hasta un minuto que se manda por mail. Las consignas se
 * publican completas: quien sabe exactamente qué grabar, graba y lo manda.
 */

import { MAIL } from "../lib/contacto";

/* ── La convocatoria vigente ───────────────────────────────────────────
   RYTMOS. Antes fue la de Cuchillo Paz; sus textos siguen en el historial de
   git y su afiche en public/images/casting/cuchillo-paz-poster-*.webp. */

export const CONVOCATORIA = {
  serie: "RYTMOS",
  slug: "rytmos",
  /* La jornada presencial, ya hecha. La sigue citando /cesion, que es la
     cesión que se firmó ese día. */
  fecha: "Lunes 23 de noviembre",
  hora: "15:00 hs",
  lugar: "Parque Centenario",
  ciudad: "Buenos Aires",
  direccion: "Malena Luchetti",
  /* La convocatoria de ahora. */
  modalidad: "Selftape",
  duracion: "1 minuto",
  mail: MAIL,
} as const;

/* ── El selftape: la consigna, tal cual la dio la producción ──────────── */

/** Lo que hace quien manda el video: decide qué improvisa. */
export const PERFILES = ["Freestyler", "Actor / actriz"] as const;

export const SELFTAPE = {
  kicker: "Selftape",
  titulo: "Mandá tu video",
  /* Los pasos, en el orden en que pasan en el video. */
  pasos: [
    {
      titulo: "Grabate con el celu en horizontal",
      texto: "Con el fondo más neutro que puedas: una pared lisa, sin cosas atrás.",
    },
    {
      titulo: "Decinos tu nombre y apellido",
      texto: "Mirando a cámara, y contanos un poco sobre vos.",
    },
    {
      titulo: "Improvisá según tu perfil",
      texto:
        "Si sos freestyler, freestyleá. Si sos actor o actriz, improvisá lo que te haga sentir más cómodx o un monólogo que te sepas muy bien.",
    },
    {
      titulo: "Máximo 1 minuto",
      texto: "Y mandalo por mail. Si pesa mucho, como link de Drive o WeTransfer.",
    },
  ],
  /* Asunto y cuerpo del mail que arma el botón: un asunto parejo es lo que
     permite encontrar los selftapes en la bandeja entre todo lo demás. */
  asunto: (perfil: string, nombre: string) => `Selftape RYTMOS · ${perfil} · ${nombre}`,
  cuerpo: (perfil: string, nombre: string) =>
    [
      "Hola Hivrido!",
      "",
      "Les mando mi selftape para el casting de RYTMOS.",
      "",
      `Nombre y apellido: ${nombre}`,
      `Perfil: ${perfil}`,
      "Edad: ",
      "Teléfono / WhatsApp: ",
      "Instagram: ",
      "",
      "(Adjuntá el video o pegá acá el link de Drive o WeTransfer.)",
    ].join("\n"),
  fino:
    "Gmail admite adjuntos de hasta 25 MB. Si el video pesa más, subilo a Google Drive o WeTransfer y pegá el link con acceso abierto.",
} as const;

/* ── Lo que falta definir ─────────────────────────────────────────────── */

/** Respuesta a "¿cuándo me avisan?". Cambiala cuando haya fecha real. */
export const AVISO_RESPUESTA =
  "Miramos todos los selftapes y nos comunicamos con las personas seleccionadas por mail o por el WhatsApp que nos dejes. Si no te llamamos no significa que no sirvas: cada personaje tiene una edad y un perfil, y muchas veces la búsqueda se reabre.";

/* ── El arte ────────────────────────────────────────────────────────── */

export const ARTE = {
  titulo: "La serie",
  texto:
    "RYTMOS es una serie argentina y buscamos caras nuevas. Si nunca actuaste, mejor: el casting está pensado para eso. Para escapar del infierno tenés que atravesarlo.",
  /* El afiche es el de la jornada presencial: la leyenda aclara que esa
     fecha ya pasó, para que nadie vaya al parque. */
  leyenda: "Afiche de la jornada presencial del 23/11, ya realizada. El casting sigue abierto por selftape.",
  alt: "Afiche del casting: un joven con capucha y gorra frente a la entrada del Parque Centenario al atardecer, junto a una pared con grafitis.",
  poster400: "/images/casting/rytmos-poster-400.webp",
  poster800: "/images/casting/rytmos-poster-800.webp",
} as const;

/* ── 2 · Datos clave ────────────────────────────────────────────────────── */

export type Icono = "fila" | "dni" | "gratis" | "menores" | "camara";

export const DATOS_CLAVE: {
  icono: Icono;
  titulo: string;
  texto: string;
  destacado?: boolean;
}[] = [
  {
    icono: "camara",
    titulo: "Es por selftape",
    texto:
      "Un video de hasta 1 minuto, grabado con tu celular en horizontal. No hace falta ir a ningún lado.",
  },
  {
    icono: "fila",
    titulo: "Se manda por mail",
    texto: `A ${MAIL}, con tu nombre en el asunto. El botón de arriba arma el mail solo: adjuntás el video y listo.`,
  },
  {
    icono: "gratis",
    titulo: "Es gratis, siempre",
    texto:
      "Si alguien te pide plata en nuestro nombre, es mentira. No cobramos por participar, ni antes ni después.",
    destacado: true,
  },
  {
    icono: "menores",
    titulo: "Menores de 18",
    texto:
      "Pueden mandar su selftape con autorización de su madre, padre o responsable. Poné sus datos en el mail.",
  },
];

/* ── 3 · Qué grabar ─────────────────────────────────────────────────── */

export const COMO_VA_A_SER = {
  titulo: "Qué grabar",
  lead: "Arrancá diciendo tu nombre y apellido y contanos un poco sobre vos. Después, según lo que hagas:",
  momentos: [
    {
      etiqueta: "Freestyler",
      titulo: "Freestyleá",
      duracion: "",
      texto: "Improvisá a tu manera: es tu momento para mostrar cómo fluís.",
      nota: "",
    },
    {
      etiqueta: "Actor · Actriz",
      titulo: "Improvisá o traé un monólogo",
      duracion: "",
      texto: "Lo que te haga sentir más cómodx, o un monólogo que te sepas muy bien.",
      nota: "",
    },
  ],
  aclaraciones: [
    "Máximo 1 minuto en total.",
    "No hace falta experiencia.",
    "No hace falta book ni currículum.",
  ],
} as const;

/* ── 4 · Cómo grabarte ──────────────────────────────────────────────── */

export const GRABACION = {
  titulo: "Cómo grabarte",
  items: [
    { cosa: "Horizontal", nota: "El celular acostado, nunca vertical" },
    { cosa: "Fondo neutro", nota: "Pared lisa, sin cosas atrás" },
    { cosa: "Luz de frente", nota: "Una ventana delante tuyo alcanza" },
    { cosa: "Silencio", nota: "Sin tele ni música de fondo" },
    { cosa: "Celu quieto", nota: "Apoyado, a la altura de tus ojos" },
  ],
  cierre: "Con el celular que tengas alcanza.",
} as const;

/* ── 5 · Cómo prepararte ────────────────────────────────────────────────
   La sección existe para desarmar el ensayo, no para pedirlo. Por eso abre
   con la prohibición y recién después da los consejos: si el orden se
   invierte, se lee como una lista de tareas y la gente graba actuando.    */

export const PREPARACION = {
  titulo: "Cómo prepararte",
  advertencia: "No ensayes frente al espejo. No sirve.",
  texto:
    "Lo que buscamos no es que salga perfecto, es que salga verdadero. Si traés algo preparado, que sea tuyo. Si vas a improvisar, alcanza con saber qué querés contar. Eso es todo.",
  subtitulo: "Tres cosas que sí ayudan",
  consejos: [
    {
      titulo: "Hablale a alguien",
      texto:
        "La cámara no es un público: imaginá a una persona del otro lado y contale a ella. La diferencia se nota enseguida.",
    },
    {
      titulo: "No te apures",
      texto:
        "Un minuto alcanza. Los silencios están permitidos: un silencio bien aguantado dice más que tres frases.",
    },
    {
      titulo: "Una buena toma alcanza",
      texto:
        "No hace falta editar ni sumar efectos. Si te trabás, cortá y grabá de nuevo: mandanos la toma en la que más te reconozcas.",
    },
  ],
} as const;

/* ── 6 · Preguntas ──────────────────────────────────────────────────────── */

export const FAQ: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Puedo participar si no fui al casting presencial?",
    respuesta:
      "Sí. La jornada en Parque Centenario ya pasó, pero el casting sigue abierto por selftape. Grabá tu video y mandalo por mail.",
  },
  {
    pregunta: "¿Tengo que tener experiencia?",
    respuesta:
      "No. Buscamos caras nuevas. Mucha gente que queda nunca actuó antes, y esa es justamente la idea.",
  },
  {
    pregunta: "¿Qué pongo en el mail?",
    respuesta: `Mandalo a ${MAIL} con el asunto "Selftape RYTMOS", tu perfil y tu nombre. En el cuerpo: edad, teléfono o WhatsApp e Instagram. El botón de arriba lo arma solo.`,
  },
  {
    pregunta: "¿Y si el video pesa mucho?",
    respuesta:
      "Gmail admite adjuntos de hasta 25 MB. Si pesa más, subilo a Google Drive o WeTransfer y pegá el link en el mail, con acceso abierto para que lo podamos ver.",
  },
  {
    pregunta: "¿Puedo participar si no soy de Buenos Aires?",
    respuesta: "Sí. Al ser por selftape, lo podés mandar desde donde estés.",
  },
  {
    pregunta: "¿Cuánto cuesta?",
    respuesta:
      "Nada. Nunca. No cobramos por participar, ni por el casting, ni por cursos, ni por fotos. Si alguien te cobra diciendo que es de la producción, no es de la producción.",
  },
  {
    pregunta: "¿Cuándo me avisan?",
    respuesta: AVISO_RESPUESTA,
  },
];

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const SEO = {
  title: "Casting abierto RYTMOS por selftape, serie argentina | Hivrido",
  share: "Casting RYTMOS: mandá tu selftape | Hivrido",
  description:
    "Casting abierto y gratuito para RYTMOS, una serie argentina. Grabá un selftape de hasta 1 minuto y mandalo por mail. Dirección de casting: Malena Luchetti. No hace falta experiencia.",
  /* El que se ve al pegar el link en WhatsApp. Sale de scripts/build-casting-assets.mjs. */
  ogImage: "/images/casting/casting-rytmos.jpg",
  ogImageAlt: "Casting abierto de RYTMOS, serie argentina",
} as const;
