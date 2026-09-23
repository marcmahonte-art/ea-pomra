import { DashboardSkeleton } from "@/components/backoffice/Skeletons";

/**
 * Squelette de chargement de l'espace antenne (spec §31).
 *
 * ⚠️ CE FICHIER EST DANS UN GROUPE DE ROUTES, ET C'EST VOLONTAIRE.
 *
 * Un `loading.tsx` crée une frontière `<Suspense>` autour de **tous** les
 * descendants de son segment. Or cette frontière est remplie et envoyée au
 * navigateur **avant** que la page n'ait fini de se rendre : dès cet instant le
 * statut HTTP est figé à 200 et ne peut plus changer.
 *
 * Conséquence, vérifiée en développement et en production : `notFound()` levé
 * depuis une page située sous un `loading.tsx` affiche bien la page
 * « introuvable », mais avec un statut **200** au lieu de 404. C'est un
 * soft-404 : un dossier hors périmètre devenait indiscernable d'un dossier
 * inexistant pour tout outil lisant les statuts.
 *
 * Le groupe `(espace)` place donc la frontière **sous** le chemin menant à
 * `dossiers/[id]`, qui reste le seul segment hors squelette :
 *
 *   app/antenne/layout.tsx              <- hors frontière : garde de zone
 *   app/antenne/(espace)/loading.tsx    <- frontière (ce fichier)
 *   app/antenne/(espace)/**             -> squelette appliqué
 *   app/antenne/dossiers/[id]/page.tsx  -> hors frontière : 404 correct
 *
 * Ne pas déplacer ce fichier à la racine de `app/antenne/` : cela rétablirait
 * le soft-404 sur le détail d'un dossier. Voir
 * `site/SPEC_BACKOFFICE_ANTENNE_BEC_ADAPTATIONS.md`.
 */
export default function Loading() {
  return <DashboardSkeleton />;
}
