/**
 * Copia three (y solo los addons que la portada usa) a /public/cosmos/vendor.
 *
 * Antes el importmap apuntaba a jsdelivr y traía `three.module.js`: 1.31 MB
 * sin minificar que el móvil tiene que descargar, parsear y compilar antes de
 * ver nada. La build minificada es la mitad, y servida desde el propio
 * dominio se ahorra además el DNS + TLS de un tercero en la ruta crítica.
 *
 * Los addons se resuelven siguiendo sus imports relativos, así que la lista
 * de archivos no hay que mantenerla a mano: se pide la entrada y el resto
 * viene solo.
 *
 * Corre antes de `next build`, vía el script `prebuild`.
 */
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const threeDir = path.join(root, "node_modules", "three");
const outDir = path.join(root, "public", "cosmos", "vendor", "three");

/** Entradas que scene.js importa por `three/addons/`. */
const ENTRIES = [
  "postprocessing/EffectComposer.js",
  "postprocessing/RenderPass.js",
  "postprocessing/UnrealBloomPass.js",
];

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[\s\S]*?from\s+['"](\.[^'"]+)['"]/g;

async function write(rel, contents) {
  const dest = path.join(outDir, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, contents, "utf8");
  return Buffer.byteLength(contents);
}

/** Copia un addon y, recursivamente, todo lo que importe con rutas relativas. */
const seen = new Set();
async function vendorAddon(rel) {
  if (seen.has(rel)) return 0;
  seen.add(rel);

  const src = path.join(threeDir, "examples", "jsm", rel);
  const code = await readFile(src, "utf8");
  let bytes = await write(path.join("addons", rel), code);

  for (const [, spec] of code.matchAll(IMPORT_RE)) {
    const next = path.posix.normalize(path.posix.join(path.posix.dirname(rel), spec));
    bytes += await vendorAddon(next);
  }
  return bytes;
}

await mkdir(outDir, { recursive: true });
await copyFile(
  path.join(threeDir, "build", "three.module.min.js"),
  path.join(outDir, "three.module.min.js")
);

let addonBytes = 0;
for (const entry of ENTRIES) addonBytes += await vendorAddon(entry);

const core = (await readFile(path.join(outDir, "three.module.min.js"))).byteLength;
console.log(
  `three -> ${(core / 1024).toFixed(0)} KiB core + ` +
    `${(addonBytes / 1024).toFixed(0)} KiB en ${seen.size} addons`
);
