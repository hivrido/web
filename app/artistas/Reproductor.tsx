"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Barra de audio de la ficha.
 *
 * Fija abajo y a lo ancho desde que carga la página: el tema está a un clic
 * en cualquier punto del recorrido, y como es un solo `<audio>` que no se
 * desmonta, la música sigue sin cortes mientras se baja por la ficha.
 *
 * `preload="metadata"`: se baja la duración, no el tema. Los 2,6 MB llegan
 * recién cuando alguien pide escucharlo.
 */

type Props = {
  src: string;
  titulo: string;
  artista: string;
  /** Crédito que acompaña al título ("DJ Cofla"). */
  credito?: string;
  /** Miniatura cuadrada o 16:9; se recorta al cuadrado. */
  portada?: string;
};

function mmss(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function Reproductor({ src, titulo, artista, credito, portada }: Props) {
  const audio = useRef<HTMLAudioElement>(null);

  const [sonando, setSonando] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [volumen, setVolumen] = useState(0.8);
  const [mudo, setMudo] = useState(false);

  const alternar = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setSonando(false));
    else el.pause();
  }, []);

  const saltar = (seg: number) => {
    const el = audio.current;
    if (el) el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + seg));
  };

  const buscar = (valor: number) => {
    const el = audio.current;
    if (el && Number.isFinite(el.duration)) el.currentTime = valor;
  };

  /* La UI refleja el estado real del elemento, no el que supone el botón:
     un pause desde el teclado multimedia o la pantalla bloqueada también
     se ve. */
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onPlay = () => setSonando(true);
    const onPause = () => setSonando(false);
    const onTime = () => setTiempo(el.currentTime);
    const onMeta = () => setDuracion(el.duration);
    const onEnd = () => {
      setSonando(false);
      el.currentTime = 0;
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("ended", onEnd);
    if (el.readyState >= 1) onMeta();
    return () => {
      el.pause();
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = volumen;
    el.muted = mudo;
  }, [volumen, mudo]);

  /* Pantalla bloqueada y controles del sistema. */
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: titulo,
      artist: credito ? `${artista} · ${credito}` : artista,
      album: "Hivrido",
      ...(portada && { artwork: [{ src: portada }] }),
    });
    navigator.mediaSession.setActionHandler("play", () => audio.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.current?.pause());
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [titulo, artista, credito, portada]);

  const progreso = duracion ? (tiempo / duracion) * 100 : 0;
  const nivel = mudo ? 0 : volumen;

  return (
    <div className={`art-barra${sonando ? " is-sonando" : ""}`} role="region" aria-label={`Reproductor: ${titulo}`}>
      <audio ref={audio} src={src} preload="metadata" />

      {/* El progreso es el filo superior de la barra, y se arrastra. */}
      <input
        type="range"
        className="art-barra-progreso"
        min={0}
        max={duracion || 0}
        step={0.1}
        value={tiempo}
        onChange={(e) => buscar(Number(e.target.value))}
        style={{ "--p": `${progreso}%` } as React.CSSProperties}
        aria-label={`Posición en ${titulo}`}
        aria-valuetext={`${mmss(tiempo)} de ${mmss(duracion)}`}
      />

      <div className="art-barra-tema">
        <span className="art-barra-portada">
          {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de 64px de YouTube; next/image no suma nada con `unoptimized` */}
          {portada && <img src={portada} alt="" width={64} height={64} loading="lazy" />}
        </span>
        <span className="art-barra-texto">
          <b>{titulo}</b>
          <span>
            {artista}
            {credito && ` · con ${credito}`}
          </span>
        </span>
      </div>

      <div className="art-barra-controles">
        <button type="button" className="art-barra-salto" onClick={() => saltar(-10)} aria-label="Retroceder 10 segundos">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 5h2v14H6zM20 5.5v13a.8.8 0 0 1-1.25.66L9.5 12.66a.8.8 0 0 1 0-1.32l9.25-6.5A.8.8 0 0 1 20 5.5Z" />
          </svg>
        </button>
        <button
          type="button"
          className="art-barra-play"
          onClick={alternar}
          aria-label={sonando ? `Pausar ${titulo}` : `Reproducir ${titulo}`}
        >
          {sonando ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>
        <button type="button" className="art-barra-salto" onClick={() => saltar(10)} aria-label="Adelantar 10 segundos">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16 5h2v14h-2zM4 5.5v13a.8.8 0 0 0 1.25.66l9.25-6.5a.8.8 0 0 0 0-1.32L5.25 4.84A.8.8 0 0 0 4 5.5Z" />
          </svg>
        </button>
      </div>

      <div className="art-barra-extra">
        <span className="art-barra-tiempo">
          {mmss(tiempo)} / {mmss(duracion)}
        </span>
        <button
          type="button"
          className="art-barra-mudo"
          onClick={() => setMudo((m) => !m)}
          aria-label={mudo ? "Activar sonido" : "Silenciar"}
          aria-pressed={mudo}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            {mudo ? <path d="m17 9 5 6m0-6-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7" />}
          </svg>
        </button>
        <input
          type="range"
          className="art-barra-volumen"
          min={0}
          max={1}
          step={0.01}
          value={nivel}
          onChange={(e) => {
            setVolumen(Number(e.target.value));
            setMudo(false);
          }}
          style={{ "--p": `${nivel * 100}%` } as React.CSSProperties}
          aria-label="Volumen"
        />
      </div>
    </div>
  );
}
