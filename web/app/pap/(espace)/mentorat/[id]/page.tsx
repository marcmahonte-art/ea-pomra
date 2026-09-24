import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { PapMentoratDetail } from "@/components/pap/PapViews";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getPapMentorat } from "@/lib/server/pap-repository";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scope = await requireBackofficeScope("RESPONSABLE_PAP", "pap.mentorat.read");
  const result = scope.isDemo ? null : await getPapMentorat(scope, id);
  return { title: result ? `${result.dossier.dossierRef} — mentorat` : "Suivi PAP" };
}

export default async function PapMentoratDetailPage({ params }: PageProps) {
  const { id } = await params;
  const scope = await requireBackofficeScope("RESPONSABLE_PAP", "pap.mentorat.read");
  const result = scope.isDemo ? null : await getPapMentorat(scope, id);
  if (!result) notFound();
  return <div className="space-y-6"><PageHeader title="Fiche de suivi" subtitle="Accès confidentiel limité au responsable PAP affecté." /><PapMentoratDetail dossier={result.dossier} interventions={result.interventions} canWrite={scope.permissions.includes("pap.mentorat.write") && !scope.isDemo} /></div>;
}
