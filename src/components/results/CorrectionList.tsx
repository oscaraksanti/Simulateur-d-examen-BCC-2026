'use client';

import { useState } from 'react';
import { CheckCircle2, ChevronDown, MinusCircle, XCircle } from 'lucide-react';
import type { OptionId, QcmQuestion } from '@/lib/types';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { ExplanationPanel } from '@/components/exam/ExplanationPanel';
import { LIBELLES_SECTION } from '@/components/exam/libelles';
import { TexteRiche } from '@/components/ui/TexteRiche';

type Filtre = 'toutes' | 'erreurs' | 'justes';

/** Correction détaillée repliable : réponse donnée, bonne réponse, explication complète. */
export function CorrectionList({ questions, reponses }: { questions: QcmQuestion[]; reponses: Record<string, OptionId> }) {
  const [filtre, setFiltre] = useState<Filtre>('erreurs');
  const nbErreurs = questions.filter((q) => reponses[q.id] !== q.bonneReponse).length;
  const visibles = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => (filtre === 'toutes' ? true : filtre === 'erreurs' ? reponses[q.id] !== q.bonneReponse : reponses[q.id] === q.bonneReponse));

  const filtres: { id: Filtre; libelle: string }[] = [
    { id: 'erreurs', libelle: `À revoir (${nbErreurs})` },
    { id: 'justes', libelle: `Justes (${questions.length - nbErreurs})` },
    { id: 'toutes', libelle: `Toutes (${questions.length})` },
  ];

  return (
    <div>
      <div role="group" aria-label="Filtrer la correction" className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface-2 p-1">
        {filtres.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtre === f.id}
            onClick={() => setFiltre(f.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${filtre === f.id ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink'}`}
          >
            {f.libelle}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {visibles.map(({ q, i }) => {
          const r = reponses[q.id];
          const juste = r === q.bonneReponse;
          return (
            <li key={q.id}>
              <details className="group rounded-2xl border border-border bg-surface open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  {juste ? (
                    <CheckCircle2 aria-label="Juste" className="mt-0.5 size-5 shrink-0 text-success" />
                  ) : r ? (
                    <XCircle aria-label="Fausse" className="mt-0.5 size-5 shrink-0 text-danger" />
                  ) : (
                    <MinusCircle aria-label="Sans réponse" className="mt-0.5 size-5 shrink-0 text-muted" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-muted">
                      Q{i + 1} · {LIBELLES_SECTION[q.section]} · {q.competence}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-[15px] text-ink group-open:line-clamp-none"><TexteRiche texte={q.enonce} /></span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">
                    {r ?? '—'} → {q.bonneReponse}
                  </span>
                  <ChevronDown aria-hidden className="mt-0.5 size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-4 border-t border-border p-4">
                  <QuestionCard question={q} numero={i + 1} total={questions.length} reponse={r} onRepondre={() => undefined} corrige />
                  <ExplanationPanel question={q} reponse={r} />
                </div>
              </details>
            </li>
          );
        })}
        {visibles.length === 0 ? <li className="rounded-2xl border border-dashed border-border p-6 text-center text-muted">Rien à afficher ici 🎉</li> : null}
      </ul>
    </div>
  );
}
