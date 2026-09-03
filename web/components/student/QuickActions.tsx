"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  HeartHandshake, 
  FileDown, 
  Upload, 
  Share2, 
  PhoneCall, 
  Check, 
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";

export function QuickActions() {
  const [papModalOpen, setPapModalOpen] = useState(false);
  const [parentShared, setParentShared] = useState(false);

  const handleShareWithParent = () => {
    setParentShared(true);
    setTimeout(() => setParentShared(false), 3000);
  };

  return (
    <>
      <Card className="border-[#E6E9EF] shadow-eap-soft">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#0D2B4D] uppercase tracking-wider pb-2 border-b border-[#EDF1F6]">
            Actions Rapides & Services Clés
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Action 1 : PAP */}
            <button
              onClick={() => setPapModalOpen(true)}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FBF6EA] border border-[#F4E4BC] text-left hover:bg-[#F7EDD2] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#C89C2E] text-white flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0D2B4D] block group-hover:text-[#C89C2E]">
                  Pôle PAP Écoute
                </span>
                <span className="text-[11px] text-[#5B6776]">
                  Joindre Mme N&apos;Guessan
                </span>
              </div>
            </button>

            {/* Action 2 : STSS */}
            <button
              onClick={() => alert(`Téléchargement de la quittance STSS #${MOCK_ACTIVE_STUDENT.stssTransaction?.referenceCode} pour l'INP-HB.`)}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#E8F6EF] border border-[#C5EBDA] text-left hover:bg-[#DCF2E6] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1EA362] text-white flex items-center justify-center shrink-0">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0D2B4D] block group-hover:text-[#1EA362]">
                  Attestation STSS
                </span>
                <span className="text-[11px] text-[#5B6776]">
                  Reçu officiel scolarité
                </span>
              </div>
            </button>

            {/* Action 3 : Pièce */}
            <button
              onClick={() => alert("Formulaire de dépôt de pièce complémentaire (Billet d'avion, Attestation de logement, Carnet de vaccination).")}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#EBF3FA] border border-[#D5E5F5] text-left hover:bg-[#DEECF8] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#174A7C] text-white flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0D2B4D] block group-hover:text-[#174A7C]">
                  Déposer une pièce
                </span>
                <span className="text-[11px] text-[#5B6776]">
                  Billet d&apos;avion / Visa
                </span>
              </div>
            </button>

            {/* Action 4 : Partage Parent */}
            <button
              onClick={handleShareWithParent}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F0F3F7] border border-[#E2E8F0] text-left hover:bg-[#E5EAEF] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0D2B4D] text-white flex items-center justify-center shrink-0">
                {parentShared ? <Check className="w-5 h-5 text-[#1EA362]" /> : <Share2 className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-[#0D2B4D] block group-hover:text-[#174A7C]">
                  {parentShared ? "Lien envoyé !" : "Partage Famille"}
                </span>
                <span className="text-[11px] text-[#5B6776]">
                  Synchroniser avec M. Traoré
                </span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modal PAP Écoute */}
      {papModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E6E9EF] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDF1F6]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF6EA] text-[#C89C2E] flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0D2B4D]">Pôle d&apos;Accompagnement PAP</h3>
                  <p className="text-xs text-[#5B6776]">Dispositif d&apos;écoute et de soutien étudiant</p>
                </div>
              </div>
              <button
                onClick={() => setPapModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#0D2B4D]">
              <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] space-y-2">
                <span className="text-xs font-bold uppercase text-[#174A7C]">
                  Votre Référente Personnelle Attitrée
                </span>
                <div className="font-bold text-base">{MOCK_ACTIVE_STUDENT.papReferent?.name}</div>
                <p className="text-xs text-[#5B6776]">{MOCK_ACTIVE_STUDENT.papReferent?.title}</p>
                <div className="text-xs text-[#1EA362] font-semibold pt-1">
                  ● En ligne • Disponible pour échange confidentiel
                </div>
              </div>

              <p className="text-xs text-[#5B6776] leading-relaxed">
                Le pôle PAP est là pour vous aider : recherche de logement, formalités de rentrée, questions de santé, moral ou démarches administratives locales à Abidjan/Yamoussoukro.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${MOCK_ACTIVE_STUDENT.papReferent?.phone}`}
                  className="flex items-center justify-center gap-2 p-3 bg-[#174A7C] text-white rounded-xl font-bold text-xs hover:bg-[#123B63] transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
                <a
                  href={`https://wa.me/2250749112233?text=Bonjour%20Mme%20N'Guessan,%20je%20suis%20Moussa%20Traoré%20(ID:%20SN-2026-8492)`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-[#1EA362] text-white rounded-xl font-bold text-xs hover:bg-[#17824E] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp PAP</span>
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EDF1F6] text-right">
              <Button variant="outline" size="sm" onClick={() => setPapModalOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
