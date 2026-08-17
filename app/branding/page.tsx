import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WebDesign, { type LandingContent } from "../components/sections/WebDesign";

/**
 * Página de destino para branding e identidad de marca.
 *
 * Monta el mismo recorrido que /diseno-web y /colmena-agentes pasándole otro
 * contenido. La única diferencia estructural: acá el bloque de la colmena de
 * agentes queda afuera (`hive: false`), porque en una consulta de identidad de
 * marca no aporta nada y solo aleja el contacto.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero un presupuesto de branding para mi marca.");

export const metadata: Metadata = {
  title: "Branding e Identidad de Marca | Manual de Marca | Hivrido",
  description:
    "Branding profesional: identidad de marca, diseño de logo, manual de marca, naming y sistema visual completo. Renders de arquitectura, interiores y exteriores a escala con SketchUp, Rhino y Revit. Propuesta concreta en 24 horas.",
  keywords: [
    "branding",
    "identidad de marca",
    "manual de marca",
    "diseño de logo",
    "naming",
    "identidad visual",
    "renders 3d",
    "renders de arquitectura",
    "renders de interiores",
  ],
  alternates: { canonical: "/branding" },
  openGraph: {
    title: "Branding e Identidad de Marca | Hivrido",
    description:
      "Identidad de marca, logo, manual y sistema visual completo. Una marca que se recuerda y que tu equipo sabe aplicar.",
    url: "https://hivrido.com/branding",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

const CONTENT: LandingContent = {
  id: "sec-branding",
  hive: false,
  ticker: [
    "Branding",
    "Identidad de marca",
    "Manual de marca",
    "Diseño de logo",
    "Naming",
    "Renders 3D",
    "Arquitectura e interiores",
    "Rebranding",
  ],
  title: { eyebrow: "Qué hacemos", lines: ["Marcas que", "se recuerdan"] },
  lead: (
    <>
      Construimos <strong>identidades de marca</strong> que generan reconocimiento y
      conexión emocional. <strong>Diseño de logo</strong>, paleta, tipografía, voz y
      todo el sistema visual, documentado en un <strong>manual de marca</strong> que tu
      equipo puede aplicar sin depender de nosotros. Y cuando la marca necesita
      mostrarse construida, <strong>renders de arquitectura, interiores y exteriores</strong>{" "}
      con medidas exactas a escala.
    </>
  ),
  servicios: [
    {
      num: "01",
      title: "Identidad de marca",
      tags: ["Estrategia", "Logo", "Paleta", "Tipografía"],
      desc: "Toda la arquitectura visual de tu empresa desde cero: qué dice, cómo se ve y por qué se elige antes que a otra. No un logo suelto.",
      headline: "Una marca que se recuerda.",
      body: "Construimos identidades visuales que generan reconocimiento y conexión emocional. Logo, paleta, tipografía, voz y toda la arquitectura visual de tu empresa desde cero, partiendo de qué te diferencia y no de una tendencia.",
      stat: ["360°", "Identidad visual completa y coherente"],
    },
    {
      num: "02",
      title: "Manual de marca",
      tags: ["Normas", "Usos", "Grilla", "Entregables"],
      desc: "El documento que hace que la marca sobreviva a quien la diseñó: qué se puede y qué no, con medidas, colores exactos y ejemplos.",
      headline: "Para que nadie la use mal.",
      body: "Entregamos el manual completo: construcción y área de resguardo del logo, versiones permitidas, códigos de color en cada sistema, jerarquías tipográficas, usos incorrectos y aplicaciones reales. Tu equipo y cualquier proveedor trabajan sin preguntar.",
      stat: ["PDF + fuentes", "Todo lo que hace falta para aplicarla"],
    },
    {
      num: "03",
      title: "Diseño de logo",
      tags: ["Isotipo", "Versiones", "Vectorial", "Favicon"],
      desc: "Una marca gráfica que funciona en un cartel y en un ícono de 16 píxeles, en positivo y en negativo, impresa y en pantalla.",
      headline: "Que funcione en todos los tamaños.",
      body: "Diseñamos el logotipo y sus versiones —horizontal, vertical, isotipo solo, monocromo— probadas en los tamaños y soportes reales donde va a vivir. Entrega en vectorial editable, más los cortes listos para web y redes.",
      stat: ["16 px", "Legible desde el favicon hasta la fachada"],
    },
    {
      num: "04",
      title: "Naming y voz",
      tags: ["Nombre", "Claim", "Tono", "Mensajes"],
      desc: "Cómo se llama y cómo habla. Nombre, bajada y el tono con el que la marca se dirige a su público en cada canal.",
      headline: "Que suene a vos antes de ver el logo.",
      body: "Trabajamos el nombre, el claim y la voz de la marca: qué palabras usa, cuáles evita y cómo cambia el registro entre una campaña, una respuesta de soporte y un contrato. Con ejemplos escritos, no con adjetivos.",
      stat: ["Voz", "Definida con ejemplos, no con adjetivos"],
    },
    {
      num: "05",
      title: "Aplicaciones",
      tags: ["Papelería", "Packaging", "Redes", "Señalética"],
      desc: "La marca puesta a trabajar: piezas para redes, papelería, packaging, indumentaria, vehículos y local.",
      headline: "La identidad, aplicada.",
      body: "Bajamos el sistema a las piezas que de verdad usás: plantillas para redes, tarjetas y firmas, packaging, uniformes, señalética y gráfica vehicular. Editables, para que puedas producir sin volver a diseñar.",
      stat: ["Plantillas", "Editables por tu equipo"],
    },
    {
      num: "06",
      title: "Rebranding",
      tags: ["Diagnóstico", "Migración", "Convivencia"],
      desc: "Cuando la marca ya no representa lo que sos. Renovamos sin perder lo que la gente ya reconoce de vos.",
      headline: "Cambiar sin empezar de cero.",
      body: "Diagnosticamos qué activos de tu marca actual conviene conservar y cuáles pesan en contra, y planificamos la transición: qué sale primero, cómo convive lo viejo con lo nuevo y cómo se comunica el cambio.",
      stat: ["Plan", "Transición ordenada, no un apagón"],
    },
    {
      num: "07",
      title: "Renders y visualización 3D",
      tags: ["SketchUp", "Rhino", "Revit", "IA"],
      desc: "Arquitectura, interiores y exteriores modelados con medidas exactas y todo a escala. Lo que se ve en el render es lo que se construye.",
      headline: "Verlo antes de construirlo.",
      body: "Modelamos arquitectura, interiores y exteriores con precisión de obra: medidas exactas, todo a escala, nada de dibujos aproximados. Manejamos profesionalmente SketchUp, Rhino y Revit, y sumamos inteligencia artificial donde acelera sin resignar control: variantes de materiales, ambientación y postproducción de la imagen final.",
      stat: ["A escala", "Medidas exactas, listas para obra"],
    },
  ],
  trabajos: [
    { num: ".01", titulo: "Marca inmobiliaria", tags: ["Manual", "Logo"], desc: "Identidad completa, manual de marca y aplicaciones para toda la red comercial.", img: "/images/folio/2.webp" },
    { num: ".02", titulo: "Identidad audiovisual", tags: ["Motion", "Placas"], desc: "Sistema gráfico para contenido: placas, cortinas y subtítulos con una sola voz.", img: "/images/folio/1.webp" },
    { num: ".03", titulo: "Packaging", tags: ["Etiquetas", "Línea"], desc: "Familia de envases con jerarquía clara entre variedades de una misma línea.", img: "/images/folio/3.webp" },
    { num: ".04", titulo: "Marca de servicios", tags: ["Naming", "Voz"], desc: "Nombre, claim y tono de comunicación para un servicio profesional nuevo.", img: "/images/folio/27.webp" },
    { num: ".05", titulo: "Rebranding automotor", tags: ["Migración", "Flota"], desc: "Renovación de identidad conservando el color que el mercado ya reconocía.", img: "/images/folio/8.webp" },
    { num: ".06", titulo: "Renders de arquitectura", tags: ["Interiores", "Exteriores"], desc: "Modelado a escala con medidas de obra: lo que se ve es lo que se construye.", img: "/images/folio/5.webp" },
  ],
  trabajosTitle: { eyebrow: "Trabajos", lines: ["Marcas que", "hicimos"] },
  testimonios: [
    { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
    { nombre: "C. Maggione", empresa: "telotomo.com", texto: "Un lujo de punta a punta. Un equipo que entiende de tecnología y de negocios, que se mete de lleno en el proyecto y lo lleva al máximo nivel. Nos ayudaron a revolucionar el mercado de la compra de autos, y el resultado habla por sí solo." },
    { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
    { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
  ],
  garantias: [
    ["Respuesta", "El mismo día, con alcance y precio"],
    ["Entrega", "De 15 a 30 días según el alcance"],
    ["Incluido", "Manual de marca y archivos editables"],
    ["Después", "Tres meses de ajustes sin costo"],
  ],
  cta: {
    title: "Contanos qué marca querés construir",
    text: "Te respondemos con una propuesta concreta: alcance, entregables, plazo y precio. Sin reuniones eternas ni presentaciones de cuarenta páginas.",
    asunto: "branding e identidad de marca",
    mail: "Consulta por branding",
  },
};

export default function BrandingPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que el preloader de la
          home se retire, y a quien ya lo vio hace poco se le saltea — el
          logo quedaría invisible dos segundos con el header a la vista. */}
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Branding · Identidad de marca · Buenos Aires</p>

            <h1 className="dw-hero-title">
              Una marca que se
              <br />
              recuerda y se aplica
            </h1>

            <p className="dw-hero-text">
              Identidad de marca, diseño de logo y manual completo. No entregamos un
              archivo suelto: entregamos un sistema que tu equipo sabe usar y que se ve
              igual en una tarjeta, en una fachada y en un reel.
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
              <li>Entrega de 15 a 30 días</li>
              <li>Manual y editables incluidos</li>
            </ul>
          </div>
        </section>

        <WebDesign content={CONTENT} />
        <Footer />
      </main>
    </ClientShell>
  );
}
