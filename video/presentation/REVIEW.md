# REVIEW — Présentation du Simulateur BCC (16:9 et 9:16)

## Structure
- `film/` : projet 16:9 (1920×1080). Les 11 scènes sont dans `film/compositions/` (source unique).
- `film-9x16/` : projet 9:16 généré (scènes copiées en 1080×1920 ; leurs règles `@media (max-aspect-ratio: 1/1)` recomposent la mise en page).
- `film/outils/caler.mjs` : calage sur la voix. `guide` = voix de synthèse temporaire ; `voix <fichier>` = vraie voix
  (normalisation −16 LUFS, détection des pauses, regroupement optimal en 14 phrases) ; `appliquer` = régénère les deux racines
  (scènes, voix, effets sonores) à partir de `outils/calage.json`.
- Script : `SCRIPT-VOIX-OFF.md` / `film/outils/segments.json`.

## Choix créatifs
- Storyline : « Un seul essai » → le compteur roule de 1 à 5 → démonstration du vrai produit en 4 temps (filière, examen
  chronométré, cas pratiques en salle de crise, note + explication + radar) → « 5× avant le jour J » → « Plein succès » +
  partage à un ami → carte de fin (logo, adresse, mention d'indépendance).
- Mondes : clair (produit), sombre (cas pratiques), bleu (déclic « 5× »), blanc (fin). Transitions : zoom à travers le chiffre,
  glissés flous, coupe avec assombrissement, inondation de couleur, échange flou.
- Interface : composants réels du simulateur reconstruits (vraies questions DATA-SQL-001, BCC-001, LOG-SUI-002, vrais logs
  CYB-CAS-01, vraies transactions DATA-CAS-01), + capture réelle de la page d'accueil.
- Son : voix off + effets (clic, whoosh, pop, riser, impact, scintillement), chacun causé par une action à l'écran.
  Pas de musique : aucune source disponible sans compte HeyGen (voir « Pistes »).

## Mesuré / regardé
- `hyperframes check` : 0 erreur sur les deux formats.
- Avertissements gardés : `line_unread` sur le montage rapide des 3 questions de l'examen (volontaire : on montre la
  variété, pas une lecture) ; `text_below_floor` sur quelques libellés secondaires (26 px).
- Planches de revue regardées pour les deux formats ; corrections faites (capture d'écran agrandie, cartes « filière »
  agrandies, trou entre radar et questions supprimé, fenêtre de discussion resserrée, mises en page 9:16).
- Loudness de l'aperçu : −17,3 LUFS intégrés (mesuré, pas écouté).

## Point faible / pistes
- Musique d'ambiance : à ajouter (piste libre de droits fournie, ou catalogue HeyGen) sous la voix à ~0,14.
- Sous-titres incrustés pour la version 9:16 (lecture sans le son) : possibles après transcription de la vraie voix.
