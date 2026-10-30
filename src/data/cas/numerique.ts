// Cas pratiques — filière Numérique (préfixe NUM).
// Scénarios entièrement fictifs (« Banque Alpha », prestataires et portefeuilles inventés, domaines .example) :
// dématérialisation, paiement marchand par QR code, contrat SaaS, assistant d’IA générative.

import type { CasPratique } from '@/lib/types';

export const casNumerique: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // NUM-CAS-01 — Dématérialiser la demande de crédit PME
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'NUM-CAS-01',
    filiere: 'numerique',
    titre: 'La demande de crédit PME passe au numérique',
    role: 'Chargé de projet transformation numérique — Direction de l’organisation, Banque Alpha',
    heure: 'Lundi 09h00',
    enjeu:
      'Dématérialiser un processus papier en visant le vrai gisement de gain, avec un MVP mesuré et une conduite du changement qui fait disparaître le circuit papier.',
    contexte:
      'La direction générale de Banque Alpha (banque fictive) veut « digitaliser le crédit PME » avant la fin de l’année. Aujourd’hui, le dossier est déposé sur papier en agence, acheminé au siège par la navette du courrier interne, ressaisi, contrôlé, analysé puis présenté au comité de crédit hebdomadaire. Les clients se plaignent des délais et des allers-retours pour pièces manquantes. Tu es nommé chef de projet, avec une petite équipe (un product owner métier venu du Crédit, deux développeurs, une designer UX) et un budget limité. Ta directrice, Mme Mukendi, attend ton plan d’attaque.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Processus actuel du crédit PME — délais moyens mesurés sur 3 mois (données fictives)',
        colonnes: ['Étape', 'Acteur', 'Délai moyen (jours ouvrés)', 'Observation'],
        lignes: [
          ['1. Dépôt du dossier papier et contrôle sommaire', 'Agence', '1', 'Formulaire de 6 pages rempli à la main'],
          ['2. Navette vers le siège', 'Courrier interne', '2,5', 'Deux passages par semaine'],
          ['3. Enregistrement et ressaisie', 'Back-office Crédit', '1,5', 'Erreurs de saisie fréquentes'],
          ['4. Contrôle de complétude', 'Back-office Crédit', '1', '40 % des dossiers incomplets'],
          ['4 bis. Retour au client pour pièces manquantes', 'Agence', '7 (dossiers incomplets seulement)', 'Soit 0,4 × 7 = 2,8 jours en moyenne par dossier'],
          ['5. Analyse crédit', 'Analyste', '4', 'Seule étape d’expertise métier'],
          ['6. Attente et passage en comité', 'Comité de crédit', '2,5', 'Comité hebdomadaire'],
          ['7. Notification au client', 'Agence', '2', 'Lettre envoyée à l’agence, puis appel du client'],
          ['Total moyen', '—', '17,3', '—'],
        ],
      },
      {
        type: 'table',
        titre: 'Pilote de 8 semaines dans 2 agences — parcours en ligne (données fictives)',
        colonnes: ['Indicateur', 'Valeur'],
        lignes: [
          ['Demandes démarrées en ligne', '420'],
          ['Demandes soumises', '231 (55 %)'],
          ['Abandons à l’étape « Identification »', '21'],
          ['Abandons à l’étape « Informations sur l’entreprise »', '34'],
          ['Abandons à l’étape « Téléversement des pièces »', '126'],
          ['Abandons à l’étape « Validation »', '8'],
          ['Sessions sur téléphone mobile', '72 %'],
          ['Dossiers incomplets à l’arrivée au siège', '6 % (contre 40 % sur papier)'],
          ['Délai moyen de bout en bout (dossiers en ligne)', '9,5 jours ouvrés (contre 17,3)'],
        ],
      },
      {
        type: 'texte',
        titre: 'Verbatims recueillis pendant le pilote',
        contenu:
          'Client PME (quincaillerie, Limete) : « Mes statuts font 14 Mo en PDF. Avec ma connexion, l’envoi tourne puis échoue, et tout est à recommencer. »\nCliente PME (couture, Ngaliema) : « Je n’ai pas de scanner. J’ai photographié mes documents, mais le site n’accepte que le PDF. »\nAnalyste crédit (siège) : « J’imprime le dossier en ligne pour l’annoter, sinon je ne peux pas le présenter au comité, qui travaille sur papier. »\nConseillère en agence : « Personne ne nous a expliqué ce qui change pour nous. Je continue d’accepter les dossiers papier, c’est plus sûr. »',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Par quoi commences-tu ton cadrage ?',
        options: [
          {
            id: 'a',
            texte: 'Acheter sans attendre une plateforme de gestion électronique des documents complète, pour montrer un résultat visible à la direction avant la fin de l’année.',
            points: 0,
            feedback:
              'Choisir l’outil avant de comprendre le problème est l’erreur classique : tu risques de payer des fonctions inutiles et de rater la vraie cause des délais. L’outil vient après le diagnostic et l’expression du besoin.',
          },
          {
            id: 'b',
            texte: 'Cartographier le processus actuel avec les agences et le back-office, mesurer les délais de référence et fixer l’objectif chiffré avec la direction.',
            points: 3,
            feedback:
              'Exact. La cartographie « tel quel » révèle où se perd le temps, et la mesure de référence (17,3 jours) permettra de prouver le gain. Un objectif chiffré partagé avec la direction cadre les arbitrages à venir.',
          },
          {
            id: 'c',
            texte: 'Transformer le formulaire papier de six pages en PDF remplissable, à envoyer par courriel : c’est rapide, peu coûteux et sans projet informatique.',
            points: 0,
            feedback:
              'C’est « numériser le papier » sans repenser le processus : la ressaisie, les dossiers incomplets et les allers-retours restent. Une dématérialisation utile supprime des étapes, elle ne se contente pas de changer de support.',
          },
          {
            id: 'd',
            texte: 'Rédiger seul un cahier des charges exhaustif couvrant tous les produits de crédit, puis le faire valider en bloc par chaque direction concernée.',
            points: 1,
            feedback:
              'Un cahier des charges a sa place, mais l’écrire seul, sur tout le périmètre et avant tout diagnostic, mène à un projet long et figé. On cadre d’abord avec les acteurs, puis on avance par incréments sur un produit.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'D’après le tableau du processus actuel, où se trouve le principal gisement de gain ?',
        options: [
          {
            id: 'a',
            texte: 'Dans l’analyse crédit, l’étape la plus longue (4 jours) : un score automatique devrait remplacer l’essentiel du travail de l’analyste.',
            points: 0,
            feedback:
              'C’est la seule étape à forte valeur ajoutée : l’expertise de l’analyste fonde la décision et maîtrise le risque. Elle ne pèse que 4 jours sur 17,3, alors que les étapes sans valeur ajoutée en cumulent plus du double.',
          },
          {
            id: 'b',
            texte: 'Dans les retours pour pièces manquantes : chaque dossier y perd 7 jours, que le contrôle en ligne fera gagner à tous les dossiers.',
            points: 1,
            feedback:
              'La cible est bonne, mais le calcul est faux : seuls 40 % des dossiers repartent, soit 0,4 × 7 = 2,8 jours en moyenne par dossier, pas 7. Et ce n’est qu’une partie du gisement.',
          },
          {
            id: 'c',
            texte: 'Dans le comité de crédit : le passer d’un rythme hebdomadaire à un rythme quotidien suffirait à diviser le délai total par deux.',
            points: 0,
            feedback:
              'L’attente du comité pèse 2,5 jours : même ramenée à zéro, le délai passerait de 17,3 à 14,8 jours, loin de la moitié. Et la gouvernance du crédit ne se modifie pas au nom d’un projet numérique sans décision de la direction.',
          },
          {
            id: 'd',
            texte: 'Navette, ressaisie, retours pour pièces et notification papier pèsent 8,8 jours sur 17,3 : la moitié du délai, sans valeur ajoutée.',
            points: 3,
            feedback:
              'Exact : 2,5 + 1,5 + 2,8 + 2 = 8,8 jours, soit environ 51 % du délai. Ce temps d’attente et de transport est précisément ce que la dématérialisation supprime : dépôt en ligne, contrôles de complétude à la saisie, notification électronique.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre la démarche de ton projet.',
        elements: [
          { id: 'mesurer', texte: 'Mesurer les résultats du pilote contre la référence et corriger le parcours' },
          { id: 'cartographier', texte: 'Cartographier le processus actuel et mesurer les délais de référence' },
          { id: 'generaliser', texte: 'Généraliser par vagues d’agences et arrêter le circuit papier à une date annoncée' },
          { id: 'mvp', texte: 'Construire un MVP sur le seul crédit PME, testé avec quelques clients' },
          { id: 'cible', texte: 'Dessiner le processus cible et fixer les indicateurs de réussite' },
          { id: 'pilote', texte: 'Ouvrir un pilote dans deux agences volontaires' },
        ],
        ordreCorrect: ['cartographier', 'cible', 'mvp', 'pilote', 'mesurer', 'generaliser'],
        pointsMax: 4,
        feedback:
          'On part de l’existant mesuré, on définit la cible et les indicateurs AVANT de construire, puis on livre un produit minimum viable sur un périmètre restreint. Le pilote en conditions réelles fournit des chiffres comparables à la référence ; on corrige, puis on généralise par vagues, en fixant une date de fin du papier pour éviter un double circuit durable.',
      },
      {
        type: 'choix',
        id: 'e4',
        question: 'Les résultats du pilote tombent. Quelle conclusion en tires-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Le canal en ligne marche : rendons-le obligatoire dès le mois prochain, pour que les clients hésitants n’aient plus le choix.',
            points: 0,
            feedback:
              'Imposer un parcours qui fait abandonner 45 % des clients, c’est perdre des demandes et exclure ceux qui ont une connexion faible. On ne force pas l’adoption d’un parcours défaillant : on le répare d’abord.',
          },
          {
            id: 'b',
            texte: 'Corriger le téléversement : photos acceptées et compressées, reprise sans tout perdre, et dépôt assisté en agence.',
            points: 3,
            feedback:
              'Exact. Deux abandons sur trois (126 sur 189) ont lieu au téléversement, et 72 % des sessions se font sur mobile : le parcours doit être conçu pour le téléphone et une bande passante faible. Le dépôt assisté en agence garde inclus les clients peu équipés.',
          },
          {
            id: 'c',
            texte: 'Lancer une campagne publicitaire sur les réseaux sociaux pour attirer davantage de PME vers le parcours en ligne et augmenter les demandes soumises.',
            points: 1,
            feedback:
              'Plus de trafic dans un parcours qui perd 45 % des clients, c’est surtout plus d’abandons. On corrige d’abord le point de fuite identifié (le téléversement), puis on amplifie.',
          },
          {
            id: 'd',
            texte: 'Les PME ne sont pas prêtes pour le numérique, puisque près de la moitié abandonnent : mieux vaut revenir au papier et améliorer la navette du courrier.',
            points: 0,
            feedback:
              'Le pilote dit l’inverse : le délai passe de 17,3 à 9,5 jours et les dossiers incomplets de 40 % à 6 %. Les abandons sont concentrés sur une étape précise, ce qui désigne un défaut de conception, pas un refus des clients.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Au siège, les analystes impriment chaque dossier en ligne, et en agence on accepte encore le papier. Comment réagis-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Tu fais signer par la direction une note interdisant dès lundi toute impression de dossier et tout dépôt papier, sous peine de sanction.',
            points: 1,
            feedback:
              'Une date de fin du papier est nécessaire, mais l’imposer sans traiter les causes (comité sur papier, outil sans annotation, agences non formées) provoque des contournements. L’interdiction vient en dernier, une fois les obstacles levés.',
          },
          {
            id: 'b',
            texte: 'Tu laisses les deux circuits coexister aussi longtemps que nécessaire : chacun choisira le canal qui lui convient le mieux, sans pression.',
            points: 0,
            feedback:
              'Un double circuit durable cumule les coûts des deux mondes, brouille les indicateurs et ne fait jamais disparaître le papier. La coexistence doit être limitée dans le temps.',
          },
          {
            id: 'c',
            texte: 'Tu traites les causes : annotation dans l’outil, vue comité, agents formés et relais par agence, puis fin du papier datée.',
            points: 3,
            feedback:
              'C’est la conduite du changement attendue : écouter les irritants (les verbatims les donnent), adapter l’outil aux usages réels, impliquer le président du comité, former et s’appuyer sur des relais. La date de fin du papier, annoncée à l’avance, vient sécuriser le basculement.',
          },
          {
            id: 'd',
            texte: 'Tu ajoutes une impression automatique de chaque dossier en ligne au siège : les analystes gardent leurs habitudes et le comité reçoit ses dossiers.',
            points: 0,
            feedback:
              'Tu réintroduis le papier par la porte de service : le projet garde ses coûts sans en tirer tous les bénéfices (traçabilité, partage, archivage). Il faut adapter l’outil et le comité, pas l’inverse.',
          },
        ],
      },
    ],
    pointsMax: 16,
    debrief:
      'Ce cas évalue ta capacité à mener une transformation numérique utile, et non une simple numérisation.\n• Cadrage : on cartographie le processus et on mesure une référence (17,3 jours) avant de choisir un outil.\n• Gisement : navette (2,5), ressaisie (1,5), retours pour pièces (0,4 × 7 = 2,8) et notification papier (2) font 8,8 jours, soit environ la moitié du délai, sans valeur ajoutée. L’analyse crédit, seule étape d’expertise, n’est pas la cible.\n• Démarche : processus cible et indicateurs, MVP sur un seul produit, pilote, mesure, correction, généralisation par vagues.\n• Lecture du pilote : le délai tombe à 9,5 jours et les incomplets à 6 %, mais 45 % des demandes sont abandonnées, dont deux sur trois au téléversement. Avec 72 % de sessions mobiles, il faut un parcours pensé pour le téléphone et les connexions faibles (photos compressées, reprise d’un brouillon) et un dépôt assisté en agence pour l’inclusion.\n\nLa conduite du changement est la moitié du travail : les verbatims révèlent des causes concrètes (comité sur papier, absence d’annotation, agences non informées). On les traite, on forme, on s’appuie sur des relais, puis on fixe une date de fin du papier.\n\nRéflexes à retenir :\n• Mesurer avant de transformer, pour pouvoir prouver le gain.\n• Viser le temps sans valeur ajoutée, pas l’expertise.\n• Un taux d’abandon concentré sur une étape désigne un défaut de conception.\n• Pas de double circuit sans date de fin.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NUM-CAS-02 — Pilote de paiement marchand par QR code et vague de fraude
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'NUM-CAS-02',
    filiere: 'numerique',
    titre: 'Paiement par QR code : le pilote face à une vague de fraude',
    role: 'Chef de produit paiements numériques — Direction de la banque digitale, Banque Alpha',
    heure: 'Jeudi 10h30',
    enjeu:
      'Lire les chiffres d’une fraude naissante, la contrer par des mesures ciblées et décider de la suite d’un pilote de paiement interopérable sans sacrifier la confiance.',
    contexte:
      'Depuis six semaines, Banque Alpha (banque fictive) pilote le paiement marchand par QR code dans 300 commerces de Kinshasa. Le dispositif est interopérable : un client peut payer depuis son compte Banque Alpha ou depuis deux portefeuilles de monnaie électronique partenaires, « Wallet Beta » et « KangaPay » (fictifs), via un commutateur commun. Les fonds peuvent aussi être transférés entre portefeuilles. Depuis la semaine 4, les réclamations explosent. Le service fraude a classé les cas et extrait le journal d’un client victime. Le directeur commercial voudrait pourtant étendre le pilote à toute la ville avant les fêtes.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Suivi hebdomadaire du pilote (données fictives)',
        colonnes: ['Semaine', 'Paiements QR', 'Montant payé (USD)', 'Cas de fraude confirmés', 'Montant fraudé (USD)', 'Taux de fraude en valeur'],
        lignes: [
          ['S1', 8000, 96000, 1, 40, '0,04 %'],
          ['S2', 11500, 138000, 2, 95, '0,07 %'],
          ['S3', 15200, 182400, 3, 150, '0,08 %'],
          ['S4', 18900, 226800, 14, 2380, '1,05 %'],
          ['S5', 21400, 256800, 37, 9620, '3,75 %'],
          ['S6', 23000, 276000, 58, 15080, '5,46 %'],
        ],
      },
      {
        type: 'table',
        titre: 'Répartition des fraudes des semaines 5 et 6 (95 cas, 24 700 USD)',
        colonnes: ['Mode opératoire', 'Nombre de cas', 'Montant (USD)', 'Description'],
        lignes: [
          ['Échange de carte SIM (SIM swap)', 18, 16900, 'Le fraudeur obtient un duplicata de la SIM du client, réinitialise son code PIN par OTP SMS et vide le compte'],
          ['Faux agents', 41, 5330, 'Un faux « agent du pilote » appelle le client ou le marchand et se fait communiquer le PIN ou l’OTP'],
          ['QR code substitué', 36, 2470, 'Un autocollant portant le QR du fraudeur est collé sur celui du marchand'],
        ],
      },
      {
        type: 'logs',
        titre: 'Journal du compte d’un client victime — nuit de mardi à mercredi (extrait fictif)',
        lignes: [
          '02:14:07  OPERATEUR   Signal « changement de carte SIM » reçu pour le numéro du client',
          '02:29:51  AUTH        Demande de réinitialisation du PIN — OTP envoyé par SMS au numéro du client',
          '02:31:12  AUTH        OTP validé — nouveau PIN défini — nouvel appareil enregistré',
          '02:33:40  PROFIL      Plafond journalier relevé de 300 à 1 000 USD (niveau KYC complet)',
          '02:35:02  TRANSFERT   450 USD vers portefeuille KangaPay ••• 7731 — accepté',
          '02:38:26  TRANSFERT   450 USD vers portefeuille KangaPay ••• 7731 — accepté',
          '02:41:55  PAIEMENT QR 95 USD — marchand « Boutique Étoile » (inscrit au pilote depuis 4 jours) — accepté',
          '07:52:10  SUPPORT     Le client signale qu’il n’a plus de réseau depuis la nuit et que son solde est à zéro',
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle lecture des chiffres est juste ?',
        options: [
          {
            id: 'a',
            texte: 'La fraude ne fait que suivre la hausse des volumes : il y a plus de paiements, donc mécaniquement plus de cas, et le taux reste maîtrisé.',
            points: 0,
            feedback:
              'Faux : les paiements ont été multipliés par moins de 3 entre S1 et S6, mais le taux de fraude en valeur est passé de 0,04 % à 5,46 %, plus de 100 fois plus. C’est une attaque organisée, pas un effet de volume.',
          },
          {
            id: 'b',
            texte: 'Les faux agents font 43 % des cas : c’est le mode opératoire principal et il doit concentrer tous nos efforts.',
            points: 1,
            feedback:
              'Le pourcentage est juste (41 sur 95), mais ces cas ne pèsent que 22 % des pertes (5 330 sur 24 700 USD). Raisonner sur le seul nombre de cas fait passer à côté du mode opératoire le plus coûteux.',
          },
          {
            id: 'c',
            texte: 'Le SIM swap fait 19 % des cas mais 68 % des pertes : il passe en tête, sans délaisser les deux autres modes.',
            points: 3,
            feedback:
              'Exact : 18 cas sur 95 (19 %) mais 16 900 USD sur 24 700 (68 %), soit environ 940 USD par cas contre 130 pour les faux agents et 69 pour les QR substitués. On priorise par impact, tout en traitant les modes fréquents qui abîment la confiance des marchands.',
          },
          {
            id: 'd',
            texte: 'Les QR codes substitués sont le cœur du problème, puisqu’ils touchent directement les marchands du pilote et donc l’image du produit.',
            points: 0,
            feedback:
              'Ils comptent 36 cas, mais seulement 2 470 USD, soit 10 % des pertes. Le problème est réel et facile à traiter, mais ce n’est pas le cœur des pertes.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'D’après le journal du client victime, quelle mesure contre le SIM swap est la plus efficace ?',
        options: [
          {
            id: 'a',
            texte: 'Après un changement de SIM signalé, bloquer 48 h la réinitialisation du PIN par SMS, les nouveaux appareils et les hausses de plafond.',
            points: 4,
            feedback:
              'Exact. Le journal montre que tout s’enchaîne en moins de 30 minutes après le signal de l’opérateur (02h14). Ce signal, déjà reçu, n’a déclenché aucune règle. Une période de vigilance avec vérification renforcée (rappel, passage en agence, question hors SMS) casse le scénario sans gêner les autres clients.',
          },
          {
            id: 'b',
            texte: 'Demander à tous les clients du pilote de changer leur code PIN par SMS dès cette semaine, par mesure de précaution générale.',
            points: 0,
            feedback:
              'Le PIN n’a pas fuité : il a été réinitialisé par un OTP reçu sur la SIM détournée. Changer tous les PIN par SMS ne change rien au scénario, et le message lui-même peut être imité par les fraudeurs.',
          },
          {
            id: 'c',
            texte: 'Supprimer l’OTP par SMS et exiger une application d’authentification sur smartphone pour tous les clients du pilote dès le mois prochain.',
            points: 1,
            feedback:
              'Le SMS est bien le maillon faible, mais une bascule générale vers une application exclut les clients sans smartphone, nombreux en mobile money. La règle ciblée sur le signal de changement de SIM agit tout de suite, sans exclusion.',
          },
          {
            id: 'd',
            texte: 'Abaisser à 50 USD le plafond journalier de tous les comptes du pilote, quel que soit leur niveau de KYC, jusqu’à la fin de la vague.',
            points: 1,
            feedback:
              'Les pertes baisseraient, mais au prix d’un produit inutilisable pour les clients honnêtes et les marchands. Les plafonds par niveau de KYC ont leur rôle ; c’est la séquence « nouvelle SIM, nouveau PIN, hausse de plafond » qu’il faut bloquer.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Que fais-tu contre les faux agents et les QR codes substitués ?',
        options: [
          {
            id: 'a',
            texte: 'Afficher le nom du marchand avant toute validation, contrôler les QR lors de visites et rappeler dans chaque SMS que personne ne demande le PIN ou l’OTP.',
            points: 3,
            feedback:
              'Exact. Afficher le bénéficiaire avant validation déjoue l’autocollant substitué ; les visites de contrôle et le signalement rapide protègent les marchands ; un message simple, répété dans chaque SMS d’OTP (« personne ne vous demandera ce code »), coupe l’herbe sous le pied des faux agents.',
          },
          {
            id: 'b',
            texte: 'Remplacer les QR codes par des terminaux de paiement à carte chez tous les marchands, puisque le QR code imprimé est trop facile à falsifier.',
            points: 0,
            feedback:
              'Ce serait abandonner le produit au premier incident, à un coût élevé pour de petits commerces. La faiblesse n’est pas le QR code en soi, c’est l’absence de vérification du bénéficiaire avant validation.',
          },
          {
            id: 'c',
            texte: 'Porter plainte contre X et publier un communiqué de presse annonçant que le pilote est victime d’escroqueries, pour alerter le public.',
            points: 1,
            feedback:
              'La plainte est utile, et l’information du public aussi. Mais un communiqué sans mesure de protection inquiète sans protéger : clients et marchands ont besoin de consignes concrètes et d’un produit qui affiche le bénéficiaire.',
          },
          {
            id: 'd',
            texte: 'Faire signer aux marchands un engagement à surveiller leur QR code, et leur faire supporter les pertes en cas de substitution non détectée.',
            points: 0,
            feedback:
              'Reporter la perte sur de petits commerçants, victimes eux aussi, ferait fuir le réseau d’acceptation. La protection doit d’abord venir du produit (bénéficiaire affiché) et du contrôle exercé par la banque.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Un client signale une fraude en cours. Remets dans l’ordre le traitement de son cas.',
        elements: [
          { id: 'analyse', texte: 'Analyser le mode opératoire et ajuster les règles de détection' },
          { id: 'bloquer', texte: 'Bloquer le compte du client et les opérations en attente' },
          { id: 'gel', texte: 'Demander via le commutateur le gel des fonds chez le portefeuille destinataire' },
          { id: 'preuves', texte: 'Conserver les journaux et documenter la chronologie du dossier' },
          { id: 'client', texte: 'Informer le client, ouvrir sa réclamation et lui expliquer la suite' },
        ],
        ordreCorrect: ['bloquer', 'gel', 'preuves', 'client', 'analyse'],
        pointsMax: 4,
        feedback:
          'On arrête d’abord l’hémorragie (blocage), puis on court après les fonds tant qu’ils sont encore sur le portefeuille destinataire : en interopérabilité, chaque minute compte avant le retrait en espèces. On fige ensuite les preuves, on informe le client de façon claire, et l’analyse du mode opératoire nourrit les règles de détection pour les cas suivants.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Le directeur commercial veut étendre le pilote à toute la ville avant les fêtes. Que recommandes-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Étendre comme prévu en ajoutant une campagne de sensibilisation : la période des fêtes est l’occasion à ne pas manquer.',
            points: 0,
            feedback:
              'Étendre un produit dont le taux de fraude atteint 5,46 % en valeur, c’est multiplier les victimes au moment où les volumes sont les plus forts. La sensibilisation seule ne corrige pas les failles du parcours.',
          },
          {
            id: 'b',
            texte: 'Arrêter définitivement le pilote : la fraude prouve que le paiement par QR code n’est pas adapté au marché, et l’image de la banque est en jeu.',
            points: 1,
            feedback:
              'La prudence se comprend, mais les trois modes opératoires ont des parades connues et les semaines 1 à 3 montraient un taux faible. Abandonner, c’est renoncer à un service utile à l’inclusion financière sans avoir testé les correctifs.',
          },
          {
            id: 'c',
            texte: 'Étendre seulement aux clients des deux portefeuilles partenaires, puisque les comptes de Banque Alpha sont, eux, protégés par nos propres règles.',
            points: 0,
            feedback:
              'Rien dans les chiffres ne montre que les comptes de la banque sont épargnés, et le journal montre au contraire un compte Banque Alpha vidé. Dans un système interopérable, la fraude passe d’un acteur à l’autre : la sécurité se traite ensemble.',
          },
          {
            id: 'd',
            texte: 'Geler l’extension, déployer les parades, puis étendre par paliers si le taux de fraude reste sous un seuil fixé à l’avance.',
            points: 3,
            feedback:
              'Exact : on suspend sans abandonner. Les parades sont déployées, puis mesurées sur plusieurs semaines contre un seuil décidé à l’avance (par exemple revenir au niveau des semaines 1 à 3, sous 0,1 % en valeur). L’extension par paliers garde le risque sous contrôle.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'Ce cas évalue ta lecture d’un tableau de fraude et ta capacité à protéger un service de paiement sans l’étouffer.\n• Lecture : le taux de fraude en valeur passe de 0,04 % (S1) à 5,46 % (S6) alors que les volumes n’ont pas triplé ; c’est une attaque, pas un effet de volume.\n• Priorisation : le SIM swap fait 19 % des cas mais 68 % des pertes (environ 940 USD par cas) ; les faux agents, 43 % des cas mais 22 % des pertes ; les QR substitués, 38 % des cas et 10 % des pertes.\n• SIM swap : le signal de changement de SIM reçu à 02h14 n’a déclenché aucune règle. Une période de vigilance (pas de réinitialisation du PIN par SMS, pas de nouvel appareil, pas de hausse de plafond sans vérification renforcée) casse la séquence.\n• Faux agents et QR substitués : afficher le nom du marchand avant validation, contrôler les QR, répéter que personne ne demande le PIN ni l’OTP.\n\nEn cas de fraude signalée, on bloque, on demande le gel des fonds chez l’émetteur destinataire via le commutateur, on conserve les preuves, on informe le client, puis on améliore la détection. Dans un système interopérable, la lutte contre la fraude est collective.\n\nRéflexes à retenir :\n• Raisonner en montant ET en nombre de cas.\n• Exploiter les signaux déjà disponibles (changement de SIM, nouvel appareil).\n• Suspendre l’extension sans abandonner : seuils fixés à l’avance, paliers.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NUM-CAS-03 — Choisir et contractualiser un CRM en SaaS
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'NUM-CAS-03',
    filiere: 'numerique',
    titre: 'Un CRM dans le cloud : choisir, contractualiser, en sortir',
    role: 'Chef de projet SI — Direction des systèmes d’information, Banque Alpha',
    heure: 'Mercredi 15h00',
    enjeu:
      'Choisir une offre SaaS sur des critères de risque et non de prix seul, vérifier un SLA par le calcul et verrouiller la réversibilité dans le contrat.',
    contexte:
      'La direction commerciale de Banque Alpha (banque fictive) veut un outil de gestion de la relation client (CRM) en mode SaaS pour ses 120 conseillers. L’outil contiendra des données personnelles et bancaires de clients, classées « confidentiel » par la politique de la banque. Trois prestataires fictifs ont répondu. Le RSSI et le service juridique doivent rendre leur avis avec toi. Six mois après la mise en service, tu devras aussi contrôler le respect du SLA et gérer un premier incident.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Comparatif des offres reçues (prestataires et montants fictifs)',
        colonnes: ['Critère', 'Prestataire Delta', 'Prestataire Sigma', 'Prestataire Omega'],
        lignes: [
          ['Localisation des données', 'Région au choix du client, dont un centre de données en Afrique', '« Au sein de notre réseau mondial » (non précisé)', 'Un seul centre de données, hors du continent'],
          ['Sous-traitants ultérieurs', 'Liste publiée, information préalable en cas de changement', 'Non communiquée', 'Liste publiée'],
          ['Disponibilité garantie (mensuelle)', '99,9 %', '99,99 %', '99,5 %'],
          ['Pénalités', 'Avoir de 10 % si < 99,9 % ; 25 % si < 99,0 %', 'Aucune (« engagement de moyens »)', 'Avoir de 5 % si < 99,5 %'],
          ['Réversibilité', 'Export complet CSV/JSON et API ; 90 jours après la fin du contrat', 'Export PDF des fiches, sur devis', 'Export CSV ; données supprimées 15 jours après la fin'],
          ['Sécurité et audit', 'ISO/IEC 27001, rapport d’audit annuel communiqué', '« Conforme aux meilleures pratiques »', 'ISO/IEC 27001'],
          ['Chiffrement', 'Au repos et en transit ; clés gérées par le client (option)', 'En transit', 'Au repos et en transit'],
          ['Coût annuel (fictif)', '48 000 USD', '39 000 USD', '31 000 USD'],
        ],
      },
      {
        type: 'texte',
        titre: 'Contrat signé avec Delta — extrait de l’annexe SLA (fictif)',
        contenu:
          'Disponibilité mensuelle = (minutes du mois − minutes d’indisponibilité décomptées) / minutes du mois.\nNe sont pas décomptées : les maintenances planifiées notifiées au client au moins 48 heures à l’avance.\nToute autre interruption, y compris une maintenance notifiée moins de 48 heures à l’avance, est décomptée.\nAvoir sur la redevance du mois : 10 % si la disponibilité est inférieure à 99,9 % ; 25 % si elle est inférieure à 99,0 %.',
      },
      {
        type: 'logs',
        titre: 'Journal des interruptions du CRM — juin (30 jours)',
        lignes: [
          '04/06 09:10 → 09:45   Panne applicative (erreur 503 sur tous les écrans)          35 min',
          '15/06 01:00 → 07:00   Maintenance planifiée, notifiée par Delta le 09/06            360 min',
          '22/06 14:00 → 14:40   « Maintenance d’urgence », notifiée le 22/06 à 12:00          40 min',
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle offre retiens-tu pour la négociation finale ?',
        options: [
          {
            id: 'a',
            texte: 'Omega, la moins chère : son SLA de 99,5 % reste élevé et ses certifications ISO/IEC 27001 suffisent pour un outil commercial.',
            points: 1,
            feedback:
              'Omega a de vraies qualités (certification, chiffrement), mais 99,5 % autorise 3 h 36 d’arrêt par mois, les données partent hors du continent sans choix possible et la réversibilité de 15 jours est trop courte pour migrer. Le prix ne compense pas ces risques sur des données confidentielles.',
          },
          {
            id: 'b',
            texte: 'Sigma : avec 99,99 % de disponibilité annoncée, c’est l’offre la plus fiable du comparatif, et elle reste moins chère que Delta.',
            points: 0,
            feedback:
              'Un chiffre sans pénalité n’est qu’une promesse (« engagement de moyens »). Sigma ne dit ni où sont les données, ni qui les traite, et l’export PDF sur devis rend la sortie quasi impossible. C’est l’offre la plus risquée.',
          },
          {
            id: 'c',
            texte: 'Aucune : des données bancaires confidentielles ne doivent jamais quitter les serveurs de la banque, le SaaS est donc exclu par principe.',
            points: 0,
            feedback:
              'Le cloud n’est pas interdit par principe : c’est une question d’analyse de risques, d’exigences réglementaires applicables et de garanties contractuelles et techniques (localisation, chiffrement, audit, réversibilité). Exclure sans analyse prive la banque d’options utiles.',
          },
          {
            id: 'd',
            texte: 'Delta, malgré son prix, en faisant inscrire au contrat l’hébergement en Afrique, la liste des sous-traitants et la gestion des clés.',
            points: 3,
            feedback:
              'Exact. Delta est la seule offre qui couvre les critères de risque : localisation maîtrisée, sous-traitance transparente, SLA assorti de pénalités, réversibilité en format ouvert, audit communiqué. Son surcoût se justifie pour des données confidentielles, à condition de transformer les options en engagements contractuels.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Selon l’annexe SLA, quelle est la disponibilité de juin et quel avoir peut réclamer la banque ?',
        options: [
          {
            id: 'a',
            texte: 'Environ 99,92 % (35 min décomptées) : la maintenance d’urgence était annoncée, donc aucun avoir n’est dû ce mois-ci.',
            points: 0,
            feedback:
              'La maintenance du 22/06 n’a été notifiée que 2 heures avant : le contrat la décompte, car le délai de 48 heures n’est pas respecté. Il faut compter 35 + 40 = 75 minutes.',
          },
          {
            id: 'b',
            texte: 'Environ 98,99 % (435 minutes d’arrêt cumulées) : la banque peut réclamer à Delta un avoir de 25 % sur la redevance de juin.',
            points: 1,
            feedback:
              'Tu as décompté la maintenance du 15/06, notifiée six jours à l’avance : le contrat l’exclut. 435 minutes sur 43 200 donnent bien 98,99 %, mais le calcul ne respecte pas l’annexe.',
          },
          {
            id: 'c',
            texte: 'Environ 99,83 % (75 minutes décomptées sur 43 200) : c’est sous 99,9 % sans descendre sous 99,0 %, d’où un avoir de 10 %.',
            points: 4,
            feedback:
              'Exact. Juin compte 30 × 24 × 60 = 43 200 minutes. On décompte la panne (35 min) et la maintenance notifiée trop tard (40 min), soit 75 min : (43 200 − 75) / 43 200 ≈ 99,83 %. C’est sous 99,9 % mais au-dessus de 99,0 % : avoir de 10 %.',
          },
          {
            id: 'd',
            texte: 'Exactement 99,9 % : les trois interruptions cumulées restent dans le seuil contractuel, donc il n’y a aucun avoir à réclamer à Delta.',
            points: 0,
            feedback:
              'À 99,9 %, l’indisponibilité tolérée sur 30 jours n’est que de 43,2 minutes. Le seul décompte correct (75 min) dépasse déjà ce seuil.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre la démarche de contractualisation du SaaS.',
        elements: [
          { id: 'contrat', texte: 'Négocier le contrat : SLA, localisation, sous-traitance, audit, réversibilité' },
          { id: 'classifier', texte: 'Classifier les données concernées et identifier les exigences applicables' },
          { id: 'suivi', texte: 'Mettre en production et suivre les SLA chaque mois' },
          { id: 'besoins', texte: 'Formaliser les besoins et les critères de choix pondérés' },
          { id: 'test', texte: 'Tester un export complet avant la mise en production' },
          { id: 'evaluer', texte: 'Évaluer les offres et la sécurité des prestataires (questionnaire, certifications)' },
        ],
        ordreCorrect: ['classifier', 'besoins', 'evaluer', 'contrat', 'test', 'suivi'],
        pointsMax: 4,
        feedback:
          'Tout part de la sensibilité des données : c’est elle qui fixe les exigences (localisation, chiffrement, audit). Viennent ensuite les critères de choix, l’évaluation des prestataires, puis la négociation, qui transforme les promesses commerciales en engagements. On teste la sortie avant d’entrer : un export complet réussi prouve que la réversibilité est réelle. Enfin, un SLA non suivi ne sert à rien.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'En septembre, le compte d’un conseiller, sans double authentification, exporte 3 000 fiches clients depuis une adresse IP inconnue. Qui est responsable de quoi ?',
        options: [
          {
            id: 'a',
            texte: 'Delta, entièrement : la plateforme lui appartient, c’est donc à lui de garantir que personne ne vole les données qui y sont hébergées.',
            points: 0,
            feedback:
              'Dans le modèle de responsabilité partagée, le prestataire SaaS sécurise l’infrastructure et l’application. La gestion des identités, des droits et de la configuration reste au client : ici, le compte n’avait pas de MFA.',
          },
          {
            id: 'b',
            texte: 'La banque : identités, droits et configuration lui incombent. MFA obligatoire, export restreint, alertes, et journaux demandés à Delta.',
            points: 3,
            feedback:
              'Exact. C’est la part du client dans la responsabilité partagée. On traite l’événement comme un incident de données (confinement, analyse, obligations de notification éventuelles), on obtient les journaux du prestataire et on corrige la configuration : MFA ou authentification unique, export limité par rôle, alertes sur volumes anormaux.',
          },
          {
            id: 'c',
            texte: 'Le conseiller seul : il a sans doute réutilisé son mot de passe. On le sanctionne, on change son mot de passe et l’incident est clos.',
            points: 1,
            feedback:
              'Le mot de passe réutilisé est peut-être la cause directe, mais l’organisation qui laisse un accès sans MFA et un export massif sans limite porte la faille. Clore l’incident sans analyse ni correction, c’est attendre le suivant.',
          },
          {
            id: 'd',
            texte: 'Personne en particulier : un SaaS est par nature exposé à Internet, ce type d’incident est inévitable et doit être accepté comme un risque résiduel.',
            points: 0,
            feedback:
              'Le risque était réductible par des mesures simples du côté du client (MFA, restriction d’export, alertes). Accepter un risque résiduel est une décision formelle, prise après traitement, pas une excuse après un incident.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Le contrat doit être renouvelé. Le projet de Delta réduit la réversibilité à « un export au format choisi par le prestataire, sur demande ». Que fais-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Tu exiges un format ouvert documenté, pièces jointes et historiques compris, 90 jours d’assistance et une attestation de suppression.',
            points: 3,
            feedback:
              'Exact. Une réversibilité réelle précise le format (ouvert et documenté), le périmètre (données, pièces jointes, historiques), la durée et l’assistance à la migration, puis la preuve de destruction des données. Un test d’export périodique vérifie qu’elle fonctionne.',
          },
          {
            id: 'b',
            texte: 'Tu acceptes : on n’a pas l’intention de quitter Delta, et renégocier une clause qui ne servira pas retarderait le renouvellement.',
            points: 0,
            feedback:
              'La réversibilité se négocie quand on a encore du poids, pas le jour où l’on veut partir. Un prestataire peut être racheté, augmenter ses prix ou défaillir : sans sortie garantie, la banque devient captive.',
          },
          {
            id: 'c',
            texte: 'Tu fais faire chaque nuit, par l’équipe interne, une copie des écrans du CRM en PDF pour garder une trace de toutes les fiches clients au cas où.',
            points: 0,
            feedback:
              'Des copies d’écran en PDF ne se réimportent dans aucun outil et créent un nouveau stock de données confidentielles à protéger. La réversibilité doit être contractuelle et exploitable.',
          },
          {
            id: 'd',
            texte: 'Tu acceptes la clause, mais tu lances dès maintenant un appel d’offres pour remplacer Delta au plus vite par un prestataire plus souple sur ce point.',
            points: 1,
            feedback:
              'Préparer une alternative peut se justifier, mais accepter la clause rend la migration elle-même difficile : tu n’auras pas les données dans un format exploitable. On négocie d’abord la clause.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'Ce cas évalue ta maîtrise des fondamentaux du SaaS dans une banque : choix sur critères de risque, contrôle du SLA, responsabilité partagée et réversibilité.\n• Choix : Delta coûte plus cher mais seul il garantit la localisation, publie ses sous-traitants, assortit son SLA de pénalités et offre une sortie en format ouvert. Un « 99,99 % » sans pénalité (Sigma) n’engage à rien.\n• Ordres de grandeur sur 30 jours : 99,5 % = 3 h 36 d’arrêt toléré ; 99,9 % = 43,2 min ; 99,99 % = 4,3 min.\n• Calcul de juin : 43 200 minutes ; on décompte la panne (35 min) et la maintenance notifiée 2 heures avant (40 min), pas celle notifiée six jours avant. 75 min, soit environ 99,83 % : avoir de 10 %.\n• Responsabilité partagée : le prestataire protège l’infrastructure et l’application ; le client reste responsable des identités, des droits, de la configuration et de l’usage des données.\n• Réversibilité : format ouvert, périmètre complet, durée, assistance, attestation de suppression, et un export testé avant la mise en production.\n\nRéflexes à retenir :\n• Classifier les données avant de choisir un prestataire.\n• Lire l’annexe SLA (exclusions, mode de calcul) avant de réclamer.\n• Un engagement sans pénalité n’est qu’une promesse.\n• On négocie la sortie au moment d’entrer.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NUM-CAS-04 — Assistant d'IA générative pour le service clients
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'NUM-CAS-04',
    filiere: 'numerique',
    titre: 'L’assistant d’IA du service clients invente des frais',
    role: 'Responsable produit IA — Direction de la relation client, Banque Alpha',
    heure: 'Vendredi 11h15',
    enjeu:
      'Encadrer un assistant d’IA générative avant son ouverture aux clients : réponses ancrées dans des sources validées, données personnelles protégées et qualité mesurée.',
    contexte:
      'Banque Alpha (banque fictive) teste depuis un mois un assistant conversationnel fondé sur un grand modèle de langage, destiné à répondre aux questions des clients sur le site et l’application. Le lancement public est prévu dans trois semaines. Les tests internes révèlent des réponses inventées. En parallèle, l’équipe sécurité a détecté que des conseillers du centre d’appels utilisent un chatbot public gratuit pour rédiger leurs réponses. Ton directeur te demande un plan pour lancer « sans mauvaise surprise ».',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'Conversation de test n° 118 et grille tarifaire officielle (fictives)',
        contenu:
          'CLIENT : Combien coûte la clôture de mon compte épargne ?\nASSISTANT : La clôture d’un compte épargne Banque Alpha est gratuite si le compte a plus de 12 mois ; sinon, des frais de 15 USD s’appliquent. Je vous recommande aussi notre offre « Épargne Plus Jeunes », rémunérée à 6 %.\n\nGRILLE TARIFAIRE EN VIGUEUR (extrait) :\n• Clôture d’un compte épargne : 10 USD, quelle que soit l’ancienneté du compte.\n• L’offre « Épargne Plus Jeunes » n’existe pas au catalogue de Banque Alpha.',
      },
      {
        type: 'table',
        titre: 'Évaluation sur 400 questions de clients réelles, anonymisées (données fictives)',
        colonnes: ['Résultat', 'Nombre', 'Part'],
        lignes: [
          ['Réponse correcte et complète', 318, '79,5 %'],
          ['Réponse correcte mais incomplète', 41, '10,25 %'],
          ['Information fausse affirmée (hallucination)', 27, '6,75 %'],
          ['Refus de répondre ou transfert à tort', 14, '3,5 %'],
          ['Messages qui devaient être transférés à un conseiller (réclamation, suspicion de fraude)', 60, '—'],
          ['Messages effectivement transférés par l’assistant', 50, '—'],
          ['… dont messages qui devaient l’être', 36, '—'],
        ],
      },
      {
        type: 'logs',
        titre: 'Alertes de prévention des fuites de données (DLP) — centre d’appels (extrait fictif)',
        lignes: [
          '2026-10-27 09:14:02  10.30.2.17  POST https://chat-gratuit.example/api/message  4 812 octets  ALERTE : numéro de compte × 3',
          '2026-10-27 09:41:37  10.30.2.22  POST https://chat-gratuit.example/api/message  2 104 octets  ALERTE : nom + solde client',
          '2026-10-27 10:05:19  10.30.2.17  POST https://chat-gratuit.example/api/message  6 330 octets  ALERTE : numéro de compte × 5',
          '2026-10-27 11:22:48  10.30.2.31  POST https://chat-gratuit.example/api/message  1 950 octets  ALERTE : numéro de téléphone + nom',
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Comment corriges-tu les réponses inventées comme celle de la conversation n° 118 ?',
        options: [
          {
            id: 'a',
            texte: 'Ajouter au prompt système la consigne « Ne donne jamais d’information fausse » : le modèle saura alors qu’il doit se limiter aux faits.',
            points: 0,
            feedback:
              'Le modèle ne « sait » pas qu’il invente : il produit le texte le plus plausible. Une consigne seule ne lui donne pas accès à la vraie grille tarifaire. Il faut lui fournir les sources validées.',
          },
          {
            id: 'b',
            texte: 'Ancrer les réponses dans les documents validés de la banque, citer la source, sinon dire « je ne sais pas » et transférer.',
            points: 3,
            feedback:
              'Exact. L’ancrage sur une base documentaire validée (le principe du RAG) fait répondre le modèle à partir de la grille tarifaire et du catalogue en vigueur. La citation de la source permet le contrôle, et l’abstention avec transfert à un conseiller vaut mieux qu’une réponse inventée.',
          },
          {
            id: 'c',
            texte: 'Augmenter la « température » du modèle pour qu’il explore davantage de réponses possibles avant de choisir la meilleure.',
            points: 0,
            feedback:
              'C’est l’inverse : une température plus élevée rend les réponses plus variées et plus créatives, donc plus exposées à l’invention. Pour des réponses factuelles, on la garde basse, et surtout on ancre le modèle sur des sources.',
          },
          {
            id: 'd',
            texte: 'Réentraîner le modèle sur l’historique complet des conversations du centre d’appels, pour qu’il apprenne enfin les vrais tarifs de la banque.',
            points: 1,
            feedback:
              'L’historique contient des données personnelles et des réponses parfois périmées ou fausses ; le réentraînement est coûteux et doit être refait à chaque changement de tarif. L’ancrage sur des documents à jour est plus fiable et plus simple à maintenir.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Que fais-tu face aux alertes DLP du centre d’appels ?',
        options: [
          {
            id: 'a',
            texte: 'Bloquer l’outil public et le remplacer par un outil interne encadré, avec masquage des données, formation et signalement de l’incident.',
            points: 3,
            feedback:
              'Exact. Des numéros de compte et des soldes ont quitté la banque vers un service dont on ne maîtrise ni la conservation ni la réutilisation : c’est un incident de données à signaler. Bloquer sans offrir d’alternative pousserait les conseillers vers d’autres outils ; un outil encadré par contrat, avec masquage automatique, répond au besoin réel.',
          },
          {
            id: 'b',
            texte: 'Rien de grave : ces outils publics sont très utilisés, les données sont chiffrées en HTTPS pendant leur transport et les conseillers gagnent du temps.',
            points: 0,
            feedback:
              'HTTPS protège le transport, pas la destination : une fois reçues, les données sont entre les mains d’un tiers sans contrat avec la banque, qui peut les conserver ou s’en servir. C’est une fuite de données clients et une atteinte au secret bancaire.',
          },
          {
            id: 'c',
            texte: 'Sanctionner les trois conseillers identifiés par leur adresse IP et diffuser une note de rappel du règlement intérieur à tout le centre d’appels.',
            points: 1,
            feedback:
              'Le rappel des règles est utile, mais la sanction seule ne traite ni la fuite (non signalée ici) ni le besoin réel des conseillers, qui iront vers un autre outil non détecté. Le shadow IT se combat surtout par une alternative encadrée.',
          },
          {
            id: 'd',
            texte: 'Autoriser l’outil public, à condition que chaque conseiller remplace lui-même les noms des clients par des initiales avant de coller le texte.',
            points: 0,
            feedback:
              'Une anonymisation manuelle, à la discrétion de chacun, sera oubliée sous la pression des appels ; et le numéro de compte ou le solde suffisent souvent à identifier un client. Les alertes montrent justement des numéros de compte.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Que dit l’évaluation sur 400 questions du transfert vers un conseiller ?',
        options: [
          {
            id: 'a',
            texte: 'Précision de 60 % et rappel de 72 % : l’assistant transfère trop souvent des messages qui n’en avaient pas besoin.',
            points: 0,
            feedback:
              'Les deux mesures sont inversées. Précision = 36 / 50 = 72 % (part des transferts justifiés) ; rappel = 36 / 60 = 60 % (part des messages à transférer réellement transférés).',
          },
          {
            id: 'b',
            texte: 'Précision de 72 % et rappel de 60 % : 24 réclamations ou suspicions de fraude sont restées sans conseiller, un défaut qui bloque à lui seul le lancement.',
            points: 3,
            feedback:
              'Exact. Sur 60 messages à transférer, seuls 36 l’ont été : 24 clients, dont des victimes possibles de fraude, sont restés face au robot. Pour ce type de message, le rappel est la mesure prioritaire : mieux vaut quelques transferts inutiles (14 ici) qu’une fraude non prise en charge.',
          },
          {
            id: 'c',
            texte: 'Avec 79,5 % de réponses correctes et complètes, l’assistant dépasse l’objectif de 75 % : le transfert fonctionne et le lancement peut avoir lieu.',
            points: 0,
            feedback:
              'Le taux global masque les échecs les plus graves : 6,75 % d’hallucinations et 24 messages sensibles non transférés. Une moyenne ne suffit pas, il faut regarder les erreurs selon leur gravité.',
          },
          {
            id: 'd',
            texte: 'Le transfert est satisfaisant, puisque 36 des 50 messages transférés le méritaient vraiment, soit une précision de 72 %, au-dessus de la moitié.',
            points: 1,
            feedback:
              'Le calcul de la précision est juste, mais tu oublies le rappel : 24 des 60 messages à transférer ne l’ont pas été. Pour la fraude, ce sont les cas manqués qui coûtent le plus cher.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre le plan de lancement de l’assistant.',
        elements: [
          { id: 'clients', texte: 'Ouvrir aux clients sur un périmètre limité, avec transfert vers un conseiller' },
          { id: 'perimetre', texte: 'Délimiter les cas d’usage autorisés et les sujets interdits (conseil, litiges, fraude)' },
          { id: 'surveiller', texte: 'Surveiller en continu : échantillons relus, réclamations, revue mensuelle' },
          { id: 'jeu', texte: 'Constituer un jeu d’évaluation de référence avec des seuils d’acceptation' },
          { id: 'interne', texte: 'Piloter en interne : l’assistant propose, un conseiller valide chaque réponse' },
        ],
        ordreCorrect: ['perimetre', 'jeu', 'interne', 'clients', 'surveiller'],
        pointsMax: 5,
        feedback:
          'On définit d’abord ce que l’assistant a le droit de faire, puis comment on mesurera sa qualité (jeu de référence et seuils décidés AVANT les résultats). Le pilote interne, avec un humain qui valide, révèle les erreurs sans exposer les clients. L’ouverture se fait ensuite sur un périmètre restreint, et la surveillance continue, car un modèle et les documents évoluent.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Comment présentes-tu l’assistant aux clients le jour du lancement ?',
        options: [
          {
            id: 'a',
            texte: 'Sous le prénom « Mireille », avec la photo d’une conseillère, sans préciser que c’est une IA, pour un échange plus chaleureux.',
            points: 0,
            feedback:
              'Laisser croire à un humain trompe le client et ruine la confiance le jour où il le découvre. La transparence sur la nature automatisée de l’échange est un principe de base de l’IA responsable.',
          },
          {
            id: 'b',
            texte: 'Avec un message de bienvenue qui demande au client son numéro de compte et sa date de naissance, pour personnaliser les réponses dès le début.',
            points: 0,
            feedback:
              'C’est contraire à la minimisation des données : l’assistant répond à des questions générales et n’a pas besoin de ces informations. Et l’habitude de les donner à un robot fait le jeu des faux assistants.',
          },
          {
            id: 'c',
            texte: 'En conservant toutes les conversations sans limite de durée, pour réentraîner le modèle plus tard, et en le mentionnant dans les conditions générales.',
            points: 1,
            feedback:
              'Informer est nécessaire, mais une conservation illimitée viole le principe de durée de conservation limitée, et la réutilisation pour l’entraînement doit avoir une finalité définie. On fixe une durée et on minimise.',
          },
          {
            id: 'd',
            texte: 'Annoncer qu’il s’agit d’un assistant automatisé, ses limites, un bouton « Parler à un conseiller » et l’interdit de demander le PIN.',
            points: 3,
            feedback:
              'Exact : transparence (le client sait qu’il parle à une IA et ce qu’elle sait faire), recours humain toujours accessible et règle de sécurité claire. Associée à une durée de conservation limitée des conversations, c’est la base d’un lancement digne de confiance.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'Ce cas évalue ta capacité à mettre une IA générative au service des clients sans exposer la banque.\n• Hallucinations : le modèle a inventé une règle (gratuité après 12 mois), un tarif (15 USD au lieu de 10) et un produit. On ancre les réponses sur les documents validés et à jour (principe du RAG), on cite la source et on préfère l’abstention avec transfert à une réponse inventée.\n• Données personnelles : coller des numéros de compte dans un chatbot public est une fuite de données. On signale l’incident, on bloque l’outil, on fournit une alternative encadrée par contrat avec masquage automatique, et on forme.\n• Mesure : précision du transfert = 36 / 50 = 72 % ; rappel = 36 / 60 = 60 %. 24 messages sensibles sont restés au robot ; pour la fraude, le rappel prime. Le taux global de 79,5 % ne dit rien des erreurs graves (6,75 % d’hallucinations).\n• Lancement : périmètre délimité, jeu d’évaluation et seuils fixés à l’avance, pilote interne avec validation humaine, ouverture restreinte, surveillance continue.\n• Transparence : le client sait qu’il parle à une IA, peut joindre un humain, et on ne lui demande jamais de PIN ni de données inutiles.\n\nRéflexes à retenir :\n• Un modèle de langage produit du plausible, pas du vrai : il faut l’ancrer et le mesurer.\n• Jamais de données clients dans un outil d’IA grand public.\n• Juger une IA sur ses erreurs graves, pas sur sa moyenne.',
  },
];
