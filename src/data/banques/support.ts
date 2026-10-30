// Banque technique — filière SUPPORT IT (préfixe SUP) : 60 questions QCM.
// Postes de travail, dépannage réseau, messagerie, comptes, ITIL, sécurité au poste et relation utilisateur.
// Contextes fictifs (« Banque Alpha », IP de documentation ou privées, domaines `.example`).
import type { QcmQuestion } from '@/lib/types';

export const banqueTechniqueSupport: QcmQuestion[] = [
  // ───────────────────────────── Matériel & périphériques ─────────────────────────────
  {
    id: 'SUP-MAT-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'facile',
    enonce:
      "Dans une agence de Kinshasa, les coupures de courant de quelques secondes font régulièrement s'éteindre les postes des guichetiers, avec perte du travail en cours. Quel équipement règle ce problème ?",
    options: [
      { id: 'A', texte: "Une multiprise parafoudre sur chaque poste de travail" },
      { id: 'B', texte: 'Un stabilisateur de tension sans batterie' },
      { id: 'C', texte: 'Un onduleur (UPS) dimensionné pour les postes' },
      { id: 'D', texte: "Un bloc d'alimentation interne de plus forte puissance" },
    ],
    bonneReponse: 'C',
    explication:
      "Seul un onduleur dispose d'une batterie : il continue d'alimenter le poste pendant la coupure et laisse le temps d'enregistrer et d'éteindre proprement. Les autres équipements filtrent ou régulent la tension, mais ne fournissent aucune énergie quand le secteur disparaît.",
    pourquoiPas: {
      A: "Un parafoudre protège contre les surtensions (foudre, retour brutal du courant), pas contre l'absence de courant.",
      B: "Un stabilisateur corrige une tension trop haute ou trop basse, mais sans batterie il s'arrête dès que le secteur est coupé.",
      D: "La puissance du bloc d'alimentation n'y change rien : sans courant en entrée, il ne délivre rien en sortie.",
    },
    aRetenir: "Contre les coupures : onduleur (batterie) ; contre les surtensions : parafoudre ; contre les variations : régulation de tension.",
  },
  {
    id: 'SUP-MAT-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'facile',
    enonce:
      "Un poste équipé d'un disque dur mécanique de 5 400 tr/min et de 8 Go de RAM met plusieurs minutes à démarrer. Le Gestionnaire des tâches affiche le disque à 100 % d'utilisation, le processeur à 15 % et la mémoire à 45 %. Quelle amélioration aura le plus d'effet ?",
    options: [
      { id: 'A', texte: 'Remplacer le disque dur par un SSD' },
      { id: 'B', texte: 'Ajouter un second écran' },
      { id: 'C', texte: 'Installer une carte graphique dédiée' },
      { id: 'D', texte: 'Augmenter la fréquence du processeur dans le BIOS' },
    ],
    bonneReponse: 'A',
    explication:
      "Le goulot d'étranglement est le disque : il est saturé alors que le processeur et la mémoire ont de la marge. Un SSD n'a pas de pièce mécanique et offre des temps d'accès beaucoup plus courts qu'un disque à plateaux, ce qui accélère nettement le démarrage et l'ouverture des applications.",
    pourquoiPas: {
      B: "Un écran supplémentaire améliore le confort de travail, pas la vitesse de lecture du disque.",
      C: "La carte graphique ne joue aucun rôle dans un démarrage lent causé par un disque saturé.",
      D: "Le processeur n'est utilisé qu'à 15 % : il n'est pas le facteur limitant, et l'overclocking est à proscrire sur un poste de production.",
    },
    aRetenir: "Avant de changer une pièce, identifie la ressource saturée (disque, mémoire, processeur) dans le Gestionnaire des tâches.",
  },
  {
    id: 'SUP-MAT-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'facile',
    enonce:
      "À l'allumage, les ventilateurs d'une unité centrale tournent, l'écran reste noir et le poste émet une série de bips avant même l'apparition du logo de Windows. Que signifient ces bips ?",
    options: [
      { id: 'A', texte: "Le POST du BIOS/UEFI signale une panne matérielle par un code sonore" },
      { id: 'B', texte: "Windows est corrompu et doit être réparé depuis le support d'installation" },
      { id: 'C', texte: "Un mot de passe BIOS a été défini et doit être saisi avant de démarrer Windows" },
      { id: 'D', texte: "Un virus a infecté le secteur d'amorçage du disque" },
    ],
    bonneReponse: 'A',
    explication:
      "Les bips proviennent du POST (Power-On Self-Test), exécuté par le micrologiciel avant le chargement du système d'exploitation. Faute d'affichage, il signale l'erreur par une séquence de bips dont la signification dépend du fabricant (souvent mémoire vive ou carte graphique). On consulte la documentation du constructeur, puis on vérifie par exemple que les barrettes de RAM sont bien enfoncées.",
    pourquoiPas: {
      B: "Windows n'est pas encore chargé à ce stade : un système corrompu ne produit pas de bips au démarrage.",
      C: "Un mot de passe BIOS s'affiche sous forme d'invite à l'écran, il ne bloque pas l'affichage.",
      D: "Le secteur d'amorçage n'est lu qu'après un POST réussi : les bips surviennent avant.",
    },
    aRetenir: "Bips + écran noir avant le logo = erreur matérielle détectée par le POST : on cherche le code dans la documentation du fabricant.",
  },
  {
    id: 'SUP-MAT-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'moyen',
    enonce:
      "Depuis ce matin, aucun agent du 2e étage ne peut imprimer sur l'imprimante réseau partagée, qui affiche pourtant « Prête ». Tu compares sa page de configuration avec le port d'impression défini sur les postes. Quelle est la cause la plus probable ?",
    extrait: {
      langage: 'texte',
      contenu: `Page de configuration de l'imprimante
  Mode d'adressage : DHCP
  Adresse IPv4     : 192.168.20.57
  Masque           : 255.255.255.0

Port configuré sur les postes (Propriétés de l'imprimante > Ports)
  IP_192.168.20.41`,
    },
    options: [
      { id: 'A', texte: "L'imprimante a changé d'adresse IP (DHCP) et les postes visent l'ancienne" },
      { id: 'B', texte: "Le pilote d'impression est corrompu sur tous les postes de l'étage depuis la dernière mise à jour" },
      { id: 'C', texte: "Le masque de sous-réseau de l'imprimante est incorrect" },
      { id: 'D', texte: "Le spouleur d'impression de chaque poste est arrêté" },
    ],
    bonneReponse: 'A',
    explication:
      "L'imprimante est configurée en DHCP : après un redémarrage ou l'expiration de son bail, elle a reçu 192.168.20.57, alors que les postes impriment toujours vers 192.168.20.41. La correction durable consiste à lui attribuer une réservation DHCP (ou une adresse fixe hors plage), puis à vérifier le port sur les postes ou sur le serveur d'impression.",
    pourquoiPas: {
      B: "Une corruption simultanée du pilote sur tous les postes est improbable, et l'écart d'adresse explique déjà le symptôme.",
      C: "255.255.255.0 est cohérent avec le réseau 192.168.20.0/24 des postes.",
      D: "Un spouleur arrêté sur tous les postes en même temps serait une coïncidence ; on aurait aussi des erreurs pour les imprimantes locales.",
    },
    aRetenir: "Une imprimante réseau doit avoir une adresse stable : réservation DHCP ou adresse fixe hors de la plage distribuée.",
  },
  {
    id: 'SUP-MAT-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'moyen',
    enonce:
      "Sur un poste fraîchement réinstallé, l'image est floue, la résolution est bloquée à 1024 × 768 et le Gestionnaire de périphériques affiche « Carte graphique de base Microsoft ». Que fais-tu ?",
    options: [
      { id: 'A', texte: 'Remplacer le câble HDMI par un câble neuf' },
      { id: 'B', texte: "Installer le pilote graphique du fabricant" },
      { id: 'C', texte: "Remplacer l'écran, qui ne supporte probablement pas une résolution plus élevée" },
      { id: 'D', texte: "Régler la mise à l'échelle de Windows sur 150 %" },
    ],
    bonneReponse: 'B',
    explication:
      "« Carte graphique de base Microsoft » est le pilote générique utilisé quand aucun pilote spécifique n'est installé : il offre peu de résolutions. En installant le pilote du fabricant (depuis le site du constructeur ou l'outil de déploiement de l'entreprise), la résolution native de l'écran redevient disponible.",
    pourquoiPas: {
      A: "Un câble défectueux provoque plutôt des coupures, des parasites ou une absence de signal, pas l'affichage d'un pilote générique.",
      C: "Rien n'indique une limite de l'écran : c'est le pilote générique qui restreint les résolutions proposées.",
      D: "La mise à l'échelle agrandit les éléments affichés mais ne change pas la résolution ; l'image resterait floue.",
    },
    aRetenir: "Pilote générique (« de base Microsoft ») = fonctions limitées : installe le pilote du fabricant.",
  },
  {
    id: 'SUP-MAT-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'moyen',
    enonce:
      "Une unité centrale (format tour) possède une barrette DIMM DDR4 de 8 Go et un emplacement mémoire libre. Tu veux la porter à 16 Go. Quelle barrette commander ?",
    options: [
      { id: 'A', texte: 'Une barrette SO-DIMM DDR4 de 8 Go' },
      { id: 'B', texte: 'Une barrette DIMM DDR3 de 16 Go' },
      { id: 'C', texte: 'Une barrette DIMM DDR5 de 8 Go' },
      { id: 'D', texte: "Une barrette DIMM DDR4 de 8 Go" },
    ],
    bonneReponse: 'D',
    explication:
      "La nouvelle barrette doit respecter le format (DIMM pour un poste fixe) et la génération (DDR4) supportés par la carte mère. Deux barrettes identiques permettent en plus le fonctionnement en double canal ; si les fréquences diffèrent, l'ensemble fonctionne généralement à la fréquence la plus basse.",
    pourquoiPas: {
      A: "Le format SO-DIMM est destiné aux ordinateurs portables : il n'entre pas dans un emplacement DIMM de poste fixe.",
      B: "La DDR3 n'est pas compatible avec un emplacement DDR4 : les encoches sont placées différemment.",
      C: "La DDR5 n'est pas compatible avec une carte mère DDR4, ni électriquement ni physiquement.",
    },
    aRetenir: "Une barrette mémoire doit correspondre au format (DIMM/SO-DIMM) ET à la génération (DDR4, DDR5…) de la carte mère.",
  },
  {
    id: 'SUP-MAT-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'difficile',
    enonce:
      "Tu dois protéger plusieurs postes et un commutateur dont la consommation totale est de 1 000 W. On te propose un onduleur « 1 500 VA » avec un facteur de puissance de 0,6. Convient-il ?",
    options: [
      { id: 'A', texte: 'Oui, car 1 500 VA est supérieur à 1 000 W' },
      { id: 'B', texte: "Non : il ne fournit qu'environ 900 W, moins que la charge de 1 000 W" },
      { id: 'C', texte: 'Oui, avec une autonomie garantie de 1,5 heure' },
      { id: 'D', texte: "Oui, car le facteur de puissance augmente la capacité utile : 1 500 / 0,6 = 2 500 W disponibles" },
    ],
    bonneReponse: 'B',
    explication:
      "La puissance active (en watts) d'un onduleur vaut sa puissance apparente (en VA) multipliée par le facteur de puissance : 1 500 × 0,6 = 900 W. La charge de 1 000 W dépasse cette limite : l'onduleur passerait en surcharge. Il faut un modèle plus puissant, en gardant une marge de sécurité.",
    pourquoiPas: {
      A: "On ne compare pas directement des VA et des watts : seule la puissance en watts (VA × facteur de puissance) doit couvrir la charge.",
      C: "L'autonomie dépend de la batterie et de la charge, pas de la puissance en VA ; de toute façon l'onduleur serait en surcharge.",
      D: "Le facteur de puissance se multiplie, il ne se divise pas : il réduit la puissance utile au lieu de l'augmenter.",
    },
    aRetenir: "Puissance utile d'un onduleur (W) = puissance apparente (VA) × facteur de puissance ; elle doit dépasser la charge avec une marge.",
  },
  {
    id: 'SUP-MAT-008',
    section: 'technique',
    filiere: 'support',
    competence: 'Matériel & périphériques',
    difficulte: 'difficile',
    enonce:
      "Après chaque débranchement, un poste démarre avec une date système ancienne et ses réglages du BIOS reviennent aux valeurs d'usine. Le navigateur affiche alors une erreur de certificat (`NET::ERR_CERT_DATE_INVALID`) sur tous les sites HTTPS. Quelle est la cause la plus probable ?",
    options: [
      { id: 'A', texte: 'Le SSD est en fin de vie et perd des données au démarrage' },
      { id: 'B', texte: 'La carte réseau reçoit une mauvaise heure du serveur DHCP' },
      { id: 'C', texte: "Un logiciel malveillant modifie l'horloge du système pour bloquer la navigation sécurisée" },
      { id: 'D', texte: 'La pile de la carte mère (pile CMOS, souvent une CR2032) est épuisée' },
    ],
    bonneReponse: 'D',
    explication:
      "La pile de la carte mère alimente l'horloge temps réel et conserve les réglages du BIOS quand le poste est débranché. Épuisée, elle laisse l'horloge repartir d'une date ancienne : les certificats des sites apparaissent alors comme « pas encore valides » ou expirés. On remplace la pile, puis on règle l'heure et on vérifie la synchronisation avec le serveur de temps.",
    pourquoiPas: {
      A: "Un SSD défaillant provoque des erreurs de lecture ou des plantages, pas la remise à zéro des réglages du BIOS.",
      B: "Le DHCP ne fixe pas l'horloge du BIOS, et il n'expliquerait pas la perte des réglages du micrologiciel.",
      C: "Un logiciel malveillant n'efface pas les réglages du BIOS à chaque débranchement électrique.",
    },
    aRetenir: "Date qui revient en arrière + BIOS réinitialisé après débranchement = pile CMOS à remplacer.",
  },

  // ───────────────────────────── Windows & postes de travail ─────────────────────────────
  {
    id: 'SUP-WIN-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'facile',
    enonce:
      "Le logiciel de gestion des comptes d'un agent ne répond plus et sa fenêtre est figée. Quel outil Windows permet de fermer ce programme de force ?",
    options: [
      { id: 'A', texte: "Le Gestionnaire des tâches (Ctrl + Maj + Échap)" },
      { id: 'B', texte: "L'Observateur d'événements" },
      { id: 'C', texte: "L'utilitaire de configuration système `msconfig`" },
      { id: 'D', texte: "Le panneau « Programmes et fonctionnalités » du Panneau de configuration" },
    ],
    bonneReponse: 'A',
    explication:
      "Le Gestionnaire des tâches liste les applications et processus en cours et permet d'arrêter celui qui ne répond plus. Il faut prévenir l'agent que les données non enregistrées dans cette application seront perdues.",
    pourquoiPas: {
      B: "L'Observateur d'événements sert à lire les journaux, pas à arrêter un programme.",
      C: "`msconfig` règle le démarrage du système ; il n'agit pas sur une application en cours d'exécution.",
      D: "Ce panneau sert à désinstaller ou réparer des logiciels, pas à fermer un programme figé.",
    },
    aRetenir: "Programme figé : Ctrl + Maj + Échap, puis « Fin de tâche » sur le bon processus.",
  },
  {
    id: 'SUP-WIN-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'facile',
    enonce:
      "L'administrateur vient de modifier une stratégie de groupe (GPO) qui ajoute un raccourci sur le bureau. L'utilisateur ne veut pas redémarrer. Quelle commande force l'application immédiate de la stratégie sur son poste ?",
    options: [
      { id: 'A', texte: '`ipconfig /renew`' },
      { id: 'B', texte: '`sfc /scannow`' },
      { id: 'C', texte: '`gpresult /r`' },
      { id: 'D', texte: '`gpupdate /force`' },
    ],
    bonneReponse: 'D',
    explication:
      "`gpupdate /force` réapplique toutes les stratégies de groupe, ordinateur et utilisateur, sans attendre le cycle d'actualisation automatique. Certains paramètres (installation de logiciels, redirection de dossiers) exigent toutefois une fermeture de session ou un redémarrage : la commande le signale alors.",
    pourquoiPas: {
      A: "`ipconfig /renew` renouvelle le bail DHCP ; il ne touche pas aux stratégies de groupe.",
      B: "`sfc /scannow` vérifie l'intégrité des fichiers système de Windows.",
      C: "`gpresult /r` affiche les stratégies appliquées, mais n'en force pas l'actualisation.",
    },
    aRetenir: "`gpupdate /force` applique les GPO, `gpresult /r` montre lesquelles sont appliquées.",
  },
  {
    id: 'SUP-WIN-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'moyen',
    enonce:
      "Sur un poste Windows qui présente des erreurs système à répétition, tu lances la vérification des fichiers système dans une invite de commandes en administrateur. Quelle est l'étape suivante recommandée ?",
    extrait: {
      langage: 'shell',
      contenu: `C:\\Windows\\system32> sfc /scannow

Début de l'analyse du système. Ce processus va prendre du temps.
Vérification 100 % terminée.

La protection des ressources Windows a trouvé des fichiers endommagés,
mais n'a pas pu en réparer certains.`,
    },
    options: [
      { id: 'A', texte: "Sauvegarder les données, formater le disque et réinstaller Windows sans attendre" },
      { id: 'B', texte: "Lancer `chkdsk C: /f` au prochain redémarrage et considérer l'incident comme résolu" },
      { id: 'C', texte: "Réparer l'image avec `DISM /Online /Cleanup-Image /RestoreHealth`, puis relancer SFC" },
      { id: 'D', texte: 'Exécuter `gpupdate /force` pour restaurer les fichiers' },
    ],
    bonneReponse: 'C',
    explication:
      "SFC répare les fichiers système à partir du magasin de composants de Windows. Si ce magasin est lui-même endommagé, SFC échoue : DISM avec `/RestoreHealth` le répare d'abord, puis un nouveau `sfc /scannow` peut remplacer les fichiers défectueux. La réinstallation n'intervient qu'en dernier recours.",
    pourquoiPas: {
      A: "Réinstaller d'emblée fait perdre du temps et des réglages alors qu'une réparation en ligne est possible.",
      B: "`chkdsk` vérifie le système de fichiers du disque, pas l'intégrité des fichiers de Windows ; le problème signalé par SFC resterait entier.",
      D: "`gpupdate` applique les stratégies de groupe et ne répare aucun fichier système.",
    },
    aRetenir: "Si `sfc /scannow` n'arrive pas à réparer : `DISM /Online /Cleanup-Image /RestoreHealth`, puis relancer SFC.",
  },
  {
    id: 'SUP-WIN-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'moyen',
    enonce:
      "Un agent signale que son poste « s'éteint tout seul ». Dans l'Observateur d'événements (journal Système), tu trouves l'entrée ci-dessous à l'heure indiquée. Que t'apprend-elle ?",
    extrait: {
      langage: 'log',
      contenu: `Niveau     : Critique
Source     : Kernel-Power
ID         : 41
Catégorie  : (63)
Message    : Le système a redémarré sans s'arrêter correctement au préalable.`,
    },
    options: [
      { id: 'A', texte: "Le poste s'est arrêté brutalement (coupure, blocage ou plantage), sans arrêt propre" },
      { id: 'B', texte: "Windows Update a redémarré le poste normalement après l'installation d'une mise à jour" },
      { id: 'C', texte: "L'utilisateur a fermé sa session et Windows a enregistré la déconnexion" },
      { id: 'D', texte: 'Le disque système est plein et Windows a refusé de démarrer' },
    ],
    bonneReponse: 'A',
    explication:
      "L'événement Kernel-Power 41 est consigné au démarrage suivant lorsque Windows constate que le précédent arrêt n'a pas été propre. Il signale le symptôme, pas la cause : on examine les événements juste avant (erreurs de pilote, écran bleu), l'alimentation électrique, l'onduleur et la température du poste.",
    pourquoiPas: {
      B: "Un redémarrage déclenché par Windows Update est un arrêt propre : il ne produit pas d'événement critique Kernel-Power 41.",
      C: "Une fermeture de session n'arrête pas le système et n'est pas journalisée sous cette source.",
      D: "Un disque plein produit d'autres messages ; ici Windows a bien redémarré.",
    },
    aRetenir: "Kernel-Power 41 = arrêt non propre constaté ; la cause se cherche dans les événements précédents et l'alimentation.",
  },
  {
    id: 'SUP-WIN-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'moyen',
    enonce:
      "Juste après l'installation d'un nouveau pilote de carte réseau, un poste affiche un écran bleu à chaque démarrage. Quelle démarche privilégier ?",
    options: [
      { id: 'A', texte: 'Réinstaller complètement Windows pour repartir sur une base saine' },
      { id: 'B', texte: 'Remplacer la carte mère, probablement endommagée par le pilote' },
      { id: 'C', texte: "Démarrer en mode sans échec et revenir au pilote précédent" },
      { id: 'D', texte: "Désactiver l'antivirus, qui bloque sans doute le nouveau pilote" },
    ],
    bonneReponse: 'C',
    explication:
      "Le mode sans échec charge Windows avec un jeu minimal de pilotes : le pilote fautif n'est pas chargé et l'on peut le désinstaller ou revenir à la version précédente depuis le Gestionnaire de périphériques. Un point de restauration antérieur à l'installation est une alternative. On part toujours de la modification la plus récente.",
    pourquoiPas: {
      A: "Réinstaller Windows est disproportionné quand la cause (le dernier pilote installé) est connue et réversible.",
      B: "Un pilote est un logiciel : il ne détruit pas la carte mère, et le lien temporel désigne clairement la mise à jour.",
      D: "Le poste ne démarre pas jusqu'au bureau ; rien n'indique un blocage par l'antivirus, et le désactiver affaiblirait la sécurité.",
    },
    aRetenir: "Panne juste après une modification : on annule cette modification en premier (mode sans échec, pilote précédent, point de restauration).",
  },
  {
    id: 'SUP-WIN-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'moyen',
    enonce:
      "À l'ouverture de session, une agente arrive sur un bureau vide avec le message « Vous êtes connecté avec un profil temporaire ». Ses fichiers semblent avoir disparu. Quelle est la bonne lecture de la situation ?",
    options: [
      { id: 'A', texte: "Son mot de passe a expiré pendant le week-end ; il suffit de le réinitialiser" },
      { id: 'B', texte: "Windows n'a pas pu charger son profil ; ses fichiers restent dans l'ancien dossier du profil" },
      { id: 'C', texte: "Une mise à jour d'Office a échoué et masqué ses documents ; il faut réinstaller la suite Office" },
      { id: 'D', texte: "Son compte a été supprimé de l'annuaire par erreur puis recréé ; ses données sont perdues" },
    ],
    bonneReponse: 'B',
    explication:
      "Le profil temporaire apparaît quand Windows ne parvient pas à charger le profil habituel (fichier du registre utilisateur endommagé, entrée incorrecte dans `ProfileList`). Les documents ne sont pas perdus : ils restent dans l'ancien dossier du profil. Tout ce qui est créé dans la session temporaire est en revanche effacé à la déconnexion, d'où l'importance de prévenir l'agente.",
    pourquoiPas: {
      A: "Avec un mot de passe expiré, Windows demande de le changer ; il n'ouvre pas une session sur un profil temporaire.",
      C: "Le message concerne le profil Windows, pas une application bureautique : Office ne gère pas le bureau ni le dossier du profil.",
      D: "Un compte recréé obtiendrait un nouveau profil normal, pas un profil temporaire, et les fichiers de l'ancien profil resteraient sur le disque.",
    },
    aRetenir: "Profil temporaire : ne rien enregistrer dans cette session, sauvegarder le dossier du profil d'origine, puis réparer ou recréer le profil.",
  },
  {
    id: 'SUP-WIN-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'difficile',
    enonce:
      "Après une mise à jour du BIOS, l'ordinateur portable d'un cadre de la Banque Alpha affiche au démarrage l'écran de récupération BitLocker, qui demande une clé de 48 chiffres et indique un identifiant de clé. Que fais-tu ?",
    options: [
      { id: 'A', texte: 'Désactiver la puce TPM dans le BIOS pour supprimer la demande' },
      { id: 'B', texte: "Réinstaller Windows, car sans une clé enregistrée sur le poste lui-même les données sont perdues" },
      { id: 'C', texte: "Vérifier son identité, puis lui fournir la clé correspondant à l'identifiant affiché, retrouvée dans l'annuaire" },
      { id: 'D', texte: "Ouvrir une invite de commandes depuis l'écran de récupération et lancer `manage-bde -off` pour déchiffrer le disque" },
    ],
    bonneReponse: 'C',
    explication:
      "Une modification du micrologiciel change les mesures vérifiées par le TPM : BitLocker exige alors la clé de récupération. Dans une organisation bien gérée, cette clé est sauvegardée dans l'annuaire (Active Directory ou Entra ID) ou dans un outil de gestion, retrouvable grâce à l'identifiant affiché. La clé donne accès aux données chiffrées : on vérifie donc l'identité du demandeur et on trace sa communication. Pour les mises à jour suivantes, on suspend BitLocker avant de flasher le BIOS.",
    pourquoiPas: {
      A: "Désactiver le TPM n'enlève pas le chiffrement : la clé de récupération resterait exigée.",
      B: "Les données ne sont pas perdues si la clé a été sauvegardée ; réinstaller détruirait inutilement le contenu du disque.",
      D: "Le disque est verrouillé et Windows ne démarre pas : il faut d'abord le déverrouiller avec la clé avant toute commande de gestion.",
    },
    aRetenir: "Écran de récupération BitLocker : identité vérifiée, clé retrouvée grâce à son identifiant, opération tracée ; suspendre BitLocker avant une mise à jour du BIOS.",
  },
  {
    id: 'SUP-WIN-008',
    section: 'technique',
    filiere: 'support',
    competence: 'Windows & postes de travail',
    difficulte: 'difficile',
    enonce:
      "Le lecteur réseau « Finance » n'apparaît pas pour Mme Kabongo, alors qu'il est distribué par la GPO « Lecteurs-Finance ». Voici un extrait de `gpresult /r` exécuté dans sa session. Quelle est la cause ?",
    extrait: {
      langage: 'shell',
      contenu: `PARAMÈTRES UTILISATEUR
----------------------
    Objets Stratégie de groupe appliqués
    -------------------------------------
        Postes-Standard
        Imprimantes-Etage2

    Les objets Stratégie de groupe suivants n'ont pas été appliqués car ils ont été filtrés :
    -------------------------------------------------------------------------------------
        Lecteurs-Finance
            Filtrage :  Refusé (Sécurité)`,
    },
    options: [
      { id: 'A', texte: "Son compte n'est pas dans le groupe ciblé par le filtrage de sécurité de la GPO" },
      { id: 'B', texte: "La GPO « Lecteurs-Finance » est désactivée par l'administrateur" },
      { id: 'C', texte: "Un filtre WMI empêche l'application de la GPO sur ce modèle de poste de travail" },
      { id: 'D', texte: "Le poste n'arrive pas à contacter de contrôleur de domaine à l'ouverture de session" },
    ],
    bonneReponse: 'A',
    explication:
      "« Refusé (Sécurité) » indique que le compte ne dispose pas de la permission « Appliquer la stratégie de groupe » sur cette GPO, généralement parce qu'il n'appartient pas au groupe ciblé par le filtrage de sécurité. Après validation de la demande, on ajoute l'utilisatrice au bon groupe ; elle doit ensuite fermer puis rouvrir sa session pour que sa nouvelle appartenance soit prise en compte.",
    pourquoiPas: {
      B: "Une GPO désactivée apparaît avec un autre motif (« Désactivé (GPO) »), pas « Refusé (Sécurité) ».",
      C: "Un filtre WMI serait signalé comme tel (« Refusé (Filtre WMI) »).",
      D: "D'autres GPO ont bien été appliquées : le poste a donc pu joindre le domaine.",
    },
    aRetenir: "`gpresult /r` donne le motif du filtrage d'une GPO : « Refusé (Sécurité) » = problème d'appartenance au groupe ciblé.",
  },

  // ───────────────────────────── Dépannage réseau ─────────────────────────────
  {
    id: 'SUP-NET-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'facile',
    enonce:
      "Un poste filaire n'accède ni à Internet ni aux applications internes. Voici la sortie de `ipconfig`. Que signifie l'adresse obtenue ?",
    extrait: {
      langage: 'shell',
      contenu: `C:\\> ipconfig

Carte Ethernet Ethernet :

   Suffixe DNS propre à la connexion. . . :
   Adresse d'autoconfiguration IPv4 . . . : 169.254.37.112
   Masque de sous-réseau. . . . . . . . . : 255.255.0.0
   Passerelle par défaut. . . . . . . . . :`,
    },
    options: [
      { id: 'A', texte: "Quelqu'un a saisi à la main une adresse IP fixe erronée dans les propriétés de la carte" },
      { id: 'B', texte: "Le poste n'a pas obtenu de bail DHCP et s'est attribué une adresse APIPA" },
      { id: 'C', texte: 'Le serveur DNS de la banque est en panne' },
      { id: 'D', texte: "Un autre appareil du réseau utilise la même adresse IP que ce poste filaire" },
    ],
    bonneReponse: 'B',
    explication:
      "Les adresses 169.254.0.0/16 (APIPA, ou adresses de liaison locale) sont auto-attribuées par Windows quand aucun serveur DHCP ne répond. Sans passerelle, le poste ne peut rien joindre hors de son segment. On vérifie le câble et la prise, le port du commutateur, puis la disponibilité du DHCP, et on relance `ipconfig /renew`.",
    pourquoiPas: {
      A: "Une adresse saisie manuellement apparaîtrait comme « Adresse IPv4 », pas comme adresse d'autoconfiguration en 169.254.x.x.",
      C: "Un problème DNS n'empêche pas d'obtenir une adresse IP : le poste aurait une adresse normale de son réseau.",
      D: "Un conflit d'adresses fait l'objet d'un message spécifique de Windows ; ici, c'est l'absence de bail DHCP qui est en cause.",
    },
    aRetenir: "Adresse en 169.254.x.x = APIPA = le poste n'a pas obtenu de bail DHCP.",
  },
  {
    id: 'SUP-NET-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'facile',
    enonce:
      "Un utilisateur n'a « plus Internet ». Tu appliques une méthode de dépannage par couches, de la plus basse à la plus haute. Quel ordre de vérifications est le bon ?",
    options: [
      { id: 'A', texte: "Câble ou Wi-Fi → `ipconfig` → `ping` de la passerelle → `ping` d'une IP externe → `nslookup` → navigateur" },
      { id: 'B', texte: 'Navigateur → réinstallation du navigateur → redémarrage du serveur DNS → câble' },
      { id: 'C', texte: "Résolution DNS (`nslookup`) → `ping` de la passerelle → câble → adresse IP" },
      { id: 'D', texte: "Redémarrage du commutateur de l'étage → redémarrage du poste → réinitialisation de la pile TCP/IP → ticket chez l'opérateur" },
    ],
    bonneReponse: 'A',
    explication:
      "La démarche ascendante suit le modèle en couches : physique (câble, Wi-Fi), réseau local (adresse IP, passerelle), accès extérieur (IP publique), puis services applicatifs (DNS, navigateur). Chaque test réussi écarte une couche et localise rapidement la panne, sans action intrusive.",
    pourquoiPas: {
      B: "Commencer par l'application fait perdre du temps, et redémarrer un serveur DNS partagé pour un seul poste est disproportionné.",
      C: "Tester le DNS avant de savoir si le poste a une adresse et une passerelle mélange les couches : un échec ne dirait pas où est la panne.",
      D: "Redémarrer un commutateur coupe tout l'étage, sans diagnostic préalable ; c'est l'inverse d'une démarche méthodique.",
    },
    aRetenir: "Dépannage réseau : du bas vers le haut — physique, IP, passerelle, extérieur, DNS, application.",
  },
  {
    id: 'SUP-NET-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'moyen',
    enonce:
      "Un agent n'arrive pas à ouvrir le portail interne. Tu obtiens les résultats ci-dessous depuis son poste. Où se situe le problème ?",
    extrait: {
      langage: 'shell',
      contenu: `C:\\> ping 192.168.1.1
Réponse de 192.168.1.1 : octets=32 temps<1ms TTL=64   (x4)

C:\\> ping 203.0.113.10
Réponse de 203.0.113.10 : octets=32 temps=18 ms TTL=55   (x4)

C:\\> ping portail.banque-alpha.example
La requête Ping n'a pas pu trouver l'hôte portail.banque-alpha.example.
Vérifiez le nom et essayez à nouveau.`,
    },
    options: [
      { id: 'A', texte: 'Le câble réseau du poste est défectueux' },
      { id: 'B', texte: 'La passerelle par défaut ne répond pas' },
      { id: 'C', texte: 'Un pare-feu bloque les paquets ICMP vers le portail' },
      { id: 'D', texte: "La résolution du nom en adresse IP (DNS) échoue" },
    ],
    bonneReponse: 'D',
    explication:
      "La passerelle et une adresse externe répondent : les couches physique et IP fonctionnent. Le message « n'a pas pu trouver l'hôte » apparaît avant tout envoi de paquet : c'est la traduction du nom en adresse qui échoue. On poursuit avec `nslookup` et on vérifie les serveurs DNS configurés (`ipconfig /all`).",
    pourquoiPas: {
      A: "Avec un câble défectueux, aucun des deux premiers `ping` n'aurait abouti.",
      B: "La passerelle 192.168.1.1 répond, et l'adresse externe est joignable à travers elle.",
      C: "Un blocage ICMP produirait des délais d'attente dépassés après résolution du nom, pas l'échec de la recherche de l'hôte.",
    },
    aRetenir: "« Impossible de trouver l'hôte » alors que les IP répondent = problème de résolution DNS.",
  },
  {
    id: 'SUP-NET-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'moyen',
    enonce:
      "Seul le poste de M. Lukusa n'arrive pas à résoudre les noms internes ; ses collègues du même bureau utilisent le serveur DNS 192.168.10.5. Voici le résultat de `nslookup` sur son poste. Quelle est l'action la plus appropriée ?",
    extrait: {
      langage: 'shell',
      contenu: `C:\\> nslookup intranet.banque-alpha.example
DNS request timed out.
    timeout was 2 seconds.
Serveur :   UnKnown
Address:  192.168.50.9

DNS request timed out.
    timeout was 2 seconds.
*** Le délai de la requête sur UnKnown a expiré`,
    },
    options: [
      { id: 'A', texte: "Vider le cache DNS du poste avec `ipconfig /flushdns` : cela suffira" },
      { id: 'B', texte: "Signaler à l'équipe applicative que le serveur de l'intranet ne répond plus aux requêtes" },
      { id: 'C', texte: "Corriger le serveur DNS configuré sur sa carte réseau (repasser en automatique)" },
      { id: 'D', texte: "Remplacer la carte réseau du poste, qui n'arrive plus à joindre le serveur" },
    ],
    bonneReponse: 'C',
    explication:
      "`nslookup` montre que le poste interroge 192.168.50.9, qui ne répond pas, alors que le reste du bureau utilise 192.168.10.5. Le poste a donc une configuration DNS différente, typiquement saisie manuellement. On rétablit la configuration standard (DHCP ou serveur DNS de l'entreprise), puis on vérifie avec un nouveau `nslookup`.",
    pourquoiPas: {
      A: "Vider le cache n'aide pas si le serveur DNS interrogé est injoignable : les nouvelles requêtes échoueraient encore.",
      B: "Les collègues accèdent à l'intranet : le site fonctionne, le problème est propre à ce poste.",
      D: "La carte réseau émet bien des requêtes ; c'est l'adresse du serveur DNS qui est mauvaise.",
    },
    aRetenir: "`nslookup` indique quel serveur DNS le poste interroge : compare-le avec celui des postes qui fonctionnent.",
  },
  {
    id: 'SUP-NET-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'moyen',
    enonce:
      "Depuis une agence, plusieurs postes n'arrivent plus à joindre le portail d'un partenaire. Un `tracert` donne le résultat ci-dessous. Quelle conclusion transmets-tu à l'équipe réseau ?",
    extrait: {
      langage: 'shell',
      contenu: `C:\\> tracert portail.partenaire.example

Détermination de l'itinéraire vers portail.partenaire.example [203.0.113.80]
avec un maximum de 30 sauts :

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     3 ms     2 ms     3 ms  10.0.0.1
  3     *        *        *     Délai d'attente de la demande dépassé.
  4     *        *        *     Délai d'attente de la demande dépassé.
  5     *        *        *     Délai d'attente de la demande dépassé.`,
    },
    options: [
      { id: 'A', texte: "La carte réseau de chaque poste de l'agence est défaillante" },
      { id: 'B', texte: 'Le serveur DNS ne résout pas le nom du portail' },
      { id: 'C', texte: "Le portail du partenaire est forcément éteint, puisque son adresse ne répond pas" },
      { id: 'D', texte: "Le LAN et le routeur de l'agence répondent : la coupure est au-delà du 2e saut" },
    ],
    bonneReponse: 'D',
    explication:
      "Les deux premiers sauts (passerelle de l'agence puis 10.0.0.1) répondent, et le nom a bien été résolu en 203.0.113.80. Plus rien ne répond ensuite : le problème est en aval, côté lien WAN ou opérateur. Certains routeurs ignorent volontairement les requêtes de `tracert` ; c'est pourquoi on transmet la trace comme indice, sans conclusion définitive.",
    pourquoiPas: {
      A: "Les postes joignent leurs deux premiers sauts : leurs cartes réseau fonctionnent.",
      B: "La première ligne affiche l'adresse 203.0.113.80 : la résolution DNS a réussi.",
      C: "`tracert` ne permet pas d'affirmer que le serveur est éteint : le trafic s'arrête bien avant d'arriver jusqu'à lui.",
    },
    aRetenir: "`tracert` localise l'endroit où le chemin s'interrompt : le dernier saut qui répond borne la zone en panne.",
  },
  {
    id: 'SUP-NET-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'moyen',
    enonce:
      "De retour d'un séminaire à l'hôtel, une cadre branche son portable au bureau. Le Wi-Fi interne est connecté, Teams fonctionne, mais le navigateur affiche « Il y a un problème avec le serveur proxy » sur tous les sites. Ses collègues n'ont aucun problème. Que vérifies-tu en priorité ?",
    options: [
      { id: 'A', texte: "La carte Wi-Fi du portable, sans doute endommagée pendant le voyage" },
      { id: 'B', texte: "Le bail DHCP du portable, à renouveler avec `ipconfig /renew`" },
      { id: 'C', texte: 'Le cache du navigateur, à vider' },
      { id: 'D', texte: "Les paramètres de proxy de Windows sur le portable" },
    ],
    bonneReponse: 'D',
    explication:
      "Le message vise explicitement le proxy, et le poste a bien accès au réseau puisque d'autres applications fonctionnent. Les paramètres de proxy (Paramètres > Réseau et Internet > Proxy) ont souvent été modifiés pour se connecter ailleurs. On rétablit la configuration standard (détection automatique ou script de configuration de l'entreprise).",
    pourquoiPas: {
      A: "La carte Wi-Fi fonctionne : le poste est connecté et Teams communique.",
      B: "Le poste a déjà une adresse valide ; le message d'erreur porte sur le proxy, pas sur l'adressage.",
      C: "Vider le cache ne modifie pas le proxy utilisé pour sortir vers Internet.",
    },
    aRetenir: "Un message d'erreur précis oriente le diagnostic : « serveur proxy » = vérifier d'abord les paramètres de proxy.",
  },
  {
    id: 'SUP-NET-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'difficile',
    enonce:
      "Un agent en télétravail est connecté au VPN de la banque. Il joint les serveurs du réseau 10.20.0.0/16, mais pas le serveur de fichiers 192.168.1.20 de son agence. Chez lui, sa box distribue des adresses en 192.168.1.0/24. Quelle est l'explication la plus probable ?",
    options: [
      { id: 'A', texte: "Le pare-feu Windows du poste bloque le partage de fichiers sur le profil réseau public" },
      { id: 'B', texte: "Les plages se chevauchent : le trafic vers 192.168.1.20 reste sur le réseau domestique" },
      { id: 'C', texte: "Sa licence VPN ne donne accès qu'à une partie des serveurs internes de la banque" },
      { id: 'D', texte: "Le serveur DNS de la box ne connaît pas le nom du serveur de fichiers de l'agence" },
    ],
    bonneReponse: 'B',
    explication:
      "Le réseau domestique et le réseau de l'agence utilisent la même plage 192.168.1.0/24. Pour 192.168.1.20, le poste dispose d'une route directement connectée vers sa box et la préfère le plus souvent à la route du VPN : les paquets restent à la maison. Les autres réseaux internes, sans conflit, passent bien par le tunnel. On le confirme avec `route print` ; la solution durable consiste à éviter les plages courantes côté entreprise ou à adapter le profil VPN.",
    pourquoiPas: {
      A: "Le symptôme vise une adresse précise qui coïncide avec le réseau domestique ; un blocage local du partage de fichiers n'explique pas cette coïncidence.",
      C: "Rien n'indique une restriction par licence ; la coïncidence des plages d'adresses explique exactement le symptôme.",
      D: "Le test porte sur une adresse IP : la résolution de noms n'intervient pas.",
    },
    aRetenir: "VPN : si le réseau domestique utilise la même plage qu'un réseau interne, ces adresses internes deviennent injoignables.",
  },
  {
    id: 'SUP-NET-008',
    section: 'technique',
    filiere: 'support',
    competence: 'Dépannage réseau',
    difficulte: 'difficile',
    enonce:
      "Les copies de fichiers sont très lentes sur un seul poste. Sa carte réseau indique « Vitesse : 100 Mbit/s », alors que la carte et le port du commutateur sont Gigabit et que les postes voisins sont bien à 1 Gbit/s. Quelle est la cause la plus probable ?",
    options: [
      { id: 'A', texte: "Le pilote Wi-Fi du poste est obsolète et doit être mis à jour" },
      { id: 'B', texte: "Le serveur de fichiers est saturé par les sauvegardes de la journée" },
      { id: 'C', texte: "Le câble ou la prise est endommagé : le lien retombe en 100 Mbit/s" },
      { id: 'D', texte: "Le serveur DNS de la banque met trop de temps à répondre aux requêtes" },
    ],
    bonneReponse: 'C',
    explication:
      "Le Gigabit Ethernet sur cuivre (1000BASE-T) utilise les quatre paires du câble, alors que le Fast Ethernet (100BASE-TX) n'en utilise que deux. Si une paire est coupée ou mal sertie, la carte et le commutateur se rabattent souvent sur 100 Mbit/s. On teste avec un autre câble ou un testeur, puis on contrôle la prise murale.",
    pourquoiPas: {
      A: "Le poste est relié en filaire : le pilote Wi-Fi n'intervient pas dans ce lien.",
      B: "Un serveur saturé ralentirait tous les postes, et ne changerait pas la vitesse négociée par la carte réseau.",
      D: "Le DNS ne joue qu'au moment de la résolution du nom ; il n'influence ni le débit des copies ni la vitesse du lien.",
    },
    aRetenir: "Lien Gigabit négocié à 100 Mbit/s = suspecter d'abord le câble ou la prise (une des quatre paires).",
  },

  // ───────────────────────────── Messagerie & bureautique ─────────────────────────────
  {
    id: 'SUP-MSG-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'facile',
    enonce:
      "Outlook affiche à une agente : « Votre boîte aux lettres a atteint sa limite de taille. Vous ne pouvez plus envoyer de messages. » Quelle est la première solution à lui proposer ?",
    options: [
      { id: 'A', texte: "Lui créer un second compte de messagerie pour les nouveaux échanges" },
      { id: 'B', texte: "Réinstaller Outlook, dont le fichier de configuration est probablement corrompu" },
      { id: 'C', texte: "Désactiver le mode Exchange mis en cache pour libérer de l'espace" },
      { id: 'D', texte: "Vider les Éléments supprimés et archiver ou supprimer les messages volumineux" },
    ],
    bonneReponse: 'D',
    explication:
      "Le quota est fixé côté serveur : seule la réduction du volume de la boîte (ou une hausse du quota validée) débloque l'envoi. Trier par taille, vider les Éléments supprimés et archiver selon la politique de la banque règle la plupart des cas. Le dossier Éléments supprimés compte dans le quota tant qu'il n'est pas vidé.",
    pourquoiPas: {
      A: "Un second compte contourne la règle, disperse les échanges et complique l'archivage : ce n'est pas une solution.",
      B: "Le quota est géré par le serveur de messagerie : réinstaller le client ne change rien.",
      C: "Le mode mis en cache concerne la copie locale ; la taille de la boîte sur le serveur reste la même.",
    },
    aRetenir: "Boîte pleine : on réduit le volume (Éléments supprimés, pièces jointes lourdes, archivage) ; réinstaller le client ne sert à rien.",
  },
  {
    id: 'SUP-MSG-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'facile',
    enonce:
      "L'assistante d'un directeur doit créer, modifier et accepter des réunions dans l'agenda de celui-ci. Quelle est la bonne solution ?",
    options: [
      { id: 'A', texte: 'Le directeur lui communique son mot de passe' },
      { id: 'B', texte: "Le directeur lui accorde un accès délégué à son calendrier dans Outlook" },
      { id: 'C', texte: 'Une règle transfère toutes les invitations du directeur à son assistante' },
      { id: 'D', texte: "Le directeur exporte chaque soir son agenda au format ICS pour l'assistante" },
    ],
    bonneReponse: 'B',
    explication:
      "La délégation donne à l'assistante des droits sur l'agenda du directeur avec son propre compte : chaque action reste traçable et le mot de passe reste personnel. Le directeur peut choisir le niveau d'accès et le retirer à tout moment.",
    pourquoiPas: {
      A: "Un mot de passe est strictement personnel : le partager supprime toute traçabilité et viole les règles de sécurité.",
      C: "Recevoir une copie des invitations ne permet pas de gérer l'agenda du directeur.",
      D: "Un export ICS est une photographie figée en lecture seule, aussitôt périmée.",
    },
    aRetenir: "Gérer l'agenda d'un autre = délégation ou droits sur le calendrier, jamais le partage du mot de passe.",
  },
  {
    id: 'SUP-MSG-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'moyen',
    enonce:
      "À l'ouverture d'un fichier d'archives `.pst` ancien, Outlook signale que le fichier contient des erreurs et ne peut pas être ouvert. Que fais-tu ?",
    options: [
      { id: 'A', texte: "Sauvegarder le `.pst`, puis le réparer avec `scanpst.exe`" },
      { id: 'B', texte: "Lancer `sfc /scannow` pour réparer le fichier de données Outlook" },
      { id: 'C', texte: 'Supprimer le `.pst` et en créer un nouveau, vide' },
      { id: 'D', texte: 'Lancer `chkdsk /f` sur le disque, ce qui répare le contenu du fichier' },
    ],
    bonneReponse: 'A',
    explication:
      "`scanpst.exe`, fourni avec Outlook, analyse et répare la structure interne des fichiers `.pst` et `.ost`. On travaille toujours sur une copie sauvegardée au préalable, car la réparation peut écarter des éléments illisibles. Les éléments récupérés apparaissent ensuite, le cas échéant, dans un dossier « Éléments récupérés ».",
    pourquoiPas: {
      B: "SFC répare les fichiers système de Windows, pas les données d'un utilisateur.",
      C: "Supprimer le fichier détruit les archives de l'utilisateur sans aucune tentative de récupération.",
      D: "`chkdsk` corrige le système de fichiers du disque, pas la structure interne d'un fichier Outlook.",
    },
    aRetenir: "Fichier `.pst` endommagé : sauvegarde d'abord, puis `scanpst.exe`.",
  },
  {
    id: 'SUP-MSG-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'moyen',
    enonce:
      "Depuis hier, Outlook (en mode Exchange mis en cache) n'affiche plus les nouveaux messages d'un agent, alors qu'ils apparaissent bien dans le webmail de la banque. Quelle solution est adaptée ?",
    options: [
      { id: 'A', texte: "Restaurer la boîte aux lettres de l'agent depuis la sauvegarde de la nuit sur le serveur" },
      { id: 'B', texte: "Supprimer puis recréer le compte de l'agent dans l'annuaire" },
      { id: 'C', texte: "Renommer le fichier `.ost` pour qu'Outlook le reconstruise depuis le serveur" },
      { id: 'D', texte: 'Recréer la boîte aux lettres côté serveur' },
    ],
    bonneReponse: 'C',
    explication:
      "Le webmail prouve que les messages sont bien sur le serveur : le problème est local, dans la copie mise en cache (`.ost`). Ce fichier n'est qu'une copie synchronisée ; une fois renommé, Outlook en recrée un neuf depuis le serveur. Il faut prévoir le temps de resynchronisation pour les grosses boîtes.",
    pourquoiPas: {
      A: "Le serveur contient déjà les messages : une restauration est inutile et risquerait d'écraser des données récentes.",
      B: "Recréer le compte de l'annuaire est disproportionné et ferait perdre droits et historique, pour un problème local au poste.",
      D: "La boîte côté serveur fonctionne, comme le montre le webmail.",
    },
    aRetenir: "Webmail OK mais Outlook KO = problème côté client (souvent le `.ost`), pas côté serveur.",
  },
  {
    id: 'SUP-MSG-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'moyen',
    enonce:
      "M. Ilunga a été muté hier au service Trésorerie ; l'administrateur l'a ajouté au groupe qui donne accès au partage `\\\\fs01\\tresorerie`. Ce matin, sans avoir éteint son poste ni fermé sa session depuis hier, il obtient toujours « Accès refusé ». Que lui demandes-tu ?",
    options: [
      { id: 'A', texte: 'De vider le cache de son navigateur' },
      { id: 'B', texte: "De fermer puis rouvrir sa session Windows" },
      { id: 'C', texte: "D'attendre la réplication des données du serveur de fichiers, qui peut prendre une semaine" },
      { id: 'D', texte: 'De réinstaller le pilote de sa carte réseau' },
    ],
    bonneReponse: 'B',
    explication:
      "Les groupes d'un utilisateur sont inscrits dans son jeton d'accès au moment de l'ouverture de session. Tant qu'il garde la même session, le jeton ne contient pas le nouveau groupe et le serveur refuse l'accès. Une fermeture puis réouverture de session (ou un redémarrage) suffit généralement.",
    pourquoiPas: {
      A: "L'accès à un partage réseau Windows ne dépend pas du cache d'un navigateur.",
      C: "Les droits ne dépendent pas d'une réplication des fichiers, et un tel délai n'a rien de normal.",
      D: "Le message « Accès refusé » prouve que le serveur a été joint : le réseau fonctionne.",
    },
    aRetenir: "Nouveau groupe ajouté = fermer puis rouvrir la session pour mettre à jour le jeton d'accès.",
  },
  {
    id: 'SUP-MSG-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'moyen',
    enonce:
      "Une agente doit transmettre à un partenaire externe un dossier de 35 Mo ; son message est rejeté avec « Le message dépasse la taille maximale autorisée ». Que lui recommandes-tu ?",
    options: [
      { id: 'A', texte: "Découper le dossier en une dizaine de messages successifs plus légers" },
      { id: 'B', texte: "Demander au support de supprimer la limite de taille des messages pour son compte" },
      { id: 'C', texte: 'Envoyer le dossier depuis sa messagerie personnelle' },
      { id: 'D', texte: "Passer par l'outil de partage de fichiers approuvé par la banque" },
    ],
    bonneReponse: 'D',
    explication:
      "La limite de taille des messages protège les serveurs de messagerie ; les gros fichiers se partagent par un service approuvé, qui permet de restreindre l'accès au destinataire, de fixer une expiration et de garder une trace. C'est aussi la seule option qui respecte la confidentialité des données de la banque.",
    pourquoiPas: {
      A: "Multiplier les messages encombre les boîtes, risque d'être bloqué aussi et rend le dossier difficile à reconstituer.",
      B: "La limite est une règle de l'organisation ; la supprimer pour une personne crée une exception non justifiée.",
      C: "Faire sortir des données de la banque par une messagerie personnelle est une fuite de données, interdite.",
    },
    aRetenir: "Fichier trop lourd pour la messagerie : outil de partage approuvé, jamais une messagerie ou un service personnel.",
  },
  {
    id: 'SUP-MSG-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Messagerie & bureautique',
    difficulte: 'difficile',
    enonce:
      "Le fichier `Tresorerie_2026.xlsx`, sur un partage réseau, s'ouvre pour tout le monde en lecture seule avec le message « verrouillé pour modification par Jean Mbuyi ». Or M. Mbuyi est en congé depuis deux jours et son poste est éteint. Que fais-tu ?",
    options: [
      { id: 'A', texte: "Réinitialiser le mot de passe de M. Mbuyi pour fermer sa session à distance" },
      { id: 'B', texte: 'Copier le fichier sous un autre nom et demander à chacun de travailler sur sa propre copie' },
      { id: 'C', texte: 'Redémarrer le serveur de fichiers en pleine journée' },
      { id: 'D', texte: "Vérifier les fichiers ouverts sur le serveur, puis supprimer le fichier `~$` orphelin" },
    ],
    bonneReponse: 'D',
    explication:
      "Excel crée, à côté du classeur ouvert, un petit fichier propriétaire `~$…` contenant le nom de l'utilisateur ; s'il n'est pas supprimé (plantage, coupure), le classeur paraît encore verrouillé. On vérifie d'abord dans la console de gestion du serveur (Dossiers partagés > Fichiers ouverts) qu'aucune session ne tient le fichier, et on la ferme si besoin ; sinon, on supprime le fichier `~$` orphelin.",
    pourquoiPas: {
      A: "Changer le mot de passe ne ferme pas un fichier ouvert et ne supprime pas un fichier de verrou orphelin.",
      B: "Plusieurs copies divergentes d'un fichier de trésorerie créent des erreurs et des doublons difficiles à réconcilier.",
      C: "Redémarrer un serveur partagé coupe le travail de tous pour un problème qui se règle sur un seul fichier.",
    },
    aRetenir: "Classeur « verrouillé par » un absent : vérifier les fichiers ouverts sur le serveur, puis le fichier propriétaire `~$` orphelin.",
  },

  // ───────────────────────────── Comptes & accès ─────────────────────────────
  {
    id: 'SUP-ACC-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'facile',
    enonce:
      "Une personne appelle le support : « Je suis Mme Tshala, du service Crédit, j'ai oublié mon mot de passe et j'ai une réunion dans cinq minutes. » Que fais-tu avant de réinitialiser le mot de passe ?",
    options: [
      { id: 'A', texte: "Rien de plus : elle est pressée, connaît son service et le nom de son responsable" },
      { id: 'B', texte: "Vérifier son identité selon la procédure, par exemple en la rappelant au numéro interne" },
      { id: 'C', texte: "Lui demander son ancien mot de passe pour confirmer que c'est bien elle" },
      { id: 'D', texte: "Envoyer le nouveau mot de passe à l'adresse e-mail personnelle qu'elle vient d'indiquer" },
    ],
    bonneReponse: 'B',
    explication:
      "La réinitialisation de mot de passe est une cible classique d'ingénierie sociale : l'urgence invoquée est justement un levier de manipulation. On applique toujours la procédure de vérification d'identité, puis on impose un mot de passe temporaire à changer à la première connexion.",
    pourquoiPas: {
      A: "Un nom, un service ou le nom d'un responsable se trouvent facilement (organigramme, réseaux sociaux) : ce ne sont pas des preuves d'identité.",
      C: "Le support ne demande jamais un mot de passe, même ancien : c'est une mauvaise pratique que les fraudeurs exploitent.",
      D: "Une adresse personnelle donnée au téléphone n'est pas vérifiée : le mot de passe pourrait partir chez un fraudeur.",
    },
    aRetenir: "Pas de réinitialisation sans vérification d'identité selon la procédure, surtout quand on te presse.",
  },
  {
    id: 'SUP-ACC-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'facile',
    enonce:
      "Un agent affirme saisir le bon mot de passe, mais Windows affiche : « Le compte référencé est actuellement verrouillé et vous ne pourrez peut-être pas vous y connecter. » Que s'est-il passé ?",
    options: [
      { id: 'A', texte: "Les ressources humaines ont désactivé son compte ce matin à la suite d'une mutation" },
      { id: 'B', texte: 'Son mot de passe a expiré' },
      { id: 'C', texte: "Le seuil d'échecs de connexion fixé par la stratégie a été atteint" },
      { id: 'D', texte: "Son profil Windows est corrompu et empêche toute ouverture de session" },
    ],
    bonneReponse: 'C',
    explication:
      "Le verrouillage est automatique après un nombre d'échecs fixé par la stratégie de mots de passe ; tant qu'il dure, même le bon mot de passe est refusé. On déverrouille après vérification d'identité, puis on cherche l'origine des échecs (faute de frappe, ancien mot de passe enregistré quelque part, tentative malveillante).",
    pourquoiPas: {
      A: "Un compte désactivé produit un message différent (« Votre compte a été désactivé »).",
      B: "Un mot de passe expiré déclenche une demande de changement, pas un message de verrouillage.",
      D: "Un profil corrompu se manifeste après l'authentification (profil temporaire), pas par un refus de connexion.",
    },
    aRetenir: "Verrouillé (trop d'échecs), désactivé (décision administrative) et expiré (mot de passe trop ancien) sont trois situations différentes.",
  },
  {
    id: 'SUP-ACC-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'moyen',
    enonce:
      "Depuis qu'il a changé son mot de passe lundi, le compte de M. Mwamba se verrouille plusieurs fois par jour. Sur le contrôleur de domaine, tu trouves l'événement suivant. Quelle piste suivre en priorité ?",
    extrait: {
      langage: 'log',
      contenu: `ID de l'événement : 4740
Un compte d'utilisateur a été verrouillé.

Compte verrouillé :
    Nom du compte :                   pmwamba
Informations supplémentaires :
    Nom de l'ordinateur appelant :    PC-AGENCE-07`,
    },
    options: [
      { id: 'A', texte: 'Désactiver le seuil de verrouillage pour ce compte' },
      { id: 'B', texte: "Chercher sur PC-AGENCE-07 ce qui présente encore l'ancien mot de passe" },
      { id: 'C', texte: 'Réinitialiser à nouveau son mot de passe chaque fois que le compte se verrouille' },
      { id: 'D', texte: 'Remplacer le poste de M. Mwamba' },
    ],
    bonneReponse: 'B',
    explication:
      "L'événement 4740 indique l'ordinateur d'où proviennent les échecs. Après un changement de mot de passe, un verrouillage répété vient presque toujours d'un élément qui présente encore l'ancien mot de passe : session ouverte sur un autre poste, lecteur mappé avec des identifiants, Gestionnaire d'identification, téléphone configuré pour la messagerie. Si le poste appelant n'a aucun lien avec l'utilisateur, on alerte la sécurité.",
    pourquoiPas: {
      A: "Supprimer le verrouillage masque le symptôme et ouvre la porte aux attaques par essais de mots de passe.",
      C: "Tant que la source qui envoie l'ancien mot de passe existe, le compte se verrouillera à nouveau.",
      D: "Le journal désigne PC-AGENCE-07 : rien ne prouve que le poste habituel de l'agent soit en cause.",
    },
    aRetenir: "Verrouillages répétés : l'événement 4740 donne l'ordinateur appelant ; on y cherche l'ancien mot de passe encore utilisé.",
  },
  {
    id: 'SUP-ACC-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'moyen',
    enonce:
      "Un agent appelle : il a reçu sur son téléphone, à 2 h du matin, plusieurs demandes d'approbation de connexion (MFA) qu'il n'a pas déclenchées. Il les a toutes refusées. Que fais-tu ?",
    options: [
      { id: 'A', texte: "Lui conseiller d'approuver la prochaine demande pour que les notifications nocturnes cessent" },
      { id: 'B', texte: "Le traiter en incident de sécurité : changer le mot de passe, révoquer les sessions, alerter" },
      { id: 'C', texte: "Lui faire désinstaller l'application d'authentification" },
      { id: 'D', texte: "Le rassurer : il s'agit sans doute d'un bogue de l'application" },
    ],
    bonneReponse: 'B',
    explication:
      "Une demande MFA n'est envoyée qu'après la saisie d'un identifiant et d'un mot de passe corrects : quelqu'un d'autre connaît donc le mot de passe. L'envoi répété de notifications vise à obtenir une approbation par lassitude (« fatigue MFA »). L'agent a bien réagi ; on change le mot de passe, on révoque les sessions et on transmet à la sécurité pour analyse des connexions.",
    pourquoiPas: {
      A: "Approuver donnerait l'accès au compte à l'attaquant : c'est exactement le but de l'attaque.",
      C: "Sans application d'authentification, l'agent perd son second facteur sans que le mot de passe compromis soit changé.",
      D: "Des demandes non sollicitées à une heure inhabituelle sont un signal d'attaque, pas un bogue à ignorer.",
    },
    aRetenir: "Demande MFA non sollicitée = mot de passe probablement compromis : refuser, changer le mot de passe, signaler.",
  },
  {
    id: 'SUP-ACC-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'moyen',
    enonce:
      "Un analyste demande à devenir administrateur local de son poste « pour installer lui-même ses outils ». Quelle réponse respecte le principe du moindre privilège ?",
    options: [
      { id: 'A', texte: 'Ajouter son compte au groupe Administrateurs local de façon permanente' },
      { id: 'B', texte: "Lui communiquer le mot de passe du compte administrateur local commun à tous les postes" },
      { id: 'C', texte: "Désactiver le contrôle de compte d'utilisateur (UAC) sur son poste" },
      { id: 'D', texte: "Refuser les droits permanents et installer les outils validés via le catalogue" },
    ],
    bonneReponse: 'D',
    explication:
      "Le moindre privilège consiste à ne donner que les droits nécessaires à la tâche. Un compte administrateur permet d'installer n'importe quel logiciel, de désactiver des protections et décuple l'impact d'un logiciel malveillant. Le besoin réel (des outils précis) se traite par validation et déploiement contrôlé.",
    pourquoiPas: {
      A: "Des droits d'administration permanents exposent le poste et le réseau en cas d'hameçonnage ou de logiciel piégé.",
      B: "Un mot de passe administrateur partagé compromet tous les postes d'un coup et empêche toute traçabilité.",
      C: "Désactiver l'UAC affaiblit la sécurité du poste sans répondre au besoin de façon encadrée.",
    },
    aRetenir: "Moindre privilège : on répond au besoin (installer un outil validé), pas à la demande de droits d'administration.",
  },
  {
    id: 'SUP-ACC-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'moyen',
    enonce:
      "Les ressources humaines signalent qu'un agent quitte la Banque Alpha vendredi à 16 h. Quelle démarche est la bonne pour ses accès ?",
    options: [
      { id: 'A', texte: "Supprimer immédiatement son compte et sa boîte aux lettres dès réception de l'information des RH" },
      { id: 'B', texte: "Laisser son compte actif un mois pour qu'il puisse récupérer ses messages" },
      { id: 'C', texte: "Désactiver le compte à l'heure du départ, révoquer tous ses accès et récupérer son matériel" },
      { id: 'D', texte: 'Changer son mot de passe et le transmettre à son responsable' },
    ],
    bonneReponse: 'C',
    explication:
      "Au départ d'un employé, on coupe tous les accès au bon moment (pas avant, pour ne pas bloquer son travail, pas après, pour éviter un accès résiduel). La désactivation, plutôt que la suppression immédiate, préserve les données et l'historique le temps de les transférer selon la procédure de l'organisation.",
    pourquoiPas: {
      A: "Supprimer avant le départ bloque ses derniers jours de travail et détruit des données qui peuvent être utiles à son service.",
      B: "Un compte actif après le départ est un accès non maîtrisé, contraire à toutes les règles de sécurité.",
      D: "Le responsable utiliserait l'identité d'un autre : les actions ne seraient plus attribuables à la bonne personne.",
    },
    aRetenir: "Départ : désactiver à l'heure prévue, révoquer tous les accès, récupérer le matériel, transférer les données selon la procédure.",
  },
  {
    id: 'SUP-ACC-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Comptes & accès',
    difficulte: 'difficile',
    enonce:
      "Un ticket demande l'accès au dossier partagé « Trésorerie » pour un nouvel agent du service. Le dossier est protégé par des groupes de sécurité. Quelle façon de faire est la plus saine ?",
    options: [
      { id: 'A', texte: "Après accord du propriétaire des données, l'ajouter au groupe de son rôle" },
      { id: 'B', texte: "Ajouter directement le compte de l'agent dans les autorisations NTFS du dossier, en contrôle total" },
      { id: 'C', texte: "Copier tous les groupes d'un collègue du service (« donne-lui les mêmes droits que Paul »)" },
      { id: 'D', texte: "Donner au groupe « Tout le monde » l'accès en lecture au dossier pour éviter les prochaines demandes" },
    ],
    bonneReponse: 'A',
    explication:
      "Les droits sont attribués à des groupes qui représentent des rôles, et l'on gère ensuite les appartenances : c'est lisible, auditable et réversible. L'approbation du propriétaire des données garantit que l'accès est justifié. Les autorisations nominatives se multiplient vite et deviennent impossibles à contrôler.",
    pourquoiPas: {
      B: "Des droits nominatifs, de surcroît en contrôle total, contournent les groupes, accordent plus que nécessaire et compliquent les revues d'accès.",
      C: "Copier un collègue reproduit aussi ses accès accumulés au fil des années, dont certains ne concernent pas le nouvel agent.",
      D: "Ouvrir des données de trésorerie à tout le personnel viole le besoin d'en connaître.",
    },
    aRetenir: "Accès aux ressources : approbation du propriétaire + ajout au groupe du rôle, jamais de droits nominatifs ni de copie de profil.",
  },

  // ───────────────────────────── Gestion des incidents (ITIL) ─────────────────────────────
  {
    id: 'SUP-ITIL-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'facile',
    enonce:
      "Selon ITIL, comment classer le ticket d'une agente qui demande l'installation d'un second écran sur son poste, lequel fonctionne parfaitement ?",
    options: [
      { id: 'A', texte: 'Une demande de service' },
      { id: 'B', texte: 'Un incident' },
      { id: 'C', texte: 'Un problème' },
      { id: 'D', texte: "Un changement d'urgence" },
    ],
    bonneReponse: 'A',
    explication:
      "Un incident est une interruption non planifiée ou une dégradation d'un service. Ici, rien n'est en panne : l'agente demande une prestation standard prévue au catalogue, c'est une demande de service. La distinction compte, car les délais et circuits de validation diffèrent.",
    pourquoiPas: {
      B: "Le poste fonctionne : il n'y a ni interruption ni dégradation de service.",
      C: "Un problème est la cause, inconnue ou à éliminer, d'un ou plusieurs incidents ; aucun incident n'existe ici.",
      D: "Un changement d'urgence répond à une situation critique ; l'ajout d'un écran est une demande courante et planifiable.",
    },
    aRetenir: "Quelque chose est cassé = incident ; on demande quelque chose de prévu au catalogue = demande de service.",
  },
  {
    id: 'SUP-ITIL-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'facile',
    enonce:
      "Chaque lundi matin, l'imprimante du service Crédit se bloque ; le support la redémarre et l'incident est clos. Que faut-il ouvrir pour traiter la cause sous-jacente ?",
    options: [
      { id: 'A', texte: 'Un enregistrement de problème' },
      { id: 'B', texte: 'Un nouvel incident chaque lundi, clôturé après redémarrage' },
      { id: 'C', texte: 'Une demande de service' },
      { id: 'D', texte: 'Un changement standard' },
    ],
    bonneReponse: 'A',
    explication:
      "La gestion des incidents rétablit le service au plus vite (ici, le redémarrage). La gestion des problèmes cherche la cause racine des incidents récurrents pour les supprimer définitivement. L'enregistrement de problème est lié aux incidents concernés.",
    pourquoiPas: {
      B: "Redémarrer chaque semaine rétablit le service mais ne supprime jamais la cause : l'incident se répétera.",
      C: "Aucune prestation n'est demandée ; il s'agit d'une panne récurrente.",
      D: "Un changement viendra peut-être corriger la cause, mais seulement une fois celle-ci identifiée par la gestion des problèmes.",
    },
    aRetenir: "Incident = rétablir vite ; problème = trouver et supprimer la cause des incidents qui reviennent.",
  },
  {
    id: 'SUP-ITIL-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'facile',
    enonce:
      "Tu viens d'appliquer une solution sur le poste d'un agent qui ne pouvait plus se connecter à son application de caisse. Que fais-tu avant de clôturer le ticket ?",
    options: [
      { id: 'A', texte: "Le clôturer immédiatement : la solution appliquée est connue pour fonctionner" },
      { id: 'B', texte: "Le laisser ouvert un mois au cas où le problème reviendrait" },
      { id: 'C', texte: "Obtenir la confirmation de l'agent, puis documenter la solution" },
      { id: 'D', texte: "Le transférer au niveau 2 pour qu'il valide la solution appliquée" },
    ],
    bonneReponse: 'C',
    explication:
      "Un incident n'est résolu que lorsque l'utilisateur peut de nouveau travailler. La confirmation évite les fausses clôtures et les réouvertures. La documentation (cause, actions, solution) alimente la base de connaissances et la gestion des problèmes.",
    pourquoiPas: {
      A: "Sans vérification avec l'utilisateur, on risque de clôturer un incident non résolu et de dégrader la confiance dans le support.",
      B: "Un ticket ouvert inutilement fausse les indicateurs ; en cas de récidive, on rouvre ou on lie un nouvel incident.",
      D: "Le niveau 2 n'a pas à valider un incident que le niveau 1 a résolu lui-même.",
    },
    aRetenir: "Pas de clôture sans confirmation de l'utilisateur ni sans documentation de la solution.",
  },
  {
    id: 'SUP-ITIL-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'moyen',
    enonce:
      "La priorité des tickets est calculée avec la matrice ci-dessous. Le directeur d'agence ne parvient plus à ouvrir les fichiers PDF sur son poste ; il doit signer un rapport demain et peut utiliser en attendant le poste de son adjoint. Quelle priorité attribuer ?",
    extrait: {
      langage: 'texte',
      contenu: `                Urgence haute   Urgence moyenne   Urgence basse
Impact élevé         P1              P2                P3
Impact moyen         P2              P3                P4
Impact faible        P3              P4                P5

Impact  : élevé = agence ou service entier ; moyen = un groupe d'utilisateurs ; faible = un utilisateur
Urgence : haute = blocage immédiat de l'activité ; moyenne = échéance proche ou contournement ; basse = gêne mineure`,
    },
    options: [
      { id: 'A', texte: 'P4' },
      { id: 'B', texte: 'P1' },
      { id: 'C', texte: 'P2' },
      { id: 'D', texte: 'P3' },
    ],
    bonneReponse: 'A',
    explication:
      "Un seul utilisateur est touché : l'impact est faible. Une échéance existe mais un contournement est disponible : l'urgence est moyenne. La matrice donne P4. Le rang hiérarchique du demandeur ne modifie pas la priorité par lui-même ; si l'organisation prévoit un traitement des personnes clés, il est formalisé dans la procédure.",
    pourquoiPas: {
      B: "P1 correspond à un impact élevé avec une urgence haute, comme une agence entière bloquée.",
      C: "P2 exige un impact élevé ou moyen : ici, une seule personne est concernée.",
      D: "P3 correspondrait à un impact faible avec une urgence haute ; or un contournement existe.",
    },
    aRetenir: "Priorité = impact × urgence, appliquée avec la matrice, quel que soit le titre du demandeur.",
  },
  {
    id: 'SUP-ITIL-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'moyen',
    enonce:
      "Situation 1 : au niveau 1, tu transfères un incident de routage à l'équipe réseau, faute de compétences et d'accès pour le résoudre. Situation 2 : un incident P1 risque de dépasser son délai de résolution et tu en informes ton responsable. Quels types d'escalade sont-ce ?",
    options: [
      { id: 'A', texte: 'Deux escalades fonctionnelles' },
      { id: 'B', texte: 'Deux escalades hiérarchiques' },
      { id: 'C', texte: '1 : hiérarchique ; 2 : fonctionnelle' },
      { id: 'D', texte: '1 : fonctionnelle ; 2 : hiérarchique' },
    ],
    bonneReponse: 'D',
    explication:
      "L'escalade fonctionnelle transfère le ticket vers une équipe plus spécialisée, qui a les compétences ou les accès nécessaires. L'escalade hiérarchique fait remonter l'information vers un responsable, pour arbitrer, mobiliser des moyens ou gérer un risque de non-respect d'un engagement.",
    pourquoiPas: {
      A: "Informer un responsable d'un risque de dépassement n'est pas transférer à une équipe technique : c'est hiérarchique.",
      B: "Transférer à l'équipe réseau pour une question de compétences est fonctionnel.",
      C: "C'est l'inverse : la compétence technique relève de l'escalade fonctionnelle, l'autorité de l'escalade hiérarchique.",
    },
    aRetenir: "Fonctionnelle = vers plus de compétences ; hiérarchique = vers plus d'autorité.",
  },
  {
    id: 'SUP-ITIL-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'difficile',
    enonce:
      "Un ticket P2 doit être résolu en 8 heures ouvrées. Les heures ouvrées vont de 8 h à 16 h, du lundi au vendredi, et le décompte est suspendu quand le ticket est « en attente utilisateur ». Quelle est l'échéance de résolution ?",
    extrait: {
      langage: 'texte',
      contenu: `Ticket INC-20418   Priorité : P2   Objectif de résolution : 8 h ouvrées
Jeudi    14:00  Ouverture du ticket
Vendredi 09:00  Statut « en attente utilisateur » (l'agente est en réunion)
Vendredi 10:00  Retour de l'agente, statut « en cours »`,
    },
    options: [
      { id: 'A', texte: 'Vendredi 14 h 00' },
      { id: 'B', texte: 'Vendredi 15 h 00' },
      { id: 'C', texte: 'Jeudi 22 h 00' },
      { id: 'D', texte: 'Lundi 9 h 00' },
    ],
    bonneReponse: 'B',
    explication:
      "Jeudi, de 14 h à 16 h : 2 heures ouvrées consommées, il en reste 6. Vendredi, de 8 h à 9 h : 1 heure (il en reste 5). La pause de 9 h à 10 h ne compte pas. À partir de 10 h, les 5 heures restantes mènent à 15 h 00.",
    pourquoiPas: {
      A: "Vendredi 14 h serait l'échéance sans la suspension d'une heure pendant l'attente utilisateur.",
      C: "Jeudi 22 h revient à compter 8 heures d'horloge, en ignorant les heures ouvrées.",
      D: "Le délai ne déborde pas sur le lundi : il reste assez d'heures ouvrées le vendredi.",
    },
    aRetenir: "Un SLA se calcule en heures ouvrées, en retirant les périodes où le ticket est suspendu.",
  },
  {
    id: 'SUP-ITIL-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'moyen',
    enonce:
      "La cause d'un problème a été identifiée (un correctif applicatif est attendu de l'éditeur) et un contournement a été documenté pour le support. Comment ITIL appelle-t-il ce problème à ce stade ?",
    options: [
      { id: 'A', texte: 'Un incident majeur' },
      { id: 'B', texte: 'Une demande de changement' },
      { id: 'C', texte: 'Un événement' },
      { id: 'D', texte: 'Une erreur connue' },
    ],
    bonneReponse: 'D',
    explication:
      "Une erreur connue est un problème analysé dont la cause est identifiée, avec ou sans contournement, mais pas encore définitivement corrigé. Le contournement est publié dans la base de connaissances : le niveau 1 peut rétablir le service rapidement en attendant le correctif.",
    pourquoiPas: {
      A: "Un incident majeur désigne une interruption à fort impact, qui exige une procédure de crise ; ce n'est pas un état de problème.",
      B: "La demande de changement viendra éventuellement pour déployer le correctif, mais ne désigne pas le problème lui-même.",
      C: "Un événement est un changement d'état détecté (alerte de supervision, par exemple), sans lien avec l'analyse d'une cause.",
    },
    aRetenir: "Erreur connue = cause identifiée + contournement documenté, correctif définitif pas encore appliqué.",
  },
  {
    id: 'SUP-ITIL-008',
    section: 'technique',
    filiere: 'support',
    competence: 'Gestion des incidents (ITIL)',
    difficulte: 'difficile',
    enonce:
      "Entre 8 h 05 et 8 h 20, le support reçoit 37 appels d'agents de plusieurs agences : « la messagerie ne s'ouvre plus ». Quelle réaction du niveau 1 est la bonne ?",
    options: [
      { id: 'A', texte: "Créer un incident principal, y lier les tickets et lancer la procédure d'incident majeur" },
      { id: 'B', texte: 'Traiter chaque appel séparément en redémarrant Outlook sur chaque poste' },
      { id: 'C', texte: "Attendre une heure pour voir si le service revient de lui-même avant d'agir" },
      { id: 'D', texte: "Ouvrir un enregistrement de problème et clôturer immédiatement les 37 tickets reçus ce matin" },
    ],
    bonneReponse: 'A',
    explication:
      "Des signalements identiques et simultanés depuis plusieurs sites désignent une panne centrale, pas 37 pannes de postes. On regroupe les tickets sous un incident principal, on applique la procédure d'incident majeur (escalade, coordination) et l'on communique rapidement pour réduire les appels entrants. Les tickets liés sont clos avec l'incident principal, après rétablissement confirmé.",
    pourquoiPas: {
      B: "Intervenir poste par poste mobilise le support sans agir sur la cause commune, et retarde l'escalade.",
      C: "Attendre sans escalader prolonge une interruption à fort impact ; le temps est déterminant dans un incident majeur.",
      D: "Le problème viendra après ; on ne clôture pas des incidents tant que le service n'est pas rétabli.",
    },
    aRetenir: "Nombreux appels identiques et simultanés = un incident principal, la procédure d'incident majeur et une communication rapide.",
  },

  // ───────────────────────────── Sécurité au poste de travail ─────────────────────────────
  {
    id: 'SUP-SEC-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'facile',
    enonce:
      "Un agent a trouvé sur le parking une clé USB étiquetée « Salaires 2026 » et te l'apporte. Que fais-tu ?",
    options: [
      { id: 'A', texte: 'La brancher sur un poste du support pour identifier son propriétaire' },
      { id: 'B', texte: "Ne la brancher nulle part et la remettre à l'équipe sécurité" },
      { id: 'C', texte: "La brancher sur ton ordinateur personnel, qui n'est pas relié au réseau de la banque" },
      { id: 'D', texte: 'La formater sur un poste pour la réutiliser' },
    ],
    bonneReponse: 'B',
    explication:
      "Une clé abandonnée avec une étiquette alléchante est une technique d'attaque classique : elle peut contenir un logiciel malveillant ou se faire passer pour un clavier qui tape des commandes dès son branchement. On ne la branche pas, on la confie à l'équipe sécurité, qui l'analyse dans un environnement isolé.",
    pourquoiPas: {
      A: "La brancher sur un poste du réseau, même au support, suffit à exécuter une charge malveillante.",
      C: "Un poste personnel peut être compromis à son tour, et il est ensuite souvent utilisé pour le travail.",
      D: "Pour la formater, il faut la brancher : le risque est le même, et la preuve est détruite.",
    },
    aRetenir: "Clé USB inconnue : on ne la branche jamais, on la remet à la sécurité.",
  },
  {
    id: 'SUP-SEC-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'facile',
    enonce:
      "Une guichetière doit s'absenter cinq minutes de son poste, au contact du public. Quel est le bon réflexe ?",
    options: [
      { id: 'A', texte: "Éteindre l'écran avec son bouton" },
      { id: 'B', texte: 'Réduire toutes les fenêtres avec Windows + D' },
      { id: 'C', texte: 'Verrouiller la session avec Windows + L' },
      { id: 'D', texte: "Compter sur l'écran de veille, qui se déclenche au bout de 15 minutes" },
    ],
    bonneReponse: 'C',
    explication:
      "Windows + L verrouille immédiatement la session : il faut le mot de passe (ou le code) pour revenir, et les applications restent ouvertes. Le verrouillage automatique n'est qu'un filet de sécurité, pas un substitut au geste manuel.",
    pourquoiPas: {
      A: "Éteindre l'écran ne protège rien : il suffit de le rallumer pour accéder à la session ouverte.",
      B: "Réduire les fenêtres les cache seulement ; un clic les rouvre.",
      D: "Pendant 15 minutes, n'importe qui peut utiliser la session, et donc l'identité, de la guichetière.",
    },
    aRetenir: "Dès qu'on quitte son poste : Windows + L.",
  },
  {
    id: 'SUP-SEC-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'moyen',
    enonce:
      "Une agente te rapporte : « Un technicien du support m'a appelée ; il dit qu'il migre mon compte et m'a demandé de lui lire le code que je viens de recevoir par SMS. » Elle ne l'a pas encore fait. Que fais-tu ?",
    options: [
      { id: 'A', texte: 'Lui dire de rappeler ce technicien et de lui donner le code pour ne pas retarder la migration' },
      { id: 'B', texte: "Lui dire de ne jamais donner ce code et signaler la tentative" },
      { id: 'C', texte: "Lui demander de transférer ce SMS au support pour qu'il soit vérifié" },
      { id: 'D', texte: "Ignorer l'appel : puisqu'elle n'a rien donné, il n'y a rien à faire" },
    ],
    bonneReponse: 'B',
    explication:
      "C'est une attaque par « faux technicien » : un code reçu par SMS n'est envoyé qu'après la saisie de son identifiant et de son mot de passe, ce qui suggère qu'ils sont déjà connus de l'attaquant. Le vrai support ne demande jamais de mot de passe ni de code. On signale la tentative à la sécurité, qui vérifie les connexions, fait changer le mot de passe et prévient les autres collègues.",
    pourquoiPas: {
      A: "Communiquer le code donnerait le compte à l'attaquant.",
      C: "Un code d'authentification ne doit circuler vers personne, pas même vers le support.",
      D: "Le mot de passe est probablement compromis et l'attaquant peut viser d'autres agents : il faut signaler et agir.",
    },
    aRetenir: "Le support ne demande jamais un mot de passe ou un code : toute demande de ce type est suspecte et se signale.",
  },
  {
    id: 'SUP-SEC-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'moyen',
    enonce:
      "Un agent transfère au support le message ci-dessous et demande s'il doit cliquer. La banque utilise le domaine `banque-alpha.example`. Quel indice prouve le mieux qu'il s'agit d'hameçonnage ?",
    extrait: {
      langage: 'texte',
      contenu: `De      : Service Informatique <support@banque-alpha-securite.example>
Objet   : [URGENT] Votre boîte sera désactivée sous 24 h

Bonjour,
Suite à une mise à jour de sécurité, confirmez votre mot de passe :
  Lien affiché : https://webmail.banque-alpha.example
  Lien réel (au survol) : https://banque-alpha.example.verif-compte.example/login

Service Informatique`,
    },
    options: [
      { id: 'A', texte: "L'objet du message est écrit en majuscules" },
      { id: 'B', texte: "Le message n'est signé d'aucun nom de personne" },
      { id: 'C', texte: "Les domaines de l'expéditeur et du lien réel ne sont pas celui de la banque" },
      { id: 'D', texte: "Le message est arrivé dans la boîte de réception principale et non dans les courriers indésirables" },
    ],
    bonneReponse: 'C',
    explication:
      "Le domaine `banque-alpha-securite.example` n'est pas celui de la banque, et le lien réel mène vers `verif-compte.example` : dans une adresse, c'est la fin du nom de domaine qui compte, pas le début. L'urgence et la demande de mot de passe sont des signaux d'alerte supplémentaires. On ne clique pas et on signale le message à la sécurité.",
    pourquoiPas: {
      A: "Des majuscules évoquent la pression, mais de vrais messages internes en contiennent aussi : ce n'est pas une preuve.",
      B: "Une signature générique est fréquente, y compris dans des messages légitimes.",
      D: "Les messages d'hameçonnage passent régulièrement les filtres : l'arrivée en boîte de réception ne prouve rien.",
    },
    aRetenir: "Vérifie le domaine réel de l'expéditeur et du lien (au survol), en lisant la fin du nom de domaine.",
  },
  {
    id: 'SUP-SEC-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'moyen',
    enonce:
      "Un agent avoue avoir cliqué sur un lien reçu par e-mail et saisi son identifiant et son mot de passe sur une page qui ressemblait au webmail de la banque. L'antivirus n'a rien signalé. Que fais-tu ?",
    options: [
      { id: 'A', texte: "Rien : l'antivirus n'a rien détecté, donc le poste est sain" },
      { id: 'B', texte: 'Supprimer le message et ne pas en parler pour ne pas inquiéter le service' },
      { id: 'C', texte: "Faire changer le mot de passe, révoquer ses sessions et signaler à la sécurité" },
      { id: 'D', texte: "Lancer une analyse antivirus complète et clôturer le ticket si elle ne trouve rien" },
    ],
    bonneReponse: 'C',
    explication:
      "Le risque principal n'est pas un virus sur le poste mais le vol des identifiants : l'attaquant peut se connecter à distance. On change le mot de passe sans attendre, on révoque les sessions actives et on alerte la sécurité, qui recherche d'autres victimes du même message. Une règle de transfert discrète est une méthode courante pour continuer à lire les messages de la victime.",
    pourquoiPas: {
      A: "Un antivirus ne détecte pas la saisie d'un mot de passe sur un faux site : l'absence d'alerte ne signifie pas l'absence d'incident.",
      B: "Taire l'incident laisse l'attaquant utiliser le compte et empêche de protéger les autres destinataires.",
      D: "L'analyse ne traite pas le vol d'identifiants : le mot de passe resterait entre les mains de l'attaquant.",
    },
    aRetenir: "Identifiants saisis sur une fausse page : changer le mot de passe, révoquer les sessions, signaler, vérifier les règles de messagerie.",
  },
  {
    id: 'SUP-SEC-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'moyen',
    enonce:
      "Lors d'une intervention, tu constates qu'un agent a installé un convertisseur PDF gratuit téléchargé sur un site inconnu. « Il marche très bien », dit-il. Quelle est la bonne attitude ?",
    options: [
      { id: 'A', texte: "Le laisser installé, puisqu'il répond à un vrai besoin métier de l'agent" },
      { id: 'B', texte: "Ajouter toi-même le logiciel à la liste des logiciels autorisés du parc" },
      { id: 'C', texte: "Lui donner les droits d'administrateur pour qu'il puisse le mettre à jour lui-même" },
      { id: 'D', texte: "Désinstaller le logiciel selon la politique et proposer l'outil PDF approuvé" },
    ],
    bonneReponse: 'D',
    explication:
      "Un logiciel non autorisé, issu d'une source inconnue, peut contenir des composants malveillants, envoyer des documents à l'extérieur et n'est pas suivi par les mises à jour de sécurité. On applique la politique de la banque, sans reproche excessif, et on répond au besoin réel avec un outil validé.",
    pourquoiPas: {
      A: "Le fait qu'il fonctionne ne dit rien de ce qu'il fait d'autre en arrière-plan.",
      B: "L'autorisation d'un logiciel relève d'un processus de validation, pas de la décision d'un technicien sur place.",
      C: "Donner des droits d'administration augmente le risque au lieu de le réduire.",
    },
    aRetenir: "Logiciel non autorisé : appliquer la politique (retrait, analyse, signalement) et proposer l'outil approuvé.",
  },
  {
    id: 'SUP-SEC-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Sécurité au poste de travail',
    difficulte: 'difficile',
    enonce:
      "Un agent appelle : il n'a plus aucun accès réseau. Dans la console de l'EDR (protection des postes), tu vois l'alerte ci-dessous. L'agent assure que le fichier est une facture légitime d'un fournisseur. Que fais-tu ?",
    extrait: {
      langage: 'log',
      contenu: `Gravité   : Élevée
Poste     : PC-COMPTA-12
Détection : Comportement de type rançongiciel (chiffrement massif de fichiers)
Fichier   : C:\\Users\\akasongo\\Downloads\\Facture_0925.pdf.exe
Actions   : Processus arrêté | Fichier en quarantaine | Poste isolé du réseau`,
    },
    options: [
      { id: 'A', texte: "Lever l'isolement pour qu'il puisse travailler, puis lancer une analyse complète" },
      { id: 'B', texte: "Restaurer le fichier depuis la quarantaine, puisque l'agent affirme qu'il est légitime" },
      { id: 'C', texte: "Réinstaller immédiatement Windows sur le poste pour éliminer la menace" },
      { id: 'D', texte: "Laisser le poste isolé et allumé, et escalader à l'équipe sécurité" },
    ],
    bonneReponse: 'D',
    explication:
      "La double extension `.pdf.exe` et la détection comportementale de chiffrement désignent un rançongiciel, et non une facture. L'isolement réseau empêche la propagation : c'est à l'équipe sécurité de mener l'analyse et de décider de la remédiation. Garder le poste allumé préserve des traces utiles à l'enquête ; l'agent reprend son travail sur un autre poste.",
    pourquoiPas: {
      A: "Lever l'isolement pourrait permettre au code malveillant de chiffrer des partages réseau ou de se propager.",
      B: "Un exécutable déguisé en PDF n'est pas une facture ; la parole de l'utilisateur ne remplace pas l'analyse.",
      C: "Réinstaller dans l'urgence détruit les preuves nécessaires pour comprendre l'attaque et savoir si d'autres postes sont touchés.",
    },
    aRetenir: "Poste isolé par l'EDR : on ne lève pas l'isolement, on n'efface pas les traces, on escalade à la sécurité.",
  },

  // ───────────────────────────── Relation utilisateur ─────────────────────────────
  {
    id: 'SUP-REL-001',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'facile',
    enonce:
      "Un agent explique son problème de façon confuse pendant plusieurs minutes. Quelle technique t'assure que tu as bien compris avant d'agir ?",
    options: [
      { id: 'A', texte: "Reformuler ce que tu as compris et lui demander de confirmer" },
      { id: 'B', texte: "L'interrompre pour lui demander d'aller directement à l'essentiel" },
      { id: 'C', texte: 'Lancer tout de suite une prise en main à distance pour voir par toi-même' },
      { id: 'D', texte: 'Lui envoyer un formulaire écrit à remplir' },
    ],
    bonneReponse: 'A',
    explication:
      "La reformulation vérifie la compréhension, montre à l'utilisateur qu'il a été écouté et lui permet de corriger un malentendu. Elle évite de partir sur une mauvaise piste et fait gagner du temps sur l'ensemble du traitement.",
    pourquoiPas: {
      B: "Couper la parole crispe l'échange et fait perdre des détails parfois décisifs.",
      C: "Sans savoir ce qu'il faut chercher, la prise en main risque d'être longue et intrusive.",
      D: "Renvoyer vers un formulaire alors que l'agent est en ligne retarde la résolution et donne une impression de rejet.",
    },
    aRetenir: "Reformuler avant d'agir : on vérifie, on rassure, on évite les fausses pistes.",
  },
  {
    id: 'SUP-REL-002',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'facile',
    enonce:
      "Tu dois expliquer à une guichetière pourquoi son poste doit redémarrer pour appliquer une mise à jour. Quelle formulation est la plus adaptée ?",
    options: [
      { id: 'A', texte: "« Le correctif cumulatif doit remplacer des DLL système verrouillées par des processus en cours d'exécution. »" },
      { id: 'B', texte: "« Une mise à jour de sécurité demande un redémarrage de deux minutes. Pouvez-vous enregistrer votre travail ? »" },
      { id: 'C', texte: "« C'est technique, faites-moi confiance et redémarrez. »" },
      { id: 'D', texte: "« Le service Windows Update a besoin d'un reboot pour finaliser l'opération en attente. »" },
    ],
    bonneReponse: 'B',
    explication:
      "Un bon message dit à l'utilisateur ce qui se passe, pourquoi c'est utile pour lui, combien de temps cela prend et ce qu'il doit faire, sans jargon. On obtient ainsi sa coopération plutôt qu'une simple obéissance.",
    pourquoiPas: {
      A: "Le vocabulaire technique est exact mais incompréhensible pour l'utilisatrice, qui ne sait ni pourquoi ni combien de temps.",
      C: "Refuser d'expliquer crée de la méfiance et ne dit pas d'enregistrer son travail.",
      D: "Les anglicismes et le jargon (« reboot », « service ») n'aident pas l'utilisatrice et n'annoncent ni durée ni action à faire.",
    },
    aRetenir: "Parler utilisateur : quoi, pourquoi, combien de temps, que faire — sans jargon.",
  },
  {
    id: 'SUP-REL-003',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'moyen',
    enonce:
      "Un chef de guichet appelle, très énervé : son application de caisse est bloquée et une file de clients s'allonge. Il hausse le ton. Quelle attitude adopter ?",
    options: [
      { id: 'A', texte: "Lui dire calmement que tu raccrocheras s'il continue à hausser le ton" },
      { id: 'B', texte: 'Lui promettre que ce sera réglé dans cinq minutes pour le calmer' },
      { id: 'C', texte: "Lui expliquer que la panne vient de l'équipe applicative et que le support n'y est pour rien" },
      { id: 'D', texte: "L'écouter, reconnaître la gêne, puis annoncer la prochaine étape et l'heure du rappel" },
    ],
    bonneReponse: 'D',
    explication:
      "La colère vise la situation, pas le technicien : l'écoute et la reconnaissance de la gêne font baisser la tension. On revient ensuite aux faits, et l'on s'engage sur ce que l'on maîtrise : la prochaine action et le prochain point de contact. Une limite ferme reste possible face à des insultes, mais ce n'est pas la première réponse.",
    pourquoiPas: {
      A: "Menacer d'emblée fait monter la tension ; on recadre seulement si l'échange devient injurieux.",
      B: "Une promesse de délai non maîtrisée, non tenue, aggrave la colère et la défiance.",
      C: "Rejeter la faute sur une autre équipe n'aide pas l'utilisateur et donne une mauvaise image du service informatique.",
    },
    aRetenir: "Utilisateur en colère : écouter, reconnaître, revenir aux faits, s'engager sur la prochaine étape (pas sur un délai irréaliste).",
  },
  {
    id: 'SUP-REL-004',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'moyen',
    enonce:
      "Un directeur passe au support et exige que tu installes tout de suite un logiciel de retouche photo sur son poste, avant les tickets en attente, dont un P2 qui bloque une agence. Que fais-tu ?",
    options: [
      { id: 'A', texte: "Interrompre le traitement du P2 et installer le logiciel immédiatement, vu le rang du demandeur" },
      { id: 'B', texte: "Enregistrer sa demande, expliquer la priorisation, proposer un créneau ou un arbitrage" },
      { id: 'C', texte: 'Refuser sèchement : il doit passer par le portail comme tout le monde' },
      { id: 'D', texte: "Lui donner les droits d'administrateur pour qu'il installe le logiciel lui-même" },
    ],
    bonneReponse: 'B',
    explication:
      "La priorisation repose sur l'impact et l'urgence, et un blocage d'agence passe avant une installation de confort. On l'explique avec respect et on propose une solution concrète (ticket, créneau). L'arbitrage d'un désaccord avec un cadre relève du responsable du support : c'est une escalade hiérarchique normale.",
    pourquoiPas: {
      A: "Laisser une agence bloquée pour une installation non urgente fait passer le rang avant l'impact sur l'activité.",
      C: "Le fond est juste mais la forme braque l'interlocuteur et nuit à l'image du support.",
      D: "Les droits d'administration ne se distribuent pas pour gagner du temps ; le logiciel doit aussi être validé.",
    },
    aRetenir: "Face à une pression hiérarchique : courtoisie, ticket, explication de la priorité, et arbitrage par le responsable si besoin.",
  },
  {
    id: 'SUP-REL-005',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'moyen',
    enonce:
      "Le ticket d'une agente attend depuis trois jours une pièce commandée chez le fournisseur. Elle rappelle, agacée : personne ne lui a donné de nouvelles. Quelle pratique aurait évité cette situation ?",
    options: [
      { id: 'A', texte: "Clôturer le ticket et en ouvrir un nouveau à l'arrivée de la pièce" },
      { id: 'B', texte: "Attendre qu'elle relance pour lui donner des nouvelles" },
      { id: 'C', texte: "L'informer de façon proactive et lui proposer un poste de prêt" },
      { id: 'D', texte: "Transférer le ticket au fournisseur pour qu'il la contacte directement" },
    ],
    bonneReponse: 'C',
    explication:
      "Un ticket en attente reste sous la responsabilité du support : l'utilisateur doit savoir pourquoi il attend et jusqu'à quand. Des mises à jour régulières et un contournement réduisent l'impact et les relances. Le statut « en attente fournisseur » doit être visible dans le ticket.",
    pourquoiPas: {
      A: "Clôturer un incident non résolu fausse le suivi et fait perdre l'historique.",
      B: "Attendre la relance de l'utilisateur, c'est précisément ce qui a provoqué son mécontentement.",
      D: "Le support reste l'interlocuteur unique de l'utilisateur ; le fournisseur n'a pas à gérer la relation interne.",
    },
    aRetenir: "Un ticket en attente se suit activement : information proactive, mise à jour, contournement.",
  },
  {
    id: 'SUP-REL-006',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'moyen',
    enonce:
      "Tu reçois le ticket ci-dessous. Quelles informations recueilles-tu en priorité auprès de l'utilisateur ?",
    extrait: {
      langage: 'texte',
      contenu: `Ticket INC-20577
Demandeur : B. Ngoy (Agence de Limete)
Objet     : PC marche pas
Description : URGENT. Rien ne marche. Faites vite.`,
    },
    options: [
      { id: 'A', texte: "Le symptôme exact, depuis quand, ce qui a changé et combien de personnes sont touchées" },
      { id: 'B', texte: 'Uniquement son mot de passe, pour tester toi-même sur son poste' },
      { id: 'C', texte: 'La marque et le prix de son ordinateur' },
      { id: 'D', texte: "Rien : tu envoies directement un technicien sur site sans appeler l'utilisateur au préalable" },
    ],
    bonneReponse: 'A',
    explication:
      "Ces questions déterminent l'impact et l'urgence (donc la priorité) et orientent le diagnostic : un message d'erreur précis vaut souvent plusieurs minutes de recherche, et la question « qu'est-ce qui a changé ? » désigne fréquemment la cause. Le ticket est complété avec les réponses.",
    pourquoiPas: {
      B: "On ne demande jamais le mot de passe d'un utilisateur.",
      C: "Le prix n'aide pas au diagnostic ; l'identifiant du poste figure en général dans l'inventaire.",
      D: "Se déplacer sans qualifier la demande peut faire perdre beaucoup de temps si le problème est ailleurs (compte, réseau, application centrale).",
    },
    aRetenir: "Qualifier un ticket : quoi exactement, depuis quand, qu'est-ce qui a changé, combien de personnes, quel contournement.",
  },
  {
    id: 'SUP-REL-007',
    section: 'technique',
    filiere: 'support',
    competence: 'Relation utilisateur',
    difficulte: 'difficile',
    enonce:
      "La responsable des ressources humaines te signale un problème d'Excel ; elle travaille sur le fichier des salaires. Une prise en main à distance est nécessaire. Comment procèdes-tu ?",
    options: [
      { id: 'A', texte: "Prendre la main en mode invisible pendant sa réunion pour ne pas la déranger" },
      { id: 'B', texte: 'Lui demander son mot de passe pour intervenir ce soir dans sa session, quand elle sera partie' },
      { id: 'C', texte: "Obtenir son accord, faire fermer les documents sensibles et tracer l'intervention" },
      { id: 'D', texte: 'Copier le fichier des salaires sur ton poste pour reproduire le problème tranquillement' },
    ],
    bonneReponse: 'C',
    explication:
      "Une prise en main à distance donne accès à tout ce qui s'affiche : elle se fait avec le consentement de l'utilisateur, en sa présence de préférence, et en limitant l'exposition des données sensibles. Annoncer ses actions et tracer l'intervention protège à la fois l'utilisatrice et le technicien.",
    pourquoiPas: {
      A: "Une prise en main sans consentement ni présence de l'utilisatrice est une intrusion, même avec de bonnes intentions.",
      B: "Le mot de passe est personnel : intervenir sous l'identité d'une autre personne rend les actions inattribuables.",
      D: "Copier des données de paie hors de leur emplacement prévu est une fuite de données, même en interne.",
    },
    aRetenir: "Prise en main à distance : consentement, données sensibles fermées, actions annoncées, intervention tracée.",
  },
];
