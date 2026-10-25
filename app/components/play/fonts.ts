import { Anton, Inter, Geist_Mono } from "next/font/google";

/* Tipografía de Hivrido PLAY. Se cargan acá y no en el layout raíz: el resto
   del sitio no las usa, y así solo las baja quien entra a la plataforma.
   Cada página de PLAY pone `playFonts` en su `.mp-app`. */

/* Anton tiene un solo peso: los títulos van en 400 y en mayúsculas, que es
   como se lee de cartel. Pedirle 700 haría que el navegador la engorde a mano. */
const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hp-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
