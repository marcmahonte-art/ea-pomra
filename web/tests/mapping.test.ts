import { afterEach, describe, expect, it, vi } from "vitest";
import { computeValidationQueue, getActivityForScope, getAllScoped } from "@/lib/backoffice-data";
import type { BackofficeScope } from "@/lib/backoffice-types";

const scope: BackofficeScope = {
  userId: null,
  antennaId: "demo-antenne-senegal",
  role: "BEC",
  countryCode: null,
  country: null,
  flag: null,
  antennaCity: null,
  userName: "Test",
  userTitle: "Test",
  permissions: ["dossiers.read", "dossiers.validate"],
  isDemo: true
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("mapping et liens", () => {
  it("attache chaque événement à son dossier", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("BACKOFFICE_ALLOW_DEMO", "true");
    const dossiers = getAllScoped(scope);
    const events = getActivityForScope(scope, dossiers);
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((event) => typeof event.dossierId === "string" && event.dossierId.length > 0)).toBe(true);
  });

  it("ne met que A_VALIDER dans la file BEC", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("BACKOFFICE_ALLOW_DEMO", "true");
    const dossiers = getAllScoped(scope);
    const rows = computeValidationQueue(scope, undefined, dossiers);
    expect(rows.every((row) => row.state === "A_VALIDER")).toBe(true);
  });
});
