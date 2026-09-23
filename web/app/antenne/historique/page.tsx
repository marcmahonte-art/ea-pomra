import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getActivityForScope } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ActivityLog } from "@/components/backoffice/ActivityLog";
import { Pagination } from "@/components/backoffice/Pagination";

export const metadata: Metadata = {
  title: "Historique",
  description:
    "Registre chronologique en lecture seule des opérations réalisées sur le périmètre.",
};

const DEFAULT_SIZE = 25;
const ALLOWED_SIZES = [25, 50, 100];

/**
 * Registre chronologique (spec §15).
 *
 * Huit colonnes, dont l'ancien et le nouveau statut. Le registre est en
 * **lecture seule** : `ActivityLog` ne reçoit que des événements et n'expose
 * aucune fonction d'écriture. Spec §15 : « l'historique doit être consultable
 * mais non modifiable par les utilisateurs standards ».
 *
 * Le registre est paginé, côté serveur là aussi. Le BEC consolide huit pays :
 * l'historique complet dépasse allègrement le millier de lignes, et l'envoyer
 * d'un bloc au navigateur irait directement contre la spec §32.
 */
export default async function AntenneHistoriquePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("ANTENNE", "history.read");
  const params = await searchParams;

  const raw = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const requestedSize = Number.parseInt(raw("pageSize") ?? String(DEFAULT_SIZE), 10);
  const pageSize = ALLOWED_SIZES.includes(requestedSize) ? requestedSize : DEFAULT_SIZE;

  const events = getActivityForScope(scope);
  const total = events.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const requestedPage = Number.parseInt(raw("page") ?? "1", 10);
  const page = Math.min(
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    totalPages
  );

  const rows = events.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Historique"
        subtitle="Registre chronologique des opérations du périmètre."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
          { label: "Événements", value: String(total) },
        ]}
      />

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <ActivityLog events={rows} role="ANTENNE" variant="full" />

        <div className="px-4 pb-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
          />
        </div>
      </section>
    </div>
  );
}
