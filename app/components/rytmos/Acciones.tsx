"use client";

/**
 * Pieza de cliente chica de la home: la red de las anclas viejas del
 * catálogo.
 */

import { useEffect } from "react";

/** Las anclas del catálogo que vivieron en la raíz. */
export const ANCLAS_VIEJAS = ["series", "peliculas", "proximamente"];

/**
 * El hash no llega al servidor, así que /#series no se puede redirigir en
 * vercel.json. Un script en línea al tope de la página lo resuelve en la
 * carga (`SCRIPT_ANCLAS`); esto cubre además la navegación interna de Next,
 * que no vuelve a correr scripts en línea.
 */
export function AnclasViejas() {
  useEffect(() => {
    const h = location.hash.slice(1);
    if (ANCLAS_VIEJAS.includes(h)) location.replace(`/play/#${h}`);
  }, []);
  return null;
}

export const SCRIPT_ANCLAS = `(function(h){if(/^#(${ANCLAS_VIEJAS.join("|")})$/.test(h))location.replace("/play/"+h)})(location.hash)`;
