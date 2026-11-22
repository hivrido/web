import type { Metadata, Viewport } from "next";
import PlayPortada, { playMetadata } from "./components/play/PlayPortada";

/* La raíz del dominio sigue siendo el catálogo de PLAY, que además ya
   responde en /play/. El anillo institucional vive en /web
   (public/web/index.html, servido por el rewrite de next.config.ts). */

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export const metadata: Metadata = playMetadata("/");

export default function Page() {
  return <PlayPortada canonical="/" />;
}
