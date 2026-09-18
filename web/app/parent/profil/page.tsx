import type { Metadata } from "next";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { buildParentDashboardData } from "@/lib/parent-data";
import { StudentSummaryCard } from "@/components/parent/StudentSummaryCard";
import { getParentSession } from "@/lib/parent-session";

export const metadata: Metadata = {
  title: "Mon profil",
  description:
    "Coordonnées du parent référent, dossier suivi et antenne de rattachement.",
};

/** Profil du parent et rattachement au dossier. */
export default async function ParentProfilPage() {
  const { parent, student } = await buildParentDashboardData();
  const session = await getParentSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Mon profil
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          Vos coordonnées et le dossier auquel vous êtes rattaché.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
          <h2 className="text-sm font-bold text-[#0D2B4D] pb-4 border-b border-[#EDF1F6]">
            Parent référent
          </h2>

          <dl className="space-y-4 text-xs">
            <div>
              <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                Nom
              </dt>
              <dd className="font-bold text-[#0D2B4D] mt-0.5">
                {parent.fullName}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                Lien avec l&apos;étudiant
              </dt>
              <dd className="font-bold text-[#0D2B4D] mt-0.5">
                {parent.relation}
              </dd>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Email
                </dt>
                <dd className="font-bold text-[#0D2B4D] mt-0.5">
                  {parent.email}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Téléphone
                </dt>
                <dd className="font-bold text-[#0D2B4D] mt-0.5">
                  {parent.phone}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
          <h2 className="text-sm font-bold text-[#0D2B4D] pb-4 border-b border-[#EDF1F6]">
            Antenne de rattachement
          </h2>

          <dl className="space-y-4 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Pays
                </dt>
                <dd className="font-bold text-[#0D2B4D] mt-0.5">
                  {parent.antenneFlag} {parent.antenneCountry}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                Téléphone
              </dt>
              <dd className="font-bold text-[#0D2B4D] mt-0.5">
                {parent.antennePhone}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                Email
              </dt>
              <dd className="font-bold text-[#0D2B4D] mt-0.5">
                {parent.antenneEmail}
              </dd>
            </div>
          </dl>

          {/* Information de sécurité, et non décoration : tant que la session
              n'est pas prouvée, il serait trompeur de laisser croire l'inverse. */}
          <div className="rounded-2xl bg-[#F0F3F7] border border-[#E6E9EF] p-4 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#5B6776] mt-0.5 shrink-0" />
            <p className="text-[11px] text-[#5B6776] leading-relaxed">
              {session?.isDemo
                ? "Session de démonstration : l'accès à cet espace n'est pas encore authentifié. La vérification d'identité sera activée avant la mise en production."
                : "Votre session est authentifiée. Elle n'autorise l'accès qu'au dossier référencé ci-dessous."}
            </p>
          </div>
        </section>
      </div>

      <StudentSummaryCard student={student} />
    </div>
  );
}
