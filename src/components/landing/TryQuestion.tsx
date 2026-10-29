'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import type { OptionId, QcmQuestion } from '@/lib/types';
import { TexteRiche } from '@/components/ui/TexteRiche';

/** Question d'essai sur l'accueil : le visiteur goûte la correction avant de s'inscrire. */
export function TryQuestion({ question }: { question: QcmQuestion }) {
  const [choix, setChoix] = useState<OptionId | null>(null);
  const reduit = useReducedMotion();
  const juste = choix === question.bonneReponse;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-lift sm:p-8">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-muted">{question.competence}</span>
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-muted">Source : {question.source}</span>
      </div>
      <p className="mt-4 text-xl font-semibold leading-snug tracking-[-0.02em] text-ink">
        <TexteRiche texte={question.enonce} />
      </p>
      <div className="mt-6 grid gap-2" role="radiogroup" aria-label="Réponses possibles">
        {question.options.map((o) => {
          const estBonne = o.id === question.bonneReponse;
          const etat = choix === null ? 'neutre' : estBonne ? 'bonne' : choix === o.id ? 'fausse' : 'neutre';
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={choix === o.id}
              disabled={choix !== null}
              onClick={() => setChoix(o.id)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-all duration-200 ${
                etat === 'bonne'
                  ? 'border-success bg-success-soft'
                  : etat === 'fausse'
                    ? 'border-danger bg-danger-soft'
                    : choix === null
                      ? 'border-border hover:-translate-y-px hover:border-ink/30 hover:shadow-soft'
                      : 'border-border opacity-60'
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  etat === 'bonne' ? 'bg-success text-white' : etat === 'fausse' ? 'bg-danger text-white' : 'bg-surface-2 text-muted'
                }`}
              >
                {etat === 'bonne' ? <Check className="size-4" strokeWidth={3} /> : etat === 'fausse' ? <X className="size-4" strokeWidth={3} /> : o.id}
              </span>
              <span className="text-ink"><TexteRiche texte={o.texte} /></span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {choix ? (
          <motion.div
            initial={reduit ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            aria-live="polite"
          >
            <div className="mt-6 border-t border-border pt-6">
              <p className={`text-sm font-semibold ${juste ? 'text-success-ink' : 'text-danger'}`}>
                {juste ? 'Exactement.' : `Pas tout à fait : la bonne réponse est ${question.bonneReponse}.`}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/85"><TexteRiche texte={question.explication} /></p>
              {question.pourquoiPas && choix !== question.bonneReponse ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  <strong className="font-medium text-ink">Pourquoi pas {choix} ?</strong> <TexteRiche texte={question.pourquoiPas[choix] ?? ''} />
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="#commencer" className="group inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-bg transition hover:bg-ink/85">
                  Passer l&apos;examen complet <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button type="button" onClick={() => setChoix(null)} className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted hover:text-ink">
                  <RotateCcw aria-hidden className="size-4" /> Réessayer
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
