/**
 * Matemática del carrusel orbital.
 *
 * Sin React ni Three.js a propósito: son funciones puras y testeables que
 * definen dónde va cada tarjeta y cuánto "peso" visual tiene.
 *
 *   angle = theta + index · spacing
 *   x = R · cos(angle)
 *   z = R · sin(angle)
 *   y = A · sin(FREQ · (angle − FOCUS) + phase)   ← la hélice
 *
 * Con la cámara sobre +Z mirando al origen, el punto más cercano es el de z
 * máximo, o sea angle = π/2. Ese es el foco.
 *
 * ── La doble hélice ──
 * Las tarjetas se reparten en hebras. Cada hebra recorre la misma vuelta pero
 * con la onda vertical desfasada: con dos hebras el desfase es π, así que
 * cuando una sube la otra baja. Vistas desde afuera del cilindro son dos
 * senos cruzándose, que es exactamente la silueta del ADN.
 *
 * La onda se mide desde el foco y no desde el cero absoluto. Eso hace que en
 * angle = FOCUS valga sin(phase), y como los desfases de dos hebras son 0 y π,
 * la tarjeta enfocada queda siempre a y = 0: la hélice cruza el eje justo
 * donde el usuario está mirando. Con un número impar de hebras esa propiedad
 * se pierde y el foco empieza a flotar.
 */

export const TAU = Math.PI * 2;

/** Ángulo en el que una tarjeta queda enfrentada a la cámara. */
export const FOCUS_ANGLE = Math.PI / 2;

export interface OrbitConfig {
  /** Cantidad de tarjetas. */
  count: number;
  /** Radio de la órbita. */
  radius: number;
  /** Amplitud de la hélice. 0 = aro plano. */
  waveAmplitude: number;
  /** Ciclos de la onda por vuelta. Entero, si no la hélice no cierra. */
  waveFrequency: number;
  /** Hebras entrelazadas. 2 = doble hélice tipo ADN. 1 = una sola. */
  strands: number;
  /**
   * Amplitud radial de la espira. Junto con la vertical hace que la tarjeta
   * gire alrededor del tubo del aro y no solo suba y baje: es la diferencia
   * entre un resorte y una onda plana.
   */
  coil: number;
  /** Cuánto se peralta la tarjeta siguiendo la pendiente de la hélice. */
  roll: number;
}

export interface OrbitSlot {
  angle: number;
  x: number;
  y: number;
  z: number;
  /** Rotación en Y para que la cara mire a la cámara al pasar por el foco. */
  rotationY: number;
  /** Peralte en Z: la tarjeta se inclina hacia donde sube la hélice. */
  roll: number;
  /** 0 al fondo, 1 al frente. */
  depth: number;
}

/** Desfase vertical de la hebra a la que pertenece una tarjeta. */
export function strandPhase(index: number, strands: number): number {
  return (index % strands) * (TAU / strands);
}

/** Separación angular entre tarjetas consecutivas. */
export function spacingFor(count: number): number {
  return TAU / count;
}

/**
 * Posición y orientación de una tarjeta para un theta dado.
 *
 * La rotación sale de igualar la normal del plano (+Z rotada en Y) con la
 * normal radial de la órbita: Rᵧ(φ)·(0,0,1) = (sin φ, 0, cos φ) debe valer
 * (cos angle, 0, sin angle), de donde φ = π/2 − angle.
 */
export function orbitSlot(index: number, theta: number, cfg: OrbitConfig): OrbitSlot {
  const angle = theta + index * spacingFor(cfg.count);

  // Fase de la onda, medida desde el foco para que la hélice cruce el cero
  // justo donde mira la cámara.
  const wave = cfg.waveFrequency * (angle - FOCUS_ANGLE) + strandPhase(index, cfg.strands);

  // El peralte sale de la pendiente de la hélice: d(y)/d(angle). Sin esto las
  // tarjetas suben y bajan pero siguen horizontales, y el conjunto se lee como
  // un aro que rebota en vez de una cinta que gira sobre sí misma.
  const slope = cfg.waveAmplitude * cfg.waveFrequency * Math.cos(wave);
  const depth = depthFromAngle(angle);

  // La espira separa la tarjeta del eje siguiendo el coseno, mientras la altura
  // sigue el seno: juntas trazan un círculo alrededor del tubo del aro, que es
  // lo que convierte la onda en resorte.
  //
  // Se apaga contra el foco. Altura y radio no pueden anularse a la vez —donde
  // sin vale 0, cos vale ±1—, así que hay que elegir: o la tarjeta enfocada
  // queda centrada o queda siempre a la misma distancia de la cámara. Ceder el
  // radio cerca del frente da las dos cosas, y la espira se sigue leyendo
  // entera en las tres cuartas partes del aro que quedan.
  const radius = cfg.radius + cfg.coil * Math.cos(wave) * (1 - depth * depth);

  return {
    angle,
    x: radius * Math.cos(angle),
    y: cfg.waveAmplitude * Math.sin(wave),
    z: radius * Math.sin(angle),
    rotationY: FOCUS_ANGLE - angle,
    roll: -cfg.roll * slope,
    depth,
  };
}

/**
 * Profundidad normalizada: 1 cuando la tarjeta está al frente, 0 al fondo.
 * Se deriva de z = R·sin(angle), así que basta reescalar el seno.
 */
export function depthFromAngle(angle: number): number {
  return (Math.sin(angle) + 1) * 0.5;
}

/** Escala de la tarjeta: la del frente al 100%, el resto se achica. */
export function scaleFromDepth(depth: number, min = 0.46, curve = 2.4): number {
  return min + (1 - min) * Math.pow(depth, curve);
}

/** Opacidad por profundidad: las del fondo se desvanecen. */
export function opacityFromDepth(depth: number, min = 0.1, curve = 2.6): number {
  return min + (1 - min) * Math.pow(depth, curve);
}

/** Diferencia angular más corta entre dos ángulos, en (−π, π]. */
export function shortestAngle(from: number, to: number): number {
  let d = (to - from) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d <= -Math.PI) d += TAU;
  return d;
}

/**
 * Índice que está al frente para un theta dado.
 * De theta + i·spacing ≡ π/2 se despeja i = (π/2 − theta) / spacing.
 */
export function activeIndexFor(theta: number, count: number): number {
  const raw = Math.round((FOCUS_ANGLE - theta) / spacingFor(count));
  return ((raw % count) + count) % count;
}

/** Theta exacto que deja `index` en el foco, sin resolver el ciclo. */
export function thetaForIndex(index: number, count: number): number {
  return FOCUS_ANGLE - index * spacingFor(count);
}

/** Theta más cercano al actual que deja `index` en el foco. */
export function nearestThetaForIndex(theta: number, index: number, count: number): number {
  return theta + shortestAngle(theta, thetaForIndex(index, count));
}

/** Múltiplo de `spacing` más cercano: usado para el imán al soltar. */
export function snapTheta(theta: number, count: number): number {
  const spacing = spacingFor(count);
  return Math.round((theta - FOCUS_ANGLE) / spacing) * spacing + FOCUS_ANGLE;
}

/** Interpolación lineal — el amortiguado de todo el sistema. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Lerp independiente del framerate.
 * `smoothing` es la fracción que queda sin recorrer después de 1 segundo,
 * así el movimiento se siente igual a 60 que a 144 Hz.
 */
export function damp(a: number, b: number, smoothing: number, dt: number): number {
  return lerp(a, b, 1 - Math.pow(smoothing, dt));
}
