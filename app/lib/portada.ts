/**
 * Qué se sirve en la raíz del dominio. Es el único interruptor de la portada:
 *
 * - "rytmos": la home de lanzamiento de RYTMOS. El catálogo de PLAY vive en
 *   /play/ y es su URL canónica.
 * - "play": la portada anterior, el catálogo, idéntica a como estaba. /play/
 *   sigue respondiendo con el mismo catálogo, pero declara "/" como canónica
 *   para que Google no vea dos páginas iguales.
 *
 * Para volver atrás alcanza con uno de los dos, y un deploy:
 *   1. cargar `PORTADA=play` en las variables de entorno de Vercel, o
 *   2. cambiar el valor por defecto de abajo a "play".
 *
 * Se lee en el build (todas las páginas se prerenderizan), así que el cambio
 * llega con el deploy siguiente, no en caliente. Ver docs/HOME-RYTMOS.md.
 */
export type Portada = "rytmos" | "play";

export const PORTADA: Portada = process.env.PORTADA === "play" ? "play" : "rytmos";

/** La URL canónica del catálogo según la portada vigente. */
export const CATALOGO_CANONICO = PORTADA === "play" ? "/" : "/play/";
