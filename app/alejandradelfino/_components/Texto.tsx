import { partirMarcas } from "../_lib/contenido";

/* Texto del contenido con las marcas [CONFIRMAR] y [BORRADOR] a la vista:
   lo que falta validar tiene que notarse en la vista previa, no esconderse. */
export default function Texto({ children }: { children: string }) {
  return (
    <>
      {partirMarcas(children).map((parte, i) =>
        parte === "[CONFIRMAR]" || parte === "[BORRADOR]" ? (
          <span key={i} className={`ad-marca ${parte === "[BORRADOR]" ? "is-borrador" : ""}`}>
            {parte.slice(1, -1)}
          </span>
        ) : (
          parte
        )
      )}
    </>
  );
}
