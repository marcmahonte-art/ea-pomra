import { ShieldCheck, FileCheck2, FileX2, Info } from "lucide-react";
import type { BackofficeRole, Dossier, StssInfo } from "@/lib/backoffice-types";
import { DataTable, type Column } from "./DataTable";
import { DossierLink } from "./DossierTable";

/**
 * STSS — emplacement d'intégration (spec §22).
 *
 * La spec autorise explicitement le back-office à prévoir le module « sans
 * dépendre de l'intégration Mobile Money finale » et interdit d'implémenter un
 * paiement réel tant que l'intégration STSS n'est pas validée.
 *
 * Ce panneau est donc en **lecture seule** : il affiche la référence, les
 * antennes source et destination, le statut, l'existence d'une preuve et la
 * date. Aucun bouton de transfert, de validation ou d'émission n'est proposé —
 * ce serait précisément le paiement réel que la spec refuse à ce stade.
 *
 * La colonne « Preuve » ne montre jamais un lien : aucune pièce n'est stockée.
 * Elle indique si une preuve est **attendue** ou **fournie**, ce qui suffit au
 * suivi opérationnel.
 */
const STSS_STATUS_TONE: Record<StssInfo["status"], string> = {
  Programmé: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
  Confirmé: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
  "En attente de preuve": "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
  Rejeté: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]",
};

export function StssPanel({
  dossiers,
  role,
}: {
  dossiers: Dossier[];
  role: BackofficeRole;
}) {
  const columns: Column<Dossier>[] = [
    {
      key: "reference",
      header: "Référence",
      render: (dossier) => (
        <span className="font-mono text-[11px] font-semibold text-[#174A7C]">
          {dossier.stss?.reference ?? "—"}
        </span>
      ),
    },
    {
      key: "dossier",
      header: "ID-POMRA",
      render: (dossier) => (
        <DossierLink role={role} dossierId={dossier.id} reference={dossier.reference} />
      ),
    },
    {
      key: "source",
      header: "Antenne source",
      render: (dossier) => (
        <span className="text-[11px] text-[#5B6776]">
          {dossier.stss?.sourceAntenna ?? "—"}
        </span>
      ),
    },
    {
      key: "target",
      header: "Antenne destination",
      render: (dossier) => (
        <span className="text-[11px] font-semibold text-[#0D2B4D]">
          {dossier.stss?.targetAntenna ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (dossier) =>
        dossier.stss ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${STSS_STATUS_TONE[dossier.stss.status]}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            {dossier.stss.status}
          </span>
        ) : (
          <span className="text-[11px] text-[#98A2B3]">—</span>
        ),
    },
    {
      key: "proof",
      header: "Preuve",
      render: (dossier) =>
        dossier.stss?.proofUrl ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1EA362] whitespace-nowrap">
            <FileCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
            Fournie
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B86E00] whitespace-nowrap">
            <FileX2 className="w-3.5 h-3.5" aria-hidden="true" />
            Attendue
          </span>
        ),
    },
    {
      key: "date",
      header: "Date",
      render: (dossier) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {dossier.stss?.date ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
          <ShieldCheck className="w-4 h-4 text-[#667085]" aria-hidden="true" />
          Transferts STSS
        </h2>
        <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
          Emplacement d&apos;intégration du module STSS (Phase 5). Suivi en
          lecture seule des transferts sécurisés de scolarité.
        </p>
      </div>

      <DataTable
        caption="Transferts STSS du périmètre"
        columns={columns}
        rows={dossiers}
        rowKey={(dossier) => dossier.id}
        emptyLabel="Aucun transfert STSS n'est rattaché au périmètre."
      />

      <p className="flex items-start gap-2 border-t border-[#EDF1F6] px-5 py-3 text-[11px] leading-relaxed text-[#B86E00]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Aucun paiement réel n&apos;est effectué depuis ce back-office :
          l&apos;intégration Mobile Money n&apos;est pas encore validée. Les
          statuts affichés proviennent du workflow serveur.
        </span>
      </p>
    </section>
  );
}

export default StssPanel;
