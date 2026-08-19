"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "sec1", label: "Home" },
  { id: "sec2", label: "Proyectos" },
  { id: "sec3", label: "Identidad" },
  { id: "sec4", label: "Servicios" },
  { id: "sec5", label: "Equipo" },
  { id: "sec6", label: "Partners" },
];

export default function ScrollNav() {
  const [active, setActive] = useState("sec1");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="scroll-nav">
      {SECTIONS.map((s) => (
        <div
          key={s.id}
          className={`scroll-nav-item${active === s.id ? " active" : ""}`}
          onClick={() => scrollTo(s.id)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scrollTo(s.id); } }}
          role="button"
          tabIndex={0}
          aria-label={s.label}
        >
          <span className="scroll-nav-label">{s.label}</span>
          <span className="scroll-nav-dot" />
        </div>
      ))}
      <div className="scroll-counter">
        0{SECTIONS.findIndex((s) => s.id === active) + 1}
      </div>
    </div>
  );
}
