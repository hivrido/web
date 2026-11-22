"use client";

/**
 * Cuenta regresiva al estreno. El servidor no sabe qué hora es en el
 * teléfono de quien mira, así que el HTML trae solo la fecha y los números
 * aparecen al hidratar, en un hueco ya reservado (sin salto de diseño).
 * Al llegar a cero se oculta: el badge del hero ya dice "Estreno".
 */

import { useEffect, useState } from "react";

const UNIDADES = [
  ["días", 86400],
  ["horas", 3600],
  ["min", 60],
  ["seg", 1],
] as const;

export default function Cuenta({ fecha }: { fecha: string }) {
  const meta = Date.parse(fecha);
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    const tic = () => setAhora(Date.now());
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, []);

  /* Con zona fija: el servidor corre en UTC y una función a las 21 h de
     Buenos Aires ya es el día siguiente allá. Sin esto, servidor y cliente
     escribirían fechas distintas. */
  const legible = new Intl.DateTimeFormat("es-AR", {
    day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires",
  }).format(meta);
  if (ahora !== null && ahora >= meta) return null;

  let resto = ahora === null ? 0 : Math.floor((meta - ahora) / 1000);
  return (
    <div className="ry-countdown">
      <p className="ry-count-date">Estreno · {legible}</p>
      {/* role="timer" anuncia el valor solo si se lo consulta: sin aria-live,
          el lector de pantalla no lee un número nuevo por segundo. */}
      <div className="ry-count" role="timer" aria-label={`Faltan para el estreno del ${legible}`}>
        {UNIDADES.map(([rotulo, seg]) => {
          const v = Math.floor(resto / seg);
          resto -= v * seg;
          return (
            <span key={rotulo} className="ry-count-unit">
              <span className="ry-count-num">{ahora === null ? "--" : String(v).padStart(2, "0")}</span>
              <span className="ry-count-lbl">{rotulo}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
