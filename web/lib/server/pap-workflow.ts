import type { BackofficeRole, Permission } from "@/lib/backoffice-types";
import type { PapAlertStatus, PapCaseStatus, PapInterventionStatus } from "@/lib/pap-types";

export function canTransitionPapAlert(from: PapAlertStatus, to: PapAlertStatus): boolean {
  return (from === "OPEN" && to === "ACKNOWLEDGED") || (from === "ACKNOWLEDGED" && to === "CLOSED") || (from === "CLOSED" && to === "OPEN");
}

export function canTransitionPapCase(from: PapCaseStatus, to: PapCaseStatus): boolean {
  return (from === "OPEN" && to === "IN_PROGRESS") || (from === "IN_PROGRESS" && to === "CLOSED") || (from === "CLOSED" && to === "OPEN");
}

export function canTransitionPapIntervention(from: PapInterventionStatus, to: PapInterventionStatus): boolean {
  return (from === "PLANNED" && to === "DONE") || (from === "PLANNED" && to === "CANCELLED");
}

export function canWritePapAlert(input: { role: BackofficeRole; permissions: readonly Permission[]; assigned: boolean; status: PapAlertStatus }): boolean {
  return input.role === "RESPONSABLE_PAP" && input.permissions.includes("pap.alerts.write") && input.assigned;
}

export function canWritePapIntervention(input: { role: BackofficeRole; permissions: readonly Permission[]; assigned: boolean; status: PapInterventionStatus }): boolean {
  return input.role === "RESPONSABLE_PAP" && input.permissions.includes("pap.mentorat.write") && input.assigned && input.status === "PLANNED";
}
