/**
 * Contenido de /casting.
 *
 * Todo el texto de la página vive acá: se corrige sin abrir el JSX ni
 * entender React. Si algo se lee en pantalla, se edita en este archivo.
 *
 * Las consignas de la prueba SÍ se publican: lo que se busca no es
 * sorprender a nadie, es ver cómo escucha y cómo reacciona, y publicarlas
 * evita que la persona llegue con miedo a algo que no sabe qué es, que es lo
 * que hace que no venga. En RYTMOS la prueba depende del perfil (freestyle,
 * actuación o, sin nada preparado, una de las dos situaciones a elección).
 */

/* ── La convocatoria vigente ───────────────────────────────────────────
   RYTMOS, según el afiche oficial del casting. Antes fue la de Cuchillo Paz;
   sus textos siguen en el historial de git y su afiche en
   public/images/casting/cuchillo-paz-poster-*.webp. */

export const CONVOCATORIA = {
  serie: "RYTMOS",
  slug: "rytmos",
  fecha: "Lunes 23 de noviembre",
  hora: "18:00 hs",
  lugar: "Parque Centenario",
  ciudad: "Buenos Aires",
  direccion: "Malena Luchetti",
} as const;

/* ── Lo que falta definir ─────────────────────────────────────────────── */

/** Respuesta a "¿cuándo me avisan?". Cambiala cuando haya fecha real. */
export const AVISO_RESPUESTA =
  "Nos comunicamos con las personas seleccionadas en las semanas siguientes al casting, por el WhatsApp que dejes en el formulario. Si no te llamamos no significa que no sirvas: cada personaje tiene una edad y un perfil, y muchas veces la búsqueda se reabre.";

/* ── El arte ────────────────────────────────────────────────────────── */

/* El afiche va debajo del hero, no dentro: es lo que contesta "¿qué es esto?"
   apenas después de "¿cuándo y dónde?", y al quedar bajo el pliegue carga
   diferido sin pelearle el LCP al título. */
export const ARTE = {
  titulo: "La serie",
  texto:
    "RYTMOS es una serie argentina y buscamos caras nuevas. Si nunca actuaste, mejor: el casting está pensado para eso. Para escapar del infierno tenés que atravesarlo.",
  /* El alt describe la escena, no repite el título: quien usa lector de
     pantalla ya escuchó el nombre de la serie tres veces más arriba. */
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
    icono: "fila",
    titulo: "Lunes 23 de noviembre, 18 hs",
    texto:
      "En Parque Centenario, Buenos Aires. Llegá con tiempo: puede haber espera. Si dejás tus datos en el formulario, te escribimos por WhatsApp.",
  },
  {
    icono: "dni",
    titulo: "Traé DNI",
    texto: "Lo necesitás para acreditarte. Sin documento no podemos anotarte.",
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
      "Solo pueden participar con su madre, padre o responsable presente en el lugar.",
  },
  {
    icono: "camara",
    titulo: "Se filma y se transmite",
    texto:
      "La jornada se registra en video y se transmite en vivo. Al acreditarte vas a firmar una cesión de imagen.",
  },
];

/* ── 3 · Cómo va a ser ──────────────────────────────────────────────────
   Esta sección y las dos que siguen están escritas en primera persona: no
   habla la producción, habla la persona que va a estar del otro lado de la
   cámara ese día. El cambio de voz es deliberado y no se corrige "para que
   quede uniforme" con el resto de la página: es lo que convierte un
   instructivo en alguien explicándote qué va a pasar.                     */

export const COMO_VA_A_SER = {
  titulo: "Cómo es la prueba",
  lead: "Depende de lo que hagas. Elegí tu camino.",
  /* Los tres caminos de la prueba de RYTMOS, tal como los define la
     producción. Sin duración: no la informaron. */
  momentos: [
    {
      etiqueta: "Freestyler",
      titulo: "Improvisás",
      duracion: "",
      texto: "Vas a improvisar sobre una base que ponemos nosotros.",
      nota: "",
    },
    {
      etiqueta: "Actor · Actriz",
      titulo: "Traé lo tuyo",
      duracion: "",
      texto:
        "Prepará algo con lo que te sientas cómodx: un monólogo, una anécdota o lo que quieras contarnos.",
      nota: "",
    },
    {
      etiqueta: "Sin nada preparado",
      titulo: "Elegí una situación",
      duracion: "",
      texto:
        "Si no trajiste nada, te damos a elegir una de las dos situaciones de acá abajo para improvisar.",
      nota: "La elegís vos.",
    },
  ],
  aclaraciones: [
    "No hace falta experiencia.",
    "No hace falta book ni fotos.",
    "No hace falta currículum.",
  ],
} as const;

/* ── 4 · Las situaciones ────────────────────────────────────────────────
   Cada situación se escribe en frases sueltas, no en un párrafo. Son beats:
   una premisa, una complicación y el límite que no se puede cruzar. Leídas
   en bloque se vuelven un enunciado; leídas una debajo de la otra se
   entienden de una pasada, que es lo único que se necesita.

   El orden importa: el último renglón de cada una es siempre el obstáculo,
   y es el que hay que retener.                                           */

export const SITUACIONES = {
  titulo: "Las situaciones",
  lead: "Si no trajiste nada preparado, elegís una de estas dos y la improvisás.",
  escenas: [
    {
      letra: "A",
      nombre: "Te deben plata",
      beats: [
        "Alguien te debe plata.",
        "Ya se la reclamaste dos veces.",
        "Hoy vas a cobrarla por tercera vez.",
      ],
    },
    {
      letra: "B",
      nombre: "No sos quien creías",
      beats: [
        "Te acabás de enterar de que tus padres te mintieron toda la vida.",
        "No sos hijx de quien creías.",
      ],
    },
  ],
} as const;

/* ── 5 · Cómo prepararte ────────────────────────────────────────────────
   La sección existe para desarmar el ensayo, no para pedirlo. Por eso abre
   con la prohibición y recién después da los tres consejos: si el orden se
   invierte, se lee como una lista de tareas y la gente llega actuando.    */

export const PREPARACION = {
  titulo: "Cómo prepararte",
  advertencia: "No ensayes frente al espejo. No sirve.",
  texto:
    "Lo que buscamos no es que salga perfecto, es que salga verdadero. Si traés algo preparado, que sea tuyo. Si vas a improvisar, alcanza con entender qué querés conseguir. Eso es todo.",
  subtitulo: "Tres cosas que sí ayudan",
  consejos: [
    {
      titulo: "Escuchá",
      texto:
        "La escena es con otra persona. Si venís con todo decidido de casa, no vas a escuchar lo que te digo y se nota enseguida.",
    },
    {
      titulo: "No te apures",
      texto:
        "Los silencios están permitidos. Un silencio bien aguantado dice más que tres frases.",
    },
    {
      titulo: "Si te trabás, no pasa nada",
      texto:
        "Casi todos se traban en los primeros veinte segundos. Lo que miramos es lo que pasa después. Si te bloqueás, frenamos, tomás agua y arrancamos de nuevo. Pasa todo el tiempo.",
    },
  ],
} as const;

/* ── 6 · Qué llevar ─────────────────────────────────────────────────────── */

export const QUE_LLEVAR = {
  titulo: "Qué llevar",
  items: [
    { cosa: "DNI", nota: "Obligatorio" },
    { cosa: "Agua", nota: "Puede hacer calor" },
    { cosa: "Paciencia", nota: "Puede haber espera" },
  ],
  cierre: "Nada más.",
} as const;

/* ── 7 · Preguntas ──────────────────────────────────────────────────────── */

export const FAQ: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Tengo que tener experiencia?",
    respuesta:
      "No. Buscamos caras nuevas. Mucha gente que queda nunca actuó antes, y esa es justamente la idea.",
  },
  {
    pregunta: "¿Tengo que traer algo preparado?",
    respuesta:
      "Si sos actor o actriz, sí: un monólogo, una anécdota o lo que quieras contarnos, algo con lo que te sientas cómodx. Si sos freestyler, improvisás sobre una base que ponemos nosotros. Y si no trajiste nada, elegís una de las dos situaciones y la improvisás.",
  },
  {
    pregunta: "¿Puedo elegir la situación?",
    respuesta:
      "Sí. Si no trajiste nada preparado, elegís cualquiera de las dos. No hay una más fácil ni una que convenga.",
  },
  {
    pregunta: "¿Y si me quedo en blanco?",
    respuesta:
      "Pasa todo el tiempo y no descalifica a nadie. Frenamos, tomás agua y arrancamos de nuevo. Casi todo el mundo se traba en los primeros veinte segundos: lo que miramos es lo que pasa después.",
  },
  {
    pregunta: "¿Puedo anotarme si no soy de Buenos Aires?",
    respuesta:
      "Sí. El casting es abierto. La prueba es presencial: el lunes 23 de noviembre a las 15 en Parque Centenario, Buenos Aires. La única condición es poder llegar.",
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
  {
    pregunta: "¿Voy a salir filmado?",
    respuesta:
      "Sí. La jornada se filma y se transmite en vivo, así que al acreditarte vas a firmar una cesión de derechos de imagen. Si sos menor de 18, la firma tu madre, padre o responsable.",
  },
];

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const SEO = {
  title: "Casting abierto RYTMOS, serie argentina | Hivrido",
  share: "Sé parte de RYTMOS | Hivrido",
  description:
    "Casting abierto y gratuito para RYTMOS, una serie argentina: lunes 23 de noviembre a las 15 en Parque Centenario. Dirección de casting: Malena Luchetti. No hace falta experiencia.",
  /* El que se ve al pegar el link en WhatsApp. Sale de scripts/build-casting-assets.mjs. */
  ogImage: "/images/casting/casting-rytmos.jpg",
  ogImageAlt: "Casting abierto de RYTMOS: lunes 23 de noviembre, 18 hs, Parque Centenario",
} as const;
