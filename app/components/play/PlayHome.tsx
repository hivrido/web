"use client";

/**
 * Portada de Hivrido PLAY. Desde la reestructuración vive en la raíz del
 * dominio: es lo primero que ve el tráfico de campaña, así que el arranque
 * manda sobre cualquier otra consideración.
 *
 * Las fichas salen todas de app/lib/catalog.ts. Acá no se declara contenido:
 * si un título tiene que cambiar de fila o de tipo, se cambia allá.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import NextImage from "next/image";
import LogoAnimated from "../ui/LogoAnimated";
import CastingCall from "./CastingCall";
import { FEATURED, SERIES, PELICULAS, TENDENCIAS, type Title } from "../../lib/catalog";
import "./play.css";

/* Degradados de la casa para las fichas que todavía no tienen portada. Es un
   fondo compuesto, no un hueco: la tarjeta se ve terminada igual. */
const CARD_COLORS = [
  "linear-gradient(160deg,#2d1060 0%,#0d0820 100%)",
  "linear-gradient(160deg,#0d2660 0%,#080d20 100%)",
  "linear-gradient(160deg,#600d30 0%,#200810 100%)",
  "linear-gradient(160deg,#1a6030 0%,#081a0d 100%)",
  "linear-gradient(160deg,#603010 0%,#1a0d06 100%)",
  "linear-gradient(160deg,#30106a 0%,#0d0820 100%)",
  "linear-gradient(160deg,#10306a 0%,#08101a 100%)",
  "linear-gradient(160deg,#6a1030 0%,#1a0810 100%)",
];

function CardWrapper({ href, children }: { href?: string; children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

function Card({ item, index, wide }: { item: Title; index: number; wide?: boolean }) {
  const grad = CARD_COLORS[index % CARD_COLORS.length];
  const badgeClass = item.badge === "NEW" || item.badge === "SERIE" ? "new" : "";
  return (
    <CardWrapper href={item.href}>
      <div className={`mp-card${wide ? " wide" : ""}`} style={item.href ? { cursor: "pointer" } : {}}>
        <div className="mp-card-thumb" style={{ background: grad, position: "relative" }}>
          {item.poster && (
            <NextImage
              src={item.poster}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 45vw, 300px"
              loading="lazy"
              style={{ objectFit: "cover" }}
            />
          )}
          <div className="mp-card-thumb-overlay" />
          {item.badge && <span className={`mp-card-badge ${badgeClass}`}>{item.badge}</span>}
          <div className="mp-card-play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <div
            style={{
              position: "absolute", bottom: 12, left: 12, right: 12,
              fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,.5)",
              letterSpacing: ".05em",
            }}
          >
            {item.title}
          </div>
        </div>
        <div className="mp-card-info">
          <div className="mp-card-title">{item.title}</div>
          <div className="mp-card-meta">
            {item.rating && (
              <span className="mp-card-rating">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#f0b429"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                {item.rating}
              </span>
            )}
            <span>{item.year}</span>
            <span>{item.genre}</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

function Section({ id, title, items, wide }: { id?: string; title: string; items: Title[]; wide?: boolean }) {
  return (
    <div className="mp-section" id={id}>
      <div className="mp-section-header">
        <h2 className="mp-section-title">{title}</h2>
      </div>
      <div className="mp-row">
        {items.map((item, i) => <Card key={item.id} item={item} index={i} wide={wide} />)}
      </div>
    </div>
  );
}

/* ── HEADER ── */
function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`mp-header${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="mp-logo">
        <LogoAnimated height={26} delay={300} />
        <span className="mp-logo-badge">PLAY</span>
      </Link>

      <nav className="mp-nav">
        <a href="#catalogo" className="active">Inicio</a>
        <a href="#series">Series</a>
        <a href="#peliculas">Películas</a>
      </nav>

      <div className="mp-header-right">
        <button className="mp-icon-btn" aria-label="Buscar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </button>
        <a href="#casting" className="mp-btn-login">Sumate al casting</a>
      </div>
    </header>
  );
}

/* ── HERO ── */
function Hero() {
  const [current, setCurrent] = useState(0);
  /* Qué fondos ya se pueden pintar. Arranca solo con el primero: los slides
     inactivos se ocultan con `visibility`, que no evita la descarga, así que
     declarar los tres de entrada bajaba el catálogo entero antes del primer
     pixel. Cada uno entra cuando le toca. */
  const [painted, setPainted] = useState<number[]>([0]);
  const [modalYtId, setModalYtId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /* El intervalo no ve el estado, y el slide que toca lo necesitan dos cosas
     a la vez —qué se muestra y qué fondo ya se puede pedir—, así que el índice
     vigente vive también acá. */
  const currentRef = useRef(0);

  /* Único camino para cambiar de slide: mostrarlo y, en el mismo gesto,
     habilitar su fondo. */
  const show = useCallback((i: number) => {
    currentRef.current = i;
    setCurrent(i);
    setPainted((p) => (p.includes(i) ? p : [...p, i]));
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      show((currentRef.current + 1) % FEATURED.length);
    }, 6000);
  }, [show]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  /* El siguiente se precarga recién cuando la página terminó de cargar: antes
     competía por ancho de banda con el fondo que se está mirando. */
  useEffect(() => {
    const preloadNext = () => {
      const next = FEATURED[(current + 1) % FEATURED.length];
      if (!next?.hero) return;
      const img = new Image();
      img.src = next.hero.image;
    };
    if (document.readyState === "complete") {
      const t = setTimeout(preloadNext, 400);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", preloadNext, { once: true });
    return () => window.removeEventListener("load", preloadNext);
  }, [current]);

  useEffect(() => {
    if (modalYtId) {
      stopTimer();
      document.body.style.overflow = "hidden";
    } else {
      startTimer();
      document.body.style.overflow = "";
    }
  }, [modalYtId, startTimer, stopTimer]);

  useEffect(() => {
    if (!modalYtId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModalYtId(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalYtId]);

  const go = (i: number) => { show(i); startTimer(); };
  const prev = () => go((current - 1 + FEATURED.length) % FEATURED.length);
  const next = () => go((current + 1) % FEATURED.length);

  const f = FEATURED[current];

  return (
    <>
      <section className="mp-hero" id="catalogo">
        {FEATURED.map((item, i) => (
          <div key={item.id} className={`mp-hero-slide${i === current ? " active" : ""}`}>
            <div
              className="mp-hero-bg"
              style={
                painted.includes(i)
                  ? { backgroundImage: `url('${item.hero!.image}')` }
                  : undefined
              }
            />
            <div className="mp-hero-grad" />
          </div>
        ))}

        <div className="mp-hero-content">
          <div className="mp-hero-genre">
            <span className="mp-hero-genre-dot" style={{ background: f.hero!.color }} />
            {f.genre}
          </div>
          <h1 className="mp-hero-title">{f.title}</h1>
          <p className="mp-hero-desc">{f.synopsis}</p>
          <div className="mp-hero-meta">
            {f.rating && (
              <span className="mp-hero-rating">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#f0b429"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                {f.rating}
              </span>
            )}
            <span className="mp-hero-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              {f.year}
            </span>
            <span className="mp-hero-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              {f.type === "serie" ? f.seasons : f.duration}
            </span>
            <span className="mp-hero-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              Español
            </span>
          </div>
          <div className="mp-hero-actions">
            <button
              className="mp-play-btn"
              onClick={() => f.ytId && setModalYtId(f.ytId)}
              style={!f.ytId ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Ver Ahora
            </button>
            {f.href && (
              <Link href={f.href} className="mp-outline-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                Más Info
              </Link>
            )}
          </div>
        </div>

        <button className="mp-hero-arrow mp-hero-arrow-prev" onClick={prev} aria-label="Anterior">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="mp-hero-arrow mp-hero-arrow-next" onClick={next} aria-label="Siguiente">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        <div className="mp-hero-dots">
          {FEATURED.map((item, i) => (
            <button key={item.id} className={`mp-hero-dot${i === current ? " active" : ""}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {modalYtId && (
        <div className="mp-video-modal" onClick={() => setModalYtId(null)}>
          <button className="mp-video-modal-close" onClick={() => setModalYtId(null)} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className="mp-video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="mp-video-modal-mask" />
            <iframe
              key={modalYtId}
              src={`https://www.youtube.com/embed/${modalYtId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="mp-video-modal-iframe"
              title="Trailer"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function PlayHome() {
  return (
    <div className="mp-app">
      <Header />
      <CastingCall />
      <Hero />

      <main className="mp-main">
        <Section id="series" title="Series" items={SERIES} wide />

        <div className="mp-banner">
          <div className="mp-banner-bg" style={{ background: "linear-gradient(135deg,#2d1060,#0d0820)" }} />
          <div className="mp-banner-content">
            <div className="mp-banner-label">Contenido exclusivo</div>
            <div className="mp-banner-title">Estrenos Hivrido</div>
            <a href="#peliculas" className="mp-banner-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Explorar Estrenos
            </a>
          </div>
        </div>

        <Section id="peliculas" title="Películas" items={PELICULAS} />
        <Section title="Tendencias" items={TENDENCIAS} />
      </main>

      <footer className="mp-footer">
        <span>© 2026 Hivrido PLAY. Todos los derechos reservados.</span>
        <div className="mp-footer-links">
          <a href="https://wa.me/5491156072460?text=Hola!%20Quiero%20hablar%20con%20HIVRIDO" target="_blank" rel="noopener">Contacto</a>
          <Link href="/web/">← Volver a Hivrido</Link>
        </div>
      </footer>
    </div>
  );
}
