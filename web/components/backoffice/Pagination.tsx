"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterNavigation } from "./use-filter-navigation";

/**
 * Pagination **serveur** (spec §10.5 et §32).
 *
 * Le composant ne connaît ni les données ni le total : il reçoit `page`,
 * `totalPages`, `total` et `pageSize` déjà calculés par `queryDossiers()`, et ne
 * fait que réécrire le paramètre `page` de l'URL. Aucun découpage n'a lieu dans
 * le navigateur.
 */
function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);

  const output: (number | "gap")[] = [];
  let previous = 0;
  for (const item of sorted) {
    if (previous && item - previous > 1) output.push("gap");
    output.push(item);
    previous = item;
  }
  return output;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  const { apply } = useFilterNavigation();

  const goToPage = (target: number) => {
    const bounded = Math.min(Math.max(target, 1), totalPages);
    apply((params) => {
      if (bounded <= 1) params.delete("page");
      else params.set("page", String(bounded));
    });
  };

  const changePageSize = (size: number) => {
    apply((params) => {
      if (size === 10) params.delete("pageSize");
      else params.set("pageSize", String(size));
      params.delete("page");
    });
  };

  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination des dossiers"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4"
    >
      <div className="flex items-center gap-3">
        <p className="text-[11px] text-[#5B6776]">
          {total === 0 ? (
            "Aucun résultat"
          ) : (
            <>
              <span className="font-bold text-[#0D2B4D] tabular-nums">
                {first}–{last}
              </span>{" "}
              sur <span className="font-bold text-[#0D2B4D] tabular-nums">{total}</span>{" "}
              résultat{total > 1 ? "s" : ""}
            </>
          )}
        </p>

        <div className="flex items-center gap-1.5">
          <label htmlFor="page-size" className="text-[11px] text-[#98A2B3]">
            Par page
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => changePageSize(Number(event.target.value))}
            className="h-8 rounded-lg border border-[#E6E9EF] bg-white px-2 text-[11px] font-medium text-[#1F2937] focus:border-[#174A7C] focus:outline-none"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-[#E6E9EF] bg-white text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Page précédente</span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {pageWindow(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <li
                key={`gap-${index}`}
                aria-hidden="true"
                className="w-9 h-9 flex items-center justify-center text-[#98A2B3] text-xs"
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => goToPage(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={`w-9 h-9 rounded-xl text-[11px] font-bold tabular-nums transition-colors ${
                    item === page
                      ? "bg-[#174A7C] text-white"
                      : "border border-[#E6E9EF] bg-white text-[#0D2B4D] hover:bg-[#F7F9FB]"
                  }`}
                >
                  {item}
                </button>
              </li>
            )
          )}
        </ul>

        <span className="md:hidden px-2 text-[11px] font-bold text-[#0D2B4D] tabular-nums">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-[#E6E9EF] bg-white text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Page suivante</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
