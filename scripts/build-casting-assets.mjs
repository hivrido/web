/**
 * Genera las imágenes de /casting a partir del póster de Cuchillo Paz.
 *
 * Produce dos cosas:
 *
 * 1. `casting-cuchillo-paz.jpg` — la tarjeta que se ve al pegar el link en
 *    WhatsApp. Es lo primero que mira casi todo el mundo: antes que la
 *    página, dentro del globo del chat. El póster ocupa la franja izquierda a
 *    tamaño completo —no recortado: su relación es 2:3 y la franja también— y
 *    la derecha lleva la fecha y el lugar en tipografía grande, que es lo que
 *    tiene que leerse en una miniatura.
 *
 * 2. `cuchillo-paz-poster-{400,800}.webp` — el arte que se muestra en la
 *    página. Dos anchos para el `srcset`: el teléfono baja el de 400.
 *
 * NO corre en `prebuild`. La salida está commiteada y la fuente no —misma
 * convención que `scripts/lib/resize-images.mjs`: las fuentes pesadas viven
 * fuera del repo—, así que regenerarla en cada build sería escribir los
 * mismos archivos una y otra vez. Se corre a mano cuando cambia el póster, la
 * fecha o el lugar:
 *
 *     node scripts/build-casting-assets.mjs
 *
 * Las fuentes tipográficas son las del sistema, no las de la marca: librsvg
 * resuelve por fontconfig y los .woff2 de public/fonts no están instalados.
 * Una grotesca pesada sostiene bien el tono crudo del proyecto, que es de lo
 * que se trata.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

/* El póster, tal como lo dejó producción. No se versiona: si falta, el script
   avisa y los archivos ya generados siguen sirviendo. */
const POSTER = path.join(root, "public", "images", "bg", "cuchillo paz.png");

const outDir = path.join(root, "public", "images", "casting");

const W = 1200;
const H = 630;
/* El póster es 1024x1536, o sea 2:3. La franja mide 420x630, que es la misma
   proporción: entra entero, sin recortar a nadie la cara. */
const PANEL = 420;

/* Los mismos valores que app/casting/contenido.ts. Se copian a mano: este
   script es Node puro y no puede importar un módulo de TypeScript. */
const TEXTO = {
  arriba: "CASTING ABIERTO",
  serie: "CUCHILLO PAZ",
  fecha: "SÁBADO 19 DE SEPTIEMBRE · 9 AM",
  calle: "Naciones Unidas 2390 esq. Quiroz",
  zona: "Barrio Frino · José C. Paz",
  claim: "NO HAY QUE PREPARAR NADA.",
  pie: "GRATIS · POR ORDEN DE LLEGADA · CON DNI",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const DISPLAY = "Arial Black, Arial Bold, Arial, sans-serif";
const CUERPO = "Arial, Helvetica, sans-serif";

/** Centro de la columna de texto, a la derecha del póster. */
const CX = PANEL + (W - PANEL) / 2;

/* ── 1 · Tarjeta de previsualización ────────────────────────────────────── */

/** Fondo: la atmósfera de la marca, debajo de todo. */
const fondo = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="violeta" cx="72%" cy="-10%" r="75%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect width="${W}" height="${H}" fill="url(#violeta)"/>
</svg>`;

/** Capa de arriba: el desvanecido del póster y todo el texto. */
const capa = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <!-- El póster no termina en un corte recto: se funde en el fondo. -->
    <linearGradient id="fusion" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </linearGradient>
    <pattern id="trama" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#ffffff" opacity="0.030"/>
    </pattern>
  </defs>

  <rect x="${PANEL - 130}" y="0" width="130" height="${H}" fill="url(#fusion)"/>
  <rect x="${PANEL}" width="${W - PANEL}" height="${H}" fill="url(#trama)"/>

  <text x="${CX}" y="168" text-anchor="middle" font-family="${DISPLAY}"
        font-size="40" letter-spacing="8" fill="#f0f0f0"
        fill-opacity="0.80">${esc(TEXTO.arriba)}</text>

  <text x="${CX}" y="258" text-anchor="middle" font-family="${DISPLAY}"
        font-size="76" letter-spacing="-1" fill="#ffffff">${esc(TEXTO.serie)}</text>

  <rect x="${CX - 120}" y="294" width="240" height="3" fill="#C9A84C"/>

  <text x="${CX}" y="362" text-anchor="middle" font-family="${DISPLAY}"
        font-size="28" letter-spacing="2" fill="#E8C97A">${esc(TEXTO.fecha)}</text>

  <text x="${CX}" y="408" text-anchor="middle" font-family="${CUERPO}"
        font-size="25" fill="#ffffff" fill-opacity="0.90">${esc(TEXTO.calle)}</text>

  <text x="${CX}" y="444" text-anchor="middle" font-family="${CUERPO}"
        font-size="22" fill="#ffffff" fill-opacity="0.66">${esc(TEXTO.zona)}</text>

  <text x="${CX}" y="516" text-anchor="middle" font-family="${DISPLAY}"
        font-size="30" letter-spacing="2" fill="#E8C97A">${esc(TEXTO.claim)}</text>

  <rect x="${PANEL + 40}" y="548" width="${W - PANEL - 80}" height="50"
        fill="#7C3AED" fill-opacity="0.20"/>
  <text x="${CX}" y="580" text-anchor="middle" font-family="${DISPLAY}"
        font-size="19" letter-spacing="2.5" fill="#ffffff">${esc(TEXTO.pie)}</text>
</svg>`;

await mkdir(outDir, { recursive: true });

const poster = await sharp(POSTER)
  .resize(PANEL, H, { fit: "cover", position: "top" })
  .toBuffer();

const og = path.join(outDir, "casting-cuchillo-paz.jpg");

/* JPEG y no PNG: WhatsApp descarta las previsualizaciones pesadas, y el
   póster es una foto —en PNG pesaría varias veces lo mismo sin verse mejor. */
const ogInfo = await sharp(Buffer.from(fondo, "utf8"))
  .composite([
    { input: poster, left: 0, top: 0 },
    { input: Buffer.from(capa, "utf8"), left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(og);

console.log(
  `casting-cuchillo-paz.jpg — ${ogInfo.width}x${ogInfo.height}, ${(ogInfo.size / 1024).toFixed(0)} kB`
);

/* ── 2 · El póster dentro de la página ──────────────────────────────────── */

/* 400 para el teléfono, 800 para pantallas densas y escritorio. El PNG de
   2,7 MB que entrega producción no viaja por datos móviles ni de casualidad. */
for (const ancho of [400, 800]) {
  const dst = path.join(outDir, `cuchillo-paz-poster-${ancho}.webp`);
  const info = await sharp(POSTER)
    .resize(ancho, Math.round((ancho * 3) / 2), { fit: "cover", position: "top" })
    .webp({ quality: 74, effort: 6 })
    .toFile(dst);
  console.log(
    `cuchillo-paz-poster-${ancho}.webp — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} kB`
  );
}
