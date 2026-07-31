"use client";
import { useEffect, useRef } from "react";

type Tag = "div" | "li" | "section" | "article" | "span";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  from?: "bottom" | "left" | "right" | "scale";
  tag?: Tag;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  style,
  from = "bottom",
  tag: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92;

    if (inView) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Set initial hidden state via inline style
    const initTransform =
      from === "bottom" ? "translateY(50px) skewY(1.5deg)"
      : from === "left"  ? "translateX(-60px)"
      : from === "right" ? "translateX(60px)"
      :                    "scale(0.88)";

    el.style.opacity = "0";
    el.style.transform = initTransform;
    el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    observer.observe(el);

    // Safety: force visible after 1.5s
    const fallback = setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "none";
    }, 1500 + delay * 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay, from]);

  const El = Tag as React.ElementType;

  return (
    <El ref={ref} className={className} style={style}>
      {children}
    </El>
  );
}
