"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartHandshake, Phone, MessageSquare, ShieldCheck, Home, Plane, Heart, Plus } from "lucide-react";

export default function DemandesPapPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("Aide à la recherche de logement");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Pôle PAP</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-[#C89C2E]" />
            Mes Demandes PAP — Prévention, Accueil et Proximité
          </h1>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C89C2E] hover:bg-[#A68021] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle demande PAP</span>
        </button>
      </div>

      {submitted && (
        <div className="p-4 bg-[#EBF7F0] border border-[#C5EBDA] text-[#1EA362] rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>✅ Votre demande d&apos;accompagnement a été transmise à votre référente PAP. Vous recevrez une réponse sous 12h.</span>
          <button onClick={() => setSubmitted(false)} className="underline cursor-pointer">Fermer</button>
        </div>
      )}

      {/* Fiche Référente Attitrée */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FBF6EA] text-[#C89C2E] flex items-center justify-center font-bold text-xl">
              EN
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0D2B4D]">Mme Élodie N&apos;Guessan</h2>
              <p className="text-xs text-[#5B6776]">Responsable Référente Pôle PAP — Antenne Côte d&apos;Ivoire (Abidjan)</p>
              <div className="flex items-center gap-1.5 text-xs text-[#1EA362] font-semibold mt-1">
                <span className="w-2 h-2 rounded-full bg-[#1EA362] animate-pulse"></span>
                Disponible pour échange confidentiel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+2250749112233"
              className="px-4 py-2 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-xs font-bold flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler (+225 07 49 11 22 33)</span>
            </a>
            <a
              href="https://wa.me/2250749112233"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white text-xs font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <p className="text-xs text-[#5B6776] leading-relaxed">
          Le Pôle d&apos;Accompagnement Psychosocial (PAP) veille au bien-être des étudiants en mobilité : intégration culturelle, hébergement, santé et soutien moral confidentiel.
        </p>
      </div>

      {/* Domaines d'accompagnement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs space-y-2">
          <Plane className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-xs font-bold text-[#0D2B4D]">Accueil & Installation</h3>
          <p className="text-[11px] text-[#5B6776]">Prise en charge dès l&apos;aéroport d&apos;Abidjan Félix Houphouët-Boigny et orientation sur campus.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs space-y-2">
          <Home className="w-5 h-5 text-[#D97706]" />
          <h3 className="text-xs font-bold text-[#0D2B4D]">Résidence & Logement</h3>
          <p className="text-[11px] text-[#5B6776]">Accès aux résidences universitaires homologuées et collocations sécurisées.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs space-y-2">
          <Heart className="w-5 h-5 text-[#1EA362]" />
          <h3 className="text-xs font-bold text-[#0D2B4D]">Écoute & Mentorat Pair</h3>
          <p className="text-[11px] text-[#5B6776]">Parrainage par un étudiant aîné pour réussir son intégration académique et sociale.</p>
        </div>
      </div>

      {/* Modal / Formulaire de nouvelle demande */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[#E6E9EF]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h3 className="font-bold text-base text-[#0D2B4D]">Formulaire d&apos;accompagnement PAP</h3>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0D2B4D] uppercase">Motif de la demande</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] font-semibold text-[#0D2B4D] focus:outline-none"
                >
                  <option value="Aide à la recherche de logement">Aide à la recherche de logement</option>
                  <option value="Accueil aéroport d'arrivée">Accueil à l&apos;arrivée (aéroport/gare)</option>
                  <option value="Besoin d'écoute / soutien moral">Besoin d&apos;écoute / soutien moral</option>
                  <option value="Démarches administratives / visa">Démarches administratives locales</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D2B4D] uppercase">Précisez votre situation</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez en quelques lignes votre besoin..."
                  className="w-full p-3 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E6E9EF] text-slate-600 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C89C2E] hover:bg-[#A68021] text-white font-bold cursor-pointer"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
