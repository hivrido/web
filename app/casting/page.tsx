import type { Metadata } from "next";
import Link from "next/link";
import LogoAnimated from "../components/ui/LogoAnimated";
import Reveal from "./Reveal";
import SeccionesCasting from "./SeccionesCasting";
import {
  IconoCalendario,
  IconoFlecha,
  IconoPin,
  IconoReloj,
  IconoWhatsApp,
} from "./Iconos";
import {
  AUDICION_VIDEO_URL,
  COMO_LLEGAR,
  CONTACTO,
  DIRECCION_COMPLETA,
  EVENTO,
  HERO,
  MAPS_URL,
  SEO,
  SI_NO_PODES,
  TEXTO_COMPARTIR,
  URL_PAGINA,
  WHATSAPP_PRODUCCION,
} from "./contenido";
import "./casting.css";

/* La barra del navegador acompaña al fondo de la página. El link se abre casi
   siempre desde el navegador incrustado de WhatsApp o Instagram en Android,
   que sin esto pinta la barra de blanco arriba de un sitio negro.

   Los tres campos van declarados aunque dos repitan el layout raíz: así la
   ruta no depende de cómo Next resuelva la mezcla, y un `width` perdido acá
   significaría la página entera sin escalar en el celular. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

/* El link se reparte por WhatsApp e Instagram: la tarjeta de previsualización
   es lo primero que ve la mayoría, antes que la página. Por eso la imagen se
   declara con medidas y alt, y la descripción dice fecha y lugar —que es lo
   que se lee dentro del globo del chat sin abrir nada—. */
export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: "/casting" },
  openGraph: {
    title: `${HERO.tituloArriba.toUpperCase()} — ${EVENTO.serie.toUpperCase()}`,
    description: `${EVENTO.fecha}, ${EVENTO.hora}. ${DIRECCION_COMPLETA}. Gratis, por orden de llegada. No hay que preparar nada.`,
    url: URL_PAGINA,
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: SEO.ogImage,
        width: 1200,
        height: 630,
        alt: SEO.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${HERO.tituloArriba.toUpperCase()} — ${EVENTO.serie.toUpperCase()}`,
    description: SEO.description,
    images: [SEO.ogImage],
  },
};

/* Ficha del evento para buscadores. Declara el precio cero explícitamente:
   es la misma advertencia que le damos a la gente en la página, dicha en el
   idioma que leen Google y las redes. */
const schema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Casting abierto — ${EVENTO.serie}`,
  description: SEO.description,
  startDate: EVENTO.inicioISO,
  endDate: EVENTO.finISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  isAccessibleForFree: true,
  inLanguage: "es-AR",
  image: [`https://hivrido.com${SEO.ogImage}`],
  url: URL_PAGINA,
  location: {
    "@type": "Place",
    name: `${EVENTO.barrio}, ${EVENTO.localidad}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${EVENTO.calle} ${EVENTO.esquina}`,
      addressLocality: EVENTO.localidad,
      addressRegion: EVENTO.provincia,
      postalCode: EVENTO.codigoPostal,
      addressCountry: EVENTO.pais,
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Hivrido",
    url: "https://hivrido.com",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "ARS",
    availability: "https://schema.org/InStock",
    validFrom: "2026-09-01T00:00:00-03:00",
    url: URL_PAGINA,
  },
  workFeatured: {
    "@type": "TVSeries",
    name: EVENTO.serie,
  },
};

const waProduccion = (texto: string) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_PRODUCCION}&text=${encodeURIComponent(texto)}`;

/* Sin número de destino, WhatsApp abre la lista de contactos para elegir a
   quién mandárselo: es el gesto de compartir, no el de escribirnos. */
const waCompartir = `https://api.whatsapp.com/send?text=${encodeURIComponent(TEXTO_COMPARTIR)}`;

export default function CastingPage() {
  const audicionUrl = AUDICION_VIDEO_URL || waProduccion(SI_NO_PODES.fallbackTexto);
  const transporte = COMO_LLEGAR.transporte.filter((via) => via.detalle.trim());

  return (
    <div className="cst-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="cst-top">
        {/* Sin animación: el logo dibujado arranca invisible y espera a que
            baje el chunk de GSAP. Acá se pinta con el HTML y listo. */}
        <Link href="/" className="cst-top-logo" aria-label="Hivrido — ir al inicio">
          <LogoAnimated height={24} animate={false} />
        </Link>
        <span className="cst-top-kicker">{HERO.kicker}</span>
      </header>

      <main id="contenido">
        {/* ── 1 · Hero ──────────────────────────────────────────────────
            Sin imagen ni video de fondo: el LCP de esta página es el título
            y tiene que pintarse con el HTML, sin esperar una descarga. La
            atmósfera la ponen dos degradados y una trama, que no cuestan
            ni una petición. */}
        <section className="cst-hero">
          <div className="cst-hero-luz" aria-hidden="true" />
          <div className="cst-hero-trama" aria-hidden="true" />

          <div className="cst-wrap cst-hero-inner">
            <p className="cst-hero-eyebrow">
              <span className="cst-hero-punto" aria-hidden="true" />
              Convocatoria abierta
            </p>

            <h1 className="cst-hero-titulo">
              <span className="cst-hero-titulo-1">{HERO.tituloArriba}</span>
              <strong className="cst-hero-titulo-2">{HERO.tituloAbajo}</strong>
            </h1>

            <ul className="cst-hero-datos">
              <li>
                <IconoCalendario />
                <time dateTime={EVENTO.inicioISO}>{EVENTO.fecha}</time>
              </li>
              <li>
                <IconoReloj />
                {EVENTO.hora}
              </li>
              <li>
                <IconoPin />
                <span>
                  {EVENTO.calle} {EVENTO.esquina}
                  <em>
                    {EVENTO.barrio}, {EVENTO.localidad}
                  </em>
                </span>
              </li>
            </ul>

            <p className="cst-claim">{HERO.claim}</p>
            <p className="cst-claim-apoyo">{HERO.claimApoyo}</p>

            <a className="cst-btn cst-btn-mapa" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <IconoPin />
              Ver cómo llegar
            </a>
          </div>
        </section>

        <SeccionesCasting
          trasPreparacion={
            <>
            {/* ── 6 · Cómo llegar ──────────────────────────────────────────── */}
            <section className="cst-seccion" aria-labelledby="t-llegar">
              <div className="cst-wrap">
                <h2 className="cst-h2" id="t-llegar">
                  {COMO_LLEGAR.titulo}
                </h2>

                <Reveal>
                  <address className="cst-direccion">
                    <span className="cst-direccion-calle">
                      {EVENTO.calle} {EVENTO.esquina}
                    </span>
                    <span className="cst-direccion-zona">
                      {EVENTO.barrio} · {EVENTO.localidad} · {EVENTO.provincia}
                    </span>
                    <a
                      className="cst-btn cst-btn-pleno"
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconoPin />
                      Abrir en Google Maps
                    </a>
                  </address>
                </Reveal>

                <Reveal delay={0.06}>
                  {/* Solo las vías que ya tienen indicación escrita. Ver la nota
                      en COMO_LLEGAR: sin texto, la vía no se publica. */}
                  {transporte.length > 0 && (
                    <ul className="cst-transporte">
                      {transporte.map((via) => (
                        <li key={via.medio}>
                          <h3 className="cst-transporte-medio">{via.medio}</h3>
                          <p className="cst-transporte-detalle">{via.detalle}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="cst-nota">{COMO_LLEGAR.nota}</p>
                </Reveal>
              </div>
            </section>
            </>
          }
          antesDePreguntas={
            <>
            {/* ── 8 · Si no podés venir ────────────────────────────────────── */}
            <section className="cst-seccion" aria-labelledby="t-video">
              <div className="cst-wrap">
                <Reveal className="cst-video">
                  <h2 className="cst-h2 cst-h2-chico" id="t-video">
                    {SI_NO_PODES.titulo}
                  </h2>
                  <p className="cst-video-texto">{SI_NO_PODES.texto}</p>
                  <a
                    className="cst-btn cst-btn-pleno"
                    href={audicionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {SI_NO_PODES.cta}
                    <IconoFlecha />
                  </a>
                </Reveal>
              </div>
            </section>
            </>
          }
        />
      </main>

      {/* ── 10 · Pie ────────────────────────────────────────────────────── */}
      <footer className="cst-pie">
        <div className="cst-wrap">
          <p className="cst-pie-marca">
            Hivrido · Producción de <strong>{EVENTO.serie}</strong>
          </p>

          <ul className="cst-pie-links">
            <li>
              <a href={waProduccion(CONTACTO.whatsappTexto)} target="_blank" rel="noopener noreferrer">
                WhatsApp de producción
              </a>
            </li>
            <li>
              <a href={CONTACTO.instagram} target="_blank" rel="noopener noreferrer">
                Instagram {CONTACTO.instagramHandle}
              </a>
            </li>
            {CONTACTO.privacidadUrl && (
              <li>
                <Link href={CONTACTO.privacidadUrl}>Política de privacidad</Link>
              </li>
            )}
          </ul>

          <p className="cst-pie-legal">
            © {new Date().getFullYear()} Hivrido. La participación en el casting es
            gratuita. No cobramos por inscripción, cursos ni fotos.
          </p>
        </div>
      </footer>

      {/* Flotante de compartir. Es un enlace común: sin número de destino,
          WhatsApp abre la lista de contactos. Funciona sin JavaScript y no
          compite con ningún otro botón fijo —esta ruta no monta el de
          contacto del resto del sitio, que está en el pie—. */}
      <a
        className="cst-compartir"
        href={waCompartir}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconoWhatsApp size={20} />
        <span>Compartir</span>
      </a>
    </div>
  );
}
