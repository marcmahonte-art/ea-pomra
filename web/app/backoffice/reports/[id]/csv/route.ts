import { z } from "zod";
import { getAuthenticatedScope } from "@/lib/backoffice-session";
import { getReportForDownload, logReportDownload } from "@/lib/server/backoffice-repository";
import { STATE_LABELS } from "@/lib/backoffice-types";

export function csvCell(value: string | number): string {
  const text = String(value);
  const safe = /^(?:\s*[=+\-@]|\t|\r|\n)/.test(text) ? `'${text}` : text;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const role = z.enum(["ANTENNE", "BEC"]).safeParse(new URL(request.url).searchParams.get("role"));
  if (!role.success) return new Response("Non autorisé", { status: 403 });
  const scope = await getAuthenticatedScope(role.data);
  if (scope.isDemo || !scope.permissions.includes("exports.run") || !scope.permissions.includes("reports.read")) {
    return new Response("Non autorisé", { status: 403 });
  }
  const { id } = await context.params;
  const reportId = z.string().uuid().safeParse(id);
  if (!reportId.success) return new Response("Introuvable", { status: 404 });
  const report = await getReportForDownload(scope, reportId.data);
  if (!report) return new Response("Introuvable", { status: 404 });
  const header = ["Référence", "Étudiant", "Pays", "Programme", "Formation", "État", "Complétude (%)"];
  const lines = report.snapshot.rows.map((row) => [
    row.reference,
    row.studentName,
    row.country,
    row.program,
    row.formation,
    STATE_LABELS[row.state],
    row.completeness
  ]);
  const csv = `\uFEFF${[header, ...lines].map((line) => line.map(csvCell).join(",")).join("\r\n")}`;
  await logReportDownload(scope, reportId.data);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rapport-${report.snapshot.report.year}-T${report.snapshot.report.quarter}.csv"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
