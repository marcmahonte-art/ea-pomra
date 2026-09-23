import { DashboardSkeleton } from "@/components/backoffice/Skeletons";

/**
 * Squelette de chargement de l'espace BEC (spec §31).
 *
 * ⚠️ Même contrainte que côté antenne — voir le commentaire détaillé de
 * `app/antenne/(espace)/loading.tsx`.
 *
 * En résumé : un `loading.tsx` fige le statut HTTP à 200 avant que la page ne
 * se rende, ce qui transforme tout `notFound()` levé sous lui en soft-404. Le
 * groupe `(espace)` maintient la frontière **sous** `dossiers/[id]`, seul
 * segment où le statut 404 doit rester exact.
 *
 * Ne pas déplacer ce fichier à la racine de `app/bec/`.
 */
export default function Loading() {
  return <DashboardSkeleton />;
}
