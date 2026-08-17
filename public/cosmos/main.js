/**
 * HIVRIDO — COSMOS · Orquestación
 *
 * Compone las texturas, arranca el anillo 3D y conecta toda la UI.
 * El motor no sabe nada del DOM; se comunica por callbacks.
 */

import { PROJECTS } from './projects.js';
import { makeCardTexture, makePlayTexture, waitForFonts } from './cards.js';
import { createScene } from './scene.js';
import { mountLogo } from './brand.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

const el = {
  boot: $('boot'), bootFill: $('bootFill'), bootPct: $('bootPct'),
  bootLogo: $('bootLogo'), bootTagline: $('bootTagline'), logoHolder: $('logoHolder'),
  overlay: $('navOverlay'),
  canvas: $('gl'), hud: $('hud'), hint: $('hint'),
  cat: $('cat'), title: $('title'), counter: $('counter'), ticks: $('ticks'),
  prev: $('prevBtn'), next: $('nextBtn'), open: $('openBtn'),
  panel: $('panel'), close: $('closeBtn'),
  pIndex: $('pIndex'), pTitle: $('pTitle'), pClient: $('pClient'),
  pYear: $('pYear'), pCat: $('pCat'), pBody: $('pBody'), pTags: $('pTags'),
  pWatch: $('pWatch'), pWatchLabel: $('pWatchLabel'),
  pMeta: $('pMeta'), pAsk: $('pAsk'), pAskLabel: $('pAskLabel'),
  menuBtn: $('menuBtn'), menuLabel: $('menuLabel'), menu: $('menu'),
  qlist: $('qlist'), live: $('live'),
};

const TOTAL = PROJECTS.length;
const pad = (n) => String(n).padStart(2, '0');

/* El carrusel arranca en NEBULA, no en el primero de la lista. Por id y no
   por número: si los proyectos se reordenan, el arranque sigue siendo el
   correcto o cae al 0 sin romperse. */
const START = Math.max(0, PROJECTS.findIndex((p) => p.id === 'nebula'));

let ring = null;
let active = START;
let panelOpen = false;

/* ═══════════ Marcas de posición ═══════════ */

PROJECTS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'tick';
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-current', String(i === START));
  b.setAttribute('aria-label', p.title);
  b.addEventListener('click', () => ring?.goTo(i));
  el.ticks.appendChild(b);
});
const tickEls = [...el.ticks.children];

/* ═══════════ Lista de disciplinas (-> estilo terminal) ═══════════ */

const shortLabel = (cat) => cat.split('·')[0].trim();

PROJECTS.forEach((p, i) => {
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'qitem';
  b.setAttribute('aria-current', String(i === START));
  b.innerHTML = `<span aria-hidden="true">-&gt;</span> ${shortLabel(p.category)}`;
  b.addEventListener('click', () => ring?.goTo(i));
  li.appendChild(b);
  el.qlist.appendChild(li);
});
const qEls = [...el.qlist.querySelectorAll('.qitem')];

/* ═══════════ Proyecto activo ═══════════ */

function paint(i) {
  const p = PROJECTS[i];
  document.documentElement.style.setProperty('--ac', p.accent);

  el.cat.textContent = `${p.index} — ${p.category.toUpperCase()}`;
  el.title.textContent = p.title;
  el.title.classList.toggle('is-epic', Boolean(p.gradientTitle));
  el.counter.innerHTML = `<b class="text-white">${pad(i + 1)}</b> / ${pad(TOTAL)}`;
  tickEls.forEach((t, j) => t.setAttribute('aria-current', String(j === i)));
  qEls.forEach((q, j) => q.setAttribute('aria-current', String(j === i)));

  el.live.textContent = `Proyecto ${i + 1} de ${TOTAL}: ${p.title}. ${p.category}.`;
  document.title = `${p.title} — HIVRIDO Cosmos`;

  if (panelOpen) fillPanel(p);
}

/** El anillo avisa cuál quedó al frente; la tipografía sale y vuelve a entrar. */
function onActive(i) {
  if (i === active && el.title.textContent === PROJECTS[i].title) return;
  active = i;

  if (REDUCED) { paint(i); return; }

  document.body.classList.add('swapping');
  setTimeout(() => {
    paint(i);
    document.body.classList.remove('swapping');
  }, 300);
}

/* ═══════════ Panel de detalle ═══════════ */

const WA_URL = 'https://wa.me/5491156072460';

function fillPanel(p) {
  el.pIndex.textContent = p.index;
  el.pTitle.textContent = p.title;
  el.pBody.textContent = p.body;
  el.pTags.innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join('');

  /* Ficha técnica solo donde significa algo: una pieza hecha para alguien.
     En los servicios propios —sin `client`— cliente, año y disciplina no
     dicen nada y el bloque se retira entero. */
  if (p.client) {
    el.pClient.textContent = p.client;
    el.pYear.textContent = p.year;
    el.pCat.textContent = p.category;
    el.pMeta.hidden = false;
  } else {
    el.pMeta.hidden = true;
  }

  // El proyecto puede desviar el link del pie a su propia sección del sitio
  el.pAskLabel.textContent = p.link?.label ?? 'Consultar por este proyecto';
  el.pAsk.href = p.link?.href ?? WA_URL;
  if (p.link) {
    el.pAsk.removeAttribute('target');
    el.pAsk.removeAttribute('rel');
  } else {
    el.pAsk.target = '_blank';
    el.pAsk.rel = 'noopener';
  }

  // Solo los proyectos con algo publicado que ver ofrecen el CTA (el mismo
  // `href` que enciende la pastilla PLAY en la tarjeta).
  if (p.href) {
    el.pWatch.href = p.href;
    el.pWatchLabel.textContent = p.cta ?? 'Ver el proyecto';
    el.pWatch.hidden = false;
  } else {
    el.pWatch.hidden = true;
    el.pWatch.removeAttribute('href');
  }
}

function setPanel(open) {
  panelOpen = open;
  el.panel.classList.toggle('open', open);
  el.panel.setAttribute('aria-hidden', String(!open));
  ring?.setOpen(open);
  if (open) {
    fillPanel(PROJECTS[active]);
    el.close.focus({ preventScroll: true });
  } else {
    el.open.focus({ preventScroll: true });
  }
}

el.open.addEventListener('click', () => setPanel(true));
el.close.addEventListener('click', () => setPanel(false));

/* ═══════════ Navegación ═══════════ */

el.prev.addEventListener('click', () => ring?.step(-1));
el.next.addEventListener('click', () => ring?.step(1));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (el.menu.classList.contains('open')) { setMenu(false); el.menuBtn.focus(); return; }
    if (panelOpen) { setPanel(false); return; }
  }
  if (el.menu.classList.contains('open')) return;

  if (e.key === 'ArrowRight') { e.preventDefault(); ring?.step(1); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); ring?.step(-1); }
  if (e.key === 'Enter' && !panelOpen && document.activeElement === document.body) setPanel(true);
});

/* ═══════════ Menú drawer (el de la home) ═══════════ */

function setMenu(open) {
  // El panel se apila por encima del header, así que un drawer abierto detrás
  // de él quedaría medio tapado: se cierra antes de abrir el menú.
  if (open && panelOpen) setPanel(false);
  el.menuBtn.classList.toggle('open', open);
  el.menuBtn.setAttribute('aria-expanded', String(open));
  el.menu.classList.toggle('open', open);
  el.overlay.classList.toggle('open', open);
  el.menuLabel.textContent = open ? 'Cerrar' : 'Menu';
  if (open) el.menu.querySelector('a').focus({ preventScroll: true });
}

el.menuBtn.addEventListener('click', () =>
  setMenu(el.menuBtn.getAttribute('aria-expanded') !== 'true')
);
el.menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
el.overlay.addEventListener('click', () => setMenu(false));

/* Scramble al pasar por los links, como en la home */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
el.menu.querySelectorAll('.nav-menu a').forEach((a) => {
  const lbl = a.querySelector('.lbl');
  const num = a.querySelector('span');
  if (!lbl) return;
  const label = lbl.textContent;
  let raf = null;

  a.addEventListener('mouseenter', () => {
    if (num) num.style.color = 'var(--gold)';
    let iteration = 0;
    const speed = 2.5;
    if (raf) cancelAnimationFrame(raf);
    const step = () => {
      lbl.textContent = label.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < iteration / speed) return label[i];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');
      if (iteration < label.length * speed) {
        iteration++;
        raf = requestAnimationFrame(step);
      } else {
        lbl.textContent = label;
      }
    };
    raf = requestAnimationFrame(step);
  });

  a.addEventListener('mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    lbl.textContent = label;
    if (num) num.style.color = '';
  });
});

/* ═══════════ Boot: preloader de la home con progreso real ═══════════ */

// El logo se dibuja mientras carga, como en la home
mountLogo(el.bootLogo, { delay: 200, height: 70 });

/* La coreografía del logo dura ~1.9s desde el mount: delay de 200, trazos
   letra a letra, barrido dorado y rellenos. En móvil las texturas son más
   chicas y suelen venir de caché, así que la carga real termina antes que el
   dibujo — sin un piso, el loader se retira con el logo a medias. El piso
   solo demora la salida: la barra llega a 100 apenas la carga termina. */
const BOOT_MIN = 2050;
const bootT0 = performance.now();

let booted = false;
function setProgress(v) {
  el.bootFill.style.width = v + '%';
  el.bootPct.textContent = Math.round(v) + '%';
  if (v >= 40) el.bootTagline.classList.add('visible');
}
function finishBoot() {
  if (booted) return;
  booted = true;
  setProgress(100);
  const left = Math.max(0, BOOT_MIN - (performance.now() - bootT0));
  setTimeout(() => {
    el.boot.classList.add('done');
    document.body.classList.add('live');
    // El logo del header arranca cuando el preloader se retira
    mountLogo(el.logoHolder, { delay: 350, height: 44 });
  }, left);
}
setTimeout(finishBoot, 12000);   // failsafe: nunca quedar trabado en el loader

/* ═══════════ Arranque ═══════════ */

(async () => {
  await waitForFonts();
  setProgress(8);

  // Las texturas se componen en serie para poder reportar avance real
  const textures = [];
  for (let i = 0; i < TOTAL; i++) {
    textures.push(await makeCardTexture(PROJECTS[i]));
    setProgress(8 + ((i + 1) / TOTAL) * 82);
  }

  // Se compone después de las fuentes: el PLAY es tipografía, no imagen
  const playTex = PROJECTS.some((p) => p.href) ? makePlayTexture() : null;

  // El encuadre 3D centra la tarjeta en el espacio libre entre header y HUD
  const headerEl = document.querySelector('.main-header');
  const footEl = $('hudFoot');

  try {
    ring = await createScene(el.canvas, {
      textures,
      // Una sola textura de PLAY compartida: es idéntica en todas las tarjetas
      plays: PROJECTS.some((p) => p.href)
        ? PROJECTS.map((p) => (p.href ? playTex : null))
        : null,
      accents: PROJECTS.map((p) => p.accent),
      onActive,
      onSelect: () => setPanel(true),
      onPlay: (i) => {
        const href = PROJECTS[i]?.href;
        if (href) location.href = href;
      },
      insets: () => ({
        top: headerEl?.offsetHeight ?? 0,
        bottom: footEl?.offsetHeight ?? 0,
      }),
      start: START,
    });
  } catch (err) {
    console.warn('[cosmos] el anillo 3D no pudo iniciarse:', err);
  }

  paint(START);

  if (ring?.supported) {
    // La pista se retira al primer gesto, o sola si nadie toca nada
    const dismiss = () => el.hint.classList.add('gone');
    el.canvas.addEventListener('pointerdown', dismiss, { once: true });
    addEventListener('wheel', dismiss, { once: true, passive: true });
    setTimeout(dismiss, 10000);
  } else {
    el.hint.classList.add('gone');
  }

  finishBoot();
})();
