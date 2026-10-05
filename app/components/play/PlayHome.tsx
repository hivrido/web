"use client";

/**
 * Portada de Hivrido PLAY, en /play. Es adonde llegan los links de los
 * estrenos, así que el arranque manda sobre cualquier otra consideración.
 *
 * Las fichas salen todas de app/lib/catalog.ts. Acá no se declara contenido:
 * si un título tiene que cambiar de fila o de tipo, se cambia allá.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import NextImage from "next/image";
import LogoAnimated from "../ui/LogoAnimated";
import PlayMenu from "./PlayMenu";
import { FEATURED, SERIES, PELICULAS, type CATALOG } from "../../lib/catalog";

type CatalogTitle = (typeof CATALOG)[number];
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

/**
 * Toda tarjeta lleva a la ficha de su obra, que es donde está el video, la
 * sinopsis y los créditos. Antes algunas abrían el tráiler en un modal y las
 * provisorias no hacían nada: ahora el camino es uno solo.
 */
function Card({ item, index, wide }: {
  item: CatalogTitle;
  index: number;
  wide?: boolean;
}) {
  const grad = CARD_COLORS[index % CARD_COLORS.length];
  /* Verde para lo que ya se puede ver, dorado para lo que todavía no. El
     dorado estaba escrito en play.css desde siempre y sin nadie que lo
     pidiera: "PRONTO" es el primer caso que lo necesita, y la distinción
     importa —una ficha que no reproduce tiene que avisarlo desde la tapa. */
  const badgeClass =
    item.badge === "NUEVA" || item.badge === "SERIE"
      ? "new"
      : item.badge === "PRONTO"
      ? "soon"
      : "";

  return (
    <Link href={item.href} style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
      <div
        className={`mp-card${wide ? " wide" : ""}`}
        style={{ cursor: "pointer" }}
      >
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
          {/* Solo cuando no hay portada. Es el rótulo del degradado —lo
              único que nombra una ficha sin arte—, pero sobre una portada se
              superponía al afiche y repetía el título que ya se lee justo
              debajo, en la ficha. */}
          {!item.poster && (
            <div
              style={{
                position: "absolute", bottom: 12, left: 12, right: 12,
                fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,.5)",
                letterSpacing: ".05em",
              }}
            >
              {item.title}
            </div>
          )}
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
            {item.year && <span>{item.year}</span>}
            <span>{item.genre}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Fila deslizable. El dedo la mueve solo —es scroll nativo—, pero el mouse no:
 * arrastrar sobre un overflow no desplaza nada, y encima las tarjetas son links
 * e imágenes que el navegador intenta arrastrar como archivo. Acá el puntero de
 * mouse arrastra la fila, y si hubo arrastre el click que sigue no navega.
 */
function DragRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    drag.current = { down: true, moved: false, x: e.clientX, left: ref.current.scrollLeft };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = ref.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.x;
    // Unos píxeles de tolerancia: un click con pulso tembloroso sigue siendo click
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add("dragging");   // apaga el snap mientras se arrastra
    }
    el.scrollLeft = d.left - dx;
  };

  const end = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!drag.current.down || !el) return;
    drag.current.down = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.classList.remove("dragging");
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      className="mp-row"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

function Section({ id, title, items, wide }: {
  id?: string;
  title: string;
  items: CatalogTitle[];
  wide?: boolean;
}) {
  return (
    <div className="mp-section" id={id}>
      <div className="mp-section-header">
        <h2 className="mp-section-title">{title}</h2>
      </div>
      <DragRow>
        {items.map((item, i) => (
          <Card key={item.id} item={item} index={i} wide={wide} />
        ))}
      </DragRow>
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
      <Link href="/play/" className="mp-logo">
        <LogoAnimated height={26} delay={300} />
        <span className="mp-logo-badge">PLAY</span>
      </Link>

      <nav className="mp-nav">
        <a href="#catalogo" className="active">Inicio</a>
        <a href="#series">Series</a>
        <a href="#peliculas">Películas</a>
      </nav>

      {/* Solo en teléfono: en escritorio las secciones ya se leen arriba. */}
      <PlayMenu />
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

  const go = (i: number) => { show(i); startTimer(); };
  const prev = () => go((current - 1 + FEATURED.length) % FEATURED.length);
  const next = () => go((current + 1) % FEATURED.length);

  const f = FEATURED[current];

  return (
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
            {f.year && (
              <span className="mp-hero-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                {f.year}
              </span>
            )}
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
            {/* Los dos llevan a la ficha: "Ver Ahora" directo al video. */}
            <Link href={f.ytId ? `${f.href}#trailer` : f.href} className="mp-play-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Ver Ahora
            </Link>
            <Link href={f.href} className="mp-outline-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              Más Info
            </Link>
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
  );
}

export default function PlayHome() {
  return (
    <div className="mp-app">
      <Header />
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

        <Section id="peliculas" title="Películas" items={PELICULAS} wide />
      </main>

      <footer className="mp-footer">
        <span>© 2026 Hivrido PLAY. Todos los derechos reservados.</span>
        <div className="mp-footer-links">
          <a href="https://wa.me/5491156072460?text=Hola!%20Quiero%20hablar%20con%20HIVRIDO" target="_blank" rel="noopener">Contacto</a>
          <Link href="/">← Volver a Hivrido</Link>
        </div>
      </footer>

    </div>
  );
}
