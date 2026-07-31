"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function OkupasFeature() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelector<HTMLElement>(".okf-inner");
    if (!inner) return;

    const rect = inner.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      gsap.set(inner, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(inner, { opacity: 0, y: 60 });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(inner, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="sec-okupas"
      style={{
        background: "#0a0a0e",
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        pointerEvents: "none",
      }} />

      <div
        className="okf-inner"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}
      >
        {/* Label */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px", marginBottom: "48px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "1px", background: "#7C3AED" }} />
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: ".2em",
              textTransform: "uppercase", color: "#7C3AED"
            }}>
              Hivrido PLAY · Serie destacada
            </span>
          </div>

          <a
            href="/movie"
            style={{
              fontSize: "12px", fontWeight: 600, letterSpacing: ".05em",
              color: "rgba(255,255,255,.55)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "8px",
              transition: "color .25s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.55)"; }}
          >
            Ver catálogo completo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>

        {/* Main card */}
        <a
          href="/movie/okupas"
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
        >
          <div
            className="okf-card"
            style={{
              position: "relative", borderRadius: "20px", overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 0 80px rgba(124,58,237,.12), 0 40px 80px rgba(0,0,0,.6)",
              transition: "transform .4s ease, box-shadow .4s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 120px rgba(124,58,237,.22), 0 50px 100px rgba(0,0,0,.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 80px rgba(124,58,237,.12), 0 40px 80px rgba(0,0,0,.6)";
            }}
          >
            {/* Image */}
            <Image
              src="/images/okupas/okupas-home.webp"
              alt="Okupas — Serie argentina de culto sobre la vida en los márgenes"
              width={1200}
              height={525}
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ width: "100%", height: "auto", display: "block", aspectRatio: "16/7", objectFit: "cover" }}
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, rgba(10,8,20,.92) 0%, rgba(10,8,20,.6) 50%, rgba(10,8,20,.15) 100%)",
            }} />

            {/* Content */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "flex-end",
              padding: "48px 56px",
            }}>
              <div style={{ maxWidth: "520px" }}>
                {/* Badges */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <span style={{
                    background: "#7C3AED", color: "#fff",
                    fontSize: "10px", fontWeight: 800, padding: "4px 12px",
                    borderRadius: "6px", letterSpacing: ".12em", textTransform: "uppercase"
                  }}>SERIE</span>
                  <span style={{
                    background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)",
                    fontSize: "10px", fontWeight: 600, padding: "4px 12px",
                    borderRadius: "6px", letterSpacing: ".08em", border: "1px solid rgba(255,255,255,.15)"
                  }}>11 EPISODIOS</span>
                  <span style={{
                    background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)",
                    fontSize: "10px", fontWeight: 600, padding: "4px 12px",
                    borderRadius: "6px", letterSpacing: ".08em", border: "1px solid rgba(255,255,255,.15)"
                  }}>ARGENTINA · 2000</span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900,
                  color: "#fff", lineHeight: 1, letterSpacing: "-.03em",
                  marginBottom: "16px",
                  textShadow: "0 4px 40px rgba(0,0,0,.8)"
                }}>
                  OKUPAS
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: "15px", color: "rgba(255,255,255,.6)",
                  lineHeight: 1.7, marginBottom: "32px"
                }}>
                  La serie argentina que definió una generación. Drama crudo, honesto y cinematográfico
                  sobre la vida en los márgenes del conurbano bonaerense.
                </p>

                {/* CTA */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  background: "#7C3AED", color: "#fff",
                  padding: "14px 28px", borderRadius: "10px",
                  fontSize: "14px", fontWeight: 700, letterSpacing: ".04em",
                  transition: "background .2s",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Ver todos los episodios
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
