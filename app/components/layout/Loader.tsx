"use client";
import { useEffect, useState, useRef } from "react";
import LogoAnimated from "../ui/LogoAnimated";

const LOADER_KEY = "hivrido_loader_seen";
const LOADER_EXPIRY = 1000 * 60 * 30; // 30 minutes

// Persists across component unmounts within the same JS session (survives navigation)
let hasShownThisSession = false;

const getInitialSkip = () => {
  if (hasShownThisSession) return true;
  if (typeof window === "undefined") return false;
  try {
    const seen = localStorage.getItem(LOADER_KEY);
    return !!seen && Date.now() - parseInt(seen, 10) < LOADER_EXPIRY;
  } catch {
    return false;
  }
};

export default function Loader({ onDone }: { onDone: () => void }) {
  const [skip] = useState(getInitialSkip);
  const [bar, setBar] = useState(false);
  const [hidden, setHidden] = useState(skip);
  const [count, setCount] = useState(skip ? 100 : 0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }

    // Mark as shown immediately so any re-mount skips the loader
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
  }, [skip, onDone]);

  if (skip) return null;

  return (
    <div className={`loader-wrap${hidden ? " hidden" : ""}`}>
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
