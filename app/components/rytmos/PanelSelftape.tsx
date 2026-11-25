import Link from "next/link";

/**
 * El panel del casting por selftape en el hero de la home. Ocupa el lugar
 * que tuvo la cuenta regresiva de la jornada presencial (Cuenta.tsx) y usa
 * su misma pieza: panel de vidrio, barra con la luz en vivo y cuatro
 * paletas, acá con los cuatro pasos de la consigna en vez de los números.
 */

const PASOS = [
  { n: "01", label: "Grabate" },
  { n: "02", label: "Presentate" },
  { n: "03", label: "Improvisá" },
  { n: "1'", label: "Máximo" },
] as const;

export default function PanelSelftape({ titulo, detalle, href }: { titulo: string; detalle: string; href: string }) {
  return (
    <div className="ry-cd">
      <div className="ry-cd-panel hp-haz">
        <div className="ry-cd-bar">
          <span className="ry-cd-live-wrap">
            <span className="ry-cd-live" aria-hidden="true" />
            {titulo}
          </span>
          <span>{detalle}</span>
        </div>

        <ol className="ry-cd-grid ry-st-grid">
          {PASOS.map((p, i) => (
            <li key={p.n} className="ry-cd-slot">
              {i > 0 && (
                <span className="ry-cd-rivets" aria-hidden="true">
                  <span />
                  <span />
                </span>
              )}
              <div className="ry-cd-cell">
                <div className="ry-cd-tile" aria-hidden="true">
                  <span className="ry-cd-digit">{p.n}</span>
                </div>
                <span className="ry-cd-label">{p.label}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="ry-st-texto">
          Grabate con el celu en horizontal, decinos tu nombre y apellido,
          contanos de vos e improvisá: freestyle, un monólogo o lo que te
          haga sentir cómodx. Hasta un minuto, por mail.
        </p>

        <Link href={href} className="ry-cd-link" data-medir="cuenta_click" data-medir-destino={href}>
          Cómo mandarlo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}
