/**
 * Datos estructurados (schema.org) compartidos por las páginas.
 *
 * Solo declaran lo que el sitio ya dice: nombre, contacto, ciudad, el servicio
 * de cada landing y el camino hasta la página. Nada de puntajes ni reseñas:
 * no hay votos reales detrás, y Google sanciona los que se inventan.
 */

import { MAIL, WHATSAPP_NUMERO, INSTAGRAM } from "./contacto";

export const SITE = "https://hivrido.com";
const ORG_ID = `${SITE}/#organization`;

/** La organización, como negocio de servicios con sede en Buenos Aires. */
export const organizacion = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "Hivrido",
  url: `${SITE}/web/`,
  logo: { "@type": "ImageObject", url: `${SITE}/images/logo/hivrido-logo-512.png`, width: 512, height: 512 },
  image: `${SITE}/images/logo/hivrido-logo-512.png`,
  email: MAIL,
  telephone: `+${WHATSAPP_NUMERO}`,
  address: { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" },
  areaServed: "AR",
  sameAs: [INSTAGRAM],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: `+${WHATSAPP_NUMERO}`,
    email: MAIL,
    availableLanguage: "es",
  },
};

/** Migas: de la portada a la página. Cada paso es [nombre, ruta con barra final]. */
export function migas(pasos: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: pasos.map(([name, ruta], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE}${ruta}`,
    })),
  };
}

/** Una landing de servicio: el servicio, quién lo presta y las migas. */
export function servicioLd({ nombre, tipo, descripcion, ruta }: { nombre: string; tipo: string; descripcion: string; ruta: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizacion,
      {
        "@type": "Service",
        "@id": `${SITE}${ruta}#servicio`,
        name: nombre,
        serviceType: tipo,
        description: descripcion,
        url: `${SITE}${ruta}`,
        provider: { "@id": ORG_ID },
        areaServed: "AR",
        inLanguage: "es-AR",
      },
      migas([["Hivrido", "/web/"], [nombre, ruta]]),
    ],
  };
}

/** "1h 13m", "89m", "8m" → duración ISO 8601. Sin dato, undefined. */
export function duracionIso(d?: string): string | undefined {
  if (!d) return undefined;
  const h = /(\d+)\s*h/.exec(d)?.[1];
  const m = /(\d+)\s*m/.exec(d)?.[1];
  if (!h && !m) return undefined;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}

/** El bloque <script type="application/ld+json">. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
