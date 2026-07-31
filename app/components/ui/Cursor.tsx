"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const outer = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outerEl = outer.current;
    const dotEl = dot.current;
    if (!outerEl || !dotEl) return;

    // Hide default cursor
    document.documentElement.style.cursor = "none";

    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let scaleX = 1, scaleY = 1, rotation = 0;
    let prevX = 0, prevY = 0;
    let rafId = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Dot snaps instantly
      dotEl.style.transform = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`;

      // Outer follows with lag
      outerX = lerp(outerX, mouseX, 0.12);
      outerY = lerp(outerY, mouseY, 0.12);

      // Decay stretch back to 1
      scaleX = lerp(scaleX, 1, 0.1);
      scaleY = lerp(scaleY, 1, 0.1);

      outerEl.style.transform = `translate(${outerX - 16}px, ${outerY - 16}px) rotate(${rotation}deg) scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)})`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const velX = e.clientX - prevX;
      const velY = e.clientY - prevY;
      prevX = mouseX;
      prevY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      const speed = Math.sqrt(velX * velX + velY * velY);
      const stretch = Math.min(1 + speed * 0.04, 1.8);
      scaleX = stretch;
      scaleY = 1 / stretch;
      rotation = Math.atan2(velY, velX) * (180 / Math.PI);
    };

    const onEnterLink = () => {
      outerEl.style.transition = "transform 0.35s cubic-bezier(0.23,1,0.32,1)";
      outerEl.dataset.hover = "1";
    };
    const onLeaveLink = () => {
      outerEl.style.transition = "";
      delete outerEl.dataset.hover;
    };

    document.addEventListener("mousemove", onMove);

    const addHovers = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    addHovers();

    const observer = new MutationObserver(addHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={outer}
        style={{
          position: "fixed",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(167,139,250,0.6)",
          pointerEvents: "none",
          zIndex: 10000,
          top: 0,
          left: 0,
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dot}
        style={{
          position: "fixed",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#A78BFA",
          pointerEvents: "none",
          zIndex: 10001,
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      />
    </>
  );
}
