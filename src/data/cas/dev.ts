// Cas pratiques — filière Développement logiciel (préfixe DEV).
// Scénarios fictifs (Banque Alpha, Banque Beta, domaines .example) ; tout le code et toutes les sorties
// affichés ont été exécutés (python3 / node) lors de la rédaction.

import type { CasPratique } from '@/lib/types';

export const casDev: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // DEV-CAS-01 — Les centimes qui manquent au rapprochement des intérêts
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DEV-CAS-01',
    filiere: 'dev',
    titre: 'Les centimes qui manquent au rapprochement des intérêts',
    role: 'Développeur back-end — équipe Épargne & Change, Banque Alpha',
    heure: 'Lundi 08h50 — J-2 avant la clôture mensuelle',
    enjeu:
      'Expliquer et corriger les écarts d’un centime entre le module d’intérêts et la comptabilité avant la clôture, sans créer de nouvel écart ni corriger les comptes en silence.',
    contexte:
      'Mme Kabeya, responsable du contrôle comptable, t’appelle : « Ton module d’épargne et ma comptabilité ne tombent pas d’accord, il me manque des centimes sur plusieurs comptes. » Le module, écrit en Python il y a trois ans, calcule chaque mois les intérêts créditeurs (taux fictif de 0,25 % par mois sur le solde moyen) et convertit des montants de CDF en USD (cours fictif d’exercice : 1 USD = 2 800 CDF). La comptabilité recalcule avec la règle de la note de procédure interne : arrondi au centime le plus proche, demi-centime arrondi au supérieur. Sur l’échantillon contrôlé, chaque écart vaut exactement un centime et joue toujours en défaveur du client. Un centime paraît dérisoire, mais il est répété sur des dizaines de milliers de comptes et chaque mois, et une banque doit pouvoir justifier chaque écriture. La clôture mensuelle a lieu mercredi.',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'epargne/calculs.py — extrait du module en production',
        contenu: `# epargne/calculs.py (extrait) — module Épargne, Banque Alpha (fictif)
TAUX_MENSUEL = 0.0025   # 0,25 % par mois (taux fictif d'exercice)
COURS_USD = 2800.0      # 1 USD = 2 800 CDF (cours fictif d'exercice)

def interets_du_mois(solde_moyen: float) -> float:
    """Intérêts créditeurs du mois, arrondis au centime."""
    return round(solde_moyen * TAUX_MENSUEL, 2)

def cdf_vers_usd(montant_cdf: float) -> float:
    """Conversion CDF -> USD au cours du jour, arrondie au centime."""
    return round(montant_cdf / COURS_USD, 2)`,
      },
      {
        type: 'table',
        titre: 'Rapprochement des intérêts d’octobre — échantillon de la comptabilité (données fictives)',
        colonnes: ['Compte', 'Solde moyen (CDF)', 'Intérêts module (CDF)', 'Intérêts attendus (CDF)', 'Écart'],
        lignes: [
          ['EP-100231', '1 070,00', '2,68', '2,68', '0,00'],
          ['EP-100877', '182 450,00', '456,12', '456,13', '−0,01'],
          ['EP-101342', '87 650,00', '219,12', '219,13', '−0,01'],
          ['EP-102019', '2 418 300,00', '6 045,75', '6 045,75', '0,00'],
          ['EP-102506', '3 201 530,00', '8 003,82', '8 003,83', '−0,01'],
          ['EP-103118', '12 345 670,00', '30 864,17', '30 864,18', '−0,01'],
        ],
      },
      {
        type: 'texte',
        titre: 'Ta session Python de diagnostic (sorties réelles)',
        contenu: `>>> interets_du_mois(3201530)
8003.82
>>> 3201530 * 0.0025
8003.825
>>> from decimal import Decimal
>>> Decimal(3201530 * 0.0025)
Decimal('8003.8249999999998181010596454143524169921875')
>>> 182450 * 0.0025
456.125
>>> round(0.125, 2)
0.12
>>> cdf_vers_usd(350)
0.12
>>> cdf_vers_usd(7014)
2.5`,
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle est la cause racine des écarts d’un centime ?',
        options: [
          {
            id: 'a',
            texte: 'Le taux de 0,25 % est mal saisi dans le code : la constante sous-estime légèrement les intérêts à chaque calcul, il faudrait `0.00250001` pour compenser l’écart.',
            points: 0,
            feedback:
              'Le taux est correct : les comptes EP-100231 et EP-102019 tombent juste. Bricoler une constante pour « compenser » déplacerait les écarts sur d’autres comptes et rendrait le calcul impossible à justifier devant un auditeur.',
          },
          {
            id: 'b',
            texte: 'La base de données tronque les montants à deux décimales au moment de l’enregistrement au lieu de les arrondir : la colonne a été créée avec un type inadapté.',
            points: 0,
            feedback:
              'La session Python montre que l’écart existe avant tout enregistrement : `interets_du_mois(3201530)` renvoie déjà 8003.82. Le problème est dans le calcul, pas dans le stockage.',
          },
          {
            id: 'c',
            texte:
              'Le calcul en `float` binaire, inexact pour la plupart des décimaux, puis `round()`, qui départage les demi-centimes au chiffre pair : ils partent parfois vers le bas.',
            points: 4,
            feedback:
              'Exact, et il y a deux mécanismes. 8003.825 est stocké comme 8003.82499999… : `round()` arrondit donc vers le bas. 456.125 (= 456 + 1/8) est représentable exactement, mais `round()` applique l’arrondi au pair (« arrondi bancaire ») et donne 456.12. Dans les deux cas, on s’écarte de la règle « demi-centime au supérieur ». L’affichage `8003.825` est trompeur : Python montre la représentation décimale la plus courte, pas la valeur réelle.',
          },
          {
            id: 'd',
            texte: 'Python a un bug d’arrondi connu dans `round()` sur les anciennes versions : il suffit de mettre à jour l’interpréteur du serveur pour que les demi-centimes soient justes.',
            points: 1,
            feedback:
              'Tu as bien vu que `round()` est en cause, mais ce n’est pas un bug : son comportement (valeur binaire, arrondi au pair) est documenté et identique dans toutes les versions récentes. Une mise à jour ne changera rien ; c’est le choix du type numérique qui est inadapté à la monnaie.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Quel correctif proposes-tu pour les deux fonctions ?',
        options: [
          {
            id: 'a',
            texte:
              'Passer en `Decimal` créé depuis des chaînes (`Decimal("0.0025")`, montants lus en texte) et arrondir une seule fois par `quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)`.',
            points: 4,
            feedback:
              'C’est la bonne pratique pour la monnaie : `Decimal` calcule en base 10, exactement comme la comptabilité, et le mode d’arrondi est explicite et conforme à la note de procédure. Vérifié : 3 201 530 → 8003.83, 182 450 → 456.13, 350 CDF → 0.13 USD, 7 014 CDF → 2.51 USD. Les colonnes de la base doivent aussi être en `NUMERIC`/`DECIMAL`, jamais en `FLOAT`.',
          },
          {
            id: 'b',
            texte: 'Remplacer `round(x, 2)` par `math.ceil(x * 100) / 100` pour toujours arrondir au centime supérieur : plus aucun client ne pourra perdre un centime sur ses intérêts.',
            points: 0,
            feedback:
              'Ce n’est pas la règle demandée : 2,671 deviendrait 2,68, ce qui crée de nouveaux écarts, cette fois en défaveur de la banque. Et le calcul reste en `float`, avec les mêmes erreurs de représentation.',
          },
          {
            id: 'c',
            texte: 'Garder le calcul en `float` et ajouter 0,000001 avant `round()` : cette petite marge compense l’erreur binaire et force les demi-centimes vers le haut, sans réécrire le module.',
            points: 1,
            feedback:
              'Ce « coup de pouce » corrige les exemples du tableau, mais il repose sur une marge choisie au hasard : sur de très gros montants, l’erreur binaire peut la dépasser, et un montant légèrement inférieur au demi-centime peut basculer à tort. Un correctif financier doit être exact par construction, pas par chance.',
          },
          {
            id: 'd',
            texte: 'Envelopper le résultat actuel dans `Decimal` : `Decimal(solde_moyen * TAUX_MENSUEL).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)`, qui applique la règle de la note.',
            points: 2,
            feedback:
              'Le bon mode d’arrondi est là, mais le `Decimal` est construit à partir d’un `float` déjà faux : `Decimal(3201530 * 0.0025)` vaut 8003.82499999…, qui s’arrondit encore à 8003.82. Ce correctif répare EP-100877 (456,125 est exact en binaire) mais pas EP-102506. Il faut des `Decimal` dès l’entrée, construits depuis des chaînes.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'Un client convertit 350 CDF en USD et le service affiche aussi la contre-valeur en CDF. À quel moment faut-il arrondir ?',
        options: [
          {
            id: 'a',
            texte: 'À chaque étape intermédiaire, au centime : 350 CDF donnent 0,13 USD, et la contre-valeur se calcule depuis ces 0,13 USD pour que tous les chiffres affichés concordent.',
            points: 1,
            feedback:
              'Arrondir à chaque étape accumule les erreurs : 350 CDF → 0,13 USD → 364 CDF de contre-valeur, soit 14 CDF « créés » par l’arrondi. La cohérence d’affichage ne doit pas dicter le calcul.',
          },
          {
            id: 'b',
            texte: 'Jamais : on stocke les montants avec toutes leurs décimales (ici 0,125 USD), pour ne rien perdre et pouvoir refaire n’importe quel calcul plus tard sans écart.',
            points: 0,
            feedback:
              'Une écriture comptable porte un montant en unités de la devise (le centime). Stocker 0,125 USD sur un compte n’a pas de sens et crée des écarts dès que le montant est payé ou rapproché.',
          },
          {
            id: 'c',
            texte: 'Seulement à l’affichage : le client voit 0,13 USD, mais le calcul et l’écriture comptable gardent la pleine précision, ce qui évite toute perte d’information.',
            points: 1,
            feedback:
              'Si l’écriture garde 0,125 USD alors que le client voit 0,13 USD, le relevé et le grand livre divergent. L’arrondi doit être appliqué à la valeur enregistrée, pas seulement à son affichage.',
          },
          {
            id: 'd',
            texte:
              'Une seule fois, quand le montant devient une écriture (0,13 USD), selon la règle documentée ; la contre-valeur se recalcule depuis le montant brut.',
            points: 3,
            feedback:
              'C’est le principe à retenir : calculer en pleine précision décimale, arrondir une fois au point de comptabilisation, avec un mode d’arrondi écrit dans la spécification. Les arrondis en cascade créent ou détruisent de l’argent à chaque conversion aller-retour.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre ta démarche jusqu’à la clôture de mercredi.',
        elements: [
          {
            id: 'regul',
            texte:
              'Faire passer par la comptabilité des écritures de régularisation tracées pour les centimes d’octobre (jamais de modification directe des soldes en base)',
          },
          { id: 'test', texte: 'Écrire des tests qui reproduisent les écarts (cas limites du tableau) et constater qu’ils échouent' },
          { id: 'code', texte: 'Corriger les deux fonctions avec `Decimal` et `ROUND_HALF_UP`, puis faire passer toute la suite de tests' },
          { id: 'revue', texte: 'Faire relire le correctif (revue de code) et faire valider la règle d’arrondi par la comptabilité' },
          {
            id: 'rejeu',
            texte: 'Recalculer les intérêts d’octobre en environnement de test et comparer compte par compte avec la comptabilité',
          },
        ],
        ordreCorrect: ['test', 'code', 'revue', 'rejeu', 'regul'],
        pointsMax: 4,
        feedback:
          'On commence par un test rouge qui prouve le bug : il deviendra le test de non-régression. On corrige ensuite jusqu’au vert, puis on fait relire le code et valider la règle par le métier, car c’est la comptabilité qui détient la règle et non le développeur. Le rejeu complet sur octobre mesure l’écart réel avant toute écriture. La régularisation vient en dernier, par écritures comptables tracées et validées : on ne « corrige » jamais un solde directement en base.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quels tests unitaires ajoutes-tu pour que ce bug ne revienne jamais ?',
        options: [
          {
            id: 'a',
            texte: 'Un test qui tire 10 000 soldes au hasard et vérifie que chaque résultat a bien deux décimales : un échantillon aussi large finit par couvrir tous les cas d’arrondi.',
            points: 1,
            feedback:
              'Vérifier le format est utile mais insuffisant : 8003.82 a bien deux décimales et reste faux. Un test doit comparer à une valeur attendue juste, et les valeurs aléatoires tombent rarement sur un demi-centime exact.',
          },
          {
            id: 'b',
            texte:
              'Des cas limites aux valeurs fixées par la comptabilité : demi-centimes exacts (182 450 → 456,13), solde nul, très gros solde, conversions et un cas témoin.',
            points: 3,
            feedback:
              'Ce sont de bons tests : des cas limites choisis là où le bug se manifeste, des valeurs attendues calculées indépendamment du code (par la règle métier) et des cas témoins. Ils documentent aussi la règle d’arrondi pour le prochain développeur.',
          },
          {
            id: 'c',
            texte: 'Un test qui compare la nouvelle fonction à l’ancienne sur tout l’historique des comptes, pour vérifier qu’on ne casse rien de ce qui fonctionnait déjà en production.',
            points: 0,
            feedback:
              'L’ancienne fonction est justement fausse : ce test échouerait sur chaque demi-centime corrigé, ou pousserait à reproduire le bug. Une comparaison à l’ancien code sert à lister les différences attendues, pas de référence de justesse.',
          },
          {
            id: 'd',
            texte: 'Un test qui vérifie que `interets_du_mois(x) == round(x * 0.0025, 2)` pour une série de valeurs représentatives, demi-centimes exacts compris.',
            points: 0,
            feedback:
              'Ce test est tautologique : il recalcule le résultat avec la même méthode fautive. Il passerait au vert avec le bug actuel. L’oracle d’un test doit venir de la spécification, pas du code testé.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'Les écarts viennent du choix du type numérique, pas d’une erreur de taux ni de la base de données.\n• Un `float` est un nombre binaire (IEEE 754) : 0,1, 0,0025 ou 8003,825 n’y sont représentés qu’approximativement. `3201530 * 0.0025` vaut en réalité 8003,82499999…, même si Python affiche 8003.825.\n• `round()` arrondit cette valeur binaire et départage les égalités exactes au chiffre pair (456,125 → 456,12 ; 0,125 → 0,12). La règle de la comptabilité, « demi-centime au supérieur », n’est donc pas respectée, toujours au détriment du client sur l’échantillon.\n\nLe correctif attendu : `Decimal` construit depuis des chaînes (jamais depuis un `float`), `quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)` écrit en un seul endroit, colonnes `NUMERIC` en base, ou bien des entiers de centimes. Le piège le plus fréquent est `Decimal(solde * 0.0025)` : le mal est déjà fait avant la conversion. Autre principe : on arrondit une seule fois, au moment de la comptabilisation ; arrondir en cascade (350 CDF → 0,13 USD → 364 CDF) crée de l’argent qui n’existe pas.\n\nLa démarche compte autant que le code : un test rouge qui reproduit l’écart, le correctif, la revue de code et la validation de la règle par la comptabilité, un rejeu complet sur le mois, puis des écritures de régularisation tracées. Un développeur de banque ne modifie jamais un solde directement en base.\n\nRéflexes à retenir :\n• Jamais de `float` pour de la monnaie : `Decimal` (ou `BigDecimal` en Java, `NUMERIC` en SQL) ou des entiers de centimes.\n• Le mode d’arrondi est une règle métier : il doit être explicite, documenté et testé.\n• L’oracle d’un test vient de la spécification (ici la comptabilité), jamais du code testé.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DEV-CAS-02 — Double débit après une nouvelle tentative réseau
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DEV-CAS-02',
    filiere: 'dev',
    titre: 'Un virement, deux débits : la nouvelle tentative de trop',
    role: 'Développeur back-end — équipe Paiements, Banque Alpha',
    heure: 'Mardi 15h10',
    enjeu:
      'Comprendre pourquoi des clients sont débités deux fois pour un seul virement, stopper le problème, rembourser proprement et livrer un correctif durable.',
    contexte:
      'Depuis le début de l’après-midi, le centre d’appels de Banque Alpha reçoit des plaintes : des clients de l’application mobile affirment n’avoir validé qu’un seul virement, mais leur compte a été débité deux fois. M. Ilunga, client CLI-30418, a vu partir deux fois 250,00 USD. L’équipe d’exploitation signale que le système central (« core banking ») est très lent aujourd’hui : ses temps de réponse varient de 2 à 15 secondes. L’application mobile utilise un client HTTP configuré avec un délai d’attente de 10 secondes et une nouvelle tentative automatique en cas d’échec réseau. Ton responsable, Mme Tshimanga, te transmet le code du service, les journaux du cas de M. Ilunga et le résultat d’une requête de contrôle. Elle attend ton diagnostic et un plan d’action dans trente minutes.',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'Service de virements (Node.js) et configuration du client mobile — extraits',
        contenu: `// routes/virements.js (extrait) — service de virements, Banque Alpha (fictif)
app.post('/api/v1/virements', async (req, res) => {
  const { compteSource, compteDest, montant, devise } = req.body;
  const source = await db.query('SELECT solde FROM comptes WHERE id = $1', [compteSource]);
  if (source.rows[0].solde < montant) {
    return res.status(422).json({ erreur: 'Solde insuffisant' });
  }
  await db.query('UPDATE comptes SET solde = solde - $1 WHERE id = $2', [montant, compteSource]);
  await coreBanking.notifier(compteSource, compteDest, montant, devise); // 2 à 15 s selon la charge
  await db.query('UPDATE comptes SET solde = solde + $1 WHERE id = $2', [montant, compteDest]);
  return res.status(201).json({ statut: 'EXECUTE' });
});

// app-mobile/src/api/client.js (extrait)
export const api = creerClientHttp({
  baseURL: 'https://api.banque-alpha.example',
  timeout: 10000,               // 10 s
  retries: 1,                   // une nouvelle tentative automatique...
  retryOn: ['timeout', 'network'],
});`,
      },
      {
        type: 'logs',
        titre: 'Journaux applicatifs — service de virements, client CLI-30418 (heures UTC)',
        lignes: [
          '2026-10-27T14:02:11.204Z INFO  req=7f3a POST /api/v1/virements client=CLI-30418 source=CPT-00418-77 dest=CPT-11902-03 montant=250.00 USD',
          '2026-10-27T14:02:11.236Z INFO  req=7f3a débit CPT-00418-77 -250.00 USD (solde 1340.00 -> 1090.00)',
          '2026-10-27T14:02:11.240Z INFO  req=7f3a appel core banking…',
          '2026-10-27T14:02:21.204Z WARN  [télémétrie mobile] CLI-30418 timeout 10000 ms sur POST /api/v1/virements — nouvelle tentative 1/1',
          '2026-10-27T14:02:21.307Z INFO  req=c91e POST /api/v1/virements client=CLI-30418 source=CPT-00418-77 dest=CPT-11902-03 montant=250.00 USD',
          '2026-10-27T14:02:21.339Z INFO  req=c91e débit CPT-00418-77 -250.00 USD (solde 1090.00 -> 840.00)',
          '2026-10-27T14:02:21.340Z INFO  req=c91e appel core banking…',
          '2026-10-27T14:02:23.880Z INFO  req=7f3a core banking OK (12640 ms) ; crédit CPT-11902-03 +250.00 USD',
          '2026-10-27T14:02:23.884Z WARN  req=7f3a réponse 201 non délivrée : connexion fermée par le client',
          '2026-10-27T14:02:24.912Z INFO  req=c91e core banking OK (3572 ms) ; crédit CPT-11902-03 +250.00 USD',
          '2026-10-27T14:02:24.916Z INFO  req=c91e réponse 201 délivrée',
          '# Requête de contrôle (13h00-15h00) : 37 paires de virements identiques (même source, même destination, même montant) à moins de 30 s d’écart, toutes précédées d’un timeout côté mobile',
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quel est ton diagnostic ?',
        options: [
          {
            id: 'a',
            texte:
              'Après 10 s sans réponse (le core banking en a mis 12,6), le mobile a renvoyé la demande ; la route POST n’étant pas idempotente, le compte a été débité deux fois.',
            points: 4,
            feedback:
              'Exact. Les journaux le montrent : req=7f3a débite à 14:02:11, le mobile abandonne à 14:02:21 (10 s), req=c91e débite à nouveau à 14:02:21, puis les deux requêtes aboutissent. Un délai d’attente côté client ne dit pas que l’opération a échoué, seulement que le client ne sait pas. Rejouer une opération non idempotente dans ce cas provoque un doublon.',
          },
          {
            id: 'b',
            texte: 'Les clients ont cliqué deux fois sur « Valider » pendant que l’écran tournait : il faut désactiver le bouton après le premier clic et afficher un indicateur de chargement.',
            points: 1,
            feedback:
              'Désactiver le bouton est une bonne pratique, mais ce n’est pas ce qui s’est passé : la télémétrie montre une « nouvelle tentative 1/1 » automatique exactement 10 s après la première requête. Le double clic produirait deux requêtes à quelques millisecondes d’intervalle et sans timeout.',
          },
          {
            id: 'c',
            texte: 'Le core banking, ralenti à 12,6 s, a exécuté deux fois le même ordre : c’est à l’équipe du système central de corriger son traitement des demandes en double.',
            points: 0,
            feedback:
              'Le core banking a bien reçu deux appels, mais parce que notre service lui a envoyé deux demandes distinctes (req=7f3a et req=c91e). Accuser un autre système sans lire ses propres journaux retarde la résolution.',
          },
          {
            id: 'd',
            texte: 'Une condition de concurrence sur la lecture du solde : deux requêtes simultanées ont lu le même solde avant toute écriture, faute de verrou dans le code du service.',
            points: 1,
            feedback:
              'Le code a effectivement ce défaut (lecture puis écriture du solde sans verrou) et il faudra le corriger, mais il n’explique pas le doublon : les deux requêtes ont lu des soldes différents (1340 puis 1090) et sont espacées de 10 s. La cause est la nouvelle tentative sur une route non idempotente.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Quel correctif durable proposes-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Supprimer définitivement les nouvelles tentatives automatiques dans l’application mobile : sans renvoi automatique, aucune requête ne peut plus être dupliquée.',
            points: 1,
            feedback:
              'Cela stoppe les doublons automatiques, mais pas le problème de fond : l’utilisateur qui voit une erreur réessaiera lui-même, avec le même effet. Sur un réseau mobile instable, les nouvelles tentatives sont utiles ; c’est le serveur qui doit les rendre sans danger.',
          },
          {
            id: 'b',
            texte: 'Porter le délai d’attente du mobile à 60 secondes : le core banking finit toujours par répondre, même lentement, et le mobile n’aura plus de raison de renvoyer la demande.',
            points: 1,
            feedback:
              'Le nombre de doublons baisserait, mais un délai plus long ne fait que déplacer la limite. Une coupure réseau pendant la réponse produira le même effet, et l’utilisateur attendra une minute devant un écran figé.',
          },
          {
            id: 'c',
            texte:
              'Rejeter côté serveur tout virement identique (même source, destination et montant) reçu dans les 5 minutes, ce qui couvre largement le délai des nouvelles tentatives.',
            points: 1,
            feedback:
              'Cette heuristique bloquerait des virements légitimes (deux loyers identiques, deux paiements au même fournisseur) et laisserait passer un doublon arrivé après 5 minutes. On ne devine pas l’intention du client : il faut qu’il la déclare.',
          },
          {
            id: 'd',
            texte:
              'Une clé d’idempotence (un UUID par intention, renvoyé à chaque tentative) : le serveur l’enregistre en base avec sa réponse et renvoie celle-ci si la clé revient.',
            points: 4,
            feedback:
              'C’est le patron de référence des API de paiement. La clé identifie l’intention et non la requête : les nouvelles tentatives deviennent sans danger. Une même clé avec un contenu différent doit être refusée (erreur 422 ou 409) ; les clés sont conservées assez longtemps pour couvrir toutes les nouvelles tentatives possibles.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'Deux requêtes portant la même clé d’idempotence arrivent au même moment sur deux serveurs différents. Comment garantis-tu qu’un seul débit a lieu ?',
        options: [
          {
            id: 'a',
            texte: 'Chaque serveur garde en mémoire la liste des clés déjà vues et refuse aussitôt une requête dont la clé y figure, ce qui évite en plus un aller-retour vers la base.',
            points: 0,
            feedback:
              'Une mémoire locale n’est pas partagée entre serveurs et disparaît au redémarrage : chacun des deux serveurs croira voir la clé pour la première fois.',
          },
          {
            id: 'b',
            texte:
              'Insérer la clé dans une table à contrainte `UNIQUE`, dans la même transaction que le débit et le crédit : la seconde insertion échoue.',
            points: 3,
            feedback:
              'C’est la bonne garantie : c’est la base de données qui arbitre, de façon atomique. La contrainte d’unicité rend impossible le double enregistrement, même avec dix serveurs. Lier la clé et les écritures dans la même transaction évite aussi une clé enregistrée sans virement, ou l’inverse.',
          },
          {
            id: 'c',
            texte: 'Faire un `SELECT` pour vérifier si la clé existe déjà, puis un `INSERT` seulement si elle est absente : la seconde requête trouvera la clé et sera rejetée.',
            points: 1,
            feedback:
              'C’est le piège « vérifier puis agir » : les deux requêtes peuvent faire leur `SELECT` en même temps, ne rien trouver et insérer toutes les deux. Sans contrainte d’unicité ni verrou, la condition de concurrence reste ouverte.',
          },
          {
            id: 'd',
            texte: 'Ajouter une pause aléatoire de quelques millisecondes avant le traitement pour désynchroniser les requêtes, qui n’atteindront plus la base au même instant.',
            points: 0,
            feedback:
              'Une pause réduit la probabilité de collision sans jamais l’annuler, et ralentit tous les virements. La correction d’une condition de concurrence ne repose jamais sur le hasard du calendrier.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'En relisant le code, tu remarques que le débit et le crédit sont deux requêtes indépendantes. Que se passe-t-il si le service s’arrête entre les deux, et que fais-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Rien de grave : le core banking a été notifié du virement, et ses traitements de fin de journée corrigeront le solde du bénéficiaire sans intervention de notre part.',
            points: 0,
            feedback:
              'Dans ce code, rien ne le garantit : le compte source est débité et le compte destinataire jamais crédité. L’argent disparaît des livres de la banque. Supposer qu’un autre système rattrapera l’incohérence n’est pas une conception.',
          },
          {
            id: 'b',
            texte: 'Inverser l’ordre : créditer d’abord, débiter ensuite ; ainsi, en cas d’arrêt entre les deux requêtes, aucun client ne perd d’argent et l’écart se rattrape ensuite.',
            points: 0,
            feedback:
              'Le problème change de sens sans disparaître : en cas d’arrêt, le bénéficiaire est crédité sans que la source soit débitée, et la banque crée de la monnaie. L’ordre des requêtes ne remplace pas l’atomicité.',
          },
          {
            id: 'c',
            texte:
              'Le débit reste sans crédit. On regroupe débit, crédit et clé dans une transaction, avec un débit conditionnel (`… WHERE solde >= $1`) dont on vérifie le résultat.',
            points: 3,
            feedback:
              'Exact. La transaction garantit le « tout ou rien » (le A d’ACID). Le débit conditionnel supprime en plus la condition de concurrence sur la lecture préalable du solde. L’appel au core banking, qui dure plusieurs secondes, se fait hors de la transaction, avec un statut (« en attente », « exécuté », « rejeté ») et une reprise contrôlée.',
          },
          {
            id: 'd',
            texte: 'Ajouter un `try/catch` autour du crédit qui recrédite le compte source si le crédit échoue, puis journalise l’incident pour que le support vérifie le virement.',
            points: 1,
            feedback:
              'Une compensation applicative couvre une erreur levée proprement, mais pas un arrêt brutal du processus ou du serveur entre deux instructions : le `catch` ne s’exécutera jamais. La base de données sait garantir l’atomicité ; c’est à elle de le faire.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e5',
        question: 'Ordonne le plan d’action que tu présentes à Mme Tshimanga.',
        elements: [
          {
            id: 'regul',
            texte:
              'Faire valider la liste par le métier, puis contre-passer les débits en double par des écritures tracées (principe des quatre yeux) et informer les clients concernés',
          },
          {
            id: 'stop',
            texte: 'Stopper l’hémorragie : désactiver la nouvelle tentative automatique du mobile par configuration à distance',
          },
          {
            id: 'postmortem',
            texte: 'Post-mortem et prévention : alerte automatique sur les virements en double, suivi des temps de réponse du core banking',
          },
          {
            id: 'liste',
            texte: 'Lister tous les doublons de la période par requête SQL (même source, destination et montant, après un timeout)',
          },
          {
            id: 'correctif',
            texte:
              'Livrer le correctif (clé d’idempotence et transaction) avec ses tests, puis réactiver la nouvelle tentative automatique',
          },
        ],
        ordreCorrect: ['stop', 'liste', 'regul', 'correctif', 'postmortem'],
        pointsMax: 4,
        feedback:
          'On arrête d’abord la production de nouveaux doublons : un réglage à distance suffit et se fait en quelques minutes. On mesure ensuite l’étendue exacte du problème, puis on rembourse les clients par des écritures validées et tracées : leur argent passe avant notre correctif. Le correctif durable vient ensuite, testé, et c’est seulement après lui que l’on réactive les nouvelles tentatives. Le post-mortem clôt l’incident avec des mesures de détection.',
      },
    ],
    pointsMax: 18,
    debrief:
      'Le doublon naît de la rencontre entre trois faits banals : un système central lent (12,6 s), un délai d’attente client de 10 s et une nouvelle tentative automatique sur une route POST non idempotente. Quand un client abandonne après un délai d’attente, il ne sait pas si l’opération a eu lieu ; si la renvoyer crée une seconde opération, chaque lenteur réseau devient un double débit.\n\nLe correctif de référence est la clé d’idempotence :\n• le client génère un identifiant unique par intention de virement et le renvoie, identique, à chaque nouvelle tentative ;\n• le serveur enregistre la clé (contrainte `UNIQUE`), l’empreinte du contenu et la réponse, dans la même transaction que les écritures ;\n• une clé connue renvoie la réponse d’origine ; une clé connue avec un contenu différent est refusée.\n\nLa revue du code révèle deux autres défauts : débit et crédit hors transaction (un arrêt entre les deux fait disparaître l’argent) et un contrôle de solde « lire puis écrire » exposé aux conditions de concurrence. Le débit conditionnel `WHERE solde >= montant` dans une transaction règle les deux. Les fausses bonnes idées sont de supprimer les nouvelles tentatives, d’allonger le délai d’attente ou de rejeter les virements « qui se ressemblent » : elles déplacent le problème ou bloquent des opérations légitimes.\n\nCôté gestion d’incident, l’ordre compte : stopper, mesurer, rembourser par des écritures validées et tracées, corriger durablement, puis capitaliser. Les clients lésés passent avant l’élégance du correctif.\n\nRéflexes à retenir :\n• Un délai d’attente signifie « résultat inconnu », jamais « échec ».\n• Toute opération financière exposée au réseau doit être idempotente.\n• L’unicité et l’atomicité se confient à la base de données (contrainte `UNIQUE`, transaction), pas à des vérifications applicatives.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DEV-CAS-03 — Revue de code d'une page de connexion
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DEV-CAS-03',
    filiere: 'dev',
    titre: 'Revue de code : la page de connexion du portail des agents',
    role: 'Développeur full-stack, relecteur de code — Direction informatique, Banque Beta',
    heure: 'Jeudi 10h30',
    enjeu:
      'Bloquer avant la fusion une page de connexion vulnérable, et traiter correctement un mot de passe de production déjà poussé dans le dépôt Git.',
    contexte:
      'Ton collègue Patrick Mbuyi, recruté il y a deux mois, a ouvert la demande de fusion n° 482 : « Connexion du portail des agents ». Ce portail interne permettra aux agents d’agence de consulter les comptes clients et de valider des opérations. La fonctionnalité doit être présentée vendredi à la direction, et Patrick te demande une approbation rapide. En lisant le code, tu remarques aussi une constante `DB_PASSWORD`. Une recherche dans l’historique du dépôt montre qu’elle a été poussée il y a six jours sur la branche partagée, que lisent aussi les douze développeurs de l’équipe et deux consultants d’un prestataire externe. Tu as testé la requête sur une base locale de démonstration.',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'auth.py — demande de fusion n° 482 (extrait)',
        contenu: `# auth.py — demande de fusion n° 482 « Connexion du portail des agents » (fictif)
from flask import Flask, request, session, redirect

app = Flask(__name__)
app.secret_key = "portail-agents-2026"
DB_PASSWORD = "Mot2Passe-Prod!"     # mot de passe PostgreSQL de production

@app.post("/connexion")
def connexion():
    identifiant = request.form["identifiant"]
    mot_de_passe = request.form["mot_de_passe"]
    requete = (
        "SELECT id, role FROM agents "
        f"WHERE identifiant = '{identifiant}' AND mot_de_passe = '{mot_de_passe}'"
    )
    agent = db.execute(requete).fetchone()
    if agent is None:
        app.logger.info(f"Échec de connexion : {identifiant} / {mot_de_passe}")
        return "Identifiant ou mot de passe incorrect", 401
    session["agent_id"] = agent[0]
    return redirect("/tableau-de-bord")`,
      },
      {
        type: 'texte',
        titre: 'Ton test sur la base de démonstration (sortie réelle)',
        contenu: `>>> connexion_test(identifiant="admin' --", mot_de_passe="nimporte")
SELECT id, role FROM agents WHERE identifiant = 'admin' --' AND mot_de_passe = 'nimporte'
(1, 'ADMIN')`,
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question:
          "Ton test le montre : que se passe-t-il quand un attaquant saisit `admin' --` comme identifiant et n'importe quoi comme mot de passe ?",
        options: [
          {
            id: 'a',
            texte: 'La base renvoie une erreur de syntaxe à cause de l’apostrophe isolée et du `--` inattendu, et la connexion échoue avec un message d’erreur technique.',
            points: 0,
            feedback:
              'Non : l’apostrophe ferme proprement la chaîne et `--` transforme la suite en commentaire SQL. La requête reste valide, et le test renvoie bien la ligne de l’administrateur.',
          },
          {
            id: 'b',
            texte: 'Il obtient seulement la liste des identifiants de la table : l’injection permet de lire des données, mais elle ne suffit pas à ouvrir une session.',
            points: 1,
            feedback:
              'Une injection SQL permet souvent d’extraire des données, mais ici elle fait plus grave : la condition sur le mot de passe est neutralisée et la session est ouverte au nom de l’administrateur.',
          },
          {
            id: 'c',
            texte: 'Rien, car le message d’erreur est générique et ne révèle pas si l’identifiant existe : l’attaquant ne peut même pas savoir si son injection a fonctionné.',
            points: 0,
            feedback:
              'Le message générique est une bonne pratique contre l’énumération des comptes, mais il ne protège en rien contre l’injection : la requête est construite avec les saisies de l’utilisateur avant tout contrôle.',
          },
          {
            id: 'd',
            texte:
              'Il est connecté en administrateur sans connaître le mot de passe : `--` met en commentaire la condition `AND mot_de_passe = …`.',
            points: 3,
            feedback:
              'Exact : c’est un contournement d’authentification par injection SQL. La saisie de l’utilisateur est interprétée comme du code SQL parce que la requête est assemblée par une f-string. Sur un portail qui donne accès aux comptes clients, c’est une vulnérabilité critique et bloquante.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Quel correctif exiges-tu contre l’injection SQL ?',
        options: [
          {
            id: 'a',
            texte: 'Refuser les saisies qui contiennent des mots-clés SQL (`SELECT`, `OR`, `--`, `DROP`…), grâce à une liste noire appliquée à tous les champs du formulaire.',
            points: 1,
            feedback:
              'Une liste noire se contourne (variantes de casse, encodages, autres syntaxes) et bloque des saisies légitimes, comme un nom contenant « or ». La validation des entrées est un complément, pas la protection principale.',
          },
          {
            id: 'b',
            texte:
              'Une requête paramétrée : `db.execute("SELECT id, role, hash_mdp FROM agents WHERE identifiant = %s", (identifiant,))`.',
            points: 4,
            feedback:
              'C’est la protection de référence (OWASP) : la structure de la requête est fixée à l’avance et la saisie ne peut jamais être interprétée comme du SQL. Vérifié sur la base de démonstration : `admin\' --` ne renvoie plus aucune ligne. Note aussi que la requête ne compare plus le mot de passe en SQL : elle récupère l’empreinte pour la vérifier dans le code (étape suivante).',
          },
          {
            id: 'c',
            texte: 'Échapper les apostrophes avec `identifiant.replace("\'", "\'\'")` avant de construire la requête, comme le prévoit la norme SQL pour les chaînes littérales.',
            points: 1,
            feedback:
              'L’échappement manuel bloque le cas testé, mais il est fragile : chaque développeur doit y penser à chaque requête, les règles varient selon le moteur, et d’autres contextes (nombres, noms de colonnes) restent exposés. On ne réinvente pas ce que le pilote fait correctement.',
          },
          {
            id: 'd',
            texte: 'Placer un pare-feu applicatif (WAF) devant le portail, avec les règles OWASP qui bloquent les injections connues ; le code peut alors rester tel quel.',
            points: 1,
            feedback:
              'Un WAF ajoute une couche de défense utile, mais il se contourne et ne remplace pas un code sûr. Laisser une injection connue dans le code d’un portail bancaire n’est pas acceptable.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'Le code compare le mot de passe saisi à une colonne `mot_de_passe` stockée en clair, et l’écrit dans les journaux en cas d’échec. Que demandes-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Stocker une empreinte lente et salée (Argon2id, bcrypt ou scrypt), vérifiée par la fonction de la bibliothèque, et ne jamais journaliser le mot de passe saisi.',
            points: 4,
            feedback:
              'C’est la bonne réponse. Un algorithme lent rend l’attaque par force brute coûteuse en cas de vol de la base, et le sel unique empêche les tables précalculées. Les journaux, souvent lus par beaucoup de monde et conservés longtemps, ne doivent jamais contenir de mot de passe, même erroné : c’est souvent le vrai mot de passe avec une faute de frappe.',
          },
          {
            id: 'b',
            texte: 'Chiffrer les mots de passe en AES-256 avec une clé stockée sur le serveur, ce qui permet aussi au support de les retrouver quand un agent les oublie.',
            points: 1,
            feedback:
              'Le chiffrement est réversible : quiconque obtient la clé, souvent présente sur le même serveur, retrouve tous les mots de passe. On n’a jamais besoin de relire un mot de passe, seulement de le vérifier : il faut une fonction à sens unique.',
          },
          {
            id: 'c',
            texte: 'Les hacher en SHA-256, un algorithme standard réputé sûr et utilisé partout en cryptographie, et retirer le mot de passe saisi des journaux d’échec.',
            points: 2,
            feedback:
              'C’est mieux qu’en clair et la correction des journaux est juste, mais SHA-256 est conçu pour être rapide : un attaquant teste des milliards de candidats par seconde sur du matériel courant. Sans sel, deux agents ayant le même mot de passe ont aussi la même empreinte.',
          },
          {
            id: 'd',
            texte: 'Encoder les mots de passe en Base64 pour qu’ils ne soient plus lisibles directement, ni dans la base ni dans les journaux, sans changer la logique de comparaison.',
            points: 0,
            feedback:
              'Base64 est un encodage, pas une protection : n’importe qui le décode instantanément. C’est du stockage en clair déguisé.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question:
          'Le mot de passe de production `DB_PASSWORD` est dans l’historique Git depuis six jours. Remets les actions dans l’ordre.',
        elements: [
          {
            id: 'purge',
            texte:
              'Réécrire l’historique Git pour retirer l’ancienne valeur (ex. `git filter-repo`) et demander à chacun de recloner le dépôt',
          },
          {
            id: 'signaler',
            texte: 'Signaler immédiatement l’exposition au RSSI selon la procédure d’incident de sécurité',
          },
          {
            id: 'prevention',
            texte: 'Ajouter une détection automatique de secrets dans les hooks de pré-commit et dans la chaîne d’intégration continue',
          },
          {
            id: 'rotation',
            texte:
              'Changer le mot de passe exposé avec l’administrateur de bases de données ; la nouvelle valeur va dans le coffre de secrets et l’application la lit par variable d’environnement',
          },
          {
            id: 'journaux',
            texte: 'Analyser les journaux de connexion de la base depuis le commit fautif, à la recherche d’accès inhabituels',
          },
        ],
        ordreCorrect: ['signaler', 'rotation', 'journaux', 'purge', 'prevention'],
        pointsMax: 4,
        feedback:
          'Un secret poussé doit être considéré comme compromis : on le signale, puis on le rend inutilisable par une rotation. C’est la seule mesure qui protège vraiment, car quatorze personnes et leurs clones locaux l’ont peut-être déjà. On vérifie ensuite s’il a été utilisé, ce qui peut transformer l’exposition en incident d’intrusion. Purger l’historique vient après, car c’est une opération lourde qui ne rend pas le secret moins compromis. La prévention clôt le traitement.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Patrick insiste pour présenter vendredi. Comment rédiges-tu ta revue ?',
        options: [
          {
            id: 'a',
            texte: 'J’approuve pour ne pas bloquer la démonstration de vendredi, en ouvrant des tickets détaillés pour corriger chaque problème dès la semaine prochaine.',
            points: 0,
            feedback:
              'Une fois fusionné, le code peut être déployé ou copié ailleurs, et les tickets « pour plus tard » glissent. Une injection SQL donnant un accès administrateur à un portail bancaire est bloquante, même pour une démonstration.',
          },
          {
            id: 'b',
            texte: 'Je corrige moi-même directement sur sa branche, sans commentaire, pour gagner du temps : l’essentiel est que le code soit sûr avant la démonstration.',
            points: 1,
            feedback:
              'Le code serait corrigé, mais Patrick n’apprendrait rien et reproduirait les mêmes erreurs dans la prochaine fonctionnalité. Et modifier la branche d’un collègue sans le prévenir crée de la confusion.',
          },
          {
            id: 'c',
            texte:
              'Je demande des modifications : commentaires bloquants expliquant le risque et la correction, et je propose une séance de travail pour tenir vendredi.',
            points: 3,
            feedback:
              'C’est la bonne posture : la revue protège la production et forme le collègue. Les commentaires portent sur le code, pas sur la personne ; ils expliquent le « pourquoi » et proposent une solution. L’aide proposée rend l’échéance de vendredi encore tenable.',
          },
          {
            id: 'd',
            texte: 'Je refuse la fusion et j’envoie un courriel à toute l’équipe pour montrer les erreurs de Patrick en exemple, afin que personne ne les reproduise.',
            points: 0,
            feedback:
              'Refuser la fusion est juste, mais humilier publiquement un collègue détruit la confiance et pousse les autres à cacher leurs erreurs, ce qui est l’inverse d’une culture de sécurité. Les leçons collectives se tirent sans nommer personne.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'Cette demande de fusion cumule quatre défauts classiques, dont deux critiques.\n• Injection SQL (critique) : la requête est assemblée par une f-string. Avec `admin\' --`, la condition sur le mot de passe devient un commentaire et l’attaquant est connecté en administrateur. Correctif : requête paramétrée, jamais de concaténation de saisies dans du SQL.\n• Mots de passe en clair (critique) : ils doivent être stockés sous forme d’empreinte lente et salée (Argon2id, bcrypt, scrypt). SHA-256 est trop rapide, AES est réversible et Base64 n’est qu’un encodage.\n• Mot de passe journalisé : un journal n’est pas un coffre-fort, aucune donnée d’authentification ne doit y figurer.\n• Secrets dans le code : `DB_PASSWORD` et `secret_key` doivent venir d’un coffre de secrets ou de variables d’environnement.\n\nPour un secret déjà poussé, le réflexe essentiel est la rotation : supprimer le fichier ou réécrire l’historique ne suffit pas, puisque des clones existent déjà. L’ordre attendu : signaler, changer le secret, chercher des traces d’utilisation, purger l’historique, puis automatiser la détection (hooks de pré-commit, chaîne d’intégration continue).\n\nLe jury évalue aussi la posture : une revue de code bloque fermement ce qui est dangereux, explique le risque, propose une correction et reste bienveillante envers l’auteur. Le message d’erreur générique de Patrick était d’ailleurs une bonne pratique à souligner.\n\nRéflexes à retenir :\n• Toute saisie utilisateur est une donnée, jamais du code : requêtes paramétrées.\n• Un mot de passe se vérifie, il ne se relit pas : empreinte lente et salée.\n• Un secret poussé est un secret compromis : rotation d’abord, nettoyage ensuite.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DEV-CAS-04 — Mise en production qui casse le service des relevés
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'DEV-CAS-04',
    filiere: 'dev',
    titre: 'Vendredi 17h30 : la mise en production casse les relevés',
    role: 'Développeur d’astreinte — équipe Canaux numériques, Banque Alpha',
    heure: 'Vendredi 17h41',
    enjeu:
      'Rétablir au plus vite le téléchargement des relevés pour les clients, puis livrer un correctif sûr et tirer les leçons de l’incident sans chercher de coupable.',
    contexte:
      'À 17h30, la version 2.14.0 du service des relevés de compte a été déployée en production. Nouveauté : les montants s’affichent dans la devise préférée du client. Depuis 17h32, la supervision montre qu’environ un quart des demandes de relevé échouent avec une erreur 500 dans l’application mobile et sur le site de banque en ligne. Les clients concernés ne peuvent plus télécharger leur relevé, que beaucoup doivent fournir à leur ambassade ou à leur employeur avant la fin du mois. La version 2.14.0 n’embarque qu’une migration additive : une nouvelle colonne facultative, que la version précédente 2.13.4 ignore. Tous les tests automatisés étaient verts avant le déploiement. Tu es d’astreinte, et ta responsable, Mme Lumbala, est joignable par téléphone.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Supervision du service des relevés (fictif)',
        colonnes: ['Heure', 'Version', 'Requêtes/min', 'Taux d’erreurs 5xx', 'Latence p95'],
        lignes: [
          ['17h15', '2.13.4', 412, '0,1 %', '380 ms'],
          ['17h25', '2.13.4', 398, '0,1 %', '371 ms'],
          ['17h30', 'déploiement 2.14.0', '—', '—', '—'],
          ['17h35', '2.14.0', 405, '24,2 %', '395 ms'],
          ['17h40', '2.14.0', 431, '25,8 %', '402 ms'],
        ],
      },
      {
        type: 'logs',
        titre: 'Journal d’erreurs — service des relevés v2.14.0 (extrait)',
        lignes: [
          '2026-10-30 17:38:04 ERROR GET /api/v1/comptes/CPT-20871-05/releve?periode=2026-09 -> 500',
          'Traceback (most recent call last):',
          '  File "/app/releves/api.py", line 42, in obtenir_releve',
          '    return construire_releve(compte, periode)',
          '  File "/app/releves/service.py", line 88, in construire_releve',
          '    devise = devise_affichage(compte.client)',
          '  File "/app/releves/service.py", line 23, in devise_affichage',
          '    return client.preferences.get("devise", "CDF")',
          '           ^^^^^^^^^^^^^^^^^^^^^^',
          "AttributeError: 'NoneType' object has no attribute 'get'",
          '# Même trace pour 100 % des erreurs 500 depuis 17:32 ; aucune erreur pour les clients ayant enregistré des préférences',
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Que t’apprend la trace d’appels (« traceback ») ?',
        options: [
          {
            id: 'a',
            texte: 'Le problème est dans `api.py` à la ligne 42 : c’est la première ligne de la trace, donc l’endroit où l’exception a été levée en premier.',
            points: 0,
            feedback:
              'Une trace Python se lit de bas en haut : la dernière ligne donne l’erreur, l’avant-dernière frame indique où elle s’est produite. `api.py` ligne 42 n’est que le point d’entrée qui a appelé le code fautif.',
          },
          {
            id: 'b',
            texte:
              'Pour les clients sans préférences, `client.preferences` vaut `None`, et `devise_affichage` (service.py, ligne 23) appelle `.get()` dessus.',
            points: 3,
            feedback:
              'Exact. La dernière ligne (`AttributeError: \'NoneType\' object has no attribute \'get\'`) donne l’erreur, et la frame de la ligne 23 désigne le code introduit en 2.14.0. La note du journal confirme le motif : les clients ayant des préférences ne sont pas touchés. Le `.get("devise", "CDF")` gère une clé absente, mais pas un dictionnaire absent.',
          },
          {
            id: 'c',
            texte: 'La base de données est indisponible : le service ne parvient pas à charger les préférences des clients et travaille sur un objet vide, d’où l’erreur.',
            points: 0,
            feedback:
              'Une indisponibilité de la base produirait des erreurs de connexion ou des délais d’attente pour tous les clients, et la latence p95 exploserait. Or 75 % des requêtes réussissent et la latence est stable.',
          },
          {
            id: 'd',
            texte: 'La charge a augmenté avec la fin du mois : le service sature, certaines requêtes reçoivent un objet incomplet et l’erreur apparaît.',
            points: 0,
            feedback:
              'Le volume est stable (environ 400 requêtes par minute avant et après) et la latence aussi. Le taux d’erreurs est passé de 0,1 % à 24 % pile au déploiement : la cause est le changement de version, pas la charge.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Il est 17h45. Que fais-tu en priorité ?',
        options: [
          {
            id: 'a',
            texte: 'J’écris un correctif rapide et je le déploie directement en production, sans passer par les tests ni la revue, pour que les clients retrouvent vite leurs relevés.',
            points: 1,
            feedback:
              'Le correctif est peut-être simple, mais un déploiement en urgence, sans test ni revue, un vendredi soir, risque d’ajouter un second incident au premier. Le retour arrière est plus rapide et sans inconnue.',
          },
          {
            id: 'b',
            texte: 'Je redémarre les serveurs du service des relevés pour repartir d’un état propre, puis je surveille le taux d’erreurs pendant quelques minutes.',
            points: 0,
            feedback:
              'Un redémarrage ne change pas le code : la même ligne échouera pour les mêmes clients. C’est une action réflexe utile contre une fuite mémoire, pas contre un bug déterministe.',
          },
          {
            id: 'c',
            texte:
              'Je préviens Mme Lumbala, je reviens à la 2.13.4 (la migration est additive) et je vérifie que les erreurs retombent à 0,1 %.',
            points: 4,
            feedback:
              'C’est la bonne priorité : rétablir le service d’abord, comprendre et corriger ensuite, au calme. Tu as vérifié que le retour arrière est compatible avec le schéma de la base (colonne facultative ignorée par la 2.13.4), et tu contrôles l’effet sur les métriques. Si la fonctionnalité était protégée par un interrupteur de configuration, le désactiver serait une option équivalente.',
          },
          {
            id: 'd',
            texte: 'Je laisse en l’état jusqu’à lundi : 75 % des clients peuvent encore télécharger leur relevé, et un correctif sera mieux préparé à tête reposée.',
            points: 0,
            feedback:
              'Un quart des clients privés de relevé pendant tout un week-end de fin de mois, alors qu’un retour arrière sûr existe, n’est pas acceptable. L’astreinte existe précisément pour cela.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Le service est rétabli. Quel correctif prépares-tu pour la version 2.14.1 ?',
        options: [
          {
            id: 'a',
            texte: 'Entourer l’appel de `try: … except Exception: pass` dans `construire_releve`, pour qu’aucune erreur de préférences n’interrompe plus la génération du relevé.',
            points: 0,
            feedback:
              'Un `except Exception: pass` avale toutes les erreurs, y compris celles d’autres origines : `devise` ne serait même pas définie, et le prochain bug passerait inaperçu. On traite le cas prévu, pas toutes les exceptions possibles.',
          },
          {
            id: 'b',
            texte: 'Remplir en base des préférences par défaut pour tous les clients qui n’en ont pas, sans toucher au code : la fonction recevra toujours un dictionnaire.',
            points: 1,
            feedback:
              'La correction des données peut compléter le correctif, mais le code reste fragile : tout nouveau client créé sans préférences, ou toute donnée importée, relancera l’erreur. Le code doit gérer un état que le modèle de données autorise.',
          },
          {
            id: 'c',
            texte: 'Annuler la fonctionnalité de devise préférée : elle est trop risquée pour un service aussi visible, et les clients se contentaient très bien du CDF.',
            points: 0,
            feedback:
              'Le besoin métier reste valable, et le défaut est simple et bien circonscrit. Abandonner une fonctionnalité à cause d’un bug corrigeable n’est pas une réponse d’ingénieur.',
          },
          {
            id: 'd',
            texte:
              'Gérer l’absence de préférences : `if not client.preferences: return "CDF"` (défaut validé par le métier), puis tests de reproduction et revue du correctif.',
            points: 3,
            feedback:
              'C’est le correctif minimal et lisible : le code traite l’état « aucune préférence », que le modèle de données autorise. Vérifié : `None` → CDF, `{}` → CDF, `{"devise": "USD"}` → USD. La valeur par défaut est une règle métier : on la fait confirmer, on ne l’invente pas.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e4',
        question: 'Tous les tests étaient verts avant le déploiement. Quel test de non-régression ajoutes-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Des tests de `devise_affichage` avec des préférences `None`, vides et renseignées, un test d’intégration pour un client sans préférences et des fixtures réalistes.',
            points: 3,
            feedback:
              'C’est la bonne réponse : le test qui aurait détecté le bug, au niveau de la fonction et du parcours complet. La correction des fixtures traite la vraie cause : les tests passaient parce que tous les clients de test avaient des préférences, contrairement à la production.',
          },
          {
            id: 'b',
            texte: 'Un test qui vérifie qu’un client avec la devise USD voit bien ses montants en USD, puisque c’est la fonctionnalité livrée dans la version 2.14.0.',
            points: 0,
            feedback:
              'C’est le cas nominal, déjà couvert et qui fonctionnait. Un test de non-régression doit reproduire le scénario qui a échoué en production.',
          },
          {
            id: 'c',
            texte: 'Exiger 90 % de couverture de code sur le module des relevés, contrôlée par la chaîne d’intégration continue avant chaque fusion.',
            points: 1,
            feedback:
              'La couverture mesure les lignes exécutées, pas les cas testés : la ligne 23 était sans doute couverte par un test avec préférences. On peut atteindre 100 % de couverture et manquer ce bug.',
          },
          {
            id: 'd',
            texte: 'Ajouter une étape de test manuel du parcours de relevé avant chaque mise en production, réalisée par l’équipe sur l’environnement de recette.',
            points: 1,
            feedback:
              'Un test manuel peut aider, mais il dépend du compte de test choisi (probablement avec préférences) et ne s’exécute pas à chaque modification. Le cas doit être automatisé.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e5',
        question: 'Remets dans l’ordre la gestion complète de l’incident.',
        elements: [
          { id: 'test', texte: 'Écrire le test qui reproduit l’erreur pour un client sans préférences, et le voir échouer' },
          { id: 'rollback', texte: 'Revenir à la version 2.13.4 et vérifier le retour du taux d’erreurs à la normale' },
          {
            id: 'postmortem',
            texte: 'Rédiger le post-mortem sans blâme : chronologie, causes, actions correctives avec responsables et échéances',
          },
          {
            id: 'qualifier',
            texte: 'Qualifier l’impact (métriques, trace d’appels, clients touchés) et prévenir la responsable',
          },
          {
            id: 'redeployer',
            texte: 'Corriger, faire passer tests et revue, puis déployer la 2.14.1 progressivement (d’abord une petite part du trafic)',
          },
        ],
        ordreCorrect: ['qualifier', 'rollback', 'test', 'redeployer', 'postmortem'],
        pointsMax: 4,
        feedback:
          'On qualifie en quelques minutes pour décider sur des faits, et l’on prévient sa hiérarchie. On rétablit le service par un retour arrière avant de chercher le correctif. Le test rouge précède la correction, puis le redéploiement se fait progressivement pour limiter l’impact si un autre défaut subsiste. Le post-mortem vient une fois la situation stabilisée, à froid.',
      },
      {
        type: 'choix',
        id: 'e6',
        question: 'Lors du post-mortem, un chef de service demande « qui a écrit ce code ? ». Que proposes-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Nommer le développeur concerné et lui demander de s’engager par écrit à être plus attentif, pour que la responsabilité de l’incident soit clairement établie.',
            points: 0,
            feedback:
              'Chercher un coupable n’empêche pas la répétition : un autre développeur, avec les mêmes outils et les mêmes fixtures, aurait laissé passer le même bug. Et la peur pousse à cacher les incidents.',
          },
          {
            id: 'b',
            texte:
              'Recentrer le débat sur les causes systémiques (fixtures, déploiement non progressif, horaire), chacune avec une action, un responsable et une échéance.',
            points: 2,
            feedback:
              'C’est l’esprit du post-mortem sans blâme : on suppose que chacun a agi au mieux avec les informations dont il disposait, et l’on corrige les conditions qui ont permis l’erreur. Les actions sont concrètes et suivies, sinon le post-mortem ne sert à rien.',
          },
          {
            id: 'c',
            texte: 'Interdire toute mise en production pendant un mois, le temps de retrouver la confiance de la direction et de revoir en profondeur le processus de livraison.',
            points: 0,
            feedback:
              'Geler les livraisons accumule les changements, et des livraisons plus grosses sont plus risquées. La confiance revient par de meilleurs garde-fous (tests, déploiement progressif), pas par l’immobilisme.',
          },
          {
            id: 'd',
            texte: 'Ne pas organiser de post-mortem : l’incident a duré moins d’une heure, il est corrigé et testé, et la réunion ferait perdre du temps à toute l’équipe.',
            points: 0,
            feedback:
              'Un quart des clients a été touché, et les causes (fixtures non représentatives, déploiement non progressif) sont toujours là. Sans analyse, le même type d’incident se reproduira.',
          },
        ],
      },
    ],
    pointsMax: 19,
    debrief:
      'L’incident est banal et sa gestion est exemplaire si l’on suit le bon ordre.\n• Lecture de la trace : de bas en haut. La dernière ligne donne l’erreur (`AttributeError` sur `None`), la dernière frame donne l’endroit (service.py, ligne 23, code introduit en 2.14.0). Les métriques confirment : volume et latence stables, erreurs passées de 0,1 % à environ 25 % pile au déploiement.\n• Priorité au service : un retour arrière vers la 2.13.4 rétablit les clients en quelques minutes. Il est sûr ici parce que la migration est additive : vérifier la compatibilité du schéma est le réflexe à avoir avant tout retour arrière. Redémarrer ne sert à rien contre un bug déterministe, et un correctif en urgence non testé un vendredi soir est un pari.\n• Correctif : traiter explicitement l’état « aucune préférence » avec une valeur par défaut validée par le métier, sans `except Exception: pass` qui masquerait les prochains bugs.\n• Test de non-régression : la cause profonde est que les fixtures ne ressemblaient pas à la production (tous les clients de test avaient des préférences). Le test doit reproduire le cas réel, et la couverture de code ne garantit rien à elle seule.\n• Redéploiement progressif, puis post-mortem sans blâme : chronologie, causes systémiques (fixtures, absence de déploiement progressif, horaire de mise en production), actions datées avec un responsable.\n\nUn jury attend du sang-froid, une décision fondée sur les métriques, la priorité donnée aux clients plutôt qu’à l’amour-propre de l’équipe, et une culture de l’amélioration plutôt que de la sanction.\n\nRéflexes à retenir :\n• Rétablir d’abord, corriger ensuite : le retour arrière est le correctif le plus rapide et le mieux connu.\n• Tout bug de production mérite un test qui l’aurait détecté.\n• On corrige le système qui a laissé passer l’erreur, pas la personne qui l’a écrite.',
  },
];
