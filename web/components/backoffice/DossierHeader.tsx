import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  UserPlus,
  Send,
  CheckCircle2,
  CalendarClock,
  Info,
} from "lucide-react";
import type { BackofficeRole, Dossier, Permission } from "@/lib/backoffice-types";
import { dossiersHref } from "@/lib/backoffice-nav";
import { DossierStatusBadge, PriorityBadge } from "./DossierStatus";
import { DisabledAction } from "./DisabledAction";

/**
 * En-tête de la fiche dossier (spec §13.1).
 *
 * Deux règles de la spec gouvernent ce composant :
 *
 *   1. « Ne jamais afficher une action simplement parce qu'elle existe dans le
 *      frontend : elle doit être validée côté serveur par RBAC. » Les quatre
 *      actions sont donc filtrées par les permissions **du périmètre**, qui
 *      proviennent de la session serveur — un agent d'antenne ne voit pas
 *      « Valider », qui appartient au BEC.
 *   2. Les actions affichées mais non raccordées sont désactivées et
 *      expliquées (voir `DisabledAction`), jamais silencieusement inertes.
 *
 * Ce composant porte le **seul `<h1>`** de la page de détail.
 */
const ACTIONS: {
  key: string;
  label: string;
  icon: typeof Pencil;
  permission: Permission;
}[] = [
  { key: "modifier", label: "Modifier", icon: Pencil, permission: "dossiers.update" },
  { key: "assigner", label: "Assigner", icon: UserPlus, permission: "dossiers.assign" },
  {
    key: "transmettre",
    label: "Transmettre",
    icon: Send,
    permission: "dossiers.transmit",
  },
  { key: "valider", label: "Valider", icon: CheckCircle2, permission: "dossiers.validate" },
];

export function DossierHeader({
  dossier,
  role,
  permissions,
}: {
  dossier: Dossier;
  role: BackofficeRole;
  permissions: Permission[];
}) {
  const allowed = ACTIONS.filter((action) => permissions.includes(action.permission));

  return (
    <header className="space-y-4">
      <Link
        href={dossiersHref(role)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A7C] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Retour aux dossiers
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-[#174A7C]">
            {dossier.reference}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
            {dossier.studentName}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DossierStatusBadge state={dossier.state} />
            <PriorityBadge priority={dossier.priority} />
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#5B6776]">
              <CalendarClock className="w-3.5 h-3.5 text-[#98A2B3]" aria-hidden="true" />
              Dernière mise à jour :{" "}
              <span className="font-semibold text-[#0D2B4D]">
                {dossier.updatedAtLabel}
              </span>
            </span>
          </div>
        </div>

        {allowed.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {allowed.map((action) => (
              <DisabledAction
                key={action.key}
                id={`dossier-action-${action.key}`}
                label={action.label}
                icon={action.icon}
                variant={action.key === "valider" ? "primary" : "outline"}
                reason="Action non disponible : aucune route de mutation n'est encore exposée par la plateforme."
              />
            ))}
          </div>
        ) : null}
      </div>

      {allowed.length > 0 ? (
        <p className="flex items-start gap-2 rounded-xl border border-[#FDE5C5] bg-[#FFFBF4] px-3 py-2.5 text-[11px] leading-relaxed text-[#B86E00]">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Les actions de modification sont présentées selon vos droits, mais
            leur enregistrement n&apos;est pas encore raccordé : la plateforme
            n&apos;expose ni route de mutation ni journal d&apos;audit côté
            serveur.
          </span>
        </p>
      ) : null}
    </header>
  );
}

export default DossierHeader;
