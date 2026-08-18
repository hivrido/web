/**
 * HIVRIDO — COSMOS · Carrusel orbital
 *
 * Las tarjetas se distribuyen sobre una circunferencia alrededor del eje Y:
 *
 *     θᵢ = i · 2π/N        x = R·sin θᵢ        z = R·cos θᵢ
 *     y  = A · sin(2θᵢ)    ← onda vertical que convierte el aro en espiral
 *
 * El grupo entero gira en Y. La profundidad de cada tarjeta se deriva de
 * cos(θᵢ + rotación): 1 al frente, 0 atrás, y de ahí salen escala, opacidad
 * y brillo del borde.
 *
 * API:  const ring = await createScene(canvas, { textures, accents, onActive, onSelect })
 *       ring.goTo(i) · ring.step(±1) · ring.setOpen(bool) · ring.dispose()
 */

import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = matchMedia('(pointer: coarse)').matches;

const RADIUS = 5.7;      // radio de la órbita
const WAVE = 0.16;       // onda vertical residual (la ascensión la da el plano inclinado)
const TILT_Z = -0.28;    // inclinación del plano orbital: asciende de derecha a izquierda
const CARD_W = 2.3;      // apaisada, como las "tablets" de la referencia
const CARD_H = 1.55;
const CORNER = 0.16;
const FLOAT_LIFT = 0.14; // cuánto flota la tarjeta enfocada sobre el resto
// El plano del halo tiene que llegar hasta donde el resplandor ya vale ~0,
// si no se ve el corte recto del borde del plano.
const GLOW_PAD = 1.65;

/* ─────────────────────────── Shaders ─────────────────────────── */

const CARD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** SDF de rectángulo redondeado: da esquinas limpias y el borde neón. */
const SDF = /* glsl */ `
  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
`;

const CARD_FRAG = /* glsl */ `
  precision highp float;
  ${SDF}

  uniform sampler2D uMap;
  uniform vec3  uAccent;
  uniform vec2  uSize;
  uniform float uRadius;
  uniform float uFocus;     // 0 = al fondo, 1 = al frente
  uniform float uOpacity;
  uniform float uHover;
  uniform sampler2D uRain;    // cortina de glifos, repite en vertical
  uniform float uRainOn;      // 0 en las fichas que no la llevan
  uniform float uRainScroll;  // avanza con el tiempo: es lo que la hace caer
  uniform float uRainTile;
  varying vec2  vUv;

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRoundRect(p, uSize * 0.5, uRadius);

    const float AA = 0.008;
    float shape = smoothstep(AA, -AA, d);
    if (shape < 0.003) discard;

    vec3 tex = texture2D(uMap, vUv).rgb;

    /* Cortina de glifos. Se suma —la textura va sobre negro, asi que lo que
       vale cero no aporta luz— y cae sola: al crecer uRainScroll la muestra se
       toma mas arriba de la textura, y el contenido baja por la ficha.

       Se muestrea siempre y se apaga multiplicando por uRainOn en vez de
       ramificar con un `if`: sale mas barato y deja probado que las otras
       fichas no cambian, porque multiplicar por cero no deja resto.

       La campana hunde la lluvia en la banda del titulo: sin eso los glifos le
       pasan por encima a la tipografia y se la comen. */
    vec3 rain = texture2D(uRain, vec2(vUv.x, vUv.y * uRainTile + uRainScroll)).rgb;
    float rb = (vUv.y - 0.5) / 0.20;
    tex += rain * (1.0 - 0.72 * exp(-rb * rb)) * uRainOn;

    // Fuera de foco la tarjeta se desatura y se apaga: jerarquía sin mover nada
    float g = dot(tex, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(g) * 0.38, tex, 0.22 + 0.78 * uFocus);

    // Borde neón fino pegado al contorno interior
    float edge = smoothstep(0.0, -0.008, d) * smoothstep(-0.030, -0.010, d);
    col += uAccent * edge * (0.4 + 1.0 * uFocus + uHover * 1.0);

    // Sangrado del acento hacia adentro, muy sutil
    float inner = smoothstep(-0.22, 0.0, d) * 0.08;
    col += uAccent * inner * uFocus;

    gl_FragColor = vec4(col, shape * uOpacity);
  }
`;

const GLOW_FRAG = /* glsl */ `
  precision mediump float;
  ${SDF}

  uniform vec3  uAccent;
  uniform vec2  uPlane;    // tamaño del plano del halo
  uniform vec2  uSize;     // tamaño de la tarjeta que lo proyecta
  uniform float uRadius;
  uniform float uIntensity;
  varying vec2  vUv;

  void main() {
    vec2 p = (vUv - 0.5) * uPlane;
    float d = sdRoundRect(p, uSize * 0.5, uRadius);
    // Dentro de la tarjeta d es negativo: hay que anular el halo ahí, si no
    // exp(-max(d,0)) vale 1 en todo el interior y pinta un rectángulo sólido.
    // La compuerta es angosta para que el pico quede pegado al borde, y la
    // caída empinada para que el resplandor no se coma media pantalla.
    float glow = exp(-max(d, 0.0) * 15.0) * smoothstep(-0.004, 0.014, d);
    gl_FragColor = vec4(uAccent, glow * uIntensity);
  }
`;

/* ──────────────────────── Utilidades ──────────────────────── */

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TAU = Math.PI * 2;

/** Diferencia angular más corta entre dos ángulos, en (-π, π]. */
function shortest(from, to) {
  let d = (to - from) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

/* ═══════════════════════ Escena ═══════════════════════ */

export async function createScene(canvas, { textures, accents, plays, rains, rainTile = 1, onActive, onSelect, onPlay, insets, start = 0 } = {}) {
  const N = textures.length;
  const STEP = TAU / N;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: (window.devicePixelRatio || 1) < 2,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('[cosmos] WebGL no disponible', err);
    canvas.style.display = 'none';
    return { supported: false, goTo() {}, step() {}, setOpen() {}, dispose() {} };
  }

  const DPR_CAP = COARSE ? 1.5 : 1.8;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x04040a, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 120);

  /* ────────── Fondo estrellado ────────── */
  {
    const COUNT = COARSE ? 1200 : 2800;
    const pos = new Float32Array(COUNT * 3);
    const siz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 16 + Math.random() * 44;
      const th = Math.random() * TAU;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.8;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      siz[i] = 0.3 + Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));

    const stars = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: { uPixel: { value: renderer.getPixelRatio() } },
      vertexShader: `
        attribute float aSize;
        uniform float uPixel;
        varying float vS;
        void main() {
          vS = aSize;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixel * (90.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        precision mediump float;
        varying float vS;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = dot(c, c);
          if (d > 0.25) discard;
          gl_FragColor = vec4(vec3(1.0, 0.96, 1.0), smoothstep(0.25, 0.0, d) * (0.18 + vS * 0.5));
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    stars.frustumCulled = false;
    scene.add(stars);
    scene.userData.stars = stars;
  }

  /* ────────── Polvo cercano ────────── */
  {
    const COUNT = COARSE ? 120 : 320;
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(g, new THREE.PointsMaterial({
      size: 0.035,
      color: 0xc9a6ff,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    dust.frustumCulled = false;
    scene.add(dust);
    scene.userData.dust = dust;
  }

  /* ────────── Nebulosa: cúmulos de partículas de color ──────────
     Nubes gaussianas repartidas alrededor de la órbita, en la paleta de los
     proyectos. Es lo que hace que las tarjetas floten "dentro" de algo. */
  {
    const CLUMPS = COARSE ? 4 : 7;
    const PER = COARSE ? 150 : 420;
    const COUNT = CLUMPS * PER;
    const palette = ['#B026FF', '#FF2E9A', '#FF3355', '#00E5FF', '#7C3AED']
      .map((c) => new THREE.Color(c));

    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const siz = new Float32Array(COUNT);
    const pha = new Float32Array(COUNT);
    // Suma de uniformes ≈ gaussiana: los cúmulos quedan densos al centro
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    let k = 0;
    for (let c = 0; c < CLUMPS; c++) {
      const a = (c / CLUMPS) * TAU + Math.random() * 0.8;
      const r = RADIUS * (1.05 + Math.random() * 0.7);
      const cx = r * Math.sin(a);
      const cz = r * Math.cos(a);
      const cy = (Math.random() - 0.5) * 2.6;
      const tint = palette[c % palette.length];
      const spread = 1.1 + Math.random() * 0.9;

      for (let i = 0; i < PER; i++, k++) {
        pos[k * 3]     = cx + gauss() * spread * 1.7;
        pos[k * 3 + 1] = cy + gauss() * spread * 0.85;
        pos[k * 3 + 2] = cz + gauss() * spread * 1.7;
        const shade = 0.5 + Math.random() * 0.5;
        col[k * 3]     = tint.r * shade;
        col[k * 3 + 1] = tint.g * shade;
        col[k * 3 + 2] = tint.b * shade;
        siz[k] = 0.5 + Math.random() * 1.8;
        pha[k] = Math.random() * TAU;
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1));

    const nebula = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uPixel: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixel;
        varying vec3 vC;
        varying float vA;
        void main() {
          vC = aColor;
          vec3 p = position;
          p.x += sin(uTime * 0.35 + aPhase) * 0.24;
          p.y += cos(uTime * 0.28 + aPhase * 1.7) * 0.17;
          p.z += sin(uTime * 0.22 + aPhase * 0.9) * 0.24;
          vA = 0.55 + 0.45 * sin(uTime * (0.6 + fract(aPhase) * 0.8) + aPhase * 3.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * uPixel * (34.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        precision mediump float;
        varying vec3 vC;
        varying float vA;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = dot(c, c);
          if (d > 0.25) discard;
          float a = smoothstep(0.25, 0.0, d);
          gl_FragColor = vec4(vC, a * a * 0.55 * vA);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    nebula.frustumCulled = false;
    scene.add(nebula);
    scene.userData.nebula = nebula;
  }

  /* ────────── Corazón de la nebulosa: glows volumétricos ────────── */
  {
    const makeGlow = (hex, w, h, x, y, z, opacity) => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g2 = c.getContext('2d');
      const grad = g2.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, hex);
      grad.addColorStop(1, 'transparent');
      g2.fillStyle = grad;
      g2.fillRect(0, 0, 256, 256);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
      spr.scale.set(w, h, 1);
      spr.position.set(x, y, z);
      scene.add(spr);
    };
    makeGlow('rgba(124,58,237,0.6)', 26, 15, 0, -0.6, -7, 0.34);
    makeGlow('rgba(255,46,154,0.5)', 15, 10, -5, 1.4, -9, 0.2);
  }

  /* ────────── ADN tecnológico central ──────────
     Doble hélice volumétrica en el eje de la escena. Cada hebra es una nube
     de partículas alrededor de la curva (grosor real, no una línea), con
     nodos brillantes en las uniones, peldaños, un aura orbitando y pulsos
     de luz que trepan por la columna vía shader. Al girar sobre su eje el
     patrón "atornilla" hacia arriba. */
  {
    const TURNS = 2.8;
    const HEIGHT = 11;
    const R_HELIX = 1.15;
    /* El teléfono va más denso y más grueso que el escritorio, no menos: sin
       bloom —solo corre en ≥900 y puntero fino— la columna se leía rala y
       plana, y es lo único que ocupa el centro de una pantalla vertical. El
       costo es relleno, no geometría: son puntos con un shader de doce
       líneas, y el DPR está capado a 1.5. */
    const STEPS = COARSE ? 290 : 330;     // muestras por hebra
    const CLOUD = COARSE ? 8 : 6;         // partículas por muestra: la densidad
    const SPREAD = COARSE ? 0.17 : 0.13;  // radio de la nube: el grosor del tubo
    const PT = COARSE ? 1.25 : 1;         // escala de partícula
    const RUNGS = COARSE ? 26 : 30;       // estructura: marca el paso de la hélice
    const RUNG_PTS = 18;
    const AURA = COARSE ? 760 : 840;
    const COUNT = STEPS * CLOUD * 2 + RUNGS * (RUNG_PTS + 2) + AURA;

    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const siz = new Float32Array(COUNT);
    const pha = new Float32Array(COUNT);

    const violet = new THREE.Color('#B026FF');
    const violetDeep = new THREE.Color('#7C3AED');
    const cyan = new THREE.Color('#00E5FF');
    const white = new THREE.Color('#f2f0f7');
    const magenta = new THREE.Color('#FF2E9A');

    const setPt = (k, x, y, z, tint, size) => {
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z;
      col[k * 3] = tint.r; col[k * 3 + 1] = tint.g; col[k * 3 + 2] = tint.b;
      siz[k] = size;
      pha[k] = Math.random() * TAU;
    };

    const angleAt = (t) => TURNS * TAU * t;
    const yAt = (t) => (t - 0.5) * HEIGHT;
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    let k = 0;
    const tmp = new THREE.Color();

    // Hebras con volumen: nube gaussiana alrededor de la curva
    for (let s = 0; s < 2; s++) {
      const base = s === 0 ? violet : cyan;
      const deep = s === 0 ? violetDeep : white;
      for (let i = 0; i < STEPS; i++) {
        const t = i / (STEPS - 1);
        const a = angleAt(t) + s * Math.PI;
        const cx = Math.cos(a) * R_HELIX;
        const cz = Math.sin(a) * R_HELIX;
        const cy = yAt(t);
        for (let j = 0; j < CLOUD; j++, k++) {
          tmp.copy(base).lerp(deep, Math.random() * 0.6);
          setPt(k,
            cx + gauss() * SPREAD,
            cy + gauss() * SPREAD * 0.77,
            cz + gauss() * SPREAD,
            tmp, (0.6 + Math.random() * 1.2) * PT);
        }
      }
    }

    // Peldaños + nodos brillantes en las uniones
    for (let r = 0; r < RUNGS; r++) {
      const t = (r + 0.5) / RUNGS;
      const a = angleAt(t);
      const y = yAt(t);
      const x1 = Math.cos(a) * R_HELIX, z1 = Math.sin(a) * R_HELIX;
      for (let j = 0; j < RUNG_PTS; j++, k++) {
        const f = (j + 0.5) / RUNG_PTS;         // interpola entre hebras opuestas
        tmp.copy(violet).lerp(cyan, f).multiplyScalar(0.55);
        setPt(k, lerp(x1, -x1, f), y, lerp(z1, -z1, f), tmp, (0.45 + Math.random() * 0.4) * PT);
      }
      // Los dos extremos del peldaño son nodos casi blancos y grandes
      tmp.copy(white).lerp(violet, 0.25);
      setPt(k++, x1, y, z1, tmp, 2.3 * PT);
      tmp.copy(white).lerp(cyan, 0.25);
      setPt(k++, -x1, y, -z1, tmp, 2.3 * PT);
    }

    // Aura: polvo orbitando la columna en un cilindro más ancho
    for (let i = 0; i < AURA; i++, k++) {
      const a = Math.random() * TAU;
      const r = R_HELIX * (1.3 + Math.random() * 1.5);
      tmp.copy(Math.random() < 0.5 ? violet : magenta).multiplyScalar(0.4 + Math.random() * 0.3);
      setPt(k,
        Math.cos(a) * r,
        (Math.random() - 0.5) * HEIGHT * 1.05,
        Math.sin(a) * r,
        tmp, (0.35 + Math.random() * 0.6) * PT);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1));

    const dna = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uPixel: { value: renderer.getPixelRatio() },
        // El teléfono no tiene bloom: el destello se compensa acá
        uPulse: { value: COARSE ? 2.6 : 1.6 },
        uGain:  { value: COARSE ? 1.32 : 1 },
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixel;
        varying vec3 vC;
        varying float vA;
        varying float vW;
        void main() {
          vec3 p = position;
          // Respiración leve de toda la columna
          p.x += sin(uTime * 0.5 + aPhase) * 0.05;
          p.z += cos(uTime * 0.4 + aPhase * 1.3) * 0.05;
          // Pulso de energía que trepa: onda en Y restando el tiempo
          vW = pow(0.5 + 0.5 * sin(p.y * 1.25 - uTime * 2.4 + aPhase * 0.12), 3.0);
          vC = aColor;
          vA = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * uPixel * (30.0 / -mv.z) * (1.0 + 0.9 * vW);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        precision mediump float;
        uniform float uPulse;
        uniform float uGain;
        varying vec3 vC;
        varying float vA;
        varying float vW;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = dot(c, c);
          if (d > 0.25) discard;
          float a = smoothstep(0.25, 0.0, d);
          // En el pico del pulso la partícula vira a blanco y sobreexpone: con
          // bloom eso se convierte en el destello que sube por la hélice. Sin
          // bloom lo compensan uPulse —quema más el pico— y uGain, que sube la
          // intensidad de todos: al ser aditivo, los puntos superpuestos se
          // suman y el halo aparece solo, sin un pase de post extra.
          vec3 col = mix(vC, vec3(0.98, 0.96, 1.0), vW * 0.6);
          gl_FragColor = vec4(col * (1.0 + uPulse * vW), a * (0.5 + 0.5 * vA) * uGain);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    dna.frustumCulled = false;
    scene.add(dna);
    scene.userData.dna = dna;

    // Beam central: columna de luz vertical detrás de la hélice
    const bc = document.createElement('canvas');
    bc.width = 128; bc.height = 512;
    const bctx = bc.getContext('2d');
    const bh = bctx.createLinearGradient(0, 0, 128, 0);
    bh.addColorStop(0, 'rgba(124,58,237,0)');
    bh.addColorStop(0.5, 'rgba(167,139,250,0.9)');
    bh.addColorStop(1, 'rgba(124,58,237,0)');
    bctx.fillStyle = bh;
    bctx.fillRect(0, 0, 128, 512);
    const bv = bctx.createLinearGradient(0, 0, 0, 512);
    bv.addColorStop(0, 'rgba(0,0,0,0)');
    bv.addColorStop(0.25, 'rgba(0,0,0,1)');
    bv.addColorStop(0.75, 'rgba(0,0,0,1)');
    bv.addColorStop(1, 'rgba(0,0,0,0)');
    bctx.globalCompositeOperation = 'destination-in';
    bctx.fillStyle = bv;
    bctx.fillRect(0, 0, 128, 512);
    const beam = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(bc),
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    beam.scale.set(2.7, 13, 1);
    scene.add(beam);
  }

  /* ────────── Anillo de tarjetas ──────────
     El anillo gira en Y dentro de un grupo padre inclinado en Z: la órbita
     queda como un plano diagonal — las tarjetas ascienden hacia un costado
     y descienden por el otro, con la del frente siempre a la misma altura. */
  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.z = TILT_Z;
  tiltGroup.rotation.x = -0.055;     // leve inclinación: se ve la órbita, no un friso
  scene.add(tiltGroup);

  const ring = new THREE.Group();
  tiltGroup.add(ring);

  /* El sampler necesita algo valido aunque la ficha no lleve lluvia: un pixel
     negro, que sumado no aporta nada. */
  const noRain = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  noRain.needsUpdate = true;
  const rainCards = [];

  const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
  const glowGeo = new THREE.PlaneGeometry(CARD_W * GLOW_PAD, CARD_H * GLOW_PAD, 1, 1);

  const cards = [];

  for (let i = 0; i < N; i++) {
    const theta = i * STEP;
    const accent = new THREE.Color(accents[i]);

    const holder = new THREE.Group();
    holder.position.set(
      RADIUS * Math.sin(theta),
      Math.sin(theta * 2) * WAVE,
      RADIUS * Math.cos(theta)
    );
    holder.rotation.y = theta;       // mira hacia afuera: al frente queda de cara

    const uniforms = {
      uMap:     { value: textures[i] },
      uAccent:  { value: accent },
      uSize:    { value: new THREE.Vector2(CARD_W, CARD_H) },
      uRadius:  { value: CORNER },
      uFocus:   { value: 0 },
      uOpacity: { value: 1 },
      uHover:   { value: 0 },
      uRain:       { value: rains?.[i] ?? noRain },
      uRainOn:     { value: rains?.[i] ? 1 : 0 },
      // Fase al azar: dos fichas con lluvia no caerian sincronizadas
      uRainScroll: { value: Math.random() },
      uRainTile:   { value: rainTile },
    };
    if (rains?.[i]) rainCards.push(uniforms);

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: CARD_VERT,
      fragmentShader: CARD_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(cardGeo, mat);
    mesh.userData.index = i;
    holder.add(mesh);

    // Halo detrás
    const glowUniforms = {
      uAccent:    { value: accent },
      uPlane:     { value: new THREE.Vector2(CARD_W * GLOW_PAD, CARD_H * GLOW_PAD) },
      uSize:      { value: new THREE.Vector2(CARD_W, CARD_H) },
      uRadius:    { value: CORNER },
      uIntensity: { value: 0 },
    };
    const glow = new THREE.Mesh(glowGeo, new THREE.ShaderMaterial({
      uniforms: glowUniforms,
      vertexShader: CARD_VERT,
      fragmentShader: GLOW_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    glow.position.z = -0.05;
    glow.raycast = () => {};
    holder.add(glow);

    /* PLAY: plano propio delante de la tarjeta, para poder animarla. Solo lo
       llevan los proyectos con algo publicado que ver.

       La proporción sale del tamaño real de la textura y no de una constante,
       para que cambiar la forma del botón no obligue a tocar la escena. */
    let play = null;
    let playGlow = null;
    if (plays?.[i]) {
      const src = plays[i].image;
      const pAspect = src.width / src.height;
      const ph = CARD_H * 0.2;
      const pgeo = new THREE.PlaneGeometry(ph * pAspect, ph, 1, 1);
      play = new THREE.Mesh(pgeo, new THREE.MeshBasicMaterial({
        map: plays[i],
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }));
      // Pegado al logotipo, no flotando a media tarjeta: los dos se leen como
      // una sola unidad —marca y acción— y no como dos elementos sueltos.
      play.position.set(0, -CARD_H * 0.17, 0.014);
      play.userData.play = i;
      holder.add(play);

      /* Copia aditiva encima, con la misma textura: al subirle la opacidad,
         lo dibujado —aro y letra— se suma sobre sí mismo y se enciende, y lo
         transparente no aporta nada. Es la forma barata de iluminar el borde
         sin una segunda textura ni un shader propio. */
      playGlow = new THREE.Mesh(pgeo, new THREE.MeshBasicMaterial({
        map: plays[i],
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }));
      playGlow.position.set(0, -CARD_H * 0.17, 0.015);
      playGlow.raycast = () => {};        // el click lo recibe el plano de abajo
      holder.add(playGlow);
    }

    ring.add(holder);
    cards.push({
      holder, mesh, uniforms, glowUniforms, theta,
      play, playGlow, playHover: 0, playPress: 0,
    });
  }

  /* ────────── Cometa del contorno ──────────
     La luz que recorre el borde de la tarjeta enfocada: una bola de energía
     en la punta y una cola fina que se apaga hacia atrás. Son sprites
     aditivos sobre el contorno, pero tan solapados —el espaciado es una
     fracción del diámetro— y de caída tan blanda que se funden en un haz
     continuo: no se lee ningún punto suelto. Las posiciones se calculan en
     JS sobre el contorno redondeado y el objeto se cuelga de la tarjeta con
     más foco, así hereda giro y escala. */
  const COMET_N = 260;
  const COMET_TAIL = 0.38;   // fracción del contorno que ocupa la cola
  const COMET_SPEED = 0.22;  // vueltas por segundo

  /** Punto (x, y) a la fracción t del contorno redondeado, antihorario. */
  const cometPath = (() => {
    const hw = CARD_W / 2, hh = CARD_H / 2, r = CORNER;
    const iw = CARD_W - 2 * r, ih = CARD_H - 2 * r;
    const arc = (Math.PI / 2) * r;
    const L = 2 * (iw + ih) + 4 * arc;
    return (t, out) => {
      let s = (((t % 1) + 1) % 1) * L;
      if (s < ih) { out.set(hw, s - (hh - r)); return; } s -= ih;
      if (s < arc) { const a = s / r; out.set(hw - r + r * Math.cos(a), hh - r + r * Math.sin(a)); return; } s -= arc;
      if (s < iw) { out.set(hw - r - s, hh); return; } s -= iw;
      if (s < arc) { const a = Math.PI / 2 + s / r; out.set(-(hw - r) + r * Math.cos(a), hh - r + r * Math.sin(a)); return; } s -= arc;
      if (s < ih) { out.set(-hw, hh - r - s); return; } s -= ih;
      if (s < arc) { const a = Math.PI + s / r; out.set(-(hw - r) + r * Math.cos(a), -(hh - r) + r * Math.sin(a)); return; } s -= arc;
      if (s < iw) { out.set(-(hw - r) + s, -hh); return; } s -= iw;
      const a = 1.5 * Math.PI + s / r;
      out.set(hw - r + r * Math.cos(a), -(hh - r) + r * Math.sin(a));
    };
  })();

  const comet = (() => {
    const pos = new Float32Array(COMET_N * 3);
    const fr = new Float32Array(COMET_N);   // 0 = punta, 1 = final de la cola
    const siz = new Float32Array(COMET_N);

    for (let i = 0; i < COMET_N; i++) {
      const f = i / (COMET_N - 1);
      fr[i] = f;
      /* Taper parejo y sin azar: para que los sprites se fundan en un haz,
         los vecinos tienen que medir casi lo mismo — cualquier varianza se
         lee como grumos en la línea. Fino de punta a cola, con la cabeza
         apenas por encima del cuerpo. */
      siz[i] = 0.34 + 1.55 * Math.pow(1 - f, 1.5);
      pos[i * 3 + 2] = 0.02;               // apenas delante de la tarjeta
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aF', new THREE.BufferAttribute(fr, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));

    const pts = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: {
        uPixel:  { value: renderer.getPixelRatio() },
        uTime:   { value: 0 },
        uAccent: { value: new THREE.Color(accents[0]) },
        uOp:     { value: 0 },
      },
      vertexShader: `
        attribute float aF;
        attribute float aSize;
        uniform float uPixel;
        uniform float uTime;
        varying float vF;
        varying float vTw;
        void main() {
          vF = aF;
          // Onda suave que viaja por el haz, no titileo por punto: los
          // sprites están fundidos y cualquier azar por partícula se vería
          // como ruido dentro de la línea.
          vTw = 0.92 + 0.08 * sin(uTime * 2.6 - aF * 16.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixel * (30.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        precision mediump float;
        uniform vec3 uAccent;
        uniform float uOp;
        varying float vF;
        varying float vTw;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = dot(c, c);
          if (d > 0.25) discard;
          // Caída blanda hasta cero en el borde del sprite: sin disco duro,
          // los solapados se suman en un tubo de luz y no en una ristra de
          // pelotitas. La alpha por sprite baja a compensar la suma.
          float a = pow(max(0.0, 1.0 - d * 4.0), 2.0);
          // Solo la punta vira a blanco y sobreexpone: la bola de energía.
          // La cola queda en el acento puro y se apaga hacia atrás.
          float head = pow(1.0 - vF, 6.0);
          vec3 col = mix(uAccent, vec3(1.0), 0.15 + 0.85 * head);
          float fade = pow(1.0 - vF, 1.5);
          gl_FragColor = vec4(col * (1.0 + 1.8 * head), a * fade * vTw * uOp * 0.42);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    pts.raycast = () => {};
    pts.frustumCulled = false;
    pts.visible = false;
    return pts;
  })();
  const v2 = new THREE.Vector2();   // scratch del cometa: cero basura por frame

  /* ────────── Encuadre responsivo ──────────
     La cámara retrocede lo necesario para que la tarjeta del frente entre
     entera, y se centra en el espacio libre real: el que queda entre el
     header y la barra inferior del HUD (via `insets`), compensando además
     el corrimiento en X/Y que la inclinación del plano orbital le imprime
     a la tarjeta frontal. Sin esto, la tarjeta queda alta y descentrada. */
  const center = { x: 0, y: 0 };
  let baseZ = RADIUS + 5;

  /* Cuánto del espacio libre llena la CAJA de la tarjeta frontal, por tipo
     de pantalla. La caja, no la tarjeta: el plano orbital está inclinado
     16° y la tarjeta gira con él, así que lo que hay que encajar entre
     header y pie es su envolvente rotada —un 37% más alta que la tarjeta—.
     Con fracciones sobre el alto nominal, escritorio ocupaba el 107% del
     espacio libre: tocaba el menú por construcción y ningún corrimiento lo
     salvaba. Mobile y tablet conservan el tamaño que ya tenían: son las
     fracciones viejas convertidas a caja.

     `down` corre la composición hacia abajo, como fracción del espacio
     libre: aire extra bajo el header, donde el glow de la tarjeta pega
     contra el borde oscuro de la barra. */
  function framing() {
    if (innerWidth < 640) return { w: 0.92, h: 0.82, down: 0 };            // mobile
    if (COARSE || innerWidth < 1024) return { w: 0.83, h: 0.91, down: 0 };  // tablet
    return { w: 0.9, h: innerWidth >= 1600 ? 0.89 : 0.85, down: 0.035 };    // escritorio
  }

  function fit() {
    const halfTan = Math.tan((camera.fov * Math.PI) / 360);
    const inset = insets?.() ?? { top: 0, bottom: 0 };
    const availH = Math.max(200, innerHeight - inset.top - inset.bottom);

    const { w: fracW, h: fracH, down } = framing();
    // Envolvente de la tarjeta rotada por la inclinación del plano orbital:
    // es esto lo que tiene que entrar en el espacio libre, no CARD_W×CARD_H.
    const cz = Math.cos(TILT_Z), sz = Math.abs(Math.sin(TILT_Z));
    const boxH = CARD_H * cz + CARD_W * sz;
    const boxW = CARD_W * cz + CARD_H * sz;
    const needH = boxH / ((fracH * availH) / innerHeight) / (2 * halfTan);
    const needW = boxW / fracW / (2 * halfTan * camera.aspect);
    const dist = clamp(Math.max(needW, needH), 3.2, 13);

    // Posición real de la tarjeta frontal una vez inclinado el plano orbital
    const front = new THREE.Vector3(0, FLOAT_LIFT, RADIUS).applyEuler(tiltGroup.rotation);
    baseZ = front.z + dist;

    // Corrimiento vertical: centrar en el espacio libre, no en el viewport.
    // Subir la cámara baja la tarjeta en pantalla: de ahí el signo de `down`.
    const worldPerPx = (2 * dist * halfTan) / innerHeight;
    center.x = front.x;
    center.y = front.y
      + ((inset.top - inset.bottom) / 2) * worldPerPx
      + down * availH * worldPerPx;

    camera.position.set(center.x, center.y, baseZ);
    camera.lookAt(center.x, center.y, 0);
  }
  fit();

  /* ────────── Bloom ────────── */
  let composer = null;
  if (!COARSE && innerWidth >= 900) {
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] = await Promise.all([
        import('three/addons/postprocessing/EffectComposer.js'),
        import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js'),
      ]);
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(innerWidth, innerHeight), 0.52, 0.8, 0.58
      ));
      composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
      composer.setSize(innerWidth, innerHeight);
    } catch (err) {
      console.warn('[cosmos] Bloom desactivado', err);
    }
  }

  /* ═══════════ Física de la rotación ═══════════ */
  // El anillo nace ya girado al proyecto de arranque: sin animación de
  // acomodo, la primera imagen es directamente ese proyecto al frente.
  const startIdx = ((start % N) + N) % N;
  let angle = -startIdx * STEP;   // rotación del anillo
  let vel = 0;                    // velocidad angular
  let target = angle;             // ángulo al que converge (null = giro libre)
  let active = startIdx;
  let opened = false;

  const indexFromAngle = (a) => ((Math.round(-a / STEP) % N) + N) % N;

  /** Arranca el pulso del PLAY; el frame lo consume y lo apaga. */
  const pressPlay = (i) => { if (cards[i]) cards[i].playPress = 1; };

  function goTo(i) {
    const wanted = -(((i % N) + N) % N) * STEP;
    target = angle + shortest(angle, wanted);
  }

  function stepBy(dir) {
    // Encadena desde el destino pendiente, no desde el ángulo en vuelo: si no,
    // dos clicks seguidos redondean al mismo slot y avanzan uno solo.
    const base = target !== null ? Math.round(target / STEP) : Math.round(angle / STEP);
    target = (base - dir) * STEP;
  }

  /* ═══════════ Entrada ═══════════ */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let downAt = 0;
  let hovered = -1;
  let playHovered = -1;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  /* Devuelve la tarjeta bajo el puntero y si el impacto cayó sobre su PLAY.
     El PLAY solo entra al raycast cuando está realmente visible: si no, se
     podría hacer click en una pastilla transparente de una tarjeta del fondo. */
  function pick(clientX, clientY) {
    ndc.set((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);

    const objs = [];
    for (const c of cards) {
      objs.push(c.mesh);
      if (c.play && c.play.material.opacity > 0.35) objs.push(c.play);
    }
    const hits = raycaster.intersectObjects(objs, false);
    if (!hits.length) return { index: -1, play: false };

    const o = hits[0].object;
    return o.userData.play != null
      ? { index: o.userData.play, play: true }
      : { index: o.userData.index, play: false };
  }

  addEventListener('pointermove', (e) => {
    ptr.tx = (e.clientX / innerWidth) * 2 - 1;
    ptr.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  canvas.addEventListener('pointerdown', (e) => {
    if (opened) return;
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    downAt = performance.now();
    target = null;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('dragging');
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) {
      if (!opened && !COARSE) {
        const h = pick(e.clientX, e.clientY);
        hovered = h.index;
        playHovered = h.play ? h.index : -1;
        canvas.style.cursor = h.index >= 0 ? 'pointer' : 'grab';
      }
      return;
    }
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    vel = dx * 0.0055;    // la ficha agarrada sigue al dedo
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('dragging');
    if (e?.pointerId != null && canvas.hasPointerCapture?.(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    // Click limpio: poco desplazamiento y poca duración
    if (moved < 8 && performance.now() - downAt < 600 && e) {
      const h = pick(e.clientX, e.clientY);
      if (h.index >= 0) {
        // El PLAY solo dispara en la tarjeta que ya está al frente: si no,
        // un click en una tarjeta lateral navegaría sin querer.
        if (h.play && h.index === active) { pressPlay(h.index); onPlay?.(h.index); }
        else if (h.index === active) onSelect?.(h.index);
        else goTo(h.index);
      }
    }
  }

  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  addEventListener('wheel', (e) => {
    if (opened) return;
    target = null;
    vel -= (e.deltaY + e.deltaX) * 0.00028;   // scroll hacia abajo = avanzar
    vel = clamp(vel, -0.09, 0.09);
  }, { passive: true });

  /* ═══════════ Resize ═══════════ */
  let resizeId;
  const onResize = () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(() => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
      renderer.setSize(innerWidth, innerHeight, false);
      if (composer) composer.setSize(innerWidth, innerHeight);
      fit();
    }, 130);
  };
  addEventListener('resize', onResize, { passive: true });

  /* ═══════════ Bucle ═══════════ */
  let raf = 0;
  let running = true;
  let last = performance.now();
  let time = 0;
  let openMix = 0;
  let fps = 60, fpsAcc = 0, fpsN = 0, fpsClock = 0;

  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    /* Lo unico que cuesta animar la lluvia: correr la coordenada de muestreo.
       No hay canvas que redibujar ni textura que volver a subir a la GPU.

       Acotado a [0,1) y no dejandolo crecer: la textura repite con periodo 1,
       asi que el corte es invisible, y en las GPU donde `highp` en el fragment
       cae a `mediump` un valor grande pierde la parte decimal y la lluvia
       empieza a saltar a los pocos minutos. */
    for (const u of rainCards) u.uRainScroll.value = (u.uRainScroll.value + dt * 0.12) % 1;

    /* — Rotación: arrastre → inercia → imán al slot más cercano — */
    if (dragging) {
      vel *= 0.9;
    } else if (target !== null) {
      vel += shortest(angle, target) * 0.085;
      vel *= 0.76;
    } else {
      vel *= 0.955;
      if (Math.abs(vel) < 0.006) target = Math.round(angle / STEP) * STEP;
    }
    angle += vel;
    ring.rotation.y = angle;

    const idx = indexFromAngle(angle);
    if (idx !== active) { active = idx; onActive?.(active); }

    /* — Profundidad de cada tarjeta — */
    let cometBest = 0, cometIdx = 0;
    for (let i = 0; i < N; i++) {
      const c = cards[i];
      // cos(θ + rotación): 1 al frente de la cámara, -1 al fondo
      const depth = (Math.cos(c.theta + angle) + 1) * 0.5;
      const focus = Math.pow(depth, 2.4);

      // Caída marcada: la del frente tiene que dominar la composición
      const s = 0.46 + 0.54 * focus;
      c.holder.scale.setScalar(s);

      c.uniforms.uFocus.value = focus;
      c.uniforms.uOpacity.value = 0.12 + 0.88 * Math.pow(depth, 2.6);
      c.uniforms.uHover.value = lerp(
        c.uniforms.uHover.value,
        hovered === i && !dragging ? 0.5 : 0,
        0.15
      );

      c.glowUniforms.uIntensity.value = 0.5 * Math.pow(depth, 3.2) * (1 - openMix * 0.5);

      if (focus > cometBest) { cometBest = focus; cometIdx = i; }

      // La tarjeta enfocada flota apenas por encima del resto
      c.holder.position.y = Math.sin(c.theta * 2) * WAVE + focus * FLOAT_LIFT;

      /* — PLAY: respiración lenta, no parpadeo —
         Vive solo en la tarjeta enfocada (gate por focus) y se apaga al abrir
         el panel. El hover lo agranda y lo enciende: es la señal de que es
         clickeable, no un adorno. Con reduced-motion queda fijo y legible. */
      if (c.play) {
        const gate = Math.pow(focus, 1.6) * (1 - openMix);
        const breath = REDUCED ? 0.5 : 0.5 + 0.5 * Math.sin(time * 1.9);
        c.playHover = lerp(c.playHover, playHovered === i && !dragging ? 1 : 0, 0.14);

        /* Pulso al presionar: el botón se hunde y rebota agrandándose mientras
           la navegación se resuelve. Sin esto, entre el toque y el cambio de
           página no pasa nada y parece que no registró el click. */
        c.playPress = Math.max(0, c.playPress - dt * 2.6);
        const press = REDUCED ? 0 : Math.sin(c.playPress * Math.PI) * (1 - c.playPress * 0.35);

        const op = gate * (0.80 + 0.20 * breath + 0.20 * c.playHover) + press * 0.5;
        const scale = 1 + (REDUCED ? 0 : 0.035 * breath) + 0.07 * c.playHover + press * 0.42;
        c.play.material.opacity = Math.min(1, op);
        c.play.scale.setScalar(scale);

        /* El encendido acompaña al crecimiento: cuanto más grande, más brilla
           el aro. Es lo que lo delata como botón —algo que solo reacciona de
           tamaño puede pasar por adorno—. */
        if (c.playGlow) {
          c.playGlow.material.opacity = gate * (0.85 * c.playHover + 1.1 * press);
          c.playGlow.scale.setScalar(scale);
        }
      }
    }

    /* — Cometa: vive solo en la tarjeta con más foco —
       El gate con focus^7 lo apaga apenas la tarjeta empieza a irse, así en
       pleno arrastre no quedan varias luces compitiendo. Cuelga del holder de
       la enfocada: hereda giro, escala y flote sin cálculo extra. */
    const cometOp = REDUCED ? 0 : Math.pow(cometBest, 7) * (1 - openMix * 0.65);
    comet.visible = cometOp > 0.004;
    if (comet.visible) {
      const cb = cards[cometIdx];
      if (comet.parent !== cb.holder) {
        cb.holder.add(comet);
        comet.material.uniforms.uAccent.value.copy(cb.uniforms.uAccent.value);
      }
      comet.material.uniforms.uOp.value = cometOp;
      comet.material.uniforms.uTime.value = time;

      const head = (time * COMET_SPEED) % 1;
      const arr = comet.geometry.attributes.position.array;
      for (let i = 0; i < COMET_N; i++) {
        const f = i / (COMET_N - 1);
        cometPath(head - f * COMET_TAIL, v2);
        arr[i * 3] = v2.x;
        arr[i * 3 + 1] = v2.y;
      }
      comet.geometry.attributes.position.needsUpdate = true;
    }

    /* — Modo detalle: el anillo se corre y la cámara retrocede — */
    openMix = lerp(openMix, opened ? 1 : 0, 0.09);
    ring.position.x = -openMix * 1.15;
    camera.position.z = baseZ + openMix * 0.9;

    if (!REDUCED) {
      ptr.x = lerp(ptr.x, ptr.tx, 0.05);
      ptr.y = lerp(ptr.y, ptr.ty, 0.05);

      // Paralaje: la cámara se mueve, el anillo no — mantiene la perspectiva
      camera.position.x = lerp(camera.position.x, center.x + ptr.x * 0.42 - openMix * 0.2, 0.05);
      camera.position.y = lerp(camera.position.y, center.y - ptr.y * 0.28, 0.05);
      camera.lookAt(center.x - openMix * 1.15, center.y, 0);

      scene.userData.stars.rotation.y = time * 0.008;
      scene.userData.dust.rotation.y = -time * 0.02;
      scene.userData.nebula.material.uniforms.uTime.value = time;
      scene.userData.nebula.rotation.y = -time * 0.012;
      // Giro de la hélice: el signo determina si "atornilla" hacia arriba
      scene.userData.dna.material.uniforms.uTime.value = time;
      scene.userData.dna.rotation.y = -time * 0.5;
    }

    if (composer) composer.render();
    else renderer.render(scene, camera);

    fpsAcc += 1 / Math.max(dt, 1e-4); fpsN++; fpsClock += dt;
    if (fpsClock >= 0.5) { fps = Math.round(fpsAcc / fpsN); fpsAcc = fpsN = fpsClock = 0; }
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { last = performance.now(); frame(); }
    else cancelAnimationFrame(raf);
  });

  if (composer) composer.render(); else renderer.render(scene, camera);
  frame();
  onActive?.(active);

  return {
    supported: true,
    goTo,
    step: stepBy,
    setOpen(v) { opened = v; },
    getActive: () => active,
    getFps: () => fps,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
      renderer.dispose();
    },
  };
}
