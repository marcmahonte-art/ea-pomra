"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, Clock, AlertCircle, ShieldCheck, Check } from "lucide-react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Avis d'orientation favorable",
      desc: "Le comité OCO a rendu un avis favorable sur votre projet académique pour l'INP-HB.",
      time: "Il y a 2 heures",
      read: false,
      type: "info",
    },
    {
      id: 2,
      title: "Document approuvé",
      desc: "Vos relevés de notes de Licence ont été validés et certifiés conformes par l'antenne de Dakar.",
      time: "Il y a 1 jour",
      read: false,
      type: "success",
    },
    {
      id: 3,
       title: "Simulation STSS affichée",
       desc: "Le scénario de frais de scolarité est affiché pour illustration. Aucun reçu réel n'est disponible.",
      time: "Il y a 2 jours",
      read: true,
      type: "success",
    },
    {
      id: 5,
      title: "Synchronisation Espace Parent",
      desc: "Votre parent M. Ibrahima Traoré a consulté le statut de votre inscription.",
      time: "Il y a 1 semaine",
      read: true,
      type: "info",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const displayedNotifs = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Notifications</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#174A7C]" />
            Centre de Notifications
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E6E9EF] text-[#0D2B4D] hover:bg-[#F7F9FB] text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Check className="w-4 h-4 text-[#1EA362]" />
          <span>Tout marquer comme lu</span>
        </button>
      </div>

      {/* Onglets Filtres */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === "all" ? "bg-[#0D2B4D] text-white" : "bg-white border border-[#E6E9EF] text-[#5B6776]"
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === "unread" ? "bg-[#0D2B4D] text-white" : "bg-white border border-[#E6E9EF] text-[#5B6776]"
          }`}
        >
          Non lues ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft divide-y divide-[#EDF1F6]">
        {displayedNotifs.map((n) => (
          <div key={n.id} className="py-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === "success"
                    ? "bg-[#E8F6EF] text-[#1EA362]"
                    : "bg-[#EBF3FA] text-[#3B82F6]"
                }`}
              >
                {n.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0D2B4D]">{n.title}</h3>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                  )}
                </div>
                <p className="text-xs text-[#5B6776] mt-0.5 leading-relaxed">{n.desc}</p>
                <span className="text-[10px] text-[#8E9BAA] mt-1 block">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
