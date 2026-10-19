"use client";

/**
 * Ficha de una obra de PLAY: el reproductor fijo a la izquierda y todo lo
 * demás a la derecha —cabecera, sinopsis, episodios, videos, elenco—, así se
 * puede recorrer la ficha sin perder el video de vista. En pantallas angostas
 * se apila.
 *
 * La usan /play/<id> y /okupas, que además trae sus episodios. Elegir un
 * episodio o un video lo carga en el reproductor y lo arranca.
 */

import { useState } from "react";
import CinePlayer from "./CinePlayer";
import PosterCard, { Badges, ListIcon } from "./PosterCard";
import Row from "./Row";
import { useMyList } from "./library";
import type { Entry } from "../../lib/catalog";

export type Episode = {
  ytId: string;
  title: string;
  desc: string;
  thumb: string;
  /** YouTube no deja embeberlo: se abre allá. */
  noEmbed?: boolean;
  special?: boolean;
};

type Video = {
  ytId: string;
  label: string;
  title: string;
  poster?: string;
  zoom?: number;
  external?: boolean;
  /** Índice del episodio, si lo es. */
  ep?: number;
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const WA = "https://wa.me/5491156072460?text=";
const pad = (n: number) => String(n).padStart(2, "0");
const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* Primera y última palabra con mayúscula: "Rodrigo de la Serna" → RS. */
function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => /^\p{Lu}/u.test(w));
  const pick = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return pick.map((w) => w[0]).join("") || name[0];
}

/** Quien aparece en varios rubros del equipo va una sola vez, con todos. */
function people(t: Entry) {
  const crew = new Map<string, string[]>();
  for (const c of t.detail?.crew ?? []) {
    if (/productora|emisi/i.test(c.role)) continue;
    crew.set(c.name, [...(crew.get(c.name) ?? []), c.role]);
  }
  return [
    ...(t.detail?.cast ?? []).map((c) => ({ name: c.name, role: c.character ?? "Elenco" })),
    ...[...crew].map(([name, roles]) => ({ name, role: roles.join(" · ") })),
  ];
}

function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try { await navigator.share({ title: `${title} en Hivrido PLAY`, url }); } catch { /* cancelado */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* sin portapapeles */ }
  };
  return (
    <button type="button" className="hp-icon-btn is-lg" onClick={share} aria-label={copied ? "Link copiado" : "Compartir"}>
      {copied ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4l7 7-7 7M21 11H10a7 7 0 00-7 7v2" /></svg>
      )}
    </button>
  );
}

export default function TitleView({ t, episodes, related }: { t: Entry; episodes?: Episode[]; related: Entry[] }) {
  const d = t.detail;
  const { has, toggle } = useMyList();
  const saved = has(t.id);

  const kind = t.type === "serie" ? "Serie" : "Película";
  const about = t.isPlaceholder ? null : d?.about ?? t.synopsis;
  const cast = people(t);
  const upcoming = t.isPlaceholder || t.badge === "PRONTO";

  /* Lo que puede ir al reproductor: los episodios, o el video principal y
     los extras de la ficha. */
  const extras: Video[] = t.ytId
    ? [
        { ytId: t.ytId, label: t.ytFull ? "Película completa" : "Tráiler", title: t.title, poster: t.poster, zoom: t.ytZoom, external: t.ytExternal },
        ...(d?.videos ?? []).map((v) => ({ ytId: v.ytId, label: v.label, title: `${v.label} de ${t.title}`, zoom: v.zoom })),
      ]
    : [];
  const epVideos: Video[] = (episodes ?? []).map((e, i) => ({
    ytId: e.ytId, label: e.special ? "Especial" : `Episodio ${i + 1}`, title: `${t.title} · ${e.title}`,
    poster: e.thumb, external: e.noEmbed, ep: i,
  }));

  const first = epVideos[0] ?? extras[0];
  const [video, setVideo] = useState<Video | undefined>(first);
  /* El primero espera al play; elegir algo de la lista ya es pedirlo. */
  const [autoStart, setAutoStart] = useState(false);
  const [take, setTake] = useState(0);

  const play = (v: Video) => {
    setVideo(v);
    setAutoStart(true);
    setTake((n) => n + 1);
    if (window.matchMedia("(max-width: 1100px)").matches) {
      document.getElementById("reproductor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const meta = [d?.format ?? (t.type === "serie" && t.seasons ? `Serie · ${t.seasons}` : kind), t.year, t.duration !== "—" ? t.duration : undefined]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <>
      {/* Atmósfera: el afiche, muy desenfocado, tiñe la parte alta de la página. */}
      {t.poster && <div className="tv-ambient" style={{ backgroundImage: `url('${t.poster}')` }} aria-hidden="true" />}

      <div className="tv-grid">
        {/* ── REPRODUCTOR ── */}
        <div className="tv-stage" id="reproductor">
          <div className="tv-player" id="trailer">
            {!video ? (
              <div className="tv-player-empty" style={t.poster ? { backgroundImage: `url('${t.poster}')` } : undefined}>
                <span className={`hp-badge ${upcoming ? "is-gold" : "is-accent"}`}>{upcoming ? "Próximamente" : kind}</span>
              </div>
            ) : video.external ? (
              /* Con restricción de edad YouTube no deja embeberlo: el iframe
                 solo mostraría su aviso. Se muestra la portada y se abre allá. */
              <a
                href={`https://www.youtube.com/watch?v=${video.ytId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tv-player-ext"
                style={video.poster ? { backgroundImage: `url('${video.poster}')` } : undefined}
              >
                <span className="hp-btn is-primary hp-haz">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                  Ver en YouTube
                </span>
                <span className="tv-player-hint">Contenido +18: YouTube pide verificar la edad</span>
              </a>
            ) : (
              <CinePlayer
                key={`${video.ytId}-${take}`}
                ytId={video.ytId}
                title={video.title}
                poster={video.poster}
                zoom={video.zoom}
                label={video.ep !== undefined ? video.label : t.ytFull ? "Ver ahora" : "Ver tráiler"}
                autoStart={autoStart}
                trackId={video.ep === undefined && video.ytId === t.ytId ? t.id : undefined}
              />
            )}
          </div>
          {video && (
            <p className="tv-now">
              <span className="tv-now-bars" aria-hidden="true"><i /><i /><i /></span>
              {video.label}
              {video.ep !== undefined && episodes && <b>{episodes[video.ep].title}</b>}
            </p>
          )}
        </div>

        {/* ── FICHA ── */}
        <div className="tv-col">
          <section className="tv-card">
            {t.poster && <div className="tv-card-thumb" style={{ backgroundImage: `url('${t.poster}')` }} aria-hidden="true" />}
            <div className="tv-card-body">
              <h1 className="tv-title">{t.title}</h1>
              <p className="tv-meta">{t.genre}</p>
              <p className="tv-meta is-strong">
                {meta}
                <Badges item={t} hideNew />
              </p>
              <div className="tv-actions">
                {video && !video.external ? (
                  <button type="button" className="hp-btn is-primary hp-haz" onClick={() => play(video)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    {episodes ? "Ver ahora" : t.ytFull ? "Ver ahora" : "Ver tráiler"}
                  </button>
                ) : video?.external ? (
                  <a className="hp-btn is-primary hp-haz" href={`https://www.youtube.com/watch?v=${video.ytId}`} target="_blank" rel="noopener noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    Ver en YouTube
                  </a>
                ) : t.cta ? (
                  <a className="hp-btn is-primary hp-haz" href={t.cta.href}>{t.cta.label}</a>
                ) : (
                  <a
                    className="hp-btn is-primary hp-haz"
                    href={`${WA}${encodeURIComponent(`Hola Hivrido! Avisame cuando se estrene ${t.title} en PLAY`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Avisame cuando salga
                  </a>
                )}
                <button
                  type="button"
                  className="hp-icon-btn is-lg"
                  onClick={() => toggle(t.id)}
                  aria-pressed={saved}
                  aria-label={saved ? "Quitar de Mi lista" : "Agregar a Mi lista"}
                >
                  <ListIcon saved={saved} />
                </button>
                <Share title={t.title} />
              </div>
              {t.cta && video && (
                <a className="tv-cta-link" href={t.cta.href}>{t.cta.label} →</a>
              )}
            </div>
          </section>

          <p className="tv-about">
            {about ?? `${kind} en preparación. Muy pronto, toda la información acá.`}
          </p>
          {d?.advisory && (
            <p className="tv-advisory"><strong>Advertencia de contenido.</strong> {d.advisory}</p>
          )}

          {/* ── EPISODIOS ── */}
          {episodes && (
            <Row title="Episodios" note={pad(episodes.length)}>
              {episodes.map((e, i) => {
                const on = video?.ep === i;
                return (
                  <button key={e.ytId} type="button" className={`tv-ep${on ? " is-on" : ""}`} onClick={() => play(epVideos[i])} aria-current={on || undefined}>
                    <span className="tv-ep-thumb" style={{ backgroundImage: `url('${e.thumb}')` }}>
                      <span className="tv-ep-num">{e.special ? "Especial" : `E${pad(i + 1)}`}</span>
                      <span className="tv-ep-play" aria-hidden="true">
                        {on ? (
                          <span className="tv-now-bars"><i /><i /><i /></span>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        )}
                      </span>
                    </span>
                    <span className="tv-ep-title">{e.title}</span>
                    <span className="tv-ep-desc">{e.desc}</span>
                  </button>
                );
              })}
            </Row>
          )}

          {/* ── RELATOS ── */}
          {d?.chapters && (
            <section className="tv-section">
              <h2 className="tv-h2">Relatos <span>{pad(d.chapters.length)}</span></h2>
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

          {/* ── TRÁILERS Y EXTRAS ── */}
          {extras.length > 1 && (
            <Row title="Tráilers y extras" note={pad(extras.length)}>
              {extras.map((v) => {
                const on = video?.ytId === v.ytId;
                return (
                  <button key={v.ytId} type="button" className={`tv-extra${on ? " is-on" : ""}`} onClick={() => play(v)}>
                    <span className="tv-extra-thumb" style={{ backgroundImage: `url('${v.poster ?? ytThumb(v.ytId)}')` }} />
                    <span className="tv-extra-label">{v.label}</span>
                  </button>
                );
              })}
            </Row>
          )}

          {/* ── ELENCO Y EQUIPO ── */}
          {cast.length > 0 && (
            <Row title="Elenco y equipo">
              {cast.map((p, i) => (
                <div key={`${p.name}-${i}`} className="tv-person">
                  <span className="tv-avatar" aria-hidden="true">
                    {initials(p.name)}
                  </span>
                  <span className="tv-person-name">{p.name}</span>
                  <span className="tv-person-role">{p.role}</span>
                </div>
              ))}
            </Row>
          )}

          {/* ── PREMIOS ── */}
          {d?.awards && (
            <section className="tv-section">
              <h2 className="tv-h2">Premios y festivales <span>{pad(d.awards.length)}</span></h2>
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

          {/* ── FICHA TÉCNICA ── */}
          <section className="tv-section">
            <h2 className="tv-h2">Ficha técnica</h2>
            <dl className="tp-sheet">
              {(d?.crew ?? []).map((c) => (
                <div key={c.role}>
                  <dt>{c.role}</dt>
                  <dd>{c.name}</dd>
                </div>
              ))}
              {t.year && (
                <div><dt>Año</dt><dd>{t.year}</dd></div>
              )}
              <div><dt>Género</dt><dd>{t.genre}</dd></div>
              <div><dt>País · Idioma</dt><dd>Argentina · Español</dd></div>
            </dl>
          </section>
        </div>
      </div>

      {/* ── MÁS PARA VER ── */}
      {related.length > 0 && (
        <div className="tv-more">
          <Row title="Más para ver">
            {related.map((r) => (
              <PosterCard key={r.id} item={r} />
            ))}
          </Row>
        </div>
      )}
    </>
  );
}
