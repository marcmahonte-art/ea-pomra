import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { parseDossierQuery, queryDossiers } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { DossiersBrowser } from "@/components/backoffice/DossiersBrowser";

export const metadata: Metadata = {
  title: "Suivi",
  description:
    "Dossiers parvenus à l'étape de suivi : filtres par pays, programme, formation, statut et période.",
};

/**
 * Suivi (spec §18).
 *
 * La page est une vue **filtrée** de la liste des dossiers, et non une liste
 * séparée : elle réutilise `queryDossiers()` avec `step = "SUIVI"`, ce qui lui
 * donne la recherche, les filtres, le tri et la pagination serveur sans en
 * réimplémenter un seul. Le filtre d'étape est posé ici, côté serveur, et
 * l'utilisateur ne peut pas le retirer par l'URL — retirer `step` afficherait
 * l'étape SUIVI quand même.
 */
export default async function AntenneSuiviPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const params = await searchParams;

  const query = { ...parseDossierQuery(params), step: "SUIVI" as const };
  const page = queryDossiers(scope, query);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivi"
        subtitle="Dossiers parvenus à l'étape de suivi académique."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Dossiers suivis", value: String(page.total) },
        ]}
      />

      <DossiersBrowser
        role="ANTENNE"
        page={page}
        showCountry
        emptyTitle="Aucun dossier suivi ne correspond aux filtres."
      />
    </div>
  );
}
