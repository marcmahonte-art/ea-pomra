import {
  FileText,
  FileWarning,
  FileCheck2,
  FileX2,
  CircleDashed,
} from "lucide-react";
import type { DocumentStatus, DossierDocument } from "@/lib/backoffice-types";
import { DOCUMENT_LABELS } from "@/lib/backoffice-types";
import { DataTable, type Column } from "./DataTable";
import { DocumentVerificationDialog } from "./DocumentVerificationDialog";

/**
 * Statut d'une pièce (spec §14).
 *
 * Même règle que pour les statuts de dossier (§3) : icône + libellé + couleur,
 * jamais la couleur seule. « À vérifier » et « Refusé » sont deux situations
 * opposées ; les distinguer par un simple dégradé de rouge serait une faute.
 */
const DOCUMENT_STYLES: Record<
  DocumentStatus,
  { className: string; Icon: typeof FileText }
> = {
  MANQUANT: {
    className: "bg-[#F0F3F7] text-[#475467] border-[#E6E9EF]",
    Icon: CircleDashed,
  },
  A_VERIFIER: {
    className: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
    Icon: FileWarning,
  },
  VALIDE: {
    className: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
    Icon: FileCheck2,
  },
  REFUSE: {
    className: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]",
    Icon: FileX2,
  },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const { className, Icon } = DOCUMENT_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${className}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {DOCUMENT_LABELS[status]}
    </span>
  );
}

interface DocumentRow {
  document: DossierDocument;
  dossierReference: string;
}

/**
 * Pièces d'un dossier (spec §14).
 *
 * Colonnes imposées : document, type, statut, date d'ajout, vérifié par,
 * dernière mise à jour, action. La synthèse en tête (« 4 / 7 pièces validées »)
 * répond à la question que l'agent se pose réellement avant d'ouvrir la
 * première ligne.
 */
export function DossierDocuments({
  documents,
  dossierId,
  dossierVersion,
  role,
  dossierReference,
  canVerify,
}: {
  documents: DossierDocument[];
  dossierId: string;
  dossierVersion: number;
  role: "ANTENNE" | "BEC";
  dossierReference: string;
  canVerify: boolean;
}) {
  const rows: DocumentRow[] = documents.map((document) => ({
    document,
    dossierReference,
  }));

  const validated = documents.filter((doc) => doc.status === "VALIDE").length;

  const columns: Column<DocumentRow>[] = [
    {
      key: "name",
      header: "Document",
      render: ({ document }) => (
        <span className="text-xs font-bold text-[#0D2B4D]">{document.name}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: ({ document }) => (
        <span className="text-xs text-[#5B6776]">{document.type}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: ({ document }) => <DocumentStatusBadge status={document.status} />,
    },
    {
      key: "addedAt",
      header: "Date d'ajout",
      render: ({ document }) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {document.addedAt ?? "Non fournie"}
        </span>
      ),
    },
    {
      key: "verifiedBy",
      header: "Vérifié par",
      render: ({ document }) => (
        <span className="text-[11px] text-[#5B6776]">
          {document.verifiedBy ?? "—"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Dernière mise à jour",
      render: ({ document }) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {document.updatedAt}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
       render: ({ document, dossierReference: reference }) => (
         <DocumentVerificationDialog
           document={document}
           dossierId={dossierId}
           dossierVersion={dossierVersion}
            role={role}
            dossierReference={reference}
            canVerify={canVerify}
          />
       ),
    },
  ];

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div>
          <h2 className="text-base font-bold text-[#0D2B4D] tracking-tight">
            Documents
          </h2>
          <p className="text-xs text-[#5B6776] mt-1">
            {validated} / {documents.length} pièce{documents.length > 1 ? "s" : ""}{" "}
            validée{validated > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <DataTable
        caption={`Pièces du dossier ${dossierReference}`}
        columns={columns}
        rows={rows}
        rowKey={(row) => row.document.id}
        emptyLabel="Aucune pièce n'est rattachée à ce dossier."
      />
    </section>
  );
}

export default DossierDocuments;
