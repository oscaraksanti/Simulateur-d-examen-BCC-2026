'use client';

import { forwardRef } from 'react';
import type { Filiere, Mention } from '@/lib/types';
import { formatNote, LIBELLES_FILIERE } from '@/lib/share';

interface ShareCardProps {
  prenom: string;
  note: number;
  filiere: Filiere;
  mention: Mention;
  site: string;
}

// Couleurs fixes (indépendantes du thème) pour une image exportée identique partout.
const C = {
  fond: '#07111F',
  surface: '#0E1A2B',
  bleu: '#3D9BFF',
  jaune: '#F7C600',
  rouge: '#CE1021',
  texte: '#E8EEF7',
  doux: '#9AABC2',
};

function guilloche(): string[] {
  return Array.from({ length: 26 }, (_, i) => {
    let d = '';
    for (let x = 0; x <= 1080; x += 18) {
      const y = 80 + i * 48 + 30 * Math.sin((x / 1080) * Math.PI * 4 + i * 0.5) + 10 * Math.sin((x / 1080) * Math.PI * 13 + i);
      d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
    }
    return d;
  });
}
const lignes = guilloche();

/** Carte de score 1080×1350 (format statut WhatsApp / LinkedIn), exportée en PNG via html-to-image. */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard({ prenom, note, filiere, mention, site }, ref) {
  const pct = note / 20;
  const R = 230;
  const circ = 2 * Math.PI * R;
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1350,
        background: `radial-gradient(1200px 700px at 85% -10%, #12345E 0%, ${C.fond} 60%)`,
        color: C.texte,
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg width="1080" height="1350" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} aria-hidden>
        {lignes.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={C.bleu} strokeWidth="1.5" />
        ))}
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, display: 'flex' }}>
        <div style={{ flex: 6, background: C.bleu }} />
        <div style={{ flex: 1.5, background: C.jaune }} />
        <div style={{ flex: 2.5, background: C.rouge }} />
      </div>

      <div style={{ position: 'relative', padding: '90px 90px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <svg width="74" height="74" viewBox="0 0 32 32" aria-hidden>
            <path d="M16 2.5 4.5 6.8v8.4c0 7.2 4.9 12.4 11.5 14.3 6.6-1.9 11.5-7.1 11.5-14.3V6.8L16 2.5Z" fill={C.bleu} />
            <path d="m9.5 19.5 4.2-4.6 3.4 2.6 5.4-6.3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.5" cy="19.5" r="1.7" fill={C.jaune} />
            <circle cx="22.5" cy="11.2" r="1.9" fill={C.jaune} />
          </svg>
          <div>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>Simulateur BCC</div>
            <div style={{ fontSize: 28, color: C.doux }}>Prépa informatique · 2026</div>
          </div>
        </div>

        <div style={{ marginTop: 90, fontSize: 40, color: C.doux }}>{prenom} a obtenu</div>

        <div style={{ position: 'relative', width: 520, height: 520, margin: '40px auto 0' }}>
          <svg width="520" height="520" viewBox="0 0 520 520" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
            <circle cx="260" cy="260" r={R} fill="none" stroke={C.surface} strokeWidth="34" />
            <circle cx="260" cy="260" r={R} fill="none" stroke={C.jaune} strokeWidth="34" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 190, fontWeight: 800, lineHeight: 1, letterSpacing: -6, fontVariantNumeric: 'tabular-nums' }}>{formatNote(note)}</div>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 54, color: C.doux }}>/20</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 50 }}>
          <span style={{ background: C.jaune, color: '#0B1B33', borderRadius: 999, padding: '14px 34px', fontSize: 36, fontWeight: 800 }}>{mention}</span>
          <span style={{ border: `3px solid ${C.bleu}`, color: C.texte, borderRadius: 999, padding: '11px 34px', fontSize: 36, fontWeight: 700 }}>
            {LIBELLES_FILIERE[filiere]}
          </span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 90, right: 90, bottom: 80 }}>
        <div style={{ fontSize: 34, fontWeight: 700 }}>Et toi, combien tu fais ? 👉 {site.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
        <div style={{ marginTop: 18, fontSize: 24, color: C.doux }}>
          Un outil Datalendo · indépendant, non affilié à la Banque Centrale du Congo.
        </div>
      </div>
    </div>
  );
});
