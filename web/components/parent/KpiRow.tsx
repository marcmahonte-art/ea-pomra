import { Compass, GraduationCap, ArrowLeftRight, FileText } from "lucide-react";
import type { KpiItem } from "@/lib/parent-types";

/**
 * Icône associée à chaque indicateur.
 *
 * La correspondance vit ici et non dans les données : `lib/parent-data.ts` n'a
 * pas à connaître lucide-react, et une icône ne fait pas partie du modèle
 * métier — elle changerait au gré du design sans que la donnée change.
 */
const KPI_ICONS = {
  parcours: Compass,
  scolarite: GraduationCap,
  finances: ArrowLeftRight,
  documents: FileText,
} as const;

const KPI_TONES: Record<KpiItem["tone"], string> = {
  blue: "bg-[#EBF3FA] text-[#3B82F6] border-[#D5E5F5]",
  green: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
  gold: "bg-[#FBF6EA] text-[#C89C2E] border-[#F4E4BC]",
  warning: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
};

export function KpiRow({ kpis }: { kpis: KpiItem[] }) {
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id];
        return (
          <li
            key={kpi.id}
            className="bg-white rounded-2xl border border-[#E6E9EF] shadow-eap-soft p-4 flex items-start gap-3"
          >
            <span
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${KPI_TONES[kpi.tone]}`}
            >
              <Icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8E9BAA]">
                {kpi.label}
              </p>
              <p className="text-lg font-black text-[#0D2B4D] leading-tight mt-0.5">
                {kpi.value}
              </p>
              <p className="text-[11px] text-[#5B6776] leading-snug mt-0.5">
                {kpi.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default KpiRow;
