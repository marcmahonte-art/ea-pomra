"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { useFilterNavigation } from "./use-filter-navigation";

/**
 * Recherche de dossiers (spec §10.1).
 *
 * Porte sur le nom, l'ID-POMRA, le numéro de dossier, l'email et le téléphone —
 * c'est `queryDossiers()` qui effectue le rapprochement, côté serveur.
 *
 * Le champ est **débouncé** : sans cela, taper « Aïssatou » déclencherait neuf
 * requêtes serveur et neuf rendus. La valeur n'est écrite dans l'URL que
 * 350 ms après la dernière frappe.
 */
export function DossierSearch({
  placeholder = "Nom, ID-POMRA, email ou téléphone",
  label = "Rechercher un dossier",
}: {
  placeholder?: string;
  label?: string;
}) {
  const searchParams = useSearchParams();
  const urlValue = searchParams.get("q") ?? "";
  const { setParam, isPending } = useFilterNavigation();
  const [value, setValue] = useState(urlValue);
  const [syncedFrom, setSyncedFrom] = useState(urlValue);

  // L'URL est la source de vérité : un retour navigateur ou une réinitialisation
  // doit remettre le champ dans l'état qu'elle décrit. L'ajustement se fait
  // pendant le rendu — motif recommandé par React pour « dériver un état d'une
  // prop » — plutôt que dans un effet, qui provoquerait un rendu en cascade.
  if (urlValue !== syncedFrom) {
    setSyncedFrom(urlValue);
    setValue(urlValue);
  }

  useEffect(() => {
    if (value === urlValue) return;
    const timer = setTimeout(() => {
      setParam("q", value.trim() || null);
    }, 350);
    return () => clearTimeout(timer);
  }, [value, urlValue, setParam]);

  return (
    <div className="relative flex-1 min-w-[220px]">
      <label htmlFor="dossier-search" className="sr-only">
        {label}
      </label>

      <span
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </span>

      <input
        id="dossier-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full h-10 rounded-xl border border-[#E6E9EF] bg-white pl-9 pr-9 text-sm text-[#1F2937] placeholder:text-[#98A2B3] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
      />

      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Effacer la recherche"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#98A2B3] hover:bg-[#F0F3F7] hover:text-[#0D2B4D]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {isPending ? "Recherche en cours" : ""}
      </span>
    </div>
  );
}

export default DossierSearch;
