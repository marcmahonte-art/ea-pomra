import type { Metadata } from "next";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { OcoDossierTable } from "@/components/oco/OcoDossierTable";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { listOcoDossiers } from "@/lib/server/oco-repository";

export const metadata: Metadata = { title: "Avis OCO", description: "Avis OCO en brouillon et finalisés pour les dossiers affectés." };

export default async function OcoAvisPage() {
  const scope = await requireBackofficeScope("EXPERT_OCO", "oco.reviews.read");
  const dossiers = scope.isDemo ? [] : await listOcoDossiers(scope);
  const avis = dossiers.filter((dossier) => dossier.review !== null || dossier.state === "TRANSMIS_OCO");
  return <div className="space-y-6"><PageHeader title="File des avis" subtitle="Rédigez, finalisez et consultez les avis de vos dossiers affectés." meta={[{ label: "Avis", value: String(avis.length) }]} /><OcoDossierTable dossiers={avis} /></div>;
}
