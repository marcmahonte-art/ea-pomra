import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getDossiersForScope } from "@/lib/server/backoffice-service";
import {
  ALL_FORMATIONS,
  ALL_PROGRAMS,
  COUNTRIES_REFERENCE,
  computeQuarterlyReport,
  parseGlobalFilters,
} from "@/lib/backoffice-data";
import { currentPeriod, previousPeriod, referenceDateForScope } from "@/lib/server/temporal";
import { getStoredReport } from "@/lib/server/backoffice-repository";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { GlobalFiltersBar } from "@/components/backoffice/GlobalFiltersBar";
import { ReportPeriodSelector } from "@/components/backoffice/ReportPeriodSelector";
import { QuarterlyReportPanel } from "@/components/backoffice/QuarterlyReportPanel";

export const metadata: Metadata = {
  title: "Rapports",
  description:
    "Rapports consolidés des 8 pays : volumes, répartitions et activité de la période.",
};

/**
 * Rapports BEC (spec §20).
 *
 * La spec impose de distinguer le **rapport antenne** du **rapport consolidé
 * BEC**. La distinction est portée par `QuarterlyReport.scopeLabel`, produit par
 * `computeQuarterlyReport()` à partir du rôle : le composant d'affichage ne
 * décide jamais laquelle des deux étiquettes employer, il affiche celle qu'on
 * lui donne.
 *
 * Filtres : année, trimestre (sélecteur de période), pays et programme (filtres
 * globaux). Ils sont tous appliqués côté serveur.
 */
export default async function BecRapportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("BEC", "reports.read");
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

  const filters = parseGlobalFilters(params);
  const liveReport = computeQuarterlyReport(scope, safeYear, safeQuarter, filters, dossiers);
  const storedReport = scope.isDemo ? null : await getStoredReport(scope, safeYear, safeQuarter, filters);
  const report = storedReport?.snapshot.report ?? liveReport;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapports"
        subtitle="Rapport consolidé du Bureau Exécutif Central."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
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

      <GlobalFiltersBar
        countries={COUNTRIES_REFERENCE.map((country) => ({
          code: country.code,
          name: country.country,
          flag: country.flag,
        }))}
        programs={ALL_PROGRAMS}
        formations={ALL_FORMATIONS}
        periodLabel={period.label}
      />

      <QuarterlyReportPanel
        report={report}
        role="BEC"
        canGenerate={scope.permissions.includes("reports.generate") && !scope.isDemo}
        canExport={scope.permissions.includes("exports.run") && !scope.isDemo}
        year={safeYear}
        quarter={safeQuarter}
        latestReportId={storedReport?.id ?? null}
        filters={{
          country: filters.country ?? "all",
          program: filters.program ?? "all",
          formation: filters.formation ?? "all"
        }}
      />
    </div>
  );
}
