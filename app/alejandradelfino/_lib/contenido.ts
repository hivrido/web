/* Tipos y acceso al contenido editable de _content/. Los JSON son la fuente:
   acá se tipan, se filtra lo que no puede publicarse y se derivan los índices
   que usan los componentes. */

import sitioJson from "../_content/sitio.json";
import perfilJson from "../_content/perfil.json";
import trayectoriaJson from "../_content/trayectoria.json";
import gestionJson from "../_content/gestion.json";
import propuestasJson from "../_content/propuestas.json";
import regionesJson from "../_content/regiones.json";
import expedienteJson from "../_content/expediente.json";
import mapaJson from "../_content/mapa.generado.json";
import marcaJson from "../_content/marca.json";
import { PRODUCCION } from "../_config/site";

/* ── Publicación ──────────────────────────────────────────────────────── */

/** Lo que todo dato puede traer para decidir si se publica. */
export type Revisable = {
  fuente?: string | null;
  pendiente?: boolean;
  estado?: "borrador" | "aprobada" | string;
  nota?: string;
};

/** Qué sello lleva un dato en desarrollo; null si está listo para publicar. */
export function sello(x: Revisable): "BORRADOR" | "PENDIENTE" | null {
  if (x.estado === "borrador") return "BORRADOR";
  if (x.pendiente || !x.fuente) return "PENDIENTE";
  return null;
}

/** En producción solo pasa lo que no tiene sello; en desarrollo pasa todo. */
export const publicable = (x: Revisable) => !PRODUCCION || sello(x) === null;

/** Para textos sin cifras, fechas ni cargos (descripciones de paisaje): no
    exigen fuente, pero respetan `pendiente` y `borrador`. */
const sinBloqueo = (x: Revisable) => !PRODUCCION || (!x.pendiente && x.estado !== "borrador");

/* ── Tipos ────────────────────────────────────────────────────────────── */

export type Region = {
  id: string;
  nombre: string;
  color: string;
  departamentos: string[];
  produce: string[];
  identidad: string;
  fuenteIdentidad?: string;
  propuesta: { texto: string } & Revisable;
};

/** [x, y, ancho, giro] en unidades del tablero. */
export type Pos = [number, number, number, number];

export type Pieza = {
  id: string;
  tipo: "foto" | "nota" | "informe" | "credencial" | "recorte";
  titulo: string;
  texto: string;
  localidad?: string;
  region?: string;
  foto?: string;
  color?: string;
  d: Pos | null;
  m: Pos | null;
} & Revisable;

export type Formato = "d" | "m";

export type Expediente = {
  tablero: Record<Formato, [number, number]>;
  mapa: Record<Formato, [number, number, number]>;
  piezas: Pieza[];
  hilos: [string, string][];
  gestion: string[];
};

export type Mapa = {
  viewBox: [number, number, number, number];
  departamentos: { nombre: string; d: string; label: [number, number] }[];
  puntos: Record<string, [number, number]>;
};

type Parrafo = { texto: string } & Revisable;
type Hito = { anio: string | null; cargo: string; organismo: string | null } & Revisable;
type Caso = {
  id: string;
  lugar: string;
  anio: string | null;
  cifra: string;
  cifraLabel: string;
  foto: string | null;
  obras: string[];
} & Revisable;
type Eje = { id: string; titulo: string; texto: string } & Revisable;

/* ── Contenido ────────────────────────────────────────────────────────── */

export const sitio = sitioJson;
/** Logo y lema: solo se leen detrás de LANZAMIENTO. */
export const marca = marcaJson;

const perfilBase = perfilJson as typeof perfilJson & { parrafos: Parrafo[] };
export const perfil = { ...perfilBase, parrafos: perfilBase.parrafos.filter(publicable) };

export const trayectoria = (trayectoriaJson.hitos as Hito[]).filter(publicable);

const gestionBase = gestionJson as Omit<typeof gestionJson, "casos"> & { casos: Caso[] };
export const gestion = { ...gestionBase, casos: gestionBase.casos.filter(publicable) };

const propuestasBase = propuestasJson as Omit<typeof propuestasJson, "ejes"> & { ejes: Eje[] };
export const propuestas = { ...propuestasBase, ejes: propuestasBase.ejes.filter(publicable) };

export const regiones = (regionesJson.regiones as Region[]).map((r) => ({
  ...r,
  propuesta: publicable(r.propuesta) ? r.propuesta : null,
}));

/* El expediente sin las piezas que no pueden publicarse, ni los hilos que
   quedarían colgando de ellas. */
const expedienteBase = expedienteJson as unknown as Expediente;
const piezasVisibles = expedienteBase.piezas.filter(sinBloqueo);
const idsVisibles = new Set(piezasVisibles.map((p) => p.id));
const extremoVisible = (ref: string) => ref.startsWith("@") || idsVisibles.has(ref);
export const expediente: Expediente = {
  ...expedienteBase,
  piezas: piezasVisibles,
  hilos: expedienteBase.hilos.filter(([a, b]) => extremoVisible(a) && extremoVisible(b)),
  gestion: expedienteBase.gestion.filter((id) => idsVisibles.has(id)),
};

export const mapa = mapaJson as unknown as Mapa;

/** Departamento → región, para pintar el mapa. */
export const regionDeDepartamento: Record<string, string> = Object.fromEntries(
  regiones.flatMap((r) => r.departamentos.map((d) => [d, r.id]))
);

export const regionPorId = Object.fromEntries(regiones.map((r) => [r.id, r]));
