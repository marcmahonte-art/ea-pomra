import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { PapCaseList } from "@/components/pap/PapViews";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { listPapCases } from "@/lib/server/pap-repository";

export const metadata: Metadata = { title: "Mentorat", description: "Suivis PAP affectés au responsable." };

type PageProps = { searchParams?: Promise<{ page?: string }> };

export default async function PapMentoratPage({ searchParams }: PageProps) {
  const scope = await requireBackofficeScope("RESPONSABLE_PAP", "pap.mentorat.read");
  const params = await searchParams;
  const requested = Number(params?.page ?? "1");
  const result = scope.isDemo ? { rows: [], total: 0, page: 1, totalPages: 1 } : await listPapCases(scope, Number.isSafeInteger(requested) && requested > 0 ? requested : 1, 50);
  return <div className="space-y-6"><PageHeader title="Mentorat" subtitle="Seuls les identifiants et suivis PAP autorisés sont visibles." meta={[{ label: "Suivis", value: String(result.total) }]} /><PapCaseList rows={result.rows} /><div className="flex justify-between text-xs text-[#667085]"><span>Page {result.page} sur {result.totalPages}</span><div className="flex gap-2"><Link aria-disabled={result.page <= 1} className={`rounded-xl border border-[#D8DEE9] bg-white px-3 py-2 ${result.page <= 1 ? "pointer-events-none opacity-50" : ""}`} href={`/pap/mentorat?page=${result.page - 1}`}>Précédent</Link><Link aria-disabled={result.page >= result.totalPages} className={`rounded-xl border border-[#D8DEE9] bg-white px-3 py-2 ${result.page >= result.totalPages ? "pointer-events-none opacity-50" : ""}`} href={`/pap/mentorat?page=${result.page + 1}`}>Suivant</Link></div></div></div>;
}
