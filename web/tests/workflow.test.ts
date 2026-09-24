import { describe, expect, it } from "vitest";
import {
  assertTransition,
  canTransition,
  DOSSIER_TRANSITIONS,
  getTransition,
  getWorkflowStep,
  isBecValidationState
} from "@/lib/server/workflow";

describe("workflow", () => {
  it("expose des transitions explicites et une étape déduite", () => {
    expect(getTransition("RECU", "EN_VERIFICATION")).toBeDefined();
    expect(getWorkflowStep("A_VALIDER")).toBe("ORIENTATION");
    expect(DOSSIER_TRANSITIONS.every((transition) => transition.from !== transition.to)).toBe(true);
  });

  it("limite la validation BEC à A_VALIDER", () => {
    expect(isBecValidationState("A_VALIDER")).toBe(true);
    expect(isBecValidationState("AVIS_RECU")).toBe(false);
    expect(canTransition("A_VALIDER", "VALIDE", "BEC", ["dossiers.validate"])).toBe(true);
    expect(canTransition("AVIS_RECU", "VALIDE", "BEC", ["dossiers.validate"])).toBe(false);
  });

  it("refuse une permission ou un rôle insuffisant", () => {
    expect(canTransition("A_VALIDER", "REJETE", "BEC", ["dossiers.validate"])).toBe(false);
    expect(() => assertTransition("A_VALIDER", "REJETE", "BEC", ["dossiers.validate"])).toThrow(
      "Transition de dossier refusée"
    );
    expect(canTransition("A_VALIDER", "REJETE", "BEC", ["dossiers.reject"])).toBe(true);
  });

  it("couvre toutes les transitions post-validation", () => {
    expect(canTransition("VALIDE", "EN_MOBILITE", "ANTENNE", ["dossiers.update"])).toBe(true);
    expect(canTransition("EN_MOBILITE", "EN_SUIVI", "ANTENNE", ["dossiers.update"])).toBe(true);
    expect(canTransition("EN_SUIVI", "DIPLOME", "BEC", ["dossiers.validate"])).toBe(true);
    expect(canTransition("EN_SUIVI", "DIPLOME", "ANTENNE", ["dossiers.update"])).toBe(false);
  });
});
