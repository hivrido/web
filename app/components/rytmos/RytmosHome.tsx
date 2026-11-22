import type { Metadata } from "next";
import Link from "next/link";
import RytmosHeader from "./RytmosHeader";
import Cuenta from "./Cuenta";
import Loop from "./Loop";
import Trailer, { VerTrailer } from "./Trailer";
import Elenco from "./Elenco";
import Galeria from "./Galeria";
import BandaSonora from "./BandaSonora";
import { AnclasViejas, LinkFicha, SCRIPT_ANCLAS } from "./Acciones";
import { Cabecera, Foto } from "./piezas";
import Row from "../play/Row";
import PosterCard from "../play/PosterCard";
import { FinTransicion, VIAJA } from "../play/transicion";
import { playFonts } from "../play/fonts";
import LogoAnimated from "../ui/LogoAnimated";
import WaGeneral from "../ui/WaGeneral";
import WhatsAppBtn from "../ui/WhatsAppBtn";
import HMark from "../immersive/HMark";
import Hive from "../immersive/Hive";
import { SELECTION, UPCOMING } from "../../lib/catalog";
import { RYTMOS, RYTMOS_FICHA, avisameRytmos, estadoRytmos, lineaTemporada, tieneFicha } from "../../lib/rytmos";
import { MAS_RUTAS, PUERTAS } from "../../lib/mapa";
import { INSTAGRAM, MAIL, mail, whatsapp } from "../../lib/contacto";
import { JsonLd, SITE, migas, organizacionPlay, sitioWeb } from "../../lib/schema";
import "../play/play.css";
import "./rytmos.css";

/* ── HOME DE RYTMOS ─────────────────────────────────────────────────────────
   La raíz del dominio cuando app/lib/portada.ts dice "rytmos". Todo lo de la
   serie sale de app/lib/rytmos.ts: cada bloque aparece solo si tiene
   contenido real. Lo que la home muestra siempre es lo que no depende de la
   ficha —el nombre, el estado, "Avisame", el catálogo y el mapa del sitio—.

   El buscador de Google conoce "Rytmos" como un videojuego: título,
   descripción y datos estructurados dicen siempre "serie" y "Hivrido PLAY". */

const S = RYTMOS;
const TITLE = `${S.nombre} — La nueva serie de Hivrido PLAY`;
const DESCRIPTION = S.sinopsisCorta
  ? `${S.sinopsisCorta} ${S.nombre}, la nueva serie de Hivrido PLAY.`
  : `${S.nombre} es la nueva serie de Hivrido PLAY. Enterate primero del estreno y explorá el catálogo de series y películas argentinas de Hivrido.`;
/* Sin pieza propia todavía, la tarjeta tipográfica de RYTMOS. Al cargar el
   key art, scripts/build-rytmos-images.mjs genera la definitiva. */
const SHARE = S.share ?? "/images/share/rytmos-portada.jpg";

export const rytmosMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Hivrido PLAY",
  category: "entertainment",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/`,
    siteName: "Hivrido PLAY",
    images: [{ url: SHARE, type: "image/jpeg", width: 1200, height: 630, alt: `${S.nombre}, la nueva serie de Hivrido PLAY` }],
    locale: "es_AR",
    type: "video.tv_show",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [SHARE] },
};

/** Schema.org: la serie con solo los datos cargados, la organización y las migas. */
function jsonLd() {
  const fichaIndexable = !!S.sinopsisCorta;
  const url = `${SITE}${fichaIndexable ? RYTMOS_FICHA : "/"}`;
  const personas = (re: RegExp) =>
    S.creditos.filter((c) => re.test(c.rol)).map((c) => ({ "@type": "Person", name: c.nombre }));
  const directores = personas(/direcci/i);
  const creadores = personas(/creaci|cread/i);
  const t = S.trailer;
  const imagen = S.keyArt ? `${SITE}${S.keyArt.src}-1600.webp` : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizacionPlay,
      sitioWeb,
      {
        "@type": "TVSeries",
        "@id": `${SITE}/#rytmos`,
        name: S.nombre,
        alternateName: `${S.nombre} (serie)`,
        url,
        productionCompany: { "@id": organizacionPlay["@id"] },
        ...(S.sinopsisLarga || S.sinopsisCorta ? { description: S.sinopsisLarga ?? S.sinopsisCorta } : {}),
        ...(S.genero.length ? { genre: S.genero } : {}),
        ...(S.temporada ? { numberOfSeasons: S.temporada } : {}),
        ...(S.episodios ? { numberOfEpisodes: S.episodios } : {}),
        ...(S.estreno ? { datePublished: S.estreno.slice(0, 10) } : {}),
        ...(S.clasificacion ? { contentRating: S.clasificacion } : {}),
        ...(imagen ? { image: imagen } : {}),
        ...(directores.length ? { director: directores } : {}),
        ...(creadores.length ? { creator: creadores } : {}),
        ...(S.elenco.length ? { actor: S.elenco.map((p) => ({ "@type": "Person", name: p.nombre })) } : {}),
        ...(t
          ? {
              trailer: {
                "@type": "VideoObject",
                name: `Tráiler de ${S.nombre}`,
                description: S.sinopsisCorta ?? `Tráiler de ${S.nombre}, serie de Hivrido PLAY.`,
                ...("ytId" in t
                  ? {
                      thumbnailUrl: `https://i.ytimg.com/vi/${t.ytId}/hqdefault.jpg`,
                      embedUrl: `https://www.youtube-nocookie.com/embed/${t.ytId}`,
                      contentUrl: `https://www.youtube.com/watch?v=${t.ytId}`,
                    }
                  : { contentUrl: `${SITE}${t.src}`, ...(imagen ? { thumbnailUrl: imagen } : {}) }),
                ...(S.estreno ? { uploadDate: S.estreno.slice(0, 10) } : {}),
              },
            }
          : {}),
      },
      migas([["Hivrido", "/"], ...(fichaIndexable ? [["Hivrido PLAY", "/play/"], [S.nombre, RYTMOS_FICHA]] as [string, string][] : [])]),
    ],
  };
}

/* ── HERO ── */
function Hero() {
  const estado = estadoRytmos();
  const proximamente = estado === "Próximamente";
  const linea = lineaTemporada();
  const poster = S.keyArt ? `${S.keyArt.src}-1600.webp` : undefined;
  const avisame = (
    <a
      className={`hp-btn ${S.trailer ? "is-ghost" : "is-primary hp-haz"}`}
      href={whatsapp(avisameRytmos("desde la portada"))}
      target="_blank"
      rel="noopener noreferrer"
      data-wa-origen="avisame"
      data-medir="avisame_click"
      data-medir-titulo={S.nombre}
      data-medir-origen="hero"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
      Avisame
    </a>
  );

  return (
    <section className={`ry-hero${S.keyArt ? "" : " is-bare"}`} aria-label={`${S.nombre}, la nueva serie de Hivrido PLAY`}>
      <div className="ry-hero-bg" aria-hidden="true">
        {S.keyArt ? (
          <Foto img={{ ...S.keyArt, alt: "" }} sizes="100vw" className="ry-hero-art" prioridad />
        ) : (
          <div className="ry-stage">
            <span className="ry-beam is-a" />
            <span className="ry-beam is-b" />
          </div>
        )}
        {S.loop && <Loop src={S.loop} poster={poster} />}
      </div>
      <div className="ry-hero-shade" aria-hidden="true" />

      <div className="ry-hero-content">
        <p className="hp-kicker"><span className="hp-kicker-dot" />Hivrido PLAY · Nueva serie</p>
        {/* Lo que viaja a la ficha (transicion.tsx) es el nombre, no el
            horizonte que lo acompaña. */}
        <h1 className="ry-logo">
          {S.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo vectorial o PNG ya dimensionado
            <img className="ry-logo-img" style={VIAJA} src={S.logo.src} width={S.logo.ancho} height={S.logo.alto} alt={S.nombre} fetchPriority="high" />
          ) : (
            <>
              <span className="hp-sr">{S.nombre}</span>
              {/* Solo letras adentro: el compás de la entrada va por nth-child. */}
              <span className="ry-logo-word" style={VIAJA} aria-hidden="true">
                {[...S.nombre].map((l, i) => (
                  <span key={i} className="ry-logo-l">{l}</span>
                ))}
              </span>
            </>
          )}
          {!S.keyArt && <span className="ry-horizon" aria-hidden="true" />}
        </h1>
        <div className="ry-hero-meta">
          <span className={`hp-badge ${proximamente ? "is-gold" : "is-accent"}`}>{estado}</span>
          {S.clasificacion && <span className="hp-badge">{S.clasificacion}</span>}
          {linea && <span className="hp-meta">{linea}</span>}
          <LinkFicha href={RYTMOS_FICHA}>Ficha en PLAY</LinkFicha>
        </div>
        {S.tagline && <p className="ry-hero-tagline">{S.tagline}</p>}
        {S.estreno && proximamente && <Cuenta fecha={S.estreno} />}
        <div className="ry-hero-actions">
          {S.trailer && <VerTrailer />}
          {proximamente && avisame}
          <Link href="/play/" className="hp-btn is-ghost" data-medir="explorar_play" data-medir-origen="hero">
            Explorar Hivrido PLAY
          </Link>
        </div>
      </div>
      <span className="ry-scroll" aria-hidden="true" />
    </section>
  );
}

/* ── SECCIONES DE LA SERIE ── */
type Seccion = { id: string; ancla?: string; rotulo: string; titulo: string; cuerpo: React.ReactNode };

function seccionesDeLaSerie(): Seccion[] {
  const out: Seccion[] = [];
  const poster = S.keyArt ? `${S.keyArt.src}-1600.webp` : undefined;
  const linea = lineaTemporada();

  if (S.trailer) {
    out.push({ id: "trailer", ancla: "Tráiler", rotulo: "Tráiler", titulo: "El tráiler", cuerpo: <div className="ry-trailer ry-reveal"><Trailer serie={S} poster={poster} /></div> });
  }

  const ost: Seccion | null = S.bandaSonora.length
    ? {
        id: "banda-sonora",
        rotulo: "Música original",
        titulo: "Banda sonora",
        cuerpo: <div className={`ry-reveal${S.musicaProtagonista ? " ry-ost is-lead" : ""}`}><BandaSonora temas={S.bandaSonora} serie={S.nombre} /></div>,
      }
    : null;
  /* Si la serie gira alrededor de la música, la banda sonora sube justo
     después del tráiler. */
  if (ost && S.musicaProtagonista) out.push(ost);

  if (tieneFicha()) {
    const datos = [
      ...S.creditos.map((c) => [c.rol, c.nombre]),
      S.genero.length ? ["Género", S.genero.join(" · ")] : null,
      S.temporada ? ["Temporada", String(S.temporada)] : null,
      S.episodios ? ["Episodios", `${S.episodios}${S.duracionEpisodio ? ` · ${S.duracionEpisodio}` : ""}`] : null,
      S.clasificacion ? ["Clasificación", S.clasificacion] : null,
    ].filter((d): d is string[] => !!d);
    out.push({
      id: "la-serie",
      ancla: "La serie",
      rotulo: "La serie",
      titulo: "La serie",
      cuerpo: (
        <div className="ry-serie">
          {(S.sinopsisLarga || S.sinopsisCorta) && <p className="ry-lead ry-reveal">{S.sinopsisLarga ?? S.sinopsisCorta}</p>}
          {datos.length > 0 && (
            <dl className="ry-sheet ry-reveal">
              {datos.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}
        </div>
      ),
    });
  }

  if (S.elenco.length) {
    out.push({ id: "elenco", ancla: "Elenco", rotulo: "Personajes y elenco", titulo: "Elenco", cuerpo: <Elenco personas={S.elenco} /> });
  }

  if (S.listaEpisodios.length || linea) {
    out.push({
      id: "episodios",
      ancla: "Episodios",
      rotulo: "La temporada",
      titulo: S.temporada ? `Temporada ${S.temporada}` : "Episodios",
      cuerpo: S.listaEpisodios.length ? (
        <ol className="ry-eps ry-stagger">
          {S.listaEpisodios.map((e, i) => (
            <li key={e.titulo} className="ry-ep" style={{ "--i": i } as React.CSSProperties}>
              <span className="ry-ep-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="ry-ep-t">{e.titulo}</h3>
                {e.descripcion && <p className="ry-ep-d">{e.descripcion}</p>}
              </div>
              {e.duracion && <span className="ry-ep-dur">{e.duracion}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <p className="ry-season-line ry-reveal">{linea}</p>
      ),
    });
  }

  if (S.galeria.length) {
    out.push({ id: "detras-de-escena", rotulo: "Detrás de escena", titulo: "Detrás de escena", cuerpo: <Galeria fotos={S.galeria} /> });
  }

  if (ost && !S.musicaProtagonista) out.push(ost);

  if (S.prensa.length) {
    out.push({
      id: "prensa",
      rotulo: "Prensa y premios",
      titulo: "Prensa y premios",
      cuerpo: (
        <ul className="ry-press ry-stagger">
          {S.prensa.map((m, i) => (
            <li key={`${m.tipo}-${m.nombre}`} style={{ "--i": i } as React.CSSProperties}>
              <p className="ry-press-type">{m.tipo === "premio" ? "Premio" : m.tipo === "festival" ? "Festival" : "Prensa"}</p>
              <p className="ry-press-name">{m.url ? <a href={m.url} target="_blank" rel="noopener noreferrer">{m.nombre}</a> : m.nombre}</p>
              {m.detalle && <p className="ry-press-det">{m.detalle}</p>}
            </li>
          ))}
        </ul>
      ),
    });
  }

  return out;
}

/* ── SEGUÍ EN PLAY ── */
function SeguiEnPlay({ n }: { n: number }) {
  /* RYTMOS ya es el hero: en la fila de Próximamente sería repetirla. */
  const proximas = UPCOMING.filter((t) => t.id !== S.id);
  return (
    <section className="ry-sec ry-play" id="play" aria-label="Seguí en Hivrido PLAY">
      <Cabecera n={n} rotulo="Hivrido PLAY" titulo="Seguí en Hivrido PLAY" />
      <div className="ry-play-rows">
        <Row title="Selección Hivrido" note="Curaduría">
          {SELECTION.map((t, i) => (
            <PosterCard key={t.id} item={t} rank={i + 1} />
          ))}
        </Row>
        {proximas.length > 0 && (
          <Row title="Próximamente" note={`${String(proximas.length).padStart(2, "0")} en camino`}>
            {proximas.map((t) => (
              <PosterCard key={t.id} item={t} />
            ))}
          </Row>
        )}
      </div>
      <div className="ry-play-cta">
        <Link href="/play/" className="hp-btn is-ghost" data-medir="explorar_play" data-medir-origen="segui_en_play">
          Ver todo el catálogo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </section>
  );
}

/* ── TODO HIVRIDO ── */
function Hub({ n }: { n: number }) {
  return (
    <section className="ry-sec ry-hub" id="todo-hivrido" aria-label="Todo Hivrido sale de acá">
      <Hive className="ry-hub-bg" />
      <div className="ry-hub-top">
        <Cabecera n={n} rotulo="Todo Hivrido" titulo="Todo Hivrido sale de acá" />
        <HMark className="ry-hub-mark" />
      </div>
      <ul className="ry-hub-grid">
        {PUERTAS.map((p, i) =>
          p.href ? (
            <li key={p.n} className="ry-door" style={{ "--i": i } as React.CSSProperties}>
              <span className="ry-door-n">{p.n}</span>
              <svg className="ry-door-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              <Link href={p.href} className="ry-door-label ry-door-link" data-medir="hub_click" data-medir-destino={p.label}>
                {p.label}
              </Link>
              <span className="ry-door-sub">{p.bajada}</span>
            </li>
          ) : (
            <li key={p.n} className="ry-door is-contact" style={{ "--i": i } as React.CSSProperties}>
              <span className="ry-door-n">{p.n}</span>
              <p className="ry-door-label">{p.label}</p>
              <div className="ry-door-contact">
                <a href={whatsapp("Hola Hivrido! Les escribo desde la portada (Todo Hivrido).")} target="_blank" rel="noopener noreferrer" data-wa-origen="hub" data-medir="hub_click" data-medir-destino="WhatsApp">
                  WhatsApp<span className="ry-door-tel"> +54 9 11 5607-2460</span>
                </a>
                <a href={mail("Consulta desde hivrido.com")} data-medir="hub_click" data-medir-destino="Mail">{MAIL}</a>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}

/* ── PIE ── */
function Pie() {
  return (
    <footer className="hp-footer ry-footer">
      <div className="hp-footer-brand">
        <div className="hp-logo hp-footer-mark">
          <Link href="/" aria-label="Hivrido, inicio" className="hp-logo-mark">
            <LogoAnimated height={26} startOnView />
          </Link>
          <Link href="/play/" className="hp-logo-pill" aria-label="Hivrido PLAY, catálogo">Play</Link>
        </div>
        <p>Cine y series hechos en Argentina.</p>
      </div>
      <nav className="hp-footer-cols" aria-label="Mapa del sitio">
        <div>
          <span className="hp-footer-label">Hivrido PLAY</span>
          <Link href="/play/">Catálogo</Link>
          <Link href={RYTMOS_FICHA}>{S.nombre}</Link>
          <Link href="/play/#series">Series</Link>
          <Link href="/play/#peliculas">Películas</Link>
          <Link href="/play/#proximamente">Próximamente</Link>
        </div>
        <div>
          <span className="hp-footer-label">Hivrido</span>
          {PUERTAS.filter((p) => p.href && p.href !== "/play/").map((p) => (
            <Link key={p.n} href={p.href!}>{p.label}</Link>
          ))}
          {MAS_RUTAS.map((r) => (
            <Link key={r.href} href={r.href}>{r.label}</Link>
          ))}
        </div>
        <div>
          <span className="hp-footer-label">Contacto</span>
          <WaGeneral lugar="el pie">WhatsApp</WaGeneral>
          <a href={mail("Consulta desde hivrido.com")}>{MAIL}</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </nav>
      <p className="hp-footer-legal">© 2026 Hivrido · Hivrido PLAY</p>
    </footer>
  );
}

export default function RytmosHome() {
  const serie = seccionesDeLaSerie();
  const anclas = serie.filter((s) => s.ancla).map((s) => ({ label: s.ancla!, href: `/#${s.id}` }));
  const menu = PUERTAS.filter((p) => p.href).map((p) => ({ label: p.label, href: p.href! }));

  return (
    <div className={`mp-app hp ry ${playFonts}`}>
      {/* Antes que nada: /#series y compañía van al catálogo. */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANCLAS }} />
      {S.keyArt && (
        <link rel="preload" as="image" type="image/avif" imageSrcSet={`${S.keyArt.src}-640.avif 640w, ${S.keyArt.src}-1080.avif 1080w, ${S.keyArt.src}-1600.avif 1600w, ${S.keyArt.src}-2400.avif 2400w`} imageSizes="100vw" fetchPriority="high" />
      )}
      <JsonLd data={jsonLd()} />
      <AnclasViejas />
      <FinTransicion />
      <RytmosHeader anclas={anclas} menu={menu} nombre={S.nombre} />

      <main className="ry-main">
        <Hero />
        {serie.map((s, i) => (
          <section key={s.id} id={s.id} className="ry-sec" aria-label={s.titulo}>
            <Cabecera n={i + 1} rotulo={s.rotulo} titulo={s.titulo} />
            {s.cuerpo}
          </section>
        ))}
        <SeguiEnPlay n={serie.length + 1} />
        <Hub n={serie.length + 2} />
      </main>

      <Pie />
      <WhatsAppBtn />
    </div>
  );
}
