import type { Metadata } from "next";
import Link from "next/link";
import RytmosHeader from "./RytmosHeader";
import Cuenta from "./Cuenta";
import Loop from "./Loop";
import Precarga from "./Precarga";
import LogoRytmos from "./LogoRytmos";
import Afiche3D from "../ui/Afiche3D";
import Equipo from "../ui/Equipo";
import { ARTE } from "../../casting/contenido";
import Trailer, { VerTrailer } from "./Trailer";
import Elenco from "./Elenco";
import Galeria from "./Galeria";
import BandaSonora from "./BandaSonora";
import { AnclasViejas } from "./Acciones";
import { SCRIPT_ANCLAS, SCRIPT_PRECARGA } from "./scripts";
import { Cabecera, Foto } from "./piezas";
import { FinTransicion } from "../play/transicion";
import { VIAJA } from "../play/viaja";
import { playFonts } from "../play/fonts";
import LogoAnimated from "../ui/LogoAnimated";
import WaGeneral from "../ui/WaGeneral";
import HMark from "../immersive/HMark";
import Hive from "../immersive/Hive";
import { RYTMOS, RYTMOS_FICHA, avisameRytmos, castingAbierto, estadoRytmos, lineaTemporada, srcsetDe, tieneFicha } from "../../lib/rytmos";
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
const SHARE = S.share ?? "/images/share/rytmos-portada-v2.jpg";

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
  const casting = castingAbierto();
  const poster = S.keyArt ? `${S.keyArt.src}-1600.webp` : undefined;
  const campana = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>;
  /* Con el casting abierto, el llamado principal lleva al casting. */
  const irAlCasting = casting && (
    <Link href={casting.href} className="hp-btn is-primary hp-haz" data-medir="casting_click" data-medir-origen="hero">
      {campana}
      Ir al casting
    </Link>
  );
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
      {campana}
      Avisame
    </a>
  );

  return (
    <section className={`ry-hero${S.keyArt ? "" : " is-bare"}`} aria-label={`${S.nombre}, la nueva serie de Hivrido PLAY`}>
      <div className="ry-hero-bg" aria-hidden="true">
        {S.keyArt ? (
          <Foto img={{ ...S.keyArt, alt: "" }} movil={S.keyArtVertical} sizes="100vw" className="ry-hero-art" prioridad />
        ) : (
          <div className="ry-stage">
            {/* Cada sección tiene su fondo (rytmos.css, "FONDOS"). El del
                hero: la colmena 3D de la casa (WebGL que arranca cuando el
                navegador queda libre), una aurora que deriva y dos conos de
                luz que se balancean. */}
            <span className="ry-aurora" />
            <Hive className="ry-hero-hive" />
            <span className="ry-beam is-a" />
            <span className="ry-beam is-b" />
          </div>
        )}
        {S.loop && <Loop src={S.loop} poster={poster} />}
      </div>
      <div className="ry-hero-shade" aria-hidden="true" />

      <div className={`ry-hero-inner${casting ? " has-afiche" : ""}`}>
      <div className="ry-hero-content">
        <p className="hp-kicker"><span className="hp-kicker-dot" />Hivrido PLAY · Nueva serie</p>
        {/* Lo que viaja a la ficha (transicion.tsx) es el nombre, no el
            horizonte que lo acompaña. */}
        <h1 className="ry-logo">
          {S.logo ? (
            <>
              <span className="hp-sr">{S.nombre}</span>
              <LogoRytmos />
            </>
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
        </div>
        {S.tagline && <p className="ry-hero-tagline">{S.tagline}</p>}
        {/* El contador va al casting mientras esté abierto; después, al
            estreno si hay fecha. */}
        {casting ? (
          <Cuenta fecha={casting.fecha} titulo={casting.titulo} detalle={casting.detalle} fin="El casting empezó" href={casting.href} enlace={casting.lugar} />
        ) : (
          S.estreno && proximamente && <Cuenta fecha={S.estreno} titulo="Estreno" detalle={`${S.estreno.slice(8, 10)}/${S.estreno.slice(5, 7)}`} fin="Ya está en PLAY" href={RYTMOS_FICHA} enlace="Ver la ficha" />
        )}
        <div className="ry-hero-actions">
          {S.trailer && <VerTrailer />}
          {irAlCasting || (proximamente && avisame)}
        </div>
      </div>
      {/* El afiche del casting, en 3D: a la derecha en escritorio, debajo de
          los llamados en el teléfono. */}
      {casting && (
        <Afiche3D
          className="ry-hero-afiche"
          src400={ARTE.poster400}
          src800={ARTE.poster800}
          alt={ARTE.alt}
          sizes="(min-width: 1024px) 340px, min(78vw, 340px)"
          href={casting.href}
          prioridad
        />
      )}
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

/* ── EQUIPO ── */
function SeccionEquipo({ n }: { n: number }) {
  return (
    <section className="ry-sec ry-fondo-grilla" id="equipo" aria-label="Equipo">
      <span className="ry-capa" aria-hidden="true">
        <span className="ry-horizonte" />
        <span className="ry-grilla" />
      </span>
      <Cabecera n={n} rotulo="Casting" titulo="El equipo" />
      <Equipo className="ry-reveal" />
    </section>
  );
}

/* ── TODO HIVRIDO ── */
function Hub({ n }: { n: number }) {
  return (
    <section className="ry-sec ry-hub" id="todo-hivrido" aria-label="Hivrido sale de acá">
      <span className="ry-capa" aria-hidden="true">
        <span className="ry-halo" />
        <span className="ry-escaneo" />
      </span>
      <div className="ry-hub-top">
        <Cabecera n={n} rotulo="Hivrido" titulo="Hivrido sale de acá" />
        <HMark className="ry-hub-mark" />
      </div>
      <ul className="ry-hub-grid">
        {PUERTAS.map((p, i) =>
          p.href ? (
            <li key={p.n} className="ry-door relieve luz-borde" style={{ "--i": i, "--luz-delay": `${-i * 0.37}s` } as React.CSSProperties}>
              <span className="ry-door-n">{p.n}</span>
              <svg className="ry-door-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              <Link href={p.href} className="ry-door-label ry-door-link" data-medir="hub_click" data-medir-destino={p.label}>
                {p.label}
              </Link>
              <span className="ry-door-sub">{p.bajada}</span>
            </li>
          ) : (
            <li key={p.n} className="ry-door is-contact relieve luz-borde" style={{ "--i": i, "--luz-delay": `${-i * 0.37}s` } as React.CSSProperties}>
              <span className="ry-door-n">{p.n}</span>
              <p className="ry-door-label">{p.label}</p>
              <div className="ry-door-contact">
                <a href={whatsapp("Hola Hivrido! Les escribo desde la portada (Hivrido sale de acá).")} target="_blank" rel="noopener noreferrer" data-wa-origen="hub" data-medir="hub_click" data-medir-destino="WhatsApp">
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
      {/* Antes que nada: /#series y compañía van al catálogo, y la entrada
          del hero espera a que se levante la cortina. */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANCLAS + SCRIPT_PRECARGA }} />
      <Precarga />
      {/* El key art es el LCP: se pide junto con el HTML, la variante que
          corresponde a cada pantalla. */}
      {S.keyArt && (
        <link rel="preload" as="image" type="image/avif" imageSrcSet={srcsetDe(S.keyArt.src, "avif", S.keyArt.ancho)} imageSizes="100vw" fetchPriority="high" media={S.keyArtVertical ? "(min-width: 769px)" : undefined} />
      )}
      {S.keyArtVertical && (
        <link rel="preload" as="image" type="image/avif" imageSrcSet={srcsetDe(S.keyArtVertical.src, "avif", S.keyArtVertical.ancho)} imageSizes="100vw" fetchPriority="high" media="(max-width: 768px)" />
      )}
      <JsonLd data={jsonLd()} />
      <AnclasViejas />
      <FinTransicion />
      <RytmosHeader anclas={anclas} menu={menu} nombre={S.nombre} casting={castingAbierto()?.href} />

      <main className="ry-main">
        <Hero />
        {serie.map((s, i) => (
          <section key={s.id} id={s.id} className="ry-sec" aria-label={s.titulo}>
            <Cabecera n={i + 1} rotulo={s.rotulo} titulo={s.titulo} />
            {s.cuerpo}
          </section>
        ))}
        {S.equipo.length > 0 && <SeccionEquipo n={serie.length + 1} />}
        <Hub n={serie.length + (S.equipo.length > 0 ? 2 : 1)} />
      </main>

      <Pie />
    </div>
  );
}
