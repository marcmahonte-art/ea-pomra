import type {
  CountryStat,
  Distribution,
  EvolutionPoint,
  Kpi,
} from "@/lib/backoffice-types";
import { StatisticsKpiGrid } from "./DashboardKpiGrid";
import { DistributionBars } from "./DistributionBars";
import { EvolutionChart } from "./EvolutionChart";
import { CountryOverviewGrid } from "./CountryOverviewGrid";

/**
 * Panneau de statistiques (spec §21).
 *
 * Compose les six éléments exigés — grille d'indicateurs, répartition par
 * statut, par programme, par formation, évolution temporelle et vue des pays —
 * à partir d'agrégations **toutes calculées côté serveur**.
 *
 * La spec §9.5 est explicite : « aucune statistique ne doit être calculée côté
 * interface si elle nécessite de parcourir toute la base ». Ce composant ne
 * compte rien : il ne fait que mettre en forme des totaux déjà arrêtés par
 * `lib/backoffice-data.ts`. C'est la raison pour laquelle il peut rester un
 * composant serveur, sans une ligne de JavaScript envoyée au navigateur.
 */
export function StatisticsPanel({
  kpis,
  statusDistribution,
  programDistribution,
  formationDistribution,
  evolution,
  countryStats,
}: {
  kpis: Kpi[];
  statusDistribution: Distribution[];
  programDistribution: Distribution[];
  formationDistribution: Distribution[];
  evolution: EvolutionPoint[];
  /** Fourni uniquement pour le BEC : la vue des 8 pays n'a pas de sens en antenne. */
  countryStats?: CountryStat[];
}) {
  return (
    <div className="space-y-6">
      <StatisticsKpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EvolutionChart points={evolution} />
        <DistributionBars
          title="Répartition par statut"
          description="Où en sont les dossiers du périmètre, tous programmes confondus."
          items={statusDistribution}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DistributionBars
          title="Répartition par programme"
          items={programDistribution}
        />
        <DistributionBars
          title="Répartition par formation"
          items={formationDistribution}
        />
      </div>

      {countryStats ? <CountryOverviewGrid stats={countryStats} /> : null}
    </div>
  );
}

export default StatisticsPanel;
