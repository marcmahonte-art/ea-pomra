import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getStssTransfersPageForScope } from "@/lib/server/stss-service";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { StssPanel } from "@/components/backoffice/StssPanel";

export const metadata: Metadata = {
  title: "STSS",
  description:
    "Aperçu en lecture seule des transferts STSS simulés du périmètre antenne."
};

export default async function AntenneStssPage() {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const page = await getStssTransfersPageForScope(scope);

  return (
    <div className="space-y-6">
      <PageHeader
        title="STSS"
        subtitle="Aperçu borné des transferts STSS du périmètre antenne."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`
          },
          { label: "Page", value: String(page.page) },
          { label: "Limite", value: `${page.limit} lignes` },
          { label: "Total disponible", value: String(page.total) },
          { label: "Affichés", value: String(page.items.length) },
          { label: "Simulations affichées", value: String(page.aggregate.simulation) }
        ]}
      />

      <StssPanel transfers={page.items} role="ANTENNE" />
    </div>
  );
}
