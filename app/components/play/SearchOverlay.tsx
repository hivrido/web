"use client";

/**
 * Buscador de PLAY: una capa a pantalla completa sobre la página. Lo abren la
 * lupa del header, la tecla "/" y las tarjetas de género, que llegan con su
 * corte ya elegido. Busca en título, género, elenco y equipo, sin importar
 * tildes ni mayúsculas.
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CATALOG, FACETS } from "../../lib/catalog";
import PosterCard from "./PosterCard";

/* Estado compartido mínimo: quién abre el buscador no tiene por qué ser
   pariente de quien lo dibuja. */
let state: { open: boolean; facet: string } = { open: false, facet: "todo" };
const listeners = new Set<() => void>();
const set = (next: typeof state) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER_STATE = { open: false, facet: "todo" };

export const openSearch = (facet = "todo") => set({ open: true, facet });
const closeSearch = () => set({ ...state, open: false });

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const INDEX = CATALOG.map((t) => ({
  t,
  text: fold(
    [t.title, t.genre, ...(t.detail?.cast ?? []).map((c) => c.name), ...(t.detail?.crew ?? []).map((c) => c.name)].join(" "),
  ),
}));

export default function SearchOverlay() {
  const { open, facet } = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* "/" abre desde cualquier parte, salvo que se esté escribiendo en otro campo. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]");
      if (e.key === "/" && !typing && !state.open) {
        e.preventDefault();
        openSearch();
      } else if (e.key === "Escape" && state.open) closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Con la capa abierta la página de atrás no se mueve. */
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      html.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = fold(query.trim());
    const match = FACETS.find((f) => f.id === facet)?.match;
    return INDEX.filter(({ t, text }) => (!match || match(t)) && (!q || q.split(/\s+/).every((w) => text.includes(w)))).map(
      ({ t }) => t,
    );
  }, [query, facet]);

  if (!open) return null;

  return (
    <div className="hp-search" role="dialog" aria-modal="true" aria-label="Buscar en Hivrido PLAY">
      <div className="hp-search-bar">
        <svg className="hp-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input
          ref={inputRef}
          type="search"
          className="hp-search-input"
          placeholder="Títulos, géneros, actores…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar"
        />
        <button type="button" className="hp-search-close" onClick={closeSearch} aria-label="Cerrar buscador">
          <span className="hp-kbd">Esc</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="hp-search-facets" role="group" aria-label="Filtrar">
        {[{ id: "todo", label: "Todo" }, ...FACETS].map((f) => (
          <button
            key={f.id}
            type="button"
            className={`hp-chip${facet === f.id ? " is-active" : ""}`}
            aria-pressed={facet === f.id}
            onClick={() => set({ ...state, facet: f.id })}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="hp-search-count">
        {results.length ? `${String(results.length).padStart(2, "0")} títulos` : "Sin resultados. Probá con otro nombre o género."}
      </p>

      {/* Elegir una obra navega: la capa se cierra sola al cambiar de página. */}
      <div className="hp-search-grid" onClick={(e) => (e.target as HTMLElement).closest("a") && closeSearch()}>
        {results.map((t) => (
          <PosterCard key={t.id} item={t} />
        ))}
      </div>
    </div>
  );
}
