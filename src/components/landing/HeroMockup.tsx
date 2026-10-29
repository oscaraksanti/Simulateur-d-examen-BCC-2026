'use client';

// Fenêtre produit animée du hero : on montre le vrai produit (QCM chronométré, réponse, explication, note)
// plutôt qu'une illustration générique. Boucle douce de ~7 s, figée si « réduire les animations ».

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Clock, Lightbulb, TrendingUp } from 'lucide-react';

const OPTIONS = [
  { id: 'A', texte: 'WHERE SUM(montant_cdf) > 5e9' },
  { id: 'B', texte: 'GROUP BY banque … HAVING SUM(montant_cdf) > 5e9' },
  { id: 'C', texte: 'GROUP BY montant_cdf HAVING montant_cdf > 5e9' },
  { id: 'D', texte: 'SELECT DISTINCT … WHERE montant_cdf > 5e9' },
];

const DUREE_PHASES = [1600, 1300, 2600, 1500]; // 0 lecture · 1 choix · 2 explication · 3 note

export function HeroMockup() {
  const reduit = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [secondes, setSecondes] = useState(18 * 60 + 42);

  useEffect(() => {
    if (reduit) return;
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % DUREE_PHASES.length), DUREE_PHASES[phase]);
    return () => window.clearTimeout(id);
  }, [phase, reduit]);

  useEffect(() => {
    if (reduit) return;
    const id = window.setInterval(() => setSecondes((s) => (s <= 15 * 60 ? 18 * 60 + 42 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [reduit]);

  const p = reduit ? 2 : phase;
  const choisie = p >= 1;
  const mm = String(Math.floor(secondes / 60)).padStart(2, '0');
  const ss = String(secondes % 60).padStart(2, '0');

  return (
    <div className="relative mx-auto w-full max-w-[560px]" aria-hidden>
      {/* Fenêtre */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="truncate rounded-md bg-surface px-3 py-0.5 text-[11px] text-muted">Examen blanc · Data Analyse</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold text-ink tabular">
            <Clock className="size-3 text-muted" /> {mm}:{ss}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-muted">Question 7 / 24</span>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 font-medium text-muted">SQL · Moyen</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-[29%] rounded-full bg-primary" />
          </div>
          <p className="mt-4 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">
            Quelle requête renvoie les banques dont le volume total dépasse 5 milliards de CDF ?
          </p>
          <pre className="mt-3 overflow-hidden rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted">
            <span className="font-semibold text-primary-strong">paiements</span>(id, banque_emettrice, montant_cdf, date_op)
          </pre>
          <ul className="mt-3 space-y-1.5">
            {OPTIONS.map((o) => {
              const estB = o.id === 'B';
              const actif = choisie && estB;
              return (
                <li
                  key={o.id}
                  className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[11.5px] transition-all duration-500 ${
                    actif ? 'border-success bg-success-soft' : 'border-border bg-surface'
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold transition-colors duration-500 ${
                      actif ? 'bg-success text-white' : 'bg-surface-2 text-muted'
                    }`}
                  >
                    {actif ? <Check className="size-3" strokeWidth={3} /> : o.id}
                  </span>
                  <span className="truncate font-mono text-ink">{o.texte}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 h-[58px]">
            <AnimatePresence>
              {p >= 2 ? (
                <motion.div
                  initial={reduit ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-2.5 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-[11.5px] leading-snug text-ink"
                >
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    <strong>HAVING</strong> filtre un agrégat après GROUP BY. WHERE ne peut pas contenir SUM() : la A est fausse.
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Carte flottante : note */}
      <motion.div
        className="absolute -bottom-20 -left-6 hidden w-[210px] rounded-2xl border border-border bg-surface p-4 shadow-lift sm:block lg:-left-4 xl:-left-12"
        initial={false}
        animate={reduit ? { opacity: 1, y: 0 } : { opacity: p === 3 ? 1 : 0.92, y: p === 3 ? -6 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[11px] text-muted">Simulation n°3</p>
        <div className="mt-1.5 flex items-center gap-3">
          <svg viewBox="0 0 44 44" className="size-12 -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface-2)" strokeWidth="5" />
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" strokeDasharray={113.1} strokeDashoffset={113.1 * (1 - 14.5 / 20)} />
          </svg>
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-ink tabular">
              14,5<span className="text-sm font-normal text-muted">/20</span>
            </p>
            <p className="text-[11px] font-medium text-primary-strong">Bon niveau</p>
          </div>
        </div>
      </motion.div>

      {/* Carte flottante : progression */}
      <div className="absolute -right-16 top-[42%] hidden w-[180px] rounded-2xl border border-border bg-surface p-3.5 shadow-lift xl:block">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">Progression</p>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-success-soft px-1.5 py-0.5 text-[10px] font-semibold text-success-ink">
            <TrendingUp className="size-3" /> +5,5
          </span>
        </div>
        <svg viewBox="0 0 150 46" className="mt-2 h-auto w-full">
          <path d="M4 40 L40 33 L76 30 L112 18 L146 9" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {[[4, 40], [40, 33], [76, 30], [112, 18], [146, 9]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="2.6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.6" />
          ))}
        </svg>
        <p className="mt-1 font-mono text-[10px] text-muted">9 → 14,5 en 5 simulations</p>
      </div>
    </div>
  );
}
