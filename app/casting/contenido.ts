/**
 * Contenido de /casting.
 *
 * Todo el texto, las fechas y los links de la página viven acá: el día del
 * casting hay que poder corregir una hora o un teléfono sin abrir el JSX ni
 * entender React. Si algo se lee en pantalla, se edita en este archivo.
 *
 * Lo que NO va acá ni en ninguna parte de la página: las consignas de las
 * escenas de improvisación. La prueba sirve porque nadie la preparó de
 * antemano; publicarla la anula. Solo se describe el formato.
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
    "Venís, te anotás, charlás un minuto e improvisás dos. Nada más que eso.",
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

/* ── 3 · Qué vas a hacer ────────────────────────────────────────────────── */

export const QUE_VAS_A_HACER = {
  titulo: "Qué vas a hacer",
  lead: "Son dos pruebas cortas. Las hace todo el mundo igual, sin importar si actuaste alguna vez o nunca.",
  pasos: [
    {
      numero: "01",
      titulo: "Una charla de un minuto",
      texto:
        "Te preguntamos quién sos, de dónde venís, a qué te dedicás. Se contesta hablando normal. No hay respuesta correcta.",
    },
    {
      numero: "02",
      titulo: "Una escena improvisada de dos minutos",
      texto:
        "Te damos una situación en el momento y la resolvés ahí mismo. Es a propósito: queremos ver cómo reaccionás, no cómo ensayaste.",
    },
  ],
  aclaraciones: [
    "No hay texto para memorizar.",
    "No hace falta experiencia.",
    "No hace falta book ni fotos.",
    "No hace falta currículum.",
  ],
} as const;

/* ── 4 · Cómo llegar ────────────────────────────────────────────────────── */

export const COMO_LLEGAR = {
  titulo: "Cómo llegar",
  /* PENDIENTE: completar con las líneas reales. El bloque se muestra igual;
     lo que manda visualmente es la dirección, que va aparte y en grande. */
  transporte: [
    { medio: "Colectivo", detalle: "Líneas y parada más cercana — a completar." },
    { medio: "Tren", detalle: "Estación y cómo seguir desde ahí — a completar." },
    { medio: "En auto", detalle: "Referencias para estacionar en la zona — a completar." },
  ],
  nota: "Si te perdés, escribinos por WhatsApp y te guiamos.",
} as const;

/* ── 5 · Qué llevar ─────────────────────────────────────────────────────── */

export const QUE_LLEVAR = {
  titulo: "Qué llevar",
  items: [
    { cosa: "DNI", nota: "Obligatorio" },
    { cosa: "Agua", nota: "Puede hacer calor" },
    { cosa: "Paciencia", nota: "Puede haber espera" },
  ],
  cierre: "Nada más.",
} as const;

/* ── 6 · Si no podés venir ──────────────────────────────────────────────── */

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

/* ── 7 · Preguntas ──────────────────────────────────────────────────────── */

export const FAQ: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Tengo que tener experiencia?",
    respuesta:
      "No. Buscamos caras nuevas. Mucha gente que queda nunca actuó antes, y esa es justamente la idea.",
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
  instagram: "https://www.instagram.com/hivrido/",
  instagramHandle: "@hivrido",
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
