/**
 * El fondo animado de cada puerta del hub "Hivrido sale de acá": un dibujo
 * de trazo fino en SVG, distinto para cada una y relacionado con lo que es.
 * Es decorado (aria-hidden). La animación vive en rytmos.css (`.pf-*`) y se
 * apaga con movimiento reducido.
 */

const hex = (r: number, cx = 60, cy = 60) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });

const DIBUJOS: Record<string, React.ReactNode> = {
  /* Hivrido PLAY: el play, un anillo que gira y ondas que salen. */
  "01": (
    <>
      <circle className="pf-gira" cx="60" cy="60" r="44" strokeDasharray="3 9" />
      <circle className="pf-onda" cx="60" cy="60" r="30" />
      <circle className="pf-onda pf-d2" cx="60" cy="60" r="30" />
      <path d="M52 44 L78 60 L52 76 Z" />
    </>
  ),
  /* Casting: el visor de la cámara con su REC. */
  "02": (
    <>
      <path d="M22 40V22h18M80 22h18v18M98 80v18H80M40 98H22V80" />
      <path className="pf-respira" d="M60 44v8M60 68v8M44 60h8M68 60h8" />
      <circle className="pf-rec" cx="60" cy="60" r="5" fill="currentColor" stroke="none" />
    </>
  ),
  /* La productora: el diafragma de la lente. */
  "03": (
    <>
      <circle cx="60" cy="60" r="42" />
      <g className="pf-gira-lento">
        {hex(42).map(([x, y], i) => {
          const [x2, y2] = hex(16)[(i + 1) % 6];
          return <line key={i} x1={x} y1={y} x2={x2} y2={y2} />;
        })}
        <polygon points={hex(16).map((p) => p.join(",")).join(" ")} />
      </g>
    </>
  ),
  /* Artistas: el ecualizador. */
  "04": (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} className="pf-barra" x1={24 + i * 12} y1="92" x2={24 + i * 12} y2="32" style={{ animationDelay: `${-i * 0.23}s` }} />
      ))}
      <line x1="16" y1="96" x2="104" y2="96" />
    </>
  ),
  /* Grow Digital: la curva que crece y se dibuja. */
  "05": (
    <>
      <path d="M18 98H102M18 98V20" strokeOpacity="0.5" />
      <path className="pf-dibuja" pathLength={100} d="M20 90 L40 76 L54 82 L72 56 L86 60 L100 28" />
      <circle className="pf-respira" cx="100" cy="28" r="4" fill="currentColor" stroke="none" />
    </>
  ),
  /* Branding: la construcción geométrica de una marca. */
  "06": (
    <>
      <circle className="pf-respira" cx="60" cy="60" r="34" />
      <rect className="pf-gira-lento" x="36" y="36" width="48" height="48" />
      <path d="M60 14V106M14 60H106" strokeDasharray="2 6" strokeOpacity="0.6" />
    </>
  ),
  /* Publicidad: la señal que sale en ondas. */
  "07": (
    <>
      <circle cx="60" cy="74" r="5" fill="currentColor" stroke="none" />
      <path className="pf-senal" d="M46 60a20 20 0 0 1 28 0" />
      <path className="pf-senal pf-d2" d="M36 50a34 34 0 0 1 48 0" />
      <path className="pf-senal pf-d3" d="M26 40a48 48 0 0 1 68 0" />
      <path d="M60 79V100M50 100H70" />
    </>
  ),
  /* Agentes IA: la red, con pulsos que viajan por las conexiones. */
  "08": (
    <>
      {[
        [24, 34, 60, 22], [24, 34, 60, 60], [24, 86, 60, 60], [24, 86, 60, 98],
        [60, 22, 96, 46], [60, 60, 96, 46], [60, 60, 96, 74], [60, 98, 96, 74],
      ].map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.45" />
          <line className="pf-pulso" pathLength={100} x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${-i * 0.4}s` }} />
        </g>
      ))}
      {[[24, 34], [24, 86], [60, 22], [60, 60], [60, 98], [96, 46], [96, 74]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill="#0d0717" />
      ))}
    </>
  ),
  /* Equipo: órbitas alrededor de un centro. */
  "09": (
    <>
      <circle cx="60" cy="60" r="7" />
      <circle cx="60" cy="60" r="26" strokeOpacity="0.5" />
      <circle cx="60" cy="60" r="44" strokeOpacity="0.35" />
      <g className="pf-gira"><circle cx="86" cy="60" r="4" fill="currentColor" stroke="none" /></g>
      <g className="pf-gira-lento"><circle cx="60" cy="16" r="4" fill="currentColor" stroke="none" /><circle cx="60" cy="104" r="3" fill="currentColor" stroke="none" /></g>
    </>
  ),
  /* Contacto: el chat, escribiendo. */
  "10": (
    <>
      <path d="M20 30h80a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H50l-18 16V82H20a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" />
      {[0, 1, 2].map((i) => (
        <circle key={i} className="pf-tipea" cx={44 + i * 16} cy="56" r="4" fill="currentColor" stroke="none" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </>
  ),
};

export default function PuertaFondo({ n }: { n: string }) {
  const dibujo = DIBUJOS[n];
  if (!dibujo) return null;
  return (
    <svg className="ry-door-svg" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {dibujo}
    </svg>
  );
}
