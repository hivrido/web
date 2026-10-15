/* Tipos y acceso al contenido editable de _content/. Los JSON son la fuente:
   acá solo se tipan y se derivan los índices que usan los componentes. */

import sitioJson from "../_content/sitio.json";
import textosJson from "../_content/textos.json";
import regionesJson from "../_content/regiones.json";
import expedienteJson from "../_content/expediente.json";
import mapaJson from "../_content/mapa.generado.json";

export type Region = {
  id: string;
  nombre: string;
  color: string;
  departamentos: string[];
  produce: string[];
  identidad: string;
  propuesta: string;
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
  eje?: string;
  d: Pos | null;
  m: Pos | null;
};

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

export const sitio = sitioJson;
export const textos = textosJson;
export const regiones = regionesJson.regiones as Region[];
export const expediente = expedienteJson as unknown as Expediente;
export const mapa = mapaJson as unknown as Mapa;

/** Departamento → región, para pintar el mapa. */
export const regionDeDepartamento: Record<string, string> = Object.fromEntries(
  regiones.flatMap((r) => r.departamentos.map((d) => [d, r.id]))
);

export const regionPorId: Record<string, Region> = Object.fromEntries(regiones.map((r) => [r.id, r]));

/** Partes "[CONFIRMAR]" y "[BORRADOR]" del texto, para marcarlas visibles. */
export function partirMarcas(texto: string) {
  return texto.split(/(\[(?:CONFIRMAR|BORRADOR)\])/g).filter(Boolean);
}
