import type { Metadata } from "next";
import PlayHome from "./PlayHome";
import { CATALOG, FEATURED } from "../../lib/catalog";
import { posterSrcSet } from "./Poster";
import { migas, organizacionPlay, sitioWeb, SITE } from "../../lib/schema";

/* La portada del catálogo de Hivrido PLAY. Se sirve en /play/ y, si la
   portada del dominio vuelve a ser el catálogo (app/lib/portada.ts), también
   en la raíz: las dos rutas montan esto mismo, así que no hay una copia que
   se desactualice.

   La imagen es 1200x630 —la proporción 1,91:1 que piden Facebook, Instagram y
   LinkedIn— con el título al centro, para que sobreviva al recorte cuadrado
   de WhatsApp, y pesa menos de 300 KB, que es donde varios clientes se rinden
   y no la bajan. Las demás redes leen estas mismas etiquetas de Open Graph. */
const TITLE = "Hivrido PLAY — Series y películas argentinas";
const SHARE_DESCRIPTION =
  "Series y películas de habla hispana, con estrenos que se ven primero acá.";

/** Metadata del catálogo, con la canónica que le toca según la portada. */
export function playMetadata(canonical: string): Metadata {
  return {
    title: TITLE,
    description:
      "Mirá series y películas argentinas en Hivrido PLAY: Okupas, Érase una vez en Virreyes, El rectángulo de Ángeles y estrenos que se ven primero acá.",
    applicationName: "Hivrido PLAY",
    category: "entertainment",
    alternates: { canonical },
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
      url: `${SITE}${canonical}`,
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
}

/**
 * Schema.org del catálogo. En la raíz van además Organization y WebSite, que
 * es lo que Google usa para el nombre del sitio y el panel de marca; en
 * /play/ esos los declara la home y acá van las migas.
 *
 * Quedan afuera las fichas provisorias, que son noindex, y los puntajes: el
 * `rating` del catálogo es una nota de la casa, y declararla como
 * AggregateRating sería atribuirla a votos que no existen, algo que Google
 * sanciona como datos estructurados engañosos.
 */
function catalogJsonLd(canonical: string) {
  const enRaiz = canonical === "/";
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...(enRaiz ? [organizacionPlay, sitioWeb] : [migas([["Hivrido", "/"], ["Hivrido PLAY", canonical]])]),
      {
        "@type": "ItemList",
        name: "Catálogo de Hivrido PLAY",
        url: `${SITE}${canonical}`,
        itemListElement: CATALOG.filter((t) => !t.isPlaceholder).map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": t.type === "serie" ? "TVSeries" : "Movie",
            name: t.title,
            description: t.synopsis,
            genre: t.genre || undefined,
            inLanguage: "es-AR",
            ...(t.href ? { url: `${SITE}${t.href}/` } : {}),
            ...(t.poster ? { image: `${SITE}${t.poster}` } : {}),
            ...(t.type === "serie" ? { numberOfSeasons: 1 } : {}),
          },
        })),
      },
    ],
  };
}

export default function PlayPortada({ canonical }: { canonical: string }) {
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
        imageSrcSet={posterSrcSet(FEATURED[0].hero!.image)}
        imageSizes="100vw"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd(canonical)).replace(/</g, "\\u003c") }}
      />
      <PlayHome />
    </>
  );
}
