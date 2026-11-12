import type { Metadata } from "next";
import localFont from "next/font/local";
import OrbitalGallery from "./OrbitalGallery";
import "./orbital.css";

/* Fuentes propias de esta ruta: no tocan las del sitio principal.
   Se exponen como variables CSS porque el canvas de las tarjetas necesita
   leer el nombre real de la familia, que next/font genera con hash.
   Los archivos están en app/fonts: ver el comentario de app/layout.tsx. */
const orbitalGrotesk = localFont({
  src: "../fonts/space-grotesk.woff2",
  weight: "400 700",
  variable: "--font-grotesk",
  display: "swap",
});

/* Los títulos de las tarjetas: cara techno, ancha y geométrica. */
const orbitalTechno = localFont({
  src: "../fonts/orbitron.woff2",
  weight: "400 900",
  variable: "--font-techno",
  display: "swap",
});

const orbitalMono = localFont({
  src: "../fonts/jetbrains-mono.woff2",
  weight: "400 500",
  variable: "--font-mono-orbital",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Órbita — HIVRIDO",
  description:
    "Galería orbital de proyectos: dirección creativa, film, producto e inteligencia artificial.",
  alternates: { canonical: "/orbital/" },
  openGraph: {
    title: "Órbita — HIVRIDO",
    description: "Galería orbital de proyectos de HIVRIDO.",
    url: "https://hivrido.com/orbital/",
    type: "website",
  },
};

export default function OrbitalPage() {
  return (
    <div className={`${orbitalGrotesk.variable} ${orbitalTechno.variable} ${orbitalMono.variable}`}>
      <OrbitalGallery />
    </div>
  );
}
