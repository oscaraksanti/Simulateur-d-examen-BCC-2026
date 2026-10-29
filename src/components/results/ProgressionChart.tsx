import type { Tentative } from '@/lib/types';
import { formatNote } from '@/lib/share';

const L = 520;
const H = 180;
const M = { g: 34, d: 16, h: 18, b: 30 };

/** Courbe des notes des dernières simulations, avec la ligne d'objectif 14/20. */
export function ProgressionChart({ historique, objectif = 14 }: { historique: Tentative[]; objectif?: number }) {
  const points = historique.slice(-10);
  if (points.length === 0) return null;
  const n = points.length;
  const x = (i: number) => (n === 1 ? (M.g + L - M.d) / 2 : M.g + (i / (n - 1)) * (L - M.g - M.d));
  const y = (note: number) => M.h + ((20 - note) / 20) * (H - M.h - M.b);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(p.noteSur20)}`).join(' ');
  const premierIndex = historique.length - n;

  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="h-auto w-full" role="img" aria-label={`Évolution des notes : ${points.map((p) => formatNote(p.noteSur20)).join(', ')} sur 20`}>
      {[0, 10, 20].map((v) => (
        <g key={v}>
          <line x1={M.g} x2={L - M.d} y1={y(v)} y2={y(v)} stroke="var(--border)" />
          <text x={M.g - 8} y={y(v) + 4} fontSize="11" textAnchor="end" fill="var(--muted)" fontFamily="var(--font-mono)">
            {v}
          </text>
        </g>
      ))}
      <line x1={M.g} x2={L - M.d} y1={y(objectif)} y2={y(objectif)} stroke="var(--success)" strokeDasharray="5 5" />
      <text x={L - M.d} y={y(objectif) - 6} fontSize="11" textAnchor="end" fill="var(--success-ink)" fontWeight="600">
        Objectif {objectif}/20
      </text>
      {n > 1 ? <path d={d} fill="none" stroke="var(--primary-strong)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /> : null}
      {points.map((p, i) => (
        <g key={p.id}>
          <circle cx={x(i)} cy={y(p.noteSur20)} r="5" fill={p.noteSur20 >= objectif ? 'var(--success)' : 'var(--surface)'} stroke="var(--primary-strong)" strokeWidth="2" />
          <text x={x(i)} y={H - 10} fontSize="11" textAnchor="middle" fill="var(--muted)" fontFamily="var(--font-mono)">
            #{premierIndex + i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
