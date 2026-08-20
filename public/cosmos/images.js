/**
 * Carga y caché del material de las tarjetas.
 *
 * Vive aparte de cards.js por una razón concreta: cards.js importa three, y
 * three se evalúa apenas se lo importa. Si pedir las imágenes obligara a
 * tocar cards.js, la descarga —que es red pura y podría empezar de inmediato—
 * quedaría detrás de compilar el motor 3D. Acá no hay una sola dependencia.
 */

/** Carga una imagen; resuelve en null si falla (nunca rechaza).
 *  Cachea por src, que es lo que permite pedirlas todas juntas de antemano
 *  y que después cada tarjeta encuentre la suya ya resuelta. */
const cache = new Map();

/* Descomprimir un JPEG es caro, y con <img> el trabajo cae en el hilo
   principal: `decoding = "async"` no alcanza, porque si nadie esperó el
   decode antes de dibujarlo, drawImage lo fuerza ahí mismo. En un gama media
   eso era una sola tarea de 775 ms —el hilo trabado casi un segundo— para
   seis fotos.

   createImageBitmap descomprime fuera del hilo principal y devuelve algo que
   drawImage ya puede pintar sin volver a tocar el CPU. El <img> queda de
   respaldo para navegadores que no lo tengan. */
const canBitmap = typeof createImageBitmap === 'function';

function viaBitmap(src) {
  return fetch(src, { credentials: 'same-origin' })
    .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(r.status))))
    .then((b) => createImageBitmap(b));
}

function viaImgTag(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('img'));
    img.src = src;
  });
}

export function loadImage(src) {
  if (!src) return Promise.resolve(null);
  const hit = cache.get(src);
  if (hit) return hit;

  const p = (canBitmap ? viaBitmap(src).catch(() => viaImgTag(src)) : viaImgTag(src))
    .catch(() => {
      console.warn('[cosmos] no cargó la imagen, se usa fondo procedural:', src);
      return null;   // nunca rechaza: la tarjeta cae al fondo procedural
    });

  cache.set(src, p);
  return p;
}

/**
 * Ruta de la foto que le corresponde a una tarjeta en este dispositivo.
 *
 * En el teléfono la textura mide 512x384 y las fotos del sitio llegan a
 * 1440 px de lado: se bajaban 702 KiB para pintar unos doscientos mil
 * píxeles, y esos bytes competían por el ancho de banda justo con la fuente
 * y el motor. scripts/build-card-images.mjs deja en /images/cards la misma
 * foto con el lado largo en 720; en escritorio se sigue usando la original,
 * que ahí sí se ve entera.
 */
const COARSE = matchMedia('(pointer: coarse)').matches;

export function cardImage(src) {
  if (!src || !COARSE) return src;
  return '/images/cards/' + src.replace(/^\/images\//, '').replace(/\//g, '-');
}

/**
 * Dispara la descarga de todo el material de las tarjetas de una sola vez.
 *
 * Las texturas se componen en serie para poder informar avance real, pero
 * componer en serie arrastraba también a descargar en serie: ocho idas y
 * vueltas encadenadas antes de la última tarjeta. Pedidas todas juntas, la
 * red trabaja en paralelo y el bucle de composición solo espera a la primera.
 */
export function preloadCardImages(projects) {
  for (const p of projects) { loadImage(cardImage(p.image)); loadImage(p.logo); }
}
