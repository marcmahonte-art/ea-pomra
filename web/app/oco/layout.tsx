import type { Metadata } from "next";
import BackofficeShell from "@/components/backoffice/BackofficeShell";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getOcoDashboard } from "@/lib/server/oco-repository";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Expert OCO", template: `%s | ${SITE_NAME}` },
  description: "File de traitement des avis techniques OCO.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
};

export default async function OcoLayout({ children }: { children: React.ReactNode }) {
  const scope = await requireBackofficeScope("EXPERT_OCO", "oco.read");
  const dashboard = scope.isDemo ? { assigned: 0, drafts: 0, toFinalize: 0, processed: 0 } : await getOcoDashboard(scope);
  return <BackofficeShell role="EXPERT_OCO" userName={scope.userName} userTitle={scope.userTitle} scopeLabel="Accès par affectation" scopeFlag={null} pendingCount={dashboard.assigned + dashboard.toFinalize} isDemo={scope.isDemo}>{children}</BackofficeShell>;
}
