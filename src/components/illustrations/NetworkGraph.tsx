// Petit graphe de nœuds reliés : illustration de la filière Data.

const noeuds = [
  { x: 40, y: 92, r: 7 },
  { x: 92, y: 46, r: 9 },
  { x: 104, y: 112, r: 6 },
  { x: 156, y: 72, r: 11 },
  { x: 168, y: 138, r: 7 },
  { x: 214, y: 40, r: 6 },
  { x: 226, y: 104, r: 8 },
];
const liens: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6], [1, 2], [5, 6],
];
const barres = [22, 34, 28, 46, 40, 58];

export function NetworkGraph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden>
      <defs>
        <linearGradient id="ng-barre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity=".35" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity=".05" />
        </linearGradient>
      </defs>
      {barres.map((h, i) => (
        <rect key={i} x={20 + i * 38} y={166 - h} width="22" height={h} rx="5" fill="url(#ng-barre)" />
      ))}
      <g stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" opacity=".55">
        {liens.map(([a, b], i) => (
          <line key={i} x1={noeuds[a].x} y1={noeuds[a].y} x2={noeuds[b].x} y2={noeuds[b].y} className={i % 3 === 0 ? 'anim-flow' : undefined} />
        ))}
      </g>
      {noeuds.map((n, i) => (
        <g key={i}>
          {i === 3 ? <circle cx={n.x} cy={n.y} r={n.r + 8} fill="var(--accent)" opacity=".35" className="anim-pulse-ring" /> : null}
          <circle cx={n.x} cy={n.y} r={n.r} fill={i === 3 ? 'var(--accent)' : 'var(--surface)'} stroke="var(--primary-strong)" strokeWidth="2.2" />
        </g>
      ))}
    </svg>
  );
}
