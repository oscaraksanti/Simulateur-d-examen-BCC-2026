'use client';

import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';

type Etat = 'neutre' | 'correct' | 'incorrect' | 'attendu';

interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  /** Lettre ou icône affichée dans la pastille. */
  marque: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  etat?: Etat;
  className?: string;
}

const styles: Record<Etat, string> = {
  neutre: '',
  correct: '!border-success !bg-success-soft',
  incorrect: '!border-danger !bg-danger-soft',
  attendu: '!border-success border-dashed',
};

/** Option sélectionnable de type carte (radio natif accessible au clavier). */
export function RadioCard({ name, value, checked, onChange, marque, children, description, disabled, etat = 'neutre', className = '' }: RadioCardProps) {
  return (
    <label
      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border bg-surface p-4 transition-all duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg ${
        checked ? 'border-primary bg-primary-soft shadow-soft' : 'border-border hover:border-primary/60 hover:bg-surface-2'
      } ${disabled ? 'cursor-default' : ''} ${styles[etat]} ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors ${
          etat === 'correct' || etat === 'attendu'
            ? 'border-success bg-success text-white'
            : etat === 'incorrect'
              ? 'border-danger bg-danger text-white'
              : checked
                ? 'border-primary-strong bg-primary-strong text-on-primary'
                : 'border-border bg-surface-2 text-muted group-hover:text-ink'
        }`}
      >
        {etat === 'correct' || etat === 'attendu' ? (
          <Check className="size-4" />
        ) : etat === 'incorrect' ? (
          <X className="size-4" />
        ) : (
          marque
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-relaxed text-ink [overflow-wrap:anywhere]">{children}</span>
        {description ? <span className="mt-1 block text-sm text-muted">{description}</span> : null}
      </span>
    </label>
  );
}
