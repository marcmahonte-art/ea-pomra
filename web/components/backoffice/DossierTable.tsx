import Link from "next/link";
import { FolderSearch, ChevronRight, ArrowUpRight } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import { dossierHref } from "@/lib/backoffice-nav";
import { EmptyState } from "@/components/ui/EmptyState";
import { CompletenessBar, DossierStatusBadge, PriorityBadge } from "./DossierStatus";
import { DossierCard } from "./DossierCard";
import { ResetFiltersButton } from "./DossierFilters";

/**
 * Tableau des dossiers (spec §10.4) et sa version mobile (spec §11).
 *
 * Deux variantes de colonnes :
 *   - `registry` — la liste complète : ID-POMRA, étudiant, programme, formation,
 *     statut, complétude, dernière mise à jour, antenne, action ;
 *   - `queue` — la file opérationnelle (spec §8.3), qui remplace programme et
 *     formation par le **type d'action attendue** et la priorité, seules
 *     informations utiles quand on traite un dossier plutôt qu'on ne le cherche.
 *
 * Dimensions imposées par la spec §10.4 : en-tête 44 px minimum, ligne 64 px
 * minimum, padding horizontal 16 px.
 */

const COLUMNS = {
  registry: [
    "ID-POMRA",
    "Étudiant",
    "Programme",
    "Formation",
    "Statut",
    "Complétude",
    "Dernière mise à jour",
    "Antenne / Pays",
    "Action",
  ],
  queue: [
    "ID-POMRA",
    "Étudiant",
    "Type d'action",
    "Statut",
    "Dernière mise à jour",
    "Priorité",
    "Action",
  ],
} as const;

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`h-11 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#667085] whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}

export function DossierTable({
  rows,
  role,
  variant = "registry",
  showCountry = false,
}: {
  rows: Dossier[];
  role: BackofficeRole;
  variant?: "registry" | "queue";
  /** Obligatoire pour le BEC (spec §10.4) : la colonne indique le pays d'origine. */
  showCountry?: boolean;
}) {
  const columns = COLUMNS[variant];

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          {variant === "queue"
            ? "Dossiers nécessitant une action de l'antenne"
            : "Liste des dossiers du périmètre"}
        </caption>

        <thead>
          <tr className="bg-[#FAFCFE] border-y border-[#E6E9EF]">
            {columns.map((label) => (
              <Th key={label}>{label}</Th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#EDF1F6]">
          {rows.map((dossier) => (
            <tr key={dossier.id} className="h-16 hover:bg-[#FAFCFE] transition-colors">
              <td className="px-4">
                <Link
                  href={dossierHref(role, dossier.id)}
                  className="font-mono text-[11px] font-semibold text-[#174A7C] hover:underline whitespace-nowrap"
                >
                  {dossier.reference}
                </Link>
              </td>

              <td className="px-4">
                <span className="block text-xs font-bold text-[#0D2B4D] truncate max-w-[190px]">
                  {dossier.studentName}
                </span>
                <span className="block text-[10px] text-[#98A2B3] truncate max-w-[190px]">
                  {dossier.email}
                </span>
              </td>

              {variant === "registry" ? (
                <>
                  <td className="px-4 text-xs text-[#1F2937]">{dossier.program}</td>
                  <td className="px-4 text-xs text-[#5B6776]">{dossier.formation}</td>
                </>
              ) : (
                <td className="px-4">
                  <span className="text-xs text-[#1F2937]">
                    {dossier.requiredAction ?? "—"}
                  </span>
                </td>
              )}

              <td className="px-4">
                <DossierStatusBadge state={dossier.state} />
              </td>

              {variant === "registry" ? (
                <td className="px-4">
                  <CompletenessBar value={dossier.completeness} />
                </td>
              ) : null}

              <td className="px-4 text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
                {dossier.updatedAtLabel}
              </td>

              {variant === "registry" ? (
                <td className="px-4">
                  {showCountry ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D2B4D] whitespace-nowrap">
                      <span aria-hidden="true">{dossier.flag}</span>
                      {dossier.country}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#5B6776] whitespace-nowrap">
                      {dossier.antennaCity}
                    </span>
                  )}
                </td>
              ) : (
                <td className="px-4">
                  <PriorityBadge priority={dossier.priority} />
                </td>
              )}

              <td className="px-4">
                <span className="flex items-center gap-2">
                  <Link
                    href={dossierHref(role, dossier.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E6E9EF] px-2.5 py-1.5 text-[11px] font-bold text-[#0D2B4D] hover:bg-[#F7F9FB] hover:border-[#174A7C] transition-colors whitespace-nowrap"
                  >
                    Consulter
                  </Link>
                  {variant === "queue" ? (
                    <Link
                      href={dossierHref(role, dossier.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#174A7C] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#0D2B4D] transition-colors whitespace-nowrap"
                    >
                      Traiter
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  ) : null}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Liste responsive : tableau sur desktop, cartes sur mobile (spec §11).
 *
 * Les deux représentations sont rendues par le serveur ; le CSS décide. Aucun
 * JavaScript n'est nécessaire pour choisir la bonne, ce qui évite un rendu
 * intermédiaire vide sur mobile.
 */
export function DossierList({
  rows,
  role,
  variant = "registry",
  showCountry = false,
  emptyTitle = "Aucun dossier ne correspond aux filtres.",
  emptyDescription = "Élargissez la recherche ou réinitialisez les filtres pour retrouver l'ensemble du périmètre.",
}: {
  rows: Dossier[];
  role: BackofficeRole;
  variant?: "registry" | "queue";
  showCountry?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={FolderSearch}
        title={emptyTitle}
        description={emptyDescription}
        action={<ResetFiltersButton />}
      />
    );
  }

  return (
    <>
      <DossierTable
        rows={rows}
        role={role}
        variant={variant}
        showCountry={showCountry}
      />

      <ul className="lg:hidden space-y-3">
        {rows.map((dossier) => (
          <li key={dossier.id}>
            <DossierCard
              dossier={dossier}
              role={role}
              showCountry={showCountry}
              actionLabel={variant === "queue" ? "Traiter" : "Consulter"}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

/** Lien « ouvrir le dossier » isolé, pour les tableaux d'une autre forme. */
export function DossierLink({
  role,
  dossierId,
  reference,
}: {
  role: BackofficeRole;
  dossierId: string;
  reference: string;
}) {
  return (
    <Link
      href={dossierHref(role, dossierId)}
      className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#174A7C] hover:underline"
    >
      {reference}
      <ChevronRight className="w-3 h-3" aria-hidden="true" />
    </Link>
  );
}

export default DossierTable;
