import Link from "next/link";
import {
  Compass,
  GraduationCap,
  ArrowLeftRight,
  FileText,
  MessageSquare,
} from "lucide-react";

const ACTIONS = [
  {
    href: "/parent/parcours",
    label: "Suivre le parcours",
    hint: "Les 5 étapes du dossier",
    icon: Compass,
    tone: "bg-[#EBF3FA] text-[#3B82F6] border-[#D5E5F5]",
  },
  {
    href: "/parent/scolarite",
    label: "Résultats & assiduité",
    hint: "Notes et crédits validés",
    icon: GraduationCap,
    tone: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
  },
  {
    href: "/parent/finances",
     label: "Aperçu STSS",
       hint: "Aperçus et échéances",
    icon: ArrowLeftRight,
    tone: "bg-[#FBF6EA] text-[#C89C2E] border-[#F4E4BC]",
  },
  {
    href: "/parent/documents",
    label: "Pièces du dossier",
     hint: "Aperçu des justificatifs",
    icon: FileText,
    tone: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
  },
  {
    href: "/parent/messages",
    label: "Écrire à l'antenne",
    hint: "Réponse sous 48 h ouvrées",
    icon: MessageSquare,
    tone: "bg-[#F0F3F7] text-[#0D2B4D] border-[#E6E9EF]",
  },
] as const;

/** Raccourcis vers les sections du portail. */
export function QuickActions() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <li key={action.href}>
            <Link
              href={action.href}
              className="h-full p-4 rounded-2xl bg-white border border-[#E6E9EF] shadow-eap-soft flex items-start gap-3 hover:border-[#D5E5F5] hover:shadow-eap-card transition-all"
            >
              <span
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${action.tone}`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-[#0D2B4D]">
                  {action.label}
                </span>
                <span className="block text-[11px] text-[#5B6776] mt-0.5">
                  {action.hint}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default QuickActions;
