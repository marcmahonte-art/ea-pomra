import { FileBarChart2, Download, RefreshCw, Info } from "lucide-react";
import type { BackofficeRole, QuarterlyReport } from "@/lib/backoffice-types";
import { DistributionBars } from "./DistributionBars";

/**
 * Rapport trimestriel (spec §19 pour l'antenne, §20 pour le BEC).
 *
 * Le contenu est calculé côté serveur par `computeQuarterlyReport()`, filtré par
 * le périmètre : un agent d'antenne reçoit le rapport de son pays, le BEC le
 * rapport consolidé. La distinction entre les deux est portée par
 * `report.scopeLabel` et rappelée par un badge, comme l'exige la spec §20.
 *
 * Les actions « Générer » et « Télécharger » sont **désactivées**, et le
 * panneau explique pourquoi. La spec §19 impose que la génération soit réalisée
 * côté serveur ; or la plateforme ne dispose ni de route d'API, ni de service
 * d'authentification, ni de moteur de rendu de document (voir l'audit de la
 * PHASE 1). Un bouton actif qui ne produirait rien serait plus trompeur qu'un
 * bouton désactivé accompagné de sa raison.
 */
export function QuarterlyReportPanel({
  report,
  role,
  canGenerate,
  canExport,
}: {
  report: QuarterlyReport;
  role: BackofficeRole;
  canGenerate: boolean;
  canExport: boolean;
}) {
  const consolidated = role === "BEC";

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 border-b border-[#EDF1F6]">
        <div>
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <FileBarChart2 className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            {consolidated ? "Rapport consolidé BEC" : "Rapport antenne"}
          </h2>
          <p className="text-xs text-[#5B6776] mt-1">
            {report.scopeLabel} · {report.periodLabel} · généré le{" "}
            {report.generatedAtLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[#D5E5F5] bg-[#EBF3FA] px-2.5 py-1 text-[10px] font-bold text-[#174A7C]">
            {consolidated ? "Consolidé — 8 pays" : "Périmètre antenne"}
          </span>

          <button
            type="button"
            disabled={!canGenerate}
            title={
              canGenerate
                ? "Génération serveur non disponible : aucune route d'API n'est encore exposée."
                : "Votre rôle ne dispose pas de la permission de génération."
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E9EF] bg-white px-3 py-2 text-[11px] font-bold text-[#0D2B4D] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#F7F9FB]"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Générer
          </button>

          <button
            type="button"
            disabled={!canExport}
            title={
              canExport
                ? "Export non disponible : aucune route d'API n'est encore exposée."
                : "Votre rôle ne dispose pas de la permission d'export."
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E9EF] bg-white px-3 py-2 text-[11px] font-bold text-[#0D2B4D] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#F7F9FB]"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Télécharger
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {report.lines.map((line) => (
            <div
              key={line.label}
              className="rounded-xl border border-[#E6E9EF] bg-[#FAFCFE] px-4 py-3"
            >
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                {line.label}
              </dt>
              <dd className="mt-1 text-2xl font-extrabold text-[#0D2B4D] tabular-nums">
                {line.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <DistributionBars
            title="Répartition des statuts"
            items={report.statusDistribution}
          />
          <DistributionBars
            title="Répartition des programmes"
            items={report.programDistribution}
          />
          <DistributionBars
            title="Répartition des formations"
            items={report.formationDistribution}
          />
        </div>

        <p className="flex items-start gap-2 rounded-xl border border-[#FDE5C5] bg-[#FFFBF4] px-3 py-2.5 text-[11px] leading-relaxed text-[#B86E00]">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            La génération et l&apos;export côté serveur ne sont pas encore
            raccordés : la plateforme n&apos;expose aucune route d&apos;API ni
            moteur de document. Le contenu affiché provient d&apos;agrégations
            serveur et reste exact.
          </span>
        </p>
      </div>
    </section>
  );
}

export default QuarterlyReportPanel;
