import type { Metadata } from "next";
import StudentShell from "@/components/layout/StudentShell";

/**
 * Layout de l'espace étudiant.
 *
 * Composant serveur, uniquement pour pouvoir exporter des `metadata` — un
 * composant client en est incapable. La partie interactive (barre latérale,
 * en-tête, modale de contact) vit dans `StudentShell`.
 *
 * `robots: noindex` est indispensable : cet espace est nominatif et ne doit
 * jamais être indexé par les moteurs de recherche ni conservé en cache par des
 * tiers. Sans cette déclaration, les 12 pages héritaient de l'indexation du
 * site public.
 */
export const metadata: Metadata = {
  title: "Espace étudiant",
  description:
    "Espace personnel EA-POMRA : dossier, orientation, transferts et documents.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function EtudiantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
