import type { Metadata } from "next";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CastingCall from "./CastingCall";
import SeccionesCasting from "./SeccionesCasting";
import { SEO } from "./contenido";
import "./casting.css";
import "./formulario.css";

/**
 * El casting de Cuchillo Paz: el formulario para anotarse arriba y, debajo,
 * todo lo que hay que saber de la prueba.
 *
 * Fue la página de una jornada con fecha y dirección; pasada la jornada, la
 * convocatoria sigue abierta por inscripción y la cita se da por WhatsApp.
 * /suscribite, donde vivió el formulario un tiempo, redirige acá.
 */

/* La barra del navegador acompaña al fondo de la página. El link se abre casi
   siempre desde el navegador incrustado de WhatsApp o Instagram en Android,
   que sin esto pinta la barra de blanco arriba de un sitio negro. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: "/casting" },
  openGraph: {
    title: "Sé parte de Cuchillo Paz | Hivrido",
    description: SEO.description,
    url: "https://hivrido.com/casting/",
    siteName: "Hivrido",
    locale: "es_AR",
    type: "website",
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sé parte de Cuchillo Paz | Hivrido",
    description: SEO.description,
    images: [SEO.ogImage],
  },
};

export default function CastingPage() {
  return (
    <ClientShell>
      <Header base="/" logoDelay={300} />
      <main className="sus-page">
        <CastingCall />
        <div className="cst-page sus-info">
          <SeccionesCasting />
        </div>
        <Footer />
      </main>
    </ClientShell>
  );
}
