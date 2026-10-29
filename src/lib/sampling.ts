// Tirage aléatoire seedé (reproductible) des questions et des cas.
// Priorité aux questions jamais vues pour que chaque simulation soit différente,
// et répartition équilibrée entre compétences.

import type { CasPratique, Filiere, QcmQuestion, Section } from './types';

/** Composition d'un examen blanc : nombre de questions par section. */
export const COMPOSITION: Record<Section, number> = {
  technique: 12,
  culture_bcc: 6,
  logique: 6,
};

export const ORDRE_SECTIONS: Section[] = ['technique', 'culture_bcc', 'logique'];

export const NB_CAS = 2;

/** Hash FNV-1a 32 bits d'une chaîne → graine numérique. */
export function hashGraine(graine: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < graine.length; i++) {
    h ^= graine.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Générateur pseudo-aléatoire mulberry32 : renvoie une fonction → [0, 1). */
export function creerAleatoire(graine: string): () => number {
  let a = hashGraine(graine);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mélange de Fisher-Yates non destructif. */
export function melanger<T>(elements: readonly T[], aleatoire: () => number): T[] {
  const copie = [...elements];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(aleatoire() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/** Choisit `n` éléments en alternant les compétences (round-robin) pour couvrir le programme. */
function tirerEquilibre<T extends { competence: string }>(
  pool: T[],
  n: number,
  aleatoire: () => number,
): T[] {
  const groupes = new Map<string, T[]>();
  for (const el of melanger(pool, aleatoire)) {
    const g = groupes.get(el.competence) ?? [];
    g.push(el);
    groupes.set(el.competence, g);
  }
  const files = melanger([...groupes.values()], aleatoire);
  const choisis: T[] = [];
  while (choisis.length < n && files.some((f) => f.length > 0)) {
    for (const file of files) {
      const el = file.shift();
      if (el) choisis.push(el);
      if (choisis.length >= n) break;
    }
  }
  return choisis;
}

/** Pool de questions éligibles pour une section et une filière. */
export function poolSection(banque: readonly QcmQuestion[], section: Section, filiere: Filiere): QcmQuestion[] {
  return banque.filter(
    (q) => q.section === section && (section === 'technique' ? q.filiere === filiere : true),
  );
}

export interface OptionsTirage {
  filiere: Filiere;
  graine: string;
  /** Ids déjà rencontrés lors des simulations précédentes (tirés en dernier recours). */
  dejaVues?: ReadonlySet<string>;
  composition?: Record<Section, number>;
}

/**
 * Tire les questions d'un examen : sans doublon, priorité aux questions non vues,
 * compétences alternées, sections dans l'ordre Technique → Culture BCC → Logique.
 */
export function tirerQuestions(banque: readonly QcmQuestion[], options: OptionsTirage): QcmQuestion[] {
  const { filiere, graine, dejaVues = new Set<string>(), composition = COMPOSITION } = options;
  const aleatoire = creerAleatoire(`${graine}|${filiere}`);
  const resultat: QcmQuestion[] = [];

  for (const section of ORDRE_SECTIONS) {
    const n = composition[section];
    const pool = poolSection(banque, section, filiere);
    const nonVues = pool.filter((q) => !dejaVues.has(q.id));
    const vues = pool.filter((q) => dejaVues.has(q.id));
    const choisies = tirerEquilibre(nonVues, n, aleatoire);
    if (choisies.length < n) {
      choisies.push(...tirerEquilibre(vues, n - choisies.length, aleatoire));
    }
    resultat.push(...choisies);
  }
  return resultat;
}

/** Tire `NB_CAS` cas pratiques de la filière, en privilégiant ceux pas encore traités. */
export function tirerCas(
  cas: readonly CasPratique[],
  filiere: Filiere,
  graine: string,
  dejaVus: ReadonlySet<string> = new Set<string>(),
  nombre: number = NB_CAS,
): CasPratique[] {
  const aleatoire = creerAleatoire(`${graine}|cas|${filiere}`);
  const pool = cas.filter((c) => c.filiere === filiere);
  const nonVus = melanger(pool.filter((c) => !dejaVus.has(c.id)), aleatoire);
  const vus = melanger(pool.filter((c) => dejaVus.has(c.id)), aleatoire);
  return [...nonVus, ...vus].slice(0, nombre);
}

/** Génère une graine aléatoire (non reproductible) pour une nouvelle tentative. */
export function nouvelleGraine(): string {
  const alea = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${alea}`;
}
