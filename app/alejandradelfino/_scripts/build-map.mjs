/* Genera _content/mapa.generado.json: los 15 departamentos de Chubut ya
   proyectados a paths SVG, más las localidades del expediente en el mismo
   sistema de coordenadas.

   Se corre a mano, solo cuando cambia la geometría o se agrega una localidad.
   El sitio no carga d3 ni el GeoJSON: recibe los paths listos, unos KB.

     npm i --no-save d3-geo
     node app/alejandradelfino/_scripts/build-map.mjs

   Fuente: Instituto Geográfico Nacional (IGN), capa "departamento" del
   servicio WFS público, filtrada por la provincia (código INDEC 26):
   https://wms.ign.gob.ar/geoserver/ign/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ign:departamento&outputFormat=application/json&CQL_FILTER=in1%20LIKE%20%2726%25%27
   Licencia: datos abiertos del IGN, citar la fuente. */

import { readFile, writeFile } from "node:fs/promises";
import { geoTransverseMercator } from "d3-geo";

const here = new URL("../_content/", import.meta.url);
const WFS =
  "https://wms.ign.gob.ar/geoserver/ign/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ign:departamento&outputFormat=application/json&CQL_FILTER=in1%20LIKE%20%2726%25%27";

const WIDTH = 880;
const EPSILON = 0.55; // tolerancia de simplificación, en unidades del viewBox

const geo = await (await fetch(WFS)).json();
const localidades = JSON.parse(await readFile(new URL("localidades.json", here), "utf8"));

/* Transversa centrada en el meridiano de la provincia: el norte queda arriba
   y la provincia no se estira hacia los bordes como en Mercator. El ajuste se
   hace sobre los vértices sueltos y no sobre los polígonos: el IGN los
   entrega con el sentido de giro opuesto al que d3 espera, y d3 los leería
   como "todo el planeta menos Chubut". */
const vertices = {
  type: "MultiPoint",
  coordinates: geo.features.flatMap((f) => f.geometry.coordinates.flat(f.geometry.type === "MultiPolygon" ? 2 : 1)),
};
const projection = geoTransverseMercator().rotate([68, 0]).fitWidth(WIDTH, vertices);

/* Douglas-Peucker sobre el anillo ya proyectado. Un anillo cerrado empieza y
   termina en el mismo punto, y con los dos extremos iguales no hay segmento
   contra el cual medir: se ancla también el vértice más lejano al inicio. */
function simplify(points) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  const last = points.length - 1;
  let far = 1;
  for (let i = 1; i < last; i++) {
    const d = Math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]);
    if (d > Math.hypot(points[far][0] - points[0][0], points[far][1] - points[0][1])) far = i;
  }
  keep[0] = keep[far] = keep[last] = 1;
  const stack = [[0, far], [far, last]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
      if (d > max) [max, idx] = [d, i];
    }
    if (max > EPSILON && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const r = (n) => Math.round(n * 10) / 10;
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

const departamentos = geo.features.map((f) => {
  const polys = f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates];
  let d = "";
  let sx = 0, sy = 0, n = 0;
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = simplify(ring.map((c) => projection(c)));
      if (pts.length < 3) continue;
      d += "M" + pts.map(([x, y]) => `${r(x)},${r(y)}`).join("L") + "Z";
      for (const [x, y] of pts) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        sx += x; sy += y; n++;
      }
    }
  }
  return { nombre: f.properties.nam, d, label: [r(sx / n), r(sy / n)] };
});

const puntos = Object.fromEntries(
  Object.entries(localidades)
    .filter(([k]) => !k.startsWith("_"))
    .map(([id, l]) => [id, projection(l.lonlat).map(r)])
);

const out = {
  _generado: "No editar a mano: lo escribe _scripts/build-map.mjs. Fuente: IGN.",
  viewBox: [r(minX - 4), r(minY - 4), r(maxX - minX + 8), r(maxY - minY + 8)],
  departamentos: departamentos.sort((a, b) => a.nombre.localeCompare(b.nombre)),
  puntos,
};

await writeFile(new URL("mapa.generado.json", here), JSON.stringify(out) + "\n");
console.log("viewBox", out.viewBox, "bytes", JSON.stringify(out).length);
