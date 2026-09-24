import { describe, expect, it } from "vitest";
import { actionError, actionSuccess, idleActionState } from "@/lib/action-state";

describe("état des actions", () => {
  it("représente les résultats discriminés sans avaler les mutations", () => {
    expect(idleActionState.status).toBe("idle");
    expect(actionSuccess("Enregistré")).toEqual({ status: "success", message: "Enregistré" });
    expect(actionSuccess("Rapport", "uuid")).toEqual({ status: "success", message: "Rapport", reportId: "uuid" });
    expect(actionError("Échec générique")).toEqual({ status: "error", message: "Échec générique" });
  });
});
