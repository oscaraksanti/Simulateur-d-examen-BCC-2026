'use client';

import { useEffect, useState } from 'react';
import { lireStatsPubliques, type StatsPubliques } from '@/lib/remote';
import { CountUp } from './CountUp';

/** Chiffres réels issus de la base (affichés seulement s'ils existent et sont significatifs). */
export function LiveStats({ seuil = 20 }: { seuil?: number }) {
  const [stats, setStats] = useState<StatsPubliques | null>(null);

  useEffect(() => {
    let actif = true;
    void lireStatsPubliques().then((s) => {
      if (actif) setStats(s);
    });
    return () => {
      actif = false;
    };
  }, []);

  if (!stats || stats.candidats < seuil) return null;
  return (
    <p className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <span>
        <strong className="font-semibold text-ink"><CountUp valeur={stats.candidats} /></strong> candidats inscrits ·{' '}
        <strong className="font-semibold text-ink"><CountUp valeur={stats.simulations} /></strong> simulations passées
      </span>
    </p>
  );
}
