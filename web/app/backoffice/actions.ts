"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import {
  authenticateBackofficeUser,
  createBackofficeSession,
  destroyBackofficeSession,
  getAuthenticatedScope
} from "@/lib/backoffice-session";
import {
  decideDocument as decideDocumentRepository,
  generateReportSnapshot,
  transitionDossier as transitionDossierRepository
} from "@/lib/server/backoffice-repository";
import {
  consumeRateLimit,
  extractTrustedClientIp
} from "@/lib/server/rate-limit";
import { getServerConfig } from "@/lib/server/config";
import {
  documentDecisionSchema,
  loginSchema,
  reportRequestSchema,
  transitionDossierSchema
} from "@/lib/server/validation";
import type { BackofficeScope } from "@/lib/backoffice-types";
import { actionError, actionSuccess, type ActionState } from "@/lib/action-state";

export type LoginState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export type MutationState = ActionState;

const roleSchema = z.enum(["ANTENNE", "BEC", "EXPERT_OCO"]);

function errorCode(error: unknown): string {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : "UNKNOWN";
}

export async function requestClientIp(): Promise<string> {
  const requestHeaders = await headers();
  return extractTrustedClientIp(
    requestHeaders,
    getServerConfig().trustedProxyHeaders,
    process.env.NODE_ENV === "production"
  );
}

export async function enforceMutationRateLimit(
  scope: BackofficeScope,
  action: string
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  if (scope.isDemo) return { allowed: false, retryAfterSeconds: 0 };
  return consumeRateLimit("mutation", [scope.userId ?? "", action, scope.role, scope.countryCode ?? "", await requestClientIp()]);
}

export async function login(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role")
  });
  if (!parsed.success) return { status: "error", message: "Identifiants invalides." };

  try {
    const ip = await requestClientIp();
    const limit = await consumeRateLimit("login", [ip, parsed.data.email, parsed.data.role]);
    if (!limit.allowed) {
      return { status: "error", message: "Trop de tentatives. Réessayez plus tard." };
    }
    const user = await authenticateBackofficeUser(parsed.data.email, parsed.data.password, parsed.data.role);
    if (!user) return { status: "error", message: "Identifiants invalides." };
    const requestHeaders = await headers();
    await createBackofficeSession(user.userId, user.role, requestHeaders.get("user-agent") ?? undefined);
    revalidatePath("/backoffice/login");
    redirect(user.role === "BEC" ? "/bec" : user.role === "EXPERT_OCO" ? "/oco" : "/antenne");
  } catch (error) {
    unstable_rethrow(error);
    console.error("Échec de la connexion back-office", { code: errorCode(error) });
    return { status: "error", message: "Connexion impossible. Réessayez plus tard." };
  }
}

export async function logout(): Promise<void> {
  const requestHeaders = await headers();
  await destroyBackofficeSession(requestHeaders.get("user-agent") ?? undefined);
  revalidatePath("/", "layout");
  redirect("/backoffice/login");
}

export async function transitionDossier(
  _previousState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const role = roleSchema.safeParse(formData.get("role"));
  const parsed = transitionDossierSchema.safeParse({
    dossierId: formData.get("dossierId"),
    toState: formData.get("toState"),
    version: formData.get("version"),
    comment: formData.get("comment") ?? undefined
  });
  if (!role.success || !parsed.success) {
    return { status: "error", message: "La demande est invalide." };
  }

  try {
    const scope = await getAuthenticatedScope(role.data);
    if (scope.isDemo) return { status: "error", message: "La démonstration est en lecture seule." };
    const rate = await enforceMutationRateLimit(scope, "dossier.transition");
    if (!rate.allowed) return { status: "error", message: "Trop de demandes. Réessayez plus tard." };
    await transitionDossierRepository(scope, parsed.data.dossierId, parsed.data.toState, parsed.data.version, parsed.data.comment);
    revalidatePath(`/antenne/dossiers/${parsed.data.dossierId}`);
    revalidatePath(`/bec/dossiers/${parsed.data.dossierId}`);
    revalidatePath("/antenne/dossiers", "page");
    revalidatePath("/bec/dossiers", "page");
    revalidatePath("/bec/validation", "page");
    return actionSuccess("Statut du dossier mis à jour.");
  } catch (error) {
    unstable_rethrow(error);
    console.error("Échec de la transition dossier", { code: errorCode(error) });
    return actionError("La mise à jour a échoué. Rechargez la page.");
  }
}

export async function decideDocument(
  _previousState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const role = roleSchema.safeParse(formData.get("role"));
  const parsed = documentDecisionSchema.safeParse({
    dossierId: formData.get("dossierId"),
    documentId: formData.get("documentId"),
    decision: formData.get("decision"),
    version: formData.get("version"),
    comment: formData.get("comment") ?? undefined
  });
  if (!role.success || !parsed.success) {
    return { status: "error", message: "La décision ou son commentaire est invalide." };
  }

  try {
    const scope = await getAuthenticatedScope(role.data);
    if (scope.isDemo) return { status: "error", message: "La démonstration est en lecture seule." };
    const rate = await enforceMutationRateLimit(scope, "document.decision");
    if (!rate.allowed) return { status: "error", message: "Trop de demandes. Réessayez plus tard." };
    await decideDocumentRepository(scope, parsed.data.dossierId, parsed.data.documentId, parsed.data.decision, parsed.data.version, parsed.data.comment);
    revalidatePath(`/antenne/dossiers/${parsed.data.dossierId}`);
    revalidatePath(`/bec/dossiers/${parsed.data.dossierId}`);
    revalidatePath("/antenne/documents", "page");
    return actionSuccess("Décision enregistrée.");
  } catch (error) {
    unstable_rethrow(error);
    console.error("Échec de la décision documentaire", { code: errorCode(error) });
    return actionError("La décision n'a pas été enregistrée.");
  }
}

export async function generateReport(
  _previousState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const role = roleSchema.safeParse(formData.get("role"));
  const parsed = reportRequestSchema.safeParse({
    year: formData.get("year"),
    quarter: formData.get("quarter"),
    country: formData.get("country") ?? "all",
    program: formData.get("program") ?? "all",
    formation: formData.get("formation") ?? "all"
  });
  if (!role.success || !parsed.success) {
    return { status: "error", message: "La période demandée est invalide." };
  }

  try {
    const scope = await getAuthenticatedScope(role.data);
    if (scope.isDemo) return { status: "error", message: "La démonstration est en lecture seule." };
    const rate = await enforceMutationRateLimit(scope, "report.generate");
    if (!rate.allowed) return { status: "error", message: "Trop de demandes. Réessayez plus tard." };
    const report = await generateReportSnapshot(scope, parsed.data.year, parsed.data.quarter, {
      country: parsed.data.country,
      program: parsed.data.program,
      formation: parsed.data.formation
    });
    revalidatePath("/antenne/rapports", "page");
    revalidatePath("/bec/rapports", "page");
    return actionSuccess("Rapport généré.", report.id);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Échec de la génération du rapport", { code: errorCode(error) });
    return actionError("La génération du rapport a échoué.");
  }
}
