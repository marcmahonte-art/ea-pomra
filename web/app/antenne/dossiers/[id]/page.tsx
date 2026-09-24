import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getActivityForDossier, getDossierForScope } from "@/lib/server/backoffice-service";
import { DossierDetail } from "@/components/backoffice/DossierDetail";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const dossier = await getDossierForScope(scope, id);

  return {
    title: dossier ? `${dossier.reference} — ${dossier.studentName}` : "Dossier",
    description: dossier
      ? `Détail du dossier ${dossier.reference} : statut, documents, orientation, mobilité et historique.`
      : undefined,
  };
}

/**
 * Détail d'un dossier, côté antenne (spec §13).
 *
 * `getDossierForScope()` est le **seul** point d'accès à un dossier : il applique
 * le périmètre avant la recherche. Spec §40 : « GET /api/dossiers/:id ne doit
 * jamais retourner un dossier simplement parce que l'ID est connu ». Un dossier
 * ivoirien ouvert par un agent sénégalais renvoie donc un 404, pas une fiche
 * partiellement masquée — masquer laisserait deviner son existence.
 */
export default async function AntenneDossierDetailPage({ params }: PageProps) {
  const { id } = await params;
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const dossier = await getDossierForScope(scope, id);

  if (!dossier) notFound();

  const history = await getActivityForDossier(scope, dossier.id);

  return (
    <DossierDetail
      dossier={dossier}
      role="ANTENNE"
      permissions={scope.permissions}
      history={history}
      isDemo={scope.isDemo}
    />
  );
}
