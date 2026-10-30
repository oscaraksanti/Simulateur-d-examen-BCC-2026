'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LogoMark } from './Logo';
import { useExam } from '@/context/ExamContext';

const liens = [
  { href: '/examen/', libelle: 'Examen blanc' },
  { href: '/entrainement/', libelle: 'Entraînement' },
  { href: '/fiches/', libelle: 'Fiches' },
  { href: '/avis/', libelle: 'Ton avis' },
];

export function Header() {
  const chemin = usePathname();
  const { etat } = useExam();
  const inscrit = etat.hydrate && etat.candidat !== null;
  const [defile, setDefile] = useState(false);
  const actif = (href: string) => chemin.startsWith(href.replace(/\/$/, ''));

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    const premier = window.requestAnimationFrame(surDefilement);
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => {
      window.cancelAnimationFrame(premier);
      window.removeEventListener('scroll', surDefilement);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
        defile ? 'border-b border-border bg-bg/80 backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent bg-surface'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Simulateur BCC — accueil">
          <LogoMark className="size-7 shrink-0" />
          <span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-ink">
            Simulateur BCC
            <span className="ml-2 hidden font-normal text-muted sm:inline">Prépa IT</span>
          </span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 md:flex">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={actif(l.href) ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-[14px] transition-colors ${actif(l.href) ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`}
            >
              {l.libelle}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={inscrit ? '/examen/' : '/#commencer'}
            className="group hidden h-9 items-center gap-1.5 rounded-lg bg-ink px-3.5 text-[13.5px] font-semibold text-bg transition hover:bg-ink/85 sm:inline-flex"
          >
            {inscrit ? 'Mon espace' : 'Commencer'}
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      <nav aria-label="Navigation mobile" className="flex gap-1 overflow-x-auto border-t border-border px-4 py-1.5 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif(l.href) ? 'page' : undefined}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] ${actif(l.href) ? 'bg-surface-2 font-medium text-ink' : 'text-muted'}`}
          >
            {l.libelle}
          </Link>
        ))}
      </nav>
    </header>
  );
}
