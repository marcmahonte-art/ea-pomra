import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { NotificationsCard } from "@/components/parent/NotificationsCard";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Historique des alertes et des actions attendues sur le dossier suivi.",
};

/** Historique complet des notifications. */
export default async function ParentNotificationsPage() {
  const { notifications } = await buildParentDashboardData();

  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Notifications
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          {unread > 0
            ? `${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}.`
            : "Toutes les notifications ont été lues."}
        </p>
      </div>

      <NotificationsCard
        notifications={notifications}
        title="Toutes les notifications"
      />
    </div>
  );
}
