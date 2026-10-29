'use client';

import { useState } from 'react';

export interface Barre {
  libelle: string;
  valeur: number;
  detail?: string;
}

/** Histogramme vertical mono-série (une teinte), avec info-bulle au survol / focus. */
export function Histogramme({ barres, titre, unite = '', hauteur = 160 }: { barres: Barre[]; titre: string; unite?: string; hauteur?: number }) {
  const [actif, setActif] = useState<number | null>(null);
  const max = Math.max(1, ...barres.map((b) => b.valeur));
  const graduations = [0, Math.ceil(max / 2), max];
  return (
    <figure>
      <div className="relative flex gap-2" style={{ height: hauteur }}>
        <div className="flex w-7 shrink-0 flex-col justify-between pb-0 text-right font-mono text-[10px] text-muted" aria-hidden>
          {[...graduations].reverse().map((g) => (
            <span key={g} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">{g}</span>
          ))}
        </div>
        <div className="relative flex flex-1 items-end gap-[2px] border-b border-border" role="img" aria-label={`${titre} : ${barres.map((b) => `${b.libelle} ${b.valeur}${unite}`).join(', ')}`}>
          {[0.5, 1].map((k) => (
            <span key={k} aria-hidden className="pointer-events-none absolute inset-x-0 border-t border-dashed border-border/70" style={{ bottom: `${k * 100}%` }} />
          ))}
          {barres.map((b, i) => (
            <button
              key={`${b.libelle}-${i}`}
              type="button"
              tabIndex={0}
              onMouseEnter={() => setActif(i)}
              onMouseLeave={() => setActif(null)}
              onFocus={() => setActif(i)}
              onBlur={() => setActif(null)}
              aria-label={`${b.libelle} : ${b.valeur}${unite}`}
              className="group relative flex h-full flex-1 items-end focus:outline-none"
            >
              <span
                className={`block w-full rounded-t-[4px] transition-colors ${actif === i ? 'bg-primary-strong' : 'bg-primary/75'}`}
                style={{ height: `${(b.valeur / max) * 100}%`, minHeight: b.valeur > 0 ? 2 : 0 }}
              />
              {actif === i ? (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs shadow-lift">
                  <span className="block font-semibold text-ink tabular">{b.valeur}{unite}</span>
                  <span className="block text-muted">{b.detail ?? b.libelle}</span>
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="ml-9 mt-1.5 flex justify-between text-[10px] text-muted" aria-hidden>
        <span>{barres[0]?.libelle}</span>
        <span>{barres[barres.length - 1]?.libelle}</span>
      </div>
    </figure>
  );
}

/** Barres horizontales classées (une teinte) : valeur en texte, jamais en couleur seule. */
export function BarresHorizontales({ lignes, format }: { lignes: Barre[]; format: (v: number) => string }) {
  const max = Math.max(1e-9, ...lignes.map((l) => l.valeur));
  return (
    <ul className="space-y-2.5">
      {lignes.map((l) => (
        <li key={l.libelle} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm" title={l.detail}>
          <span className="truncate text-ink">{l.libelle}</span>
          <span className="h-2 overflow-hidden rounded-full bg-surface-2">
            <span className="block h-full rounded-full bg-primary/80" style={{ width: `${(l.valeur / max) * 100}%` }} />
          </span>
          <span className="w-14 text-right font-mono text-xs text-muted tabular">{format(l.valeur)}</span>
        </li>
      ))}
    </ul>
  );
}
