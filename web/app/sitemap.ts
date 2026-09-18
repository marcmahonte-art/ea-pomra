import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_ROUTES } from "@/lib/site";

/**
 * Plan du site généré par Next.js (servi sur /sitemap.xml).
 *
 * Seules les routes publiques y figurent — l'espace étudiant en est exclu par
 * construction, puisque `PUBLIC_ROUTES` est la seule source utilisée.
 *
 * Si NEXT_PUBLIC_SITE_URL n'est pas définie, on renvoie une liste vide plutôt
 * que des URL relatives : un plan de site contenant des adresses invalides est
 * pénalisant, alors qu'un plan vide est simplement ignoré.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];

  const base = SITE_URL.replace(/\/$/, "");

  return PUBLIC_ROUTES.map((route) => ({
    url: route.path === "/" ? base : `${base}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));
}
