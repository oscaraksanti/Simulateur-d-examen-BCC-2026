import type { Metadata } from 'next';
import { CasesSession } from '@/components/cases/CasesSession';

export const metadata: Metadata = {
  title: 'Cas pratiques',
  description: 'Mises en situation immersives (fictives) : salle de crise data et cybersécurité, feedback étape par étape et corrigé expert.',
};

export default function PageCasPratiques() {
  return <CasesSession />;
}
