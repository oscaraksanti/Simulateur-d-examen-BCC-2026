// Ressources et formations d'Oscar Aksanti (Datalendo).

export const OSCAR = {
  nom: 'Oscar Aksanti',
  marque: 'Datalendo',
  site: 'https://datalendo.com',
  youtube: 'https://youtube.com/@oscaraksanti',
  whatsappNumero: '243971601855',
} as const;

export interface Ressource {
  id: string;
  titre: string;
  description: string;
  lien: string;
  libelleBouton: string;
}

export const ressources: Ressource[] = [
  {
    id: 'youtube',
    titre: 'Tutoriels gratuits sur YouTube',
    description:
      'SQL, Python, Power BI, statistiques et cybersécurité : des vidéos pas à pas pour combler tes lacunes avant le test.',
    lien: OSCAR.youtube,
    libelleBouton: 'Voir les tutoriels gratuits',
  },
  {
    id: 'datalendo',
    titre: 'Formations Datalendo',
    description:
      'Des parcours complets en data et en cybersécurité pour aller au-delà du test et réussir ta prise de poste.',
    lien: 'https://datalendo.com',
    libelleBouton: 'Découvrir Datalendo',
  },
];
