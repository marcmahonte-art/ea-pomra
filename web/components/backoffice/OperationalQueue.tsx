import Link from "next/link";
import { ListChecks } from "lucide-react";
import type { BackofficeRole, Dossier } from "@/lib/backoffice-types";
import { dossiersHref } from "@/lib/backoffice-nav";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DossierTable } from "./DossierTable";
import { DossierCard } from "./DossierCard";

/**
 * File opérationnelle (spec §8.3).
 *
 * Bloc « Dossiers nécessitant une action ». Le tri est fait côté serveur par
 * `computeOperationalQueue()` : priorité décroissante, puis ancienneté de la
 * dernière mise à jour. L'antenne traite donc toujours le dossier le plus
 * urgent, et à urgence égale le plus ancien — un ordre stable, qui ne dépend
 * pas de l'ordre d'arrivée des données.
 */
export function OperationalQueue({
  dossiers,
  role,
  max = 5,
  showCountry = false,
}: {
  dossiers: Dossier[];
  role: BackofficeRole;
  max?: number;
  showCountry?: boolean;
}) {
  const shown = dossiers.slice(0, max);

  return (
    <section className="rounded-2xl border border-[#E6E9EF] bg-white shadow-eap-soft overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <SectionHeading
          title="Dossiers nécessitant une action"
          description={
            dossiers.length === 0
              ? "Aucun dossier n'attend d'action de l'antenne."
              : `${dossiers.length} dossier${dossiers.length > 1 ? "s" : ""} en attente de traitement, par priorité décroissante.`
          }
          action={
            dossiers.length > max ? (
              <Link
                href={dossiersHref(role)}
                className="text-xs font-bold text-[#174A7C] hover:underline whitespace-nowrap"
              >
                Voir les {dossiers.length} →
              </Link>
            ) : null
          }
        />
      </div>

      {shown.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState
            icon={ListChecks}
            title="Aucune action en attente"
            description="Tous les dossiers du périmètre ont été traités. Les nouveaux dossiers apparaîtront ici dès leur réception."
          />
        </div>
      ) : (
        <>
          <DossierTable
            rows={shown}
            role={role}
            variant="queue"
            showCountry={showCountry}
          />

          <ul className="lg:hidden p-4 pt-0 space-y-3">
            {shown.map((dossier) => (
              <li key={dossier.id}>
                <DossierCard
                  dossier={dossier}
                  role={role}
                  showCountry={showCountry}
                  actionLabel="Traiter"
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default OperationalQueue;
