interface ProgressBarProps {
  valeur: number;
  max: number;
  libelle: string;
  ton?: 'primaire' | 'succes' | 'danger' | 'accent';
  hauteur?: 'fine' | 'normale';
  afficherValeur?: boolean;
}

const couleurs = {
  primaire: 'bg-primary',
  succes: 'bg-success',
  danger: 'bg-danger',
  accent: 'bg-accent',
} as const;

export function ProgressBar({ valeur, max, libelle, ton = 'primaire', hauteur = 'normale', afficherValeur }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (valeur / max) * 100)) : 0;
  return (
    <div className="w-full">
      {afficherValeur ? (
        <div className="mb-1.5 flex justify-between text-xs text-muted">
          <span>{libelle}</span>
          <span className="font-mono tabular">{Math.round(pct)} %</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={libelle}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={valeur}
        className={`w-full overflow-hidden rounded-full bg-surface-2 ${hauteur === 'fine' ? 'h-1.5' : 'h-2.5'}`}
      >
        <div
          className={`h-full rounded-full ${couleurs[ton]} transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
