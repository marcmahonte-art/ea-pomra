import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const privateDataFiles = [
  "../lib/data.ts",
  "../lib/parent-data.ts",
  "../lib/backoffice-data.ts"
];

describe("confidentialité des données de démonstration", () => {
  it("ne contient pas les détails PAP sensibles dans les espaces de données", () => {
    for (const path of privateDataFiles) {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      expect(source).not.toContain("N'Guessan");
      expect(source).not.toContain("créneau d'accueil");
      expect(source).not.toContain("Pôle PAP");
    }
  });

  it("conserve les mentions publiques génériques du site", () => {
    const source = readFileSync(new URL("../lib/site.ts", import.meta.url), "utf8");
    expect(source).toContain("Pôle PAP");
  });
});
