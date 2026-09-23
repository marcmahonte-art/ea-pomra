import type {
  BackofficeRole,
  CountryCode,
  DossierPage,
  DossierQuery,
} from "@/lib/backoffice-types";
import { ALL_FORMATIONS, ALL_PROGRAMS, COUNTRIES_REFERENCE } from "@/lib/backoffice-data";
import { DossierSearch } from "./DossierSearch";
import { DossierFilters } from "./DossierFilters";
import { DossierList } from "./DossierTable";
import { Pagination } from "./Pagination";

/**
 * Corps commun d'une liste de dossiers : recherche, filtres, tableau, pagination.
 *
 * Trois pages partagent exactement cette structure — `/antenne/dossiers`,
 * `/antenne/suivi` et `/bec/dossiers` — et ne diffèrent que par le rôle, les
 * filtres visibles et l'étape éventuellement imposée. Les écrire trois fois
 * aurait produit trois paginations à corriger séparément, et c'est précisément
 * ainsi qu'une liste finit par se comporter différemment d'une page à l'autre.
 *
 * Composant serveur : `page` est déjà calculée par `queryDossiers()`.
 */
export function DossiersBrowser({
  role,
  page,
  showCountry,
  emptyTitle,
}: {
  role: BackofficeRole;
  page: DossierPage;
  showCountry: boolean;
  emptyTitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="p-4 border-b border-[#EDF1F6]">
        <DossierSearch />
      </div>

      <div className="p-4 border-b border-[#EDF1F6]">
        <DossierFilters
          role={role}
          programs={ALL_PROGRAMS}
          formations={ALL_FORMATIONS}
          countries={COUNTRIES_REFERENCE.map((country) => ({
            code: country.code as CountryCode,
            name: country.country,
            flag: country.flag,
          }))}
          showCountry={showCountry}
        />
      </div>

      <DossierList
        rows={page.rows}
        role={role}
        showCountry={showCountry}
        emptyTitle={emptyTitle}
      />

      <div className="px-4 pb-4">
        <Pagination
          page={page.page}
          totalPages={page.totalPages}
          total={page.total}
          pageSize={page.pageSize}
        />
      </div>
    </div>
  );
}

/** Résumé textuel d'une requête, affiché dans l'en-tête de page. */
export function querySummary(query: DossierQuery, total: number): string {
  const parts: string[] = [];
  if (query.q) parts.push(`« ${query.q} »`);
  if (query.state !== "all") parts.push(`statut filtré`);
  if (query.program !== "all") parts.push(query.program);
  if (query.formation !== "all") parts.push(query.formation);
  if (query.country !== "all") parts.push(`pays ${query.country}`);
  return parts.length > 0 ? `${total} résultat(s) — ${parts.join(" · ")}` : `${total} résultat(s)`;
}

export default DossiersBrowser;
