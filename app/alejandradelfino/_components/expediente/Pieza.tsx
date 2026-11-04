"use client";

import { motion } from "framer-motion";
import { Monograma } from "../Marca";
import Paisaje from "../Paisaje";
import Sello from "../Sello";
import { fotoPublicable, imagen, marca, regionPorId, type Pieza as TPieza } from "../../_lib/contenido";
import { LANZAMIENTO, ruta } from "../../_config/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  pieza: TPieza;
  orden: number;
  visible: boolean;
  estado: "" | "is-activa" | "is-relacionada" | "is-apagada";
  onElegir: (id: string) => void;
};

function vars(p: TPieza) {
  const v: Record<string, number> = {};
  for (const f of ["d", "m"] as const) {
    const pos = p[f];
    if (!pos) continue;
    [v[`--${f}x`], v[`--${f}y`], v[`--${f}w`], v[`--${f}r`]] = pos;
  }
  return v as React.CSSProperties;
}

function Contenido({ pieza }: { pieza: TPieza }) {
  switch (pieza.tipo) {
    case "foto": {
      const foto = fotoPublicable(pieza.foto);
      return (
        <>
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ruta(foto)} alt="" loading="lazy" decoding="async" width={560} height={420} />
          ) : (
            <Paisaje color={pieza.region ? regionPorId[pieza.region]?.color : undefined} />
          )}
          {foto && <Sello de={imagen(foto)} />}
          <span className="ad-pie">{pieza.titulo}</span>
        </>
      );
    }
    case "credencial":
      return (
        <>
          <span className="ad-cred-cabeza">Ficha Nº 001 · Chubut</span>
          <span className="ad-cred-cuerpo">
            {LANZAMIENTO ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ruta(marca.logo)} alt="" width={420} height={317} />
            ) : (
              <Monograma className="ad-cred-monograma" />
            )}
            <span>
              <strong>{pieza.titulo}</strong>
              <em>Dirigente política</em>
              <em>Chubut</em>
            </span>
          </span>
          {LANZAMIENTO && <span className="ad-cred-firma">{marca.firma}</span>}
        </>
      );
    case "informe":
      return (
        <>
          <span className="ad-inf-sello">Gestión</span>
          <strong className="ad-inf-titulo">{pieza.titulo}</strong>
          <span className="ad-inf-texto">{pieza.texto}</span>
          <span className="ad-inf-lineas" aria-hidden="true" />
        </>
      );
    case "nota":
      return (
        <>
          <strong>{pieza.titulo}</strong>
          <span>{pieza.texto}</span>
        </>
      );
    case "recorte":
      return (
        <>
          <span className="ad-rec-medio">Expediente Chubut</span>
          <strong>{pieza.titulo}</strong>
          <span>{pieza.texto}</span>
        </>
      );
  }
}

/* Cada pieza es un botón: abre su ficha. Va clavada de arriba al centro, así
   que gira y se levanta desde el alfiler, como un papel de verdad. */
export default function Pieza({ pieza, orden, visible, estado, onElegir }: Props) {
  const ocultar = `${pieza.d ? "" : "no-d"} ${pieza.m ? "" : "no-m"}`;
  return (
    <motion.button
      type="button"
      className={`ad-pieza ad-${pieza.tipo} ${pieza.color ? `ad-nota-${pieza.color}` : ""} ${ocultar} ${estado}`}
      style={vars(pieza)}
      aria-label={`${pieza.titulo}. Abrir ficha.`}
      onClick={() => onElegir(pieza.id)}
      initial={{ opacity: 0, scale: 1.18, y: -24 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: 0.15 + orden * 0.07, ease: EASE }}
    >
      <Contenido pieza={pieza} />
    </motion.button>
  );
}
