"use client";
import { useCallback, useState } from "react";
import Loader from "./Loader";
import Cursor from "../ui/Cursor";
import SmoothScroll from "../ui/SmoothScroll";
import WhatsAppBtn from "../ui/WhatsAppBtn";

/**
 * `preloader={false}` en las rutas que entran directo desde buscadores y
 * anuncios: la cortina se renderiza opaca desde el servidor y tapa la página
 * hasta que hidrata y corre su segundo y pico, que en un teléfono medio es
 * todo el FCP y el LCP.
 */
export default function ClientShell({
  children,
  preloader = true,
}: {
  children: React.ReactNode;
  preloader?: boolean;
}) {
  const [, forceUpdate] = useState(0);
  const handleDone = useCallback(() => forceUpdate(n => n + 1), []);

  return (
    <>
      <SmoothScroll />
      <Cursor />
      {preloader && <Loader onDone={handleDone} />}
      <WhatsAppBtn />
      <div id="main" className="visible">
        {children}
      </div>
    </>
  );
}
