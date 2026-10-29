// Infographie du système de paiement : Banques → Switch « Mosolo » → Compensation → Règlement BCC.
// Données : src/data/bccFacts.ts (source unique de vérité).

import { Building2, Landmark, Network, Scale } from 'lucide-react';
import { bccFacts } from '@/data/bccFacts';

const icones = { banques: Building2, switch: Network, compensation: Scale, reglement: Landmark } as const;
type IdEtape = keyof typeof icones;

function estIdEtape(id: string): id is IdEtape {
  return id in icones;
}

/** `vertical` force l'affichage en colonne (utile dans une carte étroite). */
export function PaymentFlowInfographic({ vertical = false }: { vertical?: boolean }) {
  const etapes = bccFacts.fluxPaiement;
  // Préfixe « md: » uniquement en mode horizontal.
  const h = (classes: string) => (vertical ? '' : classes);
  return (
    <figure className="w-full">
      <ol className={`grid gap-3 ${h('md:grid-cols-4 md:gap-0')}`}>
        {etapes.map((e, i) => {
          const Icone = estIdEtape(e.id) ? icones[e.id] : Network;
          const derniere = i === etapes.length - 1;
          return (
            <li key={e.id} className={`relative flex ${h('md:flex-col md:items-center')}`}>
              {/* Connecteur animé */}
              {!derniere ? (
                <>
                  <svg aria-hidden className={`absolute left-[27px] top-14 h-[calc(100%-2.5rem)] w-2 ${h('md:hidden')}`} preserveAspectRatio="none" viewBox="0 0 2 100">
                    <line x1="1" y1="0" x2="1" y2="100" stroke="var(--primary)" strokeWidth="2" className="anim-flow" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {vertical ? null : (
                    <svg aria-hidden className="absolute left-[calc(50%+34px)] top-7 hidden h-2 w-[calc(100%-68px)] md:block" preserveAspectRatio="none" viewBox="0 0 100 2">
                      <line x1="0" y1="1" x2="100" y2="1" stroke="var(--primary)" strokeWidth="2" className="anim-flow" vectorEffect="non-scaling-stroke" />
                    </svg>
                  )}
                </>
              ) : null}
              <div className={`flex gap-4 ${h('md:flex-col md:items-center md:px-3 md:text-center')}`}>
                <span
                  className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border shadow-soft ${
                    derniere ? 'border-transparent bg-primary-strong text-on-primary' : 'border-border bg-surface text-primary-strong'
                  }`}
                >
                  <Icone aria-hidden className="size-6" />
                  <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold text-on-accent">
                    {i + 1}
                  </span>
                </span>
                <div className={`pb-2 ${h('md:pt-3')}`}>
                  <p className="font-semibold text-ink">{e.titre}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{e.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-4 text-xs text-muted">
        Schéma pédagogique simplifié. {bccFacts.avertissement}
      </figcaption>
    </figure>
  );
}
