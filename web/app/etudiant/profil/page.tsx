"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Building, ShieldCheck, Users, Edit3, Check } from "lucide-react";
import {
  MOCK_ACTIVE_STUDENT,
  STUDENT_FULL_NAME,
  STUDENT_INITIALS,
  STUDENT_HOME_ANTENNE,
  STUDENT_HOST_ANTENNE,
} from "@/lib/data";

export default function MonProfilPage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const student = MOCK_ACTIVE_STUDENT;
  const [phone, setPhone] = useState(student.phone);
  const [email, setEmail] = useState(student.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Mon profil</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <User className="w-6 h-6 text-[#174A7C]" />
            Profil Étudiant & Identité Sécurisée
          </h1>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E6E9EF] text-[#0D2B4D] hover:bg-[#F7F9FB] text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#174A7C]" />
          <span>{editing ? "Annuler l'édition" : "Modifier mes coordonnées"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-[#E8F6EF] border border-[#C5EBDA] text-[#1EA362] rounded-2xl text-xs font-bold flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <Check className="w-4 h-4" />
            Coordonnées mises à jour avec succès.
          </span>
        </div>
      )}

      {/* Carte d'identité et badge officiel */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EDF1F6]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0D2B4D] text-[#F7D070] font-black text-2xl flex items-center justify-center shadow-md">
              {STUDENT_INITIALS}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#0D2B4D]">{STUDENT_FULL_NAME}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F6EF] text-[#1EA362] text-xs font-bold">
                  Dossier Actif
                </span>
              </div>
              <p className="text-xs text-[#5B6776] mt-0.5">
                {student.program} • Promotion {student.academicYear}
              </p>
            </div>
          </div>

          <div className="bg-[#EBF3FA] px-4 py-2 rounded-2xl border border-[#D5E5F5]">
            <span className="text-[10px] font-bold text-[#174A7C] uppercase block">Identifiant officiel ID-POMRA</span>
            <span className="text-sm font-mono font-black text-[#0D2B4D]">{student.idPombra}</span>
          </div>
        </div>

        {/* Détails du profil */}
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#0D2B4D]">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D2B4D]">Numéro de téléphone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#174A7C] text-white font-bold cursor-pointer"
            >
              Enregistrer les modifications
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] space-y-1">
              <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Contact Étudiant</span>
              <div className="text-xs font-semibold text-[#0D2B4D] mt-1">{email}</div>
              <div className="text-xs text-[#5B6776]">{phone}</div>
            </div>

            <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] space-y-1">
              <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Nationalité & Antenne</span>
              <div className="text-xs font-semibold text-[#0D2B4D] mt-1">
                {student.originFlag} {student.originCountry}
              </div>
              <div className="text-xs text-[#5B6776]">
                Antenne de rattachement : {STUDENT_HOME_ANTENNE.city}
              </div>
            </div>

            <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] space-y-1">
              <span className="text-[11px] text-[#8E9BAA] font-bold uppercase">Parent Référent</span>
              <div className="text-xs font-semibold text-[#0D2B4D] mt-1">
                {student.parentContact.name}
              </div>
              <div className="text-xs text-[#5B6776]">
                Accès synchronisé Espace Parent
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parcours et rattachement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
          <h3 className="text-sm font-bold text-[#0D2B4D] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#174A7C]" />
            Mobilité académique
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
              <span className="text-[#8E9BAA] font-semibold">Pays d&apos;origine</span>
              <span className="font-bold text-[#0D2B4D] text-right">
                {student.originFlag} {student.originCountry}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
              <span className="text-[#8E9BAA] font-semibold">Pays d&apos;accueil</span>
              <span className="font-bold text-[#0D2B4D] text-right">
                {student.targetFlag} {student.targetCountry}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
              <span className="text-[#8E9BAA] font-semibold">Établissement d&apos;accueil</span>
              <span className="font-bold text-[#0D2B4D] text-right max-w-[60%]">
                {student.targetUniversity}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#8E9BAA] font-semibold">Niveau</span>
              <span className="font-bold text-[#0D2B4D] text-right">{student.degreeLevel}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
          <h3 className="text-sm font-bold text-[#0D2B4D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1EA362]" />
            Statut administratif
          </h3>
          <div className="p-4 bg-[#E8F6EF] border border-[#C5EBDA] rounded-2xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1EA362]">
              État du dossier
            </span>
            <p className="text-xs font-bold text-[#0D2B4D] leading-snug">
              {student.statusLabel}
            </p>
          </div>

          {student.stssTransaction && (
            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
                <span className="text-[#8E9BAA] font-semibold">Référence STSS</span>
                <span className="font-mono font-bold text-[#0D2B4D] text-right">
                  {student.stssTransaction.referenceCode}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[#8E9BAA] font-semibold">Montant sécurisé</span>
                <span className="font-bold text-[#1EA362] text-right">
                  {student.stssTransaction.amount.toLocaleString("fr-FR")}{" "}
                  {student.stssTransaction.currency}
                </span>
              </div>
            </div>
          )}

          <div className="p-4 bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] flex items-start gap-3">
            <Users className="w-4 h-4 text-[#174A7C] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9BAA]">
                Référente PAP
              </span>
              <p className="text-xs font-semibold text-[#0D2B4D]">
                {student.papReferent?.name}
              </p>
              <p className="text-[11px] text-[#5B6776]">
                {student.papReferent?.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
