import { Globe2 } from "lucide-react";
import type { CountryStat } from "@/lib/backoffice-types";

/**
 * Vue des 8 pays (spec §9.3).
 *
 * La spec assortit ce composant d'une consigne explicite : « cette vue sert au
 * pilotage opérationnel et ne doit pas transformer automatiquement les données
 * en classement de performance ». Trois décisions en découlent :
 *
 *   1. l'ordre est **alphabétique**, fixé par `computeCountryStats()` — jamais
 *      par le volume, qui produirait un classement implicite ;
 *   2. aucun rang, aucune médaille, aucune mise en avant du « premier » ;
 *   3. les mêmes quatre nombres pour chaque pays, sans code couleur comparatif.
 *
 * Une note visible rappelle cette règle à l'écran : sans elle, un lecteur
 * pressé lira la grille comme un tableau de scores, ce que la spec refuse.
 */
function Figure({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
        {label}
      </dt>
      <dd className={`mt-0.5 text-lg font-extrabold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}

export function CountryOverviewGrid({ stats }: { stats: CountryStat[] }) {
  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[#EDF1F6]">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#0D2B4D] tracking-tight">
          <Globe2 className="w-4 h-4 text-[#667085]" aria-hidden="true" />
          Vue des 8 pays
        </h2>
        <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
          Vue de pilotage opérationnel. Les pays sont présentés par ordre
          alphabétique, sans classement de performance.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-[#EDF1F6]">
        {stats.map((stat) => (
          <li key={stat.countryCode} className="bg-white p-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-base leading-none">
                {stat.flag}
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] truncate">
                {stat.country}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-[#98A2B3] truncate">
              Antenne de {stat.city}
            </p>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              <Figure label="Dossiers" value={stat.total} tone="text-[#0D2B4D]" />
              <Figure label="En attente" value={stat.pending} tone="text-[#475467]" />
              <Figure label="À valider" value={stat.toValidate} tone="text-[#B86E00]" />
              <Figure label="Validés" value={stat.validated} tone="text-[#1EA362]" />
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CountryOverviewGrid;
