/**
 * Imágenes de RYTMOS: de los másters a las variantes que sirve la home.
 *
 * Los másters van en `material/rytmos/` —fuera de public/ y fuera de git: un
 * máster suelto en public/ quedaría servido por URL— y las variantes se
 * generan en `public/images/rytmos/` y se commitean. Igual que
 * build-poster-variants.mjs, NO corre en el build: usa `sharp`, que llega con
 * Next pero no es dependencia declarada del proyecto. Se corre a mano al
 * sumar o cambiar material:
 *
 *   node scripts/build-rytmos-images.mjs
 *
 * Por nombre de archivo:
 *   key-art.<ext>        → key-art-{640,1080,1600,2400}.{avif,webp} (16:9)
 *   key-art-vertical.<ext> → key-art-vertical-{640,1080}.{avif,webp} (9:16)
 *                          y además /images/share/rytmos-key-art-share.jpg (1200×630)
 *                          y /images/series/rytmos.webp (afiche 16:9, 1600 px)
 *   elenco-<slug>.<ext>  → recorte 4:5, {640,1080}
 *   still-<nn>.<ext>     → stills y fotos de rodaje, {640,1080,1600}
 *
 * Solo genera anchos menores o iguales al del máster: nunca agranda. Al
 * terminar imprime lo que hay que pegar en app/lib/rytmos.ts.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const SRC = path.join(root, "material", "rytmos");
const OUT = path.join(root, "public", "images", "rytmos");
const WEB = "/images/rytmos";

if (!existsSync(SRC)) {
  console.log(`No hay másters en ${path.relative(root, SRC)}/. Ver docs/PENDIENTES-RYTMOS.md.`);
  process.exit(0);
}
await mkdir(OUT, { recursive: true });

const kb = async (p) => `${((await stat(p)).size / 1024).toFixed(0)} KB`;
const log = [];

/** Variantes AVIF + WebP de un máster, recortado a `ratio` si se pide. */
async function variantes(src, base, widths, ratio) {
  const meta = await sharp(src).metadata();
  const out = [];
  for (const w of widths.filter((w) => w <= (meta.width ?? 0))) {
    const resize = ratio ? { width: w, height: Math.round(w / ratio), fit: "cover", position: "attention" } : { width: w };
    for (const [fmt, opts] of [["avif", { quality: 52, effort: 6 }], ["webp", { quality: 76, effort: 6 }]]) {
      const dst = path.join(OUT, `${base}-${w}.${fmt}`);
      await sharp(src).rotate().resize(resize)[fmt](opts).toFile(dst);
      log.push(`${WEB}/${base}-${w}.${fmt}  ${await kb(dst)}`);
    }
    out.push(w);
  }
  return { ancho: Math.max(...out), alto: ratio ? Math.round(Math.max(...out) / ratio) : Math.round((Math.max(...out) * meta.height) / meta.width) };
}

const pegar = [];
for (const file of (await readdir(SRC)).sort()) {
  if (!/\.(jpe?g|png|webp|tiff?|avif)$/i.test(file)) continue;
  const src = path.join(SRC, file);
  const base = file.replace(/\.[^.]+$/, "").toLowerCase();

  if (base === "key-art-vertical") {
    const d = await variantes(src, base, [640, 1080], 9 / 16);
    pegar.push(`keyArtVertical: { src: "${WEB}/key-art-vertical", alt: "", ancho: ${d.ancho}, alto: ${d.alto} },`);
  } else if (base === "key-art") {
    const d = await variantes(src, base, [640, 1080, 1600, 2400], 16 / 9);
    pegar.push(`keyArt: { src: "${WEB}/key-art", alt: "", ancho: ${d.ancho}, alto: ${d.alto} },`);

    const share = path.join(root, "public", "images", "share", "rytmos-key-art-share.jpg");
    await sharp(src).rotate().resize({ width: 1200, height: 630, fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(share);
    log.push(`/images/share/rytmos-key-art-share.jpg  ${await kb(share)}`);
    /* Nombre propio y no el de la tarjeta tipográfica: /images se cachea un
       año como inmutable, así que una imagen nueva lleva un nombre nuevo. */
    pegar.push(`share: "/images/share/rytmos-key-art-share.jpg",`);

    const poster = path.join(root, "public", "images", "series", "rytmos.webp");
    await sharp(src).rotate().resize({ width: 1600, height: 900, fit: "cover", position: "attention" }).webp({ quality: 76 }).toFile(poster);
    log.push(`/images/series/rytmos.webp  ${await kb(poster)}  (correr build-poster-variants.mjs y sumarlo a Poster.tsx)`);
    pegar.push(`poster: "/images/series/rytmos.webp",`);
  } else if (base.startsWith("elenco-")) {
    await variantes(src, base, [640, 1080], 4 / 5);
    pegar.push(`{ nombre: "…", personaje: "…", foto: "${WEB}/${base}" },`);
  } else if (base.startsWith("still-")) {
    const d = await variantes(src, base, [640, 1080, 1600]);
    pegar.push(`{ src: "${WEB}/${base}", alt: "…", ancho: ${d.ancho}, alto: ${d.alto} },`);
  } else {
    console.warn(`Sin regla para ${file}: renombralo key-art, elenco-<slug> o still-<nn>.`);
  }
}

console.log(log.join("\n"));
console.log("\nPara app/lib/rytmos.ts:\n" + pegar.join("\n"));
