"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getAuthenticatedScope, hasPermission } from "@/lib/backoffice-session";
import { actionError, actionSuccess, type ActionState } from "@/lib/action-state";
import { enforceMutationRateLimit } from "@/app/backoffice/actions";
import { createPapAlert, createPapIntervention, updatePapAlert, updatePapCaseStatus, updatePapInterventionStatus } from "@/lib/server/pap-repository";
import { papAlertInputSchema, papAlertStatusSchema, papCaseStatusSchema, papInterventionInputSchema, papInterventionStatusSchema } from "@/lib/server/validation";

export type PapActionState = ActionState;

async function papScope(permission: "pap.alerts.write" | "pap.mentorat.write") {
  const scope = await getAuthenticatedScope("RESPONSABLE_PAP");
  if (scope.isDemo) return { scope, error: "La démonstration est en lecture seule." as const };
  if (!hasPermission(scope, permission)) return { scope, error: "Action non autorisée." as const };
  return { scope, error: null };
}

export async function createPapAlertAction(_previousState: PapActionState, formData: FormData): Promise<PapActionState> {
  const parsed = papAlertInputSchema.safeParse({ dossierId: formData.get("dossierId"), dossierVersion: formData.get("dossierVersion"), level: formData.get("level"), subject: formData.get("subject") });
  if (!parsed.success) return actionError("La demande d’alerte est invalide.");
  try {
    const auth = await papScope("pap.alerts.write");
    if (auth.error) return actionError(auth.error);
    const rate = await enforceMutationRateLimit(auth.scope, "pap.alert.create");
    if (!rate.allowed) return actionError("Trop de demandes. Réessayez plus tard.");
    await createPapAlert(auth.scope, parsed.data);
    revalidatePath("/pap", "page");
    revalidatePath("/pap/alertes", "page");
    return actionSuccess("Alerte PAP créée.");
  } catch (error) {
    unstable_rethrow(error);
    return actionError("L’alerte PAP n’a pas été créée.");
  }
}

export async function updatePapAlertAction(_previousState: PapActionState, formData: FormData): Promise<PapActionState> {
  const parsed = papAlertStatusSchema.safeParse({ alertId: formData.get("alertId"), version: formData.get("version"), status: formData.get("status") });
  if (!parsed.success) return actionError("La transition d’alerte est invalide.");
  try {
    const auth = await papScope("pap.alerts.write");
    if (auth.error) return actionError(auth.error);
    const rate = await enforceMutationRateLimit(auth.scope, "pap.alert.update");
    if (!rate.allowed) return actionError("Trop de demandes. Réessayez plus tard.");
    await updatePapAlert(auth.scope, parsed.data);
    revalidatePath("/pap/alertes", "page");
    revalidatePath("/pap/historique", "page");
    return actionSuccess("Statut de l’alerte mis à jour.");
  } catch (error) {
    unstable_rethrow(error);
    return actionError("Le statut de l’alerte n’a pas été mis à jour.");
  }
}

export async function createPapInterventionAction(_previousState: PapActionState, formData: FormData): Promise<PapActionState> {
  const parsed = papInterventionInputSchema.safeParse({ dossierId: formData.get("dossierId"), dossierVersion: formData.get("dossierVersion"), interventionDate: formData.get("interventionDate"), interventionType: formData.get("interventionType"), objective: formData.get("objective"), observation: formData.get("observation"), nextAction: formData.get("nextAction") ?? "" });
  if (!parsed.success) return actionError("La demande d’intervention est invalide.");
  try {
    const auth = await papScope("pap.mentorat.write");
    if (auth.error) return actionError(auth.error);
    const rate = await enforceMutationRateLimit(auth.scope, "pap.intervention.create");
    if (!rate.allowed) return actionError("Trop de demandes. Réessayez plus tard.");
    await createPapIntervention(auth.scope, parsed.data);
    revalidatePath("/pap", "page");
    revalidatePath("/pap/mentorat", "page");
    revalidatePath("/pap/historique", "page");
    return actionSuccess("Intervention enregistrée.");
  } catch (error) {
    unstable_rethrow(error);
    return actionError("L’intervention n’a pas été enregistrée.");
  }
}

export async function updatePapInterventionStatusAction(_previousState: PapActionState, formData: FormData): Promise<PapActionState> {
  const parsed = papInterventionStatusSchema.safeParse({ interventionId: formData.get("interventionId"), version: formData.get("version"), status: formData.get("status") });
  if (!parsed.success) return actionError("La transition d’intervention est invalide.");
  try {
    const auth = await papScope("pap.mentorat.write");
    if (auth.error) return actionError(auth.error);
    const rate = await enforceMutationRateLimit(auth.scope, "pap.intervention.update");
    if (!rate.allowed) return actionError("Trop de demandes. Réessayez plus tard.");
    await updatePapInterventionStatus(auth.scope, parsed.data);
    revalidatePath("/pap/mentorat", "page");
    revalidatePath("/pap/historique", "page");
    return actionSuccess("Statut de l’intervention mis à jour.");
  } catch (error) {
    unstable_rethrow(error);
    return actionError("Le statut de l’intervention n’a pas été mis à jour.");
  }
}

export async function updatePapCaseStatusAction(_previousState: PapActionState, formData: FormData): Promise<PapActionState> {
  const parsed = papCaseStatusSchema.safeParse({ caseId: formData.get("caseId"), version: formData.get("version"), status: formData.get("status") });
  if (!parsed.success) return actionError("La transition de suivi est invalide.");
  try {
    const auth = await papScope("pap.mentorat.write");
    if (auth.error) return actionError(auth.error);
    const rate = await enforceMutationRateLimit(auth.scope, "pap.case.status");
    if (!rate.allowed) return actionError("Trop de demandes. Réessayez plus tard.");
    await updatePapCaseStatus(auth.scope, parsed.data);
    revalidatePath("/pap", "page");
    revalidatePath("/pap/mentorat", "page");
    revalidatePath("/pap/historique", "page");
    return actionSuccess("Suivi PAP mis à jour.");
  } catch (error) {
    unstable_rethrow(error);
    return actionError("Le suivi PAP n’a pas été mis à jour.");
  }
}
