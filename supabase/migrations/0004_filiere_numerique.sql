-- Simulateur BCC — migration 0004 : 8e filière « Numérique » (professionnel du numérique).
-- Libellés identiques à src/lib/filieres.ts.

create or replace function simulateur_bcc.libelle_filiere(p_filiere text)
returns text language sql immutable set search_path = '' as $$
  select case p_filiere
    when 'data' then 'Data Analyse'
    when 'cyber' then 'Cybersécurité'
    when 'bdd' then 'Bases de données'
    when 'systemes' then 'Administration systèmes'
    when 'reseaux' then 'Réseaux & télécoms'
    when 'dev' then 'Développement logiciel'
    when 'support' then 'Support IT'
    when 'numerique' then 'Numérique'
    else p_filiere
  end
$$;
revoke all on function simulateur_bcc.libelle_filiere(text) from public, anon, authenticated;

alter table simulateur_bcc.candidats drop constraint if exists candidats_filiere_check;
alter table simulateur_bcc.candidats add constraint candidats_filiere_check
  check (filiere in ('data', 'cyber', 'bdd', 'systemes', 'reseaux', 'dev', 'support', 'numerique'));

alter table simulateur_bcc.tentatives drop constraint if exists tentatives_filiere_check;
alter table simulateur_bcc.tentatives add constraint tentatives_filiere_check
  check (filiere in ('data', 'cyber', 'bdd', 'systemes', 'reseaux', 'dev', 'support', 'numerique'));
