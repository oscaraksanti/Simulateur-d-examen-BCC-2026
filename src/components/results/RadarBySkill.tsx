'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface AxeRadar {
  libelle: string;
  taux: number; // 0 à 1
  detail: string; // ex. « 2/3 »
}

const T = 440;
const CX = T / 2;
const CY = T / 2;
const R = 128;

function point(i: number, n: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
}

function couper(libelle: string): string[] {
  if (libelle.length <= 16) return [libelle];
  const mots = libelle.split(' ');
  const lignes: string[] = [''];
  for (const m of mots) {
    const derniere = lignes[lignes.length - 1];
    if ((derniere + ' ' + m).trim().length > 16 && derniere) lignes.push(m);
    else lignes[lignes.length - 1] = (derniere + ' ' + m).trim();
  }
  return lignes.slice(0, 3);
}

/** Radar SVG maison des compétences (aucune librairie de graphiques). */
export function RadarBySkill({ axes }: { axes: AxeRadar[] }) {
  const reduit = useReducedMotion();
  const n = axes.length;
  if (n < 3) return null;
  const forme = axes.map((a, i) => point(i, n, Math.max(0.04, a.taux) * R).join(',')).join(' ');

  return (
    <figure>
      <svg viewBox={`0 0 ${T} ${T}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-labelledby="radar-titre">
        <title id="radar-titre">
          Radar des compétences : {axes.map((a) => `${a.libelle} ${Math.round(a.taux * 100)} %`).join(', ')}
        </title>
        {[0.25, 0.5, 0.75, 1].map((k) => (
          <polygon key={k} points={axes.map((_, i) => point(i, n, R * k).join(',')).join(' ')} fill={k === 1 ? 'var(--surface-2)' : 'none'} stroke="var(--border)" />
        ))}
        {axes.map((_, i) => {
          const [x, y] = point(i, n, R);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--border)" />;
        })}
        <motion.polygon
          points={forme}
          fill="var(--primary)"
          fillOpacity={0.22}
          stroke="var(--primary-strong)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          initial={reduit ? false : { scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        {axes.map((a, i) => {
          const [x, y] = point(i, n, Math.max(0.04, a.taux) * R);
          return <circle key={a.libelle} cx={x} cy={y} r={4} fill={a.taux >= 0.7 ? 'var(--success)' : a.taux >= 0.5 ? 'var(--accent)' : 'var(--danger)'} stroke="var(--surface)" strokeWidth={1.5} />;
        })}
        {axes.map((a, i) => {
          const [x, y] = point(i, n, R + 26);
          const ancre = Math.abs(x - CX) < 8 ? 'middle' : x > CX ? 'start' : 'end';
          const lignes = couper(a.libelle);
          return (
            <text key={a.libelle} x={x} y={y - (lignes.length - 1) * 6} textAnchor={ancre} fontSize="10.5" fill="var(--ink)" fontWeight="600">
              {lignes.map((l, j) => (
                <tspan key={j} x={x} dy={j === 0 ? 0 : 12}>
                  {l}
                </tspan>
              ))}
              <tspan x={x} dy={12} fill="var(--muted)" fontWeight="400" fontFamily="var(--font-mono)">
                {Math.round(a.taux * 100)} %
              </tspan>
            </text>
          );
        })}
      </svg>
      <figcaption className="sr-only">
        <ul>
          {axes.map((a) => (
            <li key={a.libelle}>
              {a.libelle} : {a.detail} ({Math.round(a.taux * 100)} %)
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
