import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AntennesSection } from "@/components/home/AntennesSection";
import { CtaBand } from "@/components/site/CtaBand";
import { ANTENNES_EA_POMRA } from "@/lib/data";
import { MapPin, Phone, Mail, User } from "lucide-react";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Nos 8 antennes",
  "Huit antennes nationales en Afrique de l'Ouest et Centrale : encadrement des familles, validation des dossiers et relation directe avec les universités d'accueil."
);

const ROLES = [
  {
    titre: "Réception des familles",
    texte:
      "Accueil physique, explication du dispositif et vérification des pièces originales avant tout engagement financier.",
  },
  {
    titre: "Certification documentaire",
    texte:
      "Contrôle de conformité des diplômes, relevés de notes et pièces d'identité, puis numérisation sécurisée dans le dossier.",
  },
  {
    titre: "Préparation locale (STSS)",
    texte:
      "Présentation du scénario de scolarité et de son rattachement au code ID-POMRA, sans dépôt ni quittance dans cette version.",
  },
  {
    titre: "Relation universités",
    texte:
      "Interface avec les établissements d'accueil partenaires pour l'inscription, l'hébergement et le suivi académique.",
  },
];

export default function AntennesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Antennes"
        breadcrumb="Antennes"
        title="Huit antennes nationales, une seule communauté d'étudiants"
        description="Chaque antenne est dirigée par une équipe locale dédiée : encadrement physique des familles, validation des dossiers et relation directe avec les universités d'accueil."
      />

      {/* Sélecteur interactif des 8 antennes */}
      <AntennesSection />

      {/* Rôle d'une antenne */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
               Le rôle d&apos;une antenne sur le terrain
            </h2>
            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
               L&apos;antenne est le point de contact physique du réseau. C&apos;est elle qui matérialise la
               confiance entre la famille, l&apos;étudiant et l&apos;établissement d&apos;accueil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLES.map((role) => (
              <div key={role.titre} className="bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] p-6 space-y-3">
                <h3 className="text-sm font-bold text-[#0D2B4D]">{role.titre}</h3>
                <p className="text-xs text-[#5B6776] leading-relaxed">{role.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coordonnées des 8 antennes */}
      <section className="py-16 sm:py-20 bg-[#F7F9FB] border-t border-[#E6E9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight mb-12">
            Coordonnées du réseau
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ANTENNES_EA_POMRA.map((antenne) => (
              <div
                key={antenne.id}
                className="bg-white rounded-2xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EDF1F6]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl">{antenne.flag}</span>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[#0D2B4D] truncate">
                        {antenne.country}
                      </h3>
                      <p className="text-[11px] text-[#8E9BAA] truncate">{antenne.city}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#1EA362] bg-[#E8F6EF] border border-[#C5EBDA] px-2.5 py-1 rounded-full shrink-0">
                    Opérationnelle
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#5B6776]">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#174A7C] shrink-0" />
                    <span className="font-semibold text-[#0D2B4D]">{antenne.coordinator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#174A7C] shrink-0" />
                    <span>{antenne.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#174A7C] shrink-0" />
                    <span className="truncate">{antenne.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#174A7C] shrink-0 mt-0.5" />
                    <span className="leading-snug">{antenne.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Une question sur votre antenne ?"
        description="Chaque antenne dispose d'un coordonnateur national joignable pour vous accompagner, vous et votre famille."
        primaryLabel="Nous contacter"
        primaryHref="/contact"
        secondaryLabel="Voir les programmes"
        secondaryHref="/programmes"
      />
    </>
  );
}
