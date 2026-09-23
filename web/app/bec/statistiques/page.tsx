import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import {
  CURRENT_PERIOD,
  computeCountryStats,
  computeEvolution,
  computeFormationDistribution,
  computeKpis,
  computeProgramDistribution,
  computeStatusDistribution,
  parseGlobalFilters,
} from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { GlobalFiltersBar } from "@/components/backoffice/GlobalFiltersBar";
import { StatisticsPanel } from "@/components/backoffice/StatisticsPanel";
import { ALL_FORMATIONS, ALL_PROGRAMS, COUNTRIES_REFERENCE } from "@/lib/backoffice-data";

export const metadata: Metadata = {
  title: "Statistiques",
  description:
    "Indicateurs consolidés des 8 pays : volumes, répartitions, évolution et vue par pays.",
};

/**
 * Statistiques BEC (spec §21).
 *
 * Toutes les agrégations sont produites ici, côté serveur. La spec §9.5 est
 * catégorique : « aucune statistique ne doit être calculée côté interface si
 * elle nécessite de parcourir toute la base ». Le composant `StatisticsPanel`
 * ne compte donc rien — il met en forme des totaux déjà arrêtés.
 */
export default async function BecStatistiquesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("BEC", "statistics.read");
  const params = await searchParams;
  const filters = parseGlobalFilters(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques"
        subtitle="Indicateurs consolidés du périmètre global."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "Période", value: CURRENT_PERIOD.label },
        ]}
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

      <StatisticsPanel
        kpis={computeKpis(scope, filters)}
        statusDistribution={computeStatusDistribution(scope, filters)}
        programDistribution={computeProgramDistribution(scope, filters)}
        formationDistribution={computeFormationDistribution(scope, filters)}
        evolution={computeEvolution(scope, filters)}
        countryStats={computeCountryStats(scope, filters)}
      />
    </div>
  );
}
