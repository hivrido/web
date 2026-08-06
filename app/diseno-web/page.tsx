import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WebDesign from "../components/sections/WebDesign";

/**
 * Página de destino para las campañas de búsqueda.
 *
 * Existe separada de la home por una razón concreta: Google puntúa la
 * experiencia de la página de destino sobre la URL completa. Un anuncio de
 * "diseño web" apuntando a una home que habla de cine, música y artistas
 * aterriza en contenido que no coincide con la consulta, y esa distancia se
 * paga en costo por clic. Acá todo lo que hay responde a la búsqueda.
 *
 * Va sin ClientShell a propósito. El intro, el scroll suave y el cursor
 * propio suman medio segundo antes del primer render, y en tráfico pago eso
 * es porcentaje de rebote: el visitante viene de un anuncio, no de una
 * exploración de marca.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero un presupuesto para mi sitio web.");

export const metadata: Metadata = {
  title: "Diseño Web y Desarrollo a Medida | Hivrido",
  description:
    "Diseño web y diseño de página web para empresas y marcas. Desarrollo web, programación a medida, desarrollo de sistemas y colmenas de agentes IA. Presupuesto concreto en 24 horas.",
  keywords: [
    "diseño web",
    "diseño pagina web",
    "desarrollo web",
    "programación a medida",
    "desarrollo de sistemas",
    "agentes IA",
  ],
  alternates: { canonical: "/diseno-web" },
  openGraph: {
    title: "Diseño Web y Desarrollo a Medida | Hivrido",
    description:
      "Sitios que venden: diseño web, desarrollo a medida, sistemas y agentes IA. Presupuesto en 24 horas.",
    url: "https://hivrido.com/diseno-web",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

export default function DisenoWebPage() {
  return (
    <>
      <Header base="/" />

      <main className="dw-page">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Diseño y desarrollo web · Buenos Aires</p>

            <h1 className="dw-hero-title">
              Diseño web que convierte
              <br />
              visitas en clientes
            </h1>

            <p className="dw-hero-text">
              Diseñamos y programamos sitios a medida: desde el diseño de una página web
              hasta desarrollo de sistemas y colmenas de agentes IA. Código propio, carga
              rápida y una estructura pensada para vender.
            </p>

            <div className="dw-hero-actions">
              <a className="dw-hero-btn" href={WA} target="_blank" rel="noopener noreferrer">
                Pedir presupuesto
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="dw-hero-link" href="#sec-diseno-web">
                Ver qué hacemos
              </a>
            </div>

            <ul className="dw-hero-proof">
              <li>Respuesta el mismo día</li>
              <li>Entrega de 7 a 30 días</li>
              <li>Tres meses de ajustes incluidos</li>
            </ul>
          </div>
        </section>

        <WebDesign />
        <Footer />
      </main>
    </>
  );
}
