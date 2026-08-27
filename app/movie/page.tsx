"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NextImage from "next/image";
import LogoAnimated from "../components/ui/LogoAnimated";
import CastingCall from "./components/CastingCall";

/* ── DATA ── */
const FEATURED = [
  {
    id: 1,
    ytId: "GowGLVO0KHI",
    title: "El Docke",
    genre: "Drama · Thriller",
    desc: "Una historia de amistad, códigos y traición, en medio de la vida delictiva en el conurbano bonaerense.",
    year: "2024",
    lang: "Español",
    duration: "1h 42m",
    rating: "8.4",
    bg: "url('/pdf/imagenespdf/eldocke/eldocke/19.jpg') center/cover no-repeat",
    color: "#9D5FFF",
  },
  {
    id: 2,
    ytId: "OgghHzx3axk",
    title: "Chamamé",
    genre: "Neo Western · Acción · Drama",
    desc: "Un salvaje ajuste de cuentas entre dos piratas del asfalto.",
    year: "2024",
    lang: "Español",
    duration: "58m",
    rating: "9.1",
    bg: "url('/pdf/imagenespdf/chamame/chamame/6.jpg') center/cover no-repeat",
    color: "#5F9FFF",
  },
  {
    id: 3,
    ytId: "2KooNsJQsxw",
    title: "Session One",
    genre: "Thriller · Drama",
    desc: "¿Qué estás dispuesto a hacer si se te presenta la oportunidad de cambiar tu pobre vida para siempre?",
    year: "2024",
    lang: "Español",
    duration: "45m",
    rating: "8.7",
    bg: "url('/pdf/imagenespdf/sessionone/setionone/1.jpg') center/cover no-repeat",
    color: "#FF5F9F",
  },
];

const TRENDING = [
  { id: 1, title: "El Docke", year: "2024", rating: "8.4", genre: "Documental", badge: "HD" },
  { id: 2, title: "Chamamé", year: "2024", rating: "9.1", genre: "Música", badge: "NEW" },
  { id: 3, title: "Session One", year: "2024", rating: "8.7", genre: "Acción", badge: "" },
  { id: 4, title: "Tierra Adentro", year: "2024", rating: "7.9", genre: "Drama", badge: "" },
  { id: 5, title: "Raíces", year: "2023", rating: "8.2", genre: "Documental", badge: "" },
  { id: 6, title: "Norte", year: "2024", rating: "7.6", genre: "Thriller", badge: "NEW" },
  { id: 7, title: "La Última Vez", year: "2023", rating: "8.0", genre: "Drama", badge: "" },
  { id: 8, title: "Folklore", year: "2024", rating: "8.5", genre: "Cultura", badge: "" },
];

const SERIES = [
  { id: 0, title: "Okupas", year: "T1 · 2000", rating: "9.2", genre: "Drama", badge: "SERIE", wide: true, href: "/movie/okupas", img: "/images/okupas/okupas-home.webp" },
  { id: 1, title: "Fronteras", year: "T1 · 2024", rating: "8.8", genre: "Drama", badge: "SERIE", wide: true },
  { id: 2, title: "El Barrio Habla", year: "T1 · 2024", rating: "8.3", genre: "Documental", badge: "SERIE", wide: true },
  { id: 3, title: "Cumbia Madre", year: "T2 · 2024", rating: "9.0", genre: "Música", badge: "SERIE", wide: true },
  { id: 4, title: "Identidad", year: "T1 · 2023", rating: "7.9", genre: "Drama", badge: "SERIE", wide: true },
  { id: 5, title: "Sur", year: "T1 · 2024", rating: "8.6", genre: "Thriller", badge: "SERIE", wide: true },
];

const COMING = [
  { id: 1, title: "Río Oscuro", year: "2025", rating: "", genre: "Thriller", badge: "PRÓXIMO" },
  { id: 2, title: "La Danza", year: "2025", rating: "", genre: "Drama", badge: "PRÓXIMO" },
  { id: 3, title: "Cosecha", year: "2025", rating: "", genre: "Documental", badge: "PRÓXIMO" },
  { id: 4, title: "Últimas Horas", year: "2025", rating: "", genre: "Suspenso", badge: "PRÓXIMO" },
];

/* ── Gradient placeholder for cards ── */
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

type CardItem = { id: number; title: string; year: string; rating: string; genre: string; badge: string; wide?: boolean; href?: string; img?: string };

function CardWrapper({ href, children }: { href?: string; children: React.ReactNode }) {
  if (href) {
    return <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "contents" }}>{children}</Link>;
  }
  return <>{children}</>;
}

function Card({ item, index }: { item: CardItem; index: number }) {
  const grad = CARD_COLORS[index % CARD_COLORS.length];
  const badgeClass = item.badge === "NEW" || item.badge === "SERIE" ? "new" : item.badge === "PRÓXIMO" ? "soon" : "";
  return (
    <CardWrapper href={item.href}>
    <div className={`mp-card${item.wide ? " wide" : ""}`} style={item.href ? { cursor: "pointer" } : {}}>
      <div className="mp-card-thumb" style={{ background: grad, position: "relative" }}>
        {item.img && (
          <NextImage src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: "cover" }} />
        )}
        <div className="mp-card-thumb-overlay" />
        {item.badge && <span className={`mp-card-badge ${badgeClass}`}>{item.badge}</span>}
        <div className="mp-card-play">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        {/* Fake title overlay on thumb */}
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12,
          fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,.5)",
          letterSpacing: ".05em"
        }}>{item.title}</div>
      </div>
      <div className="mp-card-info">
        <div className="mp-card-title">{item.title}</div>
        <div className="mp-card-meta">
          {item.rating && (
            <span className="mp-card-rating">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#f0b429"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {item.rating}
            </span>
          )}
          <span style={item.badge === "PRÓXIMO" ? { color: "#f0b429", fontWeight: 700 } : {}}>{item.year}</span>
          <span>{item.genre}</span>
        </div>
      </div>
    </div>
    </CardWrapper>
  );
}

function Section({ title, items, link = "Ver todo" }: { title: string; items: CardItem[]; link?: string }) {
  return (
    <div className="mp-section">
      <div className="mp-section-header">
        <h2 className="mp-section-title">{title}</h2>
        <a href="#" className="mp-section-link">{link} →</a>
      </div>
      <div className="mp-row">
        {items.map((item, i) => <Card key={item.id} item={item} index={i} />)}
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
      <Link href="/movie" className="mp-logo">
        <LogoAnimated height={26} delay={300} />
        <span className="mp-logo-badge">PLAY</span>
      </Link>

      <nav className="mp-nav">
        <a href="#" className="active">Inicio</a>
        <a href="#">Todo el Contenido</a>
        <a href="#">Próximamente</a>
        <a href="#">TV en Vivo</a>
      </nav>

      <div className="mp-header-right">
        {/* Search */}
        <button className="mp-icon-btn" aria-label="Buscar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <a href="#casting" className="mp-btn-subscribe">Suscribirse</a>
        <a href="#" className="mp-btn-login">Ingresar</a>
      </div>
    </header>
  );
}

/* ── HERO ── */
function Hero() {
  const [current, setCurrent] = useState(0);
  const [modalYtId, setModalYtId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % FEATURED.length);
    }, 6000);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (modalYtId) {
      stopTimer();
      document.body.style.overflow = "hidden";
    } else {
      startTimer();
      document.body.style.overflow = "";
    }
  }, [modalYtId]);

  useEffect(() => {
    if (!modalYtId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModalYtId(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalYtId]);

  const go = (i: number) => { setCurrent(i); startTimer(); };
  const prev = () => go((current - 1 + FEATURED.length) % FEATURED.length);
  const next = () => go((current + 1) % FEATURED.length);

  const f = FEATURED[current];

  /* Preload next slide image */
  const nextImg = FEATURED[(current + 1) % FEATURED.length].bg.match(/url\('([^']+)'\)/)?.[1];
  useEffect(() => {
    if (!nextImg) return;
    const img = new Image();
    img.src = nextImg;
  }, [nextImg]);

  return (
    <>
      <section className="mp-hero" id="catalogo">
        {FEATURED.map((item, i) => (
          <div key={item.id} className={`mp-hero-slide${i === current ? " active" : ""}`}>
            <div className="mp-hero-bg" style={{ background: item.bg }} />
            <div className="mp-hero-grad" />
          </div>
        ))}

        <div className="mp-hero-content">
          <div className="mp-hero-genre">
            <span className="mp-hero-genre-dot" style={{ background: f.color }} />
            {f.genre}
          </div>
          <h1 className="mp-hero-title">{f.title}</h1>
          <p className="mp-hero-desc">{f.desc}</p>
          <div className="mp-hero-meta">
            <span className="mp-hero-rating">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f0b429"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {f.rating}
            </span>
            <span className="mp-hero-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {f.year}
            </span>
            <span className="mp-hero-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {f.duration}
            </span>
            <span className="mp-hero-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              {f.lang}
            </span>
          </div>
          <div className="mp-hero-actions">
            <button
              className="mp-play-btn"
              onClick={() => f.ytId && setModalYtId(f.ytId)}
              style={!f.ytId ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Ver Ahora
            </button>
            <button className="mp-outline-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              Más Info
            </button>
          </div>
        </div>

        <button className="mp-hero-arrow mp-hero-arrow-prev" onClick={prev} aria-label="Anterior">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="mp-hero-arrow mp-hero-arrow-next" onClick={next} aria-label="Siguiente">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <div className="mp-hero-dots">
          {FEATURED.map((_, i) => (
            <button key={i} className={`mp-hero-dot${i === current ? " active" : ""}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {modalYtId && (
        <div className="mp-video-modal" onClick={() => setModalYtId(null)}>
          <button className="mp-video-modal-close" onClick={() => setModalYtId(null)} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
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

/* ── PAGE ── */
export default function MoviePage() {
  return (
    <div className="mp-app">
      <Header />
      <CastingCall />
      <Hero />

      <main className="mp-main">
        <Section title="Series Originales" items={SERIES} />

        {/* Banner */}
        <div className="mp-banner">
          <div className="mp-banner-bg" style={{ background: "linear-gradient(135deg,#2d1060,#0d0820)" }} />
          <div className="mp-banner-content">
            <div className="mp-banner-label">Contenido exclusivo</div>
            <div className="mp-banner-title">Estrenos Hivrido</div>
            <a href="#" className="mp-banner-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Explorar Estrenos
            </a>
          </div>
        </div>

        <Section title="Tendencias" items={TRENDING} />
        <Section title="Próximamente" items={COMING} link="Ver calendario" />
        <Section title="Documentales" items={TRENDING.slice(0, 5)} />
      </main>

      <footer className="mp-footer">
        <span>© 2026 Hivrido PLAY. Todos los derechos reservados.</span>
        <div className="mp-footer-links">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Contacto</a>
          <Link href="/">← Volver a Hivrido</Link>
        </div>
      </footer>
    </div>
  );
}
