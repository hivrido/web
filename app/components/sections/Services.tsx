"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";

const MATRIX = "アイウエオカキクケコサシスセソ0123456789ABCDEF@#$%<>/|\\";
const BLANK_COL = Array(6).fill(" ");

// Colores bicolores: Violeta Hivrido + Fucsia Fuxxia
const COLORS = {
  primary: "#7C3AED",    // Violeta Hivrido
  secondary: "#FF1B8D",  // Fucsia Fuxxia
};

const services = [
  {
    num: "01",
    title: "Producción Cinematográfica",
    tags: ["Concepto", "Guión", "Montaje", "Rodaje"],
    desc: "Creamos contenido que va desde producciones simples hasta desarrollos a gran escala, estilo Hollywood, optimizando procesos mediante tecnología avanzada para reducir significativamente la inversión de nuestros clientes.",
    headline: "",
    body: "Desarrollamos proyectos de cine desde la idea hasta la pantalla. Creamos historias con identidad, cuidando cada etapa: desarrollo, guion, rodaje y postproducción. Apostamos a narrativas que trascienden y construyen universos propios.",
    stat: ["Equipo especializado en IA", ""],
  },
  {
    num: "02",
    title: "Producción de Videoclips",
    tags: ["Concepto", "Dirección", "Comunicacion", "Posicionamiento"],
    desc: "Creamos videoclips que elevan la identidad de cada artista. Conceptualizamos, dirigimos y producimos piezas visuales que potencian la música y construyen una estética única.",
    headline: "concepto, mensaje y narrativa",
    body: "Creamos videoclips que elevan la identidad de cada artista. Conceptualizamos, dirigimos y producimos piezas visuales que potencian la música y construyen una estética única.",
    stat: ["3x", "más engagement y conexión con tu audiencia"],
  },
  {
    num: "03",
    title: "Producción de Contenido para Marcas",
    tags: ["Estrategia", "Impacto", "Narrativa"],
    desc: "Creamos contenido estratégico y visualmente potente para marcas que buscan destacarse. Desde campañas hasta piezas para redes, generamos impacto real y conexión con la audiencia.",
    headline: "No es contenido. Es posicionamiento en estado puro",
    body: "Creamos contenido estratégico y visualmente potente para marcas que buscan destacarse. Desde campañas hasta piezas para redes, generamos impacto real y conexión con la audiencia.",
    stat: ["80+", "ARTISTAS IMPULSADOS ESTRATÉGICAMENTE"],
  },
  {
    num: "04",
    title: "Campañas y Colaboraciones",
    tags: ["Visión", "Estética", "Expresión", "Legado"],
    desc: "Conectamos marcas con nuestra comunidad y desarrollamos campañas que combinan creatividad, estrategia y alcance. Generamos colaboraciones auténticas que potencian visibilidad y posicionamiento.",
    headline: "Lo que no se ve, no existe.",
    body: "Conectamos marcas con nuestra comunidad y desarrollamos campañas que combinan creatividad, estrategia y alcance. Generamos colaboraciones auténticas que potencian visibilidad y posicionamiento.",
    stat: ["4K / RAW", "producción editorial de nivel broadcast"],
  },
  {
    num: "05",
    title: "Diseño Web",
    tags: ["HTML5", "CSS", "JavaScript", "UX/UI"],
    desc: "Somos especialistas en diseño web profesional, combinando creatividad, tecnología avanzada y estrategias innovadoras para desarrollar sitios web espectaculares, intuitivos y completamente personalizados.",
    headline: "Tu marca en la web. Sin concesiones.",
    body: "Diseñamos sitios web profesionales que combinan creatividad, tecnología y estrategia. Cada proyecto es único: desde landing pages de alto impacto hasta e-commerce completos con experiencia de usuario excepcional.",
    stat: ["100%", "Responsive y optimizado para conversión"],
  },
  {
    num: "06",
    title: "Aplicaciones",
    tags: ["Python", "Node.js", "Go", "Swift / Kotlin"],
    desc: "Desarrollamos aplicaciones móviles y web personalizadas, escalables y de alto rendimiento, incluyendo apps para iOS y Android, PWA y sistemas a medida.",
    headline: "Software que escala con tu negocio.",
    body: "Desarrollamos aplicaciones móviles y web personalizadas, escalables y de alto rendimiento. iOS, Android, PWA y sistemas a medida conectados con tus herramientas actuales.",
    stat: ["x3", "Velocidad de desarrollo con stack moderno"],
  },
  {
    num: "07",
    title: "Branding",
    tags: ["Identidad", "Naming", "Manual de Marca"],
    desc: "Creamos identidades de marca que generan reconocimiento y conexión emocional. Logo, paleta, tipografía, voz y toda la arquitectura visual de tu empresa.",
    headline: "Una marca que se recuerda.",
    body: "Construimos identidades visuales que generan reconocimiento y conexión emocional. Logo, paleta, tipografía, voz y toda la arquitectura visual de tu empresa desde cero.",
    stat: ["360°", "Identidad visual completa y coherente"],
  },
  {
    num: "08",
    title: "Publicidad Digital",
    tags: ["Meta Ads", "Google Ads", "SEO"],
    desc: "Gestionamos campañas publicitarias en Meta, Google y redes sociales con foco en conversión. Estrategia, segmentación, creativos y optimización continua.",
    headline: "Inversión que se convierte en clientes.",
    body: "Gestionamos campañas en Meta, Google y redes sociales con foco absoluto en conversión. Estrategia, segmentación inteligente, creativos de alto impacto y optimización continua.",
    stat: ["ROAS+", "Retorno medible en cada campaña"],
  },
  {
    num: "09",
    title: "Agentes IA",
    tags: ["Multi-Agente", "Ejecución 24/7", "Colmena"],
    desc: "Desplegamos colmenas de agentes inteligentes que operan de forma autónoma: analizan datos, generan contenido, optimizan campañas y ejecutan procesos sin intervención humana.",
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
    <span
      className="svc-matrix-col"
      aria-hidden
      style={{
        right,
        color: COLORS.secondary,
        fontSize: "0.75rem",
        fontFamily: "var(--font-display)",
        textShadow: `0 0 8px ${COLORS.secondary}80, 0 0 4px ${COLORS.primary}40`,
      }}
    >
      {(active ? chars : BLANK_COL).map((ch, i) => (
        <span key={i} style={{ opacity: Math.max(0, 0.8 - i * 0.12), display: "block" }}>{ch}</span>
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
        position: "relative",
        color: "var(--text)",
        rotateX,
        rotateY,
        transformPerspective: 1200,
        background: hovered ? `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15, ${COLORS.secondary}15)` : "transparent",
        borderLeft: `3px solid transparent`,
        borderRight: `3px solid transparent`,
        borderBottom: `2px solid`,
        borderImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) 1`,
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? `0 0 40px ${COLORS.primary}80, 0 0 60px ${COLORS.secondary}50, 0 0 80px ${COLORS.secondary}40, inset 0 0 40px ${COLORS.primary}15`
          : `0 0 20px ${COLORS.primary}40, 0 0 10px ${COLORS.secondary}20`,
        cursor: "pointer",
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
          color: COLORS.primary,
          letterSpacing: "0.2em",
          transition: "all 0.3s",
          position: "relative",
          zIndex: 1,
          textShadow: hovered ? `0 0 12px ${COLORS.primary}, 0 0 8px ${COLORS.secondary}` : `0 0 6px ${COLORS.primary}80`,
        }}
      >
        {sv.num}
      </span>

      <div className="svc-content" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", width: "100%", transition: "all 0.3s" }}>
        <h3
          className="svc-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            fontWeight: 700,
            transition: "all 0.3s",
            color: hovered ? "#FFFFFF" : COLORS.primary,
            textShadow: "none",
            margin: 0,
            textAlign: hovered ? "left" : "center",
            width: "100%",
          }}
        >
          {title.display}
        </h3>
        {hovered && (
          <div className="svc-tags" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px", animation: "fadeIn 0.3s ease" }}>
            {sv.tags.map((t) => (
              <span
                key={t}
                className="svc-tag"
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-display)",
                  padding: "4px 10px",
                  border: `1px solid ${COLORS.secondary}80`,
                  background: `${COLORS.secondary}20`,
                  color: COLORS.secondary,
                  letterSpacing: "0.1em",
                  transition: "all 0.3s",
                  boxShadow: `0 0 12px ${COLORS.secondary}60`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <p
          className="svc-desc"
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.6)",
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
          color: COLORS.secondary,
          transition: "all 0.3s",
          letterSpacing: "0.1em",
          position: "relative",
          zIndex: 1,
          textShadow: hovered ? `0 0 15px ${COLORS.secondary}, 0 0 10px ${COLORS.primary}` : "0 0 6px rgba(255,27,141,0.5)",
        }}
      >
        Ver más →
      </span>
    </motion.div>
  );
}

export default function Services() {
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
      <div
        className="svc-modal"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.secondary}15, ${COLORS.secondary}20)`,
          borderImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) 1`,
          boxShadow: `0 0 80px ${COLORS.primary}60, 0 0 60px ${COLORS.secondary}40, 0 0 100px ${COLORS.secondary}30, inset 0 0 60px ${COLORS.primary}20`
        }}
      >
        <button
          className="svc-modal-close"
          onClick={() => setActive(null)}
          aria-label="Cerrar"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div
          className="svc-modal-num-label"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {s.num} — {s.title}
        </div>
        {s.headline && (
          <h3
            className="svc-modal-headline"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {s.headline}
          </h3>
        )}
        {s.headline && (
          <div
            className="svc-modal-divider"
            style={{ background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.secondary})` }}
          />
        )}
        <p className="svc-modal-body">{s.body}</p>

        <div className="svc-modal-stat">
          <span
            className="svc-modal-stat-num"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {s.stat[0]}
          </span>
          <span className="svc-modal-stat-label">{s.stat[1]}</span>
        </div>

        <div className="svc-modal-tags-row">
          {s.tags.map((t) => (
            <span
              key={t}
              className="svc-tag"
              style={{
                borderImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) 1`,
                color: COLORS.secondary
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="svc-modal-cta-row">
          <a
            className="svc-modal-cta"
            href={`https://api.whatsapp.com/send?phone=5491156072460&text=Hola!%20me%20interesa%20${encodeURIComponent(s.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#000",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              boxShadow: `0 0 40px ${COLORS.primary}, 0 0 30px ${COLORS.secondary}, 0 0 50px ${COLORS.secondary}`,
            }}
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
        id="sec4"
        className="services-section section"
        style={{
          background: "var(--bg)",
          padding: "120px 0",
          position: "relative",
        }}
      >
        <div className="section-container">
          <div className="svc-list-header">
            <SectionTitle eyebrow="Servicios" lines={["Creamos", "universos"]} />
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
