import { describe, expect, it } from "vitest";
import {
  documentDecisionSchema,
  loginSchema,
  reportRequestSchema,
  transitionDossierSchema
} from "@/lib/server/validation";

describe("validation des entrées", () => {
  it("normalise les identifiants et limite les champs métier", () => {
    expect(
      loginSchema.parse({ email: " USER@EXAMPLE.ORG ", password: "secret", role: "BEC" })
    ).toEqual({ email: "user@example.org", password: "secret", role: "BEC" });
    expect(transitionDossierSchema.safeParse({ dossierId: "not-a-uuid", toState: "VALIDE", version: 1 }).success).toBe(false);
    expect(documentDecisionSchema.safeParse({ dossierId: "not-a-uuid", documentId: "not-a-uuid", decision: "REFUSE", version: 1 }).success).toBe(false);
  });

  it("exige un commentaire pour les décisions restrictives", () => {
    const base = {
      dossierId: "00000000-0000-4000-8000-000000000001",
      documentId: "00000000-0000-4000-8000-000000000002",
      version: 1
    };
    expect(documentDecisionSchema.safeParse({ ...base, decision: "VALIDE", comment: "" }).success).toBe(true);
    expect(documentDecisionSchema.safeParse({ ...base, decision: "REFUSE", comment: "" }).success).toBe(false);
    expect(documentDecisionSchema.safeParse({ ...base, decision: "REQUIER_NOUVEAU", comment: "Nouvelle pièce" }).success).toBe(true);
  });

  it("borne les périodes de rapport", () => {
    expect(reportRequestSchema.safeParse({ year: 2026, quarter: 4 }).success).toBe(true);
    expect(reportRequestSchema.safeParse({ year: 2026, quarter: 0 }).success).toBe(false);
    expect(reportRequestSchema.safeParse({ year: 2201, quarter: 1 }).success).toBe(false);
  });
});
