import { ShieldCheck, Landmark, CalendarClock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { FinanceSummary } from "@/lib/parent-types";

const TRANSACTION_STYLES: Record<
  FinanceSummary["transactions"][number]["status"],
  string
> = {
  SIMULATION: "bg-[#F4F3FF] text-[#5B4BB7] border-[#D9D4FF]",
  "En attente": "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
  Programmé: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
};

/**
 * Scolarité et transferts STSS.
 *
 * Le montant restant dû est **calculé** à partir du total et des versements, et
 * non lu depuis les données : un solde recopié finit toujours par diverger de
 * la somme qu'il est censé représenter.
 */
export function FinanceCard({ finance }: { finance: FinanceSummary }) {
  const remaining = Math.max(finance.tuitionTotal - finance.tuitionPaid, 0);
  const paidPercent =
    finance.tuitionTotal > 0
      ? Math.round((finance.tuitionPaid / finance.tuitionTotal) * 100)
      : 0;

  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
      <header className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
        <div>
          <h2 className="text-sm font-bold text-[#0D2B4D]">
             Scolarité &amp; aperçu STSS
          </h2>
          <p className="text-xs text-[#5B6776] mt-0.5">{finance.statusLabel}</p>
        </div>
        <ShieldCheck className="w-5 h-5 text-[#1EA362] shrink-0" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E6E9EF] bg-[#FAFCFE] p-4">
          <p className="text-[11px] font-semibold text-[#8E9BAA]">
            Scolarité totale
          </p>
          <p className="text-lg font-black text-[#0D2B4D] mt-1">
            {formatCurrency(finance.tuitionTotal, finance.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#C5EBDA] bg-[#E8F6EF] p-4">
          <p className="text-[11px] font-semibold text-[#1EA362]">
             Scénario simulé
          </p>
          <p className="text-lg font-black text-[#0D2B4D] mt-1">
            {formatCurrency(finance.tuitionPaid, finance.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#FDE5C5] bg-[#FEF7EC] p-4">
          <p className="text-[11px] font-semibold text-[#B86E00]">
            Solde restant
          </p>
          <p className="text-lg font-black text-[#0D2B4D] mt-1">
            {formatCurrency(remaining, finance.currency)}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#5B6776] mb-1.5">
           <span>Avancement du scénario</span>
          <span>{paidPercent} %</span>
        </div>
        <div
          className="h-2 rounded-full bg-[#E6E9EF] overflow-hidden"
          role="progressbar"
          aria-valuenow={paidPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression du transfert de scolarité"
        >
          <div
            className="h-full rounded-full bg-[#C89C2E]"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <Landmark className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
          <div>
            <dt className="text-[11px] font-semibold text-[#8E9BAA]">
               Établissement représenté
            </dt>
            <dd className="font-bold text-[#0D2B4D] mt-0.5">
              {finance.beneficiary}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CalendarClock className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
          <div>
            <dt className="text-[11px] font-semibold text-[#8E9BAA]">
              Prochaine échéance
            </dt>
            <dd className="font-bold text-[#0D2B4D] mt-0.5">
              {finance.nextDueDate ?? "Aucune échéance en cours"}
            </dd>
          </div>
        </div>
      </dl>

      <div>
        <h3 className="text-xs font-bold text-[#0D2B4D] mb-3">
           Scénarios affichés
        </h3>
        <ul className="space-y-2">
          {finance.transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="rounded-2xl border border-[#E6E9EF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0D2B4D]">
                  {transaction.label}
                </p>
                <p className="text-[11px] text-[#5B6776] mt-0.5">
                  {transaction.date} · Réf.{" "}
                  <span className="font-mono">{transaction.reference}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-black text-[#0D2B4D]">
                  {formatCurrency(transaction.amount, finance.currency)}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TRANSACTION_STYLES[transaction.status]}`}
                >
                  {transaction.status}
                </span>
                  {transaction.status === "SIMULATION" ? (
                   <span className="text-[11px] font-bold text-[#5B4BB7]">Aucune quittance</span>
                 ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FinanceCard;
