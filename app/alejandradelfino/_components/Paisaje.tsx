/* Paisaje ilustrado que ocupa el lugar de una foto sin licencia: cielo de
   atardecer, sol y dos cordones de sierra en el color de la región. Mismo
   formato 4:3 que las polaroids, para que el tablero no cambie de forma. */
export default function Paisaje({ color = "#6a2ac0", className = "" }: { color?: string; className?: string }) {
  return (
    <svg className={`ad-paisaje ${className}`} viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill="#fbe8cc" />
      <rect width="400" height="170" fill="#f6cf98" opacity="0.55" />
      <circle cx="292" cy="96" r="36" fill="#ffd27a" />
      <path d="M0,206 L64,146 L116,184 L188,104 L258,172 L314,128 L400,196 V300 H0 Z" fill={color} opacity="0.45" />
      <path d="M0,238 L86,192 L158,224 L238,176 L326,228 L400,206 V300 H0 Z" fill={color} opacity="0.85" />
      <path d="M0,272 Q200,252 400,272 V300 H0 Z" fill="#24163f" opacity="0.22" />
    </svg>
  );
}
