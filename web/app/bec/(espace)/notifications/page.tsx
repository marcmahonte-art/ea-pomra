import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getDossiersForScope } from "@/lib/server/backoffice-service";
import { computeNotifications } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { NotificationsCenter } from "@/components/backoffice/NotificationsCenter";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Centre de notifications du BEC : validations demandées, avis reçus, dossiers en attente.",
};

/**
 * Centre de notifications du BEC (spec §38).
 *
 * `computeNotifications(scope, "BEC")` produit une liste différente de celle de
 * l'antenne : « validation demandée » n'apparaît qu'ici, « dossier à traiter »
 * que là-bas. Servir les deux listes indifféremment ferait remonter dans la
 * cloche d'un agent des dossiers sur lesquels il n'a aucune action possible.
 */
export default async function BecNotificationsPage() {
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const dossiers = await getDossiersForScope(scope);

  const notifications = computeNotifications(scope, "BEC", dossiers);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Événements requérant l'attention du Bureau Exécutif Central."
        meta={[
          { label: "Périmètre", value: "🌍 8 pays — vue consolidée" },
          { label: "Notifications", value: String(notifications.length) },
        ]}
      />

      <NotificationsCenter notifications={notifications} />

      <p className="text-[11px] leading-relaxed text-[#98A2B3]">
        L&apos;état « lu / non lu » n&apos;est pas affiché : il exigerait une
        persistance par utilisateur, qui n&apos;existe pas encore. Les envois
        WhatsApp et email relèvent du système de notifications global et ne sont
        pas raccordés.
      </p>
    </div>
  );
}
