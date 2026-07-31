"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Agent {
  id: number;
  label: string;
  abbrev: string;
  headline: string;
  desc: string;
  stat: string;
  statLabel: string;
  energy: number;
  connected: string[];
}

const agents: Agent[] = [
  {
    id: 0, label: "Análisis", abbrev: "ANL",
    headline: "Inteligencia en tiempo real",
    desc: "Monitoreo continuo de mercado, competencia y audiencia. Cada señal se convierte en decisión sin intervención manual.",
    stat: "24/7", statLabel: "Monitoreo activo", energy: 96,
    connected: ["Contenido", "Ads", "SEO"],
  },
  {
    id: 1, label: "Contenido", abbrev: "CTN",
    headline: "Producción sin límite",
    desc: "Creatividades, copies y variaciones en masa a partir de datos reales. La visión es humana — la producción es de la colmena.",
    stat: "×10", statLabel: "Velocidad de producción", energy: 94,
    connected: ["Análisis", "Ads", "Ventas"],
  },
  {
    id: 2, label: "Ads", abbrev: "ADS",
    headline: "Inversión que se convierte",
    desc: "Optimización continua de campañas en Meta y Google. Segmentación, creativos y presupuesto ajustados en tiempo real.",
    stat: "ROAS+", statLabel: "Retorno medible", energy: 97,
    connected: ["Análisis", "Contenido", "CRM"],
  },
  {
    id: 3, label: "CRM", abbrev: "CRM",
    headline: "Seguimiento que no falla",
    desc: "Gestión de leads y clientes integrada. Cada interacción queda registrada y el seguimiento nunca se pierde.",
    stat: "100%", statLabel: "Cobertura de pipeline", energy: 98,
    connected: ["Ads", "SEO", "Ventas"],
  },
  {
    id: 4, label: "SEO", abbrev: "SEO",
    headline: "Visibilidad que escala",
    desc: "Posicionamiento orgánico optimizado de forma continua. Contenido, técnica y autoridad alineados sin esfuerzo manual.",
    stat: "TOP", statLabel: "Posicionamiento orgánico", energy: 95,
    connected: ["Análisis", "CRM", "Contenido"],
  },
  {
    id: 5, label: "Ventas", abbrev: "VNT",
    headline: "Pipeline en piloto automático",
    desc: "Nurturing, seguimiento y cierre automatizados. El agente trabaja 24/7 sin perder ninguna oportunidad.",
    stat: "×3", statLabel: "Conversión de leads", energy: 99,
    connected: ["Contenido", "CRM", "Ads"],
  },
];

const CX = 150;
const CY = 150;
const ORBIT_R = 106;
const HUB_R = 30;
const NODE_R = 22;
const SPEED_DEG = 11;

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * (Math.PI / 180);
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export default function OrbitalHive() {
  const [rot, setRot] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const lastRef = useRef(0);
  const pauseRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pauseRef.current = selected !== null;
    if (selected === null) lastRef.current = 0;
  }, [selected]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId = 0;
    const tick = (ts: number) => {
      if (!pauseRef.current) {
        if (lastRef.current !== 0) {
          const dt = (ts - lastRef.current) / 1000;
          if (dt < 0.1) setRot(r => r + SPEED_DEG * dt);
        }
        lastRef.current = ts;
      }
      animId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(animId);
      if (entry.isIntersecting) {
        lastRef.current = 0;
        animId = requestAnimationFrame(tick);
      }
    });
    if (wrapRef.current) observer.observe(wrapRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleNodeClick = (i: number) => setSelected(prev => (prev === i ? null : i));

  const nodePositions = agents.map((_, i) => {
    const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2 + (rot * Math.PI) / 180;
    return { x: CX + ORBIT_R * Math.cos(angle), y: CY + ORBIT_R * Math.sin(angle) };
  });

  const selectedAgent = selected !== null ? agents[selected] : null;
  const selectedPos = selected !== null ? nodePositions[selected] : null;

  return (
    <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <svg
        viewBox="0 0 300 300"
        style={{ width: "100%", maxWidth: "320px", overflow: "visible" }}
        aria-label="Colmena de agentes IA — tocá un nodo para ver cómo funciona"
        role="img"
      >
        <defs>
          <filter id="orb-glow-lg" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="orb-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="orb-hub-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,10,130,0.4)" />
            <stop offset="55%" stopColor="rgba(123,0,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,10,130,0)" />
          </radialGradient>
          <style>{`
            @keyframes orb-spin { to { transform: rotate(360deg); } }
            @keyframes orb-pulse { 0%,100%{opacity:.75} 50%{opacity:1} }
            .orb-scan { animation: orb-spin 5s linear infinite; transform-origin: ${CX}px ${CY}px; }
            .orb-hub { animation: orb-pulse 2.6s ease-in-out infinite; }
          `}</style>
        </defs>

        <circle cx={CX} cy={CY} r={ORBIT_R + 32} fill="none" stroke="rgba(255,10,130,0.04)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={ORBIT_R + 17} fill="none" stroke="rgba(255,10,130,0.07)" strokeWidth="0.5" strokeDasharray="2 9" />

        <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" stroke="rgba(255,10,130,0.2)" strokeWidth="1" strokeDasharray="4 5" />

        <circle cx={CX} cy={CY} r={52} fill="none" stroke="rgba(255,10,130,0.08)" strokeWidth="0.5" />

        <circle cx={CX} cy={CY} r={68} fill="url(#orb-hub-bg)" />

        <g className="orb-scan">
          <line x1={CX} y1={CY} x2={CX} y2={CY - ORBIT_R - 12} stroke="rgba(255,10,130,0.14)" strokeWidth="1" />
          <circle cx={CX} cy={CY - ORBIT_R - 12} r="2" fill="rgba(255,10,130,0.28)" />
        </g>

        {nodePositions.map((pos, i) => {
          const isSel = selected === i;
          const isHov = hovered === i;
          return (
            <line
              key={`line-${i}`}
              x1={CX} y1={CY} x2={pos.x} y2={pos.y}
              stroke={isSel ? "rgba(255,10,130,0.65)" : isHov ? "rgba(255,10,130,0.3)" : "rgba(255,10,130,0.1)"}
              strokeWidth={isSel ? 1.5 : 0.6}
              strokeDasharray={isSel ? undefined : "3 5"}
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          );
        })}

        {selectedPos && (
          <>
            <circle r="2.8" fill="#FF0A82" filter="url(#orb-glow-sm)">
              <animateMotion dur="0.9s" repeatCount="indefinite"
                path={`M${CX},${CY} L${selectedPos.x.toFixed(1)},${selectedPos.y.toFixed(1)}`} />
            </circle>
            <circle r="1.9" fill="rgba(255,200,240,0.9)">
              <animateMotion dur="0.9s" repeatCount="indefinite" begin="0.45s"
                path={`M${selectedPos.x.toFixed(1)},${selectedPos.y.toFixed(1)} L${CX},${CY}`} />
            </circle>
          </>
        )}

        <polygon points={hexPoints(CX, CY, HUB_R * 1.48)} fill="none" stroke="rgba(255,10,130,0.12)" strokeWidth="0.5" />
        <polygon points={hexPoints(CX, CY, HUB_R)} className="orb-hub"
          fill="rgba(255,10,130,0.22)" stroke="rgba(255,10,130,0.78)" strokeWidth="1.5"
          filter="url(#orb-glow-sm)" />
        <polygon points={hexPoints(CX, CY, HUB_R * 0.54)}
          fill="rgba(255,10,130,0.38)" stroke="rgba(255,10,130,0.95)" strokeWidth="1" />
        <text x={CX} y={CY + 0.5} textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fontFamily="monospace" fontWeight="bold"
          fill="#FFE8F4" letterSpacing="0.12em" filter="url(#orb-glow-sm)"
          style={{ pointerEvents: "none" }}>
          AI
        </text>

        {nodePositions.map((pos, i) => {
          const agent = agents[i];
          const isSel = selected === i;
          const isHov = hovered === i;
          const isActive = isSel || isHov;
          return (
            <g key={`node-${i}`}
              onClick={() => handleNodeClick(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "none" }}
            >
              <circle cx={pos.x} cy={pos.y} r={NODE_R * 2.5}
                fill={`rgba(255,10,130,${isActive ? 0.11 : 0.03})`}
                style={{ transition: "fill 0.3s" }} />
              <polygon points={hexPoints(pos.x, pos.y, NODE_R * 1.52)}
                fill="none"
                stroke={isActive ? "rgba(255,10,130,0.3)" : "rgba(255,10,130,0.06)"}
                strokeWidth="0.5"
                strokeDasharray={isActive ? undefined : "2 4"}
                style={{ transition: "stroke 0.3s" }} />
              <polygon points={hexPoints(pos.x, pos.y, NODE_R)}
                fill={isSel ? "rgba(255,10,130,0.28)" : isHov ? "rgba(255,10,130,0.15)" : "rgba(255,10,130,0.06)"}
                stroke={isActive ? "rgba(255,10,130,0.95)" : "rgba(255,10,130,0.28)"}
                strokeWidth={isSel ? 1.5 : 1}
                filter={isActive ? "url(#orb-glow-sm)" : undefined}
                style={{ transition: "fill 0.25s, stroke 0.25s" }} />
              <circle cx={pos.x} cy={pos.y} r={isActive ? 3.5 : 2.4}
                fill={isActive ? "#FF0A82" : "rgba(255,10,130,0.5)"}
                filter={isActive ? "url(#orb-glow-sm)" : undefined}
                style={{ transition: "fill 0.25s" }} />
              <text x={pos.x} y={pos.y - 1} textAnchor="middle" dominantBaseline="middle"
                fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                fill={isActive ? "rgba(255,10,130,1)" : "rgba(255,10,130,0.5)"}
                letterSpacing="0.04em"
                style={{ pointerEvents: "none", transition: "fill 0.25s" }}>
                {agent.abbrev}
              </text>
              <text x={pos.x} y={pos.y + NODE_R + 13} textAnchor="middle" dominantBaseline="middle"
                fontSize="8.5" fontFamily="'Courier New', monospace"
                fill={isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"}
                style={{ pointerEvents: "none", transition: "fill 0.25s" }}>
                {agent.label}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {selected === null && (
          <motion.p key="hint"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.5rem",
              letterSpacing: "0.22em",
              color: "rgba(240,240,240,0.2)",
              textAlign: "center",
              marginTop: "10px",
              textTransform: "uppercase",
            }}>
            Tocá un agente para ver cómo funciona
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedAgent && (
          <motion.div key={selectedAgent.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              width: "100%",
              marginTop: "20px",
              background: "linear-gradient(135deg, rgba(255,10,130,0.07) 0%, rgba(10,10,10,0.72) 100%)",
              border: "1px solid rgba(255,10,130,0.28)",
              padding: "26px 22px",
              position: "relative",
            }}>
            <span className="fx-corner fx-corner-tl" />
            <span className="fx-corner fx-corner-tr" />
            <span className="fx-corner fx-corner-bl" />
            <span className="fx-corner fx-corner-br" />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.48rem",
                letterSpacing: "0.28em",
                color: "rgba(255,10,130,0.65)",
                textTransform: "uppercase",
              }}>
                AGENTE · {selectedAgent.label}
              </span>
              <button
                onClick={() => setSelected(null)}
                aria-label="Cerrar"
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  width: "22px",
                  height: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  lineHeight: 1,
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = "rgba(255,10,130,0.5)";
                  el.style.color = "#FF0A82";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = "rgba(255,255,255,0.1)";
                  el.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                ×
              </button>
            </div>

            <h4 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.82rem, 2vw, 0.98rem)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "10px",
              lineHeight: 1.35,
            }}>
              {selectedAgent.headline}
            </h4>

            <p style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              lineHeight: 1.72,
              marginBottom: "20px",
            }}>
              {selectedAgent.desc}
            </p>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "18px", marginBottom: "20px" }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.3rem, 3vw, 1.65rem)",
                  fontWeight: 900,
                  color: "var(--violet)",
                  lineHeight: 1,
                }}>
                  {selectedAgent.stat}
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.44rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-muted)",
                  marginTop: "5px",
                  textTransform: "uppercase",
                }}>
                  {selectedAgent.statLabel}
                </div>
              </div>
              <div style={{ flex: 1, paddingTop: "3px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.48rem", letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Eficiencia
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.48rem", color: "var(--violet)" }}>
                    {selectedAgent.energy}%
                  </span>
                </div>
                <div style={{ height: "3px", background: "rgba(255,10,130,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedAgent.energy}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    style={{ height: "100%", background: "linear-gradient(90deg, #FF0A82, #7B00FF)", borderRadius: "2px" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.44rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.22)",
                textTransform: "uppercase",
                marginBottom: "9px",
              }}>
                Conectado con
              </div>
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                {selectedAgent.connected.map(name => {
                  const idx = agents.findIndex(a => a.label === name);
                  return (
                    <button
                      key={name}
                      onClick={() => idx !== -1 && setSelected(idx)}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.48rem",
                        letterSpacing: "0.1em",
                        padding: "5px 11px",
                        border: "1px solid rgba(255,10,130,0.28)",
                        color: "rgba(255,10,130,0.72)",
                        background: "rgba(255,10,130,0.04)",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        transition: "border-color 0.2s, color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "rgba(255,10,130,0.75)";
                        el.style.color = "#FF0A82";
                        el.style.background = "rgba(255,10,130,0.1)";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "rgba(255,10,130,0.28)";
                        el.style.color = "rgba(255,10,130,0.72)";
                        el.style.background = "rgba(255,10,130,0.04)";
                      }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=541156072460&text=Hola!%20Me%20interesa%20el%20agente%20de%20${encodeURIComponent(selectedAgent.label)}%20%F0%9F%9A%80`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "#FF0A82",
                color: "#fff",
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
            >
              Activar este agente →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
