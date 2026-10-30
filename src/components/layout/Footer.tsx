import Link from 'next/link';
import { OSCAR } from '@/data/resources';
import { LogoMark } from './Logo';

const colonnes = [
  {
    titre: 'Se préparer',
    liens: [
      { href: '/examen/', libelle: 'Examen blanc' },
      { href: '/entrainement/', libelle: 'Entraînement' },
      { href: '/fiches/', libelle: 'Fiches de révision' },
    ],
  },
  {
    titre: 'Le projet',
    liens: [
      { href: '/avis/', libelle: 'Donner mon avis' },
      { href: '/confidentialite/', libelle: 'Confidentialité' },
      { href: 'https://github.com/oscaraksanti/Simulateur-d-examen-BCC-2026', libelle: 'Code source', externe: true },
    ],
  },
  {
    titre: OSCAR.marque,
    liens: [
      { href: OSCAR.site, libelle: 'datalendo.com', externe: true },
      { href: OSCAR.youtube, libelle: 'YouTube', externe: true },
      { href: `https://wa.me/${OSCAR.whatsappNumero}`, libelle: 'WhatsApp', externe: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="font-semibold tracking-[-0.02em] text-ink">Simulateur BCC</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            L&apos;examen blanc gratuit pour préparer le recrutement informatique de la BCC dans ses 8 domaines. Conçu par {OSCAR.nom} pour{' '}
            <a href={OSCAR.site} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline-offset-2 hover:underline">
              {OSCAR.marque}
            </a>
            .
          </p>
        </div>
        {colonnes.map((c) => (
          <div key={c.titre}>
            <h2 className="text-[13px] font-medium text-ink">{c.titre}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {c.liens.map((l) => (
                <li key={l.href}>
                  {'externe' in l && l.externe ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-ink">
                      {l.libelle}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-muted transition-colors hover:text-ink">
                      {l.libelle}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs leading-relaxed text-muted sm:px-6 md:flex-row md:justify-between">
          <p>
            Outil indépendant, non affilié à la Banque Centrale du Congo. Candidatures officielles uniquement sur{' '}
            <a href="https://www.bcc.cd" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
              bcc.cd
            </a>
            .
          </p>
          <p>
            Un produit{' '}
            <a href={OSCAR.site} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
              Datalendo
            </a>{' '}
            · Licence MIT · Faits BCC vérifiés au 29/10/2026
          </p>
        </div>
      </div>
    </footer>
  );
}
