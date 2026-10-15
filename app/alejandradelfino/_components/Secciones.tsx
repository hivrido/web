import Reveal from "./Reveal";
import Texto from "./Texto";
import FormSumate from "./FormSumate";
import { ICONOS } from "./Iconos";
import { sitio, textos } from "../_lib/contenido";

/* La franja de colores que separa secciones, como las guardas de la
   referencia: un color por región, en diagonal. */
export function Franja() {
  return <div className="ad-franja" aria-hidden="true" />;
}

export function QuienEs() {
  const q = textos.quien;
  return (
    <section id="quien-es" className="ad-seccion ad-quien" aria-labelledby="ad-quien-titulo">
      <Reveal className="ad-quien-foto">
        <div className="ad-polaroid-grande">
          <div className="ad-foto-pendiente">
            <Texto>{q.foto}</Texto>
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
          <Reveal key={i} delay={0.08 * (i + 1)}>
            <p className="ad-parrafo">
              <Texto>{p}</Texto>
            </p>
          </Reveal>
        ))}
        <ol className="ad-hitos">
          {q.hitos.map((h, i) => (
            <Reveal as="li" key={h.texto} delay={0.1 * i}>
              <span className="ad-hito-anio">{h.anio}</span>
              <span>{h.texto}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Gestion() {
  const g = textos.gestion;
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
              {c.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.foto} alt={`${c.lugar}, Chubut`} loading="lazy" width={560} height={420} />
              ) : (
                <div className="ad-caso-ilustracion" aria-hidden="true">
                  <span>{c.lugar}</span>
                </div>
              )}
              <span className="ad-caso-anio">{c.anio}</span>
            </div>
            <div className="ad-caso-cuerpo">
              <h3>{c.lugar}</h3>
              <p className="ad-cifra">
                <strong>{c.cifra}</strong>
                <span>{c.cifraLabel}</span>
              </p>
              <ul>
                {c.obras.map((o) => (
                  <li key={o}>
                    <Texto>{o}</Texto>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="ad-nota-pie">
        <Texto>{g.fotoNota}</Texto>
      </p>
    </section>
  );
}

export function Propuestas() {
  const p = textos.propuestas;
  return (
    <section id="propuestas" className="ad-seccion ad-propuestas" aria-labelledby="ad-prop-titulo">
      <Reveal className="ad-cabeza">
        <p className="ad-kicker">{p.kicker}</p>
        <h2 id="ad-prop-titulo" className="ad-titulo">
          {p.titulo}
        </h2>
      </Reveal>
      <div className="ad-ejes">
        {p.ejes.map((e, i) => (
          <Reveal as="article" key={e.id} delay={0.1 * i} className={`ad-eje ad-eje-${e.id}`}>
            <span className="ad-sello">{p.estado}</span>
            <span className="ad-eje-icono">{ICONOS[e.id]}</span>
            <span className="ad-eje-num">0{i + 1}</span>
            <h3>{e.titulo}</h3>
            <p>{e.texto}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Sumate() {
  const s = sitio.sumate;
  return (
    <section id="sumate" className="ad-sumate" aria-labelledby="ad-sumate-titulo">
      <Reveal className="ad-sumate-caja">
        <span className="ad-corazon ad-corazon-grande" aria-hidden="true" />
        <h2 id="ad-sumate-titulo">{s.titulo}</h2>
        <p className="ad-sumate-bajada">{s.bajada}</p>
        <FormSumate />
      </Reveal>
    </section>
  );
}

export function Pie() {
  const f = sitio.footer;
  return (
    <footer className="ad-pie-sitio">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/alejandradelfino/logo-ad-mark.webp" alt="Alejandra Delfino" width={140} height={106} loading="lazy" />
      <p className="ad-firma">{f.firma}</p>
      <p className="ad-pie-aviso">{f.aviso}</p>
      <a href={sitio.meta.instagram} target="_blank" rel="noopener noreferrer" className="ad-pie-ig">
        @alejandra.delfino
      </a>
    </footer>
  );
}
