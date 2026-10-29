-- =============================================================================
-- Simulateur BCC — réglages e-mail depuis /admin
--  * sbcc_admin_config_email()       : état (clé présente ou non — jamais sa valeur), expéditeur, réponse, site
--  * sbcc_admin_definir_cle_resend() : enregistre / remplace la clé Resend dans Vault (secret sbcc_resend_api_key)
--  * sbcc_admin_email_test()         : envoie un e-mail de test à l'adresse du compte administrateur connecté
-- La clé passe directement du navigateur de l'administrateur à Vault (HTTPS) ; elle n'est jamais relue.
-- =============================================================================

alter table simulateur_bcc.emails drop constraint if exists emails_type_check;
alter table simulateur_bcc.emails add constraint emails_type_check check (type in ('bienvenue', 'resultat', 'test'));

create or replace function public.sbcc_admin_config_email()
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  return json_build_object(
    'cle_configuree', exists (select 1 from vault.secrets where name = 'sbcc_resend_api_key'),
    'expediteur', simulateur_bcc.parametre('expediteur'),
    'repondre_a', simulateur_bcc.parametre('repondre_a'),
    'site', simulateur_bcc.parametre('site'),
    'admin_email', (select email from auth.users where id = auth.uid())
  );
end;
$$;

create or replace function public.sbcc_admin_definir_cle_resend(p_cle text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  if p_cle is null or btrim(p_cle) !~ '^re_[A-Za-z0-9_-]{16,}$' then
    raise exception 'clé Resend invalide (elle commence par re_)' using errcode = '22023';
  end if;
  select id into v_id from vault.secrets where name = 'sbcc_resend_api_key' limit 1;
  if v_id is null then
    perform vault.create_secret(btrim(p_cle), 'sbcc_resend_api_key', 'Clé Resend du Simulateur BCC');
  else
    perform vault.update_secret(v_id, btrim(p_cle), 'sbcc_resend_api_key', 'Clé Resend du Simulateur BCC');
  end if;
end;
$$;

create or replace function public.sbcc_admin_email_test()
returns json language plpgsql security definer set search_path = '' as $$
declare
  v_email text;
  v_corps text;
begin
  if not public.sbcc_est_admin() then
    raise exception 'accès réservé aux administrateurs' using errcode = '42501';
  end if;
  select email into v_email from auth.users where id = auth.uid();
  if v_email is null then
    raise exception 'adresse de l''administrateur introuvable' using errcode = '22023';
  end if;
  if (select count(*) from simulateur_bcc.emails where type = 'test' and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'trop d''e-mails de test, réessaie dans une heure' using errcode = '22023';
  end if;
  v_corps := '<h1 style="margin:0 0 12px;font-size:22px;letter-spacing:-0.02em;">E-mail de test réussi ✅</h1>'
    || '<p style="margin:0 0 12px;">Les e-mails du Simulateur BCC partent correctement via Resend.</p>'
    || '<p style="margin:0 0 4px;font-size:14px;color:#5d6577;">Expéditeur : ' || simulateur_bcc.html(simulateur_bcc.parametre('expediteur')) || '</p>'
    || '<p style="margin:0;font-size:14px;color:#5d6577;">Réponses vers : ' || simulateur_bcc.html(simulateur_bcc.parametre('repondre_a')) || '</p>';
  perform simulateur_bcc.envoyer_email(null, 'test', v_email, 'Test d''envoi — Simulateur BCC', simulateur_bcc.gabarit('Test', v_corps));
  return json_build_object('destinataire', v_email);
end;
$$;

revoke all on function public.sbcc_admin_config_email() from public, anon, authenticated;
revoke all on function public.sbcc_admin_definir_cle_resend(text) from public, anon, authenticated;
revoke all on function public.sbcc_admin_email_test() from public, anon, authenticated;
grant execute on function public.sbcc_admin_config_email() to authenticated;
grant execute on function public.sbcc_admin_definir_cle_resend(text) to authenticated;
grant execute on function public.sbcc_admin_email_test() to authenticated;
