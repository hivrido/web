/**
 * Variantes chicas de los afiches de Hivrido PLAY.
 *
 * Los afiches son 1600×900 y la tarjeta que los muestra mide ~340 px: en un
 * teléfono la portada bajaba ~850 KB de imágenes para pintar miniaturas. Con
 * `images.unoptimized` Next no genera variantes, así que se generan acá y el
 * componente `Poster` arma el `srcset`.
 *
 * NO corre en el build: usa `sharp`, que está en node_modules como
 * dependencia de Next pero no es dependencia declarada del proyecto. Se corre
 * a mano al sumar o cambiar un afiche, y las variantes se commitean:
 *
 *   node scripts/build-poster-variants.mjs
 *
 * Después hay que listar el archivo nuevo en `app/lib/posters.ts`.
 */
import { readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const DIRS = ["public/images/peliculas", "public/images/series"];
const WIDTHS = [640, 960];
const SKIP = /-(640|960)\.webp$/;

let total = 0;
const made = [];
for (const dir of DIRS) {
  const abs = path.join(root, dir);
  for (const file of await readdir(abs)) {
    if (!/\.(webp|jpe?g|png)$/i.test(file) || SKIP.test(file)) continue;
    const src = path.join(abs, file);
    const meta = await sharp(src).metadata();
    const base = file.replace(/\.[^.]+$/, "");
    for (const w of WIDTHS) {
      if (!meta.width || meta.width <= w) continue;
      const dst = path.join(abs, `${base}-${w}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(dst);
      const size = (await stat(dst)).size;
      total += size;
      made.push(`${dir.replace("public", "")}/${base}-${w}.webp ${(size / 1024).toFixed(0)} KB`);
    }
  }
}
console.log(made.join("\n"));
console.log(`posters -> ${made.length} variantes, ${(total / 1024).toFixed(0)} KiB`);
