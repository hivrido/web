import type { Metadata, Viewport } from "next";
import PlayPortada, { playMetadata } from "./components/play/PlayPortada";
import RytmosHome, { rytmosMetadata } from "./components/rytmos/RytmosHome";
import { PORTADA } from "./lib/portada";

/* La raíz del dominio. Qué se sirve lo decide app/lib/portada.ts:
   - "rytmos": la home de lanzamiento de la serie, puerta a todo Hivrido;
   - "play": la portada anterior, el catálogo, sin un cambio.
   El anillo institucional vive en /web (public/web/index.html, servido por
   el rewrite de next.config.ts). */

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export const metadata: Metadata = PORTADA === "play" ? playMetadata("/") : rytmosMetadata;

export default function Page() {
  return PORTADA === "play" ? <PlayPortada canonical="/" /> : <RytmosHome />;
}
