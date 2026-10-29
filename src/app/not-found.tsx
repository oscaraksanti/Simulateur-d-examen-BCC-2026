import { Compass } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export default function PageIntrouvable() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-strong">
        <Compass aria-hidden className="size-7" />
      </span>
      <p className="mt-6 font-mono text-sm font-semibold text-muted">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Cette page n&apos;existe pas</h1>
      <p className="mt-3 text-muted">Le lien est peut-être incomplet. Reviens à l&apos;accueil pour lancer ta simulation.</p>
      <ButtonLink href="/" className="mt-8">
        Retour à l&apos;accueil
      </ButtonLink>
    </div>
  );
}
