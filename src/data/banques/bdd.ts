// Banque technique — filière « Administration des bases de données » (préfixe BDD).
// 60 questions : SQL avancé, modélisation, transactions, index, sauvegardes, haute disponibilité, sécurité, exploitation.
// Contextes fictifs (Banque Alpha, agences de Kinshasa…) ; SGBD cités de façon neutre quand la syntaxe en dépend.
import type { QcmQuestion } from '@/lib/types';

export const banqueTechniqueBdd: QcmQuestion[] = [
  // ───────────────────────────── SQL avancé ─────────────────────────────
  {
    id: 'BDD-SQL-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'facile',
    enonce: "La table `comptes_vip` contient les trois lignes ci-dessous. Quelles valeurs la requête renvoie-t-elle pour Nsimba ?",
    extrait: {
      langage: 'sql',
      contenu: `-- comptes_vip
-- client  | solde
-- Mbuyi   | 500
-- Kalala  | 500
-- Nsimba  | 300

SELECT client,
       RANK()       OVER (ORDER BY solde DESC) AS rg,
       DENSE_RANK() OVER (ORDER BY solde DESC) AS rg_dense
FROM comptes_vip;`,
    },
    options: [
      { id: 'A', texte: 'rg = 2 et rg_dense = 2' },
      { id: 'B', texte: 'rg = 3 et rg_dense = 2' },
      { id: 'C', texte: 'rg = 3 et rg_dense = 3' },
      { id: 'D', texte: 'rg = 2 et rg_dense = 3' },
    ],
    bonneReponse: 'B',
    explication:
      "Mbuyi et Kalala sont ex æquo au rang 1. RANK() laisse ensuite un « trou » : la ligne suivante prend le rang 3, car deux lignes la précèdent. DENSE_RANK() ne laisse pas de trou et attribue le rang 2.",
    pourquoiPas: {
      A: "RANK() tient compte du nombre de lignes qui précèdent : après deux ex æquo au rang 1, le rang suivant est 3, pas 2.",
      C: "DENSE_RANK() numérote les valeurs distinctes sans trou : 500 a le rang 1, donc 300 a le rang 2.",
      D: "Les deux fonctions sont inversées : c'est RANK() qui saute un rang, pas DENSE_RANK().",
    },
    aRetenir: "ROW_NUMBER() : 1, 2, 3 ; RANK() : 1, 1, 3 ; DENSE_RANK() : 1, 1, 2.",
  },
  {
    id: 'BDD-SQL-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'moyen',
    enonce:
      "Un DBA veut lister TOUS les clients, avec leurs comptes actifs s'ils en ont. Il écrit `SELECT cl.nom, co.numero FROM clients cl LEFT JOIN comptes co ON co.client_id = cl.id WHERE co.statut = 'actif';` mais les clients sans compte disparaissent du résultat. Pourquoi ?",
    options: [
      { id: 'A', texte: "La condition du WHERE élimine les lignes où `co.statut` vaut NULL : elle doit être déplacée dans la clause ON." },
      { id: 'B', texte: 'Un LEFT JOIN ne conserve que les lignes présentes dans la table de droite.' },
      { id: 'C', texte: "Il faut un FULL OUTER JOIN : un LEFT JOIN ne conserve pas les lignes de gauche qui n'ont aucune correspondance à droite." },
      { id: 'D', texte: 'Il manque un DISTINCT après SELECT.' },
    ],
    bonneReponse: 'A',
    explication:
      "Le LEFT JOIN produit bien une ligne pour chaque client sans compte, avec des colonnes `co.*` à NULL. Mais le WHERE est appliqué ensuite : `NULL = 'actif'` n'est pas vrai, donc ces lignes sont filtrées et la jointure devient de fait une jointure interne. En écrivant `ON co.client_id = cl.id AND co.statut = 'actif'`, le filtre ne porte que sur les comptes joints.",
    pourquoiPas: {
      B: "C'est l'inverse : le LEFT JOIN conserve toutes les lignes de la table de GAUCHE (ici clients).",
      C: "Le LEFT JOIN conserve bien ces lignes ; un FULL OUTER JOIN ajouterait les comptes sans client, et le WHERE éliminerait toujours les clients sans compte.",
      D: "DISTINCT supprime des doublons ; il ne fait pas réapparaître des lignes éliminées par le WHERE.",
    },
    aRetenir: "Dans un LEFT JOIN, un filtre sur la table de droite se place dans ON ; dans WHERE, il transforme la jointure en jointure interne.",
  },
  {
    id: 'BDD-SQL-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'difficile',
    enonce:
      "La colonne `prets.client_id` contient une ligne à NULL (prêt en cours de saisie). Que renvoie la requête suivante, censée lister les clients sans prêt ?",
    extrait: {
      langage: 'sql',
      contenu: `SELECT id
FROM clients
WHERE id NOT IN (SELECT client_id FROM prets);`,
    },
    options: [
      { id: 'A', texte: 'Les clients sans prêt, comme prévu' },
      { id: 'B', texte: 'Aucune ligne' },
      { id: 'C', texte: 'Une erreur de syntaxe' },
      { id: 'D', texte: 'Tous les clients, avec ou sans prêt' },
    ],
    bonneReponse: 'B',
    explication:
      "`x NOT IN (1, 2, NULL)` équivaut à `x <> 1 AND x <> 2 AND x <> NULL`. La dernière comparaison vaut UNKNOWN, donc la condition entière n'est jamais VRAIE : aucune ligne n'est renvoyée. Il faut écrire `NOT EXISTS (SELECT 1 FROM prets p WHERE p.client_id = c.id)` ou exclure les NULL dans la sous-requête.",
    pourquoiPas: {
      A: "Ce serait le cas sans NULL dans la sous-requête ; un seul NULL suffit à rendre la condition inconnue pour toutes les lignes.",
      C: "La syntaxe est correcte : la requête s'exécute, mais son résultat est vide.",
      D: "Une condition UNKNOWN est traitée comme fausse par WHERE : rien n'est renvoyé, et non tout.",
    },
    aRetenir: "NOT IN sur une sous-requête pouvant contenir NULL renvoie un résultat vide : préférez NOT EXISTS.",
  },
  {
    id: 'BDD-SQL-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'moyen',
    enonce: "Que renvoie cette requête PostgreSQL sur la table `employes(id, nom, manager_id)` de la Banque Alpha ?",
    extrait: {
      langage: 'sql',
      contenu: `WITH RECURSIVE hierarchie AS (
  SELECT id, nom, manager_id, 1 AS niveau
  FROM employes
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.nom, e.manager_id, h.niveau + 1
  FROM employes e
  JOIN hierarchie h ON e.manager_id = h.id
)
SELECT nom, niveau FROM hierarchie;`,
    },
    options: [
      { id: 'A', texte: 'Uniquement le ou les responsables sans manager' },
      { id: 'B', texte: "Tout l'organigramme sous le ou les responsables sans manager, avec le niveau de chacun" },
      { id: 'C', texte: 'Une erreur ou une boucle infinie, car une CTE ne peut pas se référencer elle-même dans sa propre définition' },
      { id: 'D', texte: "Uniquement les employés qui n'encadrent personne" },
    ],
    bonneReponse: 'B',
    explication:
      "Une CTE récursive combine un membre d'ancrage (ici le sommet de l'organigramme, niveau 1) et un membre récursif qui joint la table à la CTE elle-même. Chaque itération ajoute les subordonnés directs des lignes de l'itération précédente, avec `niveau + 1`. L'exécution s'arrête quand une itération ne produit plus de ligne.",
    pourquoiPas: {
      A: "Ce serait le résultat du seul membre d'ancrage ; le membre récursif ajoute ensuite les subordonnés, niveau par niveau.",
      C: "Avec WITH RECURSIVE, l'auto-référence est permise ; la récursion s'arrête quand aucun nouveau subordonné n'est trouvé, et seul un cycle dans les données (A manage B qui manage A) la ferait boucler.",
      D: "La requête descend depuis le sommet et renvoie tous les niveaux, pas seulement les feuilles de l'arbre.",
    },
    aRetenir: "CTE récursive = ancrage + UNION ALL + membre récursif qui référence la CTE ; elle s'arrête quand une itération est vide.",
  },
  {
    id: 'BDD-SQL-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'moyen',
    enonce:
      "La table `operations(id, compte_id, date_op, montant)` contient des crédits (positifs) et des débits (négatifs). Quelle expression calcule le solde cumulé de chaque compte au fil des opérations, ligne par ligne ?",
    options: [
      { id: 'A', texte: 'SUM(montant) avec GROUP BY compte_id, date_op' },
      { id: 'B', texte: 'SUM(montant) OVER (PARTITION BY compte_id ORDER BY date_op, id)' },
      { id: 'C', texte: 'SUM(montant) OVER (ORDER BY compte_id)' },
      { id: 'D', texte: 'SUM(montant) OVER (PARTITION BY date_op)' },
    ],
    bonneReponse: 'B',
    explication:
      "Avec PARTITION BY, le calcul repart de zéro pour chaque compte ; avec ORDER BY, la fenêtre par défaut va du début de la partition à la ligne courante, ce qui donne un cumul. Ajouter `id` au tri rend l'ordre déterministe quand deux opérations ont la même date. Contrairement à GROUP BY, la fonction de fenêtrage conserve chaque ligne.",
    pourquoiPas: {
      A: "GROUP BY agrège les lignes en un total par compte et par date : on perd le détail et il n'y a pas de cumul.",
      C: "Sans PARTITION BY, le cumul traverse tous les comptes ; et trier par compte seulement met toutes ses lignes ex æquo, qui reçoivent le même total.",
      D: "Cette fenêtre donne le total de tous les comptes pour chaque date, pas un solde par compte.",
    },
    aRetenir: "Cumul par groupe : SUM(...) OVER (PARTITION BY groupe ORDER BY ordre) ; ajoutez une clé unique au tri pour un ordre déterministe.",
  },
  {
    id: 'BDD-SQL-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'difficile',
    enonce:
      "Pour dédoublonner une table clients, un DBA écrit `SELECT * FROM clients WHERE ROW_NUMBER() OVER (PARTITION BY num_piece ORDER BY maj DESC) = 1;`. Le SGBD renvoie une erreur. Quelle correction est valable ?",
    options: [
      { id: 'A', texte: 'Remplacer PARTITION BY par GROUP BY dans la clause OVER.' },
      { id: 'B', texte: 'Trier en ordre croissant : ROW_NUMBER() exige ORDER BY maj ASC.' },
      { id: 'C', texte: 'Déplacer la condition dans une clause HAVING, évaluée après le calcul des fonctions de fenêtrage.' },
      { id: 'D', texte: 'Calculer ROW_NUMBER() dans une CTE, puis filtrer `rn = 1` à l’extérieur.' },
    ],
    bonneReponse: 'D',
    explication:
      "Dans l'ordre logique d'évaluation, les fonctions de fenêtrage sont calculées après FROM, WHERE, GROUP BY et HAVING, juste avant ORDER BY. Elles ne peuvent donc pas apparaître dans WHERE. On les calcule dans une CTE (`WITH t AS (SELECT *, ROW_NUMBER() OVER (...) AS rn FROM clients)`) puis on filtre `WHERE rn = 1`.",
    pourquoiPas: {
      A: "GROUP BY n'existe pas dans la clause OVER ; c'est PARTITION BY qui découpe la fenêtre.",
      B: "Le sens du tri est libre ; DESC est d'ailleurs ce qu'il faut pour garder la version la plus récente.",
      C: "HAVING est lui aussi évalué avant les fonctions de fenêtrage : l'erreur serait la même.",
    },
    aRetenir: "Une fonction de fenêtrage ne se filtre jamais dans WHERE ou HAVING : passez par une sous-requête ou une CTE.",
  },
  {
    id: 'BDD-SQL-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'facile',
    enonce:
      "Dans un rapport de paie, l'expression `salaire + commission` renvoie NULL pour les agents qui n'ont pas de commission (colonne à NULL). Quelle expression portable corrige le total ?",
    options: [
      { id: 'A', texte: 'salaire + NULLIF(commission, 0)' },
      { id: 'B', texte: 'salaire + COALESCE(commission, 0)' },
      { id: 'C', texte: 'salaire + CAST(commission AS INTEGER)' },
      { id: 'D', texte: 'salaire + commission, avec WHERE commission IS NOT NULL' },
    ],
    bonneReponse: 'B',
    explication:
      "Toute opération arithmétique impliquant NULL donne NULL. COALESCE renvoie le premier argument non NULL : `COALESCE(commission, 0)` vaut 0 quand la commission est absente. Cette fonction est standard et disponible sur PostgreSQL, Oracle, SQL Server et MySQL.",
    pourquoiPas: {
      A: "NULLIF(commission, 0) fait l'inverse : il transforme 0 en NULL, ce qui aggrave le problème.",
      C: "Convertir NULL en entier donne toujours NULL.",
      D: "Ce filtre retire du rapport les agents sans commission au lieu de calculer leur total.",
    },
    aRetenir: "NULL contamine les calculs : COALESCE(colonne, valeur_par_défaut) neutralise les NULL.",
  },
  {
    id: 'BDD-SQL-008',
    section: 'technique',
    filiere: 'bdd',
    competence: 'SQL avancé',
    difficulte: 'moyen',
    enonce:
      "Pour un rapprochement, un analyste fusionne les opérations de deux agences avec `SELECT compte_id, montant FROM ops_kinshasa UNION SELECT compte_id, montant FROM ops_lubumbashi;`. Le total obtenu est inférieur à la somme des deux tables. Cause la plus probable ?",
    options: [
      { id: 'A', texte: 'UNION élimine les lignes en double ; il faut UNION ALL pour conserver toutes les opérations.' },
      { id: 'B', texte: 'UNION arrondit les montants décimaux.' },
      { id: 'C', texte: 'UNION ne garde que les lignes communes aux deux tables.' },
      { id: 'D', texte: 'Les colonnes des deux tables doivent porter le même nom, sinon des lignes sont ignorées.' },
    ],
    bonneReponse: 'A',
    explication:
      "UNION applique un DISTINCT sur le résultat : deux opérations légitimes de même compte et de même montant ne comptent plus qu'une fois. UNION ALL conserve toutes les lignes, et il est aussi plus rapide puisqu'il évite le dédoublonnage. Pour un rapprochement comptable, on garde de plus l'identifiant de l'opération dans le SELECT.",
    pourquoiPas: {
      B: "UNION ne modifie pas les valeurs ; seuls les types peuvent être harmonisés entre les deux branches.",
      C: "Ne garder que les lignes communes, c'est le rôle d'INTERSECT.",
      D: "Seuls le nombre et les types des colonnes doivent correspondre ; les noms viennent de la première branche.",
    },
    aRetenir: "UNION = union sans doublons ; UNION ALL = toutes les lignes. Pour des montants, UNION ALL presque toujours.",
  },

  // ───────────────────────── Modélisation & normalisation ─────────────────────────
  {
    id: 'BDD-MOD-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'facile',
    enonce:
      "Dans la table `clients`, la colonne `telephones` contient des valeurs comme « 0812345678, 0998765432 ». Quelle forme normale est violée ?",
    options: [
      { id: 'A', texte: 'La deuxième forme normale (2FN)' },
      { id: 'B', texte: 'La troisième forme normale (3FN)' },
      { id: 'C', texte: 'La première forme normale (1FN)' },
      { id: 'D', texte: 'La forme normale de Boyce-Codd (BCNF)' },
    ],
    bonneReponse: 'C',
    explication:
      "La 1FN exige des valeurs atomiques : une cellule ne doit pas contenir une liste. Ici, rechercher un numéro ou en modifier un seul impose de découper du texte. On crée une table `telephones_client(client_id, numero, type)` avec une ligne par numéro.",
    pourquoiPas: {
      A: "La 2FN concerne les dépendances partielles vis-à-vis d'une clé composée ; le problème est ici plus élémentaire.",
      B: "La 3FN concerne les dépendances transitives entre attributs non clés.",
      D: "La BCNF est encore plus exigeante ; on ne peut pas l'atteindre sans d'abord respecter la 1FN.",
    },
    aRetenir: "1FN : une valeur atomique par cellule, pas de liste ni de groupe répété.",
  },
  {
    id: 'BDD-MOD-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'moyen',
    enonce:
      "La table `affectations(matricule, code_projet, heures, nom_agent)` a pour clé primaire `(matricule, code_projet)`. Le nom de l'agent ne dépend que de son matricule. Quel problème de normalisation présente-t-elle ?",
    options: [
      { id: 'A', texte: "Violation de la 2FN : `nom_agent` dépend d'une partie seulement de la clé." },
      { id: 'B', texte: 'Violation de la 1FN, car la clé primaire est composée.' },
      { id: 'C', texte: 'Violation de la 3FN : `heures` dépend transitivement de `nom_agent`.' },
      { id: 'D', texte: 'Aucun : la table est en BCNF.' },
    ],
    bonneReponse: 'A',
    explication:
      "En 2FN, chaque attribut non clé doit dépendre de la clé entière. `nom_agent` ne dépend que de `matricule` : il est répété pour chaque projet de l'agent, d'où des anomalies de mise à jour (un nom corrigé à un endroit, pas à l'autre). On le déplace dans une table `agents(matricule, nom_agent)`.",
    pourquoiPas: {
      B: "Une clé composée est parfaitement autorisée en 1FN ; la 1FN porte sur l'atomicité des valeurs.",
      C: "`heures` dépend bien de la clé entière (un agent sur un projet) et non du nom de l'agent.",
      D: "La dépendance matricule → nom_agent a un déterminant qui n'est pas une clé : la table n'est même pas en 2FN.",
    },
    aRetenir: "2FN : pas d'attribut non clé qui dépende d'une PARTIE d'une clé composée.",
  },
  {
    id: 'BDD-MOD-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'facile',
    enonce:
      "À la Banque Alpha, un client peut détenir plusieurs comptes et un compte joint peut avoir plusieurs titulaires. Comment modéliser cette relation ?",
    options: [
      { id: 'A', texte: 'Ajouter une colonne `compte_id` dans la table `clients`.' },
      { id: 'B', texte: 'Ajouter une colonne `client_id` dans la table `comptes`.' },
      { id: 'C', texte: 'Une table d’association `titulaires(client_id, compte_id)` à clé primaire composée.' },
      { id: 'D', texte: 'Stocker dans `comptes` la liste des identifiants des titulaires, séparés par des virgules, et la découper à la lecture.' },
    ],
    bonneReponse: 'C',
    explication:
      "C'est une relation plusieurs-à-plusieurs (N:M). En relationnel, elle se traduit par une table d'association dont chaque ligne relie un client à un compte. La clé primaire composée empêche les doublons et les clés étrangères garantissent l'intégrité référentielle.",
    pourquoiPas: {
      A: "Une seule colonne compte_id limiterait chaque client à un compte.",
      B: "Une seule colonne client_id limiterait chaque compte à un titulaire, ce qui exclut les comptes joints.",
      D: "Une liste dans une cellule viole la 1FN et rend impossibles les clés étrangères.",
    },
    aRetenir: "Une relation N:M se modélise toujours par une table d'association.",
  },
  {
    id: 'BDD-MOD-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'moyen',
    enonce:
      "La table `employes(matricule, nom, code_agence, ville_agence)` a pour clé `matricule`. Quand une agence déménage, il faut modifier des centaines de lignes. Quel est le diagnostic et la correction ?",
    options: [
      { id: 'A', texte: 'Violation de la 1FN : il faut découper la colonne ville_agence.' },
      { id: 'B', texte: 'Violation de la 2FN, car la clé de la table est composée.' },
      { id: 'C', texte: 'Aucun problème : cette redondance évite une jointure à chaque lecture et améliore donc les performances.' },
      { id: 'D', texte: 'Dépendance transitive (3FN) : isoler les agences dans une table `agences(code_agence, ville)`.' },
    ],
    bonneReponse: 'D',
    explication:
      "On a matricule → code_agence → ville_agence : la ville dépend d'un attribut non clé. C'est une dépendance transitive, interdite en 3FN, qui provoque des anomalies de mise à jour. En isolant les agences dans leur propre table, la ville n'est stockée qu'une fois.",
    pourquoiPas: {
      A: "Chaque cellule contient une seule ville : la 1FN est respectée.",
      B: "La clé (matricule) est simple ; une table à clé simple en 1FN est automatiquement en 2FN.",
      C: "Une dénormalisation peut se justifier dans un entrepôt de données, pas dans une base transactionnelle où elle crée ces anomalies.",
    },
    aRetenir: "3FN : aucun attribut non clé ne doit dépendre d'un autre attribut non clé.",
  },
  {
    id: 'BDD-MOD-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'moyen',
    enonce:
      "La table `clients` a pour clé primaire `id` (valeur générée). Le service conformité exige qu'aucun numéro de pièce d'identité n'apparaisse deux fois. Quelle est la bonne solution ?",
    options: [
      { id: 'A', texte: 'Un index non unique sur numero_piece' },
      { id: 'B', texte: 'Faire de numero_piece une clé étrangère vers clients.id' },
      { id: 'C', texte: 'Une contrainte UNIQUE sur numero_piece' },
      { id: 'D', texte: "Un déclencheur qui supprime le doublon après l'insertion" },
    ],
    bonneReponse: 'C',
    explication:
      "numero_piece est une clé candidate (ou clé alternative) : elle identifie aussi un client, même si l'on a choisi `id` comme clé primaire. Une contrainte UNIQUE la déclare au SGBD, qui refuse tout doublon de façon fiable, y compris sous forte concurrence. Elle crée en général un index unique au passage.",
    pourquoiPas: {
      A: "Un index non unique accélère la recherche mais accepte les doublons.",
      B: "Une clé étrangère référence une autre clé ; elle n'impose pas l'unicité et n'a aucun sens ici.",
      D: "Supprimer après coup est fragile (concurrence, perte de données) ; une contrainte déclarative empêche l'insertion.",
    },
    aRetenir: "Clé candidate non choisie comme clé primaire = contrainte UNIQUE.",
  },
  {
    id: 'BDD-MOD-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'difficile',
    enonce:
      "Table `suivi(client_id, produit, conseiller)`. Règles : pour un client et un produit, il y a un seul conseiller ; chaque conseiller est spécialisé dans un seul produit. Clés candidates : `(client_id, produit)` et `(client_id, conseiller)`. Que dire de cette table ?",
    options: [
      { id: 'A', texte: 'Elle est en BCNF : une table en 3FN dont les clés sont composées l’est automatiquement.' },
      { id: 'B', texte: 'Elle viole la 2FN : conseiller dépend partiellement de la clé (client_id, produit).' },
      { id: 'C', texte: 'Elle viole la 1FN.' },
      { id: 'D', texte: 'Elle est en 3FN mais pas en BCNF.' },
    ],
    bonneReponse: 'D',
    explication:
      "La BCNF exige que tout déterminant d'une dépendance fonctionnelle soit une super-clé. Or conseiller → produit, et conseiller seul n'est pas une clé. La 3FN est pourtant respectée, car produit est un attribut premier (il appartient à une clé candidate). La décomposition en `conseillers(conseiller, produit)` et `suivi(client_id, conseiller)` atteint la BCNF.",
    pourquoiPas: {
      A: "La 3FN n'implique jamais automatiquement la BCNF : elle tolère une dépendance vers un attribut premier (ici conseiller → produit), la BCNF non.",
      B: "conseiller dépend de la clé (client_id, produit) tout entière ; et tous les attributs sont premiers, donc aucun attribut non clé ne peut être en dépendance partielle.",
      C: "Chaque cellule contient une valeur atomique.",
    },
    aRetenir: "BCNF : tout déterminant est une super-clé ; c'est plus strict que la 3FN.",
  },
  {
    id: 'BDD-MOD-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Modélisation & normalisation',
    difficulte: 'moyen',
    enonce:
      "La table `comptes` a une clé étrangère `client_id` vers `clients(id)`, déclarée sans option ON DELETE. Que se passe-t-il si l'on supprime un client qui possède encore des comptes ?",
    options: [
      { id: 'A', texte: 'La suppression est refusée avec une erreur de violation de clé étrangère.' },
      { id: 'B', texte: 'Les comptes du client sont supprimés en cascade.' },
      { id: 'C', texte: 'La colonne client_id de ses comptes passe à NULL.' },
      { id: 'D', texte: 'La suppression réussit et les comptes restent orphelins.' },
    ],
    bonneReponse: 'A',
    explication:
      "Sans précision, le comportement est NO ACTION (proche de RESTRICT) : le SGBD refuse toute suppression qui laisserait des lignes enfants sans parent. C'est le comportement le plus sûr pour des données financières. CASCADE ou SET NULL doivent être demandés explicitement.",
    pourquoiPas: {
      B: "La cascade n'a lieu qu'avec ON DELETE CASCADE, à déclarer explicitement — et rarement souhaitable pour des comptes.",
      C: "La mise à NULL exige ON DELETE SET NULL.",
      D: "Empêcher les orphelins est précisément le rôle d'une contrainte de clé étrangère.",
    },
    aRetenir: "Par défaut, une clé étrangère interdit de supprimer un parent qui a encore des enfants.",
  },

  // ───────────────────────── Transactions & concurrence ─────────────────────────
  {
    id: 'BDD-TRX-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'facile',
    enonce:
      "Un virement est validé (COMMIT confirmé à l'application), puis le serveur subit une coupure de courant. Au redémarrage, le virement est bien présent. Quelle propriété ACID est illustrée ?",
    options: [
      { id: 'A', texte: 'La durabilité' },
      { id: 'B', texte: "L'atomicité" },
      { id: 'C', texte: 'La cohérence' },
      { id: 'D', texte: "L'isolation" },
    ],
    bonneReponse: 'A',
    explication:
      "La durabilité garantit qu'une transaction validée survit à une panne. Le SGBD l'assure en écrivant le journal de transactions (WAL, redo log, journal SQL Server) sur disque avant de confirmer le COMMIT. Au redémarrage, la récupération rejoue ce journal.",
    pourquoiPas: {
      B: "L'atomicité garantit le « tout ou rien » d'une transaction, pas sa conservation après une panne.",
      C: "La cohérence garantit que la transaction fait passer la base d'un état valide à un autre (contraintes respectées).",
      D: "L'isolation règle la visibilité entre transactions concurrentes.",
    },
    aRetenir: "Durabilité : un COMMIT confirmé survit aux pannes, grâce au journal écrit sur disque avant la confirmation.",
  },
  {
    id: 'BDD-TRX-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'facile',
    enonce: "Le solde du compte 101 était de 200 000 CDF avant cette séquence. Que vaut-il après le ROLLBACK ?",
    extrait: {
      langage: 'sql',
      contenu: `BEGIN;
UPDATE comptes SET solde = solde - 50000 WHERE id = 101;
UPDATE comptes SET solde = solde + 50000 WHERE id = 202;
-- le second UPDATE échoue (violation de contrainte)
ROLLBACK;`,
    },
    options: [
      { id: 'A', texte: '150 000 CDF : seul l’ordre en échec est annulé' },
      { id: 'B', texte: '200 000 CDF' },
      { id: 'C', texte: 'Indéterminé tant que le prochain point de contrôle (checkpoint) n’a pas eu lieu' },
      { id: 'D', texte: '150 000 CDF, et la ligne reste verrouillée jusqu’au redémarrage du serveur' },
    ],
    bonneReponse: 'B',
    explication:
      "ROLLBACK annule toutes les modifications de la transaction, y compris le premier UPDATE qui avait réussi : c'est l'atomicité. Le compte 101 retrouve donc 200 000 CDF et ses verrous sont libérés. Un virement doit toujours être encadré par une transaction pour éviter un débit sans crédit.",
    pourquoiPas: {
      A: "Annuler la transaction annule tous ses ordres, pas seulement celui qui a échoué.",
      C: "Le checkpoint concerne l'écriture des pages en mémoire vers les fichiers de données ; il ne change pas le résultat logique d'un ROLLBACK.",
      D: "Les verrous d'une transaction sont libérés dès sa fin, par COMMIT ou ROLLBACK.",
    },
    aRetenir: "Atomicité : une transaction s'applique entièrement ou pas du tout ; ROLLBACK annule tous ses ordres.",
  },
  {
    id: 'BDD-TRX-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'moyen',
    enonce:
      "Dans une même transaction, T1 lit le solde d'un compte : 100 000 CDF. Pendant ce temps, T2 débite le compte et valide. T1 relit la même ligne et obtient 80 000 CDF. Quelle anomalie T1 a-t-elle subie ?",
    options: [
      { id: 'A', texte: 'Une lecture non répétable' },
      { id: 'B', texte: 'Une lecture sale' },
      { id: 'C', texte: 'Une lecture fantôme' },
      { id: 'D', texte: 'Une mise à jour perdue' },
    ],
    bonneReponse: 'A',
    explication:
      "Relire la même ligne dans une transaction et obtenir une valeur différente, parce qu'une autre transaction l'a modifiée et validée entre-temps, est une lecture non répétable. Elle est possible en READ COMMITTED et empêchée à partir de REPEATABLE READ.",
    pourquoiPas: {
      B: "Une lecture sale porte sur une donnée NON validée ; ici T2 a validé avant la seconde lecture.",
      C: "Un fantôme concerne l'apparition ou la disparition de lignes dans un ensemble (un nouveau résultat pour un même WHERE), pas la modification d'une ligne déjà lue.",
      D: "Une mise à jour perdue suppose que deux transactions écrivent et que l'une écrase l'autre ; T1 ne fait que lire.",
    },
    aRetenir: "Sale = lit du non validé ; non répétable = une ligne relue a changé ; fantôme = l'ensemble de lignes a changé.",
  },
  {
    id: 'BDD-TRX-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'moyen',
    enonce:
      "Selon la norme SQL, quel est le niveau d'isolation le plus bas qui empêche les lectures sales tout en autorisant encore les lectures non répétables ?",
    options: [
      { id: 'A', texte: 'READ UNCOMMITTED' },
      { id: 'B', texte: 'READ COMMITTED' },
      { id: 'C', texte: 'REPEATABLE READ' },
      { id: 'D', texte: 'SERIALIZABLE' },
    ],
    bonneReponse: 'B',
    explication:
      "READ COMMITTED garantit qu'on ne lit que des données validées, mais deux lectures successives peuvent voir des valeurs différentes. C'est le niveau par défaut de PostgreSQL, Oracle et SQL Server ; le moteur InnoDB de MySQL utilise REPEATABLE READ par défaut.",
    pourquoiPas: {
      A: "READ UNCOMMITTED autorise justement les lectures sales.",
      C: "REPEATABLE READ empêche aussi les lectures non répétables : ce n'est pas le plus bas niveau demandé.",
      D: "SERIALIZABLE empêche toutes les anomalies ; c'est le niveau le plus élevé.",
    },
    aRetenir: "READ UNCOMMITTED < READ COMMITTED (pas de lecture sale) < REPEATABLE READ (pas de non répétable) < SERIALIZABLE.",
  },
  {
    id: 'BDD-TRX-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'difficile',
    enonce:
      "Chaque nuit, deux traitements de la Banque Alpha mettent à jour des comptes : le premier modifie le compte 101 puis le 202, le second le 202 puis le 101. Le journal PostgreSQL montre régulièrement l'erreur ci-dessous. Quelle mesure corrige durablement la cause ?",
    extrait: {
      langage: 'log',
      contenu: `ERROR:  deadlock detected
DETAIL:  Process 4120 waits for ShareLock on transaction 88123; blocked by process 4187.
         Process 4187 waits for ShareLock on transaction 88122; blocked by process 4120.
HINT:  See server log for query details.
CONTEXT:  while updating tuple (12,7) in relation "comptes"`,
    },
    options: [
      { id: 'A', texte: 'Augmenter le paramètre max_connections' },
      { id: 'B', texte: 'Mettre à jour les comptes dans le même ordre (id croissant) dans les deux traitements' },
      { id: 'C', texte: 'Passer les deux traitements en READ UNCOMMITTED, pour qu’ils ne s’attendent plus sur les lignes modifiées' },
      { id: 'D', texte: 'Désactiver la détection des interblocages' },
    ],
    bonneReponse: 'B',
    explication:
      "Chaque processus détient un verrou de ligne que l'autre attend : c'est un interblocage (deadlock). Le SGBD le détecte et annule l'une des transactions. En imposant le même ordre d'accès aux ressources dans tous les traitements, le cycle d'attente devient impossible ; il reste prudent de prévoir une nouvelle tentative en cas d'échec.",
    pourquoiPas: {
      A: "Le nombre de connexions n'a aucun rapport avec deux transactions qui s'attendent mutuellement.",
      C: "Le niveau d'isolation ne supprime pas les verrous posés par les écritures : deux UPDATE sur la même ligne s'attendent toujours.",
      D: "Sans détection, les deux sessions resteraient bloquées indéfiniment ; la détection est le remède, pas la cause.",
    },
    aRetenir: "Contre les interblocages : accéder aux ressources toujours dans le même ordre, garder des transactions courtes et prévoir une reprise.",
  },
  {
    id: 'BDD-TRX-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'moyen',
    enonce:
      "Sous PostgreSQL, qui utilise le contrôle de concurrence multiversion (MVCC), un long SELECT de reporting lit la table `comptes` pendant qu'un guichet met à jour une ligne de cette table. Que se passe-t-il ?",
    options: [
      { id: 'A', texte: 'Le SELECT pose un verrou partagé sur chaque ligne lue, ce qui bloque la mise à jour jusqu’à la fin de la lecture.' },
      { id: 'B', texte: 'La mise à jour est refusée avec une erreur tant que le SELECT tourne.' },
      { id: 'C', texte: 'Aucun blocage : le SELECT lit la version de la ligne qui correspond à son instantané.' },
      { id: 'D', texte: 'Aucun blocage, car PostgreSQL ne pose jamais de verrou de ligne.' },
    ],
    bonneReponse: 'C',
    explication:
      "Avec MVCC, une mise à jour crée une nouvelle version de la ligne au lieu d'écraser l'ancienne. Le lecteur continue de voir la version cohérente avec son instantané, et l'écrivain n'attend pas. Les lecteurs ne bloquent pas les écrivains, et inversement ; seuls deux écrivains sur la même ligne s'attendent.",
    pourquoiPas: {
      A: "Les verrous partagés de lecture caractérisent un fonctionnement sans MVCC (par exemple SQL Server en READ COMMITTED sans RCSI), pas PostgreSQL.",
      B: "Rien n'interdit d'écrire pendant une lecture ; il n'y a ni erreur ni attente.",
      D: "PostgreSQL pose bien des verrous de ligne lors des UPDATE, DELETE et SELECT … FOR UPDATE ; ils ne gênent simplement pas les lectures ordinaires.",
    },
    aRetenir: "MVCC : chaque transaction lit un instantané ; les lecteurs ne bloquent pas les écrivains et inversement.",
  },
  {
    id: 'BDD-TRX-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'moyen',
    enonce:
      "Deux guichets lisent simultanément un solde de 100 000 CDF. Chacun retire 30 000 CDF : l'application calcule 70 000 et exécute `UPDATE comptes SET solde = 70000 WHERE id = 101`. Le solde final est 70 000 au lieu de 40 000. Comment l'éviter ?",
    options: [
      { id: 'A', texte: 'Ajouter un index sur comptes.id' },
      { id: 'B', texte: 'Lire le solde deux fois avant d’écrire' },
      { id: 'C', texte: 'Lire avec SELECT … FOR UPDATE, ou écrire solde = solde - 30000' },
      { id: 'D', texte: 'Passer en READ UNCOMMITTED pour voir plus tôt les modifications de l’autre guichet' },
    ],
    bonneReponse: 'C',
    explication:
      "C'est une mise à jour perdue : la seconde écriture écrase la première, car toutes deux partent d'une valeur lue périmée. SELECT … FOR UPDATE verrouille la ligne jusqu'à la fin de la transaction, ce qui oblige le second guichet à attendre la valeur à jour. Une mise à jour relative (`solde = solde - 30000`) est, elle, évaluée sur la valeur courante au moment de l'écriture.",
    pourquoiPas: {
      A: "Un index accélère l'accès à la ligne mais ne règle pas la concurrence.",
      B: "Une double lecture ne garantit rien : l'autre guichet peut écrire juste après.",
      D: "Lire des données non validées aggrave les risques d'incohérence sans empêcher l'écrasement.",
    },
    aRetenir: "Lire puis écrire une valeur calculée côté application expose à la mise à jour perdue : verrouillez (FOR UPDATE) ou écrivez une mise à jour relative.",
  },
  {
    id: 'BDD-TRX-008',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Transactions & concurrence',
    difficulte: 'difficile',
    enonce:
      "T1 compte les opérations de plus de 10 millions de CDF du jour : 5. T2 insère une nouvelle opération de 12 millions et valide. T1, toujours dans la même transaction, recompte : 6. Selon la norme SQL, quel est le niveau d'isolation minimal qui interdit cette anomalie ?",
    options: [
      { id: 'A', texte: 'SERIALIZABLE' },
      { id: 'B', texte: 'REPEATABLE READ' },
      { id: 'C', texte: 'READ COMMITTED' },
      { id: 'D', texte: 'READ UNCOMMITTED' },
    ],
    bonneReponse: 'A',
    explication:
      "Une ligne nouvelle qui apparaît dans le résultat d'un même prédicat est un fantôme. La norme SQL n'interdit les fantômes qu'au niveau SERIALIZABLE ; REPEATABLE READ protège les lignes déjà lues, pas l'ensemble. Certaines implémentations vont plus loin : le REPEATABLE READ de PostgreSQL, fondé sur un instantané, ne laisse pas non plus voir ce fantôme.",
    pourquoiPas: {
      B: "Dans la norme, REPEATABLE READ empêche la lecture non répétable mais autorise encore les fantômes.",
      C: "READ COMMITTED autorise lectures non répétables et fantômes.",
      D: "READ UNCOMMITTED est le niveau le plus faible : il autorise même les lectures sales.",
    },
    aRetenir: "Fantômes : seuls interdits par SERIALIZABLE dans la norme SQL ; vérifiez toutefois le comportement réel de votre SGBD.",
  },

  // ───────────────────────────── Index & optimisation ─────────────────────────────
  {
    id: 'BDD-IDX-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'facile',
    enonce:
      "La recherche d'un compte dans la table `operations` (20 millions de lignes) prend plusieurs secondes. PostgreSQL affiche le plan ci-dessous. Quelle action est la plus pertinente ?",
    extrait: {
      langage: 'texte',
      contenu: `EXPLAIN SELECT * FROM operations WHERE numero_compte = 'CD-0042-7781';

Seq Scan on operations  (cost=0.00..412345.00 rows=1 width=64)
  Filter: (numero_compte = 'CD-0042-7781'::text)`,
    },
    options: [
      { id: 'A', texte: 'Créer un index B-tree sur numero_compte' },
      { id: 'B', texte: 'Augmenter la mémoire : un index est déjà utilisé' },
      { id: 'C', texte: 'Supprimer le filtre et trier les résultats dans l’application' },
      { id: 'D', texte: 'Lancer VACUUM FULL sur la table chaque matin' },
    ],
    bonneReponse: 'A',
    explication:
      "« Seq Scan » signifie que le moteur lit toute la table et applique le filtre à chaque ligne. Pour une recherche par égalité très sélective (1 ligne estimée), un index B-tree sur la colonne permet d'aller directement aux lignes concernées. Le plan devrait alors afficher un « Index Scan ».",
    pourquoiPas: {
      B: "Le plan ne mentionne aucun index : il s'agit d'un parcours séquentiel complet.",
      C: "Ramener 20 millions de lignes vers l'application serait bien plus lent et saturerait le réseau.",
      D: "VACUUM FULL compacte la table mais celle-ci reste parcourue entièrement à chaque recherche.",
    },
    aRetenir: "Seq Scan sur une recherche sélective d'une grande table = index probablement manquant.",
  },
  {
    id: 'BDD-IDX-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'moyen',
    enonce:
      "La table `operations` possède un index composite B-tree sur `(agence_id, date_op)`. Laquelle de ces requêtes en tire le MOINS bien parti ?",
    options: [
      { id: 'A', texte: 'WHERE agence_id = 12' },
      { id: 'B', texte: "WHERE agence_id = 12 AND date_op >= '2026-01-01'" },
      { id: 'C', texte: 'WHERE agence_id = 12 ORDER BY date_op' },
      { id: 'D', texte: "WHERE date_op = '2026-03-31'" },
    ],
    bonneReponse: 'D',
    explication:
      "Un index composite est trié d'abord sur sa première colonne, puis sur la seconde. Il sert efficacement les recherches qui portent sur le préfixe gauche (agence_id, puis agence_id + date_op). Un filtre sur date_op seule ne permet pas de descendre directement dans l'arbre : au mieux, le moteur parcourt tout l'index (ou utilise un « skip scan » sous Oracle).",
    pourquoiPas: {
      A: "agence_id est la première colonne de l'index : la recherche est directe.",
      B: "Égalité sur la première colonne puis intervalle sur la seconde : c'est l'usage idéal de cet index.",
      C: "Pour une agence donnée, les entrées sont déjà triées par date_op : l'index évite même le tri.",
    },
    aRetenir: "Index composite : l'ordre des colonnes compte ; il sert les filtres sur son préfixe gauche.",
  },
  {
    id: 'BDD-IDX-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'moyen',
    enonce:
      "La colonne `date_op` (type DATE) est indexée, mais cette requête parcourt toute la table. Quelle réécriture permet d'utiliser l'index ?",
    extrait: {
      langage: 'sql',
      contenu: `SELECT * FROM operations
WHERE EXTRACT(YEAR FROM date_op) = 2026;`,
    },
    options: [
      { id: 'A', texte: 'SELECT DISTINCT * FROM operations WHERE EXTRACT(YEAR FROM date_op) = 2026' },
      { id: 'B', texte: 'Supprimer puis recréer l’index sur date_op, sans changer la requête' },
      { id: 'C', texte: "WHERE date_op >= DATE '2026-01-01' AND date_op < DATE '2027-01-01'" },
      { id: 'D', texte: "WHERE CAST(date_op AS VARCHAR(10)) LIKE '2026%'" },
    ],
    bonneReponse: 'C',
    explication:
      "Appliquer une fonction à une colonne indexée empêche en général l'usage de l'index, qui est trié sur la valeur brute et non sur le résultat de la fonction. Un intervalle sur la colonne elle-même rend la condition exploitable par l'index (« sargable »). Autre option, plus lourde : un index sur l'expression.",
    pourquoiPas: {
      A: "DISTINCT ajoute un dédoublonnage coûteux sans changer la condition non indexable.",
      B: "L'index n'est pas en cause : c'est la fonction appliquée à la colonne qui l'empêche de servir.",
      D: "On remplace une fonction par une conversion de type, qui empêche tout autant l'usage de l'index.",
    },
    aRetenir: "Ne pas envelopper une colonne indexée dans une fonction : filtrer par intervalle sur la colonne brute.",
  },
  {
    id: 'BDD-IDX-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'facile',
    enonce:
      "La table `operations`, qui reçoit des milliers d'insertions par minute aux heures de pointe, porte 14 index créés au fil des années. Quel est le principal inconvénient de cette situation ?",
    options: [
      { id: 'A', texte: 'Les SELECT deviennent plus lents, car l’optimiseur doit parcourir chacun des 14 index avant de choisir un plan.' },
      { id: 'B', texte: 'Chaque écriture doit mettre à jour les index concernés, ce qui ralentit les insertions.' },
      { id: 'C', texte: 'Les index empêchent les sauvegardes à chaud.' },
      { id: 'D', texte: 'Une table ne peut pas dépasser 8 index.' },
    ],
    bonneReponse: 'B',
    explication:
      "Un index accélère certaines lectures, mais chaque écriture doit aussi mettre à jour chacun des index concernés. Sur une table très sollicitée en insertion, des index inutiles coûtent cher en temps, en verrous et en espace disque. Il faut repérer les index jamais utilisés (statistiques d'utilisation du SGBD) et les supprimer après vérification.",
    pourquoiPas: {
      A: "L'optimiseur évalue les index candidats à partir de leurs métadonnées et statistiques, sans les parcourir : le surcoût pour les lectures est négligeable.",
      C: "Les sauvegardes à chaud fonctionnent quel que soit le nombre d'index.",
      D: "Aucun SGBD courant ne limite les index d'une table à 8.",
    },
    aRetenir: "Un index accélère des lectures mais se paie à chaque écriture : supprimez ceux qui ne servent pas.",
  },
  {
    id: 'BDD-IDX-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'difficile',
    enonce:
      "La colonne `statut` de la table `comptes` vaut « actif » pour 98 % des lignes et « clos » pour 2 %. Elle est indexée, mais l'optimiseur choisit un parcours complet de la table pour `WHERE statut = 'actif'`. Que penser de ce choix ?",
    options: [
      { id: 'A', texte: 'L’index est corrompu : il faut le reconstruire.' },
      { id: 'B', texte: 'Les index B-tree ne fonctionnent pas sur des colonnes de texte.' },
      { id: 'C', texte: 'Il faut forcer l’index par une directive (hint) : un index est toujours plus rapide.' },
      { id: 'D', texte: 'Il est raisonnable : l’index n’est pas rentable pour 98 % des lignes.' },
    ],
    bonneReponse: 'D',
    explication:
      "Un index n'est rentable que si la condition est sélective. Pour ramener 98 % des lignes, passer par l'index imposerait un accès aléatoire à presque chaque page de la table, en plus de la lecture de l'index. Pour la requête inverse (`statut = 'clos'`, 2 %), l'index est utile ; un index partiel sur les seules lignes « clos » (PostgreSQL) serait encore plus compact.",
    pourquoiPas: {
      A: "Rien n'indique une corruption : l'optimiseur fait un choix de coût cohérent avec les statistiques.",
      B: "Les index B-tree fonctionnent très bien sur du texte ; c'est la faible sélectivité qui pose problème.",
      C: "Forcer l'index sur une condition peu sélective ralentirait la requête.",
    },
    aRetenir: "Plus une condition est sélective, plus l'index est utile ; au-delà d'une certaine proportion de lignes, le parcours complet gagne.",
  },
  {
    id: 'BDD-IDX-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'moyen',
    enonce:
      "Après le chargement nocturne de 2 millions d'opérations, une requête de contrôle est passée de 2 à 48 secondes. Voici un extrait de son plan réel (PostgreSQL). Quel est le diagnostic le plus probable ?",
    extrait: {
      langage: 'texte',
      contenu: `EXPLAIN ANALYZE ...
Nested Loop  (cost=0.85..16.90 rows=1 width=48)
             (actual time=0.05..48211.70 rows=2000000 loops=1)
  ->  Index Scan using idx_ops_lot on operations o
        (cost=0.43..8.45 rows=1 width=32)
        (actual time=0.03..2140.20 rows=2000000 loops=1)
        Index Cond: (lot_id = 5521)
  ->  Index Scan using comptes_pkey on comptes c
        (cost=0.43..8.45 rows=1 width=16)
        (actual time=0.02..0.02 rows=1 loops=2000000)
        Index Cond: (id = o.compte_id)`,
    },
    options: [
      { id: 'A', texte: 'Il manque un index sur comptes.id' },
      { id: 'B', texte: 'Le serveur manque de processeurs' },
      { id: 'C', texte: 'Il faut supprimer l’index idx_ops_lot' },
      { id: 'D', texte: 'Les statistiques de l’optimiseur sont périmées : lancer ANALYZE sur operations' },
    ],
    bonneReponse: 'D',
    explication:
      "L'optimiseur estime 1 ligne pour le lot 5521 alors qu'il y en a 2 millions : ses statistiques datent d'avant le chargement. Sur cette fausse estimation, il choisit une boucle imbriquée, qui exécute 2 millions de recherches dans comptes. Après ANALYZE, il choisira probablement une jointure par hachage ; il faut donc planifier ANALYZE après chaque gros chargement.",
    pourquoiPas: {
      A: "Le plan utilise déjà comptes_pkey, l'index de la clé primaire.",
      B: "Le problème vient d'un mauvais plan (2 millions de boucles), pas d'un manque de puissance.",
      C: "L'index sur lot_id n'est pas en cause ; c'est l'estimation de cardinalité qui est fausse.",
    },
    aRetenir: "Écart énorme entre « rows » estimé et réel dans un plan = statistiques périmées : ANALYZE après les chargements massifs.",
  },
  {
    id: 'BDD-IDX-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'moyen',
    enonce:
      "La requête `SELECT date_op, montant FROM operations WHERE compte_id = ?` est exécutée des milliers de fois par heure. Quel index permet d'y répondre sans lire la table (index couvrant) ?",
    options: [
      { id: 'A', texte: 'Un index sur (compte_id) INCLUDE (date_op, montant)' },
      { id: 'B', texte: 'Un index composite (montant, date_op, compte_id), qui contient bien les trois colonnes utiles' },
      { id: 'C', texte: 'Un index sur montant seul' },
      { id: 'D', texte: 'Un index de type hachage sur date_op' },
    ],
    bonneReponse: 'A',
    explication:
      "Un index couvrant contient toutes les colonnes nécessaires à la requête : le moteur trouve les entrées par compte_id et lit date_op et montant directement dans l'index (« index-only scan »). La clause INCLUDE (PostgreSQL 11 et plus, SQL Server) ajoute des colonnes non triées aux feuilles de l'index ; sans INCLUDE (MySQL, Oracle), un index composite (compte_id, date_op, montant) joue le même rôle. La colonne filtrée doit rester en tête.",
    pourquoiPas: {
      B: "Les colonnes sont présentes, mais compte_id est en dernière position : l'index ne permet pas de rechercher directement un compte.",
      C: "Un index sur montant ne sert pas un filtre sur compte_id.",
      D: "date_op n'est pas la colonne filtrée, et un index de hachage ne couvre pas les autres colonnes.",
    },
    aRetenir: "Index couvrant : colonne de filtre en tête, colonnes lues ajoutées (INCLUDE) pour éviter l'accès à la table.",
  },
  {
    id: 'BDD-IDX-008',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Index & optimisation',
    difficulte: 'difficile',
    enonce:
      "Sous MySQL, la colonne `reference_virement` est de type VARCHAR(20) et indexée. La requête `SELECT * FROM virements WHERE reference_virement = 20261030001;` parcourt pourtant toute la table. Pourquoi ?",
    options: [
      { id: 'A', texte: 'Une conversion implicite de type empêche l’usage de l’index.' },
      { id: 'B', texte: 'Les index ne fonctionnent pas sur les colonnes VARCHAR de plus de 16 caractères.' },
      { id: 'C', texte: 'Le nombre dépasse la capacité d’un INT : MySQL ignore alors le filtre.' },
      { id: 'D', texte: 'Il faut utiliser LIKE au lieu de = sur une colonne de texte.' },
    ],
    bonneReponse: 'A',
    explication:
      "Quand on compare une colonne texte à un nombre, MySQL convertit la valeur de la colonne en nombre pour chaque ligne : l'index, trié sur le texte, devient inutilisable. La documentation MySQL le signale explicitement. Écrire `= '20261030001'` restaure la recherche indexée et évite aussi des correspondances inattendues (« 020261030001 » converti donne le même nombre).",
    pourquoiPas: {
      B: "Les index B-tree acceptent des VARCHAR bien plus longs ; il n'existe pas de limite à 16 caractères.",
      C: "MySQL gère sans problème les grands entiers ; le filtre est appliqué, mais sans index.",
      D: "LIKE sans joker se comporte comme une égalité et ne règle pas le problème de type.",
    },
    aRetenir: "Comparez une colonne avec une valeur du même type : une conversion implicite sur la colonne neutralise l'index.",
  },

  // ───────────────────────────── Sauvegarde & restauration ─────────────────────────────
  {
    id: 'BDD-SAV-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'facile',
    enonce:
      "La direction d'une banque commerciale exige qu'en cas de sinistre, on ne perde jamais plus de 15 minutes de transactions. Quel indicateur cette exigence fixe-t-elle ?",
    options: [
      { id: 'A', texte: 'Le RTO (Recovery Time Objective)' },
      { id: 'B', texte: 'Le RPO (Recovery Point Objective)' },
      { id: 'C', texte: 'Le MTBF (temps moyen entre pannes)' },
      { id: 'D', texte: 'Le taux de disponibilité annuel' },
    ],
    bonneReponse: 'B',
    explication:
      "Le RPO mesure la perte de données maximale acceptable, exprimée en temps : ici 15 minutes. Il dicte la fréquence des sauvegardes de journaux ou le mode de réplication. Le RTO, lui, fixe la durée maximale d'interruption avant le retour du service.",
    pourquoiPas: {
      A: "Le RTO porte sur la durée de l'interruption (combien de temps pour redémarrer), pas sur la quantité de données perdues.",
      C: "Le MTBF est une mesure de fiabilité du matériel, pas un objectif de reprise.",
      D: "Le taux de disponibilité mesure le temps de fonctionnement, pas la perte de données acceptable.",
    },
    aRetenir: "RPO = combien de données on accepte de perdre ; RTO = combien de temps on accepte d'être arrêté.",
  },
  {
    id: 'BDD-SAV-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'facile',
    enonce:
      "Une base est sauvegardée en complet le dimanche soir, puis en différentiel chaque soir du lundi au samedi. Le disque tombe en panne jeudi matin. Quels jeux de sauvegarde faut-il restaurer ?",
    options: [
      { id: 'A', texte: 'La complète de dimanche puis les différentielles de lundi, mardi et mercredi' },
      { id: 'B', texte: 'Uniquement la différentielle de mercredi' },
      { id: 'C', texte: 'La complète de dimanche puis la seule différentielle de mercredi' },
      { id: 'D', texte: 'Uniquement la complète de dimanche' },
    ],
    bonneReponse: 'C',
    explication:
      "Une sauvegarde différentielle contient toutes les modifications depuis la dernière sauvegarde complète. La plus récente suffit donc : complète de dimanche, puis différentielle de mercredi. C'est l'avantage du différentiel : une restauration en deux étapes, au prix de sauvegardes qui grossissent au fil de la semaine.",
    pourquoiPas: {
      A: "Ce serait la logique de sauvegardes incrémentales ; ici, la différentielle de mercredi contient déjà lundi et mardi.",
      B: "Une différentielle n'a pas de sens sans la complète sur laquelle elle s'appuie.",
      D: "On perdrait alors toutes les modifications de lundi à mercredi.",
    },
    aRetenir: "Différentiel : complète + dernière différentielle ; incrémental : complète + toutes les incrémentales dans l'ordre.",
  },
  {
    id: 'BDD-SAV-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'moyen',
    enonce:
      "Une autre base est sauvegardée en complet le dimanche soir, puis en incrémental chaque soir. La panne survient vendredi matin, après l'incrémentale de jeudi soir. Combien de jeux de sauvegarde faut-il restaurer, au minimum ?",
    options: [
      { id: 'A', texte: '2' },
      { id: 'B', texte: '5' },
      { id: 'C', texte: '4' },
      { id: 'D', texte: '1' },
    ],
    bonneReponse: 'B',
    explication:
      "Chaque incrémentale ne contient que les changements depuis la sauvegarde précédente, quelle qu'elle soit. Il faut donc la complète de dimanche, puis les incrémentales de lundi, mardi, mercredi et jeudi, dans l'ordre : 1 + 4 = 5 jeux. Si un seul maillon manque ou est illisible, la chaîne est rompue.",
    pourquoiPas: {
      A: "Deux jeux suffiraient avec des différentielles (complète + dernière différentielle), pas avec des incrémentales.",
      C: "Les quatre incrémentales seules ne suffisent pas : il faut d'abord restaurer la complète qui leur sert de base.",
      D: "La complète seule ferait perdre quatre jours de données.",
    },
    aRetenir: "Incrémental : sauvegardes rapides mais restauration longue, chaque maillon de la chaîne est indispensable.",
  },
  {
    id: 'BDD-SAV-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'moyen',
    enonce:
      "À 14 h 32, un opérateur exécute par erreur un DELETE sans WHERE sur la table des bénéficiaires, puis valide. La base dispose d'une sauvegarde complète de la nuit et de ses journaux de transactions archivés en continu. Quelle méthode limite au mieux la perte ?",
    options: [
      { id: 'A', texte: 'Restaurer la sauvegarde complète de la nuit, sans rien d’autre' },
      { id: 'B', texte: 'Exécuter ROLLBACK depuis une nouvelle session' },
      { id: 'C', texte: 'Restaurer la complète puis rejouer tous les journaux jusqu’au dernier disponible, pour ne perdre aucune opération' },
      { id: 'D', texte: 'Restaurer la complète puis rejouer les journaux jusqu’à 14 h 31 (restauration à un instant donné)' },
    ],
    bonneReponse: 'D',
    explication:
      "La restauration à un instant donné (PITR) consiste à repartir d'une sauvegarde complète puis à rejouer les journaux jusqu'à un instant précis, juste avant l'erreur. On la fait de préférence sur un serveur à part, pour extraire la table et la réinjecter sans écraser le travail fait après 14 h 32. Exemples : `recovery_target_time` sous PostgreSQL, `RESTORE LOG … WITH STOPAT` sous SQL Server.",
    pourquoiPas: {
      A: "On perdrait toutes les opérations de la matinée et du début d'après-midi.",
      B: "Une transaction validée ne peut plus être annulée par ROLLBACK, encore moins depuis une autre session.",
      C: "Rejouer les journaux jusqu'au bout rejouerait aussi le DELETE fautif.",
    },
    aRetenir: "Contre une erreur humaine : sauvegarde complète + rejeu des journaux jusqu'à juste avant l'erreur (PITR).",
  },
  {
    id: 'BDD-SAV-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'difficile',
    enonce:
      "Le DBA d'une institution financière veut pouvoir restaurer une base PostgreSQL à n'importe quelle minute des 7 derniers jours. Aujourd'hui, la seule protection est le script ci-dessous, lancé chaque nuit. Que manque-t-il ?",
    extrait: {
      langage: 'shell',
      contenu: `$ pg_dump -Fc -f /sauvegardes/banque_$(date +%F).dump banque
$ ls /sauvegardes
banque_2026-10-12.dump  banque_2026-10-13.dump  banque_2026-10-14.dump`,
    },
    options: [
      { id: 'A', texte: 'Rien : il suffit de rejouer les fichiers WAL du serveur sur le dump restauré.' },
      { id: 'B', texte: 'Ajouter l’option --pitr à la commande pg_dump.' },
      { id: 'C', texte: 'Lancer pg_dump toutes les heures, ce qui offre la même finesse de restauration qu’un PITR.' },
      { id: 'D', texte: 'Une sauvegarde physique (pg_basebackup) et l’archivage continu des WAL.' },
    ],
    bonneReponse: 'D',
    explication:
      "pg_dump produit une sauvegarde logique (des ordres SQL et des données) : on peut la restaurer, mais pas y rejouer des WAL, qui décrivent des modifications de fichiers physiques. Le PITR exige une copie physique du cluster (pg_basebackup) et l'archivage continu des segments WAL depuis cette copie. Les dumps restent utiles en complément, par exemple pour restaurer une seule table.",
    pourquoiPas: {
      A: "Les WAL s'appliquent à une copie physique du répertoire de données, pas à une base recréée depuis un dump logique.",
      B: "pg_dump n'a pas d'option --pitr ; il ne capture qu'un instantané logique.",
      C: "Un dump horaire ramène le RPO à une heure au mieux, mais ne permet pas de choisir une minute précise ; il pèse aussi sur la production.",
    },
    aRetenir: "PITR = sauvegarde physique de base + archivage continu des journaux ; un dump logique ne suffit pas.",
  },
  {
    id: 'BDD-SAV-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'facile',
    enonce:
      "Depuis un an, les rapports quotidiens de sauvegarde de la Banque Beta affichent « OK ». Quelle action donne la meilleure assurance de pouvoir réellement récupérer les données ?",
    options: [
      { id: 'A', texte: 'Vérifier chaque jour que la taille des fichiers de sauvegarde reste stable' },
      { id: 'B', texte: 'Ajouter une seconde copie des sauvegardes sur le même serveur et comparer chaque jour leurs sommes de contrôle' },
      { id: 'C', texte: 'Restaurer périodiquement sur un serveur de test, contrôler l’intégrité et mesurer la durée' },
      { id: 'D', texte: 'Activer la compression des sauvegardes' },
    ],
    bonneReponse: 'C',
    explication:
      "Une sauvegarde n'a de valeur que si l'on a prouvé qu'elle se restaure. Le test de restauration vérifie la lisibilité des fichiers, la complétude de la chaîne de journaux, la cohérence de la base (contrôles d'intégrité, requêtes de vérification) et la durée réelle, à comparer au RTO. Il valide aussi la procédure écrite.",
    pourquoiPas: {
      A: "Une taille stable ne prouve pas que le contenu est lisible ni cohérent.",
      B: "Deux copies identiques peuvent être toutes deux inutilisables ; et une copie sur le même serveur disparaît avec lui (panne, rançongiciel).",
      D: "La compression économise de l'espace mais n'apporte aucune preuve de restaurabilité.",
    },
    aRetenir: "Une sauvegarde non testée est une hypothèse : testez la restauration régulièrement et chronométrez-la.",
  },
  {
    id: 'BDD-SAV-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'moyen',
    enonce:
      "Sur SQL Server, le DBA tente de sauvegarder le journal de transactions de la base `BanqueAlpha` et obtient le message ci-dessous. Que faut-il faire pour permettre les sauvegardes du journal et la restauration à un instant donné ?",
    extrait: {
      langage: 'log',
      contenu: `BACKUP LOG BanqueAlpha TO DISK = N'E:\\Sauvegardes\\BanqueAlpha_log.trn';

Msg 4208, Level 16, State 1, Line 1
The statement BACKUP LOG is not allowed while the recovery model is SIMPLE.
Use BACKUP DATABASE or change the recovery model using ALTER DATABASE.`,
    },
    options: [
      { id: 'A', texte: 'Réduire le fichier journal avec DBCC SHRINKFILE puis relancer la commande' },
      { id: 'B', texte: 'Ajouter l’option WITH TRUNCATE_ONLY à la commande BACKUP LOG' },
      { id: 'C', texte: 'Passer la base en mode de récupération FULL, puis faire une sauvegarde complète pour démarrer la chaîne de journaux' },
      { id: 'D', texte: 'Passer en mode BULK_LOGGED : les sauvegardes du journal sont alors possibles sans sauvegarde complète préalable' },
    ],
    bonneReponse: 'C',
    explication:
      "En mode SIMPLE, SQL Server tronque automatiquement le journal : aucune sauvegarde de journal n'est possible, donc pas de restauration à un instant donné. Après `ALTER DATABASE BanqueAlpha SET RECOVERY FULL`, il faut une sauvegarde complète (ou différentielle) pour amorcer la chaîne, puis planifier des BACKUP LOG réguliers. Ceux-ci empêchent aussi le journal de grossir sans fin.",
    pourquoiPas: {
      A: "Réduire le fichier ne change pas le mode de récupération : l'erreur se reproduirait.",
      B: "TRUNCATE_ONLY a été supprimé des versions modernes et, de toute façon, il jetait le journal au lieu de le sauvegarder.",
      D: "Quel que soit le mode, une sauvegarde complète est nécessaire pour démarrer la chaîne de journaux.",
    },
    aRetenir: "SQL Server : PITR seulement en mode FULL (ou BULK_LOGGED), avec une chaîne ininterrompue complète + journaux.",
  },
  {
    id: 'BDD-SAV-008',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sauvegarde & restauration',
    difficulte: 'difficile',
    enonce:
      "Une base de 1,2 To doit être restaurée intégralement depuis la sauvegarde complète. Le débit de restauration mesuré est de 250 Mo/s (1 To = 1 000 000 Mo). Le RTO contractuel est d'une heure. Est-il tenable ?",
    options: [
      { id: 'A', texte: 'Oui : environ 48 minutes' },
      { id: 'B', texte: 'Oui : environ 8 minutes' },
      { id: 'C', texte: 'Non : environ 8 heures' },
      { id: 'D', texte: 'Non : environ 1 h 20' },
    ],
    bonneReponse: 'D',
    explication:
      "1,2 To = 1 200 000 Mo ; 1 200 000 / 250 = 4 800 s, soit 80 minutes. Le RTO d'une heure est dépassé avant même le rejeu des journaux et les contrôles de cohérence. Il faut accélérer la restauration (stockage plus rapide, sauvegardes en parallèle) ou miser sur un secondaire répliqué prêt à prendre le relais.",
    pourquoiPas: {
      A: "48 minutes correspondrait à un débit de 1 200 000 / 2 880 ≈ 417 Mo/s, pas 250 Mo/s.",
      B: "8 minutes supposerait un débit de 2 500 Mo/s : c'est une erreur d'un facteur 10.",
      C: "8 heures correspondrait à 41,7 Mo/s environ, six fois moins que le débit mesuré.",
    },
    aRetenir: "Durée de restauration ≈ volume / débit ; comparez-la au RTO, en ajoutant le rejeu des journaux et les vérifications.",
  },

  // ───────────────────────── Haute disponibilité & réplication ─────────────────────────
  {
    id: 'BDD-HA-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'facile',
    enonce: "En réplication synchrone, à quel moment le COMMIT d'une transaction est-il confirmé à l'application ?",
    options: [
      { id: 'A', texte: 'Dès l’écriture sur le primaire ; le secondaire est mis à jour plus tard.' },
      { id: 'B', texte: 'Après que le secondaire a confirmé avoir reçu et écrit les données de la transaction.' },
      { id: 'C', texte: 'Après la prochaine sauvegarde du journal.' },
      { id: 'D', texte: 'Après un délai fixe de cinq secondes.' },
    ],
    bonneReponse: 'B',
    explication:
      "En mode synchrone, le primaire attend l'accusé de réception d'au moins un secondaire avant de confirmer le COMMIT. Aucune transaction validée n'est donc perdue si le primaire disparaît (RPO nul). En contrepartie, chaque validation subit la latence réseau aller-retour vers le secondaire.",
    pourquoiPas: {
      A: "C'est la définition de la réplication asynchrone.",
      C: "La réplication est indépendante des sauvegardes du journal.",
      D: "Aucun SGBD n'utilise un délai fixe : la confirmation arrive dès l'accusé de réception du secondaire.",
    },
    aRetenir: "Synchrone : RPO nul mais commit ralenti par la latence ; asynchrone : commit rapide mais perte possible.",
  },
  {
    id: 'BDD-HA-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'moyen',
    enonce:
      "Une banque réplique sa base vers un site de secours situé à plusieurs centaines de kilomètres, avec une liaison à forte latence. Le DBA choisit la réplication asynchrone. Quelle en est la conséquence ?",
    options: [
      { id: 'A', texte: 'Aucune perte de données n’est possible en cas de sinistre.' },
      { id: 'B', texte: 'Chaque COMMIT attend l’aller-retour réseau vers le site de secours.' },
      { id: 'C', texte: 'Le site de secours peut accepter des écritures en même temps que le primaire.' },
      { id: 'D', texte: 'Un commit rapide, mais un RPO supérieur à zéro en cas de sinistre.' },
    ],
    bonneReponse: 'D',
    explication:
      "En asynchrone, le primaire confirme le COMMIT sans attendre le secondaire : les performances ne dépendent pas de la distance. Mais le secondaire a toujours un léger retard ; si le primaire est détruit, les transactions pas encore transmises sont perdues (RPO supérieur à zéro). C'est le compromis habituel pour un site distant.",
    pourquoiPas: {
      A: "Seule la réplication synchrone garantit l'absence de perte de transactions validées.",
      B: "C'est le comportement de la réplication synchrone, que la latence rendrait ici pénalisante.",
      C: "Un secondaire répliqué est en lecture seule (ou inaccessible) ; écrire des deux côtés relève de configurations multi-maîtres spécifiques.",
    },
    aRetenir: "Site distant : souvent asynchrone, en acceptant un RPO de quelques secondes.",
  },
  {
    id: 'BDD-HA-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'facile',
    enonce:
      "Les rapports de la Banque Alpha sont lus sur une réplique en lecture seule, alimentée en asynchrone. Un agent ne voit pas une opération validée sur le primaire deux secondes plus tôt. Quelle est l'explication la plus probable ?",
    options: [
      { id: 'A', texte: 'Le retard de réplication : la réplique n’a pas encore appliqué cette transaction.' },
      { id: 'B', texte: 'La transaction a été annulée sur le primaire.' },
      { id: 'C', texte: 'Un index de la réplique est corrompu.' },
      { id: 'D', texte: 'Une réplique ne reçoit que les données de la veille.' },
    ],
    bonneReponse: 'A',
    explication:
      "Une réplique asynchrone applique les modifications avec un certain retard (lag), de quelques millisecondes à plusieurs minutes selon la charge et le réseau. Les lectures qui exigent la donnée la plus fraîche doivent aller sur le primaire. Le DBA surveille ce retard et alerte au-delà d'un seuil.",
    pourquoiPas: {
      B: "L'opération est décrite comme validée sur le primaire ; rien n'indique une annulation.",
      C: "Une corruption produirait des erreurs, pas un simple décalage de deux secondes.",
      D: "La réplication en continu transmet les changements au fil de l'eau, pas une fois par jour.",
    },
    aRetenir: "Réplique asynchrone = données légèrement en retard : surveillez le lag.",
  },
  {
    id: 'BDD-HA-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'moyen',
    enonce:
      "Dans un cluster de bases à deux nœuds, la liaison entre les nœuds est coupée. Chacun, ne voyant plus l'autre, se déclare primaire et accepte des écritures. Comment appelle-t-on ce phénomène et comment le prévenir ?",
    options: [
      { id: 'A', texte: 'Un interblocage ; on augmente le délai d’attente des verrous.' },
      { id: 'B', texte: 'Un retard de réplication ; on passe en mode synchrone pour que les deux nœuds restent identiques.' },
      { id: 'C', texte: 'Un retour arrière (failback) ; on redémarre les deux nœuds.' },
      { id: 'D', texte: 'Un « split-brain » ; on le prévient par un quorum et du fencing.' },
    ],
    bonneReponse: 'D',
    explication:
      "Le split-brain produit deux bases divergentes, très difficiles à réconcilier : une catastrophe pour des données financières. Un mécanisme de quorum impose qu'un nœud ne devienne primaire que s'il obtient la majorité des votes ; avec deux nœuds, on ajoute un témoin (ou arbitre). Le fencing isole l'ancien primaire pour qu'il ne puisse plus écrire.",
    pourquoiPas: {
      A: "Un interblocage concerne deux transactions sur une même base, pas deux nœuds qui se croient primaires.",
      B: "Le mode synchrone ne règle pas la question de savoir qui a le droit d'être primaire après une coupure.",
      C: "Le failback est le retour planifié vers le nœud d'origine ; redémarrer ne réconcilie pas les écritures divergentes.",
    },
    aRetenir: "Split-brain = deux primaires simultanés ; parade : quorum (nombre impair de votants) et fencing.",
  },
  {
    id: 'BDD-HA-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'moyen',
    enonce: "Sur le primaire PostgreSQL, le DBA consulte l'état de la réplication. Que conclure ?",
    extrait: {
      langage: 'texte',
      contenu: `SELECT client_addr, state, sync_state, replay_lag
FROM pg_stat_replication;

 client_addr |   state   | sync_state |   replay_lag
-------------+-----------+------------+-----------------
 10.20.0.12  | streaming | sync       | 00:00:00.004112
 10.30.0.15  | streaming | async      | 00:07:42.118306`,
    },
    options: [
      { id: 'A', texte: '10.30.0.15, asynchrone, a plus de 7 minutes de retard de rejeu.' },
      { id: 'B', texte: 'Les deux secondaires sont désynchronisés : l’état « streaming » signale une resynchronisation complète en cours.' },
      { id: 'C', texte: 'Le serveur 10.20.0.12 est le primaire du cluster.' },
      { id: 'D', texte: 'La réplication vers 10.30.0.15 est arrêtée.' },
    ],
    bonneReponse: 'A',
    explication:
      "Les deux secondaires sont connectés (state = streaming). 10.20.0.12 est synchrone et pratiquement à jour ; 10.30.0.15 est asynchrone et applique les changements avec plus de 7 minutes de retard. Les lectures qui y sont faites sont donc périmées, et un basculement vers lui serait plus long ou plus risqué : on vérifie le réseau, la charge disque et les requêtes longues sur ce secondaire.",
    pourquoiPas: {
      B: "« streaming » est l'état normal d'une réplication en continu ; 10.20.0.12 est d'ailleurs à jour à quelques millisecondes près.",
      C: "pg_stat_replication, consultée sur le primaire, liste les secondaires qui y sont connectés.",
      D: "L'état « streaming » indique que la réplication fonctionne ; elle est seulement en retard.",
    },
    aRetenir: "pg_stat_replication sur le primaire : état, mode (sync/async) et retard de chaque secondaire.",
  },
  {
    id: 'BDD-HA-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'difficile',
    enonce:
      "Un primaire PostgreSQL est configuré avec `synchronous_standby_names = 'standby1'` et `synchronous_commit = on`. Le seul secondaire synchrone, standby1, tombe en panne. Que se passe-t-il sur le primaire ?",
    options: [
      { id: 'A', texte: 'Il repasse automatiquement en asynchrone après un délai, puis redevient synchrone au retour de standby1.' },
      { id: 'B', texte: 'Les COMMIT restent en attente.' },
      { id: 'C', texte: 'Il s’arrête pour protéger les données.' },
      { id: 'D', texte: 'Il refuse immédiatement toute écriture avec une erreur.' },
    ],
    bonneReponse: 'B',
    explication:
      "PostgreSQL respecte strictement la promesse synchrone : sans secondaire capable d'acquitter, les transactions qui valident attendent indéfiniment, et l'application semble figée. On évite ce point de défaillance unique en déclarant plusieurs candidats, par exemple `ANY 1 (standby1, standby2)`. D'autres produits (semi-synchrone MySQL, par exemple) peuvent, eux, repasser en asynchrone après un délai.",
    pourquoiPas: {
      A: "PostgreSQL ne dégrade pas automatiquement en asynchrone ; il faut modifier la configuration.",
      C: "Le serveur continue de tourner et de servir les lectures ; seules les validations sont bloquées.",
      D: "Les écritures ne sont pas refusées : elles restent suspendues au moment du COMMIT.",
    },
    aRetenir: "Synchrone avec un seul secondaire = point de défaillance unique : prévoyez au moins deux candidats synchrones.",
  },
  {
    id: 'BDD-HA-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Haute disponibilité & réplication',
    difficulte: 'moyen',
    enonce:
      "Un développeur exécute par erreur `DROP TABLE beneficiaires;` sur le primaire. La base est répliquée en continu vers deux secondaires. Que se passe-t-il ?",
    options: [
      { id: 'A', texte: 'Les secondaires conservent la table, qui peut y être relue.' },
      { id: 'B', texte: 'Les secondaires refusent l’ordre, car il est destructif.' },
      { id: 'C', texte: 'Le cluster bascule automatiquement vers un secondaire intact.' },
      { id: 'D', texte: 'La table disparaît aussi sur les secondaires.' },
    ],
    bonneReponse: 'D',
    explication:
      "La réplication copie fidèlement toutes les modifications, y compris les erreurs. Elle protège contre la panne d'un serveur, pas contre l'erreur humaine, la corruption logique ou un rançongiciel agissant via la base. D'où la nécessité de sauvegardes indépendantes ; une réplique volontairement différée (par exemple d'une heure) offre une fenêtre de rattrapage supplémentaire.",
    pourquoiPas: {
      A: "Le DROP TABLE est transmis et appliqué en quelques instants sur les secondaires.",
      B: "Un secondaire applique ce qu'il reçoit sans juger de l'opportunité des ordres.",
      C: "Le primaire est en parfait état de marche : aucun basculement n'est déclenché, et les secondaires ont de toute façon perdu la table.",
    },
    aRetenir: "La réplication n'est pas une sauvegarde : elle propage aussi les erreurs.",
  },

  // ───────────────────────── Sécurité des bases de données ─────────────────────────
  {
    id: 'BDD-SEC-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'facile',
    enonce:
      "Un nouvel outil de reporting doit seulement lire trois vues de synthèse de la base de production. Quel accès lui attribuer ?",
    options: [
      { id: 'A', texte: 'Le rôle d’administrateur de la base, pour éviter les blocages' },
      { id: 'B', texte: 'Le droit SELECT sur toutes les tables du schéma' },
      { id: 'C', texte: 'Un compte dédié, membre d’un rôle qui n’a que SELECT sur ces trois vues' },
      { id: 'D', texte: 'Le compte de service de l’application principale, déjà configuré' },
    ],
    bonneReponse: 'C',
    explication:
      "Le principe du moindre privilège consiste à n'accorder que les droits strictement nécessaires. Un compte dédié permet aussi de tracer précisément ce que fait l'outil et de le révoquer sans toucher aux autres applications. Passer par des vues limite en outre les colonnes exposées.",
    pourquoiPas: {
      A: "Des droits d'administration permettraient de tout lire, modifier ou supprimer : un risque majeur si l'outil est compromis.",
      B: "L'outil n'a besoin que de trois vues ; donner toutes les tables expose des données sensibles inutilement.",
      D: "Partager un compte de service empêche de savoir qui a fait quoi et donne à l'outil les droits d'écriture de l'application.",
    },
    aRetenir: "Moindre privilège : un compte par usage, un rôle avec uniquement les droits nécessaires.",
  },
  {
    id: 'BDD-SEC-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'facile',
    enonce: "Sous PostgreSQL, quelle commande retire au rôle `guichet` le droit de supprimer des lignes de la table `operations` ?",
    options: [
      { id: 'A', texte: 'DROP DELETE ON operations FROM guichet;' },
      { id: 'B', texte: 'GRANT NO DELETE ON operations TO guichet;' },
      { id: 'C', texte: 'REVOKE DELETE ON operations FROM guichet;' },
      { id: 'D', texte: 'REVOKE DELETE FROM guichet ON operations;' },
    ],
    bonneReponse: 'C',
    explication:
      "La syntaxe standard est `REVOKE privilège ON objet FROM rôle`, symétrique de `GRANT privilège ON objet TO rôle`. Attention : si le rôle hérite du même droit via un autre rôle dont il est membre, il faut aussi agir sur ce rôle-là.",
    pourquoiPas: {
      A: "DROP supprime des objets (tables, rôles…) ; il ne sert pas à retirer un droit.",
      B: "« GRANT NO » n'existe pas : on retire un droit avec REVOKE.",
      D: "L'ordre des clauses est inversé : ON objet vient avant FROM rôle.",
    },
    aRetenir: "GRANT … ON … TO … pour accorder, REVOKE … ON … FROM … pour retirer.",
  },
  {
    id: 'BDD-SEC-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'moyen',
    enonce:
      "En analysant le journal des requêtes, le DBA relève l'instruction ci-dessous, émise par l'application web de consultation de comptes. Que doit-il recommander en priorité ?",
    extrait: {
      langage: 'log',
      contenu: `2026-10-21 09:14:03 LOG:  statement: SELECT * FROM clients WHERE numero_compte = '' OR '1'='1' --'`,
    },
    options: [
      { id: 'A', texte: 'Imposer des requêtes paramétrées dans l’application' },
      { id: 'B', texte: 'Augmenter la taille du journal pour garder plus d’historique' },
      { id: 'C', texte: 'Chiffrer la colonne numero_compte avec le chiffrement transparent (TDE)' },
      { id: 'D', texte: 'Créer un index sur numero_compte' },
    ],
    bonneReponse: 'A',
    explication:
      "La saisie `' OR '1'='1' --` a été concaténée dans la requête : c'est une injection SQL, qui renvoie ici tous les clients. Avec une requête paramétrée, la valeur saisie est transmise comme donnée et ne peut plus modifier la structure de la requête. Côté base, le moindre privilège limite les dégâts d'une injection qui passerait malgré tout.",
    pourquoiPas: {
      B: "Garder plus de journaux aide l'enquête mais ne corrige pas la faille.",
      C: "TDE chiffre les fichiers sur disque ; la base déchiffre de façon transparente pour toute requête autorisée, y compris injectée.",
      D: "Un index accélère la requête, il ne la sécurise pas.",
    },
    aRetenir: "Contre l'injection SQL : requêtes paramétrées côté application, moindre privilège côté base.",
  },
  {
    id: 'BDD-SEC-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'moyen',
    enonce: "Contre quel risque le chiffrement transparent des données (TDE, Transparent Data Encryption) protège-t-il principalement ?",
    options: [
      { id: 'A', texte: 'Un utilisateur authentifié qui lit des données sensibles avec un SELECT' },
      { id: 'B', texte: 'Une injection SQL dans l’application web' },
      { id: 'C', texte: 'Le vol des fichiers de données ou des sauvegardes (disques, bandes, copies)' },
      { id: 'D', texte: 'L’interception du trafic entre l’application et la base' },
    ],
    bonneReponse: 'C',
    explication:
      "TDE chiffre les données au repos : fichiers de données, journaux et, selon le SGBD, sauvegardes. Un disque ou un fichier volé est illisible sans la clé, conservée à part (portefeuille, module matériel). En revanche, pour toute session autorisée, la base déchiffre automatiquement : TDE ne remplace ni le contrôle d'accès ni TLS.",
    pourquoiPas: {
      A: "Le déchiffrement est transparent pour toute session autorisée : TDE ne restreint pas ce qu'un utilisateur peut lire.",
      B: "Une requête injectée passe par la base, qui déchiffre normalement les données.",
      D: "Le chiffrement des échanges réseau relève de TLS, pas de TDE.",
    },
    aRetenir: "TDE = chiffrement au repos contre le vol de supports ; TLS = chiffrement en transit ; les droits = contrôle d'accès.",
  },
  {
    id: 'BDD-SEC-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'facile',
    enonce:
      "L'équipe de développement demande une copie de la base de production pour tester une nouvelle version. Quelle pratique adopter ?",
    options: [
      { id: 'A', texte: 'Livrer une copie brute, à condition que les développeurs signent une charte' },
      { id: 'B', texte: 'Leur donner un accès en lecture directement à la production' },
      { id: 'C', texte: 'Livrer une copie brute en supprimant seulement les index pour réduire sa taille' },
      { id: 'D', texte: 'Masquer ou pseudonymiser les données personnelles et sensibles avant de livrer la copie' },
    ],
    bonneReponse: 'D',
    explication:
      "Les environnements de test sont moins protégés que la production : ils ne doivent pas contenir de vraies données de clients. Le masquage remplace noms, numéros de compte ou téléphones par des valeurs fictives mais réalistes, en conservant les formats et les liens entre tables. Les tests restent pertinents sans exposer les clients.",
    pourquoiPas: {
      A: "Une charte ne protège pas les données si l'environnement de test est compromis.",
      B: "Un accès à la production pour des tests expose les données réelles et fait courir un risque à l'exploitation.",
      C: "Supprimer des index ne retire aucune donnée sensible.",
    },
    aRetenir: "Pas de données réelles hors production : masquez ou pseudonymisez les copies.",
  },
  {
    id: 'BDD-SEC-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'difficile',
    enonce:
      "Sous PostgreSQL, le DBA a accordé des droits au rôle `lecteur`. Une semaine plus tard, il crée la table `rapports.encours_mensuels` et `lecteur` reçoit l'erreur ci-dessous. Pourquoi, et comment l'éviter à l'avenir ?",
    extrait: {
      langage: 'sql',
      contenu: `GRANT USAGE ON SCHEMA rapports TO lecteur;
GRANT SELECT ON ALL TABLES IN SCHEMA rapports TO lecteur;

-- une semaine plus tard, connecté en lecteur :
SELECT * FROM rapports.encours_mensuels;
-- ERROR:  permission denied for table encours_mensuels`,
    },
    options: [
      { id: 'A', texte: 'Le rôle lecteur doit être superutilisateur pour lire un schéma entier.' },
      { id: 'B', texte: 'Le droit USAGE sur le schéma expire au bout de sept jours.' },
      { id: 'C', texte: 'Les GRANT sur un schéma ne s’appliquent qu’après un redémarrage du serveur ou un rechargement de la configuration.' },
      { id: 'D', texte: 'Le GRANT ne visait que les tables existantes : utiliser ALTER DEFAULT PRIVILEGES.' },
    ],
    bonneReponse: 'D',
    explication:
      "`GRANT … ON ALL TABLES IN SCHEMA` est appliqué une fois, aux tables présentes à ce moment-là. Pour les futures tables, on définit des privilèges par défaut : `ALTER DEFAULT PRIVILEGES IN SCHEMA rapports GRANT SELECT ON TABLES TO lecteur;`, exécuté par le rôle qui crée les tables (ou avec FOR ROLE). En attendant, il suffit de relancer le GRANT sur la nouvelle table.",
    pourquoiPas: {
      A: "Donner le statut de superutilisateur pour une simple lecture violerait gravement le moindre privilège.",
      B: "Les droits PostgreSQL n'expirent pas ; USAGE reste accordé.",
      C: "Les GRANT prennent effet immédiatement, sans redémarrage ni rechargement.",
    },
    aRetenir: "PostgreSQL : GRANT ON ALL TABLES vaut pour l'existant ; ALTER DEFAULT PRIVILEGES pour les objets futurs.",
  },
  {
    id: 'BDD-SEC-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Sécurité des bases de données',
    difficulte: 'moyen',
    enonce:
      "L'audit interne veut savoir, pour toute modification de la table des taux de change, qui l'a faite et quand. Aujourd'hui, tous les administrateurs utilisent le même compte « admin ». Quelle mesure répond à l'exigence ?",
    options: [
      { id: 'A', texte: 'Changer le mot de passe du compte « admin » chaque mois' },
      { id: 'B', texte: 'Activer uniquement le journal des erreurs du SGBD' },
      { id: 'C', texte: 'Des comptes nominatifs et un audit protégé des modifications de la table' },
      { id: 'D', texte: 'Sauvegarder la table chaque nuit et comparer les versions successives pour repérer les modifications' },
    ],
    bonneReponse: 'C',
    explication:
      "La traçabilité exige d'abord l'imputabilité : un compte partagé rend impossible de savoir qui a agi. Ensuite, l'audit natif du SGBD (pgAudit, Unified Auditing d'Oracle, SQL Server Audit…) enregistre les ordres sur la table sensible. Le journal doit être exporté vers un système que les administrateurs de la base ne contrôlent pas, pour qu'ils ne puissent pas effacer leurs propres traces.",
    pourquoiPas: {
      A: "Changer le mot de passe ne dit toujours pas lequel des administrateurs a agi.",
      B: "Le journal des erreurs ne trace pas les modifications réussies.",
      D: "Comparer des sauvegardes montre ce qui a changé, mais ni qui l'a fait ni à quel moment exact.",
    },
    aRetenir: "Audit utile = comptes nominatifs + journal d'audit protégé, hors de portée des administrateurs audités.",
  },

  // ───────────────────────────── Exploitation & supervision ─────────────────────────────
  {
    id: 'BDD-EXP-001',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'facile',
    enonce: "Sous PostgreSQL, quel est le rôle principal de l'opération VACUUM (lancée manuellement ou par l'autovacuum) ?",
    options: [
      { id: 'A', texte: 'Supprimer les tables qui ne sont plus utilisées' },
      { id: 'B', texte: 'Faire une sauvegarde rapide de la base' },
      { id: 'C', texte: 'Recycler l’espace des lignes mortes laissées par MVCC' },
      { id: 'D', texte: 'Réorganiser physiquement les fichiers de la table pour les rendre contigus sur le disque' },
    ],
    bonneReponse: 'C',
    explication:
      "Avec MVCC, un UPDATE ou un DELETE laisse l'ancienne version de la ligne en place, jusqu'à ce qu'aucune transaction n'en ait plus besoin. VACUUM marque cet espace comme réutilisable, met à jour la carte de visibilité et prévient le bouclage des identifiants de transaction. Sans lui, les tables gonflent et les performances se dégradent.",
    pourquoiPas: {
      A: "VACUUM ne supprime aucune table ; il nettoie l'intérieur des tables existantes.",
      B: "VACUUM n'a rien d'une sauvegarde.",
      D: "VACUUM ne déplace pas les fichiers sur le disque : il marque de l'espace comme réutilisable à l'intérieur des pages.",
    },
    aRetenir: "PostgreSQL : VACUUM recycle l'espace des lignes mortes ; surveillez que l'autovacuum suit le rythme.",
  },
  {
    id: 'BDD-EXP-002',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'moyen',
    enonce:
      "Le contrôle d'intégrité hebdomadaire de la base SQL Server `BanqueAlpha` se termine par les lignes ci-dessous. Quelle est la bonne première réaction ?",
    extrait: {
      langage: 'log',
      contenu: `DBCC CHECKDB (N'BanqueAlpha') WITH NO_INFOMSGS;
(...)
CHECKDB found 0 allocation errors and 2 consistency errors in database 'BanqueAlpha'.
repair_allow_data_loss is the minimum repair level for the errors found by DBCC CHECKDB (BanqueAlpha).`,
    },
    options: [
      { id: 'A', texte: 'Lancer immédiatement REPAIR_ALLOW_DATA_LOSS, puisque CHECKDB l’indique comme niveau de réparation minimal' },
      { id: 'B', texte: 'Ignorer l’alerte : deux erreurs sur une grande base sont négligeables' },
      { id: 'C', texte: 'Chercher la cause matérielle et restaurer depuis une sauvegarde saine' },
      { id: 'D', texte: 'Redémarrer l’instance pour que les erreurs disparaissent' },
    ],
    bonneReponse: 'C',
    explication:
      "Une corruption signale presque toujours un problème du sous-système de stockage (disque, contrôleur, pilote) : il faut l'investiguer, sinon elle reviendra. REPAIR_ALLOW_DATA_LOSS, comme son nom l'indique, peut supprimer des données : c'est un dernier recours. La voie normale est de restaurer depuis une sauvegarde saine (éventuellement seulement les pages touchées) puis de rejouer les journaux.",
    pourquoiPas: {
      A: "Cette réparation peut effacer des lignes de façon irréversible ; on la réserve aux cas sans sauvegarde exploitable.",
      B: "Toute corruption est grave dans une base bancaire et tend à s'étendre si la cause matérielle persiste.",
      D: "Un redémarrage ne répare pas des pages corrompues sur disque.",
    },
    aRetenir: "Corruption détectée : chercher la cause matérielle, restaurer depuis une sauvegarde saine ; réparer avec perte en tout dernier recours.",
  },
  {
    id: 'BDD-EXP-003',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'moyen',
    enonce:
      "Les écritures échouent sur une base SQL Server en mode de récupération FULL avec l'erreur « The transaction log for database 'BanqueAlpha' is full due to 'LOG_BACKUP' ». On découvre que la tâche de sauvegarde du journal est désactivée depuis trois semaines. Quelle est l'action correcte ?",
    options: [
      { id: 'A', texte: 'Supprimer le fichier journal (.ldf) pour libérer de l’espace' },
      { id: 'B', texte: 'Sauvegarder le journal, puis réactiver et superviser la tâche' },
      { id: 'C', texte: 'Passer définitivement la base en mode SIMPLE, où le journal est tronqué automatiquement à chaque point de contrôle' },
      { id: 'D', texte: 'Redémarrer l’instance SQL Server' },
    ],
    bonneReponse: 'B',
    explication:
      "En mode FULL, l'espace du journal n'est réutilisable qu'une fois les enregistrements sauvegardés : LOG_BACKUP indique exactement que c'est ce qui manque. La sauvegarde du journal libère l'espace interne (le fichier peut ensuite être réduit si nécessaire). Surtout, il faut une alerte sur l'échec ou l'absence de cette tâche.",
    pourquoiPas: {
      A: "Supprimer le journal d'une base en service peut la rendre inutilisable et faire perdre des transactions.",
      C: "Le mode SIMPLE supprime la restauration à un instant donné, ce qui est rarement acceptable pour une base bancaire.",
      D: "Le redémarrage ne libère pas le journal : la cause (absence de sauvegarde) reste entière.",
    },
    aRetenir: "Journal plein « due to LOG_BACKUP » : sauvegardez le journal et supervisez la tâche de sauvegarde.",
  },
  {
    id: 'BDD-EXP-004',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'facile',
    enonce:
      "Une base occupe 400 Go sur un volume de 600 Go. Elle croît régulièrement de 12 Go par mois. L'alerte de supervision se déclenche à 80 % d'occupation du volume. Dans combien de temps sera-t-elle déclenchée ?",
    options: [
      { id: 'A', texte: 'Dans environ 5 mois' },
      { id: 'B', texte: 'Dans moins de 7 mois' },
      { id: 'C', texte: 'Dans environ 17 mois' },
      { id: 'D', texte: 'Dans environ 40 mois' },
    ],
    bonneReponse: 'B',
    explication:
      "Le seuil vaut 80 % × 600 = 480 Go. Il reste 480 − 400 = 80 Go avant l'alerte, soit 80 / 12 ≈ 6,7 mois. Ce calcul de tendance permet de commander de l'espace avant l'urgence, en tenant compte des délais d'achat.",
    pourquoiPas: {
      A: "5 mois correspondrait à 60 Go de marge ; or la marge jusqu'au seuil est de 80 Go.",
      C: "17 mois environ, c'est le temps pour remplir entièrement le volume (200 / 12), pas pour atteindre le seuil de 80 %.",
      D: "40 mois revient à diviser le seuil (480 Go) par la croissance, en oubliant les 400 Go déjà occupés.",
    },
    aRetenir: "Délai avant seuil = (capacité × seuil − occupation actuelle) / croissance mensuelle.",
  },
  {
    id: 'BDD-EXP-005',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'moyen',
    enonce: "Le DBA inspecte les sessions d'une base PostgreSQL dont les tables gonflent anormalement. Pourquoi la session 7731 est-elle préoccupante ?",
    extrait: {
      langage: 'texte',
      contenu: `SELECT pid, usename, state, now() - xact_start AS duree_tx
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY duree_tx DESC;

 pid  | usename  |        state        | duree_tx
------+----------+---------------------+----------
 7731 | etl_nuit | idle in transaction | 06:12:44
 8120 | appli    | active              | 00:00:01`,
    },
    options: [
      { id: 'A', texte: 'Sa transaction ouverte depuis 6 h bloque VACUUM et retient des verrous.' },
      { id: 'B', texte: 'Elle exécute depuis plus de 6 h une requête active qui monopolise le processeur du serveur.' },
      { id: 'C', texte: 'Elle est déjà déconnectée et sera nettoyée automatiquement.' },
      { id: 'D', texte: 'Elle n’est pas préoccupante : « idle » signifie qu’elle n’a aucun impact.' },
    ],
    bonneReponse: 'A',
    explication:
      "« idle in transaction » signifie qu'une transaction a été ouverte puis laissée sans COMMIT ni ROLLBACK. Tant qu'elle dure, VACUUM ne peut pas supprimer les versions de lignes qu'elle pourrait encore voir, d'où le gonflement, et ses verrous bloquent d'autres sessions. On corrige le traitement ETL et on peut fixer `idle_in_transaction_session_timeout`.",
    pourquoiPas: {
      B: "Une session « idle in transaction » n'exécute rien : elle ne consomme pas de processeur.",
      C: "La session est bien connectée ; elle ne sera fermée que par un délai configuré ou une intervention.",
      D: "C'est l'état « idle » simple qui est sans impact ; « idle in transaction » garde une transaction ouverte.",
    },
    aRetenir: "« idle in transaction » qui dure = verrous retenus et VACUUM bloqué : à traquer et à limiter par un délai.",
  },
  {
    id: 'BDD-EXP-006',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'difficile',
    enonce:
      "Sous PostgreSQL, après un DELETE de 60 % des lignes d'une table d'archives de 200 Go suivi d'un VACUUM, l'espace disque occupé n'a quasiment pas diminué. Comment rendre cet espace au système de fichiers ?",
    options: [
      { id: 'A', texte: 'Réécrire la table avec VACUUM FULL ou pg_repack' },
      { id: 'B', texte: 'Lancer ANALYZE sur la table' },
      { id: 'C', texte: 'Supprimer manuellement les anciens fichiers du répertoire pg_wal' },
      { id: 'D', texte: 'Lancer un second VACUUM simple, qui réduira le fichier' },
    ],
    bonneReponse: 'A',
    explication:
      "Un VACUUM simple rend l'espace réutilisable par la table elle-même, mais ne réduit le fichier que pour les pages vides situées à sa toute fin. VACUUM FULL réécrit la table dans un nouveau fichier compact : il pose un verrou exclusif pendant toute l'opération et a besoin temporairement de l'espace de la nouvelle copie. pg_repack obtient le même résultat avec un verrouillage beaucoup plus court.",
    pourquoiPas: {
      B: "ANALYZE met à jour les statistiques de l'optimiseur ; il ne libère aucun espace.",
      C: "Supprimer des WAL à la main peut corrompre l'instance ou casser la réplication et l'archivage ; et ce n'est pas là que se trouve l'espace de la table.",
      D: "Un nouveau VACUUM simple ne fera pas mieux que le premier : l'espace reste réservé à la table.",
    },
    aRetenir: "VACUUM simple = espace réutilisable par la table ; VACUUM FULL / pg_repack = espace rendu au disque, mais réécriture lourde.",
  },
  {
    id: 'BDD-EXP-007',
    section: 'technique',
    filiere: 'bdd',
    competence: 'Exploitation & supervision',
    difficulte: 'moyen',
    enonce:
      "Depuis la nouvelle version de l'application mobile de la Banque Beta, ce message apparaît aux heures de pointe dans le journal PostgreSQL et des clients ne peuvent plus se connecter. Quelle solution est la plus saine ?",
    extrait: {
      langage: 'log',
      contenu: `FATAL:  sorry, too many clients already`,
    },
    options: [
      { id: 'A', texte: 'Porter max_connections à 10 000' },
      { id: 'B', texte: 'Redémarrer le serveur toutes les heures' },
      { id: 'C', texte: 'Désactiver l’authentification pour accélérer les connexions' },
      { id: 'D', texte: 'Utiliser un pool de connexions (applicatif ou PgBouncer) et corriger les connexions non refermées' },
    ],
    bonneReponse: 'D',
    explication:
      "Le nombre maximal de connexions (max_connections) est atteint. Sous PostgreSQL, chaque connexion est un processus qui consomme de la mémoire : multiplier les connexions dégrade le serveur. Un pool partage un petit nombre de connexions entre de nombreuses requêtes ; il faut aussi rechercher la fuite (connexions ouvertes et jamais refermées) introduite par la nouvelle version.",
    pourquoiPas: {
      A: "Des milliers de processus satureraient la mémoire et le processeur du serveur ; on déplace le problème sans le résoudre.",
      B: "Les redémarrages coupent les transactions en cours et ne corrigent pas la fuite de connexions.",
      C: "Désactiver l'authentification serait une faille de sécurité majeure, sans effet sur la limite de connexions.",
    },
    aRetenir: "Trop de connexions : pool de connexions et chasse aux fuites, plutôt qu'un max_connections démesuré.",
  },
];
