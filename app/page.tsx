import type { Metadata } from "next";
import PlayHome from "./components/play/PlayHome";
import { CATALOG, FEATURED } from "./lib/catalog";

/* La portada del dominio es la plataforma, no la agencia: el tráfico de
   campaña entra acá y lo primero que tiene que entender es que hay contenido
   para ver. La institucional vive en /web y declara lo suyo por su cuenta.

   El openGraph va completo —no solo el título— porque si no hereda el del
   layout raíz, que sigue hablando de la agencia. */
export const metadata: Metadata = {
  title: "Hivrido PLAY — Series y películas argentinas independientes",
  description:
    "Mirá series y películas independientes de habla hispana en Hivrido PLAY: El Docke, Okupas, Session One, Chamamé y los estrenos que se ven primero acá.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hivrido PLAY — Series y películas argentinas",
    description:
      "Nuestra plataforma de contenidos: series y películas propias de habla hispana, con estrenos que se ven primero acá.",
    url: "https://hivrido.com/",
    siteName: "Hivrido PLAY",
    images: [
      {
        url: "/images/bg/hivrido-chrome.jpg",
        width: 1200,
        height: 670,
        alt: "Hivrido PLAY",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Schema.org del catálogo. Cada ficha emite el tipo que le corresponde de
 * verdad —TVSeries para las series, Movie para las películas—, que es lo que
 * decide cómo la muestra Google. Las fichas provisorias entran igual: el
 * título y el tipo ya son datos reales, y lo que falta simplemente no se
 * declara en lugar de declararse mal.
 */
function catalogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de Hivrido PLAY",
    itemListElement: CATALOG.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": t.type === "serie" ? "TVSeries" : "Movie",
        name: t.title,
        description: t.isPlaceholder ? undefined : t.synopsis,
        genre: t.genre,
        inLanguage: "es-AR",
        ...(t.href ? { url: `https://hivrido.com${t.href}/` } : {}),
        ...(t.type === "serie" ? { numberOfSeasons: 1 } : {}),
        ...(t.rating
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: t.rating,
                bestRating: "10",
                ratingCount: 1,
              },
            }
          : {}),
      },
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd()) }}
      />
      <PlayHome />
    </>
  );
}
