"use client";

/**
 * Reproductor de Hivrido PLAY. Usa YouTube como fuente pero no su interfaz:
 * el iframe de YouTube muestra arriba el título y el canal, abajo "Mirar en
 * YouTube", al pausar sugiere otros videos y deja franjas negras cuando la
 * obra es más ancha que 16:9. Acá nada de eso se ve.
 *
 * - Antes de reproducir se muestra la portada propia con un botón de play: el
 *   iframe ni siquiera se carga hasta que alguien lo pide.
 * - El video se amplía con `zoom` hasta que la imagen llena el cuadro y las
 *   franjas quedan afuera. Cada obra trae el suyo en el catálogo.
 * - Los controles son de la casa (API de YouTube con `controls: 0`), y una capa
 *   transparente encima del iframe impide que aparezca la interfaz de YouTube
 *   al pasar el mouse.
 * - En pausa y al terminar vuelve la portada, que tapa las sugerencias.
 * - YouTube puede negarse a reproducir en cualquier momento: pide verificar que
 *   no sos un bot, bloquea el autoplay o no llega a cargar. Nada de eso puede
 *   dejar el spinner girando: si el embed se rechaza se reintenta por el otro
 *   host y, si no arranca, se ofrece verlo en YouTube.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { getProgress, saveProgress } from "./library";
import { medir } from "../../lib/medir";

/* Tipos mínimos de la API de YouTube que se usan acá. */
export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: (e: { data: number }) => void;
        onAutoplayBlocked?: () => void;
      };
    },
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* La API se carga una sola vez por página, aunque haya varios reproductores. */
let apiPromise: Promise<YTNamespace> | null = null;
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT!);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      /* Un bloqueador o la red cortada: la promesa se libera para que un
         reintento vuelva a pedir el script en lugar de heredar el fallo. */
      s.onerror = () => {
        apiPromise = null;
        s.remove();
        reject(new Error("No cargó la API de YouTube"));
      };
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

type Phase = "idle" | "loading" | "playing" | "paused" | "ended" | "failed";

/* El primero es el que se usa; el segundo, el reintento cuando se rechaza el
   embed. youtube-nocookie no lleva la sesión del visitante, y sin ella YouTube
   pide "confirmar que no sos un bot" más seguido. */
const HOSTS = ["https://www.youtube-nocookie.com", "https://www.youtube.com"];
/* Códigos de error de "este reproductor no puede mostrarlo": los demás (video
   borrado, id inválido) no cambian por probar con otro host. */
const EMBED_REFUSED = [101, 150, 152, 153];
/* Sin señal de arranque tras el ready: casi siempre, autoplay bloqueado sin
   aviso. Se devuelve el botón, porque un toque del visitante lo destraba. */
const NUDGE_MS = 6000;
/* Sin ninguna señal de YouTube: se da por caído. */
const STALL_MS = 15000;

export default function CinePlayer({
  ytId,
  title,
  poster,
  zoom = 1,
  label,
  autoStart = false,
  trackId,
}: {
  ytId: string;
  title: string;
  /** Portada que se ve antes de reproducir y en pausa. */
  poster?: string;
  /** Ampliación para recortar franjas negras (1 = sin recorte). */
  zoom?: number;
  /** Rótulo sobre el botón de play: "Ver tráiler", "Ver ahora"… */
  label?: string;
  /** Arranca solo al montarse (Okupas, al cambiar de episodio). */
  autoStart?: boolean;
  /** Obra a la que pertenece: si se pasa, se recuerda por dónde iba para
      "Seguir viendo" y se retoma desde ahí. */
  trackId?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const startingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>(autoStart ? "loading" : "idle");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const cover = poster ?? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;

  const release = useCallback(() => {
    clearTimeout(timerRef.current);
    playerRef.current?.destroy();
    playerRef.current = null;
    mountRef.current?.replaceChildren();
  }, []);

  const fail = useCallback(() => {
    release();
    setPhase("failed");
  }, [release]);

  /* Mientras se espera a YouTube siempre hay un reloj corriendo: ningún camino
     puede quedarse esperando una señal que no llega. */
  const expect = useCallback((ms: number, then: () => void) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(then, ms);
  }, []);

  const start = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      return;
    }
    if (startingRef.current) return;
    startingRef.current = true;
    expect(STALL_MS, fail);
    let YT: YTNamespace;
    try {
      YT = await loadYouTubeApi();
    } catch {
      startingRef.current = false;
      fail();
      return;
    }
    startingRef.current = false;
    const mount = mountRef.current;
    if (!mount) return;

    const open = (host: number) => {
      /* YouTube reemplaza el nodo que recibe por su iframe: se le da uno propio
         para que React no pierda el que maneja. */
      const el = document.createElement("div");
      mount.replaceChildren(el);
      playerRef.current = new YT.Player(el, {
        videoId: ytId,
        host: HOSTS[host],
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => {
            const p = playerRef.current;
            const dur = p?.getDuration() ?? 0;
            setDuration(dur);
            /* Retoma donde quedó, salvo que falte tan poco que no valga la pena. */
            const saved = trackId ? getProgress(trackId) : undefined;
            if (p && saved && saved.pos > 10 && saved.pos < dur - 15) p.seekTo(saved.pos, true);
            p?.playVideo();
            expect(NUDGE_MS, () => setPhase("paused"));
          },
          onStateChange: (e) => {
            /* Cargando: hay señal de vida, pero tampoco puede ser eterno. */
            if (e.data === 3) return expect(STALL_MS, fail);
            if (e.data === 1 || e.data === 2 || e.data === 0) clearTimeout(timerRef.current);
            if (e.data === 1) {
              setPhase("playing");
              setDuration(playerRef.current?.getDuration() ?? 0);
            } else if (e.data === 2) setPhase("paused");
            else if (e.data === 0) setPhase("ended");
          },
          onAutoplayBlocked: () => {
            clearTimeout(timerRef.current);
            setPhase("paused");
          },
          onError: (e) => {
            if (!EMBED_REFUSED.includes(e.data) || host + 1 >= HOSTS.length) return fail();
            release();
            expect(STALL_MS, fail);
            open(host + 1);
          },
        },
      });
    };
    open(0);
  }, [ytId, trackId, release, fail, expect]);

  /* Un reproductor por video: quien cambia de video (Okupas) remonta el
     componente con otra `key`, y acá solo se arranca y se libera. */
  useEffect(() => {
    if (autoStart) start();
    return release;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar
  }, []);

  /* El tiempo solo se consulta mientras reproduce. */
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setTime(playerRef.current?.getCurrentTime() ?? 0), 250);
    return () => clearInterval(t);
  }, [phase]);

  /* Medición con los nombres de video que GA4 ya reconoce: arranque, cada
     cuarto visto y final. Cada hito sale una vez por reproductor, aunque se
     pause, se adelante o se vuelva a ver. */
  const hitosRef = useRef(new Set<string>());
  const hito = useCallback(
    (evento: string, extra: Record<string, number> = {}) => {
      const key = evento + (extra.video_percent ?? "");
      if (hitosRef.current.has(key)) return;
      hitosRef.current.add(key);
      medir(evento, { video_title: title, video_id: ytId, video_provider: "youtube", ...extra });
    },
    [title, ytId],
  );
  useEffect(() => {
    if (phase === "playing") hito("video_start");
    if (phase === "ended") hito("video_complete");
  }, [phase, hito]);
  useEffect(() => {
    if (!duration) return;
    for (const p of [25, 50, 75]) if (time / duration >= p / 100) hito("video_progress", { video_percent: p });
  }, [time, duration, hito]);

  /* Progreso para "Seguir viendo": cada tanto mientras corre, y al pausar o
     terminar. Terminado cuenta como visto entero y sale de la fila. */
  useEffect(() => {
    const p = playerRef.current;
    if (!trackId || !p) return;
    const save = () => saveProgress(trackId, p.getCurrentTime(), p.getDuration());
    if (phase === "paused") save();
    if (phase === "ended") saveProgress(trackId, p.getDuration(), p.getDuration());
    if (phase !== "playing") return;
    const t = setInterval(save, 5000);
    return () => clearInterval(t);
  }, [phase, trackId]);

  useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === boxRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = () => {
    const p = playerRef.current;
    if (phase === "playing") return p?.pauseVideo();
    setPhase("loading");
    if (!p) return start();
    expect(STALL_MS, fail);
    p.playVideo();
  };

  const seek = (v: number) => {
    playerRef.current?.seekTo(v, true);
    setTime(v);
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) { p.unMute(); setMuted(false); }
    else { p.mute(); setMuted(true); }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else boxRef.current?.requestFullscreen?.();
  };

  const showCover = phase !== "playing";
  const started = phase !== "idle";
  const failed = phase === "failed";

  return (
    <div
      ref={boxRef}
      className={`cp${phase === "playing" ? " is-playing" : ""}${fullscreen ? " is-fs" : ""}`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
        if (e.key === "f") toggleFullscreen();
        if (e.key === "m") toggleMute();
      }}
    >
      {/* El iframe va ampliado para dejar afuera las franjas negras. */}
      <div ref={mountRef} className="cp-frame" style={{ transform: `scale(${zoom})` }} />

      {/* Tapa la interfaz de YouTube: los clics los toma el reproductor. */}
      <button
        type="button"
        className="cp-shield"
        onClick={toggle}
        aria-label={phase === "playing" ? `Pausar ${title}` : `Reproducir ${title}`}
      />

      {showCover && (
        <div className={`cp-cover${started ? " is-dim" : ""}`} style={{ backgroundImage: `url('${cover}')` }}>
          {failed ? (
            <div className="cp-failed" role="alert">
              <p>El video no pudo arrancar acá.</p>
              <div className="cp-failed-actions">
                <a className="cp-failed-btn is-primary" href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer">
                  Ver en YouTube
                </a>
                <button type="button" className="cp-failed-btn" onClick={toggle}>Reintentar</button>
              </div>
            </div>
          ) : (
            <button type="button" className="cp-big-play" onClick={toggle} aria-label={`Reproducir ${title}`}>
              {phase === "loading" ? (
                <span className="cp-spinner" aria-hidden="true" />
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
          )}
          {label && !started && <span className="cp-label">{label}</span>}
          {phase === "ended" && <span className="cp-label">Volver a ver</span>}
        </div>
      )}

      {started && phase !== "ended" && !failed && (
        <div className="cp-bar">
          <button type="button" className="cp-btn" onClick={toggle} aria-label={phase === "playing" ? "Pausar" : "Reproducir"}>
            {phase === "playing" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <span className="cp-time">{fmt(time)}</span>
          <input
            type="range"
            className="cp-seek"
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(time, duration || 1)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Posición del video"
            style={{ "--cp-pct": `${duration ? (time / duration) * 100 : 0}%` } as React.CSSProperties}
          />
          <span className="cp-time">{fmt(duration)}</span>
          <button type="button" className="cp-btn" onClick={toggleMute} aria-label={muted ? "Activar sonido" : "Silenciar"}>
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" /><path d="M23 9l-6 6M17 9l6 6" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" /><path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14" /></svg>
            )}
          </button>
          <button type="button" className="cp-btn" onClick={toggleFullscreen} aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
            {fullscreen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /></svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
