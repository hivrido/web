"use client";

/**
 * Slider de portada de PLAY. Es lo primero que ve quien llega por el link de
 * un estreno, así que el arranque manda: el primer fondo lo precarga la
 * página, los demás se piden recién cuando les toca.
 *
 * En escritorio, con la página ya cargada, cada destacado con video corre su
 * tráiler en silencio detrás del contenido y se queda más tiempo en pantalla.
 * En teléfono, con ahorro de datos o con movimiento reducido no hay video:
 * queda el afiche.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FEATURED, type Entry } from "../../lib/catalog";
import { loadYouTubeApi, type YTPlayer } from "./CinePlayer";
import { Badges, ListIcon } from "./PosterCard";
import { useMyList } from "./library";

const SLIDE_MS = 8000;
const PREVIEW_MS = 24000;
const REVEAL_MS = 3500;

const hasPreview = (t: Entry) => !!t.ytId && !t.ytExternal;

function canPreview() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    document.readyState === "complete" &&
    matchMedia("(hover: hover) and (min-width: 1024px)").matches &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !conn?.saveData
  );
}

/** Tráiler mudo de fondo. Aparece recién cuando de verdad está corriendo. */
function HeroVideo({ ytId, zoom = 1 }: { ytId: string; zoom?: number }) {
  const mount = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let player: YTPlayer | null = null;
    let dead = false;
    let reveal: ReturnType<typeof setTimeout> | undefined;
    const box = mount.current;
    loadYouTubeApi().then((YT) => {
      if (dead || !box) return;
      const el = document.createElement("div");
      box.replaceChildren(el);
      player = new YT.Player(el, {
        videoId: ytId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
          modestbranding: 1, playsinline: 1, rel: 0, loop: 1, playlist: ytId,
          /* Los primeros segundos suelen ser placas y logos. */
          start: 6,
        },
        events: {
          onReady: () => { player?.mute(); player?.playVideo(); },
          /* YouTube muestra sus propios controles los primeros segundos de
             reproducción, aunque se le pidan apagados. El video aparece
             recién cuando ya los escondió; hasta entonces queda el afiche. */
          onStateChange: (e) => {
            clearTimeout(reveal);
            if (e.data === 1) reveal = setTimeout(() => setOn(true), REVEAL_MS);
            else setOn(false);
          },
        },
      });
    });
    return () => {
      dead = true;
      clearTimeout(reveal);
      player?.destroy();
      box?.replaceChildren();
    };
  }, [ytId]);

  return (
    /* inert además de aria-hidden: el iframe de YouTube es enfocable y, sin
       esto, el tabulador se metía en un video que nadie puede ver ni usar. */
    <div className={`hp-hero-video${on ? " is-on" : ""}`} aria-hidden="true" inert>
      <div ref={mount} className="hp-hero-video-frame" style={{ "--z": zoom } as React.CSSProperties} />
    </div>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  /* Qué fondos ya se pueden pintar: los slides ocultos igual descargan su
     imagen, así que cada uno entra cuando le toca. */
  const [painted, setPainted] = useState<number[]>([0]);
  const [preview, setPreview] = useState(false);
  /* Cuánto llevaba el slide cuando se le sumó el video: la barra arranca
     desde ahí en lugar de volver a cero. */
  const [offset, setOffset] = useState(0);
  const startRef = useRef(0);
  const currentRef = useRef(0);
  const { has, toggle } = useMyList();

  const total = preview ? PREVIEW_MS : SLIDE_MS;

  const show = useCallback((i: number) => {
    startRef.current = performance.now();
    currentRef.current = i;
    setCurrent(i);
    setPainted((p) => (p.includes(i) ? p : [...p, i]));
    setPreview(canPreview() && hasPreview(FEATURED[i]));
    setOffset(0);
  }, []);

  /* El primero: si la página termina de cargar mientras se lo mira, también
     suma su video. La barra sigue desde donde iba, no vuelve a cero. */
  useEffect(() => {
    startRef.current = performance.now();
    const onLoad = () => {
      if (!canPreview() || !hasPreview(FEATURED[0]) || currentRef.current !== 0) return;
      setOffset(performance.now() - startRef.current);
      setPreview(true);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    const left = total - (performance.now() - startRef.current);
    const t = setTimeout(() => show((current + 1) % FEATURED.length), Math.max(left, 400));
    return () => clearTimeout(t);
  }, [current, total, show]);

  /* El siguiente fondo se precarga cuando la página ya terminó: antes
     competía con el que se está mirando. */
  useEffect(() => {
    const next = FEATURED[(current + 1) % FEATURED.length];
    const run = () => { if (next?.hero) new Image().src = next.hero.image; };
    if (document.readyState === "complete") {
      const t = setTimeout(run, 600);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", run, { once: true });
    return () => window.removeEventListener("load", run);
  }, [current]);

  const f = FEATURED[current];
  const titled = !!f.hero?.titled;
  const saved = has(f.id);
  const meta = [
    f.type === "serie" ? f.seasons ?? "Serie" : f.detail?.format?.split("·")[0].trim() ?? "Película",
    f.year,
    f.duration && f.duration !== "—" ? f.duration : undefined,
    "Español",
  ].filter(Boolean);

  return (
    <section className={`hp-hero${titled ? " is-titled" : ""}`} aria-roledescription="carrusel" aria-label="Destacados">
      <div className="hp-hero-stage">
        {FEATURED.map((item, i) => (
          <div key={item.id} className={`hp-hero-slide${i === current ? " is-active" : ""}`} aria-hidden={i !== current}>
            <div
              className="hp-hero-img"
              style={painted.includes(i) ? { backgroundImage: `url('${item.hero!.image}')` } : undefined}
            />
            {i === current && preview && item.ytId && <HeroVideo ytId={item.ytId} zoom={item.ytZoom} />}
          </div>
        ))}
        <div className="hp-hero-shade" />
      </div>

      <div className="hp-hero-content" key={f.id}>
        <p className="hp-kicker">
          <span className="hp-kicker-dot" />
          {f.genre}
        </p>
        {/* Si el afiche ya trae el título pintado, el texto no lo repite:
            queda para lectores de pantalla y buscadores. */}
        <h1 className={titled ? "hp-sr" : "hp-hero-title"}>{f.title}</h1>
        <p className="hp-hero-meta">
          {meta.join("  ·  ")}
          <Badges item={f} hideNew />
        </p>
        <p className="hp-hero-desc">{f.synopsis.replace(/\s*\+18\.?$/, "")}</p>
        <div className="hp-hero-actions">
          <Link href={f.ytId ? `${f.href}#trailer` : f.href} className="hp-btn is-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            Ver ahora
          </Link>
          <Link href={f.href} className="hp-btn is-ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
            Más info
          </Link>
          <button
            type="button"
            className="hp-icon-btn is-lg"
            onClick={() => toggle(f.id)}
            aria-pressed={saved}
            aria-label={saved ? "Quitar de Mi lista" : "Agregar a Mi lista"}
          >
            <ListIcon saved={saved} />
          </button>
        </div>
      </div>

      <div className="hp-hero-progress" role="tablist" aria-label="Elegir destacado">
        {FEATURED.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={item.title}
            className={`hp-hero-tick${i === current ? " is-active" : ""}${i < current ? " is-done" : ""}`}
            onClick={() => i !== current && show(i)}
          >
            <span className="hp-hero-tick-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="hp-hero-tick-bar">
              {i === current && (
                <i
                  key={`${current}-${total}`}
                  style={{ animationDuration: `${total}ms`, animationDelay: `-${Math.round(offset)}ms` }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
