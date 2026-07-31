"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import CountUp from "../ui/CountUp";
import GlitchText from "../ui/GlitchText";
import MagneticBtn from "../ui/MagneticBtn";

const STATS = [
  { end: 2316, prefix: "+", suffix: "",      label: "Proyectos realizados" },
  { end: 80,  prefix: "+", suffix: "",      label: "Artistas colaboradores" },
  { end: 50,  prefix: "+", suffix: "",      label: "Marcas asociadas" },
  { end: 21,  prefix: "+", suffix: "",      label: "Trayectoria" },
];

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  /* ── Stagger reveal for stat items ── */
  useEffect(() => {
    const grid = statsRef.current;
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll<HTMLElement>(".stat-item"));
    if (!items.length) return;

    const rect = grid.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    items.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(30px)"; });

    const show = () => {
      import("gsap").then(({ gsap }) => {
        gsap.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.1, clearProps: "transform" });
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { show(); observer.unobserve(grid); }
    }, { threshold: 0.1 });
    observer.observe(grid);

    const fb = setTimeout(() => {
      items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    }, 1500);
    return () => { observer.disconnect(); clearTimeout(fb); };
  }, []);

  /* ── Parallax on about image ── */
  useEffect(() => {
    const wrap = imgWrapRef.current;
    if (!wrap) return;
    const img = wrap.querySelector("img");
    if (!img) return;

    let st: { kill: () => void } | null = null;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        st = ScrollTrigger.create({
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            gsap.set(img, { y: `${self.progress * -8}%` });
          },
        });
      }
    );

    return () => { st?.kill(); };
  }, []);

  return (
    <>
      <section id="sec3" className="about-section section">
        <div className="container">
          <div className="section-num">03</div>

          <ScrollReveal>
            <div className="section-title">
              <GlitchText text="LA IDENTIDAD" tag="h2" />
              <p>Somos el puente entre el arte y la estrategia.</p>
            </div>
          </ScrollReveal>

          <div className="about-grid">
            <ScrollReveal>
              <h2 className="about-headline">
                No seguimos tendencias,
                <span>las creamos</span>
              </h2>
              <p>
                El proyecto está impulsado por dos perfiles opuestos complementarios que le dan forma a nuestra manera de crear.
              </p>
              <p>
                Sergio Podeley aporta una mirada enfocada en la dirección de actores y en la construcción de personajes naturalistas, buscando que lo emocional esté siempre presente en cada pieza.
              </p>
              <p>
                Lucas impulsa la capa estratégica y tecnológica de Hivrido, creando plataformas de inteligencia artificial que amplifican la creatividad y la convierten en sistemas de crecimiento. Su trabajo transforma el contenido en una estructura viva, automatizada y diseñada para escalar.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <MagneticBtn href="#sec3" className="btn-violet">Nuestros servicios</MagneticBtn>
                <MagneticBtn href="#sec4" className="btn-outline">Ver proyectos</MagneticBtn>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15} from="right">
              <div className="about-img-wrap" ref={imgWrapRef}>
                <Image
                  src="/images/bg/21.jpg"
                  alt="Hívrida — Arte y Cultura"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", transform: "scale(1.12)", transformOrigin: "center" }}
                />
                <div className="about-img-badge">
                  <p>&ldquo;La creatividad no tiene límites cuando el arte y la estrategia trabajan juntas.&rdquo;</p>
                  <h4>Fundadores</h4>
                  <h5>Hívrida Studio</h5>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[1, 2].map((_, rep) => (
            <span key={rep} className="ticker-text">{"ARTE "}<span>{"·"}</span>{" CULTURA "}<span>{"·"}</span>{" MÚSICA "}<span>{"·"}</span>{" PERFORMANCE "}<span>{"·"}</span>{" BRANDING "}<span>{"·"}</span>{" EXPERIENCIAS "}<span>{"·"}</span>{" COLABORACIONES "}<span>{"·"}</span>{" EVENTOS "}<span>{"·"}</span></span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="stats-section section">
        <div className="container">
          <div ref={statsRef} className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">
                  <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
