import { describe, expect, it } from 'vitest';
import {
  banqueAptitudesLogiques,
  banqueCultureBcc,
  banqueTechniqueCyber,
  banqueTechniqueData,
  quizData,
} from '@/data/quizData';
import { casPratiques } from '@/data/casesData';
import { bccFacts, VERIFIE_LE } from '@/data/bccFacts';
import { maxCas, maxEtape } from '@/lib/scoring';
import { COMPOSITION, NB_CAS } from '@/lib/sampling';

const LETTRES = ['A', 'B', 'C', 'D'] as const;

describe('banque de questions', () => {
  it('atteint les volumes minimum', () => {
    expect(banqueTechniqueData.length).toBeGreaterThanOrEqual(40);
    expect(banqueTechniqueCyber.length).toBeGreaterThanOrEqual(40);
    expect(banqueCultureBcc.length).toBeGreaterThanOrEqual(20);
    expect(banqueAptitudesLogiques.length).toBeGreaterThanOrEqual(30);
  });

  it('a des ids uniques', () => {
    const ids = quizData.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(quizData.map((q) => [q.id, q] as const))('%s est bien formée', (_id, q) => {
    expect(q.options.map((o) => o.id)).toEqual([...LETTRES]);
    expect(q.options.every((o) => o.texte.trim().length > 0)).toBe(true);
    expect(LETTRES).toContain(q.bonneReponse);
    expect(q.enonce.trim().length).toBeGreaterThan(10);
    expect(q.explication.trim().length).toBeGreaterThan(20);
    expect(q.aRetenir?.trim().length ?? 0).toBeGreaterThan(5);
    // Chaque mauvaise option est réfutée.
    const mauvaises = LETTRES.filter((l) => l !== q.bonneReponse);
    expect(Object.keys(q.pourquoiPas ?? {}).sort()).toEqual([...mauvaises]);
    if (q.section === 'culture_bcc') {
      expect(q.source?.trim().length ?? 0).toBeGreaterThan(3);
      expect(q.verifieLe).toBe(VERIFIE_LE);
      expect(q.filiere).toBe('commune');
    }
    if (q.section === 'technique') expect(['data', 'cyber']).toContain(q.filiere);
    else expect(q.filiere).toBe('commune');
  });

  it('a assez de questions par section pour un examen complet', () => {
    expect(banqueTechniqueData.length).toBeGreaterThanOrEqual(COMPOSITION.technique);
    expect(banqueCultureBcc.length).toBeGreaterThanOrEqual(COMPOSITION.culture_bcc);
    expect(banqueAptitudesLogiques.length).toBeGreaterThanOrEqual(COMPOSITION.logique);
  });

  it('répartit les bonnes réponses sur les 4 lettres', () => {
    for (const l of LETTRES) {
      const part = quizData.filter((q) => q.bonneReponse === l).length / quizData.length;
      expect(part).toBeGreaterThan(0.18);
      expect(part).toBeLessThan(0.32);
    }
  });
});

describe('cas pratiques', () => {
  it('au moins 4 cas par filière', () => {
    expect(casPratiques.filter((c) => c.filiere === 'data').length).toBeGreaterThanOrEqual(Math.max(4, NB_CAS));
    expect(casPratiques.filter((c) => c.filiere === 'cyber').length).toBeGreaterThanOrEqual(Math.max(4, NB_CAS));
  });

  it('ids uniques', () => {
    const ids = casPratiques.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(casPratiques.map((c) => [c.id, c] as const))('%s est cohérent', (_id, c) => {
    expect(c.pointsMax).toBe(maxCas(c));
    expect(c.pointsMax).toBeGreaterThanOrEqual(10);
    expect(c.pointsMax).toBeLessThanOrEqual(20);
    expect(c.etapes.some((e) => e.type === 'ordre')).toBe(true);
    expect(new Set(c.etapes.map((e) => e.id)).size).toBe(c.etapes.length);
    for (const e of c.etapes) {
      expect(maxEtape(e)).toBeGreaterThan(0);
      if (e.type === 'ordre') {
        expect([...e.ordreCorrect].sort()).toEqual(e.elements.map((x) => x.id).sort());
        expect(e.feedback.length).toBeGreaterThan(10);
      } else {
        expect(e.options.every((o) => o.feedback.trim().length > 0)).toBe(true);
        expect(new Set(e.options.map((o) => o.id)).size).toBe(e.options.length);
      }
    }
  });
});

describe('faits BCC', () => {
  it('chaque fait est sourcé et daté', () => {
    for (const f of bccFacts.faits) {
      expect(f.source.length).toBeGreaterThan(3);
      expect(f.verifieLe).toBe(VERIFIE_LE);
    }
  });
});
