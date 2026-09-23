import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeByStep } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { MobilitePanel } from "@/components/backoffice/MobilitePanel";

export const metadata: Metadata = {
  title: "Mobilité",
  description:
    "Dossiers dont le parcours comporte une étape de mobilité entre pays.",
};

/**
 * Mobilité (spec §17).
 *
 * Le suivi s'arrête à l'état d'avancement : aucune donnée hors périmètre n'est
 * exposée, et le filtrage a lieu côté serveur, dans `computeByStep()`.
 */
export default async function AntenneMobilitePage() {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const dossiers = computeByStep(scope, "MOBILITE");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mobilité"
        subtitle="Suivi des parcours comportant une mobilité entre pays."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Dossiers à l'étape", value: String(dossiers.length) },
        ]}
      />

      <MobilitePanel dossiers={dossiers} role="ANTENNE" />
    </div>
  );
}
