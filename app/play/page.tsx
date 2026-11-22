import type { Metadata, Viewport } from "next";
import PlayPortada, { playMetadata } from "../components/play/PlayPortada";
import { CATALOGO_CANONICO } from "../lib/portada";

/* El catálogo de Hivrido PLAY. Con la home de RYTMOS en la raíz, esta es su
   URL canónica; si la raíz vuelve a ser el catálogo (app/lib/portada.ts),
   esta ruta sigue respondiendo y declara "/" como canónica. */

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export const metadata: Metadata = playMetadata(CATALOGO_CANONICO);

export default function Page() {
  return <PlayPortada canonical={CATALOGO_CANONICO} />;
}
