"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { shatter } from "./shatter";
import "./card-fan.css";

/**
 * Tarjetas en abanico.
 *
 * Hasta siete se abren alrededor de la del medio; con más, el abanico gira y
 * aparecen flechas. Al pasar el mouse la tarjeta sube y empuja a las vecinas.
 * En pantalla táctil no hay hover: el primer toque la levanta y muestra el
 * botón, el segundo —sobre el botón— lleva al post. Así un dedo que solo
 * quería mirar no termina en Instagram.
 */

export type FanCard = {
  img: string;
  alt: string;
  href?: string;
  /** Cifra del post ("386 K vistas"). */
  dato?: string;
};

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

/* Cuánto se abre el abanico según el ancho. Va de la mano de los tamaños de
   tarjeta de card-fan.css: si cambia uno, cambia el otro. */
function anchoMult(w: number) {
  if (w < 480) return 0.28;
  if (w < 640) return 0.38;
  if (w < 768) return 0.5;
  if (w < 1024) return 0.75;
  return 1;
}

/* En pantallas bajas se achatan los desplazamientos verticales para que el
   abanico entre en el 70% del alto. */
function altoMult(w: number) {
  const ideal = (w < 480 ? 22 : w < 640 ? 26 : w < 768 ? 28 : w < 1024 ? 34 : 38) * 16;
  const disponible = window.innerHeight * 0.7;
  return disponible >= ideal ? 1 : disponible / ideal;
}

function slotConfig(total: number, slot: number) {
  if (total >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = total >> 1;
  const d = total > 1 ? (slot - center) / center : 0;
  const a = Math.abs(d);
  return {
    rot: d * 21,
    scale: 1 - 0.2244 * a * a,
    x: d * 30,
    y: a * a * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

function IconoInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function CardFanCarousel({ cards, etiqueta = "Ver en Instagram" }: { cards: FanCard[]; etiqueta?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const total = cards.length;
  const paginado = total > MAX_VISIBLE;
  const [centro, setCentro] = useState(paginado ? HALF : total >> 1);
  /* La tarjeta levantada por toque. En desktop manda el hover. */
  const [activa, setActiva] = useState<number | null>(null);

  const visibles = useCallback(
    (c: number) => {
      const map = new Map<number, number>();
      if (!paginado) {
        for (let i = 0; i < total; i++) map.set(i, i);
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((c + slot - HALF) % total) + total) % total, slot);
      }
      return map;
    },
    [total, paginado],
  );

  const girar = useCallback(
    (dir: "left" | "right") => {
      if (isAnimating.current || !paginado) return;
      isAnimating.current = true;
      directionRef.current = dir;
      setActiva(null);
      setCentro((p) => (dir === "right" ? (p + 1) % total : (p - 1 + total) % total));
    },
    [total, paginado],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !total) return;
    const els = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!els.length) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const map = visibles(centro);
    const antes = prevVisible.current;
    const dir = directionRef.current;
    const primera = !hasEntered.current;
    const mult = anchoMult(window.innerWidth);
    const hM = altoMult(window.innerWidth);
    const slots = paginado ? MAX_VISIBLE : total;
    const config = (slot: number) => slotConfig(slots, slot);

    if (primera) isAnimating.current = true;

    let hechas = 0;
    const alTerminar = () => {
      if (++hechas >= map.size) {
        isAnimating.current = false;
        if (primera) hasEntered.current = true;
      }
    };

    els.forEach((card, i) => {
      const slot = map.get(i);
      const estaba = antes.has(i);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = { x: `${x * mult}rem`, y: `${y * hM}rem`, rotation: rot, scale, opacity: 1, zIndex };

        if (quieto) {
          gsap.set(card, target);
          alTerminar();
        } else if (primera) {
          gsap.set(card, { x: 0, y: `${12 * hM}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: alTerminar });
        } else if (!estaba) {
          const dx = dir === "right" ? 40 : -40;
          gsap.set(card, { x: `${dx}rem`, y: `${y * hM}rem`, rotation: dir === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: alTerminar });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: alTerminar });
        }
      } else if (estaba) {
        const dx = dir === "right" ? -40 : 40;
        gsap.to(card, { x: `${dx}rem`, opacity: 0, scale: 0.5, rotation: dir === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (primera) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(map.keys());

    const entradas: { el: HTMLElement; slot: number }[] = [];
    els.forEach((el, i) => {
      const slot = map.get(i);
      if (slot !== undefined) entradas.push({ el, slot });
    });
    entradas.sort((a, b) => a.slot - b.slot);

    let slotActivo: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const centroSlot = entradas.length >> 1;

    const acomodar = (hover: number | null) => {
      const m = anchoMult(window.innerWidth);
      const h = altoMult(window.innerWidth);

      entradas.forEach(({ el, slot }) => {
        const base = config(slot);
        let x = base.x * m;
        let y = base.y * h;
        let rot = base.rot;
        let scale = base.scale;
        let delay = 0;

        if (hover !== null) {
          const dist = Math.abs(slot - hover);
          delay = dist * 0.02;
          if (slot === hover) {
            y -= 2.5 * h;
            scale *= 1.08;
          } else {
            const norm = centroSlot > 0 ? (slot - centroSlot) / centroSlot : 0;
            const empuje = 8 * (1 - Math.abs(norm)) * (1 + 0.2 * Math.max(0, 3 - dist));
            if (slot < hover) {
              x -= empuje * m;
              rot -= 3 / (dist + 1);
            } else {
              x += empuje * m;
              rot += 3 / (dist + 1);
            }
            if (slot === entradas.length - 1 && hover < centroSlot) y -= h;
            if (slot === 0 && hover > centroSlot) y -= h;
          }
        } else {
          delay = Math.abs(slot - centroSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${x}rem`,
          y: `${y}rem`,
          rotation: rot,
          scale,
          duration: quieto ? 0 : 0.5,
          delay: quieto ? 0 : delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        /* La levantada pasa adelante de todas: si no, el botón de una
           tarjeta lateral queda tapado por la del medio. */
        gsap.set(el, { zIndex: slot === hover ? 20 : base.zIndex });
      });
    };

    const alEntrar = (slot: number) => {
      if (isAnimating.current) return;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (slotActivo !== slot) {
        slotActivo = slot;
        acomodar(slot);
      }
    };

    /* Enter y focus comparten la lógica: con teclado el Tab levanta la
       tarjeta igual que el mouse. */
    const handlers = entradas.map(({ el, slot }) => {
      const h = () => alEntrar(slot);
      el.addEventListener("mouseenter", h);
      el.addEventListener("focusin", h);
      return { el, h };
    });

    const alSalir = () => {
      if (isAnimating.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        slotActivo = null;
        setActiva(null);
        acomodar(null);
      }, 50);
    };
    container.addEventListener("mouseleave", alSalir);
    const alPerderFoco = (e: FocusEvent) => {
      if (!container.contains(e.relatedTarget as Node)) alSalir();
    };
    container.addEventListener("focusout", alPerderFoco);

    const onResize = () => {
      if (!isAnimating.current) acomodar(slotActivo);
    };
    window.addEventListener("resize", onResize);

    return () => {
      handlers.forEach(({ el, h }) => {
        el.removeEventListener("mouseenter", h);
        el.removeEventListener("focusin", h);
      });
      container.removeEventListener("mouseleave", alSalir);
      container.removeEventListener("focusout", alPerderFoco);
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, [centro, total, visibles, paginado]);

  /* Al desmontar, ningún tween queda escribiendo sobre nodos muertos. */
  useEffect(() => {
    const container = containerRef.current;
    return () => {
      if (container) gsap.killTweensOf(container.querySelectorAll(".fan-card"));
    };
  }, []);

  /* Un toque: la foto estalla y se abre el post. Con Ctrl/Cmd o el botón del
     medio el navegador ya sabe qué hacer, y con movimiento reducido no hay
     vidrio que romper: en esos casos el link sigue solo. */
  const rompiendo = useRef(false);
  const romperYAbrir = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.stopPropagation();
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const card = e.currentTarget.closest<HTMLElement>(".fan-card");
    const img = card?.querySelector("img");
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!card || !img?.complete || quieto) {
      /* Sin efecto: si el toque vino del link, el navegador lo sigue solo. */
      if (e.currentTarget.tagName !== "A") window.location.assign(href);
      return;
    }
    e.preventDefault();
    if (rompiendo.current) return;
    rompiendo.current = true;
    /* Después del estallido se navega en esta pestaña. Una pestaña nueva
       abierta con demora es una ventana emergente para el navegador: unos la
       bloquean callados y el navegador interno de Instagram —donde vive el
       link de la bio— devuelve una ventana que no hace nada. En el celular,
       además, así el link lo toma la app de Instagram. */
    shatter(card, img, e.clientX, e.clientY).then(() => {
      rompiendo.current = false;
      window.location.assign(href);
    });
  };

  if (!total) return null;

  const flecha = (dir: "left" | "right") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <div className="fan">
      <div ref={containerRef} className="fan-layout">
        {cards.map((card, i) => (
          <div
            key={card.img}
            className={`fan-card${activa === i ? " is-activa" : ""}`}
            onClick={(e) => {
              /* Con mouse la foto entera es el link. En táctil el primer
                 toque solo la levanta y muestra el botón. */
              if (card.href && window.matchMedia("(hover: hover)").matches) romperYAbrir(e, card.href);
              else setActiva(i);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ya viene a 720px desde el preprocesado; next/image no suma nada con `unoptimized` */}
            <img src={card.img} alt={card.alt} width={720} height={1080} loading="lazy" decoding="async" />
            <div className="fan-velo" aria-hidden />
            {card.dato && <span className="fan-dato">{card.dato}</span>}
            {card.href && (
              <a
                className="fan-ig"
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={card.dato ? `${etiqueta} · ${card.dato}` : etiqueta}
                onClick={(e) => romperYAbrir(e, card.href!)}
              >
                <IconoInstagram />
                <span>{etiqueta}</span>
              </a>
            )}
          </div>
        ))}
      </div>

      {paginado && (
        <div className="fan-nav">
          <button type="button" onClick={() => girar("left")} aria-label="Anterior">
            {flecha("left")}
          </button>
          <div className="fan-puntos" aria-hidden>
            {cards.map((c, i) => (
              <span key={c.img} className={i === centro ? "is-actual" : undefined} />
            ))}
          </div>
          <button type="button" onClick={() => girar("right")} aria-label="Siguiente">
            {flecha("right")}
          </button>
        </div>
      )}
    </div>
  );
}
