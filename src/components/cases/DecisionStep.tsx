'use client';

import { CheckCircle2, CircleDot } from 'lucide-react';
import type { EtapeChoix } from '@/lib/types';
import { maxEtape } from '@/lib/scoring';
import { RadioCard } from '@/components/ui/RadioCard';
import { Button } from '@/components/ui/Button';
import { formatPoints } from './format';
import { TexteRiche } from '@/components/ui/TexteRiche';

interface DecisionStepProps {
  etape: EtapeChoix;
  numero: number;
  choix: string | undefined;
  validee: boolean;
  onChoisir: (optionId: string) => void;
  onValider: () => void;
}

/** Étape à choix pondérés : feedback formatif affiché après validation. */
export function DecisionStep({ etape, numero, choix, validee, onChoisir, onValider }: DecisionStepProps) {
  const max = maxEtape(etape);
  const choisie = etape.options.find((o) => o.id === choix);
  return (
    <section aria-labelledby={`etape-${etape.id}`}>
      <h3 id={`etape-${etape.id}`} className="flex gap-3 text-[17px] font-semibold leading-snug text-ink">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft font-mono text-sm text-primary-strong">{numero}</span>
        <span><TexteRiche texte={etape.question} /></span>
      </h3>
      <fieldset className="mt-4" disabled={validee}>
        <legend className="sr-only">Choisis une option</legend>
        <div className="grid gap-2.5">
          {etape.options.map((o, i) => {
            const etat = !validee
              ? 'neutre'
              : o.points === max
                ? choix === o.id
                  ? 'correct'
                  : 'attendu'
                : choix === o.id
                  ? o.points > 0
                    ? 'neutre'
                    : 'incorrect'
                  : 'neutre';
            return (
              <RadioCard
                key={o.id}
                name={`etape-${etape.id}`}
                value={o.id}
                checked={choix === o.id}
                onChange={onChoisir}
                marque={String.fromCharCode(65 + i)}
                disabled={validee}
                etat={etat}
                description={
                  validee ? (
                    <span className="block">
                      <span className={`font-mono text-xs font-semibold ${o.points === max ? 'text-success-ink' : o.points > 0 ? 'text-ink' : 'text-danger'}`}>
                        {formatPoints(o.points)} pt{o.points > 1 ? 's' : ''}
                      </span>{' '}
                      — <TexteRiche texte={o.feedback} />
                    </span>
                  ) : undefined
                }
              >
                <TexteRiche texte={o.texte} />
              </RadioCard>
            );
          })}
        </div>
      </fieldset>
      {validee ? (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink" aria-live="polite">
          {choisie && choisie.points === max ? (
            <CheckCircle2 aria-hidden className="size-4 text-success" />
          ) : (
            <CircleDot aria-hidden className="size-4 text-accent" />
          )}
          Étape validée : {formatPoints(choisie?.points ?? 0)}/{formatPoints(max)} pts
        </p>
      ) : (
        <Button className="mt-4" onClick={onValider} disabled={!choix}>
          Valider cette étape
        </Button>
      )}
    </section>
  );
}
