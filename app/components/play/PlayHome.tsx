"use client";

/**
 * Portada de Hivrido PLAY, en /play. Es adonde llegan los links de los
 * estrenos, así que el arranque manda sobre cualquier otra consideración.
 *
 * Las fichas salen todas de app/lib/catalog.ts. Acá no se declara contenido:
 * si un título tiene que cambiar de fila o de tipo, se cambia allá.
 */

import Link from "next/link";
import NextImage from "next/image";
import {
  CATALOG,
  EDITORIAL,
  FACETS,
  PELICULAS,
  SELECTION,
  SERIES,
  SHELVES,
  UPCOMING,
  directorsOf,
  type Entry,
} from "../../lib/catalog";
import Hero from "./Hero";
import PlayHeader from "./PlayHeader";
import PlayFooter from "./PlayFooter";
import PosterCard, { metaOf } from "./PosterCard";
import Row from "./Row";
import { openSearch } from "./SearchOverlay";
import { useHistory, useMyList } from "./library";
import { playFonts } from "./fonts";
import "./play.css";

const byId = (id: string) => CATALOG.find((t) => t.id === id);
const WA = "https://wa.me/5491156072460?text=";

/* Filas que dependen de lo que hizo el visitante. En el servidor no existen,
   y aparecen solo si tienen algo que mostrar. */
function PersonalRows() {
  const history = useHistory();
  const { ids } = useMyList();
  const watching = history.flatMap((p) => {
    const t = byId(p.id);
    return t ? [{ t, pct: p.pos / p.dur }] : [];
  });
  const listed = ids.map(byId).filter((t): t is Entry => !!t);

  return (
    <>
      {watching.length > 0 && (
        <Row title="Seguir viendo" note="Continuá">
          {watching.map(({ t, pct }) => (
            <PosterCard key={t.id} item={t} progress={pct} />
          ))}
        </Row>
      )}
      {listed.length > 0 && (
        <Row title="Mi lista" note={String(listed.length).padStart(2, "0")}>
          {listed.map((t) => (
            <PosterCard key={t.id} item={t} />
          ))}
        </Row>
      )}
    </>
  );
}

/* El estreno de la casa, en formato editorial: imagen grande, créditos y
   premios reales de la ficha. */
function Editorial({ t }: { t: Entry }) {
  const by = directorsOf(t);
  const awards = (t.detail?.awards ?? []).filter((a) => !/selecci/i.test(a.label)).slice(0, 3);
  return (
    <section className="hp-editorial" aria-label={`Estreno: ${t.title}`}>
      <Link href={t.href} className="hp-editorial-media" tabIndex={-1} aria-hidden="true">
        {t.poster && <NextImage src={t.poster} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" className="hp-editorial-img" />}
      </Link>
      <div className="hp-editorial-copy">
        <p className="hp-kicker"><span className="hp-kicker-dot" />Estreno · {t.detail?.format.split("·")[0].trim() ?? "Película"}</p>
        <h2 className="hp-editorial-title">{t.title}</h2>
        {by.length > 0 && <p className="hp-editorial-by">Un film de {by.join(" y ")}</p>}
        <p className="hp-editorial-text">{t.synopsis.replace(/\s*\+18\.?$/, "")}</p>
        {awards.length > 0 && (
          <ul className="hp-editorial-awards">
            {awards.map((a) => (
              <li key={a.label}>
                <span>{a.label}</span>
                {a.name}
              </li>
            ))}
          </ul>
        )}
        <div className="hp-hero-actions">
          <Link href={`${t.href}#trailer`} className="hp-btn is-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            Ver tráiler
          </Link>
          <Link href={t.href} className="hp-btn is-ghost">Ver ficha</Link>
        </div>
      </div>
    </section>
  );
}

function ComingSoon() {
  return (
    <section className="hp-shelf" id="proximamente" aria-label="Próximamente">
      <header className="hp-shelf-head">
        <h2 className="hp-shelf-title">Próximamente</h2>
        <span className="hp-shelf-note">{String(UPCOMING.length).padStart(2, "0")} en camino</span>
      </header>
      <div className="hp-soon-grid">
        {UPCOMING.map((t) => (
          <article key={t.id} className={`hp-soon${t.poster ? " has-poster" : ""}`}>
            <Link href={t.href} className="hp-soon-media" aria-label={t.title}>
              {t.poster ? (
                <NextImage src={t.poster} alt="" fill sizes="(max-width: 768px) 90vw, 420px" className="hp-card-img" />
              ) : (
                <span className="hp-card-fallback is-lg" aria-hidden="true">{t.title}</span>
              )}
              <span className="hp-badges"><span className="hp-badge is-gold">Próximamente</span></span>
            </Link>
            <div className="hp-soon-body">
              <div>
                <h3 className="hp-soon-title">{t.title}</h3>
                <p className="hp-meta">{metaOf(t).join(" · ")}</p>
              </div>
              <a
                className="hp-btn is-ghost is-sm"
                href={`${WA}${encodeURIComponent(`Hola Hivrido! Avisame cuando se estrene ${t.title} en PLAY`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
                Avisame
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* Explorar por género: cada tarjeta abre el buscador con su corte elegido.
   El collage usa los afiches de lo que hay adentro. */
function Genres() {
  const tiles = FACETS.map((f) => ({ f, items: CATALOG.filter((t) => !t.isPlaceholder && f.match(t)) })).filter(
    (x) => x.items.length > 1,
  );
  return (
    <section className="hp-shelf" aria-label="Explorar por género">
      <header className="hp-shelf-head">
        <h2 className="hp-shelf-title">Explorar por género</h2>
      </header>
      <div className="hp-genres">
        {tiles.map(({ f, items }) => (
          <button key={f.id} type="button" className="hp-genre" onClick={() => openSearch(f.id)}>
            <span className="hp-genre-label">{f.label}</span>
            <span className="hp-meta">{String(items.length).padStart(2, "0")} títulos</span>
            <span className="hp-genre-stack" aria-hidden="true">
              {items.filter((t) => t.poster).slice(0, 3).map((t) => (
                <span key={t.id} className="hp-genre-poster">
                  <NextImage src={t.poster!} alt="" fill sizes="160px" className="hp-card-img" />
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function PlayHome() {
  return (
    <div className={`mp-app hp ${playFonts}`}>
      <PlayHeader home />
      <Hero />

      <main className="hp-main">
        <Row title="Selección Hivrido" note="Curaduría">
          {SELECTION.map((t, i) => (
            <PosterCard key={t.id} item={t} rank={i + 1} />
          ))}
        </Row>

        <PersonalRows />

        <Row id="series" title="Series" note={String(SERIES.length).padStart(2, "0")}>
          {SERIES.map((t) => (
            <PosterCard key={t.id} item={t} />
          ))}
        </Row>

        {EDITORIAL && <Editorial t={EDITORIAL} />}

        <Row id="peliculas" title="Películas" note={String(PELICULAS.length).padStart(2, "0")}>
          {PELICULAS.map((t) => (
            <PosterCard key={t.id} item={t} />
          ))}
        </Row>

        {SHELVES.filter((s) => s.items.length > 2).map((s) => (
          <Row key={s.id} title={s.title}>
            {s.items.map((t) => (
              <PosterCard key={t.id} item={t} />
            ))}
          </Row>
        ))}

        <ComingSoon />
        <Genres />
      </main>

      <PlayFooter />
    </div>
  );
}
