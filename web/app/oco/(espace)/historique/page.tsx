import type { Metadata } from "next";
import { ActivityLog } from "@/components/backoffice/ActivityLog";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getOcoHistory } from "@/lib/server/oco-repository";
import type { ActivityEvent } from "@/lib/backoffice-types";

export const metadata: Metadata = { title: "Historique", description: "Historique des avis et événements OCO." };

function dateLabel(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

export default async function OcoHistoryPage() {
  const scope = await requireBackofficeScope("EXPERT_OCO", "history.read");
  const rows = scope.isDemo ? [] : await getOcoHistory(scope);
  const events: ActivityEvent[] = rows.map((row) => ({ id: row.id, dossierId: row.dossierId, at: row.occurredAt instanceof Date ? row.occurredAt.toISOString() : new Date(row.occurredAt).toISOString(), atLabel: dateLabel(row.occurredAt), dossierRef: row.reference, studentName: row.studentName, action: row.action, fromState: row.fromState, toState: row.toState, user: row.userName, userRole: row.userRole, comment: row.comment }));
  return <div className="space-y-6"><PageHeader title="Historique" subtitle="Événements OCO des dossiers affectés." meta={[{ label: "Événements", value: String(events.length) }]} /><section className="overflow-hidden rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft"><ActivityLog events={events} role="EXPERT_OCO" variant="full" /></section></div>;
}
