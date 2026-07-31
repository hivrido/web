"use client";
import { useEffect, useRef, useState } from "react";
import MagneticBtn from "../ui/MagneticBtn";
import Image from "next/image";

const YT_ID = "GowGLVO0KHI";
const YT_THUMB = "/images/bg/docke.jpg";

const SLIDE = {
  eyebrow: "Arte · Cultura · Experiencias",
  title: ["Arte que", "Transforma"],
  sub: "Conectamos marcas con artistas para crear experiencias que dejan huella.",
};

export default function Hero() {
  const ytWrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [videoActivated, setVideoActivated] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  /* Text reveal — CSS animation triggered after paint */
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* YouTube Facade: defer iframe load until user interaction or 4s idle */
  useEffect(() => {
    const activateVideo = () => setVideoActivated(true);

    // Activate on scroll, click, or after 4 seconds
    const timer = setTimeout(activateVideo, 4000);
    window.addEventListener("scroll", activateVideo, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", activateVideo);
    };
  }, []);

  /* Video fade-in after iframe loads */
  useEffect(() => {
    if (!videoActivated || !iframeLoaded) return;
    const wrap = ytWrapRef.current;
    const iframe = iframeRef.current;
    if (!wrap) return;

    const sendCmd = (cmd: string) => {
      iframe?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: [] }),
        "*"
      );
    };

    const t = setTimeout(() => {
      sendCmd("playVideo");
      wrap.style.opacity = "1";
    }, 500);

    return () => clearTimeout(t);
  }, [videoActivated, iframeLoaded]);

  return (
    <section id="sec1" className="hero">

      {/* YouTube Facade — thumbnail first, iframe deferred for better LCP */}
      <div className="hero-yt-wrap">
        {/* Static thumbnail — loads immediately, great for LCP */}
        <Image
          src={YT_THUMB}
          alt=""
          fill
          sizes="100vw"
          priority
          style={{
            objectFit: "cover",
            opacity: videoActivated && iframeLoaded ? 0 : 1,
            transition: "opacity 1s ease",
          }}
        />

        {/* Iframe — deferred until scroll/timeout */}
        {videoActivated && (
          <div
            ref={ytWrapRef}
            style={{
              position: "absolute",
              inset: 0,
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&enablejsapi=1&start=139`}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="hero-yt-iframe"
              title="Hivrido"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        )}
      </div>
      <div className="hero-overlay" />

      {/* Film grain */}
      <div className="hero-grain" aria-hidden />

      {/* Decorative corner lines */}
      <div className="hero-corner hero-corner--tl" aria-hidden />
      <div className="hero-corner hero-corner--br" aria-hidden />

      {/* Metadata — top right */}
      <div className="hero-data">
        <div className="hero-data-line">
          Agencia <span>Creativa</span>
        </div>
        <div className="hero-data-line">
          Buenos Aires <span>AR</span>
        </div>
      </div>

      {/* Main content */}
      <div className={`hero-content${revealed ? " hero-revealed" : ""}`}>
        <div className="h-anim hero-eyebrow" style={{ "--anim-i": 0 } as React.CSSProperties}>
          {SLIDE.eyebrow}
        </div>
        <h1 className="hero-title">
          <span className="h-anim hero-title-line" style={{ "--anim-i": 1 } as React.CSSProperties}>
            {SLIDE.title[0]}
          </span>
          <span className="h-anim hero-title-line hero-title-accent" style={{ "--anim-i": 2 } as React.CSSProperties}>
            {SLIDE.title[1]}
          </span>
        </h1>
        <div className="h-anim" style={{ "--anim-i": 3, display: "flex", gap: 12, flexWrap: "wrap" } as React.CSSProperties}>
          <MagneticBtn href="#sec2" className="btn-violet">
            Descubrir
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </MagneticBtn>
          <MagneticBtn href="#sec4" className="btn-outline">
            Proyectos
          </MagneticBtn>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" aria-hidden>
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>

    </section>
  );
}
