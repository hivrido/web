"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // Drive Lenis with a plain RAF loop — no GSAP dependency
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Lazy-load GSAP ScrollTrigger sync only after sections have loaded
    let cleanup: (() => void) | null = null;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      cleanup = () => lenis.off("scroll", onScroll);
    });

    return () => {
      cancelAnimationFrame(rafId);
      cleanup?.();
      lenis.destroy();
    };
  }, []);

  return null;
}
