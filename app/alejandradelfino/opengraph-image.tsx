import { ImageResponse } from "next/og";

/* Imagen para compartir: nombre y provincia sobre el violeta, con la franja de
   colores de las regiones. Sin logo ni lema: la identidad de marca queda
   bloqueada hasta el lanzamiento (ver _config/site.ts). */

export const alt = "Alejandra Delfino — Chubut";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FRANJA = ["#3E8E2F", "#C98A2B", "#7B2FD0", "#1F9BA0", "#E0641A", "#D9475C"];

export default function Imagen() {
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
          position: "relative",
        }}
      >
        <div style={{ fontSize: 112, fontWeight: 900, fontStyle: "italic", letterSpacing: -3, lineHeight: 1 }}>
          Alejandra Delfino
        </div>
        <div style={{ marginTop: 28, fontSize: 52, fontWeight: 700, color: "#F0B323" }}>Chubut</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, display: "flex" }}>
          {FRANJA.map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
