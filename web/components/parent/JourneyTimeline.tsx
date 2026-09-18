import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { JourneyStep } from "@/lib/parent-types";

/**
 * Frise compacte des cinq étapes, pour le tableau de bord.
 *
 * Rendu en liste ordonnée : la séquence fait partie du sens de l'information,
 * et un lecteur d'écran doit pouvoir l'annoncer comme telle.
 */
export function JourneyStepper({ journey }: { journey: JourneyStep[] }) {
  return (
    <ol className="grid grid-cols-5 gap-2">
      {journey.map((step) => {
        const done = step.state === "completed";
        const current = step.state === "current";

        return (
          <li key={step.id} className="flex flex-col items-center text-center gap-1.5">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                done
                  ? "bg-[#1EA362] text-white"
                  : current
                    ? "bg-[#3B82F6] text-white ring-4 ring-[#EBF3FA]"
                    : "bg-[#E6E9EF] text-[#8E9BAA]"
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : current ? (
                <Clock className="w-4 h-4" />
              ) : (
                step.order
              )}
            </span>
            <span
              className={`text-[11px] font-bold leading-tight ${
                current ? "text-[#3B82F6]" : done ? "text-[#0D2B4D]" : "text-[#8E9BAA]"
              }`}
            >
              {step.shortLabel}
            </span>
            <span className="text-[10px] text-[#8E9BAA] leading-tight">
              {step.date ?? "À venir"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const STATE_BADGES: Record<JourneyStep["state"], { label: string; className: string }> = {
  completed: { label: "Validée", className: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]" },
  current: { label: "En cours", className: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]" },
  upcoming: { label: "À venir", className: "bg-[#F0F3F7] text-[#5B6776] border-[#E6E9EF]" },
};

/**
 * Parcours détaillé, pour la page `/parent/parcours`.
 *
 * Le trait de liaison est rendu par une bordure sur la colonne des pastilles
 * plutôt que par un élément positionné en absolu : la hauteur du bloc de texte
 * varie selon la longueur de la description, et un trait absolu se
 * désalignedrait sur les étapes les plus bavardes.
 */
export function JourneyTimeline({ journey }: { journey: JourneyStep[] }) {
  return (
    <ol className="space-y-0">
      {journey.map((step, index) => {
        const badge = STATE_BADGES[step.state];
        const isLast = index === journey.length - 1;
        const done = step.state === "completed";
        const current = step.state === "current";

        return (
          <li key={step.id} className="flex gap-4">
            {/* Colonne pastille + trait */}
            <div className="flex flex-col items-center shrink-0">
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  done
                    ? "bg-[#1EA362] text-white"
                    : current
                      ? "bg-[#3B82F6] text-white ring-4 ring-[#EBF3FA]"
                      : "bg-[#E6E9EF] text-[#8E9BAA]"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4.5 h-4.5" />
                ) : current ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  step.order
                )}
              </span>
              {isLast ? null : (
                <span
                  className={`w-px flex-1 my-1 ${
                    done ? "bg-[#1EA362]/30" : "bg-[#E6E9EF]"
                  }`}
                />
              )}
            </div>

            {/* Contenu de l'étape */}
            <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-7"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm font-bold ${
                    step.state === "upcoming" ? "text-[#5B6776]" : "text-[#0D2B4D]"
                  }`}
                >
                  Étape {step.order} — {step.label}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>

              <p className="text-xs text-[#5B6776] leading-relaxed mt-1.5">
                {step.description}
              </p>

              <p className="text-[11px] text-[#8E9BAA] mt-2">
                {step.date ? <span className="font-semibold">{step.date}</span> : "Non datée"}
                {step.actor ? ` · ${step.actor}` : ""}
              </p>

              {step.items?.length ? (
                <ul className="mt-3 space-y-1.5">
                  {step.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-2 text-[11px] leading-snug"
                    >
                      {item.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1EA362] mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#B86E00] mt-0.5 shrink-0" />
                      )}
                      <span className="text-[#5B6776]">
                        <span className="font-semibold text-[#0D2B4D]">
                          {item.label} :
                        </span>{" "}
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default JourneyTimeline;
