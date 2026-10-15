"use client";

import { motion } from "framer-motion";
import { expediente, type Formato } from "../../_lib/contenido";
import { alfiler, hilos, localidad, type Hilo } from "./geometria";

type Props = {
  formato: Formato;
  visible: boolean;
  /** Decide si un hilo va encendido (true), apagado (false) o neutro (null). */
  encendido: (h: Hilo) => boolean | null;
};

function Chinche({ p, chica, fill }: { p: [number, number]; chica?: boolean; fill: string }) {
  const r = chica ? 6 : 9;
  return (
    <g transform={`translate(${p[0]},${p[1]})`}>
      <ellipse cx={r * 0.5} cy={r * 0.9} rx={r} ry={r * 0.55} fill="#000" opacity="0.28" />
      <circle r={r} fill={fill} />
      <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.32} fill="#fff" opacity="0.7" />
    </g>
  );
}

/* Los hilos rojos y sus chinches, en una capa por formato: la de escritorio
   y la de celular tienen otro tablero y otras distancias. Solo se ve la que
   corresponde (lo decide el CSS), así el servidor y el cliente pintan igual. */
export default function Hilos({ formato, visible, encendido }: Props) {
  const [w, h] = expediente.tablero[formato];
  const lista = hilos(formato);
  const chinches = expediente.piezas.map((p) => alfiler(p.id, formato)).filter((p): p is [number, number] => !!p);
  const puntos = [...new Set(expediente.hilos.flat().filter((r) => r.startsWith("@")))]
    .map((r) => localidad(r.slice(1), formato))
    .filter((p): p is [number, number] => !!p);

  return (
    <svg className={`ad-hilos ad-hilos-${formato}`} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <defs>
        {/* Un id por formato: un degradado dentro de un SVG con display:none no
            se pinta, aunque otro SVG lo referencie. */}
        <radialGradient id={`ad-chinche-${formato}`} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#FF6B6B" />
          <stop offset="0.55" stopColor="#D42A2A" />
          <stop offset="1" stopColor="#7A0E12" />
        </radialGradient>
      </defs>
      {lista.map((hilo, i) => {
        const on = encendido(hilo);
        return (
          <g key={hilo.desde + hilo.hasta} className={on === true ? "is-on" : on === false ? "is-off" : ""}>
            <path d={hilo.d} className="ad-hilo-sombra" transform="translate(3 5)" />
            <motion.path
              d={hilo.d}
              className="ad-hilo"
              initial={{ pathLength: 0 }}
              animate={visible ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.9 + i * 0.07, ease: "easeInOut" }}
            />
          </g>
        );
      })}
      {puntos.map((p, i) => (
        <Chinche key={`l${i}`} p={p} chica fill={`url(#ad-chinche-${formato})`} />
      ))}
      {chinches.map((p, i) => (
        <Chinche key={`p${i}`} p={p} fill={`url(#ad-chinche-${formato})`} />
      ))}
    </svg>
  );
}
