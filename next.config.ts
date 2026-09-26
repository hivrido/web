import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    /* Las imágenes ya vienen dimensionadas por los scripts de prebuild y los
       fondos se pintan por CSS, así que el optimizador no tiene nada que
       hacer: dejarlo apagado mantiene el render idéntico al del export. */
    unoptimized: true,
  },
  devIndicators: false,
  experimental: {
    /* El CSS va dentro del HTML en vez de en <link>: eran dos hojas que
       bloqueaban el primer pintado ~450 ms en 4G. */
    inlineCss: true,
  },
  /* La portada del dominio es public/index.html, no una página de Next: no hay
     app/page.tsx que responda "/". El rewrite la sirve desde el archivo.

     Antes vivía solo en desarrollo porque `output: "export"` no admite
     rewrites y en producción el export copiaba el archivo a out/index.html.
     Al salir del export el sitio pasa a modo servidor —que es lo que habilita
     los route handlers de /api/cesion, imposibles en un export— y el rewrite
     vale en los dos lados. */
  rewrites: async () => [{ source: "/", destination: "/index.html" }],
};

export default nextConfig;
