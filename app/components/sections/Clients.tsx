"use client";
import Image from "next/image";
import { useRef } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import GlitchText from "../ui/GlitchText";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";

const CLIENTS = [
  { src: "/images/clients/1.svg", alt: "Logo de partner colaborador" },
  { src: "/images/clients/2.svg", alt: "Logo de marca asociada" },
  { src: "/images/clients/4.svg", alt: "Logo de cliente destacado" },
  { src: "/images/clients/5.svg", alt: "Logo de aliado estratégico" },
];

export default function Clients() {
  const logosRef = useRef<HTMLDivElement>(null);

  useStaggerReveal(logosRef, { selector: ".client-logo", stagger: 0.07 });

  return (
    <section id="sec6" className="clients-section section">
      <div className="container">
        <div className="section-num">06</div>

        <ScrollReveal>
          <div className="section-title">
            <GlitchText text="PARTNERS" tag="h2" />
            <p>Marcas que eligieron hacer las cosas de manera diferente.</p>
          </div>
        </ScrollReveal>

        <div ref={logosRef} className="clients-logos">
          {CLIENTS.map((c, i) => (
            <div key={i} className="client-logo">
              <Image src={c.src} alt={c.alt} width={100} height={40}
                style={{ objectFit: "contain" }} unoptimized />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
