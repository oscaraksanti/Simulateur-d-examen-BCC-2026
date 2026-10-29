'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, BarChart3, BookOpenCheck, Radar, RotateCcw, Share2, Target, TrendingUp } from 'lucide-react';
import { OBJECTIF_SIMULATIONS, useExam } from '@/context/ExamContext';
import { useGarde } from '@/context/useGarde';
import { questionParId } from '@/data/quizData';
import { competencesFaibles, COMPETENCE_CAS, mention, taux } from '@/lib/scoring';
import { LIBELLES_FILIERE } from '@/lib/share';
import type { QcmQuestion } from '@/lib/types';
import { Stepper } from '@/components/layout/Stepper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Reveal } from '@/components/ui/Reveal';
import { ScoreHero } from './ScoreHero';
import { ScoreBreakdown } from './ScoreBreakdown';
import { RadarBySkill, type AxeRadar } from './RadarBySkill';
import { ProgressionChart } from './ProgressionChart';
import { CorrectionList } from './CorrectionList';
import { ResourcesOscar } from './ResourcesOscar';
import { ShareButtons } from './ShareButtons';

function Titre({ icone: Icone, children }: { icone: typeof BarChart3; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
      <Icone aria-hidden className="size-5 text-primary-strong" /> {children}
    </h2>
  );
}

export function ResultsView() {
  const pret = useGarde('resultat');
  const { etat, nouvelleTentative, changerFiliere } = useExam();
  const router = useRouter();

  const questions = useMemo<QcmQuestion[]>(
    () => (etat.examen ? etat.examen.questionIds.map(questionParId).filter((q): q is QcmQuestion => Boolean(q)) : []),
    [etat.examen],
  );

  const axes = useMemo<AxeRadar[]>(() => {
    const r = etat.resultat;
    if (!r) return [];
    const tech = Array.from(new Set(questions.filter((q) => q.section === 'technique').map((q) => q.competence)));
    const liste: AxeRadar[] = tech.map((c) => {
      const d = r.parCompetence[c] ?? { obtenu: 0, max: 0 };
      return { libelle: c, taux: taux(d), detail: `${d.obtenu}/${d.max}` };
    });
    const sec = r.parSection;
    liste.push({ libelle: 'Culture BCC', taux: taux(sec.culture_bcc), detail: `${sec.culture_bcc.obtenu}/${sec.culture_bcc.max}` });
    liste.push({ libelle: 'Aptitudes logiques', taux: taux(sec.logique), detail: `${sec.logique.obtenu}/${sec.logique.max}` });
    const cas = r.parCompetence[COMPETENCE_CAS];
    if (cas) liste.push({ libelle: 'Cas pratiques', taux: taux(cas), detail: `${Math.round(cas.obtenu * 10) / 10}/${cas.max}` });
    return liste;
  }, [etat.resultat, questions]);

  if (!pret || !etat.resultat || !etat.candidat || !etat.examen) {
    return <div className="mx-auto h-96 max-w-6xl animate-pulse px-4 py-10" aria-busy="true" aria-label="Chargement" />;
  }

  const r = etat.resultat;
  const prenom = etat.candidat.nom.split(' ')[0];
  const m = mention(r.noteSur20);
  const historique = etat.historique;
  const idx = historique.findIndex((t) => t.id === r.tentativeId);
  const numero = idx >= 0 ? idx + 1 : historique.length;
  const precedente = idx > 0 ? historique.slice(0, idx).filter((t) => t.filiere === r.filiere).at(-1) : undefined;
  const priorites = competencesFaibles(r.parCompetence, 2);
  const nb = historique.length;
  const autre = r.filiere === 'data' ? 'cyber' : 'data';

  const refaire = () => {
    nouvelleTentative();
    router.push('/examen/');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <Stepper courante={4} />

      <ScoreHero
        note={r.noteSur20}
        filiere={r.filiere}
        prenom={prenom}
        dureeSecondes={r.dureeSecondes}
        numeroTentative={numero}
        progression={precedente ? r.noteSur20 - precedente.noteSur20 : null}
      />

      {/* Objectif 5 simulations */}
      <Reveal>
        <Card padding="lg" className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <Titre icone={Target}>Objectif : {OBJECTIF_SIMULATIONS} simulations minimum</Titre>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {nb < OBJECTIF_SIMULATIONS
                ? `Tu as fait ${nb} simulation${nb > 1 ? 's' : ''}. Encore ${OBJECTIF_SIMULATIONS - nb} pour couvrir l’essentiel du programme : chaque nouvel examen privilégie des questions que tu n’as jamais vues.`
                : 'Objectif atteint ! Continue jusqu’à obtenir au moins 14/20 sur trois simulations d’affilée.'}
            </p>
            <div className="mt-4">
              <ProgressBar valeur={Math.min(nb, OBJECTIF_SIMULATIONS)} max={OBJECTIF_SIMULATIONS} libelle="Simulations réalisées" ton={nb >= OBJECTIF_SIMULATIONS ? 'succes' : 'primaire'} afficherValeur />
            </div>
            <Button className="mt-5" onClick={refaire} icone={<RotateCcw aria-hidden className="size-4" />}>
              Refaire un examen (nouveau tirage)
            </Button>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <TrendingUp aria-hidden className="size-4 text-primary-strong" /> Ma courbe de progression
            </p>
            <ProgressionChart historique={historique} />
          </div>
        </Card>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card padding="lg" className="h-full">
            <Titre icone={BarChart3}>Score par section</Titre>
            <div className="mt-5">
              <ScoreBreakdown resultat={r} />
            </div>
          </Card>
        </Reveal>
        <Reveal delai={0.06}>
          <Card padding="lg" className="h-full">
            <Titre icone={Radar}>Radar des compétences</Titre>
            <div className="mt-3">
              <RadarBySkill axes={axes} />
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card padding="lg">
          <ResourcesOscar note={r.noteSur20} filiere={r.filiere} priorites={priorites} />
        </Card>
      </Reveal>

      <Reveal>
        <section aria-labelledby="correction-titre">
          <h2 id="correction-titre" className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
            <BookOpenCheck aria-hidden className="size-6 text-primary-strong" /> Correction détaillée
          </h2>
          <p className="mt-1 text-sm text-muted">Pour chaque question : ta réponse, la bonne réponse, pourquoi, et pourquoi les autres options sont fausses.</p>
          <div className="mt-5">
            <CorrectionList questions={questions} reponses={etat.examen.reponses} />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <Card padding="lg">
          <Titre icone={Share2}>Partager mon résultat</Titre>
          <div className="mt-5">
            <ShareButtons prenom={prenom} note={r.noteSur20} filiere={r.filiere} mention={m} />
          </div>
        </Card>
      </Reveal>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button taille="lg" onClick={refaire} icone={<RotateCcw aria-hidden className="size-5" />}>
          Refaire un examen
        </Button>
        <Button
          taille="lg"
          variante="secondaire"
          onClick={() => {
            changerFiliere(autre);
            router.push('/examen/');
          }}
          icone={<ArrowLeftRight aria-hidden className="size-5" />}
        >
          Changer de filière ({LIBELLES_FILIERE[autre]})
        </Button>
      </div>
    </div>
  );
}
