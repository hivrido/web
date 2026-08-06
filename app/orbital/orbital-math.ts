/**
 * Matemática del carrusel orbital.
 *
 * Sin React ni Three.js a propósito: son funciones puras y testeables que
 * definen dónde va cada tarjeta y cuánto "peso" visual tiene.
 *
 *   angle = theta + index · spacing
 *   x = R · cos(angle)
 *   z = R · sin(angle)
 *   y = A · sin(angle · WAVE_FREQ)     ← convierte el aro en espiral
 *
 * Con la cámara sobre +Z mirando al origen, el punto más cercano es el de z
 * máximo, o sea angle = π/2. Ese es el foco.
 */

export const TAU = Math.PI * 2;

/** Ángulo en el que una tarjeta queda enfrentada a la cámara. */
export const FOCUS_ANGLE = Math.PI / 2;

export interface OrbitConfig {
  /** Cantidad de tarjetas. */
  count: number;
  /** Radio de la órbita. */
  radius: number;
  /** Amplitud de la onda vertical. 0 = aro plano. */
  waveAmplitude: number;
  /** Ciclos de la onda por vuelta. Entero, si no la espiral no cierra. */
  waveFrequency: number;
}

export interface OrbitSlot {
  angle: number;
  x: number;
  y: number;
  z: number;
  /** Rotación en Y para que la cara mire a la cámara al pasar por el foco. */
  rotationY: number;
  /** 0 al fondo, 1 al frente. */
  depth: number;
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
  return {
    angle,
    x: cfg.radius * Math.cos(angle),
    y: cfg.waveAmplitude * Math.sin(angle * cfg.waveFrequency),
    z: cfg.radius * Math.sin(angle),
    rotationY: FOCUS_ANGLE - angle,
    depth: depthFromAngle(angle),
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
