-- Simulateur BCC — migration 0003 : les 7 domaines du recrutement informatique 2026.
-- Ajoute bdd, systemes, reseaux, dev, support aux filières acceptées et centralise leur libellé
-- (e-mails de bienvenue et de résultats). Libellés identiques à src/lib/filieres.ts.

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
    else p_filiere
  end
$$;
revoke all on function simulateur_bcc.libelle_filiere(text) from public, anon, authenticated;

alter table simulateur_bcc.candidats drop constraint if exists candidats_filiere_check;
alter table simulateur_bcc.candidats add constraint candidats_filiere_check
  check (filiere in ('data', 'cyber', 'bdd', 'systemes', 'reseaux', 'dev', 'support'));

alter table simulateur_bcc.tentatives drop constraint if exists tentatives_filiere_check;
alter table simulateur_bcc.tentatives add constraint tentatives_filiere_check
  check (filiere in ('data', 'cyber', 'bdd', 'systemes', 'reseaux', 'dev', 'support'));

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
  v_filiere := simulateur_bcc.libelle_filiere(c.filiere);
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
    simulateur_bcc.libelle_filiere(t.filiere),
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
