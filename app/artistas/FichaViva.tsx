"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * La ficha del roster con el volumen de las tarjetas del anillo.
 *
 * En la portada las tarjetas son planos en 3D: giran en perspectiva, flotan
 * sobre el resto y el borde neón se enciende con el cursor. Acá se traduce a
 * CSS sin tocar WebGL: el puntero inclina la pieza, las capas de tipografía
 * se separan en Z y una luz especular sigue al cursor sobre la cara.
 *
 * El puntero no pasa por el estado de React: se escribe en variables CSS
 * dentro de un rAF, así un movimiento no re-renderiza nada y no se escribe
 * más de una vez por cuadro.
 *
 * La entrada al hacer scroll solo se arma si el JS corre: sin él, la ficha
 * se ve quieta y entera en vez de quedar escondida esperando una clase.
 */

const TILT = 7; // grados máximos de giro, el del anillo al pasar el cursor

type Props = {
  href: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function FichaViva({ href, style, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) return;

    /* Entrada: solo las que todavía no se ven. Una ficha que ya está en
       pantalla al cargar no tiene que desaparecer para volver a entrar. */
    let io: IntersectionObserver | undefined;
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight) {
      el.dataset.entra = "espera";
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          el.dataset.entra = "si";
          io?.disconnect();
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(el);
    }

    // La inclinación es para un cursor: con el dedo no hay "pasar por encima".
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => io?.disconnect();
    }

    let raf = 0;
    let x = 0.5;
    let y = 0.5;

    const pintar = () => {
      raf = 0;
      el.style.setProperty("--ry", `${((x - 0.5) * 2 * TILT).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 2 * TILT * 0.7).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    };

    const mover = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      x = Math.min(1, Math.max(0, (e.clientX - b.left) / b.width));
      y = Math.min(1, Math.max(0, (e.clientY - b.top) / b.height));
      if (!raf) raf = requestAnimationFrame(pintar);
    };

    const soltar = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", soltar);
    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", soltar);
    };
  }, []);

  return (
    <Link ref={ref} href={href} className="art-ficha" style={style}>
      {children}
    </Link>
  );
}
