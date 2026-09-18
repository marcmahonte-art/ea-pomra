"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, ShieldCheck, Download, CheckCircle2, FileText, Building2, Plus, CreditCard } from "lucide-react";

export default function TransfertsStssPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Finances & STSS</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-[#1EA362]" />
            Dispositif STSS — Transfert Sécurisé de Scolarité
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Initier un transfert de scolarité</span>
        </button>
      </div>

      {/* Carte principale de synthèse STSS */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EDF1F6]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0D2B4D]">Fonds de scolarité protégés à 100%</h2>
              <p className="text-xs text-[#5B6776]">Opération certifiée par les trésoriers des antennes nationales</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E8F6EF] text-[#1EA362] text-xs font-bold border border-[#C5EBDA]">
            Garantie Anti-Fraude Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF]">
            <span className="text-xs text-[#8E9BAA] font-semibold">Montant total de scolarité</span>
            <div className="text-2xl font-black text-[#0D2B4D] mt-1">1 850 000 FCFA</div>
            <span className="text-[11px] text-[#1EA362] font-semibold">Statut : Quittance validée</span>
          </div>

          <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF]">
            <span className="text-xs text-[#8E9BAA] font-semibold">Établissement bénéficiaire</span>
            <div className="text-sm font-bold text-[#0D2B4D] mt-1">Agent comptable INP-HB</div>
            <span className="text-[11px] text-[#5B6776]">Compte Trésor Public CI</span>
          </div>

          <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF]">
            <span className="text-xs text-[#8E9BAA] font-semibold">Référence transaction</span>
            <div className="text-sm font-mono font-bold text-[#0D2B4D] mt-1">EA-STSS-INP-8492</div>
            <span className="text-[11px] text-[#5B6776]">Date : 14 Août 2026</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#E8F6EF] border border-[#C5EBDA] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-[#17824E] space-y-0.5">
            <p className="font-bold">Attestation STSS officielle disponible au format PDF sécurisé.</p>
            <p>Ce certificat est opposable pour la demande de visa et l&apos;inscription académique.</p>
          </div>
          <button
            onClick={() => alert("Téléchargement de l'attestation certifiée STSS (PDF signé électroniquement).")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger quittance STSS</span>
          </button>
        </div>
      </div>

      {/* Modal Demande Transfert */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E6E9EF]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h3 className="font-bold text-base text-[#0D2B4D]">Demande de virement STSS</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-[#5B6776]">
              Pour déposer des fonds de scolarité en monnaie locale auprès de votre antenne nationale (par Mobile Money ou virement bancaire), veuillez contacter le trésorier national de votre antenne.
            </p>
            <div className="p-3 bg-[#F7F9FB] rounded-xl text-xs space-y-1">
              <p><strong>Antenne Côte d&apos;Ivoire :</strong> +225 07 88 12 45 90</p>
              <p><strong>Antenne Sénégal :</strong> +221 77 450 12 34</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0D2B4D] text-white font-bold text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
