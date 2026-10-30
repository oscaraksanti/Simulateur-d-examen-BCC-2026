// Banque technique — filière NUMÉRIQUE (préfixe NUM) : 60 questions QCM.
// Transformation numérique, projets agiles, services financiers numériques, cloud, IA, UX, gouvernance et hygiène numérique.
// Contextes fictifs (« Banque Alpha », une microfinance de Kinshasa, une administration) ; principes généraux, sans référence juridique précise.
import type { QcmQuestion } from '@/lib/types';

export const banqueTechniqueNumerique: QcmQuestion[] = [
  // ───────────────────────────── Transformation numérique ─────────────────────────────
  {
    id: 'NUM-TRN-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'facile',
    enonce:
      "Une administration de Kinshasa annonce qu'elle va « dématérialiser » la délivrance d'une attestation, aujourd'hui demandée au guichet avec un formulaire papier. Quelle démarche correspond réellement à une dématérialisation du processus ?",
    options: [
      { id: 'A', texte: "Scanner les formulaires une fois remplis et les archiver en PDF" },
      { id: 'B', texte: "Publier le formulaire en PDF, à imprimer puis à déposer au guichet" },
      { id: 'C', texte: "Permettre le dépôt en ligne, le suivi du dossier et la réponse numérique" },
      { id: 'D', texte: "Remplacer le registre papier du guichet par un tableur partagé entre agents" },
    ],
    bonneReponse: 'C',
    explication:
      "Dématérialiser un processus, c'est le traiter de bout en bout sous forme numérique : dépôt, instruction, suivi et réponse. Numériser un document papier ou outiller une seule étape ne change pas le parcours de l'usager, qui doit toujours se déplacer.",
    pourquoiPas: {
      A: "C'est de la numérisation d'archives : le dépôt reste papier et l'usager se déplace toujours.",
      B: "Le formulaire est téléchargeable, mais le dépôt, le traitement et la réponse restent physiques.",
      D: "Le tableur outille le back-office sans rien changer au parcours de l'usager.",
    },
    aRetenir: "Numériser un document n'est pas dématérialiser un processus : le parcours entier doit devenir numérique.",
  },
  {
    id: 'NUM-TRN-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'facile',
    enonce:
      "La direction des opérations de Banque Alpha veut « digitaliser » l'ouverture de compte, jugée trop lente par les clients. Par quoi faut-il commencer ?",
    options: [
      { id: 'A', texte: "Cartographier le processus actuel et ses points de blocage" },
      { id: 'B', texte: "Choisir le logiciel de l'éditeur le plus connu du marché" },
      { id: 'C', texte: "Équiper toutes les agences de tablettes pour les conseillers" },
      { id: 'D', texte: "Préparer la campagne de communication de la nouvelle offre" },
    ],
    bonneReponse: 'A',
    explication:
      "Avant de choisir un outil, on décrit le processus tel qu'il est (étapes, acteurs, documents, délais) pour repérer les irritants et les étapes inutiles. Digitaliser un processus mal compris revient à automatiser ses défauts.",
    pourquoiPas: {
      B: "Le choix d'une solution vient après l'analyse du besoin, pas avant ; la notoriété ne garantit pas l'adéquation.",
      C: "Acheter du matériel avant de connaître le processus cible risque de ne rien régler.",
      D: "Communiquer sur une offre qui n'est pas encore conçue est prématuré.",
    },
    aRetenir: "D'abord comprendre et simplifier le processus, ensuite choisir l'outil.",
  },
  {
    id: 'NUM-TRN-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'moyen',
    enonce:
      "Sur un trimestre, une microfinance de Kinshasa a reçu 6 000 demandes de crédit, dont 4 500 déposées via son application mobile. Le délai moyen de traitement est passé de 10 jours à 4 jours. Quels indicateurs doit-elle présenter à son conseil ?",
    options: [
      { id: 'A', texte: "75 % de demandes en ligne ; délai réduit de 60 %" },
      { id: 'B', texte: "75 % de demandes en ligne ; délai réduit de 40 %" },
      { id: 'C', texte: "33 % de demandes en ligne ; délai réduit de 60 %" },
      { id: 'D', texte: "25 % de demandes en ligne ; délai réduit de 150 %" },
    ],
    bonneReponse: 'A',
    explication:
      "Taux de dématérialisation : 4 500 / 6 000 = 75 %. Variation du délai : (4 − 10) / 10 = −60 %, soit une réduction de 60 %. Une variation se calcule toujours par rapport à la valeur de départ.",
    pourquoiPas: {
      B: "40 % correspond au rapport 4 / 10 : c'est la part du délai restant, pas la réduction.",
      C: "33 % est le rapport 1 500 / 4 500 (papier sur en ligne), qui n'est pas une part du total.",
      D: "25 % est la part des demandes papier, et 150 % résulte d'un calcul fait par rapport à la valeur d'arrivée (6 / 4).",
    },
    aRetenir: "Variation en % = (valeur finale − valeur initiale) / valeur initiale.",
  },
  {
    id: 'NUM-TRN-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'moyen',
    enonce:
      "Banque Alpha hésite à investir dans une application d'épargne destinée aux commerçantes des marchés. Le comité propose de « commencer par un MVP ». De quoi s'agit-il ?",
    options: [
      { id: 'A', texte: "Livrer une première version réduite mais utile, et apprendre des retours" },
      { id: 'B', texte: "Tout développer d'abord, puis présenter le produit complet aux futurs clients" },
      { id: 'C', texte: "Proposer l'application gratuitement, puis la rendre payante plus tard" },
      { id: 'D', texte: "Confier le projet au prestataire le moins cher pour limiter le risque" },
    ],
    bonneReponse: 'A',
    explication:
      "Le MVP (produit minimum viable) est la plus petite version qui rend un vrai service et permet de tester les hypothèses auprès d'utilisateurs réels. On mesure l'usage, on écoute les retours, puis on décide d'enrichir, de corriger ou d'abandonner, avant d'avoir tout investi.",
    pourquoiPas: {
      B: "C'est l'approche « tunnel » que le MVP cherche justement à éviter : le risque n'est découvert qu'à la fin.",
      C: "Il s'agit d'un modèle tarifaire (freemium), sans lien avec la notion de produit minimum.",
      D: "Le choix du prestataire est une décision d'achat ; il ne réduit pas l'incertitude sur le besoin.",
    },
    aRetenir: "MVP : la plus petite version utile, mise entre les mains de vrais utilisateurs pour apprendre vite.",
  },
  {
    id: 'NUM-TRN-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'moyen',
    enonce:
      "Six mois après le déploiement d'un outil de gestion électronique du courrier dans une administration, la moitié des agents continuent de tenir leurs registres papier. Quelle action est la plus adaptée ?",
    options: [
      { id: 'A', texte: "Retirer tous les registres du jour au lendemain pour imposer l'outil" },
      { id: 'B', texte: "Recueillir les freins, former et s'appuyer sur des relais internes" },
      { id: 'C', texte: "Remplacer l'outil par un logiciel plus récent du marché" },
      { id: 'D', texte: "Ajouter de nouvelles fonctionnalités pour rendre l'outil attractif" },
    ],
    bonneReponse: 'B',
    explication:
      "Une faible adoption relève de la conduite du changement : il faut comprendre pourquoi les agents résistent (formation insuffisante, outil lent, double saisie exigée, peur de perdre une preuve), y répondre, et s'appuyer sur des référents de proximité. La technique n'est souvent pas la cause.",
    pourquoiPas: {
      A: "La contrainte brutale sans accompagnement crée des contournements et des erreurs, sans lever les causes du rejet.",
      C: "Changer d'outil sans connaître les freins a de fortes chances de reproduire le même échec.",
      D: "Ajouter des fonctions complique l'outil alors que les agents n'utilisent pas encore les fonctions de base.",
    },
    aRetenir: "Un outil non adopté est d'abord un problème de conduite du changement : écouter, former, accompagner.",
  },
  {
    id: 'NUM-TRN-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'moyen',
    enonce:
      "Une administration lance un service en ligne de paiement de taxes. Une partie du public visé vit dans des zones à faible couverture Internet et ne possède qu'un téléphone basique. Quelle mesure rend le service le plus inclusif ?",
    options: [
      { id: 'A', texte: "Réserver le service à l'application mobile pour réduire les coûts" },
      { id: 'B', texte: "Exiger une adresse e-mail personnelle pour chaque inscription" },
      { id: 'C', texte: "Enrichir les pages de vidéos explicatives pour guider l'usager" },
      { id: 'D', texte: "Garder un canal accessible sans Internet (USSD, agent, guichet)" },
    ],
    bonneReponse: 'D',
    explication:
      "L'USSD fonctionne sur tout téléphone, même sans smartphone ni données mobiles, et un canal assisté (agent, guichet) aide les personnes peu à l'aise avec le numérique. L'inclusion numérique consiste à ne laisser personne sans accès au service.",
    pourquoiPas: {
      A: "Une application suppose un smartphone et une connexion : elle exclut précisément le public décrit.",
      B: "Beaucoup d'usagers n'ont pas d'adresse e-mail ; c'est une barrière à l'entrée supplémentaire.",
      C: "Les vidéos alourdissent les pages et sont inutilisables avec une faible bande passante.",
    },
    aRetenir: "Inclusion numérique : prévoir un canal sans Internet ou assisté pour ceux qui n'ont ni smartphone ni connexion.",
  },
  {
    id: 'NUM-TRN-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Transformation numérique',
    difficulte: 'difficile',
    enonce:
      "Pour remplacer la signature manuscrite des contrats de prêt, la direction juridique de Banque Alpha exige une solution qui identifie le signataire ET permette de détecter toute modification du document après signature. Quelle solution répond aux deux exigences ?",
    options: [
      { id: 'A', texte: "Insérer l'image scannée de la signature manuscrite dans le PDF" },
      { id: 'B', texte: "Une signature numérique fondée sur un certificat et une empreinte du document" },
      { id: 'C', texte: "Considérer la réponse « Lu et approuvé » à l'e-mail du contrat comme signature" },
      { id: 'D', texte: "Protéger le PDF par un mot de passe envoyé au client par SMS" },
    ],
    bonneReponse: 'B',
    explication:
      "Une signature numérique calcule une empreinte (hash) du document, chiffrée avec la clé privée du signataire, liée à son identité par un certificat. Toute modification ultérieure du document change l'empreinte et rend la signature invalide à la vérification : on obtient à la fois l'identification et l'intégrité.",
    pourquoiPas: {
      A: "Une image de signature se copie et se colle sur n'importe quel document ; elle ne protège pas l'intégrité du contenu.",
      C: "Un e-mail prouve mal l'identité de l'expéditeur et ne garantit pas que le contrat n'a pas été modifié ensuite.",
      D: "Un mot de passe protège l'ouverture du fichier (confidentialité) mais n'identifie pas qui a consenti au contrat.",
    },
    aRetenir: "Signature numérique = empreinte du document + clé privée + certificat : identité du signataire et intégrité.",
  },

  // ───────────────────────────── Gestion de projet & agilité ─────────────────────────────
  {
    id: 'NUM-PRJ-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'facile',
    enonce:
      "Dans une équipe Scrum qui développe le nouveau portail client de Banque Alpha, qui décide de l'ordre de priorité des éléments du Product Backlog ?",
    options: [
      { id: 'A', texte: "Le Scrum Master, garant de la méthode" },
      { id: 'B', texte: "Les développeurs, par vote à chaque sprint" },
      { id: 'C', texte: "Le directeur informatique de la banque" },
      { id: 'D', texte: "Le Product Owner de l'équipe" },
    ],
    bonneReponse: 'D',
    explication:
      "Le Product Owner est responsable de maximiser la valeur du produit : il gère et ordonne le Product Backlog, en tenant compte des besoins métier. Les développeurs estiment et s'organisent pour réaliser le travail ; le Scrum Master facilite et lève les obstacles.",
    pourquoiPas: {
      A: "Le Scrum Master accompagne l'équipe et veille à l'application de Scrum ; il ne fixe pas les priorités du produit.",
      B: "Les développeurs décident du « comment » et de la quantité de travail qu'ils prennent, pas de l'ordre de valeur.",
      C: "Un responsable hiérarchique peut exprimer des attentes, mais l'arbitrage du backlog revient au Product Owner.",
    },
    aRetenir: "Product Owner : le « quoi » et l'ordre ; développeurs : le « comment » ; Scrum Master : le cadre.",
  },
  {
    id: 'NUM-PRJ-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'facile',
    enonce: "Laquelle de ces formulations est une user story correctement rédigée ?",
    options: [
      { id: 'A', texte: "« En tant que caissier, je veux retrouver un client par son téléphone pour le servir plus vite »" },
      { id: 'B', texte: "« Le système doit stocker les clients dans PostgreSQL avec un index sur la colonne téléphone »" },
      { id: 'C', texte: "« Améliorer de façon générale la rapidité de l'application de caisse »" },
      { id: 'D', texte: "« Le développeur ajoute un bouton de recherche sur l'écran principal »" },
    ],
    bonneReponse: 'A',
    explication:
      "Une user story exprime un besoin du point de vue de l'utilisateur : « En tant que [rôle], je veux [action] afin de [bénéfice] ». Elle dit qui, quoi et pourquoi, sans imposer la solution technique, et sera complétée par des critères d'acceptation.",
    pourquoiPas: {
      B: "C'est une décision technique d'implémentation : elle ne dit ni qui en a besoin ni pour quel bénéfice.",
      C: "C'est un objectif vague, non testable, sans utilisateur identifié.",
      D: "Elle décrit une tâche de développement, pas le besoin de l'utilisateur.",
    },
    aRetenir: "User story : « En tant que… je veux… afin de… » — le besoin, pas la solution.",
  },
  {
    id: 'NUM-PRJ-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'moyen',
    enonce:
      "La date de mise en service d'une plateforme de déclaration en ligne ne peut pas bouger, et l'équipe sait déjà qu'elle ne pourra pas tout livrer. Les exigences ont été classées avec la méthode MoSCoW. Comment arbitrer ?",
    options: [
      { id: 'A', texte: "Livrer d'abord les « Could have », plus simples et plus rapides à développer" },
      { id: 'B', texte: "Repousser la date pour livrer l'ensemble des exigences" },
      { id: 'C', texte: "Retirer les « Must have » les plus coûteux du périmètre" },
      { id: 'D', texte: "Garantir les « Must have », puis ajouter « Should » et « Could »" },
    ],
    bonneReponse: 'D',
    explication:
      "MoSCoW classe les exigences en Must have (indispensable), Should have (important), Could have (souhaitable) et Won't have this time (exclu pour cette version). À date fixe, on sécurise d'abord les Must, puis on ajoute Should et Could selon la capacité restante.",
    pourquoiPas: {
      A: "Les « Could » sont facultatifs : les livrer avant l'indispensable inverse la logique de valeur.",
      B: "La date est imposée ; MoSCoW sert précisément à ajuster le périmètre plutôt que le délai.",
      C: "Sans les « Must », le produit n'est pas utilisable : c'est le dernier endroit où couper.",
    },
    aRetenir: "À date fixe, on ajuste le périmètre : Must d'abord, puis Should, puis Could.",
  },
  {
    id: 'NUM-PRJ-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'moyen',
    enonce:
      "Voici les tâches du projet de déploiement d'un nouvel outil de gestion des réclamations. Quelle est la durée minimale du projet et quel est son chemin critique ?",
    extrait: {
      langage: 'texte',
      contenu: `Tâche                          Durée   Antécédent(s)
A  Cadrage                      3 j     —
B  Développement                5 j     A
C  Achat des serveurs           2 j     A
D  Installation et paramétrage  4 j     C
E  Recette                      2 j     B et D`,
    },
    options: [
      { id: 'A', texte: "10 jours, chemin critique A-B-E" },
      { id: 'B', texte: "16 jours, chemin critique A-B-C-D-E" },
      { id: 'C', texte: "11 jours, chemin critique A-C-D-E" },
      { id: 'D', texte: "11 jours, chemin critique A-B-E" },
    ],
    bonneReponse: 'C',
    explication:
      "Deux chemins mènent à E : A-B-E = 3 + 5 + 2 = 10 jours, et A-C-D-E = 3 + 2 + 4 + 2 = 11 jours. Le projet dure au minimum 11 jours, la durée du plus long chemin, qui est le chemin critique. La tâche B dispose d'une marge de 1 jour.",
    pourquoiPas: {
      A: "A-B-E est le chemin le plus court : le projet ne peut pas finir avant que D soit terminée.",
      B: "16 jours est la somme de toutes les durées ; or B et C-D se déroulent en parallèle après A.",
      D: "La durée est juste, mais A-B-E n'est pas critique : B peut prendre 1 jour de retard sans décaler le projet.",
    },
    aRetenir: "Chemin critique = le plus long chemin du réseau de tâches ; tout retard sur lui retarde le projet.",
  },
  {
    id: 'NUM-PRJ-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'moyen',
    enonce:
      "Il reste 120 points d'effort dans le backlog de l'application mobile d'une microfinance. La vélocité moyenne de l'équipe est de 30 points par sprint de 2 semaines. Sans changement de périmètre, quelle durée faut-il prévoir ?",
    options: [
      { id: 'A', texte: "Environ 8 semaines, soit 4 sprints" },
      { id: 'B', texte: "Environ 4 semaines, soit 2 sprints" },
      { id: 'C', texte: "Environ 6 semaines, soit 3 sprints" },
      { id: 'D', texte: "Environ 16 semaines, soit 8 sprints" },
    ],
    bonneReponse: 'A',
    explication:
      "120 / 30 = 4 sprints, et 4 × 2 semaines = 8 semaines. La vélocité est une moyenne observée : la projection reste indicative et se réajuste à chaque sprint, notamment si le périmètre change.",
    pourquoiPas: {
      B: "Ce résultat suppose 60 points par sprint, le double de la vélocité mesurée.",
      C: "3 sprints ne couvrent que 90 points sur les 120 restants.",
      D: "16 semaines correspondent à 8 sprints : le nombre de sprints a été confondu avec le nombre de semaines.",
    },
    aRetenir: "Nombre de sprints = travail restant / vélocité moyenne ; la projection se révise à chaque sprint.",
  },
  {
    id: 'NUM-PRJ-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'moyen',
    enonce:
      "Tu construis la matrice RACI de la mise en production d'un nouveau portail. Pour une tâche donnée, combien de personnes doivent porter la lettre « A » (Accountable) ?",
    options: [
      { id: 'A', texte: "Autant que de directions concernées par la tâche" },
      { id: 'B', texte: "Au moins deux, pour assurer un contrôle croisé" },
      { id: 'C', texte: "Une seule personne" },
      { id: 'D', texte: "Aucune, dès lors qu'un « R » est désigné" },
    ],
    bonneReponse: 'C',
    explication:
      "Dans une matrice RACI, R (Responsible) réalise, A (Accountable) rend des comptes et valide, C (Consulted) est consulté, I (Informed) est informé. Il faut un seul « A » par tâche pour qu'il n'y ait aucune ambiguïté sur qui tranche et répond du résultat ; il peut y avoir plusieurs « R ».",
    pourquoiPas: {
      A: "Plusieurs « A » diluent la responsabilité : en cas de problème, chacun peut renvoyer vers l'autre.",
      B: "Le contrôle croisé se fait avec des « C » ou une validation distincte, pas en multipliant les « A ».",
      D: "Le « R » exécute ; sans « A », personne n'est garant du résultat final.",
    },
    aRetenir: "RACI : plusieurs « R » possibles, mais un seul « A » par tâche.",
  },
  {
    id: 'NUM-PRJ-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'difficile',
    enonce:
      "L'équipe applicative suit son travail sur un tableau Kanban. La colonne « En test » accumule 14 tickets alors que l'équipe ne compte que deux testeurs, et les livraisons ralentissent. Quelle pratique Kanban faut-il appliquer ?",
    options: [
      { id: 'A', texte: "Créer une colonne « En attente de test » pour mieux ranger les tickets" },
      { id: 'B', texte: "Limiter le travail en cours (WIP) et aider à vider la colonne de test" },
      { id: 'C', texte: "Demander aux développeurs d'accélérer pour alimenter les tests plus vite" },
      { id: 'D', texte: "Passer en sprints de deux semaines et regrouper les tests en fin de cycle" },
    ],
    bonneReponse: 'B',
    explication:
      "La colonne « En test » est le goulot d'étranglement. Kanban impose des limites de travail en cours (WIP) : quand la limite est atteinte, on cesse de démarrer de nouveaux tickets et les membres disponibles aident à terminer ceux qui sont bloqués. On fluidifie ainsi le flux au lieu d'accumuler du stock.",
    pourquoiPas: {
      A: "Une nouvelle colonne rend la file d'attente visible mais ne la réduit pas.",
      C: "Produire plus vite en amont d'un goulot ne fait qu'allonger la file d'attente devant lui.",
      D: "Regrouper les tests en fin de cycle crée un effet tunnel et accentue l'engorgement.",
    },
    aRetenir: "Kanban : limiter le travail en cours et « arrêter de commencer, commencer à finir ».",
  },
  {
    id: 'NUM-PRJ-008',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gestion de projet & agilité',
    difficulte: 'difficile',
    enonce:
      "Pendant la recette d'un module de virements, le métier refuse une fonctionnalité que l'équipe considère comme « terminée ». Aucun critère d'acceptation n'avait été écrit pour cette user story. Quelle pratique aurait évité ce désaccord ?",
    options: [
      { id: 'A', texte: "Allonger la phase de recette pour multiplier les tests" },
      { id: 'B', texte: "Faire relire le code par un développeur senior avant la recette" },
      { id: 'C', texte: "Écrire avec le métier, avant le développement, des critères vérifiables" },
      { id: 'D', texte: "Remplacer la recette métier par des tests automatisés de l'équipe" },
    ],
    bonneReponse: 'C',
    explication:
      "Les critères d'acceptation, définis avec le métier avant de développer (par exemple au format « Étant donné… Quand… Alors… »), fixent ce que « terminé » veut dire pour cette story. Ils servent ensuite de base aux tests de recette : le résultat n'est plus une affaire d'opinion.",
    pourquoiPas: {
      A: "Tester plus longtemps sans référence commune ne tranche pas le désaccord sur ce qui était attendu.",
      B: "La revue de code améliore la qualité technique, pas la conformité au besoin métier.",
      D: "Les tests automatisés vérifient ce que l'équipe a compris ; sans critères partagés, ils reproduisent le même malentendu.",
    },
    aRetenir: "Pas de story sans critères d'acceptation vérifiables, écrits avec le métier avant le développement.",
  },

  // ───────────────────────────── Services financiers numériques ─────────────────────────────
  {
    id: 'NUM-SFN-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'facile',
    enonce:
      "Un émetteur de monnaie électronique (service de mobile money) doit en principe déposer des fonds sur un compte dédié ouvert dans une ou plusieurs banques. À quoi sert ce compte ?",
    options: [
      { id: 'A', texte: "À couvrir la monnaie électronique en circulation par des fonds équivalents" },
      { id: 'B', texte: "À financer un crédit gratuit accordé à chaque agent du réseau" },
      { id: 'C', texte: "À rendre gratuits les transferts entre opérateurs pour les clients" },
      { id: 'D', texte: "À permettre à l'opérateur de prêter les fonds des clients à ses partenaires" },
    ],
    bonneReponse: 'A',
    explication:
      "La monnaie électronique est émise contre remise de fonds : chaque unité en circulation doit être adossée à un montant équivalent conservé sur un compte dédié (cantonnement ou fiducie selon les cadres). Ces fonds protègent les clients et ne doivent pas être utilisés par l'opérateur pour ses propres activités.",
    pourquoiPas: {
      B: "Le compte de couverture n'a pas pour objet de financer les agents ; ceux-ci achètent leur propre float.",
      C: "La tarification des transferts est une décision commerciale, sans rapport avec la couverture des fonds.",
      D: "C'est l'inverse : les fonds de couverture sont protégés et ne doivent pas être prêtés par l'opérateur.",
    },
    aRetenir: "Monnaie électronique en circulation = fonds équivalents cantonnés en banque, au profit des clients.",
  },
  {
    id: 'NUM-SFN-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'facile',
    enonce:
      "Un agent mobile money de Matete dispose de 500 000 CDF de monnaie électronique (float) et de 200 000 CDF en espèces. Un client vient retirer 150 000 CDF en espèces (cash-out). Frais ignorés, quelle est la position de l'agent après l'opération ?",
    options: [
      { id: 'A', texte: "350 000 CDF de float et 350 000 CDF en espèces" },
      { id: 'B', texte: "650 000 CDF de float et 50 000 CDF en espèces" },
      { id: 'C', texte: "500 000 CDF de float et 50 000 CDF en espèces" },
      { id: 'D', texte: "350 000 CDF de float et 200 000 CDF en espèces" },
    ],
    bonneReponse: 'B',
    explication:
      "Lors d'un retrait, le client transfère 150 000 CDF de monnaie électronique à l'agent, qui lui remet la même somme en espèces : float 500 000 + 150 000 = 650 000 CDF, espèces 200 000 − 150 000 = 50 000 CDF. Le total (700 000 CDF) ne change pas ; seule sa composition varie.",
    pourquoiPas: {
      A: "C'est le résultat d'un dépôt (cash-in) : l'agent perdrait du float et recevrait des espèces.",
      C: "Le float de l'agent augmente lors d'un retrait : le client lui transfère sa monnaie électronique.",
      D: "Les espèces remises au client sortent forcément de la caisse de l'agent.",
    },
    aRetenir: "Cash-out : le float de l'agent monte, ses espèces baissent ; cash-in : l'inverse. Le total reste constant.",
  },
  {
    id: 'NUM-SFN-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'moyen',
    enonce:
      "Une microfinance lance un portefeuille mobile pour des vendeuses de marché, dont beaucoup n'ont pas tous les justificatifs exigés pour un compte bancaire classique. Quelle approche concilie inclusion financière et lutte contre le blanchiment ?",
    options: [
      { id: 'A', texte: "Des niveaux de KYC : plafonds bas à l'ouverture, relevés après vérification" },
      { id: 'B', texte: "Ouvrir sans vérifier l'identité tant que les montants restent faibles" },
      { id: 'C', texte: "Exiger dès l'ouverture les mêmes pièces que pour un compte classique" },
      { id: 'D', texte: "Accepter une simple déclaration du client, sans plafond d'opérations" },
    ],
    bonneReponse: 'A',
    explication:
      "Le KYC à niveaux applique une approche fondée sur les risques : une identification simplifiée ouvre un compte aux plafonds de solde et d'opérations limités ; les plafonds augmentent à mesure que l'identité est vérifiée plus complètement. Le risque reste proportionné aux montants.",
    pourquoiPas: {
      B: "Une identification minimale reste nécessaire : un compte anonyme est une porte ouverte au blanchiment.",
      C: "Des exigences identiques à celles d'un compte classique excluent justement le public visé.",
      D: "Sans plafond, une identification faible permettrait de faire transiter des montants importants.",
    },
    aRetenir: "KYC à niveaux : plus l'identité est vérifiée, plus les plafonds sont élevés.",
  },
  {
    id: 'NUM-SFN-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'moyen',
    enonce:
      "Une commerçante de Lubumbashi reçoit des paiements de clients abonnés à des opérateurs mobile money différents ; elle doit gérer plusieurs téléphones et rééquilibrer ses comptes chaque soir. Quel dispositif réglerait ce problème à l'échelle du pays ?",
    options: [
      { id: 'A', texte: "Imposer un opérateur mobile money unique à tous les commerçants" },
      { id: 'B', texte: "Exiger un paiement en espèces au-delà d'un certain montant" },
      { id: 'C', texte: "Augmenter le nombre d'agents de chaque opérateur dans la ville" },
      { id: 'D', texte: "Un switch national qui rend les opérateurs interopérables" },
    ],
    bonneReponse: 'D',
    explication:
      "L'interopérabilité permet d'envoyer et de recevoir de l'argent entre portefeuilles d'opérateurs différents (et avec les comptes bancaires), souvent via une infrastructure de commutation commune. La commerçante peut alors encaisser tous ses clients sur un seul compte.",
    pourquoiPas: {
      A: "Imposer un opérateur unique supprime la concurrence et exclut les clients des autres réseaux.",
      B: "Revenir aux espèces va à l'encontre de la digitalisation des paiements et n'adresse pas la fragmentation.",
      C: "Plus d'agents facilitent les dépôts et retraits, mais les réseaux restent cloisonnés.",
    },
    aRetenir: "Interopérabilité : payer n'importe quel portefeuille ou compte, quel que soit l'opérateur.",
  },
  {
    id: 'NUM-SFN-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'moyen',
    enonce:
      "Banque Alpha déploie le paiement marchand par QR code dans les supermarchés de Kinshasa. Quelle affirmation est exacte ?",
    options: [
      { id: 'A', texte: "Le QR code affiché contient le solde du compte du commerçant" },
      { id: 'B', texte: "Un QR code statique change à chaque transaction" },
      { id: 'C', texte: "Un QR code dynamique peut porter le montant et une référence unique" },
      { id: 'D', texte: "Le QR code suffit à lui seul à chiffrer et sécuriser toute la transaction" },
    ],
    bonneReponse: 'C',
    explication:
      "Un QR code statique, souvent imprimé, identifie le commerçant ; le client saisit le montant. Un QR code dynamique est généré pour chaque vente et peut inclure le montant et une référence de transaction, ce qui limite les erreurs de saisie et facilite le rapprochement. La sécurité repose sur l'application et l'authentification du payeur, pas sur l'image elle-même.",
    pourquoiPas: {
      A: "Le QR code ne contient que des informations de paiement (identifiant, éventuellement montant et référence), jamais un solde.",
      B: "C'est la définition du QR code dynamique ; le statique reste identique d'une vente à l'autre.",
      D: "Un QR code est un simple support de données lisible par tous ; un faux autocollant peut d'ailleurs être collé par-dessus.",
    },
    aRetenir: "QR statique = identifiant fixe du marchand ; QR dynamique = montant et référence propres à chaque vente.",
  },
  {
    id: 'NUM-SFN-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'moyen',
    enonce:
      "Une fintech veut afficher dans son application le solde des comptes que ses utilisateurs détiennent chez Banque Alpha. Quelle approche respecte les principes de l'open banking ?",
    options: [
      { id: 'A', texte: "Demander aux clients leurs identifiants bancaires pour se connecter à leur place" },
      { id: 'B', texte: "Extraire les soldes en lisant automatiquement les pages web de la banque" },
      { id: 'C', texte: "Recevoir chaque nuit une copie complète de la base clients de la banque" },
      { id: 'D', texte: "Passer par une API de la banque, avec le consentement du client" },
    ],
    bonneReponse: 'D',
    explication:
      "L'open banking repose sur des API sécurisées : le client autorise explicitement la fintech, pour un périmètre limité (ici, la consultation des soldes) et une durée définie, et peut révoquer cet accès. Il ne communique jamais ses identifiants à un tiers.",
    pourquoiPas: {
      A: "Partager ses identifiants donne au tiers un accès total et rend impossible de distinguer ses actions de celles du client.",
      B: "Le « screen scraping » nécessite les identifiants du client et casse à chaque changement du site.",
      C: "Transmettre toute la base viole la minimisation des données et le consentement de chaque client.",
    },
    aRetenir: "Open banking : API, consentement explicite, accès limité et révocable — jamais de partage d'identifiants.",
  },
  {
    id: 'NUM-SFN-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'difficile',
    enonce:
      "Un client signale que son téléphone n'a soudainement plus de réseau depuis la veille. Le lendemain, plusieurs virements ont été validés depuis son compte par des codes à usage unique envoyés par SMS sur son numéro. Quelle fraude est la plus probable, et quelle mesure la contre ?",
    options: [
      { id: 'A', texte: "Un virus sur le téléphone ; installer un antivirus sur les mobiles des clients" },
      { id: 'B', texte: "Une faille du serveur de la banque ; changer le certificat HTTPS du site" },
      { id: 'C', texte: "Une panne de l'opérateur ; rembourser le client et clore le dossier" },
      { id: 'D', texte: "Un SIM swap ; vérifier tout changement récent de SIM avant d'accepter l'OTP" },
    ],
    bonneReponse: 'D',
    explication:
      "Dans un SIM swap, le fraudeur obtient un duplicata de la carte SIM de la victime (souvent par ingénierie sociale auprès de l'opérateur) : l'ancienne SIM perd le réseau et les SMS, dont les codes OTP, arrivent chez le fraudeur. Parades : contrôler la date du dernier changement de SIM avant une opération sensible, imposer un délai après un changement, et privilégier un second facteur non lié au SMS.",
    pourquoiPas: {
      A: "Un virus ne fait pas disparaître le réseau mobile ; la perte soudaine de réseau est le signe typique d'une SIM désactivée.",
      B: "Rien n'indique une compromission du serveur ; les opérations ont été validées par des OTP légitimement envoyés.",
      C: "Une panne n'explique pas les virements validés ; clore sans enquête laisse la fraude se reproduire.",
    },
    aRetenir: "Perte soudaine de réseau + OTP détournés = SIM swap : contrôler les changements de SIM récents.",
  },
  {
    id: 'NUM-SFN-008',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Services financiers numériques',
    difficulte: 'difficile',
    enonce:
      "Les travaux sur les monnaies numériques de banque centrale (MNBC, ou CBDC en anglais) distinguent une MNBC « de détail » et une MNBC « de gros ». Quelle est la différence ?",
    options: [
      { id: 'A', texte: "La première est émise par les banques commerciales, la seconde par la banque centrale" },
      { id: 'B', texte: "La première s'adresse au public, la seconde aux institutions financières" },
      { id: 'C', texte: "La première repose obligatoirement sur une blockchain publique, la seconde non" },
      { id: 'D', texte: "La première a un cours qui fluctue, la seconde un cours fixe face à la monnaie" },
    ],
    bonneReponse: 'B',
    explication:
      "Les deux sont une créance directe sur la banque centrale. La MNBC de détail est destinée aux ménages et aux entreprises pour leurs paiements courants, comme un équivalent numérique des billets ; la MNBC de gros est réservée aux institutions financières pour les règlements interbancaires. La technologie utilisée est un choix de conception, pas un critère de définition.",
    pourquoiPas: {
      A: "Dans les deux cas, l'émetteur est la banque centrale : c'est ce qui la distingue de la monnaie des banques commerciales.",
      C: "Une MNBC n'exige pas de blockchain publique ; de nombreux projets étudient des registres centralisés ou à accès restreint.",
      D: "Une MNBC vaut toujours une unité de la monnaie nationale ; ce n'est pas un crypto-actif à cours variable.",
    },
    aRetenir: "MNBC de détail : pour le public ; MNBC de gros : pour les institutions financières. Toujours émise par la banque centrale.",
  },

  // ───────────────────────────── Cloud & SaaS ─────────────────────────────
  {
    id: 'NUM-CLD-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'facile',
    enonce:
      "Une microfinance adopte une messagerie en ligne : le fournisseur gère les serveurs, le logiciel et les mises à jour ; l'équipe informatique se contente d'administrer les comptes des utilisateurs. De quel modèle s'agit-il ?",
    options: [
      { id: 'A', texte: "IaaS (infrastructure à la demande)" },
      { id: 'B', texte: "PaaS (plateforme de développement)" },
      { id: 'C', texte: "SaaS (logiciel en service)" },
      { id: 'D', texte: "Hébergement sur site (on-premise)" },
    ],
    bonneReponse: 'C',
    explication:
      "En SaaS, le client utilise une application prête à l'emploi : le fournisseur gère l'infrastructure, la plateforme et le logiciel. Le client reste responsable de ses données, de ses utilisateurs et de leurs droits d'accès.",
    pourquoiPas: {
      A: "En IaaS, le client reçoit des machines virtuelles et gère lui-même le système, les logiciels et les mises à jour.",
      B: "Le PaaS fournit un environnement pour déployer ses propres applications, pas une messagerie prête à l'emploi.",
      D: "Sur site, les serveurs sont installés et exploités par l'institution elle-même.",
    },
    aRetenir: "IaaS : tu gères le système ; PaaS : tu gères ton code ; SaaS : tu gères tes utilisateurs et tes données.",
  },
  {
    id: 'NUM-CLD-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'facile',
    enonce:
      "Banque Alpha loue des machines virtuelles chez un fournisseur IaaS pour héberger une application. Qui doit appliquer les correctifs de sécurité du système d'exploitation de ces machines ?",
    options: [
      { id: 'A', texte: "Le fournisseur cloud, propriétaire des serveurs" },
      { id: 'B', texte: "L'éditeur du système, à distance et automatiquement" },
      { id: 'C', texte: "Le fournisseur d'accès Internet de la banque" },
      { id: 'D', texte: "Banque Alpha, en tant que cliente" },
    ],
    bonneReponse: 'D',
    explication:
      "C'est le modèle de responsabilité partagée : en IaaS, le fournisseur sécurise le matériel, le réseau physique et la couche de virtualisation ; le client gère tout ce qu'il installe au-dessus, dont le système d'exploitation, ses correctifs, les applications et les données.",
    pourquoiPas: {
      A: "Le fournisseur sécurise l'infrastructure physique et l'hyperviseur, pas le système installé dans les machines du client.",
      B: "L'éditeur publie les correctifs, mais c'est l'administrateur du système qui décide de les appliquer et les déploie.",
      C: "Le fournisseur d'accès transporte le trafic ; il n'a aucun accès aux machines virtuelles.",
    },
    aRetenir: "Responsabilité partagée : plus on descend vers l'IaaS, plus le client a de couches à sécuriser.",
  },
  {
    id: 'NUM-CLD-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'moyen',
    enonce:
      "Le contrat d'une application SaaS de gestion des crédits garantit une disponibilité mensuelle de 99,9 %. Sur un mois de 30 jours, quelle durée d'indisponibilité ce SLA tolère-t-il au maximum ?",
    options: [
      { id: 'A', texte: "Environ 8 h 45 min" },
      { id: 'B', texte: "Environ 43 minutes" },
      { id: 'C', texte: "Environ 4 minutes" },
      { id: 'D', texte: "Environ 7 h 12 min" },
    ],
    bonneReponse: 'B',
    explication:
      "Un mois de 30 jours compte 30 × 24 × 60 = 43 200 minutes. L'indisponibilité tolérée est de 0,1 % : 43 200 × 0,001 = 43,2 minutes. Au-delà, le fournisseur doit en général des pénalités (crédits de service) prévues au contrat.",
    pourquoiPas: {
      A: "8 h 45 min (8,76 h) est la tolérance de 99,9 % sur une année entière, pas sur un mois.",
      C: "Environ 4 minutes par mois correspondent à 99,99 %, un niveau dix fois plus exigeant.",
      D: "7 h 12 min correspondent à 1 % d'indisponibilité, soit un SLA de 99 %.",
    },
    aRetenir: "99,9 % ≈ 43 min par mois de 30 jours ≈ 8,8 h par an ; chaque « 9 » supplémentaire divise la tolérance par 10.",
  },
  {
    id: 'NUM-CLD-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'moyen',
    enonce:
      "Une agence accède à une application SaaS (disponibilité garantie de 99,9 %) par une liaison Internet unique dont la disponibilité est de 99,5 %. Les pannes étant supposées indépendantes, quelle disponibilité de bout en bout l'agence peut-elle espérer ?",
    options: [
      { id: 'A', texte: "Environ 99,4 %" },
      { id: 'B', texte: "Environ 99,9 %" },
      { id: 'C', texte: "Environ 99,7 %" },
      { id: 'D', texte: "Environ 99,99 %" },
    ],
    bonneReponse: 'A',
    explication:
      "Deux éléments en série doivent fonctionner en même temps : les disponibilités se multiplient, 0,999 × 0,995 ≈ 0,994, soit environ 99,4 %. La disponibilité perçue est donc inférieure à celle du maillon le plus faible ; une seconde liaison d'un autre opérateur (en parallèle) serait le levier le plus efficace.",
    pourquoiPas: {
      B: "Le SLA du fournisseur ne couvre que son service ; la liaison de l'agence s'ajoute comme point de panne.",
      C: "99,7 % est la moyenne des deux valeurs ; une moyenne ne décrit pas des éléments en série.",
      D: "Le résultat ne peut pas dépasser la disponibilité du maillon le plus faible (99,5 %).",
    },
    aRetenir: "En série, les disponibilités se multiplient : le tout est moins disponible que son maillon le plus faible.",
  },
  {
    id: 'NUM-CLD-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'moyen',
    enonce:
      "Avant de signer avec un éditeur SaaS de gestion électronique des documents, quelle clause protège le mieux la banque si elle veut un jour changer de fournisseur ?",
    options: [
      { id: 'A', texte: "Une remise commerciale croissante sur trois ans" },
      { id: 'B', texte: "Un engagement ferme de durée minimale de cinq ans" },
      { id: 'C', texte: "La réversibilité des données dans un format ouvert" },
      { id: 'D', texte: "Une maintenance exclusive assurée par l'éditeur" },
    ],
    bonneReponse: 'C',
    explication:
      "La clause de réversibilité organise la sortie : restitution de toutes les données (et métadonnées) dans un format exploitable, délais, assistance à la migration, puis destruction des copies chez l'éditeur. Sans elle, la banque risque d'être enfermée chez son fournisseur (« vendor lock-in »).",
    pourquoiPas: {
      A: "Une remise réduit le coût mais n'aide en rien à récupérer les données en cas de départ.",
      B: "Un long engagement ferme rend au contraire le changement de fournisseur plus difficile et plus coûteux.",
      D: "L'exclusivité renforce la dépendance envers l'éditeur au lieu de la réduire.",
    },
    aRetenir: "Pas de contrat SaaS sans clause de réversibilité : données restituées, format exploitable, délais et assistance.",
  },
  {
    id: 'NUM-CLD-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'moyen',
    enonce:
      "Une machine virtuelle de recette coûte 0,20 $ de l'heure (tarif fictif) et tourne 24 h/24 sur un mois de 30 jours. L'équipe ne l'utilise que 10 h par jour, 22 jours ouvrés par mois. Quelle économie mensuelle obtiendrait-on en l'arrêtant automatiquement hors de ces plages ?",
    options: [
      { id: 'A', texte: "44 $ par mois" },
      { id: 'B', texte: "100 $ par mois" },
      { id: 'C', texte: "144 $ par mois" },
      { id: 'D', texte: "70 $ par mois" },
    ],
    bonneReponse: 'B',
    explication:
      "Coût actuel : 0,20 × 24 × 30 = 144 $. Coût en n'allumant la machine que sur les plages utiles : 0,20 × 10 × 22 = 44 $. Économie : 144 − 44 = 100 $ par mois, soit près de 70 % de la facture. Payer à l'usage n'est avantageux que si l'on éteint ce qui ne sert pas.",
    pourquoiPas: {
      A: "44 $ est le nouveau coût mensuel, pas l'économie réalisée.",
      C: "144 $ est le coût actuel complet ; la machine continue de coûter pendant les heures d'utilisation.",
      D: "70 est le pourcentage approximatif d'économie, pas un montant en dollars.",
    },
    aRetenir: "Dans le cloud, on paie ce qui tourne : éteindre automatiquement les environnements inutilisés réduit fortement la facture.",
  },
  {
    id: 'NUM-CLD-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'difficile',
    enonce:
      "Une institution financière envisage d'héberger des données de clients chez un fournisseur cloud dont les centres de données sont situés à l'étranger. Quelle démarche est la plus prudente ?",
    options: [
      { id: 'A', texte: "Signer, car le chiffrement fourni par l'hébergeur règle toutes les questions juridiques" },
      { id: 'B', texte: "Renoncer au cloud pour toutes les données, y compris les moins sensibles" },
      { id: 'C', texte: "Laisser le fournisseur choisir la région, en privilégiant le coût le plus bas" },
      { id: 'D', texte: "Classer les données, vérifier les règles de localisation, puis choisir l'hébergement" },
    ],
    bonneReponse: 'D',
    explication:
      "La localisation des données dépend de leur sensibilité et des règles applicables (obligations sectorielles, autorisations du régulateur, lois du pays d'hébergement). On classe d'abord les données, on vérifie ce qui est permis, puis on choisit la région, le chiffrement (idéalement avec des clés maîtrisées par l'institution) et les clauses contractuelles adaptées.",
    pourquoiPas: {
      A: "Le chiffrement réduit le risque technique, mais ne lève pas les obligations légales ni la question de l'accès par des autorités étrangères.",
      B: "Une interdiction générale prive l'institution de solutions adaptées pour des données peu sensibles.",
      C: "La région d'hébergement est une décision de conformité et de risque, pas seulement de prix.",
    },
    aRetenir: "Avant le cloud : classer les données, vérifier les règles de localisation, puis choisir région, chiffrement et contrat.",
  },
  {
    id: 'NUM-CLD-008',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Cloud & SaaS',
    difficulte: 'difficile',
    enonce:
      "Un agent a supprimé par erreur un dossier partagé dans la suite bureautique SaaS de l'institution il y a quatre mois. La corbeille du service ne conserve les éléments supprimés que 90 jours (paramètre fictif) et aucune autre sauvegarde n'existe. Quelle leçon en tirer ?",
    options: [
      { id: 'A', texte: "Le fournisseur doit restaurer, sur simple demande, toute donnée effacée" },
      { id: 'B', texte: "La redondance des centres de données du fournisseur couvrait ce risque" },
      { id: 'C', texte: "Le SLA de disponibilité inclut la restauration des données supprimées" },
      { id: 'D', texte: "Le client reste responsable de ses données et de leur sauvegarde" },
    ],
    bonneReponse: 'D',
    explication:
      "Le fournisseur SaaS garantit la disponibilité du service et la résilience de son infrastructure, mais les suppressions faites par les utilisateurs sont répliquées comme n'importe quelle modification. Le client doit définir ses besoins de rétention et, si nécessaire, mettre en place une sauvegarde indépendante de ses données.",
    pourquoiPas: {
      A: "Au-delà de la durée de rétention prévue au contrat, le fournisseur n'a pas l'obligation de conserver les données effacées.",
      B: "La redondance protège contre la panne d'un centre de données ; une suppression est répliquée sur toutes les copies.",
      C: "Un SLA de disponibilité mesure l'accès au service, pas la capacité à revenir à un état antérieur des données.",
    },
    aRetenir: "Redondance n'est pas sauvegarde : en SaaS aussi, la protection des données reste à la charge du client.",
  },

  // ───────────────────────────── IA & automatisation ─────────────────────────────
  {
    id: 'NUM-IA-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'facile',
    enonce:
      "Une analyste demande à un assistant d'IA générative de rédiger une note sur la réglementation des microfinances. Le texte produit cite avec assurance une « circulaire de 2019 » qui n'existe pas. Comment appelle-t-on ce phénomène ?",
    options: [
      { id: 'A', texte: "Un surapprentissage du modèle" },
      { id: 'B', texte: "Une hallucination" },
      { id: 'C', texte: "Un biais de sélection des données" },
      { id: 'D', texte: "Une injection de prompt" },
    ],
    bonneReponse: 'B',
    explication:
      "Un modèle de langage génère le texte le plus plausible, pas forcément vrai : il peut inventer des sources, des chiffres ou des références avec un ton parfaitement assuré. C'est une hallucination. Toute référence produite par une IA générative doit être vérifiée dans une source fiable.",
    pourquoiPas: {
      A: "Le surapprentissage désigne un modèle qui colle trop à ses données d'entraînement et généralise mal.",
      C: "Un biais de sélection vient de données d'entraînement non représentatives, pas de l'invention d'une source.",
      D: "Une injection de prompt est une attaque qui détourne les instructions du modèle ; rien de tel ici.",
    },
    aRetenir: "Une IA générative peut inventer des références avec assurance : vérifie toujours les sources citées.",
  },
  {
    id: 'NUM-IA-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'facile',
    enonce:
      "Banque Alpha dispose de trois ans d'historique de demandes de crédit, chacune étiquetée « remboursé » ou « en défaut ». Elle veut estimer le risque des nouvelles demandes. Quel type d'apprentissage automatique convient ?",
    options: [
      { id: 'A', texte: "Non supervisé, par regroupement (clustering)" },
      { id: 'B', texte: "Par renforcement, avec récompenses" },
      { id: 'C', texte: "Supervisé, par classification" },
      { id: 'D', texte: "Réduction de dimension (ACP)" },
    ],
    bonneReponse: 'C',
    explication:
      "Les exemples passés portent la bonne réponse (l'étiquette « remboursé » ou « en défaut ») : le modèle apprend à prédire cette étiquette pour de nouveaux dossiers. C'est de l'apprentissage supervisé, ici une classification à deux classes.",
    pourquoiPas: {
      A: "Le non-supervisé cherche des groupes dans des données sans étiquette ; ici, les étiquettes existent et c'est elles qu'on veut prédire.",
      B: "Le renforcement apprend par essais et récompenses dans un environnement interactif, pas à partir d'un historique étiqueté.",
      D: "L'ACP résume des variables ; elle peut préparer les données mais ne prédit pas le défaut.",
    },
    aRetenir: "Données étiquetées + prédiction de l'étiquette = apprentissage supervisé.",
  },
  {
    id: 'NUM-IA-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'moyen',
    enonce:
      "La direction d'une institution financière veut encadrer l'usage de l'IA générative par ses agents, qui l'utilisent déjà de façon dispersée. Quelle règle doit figurer en priorité dans la charte ?",
    options: [
      { id: 'A', texte: "Interdire tout outil d'IA, y compris ceux validés par l'institution" },
      { id: 'B', texte: "Aucune donnée confidentielle hors outils approuvés, et relecture humaine" },
      { id: 'C', texte: "Autoriser tous les outils gratuits du marché pour encourager l'innovation" },
      { id: 'D', texte: "Publier les textes générés tels quels pour gagner un maximum de temps" },
    ],
    bonneReponse: 'B',
    explication:
      "Les deux risques majeurs sont la fuite de données (ce qui est saisi dans un service non maîtrisé peut être conservé ou réutilisé) et les erreurs (hallucinations). Une charte efficace désigne les outils approuvés, interdit d'y saisir des données sensibles hors de ce cadre et impose qu'un humain vérifie et assume toute production.",
    pourquoiPas: {
      A: "Une interdiction totale pousse à l'usage caché d'outils non maîtrisés (shadow IT) et prive l'institution de gains réels.",
      C: "Les outils gratuits grand public peuvent conserver ou réutiliser les données saisies.",
      D: "Un texte généré peut contenir des erreurs ou des inventions : l'institution reste responsable de ce qu'elle publie.",
    },
    aRetenir: "IA générative au travail : outils approuvés, pas de données sensibles ailleurs, humain responsable du résultat.",
  },
  {
    id: 'NUM-IA-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'moyen',
    enonce:
      "Une institution veut un assistant qui réponde aux questions des agents à partir de ses procédures internes, en citant les passages utilisés et en limitant les inventions. Quelle approche est la plus adaptée ?",
    options: [
      { id: 'A', texte: "Un modèle généraliste utilisé tel quel, sans accès aux procédures" },
      { id: 'B', texte: "Le RAG : retrouver les passages utiles et les fournir au modèle" },
      { id: 'C', texte: "Augmenter la « température » du modèle pour enrichir les réponses" },
      { id: 'D', texte: "Réentraîner chaque nuit le modèle sur tous les e-mails internes" },
    ],
    bonneReponse: 'B',
    explication:
      "Le RAG (génération augmentée par recherche) cherche d'abord les extraits pertinents dans la base documentaire, puis demande au modèle de répondre en s'appuyant sur ces extraits, qu'il peut citer. Les réponses sont ancrées dans les vraies procédures et vérifiables ; le risque d'invention diminue sans disparaître.",
    pourquoiPas: {
      A: "Un modèle généraliste ne connaît pas les procédures internes : il risque d'inventer des réponses plausibles.",
      C: "Une température élevée rend les réponses plus variées et créatives, donc plus sujettes aux inventions.",
      D: "Réentraîner sur des e-mails est coûteux, expose des données sensibles et ne permet pas de citer une source précise.",
    },
    aRetenir: "RAG : rechercher les bons documents, puis faire répondre le modèle à partir d'eux, avec citations.",
  },
  {
    id: 'NUM-IA-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'moyen',
    enonce:
      "Sur un échantillon de 10 000 transactions contenant 100 fraudes réelles, un modèle de détection lève 160 alertes, dont 80 portent sur de vraies fraudes. Quels sont la précision et le rappel du modèle ?",
    options: [
      { id: 'A', texte: "Précision 80 % ; rappel 50 %" },
      { id: 'B', texte: "Précision 80 % ; rappel 80 %" },
      { id: 'C', texte: "Précision 99 % ; rappel 80 %" },
      { id: 'D', texte: "Précision 50 % ; rappel 80 %" },
    ],
    bonneReponse: 'D',
    explication:
      "Précision = vraies fraudes parmi les alertes = 80 / 160 = 50 % : une alerte sur deux est fondée. Rappel = fraudes détectées parmi les fraudes réelles = 80 / 100 = 80 % : 20 fraudes passent entre les mailles. Les deux mesures se lisent ensemble.",
    pourquoiPas: {
      A: "Les deux valeurs sont inversées : 80 % est le rappel et 50 % la précision.",
      B: "La précision rapporte les 80 vraies fraudes aux 160 alertes, pas aux 100 fraudes réelles.",
      C: "99 % est l'exactitude globale ((10 000 − 80 fausses alertes − 20 fraudes manquées) / 10 000), pas la précision.",
    },
    aRetenir: "Précision = bonnes alertes / alertes ; rappel = fraudes détectées / fraudes réelles.",
  },
  {
    id: 'NUM-IA-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'moyen',
    enonce:
      "Chaque jour, un agent recopie des montants depuis des relevés PDF au format toujours identique vers une ancienne application qui n'offre aucune API, en suivant des règles fixes. Quelle automatisation envisager en premier ?",
    options: [
      { id: 'A', texte: "Un modèle d'IA générative qui reformule les relevés" },
      { id: 'B', texte: "Une refonte complète de l'application sur deux ans" },
      { id: 'C', texte: "Un robot logiciel (RPA) qui reproduit les saisies" },
      { id: 'D', texte: "Un algorithme de clustering appliqué aux montants" },
    ],
    bonneReponse: 'C',
    explication:
      "La RPA (automatisation robotisée des processus) imite les actions d'un utilisateur sur les écrans : elle convient aux tâches répétitives, à règles fixes, sur des applications sans API. Son point faible est la fragilité : un changement d'écran ou de format peut casser le robot, d'où un suivi et des contrôles.",
    pourquoiPas: {
      A: "Reformuler ne saisit rien ; et une IA générative peut altérer des montants, ce qui est inacceptable ici.",
      B: "Une refonte peut être pertinente à terme, mais elle est disproportionnée pour automatiser une saisie simple aujourd'hui.",
      D: "Le clustering regroupe des données similaires ; il n'effectue aucune saisie.",
    },
    aRetenir: "Tâche répétitive, règles fixes, pas d'API : cas d'usage typique de la RPA, à surveiller car fragile.",
  },
  {
    id: 'NUM-IA-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'difficile',
    enonce:
      "Un modèle d'octroi de microcrédits, entraîné sur l'historique des décisions des agents, refuse nettement plus souvent les commerçantes que les commerçants, à historique de remboursement comparable. Quelle explication et quelle réaction sont les plus appropriées ?",
    options: [
      { id: 'A', texte: "Un biais hérité des décisions passées ; auditer données et résultats par groupe" },
      { id: 'B', texte: "Le modèle est mathématique, donc neutre : ses décisions reflètent le risque réel" },
      { id: 'C', texte: "Il suffit de retirer la variable « sexe » des données pour supprimer le biais" },
      { id: 'D', texte: "Le modèle manque de puissance : il faut l'entraîner sur un serveur plus rapide" },
    ],
    bonneReponse: 'A',
    explication:
      "Un modèle apprend les régularités de ses données : si les décisions passées défavorisaient un groupe, il reproduit ce biais. Il faut mesurer les écarts de décision par groupe, analyser les données d'entraînement et les variables utilisées, corriger, et garder un contrôle humain sur les décisions sensibles.",
    pourquoiPas: {
      B: "Un modèle n'est pas neutre par nature : il reproduit les biais présents dans les données qui l'ont entraîné.",
      C: "D'autres variables corrélées (type d'activité, secteur, quartier) peuvent servir de substitut : le biais peut persister.",
      D: "La puissance de calcul n'a aucun lien avec l'équité des décisions du modèle.",
    },
    aRetenir: "Données biaisées, modèle biaisé : on audite les résultats par groupe, retirer une variable ne suffit pas.",
  },
  {
    id: 'NUM-IA-008',
    section: 'technique',
    filiere: 'numerique',
    competence: 'IA & automatisation',
    difficulte: 'difficile',
    enonce:
      "Un prestataire vante son modèle de détection de fraude : « 99 % d'exactitude ». Chez Banque Alpha, les fraudes représentent environ 1 % des transactions. Quelle information faut-il exiger avant de conclure ?",
    options: [
      { id: 'A', texte: "Le rappel et la précision sur la classe « fraude »" },
      { id: 'B', texte: "Le nombre de paramètres et de couches du modèle utilisé" },
      { id: 'C', texte: "La durée d'entraînement du modèle sur les données historiques" },
      { id: 'D', texte: "La part des transactions que le modèle classe comme normales" },
    ],
    bonneReponse: 'A',
    explication:
      "Avec 1 % de fraudes, un modèle qui déclare toutes les transactions « normales » atteint déjà 99 % d'exactitude, tout en ne détectant aucune fraude (rappel nul). Sur des classes déséquilibrées, il faut regarder le rappel (fraudes détectées) et la précision (alertes fondées) sur la classe rare.",
    pourquoiPas: {
      B: "La taille du modèle ne dit rien de sa capacité à détecter les fraudes.",
      C: "Le temps d'entraînement est une donnée technique sans lien direct avec la qualité de détection.",
      D: "Un modèle qui classe 100 % des transactions comme normales aurait ce chiffre au maximum, sans rien détecter.",
    },
    aRetenir: "Classes déséquilibrées : l'exactitude trompe, exige rappel et précision sur la classe rare.",
  },

  // ───────────────────────────── Web, UX & accessibilité ─────────────────────────────
  {
    id: 'NUM-UX-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'facile',
    enonce:
      "Sur le site d'une banque, un graphique d'évolution des taux est publié sous forme d'image. Que faut-il prévoir pour les personnes aveugles qui naviguent avec un lecteur d'écran ?",
    options: [
      { id: 'A', texte: "Une alternative textuelle qui décrit l'information clé" },
      { id: 'B', texte: "Une version de l'image en plus haute résolution" },
      { id: 'C', texte: "Des couleurs plus contrastées dans le graphique" },
      { id: 'D', texte: "Une animation qui s'affiche au survol de la souris" },
    ],
    bonneReponse: 'A',
    explication:
      "Un lecteur d'écran ne peut pas « voir » une image : il lit son alternative textuelle (attribut `alt`, ou un texte ou tableau associé pour un graphique complexe). Cette alternative doit transmettre l'information utile, par exemple la tendance et les valeurs clés, pas seulement « graphique ».",
    pourquoiPas: {
      B: "Une meilleure résolution aide les personnes malvoyantes, pas celles qui ne voient pas l'image du tout.",
      C: "Le contraste aide les personnes malvoyantes ou daltoniennes, mais reste inaccessible à un lecteur d'écran.",
      D: "Le survol à la souris est inutilisable pour qui navigue au clavier ou au lecteur d'écran.",
    },
    aRetenir: "Toute image porteuse d'information doit avoir une alternative textuelle qui en restitue le sens.",
  },
  {
    id: 'NUM-UX-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'facile',
    enonce:
      "Au tout début de la conception d'un portail, l'équipe veut valider avec le métier l'organisation des blocs d'une page (menu, formulaire, boutons) sans se soucier des couleurs ni des polices. Quel livrable produire ?",
    options: [
      { id: 'A', texte: "Une maquette graphique haute fidélité" },
      { id: 'B', texte: "Une charte graphique complète" },
      { id: 'C', texte: "Un wireframe (schéma fonctionnel)" },
      { id: 'D', texte: "Une première version en production" },
    ],
    bonneReponse: 'C',
    explication:
      "Le wireframe est un schéma en noir et blanc qui montre la structure d'une page et la place des éléments, sans habillage graphique. Il est rapide à produire et à corriger. Viennent ensuite la maquette (rendu visuel fidèle) et le prototype (navigation cliquable).",
    pourquoiPas: {
      A: "La maquette haute fidélité intègre couleurs, polices et images : trop tôt et trop coûteuse à modifier à ce stade.",
      B: "La charte graphique définit l'identité visuelle (couleurs, typographies), pas l'organisation d'une page.",
      D: "Développer avant d'avoir validé la structure fait payer très cher chaque changement.",
    },
    aRetenir: "Wireframe (structure) → maquette (apparence) → prototype (interaction).",
  },
  {
    id: 'NUM-UX-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'facile',
    enonce:
      "Un client demande ce que garantit le cadenas affiché par le navigateur sur la page de connexion du site `banque-alpha.example`. Que lui répondre ?",
    options: [
      { id: 'A', texte: "Les échanges sont chiffrés avec le domaine affiché" },
      { id: 'B', texte: "Le site appartient forcément à une organisation honnête" },
      { id: 'C', texte: "Le serveur a été audité par une autorité publique" },
      { id: 'D', texte: "Le site est protégé contre toute tentative d'intrusion" },
    ],
    bonneReponse: 'A',
    explication:
      "HTTPS chiffre les échanges entre le navigateur et le serveur, et le certificat atteste que ce serveur contrôle bien le nom de domaine affiché. Il ne dit rien de l'honnêteté du site : un site d'hameçonnage peut obtenir un certificat pour son propre domaine. Il faut donc toujours vérifier l'adresse exacte.",
    pourquoiPas: {
      B: "Un site frauduleux peut afficher un cadenas : le certificat prouve le contrôle du domaine, pas la bonne foi.",
      C: "Un certificat est délivré par une autorité de certification après une vérification du domaine, pas après un audit de sécurité.",
      D: "Le chiffrement protège les échanges en transit ; il ne protège pas le serveur contre les failles applicatives.",
    },
    aRetenir: "Cadenas = connexion chiffrée vers ce domaine, pas garantie que le site est légitime : vérifie l'adresse.",
  },
  {
    id: 'NUM-UX-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'moyen',
    enonce:
      "L'audit d'accessibilité d'un portail vise le niveau AA des WCAG. Un texte gris clair sur fond blanc, de taille normale, présente un rapport de contraste de 3,2:1. Est-il conforme ?",
    options: [
      { id: 'A', texte: "Oui, le seuil AA est de 3:1 pour tous les textes" },
      { id: 'B', texte: "Oui, le seuil AA ne s'applique qu'aux titres" },
      { id: 'C', texte: "Non, le seuil AA est de 7:1 pour tous les textes" },
      { id: 'D', texte: "Non, le seuil AA est de 4,5:1 pour un texte normal" },
    ],
    bonneReponse: 'D',
    explication:
      "Au niveau AA, les WCAG exigent un contraste d'au moins 4,5:1 pour le texte de taille normale et de 3:1 pour le grand texte. Avec 3,2:1, ce texte courant n'est pas conforme : il faut foncer le gris (ou agrandir nettement le texte si c'est un titre).",
    pourquoiPas: {
      A: "3:1 est le seuil AA du grand texte uniquement, pas du texte courant.",
      B: "Le critère de contraste s'applique à tout le texte, avec un seuil plus bas pour le grand texte.",
      C: "7:1 est le seuil du niveau AAA pour le texte normal, pas du niveau AA.",
    },
    aRetenir: "WCAG AA : contraste 4,5:1 pour le texte normal, 3:1 pour le grand texte (AAA : 7:1).",
  },
  {
    id: 'NUM-UX-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'moyen',
    enonce:
      "La page d'accueil d'un service en ligne pèse 3 Mo. Dans une zone où le débit réel n'est que de 1 Mbit/s, combien de temps faut-il au minimum pour la télécharger (latence ignorée, 1 octet = 8 bits) ?",
    options: [
      { id: 'A', texte: "Environ 3 secondes" },
      { id: 'B', texte: "Environ 24 secondes" },
      { id: 'C', texte: "Environ 0,4 seconde" },
      { id: 'D', texte: "Environ 8 secondes" },
    ],
    bonneReponse: 'B',
    explication:
      "3 Mo = 3 × 8 = 24 Mbit ; à 1 Mbit/s, il faut 24 secondes, sans compter la latence. Pour un public mal connecté, la sobriété est décisive : images compressées et dimensionnées, pas de vidéo en lecture automatique, scripts limités, page utile dès les premiers kilo-octets.",
    pourquoiPas: {
      A: "Ce calcul confond octets et bits : un débit en Mbit/s se compare à un poids converti en mégabits.",
      C: "0,4 s revient à diviser par 8 au lieu de multiplier : 3 Mo valent 24 Mbit, pas 0,375.",
      D: "8 secondes correspondent à 1 Mo, pas à 3 Mo.",
    },
    aRetenir: "Temps ≈ poids (Mo) × 8 / débit (Mbit/s) : une page lourde exclut les usagers mal connectés.",
  },
  {
    id: 'NUM-UX-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'moyen',
    enonce:
      "Avant de lancer une application de mobile banking, Banque Alpha veut vérifier qu'un client peu habitué au numérique peut faire seul un transfert. Quelle méthode donne l'information la plus fiable ?",
    options: [
      { id: 'A', texte: "Faire tester l'application par l'équipe de développement" },
      { id: 'B', texte: "Envoyer un questionnaire de satisfaction en ligne aux clients les plus actifs" },
      { id: 'C', texte: "Analyser le nombre de téléchargements de la première semaine" },
      { id: 'D', texte: "Observer quelques clients représentatifs faire la tâche, sans aide" },
    ],
    bonneReponse: 'D',
    explication:
      "Le test utilisateur consiste à observer de vrais utilisateurs du public visé accomplir une tâche réelle, sans les guider, en notant où ils hésitent ou échouent. Quelques participants bien choisis suffisent à révéler la plupart des problèmes majeurs ; on corrige puis on reteste.",
    pourquoiPas: {
      A: "Les développeurs connaissent l'application par cœur : ils ne rencontrent pas les difficultés d'un novice.",
      B: "Les clients les plus actifs ne représentent pas le public peu habitué au numérique, et un questionnaire recueille des opinions, pas des comportements.",
      C: "Les téléchargements mesurent l'intérêt, pas la capacité à réussir un transfert.",
    },
    aRetenir: "Pour savoir si c'est utilisable, on observe de vrais utilisateurs représentatifs, sans les aider.",
  },
  {
    id: 'NUM-UX-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Web, UX & accessibilité',
    difficulte: 'difficile',
    enonce:
      "Un audit révèle que le formulaire de réclamation d'un portail ne peut pas être envoyé sans souris : le bouton « Envoyer » est une `<div>` rendue cliquable par un script. Quelle correction est la plus appropriée ?",
    options: [
      { id: 'A', texte: "Utiliser un vrai élément `<button>`" },
      { id: 'B', texte: "Ajouter une infobulle « Cliquez ici » au survol de la zone" },
      { id: 'C', texte: "Ajouter seulement `tabindex=\"0\"` à la `<div>` existante" },
      { id: 'D', texte: "Agrandir la zone cliquable et renforcer sa couleur" },
    ],
    bonneReponse: 'A',
    explication:
      "Un élément `<button>` natif est focalisable, s'active avec Entrée et Espace, et il est annoncé comme bouton par les lecteurs d'écran, sans code supplémentaire. Reproduire tout cela sur une `<div>` demande un rôle, une gestion du focus et des événements clavier : le natif est plus simple et plus robuste.",
    pourquoiPas: {
      B: "Une infobulle au survol n'aide pas l'utilisateur au clavier, qui ne peut toujours pas activer la zone.",
      C: "`tabindex` rend la `<div>` focalisable, mais elle ne s'active toujours pas au clavier et n'est pas annoncée comme bouton.",
      D: "Une zone plus grande aide à la souris ou au doigt, mais ne règle pas l'accès au clavier.",
    },
    aRetenir: "Utilise les éléments HTML natifs (`<button>`, `<a>`, `<label>`) : l'accessibilité clavier vient avec.",
  },

  // ───────────────────────────── Gouvernance du SI & données personnelles ─────────────────────────────
  {
    id: 'NUM-GOV-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'facile',
    enonce:
      "Une microfinance crée un formulaire d'inscription à sa lettre d'information sur l'éducation financière. En appliquant le principe de minimisation, quelles données collecter ?",
    options: [
      { id: 'A', texte: "Nom, e-mail, numéro de pièce d'identité et revenus mensuels" },
      { id: 'B', texte: "L'adresse e-mail, et éventuellement un prénom" },
      { id: 'C', texte: "Le plus de données possible, au cas où elles serviraient" },
      { id: 'D', texte: "E-mail, date de naissance, profession et nom de l'employeur" },
    ],
    bonneReponse: 'B',
    explication:
      "La minimisation impose de ne collecter que les données nécessaires à la finalité annoncée. Pour envoyer une lettre d'information, l'adresse e-mail suffit ; un prénom permet de personnaliser le message. Chaque donnée en plus est une donnée de plus à protéger.",
    pourquoiPas: {
      A: "La pièce d'identité et les revenus n'ont aucun rapport avec l'envoi d'une lettre d'information.",
      C: "Collecter « au cas où » est exactement ce que la minimisation interdit.",
      D: "Ces informations dépassent le besoin ; elles augmentent le risque en cas de fuite sans servir la finalité.",
    },
    aRetenir: "Minimisation : seulement les données nécessaires à la finalité annoncée.",
  },
  {
    id: 'NUM-GOV-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'facile',
    enonce: "Dans le plan de continuité d'activité d'une banque, que désigne le RTO d'une application ?",
    options: [
      { id: 'A', texte: "La perte de données maximale admissible" },
      { id: 'B', texte: "La durée de conservation des sauvegardes" },
      { id: 'C', texte: "La durée maximale d'interruption admissible" },
      { id: 'D', texte: "Le taux de disponibilité de la liaison réseau" },
    ],
    bonneReponse: 'C',
    explication:
      "Le RTO (Recovery Time Objective) est le délai maximal admissible pour rétablir le service après un sinistre. Le RPO (Recovery Point Objective) est la perte de données maximale admissible, exprimée en temps. Les deux sont fixés par le métier et dimensionnent les solutions techniques.",
    pourquoiPas: {
      A: "C'est la définition du RPO, l'autre indicateur clé de la continuité.",
      B: "La durée de rétention des sauvegardes est un paramètre de la politique de sauvegarde, pas le RTO.",
      D: "La disponibilité d'un lien relève d'un SLA, pas des objectifs de reprise.",
    },
    aRetenir: "RTO : en combien de temps on redémarre ; RPO : combien de données on accepte de perdre.",
  },
  {
    id: 'NUM-GOV-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'moyen',
    enonce:
      "La base de données des prêts d'une microfinance est sauvegardée chaque nuit à 23 h. Le métier exige un RPO de 4 heures. Une panne détruit la base le lendemain à 16 h. Que constate-t-on ?",
    options: [
      { id: 'A', texte: "RPO respecté, car la sauvegarde a moins de 24 h" },
      { id: 'B', texte: "Jusqu'à 17 h de données perdues : RPO non tenu" },
      { id: 'C', texte: "Aucune perte, la sauvegarde de la veille étant complète" },
      { id: 'D', texte: "Au plus 4 h de données perdues, comme prévu par le RPO" },
    ],
    bonneReponse: 'B',
    explication:
      "La dernière sauvegarde date de 23 h la veille : tout ce qui a été saisi entre 23 h et 16 h, soit 17 heures, est perdu. Une sauvegarde quotidienne ne peut pas tenir un RPO de 4 heures : il faut des sauvegardes plus fréquentes (journaux de transactions, réplication).",
    pourquoiPas: {
      A: "Le RPO est de 4 h, pas de 24 h : l'ancienneté de la sauvegarde dépasse largement l'objectif.",
      C: "La sauvegarde est complète, mais ne contient rien de ce qui a été saisi après 23 h.",
      D: "Le RPO est un objectif ; seule la fréquence réelle des sauvegardes détermine la perte effective.",
    },
    aRetenir: "Perte réelle = temps écoulé depuis la dernière copie exploitable ; la fréquence des sauvegardes doit suivre le RPO.",
  },
  {
    id: 'NUM-GOV-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'moyen',
    enonce:
      "Un agent doit transmettre le projet de budget de sa direction, classé « Confidentiel », à un prestataire externe chargé de la mise en page. Comment procède-t-il ?",
    options: [
      { id: 'A', texte: "Il l'envoie depuis sa messagerie personnelle, plus rapide" },
      { id: 'B', texte: "Il retire la mention « Confidentiel » avant l'envoi" },
      { id: 'C', texte: "Il obtient l'accord du propriétaire et utilise un canal sécurisé" },
      { id: 'D', texte: "Il l'envoie normalement, le prestataire étant sous contrat" },
    ],
    bonneReponse: 'C',
    explication:
      "La classification fixe les règles de manipulation d'une information. Pour un document confidentiel, c'est son propriétaire (ici la direction) qui décide de sa diffusion ; la transmission se fait par un canal protégé, à un destinataire tenu par un engagement de confidentialité.",
    pourquoiPas: {
      A: "La messagerie personnelle sort le document du périmètre maîtrisé par l'institution : c'est une fuite.",
      B: "Retirer la mention ne change rien à la sensibilité du contenu ; cela supprime seulement l'alerte.",
      D: "Un contrat ne remplace pas l'autorisation du propriétaire ni les règles de transmission prévues.",
    },
    aRetenir: "La classification dicte la manipulation : le propriétaire autorise, le canal protège.",
  },
  {
    id: 'NUM-GOV-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'moyen',
    enonce:
      "Un ancien client, qui a soldé son crédit il y a un an, demande à la microfinance d'effacer toutes ses données. Selon les principes de protection des données, que faut-il faire ?",
    options: [
      { id: 'A', texte: "Tout effacer aussitôt, y compris les pièces comptables du crédit" },
      { id: 'B', texte: "Refuser, car les données d'un client appartiennent à l'institution" },
      { id: 'C', texte: "Effacer ce qui n'est plus utile, garder ce que la loi impose" },
      { id: 'D', texte: "Conserver ses données sans limite de durée, par précaution" },
    ],
    bonneReponse: 'C',
    explication:
      "Le droit à l'effacement s'exerce dans la limite des obligations légales : les pièces que la réglementation impose de conserver (comptabilité, lutte contre le blanchiment) sont gardées pour la durée prévue, avec un accès restreint, puis supprimées. Le reste est effacé, et la personne est informée de ce qui a été fait.",
    pourquoiPas: {
      A: "Certaines données doivent être conservées pour une durée légale ; les effacer exposerait l'institution.",
      B: "L'institution détient les données pour des finalités précises, elle n'en dispose pas librement.",
      D: "Toute donnée personnelle a une durée de conservation limitée, liée à sa finalité.",
    },
    aRetenir: "Effacement : supprimer ce qui n'est plus nécessaire, conserver le strict légal pour sa durée, informer la personne.",
  },
  {
    id: 'NUM-GOV-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'moyen',
    enonce:
      "Depuis un mois, l'incident « lenteur de l'application de caisse » revient chaque lundi matin ; à chaque fois, le support redémarre le serveur et clôt le ticket. Selon ITIL, quelle pratique faut-il engager ?",
    options: [
      { id: 'A', texte: "La gestion des demandes de service" },
      { id: 'B', texte: "La gestion des niveaux de service" },
      { id: 'C', texte: "La gestion des actifs informatiques" },
      { id: 'D', texte: "La gestion des problèmes" },
    ],
    bonneReponse: 'D',
    explication:
      "La gestion des incidents rétablit le service au plus vite (ici, le redémarrage). La gestion des problèmes cherche la cause racine des incidents récurrents (traitement planifié, saturation du lundi…) pour les éliminer durablement ; en attendant, le contournement est documenté comme erreur connue.",
    pourquoiPas: {
      A: "Les demandes de service concernent des requêtes standard (accès, matériel), pas une panne récurrente.",
      B: "Les niveaux de service définissent et suivent les engagements de qualité ; ils ne recherchent pas la cause.",
      C: "La gestion des actifs inventorie les équipements et logiciels ; elle ne diagnostique pas un dysfonctionnement.",
    },
    aRetenir: "Incident : rétablir vite ; problème : trouver et supprimer la cause des incidents qui se répètent.",
  },
  {
    id: 'NUM-GOV-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Gouvernance du SI & données personnelles',
    difficulte: 'difficile',
    enonce:
      "Le service marketing de Banque Alpha veut utiliser les numéros de téléphone collectés pour l'envoi des codes de sécurité (OTP) afin d'adresser des SMS publicitaires aux clients. Quel principe est en jeu et que faire ?",
    options: [
      { id: 'A', texte: "Exactitude : vérifier que les numéros sont à jour avant l'envoi" },
      { id: 'B', texte: "Sécurité : chiffrer la liste avant de la confier au prestataire SMS" },
      { id: 'C', texte: "Transparence : signer chaque SMS du nom de la banque" },
      { id: 'D', texte: "Finalité : recueillir le consentement avant tout usage publicitaire" },
    ],
    bonneReponse: 'D',
    explication:
      "Les numéros ont été collectés pour sécuriser les opérations ; les réutiliser pour de la prospection est une finalité différente, incompatible avec la première sans base appropriée. Il faut informer les clients et recueillir leur consentement (avec possibilité de refus simple) avant tout envoi publicitaire.",
    pourquoiPas: {
      A: "Des numéros exacts ne rendent pas légitime un usage différent de celui annoncé lors de la collecte.",
      B: "Chiffrer la liste protège sa transmission mais ne règle pas la question de l'usage autorisé.",
      C: "Identifier l'expéditeur est utile, mais ne remplace pas une base légitime pour ce nouvel usage.",
    },
    aRetenir: "Finalité : une donnée collectée pour un but précis ne se réutilise pas pour un autre sans base légitime.",
  },

  // ───────────────────────────── Hygiène numérique & sécurité ─────────────────────────────
  {
    id: 'NUM-HYG-001',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'facile',
    enonce:
      "Une agente reçoit un e-mail signé « Service informatique » lui demandant de confirmer son mot de passe sous 24 h via un lien vers `banque-alpha-support.example.net`, sous peine de blocage de son compte. Que doit-elle faire ?",
    options: [
      { id: 'A', texte: "Ne pas cliquer et signaler l'e-mail à la sécurité" },
      { id: 'B', texte: "Cliquer pour vérifier si la page ressemble à l'intranet" },
      { id: 'C', texte: "Répondre à l'e-mail pour demander s'il est authentique" },
      { id: 'D', texte: "Le transférer à ses collègues pour les mettre en garde" },
    ],
    bonneReponse: 'A',
    explication:
      "Urgence, menace de blocage, demande de mot de passe et domaine inconnu : ce sont les signes classiques de l'hameçonnage. Un service informatique ne demande jamais un mot de passe par e-mail. On ne clique pas, et on signale le message par le canal prévu pour que l'équipe sécurité bloque le lien pour tout le monde.",
    pourquoiPas: {
      B: "Ouvrir le lien peut suffire à exposer le poste, et une page frauduleuse peut parfaitement imiter l'intranet.",
      C: "La réponse arrive chez l'attaquant, qui confirmera bien sûr l'authenticité du message.",
      D: "Transférer le message multiplie les risques de clic ; le signalement centralisé est plus sûr.",
    },
    aRetenir: "Urgence + demande d'identifiants + lien inconnu = hameçonnage : ne pas cliquer, signaler.",
  },
  {
    id: 'NUM-HYG-002',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'facile',
    enonce: "Pourquoi activer l'authentification multifacteur (MFA) sur la messagerie professionnelle ?",
    options: [
      { id: 'A', texte: "Pour pouvoir choisir un mot de passe court et simple" },
      { id: 'B', texte: "Un mot de passe volé ne suffit plus à se connecter" },
      { id: 'C', texte: "Pour accélérer l'ouverture de la messagerie le matin" },
      { id: 'D', texte: "Pour chiffrer automatiquement les pièces jointes envoyées" },
    ],
    bonneReponse: 'B',
    explication:
      "La MFA combine plusieurs facteurs : ce que l'on sait (mot de passe), ce que l'on possède (téléphone, clé de sécurité) ou ce que l'on est (biométrie). Un attaquant qui a obtenu le mot de passe doit encore disposer du second facteur, ce qui bloque la grande majorité des prises de contrôle de comptes.",
    pourquoiPas: {
      A: "La MFA complète un bon mot de passe, elle ne le remplace pas.",
      C: "La MFA ajoute une étape de vérification ; elle n'accélère pas la connexion.",
      D: "Le chiffrement des pièces jointes est une autre mesure, sans lien avec l'authentification.",
    },
    aRetenir: "MFA : un mot de passe volé ne suffit plus ; à activer en priorité sur la messagerie et les accès distants.",
  },
  {
    id: 'NUM-HYG-003',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'facile',
    enonce: "Que préconise la règle de sauvegarde « 3-2-1 » ?",
    options: [
      { id: 'A', texte: "3 sauvegardes par jour, 2 par semaine, 1 par mois" },
      { id: 'B', texte: "3 disques en RAID, 2 serveurs et 1 onduleur" },
      { id: 'C', texte: "3 mots de passe, 2 facteurs et 1 administrateur" },
      { id: 'D', texte: "3 copies, sur 2 supports, dont 1 hors site" },
    ],
    bonneReponse: 'D',
    explication:
      "La règle 3-2-1 : 3 copies des données (l'original et deux sauvegardes), sur 2 types de supports différents, dont 1 conservée hors site. On y ajoute souvent une copie hors ligne ou non modifiable, pour résister aux rançongiciels qui chiffrent aussi les sauvegardes accessibles.",
    pourquoiPas: {
      A: "C'est un calendrier de sauvegarde inventé ; la règle porte sur le nombre de copies et leur emplacement.",
      B: "Le RAID protège contre la panne d'un disque, mais il réplique aussi les suppressions et les chiffrements : ce n'est pas une sauvegarde.",
      C: "Ces éléments relèvent de l'authentification, pas de la sauvegarde.",
    },
    aRetenir: "3-2-1 : 3 copies, 2 supports, 1 hors site — et idéalement une copie hors ligne.",
  },
  {
    id: 'NUM-HYG-004',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'moyen',
    enonce:
      "Un chef de service utilise une vingtaine de comptes : portails de partenaires, outils internes, services en ligne. Quelle pratique est la plus sûre pour gérer ses mots de passe ?",
    options: [
      { id: 'A', texte: "Un seul mot de passe très complexe, réutilisé partout" },
      { id: 'B', texte: "Un gestionnaire de mots de passe et un mot de passe par compte" },
      { id: 'C', texte: "Un carnet rangé dans un tiroir du bureau fermé à clé" },
      { id: 'D', texte: "Un fichier Excel protégé par mot de passe sur le bureau" },
    ],
    bonneReponse: 'B',
    explication:
      "Un gestionnaire de mots de passe génère et stocke, chiffrés, des mots de passe longs et différents pour chaque compte ; l'utilisateur ne retient qu'une phrase de passe maîtresse, protégée par MFA si possible. Si un site est piraté, seul le compte concerné est exposé.",
    pourquoiPas: {
      A: "Réutiliser un mot de passe expose tous les comptes dès qu'un seul site est compromis (« credential stuffing »).",
      C: "Un carnet peut être perdu, photographié ou consulté par d'autres, et il incite à des mots de passe simples.",
      D: "La protection d'un fichier bureautique est faible, et le fichier est exposé à tout logiciel malveillant du poste.",
    },
    aRetenir: "Un mot de passe unique par compte, stocké dans un gestionnaire protégé par une phrase de passe et la MFA.",
  },
  {
    id: 'NUM-HYG-005',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'moyen',
    enonce:
      "En mission à Goma, un agent doit consulter l'intranet de son institution depuis son ordinateur portable. Le Wi-Fi de l'hôtel est ouvert, sans mot de passe. Que doit-il faire ?",
    options: [
      { id: 'A', texte: "Se connecter normalement, puisque l'intranet demande un mot de passe" },
      { id: 'B', texte: "Désactiver le pare-feu du portable pour éviter les blocages" },
      { id: 'C', texte: "Passer par le VPN de l'institution ou le partage de son téléphone" },
      { id: 'D', texte: "Choisir le réseau Wi-Fi au signal le plus fort, quel que soit son nom" },
    ],
    bonneReponse: 'C',
    explication:
      "Sur un Wi-Fi ouvert, n'importe qui peut observer le trafic non chiffré ou créer un faux point d'accès portant le même nom. Le VPN de l'institution chiffre tout le trafic jusqu'au réseau interne ; à défaut, le partage de connexion du téléphone professionnel évite ce réseau partagé.",
    pourquoiPas: {
      A: "Le mot de passe de l'intranet ne protège pas le reste du trafic, et un faux point d'accès peut tenter de l'intercepter.",
      B: "Le pare-feu est justement indispensable sur un réseau public partagé avec des inconnus.",
      D: "Un attaquant peut diffuser un faux point d'accès au signal puissant et au nom trompeur.",
    },
    aRetenir: "Wi-Fi public : VPN de l'institution ou partage de connexion, pare-feu actif, jamais de réseau inconnu.",
  },
  {
    id: 'NUM-HYG-006',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'moyen',
    enonce:
      "Pour gagner du temps, une agente colle le tableau nominatif des encours de crédit de ses clients dans un chatbot d'IA gratuit, grand public, et lui demande une synthèse. Quel est le risque principal ?",
    options: [
      { id: 'A', texte: "Des données confidentielles sortent vers un service non maîtrisé" },
      { id: 'B', texte: "La synthèse sera moins précise qu'un travail fait à la main" },
      { id: 'C', texte: "Le service pourra facturer l'usage au-delà d'un quota gratuit" },
      { id: 'D', texte: "Le tableau risque d'être corrompu lors du copier-coller" },
    ],
    bonneReponse: 'A',
    explication:
      "Ce qui est saisi dans un service grand public quitte le périmètre de l'institution : selon les conditions d'utilisation, ces données peuvent être conservées, consultées ou servir à entraîner des modèles. C'est une fuite de données clients et du « shadow IT ». Il faut utiliser les outils approuvés, ou anonymiser les données.",
    pourquoiPas: {
      B: "Une erreur de synthèse se corrige à la relecture ; la fuite de données, elle, est irréversible.",
      C: "Le coût éventuel est secondaire face à l'exposition de données nominatives de clients.",
      D: "Un copier-coller ne modifie pas le fichier source ; le risque est ailleurs.",
    },
    aRetenir: "Jamais de données clients ou internes dans un outil d'IA grand public non approuvé.",
  },
  {
    id: 'NUM-HYG-007',
    section: 'technique',
    filiere: 'numerique',
    competence: 'Hygiène numérique & sécurité',
    difficulte: 'difficile',
    enonce:
      "Un vendredi à 17 h, la comptable reçoit un appel puis un e-mail du « directeur général », en déplacement, qui exige un virement urgent et confidentiel vers un nouveau fournisseur. L'adresse de l'expéditeur semble correcte. Que doit-elle faire ?",
    options: [
      { id: 'A', texte: "Exécuter le virement, l'adresse étant celle du directeur" },
      { id: 'B', texte: "Répondre à l'e-mail en demandant une confirmation écrite" },
      { id: 'C', texte: "Rappeler le directeur sur son numéro connu, et faire valider" },
      { id: 'D', texte: "Exiger que l'appelant donne son matricule pour s'identifier" },
    ],
    bonneReponse: 'C',
    explication:
      "C'est le schéma de la « fraude au président » : urgence, secret, autorité et nouveau bénéficiaire. La parade est un contre-appel par un canal indépendant (le numéro connu de l'annuaire, pas celui fourni par l'interlocuteur) et le respect de la double validation des paiements, quel que soit le rang du demandeur.",
    pourquoiPas: {
      A: "Une adresse d'expéditeur peut être usurpée ou provenir d'une boîte compromise : elle ne prouve rien.",
      B: "La réponse part vers l'attaquant (adresse usurpée ou de réponse modifiée), qui confirmera volontiers.",
      D: "Un matricule se trouve facilement par ingénierie sociale ; seul un canal indépendant authentifie le demandeur.",
    },
    aRetenir: "Urgence + secret + nouveau bénéficiaire : contre-appel sur un numéro connu et double validation, sans exception.",
  },
];
