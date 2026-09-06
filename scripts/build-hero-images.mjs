/**
 * Genera los fondos del slider de la portada de Hivrido PLAY.
 *
 * Las fuentes son los JPEG que salieron del PDF de prensa, a resolución de
 * impresión: 2,4 MB El Docke y 3,8 MB Chamamé. El slider los pinta como
 * `background-image` a ancho de viewport, así que ni next/image los toca —y
 * como los slides inactivos se ocultan con `visibility`, que no evita la
 * descarga, el arranque se llevaba los tres: casi 7 MB antes del primer
 * pixel. En un teléfono de gama media con datos móviles eso es la diferencia
 * entre un LCP de dos segundos y uno de quince, y por ahí entra el 90% del
 * tráfico de campaña.
 *
 * 1600 px de lado largo cubre el viewport de cualquier teléfono y la mayoría
 * de los portátiles; el fondo va detrás de un degradado y un título, no es
 * material que se mire de cerca.
 *
 * Los originales no se tocan: siguen en /pdf/imagenespdf/ para el material
 * de prensa.
 *
 * Corre antes de `next build`, vía el script `prebuild`.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { resizeAll } from "./lib/resize-images.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

const MAX_SIDE = 1600;
const QUALITY = 78;

/** Fuente -> nombre de salida, según lo que declara app/lib/catalog.ts. */
const SOURCES = [
  ["pdf/imagenespdf/eldocke/eldocke/19.jpg", "eldocke.jpg"],
  ["pdf/imagenespdf/chamame/chamame/6.jpg", "chamame.jpg"],
  ["pdf/imagenespdf/sessionone/setionone/1.jpg", "sessionone.jpg"],
];

const outDir = path.join(root, "public", "images", "hero");

await resizeAll({
  jobs: SOURCES.map(([rel, name]) => ({
    src: path.join(root, "public", rel),
    dst: path.join(outDir, name),
    key: rel,
  })),
  outDir,
  manifestPath: path.join(root, "scripts", "hero-images.manifest.json"),
  maxSide: MAX_SIDE,
  quality: QUALITY,
  label: "hero",
});
