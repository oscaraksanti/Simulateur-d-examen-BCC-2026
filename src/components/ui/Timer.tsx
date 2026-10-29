'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  /** Échéance (timestamp en ms). */
  fin: number;
  /** Appelé une seule fois quand le temps est écoulé. */
  onExpire: () => void;
  libelle?: string;
}

export function formatDuree(totalSecondes: number): string {
  const s = Math.max(0, Math.floor(totalSecondes));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function Timer({ fin, onExpire, libelle = 'Temps restant' }: TimerProps) {
  const [restant, setRestant] = useState<number | null>(null);
  const expire = useRef(false);
  const rappel = useRef(onExpire);

  useEffect(() => {
    rappel.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const tic = () => {
      const r = Math.max(0, Math.round((fin - Date.now()) / 1000));
      setRestant(r);
      if (r <= 0 && !expire.current) {
        expire.current = true;
        rappel.current();
      }
    };
    const id = window.setInterval(tic, 1000);
    const premier = window.setTimeout(tic, 0);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(premier);
    };
  }, [fin]);

  const critique = restant !== null && restant < 5 * 60;
  const minutes = restant === null ? null : Math.ceil(restant / 60);
  // Annonce vocale seulement aux paliers (évite de saturer les lecteurs d'écran).
  const annonce =
    minutes !== null && (minutes === 10 || minutes === 5 || minutes === 1) && restant !== null && restant % 60 === 0
      ? `Il reste ${minutes} minute${minutes > 1 ? 's' : ''}.`
      : '';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-[15px] font-semibold tabular transition-colors ${
        critique ? 'border-danger bg-danger-soft text-danger' : 'border-border bg-surface text-ink'
      }`}
    >
      <Clock aria-hidden className={`size-4 ${critique ? 'animate-pulse' : 'text-muted'}`} />
      <span className="sr-only">{libelle} :</span>
      <time aria-hidden>{restant === null ? '--:--' : formatDuree(restant)}</time>
      <span className="sr-only" aria-live="polite">
        {annonce}
      </span>
    </div>
  );
}
