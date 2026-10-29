import Link from 'next/link';
import { MessageCircle, PlayCircle } from 'lucide-react';
import { OSCAR } from '@/data/resources';
import { LogoMark } from './Logo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="font-bold text-ink">Simulateur BCC</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Outil de préparation indépendant, non affilié à la Banque Centrale du Congo. Aucune donnée n&apos;est
            transmise à la BCC ni à un serveur : tout reste sur ton appareil. Les candidatures officielles se font
            uniquement via{' '}
            <a href="https://www.bcc.cd" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-strong underline-offset-2 hover:underline">
              bcc.cd
            </a>
            .
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Se préparer</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" href="/examen/">Examen blanc chronométré</Link></li>
            <li><Link className="hover:text-ink" href="/entrainement/">Entraînement par compétence</Link></li>
            <li><Link className="hover:text-ink" href="/fiches/">Fiches de révision &amp; jour J</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Conçu par {OSCAR.nom}</h2>
          <p className="mt-1 text-sm text-muted">{OSCAR.marque}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={OSCAR.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-ink">
                <PlayCircle aria-hidden className="size-4" /> YouTube @oscaraksanti
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${OSCAR.whatsappNumero}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-ink">
                <MessageCircle aria-hidden className="size-4" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted sm:px-6">
          Projet open source sous licence MIT · Contenu pédagogique original · Faits BCC vérifiés au 29/10/2026.
        </p>
      </div>
    </footer>
  );
}
