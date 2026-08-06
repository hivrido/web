import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import OrbitalGallery from "./OrbitalGallery";
import "./orbital.css";

/* Fuentes propias de esta ruta: no tocan las del sitio principal.
   Se exponen como variables CSS porque el canvas de las tarjetas necesita
   leer el nombre real de la familia, que next/font genera con hash. */
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

/* Los títulos de las tarjetas: cara techno, ancha y geométrica. */
const techno = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-techno",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-orbital",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Órbita — HIVRIDO",
  description:
    "Galería orbital de proyectos: dirección creativa, film, producto e inteligencia artificial.",
  openGraph: {
    title: "Órbita — HIVRIDO",
    description: "Galería orbital de proyectos de HIVRIDO.",
    url: "https://hivrido.com/orbital",
    type: "website",
  },
};

export default function OrbitalPage() {
  return (
    <div className={`${grotesk.variable} ${techno.variable} ${mono.variable}`}>
      <OrbitalGallery />
    </div>
  );
}
