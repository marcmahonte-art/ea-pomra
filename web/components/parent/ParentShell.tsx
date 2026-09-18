"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  ArrowLeftRight,
  HeartHandshake,
  FileText,
  MessageSquare,
  Bell,
  User,
  HelpCircle,
  Headphones,
  ChevronDown,
} from "lucide-react";

/**
 * Coquille visuelle du portail Parent.
 *
 * Séparée de `app/parent/layout.tsx` pour la même raison que côté étudiant : ce
 * composant est interactif (route active, modale de contact) et doit donc être
 * un composant client, alors qu'un layout ne peut exporter des `metadata` que
 * s'il est un composant serveur.
 *
 * Les données du dossier arrivent **en props** et ne sont jamais importées ici.
 * C'est ce qui permet à `lib/parent-data.ts` de rester un module serveur et de
 * ne jamais expédier les notes confidentielles du suivi PAP au navigateur.
 */
export interface ParentShellProps {
  parentName: string;
  parentRelation: string;
  studentDisplayName: string;
  studentReference: string;
  studentInitials: string;
  hostCity: string;
  hostFlag: string;
  antenneCountry: string;
  antenneFlag: string;
  antennePhone: string;
  antenneEmail: string;
  /** Vrai tant que la session provient du jeu de démonstration. */
  isDemoSession: boolean;
  unreadMessages: number;
  unreadNotifications: number;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/parent", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/parent/parcours", label: "Parcours", icon: Compass },
  { href: "/parent/scolarite", label: "Scolarité", icon: GraduationCap },
  { href: "/parent/finances", label: "Finances & STSS", icon: ArrowLeftRight },
  { href: "/parent/pap", label: "Accompagnement", icon: HeartHandshake },
  { href: "/parent/documents", label: "Documents", icon: FileText },
  { href: "/parent/messages", label: "Messages", icon: MessageSquare },
  { href: "/parent/notifications", label: "Notifications", icon: Bell },
  { href: "/parent/profil", label: "Mon profil", icon: User },
  { href: "/parent/aide", label: "Aide & FAQ", icon: HelpCircle },
] as const;

/** Navigation réduite pour la barre inférieure mobile — cinq cibles maximum. */
const MOBILE_NAV_ITEMS = [
  { href: "/parent", label: "Accueil", icon: LayoutDashboard },
  { href: "/parent/parcours", label: "Parcours", icon: Compass },
  { href: "/parent/scolarite", label: "Scolarité", icon: GraduationCap },
  { href: "/parent/finances", label: "Finances", icon: ArrowLeftRight },
  { href: "/parent/pap", label: "Suivi", icon: HeartHandshake },
] as const;

/**
 * `/parent` est préfixe de toutes les autres routes : une comparaison par
 * `startsWith` l'activerait sur chaque page. D'où le cas particulier.
 */
function isRouteActive(href: string, pathname: string): boolean {
  if (href === "/parent") return pathname === "/parent";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ParentShell({
  parentName,
  parentRelation,
  studentDisplayName,
  studentReference,
  studentInitials,
  hostCity,
  hostFlag,
  antenneCountry,
  antenneFlag,
  antennePhone,
  antenneEmail,
  isDemoSession,
  unreadMessages,
  unreadNotifications,
  children,
}: ParentShellProps) {
  const pathname = usePathname();
  const [contactOpen, setContactOpen] = useState(false);

  const badges: Record<string, number> = {
    "/parent/messages": unreadMessages,
    "/parent/notifications": unreadNotifications,
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-jakarta flex flex-col lg:flex-row">
      {/* 1. Barre latérale — 248 px (spécification §13) */}
      <aside
        className="w-full lg:w-[248px] shrink-0 bg-[#0D2B4D] text-white flex flex-col justify-between p-5 lg:sticky lg:top-0 lg:h-screen"
        style={{ zIndex: "var(--eap-z-sticky)" }}
      >
        <div className="space-y-6">
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

          <div className="flex items-center gap-2 text-xs font-semibold text-[#F7D070] bg-[#F7D070]/10 px-3 py-1.5 rounded-lg border border-[#F7D070]/30">
            <span className="w-2 h-2 rounded-full bg-[#F7D070]" />
            <span>ESPACE PARENT</span>
          </div>

          <nav aria-label="Navigation principale" className="space-y-1 text-[13px] font-medium">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href, pathname);
              const badge = badges[item.href];

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                    active
                      ? "bg-[#174A7C] text-white font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-[#F7D070]" : "text-slate-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </span>
                  {badge ? (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#F7D070] text-[#0D2B4D] text-[11px] font-bold flex items-center justify-center">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Headphones className="w-4 h-4 text-[#F7D070]" />
              <span>Une question ?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Votre antenne {antenneCountry} est votre interlocuteur de proximité.
            </p>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="w-full py-2 rounded-xl bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-semibold transition-colors"
            >
              Contacter l&apos;antenne
            </button>
          </div>

          {/* Mention de transparence : tant que l'authentification n'existe pas,
              il serait trompeur de laisser croire à un espace sécurisé. */}
          {isDemoSession ? (
            <p className="text-[10px] leading-tight text-[#F7D070]/80 bg-[#F7D070]/10 border border-[#F7D070]/20 rounded-lg px-3 py-2">
              Environnement de démonstration — données fictives, accès non
              authentifié.
            </p>
          ) : null}

          <Link
            href="/"
            className="block text-center text-xs text-slate-400 hover:text-white py-1"
          >
            ← Retour au site public
          </Link>
        </div>
      </aside>

      {/* 2. Zone principale */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* En-tête — 76 px (spécification §13) */}
        <header
          className="bg-white border-b border-[#E6E9EF] px-6 lg:px-8 h-auto lg:h-[76px] py-4 lg:py-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-0"
          style={{ zIndex: "var(--eap-z-dropdown)" }}
        >
          <div className="min-w-0">
            {/* Salutation en <p> : le <h1> doit rester le titre de la page,
                sans quoi un lecteur d'écran annoncerait « Bonjour, … » au lieu
                du sujet réel. */}
            <p className="text-xl font-extrabold text-[#0D2B4D] tracking-tight truncate">
              Bonjour, {parentName}
            </p>
            <p className="text-xs text-[#5B6776] mt-0.5">
              Vous suivez le dossier de {studentDisplayName} — {parentRelation}.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 self-start lg:self-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F9FB] border border-[#E6E9EF] text-xs font-semibold text-[#0D2B4D]">
              <span className="text-base">{hostFlag}</span>
              <div>
                <span className="text-[10px] text-[#8E9BAA] block leading-none">
                  Ville d&apos;accueil
                </span>
                <span className="font-bold">{hostCity}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            <Link
              href="/parent/notifications"
              className="relative w-10 h-10 rounded-full bg-[#F7F9FB] border border-[#E6E9EF] flex items-center justify-center text-[#0D2B4D] hover:bg-[#EBF3FA] transition-colors"
              aria-label={
                unreadNotifications > 0
                  ? `${unreadNotifications} notifications non lues`
                  : "Notifications"
              }
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              ) : null}
            </Link>

            <Link
              href="/parent/profil"
              className="flex items-center gap-3 pl-3 border-l border-[#E6E9EF]"
            >
              <div className="w-10 h-10 rounded-full bg-[#0D2B4D] text-[#F7D070] font-black flex items-center justify-center text-sm">
                {studentInitials}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-[#0D2B4D]">
                  {studentDisplayName}
                </div>
                <div className="text-[10px] text-[#8E9BAA] font-mono">
                  Dossier {studentReference}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Contenu — padding 32 px, conteneur 1184 px (spécification §13).
            Le padding bas est élargi sur mobile pour que la barre de navigation
            inférieure ne recouvre jamais le dernier élément de la page. */}
        <main className="flex-1 w-full px-5 py-6 sm:px-8 sm:py-8 pb-24 lg:pb-8">
          <div className="mx-auto w-full max-w-[1184px] space-y-6">{children}</div>
        </main>
      </div>

      {/* 3. Barre de navigation inférieure — mobile uniquement */}
      <nav
        aria-label="Navigation mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E6E9EF] grid grid-cols-5"
        style={{ zIndex: "var(--eap-z-sticky)" }}
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold ${
                active ? "text-[#174A7C]" : "text-[#8E9BAA]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. Modale de contact de l'antenne */}
      {contactOpen ? (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: "var(--eap-z-modal)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-antenne-titre"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E6E9EF]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h2
                id="contact-antenne-titre"
                className="font-bold text-base text-[#0D2B4D]"
              >
                Antenne {antenneCountry}
              </h2>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                aria-label="Fermer"
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#5B6776]">
              <p>
                <strong className="text-[#0D2B4D]">Téléphone :</strong>{" "}
                <a href={`tel:${antennePhone.replace(/\s/g, "")}`} className="hover:underline">
                  {antennePhone}
                </a>
              </p>
              <p>
                <strong className="text-[#0D2B4D]">Email :</strong>{" "}
                <a href={`mailto:${antenneEmail}`} className="hover:underline">
                  {antenneEmail}
                </a>
              </p>
            </div>

            <div className="pt-3 border-t border-[#EDF1F6] flex justify-end">
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0D2B4D] text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
