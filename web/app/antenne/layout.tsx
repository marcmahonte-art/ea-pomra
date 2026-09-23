import type { Metadata } from "next";
import BackofficeShell from "@/components/backoffice/BackofficeShell";
import { requireBackofficeScope } from "@/lib/backoffice-session";
import { computeOperationalQueue } from "@/lib/backoffice-data";
import { SITE_NAME } from "@/lib/site";

/**
 * Métadonnées du back-office Antenne.
 *
 * `noindex, nofollow, nocache` : ces pages exposent des noms d'étudiants, des
 * références de dossier et des états de traitement. Aucune ne doit être
 * indexée, suivie ou mise en cache par un intermédiaire.
 *
 * Le gabarit de titre est **redéclaré ici**. Le piège a été rencontré et vérifié
 * en production sur `/parent` : un layout intermédiaire qui déclare son `title`
 * sous forme de chaîne simple interrompt la propagation du gabarit racine vers
 * ses petits-enfants. Les pages de détail auraient donc perdu le suffixe.
 */
export const metadata: Metadata = {
  title: {
    default: "Back-office Antenne",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Traitement opérationnel des dossiers de mobilité étudiante d'une antenne pays : réception, vérification, orientation, mobilité, suivi et STSS.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Layout serveur du back-office Antenne.
 *
 * Vérifie le périmètre **avant** de rendre quoi que ce soit, puis alimente la
 * coquille. Le compteur de dossiers en attente est calculé côté serveur à
 * partir du même périmètre que les pages : le badge de la barre latérale ne peut
 * donc pas afficher un nombre que l'agent n'a pas le droit de voir.
 *
 * La garde est placée **ici** et non dans les pages, pour une raison de statut
 * HTTP : ce layout est hors de la frontière `<Suspense>` créée par
 * `(espace)/loading.tsx`. Un `notFound()` levé sous cette frontière s'affiche
 * correctement mais avec un statut 200 (soft-404) ; levé ici, il produit un vrai
 * 404. Un agent BEC qui ouvre une URL `/antenne/...` obtient donc un 404 exact,
 * et non une page « introuvable » déguisée en succès. Détail complet :
 * `app/antenne/(espace)/loading.tsx`.
 */
export default async function AntenneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scope = await requireBackofficeScope("ANTENNE", "dossiers.read");
  const pendingCount = computeOperationalQueue(scope).length;

  return (
    <BackofficeShell
      role="ANTENNE"
      userName={scope.userName}
      userTitle={scope.userTitle}
      scopeLabel={`Antenne ${scope.country ?? "non définie"}`}
      scopeFlag={scope.flag}
      pendingCount={pendingCount}
      isDemo={scope.isDemo}
    >
      {children}
    </BackofficeShell>
  );
}
