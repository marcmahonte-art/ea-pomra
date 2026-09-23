import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Couples libellé / valeur affichés sous le titre (périmètre, période…). */
  meta?: { label: string; value: string }[];
  actions?: ReactNode;
}

/**
 * En-tête de page du back-office.
 *
 * Porte le **seul `<h1>`** de la page : l'en-tête de la coquille n'affiche
 * qu'un fil d'ariane et un `<p>`. Deux `<h1>` concurrents sur une même page
 * cassent la navigation par titres des lecteurs d'écran, et c'est l'erreur la
 * plus fréquente dans un tableau de bord construit section par section.
 *
 * Le périmètre (spec §7 : « le BEC doit disposer d'une indication claire de son
 * périmètre global / 8 pays ») est rendu ici plutôt que dans la coquille, pour
 * qu'il apparaisse sur chaque page et pas seulement sur le tableau de bord.
 */
export function PageHeader({ title, subtitle, meta, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-[#5B6776] mt-1">{subtitle}</p> : null}

        {meta && meta.length > 0 ? (
          <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {meta.map((item) => (
              <div key={item.label} className="flex items-baseline gap-1.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                  {item.label}
                </dt>
                <dd className="text-xs font-bold text-[#0D2B4D]">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </header>
  );
}

export default PageHeader;
