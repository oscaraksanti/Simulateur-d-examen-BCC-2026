// Génère public/og-image.png (1200×630) au prebuild : titre + motif guilloché, SANS logo BCC.
// Satori (JSX → SVG) + resvg (SVG → PNG), police Inter locale (aucun appel réseau).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const racine = process.cwd();
const sortie = join(racine, 'public', 'og-image.png');
const police = (poids: number) =>
  readFileSync(join(racine, 'node_modules', '@fontsource', 'inter', 'files', `inter-latin-${poids}-normal.woff`));

type Noeud = { type: string; props: Record<string, unknown> & { children?: Noeud | string | (Noeud | string)[] } };
const h = (type: string, props: Record<string, unknown>, ...children: (Noeud | string)[]): Noeud => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});

function guilloche(): string {
  let chemins = '';
  for (let i = 0; i < 22; i++) {
    let d = '';
    for (let x = 0; x <= 1200; x += 15) {
      const y = 20 + i * 30 + 22 * Math.sin((x / 1200) * Math.PI * 4 + i * 0.45) + 7 * Math.sin((x / 1200) * Math.PI * 12 + i);
      d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
    }
    chemins += `<path d="${d}" fill="none" stroke="#3D9BFF" stroke-width="1.4"/>`;
  }
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${chemins}</svg>`,
  ).toString('base64')}`;
}

async function main() {
  const arbre = h(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        padding: '70px 80px',
        background: 'linear-gradient(135deg, #07111F 0%, #0E2440 100%)',
        color: '#E8EEF7',
        fontFamily: 'Inter',
        position: 'relative',
      },
    },
    h('img', { src: guilloche(), width: 1200, height: 630, style: { position: 'absolute', top: 0, left: 0, opacity: 0.12 } }),
    h(
      'div',
      { style: { position: 'absolute', top: 0, left: 0, width: 1200, height: 12, display: 'flex' } },
      h('div', { style: { width: 720, height: 12, background: '#3D9BFF' } }),
      h('div', { style: { width: 180, height: 12, background: '#F7C600' } }),
      h('div', { style: { width: 300, height: 12, background: '#CE1021' } }),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 1040, height: 490 } },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      h('div', { style: { display: 'flex', padding: '8px 18px', borderRadius: 999, background: '#F7C600', color: '#0B1B33', fontSize: 24, fontWeight: 800 } }, 'Examen blanc gratuit · 2026'),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h('div', { style: { fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 } }, 'Simulateur BCC'),
      h('div', { style: { fontSize: 46, fontWeight: 700, color: '#3D9BFF', marginTop: 8 } }, 'Prépa informatique · 7 domaines'),
      h(
        'div',
        { style: { fontSize: 28, color: '#9AABC2', marginTop: 24, maxWidth: 900 } },
        'Data, cyber, bases de données, systèmes, réseaux, dev, support IT : QCM corrigés, cas pratiques et culture BCC.',
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', fontSize: 22, color: '#9AABC2' } },
      'Un outil Datalendo · indépendant, non affilié à la Banque Centrale du Congo.',
    ),
    ),
  );

  const svg = await satori(arbre as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: police(400), weight: 400, style: 'normal' },
      { name: 'Inter', data: police(700), weight: 700, style: 'normal' },
      { name: 'Inter', data: police(800), weight: 800, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(sortie, png);
  console.log(`✓ og-image.png généré (${Math.round(png.length / 1024)} Ko)`);
}

main().catch((erreur: unknown) => {
  // Ne bloque pas le build si une image existe déjà (ex. environnement sans binaire resvg).
  console.warn('⚠ Génération de og-image.png impossible :', erreur);
  if (!existsSync(sortie)) process.exit(1);
});
