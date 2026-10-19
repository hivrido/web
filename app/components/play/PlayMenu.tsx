"use client";

/**
 * Menú de Hivrido PLAY para el teléfono.
 *
 * Reusa las piezas del menú de la casa —el botón con las tres líneas que se
 * cruzan, el velo, el cajón que entra desde la derecha y las entradas
 * numeradas que se descifran— que viven en globals.css bajo las clases
 * `nav-*`. El layout raíz carga esa hoja en todas las rutas, así que acá no
 * hay nada que importar: alcanza con usar los mismos nombres, y cualquier
 * cambio de identidad llega a los dos menús a la vez.
 *
 * Lo abre "Más", en la barra inferior: el header de PLAY ya no lleva botón de
 * menú en el teléfono. En escritorio no se muestra: play.css decide eso.
 */

import { useEffect } from "react";
import ScrambleLink from "../ui/ScrambleLink";

/* Las secciones de la plataforma, más la salida al sitio institucional. */
const ITEMS = [
  { label: "Inicio", href: "/play/" },
  { label: "Series", href: "/play/#series" },
  { label: "Películas", href: "/play/#peliculas" },
  { label: "Próximamente", href: "/play/#proximamente" },
  { label: "Casting", href: "/casting/" },
  { label: "Hivrido", href: "/" },
];

const WA_URL = "https://api.whatsapp.com/send?phone=5491156072460&text=Hola%20H%C3%ADvrido!";

export default function PlayMenu({ open, onClose: close }: { open: boolean; onClose: () => void }) {
  /* Escape cierra, como en los paneles del anillo. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <div className={`nav-overlay-bg${open ? " open" : ""}`} onClick={close} />

      <nav className={`nav-drawer${open ? " open" : ""}`} aria-label="Navegación">
        <button
          type="button"
          className="mp-drawer-close"
          onClick={close}
          aria-label="Cerrar menú"
          tabIndex={open ? 0 : -1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="nav-title-dec">Hivrido PLAY</div>
        <ul className="nav-menu">
          {ITEMS.map((item, i) => (
            <li key={item.href}>
              <ScrambleLink
                label={item.label}
                href={item.href}
                index={i}
                delay={open ? `${i * 0.05 + 0.1}s` : "0s"}
                onClick={close}
              />
            </li>
          ))}
        </ul>
        <div className="nav-cta">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer">+ Contacto</a>
          <a href="mailto:hola@hivrido.com">hola@hivrido.com</a>
        </div>
      </nav>
    </>
  );
}
