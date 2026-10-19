import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlayHeader from "../../components/play/PlayHeader";
import PlayFooter from "../../components/play/PlayFooter";
import TitleView from "../../components/play/TitleView";
import { playFonts } from "../../components/play/fonts";
import { WITH_PAGE, directorsOf, relatedTo } from "../../lib/catalog";
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
    alternates: { canonical: t.href },
    openGraph: {
      title,
      description: t.synopsis,
      url: `https://hivrido.com${t.href}/`,
      siteName: "Hivrido PLAY",
      images: t.poster ? [{ url: t.poster, alt: t.title }] : undefined,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": t.type === "serie" ? "TVSeries" : "Movie",
    name: t.title,
    description: about ?? undefined,
    genre: t.genre,
    inLanguage: "es-AR",
    url: `https://hivrido.com${t.href}/`,
    ...(t.poster ? { image: `https://hivrido.com${t.poster}` } : {}),
    ...(directors.length ? { director: directors.map((name) => ({ "@type": "Person", name })) } : {}),
    ...(cast.length ? { actor: cast.map((c) => ({ "@type": "Person", name: c.name })) } : {}),
  };

  return (
    <div className={`mp-app hp tv ${playFonts}`} style={{ "--tp-accent": t.hero?.color ?? "#7C3AED" } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PlayHeader />
      <main>
        <TitleView t={t} related={relatedTo(t)} />
      </main>
      <PlayFooter />
    </div>
  );
}
