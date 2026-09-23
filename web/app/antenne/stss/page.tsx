import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeStssDossiers } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { StssPanel } from "@/components/backoffice/StssPanel";

export const metadata: Metadata = {
  title: "STSS",
  description:
    "Suivi en lecture seule des transferts sécurisés de scolarité du périmètre.",
};

/**
 * STSS (spec §22).
 *
 * Emplacement du module Phase 5, en lecture seule. La page ne propose aucune
 * action de paiement : la spec interdit d'implémenter un paiement réel avant
 * validation de l'intégration Mobile Money.
 */
export default async function AntenneStssPage() {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const dossiers = computeStssDossiers(scope);

  return (
    <div className="space-y-6">
      <PageHeader
        title="STSS"
        subtitle="Transferts sécurisés de scolarité rattachés au périmètre."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Transferts", value: String(dossiers.length) },
        ]}
      />

      <StssPanel dossiers={dossiers} role="ANTENNE" />
    </div>
  );
}
