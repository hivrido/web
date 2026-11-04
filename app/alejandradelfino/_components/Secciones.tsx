import Reveal from "./Reveal";
import Sello from "./Sello";
import FormContacto from "./FormContacto";
import { ICONOS } from "./Iconos";
import { Corazon, Monograma } from "./Marca";
import { fotoPublicable, gestion, marca, perfil, propuestas, sello, sitio, trayectoria } from "../_lib/contenido";
import { LANZAMIENTO, ruta } from "../_config/site";

/* La franja de colores que separa secciones, como las guardas de la
   referencia: un color por región, en diagonal. */
export function Franja() {
  return <div className="ad-franja" aria-hidden="true" />;
}

export function QuienEs() {
  const q = perfil;
  return (
    <section id="quien-es" className="ad-seccion ad-quien" aria-labelledby="ad-quien-titulo">
      <Reveal className="ad-quien-foto">
        <div className="ad-polaroid-grande">
          {/* Sin foto oficial con permiso, el monograma ocupa su lugar. */}
          <div className="ad-foto-pendiente">
            <Monograma className="ad-quien-monograma" />
          </div>
          <span className="ad-pie">Alejandra · Chubut</span>
        </div>
      </Reveal>

      <div className="ad-quien-texto">
        <Reveal>
          <p className="ad-kicker">{q.kicker}</p>
          <h2 id="ad-quien-titulo" className="ad-titulo">
            {q.titulo}
          </h2>
          <p className="ad-registral">{q.registral}</p>
        </Reveal>
        {q.parrafos.map((p, i) => (
          <Reveal key={p.texto} delay={0.08 * (i + 1)}>
            <p className="ad-parrafo">
              <Sello de={p} />
              {p.texto}
            </p>
          </Reveal>
        ))}
        <ol className="ad-hitos">
          {trayectoria.map((h, i) => (
            <Reveal as="li" key={h.cargo} delay={0.1 * i}>
              <span className="ad-hito-anio">{h.anio ?? "s/f"}</span>
              <span>
                <Sello de={h} />
                {h.organismo ? `${h.cargo}, ${h.organismo}` : h.cargo}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Gestion() {
  const g = gestion;
  return (
    <section id="gestion" className="ad-seccion ad-gestion" aria-labelledby="ad-gestion-titulo">
      <Reveal className="ad-cabeza">
        <p className="ad-kicker">{g.kicker}</p>
        <h2 id="ad-gestion-titulo" className="ad-titulo">
          {g.titulo}
        </h2>
        <p className="ad-bajada">{g.bajada}</p>
      </Reveal>

      <div className="ad-casos">
        {g.casos.map((c, i) => (
          <Reveal as="article" key={c.id} delay={0.12 * i} className={`ad-caso ad-caso-${c.id}`}>
            <div className="ad-caso-media">
              {fotoPublicable(c.foto) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ruta(c.foto!)} alt={`${c.lugar}, Chubut`} loading="lazy" width={560} height={420} />
              ) : (
                <div className="ad-caso-ilustracion" aria-hidden="true">
                  <span>{c.lugar}</span>
                </div>
              )}
              {c.anio && <span className="ad-caso-anio">{c.anio}</span>}
            </div>
            <div className="ad-caso-cuerpo">
              <h3>
                <Sello de={c} />
                {c.lugar}
              </h3>
              <p className="ad-cifra">
                <strong>{c.cifra}</strong>
                <span>{c.cifraLabel}</span>
              </p>
              <ul>
                {c.obras.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* Ninguna propuesta se publica sin la aprobación escrita de ella: mientras
   tanto, la sección solo avisa que están en elaboración. En desarrollo se
   ven los borradores, con su sello. */
export function Propuestas() {
  const p = propuestas;
  return (
    <section id="propuestas" className="ad-seccion ad-propuestas" aria-labelledby="ad-prop-titulo">
      <Reveal className="ad-cabeza">
        <p className="ad-kicker">{p.kicker}</p>
        <h2 id="ad-prop-titulo" className="ad-titulo">
          {p.ejes.length ? p.titulo : p.enElaboracion}
        </h2>
      </Reveal>
      {p.ejes.length > 0 && (
        <div className="ad-ejes">
          {p.ejes.map((e, i) => (
            <Reveal as="article" key={e.id} delay={0.1 * i} className={`ad-eje ad-eje-${e.id}`}>
              {sello(e) && <span className="ad-sello">{sello(e)}</span>}
              <span className="ad-eje-icono">{ICONOS[e.id]}</span>
              <span className="ad-eje-num">0{i + 1}</span>
              <h3>{e.titulo}</h3>
              <p>{e.texto}</p>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export function Contacto() {
  const s = sitio.formulario;
  return (
    <section id="contacto" className="ad-contacto" aria-labelledby="ad-contacto-titulo">
      <Reveal className="ad-contacto-caja">
        <Corazon grande />
        <h2 id="ad-contacto-titulo">{s.titulo}</h2>
        <p className="ad-contacto-bajada">{s.bajada}</p>
        <FormContacto />
      </Reveal>
    </section>
  );
}

export function Pie() {
  const f = sitio.footer;
  return (
    <footer className="ad-pie-sitio">
      {LANZAMIENTO ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ruta(marca.logo)} alt="Alejandra Delfino" width={140} height={106} loading="lazy" />
          <p className="ad-firma">{marca.firma}</p>
        </>
      ) : (
        <p className="ad-pie-nombre">Alejandra Delfino</p>
      )}
      <p className="ad-pie-aviso">{f.aviso}</p>
      <p className="ad-pie-fuente">{f.mapa}</p>
      <a href={sitio.meta.instagram} target="_blank" rel="noopener noreferrer" className="ad-pie-ig">
        @alejandra.delfino
      </a>
    </footer>
  );
}
