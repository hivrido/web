/**
 * HIVRIDO — Logo animado, port vanilla del LogoAnimated de la home.
 *
 * Misma coreografía: los trazos se dibujan letra por letra, un barrido
 * dorado cruza el logotipo y los contornos ceden a los rellenos. Acá corre
 * con Web Animations API en lugar de GSAP: cero dependencias.
 */

const PATHS = [
  // H
  'M115.658,46.084c8.6-0.677,17.202-1.33,25.805-1.958c-1.436,13.317-2.872,26.635-4.308,39.952c18.88-1.378,37.767-2.642,56.659-3.789c1.543-17.17,3.086-34.341,4.629-51.511c9.19-7.179,18.326-14.33,27.406-21.454c-3.205,39.312-6.41,78.623-9.616,117.935c-8.867,0.488-17.734,1.001-26.599,1.54c0.796-8.859,1.592-17.718,2.388-26.577c-19.012,1.154-38.019,2.426-57.019,3.813c-1.375,12.745-2.749,25.489-4.123,38.234c-9.593,7.3-19.24,14.629-28.941,21.987C106.512,124.865,111.085,85.475,115.658,46.084z',
  // Í
  'M235.985,106.044c1.72-22.702,3.44-45.404,5.161-68.106c8.612-0.44,17.224-0.856,25.837-1.249c-1.977,29.317-3.954,58.634-5.931,87.951C252.641,118.419,244.285,112.221,235.985,106.044z',
  // V
  'M280.553,36.093c9.324-0.396,18.648-0.764,27.974-1.104c11.198,18.361,22.621,36.762,34.269,55.207c13.232-19.151,26.242-38.246,39.028-57.287c9.345-0.19,18.69-0.353,28.037-0.486c-22.267,33.456-45.229,67.073-68.881,100.868C320.138,100.76,299.996,68.365,280.553,36.093z',
  // R
  'M417.351,130.068c0.593-32.589,1.185-65.179,1.778-97.768c30.168-0.369,60.34-0.44,90.51-0.213c2.902,1.126,5.807,2.255,8.715,3.386c2.907,2.236,5.821,4.475,8.741,6.717c1.478,2.238,2.959,4.476,4.443,6.715c0.16,8.836,0.321,17.672,0.481,26.508c-1.416,2.191-2.835,4.383-4.257,6.575c-2.883,2.176-5.772,4.355-8.667,6.536c-2.927,1.077-5.856,2.156-8.79,3.238c-4.394-0.033-8.786-0.06-13.18-0.081c11.793,8.89,23.686,17.825,35.677,26.805c-11.83-0.145-23.661-0.245-35.492-0.3c-11.876-8.891-23.654-17.736-35.333-26.538c-5.858,0.017-11.716,0.044-17.574,0.083c-0.189,19.32-0.378,38.641-0.567,57.962C434.952,143.127,426.124,136.585,417.351,130.068z M505.718,71.853c-0.065-6.626-0.13-13.253-0.194-19.879c-20.244-0.133-40.488-0.133-60.731,0c-0.065,6.626-0.13,13.253-0.195,19.879C464.971,71.719,485.345,71.719,505.718,71.853z',
  // I
  'M550.753,100.542c-0.543-22.663-1.087-45.325-1.63-67.987c8.619,0.139,17.238,0.302,25.856,0.49c0.948,29.282,1.896,58.564,2.844,87.846C568.745,114.082,559.722,107.299,550.753,100.542z',
  // D
  'M596.155,119.688c-1.097-28.74-2.193-57.479-3.29-86.219c30.163,0.775,60.32,1.848,90.467,3.219c2.962,1.237,5.927,2.478,8.895,3.72c3.03,2.349,6.065,4.701,9.107,7.056c1.603,2.296,3.207,4.592,4.815,6.89c1.317,17.703,2.634,35.406,3.951,53.108c-1.304,2.139-2.609,4.279-3.919,6.419c-2.78,2.067-5.566,4.138-8.359,6.21c-2.888,0.966-5.777,1.934-8.671,2.905C658.161,121.588,627.161,120.485,596.155,119.688z M683.411,102.891c-1.022-15.484-2.045-30.968-3.067-46.452c-20.229-0.9-40.462-1.668-60.698-2.302c0.72,15.472,1.439,30.944,2.159,46.417C642.343,101.198,662.879,101.977,683.411,102.891z',
  // O
  'M751.832,126.266c-3.046-1.281-6.09-2.559-9.13-3.833c-3.134-2.382-6.262-4.76-9.384-7.136c-1.65-2.294-3.299-4.588-4.943-6.881c-1.419-17.708-2.839-35.416-4.258-53.125c1.265-2.147,2.525-4.295,3.783-6.442c2.699-2.055,5.392-4.108,8.078-6.159c2.78-0.943,5.557-1.884,8.33-2.823c22.957,1.351,45.906,2.875,68.846,4.571c3.005,1.322,6.012,2.647,9.022,3.975c3.118,2.436,6.243,4.875,9.374,7.318c1.694,2.343,3.392,4.687,5.092,7.031c2.061,17.75,4.122,35.501,6.183,53.252c-1.208,2.104-2.42,4.207-3.635,6.312c-2.683,1.99-5.373,3.982-8.069,5.977c-2.836,0.885-5.676,1.771-8.519,2.661C799.021,129.221,775.43,127.655,751.832,126.266z M816.03,110.684c-1.674-15.522-3.348-31.044-5.021-46.566c-20.204-1.475-40.414-2.817-60.631-4.025c1.372,15.502,2.743,31.004,4.114,46.506C775.011,107.825,795.524,109.187,816.03,110.684z',
];

const VIEWBOX = '0 0 964.874 202.005';
const ASPECT = 964.874 / 202.005;

/* Medidas del logotipo, para quien lo quiera dibujar fuera de un SVG —las
   texturas de las tarjetas lo pintan en canvas con Path2D—. */
export const BRAND_W = 964.874;
export const BRAND_H = 202.005;
export { PATHS as BRAND_PATHS };
const EASE_INOUT = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';
const NS = 'http://www.w3.org/2000/svg';

let uid = 0;

/**
 * Monta el logo en `holder` y arranca la animación de dibujo tras `delay` ms.
 * @returns {SVGSVGElement}
 */
export function mountLogo(holder, {
  delay = 200,
  height = 44,
  accent = '#C9A84C',
  accentBright = '#DCB95A',
  speed = 1,
} = {}) {
  /* Un solo número gobierna el ritmo de toda la coreografía. El preloader la
     acelera: mientras dura, la pantalla está tapada, y cada milisegundo ahí
     es un milisegundo sin contenido. La secuencia se ve entera igual —trazo,
     barrido, rellenos—, solo que en menos tiempo. */
  const t = (ms) => Math.round(ms / speed);
  const id = `hv${uid++}`;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', VIEWBOX);
  svg.setAttribute('width', String(height * ASPECT));
  svg.setAttribute('height', String(height));
  svg.setAttribute('aria-label', 'HIVRIDO');
  svg.style.cssText = 'display:block;overflow:visible';

  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = `
    <linearGradient id="${id}-sweep" x1="0" y1="0" x2="964.874" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accentBright}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="${id}-glow">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
  svg.appendChild(defs);

  const strokes = PATHS.map((d) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', accent);
    p.setAttribute('stroke-opacity', '0.9');
    p.setAttribute('stroke-width', '1.5');
    p.setAttribute('filter', `url(#${id}-glow)`);
    svg.appendChild(p);
    return p;
  });

  const fills = PATHS.map((d) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', '#f0f0f0');
    p.style.opacity = '0';
    svg.appendChild(p);
    return p;
  });

  const sweep = document.createElementNS(NS, 'rect');
  sweep.setAttribute('x', '0');
  sweep.setAttribute('y', '0');
  sweep.setAttribute('width', '100');
  sweep.setAttribute('height', '202.005');
  sweep.setAttribute('fill', `url(#${id}-sweep)`);
  sweep.style.cssText = 'opacity:0;pointer-events:none';
  svg.appendChild(sweep);

  holder.appendChild(svg);

  // Los trazos arrancan "sin dibujar": el dasharray se mide ya montado
  strokes.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(len);
  });

  setTimeout(() => {
    // 1 · Cada letra se dibuja con un pequeño desfase
    strokes.forEach((p, i) => {
      p.animate(
        [{ strokeDashoffset: p.style.strokeDashoffset }, { strokeDashoffset: '0' }],
        { duration: t(550), delay: t(i * 130), easing: EASE_INOUT, fill: 'forwards' }
      );
    });

    // 2 · Barrido dorado que cruza el logotipo
    sweep.animate(
      [
        { transform: 'translateX(-100px)', opacity: 1 },
        { transform: 'translateX(780px)', opacity: 0 },
      ],
      { duration: t(1100), delay: t(100), easing: EASE_INOUT, fill: 'forwards' }
    );

    // 3 · Los contornos ceden a los rellenos
    strokes.forEach((p, i) => {
      p.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: t(350), delay: t(930 + i * 50), easing: 'ease-in', fill: 'forwards',
      });
    });
    fills.forEach((p, i) => {
      p.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: t(450), delay: t(980 + i * 50), easing: 'ease-out', fill: 'forwards',
      });
    });
  }, t(delay));

  // Glow dorado al pasar el mouse, como en la home
  svg.addEventListener('mouseenter', () => {
    svg.style.transition = 'filter 0.35s ease';
    svg.style.filter = `drop-shadow(0 0 14px ${accent}66)`;
  });
  svg.addEventListener('mouseleave', () => {
    svg.style.transition = 'filter 0.5s ease';
    svg.style.filter = 'none';
  });

  return svg;
}
