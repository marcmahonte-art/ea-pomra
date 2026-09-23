import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import {
  CURRENT_PERIOD,
  computeAlerts,
  computeKpis,
  computeOperationalQueue,
  computeQuarterlyReport,
  getActivityForScope,
} from "@/lib/backoffice-data";
import { AntenneDashboard } from "@/components/backoffice/AntenneDashboard";
import { PageHeader } from "@/components/backoffice/PageHeader";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Vue opérationnelle de l'antenne : dossiers reçus, actions attendues, alertes et activité récente.",
};

/**
 * Tableau de bord Antenne (spec §8).
 *
 * Toutes les agrégations sont calculées ici, côté serveur, à partir du
 * périmètre lu dans la session. Le composant `AntenneDashboard` ne reçoit que
 * des résultats déjà filtrés et ne recalcule rien.
 */
export default async function AntenneDashboardPage() {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");

  const kpis = computeKpis(scope);
  const alerts = computeAlerts(scope);
  const queue = computeOperationalQueue(scope);
  const activity = getActivityForScope(scope);
  const report = computeQuarterlyReport(
    scope,
    CURRENT_PERIOD.year,
    CURRENT_PERIOD.quarter
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Traitement opérationnel des dossiers de l'antenne."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Période", value: CURRENT_PERIOD.label },
        ]}
      />

      <AntenneDashboard
        kpis={kpis}
        alerts={alerts}
        queue={queue}
        activity={activity}
        report={report}
        permissions={scope.permissions}
        canExport={scope.permissions.includes("exports.run")}
      />
    </div>
  );
}
