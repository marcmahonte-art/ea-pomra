import {
  Inbox,
  FileSearch,
  AlertTriangle,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Plane,
  GraduationCap,
  Award,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
} from "lucide-react";
import type { Dossier, DossierState, Priority } from "@/lib/backoffice-types";
import { PRIORITY_LABELS, STATE_LABELS, STEP_LABELS } from "@/lib/backoffice-types";

/**
 * Représentations d'un statut de dossier.
 *
 * Spec §3 : « ne pas utiliser la couleur seule comme indicateur de statut ».
 * Chaque état porte donc une **icône** et un **libellé**, en plus de sa teinte.
 * Un daltonien, une impression noir et blanc ou un lecteur d'écran reçoivent
 * l'information complète.
 */
const STATE_STYLES: Record<DossierState, { className: string; Icon: typeof Inbox }> = {
  RECU: { className: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]", Icon: Inbox },
  EN_VERIFICATION: {
    className: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
    Icon: FileSearch,
  },
  INCOMPLET: {
    className: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]",
    Icon: AlertTriangle,
  },
  TRANSMIS_OCO: {
    className: "bg-[#F0F3F7] text-[#475467] border-[#E6E9EF]",
    Icon: Send,
  },
  AVIS_RECU: { className: "bg-[#FBF6EA] text-[#9A741A] border-[#F4E4BC]", Icon: MessageSquare },
  A_VALIDER: {
    className: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
    Icon: Clock,
  },
  VALIDE: { className: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]", Icon: CheckCircle2 },
  EN_MOBILITE: {
    className: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
    Icon: Plane,
  },
  EN_SUIVI: { className: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]", Icon: GraduationCap },
  DIPLOME: { className: "bg-[#E8F6EF] text-[#0D2B4D] border-[#C5EBDA]", Icon: Award },
  REJETE: { className: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]", Icon: XCircle },
};

export function DossierStatusBadge({
  state,
  size = "md",
}: {
  state: DossierState;
  size?: "sm" | "md";
}) {
  const { className, Icon } = STATE_STYLES[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${className} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} aria-hidden="true" />
      {STATE_LABELS[state]}
    </span>
  );
}

/**
 * Priorité opérationnelle (spec §8.3).
 *
 * Elle est volontairement distincte du statut : un dossier « À valider » n'est
 * pas urgent par nature, c'est l'échéance qui le rend prioritaire. La priorité
 * porte donc sa propre échelle, avec libellé et icône.
 */
const PRIORITY_STYLES: Record<Priority, { className: string; Icon: typeof Inbox }> = {
  HAUTE: { className: "bg-[#FDECEC] text-[#B42318] border-[#FAC6C6]", Icon: ArrowUpCircle },
  NORMALE: { className: "bg-[#F0F3F7] text-[#475467] border-[#E6E9EF]", Icon: MinusCircle },
  BASSE: { className: "bg-[#FAFCFE] text-[#98A2B3] border-[#E6E9EF]", Icon: ArrowDownCircle },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { className, Icon } = PRIORITY_STYLES[priority];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${className}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

const COMPLETENESS_TONE = (value: number) => {
  if (value === 100) return { bar: "bg-[#1EA362]", text: "text-[#1EA362]" };
  if (value >= 70) return { bar: "bg-[#F59E0B]", text: "text-[#B86E00]" };
  return { bar: "bg-[#EF4444]", text: "text-[#B42318]" };
};

/** Taux de complétude. La valeur chiffrée est toujours affichée à côté de la barre. */
export function CompletenessBar({ value, compact = false }: { value: number; compact?: boolean }) {
  const tone = COMPLETENESS_TONE(value);
  return (
    <span className="flex items-center gap-2 min-w-[92px]">
      <span
        className="h-1.5 flex-1 min-w-[44px] rounded-full bg-[#E6E9EF] overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Complétude : ${value} %`}
      >
        <span className={`block h-full rounded-full ${tone.bar}`} style={{ width: `${value}%` }} />
      </span>
      <span className={`text-[11px] font-bold tabular-nums ${tone.text}`}>
        {value}
        {compact ? "" : " %"}
      </span>
    </span>
  );
}

/** Frise des 5 étapes du workflow (spec §36). */
export function WorkflowStepper({ dossier }: { dossier: Dossier }) {
  const steps = ["CANDIDATURE", "ORIENTATION", "MOBILITE", "SUIVI", "DIPLOME"] as const;
  const currentIndex = steps.indexOf(dossier.step);

  return (
    <ol className="grid grid-cols-5 gap-1">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step} className="flex flex-col items-center gap-1.5 text-center">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                done
                  ? "bg-[#1EA362] text-white"
                  : current
                    ? "bg-[#174A7C] text-white ring-4 ring-[#EBF3FA]"
                    : "bg-[#F0F3F7] text-[#98A2B3]"
              }`}
            >
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
            </span>
            <span
              className={`text-[10px] font-semibold leading-tight ${
                current ? "text-[#174A7C]" : done ? "text-[#0D2B4D]" : "text-[#98A2B3]"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
