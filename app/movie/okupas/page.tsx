"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoAnimated from "../../components/ui/LogoAnimated";

export default OkupasPageLegacy;

const EPISODES = [
  { ep: 1,  title: "Episodio 1",  desc: "El grupo llega al edificio abandonado y establece las primeras reglas de convivencia.",          ytId: "6pxSoN26UDs" },
  { ep: 2,  title: "Episodio 2",  desc: "Las tensiones internas aumentan mientras enfrentan la presión del exterior.",                    ytId: "tP0EMkKOuNM" },
  { ep: 3,  title: "Episodio 3",  desc: "Un nuevo personaje irrumpe en la dinámica del grupo y cambia el equilibrio.",                    ytId: "lJY392hdbfM" },
  { ep: 4,  title: "Episodio 4",  desc: "La convivencia se complica cuando los recursos empiezan a escasear.",                            ytId: "AgJD7oK9UYY" },
  { ep: 5,  title: "Episodio 5",  desc: "Un conflicto estalla y pone en riesgo todo lo que construyeron juntos.",                         ytId: "mw2X3nzA39Y" },
  { ep: 6,  title: "Episodio 6",  desc: "Decisiones difíciles en un punto de inflexión para todos los habitantes.",                       ytId: "6OZOZa-rhTM", noEmbed: true },
  { ep: 7,  title: "Episodio 7",  desc: "El grupo debe enfrentar consecuencias inesperadas de sus actos anteriores.",                     ytId: "r3w2LXmq0iM" },
  { ep: 8,  title: "Episodio 8",  desc: "Una traición interna sacude las bases del grupo y redefine las alianzas.",                       ytId: "Hw0QgHAezpM" },
  { ep: 9,  title: "Episodio 9",  desc: "La situación llega a un punto crítico con una amenaza que no pueden ignorar.",                   ytId: "YTrww1j7IYw" },
  { ep: 10, title: "Episodio 10", desc: "Todo se precipita hacia un desenlace inevitable en medio del caos.",                             ytId: "y71lMCObIBs" },
  { ep: 11, title: "Episodio 11",                          desc: "El final que cierra una historia brutal, honesta y única del cine argentino.",        ytId: "ofLGs2OmbBI" },
  { ep: 12, title: "Contada por sus protagonistas",        desc: "Los actores de Okupas recuerdan el rodaje, los personajes y el impacto de la serie.",  ytId: "ueXybISsCk8", special: true },
];


function OkupasPageLegacy() {
  const [activeEp, setActiveEp] = useState(0); // index in EPISODES
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const current = EPISODES[activeEp];
  const embedSrc = `https://www.youtube.com/embed/${current.ytId}?autoplay=1&rel=0&modestbranding=1&fs=1`;

  return (
    <div className="mp-app" style={{ background: "#0a0a0e", minHeight: "100vh" }}>

      {/* Header */}
      <header
        className={`mp-header${scrolled ? " scrolled" : ""}`}
        style={{ background: scrolled ? "rgba(10,10,14,.97)" : "linear-gradient(to bottom, rgba(10,10,14,.95) 0%, transparent 100%)" }}
      >
        <Link href="/movie" className="mp-logo">
          <LogoAnimated height={26} delay={300} />
          <span className="mp-logo-badge">PLAY</span>
        </Link>
        <nav className="mp-nav">
          <Link href="/movie">Inicio</Link>
          <a href="#" style={{ color: "#fff", fontWeight: 600 }}>Okupas</a>
        </nav>
        <div className="mp-header-right">
          <Link href="/movie" style={{ fontSize: "13px", color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </Link>
        </div>
      </header>

      {/* Hero / Player */}
      <section style={{
        paddingTop: "76px",
        background: "linear-gradient(180deg, #0d0820 0%, #0a0a0e 100%)",
        backgroundImage: `linear-gradient(to bottom, rgba(10,8,32,.85) 0%, #0a0a0e 100%), url('/images/okupas/capitulo1.jpg')`,
        backgroundSize: "cover", backgroundPosition: "center top", backgroundBlendMode: "normal",
        borderBottom: "1px solid rgba(255,255,255,.06)"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 0" }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,.35)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/movie" style={{ color: "rgba(255,255,255,.35)", textDecoration: "none" }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,.35)" }}>Series</span>
            <span>›</span>
            <span style={{ color: "#fff" }}>Okupas</span>
          </div>

          <div className="okp-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

            {/* Player */}
            <div>
              <div style={{
                position: "relative", paddingBottom: "56.25%", height: 0,
                borderRadius: "12px", overflow: "hidden",
                background: "#0d0a1a",
                boxShadow: "0 0 60px rgba(124,58,237,.15), 0 20px 60px rgba(0,0,0,.6)"
              }}>
                {current.noEmbed ? (
                  /* No-embed fallback */
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "20px",
                    backgroundImage: `url('/images/okupas/capitulo${current.ep}.jpg')`,
                    backgroundSize: "cover", backgroundPosition: "center",
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,26,.75)" }} />
                    <div style={{ position: "relative", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,.5)", marginBottom: "20px" }}>
                        Este episodio no permite reproducción embebida.
                      </p>
                      <a
                        href={`https://www.youtube.com/watch?v=${current.ytId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "10px",
                          background: "#FF0000", color: "#fff",
                          padding: "14px 28px", borderRadius: "10px",
                          fontSize: "15px", fontWeight: 700, textDecoration: "none",
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        Episodio 6 con restricción de edad
                      </a>
                    </div>
                  </div>
                ) : (
                  <iframe
                    key={activeEp}
                    src={embedSrc}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    title={`Okupas - ${current.title}`}
                  />
                )}
              </div>

              {/* Episode info below player */}
              <div style={{ marginTop: "20px", paddingBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <span style={{
                    background: "rgba(124,58,237,.2)", color: "#9D5FFF",
                    fontSize: "11px", fontWeight: 700, padding: "4px 10px",
                    borderRadius: "6px", letterSpacing: ".08em", textTransform: "uppercase"
                  }}>
                    Serie · 11 episodios + especial
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,.3)" }}>Argentina · 2000</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,.3)" }}>Drama</span>
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-.01em", marginBottom: "6px" }}>
                  Okupas
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,.45)", lineHeight: 1.6, maxWidth: "640px" }}>
                  {current.desc}
                </p>
              </div>
            </div>

            {/* Episode List */}
            <div className="okp-ep-list" style={{
              background: "#12121a",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,.06)",
              overflow: "hidden",
              maxHeight: "calc(56.25vw * 0.714 + 76px)",
              display: "flex", flexDirection: "column"
            }}>
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexShrink: 0
              }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", letterSpacing: ".03em" }}>
                  Episodios
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,.3)" }}>
                  {EPISODES.length} episodios
                </span>
              </div>

              <div style={{ overflowY: "auto", flex: 1, scrollbarWidth: "thin", scrollbarColor: "rgba(124,58,237,.3) transparent" }}>
                {EPISODES.map((ep, i) => (
                  <button
                    key={ep.ep}
                    onClick={() => setActiveEp(i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "14px",
                      padding: "14px 20px", border: "none",
                      background: activeEp === i ? "rgba(124,58,237,.15)" : "transparent",
                      cursor: "pointer", textAlign: "left",
                      borderBottom: "1px solid rgba(255,255,255,.04)",
                      borderLeft: activeEp === i ? "3px solid #7C3AED" : "3px solid transparent",
                      transition: "background .15s",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: "72px", height: "42px", borderRadius: "6px", overflow: "hidden",
                      flexShrink: 0, position: "relative",
                    }}>
                      <Image
                        src={`/images/okupas/capitulo${ep.ep}.jpg`}
                        alt={ep.title}
                        width={72}
                        height={42}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      {/* Overlay */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: activeEp === i ? "rgba(124,58,237,.4)" : "rgba(0,0,0,.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background .15s"
                      }}>
                        {activeEp === i ? (
                          <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "14px" }}>
                            {[1, 0.6, 0.8, 0.4, 1].map((h, k) => (
                              <div key={k} style={{
                                width: "3px", background: "#fff", borderRadius: "2px",
                                height: `${h * 14}px`,
                                animation: `mp-bar ${0.6 + k * 0.1}s ease-in-out infinite alternate`
                              }} />
                            ))}
                          </div>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,.8)"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                        <div style={{
                          fontSize: "13px", fontWeight: activeEp === i ? 700 : 500,
                          color: activeEp === i ? "#fff" : "rgba(255,255,255,.7)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0
                        }}>
                          {ep.title}
                        </div>
                        {ep.special && (
                          <span style={{
                            flexShrink: 0, fontSize: "9px", fontWeight: 700,
                            background: "rgba(240,180,41,.15)", color: "#f0b429",
                            padding: "2px 6px", borderRadius: "4px", letterSpacing: ".08em"
                          }}>ESPECIAL</span>
                        )}
                      </div>
                      <div style={{
                        fontSize: "11px", color: "rgba(255,255,255,.3)", lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {ep.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Series info section */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "48px 24px" }}>
        <div className="okp-info-grid" style={{
          background: "#12121a", borderRadius: "16px",
          border: "1px solid rgba(255,255,255,.06)",
          padding: "36px 40px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center"
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(124,58,237,.15)", borderRadius: "8px",
              padding: "6px 14px", marginBottom: "20px"
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7C3AED" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#9D5FFF", letterSpacing: ".1em", textTransform: "uppercase" }}>
                Serie Original Argentina
              </span>
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "16px", letterSpacing: "-.02em" }}>
              Sobre Okupas
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.8, marginBottom: "24px" }}>
              Ocupas es una serie argentina de drama producida por Canal 7 en el año 2000,
              dirigida por Bruno Stagnaro. Narra la historia de Ricardo, un joven universitario
              de clase media que, tras perder su departamento, se ve envuelto en el mundo
              marginal de los ocupas del conurbano bonaerense.
            </p>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.8 }}>
              Considerada un hito del cine y la televisión argentina, la serie retrata
              con crudeza y autenticidad la realidad social de los años 90, con actuaciones
              que se convirtieron en íconos de la cultura popular.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Año", value: "2000" },
              { label: "Episodios", value: "11" },
              { label: "País", value: "Argentina" },
              { label: "Canal", value: "Canal 7" },
              { label: "Director", value: "Bruno Stagnaro" },
              { label: "Género", value: "Drama" },
              { label: "Idioma", value: "Español" },
              { label: "Rating", value: "★ 9.2" },
            ].map((item) => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,.03)", borderRadius: "10px",
                padding: "16px", border: "1px solid rgba(255,255,255,.05)"
              }}>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "6px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mp-footer">
        <span>© 2026 Hivrido PLAY. Todos los derechos reservados.</span>
        <div className="mp-footer-links">
          <a href="/movie">← Volver a Hivrido PLAY</a>
        </div>
      </footer>

      {/* Animation for playing bars */}
      <style>{`
        @keyframes mp-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @media (max-width: 900px) {
          .okp-main-grid {
            grid-template-columns: 1fr !important;
          }
          .okp-ep-list {
            max-height: 360px !important;
          }
          .okp-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
