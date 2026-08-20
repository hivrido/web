/**
 * Empaqueta el anillo 3D —cards.js, scene.js y la parte de three que de
 * verdad se usa— en un solo archivo minificado.
 *
 * Antes la portada cargaba `three.module.min.js` entero por un importmap:
 * 168 KiB comprimidos de los que Lighthouse contaba 92 sin usar. El motor
 * trae loaders, geometrías, controles y materiales que esta escena nunca
 * toca, y esos bytes no solo se descargan: se parsean y se compilan en el
 * arranque, que es donde más caro sale. Con un empaquetado real el árbol se
 * sacude y queda solo lo alcanzable desde el código.
 *
 * `brand.js` e `images.js` quedan afuera a propósito. Los carga también
 * boot.js/main.js por su cuenta, y si se inlinearan acá el navegador tendría
 * dos instancias del módulo: dos cachés de imágenes distintas, y cada foto
 * pedida dos veces.
 *
 * Corre antes de `next build`, vía el script `prebuild`.
 */
import { rm, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as esbuild from "esbuild";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const cosmos = path.join(root, "public", "cosmos");

/* Los fragmentos llevan hash en el nombre, así que los de la corrida
   anterior no se pisan: se borran, o se van acumulando en el deploy. */
for (const f of await readdir(cosmos)) {
  if (/^ring(-[A-Z0-9]+)?\.js$/.test(f)) await rm(path.join(cosmos, f));
}

const result = await esbuild.build({
  entryPoints: [path.join(cosmos, "ring.entry.js")],
  /* Sale al mismo directorio que las fuentes, no a uno propio: los externos
     de abajo se escriben tal cual en la salida, y desde otra carpeta
     './brand.js' apuntaría a un archivo que no existe. */
  outdir: cosmos,
  entryNames: "ring",
  /* Un solo archivo, a propósito. Con `splitting` el bloom quedaba aparte
     —bien, porque solo lo enciende escritorio— pero three caía en un
     fragmento con hash, y un nombre que cambia en cada build no se puede
     anunciar con modulepreload desde el HTML. Ese salto de red extra en la
     ruta crítica del teléfono cuesta más que las ~7 KiB del post-proceso
     que viaja de más. */
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  legalComments: "none",
  // Compartidos con el resto de la página: se importan, no se copian
  external: ["./brand.js", "./images.js"],
  metafile: true,
});

const outputs = Object.entries(result.metafile.outputs);
const bytes = outputs.find(([f]) => f.endsWith("ring.js"))[1].bytes;

/* El vendor suelto ya no lo usa nadie: three vive adentro del paquete y el
   HTML no tiene importmap. Se borra para que no queden 675 KiB muertos
   viajando al deploy. */
await rm(path.join(cosmos, "vendor"), { recursive: true, force: true });

console.log(`ring.js -> ${(bytes / 1024).toFixed(0)} KiB (three tree-shakeado adentro)`);
