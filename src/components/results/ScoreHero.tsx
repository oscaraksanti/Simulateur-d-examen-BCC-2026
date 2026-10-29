'use client';

import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { Award, Clock } from 'lucide-react';
import { mention } from '@/lib/scoring';
import { formatNote, LIBELLES_FILIERE } from '@/lib/share';
import type { Filiere, Mention } from '@/lib/types';
import { formatDuree } from '@/components/ui/Timer';
import { BanknotePattern } from '@/components/illustrations/BanknotePattern';

const styles: Record<Mention, { anneau: string; badge: string }> = {
  'À renforcer': { anneau: 'var(--danger)', badge: 'bg-danger-soft text-danger' },
  Correct: { anneau: 'var(--accent)', badge: 'bg-accent-soft text-ink' },
  'Bon niveau': { anneau: 'var(--primary)', badge: 'bg-primary-soft text-primary-strong' },
  Excellent: { anneau: 'var(--success)', badge: 'bg-success-soft text-success-ink' },
};

const conseils: Record<Mention, string> = {
  'À renforcer': 'Pas de panique : c’est un diagnostic. Lis toute la correction et cible tes 2 compétences prioritaires.',
  Correct: 'Base solide. Travaille tes points faibles en mode Entraînement pour passer la barre des 14/20.',
  'Bon niveau': 'Très bon résultat ! Stabilise-le sur plusieurs simulations et soigne les cas pratiques.',
  Excellent: 'Remarquable ! Continue à t’entraîner pour rester à ce niveau le jour J.',
};

interface ScoreHeroProps {
  note: number;
  filiere: Filiere;
  prenom: string;
  dureeSecondes: number;
  numeroTentative: number;
  progression: number | null;
}

export function ScoreHero({ note, filiere, prenom, dureeSecondes, numeroTentative, progression }: ScoreHeroProps) {
  const reduit = useReducedMotion();
  const [affiche, setAffiche] = useState(reduit ? note : 0);
  const m = mention(note);

  useEffect(() => {
    if (reduit) return;
    const controle = animate(0, note, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setAffiche(v) });
    return () => controle.stop();
  }, [note, reduit]);

  const valeur = reduit ? note : affiche;
  const R = 84;
  const C = 2 * Math.PI * R;

  return (
    <section aria-labelledby="score-titre" className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-lift sm:p-10">
      <BanknotePattern opacite={0.05} />
      <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <div className="relative mx-auto size-52">
          <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
            <circle cx="100" cy="100" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
            <circle cx="100" cy="100" r={R} fill="none" stroke={styles[m].anneau} strokeWidth="14" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - valeur / 20)} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-6xl font-bold tracking-tight text-ink tabular" aria-hidden>
              {formatNote(Math.round(valeur * 2) / 2)}
            </p>
            <p className="font-mono text-lg text-muted" aria-hidden>/20</p>
          </div>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-muted">
            Simulation n°{numeroTentative} · {LIBELLES_FILIERE[filiere]}
          </p>
          <h1 id="score-titre" className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            <span className="sr-only">Note : {formatNote(note)} sur 20. </span>
            Bravo {prenom}, examen terminé !
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${styles[m].badge}`}>
              <Award aria-hidden className="size-4" /> {m}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-sm text-muted">
              <Clock aria-hidden className="size-4" /> {formatDuree(dureeSecondes)}
            </span>
            {progression !== null && progression !== 0 ? (
              <span className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-sm font-semibold ${progression > 0 ? 'bg-success-soft text-success-ink' : 'bg-danger-soft text-danger'}`}>
                {progression > 0 ? '+' : ''}
                {formatNote(progression)} vs précédente
              </span>
            ) : null}
          </div>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{conseils[m]}</p>
        </div>
      </div>
    </section>
  );
}
