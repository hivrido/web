"use client";

/**
 * Fondo de colmena. Es decorativo y vive detrás del contenido de su sección.
 *
 * Lo que sale del servidor es un patrón de hexágonos en CSS: eso es el
 * respaldo y también lo que queda con ahorro de datos o en equipos que no
 * dan. El shader —los pulsos de luz, la reacción al puntero y al scroll— se
 * suma cuando el navegador queda libre y la sección está en pantalla.
 */

import { useEffect, useRef, useState } from "react";
import { deviceTier, lowBattery, reducedMotion, whenIdle } from "./quality";
import type { HiveScene } from "./hive-gl";
import "./immersive.css";

export default function Hive({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const tier = deviceTier();
    if (tier === 0) return;

    let scene: HiveScene | null = null;
    let dead = false;
    let visible = false;
    let asked = false;
    let cancelIdle = () => {};
    const sync = () => scene?.setRunning(visible && !document.hidden);

    const boot = async () => {
      if (dead || scene) return;
      if (await lowBattery()) return;
      const { createHive } = await import("./hive-gl");
      if (dead) return;
      const made = await createHive(cv, { tier, still: reducedMotion(), onReady: () => !dead && setLive(true) });
      if (dead) { made?.dispose(); return; }
      scene = made;
      sync();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !scene && !asked) { asked = true; cancelIdle = whenIdle(boot, { waitForGesture: tier < 2 }); }
      sync();
    });
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
    <div ref={box} className={`hive${live ? " is-live" : ""} ${className}`} aria-hidden="true">
      <canvas ref={canvas} className="hive-gl" />
    </div>
  );
}
