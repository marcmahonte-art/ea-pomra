import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getActivityForScope, getDossiersForScope } from "@/lib/server/backoffice-service";
import {
  computeAlerts,
  computeKpis,
  computeOperationalQueue,
  computeQuarterlyReport,
} from "@/lib/backoffice-data";
import { currentPeriod, referenceDateForScope } from "@/lib/server/temporal";
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
  const dossiers = await getDossiersForScope(scope);
  const referenceDate = referenceDateForScope(scope);
  const period = currentPeriod(referenceDate);

  const kpis = computeKpis(scope, undefined, dossiers);
  const alerts = computeAlerts(scope, dossiers);
  const queue = computeOperationalQueue(scope, dossiers);
  const activity = await getActivityForScope(scope, dossiers);
  const report = computeQuarterlyReport(
    scope,
    period.year,
    period.quarter,
    undefined,
    dossiers
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
          { label: "Période", value: period.label },
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
