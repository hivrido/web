import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WebDesign, { type LandingContent } from "../components/sections/WebDesign";

/**
 * Página del equipo.
 *
 * Monta el mismo recorrido que las otras landings, con dos vueltas de tuerca
 * que impone el tema: la grilla de "trabajos" —la única con imágenes— aloja a
 * las dos personas, porque una página de equipo sin caras no es una página de
 * equipo; y la lista con modal queda para las disciplinas que cubren entre los
 * dos. Sin bloque de colmena.
 *
 * El contenido sale de la home: las fichas de la sección Equipo y los párrafos
 * de About sobre los dos perfiles complementarios.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero hablar con el equipo.");

export const metadata: Metadata = {
  title: "Equipo | Lucas Manzano y Sergio Podeley | Hivrido",
  description:
    "El equipo de Hivrido: Lucas Manzano y Sergio Podeley, CEOs. Dos perfiles opuestos y complementarios —dirección artística e inteligencia artificial— detrás de cada proyecto.",
  keywords: [
    "equipo hivrido",
    "Lucas Manzano",
    "Sergio Podeley",
    "productora audiovisual equipo",
    "dirección creativa",
  ],
  alternates: { canonical: "/equipo" },
  openGraph: {
    title: "Equipo | Hivrido",
    description:
      "Lucas Manzano y Sergio Podeley, CEOs de Hivrido. Dos perfiles opuestos complementarios: dirección artística y tecnología.",
    url: "https://hivrido.com/equipo",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

const CONTENT: LandingContent = {
  id: "sec-equipo",
  hive: false,
  ticker: [
    "Dirección creativa",
    "Dirección de actores",
    "Inteligencia artificial",
    "Estrategia",
    "Producción audiovisual",
    "Desarrollo",
    "Identidad de marca",
    "Growth",
  ],
  title: { eyebrow: "Cómo trabajamos", lines: ["Dos perfiles", "complementarios"] },
  lead: (
    <>
      El proyecto está impulsado por <strong>dos perfiles opuestos complementarios</strong>{" "}
      que le dan forma a nuestra manera de crear: la <strong>dirección artística</strong>{" "}
      que pone lo emocional en cada pieza, y la <strong>capa tecnológica</strong> que la
      convierte en un sistema que escala. No trabajamos con equipos tercerizados: los
      que te atienden son los que hacen.
    </>
  ),
  servicios: [
    {
      num: "01",
      title: "Dirección creativa",
      tags: ["Concepto", "Guión", "Puesta"],
      desc: "La idea antes que la herramienta. Definimos qué se cuenta y por qué, y recién después con qué se filma o se construye.",
      headline: "No seguimos tendencias, las creamos.",
      body: "Cada proyecto arranca por el concepto: qué tiene esta marca o esta historia que ninguna otra, y cómo se traduce en imagen. La dirección atraviesa todo —cine, marca, producto— y es lo que hace que las piezas se reconozcan entre sí.",
      stat: ["Autoría", "Concepto propio, no una plantilla"],
    },
    {
      num: "02",
      title: "Dirección de actores",
      tags: ["Casting", "Naturalismo", "Personaje"],
      desc: "Construcción de personajes naturalistas, buscando que lo emocional esté siempre presente en cada pieza.",
      headline: "Que se crea, no que se actúe.",
      body: "Sergio aporta una mirada enfocada en la dirección de actores y en la construcción de personajes naturalistas, buscando que lo emocional esté siempre presente en cada pieza. Es lo que separa un video correcto de uno que se recuerda.",
      stat: ["10+ años", "Dirigiendo en Argentina y Latinoamérica"],
    },
    {
      num: "03",
      title: "Inteligencia artificial",
      tags: ["Prompt", "Agentes", "Automatización"],
      desc: "Plataformas de IA que amplifican la creatividad y la convierten en sistemas de crecimiento, sin resignar autoría.",
      headline: "La IA hace el volumen, la dirección elige.",
      body: "Lucas impulsa la capa estratégica y tecnológica de Hivrido, creando plataformas de inteligencia artificial que amplifican la creatividad y la convierten en sistemas de crecimiento. Su trabajo transforma el contenido en una estructura viva, automatizada y diseñada para escalar.",
      stat: ["PUNY", "El motor que corre dentro de Hivrido"],
    },
    {
      num: "04",
      title: "Estrategia y growth",
      tags: ["Posicionamiento", "Campañas", "Datos"],
      desc: "Que lo que se produce llegue a quien tiene que llegar, y que se pueda medir contra un número real.",
      headline: "Lo que no se ve, no existe.",
      body: "Definimos dónde tiene que aparecer la marca, con qué mensaje y contra qué resultado se mide. Producción y pauta trabajan juntas: la pieza se piensa sabiendo dónde va a competir por atención.",
      stat: ["Medible", "Cada campaña contra su costo real"],
    },
    {
      num: "05",
      title: "Producción integral",
      tags: ["Rodaje", "Post", "Entrega"],
      desc: "Equipo propio para llevar un proyecto de la idea a la entrega, sin cadena de proveedores en el medio.",
      headline: "De punta a punta, sin intermediarios.",
      body: "Cubrimos desarrollo, rodaje, postproducción y entrega con equipo propio. Menos actores en la cadena significa menos teléfono descompuesto entre lo que se acordó y lo que se entrega, y plazos que se sostienen.",
      stat: ["4K / RAW", "Terminación de nivel broadcast"],
    },
    {
      num: "06",
      title: "Cómo trabajamos",
      tags: ["Directo", "Rápido", "Sin vueltas"],
      desc: "Respuesta el mismo día, alcance y precio por escrito antes de empezar, y una sola persona a cargo de tu proyecto.",
      headline: "Sin reuniones eternas.",
      body: "Contás qué necesitás y te respondemos con una propuesta concreta: alcance, plazo y precio. Nada de presentaciones de cuarenta páginas ni de cadenas de mails para una definición simple.",
      stat: ["24 h", "Propuesta concreta el mismo día"],
    },
  ],
  /* La grilla con imágenes es la única del recorrido: acá van las personas. */
  trabajos: [
    {
      num: ".01",
      titulo: "Sergio Podeley",
      tags: ["CEO", "Dirección artística", "Performance"],
      desc: "Más de 10 años creando experiencias culturales de impacto en Argentina y Latinoamérica. Dirige actores y construye personajes naturalistas, buscando que lo emocional esté presente en cada pieza.",
      img: "/images/team/1.jpg",
    },
    {
      num: ".02",
      titulo: "Lucas Manzano",
      tags: ["CEO", "Estrategia", "IA"],
      desc: "Prompt engineer, creative developer y estratega. Impulsa la capa tecnológica de Hivrido: plataformas de inteligencia artificial que amplifican la creatividad y la convierten en sistemas que escalan.",
      img: "/images/team/2.jpg",
    },
  ],
  trabajosTitle: { eyebrow: "Equipo", lines: ["Quiénes", "somos"] },
  testimonios: [
    { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
    { nombre: "C. Maggione", empresa: "telotomo.com", texto: "Un lujo de punta a punta. Un equipo que entiende de tecnología y de negocios, que se mete de lleno en el proyecto y lo lleva al máximo nivel. Nos ayudaron a revolucionar el mercado de la compra de autos, y el resultado habla por sí solo." },
    { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
    { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
  ],
  garantias: [
    ["Respuesta", "El mismo día, de uno de los dos"],
    ["A cargo", "Una sola persona para todo el proyecto"],
    ["Equipo", "Propio, sin cadena de proveedores"],
    ["Después", "Seguimiento y ajustes sin costo"],
  ],
  cta: {
    title: "Hablemos directo",
    text: "Nos escribís y te contesta uno de los dos, no un formulario. Contanos qué tenés en mente y te respondemos con una propuesta concreta.",
    asunto: "un proyecto con el equipo",
    mail: "Consulta para el equipo",
  },
};

export default function EquipoPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que el preloader de la
          home se retire, y a quien ya lo vio hace poco se le saltea — el
          logo quedaría invisible dos segundos con el header a la vista. */}
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Equipo · Lucas Manzano & Sergio Podeley</p>

            <h1 className="dw-hero-title">
              No seguimos tendencias,
              <br />
              las creamos
            </h1>

            <p className="dw-hero-text">
              Hivrido lo dirigen <strong>Lucas Manzano</strong> y{" "}
              <strong>Sergio Podeley</strong>, sus dos CEOs: dirección artística e
              inteligencia artificial trabajando sobre la misma pieza. Los que te
              atienden son los que hacen.
            </p>

            <div className="dw-hero-actions">
              <a className="dw-hero-btn" href={WA} target="_blank" rel="noopener noreferrer">
                Hablar con nosotros
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="dw-hero-link" href="#sec-trabajos">
                Conocernos
              </a>
            </div>

            <ul className="dw-hero-proof">
              <li>Respuesta el mismo día</li>
              <li>Equipo propio, sin tercerizar</li>
              <li>Una sola persona a cargo</li>
            </ul>
          </div>
        </section>

        <WebDesign content={CONTENT} />
        <Footer />
      </main>
    </ClientShell>
  );
}
