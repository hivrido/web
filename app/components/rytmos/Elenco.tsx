"use client";

/**
 * Personajes y elenco. En escritorio cada tarjeta se inclina hacia el
 * puntero (la misma inclinación que las tarjetas de PLAY); en el teléfono la
 * fila se desliza con el dedo y encastra tarjeta por tarjeta.
 *
 * La fila es enfocable: con el teclado, las flechas la recorren.
 */

import { tilt, untilt } from "../play/PosterCard";
import { srcsetDe, type Persona } from "../../lib/rytmos";

export default function Elenco({ personas }: { personas: Persona[] }) {
  return (
    <ul className="ry-cast ry-stagger" tabIndex={0} aria-label="Personajes y elenco">
      {personas.map((p, i) => (
        <li key={p.nombre} className="ry-person" style={{ "--i": i } as React.CSSProperties}>
          <div className="ry-person-frame" onPointerMove={tilt} onPointerLeave={untilt}>
            {p.foto && (
              <picture>
                <source type="image/avif" srcSet={srcsetDe(p.foto, "avif", 1080)} sizes="(max-width: 768px) 72vw, 300px" />
                <img src={`${p.foto}-640.webp`} srcSet={srcsetDe(p.foto, "webp", 1080)} sizes="(max-width: 768px) 72vw, 300px" alt={p.personaje ? `${p.nombre} como ${p.personaje}` : p.nombre} loading="lazy" decoding="async" width={800} height={1000} />
              </picture>
            )}
          </div>
          {p.personaje && <p className="ry-person-char">{p.personaje}</p>}
          <p className={p.personaje ? "ry-person-name" : "ry-person-char"}>{p.nombre}</p>
        </li>
      ))}
    </ul>
  );
}
