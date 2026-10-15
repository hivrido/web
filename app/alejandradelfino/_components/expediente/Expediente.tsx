"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import MapaChubut from "./MapaChubut";
import Pieza from "./Pieza";
import Hilos from "./Hilos";
import Ficha, { type Seleccion } from "./Ficha";
import { vecinas, type Hilo } from "./geometria";
import { expediente, regionPorId, sitio } from "../../_lib/contenido";

const piezaPorId = Object.fromEntries(expediente.piezas.map((p) => [p.id, p]));
const regionDe = (ref: string) => (ref.startsWith("@") ? undefined : piezaPorId[ref]?.region);

function vars(f: "d" | "m") {
  const [x, y, w] = expediente.mapa[f];
  const [tw, th] = expediente.tablero[f];
  return { [`--${f}mx`]: x, [`--${f}my`]: y, [`--${f}mw`]: w, [`--${f}tw`]: tw, [`--${f}th`]: th };
}

export default function Expediente() {
  const { kicker, titulo, bajada, ayuda } = sitio.expediente;
  const seccion = useRef<HTMLElement>(null);
  const escenario = useRef<HTMLDivElement>(null);
  const visible = useInView(escenario, { once: true, amount: 0.2 });
  const reducir = useReducedMotion() ?? false;

  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [sobre, setSobre] = useState<string | null>(null);

  /* La pizarra entra recostada y se endereza a medida que llega; después
     sigue al puntero apenas, como si se pudiera mirar de costado. */
  const { scrollYProgress } = useScroll({ target: seccion, offset: ["start end", "start 0.15"] });
  const entradaX = useTransform(scrollYProgress, [0, 1], [26, 3]);
  const entradaEscala = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const punteroX = useMotionValue(0);
  const punteroY = useMotionValue(0);
  const giroY = useSpring(punteroX, { stiffness: 90, damping: 18 });
  const giroXPuntero = useSpring(punteroY, { stiffness: 90, damping: 18 });
  const giroX = useTransform<number, number>([entradaX, giroXPuntero], ([a, b]) => a + b);

  const alMover = (e: React.PointerEvent) => {
    if (reducir || e.pointerType !== "mouse" || !escenario.current) return;
    const r = escenario.current.getBoundingClientRect();
    punteroX.set(((e.clientX - r.left) / r.width - 0.5) * 9);
    punteroY.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const alSalir = () => {
    punteroX.set(0);
    punteroY.set(0);
  };

  const regionActiva = seleccion?.tipo === "region" ? seleccion.id : seleccion ? (piezaPorId[seleccion.id]?.region ?? null) : null;

  const relacionadas = useMemo(() => {
    if (!seleccion) return null;
    if (seleccion.tipo === "region") {
      return new Set(expediente.piezas.filter((p) => p.region === seleccion.id).map((p) => p.id));
    }
    return new Set([seleccion.id, ...vecinas(seleccion.id)]);
  }, [seleccion]);

  const encendido = useCallback(
    (h: Hilo) => {
      if (!seleccion) return null;
      if (seleccion.tipo === "pieza") return h.desde === seleccion.id || h.hasta === seleccion.id;
      return regionDe(h.desde) === seleccion.id || regionDe(h.hasta) === seleccion.id;
    },
    [seleccion]
  );

  const elegirPieza = useCallback((id: string) => setSeleccion({ tipo: "pieza", id }), []);
  const elegirRegion = useCallback((id: string) => setSeleccion({ tipo: "region", id }), []);
  const cerrar = useCallback(() => setSeleccion(null), []);

  const zona = sobre ?? regionActiva;

  return (
    <section ref={seccion} id="expediente" className="ad-expediente" aria-labelledby="ad-exp-titulo">
      <div className="ad-cabeza">
        <p className="ad-kicker">{kicker}</p>
        <h2 id="ad-exp-titulo" className="ad-titulo">
          {titulo}
        </h2>
        <p className="ad-bajada">{bajada}</p>
        <p className="ad-ayuda">{ayuda}</p>
      </div>

      <div ref={escenario} className="ad-escenario" onPointerMove={alMover} onPointerLeave={alSalir}>
        <motion.div
          className={`ad-pizarra ${seleccion ? "has-seleccion" : ""} ${visible ? "is-visible" : ""}`}
          style={{
            ...(vars("d") as React.CSSProperties),
            ...(vars("m") as React.CSSProperties),
            rotateX: reducir ? 0 : giroX,
            rotateY: reducir ? 0 : giroY,
            scale: reducir ? 1 : entradaEscala,
          }}
        >
          <div className="ad-corcho" aria-hidden="true" />

          <div className="ad-mapa-hoja">
            <p className="ad-mapa-zona" aria-live="polite">
              {zona ? `Zona: ${regionPorId[zona]?.nombre}` : "Chubut · por regiones"}
            </p>
            <MapaChubut activa={regionActiva} sobre={sobre} onElegir={elegirRegion} onSobre={setSobre} />
          </div>

          {expediente.piezas.map((p, i) => (
            <Pieza
              key={p.id}
              pieza={p}
              orden={i}
              visible={visible || reducir}
              onElegir={elegirPieza}
              estado={
                !relacionadas
                  ? ""
                  : seleccion?.tipo === "pieza" && seleccion.id === p.id
                    ? "is-activa"
                    : relacionadas.has(p.id)
                      ? "is-relacionada"
                      : "is-apagada"
              }
            />
          ))}

          <Hilos formato="d" visible={visible || reducir} encendido={encendido} />
          <Hilos formato="m" visible={visible || reducir} encendido={encendido} />
        </motion.div>

        <AnimatePresence>
          {seleccion && <Ficha key={`${seleccion.tipo}-${seleccion.id}`} seleccion={seleccion} onCerrar={cerrar} onElegir={setSeleccion} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
