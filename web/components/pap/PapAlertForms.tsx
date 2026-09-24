"use client";

import { useActionState } from "react";
import { createPapAlertAction, updatePapAlertAction, type PapActionState } from "@/app/pap/actions";
import type { PapAlert } from "@/lib/pap-types";

export function PapAlertForm({ dossierId, dossierVersion }: { dossierId: string; dossierVersion: number }) {
  const [state, action, pending] = useActionState<PapActionState, FormData>(createPapAlertAction, { status: "idle" });
  return <form action={action} className="space-y-3 rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><h2 className="text-base font-bold text-[#0D2B4D]">Créer une alerte</h2><input type="hidden" name="dossierId" value={dossierId} /><input type="hidden" name="dossierVersion" value={dossierVersion} /><label className="block text-xs font-bold text-[#0D2B4D]">Niveau<select name="level" className="mt-1 w-full rounded-xl border border-[#D8DEE9] bg-white px-3 py-2.5 text-sm"><option value="INFO">Info</option><option value="ATTENTION">Attention</option><option value="URGENT">Urgent</option></select></label><label className="block text-xs font-bold text-[#0D2B4D]">Sujet<input name="subject" maxLength={200} required className="mt-1 w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm" /></label><button disabled={pending} className="rounded-xl bg-[#174A7C] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Création…" : "Créer l’alerte"}</button>{state.status !== "idle" ? <p role="status" className={state.status === "error" ? "text-xs font-semibold text-[#B42318]" : "text-xs font-semibold text-[#1EA362]"}>{state.message}</p> : null}</form>;
}

export function PapAlertStatusForm({ alert }: { alert: PapAlert }) {
  const [state, action, pending] = useActionState<PapActionState, FormData>(updatePapAlertAction, { status: "idle" });
  const next = alert.status === "OPEN" ? "ACKNOWLEDGED" : alert.status === "ACKNOWLEDGED" ? "CLOSED" : "OPEN";
  return <form action={action}><input type="hidden" name="alertId" value={alert.id} /><input type="hidden" name="version" value={alert.version} /><input type="hidden" name="status" value={next} /><button disabled={pending} className="text-xs font-semibold text-[#174A7C] disabled:opacity-50">{pending ? "…" : next === "ACKNOWLEDGED" ? "Prendre en compte" : next === "CLOSED" ? "Clôturer" : "Rouvrir"}</button>{state.status !== "idle" ? <span className="ml-2 text-[11px] text-[#667085]">{state.message}</span> : null}</form>;
}
