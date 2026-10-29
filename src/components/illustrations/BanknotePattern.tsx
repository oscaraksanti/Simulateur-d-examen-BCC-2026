// Motif guilloché abstrait (lignes sinusoïdales fines), façon sécurité de billet — création originale.

const LARGEUR = 1200;
const HAUTEUR = 600;

function vague(decalage: number, amplitude: number, frequence: number, phase: number): string {
  const pas = 12;
  let d = '';
  for (let x = 0; x <= LARGEUR; x += pas) {
    const y =
      decalage +
      amplitude * Math.sin((x / LARGEUR) * Math.PI * 2 * frequence + phase) +
      (amplitude / 3) * Math.sin((x / LARGEUR) * Math.PI * 2 * frequence * 3.1 + phase * 1.7);
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
}

// Calcul effectué une seule fois au chargement du module (déterministe → rendu statique identique).
const lignes = Array.from({ length: 38 }, (_, i) => vague(20 + i * 15.5, 26 + (i % 5) * 4, 2 + (i % 3) * 0.5, i * 0.42));
const rosaces = Array.from({ length: 24 }, (_, i) => {
  const r = 70 + (i % 6) * 9;
  const angle = (i / 24) * Math.PI * 2;
  return { cx: 980 + Math.cos(angle) * 22, cy: 150 + Math.sin(angle) * 22, r };
});

export function BanknotePattern({ className = '', opacite = 0.06 }: { className?: string; opacite?: number }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: opacite }}
    >
      <g fill="none" stroke="var(--primary)" strokeWidth="1">
        {lignes.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill="none" stroke="var(--ink)" strokeWidth="0.8">
        {rosaces.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
      </g>
    </svg>
  );
}
