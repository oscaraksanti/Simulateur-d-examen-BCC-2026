-- =============================================================================
-- Simulateur BCC — schéma Supabase (Postgres)
-- Collecte : candidats inscrits, résultats des simulations, avis.
--
-- Sécurité :
--  * RLS activée partout. Le public (rôle anon) ne peut NI lire NI écrire directement
--    dans les tables : il passe uniquement par des fonctions validées (security definer).
--  * Seuls les comptes listés dans public.admins peuvent lire les données.
--  * Aucun e-mail d'administrateur n'est écrit dans ce fichier (dépôt public) : on ajoute
--    l'admin après coup avec une requête (voir README, section Supabase).
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table if not exists public.candidats (
  id uuid primary key,
  nom text not null check (char_length(btrim(nom)) between 2 and 120),
  email text not null check (
    char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'
  ),
  whatsapp text check (whatsapp is null or whatsapp ~ '^\+?[0-9 ]{8,20}$'),
  filiere text not null check (filiere in ('data', 'cyber')),
  consentement_contact boolean not null default false,
  source text check (source is null or char_length(source) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists candidats_email_idx on public.candidats (lower(email));
create index if not exists candidats_created_idx on public.candidats (created_at desc);

create table if not exists public.tentatives (
  id uuid primary key,
  candidat_id uuid references public.candidats (id) on delete cascade,
  filiere text not null check (filiere in ('data', 'cyber')),
  note_sur_20 numeric(3, 1) not null check (note_sur_20 between 0 and 20),
  score_qcm smallint not null check (score_qcm between 0 and 200),
  score_qcm_max smallint not null check (score_qcm_max between 1 and 200),
  score_cas numeric(6, 2) not null check (score_cas >= 0),
  score_cas_max smallint not null check (score_cas_max between 0 and 500),
  duree_secondes integer not null check (duree_secondes between 0 and 86400),
  par_section jsonb not null default '{}'::jsonb,
  par_competence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tentatives_candidat_idx on public.tentatives (candidat_id);
create index if not exists tentatives_created_idx on public.tentatives (created_at desc);

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  candidat_id uuid references public.candidats (id) on delete set null,
  note smallint check (note between 1 and 5),
  souhaits text[] not null default '{}' check (cardinality(souhaits) <= 12),
  message text check (message is null or char_length(message) <= 2000),
  contexte text check (contexte is null or char_length(contexte) <= 40),
  created_at timestamptz not null default now()
);

create index if not exists feedbacks_created_idx on public.feedbacks (created_at desc);

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- RLS : aucun accès direct pour le public, lecture réservée aux admins
-- -----------------------------------------------------------------------------

alter table public.candidats enable row level security;
alter table public.tentatives enable row level security;
alter table public.feedbacks enable row level security;
alter table public.admins enable row level security;

revoke all on public.candidats, public.tentatives, public.feedbacks, public.admins from anon;

create or replace function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.est_admin() from public;
grant execute on function public.est_admin() to anon, authenticated;

drop policy if exists "admins lisent les candidats" on public.candidats;
create policy "admins lisent les candidats" on public.candidats
  for select to authenticated using (public.est_admin());

drop policy if exists "admins suppriment les candidats" on public.candidats;
create policy "admins suppriment les candidats" on public.candidats
  for delete to authenticated using (public.est_admin());

drop policy if exists "admins lisent les tentatives" on public.tentatives;
create policy "admins lisent les tentatives" on public.tentatives
  for select to authenticated using (public.est_admin());

drop policy if exists "admins lisent les avis" on public.feedbacks;
create policy "admins lisent les avis" on public.feedbacks
  for select to authenticated using (public.est_admin());

drop policy if exists "admins suppriment les avis" on public.feedbacks;
create policy "admins suppriment les avis" on public.feedbacks
  for delete to authenticated using (public.est_admin());

drop policy if exists "un admin voit sa ligne" on public.admins;
create policy "un admin voit sa ligne" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Écritures publiques via fonctions validées
-- (l'id du candidat est un UUID aléatoire généré sur l'appareil : il sert de jeton)
-- -----------------------------------------------------------------------------

create or replace function public.enregistrer_candidat(
  p_id uuid,
  p_nom text,
  p_email text,
  p_filiere text,
  p_whatsapp text default null,
  p_consentement_contact boolean default false,
  p_source text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.candidats (id, nom, email, whatsapp, filiere, consentement_contact, source)
  values (
    p_id,
    btrim(p_nom),
    lower(btrim(p_email)),
    nullif(btrim(coalesce(p_whatsapp, '')), ''),
    p_filiere,
    coalesce(p_consentement_contact, false),
    left(p_source, 40)
  )
  on conflict (id) do update set
    nom = excluded.nom,
    email = excluded.email,
    whatsapp = excluded.whatsapp,
    filiere = excluded.filiere,
    consentement_contact = excluded.consentement_contact,
    updated_at = now();
end;
$$;

create or replace function public.enregistrer_tentative(
  p_id uuid,
  p_candidat_id uuid,
  p_filiere text,
  p_note_sur_20 numeric,
  p_score_qcm integer,
  p_score_qcm_max integer,
  p_score_cas numeric,
  p_score_cas_max integer,
  p_duree_secondes integer,
  p_par_section jsonb,
  p_par_competence jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if pg_column_size(p_par_section) > 4000 or pg_column_size(p_par_competence) > 8000 then
    raise exception 'données de tentative trop volumineuses' using errcode = '22023';
  end if;
  insert into public.tentatives (
    id, candidat_id, filiere, note_sur_20, score_qcm, score_qcm_max,
    score_cas, score_cas_max, duree_secondes, par_section, par_competence
  )
  values (
    p_id,
    case when exists (select 1 from public.candidats where id = p_candidat_id) then p_candidat_id end,
    p_filiere, p_note_sur_20, p_score_qcm, p_score_qcm_max,
    p_score_cas, p_score_cas_max, p_duree_secondes,
    coalesce(p_par_section, '{}'::jsonb), coalesce(p_par_competence, '{}'::jsonb)
  )
  on conflict (id) do nothing;
end;
$$;

create or replace function public.envoyer_avis(
  p_candidat_id uuid,
  p_note integer,
  p_souhaits text[],
  p_message text,
  p_contexte text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_note is null and coalesce(btrim(p_message), '') = '' and coalesce(cardinality(p_souhaits), 0) = 0 then
    raise exception 'avis vide' using errcode = '22023';
  end if;
  insert into public.feedbacks (candidat_id, note, souhaits, message, contexte)
  values (
    case when exists (select 1 from public.candidats where id = p_candidat_id) then p_candidat_id end,
    p_note,
    coalesce(p_souhaits, '{}'),
    nullif(btrim(coalesce(p_message, '')), ''),
    left(p_contexte, 40)
  );
end;
$$;

-- Chiffres publics agrégés (aucune donnée personnelle) pour la page d'accueil.
create or replace function public.stats_publiques()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'candidats', (select count(distinct lower(email)) from public.candidats),
    'simulations', (select count(*) from public.tentatives)
  );
$$;

-- Tableau de bord : agrégats calculés côté serveur, réservés aux admins.
create or replace function public.stats_admin()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  resultat json;
begin
  if not public.est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;

  select json_build_object(
    'candidats', (select count(*) from public.candidats),
    'emails_uniques', (select count(distinct lower(email)) from public.candidats),
    'contacts_acceptes', (select count(*) from public.candidats where consentement_contact),
    'avec_whatsapp', (select count(*) from public.candidats where whatsapp is not null),
    'simulations', (select count(*) from public.tentatives),
    'note_moyenne', (select round(avg(note_sur_20)::numeric, 2) from public.tentatives),
    'avis', (select count(*) from public.feedbacks),
    'avis_note_moyenne', (select round(avg(note)::numeric, 2) from public.feedbacks where note is not null),
    'par_filiere', (
      select coalesce(json_object_agg(filiere, n), '{}'::json)
      from (select filiere, count(*) n from public.candidats group by filiere) f
    ),
    'inscriptions_par_jour', (
      select coalesce(json_agg(json_build_object('jour', jour, 'n', n) order by jour), '[]'::json)
      from (
        select d::date as jour, count(c.id) as n
        from generate_series(current_date - 29, current_date, interval '1 day') d
        left join public.candidats c on c.created_at::date = d::date
        group by d
      ) j
    ),
    'simulations_par_jour', (
      select coalesce(json_agg(json_build_object('jour', jour, 'n', n) order by jour), '[]'::json)
      from (
        select d::date as jour, count(t.id) as n
        from generate_series(current_date - 29, current_date, interval '1 day') d
        left join public.tentatives t on t.created_at::date = d::date
        group by d
      ) j
    ),
    'distribution_notes', (
      select coalesce(json_agg(json_build_object('tranche', tranche, 'n', n) order by tranche), '[]'::json)
      from (
        select least(floor(note_sur_20 / 2)::int, 9) as tranche, count(*) as n
        from public.tentatives group by 1
      ) d
    ),
    'competences', (
      select coalesce(json_agg(json_build_object('competence', competence, 'obtenu', obtenu, 'max', maxi) order by obtenu / nullif(maxi, 0)), '[]'::json)
      from (
        select key as competence,
               sum((value ->> 'obtenu')::numeric) as obtenu,
               sum((value ->> 'max')::numeric) as maxi
        from public.tentatives, jsonb_each(par_competence)
        group by key
      ) c
    ),
    'souhaits', (
      select coalesce(json_agg(json_build_object('souhait', s, 'n', n) order by n desc), '[]'::json)
      from (select unnest(souhaits) as s, count(*) as n from public.feedbacks group by 1) s
    )
  ) into resultat;

  return resultat;
end;
$$;

revoke all on function public.enregistrer_candidat(uuid, text, text, text, text, boolean, text) from public;
revoke all on function public.enregistrer_tentative(uuid, uuid, text, numeric, integer, integer, numeric, integer, integer, jsonb, jsonb) from public;
revoke all on function public.envoyer_avis(uuid, integer, text[], text, text) from public;
revoke all on function public.stats_publiques() from public;
revoke all on function public.stats_admin() from public;

grant execute on function public.enregistrer_candidat(uuid, text, text, text, text, boolean, text) to anon, authenticated;
grant execute on function public.enregistrer_tentative(uuid, uuid, text, numeric, integer, integer, numeric, integer, integer, jsonb, jsonb) to anon, authenticated;
grant execute on function public.envoyer_avis(uuid, integer, text[], text, text) to anon, authenticated;
grant execute on function public.stats_publiques() to anon, authenticated;
grant execute on function public.stats_admin() to authenticated;
