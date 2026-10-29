'use client';

import { useId, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { OSCAR } from '@/data/resources';
import { envoyerAvis, syncConfiguree } from '@/lib/remote';
import { CLES, ecrire } from '@/lib/storage';

export const SOUHAITS = [
  'Plus de questions',
  'Questions par compétence',
  'Examen long (60 questions)',
  'Vidéos explicatives',
  'Préparation à l’entretien',
  'Classement entre candidats',
  'Application mobile',
  'Mode hors ligne',
  'Autres filières IT',
] as const;

const LIBELLES_NOTE = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'];

/** Formulaire d'avis : note, fonctionnalités souhaitées, message libre. */
export function AvisForm({ contexte, compact = false }: { contexte: string; compact?: boolean }) {
  const { etat } = useExam();
  const id = useId();
  const reduit = useReducedMotion();
  const [note, setNote] = useState<number | null>(null);
  const [survol, setSurvol] = useState<number | null>(null);
  const [souhaits, setSouhaits] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const enLigne = syncConfiguree();

  const vide = note === null && souhaits.length === 0 && message.trim() === '';

  const texteWhatsApp = () =>
    [
      'Avis sur le Simulateur BCC :',
      note ? `Note : ${note}/5` : '',
      souhaits.length ? `J’aimerais : ${souhaits.join(', ')}` : '',
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n');

  const soumettre = (e: FormEvent) => {
    e.preventDefault();
    if (vide) return;
    if (enLigne) {
      envoyerAvis({
        p_candidat_id: etat.candidat?.id ?? null,
        p_note: note,
        p_souhaits: souhaits,
        p_message: message.trim() || null,
        p_contexte: contexte,
      });
    } else {
      window.open(`https://wa.me/${OSCAR.whatsappNumero}?text=${encodeURIComponent(texteWhatsApp())}`, '_blank', 'noopener,noreferrer');
    }
    ecrire(CLES.avisEnvoye, new Date().toISOString());
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <motion.div
        initial={reduit ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-6 text-center"
        role="status"
      >
        <CheckCircle2 aria-hidden className="size-10 text-success" />
        <p className="mt-3 text-lg font-semibold text-ink">Merci pour ton avis</p>
        <p className="mt-1 max-w-sm text-sm text-muted">Chaque retour est lu et guide les prochaines évolutions du simulateur.</p>
      </motion.div>
    );
  }

  const affichee = survol ?? note ?? 0;

  return (
    <form onSubmit={soumettre} className="space-y-6">
      <fieldset>
        <legend className={`font-semibold text-ink ${compact ? 'text-sm' : 'text-[15px]'}`}>Comment trouves-tu le simulateur ?</legend>
        <div className="mt-3 flex items-center gap-3">
          <div role="radiogroup" aria-label="Note sur 5" className="flex gap-1" onMouseLeave={() => setSurvol(null)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={note === n}
                aria-label={`${n} sur 5 — ${LIBELLES_NOTE[n]}`}
                onClick={() => setNote(n)}
                onMouseEnter={() => setSurvol(n)}
                className="rounded-lg p-1 transition hover:scale-110"
              >
                <Star aria-hidden className={`size-7 transition-colors ${n <= affichee ? 'fill-accent text-accent' : 'text-border'}`} strokeWidth={1.5} />
              </button>
            ))}
          </div>
          <span className="text-sm text-muted" aria-live="polite">{affichee ? LIBELLES_NOTE[affichee] : ''}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className={`font-semibold text-ink ${compact ? 'text-sm' : 'text-[15px]'}`}>Qu&apos;est-ce qui t&apos;aiderait le plus ?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SOUHAITS.map((s) => {
            const actif = souhaits.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={actif}
                onClick={() => setSouhaits(actif ? souhaits.filter((x) => x !== s) : [...souhaits, s])}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                  actif ? 'border-ink bg-ink text-bg' : 'border-border bg-surface text-muted hover:border-ink/40 hover:text-ink'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-msg`} className={`font-semibold text-ink ${compact ? 'text-sm' : 'text-[15px]'}`}>
          Un message, une idée, une erreur repérée ?
        </label>
        <textarea
          id={`${id}-msg`}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
          rows={compact ? 3 : 4}
          placeholder="Ex. : la question sur les fonctions de fenêtre m’a beaucoup aidé, j’aimerais plus de cas pratiques cyber…"
          className="mt-2 block w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/60 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/5"
        />
        <p className="mt-1 text-right font-mono text-xs text-muted">{message.length}/2000</p>
      </div>

      <button
        type="submit"
        disabled={vide}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-bg transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {enLigne ? 'Envoyer mon avis' : (<><MessageCircle aria-hidden className="size-4" /> Envoyer par WhatsApp</>)}
      </button>
    </form>
  );
}
