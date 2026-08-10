import Script from "next/script";

/**
 * Etiqueta de Google (gtag.js).
 *
 * Va solo en las rutas que reciben tráfico pago, no en el layout raíz: la
 * home no se anuncia y cargarle un script de terceros le cuesta latencia sin
 * devolver ningún dato útil.
 *
 * `afterInteractive` deja que la página termine de hidratar antes de pedir el
 * script. La medición no pierde nada —gtag encola los eventos en dataLayer
 * hasta que carga— y el primer render no compite con una request externa.
 */
export default function GoogleTag({ id }: { id: string }) {
  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
