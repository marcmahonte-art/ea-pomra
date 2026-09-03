"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Compass,
  HeartHandshake,
  ArrowLeftRight,
  FileText,
  MessageSquare,
  Bell,
  Calendar,
  User,
  HelpCircle,
  Headphones,
  ChevronDown,
} from "lucide-react";

export default function EtudiantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [contactAntenneOpen, setContactAntenneOpen] = useState(false);

  const menuItems = [
    { href: "/etudiant/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/etudiant/dossier", label: "Mon dossier", icon: Folder },
    { href: "/etudiant/orientation", label: "Orientation OCO", icon: Compass },
    { href: "/etudiant/pap", label: "Mes demandes PAP", icon: HeartHandshake },
    { href: "/etudiant/stss", label: "Transferts STSS", icon: ArrowLeftRight },
    { href: "/etudiant/documents", label: "Mes documents", icon: FileText },
    { href: "/etudiant/messages", label: "Messages", icon: MessageSquare, badge: "3" },
    { href: "/etudiant/notifications", label: "Notifications", icon: Bell },
    { href: "/etudiant/calendrier", label: "Calendrier", icon: Calendar },
    { href: "/etudiant/profil", label: "Mon profil", icon: User },
    { href: "/etudiant/aide", label: "Aide & FAQ", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col lg:flex-row font-sans">
      {/* 1. Sidebar Gauche fixe */}
      <aside className="w-full lg:w-64 bg-[#0D2B4D] text-white flex flex-col justify-between shrink-0 p-5 border-r border-[#174A7C]/30 shadow-md">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shrink-0">
              <Image
                src="/assets/logo-ea-pomra-round.png"
                alt="Logo EA-POMRA"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">
                EA-POMRA
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                ÉTUDIER EN AFRIQUE
              </span>
            </div>
          </Link>

          {/* Badge Section */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1EA362] bg-[#1EA362]/15 px-3 py-1.5 rounded-lg border border-[#1EA362]/30">
            <span className="w-2 h-2 rounded-full bg-[#1EA362]"></span>
            <span>ESPACE ÉTUDIANT</span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 text-[13px] font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#174A7C] text-white font-bold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#1EA362]" : "text-slate-300"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#1EA362] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bas de sidebar : Support */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Headphones className="w-4 h-4 text-[#1EA362]" />
              <span>Besoin d&apos;aide ?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Contactez votre antenne locale pour toute question.
            </p>
            <button
              onClick={() => setContactAntenneOpen(true)}
              className="w-full py-2 rounded-xl bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              Contacter
            </button>
          </div>

          <Link
            href="/"
            className="block text-center text-xs text-slate-400 hover:text-white py-1"
          >
            ← Retour au site public
          </Link>
        </div>
      </aside>

      {/* 2. Zone Principale avec Header global */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header supérieur */}
        <header className="bg-white border-b border-[#E6E9EF] px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-2">
              Bonjour, Koffi Amadou <span>🖐️</span>
            </h1>
            <p className="text-xs text-[#5B6776] mt-0.5">
              Bienvenue dans votre espace étudiant EA-POMRA.
            </p>
          </div>

          {/* Profil & Antenne */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* Antenne Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F9FB] border border-[#E6E9EF] text-xs font-semibold text-[#0D2B4D]">
              <span className="text-base">🇨🇮</span>
              <div>
                <span className="text-[10px] text-[#8E9BAA] block leading-none">Antenne</span>
                <span className="font-bold">Côte d&apos;Ivoire</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Notifications */}
            <Link
              href="/etudiant/notifications"
              className="relative w-10 h-10 rounded-full bg-[#F7F9FB] border border-[#E6E9EF] flex items-center justify-center text-[#0D2B4D] hover:bg-[#EBF3FA] transition-colors"
              aria-label="2 notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Avatar & Identifiant */}
            <Link href="/etudiant/profil" className="flex items-center gap-3 pl-2 border-l border-[#E6E9EF]">
              <div className="w-10 h-10 rounded-full bg-[#0D2B4D] text-[#F7D070] font-black flex items-center justify-center text-sm shadow-sm">
                KA
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#0D2B4D]">Koffi Amadou</div>
                <div className="text-[10px] text-[#8E9BAA] font-mono">
                  ID-POMRA : CI-2024-00125
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Contenu de la sous-page */}
        <main className="p-6 sm:p-10 space-y-8 max-w-[1400px] w-full mx-auto flex-1">
          {children}
        </main>
      </div>

      {/* Modal Contact Antenne */}
      {contactAntenneOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E6E9EF]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h3 className="font-bold text-base text-[#0D2B4D]">Contacter l&apos;Antenne Côte d&apos;Ivoire</h3>
              <button
                onClick={() => setContactAntenneOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#5B6776]">
              <p><strong>Coordonnateur :</strong> Dr. Kouamé Brou</p>
              <p><strong>Téléphone :</strong> +225 07 88 12 45 90</p>
              <p><strong>Email :</strong> antenne.ci@ea-pomra.org</p>
              <p><strong>Adresse :</strong> Cocody Deux Plateaux, Boulevard des Martyrs, Abidjan</p>
            </div>
            <div className="pt-3 border-t border-[#EDF1F6] flex justify-end gap-2">
              <button
                onClick={() => setContactAntenneOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0D2B4D] text-white font-bold text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
