"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Texto from "../Texto";
import { expediente, regionPorId, textos } from "../../_lib/contenido";

export type Seleccion = { tipo: "region" | "pieza"; id: string };

type Props = {
  seleccion: Seleccion;
  onCerrar: () => void;
  onElegir: (s: Seleccion) => void;
};

const ejes = Object.fromEntries(textos.propuestas.ejes.map((e) => [e.id, e]));

const EASE = [0.22, 1, 0.36, 1] as const;

/* La ficha del expediente: una carpeta que se abre en el centro de la
   pantalla, sobre la pizarra velada. Va por portal a .ad-root —donde viven
   las fuentes y los colores—, porque la perspectiva del escenario convierte a
   cualquier position: fixed de adentro en relativo a él. */
export default function Ficha({ seleccion, onCerrar, onElegir }: Props) {
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus({ preventScroll: true });
  }, [seleccion]);

  useEffect(() => {
    const alTeclado = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclado);
    return () => window.removeEventListener("keydown", alTeclado);
  }, [onCerrar]);

  const pieza = seleccion.tipo === "pieza" ? expediente.piezas.find((p) => p.id === seleccion.id) : undefined;
  const region = regionPorId[seleccion.tipo === "region" ? seleccion.id : (pieza?.region ?? "")];
  const eje = pieza?.eje ? ejes[pieza.eje] : undefined;
  const esGestion = !!pieza && expediente.gestion.includes(pieza.id);

  const raiz = typeof document === "undefined" ? null : document.querySelector(".ad-root");
  if (!raiz) return null;

  return createPortal(
    <motion.div
      className="ad-ficha-fondo"
      onClick={onCerrar}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.aside
          key={`${seleccion.tipo}-${seleccion.id}`}
          className="ad-ficha"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ad-ficha-titulo"
          data-lenis-prevent
          onClick={(e) => e.stopPropagation()}
          style={region ? ({ "--c": region.color } as React.CSSProperties) : undefined}
          initial={{ opacity: 0, y: 40, scale: 0.94, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 24, scale: 0.96, rotate: -1 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span className="ad-ficha-solapa" aria-hidden="true">
            {pieza ? "Pista" : "Región"}
          </span>
          <button type="button" className="ad-ficha-cerrar" onClick={onCerrar} aria-label="Cerrar ficha">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>

          {pieza?.foto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="ad-ficha-foto" src={pieza.foto} alt={pieza.titulo} width={560} height={420} />
          )}

          <h3 id="ad-ficha-titulo" ref={titulo} tabIndex={-1}>
            {pieza ? pieza.titulo : region?.nombre}
          </h3>

          {esGestion && <p className="ad-ficha-badge">Gestión documentada · 2018</p>}
          {eje && <p className="ad-ficha-badge is-borrador">Eje de propuesta · {textos.propuestas.estado}</p>}

          {pieza && <p className="ad-ficha-texto">{eje ? eje.texto : pieza.texto}</p>}

          {region && seleccion.tipo === "region" && (
            <>
              <p className="ad-ficha-meta">Departamentos: {region.departamentos.join(", ")}</p>
              <h4>Qué produce</h4>
              <ul className="ad-chips">
                {region.produce.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <h4>Identidad</h4>
              <p className="ad-ficha-texto">{region.identidad}</p>
              <h4>Qué proponemos acá</h4>
              <p className="ad-ficha-texto">
                <Texto>{region.propuesta}</Texto>
              </p>
            </>
          )}

          {region && seleccion.tipo === "pieza" && (
            <button type="button" className="ad-ficha-link" onClick={() => onElegir({ tipo: "region", id: region.id })}>
              Ver la región: {region.nombre} →
            </button>
          )}
        </motion.aside>
      </AnimatePresence>
    </motion.div>,
    raiz,
  );
}
