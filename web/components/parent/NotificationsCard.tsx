import Link from "next/link";
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { NotificationItem } from "@/lib/types";

/**
 * Type de notification → icône, libellé et couleur.
 *
 * `action_required` est traité à part des autres : c'est le seul cas qui attend
 * quelque chose du parent, et il doit rester repérable dans une liste où tout le
 * reste est informatif.
 */
const TYPES: Record<
  NotificationItem["type"],
  { Icon: typeof Info; className: string; label: string }
> = {
  info: { Icon: Info, className: "bg-[#EBF3FA] text-[#174A7C]", label: "Information" },
  success: {
    Icon: CheckCircle2,
    className: "bg-[#E8F6EF] text-[#1EA362]",
    label: "Confirmation",
  },
  warning: {
    Icon: AlertTriangle,
    className: "bg-[#FEF7EC] text-[#B86E00]",
    label: "Attention",
  },
  action_required: {
    Icon: AlertCircle,
    className: "bg-[#FDECEC] text-[#D9383A]",
    label: "Action requise",
  },
};

export function NotificationsCard({
  notifications,
  title = "Notifications",
}: {
  notifications: NotificationItem[];
  title?: string;
}) {
  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
      <header className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
        <h2 className="text-sm font-bold text-[#0D2B4D]">{title}</h2>
        <Bell className="w-5 h-5 text-[#8E9BAA] shrink-0" />
      </header>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Vous serez prévenu ici à chaque étape franchie ou dès qu'une action sera attendue de votre part."
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => {
            const type = TYPES[notification.type];
            const Icon = type.Icon;

            return (
              <li
                key={notification.id}
                className={`rounded-2xl border p-4 flex items-start gap-3 ${
                  notification.read
                    ? "border-[#E6E9EF] bg-white"
                    : "border-[#D5E5F5] bg-[#FAFCFE]"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${type.className}`}
                >
                  <Icon className="w-4 h-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-[#0D2B4D]">
                      {notification.title}
                    </p>
                    {!notification.read ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#3B82F6] text-white">
                        Nouveau
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-[#5B6776] leading-relaxed mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-[#8E9BAA]">
                      {notification.date}
                    </span>
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        className="text-[11px] font-bold text-[#174A7C] hover:underline"
                      >
                        Ouvrir →
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default NotificationsCard;
