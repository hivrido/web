/**
 * HIVRIDO — COSMOS · Arranque del preloader
 *
 * Lo único que corre antes que three. El logo del preloader se dibuja por JS,
 * y vivía dentro de main.js: como main.js importa cards.js y scene.js, y esos
 * importan three, el primer contenido de la página esperaba a que 176 KB de
 * motor 3D bajaran y compilaran. La coreografía del logo arrancaba tarde y,
 * con ella, todo lo que cuelga de `bootT0`.
 *
 * Acá el único import es brand.js, que no depende de nada. El logo entra en
 * cuanto llega, en paralelo con la descarga de three.
 *
 * `bootT0` se exporta en vez de vivir en un global: main.js lo importa y el
 * caché de módulos garantiza que sea el mismo instante, medido una sola vez.
 */

import { mountLogo } from './brand.js';

export const bootT0 = performance.now();

mountLogo(document.getElementById('bootLogo'), { delay: 200, height: 70, speed: 1.6 });

/* La bajada "Is the Future" no se toca desde acá: entra sola con una
   animación CSS, en el mismo compás que el trazo del logo. Estaba enganchada
   al progreso de carga —aparecía recién al 40%— y encenderla por JS ataba el
   LCP a que bajara three y se compusieran las texturas. */
