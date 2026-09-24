"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Mail, MapPin, ChevronDown, ChevronUp, Download, MessageSquare } from "lucide-react";
import { ANTENNES_EA_POMRA } from "@/lib/data";

export default function AideFaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment puis-je obtenir mon attestation officielle de virement STSS ?",
      a: "Dès que le versement de vos droits de scolarité est confirmé par le trésorier national de votre antenne de départ, votre attestation officielle est automatiquement générée et certifiée avec QR code dans l'onglet 'Transferts STSS'. Vous pouvez la télécharger à tout moment au format PDF.",
    },

    {
      q: "Mes parents peuvent-ils suivre mes résultats académiques ?",
      a: "Vos parents disposent d'un Espace Parent dédié synchronisé. Ils reçoivent un rapport trimestriel sur votre assiduité et vos progrès académiques validés avec l'antenne, garantissant ainsi le lien de confiance familial.",
    },
    {
      q: "Que faire en cas d'urgence médicale ou de problème d'hébergement ?",
      a: "Contactez le secrétariat de votre antenne d'accueil ou le point focal local indiqué dans votre espace. Ne transmettez pas de documents sensibles par un canal non sécurisé.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="pb-4 border-b border-[#E6E9EF]">
        <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
          <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
          <span>/</span>
          <span className="text-[#174A7C] font-semibold">Aide & FAQ</span>
        </div>
        <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-[#174A7C]" />
          Centre d&apos;Assistance & Questions Fréquentes
        </h1>
      </div>

      {/* Cartes d'urgence et support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0D2B4D] text-white p-6 rounded-3xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1EA362]">Assistance antenne</span>
          <h2 className="text-xl font-bold">Contact local</h2>
          <p className="text-xs text-slate-300">En cas d&apos;urgence lors de votre mobilité, contactez le point focal de l&apos;antenne d&apos;accueil.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6E9EF] shadow-eap-soft space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#174A7C]">Support Antenne Côte d&apos;Ivoire</span>
          <h2 className="text-xl font-bold text-[#0D2B4D]">Secrétariat des Étudiants</h2>
          <p className="text-xs text-[#5B6776]">Pour toute question administrative ou relative à votre dossier d&apos;admission.</p>
          <div className="pt-2 flex items-center gap-3">
            <a
              href="mailto:antenne.ci@ea-pomra.org"
              className="px-4 py-2 rounded-xl bg-[#174A7C] text-white font-bold text-xs inline-flex items-center gap-2 hover:bg-[#123B63]"
            >
              <Mail className="w-4 h-4" />
              <span>antenne.ci@ea-pomra.org</span>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-4">
        <h2 className="text-base font-bold text-[#0D2B4D] mb-4">Questions Fréquemment Posées</h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-[#EDF1F6] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#0D2B4D] flex items-center justify-between gap-4 bg-[#F7F9FB] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#174A7C] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#8E9BAA] shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-[#5B6776] leading-relaxed bg-white border-t border-[#EDF1F6]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordonnées des 8 Antennes */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-4">
        <h2 className="text-base font-bold text-[#0D2B4D]">Permanences des 8 Antennes Nationales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ANTENNES_EA_POMRA.map((antenne) => (
            <div key={antenne.code} className="p-3.5 rounded-2xl bg-[#F7F9FB] border border-[#EDF1F6] space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#0D2B4D]">
                <span>{antenne.flag}</span>
                <span>{antenne.country}</span>
              </div>
              <p className="text-[11px] text-[#5B6776]">{antenne.coordinator}</p>
              <p className="text-[11px] font-mono text-[#174A7C] font-semibold">{antenne.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
