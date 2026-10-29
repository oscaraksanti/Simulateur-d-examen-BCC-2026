'use client';

// Réglages e-mail de l'administrateur : la clé Resend est envoyée directement à Vault
// (fonction sbcc_admin_definir_cle_resend) et n'est jamais relue ni affichée.

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, KeyRound, Mail, Send } from 'lucide-react';
import { clientSupabase } from '@/lib/remote';

interface ConfigEmail {
  cle_configuree: boolean;
  expediteur: string;
  repondre_a: string;
  site: string;
  admin_email: string | null;
}

interface DernierTest {
  statut: string;
  code_http: number | null;
}

export function ReglagesEmail({ onChange }: { onChange: () => void }) {
  const [config, setConfig] = useState<ConfigEmail | null>(null);
  const [cle, setCle] = useState('');
  const [message, setMessage] = useState<{ ton: 'ok' | 'erreur' | 'info'; texte: string } | null>(null);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const supabase = await clientSupabase();
    const { data } = await supabase.rpc('sbcc_admin_config_email');
    setConfig((data as ConfigEmail | null) ?? null);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(id);
  }, [charger]);

  const enregistrer = async (e: FormEvent) => {
    e.preventDefault();
    setOccupe(true);
    setMessage(null);
    const supabase = await clientSupabase();
    const { error } = await supabase.rpc('sbcc_admin_definir_cle_resend', { p_cle: cle.trim() });
    setCle('');
    setOccupe(false);
    if (error) {
      setMessage({ ton: 'erreur', texte: error.message.includes('invalide') ? 'Clé invalide : une clé Resend commence par « re_ ».' : 'Enregistrement impossible.' });
      return;
    }
    setMessage({ ton: 'ok', texte: 'Clé enregistrée dans le coffre-fort Supabase. Envoie un e-mail de test pour vérifier.' });
    void charger();
  };

  const tester = async () => {
    setOccupe(true);
    setMessage({ ton: 'info', texte: 'Envoi en cours…' });
    const supabase = await clientSupabase();
    const { data, error } = await supabase.rpc('sbcc_admin_email_test');
    if (error) {
      setOccupe(false);
      setMessage({ ton: 'erreur', texte: error.message });
      return;
    }
    const destinataire = (data as { destinataire?: string } | null)?.destinataire ?? 'ton adresse';
    // Resend répond en quelques secondes ; on relit le journal pour afficher sa réponse.
    let dernier: DernierTest | null = null;
    for (let i = 0; i < 6 && (!dernier || dernier.code_http === null); i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const { data: journal } = await supabase.rpc('sbcc_admin_emails', { p_limite: 5 });
      const lignes = (journal as (DernierTest & { type: string })[] | null) ?? [];
      dernier = lignes.find((l) => l.type === 'test') ?? null;
    }
    setOccupe(false);
    onChange();
    if (!dernier) setMessage({ ton: 'erreur', texte: 'Aucune trace de l’envoi.' });
    else if (dernier.statut === 'cle_absente') setMessage({ ton: 'erreur', texte: 'Aucune clé Resend enregistrée.' });
    else if (dernier.code_http !== null && dernier.code_http < 300)
      setMessage({ ton: 'ok', texte: `E-mail de test accepté par Resend et envoyé à ${destinataire}. Vérifie ta boîte de réception.` });
    else if (dernier.code_http !== null)
      setMessage({
        ton: 'erreur',
        texte: `Resend a refusé l’envoi (code ${dernier.code_http}). Vérifie la clé et que le domaine de l’expéditeur est validé dans Resend.`,
      });
    else setMessage({ ton: 'info', texte: `Envoi demandé à ${destinataire}. Réponse de Resend en attente : actualise dans un instant.` });
  };

  if (!config) return <div className="h-40 animate-pulse rounded-2xl bg-surface-2" aria-busy="true" aria-label="Chargement des réglages e-mail" />;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6" aria-labelledby="reglages-email">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="reglages-email" className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <Mail aria-hidden className="size-4 text-muted" /> E-mails automatiques
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            config.cle_configuree ? 'bg-success-soft text-success-ink' : 'bg-accent-soft text-ink'
          }`}
        >
          {config.cle_configuree ? <CheckCircle2 aria-hidden className="size-3.5" /> : <KeyRound aria-hidden className="size-3.5" />}
          {config.cle_configuree ? 'Clé Resend configurée' : 'Clé Resend manquante'}
        </span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-muted">Expéditeur</dt><dd className="font-medium text-ink">{config.expediteur}</dd></div>
        <div><dt className="text-muted">Réponses vers</dt><dd className="font-medium text-ink">{config.repondre_a}</dd></div>
      </dl>
      <form onSubmit={enregistrer} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Clé API Resend</span>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={cle}
            onChange={(e) => setCle(e.target.value)}
            placeholder={config.cle_configuree ? 'Remplacer la clé (re_…)' : 'Colle ta clé Resend (re_…)'}
            className="h-10 w-full rounded-xl border border-border bg-surface px-3.5 font-mono text-sm outline-none focus:border-ink focus:ring-4 focus:ring-ink/5"
          />
        </label>
        <button type="submit" disabled={occupe || cle.trim().length < 10} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-bg disabled:opacity-40">
          <KeyRound aria-hidden className="size-4" /> Enregistrer
        </button>
        <button type="button" onClick={() => void tester()} disabled={occupe || !config.cle_configuree} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-ink hover:border-ink/30 disabled:opacity-40">
          <Send aria-hidden className="size-4" /> E-mail de test
        </button>
      </form>
      <p className="mt-2 text-xs text-muted">
        La clé va directement dans le coffre-fort chiffré de Supabase (Vault) ; elle n&apos;est jamais réaffichée. Le test part
        vers {config.admin_email ?? 'ton adresse'}.
      </p>
      {message ? (
        <p
          role={message.ton === 'erreur' ? 'alert' : 'status'}
          className={`mt-3 rounded-xl px-3.5 py-2.5 text-sm ${
            message.ton === 'ok' ? 'bg-success-soft text-success-ink' : message.ton === 'erreur' ? 'bg-danger-soft text-danger' : 'bg-surface-2 text-ink'
          }`}
        >
          {message.texte}
        </p>
      ) : null}
    </section>
  );
}
