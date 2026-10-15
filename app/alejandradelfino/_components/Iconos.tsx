/* Íconos de línea para los ejes, en el trazo grueso y redondeado de la
   referencia. Heredan el color del texto. */

const base = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ICONOS: Record<string, React.ReactNode> = {
  energia: (
    <svg {...base}>
      <path d="M32 58V24M28 58h8M32 24l-3-18M32 24l17 8M32 24L15 34" />
      <circle cx="32" cy="24" r="3" />
      <path d="M50 46l-6 8h6l-6 8" />
    </svg>
  ),
  origen: (
    <svg {...base}>
      <path d="M8 56h48M14 56V34l12 8V34l12 8V22h10v34" />
      <path d="M43 22c0-8 4-12 10-14-1 7-4 11-10 14z" />
      <path d="M22 50h4M34 50h4" />
    </svg>
  ),
  reglas: (
    <svg {...base}>
      <path d="M32 8v48M20 56h24M12 18h40" />
      <path d="M12 18L4 36a8 8 0 0016 0zM52 18l-8 18a8 8 0 0016 0z" />
      <circle cx="32" cy="12" r="3" />
    </svg>
  ),
  futuro: (
    <svg {...base}>
      <rect x="10" y="30" width="44" height="24" rx="4" />
      <path d="M18 38h10M18 46h10M42 38h4M42 46h4" />
      <path d="M20 22a17 17 0 0124 0M25 15a26 26 0 0114 0" />
      <circle cx="32" cy="24" r="2.5" />
    </svg>
  ),
};
