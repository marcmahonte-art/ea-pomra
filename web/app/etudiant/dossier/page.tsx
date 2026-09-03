"use client";

import React from "react";
import Link from "next/link";
import { Folder, CheckCircle2, Clock, FileText, Download, Building, ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";

export default function MonDossierPage() {
  const steps = [
    {
      title: "1. Dépôt initial et enregistrement",
      date: "12 Mars 2024 - 14:30",
      status: "completed",
      actor: "Candidat (Koffi Amadou)",
      comment: "Dossier créé en ligne et pièces académiques téléversées.",
    },
    {
      title: "2. Contrôle de conformité documentaire",
      date: "13 Mars 2024 - 09:15",
      status: "completed",
      actor: "Antenne Côte d'Ivoire (Dr. Kouamé Brou)",
      comment: "Bulletins de Terminale et Baccalauréat certifiés conformes aux originaux.",
    },
    {
      title: "3. Analyse d'adéquation et avis OCO",
      date: "En cours d'instruction",
      status: "current",
      actor: "Comité d'Orientation OCO",
      comment: "Évaluation du profil pour la Licence Informatique et validation des prérequis.",
    },
    {
      title: "4. Décision finale et notification officielle",
      date: "Planifié sous 48h",
      status: "upcoming",
      actor: "Bureau Exécutif Central (BEC)",
      comment: "Émission de l'attestation officielle d'admission et ouverture du volet STSS.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Mon dossier</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <Folder className="w-6 h-6 text-[#174A7C]" />
            Dossier de Candidature CI-2024-00125
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Génération du récapitulatif officiel PDF du dossier...")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E6E9EF] text-[#0D2B4D] hover:bg-[#F7F9FB] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#174A7C]" />
            <span>Exporter le récapitulatif</span>
          </button>
        </div>
      </div>

      {/* Résumé du dossier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Statut global</span>
          <div className="text-base font-black text-[#1EA362] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1EA362] animate-pulse"></span>
            En cours d&apos;analyse OCO
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Programme & Filière</span>
          <div className="text-sm font-bold text-[#0D2B4D] mt-1">Licence 1 Informatique</div>
          <span className="text-[11px] text-[#5B6776]">Systèmes & Réseaux</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Établissement cible</span>
          <div className="text-sm font-bold text-[#0D2B4D] mt-1 truncate">Univ. Félix Houphouët-Boigny</div>
          <span className="text-[11px] text-[#5B6776]">Abidjan, Côte d&apos;Ivoire</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Antenne d&apos;accueil</span>
          <div className="text-sm font-bold text-[#0D2B4D] mt-1 flex items-center gap-1.5">
            <span>🇨🇮</span> Côte d&apos;Ivoire
          </div>
          <span className="text-[11px] text-[#5B6776]">Réf : Dr. Kouamé Brou</span>
        </div>
      </div>

      {/* Étapes du dossier */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-6">
        <h2 className="text-base font-bold text-[#0D2B4D]">Étapes de traitement du dossier</h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E6E9EF]">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div key={idx} className="relative pl-9 space-y-1">
                <div
                  className={`absolute left-1.5 top-1 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                    isCompleted
                      ? "bg-[#1EA362] text-white"
                      : isCurrent
                      ? "bg-[#2563EB] text-white animate-pulse"
                      : "bg-[#E6E9EF] text-[#8E9BAA]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#0D2B4D]">{step.title}</h3>
                  <span className="text-xs font-semibold text-[#8E9BAA]">{step.date}</span>
                </div>

                <p className="text-xs text-[#5B6776] leading-relaxed">{step.comment}</p>
                <div className="text-[11px] font-semibold text-[#174A7C] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{step.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
