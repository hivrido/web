"use client";

/**
 * Header de Hivrido PLAY, el mismo en la portada y en las fichas. Arriba de
 * todo es transparente; al bajar se vuelve vidrio. En el teléfono las
 * secciones bajan a una barra inferior, al alcance del pulgar.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import LogoAnimated from "../ui/LogoAnimated";
import PlayMenu from "./PlayMenu";
import SearchOverlay, { openSearch } from "./SearchOverlay";
import { jumpTo } from "./jump";

const LINKS = [
  { label: "Inicio", hash: "" },
  { label: "Series", hash: "series" },
  { label: "Películas", hash: "peliculas" },
  { label: "Próximamente", hash: "proximamente" },
];

const href = (hash: string) => (hash ? `/play/#${hash}` : "/play/");

/* Qué sección se está mirando, para marcarla en la barra. Solo tiene sentido
   en la portada: en una ficha no hay secciones de la barra en pantalla. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!enabled) return;
    const els = LINKS.map((l) => (l.hash ? document.getElementById(l.hash) : null)).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
          else if (e.target.id === els[0]?.id && e.boundingClientRect.top > 0) setActive("");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

const ICONS: Record<string, React.ReactNode> = {
  "": <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />,
  series: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M8 2l4 4 4-4" /></>,
  peliculas: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" /></>,
};

export default function PlayHeader({ home = false }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = useActiveSection(home);
  const closeMenu = useCallback(() => setMenu(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (hash: string) => home && active === hash;

  return (
    <>
      <header className={`hp-header${scrolled ? " is-scrolled" : ""}`}>
        <Link href="/play/" onClick={(e) => jumpTo(e, "/play/")} className="hp-logo" aria-label="Hivrido PLAY, inicio">
          <LogoAnimated height={22} delay={300} />
          <span className="hp-logo-pill">Play</span>
        </Link>

        <nav className="hp-nav" aria-label="Secciones">
          {LINKS.map((l) => (
            <Link key={l.label} href={href(l.hash)} onClick={(e) => jumpTo(e, href(l.hash))} className={isActive(l.hash) ? "is-active" : undefined} aria-current={isActive(l.hash) ? "true" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="hp-search-btn" onClick={() => openSearch()} aria-label="Buscar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span className="hp-search-btn-label">Buscar</span>
          <span className="hp-kbd">/</span>
        </button>
      </header>

      <nav className="hp-tabbar" aria-label="Secciones">
        {LINKS.slice(0, 3).map((l) => (
          <Link key={l.label} href={href(l.hash)} onClick={(e) => jumpTo(e, href(l.hash))} className={isActive(l.hash) ? "is-active" : undefined}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">{ICONS[l.hash]}</svg>
            <span>{l.label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => openSearch()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span>Buscar</span>
        </button>
        <button type="button" onClick={() => setMenu(true)} aria-expanded={menu}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
          <span>Más</span>
        </button>
      </nav>

      <PlayMenu open={menu} onClose={closeMenu} />
      <SearchOverlay />
    </>
  );
}
