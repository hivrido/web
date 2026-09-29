import { Delaunay } from "d3-delaunay";
import gsap from "gsap";

/**
 * Rompe una tarjeta en pedazos de vidrio desde el punto del toque.
 *
 * Los fragmentos son la foto misma, cortada en celdas de Voronoi, con el filo
 * violeta de la casa. Se dibujan en un canvas fijo sobre toda la pantalla
 * —no dentro de la tarjeta, que recorta con `overflow: hidden`— así vuelan
 * libres. Como GSAP gira y escala cada tarjeta, el canvas copia esa
 * transformación para que el primer cuadro calce exacto sobre la foto.
 *
 * Resuelve la promesa apenas la rotura se lee (no al final de la caída):
 * quien espera es un link, y cada milisegundo cuenta contra el bloqueo de
 * ventanas emergentes.
 */

const VIOLETA = "167, 139, 250"; // #A78BFA
const DURACION = 1100;
const AVISO = 420;

type Shard = {
  poly: [number, number][];
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  vr: number;
};

export function shatter(card: HTMLElement, img: HTMLImageElement, clientX: number, clientY: number) {
  return new Promise<void>((resolve) => {
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const rect = card.getBoundingClientRect();
    const rot = (Number(gsap.getProperty(card, "rotation")) * Math.PI) / 180;
    const scale = Number(gsap.getProperty(card, "scale")) || 1;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    /* El toque, llevado a coordenadas de la tarjeta sin girar. */
    const dx = clientX - cx;
    const dy = clientY - cy;
    const px = (dx * Math.cos(-rot) - dy * Math.sin(-rot)) / scale + w / 2;
    const py = (dx * Math.sin(-rot) + dy * Math.cos(-rot)) / scale + h / 2;

    /* Más puntos cerca del impacto: pedazos chicos donde pega, grandes en
       los bordes, como un vidrio de verdad. */
    const puntos: [number, number][] = [[px, py]];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() ** 1.6 * Math.max(w, h) * 0.45;
      puntos.push([px + Math.cos(a) * r, py + Math.sin(a) * r]);
    }
    for (let i = 0; i < 18; i++) puntos.push([Math.random() * w, Math.random() * h]);

    const voronoi = Delaunay.from(puntos).voronoi([0, 0, w, h]);
    const shards: Shard[] = [];
    for (const poly of voronoi.cellPolygons()) {
      const pts = poly.slice(0, -1) as [number, number][];
      const sx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const sy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const ang = Math.atan2(sy - py, sx - px);
      const cerca = 1 - Math.min(1, Math.hypot(sx - px, sy - py) / Math.max(w, h));
      const fuerza = 4 + cerca * 12 + Math.random() * 4;
      shards.push({
        poly: pts,
        cx: sx,
        cy: sy,
        vx: Math.cos(ang) * fuerza,
        vy: Math.sin(ang) * fuerza - 3,
        vr: (Math.random() - 0.5) * 0.25,
      });
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "60",
      pointerEvents: "none",
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      resolve();
      return;
    }

    card.classList.add("is-rota");

    const inicio = performance.now();
    let avisado = false;
    let raf = 0;

    const cuadro = (ahora: number) => {
      const t = ahora - inicio;
      const k = t / 16.7;
      const vida = Math.max(0, 1 - t / DURACION);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      /* El destello del impacto: un círculo violeta que se abre y se apaga. */
      if (t < 260) {
        const f = t / 260;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        const g = ctx.createRadialGradient(px - w / 2, py - h / 2, 0, px - w / 2, py - h / 2, 40 + f * 160);
        g.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - f)})`);
        g.addColorStop(0.35, `rgba(${VIOLETA},${0.6 * (1 - f)})`);
        g.addColorStop(1, `rgba(${VIOLETA},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(-w, -h, w * 2, h * 2);
        ctx.restore();
      }

      for (const s of shards) {
        const ox = s.vx * k;
        const oy = s.vy * k + 0.28 * k * k;
        ctx.save();
        ctx.globalAlpha = vida;
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.translate(s.cx - w / 2 + ox, s.cy - h / 2 + oy);
        ctx.rotate(s.vr * k);
        ctx.translate(-s.cx, -s.cy);

        ctx.beginPath();
        s.poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();

        ctx.save();
        ctx.clip();
        ctx.drawImage(img, 0, 0, w, h);
        /* Reflejo de vidrio sobre cada pedazo. */
        ctx.fillStyle = `rgba(${VIOLETA},0.12)`;
        ctx.fill();
        ctx.restore();

        ctx.shadowColor = `rgba(${VIOLETA},0.9)`;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(${VIOLETA},${0.95 * vida})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      if (!avisado && t >= AVISO) {
        avisado = true;
        resolve();
      }

      if (t < DURACION) {
        raf = requestAnimationFrame(cuadro);
      } else {
        cancelAnimationFrame(raf);
        canvas.remove();
        /* La tarjeta vuelve para quien regresa de Instagram. */
        card.classList.remove("is-rota");
        if (!avisado) resolve();
      }
    };

    raf = requestAnimationFrame(cuadro);
  });
}
