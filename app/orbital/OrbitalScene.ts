/**
 * Motor 3D del carrusel orbital.
 *
 * No conoce React ni el DOM más allá del canvas. Recibe `getTheta()` y en cada
 * frame recoloca las tarjetas con `orbitSlot()`. Toda la matemática vive en
 * orbital-math.ts; acá solo hay Three.js.
 */

import * as THREE from "three";
import { createNebula, type Nebula } from "./nebula";
import {
  CARD_H,
  CARD_MAX_SCALE,
  CARD_W,
  opacityFromDepth,
  orbitSlot,
  scaleFromDepth,
  type OrbitConfig,
} from "./orbital-math";

const CORNER = 0.145;
/** Espesor del cristal. Lo que se ve cuando la tarjeta pasa de canto. */
const THICKNESS = 0.085;
/** El plano del halo llega hasta donde el resplandor ya vale ~0. */
const GLOW_PAD = 1.65;

/**
 * Geometría de la tarjeta: rectángulo redondeado extruido, con bisel.
 *
 * Antes era un plano de espesor cero, que de canto desaparece. Con volumen
 * real el giro revela la sección del material, y el bisel le da al borde una
 * superficie donde la luz pega — un canto vivo en lugar de un corte.
 *
 * Las UV se recalculan desde la posición: las que genera ExtrudeGeometry están
 * en unidades de mundo y no sirven para mapear la textura.
 */
function makeCardGeometry(w: number, h: number, r: number, depth: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 10,
  });

  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();

  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

  return geo;
}

/** Fondo: azul de noche, no negro. Deja respirar el color de las nebulosas. */
const VOID = 0x050a18;

/**
 * Desorden por tarjeta. Sin esto el aro se lee como un carrusel; con esto,
 * como objetos flotando. Es determinista —hash del índice— porque la
 * composición tiene que ser la misma en cada carga.
 */
function jitterFor(i: number) {
  const h = (n: number) => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    tiltX: (h(i) - 0.5) * 0.12,
    tiltZ: (h(i + 7.3) - 0.5) * 0.16,
    // Poco: la hélice ya reparte las alturas y de más se pelean entre sí.
    yOff: (h(i + 3.1) - 0.5) * 0.32,
    // El techo tiene que coincidir con CARD_MAX_SCALE: el radio mínimo del aro
    // se calcula contra él, y si acá crece más las tarjetas se tocan.
    sizeMul: 0.9 + h(i + 11.7) * (CARD_MAX_SCALE - 0.9),
  };
}

/* ─────────────────────────── Shaders ─────────────────────────── */

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalObj;
  void main() {
    vUv = uv;
    // Normal en espacio de objeto: dice si el fragmento es cara o canto sin
    // importar cómo esté girada la tarjeta.
    vNormalObj = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** El halo es un plano suelto: no tiene normales que valga la pena pasar. */
const FLAT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

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
  uniform float uFocus;
  uniform float uOpacity;
  varying vec2  vUv;
  varying vec3  vNormalObj;

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRoundRect(p, uSize * 0.5, uRadius);

    // Cara contra canto. La silueta ya la resuelve la geometría, así que acá
    // solo hay que separar las dos superficies del sólido. El bisel mezcla las
    // normales, y ese degradado es el que enciende el filo.
    float face = smoothstep(0.30, 0.78, abs(vNormalObj.z));

    vec3 tex = texture2D(uMap, vUv).rgb;

    // Fuera de foco: desatura y apaga. Jerarquía sin mover nada de sitio.
    float g = dot(tex, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(g) * 0.38, tex, 0.22 + 0.78 * uFocus);

    // Viñeta propia del cristal: el perímetro cae y el centro sube. Sin esto
    // el plano se lee como una calcomanía pegada al fondo.
    float toEdge = 1.0 - smoothstep(-0.55, -0.02, d);
    col *= 0.80 + 0.20 * toEdge;

    // Luz rasante: el canto se enciende arriba a la izquierda y se apaga abajo
    // a la derecha, como un vidrio bajo una fuente alta. Un filo parejo en todo
    // el contorno se lee como contorno dibujado, no como material.
    float lit = pow(clamp((vUv.y + (1.0 - vUv.x)) * 0.5, 0.0, 1.0), 1.5);

    // Hebra de cristal justo por dentro del contorno. pow la concentra en una
    // línea fina en vez de un halo ancho.
    float rim = pow(smoothstep(-0.018, 0.0, d), 2.2);
    vec3 rimCol = mix(vec3(1.0), uAccent, 0.30);
    col += rimCol * rim * (0.30 + 0.85 * lit) * (0.45 + 0.75 * uFocus);

    // Rastro del acento bien adentro: tiñe el borde sin dibujar un marco.
    col += uAccent * smoothstep(-0.30, 0.0, d) * 0.085 * uFocus;

    // El canto es la sección del material, no su superficie: va más claro y
    // más denso que la cara, y responde fuerte a la luz rasante. Es lo que se
    // ve cuando la tarjeta pasa girando.
    vec3 edge = mix(vec3(0.72, 0.78, 1.0), uAccent, 0.45);
    edge *= (0.30 + 1.15 * lit) * (0.55 + 0.75 * uFocus);

    col = mix(edge, col, face);

    // Cristal: el fondo se filtra por los bordes y se cierra hacia el centro,
    // donde vive el título y hay que poder leer. El canto casi no transparenta
    // porque ahí el espesor acumula material.
    float core = smoothstep(0.95, 0.25, length((vUv - 0.5) * vec2(1.35, 1.0)));
    float glass = mix(0.74, 0.97, core);

    gl_FragColor = vec4(col, uOpacity * mix(0.94, glass, face));
  }
`;

const GLOW_FRAG = /* glsl */ `
  precision mediump float;
  ${SDF}

  uniform vec3  uAccent;
  uniform vec2  uPlane;
  uniform vec2  uSize;
  uniform float uRadius;
  uniform float uIntensity;
  varying vec2  vUv;

  void main() {
    vec2 p = (vUv - 0.5) * uPlane;
    float d = sdRoundRect(p, uSize * 0.5, uRadius);
    // Dentro de la tarjeta d es negativo: sin la compuerta, exp(-max(d,0))
    // vale 1 en todo el interior y pinta un rectángulo sólido.
    // Más abierto y desaturado hacia el blanco que un halo de color puro: lo
    // que rodea a la tarjeta tiene que leerse como luz, no como neón.
    float glow = exp(-max(d, 0.0) * 8.5) * smoothstep(-0.004, 0.02, d);
    gl_FragColor = vec4(mix(uAccent, vec3(1.0), 0.25), glow * uIntensity);
  }
`;

/* ──────────────────────── Tipos ──────────────────────── */

export interface OrbitalSceneOptions {
  canvas: HTMLCanvasElement;
  textures: THREE.Texture[];
  accents: string[];
  config: OrbitConfig;
  /** Ángulo central. Se lee después de `onBeforeFrame`. */
  getTheta: () => number;
  /** El hook de entrada actualiza theta acá, con el dt del frame. */
  onBeforeFrame?: (dt: number) => void;
  /** Click limpio (sin arrastre) sobre una tarjeta. */
  onPick?: (index: number) => void;
}

export interface OrbitalScene {
  supported: boolean;
  setOpen: (open: boolean) => void;
  dispose: () => void;
}

/* ═══════════════════════ Escena ═══════════════════════ */

export async function createOrbitalScene({
  canvas,
  textures,
  accents,
  config,
  getTheta,
  onBeforeFrame,
  onPick,
}: OrbitalSceneOptions): Promise<OrbitalScene> {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      // Siempre: la silueta de la tarjeta pasó a ser geometría real, y sin
      // muestreo múltiple el canto queda escalonado a cualquier densidad.
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch (err) {
    console.warn("[orbital] WebGL no disponible", err);
    canvas.style.display = "none";
    return { supported: false, setOpen: () => {}, dispose: () => {} };
  }

  const dprCap = coarse ? 1.5 : 1.8;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(VOID, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 120);

  /* ────────── Nebulosas de color ────────── */
  const nebula: Nebula = createNebula({
    colors: accents,
    coarse,
    pixelRatio: renderer.getPixelRatio(),
  });
  scene.add(nebula.group);

  /* ────────── Polvo estelar ────────── */
  const stars = (() => {
    const COUNT = coarse ? 900 : 2200;
    const pos = new Float32Array(COUNT * 3);
    const siz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 16 + Math.random() * 44;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.8;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      siz[i] = 0.3 + Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(siz, 1));

    const pts = new THREE.Points(g, new THREE.ShaderMaterial({
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
          gl_FragColor = vec4(vec3(0.82, 0.88, 1.0), smoothstep(0.25, 0.0, d) * (0.10 + vS * 0.32));
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    pts.frustumCulled = false;
    scene.add(pts);
    return pts;
  })();

  /* ────────── Tarjetas ────────── */
  const root = new THREE.Group();
  scene.add(root);

  const cardGeo = makeCardGeometry(CARD_W, CARD_H, CORNER, THICKNESS);
  const glowGeo = new THREE.PlaneGeometry(CARD_W * GLOW_PAD, CARD_H * GLOW_PAD);

  interface CardRef {
    holder: THREE.Group;
    mesh: THREE.Mesh;
    uniforms: Record<string, THREE.IUniform>;
    glowUniforms: Record<string, THREE.IUniform>;
    jitter: ReturnType<typeof jitterFor>;
  }

  const cards: CardRef[] = [];

  for (let i = 0; i < config.count; i++) {
    // Las posiciones de la hélice superan a los proyectos: cada uno reaparece
    // más arriba con la misma textura, que se comparte entre sus instancias.
    const source = i % textures.length;
    const accent = new THREE.Color(accents[source % accents.length]);
    const holder = new THREE.Group();

    const uniforms: Record<string, THREE.IUniform> = {
      uMap: { value: textures[source] },
      uAccent: { value: accent },
      uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
      uRadius: { value: CORNER },
      uFocus: { value: 0 },
      uOpacity: { value: 1 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: CARD_FRAG,
      transparent: true,
      depthWrite: false,
      // Sólido cerrado: sin caras traseras. Con DoubleSide y sin escritura de
      // profundidad, el interior se dibuja encima del exterior.
      side: THREE.FrontSide,
    });

    const mesh = new THREE.Mesh(cardGeo, mat);
    mesh.userData.index = i;
    holder.add(mesh);

    const glowUniforms: Record<string, THREE.IUniform> = {
      uAccent: { value: accent },
      uPlane: { value: new THREE.Vector2(CARD_W * GLOW_PAD, CARD_H * GLOW_PAD) },
      uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
      uRadius: { value: CORNER },
      uIntensity: { value: 0 },
    };
    const glow = new THREE.Mesh(glowGeo, new THREE.ShaderMaterial({
      uniforms: glowUniforms,
      vertexShader: FLAT_VERT,
      fragmentShader: GLOW_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    // Detrás del espesor, no dentro: la tarjeta ahora ocupa z.
    glow.position.z = -0.14;
    glow.raycast = () => {};
    holder.add(glow);

    root.add(holder);
    cards.push({ holder, mesh, uniforms, glowUniforms, jitter: jitterFor(i) });
  }

  /* ────────── Encuadre responsivo ──────────
     La cámara se acerca hasta que la tarjeta del frente ocupa la fracción de
     cuadro que le toca. Las vecinas quedan cortadas por los bordes a propósito:
     ese desborde es lo que hace que se lea como un espacio y no como un
     carrusel.

     En vertical hay que cambiar de estrategia. Una tarjeta apaisada en una
     pantalla alta obliga a la cámara a irse muy atrás para que entre a lo
     ancho, y queda diminuta flotando en una columna vacía. Abrir el campo la
     deja acercarse: se recupera la escala y, de paso, la perspectiva marca
     más la espira, que es lo que llena el alto. */
  let baseZ = 0;

  function fit() {
    const portrait = camera.aspect < 1;

    camera.fov = portrait ? 50 : 38;
    camera.updateProjectionMatrix();

    const fillW = portrait ? 0.78 : 0.66;
    const fillH = portrait ? 0.38 : 0.50;

    const halfTan = Math.tan((camera.fov * Math.PI) / 360);
    const needW = CARD_W / fillW / (2 * halfTan * camera.aspect);
    const needH = CARD_H / fillH / (2 * halfTan);

    baseZ = config.radius + Math.max(needW, needH);
    camera.position.set(0, 0.35, baseZ);
    camera.lookAt(0, 0.02, 0);
  }
  fit();

  /* ────────── Bloom ────────── */
  let composer: import("three/examples/jsm/postprocessing/EffectComposer.js").EffectComposer | null = null;
  let composerTarget: THREE.WebGLRenderTarget | null = null;
  if (!coarse && innerWidth >= 900) {
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] = await Promise.all([
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
      ]);
      // El composer dibuja en su propio destino, que no hereda el muestreo
      // múltiple del lienzo. Hay que pedírselo, o activar el bloom escalona
      // justo el canto que acabamos de darle volumen.
      composerTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
        samples: 4,
        type: THREE.HalfFloatType,
      });
      composer = new EffectComposer(renderer, composerTarget);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(innerWidth, innerHeight), 0.42, 0.75, 0.62
      ));
      composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
      composer.setSize(innerWidth, innerHeight);
    } catch (err) {
      console.warn("[orbital] bloom desactivado", err);
    }
  }

  /* ────────── Click sobre una tarjeta ────────── */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downX = 0, downY = 0, downAt = 0;

  const onDown = (e: PointerEvent) => {
    downX = e.clientX; downY = e.clientY; downAt = performance.now();
  };

  const onUp = (e: PointerEvent) => {
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (moved > 8 || performance.now() - downAt > 600) return;
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(cards.map((c) => c.mesh), false);
    if (hits.length) onPick?.(hits[0].object.userData.index as number);
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);

  /* ────────── Resize ────────── */
  let resizeId: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(() => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
      renderer.setSize(innerWidth, innerHeight, false);
      composer?.setSize(innerWidth, innerHeight);
      fit();
    }, 130);
  };
  addEventListener("resize", onResize, { passive: true });

  /* ═══════════ Bucle ═══════════ */
  let raf = 0;
  let running = true;
  let last = performance.now();
  let time = 0;
  let openMix = 0;
  let opened = false;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const onPointerMove = (e: PointerEvent) => {
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;
  };
  addEventListener("pointermove", onPointerMove, { passive: true });

  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    // El hook amortigua theta con este mismo dt, y recién después lo leemos
    onBeforeFrame?.(dt);
    const theta = getTheta();

    for (let i = 0; i < config.count; i++) {
      const c = cards[i];
      const slot = orbitSlot(i, theta, config);
      const j = c.jitter;
      const focus = Math.pow(slot.depth, 2.4);

      c.holder.position.set(slot.x, slot.y + j.yOff, slot.z);

      // La inclinación se atenúa al enfocar: la del frente queda casi derecha
      // para poder leerla, pero conserva un resto que la saca de la grilla.
      // El orden XYZ aplica Z primero, en el plano de la tarjeta, así que el
      // peralte de la hélice gira la tarjeta sobre sí misma antes de que Y la
      // enfrente a la cámara. Es el orden que hace falta.
      const soften = 1 - 0.55 * focus;
      c.holder.rotation.set(
        j.tiltX * soften,
        slot.rotationY,
        (slot.roll + j.tiltZ) * soften
      );
      c.holder.scale.setScalar(scaleFromDepth(slot.depth) * j.sizeMul);

      c.uniforms.uFocus.value = focus;
      c.uniforms.uOpacity.value = opacityFromDepth(slot.depth);
      c.glowUniforms.uIntensity.value = 0.55 * Math.pow(slot.depth, 3.2) * (1 - openMix * 0.5);
    }

    // Modo detalle: el aro se corre y la cámara retrocede
    openMix += (Number(opened) - openMix) * (1 - Math.pow(0.0001, dt));
    root.position.x = -openMix * 1.15;

    if (!reduced) {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      camera.position.x += (pointer.x * 0.42 - openMix * 0.2 - camera.position.x) * 0.05;
      camera.position.y += (0.2 - pointer.y * 0.28 - camera.position.y) * 0.05;
      camera.position.z += (baseZ + openMix * 0.9 - camera.position.z) * 0.08;
      camera.lookAt(-openMix * 1.15, 0.02, 0);

      stars.rotation.y = time * 0.008;
      nebula.update(time);
    }

    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  const onVisibility = () => {
    running = !document.hidden;
    if (running) { last = performance.now(); frame(); }
    else cancelAnimationFrame(raf);
  };
  document.addEventListener("visibilitychange", onVisibility);

  frame();

  return {
    supported: true,
    setOpen: (v: boolean) => { opened = v; },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      cardGeo.dispose();
      glowGeo.dispose();
      composerTarget?.dispose();
      nebula.dispose();
      stars.geometry.dispose();
      (stars.material as THREE.Material).dispose();
      cards.forEach((c) => {
        c.holder.children.forEach((child) => {
          const m = (child as THREE.Mesh).material;
          if (m) (m as THREE.Material).dispose();
        });
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
