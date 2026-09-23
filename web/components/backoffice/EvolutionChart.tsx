import type { EvolutionPoint } from "@/lib/backoffice-types";

/**
 * Évolution temporelle des dossiers reçus et traités (spec §21).
 *
 * Le graphique est construit en CSS, sans bibliothèque de rendu : le dépôt n'en
 * contient aucune, et en ajouter une pour six colonnes coûterait bien plus cher
 * en poids de bundle que ce que la connexion faible du contexte EA-POMRA peut
 * absorber (spec §32).
 *
 * La spec §21 impose une « alternative textuelle/tableau ». Elle est fournie
 * dans un bloc dépliable **visible**, et non en `sr-only` : un tableau de
 * chiffres est utile à tout le monde, et le cacher aux voyants serait un
 * contresens.
 */
export function EvolutionChart({ points }: { points: EvolutionPoint[] }) {
  const max = points.reduce(
    (peak, point) => Math.max(peak, point.received, point.processed),
    0
  );

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#0D2B4D] tracking-tight">
            Évolution temporelle
          </h2>
          <p className="text-xs text-[#5B6776] mt-1">
            Dossiers reçus et traités, par mois.
          </p>
        </div>

        <ul className="flex items-center gap-3 shrink-0">
          <li className="flex items-center gap-1.5 text-[10px] font-semibold text-[#5B6776]">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm bg-[#174A7C]" />
            Reçus
          </li>
          <li className="flex items-center gap-1.5 text-[10px] font-semibold text-[#5B6776]">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm bg-[#1EA362]" />
            Traités
          </li>
        </ul>
      </div>

      {max === 0 ? (
        <p className="mt-4 text-xs text-[#98A2B3]">Aucune donnée sur le périmètre.</p>
      ) : (
        <div
          className="mt-5 flex items-end gap-2 h-40"
          role="img"
          aria-label={`Évolution mensuelle sur ${points.length} mois. Le tableau détaillé est disponible ci-dessous.`}
        >
          {points.map((point) => (
            <div key={point.period} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
              <div className="flex items-end gap-0.5 h-full w-full justify-center">
                <span
                  className="w-3 rounded-t bg-[#174A7C]"
                  style={{ height: `${Math.max(2, (point.received / max) * 100)}%` }}
                  title={`${point.period} — ${point.received} reçus`}
                />
                <span
                  className="w-3 rounded-t bg-[#1EA362]"
                  style={{ height: `${Math.max(2, (point.processed / max) * 100)}%` }}
                  title={`${point.period} — ${point.processed} traités`}
                />
              </div>
              <span className="text-[9px] font-semibold text-[#98A2B3] truncate w-full text-center">
                {point.period}
              </span>
            </div>
          ))}
        </div>
      )}

      <details className="mt-4 group">
        <summary className="cursor-pointer text-[11px] font-bold text-[#174A7C] hover:underline">
          Afficher les données chiffrées
        </summary>
        <table className="mt-3 w-full border-collapse text-left">
          <caption className="sr-only">
            Évolution mensuelle des dossiers reçus et traités
          </caption>
          <thead>
            <tr className="border-b border-[#E6E9EF]">
              <th scope="col" className="py-2 text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                Mois
              </th>
              <th scope="col" className="py-2 text-[10px] font-bold uppercase tracking-wider text-[#667085] text-right">
                Reçus
              </th>
              <th scope="col" className="py-2 text-[10px] font-bold uppercase tracking-wider text-[#667085] text-right">
                Traités
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF1F6]">
            {points.map((point) => (
              <tr key={point.period}>
                <td className="py-2 text-[11px] text-[#1F2937]">{point.period}</td>
                <td className="py-2 text-[11px] font-semibold text-[#0D2B4D] text-right tabular-nums">
                  {point.received}
                </td>
                <td className="py-2 text-[11px] font-semibold text-[#0D2B4D] text-right tabular-nums">
                  {point.processed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

export default EvolutionChart;
