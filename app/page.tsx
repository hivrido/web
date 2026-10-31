import type { Metadata, Viewport } from "next";
import PlayHome from "./components/play/PlayHome";
import { CATALOG, FEATURED } from "./lib/catalog";

/* La portada del dominio es la plataforma. El anillo institucional vive en
   /web (public/web/index.html, servido por el rewrite de next.config.ts).

   La imagen es 1200x630 —la proporción 1,91:1 que piden Facebook, Instagram y
   LinkedIn— con el título al centro, para que sobreviva al recorte cuadrado
   de WhatsApp, y pesa menos de 300 KB, que es donde varios clientes se rinden
   y no la bajan. Las demás redes leen estas mismas etiquetas de Open Graph. */
const SITE_URL = "https://hivrido.com";
const TITLE = "Hivrido PLAY — Series y películas argentinas";
const SHARE_DESCRIPTION =
  "Series y películas de habla hispana, con estrenos que se ven primero acá.";

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Mirá series y películas argentinas en Hivrido PLAY: Okupas, Érase una vez en Virreyes, El rectángulo de Ángeles y estrenos que se ven primero acá.",
  applicationName: "Hivrido PLAY",
  category: "entertainment",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: SHARE_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: "Hivrido PLAY",
    images: [
      {
        url: "/images/share/hivrido-play-portada.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Hivrido PLAY: series y películas argentinas",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Schema.org de la portada. Organization y WebSite son lo que Google usa para
 * el nombre del sitio y el panel de marca; el catálogo emite el tipo que le
 * corresponde de verdad a cada ficha —TVSeries o Movie—.
 *
 * Quedan afuera las fichas provisorias, que son noindex, y los puntajes: el
 * `rating` del catálogo es una nota de la casa, y declararla como
 * AggregateRating sería atribuirla a votos que no existen, algo que Google
 * sanciona como datos estructurados engañosos.
 */
function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Hivrido",
        alternateName: "Hivrido PLAY",
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo/hivrido-logo-512.png`,
          width: 512,
          height: 512,
        },
        email: "hola@hivrido.com",
        sameAs: ["https://www.instagram.com/hivrido.product.x1_ok/"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Hivrido PLAY",
        alternateName: "Hivrido",
        url: `${SITE_URL}/`,
        inLanguage: "es-AR",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        name: "Catálogo de Hivrido PLAY",
        itemListElement: CATALOG.filter((t) => !t.isPlaceholder).map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": t.type === "serie" ? "TVSeries" : "Movie",
            name: t.title,
            description: t.synopsis,
            genre: t.genre,
            inLanguage: "es-AR",
            ...(t.href ? { url: `${SITE_URL}${t.href}/` } : {}),
            ...(t.poster ? { image: `${SITE_URL}${t.poster}` } : {}),
            ...(t.type === "serie" ? { numberOfSeasons: 1 } : {}),
          },
        })),
      },
    ],
  };
}

export default function Page() {
  return (
    <>
      {/* El fondo del primer slide es el elemento más grande de la pantalla
          inicial, y como lo pinta el CSS de un div que React monta después de
          hidratar, el navegador no lo descubre hasta tarde. Declarado acá se
          pide junto con el HTML. Solo el primero: los otros dos se cargan
          cuando el slider llega a ellos. */}
      <link
        rel="preload"
        as="image"
        href={FEATURED[0].hero!.image}
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />
      <PlayHome />
    </>
  );
}
