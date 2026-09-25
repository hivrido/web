import type { TipoEnlace } from "../lib/artistas";

/**
 * Íconos de las plataformas donde vive un artista.
 *
 * Dibujados a mano y no traídos de lucide-react: son ocho marcas y el paquete
 * entero pesa más que estas rutas. Todos comparten caja de 24 y `currentColor`
 * para que el hover de la fila los tiña sin que cada uno sepa nada del color.
 */

const RUTAS: Record<TipoEnlace, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.2v5.6l5-2.8z" fill="currentColor" stroke="none" />
    </>
  ),
  soundcloud: (
    <>
      <path d="M3 16v-4M6.5 16.5V10M10 16.5V7.5M13.5 16.5v-6" />
      <path d="M13.5 16.5h5.2a2.8 2.8 0 0 0 0-5.6c-.3 0-.6 0-.9.1A4.6 4.6 0 0 0 13.5 8" />
    </>
  ),
  spotify: (
    <>
      <circle cx="12" cy="12" r="9.3" />
      <path d="M7.4 9.6c3-.7 6.2-.4 8.9 1.1M8 12.6c2.4-.5 5-.3 7.2.9M8.6 15.4c1.9-.4 3.9-.2 5.6.7" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14 3.2v11.3a3.7 3.7 0 1 1-3.1-3.65" />
      <path d="M14 3.2a5.2 5.2 0 0 0 5.2 5.2" />
    </>
  ),
  facebook: (
    <>
      <circle cx="12" cy="12" r="9.3" />
      <path d="M13.2 21.2v-7.4h2.5l.4-2.9h-2.9V9.1c0-.8.3-1.4 1.4-1.4h1.6V5.1a19 19 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2h-2.5v2.9h2.5v7.4" />
    </>
  ),
  /* La K en bloque de Kick, con el mismo trazo que el resto. */
  kick: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M8.5 7v10M8.5 12l5-5M8.5 12l5 5" />
    </>
  ),
  threads: (
    <>
      <path d="M12 21.2c-5.2 0-8.4-3.4-8.4-9.2S6.8 2.8 12 2.8c4 0 6.7 1.9 7.8 5" />
      <path d="M8.9 13.6c0-1.9 1.7-3 4-3 3 0 4.6 1.6 4.6 4 0 2-1.3 3.3-3 3.3-1.5 0-2.4-.9-2.4-2.1 0-1.9 2-2.6 5.3-2.8" />
    </>
  ),
};

/** Nombre visible de la plataforma, para el pie de cada fila. */
export const NOMBRE_RED: Record<TipoEnlace, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
  spotify: "Spotify",
  tiktok: "TikTok",
  threads: "Threads",
  facebook: "Facebook",
  kick: "Kick",
};

export default function RedIcono({ tipo }: { tipo: TipoEnlace }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {RUTAS[tipo]}
    </svg>
  );
}
