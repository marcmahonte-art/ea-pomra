import type { ReactNode } from "react";

export interface Column<T> {
  /** Clé stable de colonne. */
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Alignement, pour les colonnes numériques. */
  align?: "left" | "right";
  /** Masquer cette colonne dans la version carte (mobile). */
  hideOnCard?: boolean;
}

/**
 * Tableau générique du back-office.
 *
 * Les panneaux Orientation, Mobilité, Suivi, STSS et Documents partagent la même
 * structure : un en-tête, des lignes, un état vide. Écrire cinq tableaux
 * séparés aurait produit cinq fois les mêmes correctifs de largeur, de
 * débordement et d'accessibilité.
 *
 * Responsive (spec §28) : sous `md`, chaque ligne devient une carte
 * « libellé / valeur » construite à partir des mêmes colonnes. Aucun tableau à
 * faire défiler horizontalement, et aucune colonne perdue — une donnée masquée
 * sur mobile doit l'être volontairement (`hideOnCard`), jamais par accident.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  emptyLabel = "Aucune donnée à afficher.",
  minWidth,
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
  minWidth?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-xs text-[#98A2B3]">{emptyLabel}</p>
    );
  }

  return (
    <>
      {/* Desktop : tableau */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left" style={minWidth ? { minWidth } : undefined}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-[#FAFCFE] border-y border-[#E6E9EF]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-[#667085] whitespace-nowrap ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF1F6]">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="h-16 hover:bg-[#FAFCFE] transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 align-middle ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile : une carte par ligne, mêmes colonnes */}
      <ul className="md:hidden divide-y divide-[#EDF1F6]">
        {rows.map((row) => (
          <li key={rowKey(row)} className="p-4">
            <dl className="space-y-2">
              {columns
                .filter((column) => !column.hideOnCard)
                .map((column) => (
                  <div
                    key={column.key}
                    className="flex items-start justify-between gap-3"
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] shrink-0">
                      {column.header}
                    </dt>
                    <dd className="text-[11px] text-[#1F2937] text-right min-w-0">
                      {column.render(row)}
                    </dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Conteneur de section avec titre et description, autour d'un DataTable. */
export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-[#0D2B4D] tracking-tight">{title}</h2>
          {description ? (
            <p className="text-xs text-[#5B6776] mt-1 leading-relaxed max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export default DataTable;
