"use client";

/**
 * Lo que PLAY recuerda de cada visitante: su lista y por dónde iba en cada
 * video. No hay cuentas, así que vive en el navegador. Si el almacenamiento
 * no está disponible (ventana privada, sitio bloqueado) todo sigue andando:
 * las filas personales simplemente no aparecen.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";

const LIST = "hp:list";
const HISTORY = "hp:history";
const HISTORY_MAX = 20;

export type Progress = { id: string; pos: number; dur: number; at: number };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  /* Otra pestaña cambió la lista: esta se entera. */
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Sin almacenamiento no hay nada que guardar. */
  }
  emit();
}

/* El snapshot es el texto crudo: es un primitivo, así que React lo compara por
   valor y no re-renderiza si nada cambió. En el servidor no hay nada. */
function useStored(key: string) {
  return useSyncExternalStore(subscribe, () => readRaw(key), () => null);
}

export function useMyList() {
  const raw = useStored(LIST);
  const ids = useMemo(() => parse<string[]>(raw, []), [raw]);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    const now = parse<string[]>(readRaw(LIST), []);
    write(LIST, now.includes(id) ? now.filter((x) => x !== id) : [id, ...now]);
  }, []);
  return { ids, has, toggle };
}

/** Lo empezado y sin terminar, lo más reciente primero. */
export function useHistory() {
  const raw = useStored(HISTORY);
  return useMemo(
    () =>
      parse<Progress[]>(raw, [])
        .filter((p) => p.dur > 0 && p.pos / p.dur > 0.02 && p.pos / p.dur < 0.95)
        .sort((a, b) => b.at - a.at),
    [raw],
  );
}

export function getProgress(id: string): Progress | undefined {
  return parse<Progress[]>(readRaw(HISTORY), []).find((p) => p.id === id);
}

export function saveProgress(id: string, pos: number, dur: number) {
  if (!dur) return;
  const rest = parse<Progress[]>(readRaw(HISTORY), []).filter((p) => p.id !== id);
  write(HISTORY, [{ id, pos, dur, at: Date.now() }, ...rest].slice(0, HISTORY_MAX));
}
