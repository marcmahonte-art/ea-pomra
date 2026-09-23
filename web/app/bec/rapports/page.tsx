import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import {
  ALL_FORMATIONS,
  ALL_PROGRAMS,
  COUNTRIES_REFERENCE,
  CURRENT_PERIOD,
  PREVIOUS_PERIOD,
  computeQuarterlyReport,
  parseGlobalFilters,
} from "@/lib/backoffice-data";
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
  const params = await searchParams;

  const raw = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const year = Number.parseInt(raw("year") ?? String(CURRENT_PERIOD.year), 10);
  const quarter = Number.parseInt(raw("quarter") ?? String(CURRENT_PERIOD.quarter), 10);

  const safeYear = Number.isFinite(year) ? year : CURRENT_PERIOD.year;
  const safeQuarter = quarter >= 1 && quarter <= 4 ? quarter : CURRENT_PERIOD.quarter;

  const filters = parseGlobalFilters(params);
  const report = computeQuarterlyReport(scope, safeYear, safeQuarter, filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapports"
        subtitle="Rapport consolidé du Bureau Exécutif Central."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
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

      <GlobalFiltersBar
        countries={COUNTRIES_REFERENCE.map((country) => ({
          code: country.code,
          name: country.country,
          flag: country.flag,
        }))}
        programs={ALL_PROGRAMS}
        formations={ALL_FORMATIONS}
        periodLabel={CURRENT_PERIOD.label}
      />

      <QuarterlyReportPanel
        report={report}
        role="BEC"
        canGenerate={scope.permissions.includes("reports.generate")}
        canExport={scope.permissions.includes("exports.run")}
      />
    </div>
  );
}
