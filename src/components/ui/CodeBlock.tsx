// Bloc de code / log en JetBrains Mono avec coloration légère (sans dépendance).

import type { ReactNode } from 'react';

type Langage = 'sql' | 'python' | 'log' | 'shell' | 'texte';

const MOTS_SQL =
  /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|ON|AS|AND|OR|NOT|NULL|IS|IN|EXISTS|DISTINCT|COUNT|SUM|AVG|MIN|MAX|OVER|PARTITION BY|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|WITH|CASE|WHEN|THEN|ELSE|END|UNION|ALL|LIMIT|BETWEEN|LIKE|INSERT|UPDATE|DELETE|INTO|VALUES|SET|CREATE|TABLE|DESC|ASC|COALESCE|ROWS|PRECEDING|CURRENT ROW|BY)\b/g;
const MOTS_PY = /\b(import|from|as|def|return|for|in|if|elif|else|while|True|False|None|lambda|and|or|not|print|with|class)\b/g;
const IP = /\b(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?\b/g;
const HTTP = /(?<=["\s])([1-5]\d{2})(?=\s)/g;
const NIVEAUX = /\b(ERROR|CRITICAL|ALERT|FAIL(?:ED|URE)?|DENY|DENIED|BLOCK(?:ED)?|WARN(?:ING)?|fail|none)\b/g;

interface Regle {
  re: RegExp;
  classe: (m: string) => string;
}

function regles(langage: Langage): Regle[] {
  switch (langage) {
    case 'sql':
      return [
        { re: /'[^']*'/g, classe: () => 'text-success-ink' },
        { re: /--.*$/gm, classe: () => 'text-muted italic' },
        { re: MOTS_SQL, classe: () => 'font-semibold text-primary-strong' },
      ];
    case 'python':
      return [
        { re: /#.*$/gm, classe: () => 'text-muted italic' },
        { re: /(['"])(?:(?!\1).)*\1/g, classe: () => 'text-success-ink' },
        { re: MOTS_PY, classe: () => 'font-semibold text-primary-strong' },
      ];
    case 'log':
      return [
        { re: IP, classe: () => 'rounded bg-primary-soft px-0.5 text-primary-strong' },
        {
          re: HTTP,
          classe: (m) =>
            m.startsWith('5') || m.startsWith('4')
              ? 'rounded bg-danger-soft px-0.5 font-semibold text-danger'
              : 'rounded bg-success-soft px-0.5 text-success-ink',
        },
        { re: NIVEAUX, classe: () => 'font-semibold text-danger' },
      ];
    case 'shell':
      return [
        { re: /#.*$/gm, classe: () => 'text-muted italic' },
        { re: /(['"])(?:(?!\1).)*\1/g, classe: () => 'text-success-ink' },
        { re: /^\s*(?:\$|PS [^>]*>|C:\\[^>]*>)/gm, classe: () => 'text-muted' },
        { re: /(?<=\s)--?[A-Za-z][\w-]*/g, classe: () => 'text-primary-strong' },
        { re: IP, classe: () => 'rounded bg-primary-soft px-0.5 text-primary-strong' },
      ];
    default:
      return [];
  }
}

/** Découpe une ligne en segments colorés (première règle gagnante, sans chevauchement). */
export function colorer(texte: string, langage: Langage): ReactNode[] {
  const segments: { debut: number; fin: number; classe: string }[] = [];
  for (const { re, classe } of regles(langage)) {
    re.lastIndex = 0;
    for (const m of texte.matchAll(re)) {
      const debut = m.index ?? 0;
      const fin = debut + m[0].length;
      if (m[0].length === 0 || segments.some((s) => debut < s.fin && fin > s.debut)) continue;
      segments.push({ debut, fin, classe: classe(m[0]) });
    }
  }
  segments.sort((a, b) => a.debut - b.debut);
  const sortie: ReactNode[] = [];
  let curseur = 0;
  segments.forEach((s, i) => {
    if (s.debut > curseur) sortie.push(texte.slice(curseur, s.debut));
    sortie.push(
      <span key={i} className={s.classe}>
        {texte.slice(s.debut, s.fin)}
      </span>,
    );
    curseur = s.fin;
  });
  if (curseur < texte.length) sortie.push(texte.slice(curseur));
  return sortie;
}

const libelles: Record<Langage, string> = { sql: 'SQL', python: 'Python', log: 'Logs', shell: 'Terminal', texte: 'Données' };

export function CodeBlock({ langage, contenu, titre }: { langage: Langage; contenu: string; titre?: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden />
        {titre ?? libelles[langage]}
      </figcaption>
      <pre className="code-block scroll-fin text-ink">
        <code>{colorer(contenu.replace(/\n$/, ''), langage)}</code>
      </pre>
    </figure>
  );
}
