import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityLog } from "@/components/backoffice/ActivityLog";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { OcoDocumentList } from "@/components/oco/OcoDocumentList";
import { OcoReviewForm } from "@/components/oco/OcoReviewForm";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getOcoDossier, getOcoHistory } from "@/lib/server/oco-repository";
import { STATE_LABELS, type ActivityEvent } from "@/lib/backoffice-types";

type PageProps = { params: Promise<{ id: string }> };

function dateLabel(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scope = await requireBackofficeScope("EXPERT_OCO", "oco.read");
  const dossier = await getOcoDossier(scope, id);
  return { title: dossier ? `${dossier.reference} — avis OCO` : "Dossier OCO" };
}

export default async function OcoDossierDetailPage({ params }: PageProps) {
  const { id } = await params;
  const scope = await requireBackofficeScope("EXPERT_OCO", "oco.read");
  const dossier = await getOcoDossier(scope, id);
  if (!dossier) notFound();
  const history = await getOcoHistory(scope);
  const dossierHistory = history.filter((event) => event.dossierId === dossier.id);
  const events: ActivityEvent[] = dossierHistory.map((row) => ({ id: row.id, dossierId: row.dossierId, at: row.occurredAt instanceof Date ? row.occurredAt.toISOString() : new Date(row.occurredAt).toISOString(), atLabel: dateLabel(row.occurredAt), dossierRef: row.reference, studentName: row.studentName, action: row.action, fromState: row.fromState, toState: row.toState, user: row.userName, userRole: row.userRole, comment: row.comment }));
  return <div className="space-y-6"><PageHeader title={dossier.reference} subtitle={`${dossier.studentName} · ${dossier.formation}`} meta={[{ label: "État", value: STATE_LABELS[dossier.state] }, { label: "Pays", value: `${dossier.flag} ${dossier.country}` }, { label: "Priorité", value: dossier.priority }]} /><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><h2 className="text-base font-bold text-[#0D2B4D]">Résumé du dossier</h2><dl className="mt-4 grid grid-cols-2 gap-4 text-sm">{[["Programme", dossier.program], ["Formation", dossier.formation], ["Pays", dossier.country], ["Antenne", dossier.antennaCity], ["Complétude", `${dossier.completeness}%`], ["Reçu le", dossier.createdAtLabel]].map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">{label}</dt><dd className="mt-1 font-semibold text-[#0D2B4D]">{value}</dd></div>)}</dl></section><OcoDocumentList dossier={dossier} /></div><OcoReviewForm dossier={dossier} review={dossier.review} canWrite={scope.permissions.includes("oco.reviews.write")} canFinalize={scope.permissions.includes("oco.reviews.finalize")} isDemo={scope.isDemo} /><section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><h2 className="text-base font-bold text-[#0D2B4D]">Historique du dossier</h2><div className="mt-3"><ActivityLog events={events} role="EXPERT_OCO" variant="full" /></div></section></div>;
}
