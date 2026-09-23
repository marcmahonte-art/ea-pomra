import type { Distribution } from "@/lib/backoffice-types";

/**
 * Répartition en barres horizontales.
 *
 * Utilisé pour les répartitions par statut, par programme et par formation
 * (spec §21). Chaque ligne affiche **le libellé et la valeur chiffrée** en plus
 * de la barre : le graphique est donc lisible sans couleur et sans vision, ce
 * que la spec §21 exige pour les graphiques, et ce qu'une barre seule ne
 * garantit pas.
 *
 * La palette est dérivée de l'index et non du libellé : deux répartitions
 * différentes n'ont pas à colorer « Validé » et « Master » de la même façon,
 * mais une même répartition doit rester stable d'un rendu à l'autre.
 */
const PALETTE = [
  "bg-[#174A7C]",
  "bg-[#1EA362]",
  "bg-[#C89C2E]",
  "bg-[#3B82F6]",
  "bg-[#8E9BAA]",
  "bg-[#B42318]",
  "bg-[#0D2B4D]",
  "bg-[#F59E0B]",
];

export function DistributionBars({
  title,
  description,
  items,
  emptyLabel = "Aucune donnée sur le périmètre.",
}: {
  title: string;
  description?: string;
  items: Distribution[];
  emptyLabel?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = items.reduce((peak, item) => Math.max(peak, item.value), 0);

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft">
      <h2 className="text-sm font-bold text-[#0D2B4D] tracking-tight">{title}</h2>
      {description ? (
        <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">{description}</p>
      ) : null}

      {items.length === 0 || max === 0 ? (
        <p className="mt-4 text-xs text-[#98A2B3]">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => {
            const share = total > 0 ? Math.round((item.value / total) * 100) : 0;
            const width = max > 0 ? Math.round((item.value / max) * 100) : 0;

            return (
              <li key={item.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-semibold text-[#1F2937] truncate">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-bold text-[#0D2B4D] tabular-nums whitespace-nowrap">
                    {item.value}
                    <span className="font-medium text-[#98A2B3]"> · {share} %</span>
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[#F0F3F7] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${PALETTE[index % PALETTE.length]}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default DistributionBars;
