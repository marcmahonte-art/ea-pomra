"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  Copy, 
  Check, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  MapPin, 
  Users, 
  ArrowRight
} from "lucide-react";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";

export function StudentIdentityCard() {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(MOCK_ACTIVE_STUDENT.idPombra);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-2 border-[#174A7C]/20 shadow-eap-card bg-gradient-to-br from-white via-white to-[#F0F5FA] relative overflow-hidden">
      {/* Accent de couleur supérieur */}
      <div className="h-2 w-full bg-gradient-to-r from-[#174A7C] via-[#1EA362] to-[#C89C2E]"></div>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Ligne 1 : Identité & ID-POMRA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EDF1F6]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D2B4D] text-[#F7D070] font-black text-2xl flex items-center justify-center shadow-eap-soft border-2 border-white">
              MT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-[#0D2B4D]">
                  {MOCK_ACTIVE_STUDENT.firstName} {MOCK_ACTIVE_STUDENT.lastName}
                </h2>
                <Badge variant="success" size="sm">
                  Dossier Actif
                </Badge>
              </div>
              <p className="text-sm text-[#5B6776] mt-0.5">
                {MOCK_ACTIVE_STUDENT.degreeLevel} • {MOCK_ACTIVE_STUDENT.program}
              </p>
            </div>
          </div>

          {/* Badge ID-POMRA avec bouton Copier */}
          <div className="bg-[#EBF3FA] border border-[#D5E5F5] p-3 rounded-2xl flex items-center gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#174A7C]">
                Identifiant Officiel Sécurisé
              </div>
              <div className="text-base font-mono font-black text-[#0D2B4D]">
                {MOCK_ACTIVE_STUDENT.idPombra}
              </div>
            </div>
            <button
              onClick={copyId}
              className="p-2 rounded-xl bg-white hover:bg-[#F0F5FA] text-[#174A7C] border border-[#D5E5F5] transition-all cursor-pointer"
              title="Copier mon ID-POMRA"
            >
              {copied ? <Check className="w-4 h-4 text-[#1EA362]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ligne 2 : Détails de la mobilité (Origine -> Destination) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pays de départ */}
          <div className="bg-white p-4 rounded-xl border border-[#E6E9EF] space-y-1">
            <span className="text-[11px] font-bold text-[#8E9BAA] uppercase tracking-wider">
              Pays d&apos;origine & Famille
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-[#0D2B4D]">
              <span className="text-xl">{MOCK_ACTIVE_STUDENT.originFlag}</span>
              <span>{MOCK_ACTIVE_STUDENT.originCountry}</span>
              <span className="text-xs font-normal text-[#5B6776]">(Dakar)</span>
            </div>
          </div>

          {/* Pays de destination */}
          <div className="bg-white p-4 rounded-xl border border-[#E6E9EF] space-y-1">
            <span className="text-[11px] font-bold text-[#8E9BAA] uppercase tracking-wider">
              Pays de mobilité d&apos;accueil
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-[#0D2B4D]">
              <span className="text-xl">{MOCK_ACTIVE_STUDENT.targetFlag}</span>
              <span>{MOCK_ACTIVE_STUDENT.targetCountry}</span>
              <span className="text-xs font-normal text-[#5B6776]">(Yamoussoukro / Abidjan)</span>
            </div>
          </div>

          {/* Établissement d'accueil */}
          <div className="bg-white p-4 rounded-xl border border-[#E6E9EF] space-y-1">
            <span className="text-[11px] font-bold text-[#8E9BAA] uppercase tracking-wider">
              Établissement conventionné
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D2B4D]">
              <Building2 className="w-4 h-4 text-[#174A7C] shrink-0" />
              <span className="truncate">{MOCK_ACTIVE_STUDENT.targetUniversity}</span>
            </div>
          </div>
        </div>

        {/* Ligne 3 : Rassurance Parentale & Statut STSS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B6776] bg-[#F7F9FB] p-3.5 rounded-xl border border-[#EDF1F6]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C89C2E]" />
            <span>
              Espace Parent synchronisé avec <strong>{MOCK_ACTIVE_STUDENT.parentContact.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#1EA362] font-semibold">
            <ShieldCheck className="w-4 h-4" />
             <span>Scolarité affichée en simulation STSS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
