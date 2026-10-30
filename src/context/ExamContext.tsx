'use client';

// État global de la simulation (useReducer + persistance localStorage).
// Le contexte ne stocke que des identifiants : les banques de questions sont importées
// uniquement par les pages qui en ont besoin (bundle de l'accueil plus léger).

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { estFiliere } from '@/lib/filieres';
import { CLES, ecrire, lire, supprimer, toutEffacer } from '@/lib/storage';
import { nouvelId, synchroniserCandidat, synchroniserTentative, viderFile } from '@/lib/remote';
import type {
  Candidat,
  Filiere,
  OptionId,
  ReponseEtape,
  ReponsesCas,
  ResultatExamen,
  Tentative,
} from '@/lib/types';

export const DUREE_QCM_MS = 30 * 60 * 1000;
export const DUREE_CAS_MS = 20 * 60 * 1000;
export const OBJECTIF_SIMULATIONS = 5;

export interface SessionExamen {
  graine: string;
  filiere: Filiere;
  questionIds: string[];
  reponses: Record<string, OptionId>;
  aRevoir: string[];
  indexCourant: number;
  debut: number;
  finQcm: number | null;
}

export interface SessionCas {
  casIds: string[];
  reponses: Record<string, ReponsesCas>;
  validees: Record<string, string[]>;
  casCourant: number;
  debut: number;
  fin: number | null;
}

export interface ResultatEnregistre extends ResultatExamen {
  tentativeId: string;
  date: string;
  filiere: Filiere;
}

export interface EtatExamen {
  hydrate: boolean;
  candidat: Candidat | null;
  examen: SessionExamen | null;
  cas: SessionCas | null;
  resultat: ResultatEnregistre | null;
  historique: Tentative[];
}

type Action =
  | { type: 'HYDRATER'; etat: Omit<EtatExamen, 'hydrate'> }
  | { type: 'INSCRIRE'; candidat: Candidat }
  | { type: 'DEMARRER_EXAMEN'; graine: string; questionIds: string[]; maintenant: number }
  | { type: 'REPONDRE'; questionId: string; option: OptionId }
  | { type: 'BASCULER_REVOIR'; questionId: string }
  | { type: 'ALLER_A'; index: number }
  | { type: 'TERMINER_QCM'; maintenant: number }
  | { type: 'DEMARRER_CAS'; casIds: string[]; maintenant: number }
  | { type: 'REPONDRE_ETAPE'; casId: string; etapeId: string; reponse: ReponseEtape }
  | { type: 'VALIDER_ETAPE'; casId: string; etapeId: string }
  | { type: 'ALLER_CAS'; index: number }
  | { type: 'TERMINER_CAS'; maintenant: number; resultat: ResultatEnregistre; tentative: Tentative }
  | { type: 'NOUVELLE_TENTATIVE' }
  | { type: 'CHANGER_FILIERE'; filiere: Filiere }
  | { type: 'REINITIALISER' };

const etatInitial: EtatExamen = {
  hydrate: false,
  candidat: null,
  examen: null,
  cas: null,
  resultat: null,
  historique: [],
};

function reducer(etat: EtatExamen, action: Action): EtatExamen {
  switch (action.type) {
    case 'HYDRATER':
      return { ...action.etat, hydrate: true };
    case 'INSCRIRE':
      return { ...etat, candidat: action.candidat, examen: null, cas: null, resultat: null };
    case 'DEMARRER_EXAMEN':
      if (!etat.candidat) return etat;
      return {
        ...etat,
        examen: {
          graine: action.graine,
          filiere: etat.candidat.filiere,
          questionIds: action.questionIds,
          reponses: {},
          aRevoir: [],
          indexCourant: 0,
          debut: action.maintenant,
          finQcm: null,
        },
        cas: null,
        resultat: null,
      };
    case 'REPONDRE':
      if (!etat.examen || etat.examen.finQcm) return etat;
      return {
        ...etat,
        examen: { ...etat.examen, reponses: { ...etat.examen.reponses, [action.questionId]: action.option } },
      };
    case 'BASCULER_REVOIR': {
      if (!etat.examen || etat.examen.finQcm) return etat;
      const deja = etat.examen.aRevoir.includes(action.questionId);
      return {
        ...etat,
        examen: {
          ...etat.examen,
          aRevoir: deja
            ? etat.examen.aRevoir.filter((id) => id !== action.questionId)
            : [...etat.examen.aRevoir, action.questionId],
        },
      };
    }
    case 'ALLER_A': {
      if (!etat.examen) return etat;
      const max = etat.examen.questionIds.length - 1;
      return { ...etat, examen: { ...etat.examen, indexCourant: Math.min(max, Math.max(0, action.index)) } };
    }
    case 'TERMINER_QCM':
      if (!etat.examen || etat.examen.finQcm) return etat;
      return { ...etat, examen: { ...etat.examen, finQcm: action.maintenant } };
    case 'DEMARRER_CAS':
      return {
        ...etat,
        cas: { casIds: action.casIds, reponses: {}, validees: {}, casCourant: 0, debut: action.maintenant, fin: null },
      };
    case 'REPONDRE_ETAPE': {
      if (!etat.cas || etat.cas.fin) return etat;
      if (etat.cas.validees[action.casId]?.includes(action.etapeId)) return etat;
      const reponsesCas = { ...(etat.cas.reponses[action.casId] ?? {}), [action.etapeId]: action.reponse };
      return { ...etat, cas: { ...etat.cas, reponses: { ...etat.cas.reponses, [action.casId]: reponsesCas } } };
    }
    case 'VALIDER_ETAPE': {
      if (!etat.cas || etat.cas.fin) return etat;
      const deja = etat.cas.validees[action.casId] ?? [];
      if (deja.includes(action.etapeId)) return etat;
      return {
        ...etat,
        cas: { ...etat.cas, validees: { ...etat.cas.validees, [action.casId]: [...deja, action.etapeId] } },
      };
    }
    case 'ALLER_CAS':
      if (!etat.cas) return etat;
      return {
        ...etat,
        cas: { ...etat.cas, casCourant: Math.min(etat.cas.casIds.length - 1, Math.max(0, action.index)) },
      };
    case 'TERMINER_CAS':
      if (!etat.cas) return etat;
      return {
        ...etat,
        cas: { ...etat.cas, fin: action.maintenant },
        resultat: action.resultat,
        historique: [...etat.historique, action.tentative].slice(-50),
      };
    case 'NOUVELLE_TENTATIVE':
      return { ...etat, examen: null, cas: null, resultat: null };
    case 'CHANGER_FILIERE':
      if (!etat.candidat) return etat;
      return { ...etat, candidat: { ...etat.candidat, filiere: action.filiere }, examen: null, cas: null, resultat: null };
    case 'REINITIALISER':
      return { ...etatInitial, hydrate: true };
    default:
      return etat;
  }
}

interface EtatPersiste {
  examen: SessionExamen | null;
  cas: SessionCas | null;
  resultat: ResultatEnregistre | null;
}

function estObjet(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function estCandidat(v: unknown): v is Candidat {
  return (
    estObjet(v) &&
    typeof v.nom === 'string' &&
    typeof v.email === 'string' &&
    estFiliere(v.filiere)
  );
}

function estEtatPersiste(v: unknown): v is EtatPersiste {
  return estObjet(v) && 'examen' in v && 'cas' in v && 'resultat' in v;
}

function estHistorique(v: unknown): v is Tentative[] {
  return Array.isArray(v) && v.every((t) => estObjet(t) && typeof t.noteSur20 === 'number');
}

function estListeIds(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

/** Mémorise des ids « déjà vus » pour prioriser les contenus nouveaux au tirage suivant. */
function memoriserVus(cle: typeof CLES.questionsVues | typeof CLES.casVus, ids: string[]): void {
  const actuels = lire<string[]>(cle, [], estListeIds);
  ecrire(cle, Array.from(new Set([...actuels, ...ids])));
}

export function lireVus(cle: typeof CLES.questionsVues | typeof CLES.casVus): Set<string> {
  return new Set(lire<string[]>(cle, [], estListeIds));
}

interface ValeurContexte {
  etat: EtatExamen;
  inscrire: (candidat: Candidat) => void;
  demarrerExamen: (graine: string, questionIds: string[]) => void;
  repondre: (questionId: string, option: OptionId) => void;
  basculerRevoir: (questionId: string) => void;
  allerA: (index: number) => void;
  terminerQcm: () => void;
  demarrerCas: (casIds: string[]) => void;
  repondreEtape: (casId: string, etapeId: string, reponse: ReponseEtape) => void;
  validerEtape: (casId: string, etapeId: string) => void;
  allerCas: (index: number) => void;
  terminerCas: (resultat: ResultatExamen) => void;
  nouvelleTentative: () => void;
  changerFiliere: (filiere: Filiere) => void;
  reinitialiser: () => void;
}

const ExamContext = createContext<ValeurContexte | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const [etat, dispatch] = useReducer(reducer, etatInitial);

  // Hydratation depuis localStorage (après montage : rendu statique identique côté serveur).
  useEffect(() => {
    const persiste = lire<EtatPersiste>(CLES.etat, { examen: null, cas: null, resultat: null }, estEtatPersiste);
    const stocke = lire<Candidat | null>(CLES.candidat, null, (v): v is Candidat | null => v === null || estCandidat(v));
    // Les profils créés avant la v1.1 n'ont pas d'identifiant : on en attribue un.
    const candidat = stocke && !stocke.id ? { ...stocke, id: nouvelId() } : stocke;
    dispatch({
      type: 'HYDRATER',
      etat: {
        candidat,
        historique: lire<Tentative[]>(CLES.historique, [], estHistorique),
        ...persiste,
      },
    });
    // Renvoie les données restées en attente (réseau coupé lors d'une visite précédente).
    void viderFile();
  }, []);

  // Persistance à chaque changement.
  useEffect(() => {
    if (!etat.hydrate) return;
    if (etat.candidat) ecrire(CLES.candidat, etat.candidat);
    else supprimer(CLES.candidat);
    ecrire<EtatPersiste>(CLES.etat, { examen: etat.examen, cas: etat.cas, resultat: etat.resultat });
    ecrire(CLES.historique, etat.historique);
  }, [etat]);

  const inscrire = useCallback((candidat: Candidat) => {
    const ref = lire<{ ref?: string } | null>(CLES.ref, null);
    synchroniserCandidat(candidat, typeof ref?.ref === 'string' ? ref.ref : null);
    dispatch({ type: 'INSCRIRE', candidat });
  }, []);
  const demarrerExamen = useCallback((graine: string, questionIds: string[]) => {
    memoriserVus(CLES.questionsVues, questionIds);
    dispatch({ type: 'DEMARRER_EXAMEN', graine, questionIds, maintenant: Date.now() });
  }, []);
  const repondre = useCallback(
    (questionId: string, option: OptionId) => dispatch({ type: 'REPONDRE', questionId, option }),
    [],
  );
  const basculerRevoir = useCallback((questionId: string) => dispatch({ type: 'BASCULER_REVOIR', questionId }), []);
  const allerA = useCallback((index: number) => dispatch({ type: 'ALLER_A', index }), []);
  const terminerQcm = useCallback(() => dispatch({ type: 'TERMINER_QCM', maintenant: Date.now() }), []);
  const demarrerCas = useCallback((casIds: string[]) => {
    memoriserVus(CLES.casVus, casIds);
    dispatch({ type: 'DEMARRER_CAS', casIds, maintenant: Date.now() });
  }, []);
  const repondreEtape = useCallback(
    (casId: string, etapeId: string, reponse: ReponseEtape) =>
      dispatch({ type: 'REPONDRE_ETAPE', casId, etapeId, reponse }),
    [],
  );
  const validerEtape = useCallback(
    (casId: string, etapeId: string) => dispatch({ type: 'VALIDER_ETAPE', casId, etapeId }),
    [],
  );
  const allerCas = useCallback((index: number) => dispatch({ type: 'ALLER_CAS', index }), []);
  const terminerCas = useCallback(
    (resultat: ResultatExamen) => {
      const filiere = etat.examen?.filiere ?? etat.candidat?.filiere ?? 'data';
      const date = new Date().toISOString();
      const tentativeId = nouvelId();
      if (etat.candidat) synchroniserTentative(tentativeId, etat.candidat.id, filiere, resultat);
      dispatch({
        type: 'TERMINER_CAS',
        maintenant: Date.now(),
        resultat: { ...resultat, tentativeId, date, filiere },
        tentative: {
          id: tentativeId,
          filiere,
          date,
          noteSur20: resultat.noteSur20,
          scoreQcm: resultat.scoreQcm,
          scoreCas: resultat.scoreCas,
          scoreCasMax: resultat.scoreCasMax,
          dureeSecondes: resultat.dureeSecondes,
          parSection: resultat.parSection,
          parCompetence: resultat.parCompetence,
        },
      });
    },
    [etat.examen?.filiere, etat.candidat],
  );
  const nouvelleTentative = useCallback(() => dispatch({ type: 'NOUVELLE_TENTATIVE' }), []);
  const changerFiliere = useCallback(
    (filiere: Filiere) => {
      if (etat.candidat) synchroniserCandidat({ ...etat.candidat, filiere }, null);
      dispatch({ type: 'CHANGER_FILIERE', filiere });
    },
    [etat.candidat],
  );
  const reinitialiser = useCallback(() => {
    toutEffacer();
    dispatch({ type: 'REINITIALISER' });
  }, []);

  const valeur = useMemo<ValeurContexte>(
    () => ({
      etat,
      inscrire,
      demarrerExamen,
      repondre,
      basculerRevoir,
      allerA,
      terminerQcm,
      demarrerCas,
      repondreEtape,
      validerEtape,
      allerCas,
      terminerCas,
      nouvelleTentative,
      changerFiliere,
      reinitialiser,
    }),
    [
      etat,
      inscrire,
      demarrerExamen,
      repondre,
      basculerRevoir,
      allerA,
      terminerQcm,
      demarrerCas,
      repondreEtape,
      validerEtape,
      allerCas,
      terminerCas,
      nouvelleTentative,
      changerFiliere,
      reinitialiser,
    ],
  );

  return <ExamContext.Provider value={valeur}>{children}</ExamContext.Provider>;
}

export function useExam(): ValeurContexte {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error('useExam doit être utilisé dans <ExamProvider>.');
  return ctx;
}

/** Étape atteinte dans le parcours (1 à 4) — sert au Stepper et aux gardes de navigation. */
export function etapeAtteinte(etat: EtatExamen): 1 | 2 | 3 | 4 {
  if (etat.resultat) return 4;
  if (etat.examen?.finQcm) return 3;
  if (etat.candidat) return 2;
  return 1;
}
