"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, User, CheckCheck, Paperclip } from "lucide-react";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";

const PRENOM = MOCK_ACTIVE_STUDENT.firstName;

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [inputText, setInputText] = useState("");

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Dr. Kouamé Brou",
      role: "Coordonnateur Antenne CI",
      avatar: "KB",
      unread: 1,
      messages: [
        { sender: "them", text: `Bonjour ${PRENOM}, nous avons bien réceptionné vos pièces complémentaires pour l'INP-HB.`, time: "Hier à 16:45" },
        { sender: "them", text: "Votre attestation de pré-inscription est en cours de validation finale auprès de la scolarité.", time: "Hier à 16:46" },
         { sender: "me", text: "Merci beaucoup Dr. Brou. Je comprends que STSS est affiché en simulation dans mon espace.", time: "Hier à 17:10" },
         { sender: "them", text: "Exactement, aucun paiement ni reçu officiel n'est disponible dans cette version.", time: "Ce matin à 09:30" },
      ],
    },

     {
       id: 2,
       name: "Service académique",
       role: "EA-POMRA",
       avatar: "EA",
       unread: 0,
       messages: [
         { sender: "them", text: `Bonjour ${PRENOM}, votre espace académique est à jour.`, time: "Il y a 3 jours" },
       ],
     },

  ]);

  const currentChat = conversations.find((c) => c.id === activeConv) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const updated = conversations.map((conv) => {
      if (conv.id === activeConv) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { sender: "me", text: inputText, time: "À l'instant" },
          ],
        };
      }
      return conv;
    });

    setConversations(updated);
    setInputText("");
  };

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="pb-4 border-b border-[#E6E9EF]">
        <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
          <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
          <span>/</span>
          <span className="text-[#174A7C] font-semibold">Messages</span>
        </div>
        <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-[#174A7C]" />
          Messagerie Directe EA-POMRA
        </h1>
      </div>

      {/* Interface Messagerie 2 colonnes */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Liste des discussions (4 cols) */}
        <div className="md:col-span-4 border-r border-[#EDF1F6] p-4 space-y-2">
          <span className="text-xs font-bold text-[#8E9BAA] uppercase px-2 block mb-3">Conversations</span>
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeConv === c.id ? "bg-[#EBF3FA] border border-[#D5E5F5]" : "hover:bg-[#F7F9FB]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#0D2B4D] text-[#F7D070] font-black flex items-center justify-center shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0D2B4D] truncate">{c.name}</h3>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#1EA362] text-white text-[10px] font-bold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5B6776] truncate">{c.role}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Zone de chat active (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between h-[550px]">
          {/* Header discussion */}
          <div className="p-4 border-b border-[#EDF1F6] flex items-center gap-3 bg-[#FAFCFE]">
            <div className="w-10 h-10 rounded-full bg-[#0D2B4D] text-[#F7D070] font-black flex items-center justify-center">
              {currentChat.avatar}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0D2B4D]">{currentChat.name}</h2>
              <p className="text-xs text-[#5B6776]">{currentChat.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#F7F9FB]/50">
            {currentChat.messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                    m.sender === "me"
                      ? "bg-[#174A7C] text-white rounded-br-none shadow-xs"
                      : "bg-white text-[#0D2B4D] border border-[#E6E9EF] rounded-bl-none shadow-xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#8E9BAA] mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Formulaire d'envoi */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#EDF1F6] bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Écrire un message"
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E6E9EF] text-xs bg-[#F7F9FB] focus:outline-none focus:border-[#174A7C]"
            />
            <button
              type="submit"
              aria-label="Envoyer le message"
              className="p-2.5 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
