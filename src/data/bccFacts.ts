// Faits BCC vérifiés — SOURCE UNIQUE DE VÉRITÉ pour la section « Culture BCC ».
// Règle : aucune question « culture_bcc » ne doit s'appuyer sur un fait absent de ce fichier.
// Pour ajouter un fait : sourcez-le, datez-le (verifieLe) et faites relire la PR.

export const VERIFIE_LE = '2026-10-29';

export type CategorieFait =
  | 'institution'
  | 'gouvernance'
  | 'politique_monetaire'
  | 'paiements'
  | 'recrutement';

export interface FaitBcc {
  id: string;
  categorie: CategorieFait;
  texte: string;
  source: string;
  verifieLe: string;
}

export interface PointTauxDirecteur {
  date: string; // ISO
  libelle: string; // ex. « CPM du 9 avril 2026 »
  taux: number; // en %
  commentaire: string;
  source: string;
}

export interface EtapeFluxPaiement {
  id: string;
  titre: string;
  description: string;
}

export const categoriesFaits: Record<CategorieFait, string> = {
  institution: 'Institution & cadre légal',
  gouvernance: 'Gouvernance & actualité 2026',
  politique_monetaire: 'Politique monétaire 2026',
  paiements: 'Systèmes de paiement',
  recrutement: 'Recrutement 2026',
};

const faits: FaitBcc[] = [
  // --- Institution & cadre légal
  {
    id: 'F-INST-01',
    categorie: 'institution',
    texte:
      "La BCC est l'institut d'émission de la RDC ; elle est seule habilitée à émettre les billets et pièces en franc congolais (CDF).",
    source: 'Constitution de la RDC, art. 176 ; Loi n°005/2002',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-INST-02',
    categorie: 'institution',
    texte:
      "La loi n°005/2002 du 7 mai 2002 est relative à la constitution, à l'organisation et au fonctionnement de la BCC.",
    source: 'Loi n°005/2002 du 7 mai 2002 (leganet.cd)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-INST-03',
    categorie: 'institution',
    texte:
      "Objectif principal de la politique monétaire : la stabilité du niveau général des prix. Sans préjudice de cet objectif, la BCC soutient la politique économique du Gouvernement.",
    source: 'Loi n°005/2002 du 7 mai 2002, art. 3',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-INST-04',
    categorie: 'institution',
    texte: "La BCC est indépendante et jouit de l'autonomie de gestion.",
    source: 'Constitution de la RDC, art. 176',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-INST-05',
    categorie: 'institution',
    texte: "Le capital de la BCC est détenu en totalité par l'État congolais.",
    source: 'Loi n°005/2002 du 7 mai 2002',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-INST-06',
    categorie: 'institution',
    texte: 'Siège : 563, boulevard Colonel Tshatshi, Gombe, Kinshasa.',
    source: 'En-tête des instructions de la BCC',
    verifieLe: VERIFIE_LE,
  },
  // --- Gouvernance & actualité 2026
  {
    id: 'F-GOUV-01',
    categorie: 'gouvernance',
    texte:
      "Gouverneur : André Wameso Nkualoloki, nommé par ordonnance le 23 juillet 2025, installé en août 2025, successeur de Malangu Kabedi Mbuyi.",
    source: 'Radio Okapi ; 7sur7.cd ; mediacongo.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-GOUV-02',
    categorie: 'gouvernance',
    texte:
      'Le Comité de Politique Monétaire (CPM) — gouverneur, vice-gouverneurs, administrateurs — se réunit selon un calendrier préétabli.',
    source: 'Communiqué BCC (via capmad.com)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-GOUV-03',
    categorie: 'gouvernance',
    texte:
      "Plan stratégique 2026-2030 ; la 1ère Conférence des Entités Provinciales (CONFEP 2026) s'est ouverte à Kolwezi (Lualaba) le 1er octobre 2026.",
    source: 'Agence Congolaise de Presse (ACP)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-GOUV-04',
    categorie: 'gouvernance',
    texte:
      "Le poste de RSSI (responsable de la sécurité des systèmes d'information) a été créé à la BCC par le gouverneur après sa prise de fonction en 2025 ; le RSSI a publiquement alerté (mai 2026, Dakar) sur l'impréparation du secteur financier face aux cyberattaques dopées à l'IA.",
    source: 'Bankable.africa',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-GOUV-05',
    categorie: 'gouvernance',
    texte:
      '30 juin 2026 : premiers billets de 50, 100 et 1 000 CDF portant la signature du gouverneur Wameso.',
    source: 'mediacongo.net',
    verifieLe: VERIFIE_LE,
  },
  // --- Politique monétaire 2026
  {
    id: 'F-PM-01',
    categorie: 'politique_monetaire',
    texte: 'Taux directeur abaissé de 15 % à 13,5 % lors du CPM du 9 avril 2026.',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PM-02',
    categorie: 'politique_monetaire',
    texte:
      'Taux directeur abaissé de 13,5 % à 12,5 % lors du CPM du 17 juillet 2026 ; la facilité de prêt marginal passe de 17,5 % à 16,5 %.',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PM-03',
    categorie: 'politique_monetaire',
    texte: 'Taux directeur maintenu à 12,5 % lors du CPM du 8 octobre 2026, tenu à Kolwezi.',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PM-04',
    categorie: 'politique_monetaire',
    texte:
      'Nouvelle maturité de 252 jours pour les Bons BCC (juillet 2026), destinée à stériliser la liquidité excédentaire.',
    source: 'Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PM-05',
    categorie: 'politique_monetaire',
    texte: "Cible d'inflation moyenne : 7 %.",
    source: 'ACP (Conseil des ministres, avril 2026)',
    verifieLe: VERIFIE_LE,
  },
  // --- Systèmes de paiement
  {
    id: 'F-PAY-01',
    categorie: 'paiements',
    texte:
      'Télécompensation : logiciel ISYS lancé le 14 juillet 2011 ; une seule chambre de compensation nationale depuis 2011 (contre 21 auparavant).',
    source: 'memoireonline (mémoire UPC)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PAY-02',
    categorie: 'paiements',
    texte:
      'RTGS = système de règlement brut en temps réel : gros montants, réglés transaction par transaction.',
    source: 'Définition standard des systèmes de paiement',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PAY-03',
    categorie: 'paiements',
    texte:
      "Switch monétique national « Mosolo » (« argent » en lingala), géré par la BCC ; lancement annoncé en 2021.",
    source: 'BPC ; MicroSave',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PAY-04',
    categorie: 'paiements',
    texte:
      'Instruction n°58 (2024) : interopérabilité obligatoire des systèmes de paiement électronique, connexion obligatoire au Switch national, compensation multilatérale, normes EMV et PCI-DSS imposées.',
    source: 'RegAlert',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PAY-05',
    categorie: 'paiements',
    texte: 'Instruction n°24 : cadre des émetteurs de monnaie électronique.',
    source: 'MicroSave',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-PAY-06',
    categorie: 'paiements',
    texte:
      'Instruction n°52 (2023) : prévention, centralisation et diffusion des incidents de paiement.',
    source: 'RegAlert',
    verifieLe: VERIFIE_LE,
  },
  // --- Recrutement 2026
  {
    id: 'F-REC-01',
    categorie: 'recrutement',
    texte:
      "Avis publié en juillet 2026 ; candidatures en ligne du 27 au 30 juillet 2026 à 12h00 (heure de Kinshasa) via le formulaire du site officiel ; candidatures féminines vivement encouragées.",
    source: 'Compte X officiel @BCC_RDC ; afrique54.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-REC-02',
    categorie: 'recrutement',
    texte:
      "Domaines : cybersécurité, administration des bases de données, analyse des données, administration des systèmes, réseaux et télécommunications, développement logiciel, support IT.",
    source: 'Compte X officiel @BCC_RDC ; afrique54.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-REC-03',
    categorie: 'recrutement',
    texte:
      'Conditions : nationalité congolaise, bonne moralité, 40 ans maximum, diplôme dans un des domaines visés.',
    source: 'Compte X officiel @BCC_RDC ; afrique54.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-REC-04',
    categorie: 'recrutement',
    texte: "Première campagne officielle depuis l'arrivée du gouverneur Wameso.",
    source: 'leregard.info',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'F-REC-05',
    categorie: 'recrutement',
    texte:
      "Processus : 1) dépôt de candidature, 2) présélection, 3) évaluations techniques (tests écrits ou pratiques), 4) entretiens de sélection, 5) intégration.",
    source: 'Page Carrières de bcc.cd',
    verifieLe: VERIFIE_LE,
  },
];

const tauxDirecteur2026: PointTauxDirecteur[] = [
  {
    date: '2026-01-01',
    libelle: 'Début 2026',
    taux: 15,
    commentaire: 'Niveau de départ',
    source: 'ACP ; Financial Afrik',
  },
  {
    date: '2026-04-09',
    libelle: 'CPM du 9 avril',
    taux: 13.5,
    commentaire: 'Baisse de 150 points de base',
    source: 'ACP ; Financial Afrik',
  },
  {
    date: '2026-07-17',
    libelle: 'CPM du 17 juillet',
    taux: 12.5,
    commentaire: 'Baisse de 100 pb ; prêt marginal 16,5 %',
    source: 'ACP ; Financial Afrik',
  },
  {
    date: '2026-10-08',
    libelle: 'CPM du 8 octobre (Kolwezi)',
    taux: 12.5,
    commentaire: 'Maintien',
    source: 'ACP ; Financial Afrik',
  },
];

const fluxPaiement: EtapeFluxPaiement[] = [
  {
    id: 'banques',
    titre: 'Banques & émetteurs',
    description: 'Initient les ordres de paiement (cartes, virements, monnaie électronique).',
  },
  {
    id: 'switch',
    titre: 'Switch national « Mosolo »',
    description: 'Interopérabilité obligatoire (Instruction n°58), normes EMV et PCI-DSS.',
  },
  {
    id: 'compensation',
    titre: 'Compensation',
    description: 'Compensation multilatérale ; chambre nationale unique (ISYS) depuis 2011.',
  },
  {
    id: 'reglement',
    titre: 'Règlement BCC',
    description: 'Règlement en monnaie banque centrale ; RTGS pour les gros montants.',
  },
];

export const recrutement2026 = {
  periode: 'Candidatures du 27 au 30 juillet 2026 à 12h00 (heure de Kinshasa)',
  domaines: [
    'Cybersécurité',
    'Administration des bases de données',
    'Analyse des données',
    'Administration des systèmes',
    'Réseaux et télécommunications',
    'Développement logiciel',
    'Support IT',
  ],
  conditions: [
    'Nationalité congolaise',
    'Bonne moralité',
    '40 ans maximum',
    'Diplôme dans un des domaines visés',
  ],
  etapes: [
    'Dépôt de candidature',
    'Présélection',
    'Évaluations techniques (tests écrits ou pratiques)',
    'Entretiens de sélection',
    'Intégration',
  ],
  note: "Première campagne officielle depuis l'arrivée du gouverneur Wameso ; candidatures féminines vivement encouragées.",
  source: 'Compte X officiel @BCC_RDC ; afrique54.net ; leregard.info ; page Carrières bcc.cd',
  verifieLe: VERIFIE_LE,
} as const;

export const bccFacts = {
  verifieLe: VERIFIE_LE,
  avertissement:
    'Données vérifiées au 29/10/2026 — les taux et chiffres évoluent, vérifie toujours sur bcc.cd.',
  siteOfficiel: 'https://www.bcc.cd',
  faits,
  tauxDirecteur2026,
  fluxPaiement,
  recrutement2026,
} as const;
