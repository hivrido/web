/**
 * El cuerpo de /origen: manifiesto, problema, la experiencia, generaciones,
 * recorrido, programa, para quién, contenido, expansión y cierre.
 *
 * Componente de servidor: el texto llega con el HTML. Lo único que hidrata son
 * los títulos de sección (SectionTitle, el mismo barrido de toda la casa) y
 * las apariciones al hacer scroll, que sin JavaScript dejan el contenido como
 * está. La cinta reusa las clases .web-ticker de las landings de servicios.
 */

import SectionTitle from "../components/ui/SectionTitle";
import ScrollReveal from "../components/ui/ScrollReveal";
import {
  CAJA,
  DATOS,
  DIAS,
  FORMATOS,
  HISTORIA,
  MANIFIESTO,
  PARA_QUIEN,
  PILARES,
  PROBLEMA,
  RECORRIDO,
  ROLES,
  SEDES,
  TICKER,
  VALORES,
  WA_ARTISTA,
} from "./contenido";

const Flecha = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function SeccionesOrigen() {
  return (
    <>
      {/* ── Cinta ── */}
      <div className="web-ticker" aria-hidden>
        <div className="web-ticker-track">
          {[0, 1].map((copia) => (
            <div className="web-ticker-run" key={copia}>
              {TICKER.map((t) => (
                <span className="web-ticker-item" key={t}>
                  {t}
                  <i className="web-ticker-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Manifiesto ── */}
      <section className="og-sec" aria-label="Manifiesto">
        <div className="section-container">
          <SectionTitle eyebrow="Manifiesto" lines={["La industria", "cambió"]} />

          <ol className="og-manifiesto">
            {MANIFIESTO.map((linea, i) => (
              <ScrollReveal tag="li" key={linea} delay={i * 0.08}>
                {linea}
              </ScrollReveal>
            ))}
          </ol>

          <ScrollReveal className="og-vision">
            <p>
              Por eso existe ORIGEN. No para organizar un evento, sino para crear el
              espacio donde las carreras realmente empiezan.
            </p>
            <p>
              Queremos ser la plataforma de desarrollo artístico más importante de
              Latinoamérica, y que decir <strong>“Soy parte de ORIGEN”</strong>{" "}
              signifique algo.
            </p>
          </ScrollReveal>

          <ul className="og-valores" aria-label="Nuestra filosofía">
            {VALORES.map(([no, si], i) => (
              <ScrollReveal tag="li" className="og-valor" key={no} delay={i * 0.08}>
                <span className="og-num">0{i + 1}</span>
                <span className="og-valor-no">
                  <small>No creemos en</small>
                  <s>{no}</s>
                </span>
                <span className="og-valor-si">
                  <small>Creemos en</small>
                  {si}
                </span>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── El problema ── */}
      <section className="og-sec og-sec--alt" aria-label="El problema">
        <div className="section-container">
          <SectionTitle eyebrow="El problema" lines={["Talento sobra,", "falta lugar"]} />

          <p className="web-lead">
            Miles de artistas tienen talento, pero trabajan solos. ORIGEN junta en un
            solo lugar todo lo que hoy está disperso.
          </p>

          <div className="og-vs">
            <div className="og-vs-head" aria-hidden>
              <span>Hoy, el artista emergente</span>
              <span>En ORIGEN</span>
            </div>
            <ul>
              {PROBLEMA.map(([hoy, origen]) => (
                <ScrollReveal tag="li" className="og-vs-row" key={hoy}>
                  <span className="og-vs-hoy">{hoy}</span>
                  <span className="sr-only"> → en ORIGEN: </span>
                  <span className="og-vs-origen">{origen}</span>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── La experiencia ── */}
      <section className="og-sec" id="og-experiencia" aria-label="La experiencia">
        <div className="section-container">
          <SectionTitle eyebrow="La solución" lines={["Tres días,", "un mismo espacio"]} />

          <p className="web-lead">
            Todos viviendo la misma experiencia, con un objetivo: que cada persona se
            vaya con obra terminada, contenido propio y una red que sigue activa.
          </p>

          <ul className="og-roles" aria-label="Quiénes participan">
            {ROLES.map((r) => <li key={r}>{r}</li>)}
          </ul>

          <h3 className="og-h3">No es un campamento.</h3>
          <div className="og-pilares">
            {PILARES.map((p, i) => (
              <ScrollReveal tag="article" className="og-pilar" key={p.titulo} delay={i * 0.08}>
                <span className="og-num">0{i + 1}</span>
                <h4>{p.titulo}</h4>
                <p>{p.texto}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Generaciones ── */}
      <section className="og-sec og-sec--alt" aria-label="Generaciones">
        <div className="section-container">
          <SectionTitle eyebrow="Generaciones" lines={["Sos parte de", "una generación"]} />

          <div className="og-gen">
            <ScrollReveal className="og-gen-copy">
              <p className="web-lead">
                ORIGEN no hace ediciones: forma <strong>generaciones</strong>. Cada artista
                seleccionado recibe la chaqueta con el número de su generación. Se fabrica
                una sola vez y nunca vuelve a producirse.
              </p>
              <p className="og-texto">
                Con los años, haber sido parte de la Generación 001 va a significar haber
                estado desde el principio.
              </p>
              <div className="og-gen-badges" aria-hidden>
                <span>GEN 001</span>
                <span>GEN 002</span>
                <span>GEN 003</span>
              </div>
            </ScrollReveal>

            <ScrollReveal from="scale" className="og-parche-wrap">
              <div className="og-parche" role="img" aria-label="Parche de la chaqueta Generación 001">
                <div className="og-parche-top">
                  <span>ORIGEN</span>
                  <span>Edición única</span>
                </div>
                <svg className="og-parche-mark" viewBox="0 0 200 200" aria-hidden="true">
                  <path d="M78 176A78 78 0 1 1 122 176" fill="none" stroke="#C4B5FD" strokeWidth="14" />
                  <rect x="93" y="86" width="14" height="92" fill="#FF1B8D" />
                </svg>
                <div className="og-parche-num">
                  <small>Generación</small>
                  001
                </div>
                <div className="og-parche-foot">
                  <span>Todo artista tiene un origen</span>
                  <span>Nunca vuelve a fabricarse</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="og-caja">
            <div>
              <span className="og-eyebrow">La caja negra</span>
              <h3 className="og-h3">La historia empieza antes de llegar.</h3>
              <p className="og-texto">
                Cada artista seleccionado recibe una caja negra en su casa. No sabe quiénes
                son los demás. Solo sabe que fue elegido.
              </p>
              <blockquote className="og-cita">
                “Todo artista tiene un origen. El tuyo empieza ahora.”
              </blockquote>
            </div>
            <ol className="og-caja-lista">
              {CAJA.map((c, i) => (
                <li key={c.titulo}>
                  <span className="og-num">0{i + 1}</span>
                  <div>
                    <b>{c.titulo}</b>
                    <p>{c.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Recorrido ── */}
      <section className="og-sec" aria-label="El recorrido">
        <div className="section-container">
          <SectionTitle eyebrow="El recorrido" lines={["Antes, durante", "y después"]} />

          <div className="og-recorrido">
            {RECORRIDO.map((r, i) => (
              <ScrollReveal tag="article" className="og-etapa" key={r.etapa} delay={i * 0.1}>
                <span className="og-etapa-tag">{r.etapa}</span>
                <h3>{r.titulo}</h3>
                <ol>
                  {r.pasos.map((p) => <li key={p}>{p}</li>)}
                </ol>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programa ── */}
      <section className="og-sec og-sec--alt" aria-label="Programa de los tres días">
        <div className="section-container">
          <SectionTitle eyebrow="Tres días" lines={["Tres días que", "cambian años"]} />

          <div className="og-dias">
            {DIAS.map((d, i) => (
              <ScrollReveal tag="article" className="og-dia" key={d.dia} delay={i * 0.1}>
                <header className="og-dia-head">
                  <span className="og-dia-num">Día {d.dia}</span>
                  <span className="og-dia-nombre">{d.nombre}</span>
                </header>
                <dl>
                  {d.slots.map(([hora, titulo, texto]) => (
                    <div className="og-slot" key={hora}>
                      <dt>{hora}</dt>
                      <dd>
                        <b>{titulo}</b>
                        {texto}
                      </dd>
                    </div>
                  ))}
                </dl>
              </ScrollReveal>
            ))}
          </div>
          <p className="og-nota">Programa tentativo · los horarios se confirman con cada convocatoria.</p>
        </div>
      </section>

      {/* ── Para quién ── */}
      <section className="og-sec" id="og-aliados" aria-label="Para quién">
        <div className="section-container">
          <SectionTitle eyebrow="Para quién" lines={["Un lugar para", "cada rol"]} />

          <div className="og-cards">
            {PARA_QUIEN.map((c, i) => (
              <ScrollReveal
                tag="article"
                className={`og-card${c.num === "03" ? " og-card--marca" : ""}`}
                key={c.num}
                delay={i * 0.1}
              >
                <span className="og-eyebrow">{c.num} · {c.rol}</span>
                <h3>{c.titulo}</h3>
                <p>{c.texto}</p>
                <ul>
                  {c.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <a className="og-card-btn" href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.cta}
                  <Flecha />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contenido ── */}
      <section className="og-sec og-sec--alt" aria-label="La narrativa">
        <div className="section-container">
          <SectionTitle eyebrow="La narrativa" lines={["No es un evento:", "es una historia"]} />

          <div className="og-contenido">
            <ScrollReveal tag="div">
              <ul className="og-historia" aria-label="Lo que documentamos">
                {HISTORIA.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </ScrollReveal>
            <ScrollReveal tag="div" delay={0.1}>
              <span className="og-eyebrow">Lo que produce cada generación</span>
              <ul className="og-formatos">
                {FORMATOS.map((f, i) => (
                  <li key={f} className={i === 0 ? "is-main" : undefined}>{f}</li>
                ))}
              </ul>
              <p className="og-claim">
                Un artista entra con una idea. <strong>Sale con una historia que contar.</strong>
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Comunidad y expansión ── */}
      <section className="og-sec" aria-label="Comunidad y futuro">
        <div className="section-container">
          <SectionTitle eyebrow="Comunidad y futuro" lines={["Cada generación", "suma a la anterior"]} />

          <p className="web-lead">
            Cuando termina la experiencia, los artistas siguen conectados, colaborando y
            lanzando música. Y ORIGEN viaja, siempre con la misma esencia.
          </p>

          <ol className="og-sedes" aria-label="Expansión de ORIGEN">
            {SEDES.map((s, i) => (
              <ScrollReveal tag="li" key={s.ciudad} className={s.estado ? "is-now" : undefined} delay={i * 0.05}>
                <span className="og-num">{s.estado ? "001" : "—"}</span>
                <span className="og-sede-ciudad">
                  {s.ciudad}
                  {s.detalle ? <small>{s.detalle}</small> : null}
                </span>
                <span className="og-sede-estado">{s.estado ?? "Próximamente"}</span>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── El sueño ── */}
      <section className="og-sueno" aria-label="El sueño">
        <div className="section-container">
          <ScrollReveal from="scale">
            <span className="og-eyebrow">El sueño</span>
            <blockquote className="og-sueno-cita">“Mi historia empezó en ORIGEN.”</blockquote>
            <p className="og-texto">
              Eso queremos que responda un artista dentro de diez años, cuando gane un
              premio importante y le pregunten dónde empezó todo.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="web-section web-section--alt section" aria-label="Sumate">
        <div className="section-container">
          <div className="web-guarantee">
            {DATOS.map(([clave, valor]) => (
              <div className="web-guarantee-item" key={clave}>
                <span className="web-guarantee-key">{clave}</span>
                <span className="web-guarantee-value">{valor}</span>
              </div>
            ))}
          </div>

          <div className="web-cta">
            <h2 className="web-cta-title">La Generación 001 empieza ahora</h2>
            <p className="web-cta-text">
              Escribinos y te avisamos primero cuando se abra la convocatoria. Si sos
              productor, creativo o una marca que quiere ser aliada, también es por acá.
            </p>
            <div className="web-cta-row">
              <a className="web-cta-btn" href={WA_ARTISTA} target="_blank" rel="noopener noreferrer">
                Escribinos por WhatsApp
                <Flecha />
              </a>
              <a
                className="web-cta-mail"
                href={`mailto:hola@hivrido.com?subject=${encodeURIComponent("ORIGEN · Generación 001")}`}
              >
                hola@hivrido.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
