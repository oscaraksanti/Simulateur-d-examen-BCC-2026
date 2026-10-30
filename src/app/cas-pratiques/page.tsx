import type { Metadata } from 'next';
import { CasesSession } from '@/components/cases/CasesSession';

export const metadata: Metadata = {
  title: 'Cas pratiques',
  description: 'Mises en situation immersives (fictives) dans les 8 domaines informatiques : feedback étape par étape et corrigé expert.',
};

export default function PageCasPratiques() {
  return <CasesSession />;
}
