"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  HeartHandshake, 
  FolderCheck, 
  UserCircle2, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  Building
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";

interface StudentSidebarProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

export function StudentSidebar({ onTabChange, activeTab = "dashboard" }: StudentSidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "timeline", label: "Parcours & Dossier", icon: FileText },
    { id: "finances", label: "Finances & STSS", icon: CreditCard, badge: "Sécurisé" },
    { id: "pap", label: "Pôle PAP (Accompagnement)", icon: HeartHandshake, badge: "Actif" },
    { id: "documents", label: "Pièces Justificatives", icon: FolderCheck },
    { id: "parent", label: "Lien Espace Parent", icon: UserCircle2 },
  ];

  return (
    <aside className="w-64 bg-[#0D2B4D] text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-[#174A7C]/30 shadow-eap-dropdown">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20">
            <Image
              src="/assets/logo-ea-pomra-round.png"
              alt="EA-POMRA Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                EA-POMRA
              </span>
              <span className="text-[10px] bg-[#1EA362]/20 text-[#1EA362] px-1.5 py-0.5 rounded font-bold border border-[#1EA362]/30">
                ÉTUDIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Portail Panafricain</p>
          </div>
        </div>

        {/* Antenne & Identité Rapide */}
        <div className="mx-4 my-4 p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7D070]">
              Code ID-POMRA
            </span>
            <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
              {MOCK_ACTIVE_STUDENT.idPombra}
            </span>
          </div>
          <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
            <Building className="w-3.5 h-3.5 text-[#1EA362]" />
            <span>Antenne : <strong>Dakar ➡️ Abidjan</strong></span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#174A7C] text-white shadow-sm border border-white/15"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#F7D070]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      item.badge === "Sécurisé"
                        ? "bg-[#1EA362]/20 text-[#1EA362]"
                        : "bg-[#C89C2E]/20 text-[#F7D070]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-[#1EA362] shrink-0" />
          <span className="truncate">Scolarité certifiée STSS</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-2 py-1.5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Retour au site public</span>
        </Link>
      </div>
    </aside>
  );
}
