import { describe, expect, it } from "vitest";
import { sanitizeDocumentName, validateDocumentUpload } from "@/lib/server/document-storage";

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe("stockage documentaire privé", () => {
  it("neutralise les noms et vérifie taille et signature MIME", () => {
    expect(sanitizeDocumentName("../../../../ ../Pièce privée.png")).toBe("Piece-privee.png");
    expect(validateDocumentUpload({ bytes: png, declaredType: "image/png", maxBytes: 10 })).toBe("image/png");
    expect(() => validateDocumentUpload({ bytes: Buffer.from("pdf"), declaredType: "application/pdf", maxBytes: 10 })).toThrow();
    expect(() => validateDocumentUpload({ bytes: png, declaredType: "image/jpeg", maxBytes: 10 })).toThrow();
    expect(() => validateDocumentUpload({ bytes: png, declaredType: "image/png", maxBytes: 4 })).toThrow();
  });
});
