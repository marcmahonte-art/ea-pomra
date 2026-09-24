import type { Metadata } from "next";
import BackofficeShell from "@/components/backoffice/BackofficeShell";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getPapDashboard } from "@/lib/server/pap-repository";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Responsable PAP", template: `%s | ${SITE_NAME}` },
  description: "Espace confidentiel de suivi PAP.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PapLayout({ children }: { children: React.ReactNode }) {
  const scope = await requireBackofficeScope("RESPONSABLE_PAP", "pap.read");
  const dashboard = scope.isDemo ? { activeAlerts: 0, followUpsInProgress: 0, activeMentorats: 0, recentInterventions: 0 } : await getPapDashboard(scope);
  return <BackofficeShell role="RESPONSABLE_PAP" userName={scope.userName} userTitle={scope.userTitle} scopeLabel="Accès par affectation" scopeFlag={null} pendingCount={dashboard.activeAlerts} isDemo={scope.isDemo}>{children}</BackofficeShell>;
}
