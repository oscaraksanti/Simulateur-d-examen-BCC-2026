// Bouclier avec ondes concentriques : illustration de la filière Cybersécurité.

export function ShieldPulse({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden>
      <g fill="none" stroke="var(--danger)" strokeWidth="1.5">
        <circle cx="130" cy="85" r="44" opacity=".5" className="anim-pulse-ring" />
        <circle cx="130" cy="85" r="44" opacity=".35" className="anim-pulse-ring" style={{ animationDelay: '0.8s' }} />
        <circle cx="130" cy="85" r="44" opacity=".2" className="anim-pulse-ring" style={{ animationDelay: '1.6s' }} />
      </g>
      <g opacity=".45" fill="var(--muted)" fontFamily="var(--font-mono)" fontSize="8">
        <text x="12" y="30">10.0.4.17 → 443</text>
        <text x="12" y="44">TLS 1.3 ✓</text>
        <text x="178" y="136">MFA ✓</text>
        <text x="178" y="150">SIEM · OK</text>
      </g>
      <g className="anim-float">
        <path d="M130 34 92 48v30c0 25 16.5 43 38 50 21.5-7 38-25 38-50V48l-38-14Z" fill="var(--primary-strong)" />
        <path d="M130 34v94c21.5-7 38-25 38-50V48l-38-14Z" fill="#000" opacity=".14" />
        <rect x="116" y="76" width="28" height="22" rx="4" fill="var(--surface)" />
        <path d="M121 76v-6a9 9 0 0 1 18 0v6" fill="none" stroke="var(--surface)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="130" cy="86" r="3.2" fill="var(--danger)" />
        <rect x="128.6" y="87" width="2.8" height="6" rx="1.2" fill="var(--danger)" />
      </g>
    </svg>
  );
}
