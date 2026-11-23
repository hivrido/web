"use client";

/**
 * La cortina de Hivrido ("Is the Future · 0–100 %"), la misma del resto del
 * sitio (components/layout/Loader.tsx). Mientras está puesta, la entrada del
 * hero queda en pausa —marca `data-precarga` en <html>, ver rytmos.css— y
 * arranca justo cuando la cortina se levanta. Quien ya la vio en la última
 * media hora no la vuelve a ver.
 *
 * La marca la pone un script en línea (SCRIPT_PRECARGA, en scripts.ts), antes del primer
 * pintado, con su propia salida a los 4,2 s: si el JavaScript de la página
 * no llega, la cortina se va sola por CSS y el hero arranca igual.
 */

import { useCallback, useEffect } from "react";
import Loader from "../layout/Loader";

const MARCA = "data-precarga";

export default function Precarga() {
  const listo = useCallback(() => document.documentElement.removeAttribute(MARCA), []);

  /* Al hidratar, React reconcilia <html> con lo que declara el layout y se
     lleva la marca que puso el script. Se vuelve a poner acá; el efecto de
     Loader (hijo) corre antes que este, pero su aviso de "listo" llega como
     muy pronto en el cuadro siguiente, así que el orden se respeta. */
  useEffect(() => {
    document.documentElement.setAttribute(MARCA, "");
  }, []);

  return <Loader onDone={listo} />;
}
