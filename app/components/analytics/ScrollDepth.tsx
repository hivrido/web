"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { medir } from "../../lib/medir";

const UMBRALES = [50, 90];

/**
 * Hasta dónde se lee cada página: un `scroll_depth` al pasar el 50 % y el 90 %.
 * En las landings de servicio es la diferencia entre "no les interesó" y "lo
 * leyeron entero y no escribieron".
 *
 * Un solo oyente pasivo, leído en el cuadro siguiente: no agrega trabajo al
 * scroll. Los hitos se reinician al cambiar de ruta, y una página que entra
 * entera en pantalla no emite nada (no hubo scroll que medir).
 */
export default function ScrollDepth() {
  const ruta = usePathname();

  useEffect(() => {
    const vistos = new Set<number>();
    let pendiente = 0;

    const leer = () => {
      pendiente = 0;
      const el = document.documentElement;
      const alto = el.scrollHeight - innerHeight;
      if (alto < innerHeight * 0.5) return;
      const pct = (scrollY / alto) * 100;
      for (const u of UMBRALES) {
        if (pct < u || vistos.has(u)) continue;
        vistos.add(u);
        medir("scroll_depth", { percent_scrolled: u });
      }
      if (vistos.size === UMBRALES.length) removeEventListener("scroll", alScroll);
    };
    const alScroll = () => {
      if (!pendiente) pendiente = requestAnimationFrame(leer);
    };

    addEventListener("scroll", alScroll, { passive: true });
    return () => {
      removeEventListener("scroll", alScroll);
      cancelAnimationFrame(pendiente);
    };
  }, [ruta]);

  return null;
}
