"use client";

/**
 * Sección de captación para campañas de búsqueda en Google Ads.
 *
 * A diferencia del resto de la home, que construye marca, esta sección existe
 * para convertir tráfico pago. Eso cambia dos cosas:
 *
 *  - Cada bloque lleva en su encabezado el término exacto por el que se puja.
 *    Google evalúa la coincidencia entre la consulta, el anuncio y la página,
 *    y esa coincidencia baja el costo por clic. Los títulos son <h3> reales,
 *    no texto decorado, porque el rastreador lee la jerarquía.
 *  - Cierra con precio de entrada, plazo y garantía. En tráfico frío la
 *    objeción no es estética, es riesgo.
 */

import { useRef } from "react";
import SectionTitle from "../ui/SectionTitle";
import { useStaggerReveal } from "../../hooks/useStaggerReveal";

const VIOLET = "#7C3AED";
const FUCHSIA = "#FF1B8D";

const wa = (asunto: string) =>
  `https://api.whatsapp.com/send?phone=5491156072460&text=${encodeURIComponent(
    `Hola Hivrido! Quiero consultar por ${asunto}.`
  )}`;

/** Un bloque por término de la campaña. El título es el término, literal. */
const CAPACIDADES = [
  {
    num: "01",
    titulo: "Diseño web",
    tags: ["UX/UI", "Identidad", "Responsive"],
    desc: "Diseñamos sitios que se ven como la marca que querés ser. Dirección de arte propia, no plantillas: cada pantalla se compone desde cero y se prueba en teléfono antes que en escritorio.",
  },
  {
    num: "02",
    titulo: "Diseño de página web",
    tags: ["Landing", "Institucional", "E-commerce"],
    desc: "Desde una landing de campaña hasta un sitio institucional o una tienda completa. Estructura pensada para que el visitante entienda qué hacés en los primeros cinco segundos y sepa cómo contactarte.",
  },
  {
    num: "03",
    titulo: "Desarrollo web",
    tags: ["Next.js", "React", "Core Web Vitals"],
    desc: "Código propio, sin constructores visuales que engordan la página. Carga rápida, buenas métricas y un sitio que Google puede rastrear e indexar sin obstáculos.",
  },
  {
    num: "04",
    titulo: "Programación a medida",
    tags: ["APIs", "Integraciones", "Automatización"],
    desc: "Cuando lo que necesitás no existe hecho. Conectamos tu sitio con el CRM, la facturación, el stock o la plataforma que ya usás, y automatizamos lo que hoy alguien hace a mano.",
  },
  {
    num: "05",
    titulo: "Desarrollo de sistemas",
    tags: ["Paneles", "Multiusuario", "Reportes"],
    desc: "Sistemas de gestión, paneles internos y aplicaciones de negocio. Roles y permisos, reportes que se exportan y una base preparada para crecer sin rehacerla.",
  },
  {
    num: "06",
    titulo: "Colmena de agentes IA",
    tags: ["24/7", "Multi-agente", "CRM"],
    desc: "Agentes que responden consultas, califican interesados y hacen seguimiento sin intervención. Es PUNY, el motor que corre dentro de Hivrido, adaptado a tu negocio.",
  },
];

/** Objeciones de tráfico frío: qué recibe, en cuánto tiempo, con qué respaldo. */
const GARANTIAS = [
  ["Entrega", "De 7 a 30 días según alcance"],
  ["Incluido", "Dominio, hosting y certificado el primer año"],
  ["Medición", "Google Analytics y conversiones configuradas"],
  ["Después", "Tres meses de ajustes sin costo"],
];

/** Datos estructurados: le dicen al buscador qué se ofrece y dónde. */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Diseño y desarrollo web",
  provider: {
    "@type": "Organization",
    name: "Hivrido",
    url: "https://hivrido.com",
    areaServed: { "@type": "Country", name: "Argentina" },
  },
  description:
    "Diseño web, diseño de página web, desarrollo web, programación a medida, desarrollo de sistemas y colmenas de agentes IA para empresas y marcas.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de diseño y desarrollo web",
    itemListElement: CAPACIDADES.map((c) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: c.titulo, description: c.desc },
    })),
  },
};

export default function WebDesign() {
  const grid = useRef<HTMLDivElement>(null);
  useStaggerReveal(grid, { selector: ".web-card", stagger: 0.08 });

  return (
    <section id="sec-diseno-web" className="web-section section">
      <div className="section-container">
        <SectionTitle eyebrow="Diseño y Desarrollo Web" lines={["Sitios que", "trabajan"]} />

        <p className="web-lead">
          Hacemos <strong>diseño web</strong> y <strong>desarrollo web</strong> para marcas
          que necesitan vender, no solo estar. Desde el <strong>diseño de una página web</strong>{" "}
          hasta <strong>programación a medida</strong>, <strong>desarrollo de sistemas</strong> y{" "}
          <strong>colmenas de agentes IA</strong> que atienden a tus clientes mientras dormís.
        </p>

        <div className="web-grid" ref={grid}>
          {CAPACIDADES.map((c) => (
            <article className="web-card" key={c.num}>
              <span className="web-card-num">{c.num}</span>
              <h3 className="web-card-title">{c.titulo}</h3>
              <p className="web-card-desc">{c.desc}</p>
              <div className="web-card-tags">
                {c.tags.map((t) => (
                  <span className="web-tag" key={t}>{t}</span>
                ))}
              </div>
              <a
                className="web-card-link"
                href={wa(c.titulo.toLowerCase())}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pedir presupuesto <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </div>

        <div className="web-guarantee">
          {GARANTIAS.map(([clave, valor]) => (
            <div className="web-guarantee-item" key={clave}>
              <span className="web-guarantee-key">{clave}</span>
              <span className="web-guarantee-value">{valor}</span>
            </div>
          ))}
        </div>

        <div className="web-cta">
          <h3 className="web-cta-title">Contanos qué necesitás</h3>
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
              style={{ background: `linear-gradient(135deg, ${VIOLET}, ${FUCHSIA})` }}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
    </section>
  );
}
