"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { FileDown, Upload, Share2, Check } from "lucide-react";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";

export function QuickActions() {
  const [parentShared, setParentShared] = useState(false);

  const handleShareWithParent = () => {
    setParentShared(true);
    setTimeout(() => setParentShared(false), 3000);
  };

  return (
    <Card className="border-[#E6E9EF] shadow-eap-soft">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-bold text-sm text-[#0D2B4D] uppercase tracking-wider pb-2 border-b border-[#EDF1F6]">Actions Rapides & Services Clés</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button onClick={() => alert(`Téléchargement de la quittance STSS #${MOCK_ACTIVE_STUDENT.stssTransaction?.referenceCode}.`)} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#E8F6EF] border border-[#C5EBDA] text-left hover:bg-[#DCF2E6] transition-colors cursor-pointer group"><div className="w-10 h-10 rounded-lg bg-[#1EA362] text-white flex items-center justify-center shrink-0"><FileDown className="w-5 h-5" /></div><div><span className="text-xs font-bold text-[#0D2B4D] block">Attestation STSS</span><span className="text-[11px] text-[#5B6776]">Reçu officiel scolarité</span></div></button>
          <button onClick={() => alert("Formulaire de dépôt de pièce complémentaire.")} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#EBF3FA] border border-[#D5E5F5] text-left hover:bg-[#DEECF8] transition-colors cursor-pointer group"><div className="w-10 h-10 rounded-lg bg-[#174A7C] text-white flex items-center justify-center shrink-0"><Upload className="w-5 h-5" /></div><div><span className="text-xs font-bold text-[#0D2B4D] block">Déposer une pièce</span><span className="text-[11px] text-[#5B6776]">Billet d&apos;avion / Visa</span></div></button>
          <button onClick={handleShareWithParent} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F0F3F7] border border-[#E6E9EF] text-left hover:bg-[#E5EAEF] transition-colors cursor-pointer group"><div className="w-10 h-10 rounded-lg bg-[#0D2B4D] text-white flex items-center justify-center shrink-0">{parentShared ? <Check className="w-5 h-5 text-[#1EA362]" /> : <Share2 className="w-5 h-5" />}</div><div><span className="text-xs font-bold text-[#0D2B4D] block">{parentShared ? "Lien envoyé !" : "Partage Famille"}</span><span className="text-[11px] text-[#5B6776]">Synchroniser avec M. Traoré</span></div></button>
        </div>
      </CardContent>
    </Card>
  );
}
