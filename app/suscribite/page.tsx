import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CastingCall from "./CastingCall";
import "./suscribite.css";

/**
 * Formulario de casting de Cuchillo Paz.
 *
 * Vivía como portada de PLAY; tiene página propia para poder compartirse con
 * su link y entrar con el menú y el preloader del sitio institucional.
 */

export const metadata: Metadata = {
  title: "Casting Cuchillo Paz | Suscribite | Hivrido",
  description:
    "Casting abierto para la primera temporada de Cuchillo Paz. Dejá tus datos y te escribimos por WhatsApp con la fecha, el lugar y el personaje.",
  alternates: { canonical: "/suscribite" },
  openGraph: {
    title: "Sé parte de Cuchillo Paz | Hivrido",
    description: "Casting abierto 2026. Dejá tus datos y te escribimos por WhatsApp.",
    url: "https://hivrido.com/suscribite",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
  },
};

export default function SuscribitePage() {
  return (
    <ClientShell>
      <Header base="/" logoDelay={300} />
      <main className="sus-page">
        <CastingCall />
        <Footer />
      </main>
    </ClientShell>
  );
}
