"use client";

import React from "react";
import Link from "next/link";
import {
  Folder,
  CheckCircle2,
  FileText,
  Download,
  ArrowLeft,
  UserCheck,
  Compass,
} from "lucide-react";
import {
  MOCK_ACTIVE_STUDENT,
  MOCK_TIMELINE_EVENTS,
  STUDENT_HOST_ANTENNE,
} from "@/lib/data";

const STATUT_STYLES: Record<string, { badge: string; puce: string }> = {
  completed: { badge: "bg-[#E8F6EF] text-[#1EA362]", puce: "bg-[#1EA362] text-white" },
  current: { badge: "bg-[#EBF3FA] text-[#3B82F6]", puce: "bg-[#3B82F6] text-white animate-pulse" },
  upcoming: { badge: "bg-[#F7F9FB] text-[#8E9BAA]", puce: "bg-[#E6E9EF] text-[#8E9BAA]" },
};

export default function MonDossierPage() {
  const student = MOCK_ACTIVE_STUDENT;
  // Le fichier de données est ordonné du plus récent au plus ancien.
  const etapes = [...MOCK_TIMELINE_EVENTS].reverse();

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
            Dossier de Candidature {student.idPombra}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/etudiant/documents"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E6E9EF] text-[#0D2B4D] hover:bg-[#F7F9FB] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#174A7C]" />
            <span>Mes pièces justificatives</span>
          </Link>
        </div>
      </div>

      {/* Résumé du dossier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Statut global</span>
          <div className="text-base font-black text-[#1EA362] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1EA362] animate-pulse"></span>
            Scolarité sécurisée STSS
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Programme & Filière</span>
          <div className="text-sm font-bold text-[#0D2B4D] mt-1">{student.degreeLevel}</div>
          <span className="text-[11px] text-[#5B6776]">
            Ingénierie des Systèmes Numériques &amp; IA
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Établissement cible</span>
          <div className="text-sm font-bold text-[#0D2B4D] mt-1 truncate">
            INP-HB — Yamoussoukro
          </div>
          <span className="text-[11px] text-[#5B6776]">
            Abidjan, {student.targetCountry}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E9EF] shadow-xs">
          <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Antenne d&apos;accueil</span>
          <div className="text-sm font-bold text-[#0D2B4D] mt-1 flex items-center gap-1.5">
            <span>{STUDENT_HOST_ANTENNE.flag}</span> {STUDENT_HOST_ANTENNE.country}
          </div>
          <span className="text-[11px] text-[#5B6776]">Réf : {STUDENT_HOST_ANTENNE.coordinator}</span>
        </div>
      </div>

      {/* Avis OCO */}
      {student.ocoFeedback && (
        <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h2 className="text-base font-bold text-[#0D2B4D] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#174A7C]" />
              Avis d&apos;orientation (pôle OCO)
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8F6EF] text-[#1EA362]">
              {student.ocoFeedback.verdict}
            </span>
          </div>

          <p className="text-xs text-[#5B6776] leading-relaxed">
            {student.ocoFeedback.comment}
          </p>

          <div className="pt-3 border-t border-[#EDF1F6] flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#8E9BAA]">
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#174A7C]" />
              {student.ocoFeedback.expertName}
            </span>
            <span>{student.ocoFeedback.date}</span>
          </div>
        </div>
      )}

      {/* Étapes du dossier */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-base font-bold text-[#0D2B4D]">Étapes de traitement du dossier</h2>
          <span className="text-[11px] text-[#8E9BAA]">
            {etapes.filter((e) => e.status === "completed").length} étape(s) terminée(s) sur{" "}
            {etapes.length}
          </span>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E6E9EF]">
          {etapes.map((etape, idx) => {
            const styles = STATUT_STYLES[etape.status];
            return (
              <div key={etape.title} className="relative pl-9 space-y-1">
                <div
                  className={`absolute left-1.5 top-1 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white text-[10px] font-bold ${styles.puce}`}
                >
                  {etape.status === "completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#0D2B4D]">{etape.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#8E9BAA]">{etape.date}</span>
                    {etape.badgeText && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}
                      >
                        {etape.badgeText}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#5B6776] leading-relaxed">{etape.description}</p>
                <div className="text-[11px] font-semibold text-[#174A7C] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{etape.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/etudiant/documents"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E6E9EF] text-[#0D2B4D] hover:bg-[#F7F9FB] text-xs font-bold transition-all shadow-xs"
        >
          <FileText className="w-4 h-4 text-[#174A7C]" />
          Pièces justificatives
        </Link>
        <Link
          href="/etudiant/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[#5B6776] hover:text-[#0D2B4D] text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
