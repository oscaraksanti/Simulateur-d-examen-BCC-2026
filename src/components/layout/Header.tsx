'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LogoMark } from './Logo';

const liens = [
  { href: '/', libelle: 'Accueil' },
  { href: '/examen/', libelle: 'Examen blanc' },
  { href: '/entrainement/', libelle: 'Entraînement' },
  { href: '/fiches/', libelle: 'Fiches' },
];

export function Header() {
  const chemin = usePathname();
  const actif = (href: string) => (href === '/' ? chemin === '/' : chemin.startsWith(href.replace(/\/$/, '')));
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Simulateur BCC — accueil">
          <LogoMark className="size-8 shrink-0" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-bold tracking-tight text-ink">Simulateur BCC</span>
            <span className="block truncate text-xs text-muted">Prépa Data &amp; Cyber</span>
          </span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={actif(l.href) ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                actif(l.href) ? 'bg-primary-soft text-primary-strong' : 'text-muted hover:text-ink'
              }`}
            >
              {l.libelle}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label="Navigation mobile" className="flex gap-1 overflow-x-auto border-t [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-border px-4 py-1.5 md:hidden">
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif(l.href) ? 'page' : undefined}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium ${
              actif(l.href) ? 'bg-primary-soft text-primary-strong' : 'text-muted'
            }`}
          >
            {l.libelle}
          </Link>
        ))}
      </nav>
    </header>
  );
}
