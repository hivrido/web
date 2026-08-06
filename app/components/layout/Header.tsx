"use client";
import { useState, useRef, useCallback } from "react";
import LogoAnimated from "../ui/LogoAnimated";

const NAV_ITEMS = [
  { label: "Home",        href: "#sec1" },
  { label: "Proyectos",   href: "#sec2" },
  { label: "Okupas",      href: "/movie/okupas" },
  { label: "Identidad",   href: "#sec3" },
  { label: "Servicios",   href: "#sec4" },
  { label: "Equipo",       href: "#sec5" },
  { label: "Partners",    href: "#sec6" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const WA_URL = "https://api.whatsapp.com/send?phone=5491156072460&text=Hola%20H%C3%ADvrido!";

function ScrambleLink({ label, href, delay, onClick, index }: {
  label: string; href: string; delay: string; onClick: () => void; index: number;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    const el = labelRef.current;
    if (!el) return;
    if (numRef.current) numRef.current.style.color = "var(--gold)";
    let iteration = 0;
    const speed = 2.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => {
      el.textContent = label.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < iteration / speed) return label[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      if (iteration < label.length * speed) {
        iteration++;
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.textContent = label;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [label]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (labelRef.current) labelRef.current.textContent = label;
    if (numRef.current) numRef.current.style.color = "var(--violet-light)";
  }, [label]);

  return (
    <a
      href={href}
      onClick={onClick}
      style={{ transitionDelay: delay }}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      <span ref={numRef} style={{ color: "var(--violet-light)", marginRight: 8, transition: "color 0.35s ease" }}>
        {String(index + 1).padStart(2, "0")}.
      </span>
      <span ref={labelRef}>{label}</span>
    </a>
  );
}

/**
 * @param base Prefijo para los enlaces de ancla. Vacío en el home, donde las
 *   secciones están en la misma página. Desde otra ruta hay que anteponer "/"
 *   o el ancla no lleva a ninguna parte: #sec1 solo existe en el home.
 */
export default function Header({ base = "", logoDelay }: { base?: string; logoDelay?: number }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const linkTo = (href: string) => (href.startsWith("#") ? `${base}${href}` : href);

  return (
    <>
      <header className="main-header">
        <a href={base || "#sec1"} className="logo-holder" onClick={close}>
          {/* El logo arranca invisible y se dibuja al vencer el retardo. El
              valor por defecto espera al preloader de la home; en una página
              que no lo tiene hay que acortarlo o el header se ve vacío. */}
          <LogoAnimated delay={logoDelay} />
        </a>

        <div className="header-right">
          <div className="header-social">
            <a href="https://www.instagram.com/hivrido_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4.5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>
          <div
            className={`nav-btn-wrap${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); } }}
            role="button"
            tabIndex={0}
            aria-label="Menú"
            aria-expanded={open}
          >
            <span className="nav-btn-text">{open ? "Cerrar" : "Menu"}</span>
            <div className="nav-btn-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </header>

      <div className={`nav-overlay-bg${open ? " open" : ""}`} onClick={close} />

      <nav className={`nav-drawer${open ? " open" : ""}`}>
        <div className="nav-title-dec">Navegación</div>
        <ul className="nav-menu">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href}>
              <ScrambleLink
                label={item.label}
                href={linkTo(item.href)}
                index={i}
                delay={open ? `${i * 0.05 + 0.1}s` : "0s"}
                onClick={close}
              />
            </li>
          ))}
        </ul>
        <div className="nav-cta">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer">+ Contacto</a>
          <a href="mailto:hola@hivrido.com">hola@hivrido.com</a>
        </div>
      </nav>
    </>
  );
}
