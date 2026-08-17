import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WebDesign, { type LandingContent } from "../components/sections/WebDesign";
import Portfolio from "../components/sections/Portfolio";
import SectionTitle from "../components/ui/SectionTitle";

/**
 * Página de destino para cine y producción audiovisual.
 *
 * Monta el mismo recorrido que /diseno-web, /colmena-agentes y /branding con
 * contenido propio. Sin el bloque de la colmena de agentes: quien busca una
 * productora no busca automatización, y meterlo en el medio corta el hilo.
 *
 * El contenido sale de los servicios 01 a 04 de la home —producción
 * cinematográfica, videoclips, contenido para marcas y campañas—, que es
 * donde ya vive este discurso.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero producir un proyecto audiovisual.");

export const metadata: Metadata = {
  title: "Productora de Cine y Video | Producción Audiovisual | Hivrido",
  description:
    "Productora audiovisual: cine, videoclips, contenido para marcas y campañas. Desarrollo, guion, rodaje y postproducción con entrega en 4K. Propuesta concreta en 24 horas.",
  keywords: [
    "productora audiovisual",
    "producción de video",
    "productora de cine",
    "videoclips",
    "contenido para marcas",
    "postproducción",
  ],
  alternates: { canonical: "/cine-video" },
  openGraph: {
    title: "Productora de Cine y Video | Hivrido",
    description:
      "Cine, videoclips y contenido para marcas. De la idea a la pantalla, con narrativa propia y terminación de nivel broadcast.",
    url: "https://hivrido.com/cine-video",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

const CONTENT: LandingContent = {
  id: "sec-cine",
  hive: false,
  ticker: [
    "Cine & Video",
    "Producción audiovisual",
    "Videoclips",
    "Contenido para marcas",
    "Dirección",
    "Postproducción",
    "Color y VFX",
    "Restauración 4K",
  ],
  title: { eyebrow: "Qué hacemos", lines: ["Historias que", "trascienden"] },
  /* Los trailers van antes que la lista de servicios: en una productora, lo
     que convence es ver una pieza, no leer qué se ofrece. Es el mismo bloque
     de la home —con su reproductor— montado con otro título. */
  extra: (
    <Portfolio
      id="sec-filmamos"
      num={null}
      heading={<SectionTitle eyebrow="Trabajos" lines={["Ya lo", "filmamos"]} />}
    />
  ),
  lead: (
    <>
      Hacemos <strong>producción cinematográfica</strong>, <strong>videoclips</strong> y{" "}
      <strong>contenido para marcas</strong>: de la idea a la pantalla, cuidando cada
      etapa —desarrollo, guion, rodaje y <strong>postproducción</strong>—. Apostamos a
      narrativas que trascienden y construyen universos propios.
    </>
  ),
  servicios: [
    {
      num: "01",
      title: "Producción cinematográfica",
      tags: ["Concepto", "Guión", "Rodaje", "Montaje"],
      desc: "Desde producciones simples hasta desarrollos a gran escala, optimizando procesos con tecnología avanzada para reducir la inversión sin resignar terminación.",
      headline: "De la idea a la pantalla.",
      body: "Desarrollamos proyectos de cine desde la idea hasta la pantalla. Creamos historias con identidad, cuidando cada etapa: desarrollo, guion, rodaje y postproducción. Apostamos a narrativas que trascienden y construyen universos propios.",
      stat: ["4K / RAW", "Producción de nivel broadcast"],
    },
    {
      num: "02",
      title: "Videoclips",
      tags: ["Concepto", "Dirección", "Estética", "Artista"],
      desc: "Piezas visuales que elevan la identidad de cada artista. Conceptualizamos, dirigimos y producimos para que la música tenga imagen propia.",
      headline: "Concepto, mensaje y narrativa.",
      body: "Creamos videoclips que elevan la identidad de cada artista. Conceptualizamos, dirigimos y producimos piezas visuales que potencian la música y construyen una estética única.",
      stat: ["3x", "Más engagement y conexión con tu audiencia"],
    },
    {
      num: "03",
      title: "Contenido para marcas",
      tags: ["Estrategia", "Impacto", "Narrativa", "Redes"],
      desc: "Contenido estratégico y visualmente potente para marcas que buscan destacarse. Desde campañas hasta piezas para redes.",
      headline: "No es contenido. Es posicionamiento en estado puro.",
      body: "Creamos contenido estratégico y visualmente potente para marcas que buscan destacarse. Desde campañas hasta piezas para redes, generamos impacto real y conexión con la audiencia.",
      stat: ["80+", "Artistas impulsados estratégicamente"],
    },
    {
      num: "04",
      title: "Campañas y colaboraciones",
      tags: ["Visión", "Estética", "Alcance", "Comunidad"],
      desc: "Conectamos marcas con nuestra comunidad y desarrollamos campañas que combinan creatividad, estrategia y alcance real.",
      headline: "Lo que no se ve, no existe.",
      body: "Conectamos marcas con nuestra comunidad y desarrollamos campañas que combinan creatividad, estrategia y alcance. Generamos colaboraciones auténticas que potencian visibilidad y posicionamiento.",
      stat: ["Comunidad", "Colaboraciones con alcance real"],
    },
    {
      num: "05",
      title: "Postproducción y color",
      tags: ["Montaje", "Color", "VFX", "Sonido"],
      desc: "Montaje, corrección de color, efectos y sonido. La etapa donde el material filmado se convierte en la pieza que se ve.",
      headline: "Donde el material se vuelve película.",
      body: "Montaje, corrección de color plano a plano, efectos visuales y postproducción de sonido. Trabajamos con flujo RAW y entregamos en los formatos que pide cada plataforma, sin recomprimir de más.",
      stat: ["Plano a plano", "Color trabajado, no un filtro"],
    },
    {
      num: "06",
      title: "Restauración y remasterización",
      tags: ["4K", "Limpieza", "Archivo", "Plataformas"],
      desc: "Material de archivo devuelto a la vida: reconstrucción de color, limpieza de grano y entrega en 4K lista para plataforma.",
      headline: "El archivo, como se vio la primera vez.",
      body: "Restauración y remasterización completa de material de archivo. Reconstrucción de color plano a plano, limpieza de grano y ruido, y entrega en 4K con los entregables que exige cada plataforma de streaming.",
      stat: ["4K", "Entrega lista para plataforma"],
    },
  ],
  testimonios: [
    { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
    { nombre: "C. Maggione", empresa: "telotomo.com", texto: "Un lujo de punta a punta. Un equipo que entiende de tecnología y de negocios, que se mete de lleno en el proyecto y lo lleva al máximo nivel. Nos ayudaron a revolucionar el mercado de la compra de autos, y el resultado habla por sí solo." },
    { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
    { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
  ],
  garantias: [
    ["Respuesta", "El mismo día, con alcance y precio"],
    ["Preproducción", "Guion, plan de rodaje y presupuesto cerrado"],
    ["Entrega", "Masters en los formatos de cada plataforma"],
    ["Después", "Cortes y adaptaciones para redes incluidos"],
  ],
  cta: {
    title: "Contanos qué querés filmar",
    text: "Te respondemos con una propuesta concreta: tratamiento, plan de rodaje, plazo y precio. Sin reuniones eternas ni presupuestos de cuarenta páginas.",
    asunto: "una producción audiovisual",
    mail: "Consulta por producción audiovisual",
  },
};

export default function CineVideoPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que el preloader de la
          home se retire, y a quien ya lo vio hace poco se le saltea — el
          logo quedaría invisible dos segundos con el header a la vista. */}
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Cine · Video · Producción audiovisual</p>

            <h1 className="dw-hero-title">
              Historias que
              <br />
              trascienden
            </h1>

            <p className="dw-hero-text">
              Producción cinematográfica, videoclips y contenido para marcas. De la idea
              a la pantalla: desarrollo, guion, rodaje y postproducción, con narrativa
              propia y terminación de nivel broadcast.
            </p>

            <div className="dw-hero-actions">
              <a className="dw-hero-btn" href={WA} target="_blank" rel="noopener noreferrer">
                Pedir presupuesto
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="dw-hero-link" href={`#${CONTENT.id}`}>
                Ver qué hacemos
              </a>
            </div>

            <ul className="dw-hero-proof">
              <li>Respuesta el mismo día</li>
              <li>Presupuesto cerrado antes de rodar</li>
              <li>Cortes para redes incluidos</li>
            </ul>
          </div>
        </section>

        <WebDesign content={CONTENT} />
        <Footer />
      </main>
    </ClientShell>
  );
}
