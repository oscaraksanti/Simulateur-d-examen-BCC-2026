// Les 7 filières du simulateur = les 7 domaines du recrutement informatique BCC 2026
// (liste vérifiée dans src/data/bccFacts.ts → recrutement2026.domaines).
//
// Les noms de compétences sont la clé de regroupement des questions : une nouvelle question
// doit reprendre la chaîne EXACTE (apostrophe typographique ’ comprise).

import type { Filiere } from './types';

export interface InfoFiliere {
  id: Filiere;
  /** Libellé court (cartes, partage, e-mails). */
  nom: string;
  /** Domaine tel qu'annoncé dans le recrutement 2026. */
  domaine: string;
  /** Préfixe des ids de questions et de cas (ex. « DATA-SQL-001 », « DATA-CAS-01 »). */
  prefixe: string;
  /** Une ligne pour le choix de filière. */
  resume: string;
  competences: readonly string[];
}

export const FILIERES: readonly InfoFiliere[] = [
  {
    id: 'data',
    nom: 'Data Analyse',
    domaine: 'Analyse des données',
    prefixe: 'DATA',
    resume: 'SQL, Python, statistiques, Power BI',
    competences: [
      'SQL',
      'Python & pandas',
      'Excel & Power BI',
      'Visualisation',
      'Statistiques',
      'Qualité des données',
      'Détection d’anomalies',
      'Économie & données monétaires',
    ],
  },
  {
    id: 'cyber',
    nom: 'Cybersécurité',
    domaine: 'Cybersécurité',
    prefixe: 'CYB',
    resume: 'Réseaux, crypto, SIEM, réponse à incident',
    competences: [
      'Réseaux',
      'Cryptographie',
      'Sécurité applicative (OWASP)',
      'IAM & contrôle d’accès',
      'SIEM & analyse de logs',
      'Menaces',
      'Gestion d’incident',
      'PCI-DSS & EMV',
      'PCA & PRA',
      'Messagerie financière (SWIFT)',
    ],
  },
  {
    id: 'bdd',
    nom: 'Bases de données',
    domaine: 'Administration des bases de données',
    prefixe: 'BDD',
    resume: 'SQL avancé, index, transactions, sauvegardes, réplication',
    competences: [
      'SQL avancé',
      'Modélisation & normalisation',
      'Transactions & concurrence',
      'Index & optimisation',
      'Sauvegarde & restauration',
      'Haute disponibilité & réplication',
      'Sécurité des bases de données',
      'Exploitation & supervision',
    ],
  },
  {
    id: 'systemes',
    nom: 'Administration systèmes',
    domaine: 'Administration des systèmes',
    prefixe: 'SYS',
    resume: 'Linux, Windows Server & AD, virtualisation, scripts',
    competences: [
      'Linux',
      'Windows Server & Active Directory',
      'Virtualisation & cloud',
      'Stockage & sauvegarde',
      'Scripts & automatisation',
      'Supervision & performances',
      'Durcissement & sécurité système',
      'Services DNS, DHCP & messagerie',
    ],
  },
  {
    id: 'reseaux',
    nom: 'Réseaux & télécoms',
    domaine: 'Réseaux et télécommunications',
    prefixe: 'RES',
    resume: 'Adressage IP, routage, VLAN, fibre, 4G/5G',
    competences: [
      'Modèle OSI & TCP/IP',
      'Adressage IP & sous-réseaux',
      'Commutation & VLAN',
      'Routage',
      'Réseaux sans fil & mobiles',
      'Transmission & télécoms',
      'Services réseau (DNS, DHCP, NAT)',
      'Sécurité & supervision réseau',
    ],
  },
  {
    id: 'dev',
    nom: 'Développement logiciel',
    domaine: 'Développement logiciel',
    prefixe: 'DEV',
    resume: 'Algorithmique, POO, web & API, tests, Git',
    competences: [
      'Algorithmique & complexité',
      'Structures de données',
      'Programmation orientée objet',
      'Bases de données pour développeurs',
      'Web & API',
      'Tests & qualité',
      'Git & DevOps',
      'Sécurité du code',
    ],
  },
  {
    id: 'support',
    nom: 'Support IT',
    domaine: 'Support IT',
    prefixe: 'SUP',
    resume: 'Postes de travail, ITIL, comptes, dépannage réseau',
    competences: [
      'Matériel & périphériques',
      'Windows & postes de travail',
      'Dépannage réseau',
      'Messagerie & bureautique',
      'Comptes & accès',
      'Gestion des incidents (ITIL)',
      'Sécurité au poste de travail',
      'Relation utilisateur',
    ],
  },
];

export const IDS_FILIERES: readonly Filiere[] = FILIERES.map((f) => f.id);

const parId = new Map(FILIERES.map((f) => [f.id, f]));

/** Fiche d'une filière (toujours définie pour un id valide). */
export function infoFiliere(id: Filiere): InfoFiliere {
  return parId.get(id) ?? FILIERES[0];
}

/** Vrai si la valeur est un id de filière connu (lecture de localStorage, d'URL…). */
export function estFiliere(v: unknown): v is Filiere {
  return typeof v === 'string' && parId.has(v as Filiere);
}
