import type { Metadata } from "next";
import Link from "next/link";
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
        <Link href="/" className="cs-logo">
          HIVRIDO
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
        <a href="https://wa.me/5491156072460?text=Hola!%20Tengo%20una%20consulta%20sobre%20la%20cesi%C3%B3n%20de%20derechos" target="_blank" rel="noopener noreferrer">
          Consultar por WhatsApp
        </a>
      </footer>
    </div>
  );
}
