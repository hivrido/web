/**
 * Piezas de servidor de la home de RYTMOS: el titular que se revela por
 * palabras, la cabecera numerada de cada sección y la imagen con variantes.
 */

import { Fragment } from "react";
import { srcsetDe, type Imagen } from "../../lib/rytmos";

/** Titular partido en palabras, cada una en su máscara: el reveal lo hace el
    CSS con el scroll (rytmos.css, `.ry-w`). El texto completo queda en el
    HTML para lectores de pantalla y buscadores. */
export function Titular({ texto, as: Tag = "h2", className = "ry-h2" }: { texto: string; as?: "h1" | "h2"; className?: string }) {
  return (
    <Tag className={className}>
      <span className="hp-sr">{texto}</span>
      {texto.split(" ").map((w, i) => (
        /* El espacio va afuera de la máscara: adentro de un inline-block
           quedaría al final de su línea y se colapsaría. */
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="ry-w" aria-hidden="true">
            <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/** Cabecera de sección con la numeración editorial de Hivrido: "02 — La serie". */
export function Cabecera({ n, rotulo, titulo, children }: { n: number; rotulo: string; titulo: string; children?: React.ReactNode }) {
  return (
    <header className="ry-sec-head">
      <p className="ry-num">{String(n).padStart(2, "0")} — {rotulo}</p>
      <Titular texto={titulo} />
      {children}
    </header>
  );
}

/**
 * Imagen de la serie con sus variantes AVIF y WebP por ancho (las genera
 * scripts/build-rytmos-images.mjs). `prioridad` la pide antes que nada: es
 * para el key art, que es el LCP de la home.
 */
export function Foto({
  img,
  movil,
  sizes,
  className,
  prioridad = false,
}: {
  img: Imagen;
  /** Otro encuadre para pantallas de hasta 768 px (art direction). */
  movil?: Imagen;
  sizes: string;
  className?: string;
  prioridad?: boolean;
}) {
  const enMovil = "(max-width: 768px)";
  return (
    <picture className={className}>
      {movil && <source media={enMovil} type="image/avif" srcSet={srcsetDe(movil.src, "avif", movil.ancho)} sizes="100vw" />}
      {movil && <source media={enMovil} type="image/webp" srcSet={srcsetDe(movil.src, "webp", movil.ancho)} sizes="100vw" />}
      <source type="image/avif" srcSet={srcsetDe(img.src, "avif", img.ancho)} sizes={sizes} />
      <source type="image/webp" srcSet={srcsetDe(img.src, "webp", img.ancho)} sizes={sizes} />
      <img
        src={`${img.src}-1080.webp`}
        alt={img.alt}
        width={img.ancho}
        height={img.alto}
        loading={prioridad ? "eager" : "lazy"}
        fetchPriority={prioridad ? "high" : "auto"}
        decoding={prioridad ? "sync" : "async"}
      />
    </picture>
  );
}
