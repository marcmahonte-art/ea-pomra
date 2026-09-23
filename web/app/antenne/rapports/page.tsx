import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import {
  CURRENT_PERIOD,
  PREVIOUS_PERIOD,
  computeQuarterlyReport,
} from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ReportPeriodSelector } from "@/components/backoffice/ReportPeriodSelector";
import { QuarterlyReportPanel } from "@/components/backoffice/QuarterlyReportPanel";

export const metadata: Metadata = {
  title: "Rapports",
  description:
    "Rapports trimestriels de l'antenne : dossiers reçus, traités, en attente et répartitions.",
};

/**
 * Rapports trimestriels (spec §19).
 *
 * Le rapport est **calculé côté serveur** à chaque affichage, à partir du
 * périmètre et de la période demandée. Rien n'est mis en cache ni pré-généré :
 * un rapport figé finirait par ne plus correspondre aux dossiers qu'il décrit.
 */
export default async function AntenneRapportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("ANTENNE", "reports.read");
  const params = await searchParams;

  const raw = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const year = Number.parseInt(raw("year") ?? String(CURRENT_PERIOD.year), 10);
  const quarter = Number.parseInt(raw("quarter") ?? String(CURRENT_PERIOD.quarter), 10);

  const safeYear = Number.isFinite(year) ? year : CURRENT_PERIOD.year;
  const safeQuarter = quarter >= 1 && quarter <= 4 ? quarter : CURRENT_PERIOD.quarter;

  const report = computeQuarterlyReport(scope, safeYear, safeQuarter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapports"
        subtitle="Rapport trimestriel du périmètre de l'antenne."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Période de référence", value: CURRENT_PERIOD.label },
        ]}
        actions={
          <ReportPeriodSelector
            years={[PREVIOUS_PERIOD.year, CURRENT_PERIOD.year]}
            defaultYear={CURRENT_PERIOD.year}
            defaultQuarter={CURRENT_PERIOD.quarter}
          />
        }
      />

      <QuarterlyReportPanel
        report={report}
        role="ANTENNE"
        canGenerate={scope.permissions.includes("reports.generate")}
        canExport={scope.permissions.includes("exports.run")}
      />
    </div>
  );
}
