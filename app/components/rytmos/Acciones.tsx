"use client";

/**
 * Piezas de cliente chicas de la home:
 * - el link a la ficha, que viaja con transición de vista;
 * - la red de las anclas viejas del catálogo.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useNavegarConTransicion } from "../play/transicion";

export function LinkFicha({ href, children }: { href: string; children: React.ReactNode }) {
  const navegar = useNavegarConTransicion();
  return (
    <Link href={href} className="ry-link" onClick={navegar} data-medir="ficha_click" data-medir-origen="hero">
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </Link>
  );
}

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
