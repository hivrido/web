"use client";

/**
 * Header de la home de RYTMOS: fijo y mínimo. El logo de Hivrido, las anclas
 * de la serie (solo las de las secciones que existen), PLAY y el menú con el
 * mapa completo del sitio. Usa las mismas piezas que el header de PLAY
 * (`.hp-header`, `.hp-nav`, el cajón de PlayMenu): transparente arriba,
 * vidrio al bajar.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import LogoAnimated from "../ui/LogoAnimated";
import PlayMenu, { type MenuItem } from "../play/PlayMenu";
import { jumpTo } from "../play/jump";

export default function RytmosHeader({ anclas, menu, nombre }: { anclas: MenuItem[]; menu: MenuItem[]; nombre: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`hp-header ry-header${scrolled ? " is-scrolled" : ""}`}>
        <Link href="/" onClick={(e) => jumpTo(e, "/")} className="hp-logo" aria-label="Hivrido, inicio">
          <LogoAnimated height={22} delay={300} />
        </Link>

        {anclas.length > 0 && (
          <nav className="hp-nav" aria-label={nombre}>
            <span className="ry-nav-label" aria-hidden="true">{nombre}</span>
            {anclas.map((a) => (
              <Link key={a.href} href={a.href} onClick={(e) => jumpTo(e, a.href)}>
                {a.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ry-header-end">
          <Link href="/play/" className="ry-play-link" data-medir="explorar_play" data-medir-origen="header">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            Play
          </Link>
          <button type="button" className="ry-burger" onClick={() => setAbierto(true)} aria-expanded={abierto} aria-controls="ry-menu" aria-label="Abrir el menú">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
          </button>
        </div>
      </header>

      <PlayMenu id="ry-menu" open={abierto} onClose={cerrar} items={menu} title="Todo Hivrido" />
    </>
  );
}
