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
 * En escritorio no se monta nada visible: las secciones se leen sueltas en la
 * barra. play.css decide eso, no este archivo.
 */

import { useState } from "react";
import ScrambleLink from "../ui/ScrambleLink";

/* Las secciones de la plataforma, más la salida al sitio institucional. */
const ITEMS = [
  { label: "Inicio", href: "#catalogo" },
  { label: "Series", href: "#series" },
  { label: "Películas", href: "#peliculas" },
  { label: "Casting", href: "#casting" },
  { label: "Hivrido", href: "/web/" },
];

const WA_URL = "https://api.whatsapp.com/send?phone=5491156072460&text=Hola%20H%C3%ADvrido!";

export default function PlayMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <div
        className={`nav-btn-wrap mp-menu-btn${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); }
        }}
        role="button"
        tabIndex={0}
        aria-label="Menú"
        aria-expanded={open}
      >
        <span className="nav-btn-text">{open ? "Cerrar" : "Menu"}</span>
        <div className="nav-btn-lines">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={`nav-overlay-bg${open ? " open" : ""}`} onClick={close} />

      <nav className={`nav-drawer${open ? " open" : ""}`} aria-label="Navegación">
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
