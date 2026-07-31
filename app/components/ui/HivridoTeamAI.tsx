"use client";

export default function HivridoTeamAI() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_42%),linear-gradient(180deg,#09060f_0%,#05030a_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
        <div className="text-center">
          <div className="text-white text-2xl tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900 }}>PUNY</div>
          <div className="text-violet-400 text-[11px] tracking-[0.24em] uppercase mt-1">AI · HIVRIDO CORE</div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-violet-500/20 blur-3xl animate-pulse" />
          <svg
            viewBox="0 0 420 420"
            className="w-[180px] md:w-[220px] drop-shadow-[0_0_40px_rgba(124,58,237,0.38)]"
            role="img"
            aria-label="PUNY team member"
          >
            <defs>
              <linearGradient id="htai-bodyGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#c4b5fd" />
                <stop offset="38%"  stopColor="#8b5cf6" />
                <stop offset="72%"  stopColor="#6d28d9" />
                <stop offset="100%" stopColor="#2e1065" />
              </linearGradient>
              <linearGradient id="htai-metal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.3" />
              </linearGradient>
              <filter id="htai-softGlow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <style>{`
              @keyframes htai-float {
                0%,100% { transform: translateY(0px); }
                50%     { transform: translateY(-8px); }
              }
              @keyframes htai-wave {
                0%,100% { transform: rotate(0deg); }
                18%     { transform: rotate(-9deg); }
                36%     { transform: rotate(7deg); }
                54%     { transform: rotate(-7deg); }
                72%     { transform: rotate(5deg); }
              }
              @keyframes htai-blink {
                0%,46%,50%,100% { transform: scaleY(1); }
                48%             { transform: scaleY(0.1); }
              }
              #htai-char  { animation: htai-float 4.8s ease-in-out infinite; }
              #htai-arm   {
                transform-origin: 285px 185px;
                animation: htai-wave 2.2s ease-in-out infinite;
              }
              #htai-eye-l {
                transform-origin: 189px 149px;
                animation: htai-blink 5s ease-in-out infinite;
              }
              #htai-eye-r {
                transform-origin: 233px 149px;
                animation: htai-blink 5s ease-in-out infinite 0.1s;
              }
            `}</style>

            <ellipse cx="210" cy="360" rx="95" ry="24"
              fill="rgba(124,58,237,0.24)"
              filter="url(#htai-softGlow)"
            />

            <g id="htai-char">
              {/* Left arm */}
              <g>
                <path
                  d="M132 185c-18 8-33 24-42 48-6 16-3 28 10 34 12 6 25 0 33-13 8-12 18-29 28-49"
                  fill="url(#htai-bodyGlow)" opacity="0.9"
                />
                <circle cx="112" cy="264" r="18"
                  fill="url(#htai-metal)"
                  stroke="#f5e9ff" strokeWidth="2"
                />
              </g>

              {/* Body */}
              <g filter="url(#htai-softGlow)">
                <path
                  d="M210 78c53 0 98 43 98 96v70c0 51-40 92-90 92h-16c-50 0-90-41-90-92v-70c0-53 45-96 98-96Z"
                  fill="url(#htai-bodyGlow)"
                  stroke="#f5e9ff" strokeOpacity="0.7" strokeWidth="3"
                />
                <path
                  d="M210 95c43 0 78 35 78 78v69c0 39-31 71-70 71h-16c-39 0-70-32-70-71v-69c0-43 35-78 78-78Z"
                  fill="rgba(10,6,18,0.28)"
                />
                <path d="M168 205h84" stroke="#f3e8ff" strokeOpacity="0.22" strokeWidth="2" />
                <path d="M158 234h104" stroke="#f3e8ff" strokeOpacity="0.18" strokeWidth="2" />
              </g>

              {/* Face */}
              <g>
                <ellipse cx="210" cy="152" rx="62" ry="50" fill="rgba(7,4,14,0.24)" />
                <ellipse cx="188" cy="147" rx="10" ry="13" fill="#fff" />
                <ellipse cx="232" cy="147" rx="10" ry="13" fill="#fff" />
                <circle id="htai-eye-l" cx="189" cy="149" r="4" fill="#2e1065" />
                <circle id="htai-eye-r" cx="233" cy="149" r="4" fill="#2e1065" />
                <path
                  d="M189 178c14 10 28 10 42 0"
                  stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.9"
                />
                <path
                  d="M175 120c11-8 24-12 35-12M244 120c-10-8-22-12-34-12"
                  stroke="#ffffff" strokeOpacity="0.65" strokeWidth="4" strokeLinecap="round"
                />
              </g>

              {/* H logo on body */}
              <g filter="url(#htai-softGlow)">
                <path
                  d="M183 198h21l10 41 11-41h22l-28 69h-9l-27-69Z"
                  fill="#f8f2ff" opacity="0.92"
                />
                <path d="M191 202h14l9 35 9-35h15l-19 49h-8l-20-49Z" fill="#7c3aed" />
              </g>

              {/* Right arm (waves) */}
              <g id="htai-arm" filter="url(#htai-softGlow)">
                <path
                  d="M286 184c18 8 32 22 43 44 8 17 14 35 13 53-1 16-14 23-27 20-16-3-21-16-23-31-3-21-4-43-6-68"
                  fill="url(#htai-bodyGlow)"
                />
                <circle cx="322" cy="286" r="22"
                  fill="url(#htai-metal)"
                  stroke="#f5e9ff" strokeWidth="2"
                />
                <path
                  d="M312 277c6-10 15-12 23-10M320 294c5-5 10-7 16-6"
                  stroke="#5b21b6" strokeWidth="2.6" strokeLinecap="round" opacity="0.7"
                />
              </g>

              <circle cx="210" cy="118" r="92" fill="rgba(139,92,246,0.14)" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
}
