'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { FILIERES } from '@/lib/filieres';
import { nouvelId, syncConfiguree } from '@/lib/remote';
import { ICONES_FILIERE } from '@/components/ui/IconeFiliere';
import type { Candidat, Filiere } from '@/lib/types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP = /^\+?[0-9 ]{8,20}$/;

interface Erreurs {
  nom?: string;
  email?: string;
  whatsapp?: string;
  filiere?: string;
  consentement?: string;
}

export function valider(
  nom: string,
  email: string,
  filiere: Filiere | null,
  whatsapp = '',
  consentementRequis = false,
  consentement = true,
): Erreurs {
  const e: Erreurs = {};
  if (nom.trim().length < 2) e.nom = 'Indique ton nom complet.';
  if (!EMAIL.test(email.trim())) e.email = 'Saisis une adresse e-mail valide.';
  if (whatsapp.trim() && !WHATSAPP.test(whatsapp.trim())) e.whatsapp = 'Format attendu : +243 97 000 0000.';
  if (!filiere) e.filiere = 'Choisis ta filière.';
  if (consentementRequis && !consentement) e.consentement = 'Ton accord est nécessaire pour créer ton espace.';
  return e;
}

const filieres = FILIERES.map((f) => ({ v: f.id, titre: f.nom, desc: f.resume, Icone: ICONES_FILIERE[f.id] }));

export function RegistrationForm({ filiereSuggeree }: { filiereSuggeree?: Filiere | null }) {
  const { etat, inscrire } = useExam();
  const router = useRouter();
  const id = useId();
  const existant = etat.candidat;
  const enLigne = syncConfiguree();

  const [nom, setNom] = useState(existant?.nom ?? '');
  const [email, setEmail] = useState(existant?.email ?? '');
  const [whatsapp, setWhatsapp] = useState(existant?.whatsapp ?? '');
  const [filiere, setFiliere] = useState<Filiere | null>(existant?.filiere ?? filiereSuggeree ?? null);
  const [consentement, setConsentement] = useState(Boolean(existant));
  const [contact, setContact] = useState(existant?.consentementContact ?? true);
  const [piege, setPiege] = useState(''); // champ invisible anti-robots
  const [touche, setTouche] = useState<Partial<Record<keyof Erreurs, boolean>>>({});

  const erreurs = valider(nom, email, filiere, whatsapp, enLigne, consentement);
  const valide = Object.keys(erreurs).length === 0;
  const voir = (k: keyof Erreurs) => (touche[k] ? erreurs[k] : undefined);

  const soumettre = (ev: FormEvent) => {
    ev.preventDefault();
    setTouche({ nom: true, email: true, whatsapp: true, filiere: true, consentement: true });
    if (!valide || !filiere || piege) return;
    const candidat: Candidat = {
      id: existant?.id ?? nouvelId(),
      nom: nom.trim().replace(/\s+/g, ' '),
      email: email.trim().toLowerCase(),
      filiere,
      whatsapp: whatsapp.trim() || undefined,
      consentementContact: enLigne ? contact : false,
      creeLe: existant?.creeLe ?? new Date().toISOString(),
    };
    inscrire(candidat);
    router.push('/examen/');
  };

  const champ = (erreur?: string) =>
    `mt-2 block h-12 w-full rounded-xl border bg-surface px-4 text-[15px] text-ink shadow-[0_1px_0_rgb(0_0_0/0.02)] outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-4 focus:ring-ink/5 ${
      erreur ? 'border-danger' : 'border-border hover:border-ink/25'
    }`;

  return (
    <form onSubmit={soumettre} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nom`} className="text-sm font-medium text-ink">Nom complet</label>
          <input
            id={`${id}-nom`}
            autoComplete="name"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onBlur={() => setTouche((t) => ({ ...t, nom: true }))}
            placeholder="Grâce Mbuyi"
            aria-invalid={voir('nom') ? true : undefined}
            aria-describedby={voir('nom') ? `${id}-nom-err` : undefined}
            className={champ(voir('nom'))}
          />
          {voir('nom') ? <p id={`${id}-nom-err`} role="alert" className="mt-1.5 text-[13px] text-danger">{erreurs.nom}</p> : null}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-medium text-ink">E-mail</label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouche((t) => ({ ...t, email: true }))}
            placeholder="grace.mbuyi@gmail.com"
            aria-invalid={voir('email') ? true : undefined}
            aria-describedby={voir('email') ? `${id}-email-err` : undefined}
            className={champ(voir('email'))}
          />
          {voir('email') ? <p id={`${id}-email-err`} role="alert" className="mt-1.5 text-[13px] text-danger">{erreurs.email}</p> : null}
        </div>
      </div>

      {enLigne ? (
        <div>
          <label htmlFor={`${id}-wa`} className="text-sm font-medium text-ink">
            WhatsApp <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input
            id={`${id}-wa`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            onBlur={() => setTouche((t) => ({ ...t, whatsapp: true }))}
            placeholder="+243 97 000 0000"
            aria-invalid={voir('whatsapp') ? true : undefined}
            aria-describedby={`${id}-wa-aide`}
            className={champ(voir('whatsapp'))}
          />
          <p id={`${id}-wa-aide`} className={`mt-1.5 text-[13px] ${voir('whatsapp') ? 'text-danger' : 'text-muted'}`} role={voir('whatsapp') ? 'alert' : undefined}>
            {voir('whatsapp') ?? 'Pour recevoir les nouvelles sessions et conseils de préparation.'}
          </p>
        </div>
      ) : null}

      <fieldset>
        <legend className="text-sm font-medium text-ink">Filière</legend>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {filieres.map((f) => {
            const actif = filiere === f.v;
            return (
              <label
                key={f.v}
                className={`relative flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ink/10 ${
                  actif ? 'border-ink bg-surface shadow-[0_0_0_1px_var(--ink)]' : 'border-border bg-surface hover:border-ink/30'
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-filiere`}
                  value={f.v}
                  checked={actif}
                  onChange={() => {
                    setFiliere(f.v);
                    setTouche((t) => ({ ...t, filiere: true }));
                  }}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition ${actif ? 'border-ink bg-ink text-bg' : 'border-border'}`}
                >
                  {actif ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                    <f.Icone aria-hidden className="size-4 shrink-0 text-muted" /> {f.titre}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">{f.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
        {voir('filiere') ? <p role="alert" className="mt-1.5 text-[13px] text-danger">{erreurs.filiere}</p> : null}
      </fieldset>

      {/* Piège à robots : invisible pour les humains */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Site web
          <input tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
        </label>
      </div>

      {enLigne ? (
        <div className="space-y-3 border-t border-border pt-5">
          <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-muted">
            <input
              type="checkbox"
              checked={consentement}
              onChange={(e) => {
                setConsentement(e.target.checked);
                setTouche((t) => ({ ...t, consentement: true }));
              }}
              className="mt-0.5 size-4 shrink-0 accent-[var(--ink)]"
            />
            <span>
              J&apos;accepte que mes informations et mes résultats soient enregistrés par Datalendo pour suivre ma
              préparation, et de recevoir par e-mail le récapitulatif de mes simulations. Ils ne sont <strong className="font-semibold text-ink">jamais transmis à la BCC</strong>.{' '}
              <Link href="/confidentialite/" className="font-medium text-ink underline underline-offset-2">
                Confidentialité
              </Link>
            </span>
          </label>
          {voir('consentement') ? <p role="alert" className="pl-7 text-[13px] text-danger">{erreurs.consentement}</p> : null}
          <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-muted">
            <input type="checkbox" checked={contact} onChange={(e) => setContact(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--ink)]" />
            <span>Je souhaite recevoir des conseils de préparation et l&apos;annonce des nouvelles sessions (facultatif).</span>
          </label>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!valide}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 text-[15px] font-semibold text-bg transition hover:bg-ink/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {existant ? 'Continuer vers mon espace' : 'Créer mon espace et commencer'}
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
        <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        <span>
          {enLigne
            ? 'Connexion chiffrée. Ce n’est pas une candidature : pour postuler, utilise uniquement le site officiel bcc.cd.'
            : 'Tes données restent sur ton appareil. Ce n’est pas une candidature : pour postuler, utilise uniquement bcc.cd.'}
        </span>
      </p>
    </form>
  );
}
