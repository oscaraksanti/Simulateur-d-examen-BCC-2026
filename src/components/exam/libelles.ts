import type { Difficulte, Section } from '@/lib/types';

export const LIBELLES_SECTION: Record<Section, string> = {
  technique: 'Technique',
  culture_bcc: 'Culture BCC',
  logique: 'Aptitudes logiques',
};

export const LIBELLES_DIFFICULTE: Record<Difficulte, string> = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
};
