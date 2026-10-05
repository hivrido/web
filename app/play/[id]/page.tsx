import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LogoAnimated from "../../components/ui/LogoAnimated";
import { WITH_DETAIL } from "../../lib/catalog";
import "../../components/play/play.css";
import "./title.css";

/* Una página por obra con `detail` en el catálogo. Se generan todas en build
   y cualquier otro id es 404: no hay fichas que se armen al vuelo. */
export const dynamicParams = false;

export function generateStaticParams() {
  return WITH_DETAIL.map((t) => ({ id: t.id }));
}

type Props = { params: Promise<{ id: string }> };

const find = (id: string) => WITH_DETAIL.find((t) => t.id === id);

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
  };
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default async function TitlePage({ params }: Props) {
  const t = find((await params).id);
  if (!t?.detail) notFound();
  const d = t.detail;
  const accent = t.hero?.color ?? "#7C3AED";
  const directors = d.crew.filter((c) => /direcci/i.test(c.role)).map((c) => c.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": t.type === "serie" ? "TVSeries" : "Movie",
    name: t.title,
    description: d.about,
    genre: t.genre,
    inLanguage: "es-AR",
    url: `https://hivrido.com${t.href}/`,
    ...(t.poster ? { image: `https://hivrido.com${t.poster}` } : {}),
    ...(directors.length ? { director: directors.map((name) => ({ "@type": "Person", name })) } : {}),
    actor: d.cast.map((c) => ({ "@type": "Person", name: c.name })),
    ...(d.imdb ? { sameAs: `https://www.imdb.com/title/${d.imdb}/` } : {}),
  };

  return (
    <div className="mp-app tp" style={{ "--tp-accent": accent } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mp-header">
        <Link href="/play/" className="mp-logo">
          <LogoAnimated height={26} delay={300} />
          <span className="mp-logo-badge">PLAY</span>
        </Link>
        <Link href="/play/" className="tp-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Volver
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="tp-hero">
        {t.poster && <div className="tp-hero-bg" style={{ backgroundImage: `url('${t.poster}')` }} />}
        <div className="tp-hero-shade" />
        <div className="tp-wrap tp-hero-inner">
          <nav className="tp-crumbs" aria-label="Ruta">
            <Link href="/play/">Inicio</Link>
            <span>›</span>
            <Link href={t.type === "serie" ? "/play/#series" : "/play/#peliculas"}>
              {t.type === "serie" ? "Series" : "Películas"}
            </Link>
          </nav>
          <p className="tp-kicker">{d.format}</p>
          <h1 className="tp-title">{t.title}</h1>
          <div className="tp-meta">
            {t.year && <span>{t.year}</span>}
            {t.duration && t.duration !== "—" && <span>{t.duration}</span>}
            <span>{t.genre}</span>
            {d.advisory && <span className="tp-rating">+18</span>}
          </div>
          <p className="tp-lead">{t.synopsis}</p>
          <div className="tp-actions">
            {t.ytId && (
              <a href="#trailer" className="mp-play-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                {t.ytFull ? "Ver ahora" : "Ver tráiler"}
              </a>
            )}
            {d.imdb && (
              <a href={`https://www.imdb.com/title/${d.imdb}/`} target="_blank" rel="noopener noreferrer" className="mp-outline-btn">
                Ver en IMDb
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── TRÁILER ── */}
      {t.ytId && (
        <section id="trailer" className="tp-wrap tp-section">
          {t.ytExternal ? (
            /* Con restricción de edad YouTube no deja embeberlo: el iframe
               solo mostraría su aviso. Se muestra la portada y se abre allá. */
            <a
              href={`https://www.youtube.com/watch?v=${t.ytId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-player tp-player-ext"
              style={t.poster ? { backgroundImage: `url('${t.poster}')` } : undefined}
            >
              <span className="tp-player-cta">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Ver el tráiler en YouTube
              </span>
              <span className="tp-player-hint">Contenido +18: YouTube pide verificar la edad</span>
            </a>
          ) : (
          <div className="tp-player">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${t.ytId}?rel=0&modestbranding=1`}
              title={t.ytFull ? t.title : `Tráiler de ${t.title}`}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          )}
        </section>
      )}

      {/* ── SINOPSIS + FICHA ── */}
      <section className="tp-wrap tp-section tp-split">
        <div>
          <h2 className="tp-h2">Sinopsis</h2>
          <p className="tp-body">{d.about}</p>
          {d.advisory && (
            <p className="tp-advisory">
              <strong>Advertencia de contenido.</strong> {d.advisory}
            </p>
          )}
        </div>
        <dl className="tp-sheet">
          {d.crew.map((c) => (
            <div key={c.role}>
              <dt>{c.role}</dt>
              <dd>{c.name}</dd>
            </div>
          ))}
          <div>
            <dt>País · Idioma</dt>
            <dd>Argentina · Español</dd>
          </div>
        </dl>
      </section>

      {/* ── RELATOS ── */}
      {d.chapters && (
        <section className="tp-wrap tp-section">
          <h2 className="tp-h2">{d.chapters.length} relatos, un mismo barrio</h2>
          <ol className="tp-chapters">
            {d.chapters.map((c, i) => (
              <li key={c.title}>
                <span className="tp-roman">{ROMAN[i]}</span>
                <div>
                  <div className="tp-chapter-head">
                    <h3>{c.title}</h3>
                    <span>{c.theme}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── ELENCO ── */}
      <section className="tp-wrap tp-section">
        <h2 className="tp-h2">Elenco</h2>
        <ul className="tp-cast">
          {d.cast.map((c) => (
            <li key={c.name}>
              <span className="tp-initials" aria-hidden="true">
                {c.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </span>
              <span className="tp-cast-name">{c.name}</span>
              {c.character && <span className="tp-cast-role">{c.character}</span>}
            </li>
          ))}
        </ul>
      </section>

      {/* ── PREMIOS ── */}
      {d.awards && (
        <section className="tp-wrap tp-section">
          <h2 className="tp-h2">Premios y festivales</h2>
          {d.awardsNote && <p className="tp-note">{d.awardsNote}</p>}
          <ul className="tp-awards">
            {d.awards.map((a, i) => (
              <li key={i}>
                <span className="tp-award-label">{a.label}</span>
                <span className="tp-award-name">{a.name}</span>
                <span className="tp-award-detail">{a.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mp-footer">
        <span>© 2026 Hivrido PLAY. Todos los derechos reservados.</span>
        <div className="mp-footer-links">
          <Link href="/play/">← Volver a Hivrido PLAY</Link>
        </div>
      </footer>
    </div>
  );
}
