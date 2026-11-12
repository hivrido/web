/**
 * Fondo de colmena: una grilla de hexágonos dibujada por shader, con pulsos
 * de luz violeta que la recorren y una celda que se enciende bajo el puntero.
 *
 * Es un solo rectángulo y un fragment shader: no hay geometría. Se dibuja a
 * resolución contenida y a 30 cuadros —es atmósfera, no necesita más— y solo
 * mientras está en pantalla.
 */

import { FULLSCREEN_VS, createContext, createProgram, uniforms } from "./gl";
import { Governor, type Tier } from "./quality";

const FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform vec2 uRes, uMouse;
uniform float uTime, uScroll, uGain;
out vec4 o;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Devuelve: xy = centro de la celda, z = distancia al borde (0 en la arista).
vec3 hex(vec2 p){
  const vec2 s = vec2(1.0, 1.7320508);
  vec4 c = floor(vec4(p, p - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 h = vec4(p - c.xy * s, p - (c.zw + 0.5) * s);
  vec2 q = dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw;
  vec2 id = dot(h.xy, h.xy) < dot(h.zw, h.zw) ? c.xy : c.zw + 0.5;
  q = abs(q);
  float d = max(dot(q, s * 0.5), q.x);
  return vec3(id, 0.5 - d);
}

void main(){
  vec2 px = vUv * uRes;
  float scale = 46.0;
  vec2 p = (px + vec2(0.0, uScroll * 0.25)) / scale;
  vec3 h = hex(p);
  vec2 center = h.xy * vec2(1.0, 1.7320508) * scale - vec2(0.0, uScroll * 0.25);

  float edge = 1.0 - smoothstep(0.0, 0.035, h.z);
  float rnd = hash(h.xy);

  // Pulsos: frentes de onda que cruzan la grilla en diagonal, con su ritmo.
  float wave = sin(dot(h.xy, vec2(0.34, 0.21)) - uTime * 0.9 + rnd * 1.2);
  float pulse = smoothstep(0.86, 1.0, wave);
  // Celdas sueltas que se prenden y apagan.
  float blink = smoothstep(0.985, 1.0, sin(uTime * 0.6 + rnd * 40.0));

  // El puntero enciende la colmena a su alrededor.
  float md = length(center - uMouse) / scale;
  float near = exp(-md * md * 0.09);

  vec3 noche = vec3(0.235, 0.063, 0.325);
  vec3 neon = vec3(0.675, 0.31, 0.776);
  vec3 ultra = vec3(0.51, 0.275, 0.686);

  float line = edge * (0.10 + 0.55 * pulse + 0.9 * near);
  float fill = (1.0 - edge) * (0.10 * pulse + 0.22 * blink + 0.16 * near * (0.4 + rnd));
  vec3 c = mix(noche, neon, clamp(pulse + near, 0.0, 1.0)) * line + ultra * fill;

  // Se apaga hacia los bordes: acompaña, no compite.
  vec2 v = vUv - 0.5;
  float vig = smoothstep(0.85, 0.2, length(v * vec2(1.0, 1.25)));
  float a = clamp(max(c.r, max(c.g, c.b)) * 1.6, 0.0, 1.0) * vig * uGain;
  o = vec4(c * vig * uGain, a);
}`;

export type HiveScene = { setRunning(on: boolean): void; stats(): { fps: number }; dispose(): void };

export function createHive(canvas: HTMLCanvasElement, opts: { tier: Tier; still: boolean; onReady: () => void }): HiveScene | null {
  const gl = createContext(canvas);
  if (!gl) return null;
  const prog = createProgram(gl, FULLSCREEN_VS, FS);
  if (!prog) return null;
  const u = uniforms(gl, prog, ["uRes", "uMouse", "uTime", "uScroll", "uGain"] as const);
  gl.bindVertexArray(gl.createVertexArray());
  gl.useProgram(prog);

  let dpr = opts.tier === 2 ? Math.min(devicePixelRatio || 1, 1.5) : 1;
  let W = 0, H = 0;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
    if (w === W && h === H) return;
    W = w; H = h;
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) * dpr;
    mouse.ty = (r.height - (e.clientY - r.top)) * dpr;
  };
  if (!opts.still) addEventListener("pointermove", onMove, { passive: true });

  let time = 0;
  const draw = () => {
    size();
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uRes, W, H);
    gl.uniform2f(u.uMouse, mouse.x, mouse.y);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uScroll, scrollY * dpr);
    gl.uniform1f(u.uGain, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const governor = new Governor(1);
  let raf = 0, running = false, frozen = false, last = 0, lastDraw = 0, ready = false;
  const STEP = 1000 / 30;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - lastDraw < STEP - 2) return;
    const dt = last ? now - last : STEP;
    last = now; lastDraw = now;
    time += Math.min(dt, 100) / 1000;
    draw();
    if (!ready) { ready = true; opts.onReady(); }
    // El gobernador espera ~60 fps; acá el objetivo es 30, así que se le pasa la mitad.
    const verdict = governor.tick(dt / 2);
    if (verdict === "degrade") { dpr = 0.75; W = 0; }
    else if (verdict === "freeze") { frozen = true; stop(); }
  };
  const start = () => { if (running || frozen || opts.still) return; running = true; last = 0; raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  const onLost = (e: Event) => { e.preventDefault(); frozen = true; stop(); };
  canvas.addEventListener("webglcontextlost", onLost);

  if (opts.still) { draw(); opts.onReady(); }

  return {
    setRunning(v) { if (v) start(); else stop(); },
    stats: () => ({ fps: governor.fps * 0.5 }),
    dispose() {
      stop();
      removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
