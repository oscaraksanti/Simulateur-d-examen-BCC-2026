// Wrappers localStorage sûrs : chaque lecture/écriture est protégée par try/catch
// (navigation privée, stockage plein ou bloqué, rendu serveur…).

const PREFIXE = 'simbcc:';

export const CLES = {
  candidat: 'candidat',
  etat: 'etat-v1',
  historique: 'historique-v1',
  questionsVues: 'questions-vues',
  casVus: 'cas-vus',
  ref: 'ref',
  theme: 'theme',
  fileAttente: 'file-attente-v1',
  avisEnvoye: 'avis-envoye',
} as const;

export type CleStockage = (typeof CLES)[keyof typeof CLES];

function stockageDisponible(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Lit une valeur JSON ; renvoie `secours` si absente, illisible ou invalide. */
export function lire<T>(cle: CleStockage, secours: T, valider?: (v: unknown) => v is T): T {
  const stockage = stockageDisponible();
  if (!stockage) return secours;
  try {
    const brut = stockage.getItem(PREFIXE + cle);
    if (brut === null) return secours;
    const valeur: unknown = JSON.parse(brut);
    if (valider && !valider(valeur)) return secours;
    return valeur as T;
  } catch {
    return secours;
  }
}

/** Écrit une valeur JSON ; renvoie false si l'écriture a échoué. */
export function ecrire<T>(cle: CleStockage, valeur: T): boolean {
  const stockage = stockageDisponible();
  if (!stockage) return false;
  try {
    stockage.setItem(PREFIXE + cle, JSON.stringify(valeur));
    return true;
  } catch {
    return false;
  }
}

export function supprimer(cle: CleStockage): void {
  const stockage = stockageDisponible();
  if (!stockage) return;
  try {
    stockage.removeItem(PREFIXE + cle);
  } catch {
    // stockage indisponible : rien à faire
  }
}

/** Efface toutes les données du simulateur sur cet appareil. */
export function toutEffacer(): void {
  for (const cle of Object.values(CLES)) supprimer(cle);
}
