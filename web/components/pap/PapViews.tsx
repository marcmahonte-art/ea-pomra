import Link from "next/link";
import type { PapAlert, PapCaseSummary, PapHistoryEvent, PapIntervention } from "@/lib/pap-types";
import { PapAlertForm, PapAlertStatusForm } from "./PapAlertForms";
import { PapCaseStatusForm, PapInterventionForm, PapInterventionStatusForm } from "./PapForms";

export function PapCaseList({ rows }: { rows: PapCaseSummary[] }) {
  if (!rows.length) return <p className="rounded-2xl border border-[#E6E9EF] bg-white p-6 text-sm text-[#667085]">Aucun dossier PAP affecté.</p>;
  return <div className="grid gap-3">{rows.map((row) => <Link key={row.id} href={`/pap/mentorat/${row.dossierId}`} className="flex items-center justify-between gap-4 rounded-2xl border border-[#E6E9EF] bg-white p-4 shadow-eap-soft hover:border-[#D5E5F5]"><span><span className="block font-mono text-xs font-bold text-[#174A7C]">{row.dossierRef}</span><span className="mt-1 block text-xs text-[#667085]">Initiales autorisées : {row.studentInitials}</span></span><span className="rounded-full bg-[#EBF3FA] px-2.5 py-1 text-[11px] font-bold text-[#174A7C]">{row.status}</span></Link>)}</div>;
}

export function PapAlertList({ rows }: { rows: PapAlert[] }) {
  if (!rows.length) return <p className="rounded-2xl border border-[#E6E9EF] bg-white p-6 text-sm text-[#667085]">Aucune alerte affectée.</p>;
  return <div className="grid gap-3">{rows.map((row) => <article key={row.id} className="rounded-2xl border border-[#E6E9EF] bg-white p-4 shadow-eap-soft"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-[#174A7C]">{row.dossierRef}</p><p className="mt-1 text-sm font-semibold text-[#0D2B4D]">{row.subject}</p><p className="mt-1 text-[11px] text-[#667085]">{row.level} · {row.status} · {row.studentInitials} · {new Date(row.updatedAt).toLocaleDateString("fr-FR")}</p></div><PapAlertStatusForm alert={row} /></div></article>)}</div>;
}

export function PapHistoryTimeline({ rows }: { rows: PapHistoryEvent[] }) {
  if (!rows.length) return <p className="rounded-2xl border border-[#E6E9EF] bg-white p-6 text-sm text-[#667085]">Aucun événement PAP.</p>;
  return <ol className="space-y-3">{rows.map((row) => <li key={row.id} className="rounded-2xl border border-[#E6E9EF] bg-white p-4"><p className="text-xs text-[#667085]">{new Date(row.occurredAt).toLocaleDateString("fr-FR")}</p><p className="mt-1 text-sm font-semibold text-[#0D2B4D]">{row.action}</p><p className="mt-1 text-xs text-[#667085]">{row.dossierRef} · {row.userName}</p></li>)}</ol>;
}

export function PapMentoratDetail({ dossier, interventions, canWrite }: { dossier: PapCaseSummary; interventions: PapIntervention[]; canWrite: boolean }) {
  const writable = canWrite && dossier.status !== "CLOSED";
  return <div className="space-y-6"><section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-xs font-bold text-[#174A7C]">{dossier.dossierRef}</p><h2 className="mt-1 text-lg font-bold text-[#0D2B4D]">Suivi confidentiel</h2><p className="mt-1 text-xs text-[#667085]">Initiales autorisées : {dossier.studentInitials}</p></div>{canWrite && dossier.id !== dossier.dossierId ? <PapCaseStatusForm dossier={dossier} /> : null}</div></section><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><h2 className="text-base font-bold text-[#0D2B4D]">Interventions</h2><div className="mt-4 space-y-3">{interventions.length ? interventions.map((item) => <article key={item.id} className="rounded-xl bg-[#F7F9FB] p-4"><p className="text-xs font-bold text-[#174A7C]">{item.interventionDate} · {item.interventionType} · {item.responsibleName} · {item.status}</p><p className="mt-2 text-sm text-[#1F2937]">Objectif : {item.objective}</p><p className="mt-1 text-sm text-[#1F2937]">Observation : {item.observation}</p>{item.nextAction ? <p className="mt-1 text-xs text-[#667085]">Prochaine action : {item.nextAction}</p> : null}{writable && item.status === "PLANNED" ? <PapInterventionStatusForm intervention={item} /> : null}</article>) : <p className="text-sm text-[#667085]">Aucune intervention enregistrée.</p>}</div></section>{writable ? <div className="space-y-6"><PapInterventionForm dossier={dossier} /><PapAlertForm dossierId={dossier.dossierId} dossierVersion={dossier.dossierVersion} /></div> : null}</div></div>;
}
