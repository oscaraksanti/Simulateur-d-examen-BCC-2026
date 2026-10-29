'use client';

import { Check } from 'lucide-react';
import { etapeAtteinte, useExam } from '@/context/ExamContext';

const etapes = ['Inscription', 'Examen', 'Cas pratiques', 'Résultats'] as const;

/** Progression du parcours : 1 Inscription → 2 Examen → 3 Cas pratiques → 4 Résultats. */
export function Stepper({ courante }: { courante: 1 | 2 | 3 | 4 }) {
  const { etat } = useExam();
  const atteinte = etat.hydrate ? etapeAtteinte(etat) : courante;
  return (
    <nav aria-label="Progression" className="w-full">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {etapes.map((libelle, i) => {
          const n = (i + 1) as 1 | 2 | 3 | 4;
          const faite = n < courante || (n < atteinte && n !== courante);
          const active = n === courante;
          return (
            <li key={libelle} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                  active
                    ? 'bg-primary-strong text-on-primary ring-4 ring-primary-soft'
                    : faite
                      ? 'bg-success text-white'
                      : 'border border-border bg-surface text-muted'
                }`}
              >
                {faite ? <Check aria-hidden className="size-3.5" /> : n}
              </span>
              <span className={`hidden truncate text-sm sm:block ${active ? 'font-semibold text-ink' : 'text-muted'}`}>
                {libelle}
                {faite ? <span className="sr-only"> (terminé)</span> : null}
              </span>
              {active ? <span className="truncate text-xs font-semibold text-ink sm:hidden">{libelle}</span> : null}
              {i < etapes.length - 1 ? (
                <span aria-hidden className={`h-px min-w-3 flex-1 ${faite ? 'bg-success' : 'bg-border'}`} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
