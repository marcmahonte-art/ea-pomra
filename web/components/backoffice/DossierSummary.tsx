import { Mail, Phone, MapPin } from "lucide-react";
import type { Dossier } from "@/lib/backoffice-types";
import { STATE_LABELS, STEP_LABELS } from "@/lib/backoffice-types";
import { CompletenessBar } from "./DossierStatus";

/**
 * Résumé du dossier (spec §13.2).
 *
 * Affiche les sept informations exigées : identité, programme, formation,
 * pays / antenne, date de candidature, statut, complétude.
 *
 * La référence PAP y figure sous une forme strictement encadrée par la spec §24 :
 * une **existence** et un **statut**, jamais un contenu. Le type `PapReference`
 * ne transporte d'ailleurs que ces deux champs — la confidentialité est
 * appliquée par la structure de donnée, avant même d'arriver ici. Ce composant
 * ne pourrait pas afficher une note confidentielle : elle n'existe pas dans ce
 * qu'il reçoit.
 */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
        {label}
      </dt>
      <dd className="text-xs font-semibold text-[#0D2B4D]">{children}</dd>
    </div>
  );
}

export function DossierSummary({ dossier }: { dossier: Dossier }) {
  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[#EDF1F6]">
        <h2 className="text-base font-bold text-[#0D2B4D] tracking-tight">
          Résumé du dossier
        </h2>
        <p className="text-xs text-[#5B6776] mt-1">
          Étape du parcours : {STEP_LABELS[dossier.step]}
        </p>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        <Row label="Identité">
          <span className="block">{dossier.studentName}</span>
          <span className="mt-1 flex flex-col gap-0.5 text-[11px] font-normal text-[#5B6776]">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[#98A2B3]" aria-hidden="true" />
              {dossier.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#98A2B3]" aria-hidden="true" />
              {dossier.phone}
            </span>
          </span>
        </Row>

        <Row label="Programme">{dossier.program}</Row>
        <Row label="Formation">{dossier.formation}</Row>

        <Row label="Pays / Antenne">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#98A2B3]" aria-hidden="true" />
            <span aria-hidden="true">{dossier.flag}</span>
            {dossier.country} · antenne de {dossier.antennaCity}
          </span>
        </Row>

        <Row label="Date de candidature">{dossier.createdAtLabel}</Row>

        <Row label="Statut">
          {STATE_LABELS[dossier.state]}
          {dossier.requiredAction ? (
            <span className="block mt-1 text-[11px] font-medium text-[#B86E00]">
              Action attendue : {dossier.requiredAction}
            </span>
          ) : null}
        </Row>

        <Row label="Complétude">
          <span className="inline-block min-w-[120px]">
            <CompletenessBar value={dossier.completeness} />
          </span>
        </Row>

      </div>
    </section>
  );
}

export default DossierSummary;
