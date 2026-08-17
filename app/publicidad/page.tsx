import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WebDesign, { type LandingContent } from "../components/sections/WebDesign";

/**
 * Página de destino para publicidad digital y crecimiento en redes.
 *
 * Mismo recorrido que las otras landings con contenido propio. Sin el bloque
 * de la colmena: quien busca pauta quiere ver plataformas y formatos, no
 * arquitectura de agentes.
 */

const WA = "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Quiero pautar y hacer crecer mis redes.");

export const metadata: Metadata = {
  title: "Publicidad Digital | Meta y Google Ads | Hivrido",
  description:
    "Campañas en Meta Ads, Google Ads y YouTube: search, display, performance max, in-stream, bumpers y Shorts. Crecimiento de presencia y seguidores, y colaboraciones con influencers y artistas.",
  keywords: [
    "publicidad digital",
    "meta ads",
    "google ads",
    "anuncios en youtube",
    "agencia de publicidad",
    "crecimiento en redes",
    "influencers",
  ],
  alternates: { canonical: "/publicidad" },
  openGraph: {
    title: "Publicidad Digital | Hivrido",
    description:
      "Meta, Google y YouTube. Campañas medidas contra el costo por adquisición real, más crecimiento de redes y colaboraciones.",
    url: "https://hivrido.com/publicidad",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

const CONTENT: LandingContent = {
  id: "sec-publicidad",
  hive: false,
  ticker: [
    "Publicidad digital",
    "Meta Ads",
    "Google Ads",
    "Anuncios en YouTube",
    "Presencia en redes",
    "Crecimiento de seguidores",
    "Influencers",
    "Colaboraciones",
  ],
  title: { eyebrow: "Qué hacemos", lines: ["Inversión que", "vuelve"] },
  lead: (
    <>
      Somos <strong>Partner de Meta</strong> y trabajamos <strong>Google Ads</strong> y{" "}
      <strong>anuncios en YouTube</strong> en todos sus formatos. No compramos alcance:
      compramos resultados, medidos contra el costo real de conseguir un cliente. Y lo
      que la pauta empuja, el <strong>crecimiento orgánico</strong> y las{" "}
      <strong>colaboraciones con artistas e influencers</strong> lo sostienen.
    </>
  ),
  servicios: [
    {
      num: "01",
      title: "Meta Ads",
      tags: ["Partner de Meta", "Instagram", "Facebook", "Reels"],
      desc: "Campañas en Instagram y Facebook con todos los emplazamientos: feed, historias, Reels, catálogo y retargeting. Como Partner de Meta accedemos a soporte y novedades antes.",
      headline: "Donde ya está tu público.",
      body: "Estructuramos la cuenta como corresponde —campañas por objetivo, públicos que no se pisan entre sí, creativos por emplazamiento— y trabajamos con Advantage+ y retargeting de catálogo. Ser Partner de Meta nos da soporte directo y acceso temprano a formatos, que en una cuenta que factura se nota.",
      stat: ["Partner", "Soporte directo y acceso temprano a formatos"],
    },
    {
      num: "02",
      title: "Google Ads",
      tags: ["Search", "Performance Max", "Display", "Shopping"],
      desc: "Búsqueda, Performance Max, Display y Shopping. Aparecer en el momento exacto en que alguien está buscando lo que vendés.",
      headline: "Intención pura, no interrupción.",
      body: "En búsqueda se compra intención: alguien ya quiere lo que vendés y escribe para encontrarlo. Armamos la estructura de palabras clave, las negativas que evitan gasto inútil, los anuncios y las extensiones, y sumamos Performance Max y Shopping cuando el catálogo lo justifica.",
      stat: ["CPA", "Medido contra el costo real de adquirir un cliente"],
    },
    {
      num: "03",
      title: "Anuncios en YouTube",
      tags: ["In-stream", "Bumpers", "In-feed", "Shorts"],
      desc: "Todos los formatos: in-stream saltables y no saltables, bumpers de seis segundos, in-feed en búsqueda y sugeridos, y anuncios en Shorts.",
      headline: "El único formato que se ve entero.",
      body: "Elegimos el formato según el trabajo que tiene que hacer la pieza: in-stream saltable para contar algo y pagar solo por quien se queda, no saltable de 15 segundos cuando el mensaje no admite corte, bumpers de 6 para grabar una idea a fuerza de repetición, in-feed para quien está buscando, y Shorts para el consumo vertical. Y la pieza la producimos nosotros.",
      stat: ["Producción propia", "El anuncio y la campaña, en la misma casa"],
    },
    {
      num: "04",
      title: "Presencia en redes",
      tags: ["Contenido", "Calendario", "Comunidad"],
      desc: "Que la cuenta esté viva cuando la pauta traiga gente: contenido con criterio, publicado con constancia y respondido a tiempo.",
      headline: "La pauta trae, el perfil convence.",
      body: "De nada sirve pagar por visitas si el perfil que encuentran está abandonado. Trabajamos calendario, formatos por plataforma, respuesta de mensajes y comentarios, y el aro de contenido que sostiene la conversación entre campaña y campaña.",
      stat: ["Constancia", "Publicación sostenida, no picos sueltos"],
    },
    {
      num: "05",
      title: "Crecimiento de seguidores",
      tags: ["Orgánico", "Alcance", "Retención"],
      desc: "Seguidores reales que consumen y compran, no números comprados que inflan la cuenta y hunden el alcance.",
      headline: "Números que significan algo.",
      body: "Combinamos contenido pensado para alcance, campañas de reconocimiento y colaboraciones para que la cuenta crezca con gente del perfil correcto. Comprar seguidores hunde el alcance de todo lo que publiques después: no lo hacemos ni lo recomendamos.",
      stat: ["Reales", "Perfil que consume, no relleno"],
    },
    {
      num: "06",
      title: "Influencers y artistas",
      tags: ["Colaboraciones", "Comunidad", "Selección"],
      desc: "Conectamos marcas con nuestra comunidad de artistas y creadores, y armamos colaboraciones que no se leen como un aviso pago.",
      headline: "Lo que no se ve, no existe.",
      body: "Trabajamos con más de ochenta artistas y creadores. Seleccionamos por afinidad real con la marca y no por cantidad de seguidores, producimos la pieza junto al creador para que suene a él y no a un guion leído, y medimos el resultado igual que una campaña de pauta.",
      stat: ["80+", "Artistas y creadores en la comunidad"],
    },
  ],
  trabajos: [
    { num: ".01", titulo: "Inmobiliaria", tags: ["Meta", "Leads"], desc: "Campañas por emprendimiento con formularios conectados al CRM.", img: "/images/folio/5.webp" },
    { num: ".02", titulo: "E-commerce", tags: ["Shopping", "Catálogo"], desc: "Catálogo sincronizado y retargeting dinámico sobre los productos vistos.", img: "/images/folio/3.webp" },
    { num: ".03", titulo: "Concesionarios", tags: ["Search", "Señal"], desc: "Búsqueda por modelo y devolución de la señal de venta a las plataformas.", img: "/images/folio/8.webp" },
    { num: ".04", titulo: "Lanzamientos", tags: ["YouTube", "Bumpers"], desc: "Secuencia de trailer, bumpers y remarketing alrededor del estreno.", img: "/images/folio/1.webp" },
    { num: ".05", titulo: "Servicios profesionales", tags: ["Turnos", "Local"], desc: "Campañas por zona con seguimiento hasta el turno reservado.", img: "/images/folio/27.webp" },
    { num: ".06", titulo: "Artistas", tags: ["Colaboraciones", "Alcance"], desc: "Colaboraciones con creadores de la comunidad y amplificación pagada.", img: "/images/folio/2.webp" },
  ],
  trabajosTitle: { eyebrow: "Trabajos", lines: ["Ya lo", "pautamos"] },
  testimonios: [
    { nombre: "M. Maioli", empresa: "mympropiedades.com.ar", texto: "Desde el primer día se pusieron la camiseta y llevaron adelante todo nuestro proyecto con una visión increíble. Manual de marca, logo, renders, material para redes, una web y app móvil impecables, un ERP a medida que nos ordenó la vida y una plataforma publicitaria que nos hizo volar en el mercado inmobiliario." },
    { nombre: "C. Maggione", empresa: "telotomo.com", texto: "Un lujo de punta a punta. Un equipo que entiende de tecnología y de negocios, que se mete de lleno en el proyecto y lo lleva al máximo nivel. Nos ayudaron a revolucionar el mercado de la compra de autos, y el resultado habla por sí solo." },
    { nombre: "H. Winnik", empresa: "flow.com.ar", texto: "Estamos más que satisfechos con los resultados y confiamos plenamente en su capacidad para seguir impulsando nuestro crecimiento. Totalmente recomendados para cualquier empresa que busque innovación y calidad en sus proyectos digitales." },
    { nombre: "S. Borrero", empresa: "rappi.com.ar", texto: "Se metieron de lleno en el proyecto y desarrollaron una app que no solo es intuitiva y potente, sino que refleja nuestra esencia y compromiso con el usuario. Desde el diseño elegante y funcional hasta la tecnología de punta, lograron una solución integral." },
  ],
  garantias: [
    ["Respuesta", "El mismo día, con plan y presupuesto"],
    ["Cuentas", "Tuyas: las administramos, no las retenemos"],
    ["Reportes", "Mensuales, con el costo por resultado a la vista"],
    ["Creativos", "Producción propia incluida en la gestión"],
  ],
  cta: {
    title: "Contanos qué querés vender",
    text: "Te respondemos con un plan concreto: plataformas, formatos, inversión sugerida y qué esperar de cada peso. Sin promesas de alcance que no se traducen en nada.",
    asunto: "campañas de publicidad digital",
    mail: "Consulta por publicidad digital",
  },
};

export default function PublicidadPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que el preloader de la
          home se retire, y a quien ya lo vio hace poco se le saltea — el
          logo quedaría invisible dos segundos con el header a la vista. */}
      <Header base="/" logoDelay={300} />

      <main className="dw-page page-wrapper">
        <section className="dw-hero">
          <div className="section-container">
            <p className="dw-hero-eyebrow">Publicidad digital · Partner de Meta · Google Ads</p>

            <h1 className="dw-hero-title">
              Inversión que se
              <br />
              convierte en clientes
            </h1>

            <p className="dw-hero-text">
              Campañas en Meta, Google y YouTube con producción propia de los creativos.
              Más crecimiento real de tus redes y colaboraciones con artistas de nuestra
              comunidad. Todo medido contra lo que te cuesta conseguir un cliente.
            </p>

            <div className="dw-hero-actions">
              <a className="dw-hero-btn" href={WA} target="_blank" rel="noopener noreferrer">
                Pedir un plan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="dw-hero-link" href={`#${CONTENT.id}`}>
                Ver qué hacemos
              </a>
            </div>

            <ul className="dw-hero-proof">
              <li>Partner de Meta</li>
              <li>Creativos incluidos</li>
              <li>Las cuentas quedan a tu nombre</li>
            </ul>
          </div>
        </section>

        <WebDesign content={CONTENT} />
        <Footer />
      </main>
    </ClientShell>
  );
}
