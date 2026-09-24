import { Info, ShieldCheck } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import {
  STSS_STATUS_LABELS,
  type StssStatus,
  type StssTransferView
} from "@/lib/stss-types";
import { DataTable, type Column } from "./DataTable";
import { DossierLink } from "./DossierTable";

interface StssRow {
  id: string;
  dossierId: string | null;
  dossierReference: string | null;
  reference: string;
  sourceAntenna: string;
  destinationAntenna: string;
  grossAmountMinor: number;
  netAmountMinor: number;
  commissionAmountMinor: number;
  commissionRateBps: number;
  currency: string;
  status: StssStatus;
  isSimulation: boolean;
  date: string;
}

const STSS_STATUS_TONE: Record<StssStatus, string> = {
  DRAFT: "bg-[#F7F9FB] text-[#667085] border-[#E6E9EF]",
  PENDING_KYC: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
  PENDING_PAYMENT: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
  PAYMENT_CONFIRMED: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
  TRANSFER_PENDING: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
  TRANSFER_CONFIRMED: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
  FAILED: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]",
  CANCELLED: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]",
  SIMULATION: "bg-[#F4F3FF] text-[#5B4BB7] border-[#D9D4FF]"
};

function formatMinorAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString("fr-FR")} ${currency} (unités mineures)`;
}

function displayDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(date);
}

function dossierRow(dossier: Dossier): StssRow | null {
  const stss = dossier.stss;
  if (!stss) return null;
  return {
    id: stss.id,
    dossierId: dossier.id,
    dossierReference: dossier.reference,
    reference: stss.reference,
    sourceAntenna: stss.sourceAntenna,
    destinationAntenna: stss.targetAntenna,
    grossAmountMinor: stss.grossAmountMinor,
    netAmountMinor: stss.netAmountMinor,
    commissionAmountMinor: stss.commissionAmountMinor,
    commissionRateBps: stss.commissionRateBps,
    currency: stss.currency,
    status: stss.status,
    isSimulation: stss.isSimulation,
    date: stss.date
  };
}

export function StssPanel({
  dossiers,
  transfers,
  role
}: {
  dossiers?: Dossier[];
  transfers?: StssTransferView[];
  role: BackofficeRole;
}) {
  const rows: StssRow[] = transfers
    ? transfers.map((transfer) => ({
        id: transfer.id,
        dossierId: transfer.dossierId,
        dossierReference: transfer.dossierReference,
        reference: transfer.reference,
        sourceAntenna: transfer.sourceAntenna,
        destinationAntenna: transfer.destinationAntenna,
        grossAmountMinor: transfer.grossAmountMinor,
        netAmountMinor: transfer.netAmountMinor,
        commissionAmountMinor: transfer.commissionAmountMinor,
        commissionRateBps: transfer.commissionRateBps,
        currency: transfer.currency,
        status: transfer.status,
        isSimulation: transfer.isSimulation,
        date: transfer.updatedAt
      }))
    : (dossiers ?? []).map(dossierRow).filter((row): row is StssRow => row !== null);

  const columns: Column<StssRow>[] = [
    {
      key: "reference",
      header: "Référence",
      render: (row) => (
        <span className="font-mono text-[11px] font-semibold text-[#174A7C]">{row.reference}</span>
      )
    },
    {
      key: "dossier",
      header: "ID-POMRA",
      render: (row) =>
        row.dossierId && row.dossierReference ? (
          <DossierLink role={role} dossierId={row.dossierId} reference={row.dossierReference} />
        ) : (
          <span className="text-[11px] text-[#98A2B3]">Non rattaché</span>
        )
    },
    {
      key: "route",
      header: "Antennes",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap">
          {row.sourceAntenna} → {row.destinationAntenna}
        </span>
      )
    },
    {
      key: "gross",
      header: "Brut",
      render: (row) => (
        <span className="text-[11px] font-semibold text-[#0D2B4D] whitespace-nowrap">
          {formatMinorAmount(row.grossAmountMinor, row.currency)}
        </span>
      )
    },
    {
      key: "net",
      header: "Net / commission",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap">
          {formatMinorAmount(row.netAmountMinor, row.currency)} · {formatMinorAmount(row.commissionAmountMinor, row.currency)} ({row.commissionRateBps} bps)
        </span>
      )
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${STSS_STATUS_TONE[row.status]}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          {STSS_STATUS_LABELS[row.status]}
        </span>
      )
    },
    {
      key: "date",
      header: "Mise à jour",
      render: (row) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {displayDate(row.date)}
        </span>
      )
    }
  ];

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
          <ShieldCheck className="w-4 h-4 text-[#667085]" aria-hidden="true" />
          Transferts STSS
        </h2>
        <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
          Lecture seule des transferts du périmètre. Les montants sont conservés en unités mineures entières.
        </p>
      </div>

      <DataTable
        caption="Transferts STSS du périmètre"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        emptyLabel="Aucun transfert STSS n'est rattaché au périmètre."
      />

      <p className="flex items-start gap-2 border-t border-[#EDF1F6] px-5 py-3 text-[11px] leading-relaxed text-[#5B4BB7]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          SIMULATION : aucune action de paiement, aucun appel Mobile Money et aucune quittance n&apos;est disponible dans cet espace.
        </span>
      </p>
    </section>
  );
}

export default StssPanel;
