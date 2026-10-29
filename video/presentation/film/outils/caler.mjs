#!/usr/bin/env node
// Calage du film sur la voix off.
//
//   node outils/caler.mjs guide                 → voix guide (say, Thomas) + calage
//   node outils/caler.mjs voix <fichier-audio>  → vraie voix : détection des silences, regroupement en phrases
//   node outils/caler.mjs appliquer             → (ré)génère index.html (16:9) et portrait.html (9:16) depuis calage.json
//
// Le calage associe chaque phrase de segments.json à [début, fin] en secondes dans assets/voix/voix-off.m4a.
// Les scènes reçoivent leurs repères internes (mots-clés) via data-variable-values.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = new URL('..', import.meta.url).pathname;
const SEGMENTS = JSON.parse(readFileSync(join(RACINE, 'outils/segments.json'), 'utf8'));
const CALAGE = join(RACINE, 'outils/calage.json');
const VOIX = join(RACINE, 'assets/voix/voix-off.m4a');
const TMP = join(RACINE, 'outils/.tmp');

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const duree = (f) => Number(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).trim());

// ---------------------------------------------------------------------------
// 1. Voix guide (temporaire) : une phrase = un fichier, puis concaténation avec des silences connus.
// ---------------------------------------------------------------------------
function guide() {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  const PAUSE = 0.38;
  const morceaux = [];
  const calage = [];
  let t = 0.25;
  sh('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(PAUSE), join(TMP, 'pause.wav')]);
  sh('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '0.25', join(TMP, 'debut.wav')]);
  morceaux.push(join(TMP, 'debut.wav'));
  SEGMENTS.forEach((s, i) => {
    const aiff = join(TMP, `${i}.aiff`);
    const wav = join(TMP, `${i}.wav`);
    sh('say', ['-v', 'Thomas', '-r', '178', '-o', aiff, s.texte.replace(/…/g, ', ')]);
    sh('ffmpeg', ['-y', '-i', aiff, '-ar', '44100', '-ac', '1', wav]);
    const d = duree(wav);
    calage.push({ id: s.id, debut: round(t), fin: round(t + d) });
    t += d + PAUSE;
    morceaux.push(wav, join(TMP, 'pause.wav'));
  });
  ecrireVoix(morceaux);
  sauver(calage, 'guide (say Thomas)');
}

// ---------------------------------------------------------------------------
// 2. Vraie voix : silences → zones de parole → regroupement optimal en N phrases.
// ---------------------------------------------------------------------------
function voix(fichier) {
  if (!fichier || !existsSync(fichier)) throw new Error(`Fichier introuvable : ${fichier}`);
  mkdirSync(join(RACINE, 'assets/voix'), { recursive: true });
  // Nettoyage léger : passe-haut, normalisation à −16 LUFS (réseaux sociaux), mono 48 kHz.
  sh('ffmpeg', ['-y', '-i', fichier, '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '1', '-c:a', 'aac', '-b:a', '160k', VOIX]);
  const total = duree(VOIX);
  const stderr = execFileSync('sh', ['-c', `ffmpeg -i "${VOIX}" -af silencedetect=noise=-38dB:d=0.28 -f null - 2>&1`], { encoding: 'utf8' });
  const debuts = [...stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const fins = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  // Zones de parole = complément des silences.
  const zones = [];
  let curseur = 0;
  debuts.forEach((d, i) => {
    if (d - curseur > 0.12) zones.push([curseur, d]);
    curseur = fins[i] ?? total;
  });
  if (total - curseur > 0.12) zones.push([curseur, total]);
  const N = SEGMENTS.length;
  if (zones.length < N) throw new Error(`Seulement ${zones.length} blocs de parole détectés pour ${N} phrases : marque des pauses plus nettes entre les phrases.`);
  // Programmation dynamique : regrouper les zones consécutives en N phrases dont la durée colle au poids attendu (nb de caractères).
  const poids = SEGMENTS.map((s) => s.texte.replace(/[^\p{L}\p{N}]/gu, '').length);
  const parole = zones.reduce((a, [x, y]) => a + (y - x), 0);
  const total_poids = poids.reduce((a, b) => a + b, 0);
  const attendu = poids.map((p) => (p / total_poids) * parole);
  const Z = zones.length;
  const cout = Array.from({ length: N + 1 }, () => Array(Z + 1).fill(Infinity));
  const choix = Array.from({ length: N + 1 }, () => Array(Z + 1).fill(-1));
  cout[0][0] = 0;
  for (let n = 1; n <= N; n++) {
    for (let z = n; z <= Z; z++) {
      let d = 0;
      for (let k = z; k >= n; k--) {
        d += zones[k - 1][1] - zones[k - 1][0];
        const c = cout[n - 1][k - 1] + ((d - attendu[n - 1]) / attendu[n - 1]) ** 2;
        if (c < cout[n][z]) {
          cout[n][z] = c;
          choix[n][z] = k - 1;
        }
      }
    }
  }
  const calage = [];
  let z = Z;
  for (let n = N; n >= 1; n--) {
    const k = choix[n][z];
    calage.unshift({ id: SEGMENTS[n - 1].id, debut: round(zones[k][0]), fin: round(zones[z - 1][1]) });
    z = k;
  }
  sauver(calage, `voix réelle (${fichier})`);
}

function ecrireVoix(morceaux) {
  const liste = join(TMP, 'liste.txt');
  writeFileSync(liste, morceaux.map((m) => `file '${m}'`).join('\n'));
  mkdirSync(join(RACINE, 'assets/voix'), { recursive: true });
  sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', liste, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '1', '-c:a', 'aac', '-b:a', '160k', VOIX]);
}

const round = (x) => Math.round(x * 100) / 100;

function sauver(calage, source) {
  const fin = duree(VOIX);
  writeFileSync(CALAGE, JSON.stringify({ source, dureeVoix: round(fin), segments: calage }, null, 2) + '\n');
  console.log(`calage (${source}) :`);
  for (const s of calage) console.log(`  ${s.id.padEnd(12)} ${String(s.debut).padStart(6)} → ${s.fin}`);
  console.log(`  durée voix : ${round(fin)} s`);
}

// ---------------------------------------------------------------------------
// 3. Génération des deux compositions racines.
// ---------------------------------------------------------------------------
// Instant d'un mot dans une phrase (proportionnel à sa position dans le texte : précis à ~0,2 s).
function mot(seg, texte) {
  const s = SEGMENTS.find((x) => x.id === seg.id);
  const i = s.texte.indexOf(texte);
  if (i < 0) throw new Error(`« ${texte} » absent de ${seg.id}`);
  return round(seg.debut + ((seg.fin - seg.debut) * i) / s.texte.length);
}

function appliquer() {
  const { segments, dureeVoix } = JSON.parse(readFileSync(CALAGE, 'utf8'));
  const S = Object.fromEntries(segments.map((s) => [s.id, s]));
  const FIN = round(Math.max(dureeVoix, S.signature.fin) + 2.6);
  const AVANCE = 0.18; // l'image précède légèrement la voix
  const debutScene = (id) => Math.max(0, round(S[id].debut - AVANCE));

  // Scènes : [id, fichier, début, fin, variables (temps locaux à la scène)]
  const def = [
    ['s-accroche', 'accroche', 0, debutScene('revelation'), (t0) => ({ t_question: round(S.question.debut - t0), t_avant: round(mot(S.question, 'avant') - t0) })],
    ['s-revelation', 'revelation', debutScene('revelation'), debutScene('filiere'), (t0) => ({ t_gratuit: round(mot(S.revelation, 'Gratuit') - t0), t_datalendo: round(mot(S.revelation, 'Datalendo') - t0) })],
    ['s-filiere', 'filiere', debutScene('filiere'), debutScene('examen'), (t0) => ({ t_data: round(mot(S.filiere, 'Data') - t0), t_cyber: round(mot(S.filiere, 'Cybersécurité') - t0) })],
    ['s-examen', 'examen', debutScene('examen'), debutScene('cas'), (t0) => ({ t_technique: round(mot(S.examen, 'technique') - t0), t_culture: round(mot(S.examen, 'culture') - t0), t_logique: round(mot(S.examen, 'logique') - t0) })],
    ['s-cas', 'cas', debutScene('cas'), debutScene('note'), (t0) => ({ t_attaque: round(mot(S.cas, 'une attaque') - t0), t_virements: round(mot(S.cas, 'des virements') - t0) })],
    ['s-note', 'note', debutScene('note'), debutScene('explication'), (t0) => ({ t_vingt: round(mot(S.note, 'note') - t0) })],
    ['s-explication', 'explication', debutScene('explication'), debutScene('radar'), (t0) => ({ t_fausses: round(mot(S.explication, 'et pourquoi') - t0) })],
    ['s-radar', 'radar', debutScene('radar'), debutScene('cinq'), (t0) => ({ t_nouvelles: round(S.nouvelles.debut - t0) })],
    ['s-cinq', 'cinq', debutScene('cinq'), debutScene('succes'), (t0) => ({ t_jour: round(mot(S.cinq, 'Le jour') - t0) })],
    ['s-partage', 'partage', debutScene('succes'), debutScene('signature'), (t0) => ({ t_ami: round(S.partage.debut - t0), t_lien: round(mot(S.partage, 'envoie') - t0), t_ensemble: round(mot(S.partage, 'On réussit') - t0) })],
    ['s-fin', 'fin', debutScene('signature'), FIN, () => ({})],
  ].map(([id, fichier, debut, fin, vars]) => ({ id, fichier, debut, duree: round(fin - debut), vars: { ...vars(debut), t_fin: round(fin - debut) } }));

  // Sons : chaque effet a une cause à l'écran (clic, coupe, note qui tombe…), crête 1 image après l'image.
  const sons = [
    ['sfx-whoosh-1', 'whoosh-short', round(debutScene('revelation') - 0.12), 0.5],
    ['sfx-clic-filiere', 'click', round(def[2].debut + def[2].vars.t_cyber + 0.95), 0.7],
    ['sfx-whoosh-2', 'whoosh', round(debutScene('cas') - 0.1), 0.45],
    ['sfx-pop-note', 'pop', round(def[5].debut + 1.65), 0.6],
    ['sfx-riser', 'riser', round(debutScene('cinq') - 1.1), 0.35],
    ['sfx-impact', 'impact-bass-1', round(debutScene('cinq') + 0.02), 0.55],
    ['sfx-clic-partage', 'click', round(def[9].debut + def[9].vars.t_lien + 0.1), 0.7],
    ['sfx-sparkle', 'sparkle', round(def[10].debut + 0.9), 0.35],
  ];

  const racine = (largeur, hauteur, idComposition, titre) => `<!doctype html>
<!-- FICHIER GÉNÉRÉ par outils/caler.mjs — modifier les scènes dans compositions/ ou le calage, pas ce fichier. -->
<html lang="fr" data-resolution="${largeur > hauteur ? 'landscape' : 'portrait'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${largeur}, height=${hauteur}" />
    <title>${titre}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${largeur}px; height: ${hauteur}px; overflow: hidden; background: #f8f9fb; }
      #root { position: relative; width: 100%; height: 100%; font-family: Inter, sans-serif; }
      #fond { position: absolute; inset: 0; background: #f8f9fb; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${idComposition}" data-start="0" data-duration="${FIN}" data-width="${largeur}" data-height="${hauteur}">
      <div id="fond"></div>
${def
  .map(
    (s) => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.fichier}.html" data-start="${s.debut}" data-duration="${s.duree}" data-track-index="1" data-track-kind="graphics" data-width="${largeur}" data-height="${hauteur}" data-variable-values='${JSON.stringify(s.vars)}'></div>`,
  )
  .join('\n')}
      <audio id="voix-off" src="assets/voix/voix-off.m4a" data-start="0" data-track-index="10" data-volume="1"></audio>
${sons.map(([id, f, t, v], i) => `      <audio id="${id}" src="assets/sfx/${f}.mp3" data-start="${Math.max(0, t)}" data-duration="${round(duree(join(RACINE, `assets/sfx/${f}.mp3`)))}" data-track-index="${11 + i}" data-volume="${v}"></audio>`).join('\n')}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["${idComposition}"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
  writeFileSync(join(RACINE, 'index.html'), racine(1920, 1080, 'main', 'Simulateur BCC — présentation 16:9'));
  // Le 9:16 est un projet frère (une seule racine par projet) qui partage scènes et médias par liens symboliques.
  const PORTRAIT = join(RACINE, '../film-9x16');
  mkdirSync(PORTRAIT, { recursive: true });
  for (const f of ['hyperframes.json', 'package.json']) writeFileSync(join(PORTRAIT, f), readFileSync(join(RACINE, f)));
  writeFileSync(join(PORTRAIT, 'meta.json'), JSON.stringify({ id: 'simulateur-bcc-9x16', name: 'Simulateur BCC — 9:16' }, null, 2) + '\n');
  if (!existsSync(join(PORTRAIT, 'assets'))) execFileSync('ln', ['-s', '../film/assets', join(PORTRAIT, 'assets')]);
  // Les scènes portent leur propre taille : on écrit des copies 1080×1920 (leurs règles « portrait » s'appliquent alors).
  rmSync(join(PORTRAIT, 'compositions'), { recursive: true, force: true });
  mkdirSync(join(PORTRAIT, 'compositions'), { recursive: true });
  for (const f of readdirSync(join(RACINE, 'compositions'))) {
    if (!f.endsWith('.html')) continue;
    const html = readFileSync(join(RACINE, 'compositions', f), 'utf8').replace('data-width="1920" data-height="1080"', 'data-width="1080" data-height="1920"');
    writeFileSync(join(PORTRAIT, 'compositions', f), '<!-- COPIE GÉNÉRÉE (9:16) depuis film/compositions par outils/caler.mjs : ne pas modifier ici. -->\n' + html);
  }
  writeFileSync(join(PORTRAIT, 'index.html'), racine(1080, 1920, 'main', 'Simulateur BCC — présentation 9:16'));
  console.log(`film/index.html (16:9) et film-9x16/index.html (9:16) régénérés — durée ${FIN} s, ${def.length} scènes.`);
}

const [mode, arg] = process.argv.slice(2);
if (mode === 'guide') guide();
else if (mode === 'voix') voix(arg);
else if (mode === 'appliquer') appliquer();
else console.log('usage : node outils/caler.mjs guide | voix <fichier> | appliquer');
