'use client';

import { useId, useState } from 'react';
import { Search, TerminalSquare } from 'lucide-react';
import { colorer } from '@/components/ui/CodeBlock';

/** Visionneuse de logs façon terminal SOC : numéros de ligne, IP et codes HTTP surlignés, filtre. */
export function LogViewer({ titre, lignes }: { titre: string; lignes: string[] }) {
  const [filtre, setFiltre] = useState('');
  const id = useId();
  const f = filtre.trim().toLowerCase();
  const visibles = lignes.map((l, i) => ({ l, i })).filter(({ l }) => !f || l.toLowerCase().includes(f));

  return (
    <figure className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface-2">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <TerminalSquare aria-hidden className="size-4 text-primary-strong" /> {titre}
        </span>
        <label htmlFor={id} className="relative">
          <span className="sr-only">Filtrer les lignes de log</span>
          <Search aria-hidden className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
          <input
            id={id}
            value={filtre}
            onChange={(e) => setFiltre(e.target.value)}
            placeholder="Filtrer (IP, 503…)"
            className="h-8 w-40 rounded-lg border border-border bg-surface pl-7 pr-2 font-mono text-xs text-ink focus:border-primary focus:outline-none"
          />
        </label>
      </figcaption>
      <div className="scroll-fin max-h-[380px] overflow-auto">
        <pre className="min-w-max p-3 font-mono text-[12px] leading-[1.7] text-ink">
          {visibles.map(({ l, i }) => (
            <div key={i} className="flex gap-3 rounded px-1 hover:bg-surface">
              <span aria-hidden className="w-6 shrink-0 select-none text-right text-muted/70">{i + 1}</span>
              <code>{colorer(l, 'log')}</code>
            </div>
          ))}
          {visibles.length === 0 ? <p className="px-1 text-muted">Aucune ligne ne correspond au filtre.</p> : null}
        </pre>
      </div>
      <p className="border-t border-border px-3 py-1.5 font-mono text-[11px] text-muted" aria-live="polite">
        {visibles.length}/{lignes.length} lignes
      </p>
    </figure>
  );
}
