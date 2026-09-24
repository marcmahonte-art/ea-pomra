import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(new URL("../db/migrations/004_pap_production.sql", import.meta.url), "utf8");

describe("migration PAP", () => {
  it("conserve les compatibilités des scopes Antenne de 003", () => {
    expect(migration).toContain("role = 'ANTENNE' AND country_code IS NOT NULL AND country_name IS NOT NULL AND antenna_id IS NOT NULL AND antenna_city IS NOT NULL");
    expect(migration).not.toContain("role = 'ANTENNE' AND country_code IS NOT NULL AND country_name IS NOT NULL AND country_flag IS NOT NULL");
  });
});
