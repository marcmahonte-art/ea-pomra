import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FileText } from "lucide-react";
import type { OcoDossier } from "@/lib/backoffice-types";

function stateLabel(dossier: OcoDossier): string {
  if (dossier.review?.status === "FINALIZED") return "Traité";
  if (dossier.review?.status === "DRAFT") return "Brouillon";
  return dossier.state === "TRANSMIS_OCO" ? "À examiner" : dossier.state;
}

export function OcoDossierTable({ dossiers }: { dossiers: OcoDossier[] }) {
  if (dossiers.length === 0) return <div className="rounded-2xl border border-[#E6E9EF] bg-white p-8 text-center text-sm text-[#667085]">Aucun dossier affecté.</div>;
  return <div className="overflow-x-auto rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#FAFCFE] border-b border-[#E6E9EF]"><tr>{["Dossier", "Étudiant", "Formation", "État", "Priorité", "Action"].map((label) => <th key={label} scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#667085]">{label}</th>)}</tr></thead><tbody className="divide-y divide-[#EDF1F6]">{dossiers.map((dossier) => <tr key={dossier.id} className="hover:bg-[#FAFCFE]"><td className="px-4 py-4 font-mono text-xs font-bold text-[#174A7C]">{dossier.reference}</td><td className="px-4 py-4 text-sm font-semibold text-[#0D2B4D]">{dossier.studentName}</td><td className="px-4 py-4 text-xs text-[#5B6776]">{dossier.formation}</td><td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D2B4D]">{dossier.review?.status === "FINALIZED" ? <CheckCircle2 className="h-3.5 w-3.5 text-[#1EA362]" /> : <Clock3 className="h-3.5 w-3.5 text-[#F59E0B]" />}{stateLabel(dossier)}</span></td><td className="px-4 py-4 text-xs text-[#5B6776]">{dossier.priority}</td><td className="px-4 py-4"><Link href={`/oco/dossiers/${dossier.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A7C] hover:underline">Ouvrir <ArrowRight className="h-3.5 w-3.5" /></Link></td></tr>)}</tbody></table></div>;
}

export function OcoKpiGrid({ values }: { values: { assigned: number; drafts: number; toFinalize: number; processed: number } }) {
  const items = [{ label: "Dossiers à examiner", value: values.assigned }, { label: "Avis en brouillon", value: values.drafts }, { label: "Avis à finaliser", value: values.toFinalize }, { label: "Dossiers traités", value: values.processed }];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => <div key={item.label} className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-[#667085]">{item.label}</span><FileText className="h-4 w-4 text-[#174A7C]" /></div><p className="mt-3 text-3xl font-extrabold text-[#0D2B4D]">{item.value}</p></div>)}</div>;
}
