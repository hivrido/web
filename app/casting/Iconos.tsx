/**
 * Íconos de /casting.
 *
 * SVG inline, sin librería: son cinco trazos y traerse lucide-react para eso
 * serían decenas de kilobytes de JS en una página cuyo presupuesto entero es
 * un celular de gama media con datos móviles. Al ser componentes de servidor
 * viajan ya resueltos dentro del HTML.
 *
 * Todos decorativos: el significado lo da el título que va al lado, así que
 * van con aria-hidden y no con <title>.
 */

import type { Icono } from "./contenido";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/* Una fila de espera: tres puestos y una flecha que avanza. Tres siluetas de
   persona a 24 px se empastan hasta que no se distingue qué son. */
const Fila = () => (
  <svg {...base}>
    <circle cx="6" cy="8" r="2.4" />
    <path d="M2.5 17v-1.6A2.9 2.9 0 0 1 5.4 12.5h1.2a2.9 2.9 0 0 1 2.9 2.9V17" />
    <circle cx="14.5" cy="8" r="2.4" />
    <path d="M11 17v-1.6a2.9 2.9 0 0 1 2.9-2.9h1.2a2.9 2.9 0 0 1 2.9 2.9V17" />
    <path d="M19.5 10.5 22 13l-2.5 2.5" strokeWidth="1.9" />
  </svg>
);

/** Documento con foto. */
const Dni = () => (
  <svg {...base}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M5 16.5c.6-1.5 1.7-2.2 3-2.2s2.4.7 3 2.2" />
    <path d="M14.5 10h4.5M14.5 13h4.5M14.5 16h3" />
  </svg>
);

/** Billete tachado: no se paga. */
const Gratis = () => (
  <svg {...base}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M4 20 20 4" strokeWidth="2" />
  </svg>
);

/** Una persona grande y una chica, de la mano. */
const Menores = () => (
  <svg {...base}>
    <circle cx="8" cy="5" r="2.2" />
    <path d="M8 9v6M8 15l-2 5M8 15l2 5M5 11h6" />
    <circle cx="17" cy="10" r="1.8" />
    <path d="M17 13v4M17 17l-1.5 3M17 17l1.5 3M15 14.5h4" />
  </svg>
);

/** Cámara de video. */
const Camara = () => (
  <svg {...base}>
    <rect x="2.5" y="7" width="12" height="10" rx="2" />
    <path d="m14.5 11 5-2.8a.7.7 0 0 1 1 .6v6.4a.7.7 0 0 1-1 .6l-5-2.8z" />
    <circle cx="8.5" cy="12" r="1.2" />
  </svg>
);

const MAPA: Record<Icono, () => React.JSX.Element> = {
  fila: Fila,
  dni: Dni,
  gratis: Gratis,
  menores: Menores,
  camara: Camara,
};

export function IconoDato({ nombre }: { nombre: Icono }) {
  const Svg = MAPA[nombre];
  return <Svg />;
}
