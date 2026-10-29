# SPEC — Promo verticale « Simulateur BCC »

GOAL:    le candidat congolais comprend en 25 s qu'il peut passer l'examen blanc 5 fois avant le vrai test, gratuitement, et va sur le site.
OUTPUT:  HyperFrames, 1080 × 1920, 30 fps, MP4 (statut WhatsApp / TikTok / Reels).
TIME:    25 s × 30 = 750 images. Muet (aucune source musicale connectée) : le texte et l'interface portent tout.

LOOK:    fond #F8F9FB plein (pas de dégradé), grille 72 px à 4 % d'opacité en haut seulement ;
         encre #0B1220 ; une seule couleur d'accent #0062CC, sur un mot par plan ;
         vert produit #0E9F6E uniquement pour la bonne réponse (couleur d'état du produit, pas décorative) ;
         jaune #F7C600 uniquement pour l'encart « À retenir » (couleur du produit) ;
         Inter 700 pour les titres, 92–112 px, interlettrage −4 % ; Inter 400/700 corps 30–34 px ;
         JetBrains Mono pour le code, le chrono et les notes, 28–40 px.
         Matière : l'interface réelle du simulateur (cartes blanches, bordure 2 px #E6E8ED, rayon 32 px,
         ombre 0 24px 64px rgba(11,18,32,.10)), reconstruite à 1,6× de sa taille d'écran.
OBJECTS: le chrono du QCM (pastille « 18:42 ») ; la carte question DATA-SQL-001 avec ses 4 options réelles ;
         le panneau d'explication réel (bonne réponse, « Pourquoi les autres sont fausses », « À retenir ») ;
         l'anneau de note (14,5/20, « Bon niveau ») ; la courbe de progression en 5 barres ;
         le logo original (bouclier + graphe), jamais le logo de la BCC.
MOTION:  arrivées expo.out 0,6–0,9 s ; déplacements caméra power2.inOut 0,5 s ; sorties power3.in, 40 % plus courtes ;
         titres mot par mot : flou 6 px → 0 et opacité 0 → 1 en 0,13 s, 0,07 s d'écart, sans translation ;
         curseur 64 px (6 % de la largeur), entre par la droite, son clic change l'option à la même image.
SHOTS:
  0,0–3,2   s1 · « Le test de la BCC. » déjà à l'écran à l'image 0 (vignette) ; puis « Et si tu l'avais déjà passé » mot à mot,
            « 5 fois ? » en accent. La pastille chrono 30:00 monte sous le titre et grossit : elle devient la scène suivante.
  3,2–9,4   s2 · la carte question remplit la bande utile ; le chrono défile 18:42 → 18:36 ; le curseur entre (5,2 s),
            survole C puis B, clique B à 6,6 s : B passe au vert avec ✓. Surtitre « 24 questions. 30 minutes. ».
  9,4–14,6  s3 · l'option B s'élargit (morph) en panneau d'explication ; A, C, D réfutées une par une (0,5 s d'écart) ;
            l'encart « À retenir » arrive en dernier. Surtitre « Chaque erreur expliquée. ».
  14,6–20,0 s4 · l'encart « À retenir » se replie en anneau ; l'anneau se trace et la note compte jusqu'à 14,5 (paiement visuel,
            vitesse normale) ; puis l'anneau rejoint la 5ᵉ barre de la courbe de progression qui pousse.
            Surtitre « Simulation après simulation. ».
  20,0–25,0 s5 · « Passe-le 5 fois avant le jour J. » ; la 5ᵉ barre se remplit en logo ; « Simulateur BCC » se dévoile à côté ;
            appel : « Gratuit · <url> » tenu 2,5 s ; mention « Outil indépendant, non affilié à la Banque Centrale du Congo. »
BANNED:  fond sombre avec éléments flottants ; lueurs, particules ; dégradés violets/bleus ; verre ; papier crème + serif +
         étiquettes mono en capitales + pastilles ; tout centré ; tout en fondu-glissé vers le haut ; titres qui bougent après
         l'atterrissage ; trois cartes en ligne ; logo dans un coin ; tout logo, sceau ou charte de la BCC ; faux tableau de bord.
QA:      t=0 (vignette lisible) · t=6,7 (B vert) · t=12,5 (réfutations lisibles à 360 px) · t=17,5 (14,5/20) ·
         t=23,5 (logo + URL + mention d'indépendance dans la bande 168–1330 px).
