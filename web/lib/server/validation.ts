import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(256),
  role: z.enum(["ANTENNE", "BEC"])
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
export type TransitionDossierInput = z.infer<typeof transitionDossierSchema>;
export type DocumentDecisionInput = z.infer<typeof documentDecisionSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
