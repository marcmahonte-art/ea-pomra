import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeDocumentRows } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { DataTable, type Column } from "@/components/backoffice/DataTable";
import { DocumentStatusBadge } from "@/components/backoffice/DossierDocuments";
import { DocumentVerificationDialog } from "@/components/backoffice/DocumentVerificationDialog";
import { DossierLink } from "@/components/backoffice/DossierTable";

export const metadata: Metadata = {
  title: "Documents",
  description:
    "Pièces sécurisées en attente de vérification, tous dossiers du périmètre confondus.",
};

type Row = ReturnType<typeof computeDocumentRows>[number];

/**
 * Registre des documents (spec §14).
 *
 * Ne liste que les pièces **non validées** : une pièce validée n'appelle aucune
 * action, et l'inclure noierait les quelques lignes qui attendent réellement une
 * décision. Le détail complet d'un dossier reste accessible depuis sa fiche.
 *
 * La colonne Action porte le déclencheur de `DocumentVerificationDialog`, qui
 * est un composant client. Le tableau, lui, reste rendu par le serveur.
 */
export default async function AntenneDocumentsPage() {
  const scope = await requireBackofficeScope("ANTENNE", "documents.read");
  const rows = computeDocumentRows(scope);

  const columns: Column<Row>[] = [
    {
      key: "document",
      header: "Document",
      render: (row) => (
        <span className="text-xs font-bold text-[#0D2B4D]">{row.document.name}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className="text-xs text-[#5B6776]">{row.document.type}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => <DocumentStatusBadge status={row.document.status} />,
    },
    {
      key: "addedAt",
      header: "Date d'ajout",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {row.document.addedAt ?? "Non fournie"}
        </span>
      ),
    },
    {
      key: "verifiedBy",
      header: "Vérifié par",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776]">{row.document.verifiedBy ?? "—"}</span>
      ),
    },
    {
      key: "updatedAt",
      header: "Dernière mise à jour",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {row.document.updatedAt}
        </span>
      ),
    },
    {
      key: "dossier",
      header: "Dossier",
      render: (row) => (
        <span className="flex flex-col gap-0.5">
          <DossierLink role="ANTENNE" dossierId={row.dossierId} reference={row.reference} />
          <span className="text-[10px] text-[#98A2B3]">
            <span aria-hidden="true">{row.flag}</span> {row.studentName}
          </span>
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <DocumentVerificationDialog
          document={row.document}
          dossierReference={row.reference}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        subtitle="Pièces en attente de vérification sur l'ensemble du périmètre."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Pièces à traiter", value: String(rows.length) },
        ]}
      />

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <DataTable
          caption="Pièces en attente de vérification"
          columns={columns}
          rows={rows}
          rowKey={(row) => row.document.id}
          emptyLabel="Toutes les pièces du périmètre sont validées."
          minWidth="1080px"
        />
      </section>
    </div>
  );
}
