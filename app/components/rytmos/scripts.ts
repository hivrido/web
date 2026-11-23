/**
 * Scripts en línea de la home, como texto. Viven en un módulo común —ni de
 * servidor ni de cliente— a propósito: exportados desde un archivo
 * "use client", la página de servidor recibía una referencia de cliente en
 * lugar del texto y el HTML salía con un script roto.
 */

/** Las anclas del catálogo que vivieron en la raíz. */
export const ANCLAS_VIEJAS = ["series", "peliculas", "proximamente"];

/** /#series y compañía van al catálogo antes del primer pintado. */
export const SCRIPT_ANCLAS = `(function(h){if(/^#(${ANCLAS_VIEJAS.join("|")})$/.test(h))location.replace("/play/"+h)})(location.hash);`;

/** Marca que la cortina de Hivrido está puesta (Precarga.tsx), con salida
    propia a los 4,2 s por si el JavaScript de la página no llega. */
export const SCRIPT_PRECARGA =
  'document.documentElement.setAttribute("data-precarga","");setTimeout(function(){document.documentElement.removeAttribute("data-precarga")},4200);';
