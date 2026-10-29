// Grille « bento » des fonctionnalités : chaque tuile montre un fragment réel de l'interface.

import { Reveal } from '@/components/ui/Reveal';

function Tuile({ titre, texte, children, className = '', sombre = false, delai = 0 }: {
  titre: string;
  texte: string;
  children: React.ReactNode;
  className?: string;
  sombre?: boolean;
  delai?: number;
}) {
  return (
    <Reveal delai={delai} className={className}>
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-3xl border transition-shadow duration-300 hover:shadow-lift ${
          sombre ? 'border-transparent bg-[#0b1220] text-white' : 'border-border bg-surface'
        }`}
      >
        <div className="p-6 pb-0 sm:p-8 sm:pb-0">
          <h3 className={`text-lg font-semibold tracking-[-0.02em] ${sombre ? 'text-white' : 'text-ink'}`}>{titre}</h3>
          <p className={`mt-1.5 max-w-md text-[15px] leading-relaxed ${sombre ? 'text-white/60' : 'text-muted'}`}>{texte}</p>
        </div>
        <div className="relative mt-6 flex-1 px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>
      </article>
    </Reveal>
  );
}

function ApercuCorrection() {
  return (
    <div className="space-y-2.5 rounded-2xl border border-border bg-surface-2/60 p-4 text-[13px] transition-transform duration-500 group-hover:-translate-y-1">
      <p className="font-semibold text-success-ink">✓ Réponse attendue : B — médiane = 42</p>
      <p className="leading-relaxed text-ink/80">La valeur 610 tire la moyenne vers le haut ; la médiane décrit mieux le montant typique.</p>
      <div className="space-y-1.5 border-t border-border pt-2.5">
        {[
          ['A', 'La moyenne est sensible aux valeurs extrêmes.'],
          ['C', 'La liste n’était pas triée : 40 n’est pas le milieu.'],
          ['D', 'On ne supprime jamais une donnée sans l’investiguer.'],
        ].map(([l, t]) => (
          <p key={l} className="flex gap-2 text-muted">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-[10px] font-bold">{l}</span>
            {t}
          </p>
        ))}
      </div>
      <p className="rounded-lg bg-accent-soft px-3 py-2 text-ink">
        <strong>À retenir :</strong> distribution asymétrique ⇒ médiane.
      </p>
    </div>
  );
}

function ApercuLogs() {
  const lignes = [
    ['203.0.113.24', '/virements', '503'],
    ['198.51.100.7', '/login', '503'],
    ['203.0.113.91', '/login', '503'],
    ['192.0.2.15', '/accueil', '200'],
    ['198.51.100.33', '/login', '503'],
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] leading-[1.9] transition-transform duration-500 group-hover:-translate-y-1">
      {lignes.map(([ip, req, code], i) => (
        <p key={i} className="flex gap-2 whitespace-nowrap">
          <span className="hidden text-white/30 xl:inline">09:05:0{i}</span>
          <span className="rounded bg-[#4c9dff]/15 px-1 text-[#8cc2ff]">{ip}</span>
          <span className="truncate text-white/70">{req}</span>
          <span className={`ml-auto rounded px-1 ${code === '503' ? 'bg-[#ff5a67]/15 text-[#ff8a93]' : 'bg-[#34d399]/15 text-[#6ee7b7]'}`}>{code}</span>
        </p>
      ))}
    </div>
  );
}

function ApercuRadar() {
  const valeurs = [0.85, 0.6, 0.9, 0.45, 0.7, 0.8];
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i / valeurs.length) * Math.PI * 2;
    return `${60 + Math.cos(a) * r},${60 + Math.sin(a) * r}`;
  };
  return (
    <svg viewBox="0 0 120 120" className="mx-auto h-36 w-36 transition-transform duration-700 group-hover:rotate-6">
      {[0.33, 0.66, 1].map((k) => (
        <polygon key={k} points={valeurs.map((_, i) => pt(i, 48 * k)).join(' ')} fill="none" stroke="var(--border)" />
      ))}
      <polygon points={valeurs.map((v, i) => pt(i, 48 * v)).join(' ')} fill="var(--primary)" fillOpacity="0.18" stroke="var(--primary-strong)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ApercuProgression() {
  const notes = [9, 10.5, 12, 13.5, 14.5];
  return (
    <div className="flex h-40 items-end gap-3 border-b border-border">
      {notes.map((n, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
          <span className="font-mono text-[11px] font-semibold text-ink tabular">{String(n).replace('.', ',')}</span>
          <div
            className={`w-full rounded-t-md transition-transform duration-700 group-hover:scale-y-105 origin-bottom ${i === notes.length - 1 ? 'bg-ink' : 'bg-ink/15'}`}
            style={{ height: `${Math.round((n / 20) * 112)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export function Bento({ nbQuestions }: { nbQuestions: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Tuile
        className="md:col-span-2"
        titre="Une correction qui explique vraiment"
        texte="Pour chaque question : pourquoi la bonne réponse est juste, pourquoi chacune des autres est fausse, et l’idée à retenir."
      >
        <ApercuCorrection />
      </Tuile>
      <Tuile sombre delai={0.05} titre="Cas pratiques en salle de crise" texte="Logs réels, tableaux à trier, décisions sous pression. Comme au bureau.">
        <ApercuLogs />
      </Tuile>
      <Tuile delai={0.05} titre="Jamais deux fois le même examen" texte="Chaque tirage privilégie les questions que tu n’as pas encore vues.">
        <p className="text-7xl font-semibold tracking-[-0.05em] text-ink tabular">{nbQuestions}</p>
        <p className="mt-1 text-sm text-muted">questions originales, corrigées et sourcées</p>
      </Tuile>
      <Tuile delai={0.1} titre="Ton radar de compétences" texte="Repère en un coup d’œil ce qu’il faut réviser en priorité.">
        <ApercuRadar />
      </Tuile>
      <Tuile delai={0.15} titre="5 simulations pour être prêt" texte="Ta courbe de progression, simulation après simulation, jusqu’au jour J.">
        <ApercuProgression />
      </Tuile>
    </div>
  );
}
