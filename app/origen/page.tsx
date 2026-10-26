import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SeccionesOrigen from "./SeccionesOrigen";
import { SEO, WA_ARTISTA } from "./contenido";
import "./origen.css";

/**
 * ORIGEN: el campamento para artistas de Hivrido.
 *
 * Va con la identidad de la casa —Orbitron, violeta y magenta, títulos con
 * barrido— y no con la de la landing suelta que se diseñó primero en
 * naranja: es un proyecto de Hivrido y tiene que leerse como tal. Lo único
 * propio es el isotipo (el aro abierto con la barra), dibujado en SVG con los
 * colores del sitio.
 *
 * Las consultas van por WhatsApp con el mensaje armado según quién escribe:
 * no hay backend que reciba un formulario y un mail que se pierde es peor que
 * no pedirlo.
 */

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [
    "campamento para artistas",
    "campamento musical",
    "producción musical",
    "artistas emergentes",
    "videoclips",
    "Chapadmalal",
    "ORIGEN",
  ],
  alternates: { canonical: "/origen" },
  openGraph: {
    title: "ORIGEN · Todo artista tiene un origen | Hivrido",
    description: SEO.description,
    url: "https://hivrido.com/origen/",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

export default function OrigenPage() {
  return (
    <ClientShell>
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper og-page">
        <section className="dw-hero og-hero">
          <svg className="og-hero-mark" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <linearGradient id="og-aro" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#C4B5FD" />
                <stop offset=".55" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#FF1B8D" />
              </linearGradient>
            </defs>
            <path d="M78 176A78 78 0 1 1 122 176" fill="none" stroke="url(#og-aro)" strokeWidth="14" />
            <rect x="93" y="86" width="14" height="92" fill="#FF1B8D" />
          </svg>

          <div className="section-container">
            <p className="dw-hero-eyebrow">Un proyecto de Hivrido · Generación 001</p>

            <h1 className="dw-hero-title">
              Todo artista
              <br />
              tiene un origen
            </h1>

            <p className="dw-hero-text">
              <strong>ORIGEN</strong> es el lugar donde nacen las próximas carreras: tres
              días de convivencia en Chapadmalal donde artistas, productores y creativos
              componen, graban y filman juntos. No es un campamento. Es el comienzo de
              una generación.
            </p>

            <div className="dw-hero-actions">
              <a className="dw-hero-btn" href={WA_ARTISTA} target="_blank" rel="noopener noreferrer">
                Quiero ser parte
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="dw-hero-link" href="#og-experiencia">
                Ver la experiencia
              </a>
            </div>

            <ul className="dw-hero-proof">
              <li>Tres días frente al mar</li>
              <li>Cupo limitado</li>
              <li>Convocatoria próximamente</li>
            </ul>
          </div>
        </section>

        <SeccionesOrigen />
        <Footer />
      </main>
    </ClientShell>
  );
}
