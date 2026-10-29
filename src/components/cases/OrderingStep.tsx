'use client';

import { useState } from 'react';
import { Reorder, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp, Check, GripVertical, X } from 'lucide-react';
import type { EtapeOrdre } from '@/lib/types';
import { scoreEtape } from '@/lib/scoring';
import { creerAleatoire, melanger } from '@/lib/sampling';
import { Button } from '@/components/ui/Button';
import { formatPoints } from './format';
import { TexteRiche } from '@/components/ui/TexteRiche';

interface OrderingStepProps {
  etape: EtapeOrdre;
  numero: number;
  ordre: string[] | undefined;
  validee: boolean;
  onOrdonner: (ordre: string[]) => void;
  onValider: (ordre: string[]) => void;
}

/** Ordre initial mélangé de façon déterministe, jamais identique à la bonne réponse. */
export function ordreInitial(etape: EtapeOrdre): string[] {
  const ids = etape.elements.map((e) => e.id);
  let essai = melanger(ids, creerAleatoire(etape.id));
  if (essai.join() === etape.ordreCorrect.join()) essai = [...essai.slice(1), essai[0]];
  return essai;
}

/** Étape « remettre dans l'ordre » : glisser-déposer + boutons ↑ ↓ accessibles au clavier. */
export function OrderingStep({ etape, numero, ordre, validee, onOrdonner, onValider }: OrderingStepProps) {
  const [local, setLocal] = useState<string[]>(() => ordre ?? ordreInitial(etape));
  const [annonce, setAnnonce] = useState('');
  const reduit = useReducedMotion();
  const texte = (id: string) => etape.elements.find((e) => e.id === id)?.texte ?? id;

  const changer = (nouvel: string[]) => {
    setLocal(nouvel);
    onOrdonner(nouvel);
  };

  const deplacer = (i: number, delta: -1 | 1) => {
    const j = i + delta;
    if (j < 0 || j >= local.length) return;
    const copie = [...local];
    [copie[i], copie[j]] = [copie[j], copie[i]];
    changer(copie);
    setAnnonce(`« ${texte(local[i])} » déplacé en position ${j + 1}.`);
  };

  const points = scoreEtape(etape, { type: 'ordre', ordre: local });

  return (
    <section aria-labelledby={`etape-${etape.id}`}>
      <h3 id={`etape-${etape.id}`} className="flex gap-3 text-[17px] font-semibold leading-snug text-ink">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft font-mono text-sm text-primary-strong">{numero}</span>
        <span><TexteRiche texte={etape.question} /></span>
      </h3>
      {!validee ? (
        <p className="mt-2 text-sm text-muted">Glisse les éléments ou utilise les flèches pour les remettre dans le bon ordre (du premier au dernier).</p>
      ) : null}

      {validee ? (
        <ol className="mt-4 space-y-2">
          {local.map((id, i) => {
            const ok = etape.ordreCorrect[i] === id;
            return (
              <li key={id} className={`flex items-start gap-3 rounded-xl border p-3 text-[15px] ${ok ? 'border-success bg-success-soft' : 'border-danger bg-danger-soft'}`}>
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md text-white ${ok ? 'bg-success' : 'bg-danger'}`}>
                  {ok ? <Check aria-hidden className="size-4" /> : <X aria-hidden className="size-4" />}
                </span>
                <span className="min-w-0 flex-1 text-ink">
                  <span className="mr-1 font-mono text-xs text-muted">{i + 1}.</span>
                  {texte(id)}
                  {!ok ? <span className="mt-0.5 block text-xs text-muted">Attendu ici : {texte(etape.ordreCorrect[i])}</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <Reorder.Group axis="y" values={local} onReorder={changer} className="mt-4 space-y-2">
          {local.map((id, i) => (
            <Reorder.Item
              key={id}
              value={id}
              dragListener={!reduit}
              className="flex cursor-grab items-center gap-2 rounded-xl border border-border bg-surface p-2.5 shadow-soft active:cursor-grabbing active:shadow-lift"
            >
              <GripVertical aria-hidden className="size-4 shrink-0 text-muted" />
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-2 font-mono text-xs font-bold text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1 text-[15px] text-ink [overflow-wrap:anywhere]">{texte(id)}</span>
              <span className="flex shrink-0 gap-1">
                <button type="button" onClick={() => deplacer(i, -1)} disabled={i === 0} aria-label={`Monter « ${texte(id)} »`} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30">
                  <ArrowUp aria-hidden className="size-4" />
                </button>
                <button type="button" onClick={() => deplacer(i, 1)} disabled={i === local.length - 1} aria-label={`Descendre « ${texte(id)} »`} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-30">
                  <ArrowDown aria-hidden className="size-4" />
                </button>
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
      <p className="sr-only" aria-live="polite">{annonce}</p>

      {validee ? (
        <div className="mt-3 space-y-2" aria-live="polite">
          <p className="text-sm font-semibold text-ink">
            Étape validée : {formatPoints(points)}/{formatPoints(etape.pointsMax)} pts
          </p>
          <p className="rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-muted"><TexteRiche texte={etape.feedback} /></p>
        </div>
      ) : (
        <Button className="mt-4" onClick={() => onValider(local)}>
          Valider cet ordre
        </Button>
      )}
    </section>
  );
}
