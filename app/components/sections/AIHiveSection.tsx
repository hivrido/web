"use client";

import ScrollReveal from "../ui/ScrollReveal";
import SectionTitle from "../ui/SectionTitle";
import OrbitalHive from "../ui/OrbitalHive";

const IcoNetwork = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="4" r="2.2"/>
    <circle cx="4.5" cy="19" r="2.2"/>
    <circle cx="19.5" cy="19" r="2.2"/>
    <line x1="12" y1="6.2" x2="4.5" y2="16.8"/>
    <line x1="12" y1="6.2" x2="19.5" y2="16.8"/>
    <line x1="6.7" y1="19" x2="17.3" y2="19"/>
  </svg>
);
const IcoAuto = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);
const IcoRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IcoSpark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IcoTrend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const cards = [
  {
    num: "01",
    icon: <IcoNetwork />,
    title: "Agentes que analizan",
    text: "Monitorean tu mercado, competencia y audiencia en tiempo real. Sin dashboards manuales. Sin demoras.",
  },
  {
    num: "02",
    icon: <IcoAuto />,
    title: "Agentes que ejecutan",
    text: "Automatizan tareas de alto volumen: contenido, reportes, seguimiento, actualización de sistemas y campañas. 24/7.",
  },
  {
    num: "03",
    icon: <IcoRefresh />,
    title: "Agentes que optimizan",
    text: "Cada ciclo mejora el anterior. Aprenden de los resultados y ajustan estrategia, presupuesto y mensajes automáticamente.",
  },
  {
    num: "04",
    icon: <IcoSpark />,
    title: "Producción a escala",
    text: "Generan creatividades, copies y variaciones en masa. La visión humana define la dirección — la IA produce sin límite.",
  },
  {
    num: "05",
    icon: <IcoLayers />,
    title: "Integración total",
    text: "Se conectan a tus APIs, CRM, plataformas de ads, ecommerce y canales de comunicación. Sin fricciones.",
  },
  {
    num: "06",
    icon: <IcoTrend />,
    title: "Escalado sin fricción",
    text: "La colmena crece con tu negocio. Más volumen, misma calidad. Sin contratar más equipo ni perder velocidad.",
  },
];

export default function AIHiveSection() {
  return (
    <section
      id="sec-ai-hive"
      style={{
        background: "var(--bg)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-5%",
          right: "-8%",
          width: "580px",
          height: "580px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,10,130,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "-6%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,10,130,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="section-container">

        <SectionTitle
          eyebrow="Puny · AI Agent System"
          lines={["Colmena", "de agentes"]}
        />

        <div className="aih-intro-grid">
          <ScrollReveal>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text)",
                lineHeight: 1.75,
                fontWeight: 500,
                marginBottom: "22px",
              }}
            >
              PUNY despliega colmenas de agentes IA que trabajan en paralelo —
              analizan datos, generan contenido, optimizan campañas y ejecutan
              procesos de forma autónoma, las 24 horas.
            </p>
            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--text-muted)",
                lineHeight: 1.88,
                marginBottom: "16px",
              }}
            >
              No son chatbots. Son sistemas multi-agente conectados a tus
              plataformas reales — CRM, Meta Ads, Google, ecommerce, WhatsApp —
              que actúan, aprenden y escalan sin fricción.
            </p>
            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--text-muted)",
                lineHeight: 1.88,
              }}
            >
              La dirección estratégica es humana. La ejecución es de la colmena.
              El resultado: más velocidad, menos costo operativo y crecimiento
              sostenido sin depender del volumen de tu equipo.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="aih-network-wrap" style={{ overflow: "visible" }}>
              <OrbitalHive />
            </div>
          </ScrollReveal>
        </div>

        <div className="aih-grid">
          {cards.map((card, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <div className="aih-card" style={{
                background: "linear-gradient(135deg, rgba(255,10,130,0.05) 0%, rgba(10,10,10,0.4) 100%)",
                border: "1px solid rgba(255,10,130,0.15)",
                padding: "28px 24px",
                position: "relative",
              }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div className="aih-icon-wrap" aria-hidden style={{ color: "rgba(255,10,130,0.7)" }}>
                    {card.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.52rem",
                      color: "rgba(255,10,130,0.4)",
                      letterSpacing: "0.22em",
                      fontWeight: 700,
                    }}
                  >
                    {card.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    marginBottom: "10px",
                    color: "var(--text)",
                    lineHeight: 1.45,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.75,
                  }}
                >
                  {card.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div
            style={{
              textAlign: "center",
              borderTop: "1px solid var(--border)",
              paddingTop: "70px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.1rem, 2.8vw, 1.65rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--text)",
                marginBottom: "40px",
                lineHeight: 1.45,
                textAlign: "center",
              }}
            >
              La colmena trabaja.
              <br />
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(90deg, rgba(255,10,130,0.9) 0%, rgba(255,10,130,0.9) 20%, transparent 50%, rgba(255,10,130,0.9) 80%, rgba(255,10,130,0.9) 100%)",
                  backgroundSize: "200% 100%",
                  animation: "gradientSlide 3s ease-in-out infinite",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "rgba(255,10,130,0.9)",
                }}
              >
                Tu negocio escala.
              </span>
            </p>

            <style>{`
              @keyframes gradientSlide {
                0% {
                  backgroundPosition: -200% center;
                }
                50% {
                  backgroundPosition: 200% center;
                }
                100% {
                  backgroundPosition: -200% center;
                }
              }
            `}</style>
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://api.whatsapp.com/send?phone=541156072460&text=Hola!%20Me%20interesa%20activar%20la%20colmena%20de%20agentes%20PUNY%20%F0%9F%9A%80"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #FF0A82, rgba(255,10,130,0.8))",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  border: "1px solid #FF0A82",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  textTransform: "uppercase",
                }}
              >
                Quiero evolucionar mi marca
              </a>
              <a href="#sec-fuxxia-services" style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "transparent",
                color: "var(--text)",
                fontFamily: "var(--font-display)",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                border: "1px solid rgba(255,10,130,0.4)",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.3s",
                textTransform: "uppercase",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(255,10,130,0.8)";
                e.currentTarget.style.background = "rgba(255,10,130,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,10,130,0.4)";
                e.currentTarget.style.background = "transparent";
              }}
              >
                Conocer el sistema →
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
