/**
 * Composición de las texturas de las tarjetas.
 *
 * Cada tarjeta se dibuja en un canvas 2D: foto real (si carga) con tratamiento
 * duotono hacia el acento del proyecto, más scrim, grano y tipografía. El
 * duotono es lo que unifica material de orígenes distintos en un solo sistema.
 * Si la imagen falla, se genera un fondo procedural con la misma paleta.
 */

import * as THREE from 'three';

// Apaisado, como las "tablets" de la referencia
const W = 1024;
const H = 768;

/** Carga una imagen; resuelve en null si falla (nunca rechaza). */
function loadImage(src) {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('[cosmos] no cargó la imagen, se usa fondo procedural:', src);
      resolve(null);
    };
    img.src = src;
  });
}

/** Dibuja la imagen cubriendo el canvas sin deformarla (object-fit: cover). */
function drawCover(ctx, img) {
  const ir = img.width / img.height;
  const cr = W / H;
  let w, h, x, y;
  if (ir > cr) { h = H; w = H * ir; x = (W - w) / 2; y = 0; }
  else         { w = W; h = W / ir; x = 0; y = (H - h) / 2; }
  ctx.drawImage(img, x, y, w, h);
}

/** Fondo generativo: campo de bandas y ruido en la paleta del proyecto. */
function drawProcedural(ctx, accent) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#150a24');
  g.addColorStop(0.5, '#0a0710');
  g.addColorStop(1, '#1d0a2e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Arcos concéntricos descentrados: da profundidad sin parecer un degradado plano
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 26; i++) {
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 1.05, 90 + i * 46, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const halo = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.85);
  halo.addColorStop(0, accent + '55');
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
}

/* Dorado de la pastilla PLAY: no usa el acento del proyecto a propósito.
   El acento identifica al proyecto; el dorado marca "esto se puede ver". */
const GOLD = '#E9B44C';

/** Rectángulo redondeado con fallback para navegadores sin roundRect. */
function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Pastilla PLAY, contorneada en dorado, centrada en `cx`. */
function drawPlayPill(ctx, cx, cy) {
  const label = 'PLAY';
  const fs = 34;
  ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
  // El tracking se dibuja a mano: ctx.letterSpacing no está en todos lados.
  const track = 7;
  const chars = [...label];
  const textW = chars.reduce((a, c) => a + ctx.measureText(c).width, 0) + track * (chars.length - 1);

  const padX = 34;
  const w = textW + padX * 2;
  const h = 74;
  const x = cx - w / 2;
  const y = cy - h / 2;

  ctx.save();
  ctx.fillStyle = 'rgba(10,7,16,0.55)';
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();

  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 22;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  roundRect(ctx, x, y, w, h, 14);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = GOLD;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  let px = cx - textW / 2;
  for (const c of chars) {
    ctx.fillText(c, px, cy + 1);
    px += ctx.measureText(c).width + track;
  }
  ctx.restore();
}

/** Grano fino teselado — evita el banding de los degradados. */
let grainPattern = null;
function getGrain(ctx) {
  if (grainPattern) return grainPattern;
  const c = document.createElement('canvas');
  c.width = c.height = 96;
  const g = c.getContext('2d');
  const data = g.createImageData(96, 96);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  g.putImageData(data, 0, 0);
  grainPattern = ctx.createPattern(c, 'repeat');
  return grainPattern;
}

/**
 * @param {object} project  entrada de PROJECTS
 * @returns {Promise<THREE.CanvasTexture>}
 */
export async function makeCardTexture(project) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const [img, logo] = await Promise.all([
    loadImage(project.image),
    loadImage(project.logo),
  ]);

  /* ── Capa base ── */
  ctx.fillStyle = '#0a0710';
  ctx.fillRect(0, 0, W, H);

  if (img) {
    // filter no está en todos los navegadores viejos; si no existe se ve algo
    // más claro pero el duotono posterior lo compensa.
    // Bastante oscura a propósito: varias fotos ya traen texto quemado y la
    // tipografía que componemos encima tiene que ganar siempre.
    ctx.filter = 'grayscale(1) contrast(1.05) brightness(0.42)';
    drawCover(ctx, img);
    ctx.filter = 'none';

    // Duotone: multiplica hacia el acento y levanta las sombras al violeta
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = project.accent;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = '#140823';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    // Velo final: la foto queda como atmósfera, no como contenido. Sin esto,
    // el texto quemado de algunas fotos compite con el título de la tarjeta.
    ctx.fillStyle = 'rgba(6,5,12,0.34)';
    ctx.fillRect(0, 0, W, H);
  } else {
    drawProcedural(ctx, project.accent);
  }

  /* ── Grano ── */
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = getGrain(ctx);
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  /* ── Scrim inferior para que la tipografía siempre lea ── */
  const scrim = ctx.createLinearGradient(0, H * 0.34, 0, H);
  scrim.addColorStop(0, 'rgba(6,5,10,0)');
  scrim.addColorStop(0.55, 'rgba(6,5,10,0.72)');
  scrim.addColorStop(1, 'rgba(6,5,10,0.96)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, W, H);

  // Scrim superior, más suave
  const top = ctx.createLinearGradient(0, 0, 0, H * 0.26);
  top.addColorStop(0, 'rgba(6,5,10,0.7)');
  top.addColorStop(1, 'rgba(6,5,10,0)');
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, H * 0.26);

  /* ── Tipografía centrada, estilo terminal ── */
  const CX = W / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Ornamento de índice sobre el título. Sube cuando hay logo: los logos son
  // más altos que una línea de texto y le comían el aire.
  ctx.fillStyle = project.accent;
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillText(`[= ${project.index} =]`, CX, H * (logo ? 0.21 : 0.30));

  /* ── Marca propia del proyecto ──
     Cuando la pieza tiene logo, manda el logo: componer encima un título
     tipográfico sería decir dos veces lo mismo con dos tipografías distintas.
     El PLAY solo aparece si hay algo que ver (`href`). */
  if (logo) {
    const lw = Math.min(W * 0.46, logo.width * 1.4);  // el PNG es chico: upscale contenido
    const lh = lw * (logo.height / logo.width);
    const ly = H * 0.47 - lh / 2;

    ctx.save();
    ctx.shadowColor = project.accent;
    ctx.shadowBlur = 34;
    ctx.drawImage(logo, CX - lw / 2, ly, lw, lh);
    // Segunda pasada sin sombra: la primera queda lavada por su propio glow
    ctx.shadowBlur = 0;
    ctx.drawImage(logo, CX - lw / 2, ly, lw, lh);
    ctx.restore();

    // Sin filete de acento acá: el logo ya trae sus propias barras y sumarle
    // otra raya horizontal ensucia la marca.
    if (project.href) drawPlayPill(ctx, CX, H * 0.735);
  } else {
    // El título se compone en un canvas aparte para poder glitchearlo por franjas
    const label = project.title.toUpperCase();
    const tCan = document.createElement('canvas');
    tCan.width = W;
    tCan.height = 240;
    const tc = tCan.getContext('2d');
    tc.textAlign = 'center';
    tc.textBaseline = 'middle';

    let size = 88;
    tc.font = `700 ${size}px "JetBrains Mono", monospace`;
    while (tc.measureText(label).width > W - 180 && size > 34) {
      size -= 3;
      tc.font = `700 ${size}px "JetBrains Mono", monospace`;
    }

    // Eco cromático detrás: el "doble fantasma" de la referencia
    tc.globalAlpha = 0.55;
    tc.fillStyle = project.accent;
    tc.fillText(label, tCan.width / 2 + 8, tCan.height / 2 + 6);
    tc.globalAlpha = 1;

    tc.shadowColor = project.accent;
    tc.shadowBlur = 26;
    tc.fillStyle = '#ffffff';
    tc.fillText(label, tCan.width / 2, tCan.height / 2);
    tc.shadowBlur = 0;

    // Glitch estático: franjas horizontales desplazadas
    for (let i = 0; i < 6; i++) {
      const sy = Math.floor(Math.random() * tCan.height);
      const sh = 5 + Math.floor(Math.random() * 16);
      const dx = Math.round((Math.random() - 0.5) * 34);
      tc.putImageData(tc.getImageData(0, sy, tCan.width, sh), dx, sy);
    }

    const titleY = H * 0.48;
    ctx.drawImage(tCan, 0, titleY - tCan.height / 2);

    // Filete de acento centrado bajo el título
    ctx.fillStyle = project.accent;
    ctx.fillRect(CX - 38, titleY + 70, 76, 3);
  }

  // Categoría y año, abajo al centro
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(255,255,255,0.52)';
  ctx.font = '500 21px "JetBrains Mono", monospace';
  ctx.fillText(`${project.category.toUpperCase()} · ${project.year}`, CX, H - 52);

  /* ── Scanlines: traman todo, tipografía incluida, como pantalla ── */
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = '#04040a';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.4);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** Espera a las webfonts: si no, los títulos se dibujan con la fuente de sistema. */
export async function waitForFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('700 96px "JetBrains Mono"'),
      document.fonts.load('700 78px "Space Grotesk"'),
      document.fonts.load('500 21px "JetBrains Mono"'),
    ]);
    await document.fonts.ready;
  } catch {
    /* sin fuentes propias se dibuja igual, solo cambia el tipo */
  }
}
