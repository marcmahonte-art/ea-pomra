import type { Metadata } from "next";
import "./globals.css";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_OG_IMAGE,
} from "@/lib/site";

const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE} | Orientation, Mobilité & Réussite Académique`;

export const metadata: Metadata = {
  // Base des URL absolues (Open Graph, lien canonique). Omise si la variable
  // d'environnement n'est pas définie : mieux vaut pas d'URL qu'une URL fausse.
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    default: DEFAULT_TITLE,
    // Appliqué aux segments enfants : une page déclarant « À propos »
    // devient « À propos | EA-POMRA ».
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "EA-POMRA",
    "Étudier en Afrique",
    "Mobilité académique Afrique",
    "Orientation universitaire Afrique",
    "STSS transfert sécurisé",
    "Pôle PAP",
    "Universités Sénégal",
    "Universités Côte d'Ivoire",
    "Universités Cameroun",
  ],
  authors: [{ name: "EA-POMRA BEC" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 512,
        height: 448,
        alt: `Logo ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full scroll-smooth">
      <head>
        {/* Plus Jakarta Sans (spec §4.2). Chargée par une feuille de style
            distante plutôt que par `next/font` : ce dernier télécharge la
            police au moment du build, ce qui fait échouer la compilation quand
            le réseau est indisponible. Ici, l'échec éventuel est purement
            visuel et se replie sur la pile système déclarée dans `@theme`. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-[#0D2B4D] bg-[#F7F9FB]">
        {children}
      </body>
    </html>
  );
}
