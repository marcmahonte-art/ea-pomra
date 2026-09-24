"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, FileText, CheckCircle2, XCircle, FilePlus2, Download, Upload } from "lucide-react";
import type { BackofficeRole, DossierDocument } from "@/lib/backoffice-types";
import { DOCUMENT_LABELS } from "@/lib/backoffice-types";
import { decideDocument, type MutationState } from "@/app/backoffice/actions";

export function DocumentVerificationDialog({
  document,
  dossierId,
  dossierVersion,
  role,
  dossierReference,
  canVerify
}: {
  document: DossierDocument;
  dossierId: string;
  dossierVersion: number;
  role: BackofficeRole;
  dossierReference: string;
  canVerify: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<MutationState, FormData>(decideDocument, { status: "idle" });
  const [uploadState, setUploadState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!canVerify) {
    return document.hasFile ? (
      <a
        href={`/backoffice/documents/${document.id}/download?role=${role}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E9EF] px-2.5 py-1.5 text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB]"
      >
        <Download className="w-3.5 h-3.5" />
        Télécharger
      </a>
    ) : null;
  }

  async function uploadDocument(formData: FormData) {
    setUploadState("pending");
    setUploadError("");
     const response = await fetch(`/backoffice/documents/upload?role=${role}`, { method: "POST", body: formData });
    const result = (await response.json()) as { status: "success" | "error"; message: string };
    if (!response.ok || result.status === "error") {
      setUploadState("error");
      setUploadError(result.message);
      return;
    }
    setUploadState("success");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E6E9EF] px-2.5 py-1.5 text-[11px] font-bold text-[#0D2B4D] hover:border-[#174A7C] hover:bg-[#F7F9FB]"
      >
        <Eye className="w-3.5 h-3.5" />
        Vérifier
      </button>

      {open ? (
        <div className="fixed inset-0 z-[var(--eap-z-modal)] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="document-dialog-title">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-lg sm:rounded-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#EDF1F6] px-5 py-4">
              <div className="min-w-0">
                <h2 id="document-dialog-title" className="truncate text-base font-bold text-[#0D2B4D]">{document.name}</h2>
                <p className="mt-0.5 font-mono text-[11px] text-[#5B6776]">{dossierReference}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F7F9FB]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div><dt className="text-[10px] font-bold uppercase text-[#98A2B3]">Type</dt><dd className="text-xs font-semibold text-[#0D2B4D]">{document.type}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase text-[#98A2B3]">Ajout</dt><dd className="text-xs font-semibold text-[#0D2B4D]">{document.addedAt ?? "Non fournie"}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase text-[#98A2B3]">Statut</dt><dd className="text-xs font-semibold text-[#0D2B4D]">{DOCUMENT_LABELS[document.status]}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase text-[#98A2B3]">Fichier</dt><dd className="text-xs font-semibold text-[#0D2B4D]">{document.hasFile ? "Privé et disponible" : "Absent"}</dd></div>
              </dl>

              {document.hasFile ? (
                <a href={`/backoffice/documents/${document.id}/download?role=${role}`} className="inline-flex items-center gap-2 rounded-xl border border-[#D5E5F5] bg-[#EBF3FA] px-3 py-2 text-xs font-bold text-[#174A7C]">
                  <Download className="w-4 h-4" />
                  Télécharger le fichier
                </a>
              ) : null}

              <div className="rounded-xl border border-dashed border-[#E6E9EF] bg-[#FAFCFE] p-3">
                <p className="mb-2 text-xs font-bold text-[#0D2B4D]">Remplacer le fichier privé</p>
                <form action={uploadDocument}>
                  <input type="hidden" name="role" value={role} />
                   <input type="hidden" name="dossierId" value={dossierId} />
                   <input type="hidden" name="documentId" value={document.id} />
                   <input type="hidden" name="expectedVersion" value={document.version} />
                  <input name="file" type="file" accept="application/pdf,image/jpeg,image/png" required className="block w-full text-xs" />
                  <button type="submit" disabled={uploadState === "pending"} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#0D2B4D] px-3 py-2 text-[11px] font-bold text-white disabled:opacity-60">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadState === "pending" ? "Téléversement…" : "Téléverser"}
                  </button>
                  {uploadState === "error" ? <p className="mt-2 text-[11px] text-[#B42318]">{uploadError}</p> : null}
                  {uploadState === "success" ? <p className="mt-2 text-[11px] text-[#1EA362]">Fichier téléversé.</p> : null}
                </form>
              </div>

              <p className="rounded-xl border border-[#E6E9EF] px-3 py-2.5 text-xs text-[#1F2937]">{document.comment ?? "Aucun commentaire."}</p>

              {document.status === "A_VERIFIER" && document.hasFile ? (
                <div className="space-y-2">
                  {[
                    { label: "Valider", Icon: CheckCircle2, tone: "bg-[#1EA362]", decision: "VALIDE" },
                    { label: "Refuser", Icon: XCircle, tone: "bg-[#B42318]", decision: "REFUSE" },
                    { label: "Demander une nouvelle pièce", Icon: FilePlus2, tone: "bg-[#174A7C]", decision: "REQUIER_NOUVEAU" }
                  ].map(({ label, Icon, tone, decision }) => (
                    <form action={formAction} key={decision} className="rounded-xl border border-[#EDF1F6] p-2">
                      <input type="hidden" name="role" value={role} />
                      <input type="hidden" name="dossierId" value={dossierId} />
                      <input type="hidden" name="documentId" value={document.id} />
                      <input type="hidden" name="version" value={dossierVersion} />
                      <input type="hidden" name="decision" value={decision} />
                      <textarea name="comment" maxLength={2000} required={decision !== "VALIDE"} rows={2} placeholder="Commentaire" className="w-full rounded-lg border border-[#D8DEE9] px-2 py-1.5 text-xs" />
                      <button type="submit" disabled={pending} className={`mt-2 inline-flex items-center gap-1.5 rounded-lg ${tone} px-3 py-2 text-[11px] font-bold text-white disabled:opacity-60`}>
                        <Icon className="w-3.5 h-3.5" />
                        {pending ? "Enregistrement…" : label}
                      </button>
                    </form>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-xs text-[#5B6776]"><FileText className="w-4 h-4" />Ce document n&apos;attend aucune décision.</p>
              )}
              {state.status !== "idle" ? <p className={state.status === "error" ? "text-xs text-[#B42318]" : "text-xs text-[#1EA362]"}>{state.message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default DocumentVerificationDialog;
