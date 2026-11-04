import { sello, type Revisable } from "../_lib/contenido";
import { PRODUCCION } from "../_config/site";

/* Sello de revisión. Solo existe en desarrollo: en producción lo pendiente y
   lo que está en borrador directamente no se renderiza (ver contenido.ts).
   El tooltip lleva la nota de qué falta para publicarlo. */
export default function Sello({ de, exigeFuente = true }: { de: Revisable; exigeFuente?: boolean }) {
  if (PRODUCCION) return null;
  const s = sello(exigeFuente ? de : { ...de, fuente: de.fuente ?? "—" });
  if (!s) return null;
  return (
    <span className={`ad-marca ${s === "BORRADOR" ? "is-borrador" : ""}`} title={de.nota}>
      {s}
    </span>
  );
}
