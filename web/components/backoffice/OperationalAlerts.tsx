import Link from "next/link";
import { AlertTriangle, FileWarning, Hourglass, Clock, Info, ChevronRight } from "lucide-react";
import type { AlertKind, OperationalAlert } from "@/lib/backoffice-types";

/**
 * Alertes opérationnelles (spec §8.4).
 *
 * Cinq natures d'alerte sont prévues par la spec. Comme pour les statuts
 * (§3), chacune porte une **icône et un libellé** en plus de sa couleur :
 * une pastille rouge seule n'apprend rien à qui ne distingue pas le rouge.
 *
 * Le compteur est calculé côté serveur ; la carte ne fait que l'afficher et
 * pointer vers la file filtrée correspondante.
 */
const ALERT_STYLES: Record<
  AlertKind,
  { Icon: typeof AlertTriangle; wrap: string; icon: string }
> = {
  DOSSIER_INCOMPLET: {
    Icon: FileWarning,
    wrap: "border-[#FAC6C6] bg-[#FEF7F7]",
    icon: "bg-[#FDECEC] text-[#B42318]",
  },
  DOCUMENT_A_VERIFIER: {
    Icon: AlertTriangle,
    wrap: "border-[#FDE5C5] bg-[#FFFBF4]",
    icon: "bg-[#FEF7EC] text-[#B86E00]",
  },
  DOSSIER_EN_ATTENTE: {
    Icon: Hourglass,
    wrap: "border-[#E6E9EF] bg-white",
    icon: "bg-[#F0F3F7] text-[#475467]",
  },
  DELAI_OPERATIONNEL: {
    Icon: Clock,
    wrap: "border-[#FDE5C5] bg-[#FFFBF4]",
    icon: "bg-[#FEF7EC] text-[#B86E00]",
  },
  SYSTEME: {
    Icon: Info,
    wrap: "border-[#D5E5F5] bg-[#F7FAFD]",
    icon: "bg-[#EBF3FA] text-[#174A7C]",
  },
};

export function OperationalAlerts({ alerts }: { alerts: OperationalAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-[#C5EBDA] bg-[#F4FBF7] px-4 py-3 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="w-7 h-7 rounded-full bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center shrink-0"
        >
          <Info className="w-3.5 h-3.5" />
        </span>
        <p className="text-xs font-semibold text-[#0D2B4D]">
          Aucune alerte sur le périmètre. Tous les dossiers sont à jour.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {alerts.map((alert) => {
        const { Icon, wrap, icon } = ALERT_STYLES[alert.kind];
        return (
          <li key={alert.id}>
            <Link
              href={alert.href}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors hover:border-[#174A7C] ${wrap}`}
            >
              <span
                aria-hidden="true"
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${icon}`}
              >
                <Icon className="w-4 h-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-[#0D2B4D] truncate">
                  {alert.title}
                </span>
                <span className="block text-[11px] text-[#5B6776] leading-snug">
                  {alert.detail}
                </span>
              </span>

              <span className="flex items-center gap-2 shrink-0">
                <span className="min-w-6 h-6 px-1.5 rounded-full bg-white border border-[#E6E9EF] text-[11px] font-bold text-[#0D2B4D] flex items-center justify-center tabular-nums">
                  {alert.count}
                </span>
                <ChevronRight className="w-4 h-4 text-[#98A2B3]" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default OperationalAlerts;
