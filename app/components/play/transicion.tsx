"use client";

/**
 * Transición de vista entre páginas: el nombre de RYTMOS "vuela" de la home o
 * del catálogo a su ficha.
 *
 * Next navega del lado del cliente, así que las View Transitions entre
 * documentos (`@view-transition`) no aplican. Acá se usa la API de un solo
 * documento: `startViewTransition` captura la pantalla actual, navega y
 * espera a que la página nueva esté montada para animar entre las dos. El
 * elemento que viaja lleva `view-transition-name: rytmos-obra` en las dos
 * páginas; rytmos.css define cómo se mueve.
 *
 * Es mejora progresiva: sin soporte, con movimiento reducido o con una tecla
 * modificadora (abrir en otra pestaña) el link navega como siempre.
 */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

let terminar: (() => void) | null = null;

/** Marca el fin de la navegación. Va en cada página que participa. */
export function FinTransicion() {
  const ruta = usePathname();
  useEffect(() => {
    terminar?.();
    terminar = null;
  }, [ruta]);
  return null;
}

type DocConVT = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };

/** onClick para un link que navega con transición. */
export function useNavegarConTransicion() {
  const router = useRouter();
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doc = document as DocConVT;
    if (
      !doc.startViewTransition ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const href = e.currentTarget.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    e.preventDefault();
    doc.startViewTransition(
      () =>
        new Promise<void>((listo) => {
          terminar = listo;
          router.push(href);
          /* Si la página nueva tarda, la transición no puede congelar la
             pantalla: a los 1,5 s se suelta igual. */
          setTimeout(listo, 1500);
        }),
    );
  };
}

