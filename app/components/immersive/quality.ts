/**
 * Cuánto puede dar el dispositivo, decidido antes de pedir un solo shader.
 *
 * 0 = estático: no se monta WebGL (ahorro de datos, 2G, muy poca memoria).
 * 1 = liviano: táctiles y equipos medios. Menos resolución, sin posproceso caro.
 * 2 = completo.
 *
 * Esto es la primera estimación; después manda lo que se mide. Cada escena
 * trae un `Governor` que mira los cuadros reales y baja un escalón —o se
 * queda quieta— si no llega.
 */

export type Tier = 0 | 1 | 2;

type Conn = { saveData?: boolean; effectiveType?: string };
type Nav = Navigator & { connection?: Conn; deviceMemory?: number; getBattery?: () => Promise<{ charging: boolean; level: number }> };

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

export function deviceTier(): Tier {
  const nav = navigator as Nav;
  const conn = nav.connection;
  if (conn?.saveData) return 0;
  if (conn?.effectiveType && /2g$/.test(conn.effectiveType)) return 0;
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  if (mem <= 2 || cores <= 2) return 0;
  if (mem <= 4 || cores <= 4 || conn?.effectiveType === "3g" || !finePointer()) return 1;
  return 2;
}

/**
 * Batería baja y sin cargar: lo más parecido a "modo ahorro" que expone la
 * web. Solo Chromium tiene la API; donde no existe, el modo ahorro se nota
 * igual porque limita los cuadros y el `Governor` lo detecta.
 */
export async function lowBattery(): Promise<boolean> {
  try {
    const b = await (navigator as Nav).getBattery?.();
    return !!b && !b.charging && b.level <= 0.2;
  } catch {
    return false;
  }
}

/** Corre cuando el navegador queda libre, nunca antes de que la página cargue. */
export function whenIdle(run: () => void, timeout = 2500): () => void {
  let id = 0;
  let cancelled = false;
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  const go = () => {
    if (cancelled) return;
    if (ric) id = ric(() => !cancelled && run(), { timeout });
    else id = window.setTimeout(() => !cancelled && run(), 200);
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", go);
    if (id) {
      (window as Window & { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback?.(id);
      clearTimeout(id);
    }
  };
}

/**
 * Mide los cuadros reales. Tras el calentamiento, cada ventana de `WINDOW`
 * cuadros da un veredicto: "ok", "degradar" (por debajo de ~45 fps) o
 * "congelar" (por debajo de ~28 fps ya degradado).
 */
export class Governor {
  private n = 0;
  private acc = 0;
  private warm = 20;
  private level = 0;
  /** fps de la última ventana, para la verificación. */
  fps = 60;

  constructor(private readonly maxLevel: number) {}

  tick(dtMs: number): "ok" | "degrade" | "freeze" {
    if (this.warm > 0) { this.warm--; return "ok"; }
    // Una pestaña que vuelve del fondo entrega un salto enorme: no cuenta.
    if (dtMs > 250) return "ok";
    this.acc += dtMs;
    if (++this.n < 45) return "ok";
    const avg = this.acc / this.n;
    this.fps = 1000 / avg;
    this.n = 0;
    this.acc = 0;
    if (avg <= 22) return "ok";
    if (this.level < this.maxLevel) { this.level++; this.warm = 10; return "degrade"; }
    return avg > 36 ? "freeze" : "ok";
  }
}
