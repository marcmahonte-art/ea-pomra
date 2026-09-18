import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { ANTENNES_EA_POMRA } from "@/lib/data";
import { Clock, HeartHandshake, Mail, MapPin } from "lucide-react";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  "Une question sur une candidature, un transfert de scolarité ou un partenariat ? Votre antenne nationale est votre point de contact privilégié."
);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        breadcrumb="Contact"
        title="Parlons de votre projet académique"
        description="Une question sur une candidature, un transfert de scolarité ou un partenariat ? Votre antenne nationale est votre point de contact privilégié."
      />

      <section className="py-16 sm:py-20 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Informations */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-2xl border border-[#E6E9EF] p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#EBF3FA] text-[#174A7C] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0D2B4D]">Délai de réponse</h3>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Les demandes sont traitées par l&apos;antenne concernée. L&apos;avis
                  d&apos;orientation du pôle OCO est délivré sous 72 heures après réception
                  d&apos;un dossier complet.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6E9EF] p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0D2B4D]">
                  Urgence & accompagnement psychosocial
                </h3>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Le pôle PAP met à disposition un canal d&apos;écoute confidentiel accessible
                  24 heures sur 24 et 7 jours sur 7, ainsi qu&apos;un référent local pour les
                  étudiants déjà sur place.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6E9EF] p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#174A7C]" />
                  <h3 className="text-sm font-bold text-[#0D2B4D]">
                    Écrire directement à une antenne
                  </h3>
                </div>

                <ul className="space-y-2">
                  {ANTENNES_EA_POMRA.map((antenne) => (
                    <li key={antenne.id}>
                      <a
                        href={`mailto:${antenne.email}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F7F9FB] transition-colors group"
                      >
                        <span className="text-lg shrink-0">{antenne.flag}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-[#0D2B4D] truncate">
                            {antenne.country}
                          </span>
                          <span className="block text-[11px] text-[#8E9BAA] truncate">
                            {antenne.email}
                          </span>
                        </span>
                        <Mail className="w-3.5 h-3.5 text-[#8E9BAA] group-hover:text-[#174A7C] shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
