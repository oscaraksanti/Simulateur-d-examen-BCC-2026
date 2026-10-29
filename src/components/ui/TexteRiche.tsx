import { Fragment } from 'react';

/** Rend un texte en transformant les segments `entre accents graves` en code inline. */
export function TexteRiche({ texte }: { texte: string }) {
  const morceaux = texte.split(/`([^`]+)`/g);
  if (morceaux.length === 1) return <>{texte}</>;
  return (
    <>
      {morceaux.map((m, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-primary-strong">
            {m}
          </code>
        ) : (
          <Fragment key={i}>{m}</Fragment>
        ),
      )}
    </>
  );
}
