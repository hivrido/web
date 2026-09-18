import type { Metadata } from "next";
import Link from "next/link";
import LogoAnimated from "../components/ui/LogoAnimated";
import WhatsAppBtn from "../components/ui/WhatsAppBtn";
import CesionForm from "./CesionForm";
import "./cesion.css";

/* Página de trámite, no de marca: no tiene por qué aparecer en Google ni
   compartirse como tarjeta. El link se reparte a mano en el casting. */
export const metadata: Metadata = {
  title: "Cesión de derechos de imagen — Hivrido",
  description:
    "Formulario de cesión de derechos de imagen, voz y actuación para participantes de castings y rodajes de Hivrido.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cesion" },
};

export default function CesionPage() {
  return (
    <div className="cs-page">
      <header className="cs-header">
        <Link href="/" className="cs-logo" aria-label="Hivrido — ir al inicio">
          {/* Mismo par que /play y /okupas: esta ruta no tiene loader que
              esperar, así que el trazo arranca casi enseguida. */}
          <LogoAnimated height={26} delay={300} />
        </Link>
        <span className="cs-kicker">Documento de producción</span>
      </header>

      <main className="cs-main">
        <div className="cs-intro">
          <h1 className="cs-title">
            Cesión de<strong>derechos de imagen</strong>
          </h1>
          <p className="cs-lead">
            Completá tus datos, leé el texto y firmá con el dedo. No hace falta
            imprimir ni escanear nada: la firma queda registrada con fecha, hora
            y constancia técnica.
          </p>
        </div>

        <CesionForm />
      </main>

      <footer className="cs-footer">
        <span>© 2026 Hivrido</span>
        <span>Cualquier duda, escribinos por WhatsApp</span>
      </footer>

      {/* El flotante del resto del sitio. Reemplaza al link que estaba en el
          pie: dos accesos al mismo WhatsApp a diez píxeles uno del otro era
          ruido, no una opción más. */}
      <WhatsAppBtn />
    </div>
  );
}
