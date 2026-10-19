import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";

/* Tipografía de Hivrido PLAY. Se cargan acá y no en el layout raíz: el resto
   del sitio no las usa, y así solo las baja quien entra a la plataforma.
   Cada página de PLAY pone `playFonts` en su `.mp-app`. */

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-hp-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hp-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-hp-mono",
  display: "swap",
});

export const playFonts = `${display.variable} ${sans.variable} ${mono.variable}`;
