"use client";

import { useEffect } from "react";
import { seccionDe } from "../../lib/contacto";
import { medir } from "../../lib/medir";

/** Acción de conversión "Solicitar cotización" de la cuenta de Google Ads. */
const SEND_TO = "AW-18174991826/u2P8CID8lt8cENK7wdpD";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Mide los contactos: cada clic a WhatsApp, a un mail o a Instagram.
 *
 * Escucha en el documento en vez de colgarse de cada botón: los enlaces están
 * repartidos en el header, el pie, la burbuja flotante, los modales de
 * servicio, la colmena y las landings. Un solo oyente los cubre a todos y
 * sigue cubriendo los que se agreguen después.
 *
 * Por cada clic a WhatsApp salen dos cosas:
 * - la conversión de Google Ads de siempre, sin cambios, para no alterar lo
 *   que las campañas ya optimizan;
 * - un evento `whatsapp_click` con la sección y el lugar del clic. Hoy lo
 *   recibe la etiqueta de Ads; el día que se cargue `NEXT_PUBLIC_GA4_ID`
 *   aparece en Analytics sin tocar código. Ver auditoria/PENDIENTES.md.
 *
 * No cancela la navegación ni espera al `event_callback`: el clic abre otra
 * pestaña, esta página sigue viva y el pedido llega igual. La cola de `gtag`
 * existe desde el HTML (GoogleTag.tsx), así que un clic anterior a que baje
 * la librería queda anotado y se envía cuando llega.
 *
 * El mismo oyente mide cualquier elemento marcado con `data-medir="evento"`:
 * los `data-medir-*` restantes viajan como parámetros (`data-medir-origen`
 * → `origen`). Así un componente de servidor declara su medición sin pasar
 * a ser de cliente. Se emite además de lo anterior, no en su lugar: un
 * "Avisame" sigue contando como conversión de WhatsApp.
 */
export default function WhatsAppConversion() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const marcado = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-medir]");
      if (marcado) {
        const params: Record<string, string> = {};
        for (const [k, v] of Object.entries(marcado.dataset)) {
          if (k.startsWith("medir") && k !== "medir" && v) params[k.slice(5).toLowerCase()] = v;
        }
        medir(marcado.dataset.medir!, params);
      }

      const link = (e.target as HTMLElement | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.href;
      const seccion = seccionDe(location.pathname) || location.pathname;
      const lugar = link.dataset.waOrigen ?? link.closest("[id]")?.id ?? "contenido";

      if (/whatsapp\.com|wa\.me/.test(href)) {
        window.gtag?.("event", "conversion", { send_to: SEND_TO, value: 1.0, currency: "ARS" });
        window.gtag?.("event", "whatsapp_click", { seccion, lugar, page_path: location.pathname });
      } else if (href.startsWith("mailto:")) {
        window.gtag?.("event", "mail_click", { seccion, lugar, page_path: location.pathname });
      } else if (/instagram\.com/.test(href)) {
        window.gtag?.("event", "instagram_click", { seccion, page_path: location.pathname });
      }
    };

    // Fase de captura: el evento se ve antes de que cualquier handler
    // intermedio pueda detener la propagación.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
