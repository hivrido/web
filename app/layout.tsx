import type { Metadata } from "next";
import { Orbitron, Rubik } from "next/font/google";
import "./globals.css";
import Medicion from "./components/analytics/Medicion";

/* Cuenta de Google Ads. La etiqueta es global porque los botones de WhatsApp
   —que son la conversión— están en todas las rutas, no solo en la landing. */
const GOOGLE_ADS_ID = "AW-18174991826";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
  preload: true,
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
  preload: false,
});


export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hivrido.com"),
  title: "Hivrido — Agencia Creativa",
  description:
    "Conectamos marcas con artistas talentosos para crear eventos, colaboraciones y experiencias que inspiran.",
  /* El ícono de fuxxia —el trazo magenta con dos nodos—, en todas las rutas. El .ico queda
     para los navegadores sin favicon SVG y el PNG para la pantalla de inicio
     del iPhone. El anillo (public/web/index.html) declara los mismos tres. */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Hivrido — Agencia Creativa",
    description:
      "Conectamos marcas con artistas para crear experiencias que dejan huella.",
    url: "https://hivrido.com",
    siteName: "Hivrido",
    images: [{ url: "/images/bg/hivrido-chrome.jpg", width: 1200, height: 670 }],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      className={`${orbitron.variable} ${rubik.variable}`}
      style={
        {
          "--font-display": "var(--font-orbitron)",
          "--font-body": "var(--font-rubik)",
        } as React.CSSProperties
      }
    >
      <body style={{ overflowX: "hidden" }}>
        <Medicion id={GOOGLE_ADS_ID} />
        {children}
        {/* Sin JavaScript el sitio se lee igual: todo el contenido viene en el
            HTML. Antes había acá un cartel a pantalla completa ("Este sitio
            requiere JavaScript") que lo tapaba entero. Lo único que hace falta
            es retirar la cortina de carga y mostrar lo que espera a una
            animación para aparecer. */}
        <noscript>
          <style>{`.loader-wrap{display:none!important}#main{display:block!important;opacity:1!important}.svc-desc,.fcar-card,.fcar-card-body,.fan-ig,[data-reveal]{opacity:1!important;transform:none!important;visibility:visible!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
