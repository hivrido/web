"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlitchText from "../ui/GlitchText";

const ARTISTS = [
  {
    img: "/images/team/1.jpg",
    name: "Sergio Podeley",
    role: "CEO · Identidad Artística & Performance",
    bio: "Más de 10 años creando experiencias culturales de impacto en Argentina y Latinoamérica.",
    instagram: "https://www.instagram.com/sergiopodeley",
  },
  {
    img: "/images/team/2.jpg",
    name: "Lucas Manzano",
    role: "CEO · Visión y Estrategia",
    bio: "Prompt engineer · Creativo developer · Estratega",
    instagram: "https://instagram.com/lucasmanzano",
  },
];

export default function Artists() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".artist-card"));

    const rect = grid.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    cards.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(40px)"; });

    const show = () => {
      import("gsap").then(({ gsap }) => {
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, clearProps: "transform" });
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { show(); observer.unobserve(grid); }
    }, { threshold: 0.1 });
    observer.observe(grid);

    const fb = setTimeout(() => {
      cards.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    }, 1500);
    return () => { observer.disconnect(); clearTimeout(fb); };
  }, []);

  return (
    <section id="sec5" className="artists-section section">
      <div className="container">
        <div className="section-num">05</div>
        <ScrollReveal>
          <div className="section-title">
            <GlitchText text="EQUIPO" tag="h2" />
            <p>Detrás de las experiencias.</p>
          </div>
        </ScrollReveal>
      </div>

      <div ref={gridRef} className="artists-grid">
        {ARTISTS.map((a) => (
          <div key={a.name} className="artist-card">
            <Image
              src={a.img}
              alt={a.name}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
            <div className="artist-overlay">
              <div className="artist-bio">{a.bio}</div>
              <div className="artist-name">{a.name}</div>
              <div className="artist-role">{a.role}</div>
            </div>
            {a.instagram && (
              <div className="artist-social">
                <a href={a.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${a.name}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
