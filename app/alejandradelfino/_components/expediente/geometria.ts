import { expediente, mapa, type Formato } from "../../_lib/contenido";

/* Todo lo de la pizarra se mide en unidades del tablero (1600×1000 en
   escritorio, 1000×1920 en celular). Acá se resuelven los extremos de cada
   hilo: el alfiler de una pieza o una localidad proyectada sobre el mapa. */

export type Punto = [number, number];

const piezaPorId = Object.fromEntries(expediente.piezas.map((p) => [p.id, p]));

/** Dónde se clava el alfiler de una pieza: arriba al centro. */
export function alfiler(id: string, f: Formato): Punto | null {
  const pos = piezaPorId[id]?.[f];
  if (!pos) return null;
  const [x, y, w] = pos;
  return [x + w / 2, y + 12];
}

/** Escala del mapa dentro del tablero: unidades de tablero por unidad de mapa. */
export function escalaMapa(f: Formato) {
  const [, , ancho] = expediente.mapa[f];
  return ancho / mapa.viewBox[2];
}

export function altoMapa(f: Formato) {
  return mapa.viewBox[3] * escalaMapa(f);
}

/** Una localidad del mapa en coordenadas del tablero. */
export function localidad(id: string, f: Formato): Punto | null {
  const p = mapa.puntos[id];
  if (!p) return null;
  const [mx, my] = expediente.mapa[f];
  const s = escalaMapa(f);
  return [mx + (p[0] - mapa.viewBox[0]) * s, my + (p[1] - mapa.viewBox[1]) * s];
}

function extremo(ref: string, f: Formato) {
  return ref.startsWith("@") ? localidad(ref.slice(1), f) : alfiler(ref, f);
}

export type Hilo = { desde: string; hasta: string; d: string; a: Punto; b: Punto };

/** Los hilos visibles en un formato, con su curva: un hilo tenso pero no
    rígido cuelga un poco hacia abajo en el medio. */
export function hilos(f: Formato): Hilo[] {
  return expediente.hilos.flatMap(([desde, hasta]) => {
    const a = extremo(desde, f);
    const b = extremo(hasta, f);
    if (!a || !b) return [];
    const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const cx = (a[0] + b[0]) / 2;
    const cy = (a[1] + b[1]) / 2 + largo * 0.07;
    return [{ desde, hasta, a, b, d: `M${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}` }];
  });
}

/** Piezas unidas por hilo a una pieza dada, en cualquier sentido. */
export function vecinas(id: string): Set<string> {
  const out = new Set<string>();
  for (const [a, b] of expediente.hilos) {
    if (a === id) out.add(b);
    if (b === id) out.add(a);
  }
  return out;
}
