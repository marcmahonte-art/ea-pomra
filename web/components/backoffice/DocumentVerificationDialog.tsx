"use client";

import { useEffect, useState } from "react";
import { X, Eye, FileText, CheckCircle2, XCircle, FilePlus2, Info } from "lucide-react";
import type { DossierDocument } from "@/lib/backoffice-types";
import { DOCUMENT_LABELS } from "@/lib/backoffice-types";

/**
 * Boîte de vérification d'une pièce (spec §14).
 *
 * Contenu imposé : nom du document, type, date d'ajout, aperçu, statut,
 * commentaire. Actions : valider, refuser, demander une nouvelle pièce.
 *
 * Deux points d'honnêteté :
 *
 *   - **l'aperçu n'existe pas.** Aucun stockage de pièce n'est raccordé à la
 *     plateforme : le document n'a ni URL ni binaire. Le panneau le dit
 *     explicitement plutôt que d'afficher un cadre vide qui laisserait croire à
 *     un chargement en cours ;
 *   - **les décisions ne sont pas enregistrées.** La spec §14 impose que
 *     « toute action soit enregistrée dans l'historique » ; sans route de
 *     mutation ni journal serveur, aucune décision ne peut être persistée. Les
 *     trois boutons sont donc désactivés et la raison est affichée dans la
 *     boîte, à l'endroit où l'agent la cherchera.
 *
 * Le composant porte son propre déclencheur : la ligne du tableau est rendue par
 * un composant serveur, qui n'a pas besoin de devenir client pour ouvrir une
 * boîte de dialogue.
 */
export function DocumentVerificationDialog({
  document,
  dossierReference,
}: {
  document: DossierDocument;
  dossierReference: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const actions = [
    { label: "Valider", Icon: CheckCircle2, tone: "bg-[#1EA362]" },
    { label: "Refuser", Icon: XCircle, tone: "bg-[#B42318]" },
    { label: "Demander une nouvelle pièce", Icon: FilePlus2, tone: "bg-[#174A7C]" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E9EF] px-2.5 py-1.5 text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB] hover:border-[#174A7C] transition-colors whitespace-nowrap"
      >
        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
        Vérifier
      </button>

      {open ? (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ zIndex: "var(--eap-z-modal)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="document-dialog-title"
        >
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-eap-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#EDF1F6]">
              <div className="min-w-0">
                <h2
                  id="document-dialog-title"
                  className="text-base font-bold text-[#0D2B4D] tracking-tight truncate"
                >
                  {document.name}
                </h2>
                <p className="text-[11px] text-[#5B6776] mt-0.5 font-mono">
                  {dossierReference}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#667085] hover:bg-[#F7F9FB] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    Type
                  </dt>
                  <dd className="text-xs font-semibold text-[#0D2B4D]">
                    {document.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    Date d&apos;ajout
                  </dt>
                  <dd className="text-xs font-semibold text-[#0D2B4D]">
                    {document.addedAt ?? "Non fournie"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    Statut
                  </dt>
                  <dd className="text-xs font-semibold text-[#0D2B4D]">
                    {DOCUMENT_LABELS[document.status]}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    Vérifié par
                  </dt>
                  <dd className="text-xs font-semibold text-[#0D2B4D]">
                    {document.verifiedBy ?? "—"}
                  </dd>
                </div>
              </dl>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] mb-1.5">
                  Aperçu
                </p>
                <div className="rounded-xl border border-dashed border-[#E6E9EF] bg-[#FAFCFE] px-4 py-8 flex flex-col items-center text-center">
                  <FileText className="w-6 h-6 text-[#98A2B3]" aria-hidden="true" />
                  <p className="mt-2 text-[11px] font-semibold text-[#0D2B4D]">
                    Aperçu indisponible
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#5B6776] max-w-xs leading-relaxed">
                    Aucun stockage de pièce n&apos;est raccordé à la plateforme :
                    le fichier n&apos;est ni téléversé ni servi.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] mb-1.5">
                  Commentaire
                </p>
                <p className="rounded-xl border border-[#E6E9EF] bg-white px-3 py-2.5 text-xs text-[#1F2937]">
                  {document.comment ?? "Aucun commentaire."}
                </p>
              </div>

              <p className="flex items-start gap-2 rounded-xl border border-[#FDE5C5] bg-[#FFFBF4] px-3 py-2.5 text-[11px] leading-relaxed text-[#B86E00]">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  Les décisions ci-dessous ne sont pas encore enregistrées :
                  aucune route serveur n&apos;est exposée, et la spec exige que
                  chaque décision soit tracée dans l&apos;historique.
                </span>
              </p>

              <div className="flex flex-wrap gap-2">
                {actions.map(({ label, Icon, tone }) => (
                  <button
                    key={label}
                    type="button"
                    disabled
                    title="Action non disponible : aucune route de mutation n'est encore exposée."
                    className={`inline-flex items-center gap-1.5 rounded-xl ${tone} px-3 py-2 text-[11px] font-bold text-white opacity-55 cursor-not-allowed`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default DocumentVerificationDialog;
