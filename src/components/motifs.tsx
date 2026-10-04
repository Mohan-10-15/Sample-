/* Decorative SVG motifs — original, inspired-by styling only.
   No studio logos, no film stills, no likenesses. All aria-hidden. */

export function Overlays() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Film grain */}
      <div className="bg-grain-svg absolute inset-0 opacity-[0.055] mix-blend-overlay" />
    </div>
  );
}

export function Crest({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 104 128"
      role="img"
      aria-label="Crest of the Whitehat Club"
      className={className}
      fill="none"
    >
      {/* Shield */}
      <path
        d="M52 4 L92 14 L92 62 C92 92 74 112 52 124 C30 112 12 92 12 62 L12 14 Z"
        stroke="#C9A227"
        strokeWidth="3"
        fill="#3D0810"
      />
      <path
        d="M52 12 L84 20 L84 60 C84 86 70 103 52 114 C34 103 20 86 20 60 L20 20 Z"
        stroke="#C9A227"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      {/* Monogram */}
      <text
        x="52"
        y="72"
        textAnchor="middle"
        fill="#E4C765"
        fontFamily="Georgia, serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="1"
      >
        O
      </text>
      <text
        x="52"
        y="92"
        textAnchor="middle"
        fill="#C9A227"
        fontFamily="Courier Prime, monospace"
        fontSize="10"
        letterSpacing="3"
      >
        MC
      </text>
      {/* Stars */}
      <path d="M26 40 l2.6 5.4 5.9 0.8 -4.3 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.3 -4.1 5.9 -0.8 Z" fill="#C9A227" />
      <path d="M78 40 l2.6 5.4 5.9 0.8 -4.3 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.3 -4.1 5.9 -0.8 Z" fill="#C9A227" />
      <circle cx="52" cy="30" r="2.2" fill="#C9A227" />
      {/* Laurel — left */}
      <path d="M16 52 C6 60 8 78 18 88" stroke="#E4C765" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 54 C10 62 12 70 18 76" stroke="#E4C765" strokeWidth="1.2" opacity="0.8" />
      {/* Laurel — right */}
      <path d="M88 52 C98 60 96 78 86 88" stroke="#E4C765" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M87 54 C94 62 92 70 86 76" stroke="#E4C765" strokeWidth="1.2" opacity="0.8" />
    </svg>
  );
}

export function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden
      className={className}
      role="presentation"
    >
      <defs>
        <radialGradient id="wax-grad" cx="35%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#8A1623" />
          <stop offset="55%" stopColor="#6B0F1A" />
          <stop offset="100%" stopColor="#3D0810" />
        </radialGradient>
      </defs>
      {/* Scalloped outer edge */}
      <circle cx="60" cy="60" r="58" fill="#3D0810" />
      <circle cx="60" cy="60" r="58" fill="none" stroke="#C9A227" strokeWidth="2" />
      <circle cx="60" cy="60" r="54" fill="url(#wax-grad)" />
      <circle cx="60" cy="60" r="43" fill="none" stroke="#E4C765" strokeWidth="1.4" strokeDasharray="1 5" opacity="0.9" />
      {/* Monogram */}
      <text
        x="60"
        y="59"
        textAnchor="middle"
        fill="#EFE6D8"
        fontFamily="Georgia, serif"
        fontSize="30"
        fontWeight="700"
      >
        O
      </text>
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fill="#E4C765"
        fontFamily="Courier Prime, monospace"
        fontSize="9"
        letterSpacing="2"
      >
        2026
      </text>
      <circle cx="60" cy="60" r="46" fill="none" stroke="#EFE6D8" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

export function Smoke({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="smoke-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[
        { d: "M60 260 C72 210 52 180 70 140 C86 104 66 74 82 30", dur: "11s", delay: "0s" },
        { d: "M170 260 C190 220 168 190 184 150 C198 116 178 84 196 40", dur: "13s", delay: "2.4s" },
        { d: "M300 260 C314 226 298 198 312 158 C324 126 306 96 322 52", dur: "12s", delay: "1.2s" },
      ].map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke="url(#smoke-grad)"
          strokeWidth="26"
          strokeLinecap="round"
          style={{ animation: `smoke ${s.dur} ease-out ${s.delay} infinite` }}
        />
      ))}
    </svg>
  );
}

export function Marionette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 340"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {[40, 100, 160].map((x, i) => (
        <g key={i} opacity={0.5 - i * 0.13}>
          <line x1={x} y1="10" x2={x} y2={300} stroke="#C9A227" strokeWidth="1" strokeDasharray="1 5" />
          <line x1={x} y1="300" x2={x} y2={318} stroke="#C9A227" strokeWidth="1.6" />
          <circle cx={x} cy={326} r="6" fill="#6B0F1A" stroke="#C9A227" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

export function Rose({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 160"
      aria-hidden
      className={className}
    >
      {/* Stem */}
      <path d="M40 62 C40 96 42 124 40 152" stroke="#4A5D2A" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M40 104 C26 92 24 108 40 112 C56 108 54 92 40 104 Z" fill="#5C7536" />
      <path d="M40 104 C31 99 29 108 40 112" stroke="#3D4A22" strokeWidth="1.2" fill="none" />
      {/* Calyx */}
      <path d="M36 66 L40 60 L44 66 L40 74 Z" fill="#4A5D2A" />
      {/* Petals */}
      <path d="M40 34 C30 22 18 32 24 44 C18 54 34 62 40 52 C46 62 62 54 56 44 C62 32 50 22 40 34 Z" fill="#6B0F1A" />
      <path d="M40 22 C32 10 20 18 26 30 C20 40 36 48 40 38 C44 48 60 40 54 30 C60 18 48 10 40 22 Z" fill="#8A1623" />
      <path d="M40 14 C35 4 27 10 30 19 C26 26 38 30 40 23 C42 30 54 26 50 19 C53 10 45 4 40 14 Z" fill="#9E1B29" />
      {/* Petal highlights */}
      <path d="M34 26 C36 22 39 20 43 22" stroke="#C0392B" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function OrnateCorners({ className = "" }: { className?: string }) {
  const corner = (id: string, flip: string) => (
    <g key={id} transform={flip}>
      <path
        d="M10 44 C10 24 24 10 44 10"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="M20 44 C20 30 30 20 44 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <circle cx="44" cy="10" r="2" fill="currentColor" />
      <circle cx="10" cy="44" r="2" fill="currentColor" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      preserveAspectRatio="none"
      className={className}
    >
      {corner("tl", "")}
      {corner("tr", "translate(100,0) scale(-1,1)")}
      {corner("br", "translate(100,100) scale(-1,-1)")}
      {corner("bl", "translate(0,100) scale(1,-1)")}
    </svg>
  );
}