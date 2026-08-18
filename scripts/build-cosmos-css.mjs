/**
 * Compila las utilidades de Tailwind que usa la portada a un CSS estático.
 *
 * Antes la portada cargaba @tailwindcss/browser desde un CDN: 68 KiB de
 * JavaScript que bloqueaban el render para compilar, en cada visita y en el
 * navegador de cada visitante, lo mismo que acá se resuelve una sola vez.
 *
 * Corre solo, antes de `next build`, vía el script `prebuild`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const from = path.join(root, "scripts", "cosmos.tailwind.css");
const to = path.join(root, "public", "cosmos", "tw.css");

const source = await readFile(from, "utf8");
const result = await postcss([tailwind({ optimize: { minify: true } })])
  .process(source, { from, to });

await writeFile(to, result.css, "utf8");
console.log(`tw.css -> ${(Buffer.byteLength(result.css) / 1024).toFixed(1)} KiB`);
