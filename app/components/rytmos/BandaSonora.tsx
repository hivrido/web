"use client";

/**
 * Banda sonora original. Nunca suena sola: el audio arranca cuando alguien
 * toca play, y recién ahí se crea el contexto de Web Audio que alimenta los
 * visuales —barras en la luz de la marca que siguen la música—. Con
 * movimiento reducido las barras no se dibujan.
 */

import { useEffect, useRef, useState } from "react";
import { medir } from "../../lib/medir";
import type { Tema } from "../../lib/rytmos";

export default function BandaSonora({ temas, serie }: { temas: Tema[]; serie: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const grafo = useRef<{ ctx: AudioContext; an: AnalyserNode } | null>(null);
  const [sonando, setSonando] = useState<number | null>(null);

  /* Las barras: solo mientras suena algo. */
  useEffect(() => {
    const cv = lienzo.current;
    const g = grafo.current;
    if (sonando === null || !cv || !g || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = cv.getContext("2d")!;
    const datos = new Uint8Array(g.an.frequencyBinCount);
    const neon = getComputedStyle(cv).getPropertyValue("--hp-neon").trim() || "#ac4fc6";
    let raf = 0;
    const dibujar = () => {
      raf = requestAnimationFrame(dibujar);
      const w = (cv.width = cv.clientWidth * devicePixelRatio);
      const h = (cv.height = cv.clientHeight * devicePixelRatio);
      g.an.getByteFrequencyData(datos);
      const n = 48;
      const paso = w / n;
      c.clearRect(0, 0, w, h);
      c.fillStyle = neon;
      c.shadowColor = neon;
      c.shadowBlur = 18;
      for (let i = 0; i < n; i++) {
        const v = datos[Math.floor((i / n) * datos.length * 0.7)] / 255;
        const alto = Math.max(2, v * h);
        c.fillRect(i * paso + paso * 0.2, h - alto, paso * 0.6, alto);
      }
    };
    dibujar();
    return () => cancelAnimationFrame(raf);
  }, [sonando]);

  useEffect(() => () => void grafo.current?.ctx.close(), []);

  const tocar = (i: number) => {
    const a = audio.current;
    if (!a) return;
    if (sonando === i) {
      a.pause();
      setSonando(null);
      return;
    }
    if (!grafo.current) {
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      ctx.createMediaElementSource(a).connect(an);
      an.connect(ctx.destination);
      grafo.current = { ctx, an };
    }
    void grafo.current.ctx.resume();
    a.src = temas[i].src;
    void a.play();
    setSonando(i);
    medir("ost_play", { tema: temas[i].titulo, serie });
  };

  return (
    <>
      <ol className="ry-tracks">
        {temas.map((t, i) => (
          <li key={t.src} className="ry-track">
            <button type="button" className={`hp-icon-btn is-lg${sonando === i ? " is-primary" : ""}`} onClick={() => tocar(i)} aria-pressed={sonando === i} aria-label={`${sonando === i ? "Pausar" : "Escuchar"} ${t.titulo}`}>
              {sonando === i ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <div>
              <p className="ry-track-t">{t.titulo}</p>
              {t.autor && <p className="ry-track-a">{t.autor}</p>}
            </div>
            <span className="ry-track-a">{String(i + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ol>
      <canvas ref={lienzo} className="ry-viz" aria-hidden="true" />
      <audio ref={audio} preload="none" crossOrigin="anonymous" onEnded={() => setSonando(null)} />
    </>
  );
}
