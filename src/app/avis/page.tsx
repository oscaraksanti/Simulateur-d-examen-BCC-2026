import type { Metadata } from 'next';
import { AvisForm } from '@/components/feedback/AvisForm';

export const metadata: Metadata = {
  title: 'Donner mon avis',
  description: 'Aide-nous à améliorer le Simulateur BCC : note, fonctionnalités souhaitées, suggestions.',
};

export default function PageAvis() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-sm font-medium text-muted">Ton avis compte</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">Construisons le meilleur outil de préparation, ensemble.</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Dis-nous ce qui marche, ce qui manque et ce que tu aimerais voir ensuite. Chaque retour est lu.
      </p>
      <div className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <AvisForm contexte="page-avis" />
      </div>
    </div>
  );
}
