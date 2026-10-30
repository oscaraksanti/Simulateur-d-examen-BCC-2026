import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { ExamProvider } from '@/context/ExamContext';
import { ToastProvider } from '@/components/ui/Toast';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { urlSite } from '@/lib/share';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap', axes: ['opsz'] });
const jetbrains = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], display: 'swap' });

const SITE = urlSite();
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
const TITRE = 'Simulateur BCC — Prépa informatique 2026';
// Avec metadataBase, Next ajoute déjà le sous-chemin du site : on ne préfixe le basePath que sans URL publique.
const OG_IMAGE = SITE.startsWith('http') ? '/og-image.png' : `${BASE_PATH}/og-image.png`;
const DESCRIPTION =
  "Examen blanc gratuit et chronométré pour préparer le recrutement 2026 de la Banque Centrale du Congo dans les 7 domaines informatiques (data, cybersécurité, bases de données, systèmes, réseaux, développement, support IT) : QCM corrigés, cas pratiques, culture BCC. Outil indépendant, non affilié à la BCC.";

export const metadata: Metadata = {
  metadataBase: SITE.startsWith('http') ? new URL(SITE) : undefined,
  title: { default: TITRE, template: '%s · Simulateur BCC' },
  description: DESCRIPTION,
  applicationName: 'Simulateur BCC',
  authors: [{ name: 'Oscar Aksanti — Datalendo', url: 'https://datalendo.com' }],
  publisher: 'Datalendo',
  keywords: [
    'recrutement BCC 2026',
    'test BCC',
    'Banque Centrale du Congo recrutement',
    'examen blanc BCC',
    'data analyse',
    'cybersécurité',
    'administration bases de données',
    'administration systèmes',
    'réseaux et télécommunications',
    'développement logiciel',
    'support IT',
    'RDC',
    'Kinshasa',
    'préparation concours',
  ],
  alternates: { canonical: '/' },
  icons: { icon: `${BASE_PATH}/favicon.svg` },
  openGraph: {
    type: 'website',
    locale: 'fr_CD',
    siteName: 'Simulateur BCC',
    title: TITRE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Simulateur BCC — Prépa informatique 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITRE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F9FC' },
    { media: '(prefers-color-scheme: dark)', color: '#07111F' },
  ],
};

// Applique le thème choisi avant le premier rendu (évite le flash).
const scriptTheme = `try{var t=JSON.parse(localStorage.getItem('simbcc:theme'));if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift"
        >
          Aller au contenu
        </a>
        <ExamProvider>
          <ToastProvider>
            <DisclaimerBanner />
            <Header />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ExamProvider>
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
