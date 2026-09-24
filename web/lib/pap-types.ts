import type { BackofficeScope } from "@/lib/backoffice-types";

export type PapAlertLevel = "INFO" | "ATTENTION" | "URGENT";
export type PapAlertStatus = "OPEN" | "ACKNOWLEDGED" | "CLOSED";
export type PapCaseStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type PapInterventionStatus = "PLANNED" | "DONE" | "CANCELLED";

export interface PapCaseSummary {
  id: string;
  dossierId: string;
  dossierRef: string;
  studentInitials: string;
  status: PapCaseStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  dossierVersion: number;
}

export interface PapAlert {
  id: string;
  caseId: string;
  dossierId: string;
  dossierRef: string;
  studentInitials: string;
  level: PapAlertLevel;
  subject: string;
  status: PapAlertStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PapIntervention {
  id: string;
  caseId: string;
  dossierId: string;
  dossierRef: string;
  studentInitials: string;
  interventionDate: string;
  interventionType: string;
  objective: string;
  observation: string;
  nextAction: string;
  status: PapInterventionStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  responsibleName: string;
}

export interface PapHistoryEvent {
  id: string;
  dossierId: string;
  dossierRef: string;
  studentInitials: string;
  action: string;
  occurredAt: string;
  userName: string;
  userRole: string;
}

export interface PapDashboard {
  activeAlerts: number;
  followUpsInProgress: number;
  activeMentorats: number;
  recentInterventions: number;
}

export function assertPapScope(scope: BackofficeScope, permission: "pap.read" | "pap.alerts.read" | "pap.alerts.write" | "pap.mentorat.read" | "pap.mentorat.write" | "history.read"): void {
  if (scope.isDemo || !scope.userId || scope.role !== "RESPONSABLE_PAP" || !scope.permissions.includes(permission)) {
    throw new Error("Opération PAP refusée");
  }
}
