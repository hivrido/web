import { LANZAMIENTO } from "../_config/site";

/* Piezas de identidad. El corazón verde es parte del logo AD: queda bloqueado
   con él hasta el lanzamiento. El monograma es el reemplazo neutro, sin el
   diseño del logo, para los lugares donde hacía falta una marca. */

export function Corazon({ grande = false }: { grande?: boolean }) {
  if (!LANZAMIENTO) return null;
  return <span className={`ad-corazon ${grande ? "ad-corazon-grande" : ""}`} aria-hidden="true" />;
}

export function Monograma({ className = "" }: { className?: string }) {
  return (
    <span className={`ad-monograma ${className}`} aria-hidden="true">
      AD
    </span>
  );
}
