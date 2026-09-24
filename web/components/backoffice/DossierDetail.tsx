import { Compass, ArrowLeftRight, GraduationCap, ShieldCheck, History } from "lucide-react";
import type {
  ActivityEvent,
  BackofficeRole,
  Dossier,
  Permission,
} from "@/lib/backoffice-types";
import { DossierHeader } from "./DossierHeader";
import { DossierSummary } from "./DossierSummary";
import { WorkflowStepper } from "./DossierStatus";
import { DossierDocuments } from "./DossierDocuments";
import { ActivityLog } from "./ActivityLog";
import { OrientationPanel } from "./OrientationQueue";
import { MobilitePanel } from "./MobilitePanel";
import { StssPanel } from "./StssPanel";

/**
 * Fiche dossier complète (spec §13).
 *
 * La spec §13.3 propose des onglets **ou** des sections structurées. Les
 * sections sont retenues : elles restent des composants serveur, elles
 * s'impriment en entier, elles se parcourent au `Ctrl+F`, et chaque section peut
 * être visée par un lien. Un onglet obligerait à rendre le composant client et
 * masquerait la moitié du dossier derrière un clic.
 *
 * Le composant est partagé par les deux back-offices : un dossier se lit de la
 * même manière qu'on soit à l'antenne ou au BEC. Seuls les **droits** diffèrent,
 * et ils sont portés par `permissions`.
 */
export function DossierDetail({
  dossier,
  role,
  permissions,
  history,
  isDemo,
}: {
  dossier: Dossier;
  role: BackofficeRole;
  permissions: Permission[];
  history: ActivityEvent[];
  isDemo: boolean;
}) {
  const showOrientation =
    dossier.step === "ORIENTATION" || dossier.orientation?.transmittedAt != null;
  const showMobilite = dossier.mobilite !== null;
  const showStss = dossier.stss !== null;
  const showSuivi = dossier.step === "SUIVI" || dossier.step === "DIPLOME";

  return (
    <div className="space-y-6">
      <DossierHeader dossier={dossier} role={role} permissions={permissions} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DossierSummary dossier={dossier} />
        </div>

        <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft p-5">
          <h2 className="text-base font-bold text-[#0D2B4D] tracking-tight">
            Statut du parcours
          </h2>
          <p className="text-xs text-[#5B6776] mt-1 mb-4 leading-relaxed">
            Progression dans le workflow métier, telle qu&apos;enregistrée côté
            serveur.
          </p>
          <WorkflowStepper dossier={dossier} />
        </section>
      </div>

      <DossierDocuments
         documents={dossier.documents}
         dossierId={dossier.id}
         dossierVersion={dossier.version}
         role={role}
         dossierReference={dossier.reference}
         canVerify={permissions.includes("documents.verify") && !isDemo}
       />

      {showOrientation ? (
        <section className="space-y-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <Compass className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            Orientation
          </h2>
          <OrientationPanel dossier={dossier} role={role} />
        </section>
      ) : null}

      {showMobilite ? (
        <section className="space-y-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <ArrowLeftRight className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            Mobilité
          </h2>
          <MobilitePanel dossiers={[dossier]} role={role} />
        </section>
      ) : null}

      {showSuivi ? (
        <section className="space-y-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <GraduationCap className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            Suivi
          </h2>
          <p className="text-xs text-[#5B6776] leading-relaxed">
            Dossier parvenu à l&apos;étape Suivi. Les informations de suivi
            académique sont portées par le portail Étudiant et le portail Parent.
          </p>
        </section>
      ) : null}

      {showStss ? (
        <section className="space-y-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <ShieldCheck className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            STSS
          </h2>
          <StssPanel dossiers={[dossier]} role={role} />
        </section>
      ) : null}

      <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
            <History className="w-4 h-4 text-[#667085]" aria-hidden="true" />
            Historique du dossier
          </h2>
          <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
            Registre chronologique en lecture seule. Aucune action de cette
            interface ne peut le modifier (spec §15).
          </p>
        </div>

        <ActivityLog events={history} role={role} variant="full" />
      </section>
    </div>
  );
}

export default DossierDetail;
