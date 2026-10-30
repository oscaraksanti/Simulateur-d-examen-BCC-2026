// Types partagés de l'application « Simulateur BCC — Prépa informatique ».
// Toute la donnée (questions, cas, faits) est typée ici : aucun `any`.

/** Les 8 catégories du recrutement informatique 2026 (voir src/lib/filieres.ts). */
export type Filiere = 'data' | 'cyber' | 'bdd' | 'systemes' | 'reseaux' | 'dev' | 'support' | 'numerique';
export type Section = 'technique' | 'culture_bcc' | 'logique';
export type Difficulte = 'facile' | 'moyen' | 'difficile';
export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface QcmQuestion {
  id: string; // ex. "DATA-SQL-007"
  section: Section;
  filiere: Filiere | 'commune';
  competence: string; // ex. "SQL", "Statistiques", "Réseaux", "Gestion d'incident"
  difficulte: Difficulte;
  enonce: string;
  extrait?: { langage: 'sql' | 'python' | 'log' | 'shell' | 'texte'; contenu: string }; // code/log affiché en mono
  options: { id: OptionId; texte: string }[];
  bonneReponse: OptionId;
  explication: string; // 2-4 phrases pédagogiques
  /** Réfutation option par option : pourquoi chaque mauvaise réponse est fausse. */
  pourquoiPas?: Partial<Record<OptionId, string>>;
  /** Idée-clé à mémoriser (une phrase). */
  aRetenir?: string;
  source?: string; // obligatoire pour la section 'culture_bcc'
  verifieLe?: string; // obligatoire pour la section 'culture_bcc'
}

export type PieceJointe =
  | { type: 'table'; titre: string; colonnes: string[]; lignes: (string | number)[][] }
  | { type: 'logs'; titre: string; lignes: string[] }
  | { type: 'texte'; titre: string; contenu: string };

export interface EtapeChoix {
  type: 'choix';
  id: string;
  question: string;
  options: { id: string; texte: string; points: number; feedback: string }[];
}

export interface EtapeOrdre {
  type: 'ordre';
  id: string;
  question: string;
  elements: { id: string; texte: string }[];
  ordreCorrect: string[];
  pointsMax: number;
  /** Explication affichée après validation de l'étape. */
  feedback: string;
}

export type Etape = EtapeChoix | EtapeOrdre;

export interface CasPratique {
  id: string;
  filiere: Filiere;
  titre: string;
  /** Rôle du candidat dans le scénario (ex. « Analyste data, Direction des systèmes de paiement »). */
  role: string;
  /** Heure simulée affichée dans le briefing (ex. « Mardi, 09h05 »). */
  heure: string;
  /** Enjeu en une phrase. */
  enjeu: string;
  contexte: string; // briefing immersif
  piecesJointes: PieceJointe[];
  etapes: Etape[];
  pointsMax: number;
  debrief: string; // corrigé expert complet affiché à la fin
}

export interface Candidat {
  /** UUID généré sur l'appareil : identifiant du candidat côté base de données. */
  id: string;
  nom: string;
  email: string;
  filiere: Filiere;
  creeLe: string;
  /** Numéro WhatsApp facultatif (format international). */
  whatsapp?: string;
  /** Accepte d'être recontacté (conseils, nouvelles sessions). */
  consentementContact?: boolean;
}

export interface ScoreDetail {
  obtenu: number;
  max: number;
}

export interface ResultatExamen {
  scoreQcm: number;
  scoreQcmMax: number;
  scoreCas: number;
  scoreCasMax: number;
  noteSur20: number; // arrondi au 0,5
  parSection: Record<Section, ScoreDetail>;
  parCompetence: Record<string, ScoreDetail>;
  dureeSecondes: number;
}

/** Réponse donnée à une étape de cas pratique. */
export type ReponseEtape =
  | { type: 'choix'; optionId: string }
  | { type: 'ordre'; ordre: string[] };

/** Réponses à un cas : clé = id d'étape. */
export type ReponsesCas = Record<string, ReponseEtape>;

/** Mention associée à la note sur 20. */
export type Mention = 'À renforcer' | 'Correct' | 'Bon niveau' | 'Excellent';

/** Tentative archivée dans l'historique local (suivi des 5 simulations recommandées). */
export interface Tentative {
  id: string;
  filiere: Filiere;
  date: string; // ISO
  noteSur20: number;
  scoreQcm: number;
  scoreCas: number;
  scoreCasMax: number;
  dureeSecondes: number;
  parSection: Record<Section, ScoreDetail>;
  parCompetence: Record<string, ScoreDetail>;
}
