"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const EVENT_DATE = new Date("2026-05-09T23:00:00-03:00");

function useCountdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE.getTime() - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// Lightweight canvas particle system
function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#FF1B8D", "#B645D6", "#7B61FF", "#00D9FF", "#ffffff"];
    type P = { x: number; y: number; size: number; vy: number; vx: number; op: number; dop: number; color: string };
    const pts: P[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.18,
      op: Math.random(),
      dop: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.y += p.vy; p.x += p.vx;
        p.op += p.dop;
        if (p.op <= 0 || p.op >= 1) p.dop *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.op)) * 0.45;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity: 0.7,
    }} />
  );
}

const GRAD = "linear-gradient(135deg, #FF1B8D, #B645D6, #7B61FF, #00D9FF)";
const CTA_URL = "https://www.passline.com/eventos/follow-fest-507267";

const FEATURES = [
  { icon: "🎧", title: "DJ Sets en vivo", desc: "Música que define la noche y el ambiente." },
  { icon: "🍸", title: "Tragos de autor", desc: "Cocktails exclusivos para la experiencia." },
  { icon: "✨", title: "Stand de glitter", desc: "Brillá para la cámara. Brillá para todos." },
  { icon: "📸", title: "Content spots", desc: "Espacios diseñados para crear contenido viral." },
  { icon: "🌊", title: "Vista a la piscina", desc: "Pool vibes toda la noche, en Adrogué." },
  { icon: "🔥", title: "Ambiente viral", desc: "Social, estético y con energía de red." },
];

const STATS = [
  { value: "+10K", label: "VIEWS en una noche" },
  { value: "+1K", label: "SEGUIDORES potenciales" },
  { value: "∞", label: "CONTENIDO que posiciona" },
];

const GALLERY = [
  {
    label: "Poolside vibes",
    caption: "Vista a la piscina toda la noche",
    gradient: "linear-gradient(160deg, #040d1a 0%, #081a2e 40%, #0a1228 100%)",
    glow: "rgba(0,217,255,.18)",
    accent: "#00D9FF",
    emoji: "🌊",
    deco: "water",
  },
  {
    label: "DJ Booth",
    caption: "@robert_venittelli en vivo",
    gradient: "linear-gradient(160deg, #100522 0%, #1e0840 50%, #0a0015 100%)",
    glow: "rgba(182,69,214,.18)",
    accent: "#B645D6",
    emoji: "🎧",
    deco: "sound",
  },
  {
    label: "Glitter Station",
    caption: "Brillá para la cámara",
    gradient: "linear-gradient(160deg, #200714 0%, #3a0a20 50%, #100005 100%)",
    glow: "rgba(255,27,141,.18)",
    accent: "#FF1B8D",
    emoji: "✨",
    deco: "glitter",
  },
  {
    label: "Content Spots",
    caption: "Cada rincón fue diseñado para viralizar",
    gradient: "linear-gradient(160deg, #080a20 0%, #10144a 50%, #050710 100%)",
    glow: "rgba(123,97,255,.18)",
    accent: "#7B61FF",
    emoji: "📸",
    deco: "grid",
  },
  {
    label: "Bar de autor",
    caption: "Tragos que acompañan la experiencia",
    gradient: "linear-gradient(160deg, #150520 0%, #280840 50%, #080010 100%)",
    glow: "rgba(233,30,140,.18)",
    accent: "#E91E8C",
    emoji: "🍸",
    deco: "circles",
  },
];

const INFO = [
  { icon: "📍", label: "Ubicación", value: "Adrogué, Buenos Aires", sub: "Revelada con tu entrada" },
  { icon: "📅", label: "Fecha", value: "Sábado 9 de Mayo", sub: "2026" },
  { icon: "🕐", label: "Hora", value: "23:00 hs", sub: "Puntual" },
  { icon: "🎵", label: "DJ Resident", value: "@robert_venittelli", sub: "Sets en vivo", url: "https://www.instagram.com/robert_venittelli/" },
];

const ORGANIZERS = [
  { handle: "@lucasmanzano", url: "https://www.instagram.com/lucasmanzano/" },
  { handle: "@sergiopodeley", url: "https://www.instagram.com/sergiopodeley/" },
];

const TAGS = ["#FollowFest", "#Hivrido", "#CrecimientoReal", "#ContenidoViral", "#InfluencersArgentina"];

const LINEUP = [
  {
    role: "DJ Resident",
    handle: "@robert_venittelli",
    name: "Robert Venittelli",
    desc: "Sets en vivo toda la noche",
    photo: "/followfest/venitelli.jpg",
    url: "https://www.instagram.com/robert_venittelli/",
    accent: "#B645D6",
    badge: "🎧",
  },
  {
    role: "Invitado Especial",
    handle: "@art.fluo",
    name: "Art.Fluo",
    desc: "Body painting & indumentaria fluorescente",
    photo: "/followfest/artfluo.jpg",
    url: "https://www.instagram.com/art.fluo",
    accent: "#FF1B8D",
    badge: "✨",
  },
  {
    role: "Organiza",
    handle: "@lucasmanzano",
    name: "Lucas Manzano",
    desc: "CEO & Co-organizador del evento",
    photo: null,
    url: "https://www.instagram.com/lucasmanzano/",
    accent: "#7B61FF",
    badge: "⚡️",
  },
  {
    role: "Organiza",
    handle: "@sergiopodeley",
    name: "Sergio Podeley",
    desc: "Co-organizador del evento",
    photo: null,
    url: "https://www.instagram.com/sergiopodeley/",
    accent: "#00D9FF",
    badge: "⚡️",
  },
];

const FAQS = [
  {
    q: "¿Dónde es el evento?",
    a: "La ubicación exacta es secreta y se revela únicamente a quienes tengan su entrada. Está en Adrogué, Buenos Aires.",
  },
  {
    q: "¿Cómo consigo mi entrada?",
    a: "Hacé clic en el botón de entrada o contactanos por Instagram. La capacidad es limitada y los lugares se llenan rápido.",
  },
  {
    q: "¿Necesito tener muchos seguidores para ir?",
    a: "No. Follow Fest es para quien quiere crecer, no para quien ya llegó. Todos están ahí para conectar y sumar.",
  },
  {
    q: "¿Qué incluye la entrada?",
    a: "Acceso al evento, ambiente diseñado para contenido, stand de glitter, DJ en vivo, show de body painting y la energía de una comunidad creadora.",
  },
  {
    q: "¿Hay dress code?",
    a: "No hay dress code obligatorio, pero el ambiente es premium y creativo. Brillá como quieras.",
  },
  {
    q: "¿A qué hora abre?",
    a: "Las puertas abren a las 23:00 hs. El sábado 9 de Mayo en Adrogué.",
  },
];

// Decorative SVG patterns for gallery cells
function GalleryDeco({ type, accent }: { type: string; accent: string }) {
  if (type === "water") return (
    <svg style={{ position: "absolute", bottom: "30%", left: 0, right: 0, width: "100%", opacity: 0.2 }} height="60" viewBox="0 0 400 60" preserveAspectRatio="none">
      {[0, 12, 24].map((i) => (
        <path key={i} d={`M0 ${30 + i} Q100 ${20 + i} 200 ${30 + i} Q300 ${40 + i} 400 ${30 + i}`}
          fill="none" stroke={accent} strokeWidth="1" />
      ))}
    </svg>
  );
  if (type === "sound") return (
    <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.12 }} width="120" height="120" viewBox="0 0 120 120">
      {[20, 35, 50].map((r) => (
        <circle key={r} cx="60" cy="60" r={r} fill="none" stroke={accent} strokeWidth="1" />
      ))}
    </svg>
  );
  if (type === "glitter") return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} viewBox="0 0 200 200">
      {Array.from({ length: 12 }, (_, i) => {
        const x = (i % 4) * 50 + 15; const y = Math.floor(i / 4) * 65 + 20;
        return <text key={i} x={x} y={y} fontSize="12" fill={accent} textAnchor="middle">✦</text>;
      })}
    </svg>
  );
  if (type === "grid") return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }} viewBox="0 0 200 200">
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="200" y2={i * 50} stroke={accent} strokeWidth="0.5" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="200" stroke={accent} strokeWidth="0.5" />
      ))}
    </svg>
  );
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }} viewBox="0 0 200 200">
      {[30, 60, 90].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={accent} strokeWidth="0.5" strokeDasharray="4 6" />
      ))}
    </svg>
  );
}

export default function FollowFest() {
  const sectionRef = useRef<HTMLElement>(null);
  const time = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const label = section.querySelector<HTMLElement>(".ff-label");
    const hero = section.querySelector<HTMLElement>(".ff-hero");
    const cards = section.querySelectorAll<HTMLElement>(".ff-card");
    const stats = section.querySelectorAll<HTMLElement>(".ff-stat");
    const galleryItems = section.querySelectorAll<HTMLElement>(".ff-gallery-item");
    const infoItems = section.querySelectorAll<HTMLElement>(".ff-info-item");
    const finalCta = section.querySelector<HTMLElement>(".ff-final-cta");

    gsap.set([label, hero, finalCta].filter(Boolean), { opacity: 0, y: 40 });
    gsap.set([...Array.from(cards), ...Array.from(stats), ...Array.from(galleryItems), ...Array.from(infoItems)], { opacity: 0, y: 30 });

    const observe = (el: Element | null, fn: () => void) => {
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        fn(); obs.disconnect();
      }, { threshold: 0.08 });
      obs.observe(el);
      return obs;
    };

    const o0 = observe(label, () => gsap.to(label!, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }));
    const o1 = observe(hero, () => gsap.to(hero!, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.1 }));
    const o2 = observe(section.querySelector(".ff-cards-grid"), () =>
      gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.09 })
    );
    const o3 = observe(section.querySelector(".ff-stats-row"), () =>
      gsap.to(stats, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 })
    );
    const o4 = observe(section.querySelector(".ff-gallery"), () =>
      gsap.to(galleryItems, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.08 })
    );
    const o5 = observe(section.querySelector(".ff-info-grid"), () =>
      gsap.to(infoItems, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 })
    );
    const o6 = observe(finalCta, () => gsap.to(finalCta!, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }));

    return () => { [o0, o1, o2, o3, o4, o5, o6].forEach(o => o?.disconnect()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sec-followfest"
      style={{ background: "#000", padding: "120px 0 0", position: "relative", overflow: "hidden" }}
    >
      {/* Global CSS for pulse animation */}
      <style>{`
        @keyframes ff-pulse {
          0%, 100% { box-shadow: 0 0 8px #FF1B8D; }
          50% { box-shadow: 0 0 18px #FF1B8D, 0 0 32px rgba(255,27,141,.4); }
        }
        @keyframes ff-scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @media (max-width: 640px) {
          .ff-bento { grid-template-columns: 1fr 1fr !important; grid-template-rows: 160px 160px 160px !important; }
          .ff-bento-0 { grid-column: 1 / 3 !important; grid-row: 1 / 2 !important; }
          .ff-bento-1 { grid-column: 1 / 2 !important; grid-row: 2 / 3 !important; }
          .ff-bento-2 { grid-column: 2 / 3 !important; grid-row: 2 / 3 !important; }
          .ff-bento-3 { grid-column: 1 / 2 !important; grid-row: 3 / 4 !important; }
          .ff-bento-4 { grid-column: 2 / 3 !important; grid-row: 3 / 4 !important; }
        }
      `}</style>

      {/* Sparkle particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <SparkleCanvas />
      </div>

      {/* Ambient glow blobs */}
      <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "600px", background: "radial-gradient(ellipse, rgba(182,69,214,.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "25%", right: "-5%", width: "450px", height: "450px", background: "radial-gradient(ellipse, rgba(0,217,255,.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "-5%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(255,27,141,.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px" }}>

        {/* Section label */}
        <div className="ff-label" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px" }}>
          <div style={{ width: "32px", height: "1px", background: GRAD }} />
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Hivrido PRESENTA
          </span>
        </div>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div
          className="ff-hero"
          style={{
            textAlign: "center", marginBottom: "100px",
            padding: "80px clamp(24px, 5vw, 72px) 64px",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,.06)",
            background: "rgba(255,255,255,.02)",
            backdropFilter: "blur(8px)",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Gradient border */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "24px", padding: "1px",
            background: GRAD,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude",
            opacity: 0.4, pointerEvents: "none",
          }} />
          {/* Hero inner glow */}
          <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "350px", background: "radial-gradient(ellipse, rgba(182,69,214,.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Flyer + badge — bloque centrado */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
            {/* Flyer con overlay Instagram centrado */}
            <a
              href="https://www.instagram.com/p/DXxN5AQhCvO/"
              target="_blank" rel="noopener noreferrer"
              style={{ position: "relative", display: "inline-block", textDecoration: "none", borderRadius: "16px", overflow: "hidden", cursor: "pointer" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                const overlay = el.querySelector<HTMLElement>(".ff-ig-dim");
                const icon = el.querySelector<HTMLElement>(".ff-ig-icon");
                const img = el.querySelector<HTMLImageElement>("img");
                if (overlay) overlay.style.opacity = "1";
                if (icon) { icon.style.opacity = "1"; icon.style.transform = "scale(1.12)"; icon.style.filter = "drop-shadow(0 0 18px rgba(255,255,255,.6))"; }
                if (img) img.style.transform = "scale(1.04)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                const overlay = el.querySelector<HTMLElement>(".ff-ig-dim");
                const icon = el.querySelector<HTMLElement>(".ff-ig-icon");
                const img = el.querySelector<HTMLImageElement>("img");
                if (overlay) overlay.style.opacity = "0";
                if (icon) { icon.style.opacity = "0.3"; icon.style.transform = "scale(1)"; icon.style.filter = "none"; }
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src="/followfest/follow.png"
                alt="Follow Fest flyer"
                style={{ width: "clamp(260px, 55vw, 480px)", height: "auto", filter: "drop-shadow(0 0 60px rgba(182,69,214,.4)) drop-shadow(0 0 120px rgba(255,27,141,.2))", borderRadius: "16px", display: "block", transition: "transform .5s ease" }}
              />
              {/* Oscurecimiento en hover */}
              <div className="ff-ig-dim" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", opacity: 0, transition: "opacity .4s ease", pointerEvents: "none" }} />
              {/* IG icon */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
                <svg className="ff-ig-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, transition: "opacity .4s ease, transform .4s ease, filter .4s ease" }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                </svg>
              </div>
            </a>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,27,141,.10)", border: "1px solid rgba(255,27,141,.28)", borderRadius: "100px", padding: "6px 20px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF1B8D", display: "block", animation: "ff-pulse 2s ease infinite" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".15em", color: "#FF1B8D" }}>
                EVENTO ESPECIAL · 9 MAYO
              </span>
            </div>
          </div>

          <p style={{ fontSize: "clamp(.95rem, 1.8vw, 1.1rem)", color: "rgba(255,255,255,.6)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 52px" }}>
            Esto no es una fiesta más. Es una experiencia diseñada para que tus redes crezcan de verdad.
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 52px)", marginBottom: "44px" }}>
            {[{ v: pad(time.d), l: "DÍAS" }, { v: pad(time.h), l: "HORAS" }, { v: pad(time.m), l: "MIN" }, { v: pad(time.s), l: "SEG" }].map(({ v, l }, i) => (
              <div key={l} style={{ textAlign: "center", position: "relative" }}>
                {i > 0 && (
                  <span style={{ position: "absolute", left: "clamp(-14px,-2vw,-26px)", top: 0, fontSize: "clamp(1.4rem,4vw,2.8rem)", fontWeight: 900, color: "rgba(255,255,255,.18)", lineHeight: 1 }}>:</span>
                )}
                <div style={{ fontSize: "clamp(2.2rem,7vw,5rem)", fontWeight: 900, lineHeight: 1, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", minWidth: "2ch", display: "inline-block", filter: "drop-shadow(0 0 24px rgba(182,69,214,.35))" }}>{v}</div>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".2em", color: "rgba(255,255,255,.28)", marginTop: "6px" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Date */}
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".14em", color: "rgba(255,255,255,.32)", marginBottom: "40px", textTransform: "uppercase" }}>
            SÁBADO 9 DE MAYO · 23:00 HS · ADROGUÉ
          </div>

          {/* CTA */}
          <a
            href={CTA_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 48px", borderRadius: "100px", background: GRAD, color: "#fff", fontWeight: 800, fontSize: "14px", letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 0 44px rgba(182,69,214,.4), 0 0 80px rgba(182,69,214,.14)", transition: "transform .2s ease, box-shadow .2s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px) scale(1.03)"; el.style.boxShadow = "0 0 72px rgba(182,69,214,.65), 0 0 130px rgba(182,69,214,.25)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = ""; el.style.boxShadow = "0 0 44px rgba(182,69,214,.4), 0 0 80px rgba(182,69,214,.14)"; }}
          >
            ⚡️ Conseguí tu entrada
          </a>
          {/* Scroll indicator */}
          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, rgba(255,255,255,.28), transparent)" }} />
            <div style={{ fontSize: "8px", letterSpacing: ".22em", color: "rgba(255,255,255,.18)", animation: "ff-scroll-bounce 2s ease infinite" }}>SCROLL</div>
          </div>
        </div>

        {/* ── EXPERIENCE GRID ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "100px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", marginBottom: "10px" }}>
              La experiencia
            </h3>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: "14px" }}>
              Una noche pensada para conectar, crear contenido y potenciar tu presencia digital.
            </p>
          </div>

          <div className="ff-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "12px" }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="ff-card"
                style={{ padding: "30px 26px", borderRadius: "16px", border: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.02)", position: "relative", overflow: "hidden", transition: "transform .3s ease, border-color .3s ease, box-shadow .3s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.borderColor = "rgba(182,69,214,.3)"; el.style.boxShadow = "0 12px 40px rgba(182,69,214,.1)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.borderColor = "rgba(255,255,255,.06)"; el.style.boxShadow = ""; }}
              >
                <div style={{ fontSize: "26px", marginBottom: "16px", display: "inline-flex", width: "50px", height: "50px", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,.08)" }}>
                  {f.icon}
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "7px", letterSpacing: ".02em" }}>{f.title}</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "100px", padding: "64px clamp(24px,5vw,64px)", borderRadius: "20px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Top gradient line */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "1px", background: GRAD, opacity: 0.5 }} />

          <div style={{ marginBottom: "52px" }}>
            <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", marginBottom: "12px" }}>
              Qué vas a lograr
            </h3>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: "14px", lineHeight: 1.75, maxWidth: "460px", margin: "0 auto" }}>
              Si entendés el juego de las redes, sabés que el contexto lo es todo. Y esta noche está creada para eso.
            </p>
          </div>

          <div className="ff-stats-row" style={{ display: "flex", justifyContent: "center", gap: "clamp(32px,6vw,96px)", flexWrap: "wrap" }}>
            {STATS.map((s) => (
              <div key={s.label} className="ff-stat" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(2.8rem,7vw,5rem)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: 1, marginBottom: "8px", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 24px rgba(182,69,214,.3))" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", color: "rgba(255,255,255,.32)", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── GALLERY BENTO ─────────────────────────────────────────────────── */}
      <div className="ff-gallery" style={{ padding: "0 clamp(20px,3vw,40px) 100px", maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", marginBottom: "10px" }}>
            Espacios diseñados para viralizar
          </h3>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: "14px" }}>
            Cada rincón fue pensado para que tu contenido explote.
          </p>
        </div>

        {/* Bento: 3-col layout — col 0 = 2fr, col 1 = 1fr, col 2 = 1fr */}
        <div
          className="ff-bento"
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "220px 170px", gap: "10px" }}
        >
          {/* Poolside — large, full height left */}
          <div
            className="ff-gallery-item ff-bento-0"
            style={{ gridColumn: "1 / 2", gridRow: "1 / 3", borderRadius: "16px", overflow: "hidden", background: GALLERY[0].gradient, border: "1px solid rgba(255,255,255,.06)", position: "relative", transition: "transform .3s ease, box-shadow .3s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.01)"; el.style.boxShadow = `0 0 50px ${GALLERY[0].glow}`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
          >
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 80%, ${GALLERY[0].glow} 0%, transparent 60%)` }} />
            <GalleryDeco type={GALLERY[0].deco} accent={GALLERY[0].accent} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${GALLERY[0].accent}70, transparent)` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px", background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 100%)" }}>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>{GALLERY[0].emoji}</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{GALLERY[0].label}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.45)" }}>{GALLERY[0].caption}</div>
            </div>
          </div>

          {/* DJ Booth — top center */}
          <a
            href="https://www.instagram.com/robert_venittelli/"
            target="_blank" rel="noopener noreferrer"
            className="ff-gallery-item ff-bento-1"
            style={{ gridColumn: "2 / 3", gridRow: "1 / 2", borderRadius: "16px", overflow: "hidden", background: GALLERY[1].gradient, border: "1px solid rgba(255,255,255,.06)", position: "relative", transition: "transform .3s ease, box-shadow .3s ease", display: "block", textDecoration: "none" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.02)"; el.style.boxShadow = `0 0 40px ${GALLERY[1].glow}`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
          >
            {/* Real photo */}
            <img src="/followfest/venitelli.jpg" alt="DJ Robert Venittelli" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
            {/* Dark overlay to keep gradient feel */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(16,5,34,.45)" }} />
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${GALLERY[1].glow} 0%, transparent 70%)` }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${GALLERY[1].accent}70, transparent)` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px", background: "linear-gradient(to top, rgba(0,0,0,.9) 0%, transparent 100%)" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{GALLERY[1].emoji}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{GALLERY[1].label}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,.5)" }}>{GALLERY[1].caption}</div>
            </div>
          </a>

          {/* Glitter — top right */}
          <div
            className="ff-gallery-item ff-bento-2"
            style={{ gridColumn: "3 / 4", gridRow: "1 / 2", borderRadius: "16px", overflow: "hidden", background: GALLERY[2].gradient, border: "1px solid rgba(255,255,255,.06)", position: "relative", transition: "transform .3s ease, box-shadow .3s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.02)"; el.style.boxShadow = `0 0 40px ${GALLERY[2].glow}`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
          >
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${GALLERY[2].glow} 0%, transparent 70%)` }} />
            <GalleryDeco type={GALLERY[2].deco} accent={GALLERY[2].accent} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${GALLERY[2].accent}70, transparent)` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px", background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 100%)" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{GALLERY[2].emoji}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{GALLERY[2].label}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,.4)" }}>{GALLERY[2].caption}</div>
            </div>
          </div>

          {/* Content Spots — bottom center */}
          <div
            className="ff-gallery-item ff-bento-3"
            style={{ gridColumn: "2 / 3", gridRow: "2 / 3", borderRadius: "16px", overflow: "hidden", background: GALLERY[3].gradient, border: "1px solid rgba(255,255,255,.06)", position: "relative", transition: "transform .3s ease, box-shadow .3s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.02)"; el.style.boxShadow = `0 0 40px ${GALLERY[3].glow}`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
          >
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${GALLERY[3].glow} 0%, transparent 70%)` }} />
            <GalleryDeco type={GALLERY[3].deco} accent={GALLERY[3].accent} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${GALLERY[3].accent}70, transparent)` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px", background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 100%)", display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>{GALLERY[3].emoji}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{GALLERY[3].label}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.38)" }}>{GALLERY[3].caption}</div>
              </div>
            </div>
          </div>

          {/* Bar — bottom right */}
          <div
            className="ff-gallery-item ff-bento-4"
            style={{ gridColumn: "3 / 4", gridRow: "2 / 3", borderRadius: "16px", overflow: "hidden", background: GALLERY[4].gradient, border: "1px solid rgba(255,255,255,.06)", position: "relative", transition: "transform .3s ease, box-shadow .3s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.02)"; el.style.boxShadow = `0 0 40px ${GALLERY[4].glow}`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
          >
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${GALLERY[4].glow} 0%, transparent 70%)` }} />
            <GalleryDeco type={GALLERY[4].deco} accent={GALLERY[4].accent} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${GALLERY[4].accent}70, transparent)` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px", background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 100%)", display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>{GALLERY[4].emoji}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{GALLERY[4].label}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.38)" }}>{GALLERY[4].caption}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LINEUP ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 clamp(20px,3vw,40px) 100px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", marginBottom: "10px" }}>
            Quiénes van a estar
          </h3>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: "14px" }}>
            Talento en vivo, presencias únicas y energía de red.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {LINEUP.map((person) => (
            <a
              key={person.handle}
              href={person.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "20px", overflow: "hidden", border: `1px solid ${person.accent}28`, background: "rgba(255,255,255,.02)", textDecoration: "none", display: "block", transition: "transform .3s ease, box-shadow .3s ease" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-5px)"; el.style.boxShadow = `0 16px 48px ${person.accent}22`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}
            >
              {/* Photo / Avatar */}
              <div style={{ height: "200px", background: `linear-gradient(160deg, #0a0a0a, #111)`, position: "relative", overflow: "hidden" }}>
                {person.photo ? (
                  <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px" }}>
                    {person.badge}
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 55%)` }} />
                <div style={{ position: "absolute", top: "14px", left: "14px", background: `${person.accent}22`, border: `1px solid ${person.accent}44`, borderRadius: "100px", padding: "4px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: ".14em", color: person.accent, textTransform: "uppercase" }}>
                  {person.role}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "18px 20px 22px" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", marginBottom: "3px", letterSpacing: "-.01em" }}>{person.name}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>{person.handle}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.38)", lineHeight: 1.5 }}>{person.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px" }}>

        {/* ── INFO ──────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "80px" }}>
          <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", marginBottom: "40px", textAlign: "center" }}>
            Info del evento
          </h3>

          <div className="ff-info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", borderRadius: "16px", overflow: "hidden" }}>
            {INFO.map((item) => (
              <div
                key={item.label}
                className="ff-info-item"
                style={{ padding: "32px 24px", background: "rgba(255,255,255,.025)", borderTop: "1px solid rgba(255,255,255,.05)", transition: "background .2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.025)"; }}
              >
                <div style={{ fontSize: "22px", marginBottom: "12px" }}>{item.icon}</div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", color: "rgba(255,255,255,.28)", textTransform: "uppercase", marginBottom: "6px" }}>{item.label}</div>
                <div style={{ fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 700, marginBottom: "4px" }}>
                  {"url" in item ? (
                    <a href={(item as typeof item & { url: string }).url} target="_blank" rel="noopener noreferrer" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none", fontWeight: 700 }}>
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ color: "#fff" }}>{item.value}</span>
                  )}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.28)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Organizers */}
          <div style={{ marginTop: "12px", textAlign: "center", padding: "22px 32px", background: "rgba(255,255,255,.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,.05)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".15em", color: "rgba(255,255,255,.3)", textTransform: "uppercase" }}>Organizan:</span>{" "}
            {ORGANIZERS.map(({ handle, url }) => (
              <a key={handle} href={url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", fontSize: "13px", fontWeight: 700, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none", margin: "0 8px", transition: "opacity .2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = ".65"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                {handle}
              </a>
            ))}
          </div>

          {/* Invitado especial — art.fluo */}
          <div style={{ marginTop: "40px", padding: "28px 32px", borderRadius: "16px", border: "1px solid rgba(255,27,141,.2)", background: "rgba(255,27,141,.04)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "1px", background: "linear-gradient(to right, transparent, #FF1B8D80, transparent)" }} />
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", justifyContent: "center" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,27,141,.12)", border: "1px solid rgba(255,27,141,.3)", borderRadius: "100px", padding: "4px 14px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px" }}>✨</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".18em", color: "#FF1B8D", textTransform: "uppercase" }}>Invitado Especial</span>
                </div>
                <div style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-.02em", marginBottom: "6px" }}>
                  <a href="https://www.instagram.com/art.fluo" target="_blank" rel="noopener noreferrer"
                    style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
                    @art.fluo
                  </a>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,.45)", lineHeight: 1.6, maxWidth: "380px" }}>
                  Show en vivo de <strong style={{ color: "rgba(255,255,255,.7)" }}>Body Painting</strong> y{" "}
                  <strong style={{ color: "rgba(255,255,255,.7)" }}>pintura de indumentaria fluorescente</strong>.
                  Una performance visual única que eleva el ambiente al siguiente nivel.
                </p>
              </div>
              <div style={{ flexShrink: 0, width: "clamp(90px,14vw,130px)", height: "clamp(90px,14vw,130px)", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,27,141,.35)", boxShadow: "0 0 32px rgba(255,27,141,.35), 0 0 64px rgba(182,69,214,.2)" }}>
                <img src="/followfest/artfluo.jpg" alt="art.fluo" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
            </div>
          </div>

          {/* Sponsors / Colaboradores */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".22em", color: "rgba(255,255,255,.2)", textTransform: "uppercase", marginBottom: "16px" }}>
              Colaboran
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: "clamp(12px,3vw,24px)", flexWrap: "wrap" }}>
              {/* 420 — La Barra */}
              <a href="https://www.instagram.com/4barra2music0" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "16px 28px", background: "rgba(255,255,255,.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,.06)", textDecoration: "none", transition: "border-color .2s ease, background .2s ease, transform .2s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,200,50,.25)"; el.style.background = "rgba(255,200,50,.05)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,.06)"; el.style.background = "rgba(255,255,255,.03)"; el.style.transform = ""; }}
              >
                <img src="/followfest/420.png" alt="420 Tendencia" style={{ height: "56px", width: "auto", objectFit: "contain", filter: "brightness(1.15)" }} />
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".14em", color: "rgba(255,200,50,.65)", textTransform: "uppercase" }}>La Barra</span>
              </a>

              {/* Universo Coffee */}
              <a href="https://www.instagram.com/universocoffee.ar" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "16px 28px", background: "rgba(255,255,255,.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,.06)", textDecoration: "none", transition: "border-color .2s ease, background .2s ease, transform .2s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,.18)"; el.style.background = "rgba(255,255,255,.06)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,.06)"; el.style.background = "rgba(255,255,255,.03)"; el.style.transform = ""; }}
              >
                <img src="/followfest/cofee.png" alt="Universo Coffee" style={{ height: "56px", width: "auto", objectFit: "contain", filter: "invert(1) brightness(0.85)" }} />
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".14em", color: "rgba(255,255,255,.35)", textTransform: "uppercase" }}>Universo Coffee</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "80px" }}>
          <h3 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", marginBottom: "40px", textAlign: "center" }}>
            Preguntas frecuentes
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ borderRadius: "14px", border: `1px solid ${openFaq === i ? "rgba(182,69,214,.3)" : "rgba(255,255,255,.06)"}`, background: openFaq === i ? "rgba(182,69,214,.06)" : "rgba(255,255,255,.02)", overflow: "hidden", transition: "border-color .25s ease, background .25s ease" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "22px 28px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontSize: "clamp(13px,1.5vw,15px)", fontWeight: 700, color: openFaq === i ? "#fff" : "rgba(255,255,255,.75)", lineHeight: 1.4, transition: "color .2s ease" }}>{faq.q}</span>
                  <span style={{ fontSize: "18px", color: openFaq === i ? "#B645D6" : "rgba(255,255,255,.3)", flexShrink: 0, transition: "color .2s ease, transform .25s ease", display: "inline-block", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 28px 22px", fontSize: "14px", color: "rgba(255,255,255,.5)", lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
        <div
          className="ff-final-cta"
          style={{ textAlign: "center", padding: "80px clamp(24px,5vw,64px) 120px", borderTop: "1px solid rgba(255,255,255,.05)", position: "relative" }}
        >
          {/* Bottom ambient glow */}
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(182,69,214,.08) 0%, transparent 70%)", pointerEvents: "none" }} />

          <p style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 900, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.05, marginBottom: "4px" }}>
            FOLLOW FEST no se explica.
          </p>
          <p style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 900, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-.03em", lineHeight: 1.05, marginBottom: "52px" }}>
            Se vive 💗
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", alignItems: "center" }}>
            <a
              href={CTA_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "20px 56px", borderRadius: "100px", background: GRAD, color: "#fff", fontWeight: 800, fontSize: "15px", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 0 64px rgba(182,69,214,.5), 0 0 130px rgba(182,69,214,.2)", transition: "transform .2s ease, box-shadow .2s ease" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-3px) scale(1.04)"; el.style.boxShadow = "0 0 100px rgba(182,69,214,.75), 0 0 180px rgba(182,69,214,.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = ""; el.style.boxShadow = "0 0 64px rgba(182,69,214,.5), 0 0 130px rgba(182,69,214,.2)"; }}
            >
              ⚡️ Asegurar mi lugar
            </a>
            <a
              href="https://wa.me/5491154960104?text=Hola!%20Quiero%20info%20sobre%20Follow%20Fest%20%F0%9F%8E%89"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "20px 36px", borderRadius: "100px", background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.35)", color: "#25D366", fontWeight: 700, fontSize: "14px", letterSpacing: ".04em", textDecoration: "none", transition: "transform .2s ease, background .2s ease, border-color .2s ease" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.background = "rgba(37,211,102,.18)"; el.style.borderColor = "rgba(37,211,102,.55)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = ""; el.style.background = "rgba(37,211,102,.1)"; el.style.borderColor = "rgba(37,211,102,.35)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Consultar por WhatsApp
            </a>
          </div>
          <p style={{ marginTop: "14px", fontSize: "11px", color: "rgba(255,255,255,.24)", letterSpacing: ".06em" }}>
            Ubicación secreta revelada con tu entrada
          </p>

          <div style={{ marginTop: "44px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {TAGS.map((tag) => (
              <span key={tag} style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".06em", color: "rgba(255,255,255,.2)", padding: "4px 12px", border: "1px solid rgba(255,255,255,.07)", borderRadius: "100px" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
