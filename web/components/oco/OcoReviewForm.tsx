"use client";

import { useActionState, useState } from "react";
import { Save, Send } from "lucide-react";
import type { OcoDossier, OcoReview } from "@/lib/backoffice-types";
import { saveOcoReviewAction, type OcoActionState } from "@/app/oco/actions";
import { OCO_FINALIZATION_CONFIRMATION } from "@/lib/server/validation";

export function OcoReviewForm({
  dossier,
  review,
  canWrite,
  canFinalize,
  isDemo
}: {
  dossier: OcoDossier;
  review: OcoReview | null;
  canWrite: boolean;
  canFinalize: boolean;
  isDemo: boolean;
}) {
  const [state, formAction, pending] = useActionState<OcoActionState, FormData>(saveOcoReviewAction, { status: "idle" });
  const [finalizePreview, setFinalizePreview] = useState(false);
  const [finalizeSummary, setFinalizeSummary] = useState({
    verdict: review?.verdict ?? "",
    orientation: review?.orientation ?? "",
    reserves: review?.reserves ?? ""
  });
  const isFinalized = review?.status === "FINALIZED";
  const version = review?.version ?? dossier.version;
  const writable = canWrite && !isDemo && !isFinalized;
  const finalizable = canFinalize && !isDemo && !isFinalized && dossier.state === "TRANSMIS_OCO";

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0D2B4D]">Analyse et avis OCO</h2>
          <p className="mt-1 text-xs text-[#5B6776]">Rédigez le brouillon avant de transmettre définitivement l’avis.</p>
        </div>
        {isFinalized ? <span className="rounded-full bg-[#E8F6EF] px-2.5 py-1 text-[11px] font-bold text-[#1EA362]">Avis finalisé</span> : null}
      </div>
      {writable || finalizable ? (
        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="dossierId" value={dossier.id} />
          <input type="hidden" name="version" value={version} />
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0D2B4D]">Avis</span>
            <select name="verdict" defaultValue={review?.verdict ?? ""} disabled={!writable} className="w-full rounded-xl border border-[#D8DEE9] bg-white px-3 py-2.5 text-sm text-[#1F2937] disabled:bg-[#F7F9FB]">
              <option value="">Sélectionner</option>
              <option value="FAVORABLE">Favorable</option>
              <option value="SOUS_RESERVE">Sous réserve</option>
              <option value="DEFAVORABLE">Défavorable</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0D2B4D]">Analyse technique</span>
            <textarea name="analysis" defaultValue={review?.analysis ?? ""} disabled={!writable} rows={5} maxLength={10000} className="w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm text-[#1F2937] disabled:bg-[#F7F9FB]" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0D2B4D]">Orientation suggérée</span>
            <input name="orientation" defaultValue={review?.orientation ?? ""} disabled={!writable} maxLength={200} className="w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm text-[#1F2937] disabled:bg-[#F7F9FB]" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0D2B4D]">Observations</span>
            <textarea name="observations" defaultValue={review?.observations ?? ""} disabled={!writable} rows={4} maxLength={10000} className="w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm text-[#1F2937] disabled:bg-[#F7F9FB]" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#0D2B4D]">Réserves</span>
            <textarea name="reserves" defaultValue={review?.reserves ?? ""} disabled={!writable} rows={3} maxLength={10000} className="w-full rounded-xl border border-[#D8DEE9] px-3 py-2.5 text-sm text-[#1F2937] disabled:bg-[#F7F9FB]" />
          </label>
           {finalizePreview && finalizable ? (
             <div className="rounded-xl border border-[#F4B183] bg-[#FFF8F0] p-4 text-sm text-[#7C2D12]" role="alert">
               <p className="font-bold">Confirmer la finalisation irréversible</p>
               <dl className="mt-3 grid gap-2 text-xs">
                 <div><dt className="font-bold">Verdict :</dt><dd>{finalizeSummary.verdict || "À sélectionner"}</dd></div>
                 <div><dt className="font-bold">Orientation :</dt><dd>{finalizeSummary.orientation || "À renseigner"}</dd></div>
                 <div><dt className="font-bold">Réserves :</dt><dd>{finalizeSummary.reserves || "Aucune"}</dd></div>
               </dl>
               <p className="mt-3 text-xs">Après finalisation, cet avis sera immuable et ne pourra plus être modifié.</p>
               <input type="hidden" name="confirmation" value={OCO_FINALIZATION_CONFIRMATION} />
               <div className="mt-3 flex flex-wrap gap-2">
                 <button type="submit" name="finalize" value="true" disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[#1EA362] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" />{pending ? "Transmission…" : "Confirmer la finalisation"}</button>
                 <button type="button" onClick={() => setFinalizePreview(false)} disabled={pending} className="rounded-xl border border-[#D8DEE9] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D2B4D] disabled:opacity-50">Annuler</button>
               </div>
             </div>
           ) : (
             <div className="flex flex-wrap gap-2">
               {writable ? <button type="submit" name="finalize" value="false" disabled={pending} className="inline-flex items-center gap-2 rounded-xl border border-[#D8DEE9] px-4 py-2.5 text-sm font-semibold text-[#0D2B4D] disabled:opacity-50"><Save className="h-4 w-4" />{pending ? "Enregistrement…" : "Enregistrer le brouillon"}</button> : null}
               {finalizable ? <button type="button" onClick={(event) => { const form = new FormData(event.currentTarget.form ?? undefined); setFinalizeSummary({ verdict: String(form.get("verdict") ?? ""), orientation: String(form.get("orientation") ?? ""), reserves: String(form.get("reserves") ?? "") }); setFinalizePreview(true); }} disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[#1EA362] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" />Finaliser l’avis</button> : null}
             </div>
           )}
           {state.status !== "idle" ? <p role="status" className={state.status === "error" ? "text-xs font-semibold text-[#B42318]" : "text-xs font-semibold text-[#1EA362]"}>{state.message}</p> : null}
        </form>
      ) : (
        <p className="mt-5 rounded-xl bg-[#F7F9FB] p-3 text-xs text-[#5B6776]">Aucune action disponible pour cet état.</p>
      )}
    </section>
  );
}
