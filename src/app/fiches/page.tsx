import type { Metadata } from 'next';
import { AlertTriangle, BookMarked, BrainCircuit, CalendarCheck, Landmark, ShieldCheck } from 'lucide-react';
import { bccFacts, categoriesFaits, type CategorieFait } from '@/data/bccFacts';
import { PaymentFlowInfographic } from '@/components/illustrations/PaymentFlowInfographic';
import { PolicyRateTimeline } from '@/components/illustrations/PolicyRateTimeline';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Fiches de révision & jour J',
  description: 'Mémo culture BCC sourcé, formules data, repères cybersécurité et conseils pour le jour du test de recrutement.',
};

const formulesData: { titre: string; formule: string; note: string }[] = [
  { titre: 'Variation en %', formule: '(V_fin − V_début) / V_début × 100', note: 'Toujours diviser par la valeur de DÉPART.' },
  { titre: 'Hausses successives', formule: '(1 + t₁) × (1 + t₂) − 1', note: '+10 % puis −10 % ≠ 0 % : on obtient −1 %.' },
  { titre: 'Inflation en glissement annuel', formule: '(IPC_t / IPC_t−12 − 1) × 100', note: 'Compare un mois au même mois de l’année précédente.' },
  { titre: 'Taux réel (Fisher, approx.)', formule: 'taux réel ≈ taux nominal − inflation', note: 'Formule exacte : (1 + n) / (1 + π) − 1.' },
  { titre: 'Cotation « 1 USD = X CDF »', formule: 'X augmente ⇒ le CDF se déprécie', note: 'Valeur du CDF en USD = 1/X : le sens de la cotation compte.' },
  { titre: 'Moyenne mobile (k périodes)', formule: 'moyenne des k dernières valeurs', note: 'Lisse le bruit, mais introduit un retard.' },
  { titre: 'z-score', formule: 'z = (x − μ) / σ', note: '|z| > 3 : valeur très atypique si la distribution est ~normale.' },
  { titre: 'Règle de l’IQR', formule: 'x < Q1 − 1,5×IQR ou x > Q3 + 1,5×IQR', note: 'IQR = Q3 − Q1 ; robuste aux valeurs extrêmes.' },
  { titre: 'Ordre logique SQL', formule: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY', note: 'D’où : pas d’agrégat dans WHERE, filtre d’agrégat dans HAVING.' },
  { titre: 'Corrélation ≠ causalité', formule: 'r mesure un lien LINÉAIRE, pas une cause', note: 'Cherche la variable confondante et le biais de sélection.' },
];

const reperesCyber: { titre: string; contenu: string }[] = [
  { titre: 'Triade CIA', contenu: 'Confidentialité, Intégrité, Disponibilité. Un DDoS vise la disponibilité ; une fuite, la confidentialité.' },
  { titre: 'Cycle NIST SP 800-61', contenu: 'Préparation → Détection & analyse → Confinement, éradication & rétablissement → Activité post-incident (retour d’expérience).' },
  { titre: 'Ports à connaître', contenu: '22 SSH · 25 SMTP · 53 DNS · 80 HTTP · 443 HTTPS · 445 SMB · 1433 MS SQL · 3389 RDP.' },
  { titre: 'Symétrique vs asymétrique', contenu: 'Symétrique (AES) : une clé partagée, rapide. Asymétrique (RSA, ECC) : paire de clés ; signature avec la clé PRIVÉE de l’émetteur, vérification avec sa clé publique.' },
  { titre: 'Mots de passe', contenu: 'Jamais en clair ni en simple hachage rapide : hachage lent et salé (bcrypt, Argon2). MFA résistante au phishing (FIDO2) > SMS.' },
  { titre: 'RPO / RTO', contenu: 'RPO : perte de données maximale admissible (en temps). RTO : durée maximale d’interruption admissible.' },
  { titre: 'Sauvegardes 3-2-1', contenu: '3 copies, 2 supports différents, 1 copie hors site — idéalement hors ligne ou immuable contre les ransomwares.' },
  { titre: 'PCI-DSS', contenu: 'Interdit de stocker CVV, piste magnétique ou PIN après autorisation. PAN affiché masqué (au plus 6 premiers et 4 derniers chiffres).' },
  { titre: 'Preuves numériques', contenu: 'Respecter l’ordre de volatilité (mémoire avant disque) : isoler du réseau sans éteindre, tracer la chaîne de conservation.' },
  { titre: 'Moindre privilège', contenu: 'Chacun n’a que les droits nécessaires à sa mission ; séparation des tâches entre saisie et validation d’un paiement.' },
];

const conseilsJourJ: { titre: string; contenu: string }[] = [
  { titre: 'Gère ton temps', contenu: 'Environ une minute par question de QCM. Si tu bloques, marque la question, avance, et reviens à la fin.' },
  { titre: 'Lis les mots-clés', contenu: '« PREMIÈRE action », « NE… PAS », « toujours », « principal » : ils changent la bonne réponse. Relis l’énoncé avant de valider.' },
  { titre: 'Élimine les distracteurs', contenu: 'Écarte d’abord les options manifestement fausses : tu passes souvent de 25 % à 50 % de chances, puis tu raisonnes.' },
  { titre: 'Renseigne-toi sur le barème', contenu: 'Ce simulateur n’a pas de points négatifs. Le jour J, applique les consignes annoncées par les organisateurs.' },
  { titre: 'Structure tes cas pratiques', contenu: 'Constat (ce que disent les données/logs) → analyse → décision priorisée → communication. Justifie toujours par les faits.' },
  { titre: 'Prépare l’entretien', contenu: 'Méthode STAR (Situation, Tâche, Action, Résultat). Relie ta motivation à la mission de la BCC : la stabilité du niveau général des prix.' },
  { titre: 'Éthique & confidentialité', contenu: 'Une banque centrale manipule des données sensibles : discrétion, intégrité et respect des procédures sont attendus à chaque réponse.' },
  { titre: 'Logistique', contenu: 'Vérifie la convocation officielle (lieu, heure, pièces demandées) et arrive en avance pour rester serein.' },
];

const ordre: CategorieFait[] = ['institution', 'gouvernance', 'politique_monetaire', 'paiements', 'recrutement'];

export default function PageFiches() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6">
      <header className="max-w-3xl">
        <Badge ton="accent">
          <BookMarked aria-hidden className="size-3.5" /> Fiches de révision
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">L&apos;essentiel à réviser avant le test</h1>
        <p className="mt-2 leading-relaxed text-muted">
          Un mémo à relire la veille : culture BCC sourcée, formules data, repères cybersécurité et méthode pour le jour J.
        </p>
      </header>

      {/* Culture BCC */}
      <section aria-labelledby="fiche-bcc">
        <h2 id="fiche-bcc" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
          <Landmark aria-hidden className="size-6 text-primary-strong" /> Mémo culture BCC
        </h2>
        <p className="mt-1 text-sm text-muted">{bccFacts.avertissement}</p>
        <div className="mt-6 gap-4 md:columns-2">
          {ordre.map((cat, i) => (
            <Reveal key={cat} delai={i * 0.04} className="mb-4 break-inside-avoid">
              <Card>
                <h3 className="font-semibold text-ink">{categoriesFaits[cat]}</h3>
                <ul className="mt-3 space-y-3">
                  {bccFacts.faits
                    .filter((f) => f.categorie === cat)
                    .map((f) => (
                      <li key={f.id} className="text-sm leading-relaxed">
                        <p className="text-ink">{f.texte}</p>
                        <p className="mt-0.5 text-xs text-muted">Source : {f.source}</p>
                      </li>
                    ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <h3 className="font-semibold text-ink">Taux directeur 2026</h3>
            <div className="mt-4">
              <PolicyRateTimeline />
            </div>
          </Card>
          <Card padding="lg">
            <h3 className="font-semibold text-ink">Chaîne des paiements électroniques</h3>
            <div className="mt-4">
              <PaymentFlowInfographic vertical />
            </div>
          </Card>
        </div>
      </section>

      {/* Data */}
      <section aria-labelledby="fiche-data">
        <h2 id="fiche-data" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
          <BrainCircuit aria-hidden className="size-6 text-primary-strong" /> Formules &amp; réflexes Data
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {formulesData.map((f) => (
            <div key={f.titre} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold text-ink">{f.titre}</p>
              <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 font-mono text-[13px] text-primary-strong [overflow-wrap:anywhere]">{f.formule}</p>
              <p className="mt-2 text-sm text-muted">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cyber */}
      <section aria-labelledby="fiche-cyber">
        <h2 id="fiche-cyber" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
          <ShieldCheck aria-hidden className="size-6 text-danger" /> Repères Cybersécurité
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {reperesCyber.map((r) => (
            <div key={r.titre} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold text-ink">{r.titre}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.contenu}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Jour J */}
      <section aria-labelledby="fiche-jourj">
        <h2 id="fiche-jourj" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
          <CalendarCheck aria-hidden className="size-6 text-success-ink" /> Méthode pour le jour J
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {conseilsJourJ.map((c, i) => (
            <li key={c.titre} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success-soft font-mono text-sm font-bold text-success-ink">{i + 1}</span>
              <span>
                <span className="block text-sm font-semibold text-ink">{c.titre}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{c.contenu}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm leading-relaxed text-ink">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
          <p>
            <strong>Attention aux arnaques.</strong> Les candidatures officielles se font uniquement via le site officiel de la
            BCC (bcc.cd). Méfie-toi des faux avis de recrutement, des domaines qui imitent celui de la BCC et de toute personne
            qui te demande de l&apos;argent pour « faciliter » ton recrutement.
          </p>
        </div>
      </section>

      <div className="flex justify-center">
        <ButtonLink href="/examen/" taille="lg">
          Tester mes connaissances en conditions réelles
        </ButtonLink>
      </div>
    </div>
  );
}
