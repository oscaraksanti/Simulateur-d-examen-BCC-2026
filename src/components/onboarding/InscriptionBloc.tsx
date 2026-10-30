'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { ArrowRight, RotateCcw, Swords, UserRound } from 'lucide-react';
import { OBJECTIF_SIMULATIONS, useExam } from '@/context/ExamContext';
import { RegistrationForm } from './RegistrationForm';
import { ButtonLink, Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CLES, ecrire } from '@/lib/storage';
import { formatNote, LIBELLES_FILIERE, lireDefi } from '@/lib/share';

const sAbonner = () => () => undefined;
const lireRecherche = () => window.location.search;

/** Paramètres d'URL lus côté client (export statique : pas de rendu serveur dynamique). */
function useRecherche(): string {
  return useSyncExternalStore(sAbonner, lireRecherche, () => '');
}

/** Bandeau « Un ami te défie » si l'URL contient ?defi=… */
export function DefiBanner() {
  const recherche = useRecherche();
  const defi = lireDefi(new URLSearchParams(recherche));

  // Conserve la provenance (?ref=wa, ?defi=…) pour une mesure ultérieure, sans serveur.
  useEffect(() => {
    const p = new URLSearchParams(recherche);
    const ref = p.get('ref') ?? (p.has('defi') ? 'defi' : null);
    if (ref) ecrire(CLES.ref, { ref: ref.slice(0, 32), date: new Date().toISOString() });
  }, [recherche]);

  if (!defi) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="flex items-center gap-3 rounded-2xl border border-accent bg-accent-soft px-4 py-3 text-ink shadow-soft">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent">
          <Swords aria-hidden className="size-5" />
        </span>
        <p className="text-[15px]">
          <strong>Un ami te défie : bats {formatNote(defi.note)}/20 !</strong>{' '}
          {defi.filiere ? <span className="text-muted">Filière {LIBELLES_FILIERE[defi.filiere]}.</span> : null}{' '}
          <a href="#commencer" className="font-semibold text-primary-strong underline underline-offset-2">
            Relever le défi
          </a>
        </p>
      </div>
    </div>
  );
}

export function InscriptionBloc() {
  const { etat, nouvelleTentative } = useExam();
  const recherche = useRecherche();
  const filiereDefi = lireDefi(new URLSearchParams(recherche))?.filiere ?? null;
  const [modifier, setModifier] = useState(false);

  if (!etat.hydrate) {
    return <div className="h-[420px] animate-pulse rounded-2xl bg-surface-2" aria-hidden />;
  }

  const c = etat.candidat;
  if (c && !modifier) {
    const prenom = c.nom.split(' ')[0];
    const nb = etat.historique.length;
    const meilleure = nb > 0 ? Math.max(...etat.historique.map((t) => t.noteSur20)) : null;
    const enCours = etat.examen && !etat.resultat;
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-strong">
            <UserRound aria-hidden className="size-6" />
          </span>
          <div>
            <p className="text-lg font-semibold text-ink">Bon retour, {prenom} 👋</p>
            <p className="text-sm text-muted">Filière {LIBELLES_FILIERE[c.filiere]}</p>
          </div>
        </div>
        <div className="rounded-xl bg-surface-2 p-4">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="font-semibold text-ink">Objectif : {OBJECTIF_SIMULATIONS} simulations</span>
            <span className="font-mono text-muted tabular">
              {Math.min(nb, OBJECTIF_SIMULATIONS)}/{OBJECTIF_SIMULATIONS}
            </span>
          </div>
          <ProgressBar valeur={Math.min(nb, OBJECTIF_SIMULATIONS)} max={OBJECTIF_SIMULATIONS} libelle="Simulations réalisées" ton={nb >= OBJECTIF_SIMULATIONS ? 'succes' : 'primaire'} />
          {meilleure !== null ? (
            <p className="mt-2 text-sm text-muted">
              Meilleure note : <span className="font-mono font-semibold text-ink">{formatNote(meilleure)}/20</span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/examen/" taille="lg" icone={<ArrowRight aria-hidden className="order-last size-5" />}>
            {enCours ? 'Reprendre mon examen' : 'Aller à mon espace'}
          </ButtonLink>
          {etat.resultat ? (
            <Button variante="secondaire" taille="lg" onClick={nouvelleTentative} icone={<RotateCcw aria-hidden className="size-4" />}>
              Nouvelle simulation
            </Button>
          ) : null}
        </div>
        <button type="button" onClick={() => setModifier(true)} className="text-sm font-medium text-primary-strong hover:underline">
          Modifier mes informations ou ma filière
        </button>
      </div>
    );
  }

  return <RegistrationForm key={c ? 'modif' : 'nouveau'} filiereSuggeree={filiereDefi} />;
}
