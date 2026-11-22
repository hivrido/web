"use client";

/**
 * Detrás de escena: stills y fotos de rodaje, con visor a pantalla completa.
 * El visor es un <dialog> modal: atrapa el foco, Escape lo cierra y el foco
 * vuelve a la foto que lo abrió. Las flechas del teclado pasan de foto.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Foto } from "./piezas";
import type { Imagen } from "../../lib/rytmos";

export default function Galeria({ fotos }: { fotos: Imagen[] }) {
  const visor = useRef<HTMLDialogElement>(null);
  const [actual, setActual] = useState(0);

  const abrir = (i: number) => {
    setActual(i);
    visor.current?.showModal();
  };
  const mover = useCallback((d: number) => setActual((i) => (i + d + fotos.length) % fotos.length), [fotos.length]);

  useEffect(() => {
    const dlg = visor.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (!dlg.open) return;
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    dlg.addEventListener("keydown", onKey);
    return () => dlg.removeEventListener("keydown", onKey);
  }, [mover]);

  const f = fotos[actual];

  return (
    <>
      <ul className="ry-gallery ry-stagger">
        {fotos.map((foto, i) => (
          <li key={foto.src} className="ry-shot ry-parallax" style={{ "--i": i % 6 } as React.CSSProperties}>
            <Foto img={foto} sizes="(max-width: 768px) 100vw, 66vw" />
            <button type="button" onClick={() => abrir(i)} aria-label={`Ver en grande: ${foto.alt}`} />
          </li>
        ))}
      </ul>

      <dialog ref={visor} className="ry-viewer" aria-label="Detrás de escena" onClick={(e) => e.target === e.currentTarget && visor.current?.close()}>
        <div className="ry-viewer-bar">
          <span>{String(actual + 1).padStart(2, "0")} / {String(fotos.length).padStart(2, "0")}</span>
          <button type="button" className="hp-icon-btn" onClick={() => visor.current?.close()} aria-label="Cerrar" autoFocus>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="ry-viewer-img">{f && <Foto key={f.src} img={f} sizes="100vw" />}</div>
        <div className="ry-viewer-nav">
          <button type="button" className="hp-icon-btn is-lg" onClick={() => mover(-1)} aria-label="Foto anterior">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="hp-icon-btn is-lg" onClick={() => mover(1)} aria-label="Foto siguiente">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </dialog>
    </>
  );
}
