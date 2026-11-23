"use client";

/**
 * Pieza de cliente chica de la home: la red de las anclas viejas del
 * catálogo.
 */

import { useEffect } from "react";
import { ANCLAS_VIEJAS } from "./scripts";

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

