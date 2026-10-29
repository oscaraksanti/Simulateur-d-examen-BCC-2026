// Moteur de score — fonctions pures, testées dans src/__tests__/scoring.test.ts.
// Note /20 = (scoreQcm / scoreQcmMax) × 12 + (scoreCas / scoreCasMax) × 8, arrondie au 0,5.

import type {
  CasPratique,
  Etape,
  Mention,
  OptionId,
  QcmQuestion,
  ReponseEtape,
  ReponsesCas,
  ResultatExamen,
  ScoreDetail,
  Section,
} from './types';

export const POIDS_QCM = 12;
export const POIDS_CAS = 8;
export const COMPETENCE_CAS = 'Cas pratiques';

/** Arrondi au 0,5 le plus proche (14,25 → 14,5 ; 14,2 → 14). */
export function arrondiDemi(valeur: number): number {
  return Math.round(valeur * 2) / 2;
}

/** Points maximum d'une étape. */
export function maxEtape(etape: Etape): number {
  if (etape.type === 'ordre') return etape.pointsMax;
  return etape.options.reduce((m, o) => Math.max(m, o.points), 0);
}

/** Points maximum d'un cas (somme des maxima d'étapes). */
export function maxCas(cas: CasPratique): number {
  return cas.etapes.reduce((s, e) => s + maxEtape(e), 0);
}

/** Nombre d'éléments placés à la bonne position. */
export function elementsBienPlaces(ordreDonne: readonly string[], ordreCorrect: readonly string[]): number {
  return ordreCorrect.reduce((n, id, i) => (ordreDonne[i] === id ? n + 1 : n), 0);
}

/** Score d'une étape : points de l'option choisie, ou pointsMax × proportion bien placée. */
export function scoreEtape(etape: Etape, reponse: ReponseEtape | undefined): number {
  if (!reponse) return 0;
  if (etape.type === 'choix') {
    if (reponse.type !== 'choix') return 0;
    return etape.options.find((o) => o.id === reponse.optionId)?.points ?? 0;
  }
  if (reponse.type !== 'ordre' || etape.ordreCorrect.length === 0) return 0;
  const bien = elementsBienPlaces(reponse.ordre, etape.ordreCorrect);
  return (etape.pointsMax * bien) / etape.ordreCorrect.length;
}

/** Score d'un cas complet. */
export function scoreCas(cas: CasPratique, reponses: ReponsesCas | undefined): number {
  if (!reponses) return 0;
  return cas.etapes.reduce((s, e) => s + scoreEtape(e, reponses[e.id]), 0);
}

/** Nombre de bonnes réponses au QCM. */
export function scoreQcm(questions: readonly QcmQuestion[], reponses: Readonly<Record<string, OptionId>>): number {
  return questions.reduce((s, q) => (reponses[q.id] === q.bonneReponse ? s + 1 : s), 0);
}

/** Note sur 20 arrondie au 0,5. */
export function calculerNote(qcm: number, qcmMax: number, cas: number, casMax: number): number {
  const partQcm = qcmMax > 0 ? (qcm / qcmMax) * POIDS_QCM : 0;
  const partCas = casMax > 0 ? (cas / casMax) * POIDS_CAS : 0;
  return Math.min(20, Math.max(0, arrondiDemi(partQcm + partCas)));
}

export function mention(note: number): Mention {
  if (note >= 17) return 'Excellent';
  if (note >= 14) return 'Bon niveau';
  if (note >= 10) return 'Correct';
  return 'À renforcer';
}

function ajouter(cible: Record<string, ScoreDetail>, cle: string, obtenu: number, max: number): void {
  const actuel = cible[cle] ?? { obtenu: 0, max: 0 };
  cible[cle] = { obtenu: actuel.obtenu + obtenu, max: actuel.max + max };
}

export interface EntreeResultat {
  questions: readonly QcmQuestion[];
  reponses: Readonly<Record<string, OptionId>>;
  cas: readonly CasPratique[];
  reponsesCas: Readonly<Record<string, ReponsesCas>>;
  dureeSecondes: number;
}

/** Calcule le résultat complet d'un examen blanc. */
export function calculerResultat(entree: EntreeResultat): ResultatExamen {
  const { questions, reponses, cas, reponsesCas, dureeSecondes } = entree;

  const parSection: Record<Section, ScoreDetail> = {
    technique: { obtenu: 0, max: 0 },
    culture_bcc: { obtenu: 0, max: 0 },
    logique: { obtenu: 0, max: 0 },
  };
  const parCompetence: Record<string, ScoreDetail> = {};

  for (const q of questions) {
    const juste = reponses[q.id] === q.bonneReponse ? 1 : 0;
    parSection[q.section] = {
      obtenu: parSection[q.section].obtenu + juste,
      max: parSection[q.section].max + 1,
    };
    ajouter(parCompetence, q.competence, juste, 1);
  }

  const qcm = scoreQcm(questions, reponses);
  const qcmMax = questions.length;
  const casObtenu = cas.reduce((s, c) => s + scoreCas(c, reponsesCas[c.id]), 0);
  const casMax = cas.reduce((s, c) => s + maxCas(c), 0);
  if (casMax > 0) ajouter(parCompetence, COMPETENCE_CAS, casObtenu, casMax);

  return {
    scoreQcm: qcm,
    scoreQcmMax: qcmMax,
    scoreCas: Math.round(casObtenu * 100) / 100,
    scoreCasMax: casMax,
    noteSur20: calculerNote(qcm, qcmMax, casObtenu, casMax),
    parSection,
    parCompetence,
    dureeSecondes,
  };
}

/** Taux de réussite (0 à 1) d'un détail de score. */
export function taux(detail: ScoreDetail): number {
  return detail.max > 0 ? detail.obtenu / detail.max : 0;
}

/** Les `n` compétences les plus faibles (taux croissant, puis plus de questions en premier). */
export function competencesFaibles(parCompetence: Readonly<Record<string, ScoreDetail>>, n = 2): string[] {
  return Object.entries(parCompetence)
    .filter(([, d]) => d.max > 0)
    .sort(([, a], [, b]) => taux(a) - taux(b) || b.max - a.max)
    .slice(0, n)
    .map(([c]) => c);
}
