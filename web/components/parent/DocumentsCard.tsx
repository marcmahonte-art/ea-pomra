import { FileText, Download, Upload, AlertCircle } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { DocumentItem, DocumentStatus } from "@/lib/parent-types";

const STATUS_STYLES: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  VALIDATED: {
    label: "Validé",
    className: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
  },
  PENDING: {
    label: "En vérification",
    className: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
  },
  MISSING: {
    label: "Manquant",
    className: "bg-[#FDECEC] text-[#D9383A] border-[#FAC6C6]",
  },
};

const CATEGORY_LABELS: Record<DocumentItem["category"], string> = {
  IDENTITE: "Identité",
  ACADEMIQUE: "Académique",
  FINANCIER: "Financier",
  MOBILITE: "Mobilité",
};

/**
 * Pièces justificatives du dossier.
 *
 * Les statuts « en vérification » et « manquant » sont distingués : le premier
 * attend une action de l'administration, le second attend une action du parent.
 * Les confondre reviendrait à faire patienter quelqu'un qui doit agir.
 */
export function DocumentsCard({ documents }: { documents: DocumentItem[] }) {
  if (documents.length === 0) {
    return (
      <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6">
        <EmptyState
          icon={FileText}
          title="Aucune pièce au dossier"
          description="Les pièces justificatives apparaîtront ici dès qu'elles auront été déposées auprès de votre antenne."
        />
      </section>
    );
  }

  const missing = documents.filter((doc) => doc.status === "MISSING");

  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
      <header className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
        <div>
          <h2 className="text-sm font-bold text-[#0D2B4D]">
            Pièces justificatives
          </h2>
          <p className="text-xs text-[#5B6776] mt-0.5">
            {documents.length} pièce{documents.length > 1 ? "s" : ""} au dossier
            {missing.length > 0
              ? ` — ${missing.length} à fournir`
              : " — dossier complet"}
          </p>
        </div>
        <FileText className="w-5 h-5 text-[#8E9BAA] shrink-0" />
      </header>

      {missing.length > 0 ? (
        <div className="rounded-2xl bg-[#FDECEC] border border-[#FAC6C6] p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#D9383A] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#0D2B4D]">
              {missing.length === 1
                ? "Une pièce reste à fournir"
                : `${missing.length} pièces restent à fournir`}
            </p>
            <p className="text-[11px] text-[#5B6776] mt-0.5">
              {missing.map((doc) => doc.name).join(" · ")}
            </p>
          </div>
        </div>
      ) : null}

      <ul className="space-y-2">
        {documents.map((doc) => {
          const status = STATUS_STYLES[doc.status];
          return (
            <li
              key={doc.id}
              className="rounded-2xl border border-[#E6E9EF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-[#F0F3F7] text-[#5B6776] flex items-center justify-center shrink-0">
                  {doc.status === "MISSING" ? (
                    <Upload className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0D2B4D]">{doc.name}</p>
                  <p className="text-[11px] text-[#5B6776] mt-0.5">
                    {CATEGORY_LABELS[doc.category]}
                    {doc.uploadedAt ? ` · déposée le ${doc.uploadedAt}` : ""}
                    {doc.sizeLabel ? ` · ${doc.sizeLabel}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.className}`}
                >
                  {status.label}
                </span>
                {doc.url ? (
                  <a
                    href={doc.url}
                    download
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#174A7C] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </a>
                ) : (
                  <span className="text-[11px] text-[#8E9BAA]">
                    Indisponible
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default DocumentsCard;
