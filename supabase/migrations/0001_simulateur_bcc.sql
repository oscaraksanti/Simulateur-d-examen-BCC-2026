-- =============================================================================
-- Simulateur BCC (Datalendo) — schéma Supabase
--
-- Installé dans le projet Supabase « datalendo », dans un schéma ISOLÉ `simulateur_bcc` :
-- aucune table existante n'est modifiée. Les tables ne sont pas exposées par l'API ;
-- tout passe par des fonctions `public.sbcc_*` (security definer) qui valident les entrées.
--
-- Sécurité :
--  * RLS activée sur toutes les tables, sans politique : aucun accès direct (anon / authenticated).
--  * Écritures publiques : sbcc_enregistrer_candidat, sbcc_enregistrer_tentative, sbcc_envoyer_avis.
--  * Lectures : réservées aux comptes listés dans simulateur_bcc.admins (sbcc_est_admin()).
--  * E-mails : Resend via pg_net ; la clé API est lue dans Vault (secret « sbcc_resend_api_key »),
--    jamais écrite dans ce fichier. Sans clé, les e-mails sont simplement journalisés « cle_absente ».
-- =============================================================================

create extension if not exists pg_net with schema extensions;

create schema if not exists simulateur_bcc;
revoke all on schema simulateur_bcc from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table if not exists simulateur_bcc.candidats (
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
create index if not exists candidats_email_idx on simulateur_bcc.candidats (lower(email));
create index if not exists candidats_created_idx on simulateur_bcc.candidats (created_at desc);

create table if not exists simulateur_bcc.tentatives (
  id uuid primary key,
  candidat_id uuid references simulateur_bcc.candidats (id) on delete cascade,
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
create index if not exists tentatives_candidat_idx on simulateur_bcc.tentatives (candidat_id);
create index if not exists tentatives_created_idx on simulateur_bcc.tentatives (created_at desc);

create table if not exists simulateur_bcc.feedbacks (
  id uuid primary key default gen_random_uuid(),
  candidat_id uuid references simulateur_bcc.candidats (id) on delete set null,
  note smallint check (note between 1 and 5),
  souhaits text[] not null default '{}' check (cardinality(souhaits) <= 12),
  message text check (message is null or char_length(message) <= 2000),
  contexte text check (contexte is null or char_length(contexte) <= 40),
  created_at timestamptz not null default now()
);
create index if not exists feedbacks_created_idx on simulateur_bcc.feedbacks (created_at desc);

create table if not exists simulateur_bcc.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists simulateur_bcc.emails (
  id bigint generated always as identity primary key,
  candidat_id uuid references simulateur_bcc.candidats (id) on delete cascade,
  type text not null check (type in ('bienvenue', 'resultat')),
  destinataire text not null,
  sujet text not null,
  statut text not null check (statut in ('envoye', 'cle_absente', 'limite')),
  requete_id bigint,
  created_at timestamptz not null default now()
);
create index if not exists emails_destinataire_idx on simulateur_bcc.emails (lower(destinataire), type, created_at desc);

-- Réglages modifiables sans redéploiement (expéditeur, adresse du site…)
create table if not exists simulateur_bcc.parametres (
  cle text primary key,
  valeur text not null
);
insert into simulateur_bcc.parametres (cle, valeur) values
  ('expediteur', 'Simulateur BCC · Datalendo <noreply@datalendo.com>'),
  ('repondre_a', 'contact@datalendo.com'),
  ('site', 'https://simulateur-bcc.datalendo.com'),
  ('whatsapp', '243971601855')
on conflict (cle) do nothing;

alter table simulateur_bcc.candidats enable row level security;
alter table simulateur_bcc.tentatives enable row level security;
alter table simulateur_bcc.feedbacks enable row level security;
alter table simulateur_bcc.admins enable row level security;
alter table simulateur_bcc.emails enable row level security;
alter table simulateur_bcc.parametres enable row level security;

revoke all on all tables in schema simulateur_bcc from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Outils internes (non exposés)
-- -----------------------------------------------------------------------------

create or replace function simulateur_bcc.parametre(p_cle text)
returns text language sql stable security definer set search_path = '' as $$
  select valeur from simulateur_bcc.parametres where cle = p_cle;
$$;

create or replace function simulateur_bcc.html(p_texte text)
returns text language sql immutable set search_path = '' as $$
  select replace(replace(replace(replace(coalesce(p_texte, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;');
$$;

create or replace function simulateur_bcc.format_note(p numeric)
returns text language sql immutable set search_path = '' as $$
  select case when p = trunc(p) then trunc(p)::text else replace(trim(to_char(p, '90.0')), '.', ',') end;
$$;

create or replace function simulateur_bcc.mention(p numeric)
returns text language sql immutable set search_path = '' as $$
  select case when p >= 17 then 'Excellent' when p >= 14 then 'Bon niveau' when p >= 10 then 'Correct' else 'À renforcer' end;
$$;

create or replace function simulateur_bcc.prenom(p_nom text)
returns text language sql immutable set search_path = '' as $$
  select split_part(btrim(p_nom), ' ', 1);
$$;

-- Gabarit HTML commun (tableaux + styles en ligne : compatible Gmail / Outlook / mobiles).
create or replace function simulateur_bcc.gabarit(p_titre text, p_corps text)
returns text language sql stable set search_path = '' as $$
  select format($html$<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%1$s</title></head>
<body style="margin:0;padding:0;background:#f2f4f7;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1220;">
<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f2f4f7;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e8ed;border-radius:16px;overflow:hidden;">
<tr><td style="font-size:0;line-height:0;"><table role="presentation" width="100%%" cellpadding="0" cellspacing="0"><tr><td width="60%%" style="height:4px;background:#0077e6;"></td><td width="15%%" style="height:4px;background:#f7c600;"></td><td width="25%%" style="height:4px;background:#ce1021;"></td></tr></table></td></tr>
<tr><td style="padding:28px 28px 8px;font-size:14px;font-weight:700;letter-spacing:-0.01em;">Simulateur BCC <span style="font-weight:400;color:#5d6577;">· par Datalendo</span></td></tr>
<tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6;">%2$s</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #e6e8ed;font-size:12px;line-height:1.6;color:#5d6577;">
Outil de préparation indépendant, conçu par Datalendo, non affilié à la Banque Centrale du Congo. Les candidatures officielles se font uniquement sur <a href="https://www.bcc.cd" style="color:#5d6577;">bcc.cd</a>.<br>
Tu reçois cet e-mail parce que tu t'es inscrit(e) sur le Simulateur BCC. Pour faire supprimer tes données, réponds simplement à ce message.
</td></tr></table></td></tr></table></body></html>$html$, simulateur_bcc.html(p_titre), p_corps);
$$;

create or replace function simulateur_bcc.bouton(p_lien text, p_texte text)
returns text language sql immutable set search_path = '' as $$
  select format('<a href="%s" style="display:inline-block;background:#0b1220;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;">%s</a>', p_lien, simulateur_bcc.html(p_texte));
$$;

-- Envoi via Resend (pg_net, asynchrone : part après la validation de la transaction).
create or replace function simulateur_bcc.envoyer_email(p_candidat uuid, p_type text, p_destinataire text, p_sujet text, p_html text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_cle text;
  v_requete bigint;
begin
  select decrypted_secret into v_cle from vault.decrypted_secrets where name = 'sbcc_resend_api_key' limit 1;
  if v_cle is null or v_cle = '' then
    insert into simulateur_bcc.emails (candidat_id, type, destinataire, sujet, statut)
    values (p_candidat, p_type, p_destinataire, p_sujet, 'cle_absente');
    return;
  end if;
  select net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || v_cle, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', simulateur_bcc.parametre('expediteur'),
      'to', jsonb_build_array(p_destinataire),
      'reply_to', simulateur_bcc.parametre('repondre_a'),
      'subject', p_sujet,
      'html', p_html
    )
  ) into v_requete;
  insert into simulateur_bcc.emails (candidat_id, type, destinataire, sujet, statut, requete_id)
  values (p_candidat, p_type, p_destinataire, p_sujet, 'envoye', v_requete);
end;
$$;

create or replace function simulateur_bcc.email_bienvenue(p_candidat uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  c simulateur_bcc.candidats;
  v_site text := simulateur_bcc.parametre('site');
  v_filiere text;
  v_corps text;
begin
  select * into c from simulateur_bcc.candidats where id = p_candidat;
  if not found then return; end if;
  -- Une seule bienvenue (réellement envoyée) par adresse.
  if exists (select 1 from simulateur_bcc.emails where lower(destinataire) = lower(c.email) and type = 'bienvenue' and statut = 'envoye') then
    return;
  end if;
  v_filiere := case c.filiere when 'data' then 'Data Analyse' else 'Cybersécurité' end;
  v_corps := format(
    '<h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;letter-spacing:-0.02em;">Bienvenue %1$s, ton espace est prêt.</h1>'
    || '<p style="margin:0 0 16px;">Tu prépares le recrutement de la BCC en <strong>%2$s</strong>. Voici la méthode qui fait la différence :</p>'
    || '<ol style="margin:0 0 20px;padding-left:20px;">'
    || '<li style="margin-bottom:6px;"><strong>Passe l’examen blanc au moins 5 fois</strong> : chaque tirage privilégie des questions que tu n’as jamais vues.</li>'
    || '<li style="margin-bottom:6px;"><strong>Lis toute la correction</strong>, surtout « pourquoi les autres réponses sont fausses ».</li>'
    || '<li style="margin-bottom:6px;"><strong>Travaille tes 2 compétences les plus faibles</strong> en mode Entraînement entre deux examens.</li>'
    || '</ol><p style="margin:0 0 24px;">%3$s</p>'
    || '<p style="margin:0;color:#5d6577;font-size:14px;">Tutoriels gratuits : <a href="https://youtube.com/@oscaraksanti" style="color:#0062cc;">YouTube @oscaraksanti</a> · Formations : <a href="https://datalendo.com" style="color:#0062cc;">datalendo.com</a></p>',
    simulateur_bcc.html(simulateur_bcc.prenom(c.nom)),
    v_filiere,
    simulateur_bcc.bouton(v_site || '/examen/', 'Passer mon premier examen blanc')
  );
  perform simulateur_bcc.envoyer_email(c.id, 'bienvenue', c.email, 'Bienvenue sur le Simulateur BCC 🎯', simulateur_bcc.gabarit('Bienvenue', v_corps));
end;
$$;

create or replace function simulateur_bcc.email_resultat(p_tentative uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  t simulateur_bcc.tentatives;
  c simulateur_bcc.candidats;
  v_site text := simulateur_bcc.parametre('site');
  v_note text;
  v_lignes text := '';
  v_faibles text := '';
  v_numero bigint;
  v_corps text;
  r record;
begin
  select * into t from simulateur_bcc.tentatives where id = p_tentative;
  if not found or t.candidat_id is null then return; end if;
  select * into c from simulateur_bcc.candidats where id = t.candidat_id;
  if not found then return; end if;
  -- Anti-abus : au plus 5 e-mails de résultats par adresse sur 24 h.
  if (select count(*) from simulateur_bcc.emails
      where lower(destinataire) = lower(c.email) and type = 'resultat' and created_at > now() - interval '24 hours') >= 5 then
    insert into simulateur_bcc.emails (candidat_id, type, destinataire, sujet, statut) values (c.id, 'resultat', c.email, 'limite', 'limite');
    return;
  end if;

  v_note := simulateur_bcc.format_note(t.note_sur_20);
  select count(*) into v_numero from simulateur_bcc.tentatives where candidat_id = c.id;

  for r in
    select * from (values
      ('Technique', t.par_section -> 'technique'),
      ('Culture BCC', t.par_section -> 'culture_bcc'),
      ('Aptitudes logiques', t.par_section -> 'logique')
    ) as s(libelle, d) where d is not null
  loop
    v_lignes := v_lignes || format(
      '<tr><td style="padding:8px 0;border-bottom:1px solid #f2f4f7;">%s</td><td align="right" style="padding:8px 0;border-bottom:1px solid #f2f4f7;font-family:Menlo,Consolas,monospace;">%s/%s</td></tr>',
      r.libelle, r.d ->> 'obtenu', r.d ->> 'max');
  end loop;
  v_lignes := v_lignes || format(
    '<tr><td style="padding:8px 0;">Cas pratiques</td><td align="right" style="padding:8px 0;font-family:Menlo,Consolas,monospace;">%s/%s</td></tr>',
    simulateur_bcc.format_note(round(t.score_cas, 1)), t.score_cas_max);

  for r in
    select key as competence
    from jsonb_each(t.par_competence)
    where (value ->> 'max')::numeric > 0
    order by (value ->> 'obtenu')::numeric / (value ->> 'max')::numeric, (value ->> 'max')::numeric desc
    limit 2
  loop
    v_faibles := v_faibles || format('<li style="margin-bottom:4px;">%s</li>', simulateur_bcc.html(r.competence));
  end loop;

  v_corps := format(
    '<p style="margin:0 0 4px;color:#5d6577;font-size:14px;">Simulation n°%1$s · %2$s</p>'
    || '<h1 style="margin:0 0 4px;font-size:44px;line-height:1.1;letter-spacing:-0.03em;">%3$s<span style="font-size:20px;color:#5d6577;">/20</span></h1>'
    || '<p style="margin:0 0 20px;font-weight:600;color:#0062cc;">%4$s</p>'
    || '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">%5$s</table>'
    || '%6$s'
    || '<p style="margin:0 0 12px;">%7$s</p>'
    || '<p style="margin:0 0 4px;font-size:14px;color:#5d6577;">%8$s</p>'
    || '<p style="margin:0;font-size:14px;"><a href="https://wa.me/%9$s" style="color:#0062cc;">Être accompagné sur WhatsApp</a> · <a href="https://datalendo.com" style="color:#0062cc;">Formations Datalendo</a></p>',
    v_numero,
    case t.filiere when 'data' then 'Data Analyse' else 'Cybersécurité' end,
    v_note,
    simulateur_bcc.mention(t.note_sur_20),
    v_lignes,
    case when v_faibles <> '' then '<p style="margin:0 0 6px;font-weight:600;">Tes priorités de révision</p><ul style="margin:0 0 20px;padding-left:20px;">' || v_faibles || '</ul>' else '' end,
    simulateur_bcc.bouton(v_site || '/examen/', case when v_numero < 5 then 'Refaire un examen (' || v_numero || '/5)' else 'Refaire un examen' end),
    case when v_numero < 5 then 'Objectif : 5 simulations. Encore ' || (5 - v_numero) || ' pour couvrir l’essentiel du programme.' else 'Objectif des 5 simulations atteint. Vise maintenant 14/20 trois fois de suite.' end,
    simulateur_bcc.parametre('whatsapp')
  );
  perform simulateur_bcc.envoyer_email(c.id, 'resultat', c.email,
    format('Ton résultat : %s/20 au Simulateur BCC', v_note),
    simulateur_bcc.gabarit('Ton résultat', v_corps));
end;
$$;

-- -----------------------------------------------------------------------------
-- API publique (rôles anon + authenticated)
-- -----------------------------------------------------------------------------

create or replace function public.sbcc_est_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from simulateur_bcc.admins where user_id = auth.uid());
$$;

create or replace function public.sbcc_enregistrer_candidat(
  p_id uuid, p_nom text, p_email text, p_filiere text,
  p_whatsapp text default null, p_consentement_contact boolean default false, p_source text default null
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_nouveau boolean;
begin
  insert into simulateur_bcc.candidats (id, nom, email, whatsapp, filiere, consentement_contact, source)
  values (
    p_id, btrim(p_nom), lower(btrim(p_email)), nullif(btrim(coalesce(p_whatsapp, '')), ''),
    p_filiere, coalesce(p_consentement_contact, false), left(p_source, 40)
  )
  on conflict (id) do update set
    nom = excluded.nom, email = excluded.email, whatsapp = excluded.whatsapp, filiere = excluded.filiere,
    consentement_contact = excluded.consentement_contact, updated_at = now()
  returning (xmax = 0) into v_nouveau;
  if v_nouveau then
    perform simulateur_bcc.email_bienvenue(p_id);
  end if;
end;
$$;

create or replace function public.sbcc_enregistrer_tentative(
  p_id uuid, p_candidat_id uuid, p_filiere text, p_note_sur_20 numeric,
  p_score_qcm integer, p_score_qcm_max integer, p_score_cas numeric, p_score_cas_max integer,
  p_duree_secondes integer, p_par_section jsonb, p_par_competence jsonb
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_insere uuid;
begin
  if pg_column_size(p_par_section) > 4000 or pg_column_size(p_par_competence) > 8000 then
    raise exception 'données de tentative trop volumineuses' using errcode = '22023';
  end if;
  insert into simulateur_bcc.tentatives (
    id, candidat_id, filiere, note_sur_20, score_qcm, score_qcm_max,
    score_cas, score_cas_max, duree_secondes, par_section, par_competence
  ) values (
    p_id,
    case when exists (select 1 from simulateur_bcc.candidats where id = p_candidat_id) then p_candidat_id end,
    p_filiere, p_note_sur_20, p_score_qcm, p_score_qcm_max, p_score_cas, p_score_cas_max,
    p_duree_secondes, coalesce(p_par_section, '{}'::jsonb), coalesce(p_par_competence, '{}'::jsonb)
  )
  on conflict (id) do nothing
  returning id into v_insere;
  if v_insere is not null then
    perform simulateur_bcc.email_resultat(v_insere);
  end if;
end;
$$;

create or replace function public.sbcc_envoyer_avis(
  p_candidat_id uuid, p_note integer, p_souhaits text[], p_message text, p_contexte text default null
)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_note is null and coalesce(btrim(p_message), '') = '' and coalesce(cardinality(p_souhaits), 0) = 0 then
    raise exception 'avis vide' using errcode = '22023';
  end if;
  insert into simulateur_bcc.feedbacks (candidat_id, note, souhaits, message, contexte)
  values (
    case when exists (select 1 from simulateur_bcc.candidats where id = p_candidat_id) then p_candidat_id end,
    p_note, coalesce(p_souhaits, '{}'), nullif(btrim(coalesce(p_message, '')), ''), left(p_contexte, 40)
  );
end;
$$;

create or replace function public.sbcc_stats_publiques()
returns json language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'candidats', (select count(distinct lower(email)) from simulateur_bcc.candidats),
    'simulations', (select count(*) from simulateur_bcc.tentatives)
  );
$$;

-- -----------------------------------------------------------------------------
-- API administrateur (authenticated + sbcc_est_admin())
-- -----------------------------------------------------------------------------

create or replace function public.sbcc_stats_admin()
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  resultat json;
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  select json_build_object(
    'candidats', (select count(*) from simulateur_bcc.candidats),
    'emails_uniques', (select count(distinct lower(email)) from simulateur_bcc.candidats),
    'contacts_acceptes', (select count(*) from simulateur_bcc.candidats where consentement_contact),
    'avec_whatsapp', (select count(*) from simulateur_bcc.candidats where whatsapp is not null),
    'simulations', (select count(*) from simulateur_bcc.tentatives),
    'note_moyenne', (select round(avg(note_sur_20)::numeric, 2) from simulateur_bcc.tentatives),
    'avis', (select count(*) from simulateur_bcc.feedbacks),
    'avis_note_moyenne', (select round(avg(note)::numeric, 2) from simulateur_bcc.feedbacks where note is not null),
    'emails_envoyes', (select count(*) from simulateur_bcc.emails where statut = 'envoye'),
    'emails_en_attente_de_cle', (select count(*) from simulateur_bcc.emails where statut = 'cle_absente'),
    'par_filiere', (
      select coalesce(json_object_agg(filiere, n), '{}'::json)
      from (select filiere, count(*) n from simulateur_bcc.candidats group by filiere) f
    ),
    'inscriptions_par_jour', (
      select coalesce(json_agg(json_build_object('jour', jour, 'n', n) order by jour), '[]'::json)
      from (
        select d::date as jour, count(c.id) as n
        from generate_series(current_date - 29, current_date, interval '1 day') d
        left join simulateur_bcc.candidats c on c.created_at::date = d::date
        group by d
      ) j
    ),
    'simulations_par_jour', (
      select coalesce(json_agg(json_build_object('jour', jour, 'n', n) order by jour), '[]'::json)
      from (
        select d::date as jour, count(t.id) as n
        from generate_series(current_date - 29, current_date, interval '1 day') d
        left join simulateur_bcc.tentatives t on t.created_at::date = d::date
        group by d
      ) j
    ),
    'distribution_notes', (
      select coalesce(json_agg(json_build_object('tranche', tranche, 'n', n) order by tranche), '[]'::json)
      from (select least(floor(note_sur_20 / 2)::int, 9) as tranche, count(*) as n from simulateur_bcc.tentatives group by 1) d
    ),
    'competences', (
      select coalesce(json_agg(json_build_object('competence', competence, 'obtenu', obtenu, 'max', maxi) order by obtenu / nullif(maxi, 0)), '[]'::json)
      from (
        select key as competence, sum((value ->> 'obtenu')::numeric) as obtenu, sum((value ->> 'max')::numeric) as maxi
        from simulateur_bcc.tentatives, jsonb_each(par_competence) group by key
      ) c
    ),
    'souhaits', (
      select coalesce(json_agg(json_build_object('souhait', s, 'n', n) order by n desc), '[]'::json)
      from (select unnest(souhaits) as s, count(*) as n from simulateur_bcc.feedbacks group by 1) s
    )
  ) into resultat;
  return resultat;
end;
$$;

create or replace function public.sbcc_admin_candidats(p_limite integer default 200, p_decalage integer default 0)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  return (
    select coalesce(json_agg(l order by l.created_at desc), '[]'::json) from (
      select c.id, c.nom, c.email, c.whatsapp, c.filiere, c.consentement_contact, c.source, c.created_at,
             count(t.id) as simulations, max(t.note_sur_20) as meilleure_note
      from simulateur_bcc.candidats c
      left join simulateur_bcc.tentatives t on t.candidat_id = c.id
      group by c.id
      order by c.created_at desc
      limit least(greatest(p_limite, 1), 1000) offset greatest(p_decalage, 0)
    ) l
  );
end;
$$;

create or replace function public.sbcc_admin_tentatives(p_limite integer default 300)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  return (
    select coalesce(json_agg(l order by l.created_at desc), '[]'::json) from (
      select t.id, t.filiere, t.note_sur_20, t.duree_secondes, t.created_at,
             case when c.id is null then null else json_build_object('nom', c.nom, 'email', c.email) end as candidats
      from simulateur_bcc.tentatives t
      left join simulateur_bcc.candidats c on c.id = t.candidat_id
      order by t.created_at desc
      limit least(greatest(p_limite, 1), 1000)
    ) l
  );
end;
$$;

create or replace function public.sbcc_admin_avis(p_limite integer default 300)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  return (
    select coalesce(json_agg(l order by l.created_at desc), '[]'::json) from (
      select f.id, f.note, f.souhaits, f.message, f.contexte, f.created_at,
             case when c.id is null then null else json_build_object('nom', c.nom, 'email', c.email) end as candidats
      from simulateur_bcc.feedbacks f
      left join simulateur_bcc.candidats c on c.id = f.candidat_id
      order by f.created_at desc
      limit least(greatest(p_limite, 1), 1000)
    ) l
  );
end;
$$;

create or replace function public.sbcc_admin_emails(p_limite integer default 200)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  return (
    select coalesce(json_agg(l order by l.created_at desc), '[]'::json) from (
      select e.id, e.type, e.destinataire, e.sujet, e.statut, e.created_at,
             r.status_code as code_http
      from simulateur_bcc.emails e
      left join net._http_response r on r.id = e.requete_id
      order by e.created_at desc
      limit least(greatest(p_limite, 1), 1000)
    ) l
  );
end;
$$;

create or replace function public.sbcc_admin_supprimer_candidat(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  delete from simulateur_bcc.candidats where id = p_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution
-- -----------------------------------------------------------------------------

revoke all on all functions in schema simulateur_bcc from public, anon, authenticated;

revoke all on function public.sbcc_est_admin() from public, anon, authenticated;
revoke all on function public.sbcc_enregistrer_candidat(uuid, text, text, text, text, boolean, text) from public, anon, authenticated;
revoke all on function public.sbcc_enregistrer_tentative(uuid, uuid, text, numeric, integer, integer, numeric, integer, integer, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.sbcc_envoyer_avis(uuid, integer, text[], text, text) from public, anon, authenticated;
revoke all on function public.sbcc_stats_publiques() from public, anon, authenticated;
revoke all on function public.sbcc_stats_admin() from public, anon, authenticated;
revoke all on function public.sbcc_admin_candidats(integer, integer) from public, anon, authenticated;
revoke all on function public.sbcc_admin_tentatives(integer) from public, anon, authenticated;
revoke all on function public.sbcc_admin_avis(integer) from public, anon, authenticated;
revoke all on function public.sbcc_admin_emails(integer) from public, anon, authenticated;
revoke all on function public.sbcc_admin_supprimer_candidat(uuid) from public, anon, authenticated;

grant execute on function public.sbcc_est_admin() to anon, authenticated;
grant execute on function public.sbcc_enregistrer_candidat(uuid, text, text, text, text, boolean, text) to anon, authenticated;
grant execute on function public.sbcc_enregistrer_tentative(uuid, uuid, text, numeric, integer, integer, numeric, integer, integer, jsonb, jsonb) to anon, authenticated;
grant execute on function public.sbcc_envoyer_avis(uuid, integer, text[], text, text) to anon, authenticated;
grant execute on function public.sbcc_stats_publiques() to anon, authenticated;
grant execute on function public.sbcc_stats_admin() to authenticated;
grant execute on function public.sbcc_admin_candidats(integer, integer) to authenticated;
grant execute on function public.sbcc_admin_tentatives(integer) to authenticated;
grant execute on function public.sbcc_admin_avis(integer) to authenticated;
grant execute on function public.sbcc_admin_emails(integer) to authenticated;
grant execute on function public.sbcc_admin_supprimer_candidat(uuid) to authenticated;
