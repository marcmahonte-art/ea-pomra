import Link from "next/link";
import {
  Inbox,
  ListChecks,
  FileWarning,
  MessageSquareCheck,
  CheckCircle2,
  Hourglass,
  FileBarChart2,
  BellOff,
  ChevronRight,
} from "lucide-react";
import type { BackofficeNotification, NotificationKind } from "@/lib/backoffice-types";
import { NOTIFICATION_KIND_LABELS } from "@/lib/backoffice-types";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Centre de notifications (spec §38).
 *
 * Les entrées sont dérivées de l'état du workflow côté serveur, jamais d'une
 * file séparée : une notification ne peut donc pas annoncer un dossier déjà
 * traité, ni en oublier un.
 *
 * L'état « lu / non lu » n'est pas affiché. Il exigerait une persistance par
 * utilisateur, qui n'existe pas encore — un badge « non lu » qui se réinitialise
 * à chaque rechargement serait une fausse information.
 */
const KIND_STYLES: Record<
  NotificationKind,
  { Icon: typeof Inbox; className: string }
> = {
  NOUVEAU_DOSSIER: { Icon: Inbox, className: "bg-[#EBF3FA] text-[#174A7C]" },
  DOSSIER_A_TRAITER: { Icon: ListChecks, className: "bg-[#FEF7EC] text-[#B86E00]" },
  DOCUMENT_A_VERIFIER: { Icon: FileWarning, className: "bg-[#FEF7EC] text-[#B86E00]" },
  AVIS_RECU: { Icon: MessageSquareCheck, className: "bg-[#E8F6EF] text-[#1EA362]" },
  VALIDATION_DEMANDEE: { Icon: CheckCircle2, className: "bg-[#FBF6EA] text-[#9A741A]" },
  DOSSIER_EN_ATTENTE: { Icon: Hourglass, className: "bg-[#F0F3F7] text-[#475467]" },
  RAPPORT_DISPONIBLE: { Icon: FileBarChart2, className: "bg-[#EBF3FA] text-[#174A7C]" },
};

export function NotificationsCenter({
  notifications,
}: {
  notifications: BackofficeNotification[];
}) {
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="Aucune notification"
        description="Aucun événement ne requiert votre attention sur ce périmètre. Les nouvelles activités apparaîtront ici."
      />
    );
  }

  return (
    <ul className="divide-y divide-[#EDF1F6] rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      {notifications.map((notification) => {
        const { Icon, className } = KIND_STYLES[notification.kind];
        return (
          <li key={notification.id}>
            <Link
              href={notification.href}
              className="flex items-start gap-3 px-5 py-4 hover:bg-[#FAFCFE] transition-colors"
            >
              <span
                aria-hidden="true"
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${className}`}
              >
                <Icon className="w-4 h-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    {NOTIFICATION_KIND_LABELS[notification.kind]}
                  </span>
                  <span className="text-[10px] text-[#98A2B3] tabular-nums">
                    {notification.atLabel}
                  </span>
                </span>
                <span className="mt-1 block text-xs font-bold text-[#0D2B4D]">
                  {notification.title}
                </span>
                <span className="block text-[11px] text-[#5B6776] leading-snug">
                  {notification.detail}
                </span>
              </span>

              <ChevronRight
                className="w-4 h-4 text-[#98A2B3] shrink-0 mt-2"
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default NotificationsCenter;
