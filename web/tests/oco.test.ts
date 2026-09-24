import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ROLE_PERMISSIONS } from "@/lib/backoffice-session";
import { ocoReviewInputSchema, OCO_FINALIZATION_CONFIRMATION, uploadFieldsSchema } from "@/lib/server/validation";
import { canTransition } from "@/lib/server/workflow";
import { canAssignOcoDossier, canFinalizeOcoReview, canUnassignOcoDossier, canWriteOcoReview, isFinalizedOcoProjection, projectFinalizedOcoOrientation } from "@/lib/server/oco-workflow";
import { dossierHref, rootHref } from "@/lib/backoffice-nav";

const dossierId = "00000000-0000-4000-8000-000000000001";
const base = { dossierId, version: 1, verdict: "FAVORABLE" as const, orientation: " Licence", analysis: "Analyse technique suffisamment détaillée.", observations: "Observations suffisamment détaillées.", reserves: "", confirmation: OCO_FINALIZATION_CONFIRMATION, finalize: true };

describe("permissions et workflow OCO", () => {
  it("exclut les événements PAP de l’historique OCO", () => {
    const source = readFileSync(new URL("../lib/server/oco-repository.ts", import.meta.url), "utf8");
    expect(source).toContain("WHERE (${PAP_RESOURCE_TYPE_FILTER_SQL})");
    expect(source).toContain("PAP_RESOURCE_TYPE_FILTER_SQL");
  });


  it("limite les permissions OCO aux lectures et à l'avis affecté", () => {
    expect(ROLE_PERMISSIONS.EXPERT_OCO).toEqual(["dossiers.read", "documents.read", "oco.read", "oco.reviews.read", "oco.reviews.write", "oco.reviews.finalize", "history.read"]);
    expect(ROLE_PERMISSIONS.EXPERT_OCO).not.toContain("dossiers.validate");
    expect(ROLE_PERMISSIONS.EXPERT_OCO).not.toContain("documents.verify");
  });

  it("autorise uniquement la transition OCO affectée", () => {
    expect(canTransition("TRANSMIS_OCO", "AVIS_RECU", "EXPERT_OCO", ["oco.reviews.finalize"])).toBe(true);
    expect(canTransition("TRANSMIS_OCO", "AVIS_RECU", "ANTENNE", ["dossiers.transmit"])).toBe(false);
    expect(canTransition("AVIS_RECU", "A_VALIDER", "EXPERT_OCO", ["oco.reviews.finalize"])).toBe(false);
  });

  it("refuse la finalisation sans permission, affectation ou dossier transmit", () => {
    const permissions = ROLE_PERMISSIONS.EXPERT_OCO;
    expect(canFinalizeOcoReview({ role: "EXPERT_OCO", permissions, assigned: true, dossierState: "TRANSMIS_OCO", reviewStatus: "DRAFT" })).toBe(true);
    expect(canFinalizeOcoReview({ role: "BEC", permissions, assigned: true, dossierState: "TRANSMIS_OCO", reviewStatus: "DRAFT" })).toBe(false);
    expect(canFinalizeOcoReview({ role: "EXPERT_OCO", permissions, assigned: false, dossierState: "TRANSMIS_OCO", reviewStatus: "DRAFT" })).toBe(false);
    expect(canFinalizeOcoReview({ role: "EXPERT_OCO", permissions, assigned: true, dossierState: "TRANSMIS_OCO", reviewStatus: "FINALIZED" })).toBe(false);
  });

  it("bloque l'écriture après finalisation", () => {
    expect(canWriteOcoReview({ role: "EXPERT_OCO", permissions: ROLE_PERMISSIONS.EXPERT_OCO, assigned: true, dossierState: "TRANSMIS_OCO", reviewStatus: "FINALIZED" })).toBe(false);
  });

  it("oriente la navigation OCO et refuse son upload", () => {
    expect(rootHref("EXPERT_OCO")).toBe("/oco");
    expect(dossierHref("EXPERT_OCO", dossierId)).toBe(`/oco/dossiers/${dossierId}`);
    expect(uploadFieldsSchema.safeParse({ role: "EXPERT_OCO", dossierId, documentId: dossierId, expectedVersion: 1 }).success).toBe(false);
  });
});

describe("projection et validation OCO", () => {
  it("n'expose un avis OCO que s'il est finalisé avec une date", () => {
    expect(isFinalizedOcoProjection({ status: "FINALIZED", finalizedAt: "2026-09-24T10:00:00.000Z" })).toBe(true);
    expect(isFinalizedOcoProjection({ status: "DRAFT", finalizedAt: null })).toBe(false);
     expect(isFinalizedOcoProjection({ status: "FINALIZED", finalizedAt: null })).toBe(false);
     expect(projectFinalizedOcoOrientation({ status: "DRAFT", finalizedAt: "2026-09-24T10:00:00.000Z", verdict: "FAVORABLE", orientation: "Licence", observations: "Observation", reserves: null, expertName: "Expert" })).toBeNull();
     expect(projectFinalizedOcoOrientation({ status: "FINALIZED", finalizedAt: "2026-09-24T10:00:00.000Z", verdict: "FAVORABLE", orientation: "Licence", observations: "Observation", reserves: null, expertName: "Expert" })).toMatchObject({ orientation: "Licence", observations: "Observation", reserves: null, avisDate: "2026-09-24T10:00:00.000Z" });
  });

  it("applique les règles pures d'affectation et de réaffectation", () => {
    expect(canAssignOcoDossier({ dossierState: "TRANSMIS_OCO", expertActive: true, expertRole: "EXPERT_OCO", activeAssignment: false, hasFinalizedReview: false })).toBe(true);
    expect(canAssignOcoDossier({ dossierState: "TRANSMIS_OCO", expertActive: true, expertRole: "EXPERT_OCO", activeAssignment: false, hasFinalizedReview: true })).toBe(false);
    expect(canAssignOcoDossier({ dossierState: "RECU", expertActive: true, expertRole: "EXPERT_OCO", activeAssignment: false, hasFinalizedReview: false })).toBe(false);
    expect(canUnassignOcoDossier({ dossierState: "TRANSMIS_OCO", activeAssignment: true, hasFinalizedReview: false })).toBe(true);
    expect(canUnassignOcoDossier({ dossierState: "TRANSMIS_OCO", activeAssignment: true, hasFinalizedReview: true })).toBe(false);
  });

  it("exige la confirmation exacte avant finalisation", () => {
    expect(ocoReviewInputSchema.safeParse({ ...base, confirmation: "" }).success).toBe(false);
    expect(ocoReviewInputSchema.safeParse({ ...base, confirmation: "OUI" }).success).toBe(false);
    expect(ocoReviewInputSchema.safeParse({ ...base, confirmation: OCO_FINALIZATION_CONFIRMATION }).success).toBe(true);
  });
  it("valide les champs communs et l'orientation des avis favorables", () => {
    expect(ocoReviewInputSchema.safeParse(base).success).toBe(true);
    expect(ocoReviewInputSchema.safeParse({ ...base, orientation: "" }).success).toBe(false);
  });

  it("exige des réserves pour sous réserve et défavorable", () => {
    expect(ocoReviewInputSchema.safeParse({ ...base, verdict: "SOUS_RESERVE", orientation: "Licence", reserves: "" }).success).toBe(false);
    expect(ocoReviewInputSchema.safeParse({ ...base, verdict: "DEFAVORABLE", orientation: "", reserves: "Réserve technique" }).success).toBe(true);
  });

  it("exige une analyse et des observations texturelles à la finalisation", () => {
    expect(ocoReviewInputSchema.safeParse({ ...base, analysis: "court" }).success).toBe(false);
    expect(ocoReviewInputSchema.safeParse({ ...base, observations: "court" }).success).toBe(false);
    expect(ocoReviewInputSchema.safeParse({ ...base, finalize: false, analysis: "", observations: "" }).success).toBe(true);
  });
});
