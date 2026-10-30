// Icône et teinte de chaque filière (cartes du tableau de bord, choix de filière).

import { BrainCircuit, CodeXml, Database, Headset, MonitorSmartphone, Network, Server, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { Filiere } from '@/lib/types';

export const ICONES_FILIERE: Record<Filiere, LucideIcon> = {
  data: BrainCircuit,
  cyber: ShieldCheck,
  bdd: Database,
  systemes: Server,
  reseaux: Network,
  dev: CodeXml,
  support: Headset,
  numerique: MonitorSmartphone,
};

/** Fond + texte de la pastille d'icône (tokens du thème uniquement). */
export const TEINTES_FILIERE: Record<Filiere, string> = {
  data: 'bg-primary-soft text-primary-strong',
  cyber: 'bg-danger-soft text-danger',
  bdd: 'bg-success-soft text-success-ink',
  systemes: 'bg-accent-soft text-ink',
  reseaux: 'bg-primary-soft text-primary-strong',
  dev: 'bg-surface-2 text-ink',
  support: 'bg-success-soft text-success-ink',
  numerique: 'bg-accent-soft text-ink',
};
