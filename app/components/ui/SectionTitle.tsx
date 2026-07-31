"use client";
import { useEffect, useRef } from "react";

interface Props {
  /** Etiqueta corta sobre el título (ej: "Servicios") */
  eyebrow: string;
  /** Cada string es una línea; el reveal escalona palabra por palabra */
  lines: string[];
  id?: string;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

export default function SectionTitle({ eyebrow, lines, id }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLElement>(".epic-word-inner"));
    const rule = el.querySelector<HTMLElement>(".epic-rule");
    const line = el.querySelector<HTMLElement>(".epic-eyebrow-line");
    const label = el.querySelector<HTMLElement>(".epic-eyebrow-text");
    if (!words.length) return;

    // Sin animación: estado final directo.
    if (window.matchMedia(REDUCED).matches) {
      el.classList.add("is-visible");
      return;
    }

    let ctx: { revert: () => void } | undefined;
    let observer: IntersectionObserver | undefined;

    const fallback = setTimeout(() => el.classList.add("is-visible"), 2000);

    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.set(words, { yPercent: 115 });
        gsap.set([line, rule], { scaleX: 0 });
        gsap.set(label, { opacity: 0, x: -12 });

        const play = () => {
          el.classList.add("is-visible");
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .to(line, { scaleX: 1, duration: 0.7 })
            .to(label, { opacity: 1, x: 0, duration: 0.6 }, "-=0.45")
            .to(words, { yPercent: 0, duration: 1.1, stagger: 0.09 }, "-=0.35")
            .to(rule, { scaleX: 1, duration: 0.9 }, "-=0.7");
        };

        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            clearTimeout(fallback);
            play();
            observer?.disconnect();
          },
          { threshold: 0.25 }
        );
        observer.observe(el);
      }, el);
    });

    return () => {
      clearTimeout(fallback);
      observer?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <div className="epic-title" ref={root} id={id}>
      <div className="epic-eyebrow">
        <span className="epic-eyebrow-line" aria-hidden="true" />
        <span className="epic-eyebrow-text">{eyebrow}</span>
      </div>

      <h2 className="epic-heading">
        {lines.map((text, li) => (
          <span className="epic-line" key={li}>
            {text.split(" ").map((word, wi) => (
              <span className="epic-word" key={wi}>
                <span className="epic-word-inner">{word}</span>
                {wi < text.split(" ").length - 1 ? " " : null}
              </span>
            ))}
          </span>
        ))}
      </h2>

      <span className="epic-rule" aria-hidden="true" />
    </div>
  );
}
