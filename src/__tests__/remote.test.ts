import { describe, expect, it } from 'vitest';
import { enfiler, nouvelId, syncConfiguree } from '@/lib/remote';
import { valider } from '@/components/onboarding/RegistrationForm';

describe('synchronisation', () => {
  it('reste désactivée sans variables Supabase', () => {
    expect(syncConfiguree()).toBe(false);
  });

  it('n’empile rien quand la synchronisation est désactivée', () => {
    enfiler({ type: 'avis', params: { p_candidat_id: null, p_note: 5, p_souhaits: [], p_message: null, p_contexte: null } });
    expect(localStorage.getItem('simbcc:file-attente-v1')).toBeNull();
  });

  it('génère des UUID v4 uniques', () => {
    const ids = new Set(Array.from({ length: 50 }, () => nouvelId()));
    expect(ids.size).toBe(50);
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe('validation de l’inscription', () => {
  it('accepte un profil complet', () => {
    expect(valider('Grâce Mbuyi', 'grace@example.com', 'data', '+243 970 000 000', true, true)).toEqual({});
  });
  it('signale chaque champ invalide', () => {
    const e = valider('G', 'pas-un-email', null, '12', true, false);
    expect(Object.keys(e).sort()).toEqual(['consentement', 'email', 'filiere', 'nom', 'whatsapp']);
  });
  it('le WhatsApp est facultatif', () => {
    expect(valider('Grâce Mbuyi', 'grace@example.com', 'cyber', '')).toEqual({});
  });
});
