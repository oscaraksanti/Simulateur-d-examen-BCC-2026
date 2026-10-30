import type { Metadata } from 'next';
import { AlertTriangle, BookMarked, BrainCircuit, CalendarCheck, Landmark, ShieldCheck } from 'lucide-react';
import { bccFacts, categoriesFaits, type CategorieFait } from '@/data/bccFacts';
import { PaymentFlowInfographic } from '@/components/illustrations/PaymentFlowInfographic';
import { PolicyRateTimeline } from '@/components/illustrations/PolicyRateTimeline';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { ICONES_FILIERE } from '@/components/ui/IconeFiliere';
import type { Filiere } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Fiches de révision & jour J',
  description: 'Mémo culture BCC sourcé, repères des 8 domaines (data, cyber, bases de données, systèmes, réseaux, développement, support IT, numérique) et conseils pour le jour du test.',
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

const reperesFilieres: { filiere: Filiere; titre: string; reperes: { titre: string; contenu: string }[] }[] = [
  {
    filiere: 'bdd',
    titre: 'Repères Bases de données',
    reperes: [
      { titre: 'ACID', contenu: 'Atomicité (tout ou rien), Cohérence (contraintes respectées), Isolation (transactions concurrentes sans interférence), Durabilité (validé = conservé, même après une panne).' },
      { titre: 'Niveaux d’isolation', contenu: 'READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE. Anomalies à connaître : lecture sale, lecture non répétable, lecture fantôme.' },
      { titre: 'Types de sauvegarde', contenu: 'Complète ; différentielle = changements depuis la dernière COMPLÈTE ; incrémentale = depuis la dernière sauvegarde, quelle qu’elle soit. Une sauvegarde jamais restaurée n’est pas une sauvegarde.' },
      { titre: 'Restauration à un instant (PITR)', contenu: 'Restaurer la dernière complète puis rejouer les journaux de transactions (WAL, redo logs) jusqu’à l’instant voulu, juste avant l’erreur.' },
      { titre: 'Index', contenu: 'Accélère les lectures sélectives mais ralentit les écritures. Index composite : l’ordre des colonnes compte (préfixe de gauche). Lis le plan d’exécution (EXPLAIN) avant d’agir.' },
      { titre: 'Formes normales', contenu: '1FN : valeurs atomiques. 2FN : pas de dépendance à une partie de la clé. 3FN : pas de dépendance entre attributs non-clés (dépendance transitive).' },
      { titre: 'Réplication', contenu: 'Synchrone : aucune perte des transactions validées, mais latence. Asynchrone : rapide, mais les dernières transactions peuvent être perdues lors d’une bascule.' },
    ],
  },
  {
    filiere: 'systemes',
    titre: 'Repères Administration systèmes',
    reperes: [
      { titre: 'Droits Linux en octal', contenu: 'r = 4, w = 2, x = 1. 750 = rwxr-x--- (propriétaire tout, groupe lecture + exécution, autres rien). 644 est courant pour un fichier, 755 pour un répertoire.' },
      { titre: 'RAID', contenu: 'RAID 1 : miroir. RAID 5 : capacité de n−1 disques, tolère 1 panne. RAID 6 : n−2 disques, tolère 2 pannes. RAID 10 : 50 % utile. Le RAID protège du matériel, pas d’une suppression : ce n’est pas une sauvegarde.' },
      { titre: 'Snapshot ≠ sauvegarde', contenu: 'Un snapshot de VM dépend du stockage d’origine et sert à un retour arrière rapide (avant une mise à jour). La sauvegarde est une copie indépendante, idéalement hors site.' },
      { titre: 'GPO : ordre LSDOU', contenu: 'Local → Site → Domaine → Unité d’organisation. La dernière stratégie appliquée l’emporte en cas de conflit. Vérification : gpresult /r ; application immédiate : gpupdate /force.' },
      { titre: 'Charge d’un serveur Linux', contenu: 'Le load average se lit par rapport au nombre de cœurs : 4,0 sur 8 cœurs est confortable, sur 2 cœurs le système est saturé.' },
      { titre: 'Enregistrements DNS', contenu: 'A (IPv4), AAAA (IPv6), CNAME (alias), MX (serveur de messagerie), PTR (résolution inverse), TXT (SPF, DKIM, DMARC).' },
      { titre: 'DHCP : DORA', contenu: 'Discover → Offer → Request → Acknowledge. Un poste en 169.254.x.x n’a reçu aucune réponse DHCP.' },
    ],
  },
  {
    filiere: 'reseaux',
    titre: 'Repères Réseaux & télécoms',
    reperes: [
      { titre: 'Modèle OSI', contenu: '1 Physique · 2 Liaison (MAC, commutateur) · 3 Réseau (IP, routeur) · 4 Transport (TCP, UDP) · 5 Session · 6 Présentation · 7 Application.' },
      { titre: 'Nombre d’hôtes', contenu: '2^(32 − préfixe) − 2. /24 → 254 hôtes, /26 → 62, /28 → 14, /30 → 2 (liaison point à point).' },
      { titre: 'Adresses privées (RFC 1918)', contenu: '10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16. 169.254.0.0/16 = adresse automatique (APIPA) sans DHCP.' },
      { titre: 'VLAN', contenu: 'Port d’accès : un seul VLAN, sans étiquette. Lien trunk 802.1Q : plusieurs VLAN étiquetés. Pour passer d’un VLAN à l’autre, il faut un routage (routeur ou commutateur de niveau 3).' },
      { titre: 'Choix de la route', contenu: 'Le routeur retient le préfixe le plus long qui correspond (longest prefix match), puis la distance administrative, puis la métrique.' },
      { titre: 'Décibels', contenu: '+3 dB ≈ puissance × 2, +10 dB = × 10, −3 dB ≈ moitié. Les pertes en dB d’une liaison s’additionnent.' },
      { titre: 'Débit et durée', contenu: '1 octet = 8 bits. 100 Mo sur un lien de 10 Mbit/s : 800 Mbit / 10 Mbit/s = 80 s au minimum, hors surcharge des protocoles.' },
    ],
  },
  {
    filiere: 'dev',
    titre: 'Repères Développement logiciel',
    reperes: [
      { titre: 'Complexités à connaître', contenu: 'Accès à un tableau O(1) · recherche dichotomique (tableau trié) O(log n) · parcours O(n) · bon tri O(n log n) · deux boucles imbriquées O(n²).' },
      { titre: 'L’argent n’est jamais un flottant', contenu: '0,1 + 0,2 ≠ 0,3 en virgule flottante. Utilise des entiers (centimes) ou un type décimal, et une règle d’arrondi explicite.' },
      { titre: 'HTTP', contenu: 'GET, PUT et DELETE sont idempotents, POST ne l’est pas. 201 créé · 400 requête invalide · 401 non authentifié · 403 interdit · 404 introuvable · 409 conflit · 500 erreur serveur.' },
      { titre: 'Injection SQL', contenu: 'Toujours des requêtes paramétrées (ou un ORM qui les utilise), jamais de concaténation de saisies utilisateur dans le SQL.' },
      { titre: 'Mots de passe et secrets', contenu: 'Hachage lent et salé (bcrypt, Argon2). Un secret poussé dans Git est compromis : on le révoque et on le remplace, l’effacer de l’historique ne suffit pas.' },
      { titre: 'Git', contenu: 'git revert crée un commit qui annule (sûr sur une branche partagée) ; git reset réécrit l’historique (à réserver au local).' },
      { titre: 'Pyramide des tests', contenu: 'Beaucoup de tests unitaires rapides, moins de tests d’intégration, peu de tests de bout en bout. Un bug corrigé = un test de non-régression.' },
    ],
  },
  {
    filiere: 'support',
    titre: 'Repères Support IT',
    reperes: [
      { titre: 'Priorité ITIL', contenu: 'Priorité = impact × urgence. Un guichet entier bloqué passe avant un poste isolé, quel que soit le rang de la personne qui appelle.' },
      { titre: 'Incident, problème, demande', contenu: 'Incident : interruption à rétablir vite. Problème : cause racine d’incidents répétés. Demande de service : besoin standard (accès, logiciel). Changement : modification planifiée et approuvée.' },
      { titre: 'Dépannage par couches', contenu: 'Commence par le physique (câble, voyants, alimentation), puis l’adresse IP, la passerelle, le DNS, et enfin l’application.' },
      { titre: 'Commandes Windows utiles', contenu: 'ipconfig /all · ipconfig /release puis /renew · ping · nslookup · tracert · gpupdate /force · sfc /scannow.' },
      { titre: 'Mot de passe oublié', contenu: 'Toujours vérifier l’identité selon la procédure avant de réinitialiser, même pour un directeur pressé au téléphone : c’est la cible préférée de l’ingénierie sociale.' },
      { titre: 'Poste suspect', contenu: 'Message de rançon ou comportement anormal : débrancher le réseau sans éteindre, ne rien supprimer, escalader immédiatement à la sécurité.' },
      { titre: 'Ticket bien tenu', contenu: 'Symptôme, actions faites, résultat, prochaine étape. On clôture avec l’accord de l’utilisateur, et on alimente la base de connaissances.' },
    ],
  },
  {
    filiere: 'numerique',
    titre: 'Repères Numérique',
    reperes: [
      { titre: 'Scrum en 30 secondes', contenu: 'Product Owner (priorise le backlog), Scrum Master (facilite, lève les obstacles), développeurs. Sprint d’un mois au plus : planification, mêlée quotidienne de 15 min, revue, rétrospective.' },
      { titre: 'User story et MoSCoW', contenu: '« En tant que…, je veux…, afin de… » + critères d’acceptation testables. Priorités : Must, Should, Could, Won’t (pas cette fois). Un MVP ne garde que les Must.' },
      { titre: 'IaaS, PaaS, SaaS', contenu: 'Plus on monte (IaaS → PaaS → SaaS), plus le fournisseur gère. Mais quel que soit le modèle, le client reste responsable de ses données, de ses comptes et de leurs droits d’accès.' },
      { titre: 'Disponibilité d’un SLA', contenu: '99,9 % ≈ 8 h 46 min d’arrêt par an ; 99,99 % ≈ 53 min. Exige aussi la réversibilité (récupérer tes données dans un format exploitable) et la localisation des données.' },
      { titre: 'Données personnelles', contenu: 'Finalité déterminée, minimisation (seulement le nécessaire), durée de conservation limitée, sécurité, droits des personnes (accès, rectification, effacement).' },
      { titre: 'IA générative', contenu: 'Elle peut inventer avec aplomb (hallucination) : vérifie les sources. Ne colle jamais de données clients ou internes dans un outil grand public non approuvé.' },
      { titre: 'Accessibilité (WCAG)', contenu: 'Contraste d’au moins 4,5:1 pour le texte courant, texte alternatif pour les images, tout utilisable au clavier, formulaires avec des libellés explicites.' },
    ],
  },
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

      {reperesFilieres.map((f) => {
        const Icone = ICONES_FILIERE[f.filiere];
        return (
          <section key={f.filiere} aria-labelledby={`fiche-${f.filiere}`}>
            <h2 id={`fiche-${f.filiere}`} className="flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
              <Icone aria-hidden className="size-6 text-primary-strong" /> {f.titre}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {f.reperes.map((r) => (
                <div key={r.titre} className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-ink">{r.titre}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.contenu}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

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
