"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ScrollReveal from "../ui/ScrollReveal";
import GlitchText from "../ui/GlitchText";

interface Project {
  id: string;
  num: string;
  name: string;
  cat: string;
  desc: string;
}

const PROJECTS: Project[] = [
  {
    id: "GowGLVO0KHI",
    num: "01",
    name: "El Docke",
    cat: "Trailer",
    desc: "Una historia que trasciende el barrio. Retrato cinematográfico de identidad, comunidad y territorio.",
  },
  {
    id: "OgghHzx3axk",
    num: "02",
    name: "Chamame",
    cat: "Trailer",
    desc: "La música como ritual. Un viaje audiovisual al corazón de una tradición viva.",
  },
  {
    id: "2KooNsJQsxw",
    num: "03",
    name: "SESSION ONE",
    cat: "Trailer",
    desc: "Velocidad, estética y adrenalina. Una pieza audiovisual construida para impactar.",
  },
];

export default function Portfolio() {
  const [playing, setPlaying] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => { clearTimeout(t); setMounted(false); };
  }, []);

  /* ── scroll reveal ── */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".proj-item"));
    if (!items.length) return;

    const rect = list.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    items.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(50px)"; });

    const show = () => {
      import("gsap").then(({ gsap }) => {
        gsap.to(items, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.18, clearProps: "transform" });
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { show(); observer.unobserve(list); }
    }, { threshold: 0.05 });
    observer.observe(list);

    const fb = setTimeout(() => {
      items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    }, 2000);
    return () => { observer.disconnect(); clearTimeout(fb); };
  }, []);

  const openVideo = (p: Project) => setPlaying(p);
  const closeVideo = () => setPlaying(null);

  // Sync body overflow with modal state
  useEffect(() => {
    document.body.style.overflow = playing ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeVideo(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playing]);

  const modal = mounted && playing ? createPortal(
    <div className="proj-modal" onClick={closeVideo}>
      <button className="proj-modal-close" onClick={closeVideo} aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="proj-modal-inner" onClick={(e) => e.stopPropagation()}>
        <div className="proj-modal-title-mask" />
        <iframe
          src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&controls=1&rel=0&modestbranding=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="proj-modal-iframe"
          title={playing.name}
        />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <section id="sec2" className="portfolio-section section">
        <div className="container">
          <div className="section-num">02</div>

          <ScrollReveal>
            <div className="section-title">
              <GlitchText text="PROYECTOS" tag="h2" />
              <p>Producciones que dejan huella.</p>
            </div>
          </ScrollReveal>

          <div ref={listRef} className="proj-list">
            {PROJECTS.map((p) => (
              <div key={p.id} className="proj-item">

                {/* Thumbnail */}
                <div
                  className="proj-thumb"
                  style={{ backgroundImage: `url(https://img.youtube.com/vi/${p.id}/maxresdefault.jpg)` }}
                  onClick={() => openVideo(p)}
                >
                  <div className="proj-thumb-overlay" />
                  <button className="proj-play" aria-label={`Reproducir ${p.name}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="proj-info">
                  <div className="proj-num">{p.num}</div>
                  <div className="proj-cat">{p.cat}</div>
                  <h3 className="proj-name">{p.name}</h3>
                  <p className="proj-desc">{p.desc}</p>
                  <div className="proj-actions">
                    <button className="proj-btn-play" onClick={() => openVideo(p)}>
                      Ver trailer
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {modal}
    </>
  );
}
