import Link from "next/link";
import type { ActivityEvent } from "@/lib/backoffice-types";
import { STATE_LABELS } from "@/lib/backoffice-types";
import { dossierHref } from "@/lib/backoffice-nav";
import type { BackofficeRole } from "@/lib/backoffice-types";

/**
 * Registre d'activité.
 *
 * Deux présentations, une seule source : `ActivityEvent`.
 *   - `compact` — bloc « Activité récente » du tableau de bord (spec §8.5) :
 *     date, utilisateur, action, dossier, résultat ;
 *   - `full` — registre chronologique complet (spec §15) : les huit colonnes,
 *     dont l'ancien et le nouveau statut et le commentaire.
 *
 * Le composant est **en lecture seule par construction** : il ne reçoit que des
 * événements et n'expose aucune action. La spec §15 l'exige — « l'historique
 * doit être consultable mais non modifiable par les utilisateurs standards » —
 * et un composant incapable d'écrire est plus sûr qu'un composant dont on
 * espère que personne n'appellera la fonction d'écriture.
 */

function StateTransition({
  from,
  to,
}: {
  from: ActivityEvent["fromState"];
  to: ActivityEvent["toState"];
}) {
  if (!from && !to) {
    return <span className="text-[11px] text-[#98A2B3]">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] whitespace-nowrap">
      <span className="text-[#667085]">{from ? STATE_LABELS[from] : "—"}</span>
      <span aria-hidden="true" className="text-[#98A2B3]">
        →
      </span>
      <span className="font-bold text-[#0D2B4D]">{to ? STATE_LABELS[to] : "—"}</span>
    </span>
  );
}

/** Résultat lisible d'une action, pour la colonne du même nom. */
function outcome(event: ActivityEvent): string {
  if (event.toState) return STATE_LABELS[event.toState];
  return event.comment ?? "Enregistré";
}

export function ActivityLog({
  events,
  role,
  variant = "compact",
  max,
}: {
  events: ActivityEvent[];
  role: BackofficeRole;
  variant?: "compact" | "full";
  max?: number;
}) {
  const shown = typeof max === "number" ? events.slice(0, max) : events;

  if (shown.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-xs text-[#98A2B3]">
        Aucune activité enregistrée sur le périmètre.
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <ul className="divide-y divide-[#EDF1F6]">
        {shown.map((event) => (
          <li key={event.id} className="flex items-start gap-3 py-3">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#174A7C] shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#0D2B4D] leading-snug">
                {event.action}
              </p>
              <p className="text-[11px] text-[#5B6776] mt-0.5 truncate">
                {event.studentName} ·{" "}
                <Link
                  href={dossierHref(role, event.dossierRef)}
                  className="font-mono hover:text-[#174A7C] hover:underline"
                >
                  {event.dossierRef}
                </Link>
              </p>
              <p className="text-[10px] text-[#98A2B3] mt-0.5">
                {event.atLabel} · {event.user} ({event.userRole}) · {outcome(event)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Registre chronologique des opérations du périmètre
        </caption>
        <thead>
          <tr className="bg-[#FAFCFE] border-b border-[#E6E9EF]">
            {[
              "Date / heure",
              "ID-POMRA",
              "Étudiant",
              "Action",
              "Ancien statut",
              "Nouveau statut",
              "Utilisateur",
              "Commentaire",
            ].map((label) => (
              <th
                key={label}
                scope="col"
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#667085] whitespace-nowrap"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EDF1F6]">
          {shown.map((event) => (
            <tr key={event.id} className="hover:bg-[#FAFCFE]">
              <td className="px-4 py-3 text-[11px] text-[#5B6776] whitespace-nowrap tabular-nums">
                {event.atLabel}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link
                  href={dossierHref(role, event.dossierRef)}
                  className="text-[11px] font-mono font-semibold text-[#174A7C] hover:underline"
                >
                  {event.dossierRef}
                </Link>
              </td>
              <td className="px-4 py-3 text-xs font-semibold text-[#0D2B4D] whitespace-nowrap">
                {event.studentName}
              </td>
              <td className="px-4 py-3 text-xs text-[#1F2937]">{event.action}</td>
              <td className="px-4 py-3 text-[11px] text-[#667085] whitespace-nowrap">
                {event.fromState ? STATE_LABELS[event.fromState] : "—"}
              </td>
              <td className="px-4 py-3 text-[11px] font-bold text-[#0D2B4D] whitespace-nowrap">
                {event.toState ? STATE_LABELS[event.toState] : "—"}
              </td>
              <td className="px-4 py-3 text-[11px] text-[#5B6776] whitespace-nowrap">
                {event.user}
                <span className="block text-[10px] text-[#98A2B3]">{event.userRole}</span>
              </td>
              <td className="px-4 py-3 text-[11px] text-[#5B6776] max-w-[220px]">
                {event.comment ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Vue condensée d'une transition, réutilisée par la fiche dossier. */
export function StateTransitionInline({
  from,
  to,
}: {
  from: ActivityEvent["fromState"];
  to: ActivityEvent["toState"];
}) {
  return <StateTransition from={from} to={to} />;
}

export default ActivityLog;
