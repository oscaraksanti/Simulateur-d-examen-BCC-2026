// Textes et liens de partage (WhatsApp, réseaux sociaux, défi entre amis) — fonctions pures.

import { OSCAR } from '@/data/resources';
import { FILIERES, estFiliere } from './filieres';
import type { Filiere } from './types';

export const LIBELLES_FILIERE = Object.fromEntries(FILIERES.map((f) => [f.id, f.nom])) as Record<Filiere, string>;

/** URL publique du site, normalisée avec une barre finale. */
export function urlSite(brute: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  const base = (brute ?? '').trim().replace(/\/+$/, '');
  return base ? `${base}/` : '/';
}

/** Formate une note au format français : 14.5 → « 14,5 », 15 → « 15 ». */
export function formatNote(note: number): string {
  return Number.isInteger(note) ? String(note) : note.toFixed(1).replace('.', ',');
}

export function texteWhatsApp(note: number, filiere: Filiere, site: string = urlSite()): string {
  return `🏦 J'ai obtenu ${formatNote(note)}/20 au Simulateur BCC (${LIBELLES_FILIERE[filiere]}) ! 💪 Le recrutement BCC arrive, prépare-toi gratuitement ici : ${site}?ref=wa`;
}

export function lienWhatsApp(texte: string): string {
  return `https://wa.me/?text=${encodeURIComponent(texte)}`;
}

export function texteDefi(note: number, filiere: Filiere, site: string = urlSite()): string {
  return `Je te défie de battre mon ${formatNote(note)}/20 au Simulateur BCC 👉 ${lienDefi(note, filiere, site)}`;
}

export function lienDefi(note: number, filiere: Filiere, site: string = urlSite()): string {
  return `${site}?defi=${encodeURIComponent(String(note))}&f=${filiere}`;
}

export function messageOscar(note: number, filiere: Filiere): string {
  return `Bonjour Oscar, je viens d'obtenir ${formatNote(note)}/20 au simulateur BCC (${LIBELLES_FILIERE[filiere]}). Je veux me former pour réussir le recrutement.`;
}

export function lienWhatsAppOscar(note: number, filiere: Filiere): string {
  return `https://wa.me/${OSCAR.whatsappNumero}?text=${encodeURIComponent(messageOscar(note, filiere))}`;
}

export function liensReseaux(site: string, texte: string) {
  const url = encodeURIComponent(site);
  const t = encodeURIComponent(texte);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://x.com/intent/post?text=${t}`,
    telegram: `https://t.me/share/url?url=${url}&text=${t}`,
  } as const;
}

export interface Defi {
  note: number;
  filiere: Filiere | null;
}

/** Lit un défi depuis les paramètres d'URL (?defi=14.5&f=data). Renvoie null si invalide. */
export function lireDefi(params: URLSearchParams): Defi | null {
  const brut = params.get('defi');
  if (brut === null) return null;
  const note = Number(brut.replace(',', '.'));
  if (!Number.isFinite(note) || note < 0 || note > 20 || Math.round(note * 2) !== note * 2) return null;
  const f = params.get('f');
  return { note, filiere: estFiliere(f) ? f : null };
}
