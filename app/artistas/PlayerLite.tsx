"use client";

import { useState } from "react";

/* Portada de reemplazo cuando el video no tiene la de máxima resolución. */
function bajarPortada(img: HTMLImageElement, ytId: string) {
  if (img.naturalWidth > 0 && img.naturalWidth <= 120) img.src = `https://i.ytimg.com/vi/${ytId}/sddefault.jpg`;
}

/**
 * Reproductor de YouTube con fachada.
 *
 * Un embed que se monta con la página arrastra medio megabyte de scripts de
 * terceros antes de que nadie haya pedido ver nada, y en una ficha cuyo LCP
 * es el nombre del artista eso es cargar el costo sin el beneficio. Acá lo
 * que se pinta primero es la portada —una sola imagen— y el iframe aparece
 * recién con el clic, ya con `autoplay`: el gesto que lo monta es el mismo
 * que pide la reproducción, así que no hay un segundo clic.
 *
 * `youtube-nocookie` porque la portada ya está servida y no hay motivo para
 * dejar una cookie de terceros en quien solo pasó por la página.
 */
export default function PlayerLite({
  ytId,
  titulo,
}: {
  ytId: string;
  titulo: string;
}) {
  const [activo, setActivo] = useState(false);

  if (activo) {
    return (
      <div className="art-player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="art-player">
      <button
        type="button"
        className="art-player-tapa"
        onClick={() => setActivo(true)}
        aria-label={`Reproducir ${titulo}`}
      >
        {/* Sin next/image a propósito: `images.unoptimized` deja al optimizador
            fuera de juego igual, y un host remoto obligaría a declarar
            `remotePatterns` en next.config para no ganar nada. */}
        <img
          src={`https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`}
          /* No todo video tiene portada en máxima resolución: cuando falta,
             YouTube responde un gris de 120 px en lugar de un error. Se
             detecta por el tamaño y se baja a la estándar, que existe siempre.
             El ref cubre la imagen que ya cargó antes de hidratar, cuando el
             onLoad llega tarde. */
          ref={(img) => { if (img?.complete) bajarPortada(img, ytId); }}
          onLoad={(e) => bajarPortada(e.currentTarget, ytId)}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="art-player-play" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.2v13.6L19 12z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
