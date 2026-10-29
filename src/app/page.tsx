import {
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileClock,
  Landmark,
  Repeat,
  Sparkles,
  Target,
  Timer as TimerIcon,
  Users,
} from 'lucide-react';
import { BanknotePattern } from '@/components/illustrations/BanknotePattern';
import { NetworkGraph } from '@/components/illustrations/NetworkGraph';
import { ShieldPulse } from '@/components/illustrations/ShieldPulse';
import { PaymentFlowInfographic } from '@/components/illustrations/PaymentFlowInfographic';
import { PolicyRateTimeline } from '@/components/illustrations/PolicyRateTimeline';
import { DefiBanner, InscriptionBloc } from '@/components/onboarding/InscriptionBloc';
import { Stepper } from '@/components/layout/Stepper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { bccFacts, recrutement2026 } from '@/data/bccFacts';
import { banqueAptitudesLogiques, banqueCultureBcc, banqueTechniqueCyber, banqueTechniqueData, quizData } from '@/data/quizData';
import { casPratiques } from '@/data/casesData';

// Calculé au build (composant serveur) : la banque de questions n'est pas envoyée au navigateur ici.
const nbQuestions = quizData.length;
const nbCas = casPratiques.length;

const competencesData = Array.from(new Set(banqueTechniqueData.map((q) => q.competence)));
const competencesCyber = Array.from(new Set(banqueTechniqueCyber.map((q) => q.competence)));

export default function Accueil() {
  return (
    <>
      <DefiBanner />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <BanknotePattern />
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary)_0_60%,var(--accent)_60%_75%,var(--danger)_75%_100%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <Badge ton="accent" className="mb-4">
              <Sparkles aria-hidden className="size-3.5" /> Examen blanc gratuit · Édition 2026
            </Badge>
            <h1 className="text-balance text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Prépare le recrutement BCC en <span className="text-primary-strong">Data</span> &amp;{' '}
              <span className="text-danger">Cybersécurité</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Un examen blanc chronométré dans les conditions du test : {nbQuestions} questions corrigées et expliquées,
              {` ${nbCas}`} cas pratiques immersifs et la culture BCC à jour. Chaque simulation tire de nouvelles
              questions.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {[
                { i: TimerIcon, t: '30 min de QCM + 20 min de cas' },
                { i: Repeat, t: 'Tirage différent à chaque fois' },
                { i: BookOpenCheck, t: 'Chaque réponse expliquée' },
              ].map(({ i: I, t }) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-ink shadow-soft">
                  <I aria-hidden className="size-4 text-primary-strong" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#inscription" className="inline-flex h-13 items-center gap-2 rounded-xl bg-primary-strong px-6 font-semibold text-on-primary shadow-soft transition hover:brightness-110">
                Lancer ma simulation
              </a>
              <a href="#methode" className="inline-flex h-13 items-center rounded-xl px-4 font-semibold text-ink hover:bg-surface-2">
                Voir la méthode
              </a>
            </div>
          </div>

          <div className="anim-fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Card padding="none" className="overflow-hidden">
              <div className="bg-primary-soft px-5 pt-5">
                <NetworkGraph className="h-32 w-full" />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-strong">Filière</p>
                <h2 className="mt-1 text-lg font-bold text-ink">Data Analyse</h2>
                <p className="mt-1 text-sm text-muted">{banqueTechniqueData.length} questions techniques · {competencesData.length} compétences</p>
              </div>
            </Card>
            <Card padding="none" className="overflow-hidden">
              <div className="bg-danger-soft px-5 pt-5">
                <ShieldPulse className="h-32 w-full" />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-danger">Filière</p>
                <h2 className="mt-1 text-lg font-bold text-ink">Cybersécurité</h2>
                <p className="mt-1 text-sm text-muted">{banqueTechniqueCyber.length} questions techniques · {competencesCyber.length} compétences</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* INSCRIPTION */}
      <section id="inscription" className="scroll-mt-28 border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Stepper courante={1} />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Crée ton espace candidat</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Trois informations suffisent pour personnaliser ta simulation et suivre ta progression. Tout est stocké
              localement dans ton navigateur.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-surface-2 p-4 text-sm leading-relaxed text-muted">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <Landmark aria-hidden className="size-4" /> Important
              </p>
              <p className="mt-1.5">
                Ce simulateur est un outil d&apos;entraînement indépendant. Il ne transmet <strong className="text-ink">rien</strong> à la
                Banque Centrale du Congo et ne remplace pas ta candidature officielle, qui se fait uniquement sur{' '}
                <a href={bccFacts.siteOfficiel} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-strong underline underline-offset-2">
                  bcc.cd
                </a>
                .
              </p>
            </div>
          </div>
          <Card padding="lg" className="shadow-lift">
            <InscriptionBloc />
          </Card>
        </div>
      </section>

      {/* MÉTHODE */}
      <section id="methode" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <Badge ton="primaire">
              <Target aria-hidden className="size-3.5" /> La méthode des 5 simulations
            </Badge>
            <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Passe l&apos;examen blanc au moins 5 fois : c&apos;est là que tout se joue
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Chaque tirage privilégie les questions que tu n&apos;as jamais vues. En 5 simulations, tu couvres
              l&apos;essentiel du programme, tu repères tes points faibles et tu automatises la gestion du temps.
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {[
              { t: 'Diagnostic', d: 'Première simulation à froid : tu mesures ton niveau réel.' },
              { t: 'Corriger', d: 'Lis chaque explication, surtout « pourquoi les autres sont fausses ».' },
              { t: 'Cibler', d: 'Le mode Entraînement travaille tes 2 compétences les plus faibles.' },
              { t: 'Accélérer', d: 'Vise moins d’une minute par question, sans sacrifier la justesse.' },
              { t: 'Confirmer', d: 'À la 5ᵉ simulation, vise ≥ 14/20 de façon stable.' },
            ].map((e, i) => (
              <Reveal key={e.t} delai={i * 0.06}>
                <Card className="h-full">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft font-mono text-sm font-bold text-primary-strong">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold text-ink">{e.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{e.d}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { v: '12', l: 'questions techniques de ta filière', i: BrainCircuit },
              { v: `${banqueCultureBcc.length > 0 ? 6 : 0}`, l: 'questions de culture BCC', i: Landmark },
              { v: '6', l: 'questions d’aptitudes logiques', i: CheckCircle2 },
            ].map(({ v, l, i: I }) => (
              <div key={l} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                <I aria-hidden className="size-6 text-primary-strong" />
                <p className="text-sm text-muted">
                  <span className="mr-1 font-mono text-2xl font-bold text-ink">{v}</span> {l}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            + 2 cas pratiques immersifs de ta filière. Banques : {banqueTechniqueData.length} Data, {banqueTechniqueCyber.length} Cyber,
            {` ${banqueCultureBcc.length}`} culture BCC, {banqueAptitudesLogiques.length} logique.
          </p>
        </div>
      </section>

      {/* RECRUTEMENT 2026 */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <Badge ton="neutre">
              <CalendarDays aria-hidden className="size-3.5" /> Recrutement 2026
            </Badge>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Ce qu&apos;on sait du dernier recrutement</h2>
            <p className="mt-3 max-w-2xl text-muted">
              {recrutement2026.periode}. {recrutement2026.note}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Reveal>
              <Card className="h-full">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <Users aria-hidden className="size-4 text-primary-strong" /> Domaines recherchés
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {recrutement2026.domaines.map((d) => (
                    <li key={d}>
                      <Badge ton={d === 'Cybersécurité' || d === 'Analyse des données' ? 'primaire' : 'neutre'}>{d}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delai={0.06}>
              <Card className="h-full">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <CheckCircle2 aria-hidden className="size-4 text-success" /> Conditions
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {recrutement2026.conditions.map((c) => (
                    <li key={c} className="flex gap-2">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-success" /> {c}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delai={0.12}>
              <Card className="h-full">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <FileClock aria-hidden className="size-4 text-danger" /> Étapes du processus
                </h3>
                <ol className="mt-3 space-y-2.5">
                  {recrutement2026.etapes.map((e, i) => (
                    <li key={e} className="flex items-start gap-3 text-sm">
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${i === 2 ? 'bg-accent text-on-accent' : 'bg-surface-2 text-muted'}`}>
                        {i + 1}
                      </span>
                      <span className={i === 2 ? 'font-semibold text-ink' : 'text-muted'}>
                        {e}
                        {i === 2 ? <span className="block text-xs font-normal text-muted">← ce simulateur t&apos;y prépare</span> : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
            </Reveal>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            Sources : {recrutement2026.source}. Pour l&apos;information officielle :
            <a href={bccFacts.siteOfficiel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary-strong hover:underline">
              bcc.cd <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </p>
        </div>
      </section>

      {/* CULTURE BCC EN INFOGRAPHIES */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <Badge ton="accent">
              <Landmark aria-hidden className="size-3.5" /> Culture BCC en 2 infographies
            </Badge>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Les repères à connaître avant le test</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <Card padding="lg" className="h-full">
                <h3 className="font-semibold text-ink">Taux directeur 2026 : un cycle d&apos;assouplissement</h3>
                <p className="mt-1 text-sm text-muted">Décisions du Comité de Politique Monétaire (CPM).</p>
                <div className="mt-5">
                  <PolicyRateTimeline />
                </div>
              </Card>
            </Reveal>
            <Reveal delai={0.08}>
              <Card padding="lg" className="h-full">
                <h3 className="font-semibold text-ink">Du paiement au règlement</h3>
                <p className="mt-1 text-sm text-muted">Le parcours d&apos;une transaction électronique.</p>
                <div className="mt-5">
                  <PaymentFlowInfographic vertical />
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
