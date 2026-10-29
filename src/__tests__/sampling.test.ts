import { describe, expect, it } from 'vitest';
import { COMPOSITION, creerAleatoire, melanger, tirerCas, tirerQuestions } from '@/lib/sampling';
import type { CasPratique, QcmQuestion, Section } from '@/lib/types';

function banqueFactice(): QcmQuestion[] {
  const qs: QcmQuestion[] = [];
  const ajout = (prefixe: string, section: Section, filiere: QcmQuestion['filiere'], n: number, comps: string[]) => {
    for (let i = 0; i < n; i++) {
      qs.push({
        id: `${prefixe}-${i}`,
        section,
        filiere,
        competence: comps[i % comps.length],
        difficulte: 'moyen',
        enonce: 'x',
        options: (['A', 'B', 'C', 'D'] as const).map((o) => ({ id: o, texte: o })),
        bonneReponse: 'A',
        explication: 'x',
      });
    }
  };
  ajout('D', 'technique', 'data', 40, ['SQL', 'Python', 'Stats', 'BI']);
  ajout('C', 'technique', 'cyber', 40, ['Réseaux', 'Crypto']);
  ajout('B', 'culture_bcc', 'commune', 20, ['Cadre', 'Paiements']);
  ajout('L', 'logique', 'commune', 30, ['Suites', 'Logique', 'Pourcentages']);
  return qs;
}

const banque = banqueFactice();

describe('générateur seedé', () => {
  it('est reproductible', () => {
    const a = creerAleatoire('graine');
    const b = creerAleatoire('graine');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('mélange sans perdre d’élément', () => {
    const m = melanger([1, 2, 3, 4, 5], creerAleatoire('x'));
    expect([...m].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('tirerQuestions', () => {
  it('tire 24 questions sans doublon avec la bonne composition', () => {
    const tirage = tirerQuestions(banque, { filiere: 'data', graine: 'abc' });
    expect(tirage).toHaveLength(24);
    expect(new Set(tirage.map((q) => q.id)).size).toBe(24);
    expect(tirage.filter((q) => q.section === 'technique')).toHaveLength(COMPOSITION.technique);
    expect(tirage.filter((q) => q.section === 'culture_bcc')).toHaveLength(COMPOSITION.culture_bcc);
    expect(tirage.filter((q) => q.section === 'logique')).toHaveLength(COMPOSITION.logique);
    expect(tirage.filter((q) => q.section === 'technique').every((q) => q.filiere === 'data')).toBe(true);
  });
  it('est reproductible pour une même graine', () => {
    const a = tirerQuestions(banque, { filiere: 'cyber', graine: 'seed-1' }).map((q) => q.id);
    const b = tirerQuestions(banque, { filiere: 'cyber', graine: 'seed-1' }).map((q) => q.id);
    expect(a).toEqual(b);
  });
  it('varie selon la graine', () => {
    const a = tirerQuestions(banque, { filiere: 'data', graine: 'g1' }).map((q) => q.id);
    const b = tirerQuestions(banque, { filiere: 'data', graine: 'g2' }).map((q) => q.id);
    expect(a).not.toEqual(b);
  });
  it('privilégie les questions jamais vues', () => {
    const premier = tirerQuestions(banque, { filiere: 'data', graine: 'p' });
    const vues = new Set(premier.map((q) => q.id));
    const second = tirerQuestions(banque, { filiere: 'data', graine: 'q', dejaVues: vues });
    const techniqueRevue = second.filter((q) => q.section === 'technique' && vues.has(q.id));
    expect(techniqueRevue).toHaveLength(0);
  });
  it('alterne les compétences', () => {
    const tirage = tirerQuestions(banque, { filiere: 'data', graine: 'z' }).filter((q) => q.section === 'technique');
    const comps = new Set(tirage.map((q) => q.competence));
    expect(comps.size).toBe(4);
  });
});

describe('tirerCas', () => {
  const cas = ['1', '2', '3', '4'].map(
    (n): CasPratique => ({
      id: `CAS-${n}`,
      filiere: 'cyber',
      titre: n,
      role: 'r',
      heure: 'h',
      enjeu: 'e',
      contexte: 'c',
      piecesJointes: [],
      etapes: [],
      pointsMax: 0,
      debrief: 'd',
    }),
  );
  it('tire 2 cas distincts, non vus en priorité', () => {
    const t = tirerCas(cas, 'cyber', 'x', new Set(['CAS-1', 'CAS-2']));
    expect(t.map((c) => c.id).sort()).toEqual(['CAS-3', 'CAS-4']);
  });
  it('ignore les cas des autres filières', () => {
    expect(tirerCas(cas, 'data', 'x')).toHaveLength(0);
  });
});
