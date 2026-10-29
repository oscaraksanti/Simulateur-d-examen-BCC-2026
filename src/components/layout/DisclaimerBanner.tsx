import { Info } from 'lucide-react';

/** Bandeau permanent : outil indépendant, non affilié à la BCC. Visible sur tous les écrans. */
export function DisclaimerBanner() {
  return (
    <div role="note" aria-label="Avertissement" className="relative bg-[#0b1220] text-white dark:bg-[#05080d]">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[12.5px] leading-snug sm:px-6">
        <Info aria-hidden className="hidden size-3.5 shrink-0 opacity-70 sm:block" />
        <span className="opacity-90">
          Outil de préparation indépendant, non affilié à la Banque Centrale du Congo. Les candidatures officielles se font
          uniquement via le site officiel de la BCC (
          <a href="https://www.bcc.cd" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
            bcc.cd
          </a>
          ).
        </span>
      </p>
      <div aria-hidden className="absolute inset-x-0 bottom-0 flex h-[2px]">
        <span className="flex-[6] bg-primary" />
        <span className="flex-[1.5] bg-accent" />
        <span className="flex-[2.5] bg-danger" />
      </div>
    </div>
  );
}
