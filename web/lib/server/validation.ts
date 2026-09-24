import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(256),
  role: z.enum(["ANTENNE", "BEC", "EXPERT_OCO", "RESPONSABLE_PAP"])
});

export const OCO_FINALIZATION_CONFIRMATION = "FINALISER_L_AVIS_OCO";

export const papAlertInputSchema = z.object({
  dossierId: z.string().uuid(),
  dossierVersion: z.coerce.number().int().positive(),
  level: z.enum(["INFO", "ATTENTION", "URGENT"]),
  subject: z.string().trim().min(3).max(200)
});

export const papAlertStatusSchema = z.object({
  alertId: z.string().uuid(),
  version: z.coerce.number().int().positive(),
  status: z.enum(["OPEN", "ACKNOWLEDGED", "CLOSED"])
});

export const papInterventionInputSchema = z.object({
  dossierId: z.string().uuid(),
  dossierVersion: z.coerce.number().int().positive(),
  interventionDate: z.string().date(),
  interventionType: z.string().trim().min(2).max(100),
  objective: z.string().trim().min(3).max(2000),
  observation: z.string().trim().min(3).max(4000),
  nextAction: z.string().trim().max(2000).default("")
});

export const papInterventionStatusSchema = z.object({
  interventionId: z.string().uuid(),
  version: z.coerce.number().int().positive(),
  status: z.enum(["DONE", "CANCELLED"])
});

export const papCaseStatusSchema = z.object({
  caseId: z.string().uuid(),
  version: z.coerce.number().int().positive(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"])
});

export const ocoReviewInputSchema = z.object({
  dossierId: z.string().uuid(),
  version: z.coerce.number().int().positive(),
  verdict: z.enum(["FAVORABLE", "SOUS_RESERVE", "DEFAVORABLE"]).nullable().optional().default(null),
  orientation: z.string().trim().max(200).optional().default(""),
  analysis: z.string().trim().max(10000).optional().default(""),
  observations: z.string().trim().max(10000).optional().default(""),
  reserves: z.string().trim().max(10000).optional().default(""),
  confirmation: z.string().optional().default(""),
  finalize: z.preprocess((value) => value === true || value === "true" || value === "1" || value === "on", z.boolean()).default(false)
 }).superRefine((value, context) => {
   if (!value.finalize) return;
   if (value.confirmation !== OCO_FINALIZATION_CONFIRMATION) {
     context.addIssue({ code: "custom", path: ["confirmation"], message: "Confirmation de finalisation requise" });
   }
   if (!value.verdict) {
    context.addIssue({ code: "custom", path: ["verdict"], message: "Verdict obligatoire" });
  }
  if (!value.analysis || value.analysis.length < 10) {
    context.addIssue({ code: "custom", path: ["analysis"], message: "Analyse technique trop courte" });
  }
  if (!value.observations || value.observations.length < 10) {
    context.addIssue({ code: "custom", path: ["observations"], message: "Observations trop courtes" });
  }
  if ((value.verdict === "FAVORABLE" || value.verdict === "SOUS_RESERVE") && !value.orientation) {
    context.addIssue({ code: "custom", path: ["orientation"], message: "Orientation obligatoire" });
  }
  if ((value.verdict === "SOUS_RESERVE" || value.verdict === "DEFAVORABLE") && !value.reserves) {
    context.addIssue({ code: "custom", path: ["reserves"], message: "Réserves obligatoires" });
  }
});

export const transitionDossierSchema = z.object({
  dossierId: z.string().uuid(),
  toState: z.enum([
    "RECU",
    "EN_VERIFICATION",
    "INCOMPLET",
    "TRANSMIS_OCO",
    "AVIS_RECU",
    "A_VALIDER",
    "VALIDE",
    "EN_MOBILITE",
    "EN_SUIVI",
    "DIPLOME",
    "REJETE"
  ]),
  version: z.coerce.number().int().positive(),
  comment: z.string().trim().max(2000).optional().default("")
});

export const documentDecisionSchema = z
  .object({
    dossierId: z.string().uuid(),
    documentId: z.string().uuid(),
    decision: z.enum(["VALIDE", "REFUSE", "REQUIER_NOUVEAU"]),
    version: z.coerce.number().int().positive(),
    comment: z.string().trim().max(2000).optional().default("")
  })
  .superRefine((value, context) => {
    if ((value.decision === "REFUSE" || value.decision === "REQUIER_NOUVEAU") && value.comment.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["comment"],
        message: "Commentaire obligatoire"
      });
    }
  });

export const uploadFieldsSchema = z.object({
  role: z.enum(["ANTENNE", "BEC"]),
  dossierId: z.string().uuid(),
  documentId: z.string().uuid(),
  expectedVersion: z.coerce.number().int().positive()
});

export const UPLOAD_FORM_OVERHEAD_BYTES = 64 * 1024;

export function isSafeContentLength(value: string | null, maxBytes: number): value is string {
  if (!value || !/^(?:[1-9]\d*)$/.test(value)) return false;
  const length = Number(value);
  return Number.isSafeInteger(length) && length > 0 && length <= maxBytes + UPLOAD_FORM_OVERHEAD_BYTES;
}

export function isTrustedUploadOrigin(requestOrigin: string | null, configured: string | undefined): boolean {
  if (!requestOrigin || !configured) return false;
  const allowed = configured.split(",").map((value) => value.trim()).filter(Boolean);
  return allowed.some((value) => {
    try {
      return new URL(value).origin === requestOrigin;
    } catch {
      return false;
    }
  });
}

export const reportRequestSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2200),
  quarter: z.coerce.number().int().min(1).max(4),
  country: z.enum(["SN", "CI", "CM", "GA", "BJ", "TG", "CG", "CD", "all"]).optional().default("all"),
  program: z.string().trim().min(1).max(200).optional().default("all"),
  formation: z.string().trim().min(1).max(200).optional().default("all")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type OcoReviewInput = z.infer<typeof ocoReviewInputSchema>;
export type TransitionDossierInput = z.infer<typeof transitionDossierSchema>;
export type DocumentDecisionInput = z.infer<typeof documentDecisionSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
