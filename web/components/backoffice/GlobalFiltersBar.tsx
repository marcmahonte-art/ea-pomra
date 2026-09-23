"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Check, RotateCcw, CalendarRange } from "lucide-react";
import type { CountryCode } from "@/lib/backoffice-types";
import { useFilterNavigation } from "./use-filter-navigation";

/**
 * Filtres globaux du tableau de bord BEC (spec §9.1).
 *
 * Particularité par rapport aux filtres de la liste des dossiers : la spec
 * demande ici des boutons **Réinitialiser** et **Appliquer**, et cette fois le
 * bouton d'application a un sens. Les filtres portent sur quatre blocs à la
 * fois — indicateurs, vue des huit pays, file de validation, évolution — et les
 * appliquer à chaque frappe déclencherait quatre recalculs serveur pour une
 * intention encore incomplète. L'état local est donc appliqué d'un coup.
 *
 * Le sélecteur de période est remplacé par l'affichage de la période de
 * référence. Le trimestre est une constante du module de données : proposer un
 * sélecteur qui ne changerait rien serait un contrôle mort, ce que la spec
 * §8.2 refuse par analogie pour les variations inventées.
 */
export function GlobalFiltersBar({
  countries,
  programs,
  formations,
  periodLabel,
}: {
  countries: readonly { code: CountryCode; name: string; flag: string }[];
  programs: readonly string[];
  formations: readonly string[];
  periodLabel: string;
}) {
  const searchParams = useSearchParams();
  const { apply } = useFilterNavigation();

  const urlCountry = searchParams.get("country") ?? "all";
  const urlProgram = searchParams.get("program") ?? "all";
  const urlFormation = searchParams.get("formation") ?? "all";

  const [country, setCountry] = useState(urlCountry);
  const [program, setProgram] = useState(urlProgram);
  const [formation, setFormation] = useState(urlFormation);
  const [syncedFrom, setSyncedFrom] = useState(
    `${urlCountry}|${urlProgram}|${urlFormation}`
  );

  // Ajustement pendant le rendu plutôt que dans un effet : React recommande ce
  // motif pour dériver un état d'une valeur externe (ici les paramètres d'URL),
  // et cela évite un rendu en cascade à chaque navigation.
  const current = `${urlCountry}|${urlProgram}|${urlFormation}`;
  if (current !== syncedFrom) {
    setSyncedFrom(current);
    setCountry(urlCountry);
    setProgram(urlProgram);
    setFormation(urlFormation);
  }

  const dirty =
    country !== urlCountry || program !== urlProgram || formation !== urlFormation;

  const submit = () => {
    apply((params) => {
      for (const [key, value] of [
        ["country", country],
        ["program", program],
        ["formation", formation],
      ] as const) {
        if (value === "all") params.delete(key);
        else params.set(key, value);
      }
    });
  };

  const reset = () => {
    setCountry("all");
    setProgram("all");
    setFormation("all");
    apply((params) => {
      params.delete("country");
      params.delete("program");
      params.delete("formation");
    });
  };

  return (
    <form
      aria-label="Filtres globaux"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-2xl border border-[#E6E9EF] bg-white p-4 shadow-eap-soft"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
            Période
          </span>
          <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] px-3 text-xs font-semibold text-[#0D2B4D]">
            <CalendarRange className="w-3.5 h-3.5 text-[#98A2B3]" aria-hidden="true" />
            {periodLabel}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="global-country"
            className="text-[10px] font-bold uppercase tracking-wider text-[#667085]"
          >
            Pays
          </label>
          <select
            id="global-country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="h-10 min-w-[170px] rounded-xl border border-[#E6E9EF] bg-white px-3 text-xs font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
          >
            <option value="all">Tous les pays</option>
            {countries.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="global-program"
            className="text-[10px] font-bold uppercase tracking-wider text-[#667085]"
          >
            Programme
          </label>
          <select
            id="global-program"
            value={program}
            onChange={(event) => setProgram(event.target.value)}
            className="h-10 min-w-[170px] rounded-xl border border-[#E6E9EF] bg-white px-3 text-xs font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
          >
            <option value="all">Tous les programmes</option>
            {programs.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="global-formation"
            className="text-[10px] font-bold uppercase tracking-wider text-[#667085]"
          >
            Formation
          </label>
          <select
            id="global-formation"
            value={formation}
            onChange={(event) => setFormation(event.target.value)}
            className="h-10 min-w-[170px] rounded-xl border border-[#E6E9EF] bg-white px-3 text-xs font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
          >
            <option value="all">Toutes les formations</option>
            {formations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 h-10 rounded-xl border border-[#E6E9EF] bg-white px-3 text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Réinitialiser
          </button>

          <button
            type="submit"
            disabled={!dirty}
            className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[#174A7C] px-4 text-[11px] font-bold text-white hover:bg-[#0D2B4D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            Appliquer
          </button>
        </div>
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-[#98A2B3]">
        <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
        Les filtres s&apos;appliquent à l&apos;ensemble des blocs de la page, y
        compris les agrégations calculées côté serveur.
      </p>
    </form>
  );
}

export default GlobalFiltersBar;
