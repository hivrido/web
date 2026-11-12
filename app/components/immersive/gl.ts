/**
 * Lo mínimo de WebGL2 que comparten las dos piezas de la capa inmersiva: el
 * logo H▷ y el fondo de colmena.
 *
 * No hay motor: son dos escenas de un puñado de draw calls, y traer three
 * para eso es bajar y compilar ~130 KB comprimidos para dibujar una malla y
 * un rectángulo. Esto pesa dos órdenes de magnitud menos y arranca en el
 * mismo cuadro en que se lo pide.
 */

export type GL = WebGL2RenderingContext;

export function createContext(canvas: HTMLCanvasElement, alpha = true): GL | null {
  try {
    return canvas.getContext("webgl2", {
      alpha,
      premultipliedAlpha: true,
      /* El suavizado se hace en un framebuffer propio (o no hace falta): el
         del lienzo se pagaría dos veces. */
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      /* Con una GPU en lista negra el navegador cae a render por software,
         que funciona pero no llega ni cerca de 50 fps: mejor el estático. */
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return null;
  }
}

function shader(gl: GL, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

/** Compila y enlaza. Devuelve null si falla: quien llama se queda en el estático. */
export function createProgram(gl: GL, vs: string, fs: string, attribs: string[] = []): WebGLProgram | null {
  const p = gl.createProgram()!;
  const v = shader(gl, gl.VERTEX_SHADER, vs);
  const f = shader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  attribs.forEach((name, i) => gl.bindAttribLocation(p, i, name));
  gl.linkProgram(p);
  /* El estado se consulta una sola vez, después de enlazar: preguntar por
     cada shader obliga al driver a terminar la compilación en el momento. */
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[inmersivo] shader:", gl.getProgramInfoLog(p), gl.getShaderInfoLog(v), gl.getShaderInfoLog(f));
    }
    gl.deleteProgram(p);
    return null;
  }
  gl.deleteShader(v);
  gl.deleteShader(f);
  return p;
}

/** Diccionario de uniforms, resuelto una vez. */
export function uniforms<T extends string>(gl: GL, p: WebGLProgram, names: readonly T[]) {
  const out = {} as Record<T, WebGLUniformLocation | null>;
  for (const n of names) out[n] = gl.getUniformLocation(p, n);
  return out;
}

/** Un triángulo que cubre la pantalla: el vertex shader lo arma con gl_VertexID. */
export const FULLSCREEN_VS = `#version 300 es
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export type Target = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };

/** Textura con su framebuffer, para las pasadas de posproceso. */
export function createTarget(gl: GL, w: number, h: number, hdr: boolean): Target {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  if (hdr) gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA16F, w, h);
  else gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, w, h);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { fbo, tex, w, h };
}

export function deleteTarget(gl: GL, t: Target | null) {
  if (!t) return;
  gl.deleteFramebuffer(t.fbo);
  gl.deleteTexture(t.tex);
}

/* ── Matrices 4x4, en orden de columnas ── */

export type Mat4 = Float32Array;

export function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

/** Giro en Y (yaw) y después en X (pitch), con escala uniforme. */
export function rotationYX(yaw: number, pitch: number, scale = 1): Mat4 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  const m = new Float32Array(16);
  // Rx(pitch) · Ry(yaw)
  m[0] = cy * scale;       m[1] = sx * sy * scale;  m[2] = -cx * sy * scale;
  m[4] = 0;                m[5] = cx * scale;       m[6] = sx * scale;
  m[8] = sy * scale;       m[9] = -sx * cy * scale; m[10] = cx * cy * scale;
  m[15] = 1;
  return m;
}
