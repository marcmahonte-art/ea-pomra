"use client";

import { useSearchParams } from "next/navigation";
import { useFilterNavigation } from "./use-filter-navigation";

/**
 * Sélecteurs Année / Trimestre des rapports (spec §19).
 *
 * Les valeurs vivent dans l'URL, comme les filtres de dossiers : le rapport
 * trimestriel se partage donc par lien, et un rechargement redonne la même
 * période. Le calcul reste côté serveur — le composant ne fait que nommer la
 * période demandée.
 */
export function ReportPeriodSelector({
  years,
  defaultYear,
  defaultQuarter,
}: {
  years: number[];
  defaultYear: number;
  defaultQuarter: number;
}) {
  const searchParams = useSearchParams();
  const { setParam } = useFilterNavigation();

  const year = searchParams.get("year") ?? String(defaultYear);
  const quarter = searchParams.get("quarter") ?? String(defaultQuarter);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="report-year"
          className="text-[10px] font-bold uppercase tracking-wider text-[#667085]"
        >
          Année
        </label>
        <select
          id="report-year"
          value={year}
          onChange={(event) => setParam("year", event.target.value)}
          className="h-10 min-w-[110px] rounded-xl border border-[#E6E9EF] bg-white px-3 text-xs font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
        >
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="report-quarter"
          className="text-[10px] font-bold uppercase tracking-wider text-[#667085]"
        >
          Trimestre
        </label>
        <select
          id="report-quarter"
          value={quarter}
          onChange={(event) => setParam("quarter", event.target.value)}
          className="h-10 min-w-[140px] rounded-xl border border-[#E6E9EF] bg-white px-3 text-xs font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
        >
          {[1, 2, 3, 4].map((item) => (
            <option key={item} value={item}>
              {item}
              <sup>e</sup> trimestre
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ReportPeriodSelector;
