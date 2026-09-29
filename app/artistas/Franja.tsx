"use client";

import { useEffect, useRef } from "react";

/**
 * La franja que corre bajo el hero: el vocabulario del artista pasando de
 * derecha a izquierda, palabras llenas y caladas alternadas.
 *
 * El desplazamiento es CSS puro —una animación sobre `translateX`, que va al
 * compositor— y este componente solo le toca el `playbackRate` a esa misma
 * animación: la franja se apura con el scroll y vuelve sola a su ritmo. Así
 * nunca salta, porque no se reinicia nada; cambia la velocidad del reloj.
 *
 * La pista se dibuja dos veces y se mueve la mitad de su ancho: cuando la
 * primera copia termina de salir, la segunda ocupa exactamente su lugar.
 */
export default function Franja({ palabras }: { palabras: string[] }) {
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pista.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anim = el.getAnimations()[0];
    if (!anim) return;

    let ultimoY = window.scrollY;
    let empuje = 0;
    let frame = 0;

    const tick = () => {
      /* El empuje decae solo: sin scroll, en medio segundo la franja vuelve
         a su velocidad de crucero. */
      empuje *= 0.9;
      anim.playbackRate = 1 + empuje;
      frame = Math.abs(empuje) > 0.01 ? requestAnimationFrame(tick) : 0;
      if (!frame) anim.playbackRate = 1;
    };

    const onScroll = () => {
      const y = window.scrollY;
      empuje = Math.min(Math.abs(y - ultimoY) * 0.12, 4);
      ultimoY = y;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const tanda = (copia: number) =>
    palabras.map((p, i) => (
      <span className="art-franja-item" key={`${copia}-${i}`}>
        <span className={i % 2 ? "art-franja-calada" : undefined}>{p}</span>
        <span className="art-franja-sep">✦</span>
      </span>
    ));

  return (
    <div className="art-franja" role="presentation">
      {/* La lista la lee el lector de pantalla una vez; la animación es
          decorativa y va oculta. */}
      <p className="art-sr">{palabras.join(", ")}</p>
      <div className="art-franja-pista" ref={pista} aria-hidden>
        {tanda(0)}
        {tanda(1)}
      </div>
    </div>
  );
}
