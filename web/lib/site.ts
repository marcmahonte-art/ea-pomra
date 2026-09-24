/**
 * Configuration centrale du site.
 *
 * L'URL de production est lue depuis la variable d'environnement
 * NEXT_PUBLIC_SITE_URL. Elle sert de base aux URL absolues exigées par
 * certaines métadonnées (Open Graph, lien canonique). Tant qu'elle n'est pas
 * définie, ces champs sont omis plutôt que de produire des URL fausses —
 * une URL canonique erronée est plus nuisible qu'une absence d'URL.
 *
 * À définir en production, par exemple dans `.env.local` :
 *   NEXT_PUBLIC_SITE_URL=https://etudier-en-afrique.org
 */
import type { Metadata } from "next";

export const SITE_NAME = "EA-POMRA";
export const SITE_TAGLINE = "Étudier en Afrique";

export const SITE_DESCRIPTION =
  "Plateforme panafricaine reliant 8 pays d'Afrique : orientation académique (Pôle OCO), aperçu du transfert de scolarité (STSS) et accompagnement psychosocial (Pôle PAP) pour réussir ses études.";

/** URL absolue du site, ou `undefined` si aucune source ne la fournit. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  // Repli automatique : Vercel expose l'URL du déploiement courant. Cela évite
  // qu'un oubli de variable d'environnement produise un plan de site vide et
  // des URL Open Graph relatives, donc inutilisables par les réseaux sociaux.
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

/** Image de partage social, servie depuis /public. */
export const SITE_OG_IMAGE = "/assets/logo-ea-pomra-round.png";

/**
 * Routes publiques indexables — source unique pour la navigation, le plan du
 * site et le fichier robots.txt. L'espace étudiant en est volontairement absent.
 */
export const PUBLIC_ROUTES = [
  { path: "/", label: "Accueil", priority: 1 },
  { path: "/a-propos", label: "À propos", priority: 0.8 },
  { path: "/programmes", label: "Programmes", priority: 0.8 },
  { path: "/stss", label: "STSS", priority: 0.8 },
  { path: "/antennes", label: "Antennes", priority: 0.8 },
  { path: "/ressources", label: "Ressources", priority: 0.6 },
  { path: "/actualites", label: "Actualités", priority: 0.6 },
  { path: "/contact", label: "Contact", priority: 0.7 },
] as const;

/**
 * Préfixes des routes privées, exclues de l'indexation. Toutes les zones
 * nominatives de la plateforme doivent y figurer : un espace oublié ici
 * exposerait un dossier étudiant aux moteurs de recherche.
 *
 * Les quatre zones le sont : l'espace étudiant, le portail parent et les deux
 * back-offices (antenne et BEC). Ces derniers affichent des noms d'étudiants et
 * des états de traitement ; les laisser indexables serait la même faute que pour
 * un dossier nominatif.
 */
export const PRIVATE_ROUTE_PREFIXES = [
  "/etudiant",
  "/parent",
  "/antenne",
  "/bec",
] as const;

/**
 * Construit les métadonnées d'une page publique à partir de son titre court et
 * de sa description. Le titre court passe par le gabarit défini dans
 * `app/layout.tsx` (« À propos » → « À propos | EA-POMRA »), tandis que la carte
 * de partage social reçoit le titre complet et l'image de marque.
 *
 * Centraliser ici évite de répéter six fois le bloc `openGraph` et garantit
 * qu'une page ne puisse pas partir en production sans image de partage.
 */
export function pageMetadata(title: string, description: string): Metadata {
  const shareTitle = `${title} | ${SITE_NAME}`;
  const image = {
    url: SITE_OG_IMAGE,
    width: 512,
    height: 448,
    alt: `Logo ${SITE_NAME}`,
  };

  return {
    title,
    description,
    openGraph: {
      title: shareTitle,
      description,
      images: [image],
    },
    // `twitter` n'hérite pas de `openGraph` : sans ce bloc, la carte Twitter
    // afficherait le titre générique du site au lieu de celui de la page.
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}
