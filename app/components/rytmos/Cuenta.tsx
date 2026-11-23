"use client";

/**
 * Cuenta regresiva en 3D, en la identidad de Hivrido. Es la misma pieza que
 * la de f2incorporate.com.ar (panel de vidrio con canto grueso, paletas que
 * giran al cambiar cada número, luz que recorre el borde, giro hacia el
 * cursor), pasada a la paleta violeta, el cromo y Anton.
 *
 * Dos diferencias a propósito con la original:
 * - sin perspectiva ni flotación infinita: con las dos, Chrome rasteriza el
 *   panel a baja resolución y los números se ven pixelados (lo mismo que le
 *   pasaba al logo). Queda en una pose 3D fija y se mueve solo al apuntarlo;
 * - la luz del borde es la `.hp-haz` de PLAY, la misma de los botones.
 *
 * El servidor no sabe qué hora es en el teléfono de quien mira: el HTML trae
 * "--" y los números aparecen al hidratar, en un hueco ya reservado.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";

/* Un solo reloj por pestaña; en el servidor y al hidratar, null. */
const suscribir = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const ahora = () => Math.floor(Date.now() / 1000);
const enServidor = () => null;

const UNIDADES = [
  { k: "d", label: "Días", seg: 86400 },
  { k: "h", label: "Horas", seg: 3600 },
  { k: "m", label: "Min", seg: 60 },
  { k: "s", label: "Seg", seg: 1 },
] as const;

export default function Cuenta({
  fecha,
  titulo,
  detalle,
  fin,
  href,
  enlace,
}: {
  /** ISO 8601 con zona: "2026-11-23T18:00:00-03:00". */
  fecha: string;
  /** Barra superior, a la izquierda: "Casting abierto". */
  titulo: string;
  /** Barra superior, a la derecha: "Lun 23/11 · 18 hs". */
  detalle?: string;
  /** Lo que dice la barra al llegar a cero: "El casting empezó". */
  fin: string;
  /** Link al pie del panel. */
  href?: string;
  enlace?: string;
}) {
  const t = useSyncExternalStore(suscribir, ahora, enServidor);
  const meta = Math.floor(Date.parse(fecha) / 1000);
  const resta = t === null ? null : Math.max(0, meta - t);
  const llego = resta === 0;

  const escena = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /* Giro hacia el cursor: variables CSS directas, sin renders por movimiento. */
  useEffect(() => {
    const s = escena.current;
    const p = panel.current;
    if (!s || !p) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mover = (e: PointerEvent) => {
      const r = s.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      p.style.setProperty("--cry", `${x * 16}deg`);
      p.style.setProperty("--crx", `${-y * 14}deg`);
      p.style.setProperty("--cgx", `${(x + 0.5) * 100}%`);
      p.style.setProperty("--cgy", `${(y + 0.5) * 100}%`);
    };
    const salir = () => {
      p.style.removeProperty("--cry");
      p.style.removeProperty("--crx");
    };
    s.addEventListener("pointermove", mover);
    s.addEventListener("pointerleave", salir);
    return () => {
      s.removeEventListener("pointermove", mover);
      s.removeEventListener("pointerleave", salir);
    };
  }, []);

  /* Cada unidad es lo que sobra de la anterior: días, horas del día… */
  const valores = UNIDADES.map((u, i) => {
    if (resta === null) return "--";
    const v = Math.floor((i === 0 ? resta : resta % UNIDADES[i - 1].seg) / u.seg);
    return String(v).padStart(2, "0");
  });

  return (
    <div ref={escena} className="ry-cd">
      <div ref={panel} className="ry-cd-panel hp-haz" role="timer" aria-label={`${titulo}${detalle ? `, ${detalle}` : ""}`}>
        <div className="ry-cd-bar" aria-hidden="true">
          <span className="ry-cd-live-wrap">
            <span className="ry-cd-live" />
            {llego ? fin : titulo}
          </span>
          {detalle && <span>{detalle}</span>}
        </div>

        <div className="ry-cd-grid" aria-hidden="true">
          {UNIDADES.map((u, i) => (
            <div key={u.k} className="ry-cd-slot">
              {i > 0 && (
                <span className="ry-cd-rivets">
                  <span />
                  <span />
                </span>
              )}
              <div className="ry-cd-cell">
                <div className="ry-cd-tile">
                  <span key={valores[i]} className="ry-cd-digit">{valores[i]}</span>
                </div>
                <span className="ry-cd-label">{u.label}</span>
              </div>
            </div>
          ))}
        </div>

        {resta !== null && (
          <p className="hp-sr">
            {llego ? fin : `Faltan ${valores[0]} días, ${valores[1]} horas y ${valores[2]} minutos.`}
          </p>
        )}

        {href && enlace && (
          <Link href={href} className="ry-cd-link" data-medir="cuenta_click" data-medir-destino={href}>
            {enlace}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        )}
      </div>
    </div>
  );
}
