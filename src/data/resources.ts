// Ressources et formations d'Oscar Aksanti (formations4data).

export const OSCAR = {
  nom: 'Oscar Aksanti',
  marque: 'formations4data',
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
];
