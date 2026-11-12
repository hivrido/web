/**
 * El símbolo H▷ en 3D: cromo con cantos biselados y tubos de neón lila.
 *
 * WebGL2 directo, sin motor. La escena son dos mallas —el sólido extruido y
 * las cintas de neón— y cuatro pasadas de posproceso (brillo, dos desenfoques
 * y la composición con una aberración cromática mínima).
 *
 * El cromo no usa mapa de entorno: refleja un estudio descrito por una
 * función, con la paleta de la marca. Eso evita bajar una textura HDR y hace
 * que el reflejo sea violeta por construcción, no por corrección de color.
 *
 * Este módulo se carga con `import()` cuando el navegador queda libre: nunca
 * está en el camino del primer pintado.
 */

import { FILL, HOLE, OUTER, type Pt } from "./hmark-shape";
import { FULLSCREEN_VS, createContext, createProgram, createTarget, deleteTarget, perspective, rotationYX, uniforms, type Target } from "./gl";
import { Governor, type Tier } from "./quality";

/* ── Malla ─────────────────────────────────────────────────────────────── */

const DEPTH = 0.42;
const CHAMFER = 0.05;
const FOV = (28 * Math.PI) / 180;
const Z_FRONT = DEPTH / 2;
/** A esta distancia el alto del símbolo ocupa `FILL` del lienzo: lo mismo que el SVG. */
const CAM_Z = Z_FRONT + 1 / (FILL * Math.tan(FOV / 2));

/** Corre el contorno `c` hacia el sólido (que queda a la izquierda del recorrido). */
function inset(pts: readonly Pt[], c: number): Pt[] {
  const n = pts.length;
  return pts.map((q, i) => {
    const p = pts[(i + n - 1) % n];
    const r = pts[(i + 1) % n];
    let ax = q[0] - p[0], ay = q[1] - p[1];
    const al = Math.hypot(ax, ay); ax /= al; ay /= al;
    let bx = r[0] - q[0], by = r[1] - q[1];
    const bl = Math.hypot(bx, by); bx /= bl; by /= bl;
    const nx = -ay - by, ny = ax + bx;
    const k = c / (1 + ay * by + ax * bx);
    return [q[0] + nx * k, q[1] + ny * k] as const;
  });
}

const cross = (a: Pt, b: Pt, c: Pt) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const same = (a: Pt, b: Pt) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;

/** Recorte de orejas de un contorno con un hueco, unidos por un puente. */
function triangulate(outer: Pt[], hole: Pt[]): Pt[] {
  // El puente va de la punta del hueco (su x máxima) al vértice exterior más cercano.
  let h = 0;
  hole.forEach((p, i) => { if (p[0] > hole[h][0]) h = i; });
  let o = 0, best = Infinity;
  outer.forEach((p, i) => {
    const d = Math.hypot(p[0] - hole[h][0], p[1] - hole[h][1]);
    if (p[0] >= hole[h][0] && d < best) { best = d; o = i; }
  });
  const poly: Pt[] = [
    ...outer.slice(0, o + 1),
    ...hole.slice(h), ...hole.slice(0, h + 1),
    ...outer.slice(o),
  ];
  const idx = poly.map((_, i) => i);
  const out: Pt[] = [];
  let guard = 400;
  while (idx.length > 3 && guard-- > 0) {
    let clipped = false;
    for (let i = 0; i < idx.length; i++) {
      const a = poly[idx[(i + idx.length - 1) % idx.length]];
      const b = poly[idx[i]];
      const c = poly[idx[(i + 1) % idx.length]];
      if (cross(a, b, c) <= 1e-9) continue;
      const blocked = idx.some((j) => {
        const p = poly[j];
        if (same(p, a) || same(p, b) || same(p, c)) return false;
        return cross(a, b, p) >= -1e-9 && cross(b, c, p) >= -1e-9 && cross(c, a, p) >= -1e-9;
      });
      if (blocked) continue;
      out.push(a, b, c);
      idx.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
  }
  if (idx.length === 3) out.push(poly[idx[0]], poly[idx[1]], poly[idx[2]]);
  return out;
}

/** Sólido: [x, y, z, nx, ny, nz, cara] por vértice. cara: 0 frente · 1 bisel · 2 canto. */
function buildSolid(): Float32Array {
  const v: number[] = [];
  const zC = Z_FRONT - CHAMFER;
  const zB = -DEPTH / 2;
  const S = Math.SQRT1_2;
  const contours: [readonly Pt[], Pt[]][] = [[OUTER, inset(OUTER, CHAMFER)], [HOLE, inset(HOLE, CHAMFER)]];

  for (const p of triangulate(contours[0][1], contours[1][1])) v.push(p[0], p[1], Z_FRONT, 0, 0, 1, 0);

  const quad = (a: number[], b: number[], c: number[], d: number[], n: number[], face: number) => {
    for (const p of [a, b, c, a, c, d]) v.push(p[0], p[1], p[2], n[0], n[1], n[2], face);
  };
  for (const [orig, ins] of contours) {
    const n = orig.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = orig[j][0] - orig[i][0], dy = orig[j][1] - orig[i][1];
      const l = Math.hypot(dx, dy);
      // Hacia afuera del sólido: la derecha del recorrido.
      const ox = dy / l, oy = -dx / l;
      quad(
        [orig[i][0], orig[i][1], zC], [orig[j][0], orig[j][1], zC],
        [ins[j][0], ins[j][1], Z_FRONT], [ins[i][0], ins[i][1], Z_FRONT],
        [ox * S, oy * S, S], 1,
      );
      quad(
        [orig[i][0], orig[i][1], zB], [orig[j][0], orig[j][1], zB],
        [orig[j][0], orig[j][1], zC], [orig[i][0], orig[i][1], zC],
        [ox, oy, 0], 2,
      );
    }
  }
  return new Float32Array(v);
}

/** Neón: [x, y, z, v, tramo] por vértice. v cruza el tubo de 0 a 1. */
function buildNeon(): Float32Array {
  const v: number[] = [];
  const z = Z_FRONT + 0.006;
  let seg = 0;
  for (const c of [OUTER, HOLE]) {
    const a = inset(c, -0.012);
    const b = inset(c, 0.024);
    const n = c.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const s = seg++;
      const q = [[a[i], 0], [a[j], 0], [b[j], 1], [a[i], 0], [b[j], 1], [b[i], 1]] as const;
      for (const [p, t] of q) v.push(p[0], p[1], z, t, s);
    }
  }
  return new Float32Array(v);
}

/* ── Shaders ───────────────────────────────────────────────────────────── */

const SOLID_VS = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNrm;
layout(location=2) in float aFace;
uniform mat4 uProj, uModel;
uniform float uCamZ;
out vec3 vW, vN, vL;
out float vFace;
void main(){
  vec4 w = uModel * vec4(aPos, 1.0);
  vW = w.xyz; vN = mat3(uModel) * aNrm; vL = aPos; vFace = aFace;
  gl_Position = uProj * vec4(w.xy, w.z - uCamZ, 1.0);
}`;

const SOLID_FS = `#version 300 es
precision highp float;
in vec3 vW, vN, vL;
in float vFace;
uniform mat4 uModel;
uniform float uCamZ, uTime, uLight, uOn, uSheen;
out vec4 o;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}
float band(float x, float c, float w){ return 1.0 - smoothstep(0.0, w, abs(x - c)); }

/* El estudio que refleja el cromo. Paleta de marca: negro #0D0717, violeta
   noche #3C1053, eléctrico #5F259F, ultravioleta #8246AF, neón lila #AC4FC6. */
vec3 env(vec3 d){
  float y = d.y;
  float az = atan(d.x, d.z);
  vec3 sky = mix(vec3(0.05, 0.022, 0.09), vec3(0.3, 0.115, 0.5), smoothstep(0.0, 0.9, y));
  vec3 ground = mix(vec3(0.012, 0.006, 0.022), vec3(0.14, 0.04, 0.2), smoothstep(-0.9, 0.0, y));
  vec3 c = mix(ground, sky, smoothstep(-0.04, 0.04, y));
  // La línea de horizonte: lo que hace que se lea como cromo y no como gris.
  c += vec3(0.96, 0.9, 1.0) * band(y, 0.03, 0.09) * 1.5;
  c += vec3(0.51, 0.275, 0.686) * band(y, -0.12, 0.2) * 0.5;
  // Luz principal arriba, y dos paneles a los costados.
  c += vec3(1.0, 0.97, 1.0) * band(y, 0.72, 0.3) * band(az, 0.25, 1.3) * 2.3;
  c += vec3(0.675, 0.31, 0.776) * band(az, 1.25, 0.42) * band(y, 0.12, 0.75) * 2.0;
  c += vec3(0.373, 0.145, 0.624) * band(az, -1.15, 0.5) * band(y, 0.05, 0.8) * 1.9;
  c += vec3(0.9, 0.86, 1.0) * band(az, -0.42, 0.07) * band(y, 0.1, 0.55) * 0.9;
  return c;
}

void main(){
  vec3 N = normalize(vN);
  if (vFace < 0.5) {
    // Relieve mínimo en la cara: cromo líquido en vez de un espejo plano.
    vec2 p = vL.xy * 1.7 + vec2(uTime * 0.035, -uTime * 0.02);
    float e = 0.06;
    vec2 g = vec2(noise(p + vec2(e, 0)) - noise(p - vec2(e, 0)), noise(p + vec2(0, e)) - noise(p - vec2(0, e))) / (2.0 * e);
    N = normalize(N + mat3(uModel) * vec3(g * 0.075, 0.0));
  }
  vec3 V = normalize(vec3(0.0, 0.0, uCamZ) - vW);
  vec3 R = reflect(-V, N);
  float fres = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 5.0);
  vec3 c = env(R) * mix(vec3(0.58, 0.55, 0.66), vec3(1.0), fres);
  // El neón tiñe los biseles que tiene pegados.
  c += vec3(0.675, 0.31, 0.776) * uOn * (vFace > 0.5 ? 0.22 : 0.02);
  // Barrido de luz que recorre la cara al encenderse.
  float sw = band(vL.x * 0.6 + vL.y * 0.35, uSheen, 0.22);
  c += vec3(1.0, 0.94, 1.0) * sw * 0.55 * step(vFace, 0.5);
  o = vec4(c * uLight, 1.0);
}`;

const NEON_VS = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in float aV;
layout(location=2) in float aSeg;
uniform mat4 uProj, uModel;
uniform float uCamZ;
out float vV, vH, vSeg;
void main(){
  vec4 w = uModel * vec4(aPos, 1.0);
  vV = aV; vH = aPos.y; vSeg = aSeg;
  gl_Position = uProj * vec4(w.xy, w.z - uCamZ, 1.0);
}`;

const NEON_FS = `#version 300 es
precision highp float;
in float vV, vH, vSeg;
uniform float uOn, uTime, uFlick;
out vec4 o;
float hash(float n){ return fract(sin(n * 91.345) * 47453.5453); }
void main(){
  float core = clamp(1.0 - abs(vV * 2.0 - 1.0), 0.0, 1.0);
  float a = smoothstep(0.0, 0.5, core);
  // El encendido sube desde la base: debajo del frente ya prendió.
  float front = mix(-1.3, 1.3, uOn);
  float lit = 1.0 - smoothstep(front - 0.16, front + 0.02, vH);
  // Cerca del frente el tubo todavía titila, como un cartel que arranca.
  float near = smoothstep(front - 0.55, front, vH);
  float fl = 1.0 - uFlick * near * step(0.45, hash(vSeg * 3.1 + floor(uTime * 22.0)));
  vec3 hot = mix(vec3(0.675, 0.31, 0.776), vec3(1.0, 0.9, 1.0), pow(core, 5.0));
  vec3 off = vec3(0.19, 0.09, 0.25);
  vec3 c = mix(off, hot * 1.45, lit * fl);
  o = vec4(c * a, a);
}`;

const BRIGHT_FS = `#version 300 es
precision highp float;
in vec2 vUv; uniform sampler2D uTex; out vec4 o;
void main(){
  vec3 c = texture(uTex, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  // Un NaN suelto acá se desparrama por todo el desenfoque.
  if (!(l >= 0.0 && l < 64.0)) { c = vec3(0.0); l = 0.0; }
  o = vec4(c * smoothstep(0.72, 1.15, l), 1.0);
}`;

const BLUR_FS = `#version 300 es
precision highp float;
in vec2 vUv; uniform sampler2D uTex; uniform vec2 uDir; out vec4 o;
void main(){
  vec3 c = texture(uTex, vUv).rgb * 0.227;
  c += (texture(uTex, vUv + uDir * 1.385).rgb + texture(uTex, vUv - uDir * 1.385).rgb) * 0.316;
  c += (texture(uTex, vUv + uDir * 3.231).rgb + texture(uTex, vUv - uDir * 3.231).rgb) * 0.070;
  o = vec4(c, 1.0);
}`;

const COMPOSE_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene, uBloomA, uBloomB;
uniform float uBloom, uCa;
out vec4 o;
void main(){
  vec2 d = vUv - 0.5;
  vec2 k = d * dot(d, d) * uCa;
  vec4 s = texture(uScene, vUv);
  vec3 c = vec3(texture(uScene, vUv + k).r, s.g, texture(uScene, vUv - k).b);
  vec3 b = (texture(uBloomA, vUv).rgb * 0.5 + texture(uBloomB, vUv).rgb * 0.85) * uBloom;
  c += b;
  c = 1.0 - exp(-c * 1.15);
  float glow = max(b.r, max(b.g, b.b));
  o = vec4(c, clamp(s.a + glow * 1.4, 0.0, 1.0));
}`;

/* ── Escena ────────────────────────────────────────────────────────────── */

export type HMarkScene = {
  /** Vuelve a encender el cartel. */
  ignite(): void;
  /** Arranca o frena el bucle (fuera de pantalla, pestaña oculta). */
  setRunning(on: boolean): void;
  /** fps medidos en la última ventana. */
  stats(): { fps: number; level: number; frozen: boolean };
  dispose(): void;
};

export async function createHMark(
  canvas: HTMLCanvasElement,
  opts: { tier: Tier; still: boolean; onReady: () => void },
): Promise<HMarkScene | null> {
  const gl = createContext(canvas);
  if (!gl) return null;

  // Los cinco programas se mandan a compilar juntos y se esperan sin bloquear.
  const [solid, neon, bright, blur, compose] = await Promise.all([
    createProgram(gl, SOLID_VS, SOLID_FS),
    createProgram(gl, NEON_VS, NEON_FS),
    createProgram(gl, FULLSCREEN_VS, BRIGHT_FS),
    createProgram(gl, FULLSCREEN_VS, BLUR_FS),
    createProgram(gl, FULLSCREEN_VS, COMPOSE_FS),
  ]);
  if (!solid || !neon || !bright || !blur || !compose) return null;

  const uS = uniforms(gl, solid, ["uProj", "uModel", "uCamZ", "uTime", "uLight", "uOn", "uSheen"] as const);
  const uN = uniforms(gl, neon, ["uProj", "uModel", "uCamZ", "uOn", "uTime", "uFlick"] as const);
  const uBr = uniforms(gl, bright, ["uTex"] as const);
  const uBl = uniforms(gl, blur, ["uTex", "uDir"] as const);
  const uC = uniforms(gl, compose, ["uScene", "uBloomA", "uBloomB", "uBloom", "uCa"] as const);

  const vao = (data: Float32Array, sizes: number[]) => {
    const a = gl.createVertexArray()!;
    gl.bindVertexArray(a);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const stride = sizes.reduce((s, n) => s + n, 0) * 4;
    let off = 0;
    sizes.forEach((n, i) => {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, n, gl.FLOAT, false, stride, off);
      off += n * 4;
    });
    return { vao: a, count: data.length / (stride / 4) };
  };
  const solidMesh = vao(buildSolid(), [3, 3, 1]);
  const neonMesh = vao(buildNeon(), [3, 1, 1]);
  const empty = gl.createVertexArray()!;

  const hdr = !!gl.getExtension("EXT_color_buffer_float") || !!gl.getExtension("EXT_color_buffer_half_float");
  let dprCap = opts.tier === 2 ? 1.75 : 1.25;
  let bloomOn = true;
  let level = 0;

  /* Framebuffers: la escena con suavizado, y dos niveles de resplandor. */
  let msaa: { fbo: WebGLFramebuffer; color: WebGLRenderbuffer; depth: WebGLRenderbuffer } | null = null;
  let scene: Target | null = null;
  let a1: Target | null = null, a2: Target | null = null, b1: Target | null = null, b2: Target | null = null;
  let W = 0, H = 0;

  function allocate() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const w = Math.max(64, Math.round(rect.width * dpr));
    const h = Math.max(64, Math.round(rect.height * dpr));
    if (w === W && h === H) return;
    W = w; H = h;
    canvas.width = w; canvas.height = h;

    if (msaa) { gl!.deleteFramebuffer(msaa.fbo); gl!.deleteRenderbuffer(msaa.color); gl!.deleteRenderbuffer(msaa.depth); }
    [scene, a1, a2, b1, b2].forEach((t) => deleteTarget(gl!, t));

    const samples = Math.min(4, gl!.getParameter(gl!.MAX_SAMPLES) as number);
    const color = gl!.createRenderbuffer()!;
    gl!.bindRenderbuffer(gl!.RENDERBUFFER, color);
    gl!.renderbufferStorageMultisample(gl!.RENDERBUFFER, samples, hdr ? gl!.RGBA16F : gl!.RGBA8, w, h);
    const depth = gl!.createRenderbuffer()!;
    gl!.bindRenderbuffer(gl!.RENDERBUFFER, depth);
    gl!.renderbufferStorageMultisample(gl!.RENDERBUFFER, samples, gl!.DEPTH_COMPONENT24, w, h);
    const fbo = gl!.createFramebuffer()!;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferRenderbuffer(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.RENDERBUFFER, color);
    gl!.framebufferRenderbuffer(gl!.FRAMEBUFFER, gl!.DEPTH_ATTACHMENT, gl!.RENDERBUFFER, depth);
    msaa = { fbo, color, depth };

    scene = createTarget(gl!, w, h, hdr);
    const hw = Math.max(2, w >> 1), hh = Math.max(2, h >> 1);
    const qw = Math.max(2, w >> 3), qh = Math.max(2, h >> 3);
    a1 = createTarget(gl!, hw, hh, hdr); a2 = createTarget(gl!, hw, hh, hdr);
    b1 = createTarget(gl!, qw, qh, hdr); b2 = createTarget(gl!, qw, qh, hdr);
  }

  /* ── Estado de la animación ── */
  let on = opts.still ? 1 : 0;        // 0 → 1: el neón sube
  let light = opts.still ? 1 : 0.2;   // exposición del cromo
  let sheen = opts.still ? 9 : -2;    // posición del barrido
  let igniteAt = -1;
  let yaw = 0, pitch = 0, vy = 0, vp = 0;
  let tYaw = 0, tPitch = 0;
  let time = 0;
  let pointerAt = -1e9;

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    tYaw = ((e.clientX / innerWidth) * 2 - 1) * 0.42;
    tPitch = ((e.clientY / innerHeight) * 2 - 1) * 0.26;
    pointerAt = performance.now();
  };
  /* El giroscopio no pide permiso: en Android llega solo; en iOS, sin el
     permiso explícito no hay eventos y el logo se queda con su vaivén. */
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    tYaw = Math.max(-1, Math.min(1, e.gamma / 32)) * 0.4;
    tPitch = Math.max(-1, Math.min(1, (e.beta - 45) / 36)) * 0.24;
    pointerAt = performance.now();
  };
  if (!opts.still) {
    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("deviceorientation", onTilt, { passive: true });
  }

  function pass(prog: WebGLProgram | null, target: Target | null, w: number, h: number) {
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, target ? target.fbo : null);
    gl!.viewport(0, 0, w, h);
    gl!.useProgram(prog);
  }
  const tri = () => gl!.drawArrays(gl!.TRIANGLES, 0, 3);

  function draw() {
    allocate();
    const g = gl!;
    const proj = perspective(FOV, W / H, 1, 20);
    const model = rotationYX(yaw, pitch, 1);

    g.bindFramebuffer(g.FRAMEBUFFER, msaa!.fbo);
    g.viewport(0, 0, W, H);
    g.clearColor(0, 0, 0, 0);
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    g.enable(g.DEPTH_TEST);
    g.disable(g.BLEND);

    g.useProgram(solid);
    g.uniformMatrix4fv(uS.uProj, false, proj);
    g.uniformMatrix4fv(uS.uModel, false, model);
    g.uniform1f(uS.uCamZ, CAM_Z);
    g.uniform1f(uS.uTime, time);
    g.uniform1f(uS.uLight, light);
    g.uniform1f(uS.uOn, on);
    g.uniform1f(uS.uSheen, sheen);
    g.bindVertexArray(solidMesh.vao);
    g.drawArrays(g.TRIANGLES, 0, solidMesh.count);

    g.enable(g.BLEND);
    g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
    g.depthMask(false);
    g.useProgram(neon);
    g.uniformMatrix4fv(uN.uProj, false, proj);
    g.uniformMatrix4fv(uN.uModel, false, model);
    g.uniform1f(uN.uCamZ, CAM_Z);
    g.uniform1f(uN.uOn, on);
    g.uniform1f(uN.uTime, time);
    g.uniform1f(uN.uFlick, on < 0.999 ? 1 : 0.06);
    g.bindVertexArray(neonMesh.vao);
    g.drawArrays(g.TRIANGLES, 0, neonMesh.count);
    g.depthMask(true);
    g.disable(g.BLEND);
    g.disable(g.DEPTH_TEST);

    // Resuelve el suavizado a una textura.
    g.bindFramebuffer(g.READ_FRAMEBUFFER, msaa!.fbo);
    g.bindFramebuffer(g.DRAW_FRAMEBUFFER, scene!.fbo);
    g.blitFramebuffer(0, 0, W, H, 0, 0, W, H, g.COLOR_BUFFER_BIT, g.NEAREST);

    g.bindVertexArray(empty);
    g.activeTexture(g.TEXTURE0);
    if (bloomOn) {
      pass(bright, a1, a1!.w, a1!.h);
      g.bindTexture(g.TEXTURE_2D, scene!.tex); g.uniform1i(uBr.uTex, 0); tri();
      const blurPair = (src: Target, tmp: Target, dst: Target) => {
        pass(blur, tmp, tmp.w, tmp.h);
        g.bindTexture(g.TEXTURE_2D, src.tex); g.uniform1i(uBl.uTex, 0); g.uniform2f(uBl.uDir, 1 / src.w, 0); tri();
        pass(blur, dst, dst.w, dst.h);
        g.bindTexture(g.TEXTURE_2D, tmp.tex); g.uniform2f(uBl.uDir, 0, 1 / tmp.h); tri();
      };
      blurPair(a1!, a2!, a1!);
      // El nivel chico parte del grande ya desenfocado: resplandor ancho y barato.
      pass(blur, b1, b1!.w, b1!.h);
      g.bindTexture(g.TEXTURE_2D, a1!.tex); g.uniform1i(uBl.uTex, 0); g.uniform2f(uBl.uDir, 0, 0); tri();
      blurPair(b1!, b2!, b1!);
    }

    pass(compose, null, W, H);
    g.clearColor(0, 0, 0, 0);
    g.clear(g.COLOR_BUFFER_BIT);
    g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, scene!.tex); g.uniform1i(uC.uScene, 0);
    g.activeTexture(g.TEXTURE1); g.bindTexture(g.TEXTURE_2D, a1!.tex); g.uniform1i(uC.uBloomA, 1);
    g.activeTexture(g.TEXTURE2); g.bindTexture(g.TEXTURE_2D, b1!.tex); g.uniform1i(uC.uBloomB, 2);
    g.uniform1f(uC.uBloom, bloomOn ? 1 : 0);
    g.uniform1f(uC.uCa, opts.tier === 2 ? 0.05 : 0);
    tri();
  }

  /* ── Bucle ── */
  const governor = new Governor(2);
  let raf = 0;
  let running = false;
  let frozen = false;
  let last = 0;
  let ready = false;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dtMs = last ? now - last : 16.7;
    last = now;
    const dt = Math.min(dtMs, 50) / 1000;
    time += dt;

    if (igniteAt >= 0) {
      const t = (now - igniteAt) / 1000;
      on = Math.min(1, t / 1.25);
      light = 0.2 + 0.8 * Math.min(1, Math.max(0, (t - 0.35) / 1.1));
      sheen = -1.6 + Math.max(0, t - 0.9) * 2.4;
      if (t > 2.6) igniteAt = -1;
    }

    // Sin puntero ni giroscopio hace un rato: vaivén lento propio.
    if (now - pointerAt > 2600) {
      tYaw = Math.sin(time * 0.42) * 0.2;
      tPitch = Math.sin(time * 0.31 + 1.3) * 0.07;
    }
    // Resorte críticamente amortiguado: sigue al puntero sin rebotar.
    const k = 42, c = 2 * Math.sqrt(k);
    vy += ((tYaw - yaw) * k - vy * c) * dt; yaw += vy * dt;
    vp += ((tPitch - pitch) * k - vp * c) * dt; pitch += vp * dt;

    draw();
    if (!ready) { ready = true; opts.onReady(); }

    const verdict = governor.tick(dtMs);
    if (verdict === "degrade") {
      level++;
      if (level === 1) { dprCap = 1; W = 0; }
      else bloomOn = false;
    } else if (verdict === "freeze") {
      // No llega ni degradado: queda el último cuadro, quieto.
      frozen = true;
      stop();
    }
  }

  function start() {
    if (running || frozen || opts.still) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onLost = (e: Event) => { e.preventDefault(); frozen = true; stop(); };
  canvas.addEventListener("webglcontextlost", onLost);

  let resizeId = 0;
  const onResize = () => {
    clearTimeout(resizeId);
    resizeId = window.setTimeout(() => { if (opts.still || frozen) draw(); }, 150);
  };
  addEventListener("resize", onResize, { passive: true });

  if (opts.still) {
    // Movimiento reducido: un solo cuadro, ya encendido y de frente.
    draw();
    opts.onReady();
  } else {
    igniteAt = performance.now();
    start();
  }

  return {
    ignite() {
      if (opts.still || frozen) return;
      on = 0; light = 0.2; sheen = -2;
      igniteAt = performance.now();
    },
    setRunning(v) { if (v) start(); else stop(); },
    stats: () => ({ fps: governor.fps, level, frozen }),
    dispose() {
      stop();
      removeEventListener("pointermove", onPointer);
      removeEventListener("deviceorientation", onTilt);
      removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
