/**
 * Escribe dentro de public/web/index.html el contenido de la portada
 * institucional como HTML real.
 *
 * El anillo se arma entero en JavaScript a partir de public/cosmos/projects.js:
 * sin ejecutar scripts, la página era un preloader en 0% y un panel con
 * "Serie: —, Año: —, Disciplina: —". Eso es lo que recibía cualquier rastreador
 * que no corre JS (los de redes, los de IA, varios buscadores) y lo que veía
 * quien navega sin él.
 *
 * Este paso toma los mismos datos y deja las secciones escritas en el HTML:
 * título, bajada, texto, etiquetas y el enlace a cada página. Con JS es el
 * equivalente en texto del lienzo —lo que lee un lector de pantalla—; sin JS
 * es la página, con sus estilos.
 *
 * También corrige el contador del HUD, que decía "/ 08" con siete secciones.
 * Fuente única: si cambia projects.js, cambia esto en el próximo build.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const indexPath = path.join(root, "public", "web", "index.html");
const { PROJECTS } = await import(pathToFileURL(path.join(root, "public", "cosmos", "projects.js")).href);

const OPEN = "<!-- contenido:estatico -->";
const CLOSE = "<!-- /contenido:estatico -->";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const titulo = (t) => (t === "HIVRIDO PLAY" ? "Hivrido PLAY" : t.charAt(0) + t.slice(1).toLowerCase());

const items = PROJECTS.map((p) => {
  const dest = p.href ? { href: p.href, label: p.cta ?? "Ver" } : p.link;
  const kicker = Array.isArray(p.kicker) ? p.kicker.join(" ") : p.kicker;
  return `    <article class="eco-item">
      <p class="eco-kicker">${esc(p.index)} · ${esc(kicker ?? p.category)}</p>
      <h2>${dest ? `<a href="${esc(dest.href)}">${esc(titulo(p.title))}</a>` : esc(titulo(p.title))}</h2>
      <p>${esc(p.body)}</p>
      <ul class="eco-tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      ${dest ? `<a class="eco-link" href="${esc(dest.href)}">${esc(dest.label)} →</a>` : ""}
    </article>`;
}).join("\n");

const wa = encodeURIComponent("Hola Hivrido! Les escribo desde la portada de la productora.");
const asunto = encodeURIComponent("Consulta desde hivrido.com");

const block = `${OPEN}
<main id="contenido" class="eco">
  <header class="eco-head">
    <h1>Hivrido: inteligencia creativa</h1>
    <p>Producción audiovisual, branding, desarrollo digital, publicidad y agentes IA. No es una agencia: es un sistema de crecimiento.</p>
  </header>
  <div class="eco-list">
${items}
  </div>
  <footer class="eco-foot">
    <a href="https://wa.me/5491156072460?text=${wa}">Escribinos por WhatsApp</a>
    <a href="mailto:hivridoads@gmail.com?subject=${asunto}">hivridoads@gmail.com</a>
  </footer>
</main>
${CLOSE}`;

let html = await readFile(indexPath, "utf8");
const a = html.indexOf(OPEN);
const b = html.indexOf(CLOSE);
if (a === -1 || b === -1) throw new Error(`No encontré ${OPEN} … ${CLOSE} en public/web/index.html`);
html = html.slice(0, a) + block + html.slice(b + CLOSE.length);

const total = String(PROJECTS.length).padStart(2, "0");
html = html.replace(/(<b class="text-white">01<\/b> \/ )\d\d/, `$1${total}`);

await writeFile(indexPath, html, "utf8");
console.log(`contenido -> ${PROJECTS.length} secciones escritas en index.html`);
