import type { Metadata } from "next";
import { Orbitron, Rubik } from "next/font/google";
import "./globals.css";
import GoogleTag from "./components/analytics/GoogleTag";
import WhatsAppConversion from "./components/analytics/WhatsAppConversion";

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
      lang="es"
      className={`${orbitron.variable} ${rubik.variable}`}
      style={
        {
          "--font-display": "var(--font-orbitron)",
          "--font-body": "var(--font-rubik)",
        } as React.CSSProperties
      }
    >
      <head>
        {/* Preconnect para YouTube — reduce latencia al activar el video del hero */}
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body style={{ overflowX: "hidden" }}>
        <GoogleTag id={GOOGLE_ADS_ID} />
        <WhatsAppConversion />
        {children}
        <noscript>
          <style>{`#main{display:block!important;opacity:1!important}`}</style>
          <div style={{
            position: "fixed", inset: 0, background: "#0a0a0a",
            color: "#f0f0f0", display: "flex", alignItems: "center",
            justifyContent: "center", flexDirection: "column", gap: "16px",
            fontFamily: "sans-serif", fontSize: "14px", zIndex: 99999,
            textAlign: "center", padding: "40px"
          }}>
            <strong style={{ fontSize: "1.4rem", letterSpacing: "0.2em" }}>Hivrido</strong>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Este sitio requiere JavaScript para funcionar correctamente.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
