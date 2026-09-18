import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { FinanceCard } from "@/components/parent/FinanceCard";
import { NextActionBanner } from "@/components/parent/NextActionBanner";

export const metadata: Metadata = {
  title: "Finances & transferts STSS",
  description:
    "Montants transférés à l'établissement, quittances officielles et prochaines échéances du dispositif STSS.",
};

/** Transferts de scolarité sécurisés (STSS). */
export default async function ParentFinancesPage() {
  const { finance, nextAction } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Finances &amp; transferts STSS
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          Les fonds sont virés directement à l&apos;établissement d&apos;accueil.
          Aucun versement n&apos;est remis en main propre à un intermédiaire.
        </p>
      </div>

      <NextActionBanner action={nextAction} />

      <FinanceCard finance={finance} />

      <section className="bg-[#EBF3FA] border border-[#D5E5F5] rounded-2xl p-5">
        <h2 className="text-xs font-bold text-[#174A7C] uppercase tracking-wider">
          Comment fonctionne le transfert sécurisé
        </h2>
        <ol className="mt-3 space-y-2 text-xs text-[#0D2B4D] leading-relaxed list-decimal list-inside">
          <li>
            La famille dépose les frais auprès de l&apos;antenne du pays
            d&apos;origine — jamais auprès d&apos;un particulier.
          </li>
          <li>
            L&apos;antenne émet un ordre de virement au nom de l&apos;établissement
            d&apos;accueil.
          </li>
          <li>
            L&apos;établissement confirme la réception et une quittance officielle
            est générée, puis déposée dans vos documents.
          </li>
        </ol>
      </section>
    </div>
  );
}
