"use client";

/**
 * Tarjeta del catálogo. El afiche es el diseño: debajo no lleva texto, y el
 * título con la metadata aparecen al pasar el puntero o al enfocarla. En
 * pantallas táctiles, donde no hay hover, el título se lee debajo.
 *
 * Toda tarjeta lleva a la ficha de su obra. Los botones del hover son
 * hermanos del link, no hijos: un botón adentro de un <a> no es HTML válido.
 */

import Link from "next/link";
import NextImage from "next/image";
import type { Entry } from "../../lib/catalog";
import { useMyList } from "./library";

/** Línea de metadata en mono: tipo, año o duración, primer género. */
export function metaOf(t: Entry) {
  const parts = [t.type === "serie" ? "Serie" : "Película"];
  if (t.year) parts.push(t.year);
  else if (t.duration && t.duration !== "—") parts.push(t.duration);
  parts.push(t.genre.split("·")[0].trim());
  return parts;
}

/**
 * Un solo sistema de etiquetas: neutras salvo NUEVO (violeta) y PRONTO
 * (ámbar). "SERIE" ya no se pinta: lo dice la fila y lo dice la metadata.
 */
export function Badges({ item, hideNew }: { item: Entry; hideNew?: boolean }) {
  const list: { label: string; tone?: "accent" | "gold" }[] = [];
  if (item.badge === "NUEVA" && !item.isPlaceholder && !hideNew) list.push({ label: "Nuevo", tone: "accent" });
  if (item.badge === "PRONTO" || item.isPlaceholder) list.push({ label: "Pronto", tone: "gold" });
  if (item.detail?.advisory) list.push({ label: "+18" });
  if (!list.length) return null;
  return (
    <span className="hp-badges">
      {list.map((b) => (
        <span key={b.label} className={`hp-badge${b.tone ? ` is-${b.tone}` : ""}`}>{b.label}</span>
      ))}
    </span>
  );
}

export function ListIcon({ saved }: { saved: boolean }) {
  return saved ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
  );
}

/* Inclinación 3D hacia el puntero. Solo con mouse: en táctil no hay hover
   que la sostenga, y con movimiento reducido la tarjeta no se mueve. Escribe
   variables CSS directo en el estilo para no re-renderizar en cada píxel. */
const TILT = 8;
const VARS = ["--rx", "--ry", "--mx", "--my"];

/** El color de la obra para el borde de su ficha, como en el anillo. */
export function accentOf(t: Entry) {
  return t.hero?.color ? ({ "--card-accent": t.hero.color } as React.CSSProperties) : undefined;
}

export function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${(x - 0.5) * TILT * 2}deg`);
  el.style.setProperty("--rx", `${(0.5 - y) * TILT}deg`);
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
}

export function untilt(e: React.PointerEvent<HTMLElement>) {
  const s = e.currentTarget.style;
  VARS.forEach((p) => s.removeProperty(p));
}

export default function PosterCard({
  item,
  rank,
  progress,
  hideNew,
}: {
  item: Entry;
  /** Posición en una fila numerada. */
  rank?: number;
  /** 0–1: cuánto se vio, para "Seguir viendo". */
  progress?: number;
  hideNew?: boolean;
}) {
  const { has, toggle } = useMyList();
  const saved = has(item.id);
  const watchHref = item.ytId ? `${item.href}#trailer` : item.href;

  return (
    <article className={`hp-card${rank ? " has-rank" : ""}`}>
      {rank && <span className="hp-rank" aria-hidden="true">{rank}</span>}
      <div className="hp-card-frame" style={accentOf(item)} onPointerMove={tilt} onPointerLeave={untilt}>
        <Link href={item.href} className="hp-card-link" draggable={false} aria-label={item.title}>
          {item.poster ? (
            <NextImage
              src={item.poster}
              alt=""
              fill
              sizes="(max-width: 768px) 70vw, 340px"
              loading="lazy"
              draggable={false}
              className="hp-card-img"
            />
          ) : (
            /* Sin afiche: el título compuesto en tipografía, sobre grano. */
            <span className="hp-card-fallback" aria-hidden="true">{item.title}</span>
          )}
        </Link>

        <Badges item={item} hideNew={hideNew} />

        {progress !== undefined && (
          <span className="hp-card-progress" aria-label={`Visto ${Math.round(progress * 100)}%`}>
            <i style={{ width: `${Math.max(4, progress * 100)}%` }} />
          </span>
        )}

        <div className="hp-card-hover">
          <div className="hp-card-actions">
            <Link href={watchHref} className="hp-icon-btn is-primary" aria-label={`Ver ${item.title}`} draggable={false}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </Link>
            <button
              type="button"
              className="hp-icon-btn"
              onClick={() => toggle(item.id)}
              aria-pressed={saved}
              aria-label={saved ? `Quitar ${item.title} de Mi lista` : `Agregar ${item.title} a Mi lista`}
            >
              <ListIcon saved={saved} />
            </button>
          </div>
          <h3 className="hp-card-title">{item.title}</h3>
          <p className="hp-meta">{metaOf(item).join(" · ")}</p>
        </div>
      </div>
      <p className="hp-card-caption" aria-hidden="true">{item.title}</p>
    </article>
  );
}
