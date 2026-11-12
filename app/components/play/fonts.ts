import localFont from "next/font/local";

/* Tipografía de Hivrido PLAY. Se cargan acá y no en el layout raíz: el resto
   del sitio no las usa, y así solo las baja quien entra a la plataforma.
   Cada página de PLAY pone `playFonts` en su `.mp-app`.
   Los archivos están en app/fonts: ver el comentario de app/layout.tsx. */

/* Anton tiene un solo peso: los títulos van en 400 y en mayúsculas, que es
   como se lee de cartel. Pedirle 700 haría que el navegador la engorde a mano. */
const playDisplay = localFont({
  src: "../../fonts/anton.woff2",
  weight: "400",
  variable: "--font-hp-display",
  display: "swap",
});

const playSans = localFont({
  src: "../../fonts/inter.woff2",
  weight: "400 700",
  variable: "--font-hp-sans",
  display: "swap",
});

const playMono = localFont({
  src: "../../fonts/geist-mono.woff2",
  weight: "400 500",
  variable: "--font-hp-mono",
  display: "swap",
});

export const playFonts = `${playDisplay.variable} ${playSans.variable} ${playMono.variable}`;
