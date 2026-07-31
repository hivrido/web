"use client";
import Link from "next/link";
import LogoAnimated from "../components/ui/LogoAnimated";
import FollowFestForm from "../components/sections/FollowFestForm";

export default function FollowFestFormPage() {
  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Glow blobs de fondo */}
      <div style={{ position: "fixed", top: "30%", left: "-10%", width: "500px", height: "500px", background: "radial-gradient(ellipse, rgba(255,27,141,.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-5%", width: "450px", height: "450px", background: "radial-gradient(ellipse, rgba(182,69,214,.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "0%", right: "20%", width: "350px", height: "350px", background: "radial-gradient(ellipse, rgba(0,217,255,.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        padding: "0 clamp(20px, 4vw, 48px)",
        height: "64px",
        background: "rgba(13,13,13,.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}>
        <Link
          href="/followfest"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,.4)", fontSize: "11px", fontWeight: 700,
            letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none",
            transition: "color .2s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.85)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.4)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>

        <Link href="/" style={{ display: "flex", justifyContent: "center" }}>
          <LogoAnimated height={28} delay={400} />
        </Link>

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF1B8D", display: "block", animation: "ff-form-pulse 2s ease infinite" }} />
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".14em", color: "#FF1B8D", textTransform: "uppercase" }}>
            9 Mayo
          </span>
        </div>
      </header>

      <style>{`
        @keyframes ff-form-pulse {
          0%, 100% { box-shadow: 0 0 6px #FF1B8D; }
          50% { box-shadow: 0 0 14px #FF1B8D, 0 0 24px rgba(255,27,141,.4); }
        }
      `}</style>

      <div style={{ paddingTop: "64px", position: "relative", zIndex: 1 }}>
        <FollowFestForm />
      </div>
    </div>
  );
}
