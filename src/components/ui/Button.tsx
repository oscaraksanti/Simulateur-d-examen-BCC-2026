import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variante = 'primaire' | 'secondaire' | 'fantome' | 'danger' | 'whatsapp' | 'accent';
type Taille = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[background-color,box-shadow,transform,color,border-color] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 select-none text-center leading-tight';

const variantes: Record<Variante, string> = {
  primaire: 'bg-primary-strong text-on-primary shadow-soft hover:brightness-110',
  secondaire: 'border border-border bg-surface text-ink hover:border-primary hover:text-primary-strong',
  fantome: 'text-ink hover:bg-surface-2',
  danger: 'bg-danger text-white hover:brightness-110',
  whatsapp: 'bg-[#128C4B] text-white shadow-soft hover:bg-[#0F7A41]',
  accent: 'bg-accent text-on-accent shadow-soft hover:brightness-105',
};

const tailles: Record<Taille, string> = {
  sm: 'min-h-9 px-3.5 py-1.5 text-sm',
  md: 'min-h-11 px-5 py-2 text-[15px]',
  lg: 'min-h-13 px-6 py-3 text-base',
};

export function classesBouton(variante: Variante = 'primaire', taille: Taille = 'md', extra = ''): string {
  return `${base} ${variantes[variante]} ${tailles[taille]} ${extra}`.trim();
}

interface BoutonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  taille?: Taille;
  icone?: ReactNode;
}

export function Button({ variante = 'primaire', taille = 'md', icone, className = '', children, type = 'button', ...reste }: BoutonProps) {
  return (
    <button type={type} className={classesBouton(variante, taille, className)} {...reste}>
      {icone}
      {children}
    </button>
  );
}

interface LienBoutonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variante?: Variante;
  taille?: Taille;
  icone?: ReactNode;
  externe?: boolean;
}

/** Lien stylé comme un bouton ; `externe` ouvre dans un nouvel onglet en toute sécurité. */
export function ButtonLink({ href, variante = 'primaire', taille = 'md', icone, externe, className = '', children, ...reste }: LienBoutonProps) {
  const classes = classesBouton(variante, taille, className);
  if (externe) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...reste}>
        {icone}
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...reste}>
      {icone}
      {children}
    </Link>
  );
}
