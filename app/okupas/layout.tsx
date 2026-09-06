import type { Metadata } from "next";

/* La página es un componente cliente, así que su metadata vive acá. Antes la
   heredaba de app/movie/layout.tsx —que hablaba del casting, no de la serie—
   y con la mudanza de la ruta ese layout dejó de existir. */
export const metadata: Metadata = {
  title: "Okupas — Serie completa en Hivrido PLAY",
  description:
    "Mirá Okupas completa en Hivrido PLAY: los 11 episodios y el detrás de escena contado por sus protagonistas.",
  alternates: { canonical: "/okupas" },
  openGraph: {
    title: "Okupas — Serie completa en Hivrido PLAY",
    description:
      "Los 11 episodios de Okupas, más el especial contado por sus protagonistas. En Hivrido PLAY.",
    url: "https://hivrido.com/okupas/",
    siteName: "Hivrido PLAY",
    images: [
      {
        url: "/images/okupas/okupas-home.webp",
        alt: "Okupas",
      },
    ],
    locale: "es_AR",
    type: "video.tv_show",
  },
  twitter: { card: "summary_large_image" },
};

export default function OkupasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
