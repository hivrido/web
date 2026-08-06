"use client";

/**
 * Landing de diseño y desarrollo web.
 *
 * Sigue el recorrido de la home —encabezado, cinta, servicios, trabajos,
 * testimonios, cierre— con el contenido de fuxxia traído al lenguaje visual
 * de Hivrido: violeta y fucsia, Orbitron para los títulos, fondo negro.
 *
 * Dos decisiones que la separan del resto del sitio: cada bloque lleva en su
 * encabezado el término exacto por el que se puja, porque la coincidencia
 * entre consulta, anuncio y página es lo que baja el costo por clic; y el
 * cierre da plazo y precio antes de pedir nada, porque en tráfico frío la
 * objeción no es estética, es riesgo.
 */

import Image from "next/image";
import { useRef } from "react";
import { useStaggerReveal } from "../../hooks/useStaggerReveal";
import SectionTitle from "../ui/SectionTitle";

const wa = (asunto: string) =>
  `https://api.whatsapp.com/send?phone=5491156072460&text=${encodeURIComponent(
    `Hola Hivrido! Quiero consultar por ${asunto}.`
  )}`;

/** Cinta superior: los términos de la campaña, en movimiento. */
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

/** Un bloque por término. El título es el término, literal. */
const SERVICIOS = [
  {
    num: "01",
    titulo: "Diseño web",
    tags: ["UI/UX", "Responsive", "Landing", "E-commerce"],
    desc: "Diseño web profesional que combina creatividad, tecnología y estrategia. Cada proyecto se compone desde cero: nada de plantillas ni constructores visuales.",
    stat: ["100%", "Responsive y optimizado para conversión"],
  },
  {
    num: "02",
    titulo: "Diseño de página web",
    tags: ["Institucional", "Catálogo", "Tienda"],
    desc: "Desde una landing de campaña hasta un sitio institucional o una tienda completa. Estructura pensada para que se entienda qué hacés en los primeros cinco segundos.",
    stat: ["5 s", "Para entender tu propuesta y saber cómo contactarte"],
  },
  {
    num: "03",
    titulo: "Desarrollo web",
    tags: ["Next.js", "React", "Node.js", "Core Web Vitals"],
    desc: "Código propio, sin constructores que engordan la página. Carga rápida, buenas métricas y un sitio que Google puede rastrear e indexar sin obstáculos.",
    stat: ["x3", "Velocidad de desarrollo con stack moderno"],
  },
  {
    num: "04",
    titulo: "Programación a medida",
    tags: ["Python", "Go", "Swift / Kotlin", "APIs"],
    desc: "Aplicaciones móviles y web personalizadas, escalables y de alto rendimiento. iOS, Android, PWA y sistemas conectados con las herramientas que ya usás.",
    stat: ["24/7", "Integraciones que corren solas"],
  },
  {
    num: "05",
    titulo: "Desarrollo de sistemas",
    tags: ["ERP", "Paneles", "Multiusuario", "Reportes"],
    desc: "Sistemas de gestión, paneles internos y software de negocio. Roles y permisos, reportes exportables y una base preparada para crecer sin rehacerla.",
    stat: ["ERP", "A medida, no un paquete cerrado"],
  },
  {
    num: "06",
    titulo: "Colmena de agentes IA",
    tags: ["Multi-agente", "Autónomo", "CRM"],
    desc: "Agentes que analizan, crean, optimizan y ejecutan a escala. Responden consultas, califican interesados y hacen seguimiento sin intervención humana.",
    stat: ["Auto", "Ejecución sin intervención manual"],
  },
];

/** Trabajos reales: el tráfico frío necesita ver que esto ya se hizo. */
const TRABAJOS = [
  {
    num: ".01",
    titulo: "Software inmobiliario",
    tags: ["ERP", "Lotes", "Pozo"],
    desc: "Conexión a las plataformas de publicación y a todas las redes sociales.",
    img: "/images/folio/5.webp",
  },
  {
    num: ".02",
    titulo: "E-commerce",
    tags: ["Envíos", "Automatización"],
    desc: "Almacenamiento y publicación de productos sin límites.",
    img: "/images/folio/3.webp",
  },
  {
    num: ".03",
    titulo: "Concesionarios",
    tags: ["Convencional", "Plan de ahorro"],
    desc: "Software de datos conectado a las plataformas publicitarias de Google y Meta.",
    img: "/images/folio/8.webp",
  },
  {
    num: ".04",
    titulo: "Turnos y servicios",
    tags: ["Médico", "Profesionales"],
    desc: "Reserva de turnos, segmentación de especialidades, atención local o a domicilio.",
    img: "/images/folio/27.webp",
  },
  {
    num: ".05",
    titulo: "Diseño web premium",
    tags: ["Landing", "UI/UX"],
    desc: "Sitios de alta conversión, rápidos y visualmente impactantes.",
    img: "/images/folio/1.webp",
  },
  {
    num: ".06",
    titulo: "Branding completo",
    tags: ["Manual de marca", "Logo"],
    desc: "Identidades visuales que generan reconocimiento y confianza.",
    img: "/images/folio/2.webp",
  },
];

const TESTIMONIOS = [
  {
    nombre: "M. Maioli",
    empresa: "mympropiedades.com.ar",
    texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario.",
  },
  {
    nombre: "S. Borrero",
    empresa: "rappi.com.ar",
    texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral.",
  },
  {
    nombre: "C. Maggione",
    empresa: "telotomo.com",
    texto: "Un lujo de punta a punta. Un equipo que entiende de tecnología y de negocios, que se mete de lleno en el proyecto y lo lleva al máximo nivel. Nos ayudaron a revolucionar el mercado de la compra de autos, y el resultado habla por sí solo.",
  },
  {
    nombre: "H. Winnik",
    empresa: "flow.com.ar",
    texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales.",
  },
];

/** Objeciones de tráfico frío: qué recibe, cuándo y con qué respaldo. */
const GARANTIAS = [
  ["Respuesta", "El mismo día, con alcance y precio"],
  ["Entrega", "De 7 a 30 días según el proyecto"],
  ["Incluido", "Dominio, hosting y certificado el primer año"],
  ["Después", "Tres meses de ajustes sin costo"],
];

export default function WebDesign() {
  const servicios = useRef<HTMLDivElement>(null);
  const trabajos = useRef<HTMLDivElement>(null);
  const testimonios = useRef<HTMLDivElement>(null);

  useStaggerReveal(servicios, { selector: ".web-card", stagger: 0.07 });
  useStaggerReveal(trabajos, { selector: ".web-work", stagger: 0.07 });
  useStaggerReveal(testimonios, { selector: ".web-quote", stagger: 0.09 });

  return (
    <>
      {/* ── Cinta ── */}
      <div className="web-ticker" aria-hidden>
        <div className="web-ticker-track">
          {[0, 1].map((copia) => (
            <div className="web-ticker-run" key={copia}>
              {TICKER.map((t) => (
                <span className="web-ticker-item" key={t}>
                  {t}
                  <i className="web-ticker-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Servicios ── */}
      <section id="sec-diseno-web" className="web-section section">
        <div className="section-container">
          <SectionTitle eyebrow="Qué hacemos" lines={["Sitios que", "trabajan"]} />

          <p className="web-lead">
            Hacemos <strong>diseño web</strong> y <strong>desarrollo web</strong> para marcas
            que necesitan vender, no solo estar. Desde el{" "}
            <strong>diseño de una página web</strong> hasta{" "}
            <strong>programación a medida</strong>, <strong>desarrollo de sistemas</strong> y{" "}
            <strong>colmenas de agentes IA</strong> que atienden a tus clientes mientras dormís.
          </p>

          <div className="web-grid" ref={servicios}>
            {SERVICIOS.map((s) => (
              <article className="web-card" key={s.num}>
                <span className="web-card-num">{s.num}</span>
                <h3 className="web-card-title">{s.titulo}</h3>
                <p className="web-card-desc">{s.desc}</p>

                <div className="web-card-stat">
                  <span className="web-card-stat-num">{s.stat[0]}</span>
                  <span className="web-card-stat-label">{s.stat[1]}</span>
                </div>

                <div className="web-card-tags">
                  {s.tags.map((t) => (
                    <span className="web-tag" key={t}>{t}</span>
                  ))}
                </div>

                <a
                  className="web-card-link"
                  href={wa(s.titulo.toLowerCase())}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir presupuesto <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trabajos ── */}
      <section id="sec-trabajos" className="web-section web-section--alt section">
        <div className="section-container">
          <SectionTitle eyebrow="Trabajos" lines={["Ya lo", "hicimos"]} />

          <div className="web-works" ref={trabajos}>
            {TRABAJOS.map((t) => (
              <article className="web-work" key={t.num}>
                <div className="web-work-media">
                  <Image
                    src={t.img}
                    alt={t.titulo}
                    width={640}
                    height={420}
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
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="web-section section">
        <div className="section-container">
          <SectionTitle eyebrow="Clientes" lines={["Lo que", "dicen"]} />

          <div className="web-quotes" ref={testimonios}>
            {TESTIMONIOS.map((t) => (
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
            {GARANTIAS.map(([clave, valor]) => (
              <div className="web-guarantee-item" key={clave}>
                <span className="web-guarantee-key">{clave}</span>
                <span className="web-guarantee-value">{valor}</span>
              </div>
            ))}
          </div>

          <div className="web-cta">
            <h2 className="web-cta-title">Contanos qué necesitás</h2>
            <p className="web-cta-text">
              Te respondemos con una propuesta concreta: alcance, plazo y precio. Sin reuniones
              eternas ni presupuestos de cuarenta páginas.
            </p>
            <div className="web-cta-row">
              <a
                className="web-cta-btn"
                href={wa("un proyecto web")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribinos por WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="web-cta-mail" href="mailto:hola@hivrido.com?subject=Consulta%20por%20diseño%20web">
                hola@hivrido.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
