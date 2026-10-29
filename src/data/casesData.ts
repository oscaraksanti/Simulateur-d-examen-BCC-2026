// Cas pratiques immersifs — TOUS les cas du simulateur (4 Data + 4 Cyber).
//
// Scénarios entièrement fictifs (banques « Banque Alpha », « Banque Beta »…, IP de documentation,
// domaines .example). Règles : `pointsMax` = somme des maxima d'étapes (10 à 20 points),
// au moins une étape `ordre` par cas, un feedback pour chaque option. Vérifié par
// src/__tests__/data.test.ts.

import type { CasPratique } from '@/lib/types';

// ===========================================================================
// FILIÈRE DATA ANALYSE
// ===========================================================================

const casData: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // DATA-CAS-01 — Flux de paiements de masse sur le Switch national
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DATA-CAS-01',
    filiere: 'data',
    titre: 'Flux de paiements de masse sur le Switch national',
    role: 'Analyste data — Direction des systèmes de paiement',
    heure: 'Lundi 08h40',
    enjeu:
      'Repérer, dans un extrait de flux interbancaires, l’anomalie qui expose le système à un risque de blanchiment avant le comité de surveillance de 11h00.',
    contexte:
      'Ton chef de service, M. Lukusa, t’appelle dès ton arrivée : « Le Switch national (fictif) a remonté un lot de virements atypiques ce matin du 12 octobre, je t’envoie un extrait. » Pour l’exercice, le seuil de déclaration est fixé à 10 000 000 CDF par opération : toute opération égale ou supérieure doit être déclarée à la cellule de conformité. L’extrait contient 26 lignes passées entre 09h00 et 09h35 sur les canaux ACH, RTGS et Mobile. Il est brut : personne ne l’a encore nettoyé. Le comité de surveillance se réunit à 11h00 et attend de toi l’anomalie prioritaire, un indicateur de suivi et un visuel clair. Tu as un peu plus de deux heures.',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'Mail de M. Lukusa — 08h37',
        contenu:
          'Objet : Extrait Switch — 12/10 — URGENT\n\nBonjour,\n\nCi-joint l’extrait brut des opérations de 09h00 à 09h35 (données fictives d’exercice). Rappel : seuil de déclaration de 10 000 000 CDF par opération.\n\nPour 11h00, il me faut :\n• l’anomalie la plus grave à remonter au comité, avec une justification d’une phrase ;\n• un indicateur que l’on pourra suivre chaque jour ;\n• un graphique lisible par des non-spécialistes.\n\nAttention, l’extrait n’est pas nettoyé : ne présente rien au comité sans avoir vérifié la qualité des lignes.\n\nM. Lukusa',
      },
      {
        type: 'table',
        titre: 'Extrait Switch national — 12/10/2026, 09h00-09h35 (données fictives)',
        colonnes: ['ID', 'Émetteur', 'Bénéficiaire', 'Montant', 'Devise', 'Horodatage', 'Canal'],
        lignes: [
          ['TX-26101201', 'Banque Alpha · Cie Tujenge BTP', 'Banque Beta · Salarié 4410', '1 820 000', 'CDF', '2026-10-12 09:02:11', 'ACH'],
          ['TX-26101202', 'Delta Mobile Money · Agrégateur', 'Banque Alpha · Sarl Kivu Agro', '640 000', 'CDF', '2026-10-12 09:03:45', 'Mobile'],
          ['TX-26101203', 'Banque Alpha · Cie Tujenge BTP', 'Gamma Microfinance · Salarié 0921', '1 790 000', 'CDF', '2026-10-12 09:05:02', 'ACH'],
          ['TX-26101204', 'Banque Beta · Ets Lumbu Pharma', 'Banque Alpha · Fournisseur 3381', '4 200', 'USD', '2026-10-12 09:06:30', 'RTGS'],
          ['TX-26101205', 'Delta Mobile Money · Agrégateur', 'Banque Beta · Ets Lumbu Pharma', '1 150 000', 'CDF', '2026-10-12 09:08:17', 'Mobile'],
          ['TX-26101206', 'Banque Alpha · Cie Tujenge BTP', 'Banque Beta · Salarié 4415', '1 805 000', 'CDF', '2026-10-12 09:09:40', 'ACH'],
          ['TX-26101207', 'Banque Beta · Sarl Mosala Import', 'Banque Alpha · Transitaire 1207', '3 400 000', 'CDF', '2026-10-12 09:11:26', 'RTGS'],
          ['TX-26101208', 'Gamma Microfinance · Coopérative Bomoko', 'Banque Beta · Ets Lumbu Pharma', '2 300 000', 'CDF', '2026-10-12 09:12:58', 'ACH'],
          ['TX-26101209', 'Banque Beta · Sarl Mosala Import', 'Gamma Microfinance · Cpte 77-0193', '9 950 000', 'CDF', '2026-10-12 09:14:03', 'Mobile'],
          ['TX-26101210', 'Delta Mobile Money · Agrégateur', 'Gamma Microfinance · Coopérative Bomoko', '875 000', 'CDF', '2026-10-12 09:14:51', 'Mobile'],
          ['TX-26101211', 'Banque Beta · Sarl Mosala Import', 'Gamma Microfinance · Cpte 77-0193', '9 900 000', 'CDF', '2026-10-12 09:15:37', 'Mobile'],
          ['TX-26101212', 'Banque Alpha · Cie Tujenge BTP', 'Gamma Microfinance · Salarié 0934', '182 000 000', 'CDF', '2026-10-12 09:16:20', 'ACH'],
          ['TX-26101213', 'Banque Beta · Sarl Mosala Import', 'Gamma Microfinance · Cpte 77-0193', '9 980 000', 'CDF', '2026-10-12 09:17:12', 'ACH'],
          ['TX-26101214', 'Delta Mobile Money · Agrégateur', 'Banque Alpha · Sarl Kivu Agro', '2 850 000', 'USD', '2026-10-12 09:17:55', 'Mobile'],
          ['TX-26101215', 'Banque Beta · Sarl Mosala Import', 'Gamma Microfinance · Cpte 77-0193', '9 870 000', 'CDF', '2026-10-12 09:18:48', 'Mobile'],
          ['TX-26101216', 'Banque Alpha · Sarl Kivu Agro', 'Banque Beta · Ets Lumbu Pharma', '5 600 000', 'CDF', '2026-10-12 09:19:30', 'RTGS'],
          ['TX-26101217', 'Banque Beta · Sarl Mosala Import', 'Gamma Microfinance · Cpte 77-0193', '9 940 000', 'CDF', '2026-10-12 09:20:41', 'ACH'],
          ['TX-26101218', 'Gamma Microfinance · Coopérative Bomoko', 'Delta Mobile Money · Marchand 5520', '310 000', 'CDF', '2026-10-12 09:21:09', 'Mobile'],
          ['TX-26101219', 'Banque Beta · Sarl Mosala Import', 'Gamma Microfinance · Cpte 77-0193', '9 990 000', 'CDF', '2026-10-12 09:22:47', 'Mobile'],
          ['TX-26101220', 'Banque Alpha · Cie Tujenge BTP', 'Banque Beta · Salarié 4422', '1 835 000', 'CDF', '2026-10-12 09:24:05', 'ACH'],
          ['TX-26101221', 'Delta Mobile Money · Agrégateur', 'Banque Beta · Ets Lumbu Pharma', '1 420 000', 'CDF', '2026-10-12 09:25:33', 'Mobile'],
          ['TX-26101222', 'Banque Beta · Ets Lumbu Pharma', 'Banque Alpha · Fournisseur 3381', '2 750', 'USD', '2026-10-12 09:27:10', 'RTGS'],
          ['TX-26101222', 'Banque Beta · Ets Lumbu Pharma', 'Banque Alpha · Fournisseur 3381', '2 750', 'USD', '2026-10-12 09:27:10', 'RTGS'],
          ['TX-26101223', 'Banque Alpha · Sarl Kivu Agro', 'Delta Mobile Money · Agrégateur', '980 000', 'CDF', '2026-10-12 09:29:44', 'Mobile'],
          ['TX-26101224', 'Gamma Microfinance · Coopérative Bomoko', 'Banque Alpha · Cie Tujenge BTP', '7 300 000', 'CDF', '2026-10-12 09:31:02', 'RTGS'],
          ['TX-26101225', 'Delta Mobile Money · Agrégateur', 'Gamma Microfinance · Coopérative Bomoko', '455 000', 'CDF', '2026-10-12 09:33:18', 'Mobile'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question:
          'Plusieurs anomalies se cachent dans l’extrait. Laquelle remontes-tu en priorité au comité de surveillance ?',
        options: [
          {
            id: 'a',
            texte:
              'Le montant de 182 000 000 CDF versé par Cie Tujenge BTP (ligne TX-26101212), cent fois supérieur à ses autres virements.',
            points: 2,
            feedback:
              'Bonne détection : c’est un aberrant net (les autres virements de cet émetteur tournent autour de 1,8 M CDF). Mais il ressemble surtout à une erreur de saisie (deux zéros de trop) : à vérifier auprès de la banque. Il ne révèle pas un comportement délibéré de contournement, contrairement au fractionnement.',
          },
          {
            id: 'b',
            texte:
              'La ligne TX-26101222 présente deux fois à l’identique : il y a un risque de double débit pour Ets Lumbu Pharma.',
            points: 1,
            feedback:
              'Le doublon est réel et doit être traité au nettoyage, mais c’est un incident de qualité de données ou de traitement technique, à faible enjeu (2 750 USD). Ce n’est pas le point prioritaire pour un comité de surveillance.',
          },
          {
            id: 'c',
            texte:
              'Six virements de Sarl Mosala Import vers le même compte Cpte 77-0193, tous compris entre 9 870 000 et 9 990 000 CDF, en moins de 9 minutes (09:14:03 à 09:22:47).',
            points: 4,
            feedback:
              'Exact : c’est un schéma typique de fractionnement (« smurfing ») destiné à rester sous le seuil de déclaration de 10 000 000 CDF. Le cumul atteint 59 630 000 CDF, soit près de six fois le seuil, vers un même bénéficiaire et via deux canaux. C’est un risque LBC/FT (blanchiment de capitaux et financement du terrorisme) qui appelle un signalement à la conformité.',
          },
          {
            id: 'd',
            texte:
              'Aucune anomalie majeure : tous les virements de Sarl Mosala Import sont sous le seuil, ils n’ont donc pas à être déclarés.',
            points: 0,
            feedback:
              'C’est précisément le piège. Un seuil se contourne en découpant les montants. Un analyste doit raisonner sur le cumul par couple émetteur-bénéficiaire et par fenêtre de temps, pas seulement opération par opération.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Le comité veut un indicateur à suivre chaque jour pour détecter ce type de comportement. Lequel proposes-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Le montant moyen des transactions de la journée, tous canaux confondus.',
            points: 0,
            feedback:
              'Une moyenne globale noie le signal : six virements suspects parmi des milliers d’opérations ne la feront presque pas bouger. Elle est en plus très sensible aux aberrants comme les 182 000 000 CDF.',
          },
          {
            id: 'b',
            texte:
              'Le nombre d’opérations dépassant le seuil de 10 000 000 CDF.',
            points: 0,
            feedback:
              'Cet indicateur est structurellement aveugle au fractionnement, puisque celui-ci consiste justement à rester sous le seuil. Il mesure la conformité déclarative, pas le contournement.',
          },
          {
            id: 'c',
            texte:
              'Le cumul journalier reçu par chaque bénéficiaire.',
            points: 2,
            feedback:
              'C’est un progrès, car on raisonne enfin en cumul. Mais sans fenêtre de temps courte ni filtre sur les montants proches du seuil, l’indicateur mélangera les gros bénéficiaires légitimes (grossistes, payeurs de salaires) et les schémas de fractionnement. Il générera beaucoup de faux positifs.',
          },
          {
            id: 'd',
            texte:
              'Par couple émetteur-bénéficiaire et sur une fenêtre glissante (ex. 30 minutes) : le nombre d’opérations comprises entre 90 % et 100 % du seuil et leur cumul, avec alerte au-delà de 3 opérations.',
            points: 4,
            feedback:
              'C’est l’indicateur adapté. Il cible le comportement (montants juste sous le seuil, répétés, concentrés dans le temps vers un même bénéficiaire) et reste peu bruité. Les paramètres (fenêtre, bande de 90 %, nombre d’opérations) sont à calibrer sur l’historique puis à revoir régulièrement.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question:
          'Remets dans l’ordre la démarche que tu suis entre 08h45 et 11h00.',
        elements: [
          { id: 'regles', texte: 'Appliquer les règles de détection (seuil, fenêtre glissante, couple émetteur-bénéficiaire)' },
          { id: 'reporting', texte: 'Rédiger la note au comité : constats, niveau de confiance, actions proposées' },
          { id: 'nettoyage', texte: 'Nettoyer l’extrait : doublon, devise incohérente, montant aberrant (mise en quarantaine tracée)' },
          { id: 'visualisation', texte: 'Construire le visuel qui met en évidence le schéma détecté' },
          { id: 'profilage', texte: 'Profiler les données : distributions des montants, volumes par émetteur, par canal et par heure' },
        ],
        ordreCorrect: ['nettoyage', 'profilage', 'regles', 'visualisation', 'reporting'],
        pointsMax: 4,
        feedback:
          'On nettoie d’abord, sinon le doublon et le montant aberrant faussent le profilage et déclenchent des alertes parasites. Le profilage donne ensuite les ordres de grandeur « normaux » qui permettent de calibrer les règles de détection. Enfin, on ne visualise et on ne rapporte que des résultats vérifiés : le visuel sert la note, pas l’inverse.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Quel visuel présentes-tu au comité pour montrer le schéma de fractionnement ?',
        options: [
          {
            id: 'a',
            texte:
              'Un camembert 3D de la répartition des montants par canal (ACH, RTGS, Mobile).',
            points: 0,
            feedback:
              'Un camembert, a fortiori en 3D, déforme les proportions. Surtout, il ne montre ni le temps, ni le bénéficiaire, ni le seuil, c’est-à-dire les trois éléments qui font le schéma.',
          },
          {
            id: 'b',
            texte:
              'Une chronologie (09h00-09h35) des virements vers Cpte 77-0193, en barres ou en points, avec une ligne horizontale rouge au seuil de 10 000 000 CDF et le cumul annoté.',
            points: 3,
            feedback:
              'C’est le bon choix : en un coup d’œil, le comité voit six barres serrées dans le temps, collées juste sous la ligne de seuil, vers le même compte. L’annotation du cumul (59,63 M CDF) rend la gravité immédiatement lisible.',
          },
          {
            id: 'c',
            texte:
              'Une carte de chaleur canal × tranche horaire du nombre d’opérations.',
            points: 1,
            feedback:
              'Ce visuel est utile pour le profilage, car il montre les pics d’activité. Mais il agrège et fait disparaître le bénéficiaire, les montants et le seuil : le fractionnement n’y apparaît pas.',
          },
          {
            id: 'd',
            texte:
              'Le tableau brut des 26 lignes, avec les six lignes suspectes surlignées en jaune.',
            points: 1,
            feedback:
              'Il est transparent et sert d’annexe, mais un comité ne lit pas 26 lignes en séance. Le message principal (concentration dans le temps sous le seuil) doit sauter aux yeux sans effort.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Au nettoyage, que fais-tu de la ligne TX-26101214 (2 850 000 « USD » émis par Delta Mobile Money, dont toutes les autres opérations sont en CDF) ?',
        options: [
          {
            id: 'a',
            texte: 'Je la supprime de l’extrait : elle est manifestement fausse.',
            points: 0,
            feedback:
              'Supprimer une transaction réelle fait perdre une information et une trace d’audit. L’opération a bien eu lieu : seule son étiquette de devise est douteuse.',
          },
          {
            id: 'b',
            texte:
              'Je la marque comme suspecte (quarantaine), je documente l’hypothèse « montant en CDF mal étiqueté » et je demande confirmation à l’émetteur avant de corriger.',
            points: 3,
            feedback:
              'C’est la bonne pratique : on ne corrige jamais une donnée financière sur une simple hypothèse. On isole, on trace, on fait confirmer à la source. Entre-temps, l’analyse est conduite avec et sans cette ligne si elle peut influencer les résultats.',
          },
          {
            id: 'c',
            texte:
              'Je la convertis directement en CDF dans mon fichier, puisque c’est évidemment une erreur d’étiquette.',
            points: 1,
            feedback:
              'L’hypothèse est probablement juste : 2 850 000 USD représenterait plusieurs milliards de CDF, sans rapport avec le profil de l’émetteur. Mais une correction silencieuse, sans confirmation ni traçabilité, n’est pas acceptable dans une banque centrale.',
          },
          {
            id: 'd',
            texte: 'Je la laisse telle quelle : ce n’est pas mon rôle de juger la devise.',
            points: 0,
            feedback:
              'La laisser telle quelle gonflerait artificiellement les volumes en USD et fausserait toute agrégation. La qualité des données fait partie du métier de l’analyste.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'L’extrait (fictif) contenait quatre anomalies de nature différente, et la compétence évaluée est de savoir les hiérarchiser.\n• Fractionnement (prioritaire) : six virements de Sarl Mosala Import vers Cpte 77-0193, de 9 870 000 à 9 990 000 CDF, entre 09:14:03 et 09:22:47. Cumul : 59 630 000 CDF. Montants à plus de 98 % du seuil, même bénéficiaire, moins de 9 minutes, deux canaux : c’est un risque LBC/FT à signaler à la conformité.\n• Montant aberrant : 182 000 000 CDF pour un émetteur qui paie habituellement environ 1,8 M CDF, probable erreur de saisie (×100) à faire confirmer.\n• Doublon exact : TX-26101222 apparaît deux fois (même ID, mêmes valeurs à la seconde près), à dédoublonner avant tout calcul.\n• Incohérence de devise : 2 850 000 « USD » chez un émetteur 100 % CDF, à mettre en quarantaine et à faire confirmer.\n\nLe piège principal consiste à raisonner opération par opération (« tout est sous le seuil ») au lieu de raisonner en cumul par couple émetteur-bénéficiaire et par fenêtre de temps. Le second piège est de présenter des résultats sur un extrait non nettoyé : le doublon et l’aberrant faussent les moyennes et déclenchent des alertes parasites.\n\nUn jury de banque centrale attend une démarche structurée (nettoyage → profilage → règles → visualisation → reporting), une justification orientée risque et non seulement statistique, ainsi qu’une traçabilité totale des corrections. Il attend aussi un visuel sobre qui porte un seul message : la chronologie des virements sous la ligne de seuil.\n\nRéflexes à retenir :\n• Un seuil se contourne : surveille la bande juste en dessous et les cumuls sur une fenêtre glissante.\n• Ne supprime ni ne corrige jamais en silence une donnée financière : quarantaine, documentation, confirmation à la source.\n• Un visuel pour un comité = un message, avec le seuil et le temps explicitement représentés.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DATA-CAS-02 — Tableau de bord du taux de change CDF/USD
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DATA-CAS-02',
    filiere: 'data',
    titre: 'Tableau de bord du taux de change CDF/USD',
    role: 'Analyste data — Direction des études et de la conjoncture',
    heure: 'Mercredi 14h10',
    enjeu:
      'Produire des indicateurs de change justes et correctement interprétés pour la note de conjoncture hebdomadaire.',
    contexte:
      'Mme Ilunga, économiste principale, passe à ton bureau : « Le directeur veut une page de tableau de bord sur le change dans la note de vendredi. » Elle te remet une série hebdomadaire d’exercice sur 12 semaines : un taux indicatif et un taux relevé sur le marché parallèle, tous deux exprimés en CDF pour 1 USD (séries fictives). Elle insiste : « L’an dernier, un stagiaire a écrit que le franc s’appréciait parce que le taux montait. Je ne veux plus jamais lire ça. » Tu dois calculer la variation sur la période, une moyenne mobile sur 4 semaines et l’écart entre les deux marchés, puis proposer la visualisation. Le brouillon est attendu demain à 10h00.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Taux de change hebdomadaires — séries fictives d’exercice (CDF pour 1 USD)',
        colonnes: ['Semaine', 'Taux indicatif (CDF pour 1 USD)', 'Taux parallèle (CDF pour 1 USD)'],
        lignes: [
          ['S1', 2780, 2850],
          ['S2', 2795, 2870],
          ['S3', 2810, 2895],
          ['S4', 2808, 2890],
          ['S5', 2830, 2920],
          ['S6', 2852, 2950],
          ['S7', 2870, 2975],
          ['S8', 2885, 2990],
          ['S9', 2901, 3010],
          ['S10', 2920, 3035],
          ['S11', 2938, 3050],
          ['S12', 2950, 3070],
        ],
      },
      {
        type: 'texte',
        titre: 'Note de cadrage de Mme Ilunga',
        contenu:
          'Rappels pour le tableau de bord :\n• Cotation « au certain inversé » : le taux indique combien de CDF il faut pour obtenir 1 USD.\n• Le taux indicatif est la référence officielle de l’exercice ; le taux parallèle est un relevé du marché informel, donc moins fiable (échantillon de cambistes).\n• Arrondir les pourcentages à deux décimales et préciser systématiquement la base de calcul.\n• Toutes les données sont fictives : ne pas les citer hors de l’exercice.',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question:
          'Entre S1 et S12, comment le taux indicatif a-t-il évolué, et comment l’interpréter ?',
        options: [
          {
            id: 'a',
            texte:
              'Hausse de 6,12 % du taux : le franc congolais s’apprécie, puisque le chiffre augmente.',
            points: 0,
            feedback:
              'Le calcul est juste, mais l’interprétation est inversée, et c’est exactement l’erreur que redoute Mme Ilunga. Avec une cotation en CDF pour 1 USD, un taux qui monte signifie qu’il faut plus de francs pour obtenir un dollar : le CDF se déprécie.',
          },
          {
            id: 'b',
            texte:
              'Le taux passe de 2 780 à 2 950, soit +6,12 % : il faut plus de CDF pour 1 USD, donc le CDF se déprécie. En valeur, 1 CDF vaut environ 5,76 % de moins en USD.',
            points: 4,
            feedback:
              'C’est parfait : (2 950 − 2 780) / 2 780 ≈ +6,12 % pour le prix du dollar en francs, et 2 780 / 2 950 − 1 ≈ −5,76 % pour la valeur du franc en dollars. Les deux chiffres diffèrent parce que la base change. Préciser lequel on publie évite toute ambiguïté.',
          },
          {
            id: 'c',
            texte:
              'Le taux augmente de 170 %, signe d’une forte dépréciation du CDF.',
            points: 0,
            feedback:
              '170 est un écart en CDF (2 950 − 2 780), pas un pourcentage. Confondre variation absolue et variation relative est une erreur rédhibitoire dans une note de conjoncture.',
          },
          {
            id: 'd',
            texte:
              'Le CDF se déprécie de 6,12 % sur la période.',
            points: 2,
            feedback:
              'Le sens est correct, mais la mesure est imprécise : 6,12 % est la hausse du prix du dollar en francs. La perte de valeur du franc en dollars est de 5,76 %. Il faut toujours préciser la base du pourcentage.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Quelle est la moyenne mobile sur 4 semaines (MM4) du taux indicatif à la semaine S12 ?',
        options: [
          {
            id: 'a',
            texte: '2 911,00 CDF',
            points: 1,
            feedback:
              'C’est la MM4 de S11 (moyenne de S8 à S11). La méthode est bonne, mais la fenêtre est décalée d’une semaine. À S12, la fenêtre est S9, S10, S11, S12.',
          },
          {
            id: 'b',
            texte: '2 861,58 CDF',
            points: 0,
            feedback:
              'C’est la moyenne des 12 semaines : on perd tout l’intérêt d’une moyenne mobile, qui doit suivre la tendance récente en lissant le bruit hebdomadaire.',
          },
          {
            id: 'c',
            texte: '2 950,00 CDF',
            points: 0,
            feedback:
              'C’est la dernière observation, pas une moyenne. La MM4 est par construction en retard sur une série croissante, donc inférieure à 2 950 ici.',
          },
          {
            id: 'd',
            texte: '2 927,25 CDF',
            points: 3,
            feedback:
              'C’est exact : (2 901 + 2 920 + 2 938 + 2 950) / 4 = 2 927,25. Sur une série en hausse régulière, la MM4 reste sous la dernière valeur : c’est le retard normal d’une moyenne mobile.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'À S12, quel est l’écart (prime) du marché parallèle par rapport au taux indicatif, et comment le présenter ?',
        options: [
          {
            id: 'a',
            texte:
              'Prime de 3,91 % : (3 070 − 2 950) / 3 070.',
            points: 2,
            feedback:
              'L’écart absolu (120 CDF) est juste, mais la convention usuelle exprime la prime par rapport au taux de référence, c’est-à-dire le taux indicatif. Si tu choisis une autre base, il faut l’annoncer explicitement.',
          },
          {
            id: 'b',
            texte:
              'Prime de 4,07 % : (3 070 − 2 950) / 2 950. Elle s’est élargie depuis S1 (2,52 %). Le taux indicatif sert de référence, le taux parallèle mesure les tensions sur le marché informel.',
            points: 4,
            feedback:
              'C’est la bonne réponse, et elle est bien contextualisée. La prime rapportée au taux de référence passe de 2,52 % à 4,07 % : son élargissement signale des tensions croissantes sur la disponibilité des devises. Il faut aussi rappeler que le relevé parallèle est moins fiable, car il repose sur un échantillon.',
          },
          {
            id: 'c',
            texte: 'Prime de 120 %.',
            points: 0,
            feedback:
              '120 est un écart en CDF, pas en pourcentage. Une prime de 120 % voudrait dire que le dollar coûte plus du double sur le marché parallèle, ce qui est totalement faux ici.',
          },
          {
            id: 'd',
            texte:
              'Il vaut mieux ne pas calculer d’écart : les deux taux mesurent la même chose et seul le taux parallèle reflète la réalité.',
            points: 0,
            feedback:
              'Les deux taux ne mesurent pas la même chose : l’un est une référence officielle, l’autre un relevé informel. Leur écart est justement un indicateur clé de tensions de change, qu’il serait dommage d’ignorer.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e4',
        question: 'Quelle visualisation retiens-tu pour la page du tableau de bord ?',
        options: [
          {
            id: 'a',
            texte:
              'Un histogramme empilé du taux indicatif et du taux parallèle par semaine.',
            points: 0,
            feedback:
              'Empiler deux taux n’a aucun sens : leur somme (environ 5 800 CDF) ne représente rien. Un empilement ne se justifie que pour des parties d’un même total.',
          },
          {
            id: 'b',
            texte:
              'Deux courbes (indicatif et parallèle) sur un même axe en CDF pour 1 USD, la MM4 en pointillé, et en dessous un petit graphique de la prime en %. Le titre précise que la hausse correspond à une dépréciation du CDF.',
            points: 3,
            feedback:
              'C’est le bon choix : la courbe montre la tendance dans le temps, la MM4 lisse le bruit et le panneau séparé rend lisible l’élargissement de la prime. Le titre explicatif sur le sens de cotation protège contre le contresens.',
          },
          {
            id: 'c',
            texte:
              'Un tableau des 12 semaines avec les valeurs en gras.',
            points: 1,
            feedback:
              'Il est utile en annexe pour la traçabilité, mais un tableau ne fait pas ressortir la tendance ni l’élargissement de l’écart. Dans un tableau de bord, la dynamique doit se voir d’un coup d’œil.',
          },
          {
            id: 'd',
            texte:
              'Une jauge indiquant le dernier taux indicatif (2 950) avec des zones vert, orange et rouge.',
            points: 1,
            feedback:
              'Une jauge peut compléter une page, mais elle ne montre qu’un point et pas la trajectoire. En plus, des seuils de couleur arbitraires risquent d’être lus comme des objectifs officiels de change.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e5',
        question: 'Remets dans l’ordre la construction du tableau de bord.',
        elements: [
          { id: 'visu', texte: 'Construire les graphiques (courbes, MM4, panneau de prime)' },
          { id: 'controle', texte: 'Contrôler les séries : sources, dates, unités, sens de cotation, valeurs manquantes' },
          { id: 'publication', texte: 'Faire relire puis publier, avec date de mise à jour et mention des sources' },
          { id: 'indicateurs', texte: 'Calculer les indicateurs : variation sur la période, MM4, prime en %' },
          { id: 'commentaire', texte: 'Rédiger le commentaire d’interprétation et les avertissements méthodologiques' },
        ],
        ordreCorrect: ['controle', 'indicateurs', 'visu', 'commentaire', 'publication'],
        pointsMax: 4,
        feedback:
          'Tout part du contrôle des séries : une unité ou un sens de cotation mal compris rend faux tous les indicateurs en aval. On calcule ensuite, on visualise, puis on interprète, car le commentaire s’appuie sur des chiffres et des graphiques déjà vérifiés. La relecture avant publication reste indispensable pour une note qui engage l’institution.',
      },
    ],
    pointsMax: 18,
    debrief:
      'Rappel : les séries de ce cas sont fictives et servent uniquement à l’exercice.\n\nLes bons chiffres :\n• Variation du taux indicatif de S1 à S12 : (2 950 − 2 780) / 2 780 = +6,12 %. Il faut 6,12 % de francs en plus pour obtenir 1 dollar.\n• Valeur du franc en dollars : 2 780 / 2 950 − 1 = −5,76 %. C’est la mesure de la dépréciation du CDF à proprement parler.\n• MM4 à S12 : (2 901 + 2 920 + 2 938 + 2 950) / 4 = 2 927,25 CDF.\n• Prime du parallèle à S12 : (3 070 − 2 950) / 2 950 = 4,07 %, contre 2,52 % à S1. L’écart s’élargit.\n\nLe piège central est le sens de cotation. En CDF pour 1 USD, un taux qui monte veut dire un franc qui se déprécie. Le second piège est la base des pourcentages : 6,12 % et 5,76 % sont tous deux justes, mais ne répondent pas à la même question. Le troisième consiste à confondre variation absolue (170 CDF, 120 CDF) et variation relative.\n\nUn jury de banque centrale attend de la rigueur de calcul, une interprétation économique sans contresens et une visualisation honnête : courbes, référence clairement distinguée du marché informel, pas d’empilement absurde. Il attend aussi des avertissements méthodologiques sur la fiabilité du taux parallèle.\n\nRéflexes à retenir :\n• Écris toujours le sens de cotation dans le titre du graphique et dans la phrase d’interprétation.\n• Annonce la base de chaque pourcentage (« par rapport au taux indicatif », « valeur du CDF en USD »).\n• Une moyenne mobile se calcule sur une fenêtre qui se termine à la date considérée : vérifie-la sur la dernière ligne.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DATA-CAS-03 — Qualité des données de la centrale des risques
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DATA-CAS-03',
    filiere: 'data',
    titre: 'Qualité des données de la centrale des risques',
    role: 'Analyste data — Direction de la supervision des intermédiaires financiers',
    heure: 'Jeudi 09h15',
    enjeu:
      'Fiabiliser un extrait de la centrale des risques (fictive) avant qu’il serve à mesurer l’endettement total des emprunteurs.',
    contexte:
      'M. Kabeya, responsable de la centrale des risques de l’exercice, t’appelle : « On prépare un calcul d’endettement consolidé par emprunteur, tous établissements confondus. Mais je soupçonne l’extrait d’être truffé d’erreurs. » Il t’envoie 12 lignes déclarées par Banque Alpha, Banque Beta et Gamma Microfinance. Si un même client apparaît sous plusieurs identités, son endettement sera sous-estimé et le risque de surendettement passera inaperçu. Il attend pour lundi un diagnostic, une règle de dédoublonnage et un indicateur de qualité à publier chaque mois auprès des établissements. Les personnes et montants sont fictifs.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Extrait centrale des risques — déclarations du mois (données fictives)',
        colonnes: [
          'ID client',
          'Nom déclaré',
          'Date de naissance',
          'N° pièce d’identité',
          'Établissement',
          'Encours (CDF)',
          'Date d’octroi',
          'Date d’échéance',
        ],
        lignes: [
          ['CL-1001', 'MBUYI Grâce', '1988-03-14', 'ID-4471-882', 'Banque Alpha', '12 500 000', '2025-02-10', '2027-02-10'],
          ['CL-2087', 'Mbuyi Grace', '14/03/1988', '', 'Banque Beta', '8 000 000', '2025-06-01', '2026-12-01'],
          ['CL-1002', 'KASONGO Patrick', '1975-11-02', 'ID-1190-337', 'Banque Alpha', '45 000 000', '2024-09-15', '2029-09-15'],
          ['CL-3310', 'Kasongo Patrick M.', '1975-11-02', 'ID-1190-337', 'Gamma Microfinance', '2 500 000', '2026-01-20', '2026-07-20'],
          ['CL-1003', 'ILUNGA Esther', '1992-07-21', 'ID-5502-014', 'Banque Beta', '6 200 000', '2026-03-05', '2025-09-05'],
          ['CL-4415', 'Ilunga Ésther', '21-07-1992', 'ID 5502014', 'Gamma Microfinance', '1 200 000', '2026-02-14', '2026-08-14'],
          ['CL-1004', 'TSHIBANGU Josué', '1983-01-30', '', 'Gamma Microfinance', '1 800 000', '2026-05-02', '2027-05-02'],
          ['CL-1005', 'MUKENDI Sarah', '1990-05-12', 'ID-7781-220', 'Banque Alpha', '15 000 000', '2025-11-01', '2028-11-01'],
          ['CL-1006', 'KABONGO Didier', '2031-04-09', 'ID-6620-405', 'Banque Beta', '3 300 000', '2026-06-18', '2027-06-18'],
          ['CL-1007', 'NZUZI Ruth', '1979-08-17', 'ID-3349-561', 'Banque Beta', '-3 000 000', '2025-12-01', '2026-12-01'],
          ['CL-1008', 'MUKENDI Sarah', '1996-10-03', 'ID-8120-777', 'Gamma Microfinance', '900 000', '2026-04-11', '2026-10-11'],
          ['CL-1009', 'LUKUSA Albert', '1968-12-03', 'ID-9902-118', 'Banque Alpha', '22 000 000', '2023-07-01', '2028-07-01'],
        ],
      },
      {
        type: 'texte',
        titre: 'Message de M. Kabeya — 09h12',
        contenu:
          'Je te laisse regarder. Deux remarques :\n• On n’a pas d’identifiant national unique fiable pour tous les emprunteurs, et la pièce d’identité est parfois absente ou mal saisie.\n• Ne supprime rien dans la base de production : les établissements déclarants restent responsables de leurs données et doivent corriger à la source.',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question:
          'Quelles dimensions de la qualité des données sont en cause dans l’extrait ?',
        options: [
          {
            id: 'a',
            texte:
              'Uniquement l’exactitude : il suffit de corriger les fautes de frappe dans les noms.',
            points: 0,
            feedback:
              'C’est trop réducteur. Les fautes de frappe ne sont qu’un symptôme : le vrai risque est qu’un même emprunteur apparaisse plusieurs fois (unicité), sans compter les champs vides et les dates impossibles.',
          },
          {
            id: 'b',
            texte:
              'Complétude pour les doublons, unicité pour les pièces manquantes, actualité pour les dates incohérentes.',
            points: 1,
            feedback:
              'Les bonnes dimensions sont citées, mais elles sont mal rattachées aux anomalies. Un doublon relève de l’unicité, un champ vide de la complétude, et une échéance antérieure à l’octroi de la cohérence ou de la validité, pas de l’actualité.',
          },
          {
            id: 'c',
            texte:
              'Unicité (MBUYI, KASONGO et ILUNGA en double), complétude (pièces d’identité vides), cohérence et validité (échéance avant octroi, naissance en 2031, encours négatif), conformité de format (dates et pièces saisies de façons différentes).',
            points: 4,
            feedback:
              'C’est le diagnostic complet et correctement rattaché. Il permet de prioriser : l’unicité est critique pour un calcul d’endettement consolidé, et la conformité de format est un prérequis pour corriger le reste.',
          },
          {
            id: 'd',
            texte:
              'Unicité et complétude seulement : les dates incohérentes viennent sans doute de l’ordre des colonnes et ne posent pas de problème.',
            points: 2,
            feedback:
              'Les deux dimensions majeures sont bien identifiées. Mais les règles de validité (échéance avant octroi, date de naissance future, encours négatif) sont ignorées, alors qu’elles faussent directement les durées et les encours.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Quelle règle de dédoublonnage des emprunteurs proposes-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Fusionner automatiquement toutes les lignes qui partagent la même date de naissance.',
            points: 0,
            feedback:
              'Des milliers d’emprunteurs partagent la même date de naissance : on fusionnerait des personnes différentes (faux positifs massifs), ce qui gonflerait artificiellement leur endettement.',
          },
          {
            id: 'b',
            texte:
              'Clé exacte « nom + date de naissance » après mise en majuscules.',
            points: 2,
            feedback:
              'C’est un début raisonnable, mais insuffisant : « MBUYI GRÂCE » et « MBUYI GRACE », ou « KASONGO PATRICK » et « KASONGO PATRICK M. », ne matchent pas en exact. Les deux MUKENDI Sarah, qui ont des dates différentes, sont en revanche correctement séparés.',
          },
          {
            id: 'c',
            texte:
              'Après normalisation (casse, accents, formats de date et de pièce), clé composite date de naissance + n° de pièce ; à défaut de pièce, rapprochement flou du nom (ex. Jaro-Winkler au-dessus d’un seuil) avec la même date de naissance ; validation humaine des cas limites et table de correspondance, sans fusion destructive.',
            points: 4,
            feedback:
              'C’est la règle robuste : la normalisation fait matcher les variantes, la clé composite sécurise les cas où la pièce est présente, le rapprochement flou couvre les pièces manquantes (Mbuyi Grace), et la revue humaine évite les fusions abusives. La table de correspondance garde la trace et respecte la base de production.',
          },
          {
            id: 'd',
            texte:
              'Fusionner les lignes qui ont exactement le même nom déclaré.',
            points: 0,
            feedback:
              'C’est doublement faux. Les variantes d’orthographe passent au travers (faux négatifs), et les homonymes sont fusionnés à tort : les deux MUKENDI Sarah sont deux personnes différentes (naissance et pièce différentes).',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre le traitement de l’extrait.',
        elements: [
          { id: 'dedup', texte: 'Dédoublonner : clé composite, rapprochement flou, validation humaine' },
          { id: 'profil', texte: 'Sauvegarder l’extrait brut et le profiler (taux de vides, formats, valeurs extrêmes)' },
          { id: 'retour', texte: 'Publier les indicateurs de qualité et renvoyer les anomalies aux établissements pour correction à la source' },
          { id: 'standard', texte: 'Standardiser : dates au format ISO, casse, accents, format des pièces d’identité' },
          { id: 'validite', texte: 'Appliquer les règles de validité (échéance > octroi, encours > 0, naissance plausible) et mettre en quarantaine' },
        ],
        ordreCorrect: ['profil', 'standard', 'validite', 'dedup', 'retour'],
        pointsMax: 4,
        feedback:
          'On fige et on mesure d’abord l’état initial, pour pouvoir prouver l’amélioration et revenir en arrière. La standardisation vient avant la validation et le dédoublonnage, car « 14/03/1988 » et « 1988-03-14 » ne se comparent qu’une fois au même format. On écarte les lignes invalides avant de rapprocher les identités, puis on boucle avec les déclarants, qui restent responsables de leurs données.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Quel indicateur de qualité publies-tu chaque mois auprès des établissements ?',
        options: [
          {
            id: 'a',
            texte: 'Le nombre total de lignes reçues.',
            points: 0,
            feedback:
              'C’est un indicateur de volume, pas de qualité. Une base peut grossir tout en se dégradant.',
          },
          {
            id: 'b',
            texte: 'Un score global unique de qualité de 0 à 100 pour l’ensemble de la centrale.',
            points: 1,
            feedback:
              'Il est facile à communiquer, mais il ne dit ni quelle dimension pose problème ni quel établissement doit agir. Un score agrégé masque les mauvais élèves et n’entraîne aucune correction.',
          },
          {
            id: 'c',
            texte:
              'Le nombre de lignes que l’équipe a corrigées elle-même dans le mois.',
            points: 0,
            feedback:
              'Cet indicateur mesure l’effort interne, pas la qualité à la source, et il encourage à corriger à la place des déclarants, ce que M. Kabeya interdit justement.',
          },
          {
            id: 'd',
            texte:
              'Un taux de conformité par dimension et par établissement (% de pièces renseignées, % de dates cohérentes, % de doublons suspects), suivi mois par mois avec une cible.',
            points: 4,
            feedback:
              'C’est le bon choix : l’indicateur est actionnable (chaque établissement voit ses propres écarts), diagnostique (par dimension) et suivi dans le temps par rapport à une cible. C’est ce qui fait progresser la qualité à la source.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Que fais-tu de la ligne CL-1003 (ILUNGA Esther, échéance au 2025-09-05 pour un octroi au 2026-03-05) ?',
        options: [
          {
            id: 'a',
            texte:
              'Je la mets en quarantaine avec un code d’anomalie, je la signale à Banque Beta pour correction à la source et je l’exclus des calculs de durée jusqu’à correction.',
            points: 3,
            feedback:
              'C’est la bonne pratique : traçabilité, responsabilité du déclarant et protection des calculs. L’encours peut rester dans l’endettement consolidé avec une mention, puisque seule la date pose problème.',
          },
          {
            id: 'b',
            texte: 'J’inverse les deux dates : c’est forcément une inversion de saisie.',
            points: 1,
            feedback:
              'L’hypothèse est plausible, mais rien ne la garantit : l’erreur peut aussi porter sur l’année. Corriger sans confirmation et dans la base, c’est fabriquer une donnée.',
          },
          {
            id: 'c',
            texte: 'Je supprime la ligne de l’extrait.',
            points: 0,
            feedback:
              'Supprimer fait disparaître un encours de 6 200 000 CDF et sous-estime l’endettement d’une emprunteuse qui figure déjà chez Gamma Microfinance. On perd aussi la trace de l’anomalie.',
          },
          {
            id: 'd',
            texte: 'Je la laisse en l’état : la date d’échéance n’entre pas dans le calcul de l’endettement.',
            points: 0,
            feedback:
              'La date d’échéance sert aux maturités, aux échéanciers et aux indicateurs de retard. Laisser passer une incohérence connue sans la signaler, c’est accepter qu’elle se propage.',
          },
        ],
      },
    ],
    pointsMax: 19,
    debrief:
      'L’extrait (fictif) concentre les anomalies classiques d’une centrale des risques :\n• Unicité : MBUYI Grâce et Mbuyi Grace (même naissance, pièce absente d’un côté), KASONGO Patrick et Kasongo Patrick M. (même naissance, même pièce), ILUNGA Esther et Ilunga Ésther (même pièce une fois normalisée). Ces trois emprunteurs ont leur endettement sous-estimé.\n• Faux doublon : les deux MUKENDI Sarah sont des homonymes (dates de naissance et pièces différentes) et ne doivent surtout pas être fusionnées.\n• Complétude : pièces d’identité vides (CL-2087, CL-1004).\n• Validité et cohérence : échéance avant octroi (CL-1003), naissance en 2031 (CL-1006), encours négatif (CL-1007).\n• Conformité de format : dates et numéros de pièce saisis sous plusieurs formes.\n\nLa bonne démarche : figer et profiler, standardiser, valider, dédoublonner (clé composite date de naissance + pièce, rapprochement flou du nom quand la pièce manque, validation humaine des cas limites), puis renvoyer les anomalies aux déclarants. On travaille avec une table de correspondance, jamais par fusion destructive.\n\nLes pièges : fusionner sur le nom seul (homonymes) ou sur la date de naissance seule (faux positifs), et corriger soi-même en silence. Un jury de banque centrale attend un vocabulaire précis sur les dimensions de qualité, le respect de la responsabilité des établissements déclarants et des indicateurs actionnables, publiés par établissement.\n\nRéflexes à retenir :\n• Standardiser avant de comparer : un rapprochement sur des formats hétérogènes rate les vrais doublons.\n• Dédoublonnage = clé forte, puis rapprochement flou, puis humain, sans jamais supprimer la donnée source.\n• Mesurer la qualité par dimension et par déclarant, dans le temps, avec une cible.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DATA-CAS-04 — Inclusion financière & monnaie électronique
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DATA-CAS-04',
    filiere: 'data',
    titre: 'Inclusion financière & monnaie électronique',
    role: 'Analyste data — Direction de l’inclusion financière',
    heure: 'Mardi 16h30',
    enjeu:
      'Éviter qu’une simple corrélation soit présentée au comité comme la preuve que la monnaie électronique fait épargner.',
    contexte:
      'Le directeur adjoint, M. Tshibangu, t’envoie un message enthousiaste : « Regarde l’enquête : les utilisateurs de mobile money épargnent deux fois plus ! Je veux l’annoncer au comité de demain à 9h00 pour soutenir l’extension du réseau d’agents de Delta Mobile Money. » Tu disposes d’une enquête ménages d’exercice (fictive) qui compare utilisateurs et non-utilisateurs, ainsi que d’un suivi dans deux provinces fictives, dont une seule a bénéficié d’un déploiement d’agents en 2024. Ton rôle : produire une interprétation rigoureuse et une recommandation défendable. Tu as la soirée pour préparer trois diapositives.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Enquête ménages 2025 — comparaison des deux groupes (données fictives)',
        colonnes: ['Indicateur', 'Utilisateurs mobile money', 'Non-utilisateurs'],
        lignes: [
          ['Effectif enquêté', '1 200', '1 800'],
          ['Part résidant en zone urbaine', '78 %', '34 %'],
          ['Revenu mensuel moyen du ménage (CDF)', '420 000', '245 000'],
          ['Niveau d’instruction secondaire ou plus', '72 %', '41 %'],
          ['Âge moyen du chef de ménage', '31 ans', '43 ans'],
          ['Possède un téléphone portable', '100 %', '58 %'],
          ['Part des ménages déclarant une épargne', '61 %', '29 %'],
        ],
      },
      {
        type: 'table',
        titre: 'Suivi provincial — part des ménages déclarant une épargne (données fictives)',
        colonnes: ['Province (fictive)', 'Déploiement d’agents en 2024', 'Épargne 2023', 'Épargne 2025'],
        lignes: [
          ['Province Nord', 'Oui', '24 %', '38 %'],
          ['Province Sud', 'Non', '22 %', '29 %'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Comment interprètes-tu l’écart d’épargne entre les deux groupes de l’enquête ?',
        options: [
          {
            id: 'a',
            texte:
              'Le mobile money double l’épargne (61 % contre 29 %, soit un rapport d’environ 2,1).',
            points: 0,
            feedback:
              'Le rapport est juste arithmétiquement, mais la conclusion est causale alors que les données sont observationnelles. Les deux groupes diffèrent sur presque tout (milieu, revenu, instruction, âge) : on ne peut pas attribuer l’écart au seul mobile money.',
          },
          {
            id: 'b',
            texte:
              'L’écart (32 points) pourrait être dû au hasard de l’échantillonnage : il faut d’abord un test de significativité.',
            points: 1,
            feedback:
              'Tester la significativité est un bon réflexe, mais avec 1 200 et 1 800 répondants, un écart de 32 points ne doit presque rien au hasard. Le vrai problème n’est pas l’aléa d’échantillonnage, c’est la comparabilité des groupes (biais de sélection).',
          },
          {
            id: 'c',
            texte:
              'Les utilisateurs épargnent nettement plus (61 % contre 29 %), mais c’est une association : les groupes ne sont pas comparables (plus urbains, plus riches, plus instruits, plus jeunes), donc l’effet propre du mobile money reste inconnu.',
            points: 4,
            feedback:
              'C’est l’interprétation correcte : on décrit l’écart sans le surinterpréter et on nomme le biais de sélection. Ceux qui adoptent le mobile money sont, au départ, ceux qui avaient déjà plus de moyens d’épargner.',
          },
          {
            id: 'd',
            texte:
              'Le mobile money n’a aucun effet sur l’épargne : ce sont uniquement les plus riches qui l’utilisent.',
            points: 0,
            feedback:
              'C’est l’erreur inverse : conclure à l’absence d’effet est tout aussi infondé. Ces données ne permettent ni de prouver ni d’exclure un effet causal.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Quelle est la principale variable confondante à neutraliser avant de parler d’effet ?',
        options: [
          {
            id: 'a',
            texte: 'La taille des groupes (1 200 contre 1 800).',
            points: 0,
            feedback:
              'Des effectifs différents n’introduisent aucun biais quand on compare des proportions. Ils jouent seulement sur la précision des estimations.',
          },
          {
            id: 'b',
            texte: 'L’âge moyen du chef de ménage.',
            points: 2,
            feedback:
              'L’âge diffère bien entre les groupes et peut jouer, mais son lien avec l’épargne est moins direct que celui du revenu et du milieu de résidence. C’est une variable de contrôle secondaire.',
          },
          {
            id: 'c',
            texte: 'La part des ménages déclarant une épargne.',
            points: 0,
            feedback:
              'C’est la variable de résultat elle-même, pas une variable confondante. Contrôler par le résultat n’a pas de sens.',
          },
          {
            id: 'd',
            texte:
              'Le revenu et le milieu de résidence (urbain ou rural), qui favorisent à la fois l’adoption du mobile money et la capacité d’épargne.',
            points: 4,
            feedback:
              'C’est la bonne réponse : une variable confondante influence à la fois l’exposition (adopter le mobile money) et le résultat (épargner). Un ménage urbain au revenu de 420 000 CDF a plus accès aux agents et plus de marge pour épargner. Il faut comparer à revenu et milieu équivalents.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'À partir du suivi provincial, quelle estimation de l’effet du déploiement d’agents est la plus défendable ?',
        options: [
          {
            id: 'a',
            texte: '+9 points : 38 % (Nord 2025) − 29 % (Sud 2025).',
            points: 1,
            feedback:
              'Comparer les deux provinces en 2025 ignore qu’elles ne partaient pas du même niveau (24 % contre 22 %). On attribue alors au déploiement une partie de l’écart initial.',
          },
          {
            id: 'b',
            texte: '+14 points : 38 % − 24 % dans la Province Nord.',
            points: 1,
            feedback:
              'C’est une comparaison avant-après sans groupe témoin : on attribue au déploiement toute la hausse, y compris la tendance générale, que la Province Sud montre aussi (+7 points sans agents).',
          },
          {
            id: 'c',
            texte:
              'Environ +7 points : (38 − 24) − (29 − 22). C’est une différence de différences, à condition que les deux provinces aient eu des tendances comparables avant 2024.',
            points: 4,
            feedback:
              'C’est la différence de différences : on retire à la hausse de la province traitée (+14) la hausse observée sans traitement (+7). L’hypothèse clé, les « tendances parallèles », doit être vérifiée sur les années antérieures et annoncée.',
          },
          {
            id: 'd',
            texte: '+58 % : (38 − 24) / 24.',
            points: 0,
            feedback:
              'C’est une variation relative avant-après, sans groupe témoin, et exprimée en % plutôt qu’en points de pourcentage. Ce chiffre gonflé mélange tendance générale et effet du déploiement.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre la démarche d’évaluation plus robuste que tu proposes.',
        elements: [
          { id: 'estimer', texte: 'Estimer l’effet par différence de différences, avec contrôles (revenu, milieu, âge)' },
          { id: 'question', texte: 'Formuler la question causale et l’indicateur de résultat (part des ménages qui épargnent)' },
          { id: 'robustesse', texte: 'Tester la robustesse (autres spécifications, sous-groupes) et documenter les limites' },
          { id: 'temoin', texte: 'Définir le groupe traité et un groupe témoin comparable avant le déploiement' },
          { id: 'tendances', texte: 'Vérifier les tendances parallèles sur les années précédant le déploiement' },
        ],
        ordreCorrect: ['question', 'temoin', 'tendances', 'estimer', 'robustesse'],
        pointsMax: 4,
        feedback:
          'On part d’une question précise et d’un indicateur unique, puis on construit la comparaison : traités contre témoins comparables. On vérifie l’hypothèse de tendances parallèles avant d’estimer, sinon l’estimation n’a pas de sens. Les tests de robustesse et l’exposé des limites viennent en dernier et conditionnent le niveau de confiance communiqué.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle recommandation présentes-tu au comité de 9h00 ?',
        options: [
          {
            id: 'a',
            texte:
              'Présenter 61 % contre 29 % en grand, avec la mention « corrélation » en note de bas de page.',
            points: 1,
            feedback:
              'Le chiffre affiché en grand sera retenu comme une preuve causale : la note de bas de page ne protège personne. La précaution doit être au cœur du message, pas en marge.',
          },
          {
            id: 'b',
            texte:
              'Ne rien présenter tant qu’on ne dispose pas d’une étude expérimentale parfaite.',
            points: 1,
            feedback:
              'La prudence est louable, mais le comité doit décider avec l’information disponible. Mieux vaut une estimation honnêtement qualifiée qu’un silence qui laisse circuler le chiffre « deux fois plus ».',
          },
          {
            id: 'c',
            texte:
              'Annoncer que le mobile money double l’épargne et recommander d’étendre immédiatement le réseau d’agents de Delta Mobile Money à toutes les provinces.',
            points: 0,
            feedback:
              'C’est la conclusion causale non démontrée, et en plus une recommandation qui favorise nommément un opérateur. Une banque centrale doit rester neutre et fonder ses positions sur des preuves solides.',
          },
          {
            id: 'd',
            texte:
              'Présenter l’association observée, puis l’estimation prudente d’environ +7 points (différence de différences) avec ses hypothèses et limites, et recommander un pilote évalué avec groupe témoin avant toute généralisation.',
            points: 4,
            feedback:
              'C’est la recommandation défendable : transparente sur ce que l’on sait et ce que l’on ignore, chiffrée avec la bonne méthode et assortie d’une démarche pour réduire l’incertitude. Elle reste neutre vis-à-vis des opérateurs.',
          },
        ],
      },
    ],
    pointsMax: 20,
    debrief:
      'Rappel : enquête, provinces et opérateur sont fictifs.\n\nL’enquête montre une association forte : 61 % des utilisateurs de mobile money déclarent une épargne, contre 29 % des non-utilisateurs (+32 points, rapport d’environ 2,1). Mais les deux groupes ne sont pas comparables : 78 % d’urbains contre 34 %, 420 000 contre 245 000 CDF de revenu, 72 % contre 41 % d’instruction secondaire, et des chefs de ménage plus jeunes. C’est un biais de sélection : les ménages qui adoptent le mobile money avaient déjà plus de capacité à épargner. Le revenu et le milieu de résidence sont les principales variables confondantes.\n\nLe suivi provincial permet une analyse plus robuste par différence de différences :\n• Province Nord (agents déployés) : +14 points (24 % → 38 %).\n• Province Sud (sans agents) : +7 points (22 % → 29 %), soit la tendance générale.\n• Effet estimé : 14 − 7 = environ +7 points, sous l’hypothèse de tendances parallèles avant 2024, à vérifier.\n\nLes pièges : confondre corrélation et causalité, comparer avant-après sans témoin (+14), comparer en coupe à la fin (+9), confondre points de pourcentage et pourcentage (+58 %), et à l’inverse conclure à l’absence d’effet. Avec deux provinces seulement, l’estimation reste fragile : il faut le dire.\n\nUn jury de banque centrale attend un discours nuancé mais utile à la décision. Il faut donner un chiffre défendable, ses hypothèses, ses limites et une proposition d’évaluation (pilote avec groupe témoin), en restant neutre vis-à-vis des opérateurs.\n\nRéflexes à retenir :\n• Avant toute conclusion causale, demande-toi si les groupes étaient comparables au départ.\n• Différence de différences = (évolution du groupe traité) − (évolution du groupe témoin) ; vérifie les tendances parallèles.\n• Place la précaution méthodologique au centre du message, pas en note de bas de page.',
  },
];

// ===========================================================================
// FILIÈRE CYBERSÉCURITÉ
// ===========================================================================

const casCyber: CasPratique[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // CYB-CAS-01 — DDoS applicatif sur le portail interbancaire
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'CYB-CAS-01',
    filiere: 'cyber',
    titre: `DDoS sur le portail interbancaire à 9h05, jour d'échéance`,
    role: `Analyste SOC N2 — Centre des opérations de sécurité`,
    heure: `Jeudi 09h05 — jour d'échéance`,
    enjeu: `Rétablir l'accès des banques participantes au portail avant la clôture des ordres de virement de 12h00, sans aggraver l'incident.`,
    contexte: `Jeudi 15 octobre, jour d'échéance mensuelle des règlements interbancaires. Depuis 09h02, le portail portail-interbancaire.example, par lequel Banque Alpha, Banque Beta et Gamma Microfinance soumettent leurs ordres de virement, répond de plus en plus lentement puis renvoie des erreurs. Le superviseur vous transmet un extrait des journaux du reverse proxy Nginx (10.10.0.5) placé devant les serveurs applicatifs. La supervision réseau indique que le lien Internet n'est chargé qu'à 41 % de sa capacité, sans pic de trafic UDP ou ICMP, alors que les processeurs des serveurs applicatifs sont à 98 %. Deux banques participantes ont déjà appelé le support : leurs opérateurs ne parviennent plus à se connecter. La fenêtre de clôture des ordres est fixée à 12h00 et le responsable de la cellule de crise attend votre analyse dans dix minutes.`,
    piecesJointes: [
      {
        type: 'logs',
        titre: `access.log — reverse proxy Nginx 10.10.0.5 (extrait, format combiné)`,
        lignes: [
          `172.16.20.11 - - [15/Oct/2026:09:01:47 +0100] "GET /tableau-de-bord HTTP/1.1" 200 8412 "https://portail-interbancaire.example/login" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36"`,
          `203.0.113.14 - - [15/Oct/2026:09:02:03 +0100] "POST /login HTTP/1.1" 401 312 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `198.51.100.201 - - [15/Oct/2026:09:02:03 +0100] "POST /login HTTP/1.1" 401 312 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `192.0.2.77 - - [15/Oct/2026:09:02:04 +0100] "POST /api/virements HTTP/1.1" 401 128 "-" "python-requests/2.31.0"`,
          `203.0.113.88 - - [15/Oct/2026:09:02:04 +0100] "POST /login HTTP/1.1" 401 312 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `172.16.30.25 - - [15/Oct/2026:09:02:11 +0100] "POST /api/virements HTTP/1.1" 200 734 "https://portail-interbancaire.example/virements/nouveau" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"`,
          `198.51.100.36 - - [15/Oct/2026:09:03:30 +0100] "POST /api/virements HTTP/1.1" 429 96 "-" "python-requests/2.31.0"`,
          `203.0.113.141 - - [15/Oct/2026:09:03:30 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `192.0.2.150 - - [15/Oct/2026:09:03:31 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `198.51.100.12 - - [15/Oct/2026:09:03:31 +0100] "POST /api/virements HTTP/1.1" 503 197 "-" "python-requests/2.31.0"`,
          `172.16.40.7 - - [15/Oct/2026:09:03:52 +0100] "GET /login HTTP/1.1" 200 5120 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36"`,
          `203.0.113.203 - - [15/Oct/2026:09:04:40 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `192.0.2.33 - - [15/Oct/2026:09:04:40 +0100] "POST /api/virements HTTP/1.1" 503 197 "-" "python-requests/2.31.0"`,
          `198.51.100.97 - - [15/Oct/2026:09:04:40 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `203.0.113.59 - - [15/Oct/2026:09:04:41 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `172.16.40.7 - - [15/Oct/2026:09:04:58 +0100] "POST /login HTTP/1.1" 503 197 "https://portail-interbancaire.example/login" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36"`,
          `192.0.2.218 - - [15/Oct/2026:09:05:01 +0100] "POST /api/virements HTTP/1.1" 503 197 "-" "python-requests/2.31.0"`,
          `198.51.100.144 - - [15/Oct/2026:09:05:01 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `203.0.113.7 - - [15/Oct/2026:09:05:02 +0100] "POST /login HTTP/1.1" 503 197 "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"`,
          `172.16.20.11 - - [15/Oct/2026:09:05:03 +0100] "GET /tableau-de-bord HTTP/1.1" 503 197 "https://portail-interbancaire.example/login" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36"`,
          `# Synthèse 09:00-09:05 : 2 870 IP sources distinctes, 61 % des requêtes avec l'UA "MSIE 6.0", 34 % avec "python-requests" ; 93 % ciblent POST /login et POST /api/virements`,
          `# Taux de réponses 503 : 09:02 = 4 % | 09:03 = 27 % | 09:04 = 58 % | 09:05 = 81 %`,
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: `D'après les journaux et l'état de la supervision, comment qualifiez-vous l'incident ?`,
        options: [
          {
            id: 'a',
            texte: `Un DDoS volumétrique : le lien Internet est saturé par un flot massif de paquets, il faut demander au fournisseur d'accès de filtrer en amont.`,
            points: 1,
            feedback: `Il s'agit bien d'un déni de service distribué, mais pas volumétrique : le lien n'est chargé qu'à 41 % et aucun pic UDP/ICMP n'est observé. Ce sont les ressources applicatives (CPU à 98 %) qui sont épuisées.`,
          },
          {
            id: 'b',
            texte: `Un DDoS applicatif (couche 7) : des milliers d'IP distinctes envoient des requêtes HTTP syntaxiquement valides, avec des user-agents répétitifs et anormaux, sur les points d'entrée coûteux POST /login et POST /api/virements ; le serveur s'épuise (503 croissants) alors que la bande passante reste disponible.`,
            points: 4,
            feedback: `Exact. Chaque indice des journaux converge : 2 870 IP, UA obsolète (MSIE 6.0) ou de script (python-requests), concentration sur deux endpoints qui sollicitent l'authentification et la base, 503 passant de 4 % à 81 %, lien non saturé. La qualification oriente directement le confinement vers le WAF et la limitation de débit.`,
          },
          {
            id: 'c',
            texte: `Une simple surcharge liée au pic d'activité du jour d'échéance : il suffit d'attendre que le volume retombe.`,
            points: 0,
            feedback: `Dangereux : les user-agents « MSIE 6.0 » et « python-requests » n'appartiennent pas aux opérateurs bancaires légitimes, qui utilisent des navigateurs récents depuis les plages 172.16.x. Attendre revient à laisser l'attaquant atteindre son objectif avant 12h00.`,
          },
          {
            id: 'd',
            texte: `Uniquement du bourrage d'identifiants (credential stuffing) : il suffit de verrouiller les comptes ciblés après trois échecs.`,
            points: 1,
            feedback: `Les 401 sur /login montrent bien une composante de test d'identifiants, mais elle n'explique pas le flot sur /api/virements ni l'épuisement du serveur. Verrouiller les comptes pénaliserait surtout les opérateurs légitimes : c'est un effet de déni de service supplémentaire.`,
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e2',
        question: `Ordonnez les actions de réponse selon le cycle de gestion des incidents du NIST SP 800-61.`,
        elements: [
          {
            id: 'n3',
            texte: `Éradication : bloquer durablement les signatures et sources identifiées, imposer une limite de débit native sur les endpoints sensibles, vérifier qu'aucune fraude ou compromission de compte n'a été masquée par le « bruit » de l'attaque.`,
          },
          {
            id: 'n1',
            texte: `Détection et analyse : corréler les journaux Nginx et WAF, mesurer l'évolution des 503, extraire les signatures (UA, endpoints, plages), déclarer l'incident et ouvrir la main courante de crise.`,
          },
          {
            id: 'n5',
            texte: `Retour d'expérience : réunion post-incident, chronologie détaillée, indicateurs (délai de détection, délai de rétablissement), mise à jour du plan de réponse et des règles de filtrage.`,
          },
          {
            id: 'n2',
            texte: `Confinement : activer les règles WAF et la limitation de débit sur /login et /api/virements, défi pour les clients non authentifiés, liste blanche des plages déclarées par les banques, bascule vers le service anti-DDoS en amont.`,
          },
          {
            id: 'n4',
            texte: `Rétablissement : réouverture progressive du service sous surveillance renforcée, confirmation avec chaque banque de la bonne réception de ses ordres, rapprochement des virements soumis pendant l'incident.`,
          },
        ],
        ordreCorrect: ['n1', 'n2', 'n3', 'n4', 'n5'],
        pointsMax: 5,
        feedback: `On ne confine bien que ce que l'on a qualifié : l'analyse fournit les signatures qui alimentent les règles WAF. Le confinement vient avant l'éradication car l'urgence est de rendre le portail aux banques avant 12h00 ; l'éradication traite ensuite les causes (endpoints sans limite de débit). Le rétablissement inclut le rapprochement des ordres, et le retour d'expérience clôt le cycle en améliorant la préparation.`,
      },
      {
        type: 'choix',
        id: 'e3',
        question: `Il est 09h15. Quelle mesure de confinement proposez-vous en priorité à la cellule de crise ?`,
        options: [
          {
            id: 'a',
            texte: `Bloquer une par une, sur le pare-feu, les adresses IP visibles dans l'extrait de journaux.`,
            points: 1,
            feedback: `Avec près de 3 000 IP qui tournent (botnet), le blocage unitaire est trop lent et toujours en retard. Il risque aussi de bloquer des adresses partagées (NAT) légitimes. Utile seulement en complément.`,
          },
          {
            id: 'b',
            texte: `Arrêter complètement le portail jusqu'à la fin de l'attaque pour protéger les serveurs.`,
            points: 0,
            feedback: `C'est offrir à l'attaquant exactement ce qu'il cherche, le jour d'échéance. Un déni de service se traite en filtrant le trafic malveillant tout en préservant le trafic légitime, pas en coupant le service.`,
          },
          {
            id: 'c',
            texte: `Ajouter des serveurs applicatifs (montée en charge automatique) pour absorber le trafic.`,
            points: 1,
            feedback: `Cela peut donner un peu de répit, mais la charge illégitime continuera de croître et la base de données d'authentification restera le goulet d'étranglement. Sans filtrage, on paie pour servir l'attaquant.`,
          },
          {
            id: 'd',
            texte: `Activer des règles WAF ciblées (limitation de débit par IP et par session sur /login et /api/virements, blocage des UA anormaux, défi pour les clients non authentifiés), mettre en liste blanche les plages déclarées des banques participantes, basculer le trafic vers le service anti-DDoS amont et ouvrir le canal de repli prévu au plan de continuité pour les ordres urgents.`,
            points: 4,
            feedback: `C'est la réponse proportionnée : elle filtre la couche 7 là où se situe l'attaque, protège le trafic légitime identifié et prévoit un canal de secours pour tenir l'échéance de 12h00. Chaque règle activée doit être tracée dans la main courante.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e4',
        question: `Les banques participantes s'inquiètent. Quelle communication adoptez-vous ?`,
        options: [
          {
            id: 'a',
            texte: `Un message factuel validé par le responsable de crise, diffusé par le canal prévu au plan de crise (liste des correspondants sécurité et opérations) : indisponibilité partielle depuis 09h02 due à un trafic malveillant, mesures en cours, procédure de repli pour les ordres urgents, heure du prochain point (10h00). Aucune attribution ni spéculation.`,
            points: 3,
            feedback: `C'est la bonne pratique : un seul canal officiel, un message vérifié, des consignes actionnables et un rendez-vous de mise à jour. On ne spécule ni sur l'auteur ni sur la durée.`,
          },
          {
            id: 'b',
            texte: `Publier immédiatement un communiqué sur les réseaux sociaux attribuant l'attaque à un groupe criminel connu.`,
            points: 0,
            feedback: `L'attribution est prématurée et non étayée, et une communication publique non coordonnée peut alimenter la panique et la désinformation. La communication externe relève de la cellule de crise et de la direction de la communication.`,
          },
          {
            id: 'c',
            texte: `Ne rien dire avant la résolution complète, pour ne pas inquiéter inutilement les banques.`,
            points: 0,
            feedback: `Le silence laisse les banques sans consignes à trois heures de la clôture : elles multiplient les appels, réessaient en boucle et aggravent la charge. La transparence factuelle fait partie de la gestion de crise.`,
          },
          {
            id: 'd',
            texte: `Appeler chaque banque depuis votre téléphone personnel pour expliquer l'origine probable de l'attaque.`,
            points: 1,
            feedback: `L'intention est bonne mais la méthode est mauvaise : canal non prévu, non tracé, messages potentiellement divergents d'une banque à l'autre, et « origine probable » relève de la spéculation.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: `Le service est rétabli à 10h40. Quelles mesures post-incident recommandez-vous en priorité ?`,
        options: [
          {
            id: 'a',
            texte: `Changer d'hébergeur, puisque celui-ci n'a pas su empêcher l'attaque.`,
            points: 0,
            feedback: `Réaction émotionnelle sans analyse des causes : un autre hébergeur subirait la même attaque si l'architecture applicative reste vulnérable aux floods couche 7.`,
          },
          {
            id: 'b',
            texte: `Rédiger le rapport d'incident et l'archiver.`,
            points: 1,
            feedback: `Nécessaire mais insuffisant : un rapport sans plan d'action suivi n'améliore pas la résilience. Le retour d'expérience doit déboucher sur des mesures datées et attribuées.`,
          },
          {
            id: 'c',
            texte: `Souscrire une protection anti-DDoS permanente (filtrage amont et WAF), imposer des limites de débit natives et une authentification forte des clients API (certificats mutuels ou liste blanche), organiser des tests de charge et un exercice de crise, tenir le retour d'expérience, mettre à jour le plan de réponse et effectuer les notifications prévues par les procédures internes.`,
            points: 4,
            feedback: `C'est un plan complet qui traite les causes techniques (absence de limitation de débit, API exposée sans authentification forte), la préparation (exercices) et la gouvernance (RETEX, notifications).`,
          },
          {
            id: 'd',
            texte: `Bloquer définitivement tout le trafic provenant de l'étranger (géoblocage total).`,
            points: 1,
            feedback: `Le géoblocage peut réduire une partie du bruit, mais il est facilement contourné par des machines compromises situées localement et peut bloquer des correspondants légitimes. Ce n'est qu'une mesure d'appoint.`,
          },
        ],
      },
    ],
    pointsMax: 20,
    debrief: `Démarche attendue : qualifier avant d'agir, puis dérouler le cycle NIST SP 800-61 (préparation, détection et analyse, confinement/éradication/rétablissement, activités post-incident). La révision 3 du guide (2025) l'aligne sur les fonctions du NIST CSF 2.0, mais la logique reste la même.
• Qualification : le lien à 41 %, l'absence de pic UDP/ICMP et le CPU applicatif à 98 % excluent un DDoS volumétrique. Les journaux montrent un DDoS applicatif couche 7 : milliers d'IP, UA anormaux (MSIE 6.0, python-requests), ciblage de POST /login et POST /api/virements, 503 en forte croissance (4 % → 81 %).
• Piège n°1 : confondre surcharge métier et attaque. Les opérateurs légitimes se reconnaissent à leurs plages 172.16.x et à leurs navigateurs récents.
• Piège n°2 : des réponses qui font le jeu de l'attaquant (couper le portail, verrouiller massivement les comptes).
• Confinement : filtrage couche 7 (WAF, limitation de débit, défi), liste blanche des participants, service anti-DDoS amont et canal de repli pour tenir l'échéance de 12h00.
• Communication : un canal unique prévu au plan de crise, des faits, des consignes et un prochain point horodaté, sans attribution ni spéculation.
• Ne pas oublier qu'un DDoS sert parfois de diversion : il faut vérifier après coup qu'aucune fraude ni compromission de compte n'a eu lieu pendant l'attaque.
Ce qu'attend un jury de banque centrale : le sens de la continuité de service des infrastructures de marché, la traçabilité de chaque décision (main courante), la coordination avec les participants et une amélioration continue formalisée.
Réflexes à retenir : lire les journaux (IP, UA, endpoints, codes HTTP), mesurer la tendance, protéger le trafic légitime, communiquer par le canal prévu et capitaliser par le retour d'expérience.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CYB-CAS-02 — Phishing : faux avis de recrutement
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'CYB-CAS-02',
    filiere: 'cyber',
    titre: `Phishing ciblant les agents : faux avis de recrutement`,
    role: `Analyste SOC N2 — Centre des opérations de sécurité`,
    heure: `Lundi 08h20 — campagne de recrutement en cours`,
    enjeu: `Contenir une campagne d'hameçonnage exploitant la période de recrutement avant que des identifiants volés ne soient utilisés.`,
    contexte: `Scénario fictif. Votre institution (domaine banque-centrale.example) mène actuellement une campagne de recrutement interne et externe très suivie. À 08h05, un agent de la direction des opérations signale via le bouton « Signaler un hameçonnage » un e-mail qui l'informe de sa présélection à un test écrit. La passerelle de messagerie indique que 47 agents ont reçu ce message entre 07h52 et 07h58. Le service de veille vous apprend que le domaine expéditeur a été enregistré il y a trois jours. Le proxy web montre que plusieurs postes ont déjà ouvert le lien ou la pièce jointe. Le RSSI vous demande une analyse et un plan d'action pour 09h00.`,
    piecesJointes: [
      {
        type: 'texte',
        titre: `E-mail signalé (en-têtes et corps)`,
        contenu: `Return-Path: <bounce-4471@mailer-relay7.example>
Received: from mailer-relay7.example (203.0.113.88) by mx1.banque-centrale.example; Mon, 19 Oct 2026 07:52:13 +0100
Authentication-Results: mx1.banque-centrale.example; spf=fail (sender IP 203.0.113.88 not permitted) smtp.mailfrom=bcc-rdc-carrieres.example; dkim=none (message not signed); dmarc=fail (p=none) header.from=bcc-rdc-carrieres.example
From: "Direction des Ressources Humaines" <recrutement@bcc-rdc-carrieres.example>
Reply-To: selection.dossiers2026@freemail.example
To: agents-operations@banque-centrale.example
Date: Mon, 19 Oct 2026 07:52:13 +0100
Subject: URGENT - Confirmation de votre présélection au test écrit (délai 24 h)
X-Mailer: PHPMailer 6.8.0

Bonjour,

Suite à l'examen de votre dossier, nous avons le plaisir de vous informer que vous êtes présélectionné(e) pour le test écrit de la campagne de recrutement 2026.

Pour confirmer votre participation, vous devez valider votre identité avec vos identifiants de messagerie professionnelle avant demain 10h00 via le lien sécurisé suivant :
https://lnk.example/Rx7Kp

Sans confirmation dans ce délai, votre dossier sera définitivement annulé.
Merci de compléter également la convocation jointe.

Pièce jointe : Convocation_Test_Ecrit.html (14 Ko)

Cordialement,
Le Service Recrutement`,
      },
      {
        type: 'logs',
        titre: `Proxy web proxy01 (10.30.0.10) — 19/10/2026, extrait filtré sur les IoC`,
        lignes: [
          `2026-10-19T07:58:41+01:00 proxy01 src=10.30.2.41 user=agent.ops12 GET https://lnk.example/Rx7Kp status=301 dst=198.51.100.23`,
          `2026-10-19T07:58:42+01:00 proxy01 src=10.30.2.41 user=agent.ops12 GET https://portail-rh-bcc.example/connexion status=200 dst=198.51.100.23`,
          `2026-10-19T07:59:37+01:00 proxy01 src=10.30.2.41 user=agent.ops12 POST https://portail-rh-bcc.example/connexion status=302 dst=198.51.100.23 bytes_out=1184`,
          `2026-10-19T07:59:38+01:00 proxy01 src=10.30.2.41 user=agent.ops12 GET https://portail-rh-bcc.example/merci status=200 dst=198.51.100.23`,
          `2026-10-19T08:01:05+01:00 proxy01 src=10.30.2.58 user=agent.ops19 GET https://lnk.example/Rx7Kp status=301 dst=198.51.100.23`,
          `2026-10-19T08:01:06+01:00 proxy01 src=10.30.2.58 user=agent.ops19 GET https://portail-rh-bcc.example/connexion status=200 dst=198.51.100.23`,
          `2026-10-19T08:03:12+01:00 proxy01 src=10.30.7.102 user=agent.cpt03 POST http://198.51.100.23/collect.php status=200 bytes_out=962 referer=file:///C:/Users/agent.cpt03/Downloads/Convocation_Test_Ecrit.html`,
          `2026-10-19T08:04:50+01:00 proxy01 src=10.30.5.19 user=agent.drh08 GET https://lnk.example/Rx7Kp status=301 dst=198.51.100.23`,
          `2026-10-19T08:04:51+01:00 proxy01 src=10.30.5.19 user=agent.drh08 GET https://portail-rh-bcc.example/connexion status=403 action=BLOCKED category=newly-registered-domain`,
          `2026-10-19T08:06:30+01:00 proxy01 src=10.30.2.77 user=agent.ops05 GET https://lnk.example/Rx7Kp status=403 action=BLOCKED category=newly-registered-domain`,
          `2026-10-19T08:11:02+01:00 mx1 auth: user=agent.ops12 login=SUCCESS src=203.0.113.150 client=IMAP country=inconnu`,
          `2026-10-19T08:11:40+01:00 mx1 rule-created: user=agent.ops12 rule="Archive" action=forward_to=selection.dossiers2026@freemail.example`,
          `2026-10-19T08:12:15+01:00 proxy01 summary: 4 clics sur lnk.example, 2 soumissions de formulaire (agent.ops12, agent.cpt03), 2 blocages après mise à jour de catégorie`,
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: `Quels indicateurs de compromission (IoC) jugez-vous prioritaires pour qualifier et bloquer la campagne ?`,
        options: [
          {
            id: 'a',
            texte: `Le ton pressant du message et l'éventuelle présence de fautes d'orthographe.`,
            points: 1,
            feedback: `Ce sont des signaux d'alerte utiles pour un utilisateur, mais ce ne sont pas des IoC exploitables techniquement : on ne bloque pas un « ton ». Les campagnes ciblées sont d'ailleurs souvent bien rédigées.`,
          },
          {
            id: 'b',
            texte: `L'en-tête X-Mailer « PHPMailer », qui suffit à prouver la fraude.`,
            points: 1,
            feedback: `C'est un indice faible : PHPMailer est aussi utilisé par des expéditeurs légitimes. Il complète le faisceau d'indices mais ne suffit ni à qualifier ni à bloquer.`,
          },
          {
            id: 'c',
            texte: `Le domaine sosie bcc-rdc-carrieres.example (enregistré il y a 3 jours), le Reply-To vers une messagerie gratuite différente de l'expéditeur, l'échec SPF/DMARC et l'absence de DKIM, l'IP d'envoi 203.0.113.88, le lien raccourci menant à portail-rh-bcc.example (198.51.100.23), la pièce jointe .html qui poste vers /collect.php, et la demande d'identifiants assortie d'un délai.`,
            points: 4,
            feedback: `Exact. Ces éléments sont à la fois probants et exploitables : domaines, URL, IP et empreinte de la pièce jointe alimentent directement les blocages (passerelle, proxy, DNS) et les recherches dans les journaux.`,
          },
          {
            id: 'd',
            texte: `Le fait que le message soit adressé à une liste de diffusion interne, ce qui montre qu'il provient de l'interne.`,
            points: 0,
            feedback: `Faux : n'importe quel expéditeur externe peut écrire à une adresse de liste si elle est connue. Les en-têtes Received et Authentication-Results montrent clairement une origine externe non authentifiée.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: `agent.ops12 et agent.cpt03 ont soumis un formulaire. Que faites-vous pour ces deux comptes ?`,
        options: [
          {
            id: 'a',
            texte: `Réinitialiser immédiatement leurs mots de passe, révoquer toutes les sessions et jetons actifs, vérifier l'inscription MFA, supprimer la règle de transfert créée sur la boîte d'agent.ops12, analyser les connexions depuis 203.0.113.150 et lancer une analyse EDR du poste d'agent.cpt03 qui a ouvert la pièce jointe.`,
            points: 4,
            feedback: `C'est la réponse complète : les journaux montrent déjà une connexion IMAP réussie depuis une IP externe et une règle de transfert vers l'adresse de l'attaquant. Il faut couper l'accès, supprimer la persistance et mesurer ce qui a été exfiltré.`,
          },
          {
            id: 'b',
            texte: `Leur envoyer un e-mail leur demandant de changer leur mot de passe dès qu'ils le pourront.`,
            points: 1,
            feedback: `Trop lent et insuffisant : l'attaquant est déjà connecté, et changer le mot de passe ne révoque ni les sessions ouvertes ni la règle de transfert. De plus, l'e-mail peut être lu par l'attaquant.`,
          },
          {
            id: 'c',
            texte: `Ne rien faire tant qu'aucune activité suspecte n'est constatée sur leurs comptes.`,
            points: 0,
            feedback: `Une activité suspecte est déjà visible (connexion IMAP depuis 203.0.113.150, règle de transfert). Attendre, c'est laisser l'attaquant exfiltrer des messages et rebondir sur d'autres agents.`,
          },
          {
            id: 'd',
            texte: `Désactiver définitivement leurs comptes et engager une procédure disciplinaire.`,
            points: 1,
            feedback: `Une suspension temporaire peut se justifier, mais la sanction est contre-productive : elle décourage le signalement, qui est la première ligne de détection. Et elle ne traite ni la règle de transfert ni l'analyse du poste.`,
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: `Ordonnez les actions de traitement de la campagne.`,
        elements: [
          {
            id: 'p4',
            texte: `Remédier : réinitialiser les identifiants exposés, révoquer les sessions, supprimer les règles de boîte malveillantes, analyser les postes concernés.`,
          },
          {
            id: 'p2',
            texte: `Stopper la diffusion : conserver une copie du message comme preuve, le retirer de toutes les boîtes, bloquer le domaine expéditeur, les URL et les IP sur la passerelle, le proxy et le DNS.`,
          },
          {
            id: 'p5',
            texte: `Communiquer et clôturer : alerte aux agents, signalement des domaines aux registraires et hébergeurs, retour d'expérience et mise à jour des règles de filtrage.`,
          },
          {
            id: 'p1',
            texte: `Qualifier : analyser les en-têtes, l'URL et la pièce jointe en bac à sable, extraire les IoC (domaines, IP, empreinte de la pièce jointe).`,
          },
          {
            id: 'p3',
            texte: `Identifier les victimes : croiser les journaux de messagerie et du proxy pour lister qui a cliqué, ouvert la pièce jointe ou soumis un formulaire.`,
          },
        ],
        ordreCorrect: ['p1', 'p2', 'p3', 'p4', 'p5'],
        pointsMax: 5,
        feedback: `La qualification rapide fournit les IoC sans lesquels on ne peut ni purger ni bloquer efficacement. On stoppe ensuite la diffusion pour éviter de nouvelles victimes, puis on identifie précisément les personnes exposées afin de cibler la remédiation. La communication générale et le retour d'expérience viennent clore le traitement (une alerte courte peut toutefois partir très tôt si la purge tarde).`,
      },
      {
        type: 'choix',
        id: 'e4',
        question: `Quel message de sensibilisation envoyez-vous à l'ensemble des agents ?`,
        options: [
          {
            id: 'a',
            texte: `Un message qui reprend le lien malveillant en exemple pour que chacun puisse le reconnaître.`,
            points: 0,
            feedback: `C'est rediffuser l'attaque à tout le personnel : certains cliqueront. On décrit l'e-mail (expéditeur, objet), on ne republie jamais un lien actif.`,
          },
          {
            id: 'b',
            texte: `Le rappel générique habituel : « Soyez vigilants face aux e-mails suspects ».`,
            points: 1,
            feedback: `Trop vague pour être utile dans l'urgence : il ne dit ni quel message est concerné, ni quoi faire en cas de clic ou de saisie d'identifiants.`,
          },
          {
            id: 'c',
            texte: `Aucun message, pour ne pas affoler les agents en pleine campagne de recrutement.`,
            points: 0,
            feedback: `Le silence profite à l'attaquant : la campagne peut revenir avec un autre domaine et les victimes qui s'ignorent ne se signaleront pas.`,
          },
          {
            id: 'd',
            texte: `Un message court et factuel, par plusieurs canaux : description du faux e-mail (expéditeur, objet), rappel que les candidatures officielles passent uniquement par le site officiel de l'institution et que la DRH ne demande jamais d'identifiants, consigne de ne pas cliquer et de signaler, invitation à contacter le SOC sans crainte en cas de clic ou de saisie.`,
            points: 3,
            feedback: `C'est le bon format : concret, actionnable, non culpabilisant. Le rappel du canal officiel de recrutement neutralise le prétexte utilisé par l'attaquant.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: `Quelle mesure structurelle recommandez-vous au RSSI pour réduire le risque à l'avenir ?`,
        options: [
          {
            id: 'a',
            texte: `Bloquer tous les e-mails provenant de l'extérieur pendant la campagne de recrutement.`,
            points: 0,
            feedback: `Disproportionné : l'institution doit continuer à échanger avec ses partenaires et les candidats. La sécurité doit être compatible avec l'activité.`,
          },
          {
            id: 'b',
            texte: `Combiner MFA résistant à l'hameçonnage (clés FIDO2) pour la messagerie, DMARC en p=reject sur le domaine officiel, surveillance des domaines sosies, bannière « expéditeur externe », blocage des pièces jointes .html et .docm, et simulations régulières d'hameçonnage.`,
            points: 3,
            feedback: `Défense en profondeur : le MFA FIDO2 rend les identifiants volés inutilisables, DMARC p=reject empêche l'usurpation exacte du domaine officiel, et la surveillance des sosies couvre ce que DMARC ne couvre pas (comme ici). La sensibilisation régulière entretient le réflexe de signalement.`,
          },
          {
            id: 'c',
            texte: `Acheter tous les noms de domaine ressemblant à celui de l'institution.`,
            points: 1,
            feedback: `Utile pour les variantes les plus évidentes, mais les combinaisons possibles sont infinies (tirets, mots ajoutés, autres extensions). Cela ne remplace ni la surveillance ni l'authentification forte.`,
          },
          {
            id: 'd',
            texte: `Rendre l'antivirus des postes plus sensible.`,
            points: 1,
            feedback: `L'antivirus ne voit pas une page web de collecte d'identifiants : il n'y a aucun code malveillant à détecter quand l'utilisateur saisit lui-même son mot de passe.`,
          },
        ],
      },
    ],
    pointsMax: 19,
    debrief: `Démarche attendue : qualifier vite à partir des en-têtes, stopper la diffusion, identifier précisément les victimes, remédier, puis communiquer et capitaliser.
• Indicateurs clés : domaine sosie récent (bcc-rdc-carrieres.example), Reply-To divergent vers une messagerie gratuite, SPF=fail, DKIM=none, DMARC=fail, lien raccourci vers une fausse page de connexion, pièce jointe .html qui poste les identifiants vers 198.51.100.23, urgence et menace d'annulation.
• Piège n°1 : se contenter d'indices « humains » (ton, fautes) au lieu d'extraire des IoC exploitables pour le blocage et la recherche.
• Piège n°2 : croire qu'un changement de mot de passe suffit. Ici l'attaquant s'est déjà connecté en IMAP et a créé une règle de transfert : il faut révoquer les sessions et supprimer la persistance.
• Piège n°3 : purger les messages sans en garder une copie, ce qui détruit la preuve et les IoC.
• Le proxy montre l'intérêt des catégories « domaine récemment enregistré » : deux clics ont été bloqués automatiquement.
• Sensibilisation : décrire le message sans republier le lien, rappeler que les candidatures officielles ne passent que par le site officiel et que la DRH ne demande jamais d'identifiants, valoriser le signalement plutôt que sanctionner.
• DMARC en p=reject protège le domaine officiel contre l'usurpation exacte, pas contre les sosies : d'où la surveillance des domaines proches et le MFA résistant à l'hameçonnage (FIDO2).
Ce qu'attend un jury de banque centrale : de la méthode (NIST SP 800-61), des preuves conservées, une remédiation ciblée et une culture de sécurité qui encourage le signalement.
Réflexes à retenir : lire Authentication-Results, comparer From, Reply-To et Return-Path, croiser messagerie et proxy, révoquer les sessions et inspecter les règles de boîte.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CYB-CAS-03 — Ransomware sur un poste de la direction des opérations
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'CYB-CAS-03',
    filiere: 'cyber',
    titre: `Ransomware sur un poste de la direction des opérations`,
    role: `Analyste réponse aux incidents — CSIRT interne`,
    heure: `Jeudi 07h40 — ouverture des opérations`,
    enjeu: `Stopper la propagation d'un rançongiciel et restaurer le partage des opérations dans les objectifs du plan de reprise, sans perdre les preuves.`,
    contexte: `Jeudi 22 octobre, 07h40. Un agent de la direction des opérations appelle le support : l'écran de son poste OPS-PC-117 (10.20.4.117) affiche une note de rançon et ses fichiers portent l'extension .lckd. Le poste est toujours allumé et connecté au réseau. L'EDR a levé une série d'alertes depuis 07h12 et plusieurs dossiers du serveur de fichiers FS-OPS01 (10.20.1.15) sont déjà renommés. Le plan de continuité fixe pour FS-OPS01 un RPO de 4 heures et un RTO de 8 heures, mesuré à partir de la déclaration de l'incident (07h40). L'équipe d'infrastructure estime la restauration à 3h30 (complète + incrémentale), suivies de 1h30 de contrôles d'intégrité et antivirus et de 45 minutes de remise en service ; elle ne pourra démarrer qu'à 09h30, une fois l'environnement de restauration assaini. Le directeur des opérations vous demande quoi faire, tout de suite.`,
    piecesJointes: [
      {
        type: 'logs',
        titre: `Console EDR — alertes du 22/10/2026 (extrait)`,
        lignes: [
          `2026-10-22T07:06:51+01:00 [EDR] sev=MEDIUM host=OPS-PC-117 ip=10.20.4.117 user=OPS\\agent.ops07 event=FILE_OPEN file="Releve_Commissions_Oct.docm" source=outlook.exe`,
          `2026-10-22T07:07:03+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 rule=OFFICE_SPAWNS_SHELL parent=WINWORD.EXE child=powershell.exe cmdline="powershell -nop -w hidden -enc JABwAD0AJwBoAHQAdABwAHMA[...]"`,
          `2026-10-22T07:07:09+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 event=NET_CONNECT process=powershell.exe dst=198.51.100.77:443 sni=cdn-update.example`,
          `2026-10-22T07:07:15+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 event=FILE_WRITE file="C:\\Users\\Public\\svchost32.exe" sha256=4f2a9c1e[...]b71d`,
          `2026-10-22T07:08:02+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 rule=PERSISTENCE_RUNKEY key="HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Updater" value="C:\\Users\\Public\\svchost32.exe"`,
          `2026-10-22T07:10:44+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 rule=DISCOVERY_NET_SHARES cmdline="net view \\\\FS-OPS01"`,
          `2026-10-22T07:11:58+01:00 [EDR] sev=CRITICAL host=OPS-PC-117 ip=10.20.4.117 rule=SHADOW_COPY_DELETION cmdline="vssadmin delete shadows /all /quiet"`,
          `2026-10-22T07:12:20+01:00 [EDR] sev=CRITICAL host=OPS-PC-117 ip=10.20.4.117 rule=MASS_FILE_RENAME count=1 240 ext=.lckd path="C:\\Users\\agent.ops07\\Documents"`,
          `2026-10-22T07:14:37+01:00 [EDR] sev=CRITICAL host=FS-OPS01 ip=10.20.1.15 rule=RANSOM_BEHAVIOR_SMB src=10.20.4.117 share="\\\\FS-OPS01\\Operations" files_modified=3 870`,
          `2026-10-22T07:21:05+01:00 [EDR] sev=CRITICAL host=FS-OPS01 ip=10.20.1.15 rule=RANSOM_BEHAVIOR_SMB src=10.20.4.117 share="\\\\NAS-BKP01\\Copies" files_modified=2 115`,
          `2026-10-22T07:26:40+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 event=NET_CONNECT process=svchost32.exe dst=198.51.100.77:443 bytes_out=412 MB`,
          `2026-10-22T07:31:12+01:00 [EDR] sev=MEDIUM host=OPS-PC-122 ip=10.20.4.122 event=AUTH_ATTEMPT src=10.20.4.117 user=OPS\\agent.ops07 protocol=SMB result=FAILURE`,
          `2026-10-22T07:38:55+01:00 [EDR] sev=HIGH host=OPS-PC-117 ip=10.20.4.117 event=FILE_WRITE file="LISEZMOI_lckd.txt" count=212`,
          `2026-10-22T07:40:02+01:00 [EDR] status: OPS-PC-117 en ligne, isolation réseau NON appliquée ; processus svchost32.exe toujours actif (PID 6620)`,
        ],
      },
      {
        type: 'texte',
        titre: `Note de rançon fictive — LISEZMOI_lckd.txt`,
        contenu: `--- VOS FICHIERS SONT CHIFFRÉS ---

Tous les documents de votre réseau ont été chiffrés avec un algorithme robuste.
Nous avons également copié 400 Mo de vos données internes.

Si vous ne nous contactez pas sous 72 heures :
- la clé de déchiffrement sera détruite ;
- vos données seront publiées.

N'essayez pas de restaurer vos fichiers vous-mêmes, vous les perdriez définitivement.
N'éteignez pas vos ordinateurs.

Identifiant victime : 7F3A-OPS-117
Contact : via l'adresse indiquée sur notre portail (le lien vous sera communiqué après prise de contact).

[Document entièrement fictif, créé pour l'exercice]`,
      },
      {
        type: 'table',
        titre: `Inventaire des sauvegardes de FS-OPS01 (état constaté à 07h50)`,
        colonnes: ['Sauvegarde', 'Support', 'Dernière exécution', 'Isolation', 'Dernier test de restauration', 'État constaté'],
        lignes: [
          ['Instantanés VSS', 'Disque local de FS-OPS01', '22/10 06h00', 'En ligne (même serveur)', 'Non testé', 'Supprimés (vssadmin)'],
          ['Copie quotidienne', 'NAS-BKP01 monté en SMB', '22/10 06h00', 'En ligne, accessible depuis le réseau', '12/09 — OK', 'Chiffrée (.lckd)'],
          ['Incrémentale quotidienne', 'Coffre de sauvegarde immuable, isolé du domaine', '22/10 02h00', 'Isolée, rétention verrouillée 30 jours', '08/10 — OK', 'Intègre (empreintes vérifiées)'],
          ['Complète hebdomadaire', 'Bandes LTO conservées hors site', '18/10 23h00', 'Hors ligne', '04/10 — OK', 'Intègre'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: `Quel est votre tout premier geste sur OPS-PC-117 ?`,
        options: [
          {
            id: 'a',
            texte: `Éteindre immédiatement le poste en coupant l'alimentation.`,
            points: 1,
            feedback: `Cela stoppe le chiffrement local, mais détruit la mémoire vive : processus actifs, connexions, et parfois des clés ou artefacts utiles à l'enquête et au déchiffrement. On ne l'envisage qu'en dernier recours si l'isolation est impossible.`,
          },
          {
            id: 'b',
            texte: `Lancer une analyse antivirus complète sur le poste, toujours connecté au réseau.`,
            points: 0,
            feedback: `Pendant l'analyse, le rançongiciel continue de chiffrer FS-OPS01 et tente déjà de rebondir sur OPS-PC-122. L'analyse modifie en outre de nombreux horodatages utiles à l'enquête.`,
          },
          {
            id: 'c',
            texte: `Reformater le poste et réinstaller Windows pour repartir sur une base saine.`,
            points: 0,
            feedback: `C'est détruire toutes les preuves avant même d'avoir compris le vecteur et l'étendue de l'attaque. La reconstruction viendra plus tard, à l'étape d'éradication.`,
          },
          {
            id: 'd',
            texte: `Isoler le poste du réseau sans l'éteindre (isolation réseau via l'EDR, ou à défaut débrancher le câble et couper le Wi-Fi), suspendre le compte agent.ops07 et couper ses accès aux partages.`,
            points: 4,
            feedback: `Exact. L'isolation stoppe la propagation et l'exfiltration vers 198.51.100.77 tout en préservant la mémoire vive pour l'analyse. Suspendre le compte bloque les tentatives de rebond déjà visibles (OPS-PC-122).`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: `Le poste est isolé. Comment préservez-vous les preuves ?`,
        options: [
          {
            id: 'a',
            texte: `Copier la note de rançon sur une clé USB, puis redémarrer le poste pour vérifier si le chiffrement continue.`,
            points: 0,
            feedback: `Le redémarrage efface la mémoire vive et peut relancer la charge malveillante via la clé Run. La clé USB non maîtrisée introduit en plus un risque de contamination.`,
          },
          {
            id: 'b',
            texte: `Capturer la mémoire vive, puis réaliser une image disque forensique avec calcul d'empreintes, exporter les journaux EDR, Active Directory, proxy et pare-feu, conserver la note et un échantillon de fichier chiffré, et documenter la chaîne de traçabilité (qui, quoi, quand).`,
            points: 3,
            feedback: `C'est la démarche attendue, dans l'ordre de volatilité : la mémoire d'abord, le disque ensuite. Les empreintes et la chaîne de traçabilité rendent les preuves exploitables, y compris en cas de dépôt de plainte.`,
          },
          {
            id: 'c',
            texte: `Prendre des photos de l'écran avec un smartphone.`,
            points: 1,
            feedback: `Cela documente la note de rançon, mais ne préserve aucune donnée technique (mémoire, disque, journaux) indispensable pour comprendre l'attaque.`,
          },
          {
            id: 'd',
            texte: `Supprimer d'abord svchost32.exe pour éviter toute propagation, puis documenter ce qui reste.`,
            points: 0,
            feedback: `Le poste étant isolé, il n'y a plus d'urgence à supprimer le binaire. Le supprimer maintenant détruit une preuve essentielle (échantillon, empreinte, configuration).`,
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: `Ordonnez les grandes étapes de la réponse à l'incident.`,
        elements: [
          {
            id: 'r5',
            texte: `Restaurer FS-OPS01 depuis les sauvegardes hors ligne ou immuables dont l'intégrité a été vérifiée, dans un environnement assaini, puis surveiller de près.`,
          },
          {
            id: 'r2',
            texte: `Évaluer la propagation : rechercher les IoC (empreinte, 198.51.100.77, extension .lckd, connexions SMB depuis 10.20.4.117) sur tout le parc, isoler FS-OPS01 et NAS-BKP01.`,
          },
          {
            id: 'r6',
            texte: `Retour d'expérience : chronologie, cause racine (macro .docm), mise à jour du PCA/PRA, notifications prévues par les procédures.`,
          },
          {
            id: 'r1',
            texte: `Isoler OPS-PC-117 sans l'éteindre et suspendre le compte agent.ops07.`,
          },
          {
            id: 'r4',
            texte: `Éradiquer : supprimer la persistance, réinitialiser les identifiants compromis (y compris les comptes à privilèges), bloquer les macros d'origine externe, reconstruire les systèmes atteints.`,
          },
          {
            id: 'r3',
            texte: `Préserver les preuves : mémoire vive, images disques, journaux, chaîne de traçabilité.`,
          },
        ],
        ordreCorrect: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
        pointsMax: 5,
        feedback: `On isole d'abord la source pour arrêter l'hémorragie, puis on mesure l'étendue réelle (ici FS-OPS01, NAS-BKP01 et une tentative sur OPS-PC-122) avant de collecter les preuves sur tous les systèmes concernés. L'éradication précède impérativement la restauration : restaurer dans un environnement encore compromis, c'est se faire chiffrer une seconde fois. Le retour d'expérience clôt le cycle.`,
      },
      {
        type: 'choix',
        id: 'e4',
        question: `Le directeur des opérations demande s'il faut payer la rançon. Quelle est votre position ?`,
        options: [
          {
            id: 'a',
            texte: `Recommander de ne pas payer : aucune garantie de déchiffrement ni de non-publication des données, financement d'activités criminelles, risques juridiques et risque d'être ciblé à nouveau. Rappeler que la décision relève de la gouvernance (direction générale, cellule de crise, juridique), et qu'une restauration est possible depuis des sauvegardes intègres.`,
            points: 3,
            feedback: `C'est la position professionnelle : l'analyste éclaire la décision sans la prendre seul, et il montre qu'une alternative technique existe. L'exfiltration (412 Mo vers 198.51.100.77) doit aussi être traitée comme une possible violation de données.`,
          },
          {
            id: 'b',
            texte: `Payer rapidement : c'est le moyen le plus sûr de récupérer les fichiers avant le délai de 72 heures.`,
            points: 0,
            feedback: `Rien ne garantit l'obtention ni le bon fonctionnement de la clé, ni la destruction des données volées. Le paiement finance l'attaquant et désigne l'organisation comme cible solvable.`,
          },
          {
            id: 'c',
            texte: `Prendre vous-même contact avec l'attaquant pour négocier et gagner du temps.`,
            points: 0,
            feedback: `Un analyste n'a ni le mandat ni le cadre pour négocier. Tout contact relève d'une décision de gouvernance, encadrée par le juridique et, le cas échéant, par les autorités compétentes.`,
          },
          {
            id: 'd',
            texte: `Ne pas payer, et ne pas en informer la direction générale pour éviter la panique.`,
            points: 1,
            feedback: `Ne pas payer est la bonne orientation, mais dissimuler l'incident à la gouvernance est une faute grave : la direction doit décider, communiquer et assumer les obligations de notification.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: `Activation du PRA pour FS-OPS01 (RPO 4 h, RTO 8 h à compter de 07h40, chiffrement débuté à 07h12). Quelle analyse est exacte ?`,
        options: [
          {
            id: 'a',
            texte: `Restaurer la copie NAS de 06h00 : la perte de données n'est que de 1h12, le RPO est respecté.`,
            points: 0,
            feedback: `La copie NAS-BKP01 est montée en SMB et a été chiffrée (alerte de 07h21) : elle est inutilisable. Une sauvegarde accessible en ligne depuis le réseau n'est pas une sauvegarde de dernier recours.`,
          },
          {
            id: 'b',
            texte: `Restaurer uniquement les bandes du 18/10 23h00 : ce sont les plus sûres, et le RPO est respecté.`,
            points: 1,
            feedback: `Les bandes sont fiables, mais s'arrêter à elles fait perdre plus de trois jours de données (18/10 23h00 → 22/10 07h12), ce qui viole largement le RPO alors que l'incrémentale immuable de 02h00 est intègre.`,
          },
          {
            id: 'c',
            texte: `Restaurer la complète du 18/10 puis l'incrémentale immuable de 02h00 : la perte est de 5h12 (02h00 → 07h12), supérieure au RPO de 4 h ; l'écart doit être déclaré et les opérations de 02h00 à 07h12 reconstituées depuis les systèmes sources. Fin estimée : 09h30 + 3h30 + 1h30 + 0h45 = 15h15, avant l'échéance du RTO (07h40 + 8 h = 15h40), soit 25 minutes de marge.`,
            points: 5,
            feedback: `Exact sur toute la ligne : bonne chaîne de sauvegardes, calcul juste de la perte (5h12) et du délai de reprise (15h15 contre 15h40). Reconnaître honnêtement le non-respect du RPO et proposer une compensation est exactement ce qu'on attend.`,
          },
          {
            id: 'd',
            texte: `Restaurer l'incrémentale de 02h00 : la perte de 5h12 est acceptable car elle reste inférieure au RTO de 8 h.`,
            points: 2,
            feedback: `Le choix de la sauvegarde est pertinent, mais le raisonnement confond RPO et RTO. Le RPO (4 h) borne la perte de données ; le RTO (8 h) borne la durée d'indisponibilité. Avec 5h12 de perte, le RPO n'est pas respecté.`,
          },
        ],
      },
    ],
    pointsMax: 20,
    debrief: `Démarche attendue : contenir d'abord (isoler sans éteindre), mesurer la propagation, préserver les preuves, éradiquer, restaurer depuis des sauvegardes intègres, puis tirer les leçons (NIST SP 800-61).
• Chronologie lue dans l'EDR : ouverture d'un .docm reçu par messagerie (07h06), PowerShell lancé par Word, connexion vers 198.51.100.77, dépôt d'un binaire et persistance par clé Run, découverte des partages, suppression des instantanés VSS (07h11), chiffrement local puis via SMB de FS-OPS01 et NAS-BKP01, exfiltration d'environ 412 Mo (double extorsion).
• Premier geste : isoler sans éteindre, pour arrêter la propagation tout en conservant la mémoire vive. L'arrêt brutal n'est qu'un dernier recours si l'isolation est impossible.
• Preuves : respecter l'ordre de volatilité (RFC 3227), calculer des empreintes et tenir une chaîne de traçabilité.
• Piège n°1 : restaurer avant d'avoir éradiqué, et se faire chiffrer à nouveau.
• Piège n°2 : compter sur des sauvegardes en ligne. Les instantanés et la copie NAS ont été détruits ; seules l'incrémentale immuable et les bandes hors site sont intègres. C'est la logique de la règle 3-2-1-1-0 (une copie hors ligne ou immuable, zéro erreur aux tests de restauration).
• Piège n°3 : confondre RPO (perte de données admissible) et RTO (durée d'interruption admissible). Ici la perte de 5h12 dépasse le RPO de 4 h, alors que la reprise prévue à 15h15 respecte le RTO (échéance 15h40).
• Rançon : déconseiller le paiement, rappeler que la décision appartient à la gouvernance, et traiter l'exfiltration comme une possible violation de données.
Ce qu'attend un jury de banque centrale : du sang-froid, une méthode, des calculs justes, la transparence sur les écarts aux objectifs de continuité et le respect des circuits de décision.
Réflexes à retenir : isoler, ne pas éteindre, préserver, vérifier les sauvegardes avant d'y croire, et tester régulièrement les restaurations.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CYB-CAS-04 — Audit PCI-DSS d'un participant au Switch
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'CYB-CAS-04',
    filiere: 'cyber',
    titre: `Audit PCI-DSS d'un participant au Switch`,
    role: `Auditeur sécurité des SI — Mission de contrôle des participants au Switch monétique`,
    heure: `Mardi 14h30 — réunion de restitution de l'audit`,
    enjeu: `Hiérarchiser les écarts d'audit d'un participant et obtenir un plan de remédiation crédible qui protège les données des porteurs de cartes.`,
    contexte: `Scénario fictif. Vous terminez l'audit de sécurité monétique de Banque Beta, participante au Switch national de paiement par carte. L'équipe a relevé huit écarts par rapport à la norme PCI-DSS v4.0 sur l'environnement des données de titulaires de cartes (CDE). Dans une heure, vous présentez vos conclusions au directeur des systèmes d'information et au responsable de la sécurité de Banque Beta, qui vous demandent par où commencer. Le DSI fait valoir que « tout ne peut pas être corrigé en même temps » et que le budget est limité. Vous devez hiérarchiser, proposer un plan réaliste et rappeler le cadre de conformité.`,
    piecesJointes: [
      {
        type: 'table',
        titre: `Rapport d'audit — Banque Beta : écarts relevés (référentiel PCI-DSS v4.0)`,
        colonnes: ['N°', 'Constat', 'Périmètre', 'Exigence concernée'],
        lignes: [
          [1, `Le code de vérification de la carte (CVV2) est conservé dans la table TRANSACTIONS_EPI après autorisation (environ 18 000 enregistrements)`, 'Base de données monétique', '3.3.1 (3.3.1.2)'],
          [2, `PAN complets en clair dans les journaux applicatifs du serveur d'autorisation, consultables par 35 agents du support`, "Serveur d'autorisation", '3.4.1 / 3.5.1'],
          [3, `Mots de passe par défaut du fabricant sur le menu de maintenance de 120 TPE`, 'Parc de TPE', '2.2.2'],
          [4, `Aucune segmentation : le CDE partage le même réseau que la bureautique (10.50.0.0/16)`, 'Réseau', '1.2 / 1.3'],
          [5, `Accès administrateur distant au CDE par VPN avec mot de passe seul, sans MFA`, 'Accès à privilèges', '8.4.1 / 8.4.3'],
          [6, `Scans de vulnérabilités internes et externes (ASV) non réalisés depuis trois trimestres`, 'Gestion des vulnérabilités', '11.3.1 / 11.3.2'],
          [7, `Journalisation incomplète : accès aux données de titulaires non tracés sur la base monétique, revue des journaux non effectuée`, 'Journalisation', '10.2.1 / 10.4.1'],
          [8, `Politique de sécurité de l'information non revue depuis 2023`, 'Gouvernance', '12.1.2'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: `Quel écart est le plus critique et pourquoi ?`,
        options: [
          {
            id: 'a',
            texte: `L'écart n°1 : le CVV2 fait partie des données sensibles d'authentification, dont le stockage après autorisation est interdit, même chiffré. Sa compromission permettrait directement la fraude en paiement à distance.`,
            points: 4,
            feedback: `Exact. C'est une interdiction absolue de la norme, et non une simple exigence de protection. Avec le PAN, le CVV2 suffit à frauder en vente à distance : c'est l'écart qui crée le risque de fraude le plus direct et le plus massif.`,
          },
          {
            id: 'b',
            texte: `L'écart n°5 : l'absence de MFA sur l'accès administrateur est la porte d'entrée de la plupart des attaques.`,
            points: 2,
            feedback: `C'est un écart grave, à corriger rapidement, car il facilite l'intrusion. Mais il s'agit d'un risque d'accès, alors que l'écart n°1 constitue une violation déjà réalisée de l'interdiction de stocker des données sensibles d'authentification.`,
          },
          {
            id: 'c',
            texte: `L'écart n°8 : sans politique à jour, aucun autre contrôle n'a de valeur.`,
            points: 0,
            feedback: `La gouvernance est importante, mais une politique non revue n'expose aucune donnée par elle-même. Commencer par la documentation pendant que des CVV dorment dans une base serait une erreur de priorisation.`,
          },
          {
            id: 'd',
            texte: `L'écart n°6 : sans scans, on ignore toutes les vulnérabilités du système.`,
            points: 1,
            feedback: `L'absence de scans est sérieuse (contrôle de détection défaillant), mais il s'agit d'un manque de visibilité sur un risque potentiel, pas d'une exposition de données déjà avérée.`,
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e2',
        question: `Classez ces cinq écarts du plus critique au moins critique.`,
        elements: [
          { id: 'k4', texte: `Écart n°6 — Scans de vulnérabilités internes et ASV non réalisés depuis trois trimestres` },
          { id: 'k2', texte: `Écart n°2 — PAN complets en clair dans les journaux, consultables par 35 agents` },
          { id: 'k5', texte: `Écart n°8 — Politique de sécurité non revue depuis 2023` },
          { id: 'k1', texte: `Écart n°1 — CVV2 conservé après autorisation` },
          { id: 'k3', texte: `Écart n°4 — Absence de segmentation entre le CDE et la bureautique` },
        ],
        ordreCorrect: ['k1', 'k2', 'k3', 'k4', 'k5'],
        pointsMax: 5,
        feedback: `On classe d'abord les expositions de données déjà avérées : les données sensibles d'authentification (interdites), puis les PAN lisibles par de nombreuses personnes. Viennent ensuite les faiblesses d'architecture qui élargissent la surface d'attaque (absence de segmentation), puis les contrôles de détection défaillants (scans), et enfin les écarts documentaires de gouvernance, qui restent à corriger mais n'exposent pas directement de données.`,
      },
      {
        type: 'choix',
        id: 'e3',
        question: `Le DSI demande un plan de remédiation réaliste. Que proposez-vous ?`,
        options: [
          {
            id: 'a',
            texte: `Traiter les écarts dans l'ordre du rapport, à raison d'un écart par mois.`,
            points: 0,
            feedback: `L'ordre du rapport n'est pas un ordre de risque, et huit mois d'exposition pour certains écarts (CVV, PAN en clair, MFA) sont inacceptables. Un plan se priorise par le risque.`,
          },
          {
            id: 'b',
            texte: `Commencer par réécrire et faire signer la politique de sécurité, qui servira de base au reste.`,
            points: 1,
            feedback: `La politique doit être revue, mais pas avant de stopper les expositions de données. On peut mener la revue documentaire en parallèle, sans retarder les actions techniques urgentes.`,
          },
          {
            id: 'c',
            texte: `Actions immédiates (quelques jours) : purger de façon sécurisée les CVV2, y compris dans les sauvegardes, et corriger le code qui les écrit ; arrêter la journalisation des PAN en clair (masquage) et purger les journaux ; changer les mots de passe par défaut des TPE ; imposer le MFA sur les accès administrateurs. Court terme (semaines à quelques mois) : segmenter le CDE, réaliser les scans internes et ASV puis corriger, compléter et revoir la journalisation, réviser la politique. Chaque action avec un responsable, une échéance et une preuve de clôture.`,
            points: 4,
            feedback: `C'est un plan crédible : il distingue ce qui supprime une exposition immédiate de ce qui demande un projet, et il rend chaque action traçable et vérifiable. Les mesures immédiates coûtent peu et réduisent fortement le risque.`,
          },
          {
            id: 'd',
            texte: `Chiffrer la base contenant les CVV2, ce qui règle l'écart n°1, puis traiter le reste l'an prochain.`,
            points: 1,
            feedback: `Le chiffrement ne régularise pas l'écart : le stockage des données sensibles d'authentification après autorisation est interdit, chiffré ou non. Il faut les supprimer. Reporter le reste d'un an est par ailleurs inacceptable pour le PAN en clair et le MFA.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e4',
        question: `Quelle mesure recommandez-vous pour réduire durablement le périmètre soumis à PCI-DSS ?`,
        options: [
          {
            id: 'a',
            texte: `Masquer le PAN à l'affichage (6 premiers et 4 derniers chiffres au maximum) dans les applications du support.`,
            points: 1,
            feedback: `Le masquage à l'affichage est une exigence (3.4.1) et protège contre la lecture par les agents, mais le PAN reste stocké en clair derrière : le périmètre n'est pas réduit.`,
          },
          {
            id: 'b',
            texte: `Tokeniser le PAN dans tous les systèmes qui n'ont pas besoin du numéro réel (support, CRM, reporting) et isoler le CDE dans une zone dédiée avec un filtrage strict, puis valider la segmentation par des tests d'intrusion réguliers.`,
            points: 4,
            feedback: `Exact. La tokenisation retire les données de titulaires de nombreux systèmes et la segmentation sépare le CDE du reste du réseau : moins de systèmes en périmètre, donc moins de surface d'attaque et un coût de conformité réduit. La segmentation doit être prouvée par des tests.`,
          },
          {
            id: 'c',
            texte: `Migrer la base monétique chez un fournisseur cloud certifié, qui devient alors responsable de toute la conformité.`,
            points: 0,
            feedback: `Faux : la responsabilité est partagée. Le fournisseur couvre sa part (infrastructure), mais Banque Beta reste responsable de ses applications, de ses accès et de ses données. Une migration ne règle aucun écart par elle-même.`,
          },
          {
            id: 'd',
            texte: `Activer le chiffrement des disques du serveur de base de données.`,
            points: 1,
            feedback: `Le chiffrement de disque protège contre le vol physique du support, mais il est transparent pour l'application et pour un attaquant connecté. PCI-DSS v4.0 ne l'accepte plus seul pour rendre le PAN illisible (sauf sur supports amovibles), et il ne réduit pas le périmètre.`,
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: `Le DSI estime que PCI-DSS est « une affaire des réseaux internationaux de cartes ». Que lui répondez-vous ?`,
        options: [
          {
            id: 'a',
            texte: `Il a raison : PCI-DSS est une norme privée qui ne concerne pas un participant au Switch national.`,
            points: 0,
            feedback: `Faux : pour les participants au Switch, la conformité PCI-DSS et EMV n'est pas une simple recommandation, elle est imposée par le cadre réglementaire.`,
          },
          {
            id: 'b',
            texte: `Seule la norme EMV (cartes à puce) est obligatoire ; PCI-DSS n'est qu'une bonne pratique recommandée.`,
            points: 1,
            feedback: `L'obligation EMV est bien réelle, mais PCI-DSS est imposée elle aussi aux participants : les deux normes sont complémentaires (sécurité de la carte et de la transaction d'un côté, protection des données de titulaires de l'autre).`,
          },
          {
            id: 'c',
            texte: `La conformité est acquise une fois l'audit passé ; il suffira de la revoir dans cinq ans.`,
            points: 0,
            feedback: `La conformité PCI-DSS est un état à maintenir en continu, avec une évaluation au moins annuelle et des contrôles périodiques (scans trimestriels, revues de journaux, tests de segmentation).`,
          },
          {
            id: 'd',
            texte: `Pour un participant au Switch, la conformité n'est pas facultative : l'Instruction n°58 de la BCC impose les normes EMV et PCI-DSS. Les écarts doivent donc faire l'objet d'un plan d'action formalisé, daté, avec des responsables désignés et des preuves de remédiation, suivi jusqu'à sa clôture.`,
            points: 3,
            feedback: `C'est la bonne réponse : elle rappelle le fondement réglementaire et le traduit en exigence concrète de pilotage. La conformité protège à la fois les porteurs de cartes, le participant et la confiance dans tout le Switch.`,
          },
        ],
      },
    ],
    pointsMax: 20,
    debrief: `Démarche attendue : hiérarchiser les écarts par le risque réel (exposition de données avérée, puis surface d'attaque, puis détection, puis gouvernance), proposer un plan en deux temps et rappeler le cadre de conformité.
• Écart le plus critique : le stockage du CVV2 après autorisation. Les données sensibles d'authentification (piste magnétique complète, CVV2, PIN ou bloc PIN) ne doivent jamais être conservées après autorisation, même chiffrées (exigence 3.3.1 de PCI-DSS v4.0). Il faut les purger, y compris dans les sauvegardes, et corriger la cause.
• Le PAN en clair dans les journaux est une exposition avérée : masquer, rendre illisible (3.5.1) et purger.
• Mots de passe par défaut des TPE et absence de MFA : corrections rapides et peu coûteuses, à traiter immédiatement.
• Piège n°1 : croire que chiffrer suffit. C'est faux pour les données sensibles d'authentification, et le seul chiffrement de disque n'est plus accepté pour rendre le PAN illisible (hors supports amovibles).
• Piège n°2 : croire qu'un fournisseur cloud reprend la conformité à son compte. La responsabilité est partagée.
• Réduction du périmètre : tokenisation et segmentation testée, qui réduisent à la fois le risque et le coût de conformité.
• Cadre : l'Instruction n°58 de la BCC impose les normes EMV et PCI-DSS aux participants au Switch ; la conformité est un processus continu, pas un examen ponctuel.
Ce qu'attend un jury de banque centrale : une lecture par le risque, la maîtrise des exigences clés de PCI-DSS v4.0, un plan réaliste et vérifiable, et la capacité à expliquer la conformité à un DSI sous contrainte budgétaire.
Réflexes à retenir : ne jamais stocker les données sensibles d'authentification, minimiser les données (ne garder que ce qui est nécessaire), réduire le périmètre, prouver chaque remédiation.`,
  },
];

// ===========================================================================
// EXPORTS
// ===========================================================================

export const casPratiques: CasPratique[] = [...casData, ...casCyber];

const index = new Map(casPratiques.map((c) => [c.id, c]));

/** Retrouve un cas par son id. */
export function casParId(id: string): CasPratique | undefined {
  return index.get(id);
}
