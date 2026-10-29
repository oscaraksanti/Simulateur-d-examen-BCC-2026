'use client';

import { Flag } from 'lucide-react';
import type { OptionId, QcmQuestion } from '@/lib/types';
import { RadioCard } from '@/components/ui/RadioCard';
import { Badge } from '@/components/ui/Badge';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { LIBELLES_SECTION, LIBELLES_DIFFICULTE } from './libelles';
import { TexteRiche } from '@/components/ui/TexteRiche';

interface QuestionCardProps {
  question: QcmQuestion;
  numero: number;
  total: number;
  reponse: OptionId | undefined;
  onRepondre: (option: OptionId) => void;
  /** Mode correction : affiche les couleurs juste / faux. */
  corrige?: boolean;
  aRevoir?: boolean;
  onBasculerRevoir?: () => void;
}

export function QuestionCard({ question, numero, total, reponse, onRepondre, corrige, aRevoir, onBasculerRevoir }: QuestionCardProps) {
  const tonDiff = question.difficulte === 'difficile' ? 'danger' : question.difficulte === 'moyen' ? 'accent' : 'succes';
  return (
    <article aria-labelledby={`enonce-${question.id}`} className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-semibold text-muted tabular">
          Question {numero}/{total}
        </span>
        <Badge ton="primaire">{LIBELLES_SECTION[question.section]}</Badge>
        <Badge>{question.competence}</Badge>
        <Badge ton={tonDiff}>{LIBELLES_DIFFICULTE[question.difficulte]}</Badge>
        {onBasculerRevoir ? (
          <button
            type="button"
            onClick={onBasculerRevoir}
            aria-pressed={aRevoir}
            className={`ml-auto inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
              aRevoir ? 'border-accent bg-accent-soft text-ink' : 'border-border text-muted hover:text-ink'
            }`}
          >
            <Flag aria-hidden className={`size-3.5 ${aRevoir ? 'fill-accent text-ink' : ''}`} />
            {aRevoir ? 'Marquée à revoir' : 'Marquer à revoir'}
          </button>
        ) : null}
      </div>

      <h2 id={`enonce-${question.id}`} className="mt-4 text-pretty text-lg font-semibold leading-relaxed text-ink sm:text-xl">
        <TexteRiche texte={question.enonce} />
      </h2>

      {question.extrait ? (
        <div className="mt-4">
          <CodeBlock langage={question.extrait.langage} contenu={question.extrait.contenu} />
        </div>
      ) : null}

      <fieldset className="mt-5">
        <legend className="sr-only">Choisis une réponse (touches A à D)</legend>
        <div className="grid gap-2.5">
          {question.options.map((o) => {
            const etat = !corrige
              ? 'neutre'
              : o.id === question.bonneReponse
                ? reponse === o.id
                  ? 'correct'
                  : 'attendu'
                : reponse === o.id
                  ? 'incorrect'
                  : 'neutre';
            return (
              <RadioCard
                key={o.id}
                name={`q-${question.id}`}
                value={o.id}
                checked={reponse === o.id}
                onChange={() => onRepondre(o.id)}
                marque={o.id}
                disabled={corrige}
                etat={etat}
              >
                <TexteRiche texte={o.texte} />
              </RadioCard>
            );
          })}
        </div>
      </fieldset>
    </article>
  );
}
