/**
 * Site-wide ground: deep purple with a mauve glow at the top and faint gold
 * constellation lines, echoing public/card/backcard.png. Mounted once in
 * `app/layout.tsx`; coordinates are fixed so SSR and client markup match.
 */

type Point = readonly [number, number];

// [x, y, r] in a 1440×900 viewBox — hand-placed clusters, never random.
const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [96, 84, 2.2], [168, 132, 1.6], [232, 96, 1.8], [286, 178, 1.4], [352, 128, 2.4],
  [420, 210, 1.5], [508, 92, 1.7], [572, 164, 2.0], [644, 118, 1.4], [712, 214, 1.8],
  [788, 96, 2.2], [846, 172, 1.5], [922, 108, 1.7], [1004, 190, 2.0], [1072, 124, 1.4],
  [1148, 206, 1.8], [1226, 132, 2.3], [1296, 196, 1.5], [1372, 96, 1.7],
  [128, 336, 1.6], [214, 402, 2.0], [306, 348, 1.4], [398, 436, 1.7], [474, 372, 1.5],
  [612, 452, 2.1], [700, 388, 1.4], [812, 466, 1.8], [934, 402, 1.6], [1046, 468, 2.0],
  [1132, 396, 1.4], [1250, 470, 1.7], [1352, 384, 2.2],
  [82, 622, 1.8], [196, 690, 1.4], [318, 618, 2.0], [446, 704, 1.6], [560, 640, 1.4],
  [688, 712, 1.9], [806, 648, 1.5], [942, 720, 1.7], [1066, 646, 2.1], [1188, 724, 1.4],
  [1308, 652, 1.8], [1400, 738, 1.6],
  [150, 830, 1.5], [420, 856, 1.8], [760, 842, 1.4], [1010, 862, 1.7], [1290, 838, 2.0],
];

// Index pairs into STARS — short segments that read as constellations.
const LINES: ReadonlyArray<Point> = [
  [0, 1], [1, 2], [2, 4], [4, 5], [6, 7], [7, 9], [10, 11], [11, 13], [12, 13],
  [14, 15], [15, 16], [16, 17], [17, 18],
  [19, 20], [20, 21], [21, 22], [22, 23], [24, 25], [25, 26], [27, 28], [28, 29],
  [29, 30], [30, 31],
  [32, 33], [33, 34], [34, 35], [36, 37], [37, 38], [38, 39], [40, 41], [41, 42],
  [42, 43], [43, 44],
  [3, 20], [8, 25], [13, 28], [23, 35], [26, 38], [31, 42], [45, 46], [47, 48],
];

export function ConstellationBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
      style={{
        backgroundImage:
          "radial-gradient(600px 600px at 50% -10%, rgba(110,76,122,0.25), transparent 70%)",
      }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.08" stroke="#E2C48A" strokeWidth="1" strokeLinecap="round">
          {LINES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={STARS[a][0]}
              y1={STARS[a][1]}
              x2={STARS[b][0]}
              y2={STARS[b][1]}
            />
          ))}
        </g>
        <g opacity="0.08" fill="#E2C48A">
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>
      </svg>
    </div>
  );
}
