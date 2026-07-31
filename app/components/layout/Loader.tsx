"use client";
import { useEffect, useState, useRef } from "react";
import LogoAnimated from "../ui/LogoAnimated";

const LOADER_KEY = "hivrido_loader_seen";
const LOADER_EXPIRY = 1000 * 60 * 30; // 30 minutes

// Persists across component unmounts within the same JS session (survives navigation)
let hasShownThisSession = false;

/** Solo se llama dentro de un efecto, nunca durante el render. */
const shouldSkip = () => {
  if (hasShownThisSession) return true;
  try {
    const seen = localStorage.getItem(LOADER_KEY);
    return !!seen && Date.now() - parseInt(seen, 10) < LOADER_EXPIRY;
  } catch {
    return false;
  }
};

export default function Loader({ onDone }: { onDone: () => void }) {
  const [bar, setBar] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [instant, setInstant] = useState(false);
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // La decisión se toma acá y no en el render: leer localStorage mientras
    // se renderiza hace que el servidor y el cliente produzcan HTML distinto,
    // React aborta la hidratación y el loader queda congelado en 0%.
    if (shouldSkip()) {
      // Se retira en el siguiente frame, sin transición.
      const id = requestAnimationFrame(() => {
        setInstant(true);
        setHidden(true);
        onDone();
      });
      return () => cancelAnimationFrame(id);
    }

    // Marcado apenas se muestra, para que cualquier re-montaje lo saltee
    hasShownThisSession = true;
    try { localStorage.setItem(LOADER_KEY, String(Date.now())); } catch { /* ignore */ }

    const forceHide = () => { setHidden(true); onDone(); };

    const t1 = setTimeout(() => setBar(true), 80);
    const t2 = setTimeout(forceHide, 1800);
    // Safety fallback in case something delays the normal timer
    const t3 = setTimeout(forceHide, 3000);

    let start: number | null = null;
    const duration = 1400;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onDone]);

  return (
    <div className={`loader-wrap${instant ? " instant" : ""}${hidden ? " hidden" : ""}`}>
      <div className="loader-inner">
        <div className="loader-logo">
          {/* Draw animation starts at 0ms — logo draws itself during loader */}
          <LogoAnimated delay={200} height={70} />
        </div>
        <div className={`loader-tagline${count >= 40 ? " visible" : ""}`}>
          Arte · Cultura · Tecnología
        </div>
      </div>
      <div className="loader-count">{count}%</div>
      <div className={`loader-bar${bar ? " full" : ""}`} />
    </div>
  );
}
