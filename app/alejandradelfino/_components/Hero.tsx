"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import HeroScene, { useProgresoHero } from "./HeroScene";
import { sitio } from "../_lib/contenido";

const EASE = [0.22, 1, 0.36, 1] as const;

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
          <span className="ad-corazon" aria-hidden="true" />
          {kicker}
        </motion.p>

        <h1 id="ad-hero-titulo" className="ad-hero-titulo">
          {palabras.map((p, i) => (
            <motion.span
              key={p + i}
              className="ad-palabra"
              initial={{ opacity: 0, y: "0.6em", rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.45 + i * 0.12, ease: EASE }}
            >
              {p}
            </motion.span>
          ))}{" "}
          <motion.span
            className="ad-palabra ad-destacado"
            initial={{ opacity: 0, y: "0.6em", rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.45 + palabras.length * 0.12, ease: EASE }}
          >
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
          </motion.span>
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
          <a href="#sumate" className="ad-btn ad-btn-primario">
            {cta}
          </a>
          <a href="#expediente" className="ad-btn ad-btn-vidrio">
            {ctaSecundario}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
