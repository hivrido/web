"use client";

/**
 * Landing de diseño y desarrollo web.
 *
 * Sigue el recorrido de la home —cinta, servicios, trabajos, testimonios,
 * cierre— y reusa sus mismos gestos: título que se descifra al pasar, columnas
 * de caracteres cayendo, inclinación 3D siguiendo el puntero y modal con el
 * detalle. No son copias: `useScramble` y `MatrixCol` son los módulos que
 * también usa la home, y las clases .svc-* son las mismas, así que cualquier
 * cambio de identidad llega a los dos lados.
 *
 * El contenido viene de fuxxia. Cada servicio lleva en su encabezado el
 * término exacto por el que se puja, porque la coincidencia entre consulta,
 * anuncio y página es lo que baja el costo por clic.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import FeatureCarousel from "../ui/FeatureCarousel";
import AIHiveSection from "./AIHiveSection";
import MatrixCol from "../ui/MatrixCol";
import { useScramble } from "../ui/useScramble";
import { useStaggerReveal } from "../../hooks/useStaggerReveal";

const COLORS = { primary: "#7C3AED", secondary: "#FF1B8D" };

const wa = (asunto: string) =>
  `https://api.whatsapp.com/send?phone=5491156072460&text=${encodeURIComponent(
    `Hola Hivrido! Quiero consultar por ${asunto}.`
  )}`;

/* ── Contenido ──
   La estructura es la misma para toda landing de servicio; lo que cambia es
   qué dice. Sale del componente para que otra ruta —la colmena de agentes—
   monte el mismo recorrido con su propio contenido, y cualquier ajuste de
   identidad o de gestos llegue a las dos sin tocar dos archivos. */
export type Servicio = {
  num: string;
  title: string;
  tags: string[];
  desc: string;
  headline: string;
  body: string;
  stat: [string, string];
};

export type LandingContent = {
  /** id de la sección de servicios: lo usan el hero y el CTA de la colmena */
  id: string;
  ticker: string[];
  title: { eyebrow: string; lines: string[] };
  lead: React.ReactNode;
  servicios: Servicio[];
  /** Bloque propio entre la cinta y los servicios: la landing de cine mete
   *  ahí los trailers, que se miran antes de leer qué hacemos. */
  extra?: React.ReactNode;
  /** Sin trabajos, la grilla no se monta: hay páginas que muestran su obra
   *  con otro formato. */
  trabajos?: { num: string; titulo: string; tags: string[]; desc: string; img: string }[];
  trabajosTitle?: { eyebrow: string; lines: string[] };
  /** Grilla en formato retrato: para fotos de personas, no de pantallas. */
  trabajosRetrato?: boolean;
  /** Carrusel en vez de grilla: muestra una pieza por vez, con foco. */
  trabajosCarrusel?: boolean;
  testimonios: { nombre: string; empresa: string; texto: string }[];
  garantias: [string, string][];
  cta: { title: string; text: string; asunto: string; mail: string };
  /** Bloque de la colmena de agentes. Solo donde el servicio lo incluye. */
  hive?: boolean;
};

const TICKER = [
  "Diseño web",
  "Diseño de página web",
  "Desarrollo web",
  "Programación a medida",
  "Desarrollo de sistemas",
  "Colmena de agentes IA",
  "Publicidad digital",
  "Branding",
];

const servicios: Servicio[] = [
  {
    num: "01",
    title: "Diseño web",
    tags: ["UI/UX", "Responsive", "Landing", "E-commerce"],
    desc: "Diseño web profesional que combina creatividad, tecnología y estrategia. Cada proyecto se compone desde cero: nada de plantillas ni constructores visuales.",
    headline: "Tu marca en la web. Sin concesiones.",
    body: "Diseñamos sitios web profesionales que combinan creatividad, tecnología y estrategia. Cada proyecto es único: desde landing pages de alto impacto hasta e-commerce completos, con una experiencia de usuario pensada para que el visitante llegue al contacto.",
    stat: ["100%", "Responsive y optimizado para conversión"],
  },
  {
    num: "02",
    title: "Diseño de página web",
    tags: ["Institucional", "Catálogo", "Tienda", "Blog"],
    desc: "Desde una landing de campaña hasta un sitio institucional o una tienda completa. Estructura pensada para que se entienda qué hacés en los primeros cinco segundos.",
    headline: "Que se entienda antes de que se vaya.",
    body: "El visitante decide en segundos si sos lo que buscaba. Ordenamos la página para que la propuesta, la prueba y el contacto aparezcan en ese orden, en cualquier dispositivo y sin hacer scroll a ciegas.",
    stat: ["5 s", "Para entender tu propuesta y saber cómo contactarte"],
  },
  {
    num: "03",
    title: "Desarrollo web",
    tags: ["Next.js", "React", "Node.js", "Core Web Vitals"],
    desc: "Código propio, sin constructores que engordan la página. Carga rápida, buenas métricas y un sitio que Google puede rastrear e indexar sin obstáculos.",
    headline: "Rápido no es un lujo: es posicionamiento.",
    body: "Desarrollamos con Next.js y React, con render estático donde se puede y medición de Core Web Vitals desde el primer día. Un sitio lento no solo pierde visitas: paga más caro cada clic en publicidad.",
    stat: ["x3", "Velocidad de desarrollo con stack moderno"],
  },
  {
    num: "04",
    title: "Programación a medida",
    tags: ["Python", "Go", "Swift / Kotlin", "APIs"],
    desc: "Aplicaciones móviles y web personalizadas, escalables y de alto rendimiento. iOS, Android, PWA y sistemas conectados con las herramientas que ya usás.",
    headline: "Software que escala con tu negocio.",
    body: "Cuando lo que necesitás no existe hecho. Conectamos tu sitio con el CRM, la facturación, el stock o la plataforma que ya usás, y automatizamos lo que hoy alguien hace a mano.",
    stat: ["24/7", "Integraciones que corren solas"],
  },
  {
    num: "05",
    title: "Desarrollo de sistemas",
    tags: ["ERP", "Paneles", "Multiusuario", "Reportes"],
    desc: "Sistemas de gestión, paneles internos y software de negocio. Roles y permisos, reportes exportables y una base preparada para crecer sin rehacerla.",
    headline: "Un ERP que se adapta a vos, no al revés.",
    body: "Construimos sistemas de gestión a medida: roles y permisos, trazabilidad, reportes que se exportan y una arquitectura pensada para sumar módulos sin reescribir lo que ya funciona.",
    stat: ["ERP", "A medida, no un paquete cerrado"],
  },
  {
    num: "06",
    title: "Colmena de agentes IA",
    tags: ["Multi-agente", "Autónomo", "CRM", "24/7"],
    desc: "Agentes que analizan, crean, optimizan y ejecutan a escala. Responden consultas, califican interesados y hacen seguimiento sin intervención humana.",
    headline: "Tu negocio en piloto automático.",
    body: "Es PUNY, el motor que corre dentro de Hivrido, adaptado a tu negocio. Sistemas multi-agente conectados a tu CRM, tus campañas y tus canales de comunicación, trabajando mientras dormís.",
    stat: ["Auto", "Ejecución sin intervención manual"],
  },
];

const TRABAJOS = [
  { num: ".01", titulo: "Software inmobiliario", tags: ["ERP", "Lotes", "Pozo"], desc: "Conexión a las plataformas de publicación y a todas las redes sociales.", img: "/images/folio/5.webp" },
  { num: ".02", titulo: "E-commerce", tags: ["Envíos", "Automatización"], desc: "Almacenamiento y publicación de productos sin límites.", img: "/images/folio/3.webp" },
  { num: ".03", titulo: "Concesionarios", tags: ["Convencional", "Plan de ahorro"], desc: "Software de datos conectado a las plataformas publicitarias de Google y Meta.", img: "/images/folio/8.webp" },
  { num: ".04", titulo: "Turnos y servicios", tags: ["Médico", "Profesionales"], desc: "Reserva de turnos, segmentación de especialidades, atención local o a domicilio.", img: "/images/folio/27.webp" },
  { num: ".05", titulo: "Diseño web premium", tags: ["Landing", "UI/UX"], desc: "Sitios de alta conversión, rápidos y visualmente impactantes.", img: "/images/folio/1.webp" },
  { num: ".06", titulo: "Branding completo", tags: ["Manual de marca", "Logo"], desc: "Identidades visuales que generan reconocimiento y confianza.", img: "/images/folio/2.webp" },
];

const TESTIMONIOS = [
  { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
  { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
  { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
];

const GARANTIAS: [string, string][] = [
  ["Respuesta", "El mismo día, con alcance y precio"],
  ["Entrega", "De 7 a 30 días según el proyecto"],
  ["Incluido", "Dominio, hosting y certificado el primer año"],
  ["Después", "Tres meses de ajustes sin costo"],
];

/** Contenido por defecto: la landing de diseño y desarrollo web. */
export const WEB_CONTENT: LandingContent = {
  id: "sec-diseno-web",
  ticker: TICKER,
  title: { eyebrow: "Qué hacemos", lines: ["Sitios que", "trabajan"] },
  lead: (
    <>
      Hacemos <strong>diseño web</strong> y <strong>desarrollo web</strong> para marcas
      que necesitan vender, no solo estar. Desde el{" "}
      <strong>diseño de una página web</strong> hasta{" "}
      <strong>programación a medida</strong>, <strong>desarrollo de sistemas</strong> y{" "}
      <strong>colmenas de agentes IA</strong> que atienden a tus clientes mientras dormís.
    </>
  ),
  servicios,
  trabajos: TRABAJOS,
  trabajosTitle: { eyebrow: "Trabajos", lines: ["Ya lo", "hicimos"] },
  trabajosCarrusel: true,
  testimonios: TESTIMONIOS,
  garantias: GARANTIAS,
  cta: {
    title: "Contanos qué necesitás",
    text: "Te respondemos con una propuesta concreta: alcance, plazo y precio. Sin reuniones eternas ni presupuestos de cuarenta páginas.",
    asunto: "un proyecto web",
    mail: "Consulta por diseño web",
  },
};

/* ── Fila de servicio: el mismo gesto que en la home ── */
function ServicioItem({ sv, onClick }: { sv: Servicio; onClick: () => void }) {
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
      role="button"
      tabIndex={0}
      aria-label={`${sv.title} — ver detalle`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
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
        background: hovered
          ? `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`
          : "transparent",
        borderBottom: "2px solid",
        borderImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) 1`,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered
          ? `0 0 40px ${COLORS.primary}80, 0 0 60px ${COLORS.secondary}50, inset 0 0 40px ${COLORS.primary}15`
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
          position: "relative",
          zIndex: 1,
          textShadow: hovered
            ? `0 0 12px ${COLORS.primary}, 0 0 8px ${COLORS.secondary}`
            : `0 0 6px ${COLORS.primary}80`,
        }}
      >
        {sv.num}
      </span>

      <div className="svc-content" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        <h3
          className="svc-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            fontWeight: 700,
            transition: "color 0.3s",
            color: hovered ? "#FFFFFF" : COLORS.primary,
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
                  boxShadow: `0 0 12px ${COLORS.secondary}60`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="svc-desc" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "500px" }}>
          {sv.desc}
        </p>
      </div>

      <span
        className="svc-arrow"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.7rem",
          color: COLORS.secondary,
          letterSpacing: "0.1em",
          position: "relative",
          zIndex: 1,
          textShadow: hovered
            ? `0 0 15px ${COLORS.secondary}, 0 0 10px ${COLORS.primary}`
            : "0 0 6px rgba(255,27,141,0.5)",
        }}
      >
        Ver más →
      </span>
    </motion.div>
  );
}

export default function WebDesign({ content = WEB_CONTENT }: { content?: LandingContent }) {
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const listaRef = useRef<HTMLDivElement>(null);
  const trabajosRef = useRef<HTMLDivElement>(null);
  const testimoniosRef = useRef<HTMLDivElement>(null);

  useStaggerReveal(listaRef, { selector: ".svc-item", stagger: 0.09 });
  useStaggerReveal(trabajosRef, { selector: ".web-work", stagger: 0.07 });
  useStaggerReveal(testimoniosRef, { selector: ".web-quote", stagger: 0.08 });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => { clearTimeout(t); setMounted(false); };
  }, []);

  /* El modal abierto congela el fondo y se cierra con Escape */
  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const s = active !== null ? content.servicios[active] : null;

  const gradientText = {
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    backgroundClip: "text" as const,
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
  };

  const modal = mounted && active !== null && s ? (
    <div
      className="svc-modal-overlay"
      onClick={(e) => { if (e.currentTarget === e.target) setActive(null); }}
    >
      <div
        className="svc-modal"
        role="dialog"
        aria-modal="true"
        aria-label={s.title}
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.secondary}15)`,
          borderImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) 1`,
          boxShadow: `0 0 80px ${COLORS.primary}60, 0 0 60px ${COLORS.secondary}40, inset 0 0 60px ${COLORS.primary}20`,
        }}
      >
        <button className="svc-modal-close" onClick={() => setActive(null)} aria-label="Cerrar">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="svc-modal-num-label" style={gradientText}>
          {s.num} — {s.title}
        </div>

        <h3 className="svc-modal-headline" style={gradientText}>{s.headline}</h3>
        <div
          className="svc-modal-divider"
          style={{ background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})` }}
        />

        <p className="svc-modal-body">{s.body}</p>

        <div className="svc-modal-stat">
          <span className="svc-modal-stat-num" style={gradientText}>{s.stat[0]}</span>
          <span className="svc-modal-stat-label">{s.stat[1]}</span>
        </div>

        <div className="svc-modal-tags-row">
          {s.tags.map((t) => (
            <span
              key={t}
              className="svc-tag"
              style={{
                borderImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary}) 1`,
                color: COLORS.secondary,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="svc-modal-cta-row">
          <a
            className="svc-modal-cta"
            href={wa(s.title.toLowerCase())}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pedir presupuesto
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
      {/* ── Cinta ── */}
      <div className="web-ticker" aria-hidden>
        <div className="web-ticker-track">
          {[0, 1].map((copia) => (
            <div className="web-ticker-run" key={copia}>
              {content.ticker.map((t) => (
                <span className="web-ticker-item" key={t}>
                  {t}
                  <i className="web-ticker-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {content.extra}

      {/* ── Servicios ── */}
      <section id={content.id} className="services-section section" style={{ background: "var(--bg)", padding: "120px 0", position: "relative" }}>
        <div className="section-container">
          <div className="svc-list-header">
            <SectionTitle eyebrow={content.title.eyebrow} lines={content.title.lines} />
          </div>

          <p className="web-lead">{content.lead}</p>

          <div className="svc-list" ref={listaRef}>
            {content.servicios.map((sv, i) => (
              <ServicioItem key={sv.num} sv={sv} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Colmena de agentes ── el mismo bloque que la home, acá desarrolla
           el servicio que la lista acaba de nombrar ── */}
      {content.hive !== false && <AIHiveSection ctaHref={`#${content.id}`} />}

      {/* ── Trabajos ── */}
      {content.trabajos?.length ? (
      <section id="sec-trabajos" className="web-section web-section--alt section">
        <div className="section-container">
          <SectionTitle
            eyebrow={content.trabajosTitle?.eyebrow ?? "Trabajos"}
            lines={content.trabajosTitle?.lines ?? ["Ya lo", "hicimos"]}
          />

          {content.trabajosCarrusel ? (
            <FeatureCarousel items={content.trabajos} />
          ) : (
          <div
            className={`web-works${content.trabajosRetrato ? " web-works--retrato" : ""}`}
            ref={trabajosRef}
          >
            {content.trabajos.map((t) => (
              <article className="web-work" key={t.num}>
                <div className="web-work-media">
                  <Image
                    src={t.img}
                    alt={t.titulo}
                    width={640}
                    height={content.trabajosRetrato ? 800 : 420}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="web-work-body">
                  <span className="web-work-num">{t.num}</span>
                  <h3 className="web-work-title">{t.titulo}</h3>
                  <p className="web-work-desc">{t.desc}</p>
                  <div className="web-card-tags">
                    {t.tags.map((tag) => (
                      <span className="web-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
      ) : null}

      {/* ── Testimonios ── */}
      <section className="web-section section">
        <div className="section-container">
          <SectionTitle eyebrow="Clientes" lines={["Lo que", "dicen"]} />

          <div className="web-quotes" ref={testimoniosRef}>
            {content.testimonios.map((t) => (
              <figure className="web-quote" key={t.empresa}>
                <blockquote className="web-quote-text">{t.texto}</blockquote>
                <figcaption className="web-quote-author">
                  <span className="web-quote-name">{t.nombre}</span>
                  <span className="web-quote-company">{t.empresa}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="web-section web-section--alt section">
        <div className="section-container">
          <div className="web-guarantee">
            {content.garantias.map(([clave, valor]) => (
              <div className="web-guarantee-item" key={clave}>
                <span className="web-guarantee-key">{clave}</span>
                <span className="web-guarantee-value">{valor}</span>
              </div>
            ))}
          </div>

          <div className="web-cta">
            <h2 className="web-cta-title">{content.cta.title}</h2>
            <p className="web-cta-text">{content.cta.text}</p>
            <div className="web-cta-row">
              <a className="web-cta-btn" href={wa(content.cta.asunto)} target="_blank" rel="noopener noreferrer">
                Escribinos por WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="web-cta-mail" href={`mailto:hola@hivrido.com?subject=${encodeURIComponent(content.cta.mail)}`}>
                hola@hivrido.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
