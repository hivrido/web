import type { Metadata } from "next";
import "./movie.css";

/* La página abre con el casting, así que la tarjeta que se ve al compartirla
   dice eso y no el catálogo: lo que se promete al abrir el link tiene que ser
   lo primero que se ve al entrar.

   El openGraph va declarado entero —no solo el título— porque si no hereda el
   del layout raíz, que habla de la agencia. */
export const metadata: Metadata = {
  title: "Hivrido PLAY — Casting abierto para El Docke",
  description:
    "Suscribite al casting de la serie El Docke. Hivrido PLAY es nuestra plataforma de contenidos: cine, series y documentales de habla hispana en un solo lugar.",
  openGraph: {
    title: "Suscribite al casting de El Docke — Hivrido PLAY",
    description:
      "Nuestra plataforma de contenidos: cine y series propias. Dejá tus datos y sumate al casting de la serie.",
    url: "https://hivrido.com/movie/",
    siteName: "Hivrido PLAY",
    images: [
      {
        url: "/images/bg/hivrido-chrome.jpg",
        width: 1200,
        height: 670,
        alt: "Hivrido PLAY",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
