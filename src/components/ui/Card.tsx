import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article' | 'aside';
}

const paddings = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' } as const;

export function Card({ padding = 'md', as: Balise = 'div', className = '', ...reste }: CardProps) {
  return (
    <Balise
      className={`rounded-2xl border border-border bg-surface shadow-soft ${paddings[padding]} ${className}`}
      {...reste}
    />
  );
}
