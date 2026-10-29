'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Briefcase, CheckCircle2, Flag, Lightbulb, ListChecks, Timer as TimerIcon } from 'lucide-react';
import { DUREE_CAS_MS, lireVus, useExam } from '@/context/ExamContext';
import { useGarde } from '@/context/useGarde';
import { casParId, casPratiques } from '@/data/casesData';
import { questionParId } from '@/data/quizData';
import { CLES } from '@/lib/storage';
import { NB_CAS, nouvelleGraine, tirerCas } from '@/lib/sampling';
import { calculerResultat, maxCas, scoreCas } from '@/lib/scoring';
import { LIBELLES_FILIERE } from '@/lib/share';
import type { CasPratique, QcmQuestion } from '@/lib/types';
import { Stepper } from '@/components/layout/Stepper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Timer } from '@/components/ui/Timer';
import { CaseBriefing } from './CaseBriefing';
import { CaseDebrief } from './CaseDebrief';
import { DecisionStep } from './DecisionStep';
import { OrderingStep } from './OrderingStep';

export function CasesSession() {
  const pret = useGarde('qcm_termine');
  const { etat, demarrerCas, repondreEtape, validerEtape, allerCas, terminerCas } = useExam();
  const router = useRouter();
  const reduit = useReducedMotion();
  const [confirmation, setConfirmation] = useState(false);

  const session = etat.cas;

  useEffect(() => {
    if (etat.hydrate && session?.fin && etat.resultat) router.replace('/resultats/');
  }, [etat.hydrate, session?.fin, etat.resultat, router]);

  const liste = useMemo<CasPratique[]>(
    () => (session ? session.casIds.map(casParId).filter((c): c is CasPratique => Boolean(c)) : []),
    [session],
  );

  const commencer = () => {
    const filiere = etat.examen?.filiere ?? etat.candidat?.filiere ?? 'data';
    const tirage = tirerCas(casPratiques, filiere, nouvelleGraine(), lireVus(CLES.casVus));
    demarrerCas(tirage.map((c) => c.id));
    window.scrollTo({ top: 0 });
  };

  const finir = useCallback(() => {
    if (!etat.examen || !session) return;
    const questions = etat.examen.questionIds.map(questionParId).filter((q): q is QcmQuestion => Boolean(q));
    const finQcm = etat.examen.finQcm ?? Date.now();
    const duree = Math.round((finQcm - etat.examen.debut) / 1000 + (Date.now() - session.debut) / 1000);
    const resultat = calculerResultat({
      questions,
      reponses: etat.examen.reponses,
      cas: liste,
      reponsesCas: session.reponses,
      dureeSecondes: duree,
    });
    terminerCas(resultat);
    router.push('/resultats/');
  }, [etat.examen, session, liste, terminerCas, router]);

  if (!pret) return <div className="mx-auto h-96 max-w-6xl animate-pulse px-4 py-10" aria-busy="true" aria-label="Chargement" />;

  const filiere = etat.examen?.filiere ?? etat.candidat?.filiere ?? 'data';

  // Écran d'introduction avant de lancer le chrono des cas.
  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Stepper courante={3} />
        <motion.div initial={reduit ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 max-w-2xl">
          <Card padding="lg" className="shadow-lift">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-strong">
              <Briefcase aria-hidden className="size-6" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Cas pratiques — {LIBELLES_FILIERE[filiere]}</h1>
            <p className="mt-2 leading-relaxed text-muted">
              QCM terminé ✅. Place maintenant aux mises en situation : tu incarnes un agent face à un scénario réaliste
              (fictif). Lis le briefing, exploite les pièces jointes et prends les bonnes décisions.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li className="flex gap-2.5"><ListChecks aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span><strong className="text-ink">{NB_CAS} cas</strong> de 4 à 5 étapes : choix pondérés et mises en ordre.</span></li>
              <li className="flex gap-2.5"><TimerIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span><strong className="text-ink">20 minutes</strong> au total. À 0, tes réponses sont validées automatiquement.</span></li>
              <li className="flex gap-2.5"><Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span>Le <strong className="text-ink">feedback</strong> s&apos;affiche après chaque étape validée, puis le corrigé de l&apos;expert en fin de cas.</span></li>
              <li className="flex gap-2.5"><Flag aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span>Les cas comptent pour <strong className="text-ink">8 points sur 20</strong>.</span></li>
            </ul>
            <Button taille="lg" className="mt-7 w-full sm:w-auto" onClick={commencer} icone={<ArrowRight aria-hidden className="order-last size-5" />}>
              Ouvrir le premier dossier
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const cas = liste[session.casCourant];
  if (!cas) return null;
  const reponses = session.reponses[cas.id] ?? {};
  const validees = session.validees[cas.id] ?? [];
  const premiereNonValidee = cas.etapes.findIndex((e) => !validees.includes(e.id));
  const casTermine = premiereNonValidee === -1;
  const visibles = casTermine ? cas.etapes : cas.etapes.slice(0, premiereNonValidee + 1);
  const tousTermines = liste.every((c) => c.etapes.every((e) => (session.validees[c.id] ?? []).includes(e.id)));
  const dernier = session.casCourant === liste.length - 1;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="sticky top-[6.875rem] z-30 -mx-4 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-16">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 gap-1.5" role="tablist" aria-label="Cas pratiques">
            {liste.map((c, i) => {
              const fini = c.etapes.every((e) => (session.validees[c.id] ?? []).includes(e.id));
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === session.casCourant}
                  onClick={() => allerCas(i)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    i === session.casCourant ? 'bg-primary-strong text-on-primary' : 'border border-border bg-surface text-muted hover:text-ink'
                  }`}
                >
                  {fini ? <CheckCircle2 aria-hidden className="size-3.5" /> : null} Cas {i + 1}
                </button>
              );
            })}
          </div>
          <Timer fin={session.debut + DUREE_CAS_MS} onExpire={finir} libelle="Temps restant pour les cas pratiques" />
        </div>
      </div>

      <motion.div key={cas.id} initial={reduit ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 lg:sticky lg:top-40 lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto lg:pr-2 scroll-fin">
          <CaseBriefing cas={cas} />
        </div>

        <div className="min-w-0 space-y-5">
          {visibles.map((e, i) => (
            <motion.div key={e.id} initial={reduit ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card padding="lg">
                {e.type === 'choix' ? (
                  <DecisionStep
                    etape={e}
                    numero={i + 1}
                    choix={reponses[e.id]?.type === 'choix' ? (reponses[e.id] as { type: 'choix'; optionId: string }).optionId : undefined}
                    validee={validees.includes(e.id)}
                    onChoisir={(optionId) => repondreEtape(cas.id, e.id, { type: 'choix', optionId })}
                    onValider={() => validerEtape(cas.id, e.id)}
                  />
                ) : (
                  <OrderingStep
                    etape={e}
                    numero={i + 1}
                    ordre={reponses[e.id]?.type === 'ordre' ? (reponses[e.id] as { type: 'ordre'; ordre: string[] }).ordre : undefined}
                    validee={validees.includes(e.id)}
                    onOrdonner={(ordre) => repondreEtape(cas.id, e.id, { type: 'ordre', ordre })}
                    onValider={(ordre) => {
                      repondreEtape(cas.id, e.id, { type: 'ordre', ordre });
                      validerEtape(cas.id, e.id);
                    }}
                  />
                )}
              </Card>
            </motion.div>
          ))}

          {!casTermine ? (
            <p className="text-center text-sm text-muted">
              Étape {premiereNonValidee + 1} sur {cas.etapes.length} — valide-la pour débloquer la suite.
            </p>
          ) : (
            <motion.div initial={reduit ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <CaseDebrief debrief={cas.debrief} obtenu={scoreCas(cas, reponses)} max={maxCas(cas)} />
              {tousTermines ? (
                <Button taille="lg" className="w-full" onClick={finir} icone={<ArrowRight aria-hidden className="order-last size-5" />}>
                  Voir mes résultats
                </Button>
              ) : !dernier ? (
                <Button taille="lg" className="w-full" onClick={() => { allerCas(session.casCourant + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} icone={<ArrowRight aria-hidden className="order-last size-5" />}>
                  Ouvrir le cas suivant
                </Button>
              ) : (
                <Button taille="lg" className="w-full" onClick={() => allerCas(liste.findIndex((c) => !c.etapes.every((x) => (session.validees[c.id] ?? []).includes(x.id))))}>
                  Terminer le cas restant
                </Button>
              )}
            </motion.div>
          )}

          {!tousTermines ? (
            <button type="button" onClick={() => setConfirmation(true)} className="mx-auto block text-sm font-medium text-muted underline-offset-2 hover:text-ink hover:underline">
              Terminer maintenant et voir mes résultats
            </button>
          ) : null}
        </div>
      </motion.div>

      <Modal
        ouvert={confirmation}
        onFermer={() => setConfirmation(false)}
        titre="Terminer les cas pratiques ?"
        actions={
          <>
            <Button variante="secondaire" onClick={() => setConfirmation(false)}>Continuer</Button>
            <Button onClick={finir}>Voir mes résultats</Button>
          </>
        }
      >
        <p>Les étapes non validées compteront 0 point. Les réponses déjà choisies mais non validées seront prises en compte.</p>
      </Modal>
    </div>
  );
}
