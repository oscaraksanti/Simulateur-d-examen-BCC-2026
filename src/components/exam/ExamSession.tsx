'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCheck, ListOrdered } from 'lucide-react';
import { DUREE_QCM_MS, lireVus, useExam } from '@/context/ExamContext';
import { useGarde } from '@/context/useGarde';
import { CLES } from '@/lib/storage';
import { nouvelleGraine, tirerQuestions } from '@/lib/sampling';
import { quizData, questionParId } from '@/data/quizData';
import type { OptionId, QcmQuestion } from '@/lib/types';
import { Stepper } from '@/components/layout/Stepper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';
import { ExamDashboard } from './ExamDashboard';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigator } from './QuestionNavigator';
import { LIBELLES_SECTION } from './libelles';

const LETTRES: OptionId[] = ['A', 'B', 'C', 'D'];

export function ExamSession() {
  const pret = useGarde('candidat');
  const { etat, demarrerExamen, repondre, basculerRevoir, allerA, terminerQcm } = useExam();
  const router = useRouter();
  const reduit = useReducedMotion();
  const [confirmation, setConfirmation] = useState(false);
  const [navOuvert, setNavOuvert] = useState(false);

  const examen = etat.examen;
  const enCours = Boolean(examen && !examen.finQcm && !etat.resultat);

  // QCM déjà terminé mais cas non faits → étape suivante.
  useEffect(() => {
    if (etat.hydrate && examen?.finQcm && !etat.resultat) router.replace('/cas-pratiques/');
  }, [etat.hydrate, examen?.finQcm, etat.resultat, router]);

  const questions = useMemo<QcmQuestion[]>(
    () => (examen ? examen.questionIds.map(questionParId).filter((q): q is QcmQuestion => Boolean(q)) : []),
    [examen],
  );

  const demarrer = useCallback(() => {
    if (!etat.candidat) return;
    const tirage = tirerQuestions(quizData, {
      filiere: etat.candidat.filiere,
      graine: nouvelleGraine(),
      dejaVues: lireVus(CLES.questionsVues),
    });
    demarrerExamen(nouvelleGraine(), tirage.map((q) => q.id));
    window.scrollTo({ top: 0 });
  }, [etat.candidat, demarrerExamen]);

  const terminer = useCallback(() => {
    terminerQcm();
    router.push('/cas-pratiques/');
  }, [terminerQcm, router]);

  const index = examen?.indexCourant ?? 0;
  const question = questions[index];

  // Raccourcis clavier : A–D pour répondre, ← → pour naviguer.
  useEffect(() => {
    if (!enCours || !question || confirmation) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const cible = e.target as HTMLElement | null;
      if (cible && (cible.tagName === 'INPUT' && (cible as HTMLInputElement).type !== 'radio')) return;
      if (cible?.tagName === 'TEXTAREA') return;
      const lettre = e.key.toUpperCase();
      if (LETTRES.includes(lettre as OptionId)) {
        e.preventDefault();
        repondre(question.id, lettre as OptionId);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        allerA(index + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        allerA(index - 1);
      }
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [enCours, question, index, repondre, allerA, confirmation]);

  if (!pret) {
    return <div className="mx-auto h-96 max-w-6xl animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Chargement" />;
  }

  if (!enCours || !examen) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Stepper courante={2} />
        <div className="mt-8">
          <ExamDashboard onDemarrer={demarrer} />
        </div>
      </div>
    );
  }

  if (!question) return null;

  const repondues = questions.filter((q) => examen.reponses[q.id]).length;
  const sansReponse = questions.length - repondues;
  const fin = examen.debut + DUREE_QCM_MS;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      {/* Barre d'examen collante */}
      <div className="sticky top-[6.875rem] z-30 -mx-4 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-16">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {LIBELLES_SECTION[question.section]}
              <span className="font-normal text-muted"> · Examen blanc</span>
            </p>
            <p className="font-mono text-xs text-muted tabular">
              {repondues}/{questions.length} répondues
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Timer fin={fin} onExpire={terminer} libelle="Temps restant pour le QCM" />
            <Button variante="secondaire" taille="sm" className="lg:hidden" onClick={() => setNavOuvert((v) => !v)} aria-expanded={navOuvert} aria-controls="nav-questions-mobile" aria-label="Afficher la grille des questions">
              <ListOrdered aria-hidden className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <ProgressBar valeur={repondues} max={questions.length} libelle="Progression du QCM" hauteur="fine" />
        </div>
        {navOuvert ? (
          <div id="nav-questions-mobile" className="mt-3 rounded-2xl border border-border bg-surface p-4 lg:hidden">
            <QuestionNavigator
              questions={questions}
              reponses={examen.reponses}
              aRevoir={examen.aRevoir}
              courant={index}
              onAller={(i) => {
                allerA(i);
                setNavOuvert(false);
              }}
            />
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        Question {index + 1} sur {questions.length}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <Card padding="lg" className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={question.id}
                initial={reduit ? { opacity: 0 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduit ? { opacity: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <QuestionCard
                  question={question}
                  numero={index + 1}
                  total={questions.length}
                  reponse={examen.reponses[question.id]}
                  onRepondre={(o) => repondre(question.id, o)}
                  aRevoir={examen.aRevoir.includes(question.id)}
                  onBasculerRevoir={() => basculerRevoir(question.id)}
                />
              </motion.div>
            </AnimatePresence>
          </Card>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variante="secondaire" onClick={() => allerA(index - 1)} disabled={index === 0} icone={<ArrowLeft aria-hidden className="size-4" />}>
              Précédente
            </Button>
            {index < questions.length - 1 ? (
              <Button onClick={() => allerA(index + 1)} icone={<ArrowRight aria-hidden className="order-last size-4" />}>
                Suivante
              </Button>
            ) : (
              <Button variante="accent" onClick={() => setConfirmation(true)} icone={<CheckCheck aria-hidden className="size-4" />}>
                Terminer le QCM
              </Button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <Card className="sticky top-44">
            <QuestionNavigator questions={questions} reponses={examen.reponses} aRevoir={examen.aRevoir} courant={index} onAller={allerA} />
            <Button variante="secondaire" className="mt-5 w-full" onClick={() => setConfirmation(true)} icone={<CheckCheck aria-hidden className="size-4" />}>
              Terminer la partie QCM
            </Button>
          </Card>
        </aside>
      </div>

      <div className="mt-6 lg:hidden">
        <Button variante="secondaire" className="w-full" onClick={() => setConfirmation(true)} icone={<CheckCheck aria-hidden className="size-4" />}>
          Terminer la partie QCM
        </Button>
      </div>

      <Modal
        ouvert={confirmation}
        onFermer={() => setConfirmation(false)}
        titre="Terminer la partie QCM ?"
        actions={
          <>
            <Button variante="secondaire" onClick={() => setConfirmation(false)}>
              Continuer à répondre
            </Button>
            <Button onClick={terminer}>Valider et passer aux cas pratiques</Button>
          </>
        }
      >
        {sansReponse > 0 ? (
          <p>
            Il te reste <strong className="text-danger">{sansReponse} question{sansReponse > 1 ? 's' : ''} sans réponse</strong>. Il
            n&apos;y a pas de point négatif : mieux vaut répondre à tout.
          </p>
        ) : (
          <p>Tu as répondu aux {questions.length} questions. </p>
        )}
        {examen.aRevoir.length > 0 ? (
          <p className="mt-2">
            {examen.aRevoir.length} question{examen.aRevoir.length > 1 ? 's sont marquées' : ' est marquée'} « à revoir ».
          </p>
        ) : null}
        <p className="mt-2">Une fois validé, tu ne pourras plus modifier tes réponses.</p>
      </Modal>
    </div>
  );
}
