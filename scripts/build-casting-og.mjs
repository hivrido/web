/**
 * Genera la tarjeta de previsualización de /casting.
 *
 * El link del casting se reparte por WhatsApp: lo primero que ve la mayoría
 * no es la página, es el rectángulo que aparece dentro del globo del chat. Si
 * ahí no se lee la fecha y el lugar, el mensaje se reenvía igual pero llega
 * vacío.
 *
 * No hay material fotográfico de Cuchillo Paz en el repo, y poner una foto de
 * otra serie sería mentirle a quien la mira. Así que la tarjeta es
 * tipográfica: fondo de la marca, el nombre grande y los tres datos que
 * importan.
 *
 * NO corre en `prebuild`. La fuente es este mismo archivo y la salida está
 * commiteada: regenerarla en cada build sería escribir el mismo JPEG una y
 * otra vez. Se corre a mano cuando cambia la fecha o el lugar:
 *
 *     node scripts/build-casting-og.mjs
 *
 * Las fuentes son las del sistema, no las de la marca: librsvg resuelve por
 * fontconfig y los .woff2 de public/fonts no están instalados. Una grotesca
 * pesada sostiene bien el tono crudo del proyecto, que es de lo que se trata.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

const W = 1200;
const H = 630;

/* Los mismos valores que app/casting/contenido.ts. Se copian a mano: este
   script es Node puro y no puede importar un módulo de TypeScript. */
const TEXTO = {
  kicker: "HIVRIDO",
  arriba: "CASTING ABIERTO",
  serie: "CUCHILLO PAZ",
  fecha: "SÁBADO 19 DE SEPTIEMBRE · DESDE LAS 9 AM",
  lugar: "Naciones Unidas 2390 esq. Quiroz — Barrio Frino, José C. Paz",
  pie: "GRATIS · POR ORDEN DE LLEGADA · NO HAY QUE PREPARAR NADA",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const DISPLAY = "Arial Black, Arial Bold, Arial, sans-serif";
const CUERPO = "Arial, Helvetica, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="violeta" cx="50%" cy="-14%" r="70%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="oro" cx="4%" cy="104%" r="55%">
      <stop offset="0%" stop-color="#C9A84C" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#C9A84C" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="haz" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="35%" stop-color="#A78BFA" stop-opacity="0"/>
      <stop offset="50%" stop-color="#A78BFA" stop-opacity="0.13"/>
      <stop offset="65%" stop-color="#A78BFA" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.85"/>
    </linearGradient>
    <pattern id="trama" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#ffffff" opacity="0.030"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect width="${W}" height="${H}" fill="url(#violeta)"/>
  <rect width="${W}" height="${H}" fill="url(#oro)"/>
  <rect width="${W}" height="${H}" fill="url(#haz)"/>
  <rect width="${W}" height="${H}" fill="url(#trama)"/>
  <rect y="${H * 0.55}" width="${W}" height="${H * 0.45}" fill="url(#fondo)"/>

  <!-- Marco interior: encuadra el contenido cuando el chat recorta los bordes -->
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none"
        stroke="#ffffff" stroke-opacity="0.10"/>

  <!-- Marca -->
  <text x="${W / 2}" y="112" text-anchor="middle" font-family="${DISPLAY}"
        font-size="22" letter-spacing="14" fill="#A78BFA">${esc(TEXTO.kicker)}</text>

  <!-- Título -->
  <text x="${W / 2}" y="212" text-anchor="middle" font-family="${DISPLAY}"
        font-size="52" letter-spacing="9" fill="#f0f0f0"
        fill-opacity="0.86">${esc(TEXTO.arriba)}</text>

  <text x="${W / 2}" y="330" text-anchor="middle" font-family="${DISPLAY}"
        font-size="112" letter-spacing="-1" fill="#ffffff">${esc(TEXTO.serie)}</text>

  <!-- Regla dorada -->
  <rect x="${W / 2 - 150}" y="372" width="300" height="3" fill="#C9A84C"/>

  <!-- Cuándo y dónde -->
  <text x="${W / 2}" y="440" text-anchor="middle" font-family="${DISPLAY}"
        font-size="31" letter-spacing="2" fill="#E8C97A">${esc(TEXTO.fecha)}</text>

  <text x="${W / 2}" y="486" text-anchor="middle" font-family="${CUERPO}"
        font-size="25" fill="#f0f0f0" fill-opacity="0.80">${esc(TEXTO.lugar)}</text>

  <!-- Franja de cierre -->
  <rect x="34" y="536" width="${W - 68}" height="60" fill="#7C3AED" fill-opacity="0.16"/>
  <text x="${W / 2}" y="574" text-anchor="middle" font-family="${DISPLAY}"
        font-size="21" letter-spacing="4" fill="#ffffff">${esc(TEXTO.pie)}</text>
</svg>`;

const outDir = path.join(root, "public", "images", "casting");
await mkdir(outDir, { recursive: true });

const out = path.join(outDir, "casting-cuchillo-paz.jpg");

/* JPEG y no PNG: WhatsApp descarta las previsualizaciones pesadas, y un
   degradado plano en PNG pesa varias veces lo mismo sin verse mejor. */
const info = await sharp(Buffer.from(svg, "utf8"))
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(out);

console.log(
  `casting-cuchillo-paz.jpg — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} kB`
);
