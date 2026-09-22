import type { Metadata } from "next";
import Link from "next/link";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ARTISTAS } from "../lib/artistas";
import "./artistas.css";

/**
 * Índice del roster.
 *
 * Hoy hay un solo artista, y eso plantea la pregunta de si la página se
 * justifica. Se justifica: una ficha suelta colgando de un menú es un favor
 * personal, una sección con criterio declarado es una unidad de negocio. El
 * índice existe para decir qué hace Hivrido con una carrera, y el artista es
 * la prueba de que lo hace.
 *
 * Por eso el bloque final no disimula el hueco —no repite tarjetas fantasma
 * para llenar la grilla— sino que lo usa de convocatoria.
 */

const WA =
  "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Soy artista y quiero que representen mi carrera.");

export const metadata: Metadata = {
  title: "Artistas | Representación y desarrollo de carrera | Hivrido",
  description:
    "El roster de Hivrido: artistas a los que les construimos identidad, catálogo y presencia digital. Dirección creativa, producción audiovisual y crecimiento medible para una carrera.",
  keywords: [
    "representacion de artistas",
    "management artistico argentina",
    "desarrollo de carrera musical",
    "productora de artistas",
    "Hivrido artistas",
  ],
  alternates: { canonical: "/artistas" },
  openGraph: {
    title: "Artistas | Hivrido",
    description:
      "Artistas a los que les construimos identidad, catálogo y presencia digital. Una carrera es un proyecto, no un feed.",
    url: "https://hivrido.com/artistas",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

export default function ArtistasPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que se retire el
          preloader de la home, que en esta ruta no existe. */}
      <Header base="/" logoDelay={300} />

      <main className="art-page">
        <section className="art-index-hero">
          <div className="art-wrap">
            <p className="art-eyebrow">Roster · Hivrido</p>

            <h1 className="art-index-titulo">Una carrera no es un feed</h1>

            <p className="art-index-lead">
              Hay artistas con audiencia real y ninguna casa: miles de personas que
              los siguen y nada que encontrar cuando alguien los busca. Acá les
              construimos lo que falta —identidad, catálogo, dirección y una URL
              propia— para que lo que ya funciona se pueda mostrar, contratar y
              medir.
            </p>
          </div>
        </section>

        <section className="art-wrap" aria-label="Artistas representados">
          <div className="art-roster">
            {ARTISTAS.map((a) => (
              <Link
                key={a.slug}
                href={`/artistas/${a.slug}`}
                className="art-ficha"
                /* El acento propio del artista tiñe su fila del índice: dos
                   fichas seguidas no se leen como la misma plantilla. */
                style={
                  {
                    "--art-acento": a.acento.hex,
                    "--art-acento-suave": a.acento.suave,
                  } as React.CSSProperties
                }
              >
                <span className="art-ficha-alias">{a.alias}</span>
                <h2 className="art-ficha-nombre">{a.nombre}</h2>
                <p className="art-ficha-tagline">{a.tagline}</p>

                <div className="art-ficha-pie">
                  {/* Las disciplinas van en su propio contenedor: el separador
                      se dibuja entre ellas y no después de la última, que es
                      donde quedaba colgado cuando el botón era un hermano más. */}
                  <span className="art-ficha-tags">
                    {a.disciplinas.slice(0, 3).map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </span>
                  <span className="art-ficha-ver" aria-hidden>
                    Ver ficha
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}

            <div className="art-sumate">
              <h2>El roster está abierto</h2>
              <p>
                Trabajamos con pocos artistas a la vez porque cada uno lleva
                dirección, producción y pauta propias. Si tenés una audiencia que
                ya responde y nada armado alrededor, es exactamente el caso que
                nos interesa.
              </p>
              <a
                className="art-link"
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
              >
                Proponer tu proyecto
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <div style={{ height: "clamp(62px, 11vw, 120px)" }} />

        <Footer />
      </main>
    </ClientShell>
  );
}
