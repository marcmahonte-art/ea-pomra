import type { BackofficeRole, OrientationInfo, Permission } from "@/lib/backoffice-types";

export function canFinalizeOcoReview(input: {
  role: BackofficeRole;
  permissions: readonly Permission[];
  assigned: boolean;
  dossierState: string;
  reviewStatus: "DRAFT" | "FINALIZED" | null;
}): boolean {
  return input.role === "EXPERT_OCO"
    && input.permissions.includes("oco.reviews.finalize")
    && input.assigned
    && input.dossierState === "TRANSMIS_OCO"
    && input.reviewStatus !== "FINALIZED";
}

export function isFinalizedOcoProjection(input: { status: "DRAFT" | "FINALIZED" | null; finalizedAt: string | Date | null }): boolean {
  return input.status === "FINALIZED" && input.finalizedAt !== null;
}

export function projectFinalizedOcoOrientation(input: {
  status: "DRAFT" | "FINALIZED" | null;
  finalizedAt: string | Date | null;
  verdict: OrientationInfo["verdict"];
  orientation: string | null;
  observations: string | null;
  reserves: string | null;
  expertName: string | null;
}): OrientationInfo | null {
  if (!isFinalizedOcoProjection(input)) return null;
  const avisDate = input.finalizedAt instanceof Date ? input.finalizedAt.toISOString() : new Date(input.finalizedAt as string).toISOString();
  return {
    transmittedAt: avisDate,
    verdict: input.verdict,
    orientation: input.orientation,
    observations: input.observations,
    reserves: input.reserves,
    avisDate,
    expertName: input.expertName
  };
}

export function canAssignOcoDossier(input: {
  dossierState: string;
  expertActive: boolean;
  expertRole: "EXPERT_OCO";
  activeAssignment: boolean;
  hasFinalizedReview: boolean;
}): boolean {
  return input.dossierState === "TRANSMIS_OCO"
    && input.expertActive
    && input.expertRole === "EXPERT_OCO"
    && !input.activeAssignment
    && !input.hasFinalizedReview;
}

export function canUnassignOcoDossier(input: {
  dossierState: string;
  activeAssignment: boolean;
  hasFinalizedReview: boolean;
}): boolean {
  return input.dossierState === "TRANSMIS_OCO"
    && input.activeAssignment
    && !input.hasFinalizedReview;
}

export function canWriteOcoReview(input: {
  role: BackofficeRole;
  permissions: readonly Permission[];
  assigned: boolean;
  dossierState: string;
  reviewStatus: "DRAFT" | "FINALIZED" | null;
}): boolean {
  return input.role === "EXPERT_OCO"
    && input.permissions.includes("oco.reviews.write")
    && input.assigned
    && input.dossierState === "TRANSMIS_OCO"
    && input.reviewStatus !== "FINALIZED";
}
