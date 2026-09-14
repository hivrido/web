import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function config(phase: string): NextConfig {
  return {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    devIndicators: false,
    /* La portada es public/index.html, no una página de Next. En producción
       la sirve el export, que la copia a out/index.html; el servidor de
       desarrollo, en cambio, no mapea "/" a ese archivo y responde 404. La
       reescritura va solo en dev porque el export no admite rewrites. */
    ...(phase === PHASE_DEVELOPMENT_SERVER && {
      rewrites: async () => [{ source: "/", destination: "/index.html" }],
    }),
  };
}
