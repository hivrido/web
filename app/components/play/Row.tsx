"use client";

/**
 * Fila deslizable. El dedo la mueve solo —es scroll nativo—; el mouse la
 * arrastra o usa las flechas, que aparecen al pasar por encima. Los bordes se
 * desvanecen solo hacia el lado en que queda contenido.
 *
 * Si hubo arrastre, el click que sigue no navega: las tarjetas son links.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export default function Row({
  id,
  title,
  note,
  children,
}: {
  id?: string;
  title: string;
  /** Rótulo en mono junto al título ("Curaduría", "Continuá"…). */
  note?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const [edges, setEdges] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const prev = el.scrollLeft > 4;
    const next = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setEdges((e) => (e.prev === prev && e.next === next ? e : { prev, next }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    drag.current = { down: true, moved: false, x: e.clientX, left: ref.current.scrollLeft };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = ref.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.x;
    // Unos píxeles de tolerancia: un click con pulso tembloroso sigue siendo click
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging"); // apaga el snap mientras se arrastra
    }
    el.scrollLeft = d.left - dx;
  };

  const end = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!drag.current.down || !el) return;
    drag.current.down = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.classList.remove("is-dragging");
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section className="hp-shelf" id={id} aria-label={title}>
      <header className="hp-shelf-head">
        <h2 className="hp-shelf-title">{title}</h2>
        {note && <span className="hp-shelf-note">{note}</span>}
      </header>
      <div className={`hp-shelf-body${edges.prev ? " can-prev" : ""}${edges.next ? " can-next" : ""}`}>
        <button type="button" className="hp-shelf-arrow is-prev" onClick={() => page(-1)} aria-label="Anteriores" tabIndex={-1}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div
          ref={ref}
          className="hp-row"
          onScroll={measure}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={end}
          onPointerCancel={end}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          {children}
        </div>
        <button type="button" className="hp-shelf-arrow is-next" onClick={() => page(1)} aria-label="Siguientes" tabIndex={-1}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </section>
  );
}
