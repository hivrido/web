import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
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
 * Usa el mismo ClientShell que la home —preloader, cursor propio, scroll
 * suave y botón de WhatsApp— porque la identidad tiene que ser la misma en
 * las dos rutas. Cuesta algo de tiempo hasta el primer render; se compensa
 * con el preloader, que ya salta a los visitantes que lo vieron hace menos
 * de media hora.
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
    <ClientShell>

      {/* 300 y no el valor por defecto: ese espera a que el preloader de la
          home se retire, y a quien ya lo vio hace poco se le saltea — el
          logo quedaría invisible dos segundos con el header a la vista. */}
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Diseño y desarrollo web · Buenos Aires</p>

            <h1 className="dw-hero-title">
              Diseño web que convierte
              <br />
              visitas en clientes
            </h1>

            <p className="dw-hero-text">
              Transformamos tu presencia digital en una máquina de generar clientes.
              Diseño de página web, desarrollo web y programación a medida: desde una
              landing hasta sistemas de gestión y colmenas de agentes IA.
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
    </ClientShell>
  );
}
