import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { DocumentsCard } from "@/components/parent/DocumentsCard";

export const metadata: Metadata = {
  title: "Documents du dossier",
  description:
     "Aperçu des pièces du dossier et de leur statut dans la simulation. Aucun document financier STSS n'est disponible.",
};

/** Pièces justificatives du dossier. */
export default async function ParentDocumentsPage() {
  const { documents } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Documents du dossier
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
           Les pièces prévues dans l&apos;aperçu du dossier et celles encore attendues.
        </p>
      </div>

      <DocumentsCard documents={documents} />

      <p className="text-[11px] text-[#8E9BAA] leading-relaxed">
         Une pièce « manquante » est signalée comme attendue dans l&apos;aperçu. Cet espace ne réalise aucune action sur les documents.
      </p>
    </div>
  );
}
