import { Compass, Send, MessageSquareCheck, FileWarning, Info } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import { DataTable, type Column } from "./DataTable";
import { DossierStatusBadge } from "./DossierStatus";
import { DossierLink } from "./DossierTable";

/**
 * Orientation / avis OCO (spec §16).
 *
 * L'interface prépare et suit les dossiers qui attendent un avis, mais elle ne
 * le produit pas. La spec est explicite : « l'antenne ne doit pas simuler un
 * avis OCO. L'avis doit provenir du rôle et du workflow prévu. » Aucun bouton
 * de saisie d'avis n'existe donc ici — c'est le rôle Expert OCO, hors de ce
 * back-office, qui l'alimentera.
 *
 * Les quatre compteurs de tête correspondent exactement aux quatre situations
 * listées par la spec : en attente d'avis, transmis, avis reçus, à compléter.
 */
function Counter({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Compass;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-[#E6E9EF] bg-white px-4 py-3">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#667085]">
        <Icon className={`w-3.5 h-3.5 ${tone}`} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-[#0D2B4D] tabular-nums">{value}</p>
    </div>
  );
}

export function OrientationQueue({
  dossiers,
  role,
}: {
  dossiers: Dossier[];
  role: BackofficeRole;
}) {
  const transmitted = dossiers.filter((d) => d.orientation?.transmittedAt != null);
  const withVerdict = dossiers.filter((d) => d.orientation?.verdict != null);
  const awaiting = transmitted.filter((d) => d.orientation?.verdict == null);
  const toComplete = dossiers.filter((d) => d.state === "INCOMPLET");

  const columns: Column<Dossier>[] = [
    {
      key: "reference",
      header: "ID-POMRA",
      render: (dossier) => (
        <DossierLink role={role} dossierId={dossier.id} reference={dossier.reference} />
      ),
    },
    {
      key: "program",
      header: "Programme",
      render: (dossier) => (
        <span className="text-xs text-[#1F2937]">{dossier.program}</span>
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
      key: "state",
      header: "Statut",
      render: (dossier) => <DossierStatusBadge state={dossier.state} />,
    },
    {
      key: "transmittedAt",
      header: "Date de transmission",
      render: (dossier) => (
        <span className="text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
          {dossier.orientation?.transmittedAt ?? "Non transmis"}
        </span>
      ),
    },
    {
      key: "verdict",
      header: "Avis disponible ?",
      render: (dossier) =>
        dossier.orientation?.verdict ? (
          <span className="text-[11px] font-bold text-[#1EA362]">
            Oui — {dossier.orientation.verdict.replace(/_/g, " ").toLowerCase()}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-[#98A2B3]">
            En attente de l&apos;OCO
          </span>
        ),
    },
     {
       key: "orientation",
       header: "Orientation",
       render: (dossier) => (
         <span className="text-[11px] text-[#1F2937]">
           {dossier.orientation?.orientation ?? "Non renseignée"}
         </span>
       ),
     },
     {
       key: "action",
      header: "Action",
      render: (dossier) => (
        <DossierLink role={role} dossierId={dossier.id} reference="Ouvrir" />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Counter
          icon={Compass}
          label="En attente d'avis"
          value={awaiting.length}
          tone="text-[#B86E00]"
        />
        <Counter
          icon={Send}
          label="Dossiers transmis"
          value={transmitted.length}
          tone="text-[#174A7C]"
        />
        <Counter
          icon={MessageSquareCheck}
          label="Avis reçus"
          value={withVerdict.length}
          tone="text-[#1EA362]"
        />
        <Counter
          icon={FileWarning}
          label="À compléter"
          value={toComplete.length}
          tone="text-[#B42318]"
        />
      </div>

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <h2 className="text-base font-bold text-[#0D2B4D] tracking-tight">
            Dossiers en orientation
          </h2>
          <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
            Dossiers parvenus à l&apos;étape Orientation. L&apos;avis est produit
            par le rôle Expert OCO : l&apos;antenne le suit, elle ne le saisit
            pas.
          </p>
        </div>

        <DataTable
          caption="Dossiers à l'étape Orientation"
          columns={columns}
          rows={dossiers}
          rowKey={(dossier) => dossier.id}
          emptyLabel="Aucun dossier n'est actuellement à l'étape Orientation."
        />

        <p className="flex items-start gap-2 border-t border-[#EDF1F6] px-5 py-3 text-[11px] leading-relaxed text-[#5B6776]">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#98A2B3]" aria-hidden="true" />
          <span>
            Les avis affichés proviennent du workflow métier enregistré côté
            serveur. Aucun avis n&apos;est simulé par cette interface.
          </span>
        </p>
      </section>
    </div>
  );
}

export default OrientationQueue;

/**
 * Volet Orientation d'une fiche dossier (spec §13.3).
 *
 * Version mono-dossier du panneau ci-dessus. Le verdict affiché provient
 * exclusivement de `dossier.orientation`, alimenté par le workflow serveur :
 * aucune saisie n'est possible ici, conformément à la règle de la spec §16.
 */
export function OrientationPanel({
  dossier,
  role,
}: {
  dossier: Dossier;
  role: BackofficeRole;
}) {
   const { transmittedAt, verdict, orientation, observations, reserves, avisDate, expertName } = dossier.orientation ?? {
     transmittedAt: null,
     verdict: null,
     orientation: null,
     observations: null,
     reserves: null,
     avisDate: null,
     expertName: null
   };

  return (
    <div className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
            Date de transmission
          </dt>
          <dd className="mt-0.5 text-xs font-semibold text-[#0D2B4D]">
            {transmittedAt ?? "Non transmis"}
          </dd>
        </div>

        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
            Avis disponible
          </dt>
          <dd className="mt-0.5 text-xs font-semibold text-[#0D2B4D]">
            {verdict ? (
              <>
                Oui —{" "}
                <span className="text-[#1EA362]">
                  {verdict.replace(/_/g, " ").toLowerCase()}
                </span>
              </>
            ) : (
              "En attente de l'OCO"
            )}
          </dd>
        </div>

         <div>
           <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
             Orientation
           </dt>
           <dd className="mt-0.5 text-xs font-semibold text-[#0D2B4D]">
             {orientation ?? "—"}
           </dd>
         </div>

         <div>
           <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
             Date de l&apos;avis
           </dt>
           <dd className="mt-0.5 text-xs font-semibold text-[#0D2B4D]">
             {avisDate ?? "—"}
           </dd>
         </div>

         <div>
           <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
             Expert OCO
           </dt>
          <dd className="mt-0.5 text-xs font-semibold text-[#0D2B4D]">
            {expertName ?? "—"}
          </dd>
        </div>
       </dl>

       {observations || reserves ? (
         <div className="mt-4 grid gap-4 border-t border-[#EDF1F6] pt-4 text-xs text-[#5B6776]">
           {observations ? <p><span className="font-bold text-[#0D2B4D]">Observations : </span>{observations}</p> : null}
           {reserves ? <p><span className="font-bold text-[#0D2B4D]">Réserves : </span>{reserves}</p> : null}
         </div>
       ) : null}

       <p className="mt-4 flex items-start gap-2 border-t border-[#EDF1F6] pt-3 text-[11px] leading-relaxed text-[#5B6776]">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#98A2B3]" aria-hidden="true" />
        <span>
          L&apos;avis est produit par le rôle Expert OCO. Le back-office{" "}
          {role === "BEC" ? "BEC" : "Antenne"} le consulte, il ne le saisit pas.
        </span>
      </p>
    </div>
  );
}
