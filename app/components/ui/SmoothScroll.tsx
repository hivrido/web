"use client";
import { useEffect } from "react";

/**
 * Scroll suave con Lenis, solo donde suma: mouse y rueda.
 *
 * En táctil el navegador ya tiene su propia inercia y es mejor que cualquier
 * imitación; con movimiento reducido no corresponde. En esos dos casos Lenis
 * ni se descarga. Tampoco hace falta avisarle a ScrollTrigger: Lenis mueve el
 * scroll real del documento y ScrollTrigger escucha ese mismo evento, así que
 * la sincronización que había acá solo servía para traer GSAP a cada ruta.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dead = false;
    let rafId = 0;
    let destroy = () => {};

    import("lenis").then(({ default: Lenis }) => {
      if (dead) return;
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      destroy = () => lenis.destroy();
    });

    return () => {
      dead = true;
      cancelAnimationFrame(rafId);
      destroy();
    };
  }, []);

  return null;
}
