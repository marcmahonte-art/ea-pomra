"use client";

import { useActionState } from "react";
import { createPapInterventionAction, updatePapCaseStatusAction, updatePapInterventionStatusAction, type PapActionState } from "@/app/pap/actions";
import type { PapCaseSummary, PapIntervention } from "@/lib/pap-types";

export function PapInterventionForm({ dossier }: { dossier: PapCaseSummary }) {
  const [state, action, pending] = useActionState<PapActionState, FormData>(createPapInterventionAction, { status: "idle" });
  return <form action={action} className="space-y-3 rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><h2 className="text-base font-bold text-[#0D2B4D]">Créer une intervention</h2><input type="hidden" name="dossierId" value={dossier.dossierId} /><input type="hidden" name="dossierVersion" value={dossier.dossierVersion} /><label className="block text-xs font-bold text-[#0D2B4D]">Date<input type="date" name="interventionDate" required className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm" /></label><label className="block text-xs font-bold text-[#0D2B4D]">Type<input name="interventionType" maxLength={100} required className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm" /></label><label className="block text-xs font-bold text-[#0D2B4D]">Objectif<textarea name="objective" maxLength={2000} required className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm" /></label><label className="block text-xs font-bold text-[#0D2B4D]">Observation<textarea name="observation" maxLength={4000} required className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm" /></label><label className="block text-xs font-bold text-[#0D2B4D]">Prochaine action<textarea name="nextAction" maxLength={2000} className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm" /></label><button disabled={pending} className="rounded-xl bg-[#174A7C] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Enregistrement…" : "Enregistrer"}</button>{state.status !== "idle" ? <p role="status" className={state.status === "error" ? "text-xs font-semibold text-[#B42318]" : "text-xs font-semibold text-[#1EA362]"}>{state.message}</p> : null}</form>;
}

export function PapInterventionStatusForm({ intervention }: { intervention: PapIntervention }) {
  const [state, action, pending] = useActionState<PapActionState, FormData>(updatePapInterventionStatusAction, { status: "idle" });
  return <form action={action} className="mt-3 flex items-center gap-2"><input type="hidden" name="interventionId" value={intervention.id} /><input type="hidden" name="version" value={intervention.version} /><select name="status" defaultValue="DONE" className="rounded-lg border border-[#D8DEE9] bg-white px-2 py-1 text-xs"><option value="DONE">Marquer terminée</option><option value="CANCELLED">Annuler</option></select><button disabled={pending || intervention.status !== "PLANNED"} className="rounded-lg bg-[#174A7C] px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50">{pending ? "…" : "Mettre à jour"}</button>{state.status !== "idle" ? <span className="text-[11px] text-[#667085]">{state.message}</span> : null}</form>;
}

export function PapCaseStatusForm({ dossier }: { dossier: PapCaseSummary }) {
  const [state, action, pending] = useActionState<PapActionState, FormData>(updatePapCaseStatusAction, { status: "idle" });
  const next = dossier.status === "OPEN" ? "IN_PROGRESS" : dossier.status === "IN_PROGRESS" ? "CLOSED" : "OPEN";
  return <form action={action}><input type="hidden" name="caseId" value={dossier.id} /><input type="hidden" name="version" value={dossier.version} /><input type="hidden" name="status" value={next} /><button disabled={pending} className="rounded-xl border border-[#D8DEE9] px-3 py-2 text-xs font-semibold text-[#0D2B4D] disabled:opacity-50">{pending ? "…" : next === "IN_PROGRESS" ? "Démarrer le suivi" : next === "CLOSED" ? "Clôturer" : "Rouvrir"}</button>{state.status !== "idle" ? <span className="ml-2 text-[11px] text-[#667085]">{state.message}</span> : null}</form>;
}
