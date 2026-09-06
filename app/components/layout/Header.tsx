"use client";
import { useState } from "react";
import LogoAnimated from "../ui/LogoAnimated";
import ScrambleLink from "../ui/ScrambleLink";

/* El menú es el mismo mapa que dibujan las fichas del cosmos: una entrada por
   tarjeta, en su orden. Se fueron las anclas a secciones —#sec1, #sec4— porque
   la raíz ya no es la página larga sino el anillo, y ahí no existen.

   Desde que la plataforma pasó a ser la portada del dominio, PLAY es "/" y el
   anillo institucional vive en "/web". */
const NAV_ITEMS = [
  { label: "Home",         href: "/web" },
  { label: "Grow Digital", href: "/diseno-web" },
  { label: "Cine & Video", href: "/cine-video" },
  { label: "Publicidad",   href: "/publicidad" },
  { label: "Agentes IA",   href: "/colmena-agentes" },
  { label: "Branding",     href: "/branding" },
  { label: "Hivrido PLAY", href: "/" },
  { label: "Equipo",       href: "/equipo" },
];

const WA_URL = "https://api.whatsapp.com/send?phone=5491156072460&text=Hola%20H%C3%ADvrido!";

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
        {/* Este header lo usan las landings institucionales, así que el logo
            vuelve al anillo —que ahora vive en /web—, no a la plataforma. */}
        <a href="/web/" className="logo-holder" onClick={close}>
          {/* El logo arranca invisible y se dibuja al vencer el retardo. El
              valor por defecto espera al preloader de la home; en una página
              que no lo tiene hay que acortarlo o el header se ve vacío. */}
          <LogoAnimated delay={logoDelay} />
        </a>

        <div className="header-right">
          <div className="header-social">
            <a href="https://www.instagram.com/sergiopodeley" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
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
