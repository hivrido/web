import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlayHeader from "../../components/play/PlayHeader";
import PlayFooter from "../../components/play/PlayFooter";
import TitleView from "../../components/play/TitleView";
import { playFonts } from "../../components/play/fonts";
import { WITH_PAGE, directorsOf, relatedTo } from "../../lib/catalog";
import { posterSrcSet } from "../../components/play/Poster";
import { JsonLd, SITE, duracionIso, migas } from "../../lib/schema";
import "../../components/play/play.css";
import "./title.css";

/* La ficha de cada obra del catálogo. Se generan todas en build y cualquier
   otro id es 404. Muestra lo que la obra tenga: las que no traen `detail`
   arman la página con la sinopsis, y las provisorias anuncian que llegan. */
export const dynamicParams = false;

export function generateStaticParams() {
  return WITH_PAGE.map((t) => ({ id: t.id }));
}

type Props = { params: Promise<{ id: string }> };

const find = (id: string) => WITH_PAGE.find((t) => t.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = find((await params).id);
  if (!t) return {};
  const title = `${t.title} — ${t.type === "serie" ? "Serie" : "Película"} en Hivrido PLAY`;
  return {
    title,
    description: t.synopsis,
    alternates: { canonical: `${t.href}/` },
    openGraph: {
      title,
      description: t.synopsis,
      url: `https://hivrido.com${t.href}/`,
      siteName: "Hivrido PLAY",
      images: t.poster ? [{ url: t.poster, alt: t.title, ...(posterSrcSet(t.poster) ? { width: /elmonarco|cuchillo-paz/.test(t.poster) ? 1280 : 1600, height: /elmonarco|cuchillo-paz/.test(t.poster) ? 720 : 900 } : {}) }] : undefined,
      locale: "es_AR",
      type: t.type === "serie" ? "video.tv_show" : "video.movie",
    },
    twitter: { card: "summary_large_image" },
    /* Las provisorias no tienen nada que indexar todavía. */
    ...(t.isPlaceholder ? { robots: { index: false } } : {}),
  };
}

export default async function TitlePage({ params }: Props) {
  const t = find((await params).id);
  if (!t) notFound();
  const d = t.detail;
  const about = t.isPlaceholder ? null : d?.about ?? t.synopsis;
  const cast = d?.cast ?? [];
  const directors = directorsOf(t);

  /* Solo lo que la ficha tiene de verdad: sin duración confirmada no se
     declara duración, y el tráiler va como VideoObject únicamente si se puede
     ver embebido acá. Las provisorias (noindex) no emiten nada. */
  const url = `${SITE}${t.href}/`;
  const jsonLd = t.isPlaceholder
    ? null
    : {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": t.type === "serie" ? "TVSeries" : "Movie",
            "@id": `${url}#obra`,
            name: t.title,
            description: about ?? undefined,
            genre: t.genre.split("·").map((g) => g.trim()),
            inLanguage: "es-AR",
            countryOfOrigin: { "@type": "Country", name: "Argentina" },
            url,
            ...(t.poster ? { image: `${SITE}${t.poster}` } : {}),
            ...(t.type === "pelicula" && duracionIso(t.duration) ? { duration: duracionIso(t.duration) } : {}),
            ...(directors.length ? { director: directors.map((name) => ({ "@type": "Person", name })) } : {}),
            ...(cast.length ? { actor: cast.map((c) => ({ "@type": "Person", name: c.name })) } : {}),
            ...(t.ytId && !t.ytFull
              ? {
                  trailer: {
                    "@type": "VideoObject",
                    name: `Tráiler de ${t.title}`,
                    description: t.synopsis,
                    thumbnailUrl: `https://i.ytimg.com/vi/${t.ytId}/hqdefault.jpg`,
                    embedUrl: `https://www.youtube-nocookie.com/embed/${t.ytId}`,
                    contentUrl: `https://www.youtube.com/watch?v=${t.ytId}`,
                  },
                }
              : {}),
          },
          migas([["Hivrido PLAY", "/"], [t.type === "serie" ? "Series" : "Películas", "/"], [t.title, `${t.href}/`]]),
        ],
      };

  return (
    <div className={`mp-app hp tv ${playFonts}`} style={{ "--tp-accent": t.hero?.color ?? "#7C3AED" } as React.CSSProperties}>
      {jsonLd && <JsonLd data={jsonLd} />}
      <PlayHeader />
      <main>
        <TitleView t={t} related={relatedTo(t)} />
      </main>
      <PlayFooter />
    </div>
  );
}
