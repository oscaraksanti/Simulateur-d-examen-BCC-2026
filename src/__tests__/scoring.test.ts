import { describe, expect, it } from 'vitest';
import {
  arrondiDemi,
  calculerNote,
  calculerResultat,
  competencesFaibles,
  maxCas,
  mention,
  scoreEtape,
} from '@/lib/scoring';
import type { CasPratique, EtapeOrdre, OptionId, QcmQuestion } from '@/lib/types';

function question(id: string, section: QcmQuestion['section'], competence: string, bonne: OptionId = 'A'): QcmQuestion {
  return {
    id,
    section,
    filiere: section === 'technique' ? 'data' : 'commune',
    competence,
    difficulte: 'moyen',
    enonce: 'Question test',
    options: (['A', 'B', 'C', 'D'] as const).map((o) => ({ id: o, texte: o })),
    bonneReponse: bonne,
    explication: 'Explication',
  };
}

const questions: QcmQuestion[] = [
  ...Array.from({ length: 12 }, (_, i) => question(`T-${i}`, 'technique', i < 6 ? 'SQL' : 'Statistiques')),
  ...Array.from({ length: 6 }, (_, i) => question(`B-${i}`, 'culture_bcc', 'Politique monétaire')),
  ...Array.from({ length: 6 }, (_, i) => question(`L-${i}`, 'logique', 'Suites numériques')),
];

const etapeOrdre: EtapeOrdre = {
  type: 'ordre',
  id: 'e2',
  question: 'Ordonner',
  elements: ['a', 'b', 'c', 'd'].map((id) => ({ id, texte: id })),
  ordreCorrect: ['a', 'b', 'c', 'd'],
  pointsMax: 8,
  feedback: 'ok',
};

const cas: CasPratique = {
  id: 'CAS-T',
  filiere: 'data',
  titre: 'Cas test',
  role: 'Analyste',
  heure: '09h00',
  enjeu: 'Test',
  contexte: 'Contexte',
  piecesJointes: [],
  etapes: [
    {
      type: 'choix',
      id: 'e1',
      question: 'Choisir',
      options: [
        { id: 'a', texte: 'Bonne', points: 8, feedback: 'ok' },
        { id: 'b', texte: 'Partielle', points: 4, feedback: 'bof' },
        { id: 'c', texte: 'Mauvaise', points: 0, feedback: 'non' },
      ],
    },
    etapeOrdre,
  ],
  pointsMax: 16,
  debrief: 'Debrief',
};

const toutesJustes = Object.fromEntries(questions.map((q) => [q.id, q.bonneReponse])) as Record<string, OptionId>;

describe('arrondiDemi', () => {
  it('arrondit au 0,5 le plus proche', () => {
    expect(arrondiDemi(14.2)).toBe(14);
    expect(arrondiDemi(14.25)).toBe(14.5);
    expect(arrondiDemi(14.74)).toBe(14.5);
    expect(arrondiDemi(14.75)).toBe(15);
  });
});

describe('calculerNote', () => {
  it('score parfait = 20', () => {
    expect(calculerNote(24, 24, 32, 32)).toBe(20);
  });
  it('score nul = 0', () => {
    expect(calculerNote(0, 24, 0, 32)).toBe(0);
  });
  it('applique la pondération 12 + 8 avec arrondi', () => {
    // 18/24 × 12 = 9 ; 20/32 × 8 = 5 → 14
    expect(calculerNote(18, 24, 20, 32)).toBe(14);
    // 17/24 × 12 = 8,5 ; 13/32 × 8 = 3,25 → 11,75 → 12
    expect(calculerNote(17, 24, 13, 32)).toBe(12);
    // 13/24 × 12 = 6,5 ; 15/32 × 8 = 3,75 → 10,25 → 10,5
    expect(calculerNote(13, 24, 15, 32)).toBe(10.5);
  });
});

describe('scoreEtape', () => {
  it('donne les points de l’option choisie', () => {
    expect(scoreEtape(cas.etapes[0], { type: 'choix', optionId: 'b' })).toBe(4);
    expect(scoreEtape(cas.etapes[0], undefined)).toBe(0);
  });
  it('score partiel pour une étape ordre', () => {
    expect(scoreEtape(etapeOrdre, { type: 'ordre', ordre: ['a', 'b', 'c', 'd'] })).toBe(8);
    // 2 éléments sur 4 bien placés → 8 × 2/4 = 4
    expect(scoreEtape(etapeOrdre, { type: 'ordre', ordre: ['a', 'b', 'd', 'c'] })).toBe(4);
    expect(scoreEtape(etapeOrdre, { type: 'ordre', ordre: ['d', 'c', 'b', 'a'] })).toBe(0);
  });
  it('maxCas additionne les maxima', () => {
    expect(maxCas(cas)).toBe(16);
  });
});

describe('calculerResultat', () => {
  it('résultat parfait', () => {
    const r = calculerResultat({
      questions,
      reponses: toutesJustes,
      cas: [cas],
      reponsesCas: { 'CAS-T': { e1: { type: 'choix', optionId: 'a' }, e2: { type: 'ordre', ordre: ['a', 'b', 'c', 'd'] } } },
      dureeSecondes: 1200,
    });
    expect(r.noteSur20).toBe(20);
    expect(r.scoreQcm).toBe(24);
    expect(r.parSection.technique).toEqual({ obtenu: 12, max: 12 });
    expect(r.parCompetence.SQL).toEqual({ obtenu: 6, max: 6 });
  });
  it('résultat nul sans réponse', () => {
    const r = calculerResultat({ questions, reponses: {}, cas: [cas], reponsesCas: {}, dureeSecondes: 0 });
    expect(r.noteSur20).toBe(0);
    expect(r.parSection.logique).toEqual({ obtenu: 0, max: 6 });
  });
});

describe('mention et compétences faibles', () => {
  it('attribue la bonne mention', () => {
    expect(mention(9.5)).toBe('À renforcer');
    expect(mention(10)).toBe('Correct');
    expect(mention(13.5)).toBe('Correct');
    expect(mention(14)).toBe('Bon niveau');
    expect(mention(16.5)).toBe('Bon niveau');
    expect(mention(17)).toBe('Excellent');
  });
  it('identifie les deux compétences les plus faibles', () => {
    const faibles = competencesFaibles({
      SQL: { obtenu: 5, max: 6 },
      Statistiques: { obtenu: 1, max: 6 },
      Logique: { obtenu: 0, max: 2 },
      Réseaux: { obtenu: 3, max: 3 },
    });
    expect(faibles).toEqual(['Logique', 'Statistiques']);
  });
});
