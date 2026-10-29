'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { RadioCard } from '@/components/ui/RadioCard';
import { Button } from '@/components/ui/Button';
import { NetworkGraph } from '@/components/illustrations/NetworkGraph';
import { ShieldPulse } from '@/components/illustrations/ShieldPulse';
import type { Candidat, Filiere } from '@/lib/types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Erreurs {
  nom?: string;
  email?: string;
  filiere?: string;
}

export function valider(nom: string, email: string, filiere: Filiere | null): Erreurs {
  const e: Erreurs = {};
  if (nom.trim().length < 2) e.nom = 'Indique ton nom complet (au moins 2 caractères).';
  if (!EMAIL.test(email.trim())) e.email = 'Saisis une adresse e-mail valide (ex. prenom.nom@gmail.com).';
  if (!filiere) e.filiere = 'Choisis ta filière : Data Analyse ou Cybersécurité.';
  return e;
}

export function RegistrationForm({ filiereSuggeree }: { filiereSuggeree?: Filiere | null }) {
  const { etat, inscrire } = useExam();
  const router = useRouter();
  const id = useId();
  const existant = etat.candidat;

  const [nom, setNom] = useState(existant?.nom ?? '');
  const [email, setEmail] = useState(existant?.email ?? '');
  const [filiere, setFiliere] = useState<Filiere | null>(existant?.filiere ?? filiereSuggeree ?? null);
  const [touche, setTouche] = useState<{ nom?: boolean; email?: boolean; filiere?: boolean }>({});

  const erreurs = valider(nom, email, filiere);
  const valide = Object.keys(erreurs).length === 0;

  const soumettre = (ev: FormEvent) => {
    ev.preventDefault();
    setTouche({ nom: true, email: true, filiere: true });
    if (!valide || !filiere) return;
    const candidat: Candidat = {
      nom: nom.trim().replace(/\s+/g, ' '),
      email: email.trim().toLowerCase(),
      filiere,
      creeLe: existant?.creeLe ?? new Date().toISOString(),
    };
    inscrire(candidat);
    router.push('/examen/');
  };

  const champ =
    'mt-1.5 block h-12 w-full rounded-xl border bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft';

  return (
    <form onSubmit={soumettre} noValidate className="space-y-5" aria-describedby={`${id}-confidentialite`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nom`} className="text-sm font-semibold text-ink">
            Nom complet
          </label>
          <input
            id={`${id}-nom`}
            name="nom"
            autoComplete="name"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onBlur={() => setTouche((t) => ({ ...t, nom: true }))}
            placeholder="Ex. Grâce Mbuyi"
            aria-invalid={touche.nom && erreurs.nom ? true : undefined}
            aria-describedby={erreurs.nom ? `${id}-nom-err` : undefined}
            className={`${champ} ${touche.nom && erreurs.nom ? 'border-danger' : 'border-border'}`}
          />
          {touche.nom && erreurs.nom ? (
            <p id={`${id}-nom-err`} role="alert" className="mt-1.5 text-sm text-danger">
              {erreurs.nom}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-semibold text-ink">
            E-mail
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouche((t) => ({ ...t, email: true }))}
            placeholder="prenom.nom@gmail.com"
            aria-invalid={touche.email && erreurs.email ? true : undefined}
            aria-describedby={erreurs.email ? `${id}-email-err` : undefined}
            className={`${champ} ${touche.email && erreurs.email ? 'border-danger' : 'border-border'}`}
          />
          {touche.email && erreurs.email ? (
            <p id={`${id}-email-err`} role="alert" className="mt-1.5 text-sm text-danger">
              {erreurs.email}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Filière</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(
            [
              { v: 'data', titre: 'Data Analyse', desc: 'SQL, Python, statistiques, Power BI, qualité des données', Illu: NetworkGraph },
              { v: 'cyber', titre: 'Cybersécurité', desc: 'Réseaux, crypto, OWASP, SIEM, réponse à incident, PCI-DSS', Illu: ShieldPulse },
            ] as const
          ).map(({ v, titre, desc, Illu }) => (
            <RadioCard
              key={v}
              name={`${id}-filiere`}
              value={v}
              checked={filiere === v}
              onChange={(val) => {
                setFiliere(val === 'cyber' ? 'cyber' : 'data');
                setTouche((t) => ({ ...t, filiere: true }));
              }}
              marque={v === 'data' ? 'D' : 'C'}
              description={desc}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold">{titre}</span>
                <Illu className="hidden h-10 w-16 shrink-0 sm:block" />
              </span>
            </RadioCard>
          ))}
        </div>
        {touche.filiere && erreurs.filiere ? (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {erreurs.filiere}
          </p>
        ) : null}
      </fieldset>

      <Button type="submit" taille="lg" disabled={!valide} className="w-full sm:w-auto" icone={<ArrowRight aria-hidden className="order-last size-5" />}>
        {existant ? 'Continuer vers mon espace' : 'Commencer ma préparation'}
      </Button>

      <div id={`${id}-confidentialite`} className="flex items-start gap-2.5 rounded-xl bg-surface-2 p-3.5 text-sm text-muted">
        <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-success-ink" />
        <p>
          <strong className="font-semibold text-ink">Tes données restent sur ton appareil.</strong> Rien n&apos;est envoyé
          à la BCC ni à un serveur. Ce simulateur n&apos;est pas une candidature et ne transmet rien à la Banque Centrale du
          Congo.
        </p>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <ShieldCheck aria-hidden className="size-3.5" /> Pour postuler officiellement : uniquement sur le site officiel bcc.cd.
      </p>
    </form>
  );
}
