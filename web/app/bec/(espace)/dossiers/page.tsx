import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { parseDossierQuery, queryDossiers } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { DossiersBrowser } from "@/components/backoffice/DossiersBrowser";

export const metadata: Metadata = {
  title: "Dossiers",
  description:
    "Recherche, filtres et pagination des dossiers des 8 pays du périmètre consolidé.",
};

/**
 * Liste des dossiers du BEC (spec §10.3).
 *
 * Différence avec l'antenne : le filtre « Pays / Antenne » est présent, et la
 * colonne pays du tableau est obligatoire (spec §10.4). Le reste — recherche,
 * filtres, tri, pagination — est strictement le même composant, pour que les
 * deux back-offices ne divergent pas.
 */
export default async function BecDossiersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const params = await searchParams;

  const page = queryDossiers(scope, parseDossierQuery(params));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dossiers"
        subtitle="Ensemble des dossiers des 8 pays."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "Résultats", value: String(page.total) },
        ]}
      />

      <DossiersBrowser role="BEC" page={page} showCountry />
    </div>
  );
}
