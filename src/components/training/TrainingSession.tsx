'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Dumbbell, RotateCcw, Trophy } from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { quizData } from '@/data/quizData';
import { creerAleatoire, melanger, nouvelleGraine } from '@/lib/sampling';
import { LIBELLES_FILIERE } from '@/lib/share';
import type { Filiere, OptionId, QcmQuestion, Section } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { ExplanationPanel } from '@/components/exam/ExplanationPanel';
import { LIBELLES_SECTION } from '@/components/exam/libelles';

const sAbonner = () => () => undefined;
const lireCompetenceUrl = () => new URLSearchParams(window.location.search).get('competence') ?? '';

interface Serie {
  questions: QcmQuestion[];
  index: number;
  reponses: Record<string, OptionId>;
}

const TAILLES = [10, 20, 0] as const; // 0 = toutes

/** Mode entraînement : questions ciblées par compétence, correction immédiate. */
export function TrainingSession() {
  const { etat } = useExam();
  const reduit = useReducedMotion();
  const competenceUrl = useSyncExternalStore(sAbonner, lireCompetenceUrl, () => '');

  const [filiereChoisie, setFiliere] = useState<Filiere | null>(null);
  const [section, setSection] = useState<Section | 'toutes'>('toutes');
  const [competencesChoisies, setCompetences] = useState<string[] | null>(null);
  const [taille, setTaille] = useState<(typeof TAILLES)[number]>(10);
  const [serie, setSerie] = useState<Serie | null>(null);

  const filiere: Filiere = filiereChoisie ?? etat.candidat?.filiere ?? 'data';
  const pool = useMemo(
    () => quizData.filter((q) => (q.section === 'technique' ? q.filiere === filiere : true)),
    [filiere],
  );
  const competencesDispo = useMemo(
    () =>
      Array.from(
        new Set(pool.filter((q) => section === 'toutes' || q.section === section).map((q) => q.competence)),
      ),
    [pool, section],
  );
  // Pré-sélection depuis l'URL (?competence=…) tant que l'utilisateur n'a rien choisi.
  const competences =
    competencesChoisies ?? (competenceUrl && competencesDispo.includes(competenceUrl) ? [competenceUrl] : []);

  const eligibles = pool.filter(
    (q) =>
      (section === 'toutes' || q.section === section) &&
      (competences.length === 0 || competences.includes(q.competence)),
  );

  const lancer = () => {
    const melangees = melanger(eligibles, creerAleatoire(nouvelleGraine()));
    setSerie({ questions: taille === 0 ? melangees : melangees.slice(0, taille), index: 0, reponses: {} });
    window.scrollTo({ top: 0 });
  };

  if (serie) {
    const q = serie.questions[serie.index];
    const fini = serie.index >= serie.questions.length;
    const justes = serie.questions.filter((x) => serie.reponses[x.id] === x.bonneReponse).length;
    const repondu = q ? serie.reponses[q.id] : undefined;

    if (fini || !q) {
      const pct = Math.round((justes / serie.questions.length) * 100);
      return (
        <Card padding="lg" className="mx-auto max-w-xl text-center shadow-lift">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-ink">
            <Trophy aria-hidden className="size-7" />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink">Série terminée</h2>
          <p className="mt-2 font-mono text-4xl font-bold text-ink tabular">
            {justes}/{serie.questions.length}
          </p>
          <p className="mt-1 text-muted">{pct} % de bonnes réponses</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={lancer} icone={<RotateCcw aria-hidden className="size-4" />}>
              Nouvelle série
            </Button>
            <Button variante="secondaire" onClick={() => setSerie(null)}>
              Changer de thème
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3 text-sm">
          <button type="button" onClick={() => setSerie(null)} className="font-medium text-muted hover:text-ink">
            ← Quitter la série
          </button>
          <span className="font-mono text-muted tabular">
            ✓ {justes} · {serie.index + 1}/{serie.questions.length}
          </span>
        </div>
        <ProgressBar valeur={serie.index} max={serie.questions.length} libelle="Progression de la série" hauteur="fine" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={q.id}
            initial={reduit ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-5 space-y-4"
          >
            <Card padding="lg">
              <QuestionCard
                question={q}
                numero={serie.index + 1}
                total={serie.questions.length}
                reponse={repondu}
                corrige={Boolean(repondu)}
                onRepondre={(o) => setSerie((s) => (s && !s.reponses[q.id] ? { ...s, reponses: { ...s.reponses, [q.id]: o } } : s))}
              />
            </Card>
            {repondu ? (
              <>
                <ExplanationPanel question={q} reponse={repondu} />
                <Button
                  taille="lg"
                  className="w-full"
                  onClick={() => setSerie((s) => (s ? { ...s, index: s.index + 1 } : s))}
                  icone={<ArrowRight aria-hidden className="order-last size-5" />}
                >
                  {serie.index + 1 < serie.questions.length ? 'Question suivante' : 'Voir mon score'}
                </Button>
              </>
            ) : (
              <p className="text-center text-sm text-muted">Choisis une réponse : la correction s&apos;affiche immédiatement.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const puce = (actif: boolean) =>
    `rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
      actif ? 'border-primary bg-primary-soft text-primary-strong' : 'border-border bg-surface text-muted hover:text-ink'
    }`;

  return (
    <Card padding="lg" className="mx-auto max-w-3xl shadow-lift">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary-strong">
          <Dumbbell aria-hidden className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink">Compose ta série</h2>
          <p className="text-sm text-muted">Correction immédiate après chaque réponse, sans chrono.</p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">Filière (questions techniques)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['data', 'cyber'] as const).map((f) => (
            <button key={f} type="button" aria-pressed={filiere === f} className={puce(filiere === f)} onClick={() => { setFiliere(f); setCompetences([]); }}>
              {LIBELLES_FILIERE[f]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink">Section</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['toutes', 'technique', 'culture_bcc', 'logique'] as const).map((s) => (
            <button key={s} type="button" aria-pressed={section === s} className={puce(section === s)} onClick={() => { setSection(s); setCompetences([]); }}>
              {s === 'toutes' ? 'Toutes' : LIBELLES_SECTION[s]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink">
          Compétences <span className="font-normal text-muted">(aucune = toutes)</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {competencesDispo.map((c) => {
            const actif = competences.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={actif}
                className={puce(actif)}
                onClick={() => setCompetences(actif ? competences.filter((x) => x !== c) : [...competences, c])}
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink">Nombre de questions</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TAILLES.map((t) => (
            <button key={t} type="button" aria-pressed={taille === t} className={puce(taille === t)} onClick={() => setTaille(t)}>
              {t === 0 ? 'Toutes' : t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          <span className="font-mono font-semibold text-ink">{eligibles.length}</span> questions disponibles
        </p>
        <Button taille="lg" onClick={lancer} disabled={eligibles.length === 0} icone={<ArrowRight aria-hidden className="order-last size-5" />}>
          Lancer l&apos;entraînement
        </Button>
      </div>
    </Card>
  );
}
