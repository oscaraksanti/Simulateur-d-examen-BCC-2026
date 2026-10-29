import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export type StatutSection = 'a_faire' | 'en_cours' | 'termine';

const statuts: Record<StatutSection, { libelle: string; ton: 'neutre' | 'primaire' | 'succes' }> = {
  a_faire: { libelle: 'À faire', ton: 'neutre' },
  en_cours: { libelle: 'En cours', ton: 'primaire' },
  termine: { libelle: 'Terminé', ton: 'succes' },
};

interface SectionCardProps {
  icone: LucideIcon;
  titre: string;
  description: string;
  nbQuestions: number;
  duree: string;
  statut: StatutSection;
  couleur: string;
}

export function SectionCard({ icone: Icone, titre, description, nbQuestions, duree, statut, couleur }: SectionCardProps) {
  const s = statuts[statut];
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex size-11 items-center justify-center rounded-xl ${couleur}`}>
          <Icone aria-hidden className="size-5" />
        </span>
        <Badge ton={s.ton}>{s.libelle}</Badge>
      </div>
      <h3 className="mt-4 font-semibold text-ink">{titre}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <dl className="mt-4 flex gap-4 border-t border-border pt-3 text-sm">
        <div>
          <dt className="sr-only">Questions</dt>
          <dd><span className="font-mono font-semibold text-ink">{nbQuestions}</span> <span className="text-muted">questions</span></dd>
        </div>
        <div>
          <dt className="sr-only">Durée indicative</dt>
          <dd className="text-muted">≈ <span className="font-mono text-ink">{duree}</span></dd>
        </div>
      </dl>
    </Card>
  );
}
