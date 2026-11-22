"use client";

/**
 * El tráiler de RYTMOS, con carga diferida: hasta que alguien toca play solo
 * hay una portada liviana. Nada del reproductor se baja antes.
 *
 * - YouTube: el reproductor de PLAY (CinePlayer), que ya mide inicio, 25, 50
 *   y 75 % (`video_start`, `video_progress`).
 * - Archivo propio: un <video> nativo con subtítulos, que mide lo mismo.
 *
 * El "Ver tráiler" del hero baja hasta acá y lo arranca (evento
 * `rytmos:trailer`).
 */

import { useEffect, useRef, useState } from "react";
import CinePlayer from "../play/CinePlayer";
import { medir } from "../../lib/medir";
import type { Rytmos } from "../../lib/rytmos";

export const EVENTO_TRAILER = "rytmos:trailer";

function Archivo({ src, subtitulos, poster, titulo, arrancar }: { src: string; subtitulos?: string; poster?: string; titulo: string; arrancar: boolean }) {
  const [cargado, setCargado] = useState(arrancar);
  const ref = useRef<HTMLVideoElement>(null);
  const hitos = useRef(new Set<string>());

  useEffect(() => { if (arrancar) setCargado(true); }, [arrancar]);

  const una = (evento: string, extra: Record<string, number> = {}) => {
    const k = `${evento}${extra.video_percent ?? ""}`;
    if (hitos.current.has(k)) return;
    hitos.current.add(k);
    medir(evento, { video_title: titulo, video_provider: "propio", ...extra });
  };

  if (!cargado) {
    return (
      <button type="button" className="ry-trailer-facade" style={poster ? { backgroundImage: `url('${poster}')` } : undefined} onClick={() => setCargado(true)} aria-label={`Reproducir el tráiler de ${titulo}`}>
        <span className="hp-btn is-primary hp-haz">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          Ver tráiler
        </span>
      </button>
    );
  }

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      controls
      autoPlay
      playsInline
      preload="auto"
      onPlay={() => una("video_start")}
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (!v.duration) return;
        const pct = v.currentTime / v.duration;
        for (const p of [25, 50, 75]) if (pct >= p / 100) una("video_progress", { video_percent: p });
      }}
      onEnded={() => una("video_complete", { video_percent: 100 })}
    >
      {subtitulos && <track kind="subtitles" srcLang="es" label="Español" src={subtitulos} default />}
    </video>
  );
}

export default function Trailer({ serie, poster }: { serie: Rytmos; poster?: string }) {
  const [arrancar, setArrancar] = useState(false);
  const [toma, setToma] = useState(0);

  useEffect(() => {
    const ir = () => { setArrancar(true); setToma((n) => n + 1); };
    window.addEventListener(EVENTO_TRAILER, ir);
    return () => window.removeEventListener(EVENTO_TRAILER, ir);
  }, []);

  const t = serie.trailer;
  if (!t) return null;
  const titulo = `Tráiler de ${serie.nombre}`;

  return (
    <div className="ry-trailer-box">
      {"ytId" in t ? (
        <CinePlayer key={toma} ytId={t.ytId} title={titulo} poster={poster} label="Ver tráiler" autoStart={arrancar} />
      ) : (
        <Archivo key={toma} src={t.src} subtitulos={t.subtitulos} poster={poster} titulo={titulo} arrancar={arrancar} />
      )}
    </div>
  );
}

/** El botón "Ver tráiler" del hero: baja a la sección y arranca el video. */
export function VerTrailer() {
  return (
    <a
      href="#trailer"
      className="hp-btn is-primary hp-haz"
      data-medir="ver_trailer_click"
      data-medir-origen="hero"
      onClick={(e) => {
        const destino = document.getElementById("trailer");
        if (!destino) return;
        e.preventDefault();
        const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        destino.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "center" });
        history.replaceState(history.state, "", "#trailer");
        window.dispatchEvent(new Event(EVENTO_TRAILER));
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
      Ver tráiler
    </a>
  );
}
