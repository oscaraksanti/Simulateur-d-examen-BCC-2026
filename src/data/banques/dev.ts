// Banque technique — filière Développement logiciel (préfixe DEV), 60 questions.
// Contextes fictifs (Banque Alpha, Banque Beta, domaines .example) ; sorties de code vérifiées par exécution.
import type { QcmQuestion } from '@/lib/types';

export const banqueTechniqueDev: QcmQuestion[] = [
  // ───────────── Algorithmique & complexité ─────────────
  {
    id: 'DEV-ALG-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'facile',
    enonce:
      'Le moteur de recherche interne de la Banque Alpha cherche un numéro de compte dans un tableau de n numéros DÉJÀ TRIÉ, par recherche dichotomique. Quelle est la complexité temporelle dans le pire cas ?',
    options: [
      { id: 'A', texte: 'O(log n)' },
      { id: 'B', texte: 'O(1)' },
      { id: 'C', texte: 'O(n log n)' },
      { id: 'D', texte: 'O(n)' },
    ],
    bonneReponse: 'A',
    explication:
      "La dichotomie compare la valeur cherchée à l'élément du milieu, puis élimine la moitié du tableau à chaque étape. Le nombre d'étapes est donc le nombre de fois où l'on peut diviser n par 2, soit environ log₂(n). Sur un million de comptes, cela fait au plus 20 comparaisons.",
    pourquoiPas: {
      B: 'O(1) supposerait un accès direct par la clé, comme dans une table de hachage, pas une recherche par comparaisons.',
      C: "O(n log n) est le coût d'un bon tri, pas celui d'une recherche dans un tableau déjà trié.",
      D: "O(n) correspond à un parcours séquentiel élément par élément, qui n'exploite pas le fait que le tableau est trié.",
    },
    aRetenir: "Diviser l'espace de recherche par deux à chaque étape donne une complexité en O(log n), à condition que les données soient triées.",
  },
  {
    id: 'DEV-ALG-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'facile',
    enonce:
      "Qu'affiche ce programme Python ?",
    extrait: {
      langage: 'python',
      contenu: `compteur = 0
for i in range(4):
    for j in range(i, 4):
        compteur += 1
print(compteur)`,
    },
    options: [
      { id: 'A', texte: '6' },
      { id: 'B', texte: '4' },
      { id: 'C', texte: '10' },
      { id: 'D', texte: '16' },
    ],
    bonneReponse: 'C',
    explication:
      'Pour i = 0, la boucle interne tourne 4 fois (j = 0 à 3), puis 3 fois pour i = 1, 2 fois pour i = 2 et 1 fois pour i = 3. Le total vaut 4 + 3 + 2 + 1 = 10. Ce motif « triangulaire » reste en O(n²) : n(n+1)/2 itérations.',
    pourquoiPas: {
      A: '6 correspond aux paires avec `j > i` strictement ; or `range(i, 4)` inclut la valeur `i` elle-même.',
      B: "4 ne compte qu'une itération par tour de boucle externe, alors que la boucle interne en fait plusieurs.",
      D: '16 = 4 × 4 serait le résultat si la boucle interne commençait toujours à 0 ; ici elle démarre à `i`.',
    },
    aRetenir: "Deux boucles imbriquées dont l'intérieure démarre à `i` font n(n+1)/2 itérations : c'est toujours du O(n²).",
  },
  {
    id: 'DEV-ALG-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'moyen',
    enonce:
      "Qu'affiche ce programme Python récursif ?",
    extrait: {
      langage: 'python',
      contenu: `def f(n):
    if n <= 1:
        return n
    return f(n - 1) + f(n - 2)

print(f(7))`,
    },
    options: [
      { id: 'A', texte: '7' },
      { id: 'B', texte: '13' },
      { id: 'C', texte: '8' },
      { id: 'D', texte: '21' },
    ],
    bonneReponse: 'B',
    explication:
      'Cette fonction calcule la suite de Fibonacci : f(0) = 0, f(1) = 1, puis chaque terme est la somme des deux précédents. On obtient 0, 1, 1, 2, 3, 5, 8, 13 : f(7) vaut 13. Le cas de base `n <= 1` arrête la récursion.',
    pourquoiPas: {
      A: 'La fonction ne renvoie `n` que pour le cas de base n ≤ 1 ; au-delà, elle additionne les deux appels précédents.',
      C: '8 est la valeur de f(6) : il manque un rang dans le calcul.',
      D: '21 est la valeur de f(8) : la suite a été poussée un rang trop loin.',
    },
    aRetenir: "Une fonction récursive a besoin d'un cas de base qui arrête les appels, puis d'une relation qui ramène le problème à des cas plus petits.",
  },
  {
    id: 'DEV-ALG-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'moyen',
    enonce:
      "Un fichier de 1 000 000 de transactions est trié par identifiant. Avec une recherche dichotomique, combien de comparaisons faut-il AU MAXIMUM pour trouver une transaction (ou conclure qu'elle est absente) ?",
    options: [
      { id: 'A', texte: '100' },
      { id: 'B', texte: '1 000' },
      { id: 'C', texte: '500 000' },
      { id: 'D', texte: '20' },
    ],
    bonneReponse: 'D',
    explication:
      "La dichotomie divise l'intervalle par deux à chaque comparaison. Comme 2²⁰ = 1 048 576 dépasse 1 000 000, 20 comparaisons suffisent toujours. C'est l'intérêt d'un algorithme en O(log n) : multiplier les données par mille n'ajoute qu'une dizaine de comparaisons.",
    pourquoiPas: {
      A: "100 comparaisons dépassent largement le besoin : 2 puissance 20 couvre déjà plus d'un million d'éléments.",
      B: "1 000 est la racine carrée d'un million ; aucune recherche classique n'a cette complexité.",
      C: "500 000 est le nombre moyen de comparaisons d'une recherche séquentielle, pas d'une dichotomie.",
    },
    aRetenir: "log₂(1 000) ≈ 10 et log₂(1 000 000) ≈ 20 : la dichotomie reste très rapide même sur d'énormes volumes.",
  },
  {
    id: 'DEV-ALG-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'moyen',
    enonce:
      "Pour trier chaque nuit des millions d'opérations, l'équipe veut un algorithme dont la complexité reste en O(n log n) MÊME DANS LE PIRE CAS. Lequel choisir ?",
    options: [
      { id: 'A', texte: 'Le tri par insertion' },
      { id: 'B', texte: 'Le tri fusion (merge sort)' },
      { id: 'C', texte: 'Le tri à bulles' },
      { id: 'D', texte: 'Le tri rapide (quicksort) dans sa version classique' },
    ],
    bonneReponse: 'B',
    explication:
      "Le tri fusion découpe la liste en deux moitiés, les trie récursivement, puis les fusionne en temps linéaire : sa complexité est O(n log n) dans tous les cas. Il est aussi stable (l'ordre des éléments égaux est préservé), ce qui compte quand on trie des opérations sur plusieurs critères successifs. Son coût est une mémoire supplémentaire en O(n).",
    pourquoiPas: {
      A: "Le tri par insertion est en O(n²) dans le pire cas ; il n'est efficace que sur de petites listes presque triées.",
      C: "Le tri à bulles est en O(n²) : il est pédagogique mais inadapté à des millions d'éléments.",
      D: 'Le tri rapide est en O(n log n) en moyenne, mais tombe en O(n²) dans le pire cas, par exemple avec un mauvais choix de pivot.',
    },
    aRetenir: 'Tri fusion : O(n log n) garanti et stable ; tri rapide : O(n log n) en moyenne mais O(n²) au pire.',
  },
  {
    id: 'DEV-ALG-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'difficile',
    enonce:
      'Une fonction calcule fib(n) par la récursion naïve `fib(n) = fib(n-1) + fib(n-2)`, sans mémoriser les résultats. Pour n = 50, le programme semble ne jamais se terminer. Quelle analyse est correcte ?',
    options: [
      { id: 'A', texte: "La complexité est O(n), mais la pile d'appels déborde ; il suffit d'augmenter la taille de la pile." },
      { id: 'B', texte: "La complexité est O(n²) ; la mémorisation des résultats n'y changerait rien." },
      { id: 'C', texte: 'La complexité est exponentielle ; mémoriser les résultats déjà calculés la ramène à O(n).' },
      { id: 'D', texte: 'La complexité est O(log n), car le problème est divisé par deux à chaque appel.' },
    ],
    bonneReponse: 'C',
    explication:
      "Chaque appel en déclenche deux autres, et les mêmes valeurs (fib(48), fib(47)…) sont recalculées un très grand nombre de fois : le nombre d'appels croît exponentiellement avec n. En stockant chaque résultat dans un dictionnaire (mémoïsation) ou en calculant de façon itérative de bas en haut, chaque valeur n'est calculée qu'une fois : O(n).",
    pourquoiPas: {
      A: "La profondeur de récursion n'est que de 50 ; le problème est le nombre total d'appels, qui explose.",
      B: "Les mêmes sous-problèmes sont recalculés un nombre exponentiel de fois, et c'est précisément ce que la mémorisation supprime.",
      D: "Chaque appel ne réduit n que de 1 ou de 2 et en génère deux autres : rien n'est divisé par deux.",
    },
    aRetenir: 'Une récursion qui recalcule les mêmes sous-problèmes devient exponentielle ; la mémoïsation (programmation dynamique) la rend linéaire.',
  },
  {
    id: 'DEV-ALG-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'moyen',
    enonce:
      'Cette fonction Python vérifie si une liste de n numéros de comptes contient un doublon. Quelle est sa complexité temporelle dans le pire cas ?',
    extrait: {
      langage: 'python',
      contenu: `def contient_doublon(comptes):
    for i in range(len(comptes)):
        for j in range(i + 1, len(comptes)):
            if comptes[i] == comptes[j]:
                return True
    return False`,
    },
    options: [
      { id: 'A', texte: 'O(2ⁿ)' },
      { id: 'B', texte: 'O(n)' },
      { id: 'C', texte: 'O(n log n)' },
      { id: 'D', texte: 'O(n²)' },
    ],
    bonneReponse: 'D',
    explication:
      "Dans le pire cas (aucun doublon), la fonction compare chaque paire d'éléments une fois, soit n(n−1)/2 comparaisons : c'est du O(n²). Avec 100 000 comptes, cela représente environ 5 milliards de comparaisons. Un `set` permet de faire la même vérification en O(n) en moyenne.",
    pourquoiPas: {
      A: "Rien n'est exponentiel ici : on compare chaque paire au plus une fois, soit n(n−1)/2 comparaisons.",
      B: 'O(n) serait atteint avec un ensemble (`set`) qui mémorise les numéros déjà vus, pas avec deux boucles imbriquées.',
      C: 'O(n log n) correspond à une approche par tri préalable puis comparaison des voisins, pas à ce code.',
    },
    aRetenir: 'Comparer toutes les paires coûte O(n²) ; mémoriser les éléments vus dans un ensemble ramène la détection de doublons à O(n).',
  },
  {
    id: 'DEV-ALG-008',
    section: 'technique',
    filiere: 'dev',
    competence: 'Algorithmique & complexité',
    difficulte: 'difficile',
    enonce:
      "Un développeur trie des montants en JavaScript avec ce code. Qu'affiche la console ?",
    extrait: {
      langage: 'texte',
      contenu: `// JavaScript
const montants = [1500, 200, 30000, 45];
montants.sort();
console.log(montants);`,
    },
    options: [
      { id: 'A', texte: "Une erreur TypeError, car sort() n'accepte que des chaînes" },
      { id: 'B', texte: '[ 1500, 200, 30000, 45 ]' },
      { id: 'C', texte: '[ 45, 200, 1500, 30000 ]' },
      { id: 'D', texte: '[ 30000, 1500, 200, 45 ]' },
    ],
    bonneReponse: 'B',
    explication:
      "Sans comparateur, `Array.prototype.sort()` convertit les éléments en chaînes et les compare dans l'ordre lexicographique : « 1500 » < « 200 » < « 30000 » < « 45 », car on compare d'abord le premier caractère. Ici, cet ordre coïncide avec l'ordre d'origine, donc le tableau semble inchangé. Pour trier des nombres, il faut écrire `montants.sort((a, b) => a - b)`.",
    pourquoiPas: {
      A: '`sort()` accepte tout type de tableau : il convertit simplement les éléments en chaînes pour les comparer.',
      C: "Ce serait le résultat d'un tri numérique, obtenu seulement avec un comparateur comme `(a, b) => a - b`.",
      D: '`sort()` ne trie jamais par ordre décroissant par défaut, ni numériquement.',
    },
    aRetenir: 'En JavaScript, `sort()` sans comparateur trie comme du texte : passez toujours `(a, b) => a - b` pour des nombres.',
  },
  // ───────────── Structures de données ─────────────
  {
    id: 'DEV-SDD-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'facile',
    enonce:
      "Dans l'éditeur de modèles de courriers de la Banque Beta, la fonction « Annuler » doit défaire d'abord la DERNIÈRE modification effectuée. Quelle structure de données convient le mieux pour mémoriser l'historique ?",
    options: [
      { id: 'A', texte: 'Un arbre binaire de recherche' },
      { id: 'B', texte: 'Une pile (LIFO)' },
      { id: 'C', texte: 'Une table de hachage' },
      { id: 'D', texte: 'Une file (FIFO)' },
    ],
    bonneReponse: 'B',
    explication:
      "Une pile suit le principe « dernier entré, premier sorti » (LIFO) : chaque modification est empilée, et « Annuler » dépile la plus récente. Les deux opérations se font en O(1). C'est aussi la structure utilisée par la pile d'appels des fonctions.",
    pourquoiPas: {
      A: "Un arbre de recherche trie les éléments par clé ; il n'apporte rien pour retrouver simplement le dernier ajouté.",
      C: 'Une table de hachage associe des clés à des valeurs mais ne conserve aucun ordre chronologique.',
      D: "Une file restituerait d'abord la plus ancienne modification, l'inverse de ce qu'attend l'utilisateur.",
    },
    aRetenir: "Dernier entré, premier sorti : pile (annuler, pile d'appels) ; premier entré, premier sorti : file.",
  },
  {
    id: 'DEV-SDD-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'facile',
    enonce:
      "Un service reçoit des ordres de virement qui doivent être traités STRICTEMENT DANS LEUR ORDRE D'ARRIVÉE. Quelle structure de données utiliser pour les mettre en attente ?",
    options: [
      { id: 'A', texte: 'Un tas (file de priorité)' },
      { id: 'B', texte: 'Un ensemble (set)' },
      { id: 'C', texte: 'Une file (FIFO)' },
      { id: 'D', texte: 'Une pile (LIFO)' },
    ],
    bonneReponse: 'C',
    explication:
      "Une file applique le principe « premier entré, premier sorti » (FIFO) : on ajoute en queue et on retire en tête. C'est le modèle des files de messages (RabbitMQ, Kafka par partition…) utilisées pour lisser la charge entre services. En Python, `collections.deque` offre ces opérations en O(1).",
    pourquoiPas: {
      A: "Un tas sert les éléments par priorité, pas par ordre chronologique d'arrivée.",
      B: 'Un ensemble ne garantit aucun ordre et élimine les doublons, ce qui pourrait perdre des ordres identiques.',
      D: "Une pile traiterait d'abord le dernier ordre reçu, ce qui violerait l'ordre d'arrivée.",
    },
    aRetenir: "Traitement dans l'ordre d'arrivée = file FIFO ; traitement par urgence = file de priorité (tas).",
  },
  {
    id: 'DEV-SDD-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'facile',
    enonce:
      'Une application doit retrouver très souvent un client à partir de son numéro de compte, parmi plusieurs millions. Quelle structure en mémoire offre une recherche en temps MOYEN CONSTANT ?',
    options: [
      { id: 'A', texte: 'Une liste non triée, parcourue du début à la fin à chaque recherche' },
      { id: 'B', texte: 'Une table de hachage indexée par numéro de compte' },
      { id: 'C', texte: 'Une liste chaînée' },
      { id: 'D', texte: 'Une liste triée avec recherche dichotomique' },
    ],
    bonneReponse: 'B',
    explication:
      "Une table de hachage calcule, à partir de la clé, l'emplacement où la valeur est rangée : la recherche, l'insertion et la suppression sont en O(1) en moyenne. C'est le `dict` de Python, la `Map` de JavaScript ou la `HashMap` de Java. Le pire cas (nombreuses collisions) reste rare avec une bonne fonction de hachage.",
    pourquoiPas: {
      A: "Parcourir une liste non triée coûte O(n) par recherche, beaucoup trop lent sur des millions d'éléments.",
      C: 'Une liste chaînée impose un parcours séquentiel : la recherche y est en O(n).',
      D: 'La dichotomie est efficace, mais en O(log n), pas en temps constant ; et chaque insertion coûte O(n).',
    },
    aRetenir: 'Recherche fréquente par clé exacte : table de hachage, O(1) en moyenne.',
  },
  {
    id: 'DEV-SDD-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'moyen',
    enonce:
      "Qu'affiche ce programme Python ?",
    extrait: {
      langage: 'python',
      contenu: `pile = []
pile.append(3)
pile.append(7)
pile.append(5)
pile.pop()
pile.append(9)
print(pile.pop(), pile)`,
    },
    options: [
      { id: 'A', texte: '9 [3, 7]' },
      { id: 'B', texte: '5 [3, 7, 9]' },
      { id: 'C', texte: '9 [3, 7, 5]' },
      { id: 'D', texte: '3 [7, 9]' },
    ],
    bonneReponse: 'A',
    explication:
      'La liste sert de pile : `append` empile au sommet et `pop()` dépile le dernier élément. Après les trois ajouts, la pile vaut [3, 7, 5] ; le premier `pop()` retire 5, puis on empile 9 : [3, 7, 9]. Le dernier `pop()` renvoie 9 et laisse [3, 7].',
    pourquoiPas: {
      B: 'Le 5 a déjà été retiré par le premier `pop()` ; le second `pop()` retire le 9 ajouté juste après.',
      C: "Le 5 a bien été retiré par le premier `pop()`, même si sa valeur n'a pas été affichée.",
      D: "`pop()` sans argument retire le dernier élément d'une liste Python, pas le premier.",
    },
    aRetenir: 'En Python, `list.append` et `list.pop()` forment une pile efficace (O(1)) ; pour une file, préférez `collections.deque`.',
  },
  {
    id: 'DEV-SDD-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'moyen',
    enonce:
      'On compare un tableau dynamique (liste Python, ArrayList Java) et une liste chaînée simple, contenant chacun n éléments. Quelle affirmation est exacte ?',
    options: [
      { id: 'A', texte: "L'insertion en tête est en O(1) dans le tableau mais en O(n) dans la liste chaînée." },
      { id: 'B', texte: "L'accès au k-ième élément est en O(1) dans le tableau mais en O(n) dans la liste chaînée." },
      { id: 'C', texte: 'Les deux structures offrent un accès par indice en O(1).' },
      { id: 'D', texte: 'La liste chaînée consomme moins de mémoire, car elle ne stocke que les valeurs.' },
    ],
    bonneReponse: 'B',
    explication:
      "Un tableau range ses éléments de façon contiguë : l'adresse du k-ième se calcule directement, d'où un accès en O(1). Une liste chaînée relie des maillons dispersés en mémoire : pour atteindre le k-ième, il faut les parcourir un à un, en O(n). En revanche, l'insertion ou la suppression en tête d'une liste chaînée est en O(1).",
    pourquoiPas: {
      A: "C'est l'inverse : insérer en tête d'un tableau oblige à décaler tous les éléments, alors que la liste chaînée n'a qu'un pointeur à modifier.",
      C: 'Une liste chaînée doit suivre les liens maillon par maillon depuis la tête pour atteindre un indice donné.',
      D: 'Chaque maillon stocke, en plus de la valeur, au moins un pointeur vers le suivant : la liste chaînée consomme davantage de mémoire.',
    },
    aRetenir: "Tableau : accès par indice rapide, insertion au début coûteuse ; liste chaînée : l'inverse.",
  },
  {
    id: 'DEV-SDD-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'moyen',
    enonce:
      'La cellule anti-fraude veut repérer des circuits de virements du type compte A → B → C → A. Quelle modélisation et quel algorithme sont les plus adaptés ?',
    options: [
      { id: 'A', texte: 'Un graphe orienté (comptes et virements) parcouru en profondeur' },
      { id: 'B', texte: 'Une file de priorité ordonnée par date de virement' },
      { id: 'C', texte: 'Un tableau trié par numéro de compte et une recherche dichotomique' },
      { id: 'D', texte: "Un arbre binaire de recherche trié par montant, parcouru dans l'ordre" },
    ],
    bonneReponse: 'A',
    explication:
      "Les relations « tel compte a viré à tel autre » forment naturellement un graphe orienté. Un parcours en profondeur (DFS) qui marque les sommets en cours d'exploration détecte un cycle dès qu'il retombe sur l'un d'eux. Ce type d'analyse de graphes est couramment utilisé dans la lutte contre le blanchiment.",
    pourquoiPas: {
      B: 'Une file de priorité ordonne des événements mais ne représente pas les relations entre comptes.',
      C: "Un tableau trié permet de retrouver un compte, pas de suivre l'enchaînement des virements entre comptes.",
      D: 'Un arbre ne contient par définition aucun cycle : il ne peut pas représenter des circuits de virements.',
    },
    aRetenir: 'Des relations entre entités (qui paie qui, qui est connecté à qui) se modélisent par un graphe ; un DFS détecte les cycles.',
  },
  {
    id: 'DEV-SDD-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'moyen',
    enonce:
      "On insère successivement les clés 50, 30, 70, 20, 40, 60, 80 dans un arbre binaire de recherche initialement vide (plus petit à gauche, plus grand à droite). Quel est le résultat d'un parcours PRÉFIXE (racine, puis sous-arbre gauche, puis sous-arbre droit) ?",
    options: [
      { id: 'A', texte: '50, 30, 20, 40, 70, 60, 80' },
      { id: 'B', texte: '20, 30, 40, 50, 60, 70, 80' },
      { id: 'C', texte: '50, 30, 70, 20, 40, 60, 80' },
      { id: 'D', texte: '20, 40, 30, 60, 80, 70, 50' },
    ],
    bonneReponse: 'A',
    explication:
      "50 est la racine ; 30 et 70 sont ses fils gauche et droit ; 20 et 40 sont sous 30, 60 et 80 sous 70. Le parcours préfixe visite la racine (50), puis tout le sous-arbre gauche en préfixe (30, 20, 40), puis le sous-arbre droit (70, 60, 80). Le parcours infixe d'un arbre binaire de recherche donne toujours les clés triées.",
    pourquoiPas: {
      B: "C'est le parcours infixe (gauche, racine, droite), qui restitue les clés triées.",
      C: "C'est le parcours en largeur, niveau par niveau, et non le parcours préfixe.",
      D: "C'est le parcours postfixe (gauche, droite, racine), où la racine apparaît en dernier.",
    },
    aRetenir: 'Préfixe : racine-gauche-droite ; infixe : gauche-racine-droite (clés triées) ; postfixe : gauche-droite-racine.',
  },
  {
    id: 'DEV-SDD-008',
    section: 'technique',
    filiere: 'dev',
    competence: 'Structures de données',
    difficulte: 'difficile',
    enonce:
      "Un développeur initialise une grille de 2 lignes et 3 colonnes en Python. Qu'affiche ce code ?",
    extrait: {
      langage: 'python',
      contenu: `grille = [[0] * 3] * 2
grille[0][0] = 5
print(grille)`,
    },
    options: [
      { id: 'A', texte: 'Une erreur IndexError' },
      { id: 'B', texte: '[[5, 0, 0], [0, 0, 0]]' },
      { id: 'C', texte: '[[5, 5, 5], [0, 0, 0]]' },
      { id: 'D', texte: '[[5, 0, 0], [5, 0, 0]]' },
    ],
    bonneReponse: 'D',
    explication:
      '`[ligne] * 2` ne copie pas la liste intérieure : il crée une liste contenant deux références vers le MÊME objet. Modifier `grille[0][0]` modifie donc aussi `grille[1][0]`, puisque les deux « lignes » sont une seule et même liste. La bonne écriture est une compréhension de liste : `[[0] * 3 for _ in range(2)]`.',
    pourquoiPas: {
      A: "Les indices 0 et 0 sont valides dans une grille 2 × 3 : aucune erreur n'est levée.",
      B: 'Ce serait le cas avec `[[0] * 3 for _ in range(2)]`, qui crée deux listes distinctes.',
      C: "Seule la case d'indice 0 est modifiée ; les entiers d'une même ligne sont indépendants.",
    },
    aRetenir: 'Multiplier une liste de listes duplique les références, pas les objets : utilisez une compréhension de liste pour créer des lignes indépendantes.',
  },
  // ───────────── Programmation orientée objet ─────────────
  {
    id: 'DEV-POO-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'facile',
    enonce:
      "Dans la classe `Compte`, l'attribut `solde` est rendu privé : on ne peut le modifier qu'au travers des méthodes `deposer()` et `retirer()`, qui refusent les montants négatifs et les découverts non autorisés. Quel principe de la programmation orientée objet est appliqué ?",
    options: [
      { id: 'A', texte: "L'héritage" },
      { id: 'B', texte: 'Le polymorphisme' },
      { id: 'C', texte: "L'encapsulation" },
      { id: 'D', texte: 'La surcharge de méthodes' },
    ],
    bonneReponse: 'C',
    explication:
      "L'encapsulation cache l'état interne d'un objet et n'autorise sa modification que par des méthodes qui garantissent ses règles (ses invariants). Ici, aucun code extérieur ne peut écrire directement un solde incohérent. C'est aussi le seul endroit à modifier si la règle de découvert évolue.",
    pourquoiPas: {
      A: "L'héritage consiste à dériver une classe d'une autre pour réutiliser son comportement ; il n'est pas question ici de classe dérivée.",
      B: "Le polymorphisme permet d'appeler une même méthode sur des objets de types différents ; il ne protège pas l'état interne.",
      D: 'La surcharge consiste à définir plusieurs méthodes de même nom avec des paramètres différents, sans lien avec la protection du solde.',
    },
    aRetenir: "Encapsuler, c'est protéger l'état d'un objet derrière des méthodes qui font respecter ses règles métier.",
  },
  {
    id: 'DEV-POO-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'facile',
    enonce:
      "Qu'affiche ce programme Java ?",
    extrait: {
      langage: 'texte',
      contenu: `// Java
interface MoyenPaiement {
    String payer(int montant);
}
class Carte implements MoyenPaiement {
    public String payer(int montant) { return "Carte:" + montant; }
}
class MobileMoney implements MoyenPaiement {
    public String payer(int montant) { return "Mobile:" + (montant + 100); }
}

// Dans main :
MoyenPaiement[] moyens = { new Carte(), new MobileMoney() };
for (MoyenPaiement m : moyens) {
    System.out.print(m.payer(500) + " ");
}`,
    },
    options: [
      { id: 'A', texte: 'Carte:500 Mobile:600' },
      { id: 'B', texte: 'Carte:500 Mobile:500' },
      { id: 'C', texte: "Une erreur de compilation, car on ne peut pas créer un tableau d'interface" },
      { id: 'D', texte: 'Carte:500 Mobile:500100' },
    ],
    bonneReponse: 'A',
    explication:
      "La variable `m` est déclarée avec le type de l'interface, mais à l'exécution Java appelle la méthode de la classe réelle de chaque objet : c'est le polymorphisme (liaison dynamique). Pour `MobileMoney`, `(montant + 100)` est calculé en premier, donc on obtient 600. Le code appelant n'a pas besoin de connaître les classes concrètes.",
    pourquoiPas: {
      B: "La méthode de `MobileMoney` ajoute 100 au montant : c'est bien sa propre implémentation qui est exécutée.",
      C: "Un tableau dont le type est une interface est parfaitement valide ; il contient ici des objets de classes qui l'implémentent.",
      D: "Les parenthèses autour de `montant + 100` forcent l'addition numérique avant la concaténation avec la chaîne.",
    },
    aRetenir: "Polymorphisme : un même appel sur une référence de type interface exécute l'implémentation de la classe réelle de l'objet.",
  },
  {
    id: 'DEV-POO-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'moyen',
    enonce:
      "Qu'affiche ce programme Python ?",
    extrait: {
      langage: 'python',
      contenu: `class Compte:
    def frais(self):
        return 1000

    def resume(self):
        return f"{type(self).__name__}: {self.frais()}"

class CompteEpargne(Compte):
    def frais(self):
        return super().frais() // 2

print(CompteEpargne().resume())`,
    },
    options: [
      { id: 'A', texte: 'CompteEpargne: 1000' },
      { id: 'B', texte: 'Compte: 1000' },
      { id: 'C', texte: 'Compte: 500' },
      { id: 'D', texte: 'CompteEpargne: 500' },
    ],
    bonneReponse: 'D',
    explication:
      "`resume()` est héritée de `Compte`, mais `self` reste l'objet `CompteEpargne` : `type(self).__name__` vaut donc « CompteEpargne ». L'appel `self.frais()` est résolu sur la classe réelle et exécute la version redéfinie, qui utilise `super().frais()` (1000) puis la divise par deux. Résultat : « CompteEpargne: 500 ».",
    pourquoiPas: {
      A: '`self.frais()` appelle la version redéfinie dans `CompteEpargne`, qui divise par deux le montant de la classe mère.',
      B: "`type(self)` désigne la classe réelle de l'objet, `CompteEpargne`, même si `resume()` est définie dans la classe mère.",
      C: "Le nom affiché est celui de la classe de l'objet, et non celui de la classe où la méthode est écrite.",
    },
    aRetenir: 'Une méthode héritée qui appelle `self.methode()` exécute la version redéfinie de la sous-classe ; `super()` permet de réutiliser celle du parent.',
  },
  {
    id: 'DEV-POO-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'moyen',
    enonce:
      "La classe `GestionCompte` calcule les intérêts, génère le relevé PDF, envoie les e-mails aux clients et écrit dans la base de données. Chaque changement de format du relevé oblige à la modifier et à la retester entièrement. Quel principe SOLID est d'abord violé ?",
    options: [
      { id: 'A', texte: 'Le principe de substitution de Liskov (L)' },
      { id: 'B', texte: 'Le principe de ségrégation des interfaces (I)' },
      { id: 'C', texte: 'Le principe de responsabilité unique (S)' },
      { id: 'D', texte: "Le principe d'inversion des dépendances (D)" },
    ],
    bonneReponse: 'C',
    explication:
      "Le principe de responsabilité unique dit qu'une classe ne devrait avoir qu'une seule raison de changer. Ici, quatre préoccupations différentes (calcul, présentation, notification, persistance) cohabitent, si bien qu'une modification de l'une risque de casser les autres. On découpe en classes dédiées : `CalculInterets`, `GenerateurReleve`, `Notificateur`, `CompteRepository`.",
    pourquoiPas: {
      A: "Liskov concerne les sous-classes qui doivent pouvoir remplacer leur classe mère ; il n'y a pas d'héritage en jeu ici.",
      B: 'Ce principe vise les interfaces trop larges imposées aux clients ; le problème décrit est une classe qui fait trop de choses.',
      D: "L'inversion des dépendances recommande de dépendre d'abstractions ; elle peut aider ensuite, mais le défaut premier est le cumul de responsabilités.",
    },
    aRetenir: 'Une classe = une seule raison de changer : séparez calcul, présentation, notification et accès aux données.',
  },
  {
    id: 'DEV-POO-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'moyen',
    enonce:
      "À chaque validation d'une transaction, plusieurs modules doivent réagir : envoi d'un SMS, écriture dans le journal d'audit, mise à jour d'un tableau de bord. On veut pouvoir ajouter un nouveau module sans modifier le code de la transaction. Quel patron de conception convient ?",
    options: [
      { id: 'A', texte: 'Adaptateur (Adapter)' },
      { id: 'B', texte: 'Observateur (Observer)' },
      { id: 'C', texte: 'Singleton' },
      { id: 'D', texte: 'Fabrique (Factory)' },
    ],
    bonneReponse: 'B',
    explication:
      "Avec le patron Observateur, la transaction (le sujet) tient une liste d'abonnés et les notifie tous lorsqu'elle est validée. Chaque module s'abonne de lui-même, si bien qu'en ajouter un ne demande aucune modification du sujet. C'est le principe des écouteurs d'événements et, à plus grande échelle, des architectures orientées événements.",
    pourquoiPas: {
      A: "L'adaptateur convertit une interface en une autre attendue par le client ; il ne notifie personne.",
      C: "Le singleton garantit une instance unique d'une classe ; il ne gère pas la diffusion d'un événement à plusieurs abonnés.",
      D: "La fabrique centralise la création d'objets ; elle ne traite pas la réaction à un événement.",
    },
    aRetenir: 'Un événement, plusieurs réactions indépendantes : patron Observateur (abonnement / notification).',
  },
  {
    id: 'DEV-POO-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'moyen',
    enonce:
      'Le calcul des frais de virement dépend du type de client (particulier, PME, grande entreprise, ONG). Une longue chaîne de `if/elif` grossit à chaque nouvelle offre commerciale. Quelle refonte respecte le principe ouvert/fermé ?',
    options: [
      { id: 'A', texte: 'Copier la méthode de calcul dans chaque écran qui affiche des frais.' },
      { id: 'B', texte: 'Transformer la classe de calcul en singleton afin de centraliser toutes les règles de frais au même endroit.' },
      { id: 'C', texte: 'Remplacer la chaîne de `if/elif` par un `switch` sur le type de client.' },
      { id: 'D', texte: 'Une interface `CalculFrais` et une classe par type de client (patron Stratégie)' },
    ],
    bonneReponse: 'D',
    explication:
      "Le principe ouvert/fermé demande qu'on puisse ajouter un comportement sans modifier le code existant. Avec le patron Stratégie, chaque règle de frais est une classe qui implémente la même interface : une nouvelle offre devient une nouvelle classe, sans toucher aux règles déjà testées. Le code appelant ne manipule que l'interface `CalculFrais`.",
    pourquoiPas: {
      A: 'Dupliquer la logique multiplie les endroits à corriger et crée des incohérences entre écrans.',
      B: "Le singleton limite le nombre d'instances mais laisse toutes les règles dans le même bloc conditionnel.",
      C: "Un `switch` reste une structure à modifier à chaque nouvelle offre : le code n'est toujours pas fermé à la modification.",
    },
    aRetenir: "Remplacer une chaîne de conditions par type par des stratégies polymorphes rend le code ouvert à l'extension et fermé à la modification.",
  },
  {
    id: 'DEV-POO-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Programmation orientée objet',
    difficulte: 'difficile',
    enonce:
      "`CompteBloque` hérite de `Compte`, mais redéfinit `retirer()` et `deposer()` pour qu'elles lèvent systématiquement une exception. Une fonction `cloturer_mois(comptes: list[Compte])`, qui fonctionnait jusque-là, plante dès qu'elle reçoit un `CompteBloque`. Quel diagnostic est le plus juste ?",
    options: [
      { id: 'A', texte: "C'est un usage normal du polymorphisme ; c'est à `cloturer_mois` de tester le type de chaque compte." },
      { id: 'B', texte: 'La substitution de Liskov est violée : un `CompteBloque` ne peut pas remplacer un `Compte`.' },
      { id: 'C', texte: 'Le principe ouvert/fermé est violé, car `Compte` a été modifiée pour créer la sous-classe.' },
      { id: 'D', texte: "L'encapsulation est violée, car `CompteBloque` accède au solde de la classe mère." },
    ],
    bonneReponse: 'B',
    explication:
      "Selon le principe de substitution de Liskov, tout code écrit pour une classe mère doit fonctionner avec n'importe laquelle de ses sous-classes. Une sous-classe qui refuse les opérations promises par sa mère rompt ce contrat. Mieux vaut modéliser l'état « bloqué » autrement : un attribut d'état vérifié par `Compte`, ou une hiérarchie qui distingue les comptes opérables des autres.",
    pourquoiPas: {
      A: "Multiplier les tests de type dans les appelants est justement le symptôme d'une hiérarchie qui ne respecte pas le contrat de la classe mère.",
      C: "La classe mère n'a pas été modifiée ici ; c'est le comportement de la sous-classe qui rompt les attentes.",
      D: "Rien n'indique un accès illégitime à l'état interne : le problème est que la sous-classe ne respecte pas le contrat de sa classe mère.",
    },
    aRetenir: "Une sous-classe doit honorer toutes les promesses de sa classe mère ; sinon, l'héritage est le mauvais outil.",
  },
  // ───────────── Bases de données pour développeurs ─────────────
  {
    id: 'DEV-BDD-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'facile',
    enonce:
      "Un virement débite le compte A puis crédite le compte B. Une panne survient entre les deux opérations. Quelle propriété des transactions garantit qu'on ne se retrouve pas avec un débit sans crédit ?",
    options: [
      { id: 'A', texte: 'La normalisation' },
      { id: 'B', texte: "L'isolation" },
      { id: 'C', texte: 'La durabilité' },
      { id: 'D', texte: "L'atomicité" },
    ],
    bonneReponse: 'D',
    explication:
      "L'atomicité (le A de ACID) impose que la transaction s'exécute entièrement ou pas du tout. Si la panne survient avant le COMMIT, le débit est annulé lors de la reprise. Côté développeur, cela suppose de placer les deux mises à jour dans une même transaction.",
    pourquoiPas: {
      A: 'La normalisation est une technique de modélisation des tables, pas une propriété des transactions.',
      B: "L'isolation règle la visibilité entre transactions concurrentes, pas l'interruption d'une transaction en cours.",
      C: "La durabilité garantit qu'une transaction validée survit à une panne ; elle ne dit rien d'une transaction interrompue avant validation.",
    },
    aRetenir: "Atomicité : tout ou rien ; le débit et le crédit d'un virement doivent appartenir à la même transaction.",
  },
  {
    id: 'DEV-BDD-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'facile',
    enonce:
      "L'API de consultation exécute `SELECT * FROM operations WHERE numero_compte = ?` sur une table de 30 millions de lignes. Chaque appel prend plusieurs secondes, car la base parcourt toute la table. Quelle est la première mesure à prendre ?",
    options: [
      { id: 'A', texte: 'Remplacer `SELECT *` par `SELECT DISTINCT *`' },
      { id: 'B', texte: "Augmenter le délai d'expiration (timeout) côté application" },
      { id: 'C', texte: 'Ajouter `ORDER BY numero_compte` à la requête' },
      { id: 'D', texte: 'Créer un index sur la colonne `numero_compte`' },
    ],
    bonneReponse: 'D',
    explication:
      'Sans index, la base fait un parcours séquentiel (full scan) des 30 millions de lignes à chaque appel. Un index sur `numero_compte` (généralement un arbre B) permet de trouver directement les lignes concernées en O(log n). On vérifie le gain avec `EXPLAIN` ; en contrepartie, chaque index ralentit un peu les écritures.',
    pourquoiPas: {
      A: "DISTINCT oblige à éliminer les doublons, ce qui alourdit la requête au lieu d'éviter le parcours complet.",
      B: 'Allonger le délai masque le symptôme sans réduire le temps de réponse ni la charge de la base.',
      C: 'Un tri ajoute du travail : sans index, la base doit toujours lire toute la table avant de trier.',
    },
    aRetenir: 'Une colonne souvent utilisée dans un WHERE ou une jointure sur une grosse table doit être indexée ; vérifiez avec EXPLAIN.',
  },
  {
    id: 'DEV-BDD-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'moyen',
    enonce:
      'Ce code utilise un ORM (syntaxe de type Django). La table contient 200 clients et la relation `agence` est chargée à la demande (lazy loading). Combien de requêtes SQL sont envoyées à la base ?',
    extrait: {
      langage: 'python',
      contenu: `clients = Client.objects.all()        # liste des clients
for c in clients:
    print(c.nom, c.agence.nom)          # agence du client`,
    },
    options: [
      { id: 'A', texte: '1' },
      { id: 'B', texte: '200' },
      { id: 'C', texte: '201' },
      { id: 'D', texte: '2' },
    ],
    bonneReponse: 'C',
    explication:
      "C'est le problème classique « N+1 » : une requête pour la liste des clients, puis une requête par client pour charger son agence, soit 1 + 200 = 201. Invisible en développement avec peu de données, il écroule les performances en production. On le corrige par un chargement anticipé (`select_related` qui fait une jointure, ou `prefetch_related`).",
    pourquoiPas: {
      A: "L'ORM ne fait pas de jointure automatique : sans chargement anticipé, chaque accès à `c.agence` déclenche sa propre requête.",
      B: 'Il faut ajouter la requête initiale qui récupère la liste des clients, en plus des 200 requêtes sur les agences.',
      D: 'Deux requêtes seraient envoyées avec un chargement anticipé du type `prefetch_related`, absent ici.',
    },
    aRetenir: "Une boucle qui accède à une relation chargée à la demande génère N+1 requêtes : demandez une jointure ou un préchargement à l'ORM.",
  },
  {
    id: 'DEV-BDD-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'moyen',
    enonce:
      "Voici le code d'un virement interne (Python, pilote PostgreSQL). Quel est le défaut principal ?",
    extrait: {
      langage: 'python',
      contenu: `cur.execute("UPDATE comptes SET solde = solde - %s WHERE id = %s", (montant, source))
conn.commit()
cur.execute("UPDATE comptes SET solde = solde + %s WHERE id = %s", (montant, cible))
conn.commit()`,
    },
    options: [
      { id: 'A', texte: "Deux transactions distinctes : si le crédit échoue, le débit reste validé et l'argent disparaît." },
      { id: 'B', texte: "Les requêtes sont vulnérables à l'injection SQL, car les montants sont passés en paramètres." },
      { id: 'C', texte: "Il manque un `SELECT` préalable, sans lequel l'`UPDATE` ne peut pas s'exécuter." },
      { id: 'D', texte: 'Les deux `commit()` rendent le code plus sûr, car chaque étape est sauvegardée au plus tôt.' },
    ],
    bonneReponse: 'A',
    explication:
      "Le premier `commit()` valide définitivement le débit avant même que le crédit soit tenté. Si le second `UPDATE` échoue (compte cible inexistant, coupure réseau…), le compte source est débité pour rien. Il faut exécuter les deux mises à jour dans une seule transaction, avec un seul `commit()` à la fin et un `rollback()` en cas d'exception.",
    pourquoiPas: {
      B: "Passer les valeurs en paramètres (`%s` et tuple) est justement la protection contre l'injection SQL.",
      C: "Un `UPDATE` n'a pas besoin d'un `SELECT` préalable ; une condition dans le `WHERE` suffit pour cibler la ligne.",
      D: "Valider chaque étape séparément est précisément ce qui casse l'atomicité du virement.",
    },
    aRetenir: "Une opération métier indivisible = une seule transaction : un commit à la fin, un rollback en cas d'erreur.",
  },
  {
    id: 'DEV-BDD-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'moyen',
    enonce:
      'Une API de consultation de soldes ouvre une nouvelle connexion à la base pour chaque requête HTTP, puis la ferme. Aux heures de pointe, la base refuse de nouvelles connexions et les temps de réponse explosent. Quelle solution est la plus adaptée ?',
    options: [
      { id: 'A', texte: 'Mettre en cache les soldes dans le navigateur du client' },
      { id: 'B', texte: 'Un pool de connexions réutilisées, de taille maîtrisée' },
      { id: 'C', texte: 'Augmenter sans limite le nombre maximal de connexions du serveur' },
      { id: 'D', texte: 'Ne jamais fermer les connexions pour éviter de les rouvrir' },
    ],
    bonneReponse: 'B',
    explication:
      'Ouvrir une connexion coûte cher : échange réseau, authentification, allocation de ressources côté serveur. Un pool garde un nombre limité de connexions ouvertes et les prête aux requêtes, ce qui supprime ce coût et plafonne la charge imposée à la base. Les frameworks courants en proposent (HikariCP en Java, SQLAlchemy en Python, PgBouncer en frontal de PostgreSQL).',
    pourquoiPas: {
      A: "Un solde mis en cache côté client devient vite faux, et cela ne règle pas le coût d'ouverture des connexions.",
      C: 'Chaque connexion consomme de la mémoire côté serveur : relever la limite sans contrôle déplace le problème.',
      D: "Des connexions jamais fermées s'accumulent et épuisent la limite du serveur encore plus vite.",
    },
    aRetenir: "Réutiliser les connexions via un pool de taille bornée protège à la fois les performances de l'application et la base.",
  },
  {
    id: 'DEV-BDD-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'difficile',
    enonce:
      "Un compte a un solde de 100 000 CDF. Deux requêtes concurrentes exécutent chacune le code ci-dessous pour un retrait de 30 000 CDF, et leurs lectures ont lieu avant l'une ou l'autre écriture. Quel solde final risque-t-on d'obtenir ?",
    extrait: {
      langage: 'python',
      contenu: `solde = lire_solde(compte_id)              # SELECT solde FROM comptes WHERE id = ...
if solde >= 30000:
    ecrire_solde(compte_id, solde - 30000)  # UPDATE comptes SET solde = ... WHERE id = ...`,
    },
    options: [
      { id: 'A', texte: '40 000 CDF' },
      { id: 'B', texte: '100 000 CDF' },
      { id: 'C', texte: 'Une erreur de clé dupliquée' },
      { id: 'D', texte: '70 000 CDF' },
    ],
    bonneReponse: 'D',
    explication:
      "C'est une « mise à jour perdue » (lost update) : chaque requête calcule 100 000 − 30 000 à partir d'une lecture périmée et écrit 70 000. Deux retraits sont accordés, mais un seul est débité. Il faut rendre l'opération atomique en base, par exemple `UPDATE comptes SET solde = solde - 30000 WHERE id = ? AND solde >= 30000`, ou verrouiller la ligne avec `SELECT … FOR UPDATE` dans une transaction.",
    pourquoiPas: {
      A: "C'est le résultat attendu, mais les deux requêtes ont lu 100 000 avant toute écriture : chacune écrit 70 000.",
      B: "Les deux écritures ont bien lieu ; c'est la seconde qui écrase la première, et non une annulation des deux.",
      C: "Deux mises à jour de la même ligne ne violent aucune contrainte d'unicité : elles s'écrasent en silence.",
    },
    aRetenir: "Lire, calculer puis réécrire une valeur côté application expose aux mises à jour perdues : faites le calcul dans l'UPDATE ou verrouillez la ligne.",
  },
  {
    id: 'DEV-BDD-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Bases de données pour développeurs',
    difficulte: 'difficile',
    enonce:
      "L'historique des opérations est paginé ainsi. Plus l'utilisateur avance dans les pages, plus la réponse est lente, alors que `id` est la clé primaire. Quelle évolution règle le problème ?",
    extrait: {
      langage: 'sql',
      contenu: `-- page 10 001 de l'historique
SELECT id, date_op, montant
FROM operations
ORDER BY id
LIMIT 20 OFFSET 200000;`,
    },
    options: [
      { id: 'A', texte: 'Paginer par clé : `WHERE id > :dernier_id_vu ORDER BY id LIMIT 20`' },
      { id: 'B', texte: 'Remplacer `LIMIT 20` par `LIMIT 200`' },
      { id: 'C', texte: 'Ajouter un second index, dédié à la pagination, sur la colonne `id`' },
      { id: 'D', texte: 'Supprimer le `ORDER BY` pour éviter le tri' },
    ],
    bonneReponse: 'A',
    explication:
      "Avec OFFSET, la base doit lire et écarter toutes les lignes précédentes : la page 10 001 coûte 200 020 lignes lues. La pagination par clé (keyset ou « seek ») part de la dernière valeur affichée et descend directement dans l'index : chaque page coûte la même chose, quelle que soit sa position. Elle reste en outre stable si de nouvelles lignes sont insérées pendant la navigation.",
    pourquoiPas: {
      B: "Des pages plus grandes réduisent le nombre d'appels, mais chaque appel lointain parcourt toujours toutes les lignes sautées.",
      C: "`id` est déjà indexé en tant que clé primaire ; le coût vient des 200 000 lignes lues puis jetées par l'OFFSET.",
      D: "Sans ORDER BY, l'ordre des lignes n'est pas garanti : des opérations apparaîtraient en double ou disparaîtraient d'une page à l'autre.",
    },
    aRetenir: 'OFFSET coûte de plus en plus cher en profondeur ; paginez par clé (`WHERE id > dernier_id`) sur une colonne indexée.',
  },
  // ───────────── Web & API ─────────────
  {
    id: 'DEV-API-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'facile',
    enonce:
      "Une requête `POST /api/beneficiaires` enregistre avec succès un nouveau bénéficiaire de virement. Quel code de statut HTTP l'API doit-elle renvoyer, idéalement avec un en-tête `Location` vers la ressource ?",
    options: [
      { id: 'A', texte: '302 Found' },
      { id: 'B', texte: '204 No Content' },
      { id: 'C', texte: '201 Created' },
      { id: 'D', texte: '202 Accepted' },
    ],
    bonneReponse: 'C',
    explication:
      "Le code 201 Created indique qu'une nouvelle ressource a été créée par la requête. L'en-tête `Location` donne son URL (par exemple `/api/beneficiaires/42`), et le corps peut renvoyer sa représentation. Utiliser le code le plus précis aide les clients à réagir correctement sans analyser le corps.",
    pourquoiPas: {
      A: "302 est une redirection temporaire : il demande au client d'aller chercher la réponse ailleurs.",
      B: "204 signale un succès sans corps de réponse, typique d'un DELETE ; il n'indique pas qu'une ressource a été créée.",
      D: '202 signifie que la demande est acceptée mais pas encore traitée ; ici, la création est déjà effective.',
    },
    aRetenir: 'Création réussie : 201 Created + en-tête Location ; succès sans contenu : 204 ; traitement différé : 202.',
  },
  {
    id: 'DEV-API-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'facile',
    enonce:
      "Une guichetière correctement authentifiée appelle `DELETE /api/clients/1043`, une action réservée aux administrateurs. Quel code HTTP l'API doit-elle renvoyer ?",
    options: [
      { id: 'A', texte: '401 Unauthorized' },
      { id: 'B', texte: '500 Internal Server Error' },
      { id: 'C', texte: '404 Not Found' },
      { id: 'D', texte: '403 Forbidden' },
    ],
    bonneReponse: 'D',
    explication:
      "403 Forbidden signifie : « je sais qui vous êtes, mais vous n'avez pas le droit de faire cela ». 401 Unauthorized, malgré son nom, concerne l'authentification : jeton absent, expiré ou invalide. Distinguer les deux aide le client à savoir s'il doit se reconnecter ou demander des droits.",
    pourquoiPas: {
      A: "401 signale une authentification absente ou invalide ; or l'utilisatrice est bien identifiée.",
      B: '500 désigne une panne côté serveur, alors que le refus est un comportement normal et prévu.',
      C: "404 signale une ressource introuvable ; le client 1043 existe, c'est le droit d'agir qui manque.",
    },
    aRetenir: "401 = qui êtes-vous ? (authentification) ; 403 = vous n'avez pas le droit (autorisation).",
  },
  {
    id: 'DEV-API-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'facile',
    enonce:
      "Selon la spécification HTTP, laquelle de ces méthodes n'est PAS idempotente, c'est-à-dire que la répéter peut produire un effet différent d'un seul appel ?",
    options: [
      { id: 'A', texte: 'POST' },
      { id: 'B', texte: 'GET' },
      { id: 'C', texte: 'PUT' },
      { id: 'D', texte: 'DELETE' },
    ],
    bonneReponse: 'A',
    explication:
      "Une méthode est idempotente si plusieurs requêtes identiques ont le même effet sur le serveur qu'une seule. GET, PUT et DELETE le sont ; POST ne l'est pas : deux POST de création peuvent créer deux ressources, ou deux paiements. C'est pourquoi un client ne doit pas rejouer un POST à l'aveugle après une erreur réseau.",
    pourquoiPas: {
      B: 'GET est une méthode de lecture : elle est à la fois sûre (sans effet) et idempotente.',
      C: "PUT remplace la ressource par la représentation fournie : l'envoyer deux fois laisse le même état final.",
      D: "Supprimer deux fois la même ressource laisse le même état final (elle n'existe plus), même si la réponse peut différer.",
    },
    aRetenir: "GET, PUT, DELETE sont idempotentes ; POST ne l'est pas, donc on ne le rejoue pas sans précaution.",
  },
  {
    id: 'DEV-API-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'moyen',
    enonce:
      'Une application mobile envoie `POST /paiements`. La connexion coupe avant la réponse : le client ignore si le paiement a été enregistré et réessaie. Comment éviter de débiter deux fois le client ?',
    options: [
      { id: 'A', texte: 'Remplacer `POST` par `GET`, car GET est idempotente.' },
      { id: 'B', texte: "Envoyer une clé d'idempotence unique par paiement, que le serveur mémorise pour ne pas rejouer l'opération." },
      { id: 'C', texte: "Allonger le délai d'expiration du client à plusieurs minutes pour laisser au serveur le temps de répondre." },
      { id: 'D', texte: 'Interdire tout nouvel essai côté client.' },
    ],
    bonneReponse: 'B',
    explication:
      "La clé d'idempotence (par exemple un UUID dans l'en-tête `Idempotency-Key`) identifie l'intention de paiement. Le serveur la mémorise avec le résultat : si la même clé revient, il ne recrée rien et renvoie la réponse initiale. Le client peut alors réessayer sans risque, ce qui rend un POST effectivement idempotent.",
    pourquoiPas: {
      A: "GET doit rester sans effet sur le serveur : l'utiliser pour créer un paiement viole HTTP et expose aux rejeux par les caches et les robots.",
      C: "Un délai plus long réduit la fréquence du problème mais ne l'élimine pas : une coupure réseau reste possible.",
      D: "Sans nouvel essai, un paiement réellement perdu ne serait jamais effectué et l'utilisateur resterait dans l'incertitude.",
    },
    aRetenir: "Pour rejouer sans risque une opération financière, associez-lui une clé d'idempotence unique, vérifiée côté serveur.",
  },
  {
    id: 'DEV-API-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'moyen',
    enonce:
      "Un développeur propose de placer le numéro de carte du client dans le contenu (payload) du jeton JWT d'authentification, « puisque le jeton est signé ». Quelle affirmation est exacte ?",
    options: [
      { id: 'A', texte: "La signature chiffre le contenu, qui n'est donc lisible que par le serveur." },
      { id: 'B', texte: 'Le contenu est protégé tant que le jeton circule en HTTPS : il peut donc contenir des données sensibles du client.' },
      { id: 'C', texte: 'La signature empêche toute falsification, mais le contenu, simplement encodé en Base64URL, reste lisible.' },
      { id: 'D', texte: "Le jeton est sûr s'il expire au bout de 15 minutes." },
    ],
    bonneReponse: 'C',
    explication:
      "Un JWT signé se compose de trois parties encodées en Base64URL : en-tête, contenu et signature. La signature garantit l'intégrité et l'origine du jeton, pas sa confidentialité : n'importe qui peut décoder le contenu. On n'y place donc que des informations non sensibles (identifiant, rôles, expiration), jamais de numéro de carte ni de mot de passe.",
    pourquoiPas: {
      A: "Signer n'est pas chiffrer : un JWT signé (JWS) se décode sans aucune clé.",
      B: 'HTTPS protège le transport, mais le jeton est stocké et lisible côté client, dans les journaux ou les outils de débogage.',
      D: "Une expiration courte limite la réutilisation du jeton, pas la lecture des données qu'il contient.",
    },
    aRetenir: "Un JWT signé est infalsifiable mais lisible : n'y mettez jamais de donnée confidentielle.",
  },
  {
    id: 'DEV-API-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'moyen',
    enonce:
      "Le front-end servi depuis `https://app.banque-alpha.example` appelle `https://api.banque-alpha.example`. Le navigateur bloque les réponses avec une erreur CORS, alors que l'appel fonctionne depuis Postman. Quelle est la bonne correction ?",
    options: [
      { id: 'A', texte: "Ajouter l'en-tête `Access-Control-Allow-Origin` dans la requête envoyée par le front-end." },
      { id: 'B', texte: 'Désactiver la vérification CORS dans le navigateur des utilisateurs.' },
      { id: 'C', texte: 'Renvoyer côté API `Access-Control-Allow-Origin: https://app.banque-alpha.example`' },
      { id: 'D', texte: 'Renvoyer `Access-Control-Allow-Origin: *` avec les cookies de session.' },
    ],
    bonneReponse: 'C',
    explication:
      "Les deux URL ont des origines différentes (sous-domaines distincts) : le navigateur applique la politique de même origine et exige que le serveur autorise explicitement l'origine appelante. Postman n'est pas un navigateur et n'applique pas CORS, d'où la différence. La correction se fait donc côté API, avec une liste blanche d'origines précises.",
    pourquoiPas: {
      A: "Cet en-tête est une réponse du serveur : l'ajouter dans la requête ne change rien à la décision du navigateur.",
      B: "On ne peut pas, et on ne doit pas, demander aux clients d'affaiblir la sécurité de leur navigateur.",
      D: "Le navigateur refuse le joker `*` pour les requêtes avec identifiants, et ouvrir l'API à toutes les origines est dangereux.",
    },
    aRetenir: "CORS se règle côté serveur, avec une liste blanche d'origines exactes ; c'est le navigateur qui applique la règle.",
  },
  {
    id: 'DEV-API-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'moyen',
    enonce:
      "Qu'affiche ce code JavaScript exécuté avec Node.js ?",
    extrait: {
      langage: 'texte',
      contenu: `// JavaScript
const ordre = {
  montant: 2500,
  devise: "USD",
  note: undefined,
  date: new Date(Date.UTC(2026, 0, 15)),
};
console.log(JSON.stringify(ordre));`,
    },
    options: [
      { id: 'A', texte: '{"montant":2500,"devise":"USD","note":undefined,"date":{}}' },
      { id: 'B', texte: '{"montant":2500,"devise":"USD","date":"2026-01-15T00:00:00.000Z"}' },
      { id: 'C', texte: '{"montant":2500,"devise":"USD","date":"2026-00-15T00:00:00.000Z"}' },
      { id: 'D', texte: '{"montant":2500,"devise":"USD","note":null,"date":"2026-01-15T00:00:00.000Z"}' },
    ],
    bonneReponse: 'B',
    explication:
      "`JSON.stringify` omet les propriétés d'objet dont la valeur est `undefined`, car JSON ne connaît pas cette valeur. Un objet `Date` est converti par sa méthode `toJSON()` en chaîne ISO 8601 en UTC. Le mois 0 de `Date.UTC` correspond à janvier, affiché « 01 ».",
    pourquoiPas: {
      A: "`undefined` n'existe pas en JSON, et un objet Date est sérialisé via sa méthode `toJSON()`, en chaîne ISO.",
      C: 'Les mois de `Date.UTC` sont numérotés à partir de 0, mais la sortie ISO 8601 numérote janvier « 01 ».',
      D: "Une propriété d'objet valant `undefined` est omise par `JSON.stringify`, et non convertie en `null`.",
    },
    aRetenir: 'En JSON, `undefined` disparaît et les dates deviennent des chaînes ISO 8601 : le récepteur doit les reconvertir.',
  },
  {
    id: 'DEV-API-008',
    section: 'technique',
    filiere: 'dev',
    competence: 'Web & API',
    difficulte: 'difficile',
    enonce:
      "L'API de virements déménage définitivement vers une nouvelle URL. Les anciens clients envoient des `POST` avec un corps JSON. Quel code de redirection garantit que le client renverra la même méthode et le même corps à la nouvelle adresse ?",
    options: [
      { id: 'A', texte: '308 Permanent Redirect' },
      { id: 'B', texte: '303 See Other' },
      { id: 'C', texte: '302 Found' },
      { id: 'D', texte: '301 Moved Permanently' },
    ],
    bonneReponse: 'A',
    explication:
      "La spécification HTTP (RFC 9110) prévoit 307 (temporaire) et 308 (permanente) pour les redirections qui interdisent de changer la méthode et le corps. Avec 301 ou 302, de nombreux clients rejouent la requête en GET, ce qui casserait un POST de virement. 303 sert au contraire à rediriger volontairement vers une ressource à lire en GET, par exemple après la soumission d'un formulaire.",
    pourquoiPas: {
      B: '303 demande explicitement au client de suivre la redirection avec un GET : le corps du virement serait perdu.',
      C: '302 est temporaire et, comme 301, autorise historiquement le passage de POST à GET.',
      D: "Pour des raisons historiques, un client peut transformer un POST en GET après un 301 ; la méthode n'est pas garantie.",
    },
    aRetenir: 'Redirection qui conserve méthode et corps : 307 (temporaire) ou 308 (permanente) ; 303 force un GET.',
  },
  // ───────────── Tests & qualité ─────────────
  {
    id: 'DEV-TST-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'facile',
    enonce:
      "On teste la fonction `calculer_interets(capital, taux, jours)` seule, sans base de données ni réseau, en comparant son résultat à des valeurs attendues. De quel type de test s'agit-il ?",
    options: [
      { id: 'A', texte: 'Un test unitaire' },
      { id: 'B', texte: 'Un test de bout en bout' },
      { id: 'C', texte: "Un test d'intégration" },
      { id: 'D', texte: 'Un test de charge' },
    ],
    bonneReponse: 'A',
    explication:
      "Un test unitaire vérifie une petite unité de code (une fonction, une classe) isolée de ses dépendances externes. Il est rapide, déterministe et pointe précisément l'erreur quand il échoue. C'est la base de la « pyramide des tests » : beaucoup de tests unitaires, moins de tests d'intégration, peu de tests de bout en bout.",
    pourquoiPas: {
      B: "Un test de bout en bout pilote l'application entière comme un utilisateur, de l'interface jusqu'à la base.",
      C: "Un test d'intégration vérifie la collaboration entre plusieurs composants, par exemple le code et une vraie base de données.",
      D: "Un test de charge mesure le comportement sous un fort volume de requêtes, pas l'exactitude d'un calcul.",
    },
    aRetenir: 'Test unitaire : une unité isolée, rapide et nombreux ; intégration : plusieurs composants réels ; bout en bout : le parcours complet.',
  },
  {
    id: 'DEV-TST-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'facile',
    enonce:
      "Un client signale que les frais d'un virement de 0 CDF provoquent une division par zéro. Avant de corriger, le développeur écrit un test qui reproduit ce cas et échoue. Quel est le principal intérêt de cette démarche ?",
    options: [
      { id: 'A', texte: 'Remplacer les tests existants, devenus inutiles' },
      { id: 'B', texte: "Éviter d'avoir à faire relire le correctif par un collègue" },
      { id: 'C', texte: 'Prouver que le correctif règle le problème et empêcher que le bogue réapparaisse plus tard (non-régression)' },
      { id: 'D', texte: "Augmenter mécaniquement le taux de couverture pour satisfaire l'outil de qualité" },
    ],
    bonneReponse: 'C',
    explication:
      "Le test écrit avant le correctif échoue d'abord, ce qui prouve qu'il reproduit bien le bogue, puis passe une fois le correctif appliqué. Conservé dans la suite automatique, il signalera immédiatement toute réintroduction du problème. C'est un test de non-régression, particulièrement précieux sur les cas limites comme les montants nuls.",
    pourquoiPas: {
      A: "Le nouveau test s'ajoute aux autres : supprimer les anciens ferait perdre leur protection.",
      B: 'Un test ne remplace pas la revue de code ; les deux pratiques sont complémentaires.',
      D: "La couverture augmente peut-être, mais ce n'est pas le but : le test vaut par le comportement qu'il protège.",
    },
    aRetenir: 'Tout bogue corrigé mérite un test qui le reproduit : il prouve le correctif et protège contre les régressions.',
  },
  {
    id: 'DEV-TST-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'moyen',
    enonce:
      "Le service `NotificationVirement` appelle l'API d'un opérateur SMS facturée à l'envoi. Comment tester unitairement que le bon message est envoyé, sans envoyer de vrai SMS ?",
    options: [
      { id: 'A', texte: 'Appeler la vraie API SMS avec le numéro de téléphone du développeur.' },
      { id: 'B', texte: "Ne pas tester ce service, puisque l'envoi dépend d'un tiers." },
      { id: 'C', texte: "Commenter l'appel à l'API dans le code de production pendant les tests." },
      { id: 'D', texte: "Remplacer le client SMS par une doublure (mock) injectée, puis vérifier les appels qu'elle a reçus." },
    ],
    bonneReponse: 'D',
    explication:
      "Une doublure de test (mock) imite l'interface du client SMS et enregistre les appels reçus. Le test vérifie alors que `envoyer()` a été appelée une fois, avec le bon numéro et le bon texte. Cela suppose que le service reçoive son client SMS par injection de dépendance, au lieu de le créer lui-même.",
    pourquoiPas: {
      A: "Le test devient lent, payant, dépendant du réseau et de l'opérateur : ce n'est plus un test unitaire fiable.",
      B: 'La logique de construction et de déclenchement du message est la nôtre : elle doit être testée.',
      C: 'Modifier le code de production pour les tests est risqué : on finit par livrer le code commenté ou par tester autre chose.',
    },
    aRetenir: 'Les dépendances externes (SMS, paiement, e-mail) se remplacent par des mocks injectés dans les tests unitaires.',
  },
  {
    id: 'DEV-TST-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'moyen',
    enonce:
      "L'équipe annonce fièrement « 100 % de couverture de lignes » sur le module de calcul des frais. Quelle conclusion est correcte ?",
    options: [
      { id: 'A', texte: "Les tests d'intégration et la revue de code deviennent inutiles sur ce module, déjà entièrement vérifié." },
      { id: 'B', texte: 'Chaque ligne a été exécutée au moins une fois, ce qui ne prouve pas que les résultats sont vérifiés.' },
      { id: 'C', texte: 'Toutes les combinaisons de conditions ont été testées.' },
      { id: 'D', texte: 'Le module ne contient plus aucun bogue.' },
    ],
    bonneReponse: 'B',
    explication:
      "La couverture mesure quelles lignes ont été exécutées pendant les tests, pas la qualité des assertions. Un test sans `assert` peut produire 100 % de couverture. C'est un bon indicateur pour repérer le code jamais testé, mais un mauvais objectif en soi ; on la complète par des tests de cas limites et par la revue de code.",
    pourquoiPas: {
      A: "La couverture unitaire ne vérifie ni l'intégration avec les autres composants, ni la lisibilité ou la conception du code.",
      C: 'La couverture de lignes ne garantit pas que chaque branche, et encore moins chaque combinaison de conditions, a été parcourue.',
      D: 'Une ligne peut être exécutée par un test qui ne vérifie rien, ou avec des valeurs qui ne déclenchent pas le cas fautif.',
    },
    aRetenir: "La couverture montre ce qui n'est pas testé ; elle ne prouve pas que ce qui est couvert est correct.",
  },
  {
    id: 'DEV-TST-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'moyen',
    enonce:
      "Ce test pytest vérifie le total de deux frais. Que se passe-t-il à l'exécution ?",
    extrait: {
      langage: 'python',
      contenu: `def test_total_frais():
    frais_tenue = 0.1
    frais_sms = 0.2
    assert frais_tenue + frais_sms == 0.3`,
    },
    options: [
      { id: 'A', texte: 'Le test réussit, car 0.1 + 0.2 vaut exactement 0.3.' },
      { id: 'B', texte: 'Le test échoue, car 0.1 + 0.2 vaut 0.30000000000000004 en virgule flottante.' },
      { id: 'C', texte: 'Le test est ignoré, car pytest ne compare pas les nombres décimaux.' },
      { id: 'D', texte: 'Le test lève une TypeError, car on ne peut pas comparer des flottants avec ==.' },
    ],
    bonneReponse: 'B',
    explication:
      "Les flottants binaires (IEEE 754) ne représentent pas exactement 0,1 ni 0,2 : leur somme vaut 0.30000000000000004. Pour comparer des flottants dans un test, on utilise une tolérance (`pytest.approx`). Mais pour des montants d'argent, la vraie correction est d'utiliser `Decimal` ou des entiers en plus petite unité, et non une tolérance.",
    pourquoiPas: {
      A: "0.1 et 0.2 n'ont pas de représentation binaire exacte : leur somme diffère légèrement de 0.3.",
      C: "pytest exécute l'assertion normalement ; elle échoue simplement.",
      D: 'La comparaison de deux flottants avec `==` est autorisée ; elle renvoie seulement False ici.',
    },
    aRetenir: "Ne comparez jamais des flottants avec == ; et pour de l'argent, n'utilisez pas de flottants du tout.",
  },
  {
    id: 'DEV-TST-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'moyen',
    enonce:
      "Un test démarre l'API de virements avec une vraie base PostgreSQL de test (dans un conteneur), appelle `POST /virements`, puis vérifie en base que les deux soldes ont changé. Comment qualifier ce test ?",
    options: [
      { id: 'A', texte: 'Un test de performance' },
      { id: 'B', texte: 'Un test de bout en bout' },
      { id: 'C', texte: "Un test d'intégration" },
      { id: 'D', texte: 'Un test unitaire' },
    ],
    bonneReponse: 'C',
    explication:
      "Le test vérifie que plusieurs composants réels collaborent correctement : le code de l'API, le pilote SQL, le schéma et la base. Il détecte des erreurs invisibles aux tests unitaires (requête SQL fausse, contrainte oubliée, transaction mal gérée). Il est plus lent : on en écrit moins que de tests unitaires.",
    pourquoiPas: {
      A: "Le test vérifie l'exactitude du résultat, pas des temps de réponse sous charge.",
      B: "Un test de bout en bout passerait par l'interface utilisateur, comme un vrai client ; ici, on appelle directement l'API.",
      D: 'Un test unitaire isole le code de ses dépendances ; ici, la vraie base de données participe au test.',
    },
    aRetenir: "Dès qu'un test fait intervenir une vraie dépendance (base, file de messages, autre service), c'est un test d'intégration.",
  },
  {
    id: 'DEV-TST-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Tests & qualité',
    difficulte: 'difficile',
    enonce:
      "Le test de la fonction `est_jour_ouvre()` passe du lundi au vendredi mais échoue le week-end sur le serveur d'intégration continue, sans aucune modification du code. Quelle est la meilleure correction ?",
    options: [
      { id: 'A', texte: 'Exécuter la CI uniquement en semaine.' },
      { id: 'B', texte: "Relancer automatiquement le test jusqu'à ce qu'il passe." },
      { id: 'C', texte: 'Faire recevoir la date (ou une horloge) en paramètre par la fonction, et fixer cette date dans le test.' },
      { id: 'D', texte: 'Désactiver le test le samedi et le dimanche dans la configuration de la CI.' },
    ],
    bonneReponse: 'C',
    explication:
      "Le test dépend de l'horloge réelle (`datetime.now()`), ce qui le rend non déterministe (« flaky »). En injectant la date ou une horloge, le test peut vérifier explicitement un lundi, un samedi ou un jour férié, à tout moment. Les bibliothèques de « gel du temps » permettent la même chose quand on ne peut pas modifier la signature.",
    pourquoiPas: {
      A: 'On réduit la fréquence des vérifications sans corriger la cause : le test reste non déterministe.',
      B: 'Les relances ne changent rien : le résultat dépend du jour, il échouera tout le week-end.',
      D: "Masquer l'échec laisse le test dépendant du calendrier et cache peut-être un vrai bogue.",
    },
    aRetenir: "Un bon test est déterministe : injectez l'horloge, l'aléatoire et le réseau au lieu de dépendre du monde réel.",
  },
  // ───────────── Git & DevOps ─────────────
  {
    id: 'DEV-GIT-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'facile',
    enonce:
      "Tu commences le développement d'une nouvelle fonctionnalité et veux créer la branche `feature/releve-pdf` à partir de la branche courante, puis t'y placer immédiatement. Quelle commande utiliser ?",
    options: [
      { id: 'A', texte: '`git branch -d feature/releve-pdf`' },
      { id: 'B', texte: '`git switch -c feature/releve-pdf`' },
      { id: 'C', texte: '`git init feature/releve-pdf`' },
      { id: 'D', texte: '`git merge feature/releve-pdf`' },
    ],
    bonneReponse: 'B',
    explication:
      "`git switch -c <nom>` crée la branche à partir du commit courant et bascule dessus en une seule commande. L'ancienne forme équivalente, toujours très répandue, est `git checkout -b <nom>`. Travailler sur une branche dédiée isole la fonctionnalité jusqu'à sa revue et sa fusion.",
    pourquoiPas: {
      A: "L'option `-d` supprime une branche existante ; elle n'en crée pas.",
      C: '`git init` crée un nouveau dépôt dans un dossier, pas une branche dans le dépôt actuel.',
      D: '`git merge` intègre une branche existante dans la branche courante ; il ne crée rien.',
    },
    aRetenir: "Créer une branche et s'y placer : `git switch -c nom` (ou `git checkout -b nom`).",
  },
  {
    id: 'DEV-GIT-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'facile',
    enonce:
      "L'équipe met en place l'intégration continue (CI). Quelle description correspond à cette pratique ?",
    options: [
      { id: 'A', texte: 'À chaque envoi de code, une chaîne automatique compile le projet et exécute les tests, pour détecter les erreurs au plus tôt.' },
      { id: 'B', texte: 'Un serveur sauvegarde le dépôt Git toutes les nuits.' },
      { id: 'C', texte: 'Chaque développeur fusionne ses modifications une fois par mois, après une longue phase de tests manuels.' },
      { id: 'D', texte: 'Le code est déployé directement en production par le développeur depuis son poste.' },
    ],
    bonneReponse: 'A',
    explication:
      "L'intégration continue consiste à intégrer fréquemment le travail de chacun dans la branche commune, chaque intégration étant vérifiée par une chaîne automatique (compilation, tests, analyse du code). Un problème est ainsi détecté quelques minutes après son introduction. Le déploiement continu (CD) prolonge cette chaîne jusqu'à la mise en production.",
    pourquoiPas: {
      B: 'Une sauvegarde protège contre la perte du dépôt, mais ne vérifie pas que le code compile ni que les tests passent.',
      C: "Des fusions rares et massives sont précisément ce que l'intégration continue cherche à éviter.",
      D: "Un déploiement manuel depuis un poste contourne les contrôles automatiques et n'a rien d'une intégration continue.",
    },
    aRetenir: 'CI : intégrer souvent, avec compilation et tests automatiques à chaque envoi ; CD : automatiser aussi la livraison.',
  },
  {
    id: 'DEV-GIT-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'moyen',
    enonce:
      "Un commit défectueux a été poussé sur la branche `main`, déjà récupérée par toute l'équipe et déployée en recette. Comment l'annuler proprement ?",
    options: [
      { id: 'A', texte: 'Supprimer le dossier `.git` et recloner le dépôt' },
      { id: 'B', texte: '`git reset --hard <commit-précédent>` puis `git push --force`' },
      { id: 'C', texte: '`git commit --amend` pour modifier le commit défectueux' },
      { id: 'D', texte: '`git revert <commit>`, qui crée un nouveau commit annulant ses modifications, puis pousser normalement' },
    ],
    bonneReponse: 'D',
    explication:
      "`git revert` ajoute un nouveau commit qui applique l'inverse des modifications du commit fautif : l'historique est conservé et personne n'a besoin de resynchroniser sa copie. `git reset` déplace la branche vers un commit antérieur ; il est réservé aux commits encore locaux. Sur une branche partagée, on ajoute à l'historique, on ne le réécrit pas.",
    pourquoiPas: {
      A: 'Recloner récupère exactement le même historique distant, commit défectueux compris.',
      B: "Réécrire l'historique d'une branche partagée désynchronise les dépôts des collègues et peut faire perdre leur travail.",
      C: "`--amend` réécrit le dernier commit local ; sur un commit déjà poussé et partagé, cela réécrit aussi l'historique.",
    },
    aRetenir: 'Commit déjà partagé : `git revert` (nouveau commit inverse) ; commit encore local : `git reset` est possible.',
  },
  {
    id: 'DEV-GIT-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'moyen',
    enonce:
      'Sur la branche `main`, tu lances `git merge correctif-taux` et Git signale un conflit dans `config.py`. Que représente la partie située entre `<<<<<<< HEAD` et `=======` ?',
    extrait: {
      langage: 'texte',
      contenu: `<<<<<<< HEAD
TAUX_FRAIS = 0.015
=======
TAUX_FRAIS = 0.012
>>>>>>> correctif-taux`,
    },
    options: [
      { id: 'A', texte: 'La version de la branche fusionnée, `correctif-taux`' },
      { id: 'B', texte: "La version que Git a choisie automatiquement et qu'il suffit de valider" },
      { id: 'C', texte: 'La version de la branche courante, `main`' },
      { id: 'D', texte: "La version de l'ancêtre commun aux deux branches" },
    ],
    bonneReponse: 'C',
    explication:
      "`HEAD` désigne la branche sur laquelle tu te trouves, ici `main` : la première partie est donc sa version. La seconde partie, jusqu'à `>>>>>>>`, vient de la branche que tu fusionnes. Pour résoudre, tu édites le fichier (en gardant l'une, l'autre ou une combinaison), tu supprimes les marqueurs, puis `git add` et `git commit`.",
    pourquoiPas: {
      A: 'La version de `correctif-taux` est celle située entre `=======` et `>>>>>>> correctif-taux`.',
      B: "En cas de conflit, Git ne choisit rien : c'est au développeur de décider, puis de supprimer les marqueurs.",
      D: "L'ancêtre commun n'est pas affiché par défaut ; il n'apparaît qu'avec le style de conflit `diff3`.",
    },
    aRetenir: 'Dans un conflit : entre `<<<<<<< HEAD` et `=======`, ta branche actuelle ; après `=======`, la branche fusionnée.',
  },
  {
    id: 'DEV-GIT-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'moyen',
    enonce:
      "L'application est livrée sous forme d'image de conteneur et passe par trois environnements : développement, recette, production. Quelle pratique est recommandée ?",
    options: [
      { id: 'A', texte: "Utiliser la base de données de production pour la recette, afin d'avoir des données réalistes." },
      { id: 'B', texte: "Reconstruire une image différente pour chaque environnement, avec les mots de passe de celui-ci intégrés dans l'image." },
      { id: 'C', texte: 'Se connecter au conteneur de production pour y modifier le code à chaud en cas de bogue.' },
      { id: 'D', texte: "Construire une seule image, la promouvoir telle quelle d'un environnement à l'autre, et fournir la configuration et les secrets par l'environnement." },
    ],
    bonneReponse: 'D',
    explication:
      "Une image construite une seule fois puis promue garantit que la production exécute exactement ce qui a été validé en recette. Ce qui change d'un environnement à l'autre (URL de base de données, niveau de journalisation, secrets) est injecté au démarrage par des variables d'environnement ou un coffre-fort de secrets. C'est l'un des principes de la méthode « twelve-factor app ».",
    pourquoiPas: {
      A: 'La recette ne doit jamais écrire dans la production : on y utilise des données de test ou anonymisées.',
      B: "Reconstruire signifie que ce qui part en production n'est pas exactement ce qui a été testé, et les secrets intégrés fuient avec l'image.",
      C: "Une modification manuelle en production n'est ni tracée, ni testée, et disparaît au prochain redémarrage du conteneur.",
    },
    aRetenir: 'Une image, plusieurs environnements : le code est identique partout, seule la configuration externe change.',
  },
  {
    id: 'DEV-GIT-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'difficile',
    enonce:
      'Un collègue a déjà récupéré ta branche `feature/kyc` et travaille dessus. Tu exécutes `git rebase main` sur cette branche, puis `git push --force`. Quel est le risque principal ?',
    options: [
      { id: 'A', texte: 'Le rebase supprime définitivement les commits de `main`.' },
      { id: 'B', texte: 'Le rebase fusionne automatiquement `feature/kyc` dans `main` sans revue.' },
      { id: 'C', texte: "Aucun : un rebase ne modifie que le contenu des fichiers, jamais l'historique ni les identifiants des commits." },
      { id: 'D', texte: "Le rebase a recréé tes commits avec de nouveaux identifiants : l'historique du collègue diverge." },
    ],
    bonneReponse: 'D',
    explication:
      "`git rebase` rejoue chaque commit de ta branche au-dessus de `main` : ce sont de nouveaux commits, avec de nouveaux hachages, même si leur contenu est similaire. Le push forcé remplace la branche distante, alors que ton collègue travaille sur les anciens commits. La règle d'or : ne rebaser que des commits qui n'ont pas encore été partagés ; sinon, préférer `git merge`, ou au minimum `git push --force-with-lease` après concertation.",
    pourquoiPas: {
      A: 'Les commits de `main` servent de nouvelle base et restent intacts.',
      B: 'Le rebase déplace les commits de la branche courante au-dessus de `main` ; il ne modifie pas `main`.',
      C: "C'est l'inverse : le rebase réécrit l'historique en rejouant les commits sur une nouvelle base.",
    },
    aRetenir: "Le rebase réécrit l'historique : à réserver aux commits encore privés ; sur une branche partagée, on fusionne.",
  },
  {
    id: 'DEV-GIT-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Git & DevOps',
    difficulte: 'difficile',
    enonce:
      "La branche `main` contient les commits c1 et c2. Tu crées la branche `correctif`, y ajoutes c3 et c4, puis fusionnes. Personne n'a ajouté de commit sur `main` entre-temps. Que fait la dernière commande ?",
    extrait: {
      langage: 'shell',
      contenu: `git switch -c correctif
# ... modifications, puis commits c3 et c4 sur correctif
git switch main
git merge correctif`,
    },
    options: [
      { id: 'A', texte: 'Elle refuse la fusion et exige un rebase préalable.' },
      { id: 'B', texte: 'Une avance rapide (fast-forward) : `main` pointe désormais sur c4, sans commit de fusion.' },
      { id: 'C', texte: 'Elle provoque obligatoirement un conflit à résoudre.' },
      { id: 'D', texte: 'Elle crée un commit de fusion c5 qui a pour parents c2 et c4.' },
    ],
    bonneReponse: 'B',
    explication:
      "Comme `main` n'a pas bougé depuis la création de `correctif`, son dernier commit c2 est un ancêtre de c4. Git se contente de déplacer le pointeur de `main` vers c4 : c'est une avance rapide, qui produit un historique linéaire. Pour forcer la création d'un commit de fusion (et garder la trace de la branche), on utilise `git merge --no-ff`.",
    pourquoiPas: {
      A: "`git merge` accepte cette situation par défaut ; il faudrait l'option `--ff-only` pour qu'il refuse les autres cas, pas celui-ci.",
      C: "Aucune modification concurrente n'existe sur `main` : un conflit est impossible.",
      D: "Un commit de fusion n'est nécessaire que si les deux branches ont divergé ; ici, `main` est un ancêtre direct de `correctif`.",
    },
    aRetenir: "Si la branche cible n'a pas divergé, `git merge` fait une avance rapide ; `--no-ff` force un commit de fusion.",
  },
  // ───────────── Sécurité du code ─────────────
  {
    id: 'DEV-SEC-001',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'facile',
    enonce:
      "Ce code Python recherche un client à partir d'un nom saisi dans un formulaire. Quelle vulnérabilité contient-il ?",
    extrait: {
      langage: 'python',
      contenu: `nom = request.args["nom"]
requete = f"SELECT * FROM clients WHERE nom = '{nom}'"
cur.execute(requete)`,
    },
    options: [
      { id: 'A', texte: "Une injection SQL : la saisie est concaténée dans la requête au lieu d'être passée en paramètre." },
      { id: 'B', texte: 'Aucune, car `cur.execute` échappe automatiquement les chaînes.' },
      { id: 'C', texte: 'Une faille XSS, car le nom saisi est affiché dans la page.' },
      { id: 'D', texte: "Une faille CSRF, car la requête n'exige pas de jeton." },
    ],
    bonneReponse: 'A',
    explication:
      "Si l'utilisateur saisit `' OR '1'='1`, la condition devient toujours vraie et la requête renvoie tous les clients ; d'autres charges peuvent modifier ou supprimer des données. La correction est une requête paramétrée : `cur.execute(\"SELECT * FROM clients WHERE nom = %s\", (nom,))`. Le pilote transmet alors la valeur séparément du code SQL.",
    pourquoiPas: {
      B: "`execute` n'échappe que les valeurs passées en paramètres séparés, pas une chaîne déjà assemblée par f-string.",
      C: "Ce code n'affiche rien dans une page web ; il construit une requête SQL avec une donnée non maîtrisée.",
      D: "La CSRF concerne des actions déclenchées à l'insu d'un utilisateur connecté, pas la construction de la requête SQL.",
    },
    aRetenir: 'Ne jamais construire une requête SQL par concaténation de saisies : toujours des requêtes paramétrées.',
  },
  {
    id: 'DEV-SEC-002',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'facile',
    enonce:
      "Comment l'application doit-elle stocker les mots de passe des utilisateurs du portail client ?",
    options: [
      { id: 'A', texte: 'Avec Argon2id ou bcrypt, fonctions de hachage lentes et salées' },
      { id: 'B', texte: 'Hachés avec SHA-256, sans sel' },
      { id: 'C', texte: "Chiffrés en AES avec une clé stockée dans le code de l'application" },
      { id: 'D', texte: 'Hachés avec MD5, puis encodés en Base64' },
    ],
    bonneReponse: 'A',
    explication:
      "Un mot de passe ne doit jamais être récupérable, même par l'application : on stocke un haché, et l'on compare les hachés à la connexion. Argon2id, bcrypt ou scrypt sont volontairement lents et intègrent un sel aléatoire par utilisateur, ce qui rend les attaques par force brute très coûteuses en cas de fuite de la base. Les bibliothèques standard gèrent sel et paramètres de coût.",
    pourquoiPas: {
      B: 'SHA-256 est trop rapide pour cet usage et, sans sel, des mots de passe identiques ont le même haché, ce qui facilite les attaques par tables précalculées.',
      C: 'Un chiffrement est réversible : quiconque obtient la clé retrouve tous les mots de passe en clair.',
      D: "MD5 est obsolète et extrêmement rapide à calculer ; l'encodage Base64 n'ajoute aucune sécurité.",
    },
    aRetenir: 'Mots de passe : hachage lent et salé (Argon2id, bcrypt), jamais de chiffrement réversible ni de hachage rapide.',
  },
  {
    id: 'DEV-SEC-003',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'moyen',
    enonce:
      "Sur l'espace de messagerie client, ce code JavaScript affiche les messages enregistrés en base. Quelle faille introduit-il et comment la corriger ?",
    extrait: {
      langage: 'texte',
      contenu: `// JavaScript (navigateur)
const bloc = document.getElementById("message");
bloc.innerHTML = message.contenu;   // contenu saisi par un autre utilisateur`,
    },
    options: [
      { id: 'A', texte: 'Une faille CSRF ; il faut ajouter un jeton anti-CSRF au formulaire.' },
      { id: 'B', texte: "Aucune faille, car le message vient de la base de données et non directement de l'utilisateur." },
      { id: 'C', texte: "Un XSS stocké ; il faut afficher le contenu avec `textContent` (ou l'échapper) plutôt qu'avec `innerHTML`." },
      { id: 'D', texte: 'Une injection SQL ; il faut utiliser une requête paramétrée.' },
    ],
    bonneReponse: 'C',
    explication:
      "Avec `innerHTML`, une balise comme `<img src=x onerror=...>` contenue dans le message est interprétée et son script s'exécute chez chaque lecteur : c'est un XSS stocké, qui peut voler une session ou déclencher des actions. `textContent` insère le texte tel quel, sans l'interpréter. On complète par une politique CSP et, si du HTML riche est nécessaire, par un assainisseur reconnu.",
    pourquoiPas: {
      A: "Le problème est l'interprétation du contenu comme du HTML, pas la provenance d'une requête.",
      B: "Une donnée en base a été saisie par un utilisateur : elle reste non fiable au moment de l'affichage.",
      D: "Aucune requête SQL n'est construite ici : la donnée est insérée dans le DOM de la page.",
    },
    aRetenir: "Toute donnée issue d'un utilisateur s'affiche comme du texte (`textContent`, échappement), jamais comme du HTML brut.",
  },
  {
    id: 'DEV-SEC-004',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'moyen',
    enonce:
      "Le portail de la Banque Beta authentifie par cookie de session. Un site piégé, visité par un client connecté, soumet automatiquement un formulaire caché vers `POST https://portail.banque-beta.example/virements`. Comment s'appelle cette attaque et quelle protection est adaptée ?",
    options: [
      { id: 'A', texte: "Un XSS ; on échappe l'affichage des montants." },
      { id: 'B', texte: 'Une attaque par force brute ; on limite le nombre de tentatives de connexion sur le portail client.' },
      { id: 'C', texte: "Une injection SQL ; on paramètre la requête d'insertion du virement." },
      { id: 'D', texte: 'Une CSRF ; parade : un jeton anti-CSRF dans chaque formulaire et des cookies `SameSite`.' },
    ],
    bonneReponse: 'D',
    explication:
      "Dans une CSRF (Cross-Site Request Forgery), le navigateur joint automatiquement le cookie de session à la requête forgée par le site tiers, qui s'exécute donc au nom du client. Un jeton anti-CSRF, que le site tiers ne peut pas connaître, permet au serveur de rejeter la requête. L'attribut `SameSite=Lax` ou `Strict` empêche en outre l'envoi du cookie sur les requêtes POST intersites.",
    pourquoiPas: {
      A: "Aucun script n'est injecté dans le portail : la requête part d'un autre site.",
      B: "Le client est déjà connecté : l'attaquant n'a pas besoin de deviner de mot de passe.",
      C: 'La requête SQL peut être parfaitement paramétrée : le problème est que le navigateur envoie la demande avec le cookie du client à son insu.',
    },
    aRetenir: "CSRF : une action déclenchée à l'insu d'un utilisateur connecté ; parade = jeton anti-CSRF + cookies `SameSite`.",
  },
  {
    id: 'DEV-SEC-005',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'moyen',
    enonce:
      "Un développeur s'aperçoit qu'il a poussé sur le dépôt Git partagé un fichier contenant la clé d'API de production d'un prestataire de paiement. Quelle est la première action à mener ?",
    options: [
      { id: 'A', texte: 'Supprimer le fichier dans un nouveau commit' },
      { id: 'B', texte: 'Rendre le dépôt privé' },
      { id: 'C', texte: 'Révoquer la clé chez le prestataire et en générer une nouvelle, stockée hors du code' },
      { id: 'D', texte: 'Ajouter le fichier au `.gitignore`' },
    ],
    bonneReponse: 'C',
    explication:
      "Une fois poussé, un secret doit être considéré comme compromis : la seule mesure sûre est de le révoquer et de le remplacer. Nettoyer ensuite l'historique (avec un outil dédié) reste utile, mais ne suffit jamais seul. Pour l'avenir, les secrets se lisent depuis des variables d'environnement ou un coffre-fort, et un scanner de secrets peut bloquer les commits fautifs.",
    pourquoiPas: {
      A: "La clé reste lisible dans l'historique Git et dans toutes les copies déjà récupérées du dépôt.",
      B: 'La clé a pu être copiée avant ; et un dépôt privé reste accessible à de nombreuses personnes et outils.',
      D: "`.gitignore` n'agit que sur les fichiers non encore suivis ; il n'efface rien de ce qui a déjà été poussé.",
    },
    aRetenir: "Secret poussé = secret compromis : on le révoque et on le remplace d'abord, on nettoie l'historique ensuite.",
  },
  {
    id: 'DEV-SEC-006',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'moyen',
    enonce:
      'Le formulaire de virement vérifie en JavaScript que le montant est positif et inférieur au plafond. Un testeur envoie directement la requête avec `curl` et un montant de −50 000 : le virement est accepté. Quelle est la cause ?',
    options: [
      { id: 'A', texte: "La validation n'existe que dans le navigateur ; le serveur doit revalider toutes les entrées." },
      { id: 'B', texte: '`curl` contourne HTTPS, il faut donc interdire cet outil.' },
      { id: 'C', texte: "Le JavaScript du formulaire contient un bogue qu'il suffit de corriger." },
      { id: 'D', texte: "Le pare-feu applicatif aurait dû bloquer cette requête anormale : le code de l'application n'est pas en cause." },
    ],
    bonneReponse: 'A',
    explication:
      "La validation côté client améliore l'ergonomie (retour immédiat), mais elle ne protège rien : n'importe qui peut envoyer une requête HTTP sans passer par le formulaire. Le serveur doit valider le type, le format, les bornes et les règles métier de chaque entrée, de préférence par liste blanche (ce qui est autorisé). En banque, une telle faille permet de créditer un compte au lieu de le débiter.",
    pourquoiPas: {
      B: "`curl` utilise HTTPS normalement ; et un attaquant peut envoyer la même requête avec n'importe quel outil.",
      C: 'Même sans bogue, le contrôle côté navigateur est contournable : une requête forgée ne passe pas par ce code.',
      D: "Un pare-feu applicatif ne connaît pas les règles métier comme le plafond ou le signe d'un montant : c'est au code serveur de les vérifier.",
    },
    aRetenir: 'La validation côté client sert le confort ; seule la validation côté serveur sert la sécurité.',
  },
  {
    id: 'DEV-SEC-007',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'difficile',
    enonce:
      "Pour fiabiliser les calculs de frais, un développeur teste ces trois comparaisons en Python. Qu'affiche le programme ?",
    extrait: {
      langage: 'python',
      contenu: `from decimal import Decimal

print(0.1 + 0.2 == 0.3)
print(Decimal(0.1) + Decimal(0.2) == Decimal("0.3"))
print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))`,
    },
    options: [
      { id: 'A', texte: 'True, True, True' },
      { id: 'B', texte: 'False, False, False' },
      { id: 'C', texte: 'False, True, True' },
      { id: 'D', texte: 'False, False, True' },
    ],
    bonneReponse: 'D',
    explication:
      "Les flottants binaires ne représentent pas exactement 0,1 : la première comparaison est fausse. `Decimal(0.1)` convertit fidèlement ce flottant imprécis (0.1000000000000000055511…), donc la deuxième l'est aussi. Seule la construction à partir de chaînes donne des valeurs décimales exactes. Pour de l'argent, on utilise `Decimal` créé depuis des chaînes, ou des entiers en plus petite unité (centimes).",
    pourquoiPas: {
      A: '0.1 + 0.2 vaut 0.30000000000000004 en virgule flottante : la première comparaison est déjà fausse.',
      B: 'Construits à partir de chaînes, les `Decimal` représentent exactement 0,1 et 0,2 : leur somme vaut exactement 0,3.',
      C: "`Decimal(0.1)` reçoit un flottant déjà imprécis et en conserve fidèlement l'erreur binaire : la deuxième comparaison est fausse.",
    },
    aRetenir: 'Montants : `Decimal("0.1")` depuis une chaîne, ou des entiers en centimes ; jamais de flottants, ni de `Decimal` construit depuis un flottant.',
  },
  {
    id: 'DEV-SEC-008',
    section: 'technique',
    filiere: 'dev',
    competence: 'Sécurité du code',
    difficulte: 'difficile',
    enonce:
      "Un audit montre qu'en remplaçant `/api/comptes/1043/releve` par `/api/comptes/1044/releve`, un client connecté obtient le relevé d'un autre client. L'équipe propose de remplacer les identifiants numériques par des UUID aléatoires. Qu'en penser ?",
    options: [
      { id: 'A', texte: "Insuffisant : c'est un IDOR ; le serveur doit vérifier que le compte appartient à l'utilisateur connecté." },
      { id: 'B', texte: "Il suffit de masquer l'identifiant dans l'interface et dans l'URL affichée pour que l'utilisateur ne puisse plus le modifier." },
      { id: 'C', texte: "C'est suffisant, car un UUID ne peut pas être deviné." },
      { id: 'D', texte: "C'est inutile, car seul HTTPS peut empêcher ce type d'attaque." },
    ],
    bonneReponse: 'A',
    explication:
      "L'API fait confiance à l'identifiant fourni sans vérifier qu'il appartient au demandeur : c'est une référence directe non sécurisée (IDOR), catégorie « contrôle d'accès défaillant », en tête du Top 10 de l'OWASP. Des identifiants aléatoires rendent l'exploitation plus difficile, mais ne corrigent pas la cause. La correction est une vérification d'appartenance côté serveur, par exemple en filtrant la requête par l'identifiant de l'utilisateur tiré de sa session.",
    pourquoiPas: {
      B: "L'utilisateur contrôle les requêtes envoyées par son navigateur, qu'un identifiant soit affiché à l'écran ou non.",
      C: "Un UUID peut fuiter (journaux, captures d'écran, liens partagés, autres API) : l'imprévisibilité ne remplace pas une vérification d'autorisation.",
      D: "HTTPS protège le transport ; ici, la requête est légitime sur le plan réseau, c'est l'autorisation qui manque.",
    },
    aRetenir: "Chaque accès à une ressource doit être autorisé côté serveur pour l'utilisateur courant ; un identifiant difficile à deviner n'est pas un contrôle d'accès.",
  },
];
