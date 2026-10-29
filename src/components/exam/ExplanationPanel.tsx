import { BookMarked, CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import type { OptionId, QcmQuestion } from '@/lib/types';
import { TexteRiche } from '@/components/ui/TexteRiche';

interface ExplanationPanelProps {
  question: QcmQuestion;
  reponse: OptionId | undefined;
}

/** Correction détaillée : pourquoi la bonne réponse, pourquoi pas les autres, idée-clé, source. */
export function ExplanationPanel({ question, reponse }: ExplanationPanelProps) {
  const juste = reponse === question.bonneReponse;
  const bonne = question.options.find((o) => o.id === question.bonneReponse);
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface-2 p-4 sm:p-5" aria-live="polite">
      <p className={`flex items-center gap-2 font-semibold ${juste ? 'text-success-ink' : reponse ? 'text-danger' : 'text-muted'}`}>
        {juste ? <CheckCircle2 aria-hidden className="size-5" /> : <XCircle aria-hidden className="size-5" />}
        {juste ? 'Bonne réponse !' : reponse ? `Ta réponse : ${reponse} — incorrecte` : 'Pas de réponse'}
      </p>
      <div>
        <p className="text-sm font-semibold text-ink">
          Réponse attendue : <span className="font-mono">{question.bonneReponse}</span> — <TexteRiche texte={bonne?.texte ?? ''} />
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/90"><TexteRiche texte={question.explication} /></p>
      </div>
      {question.pourquoiPas ? (
        <div>
          <p className="text-sm font-semibold text-ink">Pourquoi les autres réponses sont fausses</p>
          <ul className="mt-2 space-y-2">
            {question.options
              .filter((o) => o.id !== question.bonneReponse)
              .map((o) => (
                <li key={o.id} className={`flex gap-3 rounded-xl p-2.5 text-sm leading-relaxed ${reponse === o.id ? 'bg-danger-soft' : ''}`}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-xs font-bold text-muted">
                    {o.id}
                  </span>
                  <span className="text-muted"><TexteRiche texte={question.pourquoiPas?.[o.id as OptionId] ?? ''} /></span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
      {question.aRetenir ? (
        <p className="flex gap-2.5 rounded-xl border border-accent/50 bg-accent-soft p-3 text-sm leading-relaxed text-ink">
          <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>À retenir : </strong>
            <TexteRiche texte={question.aRetenir} />
          </span>
        </p>
      ) : null}
      {question.source ? (
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <BookMarked aria-hidden className="size-3.5" /> Source : {question.source}
          {question.verifieLe ? ` · vérifié le ${question.verifieLe.split('-').reverse().join('/')}` : ''}
        </p>
      ) : null}
    </div>
  );
}
