/**
 * Geometría del símbolo H▷ de Hivrido: la H cuya segunda asta es el triángulo
 * de play.
 *
 * Hasta acá el símbolo solo existía pintado dentro de dos imágenes
 * (`hivrido-chrome.jpg` y el póster de la animación). Estas coordenadas son su
 * versión vectorial, medidas sobre ese arte y regularizadas: la barra y el
 * travesaño tienen el mismo grosor, el triángulo es simétrico respecto de su
 * eje y el hueco interior es el triángulo exterior desplazado un grosor fijo.
 *
 * Es la fuente única: de acá salen el SVG estático (lo que se ve al instante)
 * y la malla que se extruye en 3D, así que las dos versiones calzan una
 * encima de la otra sin salto.
 *
 * Unidades: el símbolo mide 2 de alto (y de -1 a 1) y está centrado en x.
 * El eje y crece hacia ARRIBA, como en 3D; `toSvg` lo da vuelta para el DOM.
 */

export type Pt = readonly [number, number];

/** Eje horizontal del triángulo de play. */
const AXIS = -0.17;
/** Borde izquierdo del triángulo: donde termina el travesaño. */
const TRI_X = -0.17;
/** Punta del triángulo. */
const APEX_X = 0.906;
/** Grosor del aro del triángulo. */
const RING = 0.244;

const TRI_TOP = AXIS + 0.83;
const TRI_BOTTOM = AXIS - 0.83;

/* El hueco: cada lado del triángulo exterior corrido `RING` hacia adentro.
   Las tres rectas desplazadas se cortan en estos tres puntos. */
const edgeLen = Math.hypot(APEX_X - TRI_X, 0.83);
const HOLE_X = TRI_X + RING;
const HOLE_HALF = 0.83 - (RING * (edgeLen + 0.83)) / (APEX_X - TRI_X);
const HOLE_APEX_X = APEX_X - (RING * edgeLen) / 0.83;

/**
 * Contorno exterior, en sentido antihorario (el sólido queda a la izquierda
 * del recorrido). Arranca en la punta superior de la barra.
 */
export const OUTER: readonly Pt[] = [
  [-0.906, 1.0],        // punta superior de la barra
  [-0.906, -1.0],       // punta inferior de la barra
  [-0.581, -0.802],     // la barra termina en bisel
  [-0.581, -0.19],      // barra ↔ travesaño (abajo)
  [TRI_X, -0.19],       // travesaño ↔ triángulo (abajo)
  [TRI_X, TRI_BOTTOM],  // vértice inferior del triángulo
  [APEX_X, AXIS],       // punta de play
  [TRI_X, TRI_TOP],     // vértice superior del triángulo
  [TRI_X, 0.12],        // travesaño ↔ triángulo (arriba)
  [-0.581, 0.12],       // barra ↔ travesaño (arriba)
  [-0.581, 0.802],      // la barra arranca en bisel
];

/**
 * Hueco del triángulo, en sentido horario: recorrido así, el sólido también
 * queda a la izquierda, y el mismo desplazamiento sirve para los dos contornos.
 */
export const HOLE: readonly Pt[] = [
  [HOLE_X, AXIS + HOLE_HALF],
  [HOLE_APEX_X, AXIS],
  [HOLE_X, AXIS - HOLE_HALF],
];

/** Caja del símbolo, para encuadrarlo. */
export const BOUNDS = { minX: -0.906, maxX: 0.906, minY: -1, maxY: 1 } as const;

/**
 * Fracción del lado del lienzo que ocupa el alto del símbolo. El resto es
 * aire para el resplandor del neón y para que el giro no se corte. El SVG y
 * la cámara 3D usan el mismo número: por eso calzan.
 */
export const FILL = 0.56;

/** Lado del viewBox del SVG. El símbolo se dibuja centrado en él. */
export const VIEW = 1000;

const toSvg = ([x, y]: Pt): string => {
  const s = (VIEW * FILL) / 2;
  return `${(VIEW / 2 + x * s).toFixed(1)} ${(VIEW / 2 - y * s).toFixed(1)}`;
};

const ring = (pts: readonly Pt[]) => `M${pts.map(toSvg).join("L")}Z`;

/** Los dos contornos como un solo `d`, para rellenar con `fill-rule: evenodd`. */
export const HMARK_PATH = `${ring(OUTER)}${ring(HOLE)}`;
/** Por separado, para trazar el neón de cada uno. */
export const HMARK_OUTER_PATH = ring(OUTER);
export const HMARK_HOLE_PATH = ring(HOLE);
