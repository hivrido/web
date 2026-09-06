/**
 * Genera las variantes chicas del material de las tarjetas del cosmos.
 *
 * Las texturas se componen en un canvas de 512x384 en táctiles, pero las
 * fuentes son las fotos del sitio a tamaño completo: se descargaban 702 KiB
 * para pintar unos doscientos mil píxeles. Cada archivo se reduce al lado que
 * la textura puede llegar a usar y nada más: 280 KiB.
 *
 * Las originales no se tocan: las usan /equipo, /orbital y About, donde sí se
 * ven a tamaño completo. Esto es una copia paralela en /images/cards.
 *
 * El reencodeo y el manifiesto viven en lib/resize-images.mjs, compartidos con
 * el pipeline de los fondos del slider de PLAY.
 *
 * Corre antes de `next build`, vía el script `prebuild`.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { resizeAll } from "./lib/resize-images.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

/* Tope del lado largo. Estas variantes las consume solo el teléfono, donde la
   textura mide 512x384: drawCover escala la foto para cubrir ese rectángulo,
   así que con 720 en el lado mayor sobra en todos los encuadres. Escritorio
   sigue usando los originales, que ahí sí se ven a 1024x768. */
const MAX_SIDE = 720;
const QUALITY = 72;

/** Fuentes, tomadas de las rutas que declara public/cosmos/projects.js. */
const SOURCES = [
  "bg/21.jpg",
  "bg/docke.jpg",
  "bg/animacion-poster.jpg",
  "bg/hivrido-chrome.jpg",
  "team/1.jpg",
  "team/2.jpg",
];

const outDir = path.join(root, "public", "images", "cards");

await resizeAll({
  jobs: SOURCES.map((rel) => ({
    src: path.join(root, "public", "images", rel),
    dst: path.join(outDir, rel.replace(/[/\\]/g, "-")),
    key: rel,
  })),
  outDir,
  manifestPath: path.join(root, "scripts", "card-images.manifest.json"),
  maxSide: MAX_SIDE,
  quality: QUALITY,
  label: "cards",
});
