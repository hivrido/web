/**
 * Contacto de Hivrido: la única fuente del número, el mail y la forma de los
 * enlaces.
 *
 * Había 25 enlaces a WhatsApp armados a mano en dos formatos distintos
 * (`wa.me` y `api.whatsapp.com`) y varios con el mismo mensaje genérico, así
 * que un "Hola Hívrido!" podía venir del menú, del pie o del botón flotante
 * de cualquier página. Ahora todos salen de `whatsapp()`, en un solo formato,
 * y cada origen lleva su propio mensaje: al leer el chat se sabe de dónde
 * llegó la consulta.
 *
 * `public/web/index.html` y `public/cosmos/` no comparten código con la app:
 * ahí los enlaces están escritos a mano con este mismo formato.
 */

export const WHATSAPP_NUMERO = "5491156072460";
export const MAIL = "hola@hivrido.com";
export const INSTAGRAM = "https://www.instagram.com/hivrido.product.x1_ok/";

/** Enlace a WhatsApp con el mensaje precargado. */
export const whatsapp = (mensaje: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

/** Enlace de mail con asunto: una consulta sin asunto se pierde en la bandeja. */
export const mail = (asunto: string) => `mailto:${MAIL}?subject=${encodeURIComponent(asunto)}`;

/** Nombre legible de cada sección, para decir de dónde viene el mensaje. */
const SECCIONES: [RegExp, string][] = [
  [/^\/diseno-web/, "Diseño web"],
  [/^\/branding/, "Branding"],
  [/^\/publicidad/, "Publicidad"],
  [/^\/colmena-agentes/, "Agentes IA"],
  [/^\/equipo/, "Equipo"],
  [/^\/artistas\/.+/, "la ficha de un artista"],
  [/^\/artistas/, "Artistas"],
  [/^\/casting/, "el casting"],
  [/^\/origen/, "ORIGEN"],
  [/^\/cesion/, "la cesión de imagen"],
  [/^\/estudio/, "el estudio"],
  [/^\/orbital/, "la galería orbital"],
  [/^\/okupas/, "Okupas en PLAY"],
  [/^\/play\//, "una ficha de PLAY"],
  [/^\/$/, "Hivrido PLAY"],
];

/** "Diseño web", "Hivrido PLAY"… según la ruta. Vacío si no se reconoce. */
export function seccionDe(ruta: string): string {
  return SECCIONES.find(([re]) => re.test(ruta))?.[1] ?? "";
}

/**
 * Mensaje de los contactos generales (menú, pie, botón flotante), que están
 * en todas las páginas: dice desde cuál se escribió.
 */
export function mensajeGeneral(ruta: string, lugar: "el menú" | "el pie" | "el botón de WhatsApp") {
  const seccion = seccionDe(ruta);
  return seccion
    ? `Hola Hivrido! Les escribo desde ${seccion} (${lugar}).`
    : `Hola Hivrido! Les escribo desde el sitio (${lugar}).`;
}
