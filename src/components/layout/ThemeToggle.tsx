'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { CLES, ecrire, supprimer } from '@/lib/storage';

type Theme = 'systeme' | 'light' | 'dark';

const auditeurs = new Set<() => void>();

function lireTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : 'systeme';
}

function abonner(rappel: () => void) {
  auditeurs.add(rappel);
  return () => auditeurs.delete(rappel);
}

function appliquer(theme: Theme) {
  if (theme === 'systeme') {
    delete document.documentElement.dataset.theme;
    supprimer(CLES.theme);
  } else {
    document.documentElement.dataset.theme = theme;
    ecrire(CLES.theme, theme);
  }
  auditeurs.forEach((a) => a());
}

const suivant: Record<Theme, Theme> = { systeme: 'light', light: 'dark', dark: 'systeme' };
const libelles: Record<Theme, string> = { systeme: 'Thème : système', light: 'Thème : clair', dark: 'Thème : sombre' };

/** Bascule manuelle du thème : système → clair → sombre (attribut data-theme). */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(abonner, lireTheme, () => 'systeme');
  const Icone = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={() => appliquer(suivant[theme])}
      className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:text-ink"
      aria-label={`${libelles[theme]}. Changer de thème`}
      title={libelles[theme]}
    >
      <Icone className="size-[18px]" aria-hidden />
    </button>
  );
}
