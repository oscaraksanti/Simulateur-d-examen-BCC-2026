import Link from 'next/link';
import { ArrowRight, Crosshair, MessageCircle, PlayCircle } from 'lucide-react';
import { OSCAR, ressources } from '@/data/resources';
import { lienWhatsAppOscar } from '@/lib/share';
import type { Filiere } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/Button';

interface ResourcesOscarProps {
  note: number;
  filiere: Filiere;
  priorites: string[];
}

/** Ressources & formations officielles d'Oscar Aksanti + recommandation personnalisée. */
export function ResourcesOscar({ note, filiere, priorites }: ResourcesOscarProps) {
  const youtube = ressources.find((r) => r.id === 'youtube');
  return (
    <section aria-labelledby="ressources-titre">
      <h2 id="ressources-titre" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
        Ressources &amp; Formations officielles d&apos;{OSCAR.nom}
      </h2>
      <p className="mt-1 text-sm text-muted">Pour transformer ce diagnostic en plan de révision concret.</p>

      {priorites.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {priorites.map((p, i) => (
            <Link
              key={p}
              href={`/entrainement/?competence=${encodeURIComponent(p)}`}
              className="group flex items-center gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 transition-colors hover:border-danger"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-danger">
                <Crosshair aria-hidden className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wider text-danger">Priorité {i + 1}</span>
                <span className="block font-semibold text-ink">Priorité de révision : {p}</span>
              </span>
              <ArrowRight aria-hidden className="size-4 text-danger transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {youtube ? (
          <Card className="flex flex-col">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-danger-soft text-danger">
              <PlayCircle aria-hidden className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">{youtube.titre}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{youtube.description}</p>
            <ButtonLink href={youtube.lien} externe variante="secondaire" className="mt-5 self-start" icone={<PlayCircle aria-hidden className="size-4" />}>
              {youtube.libelleBouton}
            </ButtonLink>
          </Card>
        ) : null}
        <Card className="flex flex-col border-[#128C4B]/30">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-success-soft text-success-ink">
            <MessageCircle aria-hidden className="size-6" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-ink">Accompagnement personnalisé</h3>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">
            Un plan de formation adapté à ta note et à ta filière, avec un suivi jusqu&apos;au jour du test. Le message
            est pré-rempli avec ton résultat.
          </p>
          <ButtonLink href={lienWhatsAppOscar(note, filiere)} externe variante="whatsapp" className="mt-5 self-start" icone={<MessageCircle aria-hidden className="size-4 shrink-0" />}>
            Être accompagné par Oscar sur WhatsApp
          </ButtonLink>
        </Card>
      </div>
    </section>
  );
}
