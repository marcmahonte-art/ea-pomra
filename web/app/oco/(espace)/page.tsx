import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { OcoDossierTable, OcoKpiGrid } from "@/components/oco/OcoDossierTable";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getOcoDashboard, listOcoDossiers } from "@/lib/server/oco-repository";

export const metadata: Metadata = { title: "Tableau de bord", description: "File OCO des dossiers affectés." };

export default async function OcoDashboardPage() {
  const scope = await requireBackofficeScope("EXPERT_OCO", "oco.read");
  const [dashboard, dossiers] = scope.isDemo ? [{ assigned: 0, drafts: 0, toFinalize: 0, processed: 0 }, []] : [await getOcoDashboard(scope), await listOcoDossiers(scope, 8)];
  return <div className="space-y-6"><PageHeader title="Tableau de bord" subtitle="Traitement des dossiers affectés à votre file OCO." meta={[{ label: "Périmètre", value: "Affectations individuelles" }, { label: "File", value: String(dashboard.assigned) }]} /><OcoKpiGrid values={dashboard} /><section><div className="mb-3 flex items-center justify-between"><h2 className="text-base font-bold text-[#0D2B4D]">Dossiers prioritaires</h2><Link href="/oco/dossiers" className="text-xs font-bold text-[#174A7C] hover:underline">Voir la file</Link></div><OcoDossierTable dossiers={dossiers} /></section></div>;
}
