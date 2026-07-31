"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";

const MATRIX = "アイウエオカキクケコサシスセソ0123456789ABCDEF@#$%<>/|\\";
const BLANK_COL = Array(6).fill(" ");

const services = [
  {
    num: "01",
    title: "Diseño Web",
    tags: ["HTML5", "CSS", "JS", "WORDPRESS", "ECOMMERCE"],
    desc: "Somos especialistas en diseño web profesional, combinando creatividad, tecnología avanzada y estrategias innovadoras para desarrollar sitios web espectaculares, intuitivos y completamente personalizados.",
    extra: "Responsive · UI/UX · Landing Pages · E-commerce",
    headline: "Tu marca en la web. Sin concesiones.",
    body: "Diseñamos sitios web profesionales que combinan creatividad, tecnología y estrategia. Cada proyecto es único: desde landing pages de alto impacto hasta e-commerce completos con experiencia de usuario excepcional.",
    stat: ["100%", "Responsive y optimizado para conversión"],
  },
  {
    num: "02",
    title: "Aplicaciones",
    tags: ["Python", "Node.js", "Go", "Swift / Kotlin"],
    desc: "Desarrollamos aplicaciones móviles y web personalizadas, escalables y de alto rendimiento, incluyendo apps para iOS y Android, PWA y sistemas a medida.",
    extra: "Native Mobile · Web App · PWA",
    headline: "Software que escala con tu negocio.",
    body: "Desarrollamos aplicaciones móviles y web personalizadas, escalables y de alto rendimiento. iOS, Android, PWA y sistemas a medida conectados con tus herramientas actuales.",
    stat: ["x3", "Velocidad de desarrollo con stack moderno"],
  },
  {
    num: "03",
    title: "Branding",
    tags: ["Identidad", "Naming", "Manual de Marca"],
    desc: "Creamos identidades de marca que generan reconocimiento y conexión emocional. Logo, paleta, tipografía, voz y toda la arquitectura visual de tu empresa.",
    extra: "Logo · Manual de Marca · Packaging",
    headline: "Una marca que se recuerda.",
    body: "Construimos identidades visuales que generan reconocimiento y conexión emocional. Logo, paleta, tipografía, voz y toda la arquitectura visual de tu empresa desde cero.",
    stat: ["360°", "Identidad visual completa y coherente"],
  },
  {
    num: "04",
    title: "Renders 3D",
    tags: ["SketchUp", "Revit", "Rhino", "Unreal", "Blender"],
    desc: "Visualizaciones fotorrealistas que permiten mostrar proyectos antes de que existan. Renders de arquitectura, producto, interiores y materiales gráficos.",
    extra: "3D · Render · Animación",
    headline: "Ver antes de construir.",
    body: "Visualizaciones fotorrealistas que permiten presentar proyectos antes de que existan. Renders de arquitectura, producto e interiores con calidad de nivel broadcast.",
    stat: ["4K", "Resolución broadcast en todos los renders"],
  },
  {
    num: "05",
    title: "Publicidad Digital",
    tags: ["Meta Ads", "Google Ads", "SEO"],
    desc: "Gestionamos campañas publicitarias en Meta, Google y redes sociales con foco en conversión. Estrategia, segmentación, creativos y optimización continua.",
    extra: "Ads · Growth · Análisis",
    headline: "Inversión que se convierte en clientes.",
    body: "Gestionamos campañas en Meta, Google y redes sociales con foco absoluto en conversión. Estrategia, segmentación inteligente, creativos de alto impacto y optimización continua.",
    stat: ["ROAS+", "Retorno medible en cada campaña"],
  },
  {
    num: "06",
    title: "Agentes IA",
    tags: ["Multi-Agente", "Ejecución 24/7", "Colmena"],
    desc: "Desplegamos colmenas de agentes inteligentes que operan de forma autónoma: analizan datos, generan contenido, optimizan campañas y ejecutan procesos sin intervención humana.",
    extra: "Colmena · Multi-Agente · Sistemas Autónomos",
    headline: "Tu negocio en piloto automático.",
    body: "Sistemas de agentes IA que trabajan 24/7 — analizan, crean, optimizan y ejecutan a escala. Desde automatización de procesos hasta colmenas multi-agente conectadas a tus plataformas, CRM, ads y canales de comunicación.",
    stat: ["24/7", "Ejecución autónoma sin intervención manual"],
  },
];

function useScramble(original: string) {
  const [display, setDisplay] = useState(original);
  const raf = useRef<number | null>(null);

  const start = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    let frame = 0;
    const speed = 2;
    const total = original.length * speed + 10;

    const tick = () => {
      setDisplay(
        original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < Math.floor(frame / speed)) return original[i];
          return MATRIX[Math.floor(Math.random() * MATRIX.length)];
        }).join("")
      );
      frame++;
      if (frame <= total) raf.current = requestAnimationFrame(tick);
      else setDisplay(original);
    };
    raf.current = requestAnimationFrame(tick);
  }, [original]);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setDisplay(original);
  }, [original]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return { display, start, stop };
}

function MatrixCol({ active, delay = 0, right }: { active: boolean; delay?: number; right: number }) {
  const [chars, setChars] = useState<string[]>(Array(6).fill(" "));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;

    const tick = () =>
      setChars(Array.from({ length: 6 }, () => MATRIX[Math.floor(Math.random() * MATRIX.length)]));

    tout.current = setTimeout(() => {
      tick();
      timer.current = setInterval(tick, 65 + delay * 20);
    }, delay * 55);

    return () => {
      if (timer.current) clearInterval(timer.current);
      if (tout.current) clearTimeout(tout.current);
    };
  }, [active, delay]);

  return (
    <span className="svc-matrix-col" aria-hidden style={{ right }}>
      {(active ? chars : BLANK_COL).map((ch, i) => (
        <span key={i} style={{ opacity: Math.max(0, 0.7 - i * 0.11) }}>{ch}</span>
      ))}
    </span>
  );
}

function ServiceItem({ sv, onClick }: { sv: typeof services[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const title = useScramble(sv.title);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-30, 30], [3, -3]);
  const rotateY = useTransform(mouseX, [-200, 200], [-4, 4]);

  const onEnter = () => { setHovered(true); title.start(); };
  const onLeave = () => {
    setHovered(false);
    title.stop();
    mouseX.set(0);
    mouseY.set(0);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      className="svc-item"
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMouseMove}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        alignItems: "center",
        gap: "40px",
        padding: "32px 0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        color: "var(--text)",
        position: "relative",
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
    >
      <MatrixCol active={hovered} delay={0} right={148} />
      <MatrixCol active={hovered} delay={2} right={162} />
      <MatrixCol active={hovered} delay={4} right={176} />

      <span
        className="svc-num"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.2em",
          transition: "color 0.3s",
          position: "relative",
          zIndex: 1,
        }}
      >
        {sv.num}
      </span>

      <div className="svc-content" style={{ position: "relative", zIndex: 1 }}>
        <div className="svc-title-row" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <h3
            className="svc-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              fontWeight: 700,
              transition: "color 0.3s",
              color: "var(--text)",
            }}
          >
            {title.display}
          </h3>
          <div className="svc-tags">
            {sv.tags.map((t) => (
              <span
                key={t}
                className="svc-tag"
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-display)",
                  padding: "3px 10px",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <p
          className="svc-desc"
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: "500px",
          }}
        >
          {sv.desc}
        </p>
      </div>

      <span
        className="svc-arrow"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.2)",
          transition: "color 0.3s, transform 0.3s",
          letterSpacing: "0.1em",
          position: "relative",
          zIndex: 1,
        }}
      >
        Ver más →
      </span>
    </motion.div>
  );
}

export default function FuxxiaServices() {
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => { clearTimeout(t); setMounted(false); };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".svc-item"));
    if (!items.length) return;

    const rect = list.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      import("gsap").then(({ default: gsap }) => gsap.set(items, { opacity: 1, y: 0 }));
      return;
    }
    import("gsap").then(({ default: gsap }) => {
      gsap.set(items, { opacity: 0, y: 30 });
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 });
            observer.unobserve(list);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(list);
      const fallback = setTimeout(() => gsap.set(items, { opacity: 1, y: 0 }), 1500);
      return () => { observer.disconnect(); clearTimeout(fallback); };
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  useEffect(() => {
    if (active === null) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  const s = active !== null ? services[active] : null;

  const modal = mounted && active !== null && s ? (
    <div
      className="svc-modal-overlay"
      onClick={(e) => { if (e.currentTarget === e.target) setActive(null); }}
    >
      <div className="svc-modal">
        <button className="svc-modal-close" onClick={() => setActive(null)} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="svc-modal-num-label">{s.num} — {s.title}</div>
        <h3 className="svc-modal-headline">{s.headline}</h3>
        <div className="svc-modal-divider" />
        <p className="svc-modal-body">{s.body}</p>

        <div className="svc-modal-stat">
          <span className="svc-modal-stat-num">{s.stat[0]}</span>
          <span className="svc-modal-stat-label">{s.stat[1]}</span>
        </div>

        <div className="svc-modal-tags-row">
          {s.tags.map((t) => (
            <span key={t} className="svc-tag">{t}</span>
          ))}
        </div>

        <div className="svc-modal-cta-row">
          <a
            className="svc-modal-cta"
            href={`https://api.whatsapp.com/send?phone=541156072460&text=Hola!%20me%20interesa%20${encodeURIComponent(s.title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar ahora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <section
        id="sec-fuxxia-services"
        style={{
          background: "var(--bg)",
          padding: "120px 0",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 60px",
          }}
        >
          <div className="svc-list-header">
            <ScrollReveal>
              <span className="section-label">Colmena Fuxxia</span>
              <h2 className="section-title" style={{ marginBottom: "80px" }}>
                <span>Servicios & Soluciones</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="svc-list" ref={listRef}>
            {services.map((sv, i) => (
              <ServiceItem key={i} sv={sv} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>
      </section>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
