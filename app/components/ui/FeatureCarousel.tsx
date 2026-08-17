"use client";

/**
 * Carrusel de trabajos: lista vertical de accesos a la izquierda, pila de
 * imágenes a la derecha. Avanza solo y se detiene al pasar el puntero.
 *
 * Port del componente de referencia al stack de este proyecto: usa
 * `framer-motion` —que ya está instalado; `motion/react` es la misma librería
 * con otro nombre de paquete— y los tokens de color del sitio en lugar de los
 * de shadcn, que acá no existen. Los iconos se reemplazaron por el número de
 * cada pieza: es el gesto que ya usan los servicios, los trabajos y las
 * secciones, y ahorra una dependencia entera para seis ítems.
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type CarouselItem = {
  num: string;
  titulo: string;
  desc: string;
  img: string;
  tags?: string[];
};

const AUTO_MS = 4200;
const ITEM_H = 62;

/** Envuelve `v` dentro de [min, max) — para que la lista sea un anillo. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function FeatureCarousel({ items }: { items: CarouselItem[] }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const total = items.length;
  const current = ((step % total) + total) % total;

  const next = useCallback(() => setStep((s) => s + 1), []);
  const prev = useCallback(() => setStep((s) => s - 1), []);

  /* Umbral de arrastre: se decide con distancia y velocidad juntas, no con
     una sola. Solo por distancia, un gesto corto y rápido —el de siempre en
     un teléfono— no pasaría; solo por velocidad, arrastrar despacio media
     pantalla no haría nada. */
  const SWIPE = 55;
  const onDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    setPaused(false);
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power < -SWIPE) next();
    else if (power > SWIPE) prev();
  };

  /* Se avanza sumando pasos y no fijando el índice: así el movimiento
     siempre va hacia adelante y la lista no rebota al pasar del último al
     primero. */
  const goTo = (i: number) => {
    const diff = (i - current + total) % total;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [next, paused, reduced]);

  /** Posición de una tarjeta respecto de la activa. */
  const statusOf = (i: number) => {
    let d = i - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    if (d === 0) return "active";
    if (d === -1) return "prev";
    if (d === 1) return "next";
    return "hidden";
  };

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.8 };

  return (
    <div className="fcar">
      {/* ── Columna de accesos ── */}
      <div
        className="fcar-nav"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="fcar-nav-fade fcar-nav-fade--top" aria-hidden />
        <div className="fcar-nav-fade fcar-nav-fade--bottom" aria-hidden />

        <div className="fcar-nav-rail">
          {items.map((item, i) => {
            const d = wrap(-(total / 2), total / 2, i - current);
            const active = i === current;
            return (
              <motion.div
                key={item.num}
                className="fcar-chip-slot"
                style={{ height: ITEM_H }}
                animate={{ y: d * ITEM_H, opacity: 1 - Math.abs(d) * 0.26 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 90, damping: 22, mass: 1 }
                }
              >
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`fcar-chip${active ? " is-active" : ""}`}
                  aria-current={active}
                >
                  <span className="fcar-chip-num">{item.num}</span>
                  <span className="fcar-chip-label">{item.titulo}</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Pila de imágenes ──
           Arrastrable con dedo y con puntero. Las restricciones en cero hacen
           que la pila vuelva sola a su lugar: el gesto decide el paso, no la
           posición donde se soltó. */}
      <div className="fcar-stage">
        <motion.div
          className="fcar-deck"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          onDragStart={() => setPaused(true)}
          onDragEnd={onDragEnd}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {items.map((item, i) => {
            const st = statusOf(i);
            const active = st === "active";
            const prev = st === "prev";
            const nx = st === "next";

            return (
              <motion.article
                key={item.num}
                className={`fcar-card${active ? " is-active" : ""}`}
                initial={false}
                animate={{
                  x: active ? 0 : prev ? -92 : nx ? 92 : 0,
                  scale: active ? 1 : prev || nx ? 0.86 : 0.72,
                  opacity: active ? 1 : prev || nx ? 0.38 : 0,
                  rotate: reduced ? 0 : prev ? -3 : nx ? 3 : 0,
                  zIndex: active ? 20 : prev || nx ? 10 : 0,
                  pointerEvents: active ? "auto" : "none",
                }}
                transition={spring}
              >
                <Image
                  src={item.img}
                  alt={item.titulo}
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="fcar-card-img"
                  unoptimized
                />

                <div className="fcar-card-mark" aria-hidden>
                  <i className="fcar-card-dot" />
                  <span>{item.num}</span>
                </div>

                <AnimatePresence>
                  {active && (
                    <motion.div
                      className="fcar-card-body"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <span className="fcar-card-badge">{item.titulo}</span>
                      <p className="fcar-card-desc">{item.desc}</p>
                      {item.tags?.length ? (
                        <div className="fcar-card-tags">
                          {item.tags.map((t) => (
                            <span className="web-tag" key={t}>{t}</span>
                          ))}
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
