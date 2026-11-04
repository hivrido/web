import { ImageResponse } from "next/og";

/* Imagen para compartir: nombre y provincia sobre el violeta, con la franja de
   colores de las regiones. Sin logo ni lema: la identidad de marca queda
   bloqueada hasta el lanzamiento (ver _config/site.ts). */

export const alt = "Alejandra Delfino — Chubut";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FRANJA = ["#3E8E2F", "#C98A2B", "#7B2FD0", "#1F9BA0", "#E0641A", "#D9475C"];

/* La imagen se genera en el build: baja la Nunito del sitio en TTF (el
   formato que entiende el generador). Si Google Fonts no responde, sale con
   la tipografía por defecto en lugar de romper el build. */
async function nunito(peso: 700 | 900): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Nunito:ital,wght@1,${peso}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Imagen() {
  const [negra, bold] = await Promise.all([nunito(900), nunito(700)]);
  const fuentes = [
    ...(negra ? [{ name: "Nunito", data: negra, weight: 900 as const, style: "italic" as const }] : []),
    ...(bold ? [{ name: "Nunito", data: bold, weight: 700 as const, style: "italic" as const }] : []),
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(150deg, #3a1a78 0%, #2a1159 55%, #1b0b3a 100%)",
          color: "#fff7ec",
          fontFamily: "Nunito",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 112, fontWeight: 900, fontStyle: "italic", letterSpacing: -3, lineHeight: 1 }}>
          Alejandra Delfino
        </div>
        <div style={{ marginTop: 28, fontSize: 56, fontWeight: 700, fontStyle: "italic", color: "#e6a92b" }}>Chubut</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, display: "flex" }}>
          {FRANJA.map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: fuentes },
  );
}
