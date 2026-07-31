"use client";
import { useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface Props {
  text: string;
  tag?: "h1" | "h2" | "h3" | "span" | "div" | "p";
  className?: string;
}

export default function GlitchText({ text, tag: Tag = "span", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    let iteration = 0;
    const original = text;
    const speed = 2.5;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = () => {
      el.textContent = original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < iteration / speed) return original[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iteration < original.length * speed) {
        iteration++;
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.textContent = original;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [text]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (ref.current) ref.current.textContent = text;
  }, [text]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {text}
    </Tag>
  );
}
