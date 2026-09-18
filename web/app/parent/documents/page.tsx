import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { DocumentsCard } from "@/components/parent/DocumentsCard";

export const metadata: Metadata = {
  title: "Documents du dossier",
  description:
    "Pièces justificatives déposées, statut de vérification et quittances téléchargeables.",
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
          Les pièces déposées auprès de votre antenne, et celles encore
          attendues.
        </p>
      </div>

      <DocumentsCard documents={documents} />

      <p className="text-[11px] text-[#8E9BAA] leading-relaxed">
        Une pièce « manquante » doit être déposée auprès de votre antenne : elle
        ne peut pas être ajoutée depuis cet espace, afin qu&apos;aucun document
        non vérifié n&apos;entre dans un dossier officiel.
      </p>
    </div>
  );
}
