/**
 * HIVRIDO — COSMOS · Orquestación
 *
 * Compone las texturas, arranca el anillo 3D y conecta toda la UI.
 * El motor no sabe nada del DOM; se comunica por callbacks.
 */

import { PROJECTS } from './projects.js';
import { makeCardTexture, waitForFonts } from './cards.js';
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
  menuBtn: $('menuBtn'), menuLabel: $('menuLabel'), menu: $('menu'),
  qlist: $('qlist'), live: $('live'),
};

const TOTAL = PROJECTS.length;
const pad = (n) => String(n).padStart(2, '0');

let ring = null;
let active = 0;
let panelOpen = false;

/* ═══════════ Marcas de posición ═══════════ */

PROJECTS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'tick';
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-current', String(i === 0));
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
  b.setAttribute('aria-current', String(i === 0));
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

function fillPanel(p) {
  el.pIndex.textContent = p.index;
  el.pTitle.textContent = p.title;
  el.pClient.textContent = p.client;
  el.pYear.textContent = p.year;
  el.pCat.textContent = p.category;
  el.pBody.textContent = p.body;
  el.pTags.innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join('');
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
  el.boot.classList.add('done');
  document.body.classList.add('live');
  // El logo del header arranca cuando el preloader se retira
  mountLogo(el.logoHolder, { delay: 350, height: 44 });
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

  // El encuadre 3D centra la tarjeta en el espacio libre entre header y HUD
  const headerEl = document.querySelector('.main-header');
  const footEl = $('hudFoot');

  try {
    ring = await createScene(el.canvas, {
      textures,
      accents: PROJECTS.map((p) => p.accent),
      onActive,
      onSelect: () => setPanel(true),
      insets: () => ({
        top: headerEl?.offsetHeight ?? 0,
        bottom: footEl?.offsetHeight ?? 0,
      }),
    });
  } catch (err) {
    console.warn('[cosmos] el anillo 3D no pudo iniciarse:', err);
  }

  paint(0);

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
