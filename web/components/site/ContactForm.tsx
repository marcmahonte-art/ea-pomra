"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail, Phone } from "lucide-react";
import { ANTENNES_EA_POMRA } from "@/lib/data";

const OBJETS = [
  "Candidature & inscription",
  "Transfert de scolarité (STSS)",
  "Accompagnement psychosocial (PAP)",
  "Partenariat institutionnel",
  "Autre demande",
];

export function ContactForm() {
  const [envoye, setEnvoye] = useState(false);
  const [antenneCode, setAntenneCode] = useState(ANTENNES_EA_POMRA[0].code);

  const antenne =
    ANTENNES_EA_POMRA.find((a) => a.code === antenneCode) ?? ANTENNES_EA_POMRA[0];

  if (envoye) {
    return (
      <div className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FEF7EC] text-[#B86E00] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0D2B4D]">
              Formulaire en mode démonstration
            </h3>
            <p className="text-xs text-[#5B6776] leading-relaxed mt-1">
              Votre saisie a bien été prise en compte à l&apos;écran, mais aucun message n&apos;a été
              envoyé : la plateforme n&apos;est pas encore reliée à un serveur d&apos;envoi. Pour une
              demande réelle, contactez directement l&apos;antenne concernée.
            </p>
          </div>
        </div>

        <div className="bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] p-5 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9BAA]">
            Antenne {antenne.country}
          </span>
          <div className="space-y-2 text-xs text-[#5B6776]">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#174A7C] shrink-0" />
              <span className="font-semibold text-[#0D2B4D]">{antenne.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#174A7C] shrink-0" />
              <span>{antenne.email}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setEnvoye(false)}
          className="text-xs font-bold text-[#174A7C] hover:underline cursor-pointer"
        >
          Rédiger une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEnvoye(true);
      }}
      className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 sm:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="nom" className="text-xs font-bold text-[#0D2B4D]">
            Nom complet
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            placeholder="Ex. Awa Diallo"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] text-sm text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-[#0D2B4D]">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] text-sm text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="telephone" className="text-xs font-bold text-[#0D2B4D]">
            Téléphone / WhatsApp
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            placeholder="+221 77 000 00 00"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] text-sm text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="antenne" className="text-xs font-bold text-[#0D2B4D]">
            Antenne concernée
          </label>
          <select
            id="antenne"
            name="antenne"
            value={antenneCode}
            onChange={(e) => setAntenneCode(e.target.value as typeof antenneCode)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] text-sm text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
          >
            {ANTENNES_EA_POMRA.map((a) => (
              <option key={a.id} value={a.code}>
                {a.country} — {a.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="objet" className="text-xs font-bold text-[#0D2B4D]">
          Objet de la demande
        </label>
        <select
          id="objet"
          name="objet"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] text-sm text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
        >
          {OBJETS.map((objet) => (
            <option key={objet} value={objet}>
              {objet}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-bold text-[#0D2B4D]">
          Votre message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Décrivez votre situation et votre projet académique…"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E9EF] bg-[#F7F9FB] text-sm text-[#0D2B4D] focus:outline-none focus:border-[#174A7C] resize-y"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-sm font-bold transition-colors cursor-pointer"
      >
        <Send className="w-4 h-4" />
        Envoyer la demande
      </button>
    </form>
  );
}
