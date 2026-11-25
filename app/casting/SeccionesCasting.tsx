/**
 * La información del casting, debajo de la cabecera: la serie, qué hay que
 * saber, qué grabar, cómo grabarse, cómo prepararse y las preguntas. Todo el texto sale de contenido.ts.
 */

import Reveal from "./Reveal";
import Afiche3D from "../components/ui/Afiche3D";
import Equipo from "../components/ui/Equipo";
import { IconoDato } from "./Iconos";
import {
  ARTE,
  COMO_VA_A_SER,
  DATOS_CLAVE,
  FAQ,
  GRABACION,
  PREPARACION,
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
          {/* El afiche en 3D, con la luz de la casa recorriendo el borde
              (components/ui/Afiche3D.tsx, el mismo de la home). Las dos webp
              vienen de scripts/build-casting-assets.mjs. */}
          <Afiche3D
            className="cst-arte-poster"
            src400={ARTE.poster400}
            src800={ARTE.poster800}
            alt={ARTE.alt}
            sizes="(min-width: 720px) 300px, min(72vw, 300px)"
          />
          <div className="cst-arte-copy">
            <h2 className="cst-h2 cst-h2-chico" id="t-arte">
              {ARTE.titulo}
            </h2>
            <p className="cst-arte-texto">{ARTE.texto}</p>
          </div>
        </div>
      </section>

      {/* ── El equipo ───────────────────────────────────────────────── */}
      <section className="cst-seccion" aria-labelledby="t-equipo">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-equipo">
            El equipo
          </h2>
          <Equipo />
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

      {/* ── 3 · Qué grabar ──────────────────────────────────────────────
          La presentación y, después, un camino por perfil. */}
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
                  {momento.duracion && <span className="cst-paso-duracion">{momento.duracion}</span>}
                </p>
                <h3 className="cst-paso-titulo">{momento.titulo}</h3>
                <p className="cst-paso-texto">{momento.texto}</p>
                {momento.nota && <p className="cst-paso-nota">{momento.nota}</p>}
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

      {/* ── 4 · Cómo grabarte ─────────────────────────────────────────── */}
      <section className="cst-seccion" aria-labelledby="t-grabar">
        <div className="cst-wrap">
          <h2 className="cst-h2" id="t-grabar">
            {GRABACION.titulo}
          </h2>

          <Reveal>
            <ul className="cst-llevar">
              {GRABACION.items.map((item) => (
                <li key={item.cosa}>
                  <strong>{item.cosa}</strong>
                  <span>{item.nota}</span>
                </li>
              ))}
            </ul>
            <p className="cst-llevar-cierre">{GRABACION.cierre}</p>
          </Reveal>
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

      {/* ── 6 · Preguntas ────────────────────────────────────────────
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
