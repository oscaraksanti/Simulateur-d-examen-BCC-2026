import type { Metadata } from 'next';
import { ExamSession } from '@/components/exam/ExamSession';

export const metadata: Metadata = {
  title: 'Examen blanc',
  description: 'Tableau de bord et QCM chronométré : 24 questions en 30 minutes (technique, culture BCC, aptitudes logiques).',
};

export default function PageExamen() {
  return <ExamSession />;
}
