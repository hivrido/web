"use client";

import { ListIcon } from "./PosterCard";
import { useMyList } from "./library";

/** "Mi lista" de la ficha: la página es de servidor, el botón no. */
export default function ListButton({ id }: { id: string }) {
  const { has, toggle } = useMyList();
  const saved = has(id);
  return (
    <button type="button" className="hp-btn is-ghost" onClick={() => toggle(id)} aria-pressed={saved}>
      <ListIcon saved={saved} />
      {saved ? "En mi lista" : "Mi lista"}
    </button>
  );
}
