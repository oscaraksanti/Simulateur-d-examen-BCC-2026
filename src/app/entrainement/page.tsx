import type { Metadata } from 'next';
import { TrainingSession } from '@/components/training/TrainingSession';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Entraînement par compétence',
  description: 'Révise une compétence précise (SQL, statistiques, réseaux, gestion d’incident, culture BCC…) avec correction immédiate.',
};

export default function PageEntrainement() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto mb-8 max-w-3xl">
        <Badge ton="primaire">Mode entraînement</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Travaille tes points faibles</h1>
        <p className="mt-2 leading-relaxed text-muted">
          Entre deux examens blancs, cible une ou plusieurs compétences. Chaque réponse est corrigée immédiatement, avec
          l&apos;explication complète et la réfutation des mauvaises options.
        </p>
      </div>
      <TrainingSession />
    </div>
  );
}
