"use client";

/**
 * Loop de video detrás del hero. Llega después que todo lo demás: se pide
 * recién cuando la página terminó de cargar y el navegador queda libre, y
 * nunca con movimiento reducido ni con ahorro de datos. Hasta que tiene
 * cuadros para mostrar, se ve el key art de abajo.
 *
 * Es mudo y tiene botón de pausa (WCAG 2.2.2: todo lo que se mueve más de
 * cinco segundos se tiene que poder detener).
 */

import { useEffect, useRef, useState } from "react";

type Nav = Navigator & { connection?: { saveData?: boolean } };

export default function Loop({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [activo, setActivo] = useState(false);
  const [listo, setListo] = useState(false);
  const [pausa, setPausa] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator as Nav).connection?.saveData) return;
    let id = 0;
    const arrancar = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      id = ric(() => setActivo(true));
    };
    if (document.readyState === "complete") arrancar();
    else window.addEventListener("load", arrancar, { once: true });
    return () => {
      window.removeEventListener("load", arrancar);
      (window.cancelIdleCallback ?? clearTimeout)(id);
    };
  }, []);

  if (!activo) return null;

  const alternar = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPausa(false); } else { v.pause(); setPausa(true); }
  };

  return (
    <>
      <video
        ref={ref}
        className={`ry-hero-loop${listo ? " is-on" : ""}`}
        src={src}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setListo(true)}
      />
      <button type="button" className="hp-icon-btn is-lg ry-pause" onClick={alternar} aria-pressed={pausa} aria-label={pausa ? "Reproducir el video de fondo" : "Pausar el video de fondo"}>
        {pausa ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
        )}
      </button>
    </>
  );
}
