# REVIEW — Promo verticale v1 (29/10/2026)

Rendu : `renders/simulateur-bcc-promo-9x16.mp4` (1080×1920, 30 i/s, 25,5 s, 2,4 Mo, qualité delivery) —
copie publiée dans `public/promo/simulateur-bcc-promo-9x16.mp4`.

## Choix créatifs
- Storyline retenue : « Et si tu l'avais déjà passé ? » — question-accroche, puis chaîne d'objets réels du produit
  (chrono → question DATA-SQL-001 → clic sur B → explication → anneau de note → courbe de progression → marque).
- Non construites : « Le résultat d'abord » (14,5/20 puis recul vers l'examen) ; « Avant / après » (PDF épars vs simulateur).
- Muet : aucune source musicale connectée (pas de connexion HeyGen). Les statuts WhatsApp se lisent surtout sans le son ;
  le texte et l'interface portent le message. Pour ajouter un fond musical : `/media-use` (bgm) puis un `<audio id>` dans `index.html`.
- Couleurs du produit uniquement ; aucun logo, sceau ni charte de la BCC ; mention d'indépendance sur la carte de fin.

## Mesuré / regardé
- `hyperframes check` : 0 erreur, mise en page et contraste OK (61/61).
- Avertissements gardés volontairement : `film_silent` (voir ci-dessus) ; `line_unread` sur l'option C (mauvaise réponse
  grisée, pas destinée à être lue entièrement).
- Planches de revue, image 0 (vignette lisible) et 3 images du MP4 final regardées. Le son n'a pas été vérifié (il n'y en a pas).

## Point faible
- Le curseur masque quelques caractères de l'option B au moment du clic ; avec plus de temps : le poser sur la lettre B.
- La 5ᵉ barre → logo est un « transport » simple (pas de morph de forme).
