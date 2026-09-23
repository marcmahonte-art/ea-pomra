import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import { dossierHref } from "@/lib/backoffice-nav";
import { CompletenessBar, DossierStatusBadge, PriorityBadge } from "./DossierStatus";

/**
 * Version mobile d'une ligne de dossier (spec §11).
 *
 * La spec est catégorique : « ne pas réduire un tableau desktop de façon
 * illisible ». Sous le point de rupture `lg`, chaque dossier devient donc une
 * carte autonome, avec ses libellés en clair — plus aucun tableau à faire
 * défiler horizontalement.
 *
 * Le passage se fait par CSS (`lg:hidden` / `hidden lg:block`) et non par une
 * détection de largeur en JavaScript : le serveur envoie les deux
 * représentations, le navigateur choisit. Cela évite un état d'hydratation
 * divergent et un saut de mise en page au premier rendu client.
 */
export function DossierCard({
  dossier,
  role,
  showCountry = false,
  actionLabel = "Consulter",
}: {
  dossier: Dossier;
  role: BackofficeRole;
  showCountry?: boolean;
  actionLabel?: string;
}) {
  return (
    <article className="rounded-2xl border border-[#E6E9EF] bg-white p-4 shadow-eap-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-semibold text-[#174A7C]">
            {dossier.reference}
          </p>
          <p className="mt-0.5 text-sm font-bold text-[#0D2B4D] truncate">
            {dossier.studentName}
          </p>
          <p className="text-[11px] text-[#5B6776] truncate">
            {dossier.program} · {dossier.formation}
          </p>
        </div>
        <DossierStatusBadge state={dossier.state} size="sm" />
      </div>

      <dl className="mt-3 space-y-1.5 border-t border-[#EDF1F6] pt-3">
        {showCountry ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[11px] text-[#98A2B3]">Antenne</dt>
            <dd className="text-[11px] font-semibold text-[#0D2B4D]">
              <span aria-hidden="true">{dossier.flag}</span> {dossier.country} ·{" "}
              {dossier.antennaCity}
            </dd>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] text-[#98A2B3]">Complétude</dt>
          <dd className="min-w-[100px]">
            <CompletenessBar value={dossier.completeness} />
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] text-[#98A2B3]">Mise à jour</dt>
          <dd className="text-[11px] font-semibold text-[#0D2B4D]">
            {dossier.updatedAtLabel}
          </dd>
        </div>

        {dossier.priority === "HAUTE" ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[11px] text-[#98A2B3]">Priorité</dt>
            <dd>
              <PriorityBadge priority={dossier.priority} />
            </dd>
          </div>
        ) : null}
      </dl>

      {dossier.requiredAction ? (
        <p className="mt-3 rounded-xl bg-[#FEF7EC] border border-[#FDE5C5] px-3 py-2 text-[11px] font-semibold text-[#B86E00]">
          Action attendue : {dossier.requiredAction}
        </p>
      ) : null}

      <Link
        href={dossierHref(role, dossier.id)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#174A7C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0D2B4D] transition-colors"
      >
        {actionLabel}
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default DossierCard;
