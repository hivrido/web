"use client";
import Link from "next/link";

const GRAD = "linear-gradient(135deg, #FF1B8D, #B645D6, #7B61FF, #00D9FF)";
const WA_URL = "https://wa.me/5491154960104?text=Hola!%20Quiero%20info%20sobre%20Follow%20Fest%20%F0%9F%8E%89";
const TICKET_URL = "https://www.passline.com/eventos/follow-fest-507267";

export default function FollowFestCTA() {
  return (
    <section
      id="sec-followfest"
      style={{ background: "#000", padding: "100px 0", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @keyframes ff-cta-pulse {
          0%, 100% { box-shadow: 0 0 8px #FF1B8D; }
          50% { box-shadow: 0 0 18px #FF1B8D, 0 0 32px rgba(255,27,141,.4); }
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(182,69,214,.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "48px", justifyContent: "space-between" }}>

        {/* Left — flyer thumb + info */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px", flex: "1 1 300px" }}>
          <Link href="/followfest" style={{ flexShrink: 0, display: "block", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", boxShadow: "0 0 32px rgba(182,69,214,.2)" }}>
            <img
              src="/followfest/follow.png"
              alt="Follow Fest"
              style={{ width: "80px", height: "80px", objectFit: "cover", display: "block" }}
            />
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF1B8D", display: "block", animation: "ff-cta-pulse 2s ease infinite" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".18em", color: "#FF1B8D", textTransform: "uppercase" }}>Hivrido PRESENTA</span>
            </div>
            <div style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: "6px" }}>
              Follow Fest
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,.38)", letterSpacing: ".06em" }}>
              Sáb 9 Mayo · 23:00 hs · Adrogué
            </div>
          </div>
        </div>

        {/* Right — 3 CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <Link
            href="/followfest"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "100px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.8)", fontWeight: 700, fontSize: "13px", letterSpacing: ".05em", textDecoration: "none", transition: "background .2s ease, border-color .2s ease, color .2s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,.1)"; el.style.borderColor = "rgba(255,255,255,.25)"; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,.05)"; el.style.borderColor = "rgba(255,255,255,.12)"; el.style.color = "rgba(255,255,255,.8)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Ver el evento
          </Link>

          <a
            href={WA_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "100px", background: "rgba(37,211,102,.08)", border: "1px solid rgba(37,211,102,.28)", color: "#25D366", fontWeight: 700, fontSize: "13px", letterSpacing: ".04em", textDecoration: "none", transition: "background .2s ease, border-color .2s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(37,211,102,.16)"; el.style.borderColor = "rgba(37,211,102,.5)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(37,211,102,.08)"; el.style.borderColor = "rgba(37,211,102,.28)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Consultar
          </a>

          <a
            href={TICKET_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", borderRadius: "100px", background: GRAD, color: "#fff", fontWeight: 800, fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 0 32px rgba(182,69,214,.35)", transition: "transform .2s ease, box-shadow .2s ease" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px) scale(1.03)"; el.style.boxShadow = "0 0 56px rgba(182,69,214,.6)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 0 32px rgba(182,69,214,.35)"; }}
          >
            ⚡️ Entradas
          </a>
        </div>

      </div>
    </section>
  );
}
