"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reproductor de audio de la ficha.
 *
 * Una sola etiqueta `<audio>` y dos caras: el bloque grande —disco que gira,
 * espectro en vivo, barra para adelantar— y un dock fijo abajo que aparece
 * cuando el bloque sale de pantalla con el tema sonando. El dock no es otro
 * reproductor: maneja el mismo elemento, así que la música sigue sin un
 * corte mientras se recorre el resto de la ficha.
 *
 * El espectro sale de un AnalyserNode de Web Audio, que se crea recién con
 * el primer play: los navegadores no dejan arrancar un AudioContext sin un
 * gesto, y quien nunca toca play no paga ni el contexto ni el canvas
 * dibujando. `preload="metadata"` por lo mismo: se baja la duración, no los
 * 2,6 MB del tema.
 *
 * Sin Web Audio —o con movimiento reducido— el espectro queda quieto y todo
 * lo demás funciona igual.
 */

type Props = {
  src: string;
  titulo: string;
  artista: string;
  /** Crédito que acompaña al título ("con DJ Cofla"). */
  credito?: string;
  /** Lo que va impreso en la etiqueta del disco: la leyenda del emblema. */
  sello: string;
};

const BARRAS = 48;

function mmss(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function Reproductor({ src, titulo, artista, credito, sello }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const bloque = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const analizador = useRef<AnalyserNode | null>(null);
  const contexto = useRef<AudioContext | null>(null);

  const [sonando, setSonando] = useState(false);
  const [empezo, setEmpezo] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [fuera, setFuera] = useState(false);
  const [dockCerrado, setDockCerrado] = useState(false);

  /* Web Audio se engancha una sola vez: `createMediaElementSource` tira error
     si se lo llama dos veces sobre el mismo elemento. */
  const conectar = useCallback(() => {
    const el = audio.current;
    if (!el || contexto.current) return;
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    try {
      const ctx = new Ctx();
      const fuente = ctx.createMediaElementSource(el);
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.82;
      fuente.connect(an);
      an.connect(ctx.destination);
      contexto.current = ctx;
      analizador.current = an;
    } catch {
      /* Sin espectro, pero con sonido: el elemento sigue saliendo directo. */
    }
  }, []);

  const alternar = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      conectar();
      void contexto.current?.resume();
      el.play().catch(() => setSonando(false));
    } else {
      el.pause();
    }
  }, [conectar]);

  const saltar = (seg: number) => {
    const el = audio.current;
    if (el) el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + seg));
  };

  const buscar = (valor: number) => {
    const el = audio.current;
    if (el && Number.isFinite(el.duration)) el.currentTime = valor;
  };

  /* Eventos del elemento: la UI refleja el estado real del audio, no el que
     supone el botón. Así un pause desde el teclado multimedia o desde la
     pantalla bloqueada del teléfono también se ve. */
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onPlay = () => {
      setSonando(true);
      setEmpezo(true);
      setDockCerrado(false);
    };
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
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  /* Pantalla bloqueada y controles del sistema. */
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: titulo,
      artist: credito ? `${artista} · ${credito}` : artista,
      album: "Hivrido",
    });
    navigator.mediaSession.setActionHandler("play", () => audio.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.current?.pause());
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [titulo, artista, credito]);

  /* El dock se muestra cuando el bloque grande sale de pantalla. */
  useEffect(() => {
    const el = bloque.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFuera(!e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Al irse de la ficha se corta el sonido y se libera el contexto. */
  useEffect(() => {
    const el = audio.current;
    return () => {
      el?.pause();
      void contexto.current?.close();
    };
  }, []);

  /* Espectro. Corre solo mientras suena; en pausa queda la última forma,
     que se lee como el tema congelado en vez de una línea muerta. */
  useEffect(() => {
    const cv = lienzo.current;
    if (!cv || !sonando) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const an = analizador.current;
    if (!an) return;
    const g = cv.getContext("2d");
    if (!g) return;

    const color = getComputedStyle(cv).color;
    const datos = new Uint8Array(an.frequencyBinCount);
    let frame = 0;

    const dibujar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (cv.width !== w * dpr || cv.height !== h * dpr) {
        cv.width = w * dpr;
        cv.height = h * dpr;
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      an.getByteFrequencyData(datos);

      const paso = w / BARRAS;
      const ancho = Math.max(2, paso * 0.46);
      g.fillStyle = color;
      g.shadowColor = color;
      g.shadowBlur = 12;
      /* Solo el tramo bajo y medio del espectro: arriba de eso, en un
         master de 64 kbps, no hay nada que mirar. */
      const tramo = Math.floor(datos.length * 0.7);
      for (let i = 0; i < BARRAS; i++) {
        const v = datos[Math.floor((i / BARRAS) * tramo)] / 255;
        const alto = Math.max(2, v * v * h * 0.95);
        g.globalAlpha = 0.35 + v * 0.65;
        g.fillRect(i * paso + (paso - ancho) / 2, (h - alto) / 2, ancho, alto);
      }
      frame = requestAnimationFrame(dibujar);
    };
    frame = requestAnimationFrame(dibujar);
    return () => cancelAnimationFrame(frame);
  }, [sonando]);

  const progreso = duracion ? (tiempo / duracion) * 100 : 0;
  const verDock = empezo && fuera && !dockCerrado;

  const iconoPlay = (tam: number) =>
    sonando ? (
      <svg width={tam} height={tam} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    ) : (
      <svg width={tam} height={tam} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
      </svg>
    );

  return (
    <>
      <audio ref={audio} src={src} preload="metadata" />

      <div
        ref={bloque}
        className={`art-rep${sonando ? " is-sonando" : ""}`}
      >
        {/* El disco: surcos, etiqueta con la dosis y un brillo que gira con
            él. Decorativo; el estado lo dice el botón. */}
        <div className="art-rep-disco" aria-hidden>
          <div className="art-rep-vinilo">
            <span className="art-rep-etiqueta">
              <b>{sello}</b>
              <small>{titulo}</small>
            </span>
          </div>
          <span className="art-rep-brazo" />
        </div>

        <div className="art-rep-cuerpo">
          <p className="art-rep-estado">
            <span className="art-rep-led" aria-hidden />
            {sonando ? "Sonando ahora" : "Escuchá"}
          </p>
          <h3 className="art-rep-titulo">{titulo}</h3>
          <p className="art-rep-credito">
            {artista}
            {credito && <> · con {credito}</>}
          </p>

          <canvas ref={lienzo} className="art-rep-espectro" aria-hidden />

          <div className="art-rep-linea">
            <span>{mmss(tiempo)}</span>
            <input
              type="range"
              className="art-rep-barra"
              min={0}
              max={duracion || 0}
              step={0.1}
              value={tiempo}
              onChange={(e) => buscar(Number(e.target.value))}
              style={{ "--p": `${progreso}%` } as React.CSSProperties}
              aria-label={`Posición en ${titulo}`}
              aria-valuetext={`${mmss(tiempo)} de ${mmss(duracion)}`}
            />
            <span>{mmss(duracion)}</span>
          </div>

          <div className="art-rep-controles">
            <button type="button" className="art-rep-salto" onClick={() => saltar(-10)} aria-label="Retroceder 10 segundos">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>10</span>
            </button>
            <button
              type="button"
              className="art-rep-play"
              onClick={alternar}
              aria-label={sonando ? `Pausar ${titulo}` : `Reproducir ${titulo}`}
            >
              {iconoPlay(28)}
            </button>
            <button type="button" className="art-rep-salto" onClick={() => saltar(10)} aria-label="Adelantar 10 segundos">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              <span>10</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Dock ── */}
      <div
        className={`art-dock${verDock ? " is-visible" : ""}${sonando ? " is-sonando" : ""}`}
        aria-hidden={!verDock}
        inert={!verDock}
      >
        <span className="art-dock-progreso" style={{ width: `${progreso}%` }} />
        <span className="art-dock-disco" aria-hidden />
        <button
          type="button"
          className="art-dock-info"
          onClick={() => bloque.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
          aria-label="Volver al reproductor"
        >
          <b>{titulo}</b>
          <span>
            {artista} · {mmss(tiempo)}
          </span>
        </button>
        <span className="art-dock-ondas" aria-hidden>
          <i /><i /><i /><i />
        </span>
        <button
          type="button"
          className="art-dock-play"
          onClick={alternar}
          aria-label={sonando ? `Pausar ${titulo}` : `Reproducir ${titulo}`}
        >
          {iconoPlay(18)}
        </button>
        <button
          type="button"
          className="art-dock-cerrar"
          onClick={() => {
            audio.current?.pause();
            setDockCerrado(true);
          }}
          aria-label="Cerrar reproductor"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </>
  );
}
