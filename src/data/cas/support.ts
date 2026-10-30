// Cas pratiques — filière Support IT (préfixe SUP).
// Scénarios entièrement fictifs (« Banque Alpha », adresses privées et de documentation, domaines .example) :
// priorisation ITIL, dépannage réseau par couches, ingénierie sociale, arrivées et départs.

import type { CasPratique } from '@/lib/types';

export const casSupport: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // SUP-CAS-01 — Lundi matin : huit tickets, une seule priorité absolue
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SUP-CAS-01',
    filiere: 'support',
    titre: 'Lundi 8h : huit tickets, une seule urgence absolue',
    role: 'Technicien support niveau 1 — Centre de services, Banque Alpha',
    heure: 'Lundi 08h05',
    enjeu:
      'Prioriser la file d’attente du lundi matin selon la matrice impact × urgence, sans céder à la pression et sans laisser filer un incident de sécurité.',
    contexte:
      'Tu prends ton poste au centre de services de Banque Alpha (banque fictive). Pendant le week-end, la file d’attente s’est remplie : huit tickets t’attendent et ton collègue de niveau 1 n’arrive qu’à 10h00. La procédure du centre de services impose de classer chaque incident avec la matrice impact × urgence, et de traiter les demandes de service (installations, créations de comptes) selon le catalogue, à part. Pendant que tu ouvres la file, le téléphone sonne déjà : le directeur commercial réclame son écran. Ton responsable, M. Ngoy, est joignable sur son portable et l’équipe sécurité (RSSI et analystes SOC) assure une permanence dès 07h30.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'File d’attente du centre de services — lundi 08h00 (données fictives)',
        colonnes: ['N°', 'Ouvert à', 'Demandeur / site', 'Description', 'Utilisateurs touchés', 'Contournement'],
        lignes: [
          ['INC-2041', '07:42', 'Mme Nsimba · Crédit (siège, 3e)', 'Message plein écran : « Vos fichiers ont été chiffrés, payez en bitcoins ». Fichiers en .lockd sur le bureau', '1 poste', 'Aucun'],
          ['INC-2042', '07:48', 'Agence Matete · guichet 1', 'Application de caisse : « connexion refusée ». 15 clients dans la file, guichet 2 fermé (agent en congé)', '1 guichet', 'Aucun'],
          ['INC-2043', '07:55', 'M. Tshilombo · Crédit (siège, 3e)', 'Partage réseau du service Crédit (lecteur K:) : documents illisibles, noms terminés par .lockd', 'Service Crédit (12)', 'Aucun'],
          ['INC-2044', '08:01', 'M. Kalala · Direction commerciale', 'Le second écran ne s’allume plus. « Présentation importante à 11h00 »', '1', 'Écran du portable'],
          ['INC-2045', '07:30', 'Mme Lufuluabo · Comptabilité', 'Compte verrouillé au retour de congé, impossible d’ouvrir une session', '1', 'Aucun'],
          ['INC-2046', '07:50', 'Secrétariat · siège, 2e étage', 'Imprimante du 2e étage : bourrages papier à répétition', '9', 'Imprimante du 3e étage'],
          ['REQ-2047', '07:35', 'Service Marketing', 'Installer un lecteur PDF « trouvé sur Internet »', '1', 'Sans objet (demande)'],
          ['REQ-2048', '07:58', 'Ressources humaines', 'Créer le compte d’une stagiaire qui arrive mercredi', '1', 'Sans objet (demande)'],
        ],
      },
      {
        type: 'texte',
        titre: 'Extrait de la procédure du centre de services (fictive)',
        contenu:
          'IMPACT\n• Élevé : un service entier, un site entier, ou un risque de sécurité pouvant se propager.\n• Moyen : plusieurs utilisateurs, ou un poste en contact direct avec la clientèle.\n• Faible : un seul utilisateur.\n\nURGENCE\n• Haute : activité arrêtée, aucun contournement.\n• Moyenne : activité dégradée.\n• Basse : un contournement acceptable existe.\n\nMATRICE (impact / urgence haute · moyenne · basse)\n• Élevé : P1 · P2 · P3\n• Moyen : P2 · P3 · P4\n• Faible : P3 · P4 · P5\n\nDÉLAIS CIBLES (prise en charge / résolution)\nP1 : immédiate / 4 h · P2 : 30 min / 8 h · P3 : 2 h / 2 jours ouvrés · P4 : 1 jour / 5 jours · P5 : 2 jours / 10 jours.\n\nTout incident de sécurité suspecté est signalé SANS DÉLAI à l’équipe sécurité. Les demandes de service suivent le catalogue et n’entrent pas dans la matrice.',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quel ticket prends-tu en charge en tout premier ?',
        options: [
          {
            id: 'a',
            texte: 'INC-2045, le plus ancien de la file (07:30) : premier arrivé, premier servi, c’est la règle la plus équitable pour tous les demandeurs.',
            points: 0,
            feedback:
              'Le « premier arrivé, premier servi » ignore la gravité. Un compte verrouillé gêne une personne ; un rançongiciel peut paralyser tout un service en quelques minutes. La matrice existe précisément pour remplacer l’ordre d’arrivée.',
          },
          {
            id: 'b',
            texte: 'INC-2042, le guichet bloqué : des clients attendent physiquement en agence et l’image de la banque se joue devant eux.',
            points: 1,
            feedback:
              'C’est un vrai P2 (impact moyen car poste en contact avec la clientèle, urgence haute car aucun contournement). Mais un incident de sécurité qui se propage passe avant : chaque minute perdue peut chiffrer de nouveaux fichiers.',
          },
          {
            id: 'c',
            texte: 'INC-2041, le message de rançon, rattaché à INC-2043 : un incident de sécurité qui se propage.',
            points: 3,
            feedback:
              'Exact. Impact élevé (risque de propagation, et INC-2043 montre que le partage du service est déjà touché) et urgence haute : c’est un P1, à traiter immédiatement et à signaler sans délai à l’équipe sécurité.',
          },
          {
            id: 'd',
            texte: 'INC-2044, l’écran du directeur commercial : il a une présentation à 11h00 et il est déjà au téléphone.',
            points: 0,
            feedback:
              'Le rang hiérarchique ne change ni l’impact ni l’urgence. Un seul utilisateur, avec un contournement disponible (l’écran du portable) : c’est un P5 selon la matrice.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Tu arrives devant le poste de Mme Nsimba. Quel est ton premier geste ?',
        options: [
          {
            id: 'a',
            texte: 'Lancer une analyse antivirus complète, poste toujours connecté, pour identifier la souche et transmettre ses signatures à l’équipe sécurité.',
            points: 0,
            feedback:
              'Pendant l’analyse, le poste reste connecté et continue de chiffrer le partage réseau. L’antivirus n’a d’ailleurs pas empêché l’infection : ce n’est pas l’outil du premier geste.',
          },
          {
            id: 'b',
            texte: 'Isoler le poste (câble et Wi-Fi) sans l’éteindre, ne rien payer, photographier le message, appeler la sécurité.',
            points: 4,
            feedback:
              'C’est le bon réflexe : isoler pour stopper la propagation, sans éteindre (la mémoire peut contenir des traces utiles à l’enquête), sauf consigne contraire de la sécurité. On ne paie jamais, on conserve les preuves et on passe la main aux spécialistes.',
          },
          {
            id: 'c',
            texte: 'Éteindre le poste pour stopper net le chiffrement, puis le réinstaller depuis l’image standard pour que Mme Nsimba reprenne au plus vite.',
            points: 1,
            feedback:
              'Couper le poste arrête bien le chiffrement local, mais la réinstallation détruit toutes les traces : impossible de savoir comment l’infection est entrée ni si d’autres postes sont touchés. On ne reconstruit qu’après l’accord de l’équipe sécurité.',
          },
          {
            id: 'd',
            texte: 'Restaurer tout de suite les fichiers de Mme Nsimba depuis la sauvegarde d’hier soir, antérieure à l’attaque et donc saine.',
            points: 0,
            feedback:
              'Restaurer sur un poste encore infecté, c’est offrir de nouveaux fichiers au rançongiciel. La restauration vient après l’éradication, jamais avant.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'M. Kalala, le directeur commercial, rappelle : « Je suis directeur, je passe avant tout le monde. Venez maintenant ! » Que lui réponds-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Tu lui expliques en toute transparence qu’un rançongiciel touche le service Crédit et que l’équipe est mobilisée dessus : il comprendra l’attente.',
            points: 1,
            feedback:
              'L’honnêteté est louable, mais un incident de sécurité en cours ne se raconte pas au téléphone : c’est l’équipe sécurité et la direction qui décident de la communication. Tu risques de semer la panique ou de faire fuiter l’information.',
          },
          {
            id: 'b',
            texte: 'Tu lui demandes de créer un ticket sur le portail, comme le veut la procédure, et tu raccroches pour te concentrer sur l’urgence.',
            points: 0,
            feedback:
              'Le ticket existe déjà (INC-2044) et raccrocher dégrade inutilement la relation. Un utilisateur pressé, même non prioritaire, mérite une réponse claire et une solution d’attente.',
          },
          {
            id: 'c',
            texte: 'Tu abandonnes le poste infecté une dizaine de minutes pour régler l’écran : le geste est rapide, et avec un directeur, mieux vaut ne pas se faire d’ennemi.',
            points: 0,
            feedback:
              'Laisser un P1 sans surveillance pour un P5, c’est l’erreur la plus coûteuse de la matinée. La pression hiérarchique ne modifie pas la matrice.',
          },
          {
            id: 'd',
            texte:
              'Tu restes courtois : un incident prioritaire est en cours ; en attendant, il peut utiliser l’écran de son portable, et tu lui donnes un créneau avant 11h00.',
            points: 3,
            feedback:
              'C’est la réponse professionnelle : tu reconnais son besoin, tu proposes un contournement immédiat et un engagement de délai tenable, sans dévoiler l’incident de sécurité. Tu notes l’échange dans le ticket INC-2044.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'L’équipe sécurité a pris la main sur le poste. Que fais-tu du ticket INC-2043 (partage du service Crédit illisible) ?',
        options: [
          {
            id: 'a',
            texte: 'Tu le traites à part comme un problème de droits d’accès sur le partage (P3) : une stratégie de groupe modifiée a pu rendre les fichiers illisibles.',
            points: 0,
            feedback:
              'Les extensions .lockd sont les mêmes que sur le poste de Mme Nsimba : ce n’est pas un problème de droits, c’est la propagation du rançongiciel via le lecteur réseau K:. Le traiter à part ferait perdre un temps précieux.',
          },
          {
            id: 'b',
            texte: 'Tu demandes aux utilisateurs de renommer leurs fichiers en retirant l’extension .lockd, pour que Word et Excel les reconnaissent de nouveau.',
            points: 0,
            feedback:
              'Renommer ne déchiffre rien : le contenu reste chiffré. Pire, les manipulations des utilisateurs effacent des indices et peuvent abîmer les fichiers.',
          },
          {
            id: 'c',
            texte: 'Tu restaures le partage depuis la sauvegarde de dimanche soir, antérieure aux dégâts, pour que le service Crédit reprenne le travail.',
            points: 1,
            feedback:
              'La sauvegarde sera la clé de la reprise, mais trop tôt : tant que la source n’est pas éradiquée et les comptes sécurisés, les fichiers restaurés peuvent être chiffrés à nouveau. La restauration se décide avec l’équipe sécurité.',
          },
          {
            id: 'd',
            texte:
              'Tu le rattaches à INC-2041 comme incident majeur, tu alertes la sécurité et tu fais cesser l’usage du lecteur K:.',
            points: 3,
            feedback:
              'Exact. Les deux tickets décrivent le même incident : on les lie, on alerte la sécurité sur l’étendue réelle (le partage, donc potentiellement d’autres postes) et on donne une consigne simple aux utilisateurs pour limiter les dégâts.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e5',
        question:
          'Une fois l’incident de sécurité confié à l’équipe sécurité, classe les incidents restants du plus prioritaire au moins prioritaire, selon la matrice.',
        elements: [
          { id: 'imprimante', texte: 'INC-2046 — Imprimante du 2e étage en bourrage (9 utilisateurs, imprimante du 3e disponible)' },
          { id: 'guichet', texte: 'INC-2042 — Guichet 1 de l’agence Matete bloqué (clients en attente, aucun contournement)' },
          { id: 'ecran', texte: 'INC-2044 — Second écran du directeur commercial (écran du portable disponible)' },
          { id: 'compte', texte: 'INC-2045 — Compte verrouillé de Mme Lufuluabo (ne peut pas travailler)' },
        ],
        ordreCorrect: ['guichet', 'compte', 'imprimante', 'ecran'],
        pointsMax: 4,
        feedback:
          'Le guichet est un P2 (impact moyen : poste en contact avec la clientèle ; urgence haute : aucun contournement). Le compte verrouillé est un P3 (impact faible, urgence haute). L’imprimante est un P4 (impact moyen car 9 personnes, urgence basse car le 3e étage dépanne). L’écran du directeur est un P5 (un utilisateur, contournement disponible). Les deux demandes de service (REQ-2047 et REQ-2048) suivent le catalogue ; le lecteur PDF « trouvé sur Internet » sera refusé au profit du logiciel validé par la banque.',
      },
    ],
    pointsMax: 17,
    debrief:
      'Ce cas évalue ta capacité à prioriser avec méthode, sous pression, et à reconnaître un incident de sécurité derrière un ticket de support.\n• P1 : INC-2041 et INC-2043 forment un seul incident majeur. Les extensions .lockd identiques montrent que le rançongiciel a déjà atteint le partage réseau du service Crédit.\n• P2 : le guichet de Matete (clientèle bloquée, aucun contournement).\n• P3 : le compte verrouillé ; P4 : l’imprimante ; P5 : l’écran du directeur.\n• REQ-2047 et REQ-2048 sont des demandes de service, pas des incidents : elles suivent le catalogue.\n\nLe premier geste face à un rançongiciel est l’isolement réseau (câble et Wi-Fi), sans éteindre le poste ni le réinstaller, sans payer, en conservant le message comme preuve. On alerte l’équipe sécurité sans délai, puis on cartographie l’étendue : partages, autres postes du service, comptes utilisés. La restauration depuis les sauvegardes vient après l’éradication, sur décision de la sécurité.\n\nLe piège humain du cas est le directeur pressé : la hiérarchie ne change pas la matrice, mais elle mérite une réponse courtoise, un contournement immédiat et un délai tenable. Enfin, on ne détaille pas un incident de sécurité en cours à un tiers, même interne.\n\nRéflexes à retenir :\n• Priorité = impact × urgence, jamais l’ordre d’arrivée ni le grade du demandeur.\n• Tout signe de rançongiciel : isoler, préserver, alerter, puis seulement restaurer.\n• Relier les tickets qui se ressemblent : deux symptômes, une seule cause.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SUP-CAS-02 — « Internet ne marche pas » à l'agence de Kintambo
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SUP-CAS-02',
    filiere: 'support',
    titre: '« Internet ne marche pas » à l’agence de Kintambo',
    role: 'Technicien support niveau 1 — Centre de services, Banque Alpha',
    heure: 'Mardi 08h12',
    enjeu:
      'Rétablir le réseau des guichets d’une agence à distance, avec une méthode par couches et des consignes simples données à un personnel non technicien.',
    contexte:
      'Mme Kabeya, caissière à l’agence de Kintambo de Banque Alpha (banque fictive), t’appelle : « Internet ne marche pas, je ne peux pas ouvrir l’application de caisse et les clients arrivent. » L’agence ouvre ses portes à 08h30. Tu prends la main à distance… impossible : son poste n’est joignable par aucun outil. Tu lui fais taper deux commandes en lui dictant lettre par lettre, et elle te lit le résultat. Le chef d’agence, M. Lokwa, t’indique qu’une entreprise de nettoyage a déplacé le comptoir des guichets samedi pour cirer le sol. Le réseau de l’agence est en 10.20.5.0/24, la passerelle est 10.20.5.1 et le DHCP est servi depuis le siège.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Poste AGK-GUI01 (guichet 1) — commandes lues par l’utilisatrice (Windows en anglais)',
        lignes: [
          'C:\\Users\\mkabeya> ipconfig /all',
          'Ethernet adapter Ethernet:',
          '   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM',
          '   Physical Address. . . . . . . . . : 3C-52-82-1A-7F-04',
          '   DHCP Enabled. . . . . . . . . . . : Yes',
          '   Autoconfiguration Enabled . . . . : Yes',
          '   Link-local IPv6 Address . . . . . : fe80::8d4c:2a1b:93e7:51f2%12(Preferred)',
          '   Autoconfiguration IPv4 Address. . : 169.254.83.17(Preferred)',
          '   Subnet Mask . . . . . . . . . . . : 255.255.0.0',
          '   Default Gateway . . . . . . . . . :',
          '   DNS Servers . . . . . . . . . . . : fec0:0:0:ffff::1%1',
          'C:\\Users\\mkabeya> ipconfig /renew',
          'An error occurred while renewing interface Ethernet : unable to contact your DHCP server. Request has timed out.',
          'C:\\Users\\mkabeya> ping 127.0.0.1',
          'Reply from 127.0.0.1: bytes=32 time<1ms TTL=128',
          'C:\\Users\\mkabeya> ping 10.20.5.1',
          'PING: transmit failed. General failure.',
          '# Mme Kabeya précise : « la petite lumière verte à côté de la prise du câble, derrière l’ordinateur, clignote ».',
        ],
      },
      {
        type: 'table',
        titre: 'Postes de l’agence de Kintambo — relevé fait au téléphone avec M. Lokwa',
        colonnes: ['Poste', 'Emplacement', 'Branché sur', 'Adresse IPv4', 'État'],
        lignes: [
          ['AGK-GUI01', 'Guichet 1', 'Petit switch sous le comptoir', '169.254.83.17', 'Pas de réseau'],
          ['AGK-GUI02', 'Guichet 2', 'Petit switch sous le comptoir', '169.254.12.200', 'Pas de réseau'],
          ['AGK-ACC01', 'Accueil', 'Petit switch sous le comptoir', '169.254.140.9', 'Pas de réseau'],
          ['AGK-CHF01', 'Bureau du chef d’agence', 'Switch principal (baie)', '10.20.5.34', 'OK — redémarré à 08h05'],
          ['AGK-BO01', 'Back-office', 'Switch principal (baie)', '10.20.5.41', 'OK'],
          ['AGK-BO02', 'Back-office', 'Switch principal (baie)', '10.20.5.42', 'OK'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Que t’apprend l’adresse 169.254.83.17 affichée par `ipconfig /all` ?',
        options: [
          {
            id: 'a',
            texte: 'La carte réseau est défectueuse : faute de pilote fonctionnel, elle n’obtient aucune adresse ; il faut remplacer le poste.',
            points: 0,
            feedback:
              'Le voyant de lien clignote : la carte et le câble jusqu’au switch fonctionnent. Ce qui manque, c’est la réponse du serveur DHCP.',
          },
          {
            id: 'b',
            texte: 'C’est une adresse publique attribuée par le fournisseur d’accès : le poste contourne le pare-feu de l’agence et se retrouve exposé sur Internet.',
            points: 0,
            feedback:
              'Non : 169.254.0.0/16 est la plage réservée aux adresses de lien local. Elle n’est pas routée et n’est jamais attribuée par un fournisseur d’accès.',
          },
          {
            id: 'c',
            texte:
              'Aucun serveur DHCP n’a répondu : Windows s’est donné une adresse APIPA (lien local), sans passerelle ni DNS.',
            points: 3,
            feedback:
              'Exact. APIPA (RFC 3927) est le « plan B » de Windows quand aucun serveur DHCP ne répond. L’absence de passerelle explique le « General failure » du ping vers 10.20.5.1, et l’échec du `/renew` le confirme. La question devient : pourquoi le DHCP n’est-il pas joignable ?',
          },
          {
            id: 'd',
            texte: 'Le serveur DNS est en panne : l’entrée fec0:0:0:ffff::1 est une valeur par défaut, le poste ne trouve donc plus les noms des sites.',
            points: 1,
            feedback:
              'Le poste n’a effectivement pas de DNS utilisable, mais c’est une conséquence, pas la cause : il n’a même pas de passerelle. On diagnostique de bas en haut ; le DNS viendra plus tard.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Avant de toucher au poste, quelle question poses-tu en priorité au chef d’agence ?',
        options: [
          {
            id: 'a',
            texte: 'Combien de postes sont touchés, ont-ils un point commun (même pièce, même équipement) et qu’est-ce qui a changé récemment ?',
            points: 3,
            feedback:
              'C’est la bonne question : la portée de l’incident oriente tout le diagnostic. Un poste seul fait penser au câble ou au poste ; plusieurs postes reliés au même équipement désignent cet équipement. Le changement récent (le comptoir déplacé samedi) est souvent la clé.',
          },
          {
            id: 'b',
            texte: 'Peut-il configurer une adresse IP fixe (10.20.5.50, passerelle 10.20.5.1) sur le poste du guichet 1, pour rouvrir la caisse en attendant ?',
            points: 1,
            feedback:
              'C’est un contournement dangereux (risque de conflit d’adresses, configuration non conforme oubliée ensuite) et prématuré : si le lien vers le reste du réseau est coupé, le poste ne joindra pas davantage la passerelle avec une adresse fixe.',
          },
          {
            id: 'c',
            texte: 'Peut-il réinstaller le pilote de la carte réseau, souvent corrompu par une mise à jour Windows du week-end ?',
            points: 0,
            feedback:
              'Une action lourde, sans diagnostic, demandée à un non-technicien. Le voyant de lien actif montre que la carte et son pilote fonctionnent.',
          },
          {
            id: 'd',
            texte: 'Aucune : tu demandes directement au siège de redémarrer le serveur DHCP, puisque le poste n’obtient plus de bail.',
            points: 0,
            feedback:
              'Redémarrer un serveur partagé par toutes les agences pour un problème local non diagnostiqué peut créer un incident bien plus grave. Et rien ne prouve encore que le DHCP soit en cause.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre la méthode de diagnostic par couches que tu appliques sur un poste « sans Internet ».',
        elements: [
          { id: 'dns', texte: 'Tester la résolution de noms (`nslookup caisse.banque-alpha.example`)' },
          { id: 'config', texte: 'Lire la configuration IP (`ipconfig /all`) : adresse, masque, passerelle, DNS' },
          { id: 'physique', texte: 'Vérifier le câble et les voyants de lien de la carte et du port' },
          { id: 'passerelle', texte: 'Tester la passerelle (`ping 10.20.5.1`)' },
          { id: 'bail', texte: 'Redemander un bail DHCP (`ipconfig /release` puis `ipconfig /renew`)' },
        ],
        ordreCorrect: ['physique', 'config', 'bail', 'passerelle', 'dns'],
        pointsMax: 4,
        feedback:
          'On remonte les couches : physique (câble, voyant), puis adressage IP (configuration lue, puis bail redemandé si elle est incorrecte), puis accès au réseau local et au routeur (passerelle), enfin les services (DNS, puis l’application). Chaque étape valide la précédente : tester le DNS sans passerelle ne t’apprend rien.',
      },
      {
        type: 'choix',
        id: 'e4',
        question: 'Avec le relevé des postes de l’agence, quelle est la cause la plus probable ?',
        options: [
          {
            id: 'a',
            texte: 'Le serveur DHCP du siège est en panne : c’est lui qui distribue les adresses, et les postes du comptoir n’en reçoivent plus.',
            points: 0,
            feedback:
              'Le poste du chef d’agence, redémarré à 08h05 sur le switch principal, a obtenu 10.20.5.34 : le DHCP répond. La panne ne touche que les postes d’un même équipement.',
          },
          {
            id: 'b',
            texte: 'Les cartes réseau des trois postes du comptoir ont lâché, probablement à cause d’une surtension pendant le cirage du sol samedi.',
            points: 0,
            feedback:
              'Trois pannes matérielles simultanées sur les trois postes branchés au même switch : c’est très improbable, d’autant que leurs voyants de lien sont actifs.',
          },
          {
            id: 'c',
            texte: 'Un logiciel malveillant bloque le réseau des postes du guichet : il coupe la pile IP, d’où les adresses en 169.254.x.x.',
            points: 0,
            feedback:
              'Rien ne l’indique : les trois postes touchés ont pour seul point commun le petit switch du comptoir, déplacé samedi. Il faut d’abord écarter la cause physique évidente.',
          },
          {
            id: 'd',
            texte:
              'Le câble entre le petit switch du comptoir et le switch principal a été débranché ou abîmé lors du déplacement du comptoir.',
            points: 4,
            feedback:
              'Exact. Les voyants sont allumés (lien poste ↔ petit switch), mais le petit switch est isolé : pas de DHCP, donc APIPA. Si le petit switch lui-même était éteint, `ipconfig` afficherait « Media disconnected » et non une adresse 169.254.x.x.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Comment guides-tu M. Lokwa, qui n’est pas technicien, pour vérifier ton hypothèse ?',
        options: [
          {
            id: 'a',
            texte: 'Tu lui dictes des commandes `netsh` (`netsh int ip reset`) pour réinitialiser la pile TCP/IP des trois postes, puis tu les fais redémarrer.',
            points: 0,
            feedback:
              'Les postes ne sont pas en cause. Dicter des commandes système à un non-technicien multiplie les risques d’erreur sans traiter la panne.',
          },
          {
            id: 'b',
            texte:
              'Tu lui fais vérifier, sous le comptoir, que le câble vers la baie est bien enfiché des deux côtés, puis redémarrer un poste, en restant en ligne.',
            points: 3,
            feedback:
              'C’est la bonne façon de faire : des consignes concrètes et visuelles, un seul geste à la fois, et une vérification immédiate du résultat (une adresse en 10.20.5.x). Tu restes en ligne pour rassurer et confirmer.',
          },
          {
            id: 'c',
            texte: 'Tu lui demandes de brancher tous les câbles qui pendent dans les prises libres des deux switchs : l’un d’eux est forcément le bon, « on verra bien ».',
            points: 0,
            feedback:
              'Dangereux : relier deux ports d’un même réseau au hasard peut créer une boucle de commutation, avec une tempête de diffusion capable de faire tomber toute l’agence.',
          },
          {
            id: 'd',
            texte: 'Tu planifies l’intervention d’un technicien sur place demain matin, plus sûre qu’un non-technicien, et tu fermes le ticket en attendant.',
            points: 1,
            feedback:
              'Un déplacement peut être nécessaire si le câble est abîmé, mais un contrôle visuel guidé prend deux minutes et peut rouvrir les guichets dès ce matin. Et on ne ferme jamais un ticket non résolu.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e6',
        question: 'M. Lokwa a rebranché le câble : les trois postes obtiennent une adresse en 10.20.5.x. Comment clôtures-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Tu fermes le ticket aussitôt : les adresses en 10.20.5.x sont revenues, ce qui prouve que la liaison avec le siège est bien rétablie.',
            points: 0,
            feedback:
              'Une adresse IP correcte ne prouve pas que l’application de caisse fonctionne. On ne clôt qu’après confirmation par l’utilisateur.',
          },
          {
            id: 'b',
            texte: 'Tu demandes à Mme Kabeya de passer une opération test, puis tu clôtures avec la cause, la solution et l’heure exacte de rétablissement.',
            points: 1,
            feedback:
              'C’est presque complet : la confirmation par l’utilisatrice et la documentation sont là. Il manque la prévention, pour que la même cause ne revienne pas au prochain ménage.',
          },
          {
            id: 'c',
            texte:
              'Tu fais confirmer la caisse sur les trois postes, tu documentes la cause racine et tu proposes de fixer et d’étiqueter le câble.',
            points: 2,
            feedback:
              'C’est la clôture attendue : vérification par les utilisateurs, base de connaissances alimentée (un collègue résoudra le prochain cas en cinq minutes) et action préventive simple.',
          },
          {
            id: 'd',
            texte: 'Tu laisses le ticket ouvert jusqu’à demain par précaution, au cas où le câble se débrancherait de nouveau dans la journée.',
            points: 0,
            feedback:
              'Un ticket résolu mais laissé ouvert fausse les indicateurs et laisse l’utilisateur sans retour clair. On confirme, on documente, on clôture.',
          },
        ],
      },
    ],
    pointsMax: 19,
    debrief:
      'L’indice décisif était l’adresse 169.254.83.17 : une adresse APIPA signifie que le poste n’a reçu aucune réponse DHCP. Il n’a donc ni passerelle ni DNS, d’où le « General failure » sur le ping de la passerelle.\n• Portée : trois postes touchés, tous branchés sur le petit switch du comptoir ; les postes du switch principal fonctionnent.\n• DHCP écarté : le poste du chef d’agence, redémarré à 08h05, a obtenu 10.20.5.34.\n• Lien physique vers les postes valide : les voyants clignotent. Un switch éteint aurait donné « Media disconnected ».\n• Cause : le câble entre le petit switch et le switch principal, débranché lors du déplacement du comptoir samedi.\n\nLa méthode attendue est le diagnostic par couches (physique, adressage, passerelle, DNS, application) précédé d’une question essentielle : combien de postes, quel point commun, quel changement récent ? Ces trois questions évitent les actions lourdes et inutiles : réinstaller un pilote, fixer une adresse IP à la main, redémarrer un serveur partagé par toutes les agences.\n\nLe support à distance est aussi un exercice de communication : des consignes visuelles et une action à la fois, une vérification immédiate du résultat, et jamais de manipulation hasardeuse (risque de boucle de commutation). La clôture se fait après confirmation par l’utilisatrice, avec la cause racine documentée et une mesure préventive.\n\nRéflexes à retenir :\n• 169.254.x.x = pas de DHCP ; « Media disconnected » = pas de lien physique.\n• Plusieurs postes touchés : cherche l’équipement qu’ils ont en commun.\n• Demande toujours ce qui a changé récemment.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SUP-CAS-03 — Le « directeur » qui exige un mot de passe par téléphone
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SUP-CAS-03',
    filiere: 'support',
    titre: 'Le « directeur » pressé qui exige un nouveau mot de passe',
    role: 'Technicien support niveau 1 — Centre de services, Banque Alpha',
    heure: 'Jeudi 08h40',
    enjeu:
      'Résister à une tentative d’ingénierie sociale visant le compte d’un directeur, en appliquant la procédure de vérification d’identité sans rompre la relation.',
    contexte:
      'Ta ligne sonne, numéro masqué. Un homme se présente comme M. Jean-Marie Mbuyi, directeur des opérations de Banque Alpha (banque fictive). Il dit être à l’aéroport de Lubumbashi, sur le point d’embarquer, et exige que tu réinitialises son mot de passe « immédiatement ». La procédure du centre de services interdit toute réinitialisation sans vérification d’identité par un canal connu. En parlant, tu ouvres la console de supervision des comptes : le compte `jm.mbuyi` a un historique chargé depuis ce matin. Il est 08h40 et ton responsable, M. Ngoy, est en réunion jusqu’à 09h30.',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'Notes prises pendant l’appel — 08h40',
        contenu:
          '« Bonjour, Mbuyi, directeur des opérations. Je suis à l’aéroport de Lubumbashi, j’embarque dans vingt minutes. Mon compte est bloqué et je dois envoyer un document au conseil avant 10h00. Réinitialisez-moi le mot de passe tout de suite et envoyez-le par SMS à ce numéro, mon téléphone professionnel est déchargé. Et désactivez la double authentification le temps de mon voyage, elle passe par ce téléphone. Je n’ai pas le temps pour vos procédures, si le document n’arrive pas, c’est vous qui en répondrez. »\n\nNuméro donné pour le SMS : un numéro inconnu de l’annuaire.\nAnnuaire interne : mobile professionnel de M. Mbuyi enregistré, assistante Mme Bolamba (poste 4120).',
      },
      {
        type: 'table',
        titre: 'Console de supervision des comptes — compte jm.mbuyi, jeudi (extrait fictif)',
        colonnes: ['Heure', 'Événement', 'Source', 'Détail'],
        lignes: [
          ['06:02:14', 'Échec de connexion', 'webmail · 203.0.113.45', 'Mot de passe incorrect'],
          ['06:02:51', 'Échec de connexion', 'webmail · 203.0.113.45', 'Mot de passe incorrect'],
          ['06:03:30', 'Échec de connexion', 'webmail · 203.0.113.45', 'Mot de passe incorrect'],
          ['06:04:02', 'Échec de connexion', 'webmail · 203.0.113.45', 'Mot de passe incorrect'],
          ['06:04:31', 'Échec de connexion', 'webmail · 203.0.113.45', 'Mot de passe incorrect'],
          ['06:04:31', 'Compte verrouillé', 'contrôleur de domaine', 'Seuil de 5 échecs atteint'],
          ['06:34:31', 'Déverrouillage automatique', 'contrôleur de domaine', 'Durée de verrouillage : 30 min'],
          ['07:58:03', 'Ouverture de session réussie', 'poste DIR-OPS-01 · 10.10.4.21', 'Siège, 4e étage'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quels éléments font de cet appel une tentative d’ingénierie sociale probable ?',
        options: [
          {
            id: 'a',
            texte: 'Uniquement le numéro masqué : un vrai directeur appellerait depuis son téléphone professionnel, dont le numéro figure dans l’annuaire interne.',
            points: 1,
            feedback:
              'C’est un signal, mais faible à lui seul : un directeur peut appeler d’un autre téléphone. C’est l’accumulation d’indices qui fait la conviction.',
          },
          {
            id: 'b',
            texte: 'Le ton agressif et les menaces : un vrai directeur, habitué aux procédures de la banque, serait plus courtois avec le support.',
            points: 0,
            feedback:
              'Le ton ne prouve rien dans un sens ni dans l’autre : de vrais directeurs peuvent être pressés et secs, et un fraudeur peut être charmant. On s’appuie sur des faits vérifiables.',
          },
          {
            id: 'c',
            texte:
              'Urgence et autorité, un numéro inconnu, la coupure du MFA demandée, des échecs depuis une IP externe et une session au siège alors qu’il se dit à Lubumbashi.',
            points: 3,
            feedback:
              'Exact. Urgence et autorité sont les leviers classiques de l’ingénierie sociale ; le canal inhabituel et la désactivation du MFA visent à prendre le contrôle du compte. La console apporte la preuve : quelqu’un a tenté de deviner le mot de passe depuis l’extérieur, et le vrai titulaire semble être à son bureau.',
          },
          {
            id: 'd',
            texte: 'Rien de suspect : les comptes de directeurs se verrouillent souvent, et le déverrouillage automatique à 06h34 montre que la console fonctionne normalement.',
            points: 0,
            feedback:
              'Les cinq échecs consécutifs depuis 203.0.113.45 à 06h00, suivis d’une session normale depuis le siège, ne correspondent pas à un oubli de mot de passe. Banaliser ces signaux, c’est exactement ce que l’attaquant espère.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Que réponds-tu pendant l’appel ?',
        options: [
          {
            id: 'a',
            texte: 'Tu réinitialises le mot de passe et tu l’envoies par SMS au numéro donné : un directeur bloqué avant un conseil, c’est prioritaire.',
            points: 0,
            feedback:
              'C’est exactement le scénario de l’attaquant : il obtiendrait le compte d’un directeur des opérations, avec ses accès et sa messagerie. Aucune urgence ne justifie de contourner la vérification d’identité.',
          },
          {
            id: 'b',
            texte:
              'Tu restes courtois : la procédure impose de vérifier son identité par un canal connu, tu vas le rappeler. Rien n’est modifié ni confirmé.',
            points: 4,
            feedback:
              'C’est la réponse attendue : ferme sur le fond, polie sur la forme. Tu présentes la procédure comme une protection, tu proposes une solution, et tu ne donnes aucune information exploitable (ni l’état du compte, ni les méthodes MFA).',
          },
          {
            id: 'c',
            texte: 'Tu lui poses des questions de contrôle (matricule, date de naissance, nom de son assistante) : s’il répond juste, tu peux réinitialiser sans risque.',
            points: 1,
            feedback:
              'L’intention est bonne, mais ces informations se trouvent facilement (organigramme, réseaux sociaux, courriels volés). Un fraudeur bien préparé y répondra. La vérification doit passer par un canal que tu choisis, pas par ce que l’appelant sait.',
          },
          {
            id: 'd',
            texte: 'Tu lui réponds fermement que c’est une tentative d’arnaque, que la sécurité sera prévenue, et tu raccroches sans un mot de plus.',
            points: 1,
            feedback:
              'Le compte reste protégé, c’est l’essentiel. Mais si c’était vraiment M. Mbuyi, la relation serait abîmée, et tu as révélé ton analyse à un éventuel attaquant. On applique la procédure calmement, sans accuser.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Comment vérifies-tu l’identité du demandeur ?',
        options: [
          {
            id: 'a',
            texte: 'Tu rappelles le numéro qu’il t’a donné pour le SMS : s’il décroche et confirme sa demande, c’est bien lui.',
            points: 0,
            feedback:
              'Ce numéro est fourni par l’appelant lui-même : il décrochera, bien sûr. Rappeler un numéro donné par le demandeur ne vérifie rien.',
          },
          {
            id: 'b',
            texte: 'Tu lui demandes de t’envoyer un courriel depuis sa messagerie professionnelle, preuve qu’il détient bien ses accès.',
            points: 0,
            feedback:
              'Il prétend justement ne pas pouvoir s’y connecter. Et si la messagerie était compromise, le courriel ne prouverait rien. Le canal de vérification doit être indépendant du compte en cause.',
          },
          {
            id: 'c',
            texte: 'Tu demandes l’avis d’un collègue qui connaît bien la voix de M. Mbuyi, pour confirmer qu’il s’agit bien de lui.',
            points: 1,
            feedback:
              'Reconnaître une voix est peu fiable (imitation, mauvaise ligne, voire voix synthétique). C’est un indice, pas une vérification.',
          },
          {
            id: 'd',
            texte: 'Tu rappelles toi-même M. Mbuyi au numéro de l’annuaire interne, ou son assistante au poste 4120.',
            points: 3,
            feedback:
              'Exact : c’est toi qui choisis le canal, à partir d’une source de référence interne. Résultat : M. Mbuyi décroche à son bureau du 4e étage, il n’a jamais appelé et n’est pas en voyage. La fraude est confirmée.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'La fraude est confirmée. Remets dans l’ordre les actions qui suivent.',
        elements: [
          { id: 'collegues', texte: 'Prévenir les collègues du centre de services et les assistantes de direction que le même scénario peut se répéter' },
          { id: 'securite', texte: 'Signaler immédiatement l’incident à l’équipe sécurité : heure de l’appel, demandes exactes, numéro donné, échecs depuis 203.0.113.45' },
          { id: 'retex', texte: 'Proposer un retour d’expérience et un rappel de sensibilisation sur l’ingénierie sociale' },
          { id: 'compte', texte: 'Sécuriser le compte avec le vrai M. Mbuyi, en personne : nouveau mot de passe choisi par lui, sessions fermées, méthodes MFA vérifiées' },
          { id: 'ticket', texte: 'Compléter le ticket : chronologie, actions réalisées, preuves conservées' },
        ],
        ordreCorrect: ['securite', 'compte', 'collegues', 'ticket', 'retex'],
        pointsMax: 5,
        feedback:
          'L’équipe sécurité est prévenue d’abord : elle peut bloquer l’IP, surveiller d’autres comptes ciblés et piloter la suite. On sécurise ensuite le compte visé, avec son vrai titulaire et en face à face, puisque son mot de passe a pu être deviné ou fuiter. Viennent ensuite la diffusion de l’alerte aux personnes susceptibles d’être appelées, la documentation complète du ticket, et enfin le retour d’expérience, une fois l’incident maîtrisé.',
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'Dix minutes plus tard, le même homme rappelle, furieux : « Je vais vous faire licencier ! Passez-moi votre chef et dites-moi au moins si mon compte est encore bloqué. »',
        options: [
          {
            id: 'a',
            texte: 'Pour le calmer, tu lui confirmes que son compte a été verrouillé à 06h04 mais qu’il est maintenant débloqué : il peut réessayer de se connecter.',
            points: 0,
            feedback:
              'Tu viens de donner à l’attaquant une information précieuse : ses tentatives ont été détectées et le compte est de nouveau utilisable. On ne communique aucun détail sur un compte à un appelant non vérifié.',
          },
          {
            id: 'b',
            texte: 'Tu lui donnes le numéro direct de M. Ngoy pour qu’il règle cela avec lui : l’escalade vers le responsable est prévue par la procédure.',
            points: 1,
            feedback:
              'Escalader vers un responsable est légitime, mais pas en donnant un numéro interne à un fraudeur identifié : tu lui offres une nouvelle cible. C’est toi qui transmets à ton responsable et à la sécurité.',
          },
          {
            id: 'c',
            texte:
              'Tu gardes ton calme : toute demande sur ce compte passe par la vérification d’identité. Tu ne confirmes rien et tu notes l’appel au ticket.',
            points: 3,
            feedback:
              'C’est la bonne attitude : calme, cohérence et aucune information divulguée. Les menaces font partie du mode opératoire ; elles ne changent rien à la procédure. Le second appel enrichit le dossier de l’équipe sécurité.',
          },
          {
            id: 'd',
            texte: 'Tu cèdes cette fois : il menace ta carrière, ton responsable n’est pas joignable et tu ne veux pas porter seul la responsabilité d’un refus.',
            points: 0,
            feedback:
              'La pression est le levier même de l’attaque. Une procédure de sécurité qui cède aux menaces n’en est pas une, et c’est elle qui te protège : tu n’as rien à te reprocher en l’appliquant.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'Ce cas est une attaque par ingénierie sociale classique (« arnaque au faux directeur » appliquée au support), étayée par des traces techniques.\n• Leviers psychologiques : autorité (directeur), urgence (embarquement, conseil à 10h00), menace (« vous en répondrez »).\n• Demandes anormales : mot de passe envoyé par SMS à un numéro inconnu, désactivation de la double authentification.\n• Preuves techniques : cinq échecs de connexion depuis 203.0.113.45 à 06h00, verrouillage puis déverrouillage automatique, et une session normale à 07h58 depuis le bureau du siège.\n\nLa réponse attendue tient en trois mots : ne rien céder, vérifier, alerter. On ne réinitialise jamais un mot de passe sur la seule parole d’un appelant. On vérifie l’identité par un canal que l’on choisit (rappel au numéro de l’annuaire interne, assistante), jamais par un numéro ou des réponses fournis par l’appelant. Les questions de contrôle (matricule, date de naissance) sont faibles, car ces informations circulent.\n\nUne fois la fraude confirmée, on alerte l’équipe sécurité, on sécurise le compte avec son vrai titulaire en face à face, on prévient les cibles probables et on documente. Le ton compte : courtois et ferme, sans accuser ni divulguer la moindre information sur le compte.\n\nRéflexes à retenir :\n• Urgence + autorité + canal inhabituel = signal d’alarme.\n• Toujours rappeler par un canal de référence, jamais celui donné par l’appelant.\n• Ne jamais confirmer l’état d’un compte, ni désactiver le MFA, sur simple demande téléphonique.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SUP-CAS-04 — Une arrivée mercredi, un départ vendredi
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'SUP-CAS-04',
    filiere: 'support',
    titre: 'Une arrivée mercredi, un départ vendredi',
    role: 'Technicien support niveau 1 — Centre de services, Banque Alpha',
    heure: 'Lundi 14h00',
    enjeu:
      'Ouvrir les accès d’une nouvelle employée au strict nécessaire et fermer proprement ceux d’un employé qui s’en va, avec une traçabilité complète.',
    contexte:
      'Les ressources humaines de Banque Alpha (banque fictive) t’adressent deux demandes validées : l’arrivée de Mlle Grâce Mwamba, analyste crédit, mercredi à 08h00, et le départ de M. Patrick Ilunga, chargé de clientèle, vendredi à 17h00. Le chef du service Crédit, M. Didier Kabamba, t’appelle aussitôt avec deux idées pour « gagner du temps ». De son côté, M. Ilunga t’a écrit ce matin pour te demander deux faveurs avant son départ. La politique de la banque applique le principe du moindre privilège et des profils types par fonction.',
    piecesJointes: [
      {
        type: 'texte',
        titre: 'Appel de M. Kabamba, chef du service Crédit — 13h50',
        contenu:
          '« Pour Grâce, ne te complique pas la vie : copie simplement les droits de Mme Thérèse Kasongo, elle est au service depuis douze ans, elle a accès à tout, comme ça Grâce ne sera jamais bloquée. Et pour l’ordinateur, donne-lui directement le portable de Patrick Ilunga vendredi soir, il part de toute façon. »',
      },
      {
        type: 'table',
        titre: 'Droits actuels de Mme Thérèse Kasongo, analyste crédit senior (extrait fictif)',
        colonnes: ['Groupe / droit', 'Accès accordé', 'Motif d’origine', 'Depuis'],
        lignes: [
          ['GG_CREDIT_SAISIE', 'Saisie des dossiers de crédit', 'Fonction actuelle', '2014'],
          ['GG_CREDIT_VALID_N2', 'Validation des crédits supérieurs à 50 000 USD', 'Délégation de signature (senior)', '2021'],
          ['GG_TRESO_RW', 'Trésorerie, lecture et écriture', 'Ancien poste au service Trésorerie', '2016'],
          ['Administrateurs locaux', 'Administration de son poste', 'Installation d’un logiciel en 2019, jamais retirée', '2019'],
          ['BAL_DIR_CREDIT', 'Boîte partagée de la direction du Crédit', 'Intérim de l’assistante', '2023'],
          ['GG_VPN_NOMADE', 'Accès VPN depuis l’extérieur', 'Missions en province', '2018'],
        ],
      },
      {
        type: 'texte',
        titre: 'Courriel de M. Patrick Ilunga — 09h12',
        contenu:
          'Objet : Avant mon départ\n\nBonjour,\n\nPouvez-vous copier tout le contenu de mon lecteur réseau et de ma messagerie sur ma clé USB personnelle ? Ce sont mes dossiers, j’y ai travaillé pendant six ans.\n\nEt pourriez-vous transférer automatiquement mes courriels professionnels vers mon adresse personnelle pendant trois mois, pour que je ne rate rien de mes clients ?\n\nMerci d’avance,\nPatrick Ilunga',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quels droits attribues-tu à Mlle Grâce Mwamba ?',
        options: [
          {
            id: 'a',
            texte: 'Le profil type « Analyste crédit » validé avec M. Kabamba ; tout ajout passera par une demande validée.',
            points: 4,
            feedback:
              'Exact : c’est l’application du moindre privilège par profils types (contrôle d’accès basé sur les rôles). Grâce a ce qu’il faut pour son travail dès le premier jour, et chaque ajout est demandé, validé et tracé.',
          },
          {
            id: 'b',
            texte: 'Une copie exacte des droits de Mme Kasongo, comme le demande le chef de service : même métier, et Grâce ne sera jamais bloquée.',
            points: 0,
            feedback:
              'Copier un profil, c’est copier douze ans d’accumulation de droits : validation des crédits de plus de 50 000 USD sans délégation, accès en écriture à la Trésorerie, droits d’administrateur local. C’est une faille de séparation des tâches et un risque de fraude.',
          },
          {
            id: 'c',
            texte: 'Les droits de Mme Kasongo, sauf la Trésorerie et la validation de niveau 2 : on retire ce qui dépasse la fonction d’une débutante.',
            points: 1,
            feedback:
              'Mieux, mais tu pars toujours d’un profil individuel hérité au lieu d’un profil type : les droits d’administrateur local, la boîte de direction et le VPN restent sans justification pour une nouvelle analyste.',
          },
          {
            id: 'd',
            texte: 'Un compte sans aucun droit métier, au nom du moindre privilège : elle demandera ce dont elle a besoin au fil des blocages.',
            points: 1,
            feedback:
              'C’est sûr, mais improductif : Grâce passera sa première semaine à ouvrir des tickets. Le moindre privilège, ce n’est pas zéro privilège, c’est le nécessaire pour sa fonction.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Comment prépares-tu le compte et les identifiants de Grâce ?',
        options: [
          {
            id: 'a',
            texte: 'Tu crées le compte avec le mot de passe commun des nouveaux arrivants, « Bienvenue2026 », que tout le service connaît : elle le changera ensuite.',
            points: 0,
            feedback:
              'Un mot de passe commun et prévisible est une porte ouverte : n’importe quel collègue, ou un attaquant qui connaît la pratique, peut se connecter avant elle et agir en son nom.',
          },
          {
            id: 'b',
            texte: 'Tu envoies son identifiant et son mot de passe à M. Kabamba par courriel pour qu’il les lui remette mercredi : c’est son manager, il est de confiance.',
            points: 1,
            feedback:
              'Le compte est créé, mais le mot de passe circule en clair dans une messagerie et passe par un tiers : il n’est plus secret. La remise doit être directe et le mot de passe changé à la première connexion.',
          },
          {
            id: 'c',
            texte: 'Tu crées le compte mercredi à 08h00, devant elle, pour être sûr que personne ne puisse l’utiliser avant son arrivée.',
            points: 1,
            feedback:
              'L’intention de sécurité est bonne, mais Grâce attendra ses accès toute la matinée. Un compte préparé à l’avance et activé seulement le jour de son arrivée offre la même protection, sans attente.',
          },
          {
            id: 'd',
            texte:
              'Tu prépares le compte, activé mercredi, avec un mot de passe temporaire à usage unique remis en main propre, l’enrôlement MFA et la charte signée.',
            points: 3,
            feedback:
              'C’est la bonne pratique : le compte est prêt mais inutilisable avant son arrivée, le secret n’est connu que d’elle après la première connexion, et l’enrôlement MFA se fait en sa présence. La charte signée formalise ses obligations.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre le traitement du départ de M. Ilunga.',
        elements: [
          { id: 'controle', texte: 'Contrôler qu’aucun accès ne subsiste (groupes, comptes applicatifs, VPN, badge) et qu’aucune connexion n’a lieu après la désactivation' },
          { id: 'transfert', texte: 'Organiser avec son manager le transfert des dossiers et de la boîte aux lettres professionnels au successeur' },
          { id: 'notification', texte: 'Vérifier la notification de départ des RH : date et heure de fin (vendredi 17h00)' },
          { id: 'suppression', texte: 'Supprimer le compte à l’issue de la durée de conservation prévue par la politique' },
          { id: 'desactivation', texte: 'Vendredi à 17h00 : désactiver le compte (sans le supprimer) et révoquer les sessions, le VPN et le MFA' },
        ],
        ordreCorrect: ['notification', 'transfert', 'desactivation', 'controle', 'suppression'],
        pointsMax: 4,
        feedback:
          'Tout part de la notification officielle des RH, qui fixe l’heure de fin. Le transfert des données professionnelles se fait tant que le compte est actif. À l’heure dite, on désactive (une suppression immédiate ferait perdre les traces d’audit et les données encore utiles), puis on contrôle qu’aucun accès oublié ne subsiste. La suppression n’intervient qu’au terme de la durée de conservation.',
      },
      {
        type: 'choix',
        id: 'e4',
        question: 'Que réponds-tu aux deux demandes de M. Ilunga ?',
        options: [
          {
            id: 'a',
            texte: 'Tu acceptes la copie sur clé USB, car ce sont des dossiers qu’il a lui-même produits, mais tu refuses le transfert automatique des courriels.',
            points: 1,
            feedback:
              'Le refus du transfert est juste. Mais les dossiers produits pour la banque, et surtout les données de clients, appartiennent à la banque : les copier sur une clé personnelle serait une fuite de données.',
          },
          {
            id: 'b',
            texte:
              'Tu refuses poliment les deux : ces données sont à la banque. Ses fichiers personnels se récupèrent selon la politique ; un message d’absence guidera ses clients.',
            points: 3,
            feedback:
              'C’est la réponse attendue : ferme sur la protection des données, respectueuse de la personne, et utile pour les clients. Le message d’absence automatique remplace avantageusement un transfert vers une adresse personnelle.',
          },
          {
            id: 'c',
            texte: 'Tu acceptes les deux : il a été un bon employé pendant six ans, ses clients le connaissent et cela facilitera la transition.',
            points: 0,
            feedback:
              'Le mérite d’un employé ne change pas la propriété des données. Copier la messagerie et rediriger les courriels de clients vers une adresse personnelle exposerait la banque à une fuite de données et à un manquement au secret bancaire.',
          },
          {
            id: 'd',
            texte: 'Tu acceptes le transfert vers son adresse personnelle pendant un mois seulement, par compromis, le temps que ses clients connaissent son successeur.',
            points: 0,
            feedback:
              'Un mois de courriels de clients vers une boîte personnelle reste une fuite de données. Il n’y a pas de compromis sur la sortie de données : seule la politique de la banque peut prévoir des exceptions, validées formellement.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Vendredi soir, tu récupères le portable de M. Ilunga. M. Kabamba veut le donner directement à Grâce. Que fais-tu ?',
        options: [
          {
            id: 'a',
            texte: 'Tu supprimes les fichiers de son bureau et de ses documents, tu vides la corbeille, puis tu le remets à Grâce lundi avec ses identifiants.',
            points: 1,
            feedback:
              'Effacer quelques dossiers ne suffit pas : profils, caches, fichiers récupérables et logiciels installés restent sur le disque. Et l’inventaire n’indique toujours pas qui détient l’appareil.',
          },
          {
            id: 'b',
            texte: 'Tu le remets tel quel à Grâce : c’est plus rapide, le matériel est récent et déjà configuré pour le réseau de la banque.',
            points: 0,
            feedback:
              'Grâce aurait accès aux données de clientèle de M. Ilunga, hors de son périmètre, et l’inventaire serait faux. C’est une fuite interne et une perte de traçabilité.',
          },
          {
            id: 'c',
            texte:
              'Tu le récupères contre décharge, tu vérifies le transfert des données, tu l’effaces et le réinstalles, puis tu mets l’inventaire à jour.',
            points: 3,
            feedback:
              'Exact : décharge signée, données préservées, effacement puis réinstallation propre, inventaire à jour (numéro de série, nouvel affectataire). Le poste repart sain et chaque étape est traçable.',
          },
          {
            id: 'd',
            texte: 'Tu le ranges dans le stock sans rien y faire, par prudence, et tu donnes à Grâce un portable neuf, encore sous scellé du fournisseur.',
            points: 1,
            feedback:
              'Grâce est équipée, mais un portable rempli de données de clientèle dort dans un placard, sans effacement ni mise à jour de l’inventaire. Le risque n’est que déplacé.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'Ce cas évalue la gestion du cycle de vie des accès (arrivées, mutations, départs), un point sensible dans toute banque.\n• Arrivée : profil type de la fonction, jamais la copie d’un collègue ancien. Le profil de Mme Kasongo cumulait des droits hérités (Trésorerie, administrateur local) et une délégation personnelle (validation de plus de 50 000 USD) : les copier aurait créé un risque de fraude et rompu la séparation des tâches.\n• Identifiants : compte préparé à l’avance mais activé le jour J, mot de passe temporaire unique, remise en main propre, enrôlement MFA et charte signée.\n• Départ : notification RH, transfert des données professionnelles, désactivation à l’heure exacte (et non suppression), contrôle des accès oubliés, puis suppression au terme de la durée de conservation.\n• Données : les dossiers professionnels et les courriels de clients appartiennent à la banque. On ne les copie pas sur une clé personnelle et on ne les redirige pas vers une adresse personnelle.\n• Matériel : décharge, effacement et réinstallation, inventaire à jour avant toute réaffectation.\n\nLes deux propositions du chef de service partaient d’une bonne intention (gagner du temps), mais chacune créait un risque. Le rôle du support est de proposer une solution aussi rapide et sûre : profil type prêt mercredi, portable réinstallé.\n\nRéflexes à retenir :\n• Moindre privilège, par profils types, avec revue régulière des droits accumulés.\n• Au départ : désactiver d’abord, supprimer plus tard, et tout tracer.\n• Un appareil ne change jamais de main sans effacement et mise à jour de l’inventaire.',
  },
];
