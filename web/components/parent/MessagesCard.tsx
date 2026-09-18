import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { MessagePreview } from "@/lib/parent-types";

/**
 * Aperçu des derniers messages reçus.
 *
 * Volontairement en lecture seule : cette carte résume, elle ne répond pas.
 * La réponse se fait depuis la page Messages, où le fil complet est visible —
 * répondre depuis un aperçu tronqué conduit à des malentendus.
 */
export function MessagesCard({
  messages,
  max = 3,
}: {
  messages: MessagePreview[];
  max?: number;
}) {
  if (messages.length === 0) {
    return (
      <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6">
        <EmptyState
          icon={MessageSquare}
          title="Aucun message"
          description="Les échanges avec votre antenne et l'équipe d'accompagnement apparaîtront ici."
        />
      </section>
    );
  }

  const visible = messages.slice(0, max);

  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
      <header className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
        <h2 className="text-sm font-bold text-[#0D2B4D]">Messages récents</h2>
        <MessageSquare className="w-5 h-5 text-[#8E9BAA] shrink-0" />
      </header>

      <ul className="space-y-2">
        {visible.map((message) => (
          <li
            key={message.id}
            className={`rounded-2xl border p-4 ${
              message.read ? "border-[#E6E9EF]" : "border-[#D5E5F5] bg-[#FAFCFE]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0D2B4D]">
                  {message.subject}
                </p>
                <p className="text-[11px] text-[#5B6776] mt-0.5">
                  {message.from} · {message.fromRole}
                </p>
              </div>
              {!message.read ? (
                <span
                  className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0 mt-1"
                  aria-label="Non lu"
                />
              ) : null}
            </div>
            <p className="text-[11px] text-[#5B6776] leading-relaxed mt-2 line-clamp-2">
              {message.preview}
            </p>
            <p className="text-[10px] text-[#8E9BAA] mt-2">{message.date}</p>
          </li>
        ))}
      </ul>

      <Link
        href="/parent/messages"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A7C] hover:underline"
      >
        Ouvrir la messagerie
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}

export default MessagesCard;
