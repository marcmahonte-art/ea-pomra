import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EA-POMRA — Étudier en Afrique | Orientation, Mobilité & Réussite Académique",
  description:
    "Plateforme panafricaine reliant 8 pays d'Afrique : orientation académique (Pôle OCO), transfert sécurisé de scolarité (STSS) et accompagnement psychosocial (Pôle PAP) pour réussir ses études.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans text-[#0D2B4D] bg-[#F7F9FB]">
        {children}
      </body>
    </html>
  );
}
