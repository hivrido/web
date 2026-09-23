import type { Metadata } from "next";
import Link from "next/link";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ARTISTAS } from "../lib/artistas";
import FondoVivo from "./FondoVivo";
import "./artistas.css";

/**
 * Índice del roster.
 *
 * El índice no es una lista de nombres: existe para decir qué hace Hivrido
 * con una carrera, y los artistas son la prueba de que lo hace. Una ficha
 * suelta colgando de un menú es un favor personal; una sección con criterio
 * declarado es una unidad de negocio.
 *
 * El plantel es corto a propósito, así que el bloque final no disimula el
 * hueco —no repite tarjetas fantasma para llenar la grilla— sino que lo usa
 * de convocatoria.
 */

const WA =
  "https://api.whatsapp.com/send?phone=5491156072460&text=" +
  encodeURIComponent("Hola Hivrido! Soy artista y quiero que representen mi carrera.");

/**
 * Qué pone Hivrido según el oficio.
 *
 * El índice decía que construimos "identidad, catálogo y una URL propia", que
 * es cierto y no alcanza: un músico lee eso y no sabe si le grabamos el tema.
 * Acá se declara la infraestructura, por disciplina y con nombre propio, que
 * es lo único que separa a una representación de una promesa.
 *
 * La lista cierra abierta a propósito: los oficios no son cuatro, y una
 * grilla que finge cubrirlos todos miente igual que una que deja gente afuera.
 */
const OFICIOS = [
  {
    titulo: "Músicos y cantantes",
    texto:
      "Estudio de producción musical: preproducción, grabación, mezcla y máster. Y después lo que decide si el tema existe o no —que se escuche—: entra a las plataformas de streaming del momento con arte de tapa, visualizer y un lanzamiento armado detrás, no un archivo subido un martes.",
    tags: ["Estudio", "Mezcla y máster", "Distribución", "Lanzamiento"],
  },
  {
    titulo: "Actores y actrices",
    texto:
      "Teatro, obras, series y películas. Te movemos donde se reparte el trabajo: castings, producciones propias y ajenas, y el material con el que te presentás —reel, book y ficha— hecho para que del otro lado digan que sí antes de terminar de verlo.",
    tags: ["Casting", "Teatro", "Series y cine", "Reel y book"],
  },
  {
    titulo: "Creadores y youtubers",
    texto:
      "Viajes y locaciones. Un canal se gasta filmando siempre en el mismo cuarto: producimos salidas, conseguimos los lugares y viajamos con equipo propio para que cada video tenga un escenario que tu audiencia todavía no vio.",
    tags: ["Locaciones", "Viajes", "Producción", "Cámara"],
  },
  {
    titulo: "Streamers",
    texto:
      "Lo que haga falta. Setup, escena, arte de canal, overlays y los clips que convierten cuatro horas de directo en una semana de contenido. Un vivo no se puede parar a resolver problemas: los resolvemos antes de que salgas al aire.",
    tags: ["Setup", "Arte de canal", "Clips", "Soporte"],
  },
  {
    titulo: "Y lo que no esté en esta lista",
    texto:
      "Bailarines, modelos, humoristas, artistas visuales. La lista no se cierra acá porque los oficios tampoco: si el tuyo no está, el criterio es el mismo de siempre —qué necesita para que lo que hacés se vea, se contrate y se pague—. Eso es lo que armamos.",
    tags: ["A medida"],
  },
];

export const metadata: Metadata = {
  title: "Artistas | Representación y desarrollo de carrera | Hivrido",
  description:
    "El roster de Hivrido: artistas a los que les construimos identidad, catálogo y presencia digital. Dirección creativa, producción audiovisual y crecimiento medible para una carrera.",
  keywords: [
    "representacion de artistas",
    "management artistico argentina",
    "desarrollo de carrera musical",
    "productora de artistas",
    "Hivrido artistas",
    /* Las disciplinas del bloque de oficios: desde que la página las cubre
       de verdad, son las palabras con las que cada uno se busca. */
    "representacion de musicos",
    "representacion de actores",
    "management de streamers",
    "productora para youtubers",
  ],
  alternates: { canonical: "/artistas" },
  openGraph: {
    title: "Artistas | Hivrido",
    description:
      "Artistas a los que les construimos identidad, catálogo y presencia digital. Una carrera es un proyecto, no un feed.",
    url: "https://hivrido.com/artistas",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

export default function ArtistasPage() {
  return (
    <ClientShell>
      {/* 300 y no el valor por defecto: ese espera a que se retire el
          preloader de la home, que en esta ruta no existe. */}
      <Header base="/" logoDelay={300} />

      <main className="art-page">
        <FondoVivo />

        <section className="art-index-hero">
          <div className="art-wrap">
            <p className="art-eyebrow">Roster · Hivrido</p>

            <h1 className="art-index-titulo">Una carrera no es un feed</h1>

            <p className="art-index-lead">
              Hay artistas con audiencia real y ninguna casa: miles de personas que
              los siguen y nada que encontrar cuando alguien los busca. Acá les
              construimos lo que falta —identidad, catálogo, dirección y una URL
              propia— para que lo que ya funciona se pueda mostrar, contratar y
              medir.
            </p>
          </div>
        </section>

        <section className="art-oficios-sec">
          <div className="art-wrap">
            <p className="art-eyebrow">Qué ponemos</p>
            <h2 className="art-h2">Cada oficio pide otra cosa</h2>
            <p className="art-oficios-lead">
              Un músico no necesita lo mismo que una actriz, y una streamer no
              necesita lo mismo que ninguno de los dos. Por eso no hay un
              paquete: hay una estructura que se arma alrededor de lo que tu
              carrera necesita para crecer, y la ponemos nosotros.
            </p>

            <div className="art-oficios">
              {OFICIOS.map((o, i) => (
                <article className="art-oficio" key={o.titulo}>
                  <span className="art-oficio-num" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{o.titulo}</h3>
                  <p>{o.texto}</p>
                  <span className="art-oficio-tags">
                    {o.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="art-wrap" aria-label="Artistas representados">
          <div className="art-roster">
            {ARTISTAS.map((a) => (
              <Link
                key={a.slug}
                href={`/artistas/${a.slug}`}
                className="art-ficha"
                /* El acento propio del artista tiñe su fila del índice: dos
                   fichas seguidas no se leen como la misma plantilla. */
                style={
                  {
                    "--art-acento": a.acento.hex,
                    "--art-acento-suave": a.acento.suave,
                  } as React.CSSProperties
                }
              >
                <span className="art-ficha-alias">{a.alias}</span>
                <h2 className="art-ficha-nombre">{a.nombre}</h2>
                <p className="art-ficha-tagline">{a.tagline}</p>

                <div className="art-ficha-pie">
                  {/* Las disciplinas van en su propio contenedor: el separador
                      se dibuja entre ellas y no después de la última, que es
                      donde quedaba colgado cuando el botón era un hermano más. */}
                  <span className="art-ficha-tags">
                    {a.disciplinas.slice(0, 3).map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </span>
                  <span className="art-ficha-ver" aria-hidden>
                    Ver ficha
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}

            <div className="art-sumate">
              <h2>El roster está abierto</h2>
              <p>
                Trabajamos con pocos artistas a la vez porque cada uno lleva
                dirección, producción y pauta propias. Si tenés una audiencia que
                ya responde y nada armado alrededor, es exactamente el caso que
                nos interesa.
              </p>
              <a
                className="art-link"
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
              >
                Proponer tu proyecto
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <div style={{ height: "clamp(62px, 11vw, 120px)" }} />

        <Footer />
      </main>
    </ClientShell>
  );
}
