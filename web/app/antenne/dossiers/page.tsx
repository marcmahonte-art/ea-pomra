import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { parseDossierQuery, queryDossiers } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { DossiersBrowser } from "@/components/backoffice/DossiersBrowser";

export const metadata: Metadata = {
  title: "Dossiers",
  description:
    "Recherche, filtres et pagination des dossiers du périmètre de l'antenne.",
};

/**
 * Liste des dossiers de l'antenne (spec §10).
 *
 * Composant serveur. La recherche, les filtres, le tri et la pagination sont
 * lus dans les paramètres d'URL puis appliqués par `queryDossiers()` : le
 * navigateur ne reçoit que la page demandée, jamais l'ensemble des dossiers
 * (spec §32).
 */
export default async function AntenneDossiersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const params = await searchParams;

  const page = queryDossiers(scope, parseDossierQuery(params));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dossiers"
        subtitle="Ensemble des dossiers du périmètre de l'antenne."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Résultats", value: String(page.total) },
        ]}
      />

      <DossiersBrowser role="ANTENNE" page={page} showCountry={false} />
    </div>
  );
}
