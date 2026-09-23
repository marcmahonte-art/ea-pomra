import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeByStep } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { OrientationQueue } from "@/components/backoffice/OrientationQueue";

export const metadata: Metadata = {
  title: "Orientation",
  description:
    "Dossiers en attente d'avis OCO, dossiers transmis, avis reçus et dossiers à compléter.",
};

/**
 * Orientation (spec §16).
 *
 * Les dossiers sont sélectionnés par leur **étape de workflow** et non par un
 * état saisi dans l'interface. Spec §36 : le statut affiché doit toujours
 * provenir du workflow métier enregistré côté serveur.
 */
export default async function AntenneOrientationPage() {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const dossiers = computeByStep(scope, "ORIENTATION");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orientation"
        subtitle="Préparation et suivi des dossiers nécessitant un avis OCO."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Dossiers à l'étape", value: String(dossiers.length) },
        ]}
      />

      <OrientationQueue dossiers={dossiers} role="ANTENNE" />
    </div>
  );
}
