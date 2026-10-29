'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Briefcase, Keyboard, Landmark, Puzzle, ShieldCheck, Target, Timer as TimerIcon } from 'lucide-react';
import { OBJECTIF_SIMULATIONS, useExam } from '@/context/ExamContext';
import { COMPOSITION, NB_CAS } from '@/lib/sampling';
import { formatNote, LIBELLES_FILIERE } from '@/lib/share';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressionChart } from '@/components/results/ProgressionChart';
import { SectionCard } from './SectionCard';

export function ExamDashboard({ onDemarrer }: { onDemarrer: () => void }) {
  const { etat } = useExam();
  const reduit = useReducedMotion();
  const candidat = etat.candidat;
  if (!candidat) return null;
  const prenom = candidat.nom.split(' ')[0];
  const historique = etat.historique.filter((t) => t.filiere === candidat.filiere);
  const nb = etat.historique.length;
  const restantes = Math.max(0, OBJECTIF_SIMULATIONS - nb);
  const derniere = historique.at(-1);

  return (
    <motion.div initial={reduit ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Tableau de bord · Filière {LIBELLES_FILIERE[candidat.filiere]}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Bonjour {prenom} 👋</h1>
          <p className="mt-2 max-w-xl text-muted">
            {nb === 0
              ? 'Ta première simulation va servir de diagnostic. Mets-toi au calme, comme le jour du test.'
              : restantes > 0
                ? `Simulation n°${nb + 1}. Encore ${restantes} pour atteindre l’objectif des ${OBJECTIF_SIMULATIONS} simulations.`
                : `Objectif des ${OBJECTIF_SIMULATIONS} simulations atteint 🎉 Continue pour stabiliser ta note au-dessus de 14/20.`}
          </p>
        </div>
        <Link href="/#inscription" className="text-sm font-semibold text-primary-strong hover:underline">
          Changer de filière
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <SectionCard
          icone={candidat.filiere === 'data' ? BrainCircuit : ShieldCheck}
          titre={`Technique — ${LIBELLES_FILIERE[candidat.filiere]}`}
          description={
            candidat.filiere === 'data'
              ? 'SQL, Python/pandas, statistiques, Power BI, qualité des données, anomalies, données monétaires.'
              : 'Réseaux, cryptographie, OWASP, IAM, SIEM, gestion d’incident, PCI-DSS, PRA, SWIFT.'
          }
          nbQuestions={COMPOSITION.technique}
          duree="15 min"
          statut="a_faire"
          couleur={candidat.filiere === 'data' ? 'bg-primary-soft text-primary-strong' : 'bg-danger-soft text-danger'}
        />
        <SectionCard
          icone={Landmark}
          titre="Culture BCC"
          description="Cadre légal, gouvernance, politique monétaire 2026, systèmes de paiement, recrutement."
          nbQuestions={COMPOSITION.culture_bcc}
          duree="7 min"
          statut="a_faire"
          couleur="bg-accent-soft text-ink"
        />
        <SectionCard
          icone={Puzzle}
          titre="Aptitudes logiques"
          description="Suites, logique, pourcentages, lecture de tableaux, raisonnement verbal, rendement."
          nbQuestions={COMPOSITION.logique}
          duree="8 min"
          statut="a_faire"
          couleur="bg-success-soft text-success-ink"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-ink">Conditions de l&apos;examen blanc</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <li className="flex gap-2.5"><TimerIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span><strong className="text-ink">30 minutes</strong> pour {COMPOSITION.technique + COMPOSITION.culture_bcc + COMPOSITION.logique} questions, soumission automatique à 0.</span></li>
            <li className="flex gap-2.5"><Briefcase aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span>Puis <strong className="text-ink">{NB_CAS} cas pratiques</strong> en 20 minutes.</span></li>
            <li className="flex gap-2.5"><Target aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span><strong className="text-ink">Pas de correction</strong> pendant le QCM, comme le jour J.</span></li>
            <li className="flex gap-2.5"><Keyboard aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span>Raccourcis : <kbd className="rounded border border-border px-1 font-mono text-xs">A</kbd>–<kbd className="rounded border border-border px-1 font-mono text-xs">D</kbd> répondre, <kbd className="rounded border border-border px-1 font-mono text-xs">←</kbd> <kbd className="rounded border border-border px-1 font-mono text-xs">→</kbd> naviguer.</span></li>
          </ul>
          <p className="mt-4 rounded-xl bg-surface-2 p-3 text-sm text-muted">
            Note /20 = QCM (12 points) + cas pratiques (8 points). Pas de points négatifs : réponds à toutes les questions.
          </p>
          <Button taille="lg" className="mt-6 w-full sm:w-auto" onClick={onDemarrer} icone={<ArrowRight aria-hidden className="order-last size-5" />}>
            Commencer l&apos;examen blanc
          </Button>
        </Card>

        <Card padding="lg">
          <h2 className="text-lg font-semibold text-ink">Ma progression</h2>
          <div className="mt-3">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">Simulations réalisées</span>
              <span className="font-mono font-semibold text-ink tabular">{Math.min(nb, OBJECTIF_SIMULATIONS)}/{OBJECTIF_SIMULATIONS}</span>
            </div>
            <ProgressBar valeur={Math.min(nb, OBJECTIF_SIMULATIONS)} max={OBJECTIF_SIMULATIONS} libelle="Objectif de 5 simulations" ton={restantes === 0 ? 'succes' : 'primaire'} />
          </div>
          {historique.length > 0 ? (
            <>
              <div className="mt-4">
                <ProgressionChart historique={historique} />
              </div>
              {derniere ? (
                <p className="mt-2 text-sm text-muted">
                  Dernière note : <span className="font-mono font-semibold text-ink">{formatNote(derniere.noteSur20)}/20</span>
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Ta courbe de progression apparaîtra ici après ta première simulation. Les candidats qui passent au moins{' '}
              {OBJECTIF_SIMULATIONS} examens blancs arrivent bien plus sereins le jour J.
            </p>
          )}
          <Link href="/entrainement/" className="mt-4 inline-flex text-sm font-semibold text-primary-strong hover:underline">
            S&apos;entraîner par compétence →
          </Link>
        </Card>
      </div>
    </motion.div>
  );
}
