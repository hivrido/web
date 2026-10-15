"use client";

import { useEffect, useState } from "react";
import { sitio } from "../_lib/contenido";

/* Transparente sobre el cielo del hero; al bajar, toma el fondo cálido para
   que el texto siga leyéndose sobre la pizarra y las secciones claras. */
export default function Header() {
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    const alScroll = () => setSolido(window.scrollY > window.innerHeight * 0.6);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <header className={`ad-header ${solido ? "is-solido" : ""}`}>
      <a href="#inicio" className="ad-logo" aria-label="Alejandra Delfino — volver al inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/alejandradelfino/logo-ad-mark.webp" alt="" width={56} height={42} />
        <span>Alejandra Delfino</span>
      </a>
      <nav aria-label="Secciones" className="ad-nav">
        {sitio.nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>
      <a href="#sumate" className="ad-btn ad-btn-primario ad-btn-chico">
        {sitio.hero.cta}
      </a>
    </header>
  );
}
