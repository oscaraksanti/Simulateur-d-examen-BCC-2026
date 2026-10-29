'use client';

import type { OptionId, QcmQuestion, Section } from '@/lib/types';
import { LIBELLES_SECTION } from './libelles';

interface QuestionNavigatorProps {
  questions: QcmQuestion[];
  reponses: Record<string, OptionId>;
  aRevoir: string[];
  courant: number;
  onAller: (index: number) => void;
}

/** Grille de numéros : répondu / non répondu / marqué « à revoir », groupée par section. */
export function QuestionNavigator({ questions, reponses, aRevoir, courant, onAller }: QuestionNavigatorProps) {
  const sections = Array.from(new Set(questions.map((q) => q.section))) as Section[];
  const repondues = questions.filter((q) => reponses[q.id]).length;
  return (
    <nav aria-label="Navigation entre les questions">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-ink">Questions</span>
        <span className="font-mono text-muted tabular">
          {repondues}/{questions.length}
        </span>
      </div>
      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{LIBELLES_SECTION[s]}</p>
            <ol className="grid grid-cols-6 gap-1.5">
              {questions.map((q, i) =>
                q.section !== s ? null : (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => onAller(i)}
                      aria-current={i === courant ? 'true' : undefined}
                      aria-label={`Question ${i + 1}${reponses[q.id] ? ', répondue' : ', sans réponse'}${aRevoir.includes(q.id) ? ', à revoir' : ''}`}
                      className={`relative flex h-9 w-full items-center justify-center rounded-lg font-mono text-xs font-semibold tabular transition-all ${
                        i === courant
                          ? 'bg-primary-strong text-on-primary ring-2 ring-primary-soft ring-offset-1 ring-offset-surface'
                          : reponses[q.id]
                            ? 'bg-primary-soft text-primary-strong hover:brightness-95'
                            : 'border border-border bg-surface text-muted hover:border-primary hover:text-ink'
                      }`}
                    >
                      {i + 1}
                      {aRevoir.includes(q.id) ? (
                        <span aria-hidden className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface bg-accent" />
                      ) : null}
                    </button>
                  </li>
                ),
              )}
            </ol>
          </div>
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-3 rounded bg-primary-soft" /> Répondue</li>
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-3 rounded border border-border" /> Sans réponse</li>
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-full bg-accent" /> À revoir</li>
      </ul>
    </nav>
  );
}
