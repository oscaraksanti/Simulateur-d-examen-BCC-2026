'use client';

import { useRef, useState } from 'react';
import { Briefcase, Copy, Download, Loader2, MessageCircle, Send, Share2, Swords } from 'lucide-react';
import { lienDefi, lienWhatsApp, liensReseaux, texteDefi, texteWhatsApp, urlSite } from '@/lib/share';
import type { Filiere, Mention } from '@/lib/types';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ShareCard } from './ShareCard';

interface ShareButtonsProps {
  prenom: string;
  note: number;
  filiere: Filiere;
  mention: Mention;
}

const ECHELLE = 0.26;

async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return false;
  }
}

/** Partage viral : WhatsApp, Web Share API (ou copie), réseaux, défi, carte téléchargeable. */
export function ShareButtons({ prenom, note, filiere, mention }: ShareButtonsProps) {
  const site = urlSite();
  const lienSite = site.startsWith('http') ? site : typeof window !== 'undefined' ? window.location.origin + site : site;
  const texte = texteWhatsApp(note, filiere, lienSite);
  const reseaux = liensReseaux(`${lienSite}?ref=social`, texte);
  const toast = useToast();
  const carte = useRef<HTMLDivElement>(null);
  const [export_, setExport] = useState(false);

  const partager = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Simulateur BCC', text: texte, url: `${lienSite}?ref=share` });
        return;
      } catch {
        // partage annulé : on retombe sur la copie
      }
    }
    toast((await copier(`${lienSite}?ref=lien`)) ? 'Lien copié dans le presse-papiers' : 'Impossible de copier le lien', 'succes');
  };

  const defier = async () => {
    const t = texteDefi(note, filiere, lienSite);
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Défi Simulateur BCC', text: t, url: lienDefi(note, filiere, lienSite) });
        return;
      } catch {
        // annulé
      }
    }
    window.open(lienWhatsApp(t), '_blank', 'noopener,noreferrer');
  };

  const telecharger = async () => {
    if (!carte.current) return;
    setExport(true);
    try {
      const { toPng } = await import('html-to-image');
      const url = await toPng(carte.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        cacheBust: true,
        style: { transform: 'none' },
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = `simulateur-bcc-${String(note).replace('.', '-')}-sur-20.png`;
      a.click();
      toast('Carte téléchargée : publie-la en statut WhatsApp ou sur LinkedIn !');
    } catch {
      toast('Le téléchargement a échoué. Fais une capture d’écran de la carte.', 'erreur');
    } finally {
      setExport(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
      {/* Aperçu de la carte (réduite), capturée en taille réelle */}
      <div className="mx-auto overflow-hidden rounded-2xl shadow-lift" style={{ width: 1080 * ECHELLE, height: 1350 * ECHELLE }}>
        <div style={{ transform: `scale(${ECHELLE})`, transformOrigin: 'top left' }}>
          <ShareCard ref={carte} prenom={prenom} note={note} filiere={filiere} mention={mention} site={lienSite} />
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">Partage ton score, aide un ami à se préparer</h3>
          <p className="mt-1 text-sm text-muted">Le simulateur est gratuit : plus il circule, plus de candidats congolais arrivent prêts au test.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ButtonLink href={lienWhatsApp(texte)} externe variante="whatsapp" taille="lg" icone={<MessageCircle aria-hidden className="size-5" />}>
            Partager sur WhatsApp
          </ButtonLink>
          <Button variante="accent" taille="lg" onClick={defier} icone={<Swords aria-hidden className="size-5" />}>
            Défier un ami
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variante="secondaire" taille="sm" onClick={partager} icone={<Share2 aria-hidden className="size-4" />}>
            Partager / copier le lien
          </Button>
          <Button variante="secondaire" taille="sm" onClick={telecharger} disabled={export_} icone={export_ ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Download aria-hidden className="size-4" />}>
            Télécharger ma carte
          </Button>
          <Button
            variante="secondaire"
            taille="sm"
            onClick={async () => toast((await copier(texte)) ? 'Message copié' : 'Impossible de copier', 'succes')}
            icone={<Copy aria-hidden className="size-4" />}
          >
            Copier le message
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Aussi sur :</span>
          <a href={reseaux.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium text-ink hover:border-primary">
            <Briefcase aria-hidden className="size-4" /> LinkedIn
          </a>
          <a href={reseaux.facebook} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 font-medium text-ink hover:border-primary">
            Facebook
          </a>
          <a href={reseaux.x} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 font-medium text-ink hover:border-primary">
            X
          </a>
          <a href={reseaux.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium text-ink hover:border-primary">
            <Send aria-hidden className="size-4" /> Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
