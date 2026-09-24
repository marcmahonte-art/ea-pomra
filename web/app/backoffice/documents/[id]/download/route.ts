import { z } from "zod";
import { getAuthenticatedScope } from "@/lib/backoffice-session";
import { decryptDocument, documentAad, sanitizeDocumentName, validateDocumentUpload } from "@/lib/server/document-storage";
import { getServerConfig } from "@/lib/server/config";
import { getPrivateDocument, logDocumentDownload } from "@/lib/server/backoffice-repository";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const role = z.enum(["ANTENNE", "BEC"]).safeParse(new URL(request.url).searchParams.get("role"));
  if (!role.success) return new Response("Non autorisé", { status: 403 });
  const scope = await getAuthenticatedScope(role.data);
  if (scope.isDemo || !scope.permissions.includes("documents.read")) {
    return new Response("Non autorisé", { status: 403 });
  }
  const { id } = await context.params;
  const documentId = z.string().uuid().safeParse(id);
  if (!documentId.success) return new Response("Introuvable", { status: 404 });
  const stored = await getPrivateDocument(scope, documentId.data);
  if (!stored) return new Response("Introuvable", { status: 404 });
  const bytes = decryptDocument({
    ciphertext: stored.ciphertext,
    initializationVector: stored.initialization_vector,
    authenticationTag: stored.authentication_tag,
    checksumSha256: stored.checksum_sha256
  }, stored.aad_version > 0 ? documentAad(stored.id, stored.aad_version) : undefined);
  const contentType = validateDocumentUpload({ bytes, declaredType: stored.content_type, maxBytes: getServerConfig().documentMaxBytes });
  await logDocumentDownload(scope, documentId.data);
  const fileName = sanitizeDocumentName(stored.name);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
