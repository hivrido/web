/**
 * Un evento de medición. Va a la misma cola de `gtag` que los clics de
 * contacto (GoogleTag.tsx): hoy lo recibe la etiqueta de Ads y, el día que se
 * cargue `NEXT_PUBLIC_GA4_ID`, aparece en Analytics sin tocar código.
 *
 * Regla: ningún parámetro lleva datos de la persona (nombre, teléfono, mail,
 * lo que escribió en un formulario). Solo qué hizo y dónde.
 */
export function medir(evento: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", evento, { ...params, page_path: location.pathname });
}
