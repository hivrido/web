"use client";
import Link from "next/link";
import LogoAnimated from "../components/ui/LogoAnimated";
import FollowFest from "../components/sections/FollowFest";

export default function FollowFestPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Top bar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        padding: "0 clamp(20px, 4vw, 48px)",
        height: "64px",
        background: "rgba(0,0,0,.75)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}>
        {/* Back */}
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,.45)", fontSize: "11px", fontWeight: 700,
            letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none",
            transition: "color .2s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.85)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.45)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>

        {/* Logo centrado */}
        <Link href="/" style={{ display: "flex", justifyContent: "center" }}>
          <LogoAnimated height={28} delay={400} />
        </Link>

        {/* Badge derecha */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF1B8D", display: "block", animation: "ff-pulse 2s ease infinite" }} />
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".14em", color: "#FF1B8D", textTransform: "uppercase" }}>
            9 Mayo
          </span>
        </div>
      </header>

      <style>{`
        @keyframes ff-pulse {
          0%, 100% { box-shadow: 0 0 6px #FF1B8D; }
          50% { box-shadow: 0 0 14px #FF1B8D, 0 0 24px rgba(255,27,141,.4); }
        }
      `}</style>

      {/* Offset for fixed header */}
      <div style={{ paddingTop: "64px" }}>
        <FollowFest />
      </div>
    </div>
  );
}
