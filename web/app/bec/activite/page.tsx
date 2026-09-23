import type { Metadata } from "next";
import Link from "next/link";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getActivityForScope } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { ActivityLog } from "@/components/backoffice/ActivityLog";

export const metadata: Metadata = {
  title: "Activité",
  description:
    "Flux d'activité consolidé des 8 pays : dernières actions enregistrées sur les dossiers.",
};

const MAX_EVENTS = 50;

/**
 * Activité consolidée du BEC (spec §7).
 *
 * Flux court, destiné à la surveillance : les 50 dernières actions, tous pays
 * confondus. Le registre complet et paginé se trouve dans `/bec/historique` —
 * les deux pages ne répondent pas à la même question. Celle-ci demande « que
 * vient-il de se passer ? », l'autre « que s'est-il passé sur ce dossier ? ».
 */
export default async function BecActivitePage() {
  const scope = await requireBackofficeScope("BEC", "activity.read");
  const events = getActivityForScope(scope);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activité"
        subtitle="Dernières actions enregistrées sur l'ensemble du périmètre."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "Événements", value: String(events.length) },
        ]}
      />

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
        <ActivityLog events={events} role="BEC" variant="compact" max={MAX_EVENTS} />
        {events.length > MAX_EVENTS ? (
          <p className="mt-4 border-t border-[#EDF1F6] pt-3 text-[11px] text-[#98A2B3]">
            Les {MAX_EVENTS} événements les plus récents sont affichés sur{" "}
            {events.length}. Le registre complet est consultable dans{" "}
            <Link href="/bec/historique" className="font-bold text-[#174A7C] hover:underline">
              l&apos;historique
            </Link>
            .
          </p>
        ) : null}
      </section>
    </div>
  );
}
