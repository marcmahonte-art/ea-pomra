import { HeartHandshake, Phone, Mail, Lock, MessageSquare } from "lucide-react";
import type { PapSummary, WellbeingLevel } from "@/lib/parent-types";

const WELLBEING: Record<
  WellbeingLevel,
  { className: string; dot: string }
> = {
  SERENE: {
    className: "bg-[#E8F6EF] text-[#1EA362] border-[#C5EBDA]",
    dot: "bg-[#1EA362]",
  },
  ATTENTION: {
    className: "bg-[#FEF7EC] text-[#B86E00] border-[#FDE5C5]",
    dot: "bg-[#F59E0B]",
  },
  RENFORCE: {
    className: "bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]",
    dot: "bg-[#3B82F6]",
  },
};

/**
 * Suivi du Pôle PAP, dans sa version destinée à la famille.
 *
 * Ce composant ne peut pas divulguer le contenu des entretiens : le type
 * `PapSummary` qu'il reçoit n'en contient aucun champ. La confidentialité est
 * donc garantie en amont, par la projection serveur `toPapSummary()`, et non
 * par une condition d'affichage qu'un correctif pourrait retirer par
 * inadvertance.
 */
export function PapCard({ pap }: { pap: PapSummary }) {
  const wellbeing = WELLBEING[pap.wellbeingLevel];

  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
      <header className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
        <div>
          <h2 className="text-sm font-bold text-[#0D2B4D]">
            Accompagnement humain (PAP)
          </h2>
          <p className="text-xs text-[#5B6776] mt-0.5">
            Dernier contact : {pap.lastCheckIn}
          </p>
        </div>
        <HeartHandshake className="w-5 h-5 text-[#B86E00] shrink-0" />
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1 rounded-full border ${wellbeing.className}`}
        >
          <span className={`w-2 h-2 rounded-full ${wellbeing.dot}`} />
          {pap.wellbeingLabel}
        </span>
        {pap.supportPlanActive ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border bg-[#EBF3FA] text-[#174A7C] border-[#D5E5F5]">
            Plan de soutien actif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border bg-[#F0F3F7] text-[#5B6776] border-[#E6E9EF]">
            Suivi de routine
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-[#E6E9EF] bg-[#FAFCFE] p-4 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E9BAA]">
          Référent local
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#0D2B4D]">{pap.referentName}</p>
            <p className="text-[11px] text-[#5B6776] mt-0.5">
              {pap.referentTitle}
            </p>
            <p className="text-[11px] text-[#8E9BAA] mt-1">
              {pap.exchangesCount} échange{pap.exchangesCount > 1 ? "s" : ""}{" "}
              depuis l&apos;arrivée
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${pap.referentPhone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-[11px] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Appeler
            </a>
            <a
              href={`mailto:${pap.referentEmail}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E6E9EF] hover:bg-[#F7F9FB] text-[#0D2B4D] text-[11px] font-bold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Écrire
            </a>
          </div>
        </div>
      </div>

      {/* Rappel de la règle de confidentialité, tel que fourni par les données. */}
      <div className="rounded-2xl bg-[#F0F3F7] border border-[#E6E9EF] p-4 flex items-start gap-3">
        <Lock className="w-4 h-4 text-[#5B6776] mt-0.5 shrink-0" />
        <p className="text-[11px] text-[#5B6776] leading-relaxed">
          {pap.confidentialityNotice}
        </p>
      </div>

      <p className="text-[11px] text-[#5B6776] flex items-start gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-[#8E9BAA] mt-0.5 shrink-0" />
        Pour signaler une situation préoccupante, contactez directement la
        référente ou votre antenne : le pôle traite chaque signalement sous 24 h.
      </p>
    </section>
  );
}

export default PapCard;
