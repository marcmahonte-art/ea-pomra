"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Upload,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ChevronDown,
  ArrowRight,
  Download,
  Send,
  ExternalLink,
} from "lucide-react";

export default function StudentDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [contactAntenneOpen, setContactAntenneOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col lg:flex-row font-sans">
      {/* 1. Sidebar Gauche */}
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
            {[
              { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
              { id: "dossier", label: "Mon dossier", icon: Folder },
              { id: "oco", label: "Orientation OCO", icon: Compass },
              { id: "pap", label: "Mes demandes PAP", icon: HeartHandshake },
              { id: "stss", label: "Transferts STSS", icon: ArrowLeftRight },
              { id: "documents", label: "Mes documents", icon: FileText },
              { id: "messages", label: "Messages", icon: MessageSquare, badge: "3" },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "calendrier", label: "Calendrier", icon: Calendar },
              { id: "profil", label: "Mon profil", icon: User },
              { id: "faq", label: "Aide & FAQ", icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#174A7C] text-white font-bold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#1EA362] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
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

      {/* 2. Zone Principale */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header supérieur */}
        <header className="bg-white border-b border-[#E6E9EF] px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <div className="relative">
              <button
                aria-label="2 notifications"
                className="w-10 h-10 rounded-full bg-[#F7F9FB] border border-[#E6E9EF] flex items-center justify-center text-[#0D2B4D] hover:bg-[#EBF3FA] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
              </button>
            </div>

            {/* Avatar & Identifiant */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#E6E9EF]">
              <div className="w-10 h-10 rounded-full bg-[#0D2B4D] text-[#F7D070] font-black flex items-center justify-center text-sm shadow-sm">
                KA
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#0D2B4D]">Koffi Amadou</div>
                <div className="text-[10px] text-[#8E9BAA] font-mono">
                  ID-POMRA : CI-2024-00125
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="p-6 sm:p-10 space-y-8 max-w-[1400px] w-full mx-auto">
          {/* Ligne 1 : Carte d'Identifiant & Avancement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Carte Identifiant (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft overflow-hidden flex flex-col sm:flex-row">
              {/* Côté sombre Identifiant */}
              <div className="bg-[#0D2B4D] text-white p-6 sm:p-7 sm:w-5/12 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    VOTRE IDENTIFIANT
                  </span>
                  <div className="text-xl font-black font-mono tracking-tight text-white">
                    CI-2024-00125
                  </div>
                  <span className="text-[11px] text-[#1EA362] font-semibold block">
                    Code ID-POMRA
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-2xl w-24 h-24 flex items-center justify-center shadow-inner">
                  {/* QR Code simulé haute fidélité */}
                  <div className="w-full h-full border-2 border-[#0D2B4D] rounded-lg p-1 grid grid-cols-3 gap-0.5">
                    <div className="bg-[#0D2B4D]"></div>
                    <div></div>
                    <div className="bg-[#0D2B4D]"></div>
                    <div></div>
                    <div className="bg-[#0D2B4D]"></div>
                    <div></div>
                    <div className="bg-[#0D2B4D]"></div>
                    <div></div>
                    <div className="bg-[#0D2B4D]"></div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-300 leading-tight">
                  Utilisez ce code pour toutes vos interactions officielles.
                </p>
              </div>

              {/* Côté clair Données */}
              <div className="p-6 sm:p-7 sm:w-7/12 grid grid-cols-2 gap-4 flex-1">
                <div>
                  <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                    Statut du dossier
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#1EA362] text-xs font-bold mt-1">
                    En cours
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                    Antenne
                  </span>
                  <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                    Côte d&apos;Ivoire
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                    Date d&apos;inscription
                  </span>
                  <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                    12 Mars 2024
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                    Programme visé
                  </span>
                  <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                    Licence en Informatique
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Avancement du parcours (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
                <h3 className="text-sm font-bold text-[#0D2B4D]">
                  Avancement de votre parcours
                </h3>
                <button
                  onClick={() => alert("Affichage complet du parcours académique.")}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Voir tout →
                </button>
              </div>

              {/* Stepper horizontal avec 4 étapes */}
              <div className="grid grid-cols-4 gap-2 pt-3 text-center">
                {/* Étape 1 */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#1EA362] text-white font-bold text-xs flex items-center justify-center mx-auto">
                    1
                  </div>
                  <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                    Dossier soumis
                  </div>
                  <div className="text-[10px] text-[#8E9BAA]">12/03/2024</div>
                </div>

                {/* Étape 2 */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center mx-auto ring-4 ring-[#EFF6FF]">
                    2
                  </div>
                  <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                    Étude OCO
                  </div>
                  <div className="text-[10px] text-[#2563EB] font-semibold">En cours</div>
                </div>

                {/* Étape 3 */}
                <div className="space-y-1.5 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mx-auto">
                    3
                  </div>
                  <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                    Orientation
                  </div>
                  <div className="text-[10px] text-[#8E9BAA]">À venir</div>
                </div>

                {/* Étape 4 */}
                <div className="space-y-1.5 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mx-auto">
                    4
                  </div>
                  <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                    Décision finale
                  </div>
                  <div className="text-[10px] text-[#8E9BAA]">À venir</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne 2 : Vue d'ensemble & Actions rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Vue d'ensemble (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-[#0D2B4D]">Vue d&apos;ensemble</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#0D2B4D]">7</div>
                    <div className="text-[10px] text-[#5B6776]">Documents soumis</div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#1EA362] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#0D2B4D]">2</div>
                    <div className="text-[10px] text-[#5B6776]">Étapes terminées</div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#0D2B4D]">1</div>
                    <div className="text-[10px] text-[#5B6776]">Étape en cours</div>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FDECEC] text-[#D9383A] flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#0D2B4D]">0</div>
                    <div className="text-[10px] text-[#5B6776]">Action en attente</div>
                  </div>
                </div>
              </div>

              {/* Statut de mon dossier (Timeline) */}
              <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
                  <h4 className="text-sm font-bold text-[#0D2B4D]">Statut de mon dossier</h4>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#1EA362] text-white flex items-center justify-center mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D2B4D]">
                          Dossier de candidature soumis
                        </div>
                        <div className="text-[11px] text-[#8E9BAA]">12 Mars 2024 à 14:30</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#1EA362]">
                      Terminé
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D2B4D]">
                          Étude par l&apos;Expert OCO
                        </div>
                        <div className="text-[11px] text-[#5B6776]">
                          Votre dossier est en cours d&apos;analyse par l&apos;expert OCO.
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                      En cours
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6] opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">
                        3
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D2B4D]">
                          Orientation proposée
                        </div>
                        <div className="text-[11px] text-[#8E9BAA]">
                          Orientation académique et établissement recommandé.
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F9FB] text-[#8E9BAA]">
                      À venir
                    </span>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start justify-between gap-3 opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">
                        4
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D2B4D]">
                          Décision finale BEC
                        </div>
                        <div className="text-[11px] text-[#8E9BAA]">
                          Validation finale et communication de la décision.
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F9FB] text-[#8E9BAA]">
                      À venir
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert("Redirection vers le détail complet du dossier.")}
                    className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir le détail de mon dossier</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions rapides & Notifications (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Actions rapides */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0D2B4D]">Actions rapides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Action 1 */}
                  <button
                    onClick={() => alert("Formulaire d'ajout d'un nouveau document.")}
                    className="p-4 rounded-2xl bg-[#EBF7F0]/60 border border-[#C5EBDA] text-left hover:bg-[#EBF7F0] transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-[#1EA362] flex items-center justify-center mb-2 shadow-xs">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Ajouter un document</div>
                    <div className="text-[11px] text-[#5B6776]">Joindre un nouveau document</div>
                  </button>

                  {/* Action 2 */}
                  <button
                    onClick={() => setContactAntenneOpen(true)}
                    className="p-4 rounded-2xl bg-[#EFF6FF]/60 border border-[#BFDBFE] text-left hover:bg-[#EFF6FF] transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-[#2563EB] flex items-center justify-center mb-2 shadow-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Contacter mon antenne</div>
                    <div className="text-[11px] text-[#5B6776]">Poser une question</div>
                  </button>

                  {/* Action 3 */}
                  <button
                    onClick={() => alert("Demande d'accompagnement psychosocial PAP initiée.")}
                    className="p-4 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] text-left hover:bg-[#FEF3C7] transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-[#D97706] flex items-center justify-center mb-2 shadow-xs">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Demander un accompagnement PAP</div>
                    <div className="text-[11px] text-[#5B6776]">Être accompagné</div>
                  </button>

                  {/* Action 4 */}
                  <button
                    onClick={() => alert("Ouverture du module de demande de virement sécurisé STSS.")}
                    className="p-4 rounded-2xl bg-[#F3E8FF]/60 border border-[#DDD6FE] text-left hover:bg-[#F3E8FF] transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-[#7C3AED] flex items-center justify-center mb-2 shadow-xs">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Demander un transfert STSS</div>
                    <div className="text-[11px] text-[#5B6776]">Effectuer une demande</div>
                  </button>
                </div>
              </div>

              {/* Notifications récentes */}
              <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
                  <h4 className="text-sm font-bold text-[#0D2B4D]">Notifications récentes</h4>
                  <button
                    onClick={() => alert("Consulter toutes les notifications.")}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Voir tout →
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                        Votre dossier est en cours d&apos;étude par l&apos;expert OCO.
                      </p>
                      <span className="text-[10px] text-[#8E9BAA]">Il y a 2 heures</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#1EA362] mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                        Document &quot;Relevé de notes&quot; approuvé.
                      </p>
                      <span className="text-[10px] text-[#8E9BAA]">Il y a 1 jour</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#D97706] mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                        Nouveau message de votre antenne.
                      </p>
                      <span className="text-[10px] text-[#8E9BAA]">Il y a 2 jours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne 3 : Ressources utiles & Carte d'illustration encouragement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 4 Ressources utiles (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-sm font-bold text-[#0D2B4D]">Ressources utiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Guide étudiant</div>
                    <div className="text-[10px] text-[#5B6776]">Télécharger le guide</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Présentation EA-POMRA</div>
                    <div className="text-[10px] text-[#5B6776]">Découvrir la plateforme</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF7F0] text-[#1EA362] flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Questions fréquentes</div>
                    <div className="text-[10px] text-[#5B6776]">Trouver des réponses</div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">Nous écrire</div>
                    <div className="text-[10px] text-[#5B6776]">Envoyer un message</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Encouragement & Aide (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft flex items-center justify-between gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#0D2B4D]">
                  Votre réussite, notre mission.
                </h4>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Nous sommes à vos côtés à chaque étape de votre parcours.
                </p>
                <button
                  onClick={() => setContactAntenneOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Besoin d&apos;aide ?
                </button>
              </div>

              <div className="relative w-28 h-28 shrink-0">
                <Image
                  src="/assets/logo-ea-pomra-round.png"
                  alt="EA-POMRA Réussite"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
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
                className="text-slate-400 hover:text-slate-600 font-bold"
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
                className="px-4 py-2 rounded-xl bg-[#0D2B4D] text-white font-bold text-xs"
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
