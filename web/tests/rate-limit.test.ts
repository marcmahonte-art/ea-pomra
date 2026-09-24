import { describe, expect, it } from "vitest";
import { extractTrustedClientIp, isRateLimited, loginRateKey, mutationRateKey } from "@/lib/server/rate-limit";
import type { BackofficeScope } from "@/lib/backoffice-types";

const scope: BackofficeScope = {
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

describe("règles pures de limitation", () => {
  it("ignore un en-tête non approuvé et ferme la production", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.8" });
    expect(extractTrustedClientIp(headers, [], false)).toBe("unknown");
    expect(() => extractTrustedClientIp(headers, [], true)).toThrow();
    expect(extractTrustedClientIp(headers, ["x-forwarded-for"], false)).toBe("203.0.113.8");
  });

  it("applique la fenêtre et produit des clés sans PII", () => {
    const now = new Date("2026-09-24T10:00:30.000Z");
    expect(isRateLimited(5, 5, 60, now).allowed).toBe(true);
    expect(isRateLimited(6, 5, 60, now).allowed).toBe(false);
    expect(loginRateKey("203.0.113.8", "user@example.org", "BEC")).not.toContain("user@example.org");
    expect(mutationRateKey(scope, "dossier.transition", "203.0.113.8")).toHaveLength(64);
  });
});
