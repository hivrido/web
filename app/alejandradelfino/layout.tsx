import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import { sitio } from "./_lib/contenido";
import "./delfino.css";

/* Sitio de Alejandra Delfino, alojado en hivrido mientras se habilita
   alejandradelfino.com.ar. Todo lo suyo vive en esta carpeta —contenido,
   componentes, estilos y el generador del mapa— para que la mudanza al
   dominio propio sea mover la carpeta y nada más. */

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  style: ["normal", "italic"],
  variable: "--ad-font",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--ad-hand",
  display: "swap",
});

const { titulo, descripcion, instagram } = sitio.meta;

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  /* Es una vista previa en un dominio ajeno: si Google la indexa acá, después
     compite con alejandradelfino.com.ar por las mismas búsquedas. */
  robots: { index: false, follow: false },
  alternates: { canonical: "/alejandradelfino" },
  icons: { icon: "/alejandradelfino/logo-ad-mark.webp" },
  openGraph: {
    title: titulo,
    description: descripcion,
    url: "/alejandradelfino/",
    siteName: "Alejandra Delfino",
    images: [{ url: "/alejandradelfino/logo-ad-mark.webp", width: 420, height: 317, alt: "Alejandra Delfino — Los sueños se cumplen" }],
    locale: "es_AR",
    type: "profile",
  },
  twitter: { card: "summary_large_image" },
};

const persona = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alejandra Delfino",
  alternateName: "Ruth Alejandra Delfino",
  description: "Dirigente política y empresaria del sector energético de Chubut.",
  homeLocation: { "@type": "Place", name: "Chubut, Argentina" },
  sameAs: [instagram],
};

export default function DelfinoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ad-root ${nunito.variable} ${caveat.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(persona) }} />
      {children}
    </div>
  );
}
