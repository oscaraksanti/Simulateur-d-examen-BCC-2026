// Mini-frise du taux directeur 2026 (15 % → 13,5 % → 12,5 % → maintien), données : bccFacts.

import { bccFacts } from '@/data/bccFacts';

const L = 640;
const H = 230;
const MARGE = { g: 44, d: 28, h: 34, b: 52 };
const DEBUT = Date.UTC(2026, 0, 1);
const FIN = Date.UTC(2026, 11, 31);
const TAUX_MIN = 11;
const TAUX_MAX = 16;

const x = (iso: string) => MARGE.g + ((Date.parse(iso) - DEBUT) / (FIN - DEBUT)) * (L - MARGE.g - MARGE.d);
const y = (taux: number) => MARGE.h + ((TAUX_MAX - taux) / (TAUX_MAX - TAUX_MIN)) * (H - MARGE.h - MARGE.b);
const pct = (t: number) => `${String(t).replace('.', ',')} %`;

export function PolicyRateTimeline() {
  const points = bccFacts.tauxDirecteur2026;
  // Courbe en escalier : le taux reste constant jusqu'à la décision suivante.
  let d = `M${x(points[0].date)} ${y(points[0].taux)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` H${x(points[i].date)} V${y(points[i].taux)}`;
  }
  const finAxe = x('2026-10-29');
  d += ` H${finAxe}`;

  return (
    <figure className="@container w-full">
      <svg viewBox={`0 0 ${L} ${H}`} className="h-auto w-full" role="img" aria-labelledby="ptr-titre ptr-desc">
        <title id="ptr-titre">Taux directeur de la BCC en 2026</title>
        <desc id="ptr-desc">
          {points.map((p) => `${p.libelle} : ${pct(p.taux)}`).join(' ; ')}.
        </desc>
        {[12, 13, 14, 15].map((t) => (
          <g key={t}>
            <line x1={MARGE.g} x2={L - MARGE.d} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="3 5" />
            <text x={MARGE.g - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--font-mono)">
              {t} %
            </text>
          </g>
        ))}
        {['Jan', 'Avr', 'Juil', 'Oct'].map((m, i) => {
          const iso = ['2026-01-01', '2026-04-01', '2026-07-01', '2026-10-01'][i];
          return (
            <text key={m} x={x(iso)} y={H - MARGE.b + 20} fontSize="11" fill="var(--muted)" textAnchor="middle">
              {m}
            </text>
          );
        })}
        <path d={`${d} V${H - MARGE.b} H${x(points[0].date)} Z`} fill="var(--primary)" opacity=".08" />
        <path d={d} fill="none" stroke="var(--primary-strong)" strokeWidth="3" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" style={{ animation: 'dash 1.6s ease-out forwards' }} />
        {points.map((p, i) => (
          <g key={p.date}>
            <circle cx={x(p.date)} cy={y(p.taux)} r="6" fill={i === points.length - 1 ? 'var(--accent)' : 'var(--surface)'} stroke="var(--primary-strong)" strokeWidth="2.5" />
            <text
              x={x(p.date)}
              y={y(p.taux) - 14}
              textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
              fontSize="13"
              fontWeight="700"
              fill="var(--ink)"
              fontFamily="var(--font-mono)"
            >
              {pct(p.taux)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 grid gap-2 text-sm @xl:grid-cols-3">
        {points.slice(1).map((p) => (
          <div key={p.date} className="flex items-baseline justify-between gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2 @xl:block">
            <p className="font-semibold text-ink">{p.libelle}</p>
            <p className="text-muted">
              <span className="font-mono text-ink">{pct(p.taux)}</span> · {p.commentaire}
            </p>
          </div>
        ))}
      </figcaption>
      <p className="mt-3 text-xs text-muted">Sources : {points[0].source}. {bccFacts.avertissement}</p>
    </figure>
  );
}
