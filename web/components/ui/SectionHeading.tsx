import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
  /**
   * Niveau du titre. `h2` par défaut : la page porte déjà son `h1`, et sauter
   * directement au `h3` casserait la hiérarchie annoncée aux lecteurs d'écran.
   */
  as?: "h2" | "h3";
  className?: string;
}

/**
 * Titre de section du portail Parent, avec action facultative à droite.
 *
 * Regroupe le titre, le sous-titre et le lien d'action pour que l'espacement
 * reste identique d'une section à l'autre — c'est le principal reproche fait
 * aux tableaux de bord construits section par section.
 */
export function SectionHeading({
  title,
  description,
  action,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <Tag className="text-base font-bold text-[#0D2B4D] tracking-tight">
          {title}
        </Tag>
        {description ? (
          <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export default SectionHeading;
