import { describe, expect, it } from "vitest";
import { currentPeriod, isTaskOverdue, previousPeriod, referenceDateForScope } from "@/lib/server/temporal";
import type { BackofficeScope } from "@/lib/backoffice-types";

const productionScope: BackofficeScope = {
  userId: "00000000-0000-4000-8000-000000000001",
  antennaId: null,
  role: "BEC",
  countryCode: null,
  country: null,
  flag: null,
  antennaCity: null,
  userName: "Test",
  userTitle: "Test",
  permissions: [],
  isDemo: false
};

describe("temporel de production", () => {
  it("injecte la date UTC et calcule les périodes", () => {
    const now = new Date("2027-01-15T08:00:00.000Z");
    expect(referenceDateForScope(productionScope, now)).toEqual(now);
    expect(currentPeriod(now)).toEqual({ year: 2027, quarter: 1, label: "1e trimestre 2027" });
    expect(previousPeriod(now)).toEqual({ year: 2026, quarter: 4, label: "4e trimestre 2026" });
  });

  it("retarde une tâche ouverte selon due_at uniquement", () => {
    const now = new Date("2026-09-24T10:00:00.000Z");
    expect(isTaskOverdue(new Date("2026-09-23T10:00:00.000Z"), now, "OPEN")).toBe(true);
    expect(isTaskOverdue(new Date("2026-09-25T10:00:00.000Z"), now, "IN_PROGRESS")).toBe(false);
    expect(isTaskOverdue(new Date("2026-09-23T10:00:00.000Z"), now, "DONE")).toBe(false);
  });
});
