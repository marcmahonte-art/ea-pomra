import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { getActivityForScope, getDossierForScope } from "@/lib/backoffice-data";
import { DossierDetail } from "@/components/backoffice/DossierDetail";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const dossier = getDossierForScope(scope, id);

  return {
    title: dossier ? `${dossier.reference} — ${dossier.studentName}` : "Dossier",
    description: dossier
      ? `Détail du dossier ${dossier.reference} : statut, documents, orientation, mobilité et historique.`
      : undefined,
  };
}

/**
 * Détail d'un dossier, côté BEC (spec §13).
 *
 * Le BEC voit les huit pays, mais la permission `dossiers.validate` lui ouvre en
 * plus l'action « Valider » dans l'en-tête. C'est le seul écart avec la vue
 * antenne, et il est porté par les permissions du périmètre, jamais par un test
 * sur le rôle dans le composant d'affichage.
 */
export default async function BecDossierDetailPage({ params }: PageProps) {
  const { id } = await params;
  const scope = await requireBackofficeScope("BEC", "dossiers.read");
  const dossier = getDossierForScope(scope, id);

  if (!dossier) notFound();

  const history = getActivityForScope(scope).filter(
    (event) => event.dossierRef === dossier.reference
  );

  return (
    <DossierDetail
      dossier={dossier}
      role="BEC"
      permissions={scope.permissions}
      history={history}
    />
  );
}
