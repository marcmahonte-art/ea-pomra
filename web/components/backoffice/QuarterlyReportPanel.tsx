"use client";

import { useActionState } from "react";
import { Download, RefreshCw } from "lucide-react";
import type { BackofficeRole, QuarterlyReport } from "@/lib/backoffice-types";
import { DistributionBars } from "./DistributionBars";
import { generateReport, type MutationState } from "@/app/backoffice/actions";

export function QuarterlyReportPanel({
  report,
  role,
  canGenerate,
  canExport,
  year,
  quarter,
  latestReportId,
  filters
}: {
  report: QuarterlyReport;
  role: BackofficeRole;
  canGenerate: boolean;
  canExport: boolean;
  year: number;
  quarter: number;
  latestReportId: string | null;
  filters: { country: string; program: string; formation: string };
}) {
  const [state, formAction, pending] = useActionState<MutationState, FormData>(generateReport, { status: "idle" });
  const downloadId = state.status === "success" ? state.reportId ?? latestReportId : latestReportId;
  const consolidated = role === "BEC";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EDF1F6] px-5 py-5">
        <div>
          <h2 className="text-base font-bold text-[#0D2B4D]">
            {consolidated ? "Rapport consolidé BEC" : "Rapport antenne"}
          </h2>
          <p className="mt-1 text-xs text-[#5B6776]">{report.scopeLabel} · {report.periodLabel} · calculé le {report.generatedAtLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="year" value={year} />
            <input type="hidden" name="quarter" value={quarter} />
            <input type="hidden" name="country" value={filters.country} />
            <input type="hidden" name="program" value={filters.program} />
            <input type="hidden" name="formation" value={filters.formation} />
            <button type="submit" disabled={!canGenerate || pending} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E9EF] bg-white px-3 py-2 text-[11px] font-bold text-[#0D2B4D] disabled:opacity-50">
              <RefreshCw className="w-3.5 h-3.5" />
              {pending ? "Génération…" : "Générer"}
            </button>
          </form>
          {canExport && downloadId ? (
            <a href={`/backoffice/reports/${downloadId}/csv?role=${role}`} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E9EF] bg-white px-3 py-2 text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB]">
              <Download className="w-3.5 h-3.5" />
              Télécharger CSV
            </a>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 p-5">
        {state.status !== "idle" ? (
          <p className={state.status === "error" ? "rounded-xl border border-[#FAC6C6] bg-[#FDECEC] px-3 py-2 text-xs text-[#B42318]" : "rounded-xl border border-[#C5EBDA] bg-[#E8F6EF] px-3 py-2 text-xs text-[#1EA362]"}>
            {state.message}
          </p>
        ) : null}
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {report.lines.map((line) => (
            <div key={line.label} className="rounded-xl border border-[#E6E9EF] bg-[#FAFCFE] px-4 py-3">
              <dt className="text-[10px] font-bold uppercase text-[#667085]">{line.label}</dt>
              <dd className="mt-1 text-2xl font-extrabold tabular-nums text-[#0D2B4D]">{line.value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <DistributionBars title="Répartition des statuts" items={report.statusDistribution} />
          <DistributionBars title="Répartition des programmes" items={report.programDistribution} />
          <DistributionBars title="Répartition des formations" items={report.formationDistribution} />
        </div>
      </div>
    </section>
  );
}

export default QuarterlyReportPanel;
