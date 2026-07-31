"use client";

export default function PunyRobot() {
  return (
    <div className="puny-wrap" aria-label="Puny — IA de Hivrido">
      <svg
        viewBox="0 0 200 220"
        xmlns="http://www.w3.org/2000/svg"
        className="puny-svg"
      >
        <defs>
          {/* Body gradient — cream/white with violet tint */}
          <radialGradient id="pr-head" cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="35%"  stopColor="#f0eaff" />
            <stop offset="72%"  stopColor="#cebff0" />
            <stop offset="100%" stopColor="#9f84cc" />
          </radialGradient>
          {/* Bottom shadow on body */}
          <radialGradient id="pr-body-shd" cx="50%" cy="78%" r="45%">
            <stop offset="0%"   stopColor="#4c1d95" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
          </radialGradient>
          {/* Eye iris */}
          <radialGradient id="pr-eye-grad" cx="33%" cy="28%" r="56%">
            <stop offset="0%"   stopColor="#e0d4ff" />
            <stop offset="38%"  stopColor="#8b5cf6" />
            <stop offset="72%"  stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#2e1065" />
          </radialGradient>
          {/* Ambient glow */}
          <radialGradient id="pr-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.22" />
            <stop offset="55%"  stopColor="#7C3AED" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
          {/* Particle glow */}
          <radialGradient id="pr-ptcl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
          {/* Filters */}
          <filter id="pr-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pr-drop" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur stdDeviation="4.5" in="SourceAlpha" result="sh" />
            <feOffset dx="0" dy="8" result="off" />
            <feFlood floodColor="#1a0050" floodOpacity="0.5" result="col" />
            <feComposite in="col" in2="off" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ─── All animations — SVGator-style inline style ─── */}
        <style>{`
          /* Float: whole body bobs */
          #pr-char {
            animation: pr-float 5.2s cubic-bezier(0.37,0,0.63,1) infinite;
          }
          @keyframes pr-float {
            0%,100% { transform: translateY(0px) rotate(0.4deg); }
            25%     { transform: translateY(-5px) rotate(-1.2deg); }
            50%     { transform: translateY(-9px) rotate(0.3deg); }
            75%     { transform: translateY(-5px) rotate(-1.2deg); }
          }

          /* Shadow shrinks as body rises */
          #pr-shadow {
            transform-origin: 100px 214px;
            animation: pr-shadow-anim 5.2s cubic-bezier(0.37,0,0.63,1) infinite;
          }
          @keyframes pr-shadow-anim {
            0%,100% { transform: scaleX(1);    opacity: 0.14; }
            50%     { transform: scaleX(0.65); opacity: 0.06; }
          }

          /* LEFT ARM: gentle idle swing */
          #pr-arm-l {
            transform-origin: 0px 0px;
            animation: pr-arm-l-idle 5.2s cubic-bezier(0.37,0,0.63,1) infinite;
          }
          @keyframes pr-arm-l-idle {
            0%,100% { transform: rotate(0deg); }
            50%     { transform: rotate(7deg); }
          }

          /* RIGHT ARM upper: raises from 0 → -72° → stays → returns */
          #pr-arm-r-upper {
            transform-origin: 0px 0px;
            animation: pr-wave-upper 9s cubic-bezier(0.37,0,0.63,1) infinite;
          }
          @keyframes pr-wave-upper {
            0%,12%  { transform: rotate(0deg); }
            24%     { transform: rotate(-72deg); }
            62%     { transform: rotate(-72deg); }
            76%     { transform: rotate(0deg); }
            100%    { transform: rotate(0deg); }
          }

          /* RIGHT ARM lower: waves at elbow while arm is raised */
          #pr-arm-r-lower {
            transform-origin: 0px 0px;
            animation: pr-wave-lower 9s ease-in-out infinite;
          }
          @keyframes pr-wave-lower {
            0%,24%  { transform: rotate(0deg); }
            30%     { transform: rotate(38deg); }
            37%     { transform: rotate(-22deg); }
            44%     { transform: rotate(38deg); }
            51%     { transform: rotate(-22deg); }
            58%     { transform: rotate(38deg); }
            65%     { transform: rotate(-12deg); }
            70%,100%{ transform: rotate(0deg); }
          }

          /* ANTENNA: sway + orb pulse */
          #pr-antenna {
            transform-origin: 100px 36px;
            animation: pr-ant-sway 5.2s cubic-bezier(0.37,0,0.63,1) infinite;
          }
          @keyframes pr-ant-sway {
            0%,100% { transform: rotate(0deg); }
            25%     { transform: rotate(4deg); }
            75%     { transform: rotate(-4deg); }
          }
          #pr-ant-orb {
            animation: pr-orb 2.4s ease-in-out infinite;
          }
          @keyframes pr-orb {
            0%,100% { opacity: 1;   }
            50%     { opacity: 0.2; }
          }

          /* EYES: blink */
          #pr-lid-l, #pr-lid-r {
            transform-box: fill-box;
            transform-origin: 50% 0%;
            transform: scaleY(0);
            animation: pr-blink 6.8s ease-in-out infinite;
          }
          #pr-lid-r { animation-delay: 0.08s; }
          @keyframes pr-blink {
            0%,87%,100% { transform: scaleY(0); }
            91%         { transform: scaleY(1); }
            94%         { transform: scaleY(0); }
          }

          /* EYES: iris look around */
          #pr-iris-l {
            animation: pr-look 10s ease-in-out infinite;
          }
          #pr-iris-r {
            animation: pr-look 10s ease-in-out infinite 0.4s;
          }
          @keyframes pr-look {
            0%,100% { transform: translate(0,0);       }
            15%     { transform: translate(3px,1px);   }
            32%     { transform: translate(3px,-2px);  }
            50%     { transform: translate(-3px,-1px); }
            68%     { transform: translate(-2px,2px);  }
            85%     { transform: translate(0,0);       }
          }

          /* Eye halo breathe */
          #pr-halo-l, #pr-halo-r {
            animation: pr-halo 3s ease-in-out infinite;
          }
          @keyframes pr-halo {
            0%,100% { opacity: 0.1;  }
            50%     { opacity: 0.28; }
          }

          /* Nose LED */
          #pr-nose {
            animation: pr-nose-glow 3.6s ease-in-out infinite;
          }
          @keyframes pr-nose-glow {
            0%,100% { opacity: 0.45; }
            50%     { opacity: 0.95; }
          }

          /* Floating particles */
          #pr-p1 { animation: pr-pfloat 4.2s ease-in-out infinite 0s; }
          #pr-p2 { animation: pr-pfloat 5.1s ease-in-out infinite -2s; }
          #pr-p3 { animation: pr-pfloat 3.8s ease-in-out infinite -1s; }
          #pr-p4 { animation: pr-pfloat 4.7s ease-in-out infinite -2.5s; }
          #pr-p5 { animation: pr-pfloat 5.3s ease-in-out infinite -1.3s; }
          @keyframes pr-pfloat {
            0%,100% { transform: translateY(0);    opacity: 0.7; }
            50%     { transform: translateY(-9px); opacity: 1; }
          }

          /* Feet: subtle scale on float */
          #pr-feet {
            transform-origin: 100px 175px;
            animation: pr-feet-anim 5.2s cubic-bezier(0.37,0,0.63,1) infinite;
          }
          @keyframes pr-feet-anim {
            0%,100% { transform: scaleX(1);   }
            50%     { transform: scaleX(0.88);}
          }
        `}</style>

        {/* ── Floating particles ── */}
        <circle id="pr-p1" cx="18"  cy="48"  r="6" fill="url(#pr-ptcl)" filter="url(#pr-glow)" />
        <circle id="pr-p2" cx="182" cy="34"  r="8" fill="url(#pr-ptcl)" filter="url(#pr-glow)" />
        <circle id="pr-p3" cx="12"  cy="168" r="5" fill="url(#pr-ptcl)" filter="url(#pr-glow)" />
        <circle id="pr-p4" cx="188" cy="155" r="7" fill="url(#pr-ptcl)" filter="url(#pr-glow)" />
        <circle id="pr-p5" cx="155" cy="195" r="4" fill="url(#pr-ptcl)" filter="url(#pr-glow)" />

        {/* ── Ambient radial glow ── */}
        <ellipse cx="100" cy="105" rx="88" ry="85" fill="url(#pr-ambient)" />

        {/* ── Ground shadow ── */}
        <ellipse id="pr-shadow" cx="100" cy="214" rx="50" ry="7" fill="#7C3AED" opacity="0.14" />

        {/* ── Full character (floats) ── */}
        <g id="pr-char">

          {/* ── LEFT ARM: shoulder at (37, 112), total ~40px ── */}
          <g transform="translate(37,112)">
            <g id="pr-arm-l">
              {/* Upper arm: 0,0 → elbow at (-12, 20) */}
              <path d="M0,0 C-5,5 -10,13 -12,20" fill="none" stroke="#cbbee0" strokeWidth="11" strokeLinecap="round" />
              <path d="M0,0 C-5,5 -10,13 -12,20" fill="none" stroke="#ede6ff" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M0,0 C-5,5 -10,13 -12,20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="2.5 6" strokeOpacity="0.4" />
              {/* Elbow joint */}
              <circle cx="-12" cy="20" r="8"   fill="#cbbee0" />
              <circle cx="-12" cy="20" r="5.5" fill="#ede6ff" />
              <circle cx="-12" cy="20" r="3"   fill="#b89ee0" />
              <circle cx="-12" cy="20" r="1.5" fill="#7C3AED" opacity="0.6" filter="url(#pr-glow)" />
              {/* Lower arm: elbow (−12,20) → hand at (−12, 42) */}
              <path d="M-12,20 C-13,28 -13,34 -12,42" fill="none" stroke="#cbbee0" strokeWidth="10" strokeLinecap="round" />
              <path d="M-12,20 C-13,28 -13,34 -12,42" fill="none" stroke="#ede6ff" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M-12,20 C-13,28 -13,34 -12,42" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.5 6" strokeOpacity="0.35" />
              {/* Hand orb */}
              <circle cx="-12" cy="42" r="10"  fill="#cbbee0" />
              <circle cx="-12" cy="42" r="7"   fill="#e8deff" />
              <circle cx="-12" cy="42" r="3.8" fill="#7C3AED" opacity="0.45" filter="url(#pr-glow)" />
              <circle cx="-12" cy="42" r="1.8" fill="#ddd6fe" />
            </g>
          </g>

          {/* ── RIGHT ARM: 2-joint wave ──
               Shoulder at (163, 112)
               Upper arm → elbow at (12, 20) in local space
               Lower arm → hand at (0, 22) relative to elbow
               At -72° raise: elbow lands at ~(183, 104) — within viewBox
               Hand at max wave: ~(195, 118) — within viewBox              ── */}
          <g transform="translate(163,112)">
            {/* Upper arm rotates at shoulder (0,0) */}
            <g id="pr-arm-r-upper">
              {/* Upper arm: 0,0 → elbow at (12, 20) */}
              <path d="M0,0 C5,5 10,13 12,20" fill="none" stroke="#cbbee0" strokeWidth="11" strokeLinecap="round" />
              <path d="M0,0 C5,5 10,13 12,20" fill="none" stroke="#ede6ff" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M0,0 C5,5 10,13 12,20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="2.5 6" strokeOpacity="0.4" />
              {/* Elbow joint */}
              <circle cx="12" cy="20" r="8"   fill="#cbbee0" />
              <circle cx="12" cy="20" r="5.5" fill="#ede6ff" />
              <circle cx="12" cy="20" r="3"   fill="#b89ee0" />
              <circle cx="12" cy="20" r="1.5" fill="#7C3AED" opacity="0.6" filter="url(#pr-glow)" />
              {/* Lower arm pivots at elbow (12, 20) */}
              <g transform="translate(12,20)">
                <g id="pr-arm-r-lower">
                  {/* Lower arm: 0,0 → hand at (0, 22) */}
                  <path d="M0,0 C1,8 1,15 0,22" fill="none" stroke="#cbbee0" strokeWidth="10" strokeLinecap="round" />
                  <path d="M0,0 C1,8 1,15 0,22" fill="none" stroke="#ede6ff" strokeWidth="6.5" strokeLinecap="round" />
                  <path d="M0,0 C1,8 1,15 0,22" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.5 6" strokeOpacity="0.35" />
                  {/* Hand orb */}
                  <circle cx="0" cy="22" r="10"  fill="#cbbee0" />
                  <circle cx="0" cy="22" r="7"   fill="#e8deff" />
                  <circle cx="0" cy="22" r="3.8" fill="#7C3AED" opacity="0.45" filter="url(#pr-glow)" />
                  <circle cx="0" cy="22" r="1.8" fill="#ddd6fe" />
                </g>
              </g>
            </g>
          </g>

          {/* ── FEET ── */}
          <g id="pr-feet">
            <ellipse cx="79"  cy="175" rx="22" ry="14" fill="#bfaedc" />
            <ellipse cx="79"  cy="173" rx="16" ry="9"  fill="#ddd4f5" />
            <ellipse cx="121" cy="175" rx="22" ry="14" fill="#bfaedc" />
            <ellipse cx="121" cy="173" rx="16" ry="9"  fill="#ddd4f5" />
            <circle cx="73"  cy="176" r="3" fill="#7C3AED" opacity="0.5" filter="url(#pr-glow)" />
            <circle cx="127" cy="176" r="3" fill="#7C3AED" opacity="0.5" filter="url(#pr-glow)" />
          </g>

          {/* ── MAIN BODY / HEAD ── */}
          <g filter="url(#pr-drop)">
            {/* Round body */}
            <ellipse cx="100" cy="100" rx="70" ry="67" fill="url(#pr-head)" />
            {/* Bottom shadow */}
            <ellipse cx="100" cy="100" rx="70" ry="67" fill="url(#pr-body-shd)" />
            {/* Top specular */}
            <ellipse cx="84" cy="68"  rx="30" ry="20" fill="#ffffff" opacity="0.32" />
            {/* Rim */}
            <ellipse cx="100" cy="100" rx="70" ry="67" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.18" />

            {/* ── LEFT EYE ── */}
            <ellipse cx="75" cy="99" rx="23" ry="21" fill="#160424" stroke="#3b1375" strokeWidth="0.6" />
            <ellipse id="pr-halo-l" cx="75" cy="99" rx="19" ry="17" fill="#7C3AED" opacity="0.1" />
            <ellipse id="pr-iris-l" cx="75" cy="99" rx="15" ry="14" fill="url(#pr-eye-grad)" filter="url(#pr-glow)" />
            <circle cx="75" cy="99" r="6"    fill="#0a0115" />
            <circle cx="75" cy="99" r="4.2"  fill="#ffffff" opacity="0.92" />
            <circle cx="79" cy="96" r="2"    fill="#ffffff" opacity="0.6" />
            <circle cx="71" cy="103" r="1.3" fill="#c4b5fd" opacity="0.45" />
            <ellipse id="pr-lid-l" cx="75" cy="99" rx="23" ry="21" fill="#160424" />

            {/* ── RIGHT EYE ── */}
            <ellipse cx="125" cy="99" rx="23" ry="21" fill="#160424" stroke="#3b1375" strokeWidth="0.6" />
            <ellipse id="pr-halo-r" cx="125" cy="99" rx="19" ry="17" fill="#7C3AED" opacity="0.1" />
            <ellipse id="pr-iris-r" cx="125" cy="99" rx="15" ry="14" fill="url(#pr-eye-grad)" filter="url(#pr-glow)" />
            <circle cx="125" cy="99" r="6"    fill="#0a0115" />
            <circle cx="125" cy="99" r="4.2"  fill="#ffffff" opacity="0.92" />
            <circle cx="129" cy="96" r="2"    fill="#ffffff" opacity="0.6" />
            <circle cx="121" cy="103" r="1.3" fill="#c4b5fd" opacity="0.45" />
            <ellipse id="pr-lid-r" cx="125" cy="99" rx="23" ry="21" fill="#160424" />

            {/* Nose LED */}
            <circle id="pr-nose" cx="100" cy="117" r="2.8" fill="#a78bfa" opacity="0.55" filter="url(#pr-glow)" />

            {/* Mouth */}
            <path d="M83,128 Q100,140 117,128" fill="none" stroke="#a890cc" strokeWidth="3"   strokeLinecap="round" />
            <path d="M83,128 Q100,140 117,128" fill="none" stroke="#ddd6fe" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />

            {/* Cheek blush */}
            <ellipse cx="58"  cy="116" rx="14" ry="8" fill="#c4b5fd" opacity="0.1" />
            <ellipse cx="142" cy="116" rx="14" ry="8" fill="#c4b5fd" opacity="0.1" />
          </g>

          {/* ── ANTENNA ── */}
          <g id="pr-antenna">
            <line x1="100" y1="36" x2="100" y2="22" stroke="#b8a8d8" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="100" cy="18" r="8"   fill="none" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="100" cy="18" r="6"   fill="#1e0a40" />
            <circle id="pr-ant-orb" cx="100" cy="18" r="4" fill="#6d28d9" filter="url(#pr-glow)" />
            <circle cx="100" cy="18" r="2"   fill="#c4b5fd" />
            <circle cx="98.5" cy="16.5" r="0.9" fill="#ffffff" opacity="0.7" />
          </g>

        </g>
      </svg>
    </div>
  );
}
