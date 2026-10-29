'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

type TonToast = 'succes' | 'info' | 'erreur';
interface ToastItem {
  id: number;
  message: string;
  ton: TonToast;
}

const ToastContext = createContext<(message: string, ton?: TonToast) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const compteur = useRef(0);

  const afficher = useCallback((message: string, ton: TonToast = 'succes') => {
    compteur.current += 1;
    const id = compteur.current;
    setToasts((t) => [...t, { id, message, ton }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const valeur = useMemo(() => afficher, [afficher]);

  return (
    <ToastContext.Provider value={valeur}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-ink shadow-lift"
            >
              {t.ton === 'succes' ? (
                <CheckCircle2 aria-hidden className="size-5 shrink-0 text-success" />
              ) : t.ton === 'erreur' ? (
                <AlertTriangle aria-hidden className="size-5 shrink-0 text-danger" />
              ) : (
                <Info aria-hidden className="size-5 shrink-0 text-primary" />
              )}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
