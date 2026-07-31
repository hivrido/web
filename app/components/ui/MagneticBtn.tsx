"use client";
import { useRef, useCallback, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  strength?: number;
  onClick?: () => void;
}

export default function MagneticBtn({
  children,
  className = "",
  href,
  strength = 0.35,
  onClick,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const animRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Animation loop using recursive RAF
  const runAnimation = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12);
      el.style.transform = `translate(${currentRef.current.x.toFixed(2)}px, ${currentRef.current.y.toFixed(2)}px)`;

      const dx = Math.abs(targetRef.current.x - currentRef.current.x);
      const dy = Math.abs(targetRef.current.y - currentRef.current.y);

      if (dx > 0.05 || dy > 0.05) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        el.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px)`;
        animRef.current = null;
      }
    };

    if (!animRef.current) {
      animRef.current = requestAnimationFrame(animate);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      targetRef.current.x = (e.clientX - rect.left - rect.width / 2) * strength;
      targetRef.current.y = (e.clientY - rect.top - rect.height / 2) * strength;
      runAnimation();
    },
    [strength, runAnimation]
  );

  const onLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
    runAnimation();
  }, [runAnimation]);

  const sharedProps = {
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    className,
  };

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} {...sharedProps}>
      {children}
    </button>
  );
}
