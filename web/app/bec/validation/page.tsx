import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeValidationQueue } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { DataTable, type Column } from "@/components/backoffice/DataTable";
import { DossierStatusBadge } from "@/components/backoffice/DossierStatus";
import { DossierLink } from "@/components/backoffice/DossierTable";
import type { ValidationQueueRow } from "@/lib/backoffice-types";

export const metadata: Metadata = {
  title: "Validation",
  description:
    "Dossiers attendant une validation finale du Bureau Exécutif Central.",
};

/**
 * File de validation BEC (spec §9.4).
 *
 * Seuls deux états y figurent : `A_VALIDER` et `AVIS_RECU`. C'est le filtre de
 * `computeValidationQueue()` — le rôle BEC détient `dossiers.validate`, et
 * l'antenne ne le détient pas. Un agent d'antenne qui ouvrirait cette URL
 * recevrait un 404 par `requireBackofficeScope("BEC", …)`.
 */
export default async function BecValidationPage() {
  const scope = await requireBackofficeScope("BEC", "dossiers.validate");
  const rows = computeValidationQueue(scope);

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
        <span className="flex items-center gap-2">
          <DossierLink role="BEC" dossierId={row.dossierId} reference="Consulter" />
          <span
            className="text-[10px] text-[#98A2B3]"
            title="La validation est une décision : elle nécessite une route de mutation, non encore exposée."
          >
            Validation indisponible
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Validation"
        subtitle="Dossiers en attente de validation finale."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "En attente", value: String(rows.length) },
        ]}
      />

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <DataTable
          caption="Dossiers en attente de validation BEC"
          columns={columns}
          rows={rows}
          rowKey={(row) => row.dossierId}
          emptyLabel="Aucun dossier n'attend de validation."
          minWidth="1020px"
        />
      </section>
    </div>
  );
}
