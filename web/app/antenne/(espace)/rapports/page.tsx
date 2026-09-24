import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getDossiersForScope } from "@/lib/server/backoffice-service";
import { computeQuarterlyReport } from "@/lib/backoffice-data";
import { currentPeriod, previousPeriod, referenceDateForScope } from "@/lib/server/temporal";
import { getStoredReport } from "@/lib/server/backoffice-repository";
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
  const dossiers = await getDossiersForScope(scope);
  const params = await searchParams;

  const referenceDate = referenceDateForScope(scope);
  const period = currentPeriod(referenceDate);
  const previous = previousPeriod(referenceDate);
  const raw = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const year = Number.parseInt(raw("year") ?? String(period.year), 10);
  const quarter = Number.parseInt(raw("quarter") ?? String(period.quarter), 10);

  const safeYear = Number.isFinite(year) ? year : period.year;
  const safeQuarter = quarter >= 1 && quarter <= 4 ? quarter : period.quarter;

  const liveReport = computeQuarterlyReport(scope, safeYear, safeQuarter, undefined, dossiers);
  const storedReport = scope.isDemo ? null : await getStoredReport(scope, safeYear, safeQuarter);
  const report = storedReport?.snapshot.report ?? liveReport;

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
          { label: "Période de référence", value: period.label },
        ]}
        actions={
          <ReportPeriodSelector
            years={[previous.year, period.year]}
            defaultYear={period.year}
            defaultQuarter={period.quarter}
          />
        }
      />

      <QuarterlyReportPanel
        report={report}
        role="ANTENNE"
        canGenerate={scope.permissions.includes("reports.generate") && !scope.isDemo}
        canExport={scope.permissions.includes("exports.run") && !scope.isDemo}
        year={safeYear}
        quarter={safeQuarter}
        latestReportId={storedReport?.id ?? null}
        filters={{ country: "all", program: "all", formation: "all" }}
      />
    </div>
  );
}
