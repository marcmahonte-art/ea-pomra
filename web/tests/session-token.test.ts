import { describe, expect, it } from "vitest";
import {
  createOpaqueToken,
  hashOpaqueToken,
  isOpaqueToken,
  isSessionActive
} from "@/lib/server/session-token";

describe("sessions opaques", () => {
  it("génère un token aléatoire et ne conserve que son empreinte", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();
    const secret = "unit-test-secret-with-enough-entropy";
    expect(first).not.toBe(second);
    expect(isOpaqueToken(first)).toBe(true);
    expect(hashOpaqueToken(first, secret)).toHaveLength(64);
    expect(hashOpaqueToken(first, secret)).not.toBe(first);
  });

  it("refuse une expiration passée et accepte une expiration future", () => {
    expect(isSessionActive(new Date("2026-01-01T00:00:00.000Z"), Date.parse("2026-01-02T00:00:00.000Z"))).toBe(false);
    expect(isSessionActive("2026-01-02T00:00:00.000Z", Date.parse("2026-01-01T00:00:00.000Z"))).toBe(true);
  });
});
