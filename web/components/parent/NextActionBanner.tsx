import Link from "next/link";
import { AlertCircle, Info } from "lucide-react";
import type { NextAction } from "@/lib/parent-types";

const SEVERITIES = {
  info: {
    wrapper: "bg-[#EBF3FA] border-[#D5E5F5]",
    icon: "text-[#174A7C]",
    Icon: Info,
  },
  warning: {
    wrapper: "bg-[#FEF7EC] border-[#FDE5C5]",
    icon: "text-[#B86E00]",
    Icon: AlertCircle,
  },
} as const;

/**
 * Bandeau « prochaine action attendue ».
 *
 * Ne s'affiche que si les données portent une action : le composant ne décide
 * jamais qu'une action est due, sans quoi l'interface finirait par inventer des
 * échéances. `nextAction === null` ⇒ rien n'est rendu.
 */
export function NextActionBanner({ action }: { action: NextAction | null }) {
  if (!action) return null;

  const { wrapper, icon, Icon } = SEVERITIES[action.severity];

  return (
    <section
      className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${wrapper}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${icon}`} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0D2B4D]">{action.title}</p>
          <p className="text-xs text-[#5B6776] leading-relaxed mt-1">
            {action.description}
          </p>
          {action.dueDate ? (
            <p className="text-[11px] font-semibold text-[#0D2B4D] mt-1.5">
              Échéance : {action.dueDate}
            </p>
          ) : null}
        </div>
      </div>

      <Link
        href={action.href}
        className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-xs font-bold transition-colors"
      >
        {action.ctaLabel}
      </Link>
    </section>
  );
}

export default NextActionBanner;
