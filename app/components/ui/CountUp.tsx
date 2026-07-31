"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function CountUp({ end, prefix = "", suffix = "", duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired) return;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            setFired(true);
            const obj = { val: 0 };
            gsap.to(obj, {
              val: end,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                if (el) el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
              },
            });
          },
        });
      }
    );
  }, [end, prefix, suffix, duration, fired]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
