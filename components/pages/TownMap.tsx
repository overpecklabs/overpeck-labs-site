/**
 * Abstract whiteboard "town map" doodle (not a real map): a few marker roads labeled with the
 * town's main corridors, a river squiggle, blocks and a pin with the town name.
 */
export default function TownMap({ name, corridors, seed = 0 }: { name: string; corridors: string[]; seed?: number }) {
  const s = (n: number) => ((Math.sin((seed + 1) * 37.7 + n * 13.1) + 1) / 2) * 30 - 15; // deterministic wobble
  const roads = [
    `M20 ${150 + s(1)} C140 ${130 + s(2)} 260 ${170 + s(3)} 400 ${140 + s(4)}`,
    `M${150 + s(5)} 20 C${170 + s(6)} 120 ${130 + s(7)} 200 ${160 + s(8)} 300`,
    `M40 ${260 + s(9)} L${380 + s(10)} ${60 + s(11)}`,
  ];
  const labelPos = [
    [300, 132 + s(4)],
    [176 + s(6), 70],
    [60, 230 + s(9)],
  ];
  return (
    <svg viewBox="0 0 420 320" className="h-auto w-full" role="img" aria-label={`Sketch of ${name} (illustrative, not a real map)`}>
      <rect x="6" y="6" width="408" height="308" rx="10" fill="#fffefb" stroke="#1a1a1a" strokeOpacity="0.15" />
      {/* blocks */}
      {[
        [210, 190, 54, 34],
        [270, 200, 40, 44],
        [60, 70, 50, 40],
        [300, 230, 60, 30],
        [220, 60, 46, 30],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y + s(i)} width={w} height={h} rx="3" fill={["#dbe8ff", "#dcf3df", "#fff3a3", "#c8f5ec", "#ffe1d6"][i]} stroke="#1a1a1a" strokeWidth="1.6" />
      ))}
      {/* river */}
      <path d={`M380 300 C340 ${250 + s(12)} 400 ${200 + s(13)} 360 ${150 + s(14)} S 390 60 370 10`} fill="none" stroke="#5b9cf5" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* roads */}
      {roads.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          <path d={d} fill="none" stroke="#fffefb" strokeWidth="1.6" strokeDasharray="8 8" strokeLinecap="round" />
        </g>
      ))}
      {corridors.slice(0, 3).map((c, i) => (
        <text key={c} x={labelPos[i][0]} y={labelPos[i][1]} fontSize="14" fill="#1f6feb" style={{ fontFamily: "var(--font-marker), cursive" }}>
          {c}
        </text>
      ))}
      {/* pin */}
      <g transform="translate(190 150)">
        <path d="M0 -38 C-16 -38 -24 -26 -24 -16 C-24 2 0 18 0 18 C0 18 24 2 24 -16 C24 -26 16 -38 0 -38 Z" fill="#d93f44" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="0" cy="-18" r="7" fill="#fffefb" />
      </g>
      <text x="190" y="196" textAnchor="middle" fontSize="22" fill="#1a1a1a" style={{ fontFamily: "var(--font-marker), cursive" }}>
        {name}
      </text>
      <text x="20" y="300" fontSize="11" fill="#1a1a1a" opacity="0.6" fontStyle="italic">
        sketch, not to scale
      </text>
    </svg>
  );
}
