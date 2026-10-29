# REVIEW — Présentation du Simulateur BCC (16:9 et 9:16)

## Structure
- `film/` : projet 16:9 (1920×1080). Les 11 scènes sont dans `film/compositions/` (source unique).
- `film-9x16/` : projet 9:16 généré (scènes copiées en 1080×1920 ; leurs règles `@media (max-aspect-ratio: 1/1)` recomposent la mise en page).
- `film/outils/caler.mjs` : calage sur la voix et génération des deux racines.
  - `normaliser <fichier>` : voix réelle nettoyée (passe-haut 70 Hz, −16 LUFS, limiteur −2 dBFS, stéréo) → `assets/voix/voix-off.m4a`.
  - `musique <piste.wav>` : lit musical calé (via `outils/musique.py`) → `assets/musique/lit.m4a`.
  - `appliquer` : régénère les deux racines (scènes, voix, musique, effets) depuis `outils/calage.json`.
  - `voix <fichier>` (découpage automatique par silences) et `guide` (voix de synthèse) restent disponibles.
- Script : `SCRIPT-VOIX-OFF.md` / `film/outils/segments.json`.

## Voix off (propriétaire) — calage
- Source : `assets/voix-off/audi_bcc.wav` (54,4 s, gardée en local, ignorée par git).
- Transcription mot à mot : `npx hyperframes transcribe … --engine whisper --model small --language fr --json -d film`
  → `film/transcript.json` (les mots sont parfois mal reconnus, les temps sont bons).
- Les débuts/fins de phrase sont recoupés avec les silences (ffmpeg `silencedetect` −35 dB / 0,25 s) et écrits à la main dans
  `calage.json` ; les mots-clés mesurés vont dans `ancres` (« phrase:mot » → secondes) et priment sur l'estimation proportionnelle.
- Durée du film : 57,04 s (voix jusqu'à 53,7 s + carte de fin).
- Ajustements de scènes pour le débit réel : la note /20 se pose ~0,65 s avant la sortie même quand la phrase est courte
  (`note.html`) ; l'alerte « Fractionnement » reste lisible ~0,7 s et s'ancre au bas du panneau, sous le tableau (`cas.html`).

## Son
- Musique : générée localement avec MusicGen (`facebook/musicgen-small`, piste produite ici, sans échantillon tiers).
  ⚠️ Les poids du modèle sont sous licence CC-BY-NC 4.0 : sans souci pour la promotion d'un outil gratuit, mais pour une
  campagne publicitaire payante, remplacer par une piste sous licence commerciale (même commande `musique`). Six essais (cinématique électro, afro house, piano), classés par netteté
  rythmique, stabilité et bruit ; retenue : **afro house minimale** (marimba, basse ronde, 111 BPM) — groove net qui laisse
  la place à la voix. Source : `assets/musique-sources/afro-1.wav`.
- Arc musical (`outils/musique.py`) : boucle d'un nombre entier de mesures (fondus à puissance constante) ; accroche
  étouffée (passe-bas 380 Hz) qui monte doucement → **ouverture franche sur « Voici le Simulateur BCC »** → lit ~13 dB sous la
  voix → silence sous le riser → reprise derrière l'impact de « Passe-le cinq fois » → la musique remonte quand la voix se tait,
  puis s'éteint sur la carte de fin.
- 17 effets, chacun causé par l'image : impact grave d'ouverture, roulement du compteur, traversée du chiffre
  (whoosh cinématique), clics des trois onglets, clic de filière, whoosh vers la salle de crise, frappe clavier des logs,
  alerte, carillon de la note, cartes, riser + impact, clic + notification WhatsApp, scintillement final.
  Sons Pixabay (licence Pixabay, sans attribution obligatoire). Les sons longs démarrent près de leur crête (`data-media-start`).
- Mixage mesuré (mixage hors ligne qui imite la frise) : **−16,1 LUFS intégrés, crête −1,5 dBFS**, LRA 2,8 LU.

## Mesuré / regardé
- `hyperframes check` : 0 erreur sur les deux formats (corrigé : chevauchement alerte/tableau en 9:16).
- Avertissements gardés : `line_unread` sur le montage rapide des 3 questions de l'examen (volontaire : on montre la
  variété, pas une lecture) ; `text_below_floor` sur quelques libellés secondaires (26 px).
- Images regardées aux instants retouchés (alerte des cas pratiques, note /20) dans les deux formats.

## Point faible / pistes
- Musique MusicGen « small » : correcte en lit sous la voix, pas au niveau d'une production studio. Pour mieux : connecter
  HeyGen (`heygen auth login --oauth`) et relancer `musique` avec une piste du catalogue, ou fournir une piste libre de droits.
- Sous-titres incrustés pour la version 9:16 (lecture sans le son) : possibles à partir de `film/transcript.json` + script.
