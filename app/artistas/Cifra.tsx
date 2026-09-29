"use client";

import { useEffect, useRef } from "react";

/**
 * Cifra de métrica que sube hasta su valor cuando entra en pantalla.
 *
 * El HTML del servidor trae el valor final —"5 M", "12 K"—: es lo que lee
 * Google y lo que ve quien no tiene JS. La animación se arma recién en el
 * cliente y solo si la cifra está debajo del pliegue; si ya está a la vista,
 * se queda quieta en vez de saltar a cero delante de alguien.
 *
 * Anima el número del principio y respeta el resto tal cual ("12 K",
 * "2,53 M"). Un valor sin número —"Diario"— pasa sin tocar.
 */
export default function Cifra({ valor }: { valor: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = valor.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
    if (!el || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const [, num, resto] = m;
    const coma = num.includes(",");
    const decimales = (num.split(/[.,]/)[1] ?? "").length;
    const fin = parseFloat(num.replace(",", "."));
    const pintar = (v: number) => {
      const txt = v.toFixed(decimales);
      el.textContent = (coma ? txt.replace(".", ",") : txt) + resto;
    };

    pintar(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const paso = (t: number) => {
          const p = Math.min((t - t0) / 1600, 1);
          pintar(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) frame = requestAnimationFrame(paso);
          else el.textContent = valor;
        };
        frame = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = valor;
    };
  }, [valor]);

  return <b ref={ref}>{valor}</b>;
}
