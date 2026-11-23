import type { Metadata } from "next";
import Link from "next/link";
import LogoAnimated from "../components/ui/LogoAnimated";
import WhatsAppBtn from "../components/ui/WhatsAppBtn";
import Hive from "../components/immersive/Hive";
import LogoRytmos from "../components/rytmos/LogoRytmos";
import { CONVOCATORIA } from "../casting/contenido";
import { RYTMOS } from "../lib/rytmos";
import CesionForm from "./CesionForm";
import "../components/rytmos/rytmos.css";
import "../components/ui/relieve.css";
import "./cesion.css";

/* Página de trámite, no de marca: no tiene por qué aparecer en Google ni
   compartirse como tarjeta. El link (/firma) se reparte a mano en el casting.
   Los datos de la convocatoria salen de /casting, así que cambian juntos.

   La portada usa las piezas del hero de la home de RYTMOS —colmena 3D, aurora,
   conos de luz y el logo en 3D—; el formulario queda en una columna quieta:
   lo que se anima ahí es luz y opacidad, nunca la posición del recuadro de
   firma, que el trazo necesita estable bajo el dedo. */
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
    <div className="cs-page ry">
      <header className="cs-header">
        <Link href="/" className="cs-logo" aria-label="Hivrido — ir al inicio">
          <LogoAnimated height={26} delay={300} />
        </Link>
        <span className="cs-kicker">Casting {RYTMOS.nombre}</span>
      </header>

      <section className="cs-hero" aria-label={`Cesión de derechos de imagen, casting de ${RYTMOS.nombre}`}>
        <div className="cs-hero-bg" aria-hidden="true">
          <div className="ry-stage">
            <span className="ry-aurora" />
            <Hive className="cs-hero-hive" />
            <span className="ry-beam is-a" />
            <span className="ry-beam is-b" />
          </div>
        </div>
        <div className="cs-hero-shade" aria-hidden="true" />

        <div className="cs-hero-in">
          <p className="cs-hero-kicker">
            <span className="cs-hero-dot" aria-hidden="true" />
            Casting · Hivrido PLAY
          </p>

          <div className="cs-hero-logo">
            <span className="cs-sr">{RYTMOS.nombre}</span>
            <LogoRytmos />
            <span className="ry-horizon" aria-hidden="true" />
          </div>

          <h1 className="cs-title">
            Cesión de <span className="cs-brillo">derechos de imagen</span>
          </h1>
          <p className="cs-lead">
            Para grabarte en el casting necesitamos tu permiso por escrito.
            Completá tus datos, leé el texto y firmá con el dedo: no hace falta
            imprimir nada, la firma queda registrada con fecha, hora y
            constancia técnica. Te lleva dos minutos y te ahorra la fila.
          </p>

          <dl className="cs-datos">
            {DATOS.map((d, i) => (
              <div
                key={d.rot}
                className="cs-dato relieve luz-borde"
                style={{ "--luz-delay": `${-i * 0.9}s`, "--i": i } as React.CSSProperties}
              >
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

          <div className="cs-hero-acciones">
            <a href="#firmar" className="cs-ir">
              Completar y firmar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </a>
            <Link href="/casting/" className="cs-volver">
              Ver toda la info del casting
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <main className="cs-main" id="firmar">
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
