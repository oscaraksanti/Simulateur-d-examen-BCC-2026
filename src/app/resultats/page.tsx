import type { Metadata } from 'next';
import { ResultsView } from '@/components/results/ResultsView';

export const metadata: Metadata = {
  title: 'Mes résultats',
  description: 'Note sur 20, score par section et par compétence, correction détaillée, ressources et partage.',
};

export default function PageResultats() {
  return <ResultsView />;
}
