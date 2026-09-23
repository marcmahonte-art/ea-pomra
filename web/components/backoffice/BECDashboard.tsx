import Link from "next/link";
import { CheckCircle2, BarChart3 } from "lucide-react";
import type {
  CountryStat,
  EvolutionPoint,
  Kpi,
  ValidationQueueRow,
} from "@/lib/backoffice-types";
import { DashboardKpiGrid } from "./DashboardKpiGrid";
import { CountryOverviewGrid } from "./CountryOverviewGrid";
import { EvolutionChart } from "./EvolutionChart";
import { DataTable, type Column } from "./DataTable";
import { DossierStatusBadge } from "./DossierStatus";
import { DossierLink } from "./DossierTable";

/**
 * Tableau de bord du BEC (spec §9).
 *
 * Les quatre blocs — indicateurs globaux, vue des huit pays, file de validation
 * et évolution — reçoivent tous les **mêmes filtres globaux** (spec §9.1). La
 * page les lit dans l'URL et les transmet aux fonctions d'agrégation : c'est ce
 * qui garantit que les quatre blocs racontent la même histoire. Un filtre
 * appliqué à trois blocs sur quatre produit un tableau de bord faux.
 *
 * La barre de filtres elle-même est rendue par la page, en amont : elle est
 * cliente, ce composant reste serveur.
 */
export function BECDashboard({
  kpis,
  countryStats,
  validationQueue,
  evolution,
}: {
  kpis: Kpi[];
  countryStats: CountryStat[];
  validationQueue: ValidationQueueRow[];
  evolution: EvolutionPoint[];
}) {
  const columns: Column<ValidationQueueRow>[] = [
    {
      key: "reference",
      header: "ID-POMRA",
      render: (row) => (
        <DossierLink role="BEC" dossierId={row.dossierId} reference={row.reference} />
      ),
    },
    {
      key: "student",
      header: "Étudiant",
      render: (row) => (
        <span className="block text-xs font-bold text-[#0D2B4D] truncate max-w-[190px]">
          {row.studentName}
        </span>
      ),
    },
    {
      key: "country",
      header: "Pays",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D2B4D] whitespace-nowrap">
          <span aria-hidden="true">{row.flag}</span>
          {row.country}
        </span>
      ),
    },
    {
      key: "program",
      header: "Programme",
      render: (row) => <span className="text-xs text-[#1F2937]">{row.program}</span>,
    },
    {
      key: "state",
      header: "Statut",
      render: (row) => <DossierStatusBadge state={row.state} />,
    },
    {
      key: "updatedAt",
      header: "Dernière mise à jour",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {row.updatedAtLabel}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <DossierLink role="BEC" dossierId={row.dossierId} reference="Consulter" />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardKpiGrid kpis={kpis} />

      <CountryOverviewGrid stats={countryStats} />

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div>
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
              <CheckCircle2 className="w-4 h-4 text-[#667085]" aria-hidden="true" />
              File de validation
            </h2>
            <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
              Dossiers attendus en validation BEC — avis reçus et dossiers à
              valider, du plus ancien au plus récent.
            </p>
          </div>

          <Link
            href="/bec/validation"
            className="text-xs font-bold text-[#174A7C] hover:underline whitespace-nowrap"
          >
            Voir la file complète →
          </Link>
        </div>

        <DataTable
          caption="Dossiers en attente de validation BEC"
          columns={columns}
          rows={validationQueue.slice(0, 6)}
          rowKey={(row) => row.dossierId}
          emptyLabel="Aucun dossier n'attend de validation BEC sur ce périmètre."
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EvolutionChart points={evolution} />

        <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <BarChart3 className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            Statistiques consolidées
          </h2>
          <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
            Répartitions par statut, programme et formation, calculées côté
            serveur sur l&apos;ensemble du périmètre consolidé.
          </p>

          <Link
            href="/bec/statistiques"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#174A7C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0D2B4D]"
          >
            Ouvrir les statistiques
          </Link>

          <p className="mt-3 text-[10px] leading-relaxed text-[#98A2B3]">
            Aucun total n&apos;est recalculé dans le navigateur : la spec §9.5
            interdit qu&apos;une statistique nécessitant un parcours complet de
            la base soit produite côté interface.
          </p>
        </section>
      </div>
    </div>
  );
}

export default BECDashboard;
