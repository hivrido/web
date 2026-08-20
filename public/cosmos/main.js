/**
 * HIVRIDO — COSMOS · Orquestación
 *
 * Compone las texturas, arranca el anillo 3D y conecta toda la UI.
 * El motor no sabe nada del DOM; se comunica por callbacks.
 */

import { PROJECTS } from './projects.js';
import { preloadCardImages } from './images.js';
import { mountLogo } from './brand.js';
import { bootT0 } from './boot.js';

/* El anillo 3D se importa abajo, no acá: arrastra three, y un módulo se
   evalúa apenas se lo importa. Estático, el motor se compilaba antes de que
   este archivo corriera una línea —justo en la ventana en que el preloader
   quiere pintar su animación—, y esos cuadros se perdían. El
   <link rel="modulepreload"> del HTML lo baja igual de temprano; lo que se
   mueve es cuándo se ejecuta, no cuándo se descarga.
   `ring.js` lo genera scripts/build-cosmos-bundle.mjs a partir de cards.js y
   scene.js, con three sacudido adentro. */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

const el = {
  boot: $('boot'), bootFill: $('bootFill'), bootPct: $('bootPct'),
  logoHolder: $('logoHolder'),
  overlay: $('navOverlay'),
  canvas: $('gl'), hud: $('hud'), hint: $('hint'),
  cat: $('cat'), title: $('title'), counter: $('counter'), ticks: $('ticks'),
  prev: $('prevBtn'), next: $('nextBtn'), open: $('openBtn'),
  panel: $('panel'), close: $('closeBtn'),
  pIndex: $('pIndex'), pTitle: $('pTitle'), pClient: $('pClient'),
  pYear: $('pYear'), pCat: $('pCat'), pBody: $('pBody'), pTags: $('pTags'),
  pWatch: $('pWatch'), pWatchLabel: $('pWatchLabel'),
  pMeta: $('pMeta'),
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

  el.cat.textContent = `${p.index} — ${(p.hudCategory ?? p.category).toUpperCase()}`;
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

  /* Único destino del panel. Manda `href` —el mismo que enciende la pastilla
     PLAY en la tarjeta— y si la ficha no tiene nada publicado que ver, toma
     su `link` a la sección del sitio. Sin ninguno de los dos no hay botón:
     antes caía a un WhatsApp genérico que no decía a dónde llevaba. */
  const dest = p.href ? { label: p.cta ?? 'Ver el proyecto', href: p.href } : p.link;
  if (dest) {
    el.pWatch.href = dest.href;
    el.pWatchLabel.textContent = dest.label;
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

/* El logo ya lo montó boot.js, que corre sin esperar a three. De acá solo
   viene el instante en que arrancó: el piso de abajo se mide contra el
   comienzo real de la coreografía, no contra el momento en que main.js
   consiguió ejecutarse. */

/* La coreografía del logo dura ~1.9s desde el mount: delay de 200, trazos
   letra a letra, barrido dorado y rellenos. En móvil las texturas son más
   chicas y suelen venir de caché, así que la carga real termina antes que el
   dibujo — sin un piso, el loader se retira con el logo a medias. El piso
   solo demora la salida: la barra llega a 100 apenas la carga termina. */
const BOOT_MIN = 1250;

let booted = false;
function setProgress(v) {
  el.bootFill.style.width = v + '%';
  el.bootPct.textContent = Math.round(v) + '%';
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

/** Deja pasar dos cuadros antes de seguir.
 *  El preloader tiene una coreografía propia que pintar —el trazo del logo,
 *  la bajada que entra— y arranca en el mismo instante que esto. Sin el
 *  respiro, el hilo se llena de three y de texturas y esos cuadros no llegan
 *  a componerse: la animación se ve a saltos y el primer contenido grande
 *  tarda en aparecer. Cuesta unos 30 ms de un preloader que igual tiene piso. */
const nextPaint = () =>
  new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 0))));

(async () => {
  await nextPaint();

  /* La tipografía primero, y recién después el motor.
     El texto del preloader se pinta enseguida con la fuente de sistema y se
     rehace cuando llega Orbitron. Ese segundo pintado es el que Lighthouse
     toma como "primer contenido grande", y si el hilo está compilando three
     en ese momento, queda esperando: medía 3,4 s un texto que en pantalla
     está desde los 100 ms. Esperar acá cuesta unos milisegundos —la fuente
     va con preload y pesa 12 KiB— y no atrasa nada: el anillo igual no se
     muestra hasta que el preloader cumple su piso. */
  if (document.fonts) { try { await document.fonts.ready; } catch { /* da igual */ } }
  await nextPaint();

  // Recién acá se evalúa three, con el preloader ya asentado en pantalla
  const { makeCardTexture, makePlayTexture, waitForFonts, createScene } =
    await import('./ring.js');

  await waitForFonts();
  setProgress(8);

  /* Las fotos se piden después de las fuentes, y no antes. Son el bulto más
     grande de la carga, y lanzadas de entrada le disputaban el ancho de banda
     justo a la tipografía del preloader —que es lo único en pantalla y lo que
     define cuándo aparece el primer contenido grande—. Igual llegan sobradas:
     el preloader tiene piso y el anillo no se muestra hasta que termina. */
  preloadCardImages(PROJECTS);

  /* Las texturas se componen en serie para poder reportar avance real.
     El respiro entre una y otra no ahorra trabajo: lo reparte. Con las
     imágenes ya en caché, el `await` de adentro resuelve en microtarea y las
     ocho composiciones se fusionaban en una sola tarea larguísima; cediendo
     el hilo, cada tarjeta es su propia tarea y entremedio el navegador puede
     pintar la barra de progreso y atender un toque. */
  const yieldToBrowser = () => new Promise((r) => setTimeout(r, 0));

  const textures = [];
  for (let i = 0; i < TOTAL; i++) {
    textures.push(await makeCardTexture(PROJECTS[i]));
    setProgress(8 + ((i + 1) / TOTAL) * 82);
    await yieldToBrowser();
  }

  // Se compone después de las fuentes: el PLAY es tipografía, no imagen
  const hasPlay = PROJECTS.some((p) => p.href);
  const playTex = hasPlay ? makePlayTexture() : null;

  // El encuadre 3D centra la tarjeta en el espacio libre entre header y HUD
  const headerEl = document.querySelector('.main-header');
  const footEl = $('hudFoot');

  try {
    ring = await createScene(el.canvas, {
      textures,
      // Una sola textura compartida: es idéntica en todas las tarjetas
      plays: hasPlay ? PROJECTS.map((p) => (p.href ? playTex : null)) : null,
      accents: PROJECTS.map((p) => p.accent),
      onActive,
      onSelect: () => setPanel(true),
      onPlay: (i) => {
        const href = PROJECTS[i]?.href;
        // La demora deja ver el pulso del botón antes de irse de la página
        if (href) setTimeout(() => { location.href = href; }, 260);
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
