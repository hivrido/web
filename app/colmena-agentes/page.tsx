import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WebDesign, { type LandingContent } from "../components/sections/WebDesign";

/**
 * Página de destino para la colmena de agentes IA.
 *
 * Monta el mismo recorrido que /diseno-web —cinta, lista de servicios con
 * modal, bloque de la colmena, trabajos, testimonios y cierre— pasándole otro
 * contenido: el componente está parametrizado justamente para eso, así los
 * gestos y la identidad se mantienen idénticos en las dos rutas y un cambio
 * de estilo llega a ambas sin tocar dos archivos.
 *
 * Existe separada porque la consulta es distinta: quien busca "agentes IA" o
 * "automatización con IA" no busca un sitio web, y aterrizar en una página que
 * habla de landings se paga en costo por clic.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero saber más sobre la colmena de agentes IA.");

export const metadata: Metadata = {
  title: "Colmena de Agentes IA | Automatización a Medida | Hivrido",
  description:
    "Colmena de agentes IA para tu negocio: atienden consultas, califican interesados, generan contenido y ejecutan procesos 24/7. Conectados a tu CRM, tus campañas y tus canales. Propuesta concreta en 24 horas.",
  keywords: [
    "agentes IA",
    "colmena de agentes",
    "automatización con IA",
    "inteligencia artificial para empresas",
    "agentes autónomos",
    "automatización de procesos",
  ],
  alternates: { canonical: "/colmena-agentes" },
  openGraph: {
    title: "Colmena de Agentes IA | Hivrido",
    description:
      "Agentes que analizan, crean, optimizan y ejecutan a escala. Conectados a tu CRM y a tus canales, trabajando mientras dormís.",
    url: "https://hivrido.com/colmena-agentes",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

const CONTENT: LandingContent = {
  id: "sec-colmena",
  ticker: [
    "Colmena de agentes IA",
    "Agentes autónomos",
    "Automatización de procesos",
    "Integración con CRM",
    "Atención 24/7",
    "Calificación de leads",
    "Contenido a escala",
    "Reportes automáticos",
  ],
  title: { eyebrow: "Qué hacemos", lines: ["Agentes que", "trabajan"] },
  lead: (
    <>
      Desplegamos <strong>colmenas de agentes IA</strong> que operan solas: analizan,
      crean, optimizan y ejecutan a escala. Desde un <strong>agente de atención</strong>{" "}
      que responde y califica interesados hasta{" "}
      <strong>automatizaciones conectadas a tu CRM</strong>, tus campañas y tus canales,
      trabajando mientras dormís.
    </>
  ),
  servicios: [
    {
      num: "01",
      title: "Agente de atención",
      tags: ["WhatsApp", "Web", "Instagram", "24/7"],
      desc: "Responde consultas al instante, entiende qué necesita cada persona y deriva a un humano solo cuando hace falta. En todos tus canales, a toda hora.",
      headline: "Nadie más esperando una respuesta.",
      body: "Un agente entrenado con tu negocio atiende en WhatsApp, en el sitio y en redes. Responde precios, disponibilidad y dudas frecuentes con tu tono, y pasa la conversación a una persona cuando el caso lo pide.",
      stat: ["24/7", "Sin turnos, sin feriados, sin demoras"],
    },
    {
      num: "02",
      title: "Calificación de leads",
      tags: ["Scoring", "CRM", "Seguimiento", "Alertas"],
      desc: "No todos los interesados valen lo mismo. El agente pregunta, ordena y prioriza, y avisa cuando aparece uno que hay que atender ya.",
      headline: "Que tu equipo hable con quien va a comprar.",
      body: "El agente califica cada consulta según tus criterios, la carga en el CRM con el contexto completo y hace el seguimiento de los que no cerraron. Tu equipo entra cuando la oportunidad ya está madura.",
      stat: ["100%", "De las consultas registradas y clasificadas"],
    },
    {
      num: "03",
      title: "Automatización de procesos",
      tags: ["APIs", "Integraciones", "Sin código", "Python"],
      desc: "Todo lo que hoy alguien hace a mano copiando datos de un lado a otro: cargar, cruzar, avisar, actualizar. Corre solo y sin errores.",
      headline: "El trabajo que nadie quiere hacer.",
      body: "Conectamos las herramientas que ya usás —CRM, facturación, stock, planillas, plataformas de ads— y automatizamos el ida y vuelta entre ellas. Lo que llevaba horas pasa a correr en segundo plano.",
      stat: ["Auto", "Ejecución sin intervención manual"],
    },
    {
      num: "04",
      title: "Contenido a escala",
      tags: ["Copies", "Reels", "Posts", "Tono de marca"],
      desc: "Agentes que generan piezas con tu voz y tu estética, en volumen, y las adaptan a cada canal sin perder identidad.",
      headline: "Volumen sin perder autoría.",
      body: "El agente produce copies, guiones y variantes para cada plataforma respetando tu manual de marca. La dirección de arte sigue siendo humana: la IA hace el volumen, nosotros elegimos qué sale.",
      stat: ["x10", "Piezas por semana con el mismo equipo"],
    },
    {
      num: "05",
      title: "Análisis y reportes",
      tags: ["Métricas", "Competencia", "Alertas", "Tiempo real"],
      desc: "Monitorean tu mercado, tu competencia y tus campañas en tiempo real, y te avisan cuando algo se mueve. Sin planillas ni tableros que nadie abre.",
      headline: "Enterarte antes, no después.",
      body: "Agentes que leen tus datos y los del mercado todos los días, detectan desvíos y te mandan el resumen donde ya estás mirando. Nada de dashboards que hay que acordarse de abrir.",
      stat: ["Diario", "Reportes que llegan solos"],
    },
    {
      num: "06",
      title: "Colmena a medida",
      tags: ["Multi-agente", "Autónomo", "PUNY", "Escalable"],
      desc: "Varios agentes coordinados entre sí, cada uno con su especialidad, trabajando sobre el mismo objetivo. Es el motor que corre dentro de Hivrido.",
      headline: "Tu negocio en piloto automático.",
      body: "Es PUNY, el motor que corre dentro de Hivrido, adaptado a tu negocio. Sistemas multi-agente conectados a tu CRM, tus campañas y tus canales de comunicación, trabajando mientras dormís.",
      stat: ["Colmena", "Agentes coordinados, no scripts sueltos"],
    },
  ],
  trabajos: [
    { num: ".01", titulo: "Atención inmobiliaria", tags: ["WhatsApp", "CRM"], desc: "Responde por propiedad, agenda visitas y carga cada consulta con su contexto.", img: "/images/folio/5.webp" },
    { num: ".02", titulo: "Postventa e-commerce", tags: ["Envíos", "Seguimiento"], desc: "Estado de pedidos, cambios y devoluciones sin intervención humana.", img: "/images/folio/3.webp" },
    { num: ".03", titulo: "Concesionarios", tags: ["Leads", "Ads"], desc: "Califica interesados y devuelve la señal a las plataformas publicitarias.", img: "/images/folio/8.webp" },
    { num: ".04", titulo: "Turnos y servicios", tags: ["Agenda", "Recordatorios"], desc: "Reserva, confirma y recuerda turnos, y reasigna los que se liberan.", img: "/images/folio/27.webp" },
    { num: ".05", titulo: "Contenido de marca", tags: ["Copies", "Reels"], desc: "Producción semanal adaptada a cada canal, con dirección de arte humana.", img: "/images/folio/1.webp" },
    { num: ".06", titulo: "Reportes de mercado", tags: ["Competencia", "Alertas"], desc: "Seguimiento diario de precios y campañas de la competencia.", img: "/images/folio/2.webp" },
  ],
  trabajosTitle: { eyebrow: "Casos", lines: ["Ya corren", "solos"] },
  testimonios: [
    { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
    { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
    { nombre: "C. Maggione", empresa: "telotomo.com", texto: "Un lujo de punta a punta. Un equipo que entiende de tecnología y de negocios, que se mete de lleno en el proyecto y lo lleva al máximo nivel. Nos ayudaron a revolucionar el mercado de la compra de autos, y el resultado habla por sí solo." },
    { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
  ],
  garantias: [
    ["Respuesta", "El mismo día, con alcance y precio"],
    ["Puesta en marcha", "De 7 a 30 días según el proceso"],
    ["Incluido", "Integración con las herramientas que ya usás"],
    ["Después", "Tres meses de ajustes sin costo"],
  ],
  cta: {
    title: "Contanos qué querés automatizar",
    text: "Te respondemos con una propuesta concreta: qué agentes, sobre qué procesos, en cuánto tiempo y a qué precio. Sin reuniones eternas.",
    asunto: "una colmena de agentes IA",
    mail: "Consulta por colmena de agentes IA",
  },
};

export default function ColmenaAgentesPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que el preloader de la
          home se retire, y a quien ya lo vio hace poco se le saltea — el
          logo quedaría invisible dos segundos con el header a la vista. */}
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Agentes IA · Automatización · Buenos Aires</p>

            <h1 className="dw-hero-title">
              Una colmena que trabaja
              <br />
              mientras dormís
            </h1>

            <p className="dw-hero-text">
              Agentes de inteligencia artificial que atienden, califican, ejecutan y
              reportan solos. Conectados a tu CRM, tus campañas y tus canales: no es un
              chatbot, es un equipo que no se apaga.
            </p>

            <div className="dw-hero-actions">
              <a className="dw-hero-btn" href={WA} target="_blank" rel="noopener noreferrer">
                Pedir propuesta
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="dw-hero-link" href={`#${CONTENT.id}`}>
                Ver qué hacen
              </a>
            </div>

            <ul className="dw-hero-proof">
              <li>Respuesta el mismo día</li>
              <li>En marcha de 7 a 30 días</li>
              <li>Tres meses de ajustes incluidos</li>
            </ul>
          </div>
        </section>

        <WebDesign content={CONTENT} />
        <Footer />
      </main>
    </ClientShell>
  );
}
