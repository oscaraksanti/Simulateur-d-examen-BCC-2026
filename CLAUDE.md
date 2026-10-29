# CLAUDE.md — Simulateur BCC (Prépa Data & Cyber)

Document de passation pour toute IA ou développeur qui reprend le projet. À mettre à jour à chaque fin de session.

## 1. Le projet en bref

Application web **open source, 100 % statique**, en **français**, qui aide les candidats congolais à préparer les tests de
recrutement informatique de la Banque Centrale du Congo (BCC), filières **Data Analyse** et **Cybersécurité**.
Dépôt : https://github.com/oscaraksanti/Simulateur-d-examen-BCC-2026 — auteur : Oscar Aksanti (formations4data).

### Règles non négociables (à respecter dans toute évolution)
1. **Jamais déguisé en officiel** : pas de logo/sceau/charte/photos BCC, rien téléchargé ni lié depuis bcc.cd hormis le
   lien texte vers le site officiel. Bandeau permanent `DisclaimerBanner` (dans `layout.tsx`) obligatoire. Aucun formulaire
   ne doit ressembler à une candidature officielle. Les couleurs viennent du drapeau RDC, pas de la charte BCC.
2. **Zéro backend** : contenu codé en dur dans `src/data/`, données utilisateur dans `localStorage` via `src/lib/storage.ts`
   (try/catch partout). Aucun appel réseau sortant hormis les liens cliqués (et `@vercel/analytics`, actif seulement sur Vercel).
3. **Français partout** (UI, contenu, commentaires, README). Tutoiement du candidat.
4. **TypeScript strict, aucun `any`, zéro erreur ESLint**, `npm run build` doit passer.
5. **Exactitude des faits BCC** : les questions `culture_bcc` ne s'appuient QUE sur `src/data/bccFacts.ts` (source unique
   de vérité, faits vérifiés au 29/10/2026). Chaque question culture porte `source` + `verifieLe`. Ne jamais inventer un
   chiffre, une date, un nom. Les scénarios des cas pratiques sont fictifs (« Banque Alpha », IP de documentation, domaines `.example`).

## 2. Stack

- Next.js **16.4** (App Router, Turbopack) + React **19.3** + TypeScript strict — `output: 'export'`, `trailingSlash: true`
- Tailwind CSS **v4** (loader `@tailwindcss/turbopack`, tokens CSS dans `globals.css` + `@theme inline`)
- framer-motion (animations sobres, `useReducedMotion` respecté), lucide-react **v1** (⚠️ pas d'icônes de marques :
  `Linkedin`, `Youtube`… n'existent plus), html-to-image (carte de score, import dynamique)
- Vitest 5 + jsdom + Testing Library ; satori + @resvg/resvg-js + @fontsource/inter (génération de l'OG image)
- Polices : Inter (`--font-inter`) et JetBrains Mono (`--font-jetbrains`) via `next/font/google`
- `package.json` a `"type": "module"`. Docs Next embarquées : `node_modules/next/dist/docs/`.

## 3. Commandes

```bash
npm run dev          # http://localhost:3000
npm run lint         # ESLint (doit être vide)
npm run typecheck    # tsc --noEmit
npm test             # Vitest : 228 tests (scoring, sampling, share, intégrité des données)
npm run build        # prebuild → scripts/generate-og.ts → next build → out/
npm start            # sert out/ (npx serve)
```
Prévisualisation locale du build : `python3 -m http.server 4173 --directory out` (config dans `.claude/launch.json`, ignoré par git).

Variables : `NEXT_PUBLIC_SITE_URL` (URL publique, utilisée dans les textes de partage et `metadataBase`),
`NEXT_PUBLIC_BASE_PATH` (vide sur Vercel, `/Simulateur-d-examen-BCC-2026` sur GitHub Pages — fixé par le workflow).

## 4. Architecture

```
src/app/
  layout.tsx            polices, SEO/OG FR, script anti-flash du thème, ExamProvider, ToastProvider, Disclaimer, Header, Footer
  page.tsx              Écran 1 : hero, inscription (InscriptionBloc), méthode 5 simulations, recrutement 2026, infographies
  examen/page.tsx       → components/exam/ExamSession (dashboard puis QCM)
  cas-pratiques/page.tsx→ components/cases/CasesSession
  resultats/page.tsx    → components/results/ResultsView
  entrainement/page.tsx → components/training/TrainingSession  (BONUS : séries par compétence, correction immédiate)
  fiches/page.tsx       BONUS : mémo culture BCC, formules data, repères cyber, méthode jour J, alerte arnaques
  not-found.tsx
src/context/
  ExamContext.tsx       useReducer + persistance localStorage. Ne stocke QUE des ids (les banques sont importées par les
                        pages qui en ont besoin, pour alléger le bundle de l'accueil). Constantes DUREE_QCM_MS (30 min),
                        DUREE_CAS_MS (20 min), OBJECTIF_SIMULATIONS (5). etapeAtteinte() pour le Stepper.
  useGarde.ts           garde de navigation client : 'candidat' | 'qcm_termine' | 'resultat' → router.replace
src/lib/
  types.ts              tous les types (QcmQuestion avec pourquoiPas + aRetenir ; CasPratique avec role/heure/enjeu ; Tentative…)
  scoring.ts            fonctions pures : note = (qcm/qcmMax)×12 + (cas/casMax)×8 arrondie au 0,5 ; étape ordre =
                        pointsMax × bien placés/total ; parSection, parCompetence (+ 'Cas pratiques'), mention, competencesFaibles
  sampling.ts           PRNG mulberry32 seedé (hash FNV-1a), tirage 12/6/6 sans doublon, priorité aux questions JAMAIS VUES,
                        round-robin des compétences ; tirerCas (2 cas, non vus d'abord)
  share.ts              textes WhatsApp / défi / message Oscar, liens wa.me & réseaux, lireDefi(?defi=&f=), urlSite()
  storage.ts            lire/ecrire/supprimer avec préfixe 'simbcc:' ; clés : candidat, etat-v1, historique-v1,
                        questions-vues, cas-vus, ref, theme
src/data/
  bccFacts.ts           SOURCE UNIQUE DE VÉRITÉ (faits, tauxDirecteur2026, fluxPaiement, recrutement2026)
  quizData.ts           185 questions : banqueTechniqueData (60), banqueTechniqueCyber (60), banqueCultureBcc (25),
                        banqueAptitudesLogiques (40) ; questionParId()
  casesData.ts          8 cas (DATA-CAS-01..04, CYB-CAS-01..04) ; casParId()
  resources.ts          liens Oscar (YouTube @oscaraksanti, WhatsApp 243971601855)
src/components/
  layout/   Header, Footer, DisclaimerBanner, ThemeToggle (système→clair→sombre, data-theme), Stepper, Logo (logo original)
  ui/       Button/ButtonLink, Card, Badge, ProgressBar, Timer (échéance absolue, aria-live aux paliers), RadioCard,
            Modal (focus piégé), Toast, Reveal, CodeBlock (coloration sql/python/log sans dépendance), TexteRiche (`code`)
  onboarding/ RegistrationForm (validation inline), InscriptionBloc (+ DefiBanner, mémorisation de ?ref)
  exam/     ExamSession, ExamDashboard, SectionCard, QuestionCard, QuestionNavigator, ExplanationPanel, libelles
  cases/    CasesSession, CaseBriefing, DataTable (triable), LogViewer (filtre + surlignage IP/HTTP), DecisionStep,
            OrderingStep (Reorder framer-motion + boutons ↑↓), CaseDebrief, format
  results/  ResultsView, ScoreHero (comptage animé), ScoreBreakdown, RadarBySkill (SVG maison), ProgressionChart,
            CorrectionList (filtres erreurs/justes/toutes), ResourcesOscar, ShareCard (1080×1350), ShareButtons
  training/ TrainingSession
  illustrations/ BanknotePattern, NetworkGraph, ShieldPulse, PaymentFlowInfographic (prop vertical), PolicyRateTimeline
scripts/generate-og.ts  public/og-image.png 1200×630 (police locale, ne casse pas le build si l'image existe déjà)
.github/workflows/deploy-pages.yml  lint → typecheck → test → build → Pages
```

## 5. Flux utilisateur

1. `/` inscription (nom, e-mail, filière) → `localStorage` → `/examen/`.
2. `/examen/` : dashboard (sections, conditions, progression X/5, courbe) → « Commencer » tire 24 questions
   (`tirerQuestions` + `lireVus`) → QCM 30 min (raccourcis A–D, ←/→, « à revoir ») → modal de confirmation → `/cas-pratiques/`.
3. `/cas-pratiques/` : écran d'intro → 2 cas, 20 min ; chaque étape se valide puis affiche son feedback ; corrigé expert en fin
   de cas → `calculerResultat` → `terminerCas` (ajoute une `Tentative` à l'historique) → `/resultats/`.
4. `/resultats/` : note, mention, objectif 5 simulations, barres, radar, ressources + priorités (liens vers
   `/entrainement/?competence=…`), correction détaillée, partage, « Refaire » (nouveau tirage) / « Changer de filière ».

Le timer repose sur des timestamps (`debut`) persistés : un rechargement de page ne remet pas le chrono à zéro.

## 6. Contenu (état au 29/10/2026)

| Banque | Volume | Compétences |
|---|---|---|
| Technique Data | 60 | SQL (10), Python & pandas (8), Excel & Power BI (6), Visualisation (6), Statistiques (10), Qualité des données (7), Détection d’anomalies (6), Économie & données monétaires (7) |
| Technique Cyber | 60 | Réseaux (8), Cryptographie (8), Sécurité applicative (OWASP) (7), IAM & contrôle d’accès (7), SIEM & analyse de logs (6), Menaces (7), Gestion d’incident (7), PCI-DSS & EMV (4), PCA & PRA (3), Messagerie financière (SWIFT) (3) |
| Culture BCC | 25 | Cadre légal & institution (6), Gouvernance & actualité (5), Politique monétaire (6), Systèmes de paiement (5), Recrutement 2026 (3) |
| Aptitudes logiques | 40 | Suites numériques, Logique, Pourcentages & intérêts, Lecture de tableaux & graphiques (7 chacune), Raisonnement verbal, Problèmes de rendement (6 chacune) |

- Difficulté ≈ 30 % facile / 50 % moyen / 20 % difficile ; bonnes réponses réparties ~25 % par lettre (testé).
- ⚠️ Les noms de compétences utilisent l'apostrophe typographique `’` (« Détection d’anomalies », « Gestion d’incident »,
  « IAM & contrôle d’accès ») : réutilise la chaîne EXACTE pour qu'une nouvelle question rejoigne la bonne compétence.
- Questions calibrage imposées présentes telles quelles : `BCC-001`, `DATA-SQL-001`, `CYB-IR-001`.
- Calculs vérifiés par script lors de la rédaction (python/node). Toute nouvelle question chiffrée doit l'être aussi.

## 7. Conventions de code

- Composants en PascalCase, identifiants et commentaires en français (`etat`, `reponses`, `filiere`…).
- Couleurs uniquement via tokens (`bg-surface`, `text-ink`, `text-muted`, `bg-primary-strong`, `text-on-primary`,
  `bg-accent-soft`, `text-danger`, `text-success-ink`…). `--primary-strong` pour le texte/boutons (contraste AA), `--primary`
  pour les décorations. Mode sombre : `prefers-color-scheme` + `:root[data-theme='dark'|'light']`.
- Pages = composant serveur qui exporte `metadata` et rend un composant client (`'use client'`).
- Lecture d'URL côté client via `useSyncExternalStore` (pas de `useSearchParams` → pas de Suspense requis à l'export).
- Les tests de données (`src/__tests__/data.test.ts`) sont la barrière qualité : ne jamais les assouplir pour faire passer du contenu.

## 8. Journal des sessions

### Session 1 — 29/10/2026 (création v1)
- Projet initialisé (create-next-app), dépendances, design system, thème clair/sombre.
- Moteur pur (scoring, sampling, share, storage) + 4 fichiers de tests (228 tests verts).
- Contenu rédigé : 185 questions (avec `pourquoiPas` et `aRetenir` pour CHAQUE question) + 8 cas pratiques.
- 4 écrans + 2 bonus (Entraînement, Fiches), partage viral, carte de score, OG image, SEO, README, LICENSE MIT, workflow Pages.
- Vérifié dans le navigateur : inscription → QCM (raccourcis clavier) → cas → résultats ; mobile 360 px sans scroll
  horizontal ; défi `?defi=` ; mode entraînement ; aucune erreur console.
- Ajouts par rapport au cahier des charges initial : réfutation option par option, « à retenir », priorité aux questions non
  vues, historique + courbe de progression, objectif 5 simulations, mode entraînement, fiches de révision et jour J,
  alerte anti-arnaque, page 404.

### Pistes pour la suite
- Remplacer les placeholders de captures du README par de vraies captures.
- Enrichir les banques (objectif : 100+ questions par filière) et ajouter des cas (2 par session de travail).
- Mettre à jour `bccFacts.ts` après chaque CPM (taux directeur) en conservant source + date ; ajuster `VERIFIE_LE`.
- Option : export PDF de la correction ; mode « examen long » (60 questions) ; statistiques anonymes via `ref`.
- Lighthouse non mesuré en CI : à lancer manuellement sur le déploiement (cible ≥ 95).
