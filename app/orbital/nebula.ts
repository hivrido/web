/**
 * Nebulosas de fondo — nubes de puntos que le dan color y profundidad al vacío.
 *
 * Cada nube es una columna orgánica: los puntos se reparten a lo largo de un
 * eje vertical que serpentea, con el radio modulado por senos de distinta
 * frecuencia. Eso evita el cilindro perfecto y produce los bultos irregulares
 * que hacen que se lea como materia y no como geometría.
 *
 * La densidad usa `pow(random, 1.9)`: la mayoría de los puntos cae cerca del
 * eje y unos pocos se van lejos. Con blending aditivo eso solo ya dibuja el
 * núcleo encendido y los bordes deshilachados, sin necesidad de texturas.
 *
 * La distribución es determinista (PRNG con semilla): la composición es una
 * decisión de arte, no puede cambiar en cada recarga.
 */

import * as THREE from "three";

export interface NebulaOptions {
  /** Paleta base. Se esperan los acentos de los proyectos. */
  colors: string[];
  /** En táctiles se recortan nubes y puntos. */
  coarse: boolean;
  pixelRatio: number;
}

export interface Nebula {
  group: THREE.Group;
  update: (time: number) => void;
  dispose: () => void;
}

/**
 * Ubicación y forma de cada nube, colocadas a mano.
 * `angle`/`radius` son polares sobre el mismo plano que la órbita de tarjetas
 * (radio 5.4), así que todo lo que pase de ~7 queda por fuera del aro.
 */
interface ClusterSpec {
  angle: number;
  radius: number;
  /** Altura del centro de la columna. */
  y: number;
  height: number;
  /** Radio característico de la columna. */
  girth: number;
  /** Índices en la paleta: color dominante y secundario. */
  color: number;
  alt: number;
  /** Multiplicador de opacidad: las lejanas van más apagadas. */
  gain: number;
  /** Vueltas por segundo, con signo. */
  spin: number;
}

const CLUSTERS: ClusterSpec[] = [
  // Izquierda, cerca del aro: cian hacia violeta.
  { angle: 2.55, radius: 7.4, y: 0.2, height: 13, girth: 1.5, color: 2, alt: 3, gain: 1, spin: 0.012 },
  // Detrás del centro: la columna verde que ancla el fondo.
  { angle: -1.5, radius: 9.5, y: -0.4, height: 16, girth: 2.2, color: 4, alt: 2, gain: 0.9, spin: -0.008 },
  // Derecha, a la altura de las tarjetas: magenta.
  { angle: 0.55, radius: 7.8, y: 0.6, height: 12, girth: 1.35, color: 1, alt: 0, gain: 1.05, spin: -0.015 },
  // Muy al fondo: lavado violeta que tiñe todo el encuadre.
  { angle: 3.9, radius: 15, y: 0, height: 22, girth: 4, color: 3, alt: 7, gain: 0.5, spin: 0.005 },
  // Baja y adelante: entra por el borde inferior del cuadro.
  { angle: 1.9, radius: 6.2, y: -3.4, height: 7, girth: 1.1, color: 1, alt: 5, gain: 0.75, spin: 0.02 },
];

/** mulberry32 — PRNG chico y estable, para que la composición no cambie. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3  aColor;

  uniform float uPixel;
  uniform float uTime;

  varying vec3  vColor;
  varying float vFade;

  void main() {
    vColor = aColor;

    // Deriva mínima por punto: la nube respira sin que se note el patrón.
    vec3 p = position;
    p.y += sin(uTime * 0.35 + aPhase) * 0.18;
    p.x += cos(uTime * 0.22 + aPhase * 1.7) * 0.12;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixel * (70.0 / -mv.z);
    // Lo muy lejano se apaga: da niebla y ahorra saturar el aditivo.
    vFade = smoothstep(64.0, 10.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  uniform float uGain;
  varying vec3  vColor;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = smoothstep(0.25, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * 0.55 * uGain * vFade);
  }
`;

export function createNebula({ colors, coarse, pixelRatio }: NebulaOptions): Nebula {
  const group = new THREE.Group();
  const specs = coarse ? CLUSTERS.filter((_, i) => i !== 3 && i !== 4) : CLUSTERS;

  const clouds: { points: THREE.Points; spin: number }[] = [];
  const white = new THREE.Color(0xffffff);

  specs.forEach((spec, ci) => {
    const rand = seeded(0x9e37 + ci * 7919);

    // Las nubes grandes reciben más puntos para no quedar ralas.
    const density = coarse ? 260 : 900;
    const count = Math.round(density * spec.girth * (spec.height / 12));

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const pha = new Float32Array(count);

    const base = new THREE.Color(colors[spec.color % colors.length]);
    const alt = new THREE.Color(colors[spec.alt % colors.length]);
    const tint = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const t = i / count;

      // Eje serpenteante: dos senos desfasados por nube.
      const sx = Math.sin(t * 5.3 + ci) * 0.9 + Math.sin(t * 2.1 + ci * 3) * 1.3;
      const sz = Math.cos(t * 4.7 + ci * 2) * 1.1 + Math.sin(t * 1.7 + ci) * 0.8;

      // Perfil: gorda en el medio, afinada en las puntas, con bultos.
      const taper = 0.55 + 0.45 * Math.sin(t * Math.PI);
      const bulge = 1 + 0.5 * Math.sin(t * 11 + ci * 2);

      // pow > 1 concentra los puntos en el eje: núcleo denso, borde disperso.
      const spread = Math.pow(rand(), 1.9);
      const r = spec.girth * taper * bulge * spread;
      const a = rand() * Math.PI * 2;

      pos[i * 3] = sx + Math.cos(a) * r;
      pos[i * 3 + 1] = (t - 0.5) * spec.height + (rand() - 0.5) * 0.4;
      pos[i * 3 + 2] = sz + Math.sin(a) * r;

      // El núcleo va hacia el blanco; el borde, hacia el color secundario.
      tint.copy(base).lerp(alt, rand() * 0.55);
      tint.lerp(white, (1 - spread) * 0.45);
      tint.multiplyScalar(0.4 + 0.85 * (1 - spread));
      col[i * 3] = tint.r;
      col[i * 3 + 1] = tint.g;
      col[i * 3 + 2] = tint.b;

      siz[i] = 0.35 + Math.pow(rand(), 2) * 1.45;
      pha[i] = rand() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(siz, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(pha, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uPixel: { value: pixelRatio },
        uTime: { value: 0 },
        uGain: { value: spec.gain },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    points.position.set(
      spec.radius * Math.cos(spec.angle),
      spec.y,
      spec.radius * Math.sin(spec.angle)
    );
    // Nubes enormes y descentradas: el culling por esfera las hace parpadear.
    points.frustumCulled = false;
    // Sin renderOrder fijo: que el orden de transparencias lo resuelva la
    // distancia. Así las nubes que quedan delante del aro pasan por encima de
    // las tarjetas del fondo, como en cualquier atmósfera real.

    group.add(points);
    clouds.push({ points, spin: spec.spin });
  });

  return {
    group,
    update(time) {
      for (const c of clouds) {
        c.points.rotation.y = time * c.spin;
        (c.points.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      }
    },
    dispose() {
      for (const c of clouds) {
        c.points.geometry.dispose();
        (c.points.material as THREE.Material).dispose();
      }
      group.clear();
    },
  };
}
