import type { Metadata } from "next";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { PapKpiGrid } from "@/components/pap/PapKpiGrid";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getPapDashboard, listPapCases } from "@/lib/server/pap-repository";
import { PapCaseList } from "@/components/pap/PapViews";

export const metadata: Metadata = { title: "Tableau de bord", description: "Suivi PAP des dossiers affectés." };

export default async function PapDashboardPage() {
  const scope = await requireBackofficeScope("RESPONSABLE_PAP", "pap.read");
  const [dashboard, cases] = scope.isDemo ? [{ activeAlerts: 0, followUpsInProgress: 0, activeMentorats: 0, recentInterventions: 0 }, { rows: [] }] : [await getPapDashboard(scope), await listPapCases(scope, 1, 8)];
  return <div className="space-y-6"><PageHeader title="Tableau de bord" subtitle="Les données affichées sont limitées à vos dossiers PAP affectés." meta={[{ label: "Accès", value: "Affectations individuelles" }]} /><PapKpiGrid values={dashboard} /><section><h2 className="mb-3 text-base font-bold text-[#0D2B4D]">Dossiers suivis</h2><PapCaseList rows={cases.rows} /></section></div>;
}
