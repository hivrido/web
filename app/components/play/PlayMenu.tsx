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
 *
 * La home de RYTMOS usa este mismo cajón con su propia lista (el mapa de
 * app/lib/mapa.ts) y ahí sí se abre también en escritorio.
 */

import { useEffect, useRef } from "react";
import ScrambleLink from "../ui/ScrambleLink";
import { jumpTo } from "./jump";
import WaGeneral from "../../components/ui/WaGeneral";

/* Las secciones de la plataforma, más la salida al sitio institucional. */
export type MenuItem = { label: string; href: string };

const ITEMS: MenuItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/play/" },
  { label: "Series", href: "/play/#series" },
  { label: "Películas", href: "/play/#peliculas" },
  { label: "Próximamente", href: "/play/#proximamente" },
  { label: "Casting", href: "/casting/" },
  { label: "Hivrido", href: "/web/" },
];


export default function PlayMenu({
  open,
  onClose: close,
  items = ITEMS,
  title = "Hivrido PLAY",
  id,
}: {
  open: boolean;
  onClose: () => void;
  items?: MenuItem[];
  title?: string;
  id?: string;
}) {
  const cierre = useRef<HTMLButtonElement>(null);

  /* Escape cierra, como en los paneles del anillo. Al abrir, el foco entra
     al cajón; al cerrar vuelve a donde estaba (el botón que lo abrió). */
  useEffect(() => {
    if (!open) return;
    const antes = document.activeElement as HTMLElement | null;
    cierre.current?.focus({ preventScroll: true });
    return () => antes?.focus?.({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <div className={`nav-overlay-bg${open ? " open" : ""}`} onClick={close} />

      <nav id={id} className={`nav-drawer${open ? " open" : ""}`} aria-label="Navegación">
        <button
          ref={cierre}
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

        <div className="nav-title-dec">{title}</div>
        <ul className="nav-menu">
          {items.map((item, i) => (
            <li key={item.href}>
              <ScrambleLink
                label={item.label}
                href={item.href}
                index={i}
                delay={open ? `${i * 0.05 + 0.1}s` : "0s"}
                onClick={(e) => { close(); jumpTo(e, item.href); }}
              />
            </li>
          ))}
        </ul>
        <div className="nav-cta">
          <WaGeneral lugar="el menú">+ Contacto</WaGeneral>
          <a href="mailto:hola@hivrido.com">hola@hivrido.com</a>
        </div>
      </nav>
    </>
  );
}
