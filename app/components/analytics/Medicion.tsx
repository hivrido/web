"use client";

import { usePathname } from "next/navigation";
import GoogleTag from "./GoogleTag";
import WhatsAppConversion from "./WhatsAppConversion";

/* Sitios de terceros alojados en hivrido.com: no llevan la medición de
   Hivrido. El de Alejandra Delfino es de una dirigente política; ponerle el
   píxel publicitario de otra marca suma cookies de terceros que su aviso de
   privacidad no declara, y le cuesta casi medio segundo de hilo principal. */
const AJENAS = ["/alejandradelfino"];

export default function Medicion({ id }: { id: string }) {
  const ruta = usePathname() ?? "";
  if (AJENAS.some((r) => ruta.startsWith(r))) return null;
  return (
    <>
      <GoogleTag id={id} ga4={process.env.NEXT_PUBLIC_GA4_ID} />
      <WhatsAppConversion />
    </>
  );
}
