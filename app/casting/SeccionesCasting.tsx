/**
 * La información del casting, debajo del formulario: la serie, qué hay que
 * saber, cómo es la prueba, las escenas, cómo prepararse, qué llevar y las
 * preguntas. Todo el texto sale de contenido.ts.
 */

import Reveal from "./Reveal";
import { IconoDato } from "./Iconos";
import {
  ARTE,
  COMO_VA_A_SER,
  DATOS_CLAVE,
  FAQ,
  PREPARACION,
  QUE_LLEVAR,
  SITUACIONES,
} from "./contenido";

export default function SeccionesCasting() {
  return (
    <>
      {/* ── El arte ──────────────────────────────────────────────────
          <img> a secas y no next/image: el proyecto corre con
          `images.unoptimized`, así que el componente no optimizaría nada y
          solo sumaría JS. Las dos variantes ya vienen dimensionadas desde
          scripts/build-casting-assets.mjs; `width` y `height` reservan el
          hueco antes de que baje, así nada salta al aparecer. */}
      <section className="cst-seccion cst-arte" aria-labelledby="t-arte">
        <div className="cst-wrap cst-arte-inner">
          {/* eslint-disable-next-line @next/next/no-img-element --
              next/image no optimiza nada en este proyecto (`unoptimized` en
              next.config.ts) y con esa bandera tampoco arma el srcset: daría
              una sola variante y JS de más. Las dos webp ya vienen del
              script de assets. */}
          <img
            className="cst-arte-poster"
            src={ARTE.poster400}
            srcSet={`${ARTE.poster400} 400w, ${ARTE.poster800} 800w`}
            sizes="(min-width: 720px) 300px, min(72vw, 300px)"
            width={400}
            height={600}
            alt={ARTE.alt}
            loading="lazy"
            decoding="async"
          />
          <div className="cst-arte-copy">
            <h2 className="cst-h2 cst-h2-chico" id="t-arte">
              {ARTE.titulo}
            </h2>
            <p className="cst-arte-texto">{ARTE.texto}</p>
          </div>
        </div>
      </section>

      {/* ── 2 · Datos clave ──────────────────────────────────────────── */}
      <section className="cst-seccion" aria-labelledby="t-datos">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-datos">
            Lo que tenés que saber
          </h2>

          <ul className="cst-datos">
            {DATOS_CLAVE.map((dato, i) => (
              <Reveal
                as="li"
                key={dato.titulo}
                delay={i * 0.05}
                className={`cst-dato${dato.destacado ? " cst-dato-alerta" : ""}`}
              >
                <span className="cst-dato-icono" aria-hidden="true">
                  <IconoDato nombre={dato.icono} />
                </span>
                <div>
                  <h3 className="cst-dato-titulo">{dato.titulo}</h3>
                  <p className="cst-dato-texto">{dato.texto}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3 · Cómo va a ser ────────────────────────────────────────
          <ol> y no <ul>: los dos momentos pasan en ese orden y no en
          otro, y esa es la única pregunta que la sección contesta. */}
      <section className="cst-seccion" aria-labelledby="t-hacer">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-hacer">
            {COMO_VA_A_SER.titulo}
          </h2>
          <p className="cst-lead">{COMO_VA_A_SER.lead}</p>

          <ol className="cst-pasos">
            {COMO_VA_A_SER.momentos.map((momento, i) => (
              <Reveal as="li" key={momento.etiqueta} delay={i * 0.08} className="cst-paso">
                <p className="cst-paso-meta">
                  <span className="cst-paso-num">{momento.etiqueta}</span>
                  <span className="cst-paso-duracion">{momento.duracion}</span>
                </p>
                <h3 className="cst-paso-titulo">{momento.titulo}</h3>
                <p className="cst-paso-texto">{momento.texto}</p>
                <p className="cst-paso-nota">{momento.nota}</p>
              </Reveal>
            ))}
          </ol>

          <ul className="cst-noes">
            {COMO_VA_A_SER.aclaraciones.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4 · Las situaciones ──────────────────────────────────────
          La letra vive dentro del <h3>, no en un adorno aparte: es cómo
          se llama la escena el día del casting ("te tocó la C"), así que
          el lector de pantalla tiene que leerla con el nombre. */}
      <section className="cst-seccion" aria-labelledby="t-situaciones">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-situaciones">
            {SITUACIONES.titulo}
          </h2>
          <p className="cst-lead">{SITUACIONES.lead}</p>

          <ul className="cst-situaciones">
            {SITUACIONES.escenas.map((escena, i) => (
              <Reveal
                as="li"
                key={escena.letra}
                delay={i * 0.06}
                className="cst-situacion"
              >
                <h3 className="cst-situacion-nombre">
                  <span className="cst-situacion-letra">{escena.letra}</span>
                  {escena.nombre}
                </h3>
                <ul className="cst-beats">
                  {escena.beats.map((beat) => (
                    <li key={beat}>{beat}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5 · Cómo prepararte ──────────────────────────────────────── */}
      <section className="cst-seccion" aria-labelledby="t-preparar">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-preparar">
            {PREPARACION.titulo}
          </h2>

          <Reveal className="cst-preparar">
            <p className="cst-preparar-alerta">{PREPARACION.advertencia}</p>
            <p className="cst-preparar-texto">{PREPARACION.texto}</p>
          </Reveal>

          <h3 className="cst-preparar-sub">{PREPARACION.subtitulo}</h3>

          <ol className="cst-consejos">
            {PREPARACION.consejos.map((consejo, i) => (
              <Reveal
                as="li"
                key={consejo.titulo}
                delay={i * 0.06}
                className="cst-consejo"
              >
                <h4 className="cst-consejo-titulo">{consejo.titulo}</h4>
                <p className="cst-consejo-texto">{consejo.texto}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 6 · Qué llevar ───────────────────────────────────────────── */}
      <section className="cst-seccion" aria-labelledby="t-llevar">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-llevar">
            {QUE_LLEVAR.titulo}
          </h2>

          <Reveal>
            <ul className="cst-llevar">
              {QUE_LLEVAR.items.map((item) => (
                <li key={item.cosa}>
                  <strong>{item.cosa}</strong>
                  <span>{item.nota}</span>
                </li>
              ))}
            </ul>
            <p className="cst-llevar-cierre">{QUE_LLEVAR.cierre}</p>
          </Reveal>
        </div>
      </section>

      {/* ── 7 · Preguntas ────────────────────────────────────────────
          <details> nativo: se abre y se cierra sin una línea de
          JavaScript, responde al teclado y al lector de pantalla solo, y
          los buscadores leen la respuesta aunque esté plegada. */}
      <section className="cst-seccion" aria-labelledby="t-faq">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-faq">
            Preguntas
          </h2>

          <div className="cst-faq">
            {FAQ.map((item) => (
              <details className="cst-faq-item" key={item.pregunta}>
                <summary className="cst-faq-summary">
                  <h3 className="cst-faq-pregunta">{item.pregunta}</h3>
                  <span className="cst-faq-mas" aria-hidden="true" />
                </summary>
                <p className="cst-faq-respuesta">{item.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
