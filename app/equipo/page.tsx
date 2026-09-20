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
 * la persona, porque una página de equipo sin cara no es una página de
 * equipo; y la lista con modal queda para las disciplinas que cubre. Sin
 * bloque de colmena.
 *
 * El argumento dejó de ser "dos perfiles complementarios" y pasó a ser uno
 * solo que cubre las dos mitades del oficio. No es un recorte: para quien
 * contrata, una sola cabeza a cargo de la dirección y del sistema es menos
 * teléfono descompuesto, y esa es la promesa que la página sostiene.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero hablar con el equipo.");

export const metadata: Metadata = {
  title: "Equipo | Lucas Ariel Manzano, Ingeniero en Prompt | Hivrido",
  description:
    "Hivrido lo dirige Lucas Ariel Manzano, CEO e ingeniero en prompt. Dirección creativa e ingeniería de inteligencia artificial en la misma cabeza, detrás de cada proyecto.",
  keywords: [
    "equipo hivrido",
    "Lucas Ariel Manzano",
    "Lucas Manzano",
    "ingeniero en prompt",
    "prompt engineer argentina",
    "dirección creativa",
  ],
  alternates: { canonical: "/equipo" },
  openGraph: {
    title: "Equipo | Hivrido",
    description:
      "Lucas Ariel Manzano, CEO e ingeniero en prompt de Hivrido. Dirección creativa e ingeniería de IA en la misma cabeza.",
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
  title: { eyebrow: "Cómo trabajamos", lines: ["Las dos mitades", "del oficio"] },
  lead: (
    <>
      Hivrido lo dirige <strong>Lucas Ariel Manzano</strong>, su CEO e{" "}
      <strong>ingeniero en prompt</strong>. Un solo perfil que cubre las dos mitades
      del oficio: la <strong>dirección creativa</strong> que pone lo emocional en cada
      pieza, y la <strong>ingeniería de inteligencia artificial</strong> que la
      convierte en un sistema que escala. No trabajamos con equipos tercerizados: el
      que te atiende es el que hace.
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
      body: "Dirección de actores y construcción de personajes naturalistas, buscando que lo emocional esté siempre presente en cada pieza. Es lo que separa un video correcto de uno que se recuerda.",
      stat: ["10+ años", "Dirigiendo en Argentina y Latinoamérica"],
    },
    {
      num: "03",
      title: "Ingeniería en prompt",
      tags: ["Prompt", "Agentes", "Automatización"],
      desc: "Plataformas de IA que amplifican la creatividad y la convierten en sistemas de crecimiento, sin resignar autoría.",
      headline: "La IA hace el volumen, la dirección elige.",
      body: "La capa estratégica y tecnológica de Hivrido son plataformas de inteligencia artificial y colmenas de agentes que amplifican la creatividad y la convierten en sistemas de crecimiento. Es lo que transforma el contenido en una estructura viva, automatizada y diseñada para escalar.",
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
  /* La grilla con imágenes es la única del recorrido: acá va la persona. */
  trabajos: [
    {
      num: ".01",
      titulo: "Lucas Ariel Manzano",
      tags: ["CEO", "Ingeniero en Prompt", "Dirección"],
      desc: "Ingeniero en prompt, creative developer y estratega. Dirige la parte creativa y construye la capa tecnológica: plataformas de inteligencia artificial y colmenas de agentes que amplifican la creatividad y la convierten en sistemas que escalan.",
      img: "/images/team/2.jpg",
    },
  ],
  trabajosTitle: { eyebrow: "Equipo", lines: ["Quién", "está detrás"] },
  trabajosRetrato: true,
  testimonios: [
    { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
    { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
    { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
  ],
  garantias: [
    ["Respuesta", "El mismo día, del que hace el trabajo"],
    ["A cargo", "Una sola persona para todo el proyecto"],
    ["Equipo", "Propio, sin cadena de proveedores"],
    ["Después", "Seguimiento y ajustes sin costo"],
  ],
  cta: {
    title: "Hablemos directo",
    text: "Nos escribís y te contesta el que hace el trabajo, no un formulario. Contanos qué tenés en mente y te respondemos con una propuesta concreta.",
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
            <p className="dw-hero-eyebrow">Equipo · Lucas Ariel Manzano</p>

            <h1 className="dw-hero-title">
              No seguimos tendencias,
              <br />
              las creamos
            </h1>

            <p className="dw-hero-text">
              Hivrido lo dirige <strong>Lucas Ariel Manzano</strong>, su CEO e{" "}
              <strong>ingeniero en prompt</strong>: dirección creativa e inteligencia
              artificial trabajando sobre la misma pieza. El que te atiende es el que
              hace.
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
