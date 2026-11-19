import React from "react";

/**
 * Decorative GTA VI / Vice City hero artwork: a striped retro sun, palm-tree
 * silhouettes, a city skyline and a field of twinkling stars. Pure SVG + CSS —
 * no images, no client JS — and everything is aria-hidden.
 *
 * Inspired by the look of the game's key art (sunset gradients, palms,
 * neon); it does not use any Rockstar logos or assets.
 */

// Deterministic pseudo-random so server and client render identical markup.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ---------------------------------------------------------------- Sun --- */

export const ViceSun = ({ className = "" }: { className?: string }) => {
  // Horizontal "slits" cut into the lower half of the sun; each one a little
  // thicker than the last, like the classic retro sun.
  const slits = [
    { y: 128, h: 3 },
    { y: 144, h: 5 },
    { y: 161, h: 7 },
    { y: 179, h: 9 },
    { y: 198, h: 11 },
    { y: 218, h: 13 },
  ];
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="vice-sun-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD86B" />
          <stop offset="0.45" stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#F0328A" />
        </linearGradient>
        <mask id="vice-sun-mask">
          <rect width="240" height="240" fill="#fff" />
          {slits.map((s) => (
            <rect key={s.y} x="0" y={s.y} width="240" height={s.h} fill="#000" />
          ))}
        </mask>
      </defs>
      <circle
        cx="120"
        cy="120"
        r="112"
        fill="url(#vice-sun-fill)"
        mask="url(#vice-sun-mask)"
      />
    </svg>
  );
};

/* -------------------------------------------------------------- Palms --- */

const FRONDS_RIGHT = [-78, -54, -30, -8, 14, 36];
const FRONDS_LEFT = [-78, -54, -30, -8, 14, 36];

export const PalmTree = ({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) => (
  <svg
    viewBox="0 0 240 420"
    className={className}
    style={flip ? { transform: "scaleX(-1)" } : undefined}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* One drooping frond pointing right; reused (and mirrored) around the crown. */}
      <path
        id="vice-frond"
        d="M0 0 C 22 -26, 74 -34, 118 -6 C 126 -2, 128 4, 122 8 C 80 -12, 36 -12, 0 0 Z"
      />
    </defs>
    {/* trunk: gently curved, tapering */}
    <path
      d="M108 420 C 112 320, 134 236, 126 132 L 138 130 C 150 236, 130 330, 132 420 Z"
      fill="currentColor"
    />
    {/* crown */}
    <g transform="translate(131 128)" fill="currentColor">
      {FRONDS_RIGHT.map((a, i) => (
        <use
          key={`r${i}`}
          href="#vice-frond"
          transform={`rotate(${a}) scale(${0.95 + (i % 3) * 0.08})`}
        />
      ))}
      {FRONDS_LEFT.map((a, i) => (
        <use
          key={`l${i}`}
          href="#vice-frond"
          transform={`scale(-1 1) rotate(${a}) scale(${1 - (i % 3) * 0.06})`}
        />
      ))}
      <circle cx="0" cy="4" r="7" />
    </g>
  </svg>
);

/* ------------------------------------------------------------ Skyline --- */

const SKYLINE_W = 1600;
const buildings = (() => {
  const r = rng(20261119);
  const out: { x: number; w: number; h: number }[] = [];
  let x = 0;
  while (x < SKYLINE_W) {
    const w = 28 + Math.floor(r() * 56);
    // Taller towers toward the middle third, lower toward the edges.
    const mid = 1 - Math.abs(x / SKYLINE_W - 0.5) * 1.6;
    const h = 40 + Math.floor(r() * 120 * Math.max(mid, 0.25));
    out.push({ x, w, h });
    x += w + Math.floor(r() * 6);
  }
  return out;
})();

const windows = (() => {
  const r = rng(77);
  const out: { x: number; y: number; hot: boolean }[] = [];
  for (const b of buildings) {
    for (let wy = 12; wy < b.h - 8; wy += 14) {
      for (let wx = 7; wx < b.w - 7; wx += 11) {
        if (r() > 0.78) {
          out.push({ x: b.x + wx, y: 200 - b.h + wy, hot: r() > 0.55 });
        }
      }
    }
  }
  return out;
})();

export const ViceSkyline = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox={`0 0 ${SKYLINE_W} 200`}
    preserveAspectRatio="xMidYMax slice"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <g fill="#070314">
      {buildings.map((b) => (
        <rect key={b.x} x={b.x} y={200 - b.h} width={b.w} height={b.h} />
      ))}
    </g>
    <g>
      {windows.map((w, i) => (
        <rect
          key={i}
          x={w.x}
          y={w.y}
          width="4"
          height="5"
          fill={w.hot ? "#FF8A3D" : "#F0328A"}
          opacity={w.hot ? 0.85 : 0.7}
        />
      ))}
    </g>
  </svg>
);

/* -------------------------------------------------------------- Stars --- */

const stars = (() => {
  const r = rng(424242);
  return Array.from({ length: 46 }, () => ({
    left: r() * 100,
    top: r() * 52,
    size: 1 + Math.floor(r() * 2),
    delay: r() * 4,
  }));
})();

export const ViceStars = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {stars.map((s, i) => (
      <span
        key={i}
        className="vice-star"
        style={{
          left: `${s.left}%`,
          top: `${s.top}%`,
          width: s.size,
          height: s.size,
          animationDelay: `${s.delay}s`,
        }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------- Hero backdrop --- */

/**
 * Full-bleed background for the hero: dusk sky, stars, horizon glow, skyline
 * and a pair of palms. Absolutely positioned — the parent must be `relative`
 * and `overflow-hidden`.
 */
export const ViceHeroBackdrop = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {/* dusk sky: transparent up top so the page background shows through,
        warming to pink / orange at the horizon */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, rgba(13,6,32,0) 0%, rgba(74,18,96,0.35) 52%, rgba(168,38,122,0.38) 78%, rgba(255,122,69,0.5) 94%, rgba(255,200,87,0.55) 100%)",
      }}
    />
    <ViceStars />

    {/* skyline + palms anchored to the bottom edge */}
    <ViceSkyline className="absolute bottom-0 left-0 w-full h-24 sm:h-32 lg:h-40" />
    <PalmTree className="absolute bottom-0 -left-16 sm:-left-12 lg:-left-20 h-52 sm:h-64 lg:h-80 w-auto text-[#070314]" />
    <PalmTree
      flip
      className="absolute bottom-0 -right-16 sm:-right-12 lg:-right-14 h-44 sm:h-56 lg:h-72 w-auto text-[#070314]"
    />
    {/* soft fade so the hero melts into the next section */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F0328A] to-transparent opacity-70" />
  </div>
);
