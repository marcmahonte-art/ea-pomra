import { GraduationCap } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import { DataTable, type Column } from "./DataTable";
import { DossierStatusBadge } from "./DossierStatus";
import { DossierLink } from "./DossierTable";

/**
 * Suivi (spec §18).
 *
 * Tableau des dossiers parvenus à l'étape Suivi. Les filtres exigés par la spec
 * (pays, programme, formation, statut, période) sont ceux de la barre de filtres
 * commune — `DossierFilters` — qui écrit dans l'URL : le filtrage a donc lieu
 * côté serveur, sur l'ensemble du périmètre, et non sur la seule page affichée.
 */
export function SuiviPanel({
  dossiers,
  role,
  showCountry = false,
}: {
  dossiers: Dossier[];
  role: BackofficeRole;
  showCountry?: boolean;
}) {
  const columns: Column<Dossier>[] = [
    {
      key: "reference",
      header: "ID-POMRA",
      render: (dossier) => (
        <DossierLink role={role} dossierId={dossier.id} reference={dossier.reference} />
      ),
    },
    {
      key: "student",
      header: "Étudiant",
      render: (dossier) => (
        <span className="block text-xs font-bold text-[#0D2B4D] truncate max-w-[190px]">
          {dossier.studentName}
        </span>
      ),
    },
    {
      key: "program",
      header: "Programme",
      render: (dossier) => (
        <span className="text-xs text-[#1F2937]">{dossier.program}</span>
      ),
    },
    {
      key: "formation",
      header: "Formation",
      render: (dossier) => (
        <span className="text-xs text-[#5B6776]">{dossier.formation}</span>
      ),
    },
    ...(showCountry
      ? [
          {
            key: "country",
            header: "Pays / Antenne",
            render: (dossier: Dossier) => (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D2B4D] whitespace-nowrap">
                <span aria-hidden="true">{dossier.flag}</span>
                {dossier.country}
              </span>
            ),
          } satisfies Column<Dossier>,
        ]
      : []),
    {
      key: "state",
      header: "Statut",
      render: (dossier) => <DossierStatusBadge state={dossier.state} />,
    },
    {
      key: "updatedAt",
      header: "Dernière activité",
      render: (dossier) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {dossier.updatedAtLabel}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (dossier) => (
        <DossierLink role={role} dossierId={dossier.id} reference="Consulter" />
      ),
    },
  ];

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
          <GraduationCap className="w-4 h-4 text-[#667085]" aria-hidden="true" />
          Dossiers en suivi
        </h2>
        <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
          Étudiants installés et suivis dans leur pays d&apos;accueil. Les
          filtres de la page s&apos;appliquent à l&apos;ensemble du périmètre,
          pas seulement à la page affichée.
        </p>
      </div>

      <DataTable
        caption="Dossiers à l'étape Suivi"
        columns={columns}
        rows={dossiers}
        rowKey={(dossier) => dossier.id}
        emptyLabel="Aucun dossier n'est actuellement en suivi."
      />
    </section>
  );
}

export default SuiviPanel;
