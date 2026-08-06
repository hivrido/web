"use client";

/**
 * Texto que se descifra carácter por carácter.
 *
 * Vivía dentro de Services; se saca acá porque la landing de diseño web usa
 * el mismo gesto y duplicarlo garantizaba que los dos se fueran separando.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export const MATRIX = "アイウエオカキクケコサシスセソ0123456789ABCDEF@#$%<>/|\\";

export function useScramble(original: string) {
  const [display, setDisplay] = useState(original);
  const raf = useRef<number | null>(null);

  const start = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    let frame = 0;
    const speed = 2;
    const total = original.length * speed + 10;

    const tick = () => {
      setDisplay(
        original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          // Los ya revelados quedan fijos; el resto sigue rotando.
          if (i < Math.floor(frame / speed)) return original[i];
          return MATRIX[Math.floor(Math.random() * MATRIX.length)];
        }).join("")
      );
      frame++;
      if (frame <= total) raf.current = requestAnimationFrame(tick);
      else setDisplay(original);
    };
    raf.current = requestAnimationFrame(tick);
  }, [original]);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setDisplay(original);
  }, [original]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return { display, start, stop };
}
