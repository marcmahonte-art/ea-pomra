import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getDossiersForScope } from "@/lib/server/backoffice-service";
import {
  ALL_FORMATIONS,
  ALL_PROGRAMS,
  COUNTRIES_REFERENCE,
  computeCountryStats,
  computeEvolution,
  computeKpis,
  computeValidationQueue,
  parseGlobalFilters,
} from "@/lib/backoffice-data";
import { currentPeriod, referenceDateForScope } from "@/lib/server/temporal";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { GlobalFiltersBar } from "@/components/backoffice/GlobalFiltersBar";
import { BECDashboard } from "@/components/backoffice/BECDashboard";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Pilotage consolidé des 8 pays : dossiers, validation, statistiques et rapports.",
};

/**
 * Tableau de bord BEC (spec §9).
 *
 * Les filtres globaux sont lus dans l'URL, puis **transmis aux quatre blocs**
 * de la page : indicateurs, vue des huit pays, file de validation et évolution.
 * C'est ce qui garantit que les quatre blocs décrivent la même réalité. Un
 * filtre appliqué à trois blocs sur quatre produit un tableau de bord faux, et
 * c'est l'erreur la plus difficile à repérer à l'œil.
 */
export default async function BecDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const params = await searchParams;
  const filters = parseGlobalFilters(params);
  const dossiers = await getDossiersForScope(scope);
  const period = currentPeriod(referenceDateForScope(scope));

  const kpis = computeKpis(scope, filters, dossiers);
  const countryStats = computeCountryStats(scope, filters, dossiers);
  const validationQueue = computeValidationQueue(scope, filters, dossiers);
  const evolution = computeEvolution(scope, filters, dossiers);

  const activeFilters = [
    filters.country && filters.country !== "all"
      ? COUNTRIES_REFERENCE.find((c) => c.code === filters.country)?.country
      : null,
    filters.program && filters.program !== "all" ? filters.program : null,
    filters.formation && filters.formation !== "all" ? filters.formation : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue consolidée du périmètre global — 8 pays."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "Période", value: period.label },
          ...(activeFilters.length > 0
            ? [{ label: "Filtres", value: activeFilters.join(" · ") }]
            : []),
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
        periodLabel={period.label}
      />

      <BECDashboard
        kpis={kpis}
        countryStats={countryStats}
        validationQueue={validationQueue}
        evolution={evolution}
      />
    </div>
  );
}
