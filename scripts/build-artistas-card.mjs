/**
 * Arte de la placa ARTISTAS del anillo de la portada.
 *
 * Era la única ficha del cosmos que representa personas y se anunciaba con el
 * fondo procedural: un ruido distinto en cada carga, que es lo contrario de
 * una identidad. Pero una foto tampoco servía —la cara de un artista en la
 * tarjeta de la sección la convierte en la ficha de esa persona, y el roster
 * deja de ser el roster—, así que el arte es de la sección y no es de nadie:
 * un escenario vacío con los cañones encendidos, esperando.
 *
 * Dice lo mismo que el titular de la página —"una carrera no es un feed"— sin
 * una foto y sin una palabra: la luz ya está puesta.
 *
 * Se pinta píxel por píxel y no con un SVG. Un haz de luz es densidad que cae
 * con el ángulo y con la distancia, y eso son dos exponenciales; apilando
 * polígonos con alfa baja se ven los bordes de cada polígono y el resultado
 * se lee vectorial, que es justo lo que un escenario no puede parecer.
 *
 * Corre a mano y el JPG se versiona, como cualquier otra foto del sitio:
 *   node scripts/build-artistas-card.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = path.join(root, "public", "images", "bg", "artistas.jpg");

const W = 1440;
const H = 1080;

/* Dónde termina el fondo y empiezan las tablas. Alto: la tarjeta se recorta a
   4:3 y el título va abajo, así que el piso tiene que quedar en la franja que
   el texto no tapa. */
const PISO = 828;

/* El magenta de la sección. Mismo valor que `accent` de la ficha `roster` en
   public/cosmos/projects.js y que `--art-marca` en app/artistas/artistas.css.
   Los tres se mueven juntos o no se mueven. */
const MARCA = [255, 27, 141];

/* Los cañones cuelgan de la parrilla, fuera de cuadro. `apex` es la boca,
   `hacia` el punto del piso que iluminan, `abertura` la apertura del cono en
   radianes y `fuerza` cuánta luz mete.
 *
 * Hay uno dominante y dos que lo acompañan, y el cruce cae bajo y corrido a
 * la derecha. Bajando parejos se leían como postal de escenario; cruzándose
 * al medio con la misma fuerza dibujaban una X centrada, que sobre una placa
 * que dice ARTISTAS se lee como una tachadura. Desbalanceados y con el nudo
 * en el tercio inferior el cuadro gana diagonal sin formar ningún símbolo. */
const CANONES = [
  { apex: [250, -260], hacia: [880, PISO], abertura: 0.062, fuerza: 1.0 },
  { apex: [1240, -160], hacia: [690, PISO], abertura: 0.038, fuerza: 0.5 },
  { apex: [468, -340], hacia: [322, PISO], abertura: 0.027, fuerza: 0.3 },
];

/* Ruido de valor: la trama de grano que rompe el banding de los degradados.
   Determinista —misma semilla, mismo archivo— para que el JPG no cambie en
   cada corrida y ensucie el diff. */
let semilla = 0x5eed1b8d;
function azar() {
  semilla ^= semilla << 13;
  semilla ^= semilla >>> 17;
  semilla ^= semilla << 5;
  return ((semilla >>> 0) % 100000) / 100000;
}

/** Densidad del haz en un punto: cae con el ángulo al eje y con la distancia. */
function densidad(c, x, y) {
  const dx = x - c.apex[0];
  const dy = y - c.apex[1];
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return c.fuerza;

  const ejeX = c.hacia[0] - c.apex[0];
  const ejeY = c.hacia[1] - c.apex[1];
  const ejeLen = Math.hypot(ejeX, ejeY);

  /* Coseno del ángulo entre el punto y el eje del cono. Detrás de la boca no
     hay luz: un cañón no ilumina hacia arriba. */
  const cos = (dx * ejeX + dy * ejeY) / (dist * ejeLen);
  if (cos <= 0) return 0;
  const ang = Math.acos(Math.min(1, cos));

  /* Gaussiana sobre el ángulo: el centro del haz es sólido y el borde se
     deshace sin dejar filo. */
  const perfil = Math.exp(-((ang / c.abertura) ** 2) * 0.9);

  /* Y cae con la distancia recorrida, que es lo que hace que el haz se apague
     antes de llegar al piso en vez de pintarlo entero. */
  const alcance = Math.exp(-((dist / (ejeLen * 0.72)) ** 1.55));

  return c.fuerza * perfil * alcance;
}

const px = Buffer.alloc(W * H * 3);

for (let y = 0; y < H; y++) {
  /* Bajo el filo de las tablas se pinta el reflejo: el mismo cálculo, pero
     espejado sobre el piso y muy desvaído, que es como se comporta una tabla
     lustrada. Se comprime en vertical porque el piso se ve en escorzo. */
  const enPiso = y > PISO;
  const yMuestra = enPiso ? PISO - (y - PISO) * 2.6 : y;
  const atenuaPiso = enPiso ? 0.3 * Math.exp(-(y - PISO) / 128) : 1;

  for (let x = 0; x < W; x++) {
    let luz = 0;
    for (const c of CANONES) luz += densidad(c, x, yMuestra);
    luz *= atenuaPiso;

    /* El charco: donde el eje del cono toca las tablas queda una mancha
       achatada, que es lo que ancla la luz al piso en vez de dejarla flotando.
       Medida y no a fondo: el piso es la franja donde la tarjeta apoya el
       título, y un charco a pleno se le come el blanco del texto. */
    if (enPiso || y > PISO - 90) {
      for (const c of CANONES) {
        const cx = (x - c.hacia[0]) / 250;
        const cy = (y - (PISO + 34)) / 64;
        luz += c.fuerza * 0.3 * Math.exp(-(cx * cx + cy * cy) * 1.15);
      }
    }

    /* Neblina: una capa baja y pareja que da cuerpo al aire. Sin esto los
       haces se leen como recortes sobre negro. */
    const neblina = 0.05 * Math.exp(-(((y - PISO + 190) / 340) ** 2));
    luz += neblina * (0.35 + luz * 2.4);

    /* Viñeta: el cuadro se cierra hacia los bordes para que la tarjeta no
       termine en un borde plano. */
    const vx = (x - W / 2) / (W * 0.62);
    const vy = (y - H * 0.46) / (H * 0.74);
    luz *= Math.max(0, 1 - (vx * vx + vy * vy) * 0.92);

    luz = Math.max(0, Math.min(1.35, luz));

    /* De densidad a color. El núcleo del haz vira a blanco —una luz saturada
       en su punto más caliente deja de ser una luz y pasa a ser una mancha de
       color— y el resto se queda en el magenta de la marca. */
    const caliente = Math.min(1, luz) ** 3.4;
    const r = MARCA[0];
    const g = MARCA[1] + (255 - MARCA[1]) * caliente;
    const b = MARCA[2] + (255 - MARCA[2]) * caliente * 0.86;

    const grano = (azar() - 0.5) * 5.5;

    const i = (y * W + x) * 3;
    px[i] = Math.max(0, Math.min(255, 5 + r * luz + grano));
    px[i + 1] = Math.max(0, Math.min(255, 4 + g * luz + grano));
    px[i + 2] = Math.max(0, Math.min(255, 11 + b * luz + grano));
  }
}

await sharp(px, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

console.log(`[artistas] ${path.relative(root, OUT)} listo`);
