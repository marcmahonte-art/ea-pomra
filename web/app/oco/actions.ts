"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { getAuthenticatedScope, hasPermission } from "@/lib/backoffice-session";
import { actionError, actionSuccess, type ActionState } from "@/lib/action-state";
import { saveOcoReview } from "@/lib/server/oco-repository";
import { ocoReviewInputSchema } from "@/lib/server/validation";
import { enforceMutationRateLimit } from "@/app/backoffice/actions";

export type OcoActionState = ActionState;

export async function saveOcoReviewAction(
  _previousState: OcoActionState,
  formData: FormData
): Promise<OcoActionState> {
  const parsed = ocoReviewInputSchema.safeParse({
    dossierId: formData.get("dossierId"),
    version: formData.get("version"),
    verdict: formData.get("verdict") || null,
    orientation: formData.get("orientation") ?? "",
    analysis: formData.get("analysis") ?? "",
    observations: formData.get("observations") ?? "",
     reserves: formData.get("reserves") ?? "",
     confirmation: formData.get("confirmation") ?? "",
     finalize: formData.get("finalize") ?? false
  });
  if (!parsed.success) return actionError("La demande OCO est invalide.");
  try {
    const scope = await getAuthenticatedScope("EXPERT_OCO");
    if (scope.isDemo) return actionError("La démonstration est en lecture seule.");
    if (!hasPermission(scope, parsed.data.finalize ? "oco.reviews.finalize" : "oco.reviews.write")) return actionError("Action non autorisée.");
    const rate = await enforceMutationRateLimit(scope, parsed.data.finalize ? "oco.review.finalize" : "oco.review.write");
    if (!rate.allowed) return actionError("Trop de demandes. Réessayez plus tard.");
    await saveOcoReview(scope, parsed.data);
    revalidatePath(`/oco/dossiers/${parsed.data.dossierId}`);
    revalidatePath("/oco/dossiers", "page");
    revalidatePath("/oco/avis", "page");
    revalidatePath("/oco", "page");
    revalidatePath("/oco/historique", "page");
    return actionSuccess(parsed.data.finalize ? "Avis OCO finalisé." : "Brouillon enregistré.");
  } catch (error) {
    unstable_rethrow(error);
    return actionError("L'avis OCO n'a pas été enregistré.");
  }
}

export async function validateOcoFinalization(input: unknown): Promise<z.infer<typeof ocoReviewInputSchema> | null> {
  const parsed = ocoReviewInputSchema.safeParse(input);
  return parsed.success && parsed.data.finalize ? parsed.data : null;
}
