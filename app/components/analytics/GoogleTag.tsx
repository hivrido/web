import Script from "next/script";

/**
 * Etiqueta de Google (gtag.js).
 *
 * Dos partes con tiempos distintos:
 *
 * - La cola (`dataLayer` y la función `gtag`) se define en línea, con el HTML.
 *   Pesa nada y hace que cualquier evento —un clic a WhatsApp en el primer
 *   segundo— quede anotado aunque la librería todavía no haya llegado.
 * - La librería (~165 KB, casi medio segundo de hilo principal en un teléfono
 *   medio) se pide con `lazyOnload`: después de que la página cargó y con el
 *   navegador libre. Al llegar procesa todo lo que encontró en la cola.
 *
 * Antes iba con `afterInteractive` y sin cola previa: competía con la
 * hidratación, y un clic anterior a su llegada se perdía porque `window.gtag`
 * todavía no existía.
 *
 * `ga4` es opcional: si está definido `NEXT_PUBLIC_GA4_ID`, la misma etiqueta
 * configura también la propiedad de Analytics. Sin la variable no cambia nada.
 */
export default function GoogleTag({ id, ga4 }: { id: string; ga4?: string }) {
  const config = [id, ga4].filter(Boolean).map((x) => `gtag('config','${x}');`).join("");
  return (
    <>
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${config}`,
        }}
      />
      <Script id="gtag-src" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
    </>
  );
}
