import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getStssTransfersPageForScope } from "@/lib/server/stss-service";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { StssPanel } from "@/components/backoffice/StssPanel";

export const metadata: Metadata = {
  title: "STSS",
  description: "Aperçu borné et en lecture seule des transferts STSS simulés."
};

function formatMinorAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString("fr-FR")} ${currency} (unités mineures)`;
}

export default async function BecStssPage() {
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const page = await getStssTransfersPageForScope(scope);

  return (
    <div className="space-y-6">
      <PageHeader
        title="STSS"
        subtitle="Aperçu borné des transferts STSS du périmètre BEC."
        meta={[
          { label: "Périmètre", value: "8 pays — aperçu borné" },
          { label: "Page", value: String(page.page) },
          { label: "Limite", value: `${page.limit} lignes` },
          { label: "Total disponible", value: String(page.total) },
          { label: "Affichés", value: String(page.items.length) },
          { label: "Simulations affichées", value: String(page.aggregate.simulation) }
        ]}
      />

      {page.aggregate.currencies.length > 0 ? (
        <section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft">
          <h2 className="text-base font-bold text-[#0D2B4D]">Aperçu des montants par devise</h2>
          <p className="mt-1 text-xs text-[#5B6776]">
            Agrégats calculés uniquement sur les {page.items.length} lignes affichées de cette page.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {page.aggregate.currencies.map((currency) => (
              <div key={currency} className="rounded-xl border border-[#EDF1F6] bg-[#F7F9FB] p-4">
                <p className="text-xs font-bold text-[#174A7C]">{currency}</p>
                <p className="mt-2 text-sm font-black text-[#0D2B4D]">
                  Brut : {formatMinorAmount(page.aggregate.byCurrency[currency].grossAmountMinor, currency)}
                </p>
                <p className="mt-1 text-xs text-[#5B6776]">
                  Net : {formatMinorAmount(page.aggregate.byCurrency[currency].netAmountMinor, currency)}
                </p>
                <p className="mt-1 text-xs text-[#5B6776]">
                  Commission : {formatMinorAmount(page.aggregate.byCurrency[currency].commissionAmountMinor, currency)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <StssPanel transfers={page.items} role="BEC" />
    </div>
  );
}
