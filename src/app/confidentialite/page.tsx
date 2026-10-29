import type { Metadata } from 'next';
import Link from 'next/link';
import { OSCAR } from '@/data/resources';

export const metadata: Metadata = {
  title: 'Confidentialité',
  description: 'Quelles données le Simulateur BCC collecte, pourquoi, et comment les supprimer.',
};

const sections: { titre: string; contenu: React.ReactNode }[] = [
  {
    titre: 'Qui sommes-nous ?',
    contenu: (
      <>
        Le Simulateur BCC est un outil de préparation <strong>indépendant</strong>, conçu par {OSCAR.nom} pour{' '}
        <a href={OSCAR.site} target="_blank" rel="noopener noreferrer">
          {OSCAR.marque}
        </a>
        . Il
        n&apos;est pas affilié à la Banque Centrale du Congo et ne constitue pas une candidature. Les candidatures officielles se
        font uniquement sur <a href="https://www.bcc.cd" target="_blank" rel="noopener noreferrer">bcc.cd</a>.
      </>
    ),
  },
  {
    titre: 'Quelles données ?',
    contenu: (
      <ul>
        <li>À l&apos;inscription : nom, adresse e-mail, filière et, si tu le souhaites, numéro WhatsApp.</li>
        <li>À la fin de chaque simulation : ta note, tes scores par section et par compétence, la durée.</li>
        <li>Si tu donnes ton avis : ta note de satisfaction, tes souhaits et ton message.</li>
        <li>Le journal des e-mails qui te sont envoyés (date, type, statut).</li>
        <li>La provenance du lien (ex. partage WhatsApp) pour mesurer la diffusion de l&apos;outil.</li>
      </ul>
    ),
  },
  {
    titre: 'Pourquoi ?',
    contenu: (
      <ul>
        <li>Suivre ta progression et améliorer les questions là où les candidats bloquent le plus.</li>
        <li>Mesurer l&apos;usage de l&apos;outil (nombre d&apos;inscrits, de simulations).</li>
        <li>T&apos;envoyer un e-mail de bienvenue et le récapitulatif de chaque simulation (note, priorités de révision).</li>
        <li>
          Uniquement si tu as coché la case correspondante : t&apos;envoyer des conseils de préparation et l&apos;annonce des
          nouvelles sessions.
        </li>
      </ul>
    ),
  },
  {
    titre: 'Ce que nous ne faisons jamais',
    contenu: (
      <ul>
        <li>Transmettre tes données à la Banque Centrale du Congo ou à un employeur.</li>
        <li>Vendre ou louer tes données.</li>
        <li>Te demander de l&apos;argent pour « faciliter » un recrutement.</li>
      </ul>
    ),
  },
  {
    titre: 'Où sont-elles stockées ?',
    contenu: (
      <>
        Dans une base de données sécurisée (Supabase) opérée par Datalendo, accessible uniquement à l&apos;administrateur du simulateur. Les e-mails sont envoyés via Resend. Les échanges
        sont chiffrés (HTTPS). Ton historique de simulations est aussi conservé dans ton navigateur pour fonctionner hors ligne.
      </>
    ),
  },
  {
    titre: 'Tes droits',
    contenu: (
      <>
        Tu peux demander à consulter, corriger ou supprimer tes données à tout moment en écrivant sur WhatsApp au{' '}
        <a href={`https://wa.me/${OSCAR.whatsappNumero}`} target="_blank" rel="noopener noreferrer">
          +{OSCAR.whatsappNumero}
        </a>
        . Les données d&apos;un compte supprimé sont effacées définitivement, résultats compris.
      </>
    ),
  },
];

export default function PageConfidentialite() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-sm font-medium text-muted">Dernière mise à jour : 29 octobre 2026</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">Confidentialité</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Ce que nous collectons, pourquoi, et comment garder la main sur tes données. En clair, sans jargon.
      </p>
      <div className="mt-12 divide-y divide-border border-y border-border">
        {sections.map((s) => (
          <section key={s.titre} className="grid gap-3 py-8 md:grid-cols-[220px_1fr] md:gap-10">
            <h2 className="font-semibold text-ink">{s.titre}</h2>
            <div className="text-[15px] leading-relaxed text-muted [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
              {s.contenu}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">
        Une question ? <Link href="/avis/" className="font-medium text-ink underline underline-offset-2">Écris-nous</Link>.
      </p>
    </div>
  );
}
