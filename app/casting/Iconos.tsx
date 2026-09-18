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

/* ── Íconos sueltos que usan las secciones ──────────────────────────────── */

export const IconoPin = () => (
  <svg {...base}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconoReloj = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const IconoCalendario = () => (
  <svg {...base}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
  </svg>
);

export const IconoFlecha = () => (
  <svg {...base} strokeWidth="2">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

export const IconoWhatsApp = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
