"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Navigation par paramètres d'URL, partagée par la recherche, les filtres et
 * la pagination.
 *
 * Les filtres vivent dans l'URL et non dans un état local. Trois raisons :
 *   - la page reste un composant **serveur** : c'est le serveur qui relit les
 *     paramètres, filtre, trie et pagine (spec §10.5 et §32) ; le navigateur ne
 *     reçoit jamais l'ensemble des dossiers ;
 *   - un filtre partagé par lien ou rechargé à chaud redonne exactement la même
 *     vue, ce qui est indispensable au travail d'équipe sur une antenne ;
 *   - le retour arrière du navigateur restaure la vue précédente, ce qu'un état
 *     local ne sait pas faire.
 */
export function useFilterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const apply = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  /**
   * Fixe un paramètre. La valeur `null`, une chaîne vide ou `"all"` supprime le
   * paramètre : un filtre au repos ne pollue pas l'URL.
   *
   * Tout changement de filtre ramène à la page 1. Sans cela, filtrer depuis la
   * page 3 d'une liste de 12 résultats afficherait une page vide, ce que
   * l'utilisateur lit comme une absence de résultats.
   */
  const setParam = useCallback(
    (key: string, value: string | null) => {
      apply((params) => {
        if (value === null || value === "" || value === "all") params.delete(key);
        else params.set(key, value);
        params.delete("page");
      });
    },
    [apply]
  );

  const reset = useCallback(() => {
    apply((params) => {
      for (const key of [
        "q",
        "state",
        "program",
        "formation",
        "country",
        "completeness",
        "date",
        "page",
        "pageSize",
      ]) {
        params.delete(key);
      }
    });
  }, [apply]);

  return { apply, setParam, reset, isPending };
}

/** Vrai si au moins un filtre est actif, pour n'afficher « Réinitialiser » qu'à propos. */
export function hasActiveFilters(params: URLSearchParams): boolean {
  return ["q", "state", "program", "formation", "country", "completeness", "date"].some(
    (key) => {
      const value = params.get(key);
      return value !== null && value !== "" && value !== "all";
    }
  );
}
