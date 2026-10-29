# Simulateur BCC — Prépa Data & Cyber

Examen blanc **gratuit et open source** pour préparer les tests de recrutement de la Banque Centrale du Congo (BCC) dans
les filières **Data Analyse** et **Cybersécurité** : QCM chronométrés corrigés, cas pratiques immersifs, culture BCC
sourcée, mode entraînement et fiches de révision.

> ⚠️ **Outil de préparation indépendant, non affilié à la Banque Centrale du Congo.**
> Les candidatures officielles se font uniquement via le site officiel de la BCC ([bcc.cd](https://www.bcc.cd)).
> Ce simulateur ne transmet aucune donnée à la BCC ni à un serveur : tout reste dans le navigateur du candidat.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Captures](#captures)
- [Installation](#installation)
- [Ajouter des questions](#ajouter-des-questions)
- [Collecte des données avec Supabase](#collecte-des-données-avec-supabase)
- [Vidéo promo (HyperFrames)](#vidéo-promo-hyperframes)
- [Déploiement sur Vercel (3 étapes)](#déploiement-sur-vercel-3-étapes)
- [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
- [Architecture](#architecture)
- [Contribuer](#contribuer)
- [Licence et crédits](#licence-et-crédits)

## Fonctionnalités

| Écran | Contenu |
|---|---|
| **1. Accueil + inscription** (`/`) | Hero, méthode des 5 simulations, ce qu'on sait du recrutement 2026, infographies (taux directeur 2026, chaîne des paiements), formulaire local (nom, e-mail, filière). |
| **2. Examen** (`/examen`) | Tableau de bord + QCM de 24 questions en 30 min : 12 techniques de la filière, 6 culture BCC, 6 aptitudes logiques. Navigateur de questions, « à revoir », raccourcis `A`–`D` et `←` `→`, soumission automatique à 0. |
| **3. Cas pratiques** (`/cas-pratiques`) | 2 cas immersifs de la filière en 20 min : briefing « salle de crise », tableaux triables, logs surlignés, choix pondérés, glisser-déposer accessible, feedback par étape et corrigé expert. |
| **4. Résultats** (`/resultats`) | Note /20 animée + mention, barres par section, radar des compétences (SVG maison), courbe de progression, correction détaillée (pourquoi la bonne réponse, pourquoi pas les autres), ressources d'Oscar Aksanti, partage viral et carte de score téléchargeable (1080×1350). |
| **Entraînement** (`/entrainement`) | Séries ciblées par filière, section et compétence, correction immédiate. Lien direct depuis les « priorités de révision ». |
| **Fiches** (`/fiches`) | Mémo culture BCC sourcé, formules data, repères cyber, méthode pour le jour J, alerte anti-arnaque. |
| **Avis** (`/avis`) | Note de satisfaction, fonctionnalités souhaitées, message libre (aussi en fin de résultats). |
| **Confidentialité** (`/confidentialite`) | Données collectées, finalités, droits des candidats. |
| **Administration** (`/admin`, privé) | Inscrits, simulations, notes, compétences faibles, souhaits, avis, export CSV, suppression sur demande. |

- **Production** : [sys-bcc-26.vercel.app](https://sys-bcc-26.vercel.app) (Vercel) et GitHub Pages.
- **Banques** : 185 questions (60 Data, 60 Cyber, 25 culture BCC, 40 logique) et 8 cas pratiques (4 par filière).
- **Tirage intelligent** : chaque simulation privilégie les questions et cas jamais vus, et alterne les compétences.
- **Objectif 5 simulations** : suivi de progression et historique local (courbe des notes).
- **Notation** : `note /20 = (QCM / 24) × 12 + (cas / max cas) × 8`, arrondie au 0,5. Pas de points négatifs.
- **Viralité** : WhatsApp, Web Share API, LinkedIn, Facebook, X, Telegram, « Défier un ami » (`?defi=14.5&f=data`), paramètre `ref` mémorisé.
- **Qualité** : TypeScript strict, ESLint, tests Vitest, export 100 % statique, thème clair/sombre, accessibilité clavier, `prefers-reduced-motion`.

## Captures

| Accueil | Examen | Résultats |
|---|---|---|
| _capture à venir_ | _capture à venir_ | _capture à venir_ |

## Installation

Prérequis : Node.js 20+ (LTS recommandée) et npm.

```bash
git clone https://github.com/oscaraksanti/Simulateur-d-examen-BCC-2026.git
cd Simulateur-d-examen-BCC-2026
npm install
cp .env.example .env.local   # puis renseigne NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Génère `public/og-image.png` (prebuild) puis exporte le site statique dans `out/` |
| `npm start` | Sert le dossier `out/` en local |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Tests Vitest (moteur de score, tirage, partage, intégrité des banques) |

## Ajouter des questions

Toutes les questions sont dans [`src/data/quizData.ts`](src/data/quizData.ts), organisées en 4 banques
(Technique Data, Technique Cyber, Culture BCC, Aptitudes logiques). Format :

```ts
{
  id: 'DATA-SQL-011',                // préfixe de la compétence + numéro suivant, UNIQUE
  section: 'technique',              // 'technique' | 'culture_bcc' | 'logique'
  filiere: 'data',                   // 'data' | 'cyber' pour la technique, 'commune' sinon
  competence: 'SQL',                 // réutilise une compétence existante (chaîne identique)
  difficulte: 'moyen',               // 'facile' | 'moyen' | 'difficile'
  enonce: "Énoncé clair, sans ambiguïté. Le `code inline` est stylé automatiquement.",
  extrait: { langage: 'sql', contenu: 'SELECT …' },   // optionnel : sql | python | log | texte
  options: [
    { id: 'A', texte: '…' }, { id: 'B', texte: '…' },
    { id: 'C', texte: '…' }, { id: 'D', texte: '…' },
  ],
  bonneReponse: 'B',
  explication: "2 à 4 phrases : pourquoi B est juste.",
  pourquoiPas: { A: '…', C: '…', D: '…' },  // une réfutation par mauvaise option (obligatoire)
  aRetenir: "La règle d'or à mémoriser.",
}
```

**Règle de sourçage (culture BCC)** : une question `culture_bcc` ne peut s'appuyer **que** sur un fait présent dans
[`src/data/bccFacts.ts`](src/data/bccFacts.ts) et doit porter `source` et `verifieLe`. Pour un fait nouveau, ajoute-le
d'abord dans `bccFacts.ts` avec sa source et sa date de vérification. N'invente jamais un chiffre, une date ou un nom.

Le test [`src/__tests__/data.test.ts`](src/__tests__/data.test.ts) vérifie automatiquement : ids uniques, 4 options A–D,
`bonneReponse` valide, réfutation des 3 mauvaises options, `source`/`verifieLe` pour la culture BCC, volumes minimum et
cohérence des cas pratiques (`pointsMax`, permutations d'ordre). Lance `npm test` avant chaque PR.

Les cas pratiques sont dans [`src/data/casesData.ts`](src/data/casesData.ts) (scénarios fictifs, 10 à 20 points chacun).

## Collecte des données avec Supabase

Sans configuration, tout reste dans le navigateur. Avec Supabase, le simulateur enregistre les **inscriptions**
(nom, e-mail, WhatsApp facultatif, filière, consentements), les **résultats** de chaque simulation et les **avis**,
et tu les consultes dans un **tableau de bord privé** (`/admin`).

Sécurité : RLS activée sur toutes les tables, aucun accès direct pour le public (écritures uniquement via des fonctions
SQL validées), lecture réservée aux comptes listés dans `public.admins`. Les envois passent par une file d'attente
locale et sont retentés si le réseau coupe.

1. Crée un projet sur [supabase.com](https://supabase.com) (région la plus proche de tes utilisateurs, ex. Europe).
2. **SQL Editor** → colle et exécute [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
3. **Authentication → Users → Add user** : crée ton compte administrateur (e-mail + mot de passe).
   Puis, dans le SQL Editor :
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'ton-email@exemple.com';
   ```
4. **Authentication → Providers → Email** : désactive « Allow new users to sign up » (seul l'admin a un compte).
5. **Project Settings → API** : copie `Project URL` et la `Publishable key` (ou l'ancienne `anon key`), puis ajoute-les :
   - Vercel : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Settings → Environment Variables), puis redéploie ;
   - GitHub Pages : mêmes noms dans Settings → Secrets and variables → Actions → **Variables**.
6. Ouvre `/admin` et connecte-toi.

Ces deux valeurs sont publiques par nature (elles sont lisibles dans le navigateur) : la protection repose sur la RLS.
Ne mets **jamais** la clé `service_role` / `secret` dans le front.

## Vidéo promo (HyperFrames)

Le dossier [`video/`](video/) contient une vidéo verticale de 25 s (1080×1920) composée en HTML avec
[HyperFrames](https://hyperframes.heygen.com) : accroche, vraie question du simulateur, explication, note, appel à l'action.
Le rendu est publié dans `public/promo/` et proposé au téléchargement sur la page de résultats (statut WhatsApp).

```bash
cd video
npx hyperframes preview      # éditer dans le Studio
npx hyperframes render --quality delivery -o renders/simulateur-bcc-promo-9x16.mp4
```

L'adresse affichée en fin de vidéo est la variable `site` de `video/index.html`.

## Déploiement sur Vercel (3 étapes)

Le projet Vercel `sys-bcc-26` est déjà relié à ce dépôt : chaque push sur `main` redéploie
[sys-bcc-26.vercel.app](https://sys-bcc-26.vercel.app). Pour une nouvelle installation :

1. Importe le dépôt sur [vercel.com/new](https://vercel.com/new) (framework détecté : Next.js).
2. Ajoute la variable d'environnement `NEXT_PUBLIC_SITE_URL` (ex. `https://simulateur-bcc.vercel.app`). Laisse
   `NEXT_PUBLIC_BASE_PATH` vide.
3. Déploie. En ligne de commande :

```bash
npx vercel --prod
```

`@vercel/analytics` (sans cookie) ne s'active que sur Vercel.

## Déploiement sur GitHub Pages

Le workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) se lance à chaque push sur `main` :
`npm ci` → lint → typecheck → tests → build → publication de `out/`.

1. Dans **Settings → Pages**, choisis **Source : GitHub Actions**.
2. (Optionnel) Dans **Settings → Variables → Actions**, définis `NEXT_PUBLIC_SITE_URL` si tu utilises un domaine
   personnalisé. Par défaut : `https://<utilisateur>.github.io/<dépôt>`.
3. Pousse sur `main`. `NEXT_PUBLIC_BASE_PATH` est automatiquement fixé à `/<nom-du-dépôt>`.

## Architecture

```
src/
├── app/            # Routes : /, /examen, /cas-pratiques, /resultats, /entrainement, /fiches, /avis, /confidentialite, /admin
├── components/     # layout, ui, landing, onboarding, exam, cases, results, training, feedback, admin, illustrations
├── context/        # ExamContext (useReducer + localStorage) et garde de navigation
├── data/           # quizData, casesData, bccFacts (source unique de vérité), resources
├── lib/            # scoring, sampling (tirage seedé), share, storage, remote (Supabase), types
└── __tests__/      # Vitest
scripts/generate-og.ts    # og-image.png 1200×630 (satori + resvg, police locale)
supabase/migrations/      # schéma, RLS, fonctions (testé sur Postgres 16)
video/                    # vidéo promo HyperFrames (SPEC.md, REVIEW.md, compositions/)
```

Site 100 % statique. Les données du candidat sont gardées dans `localStorage` et, si Supabase est configuré,
synchronisées via `src/lib/remote.ts` (file d'attente hors ligne, fonctions SQL validées).

## Contribuer

Les contributions sont les bienvenues, en particulier **de nouvelles questions et de nouveaux cas pratiques** :

1. Fork, puis crée une branche (`feat/questions-sql-fenetres`).
2. Ajoute tes questions en respectant le format ci-dessus (explication + `pourquoiPas` + `aRetenir`).
3. Pour la culture BCC : **source obligatoire** et fait ajouté dans `bccFacts.ts`.
4. Vérifie : `npm run lint && npm run typecheck && npm test && npm run build`.
5. Ouvre une pull request en décrivant tes sources.

Signale toute erreur factuelle via une issue : l'exactitude prime sur le volume.

## Licence et crédits

Licence [MIT](LICENSE).

**Conçu par Oscar Aksanti — formations4data**
- YouTube : [youtube.com/@oscaraksanti](https://youtube.com/@oscaraksanti)
- WhatsApp : [wa.me/243971601855](https://wa.me/243971601855)

Faits BCC vérifiés au 29/10/2026 : les taux et chiffres évoluent, vérifie toujours sur [bcc.cd](https://www.bcc.cd).
