"use client";

/**
 * Un afiche en 3D: girado, con canto, reflejo que lo barre, la luz de la casa
 * recorriendo el borde y giro hacia el cursor. Lo usan la home de RYTMOS y
 * /casting. Estilos en relieve.css.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./relieve.css";

export default function Afiche3D({
  src400,
  src800,
  alt,
  sizes,
  href,
  prioridad = false,
  className = "",
}: {
  src400: string;
  src800: string;
  alt: string;
  sizes: string;
  /** Si se pasa, el afiche es un link. */
  href?: string;
  prioridad?: boolean;
  className?: string;
}) {
  const escena = useRef<HTMLDivElement>(null);
  const pieza = useRef<HTMLElement>(null);

  useEffect(() => {
    const s = escena.current;
    const p = pieza.current;
    if (!s || !p) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mover = (e: PointerEvent) => {
      const r = s.getBoundingClientRect();
      p.style.setProperty("--ary", `${((e.clientX - r.left) / r.width - 0.5) * 22}deg`);
      p.style.setProperty("--arx", `${-((e.clientY - r.top) / r.height - 0.5) * 14}deg`);
    };
    const salir = () => {
      p.style.removeProperty("--ary");
      p.style.removeProperty("--arx");
    };
    s.addEventListener("pointermove", mover);
    s.addEventListener("pointerleave", salir);
    return () => {
      s.removeEventListener("pointermove", mover);
      s.removeEventListener("pointerleave", salir);
    };
  }, []);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- variantes propias (scripts/build-casting-assets.mjs)
    <img
      src={src400}
      srcSet={`${src400} 400w, ${src800} 800w`}
      sizes={sizes}
      width={400}
      height={600}
      alt={alt}
      loading={prioridad ? "eager" : "lazy"}
      decoding="async"
    />
  );
  const contenido = (
    <>
      {img}
      <span className="afiche3d-brillo" aria-hidden="true" />
    </>
  );

  return (
    <div ref={escena} className={`afiche3d ${className}`}>
      <div className="afiche3d-flota">
        {href ? (
          <Link ref={pieza as React.Ref<HTMLAnchorElement>} href={href} className="afiche3d-pieza luz-borde" data-medir="afiche_click" data-medir-destino={href}>
            {contenido}
          </Link>
        ) : (
          <div ref={pieza as React.Ref<HTMLDivElement>} className="afiche3d-pieza luz-borde">
            {contenido}
          </div>
        )}
      </div>
    </div>
  );
}
