import Link from "next/link";
import { FileBarChart2, Download, RefreshCw, BellRing, Activity } from "lucide-react";
import type {
  ActivityEvent,
  Dossier,
  Kpi,
  OperationalAlert,
  Permission,
  QuarterlyReport,
} from "@/lib/backoffice-types";
import { DashboardKpiGrid } from "./DashboardKpiGrid";
import { OperationalQueue } from "./OperationalQueue";
import { OperationalAlerts } from "./OperationalAlerts";
import { ActivityLog } from "./ActivityLog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Tableau de bord de l'antenne (spec §8).
 *
 * Compose les six blocs exigés : en-tête (rendu par la page), indicateurs, file
 * opérationnelle, alertes, activité récente et accès au rapport trimestriel.
 *
 * Composant serveur : il ne fait que disposer des données déjà calculées et
 * déjà filtrées par le périmètre. Aucun total n'est recalculé ici.
 */
export function AntenneDashboard({
  kpis,
  alerts,
  queue,
  activity,
  report,
  permissions,
  canExport,
}: {
  kpis: Kpi[];
  alerts: OperationalAlert[];
  queue: Dossier[];
  activity: ActivityEvent[];
  report: QuarterlyReport;
  permissions: Permission[];
  canExport: boolean;
}) {
  const canGenerate = permissions.includes("reports.generate");

  return (
    <div className="space-y-6">
      <DashboardKpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <OperationalQueue dossiers={queue} role="ANTENNE" max={5} />
        </div>

        <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
          <SectionHeading
            title="Alertes"
            description="Points de vigilance du périmètre."
          />
          <div className="mt-4">
            <OperationalAlerts alerts={alerts} />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
          <SectionHeading
            title="Activité récente"
            description="Dernières actions enregistrées sur le périmètre."
            action={
              <Link
                href="/antenne/historique"
                className="text-xs font-bold text-[#174A7C] hover:underline whitespace-nowrap"
              >
                Tout l&apos;historique →
              </Link>
            }
          />
          <div className="mt-2">
            {activity.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="Aucune activité enregistrée"
                description="Les actions réalisées sur les dossiers du périmètre apparaîtront ici."
              />
            ) : (
              <ActivityLog events={activity} role="ANTENNE" variant="compact" max={6} />
            )}
          </div>
        </section>

        {/* Rapport trimestriel (spec §8.6) */}
        <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <FileBarChart2 className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            Rapport trimestriel
          </h2>
          <p className="text-xs text-[#5B6776] mt-1">{report.periodLabel}</p>

          <dl className="mt-4 space-y-2">
            {report.lines.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-3 rounded-xl bg-[#FAFCFE] border border-[#E6E9EF] px-3 py-2"
              >
                <dt className="text-[11px] text-[#5B6776]">{line.label}</dt>
                <dd className="text-sm font-extrabold text-[#0D2B4D] tabular-nums">
                  {line.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/antenne/rapports"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#174A7C] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#0D2B4D]"
            >
              Voir
            </Link>

            <button
              type="button"
              disabled={!canGenerate}
              title={
                canGenerate
                  ? "Génération serveur non disponible : aucune route d'API n'est encore exposée."
                  : "Votre rôle ne dispose pas de la permission de génération."
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E9EF] bg-white px-3 py-2 text-[11px] font-bold text-[#0D2B4D] disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E9EF] bg-white px-3 py-2 text-[11px] font-bold text-[#0D2B4D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Télécharger
            </button>
          </div>

          <p className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-[#98A2B3]">
            <BellRing className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Les boutons dépendent de vos permissions. Leur raccordement
              serveur reste à faire.
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default AntenneDashboard;
