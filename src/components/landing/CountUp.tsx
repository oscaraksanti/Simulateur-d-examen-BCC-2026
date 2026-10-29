'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Nombre qui s'incrémente à l'entrée dans l'écran (valeur finale lisible par les lecteurs d'écran). */
export function CountUp({ valeur, suffixe = '' }: { valeur: number; suffixe?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const reduit = useReducedMotion();
  const [affiche, setAffiche] = useState(0);

  useEffect(() => {
    if (!visible || reduit) return;
    const c = animate(0, valeur, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setAffiche(Math.round(v)) });
    return () => c.stop();
  }, [visible, valeur, reduit]);

  const n = reduit ? valeur : affiche;
  return (
    <span ref={ref} className="tabular">
      <span aria-hidden>{n.toLocaleString('fr-FR')}{suffixe}</span>
      <span className="sr-only">{valeur.toLocaleString('fr-FR')}{suffixe}</span>
    </span>
  );
}
