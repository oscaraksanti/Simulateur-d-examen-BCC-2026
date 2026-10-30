// Banque technique — filière « Administration des systèmes » (préfixe SYS) : 60 questions.
// Contextes fictifs (Banque Alpha, domaines .example, IP de documentation) ; calculs vérifiés par script.
import type { QcmQuestion } from '@/lib/types';

export const banqueTechniqueSystemes: QcmQuestion[] = [
  // ───────────────────────────── Linux ─────────────────────────────
  {
    id: 'SYS-LNX-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'facile',
    enonce:
      "Sur un serveur Linux de la Banque Alpha, l'administrateur exécute `chmod 750 sauvegarde.sh`. Quels droits obtient-on ?",
    options: [
      { id: 'A', texte: 'Propriétaire rwx, groupe rwx, autres r-x' },
      { id: 'B', texte: 'Propriétaire rw-, groupe r--, autres aucun droit' },
      { id: 'C', texte: 'Propriétaire rwx, groupe r-x, autres aucun droit' },
      { id: 'D', texte: 'Propriétaire rwx, groupe r-x, autres r-x' },
    ],
    bonneReponse: 'C',
    explication:
      "Chaque chiffre octal additionne r = 4, w = 2 et x = 1. 7 = 4+2+1 donne rwx au propriétaire, 5 = 4+1 donne r-x au groupe et 0 ne donne rien aux autres : on obtient `rwxr-x---`.",
    pourquoiPas: {
      A: "Ce sont les droits 775 : le groupe aurait aussi l'écriture et les autres la lecture et l'exécution.",
      B: "Ce sont les droits 640 : le script ne serait exécutable par personne, pas même par son propriétaire.",
      D: "Ce sont les droits 755 : le dernier chiffre vaut 5, pas 0, et les autres pourraient lire et lancer le script.",
    },
    aRetenir: "En octal, r = 4, w = 2, x = 1 : on additionne pour chaque classe dans l'ordre propriétaire, groupe, autres.",
  },
  {
    id: 'SYS-LNX-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'moyen',
    enonce:
      "Le compte de service `appli` a un `umask` de `027`. Quels droits auront les fichiers et répertoires qu'il crée (avec les droits de base habituels 666 et 777) ?",
    options: [
      { id: 'A', texte: 'Fichiers en 640 (rw-r-----), répertoires en 750 (rwxr-x---)' },
      { id: 'B', texte: 'Fichiers en 750 (rwxr-x---), répertoires en 750 (rwxr-x---)' },
      { id: 'C', texte: 'Fichiers et répertoires en 027 (----w-rwx)' },
      { id: 'D', texte: 'Fichiers en 644 (rw-r--r--), répertoires en 755 (rwxr-xr-x)' },
    ],
    bonneReponse: 'A',
    explication:
      "Le umask retire des droits à la valeur de base : 666 pour un fichier, 777 pour un répertoire. 666 privé de 027 donne 640 et 777 privé de 027 donne 750. Le groupe garde la lecture, les autres n'ont plus aucun accès : c'est un réglage courant sur un serveur sensible.",
    pourquoiPas: {
      B: "Un fichier ordinaire ne reçoit jamais le droit d'exécution à la création : sa base est 666, pas 777.",
      C: "Le umask est un masque de droits à retirer, pas les droits eux-mêmes : il faut le soustraire de la base.",
      D: "Ces valeurs correspondent au umask 022, qui laisse la lecture aux autres utilisateurs.",
    },
    aRetenir: "Droits à la création = base (666 fichier, 777 répertoire) dont on retire les bits du umask.",
  },
  {
    id: 'SYS-LNX-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'moyen',
    enonce: 'Que signifie la lettre `s` à la place du `x` du propriétaire dans la sortie ci-dessous ?',
    extrait: {
      langage: 'shell',
      contenu: `$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 59976 12 mars   2025 /usr/bin/passwd`,
    },
    options: [
      { id: 'A', texte: 'Le fichier est un lien symbolique vers un autre programme' },
      { id: 'B', texte: "Le bit SUID : il s'exécute avec les droits de root, son propriétaire" },
      { id: 'C', texte: 'Le sticky bit : seul le propriétaire du fichier peut le supprimer ou le renommer' },
      { id: 'D', texte: 'Le fichier est un socket de communication entre processus' },
    ],
    bonneReponse: 'B',
    explication:
      "Un `s` en position d'exécution du propriétaire indique le bit SUID. `passwd` en a besoin pour qu'un utilisateur ordinaire puisse modifier son propre mot de passe dans `/etc/shadow`, fichier réservé à root. Comme ces programmes donnent des droits root, leur liste doit être auditée régulièrement (`find / -perm -4000`).",
    pourquoiPas: {
      A: "Un lien symbolique se reconnaît au premier caractère `l`, pas à une lettre dans les droits.",
      C: "Le sticky bit apparaît sous forme de `t` dans la position « autres » et concerne surtout les répertoires comme `/tmp`.",
      D: "Un socket est signalé par un `s` en PREMIÈRE position (type de fichier), alors qu'ici le premier caractère est `-` (fichier ordinaire).",
    },
    aRetenir: "SUID (`s` chez le propriétaire) = exécution avec les droits du propriétaire du fichier : à surveiller de près.",
  },
  {
    id: 'SYS-LNX-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'facile',
    enonce:
      "Le service `nginx` vient d'être installé sur un serveur géré par systemd. Quelle commande garantit qu'il démarrera automatiquement à chaque redémarrage du serveur ?",
    options: [
      { id: 'A', texte: '`systemctl start nginx`' },
      { id: 'B', texte: '`systemctl enable nginx`' },
      { id: 'C', texte: '`systemctl reload nginx`' },
      { id: 'D', texte: '`systemctl status nginx`' },
    ],
    bonneReponse: 'B',
    explication:
      "`systemctl enable` crée les liens qui rattachent l'unité à la cible de démarrage : le service sera lancé à chaque boot. `enable` ne le démarre pas tout de suite ; `systemctl enable --now nginx` fait les deux d'un coup.",
    pourquoiPas: {
      A: "`start` lance le service maintenant, mais il ne redémarrera pas tout seul après un reboot.",
      C: "`reload` demande au service déjà lancé de relire sa configuration, sans rien changer au démarrage automatique.",
      D: "`status` affiche l'état et les dernières lignes de journal, il ne modifie rien.",
    },
    aRetenir: "`start` = maintenant, `enable` = à chaque démarrage ; `enable --now` combine les deux.",
  },
  {
    id: 'SYS-LNX-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'moyen',
    enonce:
      "Sur un serveur RHEL (unité `sshd.service`), tu veux lire uniquement les journaux du service SSH de la dernière heure. Quelle commande utiliser ?",
    options: [
      { id: 'A', texte: '`journalctl -u sshd --since "1 hour ago"`' },
      { id: 'B', texte: '`journalctl -f`' },
      { id: 'C', texte: '`dmesg | grep sshd`' },
      { id: 'D', texte: '`tail -n 100 /var/log/sshd.log`' },
    ],
    bonneReponse: 'A',
    explication:
      "journalctl interroge le journal de systemd : `-u` filtre sur une unité et `--since` sur une période. On peut ajouter `-p err` pour ne garder que les erreurs ou `-f` pour suivre en direct. C'est le réflexe à avoir avant de fouiller les fichiers texte.",
    pourquoiPas: {
      B: "`-f` suit en temps réel TOUT le journal, sans filtre sur le service ni sur la période.",
      C: "`dmesg` affiche les messages du noyau, pas les journaux applicatifs d'un service comme sshd.",
      D: "Ce fichier n'existe pas par défaut : sur RHEL les messages d'authentification SSH vont dans `/var/log/secure` (via rsyslog) et dans le journal systemd.",
    },
    aRetenir: "`journalctl -u <unité> --since …` : le filtre le plus rapide pour les journaux d'un service systemd.",
  },
  {
    id: 'SYS-LNX-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'difficile',
    enonce:
      "Sur le serveur de traitements de nuit, un processus reste affiché ainsi malgré plusieurs `kill -9 48211`. Quelle est la bonne approche ?",
    extrait: {
      langage: 'shell',
      contenu: `$ ps -eo pid,ppid,stat,cmd | grep defunct
48211 48190 Z    [rapport_batch] <defunct>`,
    },
    options: [
      { id: 'A', texte: 'Renvoyer `kill -9 48211` avec sudo : sans les droits root, le signal est ignoré' },
      { id: 'B', texte: 'Redémarrer le serveur au plus vite : c’est le seul moyen de libérer l’entrée de ce processus' },
      { id: 'C', texte: 'Faire récupérer son statut par le parent (PID 48190), voire arrêter ce parent' },
      { id: 'D', texte: 'Supprimer le répertoire `/proc/48211` pour effacer le processus de la table' },
    ],
    bonneReponse: 'C',
    explication:
      "L'état `Z` (zombie, `<defunct>`) désigne un processus déjà terminé : il ne reste que son entrée dans la table des processus, en attendant que son parent lise son code de retour (appel `wait`). Aucun signal ne peut tuer ce qui est déjà mort. Si le parent est arrêté, le zombie est adopté par PID 1 (systemd), qui le nettoie aussitôt.",
    pourquoiPas: {
      A: "Le problème n'est pas un manque de droits : un zombie n'exécute plus rien et ne peut plus recevoir de signal.",
      B: "Un zombie ne consomme ni CPU ni mémoire, seulement un PID : redémarrer un serveur de production est disproportionné.",
      D: "`/proc` est un système de fichiers virtuel reflétant le noyau : on ne peut pas y supprimer un processus.",
    },
    aRetenir: "Un zombie est déjà mort : c'est son parent qu'il faut corriger ou arrêter, pas lui.",
  },
  {
    id: 'SYS-LNX-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'facile',
    enonce: 'Quand la ligne de crontab ci-dessous lance-t-elle le script ?',
    extrait: {
      langage: 'shell',
      contenu: `# min heure jour-du-mois mois jour-de-la-semaine  commande
30 2 * * 1-5 /opt/scripts/sauvegarde.sh`,
    },
    options: [
      { id: 'A', texte: 'Du lundi au vendredi, à 2 h 30' },
      { id: 'B', texte: 'Le 2 de chaque mois, à 0 h 30' },
      { id: 'C', texte: 'Toutes les 30 minutes entre 1 h et 5 h' },
      { id: 'D', texte: 'À 2 h 30, du 1er au 5 de chaque mois' },
    ],
    bonneReponse: 'A',
    explication:
      "Les cinq champs sont, dans l'ordre : minute (30), heure (2), jour du mois (*), mois (*) et jour de la semaine (1-5, soit lundi à vendredi, 0 ou 7 = dimanche). La sauvegarde tourne donc chaque jour ouvré à 2 h 30.",
    pourquoiPas: {
      B: "Le 2 est dans le champ heure, pas dans le champ jour du mois.",
      C: "« Toutes les 30 minutes » s'écrirait `*/30` dans le premier champ, et une plage horaire `1-5` dans le deuxième.",
      D: "La plage 1-5 est dans le cinquième champ (jour de la semaine), pas dans le troisième (jour du mois).",
    },
    aRetenir: "Ordre des champs cron : minute, heure, jour du mois, mois, jour de la semaine.",
  },
  {
    id: 'SYS-LNX-008',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Linux',
    difficulte: 'moyen',
    enonce:
      "Tu génères une paire de clés SSH sur ton poste pour te connecter à `srv-app01` sans mot de passe. Que fais-tu de chaque clé ?",
    options: [
      { id: 'A', texte: "Tu copies la clé privée dans `~/.ssh/authorized_keys` sur le serveur et tu gardes la clé publique sur ton poste" },
      { id: 'B', texte: 'Tu copies les deux clés sur le serveur, puis tu les supprimes de ton poste par sécurité' },
      { id: 'C', texte: "Tu envoies la clé privée par e-mail à l'équipe pour que chacun puisse se connecter" },
      { id: 'D', texte: 'Clé publique dans `~/.ssh/authorized_keys` du serveur, clé privée conservée sur ton poste' },
    ],
    bonneReponse: 'D',
    explication:
      "Le serveur n'a besoin que de la clé publique (copiée par exemple avec `ssh-copy-id`) pour vérifier que le client détient la clé privée correspondante. La clé privée ne quitte jamais le poste, idéalement protégée par une phrase de passe et en droits 600. On peut ensuite désactiver l'authentification par mot de passe côté serveur.",
    pourquoiPas: {
      A: "C'est l'inverse : la clé privée est le secret, elle ne doit jamais être déposée sur le serveur.",
      B: "Sans la clé privée sur le poste, plus aucune connexion n'est possible, et le secret se retrouve exposé sur le serveur.",
      C: "Une clé privée partagée n'identifie plus personne et fuit par la messagerie : chaque administrateur doit avoir sa propre paire.",
    },
    aRetenir: "Clé publique sur le serveur (`authorized_keys`), clé privée uniquement sur le poste, protégée par une phrase de passe.",
  },

  // ─────────────────── Windows Server & Active Directory ───────────────────
  {
    id: 'SYS-AD-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'facile',
    enonce:
      "Dans l'Active Directory de la Banque Alpha, tu dois appliquer une GPO aux seuls postes de l'agence de Matadi et déléguer au support local la réinitialisation des mots de passe de ses utilisateurs. Quel objet créer ?",
    options: [
      { id: 'A', texte: 'Une unité d’organisation (OU) « Matadi »' },
      { id: 'B', texte: 'Un groupe de sécurité global « Matadi »' },
      { id: 'C', texte: 'Un nouveau domaine « matadi.banque-alpha.example »' },
      { id: 'D', texte: 'Un site Active Directory « Matadi » associé au sous-réseau de l’agence' },
    ],
    bonneReponse: 'A',
    explication:
      "L'OU est le conteneur administratif de l'annuaire : on y lie des GPO et on y délègue des tâches précises (assistant « Délégation de contrôle »). Les groupes servent à accorder des permissions sur des ressources, les sites décrivent la topologie physique pour la réplication.",
    pourquoiPas: {
      B: "Une GPO ne se lie pas à un groupe (au mieux on filtre une GPO par groupe) et la délégation se fait sur une OU.",
      C: "Créer un domaine pour une agence alourdit fortement l'administration (contrôleurs, approbations) sans nécessité.",
      D: "Un site sert à optimiser la réplication et la localisation des contrôleurs de domaine selon le réseau physique, pas à déléguer l'administration des comptes.",
    },
    aRetenir: "OU = lier des GPO et déléguer ; groupe = donner des droits ; site = topologie réseau.",
  },
  {
    id: 'SYS-AD-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'facile',
    enonce:
      "Une utilisatrice affirme qu'une stratégie de groupe ne s'applique pas à sa session. Quelle commande, lancée sur son poste, affiche les GPO effectivement appliquées à l'ordinateur et à l'utilisateur ?",
    options: [
      { id: 'A', texte: '`gpupdate /force`' },
      { id: 'B', texte: '`gpresult /r`' },
      { id: 'C', texte: '`ipconfig /all`' },
      { id: 'D', texte: '`dcdiag`' },
    ],
    bonneReponse: 'B',
    explication:
      "`gpresult /r` résume le jeu de stratégies résultant (RSoP) : GPO appliquées, GPO filtrées et groupes de l'utilisateur. `gpresult /h rapport.html` produit un rapport détaillé. On commence par diagnostiquer, puis on force éventuellement une mise à jour.",
    pourquoiPas: {
      A: "`gpupdate /force` réapplique les stratégies mais n'indique pas lesquelles ont été retenues ou filtrées.",
      C: "`ipconfig /all` montre la configuration IP et DNS : utile si le poste ne joint pas le domaine, mais pas la liste des GPO.",
      D: "`dcdiag` teste la santé d'un contrôleur de domaine, pas les stratégies reçues par un poste.",
    },
    aRetenir: "`gpresult /r` pour voir ce qui s'applique, `gpupdate /force` pour réappliquer.",
  },
  {
    id: 'SYS-AD-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'moyen',
    enonce:
      "Une GPO liée au domaine verrouille l'écran des postes après 15 minutes d'inactivité. Une GPO liée à l'OU « Guichets » règle ce même paramètre à 5 minutes. Aucune n'est « appliquée » (enforced) et l'héritage n'est pas bloqué. Que vaut le délai sur un poste de l'OU « Guichets » ?",
    options: [
      { id: 'A', texte: '15 minutes, car le domaine est prioritaire sur les OU' },
      { id: 'B', texte: '5 minutes, car la GPO de l’OU est appliquée en dernier' },
      { id: 'C', texte: 'Le délai le plus restrictif, choisi automatiquement par Windows' },
      { id: 'D', texte: 'La valeur par défaut de Windows, car les deux GPO se contredisent' },
    ],
    bonneReponse: 'B',
    explication:
      "Les GPO s'appliquent dans l'ordre LSDOU : stratégie Locale, Site, Domaine, puis OU (de la plus haute à la plus proche de l'objet). En cas de conflit, la dernière appliquée l'emporte : ici l'OU « Guichets ». Seule l'option « Appliqué » (enforced) sur la GPO du domaine inverserait ce résultat.",
    pourquoiPas: {
      A: "Le domaine est traité AVANT l'OU : sa valeur est écrasée par celle, plus proche, de l'OU.",
      C: "Windows ne compare pas les valeurs pour retenir la plus sévère : il applique l'ordre de traitement.",
      D: "Un conflit ne fait pas revenir à la valeur par défaut : c'est la GPO traitée en dernier qui fixe la valeur.",
    },
    aRetenir: "Ordre LSDOU : Local, Site, Domaine, OU ; la dernière appliquée gagne, sauf GPO « Appliquée » (enforced).",
  },
  {
    id: 'SYS-AD-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'moyen',
    enonce:
      "Dans une agence, plusieurs postes refusent l'ouverture de session au domaine ; les journaux mentionnent une erreur Kerberos de décalage d'horloge. Les postes ont 12 minutes d'avance. Quelle est la cause la plus probable ?",
    options: [
      { id: 'A', texte: "Un écart d'horloge supérieur à la tolérance de Kerberos (5 min par défaut)" },
      { id: 'B', texte: "Les mots de passe des utilisateurs de l'agence ont tous expiré le même jour" },
      { id: 'C', texte: 'Les comptes ordinateurs sont corrompus : il faut sortir les postes du domaine puis les réintégrer un par un' },
      { id: 'D', texte: 'Kerberos est mal configuré : il faut le désactiver et n’utiliser que NTLM' },
    ],
    bonneReponse: 'A',
    explication:
      "Les tickets Kerberos sont horodatés pour empêcher le rejeu : par défaut, un écart de plus de 5 minutes entre client et contrôleur de domaine fait échouer l'authentification. Les membres du domaine se synchronisent sur les contrôleurs, eux-mêmes alignés sur l'émulateur PDC, qui doit suivre une source de temps fiable.",
    pourquoiPas: {
      B: "Un mot de passe expiré produit un message explicite de changement de mot de passe, pas une erreur de décalage d'horloge.",
      C: "Réintégrer les postes ne corrige pas l'heure : l'erreur reviendrait aussitôt.",
      D: "NTLM est plus faible que Kerberos ; on corrige la synchronisation de l'heure au lieu de dégrader la sécurité.",
    },
    aRetenir: "Kerberos dépend de l'heure : au-delà de 5 minutes d'écart (par défaut), l'authentification échoue.",
  },
  {
    id: 'SYS-AD-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'moyen',
    enonce: 'Que produit ce script PowerShell exécuté par l’équipe systèmes ?',
    extrait: {
      langage: 'shell',
      contenu: `PS C:\\> Get-ADUser -Filter 'Enabled -eq $true' -SearchBase 'OU=Agences,DC=banque-alpha,DC=example' -Properties LastLogonDate |
    Where-Object { $_.LastLogonDate -lt (Get-Date).AddDays(-90) } |
    Select-Object SamAccountName, LastLogonDate |
    Export-Csv -Path C:\\Rapports\\inactifs.csv -NoTypeInformation -Encoding UTF8`,
    },
    options: [
      { id: 'A', texte: "Il désactive les comptes de l'OU Agences sans connexion depuis 90 jours" },
      { id: 'B', texte: 'Il supprime de l’annuaire les comptes de l’OU Agences créés il y a plus de 90 jours' },
      { id: 'C', texte: "Il liste dans un CSV tous les comptes de l'annuaire, actifs ou non" },
      { id: 'D', texte: "Un CSV des comptes actifs de l'OU Agences sans connexion depuis plus de 90 jours" },
    ],
    bonneReponse: 'D',
    explication:
      "`Get-ADUser` récupère les comptes activés de l'OU Agences avec leur `LastLogonDate`, `Where-Object` garde ceux dont la dernière connexion est antérieure à aujourd'hui moins 90 jours, puis `Export-Csv` écrit le rapport. Le script ne modifie rien : c'est une revue d'accès, préalable à une désactivation validée. `LastLogonDate` est répliquée avec un retard possible d'environ deux semaines, ce qui suffit pour un seuil de 90 jours.",
    pourquoiPas: {
      A: "Aucune commande de modification (`Disable-ADAccount`) n'apparaît : le script ne fait que lire et exporter.",
      B: "Le filtre porte sur la dernière connexion, pas sur la date de création, et rien n'est supprimé.",
      C: "`-SearchBase` limite la recherche à l'OU Agences et `-Filter` ne garde que les comptes activés.",
    },
    aRetenir: "Lis un pipeline PowerShell de gauche à droite : sélection, filtre, projection, export.",
  },
  {
    id: 'SYS-AD-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'moyen',
    enonce:
      "Le service Windows d'une application interne tourne sous un compte de domaine dont le mot de passe n'expire jamais et est connu de plusieurs prestataires. Quelle est la meilleure pratique pour ce compte de service ?",
    options: [
      { id: 'A', texte: 'Le remplacer par un compte de service géré de groupe (gMSA)' },
      { id: 'B', texte: 'Ajouter ce compte au groupe Admins du domaine pour éviter toute panne de droits' },
      { id: 'C', texte: "Faire tourner le service sous le compte personnel de l'administrateur principal" },
      { id: 'D', texte: 'Garder le compte et noter son mot de passe dans un classeur Excel partagé' },
    ],
    bonneReponse: 'A',
    explication:
      "Un gMSA a un mot de passe long, aléatoire et renouvelé automatiquement par Active Directory ; aucun humain ne le connaît et seuls les serveurs autorisés peuvent l'utiliser. On lui accorde uniquement les droits nécessaires au service, selon le moindre privilège.",
    pourquoiPas: {
      B: "Un compte de service administrateur du domaine est une cible idéale : sa compromission donne tout l'annuaire.",
      C: "Le service tomberait au départ de l'administrateur ou au changement de son mot de passe, et ses actions seraient mélangées aux siennes.",
      D: "Un mot de passe partagé dans un fichier est exposé et n'est jamais changé : c'est exactement le problème à corriger.",
    },
    aRetenir: "Compte de service : gMSA quand c'est possible, droits minimaux, jamais de mot de passe partagé.",
  },
  {
    id: 'SYS-AD-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'difficile',
    enonce:
      "Quel rôle FSMO est la source de temps de référence du domaine, reçoit en priorité les changements de mot de passe et traite les verrouillages de comptes ?",
    options: [
      { id: 'A', texte: 'Le maître de schéma' },
      { id: 'B', texte: "Le maître d'attribution des noms de domaine" },
      { id: 'C', texte: "L'émulateur PDC" },
      { id: 'D', texte: 'Le maître RID' },
    ],
    bonneReponse: 'C',
    explication:
      "L'émulateur PDC (un par domaine) est la référence de temps du domaine, reçoit en urgence les changements de mot de passe et centralise les verrouillages de comptes. C'est le rôle dont l'indisponibilité se remarque le plus vite. Les cinq rôles FSMO sont : schéma et attribution des noms (forêt), RID, PDC et infrastructure (domaine).",
    pourquoiPas: {
      A: "Le maître de schéma (un par forêt) est le seul à pouvoir modifier le schéma de l'annuaire.",
      B: "Le maître d'attribution des noms de domaine gère l'ajout et la suppression de domaines dans la forêt.",
      D: "Le maître RID distribue aux contrôleurs des blocs d'identifiants relatifs pour créer de nouveaux objets.",
    },
    aRetenir: "Émulateur PDC = heure du domaine, mots de passe et verrouillages : à placer sur un contrôleur fiable.",
  },
  {
    id: 'SYS-AD-008',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Windows Server & Active Directory',
    difficulte: 'difficile',
    enonce:
      "25 analystes crédit doivent lire le partage `\\\\srv-fic01\\Credit`. Selon la bonne pratique AGDLP, comment organiser les droits ?",
    options: [
      { id: 'A', texte: 'Ajouter chacun des 25 comptes directement dans les autorisations du dossier' },
      { id: 'B', texte: 'Comptes dans un groupe domaine local, ce groupe dans un groupe global, permission donnée au groupe global' },
      { id: 'C', texte: 'Comptes dans un groupe global, lui-même membre d’un groupe domaine local qui reçoit la permission' },
      { id: 'D', texte: 'Ajouter les 25 analystes au groupe Administrateurs du serveur de fichiers' },
    ],
    bonneReponse: 'C',
    explication:
      "AGDLP : les comptes (Accounts) vont dans des groupes Globaux qui représentent un métier, ces groupes vont dans des groupes Domaine Local qui représentent un accès à une ressource, et seule la Permission est donnée au groupe domaine local. Un nouvel analyste n'a qu'à rejoindre le groupe global, sans toucher aux ACL du serveur.",
    pourquoiPas: {
      A: "Des droits nominatifs deviennent ingérables et impossibles à auditer dès que les équipes changent.",
      B: "C'est l'ordre inverse : le groupe global regroupe les personnes, le groupe domaine local porte la permission.",
      D: "Donner l'administration du serveur pour un simple accès en lecture viole le principe du moindre privilège.",
    },
    aRetenir: "AGDLP : comptes → groupe Global (métier) → groupe Domaine Local (ressource) → Permission.",
  },

  // ───────────────────────── Virtualisation & cloud ─────────────────────────
  {
    id: 'SYS-VIR-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'facile',
    enonce: "Qu'est-ce qui caractérise un hyperviseur de type 1 ?",
    options: [
      { id: 'A', texte: "Il s'installe comme une application sur un Windows ou un Linux déjà en place" },
      { id: 'B', texte: "Il s'exécute directement sur le matériel, sans OS hôte" },
      { id: 'C', texte: 'Il ne sait faire tourner que des conteneurs, pas des machines virtuelles' },
      { id: 'D', texte: 'Il émule toujours entièrement un processeur différent de celui du serveur' },
    ],
    bonneReponse: 'B',
    explication:
      "Un hyperviseur de type 1 (« bare metal »), comme VMware ESXi ou Microsoft Hyper-V, s'installe directement sur le serveur physique. Il offre de meilleures performances et une surface d'attaque plus réduite que le type 2, ce qui en fait le standard des salles serveurs. Le type 2 (VirtualBox, VMware Workstation) tourne sur un poste pour des tests.",
    pourquoiPas: {
      A: "C'est la définition du type 2 (hébergé), réservé aux postes de travail et aux maquettes.",
      C: "Les hyperviseurs exécutent des machines virtuelles complètes ; les conteneurs reposent sur un moteur de conteneurs et le noyau de l'hôte.",
      D: "Les hyperviseurs modernes exploitent les extensions de virtualisation du processeur (Intel VT-x, AMD-V) au lieu d'émuler un autre jeu d'instructions.",
    },
    aRetenir: "Type 1 = directement sur le matériel (production) ; type 2 = application sur un OS hôte (tests).",
  },
  {
    id: 'SYS-VIR-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'moyen',
    enonce:
      "L'équipe conserve depuis trois mois un snapshot de la VM du serveur de fichiers « au cas où », en guise de sauvegarde. Quel est le problème ?",
    options: [
      { id: 'A', texte: 'Aucun : un snapshot est une copie complète et indépendante de la VM' },
      { id: 'B', texte: 'Un snapshot ne capture que la mémoire vive, pas les disques' },
      { id: 'C', texte: "Il dépend du disque d'origine, sur le même stockage" },
      { id: 'D', texte: "Un snapshot est chiffré et illisible en dehors de l'hyperviseur qui l'a créé" },
    ],
    bonneReponse: 'C',
    explication:
      "Un snapshot fige un état en redirigeant les nouvelles écritures vers un fichier delta : il n'a de sens qu'avec le disque d'origine, sur le même datastore. Si ce stockage tombe, le snapshot disparaît avec lui. Gardé longtemps, le delta grossit, ralentit les E/S et rend la suppression (consolidation) longue et risquée. Un snapshot sert avant une mise à jour et se supprime dans les jours qui suivent.",
    pourquoiPas: {
      A: "Un snapshot n'est pas une copie indépendante : il ne contient que les différences par rapport au disque de base.",
      B: "Un snapshot capture l'état des disques, et en option la mémoire ; c'est sa dépendance au stockage qui pose problème.",
      D: "Le snapshot n'est pas chiffré par nature ; le problème est qu'il n'existe pas en dehors du stockage de la VM.",
    },
    aRetenir: "Un snapshot n'est pas une sauvegarde : il vit sur le même stockage et dépend du disque d'origine.",
  },
  {
    id: 'SYS-VIR-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'moyen',
    enonce: 'Quelle est la différence fondamentale entre un conteneur (Docker, par exemple) et une machine virtuelle ?',
    options: [
      { id: 'A', texte: 'Chaque conteneur embarque son propre noyau, alors que les VM partagent celui de l’hyperviseur' },
      { id: 'B', texte: "Les conteneurs partagent le noyau de l'hôte ; chaque VM a son propre système" },
      { id: 'C', texte: 'Une VM démarre en général plus vite qu’un conteneur et consomme moins de mémoire' },
      { id: 'D', texte: 'Les conteneurs isolent plus fortement que les VM, ce qui les rend préférables pour séparer des clients' },
    ],
    bonneReponse: 'B',
    explication:
      "Un conteneur est un ensemble de processus isolés (espaces de noms, cgroups) qui partagent le noyau de l'hôte : il démarre en quelques secondes et reste léger. Une VM embarque son propre système d'exploitation et son noyau, ce qui coûte plus de ressources mais offre une frontière d'isolation plus forte.",
    pourquoiPas: {
      A: "C'est l'inverse : la VM a son propre noyau, le conteneur utilise celui de l'hôte.",
      C: "Démarrer un système complet prend plus de temps et de mémoire que lancer quelques processus isolés.",
      D: "Le partage du noyau rend l'isolation des conteneurs plus faible : une faille du noyau touche tous les conteneurs de l'hôte.",
    },
    aRetenir: "Conteneur = processus isolés sur le noyau de l'hôte ; VM = système complet avec son propre noyau.",
  },
  {
    id: 'SYS-VIR-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'facile',
    enonce:
      "Une banque loue des machines virtuelles en mode IaaS chez un fournisseur cloud. Qui doit appliquer les correctifs de sécurité du système d'exploitation de ces VM ?",
    options: [
      { id: 'A', texte: 'La banque, cliente du service' },
      { id: 'B', texte: 'Le fournisseur cloud, automatiquement' },
      { id: 'C', texte: 'Personne : les VM cloud sont protégées par défaut' },
      { id: 'D', texte: "L'éditeur du système, à distance et sans intervention" },
    ],
    bonneReponse: 'A',
    explication:
      "Dans le modèle de responsabilité partagée, le fournisseur IaaS gère le matériel, le réseau physique et la virtualisation ; le client gère tout ce qui est au-dessus : système invité, correctifs, comptes, pare-feu, applications et données. En PaaS, le fournisseur prend aussi en charge le système ; en SaaS, presque tout sauf les données et les accès.",
    pourquoiPas: {
      B: "Le fournisseur ne touche pas au système invité en IaaS : c'est précisément ce qui distingue l'IaaS du PaaS.",
      C: "Une VM cloud non corrigée et exposée est aussi vulnérable qu'un serveur dans la salle informatique.",
      D: "L'éditeur publie les correctifs mais ne les installe pas : c'est à l'exploitant de les déployer.",
    },
    aRetenir: "IaaS : le client gère l'OS et au-dessus ; PaaS : la plateforme est gérée ; SaaS : on ne gère que données et accès.",
  },
  {
    id: 'SYS-VIR-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'moyen',
    enonce:
      "Un cluster de virtualisation avec stockage partagé a la haute disponibilité (HA) activée. Un hôte tombe brutalement en panne. Que se passe-t-il pour les VM qu'il hébergeait ?",
    options: [
      { id: 'A', texte: "Elles continuent de tourner sans la moindre interruption grâce à la migration à chaud" },
      { id: 'B', texte: 'Elles sont définitivement perdues et doivent être restaurées depuis les sauvegardes' },
      { id: 'C', texte: "Elles restent arrêtées jusqu'à la réparation de l'hôte d'origine" },
      { id: 'D', texte: 'Elles sont redémarrées automatiquement sur les autres hôtes, après une courte coupure' },
    ],
    bonneReponse: 'D',
    explication:
      "La HA détecte la perte de l'hôte et relance ses VM sur les hôtes survivants, à partir de leurs disques sur le stockage partagé. Il y a donc une interruption, le temps du redémarrage, comme après une coupure de courant. La migration à chaud (vMotion, Live Migration) sert aux opérations planifiées, quand l'hôte d'origine fonctionne encore.",
    pourquoiPas: {
      A: "La migration à chaud exige que l'hôte source soit vivant pour transférer la mémoire : impossible après une panne brutale.",
      B: "Les disques des VM sont sur le stockage partagé : ils survivent à la panne de l'hôte et la HA les redémarre ailleurs.",
      C: "C'est justement ce qu'évite la HA, en redémarrant les VM sur un autre hôte.",
    },
    aRetenir: "HA = redémarrage automatique ailleurs (courte coupure) ; migration à chaud = déplacement planifié sans coupure.",
  },
  {
    id: 'SYS-VIR-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'moyen',
    enonce:
      "Un portail est hébergé sur deux VM cloud derrière un répartiteur de charge, toutes deux dans la même zone de disponibilité. Quelle mesure protège le service contre la panne d'un centre de données entier ?",
    options: [
      { id: 'A', texte: 'Doubler le nombre de vCPU et la mémoire de chacune des deux VM existantes' },
      { id: 'B', texte: 'Ajouter une troisième VM dans la même zone de disponibilité' },
      { id: 'C', texte: 'Répartir les VM sur au moins deux zones de disponibilité de la région' },
      { id: 'D', texte: 'Programmer un snapshot de chaque VM toutes les heures' },
    ],
    bonneReponse: 'C',
    explication:
      "Une zone de disponibilité correspond à un ou plusieurs centres de données isolés (alimentation, refroidissement, réseau). Deux VM dans la même zone tombent ensemble si la zone tombe. En les plaçant dans des zones différentes derrière le répartiteur, la perte d'une zone laisse le service actif.",
    pourquoiPas: {
      A: "Des VM plus puissantes résistent mieux à la charge, pas à la perte du site qui les héberge.",
      B: "Une troisième VM dans la même zone partage le même point de défaillance.",
      D: "Des snapshots aident à revenir en arrière, pas à rester en ligne pendant la panne d'une zone.",
    },
    aRetenir: "La redondance ne protège que si les copies ne partagent pas le même point de défaillance.",
  },
  {
    id: 'SYS-VIR-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Virtualisation & cloud',
    difficulte: 'difficile',
    enonce:
      "Un cluster compte 4 hôtes identiques de 256 Go de RAM. Toutes les VM doivent pouvoir continuer de tourner si un hôte tombe, sans surallocation de mémoire. En ignorant la mémoire propre à l'hyperviseur, quelle quantité maximale de RAM peut-on allouer aux VM ?",
    options: [
      { id: 'A', texte: '1 024 Go' },
      { id: 'B', texte: '512 Go' },
      { id: 'C', texte: '256 Go' },
      { id: 'D', texte: '768 Go' },
    ],
    bonneReponse: 'D',
    explication:
      "Pour tolérer la perte d'un hôte (règle N+1), les VM doivent tenir sur les 3 hôtes restants : 3 × 256 = 768 Go. Au-delà, une panne laisserait des VM sans mémoire pour redémarrer. Dans la pratique, on garde encore une marge pour l'hyperviseur et les pics.",
    pourquoiPas: {
      A: "1 024 Go est la capacité totale des 4 hôtes : si l'un d'eux tombe, 256 Go de VM n'ont plus de place.",
      B: "512 Go correspondent à la tolérance de DEUX pannes (N+2), plus prudent que l'exigence posée.",
      C: "256 Go est la mémoire d'un seul hôte : cela gaspillerait les trois quarts du cluster.",
    },
    aRetenir: "Capacité utilisable en N+1 = capacité totale moins celle du plus gros hôte.",
  },

  // ───────────────────────── Stockage & sauvegarde ─────────────────────────
  {
    id: 'SYS-STO-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'moyen',
    enonce: 'Un serveur de fichiers reçoit 6 disques de 4 To montés en RAID 5. Quelle est la capacité utile ?',
    options: [
      { id: 'A', texte: '24 To' },
      { id: 'B', texte: '20 To' },
      { id: 'C', texte: '16 To' },
      { id: 'D', texte: '12 To' },
    ],
    bonneReponse: 'B',
    explication:
      "En RAID 5, l'équivalent d'un disque est consacré à la parité, répartie sur tous les disques : capacité utile = (n − 1) × taille = (6 − 1) × 4 = 20 To. La grappe supporte la perte d'un seul disque.",
    pourquoiPas: {
      A: "24 To est la capacité brute (RAID 0), sans aucune redondance.",
      C: "16 To correspondrait au RAID 6, qui consacre l'équivalent de DEUX disques à la parité : (6 − 2) × 4.",
      D: "12 To correspondrait au RAID 10 (ou RAID 1), qui duplique chaque donnée : 6 × 4 / 2.",
    },
    aRetenir: "Capacité utile : RAID 5 = (n − 1) disques, RAID 6 = (n − 2), RAID 10 = n / 2.",
  },
  {
    id: 'SYS-STO-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'facile',
    enonce: 'Que recommande la règle de sauvegarde « 3-2-1 » ?',
    options: [
      { id: 'A', texte: 'Trois sauvegardes par jour, conservées deux jours, et un test de restauration par an' },
      { id: 'B', texte: 'Trois serveurs, deux salles informatiques et un hébergement dans le cloud' },
      { id: 'C', texte: 'Trois disques en RAID, deux contrôleurs et un onduleur' },
      { id: 'D', texte: 'Trois copies des données, sur deux supports différents, dont une hors site' },
    ],
    bonneReponse: 'D',
    explication:
      "La règle 3-2-1 : les données de production plus deux copies, sur au moins deux types de support (disque, bande, stockage objet…), dont une copie hors du site principal. Face aux rançongiciels, on y ajoute souvent une copie hors ligne ou immuable, et des restaurations testées régulièrement.",
    pourquoiPas: {
      A: "Ce n'est pas une règle de fréquence ou de rétention, et un test par an est très insuffisant.",
      B: "Il s'agit d'une architecture d'hébergement, pas d'une stratégie de copies de données.",
      C: "Le RAID protège contre la panne d'un disque, pas contre une suppression, une corruption ou un sinistre : ce n'est pas une sauvegarde.",
    },
    aRetenir: "3-2-1 : 3 copies, 2 supports différents, 1 copie hors site (et idéalement une copie hors ligne).",
  },
  {
    id: 'SYS-STO-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'facile',
    enonce: 'Quelle est la différence principale entre un SAN et un NAS ?',
    options: [
      { id: 'A', texte: 'Le NAS fournit des volumes en mode bloc, le SAN partage des fichiers' },
      { id: 'B', texte: 'Le SAN sert uniquement aux sauvegardes sur bande, le NAS uniquement aux bases de données' },
      { id: 'C', texte: 'Le SAN fournit des blocs (FC, iSCSI), le NAS partage des fichiers (NFS, SMB)' },
      { id: 'D', texte: 'Aucune : ce sont deux noms commerciaux pour le même équipement' },
    ],
    bonneReponse: 'C',
    explication:
      "Un SAN présente aux serveurs des volumes (LUN) qu'ils voient comme des disques locaux et formatent eux-mêmes : c'est le choix courant pour les bases de données et les hyperviseurs. Un NAS gère son propre système de fichiers et partage des dossiers sur le réseau via NFS ou SMB.",
    pourquoiPas: {
      A: "Les rôles sont inversés : le bloc est le propre du SAN, le partage de fichiers celui du NAS.",
      B: "Les deux peuvent servir à de nombreux usages ; la différence est le mode d'accès (bloc ou fichier).",
      D: "Ce sont deux modèles d'accès distincts, même si certaines baies savent faire les deux.",
    },
    aRetenir: "SAN = blocs (le serveur formate) ; NAS = fichiers partagés (l'équipement gère le système de fichiers).",
  },
  {
    id: 'SYS-STO-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'moyen',
    enonce:
      "Pour le serveur de la base de données transactionnelle (nombreuses écritures aléatoires), on veut de bonnes performances en écriture ET une tolérance aux pannes de disque. Quel choix est le plus adapté ?",
    options: [
      { id: 'A', texte: 'RAID 10' },
      { id: 'B', texte: 'RAID 0' },
      { id: 'C', texte: 'RAID 5' },
      { id: 'D', texte: 'Un disque unique de grande capacité, sauvegardé chaque nuit' },
    ],
    bonneReponse: 'A',
    explication:
      "Le RAID 10 agrège des miroirs en bandes : chaque écriture coûte deux E/S, sans calcul de parité, et la grappe survit à la perte d'un disque par miroir. Il sacrifie la moitié de la capacité brute, prix généralement accepté pour une base critique.",
    pourquoiPas: {
      B: "Le RAID 0 est rapide mais sans redondance : la perte d'un seul disque détruit toute la grappe.",
      C: "Le RAID 5 pénalise les petites écritures aléatoires (lecture et réécriture de la parité, environ 4 E/S par écriture) et sa reconstruction est longue.",
      D: "Un disque unique est un point de défaillance : sa panne arrête la base et fait perdre les écritures depuis la dernière sauvegarde.",
    },
    aRetenir: "Écritures intensives + tolérance de panne : RAID 10 ; le RAID 5 convient mieux aux charges surtout en lecture.",
  },
  {
    id: 'SYS-STO-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'moyen',
    enonce:
      "La base des prêts de la Banque Alpha est sauvegardée chaque soir à 22 h. Le serveur est détruit le jeudi à 16 h ; la restauration se termine à 20 h. Quelle analyse est juste ?",
    options: [
      { id: 'A', texte: "4 heures de données perdues, ce que mesure le RTO" },
      { id: 'B', texte: "18 h de données perdues au plus (RPO) ; 4 h d'arrêt (RTO)" },
      { id: 'C', texte: 'Aucune donnée perdue, puisque la restauration s’est terminée avec succès à 20 h' },
      { id: 'D', texte: '22 heures de données perdues, ce que mesure le RTO' },
    ],
    bonneReponse: 'B',
    explication:
      "Le RPO (Recovery Point Objective) est la perte de données maximale admissible : ici, tout ce qui a été saisi entre mercredi 22 h et jeudi 16 h, soit 18 heures. Le RTO (Recovery Time Objective) est la durée d'interruption admissible : 16 h → 20 h, soit 4 heures. Pour réduire le RPO, il faut des sauvegardes plus fréquentes (journaux de transactions, réplication).",
    pourquoiPas: {
      A: "4 heures est la durée de remise en service, donc le RTO, pas la quantité de données perdues.",
      C: "La restauration ramène l'état de mercredi 22 h : les opérations de la journée de jeudi sont perdues.",
      D: "Il n'y a que 18 heures entre mercredi 22 h et jeudi 16 h, et une perte de données relève du RPO, pas du RTO.",
    },
    aRetenir: "RPO = combien de données on accepte de perdre ; RTO = combien de temps on accepte d'être arrêté.",
  },
  {
    id: 'SYS-STO-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'moyen',
    enonce:
      "Le volume logique qui porte le système de fichiers XFS `/archives` vient d'être agrandi de 50 Gio, mais `df` affiche toujours l'ancienne taille. Que faut-il faire ?",
    extrait: {
      langage: 'shell',
      contenu: `$ sudo lvextend -L +50G /dev/vg_data/lv_archives
  Size of logical volume vg_data/lv_archives changed from 100.00 GiB (25600 extents) to 150.00 GiB (38400 extents).
  Logical volume vg_data/lv_archives successfully resized.
$ df -h /archives
Sys. de fichiers                 Taille Utilisé Dispo Uti% Monté sur
/dev/mapper/vg_data-lv_archives    100G     92G  8,1G  92% /archives`,
    },
    options: [
      { id: 'A', texte: 'Redémarrer le serveur pour que la nouvelle taille soit prise en compte' },
      { id: 'B', texte: 'Reformater le volume avec `mkfs.xfs` pour occuper tout l’espace' },
      { id: 'C', texte: 'Lancer `vgextend` pour agrandir le groupe de volumes' },
      { id: 'D', texte: 'Agrandir le système de fichiers avec `xfs_growfs /archives`' },
    ],
    bonneReponse: 'D',
    explication:
      "LVM a bien agrandi le volume logique, mais le système de fichiers qu'il contient garde sa taille tant qu'on ne l'étend pas : `xfs_growfs` pour XFS (à chaud, sur le point de montage), `resize2fs` pour ext4. L'option `lvextend -r` enchaîne les deux opérations. À noter : XFS peut grandir mais pas rétrécir.",
    pourquoiPas: {
      A: "Un redémarrage n'agrandit pas le système de fichiers : sa taille est inscrite dans ses propres structures.",
      B: "`mkfs` crée un système de fichiers vide : les 92 Go d'archives seraient perdus.",
      C: "Le groupe de volumes avait déjà l'espace libre, puisque `lvextend` a réussi ; `vgextend` sert à y ajouter un disque physique.",
    },
    aRetenir: "Agrandir sous LVM = étendre le volume logique PUIS le système de fichiers (ou `lvextend -r`).",
  },
  {
    id: 'SYS-STO-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'difficile',
    enonce:
      "Un serveur est sauvegardé en complet le dimanche à 23 h, puis en incrémental chaque soir à 23 h du lundi au samedi. Il tombe en panne le jeudi à 15 h. Que faut-il restaurer pour revenir au dernier état sauvegardé ?",
    options: [
      { id: 'A', texte: "Uniquement l'incrémentale de mercredi, la plus récente" },
      { id: 'B', texte: "La complète de dimanche, puis seulement l'incrémentale de mercredi, qui contient tout depuis dimanche" },
      { id: 'C', texte: 'Les incrémentales de lundi, mardi et mercredi, sans la complète' },
      { id: 'D', texte: 'La complète de dimanche, puis les incrémentales de lundi, mardi et mercredi, dans cet ordre' },
    ],
    bonneReponse: 'D',
    explication:
      "Chaque incrémentale ne contient que ce qui a changé depuis la sauvegarde PRÉCÉDENTE, quelle qu'elle soit. Il faut donc la complète puis toute la chaîne d'incrémentales (lundi, mardi, mercredi soir), dans l'ordre ; celle de jeudi soir n'a pas encore eu lieu. Avec des différentielles (changements depuis la dernière complète), la complète et la différentielle de mercredi auraient suffi.",
    pourquoiPas: {
      A: "L'incrémentale de mercredi ne contient que les changements de mercredi : sans la base et les autres jours, la restauration est incomplète.",
      B: "Ce schéma correspond à une sauvegarde différentielle ; ici, il manquerait les changements de lundi et mardi.",
      C: "Sans la sauvegarde complète, il n'y a pas de base sur laquelle appliquer les modifications.",
    },
    aRetenir: "Incrémentale : complète + toute la chaîne ; différentielle : complète + la dernière différentielle.",
  },
  {
    id: 'SYS-STO-008',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Stockage & sauvegarde',
    difficulte: 'difficile',
    enonce:
      "Avec 8 disques de 4 To, on hésite entre RAID 6 et RAID 10. Quelle comparaison est exacte ?",
    options: [
      { id: 'A', texte: 'RAID 6 : 16 To utiles, 2 pannes tolérées ; RAID 10 : 24 To utiles, 4 pannes quelconques tolérées' },
      { id: 'B', texte: 'RAID 6 : 28 To utiles, 1 panne tolérée ; RAID 10 : 16 To utiles, 2 pannes quelconques tolérées' },
      { id: 'C', texte: 'RAID 6 : 24 To utiles, 2 pannes quelconques tolérées ; RAID 10 : 16 To utiles, 1 panne garantie' },
      { id: 'D', texte: 'Les deux offrent 24 To utiles et tolèrent 2 pannes quelconques' },
    ],
    bonneReponse: 'C',
    explication:
      "RAID 6 : double parité, (8 − 2) × 4 = 24 To, et n'importe quels 2 disques peuvent tomber. RAID 10 : 4 miroirs de 2 disques, 8 × 4 / 2 = 16 To ; il survit à une panne dans chaque miroir, mais deux pannes dans le MÊME miroir détruisent la grappe : seule une panne est garantie. En contrepartie, le RAID 10 écrit plus vite et se reconstruit plus rapidement.",
    pourquoiPas: {
      A: "Les capacités sont inversées et le RAID 10 ne tolère pas 4 pannes quelconques : seulement si elles touchent 4 miroirs différents.",
      B: "28 To serait du RAID 5 (n − 1) avec 1 panne tolérée ; le RAID 6 réserve deux disques de parité.",
      D: "Le RAID 10 perd la moitié de la capacité brute (16 To), et deux pannes dans un même miroir lui sont fatales.",
    },
    aRetenir: "RAID 6 = n − 2 disques utiles et 2 pannes quelconques ; RAID 10 = n / 2 et 1 panne garantie.",
  },

  // ───────────────────────── Scripts & automatisation ─────────────────────────
  {
    id: 'SYS-SCR-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'facile',
    enonce: 'Dans un script bash, que contient la variable `$?` juste après l’exécution d’une commande ?',
    options: [
      { id: 'A', texte: 'Le PID du dernier processus lancé en arrière-plan par le script' },
      { id: 'B', texte: 'Le code de retour de cette commande (0 = succès)' },
      { id: 'C', texte: 'Le nombre d’arguments passés au script' },
      { id: 'D', texte: 'Le nom du script en cours d’exécution' },
    ],
    bonneReponse: 'B',
    explication:
      "`$?` vaut le code de sortie de la dernière commande : 0 signifie succès, toute autre valeur (1 à 255) signale une erreur. Un script de production doit le tester (`if ! commande; then …`) ou utiliser `set -e` pour s'arrêter à la première erreur, au lieu de continuer comme si de rien n'était.",
    pourquoiPas: {
      A: "Le PID du dernier processus lancé en arrière-plan est dans `$!`.",
      C: "Le nombre d'arguments est dans `$#`.",
      D: "Le nom du script est dans `$0`.",
    },
    aRetenir: "`$?` = code de retour de la dernière commande ; 0 = succès, tout le reste = échec.",
  },
  {
    id: 'SYS-SCR-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'moyen',
    enonce: 'Que fait ce script, planifié toutes les 15 minutes sur `srv-app01` ?',
    extrait: {
      langage: 'shell',
      contenu: `#!/bin/bash
SEUIL=85
USAGE=$(df --output=pcent /data | tail -n 1 | tr -d ' %')
if [ "$USAGE" -ge "$SEUIL" ]; then
  echo "ALERTE : /data utilisé à \${USAGE} %" | mail -s "Disque srv-app01" exploitation@banque-alpha.example
fi`,
    },
    options: [
      { id: 'A', texte: 'Il supprime les fichiers de `/data` dès que le disque dépasse 85 %' },
      { id: 'B', texte: 'Il envoie un e-mail à chaque exécution, quel que soit le taux de remplissage' },
      { id: 'C', texte: 'Il envoie une alerte par e-mail seulement si `/data` est rempli à 85 % ou plus' },
      { id: 'D', texte: 'Il agrandit automatiquement `/data` quand il atteint 85 %' },
    ],
    bonneReponse: 'C',
    explication:
      "`df --output=pcent` affiche le taux d'occupation, `tail` garde la dernière ligne et `tr` retire espaces et signe % pour obtenir un nombre. Le test `-ge` (supérieur ou égal) déclenche l'envoi de l'e-mail uniquement au-delà du seuil. C'est une supervision artisanale : un outil de supervision fait la même chose avec historique et escalade.",
    pourquoiPas: {
      A: "Aucune commande de suppression (`rm`, `find -delete`) n'apparaît dans le script.",
      B: "L'appel à `mail` est à l'intérieur du `if` : il n'est exécuté que si la condition est vraie.",
      D: "Le script ne fait que mesurer et prévenir ; agrandir un volume demanderait des commandes LVM ou de la baie.",
    },
    aRetenir: "Dans un test bash, `-ge`, `-gt`, `-lt`… comparent des entiers ; `=` compare des chaînes.",
  },
  {
    id: 'SYS-SCR-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'moyen',
    enonce: 'Quel est l’effet de cette commande, ajoutée dans une tâche de maintenance ?',
    extrait: {
      langage: 'shell',
      contenu: `find /var/log/appli -name "*.log" -mtime +30 -delete`,
    },
    options: [
      { id: 'A', texte: 'Elle supprime les fichiers `.log` modifiés au cours des 30 derniers jours' },
      { id: 'B', texte: 'Elle compresse les fichiers `.log` de plus de 30 jours' },
      { id: 'C', texte: 'Elle supprime, sous-dossiers compris, les `.log` modifiés il y a plus de 30 jours' },
      { id: 'D', texte: 'Elle supprime le dossier `/var/log/appli` dès qu’il contient plus de 30 fichiers `.log`' },
    ],
    bonneReponse: 'C',
    explication:
      "`find` parcourt récursivement le dossier, `-name` filtre sur le motif, `-mtime +30` garde les fichiers dont la dernière modification remonte à plus de 30 jours, et `-delete` les supprime. Avant de lancer une suppression, on teste la même commande sans `-delete` pour voir la liste ; logrotate reste l'outil standard pour la rotation des journaux.",
    pourquoiPas: {
      A: "`+30` signifie « plus de 30 jours » ; « moins de 30 jours » s'écrirait `-mtime -30`.",
      B: "Rien ne compresse : `-delete` supprime. Compresser demanderait par exemple `-exec gzip {} \\;`.",
      D: "`-mtime` porte sur la date de modification de chaque fichier, pas sur le nombre de fichiers du dossier.",
    },
    aRetenir: "`-mtime +N` = modifié il y a plus de N jours, `-mtime -N` = il y a moins de N jours ; tester sans `-delete` d'abord.",
  },
  {
    id: 'SYS-SCR-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'moyen',
    enonce:
      "Tu relances, sans rien modifier, un playbook Ansible qui vient de configurer deux serveurs web. Comment interpréter ce récapitulatif ?",
    extrait: {
      langage: 'log',
      contenu: `PLAY RECAP *********************************************************************
srv-web01  : ok=12  changed=0  unreachable=0  failed=0  skipped=1  rescued=0  ignored=0
srv-web02  : ok=12  changed=0  unreachable=0  failed=0  skipped=1  rescued=0  ignored=0`,
    },
    options: [
      { id: 'A', texte: "Le playbook ne s'est pas exécuté, faute de connexion SSH aux deux serveurs" },
      { id: 'B', texte: "Les serveurs sont déjà conformes : rien n'avait à changer (idempotence)" },
      { id: 'C', texte: 'Les tâches ont échoué sans le signaler, puisque rien n’a changé' },
      { id: 'D', texte: 'Ansible a annulé les modifications faites lors du premier passage' },
    ],
    bonneReponse: 'B',
    explication:
      "Les modules Ansible décrivent un état souhaité (paquet installé, fichier présent, service démarré) et n'agissent que si l'état réel diffère : c'est l'idempotence. Un second passage avec `changed=0` prouve que la configuration est conforme. Un `changed` qui revient à chaque exécution signale souvent une tâche mal écrite (commande `shell` sans condition, par exemple).",
    pourquoiPas: {
      A: "`unreachable=0` et `ok=12` montrent que les serveurs ont été joints et les tâches évaluées.",
      C: "Un échec apparaîtrait dans `failed` ; ici `failed=0`.",
      D: "Ansible n'annule jamais un passage précédent : il applique l'état décrit, qui est déjà atteint.",
    },
    aRetenir: "Idempotence : relancer un playbook sur un système conforme ne change rien (`changed=0`).",
  },
  {
    id: 'SYS-SCR-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'moyen',
    enonce:
      "Le script `/opt/scripts/export.sh` fonctionne parfaitement lancé à la main, mais échoue dans la crontab avec « command not found » sur un outil installé dans `/usr/local/bin`. Quelle est la cause la plus probable ?",
    options: [
      { id: 'A', texte: 'cron ne sait pas exécuter de scripts bash, seulement des binaires' },
      { id: 'B', texte: 'Le script doit avoir les droits 777 pour être lancé par cron' },
      { id: 'C', texte: 'cron exécute toujours les tâches sous root, qui ne voit pas `/usr/local/bin`' },
      { id: 'D', texte: 'cron lance les tâches avec un environnement minimal (PATH réduit, profil non chargé)' },
    ],
    bonneReponse: 'D',
    explication:
      "cron ne charge pas le `.bashrc` ni le profil de l'utilisateur et fournit un PATH réduit (souvent `/usr/bin:/bin`). Il faut utiliser des chemins absolus dans le script, ou définir `PATH=` en tête du script ou de la crontab. On redirige aussi la sortie vers un journal pour diagnostiquer ces échecs silencieux.",
    pourquoiPas: {
      A: "cron exécute n'importe quelle commande, y compris un script doté d'un shebang et du droit d'exécution.",
      B: "Le droit d'exécution pour le propriétaire suffit ; 777 serait une faille (tout le monde pourrait modifier le script).",
      C: "Chaque utilisateur a sa propre crontab, et `/usr/local/bin` est lisible par tous : le problème vient du PATH.",
    },
    aRetenir: "En cron, environnement minimal : chemins absolus ou PATH défini explicitement.",
  },
  {
    id: 'SYS-SCR-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'difficile',
    enonce:
      'Quelle ligne envoie à la fois la sortie standard ET les messages d’erreur de `./sauvegarde.sh` dans le fichier `/var/log/sauvegarde.log` ?',
    options: [
      { id: 'A', texte: '`./sauvegarde.sh 2>&1 > /var/log/sauvegarde.log`' },
      { id: 'B', texte: '`./sauvegarde.sh > /var/log/sauvegarde.log`' },
      { id: 'C', texte: '`./sauvegarde.sh > /var/log/sauvegarde.log 2>&1`' },
      { id: 'D', texte: '`./sauvegarde.sh 2> /var/log/sauvegarde.log`' },
    ],
    bonneReponse: 'C',
    explication:
      "Les redirections sont évaluées de gauche à droite. `> fichier` dirige d'abord la sortie standard (descripteur 1) vers le fichier, puis `2>&1` fait pointer les erreurs (descripteur 2) au même endroit que 1, c'est-à-dire le fichier. En bash, `&> fichier` est un raccourci équivalent.",
    pourquoiPas: {
      A: "Ici `2>&1` copie la destination de 1 AVANT sa redirection : les erreurs vont au terminal et seule la sortie standard va dans le fichier.",
      B: "Seule la sortie standard est redirigée : les erreurs, justement les plus utiles, restent à l'écran.",
      D: "Seules les erreurs sont redirigées ; la sortie normale reste affichée au terminal.",
    },
    aRetenir: "`> fichier 2>&1` (dans cet ordre) capture tout ; l'ordre inverse laisse les erreurs au terminal.",
  },
  {
    id: 'SYS-SCR-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Scripts & automatisation',
    difficulte: 'difficile',
    enonce: 'Quel est le principal danger de ce script de purge, et comment le corriger ?',
    extrait: {
      langage: 'shell',
      contenu: `#!/bin/bash
# purge.sh : vide le répertoire temporaire passé en argument
CIBLE=$1
rm -rf "$CIBLE"/*`,
    },
    options: [
      { id: 'A', texte: 'Aucun danger : les guillemets autour de `$CIBLE` protègent la commande' },
      { id: 'B', texte: 'Sans argument, elle devient `rm -rf /*` : refuser une valeur vide avec `${1:?}`' },
      { id: 'C', texte: 'Le seul défaut est que `*` ignore les fichiers cachés : il suffit d’activer `shopt -s dotglob`' },
      { id: 'D', texte: '`rm -rf` ne peut pas supprimer de sous-répertoires : il faut utiliser `rmdir`' },
    ],
    bonneReponse: 'B',
    explication:
      "Si `$1` est vide, `\"$CIBLE\"/*` devient `/*` et le script efface le contenu de la racine ; la protection `--preserve-root` de `rm` ne couvre que `/` lui-même, pas `/*`. `${1:?message}` arrête le script avec une erreur si l'argument est absent ou vide. On ajoute utilement `set -euo pipefail` et une vérification que la cible est bien sous un chemin autorisé.",
    pourquoiPas: {
      A: "Les guillemets évitent le découpage des noms avec espaces, mais ne protègent pas contre une variable vide.",
      C: "Les fichiers cachés oubliés sont un défaut mineur comparé à l'effacement possible de tout le serveur.",
      D: "`rm -r` supprime récursivement les sous-répertoires ; `rmdir` ne supprime que des dossiers vides.",
    },
    aRetenir: "Avant un `rm -rf` sur une variable, refuse la valeur vide : `${VAR:?message}`.",
  },

  // ───────────────────────── Supervision & performances ─────────────────────────
  {
    id: 'SYS-MON-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'moyen',
    enonce: 'Comment interpréter ces mesures relevées sur le serveur d’applications ?',
    extrait: {
      langage: 'shell',
      contenu: `$ nproc
4
$ uptime
 10:42:17 up 41 days,  3:07,  2 users,  load average: 7.85, 6.90, 5.12`,
    },
    options: [
      { id: 'A', texte: 'Le processeur est utilisé à 7,85 % : la charge est faible' },
      { id: 'B', texte: 'La charge diminue : elle était plus forte il y a 15 minutes qu’il y a 1 minute' },
      { id: 'C', texte: 'Environ 2 tâches actives ou en attente par cœur, et en hausse' },
      { id: 'D', texte: 'Le serveur compte environ 8 processus zombies' },
    ],
    bonneReponse: 'C',
    explication:
      "La load average est le nombre moyen de tâches en cours d'exécution ou en attente, sur 1, 5 et 15 minutes. Rapportée aux 4 cœurs, 7,85 représente environ deux fois la capacité, et la série 7,85 > 6,90 > 5,12 montre une hausse. Sous Linux, elle compte aussi les tâches bloquées sur les E/S : on vérifie avec `top` ou `vmstat` si c'est le CPU ou le disque qui sature.",
    pourquoiPas: {
      A: "La load average n'est pas un pourcentage : c'est un nombre moyen de tâches, à comparer au nombre de cœurs.",
      B: "Les valeurs se lisent 1 min, 5 min, 15 min : la plus récente (7,85) est la plus élevée, la charge monte.",
      D: "Les zombies ne comptent pas dans la charge ; ils se repèrent avec `ps` (état Z).",
    },
    aRetenir: "Load average = tâches actives ou en attente sur 1/5/15 min, à comparer au nombre de cœurs.",
  },
  {
    id: 'SYS-MON-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'moyen',
    enonce: 'Un collègue s’alarme : « il ne reste que 0,5 Gio de mémoire libre ! ». Que réponds-tu ?',
    extrait: {
      langage: 'shell',
      contenu: `$ free -h
               total        used        free      shared  buff/cache   available
Mem:            31Gi        9,6Gi       0,5Gi       0,3Gi        21Gi        21Gi
Swap:          4,0Gi          0B       4,0Gi`,
    },
    options: [
      { id: 'A', texte: 'Rien d’alarmant : le cache disque est récupérable, ~21 Gio restent disponibles' },
      { id: 'B', texte: 'Il faut ajouter de la RAM en urgence avant que le serveur ne plante' },
      { id: 'C', texte: 'Il faut vider le cache toutes les heures via cron (`drop_caches`) pour libérer la mémoire' },
      { id: 'D', texte: 'Il faut augmenter la taille du swap pour compenser le manque de mémoire' },
    ],
    bonneReponse: 'A',
    explication:
      "Le noyau occupe la mémoire inutilisée avec le cache des fichiers (buff/cache), qu'il libère dès qu'une application en a besoin. L'indicateur pertinent est la colonne `available`, ici 21 Gio, et un swap à 0 confirme l'absence de pression mémoire. Une alerte se fonde sur `available` et sur l'activité du swap, pas sur `free`.",
    pourquoiPas: {
      B: "Avec 21 Gio disponibles et aucun swap utilisé, rien ne justifie un achat de mémoire.",
      C: "Vider le cache dégrade les performances (les lectures repartent sur disque) sans aucun bénéfice réel.",
      D: "Le swap n'est pas sollicité : l'agrandir ne change rien, la mémoire n'est pas saturée.",
    },
    aRetenir: "Sous Linux, regarde `available` (et l'activité du swap), pas `free` : le cache est récupérable.",
  },
  {
    id: 'SYS-MON-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'facile',
    enonce:
      "Quel protocole standard permet à un outil de supervision d'interroger routeurs, commutateurs et serveurs (charge, trafic des interfaces…) et de recevoir leurs alertes spontanées (traps) ?",
    options: [
      { id: 'A', texte: 'SNMP' },
      { id: 'B', texte: 'SMTP' },
      { id: 'C', texte: 'SFTP' },
      { id: 'D', texte: 'NTP' },
    ],
    bonneReponse: 'A',
    explication:
      "SNMP (Simple Network Management Protocol) permet de lire des compteurs exposés par les équipements (port UDP 161) et de recevoir des traps (port UDP 162). Les versions 1 et 2c reposent sur une simple « communauté » transmise en clair : en production, on privilégie SNMPv3, qui apporte authentification et chiffrement.",
    pourquoiPas: {
      B: "SMTP transporte les e-mails ; il peut servir à envoyer les notifications, pas à interroger les équipements.",
      C: "SFTP sert au transfert de fichiers sécurisé sur SSH.",
      D: "NTP synchronise les horloges, ce qui est utile pour corréler les événements mais ne collecte aucune métrique.",
    },
    aRetenir: "SNMP : interrogation (UDP 161) et traps (UDP 162) ; préférer SNMPv3, authentifié et chiffré.",
  },
  {
    id: 'SYS-MON-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'facile',
    enonce: 'Quelle configuration d’alerte est la plus pertinente pour la partition `/var` d’un serveur de production ?',
    options: [
      { id: 'A', texte: 'Une seule alerte, déclenchée quand la partition atteint 100 %' },
      { id: 'B', texte: 'Une alerte à chaque variation de 1 % du taux de remplissage, envoyée à toute la direction' },
      { id: 'C', texte: 'Aucune alerte automatique, mais une vérification manuelle chaque fin de mois' },
      { id: 'D', texte: 'Avertissement vers 80 %, critique vers 90 %, notifiés à l’astreinte' },
    ],
    bonneReponse: 'D',
    explication:
      "Deux niveaux laissent le temps d'agir : l'avertissement déclenche une analyse planifiée, le critique une intervention rapide. Les seuils s'ajustent à la taille et à la vitesse de remplissage du volume (une alerte de tendance anticipe la saturation). Trop d'alertes inutiles produit l'effet inverse : l'équipe finit par les ignorer.",
    pourquoiPas: {
      A: "À 100 %, l'incident est déjà là : services arrêtés, journaux perdus, base parfois corrompue.",
      B: "Des alertes trop fréquentes et mal ciblées noient les vrais problèmes (fatigue d'alerte).",
      C: "Une partition peut se remplir en quelques heures : un contrôle mensuel arrive bien trop tard.",
    },
    aRetenir: "Une bonne alerte est graduée (avertissement / critique), actionnable et adressée à la bonne équipe.",
  },
  {
    id: 'SYS-MON-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'moyen',
    enonce: 'Les utilisateurs se plaignent de lenteurs. D’après cet extrait de `top`, où se situe le goulot d’étranglement ?',
    extrait: {
      langage: 'shell',
      contenu: `top - 14:05:33 up 12 days,  2:41,  1 user,  load average: 9.12, 8.47, 7.90
%Cpu(s):  4.1 us,  2.0 sy,  0.0 ni,  6.3 id, 87.4 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :  32001.0 total,   1200.5 free,   9800.2 used,  21000.3 buff/cache`,
    },
    options: [
      { id: 'A', texte: 'Le disque : les CPU attendent la fin des entrées/sorties' },
      { id: 'B', texte: 'Le processeur, saturé par les calculs des applications' },
      { id: 'C', texte: 'La mémoire vive, entièrement consommée par les applications' },
      { id: 'D', texte: 'L’hyperviseur, qui prive la VM de temps processeur au profit d’autres VM' },
    ],
    bonneReponse: 'A',
    explication:
      "`wa` (iowait) à 87,4 % indique que les processeurs sont inoccupés en attendant la fin d'opérations d'E/S. La charge élevée vient donc de tâches bloquées sur le disque, pas de calculs. On poursuit avec `iostat -x` (latence, taux d'occupation par disque) et `iotop` pour trouver le processus responsable.",
    pourquoiPas: {
      B: "Le temps utilisateur (`us`) n'est que de 4,1 % et le système (`sy`) de 2,0 % : le CPU ne calcule presque pas.",
      C: "La mémoire n'est pas saturée : plus de 21 Gio sont en cache, donc récupérables.",
      D: "Le vol de temps par l'hyperviseur apparaîtrait dans `st` (steal), ici à 0,0.",
    },
    aRetenir: "`us`/`sy` élevés = CPU saturé ; `wa` élevé = attente disque ; `st` élevé = VM privée de CPU.",
  },
  {
    id: 'SYS-MON-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'difficile',
    enonce: "L'application ne peut plus créer de fichiers dans `/var` alors que `df -h` affiche 40 %. Quelle est l'explication ?",
    extrait: {
      langage: 'shell',
      contenu: `$ touch /var/spool/appli/test.tmp
touch: impossible de faire un touch '/var/spool/appli/test.tmp': Aucun espace disponible sur le périphérique
$ df -h /var
Sys. de fichiers  Taille Utilisé Dispo Uti% Monté sur
/dev/sda3            50G     19G   29G  40% /var
$ df -i /var
Sys. de fichiers   Inodes  IUtil. ILibre IUti% Monté sur
/dev/sda3         3276800 3276800      0  100% /var`,
    },
    options: [
      { id: 'A', texte: 'Le disque est défectueux et doit être remplacé' },
      { id: 'B', texte: 'Le quota disque de l’utilisateur est dépassé' },
      { id: 'C', texte: 'Les inodes sont épuisés par une multitude de petits fichiers' },
      { id: 'D', texte: 'Le système de fichiers a été remonté en lecture seule après une erreur' },
    ],
    bonneReponse: 'C',
    explication:
      "Chaque fichier consomme un inode ; sur ext4, leur nombre est fixé à la création du système de fichiers. Ici, 100 % des inodes sont utilisés alors que l'espace en octets est libre : typiquement des millions de petits fichiers (sessions, files d'attente, fichiers temporaires jamais purgés). On localise le dossier fautif (par exemple avec `du --inodes`) et on purge ou corrige l'application.",
    pourquoiPas: {
      A: "Un disque défectueux produirait des erreurs d'E/S dans `dmesg`, pas une table d'inodes pleine.",
      B: "Un dépassement de quota renvoie « Quota de disque dépassé », et `df -i` montre ici une saturation globale.",
      D: "Un système en lecture seule renvoie « Système de fichiers accessible en lecture seulement », un message différent.",
    },
    aRetenir: "« Plus d'espace » avec `df -h` bas : vérifie `df -i`, les inodes sont peut-être épuisés.",
  },
  {
    id: 'SYS-MON-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Supervision & performances',
    difficulte: 'difficile',
    enonce:
      "Pour libérer `/var/log`, un collègue a supprimé avec `rm` un énorme fichier de trace, mais `df` n'a pas bougé. Que se passe-t-il, et que faire ?",
    extrait: {
      langage: 'shell',
      contenu: `$ df -h /var/log
Sys. de fichiers  Taille Utilisé Dispo Uti% Monté sur
/dev/sdb1            40G     36G  2,0G  95% /var/log
$ du -sh /var/log
6,1G    /var/log
$ sudo lsof +L1 | grep /var/log
java    2314  appli  12w  REG  8,17  32104880537  0  1835021 /var/log/appli/trace.log (deleted)`,
    },
    options: [
      { id: 'A', texte: '`du` se trompe : il faut lancer `fsck` sur la partition en production' },
      { id: 'B', texte: 'Des snapshots LVM masquent l’espace libéré : il faut les supprimer' },
      { id: 'C', texte: 'Il faut supprimer d’autres fichiers de `/var/log` pour compenser' },
      { id: 'D', texte: 'Le fichier supprimé est encore ouvert par java (PID 2314)' },
    ],
    bonneReponse: 'D',
    explication:
      "`rm` retire le nom du fichier, mais les blocs (environ 30 Gio ici) restent alloués tant qu'un processus garde le fichier ouvert : `du` ne le voit plus, `df` si. Il faut redémarrer proprement le service ou lui faire rouvrir ses journaux ; en urgence, on peut vider le fichier via `/proc/2314/fd/12`. À l'avenir, on vide un journal actif (`truncate`) ou on configure logrotate, au lieu de le supprimer.",
    pourquoiPas: {
      A: "`du` et `df` mesurent chacun correctement ; l'écart vient du fichier supprimé mais encore ouvert, et `fsck` ne se lance pas sur un système monté.",
      B: "Rien n'indique de snapshot ; `lsof +L1` montre explicitement un fichier supprimé (`deleted`) encore ouvert.",
      C: "Supprimer d'autres journaux aggraverait la perte de traces sans libérer les 30 Gio retenus par java.",
    },
    aRetenir: "`df` plein mais `du` bas : cherche les fichiers supprimés encore ouverts avec `lsof +L1`.",
  },

  // ───────────────────── Durcissement & sécurité système ─────────────────────
  {
    id: 'SYS-DUR-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'facile',
    enonce:
      "Un administrateur lit ses e-mails et navigue sur Internet avec son compte membre du groupe Admins du domaine. Que lui recommander ?",
    options: [
      { id: 'A', texte: "Utiliser un compte standard au quotidien et un compte admin séparé" },
      { id: 'B', texte: 'Garder un compte unique mais changer son mot de passe chaque semaine' },
      { id: 'C', texte: "Donner les mêmes droits à toute l'équipe pour éviter les blocages" },
      { id: 'D', texte: "Désactiver l'antivirus de son poste pour ne pas gêner ses outils d'administration à distance" },
    ],
    bonneReponse: 'A',
    explication:
      "Un courriel piégé ouvert avec un compte administrateur du domaine donne immédiatement ces privilèges à l'attaquant. Séparer les comptes applique le moindre privilège : le compte du quotidien n'a aucun droit d'administration, le compte d'administration ne sert jamais à la messagerie ni à la navigation, idéalement depuis un poste dédié.",
    pourquoiPas: {
      B: "Changer souvent le mot de passe ne réduit pas l'exposition : le compte privilégié reste utilisé pour les activités à risque.",
      C: "Multiplier les comptes privilégiés multiplie les portes d'entrée vers tout l'annuaire.",
      D: "Désactiver une protection sur le poste le plus sensible va à l'encontre de tout durcissement.",
    },
    aRetenir: "Moindre privilège : un compte nominatif standard au quotidien, un compte d'administration séparé pour administrer.",
  },
  {
    id: 'SYS-DUR-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'moyen',
    enonce: 'Quelles modifications de cette configuration SSH renforcent réellement la sécurité du serveur ?',
    extrait: {
      langage: 'texte',
      contenu: `# /etc/ssh/sshd_config (extrait) — srv-app01
Port 22
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes`,
    },
    options: [
      { id: 'A', texte: 'Passer sur le port 2222 et garder le reste inchangé' },
      { id: 'B', texte: 'Mettre `PubkeyAuthentication no` pour n’autoriser que les mots de passe' },
      { id: 'C', texte: '`PermitRootLogin no` et `PasswordAuthentication no`' },
      { id: 'D', texte: 'Supprimer `sshd_config` pour revenir aux valeurs par défaut' },
    ],
    bonneReponse: 'C',
    explication:
      "Interdire la connexion directe de root oblige à se connecter avec un compte nominatif puis à utiliser sudo, ce qui garde la trace de qui a fait quoi. Désactiver les mots de passe au profit des clés rend inopérantes les attaques par force brute. On garde une session ouverte et on teste une nouvelle connexion avant de fermer, pour ne pas se retrouver bloqué dehors.",
    pourquoiPas: {
      A: "Changer de port réduit le bruit des robots mais ne protège pas : un balayage de ports retrouve le service en quelques secondes.",
      B: "C'est l'inverse du durcissement : les mots de passe sont exposés à la force brute, les clés non.",
      D: "Sans fichier de configuration, sshd refuse de démarrer ; et ses valeurs par défaut n'interdisent pas l'authentification par mot de passe.",
    },
    aRetenir: "SSH durci : pas de connexion root directe, authentification par clé uniquement, test avant de fermer sa session.",
  },
  {
    id: 'SYS-DUR-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'moyen',
    enonce:
      "Un correctif critique corrige une faille activement exploitée qui touche le serveur web exposé sur Internet. Quelle démarche adopter ?",
    options: [
      { id: 'A', texte: 'Attendre la prochaine fenêtre de maintenance trimestrielle, comme pour tout correctif' },
      { id: 'B', texte: "Tester vite en préproduction, puis changement d'urgence avec retour arrière" },
      { id: 'C', texte: 'Installer immédiatement en production, sans test ni sauvegarde préalable' },
      { id: 'D', texte: 'Ne rien faire, puisque le pare-feu protège déjà le serveur' },
    ],
    bonneReponse: 'B',
    explication:
      "La gestion des correctifs priorise selon la gravité, l'exploitation active et l'exposition : un serveur public touché par une faille exploitée justifie un changement d'urgence. On garde cependant un test minimal, une sauvegarde ou un snapshot et un plan de retour arrière. En attendant le déploiement, une mesure de contournement (règle de filtrage, désactivation du module vulnérable) réduit le risque.",
    pourquoiPas: {
      A: "Laisser une faille exploitée ouverte des semaines sur un serveur exposé, c'est attendre l'incident.",
      C: "Un correctif peut casser l'application : sans test ni retour arrière, on remplace un risque de sécurité par une panne.",
      D: "Un serveur web exposé est par définition joignable : le pare-feu laisse passer le trafic qui exploite la faille.",
    },
    aRetenir: "Correctifs : prioriser selon exploitation et exposition ; en urgence, tester vite et prévoir le retour arrière.",
  },
  {
    id: 'SYS-DUR-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'facile',
    enonce:
      "Une nouvelle baie de stockage est livrée avec un compte d'administration `admin` / `admin`. Que faire avant de la raccorder au réseau de production ?",
    options: [
      { id: 'A', texte: 'Rien : le réseau interne est déjà protégé par le pare-feu' },
      { id: 'B', texte: "Coller le mot de passe sur l'équipement pour le retrouver facilement" },
      { id: 'C', texte: "Communiquer les identifiants à toute l'équipe par messagerie" },
      { id: 'D', texte: 'Changer le mot de passe par défaut (ou désactiver ce compte)' },
    ],
    bonneReponse: 'D',
    explication:
      "Les identifiants par défaut des équipements sont publiés dans les documentations : c'est l'un des premiers essais d'un attaquant déjà présent sur le réseau interne. On les change avant la mise en service, on préfère des comptes nominatifs (ou un annuaire) et on restreint l'interface d'administration à un réseau dédié.",
    pourquoiPas: {
      A: "Le pare-feu périmétrique n'arrête pas un attaquant ou un logiciel malveillant déjà à l'intérieur.",
      B: "Un mot de passe affiché sur l'équipement est accessible à toute personne entrant en salle.",
      C: "Un compte partagé ne permet plus de savoir qui a fait quoi, et le secret circule en clair.",
    },
    aRetenir: "Aucun équipement en production avec ses identifiants par défaut.",
  },
  {
    id: 'SYS-DUR-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'moyen',
    enonce:
      "Sur le serveur web exposé `srv-web01`, la base MySQL n'est utilisée que par l'application locale. Au vu de cette sortie, quelle mesure de durcissement est prioritaire ?",
    extrait: {
      langage: 'shell',
      contenu: `$ sudo ss -tlnp
State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port  Process
LISTEN  0       511           0.0.0.0:443         0.0.0.0:*      users:(("nginx",pid=1180,fd=6))
LISTEN  0       128           0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=902,fd=3))
LISTEN  0       151           0.0.0.0:3306        0.0.0.0:*      users:(("mysqld",pid=1342,fd=21))`,
    },
    options: [
      { id: 'A', texte: 'Fermer le port 443, qui expose le serveur' },
      { id: 'B', texte: 'Faire écouter MySQL sur 127.0.0.1 seulement et bloquer 3306 au pare-feu de l’hôte' },
      { id: 'C', texte: 'Déplacer MySQL sur le port 3307 pour qu’il soit moins facilement repéré par les robots' },
      { id: 'D', texte: 'Arrêter définitivement sshd' },
    ],
    bonneReponse: 'B',
    explication:
      "`0.0.0.0:3306` signifie que MySQL écoute sur toutes les interfaces : la base est potentiellement joignable depuis l'extérieur alors qu'elle n'en a aucun besoin. On la restreint à la boucle locale (`bind-address = 127.0.0.1`) et on applique sur l'hôte une politique « tout refuser en entrée » sauf 443, et 22 depuis le seul réseau d'administration. Chaque service inutilement exposé est une surface d'attaque.",
    pourquoiPas: {
      A: "Le port 443 est la raison d'être d'un serveur web : le fermer arrête le service.",
      C: "Changer de port ne protège rien : un balayage le retrouve, et la base reste ouverte sur toutes les interfaces.",
      D: "SSH est nécessaire à l'administration ; on le restreint au réseau d'administration au lieu de le supprimer.",
    },
    aRetenir: "Un service interne n'écoute que sur l'interface nécessaire, et le pare-feu de l'hôte refuse tout le reste par défaut.",
  },
  {
    id: 'SYS-DUR-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'facile',
    enonce: 'Pourquoi envoyer les journaux des serveurs vers une plateforme centrale (serveur syslog, SIEM) ?',
    options: [
      { id: 'A', texte: 'Pour libérer de la mémoire vive sur chaque serveur' },
      { id: 'B', texte: 'Parce que les journaux locaux sont illisibles sans outil spécialisé' },
      { id: 'C', texte: 'Pour pouvoir supprimer toute rotation des journaux sur les serveurs' },
      { id: 'D', texte: "Un attaquant devenu root peut effacer les journaux locaux" },
    ],
    bonneReponse: 'D',
    explication:
      "Effacer ses traces est un réflexe d'attaquant : une copie envoyée en temps réel vers une plateforme qu'il ne contrôle pas reste exploitable pour l'enquête. La centralisation permet aussi de corréler les événements de plusieurs serveurs, à condition que leurs horloges soient synchronisées (NTP), et de conserver les journaux selon la durée exigée.",
    pourquoiPas: {
      A: "Les journaux sont écrits sur disque, pas en mémoire : la centralisation ne vise pas les performances.",
      B: "La plupart des journaux sont du texte lisible ; le but est de les protéger et de les corréler.",
      C: "La rotation locale reste nécessaire pour ne pas saturer les disques des serveurs.",
    },
    aRetenir: "Journalisation centralisée = traces hors d'atteinte de l'attaquant + corrélation multi-serveurs (avec NTP).",
  },
  {
    id: 'SYS-DUR-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Durcissement & sécurité système',
    difficulte: 'difficile',
    enonce:
      "Le groupe `support` ne doit pouvoir modifier QUE la configuration de nginx. Quel est le problème de cette règle sudo ?",
    extrait: {
      langage: 'texte',
      contenu: `# /etc/sudoers.d/support
%support  ALL=(root) /usr/bin/vim /etc/nginx/nginx.conf`,
    },
    options: [
      { id: 'A', texte: 'Aucun : la règle limite l’usage de vim à ce seul fichier' },
      { id: 'B', texte: 'La syntaxe est invalide : un groupe ne peut pas apparaître dans sudoers' },
      { id: 'C', texte: 'Il manque `NOPASSWD:`, sans lequel la règle est moins sûre' },
      { id: 'D', texte: 'vim en root permet d’ouvrir un shell root : utiliser `sudoedit`' },
    ],
    bonneReponse: 'D',
    explication:
      "Un éditeur lancé en root hérite de tous ses droits : depuis vim, `:!bash` ouvre un shell root et `:e /etc/shadow` ouvre n'importe quel fichier. La règle `%support ALL=(root) sudoedit /etc/nginx/nginx.conf` fait éditer une copie temporaire avec les droits de l'utilisateur, puis la recopie à sa place. La même vigilance vaut pour tout programme capable de lancer des commandes (less, find, awk…).",
    pourquoiPas: {
      A: "Le fichier est seulement l'argument de départ : une fois vim lancé en root, l'utilisateur peut en sortir.",
      B: "La syntaxe `%groupe` est justement celle qui désigne un groupe dans sudoers.",
      C: "`NOPASSWD:` supprime la demande de mot de passe : c'est moins sûr, et ça ne corrige pas l'évasion vers un shell.",
    },
    aRetenir: "Pour déléguer l'édition d'un fichier, `sudoedit`, jamais un éditeur lancé en root via sudo.",
  },

  // ───────────────────── Services DNS, DHCP & messagerie ─────────────────────
  {
    id: 'SYS-DNS-001',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'facile',
    enonce:
      "Quel type d'enregistrement DNS indique les serveurs qui reçoivent les e-mails adressés au domaine `banque-alpha.example` ?",
    options: [
      { id: 'A', texte: 'CNAME' },
      { id: 'B', texte: 'MX' },
      { id: 'C', texte: 'PTR' },
      { id: 'D', texte: 'AAAA' },
    ],
    bonneReponse: 'B',
    explication:
      "L'enregistrement MX (Mail eXchanger) désigne le ou les serveurs de messagerie du domaine, avec une priorité : la valeur la plus basse est essayée en premier. Il pointe vers un nom d'hôte qui doit lui-même avoir un enregistrement A ou AAAA (pas un CNAME).",
    pourquoiPas: {
      A: "Un CNAME crée un alias d'un nom vers un autre nom ; il ne désigne pas le serveur de messagerie.",
      C: "Un PTR fait la résolution inverse (adresse IP vers nom).",
      D: "Un AAAA associe un nom à une adresse IPv6.",
    },
    aRetenir: "MX = serveurs de messagerie du domaine, avec priorité (la plus basse d'abord).",
  },
  {
    id: 'SYS-DNS-002',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'facile',
    enonce:
      "Des serveurs destinataires rejettent les e-mails de la banque, car l'adresse 203.0.113.25 du serveur d'envoi ne se résout pas en `mail.banque-alpha.example` (résolution inverse). Quel enregistrement manque ?",
    options: [
      { id: 'A', texte: "Un enregistrement A pour `mail.banque-alpha.example`" },
      { id: 'B', texte: 'Un enregistrement TXT dans la zone `banque-alpha.example`' },
      { id: 'C', texte: 'Un enregistrement PTR dans la zone `113.0.203.in-addr.arpa`' },
      { id: 'D', texte: 'Un second enregistrement MX' },
    ],
    bonneReponse: 'C',
    explication:
      "La résolution inverse utilise des enregistrements PTR placés dans la zone `in-addr.arpa`, où les octets de l'adresse sont écrits à l'envers : `25.113.0.203.in-addr.arpa` pointe vers `mail.banque-alpha.example`. Cette zone est généralement gérée par le fournisseur de l'adresse IP, à qui il faut demander la création.",
    pourquoiPas: {
      A: "L'enregistrement A sert la résolution directe (nom → IP) ; le contrôle porte ici sur le sens IP → nom.",
      B: "Les TXT portent notamment SPF ou DMARC, mais pas la résolution inverse.",
      D: "Les MX concernent la réception du courrier, pas l'identification du serveur d'envoi.",
    },
    aRetenir: "Résolution inverse = PTR dans `in-addr.arpa` (octets inversés), souvent géré par le fournisseur de l'IP.",
  },
  {
    id: 'SYS-DNS-003',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'facile',
    enonce: "Dans quel ordre se déroulent les échanges d'un client DHCP qui obtient sa première adresse ?",
    options: [
      { id: 'A', texte: 'Discover, Offer, Request, Acknowledge' },
      { id: 'B', texte: 'Request, Offer, Discover, Acknowledge' },
      { id: 'C', texte: 'Offer, Discover, Acknowledge, Request' },
      { id: 'D', texte: 'Discover, Request, Offer, Acknowledge' },
    ],
    bonneReponse: 'A',
    explication:
      "DORA : le client diffuse un Discover, le ou les serveurs répondent par un Offer, le client choisit une offre avec un Request, et le serveur confirme le bail par un Acknowledge. Pour renouveler un bail en cours, le client envoie directement un Request à son serveur.",
    pourquoiPas: {
      B: "Le client ne peut pas demander une adresse précise avant d'avoir découvert un serveur et reçu une offre.",
      C: "Un serveur ne fait pas d'offre spontanée : il répond à un Discover.",
      D: "Le Request du client vient après l'Offer : il accepte une offre reçue.",
    },
    aRetenir: "DHCP = DORA : Discover, Offer, Request, Acknowledge.",
  },
  {
    id: 'SYS-DNS-004',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'moyen',
    enonce:
      "Tu changes l'adresse IP de l'enregistrement A `intranet.banque-alpha.example`, dont le TTL est de 86 400 secondes. Une heure plus tard, certains postes joignent encore l'ancien serveur. Pourquoi ?",
    options: [
      { id: 'A', texte: "Le serveur DNS faisant autorité a refusé la modification" },
      { id: 'B', texte: "Résolveurs et postes ont gardé l'ancienne réponse en cache, pour jusqu'à 24 heures" },
      { id: 'C', texte: 'Les enregistrements A sont propagés par le serveur DHCP, qui ne renouvelle les baux que chaque semaine' },
      { id: 'D', texte: 'Il manque un enregistrement PTR pour que le changement se propage' },
    ],
    bonneReponse: 'B',
    explication:
      "Le TTL fixe la durée pendant laquelle une réponse peut être gardée en cache : 86 400 s, soit 24 heures. Les résolveurs qui avaient la réponse continuent de servir l'ancienne adresse jusqu'à expiration. Pour une migration, on abaisse le TTL (par exemple à 300 s) au moins un ancien TTL avant le changement, puis on le remonte ensuite.",
    pourquoiPas: {
      A: "Si certains postes obtiennent déjà la nouvelle adresse, la zone a bien été modifiée.",
      C: "Le DHCP distribue l'adresse des serveurs DNS, pas le contenu des enregistrements.",
      D: "Le PTR sert à la résolution inverse ; il n'influe pas sur la mise en cache des enregistrements A.",
    },
    aRetenir: "Avant une migration, abaisser le TTL au moins un ancien TTL à l'avance.",
  },
  {
    id: 'SYS-DNS-005',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'moyen',
    enonce:
      "L'imprimante réseau d'une agence change d'adresse IP après chaque redémarrage, et les postes ne la trouvent plus. Quelle est la solution propre côté serveur DHCP ?",
    options: [
      { id: 'A', texte: "Une réservation DHCP liant l'adresse MAC à une IP" },
      { id: 'B', texte: 'Réduire la durée des baux à une heure' },
      { id: 'C', texte: "Agrandir la plage d'adresses de l'étendue pour éviter qu'elle ne s'épuise" },
      { id: 'D', texte: 'Désactiver le DHCP pour tout le sous-réseau' },
    ],
    bonneReponse: 'A',
    explication:
      "Une réservation garantit qu'un équipement identifié par son adresse MAC reçoit toujours la même adresse, tout en restant géré de façon centralisée (passerelle, DNS, documentation). C'est préférable à une IP saisie à la main sur l'imprimante, qui risque d'entrer en conflit avec la plage distribuée.",
    pourquoiPas: {
      B: "Des baux plus courts font changer les adresses encore plus souvent.",
      C: "Une plage plus grande ne garantit pas que l'imprimante retrouve la même adresse.",
      D: "Tous les postes devraient alors être configurés à la main : disproportionné et source d'erreurs.",
    },
    aRetenir: "Imprimantes et serveurs : adresse fixe via une réservation DHCP (MAC → IP) ou hors de la plage distribuée.",
  },
  {
    id: 'SYS-DNS-006',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'moyen',
    enonce:
      "Un client de messagerie doit consulter ses e-mails en laissant les dossiers sur le serveur, et envoyer ses messages de façon authentifiée et chiffrée. Quelle configuration retenir ?",
    options: [
      { id: 'A', texte: 'POP3 sur le port 110 pour la réception, SMTP sur le port 25 sans authentification pour l’envoi' },
      { id: 'B', texte: 'SNMP sur le port 161 pour la réception, IMAP sur le port 143 pour l’envoi' },
      { id: 'C', texte: 'SMTP sur le port 25 pour la consultation, IMAP pour l’envoi' },
      { id: 'D', texte: 'IMAPS (993) pour consulter, SMTP authentifié sur 587 pour envoyer' },
    ],
    bonneReponse: 'D',
    explication:
      "IMAP garde les messages et les dossiers sur le serveur, ce qui permet de consulter depuis plusieurs appareils ; IMAPS (993) chiffre la session. L'envoi par un client passe par le port de soumission 587 (STARTTLS) ou 465 (TLS implicite), avec authentification. Le port 25 reste réservé aux échanges entre serveurs de messagerie.",
    pourquoiPas: {
      A: "POP3 télécharge les messages (souvent en les retirant du serveur), et un SMTP sans authentification ouvre la porte au relais de spam.",
      B: "SNMP sert à la supervision, pas à la messagerie, et IMAP ne sert pas à envoyer.",
      C: "Les rôles sont inversés : SMTP envoie, IMAP consulte.",
    },
    aRetenir: "Consultation : IMAPS 993 ; envoi depuis un client : soumission authentifiée 587 ou 465 ; serveur à serveur : 25.",
  },
  {
    id: 'SYS-DNS-007',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'difficile',
    enonce:
      "Un message dont l'adresse d'enveloppe (MAIL FROM) est en `@banque-alpha.example` arrive depuis 198.51.100.7, une adresse qui ne figure ni dans le mécanisme `ip4` ni dans l'enregistrement inclus. Quel est le résultat de la vérification SPF ?",
    extrait: {
      langage: 'texte',
      contenu: `banque-alpha.example.  3600  IN  TXT  "v=spf1 ip4:203.0.113.25 include:_spf.messagerie.example -all"`,
    },
    options: [
      { id: 'A', texte: "pass, car `include:` autorise tous les serveurs de l'hébergeur" },
      { id: 'B', texte: 'neutral, car SPF ne se prononce pas sur les adresses inconnues' },
      { id: 'C', texte: 'softfail, le message est accepté mais marqué comme suspect' },
      { id: 'D', texte: 'fail, car `-all` déclare non autorisée toute source non listée' },
    ],
    bonneReponse: 'D',
    explication:
      "SPF évalue les mécanismes de gauche à droite : ni `ip4:203.0.113.25` ni les adresses publiées par `_spf.messagerie.example` ne correspondent, donc on arrive à `-all`, qui donne « fail ». Ce que fait ensuite le serveur destinataire (rejet, quarantaine) dépend de sa politique et de l'enregistrement DMARC du domaine.",
    pourquoiPas: {
      A: "`include:` n'autorise que les adresses listées dans l'enregistrement SPF inclus ; 198.51.100.7 n'y figure pas.",
      B: "« neutral » correspond à `?all`, pas à `-all`.",
      C: "« softfail » correspond à `~all` ; le préfixe `-` donne un échec franc.",
    },
    aRetenir: "Fin d'enregistrement SPF : `-all` = fail, `~all` = softfail, `?all` = neutral.",
  },
  {
    id: 'SYS-DNS-008',
    section: 'technique',
    filiere: 'systemes',
    competence: 'Services DNS, DHCP & messagerie',
    difficulte: 'moyen',
    enonce: 'Que demande cet enregistrement publié dans la zone de la banque ?',
    extrait: {
      langage: 'texte',
      contenu: `_dmarc.banque-alpha.example.  3600  IN  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@banque-alpha.example"`,
    },
    options: [
      { id: 'A', texte: 'Mettre en quarantaine les échecs DMARC et envoyer des rapports agrégés' },
      { id: 'B', texte: 'Signer automatiquement tous les messages sortants avec DKIM' },
      { id: 'C', texte: 'Rejeter purement et simplement les messages qui échouent à DMARC' },
      { id: 'D', texte: 'Lister les adresses IP autorisées à envoyer du courrier pour le domaine' },
    ],
    bonneReponse: 'A',
    explication:
      "Un message passe DMARC si SPF ou DKIM est valide ET aligné sur le domaine visible de l'expéditeur (en-tête From). `p=quarantine` demande aux destinataires de traiter les échecs comme suspects (dossier indésirable), `rua` indique où envoyer les rapports agrégés. On commence souvent par `p=none` pour observer, avant de durcir vers `quarantine` puis `reject`.",
    pourquoiPas: {
      B: "DMARC ne signe rien : la signature DKIM est faite par le serveur d'envoi, DMARC s'appuie sur son résultat.",
      C: "Le rejet correspond à `p=reject` ; ici la politique est `quarantine`.",
      D: "La liste des serveurs autorisés est le rôle de SPF, publié dans un autre enregistrement TXT.",
    },
    aRetenir: "SPF autorise des serveurs, DKIM signe les messages, DMARC fixe la politique et les rapports en cas d'échec.",
  },
];
