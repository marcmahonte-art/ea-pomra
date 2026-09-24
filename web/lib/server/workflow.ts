import type { BackofficeRole, DossierState, Permission, WorkflowStep } from "@/lib/backoffice-types";

export type DossierTransition = {
  from: DossierState;
  to: DossierState;
  roles: readonly BackofficeRole[];
  permission: Permission;
};

export const DOSSIER_TRANSITIONS: readonly DossierTransition[] = [
  { from: "RECU", to: "EN_VERIFICATION", roles: ["ANTENNE"], permission: "dossiers.update" },
  { from: "EN_VERIFICATION", to: "INCOMPLET", roles: ["ANTENNE"], permission: "dossiers.update" },
  { from: "INCOMPLET", to: "EN_VERIFICATION", roles: ["ANTENNE"], permission: "dossiers.update" },
  {
    from: "EN_VERIFICATION",
    to: "TRANSMIS_OCO",
    roles: ["ANTENNE"],
    permission: "dossiers.transmit"
  },
  { from: "TRANSMIS_OCO", to: "AVIS_RECU", roles: ["EXPERT_OCO"], permission: "oco.reviews.finalize" },
  { from: "AVIS_RECU", to: "A_VALIDER", roles: ["ANTENNE"], permission: "dossiers.transmit" },
  { from: "A_VALIDER", to: "VALIDE", roles: ["BEC"], permission: "dossiers.validate" },
  { from: "A_VALIDER", to: "REJETE", roles: ["BEC"], permission: "dossiers.reject" },
  { from: "VALIDE", to: "EN_MOBILITE", roles: ["ANTENNE"], permission: "dossiers.update" },
  { from: "EN_MOBILITE", to: "EN_SUIVI", roles: ["ANTENNE"], permission: "dossiers.update" },
  { from: "EN_SUIVI", to: "DIPLOME", roles: ["BEC"], permission: "dossiers.validate" }
];

const STATE_TO_STEP: Record<DossierState, WorkflowStep> = {
  RECU: "CANDIDATURE",
  EN_VERIFICATION: "CANDIDATURE",
  INCOMPLET: "CANDIDATURE",
  REJETE: "CANDIDATURE",
  TRANSMIS_OCO: "ORIENTATION",
  AVIS_RECU: "ORIENTATION",
  A_VALIDER: "ORIENTATION",
  VALIDE: "MOBILITE",
  EN_MOBILITE: "MOBILITE",
  EN_SUIVI: "SUIVI",
  DIPLOME: "DIPLOME"
};

export function getWorkflowStep(state: DossierState): WorkflowStep {
  return STATE_TO_STEP[state];
}

export function getTransition(
  from: DossierState,
  to: DossierState
): DossierTransition | undefined {
  return DOSSIER_TRANSITIONS.find((transition) => transition.from === from && transition.to === to);
}

export function canTransition(
  from: DossierState,
  to: DossierState,
  role: BackofficeRole,
  permissions: readonly Permission[]
): boolean {
  const transition = getTransition(from, to);
  return Boolean(
    transition && transition.roles.includes(role) && permissions.includes(transition.permission)
  );
}

export function assertTransition(
  from: DossierState,
  to: DossierState,
  role: BackofficeRole,
  permissions: readonly Permission[]
): void {
  if (!canTransition(from, to, role, permissions)) {
    throw new Error("Transition de dossier refusée");
  }
}

export function isBecValidationState(state: DossierState): boolean {
  return state === "A_VALIDER";
}
