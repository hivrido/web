/**
 * Composición de las texturas de las tarjetas.
 *
 * Cada tarjeta se dibuja en un canvas 2D: foto real (si carga) con tratamiento
 * duotono hacia el acento del proyecto, más scrim, grano y tipografía. El
 * duotono es lo que unifica material de orígenes distintos en un solo sistema.
 * Si la imagen falla, se genera un fondo procedural con la misma paleta.
 */

import * as THREE from 'three';
import { BRAND_PATHS, BRAND_W, BRAND_H } from './brand.js';
import { loadImage, cardImage } from './images.js';

// Apaisado, como las "tablets" de la referencia.
// W y H son unidades de diseño, no píxeles: todo el dibujo de abajo trabaja en
// este sistema y el mapa de bits real puede ser más chico sin mover una sola
// coordenada (ver TEX_SCALE).
const W = 1024;
const H = 768;

/* En un teléfono la tarjeta enfocada ocupa unos 340 px de ancho: 1024 son
   nueve veces los píxeles que se ven, y cada uno se paga tres veces —el filtro
   de duotono sobre el canvas entero, los shadowBlur de la tipografía y la
   generación de mipmaps al subirla a la GPU—. Componer siete de estas en serie
   era el grueso del bloqueo del hilo durante la carga. */
const COARSE = matchMedia('(pointer: coarse)').matches;
const TEX_SCALE = COARSE ? 0.5 : 1;   // 512 x 384 en táctiles

/* shadowBlur es la única medida del canvas que ignora la transformación: se
   aplica en píxeles del mapa de bits, no en unidades de diseño. Sin corregirlo
   el mismo 34 rendía un halo proporcionalmente más grande en el canvas chico
   —el glow se veía más marcado en el teléfono que en escritorio—, y encima
   el costo de un desenfoque crece con el cuadrado del radio. */
const blur = (px) => px * TEX_SCALE;

/** Dibuja el logotipo de HIVRIDO centrado en (cx, cy), con `width` de ancho.
 *  Sale de los mismos trazos vectoriales que usan el preloader y el header,
 *  así que no hace falta un PNG y queda nítido a cualquier tamaño. */
function drawBrandLogo(ctx, cx, cy, width, color) {
  const scale = width / BRAND_W;
  ctx.save();
  ctx.translate(cx - width / 2, cy - (BRAND_H * scale) / 2);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  for (const d of BRAND_PATHS) ctx.fill(new Path2D(d));
  ctx.restore();
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

/* La pastilla PLAY vive en su propia textura, no horneada en la tarjeta: así
   scene.js puede animarla (respiración, hover, foco) sin redibujar el canvas
   de 1024×768 en cada frame, que sería inviable con ocho tarjetas. */
/* Alto fijo: la pastilla siempre mide lo mismo de arriba abajo. El ancho lo
   decide la palabra, y scene.js saca la proporción del plano de la textura,
   así una etiqueta larga se estira en vez de apretarse. */
export const PLAY_TEX_H = 132;
const PLAY_TEX_MIN_W = 320;

/**
 * @param {string} [label] palabra de la pastilla.
 * @returns {THREE.CanvasTexture} pastilla dorada sobre fondo transparente.
 */
export function makePlayTexture(label = 'PLAY') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  /* Fino: trazo de 1.4 en vez de 2.5, peso 600 y el doble de tracking. Una
     pastilla ancha y baja con la letra suelta se lee premium; la misma forma
     con borde grueso y letra apretada se lee como un botón de sistema. */
  const FONT = '600 30px "Orbitron", sans-serif';
  ctx.font = FONT;
  // El tracking se dibuja a mano: ctx.letterSpacing no está en todos lados.
  // Una palabra larga con el mismo interletrado se desparrama: se afloja.
  const track = label.length > 6 ? 8 : 13;
  const chars = [...label];
  const textW = chars.reduce((a, c) => a + ctx.measureText(c).width, 0) + track * (chars.length - 1);

  const w = textW + 76;
  const h = 66;
  /* El canvas se dimensiona recién ahora, con la palabra ya medida: fijar
     width resetea el contexto, así que la fuente se vuelve a declarar. El
     margen sobrante deja aire para el resplandor del borde. */
  canvas.width = Math.max(PLAY_TEX_MIN_W, Math.ceil(w + 54));
  canvas.height = PLAY_TEX_H;
  ctx.font = FONT;

  const cx = canvas.width / 2;
  const cy = PLAY_TEX_H / 2;
  const x = cx - w / 2;
  const y = cy - h / 2;

  ctx.fillStyle = 'rgba(10,7,16,0.5)';
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();

  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 16;   // sin blur(): esta textura tiene su propio canvas, sin escalar
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.4;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = GOLD;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  // El tracking deja un hueco sobrante al final: medio paso a la derecha lo
  // compensa, si no la palabra queda descentrada dentro de la pastilla.
  let px = cx - textW / 2 + track / 2;
  for (const c of chars) {
    ctx.fillText(c, px, cy + 1);
    px += ctx.measureText(c).width + track;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = COARSE ? 2 : 8;
  tex.needsUpdate = true;
  return tex;
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
  canvas.width = Math.round(W * TEX_SCALE);
  canvas.height = Math.round(H * TEX_SCALE);
  const ctx = canvas.getContext('2d');
  if (TEX_SCALE !== 1) ctx.scale(TEX_SCALE, TEX_SCALE);

  const [img, logo] = await Promise.all([
    loadImage(cardImage(project.image)),
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

  /* ── Scanlines: ahora traman la imagen, no la letra ──
     Iban al final, encima de todo: cada renglón de tipografía se comía una
     franja oscura de 1.4px cada 4 y los cuerpos chicos —el rótulo de arriba
     y el pie— salían deshilachados. La textura de pantalla es de la foto; la
     tipografía va apoyada encima, entera. */
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = '#04040a';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.4);
  ctx.globalAlpha = 1;

  /* ── Tipografía centrada, estilo terminal ── */
  const CX = W / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  /* Ornamento sobre el título: el índice, o el `kicker` del proyecto si trae
     uno. Sube cuando hay logo: los logos son más altos que una línea de texto
     y le comían el aire. Va en blanco —el acento pelado desaparecía sobre las
     fotos oscuras— y con sombra negra corta en vez del halo del acento, que
     con 18px de resplandor envolvía un cuerpo de 34 y lo dejaba borroso. */
  ctx.fillStyle = '#f2f0f7';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = blur(6);
  // 900: el peso de los títulos epic de la home. waitForFonts lo espera —
  // si no está cargado, el canvas cae al peso más cercano y sale flaco.
  ctx.font = '900 34px "Orbitron", sans-serif';

  /* El kicker admite varias líneas. Se ancla la última a la altura de
     siempre y las anteriores crecen hacia arriba: así el aire entre el
     ornamento y el título no cambia según cuántas líneas traiga. */
  const kickerSource = project.kicker ?? `[= ${project.index} =]`;
  const kickerLines = (Array.isArray(kickerSource) ? kickerSource : [kickerSource])
    .map((s) => s.toUpperCase());
  const kickerBase = H * (logo ? 0.21 : 0.30);
  const kickerLH = 34 * 1.18;
  kickerLines.forEach((l, i) =>
    ctx.fillText(l, CX, kickerBase - kickerLH * (kickerLines.length - 1 - i)));
  ctx.shadowBlur = 0;

  /* ── Marca propia del proyecto ──
     Cuando la pieza tiene logo, manda el logo: componer encima un título
     tipográfico sería decir dos veces lo mismo con dos tipografías distintas.
     El PLAY solo aparece si hay algo que ver (`href`). */
  if (project.brandLogo) {
    /* El logotipo de HIVRIDO en blanco, vectorial: es una pieza propia y la
       marca la firma, no un título tipografiado. */
    const lw = W * 0.52;
    const ly = H * 0.5;
    ctx.save();
    ctx.shadowColor = project.accent;
    ctx.shadowBlur = blur(34);
    drawBrandLogo(ctx, CX, ly, lw, '#ffffff');
    // Segunda pasada sin sombra: la primera queda lavada por su propio glow
    ctx.shadowBlur = 0;
    drawBrandLogo(ctx, CX, ly, lw, '#ffffff');
    ctx.restore();

    // Sin filete de acento: el logotipo ya cierra por sí solo, y una raya
    // debajo solo mete ruido entre la marca y el PLAY.
  } else if (logo) {
    const lw = Math.min(W * 0.46, logo.width * 1.4);  // el PNG es chico: upscale contenido
    const lh = lw * (logo.height / logo.width);
    const ly = H * 0.47 - lh / 2;

    ctx.save();
    ctx.shadowColor = project.accent;
    ctx.shadowBlur = blur(34);
    ctx.drawImage(logo, CX - lw / 2, ly, lw, lh);
    // Segunda pasada sin sombra: la primera queda lavada por su propio glow
    ctx.shadowBlur = 0;
    ctx.drawImage(logo, CX - lw / 2, ly, lw, lh);
    ctx.restore();

    // Sin filete de acento acá: el logo ya trae sus propias barras y sumarle
    // otra raya horizontal ensucia la marca. El PLAY tampoco se hornea:
    // lo monta scene.js como plano aparte para poder animarlo.
  } else {
    /* Título con la tipografía de la home: Orbitron 900, tracking apretado
       y líneas juntas, en blanco con el acento puesto en el resplandor.

       Sin glitch por franjas ni eco cromático: a este cuerpo partían los
       glifos —una línea desplazada corta la letra al medio— y el fantasma
       en acento ensuciaba los bordes. La textura ya trae scanlines, que es
       de donde sale el aire de pantalla sin romper la tipografía.

       `cardTitle` manda sobre `title` cuando la ficha quiere decir otra cosa
       que el HUD, y si es un array cada entrada es una línea. */
    const source = project.cardTitle ?? project.title;
    const lines = (Array.isArray(source) ? source : [source]).map((s) => s.toUpperCase());

    // `cardTitleScale` deja bajarlo por ficha sin tocar al resto
    let size = Math.round(104 * (project.cardTitleScale ?? 1));

    // El tracking se declara junto con la fuente: entra en la medición, y sin
    // resetearlo después se contagiaría al pie de la ficha.
    const setFont = () => {
      ctx.font = `900 ${size}px "Orbitron", sans-serif`;
      ctx.letterSpacing = `${(-0.01 * size).toFixed(2)}px`;   // el -0.01em de la home
    };

    const widest = () => {
      setFont();
      return Math.max(...lines.map((l) => ctx.measureText(l).width));
    };
    while (widest() > W - 150 && size > 34) size -= 3;
    setFont();

    const lineH = size * 0.98;          // el line-height de la home
    const textH = lineH * lines.length;
    const titleY = H * 0.545;           // por debajo del centro: la ficha respira arriba

    /* Velo detrás del título. El fondo de la ficha es una foto y su detalle
       —textos, caras, luces— compite con la tipografía: es lo que hace que
       el mismo blanco se vea sólido en una ficha y lavado en otra. Elipse
       oscura centrada en el bloque, suave en todos los bordes para que no se
       lea como una caja, y del ancho del texto para no oscurecer de más en
       los títulos cortos. */
    const scrimW = Math.min(W * 0.95, widest() + 260);
    const scrimH = textH + 150;
    ctx.save();
    ctx.translate(CX, titleY);
    ctx.scale(1, scrimH / scrimW);
    const scrim = ctx.createRadialGradient(0, 0, 0, 0, 0, scrimW / 2);
    scrim.addColorStop(0, 'rgba(4,4,10,0.86)');
    scrim.addColorStop(0.5, 'rgba(4,4,10,0.62)');
    scrim.addColorStop(1, 'rgba(4,4,10,0)');
    ctx.fillStyle = scrim;
    ctx.beginPath();
    ctx.arc(0, 0, scrimW / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cada línea centrada sobre el eje de la ficha
    setFont();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = project.accent;
    ctx.shadowBlur = blur(26);
    ctx.fillStyle = '#ffffff';
    lines.forEach((l, i) => ctx.fillText(l, CX, titleY - textH / 2 + lineH * (i + 0.5)));
    ctx.shadowBlur = 0;
    ctx.letterSpacing = '0px';

    // Filete de acento centrado al pie del bloque
    ctx.fillStyle = project.accent;
    ctx.fillRect(CX - 38, titleY + textH / 2 + 26, 76, 3);
  }

  /* Pie de la ficha: categoría y año, o el `meta` del proyecto si trae uno
     —para las piezas donde el año no dice nada y sí importa la frase—.

     Blanco puro a 30px: el 44 quedaba desmedido contra el título. Lo que
     lo hace legible no es el cuerpo sino el fondo — debajo hay una foto
     con luces y el blanco sobre claro no contrasta—: va sobre una banda
     oscura propia, degradada hacia los costados para no leerse como una
     caja pegada, y con doble sombra, negra para separar del fondo y del
     acento para integrarlo a la pieza. */
  const metaSource = project.meta ?? `${project.category} · ${project.year}`;
  const metaLines = (Array.isArray(metaSource) ? metaSource : [metaSource])
    .map((s) => s.toUpperCase());

  // Se achica sola si alguna línea no entra: el pie nunca se sale de la ficha
  let ms = 30;
  const metaWidest = () => {
    ctx.font = `900 ${ms}px "Orbitron", sans-serif`;
    return Math.max(...metaLines.map((l) => ctx.measureText(l).width));
  };
  while (metaWidest() > W - 80 && ms > 20) ms -= 1;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Anclado abajo: la última línea siempre cae a la misma altura
  const metaLH = ms * 1.22;
  const metaBase = (i) => H - 56 - metaLH * (metaLines.length - 1 - i);

  /* Banda de contraste: el texto necesita fondo propio, si no compite con
     lo que haya en la foto. Se desvanece a los lados para no leerse como
     una caja pegada encima. */
  const bandTop = metaBase(0) - ms;
  const bandH = H - bandTop;
  const band = ctx.createLinearGradient(0, 0, W, 0);
  band.addColorStop(0, 'rgba(4,4,10,0)');
  band.addColorStop(0.18, 'rgba(4,4,10,0.82)');
  band.addColorStop(0.82, 'rgba(4,4,10,0.82)');
  band.addColorStop(1, 'rgba(4,4,10,0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, bandTop - 14, W, bandH + 14);

  /* Una sola pasada con sombra negra corta. La segunda, con glow del acento,
     integraba el pie a la pieza pero le comía el filo: sobre la banda oscura
     el contraste ya alcanza, y lo que se pide de este renglón es que se lea. */
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = blur(8);
  metaLines.forEach((l, i) => ctx.fillText(l, CX, metaBase(i)));
  ctx.shadowBlur = 0;

  ctx.textAlign = 'left';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = COARSE ? 2 : 8;
  tex.needsUpdate = true;
  return tex;
}

/** Espera a las webfonts: si no, los títulos se dibujan con la fuente de sistema. */
/* Las @font-face se declaran en línea en el <head>, así que ya están
   registradas cuando corre esto: document.fonts.load() las encuentra sin
   depender de que haya llegado ninguna hoja externa. Importa, porque una
   textura horneada con la tipografía de sistema no se rehace después. */
export async function waitForFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('900 34px "Orbitron"'),
      document.fonts.load('700 96px "Orbitron"'),
      document.fonts.load('500 21px "Orbitron"'),
      document.fonts.load('400 16px "Rubik"'),
    ]);
    await document.fonts.ready;
  } catch {
    /* sin fuentes propias se dibuja igual, solo cambia el tipo */
  }
}
