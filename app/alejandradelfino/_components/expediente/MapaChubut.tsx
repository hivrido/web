"use client";

import { expediente, mapa, regionDeDepartamento, regiones } from "../../_lib/contenido";

type Props = {
  activa: string | null;
  sobre: string | null;
  onElegir: (region: string) => void;
  onSobre: (region: string | null) => void;
};

/* El mapa es una hoja apoyada en la pizarra: los departamentos del IGN
   agrupados por región. Cada región es un botón —se toca, se hace clic o se
   elige con Tab + Enter— y se ilumina con su color. */
export default function MapaChubut({ activa, sobre, onElegir, onSobre }: Props) {
  const [vx, vy, vw, vh] = mapa.viewBox;
  const resaltada = sobre ?? activa;

  return (
    <svg className="ad-mapa" viewBox={`${vx} ${vy} ${vw} ${vh}`} role="group" aria-label="Mapa de Chubut por regiones">
      {regiones.map((r) => {
        const deptos = mapa.departamentos.filter((d) => regionDeDepartamento[d.nombre] === r.id);
        const estado = r.id === activa ? "is-activa" : r.id === resaltada ? "is-sobre" : "";
        return (
          <g
            key={r.id}
            className={`ad-region ${estado}`}
            style={{ "--c": r.color } as React.CSSProperties}
            role="button"
            tabIndex={0}
            aria-pressed={r.id === activa}
            aria-label={`${r.nombre}. Produce: ${r.produce.join(", ")}.`}
            onClick={() => onElegir(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onElegir(r.id);
              }
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && onSobre(r.id)}
            onPointerLeave={(e) => e.pointerType === "mouse" && onSobre(null)}
            onFocus={() => onSobre(r.id)}
            onBlur={() => onSobre(null)}
          >
            {deptos.map((d, i) => (
              <path key={d.nombre} d={d.d} pathLength={1} className="ad-depto" style={{ "--i": i } as React.CSSProperties} />
            ))}
          </g>
        );
      })}

      <g className="ad-mapa-rotulos" aria-hidden="true">
        {mapa.departamentos.map((d) => (
          <text key={d.nombre} x={d.label[0]} y={d.label[1]}>
            {d.nombre}
          </text>
        ))}
      </g>

      {/* Donde hay gestión documentada, el marcador es el corazón del logo. */}
      <g className="ad-gestion-marcas" aria-hidden="true">
        {expediente.gestion.map((id) => {
          const p = mapa.puntos[id];
          if (!p) return null;
          return (
            <g key={id} transform={`translate(${p[0]},${p[1]})`}>
              <circle className="ad-pulso" r="14" />
              <path d="M0,7 C-12,-1 -10,-11 -4.5,-11 C-2,-11 -0.6,-9.4 0,-8 C0.6,-9.4 2,-11 4.5,-11 C10,-11 12,-1 0,7 Z" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
