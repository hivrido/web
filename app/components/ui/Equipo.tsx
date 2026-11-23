/**
 * El equipo de RYTMOS: tarjetas en relieve con la luz de la casa recorriendo
 * el borde, cada una al Instagram de la persona. La primera —quien crea la
 * serie— va destacada, más grande. Lo usan la home y /casting; los datos
 * viven en app/lib/rytmos.ts.
 *
 * Las fotos son las de perfil de Instagram de cada uno (150 px: alcanzan
 * para el avatar a doble densidad). La de Lucas sale de su retrato del sitio,
 * que es la misma foto en alta.
 */

/* eslint-disable @next/next/no-img-element -- avatares chicos ya dimensionados */

import { RYTMOS } from "../../lib/rytmos";
import "./relieve.css";

const iniciales = (n: string) =>
  n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function Equipo({ className = "" }: { className?: string }) {
  return (
    <div className="equipo-caja">
      <ul className={`equipo ${className}`}>
        {RYTMOS.equipo.map((p, i) => (
          <li key={p.instagram} className={p.principal ? "equipo-principal" : undefined}>
            <a
              className="equipo-card relieve luz-borde"
              style={{ "--luz-delay": `${-i * 1.2}s` } as React.CSSProperties}
              href={`https://www.instagram.com/${p.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.nombre}${p.rol ? `, ${p.rol}` : ""}: Instagram @${p.instagram}`}
            >
              <span className="equipo-ini" aria-hidden="true">
                {p.foto ? <img src={p.foto} alt="" width={150} height={150} loading="lazy" decoding="async" /> : iniciales(p.nombre)}
              </span>
              <span className="equipo-txt">
                {p.principal && <span className="equipo-kicker">{RYTMOS.nombre}</span>}
                <span className="equipo-nombre">{p.nombre}</span>
                {p.rol && <span className="equipo-rol">{p.rol}</span>}
                <span className="equipo-ig">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                  @{p.instagram}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
