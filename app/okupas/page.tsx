import { notFound } from "next/navigation";
import PlayHeader from "../components/play/PlayHeader";
import PlayFooter from "../components/play/PlayFooter";
import TitleView, { type Episode } from "../components/play/TitleView";
import { playFonts } from "../components/play/fonts";
import { CATALOG, relatedTo } from "../lib/catalog";
import "../components/play/play.css";
import "../play/[id]/title.css";

/* Okupas es la única obra con episodios, por eso tiene su propia ruta. La
   ficha es la misma de todo PLAY: los créditos salen del catálogo y acá solo
   se suman los episodios. La metadata vive en layout.tsx. */

const ep = (n: number, desc: string, ytId: string, extra?: Partial<Episode>): Episode => ({
  ytId,
  title: `Episodio ${n}`,
  desc,
  thumb: `/images/okupas/capitulo${n}.jpg`,
  ...extra,
});

const EPISODES: Episode[] = [
  ep(1, "El grupo llega al edificio abandonado y establece las primeras reglas de convivencia.", "6pxSoN26UDs"),
  ep(2, "Las tensiones internas aumentan mientras enfrentan la presión del exterior.", "tP0EMkKOuNM"),
  ep(3, "Un nuevo personaje irrumpe en la dinámica del grupo y cambia el equilibrio.", "lJY392hdbfM"),
  ep(4, "La convivencia se complica cuando los recursos empiezan a escasear.", "AgJD7oK9UYY"),
  ep(5, "Un conflicto estalla y pone en riesgo todo lo que construyeron juntos.", "mw2X3nzA39Y"),
  ep(6, "Decisiones difíciles en un punto de inflexión para todos los habitantes.", "6OZOZa-rhTM", { noEmbed: true }),
  ep(7, "El grupo debe enfrentar consecuencias inesperadas de sus actos anteriores.", "r3w2LXmq0iM"),
  ep(8, "Una traición interna sacude las bases del grupo y redefine las alianzas.", "Hw0QgHAezpM"),
  ep(9, "La situación llega a un punto crítico con una amenaza que no pueden ignorar.", "YTrww1j7IYw"),
  ep(10, "Todo se precipita hacia un desenlace inevitable en medio del caos.", "y71lMCObIBs"),
  ep(11, "El final que cierra una historia brutal, honesta y única del cine argentino.", "ofLGs2OmbBI"),
  ep(12, "Los actores de Okupas recuerdan el rodaje, los personajes y el impacto de la serie.", "ueXybISsCk8", {
    title: "Contada por sus protagonistas",
    special: true,
  }),
];

export default function OkupasPage() {
  const t = CATALOG.find((x) => x.id === "okupas");
  if (!t) notFound();
  return (
    <div className={`mp-app hp tv ${playFonts}`} style={{ "--tp-accent": "#7C3AED" } as React.CSSProperties}>
      <PlayHeader />
      <main>
        <TitleView t={t} episodes={EPISODES} related={relatedTo(t)} />
      </main>
      <PlayFooter />
    </div>
  );
}
