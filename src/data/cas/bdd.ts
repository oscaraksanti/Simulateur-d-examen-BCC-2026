// Cas pratiques — filière Administration des bases de données (préfixe BDD).
// Scénarios fictifs (Banque Alpha, IP privées, domaines .example) ; chiffres vérifiés par script
// (tailles, débits, durées de restauration, écarts de LSN).

import type { CasPratique } from '@/lib/types';

export const casBdd: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // BDD-CAS-01 — Journal de transactions plein en pleine compensation
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'BDD-CAS-01',
    filiere: 'bdd',
    titre: 'Journal de transactions plein en pleine journée de compensation',
    role: 'DBA de permanence — Direction informatique, Banque Alpha',
    heure: 'Lundi, 10h14',
    enjeu:
      'Rendre la base PAIEMENTS de nouveau accessible en écriture avant la clôture de la compensation, sans casser la chaîne de sauvegarde ni perdre une seule transaction.',
    contexte:
      'Lundi 26 octobre, jour de forte activité : la compensation interbancaire (fictive) clôture à 16h00. Depuis 10h12, l’application de virements de Banque Alpha renvoie des erreurs à chaque validation : plus aucune écriture ne passe sur la base PAIEMENTS (SQL Server, mode de récupération FULL). La lecture fonctionne encore, ce qui rassure faussement le service métier. Le chef d’exploitation, M. Ilunga, te transfère les alertes et te demande un diagnostic en cinq minutes. La politique de la banque prévoit une sauvegarde complète chaque nuit à 01h00 et une sauvegarde du journal toutes les 15 minutes, avec un RPO contractuel de 15 minutes. Personne n’a reçu d’alerte ce week-end.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Journal d’erreurs SQL Server et historique de l’Agent SQL (extraits)',
        lignes: [
          '2026-10-24 22:45:03  Agent  Job "PAIEMENTS - Sauvegarde journal" : succès (PAIEMENTS_LOG_20261024_2245.trn)',
          "2026-10-24 23:00:02  Agent  Job \"PAIEMENTS - Sauvegarde journal\" : échec — Msg 3202 : Write on '\\\\nas-sauv01.alpha.example\\sqlbackup\\PAIEMENTS\\PAIEMENTS_LOG_20261024_2300.trn' failed: 112(There is not enough space on the disk.)",
          '2026-10-24 23:00:02  Agent  Msg 3013 : BACKUP LOG is terminating abnormally.',
          '2026-10-25 01:00:04  Agent  Job "PAIEMENTS - Sauvegarde complète" : échec — Msg 3202 (112, espace disque insuffisant sur nas-sauv01)',
          '2026-10-25 01:15:02  Agent  Job "PAIEMENTS - Sauvegarde journal" : échec (112) — notification opérateur : aucun opérateur configuré',
          '# … 141 échecs consécutifs du job de sauvegarde du journal entre samedi 23h00 et lundi 10h00 …',
          "2026-10-26 10:11:58  spid87  Error: 5149 — MODIFY FILE encountered operating system error 112(There is not enough space on the disk.) while attempting to expand the physical file 'L:\\SQLLogs\\PAIEMENTS_log.ldf'.",
          "2026-10-26 10:12:01  spid112 Error: 9002, Severity: 17 — The transaction log for database 'PAIEMENTS' is full due to 'LOG_BACKUP'.",
          "2026-10-26 10:12:04  spid131 Error: 9002, Severity: 17 — The transaction log for database 'PAIEMENTS' is full due to 'LOG_BACKUP'.",
        ],
      },
      {
        type: 'table',
        titre: 'État relevé à 10h14 (DBCC SQLPERF(LOGSPACE), sys.databases, volumes)',
        colonnes: ['Élément', 'Valeur'],
        lignes: [
          ['Fichier PAIEMENTS_log.ldf (volume L:)', '248 Go, utilisé à 99,7 % (≈ 247,3 Go)'],
          ['log_reuse_wait_desc de PAIEMENTS', 'LOG_BACKUP'],
          ['Volume L: (journaux)', '250 Go au total, 0,4 Go libres'],
          ['Volume réseau nas-sauv01 (sauvegardes)', '8 To, plein à 100 % (job de purge à 14 jours en échec depuis le 10/10)'],
          ['Volume local M: (sauvegardes de secours)', '600 Go libres, débit d’écriture mesuré ≈ 400 Mo/s'],
          ['Dernière sauvegarde complète réussie', 'Samedi 24/10, 01h00'],
          ['Dernière sauvegarde du journal réussie', 'Samedi 24/10, 22h45'],
          ['Journal généré dimanche 02h00-04h00 (maintenance des index)', '≈ 96 Go'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quel est ton diagnostic sur la cause de l’arrêt des écritures ?',
        options: [
          {
            id: 'a',
            texte:
              'La base a simplement trop grossi avec l’activité du week-end et la maintenance des index : il faut commander un disque plus grand pour le volume L: et étendre le fichier.',
            points: 1,
            feedback:
              'Le volume est bien plein, mais c’est un symptôme. Un journal en mode FULL ne se vide (troncature logique) qu’après une sauvegarde du journal ; ici, `log_reuse_wait_desc = LOG_BACKUP` montre que c’est ce mécanisme qui est bloqué. Un disque plus grand ne ferait que retarder la prochaine saturation.',
          },
          {
            id: 'b',
            texte:
              'Les sauvegardes du journal échouent depuis samedi 23h00 (NAS plein) : sans elles, SQL Server ne peut plus réutiliser l’espace du journal, qui a grossi jusqu’à remplir L:.',
            points: 4,
            feedback:
              'Exact. Toute la chaîne est dans les pièces : erreur 3202 (espace insuffisant sur le NAS), 141 échecs sans alerte (aucun opérateur configuré), croissance impossible (5149, erreur 112) puis erreur 9002 avec la raison `LOG_BACKUP`. La cause racine est double : la purge du NAS en panne et l’absence de supervision des échecs de job.',
          },
          {
            id: 'c',
            texte:
              'Une transaction très longue restée ouverte depuis la maintenance de dimanche empêche la troncature du journal ; il suffit de la repérer avec `DBCC OPENTRAN` et de la tuer.',
            points: 1,
            feedback:
              'C’est une cause fréquente de journal plein, et le réflexe de vérifier (`DBCC OPENTRAN`) est bon. Mais SQL Server indique lui-même la raison de l’attente : ici `LOG_BACKUP`, et non `ACTIVE_TRANSACTION`. Tuer une transaction au hasard n’aurait rien libéré.',
          },
          {
            id: 'd',
            texte:
              'Le fichier journal est fragmenté en milliers de VLF après la maintenance des index : un `DBCC SHRINKFILE` sur PAIEMENTS_log suffira à libérer de la place pour les écritures.',
            points: 0,
            feedback:
              'Un shrink ne peut libérer que la partie inactive du journal. Or 99,7 % du journal est actif, en attente de sauvegarde : le shrink ne récupérerait quasiment rien et ne traite pas la cause.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Il est 10h20, la compensation attend. Quelle action principale mènes-tu pour rétablir les écritures ?',
        options: [
          {
            id: 'a',
            texte:
              'Lancer `BACKUP LOG PAIEMENTS TO DISK = \'NUL\'` : le journal est vidé en quelques secondes, sans consommer d’espace disque, et la compensation reprend aussitôt.',
            points: 0,
            feedback:
              'C’est la pire option : la sauvegarde part dans le néant. L’espace est libéré, mais la chaîne des sauvegardes du journal est rompue sans que personne ne le voie, et toute restauration à un instant précis devient impossible jusqu’à la prochaine sauvegarde complète. Inacceptable pour une base de paiements.',
          },
          {
            id: 'b',
            texte:
              'Passer la base en mode de récupération SIMPLE, lancer un `CHECKPOINT` pour tronquer le journal, puis la remettre en FULL ce soir, après la clôture de la compensation.',
            points: 1,
            feedback:
              'Les écritures reprennent, mais la chaîne de sauvegarde est rompue : aucune restauration à un instant précis n’est possible entre ce moment et la prochaine sauvegarde complète ou différentielle. Une telle décision ne se prend pas seul, en pleine compensation, sur une base soumise à un RPO de 15 minutes.',
          },
          {
            id: 'c',
            texte:
              'Ajouter un second fichier journal sur le volume M: (600 Go libres) pour redonner immédiatement de l’espace à la base sans interrompre la compensation en cours.',
            points: 2,
            feedback:
              'C’est un palliatif légitime qui fait repartir les écritures en quelques secondes, sans rompre la chaîne. Mais il ne traite pas la cause : sans sauvegarde du journal, ce second fichier se remplira à son tour, et il faudra penser à le retirer une fois la situation normalisée.',
          },
          {
            id: 'd',
            texte:
              'Sauvegarder le journal vers le volume local M: (600 Go libres), vérifier que `log_reuse_wait_desc` repasse à `NOTHING`, puis rediriger le job planifié vers un stockage libre.',
            points: 4,
            feedback:
              'C’est la bonne réponse : on traite la cause sans rompre la chaîne. À 400 Mo/s, la première sauvegarde d’environ 247 Go dure à peu près 11 minutes ; l’espace du journal redevient réutilisable dès qu’elle se termine. Le fichier .trn produit sur M: fait partie de la chaîne : il faut le conserver et le recopier sur le NAS dès que possible, car une sauvegarde stockée sur le serveur lui-même ne protège pas contre sa perte.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre ton plan de traitement de l’incident.',
        elements: [
          { id: 'sauvegarde', texte: 'Lancer la sauvegarde du journal vers M: et contrôler que l’espace redevient réutilisable' },
          { id: 'supervision', texte: 'Configurer les alertes (échec de job, journal rempli à plus de 80 %, espace du NAS) et rédiger le rapport d’incident' },
          { id: 'diagnostic', texte: 'Confirmer le diagnostic : raison d’attente du journal, historique des jobs, espace des volumes' },
          { id: 'reprise', texte: 'Vérifier la reprise des écritures applicatives et la réussite des sauvegardes planifiées suivantes' },
          { id: 'complete', texte: 'Libérer le NAS (purge contrôlée selon la rétention), y recopier les fichiers de M: et lancer une sauvegarde complète' },
        ],
        ordreCorrect: ['diagnostic', 'sauvegarde', 'reprise', 'complete', 'supervision'],
        pointsMax: 4,
        feedback:
          'On confirme d’abord (agir sur un mauvais diagnostic fait perdre de précieuses minutes), puis on rétablit le service par la sauvegarde du journal et on vérifie la reprise réelle côté application. Vient ensuite la remise en état durable : NAS assaini, copies rapatriées et nouvelle sauvegarde complète, la dernière réussie datant de samedi. La supervision et le rapport clôturent l’incident et empêchent qu’il se reproduise en silence.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'L’incident est résolu : le fichier journal fait 248 Go mais n’est plus utilisé qu’à 1 %. Que fais-tu de sa taille ?',
        options: [
          {
            id: 'a',
            texte:
              'Je le réduis tout de suite à 1 Go avec `DBCC SHRINKFILE` pour libérer le volume L:, et je programme ce shrink chaque nuit pour que l’incident ne se reproduise pas.',
            points: 0,
            feedback:
              'Un shrink quotidien crée un cycle réduction-croissance : chaque croissance pendant le pic suspend les écritures le temps de l’extension et fragmente le journal en une multitude de fichiers journaux virtuels (VLF), ce qui ralentit les sauvegardes, les restaurations et le démarrage de la base.',
          },
          {
            id: 'b',
            texte:
              'Je le supprime pendant une courte fenêtre de maintenance et je laisse SQL Server en recréer un neuf, propre et de petite taille, au redémarrage du service.',
            points: 0,
            feedback:
              'Supprimer le fichier journal d’une base en production est extrêmement dangereux : les transactions non encore écrites dans les fichiers de données seraient perdues et la base pourrait être déclarée suspecte. On ne touche jamais aux fichiers d’une base en dehors de SQL Server.',
          },
          {
            id: 'c',
            texte:
              'Je mesure le pic réel entre deux sauvegardes du journal (maintenance comprise), puis je le réduis une seule fois, hors pic, à cette taille plus une marge.',
            points: 3,
            feedback:
              'C’est la démarche d’un DBA : dimensionner sur la mesure (ici, la maintenance du dimanche génère environ 96 Go en deux heures, ce qui justifie un journal confortable ou des sauvegardes du journal plus fréquentes pendant la maintenance), réduire une seule fois et fixer une croissance prévisible.',
          },
          {
            id: 'd',
            texte:
              'Je le laisse à 248 Go sans rien faire : l’espace est déjà préalloué, ce qui évite toute croissance automatique pendant les pics ; autant le garder tel quel.',
            points: 1,
            feedback:
              'Ce n’est pas absurde, car un journal préalloué évite les croissances en pleine journée. Mais le volume L: reste plein à 99,8 %, sans marge pour les autres bases, et la taille n’a été atteinte que par accident : elle doit résulter d’un dimensionnement, pas d’un incident.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Le directeur informatique demande : « Si le serveur avait été détruit dimanche à 18h00, combien de transactions aurions-nous perdues ? »',
        options: [
          {
            id: 'a',
            texte: 'Au plus 15 minutes, puisque c’est notre RPO contractuel et que la politique prévoit une sauvegarde du journal toutes les 15 minutes vers le NAS.',
            points: 0,
            feedback:
              'Le RPO est un objectif, pas une garantie. Il n’est tenu que si les sauvegardes réussissent effectivement et sont stockées hors du serveur. Ici, elles échouaient toutes depuis samedi 23h00.',
          },
          {
            id: 'b',
            texte:
              'Environ 19 h 15 de transactions : on aurait restauré la complète de samedi 01h00 puis les journaux jusqu’à 22h45, pas au-delà.',
            points: 3,
            feedback:
              'Exact : de samedi 22h45 à dimanche 18h00, il y a 19 h 15. Le RPO réel était donc près de 77 fois supérieur à l’objectif de 15 minutes, sans que personne ne le sache. C’est l’argument le plus fort pour superviser les sauvegardes et tester régulièrement les restaurations.',
          },
          {
            id: 'c',
            texte:
              'Tout depuis la dernière sauvegarde complète réussie, samedi 01h00, soit environ 41 heures : sans complète plus récente, rien n’était restaurable au-delà.',
            points: 1,
            feedback:
              'Le raisonnement oublie que les sauvegardes du journal réussies jusqu’à samedi 22h45 se rejouent après la sauvegarde complète. La perte aurait été de 19 h 15, pas de 41 heures.',
          },
          {
            id: 'd',
            texte:
              'Rien du tout : en mode de récupération FULL, chaque transaction validée est conservée dans le journal de transactions, qui permet de tout rejouer.',
            points: 1,
            feedback:
              'Vrai seulement si le fichier journal survit : on peut alors faire une sauvegarde de la fin du journal (tail-log backup) et ne rien perdre. Mais la question porte sur la destruction du serveur, qui emporte le journal avec lui.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'L’incident est un grand classique de l’exploitation SQL Server, et le jury évalue autant la méthode que la commande à taper.\n• Diagnostic : l’erreur 9002 donne elle-même la raison de l’attente (`LOG_BACKUP`). En mode de récupération FULL, l’espace du journal n’est réutilisable qu’après une sauvegarde du journal ; celles-ci échouaient depuis samedi 23h00 (NAS plein, erreur 3202), le journal a grossi jusqu’à remplir le volume L:.\n• Correction : sauvegarder le journal vers une destination disposant d’espace (M:, environ 11 minutes pour 247 Go à 400 Mo/s), vérifier `log_reuse_wait_desc`, puis rapatrier les fichiers vers le NAS assaini et relancer une sauvegarde complète. Ajouter un second fichier journal n’est qu’un palliatif.\n• Pièges à éviter : `BACKUP LOG … TO DISK = \'NUL\'` et le passage en SIMPLE, qui libèrent l’espace mais rompent la chaîne de sauvegarde ; le shrink, inefficace sur un journal actif et nuisible s’il est répété ; la suppression du fichier .ldf.\n• Exposition réelle : la dernière sauvegarde du journal réussie datait de samedi 22h45. Une destruction du serveur dimanche à 18h00 aurait coûté 19 h 15 de transactions, pour un RPO affiché de 15 minutes.\n• Causes racines : purge du NAS en échec depuis le 10/10 et 141 échecs consécutifs sans aucune notification (aucun opérateur configuré).\nCe qu’attend un jury de banque centrale : ne jamais sacrifier la capacité de restauration pour gagner quelques minutes, tracer chaque action et transformer l’incident en mesures durables.\nRéflexes à retenir :\n• Une sauvegarde qui échoue sans alerte n’existe pas : supervise les jobs, l’espace des destinations et le taux de remplissage des journaux.\n• Le RPO réel se mesure à la dernière sauvegarde réussie et stockée hors du serveur.\n• Dimensionne le journal sur la mesure du pic (maintenance comprise), une fois pour toutes, avec une croissance fixe.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BDD-CAS-02 — Requête de reporting qui paralyse l’OLTP
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'BDD-CAS-02',
    filiere: 'bdd',
    titre: 'Un rapport de pilotage paralyse les virements',
    role: 'DBA de production — Direction informatique, Banque Alpha',
    heure: 'Jeudi, 14h03',
    enjeu:
      'Débloquer en quelques minutes les écritures de l’application de virements, puis corriger durablement la requête de reporting en cause sans nouvelle interruption.',
    contexte:
      'Jeudi 29 octobre, 14h01 : l’API de virements de Banque Alpha, adossée à une base PostgreSQL (table operations : 182,4 millions de lignes, 96 Go), dépasse ses délais de réponse. Les guichets signalent des virements « en attente » et le pool de connexions applicatif est presque saturé (191 connexions actives sur 200). Le processeur du serveur n’est pourtant chargé qu’à 35 %. Ta collègue Mme Kabeya t’envoie un extrait de pg_stat_activity et le plan d’exécution d’une requête de l’outil de pilotage (BI), capturé par auto_explain lors de son exécution. Elle ajoute qu’une mise en production applicative était programmée « vers 14h00 » par l’équipe de développement. Le responsable de la production attend ta décision.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'pg_stat_activity + pg_blocking_pids() — relevé de 14h02',
        colonnes: ['pid', 'Utilisateur', 'Application', 'État', 'Début transaction', 'Attente', 'Bloqué par', 'Requête (tronquée)'],
        lignes: [
          ['41207', 'rpt_bi', 'outil-bi', 'idle in transaction', '13:52:10', 'Client / ClientRead', '—', "SELECT agence_id, count(*), sum(montant) FROM operations WHERE statut = 'REJETEE' AND date_operation >= '2026-10-01' GROUP BY agence_id"],
          ['41388', 'deploy_ci', 'pipeline-ci', 'active', '13:58:02', 'Lock / relation', '{41207}', 'ALTER TABLE operations ADD COLUMN code_motif varchar(10)'],
          ['41390', 'app_virements', 'api-virements', 'active', '13:58:03', 'Lock / relation', '{41388}', 'INSERT INTO operations (compte_id, montant, devise, …) VALUES ($1, $2, $3, …)'],
          ['41391', 'app_virements', 'api-virements', 'active', '13:58:03', 'Lock / relation', '{41388}', 'INSERT INTO operations (compte_id, montant, devise, …) VALUES ($1, $2, $3, …)'],
          ['41402', 'app_virements', 'api-virements', 'active', '13:58:05', 'Lock / relation', '{41388}', "UPDATE operations SET statut = 'VALIDEE' WHERE id = $1"],
          ['…', 'app_virements', 'api-virements', 'active', '13:58-14:02', 'Lock / relation', '{41388}', '184 autres sessions en attente sur la table operations'],
        ],
      },
      {
        type: 'texte',
        titre: 'Plan d’exécution de la requête 41207 (auto_explain, EXPLAIN ANALYZE + BUFFERS, coûts masqués)',
        contenu:
          "HashAggregate (actual time=412347.902..412348.115 rows=212 loops=1)\n  Group Key: agence_id\n  Batches: 1  Memory Usage: 64kB\n  Buffers: shared hit=1204113 read=11378799\n  ->  Seq Scan on operations (actual time=18.204..412301.557 rows=41230 loops=1)\n        Filter: ((date_operation >= '2026-10-01'::date) AND ((statut)::text = 'REJETEE'::text))\n        Rows Removed by Filter: 182358770\n        Buffers: shared hit=1204113 read=11378799\nPlanning Time: 0.412 ms\nExecution Time: 412351.207 ms\n\n-- Index existants sur operations : operations_pkey (id), idx_operations_compte (compte_id)\n-- Taille de la table : 96 Go, soit 12 582 912 pages de 8 Ko\n-- Volumétrie : ≈ 450 000 opérations par jour, ≈ 0,35 % au statut REJETEE",
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Qu’est-ce qui bloque réellement les INSERT et UPDATE de l’application de virements ?',
        options: [
          {
            id: 'a',
            texte:
              'La requête du rapport BI pose un verrou de lecture sur toute la table operations pendant son parcours séquentiel de 96 Go, et ce verrou empêche directement toute écriture.',
            points: 1,
            feedback:
              'Fausse croyance fréquente : sous PostgreSQL, un SELECT ne pose qu’un verrou `ACCESS SHARE`, compatible avec le `ROW EXCLUSIVE` des INSERT et UPDATE (MVCC : les lecteurs ne bloquent pas les écrivains). D’ailleurs, `pg_blocking_pids` désigne 41388, pas 41207, comme bloqueur des sessions applicatives.',
          },
          {
            id: 'b',
            texte:
              'Les sessions applicatives se bloquent entre elles sur les mêmes lignes de la table operations : une contention de lignes classique en pleine charge de virements.',
            points: 0,
            feedback:
              'Un conflit entre lignes apparaîtrait comme une attente `Lock / transactionid` entre sessions applicatives. Ici, toutes attendent un verrou de niveau table (`relation`) et pointent vers la même session, 41388.',
          },
          {
            id: 'c',
            texte:
              'Les disques sont saturés par le parcours complet des 96 Go de la table et le cache est vidé : c’est un problème de performance des entrées-sorties, pas de verrou.',
            points: 1,
            feedback:
              'Le parcours séquentiel de 96 Go a bien pesé sur les disques et sur le cache pendant près de 7 minutes. Mais il est terminé (la session est « idle in transaction ») et les sessions applicatives attendent un verrou (`Lock / relation`), pas une lecture disque. Le processeur à 35 % confirme qu’on attend, on ne calcule pas.',
          },
          {
            id: 'd',
            texte:
              'Une chaîne : la session BI 41207 (« idle in transaction ») garde son verrou, l’`ALTER TABLE` 41388 attend derrière elle, et les requêtes suivantes attendent l’`ALTER`.',
            points: 4,
            feedback:
              'Exact. C’est le piège classique de PostgreSQL : une demande de verrou `ACCESS EXCLUSIVE` en attente bloque toutes les demandes suivantes sur la table, y compris de simples lectures. La tête de chaîne est une transaction BI jamais terminée (l’outil a ouvert une transaction sans la valider), le déclencheur est un DDL lancé sans `lock_timeout` en pleine journée.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Il est 14h04. Quelle action immédiate décides-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Annuler l’`ALTER TABLE` (`pg_cancel_backend(41388)`) pour libérer la file, puis terminer la session BI 41207 et faire reprogrammer la mise en production.',
            points: 4,
            feedback:
              'C’est l’action la plus ciblée : on retire le maillon qui bloque la file, sans toucher aux transactions de paiement. La session BI ne détient qu’un verrou de lecture : la terminer ensuite (`pg_terminate_backend`, car une session inactive n’a pas de requête à annuler) évite que le blocage ne se reproduise. Le DDL non validé n’a rien à faire en production à 14h00.',
          },
          {
            id: 'b',
            texte:
              'Redémarrer le service PostgreSQL : toutes les sessions et tous les verrous sont libérés d’un coup, et l’application de virements se reconnecte d’elle-même.',
            points: 0,
            feedback:
              'Un redémarrage coupe les 191 connexions, annule toutes les transactions en cours (y compris des virements) et impose une reprise après arrêt brutal. C’est disproportionné quand le coupable est identifié par un pid.',
          },
          {
            id: 'c',
            texte:
              'Terminer uniquement la session BI 41207 : son verrou disparaît, l’`ALTER TABLE` passe aussitôt (colonne sans valeur par défaut), puis les virements reprennent.',
            points: 2,
            feedback:
              'Techniquement, les écritures reprendraient très vite (l’ajout d’une colonne sans valeur par défaut est quasi instantané). Mais tu laisses s’exécuter en pleine journée un changement de structure non validé, lancé en dehors de toute fenêtre de maintenance : ce n’est pas au DBA de permanence de l’entériner par défaut.',
          },
          {
            id: 'd',
            texte:
              'Terminer toutes les sessions app_virements en attente avec `pg_terminate_backend` pour libérer le pool de connexions et repartir sur des sessions neuves.',
            points: 0,
            feedback:
              'Tu t’attaques aux victimes : leurs transactions sont annulées, l’application se reconnecte aussitôt et retombe dans la même file d’attente, puisque la chaîne 41207 → 41388 est toujours en place.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Que révèle le plan d’exécution de la requête BI, et quelle correction proposes-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Le tri et l’agrégation manquent de mémoire et débordent sur disque : il faut augmenter `work_mem` pour cette requête, par exemple à 256 Mo dans la session BI.',
            points: 0,
            feedback:
              'Il n’y a aucun tri sur disque : l’agrégation tient en 64 Ko de mémoire. Le temps est entièrement passé dans le Seq Scan (412 secondes) à lire 12,6 millions de pages.',
          },
          {
            id: 'b',
            texte:
              'La table est gonflée par des millions de lignes mortes que l’autovacuum n’a pas suivies : il faut lancer un `VACUUM FULL operations` ce soir pour la compacter.',
            points: 0,
            feedback:
              'Rien dans le plan n’indique un gonflement anormal, et `VACUUM FULL` réécrit les 96 Go sous verrou `ACCESS EXCLUSIVE` : il bloquerait toute la table pendant de longues minutes. Ce serait recréer l’incident.',
          },
          {
            id: 'c',
            texte:
              'Créer tout de suite un index sur `date_operation` avec un `CREATE INDEX` classique, puisque le filtre du rapport porte sur une plage de dates.',
            points: 1,
            feedback:
              'Un `CREATE INDEX` classique bloque les écritures sur la table pendant toute sa construction : sur 96 Go en pleine journée, c’est un nouvel incident. De plus, la condition sur la date seule sélectionne encore environ 11,7 millions de lignes (6,4 % de la table) : l’index serait peu sélectif.',
          },
          {
            id: 'd',
            texte:
              'Index manquant : 41 230 lignes (0,02 %) lues par un parcours complet de 96 Go. Index `(statut, date_operation)` ou partiel sur `statut = \'REJETEE\'`, créé `CONCURRENTLY` hors pic.',
            points: 4,
            feedback:
              'Exact. « Rows Removed by Filter: 182 358 770 » pour 41 230 lignes retenues est la signature d’un index manquant. On place la colonne d’égalité (`statut`) avant la colonne de plage (`date_operation`) ; l’index partiel est encore plus compact si le rapport ne porte que sur les rejets. `CONCURRENTLY` évite de bloquer les écritures pendant la construction.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre la mise en place de l’index en production.',
        elements: [
          { id: 'creer', texte: 'Créer l’index en production avec CREATE INDEX CONCURRENTLY, en heure creuse' },
          { id: 'suivre', texte: 'Contrôler par EXPLAIN que la requête du rapport utilise l’index, puis suivre son usage (pg_stat_user_indexes)' },
          { id: 'tester', texte: 'Tester sur une copie représentative : créer l’index et comparer EXPLAIN (ANALYZE, BUFFERS) avant et après' },
          { id: 'valider', texte: 'Faire valider le changement en comité, avec un plan de retour arrière (DROP INDEX CONCURRENTLY)' },
          { id: 'valide', texte: 'Vérifier que l’index est valide (pg_index.indisvalid) ; sinon le supprimer et recommencer' },
        ],
        ordreCorrect: ['tester', 'valider', 'creer', 'valide', 'suivre'],
        pointsMax: 4,
        feedback:
          'On mesure le gain sur une copie avant de toucher à la production, puis on passe par la gestion des changements avec un retour arrière prévu. Une création `CONCURRENTLY` peut échouer (conflit, interruption) en laissant un index marqué invalide, qui coûte en écriture sans servir aux lectures : il faut donc le vérifier avant de contrôler le plan et le suivi d’usage.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle mesure durable proposes-tu pour que le reporting ne menace plus jamais les virements ?',
        options: [
          {
            id: 'a',
            texte:
              'Interdire purement et simplement les requêtes BI sur les données de production : face aux virements, le pilotage n’est pas prioritaire et le risque disparaît totalement.',
            points: 0,
            feedback:
              'Le pilotage est un besoin légitime de la banque. Le rôle du DBA est de l’isoler et de l’encadrer, pas de l’interdire : les équipes contourneraient la règle par des extractions sauvages, encore moins maîtrisées.',
          },
          {
            id: 'b',
            texte:
              'Reporting sur une réplique en lecture seule avec un rôle dédié, `statement_timeout` et `idle_in_transaction_session_timeout`, et `lock_timeout` imposé à tout DDL.',
            points: 3,
            feedback:
              'C’est la réponse complète : la charge analytique quitte le primaire, les sessions BI oubliées sont coupées automatiquement, et un DDL qui n’obtient pas son verrou en quelques secondes échoue proprement au lieu de bloquer la file. Sur une réplique, il faudra arbitrer les conflits entre requêtes longues et rejeu (`max_standby_streaming_delay`, `hot_standby_feedback`).',
          },
          {
            id: 'c',
            texte:
              'Programmer le rapport BI uniquement la nuit, sur le serveur primaire, quand le volume de virements est faible et que les verrous ne gênent plus personne.',
            points: 1,
            feedback:
              'Cela réduit le risque en journée, mais la nuit est aussi le moment des traitements par lots et des sauvegardes. Sans délai maximal ni `lock_timeout`, le même enchaînement peut se reproduire à 02h00.',
          },
          {
            id: 'd',
            texte:
              'Donner à l’équipe BI le rôle superutilisateur pour qu’elle puisse surveiller `pg_stat_activity` et arrêter elle-même ses requêtes bloquantes sans attendre le DBA.',
            points: 0,
            feedback:
              'Accorder le superutilisateur pour un besoin de lecture viole le principe du moindre privilège et expose toutes les données bancaires. Ce n’est pas une mesure de performance, c’est un risque de sécurité majeur.',
          },
        ],
      },
    ],
    pointsMax: 19,
    debrief:
      'Le cas mêle verrous, plan d’exécution et gouvernance des changements : le jury attend que tu lises les pièces au lieu de supposer.\n• Lecture de `pg_stat_activity` : les sessions applicatives attendent un verrou de table (`Lock / relation`) et pointent toutes vers 41388 (l’`ALTER TABLE`), qui pointe lui-même vers 41207 (la session BI « idle in transaction » depuis la fin de sa requête).\n• Mécanisme : sous PostgreSQL, les lecteurs ne bloquent pas les écrivains, mais une demande de verrou `ACCESS EXCLUSIVE` en attente fait la queue et bloque toutes les demandes suivantes, même compatibles avec les verrous déjà accordés.\n• Action immédiate : annuler l’`ALTER TABLE` (`pg_cancel_backend`) libère la file instantanément ; on termine ensuite la session BI et on reprogramme la mise en production. Redémarrer l’instance ou tuer les sessions applicatives revient à frapper les victimes.\n• Plan d’exécution : 412 secondes de Seq Scan, 12,6 millions de pages lues pour 41 230 lignes (0,02 %). Index composite `(statut, date_operation)` ou index partiel, créé `CONCURRENTLY`, testé avant, validé en comité, vérifié après (`indisvalid`).\n• Pièges : `VACUUM FULL` et `CREATE INDEX` classique, qui posent des verrous lourds sur une table de 96 Go en pleine journée ; un index sur la date seule, peu sélectif.\n• Mesures durables : réplique en lecture pour le pilotage, `statement_timeout` et `idle_in_transaction_session_timeout` pour les comptes BI, `lock_timeout` obligatoire pour tout DDL, mises en production structurelles en fenêtre de maintenance uniquement.\nCe qu’attend un jury de banque centrale : une action minimale et réversible sur la cause exacte, la préservation des transactions de paiement en cours et une correction passée par la gestion des changements.\nRéflexes à retenir :\n• Remonte toujours la chaîne de blocage jusqu’à sa tête avec `pg_blocking_pids()`.\n• Un DDL en production se lance avec un `lock_timeout` court, en fenêtre de maintenance.\n• « Rows Removed by Filter » très supérieur aux lignes retenues = index manquant ou inadapté.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BDD-CAS-03 — Table supprimée par erreur : restauration à un instant précis
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'BDD-CAS-03',
    filiere: 'bdd',
    titre: 'Table des mandats supprimée par erreur en production',
    role: 'DBA référent sauvegardes — Direction informatique, Banque Alpha',
    heure: 'Mercredi, 15h52',
    enjeu:
      'Récupérer la table des mandats de prélèvement telle qu’elle était juste avant sa suppression, sans sacrifier les autres transactions de la journée.',
    contexte:
      'Mercredi 28 octobre, 15h52. L’équipe des prélèvements de Banque Alpha signale que l’application ne trouve plus aucun mandat : depuis 15h47, chaque création ou consultation de mandat échoue. Le journal du serveur PostgreSQL montre qu’un script de déploiement destiné à l’environnement de recette a été exécuté par erreur sur la production. Pendant ce temps, le reste de la base (comptes, virements, échéances) continue d’être alimenté normalement. Le responsable de l’application, M. Mutombo, te demande ce qui est récupérable, en combien de temps et avec quelle méthode. La sauvegarde de base de la nuit et l’archivage continu des journaux de transactions (WAL) sont en place.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Journal du serveur PostgreSQL pg-prod-01 (extrait, log_statement = ddl)',
        lignes: [
          '2026-10-28 15:47:12.384 WAT [52114] user=deploy_recette db=core app=psql host=10.40.2.18 LOG:  statement: DROP TABLE mandats_prelevement CASCADE;',
          '2026-10-28 15:47:12.386 WAT [52114] NOTICE:  drop cascades to 2 other objects',
          '2026-10-28 15:47:12.386 WAT [52114] DETAIL:  drop cascades to constraint fk_echeances_mandat on table echeances_prelevement',
          '        drop cascades to view v_mandats_actifs',
          '2026-10-28 15:47:13.020 WAT [52201] user=app_prelev db=core ERROR:  relation "mandats_prelevement" does not exist at character 13',
          '2026-10-28 15:47:13.020 WAT [52201] STATEMENT:  INSERT INTO mandats_prelevement (reference, compte_id, creancier_id, plafond) VALUES ($1, $2, $3, $4)',
          '# … 1 312 erreurs « relation does not exist » entre 15:47:13 et 15:52:00 …',
        ],
      },
      {
        type: 'table',
        titre: 'Inventaire des sauvegardes et objectifs (serveur bkp-01)',
        colonnes: ['Élément', 'Valeur'],
        lignes: [
          ['Sauvegarde de base (pg_basebackup)', '28/10 à 01h00, terminée à 01h52, 420 Go, statut OK'],
          ['Archivage des WAL', 'Continu, dernier segment archivé à 15h51, aucun échec'],
          ['WAL archivés de 01h00 à 15h47', '1 840 segments de 16 Mo'],
          ['Débit de copie bkp-01 → serveur de restauration', '250 Mo/s (mesuré)'],
          ['Débit de rejeu des WAL (dernier test)', '≈ 60 Mo/s'],
          ['Extraction puis rechargement de la table (≈ 2,1 M lignes)', '≈ 6 min (mesuré en recette)'],
          ['Dernier test de restauration complète', '14/09/2026 : réussi en 41 min'],
          ['Réplique de secours pg-rep-02', 'Réplication en continu, retard < 1 s'],
          ['Objectifs de l’application Prélèvements', 'RPO 5 min, RTO 2 h'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Il est 15h52. Quel est ton premier réflexe ?',
        options: [
          {
            id: 'a',
            texte:
              'Recréer immédiatement la table vide à partir du script de création versionné, pour que l’application cesse de renvoyer des erreurs et que les nouveaux mandats passent.',
            points: 1,
            feedback:
              'L’intention (rétablir vite le service) se comprend, mais la table vide recevrait de nouveaux mandats qu’il faudra fusionner avec les anciens. Pire : la séquence propriétaire de la table a été supprimée avec elle, une séquence recréée repartirait de 1 et produirait des identifiants en collision avec les mandats restaurés.',
          },
          {
            id: 'b',
            texte:
              'Établir les faits et protéger les moyens de restauration : heure exacte du `DROP`, WAL et sauvegarde de 01h00 préservés, accès de deploy_recette coupé, incident déclaré.',
            points: 3,
            feedback:
              'C’est le bon réflexe : l’heure exacte (15:47:12.384) fixe la cible de restauration, les sauvegardes sont la seule voie de retour et ne doivent surtout pas être purgées, et on empêche une seconde erreur du même compte. On ne lance aucune restauration avant d’avoir ces éléments.',
          },
          {
            id: 'c',
            texte:
              'Demander à l’équipe métier de ressaisir les mandats à partir des formulaires papier et des courriels clients, en commençant par ceux dont l’échéance tombe dès cette semaine.',
            points: 0,
            feedback:
              'Environ 2,1 millions de mandats : la ressaisie est irréaliste, source d’erreurs, et inutile puisque l’archivage des WAL permet de tout récupérer jusqu’à la seconde près.',
          },
          {
            id: 'd',
            texte:
              'Lancer tout de suite une restauration complète de la production à 15h47, à partir de la sauvegarde de 01h00 et des WAL archivés, avant que les erreurs ne s’accumulent davantage.',
            points: 1,
            feedback:
              'Agir avant d’avoir vérifié la cible et l’état des sauvegardes est risqué. Et surtout, ramener toute la base à 15h47 effacerait les virements et échéances légitimes enregistrés depuis : voir l’étape suivante.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Quelle stratégie de restauration retiens-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Restaurer toute l’instance de production à 15:47:12, juste avant la suppression, grâce à la sauvegarde de 01h00 et aux WAL archivés : la base revient dans un état cohérent.',
            points: 1,
            feedback:
              'La table serait récupérée, mais toutes les autres transactions passées depuis 15:47:12 (virements, échéances) seraient perdues, et la production serait arrêtée pendant toute la restauration. On ne remonte pas le temps de toute une base pour une seule table.',
          },
          {
            id: 'b',
            texte:
              'Extraire la table depuis la réplique de secours pg-rep-02 : elle a un peu de retard sur le primaire, donc la table y est encore présente et il suffit de l’exporter.',
            points: 0,
            feedback:
              'La réplique a rejoué le `DROP` moins d’une seconde après le primaire : la table n’y existe plus. Une réplique protège contre la panne matérielle, pas contre l’erreur humaine. La réplication n’est pas une sauvegarde.',
          },
          {
            id: 'c',
            texte:
              'Restaurer la sauvegarde de 01h00 seule sur un serveur à part, sans toucher à la production, puis exporter la table et la réinjecter en production.',
            points: 1,
            feedback:
              'La méthode d’isolement est bonne, mais sans rejeu des WAL, tous les mandats créés ou modifiés entre 01h00 et 15h47 seraient perdus. L’archivage continu existe justement pour éviter cette perte.',
          },
          {
            id: 'd',
            texte:
              'Restaurer la sauvegarde de 01h00 sur une instance isolée, rejouer les WAL jusqu’à juste avant le `DROP` (en pause), vérifier, puis recharger la seule table en production.',
            points: 4,
            feedback:
              'C’est la restauration à un instant précis (PITR) appliquée à un objet : la production continue de tourner, la table revient dans l’état exact de 15:47:12, et la pause permet de contrôler avant d’extraire. Une cible encore plus fine est possible avec l’identifiant de transaction du `DROP` (`recovery_target_xid`).',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'M. Mutombo demande une estimation de durée. À partir de l’inventaire, que lui annonces-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Environ 29 minutes : c’est le temps de copier les 420 Go de la sauvegarde à 250 Mo/s, le reste des opérations étant négligeable.',
            points: 1,
            feedback:
              'La copie dure bien environ 29 minutes (420 × 1 024 / 250 ≈ 1 720 s), mais tu oublies le rejeu des WAL et l’extraction-rechargement de la table. Une estimation incomplète crée une fausse attente chez le métier.',
          },
          {
            id: 'b',
            texte:
              'Environ 43 minutes (copie 29 min, rejeu des WAL 8 min, extraction et rechargement 6 min) : j’annonce moins d’une heure.',
            points: 3,
            feedback:
              'Exact, et cohérent avec le dernier test réussi (41 minutes) : c’est tout l’intérêt de tester ses restaurations. Annoncer un délai avec une marge, plutôt que le calcul au plus juste, protège ta crédibilité si une étape prend plus de temps que prévu.',
          },
          {
            id: 'c',
            texte:
              'Environ 3 h 50 : 420 Go × 8 / 250 = 13 763 secondes de copie, plus le rejeu et le rechargement ; l’objectif de 2 h sera dépassé.',
            points: 0,
            feedback:
              'Confusion entre bits et octets : le débit mesuré est de 250 Mo/s (mégaoctets par seconde), pas 250 Mbit/s. Multiplier par 8 surestime la copie d’un facteur 8 et fait croire à tort que l’objectif de 2 h sera dépassé.',
          },
          {
            id: 'd',
            texte: 'Impossible à estimer : trop de facteurs dépendent du réseau et du stockage, je réponds donc « dès que possible » pour ne pas m’engager.',
            points: 0,
            feedback:
              'Les débits mesurés et le test de restauration existent précisément pour répondre à cette question. Le métier doit décider (communication aux clients, report de traitements) sur la base d’un délai chiffré.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre les étapes de la restauration.',
        elements: [
          { id: 'verifier', texte: 'Vérifier la table restaurée : nombre de lignes, derniers mandats créés, cohérence avec le journal applicatif' },
          { id: 'configurer', texte: 'Configurer la récupération : commande de lecture des WAL archivés, cible juste avant 15:47:12, pause à l’arrivée' },
          { id: 'recharger', texte: 'Exporter la table et la recharger en production avec index, séquence et droits, puis recréer la contrainte et la vue supprimées' },
          { id: 'preparer', texte: 'Préparer une instance isolée, hors production, et y copier la sauvegarde de base de 01h00' },
          { id: 'cloturer', texte: 'Faire valider par le métier, rejouer les mandats refusés depuis 15h47 et documenter l’incident' },
          { id: 'rejouer', texte: 'Démarrer l’instance et laisser rejouer les WAL jusqu’à la cible' },
        ],
        ordreCorrect: ['preparer', 'configurer', 'rejouer', 'verifier', 'recharger', 'cloturer'],
        pointsMax: 5,
        feedback:
          'La configuration de la cible doit être en place avant le démarrage, sinon l’instance rejouerait tous les WAL disponibles, `DROP` compris. La vérification se fait pendant la pause, avant toute extraction. Au rechargement, n’oublie pas les objets supprimés par `CASCADE` (la clé étrangère de echeances_prelevement et la vue v_mandats_actifs). Enfin, les créations de mandats refusées depuis 15h47 (les erreurs se comptaient déjà par centaines à 15h52) doivent être rejouées ou traitées avec le métier.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle mesure de prévention recommandes-tu en priorité dans le rapport d’incident ?',
        options: [
          {
            id: 'a',
            texte:
              'Passer à une sauvegarde de base toutes les heures au lieu d’une par nuit, pour réduire les WAL à rejouer et donc la durée d’une prochaine restauration.',
            points: 0,
            feedback:
              'La restauration a fonctionné grâce aux WAL : la fréquence des sauvegardes de base n’était pas le problème. La cause est qu’un compte de recette a pu supprimer une table de production.',
          },
          {
            id: 'b',
            texte:
              'Ajouter une réplique avec un retard de rejeu volontaire d’une heure (`recovery_min_apply_delay`), pour récupérer une table supprimée en quelques minutes.',
            points: 2,
            feedback:
              'C’est un excellent complément : face à une erreur humaine, une réplique retardée permet de récupérer une table en quelques minutes. Mais elle ne traite pas la cause, à savoir des droits et des identifiants de recette valides en production.',
          },
          {
            id: 'c',
            texte:
              'Cloisonner recette et production, retirer aux comptes applicatifs la propriété des tables, valider tout changement et tester les restaurations.',
            points: 3,
            feedback:
              'C’est la réponse de fond : moindre privilège (seul le propriétaire d’une table ou un superutilisateur peut la supprimer), cloisonnement réseau et applicatif entre recette et production, gestion des changements, et preuve régulière que la restauration fonctionne.',
          },
          {
            id: 'd',
            texte: 'Sanctionner le développeur pour l’exemple, afin que chacun mesure la gravité d’une commande lancée sur la mauvaise base de données.',
            points: 0,
            feedback:
              'Une sanction ne corrige pas le système qui a permis l’erreur : le prochain développeur commettra la même. Un retour d’expérience sans recherche de coupable fait remonter les vraies causes.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'La compétence évaluée est la restauration à un instant précis (PITR) d’un seul objet, sans pénaliser le reste de la base.\n• Établir les faits d’abord : le journal (`log_statement = ddl`) donne l’instant exact du `DROP` (15:47:12.384), le compte (deploy_recette) et les objets emportés par `CASCADE` (une clé étrangère et une vue).\n• Stratégie : sauvegarde de base de 01h00 restaurée sur une instance isolée, WAL rejoués jusqu’à juste avant le `DROP`, pause pour vérifier, puis export de la table et rechargement en production. La production continue de tourner pendant ce temps.\n• Estimation : copie ≈ 29 min (420 Go à 250 Mo/s), rejeu ≈ 8 min (28,75 Go à 60 Mo/s), extraction et rechargement ≈ 6 min, soit environ 43 min, cohérent avec le test de septembre (41 min) et sous le RTO de 2 h. Grâce aux WAL, aucun mandat validé avant la suppression n’est perdu.\n• Pièges : restaurer toute l’instance (perte des autres transactions de la journée) ; compter sur la réplique, qui a rejoué le `DROP` aussitôt ; recréer une table vide dont la séquence repartirait de 1 ; confondre Mo/s et Mbit/s dans l’estimation.\n• Après la restauration : recréer la contrainte `fk_echeances_mandat` et la vue `v_mandats_actifs`, puis traiter avec le métier les créations de mandats refusées pendant toute la durée de l’incident.\n• Prévention : identifiants et accès réseau séparés entre recette et production, comptes applicatifs non propriétaires des tables, changements passés par un circuit validé, réplique retardée en complément, tests de restauration réguliers.\nCe qu’attend un jury de banque centrale : du calme, une décision fondée sur les pièces, une estimation chiffrée et tenue, et la conviction qu’une sauvegarde ne vaut que par la restauration qu’on a testée.\nRéflexes à retenir :\n• La réplication n’est pas une sauvegarde : elle propage les erreurs.\n• Restaure à côté, vérifie, puis réinjecte : on ne remonte pas le temps de toute une base pour une table.\n• Un RTO se démontre par un test chronométré, pas par une promesse.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BDD-CAS-04 — Panne du primaire : bascule, split-brain et accès privilégiés
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'BDD-CAS-04',
    filiere: 'bdd',
    titre: 'Panne du primaire en pleine nuit : bascule sous contrôle',
    role: 'DBA d’astreinte — Direction informatique, Banque Alpha',
    heure: 'Mardi, 02h21',
    enjeu:
      'Rétablir la base des opérations sur une réplique sans créer deux primaires concurrents, en mesurant honnêtement les données perdues et en expliquant pourquoi elles l’ont été.',
    contexte:
      'Nuit du lundi 26 au mardi 27 octobre. À 02h14, la supervision déclare injoignable pg-prim-01 (10.20.0.11), le serveur PostgreSQL primaire de la base des opérations de Banque Alpha, en plein traitement par lots du calcul des intérêts mensuels. Deux répliques en streaming sont disponibles : pg-rep-02, dans la même salle, normalement synchrone, et pg-rep-03, sur le site de secours, asynchrone. Il n’existe pas d’outil de bascule automatique : la procédure est manuelle. L’exploitant de nuit, M. Tshibangu, t’a réveillé : les virements instantanés renvoient des erreurs et le traitement par lots est en échec. Avant de basculer, tu consultes les journaux et l’état des répliques.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Chronologie : journal d’audit des accès privilégiés, journaux PostgreSQL et supervision',
        lignes: [
          "01:41:07  [audit pg-prim-01]  user=postgres client=10.50.3.27 (plage VPN prestataires) app=psql  ALTER SYSTEM SET synchronous_standby_names = '';",
          '01:41:09  [audit pg-prim-01]  user=postgres client=10.50.3.27 app=psql  SELECT pg_reload_conf();',
          '01:41:09  [pg-prim-01]  LOG:  received SIGHUP, reloading configuration files',
          '01:41:09  [pg-prim-01]  LOG:  parameter "synchronous_standby_names" changed to ""',
          '02:00:00  [ordonnanceur]  Démarrage BATCH-INTERETS-MENSUELS (1,2 million de comptes)',
          '02:13:50  [supervision]  pg_stat_replication : pg-rep-02 sync_state=async replay_lag=0.4 s | pg-rep-03 sync_state=async replay_lag=47 s',
          '02:14:06  [supervision]  pg-prim-01 (10.20.0.11) : ping KO, port 5432 KO',
          '02:15:06  [pg-rep-02]  FATAL:  terminating walreceiver due to timeout',
          '02:15:07  [pg-rep-03]  FATAL:  terminating walreceiver due to timeout',
          '02:16:30  [console hors bande de pg-prim-01]  Alimentation : ON — interface réseau de production : lien DOWN (port du commutateur en erreur)',
          '02:19:12  [ordonnanceur]  BATCH-INTERETS-MENSUELS en échec au lot 412/1 200 (connexion perdue)',
        ],
      },
      {
        type: 'table',
        titre: 'État des répliques — relevé de 02h20 (pg_last_wal_receive_lsn / pg_last_wal_replay_lsn)',
        colonnes: ['Serveur', 'Site', 'Dernier LSN reçu', 'Dernier LSN rejoué', 'Retard avant la panne (02h13:50)', 'Mode attendu (configuration de référence)'],
        lignes: [
          ['pg-rep-02 (10.20.0.12)', 'Salle principale', '3A/7F2C1E88', '3A/7F2C1E88', '0,4 s', 'synchrone'],
          ['pg-rep-03 (10.30.0.13)', 'Site de secours', '3A/7C001000', '3A/7BF0A2D0', '47 s', 'asynchrone'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Il est 02h21. Quelle est ta toute première action ?',
        options: [
          {
            id: 'a',
            texte:
              'Promouvoir pg-rep-02 immédiatement, sans attendre de diagnostic plus poussé : chaque minute d’indisponibilité des virements instantanés compte pour les clients.',
            points: 1,
            feedback:
              'La cible est probablement la bonne, mais la console indique que pg-prim-01 est toujours sous tension : seul son lien réseau est tombé. Si le port du commutateur revient, des applications pourraient s’y reconnecter et écrire pendant que pg-rep-02 écrit aussi. C’est le split-brain : deux primaires, deux versions divergentes des comptes.',
          },
          {
            id: 'b',
            texte:
              'Attendre que pg-prim-01 revienne de lui-même : le réseau finira par être rétabli, et une bascule en pleine nuit fait courir plus de risques qu’elle n’en évite.',
            points: 0,
            feedback:
              'Attendre sans délai fixé laisse les virements instantanés en panne pour une durée inconnue, alors qu’une réplique à jour est disponible. La procédure de bascule existe précisément pour ce cas.',
          },
          {
            id: 'c',
            texte:
              'Isoler pg-prim-01 (fencing) : hors tension via la console hors bande, retrait de l’adresse virtuelle, incident déclaré ; seulement ensuite, promouvoir.',
            points: 4,
            feedback:
              'Exact. Un primaire « injoignable » n’est pas forcément arrêté : la console prouve qu’il tourne encore. On le neutralise de façon certaine avant d’en créer un autre ; c’est la règle d’or contre le split-brain. Ses disques sont conservés intacts : ils serviront à analyser les transactions perdues.',
          },
          {
            id: 'd',
            texte:
              'Redémarrer le commutateur pour rétablir le lien de pg-prim-01 : si le port revient, le primaire reprend son rôle sans bascule ni la moindre perte de données.',
            points: 1,
            feedback:
              'Cela peut résoudre la panne si le port est seul en cause, mais redémarrer un commutateur en production coupe d’autres serveurs et relève de l’équipe réseau. Surtout, cela ne règle pas la question de fond : tant que la décision de basculer n’est pas prise, il faut garantir qu’un seul primaire existera.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Quelle réplique promeus-tu, d’après le relevé de 02h20 ?',
        options: [
          {
            id: 'a',
            texte:
              'pg-rep-02, la plus avancée (LSN reçu et rejoué 3A/7F2C1E88) ; pg-rep-03 sera raccrochée à elle.',
            points: 3,
            feedback:
              'Exact. pg-rep-02 a reçu environ 50,8 Mo de WAL de plus que pg-rep-03 (0x7F2C1E88 − 0x7C001000 = 53 218 952 octets). Promouvoir pg-rep-03 ferait perdre ces transactions en plus. pg-rep-03, en retard sur le point de bascule, pourra suivre la nouvelle chronologie (timeline) de pg-rep-02.',
          },
          {
            id: 'b',
            texte:
              'pg-rep-03, car elle est sur le site de secours, à l’abri d’un éventuel problème de la salle principale.',
            points: 0,
            feedback:
              'Le critère de choix est d’abord la donnée : pg-rep-03 a environ 50,8 Mo de WAL de retard en réception, soit plusieurs dizaines de secondes de transactions que la banque perdrait inutilement. La salle principale n’est pas en cause (seul un port réseau est en erreur).',
          },
          {
            id: 'c',
            texte:
              'Les deux en même temps, pour répartir la charge des écritures entre les deux sites et ne perdre aucune transaction.',
            points: 0,
            feedback:
              'Deux répliques promues deviennent deux primaires indépendants qui divergent dès la première écriture : c’est créer volontairement le split-brain. La réplication en streaming de PostgreSQL n’a qu’un seul primaire en écriture.',
          },
          {
            id: 'd',
            texte:
              'pg-rep-03, après avoir attendu qu’elle rejoue tout ce qu’elle a reçu, pour rester sur le site de secours.',
            points: 1,
            feedback:
              'Attendre le rejeu complet est un bon réflexe avant toute promotion, mais cela ne rattrape pas ce que pg-rep-03 n’a jamais reçu : elle resterait environ 50,8 Mo derrière pg-rep-02.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre la procédure de bascule manuelle.',
        elements: [
          { id: 'promouvoir', texte: 'Promouvoir pg-rep-02 et faire pointer l’adresse virtuelle de service vers elle' },
          { id: 'reconstruire', texte: 'Copier les données de l’ancien primaire pour analyse, puis le reconstruire en réplique avant toute remise en service' },
          { id: 'isoler', texte: 'Isoler l’ancien primaire : mise hors tension par la console hors bande, retrait de l’adresse virtuelle' },
          { id: 'comparer', texte: 'Comparer les LSN reçus et rejoués des répliques, laisser finir le rejeu et choisir la plus avancée' },
          { id: 'raccrocher', texte: 'Raccrocher pg-rep-03 au nouveau primaire et rétablir une réplique synchrone' },
          { id: 'confirmer', texte: 'Confirmer la panne par plusieurs sources (supervision, console hors bande, journaux des répliques)' },
        ],
        ordreCorrect: ['confirmer', 'isoler', 'comparer', 'promouvoir', 'raccrocher', 'reconstruire'],
        pointsMax: 5,
        feedback:
          'On confirme, puis on isole avant toute promotion : c’est l’ordre qui rend le split-brain impossible. Le choix de la réplique se fonde sur les LSN, et la promotion s’accompagne de la bascule de l’adresse de service pour que les applications suivent. On restaure ensuite la redondance (pg-rep-03 raccrochée, mode synchrone rétabli). L’ancien primaire passe en dernier : il contient peut-être des transactions jamais transmises, qu’il faut copier pour analyse avant qu’un `pg_rewind` ou une reconstruction ne les efface.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Le journal d’audit montre qu’à 01h41 la réplication synchrone a été désactivée. Quelles conséquences en tires-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Je rétablis `synchronous_standby_names` sur le nouveau primaire, je vérifie que pg-rep-03 confirme bien chaque validation, puis je considère l’incident clos puisque la bascule a réussi.',
            points: 2,
            feedback:
              'La correction technique est nécessaire, mais tu passes à côté de deux conséquences : les transactions validées sur pg-prim-01 après le dernier LSN reçu par pg-rep-02 sont perdues pour la nouvelle production, et une modification de configuration critique a été faite en pleine nuit par un compte partagé, sans changement validé.',
          },
          {
            id: 'b',
            texte:
              'C’est une opération de maintenance normale d’un prestataire, réalisée en heure creuse avec le compte d’administration habituel depuis le VPN prévu à cet effet : rien à signaler.',
            points: 0,
            feedback:
              'Aucun changement validé ne prévoyait cette opération, faite avec le compte superutilisateur partagé `postgres` depuis la plage VPN des prestataires. C’est exactement le type d’événement que l’audit des accès privilégiés doit faire remonter.',
          },
          {
            id: 'c',
            texte:
              'Réplication asynchrone depuis 01h41 : des validations postérieures à 3A/7F2C1E88 ont pu être perdues. Je le signale, je fais rapprocher, et je traite la modification en incident de sécurité.',
            points: 4,
            feedback:
              'C’est la lecture complète. Avec un `synchronous_standby_names` vide, `synchronous_commit` n’attend plus aucune réplique : un virement confirmé au client peut ne jamais avoir atteint pg-rep-02. Il faut chiffrer et rapprocher cette perte. Et l’usage d’un compte partagé rend l’auteur difficile à identifier : c’est un problème de gouvernance des accès, pas seulement de configuration.',
          },
          {
            id: 'd',
            texte:
              'J’efface les lignes d’audit concernées pour ne pas exposer le prestataire avant d’avoir recueilli sa version, et je les reconstituerai ensuite dans le rapport d’incident.',
            points: 0,
            feedback:
              'Altérer un journal d’audit est une faute grave qui détruit la preuve et engage ta responsabilité. Les journaux d’audit doivent au contraire être préservés, idéalement copiés hors de portée des administrateurs de la base.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle mesure durable recommandes-tu pour les accès privilégiés aux bases ?',
        options: [
          {
            id: 'a',
            texte:
              'Changer le mot de passe du compte `postgres` chaque mois, le stocker dans un coffre-fort de mots de passe et le communiquer aux seuls administrateurs et prestataires habilités.',
            points: 1,
            feedback:
              'La rotation est une bonne hygiène, mais le compte reste partagé : on ne sait toujours pas qui fait quoi. La traçabilité individuelle est l’exigence de base pour un accès privilégié.',
          },
          {
            id: 'b',
            texte:
              'Déployer un outil de bascule automatique avec un mécanisme de consensus (quorum), qui isole l’ancien primaire et choisit seul la meilleure réplique, pour éviter tout split-brain.',
            points: 2,
            feedback:
              'C’est une vraie amélioration de la haute disponibilité, qui automatise l’isolement et le choix de la réplique. Mais la question porte sur les accès privilégiés : l’outil n’aurait pas empêché la désactivation silencieuse de la réplication synchrone.',
          },
          {
            id: 'c',
            texte:
              'Bloquer définitivement la plage VPN des prestataires et réserver toute intervention sur les bases aux administrateurs internes de la banque, connectés depuis le site.',
            points: 0,
            feedback:
              'Les prestataires ont souvent un besoin légitime d’intervenir. Le problème n’est pas leur accès en soi, mais un accès anonyme, sans validation et sans surveillance. Bloquer la plage déplacerait le problème (partage d’accès internes).',
          },
          {
            id: 'd',
            texte:
              'Comptes nominatifs au moindre privilège, `postgres` interdit à distance, bastion enregistrant les sessions, changements validés, audit vers le SIEM et alerte sur le mode de réplication.',
            points: 4,
            feedback:
              'C’est la réponse complète : chaque action est attribuable à une personne, limitée à son besoin, enregistrée, et les journaux sont hors de portée de ceux qu’ils surveillent. L’alerte sur le mode de réplication aurait signalé le problème dès 01h41, bien avant la panne.',
          },
        ],
      },
    ],
    pointsMax: 20,
    debrief:
      'Ce cas évalue la maîtrise d’une bascule manuelle et la capacité à relier un incident d’exploitation à un défaut de gouvernance des accès.\n• Constat : pg-prim-01 est injoignable mais toujours sous tension (lien réseau tombé). C’est la situation la plus dangereuse : si le lien revient après la promotion d’une réplique, deux primaires peuvent accepter des écritures (split-brain).\n• Règle d’or : confirmer, puis isoler l’ancien primaire de façon certaine (fencing : mise hors tension par la console hors bande, retrait de l’adresse de service) avant de promouvoir.\n• Choix de la réplique : par les LSN, pas par la géographie. pg-rep-02 (3A/7F2C1E88) a environ 50,8 Mo de WAL d’avance sur pg-rep-03 (3A/7C001000).\n• Ordre de la procédure : confirmer, isoler, comparer, promouvoir et basculer l’adresse de service, raccrocher pg-rep-03 et rétablir le mode synchrone, puis reconstruire l’ancien primaire.\n• Données perdues : la réplication synchrone avait été désactivée à 01h41 (`synchronous_standby_names = \'\'`). Les transactions validées sur l’ancien primaire après le dernier LSN reçu par pg-rep-02 sont absentes de la nouvelle production : copier les données de l’ancien primaire avant tout `pg_rewind`, puis rapprocher le traitement par lots (reprise au lot 412) et les virements instantanés.\n• Accès privilégiés : une modification critique faite en pleine nuit, avec le compte partagé `postgres`, depuis la plage VPN des prestataires, sans changement validé. C’est un incident de sécurité à part entière : préserver les journaux, identifier l’auteur, revoir le processus.\n• Pièges : promouvoir sans isoler, choisir la réplique du site de secours par réflexe, promouvoir les deux répliques, effacer ou ignorer l’audit.\nCe qu’attend un jury de banque centrale : de la rigueur sous pression, une transparence totale sur les pertes éventuelles, et des mesures qui rendent chaque action privilégiée attribuable et surveillée.\nRéflexes à retenir :\n• Un primaire injoignable n’est pas un primaire arrêté : fencing d’abord, promotion ensuite.\n• La réplique à promouvoir est celle qui a reçu le plus de WAL.\n• Pas de compte partagé pour les accès privilégiés : comptes nominatifs, bastion, audit hors de portée, alertes sur les paramètres critiques.',
  },
];
