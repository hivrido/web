"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Molino } from "./HeroScene";
import { sitio } from "../_lib/contenido";

/* La visión, de noche: al entrar en pantalla la frase se enciende palabra por
   palabra, como un pueblo que va prendiendo las luces, y abajo el horizonte de
   molinos manda la energía por la línea. Firma con el otro lema de ella. */

const MOLINOS = [
  { x: 120, y: 300, h: 150, dur: 6.2 },
  { x: 260, y: 300, h: 196, dur: 5.2 },
  { x: 420, y: 300, h: 128, dur: 7.4 },
  { x: 1040, y: 300, h: 140, dur: 6.8 },
  { x: 1190, y: 300, h: 210, dur: 5 },
  { x: 1330, y: 300, h: 160, dur: 6 },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Manifiesto() {
  const m = sitio.manifiesto;
  const reducir = useReducedMotion() ?? false;
  const lineas = [...m.lineas.map((l) => l.split(" ")), m.destacado.split(" ")];
  /* Dónde arranca cada línea en el orden de lectura, para la cascada. */
  const inicio = lineas.map((_, n) => lineas.slice(0, n).flat().length);

  return (
    <section id="vision" className="ad-manifiesto" aria-labelledby="ad-manif-titulo">
      <div className="ad-manif-cielo" aria-hidden="true" />

      <div className="ad-manif-texto">
        <p className="ad-kicker">{m.kicker}</p>
        <motion.h2
          id="ad-manif-titulo"
          initial="apagada"
          whileInView="encendida"
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="ad-manif-antes">{m.antes}</span>
          {lineas.map((palabras, n) => (
            <span key={n} className="ad-manif-linea">
              {palabras.map((p, j) => (
                <motion.span
                  key={j}
                  className={`ad-manif-palabra ${n === lineas.length - 1 ? "ad-manif-oro" : ""}`}
                  variants={{
                    apagada: { opacity: 0.12, y: "0.2em" },
                    encendida: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.15 + (inicio[n] + j) * 0.16, ease: EASE } },
                  }}
                >
                  {p}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h2>

        <motion.p
          className="ad-manif-bajada"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          {m.bajada}
        </motion.p>

        <motion.p
          className="ad-manif-firma"
          initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 1.3, ease: EASE }}
        >
          <span className="ad-corazon" aria-hidden="true" />
          {m.firma}
        </motion.p>
      </div>

      <svg className="ad-manif-horizonte" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ad-manif-tierra" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a1d6e" />
            <stop offset="1" stopColor="#140a29" />
          </linearGradient>
        </defs>
        <path d="M0,300 Q360,286 720,294 T1440,292 V320 H0 Z" fill="url(#ad-manif-tierra)" />
        {MOLINOS.map((mo) => (
          <Molino key={mo.x} {...mo} girar={!reducir} />
        ))}
        {/* La línea que lleva la energía de los molinos al resto del país. */}
        <path className="ad-manif-linea-base" d="M120,232 C400,250 600,190 720,214 S1100,250 1330,222" />
        <path className="ad-manif-pulso" d="M120,232 C400,250 600,190 720,214 S1100,250 1330,222" />
      </svg>
    </section>
  );
}
