import { GraduationCap } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatPoints } from './format';
import { TexteRiche } from '@/components/ui/TexteRiche';

/** Corrigé expert affiché à la fin d'un cas, avec le score obtenu. */
export function CaseDebrief({ debrief, obtenu, max }: { debrief: string; obtenu: number; max: number }) {
  const blocs = debrief.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  return (
    <section aria-labelledby="debrief-titre" className="rounded-2xl border border-success/40 bg-success-soft/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="debrief-titre" className="flex items-center gap-2 text-lg font-bold text-ink">
          <GraduationCap aria-hidden className="size-5 text-success-ink" /> Corrigé de l&apos;expert
        </h3>
        <p className="font-mono text-sm font-semibold text-ink tabular">
          {formatPoints(obtenu)}/{formatPoints(max)} pts
        </p>
      </div>
      <div className="mt-3">
        <ProgressBar valeur={obtenu} max={max} libelle="Score du cas" ton={obtenu / max >= 0.7 ? 'succes' : obtenu / max >= 0.5 ? 'accent' : 'danger'} />
      </div>
      <div className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink">
        {blocs.map((b, i) =>
          /^[•\-–]/.test(b) ? (
            <p key={i} className="flex gap-2 pl-1">
              <span aria-hidden className="text-success-ink">•</span>
              <span><TexteRiche texte={b.replace(/^[•\-–]\s*/, '')} /></span>
            </p>
          ) : (
            <p key={i}><TexteRiche texte={b} /></p>
          ),
        )}
      </div>
    </section>
  );
}
