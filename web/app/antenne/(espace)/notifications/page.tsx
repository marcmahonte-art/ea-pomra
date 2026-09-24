import type { Metadata } from "next";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getDossiersForScope } from "@/lib/server/backoffice-service";
import { computeNotifications } from "@/lib/backoffice-data";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { NotificationsCenter } from "@/components/backoffice/NotificationsCenter";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Centre de notifications de l'antenne : dossiers à traiter, pièces à vérifier, avis reçus.",
};

/**
 * Centre de notifications (spec §38).
 *
 * Les entrées sont dérivées de l'état du workflow au moment du rendu. Aucun
 * canal externe (WhatsApp, email) n'est branché — la spec §38 le rattache au
 * système de notifications global, qui n'existe pas encore. La page ne promet
 * donc rien qu'elle ne tienne : elle liste ce qui attend une action.
 */
export default async function AntenneNotificationsPage() {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const dossiers = await getDossiersForScope(scope);
  const notifications = computeNotifications(scope, "ANTENNE", dossiers);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Événements requérant l'attention de l'antenne."
        meta={[
          {
            label: "Antenne",
            value: `${scope.flag ?? ""} ${scope.country ?? "Périmètre non défini"}`,
          },
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
