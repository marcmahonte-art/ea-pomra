import { ArrowRight, Plane, Info } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import { DataTable, type Column } from "./DataTable";
import { DossierLink } from "./DossierTable";

/**
 * Mobilité (spec §17).
 *
 * « Le composant doit permettre de suivre l'état sans exposer de données
 * auxquelles le rôle n'a pas accès. » Les dossiers reçus ici ont déjà été
 * filtrés par `computeByStep()`, qui applique le périmètre avant tout — ce
 * composant ne reçoit donc que des dossiers autorisés, et ne peut pas en
 * divulguer d'autres.
 */
export function MobilitePanel({
  dossiers,
  role,
}: {
  dossiers: Dossier[];
  role: BackofficeRole;
}) {
  const columns: Column<Dossier>[] = [
    {
      key: "reference",
      header: "ID-POMRA",
      render: (dossier) => (
        <DossierLink role={role} dossierId={dossier.id} reference={dossier.reference} />
      ),
    },
    {
      key: "student",
      header: "Étudiant",
      render: (dossier) => (
        <span className="text-xs font-bold text-[#0D2B4D]">{dossier.studentName}</span>
      ),
    },
    {
      key: "source",
      header: "Pays source",
      render: (dossier) => (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D2B4D] whitespace-nowrap">
          <span aria-hidden="true">{dossier.flag}</span>
          {dossier.mobilite?.sourceCountry ?? dossier.country}
        </span>
      ),
    },
    {
      key: "target",
      header: "Pays destination",
      render: (dossier) =>
        dossier.mobilite ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D2B4D] whitespace-nowrap">
            <ArrowRight className="w-3 h-3 text-[#98A2B3]" aria-hidden="true" />
            {dossier.mobilite.targetCountry}
            <span className="font-normal text-[#5B6776]">
              · {dossier.mobilite.targetCity}
            </span>
          </span>
        ) : (
          <span className="text-[11px] text-[#98A2B3]">Destination non définie</span>
        ),
    },
    {
      key: "formation",
      header: "Formation",
      render: (dossier) => (
        <span className="text-xs text-[#5B6776]">{dossier.formation}</span>
      ),
    },
    {
      key: "status",
      header: "Statut mobilité",
      render: (dossier) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E5F5] bg-[#EBF3FA] px-2.5 py-1 text-[11px] font-semibold text-[#174A7C] whitespace-nowrap">
          <Plane className="w-3.5 h-3.5" aria-hidden="true" />
          {dossier.mobilite?.status ?? "Non engagée"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Dernière mise à jour",
      render: (dossier) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {dossier.mobilite?.updatedAt ?? dossier.updatedAtLabel}
        </span>
      ),
    },
  ];

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h2 className="text-base font-bold text-[#0D2B4D] tracking-tight">
          Dossiers en mobilité
        </h2>
        <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
          Parcours dont l&apos;étape comporte une mobilité entre pays.
          L&apos;antenne suit l&apos;état d&apos;avancement ; les données
          affichées sont limitées à son périmètre.
        </p>
      </div>

      <DataTable
        caption="Dossiers à l'étape Mobilité"
        columns={columns}
        rows={dossiers}
        rowKey={(dossier) => dossier.id}
        emptyLabel="Aucun dossier n'est actuellement en mobilité."
      />

      <p className="flex items-start gap-2 border-t border-[#EDF1F6] px-5 py-3 text-[11px] leading-relaxed text-[#5B6776]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#98A2B3]" aria-hidden="true" />
        <span>
          Le périmètre est appliqué côté serveur, avant la lecture : un agent
          d&apos;antenne ne peut pas consulter une mobilité hors de son pays.
        </span>
      </p>
    </section>
  );
}

export default MobilitePanel;
