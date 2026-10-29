'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

type Cellule = string | number;

/** Convertit « 9 950 000 », « 2 927,25 » ou « 6,1 % » en nombre (sinon null). */
export function enNombre(v: Cellule): number | null {
  if (typeof v === 'number') return v;
  const nettoye = v.replace(/[\s  %]/g, '').replace(',', '.');
  if (!/^[-+]?\d+(\.\d+)?$/.test(nettoye)) return null;
  return Number(nettoye);
}

function formater(v: Cellule): string {
  return typeof v === 'number' ? v.toLocaleString('fr-FR') : v;
}

/** Tableau de pièce jointe triable (clic sur l'en-tête), défilement horizontal interne. */
export function DataTable({ titre, colonnes, lignes }: { titre: string; colonnes: string[]; lignes: Cellule[][] }) {
  const [tri, setTri] = useState<{ col: number; sens: 'asc' | 'desc' } | null>(null);

  const numeriques = useMemo(
    () => colonnes.map((_, c) => lignes.length > 0 && lignes.every((l) => enNombre(l[c] ?? '') !== null)),
    [colonnes, lignes],
  );

  const triees = useMemo(() => {
    if (!tri) return lignes;
    const { col, sens } = tri;
    const facteur = sens === 'asc' ? 1 : -1;
    return [...lignes].sort((a, b) => {
      const na = enNombre(a[col] ?? '');
      const nb = enNombre(b[col] ?? '');
      if (na !== null && nb !== null) return (na - nb) * facteur;
      return String(a[col]).localeCompare(String(b[col]), 'fr', { numeric: true }) * facteur;
    });
  }, [lignes, tri]);

  const basculer = (col: number) =>
    setTri((t) => (t?.col === col ? (t.sens === 'asc' ? { col, sens: 'desc' } : null) : { col, sens: 'asc' }));

  return (
    <figure className="min-w-0">
      <figcaption className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-ink">{titre}</span>
        <span className="text-xs text-muted">{lignes.length} lignes · clique un en-tête pour trier</span>
      </figcaption>
      <div className="scroll-fin max-h-[420px] overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-surface-2">
            <tr>
              {colonnes.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  aria-sort={tri?.col === i ? (tri.sens === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="whitespace-nowrap border-b border-border p-0 font-semibold text-ink"
                >
                  <button
                    type="button"
                    onClick={() => basculer(i)}
                    className={`flex w-full items-center gap-1 px-3 py-2.5 hover:text-primary-strong ${numeriques[i] ? 'justify-end' : ''}`}
                  >
                    {c}
                    {tri?.col === i ? (
                      tri.sens === 'asc' ? <ArrowUp aria-hidden className="size-3.5" /> : <ArrowDown aria-hidden className="size-3.5" />
                    ) : (
                      <ArrowUpDown aria-hidden className="size-3.5 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {triees.map((l, r) => (
              <tr key={r} className="border-b border-border last:border-0 odd:bg-surface even:bg-surface-2/40 hover:bg-primary-soft/60">
                {l.map((v, c) => (
                  <td key={c} className={`whitespace-nowrap px-3 py-2 ${numeriques[c] ? 'text-right font-mono tabular' : 'text-ink'}`}>
                    {formater(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
