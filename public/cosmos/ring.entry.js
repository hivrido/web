/**
 * Punto de entrada del paquete del anillo.
 *
 * Existe solo para que scripts/build-cosmos-bundle.mjs sepa qué tiene que
 * quedar vivo: todo lo que main.js necesita del motor 3D, y nada más. Lo que
 * no se reexporte acá, el sacudido del árbol lo deja afuera.
 *
 * El archivo que se sirve es `ring.js`, generado en el prebuild.
 */
export { makeCardTexture, makePlayTexture, waitForFonts } from './cards.js';
export { createScene } from './scene.js';
