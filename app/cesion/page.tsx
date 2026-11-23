import type { Metadata } from "next";
import Link from "next/link";
import LogoAnimated from "../components/ui/LogoAnimated";
import WhatsAppBtn from "../components/ui/WhatsAppBtn";
import { CONVOCATORIA } from "../casting/contenido";
import { RYTMOS } from "../lib/rytmos";
import CesionForm from "./CesionForm";
import "./cesion.css";

/* Página de trámite, no de marca: no tiene por qué aparecer en Google ni
   compartirse como tarjeta. El link (/firma) se reparte a mano en el casting.
   Los datos de la convocatoria salen de /casting, así que cambian juntos. */
export const metadata: Metadata = {
  title: `Cesión de derechos — Casting ${RYTMOS.nombre} · Hivrido`,
  description: `Cesión de derechos de imagen, voz y actuación para quienes participan del casting de ${RYTMOS.nombre}, la serie de Hivrido PLAY.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/cesion/" },
};

const DATOS = [
  { rot: "Serie", val: `${RYTMOS.nombre} · Hivrido PLAY` },
  { rot: "Casting", val: `${CONVOCATORIA.fecha}, ${CONVOCATORIA.hora}` },
  { rot: "Lugar", val: `${CONVOCATORIA.lugar}, ${CONVOCATORIA.ciudad}` },
  { rot: "Dirección de casting", val: CONVOCATORIA.direccion },
];

export default function CesionPage() {
  return (
    <div className="cs-page">
      <header className="cs-header">
        <Link href="/" className="cs-logo" aria-label="Hivrido — ir al inicio">
          {/* Mismo par que /play y /okupas: esta ruta no tiene loader que
              esperar, así que el trazo arranca casi enseguida. */}
          <LogoAnimated height={26} delay={300} />
        </Link>
        <span className="cs-kicker">Casting {RYTMOS.nombre}</span>
      </header>

      <main className="cs-main">
        <div className="cs-intro">
          {RYTMOS.logo && (
            /* eslint-disable-next-line @next/next/no-img-element -- SVG vectorial */
            <img
              className="cs-serie-logo"
              src={RYTMOS.logo.src}
              alt={RYTMOS.nombre}
              width={RYTMOS.logo.ancho}
              height={RYTMOS.logo.alto}
            />
          )}
          <h1 className="cs-title">
            Cesión de<strong>derechos de imagen</strong>
          </h1>
          <p className="cs-lead">
            Para grabarte en el casting necesitamos tu permiso por escrito.
            Completá tus datos, leé el texto y firmá con el dedo: no hace falta
            imprimir nada, la firma queda registrada con fecha, hora y
            constancia técnica. Te lleva dos minutos y te ahorra la fila.
          </p>

          <dl className="cs-datos">
            {DATOS.map((d) => (
              <div key={d.rot}>
                <dt>{d.rot}</dt>
                <dd>{d.val}</dd>
              </div>
            ))}
          </dl>

          <ul className="cs-notas">
            <li><strong>Es gratis.</strong> Nadie te puede cobrar por participar ni por firmar.</li>
            <li><strong>Menores de 18:</strong> firma también el padre, la madre o quien tenga la tutela.</li>
            <li><strong>Traé DNI</strong> el día del casting: con esto no alcanza para acreditarte.</li>
          </ul>

          <Link href="/casting/" className="cs-volver">
            Ver toda la info del casting
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        <CesionForm />
      </main>

      <footer className="cs-footer">
        <span>© 2026 Hivrido · {RYTMOS.nombre}</span>
        <span>Cualquier duda, escribinos por WhatsApp</span>
      </footer>

      {/* El flotante del resto del sitio. Reemplaza al link que estaba en el
          pie: dos accesos al mismo WhatsApp a diez píxeles uno del otro era
          ruido, no una opción más. */}
      <WhatsAppBtn />
    </div>
  );
}
