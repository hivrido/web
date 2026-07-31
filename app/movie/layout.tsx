import type { Metadata } from "next";
import "./movie.css";

export const metadata: Metadata = {
  title: "Hivrido PLAY — Cine y Series en Español",
  description:
    "La plataforma de streaming de habla hispana. Cine, series, documentales y música en un solo lugar.",
};

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
