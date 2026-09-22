/**
 * Contenido de /casting.
 *
 * Todo el texto, las fechas y los links de la página viven acá: el día del
 * casting hay que poder corregir una hora o un teléfono sin abrir el JSX ni
 * entender React. Si algo se lee en pantalla, se edita en este archivo.
 *
 * Las consignas de las escenas SÍ se publican. Durante un tiempo no lo
 * hicieron —el criterio era que una prueba preparada de antemano no prueba
 * nada—, y se cambió a propósito: lo que se busca no es sorprender a nadie,
 * es ver cómo escucha y cómo reacciona. Las cuatro situaciones están armadas
 * para que leerlas no dé ventaja: ninguna tiene una respuesta que se pueda
 * memorizar, y la sección de preparación lo dice con todas las letras. Lo que
 * sí evita publicarlas es que la persona llegue con miedo a algo que no sabe
 * qué es, que es lo que hace que no venga.
 */

/* ── Lo que falta definir ─────────────────────────────────────────────────
   Dos cosas todavía no están cerradas. Quedan como constantes arriba de todo
   para que se vean apenas se abre el archivo.                              */

/** Formulario de audición por video. Vacío = el bloque cae al WhatsApp. */
export const AUDICION_VIDEO_URL = "";

/** Respuesta a "¿cuándo me avisan?". Cambiala cuando haya fecha real. */
export const AVISO_RESPUESTA =
  "Nos comunicamos con las personas seleccionadas en las semanas siguientes al casting, por el teléfono que dejes al acreditarte. Si no te llamamos no significa que no sirvas: cada personaje tiene una edad y un perfil, y muchas veces la búsqueda se reabre.";

/* ── La jornada ─────────────────────────────────────────────────────────── */

export const EVENTO = {
  serie: "Cuchillo Paz",
  titulo: "Casting abierto",
  /* ISO con huso de Buenos Aires: de acá salen el schema.org y el <time>. */
  inicioISO: "2026-09-19T09:00:00-03:00",
  finISO: "2026-09-19T15:00:00-03:00",
  fecha: "Sábado 19 de septiembre",
  hora: "desde las 9 AM",
  horaCierre: "15:00",
  calle: "Naciones Unidas 2390",
  esquina: "esq. Quiroz",
  barrio: "Barrio Frino",
  localidad: "José C. Paz",
  provincia: "Provincia de Buenos Aires",
  pais: "AR",
  codigoPostal: "1665",
} as const;

export const DIRECCION_COMPLETA = `${EVENTO.calle} ${EVENTO.esquina} — ${EVENTO.barrio}, ${EVENTO.localidad}`;

/** Abre la app de mapas del teléfono, o Google Maps en el navegador. */
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${EVENTO.calle}, ${EVENTO.localidad}, Buenos Aires, Argentina`);

/* ── 1 · Hero ───────────────────────────────────────────────────────────── */

export const HERO = {
  kicker: "Serie audiovisual",
  /* El <h1> se arma con las dos partes para que la segunda pese más. */
  tituloArriba: "Casting abierto",
  tituloAbajo: EVENTO.serie,
  claim: "No hay que preparar nada.",
  claimApoyo:
    "Venís, te anotás y son tres minutos: uno hablando y dos en una escena. Nada más que eso.",
} as const;

/* ── El arte ────────────────────────────────────────────────────────── */

/* El afiche va debajo del hero, no dentro: es lo que contesta "¿qué es esto?"
   apenas después de "¿cuándo y dónde?", y al quedar bajo el pliegue carga
   diferido sin pelearle el LCP al título. */
export const ARTE = {
  titulo: "La serie",
  texto:
    "Buscamos caras nuevas para la primera temporada. Si nunca actuaste, mejor: el casting está pensado para eso.",
  /* El alt describe la escena, no repite el título: quien usa lector de
     pantalla ya escuchó el nombre de la serie tres veces más arriba. */
  alt: "Afiche de Cuchillo Paz: cuatro jóvenes de espaldas, en una loma, miran el conurbano al atardecer.",
  poster400: "/images/casting/cuchillo-paz-poster-400.webp",
  poster800: "/images/casting/cuchillo-paz-poster-800.webp",
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
    titulo: "Por orden de llegada",
    texto:
      "No hay turnos ni inscripción previa. Se atiende en el orden en que llega cada persona.",
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
  titulo: "Cómo va a ser",
  lead: "Son dos momentos, tres minutos en total.",
  momentos: [
    {
      etiqueta: "Momento 1",
      titulo: "Hablamos",
      duracion: "Un minuto",
      texto:
        "Vas a decir tu nombre y tu edad mirando a cámara. Después te voy a pedir que me cuentes algo que te haya pasado a vos. Lo que quieras. Algo que te haya cambiado algo.",
      nota: "No hay respuesta correcta. No busques la historia más impresionante. La que te venga.",
    },
    {
      etiqueta: "Momento 2",
      titulo: "Una escena",
      duracion: "Dos minutos",
      texto:
        "Te voy a dar un papel con una situación. Lo leés veinte segundos, te lo saco, y la hacemos juntos. Yo te doy pie.",
      nota: "Son las cuatro que están acá abajo. A cada persona le toca una sola.",
    },
  ],
  aclaraciones: [
    "No hay texto para memorizar.",
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
  lead: "Son estas cuatro. A cada persona le toca una sola, y te la damos ese día, impresa.",
  escenas: [
    {
      letra: "A",
      nombre: "El que debe",
      beats: [
        "Venís a pedirle plata prestada a alguien que ya te prestó dos veces.",
        "Nunca le devolviste.",
        "No te podés ir sin la plata.",
        "No la vas a conseguir gritando.",
      ],
    },
    {
      letra: "B",
      nombre: "El que sabe",
      beats: [
        "Sabés exactamente lo que te están por preguntar.",
        "No se lo podés decir.",
        "Tampoco podés dejarle ver que lo sabés.",
      ],
    },
    {
      letra: "C",
      nombre: "Arreglalo",
      beats: [
        "Tenés algo roto en las manos. No es tuyo.",
        "Lo estás arreglando con lo que hay.",
        "Llega el dueño y te habla.",
        "Vos seguís. No lo mirás hasta que terminás.",
      ],
    },
    {
      letra: "D",
      nombre: "El que no se acuerda",
      beats: [
        "Alguien te saluda por tu nombre en la calle.",
        "Te conoce bien.",
        "Vos no tenés idea quién es.",
        "Y no podés admitirlo.",
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
  advertencia: "No las ensayes frente al espejo. No sirve.",
  texto:
    "Lo que buscamos no es que salga perfecto, es que salga verdadero. Lo único que te conviene hacer es leerlas una vez y entender qué querés conseguir en cada una. Eso es todo.",
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

/* ── 6 · Cómo llegar ────────────────────────────────────────────────────── */

export const COMO_LLEGAR = {
  titulo: "Cómo llegar",
  /**
   * PENDIENTE: las líneas reales.
   *
   * El bloque está armado pero cada vía se muestra solo cuando su `detalle`
   * tiene texto. Escribilo y aparece sola; vacío, no se publica. Es a
   * propósito: un "a completar" en la página que la gente abre para orientarse
   * no orienta a nadie y deja el sitio con cara de borrador. Mientras tanto la
   * sección se sostiene con la dirección en grande, el botón a Maps y la nota
   * del WhatsApp, que es lo que de verdad resuelve llegar.
   *
   * Ejemplo de cómo se completa:
   *   { medio: "Colectivo", detalle: "Líneas 740 y 315, bajás en Quiroz." }
   */
  transporte: [
    { medio: "Colectivo", detalle: "" },
    { medio: "Tren", detalle: "" },
    { medio: "En auto", detalle: "" },
  ],
  nota: "Si te perdés, escribinos por WhatsApp y te guiamos.",
} as const;

/* ── 7 · Qué llevar ─────────────────────────────────────────────────────── */

export const QUE_LLEVAR = {
  titulo: "Qué llevar",
  items: [
    { cosa: "DNI", nota: "Obligatorio" },
    { cosa: "Agua", nota: "Puede hacer calor" },
    { cosa: "Paciencia", nota: "Puede haber espera" },
  ],
  cierre: "Nada más.",
} as const;

/* ── 8 · Si no podés venir ──────────────────────────────────────────────── */

export const SI_NO_PODES = {
  titulo: "Si no podés venir",
  texto:
    "También se puede audicionar por video. Te mandamos las indicaciones y lo grabás con el celular, desde donde estés.",
  cta: "Quiero audicionar por video",
  /* Sin formulario todavía, el fallback es el WhatsApp de producción: es a
     donde la persona iba a llegar igual, un paso más tarde. */
  fallbackTexto:
    "Hola Hivrido! No puedo ir al casting presencial de Cuchillo Paz. Quiero audicionar por video.",
} as const;

/* ── 9 · Preguntas ──────────────────────────────────────────────────────── */

export const FAQ: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Tengo que tener experiencia?",
    respuesta:
      "No. Buscamos caras nuevas. Mucha gente que queda nunca actuó antes, y esa es justamente la idea.",
  },
  {
    pregunta: "¿Tengo que aprenderme las cuatro situaciones?",
    respuesta:
      "No. A cada persona le toca una sola y te la damos ese día en papel, con veinte segundos para leerla. Están publicadas para que sepas de qué se trata, no para que las estudies: no hay nada para memorizar.",
  },
  {
    pregunta: "¿Puedo elegir cuál me toca?",
    respuesta:
      "No, la asignamos nosotros. Las cuatro están pensadas para que cualquiera pueda hacer cualquiera, así que no hay una más fácil ni una que convenga.",
  },
  {
    pregunta: "¿Y si me quedo en blanco?",
    respuesta:
      "Pasa todo el tiempo y no descalifica a nadie. Frenamos, tomás agua y arrancamos de nuevo. Casi todo el mundo se traba en los primeros veinte segundos: lo que miramos es lo que pasa después.",
  },
  {
    pregunta: "¿Cuánto cuesta?",
    respuesta:
      "Nada. Nunca. No cobramos por participar, ni por el casting, ni por cursos, ni por fotos. Si alguien te cobra diciendo que es de la producción, no es de la producción.",
  },
  {
    pregunta: "¿Puedo ir si no soy de José C. Paz?",
    respuesta:
      "Sí. El casting es abierto y viene gente de todos lados. La única condición es llegar al lugar el día de la convocatoria.",
  },
  {
    pregunta: "¿Hasta qué hora se recibe gente?",
    respuesta: `Hasta las ${EVENTO.horaCierre} o hasta completar cupo, lo que pase primero. Cuanto más temprano llegues, menos esperás.`,
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
  {
    pregunta: "¿Qué pasa si llego y hay mucha fila?",
    respuesta:
      "Se atiende por orden de llegada hasta el horario de cierre. Si llegás y la fila es larga, te conviene esperar: la mayoría de las pruebas dura pocos minutos.",
  },
];

/* ── Compartir y contacto ───────────────────────────────────────────────── */

export const URL_PAGINA = "https://hivrido.com/casting/";

export const WHATSAPP_PRODUCCION = "5491156072460";

/** El texto que viaja cuando alguien comparte la página. */
export const TEXTO_COMPARTIR = [
  `CASTING ABIERTO — ${EVENTO.serie.toUpperCase()}`,
  `${EVENTO.fecha}, ${EVENTO.hora}`,
  `${EVENTO.calle} ${EVENTO.esquina}, ${EVENTO.localidad}`,
  "",
  "Gratis, por orden de llegada. No hay que preparar nada.",
  "",
  URL_PAGINA,
].join("\n");

export const CONTACTO = {
  whatsappTexto:
    "Hola Hivrido! Tengo una consulta sobre el casting de Cuchillo Paz.",
  instagram: "https://www.instagram.com/hivrido.productora_ok/",
  instagramHandle: "@hivrido.productora_ok",
  /**
   * PENDIENTE. El sitio todavía no tiene política de privacidad publicada: no
   * existe /privacidad ni ninguna otra ruta equivalente. Queda vacío a
   * propósito —el pie omite el link mientras lo esté— porque mandar a un 404
   * desde el pie de una página que le pide el DNI a la gente es peor que no
   * ofrecer el link. Poné acá la URL en cuanto exista y el pie la muestra.
   */
  privacidadUrl: "",
} as const;

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const SEO = {
  title: `Casting abierto ${EVENTO.serie} — ${EVENTO.fecha}, ${EVENTO.localidad}`,
  description: `Casting abierto y gratuito para la serie ${EVENTO.serie}. ${EVENTO.fecha} ${EVENTO.hora} en ${EVENTO.calle}, ${EVENTO.localidad}. Por orden de llegada, con DNI. No hace falta experiencia ni preparar nada.`,
  /* El que se ve al pegar el link en WhatsApp. */
  ogImage: "/images/casting/casting-cuchillo-paz.jpg",
  ogImageAlt: `Casting abierto de la serie ${EVENTO.serie}: ${EVENTO.fecha} desde las 9 AM en ${EVENTO.localidad}`,
} as const;
