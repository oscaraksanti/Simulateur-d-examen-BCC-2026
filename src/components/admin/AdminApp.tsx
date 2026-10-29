'use client';

// Tableau de bord privé : inscriptions, résultats, avis.
// Sécurité assurée côté base : toutes les lectures passent par les fonctions sbcc_admin_*,
// qui refusent tout compte absent de simulateur_bcc.admins.

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Download, LogOut, RefreshCw, Search, Trash2 } from 'lucide-react';
import { clientSupabase, syncConfiguree } from '@/lib/remote';
import { formatNote, LIBELLES_FILIERE } from '@/lib/share';
import { Modal } from '@/components/ui/Modal';
import { BarresHorizontales, Histogramme } from './Graphiques';

interface StatsAdmin {
  candidats: number;
  emails_uniques: number;
  contacts_acceptes: number;
  avec_whatsapp: number;
  simulations: number;
  note_moyenne: number | null;
  avis: number;
  avis_note_moyenne: number | null;
  emails_envoyes: number;
  emails_en_attente_de_cle: number;
  par_filiere: Record<string, number>;
  inscriptions_par_jour: { jour: string; n: number }[];
  simulations_par_jour: { jour: string; n: number }[];
  distribution_notes: { tranche: number; n: number }[];
  competences: { competence: string; obtenu: number; max: number }[];
  souhaits: { souhait: string; n: number }[];
}

interface LigneCandidat {
  id: string;
  nom: string;
  email: string;
  whatsapp: string | null;
  filiere: 'data' | 'cyber';
  consentement_contact: boolean;
  source: string | null;
  created_at: string;
  simulations: number;
  meilleure_note: number | null;
}

interface LigneEmail {
  id: number;
  type: 'bienvenue' | 'resultat';
  destinataire: string;
  sujet: string;
  statut: 'envoye' | 'cle_absente' | 'limite';
  code_http: number | null;
  created_at: string;
}

interface LigneTentative {
  id: string;
  filiere: 'data' | 'cyber';
  note_sur_20: number;
  duree_secondes: number;
  created_at: string;
  candidats: { nom: string; email: string } | null;
}

interface LigneAvis {
  id: string;
  note: number | null;
  souhaits: string[];
  message: string | null;
  contexte: string | null;
  created_at: string;
  candidats: { nom: string; email: string } | null;
}

type Onglet = 'candidats' | 'resultats' | 'avis' | 'emails';

const dateCourte = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const jourCourt = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
const nombre = (n: number) => n.toLocaleString('fr-FR');

function csv(lignes: LigneCandidat[]): string {
  const echapper = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const entete = ['nom', 'email', 'whatsapp', 'filiere', 'accepte_contact', 'source', 'simulations', 'meilleure_note', 'inscrit_le'];
  const corps = lignes.map((l) =>
    [
      l.nom,
      l.email,
      l.whatsapp ?? '',
      l.filiere,
      l.consentement_contact ? 'oui' : 'non',
      l.source ?? '',
      String(l.simulations ?? 0),
      l.meilleure_note === null ? '' : String(l.meilleure_note),
      l.created_at,
    ]
      .map(echapper)
      .join(','),
  );
  return '﻿' + [entete.join(','), ...corps].join('\n');
}

function Tuile({ libelle, valeur, detail }: { libelle: string; valeur: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-[13px] text-muted">{libelle}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular">{valeur}</p>
      {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
    </div>
  );
}

function Panneau({ titre, children, action }: { titre: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-ink">{titre}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Connexion({ onErreur }: { onErreur: string | null }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(onErreur);
  const [chargement, setChargement] = useState(false);

  const connecter = async (e: FormEvent) => {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    const supabase = await clientSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: motDePasse });
    if (error) setErreur('Identifiants incorrects.');
    setChargement(false);
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Espace administrateur</h1>
      <p className="mt-2 text-sm text-muted">Accès réservé. Connecte-toi avec ton compte Datalendo (administrateur).</p>
      <form onSubmit={connecter} className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-ink">
          E-mail
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 block h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-[15px] outline-none focus:border-ink focus:ring-4 focus:ring-ink/5" />
        </label>
        <label className="block text-sm font-medium text-ink">
          Mot de passe
          <input type="password" autoComplete="current-password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className="mt-1.5 block h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-[15px] outline-none focus:border-ink focus:ring-4 focus:ring-ink/5" />
        </label>
        {erreur ? <p role="alert" className="text-sm text-danger">{erreur}</p> : null}
        <button type="submit" disabled={chargement || !email || !motDePasse} className="h-11 w-full rounded-xl bg-ink text-sm font-semibold text-bg transition hover:bg-ink/90 disabled:opacity-40">
          {chargement ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [pret, setPret] = useState(false);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<StatsAdmin | null>(null);
  const [candidats, setCandidats] = useState<LigneCandidat[]>([]);
  const [tentatives, setTentatives] = useState<LigneTentative[]>([]);
  const [avis, setAvis] = useState<LigneAvis[]>([]);
  const [emails, setEmails] = useState<LigneEmail[]>([]);
  const [onglet, setOnglet] = useState<Onglet>('candidats');
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(false);
  const [aSupprimer, setASupprimer] = useState<LigneCandidat | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!syncConfiguree()) return;
    let actif = true;
    let desabonner: (() => void) | undefined;
    void clientSupabase().then(async (supabase) => {
      const { data } = await supabase.auth.getSession();
      if (!actif) return;
      setSession(data.session);
      setPret(true);
      const { data: abonnement } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
      desabonner = () => abonnement.subscription.unsubscribe();
    });
    return () => {
      actif = false;
      desabonner?.();
    };
  }, []);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    const supabase = await clientSupabase();
    const { data: estAdmin } = await supabase.rpc('sbcc_est_admin');
    setAdmin(estAdmin === true);
    if (estAdmin !== true) {
      setChargement(false);
      return;
    }
    const [s, c, t, a, e] = await Promise.all([
      supabase.rpc('sbcc_stats_admin'),
      supabase.rpc('sbcc_admin_candidats', { p_limite: 1000, p_decalage: 0 }),
      supabase.rpc('sbcc_admin_tentatives', { p_limite: 300 }),
      supabase.rpc('sbcc_admin_avis', { p_limite: 300 }),
      supabase.rpc('sbcc_admin_emails', { p_limite: 200 }),
    ]);
    if (s.error || c.error || t.error || a.error || e.error) setErreur('Chargement incomplet. Réessaie dans un instant.');
    setStats((s.data as StatsAdmin | null) ?? null);
    setCandidats((c.data as LigneCandidat[] | null) ?? []);
    setTentatives((t.data as LigneTentative[] | null) ?? []);
    setAvis((a.data as LigneAvis[] | null) ?? []);
    setEmails((e.data as LigneEmail[] | null) ?? []);
    setChargement(false);
  }, []);

  useEffect(() => {
    if (!session) return;
    const id = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(id);
  }, [session, charger]);

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return q ? candidats.filter((c) => `${c.nom} ${c.email} ${c.whatsapp ?? ''}`.toLowerCase().includes(q)) : candidats;
  }, [candidats, recherche]);

  const exporter = async () => {
    const supabase = await clientSupabase();
    const tout: LigneCandidat[] = [];
    for (let debut = 0; ; debut += 1000) {
      const { data, error } = await supabase.rpc('sbcc_admin_candidats', { p_limite: 1000, p_decalage: debut });
      const lignes = (data as LigneCandidat[] | null) ?? [];
      if (error) break;
      tout.push(...lignes);
      if (lignes.length < 1000) break;
    }
    const url = URL.createObjectURL(new Blob([csv(tout)], { type: 'text/csv;charset=utf-8' }));
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = `candidats-simulateur-bcc-${new Date().toISOString().slice(0, 10)}.csv`;
    lien.click();
    URL.revokeObjectURL(url);
  };

  const supprimer = async () => {
    if (!aSupprimer) return;
    const supabase = await clientSupabase();
    const { error } = await supabase.rpc('sbcc_admin_supprimer_candidat', { p_id: aSupprimer.id });
    if (error) setErreur('Suppression impossible.');
    setASupprimer(null);
    void charger();
  };

  const deconnecter = async () => {
    const supabase = await clientSupabase();
    await supabase.auth.signOut();
    setAdmin(null);
    setStats(null);
  };

  if (!syncConfiguree()) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Base de données non configurée</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Définis <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
          <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, puis redéploie. Marche à suivre : README,
          section « Supabase ».
        </p>
      </div>
    );
  }
  if (!pret) return <div className="mx-auto h-96 max-w-6xl animate-pulse px-4 py-10" aria-busy="true" aria-label="Chargement" />;
  if (!session) return <Connexion onErreur={null} />;
  if (admin === false) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Compte non autorisé</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Ce compte n&apos;est pas administrateur du simulateur. Dans Supabase (projet datalendo) → SQL Editor, exécute :
        </p>
        <pre className="code-block mt-4 text-ink">{`insert into simulateur_bcc.admins (user_id)\nvalues ('${session.user.id}');`}</pre>
        <button type="button" onClick={deconnecter} className="mt-6 text-sm font-medium text-ink underline underline-offset-2">Se déconnecter</button>
      </div>
    );
  }

  const st = stats;
  const totalFiliere = st ? (st.par_filiere.data ?? 0) + (st.par_filiere.cyber ?? 0) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Tableau de bord · {session.user.email}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Simulateur BCC</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void charger()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-ink hover:border-ink/30">
            <RefreshCw aria-hidden className={`size-4 ${chargement ? 'animate-spin' : ''}`} /> Actualiser
          </button>
          <button type="button" onClick={deconnecter} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-ink hover:border-ink/30">
            <LogOut aria-hidden className="size-4" /> Quitter
          </button>
        </div>
      </div>

      {erreur ? <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{erreur}</p> : null}

      {st ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Tuile libelle="Candidats inscrits" valeur={nombre(st.emails_uniques)} detail={`${nombre(st.candidats)} profils`} />
            <Tuile libelle="Simulations terminées" valeur={nombre(st.simulations)} detail={st.emails_uniques ? `${formatNote(Math.round((st.simulations / st.emails_uniques) * 10) / 10)} par candidat` : undefined} />
            <Tuile libelle="Note moyenne" valeur={st.note_moyenne !== null ? `${formatNote(Math.round(Number(st.note_moyenne) * 10) / 10)}/20` : '—'} />
            <Tuile libelle="Contacts autorisés" valeur={nombre(st.contacts_acceptes)} detail={`${nombre(st.avec_whatsapp)} avec WhatsApp`} />
            <Tuile libelle="Avis reçus" valeur={nombre(st.avis)} detail={st.avis_note_moyenne !== null ? `Satisfaction ${formatNote(Math.round(Number(st.avis_note_moyenne) * 10) / 10)}/5` : undefined} />
          </div>

          {st.emails_en_attente_de_cle > 0 ? (
            <p role="status" className="rounded-xl border border-accent/50 bg-accent-soft px-4 py-3 text-sm text-ink">
              {nombre(st.emails_en_attente_de_cle)} e-mail(s) non envoyé(s) : la clé Resend n&apos;est pas encore enregistrée dans le
              Vault Supabase (secret <code className="font-mono">sbcc_resend_api_key</code>). {nombre(st.emails_envoyes)} envoyé(s) au total.
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Panneau titre="Inscriptions — 30 derniers jours">
              <Histogramme titre="Inscriptions par jour" barres={st.inscriptions_par_jour.map((j) => ({ libelle: jourCourt(j.jour), valeur: j.n, detail: jourCourt(j.jour) }))} />
            </Panneau>
            <Panneau titre="Simulations — 30 derniers jours">
              <Histogramme titre="Simulations par jour" barres={st.simulations_par_jour.map((j) => ({ libelle: jourCourt(j.jour), valeur: j.n, detail: jourCourt(j.jour) }))} />
            </Panneau>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panneau titre="Distribution des notes">
              <Histogramme
                titre="Nombre de simulations par tranche de note"
                barres={Array.from({ length: 10 }, (_, i) => ({
                  libelle: `${i * 2}`,
                  valeur: st.distribution_notes.find((d) => d.tranche === i)?.n ?? 0,
                  detail: `de ${i * 2} à ${i === 9 ? 20 : i * 2 + 2}/20`,
                }))}
              />
              <p className="mt-2 text-xs text-muted">Notes de 0 à 20, par tranches de 2 points.</p>
            </Panneau>
            <Panneau titre="Filières">
              <div className="space-y-4">
                {(['data', 'cyber'] as const).map((f) => {
                  const n = st.par_filiere[f] ?? 0;
                  const pct = totalFiliere ? Math.round((n / totalFiliere) * 100) : 0;
                  return (
                    <div key={f}>
                      <div className="mb-1.5 flex justify-between text-sm"><span className="text-ink">{LIBELLES_FILIERE[f]}</span><span className="font-mono text-muted tabular">{nombre(n)} · {pct} %</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-primary/80" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </Panneau>
            <Panneau titre="Souhaits des candidats">
              {st.souhaits.length ? (
                <BarresHorizontales lignes={st.souhaits.slice(0, 8).map((s) => ({ libelle: s.souhait, valeur: s.n }))} format={(v) => nombre(v)} />
              ) : (
                <p className="text-sm text-muted">Aucun avis pour l&apos;instant.</p>
              )}
            </Panneau>
          </div>

          <Panneau titre="Compétences les moins maîtrisées (taux de réussite moyen)">
            {st.competences.length ? (
              <BarresHorizontales
                lignes={st.competences.slice(0, 12).map((c) => ({ libelle: c.competence, valeur: c.max > 0 ? c.obtenu / c.max : 0, detail: `${c.obtenu}/${c.max}` }))}
                format={(v) => `${Math.round(v * 100)} %`}
              />
            ) : (
              <p className="text-sm text-muted">Pas encore de simulation terminée.</p>
            )}
            <p className="mt-3 text-xs text-muted">Utile pour prioriser le contenu de tes formations et vidéos.</p>
          </Panneau>
        </>
      ) : (
        <div className="h-64 animate-pulse rounded-2xl bg-surface-2" aria-busy="true" aria-label="Chargement des statistiques" />
      )}

      <section className="rounded-2xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div role="tablist" aria-label="Données" className="flex gap-1">
            {(
              [
                ['candidats', `Candidats (${nombre(candidats.length)})`],
                ['resultats', `Résultats (${nombre(tentatives.length)})`],
                ['avis', `Avis (${nombre(avis.length)})`],
                ['emails', `E-mails (${nombre(emails.length)})`],
              ] as const
            ).map(([id, libelle]) => (
              <button key={id} type="button" role="tab" aria-selected={onglet === id} onClick={() => setOnglet(id)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${onglet === id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
                {libelle}
              </button>
            ))}
          </div>
          {onglet === 'candidats' ? (
            <div className="flex flex-wrap gap-2">
              <label className="relative">
                <span className="sr-only">Rechercher un candidat</span>
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Nom, e-mail, téléphone" className="h-9 w-56 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-ink" />
              </label>
              <button type="button" onClick={() => void exporter()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-ink px-3 text-sm font-medium text-bg hover:bg-ink/90">
                <Download aria-hidden className="size-4" /> Export CSV
              </button>
            </div>
          ) : null}
        </div>

        <div className="scroll-fin overflow-x-auto">
          {onglet === 'candidats' ? (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-3 font-medium">Nom</th>
                  <th scope="col" className="px-4 py-3 font-medium">E-mail</th>
                  <th scope="col" className="px-4 py-3 font-medium">WhatsApp</th>
                  <th scope="col" className="px-4 py-3 font-medium">Filière</th>
                  <th scope="col" className="px-4 py-3 font-medium">Contact</th>
                  <th scope="col" className="px-4 py-3 font-medium">Source</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Simulations</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Meilleure</th>
                  <th scope="col" className="px-4 py-3 font-medium">Inscrit le</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtres.slice(0, 200).map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                    <td className="px-4 py-3 font-medium text-ink">{c.nom}</td>
                    <td className="px-4 py-3 text-muted"><a className="hover:text-ink" href={`mailto:${c.email}`}>{c.email}</a></td>
                    <td className="px-4 py-3 text-muted">{c.whatsapp ? <a className="hover:text-ink" href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{c.whatsapp}</a> : '—'}</td>
                    <td className="px-4 py-3 text-muted">{LIBELLES_FILIERE[c.filiere]}</td>
                    <td className="px-4 py-3 text-muted">{c.consentement_contact ? 'Oui' : 'Non'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{c.source ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted tabular">{c.simulations ?? 0}</td>
                    <td className="px-4 py-3 text-right font-mono text-ink tabular">{c.meilleure_note === null ? '—' : `${formatNote(Number(c.meilleure_note))}/20`}</td>
                    <td className="px-4 py-3 text-muted tabular">{dateCourte(c.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => setASupprimer(c)} aria-label={`Supprimer ${c.nom}`} className="rounded-lg p-1.5 text-muted hover:bg-danger-soft hover:text-danger">
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtres.length === 0 ? <tr><td colSpan={10} className="px-4 py-10 text-center text-muted">Aucun candidat.</td></tr> : null}
              </tbody>
            </table>
          ) : onglet === 'resultats' ? (
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-3 font-medium">Candidat</th>
                  <th scope="col" className="px-4 py-3 font-medium">Filière</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Note</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Durée</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {tentatives.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-ink">{t.candidats ? `${t.candidats.nom} · ${t.candidats.email}` : <span className="text-muted">Anonyme</span>}</td>
                    <td className="px-4 py-3 text-muted">{LIBELLES_FILIERE[t.filiere]}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-ink tabular">{formatNote(Number(t.note_sur_20))}/20</td>
                    <td className="px-4 py-3 text-right font-mono text-muted tabular">{Math.round(t.duree_secondes / 60)} min</td>
                    <td className="px-4 py-3 text-muted tabular">{dateCourte(t.created_at)}</td>
                  </tr>
                ))}
                {tentatives.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">Aucune simulation.</td></tr> : null}
              </tbody>
            </table>
          ) : onglet === 'emails' ? (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-3 font-medium">Type</th>
                  <th scope="col" className="px-4 py-3 font-medium">Destinataire</th>
                  <th scope="col" className="px-4 py-3 font-medium">Sujet</th>
                  <th scope="col" className="px-4 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted">{m.type === 'bienvenue' ? 'Bienvenue' : 'Résultat'}</td>
                    <td className="px-4 py-3 text-ink">{m.destinataire}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted">{m.sujet}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          m.statut === 'envoye' && (m.code_http === null || m.code_http < 300)
                            ? 'bg-success-soft text-success-ink'
                            : m.statut === 'limite'
                              ? 'bg-surface-2 text-muted'
                              : 'bg-danger-soft text-danger'
                        }`}
                      >
                        {m.statut === 'envoye'
                          ? m.code_http === null
                            ? 'Envoyé'
                            : m.code_http < 300
                              ? `Livré à Resend (${m.code_http})`
                              : `Refusé (${m.code_http})`
                          : m.statut === 'limite'
                            ? 'Limite atteinte'
                            : 'Clé absente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted tabular">{dateCourte(m.created_at)}</td>
                  </tr>
                ))}
                {emails.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">Aucun e-mail.</td></tr> : null}
              </tbody>
            </table>
          ) : (
            <ul className="divide-y divide-border">
              {avis.map((a) => (
                <li key={a.id} className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="font-mono font-semibold text-ink">{a.note ? `${a.note}/5` : '—'}</span>
                    <span className="text-muted">{a.candidats ? `${a.candidats.nom} · ${a.candidats.email}` : 'Anonyme'}</span>
                    <span className="text-muted">· {dateCourte(a.created_at)}</span>
                    {a.contexte ? <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted">{a.contexte}</span> : null}
                  </div>
                  {a.souhaits.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {a.souhaits.map((s) => <span key={s} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">{s}</span>)}
                    </div>
                  ) : null}
                  {a.message ? <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-ink">{a.message}</p> : null}
                </li>
              ))}
              {avis.length === 0 ? <li className="px-4 py-10 text-center text-muted">Aucun avis.</li> : null}
            </ul>
          )}
        </div>
      </section>

      <Modal
        ouvert={aSupprimer !== null}
        onFermer={() => setASupprimer(null)}
        titre="Supprimer ce candidat ?"
        actions={
          <>
            <button type="button" onClick={() => setASupprimer(null)} className="h-10 rounded-xl border border-border px-4 text-sm font-medium text-ink">Annuler</button>
            <button type="button" onClick={() => void supprimer()} className="h-10 rounded-xl bg-danger px-4 text-sm font-semibold text-white">Supprimer définitivement</button>
          </>
        }
      >
        <p>
          {aSupprimer?.nom} ({aSupprimer?.email}) et tous ses résultats seront effacés définitivement. À utiliser pour les demandes de
          suppression des candidats.
        </p>
      </Modal>
    </div>
  );
}
