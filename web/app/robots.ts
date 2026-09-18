import type { MetadataRoute } from "next";
import { SITE_URL, PRIVATE_ROUTE_PREFIXES } from "@/lib/site";

/**
 * Fichier robots.txt généré par Next.js (servi sur /robots.txt).
 *
 * Les espaces nominatifs — étudiant et parent — sont explicitement interdits.
 * Cette directive complète l'en-tête `robots: noindex` posé dans leurs layouts
 * respectifs, qui reste la protection principale : un robots.txt n'empêche pas
 * l'indexation d'une URL déjà connue ou liée depuis un autre site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_ROUTE_PREFIXES],
    },
    ...(SITE_URL ? { sitemap: `${SITE_URL.replace(/\/$/, "")}/sitemap.xml` } : {}),
  };
}
