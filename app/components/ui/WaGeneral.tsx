"use client";

import { usePathname } from "next/navigation";
import { mensajeGeneral, whatsapp } from "../../lib/contacto";

/**
 * Enlace a WhatsApp de los contactos que se repiten en todas las páginas
 * (menú, pie, botón flotante). El mensaje dice desde qué sección se escribe.
 */
export default function WaGeneral({
  lugar,
  children,
  ...rest
}: {
  lugar: "el menú" | "el pie" | "el botón de WhatsApp";
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">) {
  const ruta = usePathname() ?? "/";
  return (
    <a href={whatsapp(mensajeGeneral(ruta, lugar))} target="_blank" rel="noopener noreferrer" data-wa-origen={lugar} {...rest}>
      {children}
    </a>
  );
}
