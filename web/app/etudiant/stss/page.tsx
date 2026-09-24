import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, Info, ShieldCheck } from "lucide-react";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";

export const metadata: Metadata = {
  title: "STSS — Simulation",
  description: "Aperçu student du parcours STSS, sans paiement ni quittance."
};

export default function StudentStssPage() {
  const transaction = MOCK_ACTIVE_STUDENT.stssTransaction;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-[#5B6776]">
        <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
        <span>/</span>
        <span className="text-[#174A7C] font-semibold">STSS</span>
      </div>

      <section className="rounded-3xl border border-[#D9D4FF] bg-[#F4F3FF] p-6 sm:p-8 shadow-eap-soft">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B4BB7] text-white">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5B4BB7]">SIMULATION</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#0D2B4D]">Dispositif STSS</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5B6776]">
                Cet espace montre le fonctionnement prévu du transfert de scolarité. Il ne déclenche aucun paiement Mobile Money et ne produit aucune quittance.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#D9D4FF] bg-white px-3 py-2 text-xs font-bold text-[#5B4BB7]">
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            Lecture seule
          </span>
        </div>
      </section>

      {transaction ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E6E9EF] bg-white p-5">
            <span className="text-xs text-[#98A2B3]">Référence</span>
            <p className="mt-2 font-mono text-sm font-bold text-[#0D2B4D]">{transaction.referenceCode}</p>
          </div>
          <div className="rounded-2xl border border-[#E6E9EF] bg-white p-5">
            <span className="text-xs text-[#98A2B3]">Montant du scénario</span>
            <p className="mt-2 text-lg font-black text-[#0D2B4D]">{transaction.amount.toLocaleString("fr-FR")} {transaction.currency}</p>
          </div>
          <div className="rounded-2xl border border-[#E6E9EF] bg-white p-5">
            <span className="text-xs text-[#98A2B3]">Statut</span>
            <p className="mt-2 text-sm font-black text-[#5B4BB7]">SIMULATION</p>
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5B4BB7]" aria-hidden="true" />
          <div>
            <h2 className="font-bold text-[#0D2B4D]">Limites de cette démonstration</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5B6776]">
              Aucun fournisseur de paiement, KYC, webhook ou document fictif n&apos;est connecté. Le pilote opérationnel devra être validé séparément avant toute action financière.
            </p>
            <Link href="/" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#174A7C] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
