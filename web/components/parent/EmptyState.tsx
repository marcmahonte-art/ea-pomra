import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/**
 * État vide explicite.
 *
 * Un état vide n'est jamais un espace blanc : il doit dire *pourquoi* il n'y a
 * rien et *ce qui va se passer ensuite*. Sans cela, un parent conclut à une
 * panne plutôt qu'à une attente normale.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-10 rounded-2xl border border-dashed border-[#E6E9EF] bg-[#FAFCFE]",
        className
      )}
    >
      <div className="w-11 h-11 rounded-full bg-[#F0F3F7] text-[#8E9BAA] flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-bold text-[#0D2B4D]">{title}</p>
      <p className="text-xs text-[#5B6776] mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
