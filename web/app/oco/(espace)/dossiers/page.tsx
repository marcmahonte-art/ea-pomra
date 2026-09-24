import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/backoffice/PageHeader";
import { OcoDossierTable } from "@/components/oco/OcoDossierTable";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { listOcoDossiersPage } from "@/lib/server/oco-repository";

export const metadata: Metadata = { title: "Dossiers affectés", description: "Dossiers Explicitement affectés à l’expert OCO." };

type PageProps = { searchParams?: Promise<{ page?: string }> };

export default async function OcoDossiersPage({ searchParams }: PageProps) {
  const scope = await requireBackofficeScope("EXPERT_OCO", "dossiers.read");
  const params = await searchParams;
  const requestedPage = Number(params?.page ?? "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const result = scope.isDemo ? { rows: [], total: 0, page: 1, totalPages: 1 } : await listOcoDossiersPage(scope, page, 50);
  return <div className="space-y-6"><PageHeader title="Dossiers affectés" subtitle="Seuls les dossiers associés à votre identifiant OCO sont visibles." meta={[{ label: "Résultats", value: String(result.total) }]} /><div className="flex flex-wrap gap-2"><a href="/oco/avis" className="rounded-xl bg-[#174A7C] px-4 py-2.5 text-sm font-semibold text-white">File des avis</a><a href="/oco/historique" className="rounded-xl border border-[#D8DEE9] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D2B4D]">Historique</a></div><OcoDossierTable dossiers={result.rows} /><div className="flex items-center justify-between text-xs text-[#667085]"><span>Page {result.page} sur {result.totalPages}</span><div className="flex gap-2"><Link aria-disabled={result.page <= 1} className={`rounded-xl border border-[#D8DEE9] bg-white px-3 py-2 font-semibold ${result.page <= 1 ? "pointer-events-none opacity-50" : "text-[#174A7C]"}`} href={`/oco/dossiers?page=${result.page - 1}`}>Précédent</Link><Link aria-disabled={result.page >= result.totalPages} className={`rounded-xl border border-[#D8DEE9] bg-white px-3 py-2 font-semibold ${result.page >= result.totalPages ? "pointer-events-none opacity-50" : "text-[#174A7C]"}`} href={`/oco/dossiers?page=${result.page + 1}`}>Suivant</Link></div></div></div>;
}
