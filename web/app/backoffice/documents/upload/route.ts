import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { getAuthenticatedScope } from "@/lib/backoffice-session";
import { getServerConfig } from "@/lib/server/config";
import { documentAad, encryptDocument, validateDocumentUpload } from "@/lib/server/document-storage";
import { uploadDocument } from "@/lib/server/backoffice-repository";
import { consumeRateLimit, extractTrustedClientIp } from "@/lib/server/rate-limit";
import { isSafeContentLength, isTrustedUploadOrigin, uploadFieldsSchema } from "@/lib/server/validation";

const roleSchema = z.enum(["ANTENNE", "BEC"]);

function failure(message: string, status: number) {
  return Response.json({ status: "error", message }, { status });
}

export async function POST(request: Request) {
  try {
    const role = roleSchema.safeParse(new URL(request.url).searchParams.get("role"));
    if (!role.success) return failure("Non autorisé", 403);
    if (!isTrustedUploadOrigin(request.headers.get("origin"), process.env.NEXT_PUBLIC_SITE_URL)) {
      return failure("Origine non autorisée.", 403);
    }
    const config = getServerConfig();
    if (!isSafeContentLength(request.headers.get("content-length"), config.documentMaxBytes)) {
      return failure("Longueur de requête invalide.", 411);
    }
    if (request.headers.get("transfer-encoding")?.toLowerCase().includes("chunked")) {
      return failure("Encodage de transfert refusé.", 411);
    }
    const scope = await getAuthenticatedScope(role.data);
    if (scope.isDemo) return failure("La démonstration est en lecture seule.", 403);
    const ip = extractTrustedClientIp(request.headers, config.trustedProxyHeaders, process.env.NODE_ENV === "production");
    const limit = await consumeRateLimit("mutation", [scope.userId ?? "", "document.upload", scope.role, scope.countryCode ?? "", ip]);
    if (!limit.allowed) return failure("Trop de téléversements. Réessayez plus tard.", 429);
    if (!scope.permissions.includes("documents.verify")) return failure("Action non autorisée.", 403);

    const formData = await request.formData();
    const fields = uploadFieldsSchema.safeParse({
      role: role.data,
      dossierId: formData.get("dossierId"),
      documentId: formData.get("documentId"),
      expectedVersion: formData.get("expectedVersion")
    });
    const file = formData.get("file");
    if (!fields.success || !(file instanceof File)) return failure("Données de téléversement invalides.", 400);

    const bytes = Buffer.from(await file.arrayBuffer());
    const contentType = validateDocumentUpload({ bytes, declaredType: file.type, maxBytes: config.documentMaxBytes });
    const encrypted = encryptDocument(bytes, documentAad(fields.data.documentId, fields.data.expectedVersion));
    await uploadDocument(scope, {
      dossierId: fields.data.dossierId,
      documentId: fields.data.documentId,
      expectedVersion: fields.data.expectedVersion,
      contentType,
      bytes,
      encrypted,
      checksumSha256: encrypted.checksumSha256
    });
    return Response.json({ status: "success", message: "Fichier privé enregistré." }, { status: 201 });
  } catch (error) {
    unstable_rethrow(error);
    const message = error instanceof Error ? error.message : "";
    if (message === "Taille de fichier interdite") return failure(message, 413);
    if (message === "Type de fichier interdit") return failure(message, 415);
    if (message === "Version du dossier obsolète" || message === "Version du document obsolète" || message === "Statut du document incompatible") return failure("La pièce a changé. Rechargez la page.", 409);
    console.error("Échec du téléversement documentaire", { code: error instanceof Error && "code" in error ? String(error.code) : "UNKNOWN" });
    return failure("Le téléversement a échoué.", 500);
  }
}
