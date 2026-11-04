/* Calcula el contraste WCAG 2.1 de los pares texto/fondo del sitio y escribe
   _docs/contraste.md. Se corre a mano cuando cambia la paleta:

     node app/alejandradelfino/_scripts/contraste.mjs

   Los colores con transparencia se mezclan sobre su fondo antes de medir.
   Umbrales AA: 4.5:1 texto normal, 3:1 texto grande (≥ 24px, o ≥ 18.66px en
   negrita) y 3:1 para elementos gráficos y bordes de controles. */

import { writeFile } from "node:fs/promises";

const P = {
  violeta: "#6a2ac0",
  violetaHondo: "#2a1159",
  dorado: "#e6a92b",
  crema: "#fff7ec",
  verde: "#3e8e2f",
  tinta: "#24163f",
  naranjaTexto: "#b4530a",
  pared: "#f4ecdf",
  pie: "#1b0f33",
};

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lineal = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminancia = (rgb) => 0.2126 * lineal(rgb[0]) + 0.7152 * lineal(rgb[1]) + 0.0722 * lineal(rgb[2]);
const mezclar = (frente, alfa, fondo) => frente.map((c, i) => Math.round(c * alfa + fondo[i] * (1 - alfa)));
const aHex = (rgb) => "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

function contraste(frente, fondo, alfa = 1) {
  const f = mezclar(hex(frente), alfa, hex(fondo));
  const [a, b] = [luminancia(f), luminancia(hex(fondo))];
  return { ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), mezcla: aHex(f) };
}

/* [dónde, frente, fondo, alfa del frente, tipo] — tipo: "normal" | "grande" | "grafico" */
const PARES = [
  ["Texto de párrafos, bajadas y ayudas", P.tinta, P.crema, 1, "normal"],
  ["Ayuda de teclado del expediente", P.tinta, P.pared, 1, "normal"],
  ["Kicker de sección", P.tinta, P.crema, 1, "normal"],
  ["Títulos de sección (violeta)", P.violeta, P.crema, 1, "grande"],
  ["Hero: titular y bajada", "#ffffff", P.violetaHondo, 1, "normal"],
  ["Hero: \"con qué\" (dorado)", P.dorado, P.violetaHondo, 1, "grande"],
  ["Hero: subrayado (verde)", P.verde, P.violetaHondo, 1, "grafico"],
  ["Botón primario: texto (violeta profundo sobre dorado)", P.violetaHondo, P.dorado, 1, "normal"],
  ["Botón primario: texto sobre el tono claro del degradé", P.violetaHondo, "#efbb4a", 1, "normal"],
  ["Botón secundario: texto crema sobre violeta profundo", P.crema, P.violetaHondo, 1, "normal"],
  ["Botón secundario: borde crema sobre violeta profundo", P.crema, P.violetaHondo, 1, "grafico"],
  ["Header sólido: nombre y menú", P.tinta, P.crema, 1, "normal"],
  ["Nombre registral (verde, manuscrita 25.6px)", P.verde, P.crema, 1, "grande"],
  ["Línea de tiempo: año (naranja texto, 18.4px)", P.naranjaTexto, "#ffffff", 1, "normal"],
  ["Gestión Cholila: cifra (naranja texto, 80px)", P.naranjaTexto, "#d5efed", 1, "grande"],
  ["Gestión El Maitén: cifra (naranja texto, 80px)", P.naranjaTexto, "#e9e0f7", 1, "grande"],
  ["Gestión Cholila: leyenda de la cifra (17.6px)", "#0f6d71", "#d5efed", 1, "normal"],
  ["Gestión El Maitén: leyenda de la cifra (17.6px)", "#5b2a9e", "#e9e0f7", 1, "normal"],
  ["Gestión: lista de obras", P.tinta, "#d5efed", 1, "normal"],
  ["Contacto: texto blanco sobre violeta", "#ffffff", P.violeta, 1, "normal"],
  ["Contacto: texto blanco sobre el violeta claro del degradé", "#ffffff", "#8e44c9", 1, "normal"],
  ["Pie: aviso (blanco al 80%)", "#ffffff", P.pie, 0.8, "normal"],
  ["Pie: fuente del mapa (blanco al 48%, 12.5px)", "#ffffff", P.pie, 0.48, "normal"],
  ["Pie: enlace a Instagram (dorado)", P.dorado, P.pie, 1, "normal"],
  ["Foco sobre fondos claros (violeta)", P.violeta, P.crema, 1, "grafico"],
  ["Foco sobre fondos oscuros (dorado)", P.dorado, P.violetaHondo, 1, "grafico"],
];

const UMBRAL = { normal: 4.5, grande: 3, grafico: 3 };
const TIPO = { normal: "texto", grande: "texto grande", grafico: "gráfico" };

const filas = PARES.map(([donde, frente, fondo, alfa, tipo]) => {
  const { ratio, mezcla } = contraste(frente, fondo, alfa);
  const ok = ratio >= UMBRAL[tipo];
  return { donde, frente: alfa < 1 ? `${frente} al ${Math.round(alfa * 100)}% (${mezcla})` : frente, fondo, tipo, ratio, ok };
});

const fallas = filas.filter((f) => !f.ok);
const md = `# Contraste (WCAG 2.1 AA)

Generado por \`_scripts/contraste.mjs\`. Umbrales: 4.5:1 para texto normal y
3:1 para texto grande (≥ 24px, o ≥ 18.66px en negrita) y para elementos
gráficos (subrayados, bordes de botones, anillos de foco).

**Resultado: ${filas.length - fallas.length} de ${filas.length} pares pasan AA.**${fallas.length ? ` Fallan: ${fallas.map((f) => f.donde).join("; ")}.` : ""}

| Dónde | Frente | Fondo | Tipo | Contraste | AA |
|---|---|---|---|---|---|
${filas.map((f) => `| ${f.donde} | \`${f.frente}\` | \`${f.fondo}\` | ${TIPO[f.tipo]} | ${f.ratio.toFixed(2)}:1 | ${f.ok ? "✓" : "✗"} |`).join("\n")}

## Paleta oficial → tokens de \`delfino.css\`

| Oficial | Token | Valor |
|---|---|---|
| --violeta | \`--ad-violeta\` | \`${P.violeta}\` |
| --violeta-profundo | \`--ad-violeta-hondo\` | \`${P.violetaHondo}\` |
| --dorado | \`--ad-dorado\` | \`${P.dorado}\` |
| --crema | \`--ad-crema\` | \`${P.crema}\` |
| --verde | \`--ad-verde\` | \`${P.verde}\` |

El brief de la revisión nombra estos tokens pero no trae sus valores: se
tomaron los del sitio, y el dorado se definió nuevo (más profundo que el
amarillo anterior, \`#ffc94a\`). **Confirmar los valores con la guía de marca**
y, antes de imprimir, las equivalencias Pantone con la guía física.
`;

await writeFile(new URL("../_docs/contraste.md", import.meta.url), md);
console.log(`${filas.length - fallas.length}/${filas.length} pasan AA`);
for (const f of fallas) console.log("FALLA:", f.donde, f.ratio.toFixed(2));
