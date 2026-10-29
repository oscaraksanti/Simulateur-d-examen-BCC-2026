import type { ReactNode } from 'react';

type Ton = 'neutre' | 'primaire' | 'accent' | 'danger' | 'succes';

const tons: Record<Ton, string> = {
  neutre: 'bg-surface-2 text-muted border-border',
  primaire: 'bg-primary-soft text-primary-strong border-transparent',
  accent: 'bg-accent-soft text-ink border-transparent',
  danger: 'bg-danger-soft text-danger border-transparent',
  succes: 'bg-success-soft text-success-ink border-transparent',
};

export function Badge({ ton = 'neutre', children, className = '' }: { ton?: Ton; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tons[ton]} ${className}`}
    >
      {children}
    </span>
  );
}
