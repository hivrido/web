"use client";
import { useEffect, RefObject } from "react";

interface Options {
  selector: string;
  stagger?: number;
  duration?: number;
  y?: number;
  threshold?: number;
  fallbackDelay?: number;
}

export function useStaggerReveal(
  ref: RefObject<HTMLElement | null>,
  {
    selector,
    stagger = 0.1,
    duration = 0.8,
    y = 30,
    threshold = 0.1,
    fallbackDelay = 1500,
  }: Options
) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (!items.length) return;

    const rect = container.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    items.forEach((el) => { el.style.opacity = "0"; el.style.transform = `translateY(${y}px)`; });

    const show = () => {
      import("gsap").then(({ gsap }) => {
        gsap.to(items, { opacity: 1, y: 0, duration, ease: "power3.out", stagger, clearProps: "transform" });
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { show(); observer.unobserve(container); }
    }, { threshold });
    observer.observe(container);

    const fallback = setTimeout(() => {
      items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    }, fallbackDelay);

    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [ref, selector, stagger, duration, y, threshold, fallbackDelay]);
}
