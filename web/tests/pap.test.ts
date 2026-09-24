import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ROLE_PERMISSIONS } from "@/lib/backoffice-session";
import { rootHref } from "@/lib/backoffice-nav";
import { papAlertInputSchema, papAlertStatusSchema, papCaseStatusSchema, papInterventionInputSchema, papInterventionStatusSchema } from "@/lib/server/validation";
import { canTransitionPapAlert, canTransitionPapCase, canTransitionPapIntervention, canWritePapAlert, canWritePapIntervention } from "@/lib/server/pap-workflow";
import { PAP_RESOURCE_TYPE_FILTER_SQL } from "@/lib/server/audit-filters";

const dossierId = "00000000-0000-4000-8000-000000000004";

describe("RBAC et navigation PAP", () => {
  it("limite les permissions PAP aux opérations autorisées", () => {
    expect(ROLE_PERMISSIONS.RESPONSABLE_PAP).toEqual(["pap.read", "pap.alerts.read", "pap.alerts.write", "pap.mentorat.read", "pap.mentorat.write", "history.read", "dossiers.read"]);
    expect(ROLE_PERMISSIONS.RESPONSABLE_PAP).not.toContain("documents.verify");
    expect(ROLE_PERMISSIONS.RESPONSABLE_PAP).not.toContain("dossiers.validate");
    expect(ROLE_PERMISSIONS.RESPONSABLE_PAP).not.toContain("oco.reviews.write");
    expect(ROLE_PERMISSIONS.RESPONSABLE_PAP).not.toContain("exports.run");
  });

  it("filtre les événements PAP des historiques hors PAP", () => {
    const source = readFileSync(new URL("../lib/server/backoffice-repository.ts", import.meta.url), "utf8");
    expect(PAP_RESOURCE_TYPE_FILTER_SQL).toBe("a.resource_type IS NULL OR a.resource_type NOT IN ('PAP_CASE', 'PAP_ALERT', 'PAP_INTERVENTION', 'PAP_ASSIGNMENT')");
    expect(source.match(/PAP_RESOURCE_TYPE_FILTER_SQL/g)).toHaveLength(3);
  });
  it("ne projette pas de champs PAP sensibles dans le repository", () => {
    const source = readFileSync(new URL("../lib/server/pap-repository.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/email|phone|ciphertext|initialization_vector|authentication_tag/);
  });

  it("bloque les créations et transitions sur dossier PAP clôturé", () => {
    const source = readFileSync(new URL("../lib/server/pap-repository.ts", import.meta.url), "utf8");
    expect(source.match(/if \(papCase\.status === "CLOSED"\) throw new Error\("Dossier PAP clôturé"\);/g)).toHaveLength(2);
    expect(source).toContain("if (intervention.case_status === \"CLOSED\") throw new Error(\"Dossier PAP clôturé\");");
    expect(source).toContain("pap.intervention.status_changed");
  });

  it("donne un root PAP distinct", () => {
    expect(rootHref("RESPONSABLE_PAP")).toBe("/pap");
    expect(rootHref("ANTENNE")).toBe("/antenne");
  });
});

describe("validation PAP", () => {
  it("valide les limites des champs d’alerte", () => {
    expect(papAlertInputSchema.safeParse({ dossierId, dossierVersion: 1, level: "URGENT", subject: "Suivi" }).success).toBe(true);
    expect(papAlertInputSchema.safeParse({ dossierId, dossierVersion: 1, level: "URGENT", subject: "" }).success).toBe(false);
    expect(papAlertInputSchema.safeParse({ dossierId, dossierVersion: 1, level: "CRITIQUE", subject: "Suivi" }).success).toBe(false);
  });

  it("valide les champs d’intervention", () => {
    const base = { dossierId, dossierVersion: 1, interventionDate: "2026-09-24", interventionType: "Entretien", objective: "Clarifier le parcours", observation: "Échange effectué", nextAction: "" };
    expect(papInterventionInputSchema.safeParse(base).success).toBe(true);
    expect(papInterventionInputSchema.safeParse({ ...base, observation: "" }).success).toBe(false);
    expect(papInterventionInputSchema.safeParse({ ...base, interventionDate: "24/09/2026" }).success).toBe(false);
  });

  it("valide les versions et statuts des mutations", () => {
    expect(papAlertStatusSchema.safeParse({ alertId: dossierId, version: 1, status: "ACKNOWLEDGED" }).success).toBe(true);
    expect(papAlertStatusSchema.safeParse({ alertId: dossierId, version: 0, status: "ACKNOWLEDGED" }).success).toBe(false);
    expect(papCaseStatusSchema.safeParse({ caseId: dossierId, version: 1, status: "IN_PROGRESS" }).success).toBe(true);
    expect(papInterventionStatusSchema.safeParse({ interventionId: dossierId, version: 1, status: "DONE" }).success).toBe(true);
    expect(papInterventionStatusSchema.safeParse({ interventionId: dossierId, version: 1, status: "PLANNED" }).success).toBe(false);
  });
});

describe("workflow PAP", () => {
  it("autorise les transitions d’alertes et de suivis prévues", () => {
    expect(canTransitionPapAlert("OPEN", "ACKNOWLEDGED")).toBe(true);
    expect(canTransitionPapAlert("OPEN", "CLOSED")).toBe(false);
    expect(canTransitionPapAlert("CLOSED", "OPEN")).toBe(true);
    expect(canTransitionPapCase("OPEN", "IN_PROGRESS")).toBe(true);
    expect(canTransitionPapCase("OPEN", "CLOSED")).toBe(false);
  });

  it("refuse toute écriture hors affectation ou permission", () => {
    expect(canWritePapAlert({ role: "RESPONSABLE_PAP", permissions: ROLE_PERMISSIONS.RESPONSABLE_PAP, assigned: true, status: "OPEN" })).toBe(true);
    expect(canWritePapAlert({ role: "EXPERT_OCO", permissions: ROLE_PERMISSIONS.EXPERT_OCO, assigned: true, status: "OPEN" })).toBe(false);
    expect(canWritePapAlert({ role: "RESPONSABLE_PAP", permissions: ROLE_PERMISSIONS.RESPONSABLE_PAP, assigned: false, status: "OPEN" })).toBe(false);
    expect(canWritePapIntervention({ role: "RESPONSABLE_PAP", permissions: ROLE_PERMISSIONS.RESPONSABLE_PAP, assigned: true, status: "PLANNED" })).toBe(true);
    expect(canWritePapIntervention({ role: "RESPONSABLE_PAP", permissions: ROLE_PERMISSIONS.RESPONSABLE_PAP, assigned: true, status: "DONE" })).toBe(false);
    expect(canTransitionPapIntervention("PLANNED", "DONE")).toBe(true);
    expect(canTransitionPapIntervention("DONE", "PLANNED")).toBe(false);
    expect(canTransitionPapIntervention("CANCELLED", "PLANNED")).toBe(false);
  });
});
