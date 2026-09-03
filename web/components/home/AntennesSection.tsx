"use client";

import React, { useState } from "react";
import { ANTENNES_EA_POMRA } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, User, Building, Users, ExternalLink } from "lucide-react";

export function AntennesSection() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("SN");

  const selectedAntenne =
    ANTENNES_EA_POMRA.find((a) => a.code === selectedCountryCode) ||
    ANTENNES_EA_POMRA[0];

  return (
    <section id="antennes" className="py-20 bg-[#F7F9FB] border-b border-[#E6E9EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="gold" size="md">
            Réseau Panafricain Connecté
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B4D] tracking-tight">
            8 Antennes Nationales sur le terrain
          </h2>
          <p className="text-base sm:text-lg text-[#5B6776]">
            Chaque antenne est dirigée par une équipe locale dédiée, garantissant l&apos;encadrement physique, la validation des dossiers et la relation avec les universités d&apos;accueil.
          </p>
        </div>

        {/* Sélecteur de pays en boutons onglets */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {ANTENNES_EA_POMRA.map((antenne) => {
            const isSelected = antenne.code === selectedCountryCode;
            return (
              <button
                key={antenne.code}
                onClick={() => setSelectedCountryCode(antenne.code)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#0D2B4D] text-white shadow-eap-card scale-105"
                    : "bg-white text-[#0D2B4D] border border-[#E6E9EF] hover:border-[#174A7C]/40 hover:bg-white"
                }`}
              >
                <span className="text-lg">{antenne.flag}</span>
                <span>{antenne.country}</span>
              </button>
            );
          })}
        </div>

        {/* Carte détaillée de l'antenne sélectionnée */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-[#174A7C]/20 shadow-eap-card bg-white">
            <CardContent className="p-8 sm:p-10 space-y-8">
              {/* Header Antenne */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EDF1F6]">
                <div className="flex items-center gap-4">
                  <div className="text-4xl sm:text-5xl p-3 bg-[#F0F5FA] rounded-2xl border border-[#E6E9EF]">
                    {selectedAntenne.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-[#0D2B4D]">
                        Antenne Nationale : {selectedAntenne.country}
                      </h3>
                      <Badge variant="success" size="sm">
                        Opérationnelle
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-[#5B6776] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-[#174A7C]" />
                      Siège local : {selectedAntenne.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#F7F9FB] px-4 py-2.5 rounded-xl border border-[#E6E9EF]">
                  <div className="text-center">
                    <span className="text-xl font-black text-[#0D2B4D] block">
                      {selectedAntenne.partnersCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#5B6776]">
                      Universités
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#E6E9EF]"></div>
                  <div className="text-center">
                    <span className="text-xl font-black text-[#1EA362] block">
                      {selectedAntenne.studentsCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#5B6776]">
                      Étudiants actifs
                    </span>
                  </div>
                </div>
              </div>

              {/* Coordonnateur & Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F0F5FA] p-5 rounded-2xl border border-[#D5E5F5] space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#174A7C]">
                    Direction de l&apos;antenne
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#174A7C] text-white flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D2B4D]">
                        {selectedAntenne.coordinator}
                      </h4>
                      <p className="text-xs text-[#5B6776]">
                        Coordonnateur National & Référent Institutionnel
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 justify-center flex flex-col">
                  <div className="flex items-center gap-3 text-sm text-[#0D2B4D]">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E9EF] flex items-center justify-center text-[#174A7C]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{selectedAntenne.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[#0D2B4D]">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E9EF] flex items-center justify-center text-[#174A7C]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#5B6776]">{selectedAntenne.email}</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[#0D2B4D]">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E9EF] flex items-center justify-center text-[#174A7C] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-[#5B6776] leading-snug">{selectedAntenne.address}</span>
                  </div>
                </div>
              </div>

              {/* Rôle local */}
              <div className="bg-[#FEF7EC] p-4 rounded-xl border border-[#FDE5C5] text-xs text-[#9A741A] flex items-center justify-between flex-wrap gap-2">
                <span>
                  📌 <strong>Rôle de cette antenne :</strong> Réception physique des familles, certification des diplômes originaux, encaissement local et émission de l&apos;attestation STSS.
                </span>
                <a
                  href={`mailto:${selectedAntenne.email}`}
                  className="font-bold underline hover:text-[#0D2B4D] inline-flex items-center gap-1"
                >
                  Prendre rendez-vous <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
