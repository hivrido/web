import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientShell from "../../components/layout/ClientShell";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  ARTISTAS,
  getArtista,
  vecinosDe,
  type Artista,
} from "../../lib/artistas";
import RedIcono, { NOMBRE_RED } from "../RedIcono";
import PlayerLite from "../PlayerLite";
import "../artistas.css";

/**
 * Ficha de artista.
 *
 * Es la página que el artista pega en la bio de Instagram y la que aparece
 * cuando alguien lo googlea, así que tiene dos trabajos a la vez: convencer a
 * una persona en diez segundos y darle a un buscador algo que indexar. De ahí
 * el `sameAs` del schema —es lo que ata las cuentas sueltas a una entidad
 * única— y de ahí que el nombre vaya a escala de afiche.
 *
 * El recorrido es el de un dossier, no el de una landing: quién es, por qué
 * existe el proyecto, qué publicó, dónde vive y cómo se lo contrata.
 */

const WA_BASE = "https://api.whatsapp.com/send?phone=5491156072460&text=";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTISTAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtista(slug);
  if (!a) return {};

  const titulo = `${a.nombre} (${a.alias}) | Artista Hivrido`;
  const desc = `${a.tagline} ${a.disciplinas.join(", ")}. Ficha oficial de ${a.nombre} en Hivrido.`;

  return {
    title: titulo,
    description: desc,
    keywords: [a.nombre, a.alias, ...a.disciplinas, "artista argentino", "Hivrido"],
    alternates: { canonical: `/artistas/${a.slug}` },
    openGraph: {
      title: titulo,
      description: desc,
      url: `https://hivrido.com/artistas/${a.slug}`,
      siteName: "Hivrido",
      locale: "es_AR",
      type: "profile",
    },
  };
}

/**
 * Entidad única que junta las cuentas dispersas bajo un mismo nombre.
 *
 * El tipo lo trae el dato: un proyecto musical es `MusicGroup` y admite
 * `genre`; una creadora de contenido es `Person`, donde ese campo no existe y
 * lo que corresponde es qué hace y de qué sabe. Emitir una banda donde hay
 * una persona no es un detalle de formato: es enseñarle a Google algo que no
 * es cierto sobre alguien.
 */
function jsonLd(a: Artista) {
  const base = {
    "@context": "https://schema.org",
    "@type": a.schema,
    name: a.nombre,
    alternateName: a.alias,
    url: `https://hivrido.com/artistas/${a.slug}`,
    description: a.tagline,
    sameAs: a.enlaces.map((e) => e.href),
  };

  return a.schema === "MusicGroup"
    ? { ...base, genre: a.disciplinas }
    : { ...base, ...(a.rol && { jobTitle: a.rol }), knowsAbout: a.disciplinas };
}

export default async function FichaArtistaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArtista(slug);
  if (!a) notFound();

  /* El destacado es el que abre el módulo con reproductor, así que solo
     califica si tiene video embebible. Sin ese filtro, un artista sin YouTube
     —el caso de quien publica en reels— ascendía su primera pieza a un hero
     que no se dibuja y la perdía de la grilla: quedaba fuera de la página
     sin que nada lo avisara. */
  const destacado =
    a.lanzamientos.find((l) => l.id === a.destacado && l.ytId) ??
    a.lanzamientos.find((l) => l.ytId);
  const resto = a.lanzamientos.filter((l) => l.id !== destacado?.id);

  const vecinos = vecinosDe(a);

  const waArtista =
    WA_BASE + encodeURIComponent(`Hola Hivrido! Quiero contratar a ${a.nombre}.`);

  /* El nombre se parte para que la dosis baje al segundo renglón con el peso
     del prospecto: "AMPLAX" arriba, "10 MG" abajo. Si un artista no tiene esa
     estructura en el nombre, el split devuelve todo en la primera parte y el
     segundo renglón no se dibuja. */
  const [principal, ...dosis] = a.nombre.split(/\s+(?=\d)/);

  return (
    <ClientShell>
      <Header base="/" logoDelay={300} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(a)) }}
      />

      <main
        className="art-page"
        style={
          {
            "--art-acento": a.acento.hex,
            "--art-acento-suave": a.acento.suave,
          } as React.CSSProperties
        }
      >
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="art-hero">
          <div className="art-wrap">
            <div className="art-hero-grid">
              <div>
                <p className="art-hero-alias">
                  <Link href="/artistas">Roster Hivrido</Link> · {a.alias}
                </p>

                <h1 className="art-hero-nombre">
                  {principal}
                  {dosis.length > 0 && (
                    <span className="art-hero-dosis">{dosis.join(" ")}</span>
                  )}
                </h1>

                <p className="art-hero-tagline">{a.tagline}</p>

                <ul className="art-hero-disciplinas">
                  {a.disciplinas.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                <div className="art-hero-actions">
                  <a
                    className="art-btn"
                    href={waArtista}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contratar
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  {destacado?.ytId && (
                    <a className="art-link" href="#lanzamientos">
                      Ver {destacado.titulo}
                    </a>
                  )}
                </div>
              </div>

              {/* El emblema del artista. Decorativo: el lector de pantalla no
                  lo anuncia porque no dice nada que el texto no diga mejor.
                  La figura la elige el dato y la leyenda entra por variable,
                  así un artista nuevo trae la suya sin tocar el CSS. */}
              <div
                className={`art-emblema art-emblema--${a.emblema.forma}`}
                style={
                  {
                    "--art-leyenda": `"${a.emblema.leyenda}"`,
                  } as React.CSSProperties
                }
                aria-hidden
              />
            </div>
          </div>
        </section>

        {/* ── Manifiesto ───────────────────────────────────────────────── */}
        <section className="art-section">
          <div className="art-wrap">
            <p className="art-eyebrow">El proyecto</p>
            <h2 className="art-h2">Qué es esto</h2>
            <div className="art-manifiesto">
              {a.manifiesto.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ejes ─────────────────────────────────────────────────────── */}
        <section className="art-section">
          <div className="art-wrap">
            <p className="art-eyebrow">Dirección</p>
            <h2 className="art-h2">Las reglas del universo</h2>

            <div className="art-ejes">
              {a.ejes.map((eje, i) => (
                <article className="art-eje" key={eje.titulo}>
                  <span className="art-eje-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{eje.titulo}</h3>
                  <p>{eje.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lanzamientos ─────────────────────────────────────────────── */}
        <section className="art-section" id="lanzamientos">
          <div className="art-wrap">
            <p className="art-eyebrow">{a.obra?.eyebrow ?? "Obra"}</p>
            <h2 className="art-h2">{a.obra?.titulo ?? "Lanzamientos"}</h2>

            {destacado?.ytId && (
              <>
                <PlayerLite ytId={destacado.ytId} titulo={destacado.titulo} />
                <div className="art-lanz-meta">
                  <h3 className="art-lanz-titulo">{destacado.titulo}</h3>
                  <span className="art-lanz-credito">
                    {destacado.tipo}
                    {destacado.con && ` · con ${destacado.con}`}
                    {destacado.year && ` · ${destacado.year}`}
                  </span>
                </div>
              </>
            )}

            {resto.length > 0 && (
              <div
                className="art-ejes"
                style={{ marginTop: destacado ? 40 : 8 }}
              >
                {resto.map((l) => (
                  <article className="art-eje" key={l.id}>
                    <span className="art-eje-num">
                      {l.tipo}
                      {l.year && ` · ${l.year}`}
                    </span>
                    <h3>{l.titulo}</h3>
                    {l.con && <p>con {l.con}</p>}
                    {/* La cifra pública de la pieza, en el peso de una
                        métrica y no en el de un pie de foto. */}
                    {l.dato && <p className="art-eje-dato">{l.dato}</p>}
                  </article>
                ))}
              </div>
            )}

            {/* No se inventan fichas para rellenar la grilla: si no hay más
                material publicado, la página lo dice y queda como promesa. */}
            {a.enConstruccion && (
              <div className="art-vacio">
                <h3>En producción</h3>
                <p>{a.enConstruccion}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── El mismo universo ────────────────────────────────────────── */}
        {vecinos.length > 0 && (
          <section className="art-section">
            <div className="art-wrap">
              <p className="art-eyebrow">En el mismo universo</p>
              <h2 className="art-h2">La escena</h2>

              <div className="art-universo">
                {vecinos.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/artistas/${v.slug}`}
                    className="art-vecino"
                    /* El acento es el del destino, no el de esta ficha: el
                       color es lo que anuncia que el click lleva a otro
                       lado antes de que se lea el nombre. */
                    style={
                      {
                        "--art-acento": v.acento.hex,
                        "--art-acento-suave": v.acento.suave,
                      } as React.CSSProperties
                    }
                  >
                    <span className="art-vecino-texto">
                      <span className="art-vecino-alias">{v.alias}</span>
                      <span className="art-vecino-nombre">{v.nombre}</span>
                    </span>
                    <svg className="art-vecino-flecha" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Datos y plataformas ──────────────────────────────────────── */}
        <section className="art-section">
          <div className="art-wrap">
            <p className="art-eyebrow">Audiencia</p>
            <h2 className="art-h2">Dónde está y dónde vive</h2>

            <div className="art-datos">
              <ul className="art-metricas">
                {a.metricas.map((m) => (
                  <li className="art-metrica" key={m.label}>
                    <b>{m.valor}</b>
                    <span>{m.label}</span>
                    <small>{m.fuente}</small>
                  </li>
                ))}
              </ul>

              <ul className="art-enlaces">
                {a.enlaces.map((e) => (
                  <li key={e.href}>
                    <a
                      className="art-enlace"
                      href={e.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="art-enlace-icono">
                        <RedIcono tipo={e.tipo} />
                      </span>
                      <span className="art-enlace-texto">
                        <b>{e.handle}</b>
                        <span>{NOMBRE_RED[e.tipo]}</span>
                      </span>
                      <svg className="art-enlace-flecha" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="art-section">
          <div className="art-wrap">
            <div className="art-cta">
              <h2>¿Lo querés en tu marca?</h2>
              <p>
                {a.nombre} trabaja con Hivrido: campañas, colaboraciones,
                presencias y contenido de marca con producción propia de punta
                a punta. Contanos qué tenés en mente y te respondemos el mismo
                día.
              </p>
              <a
                className="art-btn"
                href={waArtista}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablar por WhatsApp
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ClientShell>
  );
}
