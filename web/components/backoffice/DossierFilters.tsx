"use client";

import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import {
  DATE_FILTER_LABELS,
  STATE_LABELS,
  type BackofficeRole,
  type CountryCode,
  type DateFilter,
  type DossierState,
} from "@/lib/backoffice-types";
import { hasActiveFilters, useFilterNavigation } from "./use-filter-navigation";

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FilterSelect({ id, label, value, onChange, options }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-wider text-[#667085]"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-[150px] rounded-xl border border-[#E6E9EF] bg-white px-3 text-xs font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none focus:ring-2 focus:ring-[#EBF3FA]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Filtres de la liste des dossiers (spec §10.2 pour l'antenne, §10.3 pour le BEC).
 *
 * Le filtre « Pays / Antenne » n'apparaît que pour le BEC : un agent d'antenne
 * ne voit déjà que son pays, lui proposer ce filtre laisserait croire qu'il peut
 * en changer.
 *
 * Chaque changement est appliqué immédiatement. Un bouton « Appliquer » a été
 * écarté ici : il double le nombre de clics sans rien apporter, puisque le
 * filtrage est instantané côté serveur. Le BEC conserve en revanche ses boutons
 * de filtres globaux sur le tableau de bord, où ils portent sur plusieurs blocs
 * à la fois.
 */
export function DossierFilters({
  role,
  programs,
  formations,
  countries,
  showCountry,
}: {
  role: BackofficeRole;
  programs: readonly string[];
  formations: readonly string[];
  countries: readonly { code: CountryCode; name: string; flag: string }[];
  /**
   * Force l'affichage du filtre pays. La spec §18 le demande sur la page Suivi
   * alors que le rôle est celui de l'antenne : le besoin existe donc même quand
   * le périmètre est déjà restreint à un pays.
   */
  showCountry?: boolean;
}) {
  const searchParams = useSearchParams();
  const { setParam, reset, isPending } = useFilterNavigation();

  const state = searchParams.get("state") ?? "all";
  const program = searchParams.get("program") ?? "all";
  const formation = searchParams.get("formation") ?? "all";
  const country = searchParams.get("country") ?? "all";
  const completeness = searchParams.get("completeness") ?? "all";
  const date = searchParams.get("date") ?? "all";
  const active = hasActiveFilters(new URLSearchParams(searchParams.toString()));

  return (
    <section
      aria-label="Filtres"
      className="rounded-2xl border border-[#E6E9EF] bg-white p-4 shadow-eap-soft"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0D2B4D]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#667085]" aria-hidden="true" />
          Filtres
          {isPending ? (
            <span className="text-[10px] font-medium text-[#98A2B3]">
              mise à jour…
            </span>
          ) : null}
        </span>

        {active ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#174A7C] hover:underline"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Réinitialiser les filtres
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          id="filter-state"
          label="Statut"
          value={state}
          onChange={(value) => setParam("state", value)}
          options={[
            { value: "all", label: "Tous les statuts" },
            ...(Object.keys(STATE_LABELS) as DossierState[]).map((key) => ({
              value: key,
              label: STATE_LABELS[key],
            })),
          ]}
        />

        <FilterSelect
          id="filter-program"
          label="Programme"
          value={program}
          onChange={(value) => setParam("program", value)}
          options={[
            { value: "all", label: "Tous les programmes" },
            ...programs.map((item) => ({ value: item, label: item })),
          ]}
        />

        <FilterSelect
          id="filter-formation"
          label="Formation"
          value={formation}
          onChange={(value) => setParam("formation", value)}
          options={[
            { value: "all", label: "Toutes les formations" },
            ...formations.map((item) => ({ value: item, label: item })),
          ]}
        />

        {role === "BEC" || showCountry ? (
          <FilterSelect
            id="filter-country"
            label="Pays / Antenne"
            value={country}
            onChange={(value) => setParam("country", value)}
            options={[
              { value: "all", label: "Tous les pays" },
              ...countries.map((item) => ({
                value: item.code,
                label: `${item.flag} ${item.name}`,
              })),
            ]}
          />
        ) : null}

        <FilterSelect
          id="filter-date"
          label="Date de réception"
          value={date}
          onChange={(value) => setParam("date", value)}
          options={(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map((key) => ({
            value: key,
            label: DATE_FILTER_LABELS[key],
          }))}
        />

        <FilterSelect
          id="filter-completeness"
          label="Complétude"
          value={completeness}
          onChange={(value) => setParam("completeness", value)}
          options={[
            { value: "all", label: "Toutes" },
            { value: "complete", label: "Dossiers complets (100 %)" },
            { value: "incomplete", label: "Dossiers incomplets" },
          ]}
        />
      </div>
    </section>
  );
}

export default DossierFilters;

/**
 * Bouton de réinitialisation isolé.
 *
 * Il est utilisé par l'état vide : « Aucun dossier ne correspond aux filtres »
 * doit toujours offrir la sortie de secours (spec §31), sinon l'utilisateur
 * reste bloqué sur une liste vide sans comprendre ce qui la vide.
 */
export function ResetFiltersButton({ label = "Réinitialiser les filtres" }: { label?: string }) {
  const { reset } = useFilterNavigation();
  return (
    <button
      type="button"
      onClick={reset}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#174A7C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0D2B4D] transition-colors"
    >
      <X className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
