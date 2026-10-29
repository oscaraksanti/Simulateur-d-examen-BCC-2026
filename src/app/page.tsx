import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { BanknotePattern } from '@/components/illustrations/BanknotePattern';
import { PaymentFlowInfographic } from '@/components/illustrations/PaymentFlowInfographic';
import { PolicyRateTimeline } from '@/components/illustrations/PolicyRateTimeline';
import { DefiBanner, InscriptionBloc } from '@/components/onboarding/InscriptionBloc';
import { HeroMockup } from '@/components/landing/HeroMockup';
import { SkillsMarquee } from '@/components/landing/SkillsMarquee';
import { Bento } from '@/components/landing/Bento';
import { TryQuestion } from '@/components/landing/TryQuestion';
import { LiveStats } from '@/components/landing/LiveStats';
import { CountUp } from '@/components/landing/CountUp';
import { Reveal } from '@/components/ui/Reveal';
import { bccFacts, recrutement2026 } from '@/data/bccFacts';
import { banqueCultureBcc, banqueTechniqueCyber, banqueTechniqueData, quizData } from '@/data/quizData';
import { casPratiques } from '@/data/casesData';
import { OSCAR } from '@/data/resources';

// Calculé au build (composant serveur) : seule la question d'essai est envoyée au navigateur.
const nbQuestions = quizData.length;
const nbCas = casPratiques.length;
const nbCompetences = new Set(quizData.map((q) => q.competence)).size;
const questionEssai = banqueCultureBcc.find((q) => q.id === 'BCC-001') ?? banqueCultureBcc[0];

function Surtitre({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-primary-strong">{children}</p>;
}

function TitreSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl ${className}`}>{children}</h2>;
}

const etapes = [
  {
    n: '01',
    titre: 'Crée ton espace',
    texte: 'Nom, e-mail, filière. Trente secondes, et ta progression est suivie d’une simulation à l’autre.',
  },
  {
    n: '02',
    titre: 'Passe l’examen blanc',
    texte: '24 questions en 30 minutes, puis 2 cas pratiques en 20 minutes. Sans correction pendant l’épreuve, comme le jour J.',
  },
  {
    n: '03',
    titre: 'Comprends chaque erreur',
    texte: 'Note sur 20, radar de compétences, correction détaillée et priorités de révision. Recommence avec de nouvelles questions.',
  },
];

const faq = [
  {
    q: 'Est-ce un site officiel de la Banque Centrale du Congo ?',
    r: 'Non. C’est un outil de préparation indépendant, conçu par Oscar Aksanti (formations4data). Il ne transmet rien à la BCC et ne remplace pas ta candidature, qui se fait uniquement sur bcc.cd.',
  },
  {
    q: 'Les questions sont-elles celles du vrai test ?',
    r: 'Personne ne connaît à l’avance les questions officielles. Les questions sont originales et couvrent les compétences des domaines recrutés : data, cybersécurité, culture de la banque centrale et aptitudes logiques. Les faits sur la BCC sont sourcés et datés.',
  },
  {
    q: 'Combien de fois dois-je passer l’examen blanc ?',
    r: 'Au moins cinq fois. Chaque simulation tire en priorité des questions que tu n’as jamais vues : en cinq passages, tu couvres l’essentiel du programme et tu stabilises ta gestion du temps.',
  },
  {
    q: 'Comment la note sur 20 est-elle calculée ?',
    r: 'Le QCM compte pour 12 points (24 questions, sans point négatif) et les cas pratiques pour 8 points. La note est arrondie au demi-point.',
  },
  {
    q: 'Est-ce vraiment gratuit ?',
    r: 'Oui, entièrement. Le projet est open source. Si tu veux aller plus loin, Oscar propose des tutoriels gratuits sur YouTube et un accompagnement sur WhatsApp.',
  },
  {
    q: 'Que deviennent mes données ?',
    r: 'Elles servent à suivre ta progression et à améliorer le simulateur. Elles ne sont jamais transmises à la BCC ni vendues, et tu peux demander leur suppression à tout moment.',
  },
];

export default function Accueil() {
  return (
    <>
      <DefiBanner />

      {/* ================================================================ HERO */}
      <section className="relative overflow-hidden bg-surface">
        <div aria-hidden className="fond-grille pointer-events-none absolute inset-0 opacity-60" />
        <BanknotePattern opacite={0.035} />
        <div className="relative mx-auto grid grid-cols-1 max-w-6xl items-center gap-16 px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-32">
          <div>
            <Link
              href="/fiches/"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-[13px] text-muted shadow-soft transition hover:border-ink/20 hover:text-ink"
            >
              <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-bg">2026</span>
              Recrutement informatique de la BCC
              <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[3.6rem] xl:text-[4.25rem]">
              Arrive au test de la BCC en l&apos;ayant déjà passé cinq fois.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
              L&apos;examen blanc en <span className="text-ink">Data Analyse</span> et en <span className="text-ink">Cybersécurité</span>,
              chronométré et corrigé question par question. Gratuit, conçu pour les candidats congolais.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#commencer"
                className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-ink px-6 text-[15px] font-semibold text-bg shadow-lift transition hover:bg-ink/85"
              >
                Commencer gratuitement
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#essayer"
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-border bg-surface px-6 text-[15px] font-semibold text-ink transition hover:border-ink/30"
              >
                Essayer une question
              </Link>
            </div>
            <div className="mt-9 space-y-3">
              <LiveStats />
              <p className="text-sm text-muted">
                {nbQuestions} questions · {nbCas} cas pratiques · {nbCompetences} compétences · 100 % gratuit
              </p>
            </div>
          </div>
          <div className="anim-fade-up lg:pl-6">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ================================================================ COMPÉTENCES */}
      <section className="border-y border-border bg-bg py-14">
        <p className="mb-8 px-4 text-center text-sm text-muted">Toutes les compétences évaluées, couvertes de bout en bout</p>
        <SkillsMarquee />
      </section>

      {/* ================================================================ COMMENT ÇA MARCHE */}
      <section id="methode" className="scroll-mt-24 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <Reveal className="max-w-2xl">
            <Surtitre>La méthode</Surtitre>
            <TitreSection>Trois étapes. Cinq simulations. Zéro surprise le jour J.</TitreSection>
          </Reveal>
          <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
            {etapes.map((e, i) => (
              <li key={e.n} className="bg-surface">
                <Reveal delai={i * 0.08} className="flex h-full flex-col p-8 sm:p-10">
                  <span className="font-mono text-sm text-muted">{e.n}</span>
                  <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-ink">{e.titre}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{e.texte}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================================================================ FONCTIONNALITÉS */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <Reveal className="max-w-2xl">
            <Surtitre>Le simulateur</Surtitre>
            <TitreSection>Conçu pour apprendre de chaque erreur.</TitreSection>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Pas un simple quiz : une préparation complète, du QCM technique aux mises en situation, avec un suivi de ta progression.
            </p>
          </Reveal>
          <div className="mt-14">
            <Bento nbQuestions={nbQuestions} />
          </div>
        </div>
      </section>

      {/* ================================================================ ESSAYER */}
      <section id="essayer" className="scroll-mt-24 bg-surface">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <Surtitre>Essaie maintenant</Surtitre>
            <TitreSection>Une question. Une explication. Tu jugeras par toi-même.</TitreSection>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Voici une vraie question de la section culture BCC. Réponds, et découvre le niveau de détail de chaque correction.
            </p>
          </Reveal>
          <Reveal delai={0.08}>
            <TryQuestion question={questionEssai} />
          </Reveal>
        </div>
      </section>

      {/* ================================================================ CHIFFRES */}
      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#8cc2ff]">Le contenu</p>
            <h2 className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
              Rédigé au niveau d&apos;un recrutement de banque centrale.
            </h2>
          </Reveal>
          <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: nbQuestions, l: 'questions originales', d: `${banqueTechniqueData.length} Data, ${banqueTechniqueCyber.length} Cyber, culture BCC, logique` },
              { v: nbCas, l: 'cas pratiques', d: 'DDoS, ransomware, phishing, fraude, change, PCI-DSS…' },
              { v: nbCompetences, l: 'compétences suivies', d: 'Du SQL à la réponse à incident NIST' },
              { v: nbQuestions * 3, l: 'réfutations rédigées', d: 'Chaque mauvaise réponse est expliquée' },
            ].map((s, i) => (
              <li key={s.l} className="bg-[#0b1220]">
                <Reveal delai={i * 0.06} className="h-full p-8">
                  <p className="text-5xl font-semibold tracking-[-0.04em]"><CountUp valeur={s.v} /></p>
                  <p className="mt-3 font-medium">{s.l}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{s.d}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================================================================ CULTURE BCC */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <Reveal className="max-w-2xl">
            <Surtitre>Culture BCC</Surtitre>
            <TitreSection>Les repères à connaître avant le test.</TitreSection>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Politique monétaire, systèmes de paiement, recrutement 2026 : des faits sourcés et datés, rien d&apos;inventé.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Reveal className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <h3 className="font-semibold tracking-[-0.01em] text-ink">Taux directeur 2026</h3>
              <p className="mt-1 text-sm text-muted">Décisions du Comité de Politique Monétaire.</p>
              <div className="mt-6"><PolicyRateTimeline /></div>
            </Reveal>
            <Reveal delai={0.06} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <h3 className="font-semibold tracking-[-0.01em] text-ink">Du paiement au règlement</h3>
              <p className="mt-1 text-sm text-muted">Le parcours d&apos;une transaction électronique.</p>
              <div className="mt-6"><PaymentFlowInfographic vertical /></div>
            </Reveal>
          </div>

          <Reveal className="mt-4 rounded-3xl border border-border bg-bg p-6 sm:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="font-semibold tracking-[-0.01em] text-ink">Recrutement 2026 : le processus</h3>
                <p className="mt-1 text-sm text-muted">{recrutement2026.periode}.</p>
              </div>
              <a href={bccFacts.siteOfficiel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline">
                Information officielle sur bcc.cd <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
            <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-5">
              {recrutement2026.etapes.map((e, i) => (
                <li key={e} className="relative">
                  <div className="flex items-center gap-3">
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${i === 2 ? 'bg-ink text-bg' : 'border border-border bg-surface text-muted'}`}>
                      {i + 1}
                    </span>
                    {i < recrutement2026.etapes.length - 1 ? <span aria-hidden className="hidden h-px flex-1 bg-border sm:block" /> : null}
                  </div>
                  <p className={`mt-3 text-sm leading-snug ${i === 2 ? 'font-semibold text-ink' : 'text-muted'}`}>{e}</p>
                  {i === 2 ? <p className="mt-1 text-xs text-primary-strong">Ce que tu prépares ici</p> : null}
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              {recrutement2026.domaines.map((d) => (
                <span key={d} className={`rounded-full border px-3 py-1 text-[13px] ${d === 'Cybersécurité' || d === 'Analyse des données' ? 'border-ink bg-ink text-bg' : 'border-border text-muted'}`}>
                  {d}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">Sources : {recrutement2026.source}. {bccFacts.avertissement}</p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ INSCRIPTION */}
      <section id="commencer" className="scroll-mt-20 border-y border-border bg-bg">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Surtitre>Commencer</Surtitre>
            <TitreSection>Ton espace de préparation, en 30 secondes.</TitreSection>
            <ul className="mt-8 space-y-4 text-[15px] text-muted">
              {[
                'Examens blancs illimités, avec de nouvelles questions à chaque fois',
                'Correction détaillée et priorités de révision personnalisées',
                'Suivi de ta progression jusqu’au jour J',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted">
              Ce n&apos;est pas une candidature. Pour postuler, utilise uniquement le site officiel{' '}
              <a href={bccFacts.siteOfficiel} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-2">bcc.cd</a>.
            </p>
          </Reveal>
          <Reveal delai={0.08}>
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-lift sm:p-10">
              <InscriptionBloc />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ FAQ */}
      <section className="bg-surface">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Surtitre>Questions fréquentes</Surtitre>
            <TitreSection>Tout ce qu&apos;il faut savoir.</TitreSection>
            <p className="mt-5 text-muted">
              Une autre question ?{' '}
              <Link href="/avis/" className="font-medium text-ink underline underline-offset-2">Écris-nous</Link>.
            </p>
          </Reveal>
          <Reveal delai={0.06}>
            <div className="divide-y divide-border border-y border-border">
              {faq.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[17px] font-medium tracking-[-0.01em] text-ink [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus aria-hidden className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="-mt-2 pb-6 pr-10 text-[15px] leading-relaxed text-muted">{f.r}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ APPEL FINAL */}
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <BanknotePattern opacite={0.07} />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <h2 className="mx-auto max-w-3xl text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Le jour J se prépare aujourd&apos;hui.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">Première simulation en moins d&apos;une heure. Gratuit, sans engagement.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#commencer" className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#0b1220] transition hover:bg-white/90">
              Commencer maintenant
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={OSCAR.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 px-6 text-[15px] font-semibold text-white transition hover:border-white/40">
              Tutoriels gratuits sur YouTube <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
