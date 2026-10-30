// Bandeau défilant des compétences évaluées (CSS pur, en pause si « réduire les animations »).

const LIGNE_1 = ['SQL', 'Python & pandas', 'Power BI · DAX', 'Statistiques', 'Index & transactions', 'Sauvegarde & PITR', 'Réplication', 'Linux', 'Active Directory', 'Virtualisation', 'Scripts Bash & PowerShell', 'RAID'];
const LIGNE_2 = ['Sous-réseaux & VLSM', 'VLAN & routage', 'Fibre & 4G', 'Cryptographie', 'OWASP Top 10', 'SIEM', 'Algorithmique', 'API REST', 'Git & CI/CD', 'ITIL', 'Dépannage poste', 'Culture BCC', 'Logique'];

function Ligne({ elements, inverse }: { elements: string[]; inverse?: boolean }) {
  const contenu = [...elements, ...elements];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <ul className={`flex shrink-0 gap-3 pr-3 ${inverse ? 'anim-marquee-inverse' : 'anim-marquee'}`}>
        {contenu.map((e, i) => (
          <li
            key={`${e}-${i}`}
            aria-hidden={i >= elements.length}
            className="whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] text-muted"
          >
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsMarquee() {
  return (
    <div className="space-y-3">
      <Ligne elements={LIGNE_1} />
      <Ligne elements={LIGNE_2} inverse />
    </div>
  );
}
