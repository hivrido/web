"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* Chubut de oeste a este en una sola escena: la cordillera, la meseta con
   sus molinos, el campo de tulipanes y el mar con la ballena. Es SVG puro
   —ningún archivo que bajar— y cada capa entra y se mueve por separado. */

const EASE = [0.22, 1, 0.36, 1] as const;

const MOLINOS = [
  { x: 712, y: 602, h: 112, dur: 7 },
  { x: 792, y: 598, h: 146, dur: 5.6 },
  { x: 884, y: 600, h: 128, dur: 6.4 },
  { x: 952, y: 602, h: 98, dur: 8 },
];

const TULIPANES = ["#E5484D", "#F7B32B", "#E85D9A", "#8E44C9", "#F27A2E", "#E5484D", "#F7B32B", "#E85D9A", "#8E44C9", "#F27A2E", "#E5484D"];

/* Surcos en perspectiva: arriba se juntan hacia el horizonte, abajo se abren
   más allá del borde. Cada surco es la franja de flores más una línea verde. */
function surcos() {
  const n = TULIPANES.length;
  const [topY, botY] = [688, 900];
  const [t0, t1] = [180, 930];
  const [b0, b1] = [-520, 1240];
  const tw = (t1 - t0) / n;
  const bw = (b1 - b0) / n;
  return TULIPANES.map((color, i) => {
    const tx = t0 + i * tw;
    const bx = b0 + i * bw;
    const d = `M${tx},${topY} L${tx + tw * 0.82},${topY} L${bx + bw * 0.82},${botY} L${bx},${botY} Z`;
    return { d, color };
  });
}

export function Molino({ x, y, h, dur, girar }: (typeof MOLINOS)[number] & { girar: boolean }) {
  const hub = y - h;
  const largo = h * 0.46;
  return (
    <g>
      <path d={`M${x - 3.2},${y} L${x - 1.4},${hub} L${x + 1.4},${hub} L${x + 3.2},${y} Z`} fill="#FFF8EC" />
      <g transform={`translate(${x},${hub})`}>
        <g>
          {[0, 120, 240].map((a) => (
            <path
              key={a}
              transform={`rotate(${a})`}
              d={`M0,0 L-3.4,${-largo * 0.16} L-0.6,${-largo} L1.4,${-largo * 0.97} L3,${-largo * 0.16} Z`}
              fill="#FFF8EC"
            />
          ))}
          {girar && (
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${dur}s`} repeatCount="indefinite" />
          )}
        </g>
        <circle r="3.6" fill="#FFF1D6" />
      </g>
    </g>
  );
}

function Capa({
  children,
  delay,
  from = 50,
  paralaje,
}: {
  children: React.ReactNode;
  delay: number;
  from?: number;
  paralaje?: MotionValue<number>;
}) {
  return (
    <motion.g style={{ y: paralaje }}>
      <motion.g
        initial={{ y: from, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, delay, ease: EASE }}
      >
        {children}
      </motion.g>
    </motion.g>
  );
}

export default function HeroScene({ progreso }: { progreso: MotionValue<number> }) {
  const reducir = useReducedMotion() ?? false;
  const sol = useTransform(progreso, [0, 1], [0, 140]);
  const lejos = useTransform(progreso, [0, 1], [0, 90]);
  const medio = useTransform(progreso, [0, 1], [0, 50]);

  return (
    <svg className="ad-hero-scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ad-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1159" />
          <stop offset="0.34" stopColor="#6A2AC0" />
          <stop offset="0.62" stopColor="#D9677A" />
          <stop offset="0.82" stopColor="#FFB86B" />
          <stop offset="1" stopColor="#FFE2A6" />
        </linearGradient>
        <radialGradient id="ad-resplandor">
          <stop offset="0" stopColor="#FFF4CF" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#FFD58A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFB86B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ad-mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FD6CF" />
          <stop offset="0.35" stopColor="#2FA7AC" />
          <stop offset="1" stopColor="#0B5F6B" />
        </linearGradient>
        <linearGradient id="ad-suelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8C97E" />
          <stop offset="0.3" stopColor="#A9B85C" />
          <stop offset="1" stopColor="#5E8A36" />
        </linearGradient>
        <linearGradient id="ad-niebla" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE2A6" stopOpacity="0" />
          <stop offset="1" stopColor="#FFE2A6" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="ad-fundido" x1="0" y1="0" x2="0" y2="1">
          {/* var() no vale como atributo de presentación, sí como estilo. */}
          <stop offset="0" style={{ stopColor: "var(--ad-pared)", stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: "var(--ad-pared)" }} />
        </linearGradient>
        <pattern id="ad-flores" width="14" height="10" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.6" fill="#fff" />
          <circle cx="10" cy="8" r="1.3" fill="#fff" />
        </pattern>
        <clipPath id="ad-superficie">
          <rect x="1120" y="560" width="320" height="140" />
        </clipPath>
      </defs>

      <rect width="1440" height="900" fill="url(#ad-cielo)" />

      <Capa delay={0.15} from={140} paralaje={sol}>
        <circle cx="1060" cy="560" r="330" fill="url(#ad-resplandor)" />
        <circle cx="1060" cy="560" r="78" fill="#FFF3CC" />
      </Capa>

      <Capa delay={0.3} paralaje={lejos}>
        <path
          d="M0,470 L60,420 L110,452 L172,356 L216,412 L262,326 L322,424 L382,378 L436,440 L500,402 L566,468 L650,500 L770,556 L900,600 L0,600 Z"
          fill="#9C7FD9"
          opacity="0.6"
        />
        <path d="M172,356 L194,388 L180,384 L170,396 L156,380 Z M262,326 L290,368 L273,362 L260,376 L243,358 Z" fill="#FFFFFF" opacity="0.85" />
        <rect y="430" width="1440" height="180" fill="url(#ad-niebla)" />
      </Capa>

      <Capa delay={0.45} paralaje={medio}>
        <path
          d="M0,540 L52,498 L104,520 L156,448 L204,500 L254,468 L306,522 L364,500 L424,546 L524,562 L650,592 L0,620 Z"
          fill="#5B3A9C"
        />
        <path d="M156,448 L176,474 L163,470 L152,482 L141,466 Z" fill="#FFFFFF" opacity="0.75" />
      </Capa>

      <Capa delay={0.5} from={30}>
        <rect x="960" y="598" width="480" height="302" fill="url(#ad-mar)" />
        <g className="ad-brillos" stroke="#FFFFFF" strokeLinecap="round">
          <path d="M1180,626 h46 M1300,650 h60 M1210,690 h30 M1340,720 h52 M1250,760 h70" strokeWidth="2" />
        </g>
      </Capa>

      <Capa delay={0.55} from={40}>
        <path d="M0,598 Q520,584 1000,596 L1046,600 Q1070,640 1098,702 Q1128,780 1166,900 L0,900 Z" fill="url(#ad-suelo)" />
      </Capa>

      <Capa delay={0.75} from={70}>
        {MOLINOS.map((m) => (
          <Molino key={m.x} {...m} girar={!reducir} />
        ))}
      </Capa>

      <Capa delay={0.85} from={90}>
        <g>
          {surcos().map((s, i) => (
            <path key={i} d={s.d} fill={s.color} />
          ))}
          <path d="M-600,688 H1100 V900 H-600 Z" fill="url(#ad-flores)" opacity="0.22" />
          <rect x="0" y="684" width="1100" height="26" fill="#A9B85C" opacity="0.55" />
        </g>
      </Capa>

      <g clipPath="url(#ad-superficie)">
        <motion.g
          initial={{ y: 90 }}
          animate={reducir ? { y: 8 } : { y: [90, 0, 0, 90] }}
          transition={
            reducir
              ? { duration: 0 }
              : { duration: 7, times: [0, 0.28, 0.62, 1], delay: 1.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }
          }
        >
          <g transform="translate(1262,700)">
            <path
              d="M-8,0 L-5,-40 C-20,-45 -45,-55 -62,-76 C-40,-70 -20,-70 0,-60 C20,-70 40,-70 62,-76 C45,-55 20,-45 5,-40 L8,0 Z"
              fill="#24163F"
            />
          </g>
        </motion.g>
      </g>
      <ellipse cx="1262" cy="701" rx="34" ry="4.5" fill="#FFFFFF" opacity="0.45" />

      <rect y="800" width="1440" height="100" fill="url(#ad-fundido)" />
    </svg>
  );
}

/* El progreso de scroll del hero, compartido entre la escena y el texto. */
export function useProgresoHero(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return scrollYProgress;
}
