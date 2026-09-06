"use client";

/**
 * Entrada del menú de navegación: el número en violeta y la etiqueta que se
 * descifra al pasar por encima.
 *
 * Vivía dentro de Header; se saca acá porque el menú de Hivrido PLAY usa el
 * mismo gesto y duplicarlo garantizaba que los dos se fueran separando.
 *
 * No comparte código con `useScramble`: aquel resuelve el efecto con estado de
 * React y alfabeto katakana, para títulos que se descifran solos al entrar en
 * pantalla. Este escribe sobre el nodo en cada cuadro —sin re-renderizar— y
 * usa el alfabeto latino de la marca, porque se dispara con el puntero encima
 * y ahí un render por cuadro se nota.
 */

import { useCallback, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export default function ScrambleLink({ label, href, delay, onClick, index }: {
  label: string;
  href: string;
  delay: string;
  onClick: () => void;
  index: number;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    const el = labelRef.current;
    if (!el) return;
    if (numRef.current) numRef.current.style.color = "var(--gold)";
    let iteration = 0;
    const speed = 2.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => {
      el.textContent = label.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < iteration / speed) return label[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      if (iteration < label.length * speed) {
        iteration++;
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.textContent = label;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [label]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (labelRef.current) labelRef.current.textContent = label;
    if (numRef.current) numRef.current.style.color = "var(--violet-light)";
  }, [label]);

  /* El cuadro pendiente escribe sobre un nodo que puede haberse ido. */
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <a
      href={href}
      onClick={onClick}
      style={{ transitionDelay: delay }}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      <span ref={numRef} style={{ color: "var(--violet-light)", marginRight: 8, transition: "color 0.35s ease" }}>
        {String(index + 1).padStart(2, "0")}.
      </span>
      <span ref={labelRef}>{label}</span>
    </a>
  );
}
