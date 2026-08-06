"use client";

/**
 * Columna de caracteres que cae al pasar el mouse.
 *
 * Cada instancia arranca con su propio retardo y su propia cadencia: si todas
 * latieran juntas se leería como un parpadeo y no como lluvia.
 */

import { useEffect, useRef, useState } from "react";
import { MATRIX } from "./useScramble";

const BLANK = Array(6).fill(" ");

export default function MatrixCol({
  active,
  delay = 0,
  right,
  color = "#FF1B8D",
  glow = "#7C3AED",
}: {
  active: boolean;
  delay?: number;
  right: number;
  color?: string;
  glow?: string;
}) {
  const [chars, setChars] = useState<string[]>(BLANK);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;

    const tick = () =>
      setChars(Array.from({ length: 6 }, () => MATRIX[Math.floor(Math.random() * MATRIX.length)]));

    tout.current = setTimeout(() => {
      tick();
      timer.current = setInterval(tick, 65 + delay * 20);
    }, delay * 55);

    return () => {
      if (timer.current) clearInterval(timer.current);
      if (tout.current) clearTimeout(tout.current);
    };
  }, [active, delay]);

  return (
    <span
      className="svc-matrix-col"
      aria-hidden
      style={{
        right,
        color,
        fontSize: "0.75rem",
        fontFamily: "var(--font-display)",
        textShadow: `0 0 8px ${color}80, 0 0 4px ${glow}40`,
      }}
    >
      {(active ? chars : BLANK).map((ch, i) => (
        // La estela se apaga hacia abajo: la cabeza es la que se lee.
        <span key={i} style={{ opacity: Math.max(0, 0.8 - i * 0.12), display: "block" }}>{ch}</span>
      ))}
    </span>
  );
}
