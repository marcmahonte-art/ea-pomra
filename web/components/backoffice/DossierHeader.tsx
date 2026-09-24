"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Send } from "lucide-react";
import type { BackofficeRole, Dossier, Permission } from "@/lib/backoffice-types";
import { dossiersHref } from "@/lib/backoffice-nav";
import { DOSSIER_TRANSITIONS, type DossierTransition } from "@/lib/server/workflow";
import { DossierStatusBadge, PriorityBadge } from "./DossierStatus";
import { transitionDossier, type MutationState } from "@/app/backoffice/actions";

const TRANSITION_LABELS = {
  EN_VERIFICATION: "Ouvrir la vérification",
  INCOMPLET: "Signaler une pièce manquante",
  TRANSMIS_OCO: "Transmettre à l’OCO",
  A_VALIDER: "Demander la validation",
  VALIDE: "Valider",
  REJETE: "Rejeter",
  EN_MOBILITE: "Démarrer la mobilité",
  EN_SUIVI: "Ouvrir le suivi",
  DIPLOME: "Enregistrer le diplôme"
} as const;

export function DossierHeader({
  dossier,
  role,
  permissions
}: {
  dossier: Dossier;
  role: BackofficeRole;
  permissions: Permission[];
}) {
  const transitions = DOSSIER_TRANSITIONS.filter(
    (transition) =>
      transition.from === dossier.state &&
      transition.roles.includes(role) &&
      permissions.includes(transition.permission)
  );

  return (
    <header className="space-y-4">
      <Link
        href={dossiersHref(role)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A7C] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux dossiers
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-[#174A7C]">{dossier.reference}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
            {dossier.studentName}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DossierStatusBadge state={dossier.state} />
            <PriorityBadge priority={dossier.priority} />
            <span className="text-[11px] text-[#5B6776]">Dernière mise à jour : {dossier.updatedAtLabel}</span>
          </div>
        </div>

        {transitions.length > 0 ? (
          <div className="flex shrink-0 flex-wrap items-start gap-2">
            {transitions.map((transition) => (
              <DossierTransitionForm
                key={`${transition.from}-${transition.to}`}
                dossierId={dossier.id}
                version={dossier.version}
                role={role}
                toState={transition.to}
                label={TRANSITION_LABELS[transition.to as keyof typeof TRANSITION_LABELS] ?? "Mettre à jour"}
                destructive={transition.to === "REJETE"}
              />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function DossierTransitionForm({
  dossierId,
  version,
  role,
  toState,
  label,
  destructive
}: {
  dossierId: string;
  version: number;
  role: BackofficeRole;
  toState: DossierTransition["to"];
  label: string;
  destructive: boolean;
}) {
  const [state, formAction, pending] = useActionState<MutationState, FormData>(transitionDossier, { status: "idle" });
  const Icon = toState === "REJETE" ? XCircle : toState === "TRANSMIS_OCO" ? Send : CheckCircle2;

  return (
    <form action={formAction} className="space-y-1">
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="dossierId" value={dossierId} />
      <input type="hidden" name="toState" value={toState} />
      <input type="hidden" name="version" value={version} />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold text-white disabled:opacity-60 ${destructive ? "bg-[#B42318]" : "bg-[#174A7C]"}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {pending ? "Mise à jour…" : label}
      </button>
      {state.status !== "idle" ? (
        <p className={state.status === "error" ? "max-w-52 text-[10px] text-[#B42318]" : "max-w-52 text-[10px] text-[#1EA362]"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export default DossierHeader;
