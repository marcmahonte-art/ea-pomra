import type { Metadata } from "next";
import BackofficeShell from "@/components/backoffice/BackofficeShell";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeValidationQueue } from "@/lib/backoffice-data";
import { SITE_NAME } from "@/lib/site";

/**
 * Métadonnées du back-office BEC.
 *
 * Même régime que l'antenne : espace privé, jamais indexé, jamais mis en cache.
 * Le gabarit de titre est redéclaré pour la même raison — voir le commentaire du
 * layout Antenne.
 */
export const metadata: Metadata = {
  title: {
    default: "Back-office BEC",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Pilotage consolidé des huit pays : validation finale des dossiers, statistiques, rapports et suivi de l'activité.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Layout serveur du back-office BEC.
 *
 * Le périmètre BEC est consolidé (`countryCode === null`), ce qui est une
 * propriété du **rôle** et non une absence de restriction : `scopeDossiers()`
 * traite explicitement le cas BEC avant le refus par défaut. Un agent
 * d'antenne dont le pays serait mal configuré, lui, ne verrait rien.
 *
 * Comme côté antenne, la garde est placée dans le layout parce qu'il est hors
 * de la frontière `<Suspense>` de `(espace)/loading.tsx` : c'est ce qui garantit
 * un statut 404 exact, et non un soft-404, quand un agent d'antenne ouvre une
 * URL `/bec/...`.
 */
export default async function BecLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const pendingCount = computeValidationQueue(scope).length;

  return (
    <BackofficeShell
      role="BEC"
      userName={scope.userName}
      userTitle={scope.userTitle}
      scopeLabel="Vue consolidée — 8 pays"
      scopeFlag={null}
      pendingCount={pendingCount}
      isDemo={scope.isDemo}
    >
      {children}
    </BackofficeShell>
  );
}
