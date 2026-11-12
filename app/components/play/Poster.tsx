/**
 * Afiche de PLAY, con variantes por ancho.
 *
 * `next/image` está con `unoptimized`, así que no arma `srcset`: cada tarjeta
 * de 340 px bajaba el afiche de 1600. Acá el `srcset` se arma a mano con las
 * variantes que genera `scripts/build-poster-variants.mjs` (640 y 960 px), y
 * el navegador elige la que le alcanza.
 *
 * Ocupa todo su contenedor, igual que hacía `fill`: el contenedor tiene que
 * ser `position: relative` con su proporción definida.
 */

/** Afiches que tienen variantes 640 y 960 generadas. */
const CON_VARIANTES = new Set([
  "/images/peliculas/3am.webp",
  "/images/peliculas/armario-de-dani.webp",
  "/images/peliculas/esnob.webp",
  "/images/peliculas/matanza.webp",
  "/images/peliculas/mia.webp",
  "/images/peliculas/rectangulo-v2.webp",
  "/images/peliculas/virreyes.webp",
  "/images/series/cuchillo-paz.webp",
  "/images/series/elmonarco.jpg",
]);

/** `srcset` del afiche, o undefined si no tiene variantes. */
export function posterSrcSet(src: string): string | undefined {
  if (!CON_VARIANTES.has(src)) return undefined;
  const base = src.replace(/\.[^.]+$/, "");
  const full = /elmonarco|cuchillo-paz/.test(src) ? 1280 : 1600;
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${src} ${full}w`;
}

/** La variante de un ancho dado, o el original si no la hay. */
export function posterAt(src: string, width: 640 | 960): string {
  return CON_VARIANTES.has(src) ? src.replace(/\.[^.]+$/, `-${width}.webp`) : src;
}

export default function Poster({
  src,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  /** Ancho que ocupa en pantalla, como en cualquier `sizes`. */
  sizes: string;
  className?: string;
  /** La imagen principal de la pantalla inicial: se pide ya y con prioridad. */
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ver la nota de cabecera
    <img
      src={src}
      srcSet={posterSrcSet(src)}
      sizes={sizes}
      alt=""
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={`hp-poster ${className}`}
    />
  );
}
