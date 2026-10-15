"use client";

import { MotionConfig } from "framer-motion";

/* Con "reducir movimiento" activo en el sistema, Framer resuelve todas las
   animaciones de transformación sin desplazamiento. */
export default function Movimiento({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
