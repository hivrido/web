/**
 * Compila el CSS de la portada institucional y lo deja incrustado en
 * public/web/index.html.
 *
 * Dos pasos en uno:
 *   1. `cosmos.tailwind.css` -> las utilidades de Tailwind que la portada usa.
 *      Antes esto lo resolvía @tailwindcss/browser desde un CDN: 68 KiB de
 *      JavaScript que bloqueaban el render en el navegador de cada visitante
 *      para calcular lo que acá se calcula una sola vez.
 *   2. `cosmos.styles.css` -> minificado.
 * Los dos resultados se escriben dentro del <style> marcado en index.html.
 *
 * ── Por qué incrustado y no dos <link> ──
 * Eran las dos únicas peticiones que bloqueaban el render: 14,4 KiB que le
 * costaban 750 ms al primer pixel según PageSpeed. Diferirlas no es opción y
 * ya se probó: el HUD toma su `fixed inset-0` de Tailwind, así que sin la
 * hoja es un div en flujo y al llegar salta la página entera (CLS 0,623).
 * Incrustadas no hay nada que bloquear ni nada que saltar, y el HTML viaja
 * con brotli igual que viajaban ellas.
 *
 * Ojo: `next dev` no corre el prebuild. El HTML se commitea con el CSS ya
 * adentro, así que dev funciona, pero si tocás los fuentes de acá hay que
 * correr `npm run build` para verlo reflejado.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import * as esbuild from "esbuild";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const scripts = path.join(root, "scripts");
const indexPath = path.join(root, "public", "web", "index.html");

const OPEN = "<!-- css:inline -->";
const CLOSE = "<!-- /css:inline -->";

/* ── 0 · Vaciar el bloque generado antes de nada ──
   Tailwind escanea public/web/index.html para saber qué utilidades compilar, y el
   HTML ahora contiene su propia salida: sin vaciar primero, cada corrida
   encuentra nombres de clase dentro del CSS que ella misma generó y el
   archivo crece solo. Con el bloque vacío, escanea únicamente el marcado. */
const before = await readFile(indexPath, "utf8");
const start = before.indexOf(OPEN);
const end = before.indexOf(CLOSE);
if (start === -1 || end === -1) {
  throw new Error(`No encontré los marcadores ${OPEN} … ${CLOSE} en public/web/index.html`);
}
const shell = before.slice(0, start + OPEN.length) + "\n" + before.slice(end);
await writeFile(indexPath, shell, "utf8");

/* ── 1 · Tailwind ── */
const twSource = await readFile(path.join(scripts, "cosmos.tailwind.css"), "utf8");
const tw = (
  await postcss([tailwind({ optimize: { minify: true } })]).process(twSource, {
    from: path.join(scripts, "cosmos.tailwind.css"),
    to: indexPath,
  })
).css.trim();

/* ── 2 · Hoja propia ── */
const rawStyles = await readFile(path.join(scripts, "cosmos.styles.css"), "utf8");
const styles = (await esbuild.transform(rawStyles, { loader: "css", minify: true })).code.trim();

/* ── 3 · Adentro del HTML ──
   El orden importa y es el mismo que tenían los <link>: Tailwind primero y la
   hoja propia después, que es la que pisa. */
const a = shell.indexOf(OPEN);
const b = shell.indexOf(CLOSE);
const next = shell.slice(0, a) + `${OPEN}\n<style>${tw}\n${styles}</style>\n` + shell.slice(b);
await writeFile(indexPath, next, "utf8");

/* El tw.css suelto ya no lo pide nadie: sale del deploy. */
await rm(path.join(root, "public", "cosmos", "tw.css"), { force: true });

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(
  `css -> incrustado en web/index.html: ${kb(tw)} KiB Tailwind + ${kb(styles)} KiB propio ` +
    `(la hoja sin minificar pesaba ${kb(rawStyles)})`
);
