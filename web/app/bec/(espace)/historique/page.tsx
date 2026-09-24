import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getActivityForScope, getDossiersForScope } from "@/lib/server/backoffice-service";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ActivityLog } from "@/components/backoffice/ActivityLog";
import { Pagination } from "@/components/backoffice/Pagination";

export const metadata: Metadata = {
  title: "Historique",
  description:
    "Registre chronologique consolidé, en lecture seule, des opérations des 8 pays.",
};

const DEFAULT_SIZE = 25;
const ALLOWED_SIZES = [25, 50, 100];

/**
 * Registre chronologique consolidé (spec §15).
 *
 * Le BEC consolide huit pays : le registre complet dépasse le millier de lignes.
 * Il est donc paginé côté serveur — envoyer l'intégralité au navigateur irait
 * directement contre la spec §32, et rendrait la page inutilisable sur une
 * connexion faible.
 */
export default async function BecHistoriquePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const scope = await requireBackofficeScope("BEC", "history.read");
  const dossiers = await getDossiersForScope(scope);
  const params = await searchParams;

  const raw = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const requestedSize = Number.parseInt(raw("pageSize") ?? String(DEFAULT_SIZE), 10);
  const pageSize = ALLOWED_SIZES.includes(requestedSize) ? requestedSize : DEFAULT_SIZE;

  const events = await getActivityForScope(scope, dossiers);
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
        subtitle="Registre chronologique consolidé des opérations."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "Événements", value: String(total) },
        ]}
      />

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <ActivityLog events={rows} role="BEC" variant="full" />

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
