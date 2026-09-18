import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import { buildParentDashboardData } from "@/lib/parent-data";
import { MessagesCard } from "@/components/parent/MessagesCard";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Échanges avec votre antenne et l'équipe d'accompagnement du dossier.",
};

/** Messagerie du portail. */
export default async function ParentMessagesPage() {
  const { messages, parent, student } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          {messages.length} message{messages.length > 1 ? "s" : ""} au sujet du
          dossier de {student.displayName}.
        </p>
      </div>

      <MessagesCard messages={messages} max={messages.length} />

      {/* L'envoi de messages n'est pas encore implémenté : plutôt qu'un champ de
          saisie inerte, on oriente vers un canal qui fonctionne réellement. */}
      <section className="bg-[#EBF3FA] border border-[#D5E5F5] rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#0D2B4D]">
          Écrire à votre antenne
        </h2>
        <p className="text-xs text-[#5B6776] leading-relaxed">
          L&apos;envoi de messages depuis cet espace n&apos;est pas encore
          disponible. En attendant, votre antenne {parent.antenneCountry} reste
          joignable directement — réponse sous 48 h ouvrées.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={`tel:${parent.antennePhone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-xs font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            {parent.antennePhone}
          </a>
          <a
            href={`mailto:${parent.antenneEmail}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E6E9EF] hover:bg-[#F7F9FB] text-[#0D2B4D] text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {parent.antenneEmail}
          </a>
        </div>
      </section>
    </div>
  );
}
