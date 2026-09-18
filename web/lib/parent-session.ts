/**
 * Session parent — **couture d'authentification**, exécutée côté serveur.
 *
 * ÉTAT ACTUEL : la plateforme n'a pas encore de couche d'authentification. Cette
 * fonction renvoie donc systématiquement une session de démonstration, ce qui
 * signifie que **`/parent/*` n'est protégé par rien aujourd'hui**.
 *
 * Ce que ce fichier garantit malgré tout :
 *   - l'appel est asynchrone et se fait depuis un composant serveur, donc le
 *     contrôle ne peut pas être contourné depuis le navigateur ;
 *   - il n'existe qu'un seul point à modifier le jour où l'authentification
 *     arrive (voir `TODO AUTH` ci-dessous) ;
 *   - la lecture du cookie est déjà en place : le jour où le cookie sera émis
 *     par un vrai service, il sera vérifié ici, et nulle part ailleurs.
 *
 * Ce que ce fichier ne garantit PAS, et qu'il ne faut pas lui prêter :
 *   - aucune vérification cryptographique de la session ;
 *   - aucune vérification que le parent authentifié est bien le tuteur légal de
 *     l'étudiant. Le contrôle de *rattachement* (la session n'autorise qu'une
 *     seule référence de dossier) est bien effectué, dans `app/parent/layout.tsx`,
 *     mais il repose sur une session dont l'identité n'est pas prouvée. C'est
 *     cette preuve d'identité qui manque, et elle est indispensable avant toute
 *     mise en production.
 */
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const PARENT_SESSION_COOKIE = "eap_parent_session";

export interface ParentSession {
  parentId: string;
  /** Référence du dossier de l'enfant rattaché à ce parent. */
  studentReference: string;
  issuedAt: string;
  /** Vrai tant que la session provient du jeu de démonstration. */
  isDemo: boolean;
}

/**
 * Session de démonstration. Elle porte la référence réellement utilisée par
 * `lib/parent-data.ts` afin qu'un futur contrôle de rattachement puisse être
 * testé sans modifier les données.
 */
const DEMO_SESSION: ParentSession = {
  parentId: "par-001",
  studentReference: "BF-2026-00125",
  issuedAt: "2026-09-18T09:00:00.000Z",
  isDemo: true,
};

/**
 * Lit la session parent. Renvoie `null` si elle est absente ou illisible.
 *
 * `cookies()` rend le segment `/parent` dynamique : c'est le comportement
 * attendu pour un espace nominatif, dont le contenu ne doit jamais être mis en
 * cache ni pré-généré.
 */
export async function getParentSession(): Promise<ParentSession | null> {
  const store = await cookies();
  const raw = store.get(PARENT_SESSION_COOKIE)?.value;

  if (!raw) {
    // TODO AUTH — remplacer ce repli par `return null;` dès que le service
    // d'authentification émettra le cookie `eap_parent_session`.
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[EA-POMRA] Aucune session parent : repli sur la session de démonstration. " +
          "Le portail /parent n'est pas authentifié."
      );
    }
    return DEMO_SESSION;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(raw, "base64").toString("utf8")
    ) as Partial<ParentSession>;

    if (typeof decoded.parentId !== "string") return null;

    return {
      parentId: decoded.parentId,
      studentReference: decoded.studentReference ?? DEMO_SESSION.studentReference,
      issuedAt: decoded.issuedAt ?? DEMO_SESSION.issuedAt,
      isDemo: false,
    };
  } catch {
    // Cookie présent mais illisible : on refuse la session plutôt que de
    // retomber sur la démonstration, sinon un cookie corrompu ouvrirait l'accès.
    return null;
  }
}

/**
 * Variante stricte, à utiliser dans les pages du portail.
 *
 * En l'absence de session valide, la page renvoie un 404 plutôt qu'une
 * redirection : cela évite de confirmer l'existence de l'espace parent à un
 * visiteur non authentifié.
 */
export async function requireParentSession(): Promise<ParentSession> {
  const session = await getParentSession();
  if (!session) {
    // TODO AUTH — une fois la page de connexion créée, préférer :
    //   redirect(`/parent/connexion?suite=${encodeURIComponent("/parent")}`);
    notFound();
  }
  return session;
}
