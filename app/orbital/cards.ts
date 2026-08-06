/**
 * Texturas de las tarjetas, compuestas en canvas 2D.
 *
 * El material disponible es heterogéneo (fotogramas, retratos, fondos), así que
 * cada imagen pasa por duotono hacia el acento del proyecto y recibe la
 * tipografía encima. Eso es lo que hace que ocho orígenes distintos se lean
 * como un sistema. Si una imagen no carga, se genera un fondo procedural con
 * la misma paleta en lugar de dejar un hueco en la órbita.
 *
 * Formato apaisado y título centrado: la tarjeta es la portada del proyecto,
 * no una ficha. El HUD no repite el título, lo lleva la tarjeta.
 */

import * as THREE from "three";
import type { Project } from "./projects";

export interface CardSize { w: number; h: number }

/**
 * Lienzo de referencia. Toda la tipografía se dimensiona contra este ancho,
 * así que cualquier otro tamaño mantiene las proporciones.
 */
const REF_W = 1024;

/**
 * Ocho texturas a 1024 son unos 28 MB de VRAM contando mipmaps: de más para
 * un teléfono de gama baja. A 640 el mismo set baja a 11 MB y en pantalla no
 * se nota, porque ahí la tarjeta nunca ocupa más de 640 px físicos.
 */
export function cardTextureSize(coarse: boolean): CardSize {
  return coarse ? { w: 640, h: 410 } : { w: REF_W, h: 656 };
}

/** Nunca rechaza: resuelve en null y el llamador dibuja el fallback. */
function loadImage(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn("[orbital] imagen no disponible, fondo procedural:", src);
      resolve(null);
    };
    img.src = src;
  });
}

/** Equivalente a object-fit: cover. */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number) {
  const ir = img.width / img.height;
  const cr = W / H;
  let w: number, h: number, x: number, y: number;
  if (ir > cr) { h = H; w = H * ir; x = (W - w) / 2; y = 0; }
  else { w = W; h = W / ir; x = 0; y = (H - h) / 2; }
  ctx.drawImage(img, x, y, w, h);
}

/** Fondo generativo en la paleta del proyecto. */
function drawProcedural(ctx: CanvasRenderingContext2D, accent: string, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#111a33");
  g.addColorStop(0.5, "#070c1a");
  g.addColorStop(1, "#1a0f2e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.14;
  for (let i = 0; i < 26; i++) {
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 1.25, 90 + i * 52, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const halo = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.7);
  halo.addColorStop(0, accent + "55");
  halo.addColorStop(1, "transparent");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
}

/** Grano teselado — evita el banding de los degradados. */
let grainPattern: CanvasPattern | null = null;
function getGrain(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  if (grainPattern) return grainPattern;
  const c = document.createElement("canvas");
  c.width = c.height = 96;
  const g = c.getContext("2d");
  if (!g) return null;
  const data = g.createImageData(96, 96);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  g.putImageData(data, 0, 0);
  grainPattern = ctx.createPattern(c, "repeat");
  return grainPattern;
}

/* ── Texto con tracking ──
   `ctx.letterSpacing` todavía no está en todos los motores, y acá el
   interletrado ancho no es un detalle: es la mitad del carácter techno.
   Se dibuja carácter por carácter para que salga igual en todos lados. */

function measureTracked(ctx: CanvasRenderingContext2D, text: string, tracking: number): number {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return w - tracking;
}

function drawTrackedCenter(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  tracking: number,
  alsoStroke = false
) {
  let x = cx - measureTracked(ctx, text, tracking) / 2;
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    if (alsoStroke) ctx.strokeText(ch, x, y);
    x += ctx.measureText(ch).width + tracking;
  }
}

export interface CardFonts {
  /** Familia techno para los títulos. */
  display: string;
  /** Familia para índice, año y cliente. */
  mono: string;
}

const FALLBACK_FONTS: CardFonts = {
  display: "system-ui, sans-serif",
  mono: "ui-monospace, monospace",
};

export async function makeCardTexture(
  project: Project,
  fonts: CardFonts = FALLBACK_FONTS,
  size: CardSize = cardTextureSize(false)
): Promise<THREE.CanvasTexture> {
  const { w: W, h: H } = size;
  // Todo lo tipográfico se mide contra el lienzo de referencia: cambiar el
  // tamaño no puede cambiar la composición.
  const s = W / REF_W;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const img = await loadImage(project.image);

  ctx.fillStyle = "#070c1a";
  ctx.fillRect(0, 0, W, H);

  if (img) {
    // Muy oscura a propósito: varias fotos traen texto quemado y el título
    // que componemos encima tiene que ganar siempre.
    ctx.filter = "grayscale(1) contrast(1.05) brightness(0.42)";
    drawCover(ctx, img, W, H);
    ctx.filter = "none";

    // Duotono: multiplica hacia el acento, levanta las sombras al azul
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = project.accent;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "#0d1430";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "rgba(5,10,24,0.38)";
    ctx.fillRect(0, 0, W, H);
  } else {
    drawProcedural(ctx, project.accent, W, H);
  }

  const grain = getGrain(ctx);
  if (grain) {
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.09;
    ctx.fillStyle = grain;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // Viñeta interior: hunde las esquinas y despeja el centro para el título.
  const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.18, W * 0.5, H * 0.5, W * 0.72);
  vig.addColorStop(0, "rgba(5,10,24,0)");
  vig.addColorStop(1, "rgba(5,10,24,0.78)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  /* ── Tipografía ── */
  const PAD = 46 * s;
  const cx = W / 2;

  ctx.textBaseline = "top";
  ctx.fillStyle = project.accent;
  ctx.font = `500 ${22 * s}px ${fonts.mono}`;
  ctx.fillText(project.index, PAD, PAD);

  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.textAlign = "right";
  ctx.fillText(project.year, W - PAD, PAD);
  ctx.textAlign = "left";

  // Cliente, chico y separado, arriba del título: da escala al bloque grande.
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = `500 ${20 * s}px ${fonts.mono}`;
  drawTrackedCenter(ctx, project.client.toUpperCase(), cx, H * 0.42, 5 * s);

  // El título se achica solo hasta entrar, tracking incluido. Peso 500 y no
  // 700: en una cara geométrica ancha, el bold macizo se empasta y el
  // interletrado deja de leerse.
  const TRACK = 0.12;
  let type = 92 * s;
  const fits = () => {
    ctx.font = `500 ${type}px ${fonts.display}`;
    return measureTracked(ctx, project.title, type * TRACK) <= W - PAD * 2.4;
  };
  while (!fits() && type > 34 * s) type -= 3 * s;

  ctx.save();
  // Blanco cálido contra una escena fría: el contraste de temperatura es lo
  // que hace que el título flote en vez de quedar pegado a la imagen.
  ctx.fillStyle = "#fdf7ec";
  ctx.strokeStyle = "rgba(255,255,255,0.30)";
  ctx.lineWidth = Math.max(1, s);
  ctx.shadowColor = project.accent;
  ctx.shadowBlur = 34 * s;
  drawTrackedCenter(ctx, project.title, cx, H * 0.58, type * TRACK, true);
  ctx.restore();

  // Regla y disciplina al pie, centradas: cierran la composición.
  ctx.fillStyle = project.accent;
  ctx.fillRect(cx - 26 * s, H * 0.66, 52 * s, Math.max(1, 2 * s));

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `500 ${17 * s}px ${fonts.mono}`;
  drawTrackedCenter(ctx, project.category.toUpperCase(), cx, H - PAD, 4 * s);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Espera a que las webfonts estén listas antes de dibujar en canvas.
 * next/font genera nombres de familia con hash, así que no se puede pedir una
 * fuente por nombre: se espera a que resuelvan todas, con tope por las dudas.
 */
export async function waitForFonts(timeoutMs = 2500): Promise<void> {
  if (!document.fonts) return;
  await Promise.race([
    document.fonts.ready,
    new Promise((r) => setTimeout(r, timeoutMs)),
  ]).catch(() => {});
}

/**
 * Lee las familias reales desde las variables CSS que inyecta next/font.
 * Sin esto los títulos de las tarjetas salen con la fuente del sistema.
 */
export function readCardFonts(el: HTMLElement): CardFonts {
  const cs = getComputedStyle(el);
  const display = cs.getPropertyValue("--font-techno").trim();
  const mono = cs.getPropertyValue("--font-mono-orbital").trim();
  return {
    display: display ? `${display}, sans-serif` : FALLBACK_FONTS.display,
    mono: mono ? `${mono}, monospace` : FALLBACK_FONTS.mono,
  };
}
