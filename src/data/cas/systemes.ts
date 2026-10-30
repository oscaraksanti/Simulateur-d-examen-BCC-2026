// Cas pratiques — filière Administration des systèmes (préfixe SYS).
// Scénarios entièrement fictifs (Banque Alpha, Banque Beta, IP de documentation, domaines .example).
// Chiffres (espace disque, comptes, durées de reconstruction et de restauration) vérifiés par script.

import type { CasPratique } from '@/lib/types';

export const casSystemes: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // SYS-CAS-01 — Disque plein et service systemd en échec un soir de paie
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SYS-CAS-01',
    filiere: 'systemes',
    titre: 'Le moteur de paie tombe un soir de fin de mois',
    role: 'Administrateur systèmes d’astreinte — Banque Alpha',
    heure: 'Vendredi 30 octobre, 22h15',
    enjeu:
      'Remettre en service le moteur de paie et permettre une reprise propre du lot des salaires d’octobre avant la transmission de 06h00, sans perdre ni dupliquer un seul ordre.',
    contexte:
      'Ton téléphone d’astreinte sonne à 22h12 : la supervision signale que le service `paiecore` du serveur Linux app-paie-01 (10.20.1.15) est en échec depuis 22h04. Ce serveur fait tourner le moteur de paie (fictif) de Banque Alpha, qui génère chaque fin de mois le lot des salaires que les entreprises clientes confient à la banque ; ce lot doit être transmis au système de virements à 06h00. Ton collègue d’astreinte de niveau 1, Patrick Ilunga, a voulu « faire de la place » : il a supprimé avec `rm` le plus gros fichier de journal, mais `df` affiche toujours 100 %, et ses tentatives de `systemctl restart paiecore` échouent. Mme Kabeya, responsable des opérations de paie, demande déjà si l’on peut « relancer le lot dès que ça redémarre ». Tu te connectes en SSH avec ton compte nominatif et tu récupères les sorties ci-dessous.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'app-paie-01 — état du service et journal systemd (22h16)',
        lignes: [
          '$ systemctl status paiecore --no-pager',
          '× paiecore.service - Moteur de paie PaieCore (exercice)',
          '     Loaded: loaded (/etc/systemd/system/paiecore.service; enabled; preset: disabled)',
          '     Active: failed (Result: start-limit-hit) since Fri 2026-10-30 22:04:58 WAT; 11min ago',
          '   Main PID: 2417 (code=exited, status=1/FAILURE)',
          '',
          '$ journalctl -u paiecore --since "21:55" --no-pager | tail -n 9',
          'Oct 30 22:04:17 app-paie-01 paiecore[2417]: ERROR [LOT-PAIE-2026-10] écriture impossible /var/lib/paiecore/spool/lot-2026-10.tmp : No space left on device',
          'Oct 30 22:04:17 app-paie-01 paiecore[2417]: ERROR [LOT-PAIE-2026-10] lot interrompu après 18 412 ordres sur 26 950',
          'Oct 30 22:04:18 app-paie-01 systemd[1]: paiecore.service: Main process exited, code=exited, status=1/FAILURE',
          "Oct 30 22:04:18 app-paie-01 systemd[1]: paiecore.service: Failed with result 'exit-code'.",
          'Oct 30 22:04:58 app-paie-01 systemd[1]: paiecore.service: Scheduled restart job, restart counter is at 5.',
          'Oct 30 22:04:58 app-paie-01 systemd[1]: paiecore.service: Start request repeated too quickly.',
          "Oct 30 22:04:58 app-paie-01 systemd[1]: paiecore.service: Failed with result 'start-limit-hit'.",
          'Oct 30 22:04:58 app-paie-01 systemd[1]: Failed to start paiecore.service - Moteur de paie PaieCore (exercice).',
        ],
      },
      {
        type: 'logs',
        titre: 'app-paie-01 — espace disque et configuration (22h17)',
        lignes: [
          '$ df -h',
          'Filesystem               Size  Used Avail Use% Mounted on',
          '/dev/mapper/vg0-root      20G  6.1G   14G  31% /',
          '/dev/mapper/vg0-var       50G   50G   20K 100% /var',
          '/dev/mapper/vg0-data     200G  121G   79G  61% /data',
          '/dev/sda1               1014M  212M  802M  21% /boot',
          '',
          '$ sudo du -sh /var/log/* 2>/dev/null | sort -h | tail -n 3',
          '612M    /var/log/messages',
          '1.1G    /var/log/journal',
          '13G     /var/log/paiecore',
          '',
          '$ ls -lh /var/log/paiecore/',
          'total 13G',
          '-rw-r----- 1 paiecore paiecore 13G Oct 30 22:04 paiecore.log',
          '',
          '$ ls /etc/logrotate.d/',
          'btmp  chrony  dnf  firewalld  sssd  wtmp',
          '',
          '$ grep "^log.level" /etc/paiecore/paiecore.conf',
          'log.level=DEBUG    # activé le 14/09 pour l’incident INC-0912',
        ],
      },
      {
        type: 'texte',
        titre: 'Message de Patrick Ilunga (astreinte N1) — 22h13',
        contenu:
          'Salut,\n\n/var était plein, j’ai supprimé /var/log/paiecore/paiecore-debug.log avec rm à 22h09 (il faisait 31 Go !). Mais df affiche toujours 100 %, je ne comprends pas. J’ai relancé deux fois systemctl restart paiecore, ça échoue.\n\nMme Kabeya demande si on peut relancer le lot de paie dès que le service redémarre.\n\nPatrick',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle est la cause racine de la panne du service `paiecore` ?',
        options: [
          {
            id: 'a',
            texte:
              'Le serveur manque de mémoire vive : le noyau a tué le processus (OOM killer), d’où le code de sortie 1 ; il faut ajouter de la RAM avant de relancer.',
            points: 0,
            feedback:
              'Aucun indice ne va dans ce sens. Un arrêt par l’OOM killer laisse une trace « Out of memory: Killed process » dans le journal du noyau et un arrêt par signal (status=9/KILL), pas un code de sortie 1. Le journal dit clairement « No space left on device » : c’est un problème de disque.',
          },
          {
            id: 'b',
            texte:
              '/var est saturé : niveau DEBUG oublié depuis septembre et aucune rotation des journaux de PaieCore. Le lot ne peut plus écrire, d’où les échecs puis le start-limit-hit.',
            points: 3,
            feedback:
              'Exact. La chaîne causale est complète : DEBUG oublié + absence de rotation → croissance des journaux → /var plein → erreur ENOSPC à l’écriture du lot → plantage → redémarrages en boucle → limite de démarrage atteinte. Identifier la cause racine, et pas seulement le symptôme, évite que la panne revienne le mois prochain.',
          },
          {
            id: 'c',
            texte:
              'Un bogue de l’application PaieCore : le lot plante net à l’ordre 18 412, ce qui désigne un enregistrement mal formé dans le fichier source ; il faut ouvrir un ticket chez l’éditeur.',
            points: 1,
            feedback:
              'L’application est ici victime, pas coupable : « No space left on device » est une erreur renvoyée par le système (ENOSPC). Le lot s’est arrêté à 18 412 ordres simplement parce que le disque était plein à ce moment-là. Un ticket éditeur ferait perdre des heures cette nuit.',
          },
          {
            id: 'd',
            texte:
              'systemd est simplement bloqué après cinq échecs (start-limit-hit) : il suffit de lancer `systemctl reset-failed paiecore` pour remettre le compteur à zéro, puis de redémarrer le service.',
            points: 1,
            feedback:
              '`reset-failed` remet bien à zéro le compteur de démarrages, mais le service replanterait aussitôt : le disque est toujours plein. C’est traiter le symptôme (start-limit-hit) au lieu de la cause (ENOSPC).',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Patrick a supprimé paiecore-debug.log (31 Go) avec `rm`. `du` ne compte plus que 13 Go dans /var/log/paiecore, mais `df` affiche toujours /var à 100 %. Que se passe-t-il, et que fais-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Le fichier est supprimé mais encore ouvert par un processus : l’espace ne revient qu’à sa fermeture. Je trouve ce processus avec `sudo lsof +L1 /var` et je le redémarre.',
            points: 3,
            feedback:
              'Exact. Sous Linux, `rm` supprime le nom du fichier (le lien), pas ses données tant qu’un processus le garde ouvert. Ici, `lsof +L1 /var` montrerait par exemple l’agent d’envoi de journaux : « filebeat 1388 root 7r REG … 33285996544 0 … /var/log/paiecore/paiecore-debug.log (deleted) ». Redémarrer filebeat libère immédiatement les 31 Go. L’écart entre `du` (qui parcourt les noms) et `df` (qui interroge le système de fichiers) était l’indice décisif.',
          },
          {
            id: 'b',
            texte:
              'Les compteurs de `df` sont mis en cache et ne se recalculent qu’au démarrage du système : je redémarre le serveur pour qu’il affiche enfin l’espace libéré par Patrick.',
            points: 1,
            feedback:
              '`df` n’a pas de cache : il interroge le système de fichiers en temps réel. Le redémarrage libérerait bien l’espace (tous les descripteurs seraient fermés), mais par accident, sans comprendre pourquoi, en coupant tous les services du serveur et en perdant l’état utile au diagnostic.',
          },
          {
            id: 'c',
            texte: 'L’écart entre `du` et `df` trahit des métadonnées incohérentes : le système de fichiers est corrompu, je lance une vérification (`fsck`) sur /dev/mapper/vg0-var.',
            points: 0,
            feedback:
              'Rien n’indique une corruption. Lancer une réparation sur un système de fichiers monté est dangereux (et sur XFS, l’outil est `xfs_repair`, à utiliser démonté). Ce serait une prise de risque inutile au milieu d’un incident de production.',
          },
          {
            id: 'd',
            texte: 'Je supprime aussi paiecore.log (13 Go) : c’est désormais le plus gros fichier de /var/log, et le libérer donnera tout de suite la marge nécessaire pour redémarrer le service.',
            points: 0,
            feedback:
              'C’est répéter la même erreur : si ce fichier est lui aussi ouvert par un processus, rien ne sera libéré. Surtout, tu détruis le journal qui permet de savoir où le lot s’est arrêté, indispensable pour la reprise et pour l’analyse de l’incident.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Une fois l’espace réellement libéré, remets dans l’ordre les actions de remise en service.',
        elements: [
          {
            id: 'statut',
            texte: 'Vérifier `systemctl status paiecore` et suivre `journalctl -u paiecore -f` : plus aucune erreur ENOSPC',
          },
          {
            id: 'sante',
            texte:
              'Faire un contrôle fonctionnel (page de santé, connexion à la base) et prévenir Mme Kabeya que le service est prêt, sans relancer le lot soi-même',
          },
          { id: 'df', texte: 'Contrôler avec `df -h /var` que l’espace est réellement libéré, avec une marge suffisante' },
          {
            id: 'demarrer',
            texte: 'Remettre à zéro le compteur d’échecs (`systemctl reset-failed paiecore`) puis démarrer le service',
          },
          {
            id: 'debug',
            texte: 'Repasser `log.level` à INFO dans la configuration pour stopper la croissance anormale des journaux',
          },
        ],
        ordreCorrect: ['df', 'debug', 'demarrer', 'statut', 'sante'],
        pointsMax: 4,
        feedback:
          'On vérifie d’abord que la cause est levée (espace disponible), sinon le service replante. On corrige ensuite la configuration AVANT le démarrage, pour que le service relise le niveau INFO. Puis on démarre, on contrôle l’état technique (statut, journal) et enfin l’état fonctionnel. La relance du lot appartient au métier, avec sa procédure de reprise : l’administrateur rend un service sain et le signale.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Le service est reparti. Mme Kabeya veut relancer immédiatement le lot LOT-PAIE-2026-10 depuis le début. Le journal indique « lot interrompu après 18 412 ordres sur 26 950 ». Que recommandes-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Relancer le lot depuis le début dès maintenant : le moteur recrée son fichier temporaire à chaque exécution et écrasera l’ancien, donc aucun ordre ne sera traité deux fois.',
            points: 0,
            feedback:
              'C’est une supposition. Si une partie des 18 412 ordres a déjà été enregistrée ailleurs (base, file de transmission), une relance complète peut créer des doublons, c’est-à-dire des salaires payés deux fois.',
          },
          {
            id: 'b',
            texte: 'Supprimer à la main le fichier lot-2026-10.tmp, resté incomplet après l’erreur ENOSPC, pour que le moteur reparte d’un état propre, puis relancer le lot.',
            points: 1,
            feedback:
              'C’est peut-être ce que prévoit la procédure de l’éditeur, mais l’administrateur ne doit pas en décider seul : supprimer un état intermédiaire sans savoir comment le moteur gère la reprise peut perdre ou dupliquer des ordres. À valider avec la responsable applicative.',
          },
          {
            id: 'c',
            texte: 'Reprendre à partir de l’ordre 18 413 en modifiant directement le fichier de lot, pour ne transmettre que les 8 538 ordres restants et gagner du temps avant 06h00.',
            points: 0,
            feedback:
              'Modifier à la main un fichier de paiement est à proscrire : aucune traçabilité, risque d’erreur et contournement des contrôles. Une banque ne touche jamais un lot de paiement hors de l’outil et de la procédure prévus.',
          },
          {
            id: 'd',
            texte:
              'Ne rien relancer avant d’avoir validé avec la responsable applicative la procédure de reprise de l’éditeur (aucun doublon), puis contrôler les totaux avant 06h00.',
            points: 3,
            feedback:
              'C’est la bonne posture. Il reste près de 8 heures avant 06h00 : on a le temps de faire les choses proprement. Le contrôle des totaux (26 950 ordres attendus, montant total égal à celui du fichier source) est la barrière ultime contre les doublons et les oublis.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Le lot a finalement été validé et transmis à l’heure. Quelle mesure durable proposes-tu dans ton rapport d’incident ?',
        options: [
          {
            id: 'a',
            texte: 'Une tâche cron qui supprime chaque nuit tous les fichiers de /var/log/paiecore : simple, sans dépendance, et le disque ne pourra plus jamais se remplir à cause des journaux.',
            points: 1,
            feedback:
              'Cela évite le disque plein, mais de façon brutale : tu perds tout l’historique nécessaire aux audits et aux enquêtes, et tu reproduis le piège du fichier supprimé mais encore ouvert. La rotation des journaux existe justement pour cela.',
          },
          {
            id: 'b',
            texte: 'Agrandir /var à 200 Go avec `lvextend` puis `xfs_growfs`, à chaud et sans arrêter le service : avec quatre fois plus d’espace, le problème ne se reposera plus.',
            points: 1,
            feedback:
              'Ajouter de l’espace peut se justifier, mais sans rotation ni retour au niveau INFO, le disque se remplira simplement plus tard. On repousse le problème au lieu de le résoudre.',
          },
          {
            id: 'c',
            texte:
              'Créer une rotation logrotate pour PaieCore, rétablir le niveau INFO par défaut avec une règle de retour après débogage, et alerter sur /var à 80 % puis 90 %.',
            points: 3,
            feedback:
              'C’est la réponse complète : la rotation traite la cause, la procédure évite qu’un DEBUG soit oublié, et l’alerte donne le temps d’agir avant la panne. Ces trois mesures se complètent ; aucune ne suffit seule.',
          },
          {
            id: 'd',
            texte: 'Désactiver les journaux de PaieCore, ou les rediriger vers /dev/null : la supervision applicative suffit à suivre les traitements, et le disque ne se remplira plus jamais.',
            points: 0,
            feedback:
              'Inacceptable dans une banque : sans journaux, impossible de diagnostiquer un incident, de reconstituer un traitement ou de répondre à un audit. On maîtrise leur volume, on ne les supprime pas.',
          },
        ],
      },
    ],
    pointsMax: 16,
    debrief:
      'Rappel : serveur, application et personnes sont fictifs.\n\nLa panne suit une chaîne classique. Le niveau DEBUG activé le 14/09 pour un incident n’a jamais été remis à INFO, et aucun fichier de rotation n’existe pour PaieCore dans /etc/logrotate.d. Les journaux ont grossi jusqu’à remplir /var (50 Go). Le soir de la paie, le moteur n’a plus pu écrire son fichier temporaire (ENOSPC), il a planté, systemd l’a relancé en boucle puis a bloqué les redémarrages (start-limit-hit).\n\nLe piège de la soirée est le fichier supprimé mais encore ouvert. `rm` retire le nom du fichier, mais ses blocs ne sont libérés que lorsque le dernier processus qui le tient ouvert le ferme. L’indice était l’écart entre `du` (13 Go visibles) et `df` (/var toujours plein). `lsof +L1 /var` désigne le coupable (ici un agent de collecte de journaux) ; le redémarrer libère les 31 Go. Pour vider un journal actif sans arrêter qui l’écrit, on utilise `truncate -s 0` ou `: > fichier`, jamais `rm`.\n\nLa remise en service suit un ordre logique : vérifier l’espace, corriger la configuration, `systemctl reset-failed` puis démarrer, contrôler le journal, puis l’état fonctionnel. La reprise du lot de paie, elle, appartient au métier : en banque, on ne relance jamais un lot de paiement sans connaître sa procédure de reprise ni contrôler les totaux, car un doublon signifie des salaires payés deux fois.\n\nUn exemple de rotation adaptée :\n`/var/log/paiecore/*.log { daily  maxsize 1G  rotate 14  compress  delaycompress  missingok  notifempty  copytruncate }`\n\nRéflexes à retenir :\n• « No space left on device » : `df -h`, puis `du` pour localiser, puis `lsof +L1` si les deux ne concordent pas.\n• Ne jamais `rm` un journal en cours d’écriture : `truncate` ou rotation.\n• Toute activation de DEBUG s’accompagne d’une date de retour à la normale.\n• Superviser les systèmes de fichiers à 80 % et 90 %, pas seulement à 100 %.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SYS-CAS-02 — Verrouillages Active Directory en masse un lundi matin
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SYS-CAS-02',
    filiere: 'systemes',
    titre: 'Lundi matin : 212 comptes Active Directory verrouillés',
    role: 'Administrateur systèmes Windows — Banque Alpha',
    heure: 'Lundi 2 novembre, 08h05',
    enjeu:
      'Comprendre pourquoi des centaines d’agents ne peuvent plus ouvrir de session et leur rendre l’accès sans laisser un attaquant dans le système d’information.',
    contexte:
      'Depuis 07h40, le support de Banque Alpha (fictive) est saturé : des dizaines d’agents des agences de Kinshasa et de Lubumbashi ne peuvent plus ouvrir leur session Windows ni leur messagerie. Le message est toujours le même : « Le compte référencé est actuellement verrouillé ». Dans le domaine alpha.example, un compte est verrouillé après 5 échecs consécutifs et seul un administrateur peut le déverrouiller. Mme Nsimba, responsable du support, te demande de « tout débloquer d’un coup, tout de suite ». Avant d’agir, tu extrais les événements 4740 (compte verrouillé) du contrôleur de domaine DC01 et le journal de sécurité de GW-WEB01, la passerelle qui publie le webmail et le portail VPN sur Internet. Tu retrouves aussi un ticket de changement de vendredi soir.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'DC01 — événements 4740 (compte verrouillé) du 02/11, regroupés par ordinateur appelant',
        colonnes: ['Ordinateur appelant', 'Comptes verrouillés', 'Premier', 'Dernier', 'Exemples de comptes'],
        lignes: [
          ['GW-WEB01', 212, '07:22:41', '07:31:06', 'a.mukendi, b.lokwa, c.mwamba, d.kasongo…'],
          ['SRV-BKP01', 1, '01:04:12', '01:04:12', 'svc_sauvegarde'],
          ['PC-COMPTA-07', 1, '07:58:15', '07:58:15', 'm.kalala'],
        ],
      },
      {
        type: 'logs',
        titre: 'GW-WEB01 — journal Sécurité, extrait (export simplifié)',
        lignes: [
          'Heure     ID    Résultat  Compte        Adresse source   Sous-statut',
          '06:50:12  4625  Échec     a.mukendi     203.0.113.45     0xC000006A (mot de passe incorrect)',
          '06:50:12  4625  Échec     b.lokwa       203.0.113.45     0xC000006A (mot de passe incorrect)',
          '06:50:13  4625  Échec     admin.test    203.0.113.45     0xC0000064 (compte inexistant)',
          '06:51:02  4624  Succès    j.tshibanda   203.0.113.45     —',
          '06:58:31  4625  Échec     a.mukendi     203.0.113.46     0xC000006A (mot de passe incorrect)',
          '07:07:19  4624  Succès    p.ngalula     198.51.100.23    —',
          '07:22:41  4625  Échec     a.mukendi     198.51.100.23    0xC000006A (5e échec : compte verrouillé)',
          '07:41:55  4625  Échec     a.mukendi     172.16.12.40     0xC0000234 (compte verrouillé)',
          '# Synthèse 06:50-07:31 : 1 077 échecs 4625 depuis 3 adresses (203.0.113.45, 203.0.113.46, 198.51.100.23)',
          '# 217 noms de comptes testés (dont 3 inexistants), 5 tentatives par compte, un tour complet environ toutes les 8 minutes',
          '# 2 ouvertures de session réussies (4624) depuis ces mêmes adresses : j.tshibanda (06:51:02), p.ngalula (07:07:19)',
        ],
      },
      {
        type: 'texte',
        titre: 'Ticket CHG-1030-07 — vendredi 30/10, 18h30',
        contenu:
          'Objet : expiration du mot de passe du compte de service svc_sauvegarde (politique de 90 jours)\n\nAction réalisée : nouveau mot de passe défini dans Active Directory par J. Mbala.\nMise à jour du mot de passe dans le logiciel de sauvegarde de SRV-BKP01 : « à faire lundi ».\n\nStatut : clôturé.',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Comment qualifies-tu la situation ?',
        options: [
          {
            id: 'a',
            texte:
              'Tout vient du compte svc_sauvegarde : son mot de passe changé vendredi n’a pas été reporté partout, et ses échecs répétés provoquent des verrouillages en cascade dans tout le domaine.',
            points: 1,
            feedback:
              'Le changement de vendredi explique bien UN verrouillage, celui de svc_sauvegarde, appelé depuis SRV-BKP01. Mais un compte de service mal configuré ne verrouille que lui-même : il ne peut pas provoquer 212 verrouillages d’agents, tous appelés depuis GW-WEB01.',
          },
          {
            id: 'b',
            texte: 'Un lundi matin ordinaire : après le week-end, les agents se trompent de mot de passe et le seuil de 5 échecs est vite atteint, d’où l’afflux d’appels au support.',
            points: 0,
            feedback:
              'Les 212 verrouillages ont eu lieu entre 07:22 et 07:31, avant l’arrivée des agents, tous via la passerelle Internet, depuis trois adresses externes. Seul m.kalala (PC-COMPTA-07, 07:58) correspond à ce scénario banal.',
          },
          {
            id: 'c',
            texte:
              'Une pulvérisation de mots de passe (password spraying) via GW-WEB01, qui a trouvé deux comptes ; svc_sauvegarde et m.kalala sont des incidents à part.',
            points: 3,
            feedback:
              'Exact. Signature typique : peu de mots de passe essayés sur beaucoup de comptes, des noms inexistants (0xC0000064) qui trahissent une liste devinée, des tours réguliers. Le point le plus grave n’est pas le verrouillage mais les deux 4624 : l’attaquant possède deux comptes valides. Savoir séparer les trois incidents évite de traiter le mauvais.',
          },
          {
            id: 'd',
            texte: 'Une panne de réplication Active Directory entre les contrôleurs de domaine : les mots de passe divergent d’un contrôleur à l’autre, d’où des échecs en série sur des comptes pourtant valides.',
            points: 0,
            feedback:
              'Rien ne l’indique : les échecs portent le sous-statut 0xC000006A (mot de passe réellement incorrect) et proviennent d’adresses externes. Un problème de réplication ne crée pas de connexions depuis 203.0.113.45.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Mme Nsimba insiste pour que tu débloques tout le monde. Quelle est ta première action ?',
        options: [
          {
            id: 'a',
            texte:
              'Contenir d’abord : bloquer les trois adresses sources, désactiver et réinitialiser j.tshibanda et p.ngalula, alerter la sécurité ; puis déverrouiller tout le monde.',
            points: 4,
            feedback:
              'C’est la bonne priorité. Tant que la source n’est pas bloquée, les comptes déverrouillés se reverrouillent ; tant que les deux comptes compromis sont actifs, l’attaquant est dans la maison. Ces actions prennent quelques minutes, et tu peux annoncer à Mme Nsimba un déblocage imminent.',
          },
          {
            id: 'b',
            texte:
              'Déverrouiller immédiatement tous les comptes avec `Search-ADAccount -LockedOut | Unlock-ADAccount` pour rendre la main aux agences, puis analyser les journaux à tête reposée.',
            points: 1,
            feedback:
              'La commande est correcte et sera utile, mais trop tôt. Si l’attaque continue, les comptes se reverrouillent ; surtout, les deux comptes compromis restent ouverts à l’attaquant. Elle débloquerait aussi svc_sauvegarde, qui se reverrouillera à la prochaine tentative de SRV-BKP01.',
          },
          {
            id: 'c',
            texte: 'Désactiver temporairement le verrouillage des comptes dans la stratégie du domaine : les agents retravaillent tout de suite, et on le réactivera une fois l’analyse terminée.',
            points: 0,
            feedback:
              'C’est offrir à l’attaquant un nombre illimité d’essais sur tous les comptes, alors qu’il a déjà trouvé deux mots de passe. Le verrouillage est le seul frein qui a limité les dégâts.',
          },
          {
            id: 'd',
            texte: 'Couper totalement GW-WEB01 d’Internet jusqu’à nouvel ordre : l’attaque s’arrête net, et les agents en agence passent de toute façon par le réseau interne.',
            points: 2,
            feedback:
              'Efficace pour arrêter l’attaque, mais disproportionné : tous les agents en déplacement perdent le webmail et le VPN. Et c’est incomplet : les mots de passe de j.tshibanda et p.ngalula restent connus de l’attaquant, qui reviendra dès la remise en ligne.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre ta réponse à l’incident.',
        elements: [
          {
            id: 'deverrouiller',
            texte:
              'Déverrouiller les comptes verrouillés depuis GW-WEB01 (`Unlock-ADAccount` sur la liste extraite des 4740) et prévenir le support',
          },
          {
            id: 'retex',
            texte: 'Rédiger le rapport d’incident et proposer les mesures durables',
          },
          {
            id: 'bloquer',
            texte: 'Bloquer les adresses 203.0.113.45, 203.0.113.46 et 198.51.100.23 sur la passerelle et le pare-feu',
          },
          {
            id: 'analyser',
            texte:
              'Analyser avec l’équipe sécurité ce qu’ont fait les deux comptes compromis depuis 06:51 (connexions, règles de transfert de messagerie, fichiers consultés)',
          },
          {
            id: 'comptes',
            texte: 'Désactiver j.tshibanda et p.ngalula, réinitialiser leurs mots de passe, fermer leurs sessions webmail et VPN',
          },
        ],
        ordreCorrect: ['bloquer', 'comptes', 'deverrouiller', 'analyser', 'retex'],
        pointsMax: 4,
        feedback:
          'On coupe d’abord la source, puis on neutralise les comptes compromis : c’est le confinement. À partir de là, déverrouiller les 212 comptes ne présente plus de risque et répond à l’urgence métier. L’analyse des deux comptes compromis prend plus de temps (règles de transfert, données consultées) et ne doit pas retarder le retour au travail des agents. Le rapport et les mesures durables viennent en dernier.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Que fais-tu pour svc_sauvegarde, verrouillé depuis 01:04 parce que SRV-BKP01 utilise encore l’ancien mot de passe ?',
        options: [
          {
            id: 'a',
            texte: 'L’ajouter au groupe « Admins du domaine » : les comptes de ce groupe échappent à la stratégie de verrouillage, il ne sera donc plus jamais bloqué.',
            points: 0,
            feedback:
              'Faux et dangereux : les administrateurs se font verrouiller comme les autres. Donner des droits maximaux à un compte de service en ferait la cible idéale d’un attaquant.',
          },
          {
            id: 'b',
            texte: 'Remettre l’ancien mot de passe dans Active Directory et cocher « Le mot de passe n’expire jamais » : SRV-BKP01 se reconnecte aussitôt, sans toucher au logiciel de sauvegarde.',
            points: 1,
            feedback:
              'Cela remet la sauvegarde en marche, mais un mot de passe figé et déjà ancien sur un compte qui accède à toutes les données est un risque permanent. C’est une rustine, pas une solution.',
          },
          {
            id: 'c',
            texte: 'Le déverrouiller et attendre : le logiciel de sauvegarde finira par relire le nouveau mot de passe dans l’annuaire, et la sauvegarde de cette nuit repartira toute seule.',
            points: 1,
            feedback:
              'SRV-BKP01 présentera toujours l’ancien mot de passe : le compte se reverrouillera à la prochaine tentative. Et la sauvegarde de la nuit dernière n’a pas eu lieu : il faut la relancer, pas attendre.',
          },
          {
            id: 'd',
            texte:
              'Mettre à jour le mot de passe sur SRV-BKP01, déverrouiller le compte, relancer la sauvegarde manquée ; à terme, passer à un compte de service géré (gMSA).',
            points: 3,
            feedback:
              'C’est la réponse complète : on corrige la cause (le mot de passe pas mis à jour), on rattrape la sauvegarde manquée et on supprime le problème à la racine avec un gMSA. Note aussi le défaut de processus : un changement ne doit pas être clôturé tant que toutes ses étapes ne sont pas faites.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle mesure durable proposes-tu en priorité dans le rapport d’incident ?',
        options: [
          {
            id: 'a',
            texte: 'Imposer des mots de passe de 20 caractères changés chaque mois : un mot de passe long et renouvelé souvent ne reste jamais assez longtemps pour être deviné par pulvérisation.',
            points: 1,
            feedback:
              'La longueur aide, mais les changements forcés et fréquents poussent les utilisateurs vers des motifs prévisibles (mois + année + « ! »), exactement ce que testent les attaques par pulvérisation. Les recommandations actuelles (NIST SP 800-63B) déconseillent ces changements périodiques sans raison.',
          },
          {
            id: 'b',
            texte:
              'Imposer le MFA sur le webmail et le VPN, bannir les mots de passe prévisibles par une liste noire, et alerter dès qu’une adresse échoue sur de nombreux comptes.',
            points: 3,
            feedback:
              'C’est le trio efficace : le MFA rend inutile un mot de passe deviné, la liste noire réduit les chances de l’attaquant, et l’alerte détecte la pulvérisation en quelques minutes au lieu d’attendre les appels au support.',
          },
          {
            id: 'c',
            texte: 'Relever le seuil de verrouillage à 50 tentatives : les agents ne seront plus bloqués, et l’attaquant restera de toute façon freiné par la complexité des mots de passe.',
            points: 0,
            feedback:
              'Avec 50 essais par compte, l’attaquant aurait pu tester dix fois plus de mots de passe sans déclencher aucun verrouillage, donc sans que personne ne le remarque.',
          },
          {
            id: 'd',
            texte: 'Bloquer définitivement les plages 203.0.113.0/24 et 198.51.100.0/24 sur le pare-feu : la source de l’attaque est ainsi coupée.',
            points: 1,
            feedback:
              'Utile à court terme, mais un attaquant change d’adresses en quelques minutes. Un blocage d’adresses est une mesure de confinement, pas une protection durable.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'Rappel : domaine, comptes et adresses sont fictifs.\n\nLa matinée cachait trois incidents différents. Le principal est une attaque par pulvérisation de mots de passe : de 06:50 à 07:31, trois adresses externes ont testé 5 mots de passe sur 217 noms de comptes via la passerelle GW-WEB01, soit 1 077 échecs. 212 comptes ont atteint le seuil de 5 échecs et ont été verrouillés ; deux mots de passe ont été trouvés (j.tshibanda à 06:51, p.ngalula à 07:07). Le deuxième incident est le compte svc_sauvegarde, verrouillé à 01:04 par SRV-BKP01 qui utilise encore l’ancien mot de passe, avec une sauvegarde de nuit manquée. Le troisième, anodin, est l’erreur de saisie de m.kalala.\n\nLa méthode consiste à lire les 4740 du contrôleur de domaine (le champ « ordinateur appelant » dit d’où viennent les échecs), puis le journal de la machine désignée (les 4625 et 4624 de la passerelle donnent les adresses externes). Les sous-statuts parlent : 0xC000006A pour un mauvais mot de passe, 0xC0000064 pour un compte inexistant, 0xC0000234 pour un compte déjà verrouillé.\n\nLe piège est de céder à la pression du support et de tout déverrouiller d’abord. L’ordre attendu est : bloquer la source, neutraliser les deux comptes compromis, déverrouiller, analyser, puis tirer les leçons. Les deux 4624 sont le vrai sujet : ces comptes ont pu servir à lire des courriels, créer une règle de transfert ou préparer une fraude au virement.\n\nRéflexes à retenir :\n• Beaucoup de comptes, peu d’essais par compte, depuis peu d’adresses : c’est une pulvérisation.\n• Dans une vague d’échecs, cherche les succès (4624) : ce sont eux qui comptent.\n• Confinement avant restauration du service, même sous pression.\n• Comptes de service : gMSA si possible, et ne jamais clôturer un changement à moitié fait.\n• MFA sur tout accès exposé à Internet.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SYS-CAS-03 — Correctif de sécurité critique sur un parc mixte
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SYS-CAS-03',
    filiere: 'systemes',
    titre: 'Correctif critique à déployer sur tout le parc, sans couper le service',
    role: 'Administrateur systèmes — équipe Production, Banque Beta',
    heure: 'Jeudi 5 novembre, 10h00',
    enjeu:
      'Corriger avant demain matin une faille critique activement exploitée, sur des serveurs Windows et Linux qui portent la banque en ligne et le cœur bancaire, sans interruption de service ni régression.',
    contexte:
      'Le RSSI de Banque Beta (fictive) te transfère un bulletin de sécurité (fictif, BV-2026-117) : une faille dans une bibliothèque TLS très répandue permet d’exécuter du code à distance sans authentification ; son score CVSS est de 9,8 et une exploitation active est signalée. Les éditeurs ont publié des correctifs pour Windows Server et pour la distribution Linux utilisée par la banque. Tous les serveurs du tableau sont concernés, y compris les frontaux de la banque en ligne exposés sur Internet. Le comité des changements accorde une fenêtre de maintenance exceptionnelle ce soir, de 22h00 à 01h00, à condition de lui présenter un plan de déploiement et de retour arrière. Ton collègue Serge Mbuyi propose de « tout patcher maintenant, ce sera plus vite fait ».',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Parc concerné par BV-2026-117 — Banque Beta (fictif)',
        colonnes: ['Serveur', 'Système', 'Rôle', 'Redondance', 'Exposition'],
        lignes: [
          ['WEB-01', 'Linux', 'Frontal banque en ligne', 'Grappe active-active avec WEB-02 derrière un répartiteur de charge', 'Internet (DMZ)'],
          ['WEB-02', 'Linux', 'Frontal banque en ligne', 'Grappe active-active avec WEB-01', 'Internet (DMZ)'],
          ['APP-01', 'Linux', 'Serveur d’application des virements', 'Aucune (nœud unique)', 'Interne'],
          ['DB-01', 'Linux', 'Base du cœur bancaire (primaire)', 'Réplica synchrone DB-02', 'Interne'],
          ['DB-02', 'Linux', 'Base du cœur bancaire (réplica)', 'Peut devenir primaire par bascule', 'Interne'],
          ['DC-01', 'Windows Server', 'Contrôleur de domaine', 'Deux contrôleurs (avec DC-02)', 'Interne'],
          ['DC-02', 'Windows Server', 'Contrôleur de domaine', 'Deux contrôleurs (avec DC-01)', 'Interne'],
          ['FS-01', 'Windows Server', 'Serveur de fichiers', 'Aucune', 'Interne'],
          ['PP-WEB, PP-APP, PP-DB', 'Linux', 'Préproduction (copies de WEB, APP et DB)', '—', 'Interne'],
        ],
      },
      {
        type: 'texte',
        titre: 'Moyens de retour arrière disponibles (extrait de la procédure)',
        contenu:
          '• Toutes les machines sont virtualisées : un snapshot de VM se prend en une minute.\n• DB-01 : dernière sauvegarde complète réussie mardi 03/11 à 01h30 ; sauvegarde des journaux de transactions toutes les 15 minutes depuis.\n• Linux : retour à la version précédente d’un paquet possible avec le gestionnaire de paquets (`dnf history undo`).\n• Windows : désinstallation d’une mise à jour possible depuis les paramètres ou avec `wusa /uninstall`.',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle stratégie de déploiement présentes-tu au comité des changements ?',
        options: [
          {
            id: 'a',
            texte:
              'Suivre Serge : installer le correctif sur tous les serveurs maintenant, en pleine journée, parce qu’une faille exploitée activement ne laisse pas le temps d’attendre une fenêtre de maintenance.',
            points: 0,
            feedback:
              'Des redémarrages simultanés en pleine journée coupent la banque en ligne et le cœur bancaire, sans aucun test : une régression toucherait tout le parc à la fois, sans point de retour. La vitesse ne justifie pas la prise de risque.',
          },
          {
            id: 'b',
            texte: 'Attendre la fenêtre de maintenance mensuelle, dans trois semaines : le correctif aura été éprouvé ailleurs, et le processus de changement sera respecté.',
            points: 1,
            feedback:
              'Le processus prévoit justement des changements urgents pour ce cas. Laisser trois semaines des frontaux exposés à Internet face à une faille exploitée activement, c’est accepter un risque majeur de compromission.',
          },
          {
            id: 'c',
            texte:
              'Appliquer seulement des mesures compensatoires (filtrage sur le pare-feu applicatif, surveillance renforcée) et reporter le correctif à la semaine prochaine, après des tests complets.',
            points: 2,
            feedback:
              'Les mesures compensatoires sont utiles en attendant ce soir, mais elles ne remplacent pas le correctif : un filtrage se contourne. Une semaine d’exposition sur une faille critique et exploitée reste trop longue.',
          },
          {
            id: 'd',
            texte:
              'Tester en préproduction cet après-midi, puis déployer ce soir par vagues : redondants un par un, nœuds uniques en dernier, retour arrière prévu avant chaque serveur.',
            points: 4,
            feedback:
              'C’est le plan attendu : test préalable, déploiement progressif qui exploite la redondance pour ne jamais tout couper, point de retour arrière systématique, et protection provisoire en attendant la fenêtre. Les nœuds uniques passent en dernier, quand le correctif a déjà fait ses preuves sur le reste du parc.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Serge ajoute : « Pas besoin de sauvegarde avant de toucher DB-01, on prendra un snapshot de la VM, c’est pareil. » Que lui réponds-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Il a raison : un snapshot fige l’état complet de la VM à un instant donné, disques compris, ce qui en fait une copie aussi fiable qu’une sauvegarde, et bien plus rapide.',
            points: 0,
            feedback:
              'Faux. Un snapshot n’est pas une copie indépendante : il enregistre les modifications par rapport aux disques d’origine, sur le même stockage. Si ce stockage tombe en panne, le snapshot disparaît avec la VM.',
          },
          {
            id: 'b',
            texte:
              'Non : un snapshot est un retour arrière rapide, pas une sauvegarde, car il dépend des disques d’origine. Je vérifie qu’une sauvegarde restaurable existe, puis je prends le snapshot.',
            points: 3,
            feedback:
              'Exact. Les deux outils sont complémentaires : le snapshot pour revenir en arrière en quelques minutes si le correctif pose problème, la sauvegarde pour survivre à une vraie perte de données. Un snapshot conservé longtemps grossit et dégrade les performances : on le supprime une fois le changement validé.',
          },
          {
            id: 'c',
            texte: 'Ni snapshot ni sauvegarde : DB-02 est un réplica synchrone qui contient à chaque instant une copie exacte de DB-01, sur d’autres disques ; il suffit à protéger les données.',
            points: 1,
            feedback:
              'Le réplica est un atout pour la disponibilité (on peut basculer dessus), mais ce n’est pas une sauvegarde : une erreur, une suppression ou une corruption sur le primaire est répliquée immédiatement. Il ne permet pas de revenir en arrière.',
          },
          {
            id: 'd',
            texte: 'Lancer une sauvegarde complète de DB-01 à 22h00 et attendre qu’elle se termine avant de commencer : c’est la seule façon d’avoir un point de restauration parfaitement à jour.',
            points: 1,
            feedback:
              'Prudent, mais une sauvegarde complète du cœur bancaire peut consommer une grande partie des 3 heures de fenêtre. La chaîne existante (complète de mardi et journaux toutes les 15 minutes) donne déjà un point de restauration récent : il suffit de vérifier qu’elle est saine et de la compléter par un snapshot.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Pour les frontaux WEB-01 et WEB-02, remets dans l’ordre la mise à jour « roulante » (rolling update).',
        elements: [
          { id: 'patch', texte: 'Appliquer le correctif sur WEB-01, puis redémarrer' },
          {
            id: 'capacite',
            texte: 'Vérifier que WEB-02 peut absorber seul la charge du soir et prendre un snapshot de WEB-01',
          },
          { id: 'reint', texte: 'Réintégrer WEB-01 dans le répartiteur et surveiller erreurs et temps de réponse' },
          {
            id: 'drain',
            texte: 'Retirer WEB-01 du répartiteur de charge et laisser se terminer les sessions en cours (drain)',
          },
          { id: 'web2', texte: 'Répéter la même séquence sur WEB-02' },
          {
            id: 'verif',
            texte: 'Contrôler WEB-01 hors trafic : version du paquet, services démarrés, page de santé, scan de vulnérabilité ciblé',
          },
        ],
        ordreCorrect: ['capacite', 'drain', 'patch', 'verif', 'reint', 'web2'],
        pointsMax: 4,
        feedback:
          'La mise à jour roulante exploite la redondance : à tout moment, au moins un frontal sert les clients. On vérifie d’abord que l’autre nœud tiendra seul, puis on retire proprement le premier (drain) pour ne couper aucune session. Le contrôle se fait hors trafic : un nœud défaillant ne doit jamais être réintégré. On ne passe au second nœud qu’après avoir constaté que le premier fonctionne en production.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Sur WEB-01, la mise à jour du paquet de la bibliothèque TLS s’est terminée sans erreur. Considères-tu le serveur comme corrigé ?',
        options: [
          {
            id: 'a',
            texte:
              'Pas encore : les processus en cours gardent l’ancienne bibliothèque en mémoire. Je redémarre les services concernés (`dnf needs-restarting -s`) et je confirme par un scan.',
            points: 3,
            feedback:
              'Exact. Une bibliothèque partagée est chargée en mémoire au démarrage du processus : la remplacer sur disque ne change rien pour un serveur web qui tourne depuis des semaines. Tant que les processus n’ont pas été relancés, la faille reste exploitable. Le scan apporte la preuve indépendante attendue par le RSSI.',
          },
          {
            id: 'b',
            texte: 'Oui : le gestionnaire de paquets a renvoyé un code de sortie 0 et `rpm -q` affiche bien la nouvelle version de la bibliothèque, le correctif est donc appliqué.',
            points: 0,
            feedback:
              'Le code 0 prouve seulement que le paquet est installé sur le disque. Les processus en cours utilisent toujours l’ancienne bibliothèque chargée en mémoire : le serveur reste vulnérable.',
          },
          {
            id: 'c',
            texte: 'Oui, à condition que la page d’accueil de la banque en ligne s’affiche correctement en HTTPS : c’est la preuve que la nouvelle bibliothèque TLS négocie bien les connexions.',
            points: 1,
            feedback:
              'Le contrôle fonctionnel est nécessaire (pas de régression), mais il ne prouve rien sur la sécurité : un serveur vulnérable affiche parfaitement la page d’accueil.',
          },
          {
            id: 'd',
            texte: 'Non : un paquet binaire peut embarquer une version non corrigée ; pour être sûr, il faut recompiler la bibliothèque à partir des sources publiées avec le correctif.',
            points: 0,
            feedback:
              'Contraire aux bonnes pratiques en production : on utilise les paquets signés de l’éditeur, maintenus et traçables. Une compilation maison crée un composant que plus personne ne mettra à jour.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          '23h40 : après le correctif et le redémarrage, l’application des virements ne démarre plus sur APP-01 (nœud unique). La fenêtre se termine à 01h00. Que fais-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Je continue à chercher la cause jusqu’à ce que ça marche, même après 01h00 : un retour arrière laisserait APP-01 vulnérable, ce qui est pire qu’un léger dépassement de fenêtre.',
            points: 0,
            feedback:
              'Dépasser la fenêtre sans critère d’arrêt, c’est risquer d’avoir les virements indisponibles à l’ouverture. Le plan de changement doit fixer une heure limite de décision pour le retour arrière.',
          },
          {
            id: 'b',
            texte: 'Je restaure le snapshot d’APP-01 et je clôture le changement comme réussi, puisque le service fonctionne de nouveau et que le reste du parc est corrigé.',
            points: 1,
            feedback:
              'Le retour arrière est le bon geste, mais déclarer le changement réussi est faux : APP-01 reste vulnérable et personne ne le saura. Un échec de changement se trace, s’explique et appelle un plan de suite.',
          },
          {
            id: 'c',
            texte:
              'J’applique le critère d’abandon : retour arrière d’APP-01 avant 00h30, contrôle des virements, information du RSSI, mesures compensatoires et nouvelle fenêtre au plus tôt.',
            points: 4,
            feedback:
              'C’est la conduite professionnelle : le service est rétabli dans la fenêtre, le risque résiduel est connu, réduit et suivi, et la correction est replanifiée. APP-01 n’étant pas exposé à Internet, des mesures compensatoires rendent ce délai acceptable. Il faudra aussi comprendre pourquoi la préproduction n’a pas révélé le problème (configuration différente de la production ?).',
          },
          {
            id: 'd',
            texte: 'Je laisse APP-01 arrêté jusqu’au matin pour ne pas aggraver la situation, et je préviens l’équipe applicative par courriel afin qu’elle analyse la régression à son arrivée.',
            points: 0,
            feedback:
              'Laisser les virements à l’arrêt alors qu’un retour arrière est possible en quelques minutes est inacceptable. Et un courriel n’est pas une escalade pendant une fenêtre de maintenance.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'Rappel : bulletin, faille et parc sont fictifs.\n\nUne faille critique exploitée activement sur des serveurs exposés à Internet impose un changement urgent, mais pas précipité. Le bon plan tient en quatre idées : tester en préproduction, déployer par vagues en s’appuyant sur la redondance, disposer d’un point de retour arrière avant chaque serveur, et protéger provisoirement (filtrage, surveillance) jusqu’à la fenêtre.\n\nL’ordre de passage suit l’architecture. Les frontaux WEB-01 et WEB-02 sont mis à jour l’un après l’autre (drain, correctif, contrôle hors trafic, réintégration). Pour la base, on corrige d’abord le réplica DB-02, on bascule, puis on corrige l’ancien primaire. Les contrôleurs de domaine passent l’un après l’autre. Les nœuds uniques (APP-01, FS-01) viennent en dernier, car ils impliquent une courte coupure.\n\nDeux confusions classiques sont évaluées. La première : un snapshot n’est pas une sauvegarde (même stockage, dépendance aux disques d’origine), et un réplica non plus (il réplique aussi les erreurs). La seconde : un paquet installé ne signifie pas un serveur corrigé, car les processus gardent l’ancienne bibliothèque en mémoire tant qu’ils ne sont pas redémarrés. `dnf needs-restarting` sous Linux, le redémarrage demandé par Windows Update et un scan de vulnérabilité ferment la boucle.\n\nEnfin, un changement doit prévoir son échec : une heure limite de décision, une procédure de retour arrière testée, une escalade et un suivi du risque résiduel. Un retour arrière bien conduit n’est pas un échec professionnel ; un retour arrière caché, si.\n\nRéflexes à retenir :\n• Urgent ne veut pas dire sans test : préproduction, puis vagues.\n• Snapshot = retour arrière rapide ; sauvegarde = survie aux pertes de données.\n• Après la mise à jour d’une bibliothèque, redémarre ce qui l’utilise.\n• Toujours un critère d’abandon et une heure limite dans la fenêtre.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SYS-CAS-04 — RAID 5 dégradé et sauvegardes à vérifier
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SYS-CAS-04',
    filiere: 'systemes',
    titre: 'RAID 5 dégradé : et si la sauvegarde ne suivait pas ?',
    role: 'Administrateur systèmes et stockage — Banque Alpha',
    heure: 'Mardi 17 novembre, 07h05',
    enjeu:
      'Ramener la baie de stockage à un état redondant sans perdre de données, et prouver que la banque saurait restaurer son cœur bancaire si le pire arrivait.',
    contexte:
      'À 02h14, la baie de stockage BAIE-01 de Banque Alpha (fictive) a signalé la panne du disque 3 du groupe RG-01. Ce groupe est un RAID 5 de six disques de 4 To (20 To utiles) qui porte trois volumes : la base du cœur bancaire, les partages de fichiers et… le dépôt principal des sauvegardes. Aucun disque de secours (hot spare) n’est configuré, mais un disque compatible est disponible au magasin du centre de données. En consultant l’état SMART, tu remarques que le disque 5 accumule des secteurs réalloués depuis deux jours. Ton chef, M. Kalonji, attend un plan d’action pour 08h00 et une réponse claire à la question du directeur : « Si la baie lâche, on restaure en combien de temps ? ». L’objectif de temps de reprise (RTO) fixé pour le cœur bancaire est de 4 heures.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Journal d’événements de BAIE-01 (extrait)',
        lignes: [
          '2026-11-17 02:14:07  CRIT  RG-01  Disque 3 (4 To) : défaillance, disque exclu du groupe',
          '2026-11-17 02:14:07  WARN  RG-01  Groupe RAID 5 dégradé : plus aucune tolérance de panne',
          '2026-11-17 02:14:08  INFO  RG-01  Aucun disque de secours disponible : reconstruction non démarrée',
          '2026-11-17 06:00:00  WARN  Disque 5 : secteurs réalloués = 64 (8 le 15/11, 21 le 16/11)',
          '2026-11-17 06:00:00  INFO  RG-01  Capacité utile 20 To, utilisée 18 To (VOL-CORE 6 To, VOL-FICHIERS 7 To, VOL-SAUVEGARDE 5 To)',
          '2026-11-17 06:00:00  INFO  RG-01  Débit de reconstruction estimé sous charge de production : 80 Mo/s',
        ],
      },
      {
        type: 'table',
        titre: 'Console de sauvegarde — état au 17/11 à 07h00',
        colonnes: ['Travail', 'Données', 'Destination', 'Dernier succès', 'Statut', 'Dernier test de restauration'],
        lignes: [
          ['BKP-CORE-QUOT', 'Base du cœur bancaire (VOL-CORE)', 'VOL-SAUVEGARDE (sur BAIE-01)', '17/11 01:30', 'Succès', 'Jamais'],
          [
            'BKP-FICH-QUOT',
            'Partages de fichiers (VOL-FICHIERS)',
            'VOL-SAUVEGARDE (sur BAIE-01)',
            '17/11 03:10',
            'Succès avec avertissements : 412 fichiers ignorés (verrouillés)',
            'Jamais',
          ],
          [
            'COPIE-BANDES',
            'Copie de VOL-SAUVEGARDE',
            'Bandes, coffre du site secondaire',
            '05/11 04:00',
            'Échec depuis le 06/11 (lecteur hors ligne) ; aucune alerte envoyée',
            'Mars 2026 (un seul fichier)',
          ],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle est ta première décision, à 07h05 ?',
        options: [
          {
            id: 'a',
            texte:
              'Mettre d’abord une copie de BKP-CORE à l’abri hors de la baie, alléger la charge, puis remplacer le disque 3 et reconstruire en surveillant le disque 5.',
            points: 3,
            feedback:
              'C’est la bonne priorité. Toutes les sauvegardes récentes sont sur la baie dégradée : si un second disque lâche, la banque perd à la fois la production et ses sauvegardes. Mettre une copie à l’abri ne prend pas longtemps ; ensuite, la reconstruction peut démarrer en limitant la charge sur les disques.',
          },
          {
            id: 'b',
            texte: 'Remplacer tout de suite le disque 3 et lancer la reconstruction : plus vite elle démarre, plus vite la redondance revient, et chaque minute en mode dégradé est une minute de risque.',
            points: 2,
            feedback:
              'Bon réflexe sur le fond, mais incomplet : la reconstruction sollicite fortement tous les disques restants, dont le disque 5 déjà fragile. Si elle échoue, il n’existe aucune copie récente hors de la baie. Il faut d’abord sécuriser cette copie.',
          },
          {
            id: 'c',
            texte: 'Remplacer en même temps les disques 3 et 5 : le disque 5 accumule des secteurs réalloués, et une seule reconstruction pour les deux évite de solliciter deux fois le groupe.',
            points: 0,
            feedback:
              'Erreur fatale : un RAID 5 ne tolère qu’un seul disque manquant. Retirer le disque 5 alors que le disque 3 est déjà absent détruit le groupe entier, donc les trois volumes. Le disque 5 se remplace APRÈS la reconstruction complète.',
          },
          {
            id: 'd',
            texte: 'Arrêter complètement la baie jusqu’à l’arrivée du technicien du constructeur : des disques à l’arrêt ne s’usent plus, et le disque 5 ne risque pas de lâcher entre-temps.',
            points: 1,
            feedback:
              'Cela ménage les disques, mais arrête toute la banque (cœur bancaire, partages) sans rien sécuriser et sans réduire la durée pendant laquelle le groupe est vulnérable. L’intervention est à la portée de l’équipe, avec le disque disponible.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'La reconstruction démarre à 08h00 à environ 80 Mo/s : 4 To doivent être réécrits sur le nouveau disque. Combien de temps RG-01 reste-t-il sans tolérance de panne ?',
        options: [
          {
            id: 'a',
            texte: 'Environ 1 h 25 min : 4 To, soit 400 000 Mo, divisés par 80 Mo/s donnent 5 000 secondes ; la reconstruction sera finie avant 09h30.',
            points: 0,
            feedback:
              'Erreur d’un facteur 10 dans la conversion. 4 To = 4 000 000 Mo ; 4 000 000 ÷ 80 = 50 000 secondes, soit près de 14 heures.',
          },
          {
            id: 'b',
            texte: 'Environ 69 heures, car la reconstruction doit relire l’intégralité des 20 To du groupe pour recalculer la parité : 20 To ÷ 80 Mo/s = 250 000 secondes.',
            points: 1,
            feedback:
              'Les disques restants sont lus en parallèle : ce qui limite la reconstruction, c’est l’écriture des 4 To du nouveau disque. 20 To ÷ 80 Mo/s donnerait bien 250 000 s (69 h), mais ce n’est pas le bon raisonnement.',
          },
          {
            id: 'c',
            texte:
              'Environ 14 heures (4 To ÷ 80 Mo/s = 50 000 s), jusque vers 22h00 : une panne du disque 5 d’ici là ferait perdre tout le groupe.',
            points: 3,
            feedback:
              'Exact : 4 000 000 Mo ÷ 80 Mo/s = 50 000 s ≈ 13 h 53 min, donc fin vers 21h53. Pendant cette fenêtre, RG-01 n’a aucune protection, alors que la reconstruction sollicite intensément les disques restants. C’est pour cela que la copie hors baie devait passer en premier.',
          },
          {
            id: 'd',
            texte: 'Aucun risque : en RAID 5, la parité répartie sur tous les disques protège toujours les données, même pendant la reconstruction, qui ne fait que recopier ce qui existe déjà.',
            points: 0,
            feedback:
              'Faux : la parité du RAID 5 compense UN disque manquant. Tant que la reconstruction n’est pas terminée, cette protection est déjà consommée ; une seconde panne ou une erreur de lecture irrécupérable sur un disque restant peut faire échouer la reconstruction.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'Que conclus-tu de la console de sauvegarde au regard de la règle 3-2-1 (3 copies des données, sur 2 supports différents, dont 1 hors site) ?',
        options: [
          {
            id: 'a',
            texte: 'Tout va bien : les deux sauvegardes de cette nuit sont en succès, et entre la production, VOL-SAUVEGARDE et les bandes, on compte bien trois copies sur deux supports.',
            points: 0,
            feedback:
              'Un travail « en succès » ne dit rien sur l’endroit où est stockée la copie ni sur sa capacité à être restaurée. Ici, la copie est sur la baie même qu’elle doit protéger.',
          },
          {
            id: 'b',
            texte: 'Le seul problème est le lecteur de bandes hors ligne depuis le 06/11 : il suffit de le remettre en ligne pour que la copie hors site reprenne et que la règle soit de nouveau respectée.',
            points: 1,
            feedback:
              'C’est un vrai problème (12 jours sans copie hors site, sans alerte), mais pas le seul : le dépôt principal sur BAIE-01, les fichiers ignorés et l’absence totale de tests de restauration sont tout aussi graves.',
          },
          {
            id: 'c',
            texte: 'Il manque seulement des tests de restauration : les copies existent, sur disque et sur bande, et l’une d’elles est hors site, donc les trois chiffres de la règle sont couverts.',
            points: 1,
            feedback:
              'Les tests manquent bien, mais le reste n’est pas conforme : la seule copie récente partage le même matériel que la production, ce qui viole l’esprit même de la règle 3-2-1.',
          },
          {
            id: 'd',
            texte:
              'Non conforme : la seule copie récente est sur la baie qu’elle doit protéger, la copie hors site échoue sans alerte depuis 12 jours, et aucune restauration n’a été testée.',
            points: 3,
            feedback:
              'Exact, et c’est le vrai sujet de la journée. Aujourd’hui, la banque n’a qu’une copie récente, sur le même support que la production, et aucune preuve qu’elle sait restaurer. Une sauvegarde non testée n’est qu’une hypothèse ; une sauvegarde qui échoue sans alerte n’existe pas.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Tu organises un premier test de restauration du cœur bancaire. Remets les étapes dans l’ordre.',
        elements: [
          {
            id: 'metier',
            texte: 'Faire valider les données restaurées par le métier sur quelques opérations connues (soldes, derniers virements)',
          },
          {
            id: 'isoler',
            texte: 'Restaurer dans un environnement isolé (serveur de test, réseau séparé), jamais par-dessus la production',
          },
          {
            id: 'mesurer',
            texte: 'Mesurer la durée totale, la comparer au RTO et consigner résultats et écarts dans un procès-verbal',
          },
          {
            id: 'choisir',
            texte: 'Choisir un point de restauration précis (BKP-CORE du 17/11 à 01h30) et noter l’heure de début',
          },
          {
            id: 'integrite',
            texte: 'Contrôler l’intégrité technique : sommes de contrôle, vérification de cohérence de la base, démarrage de l’application',
          },
        ],
        ordreCorrect: ['choisir', 'isoler', 'integrite', 'metier', 'mesurer'],
        pointsMax: 4,
        feedback:
          'Un test de restauration est une expérience mesurée : on fixe le point de départ et l’heure, on restaure à l’écart de la production (une restauration par-dessus la production serait un incident), on vérifie la technique puis le métier, et l’on mesure la durée réelle pour la confronter au RTO. Le procès-verbal fait du test une preuve opposable aux auditeurs.',
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Ce premier test restaure 1,8 To de VOL-CORE vers un serveur isolé en 2 h 30. À ce débit, combien de temps faudrait-il pour restaurer les 6 To du cœur bancaire, et le RTO de 4 heures est-il tenu ?',
        options: [
          {
            id: 'a',
            texte: 'Environ 2 h 30, comme le test : la durée dépend surtout de la préparation du serveur et de la base, pas du volume, donc le RTO de 4 heures est tenu avec de la marge.',
            points: 0,
            feedback:
              'Le test ne portait que sur 1,8 To. La durée d’une restauration croît avec le volume : 6 To prendront nettement plus longtemps.',
          },
          {
            id: 'b',
            texte:
              'Environ 8 h 20 (200 Mo/s mesurés ; 6 To ÷ 200 Mo/s = 30 000 s) : le RTO de 4 heures n’est pas tenu, je le signale à la direction.',
            points: 3,
            feedback:
              'Exact. C’est une extrapolation linéaire, à confirmer par un test complet, mais l’écart est trop grand pour être un artefact : plus du double du RTO. C’est la réponse honnête à la question du directeur, accompagnée des solutions pour la réduire.',
          },
          {
            id: 'c',
            texte: 'Environ 3 h 20, puisque 6 To représentent 3,33 fois le volume testé : le RTO de 4 heures est tenu, mais de justesse, et il faudra le surveiller.',
            points: 0,
            feedback:
              '3,33 est le rapport des volumes (6 ÷ 1,8), pas une durée en heures. Il faut multiplier la durée du test par ce rapport : 2,5 h × 3,33 ≈ 8,3 h, soit environ 8 h 20.',
          },
          {
            id: 'd',
            texte: 'Impossible à dire sans restaurer les 6 To : une extrapolation serait trompeuse, on ne communique donc rien au directeur avant un test complet.',
            points: 1,
            feedback:
              'Un test complet est en effet nécessaire pour confirmer, mais l’estimation disponible suffit déjà à montrer que le RTO est menacé. Se taire en attendant prive la direction d’une information de risque majeure.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e6',
        question: 'Quelles mesures durables proposes-tu à M. Kalonji ?',
        options: [
          {
            id: 'a',
            texte:
              'Sortir les sauvegardes de BAIE-01, rétablir une copie hors site et une copie hors ligne surveillées, passer RG-01 en RAID 6 avec un disque de secours, tester la restauration chaque trimestre et réduire le temps de reprise.',
            points: 3,
            feedback:
              'C’est le plan complet : il traite la disponibilité (RAID 6, disque de secours), la sauvegarde (indépendance, hors site, hors ligne, alertes), la preuve (tests réguliers) et l’objectif métier (RTO). Le RAID 6 tolère deux pannes simultanées, ce qui couvre précisément le scénario d’aujourd’hui.',
          },
          {
            id: 'b',
            texte: 'Passer RG-01 en RAID 6 avec un disque de secours : avec deux disques de parité, le groupe survit à deux pannes simultanées, ce qui rend la copie hors site superflue et libère le budget des bandes.',
            points: 1,
            feedback:
              'Le RAID 6 est une bonne idée pour la disponibilité, mais le RAID n’est pas une sauvegarde : il ne protège ni contre une suppression, ni contre un rançongiciel, ni contre l’incendie de la salle ou la panne de la baie entière.',
          },
          {
            id: 'c',
            texte: 'Passer RG-01 en RAID 0 pour accélérer les écritures et les reconstructions : les sauvegardes et la copie hors site, une fois rétablies, suffiront à couvrir le risque de panne.',
            points: 0,
            feedback:
              'Le RAID 0 n’a aucune redondance : la panne d’un seul disque détruit tout le groupe, et il n’y a rien à reconstruire. C’est l’opposé de ce qu’il faut.',
          },
          {
            id: 'd',
            texte: 'Remplacer les bandes par une seconde baie identique dans la même salle, synchronisée en temps réel : en cas de panne de BAIE-01, la bascule est immédiate et aucune donnée n’est perdue.',
            points: 1,
            feedback:
              'Une seconde baie améliore la disponibilité, mais une synchronisation en temps réel réplique aussi les suppressions et le chiffrement par un rançongiciel, et la même salle expose les deux baies au même sinistre. Il manque la copie hors site et hors ligne.',
          },
        ],
      },
    ],
    pointsMax: 19,
    debrief:
      'Rappel : baie, volumes et chiffres de l’exercice sont fictifs.\n\nUn RAID 5 de six disques de 4 To offre 20 To utiles (un disque de capacité sert à la parité) et tolère la perte d’un seul disque. Depuis 02h14, RG-01 n’a donc plus aucune protection, et le disque 5 montre des signes d’usure. La reconstruction réécrit 4 To à environ 80 Mo/s : 50 000 secondes, près de 14 heures de vulnérabilité, sous forte sollicitation des disques restants. Retirer le disque 5 pendant ce temps détruirait le groupe : on ne le remplace qu’après la reconstruction.\n\nLe vrai problème n’est pas le disque mais la sauvegarde. Le dépôt principal est sur la baie qu’il protège, la copie hors site échoue depuis 12 jours sans alerte, 412 fichiers sont ignorés chaque nuit et aucune restauration n’a jamais été testée. La règle 3-2-1 (trois copies, deux supports différents, une hors site), souvent complétée par une copie hors ligne ou immuable contre les rançongiciels, n’est pas respectée. D’où la première décision : mettre une copie récente à l’abri hors de la baie avant de lancer la reconstruction.\n\nLe test de restauration (1,8 To en 2 h 30, soit 200 Mo/s) permet de répondre au directeur : restaurer les 6 To prendrait environ 8 h 20, plus du double du RTO de 4 heures. C’est une information de risque à remonter immédiatement, avec un plan : stockage de sauvegarde indépendant, copies hors site et hors ligne surveillées, RAID 6 et disque de secours (16 To utiles, suffisants une fois les 5 To du dépôt de sauvegarde sortis des 18 To utilisés), tests trimestriels et réplication pour réduire le temps de reprise.\n\nRéflexes à retenir :\n• RAID = disponibilité, sauvegarde = récupération : l’un ne remplace jamais l’autre.\n• Groupe dégradé : on sécurise les données, puis on reconstruit, et on ne retire aucun autre disque.\n• Une sauvegarde non testée n’est qu’une hypothèse ; un échec sans alerte est une absence de sauvegarde.\n• Mesure, puis extrapole : un RTO se prouve par un test chronométré.',
  },
];
