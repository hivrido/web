"use client";

/**
 * El logo de RYTMOS en 3D, hecho con SVG y CSS (sin WebGL ni librerías).
 *
 * Capas, de atrás hacia adelante, dentro de un escenario 3D ortográfico:
 * - la extrusión: copias del logo corridas hacia atrás en Z, del violeta
 *   ultravioleta al negro de marca. Le dan volumen de cartel;
 * - la cara: el logo letra por letra, en cromo, con el brillo de neón;
 * - dos copias para el glitch, en neón lila y en el ámbar de PLAY, que solo
 *   aparecen en ráfagas.
 *
 * La coreografía vive en rytmos.css: las letras caen a compás, la extrusión
 * crece hacia atrás, el cartel gira hasta su pose, se inclina hacia el cursor y
 * cada tanto falla como una señal que se corta. Con movimiento reducido
 * queda quieto, con su volumen.
 *
 * Las copias usan <use> sobre un único <symbol>: el trazo viaja una vez.
 */

import { tilt, untilt } from "../play/PosterCard";
import { VIAJA } from "../play/transicion";
import { LOGO_LETRAS, LOGO_TRANSFORM, LOGO_VIEWBOX } from "./logo-trazos";

const CAPAS = 7;

export default function LogoRytmos() {
  return (
    <span className="ry-mark" style={VIAJA} aria-hidden="true">
      <svg width="0" height="0" className="ry-mark-defs" focusable="false">
        <defs>
          <symbol id="ry-logo" viewBox={LOGO_VIEWBOX}>
            <g transform={LOGO_TRANSFORM} fill="currentColor">
              {LOGO_LETRAS.map((x) => (
                <path key={x.l} d={x.d} />
              ))}
            </g>
          </symbol>
          <linearGradient id="ry-cromo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.48" stopColor="#efe8fb" />
            <stop offset="0.52" stopColor="#c9b8e6" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>

      <span className="ry-mark-tilt" onPointerMove={tilt} onPointerLeave={untilt}>
        <span className="ry-mark-stage">
          {Array.from({ length: CAPAS }, (_, i) => CAPAS - i).map((z) => (
            <svg
              key={z}
              className="ry-mark-depth"
              viewBox={LOGO_VIEWBOX}
              style={{ "--z": z, color: `color-mix(in srgb, #8246af ${Math.round(100 - (z / CAPAS) * 85)}%, #0d0717)` } as React.CSSProperties}
              focusable="false"
            >
              <use href="#ry-logo" />
            </svg>
          ))}

          <svg className="ry-mark-face" viewBox={LOGO_VIEWBOX} focusable="false">
            <g transform={LOGO_TRANSFORM} fill="url(#ry-cromo)">
              {LOGO_LETRAS.map((x) => (
                <path key={x.l} className="ry-mark-l" d={x.d} />
              ))}
            </g>
          </svg>

          <svg className="ry-mark-glitch is-a" viewBox={LOGO_VIEWBOX} focusable="false"><use href="#ry-logo" /></svg>
          <svg className="ry-mark-glitch is-b" viewBox={LOGO_VIEWBOX} focusable="false"><use href="#ry-logo" /></svg>
        </span>
      </span>
    </span>
  );
}
