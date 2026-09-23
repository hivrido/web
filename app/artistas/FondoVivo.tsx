"use client";

import { useEffect, useRef } from "react";

/**
 * El fondo vivo de la sección.
 *
 * Es la atmósfera del anillo de la portada —estrellas, polvo cercano, cúmulos
 * de nebulosa, los dos glows del corazón y la doble hélice— con los mismos
 * parámetros y la misma paleta que `src/cosmos/scene.js`, pero pintada en
 * canvas 2D en vez de WebGL.
 *
 * Por qué no se reusa el motor: `public/cosmos/ring.js` pesa 518 KiB y abre un
 * contexto WebGL con ocho capas de partículas, un anillo de tarjetas y sus
 * texturas. Ahí eso se justifica porque la escena *es* la página; acá el LCP
 * es el nombre del artista y el fondo es fondo. Medio megabyte y una GPU
 * encendida para algo que nadie va a mirar de frente es exactamente la clase
 * de peso que este sitio no se banca.
 *
 * Lo que sí se adapta de verdad es la sección: el acento del artista entra en
 * la paleta de la nebulosa y en el corazón, así la página de Amplax respira
 * lima y la de Kareen rosa, sobre el mismo violeta de la casa. El de la
 * portada retinta `--ac` con el proyecto que está al frente; este hace lo
 * mismo con quien está hablando.
 *
 * Presupuesto: sprites pre-renderizados una sola vez y `drawImage` por
 * partícula —no hay un gradiente nuevo por cuadro—, DPR tope 1,5, la mitad de
 * las capas en pantallas chicas, el bucle frenado cuando la pestaña se va al
 * fondo y un solo cuadro fijo si el sistema pide menos movimiento.
 */

const TAU = Math.PI * 2;

/** Suma de uniformes ≈ gaussiana: los cúmulos quedan densos al centro. */
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

/** La paleta de la nebulosa del anillo, tal cual. */
const PALETA = ["#B026FF", "#FF2E9A", "#FF3355", "#00E5FF", "#7C3AED"];

/** El polvo cercano de la escena: `0xc9a6ff`. */
const POLVO = "#c9a6ff";

type RGB = [number, number, number];

function aRgb(color: string): RGB {
  const h = color.trim().replace("#", "");
  const s = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = Number.parseInt(s.slice(0, 6), 16);
  return Number.isNaN(n) ? [176, 38, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Un punto blando en su propio lienzo. Se dibuja una vez y después solo se
 * estampa escalado: un `createRadialGradient` por partícula y por cuadro es
 * lo que hunde a este tipo de fondo.
 */
function hacerPunto(rgb: RGB, lado = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = lado;
  const g = c.getContext("2d");
  if (!g) return c;
  const r = lado / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  const [x, y, z] = rgb;
  grad.addColorStop(0, `rgba(${x},${y},${z},1)`);
  grad.addColorStop(0.35, `rgba(${x},${y},${z},0.55)`);
  grad.addColorStop(1, `rgba(${x},${y},${z},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, lado, lado);
  return c;
}

type Particula = {
  x: number;      // 0..1 sobre el ancho
  y: number;      // 0..1 sobre el alto
  z: number;      // 0..1: cerca = grande y con más parallax
  r: number;      // radio en px a z = 1
  a: number;      // alfa base
  vx: number;
  vy: number;
  fase: number;
  spr: number;    // índice del sprite
};

export default function FondoVivo() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* El corte es por ancho y no por "es un teléfono": lo que encarece el
       cuadro es la cantidad de píxeles, y una ventana angosta en un escritorio
       tampoco necesita ochocientas partículas. */
    const corto = window.innerWidth < 820;

    /* El acento lo pone la página: en el índice es el magenta de la casa y
       dentro de una ficha, el del artista. */
    const estilo = getComputedStyle(canvas.parentElement ?? canvas);
    const acento = estilo.getPropertyValue("--art-acento").trim() || "#FF1B8D";
    const marca = estilo.getPropertyValue("--art-marca").trim() || "#FF1B8D";

    /* La paleta de la portada con el acento adentro: el color del artista se
       mezcla con el violeta de la casa en vez de reemplazarlo. */
    const colores = [...PALETA, acento, acento].map(aRgb);
    const sprites = colores.map((c) => hacerPunto(c));
    const sprPolvo = hacerPunto(aRgb(POLVO));
    const sprEstrella = hacerPunto([255, 245, 255], 32);
    const sprHelice = hacerPunto([191, 233, 255], 32);
    const sprHeliceAc = hacerPunto(aRgb(acento), 32);

    /* Los dos glows del corazón de la nebulosa. El violeta es el de la
       portada; el segundo toma el color de quien habla en lugar del magenta
       fijo, que es lo único que ahí no podía variar. */
    const heartA = hacerPunto(aRgb("#7C3AED"), 256);
    const heartB = hacerPunto(aRgb(marca === acento ? "#FF2E9A" : acento), 256);

    /* ── Las capas ─────────────────────────────────────────────────────── */
    const nuevas = (n: number, hacer: (i: number) => Particula) =>
      Array.from({ length: n }, (_, i) => hacer(i));

    // Estrellas: lejos, chicas, casi quietas. `0.3 + random` de tamaño y
    // `0.18 + s * 0.5` de alfa, como el shader del anillo.
    const estrellas = nuevas(corto ? 130 : 300, () => {
      const s = 0.3 + Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        z: 0.1 + Math.random() * 0.2,
        r: s * 1.5,
        a: 0.18 + s * 0.5,
        vx: (Math.random() - 0.5) * 0.000004,
        vy: -Math.random() * 0.000006,
        fase: Math.random() * TAU,
        spr: -1,
      };
    });

    // Polvo cercano: violeta claro, el que más se mueve con el scroll.
    const polvo = nuevas(corto ? 45 : 110, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.55 + Math.random() * 0.45,
      r: 1.6 + Math.random() * 3.4,
      a: 0.22 + Math.random() * 0.28,
      vx: (Math.random() - 0.5) * 0.00002,
      vy: -(0.000008 + Math.random() * 0.00002),
      fase: Math.random() * TAU,
      spr: -2,
    }));

    // Nebulosa: cúmulos gaussianos repartidos por la pantalla. Es lo que hace
    // que el contenido flote "dentro" de algo en vez de estar apoyado en un
    // rectángulo negro.
    const cumulos = corto ? 4 : 7;
    const porCumulo = corto ? 22 : 42;
    const nebulosa: Particula[] = [];
    for (let c = 0; c < cumulos; c++) {
      const cx = 0.1 + Math.random() * 0.8;
      const cy = 0.08 + Math.random() * 0.84;
      const spr = Math.floor(Math.random() * sprites.length);
      for (let i = 0; i < porCumulo; i++) {
        nebulosa.push({
          x: cx + gauss() * 0.16,
          y: cy + gauss() * 0.13,
          z: 0.25 + Math.random() * 0.5,
          r: 3 + Math.random() * 13,
          a: 0.05 + Math.random() * 0.12,
          vx: (Math.random() - 0.5) * 0.000012,
          vy: -(0.000004 + Math.random() * 0.00001),
          fase: Math.random() * TAU,
          spr,
        });
      }
    }

    /* ── La hélice ──
       La columna de ADN de la portada, corrida a un lado y bajada de brillo:
       ahí es el sujeto del cuadro, acá el sujeto es el nombre del artista y
       una doble hélice por el medio se lo come. Fuera en pantallas angostas,
       donde no queda margen que ceder. */
    const HELICE = corto ? 0 : 170;
    /* Entero a propósito: la columna cicla con el scroll en vez de
       trasladarse —trasladada se despega del borde de abajo y deja un hueco—
       y con un número redondo de vueltas el ángulo de la costura coincide, así
       que el ciclo no se ve. */
    const VUELTAS = 3;

    /* ── Medidas ───────────────────────────────────────────────────────── */
    let w = 0;
    let h = 0;
    let dpr = 1;

    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();

    const estampar = (
      spr: HTMLCanvasElement,
      x: number,
      y: number,
      radio: number,
      alfa: number,
    ) => {
      if (alfa <= 0.002 || radio <= 0.05) return;
      ctx.globalAlpha = alfa;
      ctx.drawImage(spr, x - radio, y - radio, radio * 2, radio * 2);
    };

    const spriteDe = (p: Particula) =>
      p.spr === -1 ? sprEstrella : p.spr === -2 ? sprPolvo : sprites[p.spr];

    const cuadro = (t: number) => {
      const scroll = window.scrollY || 0;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      /* El corazón: dos nubes anchas y blandas, quietas salvo una respiración.
         Los alfas no son de ojo. Esto suma luz sobre el fondo, así que sube el
         negro debajo del texto y baja el contraste; con 0,20 y 0,13 el gris
         más tenue de la página caía a 3,8:1 donde las dos nubes se cruzan y un
         acento claro las empujaba —por debajo del AA que esta sección cumple
         en todo lo demás—. Con estos, el peor cruce imaginable lo deja en
         5,0:1 y el cuerpo de texto en 8,0:1. */
      const lento = Math.sin(t * 0.00013);
      estampar(heartA, w * 0.5, h * 0.52 - scroll * 0.02, w * 0.46, 0.14 + lento * 0.02);
      estampar(heartB, w * 0.22, h * 0.3 - scroll * 0.035, w * 0.3, 0.08 - lento * 0.015);

      for (const capa of [nebulosa, polvo, estrellas]) {
        for (const p of capa) {
          /* La deriva y el scroll comparten el eje: la capa de adelante se
             mueve más que la de atrás y de ahí sale la profundidad. */
          const dy = (p.y + t * p.vy - scroll * 0.00006 * p.z) % 1;
          const dx = (p.x + t * p.vx) % 1;
          const px = (dx < 0 ? dx + 1 : dx) * w;
          const py = (dy < 0 ? dy + 1 : dy) * h;
          const titilar = 0.75 + 0.25 * Math.sin(t * 0.0009 + p.fase);
          estampar(spriteDe(p), px, py, p.r * (0.6 + p.z), p.a * titilar);
        }
      }

      // La doble hélice, anclada a la derecha.
      if (HELICE > 0) {
        const cx = w * 0.82;
        const radio = Math.min(w * 0.085, 150);
        const giro = t * 0.00016;
        /* Módulo positivo: en el rebote de arriba `scrollY` se va a negativo
           en algunos navegadores y un `u` negativo apaga la columna entera. */
        const desp = (((scroll * 0.00007) % 1) + 1) % 1;
        for (let i = 0; i < HELICE; i++) {
          const u = (i / HELICE + desp) % 1;
          const y = (1.06 - u * 1.12) * h;
          const ang = u * VUELTAS * TAU + giro;
          for (const hebra of [0, Math.PI]) {
            const a = ang + hebra;
            /* El coseno es la profundidad: la mitad de la vuelta que viene
               hacia el ojo se agranda y se enciende, la que se va se apaga. */
            const prof = (Math.cos(a) + 1) / 2;
            estampar(
              hebra === 0 ? sprHelice : sprHeliceAc,
              cx + Math.sin(a) * radio,
              y,
              1.4 + prof * 3.4,
              (0.05 + prof * 0.13) * (0.4 + 0.6 * Math.sin(u * Math.PI)),
            );
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    /* ── El bucle ──────────────────────────────────────────────────────── */
    if (quieto) {
      cuadro(0);
      const alRedimensionar = () => {
        medir();
        cuadro(0);
      };
      window.addEventListener("resize", alRedimensionar);
      return () => window.removeEventListener("resize", alRedimensionar);
    }

    let raf = 0;
    let corriendo = true;
    const bucle = (t: number) => {
      cuadro(t);
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);

    /* Con la pestaña en segundo plano el navegador ya estrangula el rAF, pero
       no siempre lo frena: sin esto, una pestaña abierta atrás sigue pagando
       cuadros y batería. */
    const alCambiarVisibilidad = () => {
      const visible = !document.hidden;
      if (visible === corriendo) return;
      corriendo = visible;
      if (visible) raf = requestAnimationFrame(bucle);
      else cancelAnimationFrame(raf);
    };

    window.addEventListener("resize", medir);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", medir);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, []);

  return <canvas ref={ref} className="art-fondo" aria-hidden />;
}
