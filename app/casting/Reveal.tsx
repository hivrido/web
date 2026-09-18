"use client";

/**
 * Aparición al hacer scroll, para /casting.
 *
 * No usa GSAP a propósito. GSAP + ScrollTrigger son decenas de kilobytes de
 * JavaScript que esta ruta no importa hoy, y acá lo único que se anima es una
 * opacidad y un translate: el navegador ya sabe hacerlo. En un teléfono de
 * gama media con datos móviles esa descarga sale del presupuesto del LCP, que
 * es justo lo que esta página no puede gastar. Es la misma idea que
 * `app/components/ui/ScrollReveal.tsx`, con la comprobación de movimiento
 * reducido hecha explícita.
 *
 * El hero nunca se envuelve con esto: es el elemento del LCP y tiene que
 * pintarse con el HTML, sin esperar a que hidrate nada.
 *
 * Sin JavaScript el contenido se ve igual: el estado oculto lo pone este
 * efecto, no el CSS, así que si nunca corre no hay nada que revelar.
 *
 * `as` existe porque estos bloques suelen ser ítems de una lista: envolver un
 * <li> en un <div> rompe la lista para el lector de pantalla, así que el
 * componente rinde la etiqueta que le toca en vez de agregar una.
 */

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Etiqueta a rendir. Por defecto un <div>. */
  as?: "div" | "li" | "section" | "article";
  className?: string;
  /** Retardo en segundos, para escalonar hermanos. */
  delay?: number;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Movimiento reducido: no se prepara nada y el bloque queda como está. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Lo que ya está en pantalla al cargar no se anima: revelar algo que la
       persona está mirando es un parpadeo, no una entrada. */
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(22px)";
    el.style.transition = `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s`;

    const mostrar = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        mostrar();
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);

    /* Red de seguridad: si el observador no dispara —pestaña en segundo
       plano, restauración de scroll rara—, el contenido aparece igual. */
    const t = window.setTimeout(mostrar, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [delay]);

  const El = Tag as React.ElementType;

  return (
    <El ref={ref} className={className}>
      {children}
    </El>
  );
}
