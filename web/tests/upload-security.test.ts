import { afterEach, describe, expect, it, vi } from "vitest";
import { csvCell } from "@/app/backoffice/reports/[id]/csv/route";
import { documentAad, decryptDocument, encryptDocument } from "@/lib/server/document-storage";
import { isSafeContentLength, isTrustedUploadOrigin, uploadFieldsSchema } from "@/lib/server/validation";

const documentId = "00000000-0000-4000-8000-000000000001";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sécurité des sorties et des téléversements", () => {
  it("neutralise les formules CSV et les caractères de contrôle en début de cellule", () => {
    expect(csvCell("=CMD('x')")).toBe("'=CMD('x')");
    expect(csvCell("+1")).toBe("'+1");
    expect(csvCell("-1")).toBe("'-1");
    expect(csvCell("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(csvCell("\t=x")).toBe("'\t=x");
    expect(csvCell("\n=x")).toBe("\"'\n=x\"");
    expect(csvCell("  =CMD('x')")).toBe("'  =CMD('x')");
    expect(csvCell(" \t+1")).toBe("' \t+1");
  });

  it("exige une origine et une longueur bornée", () => {
    expect(isTrustedUploadOrigin("https://example.org", "https://example.org,https://other.org")).toBe(true);
    expect(isTrustedUploadOrigin("https://evil.example", "https://example.org")).toBe(false);
    expect(isTrustedUploadOrigin(null, "https://example.org")).toBe(false);
    expect(isSafeContentLength("1", 10)).toBe(true);
    expect(isSafeContentLength("0", 10)).toBe(false);
    expect(isSafeContentLength("65537", 0)).toBe(false);
    expect(isSafeContentLength("01", 10)).toBe(false);
    expect(isSafeContentLength("abc", 10)).toBe(false);
    expect(isSafeContentLength(null, 10)).toBe(false);
  });

  it("lie les nouveaux documents à leur identifiant et à leur version", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:password@localhost:5432/ea_pomra");
    vi.stubEnv("BACKOFFICE_SESSION_SECRET", "a-secure-session-secret-1234567890");
    vi.stubEnv("BACKOFFICE_DOCUMENT_ENCRYPTION_KEY", "a-secure-document-encryption-key-1234567890");
    const encrypted = encryptDocument(Buffer.from("secret"), documentAad(documentId, 4));
    expect(decryptDocument(encrypted, documentAad(documentId, 4)).toString()).toBe("secret");
    expect(() => decryptDocument(encrypted, documentAad(documentId, 5))).toThrow();
  });

  it("rend l'identifiant et la version du document obligatoires", () => {
    expect(uploadFieldsSchema.safeParse({ role: "ANTENNE", dossierId: documentId, documentId, expectedVersion: 1 }).success).toBe(true);
    expect(uploadFieldsSchema.safeParse({ role: "ANTENNE", dossierId: documentId, expectedVersion: 1 }).success).toBe(false);
    expect(uploadFieldsSchema.safeParse({ role: "ANTENNE", dossierId: documentId, documentId, expectedVersion: 0 }).success).toBe(false);
  });
});
