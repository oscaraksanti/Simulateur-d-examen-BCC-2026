// Banque technique — filière Réseaux & télécoms (préfixe RES), 60 questions.
// Contextes fictifs (Banque Alpha, adresses de documentation) ; tous les calculs ont été vérifiés par script.
import type { QcmQuestion } from '@/lib/types';

export const banqueTechniqueReseaux: QcmQuestion[] = [
  // ───────────────────────────── Modèle OSI & TCP/IP ─────────────────────────────
  {
    id: 'RES-OSI-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'facile',
    enonce:
      "Dans le modèle OSI, comment s'appelle l'unité de données (PDU) manipulée par la couche 2, la couche liaison de données ?",
    options: [
      { id: 'A', texte: 'Le paquet' },
      { id: 'B', texte: 'La trame' },
      { id: 'C', texte: 'Le segment' },
      { id: 'D', texte: 'Le datagramme' },
    ],
    bonneReponse: 'B',
    explication:
      "La couche 2 encapsule le paquet IP dans une trame, qui ajoute un en-tête (adresses MAC source et destination) et une séquence de contrôle (FCS). La couche 3 manipule des paquets, la couche 4 des segments (TCP) ou des datagrammes (UDP), la couche 1 des bits.",
    pourquoiPas: {
      A: "Le paquet est la PDU de la couche 3 (réseau) : c'est lui qui porte les adresses IP.",
      C: "Le segment est la PDU de TCP, à la couche 4 (transport).",
      D: "Le datagramme désigne l'unité d'UDP (couche 4), voire le paquet IP, mais jamais la trame Ethernet.",
    },
    aRetenir:
      "De haut en bas : données → segment (couche 4) → paquet (couche 3) → trame (couche 2) → bits (couche 1).",
  },
  {
    id: 'RES-OSI-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'facile',
    enonce:
      "Les téléphones IP des agences de la Banque Alpha transportent la voix avec le protocole RTP. Quel protocole de transport porte ce flux, et pourquoi ?",
    options: [
      { id: 'A', texte: "UDP, car une voix retransmise arriverait trop tard pour être jouée" },
      { id: 'B', texte: "TCP, car la voix exige que chaque paquet perdu soit retransmis jusqu'à sa réception" },
      { id: 'C', texte: 'ICMP, car il est plus léger que TCP et UDP' },
      { id: 'D', texte: 'TCP, car seul TCP peut traverser un pare-feu' },
    ],
    bonneReponse: 'A',
    explication:
      "Pour le temps réel, la faible latence compte plus que la fiabilité absolue : RTP s'appuie sur UDP. Les numéros de séquence et l'horodatage de RTP permettent de réordonner les paquets et de lisser la gigue, et une perte légère reste peu audible. Les retransmissions et le contrôle de congestion de TCP provoqueraient au contraire des retards et des coupures.",
    pourquoiPas: {
      B: "Un paquet de voix retransmis arrive trop tard pour être joué : les retransmissions de TCP créeraient du retard et des coupures.",
      C: "ICMP est un protocole de signalisation et de diagnostic de la couche réseau, pas un transport pour les applications.",
      D: "Un pare-feu filtre UDP comme TCP, selon ses règles : le choix du transport ne dépend pas de cela.",
    },
    aRetenir: 'Temps réel (voix, vidéo) → UDP : mieux vaut perdre un paquet que le recevoir en retard.',
  },
  {
    id: 'RES-OSI-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'facile',
    enonce: 'Quelle association « protocole – port par défaut » est correcte ?',
    options: [
      { id: 'A', texte: 'SSH – TCP 23' },
      { id: 'B', texte: 'DNS – UDP 53' },
      { id: 'C', texte: 'SNMP (interrogation des équipements) – TCP 161' },
      { id: 'D', texte: 'HTTPS – TCP 80' },
    ],
    bonneReponse: 'B',
    explication:
      "Le DNS utilise le port 53, en UDP pour la plupart des requêtes ; TCP 53 sert aux réponses volumineuses et aux transferts de zone. SSH écoute sur TCP 22, SNMP sur UDP 161 (et UDP 162 pour les traps), HTTPS sur TCP 443.",
    pourquoiPas: {
      A: "TCP 23 est le port de Telnet, protocole non chiffré ; SSH utilise TCP 22.",
      C: "SNMP fonctionne sur UDP : 161 pour l'interrogation, 162 pour les notifications (traps).",
      D: "TCP 80 est le port de HTTP en clair ; HTTPS utilise TCP 443.",
    },
    aRetenir:
      'À connaître par cœur : SSH 22, Telnet 23, SMTP 25, DNS 53, HTTP 80, SNMP 161/162 (UDP), HTTPS 443.',
  },
  {
    id: 'RES-OSI-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'moyen',
    enonce:
      "Le poste 192.168.1.25/24 (passerelle 192.168.1.1) doit envoyer un paquet au serveur 10.20.0.15. Son cache ARP est vide. Quelle adresse IP cherche-t-il à résoudre par ARP ?",
    options: [
      { id: 'A', texte: '192.168.1.1, l’adresse de sa passerelle par défaut' },
      { id: 'B', texte: '10.20.0.15, l’adresse du serveur de destination' },
      { id: 'C', texte: '255.255.255.255, l’adresse de diffusion' },
      { id: 'D', texte: 'Aucune : ARP ne sert que pour joindre des destinations sur Internet' },
    ],
    bonneReponse: 'A',
    explication:
      "Avec son masque, le poste constate que 10.20.0.15 n'est pas dans son sous-réseau : il doit confier le paquet à son routeur. Il résout donc l'adresse MAC de la passerelle 192.168.1.1. Le paquet IP garde 10.20.0.15 comme destination ; seule la trame Ethernet porte la MAC de la passerelle.",
    pourquoiPas: {
      B: "10.20.0.15 est sur un autre réseau : une requête ARP, diffusée seulement sur le segment local, ne l'atteindrait jamais.",
      C: "La requête ARP est bien envoyée en diffusion (MAC ff:ff:ff:ff:ff:ff), mais l'adresse IP dont on demande la MAC est celle de la passerelle.",
      D: "C'est l'inverse : ARP sert à toute communication IPv4 sur Ethernet, mais uniquement à l'intérieur du segment local.",
    },
    aRetenir:
      "Pour une destination hors de son sous-réseau, un hôte résout par ARP la MAC de sa passerelle, jamais celle de la destination finale.",
  },
  {
    id: 'RES-OSI-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'moyen',
    enonce:
      "Un paquet traverse le routeur qui relie le LAN d'une agence au WAN, sans NAT. Quels champs ce routeur modifie-t-il ?",
    options: [
      { id: 'A', texte: 'Les adresses IP source et destination ; les adresses MAC restent identiques de bout en bout' },
      { id: 'B', texte: 'Les adresses MAC (il construit une nouvelle trame) et le TTL ; les adresses IP restent identiques' },
      { id: 'C', texte: 'Aucun : un routeur relaie le paquet sans le modifier' },
      { id: 'D', texte: 'Uniquement le port TCP de destination' },
    ],
    bonneReponse: 'B',
    explication:
      "Le routeur retire la trame reçue, consulte sa table de routage, décrémente le TTL (et recalcule la somme de contrôle de l'en-tête IP), puis réencapsule le paquet dans une nouvelle trame : sa propre MAC de sortie en source, la MAC du prochain saut en destination. Sans NAT, les adresses IP ne changent pas.",
    pourquoiPas: {
      A: "C'est l'inverse : les adresses MAC n'ont de sens que sur un segment et changent à chaque saut, les adresses IP sont conservées.",
      C: "Le TTL est décrémenté à chaque routeur et la trame est reconstruite à chaque saut.",
      D: "Un routeur ne touche pas aux ports de la couche 4, sauf s'il fait de la traduction de ports (PAT).",
    },
    aRetenir:
      "À chaque saut, la trame (MAC) est refaite et le TTL baisse de 1 ; les adresses IP ne changent qu'en cas de NAT.",
  },
  {
    id: 'RES-OSI-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'moyen',
    enonce:
      "Sur un lien Ethernet de MTU 1 500 octets, sans options IP ni TCP, quelle est la quantité maximale de données qu'un segment TCP peut transporter (MSS) ?",
    options: [
      { id: 'A', texte: '1 500 octets' },
      { id: 'B', texte: '1 518 octets' },
      { id: 'C', texte: '1 480 octets' },
      { id: 'D', texte: '1 460 octets' },
    ],
    bonneReponse: 'D',
    explication:
      "La MTU est la taille maximale du paquet IP. Il faut en retirer l'en-tête IPv4 (20 octets) et l'en-tête TCP (20 octets) : 1 500 − 40 = 1 460 octets de données utiles. L'en-tête Ethernet et le FCS sont en dehors de la MTU.",
    pourquoiPas: {
      A: "1 500 octets est la MTU elle-même, c'est-à-dire le paquet entier, en-têtes IP et TCP compris.",
      B: "1 518 octets est la taille maximale d'une trame Ethernet (sans étiquette 802.1Q), en-tête Ethernet et FCS inclus : ce n'est pas une charge utile TCP.",
      C: "1 480 ne retire que l'en-tête IP ; il faut aussi soustraire les 20 octets de l'en-tête TCP.",
    },
    aRetenir: 'MSS = MTU − en-tête IP (20) − en-tête TCP (20), soit 1 460 octets sur Ethernet standard.',
  },
  {
    id: 'RES-OSI-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'moyen',
    enonce:
      "Un agent ne parvient pas à joindre l'application métier sur le port 8443. La capture ci-dessous est prise côté client. Que peut-on en conclure ?",
    extrait: {
      langage: 'log',
      contenu: `10:42:07.112 IP 10.20.5.14.51522 > 10.20.9.30.8443: Flags [S], seq 3810021, length 0
10:42:07.113 IP 10.20.9.30.8443 > 10.20.5.14.51522: Flags [R.], seq 0, ack 3810022, length 0`,
    },
    options: [
      { id: 'A', texte: 'Un pare-feu intermédiaire ignore silencieusement la demande de connexion' },
      { id: 'B', texte: 'Le serveur est joignable, mais aucun service n’écoute sur le port 8443' },
      { id: 'C', texte: 'La connexion a été établie, puis fermée normalement par l’application' },
      { id: 'D', texte: 'Le serveur est éteint ou injoignable sur le réseau' },
    ],
    bonneReponse: 'B',
    explication:
      "Le client envoie un SYN ([S]) et reçoit immédiatement un RST-ACK ([R.]) : la pile TCP de 10.20.9.30 répond, mais aucun processus n'écoute sur ce port. On vérifie donc côté serveur que le service est démarré et écoute sur le bon port. Attention : un pare-feu configuré en « reject » peut aussi renvoyer un RST à la place du serveur.",
    pourquoiPas: {
      A: "Un filtrage silencieux (drop) ne produit aucune réponse : on verrait le SYN retransmis plusieurs fois, sans retour.",
      C: "Il n'y a pas eu de SYN-ACK, donc pas de poignée de main ; une fermeture normale passe d'ailleurs par des segments FIN.",
      D: "Un hôte éteint ou injoignable ne répond pas du tout ; ici, une réponse arrive en une milliseconde.",
    },
    aRetenir:
      'SYN → RST : port fermé ; SYN sans réponse : filtré ou hôte injoignable ; SYN → SYN-ACK : port ouvert.',
  },
  {
    id: 'RES-OSI-008',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Modèle OSI & TCP/IP',
    difficulte: 'difficile',
    enonce:
      "Depuis la mise en service d'un tunnel VPN vers le site de secours, le ping et les sessions SSH fonctionnent, mais les transferts de fichiers et certaines pages HTTPS se figent. Voici deux tests (l'option `-M do` positionne le bit DF, « ne pas fragmenter »). Quelle est la cause la plus probable ?",
    extrait: {
      langage: 'shell',
      contenu: `$ ping -c 2 -M do -s 1372 10.50.0.10
PING 10.50.0.10 (10.50.0.10) 1372(1400) bytes of data.
1380 bytes from 10.50.0.10: icmp_seq=1 ttl=62 time=18.4 ms
1380 bytes from 10.50.0.10: icmp_seq=2 ttl=62 time=18.1 ms
2 packets transmitted, 2 received, 0% packet loss

$ ping -c 2 -M do -s 1472 10.50.0.10
PING 10.50.0.10 (10.50.0.10) 1472(1500) bytes of data.
2 packets transmitted, 0 received, 100% packet loss`,
    },
    options: [
      { id: 'A', texte: "MTU réduite sur le chemin et messages ICMP « fragmentation nécessaire » filtrés" },
      { id: 'B', texte: 'Le serveur 10.50.0.10 est surchargé : il ne répond plus qu’aux petites requêtes et rejette les gros paquets' },
      { id: 'C', texte: 'Le TTL est trop faible pour atteindre le site de secours' },
      { id: 'D', texte: 'Le DNS ne résout pas correctement le nom du serveur de secours' },
    ],
    bonneReponse: 'A',
    explication:
      "Les paquets de 1 400 octets passent, ceux de 1 500 avec DF sont perdus : l'en-tête du tunnel réduit la MTU du chemin. Normalement, le routeur concerné renvoie un ICMP « fragmentation nécessaire » (type 3, code 4) et l'émetteur réduit ses paquets (Path MTU Discovery) ; si ce message est filtré, c'est un « trou noir ». Correctifs : laisser passer cet ICMP, ajuster le MSS TCP sur le tunnel (MSS clamping) ou réduire la MTU.",
    pourquoiPas: {
      B: "Une surcharge ne trierait pas les paquets précisément au-delà d'une taille : le seuil net entre 1 400 et 1 500 octets signe un problème de MTU.",
      C: "Les réponses reviennent avec ttl=62 : le TTL suffit, et la taille d'un paquet n'a aucun effet sur lui.",
      D: "Les tests utilisent directement l'adresse IP : le DNS n'intervient pas.",
    },
    aRetenir:
      "« Le ping passe mais les gros transferts se figent » : pensez MTU, ICMP « fragmentation nécessaire » filtré et MSS clamping sur les tunnels.",
  },

  // ───────────────────────────── Adressage IP & sous-réseaux ─────────────────────────────
  {
    id: 'RES-IP-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'facile',
    enonce: 'Laquelle de ces adresses appartient à une plage privée définie par la RFC 1918 ?',
    options: [
      { id: 'A', texte: '172.32.10.5' },
      { id: 'B', texte: '169.254.10.10' },
      { id: 'C', texte: '192.168.200.1' },
      { id: 'D', texte: '100.64.1.1' },
    ],
    bonneReponse: 'C',
    explication:
      "La RFC 1918 réserve trois plages privées : 10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16. L'adresse 192.168.200.1 appartient à la troisième. Ces adresses ne sont pas routées sur Internet et sortent via du NAT.",
    pourquoiPas: {
      A: "La plage privée 172.16.0.0/12 s'arrête à 172.31.255.255 : 172.32.10.5 est une adresse publique.",
      B: "169.254.0.0/16 est la plage de liaison locale (APIPA), auto-attribuée faute de DHCP ; elle ne fait pas partie de la RFC 1918.",
      D: "100.64.0.0/10 est l'espace partagé réservé au NAT des opérateurs (CGNAT, RFC 6598), distinct de la RFC 1918.",
    },
    aRetenir: 'Plages privées RFC 1918 : 10.0.0.0/8, 172.16.0.0/12 (172.16 à 172.31) et 192.168.0.0/16.',
  },
  {
    id: 'RES-IP-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'facile',
    enonce: "Combien d'adresses d'hôtes utilisables offre un sous-réseau IPv4 en /26 ?",
    options: [
      { id: 'A', texte: '64' },
      { id: 'B', texte: '62' },
      { id: 'C', texte: '30' },
      { id: 'D', texte: '126' },
    ],
    bonneReponse: 'B',
    explication:
      "Un /26 laisse 32 − 26 = 6 bits pour les hôtes, soit 2⁶ = 64 adresses. On retire l'adresse de réseau et l'adresse de diffusion : 62 hôtes utilisables.",
    pourquoiPas: {
      A: "64 est le nombre total d'adresses du bloc, adresse de réseau et adresse de diffusion comprises.",
      C: '30 hôtes correspond à un /27 (5 bits d’hôte).',
      D: '126 hôtes correspond à un /25 (7 bits d’hôte).',
    },
    aRetenir:
      'Hôtes utilisables = 2^(32 − préfixe) − 2 : /24 → 254, /25 → 126, /26 → 62, /27 → 30, /30 → 2.',
  },
  {
    id: 'RES-IP-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'moyen',
    enonce:
      "Un serveur de la Banque Alpha est configuré avec l'adresse 10.8.37.200/21. Quelles sont l'adresse du réseau et l'adresse de diffusion de son sous-réseau ?",
    options: [
      { id: 'A', texte: '10.8.37.0 et 10.8.37.255' },
      { id: 'B', texte: '10.8.32.0 et 10.8.35.255' },
      { id: 'C', texte: '10.8.32.0 et 10.8.39.255' },
      { id: 'D', texte: '10.8.36.0 et 10.8.39.255' },
    ],
    bonneReponse: 'C',
    explication:
      "Un /21 laisse 3 bits d'hôte dans le troisième octet : les blocs avancent par pas de 2³ = 8 (0, 8, 16, 24, 32, 40…). 37 tombe dans le bloc 32–39 : réseau 10.8.32.0, diffusion 10.8.39.255, soit 2 046 hôtes utilisables.",
    pourquoiPas: {
      A: 'Ce calcul raisonne comme si le masque était un /24.',
      B: 'La plage 10.8.32.0 – 10.8.35.255 correspond à un /22 (blocs de 4), pas à un /21.',
      D: "36 n'est pas un multiple de 8 : 10.8.36.0 ne peut pas être le début d'un bloc /21 (c'est un début de /22).",
    },
    aRetenir:
      "Pour un /21, le 3ᵉ octet avance par pas de 2^(24 − 21) = 8 : l'adresse réseau est le multiple de 8 immédiatement inférieur ou égal.",
  },
  {
    id: 'RES-IP-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'moyen',
    enonce:
      "Le réseau des guichets d'une grande agence doit accueillir 500 hôtes dans un seul sous-réseau. Quel est le préfixe le plus long (le moins gaspilleur) qui convient ?",
    options: [
      { id: 'A', texte: '/24' },
      { id: 'B', texte: '/25' },
      { id: 'C', texte: '/22' },
      { id: 'D', texte: '/23' },
    ],
    bonneReponse: 'D',
    explication:
      "Il faut n bits d'hôte tels que 2ⁿ − 2 ≥ 500. Avec 8 bits (/24) on a 254 hôtes, insuffisant ; avec 9 bits (/23) on a 510 hôtes, suffisant. Le /23 est donc le plus petit sous-réseau qui convient.",
    pourquoiPas: {
      A: 'Un /24 ne fournit que 254 adresses d’hôtes, moitié moins que nécessaire.',
      B: 'Un /25 ne fournit que 126 adresses d’hôtes.',
      C: "Un /22 (1 022 hôtes) convient, mais gaspille plus de la moitié des adresses : ce n'est pas le préfixe le plus long possible.",
    },
    aRetenir:
      'Cherchez la plus petite puissance de 2 telle que 2ⁿ − 2 ≥ nombre d’hôtes : le préfixe vaut alors 32 − n.',
  },
  {
    id: 'RES-IP-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'moyen',
    enonce: "Quelle est l'écriture abrégée correcte de l'adresse IPv6 2001:0db8:0000:0000:0000:ff00:0042:8329 ?",
    options: [
      { id: 'A', texte: '2001:db8::ff00::42:8329' },
      { id: 'B', texte: '2001:db8::ff:42:8329' },
      { id: 'C', texte: '2001:db8::ff00:42:8329' },
      { id: 'D', texte: '2001:db8:0:0:ff00:42:8329' },
    ],
    bonneReponse: 'C',
    explication:
      "On supprime les zéros de tête de chaque groupe (0db8 → db8, 0042 → 42), puis on remplace la suite des trois groupes nuls par « :: ». Les zéros de fin d'un groupe (ff00) sont significatifs et doivent être conservés.",
    pourquoiPas: {
      A: "« :: » ne peut apparaître qu'une seule fois dans une adresse, sinon on ne sait plus combien de groupes nuls il remplace.",
      B: 'Seuls les zéros de tête peuvent être supprimés : ff00 et ff sont deux valeurs différentes.',
      D: "Cette écriture ne compte que 7 groupes au lieu de 8 : il manque un groupe nul et il n'y a pas de « :: » pour le remplacer.",
    },
    aRetenir:
      'IPv6 : on supprime les zéros de tête de chaque groupe et on remplace UNE seule suite de groupes nuls par « :: ».',
  },
  {
    id: 'RES-IP-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'difficile',
    enonce:
      "La Banque Alpha dispose du bloc 192.168.10.0/24 pour une agence : LAN guichets (100 hôtes), LAN bureaux (50 hôtes), LAN caméras (20 hôtes) et un lien point à point vers le routeur WAN (2 adresses). Quel plan d'adressage VLSM est correct, sans chevauchement ?",
    options: [
      { id: 'A', texte: 'Guichets 192.168.10.0/25 ; bureaux 192.168.10.128/26 ; caméras 192.168.10.160/27 ; lien 192.168.10.224/30' },
      { id: 'B', texte: 'Guichets 192.168.10.0/26 ; bureaux 192.168.10.64/26 ; caméras 192.168.10.128/27 ; lien 192.168.10.160/30' },
      { id: 'C', texte: 'Guichets 192.168.10.0/25 ; bureaux 192.168.10.128/27 ; caméras 192.168.10.160/27 ; lien 192.168.10.192/30' },
      { id: 'D', texte: 'Guichets 192.168.10.0/25 ; bureaux 192.168.10.128/26 ; caméras 192.168.10.192/27 ; lien 192.168.10.224/30' },
    ],
    bonneReponse: 'D',
    explication:
      "On place d'abord les plus grands besoins : /25 (126 hôtes) pour les guichets en .0–.127, /26 (62 hôtes) pour les bureaux en .128–.191, /27 (30 hôtes) pour les caméras en .192–.223, puis /30 (2 hôtes) pour le lien en .224–.227. Chaque bloc commence sur un multiple de sa taille et aucun ne déborde sur le suivant ; il reste .228–.255 pour de futurs besoins.",
    pourquoiPas: {
      A: 'Le /26 des bureaux couvre .128 à .191 : le bloc des caméras en .160 le chevauche.',
      B: 'Un /26 ne fournit que 62 hôtes, insuffisant pour les 100 postes des guichets.',
      C: 'Un /27 ne fournit que 30 hôtes, insuffisant pour les 50 postes des bureaux.',
    },
    aRetenir:
      'En VLSM, attribuez d’abord les plus grands sous-réseaux, chacun aligné sur un multiple de sa propre taille.',
  },
  {
    id: 'RES-IP-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'difficile',
    enonce:
      "Une direction régionale annonce vers le siège les réseaux 172.16.24.0/24 à 172.16.31.0/24 (8 réseaux contigus). Quelle route résumée unique les couvre exactement, sans englober d'autres réseaux ?",
    options: [
      { id: 'A', texte: '172.16.24.0/21' },
      { id: 'B', texte: '172.16.24.0/22' },
      { id: 'C', texte: '172.16.16.0/20' },
      { id: 'D', texte: '172.16.0.0/16' },
    ],
    bonneReponse: 'A',
    explication:
      "8 réseaux /24 = 2³ réseaux : on retire 3 bits au préfixe, soit un /21. C'est possible parce que 24 est un multiple de 8 : 172.16.24.0/21 couvre exactement 172.16.24.0 à 172.16.31.255. Le résumé allège les tables de routage du siège.",
    pourquoiPas: {
      B: "Un /22 ne couvre que 4 réseaux /24 (24 à 27) : 28 à 31 resteraient hors du résumé.",
      C: "Un /20 couvre 172.16.16.0 à 172.16.31.255 : il englobe aussi 16 à 23, qui n'appartiennent pas à cette direction.",
      D: 'Un /16 attirerait tout le trafic destiné à 172.16.x.x, bien au-delà des 8 réseaux concernés.',
    },
    aRetenir:
      'Résumer 2ⁿ réseaux contigus revient à retirer n bits au préfixe, à condition que le premier réseau soit aligné sur un multiple de 2ⁿ.',
  },
  {
    id: 'RES-IP-008',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Adressage IP & sous-réseaux',
    difficulte: 'difficile',
    enonce: 'Avec un masque /22 (255.255.252.0), quelle paire d’adresses appartient au même sous-réseau ?',
    options: [
      { id: 'A', texte: '10.10.12.5 et 10.10.15.250' },
      { id: 'B', texte: '10.10.11.5 et 10.10.12.5' },
      { id: 'C', texte: '10.10.15.1 et 10.10.16.1' },
      { id: 'D', texte: '10.10.3.200 et 10.10.4.1' },
    ],
    bonneReponse: 'A',
    explication:
      "Un /22 découpe le troisième octet en blocs de 4 : 0–3, 4–7, 8–11, 12–15, 16–19… Les adresses 10.10.12.5 et 10.10.15.250 sont toutes deux dans 10.10.12.0/22 (de 10.10.12.0 à 10.10.15.255). Les autres paires chevauchent une frontière de bloc.",
    pourquoiPas: {
      B: '10.10.11.5 est dans 10.10.8.0/22 et 10.10.12.5 dans 10.10.12.0/22 : deux sous-réseaux différents.',
      C: '10.10.15.1 est dans 10.10.12.0/22 et 10.10.16.1 dans 10.10.16.0/22.',
      D: '10.10.3.200 est dans 10.10.0.0/22 et 10.10.4.1 dans 10.10.4.0/22, malgré leur proximité numérique.',
    },
    aRetenir:
      '/22 = blocs de 4 sur le 3ᵉ octet : deux adresses partagent le sous-réseau seulement si leur 3ᵉ octet tombe dans le même bloc (0–3, 4–7, 8–11…).',
  },

  // ───────────────────────────── Commutation & VLAN ─────────────────────────────
  {
    id: 'RES-COM-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'facile',
    enonce:
      "Un commutateur reçoit une trame dont l'adresse MAC de destination ne figure pas dans sa table d'adresses MAC. Que fait-il ?",
    options: [
      { id: 'A', texte: 'Il détruit la trame et renvoie un message ICMP à l’émetteur' },
      { id: 'B', texte: 'Il la diffuse sur tous les ports du même VLAN, sauf celui d’arrivée' },
      { id: 'C', texte: 'Il l’envoie à la passerelle par défaut' },
      { id: 'D', texte: 'Il émet une requête ARP pour trouver le destinataire' },
    ],
    bonneReponse: 'B',
    explication:
      "Un commutateur apprend les adresses en lisant la MAC source de chaque trame reçue. Pour une destination inconnue, il inonde la trame dans le VLAN (unknown unicast flooding) ; dès que le destinataire répond, il apprend son port et les trames suivantes ne partent plus que sur ce port.",
    pourquoiPas: {
      A: "Un commutateur de niveau 2 ne génère pas d'ICMP et ne jette pas une trame simplement parce que sa destination est inconnue.",
      C: "La passerelle par défaut est une notion de couche 3 propre aux hôtes ; un commutateur de niveau 2 ne route pas.",
      D: "ARP sert aux hôtes à associer une IP à une MAC ; le commutateur ne lit pas les adresses IP pour acheminer les trames.",
    },
    aRetenir:
      'Un commutateur apprend avec la MAC source et inonde le VLAN quand la MAC de destination est inconnue.',
  },
  {
    id: 'RES-COM-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'facile',
    enonce:
      "Quel est l'effet principal de la création de VLAN distincts pour les guichets, les caméras et la téléphonie d'une agence ?",
    options: [
      { id: 'A', texte: 'Chaque VLAN forme un domaine de diffusion séparé ; passer de l’un à l’autre exige un routage' },
      { id: 'B', texte: 'Le trafic de chaque VLAN est automatiquement chiffré' },
      { id: 'C', texte: 'Le débit de chaque port du commutateur augmente' },
      { id: 'D', texte: 'Les postes de VLAN différents communiquent directement, sans routeur, mais plus vite' },
    ],
    bonneReponse: 'A',
    explication:
      "Un VLAN découpe logiquement un commutateur en plusieurs réseaux de niveau 2 : les diffusions d'un VLAN n'atteignent pas les autres. Chaque VLAN correspond en général à un sous-réseau IP, et le trafic entre VLAN doit passer par un routeur ou un commutateur de niveau 3, où l'on peut le filtrer.",
    pourquoiPas: {
      B: 'Un VLAN isole logiquement le trafic mais ne chiffre rien.',
      C: 'Le débit physique d’un port ne dépend pas du VLAN auquel il appartient.',
      D: "C'est l'inverse : sans routage, deux postes de VLAN différents ne communiquent pas du tout.",
    },
    aRetenir:
      'Un VLAN = un domaine de diffusion = en général un sous-réseau IP ; entre VLAN, il faut un routeur ou un commutateur de niveau 3.',
  },
  {
    id: 'RES-COM-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'moyen',
    enonce:
      "Les postes du VLAN 30 branchés sur SW-AGENCE-1 ne joignent pas ceux du VLAN 30 branchés sur SW-AGENCE-2, alors que les VLAN 10 et 20 fonctionnent entre les deux commutateurs. Voici la configuration (générique, de type Cisco IOS) du lien qui les relie. Quelle est la cause ?",
    extrait: {
      langage: 'texte',
      contenu: `SW-AGENCE-1# show running-config interface GigabitEthernet0/48
interface GigabitEthernet0/48
 description Liaison vers SW-AGENCE-2
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99`,
    },
    options: [
      { id: 'A', texte: 'Le VLAN natif 99 bloque tout le trafic étiqueté' },
      { id: 'B', texte: 'Le VLAN 30 ne figure pas dans la liste des VLAN autorisés sur le trunk' },
      { id: 'C', texte: 'Un trunk ne peut transporter que trois VLAN au maximum' },
      { id: 'D', texte: 'Le port devrait être en mode access pour transporter plusieurs VLAN' },
    ],
    bonneReponse: 'B',
    explication:
      "La commande `switchport trunk allowed vlan 10,20,99` limite le trunk à ces trois VLAN : les trames du VLAN 30 ne sont pas transmises. Il faut ajouter le VLAN 30 à la liste (de chaque côté) et vérifier qu'il existe sur les deux commutateurs.",
    pourquoiPas: {
      A: "Le VLAN natif ne concerne que les trames non étiquetées ; les VLAN 10 et 20, étiquetés, passent d'ailleurs très bien.",
      C: 'Aucune limite de ce type : un trunk 802.1Q peut transporter jusqu’à 4 094 VLAN.',
      D: "Un port access n'appartient qu'à un seul VLAN ; c'est justement le trunk qui transporte plusieurs VLAN.",
    },
    aRetenir:
      'Quand un seul VLAN « ne passe pas » entre deux commutateurs, vérifiez d’abord la liste `allowed vlan` des trunks et l’existence du VLAN des deux côtés.',
  },
  {
    id: 'RES-COM-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'moyen',
    enonce:
      "Pour la redondance, un technicien relie deux commutateurs d'agence par deux câbles, mais le protocole Spanning Tree a été désactivé. Que risque-t-il de se produire ?",
    options: [
      { id: 'A', texte: 'Le débit entre les deux commutateurs double automatiquement' },
      { id: 'B', texte: 'Une tempête de diffusion qui sature le réseau' },
      { id: 'C', texte: 'Rien : les commutateurs détectent seuls le câble en double et l’ignorent' },
      { id: 'D', texte: 'Les adresses IP des postes entrent en conflit' },
    ],
    bonneReponse: 'B',
    explication:
      "Une trame Ethernet n'a pas de TTL : dans une boucle, chaque diffusion est recopiée indéfiniment, les tables MAC deviennent instables et le réseau se paralyse. STP (802.1D) et sa version rapide RSTP (802.1w) bloquent le lien redondant et le réactivent si le lien principal tombe. Pour additionner les débits, il faut une agrégation de liens (LACP).",
    pourquoiPas: {
      A: "Doubler le débit exige une agrégation de liens configurée (LACP) ; sinon, les deux câbles forment simplement une boucle.",
      C: "C'est précisément le rôle de STP ; sans lui, rien ne bloque le lien redondant.",
      D: "Le problème est de niveau 2 : les adresses IP ne changent pas, même si toute communication devient impossible.",
    },
    aRetenir: 'Une trame Ethernet n’a pas de TTL : toute boucle de niveau 2 sans STP provoque une tempête de diffusion.',
  },
  {
    id: 'RES-COM-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'moyen',
    enonce:
      "Un serveur de sauvegarde est relié au cœur de réseau par une agrégation LACP de 4 liens à 1 Gbit/s. Une copie de fichier unique (une seule connexion TCP) plafonne pourtant à environ 1 Gbit/s. Pourquoi ?",
    options: [
      { id: 'A', texte: 'LACP est mal configuré : un agrégat correct offrirait 4 Gbit/s à chaque connexion, même isolée' },
      { id: 'B', texte: 'LACP fonctionne en actif/passif : un seul lien est utilisé à la fois' },
      { id: 'C', texte: 'Les trames d’une même connexion suivent toujours un seul lien (répartition par flux)' },
      { id: 'D', texte: 'Il faudrait des liens de vitesses différentes pour que LACP les additionne' },
    ],
    bonneReponse: 'C',
    explication:
      "Pour éviter de désordonner les trames d'une même conversation, l'agrégat choisit le lien par un hachage (adresses MAC/IP, ports) : tous les paquets d'un flux suivent le même lien physique. La capacité de 4 Gbit/s est atteinte avec plusieurs flux simultanés ; l'agrégation apporte aussi la redondance.",
    pourquoiPas: {
      A: "C'est le comportement normal de LACP, pas une erreur de configuration.",
      B: "Tous les liens actifs de l'agrégat portent du trafic ; c'est la répartition par flux qui limite une connexion isolée.",
      D: "C'est l'inverse : les liens d'un même agrégat doivent avoir la même vitesse et le même mode duplex.",
    },
    aRetenir:
      'Une agrégation de liens additionne la capacité pour l’ensemble des flux, pas pour une connexion isolée.',
  },
  {
    id: 'RES-COM-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'moyen',
    enonce:
      "Dans l'étiquette 802.1Q insérée dans une trame Ethernet, combien de bits identifient le VLAN, et combien de VLAN utilisables cela permet-il ?",
    options: [
      { id: 'A', texte: '8 bits, soit 254 VLAN' },
      { id: 'B', texte: '16 bits, soit 65 534 VLAN' },
      { id: 'C', texte: '12 bits, soit 4 094 VLAN' },
      { id: 'D', texte: '10 bits, soit 1 022 VLAN' },
    ],
    bonneReponse: 'C',
    explication:
      "L'étiquette 802.1Q fait 4 octets : 16 bits de TPID (0x8100), 3 bits de priorité (802.1p, utilisés par la QoS), 1 bit DEI et 12 bits de VLAN ID. 2¹² = 4 096 valeurs, dont 0 et 4095 sont réservées : 4 094 VLAN utilisables.",
    pourquoiPas: {
      A: '8 bits ne suffiraient pas aux grands réseaux ; le VLAN ID occupe 12 bits.',
      B: '16 bits est la taille du TPID (0x8100), qui signale la présence de l’étiquette, pas celle du VLAN ID.',
      D: 'Aucun champ de 10 bits n’existe dans l’étiquette 802.1Q.',
    },
    aRetenir:
      '802.1Q : étiquette de 4 octets, VLAN ID sur 12 bits (VLAN 1 à 4094) et 3 bits de priorité 802.1p pour la QoS.',
  },
  {
    id: 'RES-COM-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Commutation & VLAN',
    difficulte: 'difficile',
    enonce:
      "Le routage inter-VLAN d'une agence passe par un routeur « sur un bâton » (une interface physique en trunk vers le commutateur). Les postes du VLAN 10 joignent leur passerelle, mais pas ceux du VLAN 20 (192.168.20.0/24). Voici la configuration du routeur. Quelle est l'erreur ?",
    extrait: {
      langage: 'texte',
      contenu: `interface GigabitEthernet0/0
 no ip address
!
interface GigabitEthernet0/0.10
 description VLAN 10 - Guichets
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
!
interface GigabitEthernet0/0.20
 description VLAN 20 - Bureaux
 encapsulation dot1Q 30
 ip address 192.168.20.1 255.255.255.0`,
    },
    options: [
      { id: 'A', texte: 'La sous-interface .20 traite les trames étiquetées VLAN 30 au lieu du VLAN 20' },
      { id: 'B', texte: 'L’interface physique GigabitEthernet0/0 n’a pas d’adresse IP' },
      { id: 'C', texte: 'Le masque 255.255.255.0 est incompatible avec le routage inter-VLAN' },
      { id: 'D', texte: 'Un routeur ne peut pas porter deux adresses IP sur une même interface physique' },
    ],
    bonneReponse: 'A',
    explication:
      "C'est la commande `encapsulation dot1Q` qui lie une sous-interface à un VLAN ; le numéro « .20 » n'est qu'un libellé. Ici, les trames du VLAN 20 arrivent étiquetées 20 et aucune sous-interface ne les accepte : la passerelle 192.168.20.1 est injoignable. Correction : `encapsulation dot1Q 20` sur GigabitEthernet0/0.20.",
    pourquoiPas: {
      B: "Dans ce montage, l'interface physique reste sans adresse : ce sont les sous-interfaces qui portent les passerelles, et le VLAN 10 fonctionne ainsi.",
      C: 'Un /24 par VLAN est un choix classique ; le VLAN 10 fonctionne avec le même masque.',
      D: "C'est tout le principe du routeur « sur un bâton » : plusieurs sous-interfaces logiques, chacune avec son adresse, sur une seule interface physique.",
    },
    aRetenir:
      'Sur une sous-interface, c’est `encapsulation dot1Q <VLAN>` qui fixe le VLAN servi, pas le numéro de la sous-interface.',
  },

  // ───────────────────────────── Routage ─────────────────────────────
  {
    id: 'RES-ROU-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'facile',
    enonce:
      "La Banque Alpha veut relier ses agences provinciales à travers le réseau d'un opérateur, avec un trafic isolé de celui des autres clients et des classes de service (QoS) garanties par contrat. Quelle offre correspond le mieux ?",
    options: [
      { id: 'A', texte: 'Un VPN MPLS de niveau 3 fourni par l’opérateur' },
      { id: 'B', texte: 'Un simple accès Internet avec NAT dans chaque agence' },
      { id: 'C', texte: 'Un réseau Wi-Fi public partagé entre les agences' },
      { id: 'D', texte: 'Un VLAN natif étendu à travers Internet' },
    ],
    bonneReponse: 'A',
    explication:
      "Dans un VPN MPLS, l'opérateur sépare chaque client dans sa propre table de routage (VRF) et achemine le trafic par étiquettes, avec des classes de service définies dans le contrat (SLA). L'alternative moins chère est un VPN IPsec sur Internet, mais sans garantie de qualité de bout en bout.",
    pourquoiPas: {
      B: "Internet fonctionne au « meilleur effort » : ni isolement contractuel ni QoS garantie ; le NAT n'est pas une séparation de réseaux.",
      C: "Un Wi-Fi public n'a ni la portée nécessaire entre provinces ni aucune isolation contractuelle du trafic.",
      D: 'Un VLAN est une notion de réseau local (niveau 2) : il ne se prolonge pas tel quel à travers Internet.',
    },
    aRetenir:
      'VPN MPLS opérateur = isolement par client (VRF) + QoS contractuelle ; VPN IPsec sur Internet = moins cher, sans garantie de bout en bout.',
  },
  {
    id: 'RES-ROU-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'facile',
    enonce:
      "Un poste joint l'imprimante 192.168.1.20 de son agence, mais aucune adresse hors de son réseau (siège, Internet). Voici sa configuration. Quelle est la cause ?",
    extrait: {
      langage: 'texte',
      contenu: `Carte Ethernet Ethernet0 :
   Adresse IPv4. . . . . . . . . . . . . .: 192.168.1.37
   Masque de sous-réseau. . . . . . . . . : 255.255.255.0
   Passerelle par défaut. . . . . . . . . :
   Serveurs DNS. . . . . . . . . . . . . .: 192.168.1.10`,
    },
    options: [
      { id: 'A', texte: 'Le masque /24 est trop petit pour joindre Internet' },
      { id: 'B', texte: 'Le serveur DNS est sur le même réseau que le poste' },
      { id: 'C', texte: 'L’adresse 192.168.1.37 est publique, donc filtrée par le routeur de l’opérateur' },
      { id: 'D', texte: 'Aucune passerelle par défaut n’est configurée' },
    ],
    bonneReponse: 'D',
    explication:
      "Pour toute destination hors de son sous-réseau, un hôte envoie le paquet à sa passerelle par défaut (sa route 0.0.0.0/0). Le champ est vide : le poste ne peut parler qu'aux machines de 192.168.1.0/24. Il faut renseigner la passerelle (souvent via DHCP).",
    pourquoiPas: {
      A: "Le masque définit l'étendue du réseau local, pas la portée des communications : avec une passerelle, un /24 joint n'importe quelle destination.",
      B: 'Un serveur DNS sur le réseau local est courant et souhaitable ; il ne remplace pas la passerelle.',
      C: "192.168.x.x est une plage privée ; c'est le NAT en sortie qui permet ensuite d'aller sur Internet.",
    },
    aRetenir:
      'Joignable en local mais pas au-delà : vérifiez d’abord la passerelle par défaut (route 0.0.0.0/0).',
  },
  {
    id: 'RES-ROU-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'moyen',
    enonce: 'Voici la table de routage d’un serveur Linux. Par quelle passerelle envoie-t-il un paquet destiné à 10.1.3.5 ?',
    extrait: {
      langage: 'shell',
      contenu: `$ ip route
default via 10.0.0.1 dev eth0
10.0.0.0/8 via 10.0.0.2 dev eth0
10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.50
10.1.0.0/16 via 10.0.0.3 dev eth0
10.1.2.0/24 via 10.0.0.4 dev eth0`,
    },
    options: [
      { id: 'A', texte: '10.0.0.1 (route par défaut)' },
      { id: 'B', texte: '10.0.0.2' },
      { id: 'C', texte: '10.0.0.3' },
      { id: 'D', texte: '10.0.0.4' },
    ],
    bonneReponse: 'C',
    explication:
      "Trois routes contiennent 10.1.3.5 : la route par défaut (/0), 10.0.0.0/8 et 10.1.0.0/16. La route 10.1.2.0/24 ne la contient pas (elle s'arrête à 10.1.2.255). La règle du préfixe le plus long retient 10.1.0.0/16, donc la passerelle 10.0.0.3.",
    pourquoiPas: {
      A: "La route par défaut ne sert que lorsqu'aucune route plus précise ne correspond.",
      B: '10.0.0.0/8 correspond, mais elle est moins précise que 10.1.0.0/16.',
      D: '10.1.3.5 n’appartient pas à 10.1.2.0/24 : cette route ne s’applique pas.',
    },
    aRetenir:
      'Le routage choisit la route au préfixe le plus long qui contient la destination (longest prefix match), quel que soit l’ordre d’affichage.',
  },
  {
    id: 'RES-ROU-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'moyen',
    enonce:
      "Un routeur Cisco apprend le préfixe 10.30.0.0/16 à la fois par OSPF, par RIP et par une route statique configurée par l'administrateur. Avec les distances administratives par défaut, quelle route est installée dans la table de routage ?",
    options: [
      { id: 'A', texte: 'La route OSPF, car OSPF calcule le meilleur chemin' },
      { id: 'B', texte: 'La route statique (distance administrative 1)' },
      { id: 'C', texte: 'La route RIP, car elle a été apprise la première' },
      { id: 'D', texte: 'Les trois, en partage de charge' },
    ],
    bonneReponse: 'B',
    explication:
      "Quand plusieurs sources proposent le même préfixe, le routeur retient celle de plus faible distance administrative. Valeurs par défaut Cisco : connectée 0, statique 1, eBGP 20, OSPF 110, RIP 120. La métrique ne sert qu'à départager des routes d'un même protocole.",
    pourquoiPas: {
      A: 'La distance par défaut d’OSPF (110) est supérieure à celle d’une route statique (1).',
      C: "RIP a une distance de 120 ; l'ordre d'apprentissage n'intervient pas.",
      D: 'Le partage de charge (ECMP) ne concerne que des routes d’une même source et de même coût.',
    },
    aRetenir:
      'Entre sources de routage, la distance administrative la plus faible gagne (connectée 0, statique 1, OSPF 110, RIP 120) ; la métrique ne départage qu’au sein d’un même protocole.',
  },
  {
    id: 'RES-ROU-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'moyen',
    enonce:
      "La Banque Alpha se raccorde à deux fournisseurs d'accès Internet, avec son propre bloc d'adresses publiques qu'elle veut annoncer aux deux. Quel protocole de routage est conçu pour cet échange entre systèmes autonomes ?",
    options: [
      { id: 'A', texte: 'RIP' },
      { id: 'B', texte: 'OSPF' },
      { id: 'C', texte: 'STP' },
      { id: 'D', texte: 'BGP' },
    ],
    bonneReponse: 'D',
    explication:
      "BGP est le protocole de routage entre systèmes autonomes (EGP) : il échange des préfixes avec les opérateurs et permet d'appliquer des politiques (préférer un fournisseur, garder l'autre en secours). OSPF et RIP sont des protocoles internes (IGP), utilisés à l'intérieur d'un même réseau.",
    pourquoiPas: {
      A: 'RIP est un protocole interne, limité à 15 sauts, inadapté aux échanges avec des opérateurs.',
      B: "OSPF est un protocole interne (IGP), conçu pour le routage à l'intérieur d'un même système autonome.",
      C: "STP n'est pas un protocole de routage : il évite les boucles de niveau 2 entre commutateurs.",
    },
    aRetenir:
      'IGP (OSPF, RIP…) à l’intérieur d’un réseau ; BGP entre systèmes autonomes, notamment avec les opérateurs.',
  },
  {
    id: 'RES-ROU-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'moyen',
    enonce:
      "Le portail d'un partenaire (203.0.113.80) est injoignable depuis le siège. Que montre ce traceroute ?",
    extrait: {
      langage: 'shell',
      contenu: `$ traceroute -n 203.0.113.80
traceroute to 203.0.113.80 (203.0.113.80), 30 hops max, 60 byte packets
 1  192.168.1.1     0.512 ms  0.488 ms  0.470 ms
 2  10.255.0.1      2.104 ms  2.097 ms  2.311 ms
 3  198.51.100.9    7.842 ms  7.901 ms  7.765 ms
 4  * * *
 5  * * *
 6  * * *
(… jusqu'au saut 30 : * * *)`,
    },
    options: [
      { id: 'A', texte: 'Le poste n’a pas de passerelle par défaut' },
      { id: 'B', texte: 'Le problème vient du premier routeur, 192.168.1.1, qui ne transmet plus les paquets' },
      { id: 'C', texte: 'La destination a répondu et fonctionne normalement' },
      { id: 'D', texte: 'La coupure ou le filtrage se situe après 198.51.100.9' },
    ],
    bonneReponse: 'D',
    explication:
      "Chaque routeur dont le TTL expire renvoie un ICMP « Time Exceeded » : les trois premiers sauts répondent normalement. À partir du saut 4, plus aucune réponse et la destination n'apparaît jamais : le problème (lien coupé, route manquante ou filtrage) se situe après 198.51.100.9. Un « * » isolé suivi de sauts qui répondent n'est en revanche souvent qu'un routeur qui ne répond pas à l'ICMP.",
    pourquoiPas: {
      A: 'Le premier saut (192.168.1.1) répond : le poste utilise bien une passerelle.',
      B: '192.168.1.1 et les deux sauts suivants répondent en quelques millisecondes.',
      C: 'L’adresse 203.0.113.80 n’apparaît jamais dans la trace.',
    },
    aRetenir:
      'Dans un traceroute, repérez le dernier saut qui répond : le problème se situe juste après (sauf « * » isolés suivis de réponses, souvent un simple filtrage ICMP).',
  },
  {
    id: 'RES-ROU-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'difficile',
    enonce:
      "Dans un réseau OSPF laissé à la bande passante de référence par défaut de nombreux routeurs (100 Mbit/s), l'administrateur constate qu'un lien à 1 Gbit/s et un lien à 10 Gbit/s sont traités comme équivalents. Pourquoi ?",
    options: [
      { id: 'A', texte: 'Coût = référence ÷ débit, au minimum 1 : les deux liens coûtent 1' },
      { id: 'B', texte: 'OSPF ne tient compte que du nombre de sauts entre routeurs, pas du débit des liens' },
      { id: 'C', texte: 'OSPF préfère toujours le lien activé le plus récemment' },
      { id: 'D', texte: 'Le coût OSPF dépend de la latence mesurée, identique sur les deux liens' },
    ],
    bonneReponse: 'A',
    explication:
      "Coût = 100 Mbit/s ÷ débit du lien, sans descendre sous 1 : 100 Mbit/s → 1, 1 Gbit/s → 0,1 arrondi à 1, 10 Gbit/s → 1. OSPF ne distingue donc plus les liens rapides. On relève la référence (par exemple `auto-cost reference-bandwidth` sous Cisco IOS) de façon identique sur tous les routeurs, ou on fixe les coûts à la main.",
    pourquoiPas: {
      B: "C'est RIP qui compte les sauts ; OSPF utilise un coût dérivé du débit.",
      C: 'L’ancienneté d’un lien n’entre pas dans le calcul du plus court chemin.',
      D: 'OSPF ne mesure pas la latence : le coût est une valeur statique, calculée à partir du débit ou configurée.',
    },
    aRetenir:
      'Avec une référence OSPF de 100 Mbit/s, tous les liens d’au moins 100 Mbit/s coûtent 1 : relevez la référence sur tous les routeurs dès qu’il y a du gigabit.',
  },
  {
    id: 'RES-ROU-008',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Routage',
    difficulte: 'difficile',
    enonce:
      "Une agence de province dispose d'une fibre, par laquelle elle apprend sa route par défaut via OSPF (sortie simplifiée ci-dessous), et d'un lien VSAT de secours dont le prochain saut est 172.20.0.1. L'administrateur veut que le VSAT ne serve QUE si la fibre tombe. Quelle configuration retenir ?",
    extrait: {
      langage: 'texte',
      contenu: `R-AGENCE# show ip route 0.0.0.0
Entrée de routage pour 0.0.0.0/0
  Apprise par "ospf 1", distance 110, métrique 1
  * 10.99.0.1, via GigabitEthernet0/1 (fibre)`,
    },
    options: [
      { id: 'A', texte: '`ip route 0.0.0.0 0.0.0.0 172.20.0.1 250` (route statique de distance administrative 250)' },
      { id: 'B', texte: '`ip route 0.0.0.0 0.0.0.0 172.20.0.1` (route statique sans autre paramètre)' },
      { id: 'C', texte: '`ip route 0.0.0.0 0.0.0.0 172.20.0.1 50` (route statique de distance administrative 50)' },
      { id: 'D', texte: 'Annoncer le lien VSAT dans OSPF avec le même coût que la fibre' },
    ],
    bonneReponse: 'A',
    explication:
      "C'est une route statique « flottante » : avec une distance de 250, supérieure aux 110 d'OSPF, elle reste en réserve tant que la route OSPF existe. Si la fibre tombe, la route OSPF disparaît et la statique entre aussitôt dans la table ; au retour de la fibre, OSPF reprend la main.",
    pourquoiPas: {
      B: 'Sans paramètre, une route statique a une distance de 1 : elle l’emporterait sur OSPF et tout le trafic partirait par le VSAT.',
      C: 'Une distance de 50 reste inférieure à 110 : le VSAT serait préféré à la fibre en permanence.',
      D: 'À coût égal, OSPF répartirait le trafic sur les deux liens, y compris sur le VSAT lent et coûteux.',
    },
    aRetenir:
      'Route statique flottante = distance administrative supérieure à celle du protocole principal : elle n’entre en table que si la route principale disparaît.',
  },

  // ───────────────────────────── Réseaux sans fil & mobiles ─────────────────────────────
  {
    id: 'RES-SF-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'facile',
    enonce:
      "Pour le réseau Wi-Fi interne d'une agence, quel mécanisme de sécurité est aujourd'hui le plus robuste parmi ceux-ci ?",
    options: [
      { id: 'A', texte: 'WPA2 avec TKIP' },
      { id: 'B', texte: 'WPA3' },
      { id: 'C', texte: 'WEP' },
      { id: 'D', texte: 'Réseau ouvert avec filtrage des adresses MAC' },
    ],
    bonneReponse: 'B',
    explication:
      "WPA3 remplace l'échange de clé partagée de WPA2 par SAE, qui résiste aux attaques par dictionnaire hors ligne, et impose des protections plus fortes. WPA2 avec AES (CCMP) reste acceptable ; WEP et TKIP sont obsolètes. Pour le personnel, on vise le mode Entreprise (802.1X).",
    pourquoiPas: {
      A: 'TKIP est déprécié et présente des faiblesses connues : un WPA2 doit au minimum utiliser AES-CCMP.',
      C: 'WEP est cassé depuis longtemps : sa clé peut être retrouvée en quelques minutes.',
      D: 'Un réseau ouvert ne chiffre rien, et les adresses MAC circulent en clair : elles sont faciles à usurper.',
    },
    aRetenir:
      'Wi-Fi : WPA3 (ou à défaut WPA2-AES), en mode Entreprise 802.1X pour le personnel ; jamais WEP, TKIP ni réseau ouvert.',
  },
  {
    id: 'RES-SF-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'facile',
    enonce:
      "Dans la bande des 2,4 GHz, avec des canaux de 20 MHz, quels canaux attribuer à trois points d'accès voisins pour qu'ils ne se chevauchent pas ?",
    options: [
      { id: 'A', texte: '1, 2 et 3' },
      { id: 'B', texte: '2, 4 et 6' },
      { id: 'C', texte: '1, 6 et 11' },
      { id: 'D', texte: '6, 7 et 8' },
    ],
    bonneReponse: 'C',
    explication:
      "En 2,4 GHz, les centres des canaux ne sont espacés que de 5 MHz alors qu'un canal occupe environ 20 MHz : des canaux proches se recouvrent. La combinaison 1, 6 et 11 est la référence pour éviter tout chevauchement. Le 5 GHz offre beaucoup plus de canaux indépendants.",
    pourquoiPas: {
      A: 'Des canaux adjacents se recouvrent presque entièrement : les points d’accès se brouillent mutuellement.',
      B: 'Un écart de 10 MHz ne suffit pas : ces canaux se chevauchent encore largement.',
      D: 'Des canaux consécutifs se recouvrent presque totalement, comme 1, 2 et 3.',
    },
    aRetenir:
      'En 2,4 GHz, les canaux sont espacés de 5 MHz : seuls 1, 6 et 11 ne se chevauchent pas ; utilisez le 5 GHz pour disposer de plus de canaux.',
  },
  {
    id: 'RES-SF-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'facile',
    enonce: 'Par rapport à la bande des 2,4 GHz, la bande des 5 GHz offre en général :',
    options: [
      { id: 'A', texte: 'Une meilleure portée et une meilleure traversée des murs, mais moins de débit' },
      { id: 'B', texte: 'Plus de canaux et de débit, mais une portée plus courte' },
      { id: 'C', texte: 'Exactement les mêmes performances ; seule la sécurité change' },
      { id: 'D', texte: 'Une compatibilité avec tous les anciens équipements 802.11b' },
    ],
    bonneReponse: 'B',
    explication:
      "Le 5 GHz dispose de nombreux canaux, souvent plus larges, et d'une bande moins encombrée : les débits sont meilleurs. En contrepartie, une fréquence plus élevée s'atténue davantage avec la distance et les obstacles. Les points d'accès récents combinent les deux bandes.",
    pourquoiPas: {
      A: "C'est le profil du 2,4 GHz : meilleure portée, mais peu de canaux et une bande encombrée.",
      C: "La sécurité (WPA2, WPA3) est indépendante de la bande ; ce sont les caractéristiques radio qui changent.",
      D: '802.11b ne fonctionne qu’en 2,4 GHz.',
    },
    aRetenir: '2,4 GHz : portée, peu de canaux, bande encombrée ; 5 GHz : débit et nombreux canaux, portée plus courte.',
  },
  {
    id: 'RES-SF-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'moyen',
    enonce:
      "Un ordinateur portable affiche un débit de liaison Wi-Fi de 866 Mbit/s, mais une copie de fichier depuis ce portable, tout près du point d'accès, plafonne vers 400 Mbit/s. Quelle est l'explication principale ?",
    options: [
      { id: 'A', texte: 'Le point d’accès est défectueux et doit être remplacé' },
      { id: 'B', texte: 'Le Wi-Fi fonctionne en duplex intégral : le débit annoncé est partagé entre émission et réception' },
      { id: 'C', texte: 'Le débit annoncé est exprimé en mégaoctets par seconde, et non en mégabits' },
      { id: 'D', texte: 'Le Wi-Fi est un support partagé en semi-duplex, avec une forte surcharge protocolaire' },
    ],
    bonneReponse: 'D',
    explication:
      "Le débit de liaison est la vitesse brute de modulation. Une seule station parle à la fois sur le canal, avec des temps d'attente (CSMA/CA), des accusés de réception et des en-têtes radio : le débit utile n'en représente souvent qu'environ la moitié. Il se partage en plus entre tous les clients de la cellule.",
    pourquoiPas: {
      A: "Un rendement de cet ordre est normal en Wi-Fi ; il n'indique pas une panne.",
      B: "C'est l'inverse : le Wi-Fi est semi-duplex, une seule station émet à la fois sur un canal.",
      C: 'Les débits Wi-Fi sont toujours exprimés en mégabits par seconde.',
    },
    aRetenir:
      'En Wi-Fi, le débit utile est souvent de l’ordre de la moitié du débit de liaison annoncé, et il se partage entre tous les clients de la cellule.',
  },
  {
    id: 'RES-SF-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'moyen',
    enonce:
      "Pourquoi préférer le mode Entreprise de WPA2/WPA3 (802.1X avec un serveur RADIUS) à une clé partagée (PSK) pour le Wi-Fi du personnel d'une banque ?",
    options: [
      { id: 'A', texte: 'Parce que le mode Entreprise ne nécessite ni mot de passe ni certificat' },
      { id: 'B', texte: 'Parce que le mode Entreprise augmente la portée des points d’accès' },
      { id: 'C', texte: 'Parce qu’une clé partagée (PSK) est incompatible avec le chiffrement AES utilisé par WPA2' },
      { id: 'D', texte: 'Parce que chaque agent a ses propres identifiants, révocables individuellement' },
    ],
    bonneReponse: 'D',
    explication:
      "Avec 802.1X, chaque utilisateur ou appareil s'authentifie individuellement (identifiants d'annuaire ou certificat) auprès d'un serveur RADIUS. Au départ d'un agent, on désactive son seul compte, sans changer une clé commune sur tous les postes, et chaque connexion est journalisée. Le PSK convient plutôt aux invités ou à des équipements simples.",
    pourquoiPas: {
      A: 'Le mode Entreprise exige au contraire des identifiants ou des certificats (EAP-TLS, PEAP…).',
      B: 'Le mode d’authentification n’a aucun effet sur la propagation radio.',
      C: 'WPA2-PSK utilise bien AES-CCMP ; la faiblesse du PSK est la clé commune, pas le chiffrement.',
    },
    aRetenir:
      'Personnel = 802.1X (identité individuelle, RADIUS, traçabilité) ; PSK = invités ou équipements simples, avec rotation régulière de la clé.',
  },
  {
    id: 'RES-SF-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'moyen',
    enonce:
      "Une banque déploie des terminaux de paiement connectés en 4G chez des commerçants. Elle veut que leur trafic ne transite pas par l'Internet public mais arrive directement sur son réseau. Que doit-elle demander à l'opérateur mobile ?",
    options: [
      { id: 'A', texte: 'Des cartes SIM grand public, avec un VPN installé par chaque commerçant' },
      { id: 'B', texte: 'Une connexion limitée à la 2G, réputée plus sûre' },
      { id: 'C', texte: 'Un APN privé, relié au réseau de la banque par une liaison dédiée ou un tunnel' },
      { id: 'D', texte: 'Le partage de connexion depuis le téléphone du commerçant' },
    ],
    bonneReponse: 'C',
    explication:
      "L'APN (Access Point Name) désigne la passerelle par laquelle le trafic data d'une carte SIM sort du réseau mobile. Un APN privé place les terminaux dans un réseau isolé, avec un adressage propre, acheminé jusqu'au système d'information de la banque (liaison louée ou tunnel IPsec). On garde en plus le chiffrement de bout en bout des transactions.",
    pourquoiPas: {
      A: "Des SIM grand public sortent par l'APN Internet de l'opérateur, et la sécurité dépendrait de chaque commerçant.",
      B: "La 2G n'isole pas le trafic, et son chiffrement radio historique est réputé faible.",
      D: 'Le téléphone du commerçant est un équipement non maîtrisé, qui sort lui aussi par Internet.',
    },
    aRetenir:
      'Pour des terminaux professionnels connectés en 4G (TPE, GAB), APN privé + chiffrement de bout en bout : le trafic évite l’Internet public.',
  },
  {
    id: 'RES-SF-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Réseaux sans fil & mobiles',
    difficulte: 'difficile',
    enonce:
      "En espace libre, si l'on double la distance entre un point d'accès et un client, de combien la puissance reçue diminue-t-elle ?",
    options: [
      { id: 'A', texte: 'De 3 dB (elle est divisée par 2)' },
      { id: 'B', texte: 'De 10 dB (elle est divisée par 10)' },
      { id: 'C', texte: 'D’environ 6 dB (elle est divisée par 4)' },
      { id: 'D', texte: 'De 20 dB (elle est divisée par 100)' },
    ],
    bonneReponse: 'C',
    explication:
      "En espace libre, la puissance reçue décroît comme le carré de la distance. Doubler la distance divise la puissance par 2² = 4, soit 10 × log₁₀(4) ≈ 6 dB. En intérieur, murs et obstacles ajoutent encore des pertes.",
    pourquoiPas: {
      A: 'Une baisse de 3 dB supposerait une puissance inversement proportionnelle à la distance, et non à son carré.',
      B: 'Diviser la puissance par 10 correspond à multiplier la distance par environ 3,16 (√10).',
      D: 'Une baisse de 20 dB correspond à une distance multipliée par 10.',
    },
    aRetenir: 'En espace libre, la puissance reçue suit 1/d² : distance × 2 → −6 dB, distance × 10 → −20 dB.',
  },

  // ───────────────────────────── Transmission & télécoms ─────────────────────────────
  {
    id: 'RES-TX-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'facile',
    enonce:
      'Pour relier par fibre optique le siège et un site de secours distants de 15 km, quel type de fibre faut-il choisir ?',
    options: [
      { id: 'A', texte: 'Une fibre multimode, dont le cœur plus large porte la lumière plus loin' },
      { id: 'B', texte: 'Un câble cuivre de catégorie 6A, plus simple à poser' },
      { id: 'C', texte: 'Une fibre multimode OM1' },
      { id: 'D', texte: 'Une fibre monomode, conçue pour les longues distances' },
    ],
    bonneReponse: 'D',
    explication:
      "La fibre monomode (cœur d'environ 9 µm) ne propage qu'un seul mode lumineux : très peu de dispersion, d'où des portées de plusieurs dizaines de kilomètres. La multimode (cœur de 50 ou 62,5 µm) est limitée à quelques centaines de mètres aux débits actuels, et le cuivre Ethernet à 100 m.",
    pourquoiPas: {
      A: "Un cœur large propage plusieurs modes qui arrivent décalés (dispersion modale) : c'est ce qui limite la portée de la multimode.",
      B: 'Un lien Ethernet en cuivre est limité à 100 m.',
      C: 'OM1 est la plus ancienne et la plus limitée des catégories multimode ; aucune multimode ne convient à 15 km.',
    },
    aRetenir:
      'Monomode (cœur ≈ 9 µm) pour les kilomètres ; multimode (50 ou 62,5 µm) pour l’intérieur des bâtiments et les salles serveurs.',
  },
  {
    id: 'RES-TX-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'facile',
    enonce:
      'Quelle est la longueur maximale d’un lien Ethernet en paire torsadée (catégorie 5e, 6 ou 6A) entre le commutateur et le poste ?',
    options: [
      { id: 'A', texte: '50 mètres' },
      { id: 'B', texte: '100 mètres' },
      { id: 'C', texte: '500 mètres' },
      { id: 'D', texte: '2 kilomètres' },
    ],
    bonneReponse: 'B',
    explication:
      "Les normes de câblage fixent le canal à 100 m : 90 m de câble fixe et 10 m de cordons au total. Au-delà, il faut passer à la fibre ou ajouter un équipement actif. La catégorie fait varier le débit supporté (la 6A permet 10 Gbit/s sur 100 m), pas cette longueur.",
    pourquoiPas: {
      A: 'Cette limite est trop restrictive : la norme autorise 100 m.',
      C: "500 m était la limite de l'ancien Ethernet sur câble coaxial épais (10BASE5), pas de la paire torsadée.",
      D: 'Plusieurs kilomètres exigent de la fibre optique.',
    },
    aRetenir: 'Cuivre Ethernet : 100 m maximum (90 m de câble fixe + cordons) ; au-delà, fibre optique.',
  },
  {
    id: 'RES-TX-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'moyen',
    enonce:
      'Il faut répliquer une sauvegarde de 45 Go vers le site de secours sur une liaison de 100 Mbit/s, dont le débit utile est estimé à 80 %. Combien de temps prend le transfert (1 Go = 10⁹ octets) ?',
    options: [
      { id: 'A', texte: 'Environ 1 heure' },
      { id: 'B', texte: 'Environ 9 minutes 20 secondes' },
      { id: 'C', texte: 'Environ 10 heures' },
      { id: 'D', texte: 'Environ 1 heure 15 minutes' },
    ],
    bonneReponse: 'D',
    explication:
      "45 × 10⁹ octets × 8 = 360 × 10⁹ bits. Le débit utile est de 100 × 0,8 = 80 Mbit/s. 360 × 10⁹ ÷ 80 × 10⁶ = 4 500 s, soit 75 minutes.",
    pourquoiPas: {
      A: 'Une heure (3 600 s) correspond au débit brut de 100 Mbit/s : le rendement de 80 % a été oublié.',
      B: 'Ce résultat divise des octets par des bits par seconde : la multiplication par 8 a été oubliée.',
      C: 'Dix heures résultent d’une double multiplication par 8 : la conversion octets → bits ne se fait qu’une fois.',
    },
    aRetenir:
      'Temps = volume en bits ÷ débit utile en bit/s : multipliez les octets par 8 et appliquez le rendement réel du lien.',
  },
  {
    id: 'RES-TX-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'moyen',
    enonce:
      "Un émetteur radio délivre 100 mW (20 dBm). Le câble et les connecteurs jusqu'à l'antenne introduisent 6 dB de pertes. Quelle puissance arrive à l'antenne ?",
    options: [
      { id: 'A', texte: 'Environ 25 mW (14 dBm)' },
      { id: 'B', texte: 'Environ 94 mW' },
      { id: 'C', texte: 'Environ 50 mW' },
      { id: 'D', texte: 'Environ 16,7 mW' },
    ],
    bonneReponse: 'A',
    explication:
      "En dBm, les pertes se soustraient : 20 − 6 = 14 dBm. Reconverti : 10^(14/10) ≈ 25 mW. Retenir que −3 dB divise la puissance par 2 : −6 dB la divise donc par 4.",
    pourquoiPas: {
      B: 'Ce calcul retire 6 mW au lieu de 6 dB : les décibels sont une échelle logarithmique.',
      C: '50 mW correspond à une perte de 3 dB seulement.',
      D: 'Ce calcul divise par 6 ; une perte de 6 dB divise la puissance par 10^0,6 ≈ 4.',
    },
    aRetenir: '−3 dB ≈ puissance ÷ 2, −6 dB ≈ ÷ 4, −10 dB = ÷ 10 ; en dBm, gains et pertes s’additionnent simplement.',
  },
  {
    id: 'RES-TX-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'moyen',
    enonce:
      "Une agence de province reliée par VSAT (satellite géostationnaire, à environ 36 000 km d'altitude) dispose d'un débit suffisant, mais les applications interactives semblent lentes. Quelle est la cause physique principale ?",
    options: [
      { id: 'A', texte: 'La capacité du satellite est partagée avec la télévision' },
      { id: 'B', texte: 'La fibre terrestre de raccordement ajoute plus de latence que le satellite' },
      { id: 'C', texte: 'Les signaux satellites voyagent plus lentement que la lumière' },
      { id: 'D', texte: 'La latence de propagation : environ 0,5 s par aller-retour' },
    ],
    bonneReponse: 'D',
    explication:
      "Un aller terminal → satellite → station centrale représente au moins 2 × 36 000 km, soit environ 0,24 s à la vitesse de la lumière ; une requête et sa réponse prennent donc près d'une demi-seconde, avant tout traitement. Le débit n'y change rien : les applications qui multiplient les allers-retours en souffrent. Accélération TCP, optimisation WAN ou liaison terrestre réduisent l'effet.",
    pourquoiPas: {
      A: "Le partage de capacité réduirait le débit disponible, pas la latence de base ; or le débit est suffisant ici.",
      B: 'La fibre ajoute environ 5 µs par kilomètre : quelques millisecondes au plus, bien moins que le trajet satellite.',
      C: 'Les ondes radio se propagent à la vitesse de la lumière : c’est la distance qui coûte, pas la vitesse.',
    },
    aRetenir:
      'Débit et latence sont indépendants : un lien VSAT géostationnaire peut offrir du volume mais impose environ 0,5 s d’aller-retour.',
  },
  {
    id: 'RES-TX-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'moyen',
    enonce:
      'Quelle technique permet de transporter plusieurs canaux indépendants sur une même fibre optique, chacun sur une longueur d’onde différente ?',
    options: [
      { id: 'A', texte: 'Le multiplexage en longueur d’onde (WDM)' },
      { id: 'B', texte: 'Le multiplexage temporel (TDM)' },
      { id: 'C', texte: 'L’agrégation de liens LACP' },
      { id: 'D', texte: 'L’accès multiple par répartition en codes (CDMA)' },
    ],
    bonneReponse: 'A',
    explication:
      "Le WDM injecte dans la même fibre plusieurs porteuses lumineuses de longueurs d'onde différentes, chacune portant son propre canal. Le DWDM serre ces longueurs d'onde pour en loger des dizaines : c'est ainsi que les opérateurs multiplient la capacité de leurs dorsales sans poser de nouvelles fibres.",
    pourquoiPas: {
      B: 'Le TDM partage le temps en intervalles successifs sur un même canal, pas les longueurs d’onde.',
      C: 'LACP regroupe plusieurs liens physiques distincts ; il ne crée pas de canaux dans une même fibre.',
      D: 'Le CDMA distingue les utilisateurs par des codes ; c’est une technique d’accès radio (3G), pas optique.',
    },
    aRetenir:
      'WDM/DWDM = une longueur d’onde par canal : c’est ce qui multiplie la capacité des fibres des opérateurs.',
  },
  {
    id: 'RES-TX-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'difficile',
    enonce:
      "Un transfert entre le siège et un centre de données distant passe sur un lien de 100 Mbit/s avec un RTT de 50 ms. La fenêtre de réception TCP est bloquée à 65 535 octets (pas de window scaling). Quel débit maximal théorique ce transfert peut-il atteindre ?",
    options: [
      { id: 'A', texte: '100 Mbit/s : la fenêtre n’a pas d’influence' },
      { id: 'B', texte: 'Environ 10,5 Mbit/s' },
      { id: 'C', texte: 'Environ 1,3 Mbit/s' },
      { id: 'D', texte: 'Environ 50 Mbit/s' },
    ],
    bonneReponse: 'B',
    explication:
      "TCP ne peut pas avoir plus d'une fenêtre de données en vol par aller-retour : débit max ≈ 65 535 × 8 bits ÷ 0,05 s ≈ 10,5 Mbit/s. Pour remplir le lien, la fenêtre devrait atteindre le produit débit × délai : 100 Mbit/s × 50 ms = 625 000 octets, ce que permet l'option window scaling (RFC 7323).",
    pourquoiPas: {
      A: 'La fenêtre limite bien le débit : l’émetteur doit attendre les accusés de réception avant d’envoyer davantage.',
      C: '1,3 correspond au résultat en mégaoctets par seconde (65 535 ÷ 0,05) : la conversion en bits a été oubliée.',
      D: 'Aucun calcul ne conduit à la moitié du débit : la limite vient du rapport fenêtre ÷ RTT.',
    },
    aRetenir:
      'Débit TCP max ≈ fenêtre ÷ RTT ; pour remplir un lien, la fenêtre doit atteindre le produit débit × délai.',
  },
  {
    id: 'RES-TX-008',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Transmission & télécoms',
    difficulte: 'difficile',
    enonce: 'Voici les caractéristiques d’une liaison optique. Quelle marge reste-t-il sur son bilan de puissance ?',
    extrait: {
      langage: 'texte',
      contenu: `Liaison fibre monomode siège → site de secours (1 310 nm)
Longueur                 : 20 km
Atténuation de la fibre  : 0,35 dB/km
Connecteurs              : 2 × 0,5 dB
Épissures (soudures)     : 4 × 0,1 dB
Puissance d'émission     : −3 dBm
Sensibilité du récepteur : −20 dBm`,
    },
    options: [
      { id: 'A', texte: '17 dB' },
      { id: 'B', texte: '9,6 dB' },
      { id: 'C', texte: '10 dB' },
      { id: 'D', texte: '8,6 dB' },
    ],
    bonneReponse: 'D',
    explication:
      "Budget disponible : −3 − (−20) = 17 dB. Pertes : fibre 20 × 0,35 = 7 dB, connecteurs 2 × 0,5 = 1 dB, épissures 4 × 0,1 = 0,4 dB, soit 8,4 dB. Marge : 17 − 8,4 = 8,6 dB, de quoi absorber le vieillissement et de futures réparations.",
    pourquoiPas: {
      A: '17 dB est le budget brut : aucune perte n’a été déduite.',
      B: 'Ce résultat oublie les 1 dB de pertes des deux connecteurs.',
      C: 'Ce résultat ne retire que l’atténuation de la fibre, sans les connecteurs ni les épissures.',
    },
    aRetenir:
      'Marge optique = (puissance émise − sensibilité) − (fibre + connecteurs + épissures) ; gardez quelques dB pour le vieillissement et les réparations.',
  },

  // ───────────────────────────── Services réseau (DNS, DHCP, NAT) ─────────────────────────────
  {
    id: 'RES-SRV-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'facile',
    enonce: 'Dans quel ordre se déroulent les échanges d’un client qui obtient son adresse IPv4 par DHCP ?',
    options: [
      { id: 'A', texte: 'Request, Offer, Discover, Acknowledge' },
      { id: 'B', texte: 'Offer, Discover, Acknowledge, Request' },
      { id: 'C', texte: 'Discover, Offer, Request, Acknowledge' },
      { id: 'D', texte: 'Discover, Request, Offer, Acknowledge' },
    ],
    bonneReponse: 'C',
    explication:
      "Le client diffuse un DHCPDISCOVER, le ou les serveurs répondent par un DHCPOFFER, le client demande l'offre retenue par un DHCPREQUEST, et le serveur confirme le bail par un DHCPACK. On retient l'acronyme DORA.",
    pourquoiPas: {
      A: "Le client ne peut rien demander avant d'avoir découvert un serveur et reçu une offre.",
      B: "Un serveur ne fait pas d'offre spontanée : il répond à un Discover.",
      D: 'La demande (Request) porte sur une offre précise : elle vient forcément après l’Offer.',
    },
    aRetenir: 'DHCP = DORA : Discover (diffusion), Offer, Request, Acknowledge ; UDP 67 côté serveur, 68 côté client.',
  },
  {
    id: 'RES-SRV-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'facile',
    enonce:
      'Quel enregistrement DNS indique les serveurs de messagerie qui reçoivent le courrier du domaine banque-alpha.example ?',
    options: [
      { id: 'A', texte: 'CNAME' },
      { id: 'B', texte: 'PTR' },
      { id: 'C', texte: 'MX' },
      { id: 'D', texte: 'AAAA' },
    ],
    bonneReponse: 'C',
    explication:
      "L'enregistrement MX (Mail eXchanger) désigne, avec une priorité, les serveurs qui acceptent le courrier du domaine. Les serveurs d'envoi le consultent pour savoir où livrer un message adressé à @banque-alpha.example.",
    pourquoiPas: {
      A: 'CNAME déclare un alias vers un autre nom ; il ne désigne pas de serveur de messagerie.',
      B: 'PTR sert à la résolution inverse (adresse IP → nom).',
      D: 'AAAA associe un nom à une adresse IPv6.',
    },
    aRetenir: 'A/AAAA : nom → IPv4/IPv6 ; CNAME : alias ; MX : serveurs de messagerie ; PTR : IP → nom (résolution inverse).',
  },
  {
    id: 'RES-SRV-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'moyen',
    enonce:
      'Un poste neuf vient d’être branché au réseau d’une agence et ne joint rien. Voici sa configuration. Que s’est-il passé ?',
    extrait: {
      langage: 'texte',
      contenu: `Carte Ethernet Ethernet0 :
   DHCP activé. . . . . . . . . . . . . . . . . . : Oui
   Adresse IPv4 de configuration automatique. . . : 169.254.73.18(préféré)
   Masque de sous-réseau. . . . . . . . . . . . . : 255.255.0.0
   Passerelle par défaut. . . . . . . . . . . . . :`,
    },
    options: [
      { id: 'A', texte: 'Faute de réponse DHCP, il s’est attribué une adresse APIPA' },
      { id: 'B', texte: 'Le serveur DHCP lui a attribué par erreur une adresse publique hors de l’étendue' },
      { id: 'C', texte: 'Le serveur DNS a renvoyé une mauvaise adresse IP' },
      { id: 'D', texte: 'Le câble réseau est débranché' },
    ],
    bonneReponse: 'A',
    explication:
      "Faute de réponse DHCP, le système s'attribue une adresse dans 169.254.0.0/16 (liaison locale) : elle ne permet de joindre que des voisins dans le même cas. Pistes à vérifier : le service DHCP, une étendue épuisée, le VLAN du port de commutateur, le relais DHCP.",
    pourquoiPas: {
      B: '169.254.0.0/16 n’est jamais distribuée par un serveur DHCP : c’est la plage réservée à l’auto-configuration.',
      C: "Le DNS traduit des noms en adresses ; il n'attribue pas d'adresse au poste.",
      D: "Câble débranché, Windows afficherait « Média déconnecté » sans aucune adresse ; ici la carte est active.",
    },
    aRetenir:
      'Une adresse 169.254.x.x signifie « pas de réponse DHCP » : vérifiez le serveur, l’étendue, le VLAN du port et le relais DHCP.',
  },
  {
    id: 'RES-SRV-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'moyen',
    enonce:
      "Le serveur DHCP du siège (10.0.5.10) sert bien les postes de son propre VLAN, mais ceux du VLAN 30 (autre sous-réseau, même site) n'obtiennent aucune adresse. Que manque-t-il probablement sur la passerelle du VLAN 30 ?",
    options: [
      { id: 'A', texte: 'Une route statique vers 169.254.0.0/16' },
      { id: 'B', texte: 'Un serveur DNS secondaire' },
      { id: 'C', texte: 'Un relais DHCP (`ip helper-address 10.0.5.10`)' },
      { id: 'D', texte: 'L’activation du NAT entre le VLAN 30 et le serveur' },
    ],
    bonneReponse: 'C',
    explication:
      "Le DHCPDISCOVER est une diffusion : il ne franchit pas le routeur qui sépare le VLAN 30 du serveur. Le relais DHCP, configuré sur la passerelle du VLAN 30, capte ces diffusions et les retransmet en unicast au serveur, en indiquant le sous-réseau d'origine pour que le serveur choisisse la bonne étendue.",
    pourquoiPas: {
      A: '169.254.x.x est l’adresse que prennent les postes faute de DHCP ; une route vers cette plage ne règle rien.',
      B: "Le DNS n'intervient pas dans l'attribution des adresses.",
      D: 'Le NAT est inutile en interne et ne transforme pas une diffusion en requête routable.',
    },
    aRetenir:
      'Une diffusion DHCP ne franchit pas les routeurs : chaque VLAN sans serveur local a besoin d’un relais DHCP sur sa passerelle.',
  },
  {
    id: 'RES-SRV-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'moyen',
    enonce:
      "Le routeur d'une agence fait sortir tous les postes avec la seule adresse publique 203.0.113.10. Voici un extrait (simplifié) de sa table de traduction. Comment sait-il à quel poste renvoyer une réponse arrivant sur 203.0.113.10:1024 ?",
    extrait: {
      langage: 'texte',
      contenu: `Proto  Adresse interne       Adresse traduite      Destination
tcp    192.168.1.21:52344    203.0.113.10:52344    198.51.100.7:443
tcp    192.168.1.35:52344    203.0.113.10:1024     198.51.100.7:443
tcp    192.168.1.48:61002    203.0.113.10:61002    198.51.100.40:443`,
    },
    options: [
      { id: 'A', texte: 'Il diffuse la réponse à tous les postes du LAN, qui filtrent eux-mêmes' },
      { id: 'B', texte: 'Il consulte sa table ARP pour trouver le poste concerné' },
      { id: 'C', texte: 'Il l’envoie au premier poste qui a ouvert une connexion' },
      { id: 'D', texte: 'Par le port traduit, enregistré dans la table PAT' },
    ],
    bonneReponse: 'D',
    explication:
      "Le PAT (NAT avec surcharge) distingue chaque session par le couple adresse publique + port. Quand deux postes utilisent le même port source (52344), le routeur attribue un autre port public (1024) pour lever l'ambiguïté. Au retour, il retrouve l'entrée correspondante et réécrit la destination vers 192.168.1.35:52344.",
    pourquoiPas: {
      A: "Le routeur ne diffuse pas les réponses : la table de traduction désigne un poste précis.",
      B: "ARP n'intervient qu'ensuite, pour trouver la MAC de 192.168.1.35 ; il ne dit pas à quel poste appartient la session.",
      C: "Ce serait arbitraire : chaque réponse est associée à sa session par la table de traduction.",
    },
    aRetenir:
      'Le PAT partage une adresse publique entre de nombreux postes en distinguant chaque session par son port traduit.',
  },
  {
    id: 'RES-SRV-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'moyen',
    enonce:
      "Le portail interne a migré hier vers 192.0.2.80 et l'enregistrement A, dont le TTL était de 86 400 s, a été modifié sur le serveur faisant autorité. Le résolveur DNS de l'agence renvoie pourtant encore l'ancienne adresse. Quelle est l'explication la plus probable ?",
    extrait: {
      langage: 'shell',
      contenu: `$ dig +noall +answer portail.banque-alpha.example
portail.banque-alpha.example. 61230 IN A 192.0.2.40`,
    },
    options: [
      { id: 'A', texte: 'Le serveur faisant autorité est en panne' },
      { id: 'B', texte: 'Les postes doivent renouveler leur bail DHCP pour obtenir la nouvelle adresse du portail' },
      { id: 'C', texte: 'Il manque un enregistrement PTR pour la nouvelle adresse' },
      { id: 'D', texte: 'Le résolveur sert l’ancienne réponse depuis son cache, jusqu’à expiration du TTL' },
    ],
    bonneReponse: 'D',
    explication:
      "Un TTL de 61 230 s, inférieur aux 86 400 s configurés, montre une réponse servie depuis le cache du résolveur, qui décompte la durée restante (environ 17 h ici). Tant qu'elle n'est pas écoulée, il ne réinterroge pas le serveur faisant autorité. Bonne pratique : baisser le TTL (par exemple à 300 s) quelques jours avant une migration ; on peut aussi vider le cache du résolveur interne.",
    pourquoiPas: {
      A: 'Rien ne l’indique : le résolveur ne contacte tout simplement pas le serveur faisant autorité tant que le TTL court.',
      B: "Le bail DHCP fixe l'adresse du poste, pas celle d'un serveur distant résolue par le DNS.",
      C: 'Le PTR sert à la résolution inverse ; il n’intervient pas pour joindre le portail par son nom.',
    },
    aRetenir:
      'Avant une migration, baissez le TTL à l’avance : les caches DNS gardent l’ancienne réponse jusqu’à son expiration.',
  },
  {
    id: 'RES-SRV-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Services réseau (DNS, DHCP, NAT)',
    difficulte: 'difficile',
    enonce:
      "Sur la liaison WAN de 4 Mbit/s d'une agence, les appels VoIP deviennent hachés chaque soir pendant la réplication des sauvegardes. Quelle mesure traite le problème à la source ?",
    options: [
      { id: 'A', texte: 'Agrandir les files d’attente du routeur pour ne plus perdre aucun paquet' },
      { id: 'B', texte: 'Marquer les sauvegardes en priorité maximale (DSCP EF) pour qu’elles se terminent plus vite' },
      { id: 'C', texte: 'Placer la voix (DSCP EF) dans une file prioritaire en sortie WAN' },
      { id: 'D', texte: 'Activer le NAT sur la liaison WAN' },
    ],
    bonneReponse: 'C',
    explication:
      "La congestion se produit en sortie de la liaison WAN : les paquets de voix attendent derrière ceux des sauvegardes, d'où délai, gigue et pertes. La QoS classe la voix (marquage DSCP EF), la place dans une file prioritaire plafonnée (pour ne pas affamer le reste) et limite le débit des flux de masse. Elle doit s'appliquer aux deux extrémités, le sens descendant relevant du routeur d'en face ou de l'opérateur.",
    pourquoiPas: {
      A: 'Des files plus longues ajoutent du délai et de la gigue : c’est néfaste pour la voix.',
      B: "C'est l'inverse : la voix serait encore plus pénalisée, et EF est réservé aux flux temps réel.",
      D: "Le NAT traduit des adresses ; il n'a aucun effet sur la priorité des flux.",
    },
    aRetenir:
      'La QoS s’applique là où il y a congestion : voix marquée EF dans une file prioritaire bornée, flux de masse limités.',
  },

  // ───────────────────────────── Sécurité & supervision réseau ─────────────────────────────
  {
    id: 'RES-SEC-001',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'facile',
    enonce: 'Quelle version de SNMP apporte l’authentification des utilisateurs et le chiffrement des échanges ?',
    options: [
      { id: 'A', texte: 'SNMPv1' },
      { id: 'B', texte: 'SNMPv2c' },
      { id: 'C', texte: 'SNMPv3' },
      { id: 'D', texte: 'Aucune : SNMP ne chiffre jamais' },
    ],
    bonneReponse: 'C',
    explication:
      "SNMPv1 et SNMPv2c s'appuient sur une « communauté », sorte de mot de passe transmis en clair. SNMPv3 introduit un modèle par utilisateur avec authentification et chiffrement (niveau authPriv). C'est la version à exiger sur les équipements d'une banque.",
    pourquoiPas: {
      A: 'SNMPv1 transmet la communauté en clair, sans chiffrement.',
      B: 'SNMPv2c améliore les opérations et les compteurs, mais garde la communauté en clair.',
      D: 'SNMPv3 chiffre bien les échanges en mode authPriv.',
    },
    aRetenir:
      'Supervision en production : SNMPv3 en mode authPriv, et suppression des communautés par défaut « public » et « private ».',
  },
  {
    id: 'RES-SEC-002',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'facile',
    enonce:
      "Dans ces messages syslog d'un routeur (format de type Cisco %FACILITÉ-GRAVITÉ-MNÉMONIQUE), le chiffre indique la gravité. Quel message est le plus grave ?",
    extrait: {
      langage: 'log',
      contenu: `R-SIEGE %LINEPROTO-5-UPDOWN: Line protocol on Interface Gi0/2, changed state to up
R-SIEGE %LINK-3-UPDOWN: Interface Gi0/1, changed state to down
R-SIEGE %SYS-2-MALLOCFAIL: Memory allocation of 65536 bytes failed
R-SIEGE %SEC-6-IPACCESSLOGP: list FILTRE-AGENCE denied tcp 10.20.5.14(51522) -> 10.0.0.5(23), 1 packet`,
    },
    options: [
      { id: 'A', texte: '%LINEPROTO-5-UPDOWN' },
      { id: 'B', texte: '%LINK-3-UPDOWN' },
      { id: 'C', texte: '%SYS-2-MALLOCFAIL' },
      { id: 'D', texte: '%SEC-6-IPACCESSLOGP' },
    ],
    bonneReponse: 'C',
    explication:
      "Les niveaux syslog vont de 0 (Emergency, le plus grave) à 7 (Debug). Le niveau 2 (Critical) signale ici un échec d'allocation mémoire, qui peut annoncer un plantage du routeur : c'est le message à traiter en premier.",
    pourquoiPas: {
      A: 'Le niveau 5 (Notice) signale un événement normal mais notable, ici une interface qui remonte.',
      B: 'Le niveau 3 (Error) est sérieux, mais moins grave que le niveau 2.',
      D: 'Le niveau 6 (Informational) journalise un paquet refusé par une ACL : c’est le fonctionnement attendu du filtrage.',
    },
    aRetenir:
      'Syslog : 0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, 7 Debug — plus le chiffre est petit, plus c’est grave.',
  },
  {
    id: 'RES-SEC-003',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'moyen',
    enonce:
      'L’objectif de cette liste de contrôle d’accès est d’interdire Telnet (TCP 23) depuis les agences. Pourquoi des connexions Telnet passent-elles malgré la règle 30 ?',
    extrait: {
      langage: 'texte',
      contenu: `ip access-list extended FILTRE-AGENCE
 10 permit tcp 10.20.0.0 0.0.255.255 any eq 443
 20 permit ip  10.20.0.0 0.0.255.255 any
 30 deny   tcp 10.20.0.0 0.0.255.255 any eq 23
 40 deny   ip  any any`,
    },
    options: [
      { id: 'A', texte: 'Le masque générique 0.0.255.255 est inversé : il faudrait écrire 255.255.0.0' },
      { id: 'B', texte: 'La règle 20 autorise déjà tout le trafic IP : la première correspondance l’emporte' },
      { id: 'C', texte: 'Telnet utilise UDP 23, donc la règle 30 ne s’applique pas' },
      { id: 'D', texte: 'La règle 40 annule la règle 30' },
    ],
    bonneReponse: 'B',
    explication:
      "Une ACL est évaluée de haut en bas et s'arrête à la première règle qui correspond. Une connexion Telnet depuis 10.20.x.x correspond à la règle 20 (tout trafic IP) : elle est autorisée et la règle 30 n'est jamais atteinte. Il faut placer le refus de Telnet avant l'autorisation générale.",
    pourquoiPas: {
      A: 'Dans une ACL de ce type, le masque générique (wildcard) 0.0.255.255 correspond bien à un /16 : il est correct.',
      C: 'Telnet utilise TCP 23 : la règle 30 vise le bon protocole, mais elle arrive trop tard.',
      D: 'La règle 40 ne serait jamais atteinte par ce trafic, et elle le refuserait de toute façon.',
    },
    aRetenir:
      'Une ACL s’arrête à la première règle qui correspond : placez les interdictions précises avant les autorisations larges.',
  },
  {
    id: 'RES-SEC-004',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'moyen',
    enonce:
      "La liaison Internet du siège est saturée chaque après-midi. L'équipe veut savoir quelles machines échangent le plus de volume, avec qui et sur quels ports, sans capturer le contenu des paquets. Quel outil est le plus adapté ?",
    options: [
      { id: 'A', texte: 'Un ping continu vers la passerelle de l’opérateur' },
      { id: 'B', texte: 'L’export de flux NetFlow/IPFIX du routeur vers un collecteur' },
      { id: 'C', texte: 'Les compteurs SNMP de l’interface (octets entrants et sortants)' },
      { id: 'D', texte: 'Une capture complète des paquets pendant plusieurs jours' },
    ],
    bonneReponse: 'B',
    explication:
      "NetFlow/IPFIX résume chaque flux (adresses, ports, protocole, octets, durée) sans en garder le contenu. Le collecteur classe alors les plus gros émetteurs, destinations et applications sur la période de saturation. C'est aussi une source précieuse pour détecter des comportements anormaux (exfiltration, balayages).",
    pourquoiPas: {
      A: 'Un ping mesure la joignabilité et la latence, pas qui consomme la bande passante.',
      C: "SNMP donne le volume total de l'interface, sans détail par machine ni par application.",
      D: 'Une capture complète sur plusieurs jours est très lourde à stocker et expose le contenu des échanges : disproportionné pour ce besoin.',
    },
    aRetenir:
      'SNMP dit combien passe sur une interface ; NetFlow/IPFIX dit qui parle à qui, sur quel port et pour quel volume.',
  },
  {
    id: 'RES-SEC-005',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'moyen',
    enonce:
      "Un tunnel VPN IPsec site à site doit relier le routeur d'une agence, placé derrière un équipement NAT de l'opérateur, au pare-feu du siège. Quels flux faut-il autoriser vers le pare-feu du siège ?",
    options: [
      { id: 'A', texte: 'UDP 500 (IKE) et UDP 4500 (NAT-T, qui encapsule ESP dans UDP)' },
      { id: 'B', texte: 'TCP 443 uniquement, car IPsec fonctionne au-dessus de HTTPS' },
      { id: 'C', texte: 'TCP 22, car IKE s’appuie sur SSH' },
      { id: 'D', texte: 'UDP 53, car le tunnel IPsec est négocié par le DNS' },
    ],
    bonneReponse: 'A',
    explication:
      "IKE négocie les clés sur UDP 500. Le trafic chiffré utilise ESP (protocole IP 50), qui n'a pas de ports : un NAT avec traduction de ports ne sait pas le traiter. Quand un NAT est détecté, IKE et ESP basculent donc sur UDP 4500 (NAT traversal). Sans NAT, on autoriserait UDP 500 et le protocole IP 50.",
    pourquoiPas: {
      B: 'Ce sont les VPN SSL/TLS qui utilisent TCP 443 ; IPsec repose sur IKE et ESP.',
      C: 'IKE est un protocole autonome, sans aucun lien avec SSH.',
      D: 'Le DNS peut servir à résoudre le nom du pair, mais il ne transporte pas la négociation du tunnel.',
    },
    aRetenir: 'IPsec : IKE sur UDP 500, ESP (protocole IP 50) ou, derrière un NAT, tout encapsulé dans UDP 4500.',
  },
  {
    id: 'RES-SEC-006',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'moyen',
    enonce:
      'Le pare-feu stateful du siège autorise les postes internes à ouvrir des connexions HTTPS vers Internet. Faut-il ajouter une règle pour laisser revenir les réponses des serveurs web ?',
    options: [
      { id: 'A', texte: 'Non : la table d’états admet automatiquement le trafic retour' },
      { id: 'B', texte: 'Oui : il faut autoriser tout le trafic entrant dont le port source est 443' },
      { id: 'C', texte: 'Oui, mais seulement pour le protocole UDP' },
      { id: 'D', texte: 'Non, car un pare-feu ne filtre que le trafic sortant' },
    ],
    bonneReponse: 'A',
    explication:
      "Un pare-feu à états mémorise les sessions autorisées (adresses, ports, état TCP). Les paquets de retour qui appartiennent à une session connue sont acceptés sans règle supplémentaire, tandis que les connexions entrantes non sollicitées restent bloquées. Les règles ne s'écrivent que dans le sens d'initiation.",
    pourquoiPas: {
      B: "C'est la logique d'un filtre sans état, et une faille : n'importe qui pourrait entrer en choisissant le port source 443.",
      C: 'HTTPS classique repose sur TCP, et le suivi d’état s’applique quel que soit le protocole suivi.',
      D: 'Un pare-feu filtre dans les deux sens ; l’entrant non sollicité est justement bloqué par défaut.',
    },
    aRetenir:
      'Un pare-feu stateful n’exige des règles que dans le sens d’initiation : les réponses des sessions établies sont admises par la table d’états.',
  },
  {
    id: 'RES-SEC-007',
    section: 'technique',
    filiere: 'reseaux',
    competence: 'Sécurité & supervision réseau',
    difficulte: 'difficile',
    enonce:
      "L'outil de supervision relève toutes les 60 s le compteur SNMP `ifInOctets` (Counter32) d'une interface à 10 Gbit/s très chargée. Les courbes de trafic obtenues sont incohérentes. Quelle est la cause et la correction ?",
    extrait: {
      langage: 'texte',
      contenu: `Interface Te1/0/1 (10 Gbit/s) - IF-MIB::ifInOctets (Counter32)
10:00:00   4 021 553 112
10:01:00   1 298 004 410
10:02:00   3 870 112 905`,
    },
    options: [
      { id: 'A', texte: 'L’interface perd des paquets : il faut remplacer le module optique' },
      { id: 'B', texte: 'Un relevé toutes les 60 s est trop fréquent : il faut passer à 5 minutes' },
      { id: 'C', texte: 'SNMP ne sait pas superviser des interfaces de plus de 1 Gbit/s' },
      { id: 'D', texte: 'Le Counter32 reboucle en moins de 4 s : il faut lire `ifHCInOctets` (64 bits)' },
    ],
    bonneReponse: 'D',
    explication:
      "Un Counter32 plafonne à 2³² octets (environ 4,3 Go) puis repart de zéro. À 10 Gbit/s (1,25 Go/s), il reboucle en 2³² × 8 ÷ 10¹⁰ ≈ 3,4 s : en 60 s, il fait de nombreux tours et l'écart entre deux relevés ne veut plus rien dire. Les compteurs 64 bits `ifHCInOctets`/`ifHCOutOctets` (SNMPv2c ou v3) règlent le problème.",
    pourquoiPas: {
      A: "Des valeurs qui « reculent » trahissent un compteur qui reboucle, pas des pertes de paquets.",
      B: "C'est l'inverse : un intervalle plus long multiplierait encore les rebouclages entre deux relevés.",
      C: 'SNMP supervise très bien ces interfaces, à condition d’utiliser les compteurs 64 bits.',
    },
    aRetenir:
      'Sur les interfaces rapides, lisez les compteurs 64 bits (`ifHCInOctets`) : un Counter32 reboucle en 34 s à 1 Gbit/s et en 3,4 s à 10 Gbit/s.',
  },
];
