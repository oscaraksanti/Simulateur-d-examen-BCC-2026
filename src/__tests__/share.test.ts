import { describe, expect, it } from 'vitest';
import {
  formatNote,
  lienDefi,
  lienWhatsApp,
  lienWhatsAppOscar,
  lireDefi,
  texteDefi,
  texteWhatsApp,
  urlSite,
} from '@/lib/share';

const SITE = 'https://simulateur-bcc.vercel.app/';

describe('urlSite', () => {
  it('normalise la barre finale', () => {
    expect(urlSite('https://exemple.app')).toBe('https://exemple.app/');
    expect(urlSite('https://exemple.app///')).toBe('https://exemple.app/');
    expect(urlSite('')).toBe('/');
  });
});

describe('textes de partage', () => {
  it('formate la note à la française', () => {
    expect(formatNote(14.5)).toBe('14,5');
    expect(formatNote(15)).toBe('15');
  });

  it('construit le texte WhatsApp attendu', () => {
    expect(texteWhatsApp(14.5, 'data', SITE)).toBe(
      "🏦 J'ai obtenu 14,5/20 au Simulateur BCC (Data Analyse) ! 💪 Le recrutement BCC arrive, prépare-toi gratuitement ici : https://simulateur-bcc.vercel.app/?ref=wa",
    );
  });

  it('encode correctement le lien wa.me', () => {
    const texte = texteWhatsApp(12, 'cyber', SITE);
    const lien = lienWhatsApp(texte);
    expect(lien.startsWith('https://wa.me/?text=')).toBe(true);
    expect(lien).not.toContain(' ');
    expect(lien).toContain('%3Fref%3Dwa');
    expect(decodeURIComponent(lien.replace('https://wa.me/?text=', ''))).toBe(texte);
  });

  it('construit le message pour Oscar', () => {
    const lien = lienWhatsAppOscar(11, 'cyber');
    expect(lien.startsWith('https://wa.me/243971601855?text=')).toBe(true);
    expect(decodeURIComponent(lien.split('?text=')[1])).toBe(
      "Bonjour Oscar, je viens d'obtenir 11/20 au simulateur BCC (Cybersécurité). Je veux me former pour réussir le recrutement.",
    );
  });

  it('construit le défi entre amis', () => {
    expect(lienDefi(13.5, 'data', SITE)).toBe('https://simulateur-bcc.vercel.app/?defi=13.5&f=data');
    expect(texteDefi(13.5, 'data', SITE)).toContain('Je te défie de battre mon 13,5/20');
  });
});

describe('lireDefi', () => {
  it('lit un défi valide', () => {
    expect(lireDefi(new URLSearchParams('defi=13.5&f=cyber'))).toEqual({ note: 13.5, filiere: 'cyber' });
  });
  it('rejette les valeurs invalides', () => {
    expect(lireDefi(new URLSearchParams('defi=25'))).toBeNull();
    expect(lireDefi(new URLSearchParams('defi=abc'))).toBeNull();
    expect(lireDefi(new URLSearchParams('defi=13.3'))).toBeNull();
    expect(lireDefi(new URLSearchParams(''))).toBeNull();
  });
});
