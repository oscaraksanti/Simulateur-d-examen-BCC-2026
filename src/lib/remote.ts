// Synchronisation avec Supabase (inscriptions, résultats, avis).
//
// Principes :
//  * Facultatif : sans NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, l'app reste 100 % locale.
//  * Hors ligne d'abord : chaque envoi passe par une file d'attente persistée (localStorage)
//    et sera retenté au prochain chargement si le réseau manque (fréquent sur mobile).
//  * Le client Supabase est chargé à la demande (import dynamique) pour garder l'accueil léger.
//  * Écritures uniquement via des fonctions SQL validées (voir supabase/migrations/0001_simulateur_bcc.sql).

import type { SupabaseClient } from '@supabase/supabase-js';
import { CLES, ecrire, lire } from './storage';
import type { Candidat, ResultatExamen, Filiere } from './types';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const CLE_SUPABASE =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function syncConfiguree(): boolean {
  return URL_SUPABASE.startsWith('https://') && CLE_SUPABASE.length > 20;
}

let client: Promise<SupabaseClient> | null = null;

/** Client Supabase partagé (chargé une seule fois). */
export function clientSupabase(): Promise<SupabaseClient> {
  if (!client) {
    client = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(URL_SUPABASE, CLE_SUPABASE, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: 'simbcc-admin-auth' },
      }),
    );
  }
  return client;
}

// ---------------------------------------------------------------------------
// Opérations en file d'attente
// ---------------------------------------------------------------------------

export type Operation =
  | { type: 'candidat'; params: ParamsCandidat }
  | { type: 'tentative'; params: ParamsTentative }
  | { type: 'avis'; params: ParamsAvis };

interface ParamsCandidat {
  p_id: string;
  p_nom: string;
  p_email: string;
  p_filiere: Filiere;
  p_whatsapp: string | null;
  p_consentement_contact: boolean;
  p_source: string | null;
}

interface ParamsTentative {
  p_id: string;
  p_candidat_id: string;
  p_filiere: Filiere;
  p_note_sur_20: number;
  p_score_qcm: number;
  p_score_qcm_max: number;
  p_score_cas: number;
  p_score_cas_max: number;
  p_duree_secondes: number;
  p_par_section: ResultatExamen['parSection'];
  p_par_competence: ResultatExamen['parCompetence'];
}

export interface ParamsAvis {
  p_candidat_id: string | null;
  p_note: number | null;
  p_souhaits: string[];
  p_message: string | null;
  p_contexte: string | null;
}

interface Element {
  op: Operation;
  essais: number;
  ajouteLe: string;
}

// Fonctions SQL du schéma isolé `simulateur_bcc` (projet Supabase Datalendo), préfixées sbcc_.
const FONCTIONS: Record<Operation['type'], string> = {
  candidat: 'sbcc_enregistrer_candidat',
  tentative: 'sbcc_enregistrer_tentative',
  avis: 'sbcc_envoyer_avis',
};

const MAX_FILE = 50;
const MAX_ESSAIS = 8;

function estFile(v: unknown): v is Element[] {
  return Array.isArray(v) && v.every((e) => typeof e === 'object' && e !== null && 'op' in e);
}

function lireFile(): Element[] {
  return lire<Element[]>(CLES.fileAttente, [], estFile);
}

/** Erreur définitive (données refusées par la base) : inutile de réessayer. */
function erreurDefinitive(code: string | undefined): boolean {
  return Boolean(code && /^(22|23|42)/.test(code));
}

let enCours: Promise<void> | null = null;

/** Envoie les opérations en attente, dans l'ordre. S'arrête à la première erreur réseau. */
export function viderFile(): Promise<void> {
  if (!syncConfiguree() || typeof window === 'undefined') return Promise.resolve();
  if (enCours) return enCours;
  enCours = (async () => {
    try {
      const supabase = await clientSupabase();
      let file = lireFile();
      while (file.length > 0) {
        const [premier, ...reste] = file;
        const { error } = await supabase.rpc(FONCTIONS[premier.op.type], premier.op.params);
        if (error && !erreurDefinitive(error.code)) {
          premier.essais += 1;
          ecrire(CLES.fileAttente, premier.essais >= MAX_ESSAIS ? reste : [premier, ...reste]);
          return;
        }
        file = reste;
        ecrire(CLES.fileAttente, file);
      }
    } catch {
      // réseau indisponible : nouvel essai au prochain chargement
    } finally {
      enCours = null;
    }
  })();
  return enCours;
}

export function enfiler(op: Operation): void {
  if (!syncConfiguree()) return;
  const file = lireFile().filter((e) => !(op.type === 'candidat' && e.op.type === 'candidat' && e.op.params.p_id === op.params.p_id));
  ecrire(CLES.fileAttente, [...file, { op, essais: 0, ajouteLe: new Date().toISOString() }].slice(-MAX_FILE));
  void viderFile();
}

// ---------------------------------------------------------------------------
// API métier
// ---------------------------------------------------------------------------

export function synchroniserCandidat(c: Candidat, source: string | null): void {
  enfiler({
    type: 'candidat',
    params: {
      p_id: c.id,
      p_nom: c.nom,
      p_email: c.email,
      p_filiere: c.filiere,
      p_whatsapp: c.whatsapp?.trim() ? c.whatsapp.trim() : null,
      p_consentement_contact: Boolean(c.consentementContact),
      p_source: source,
    },
  });
}

export function synchroniserTentative(id: string, candidatId: string, filiere: Filiere, r: ResultatExamen): void {
  enfiler({
    type: 'tentative',
    params: {
      p_id: id,
      p_candidat_id: candidatId,
      p_filiere: filiere,
      p_note_sur_20: r.noteSur20,
      p_score_qcm: r.scoreQcm,
      p_score_qcm_max: r.scoreQcmMax,
      p_score_cas: r.scoreCas,
      p_score_cas_max: r.scoreCasMax,
      p_duree_secondes: Math.max(0, Math.min(86400, Math.round(r.dureeSecondes))),
      p_par_section: r.parSection,
      p_par_competence: r.parCompetence,
    },
  });
}

export function envoyerAvis(params: ParamsAvis): void {
  enfiler({ type: 'avis', params });
}

export interface StatsPubliques {
  candidats: number;
  simulations: number;
}

/** Chiffres agrégés publics (aucune donnée personnelle). */
export async function lireStatsPubliques(): Promise<StatsPubliques | null> {
  if (!syncConfiguree()) return null;
  try {
    const supabase = await clientSupabase();
    const { data, error } = await supabase.rpc('sbcc_stats_publiques');
    if (error || typeof data !== 'object' || data === null) return null;
    const d = data as Record<string, unknown>;
    return typeof d.candidats === 'number' && typeof d.simulations === 'number'
      ? { candidats: d.candidats, simulations: d.simulations }
      : null;
  } catch {
    return null;
  }
}

/** UUID v4 (crypto.randomUUID si disponible). */
export function nouvelId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const octets = new Uint8Array(16);
  crypto.getRandomValues(octets);
  octets[6] = (octets[6] & 0x0f) | 0x40;
  octets[8] = (octets[8] & 0x3f) | 0x80;
  const h = Array.from(octets, (o) => o.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
