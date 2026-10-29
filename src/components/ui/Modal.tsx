'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  ouvert: boolean;
  onFermer: () => void;
  titre: string;
  children: ReactNode;
  actions?: ReactNode;
}

/** Boîte de dialogue accessible : focus piégé, Échap pour fermer, retour du focus. */
export function Modal({ ouvert, onFermer, titre, children, actions }: ModalProps) {
  const idTitre = useId();
  const panneau = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();

  useEffect(() => {
    if (!ouvert) return;
    const precedent = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panneau.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'));
    const t = window.setTimeout(() => focusables()[0]?.focus(), 30);
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onFermer();
      }
      if (e.key === 'Tab') {
        const els = focusables();
        if (els.length === 0) return;
        const premier = els[0];
        const dernier = els[els.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };
    document.addEventListener('keydown', surTouche);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', surTouche);
      document.body.style.overflow = overflow;
      precedent?.focus();
    };
  }, [ouvert, onFermer]);

  return (
    <AnimatePresence>
      {ouvert ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-[#07111f]/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFermer}
          />
          <motion.div
            ref={panneau}
            role="dialog"
            aria-modal="true"
            aria-labelledby={idTitre}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-lift"
            initial={reduit ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduit ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h2 id={idTitre} className="text-lg font-semibold text-ink">
                {titre}
              </h2>
              <button
                type="button"
                onClick={onFermer}
                className="-m-1 rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink"
                aria-label="Fermer"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="text-[15px] leading-relaxed text-muted">{children}</div>
            {actions ? <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{actions}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
