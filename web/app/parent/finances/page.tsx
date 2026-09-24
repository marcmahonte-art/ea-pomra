import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { FinanceCard } from "@/components/parent/FinanceCard";
import { NextActionBanner } from "@/components/parent/NextActionBanner";

export const metadata: Metadata = {
  title: "Aperçu financier STSS",
  description:
    "Aperçu en lecture seule des montants et étapes simulés du dispositif STSS.",
};

/** Aperçu des scénarios de scolarité STSS. */
export default async function ParentFinancesPage() {
  const { finance, nextAction } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
           Finances &amp; aperçu STSS
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
            Les montants affichés sont des scénarios de démonstration. Aucune action financière n&apos;est effectuée et aucun justificatif officiel n&apos;est disponible.
        </p>
      </div>

      <NextActionBanner action={nextAction} />

      <FinanceCard finance={finance} />

      <section className="bg-[#EBF3FA] border border-[#D5E5F5] rounded-2xl p-5">
        <h2 className="text-xs font-bold text-[#174A7C] uppercase tracking-wider">
           Aperçu du parcours STSS
        </h2>
        <ol className="mt-3 space-y-2 text-xs text-[#0D2B4D] leading-relaxed list-decimal list-inside">
          <li>
             Le scénario présente les frais de scolarité et l&apos;antenne du pays d&apos;origine.
           </li>
           <li>
             Le parcours prévoit ensuite une étape KYC et une validation par l&apos;antenne.
           </li>
           <li>
              Une action financière et un justificatif nécessiteraient un pilote provider conforme.
          </li>
        </ol>
      </section>
    </div>
  );
}
