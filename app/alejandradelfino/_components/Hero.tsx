"use client";

import { Fragment, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import HeroScene, { useProgresoHero } from "./HeroScene";
import { Corazon } from "./Marca";
import { sitio } from "../_lib/contenido";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cascada de entrada del titular: 0,45s y después una palabra cada 0,12s. */
const retraso = (i: number) => ({ "--retraso": `${0.45 + i * 0.12}s` }) as React.CSSProperties;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progreso = useProgresoHero(ref);
  const textoY = useTransform(progreso, [0, 1], [0, -90]);
  const textoOpacidad = useTransform(progreso, [0, 0.7], [1, 0]);

  const { kicker, frase, destacado, bajada, cta, ctaSecundario } = sitio.hero;
  const [antes] = frase.split(destacado);
  const palabras = antes.trim().split(" ");

  return (
    <section ref={ref} className="ad-hero" aria-labelledby="ad-hero-titulo">
      <div className="ad-hero-escena">
        <HeroScene progreso={progreso} />
      </div>

      <motion.div className="ad-hero-texto" style={{ y: textoY, opacity: textoOpacidad }}>
        <motion.p
          className="ad-hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          <Corazon />
          {kicker}
        </motion.p>

        <h1 id="ad-hero-titulo" className="ad-hero-titulo">
          {/* Cada palabra entra por separado, con un espacio real entre ellas:
              sin él, lectores de pantalla y buscadores leen "Chubuttiene".
              La entrada es CSS y no Framer: arranca con el primer pintado en
              lugar de esperar a que hidrate el JavaScript, que en un celular
              demoraba segundos el titular (el LCP de la página). */}
          {palabras.map((p, i) => (
            <Fragment key={p + i}>
              <span className="ad-palabra" style={retraso(i)}>
                {p}
              </span>{" "}
            </Fragment>
          ))}
          <span className="ad-palabra ad-destacado" style={{ ...retraso(palabras.length), "--giro": "-2deg" } as React.CSSProperties}>
            {destacado}
            <svg className="ad-subrayado" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M4,16 C70,6 170,4 296,10 C200,12 110,16 40,22"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 1.25, ease: "easeInOut" }}
              />
            </svg>
          </span>
        </h1>

        <motion.p
          className="ad-hero-bajada"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
        >
          {bajada}
        </motion.p>

        <motion.div
          className="ad-hero-acciones"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
        >
          <a href={cta.href} className="ad-btn ad-btn-primario">
            {cta.label}
          </a>
          <a href={ctaSecundario.href} className="ad-btn ad-btn-vidrio">
            {ctaSecundario.label}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
