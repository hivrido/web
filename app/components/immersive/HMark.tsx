"use client";

/**
 * El símbolo H▷ de la marca.
 *
 * Lo que sale del servidor es un SVG: cromo en degradado y tubos de neón que
 * se encienden de abajo hacia arriba con CSS puro. Eso es lo que se ve al
 * instante, sin esperar una línea de JavaScript, y es también la versión
 * completa para quien no tiene WebGL, navega con ahorro de datos o tiene un
 * equipo que no da.
 *
 * El 3D se suma encima cuando el navegador queda libre y el símbolo está en
 * pantalla: mismo encuadre, así que el lienzo funde sobre el SVG sin salto.
 * Con movimiento reducido se dibuja un solo cuadro, quieto.
 */

import { useEffect, useRef, useState } from "react";
import { HMARK_HOLE_PATH, HMARK_OUTER_PATH, HMARK_PATH, VIEW } from "./hmark-shape";
import { deviceTier, lowBattery, reducedMotion, whenIdle } from "./quality";
import type { HMarkScene } from "./hmark-gl";
import "./immersive.css";

export default function HMark({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const tier = deviceTier();
    if (tier === 0) return;

    let scene: HMarkScene | null = null;
    let dead = false;
    let visible = false;
    let asked = false;
    let cancelIdle = () => {};

    const sync = () => scene?.setRunning(visible && !document.hidden);

    const boot = async () => {
      if (dead || scene) return;
      if (await lowBattery()) return;
      const { createHMark } = await import("./hmark-gl");
      if (dead) return;
      const made = await createHMark(cv, { tier, still: reducedMotion(), onReady: () => !dead && setLive(true) });
      if (dead) { made?.dispose(); return; }
      scene = made;
      sync();
    };

    // Solo se pide el 3D si el símbolo llega a verse.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !scene && !asked) { asked = true; cancelIdle = whenIdle(boot, { waitForGesture: tier < 2 }); }
      sync();
    }, { rootMargin: "80px" });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      dead = true;
      cancelIdle();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={box} className={`hm${live ? " is-live" : ""} ${className}`} aria-hidden="true">
      <svg className="hm-svg" viewBox={`0 0 ${VIEW} ${VIEW}`} focusable="false">
        <defs>
          <linearGradient id="hm-chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5F259F" />
            <stop offset="0.3" stopColor="#3C1053" />
            <stop offset="0.47" stopColor="#8246AF" />
            <stop offset="0.5" stopColor="#F4ECFF" />
            <stop offset="0.53" stopColor="#3C1053" />
            <stop offset="0.8" stopColor="#1A0B2B" />
            <stop offset="1" stopColor="#0D0717" />
          </linearGradient>
          <linearGradient id="hm-wipe" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fff" />
            <stop className="hm-wipe-a" offset="1" stopColor="#fff" />
            <stop className="hm-wipe-b" offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="hm-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW} height={VIEW}>
            <rect className="hm-wipe-rect" width={VIEW} height={VIEW} fill="#fff" />
          </mask>
        </defs>
        <path d={HMARK_PATH} fill="url(#hm-chrome)" fillRule="evenodd" />
        {/* Tubos apagados, siempre a la vista; encima, los mismos encendidos. */}
        <g fill="none" strokeLinejoin="miter" strokeWidth="14" stroke="#3C1053">
          <path d={HMARK_OUTER_PATH} />
          <path d={HMARK_HOLE_PATH} />
        </g>
        <g className="hm-neon" mask="url(#hm-mask)" fill="none" strokeLinejoin="miter">
          <g stroke="#AC4FC6" strokeWidth="14">
            <path d={HMARK_OUTER_PATH} />
            <path d={HMARK_HOLE_PATH} />
          </g>
          <g stroke="#F6E6FF" strokeWidth="4">
            <path d={HMARK_OUTER_PATH} />
            <path d={HMARK_HOLE_PATH} />
          </g>
        </g>
      </svg>
      <canvas ref={canvas} className="hm-gl" />
    </div>
  );
}
