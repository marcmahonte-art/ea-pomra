"use client";

import React, { useState } from "react";
import { Bell, ShieldCheck, HeartHandshake, PhoneCall, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_ACTIVE_STUDENT, MOCK_NOTIFICATIONS } from "@/lib/data";

interface StudentHeaderProps {
  onOpenNotifications?: () => void;
  onEmergencyPap?: () => void;
}

export function StudentHeader({ onOpenNotifications, onEmergencyPap }: StudentHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-[#E6E9EF] px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-eap-soft">
      {/* Salutation & Fil d'ariane */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5B6776] mb-0.5">
          <span>Espace Étudiant</span>
          <span>•</span>
          <span className="text-[#174A7C] font-bold">Année {MOCK_ACTIVE_STUDENT.academicYear}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-[#0D2B4D] tracking-tight">
            Bonjour, {MOCK_ACTIVE_STUDENT.firstName} 👋
          </h1>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            STSS Validé
          </Badge>
        </div>
      </div>

      {/* Actions Droite */}
      <div className="flex items-center gap-3 relative">
        {/* Bouton Contact Urgent PAP */}
        <Button
          variant="outline"
          size="sm"
          onClick={onEmergencyPap}
          className="hidden md:inline-flex gap-2 text-[#C89C2E] border-[#F4E4BC] bg-[#FBF6EA] hover:bg-[#F7EDD2]"
        >
          <HeartHandshake className="w-4 h-4 text-[#C89C2E]" />
          <span>Contacter ma référente PAP</span>
        </Button>

        {/* Cloche Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[#F0F5FA] hover:bg-[#E6E9EF] text-[#0D2B4D] flex items-center justify-center transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D9383A] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Menu déroulant des notifications */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-eap-dropdown border border-[#E6E9EF] p-4 z-50 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
                <h4 className="font-bold text-sm text-[#0D2B4D]">Notifications</h4>
                <span className="text-xs text-[#174A7C] font-semibold">{unreadCount} non lues</span>
              </div>
              <div className="divide-y divide-[#EDF1F6] max-h-72 overflow-y-auto mt-2">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2B4D]">{notif.title}</span>
                      <span className="text-[10px] text-[#8E9BAA]">{notif.date}</span>
                    </div>
                    <p className="text-xs text-[#5B6776] leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#EDF1F6] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#174A7C] hover:underline"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profil Mini Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E6E9EF]">
          <div className="w-10 h-10 rounded-xl bg-[#0D2B4D] text-[#F7D070] font-black flex items-center justify-center text-sm shadow-sm">
            MT
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#0D2B4D]">
              {MOCK_ACTIVE_STUDENT.firstName} {MOCK_ACTIVE_STUDENT.lastName}
            </div>
            <div className="text-[10px] text-[#8E9BAA] font-mono">
              {MOCK_ACTIVE_STUDENT.idPombra}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
