import { ShieldAlert } from 'lucide-react';

/** Bandeau permanent : outil indépendant, non affilié à la BCC. Visible sur tous les écrans. */
export function DisclaimerBanner() {
  return (
    <div role="note" aria-label="Avertissement" className="border-b border-border bg-accent-soft">
      <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-[12.5px] leading-snug text-ink sm:items-center sm:px-6">
        <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 sm:mt-0" />
        <span>
          <strong className="font-semibold">Outil de préparation indépendant, non affilié à la Banque Centrale du Congo.</strong>{' '}
          Les candidatures officielles se font uniquement via le site officiel de la BCC (
          <a
            href="https://www.bcc.cd"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            bcc.cd
          </a>
          ).
        </span>
      </p>
    </div>
  );
}
