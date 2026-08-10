"use client";

import { useEffect } from "react";

/** Acción de conversión "Solicitar cotización" de la cuenta de Google Ads. */
const SEND_TO = "AW-18174991826/u2P8CID8lt8cENK7wdpD";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Registra como conversión cada clic a WhatsApp.
 *
 * Escucha en el documento en vez de colgarse de cada botón: los enlaces a
 * WhatsApp están repartidos en el header, el pie, la burbuja flotante, los
 * modales de servicio, la colmena y las dos landings. Un solo oyente los cubre
 * a todos y sigue cubriendo los que se agreguen después, sin que nadie tenga
 * que acordarse de enganchar el evento.
 *
 * A diferencia del fragmento que da Google, no cancela la navegación ni espera
 * al `event_callback`. Ese patrón asume un enlace que abre en la misma pestaña:
 * hace `window.location = url` desde el callback, lo que acá rompería el
 * target="_blank" de todos los botones. Como el clic abre otra pestaña, esta
 * página sigue viva y el pedido llega igual.
 *
 * Si un bloqueador impide que cargue gtag.js, `window.gtag` no existe y el
 * clic sigue de largo sin error: medir nunca puede costar una consulta.
 */
export default function WhatsAppConversion() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.<HTMLAnchorElement>(
        'a[href*="whatsapp.com"], a[href*="wa.me"]'
      );
      if (!link) return;

      window.gtag?.("event", "conversion", {
        send_to: SEND_TO,
        value: 1.0,
        currency: "ARS",
      });
    };

    // Fase de captura: el evento se ve antes de que cualquier handler
    // intermedio pueda detener la propagación.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
