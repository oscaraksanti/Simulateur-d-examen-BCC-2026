'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExam, type EtatExamen } from './ExamContext';

export type Exigence = 'candidat' | 'qcm_termine' | 'resultat';

/** Route où renvoyer le candidat si l'exigence n'est pas remplie (null = accès autorisé). */
export function redirectionPour(etat: EtatExamen, exigence: Exigence): string | null {
  if (!etat.candidat) return '/';
  if (exigence === 'qcm_termine' && !etat.examen?.finQcm) return etat.resultat ? '/resultats/' : '/examen/';
  if (exigence === 'resultat' && !etat.resultat) {
    if (etat.examen?.finQcm) return '/cas-pratiques/';
    return '/examen/';
  }
  return null;
}

/**
 * Garde de navigation côté client : redirige vers la bonne étape si la précédente
 * n'est pas complétée. Renvoie true quand la page peut s'afficher.
 */
export function useGarde(exigence: Exigence): boolean {
  const { etat } = useExam();
  const router = useRouter();
  const cible = etat.hydrate ? redirectionPour(etat, exigence) : null;

  useEffect(() => {
    if (cible) router.replace(cible);
  }, [cible, router]);

  return etat.hydrate && cible === null;
}
