"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, CheckCircle2, Clock, Calendar, MessageSquare, Award, Building2, BookOpen } from "lucide-react";

export function OrientationPage() {
  const [rdvBooked, setRdvBooked] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Orientation OCO</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <Compass className="w-6 h-6 text-[#174A7C]" />
            Pôle OCO — Orientation et Conseil aux Opportunités
          </h1>
        </div>

        <button
          onClick={() => setRdvBooked(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Prendre RDV avec un expert OCO</span>
        </button>
      </div>

      {rdvBooked && (
        <div className="p-4 bg-[#EBF7F0] border border-[#C5EBDA] text-[#1EA362] rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>✅ Demande d&apos;entretien enregistrée ! Un conseiller OCO vous contactera par WhatsApp sous 24h.</span>
          <button onClick={() => setRdvBooked(false)} className="underline cursor-pointer">Fermer</button>
        </div>
      )}

      {/* État de l'étude OCO */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#EDF1F6]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0D2B4D]">Étude OCO en cours d&apos;instruction</h2>
              <p className="text-xs text-[#5B6776]">Attribuée au comité académique Antenne Côte d&apos;Ivoire & Sénégal</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold">
            Délai estimé : 48h
          </span>
        </div>

        <p className="text-xs text-[#5B6776] leading-relaxed">
          Nos experts analysent vos relevés de notes du secondaire et votre projet professionnel pour valider la faisabilité de votre inscription en <strong>Licence Informatique</strong> et vous proposer les meilleures filières d&apos;excellence associées.
        </p>
      </div>

      {/* Filières et Débouchés Recommandés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#E6E9EF] shadow-eap-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#1EA362] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0D2B4D]">Génie Logiciel & Développement Web</h3>
          <p className="text-xs text-[#5B6776]">Filière à très fort potentiel d&apos;embauche en Afrique de l&apos;Ouest. Taux d&apos;insertion : 94% à 6 mois.</p>
          <div className="pt-2 text-[11px] font-bold text-[#1EA362]">Recommandation : Priorité 1</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6E9EF] shadow-eap-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0D2B4D]">Intelligence Artificielle & Data Science</h3>
          <p className="text-xs text-[#5B6776]">Spécialisation d&apos;avenir en collaboration avec les centres de recherche de Côte d&apos;Ivoire et du Sénégal.</p>
          <div className="pt-2 text-[11px] font-bold text-[#2563EB]">Recommandation : Priorité 2</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6E9EF] shadow-eap-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0D2B4D]">Cybersécurité & Réseaux Télécoms</h3>
          <p className="text-xs text-[#5B6776]">Forte demande bancaire et des opérateurs télécoms (Airtel, Moov, Orange).</p>
          <div className="pt-2 text-[11px] font-bold text-[#D97706]">Recommandation : Optionnelle</div>
        </div>
      </div>
    </div>
  );
}

export default OrientationPage;
