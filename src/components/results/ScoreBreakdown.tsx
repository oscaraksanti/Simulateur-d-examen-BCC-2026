import { Briefcase, Landmark, Puzzle, Wrench } from 'lucide-react';
import type { ResultatExamen } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatPoints } from '@/components/cases/format';

/** Barres de score par section (QCM) + cas pratiques, avec contribution à la note /20. */
export function ScoreBreakdown({ resultat }: { resultat: ResultatExamen }) {
  const lignes = [
    { libelle: 'Technique', icone: Wrench, ...resultat.parSection.technique },
    { libelle: 'Culture BCC', icone: Landmark, ...resultat.parSection.culture_bcc },
    { libelle: 'Aptitudes logiques', icone: Puzzle, ...resultat.parSection.logique },
    { libelle: 'Cas pratiques', icone: Briefcase, obtenu: resultat.scoreCas, max: resultat.scoreCasMax },
  ];
  const ton = (t: number): 'succes' | 'accent' | 'danger' => (t >= 0.7 ? 'succes' : t >= 0.5 ? 'accent' : 'danger');
  return (
    <div className="space-y-5">
      {lignes.map(({ libelle, icone: Icone, obtenu, max }) => {
        const t = max > 0 ? obtenu / max : 0;
        return (
          <div key={libelle}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 font-semibold text-ink">
                <Icone aria-hidden className="size-4 text-muted" /> {libelle}
              </span>
              <span className="font-mono text-muted tabular">
                <span className="font-semibold text-ink">{formatPoints(obtenu)}</span>/{formatPoints(max)} · {Math.round(t * 100)} %
              </span>
            </div>
            <ProgressBar valeur={obtenu} max={max} libelle={`Score ${libelle}`} ton={ton(t)} />
          </div>
        );
      })}
      <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">
        Calcul : QCM <span className="font-mono text-ink">{resultat.scoreQcm}/{resultat.scoreQcmMax}</span> × 12 + cas{' '}
        <span className="font-mono text-ink">{formatPoints(resultat.scoreCas)}/{resultat.scoreCasMax}</span> × 8, arrondi au 0,5.
      </p>
    </div>
  );
}
