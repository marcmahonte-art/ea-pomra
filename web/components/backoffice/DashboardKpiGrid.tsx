import {
  Inbox,
  ListChecks,
  Hourglass,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import type { Kpi } from "@/lib/backoffice-types";

/**
 * Grille de KPI (spec §8.2 et §9.2).
 *
 * Chaque carte porte une valeur, un libellé et une période — les trois
 * informations que la spec rend obligatoires. La variation n'est affichée que
 * lorsqu'une comparaison existe réellement : `Kpi.variation` vaut `null` quand
 * la période précédente est vide, et la carte le dit alors explicitement plutôt
 * que d'afficher un « +0 % » qui ferait croire à une stabilité mesurée.
 */
const KPI_STYLES: Record<
  Kpi["id"],
  { Icon: typeof Inbox; tone: string; iconTone: string }
> = {
  received: {
    Icon: Inbox,
    tone: "border-[#D5E5F5]",
    iconTone: "bg-[#EBF3FA] text-[#174A7C]",
  },
  toProcess: {
    Icon: ListChecks,
    tone: "border-[#FDE5C5]",
    iconTone: "bg-[#FEF7EC] text-[#B86E00]",
  },
  pending: {
    Icon: Hourglass,
    tone: "border-[#E6E9EF]",
    iconTone: "bg-[#F0F3F7] text-[#475467]",
  },
  processed: {
    Icon: CheckCircle2,
    tone: "border-[#C5EBDA]",
    iconTone: "bg-[#E8F6EF] text-[#1EA362]",
  },
  toValidate: {
    Icon: ShieldCheck,
    tone: "border-[#F4E4BC]",
    iconTone: "bg-[#FBF6EA] text-[#9A741A]",
  },
  validated: {
    Icon: BadgeCheck,
    tone: "border-[#C5EBDA]",
    iconTone: "bg-[#E8F6EF] text-[#0D2B4D]",
  },
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const { Icon, tone, iconTone } = KPI_STYLES[kpi.id];

  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-eap-soft ${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
          {kpi.label}
        </p>
        <span
          aria-hidden="true"
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconTone}`}
        >
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0D2B4D] tabular-nums">
        {kpi.value}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-[11px] text-[#98A2B3]">{kpi.period}</p>

        {kpi.variation ? (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold ${
              kpi.variation.direction === "up" ? "text-[#1EA362]" : "text-[#B42318]"
            }`}
          >
            {kpi.variation.direction === "up" ? (
              <ArrowUp className="w-3 h-3" aria-hidden="true" />
            ) : (
              <ArrowDown className="w-3 h-3" aria-hidden="true" />
            )}
            {kpi.variation.value} %
            <span className="sr-only">
              {kpi.variation.direction === "up" ? "en hausse" : "en baisse"} par
              rapport à la période précédente
            </span>
            <span aria-hidden="true" className="font-medium text-[#98A2B3]">
              vs préc.
            </span>
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#98A2B3]"
            title="Aucune donnée de comparaison n'est disponible pour cette période."
          >
            <Minus className="w-3 h-3" aria-hidden="true" />
            Sans comparaison
          </span>
        )}
      </div>
    </article>
  );
}

export function DashboardKpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

/**
 * Grille de statistiques BEC (spec §21).
 *
 * Même rendu que la grille de tableau de bord : les indicateurs consolidés se
 * lisent exactement comme les indicateurs d'antenne, et dupliquer le composant
 * aurait fait diverger deux mises en page identiques.
 */
export function StatisticsKpiGrid({ kpis }: { kpis: Kpi[] }) {
  return <DashboardKpiGrid kpis={kpis} />;
}

export default DashboardKpiGrid;
