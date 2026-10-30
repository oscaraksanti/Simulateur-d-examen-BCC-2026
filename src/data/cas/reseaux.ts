// Cas pratiques — filière Réseaux et télécommunications (RES-CAS-01 à RES-CAS-04).
// Scénarios fictifs (Banque Alpha, adresses privées et de documentation) ; tous les calculs
// d'adressage, de débit et de durée ont été vérifiés par script (Python, module ipaddress).

import type { CasPratique } from '@/lib/types';

export const casReseaux: CasPratique[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // RES-CAS-01 — Agence de Lubumbashi : fibre coupée, bascule sur le VSAT
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'RES-CAS-01',
    filiere: 'reseaux',
    titre: 'Agence de Lubumbashi coupée du siège : la fibre tombe, le VSAT prend le relais',
    role: 'Ingénieur réseau, centre d’exploitation — Banque Alpha',
    heure: 'Mardi 09h52',
    enjeu:
      'Rétablir des opérations de guichet et des DAB utilisables à Lubumbashi sur le seul lien satellite de secours, puis revenir proprement sur la fibre.',
    contexte:
      'Mardi 20 octobre, 09h52. Le chef d’agence de Lubumbashi, Mme Kabange, appelle le centre d’exploitation : « Depuis dix minutes, le système de tenue de comptes met plus d’une minute à valider une opération, et deux clients attendent au DAB. » L’agence est normalement reliée au siège de Kinshasa par une liaison fibre MPLS de 20 Mbit/s fournie par un opérateur, avec une session eBGP entre le routeur d’agence R-LUB-01 et le routeur de l’opérateur. En secours, un tunnel chiffré passe par un lien satellite VSAT (4 Mbit/s descendant, 2 Mbit/s montant) et une route statique flottante de distance administrative 250 est configurée vers les réseaux du siège. Le jour même, l’agence verse les salaires d’une grande entreprise de la province : la file d’attente s’allonge. Ton responsable, M. Ilunga, veut un diagnostic, un plan d’action et une estimation du risque dans le quart d’heure.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Journal syslog du routeur R-LUB-01 (extrait)',
        lignes: [
          'Oct 20 09:41:58 R-LUB-01 %LINK-3-UPDOWN: Interface GigabitEthernet0/0/0 (WAN-MPLS-FIBRE), changed state to down',
          'Oct 20 09:41:58 R-LUB-01 %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/0, changed state to down',
          'Oct 20 09:41:58 R-LUB-01 %BGP-5-ADJCHANGE: neighbor 172.31.8.1 Down Interface flap',
          'Oct 20 09:41:58 R-LUB-01 %BGP_SESSION-5-ADJCHANGE: neighbor 172.31.8.1 IPv4 Unicast topology base removed from session  Interface flap',
          '# show ip route 10.1.0.0 (09:43) → S 10.1.0.0/16 [250/0] via 172.30.0.1, Tunnel10 (VSAT)',
          '# ping 172.31.8.1 (routeur opérateur) → 0/5 réponses ; ping 10.1.20.15 (serveur central) via Tunnel10 → 5/5, RTT moyen 624 ms',
          '# show interfaces Tunnel10 (09:44) → file de sortie pleine : 1 842 paquets abandonnés en 60 s (file FIFO par défaut, aucune politique QoS appliquée)',
        ],
      },
      {
        type: 'table',
        titre: 'Trafic mesuré sur le tunnel de secours, 09h45-09h50 (NetFlow, Mbit/s)',
        colonnes: ['Flux', 'Montant (agence → siège)', 'Descendant (siège → agence)'],
        lignes: [
          ['Tenue de comptes (postes de guichet, TCP 443)', '0,30', '0,90'],
          ['Monétique (2 DAB vers le serveur monétique)', '0,02', '0,02'],
          ['Voix sur IP (4 appels G.711, 80 kbit/s chacun)', '0,32', '0,32'],
          ['Vidéosurveillance (flux continu vers le siège)', '1,60', '0,05'],
          ['Mises à jour des postes (serveur WSUS du siège)', '0,05', '2,90'],
          ['Messagerie et intranet', '0,20', '0,60'],
          ['Total mesuré', '2,49', '4,79'],
          ['Capacité du lien VSAT', '2,00', '4,00'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Que t’apprend le journal du routeur sur l’origine de la panne et sur l’état du secours ?',
        options: [
          {
            id: 'a',
            texte:
              'Le routeur d’agence R-LUB-01 est en panne : la perte simultanée de l’interface et de la session BGP trahit une défaillance matérielle, il faut l’échanger en urgence par un routeur de rechange.',
            points: 0,
            feedback:
              'Non : le routeur fonctionne, puisqu’il a détecté la chute d’interface, retiré les routes BGP, installé la route flottante et qu’il joint le serveur central par le tunnel (5/5). Changer le matériel ferait perdre du temps et la configuration de secours.',
          },
          {
            id: 'b',
            texte:
              'La session BGP avec le voisin 172.31.8.1 est tombée à cause d’une erreur de configuration chez l’opérateur ; il suffit de la réinitialiser (`clear ip bgp`) pour récupérer les routes apprises.',
            points: 1,
            feedback:
              'La session BGP est bien tombée, mais le message indique « Interface flap » et l’interface physique est passée à down : la cause est sous BGP, au niveau physique ou liaison. Réinitialiser BGP sur une interface coupée ne sert à rien.',
          },
          {
            id: 'c',
            texte:
              'La fibre est tombée au niveau physique, BGP a suivi et la route flottante a basculé le trafic sur le VSAT, qui fonctionne : la lenteur vient du secours saturé.',
            points: 3,
            feedback:
              'Exact. La chronologie est nette : coupure physique à 09:41:58, perte du voisin BGP, retrait des routes apprises, installation de la statique flottante via Tunnel10. La bascule a donc réussi ; ce qui pénalise l’agence, ce sont les 1 842 paquets abandonnés par minute sur un lien satellite saturé.',
          },
          {
            id: 'd',
            texte:
              'La bascule n’a pas fonctionné : les opérations passent encore par la fibre, qui retransmet sans fin sur un lien dégradé, d’où les délais de plus d’une minute.',
            points: 0,
            feedback:
              'Le `show ip route` montre le contraire : la route vers 10.1.0.0/16 est la statique flottante [250/0] via Tunnel10, et le ping du serveur central répond par ce chemin. Lis les éléments de preuve avant de conclure.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'Les opérations de guichet restent très lentes alors que le secours est actif. Que fais-tu sur le routeur d’agence ?',
        options: [
          {
            id: 'a',
            texte:
              'QoS de secours sur le tunnel : lissage au débit réel du VSAT, priorité à la tenue de comptes et à la monétique, voix bornée, vidéo et WSUS bloqués pour l’instant.',
            points: 4,
            feedback:
              'C’est la bonne réponse. Le tableau montre 2,49 Mbit/s demandés pour 2 Mbit/s en montant (125 %) et 4,79 Mbit/s pour 4 Mbit/s en descendant (120 %). Sans la vidéo et WSUS, on retombe à 0,84 et 1,84 Mbit/s (42 % et 46 %). Le lissage au débit du lien est essentiel : sinon la congestion se produit dans le modem satellite, où ta politique QoS ne s’applique pas.',
          },
          {
            id: 'b',
            texte:
              'Je demande au fournisseur VSAT d’augmenter immédiatement le débit du lien de secours : la demande mesurée (2,49 et 4,79 Mbit/s) dépasse sa capacité, il faut donc plus de bande passante.',
            points: 1,
            feedback:
              'C’est une piste pour le moyen terme (et un sujet de dimensionnement à revoir), mais un changement de contrat ne se fait pas en un quart d’heure. Surtout, sans priorisation, un lien plus gros serait lui aussi rempli par la vidéo et les mises à jour.',
          },
          {
            id: 'c',
            texte:
              'Je marque tout le trafic en DSCP EF (46) pour qu’il passe dans la file prioritaire du tunnel et ne soit plus abandonné par la file FIFO du routeur.',
            points: 0,
            feedback:
              'Si tout est prioritaire, rien ne l’est : la priorité stricte deviendrait une simple file FIFO, avec en plus le risque d’affamer les autres classes. La QoS repose sur une classification différenciée.',
          },
          {
            id: 'd',
            texte:
              'Je coupe uniquement la vidéosurveillance : ses 1,60 Mbit/s retirés, le sens montant repasse sous les 2 Mbit/s, cela suffira à libérer le lien.',
            points: 2,
            feedback:
              'Bon réflexe pour le sens montant (2,49 − 1,60 = 0,89 Mbit/s), mais le sens descendant reste saturé par les 2,90 Mbit/s de mises à jour WSUS (4,79 − 0,05 = 4,74 Mbit/s pour 4). Et sans politique QoS, le prochain flux gourmand reproduira le problème.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e3',
        question: 'Remets dans l’ordre ta conduite de l’incident, de 09h52 jusqu’à la clôture.',
        elements: [
          { id: 'retour', texte: 'Revenir sur la fibre de façon contrôlée, une fois la liaison réparée et stable' },
          { id: 'ticket', texte: 'Ouvrir un ticket chez l’opérateur avec les preuves : identifiant du circuit, heure de coupure, état de l’interface' },
          { id: 'qos', texte: 'Appliquer la politique QoS de secours sur le tunnel VSAT et vérifier que les abandons cessent' },
          { id: 'diagnostic', texte: 'Établir le diagnostic : journal du routeur, table de routage, tests vers l’opérateur et vers le siège' },
          { id: 'rapport', texte: 'Rédiger le rapport d’incident : chronologie, durée d’indisponibilité, actions d’amélioration' },
          { id: 'consignes', texte: 'Donner des consignes à l’agence : opérations prioritaires, appels limités, pas de transferts lourds' },
        ],
        ordreCorrect: ['diagnostic', 'ticket', 'qos', 'consignes', 'retour', 'rapport'],
        pointsMax: 4,
        feedback:
          'On diagnostique d’abord pour savoir à qui confier la réparation : la coupure est physique, côté opérateur, donc le ticket part tout de suite (le délai de réparation court dès son ouverture). Pendant que l’opérateur intervient, tu rends le secours exploitable (QoS) puis tu informes l’agence de ce qui est possible. Le retour sur la fibre n’intervient qu’après réparation et stabilisation, et le rapport clôt l’incident.',
      },
      {
        type: 'choix',
        id: 'e4',
        question:
          'Un logiciel de l’agence télécharge un fichier de 25 Mo depuis le siège avec une fenêtre TCP fixe de 65 535 octets (sans option window scaling). Même une fois la QoS en place et le lien descendant peu chargé, le débit plafonne vers 0,85 Mbit/s. Pourquoi ?',
        options: [
          {
            id: 'a',
            texte:
              'Le chiffrement du tunnel consomme l’essentiel de la bande passante : en-têtes, bourrage et calcul cryptographique sur le routeur d’agence réduisent le débit utile à un quart du lien.',
            points: 0,
            feedback:
              'Le chiffrement ajoute quelques dizaines d’octets d’en-tête par paquet, soit quelques pour cent de surcoût, pas une division par quatre du débit.',
          },
          {
            id: 'b',
            texte:
              'Le lien satellite perd beaucoup de paquets : chaque perte divise par deux la fenêtre de congestion de TCP, qui ne remonte que lentement avec un RTT de 620 ms.',
            points: 1,
            feedback:
              'Les pertes dégradent effectivement TCP, mais elles ont cessé avec la QoS. Le plafond observé est stable et correspond exactement à la limite fixée par la fenêtre et le délai : c’est elle qu’il faut d’abord expliquer.',
          },
          {
            id: 'c',
            texte:
              'Le serveur du siège est trop lent pour envoyer le fichier plus vite : ses disques, sollicités en même temps par toutes les agences, ne suivent pas le rythme demandé.',
            points: 0,
            feedback:
              'Le même serveur sert les agences reliées en fibre à pleine vitesse. Le facteur qui change ici, c’est le délai aller-retour du satellite.',
          },
          {
            id: 'd',
            texte:
              'Une fenêtre par aller-retour : 65 535 × 8 / 0,62 s ≈ 0,85 Mbit/s. Il faut le window scaling ou l’accélération TCP du VSAT.',
            points: 3,
            feedback:
              'Exact : c’est le produit débit × délai. Avec un RTT de 620 ms, une fenêtre de 64 Kio limite le débit à environ 0,85 Mbit/s, quel que soit le débit du lien. Le fichier de 25 Mo prend donc près de 4 minutes au lieu d’environ 1 minute à 3,5 Mbit/s. C’est une propriété de TCP sur les liens à long délai, pas une panne.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e5',
        question:
          'À 13h20, l’opérateur annonce la fibre réparée. Dans les quatre minutes suivantes, l’interface GigabitEthernet0/0/0 passe trois fois de up à down. Que fais-tu ?',
        options: [
          {
            id: 'a',
            texte:
              'Je reviens tout de suite sur la fibre : 20 Mbit/s valent mieux que le satellite, même si la liaison hoquette, et la route flottante reprendra le relais à chaque coupure.',
            points: 0,
            feedback:
              'Une liaison qui bat (flapping) fait basculer le trafic dans les deux sens à chaque coupure : sessions applicatives rompues, reconvergence BGP répétée, opérations de guichet interrompues. C’est pire qu’un secours lent mais stable.',
          },
          {
            id: 'b',
            texte:
              'Je reste sur le VSAT, je signale l’instabilité à l’opérateur avec les horodatages, j’exige une période de stabilité testée et j’active le dampening avant de revenir sur la fibre à un moment calme.',
            points: 3,
            feedback:
              'C’est la bonne pratique : on ne rebascule que sur une liaison stable et validée, au moment où l’impact métier est le plus faible. Le dampening évite que de futures oscillations ne réinjectent sans cesse la route principale. Après le retour, tu retires la politique de secours devenue inutile et tu vérifies les abandons et les temps de réponse.',
          },
          {
            id: 'c',
            texte:
              'Je désactive définitivement la fibre et je laisse l’agence sur le VSAT jusqu’au changement d’opérateur : une liaison instable après réparation n’est plus digne de confiance.',
            points: 0,
            feedback:
              'Réaction disproportionnée : un lien de 4/2 Mbit/s avec 620 ms de délai n’est pas fait pour le fonctionnement normal d’une agence. L’instabilité après réparation se traite avec l’opérateur, dans le cadre de son engagement de service.',
          },
          {
            id: 'd',
            texte:
              'J’attends que l’interface remonte et je laisse BGP décider seul du chemin : ses temporisateurs et la route flottante gèrent déjà les bascules automatiquement.',
            points: 1,
            feedback:
              'BGP reconvergera bien automatiquement, mais à chaque battement : le protocole ne juge pas la qualité d’un lien qui monte et descend. Sans amortissement ni validation, tu subis les oscillations au lieu de les maîtriser.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'La compétence évaluée est de distinguer la panne initiale (la fibre) du problème que vivent les utilisateurs (un secours saturé).\n• Diagnostic : le journal montre une chute physique de GigabitEthernet0/0/0 à 09:41:58, la perte du voisin BGP 172.31.8.1 (« Interface flap »), puis l’installation de la route statique flottante [250/0] via Tunnel10. La bascule a donc fonctionné : c’est le principe de la distance administrative, la statique à 250 n’est retenue que lorsque les routes eBGP (distance 20) disparaissent.\n• Cause des lenteurs : 2,49 Mbit/s demandés pour 2 Mbit/s en montant (125 %) et 4,79 pour 4 en descendant (120 %), d’où une file FIFO pleine et 1 842 paquets abandonnés par minute.\n• Remède : lissage au débit réel du lien, priorité à la tenue de comptes et à la monétique, voix bornée, blocage temporaire de la vidéo et des mises à jour. Sans ces deux flux, on redescend à 0,84 et 1,84 Mbit/s, soit 42 % et 46 % de charge.\n• Limite propre au satellite : avec un RTT d’environ 620 ms, une fenêtre TCP de 65 535 octets plafonne à 0,85 Mbit/s ; il faut une fenêtre d’au moins 310 000 octets pour remplir 4 Mbit/s (window scaling, accélération TCP).\n• Retour à la normale : jamais sur une liaison qui bat ; période de stabilité, tests, dampening, puis retour à un moment calme.\n\nLe piège principal est de croire que « le secours a pris le relais » signifie « le service est rétabli » : un lien de secours se dimensionne et se configure pour les seuls flux critiques, et cette politique doit être prête et testée avant l’incident. Le second piège est de vouloir revenir trop vite sur la fibre.\n\nUn jury de banque attend une lecture rigoureuse des preuves (journal, table de routage, mesures), un raisonnement chiffré et une priorisation guidée par le métier : les paiements et les DAB d’abord.\n\nRéflexes à retenir :\n• Une route flottante n’est utile que si le lien de secours est préparé : QoS de secours écrite et testée à l’avance.\n• Toujours lisser au débit réel du lien, sinon la file d’attente se forme dans un équipement que tu ne maîtrises pas.\n• Débit TCP maximal ≈ fenêtre / RTT : sur satellite, la fenêtre compte autant que la bande passante.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // RES-CAS-02 — Plan d'adressage de la nouvelle agence de Kisangani
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'RES-CAS-02',
    filiere: 'reseaux',
    titre: 'Plan d’adressage de la nouvelle agence de Kisangani',
    role: 'Ingénieur réseau, projets d’agences — Banque Alpha',
    heure: 'Mercredi 14h00',
    enjeu:
      'Livrer avant vendredi un plan d’adressage et de VLAN pour la future agence de Kisangani qui tienne dans le bloc attribué, sépare les usages et protège les DAB.',
    contexte:
      'Banque Alpha ouvre une agence à Kisangani dans six semaines. L’équipe d’architecture t’a attribué le bloc 10.42.16.0/23 (512 adresses), à ne pas dépasser car les blocs voisins sont réservés à d’autres agences. Le chef de projet, M. Bolamba, t’a transmis la fiche des besoins, croissance déjà comprise. Un collègue propose de « tout mettre dans un seul réseau, ce sera plus simple ». Le responsable de la sécurité, Mme Nsimba, rappelle que les DAB doivent être isolés et que le Wi-Fi invités ne doit jamais toucher le réseau interne. Ton plan sera revu vendredi par le comité d’architecture, puis appliqué par l’intégrateur sur place.',
    piecesJointes: [
      {
        type: 'table',
        titre: 'Fiche des besoins — agence de Kisangani (croissance comprise)',
        colonnes: ['Usage', 'VLAN prévu', 'Équipements à adresser', 'Remarque'],
        lignes: [
          ['Postes de travail (guichet, back-office)', '10', 100, 'Accès aux applications centrales'],
          ['Téléphones IP', '20', 100, 'Un téléphone par poste, PC branché derrière le téléphone'],
          ['Wi-Fi invités (clients en salle d’attente)', '50', 60, 'Accès Internet uniquement'],
          ['Caméras de vidéosurveillance', '30', 24, 'Flux vers l’enregistreur central'],
          ['Administration (commutateurs, bornes, onduleurs)', '99', 10, 'Accès réservé à l’équipe réseau'],
          ['DAB', '40', 4, 'Flux uniquement vers le serveur monétique'],
        ],
      },
      {
        type: 'texte',
        titre: 'Message de Mme Nsimba (sécurité) — 13h48',
        contenu:
          'Bonjour,\n\nPour Kisangani, trois exigences non négociables :\n• les DAB ne doivent pouvoir joindre que le serveur monétique du siège, sur le seul port applicatif prévu ;\n• le Wi-Fi invités sort vers Internet sans jamais pouvoir joindre un réseau interne ;\n• chaque sous-réseau doit être documenté dans l’outil de gestion des adresses (IPAM) avant la mise en service.\n\nMerci,\nMme Nsimba',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quelle architecture d’adressage retiens-tu pour l’agence ?',
        options: [
          {
            id: 'a',
            texte:
              'Un seul VLAN et un seul réseau 10.42.16.0/23 pour tous les équipements : c’est simple, il y a de la place pour 510 hôtes et un réseau unique facilite le dépannage.',
            points: 0,
            feedback:
              'La place ne suffit pas : un réseau à plat met les DAB, les caméras et les invités dans le même domaine de diffusion que les postes. Aucune isolation n’est possible, une seule machine compromise voit tout le monde, et les exigences de Mme Nsimba sont violées.',
          },
          {
            id: 'b',
            texte:
              'Un VLAN par usage et par niveau de confiance, chacun avec un sous-réseau à sa taille (VLSM) dans le /23, et un filtrage inter-VLAN limité aux flux nécessaires.',
            points: 3,
            feedback:
              'C’est la bonne approche : segmentation par usage et par niveau de confiance, sous-réseaux de taille variable pour économiser le bloc, et règles inter-VLAN explicites. Elle répond directement aux exigences de sécurité sur les DAB et les invités.',
          },
          {
            id: 'c',
            texte:
              'Deux VLAN seulement : un VLAN interne pour tout le personnel et ses équipements, un VLAN invités qui ne sort que vers Internet, comme le demande Mme Nsimba.',
            points: 1,
            feedback:
              'Isoler les invités est un bon début, mais les DAB, les caméras et les équipements d’administration resteraient mélangés aux postes. On ne pourrait pas limiter les DAB au seul serveur monétique.',
          },
          {
            id: 'd',
            texte:
              'Un VLAN par étage du bâtiment, chacun avec son sous-réseau et sa passerelle, pour limiter la taille des domaines de diffusion et simplifier le câblage.',
            points: 1,
            feedback:
              'Découper par emplacement physique ne sépare pas les usages : un DAB et un poste du même étage partageraient le même réseau. On découpe d’abord par fonction et par niveau de confiance.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Quel plan d’adressage VLSM proposes-tu au comité ?',
        options: [
          {
            id: 'a',
            texte:
              'Postes 10.42.16.0/26, voix 10.42.16.64/26, invités 10.42.16.128/26, caméras 10.42.16.192/27, administration 10.42.16.224/28, DAB 10.42.16.240/29 ; tout tient dans 10.42.16.0/24 et 10.42.17.0/24 reste libre.',
            points: 0,
            feedback:
              'Les sous-réseaux sont bien alignés, mais un /26 n’offre que 62 adresses d’hôtes : impossible d’y loger 100 postes ou 100 téléphones. Toujours vérifier la capacité (2^(32 − préfixe) − 2) avant l’alignement.',
          },
          {
            id: 'b',
            texte:
              'Postes 10.42.16.0/25, voix 10.42.16.128/25, invités 10.42.17.0/26, caméras 10.42.17.48/27, administration 10.42.17.96/28, DAB 10.42.17.112/29 ; réserve libre : 10.42.17.120/29 et 10.42.17.128/25.',
            points: 1,
            feedback:
              'Les tailles sont justes, mais 10.42.17.48/27 n’est pas un réseau valide : un /27 commence sur un multiple de 32 (.0, .32, .64…). En corrigeant à .32, il chevaucherait les invités (10.42.17.0/26 couvre .0 à .63). D’où la règle : allouer du plus grand au plus petit.',
          },
          {
            id: 'c',
            texte:
              'Un /24 par VLAN, pour une marge de croissance confortable et des adresses lisibles : postes 10.42.16.0/24, voix 10.42.17.0/24, invités 10.42.18.0/24, caméras 10.42.19.0/24, administration 10.42.20.0/24, DAB 10.42.21.0/24.',
            points: 1,
            feedback:
              'La segmentation est la bonne, mais six /24 font 1 536 adresses pour un bloc de 512 : dès le troisième, on déborde sur les blocs d’autres agences. Les doublons d’adresses qui en résulteraient seraient très difficiles à diagnostiquer.',
          },
          {
            id: 'd',
            texte:
              'Postes 10.42.16.0/25, voix 10.42.16.128/25, invités 10.42.17.0/26, caméras 10.42.17.64/27, administration 10.42.17.96/28, DAB 10.42.17.112/29 ; réserve libre et contiguë : 10.42.17.120/29 et 10.42.17.128/25.',
            points: 4,
            feedback:
              'Exact. Chaque sous-réseau couvre le besoin plus la passerelle (126 ≥ 101, 62 ≥ 61, 30 ≥ 25, 14 ≥ 11, 6 ≥ 5), tous sont alignés et sans chevauchement, et l’ensemble utilise 376 adresses sur 512. La réserve de 136 adresses reste en blocs contigus et réutilisables.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question:
          'Lors de la recette, l’intégrateur signale qu’une caméra configurée en 10.42.17.95/27, passerelle 10.42.17.65, ne communique pas. Quelle est la cause ?',
        options: [
          {
            id: 'a',
            texte:
              '.95 est l’adresse de diffusion de 10.42.17.64/27 (hôtes .65 à .94) : il faut changer l’adresse de la caméra.',
            points: 3,
            feedback:
              'Exact. Dans 10.42.17.64/27, .64 est l’adresse de réseau, .95 l’adresse de diffusion, et seules .65 à .94 (30 adresses) sont attribuables. La passerelle étant .65, les caméras peuvent prendre .66 à .94, ce qui laisse de la marge pour 24 caméras.',
          },
          {
            id: 'b',
            texte:
              'Le masque /27 est trop petit pour 24 caméras plus la passerelle et les extensions prévues ; il faut passer en /26 pour disposer de 62 adresses.',
            points: 0,
            feedback:
              'Un /27 compte 30 adresses d’hôtes : assez pour 24 caméras et la passerelle. Agrandir le réseau chevaucherait les invités (10.42.17.0/26) et ne corrigerait pas l’adresse invalide.',
          },
          {
            id: 'c',
            texte:
              'Un conflit d’adresse avec la passerelle 10.42.17.65 : deux équipements du même /27 répondent aux requêtes ARP et la caméra perd la course.',
            points: 1,
            feedback:
              'Vérifier les doublons (table ARP, ping avant affectation) est un bon réflexe en général, mais .95 et .65 sont deux adresses différentes. Le vrai problème est que .95 n’est pas une adresse d’hôte.',
          },
          {
            id: 'd',
            texte:
              'Les caméras doivent obligatoirement être en DHCP : une adresse fixe ne peut pas fonctionner, car l’enregistreur central ne les découvre que par leur bail.',
            points: 0,
            feedback:
              'Une adresse fixe fonctionne très bien si elle est valide ; on utilise même souvent des adresses fixes ou des réservations DHCP pour des équipements comme les caméras. Le problème vient de l’adresse choisie.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre les étapes de mise en place du réseau de l’agence.',
        elements: [
          { id: 'acl', texte: 'Écrire et appliquer les règles de filtrage entre VLAN (DAB, invités, administration)' },
          { id: 'besoins', texte: 'Recenser les besoins par usage, croissance comprise' },
          { id: 'tests', texte: 'Tester chaque flux autorisé et interdit, puis documenter le plan dans l’IPAM' },
          { id: 'vlsm', texte: 'Calculer les sous-réseaux, du plus grand au plus petit' },
          { id: 'passerelles', texte: 'Configurer les interfaces de passerelle (SVI) et le relais DHCP de chaque VLAN' },
          { id: 'vlan', texte: 'Créer les VLAN sur les commutateurs et les liens trunk 802.1Q' },
        ],
        ordreCorrect: ['besoins', 'vlsm', 'vlan', 'passerelles', 'acl', 'tests'],
        pointsMax: 4,
        feedback:
          'Les besoins fixent les tailles, les tailles fixent le découpage VLSM (du plus grand au plus petit pour garder des blocs alignés). On construit ensuite le niveau 2 (VLAN et trunks), puis le niveau 3 (passerelles, DHCP). Le filtrage ne peut s’écrire qu’une fois les réseaux connus, et les tests valident à la fois ce qui doit passer et ce qui doit être bloqué avant la mise en service et la documentation.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Comment sécurises-tu le VLAN 40 des DAB (10.42.17.112/29) ?',
        options: [
          {
            id: 'a',
            texte:
              'Je place les DAB dans le VLAN des postes, avec un antivirus à jour et un pare-feu local sur chaque DAB : la protection se fait au niveau de l’équipement lui-même.',
            points: 0,
            feedback:
              'Un antivirus ne remplace pas une isolation réseau. Dans le VLAN des postes, un poste compromis pourrait attaquer directement les DAB, ce qui contredit l’exigence de la sécurité.',
          },
          {
            id: 'b',
            texte:
              'Je leur donne un accès Internet par NAT pour qu’ils récupèrent eux-mêmes les correctifs de l’éditeur : un DAB à jour est mieux protégé qu’un DAB isolé.',
            points: 0,
            feedback:
              'Ouvrir Internet à des DAB les expose inutilement. Les mises à jour se distribuent depuis un serveur interne maîtrisé, par un flux explicitement autorisé.',
          },
          {
            id: 'c',
            texte:
              'Liste blanche sur le VLAN 40 : seuls l’adresse et le port du serveur monétique sont autorisés, tout le reste est refusé ; prises protégées par 802.1X ou port-security.',
            points: 3,
            feedback:
              'C’est le principe du moindre privilège appliqué au réseau : liste blanche des flux strictement nécessaires, refus par défaut, protection de la prise physique. C’est aussi ce qu’attendent les référentiels du secteur des cartes de paiement pour l’environnement monétique.',
          },
          {
            id: 'd',
            texte:
              'Je crée le VLAN 40 isolé, avec une règle qui autorise tout le trafic vers les réseaux du siège, puisque le serveur monétique s’y trouve et que ce sont des réseaux de confiance.',
            points: 1,
            feedback:
              'Le VLAN séparé est un progrès, mais « tout vers le siège » laisse les DAB joindre des centaines de serveurs qui ne les concernent pas. Le filtrage doit viser la destination et le port précis du serveur monétique.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e6',
        question:
          'Chaque poste est branché derrière un téléphone IP, sur une seule prise murale. Comment configures-tu le port du commutateur ?',
        options: [
          {
            id: 'a',
            texte:
              'Je mets le téléphone et le PC dans le même VLAN 10 : c’est un seul câble, donc un seul port d’accès, et cela évite de gérer un VLAN de plus sur le commutateur.',
            points: 0,
            feedback:
              'La voix perdrait sa séparation et sa priorité : les téléphones partageraient le domaine de diffusion des postes, et le VLAN 20 prévu au plan ne servirait plus à rien.',
          },
          {
            id: 'b',
            texte:
              'Je configure le port en trunk 802.1Q qui transporte tous les VLAN de l’agence : le téléphone et le PC y trouvent chacun le leur, sans réglage prise par prise.',
            points: 1,
            feedback:
              'Cela fonctionnerait techniquement, mais un trunk ouvert sur une prise utilisateur expose tous les VLAN, y compris DAB et administration, à quiconque branche un équipement capable de marquer ses trames.',
          },
          {
            id: 'c',
            texte:
              'Je fais tirer un deuxième câble jusqu’à chaque bureau pour séparer physiquement téléphone et PC : aucune erreur de configuration ne pourra annuler cette séparation.',
            points: 1,
            feedback:
              'C’est une séparation valable, mais coûteuse et inutile : le VLAN voix est fait précisément pour partager une prise entre téléphone et PC sans perdre la séparation logique.',
          },
          {
            id: 'd',
            texte:
              'Port d’accès en VLAN 10 pour le PC, VLAN voix 20 annoncé au téléphone (LLDP-MED ou CDP), marquage EF accepté du seul téléphone.',
            points: 3,
            feedback:
              'Exact : une seule prise, deux réseaux logiques. Le PC reste dans le VLAN de données non marqué, le téléphone apprend son VLAN voix par LLDP-MED ou CDP, et la confiance accordée au marquage EF permet de prioriser la voix sans laisser un PC s’auto-attribuer la priorité.',
          },
        ],
      },
    ],
    pointsMax: 20,
    debrief:
      'La compétence évaluée est de traduire des besoins métier et des exigences de sécurité en un plan d’adressage exact et défendable.\n• Segmentation : un VLAN par usage et par niveau de confiance (postes, voix, invités, caméras, administration, DAB), avec un filtrage inter-VLAN en liste blanche. Un réseau à plat ou découpé par étage ne permet pas d’isoler les DAB ni les invités.\n• Dimensionnement : nombre d’hôtes d’un préfixe = 2^(32 − préfixe) − 2, et il faut compter la passerelle. 100 postes + 1 → /25 (126) ; 60 invités + 1 → /26 (62) ; 24 caméras + 1 → /27 (30) ; 10 équipements + 1 → /28 (14) ; 4 DAB + 1 → /29 (6).\n• Allocation : du plus grand au plus petit, ce qui garantit l’alignement. Plan retenu : 10.42.16.0/25, 10.42.16.128/25, 10.42.17.0/26, 10.42.17.64/27, 10.42.17.96/28, 10.42.17.112/29, soit 376 adresses sur 512, avec une réserve de 10.42.17.120/29 et 10.42.17.128/25.\n• Pièges : un /26 ne contient pas 100 hôtes ; 10.42.17.48/27 n’est pas un réseau valide ; six /24 ne tiennent pas dans un /23 ; .95 est la diffusion de 10.42.17.64/27.\n• Sécurité : DAB limités au serveur monétique (adresse et port), invités limités à Internet, prises protégées et prises inutilisées désactivées.\n• Voix : VLAN voix annoncé par LLDP-MED ou CDP sur un port d’accès, marquage EF accepté seulement du téléphone.\n\nUn jury de banque attend des calculs justes au premier coup, une justification par la sécurité (moindre privilège) et une documentation systématique dans l’IPAM, car une erreur d’adressage dans une agence se paie en heures de diagnostic.\n\nRéflexes à retenir :\n• Vérifie chaque sous-réseau : réseau, première et dernière adresse utilisables, diffusion.\n• Alloue du plus grand au plus petit et garde la réserve en blocs contigus.\n• Écris d’abord les flux autorisés, puis refuse tout le reste.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // RES-CAS-03 — Tempête de diffusion au siège : boucle par un mini-commutateur
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'RES-CAS-03',
    filiere: 'reseaux',
    titre: 'Tempête de diffusion au 2e étage : un mini-commutateur crée une boucle',
    role: 'Ingénieur réseau d’astreinte, siège de Kinshasa — Banque Alpha',
    heure: 'Jeudi 10h16',
    enjeu:
      'Arrêter la tempête de diffusion qui paralyse tout un étage du siège, comprendre pourquoi le Spanning Tree ne l’a pas empêchée et éviter qu’elle se reproduise.',
    contexte:
      'Jeudi 22 octobre, 10h16. Le centre de support reçoit une avalanche d’appels du 2e étage du siège : plus aucun poste n’accède aux applications, les téléphones IP coupent, et les voyants du commutateur d’étage SW-ETG2-01 clignotent en continu. La supervision indique un processeur à 99 % sur ce commutateur et une forte hausse du trafic de diffusion sur le lien qui le relie au cœur de réseau. Le SSH vers SW-ETG2-01 expire, mais le câble console est accessible dans le local technique de l’étage. Un agent du service formation indique qu’il a « installé un petit switch pour la salle de formation, avec deux câbles vers deux prises murales pour avoir plus de débit ». Le directeur informatique, M. Mbuyi, veut un retour à la normale rapide et une explication claire.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'Syslog de SW-ETG2-01 (extrait, reçu par le serveur de journaux)',
        lignes: [
          'Oct 22 10:14:31 SW-ETG2-01 %LINK-3-UPDOWN: Interface GigabitEthernet1/0/15, changed state to up',
          'Oct 22 10:14:33 SW-ETG2-01 %SW_MATM-4-MACFLAP_NOTIF: Host 0011.2f3a.9c01 in vlan 10 is flapping between port Gi1/0/48 and port Gi1/0/14',
          'Oct 22 10:14:33 SW-ETG2-01 %SW_MATM-4-MACFLAP_NOTIF: Host 0011.2f3a.9c01 in vlan 10 is flapping between port Gi1/0/14 and port Gi1/0/15',
          'Oct 22 10:14:34 SW-ETG2-01 %SW_MATM-4-MACFLAP_NOTIF: Host 0050.56a1.0b2c in vlan 10 is flapping between port Gi1/0/15 and port Gi1/0/14',
          'Oct 22 10:14:36 SW-ETG2-01 %SW_MATM-4-MACFLAP_NOTIF: Host 00e0.4c68.21aa in vlan 10 is flapping between port Gi1/0/03 and port Gi1/0/15',
          '# 0011.2f3a.9c01 = adresse MAC de la passerelle du VLAN 10 (cœur de réseau, joint par la liaison montante Gi1/0/48)',
          '# Aucun message de changement de topologie Spanning Tree enregistré depuis 10:14',
        ],
      },
      {
        type: 'table',
        titre: 'Compteurs des interfaces de SW-ETG2-01 à 10h15 (liens à 1 Gbit/s)',
        colonnes: ['Port', 'Description', 'VLAN', 'Entrée (%)', 'Sortie (%)', 'Diffusions reçues/s'],
        lignes: [
          ['Gi1/0/03', 'Poste utilisateur', '10', '1', '96', '35'],
          ['Gi1/0/14', 'Prise murale B2-14 (salle de formation)', '10', '96', '96', '94 200'],
          ['Gi1/0/15', 'Prise murale B2-15 (salle de formation)', '10', '96', '96', '94 150'],
          ['Gi1/0/22', 'Poste utilisateur', '10', '1', '96', '28'],
          ['Gi1/0/48', 'Liaison montante vers le cœur', 'trunk', '4', '93', '410'],
        ],
      },
      {
        type: 'texte',
        titre: 'Gabarit appliqué aux ports d’accès de SW-ETG2-01 (show running-config, extrait)',
        contenu:
          'interface range GigabitEthernet1/0/1 - 44\n switchport mode access\n switchport access vlan 10\n switchport voice vlan 20\n spanning-tree portfast\n spanning-tree bpdufilter enable\n!\n# Commentaire laissé dans le gabarit : « bpdufilter ajouté pour éviter les messages STP sur les ports utilisateurs »',
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Quel diagnostic poses-tu à partir des journaux et des compteurs ?',
        options: [
          {
            id: 'a',
            texte:
              'Une boucle de niveau 2 entre Gi1/0/14 et Gi1/0/15 via le mini-commutateur : les trames de diffusion tournent sans fin et inondent tous les ports du VLAN 10.',
            points: 4,
            feedback:
              'Exact. Les deux ports de la salle de formation reçoivent chacun environ 94 000 diffusions par seconde à 96 % de charge, les postes normaux sont saturés en sortie (96 %) par l’inondation, et la MAC de la passerelle apparaît sur Gi1/0/14 et Gi1/0/15 alors qu’elle se trouve derrière Gi1/0/48. Le branchement de Gi1/0/15 à 10:14:31 précède de deux secondes les premiers messages.',
          },
          {
            id: 'b',
            texte:
              'Une attaque par usurpation ARP (ARP spoofing) visant la passerelle 0011.2f3a.9c01 : sa MAC apparaît sur des ports d’accès où elle ne devrait jamais se trouver.',
            points: 1,
            feedback:
              'Une MAC qui change de port peut faire penser à une usurpation, mais ici c’est la même MAC qui oscille entre deux ports voisins, au rythme de la boucle, avec un trafic de diffusion massif. Une usurpation ARP n’explique ni les 96 % de charge ni l’inondation de tout le VLAN.',
          },
          {
            id: 'c',
            texte:
              'Une panne de la liaison montante Gi1/0/48 vers le cœur de réseau : les postes ne joignent plus la passerelle et multiplient les requêtes ARP en diffusion.',
            points: 0,
            feedback:
              'La liaison montante fonctionne : elle transmet même 93 % de trafic vers le cœur. C’est d’ailleurs par elle que la tempête menace de se propager aux autres étages.',
          },
          {
            id: 'd',
            texte:
              'Un virus qui se propage sur les postes du 2e étage et inonde le réseau de trames de diffusion à la recherche de nouvelles machines à infecter.',
            points: 0,
            feedback:
              'Les postes utilisateurs n’envoient presque rien (1 % en entrée, quelques dizaines de diffusions par seconde) : ils subissent la tempête, ils ne la créent pas. Tout part des deux ports de la salle de formation.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question: 'Il est 10h18. Quelle est ta première action ?',
        options: [
          {
            id: 'a',
            texte:
              'Redémarrer le commutateur SW-ETG2-01 pour vider ses tables et faire baisser le processeur, ce qui rendra la main en SSH pour analyser la situation à froid.',
            points: 0,
            feedback:
              'Au redémarrage, les deux ports remontent et la boucle se reforme en quelques secondes : tout l’étage aura subi une coupure supplémentaire pour rien. On supprime d’abord la cause.',
          },
          {
            id: 'b',
            texte:
              'Attendre quelques minutes que le Spanning Tree converge et bloque un des ports : intervenir pendant la convergence risquerait de déstabiliser la topologie.',
            points: 0,
            feedback:
              'Le journal ne montre aucun changement de topologie STP, et le gabarit filtre les BPDU sur ces ports : le Spanning Tree ne voit pas la boucle et ne la bloquera jamais. Attendre prolonge la paralysie.',
          },
          {
            id: 'c',
            texte:
              'En console, désactiver Gi1/0/14 et Gi1/0/15, vérifier que les MACFLAP cessent et que la charge retombe, puis faire retirer le mini-commutateur sur place.',
            points: 3,
            feedback:
              'C’est la bonne action : couper un seul des deux ports suffit à ouvrir la boucle, couper les deux isole complètement l’équipement non autorisé. La console contourne la saturation du plan de gestion. On vérifie aussitôt l’effet, puis on traite la cause physique.',
          },
          {
            id: 'd',
            texte:
              'Débrancher la liaison montante Gi1/0/48 pour protéger le reste du siège : la tempête reste contenue à l’étage et ne peut plus atteindre le cœur.',
            points: 1,
            feedback:
              'Cela empêche la tempête de se propager aux autres étages, mais le 2e étage reste paralysé et coupé du reste du réseau. C’est une mesure de dernier recours si la console était inaccessible, pas la première action.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Pourquoi le Spanning Tree n’a-t-il pas bloqué cette boucle ?',
        options: [
          {
            id: 'a',
            texte:
              'Parce que `spanning-tree portfast` désactive le Spanning Tree sur le port : il passe directement en transmission et ignore ensuite les BPDU qu’il reçoit.',
            points: 1,
            feedback:
              'Non : PortFast fait seulement passer le port directement à l’état de transmission sans attendre les étapes d’écoute et d’apprentissage. Le port continue d’envoyer des BPDU et, s’il en reçoit, il perd son statut PortFast. Ce n’est pas la cause.',
          },
          {
            id: 'b',
            texte:
              'Parce que le BPDU filter d’interface supprime l’envoi et la lecture des BPDU : le Spanning Tree ne voit pas la boucle.',
            points: 3,
            feedback:
              'Exact. Appliqué directement sur une interface, le BPDU filter supprime l’envoi et la prise en compte des BPDU : c’est l’équivalent d’un STP désactivé sur le port. Le commutateur ne reçoit jamais ses propres BPDU par l’autre port et laisse les deux ports en transmission. Ajouter ce filtre « pour éviter les messages » a retiré la protection contre les boucles.',
          },
          {
            id: 'c',
            texte:
              'Parce que le pont racine du Spanning Tree n’est pas placé sur le cœur de réseau : le commutateur d’étage, mal positionné, ne sait plus quel port bloquer.',
            points: 0,
            feedback:
              'Un pont racine mal placé donne des chemins sous-optimaux, mais le Spanning Tree bloquerait tout de même une boucle. Le journal ne montre d’ailleurs aucune activité STP : le protocole n’intervient tout simplement pas sur ces ports.',
          },
          {
            id: 'd',
            texte:
              'Parce que le RSTP est trop lent pour réagir à une boucle créée en quelques secondes : ses phases d’écoute et d’apprentissage durent plus de 30 secondes.',
            points: 0,
            feedback:
              'Le RSTP converge généralement en quelques secondes au plus. Or la tempête dure depuis plusieurs minutes sans aucun changement de topologie : la lenteur n’est pas en cause, le protocole ne voit pas la boucle.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre ton plan, de la crise jusqu’à la prévention.',
        elements: [
          { id: 'retex', texte: 'Retour d’expérience : rappel de la politique sur les équipements non autorisés, procédure de demande pour les salles de formation' },
          { id: 'couper', texte: 'Désactiver en console les ports Gi1/0/14 et Gi1/0/15' },
          { id: 'gabarit', texte: 'Corriger le gabarit des ports d’accès : retirer le BPDU filter, activer le BPDU guard et le contrôle des tempêtes (storm-control)' },
          { id: 'retirer', texte: 'Retirer physiquement le mini-commutateur de la salle de formation' },
          { id: 'verifier', texte: 'Réactiver les ports et vérifier : table MAC stable, charge et processeur normaux, postes et téléphones fonctionnels' },
        ],
        ordreCorrect: ['couper', 'retirer', 'verifier', 'gabarit', 'retex'],
        pointsMax: 4,
        feedback:
          'On ouvre d’abord la boucle pour rendre le service, puis on supprime sa cause physique avant de réactiver les ports : sinon la tempête repart. La vérification confirme le retour à la normale. Vient ensuite la correction structurelle (gabarit) sur tous les commutateurs concernés, de préférence dans une fenêtre de changement, et enfin le retour d’expérience qui traite la cause humaine.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle configuration types-tu pour les ports d’accès utilisateurs de tous les étages ?',
        options: [
          {
            id: 'a',
            texte:
              'Désactiver complètement le Spanning Tree sur les commutateurs d’étage pour éviter tout message parasite : une topologie en étoile vers le cœur ne comporte de toute façon aucune boucle.',
            points: 0,
            feedback:
              'C’est aggraver la faute d’origine : sans Spanning Tree, toute erreur de câblage, y compris entre commutateurs, crée une tempête comme celle d’aujourd’hui.',
          },
          {
            id: 'b',
            texte:
              'Garder PortFast et le BPDU filter, et ajouter seulement une alerte de supervision sur le processeur des commutateurs, pour intervenir en console dès les premières secondes d’une tempête.',
            points: 0,
            feedback:
              'L’alerte préviendrait plus vite, mais la boucle se reproduirait à l’identique : rien n’empêche la tempête. La détection ne remplace pas la protection.',
          },
          {
            id: 'c',
            texte:
              'Retirer le BPDU filter et compter sur le Spanning Tree classique, sans autre mesure : les BPDU de nouveau échangés, toute boucle sera détectée et bloquée.',
            points: 1,
            feedback:
              'C’est mieux que la situation actuelle, mais certains mini-commutateurs ne relaient pas les BPDU : le Spanning Tree ne verrait toujours pas la boucle. Il faut des protections complémentaires sur les ports d’accès.',
          },
          {
            id: 'd',
            texte:
              'PortFast avec BPDU guard, storm-control sur la diffusion et la multidiffusion, limite d’adresses MAC par port (port-security ou 802.1X), pont racine fixé sur le cœur et procédure err-disabled documentée.',
            points: 3,
            feedback:
              'C’est la défense en profondeur attendue. Le BPDU guard coupe le port si un commutateur qui relaie les BPDU est branché ; le storm-control limite la tempête si l’équipement ne les relaie pas ; la limitation des adresses MAC repère un commutateur caché derrière une prise ; la priorité fixe garantit une topologie prévisible.',
          },
        ],
      },
    ],
    pointsMax: 17,
    debrief:
      'La compétence évaluée est de reconnaître une boucle de niveau 2, de l’arrêter vite et d’en comprendre la cause racine.\n• Signes d’une boucle : adresses MAC qui oscillent entre deux ports (MACFLAP), dont celle de la passerelle pourtant située derrière la liaison montante ; diffusions massives sur deux ports voisins ; tous les autres ports saturés en sortie par l’inondation ; processeur du commutateur à 99 %.\n• Pourquoi elle dure : une trame Ethernet n’a pas de durée de vie (pas de TTL comme en IP), donc une trame de diffusion peut tourner indéfiniment ; seul le Spanning Tree empêche les boucles.\n• Cause racine : `spanning-tree bpdufilter enable` sur les interfaces d’accès supprime l’envoi et la réception des BPDU, ce qui revient à désactiver le Spanning Tree sur ces ports. Ce n’est pas PortFast, qui accélère seulement la mise en service du port.\n• Action immédiate : console, coupure de Gi1/0/14 et Gi1/0/15, vérification, retrait du mini-commutateur. Redémarrer ou attendre ne règle rien.\n• Prévention : PortFast + BPDU guard, storm-control, limitation des adresses MAC par port, pont racine fixé, procédure err-disabled. Certains mini-commutateurs ne relaient pas les BPDU, d’où la nécessité de protections complémentaires au BPDU guard.\n\nLe piège principal est de traiter le symptôme (redémarrer, isoler la liaison montante) au lieu d’ouvrir la boucle au plus près de sa source. Le second piège est de croire que PortFast désactive le Spanning Tree : c’est le BPDU filter appliqué à l’interface qui le fait.\n\nUn jury de banque attend la lecture précise des journaux, une action ciblée qui rend le service vite, puis une correction du gabarit sur tout le parc et un traitement de la cause humaine.\n\nRéflexes à retenir :\n• MACFLAP + diffusions massives = boucle jusqu’à preuve du contraire.\n• Sur les ports utilisateurs : PortFast toujours avec BPDU guard, jamais avec un BPDU filter d’interface.\n• Un incident de configuration se corrige dans le gabarit, pas seulement sur l’équipement touché.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // RES-CAS-04 — Lenteurs intermittentes à l'agence de Matadi
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'RES-CAS-04',
    filiere: 'reseaux',
    titre: 'Lenteurs chaque matin à l’agence de Matadi : traceroute, SNMP et NetFlow',
    role: 'Ingénieur réseau, supervision et performance — Banque Alpha',
    heure: 'Lundi 10h25',
    enjeu:
      'Trouver la cause des lenteurs qui touchent l’agence de Matadi chaque jour entre 10h et midi, avec des mesures, et la corriger sans pénaliser les opérations de guichet.',
    contexte:
      'Depuis mardi dernier, l’agence de Matadi se plaint de lenteurs sur le système de tenue de comptes, « surtout en fin de matinée » ; le reste de la journée, tout fonctionne normalement. L’agence est reliée au centre de données de Kinshasa par une liaison MPLS de 10 Mbit/s ; en temps normal, le délai aller-retour entre un poste de l’agence et le serveur central 10.1.20.15 est d’environ 24 ms. Un premier technicien a conclu que « le serveur central est lent » et un autre accuse un routeur de l’opérateur qui « perd des paquets ». Ce lundi à 10h25, la lenteur est revenue et tu disposes d’un traceroute lancé depuis un poste de guichet, des relevés SNMP du routeur d’agence et des statistiques NetFlow. Ta responsable, Mme Lufuluabo, attend une conclusion chiffrée avant midi.',
    piecesJointes: [
      {
        type: 'logs',
        titre: 'traceroute depuis le poste 10.60.10.25 (agence de Matadi) vers 10.1.20.15, lundi 10h22',
        lignes: [
          'traceroute to 10.1.20.15, 30 hops max, 60 byte packets',
          ' 1  10.60.10.1 (passerelle agence)        0.9 ms   0.8 ms   0.8 ms',
          ' 2  172.20.0.1 (routeur opérateur Matadi) 183.4 ms 191.2 ms 178.9 ms',
          ' 3  172.20.0.9 (cœur opérateur)           *        187.6 ms *',
          ' 4  10.1.255.2 (routeur centre de données) 188.1 ms 185.7 ms 192.3 ms',
          ' 5  10.1.20.15 (serveur central)          189.0 ms 186.2 ms 190.4 ms',
          '# Même traceroute vendredi à 16h00 : sauts 2 à 5 entre 21 et 25 ms, aucune étoile',
        ],
      },
      {
        type: 'table',
        titre: 'SNMP — interface WAN du routeur d’agence (10 Mbit/s), relevé toutes les 300 s',
        colonnes: ['Intervalle', 'Δ ifHCOutOctets (octets émis vers le siège)', 'Erreurs d’interface'],
        lignes: [
          ['09h55-10h00', '36 000 000', 0],
          ['10h00-10h05', '363 750 000', 0],
          ['10h05-10h10', '365 625 000', 0],
          ['10h10-10h15', '358 125 000', 0],
          ['… 11h50-11h55 (relevé de vendredi)', '341 250 000', 0],
          ['… 11h55-12h00 (relevé de vendredi)', '54 000 000', 0],
        ],
      },
      {
        type: 'table',
        titre: 'NetFlow — principaux flux sortants de l’agence, 10h00-10h20 (débit moyen)',
        colonnes: ['Source', 'Destination', 'Protocole / port', 'Débit (Mbit/s)', 'Part'],
        lignes: [
          ['10.60.30.12 (enregistreur vidéo de l’agence)', '10.1.40.8 (stockage central)', 'TCP 445 (SMB)', '7,10', '73,2 %'],
          ['10.60.10.0/24 (postes)', '10.1.30.4 (messagerie)', 'TCP 443', '0,98', '10,1 %'],
          ['10.60.10.0/24 (postes)', '10.1.20.15 (tenue de comptes)', 'TCP 443', '0,62', '6,4 %'],
          ['10.60.20.0/24 (téléphones)', '10.1.50.0/24 (voix)', 'UDP (RTP)', '0,48', '4,9 %'],
          ['10.60.10.0/24 (postes)', '10.1.25.6 (proxy Internet)', 'TCP 8080', '0,40', '4,1 %'],
          ['Autres flux', '—', '—', '0,12', '1,2 %'],
        ],
      },
    ],
    etapes: [
      {
        type: 'choix',
        id: 'e1',
        question: 'Que conclus-tu du traceroute ?',
        options: [
          {
            id: 'a',
            texte:
              'Le serveur central est lent : c’est le dernier saut qui répond en 186 à 190 ms, et c’est lui qui héberge la tenue de comptes dont se plaint l’agence.',
            points: 0,
            feedback:
              'Le serveur répond avec le même délai que les sauts 2, 3 et 4 : il ne fait que subir un délai déjà présent dès le deuxième saut. Un serveur lent ferait augmenter le délai uniquement au dernier saut.',
          },
          {
            id: 'b',
            texte:
              'Le routeur 172.20.0.9 de l’opérateur perd des paquets (étoiles au saut 3) : c’est lui le coupable, et ses pertes forcent TCP à retransmettre, d’où le délai.',
            points: 0,
            feedback:
              'C’est le piège classique. Les sauts suivants répondent tous, sans perte : si le saut 3 perdait vraiment le trafic, la perte se retrouverait jusqu’à la destination. Les étoiles signifient seulement que ce routeur limite ses réponses ICMP, une protection courante de son plan de contrôle.',
          },
          {
            id: 'c',
            texte:
              'Il n’y a pas de problème réseau : 190 ms reste un délai acceptable sur une liaison interurbaine, et une application web tolère sans peine ce temps de réponse.',
            points: 1,
            feedback:
              'Ce délai est presque huit fois le délai habituel (24 ms) et coïncide avec les plaintes. On ne compare pas à un seuil théorique mais à la référence mesurée du même chemin.',
          },
          {
            id: 'd',
            texte:
              'Le délai bondit à environ 185 ms dès le saut 2 et persiste jusqu’au serveur : c’est la liaison WAN de l’agence qui ralentit ; les étoiles isolées du saut 3 ne sont pas une perte.',
            points: 4,
            feedback:
              'Exact. Un délai qui apparaît à un saut et se maintient jusqu’à la destination désigne le lien juste avant ce saut. Dans une liaison saturée, les paquets attendent dans la file d’émission du routeur d’agence : environ 160 ms de plus que la référence. Les étoiles isolées au milieu d’un chemin sain relèvent de la limitation ICMP.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e2',
        question:
          'D’après le relevé SNMP de 10h00-10h05 (363 750 000 octets émis en 300 s), quelle est l’utilisation de la liaison de 10 Mbit/s vers le siège ?',
        options: [
          {
            id: 'a',
            texte: 'Environ 9,7 % : la liaison est donc peu chargée et n’explique pas les lenteurs.',
            points: 0,
            feedback:
              'Erreur d’ordre de grandeur : tu as peut-être divisé par 100 Mbit/s au lieu de 10. 363 750 000 × 8 / 300 = 9 700 000 bit/s, soit 9,7 Mbit/s sur 10.',
          },
          {
            id: 'b',
            texte: 'Environ 97 % : 363 750 000 × 8 / 300 = 9,7 Mbit/s.',
            points: 3,
            feedback:
              'Exact. Il faut convertir les octets en bits (× 8) puis diviser par la durée de l’intervalle. À 97 % de moyenne sur 5 minutes, les pointes saturent la liaison et la file d’attente se remplit, d’où les 185 ms. Le relevé de 09h55-10h00 n’était qu’à 9,6 % (0,96 Mbit/s).',
          },
          {
            id: 'c',
            texte: 'Environ 12 % : 363 750 000 / 300 = 1,2 Mo/s, sur 10 Mbit/s.',
            points: 1,
            feedback:
              'La division par la durée est juste (1 212 500 octets/s), mais tu compares des octets à des bits. 1,2 Mo/s correspond à 9,7 Mbit/s : il manque la multiplication par 8.',
          },
          {
            id: 'd',
            texte: 'Impossible à calculer : un compteur SNMP ne donne qu’un total depuis le démarrage du routeur.',
            points: 0,
            feedback:
              'C’est justement pour cela qu’on travaille sur la différence (Δ) entre deux relevés : octets émis pendant l’intervalle ÷ durée = débit moyen. On utilise les compteurs 64 bits (ifHCOutOctets) : un compteur 32 bits reboucle après 2^32 octets, soit en 34 s seulement à 1 Gbit/s.',
          },
        ],
      },
      {
        type: 'choix',
        id: 'e3',
        question: 'Que révèle NetFlow sur l’origine de la saturation ?',
        options: [
          {
            id: 'a',
            texte:
              'La messagerie : 0,98 Mbit/s, c’est plus que la tenue de comptes, et les pièces jointes partent en fin de matinée, quand les agents envoient leurs rapports.',
            points: 0,
            feedback:
              'La messagerie ne représente que 10,1 % du trafic et circule toute la journée sans provoquer de lenteur. Il faut chercher le flux dominant qui n’existe qu’entre 10h et midi.',
          },
          {
            id: 'b',
            texte:
              'La voix sur IP, qui consomme de la bande passante en continu : quelques appels simultanés en G.711 suffisent à remplir une liaison d’agence de 10 Mbit/s.',
            points: 0,
            feedback:
              '0,48 Mbit/s, soit six appels G.711 à 80 kbit/s : c’est 4,9 % du trafic. La voix est plutôt une victime, très sensible au délai de 185 ms et à la gigue.',
          },
          {
            id: 'c',
            texte:
              'Une copie SMB (TCP 445) de l’enregistreur vidéo vers le stockage central : 7,10 Mbit/s, soit 73,2 % du trafic, de 10h00 à midi environ, l’horaire des plaintes.',
            points: 3,
            feedback:
              'Exact. Une copie de fichiers en TCP occupe toute la bande disponible tant qu’elle dure. Le relevé SNMP passe de 9,6 % à 97 % pile à 10h00 et, d’après le relevé de vendredi, retombe à 14,4 % (1,44 Mbit/s) dans l’intervalle 11h55-12h00 : c’est la signature d’une tâche planifiée. Il reste à vérifier qui l’a programmée et quand (journal des changements).',
          },
          {
            id: 'd',
            texte:
              'Le proxy Internet : les employés naviguent trop pendant les heures de travail, surtout en fin de matinée, et leurs téléchargements concurrencent les applications métier.',
            points: 0,
            feedback:
              'Le proxy ne pèse que 0,40 Mbit/s, soit 4,1 %. Accuser les usages des employés sans mesure est une erreur fréquente : NetFlow montre ici un flux technique, pas humain.',
          },
        ],
      },
      {
        type: 'ordre',
        id: 'e4',
        question: 'Remets dans l’ordre la démarche de diagnostic que tu aurais dû suivre dès les premières plaintes.',
        elements: [
          { id: 'flux', texte: 'Identifier les flux responsables avec NetFlow (source, destination, port, débit)' },
          { id: 'mesurer', texte: 'Mesurer le chemin pendant la lenteur (ping, traceroute) et comparer à la référence habituelle' },
          { id: 'delimiter', texte: 'Délimiter le problème : quels utilisateurs, quelles applications, à quelles heures' },
          { id: 'corriger', texte: 'Corriger et vérifier, puis créer une alerte de supervision sur l’utilisation du lien' },
          { id: 'snmp', texte: 'Corréler avec l’utilisation des interfaces relevée par SNMP' },
        ],
        ordreCorrect: ['delimiter', 'mesurer', 'snmp', 'flux', 'corriger'],
        pointsMax: 4,
        feedback:
          'On part du symptôme (qui, quoi, quand), on localise le segment fautif par la mesure de bout en bout, on confirme la saturation par SNMP, puis NetFlow dit quel flux remplit le lien. On corrige seulement à ce stade, et l’alerte de supervision évite que le prochain cas soit découvert par des plaintes. Chaque outil répond à une question différente : où, combien, qui.',
      },
      {
        type: 'choix',
        id: 'e5',
        question: 'Quelle correction proposes-tu à Mme Lufuluabo ?',
        options: [
          {
            id: 'a',
            texte:
              'Copie vidéo reprogrammée la nuit (environ 1 h 20 pour 6 Go), QoS qui protège la tenue de comptes et la voix, alerte SNMP au-delà de 80 % d’utilisation pendant 15 minutes.',
            points: 4,
            feedback:
              'C’est la réponse complète : on déplace le flux non urgent hors des heures d’ouverture (6 × 10⁹ octets × 8 / 10 Mbit/s = 4 800 s, soit 80 minutes), on protège les flux métier par la QoS si une copie déborde un jour en journée, et on détecte plus tôt la prochaine saturation.',
          },
          {
            id: 'b',
            texte:
              'Doubler immédiatement le débit de la liaison MPLS de l’agence à 20 Mbit/s : la copie de 7,10 Mbit/s n’en occuperait plus que le tiers et laisserait la place aux autres flux.',
            points: 1,
            feedback:
              'Une copie TCP occupe tout le débit disponible : elle finirait plus vite, mais elle saturerait aussi une liaison de 20 Mbit/s pendant son exécution. Augmenter le débit sans maîtriser les flux, c’est payer pour le même problème.',
          },
          {
            id: 'c',
            texte:
              'Bloquer définitivement le port TCP 445 entre les agences et le centre de données : SMB est un protocole exposé et ce blocage supprime la copie à la source.',
            points: 0,
            feedback:
              'La copie des enregistrements vidéo répond à un besoin de sécurité réel, et le partage de fichiers SMB sert à d’autres usages légitimes. On ne supprime pas un service sans analyse : on le planifie et on l’encadre.',
          },
          {
            id: 'd',
            texte:
              'Ouvrir un ticket auprès de l’opérateur pour qu’il remplace son routeur 172.20.0.9, dont les étoiles au saut 3 trahissent une défaillance sous la charge du matin.',
            points: 0,
            feedback:
              'Les mesures montrent que la liaison est saturée par le trafic de l’agence elle-même, et que les étoiles au saut 3 ne sont qu’une limitation ICMP. L’opérateur n’y est pour rien : un ticket injustifié décrédibilise l’équipe.',
          },
        ],
      },
    ],
    pointsMax: 18,
    debrief:
      'La compétence évaluée est de remplacer les impressions (« le serveur est lent », « l’opérateur perd des paquets ») par des mesures qui se recoupent.\n• Traceroute : le délai saute de 0,9 ms à environ 185 ms au saut 2 et se maintient jusqu’au serveur, contre 21 à 25 ms vendredi à 16h00. Le segment fautif est donc la liaison WAN de l’agence. Les étoiles du saut 3, suivies de réponses normales, sont une limitation ICMP du routeur de l’opérateur, pas une perte.\n• SNMP : 363 750 000 octets × 8 / 300 s = 9,7 Mbit/s, soit 97 % de 10 Mbit/s, contre 9,6 % juste avant 10h00. Le calcul se fait toujours sur la différence entre deux relevés de compteurs 64 bits.\n• NetFlow : une copie SMB de l’enregistreur vidéo 10.60.30.12 vers le stockage 10.1.40.8 occupe 7,10 Mbit/s (73,2 %) de 10h00 à midi environ. Une tâche planifiée récente explique pourquoi les plaintes ont commencé mardi dernier.\n• Correction : copie déplacée la nuit (environ 80 minutes pour 6 Go à 10 Mbit/s), QoS qui protège la tenue de comptes et la voix, alerte de supervision au-delà de 80 %. Augmenter le débit seul ne suffit pas, car un transfert TCP remplit tout le lien disponible.\n\nLe piège principal est de lire un traceroute saut par saut sans regarder la suite : une étoile ou un délai isolé au milieu d’un chemin sain ne signifie rien. Le second piège est l’erreur d’unité octets/bits, qui divise l’utilisation par huit.\n\nUn jury de banque attend une démarche méthodique (délimiter, mesurer, corréler, identifier, corriger), des chiffres justes et une solution qui protège d’abord les opérations de guichet, sans accuser un tiers sans preuve.\n\nRéflexes à retenir :\n• Un délai qui apparaît à un saut et persiste jusqu’au bout désigne le lien qui précède ce saut.\n• Débit moyen = Δ octets × 8 / durée de l’intervalle.\n• SNMP dit combien, NetFlow dit qui : il faut les deux pour conclure.',
  },
];
