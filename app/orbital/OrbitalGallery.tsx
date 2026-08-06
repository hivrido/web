"use client";

/**
 * Carrusel orbital — componente cliente.
 *
 * Reparto de responsabilidades:
 *   useOrbitalInput  → rueda, touch y arrastre → un ángulo amortiguado (refs)
 *   OrbitalScene     → Three.js, lee ese ángulo una vez por frame
 *   este componente  → estado del proyecto activo y overlay en Tailwind
 *
 * React solo re-renderiza cuando cambia el índice activo o se abre el panel.
 * El ángulo nunca pasa por el estado: viviría en 60 renders por segundo.
 *
 * El HUD es deliberadamente escaso: el título vive en la tarjeta, así que acá
 * solo quedan la entrada por disciplina, el contacto y la posición en el aro.
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import { PROJECTS } from "./projects";
import { cardTextureSize, makeCardTexture, readCardFonts, waitForFonts } from "./cards";
import { useOrbitalInput } from "./useOrbitalInput";
import type { OrbitConfig } from "./orbital-math";
import type { OrbitalScene } from "./OrbitalScene";

const ORBIT: OrbitConfig = {
  count: PROJECTS.length,
  radius: 5.4,
  // Amplitud grande a propósito: las vecinas del frente quedan una arriba y
  // otra abajo del cuadro, que es lo que hace visible la hélice.
  waveAmplitude: 1.25,
  waveFrequency: 2,
  strands: 2,
  coil: 0.7,
  roll: 0.11,
};

const WHATSAPP = "https://wa.me/5491156072460";

/** Puertas de entrada por disciplina: cada una lleva a su proyecto insignia. */
const ENTRIES = [
  { label: "Film y series", id: "okupas" },
  { label: "Identidad", id: "nebula" },
  { label: "Campañas", id: "docke" },
  { label: "Instalaciones", id: "oraculo" },
  { label: "IA / Agentes", id: "puny" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export default function OrbitalGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbitalScene | null>(null);

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [hintGone, setHintGone] = useState(false);

  const project = PROJECTS[active];

  const input = useOrbitalInput({
    count: ORBIT.count,
    onActiveChange: setActive,
  });

  /* Los accesos por disciplina se resuelven a índice una sola vez. */
  const entries = useMemo(
    () =>
      ENTRIES.map((e) => ({
        ...e,
        index: PROJECTS.findIndex((p) => p.id === e.id),
      })).filter((e) => e.index >= 0),
    []
  );

  /* El panel abierto congela el aro y se cierra con Escape */
  useEffect(() => {
    sceneRef.current?.setOpen(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* La escena registra su callback una sola vez, pero necesita el índice
     fresco: se lo damos por ref, sincronizada en un efecto. */
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = active; }, [active]);

  /* Click sobre una tarjeta: si ya está al frente abre, si no la trae */
  const handlePick = useCallback((index: number) => {
    if (index === activeRef.current) setOpen(true);
    else input.goTo(index);
  }, [input]);

  /* ── Montaje: texturas → escena → listeners ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let detach: (() => void) | undefined;

    (async () => {
      await waitForFonts();
      if (cancelled) return;

      // Las familias reales salen de las variables que inyecta next/font
      const fonts = readCardFonts(canvas.parentElement ?? document.documentElement);
      const size = cardTextureSize(matchMedia("(pointer: coarse)").matches);

      const textures: THREE.Texture[] = [];
      for (let i = 0; i < PROJECTS.length; i++) {
        textures.push(await makeCardTexture(PROJECTS[i], fonts, size));
        if (cancelled) return;
        setProgress(Math.round(((i + 1) / PROJECTS.length) * 100));
      }

      const { createOrbitalScene } = await import("./OrbitalScene");
      if (cancelled) return;

      sceneRef.current = await createOrbitalScene({
        canvas,
        textures,
        accents: PROJECTS.map((p) => p.accent),
        config: ORBIT,
        getTheta: () => input.thetaRef.current,
        onBeforeFrame: input.update,
        onPick: handlePick,
      });

      if (cancelled) { sceneRef.current?.dispose(); return; }

      detach = input.attach(canvas);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      detach?.();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // Se monta una sola vez: input y handlePick son estables por useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* La pista se retira al primer gesto */
  useEffect(() => {
    if (!ready) return;
    const dismiss = () => setHintGone(true);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    const t = setTimeout(dismiss, 10000);
    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [ready]);

  /* El acento del proyecto activo gobierna todo el HUD */
  const accentVars = useMemo(
    () => ({ "--ac": project.accent }) as React.CSSProperties,
    [project.accent]
  );

  return (
    <div className="orbital fixed inset-0 overflow-hidden bg-[#050a18] text-[#eef1fa]" style={accentVars}>
      {/* ── Viewport 3D ── */}
      <canvas
        ref={canvasRef}
        className="orbital-canvas fixed inset-0 h-full w-full touch-none"
        role="img"
        aria-label="Galería orbital de proyectos. Scrolleá, arrastrá o deslizá para girar."
      />

      <div className="pointer-events-none fixed inset-0 z-[1] orbital-vignette" aria-hidden />
      <div className="pointer-events-none fixed inset-0 z-[1] orbital-grain" aria-hidden />

      {/* ── Carga ── */}
      <div
        className={`fixed inset-0 z-50 grid place-content-center justify-items-center gap-7 bg-[#050a18] transition-opacity duration-700 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        role="status"
        aria-live="polite"
      >
        <p className="orbital-techno flex items-baseline gap-2.5 text-[clamp(1.3rem,4vw,2rem)] font-bold tracking-[.2em]">
          HIVRIDO<i className="orbital-dot orbital-dot--pulse" />
        </p>
        <div className="h-px w-[min(230px,58vw)] bg-white/10">
          <i className="block h-full bg-[var(--ac)] transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="orbital-mono text-[#4a5372]">{pad(progress)}</p>
      </div>

      {/* ── HUD ── */}
      <div
        className={`pointer-events-none fixed inset-0 z-10 flex flex-col transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <header className="flex items-start justify-between gap-6 px-[clamp(18px,4vw,52px)] pt-[clamp(18px,3vh,34px)]">
          <Link href="/" className="orbital-techno pointer-events-auto flex items-baseline gap-2 text-[13px] font-bold tracking-[.22em]">
            HIVRIDO<i className="orbital-dot" />
          </Link>

          <nav className="orbital-mono pointer-events-auto flex items-center gap-[clamp(12px,2vw,20px)]" aria-label="Secciones">
            <Link href="/" className="orbital-nav">Estudio</Link>
            <i className="orbital-nav-rule" aria-hidden />
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="orbital-nav">Contacto</a>
          </nav>
        </header>

        <div className="flex-1" />

        <footer className="orbital-foot">
          {/* Entradas por disciplina */}
          <div className="orbital-foot-nav pointer-events-auto">
            <p className="orbital-mono orbital-foot-label">¿Qué estás buscando?</p>

            <ul className="orbital-entries">
              {entries.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => input.goTo(e.index)}
                    className="orbital-entry orbital-mono"
                    data-on={e.index === active}
                  >
                    <span className="orbital-entry-arrow" aria-hidden>-&gt;</span>
                    {e.label}
                  </button>
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="orbital-pill orbital-mono"
            >
              Preguntame lo que quieras
            </a>
          </div>

          {/* Proyecto activo y posición en el aro */}
          <div className="orbital-foot-now pointer-events-auto">
            <div className="orbital-now-head" key={project.id}>
              <p className="orbital-mono orbital-enter text-[var(--ac)]">{project.category}</p>
              <h1
                className="orbital-techno orbital-enter mt-2 text-[clamp(1.1rem,2.4vw,1.6rem)] font-bold tracking-[.14em]"
                style={{ animationDelay: "60ms" }}
              >
                {project.title}
              </h1>
            </div>

            <button type="button" onClick={() => setOpen(true)} className="orbital-more orbital-mono">
              Ver proyecto <span aria-hidden>→</span>
            </button>

            <div className="orbital-now-meta">
              <span className="orbital-mono text-[var(--faint)]">
                <b className="text-white">{pad(active + 1)}</b> / {pad(PROJECTS.length)}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => input.step(-1)} className="orbital-arrow" aria-label="Proyecto anterior">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M15 5l-7 7 7 7" strokeLinecap="square" /></svg>
                </button>
                <button type="button" onClick={() => input.step(1)} className="orbital-arrow" aria-label="Proyecto siguiente">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M9 5l7 7-7 7" strokeLinecap="square" /></svg>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Pista de interacción ── */}
      <p
        className={`orbital-mono pointer-events-none fixed bottom-[clamp(16px,2.4vh,26px)] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 text-[#4a5372] transition-opacity duration-700 max-[1100px]:hidden ${
          ready && !hintGone ? "opacity-100" : "opacity-0"
        }`}
      >
        <i className="orbital-sweep" aria-hidden /> Scrolleá, arrastrá o deslizá <i className="orbital-sweep" aria-hidden />
      </p>

      {/* ── Panel de detalle ── */}
      <aside
        className={`orbital-panel ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="orbital-panel-title"
        aria-hidden={!open}
      >
        <button type="button" onClick={() => setOpen(false)} className="orbital-panel-close" aria-label="Cerrar detalle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18" strokeLinecap="square" /></svg>
        </button>

        <p className="orbital-mono text-[var(--ac)]">{project.index}</p>
        <h2 id="orbital-panel-title" className="orbital-techno mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.1] tracking-[.1em]">
          {project.title}
        </h2>
        <div className="orbital-rule mt-7" />

        <dl className="orbital-mono mt-7 grid grid-cols-[auto_1fr] gap-x-7 gap-y-3.5">
          <dt className="text-[#4a5372]">Cliente</dt><dd className="text-white">{project.client}</dd>
          <dt className="text-[#4a5372]">Año</dt><dd className="text-white">{project.year}</dd>
          <dt className="text-[#4a5372]">Disciplina</dt><dd className="text-white">{project.category}</dd>
        </dl>

        <p className="mt-8 max-w-[46ch] text-[.94rem] leading-[1.75] text-[#8b93b5]">{project.body}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((t) => <span key={t} className="orbital-tag">{t}</span>)}
        </div>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="orbital-pill orbital-mono mt-10 inline-flex"
        >
          Consultar por este proyecto <span aria-hidden>→</span>
        </a>
      </aside>

      <p className="sr-only" aria-live="polite">
        Proyecto {active + 1} de {PROJECTS.length}: {project.title}. {project.category}.
      </p>
    </div>
  );
}
