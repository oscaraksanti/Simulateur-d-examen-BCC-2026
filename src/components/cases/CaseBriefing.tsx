import { AlarmClock, FileText, Target, UserRound } from 'lucide-react';
import type { CasPratique } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from './DataTable';
import { LogViewer } from './LogViewer';

/** Briefing « salle de crise » : rôle, heure simulée, enjeu, contexte et pièces jointes. */
export function CaseBriefing({ cas }: { cas: CasPratique }) {
  const cyber = cas.filiere === 'cyber';
  return (
    <div className="min-w-0 space-y-5">
      <div className={`relative overflow-hidden rounded-2xl p-5 ${cyber ? 'bg-[#0B1B33] text-white' : 'bg-primary-soft text-ink'}`}>
        <div aria-hidden className={`absolute -right-10 -top-10 size-40 rounded-full ${cyber ? 'bg-danger/25' : 'bg-primary/15'} blur-2xl`} />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge ton={cyber ? 'danger' : 'primaire'}>{cas.id}</Badge>
            <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${cyber ? 'text-white/80' : 'text-muted'}`}>
              <AlarmClock aria-hidden className="size-3.5" /> {cas.heure}
            </span>
          </div>
          <h2 className="mt-3 text-xl font-bold leading-snug">{cas.titre}</h2>
          <dl className={`mt-4 grid gap-2 text-sm ${cyber ? 'text-white/90' : 'text-ink'}`}>
            <div className="flex gap-2">
              <dt><UserRound aria-hidden className="mt-0.5 size-4" /><span className="sr-only">Rôle</span></dt>
              <dd>{cas.role}</dd>
            </div>
            <div className="flex gap-2">
              <dt><Target aria-hidden className="mt-0.5 size-4" /><span className="sr-only">Enjeu</span></dt>
              <dd className="font-semibold">{cas.enjeu}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Briefing</h3>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink">{cas.contexte}</p>
      </div>

      {cas.piecesJointes.length > 0 ? (
        <div className="space-y-4">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted">
            <FileText aria-hidden className="size-4" /> Pièces jointes ({cas.piecesJointes.length})
          </h3>
          {cas.piecesJointes.map((p, i) =>
            p.type === 'table' ? (
              <DataTable key={i} titre={p.titre} colonnes={p.colonnes} lignes={p.lignes} />
            ) : p.type === 'logs' ? (
              <LogViewer key={i} titre={p.titre} lignes={p.lignes} />
            ) : (
              <figure key={i} className="min-w-0 rounded-xl border border-border bg-surface-2">
                <figcaption className="border-b border-border px-3 py-2 text-sm font-semibold text-ink">{p.titre}</figcaption>
                <div className="scroll-fin max-h-[420px] overflow-auto whitespace-pre-wrap p-3 font-mono text-[12.5px] leading-relaxed text-ink [overflow-wrap:anywhere]">
                  {p.contenu}
                </div>
              </figure>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
